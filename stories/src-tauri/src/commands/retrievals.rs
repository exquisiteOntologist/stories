#[tauri::command]
pub fn retrievals_is_updating() -> Result<bool, String> {
    match chirp::actions::retrievals::action_retrievals_is_updating() {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string()),
    }
}
