
#[tauri::command]
pub fn set_collection_settings(cs: chirp::entities::CollectionSettings) -> Result<(), String> {
    let bodies = chirp::actions::collections::collection_settings_set(&cs).unwrap();

    Ok(bodies)
}
