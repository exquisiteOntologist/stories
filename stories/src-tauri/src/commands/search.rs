
#[tauri::command]
pub fn search(search_phrase: String) -> Result<chirp::entities::SearchResultsDto, String> {
    let results_res = chirp::actions::search::search(&search_phrase);

    if let Err(e) = results_res {
        return Err("Failed to search".into());
    }

    let results = results_res.unwrap();

    Ok(results)
}
