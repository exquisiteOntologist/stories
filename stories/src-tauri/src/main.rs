// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use stories::{background::updates::continual_updates, commands};
use tauri::Manager;

#[tokio::main]
async fn main() {
    _ = chirp::db::init::db_init();

    tauri::async_runtime::set(tokio::runtime::Handle::current());
    tokio::task::spawn(continual_updates());

    tauri::Builder::default()
        // note that this plugin for window state does not work with current versions and setup (it did before migration)
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_http::init())
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
        .setup(|app| {
            // let main_window = app.get_window("main").unwrap();
            // main_window.with_webview(|webview| {
            //     webview.controller().set_zoom_level
            // });
            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                // for (hash, ww) in window.webview_windows() {
                //     ww.
                // }
                #[cfg(not(target_os = "macos"))]
                {
                    window.hide().unwrap();
                }
                #[cfg(target_os = "macos")]
                {
                    // this hiding works when windowed,
                    // however when fullscreen it doesn't hide
                    tauri::AppHandle::hide(&window.app_handle()).unwrap();
                }
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
