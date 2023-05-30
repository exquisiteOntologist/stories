use std::error::Error;

use crate::{db::db_list_content, entities};

pub fn list_content_action() -> Result<(), Box<dyn Error>> {
    let content_list = list_content()?;

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

pub fn list_content() -> Result<Vec<entities::Content>, Box<dyn Error>> {
    let content_list = db_list_content()?;

    Ok(content_list)
}

// pub async fn list_full_content() -> Result<Vec<entities::Contents>, Box<dyn Error>> {
//     // 
// }