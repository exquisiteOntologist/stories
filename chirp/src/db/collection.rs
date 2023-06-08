use std::{error::Error, rc::Rc};
use rusqlite::{Connection, types::Value, Statement, Params, params};

use crate::entities::{CollectionSettings, Collection, CollectionToCollection};

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

pub fn db_map_collection_to_collection_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<CollectionToCollection>, Box<dyn Error>> {
	// assumes used a SELECT *
	let mapped_cs = s.query_map(p, |row| {
		Ok(CollectionToCollection {
			collection_parent_id: row.get(0)?,
			collection_inside_id: row.get(1)?
		})
	})?;

	let c_to_c = mapped_cs.map(|x| x.unwrap()).collect::<Vec<CollectionToCollection>>();

	Ok(c_to_c)
}

pub fn db_collection_add(c_name: &String, c_parent_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;

    if let Err(e) = conn.execute(
        "INSERT INTO collection (name) VALUES (?1) 
                ON CONFLICT DO NOTHING;
            ",
        params![c_name]
    ) {
        println!("Error adding collection {:?}", e);
        return Err(e.into());
    };

    if let Err(e) = conn.execute(
        "INSERT INTO collection_to_collection (collection_parent_id, collection_inside_id) 
            VALUES (?1, (SELECT id FROM collection ORDER BY id DESC LIMIT 1));",
        params![&c_parent_id.to_string()]
    ) {
        println!("Error associating collections {:?}", e);
        return Err(e.into());
    };

    if let Err(e) = conn.execute(
        "INSERT INTO collection_settings (collection_id, layout) 
            VALUES ((SELECT id FROM collection ORDER BY id DESC LIMIT 1), 'ROWS');",
        params![]
    ) {
        println!("Error adding settings entry for new collection {:?}", e);
        return Err(e.into());
    };

	_ = conn.close();

	Ok(())
}

pub fn db_get_collection(collection_ids: &Vec<i32>) -> Result<Vec<Collection>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
	load_rarray_table(&conn)?;

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
	load_rarray_table(&conn)?;

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
    if let Err(e) = conn.execute(
        "UPDATE collection_settings
            SET layout = ?2
            WHERE collection_id = ?1;",
        (&cs.collection_id, &cs.layout)
    ) {
        println!("update failed: {}", e);
        return Err(e.into());
    };
    _ = conn.close();
    Ok(())
}

pub fn db_get_collection_to_collection(parent_ids: &Vec<i32>) -> Result<Vec<CollectionToCollection>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
	load_rarray_table(&conn)?;

	let c_id_values = Rc::new(parent_ids.to_owned().into_iter().map(Value::from).collect::<Vec<Value>>());
	let params = [c_id_values];

    let mut c_to_c_query: Statement = conn.prepare(
        // using collection_id instead of id
		"SELECT * FROM collection_to_collection WHERE collection_parent_id IN (SELECT * FROM rarray(?1))"
	)?;

    let c_to_c = db_map_collection_to_collection_query(&mut c_to_c_query, params)?;

    Ok(c_to_c)
}

pub fn load_rarray_table(conn: &Connection) -> Result<(), rusqlite::Error> {
    rusqlite::vtab::array::load_module(&conn) // <- Adds "rarray" table function
}
