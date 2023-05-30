use chirp::entities::ContentDto;

#[tauri::command]
pub fn list_content() -> Result<Vec<ContentDto>, ()> {
    let fc_results = chirp::actions::content::list_content_full().unwrap();
    let c_dto = fc_results.into_iter().map(|fc| ContentDto {
        id: fc.content.id,
        source_id: fc.content.source_id,
        title: fc.content.title,
        url: fc.content.url,
        date_published: fc.content.date_published.to_string(),
        date_retrieved: fc.content.date_retrieved.to_string(),
        media: fc.content_media //.into_iter().map(|m| m.)
    }).collect();

    Ok(c_dto)
}
