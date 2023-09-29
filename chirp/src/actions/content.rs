use std::error::Error;

use crate::{
    db::{db_content_bodies, db_list_content, db_list_content_of_sources, db_list_content_full},
    entities::{self},
};

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

pub fn list_content_of_sources(
    source_ids: &Vec<i32>,
) -> Result<Vec<entities::Content>, Box<dyn Error>> {
    let content_list = db_list_content_of_sources(source_ids)?;

    Ok(content_list)
}

pub fn list_content_full(
    source_ids: &Vec<i32>,
) -> Result<Vec<entities::FullContent>, Box<dyn Error>> {
    let content_list_full = db_list_content_full(source_ids)?;

    Ok(content_list_full)
}

pub fn content_bodies(
    content_ids: Vec<String>,
) -> Result<Vec<entities::ContentBody>, Box<dyn Error>> {
    let bodies: Vec<entities::ContentBody> = db_content_bodies(content_ids)?;

    Ok(bodies)
}
