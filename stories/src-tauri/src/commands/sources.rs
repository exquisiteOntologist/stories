#[tauri::command]
pub fn list_sources() -> Vec<chirp::entities::Source> {
    chirp::actions::sources::list_sources().unwrap()
}
