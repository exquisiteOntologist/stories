use chirp::entities::ContentDto;

#[tauri::command]
pub fn list_content() -> Result<Vec<ContentDto>, ()> {
    let c = chirp::actions::content::list_content().unwrap();
    let c_dto = c.into_iter().map(|c| ContentDto {
        id: c.id,
        source_id: c.source_id,
        title: c.title,
        url: c.url,
        date_published: c.date_published.to_string(),
        date_retrieved: c.date_retrieved.to_string()
    }).collect();

    Ok(c_dto)
}
