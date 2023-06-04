
#[tauri::command]
pub fn list_sources() -> Vec<chirp::entities::SourceDto> {
    let sources = chirp::actions::sources::list_sources().unwrap();
    let s_dtos: Vec<chirp::entities::SourceDto> = sources.into_iter().map(|s| source_to_dto(s)).collect();
    s_dtos
}

#[tauri::command]
pub async fn add_source(_collection_ids: Vec<i32>, source_url: String, additional_param: String) -> Result<chirp::entities::SourceDto, String> {
    let s_res = chirp::actions::add::source_add(&source_url, &additional_param).await;
    if s_res.is_err() {
        return Err("Cannot add source".into());
    }
    let s_dto: chirp::entities::SourceDto = source_to_dto(s_res.unwrap());

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

#[tauri::command]
pub fn remove_sources(collection_id: i32, source_ids: Vec<i32>) -> Result<(), String> {
    let rm_res = chirp::actions::sources_remove(&collection_id, &source_ids);
    if rm_res.is_err() {
        return Err("Unable to remove some sources".into());
    }

    Ok(())
}
