use crate::{db::search::db_search, entities::SearchResultsDto};
use rusqlite::Result;
use std::error::Error;

pub fn search_cli(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"search\" you need to also provide a query");
        println!("Plus, also escape special chars with backslash");
        return Ok(());
    }

    let user_query = &args[2..].join(" ");
    print!("Searching for {:?}\n\n", user_query);

    let results = match db_search(user_query) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to search for {:?}", &user_query);
            return Err(e);
        }
    };

    println!("collections {:?}", &(results.collections).len());
    println!("sources {:?}", &(results.sources).len());
    println!("contents {:?}", &(results.contents).len());
    print!("\n");

    _ = &(results.collections)
        .into_iter()
        .for_each(|c| println!("collection {:1}:     \"{:2}\"\n", c.id, c.name));
    _ = &(results.sources)
        .into_iter()
        .for_each(|s| println!("source {:1}:     \"{:2}\"\n", s.id, s.name));

    print!("\n");
    println!("Use view {{Result ID}} to view ");

    Ok(())
}

pub fn search(search_phrase: &String) -> Result<SearchResultsDto, Box<dyn Error>> {
    // eventually the interface may have additional fields
    db_search(search_phrase)
}
