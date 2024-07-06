use crate::db::logging::db_log_add;
use crate::entities::{Content, ContentBody, ContentMedia, FullContent, MediaKind};
use crate::scraping::articles::strip_html_tags_from_string;
use chrono::DateTime;
use chrono::NaiveDateTime;
use chrono::Utc;
use labels::actions::collect_word_tallies_with_intersections;
use rusqlite::{params, Connection, Params, Statement};
use std::error::Error;
use std::vec::IntoIter;
use titles::entities::Title;
use titles::strip::strip_titles;

use super::utils::{create_rarray_values, db_connect, load_rarray_table};
//                              2023-10-07 13:46:54.605157 UTC
const DATE_FROM_FORMAT: &str = "%Y-%m-%d %H:%M:%S%.f %Z";

pub fn content_title_clean(mut title: String) -> String {
    let pipe_offset = title.find(&['|', '-']).unwrap_or(title.len());
    title.replace_range(pipe_offset.., "");
    title
}

pub fn db_map_content_query<P: Params>(
    s: &mut Statement,
    p: P,
    clean_titles: Option<bool>,
) -> Result<Vec<Content>, Box<dyn Error + 'static>> {
    let mut content_titles: Vec<(i32, i32, String)> = Vec::new();

    // assumes used a "SELECT * FROM content"
    // (all the columns in the 'content' table are present)
    let content_rows = match s.query_map(p, |row| {
        let date_published: String = row.get(4)?;
        let date_retrieved: String = row.get(5)?;

        let date_published_date: DateTime<Utc> =
            NaiveDateTime::parse_from_str(&date_published, &DATE_FROM_FORMAT)
                .unwrap()
                .and_utc();
        let date_retrieved_date: DateTime<Utc> =
            NaiveDateTime::parse_from_str(&date_retrieved, &DATE_FROM_FORMAT)
                .unwrap_or_default()
                .and_utc();

        let content = Content {
            id: row.get(0)?,
            source_id: row.get(1)?,
            title: row.get(2)?,
            author: String::new(),
            url: row.get(3)?,
            date_published: date_published_date,
            date_retrieved: date_retrieved_date,
        };

        content_titles.push((content.source_id, content.id, content.title.clone()));

        Ok(content)
    }) {
        Ok(v) => v,
        Err(e) => {
            eprint!("Error adding collection: {:?}\n", e);
            return Err(e.into());
        }
    };

    let mut content = content_rows
        .map(|x| x.unwrap())
        .into_iter()
        .collect::<Vec<Content>>();

    if let Some(true) = clean_titles {
        let source_c_chunks = content_titles
            .chunk_by(|(a_s_id, _, _), (b_s_id, _, _)| a_s_id == b_s_id)
            .map(|c| c);

        let mut all_titles_clean: Vec<Title> = Vec::new();
        for s_c in source_c_chunks {
            let titles_dirty = content_get_titles(s_c);
            let mut titles_clean = strip_titles(titles_dirty);
            all_titles_clean.append(&mut titles_clean);
        }

        content_update_titles(&mut content, all_titles_clean);
    }

    Ok(content)
}

fn content_get_titles<'a>(content_titles: &'a [(i32, i32, String)]) -> Vec<Title<'a>> {
    let mut titles_dirty: Vec<Title<'a>> = Vec::new();
    for (_sid, id, title) in content_titles {
        let t_d = Title {
            id: &id,
            title: &title,
        };
        titles_dirty.push(t_d);
    }
    titles_dirty
}

/// mutably update content titles from a list of given cleaned titles with matching Ids
fn content_update_titles(content: &mut Vec<Content>, titles_clean: Vec<Title>) {
    let mut t_c_iter = titles_clean.into_iter();
    for c in content {
        if let Some(t_c) = t_c_iter.find(|t_c| t_c.id == &c.id) {
            c.title = if t_c.title.is_empty() {
                println!(
                    "Cannot get title for {:1} {:2} {:3}",
                    t_c.id, c.title, t_c.title
                );
                "((no title))".into()
            } else {
                t_c.title.into()
            };
        };
    }
}

