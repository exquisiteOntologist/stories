use std::error::Error;

use chirp::entities::{self, ContentDto};

#[tauri::command]
pub async fn mark_add(content_id: i32) -> Result<(), String> {
    println!("Adding mark {:?}", content_id);

    chirp::actions::mark::mark_add(&content_id);

    Ok(())
}

#[tauri::command]
pub async fn mark_remove(content_id: i32) -> Result<(), String> {
    println!("Removing mark {:?}", content_id);

    chirp::actions::mark::mark_remove(&content_id);

    Ok(())
}

#[tauri::command]
pub fn list_marks_of_sources(source_ids: Vec<i32>) -> Result<Vec<ContentDto>, String> {
    todo!("Fetch a list of marks");

    // let marks = db_list_content_of_sources(source_ids)?;
    let marks = Vec::new();

    Ok(marks)
}
