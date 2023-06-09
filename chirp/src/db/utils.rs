use rusqlite::Connection;

pub fn db_connect() -> Result<Connection, rusqlite::Error> {
    // https://github.com/rusqlite/rusqlite#usage
    Connection::open("./chirp.db")
}

pub fn load_rarray_table(conn: &Connection) -> Result<(), rusqlite::Error> {
    rusqlite::vtab::array::load_module(&conn) // <- Adds "rarray" table function
}

pub fn db_query_as_like(user_query: &String) -> String {
    // Phrase can be anywhere in text & words can be split across text
    ["%", &user_query.replace(" ", "%"), "%"].join(&String::new())
}

pub fn db_query_as_like_exact(user_query: &String) -> String {
    // Phrase can be anywhere in text but needs same sequence
    ["%", &user_query, "%"].join(&String::new())
}
