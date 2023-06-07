

#[tauri::command]
pub fn add_collection(c_name: String, c_parent_id: i32) -> Result<(), String> {
    let c_res = chirp::actions::collections::collection_add(&c_name, &c_parent_id);

    if c_res.is_err() {
        return Err(format!("Cannot add collection {c_name} with given name").into());
    }

    Ok(())
}

#[tauri::command]
pub fn get_collection(collection_ids: Vec<i32>) -> Result<Vec<chirp::entities::Collection>, String> {
    let c = chirp::actions::collections::collection_get(&collection_ids).unwrap();

    Ok(c)
}

#[tauri::command]
pub fn get_collection_settings(collection_ids: Vec<i32>) -> Result<Vec<chirp::entities::CollectionSettings>, String> {
    println!("Getting settings {:?}", &collection_ids.first().unwrap());
    let c_settings = chirp::actions::collections::collection_settings_get(&collection_ids).unwrap();

    Ok(c_settings)
}

#[tauri::command]
pub fn set_collection_settings(cs: chirp::entities::CollectionSettings) -> Result<(), String> {
    // the struct argument's name must be the property in the object passed from Redux
    let s_res = chirp::actions::collections::collection_settings_set(&cs);

    if s_res.is_err() {
        return Err("Cannot add source".into());
    }

    Ok(())
}
