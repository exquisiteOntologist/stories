use std::error::Error;
use rusqlite::Result;
use crate::db::{db_source_add, db_content_add, db_source_get_id, db_source_retrievals_add, db_source_retrievals_update_success, db_source_add_data, db_source_get};
use crate::entities::{FullContent, Source};
use crate::feed::feed_fetch;

pub async fn source_add_cli(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"add\" you also need to provide a source URL");
        return Ok(());
    }

    let url = &args[2];

    let mut other_param = &String::new();
    if args.len() == 4 {
        other_param = &args[3];
    };

    source_add(url, other_param, &0).await?;

    Ok(())
}

pub async fn source_add(url: &String, other_param: &String, collection_id: &i32) -> Result<Source, Box<dyn Error>> {
    println!("Adding source \"{}\"", url);

    let feed_result = feed_fetch(0, url.to_owned(), &other_param).await;

    if let Err(err) = feed_result {
        // _ = db_log_add(err.to_string().as_str()); // already logged in feed_fetch
        println!("Could not add feed {:?}", url);
        return Err(err);
    }

    let (source, feed_contents) = feed_result.unwrap();

    db_source_add(&source, collection_id)?;

    let source_id_res = db_source_get_id(&source);
    if source_id_res.is_err() {
        println!("Could not save feed to DB");
    }

    let source_id = source_id_res?;

    db_source_add_data(&source, &source_id)?;

    db_source_retrievals_add(&source_id)?;

    let mut dc_items: Vec<FullContent> = vec![];

    // Duplicate each of the contents, setting the Source ID from the newly added source's retrieved ID
    for fc_item in feed_contents {
        let mut c = fc_item.content.clone();
        c.source_id = source_id;

        let dc_item = FullContent {
            content: c,
            content_body: fc_item.content_body,
            content_media: fc_item.content_media
        };

        dc_items.push(dc_item);
    }

    db_content_add(dc_items).unwrap();
    db_source_retrievals_update_success(&source_id)?;

    println!("finished adding source {:?}", source.name);

    let source = db_source_get(&source_id)?;

    Ok(source)
}
