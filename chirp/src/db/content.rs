use std::{error::Error, rc::Rc};
use chrono::{Utc, TimeZone};
use rusqlite::{Params, Statement, Connection, types::Value};

use crate::entities::{FullContent, Content, ContentBody, ContentMedia, MediaKind};
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
	let mapped_bodies = s.query_map(p, |row| {
		Ok(ContentBody {
			id: row.get(0)?,
			content_id: row.get(1)?,
			body_text: row.get(2)?
		})
	})?;

	let bodies = mapped_bodies.map(|x| x.unwrap()).collect::<Vec<ContentBody>>();

	Ok(bodies)
}

pub fn db_map_content_media_query<P: Params>(s: &mut Statement, p: P) -> Result<Vec<ContentMedia>, Box<dyn Error>> {
	// assumes used a SELECT *
	let mapped_media = s.query_map(p, |row| {
		Ok(ContentMedia {
			id: row.get(0)?,
			content_id: row.get(1)?,
			src: row.get(2)?,
			kind: MediaKind::IMAGE // select_media_kind(row.get(3)?)
		})
	})?;

	let bodies = mapped_media.map(|x| x.unwrap()).collect::<Vec<ContentMedia>>();

	Ok(bodies)
}

pub fn db_map_content_urls<P: Params>(s: &mut Statement, p: P) -> Result<Vec<String>, Box<dyn Error>> {
	// assumes used a "SELECT * FROM content"
	let content_urls_map = s.query_map(p, |row| Ok(row.get(0)?))?;

	let content_urls = content_urls_map.map(|x| x.unwrap()).collect::<Vec<String>>();

	Ok(content_urls)
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

pub fn db_check_content_existing_urls(content_urls: &Vec<String>) -> Result<Vec<String>, Box<dyn Error>> {
	let conn: Connection = db_connect()?;
	rusqlite::vtab::array::load_module(&conn)?; // <- Adds "rarray" table function

	let content_url_values = Rc::new(content_urls.to_owned().into_iter().map(Value::from).collect::<Vec<Value>>());
	let params = [content_url_values];

	let mut content_url_query: Statement = conn.prepare(
		"SELECT url FROM content WHERE url IN (SELECT * FROM rarray(?1))"
		// "SELECT url FROM content"
	)?;
	let existing_urls_res = db_map_content_urls(&mut content_url_query, params.clone());

	if existing_urls_res.is_err() {
		println!("Error retrieving existing content URLs");
		let err = existing_urls_res.unwrap_err();
		println!("{:?}", err);
		return Err(err);
	}

	let existing_urls: Vec<String> = existing_urls_res.unwrap();

	// URLs that already exist (from provided URLs)
	return Ok(existing_urls)
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

pub fn db_list_content_full() -> Result<Vec<FullContent>, Box<dyn Error>> {
	let conn: Connection = db_connect()?;
	rusqlite::vtab::array::load_module(&conn)?; // <- Adds "rarray" table function

	let mut content_query: Statement = conn.prepare(
		"SELECT * FROM content ORDER BY id DESC LIMIT 1000"
	)?;

	let content_res = db_map_content_query(&mut content_query, []);

	if content_res.is_err() {
		return Err(content_res.unwrap_err());
	}
	
	let content = content_res?;

	let ids: Vec<i32> = content.clone().into_iter().map(|c| c.id).collect::<Vec<i32>>();
	let id_values = Rc::new(ids.iter().copied().map(Value::from).collect::<Vec<Value>>());
	let params = [id_values];

	let mut bodies_query: Statement = conn.prepare(
		"SELECT * FROM content_body WHERE content_id IN (SELECT * FROM rarray(?1))"
	)?;
	let bodies_res: Vec<ContentBody> = db_map_content_body_query(&mut bodies_query, params.clone())?;

	let mut medias_query: Statement = conn.prepare(
		"SELECT * FROM content_media WHERE content_id IN (SELECT * FROM rarray(?1))"
	)?;
	let medias_res: Vec<ContentMedia> = db_map_content_media_query(&mut medias_query, params.clone())?;

	println!("bodies count {:?}", bodies_res.clone().len());
	println!("medias count {:?}", medias_res.clone().len());

	let mut bodies = bodies_res.into_iter();
	let medias = medias_res.into_iter();

	let full_content: Vec<FullContent> = content.into_iter().map(|c| {
		let m = medias.clone().filter(|m| m.content_id == c.id);
		let b = bodies.find(|b| b.content_id == c.id);
		let cb = if b.is_some() {
			b.unwrap()
		} else {
			ContentBody {
				id: 0,
				content_id: c.id,
				body_text: String::new()
			}
		};

		// if m.clone().count() > 0 {
		// 	println!("Found some media for {:?}", c.title);
		// } else if medias.clone().count() > 0 {
		// 	println!("Missed some media for {:?}", c.title);
		// }

		let fc = FullContent {
			content: c.to_owned(),
			content_body: cb,
			content_media: m.collect()
		};

		return fc;
	}).collect();

	Ok(full_content)
}
