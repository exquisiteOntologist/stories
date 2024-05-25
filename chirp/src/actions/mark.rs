use std::error::Error;

use crate::entities::{self};

pub async fn mark_add(content_id: &i32) -> Result<(), Box<dyn Error>> {
    println!("Adding mark {:?}", content_id);

    todo!("Add mark");

    Ok(())
}

pub fn list_marks_of_sources(
    source_ids: &Vec<i32>,
) -> Result<Vec<entities::Content>, Box<dyn Error>> {
    todo!("Fetch a list of marks");

    // let marks = db_list_content_of_sources(source_ids)?;
    let marks = Vec::new();

    Ok(marks)
}
