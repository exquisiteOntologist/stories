use std::{error::Error, rc::Rc};
use rusqlite::{Connection, types::Value, Statement, Params};

use crate::entities::{CollectionSettings, Collection};

use super::db_connect;

pub fn db_map_collection_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<Collection>, Box<dyn Error>> {
	// assumes used a SELECT *
	let mapped_cs = s.query_map(p, |row| {
		Ok(Collection {
			id: row.get(0)?,
			name: row.get(1)?
		})
	})?;

	let collection_settings = mapped_cs.map(|x| x.unwrap()).collect::<Vec<Collection>>();

	Ok(collection_settings)
}

pub fn db_map_collection_settings_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<CollectionSettings>, Box<dyn Error>> {
	// assumes used a SELECT *
	let mapped_cs = s.query_map(p, |row| {
		Ok(CollectionSettings {
			id: row.get(0)?,
			collection_id: row.get(1)?,
			layout: row.get(2)?
		})
	})?;

	let collection_settings = mapped_cs.map(|x| x.unwrap()).collect::<Vec<CollectionSettings>>();

	Ok(collection_settings)
}

pub fn db_get_collection(collection_ids: &Vec<i32>) -> Result<Vec<Collection>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
	rusqlite::vtab::array::load_module(&conn)?; // <- Adds "rarray" table function

	let c_id_values = Rc::new(collection_ids.to_owned().into_iter().map(Value::from).collect::<Vec<Value>>());
	let params = [c_id_values];

    let mut c_query: Statement = conn.prepare(
		"SELECT * FROM collection WHERE id IN (SELECT * FROM rarray(?1))"
	)?;

    let c = db_map_collection_query(&mut c_query, params)?;

    Ok(c)
}

pub fn db_get_collection_settings(collection_ids: &Vec<i32>) -> Result<Vec<CollectionSettings>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
	rusqlite::vtab::array::load_module(&conn)?; // <- Adds "rarray" table function

	let c_id_values = Rc::new(collection_ids.to_owned().into_iter().map(Value::from).collect::<Vec<Value>>());
	let params = [c_id_values];

    let mut c_settings_query: Statement = conn.prepare(
        // using collection_id instead of id
		"SELECT * FROM collection_settings WHERE collection_id IN (SELECT * FROM rarray(?1))"
	)?;

    let c_settings = db_map_collection_settings_query(&mut c_settings_query, params)?;

    Ok(c_settings)
}

pub fn db_set_collection_settings(cs: &CollectionSettings) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    let res = match conn.execute(
        "UPDATE collection_settings
        SET layout = ?2
        WHERE collection_id = ?1;",
        (&cs.collection_id, &cs.layout)
    ) {
        Ok(updated) => {
            println!("{} settings were updated", updated);
            Ok(updated)
        },
        Err(err) => {
            println!("update failed: {}", err);
            Err(err)
        },
    };
    if res.is_err() {
        return Err(res.unwrap_err().into());
    }
    _ = conn.close();
    Ok(())
}
