#[tauri::command]
pub fn search(search_phrase: String) -> Result<chirp::entities::SearchResultsDto, String> {
    match chirp::actions::search::search(&search_phrase) {
        Ok(v) => Ok(v),
        Err(e) => {
            eprintln!("Failed to search for {:?}", &search_phrase);
            eprint!("\nerror: {:?}\n", e.to_string());
            Err("Failed to search".to_string())
        }
    }
}