pub fn db_map_content_body_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<ContentBody>, Box<dyn Error + 'static>> {
    // assumes used a SELECT * from content_body
    let mapped_bodies = s.query_map(p, |row| {
        Ok(ContentBody {
            id: row.get(0)?,
            content_id: row.get(1)?,
            body_text: row.get(2)?,
        })
    })?;

    let bodies = mapped_bodies
        .map(|x| x.unwrap())
        .collect::<Vec<ContentBody>>();

    Ok(bodies)
}

// TODO: Update query
// Note that this will need to be updated in relation to the sources
// & that will be a much slower query
/// Delete old content. Where tables cascade, associated rows also get deleted.
const SQL_DELETE_OLD_CONTENT: &str = "DELETE FROM content
        WHERE id < (SELECT MAX(id) FROM content) - 30000
        AND id NOT IN (
            SELECT content_id as id FROM mark ORDER BY content_id DESC LIMIT 30000
        )";

pub fn db_content_save_space() -> Result<(), Box<dyn Error + 'static>> {
    let conn = db_connect()?;
    match conn.execute(&SQL_DELETE_OLD_CONTENT, []) {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting old bodies from content_body {:?}", e);
            Err(e.into())
        }
    }
}

pub fn db_map_content_media_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<ContentMedia>, Box<dyn Error + 'static>> {
    // assumes used a SELECT *
    let mapped_media = s.query_map(p, |row| {
        Ok(ContentMedia {
            id: row.get(0)?,
            content_id: row.get(1)?,
            src: row.get(2)?,
            kind: MediaKind::IMAGE, // select_media_kind(row.get(3)?)
        })
    })?;

    let bodies = mapped_media
        .map(|x| x.unwrap())
        .collect::<Vec<ContentMedia>>();

    Ok(bodies)
}

pub fn db_map_content_urls<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<String>, Box<dyn Error + 'static + Send + Sync>> {
    // assumes used a "SELECT * FROM content"
    let content_urls_map = s.query_map(p, |row| Ok(row.get(0)?))?;

    let content_urls = content_urls_map
        .map(|x| x.unwrap())
        .collect::<Vec<String>>();

    Ok(content_urls)
}

pub fn db_content_add(
    contents: Vec<FullContent>,
) -> Result<(), Box<dyn Error + 'static + Send + Sync>> {
    let conn = db_connect()?;

    for c in contents {
        // number of connections is number of file handles (says SO)
        while conn.is_busy() {
            // wait
        }

        // note the ID does not exist yet (not using GUIDs so we don't know until after insertion)
        let cc = c.content;
        let cb = c.content_body;
        let cm = c.content_media;

        if let Err(e) = conn.execute(
			"INSERT INTO content (source_id, title, url, date_published, date_retrieved) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT DO NOTHING",
			(&cc.source_id, &cc.title, &cc.url, &cc.date_published.to_string(), &cc.date_retrieved.to_string()),
		) {
            eprintln!("Failed executing content insertion");
            eprintln!("{:1}, {:2} {:3}", &cc.source_id, &cc.title, &cc.url);
            eprintln!("${e}");
            continue;
		};

        if cb.body_text.is_empty() && cm.is_empty() {
            continue;
        }

        let cc_id: i32 = match conn.query_row(
            "SELECT id FROM content WHERE url=:URL",
            &[(":URL", cc.url.as_str())],
            |row| row.get(0),
        ) {
            Ok(v) => v,
            Err(e) => {
                eprint!("Inserted content not found: {:?}\n", e);
                continue;
            }
        };

        if cb.body_text.is_empty() == false {
            if let Err(e) = conn.execute(
				"INSERT INTO content_body (content_id, body_text) VALUES (?1, ?2) ON CONFLICT DO NOTHING",
				(cc_id, &cb.body_text),
			) {
			    eprintln!("Error inserting content_body {:?}", e);
			};

            _ = db_content_add_words_phrases(cc_id, cb);
        }

        for mi in cm.into_iter() {
            if let Err(e) = conn.execute(
				"INSERT INTO content_media (content_id, src, kind) VALUES (?1, ?2, ?3) ON CONFLICT DO NOTHING",
				(cc_id, &mi.src, 0 /* mi.kind */),
			) {
                eprintln!("Error inserting content_media {:?}", e);
			};
        }
    }

    _ = conn.close();

    Ok(())
}

