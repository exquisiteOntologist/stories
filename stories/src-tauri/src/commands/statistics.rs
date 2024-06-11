use chirp::entities::{GenericCount, TodayCount};

#[tauri::command]
pub fn today_content_count(collection_id: i32) -> Result<TodayCount, String> {
    match chirp::actions::statistics::action_today_content_count(&collection_id) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn today_phrases_count(collection_id: i32) -> Result<GenericCount, String> {
    match chirp::actions::statistics::action_today_phrases_count(&collection_id) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string()),
    }
}
