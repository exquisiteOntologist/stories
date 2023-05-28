use ::futures::future::join_all;
use std::error::Error;
use rusqlite::Result;

use crate::db::{db_content_add, db_sources_retrieve_outdated, db_source_retrievals_update_success, db_source_retrievals_update_failures, db_source_get_data_web_url_segment};
use crate::entities::{Source, SourceKind};
use crate::feed::feed_fetch;

pub async fn update() -> Result<(), Box<dyn Error + Send + Sync>> {
    println!("Updating content");
    
    let sources = db_sources_retrieve_outdated().unwrap();
    let sources_futures = sources.iter().map(|s| update_single_feed(s));

    // join_all(sources_futures).await;

    // sources_futures.for_each(async |f| f.await);

    for s in sources_futures {
        _ = s.await;
    }
    // sources_futures.for_each(|x| x.await)

    // for x in sources_futures {
    //     _ = x.await;
    // }

    Ok(())
}

pub async fn update_single_feed(source: &Source) -> Result<(), Box<dyn Error + Send + Sync>> {
    println!("Updating {:?}", source.url);    

    let fetch_other_param: String = match source.kind {
        SourceKind::RSS => String::new(),
        SourceKind::WEB => db_source_get_data_web_url_segment(&source.id).unwrap()
    };
    
    let res_f_fetch = feed_fetch(source.id, source.url.to_owned(), &fetch_other_param).await;
    if res_f_fetch.is_err() {
        db_source_retrievals_update_failures(&source.id).unwrap();
        return Err(res_f_fetch.unwrap_err());
    }
    
    let (_fetched_source, contents) = res_f_fetch?;
    let res_c_add = db_content_add(contents);
    if res_c_add.is_err() {
        db_source_retrievals_update_failures(&source.id).unwrap();
        return Err(res_c_add.unwrap_err());
    }    
    
    db_source_retrievals_update_success(&source.id).unwrap();

    println!("finished updating {:?}", source.name);

    Ok(())
}