pub fn db_content_add_words_phrases(
    cc_id: i32,
    cb: ContentBody,
) -> Result<(), Box<dyn Error + 'static + Send + Sync>> {
    let clean_text = strip_html_tags_from_string(&cb.body_text);
    let phrases_tallies = collect_word_tallies_with_intersections(&clean_text);

    let mut phrases: Vec<String> = Vec::new();
    let mut tallies: Vec<i32> = Vec::new();

    for pt in phrases_tallies {
        // println!("c {:1}, p {:2}, t {:3}", &cc_id, &phrase.join(" "), &tally);
        phrases.push(pt.phrase.join(" "));
        tallies.push(pt.total);
    }

    let phrases_r = create_rarray_values(phrases);
    let tallies_r = create_rarray_values(tallies);

    let conn = db_connect()?;
    load_rarray_table(&conn)?;
    let mut phrases_query: Statement = match conn.prepare(
        "
            INSERT OR IGNORE INTO phrase(phrase)
                SELECT value AS phrase FROM rarray(?1);
        ",
    ) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to add phrases {:?}", e);
            _ = db_log_add(e.to_string().as_str());
            return Err(e.into());
        }
    };

    if let Err(e) = phrases_query.execute(params![&phrases_r]) {
        eprintln!("Failed to execute add phrases {:?}", e);
        _ = db_log_add(e.to_string().as_str());
        return Err(e.into());
    };

    let conn = db_connect()?;
    load_rarray_table(&conn)?;
    let mut content_phrase: Statement = match conn.prepare(
        "
            INSERT OR IGNORE INTO content_phrase(phrase_id, content_id, frequency)
                SELECT phrase_id, content_id, frequency FROM
                    (SELECT column1 as content_id FROM (VALUES (?1)))
                    JOIN (
                        SELECT
                            id AS phrase_id,
                            ROW_NUMBER() OVER (
                                ORDER BY id
                            ) row_num
                        FROM phrase WHERE phrase IN (SELECT * FROM rarray(?2))
                    )A
                    JOIN (
                        SELECT
                            value AS frequency,
                            ROW_NUMBER() OVER (
                                ORDER BY value
                            ) row_num
                        FROM (SELECT value FROM rarray(?3))
                    )B USING (row_num);
        ",
        // the ORDER BY is wrong and only works because there is just 1 unique content_id being used,
        // and the phrases are sorted by frequency
    ) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to add phrases {:?}", e);
            _ = db_log_add(e.to_string().as_str());
            return Err(e.into());
        }
    };

    if let Err(e) = content_phrase.execute(params![&cc_id, &phrases_r, &tallies_r]) {
        eprintln!("Failed to execute add content phrases {:?}", e);
        eprintln!(
            "lengths {:1} {:2} {:3}",
            &cc_id,
            phrases_r.len(),
            tallies_r.len()
        );
        _ = db_log_add(e.to_string().as_str());
        return Err(e.into());
    };

    Ok(())
}

// singular - see also db_contents_retrieve
pub fn db_content_retrieve(id: i32) -> Result<Content, Box<dyn Error + 'static>> {
    let conn = db_connect()?;

    let mut content_query = conn.prepare("SELECT * FROM content WHERE id = :ID LIMIT 1")?;
    let id_string = id.to_string();
    let named_params = [(":ID", id_string.as_str())];
    let content: Vec<Content> =
        match db_map_content_query(&mut content_query, &named_params, Some(false)) {
            Ok(v) => v,
            Err(e) => return Err(e),
        };

    match content.get(0) {
        Some(v) => Ok(v.to_owned()),
        None => return Err("Content was not found ".into()),
    }
}

pub fn db_contents_retrieve(
    content_ids: &Vec<i32>,
) -> Result<Vec<Content>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let content_id_values = create_rarray_values(content_ids.to_owned());

    let mut contents_query: Statement =
        conn.prepare("SELECT * FROM content WHERE id IN (SELECT * FROM rarray(?1)) LIMIT 150")?;
    match db_map_content_query(&mut contents_query, [content_id_values], Some(false)) {
        Ok(v) => Ok(v),
        Err(e) => {
            eprintln!("Error retrieving contents");
            eprintln!("{:?}", e);
            return Err(e);
        }
    }
}

