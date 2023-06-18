use std::{error::Error, rc::Rc};
use rusqlite::{Params, Statement, Connection, types::Value, params};

use crate::entities::{Source, SourceKind, select_source_kind};
use super::{db_connect, db_retrievals_outdated_sources, load_rarray_table, create_rarray_values};

pub fn db_map_sources_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<Source>, Box<dyn Error>> {
	// assumes used a SELECT *
	let sources_rows = s.query_map(p, |row| {
		Ok(Source {
			id: row.get(0)?,
			name: row.get(1)?,
			url: row.get(2)?,
			site_url: row.get(3)?,
			kind: select_source_kind(row.get(4)?),
			data: vec![]
		})
	})?;

	let sources = sources_rows.map(|x| x.unwrap()).collect::<Vec<Source>>();

	Ok(sources)
}

pub fn db_sources_retrieve() -> Result<Vec<Source>, Box<dyn Error>> {
	let conn = db_connect()?;
	let mut sources_query: Statement = conn.prepare("SELECT * FROM source LIMIT 2000")?;
	let sources = db_map_sources_query(&mut sources_query, [])?;

	Ok(sources)
}

pub fn db_sources_of_collections_retrieve(collection_ids: &Vec<i32>) -> Result<Vec<Source>, Box<dyn Error>> {
	let conn: Connection = db_connect()?;
	load_rarray_table(&conn)?;
	// let c_id_values = Rc::new(collection_ids.to_owned().into_iter().map(Value::from).collect::<Vec<Value>>());
	let c_id_values = create_rarray_values(collection_ids.to_owned());
	let mut sources_query: Statement = conn.prepare(
		"SELECT * FROM source 
			WHERE id IN ((SELECT source_id FROM collection_to_source WHERE collection_id in (SELECT * FROM rarray(?1)))) 
			LIMIT 2000"
	)?;
	let sources = db_map_sources_query(&mut sources_query, params![c_id_values])?;

	Ok(sources)
}

pub fn db_sources_retrieve_outdated() -> Result<Vec<Source>, Box<dyn Error>> {
	let sources = db_retrievals_outdated_sources()?;

	Ok(sources)
}

pub fn db_source_add(source: &Source, collection_id: &i32) -> Result<(), Box<dyn Error>> {
	let source_kind = match source.kind {
        SourceKind::RSS => 0,
        SourceKind::WEB => 1
    };

	let conn = db_connect()?;
	conn.execute(
		"INSERT INTO source (name, url, site_url, kind) VALUES (?1, ?2, ?3, ?4) 
			ON CONFLICT DO NOTHING",
		(&source.name, &source.url, &source.site_url, &source_kind),
	)?;
	conn.execute(
		"INSERT INTO collection_to_source (collection_id, source_id) 
			VALUES (?1, (SELECT id FROM source ORDER BY id DESC LIMIT 1))",
		params![collection_id]
	)?;
	_ = conn.close();

	Ok(())
}

// When a source has been added add relevant data here too. Because new source ID is not set.
pub fn db_source_add_data(source: &Source, source_id: &i32) -> Result<(), Box<dyn Error>> {
	match source.kind {
		SourceKind::RSS => (),
		SourceKind::WEB => db_source_add_data_web(&source, &source_id)?
	};

	Ok(())
}

// When a WEB source has been added, add data critical to the WEB source here
pub fn db_source_add_data_web(source: &Source, source_id: &i32) -> Result<(), Box<dyn Error>> {
	let (_key, url_segment) = source.data.clone().into_iter().find(|(k, _v)| k == "article_url_segment").unwrap();
	let conn = db_connect()?;
	conn.execute(
		"INSERT INTO source_data_web (source_id, article_url_segment) VALUES (?1, ?2) 
			ON CONFLICT DO NOTHING",
		(&source_id, &url_segment),
	)?;
	_ = conn.close();

	Ok(())
}

pub fn db_sources_delete(source_ids: &Vec<i32>) -> Result<(), Box<dyn Error>> {
	let conn: Connection = db_connect()?;
	rusqlite::vtab::array::load_module(&conn)?; // <- Adds "rarray" table function

	// let source_id_values = Rc::new(source_ids.to_owned().into_iter().map(Value::from).collect::<Vec<Value>>());
	let source_id_values = create_rarray_values(source_ids.to_owned());
	let params = [source_id_values];

	let mut delete_query: Statement = conn.prepare(
		"DELETE FROM source WHERE id IN (SELECT * FROM rarray(?1))"
	)?;

	let d_res = delete_query.execute(params);

	if d_res.is_err() {
		let err = d_res.unwrap_err();
		println!("{:?}", err);
		return Err("Error deleting content ids".into());
	}

	Ok(())
}

pub fn db_source_get(source_id: &i32) -> Result<Source, Box<dyn Error>> {
	let conn = db_connect()?;
	let params = [(":id", &source_id.to_string())];
	let mut sources_query: Statement = conn.prepare("SELECT * FROM source WHERE id = :id")?;
	let mut sources = db_map_sources_query(&mut sources_query, &params)?;
	let source = sources.pop().unwrap();
	
	// _ = conn.close();
	
	Ok(source)
}

pub fn db_source_get_data_web_url_segment(source_id: &i32) -> Result<String, Box<dyn Error>> {
	let conn = db_connect()?;
	let params = [(":id", &source_id.to_string())];
	let url_segment: String = conn.query_row("SELECT article_url_segment FROM source_data_web WHERE source_id = :id", &params, |row| row.get(0))?;
	_ = conn.close();
	
	Ok(url_segment)
}

pub fn db_source_get_id(source: &Source) -> Result<i32, Box<dyn Error>> {
	let conn = db_connect()?;
	let params = [(":url", source.url.as_str())];
	let source_id: i32 = conn.query_row("SELECT id FROM source WHERE url = :url", &params, |row| row.get(0))?;
	_ = conn.close();
	
	Ok(source_id)
}

pub fn db_source_remove(source_id: &i32) -> Result<(), Box<dyn Error>> {
	let conn = db_connect()?;
	conn.execute(
		"DELETE FROM source WHERE ID = ?1",
		[source_id],
	)?;
	_ = conn.close();

	Ok(())
}
