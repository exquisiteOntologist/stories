// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{time::Duration};

pub mod commands;
pub use commands::*;

async fn continual_updates() {
    // Repeatedly call update.
    // Updates are then performed on each individual source,
    // according to the time since source's last retrieval.
    let dur = Duration::from_secs(30);
    loop {
        println!("Before updates");
        _ = chirp::actions::update().await;
        println!("After updates");
        tokio::time::sleep(dur).await;
        println!("after sleep");
    }
}

#[tokio::main]
async fn main() {
    _ = chirp::db::db_init();
    println!("finished db init");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::greet::greet])
        .setup(|_app| {
            // if it can't spawn due to lack of send due to bug in chirp most likely
            tokio::spawn(continual_updates());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

