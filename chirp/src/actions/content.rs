use std::error::Error;

use crate::{db::{db_list_content, db_list_content_full, db_content_bodies}, entities::{self}};

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

pub fn list_content_full_action() -> Result<(), Box<dyn Error>> {
    let content_list_full = list_content_full()?;

    for c in content_list_full {
        let id = c.content.id;
        let title = c.content.title;
        let url = c.content.url;
        let date = c.content.date_published;
        let media = c.content_media.first();
        let media_src = if media.is_some() {
            media.unwrap().src.clone()
        } else {
            " ".into()
        };
        println!("{id}: \"{title}\"");
        println!("  url: {url}");
        println!("  date: {date}");
        println!(" media: {media_src}")
    }

    Ok(())
}

pub fn list_content_full() -> Result<Vec<entities::FullContent>, Box<dyn Error>> {
    let content_list_full = db_list_content_full()?;

    Ok(content_list_full)
}

pub fn content_bodies(content_ids: Vec<String>) -> Result<Vec<entities::ContentBody>, Box<dyn Error>> {
    let bodies: Vec<entities::ContentBody> = db_content_bodies(content_ids)?;

    Ok(bodies)
}
