use chirp::entities::PhraseResult;

#[tauri::command]
pub fn collection_phrases_today(collection_id: i32) -> Result<Vec<PhraseResult>, String> {
    match chirp::actions::phrases::action_today_phrases(&collection_id) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string()),
    }
}
