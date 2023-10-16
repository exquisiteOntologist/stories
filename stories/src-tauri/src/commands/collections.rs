#[tauri::command]
pub fn add_collection(c_name: String, c_parent_id: i32) -> Result<(), String> {
    let c_res = chirp::actions::collections::collection_add(&c_name, &c_parent_id);

    if c_res.is_err() {
        return Err(format!("Cannot add collection {c_name} with given name").into());
    }

    Ok(())
}

#[tauri::command]
pub fn remove_collection(
    parent_collection_id: i32,
    collection_ids: Vec<i32>,
) -> Result<(), String> {
    let rm_res = chirp::actions::collection_remove(&parent_collection_id, &collection_ids);
    if rm_res.is_err() {
        return Err("Unable to remove some collections".into());
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
pub fn get_collection(
    collection_ids: Vec<i32>,
) -> Result<Vec<chirp::entities::Collection>, String> {
    let c_res = chirp::actions::collections::collection_get(&collection_ids);

    if c_res.is_err() {
        let num_ids = collection_ids.len();
        return Err(
            format!("It seems there was an issue retrieving the {num_ids} collections").into(),
        );
    }

    Ok(c_res.unwrap())
}

#[tauri::command]
pub fn get_collection_settings(
    collection_ids: Vec<i32>,
) -> Result<Vec<chirp::entities::CollectionSettings>, String> {
    let c_settings_res = chirp::actions::collections::collection_settings_get(&collection_ids);
    if c_settings_res.is_err() {
        return Err("Failed to retrieve collection settings".into());
    }

    Ok(c_settings_res.unwrap())
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
pub fn get_collection_to_collection(
    parent_ids: Vec<i32>,
) -> Result<Vec<chirp::entities::CollectionToCollection>, String> {
    let c_res = chirp::actions::collections::collection_to_collection_get(&parent_ids);

    if c_res.is_err() {
        return Err("Cannot get collection to collection".into());
    }

    Ok(c_res.unwrap())
}

#[tauri::command]
pub fn get_collection_to_source(
    collection_ids: Vec<i32>,
) -> Result<Vec<chirp::entities::CollectionToSource>, String> {
    let cs_res = chirp::actions::collections::collection_to_source_get(&collection_ids);

    if cs_res.is_err() {
        return Err("Cannot get collection to source".into());
    }

    Ok(cs_res.unwrap())
}
