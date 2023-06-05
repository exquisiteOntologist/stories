// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod background;
pub use background::*;

pub mod commands;
pub use commands::*;

#[tokio::main]
async fn main() {
    _ = chirp::db::db_init();
    println!("finished db init");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::collections::get_collection,
            commands::collections::get_collection_settings,
            commands::collections::set_collection_settings,
            commands::content::list_content,
            commands::sources::add_source,
            commands::sources::list_sources,
            commands::sources::remove_sources,
        ])
        .setup(|_app| {
            // if it can't spawn due to lack of send due to bug in chirp most likely
            tokio::spawn(continual_updates());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

