use std::error::Error;

use rusqlite::{Connection, Params};

use super::db_connect;

pub struct Cuter {
    pub conn: Connection,
}

/// Cuter executes queries and prints errors with details
impl Cuter {
    pub fn new() -> Self {
        let Ok(conn) = db_connect() else {
            // DB file doesn't exist or cannot be accessed
            panic!("No DB file exists, was not able to create one");
        };

        Self { conn }
    }

    pub fn execute(&self, sql: &str) -> Result<(), Box<dyn Error>> {
        match self.conn.execute(sql, ()) {
            Ok(_v) => Ok(()),
            Err(e) => {
                eprintln!("Error executing SQL query");
                eprintln!("Query:");
                eprint!("{:?}\n", sql);
                eprintln!("Error:");
                eprint!("{:?}\n", e);

                Err(e.into())
            }
        }
    }

    pub fn execute_params<P>(&self, sql: &str, params: P) -> Result<(), Box<dyn Error>>
    where
        P: Params,
    {
        match self.conn.execute::<P>(sql, params) {
            Ok(_v) => Ok(()),
            Err(e) => {
                eprintln!("Error executing SQL query");
                eprintln!("Query:");
                eprint!("{:?}\n", sql);
                eprintln!("Error:");
                eprint!("{:?}\n", e);

                Err(e.to_string().into())
            }
        }
    }
}
