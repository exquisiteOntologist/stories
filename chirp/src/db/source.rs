use std::error::Error;
use rusqlite::{Params, Statement};

use crate::entities::{Source, SourceKind, select_source_kind};
use super::{db_connect, db_retrievals_outdated_sources};

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
	let mut sources_query = conn.prepare("SELECT id, name, url, site_url, kind FROM source LIMIT 2000")?;
	let sources = db_map_sources_query(&mut sources_query, [])?;

	Ok(sources)
}

pub fn db_sources_retrieve_outdated() -> Result<Vec<Source>, Box<dyn Error>> {
	let sources = db_retrievals_outdated_sources()?;

	Ok(sources)
}

pub fn db_source_add(source: &Source) -> Result<(), Box<dyn Error>> {
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