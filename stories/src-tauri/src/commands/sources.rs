#[tauri::command]
pub fn list_sources(name: &str) -> Vec<chirp::db::Source> {
    chirp::actions::sources::list_sources
}
