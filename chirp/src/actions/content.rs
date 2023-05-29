use std::error::Error;

use crate::{db::db_list_content, entities};

pub async fn list_content_action() -> Result<(), Box<dyn Error>> {
    let content_list = list_content().await?;

    for c in content_list {
        let id = c.id;
        let title = c.title;
        let url = c.url;
        let date = c.date_published.to_string();

        println!("{id}: \"{title}\"");
        println!("  url: {url}");
        println!("  date: {date}");
    }

    Ok(())
}

pub async fn list_content() -> Result<Vec<entities::Content>, Box<dyn Error>> {
    let content_list = db_list_content().await?;

    Ok(content_list)
}
