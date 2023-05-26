use std::error::Error;
use rusqlite::Result;
use crate::db::{db_source_add, db_content_add, db_source_get_id, db_source_retrievals_add, db_source_retrievals_update_success, db_source_add_data};
use crate::entities::{Contents};
use crate::feed::feed_fetch;

pub async fn source_add(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"add\" you also need to provide a source URL");
        return Ok(());
    }

    let url = &args[2];

    let mut other_param = &String::new();
    if args.len() == 4 {
        other_param = &args[3];
    };

    println!("Adding source \"{}\"", url);

    let feed_result = feed_fetch(0, url.to_owned(), &other_param).await;

    if feed_result.is_err() {
        println!("Could not add feed");
        return Ok(());
    }

    let (source, feed_contents) = feed_result.unwrap();

    db_source_add(&source)?;
    
    let source_id_res = db_source_get_id(&source);
    if source_id_res.is_err() {
        println!("Could not save feed to DB");
    }
    
    let source_id = source_id_res?;

    db_source_add_data(&source, &source_id)?;
    
    db_source_retrievals_add(&source_id)?;
    
    let mut dc_items: Vec<Contents> = vec![];

    // Duplicate each of the contents, setting the Source ID from the newly added source's retrieved ID
    for fc_item in feed_contents {
        let mut c = fc_item.content.clone();
        c.source_id = source_id;
                
        let dc_item = Contents {
            content: c,
            content_body: fc_item.content_body,
            content_media: fc_item.content_media
        };
        
        dc_items.push(dc_item);
    }
    
    db_content_add(dc_items)?;
    db_source_retrievals_update_success(&source_id)?;
    
    println!("finished adding source {:?}", source.name);

    Ok(())
}
