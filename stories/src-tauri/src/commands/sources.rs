use chirp::entities::SourceDto;

#[tauri::command]
pub fn list_sources() -> Result<Vec<SourceDto>, String> {
    let sources_res = chirp::actions::sources::list_sources();

    if sources_res.is_err() {
        return Err(format!("Failed to list soures").into());
    }

    let sources = sources_res.unwrap();
    let s_dtos: Vec<SourceDto> = sources.into_iter().map(|s| source_to_dto(s)).collect();
    Ok(s_dtos)
}

#[tauri::command]
pub fn list_source_of_collections(collection_ids: Vec<i32>) -> Result<Vec<SourceDto>, String> {
    let sources_res = chirp::actions::sources::list_sources_of_collections(&collection_ids);

    if sources_res.is_err() {
        let num_ids = collection_ids.len();
        return Err(format!(
            "It seems there was an issue retrieving the sources of the {num_ids} collections"
        )
        .into());
    }

    let sources = sources_res.unwrap();
    let s_dtos: Vec<SourceDto> = sources.into_iter().map(|s| source_to_dto(s)).collect();
    Ok(s_dtos)
}

#[tauri::command]
pub async fn add_source(
    collection_id: i32,
    source_url: String,
    additional_param: String,
) -> Result<SourceDto, String> {
    let s_res =
        chirp::actions::add::source_add(&source_url, &additional_param, &collection_id).await;
    if s_res.is_err() {
        return Err("Cannot add source".into());
    }
    let s_dto: SourceDto = source_to_dto(s_res.unwrap());

    Ok(s_dto)
}

pub fn source_to_dto(s: chirp::entities::Source) -> SourceDto {
    SourceDto {
        id: s.id,
        name: s.name,
        url: s.url,
        site_url: s.site_url,
        kind: s.kind,
    }
}

#[tauri::command]
pub fn remove_sources(collection_id: i32, source_ids: Vec<i32>) -> Result<(), String> {
    let rm_res = chirp::actions::remove::sources_remove(&collection_id, &source_ids);
    if rm_res.is_err() {
        return Err("Unable to remove some sources".into());
    }

    Ok(())
}
