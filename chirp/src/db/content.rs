use std::error::Error;
use chrono::{Utc, TimeZone};
use rusqlite::{Params, Statement, Connection};

use crate::entities::{FullContent, Content, ContentBody};
use super::db_connect;

const DATE_FROM_FORMAT: &str = "%F %T%.6f %Z";

pub fn db_map_content_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<Content>, Box<dyn Error>> {
	// assumes used a "SELECT * FROM content"
	let content_rows = s.query_map(p, |row| {
		let date_published: String = row.get(4)?;
		let date_retrieved: String = row.get(5)?;
	
		Ok(Content {
			id: row.get(0)?,
			source_id: row.get(1)?,
			title: row.get(2)?,
			url: row.get(3)?,
			date_published: Utc.datetime_from_str(&date_published, &DATE_FROM_FORMAT).unwrap_or_default().into(),
			date_retrieved: Utc.datetime_from_str(&date_retrieved, &DATE_FROM_FORMAT).unwrap_or_default().into()
		})
	})?;

	let content = content_rows.map(|x| x.unwrap()).collect::<Vec<Content>>();

	Ok(content)
}

pub fn db_map_content_body_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<ContentBody>, Box<dyn Error>> {
	// assumes used a SELECT *
	let rows = s.query_map(p, |row| {
		Ok(ContentBody {
			id: row.get(0)?,
			content_id: row.get(1)?,
			body_text: row.get(2)?
		})
	})?;

	let bodies = rows.map(|x| x.unwrap()).collect::<Vec<ContentBody>>();

	Ok(bodies)
}

pub fn db_content_add(contents: Vec<FullContent>) -> Result<(), Box<dyn Error + Send + Sync>> {
	let conn = db_connect()?;

	for c in contents {
		// number of connections is number of file handles (says SO)
		while conn.is_busy()  {
			// wait
		}

		let cc = c.content;
		let b = c.content_body;
		let m = c.content_media;

		let content_in_res = conn.execute(
			"INSERT INTO content (source_id, title, url, date_published, date_retrieved) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT DO NOTHING",
			(&cc.source_id, &cc.title, &cc.url, &cc.date_published.to_string(), &cc.date_retrieved.to_string()),
		);
		
		if let Err(e) = content_in_res {
			println!("Failed executing content insertion");
			println!("{:1}, {:2} {:3}", &cc.source_id, &cc.title, &cc.url);
			println!("${e}");
			return Ok(());
		}

		if b.body_text.is_empty() && m.is_empty() {
			continue;
		}

		let cc_id_res = conn.query_row(
			"SELECT id FROM content WHERE url=:URL",
			&[(":URL", cc.url.as_str())],
			|row| row.get(0),
		);

		if cc_id_res.is_err() {
			let e = cc_id_res.unwrap_err();
			eprintln!("Inserted content not found {:?}", e);
			continue;
		}

		let cc_id: i32 = cc_id_res.unwrap();

		if b.body_text.is_empty() == false {
			conn.execute(
				"INSERT INTO content_body (content_id, body_text) VALUES (?1, ?2) ON CONFLICT DO NOTHING",
				(cc_id, &b.body_text),
			)?;
		}

		for mi in m.into_iter() {
			conn.execute(
				"INSERT INTO content_media (content_id, src, kind) VALUES (?1, ?2, ?3) ON CONFLICT DO NOTHING",
				(cc_id, &mi.src, 0 /* mi.kind */),
			)?;
		}
	}

	_ = conn.close();

	Ok(())
}

pub fn db_content_retrieve(id: i32) -> Result<Content, Box<dyn Error>> {
	let conn = db_connect()?;

	let mut content_query = conn.prepare(
        "SELECT * FROM content WHERE id = :ID LIMIT 1"
    )?;
	let id_string = id.to_string();
    let named_params = [
        (":ID", id_string.as_str()),
    ];
    let content_res = db_map_content_query(&mut content_query, &named_params);

	if content_res.is_err() {
		return Err(content_res.unwrap_err());
	}

	let content = content_res?;

	if content.len() == 0 {
		return Err("Content was not found".into());
	}

	let out = content.get(0).unwrap().to_owned();

	Ok(out)
}

pub fn db_list_content() -> Result<Vec<Content>, Box<dyn Error>> {
	let conn: Connection = db_connect()?;

	let mut content_list_query: Statement = conn.prepare(
		"SELECT * FROM content ORDER BY id DESC LIMIT 1000"
	)?;

	let content_list_res = db_map_content_query(&mut content_list_query, []);

	if content_list_res.is_err() {
		return Err(content_list_res.unwrap_err());
	}
	
	let content_list = content_list_res?;

	Ok(content_list)
}

pub fn db_list_content_of_source(id: i32) -> Result<Vec<Content>, Box<dyn Error>> {
	let conn: Connection = db_connect()?;

	let mut content_list_query: Statement = conn.prepare(
		"SELECT * FROM content WHERE source_id = :ID ORDER BY id DESC LIMIT 1000"
	)?;
	let id_string = id.to_string();
    let named_params = [
        (":ID", id_string.as_str()),
    ];
	let content_list_res = db_map_content_query(&mut content_list_query, &named_params);

	if content_list_res.is_err() {
		return Err(content_list_res.unwrap_err());
	}
	
	let content_list = content_list_res?;

	Ok(content_list)
}

// pub fn db_list_content_full() -> Result<Vec<FullContent>, Box<dyn Error>> {
// 	let conn: Connection = db_connect()?;

// 	let mut content_list_query: Statement = conn.prepare(
// 		"SELECT * FROM content ORDER BY id DESC LIMIT 1000"
// 	)?;

// 	let content_list_res = db_map_content_query(&mut content_list_query, []);

// 	if content_list_res.is_err() {
// 		return Err(content_list_res.unwrap_err());
// 	}
	
// 	let content_list = content_list_res?;

// 	Ok(content_list)
// }
