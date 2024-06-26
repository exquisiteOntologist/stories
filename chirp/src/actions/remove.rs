use crate::db::source::db_sources_remove;
use rusqlite::Result;
use std::error::Error;

pub fn source_remove_action(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    // This is the original source remove for CLI that completely deletes the source
    if args.len() < 3 {
        println!("When using \"add\" you also need to provide a source ID");
        return Ok(());
    }

    let source_id: i32 = args[2].parse::<i32>().unwrap();
    db_sources_remove(&0, &vec![source_id])?;
    println!("Removed source {:?}", source_id);
    Ok(())
}

pub fn sources_remove(collection_id: &i32, source_ids: &Vec<i32>) -> Result<(), Box<dyn Error>> {
    // If in a collection, remove from collection
    // TODO: remove from collection
    // if not in a collection just delete the sources
    db_sources_remove(collection_id, source_ids)
}
