use std::{env, error::Error};
use rusqlite::{Result};

pub async fn take_command() -> Result<(), Box<dyn Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        intro()?;
        return Ok(());
    }

    if env::var("DEV").is_ok() {
        // for arg in args.clone() {
        //     println!("Argument \"{}\"", arg);
        // }
    }

    match args[1].as_str() {
        "help" => intro(),
        "add" => source_add(args).await,
        "remove" => source_remove(args),
        "rename" => todo!(),
        "sources" => list_sources(),
        "articles" => todo!(),
        "update" => update().await,
        "search" => search(args),
        "search_entity" => todo!(),
        "find_in_catalogue" => todo!(),
        "view" => view_content(args).await, // visit URL by C ID
        _ => intro(),
    }?;

    Ok(())
}

pub mod intro;
pub use intro::*;

pub mod add;
pub use add::*;

pub mod remove;
pub use remove::*;

pub mod update;
pub use update::*;

pub mod search;
pub use search::*;

pub mod sources;
pub use sources::*;

pub mod view;
pub use view::*;