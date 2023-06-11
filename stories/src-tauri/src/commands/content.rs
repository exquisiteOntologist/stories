use chirp::entities::{ContentDto, ContentBody};

#[tauri::command]
pub fn list_content() -> Result<Vec<ContentDto>, ()> {
    let fc_results = chirp::actions::content::list_content_full().unwrap();
    let c_dto = fc_results.into_iter().map(full_content_to_content_dto).collect();

    Ok(c_dto)
}

#[tauri::command]
pub fn content_bodies(content_ids: Vec<String>) -> Result<Vec<ContentBody>, ()> {
    let bodies = chirp::actions::content::content_bodies(content_ids).unwrap();

    Ok(bodies)
}
