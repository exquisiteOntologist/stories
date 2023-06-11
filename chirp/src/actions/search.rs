use std::{error::Error};
use rusqlite::{Result};
use crate::{db::{db_search}, entities::SearchResultsDto};

pub fn search_cli(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"search\" you need to also provide a query");
        println!("Plus, also escape special chars with backslash");
        return Ok(());
    }

    let user_query = &args[2..].join(" ");
    print!("Searching for {:?}\n\n", user_query);

    let results = db_search(user_query)?;

    println!("sources {:?}", &(results.sources).len());
    println!("title {:?}", &(results.contents).len());
    println!("articles {:?}", &(results.bodies).len());
    print!("\n");

    _ = &(results.sources).into_iter().for_each(|s| println!("source {:1}:     \"{:2}\"\n", s.id, s.name));
    _ = &(results.contents).into_iter().for_each(|c| println!("title of {:1}:      \"{:2}\"\n", c.id, c.title));
    _ = &(results.bodies).into_iter().for_each(|c| println!("article of {:1}\n", c.content_id));
    
    print!("\n");
    println!("Use view {{Result ID}} to view ");

    Ok(())
}

pub fn search(search_phrase: &String) -> Result<SearchResultsDto, Box<dyn Error>> {
    // eventually the interface may have additional fields
    db_search(search_phrase)
}
