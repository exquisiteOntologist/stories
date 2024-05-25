use std::rc::Rc;

use directories::ProjectDirs;
use rusqlite::{types::Value, Connection};

pub fn db_connect() -> Result<Connection, rusqlite::Error> {
    let path = db_path_get().unwrap();

    // https://github.com/rusqlite/rusqlite#usage
    let conn = Connection::open(path);
    // if let Err(ref e) = conn {
    if let Err(e) = conn {
        eprint!("DB connection failed: {:?}\n", e);
        // return Err("DB connection failed");
        return Err(e);
    }
    Ok(conn.unwrap())
}

pub fn db_path_get() -> Result<String, Box<()>> {
    // "com.stories.dev" same as "CFBundleIdentifier"
    let project_dirs = ProjectDirs::from("com", "stories", "dev").unwrap();

    // a lot of lifetime problems make the code inelegant
    let dirs = project_dirs;
    let dir = dirs.data_local_dir();
    let buf = dir.join("stories.db");
    let p = buf.to_str().unwrap();

    println!("DB Path: {:?}", p);

    Ok(p.into())
}

pub fn load_rarray_table(conn: &Connection) -> Result<(), rusqlite::Error> {
    rusqlite::vtab::array::load_module(&conn) // <- Adds "rarray" table function
}

pub fn create_rarray_values<T>(values_vec: Vec<T>) -> Rc<Vec<Value>>
where
    T: From<T>,
    Value: From<T>,
{
    let values = values_vec
        .into_iter()
        .map(Value::from)
        .collect::<Vec<Value>>();
    let rc = Rc::new(values);

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
