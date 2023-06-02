#[tauri::command]
pub fn list_sources() -> Vec<chirp::entities::SourceDto> {
    let sources = chirp::actions::sources::list_sources().unwrap();
    let s_dtos: Vec<chirp::entities::SourceDto> = sources.into_iter().map(|s| source_to_dto(s)).collect();
    s_dtos
}

#[tauri::command]
pub async fn add_source(_collection_ids: Vec<i32>, source_url: String, additional_param: String) -> Result<chirp::entities::SourceDto, ()> {
    let s: chirp::entities::Source = chirp::actions::add::source_add(&source_url, &additional_param).await.unwrap();
    let s_dto = source_to_dto(s);

    Ok(s_dto)
}

pub fn source_to_dto(s: chirp::entities::Source) -> chirp::entities::SourceDto {
    chirp::entities::SourceDto {
        id: s.id,
        name: s.name,
        url: s.url,
        site_url: s.site_url,
        kind: s.kind
    }
}

// #[tauri::command]
// pub fn add_sources_collection(source_urls: Vec<String>, collectionId: i32) -> Result<Vec<SourceDto>, ()> {
//     let sources: Vec<SourceDto> = chirp::actions::sources::add_source_to_collection(source_urls, collectionId).unwrap();

//     Ok(sources)
// }