pub fn db_check_content_existing_urls(
    content_urls: &Vec<String>,
) -> Result<Vec<String>, Box<dyn Error + 'static + Send + Sync>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let content_url_values = create_rarray_values(content_urls.to_owned());
    let params = [content_url_values];

    let mut content_url_query: Statement =
        conn.prepare("SELECT url FROM content WHERE url IN (SELECT * FROM rarray(?1))")?;
    match db_map_content_urls(&mut content_url_query, params.clone()) {
        Ok(v) => Ok(v),
        Err(e) => {
            eprintln!("Error retrieving existing content URLs");
            eprintln!("{:?}", e);
            return Err(e);
        }
    }
}

pub fn db_list_content() -> Result<Vec<Content>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;

    let mut content_list_query: Statement =
        conn.prepare("SELECT * FROM content ORDER BY id DESC LIMIT 150")?;

    db_map_content_query(&mut content_list_query, [], Some(true))
}

pub const SQL_CONTENT_OF_SOURCE: &str =
    "SELECT * FROM content WHERE source_id = :ID ORDER BY id DESC LIMIT 150";

pub fn db_list_content_of_source(source_id: i32) -> Result<Vec<Content>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;

    let mut content_list_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCE)?;
    let id_string = source_id.to_string();
    let named_params = [(":ID", id_string.as_str())];
    db_map_content_query(&mut content_list_query, &named_params, Some(true))
}

pub const SQL_CONTENT_OF_SOURCES: &str = "
    SELECT * FROM content WHERE
    source_id IN (SELECT * FROM rarray(?1))
    ORDER BY date_published DESC
    LIMIT 150;
";

pub fn db_list_content_of_sources(
    source_ids: &Vec<i32>,
) -> Result<Vec<Content>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let s_id_values = create_rarray_values(source_ids.to_owned());
    let params = [s_id_values];
    let mut c_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCES)?;

    db_map_content_query(&mut c_query, params, Some(true))
}

pub fn db_list_content_full(
    source_ids: &Vec<i32>,
) -> Result<Vec<FullContent>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let source_id_array = create_rarray_values(source_ids.to_owned());
    let mut c_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCES)?;
    let content_list = match db_map_content_query(&mut c_query, [source_id_array], Some(true)) {
        Ok(v) => v,
        Err(e) => return Err(e),
    };

    let ids: Vec<i32> = content_list
        .clone()
        .into_iter()
        .map(|c| c.id)
        .collect::<Vec<i32>>();
    let content_id_array = create_rarray_values(ids);
    let shared_params = [content_id_array];

    let mut bodies_query: Statement =
        conn.prepare("SELECT * FROM content_body WHERE content_id IN (SELECT * FROM rarray(?1))")?;
    let mut bodies: IntoIter<ContentBody> =
        match db_map_content_body_query(&mut bodies_query, shared_params.clone()) {
            Ok(v) => v.into_iter(),
            Err(e) => return Err(e),
        };

    let mut medias_query: Statement =
        conn.prepare("SELECT * FROM content_media WHERE content_id IN (SELECT * FROM rarray(?1))")?;
    let medias: IntoIter<ContentMedia> =
        match db_map_content_media_query(&mut medias_query, shared_params.clone()) {
            Ok(v) => v.into_iter(),
            Err(e) => return Err(e),
        };

    let full_content: Vec<FullContent> = content_list
        .into_iter()
        .map(|c| {
            let m = medias.to_owned().filter(|m| m.content_id == c.id);
            let cb = match bodies.find(|b| b.content_id == c.id) {
                Some(v) => v,
                None => ContentBody {
                    id: 0,
                    content_id: c.id,
                    body_text: String::new(),
                },
            };

            FullContent {
                content: c.to_owned(),
                content_body: cb,
                content_media: m.collect(),
            }
        })
        .collect();

    Ok(full_content)
}

pub fn db_content_bodies(
    content_ids: Vec<String>,
) -> Result<Vec<ContentBody>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let content_id_values = create_rarray_values(content_ids.to_owned());

    let mut bodies_query: Statement =
        conn.prepare("SELECT * FROM content WHERE content_id IN (SELECT * FROM rarray(?1))")?;
    match db_map_content_body_query(&mut bodies_query, [content_id_values]) {
        Ok(v) => Ok(v),
        Err(e) => {
            eprint!("Error retrieving content bodies: {:?}\n", e);
            return Err(e);
        }
    }
}
