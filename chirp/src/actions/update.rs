use ::futures::future::join_all;
use chrono::{DateTime, Local};
use rusqlite::Result;
use std::error::Error;

use crate::db::{
    db_content_add, db_content_save_space, db_log_add, db_source_get_data_web_url_segment,
    db_source_retrievals_update_failures, db_source_retrievals_update_success,
    db_sources_retrieve_outdated,
};
use crate::entities::{Source, SourceKind};
use crate::feed::feed_fetch;

// The match expression in "actions.rs" not expecting "Send"
pub async fn update_action() -> Result<(), Box<dyn Error>> {
    _ = update().await;
    Ok(())
}

pub async fn update() -> Result<(), Box<dyn Error + Send + Sync>> {
    println!(
        "Updating content {:?}",
        Local::now().format("%Y-%m-%d %H:%M:%S").to_string()
    );

    let sources = db_sources_retrieve_outdated().unwrap();
    let sources_futures = sources.iter().map(|s| update_single_feed(s));

    join_all(sources_futures).await;

    Ok(())
}

pub async fn update_single_feed(source: &Source) -> Result<(), Box<dyn Error + Send + Sync>> {
    println!("Updating {:?}", source.url);

    let fetch_other_param: String = match source.kind {
        SourceKind::RSS => String::new(),
        SourceKind::WEB => db_source_get_data_web_url_segment(&source.id).unwrap(),
    };

    let res_f_fetch = feed_fetch(source.id, source.url.to_owned(), &fetch_other_param).await;
    if res_f_fetch.is_err() {
        db_source_retrievals_update_failures(&source.id).unwrap();
        return Err(res_f_fetch.unwrap_err());
    }

    let (_fetched_source, contents) = res_f_fetch?;
    let res_c_add = db_content_add(contents);
    if let Err(err) = res_c_add {
        _ = db_log_add(err.to_string().as_str());
        db_source_retrievals_update_failures(&source.id).unwrap();
        return Err(err);
    }

    db_source_retrievals_update_success(&source.id).unwrap();

    println!("finished updating {:?}", source.name);

    _ = db_content_save_space();

    Ok(())
}
