#[tauri::command]
pub fn today_content_count(collection_id: i32) -> Result<i32, String> {
    match chirp::actions::statistics::action_today_content_count(&collection_id) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string()),
    }
}
