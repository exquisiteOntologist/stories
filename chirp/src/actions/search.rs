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

    let results = db_search(user_query)?;

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
    _ = &(results.contents_match_titles)
        .into_iter()
        .for_each(|c| println!("title of {:1}:      \"{:2}\"\n", c.id, c.title));
    _ = &(results.contents_match_bodies)
        .into_iter()
        .for_each(|c: crate::entities::ContentDto| {
            println!("article of {:1}:      \"{:2}\"\n", c.id, c.title)
        });

    print!("\n");
    println!("Use view {{Result ID}} to view ");

    Ok(())
}

pub fn search(search_phrase: &String) -> Result<SearchResultsDto, Box<dyn Error>> {
    // eventually the interface may have additional fields
    db_search(search_phrase)
}
