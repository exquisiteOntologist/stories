

#[tauri::command]
pub fn add_collection(c_name: String, c_parent_id: i32) -> Result<(), String> {
    let c_res = chirp::actions::collections::collection_add(&c_name, &c_parent_id);

    if c_res.is_err() {
        return Err(format!("Cannot add collection {c_name} with given name").into());
    }

    Ok(())
}

#[tauri::command]
pub fn rename_collection(collection_id: i32, name: String) -> Result<(), String> {
    let c_res = chirp::actions::collections::collection_rename(&collection_id, &name);

    if c_res.is_err() {
        return Err(format!("Cannot change collection {collection_id} name").into());
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
    if collection_ids.is_empty() {
        return Err("No collection ids provided to fetch settings for".into());
    }
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

#[tauri::command]
pub fn get_collection_to_collection(parent_ids: Vec<i32>) -> Result<Vec<chirp::entities::CollectionToCollection>, String> {
    let c = chirp::actions::collections::collection_to_collection_get(&parent_ids).unwrap();

    Ok(c)
}

#[tauri::command]
pub fn get_collection_to_source(collection_ids: Vec<i32>) -> Vec<chirp::entities::CollectionToSource> {
    let collection_to_source = chirp::actions::collections::collection_to_source_get(&collection_ids).unwrap();
    println!("Collection to sources found {:?}", collection_to_source.clone().len());
    collection_to_source
}
