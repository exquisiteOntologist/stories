use chirp::entities::TodayCount;

#[tauri::command]
pub fn today_content_count(collection_id: i32) -> Result<TodayCount, String> {
    match chirp::actions::statistics::action_today_content_count(&collection_id) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string()),
    }
}
