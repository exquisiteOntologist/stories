

#[tauri::command]
pub fn get_collection(collection_ids: Vec<i32>) -> Result<Vec<chirp::entities::Collection>, String> {
    let c = chirp::actions::collections::collection_get(&collection_ids).unwrap();

    Ok(c)
}

#[tauri::command]
pub fn get_collection_settings(collection_ids: Vec<i32>) -> Result<Vec<chirp::entities::CollectionSettings>, String> {
    let c_settings = chirp::actions::collections::collection_settings_get(&collection_ids).unwrap();

    Ok(c_settings)
}

#[tauri::command]
pub fn set_collection_settings(cs: chirp::entities::CollectionSettings) -> Result<(), String> {
    chirp::actions::collections::collection_settings_set(&cs).unwrap();

    Ok(())
}
