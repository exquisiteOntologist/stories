use std::rc::Rc;

use rusqlite::{Connection, types::Value};

pub fn db_connect() -> Result<Connection, rusqlite::Error> {
    // https://github.com/rusqlite/rusqlite#usage
    Connection::open("./chirp.db")
}

pub fn load_rarray_table(conn: &Connection) -> Result<(), rusqlite::Error> {
    rusqlite::vtab::array::load_module(&conn) // <- Adds "rarray" table function
}

pub fn create_rarray_values<T>(values_vec: Vec<T>) -> Rc<Vec<Value>> where T: From<T>, Value: From<T> {
    let values = values_vec.into_iter().map(Value::from).collect::<Vec<Value>>();
    let rc= Rc::new(values);

    rc
}

pub fn db_query_as_like(user_query: &String) -> String {
    // Phrase can be anywhere in text & words can be split across text
    ["%", &user_query.replace(" ", "%"), "%"].join(&String::new())
}

pub fn db_query_as_like_exact(user_query: &String) -> String {
    // Phrase can be anywhere in text but needs same sequence
    ["%", &user_query, "%"].join(&String::new())
}
