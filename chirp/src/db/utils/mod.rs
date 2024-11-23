use std::{fs, path::Path, rc::Rc};

use directories::ProjectDirs;
use rusqlite::{types::Value, Connection, OpenFlags};

pub mod cuter;

pub fn db_create_directory() {
    let data_dir = db_dir_path_get();
    let path = data_dir.data_local_dir();
    fs::DirBuilder::new().recursive(true).create(path).unwrap()
}

pub fn db_connect() -> Result<Connection, rusqlite::Error> {
    let path = db_file_path_get().unwrap();
    let db_path = Path::new(&path);

    // https://github.com/rusqlite/rusqlite#usage
    match Connection::open(db_path) {
        Ok(conn) => Ok(conn),
        Err(e) => {
            eprint!("DB connection failed: {:?}\n{:?}\n", e, path);
            return Err(e);
        }
    }
}

pub fn db_dir_path_get() -> ProjectDirs {
    ProjectDirs::from("com", "stories", "data").unwrap()
}

pub fn db_file_path_get() -> Result<String, Box<()>> {
    // "com.stories.data" same as "CFBundleIdentifier"
    let project_dirs = db_dir_path_get();

    // a lot of lifetime problems make the code inelegant
    let dirs = project_dirs;
    let dir = dirs.data_local_dir();
    let buf = dir.join("stories.db");
    let p = buf.to_str().unwrap();

    // println!("DB Path: {:?}", p);

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
