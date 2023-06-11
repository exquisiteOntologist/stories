use std::{error::Error};
use rusqlite::{Result};
use crate::db::{db_search};

pub fn search_cli(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"search\" you need to also provide a query");
        println!("Plus, also escape special chars with backslash");
        return Ok(());
    }

    let user_query = &args[2..].join(" ");
    print!("Searching for {:?}\n\n", user_query);

    db_search(user_query)?;

    Ok(())
}
