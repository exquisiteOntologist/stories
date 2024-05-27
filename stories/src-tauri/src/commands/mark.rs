use chirp::entities::{ContentDto};

#[tauri::command]
pub async fn mark_add(content_id: i32) -> Result<(), String> {
    _ = chirp::actions::mark::mark_add(&content_id);
    Ok(())
}

#[tauri::command]
pub async fn mark_remove(content_id: i32) -> Result<(), String> {
    _ = chirp::actions::mark::mark_remove(&content_id);
    Ok(())
}

#[tauri::command]
pub fn list_marks_of_sources(source_ids: Vec<i32>) -> Result<Vec<ContentDto>, String> {
    let marks = chirp::actions::mark::marks_list(&source_ids);
    Ok(marks.unwrap())
}
