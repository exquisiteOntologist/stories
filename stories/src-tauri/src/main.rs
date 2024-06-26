// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use stories::{background::updates::continual_updates, commands};

#[tokio::main]
async fn main() {
    _ = chirp::db::init::db_init();
    println!("finished db init");

    tauri::Builder::default()
        // note that this plugin for window state does not work with current versions and setup (it did before migration)
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::greet::greet,
            commands::collections::add_collection,
            commands::collections::remove_collection,
            commands::collections::rename_collection,
            commands::collections::get_collection,
            commands::collections::get_collection_settings,
            commands::collections::set_collection_settings,
            commands::collections::get_collection_to_collection,
            commands::collections::get_collection_to_source,
            commands::content::list_content,
            commands::mark::mark_add,
            commands::mark::mark_remove,
            commands::mark::list_marks_of_sources,
            commands::phrases::collection_phrases_today,
            commands::retrievals::retrievals_is_updating,
            commands::sources::add_source,
            commands::sources::list_sources,
            commands::sources::list_source_of_collections,
            commands::sources::remove_sources,
            commands::statistics::today_content_count,
            commands::statistics::today_phrases_count,
            commands::search::search
        ])
        .setup(|_app| {
            // the spawned function and the functions that it calls must have the Send trait
            tokio::spawn(continual_updates());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
