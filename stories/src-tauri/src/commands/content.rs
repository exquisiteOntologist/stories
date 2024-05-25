use chirp::entities::{ContentBody, ContentDto};

#[tauri::command]
pub fn list_content(source_ids: Vec<i32>) -> Result<Vec<ContentDto>, String> {
    let fc_results = chirp::actions::content::list_content_full(&source_ids);

    if fc_results.is_err() {
        let num_ids = source_ids.len();
        return Err(format!("Failed to retrieve content for {num_ids}").into());
    }

    let fc = fc_results.unwrap();
    let c_dto = fc
        .into_iter()
        .map(chirp::entities::dto_maps::full_content_to_content_dto)
        .collect();

    Ok(c_dto)
}

#[tauri::command]
pub fn content_bodies(content_ids: Vec<String>) -> Result<Vec<ContentBody>, String> {
    let num_ids = content_ids.len();
    let bodies_results = chirp::actions::content::content_bodies(content_ids);

    if bodies_results.is_err() {
        return Err(format!("Failed to retrieve content bodies for {num_ids}").into());
    }

    let bodies = bodies_results.unwrap();
    Ok(bodies)
}
