use std::{error::Error};
use rusqlite::{Result};
use crate::db::{db_source_remove};

pub fn source_remove(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"add\" you also need to provide a source ID");
        return Ok(());
    }

    let source_id: i32 = args[2].parse::<i32>().unwrap();
    db_source_remove(&source_id)?;
    println!("Removed source {:?}", source_id);
    Ok(())
}
