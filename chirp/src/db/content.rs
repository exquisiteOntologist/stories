use super::{create_rarray_values, db_connect, load_rarray_table};
use crate::db::db_log_add;
use crate::entities::{Content, ContentBody, ContentMedia, FullContent, MediaKind};
use crate::scraping::articles::strip_html_tags_from_string;
use chrono::DateTime;
use chrono::NaiveDateTime;
use chrono::Utc;
use labels::actions::collect_word_tallies_with_intersections;
use rusqlite::{Connection, Params, Statement};
use std::error::Error;
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
) -> Result<Vec<Content>, Box<dyn Error>> {
    // assumes used a "SELECT * FROM content"
    let content_rows_res = s.query_map(p, |row| {
        let title: String = row.get(2)?;
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

        // println!("date published {:?}", &date_published);
        // println!("date {:?}", date_published_date.naive_utc().time());

        Ok(Content {
            id: row.get(0)?,
            source_id: row.get(1)?,
            title: content_title_clean(title), // row.get(2)?,
            author: String::new(),
            url: row.get(3)?,
            date_published: date_published_date,
            date_retrieved: date_retrieved_date,
        })
    });

    if content_rows_res.is_err() {
        let e = content_rows_res.err().unwrap();
        println!("Error adding collection {:?}", e);
        return Err(e.into());
    }

    let content_rows = content_rows_res?;

    let content = content_rows.map(|x| x.unwrap()).collect::<Vec<Content>>();

    Ok(content)
}

pub fn db_map_content_body_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<ContentBody>, Box<dyn Error>> {
    // assumes used a SELECT *
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
const SQL_DELETE_OLD_CONTENT: &str =
    "DELETE FROM content WHERE id < (SELECT MAX(id) FROM content) - 30000";

// const SQL_DELETE_OLD_BODIES: &str =
//     "DELETE FROM content_body WHERE id < (SELECT MAX(id) FROM content_body) - 1000";

pub fn db_content_save_space() -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    if let Err(_e) = conn.execute(&SQL_DELETE_OLD_CONTENT, []) {
        println!("Error deleting old bodies from content_body");
    }

    Ok(())
}

pub fn db_map_content_media_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<ContentMedia>, Box<dyn Error>> {
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
) -> Result<Vec<String>, Box<dyn Error>> {
    // assumes used a "SELECT * FROM content"
    let content_urls_map = s.query_map(p, |row| Ok(row.get(0)?))?;

    let content_urls = content_urls_map
        .map(|x| x.unwrap())
        .collect::<Vec<String>>();

    Ok(content_urls)
}

pub fn db_content_add(contents: Vec<FullContent>) -> Result<(), Box<dyn Error + Send + Sync>> {
    let conn = db_connect()?;

    for c in contents {
        // number of connections is number of file handles (says SO)
        while conn.is_busy() {
            // wait
        }

        let cc = c.content;
        let cb = c.content_body;
        let cm = c.content_media;

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

        if cb.body_text.is_empty() && cm.is_empty() {
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

        if cb.body_text.is_empty() == false {
            conn.execute(
				"INSERT INTO content_body (content_id, body_text) VALUES (?1, ?2) ON CONFLICT DO NOTHING",
				(cc_id, &cb.body_text),
			)?;

            _ = db_content_add_words_phrases(cb);
        }

        for mi in cm.into_iter() {
            conn.execute(
				"INSERT INTO content_media (content_id, src, kind) VALUES (?1, ?2, ?3) ON CONFLICT DO NOTHING",
				(cc_id, &mi.src, 0 /* mi.kind */),
			)?;
        }
    }

    _ = conn.close();

    Ok(())
}

pub fn db_content_add_words_phrases(cb: ContentBody) -> Result<(), Box<dyn Error + Send + Sync>> {
    let clean_text = strip_html_tags_from_string(&cb.body_text);
    let phrases_tallies = collect_word_tallies_with_intersections(&clean_text);

    let mut content_ids: Vec<i32> = Vec::new();
    let mut phrases: Vec<String> = Vec::new();
    let mut tallies: Vec<i32> = Vec::new();

    for (phrase, tally) in phrases_tallies {
        content_ids.push(cb.id);
        phrases.push(phrase.join(" "));
        tallies.push(tally);
    }

    let c_ids_r = create_rarray_values(content_ids);
    let phrases_r = create_rarray_values(phrases);
    let tallies_r = create_rarray_values(tallies);

    let conn = db_connect()?;
    load_rarray_table(&conn)?;

    let phrases_query_res = conn.prepare(
        // INSERT INTO phrase (phrase) VALUES(phrase)
        // WHERE phrase NOT IN (
        //     SELECT * FROM rarray(?1) EXCEPT SELECT phrase FROM phrase
        // );
        "
            INSERT INTO phrase(phrase)
                SELECT * from (
                    SELECT * FROM rarray(?2) EXCEPT SELECT phrase FROM phrase
                );
            INSERT INTO content_phrase(phrase, c_id, tally)
                SELECT * FROM phrase WHERE phrase.phrase IN (
                    SELECT * (
                        SELECT id FROM phrase WHERE phrase IN (
                            SELECT * FROM rarray(?2)
                        )
                    ) JOIN rarray(?1) JOIN rarray(?3);
                );
        ",
    );

    if let Err(err) = &phrases_query_res {
        eprintln!("Failed to add phrases {:?}", err);
        _ = db_log_add(err.to_string().as_str());
    }

    let mut phrases_query: Statement = phrases_query_res.unwrap();
    if let Err(err) = phrases_query.execute([c_ids_r, phrases_r, tallies_r]) {
        eprintln!("Failed to execute add phrases {:?}", err);
        _ = db_log_add(err.to_string().as_str());
    };

    Ok(())
}

// singular - see also db_contents_retrieve
pub fn db_content_retrieve(id: i32) -> Result<Content, Box<dyn Error>> {
    let conn = db_connect()?;

    let mut content_query = conn.prepare("SELECT * FROM content WHERE id = :ID LIMIT 1")?;
    let id_string = id.to_string();
    let named_params = [(":ID ", id_string.as_str())];
    let content_res = db_map_content_query(&mut content_query, &named_params);

    if content_res.is_err() {
        return Err(content_res.unwrap_err());
    }

    let content = content_res?;

    if content.len() == 0 {
        return Err("Content was not found ".into());
    }

    let out = content.get(0).unwrap().to_owned();

    Ok(out)
}

pub fn db_contents_retrieve(content_ids: &Vec<i32>) -> Result<Vec<Content>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let content_id_values = create_rarray_values(content_ids.to_owned());

    let mut contents_query: Statement =
        conn.prepare("SELECT * FROM content WHERE id IN (SELECT * FROM rarray(?1)) LIMIT 150")?;
    let contents_res = db_map_content_query(&mut contents_query, [content_id_values]);

    if let Err(e) = contents_res {
        println!("Error retrieving contents ");
        println!("{:?}", e);
        return Err(e);
    }

    let contents: Vec<Content> = contents_res.unwrap();

    Ok(contents)
}

pub fn db_check_content_existing_urls(
    content_urls: &Vec<String>,
) -> Result<Vec<String>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let content_url_values = create_rarray_values(content_urls.to_owned());
    let params = [content_url_values];

    let mut content_url_query: Statement =
        conn.prepare("SELECT url FROM content WHERE url IN (SELECT * FROM rarray(?1))")?;
    let existing_urls_res = db_map_content_urls(&mut content_url_query, params.clone());

    if existing_urls_res.is_err() {
        println!("Error retrieving existing content URLs ");
        let err = existing_urls_res.unwrap_err();
        println!("{:?}", err);
        return Err(err);
    }

    let existing_urls: Vec<String> = existing_urls_res.unwrap();

    // URLs that already exist (from provided URLs)
    Ok(existing_urls)
}

pub fn db_list_content() -> Result<Vec<Content>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;

    let mut content_list_query: Statement =
        conn.prepare("SELECT * FROM content ORDER BY id DESC LIMIT 150")?;

    let content_list_res = db_map_content_query(&mut content_list_query, []);

    if content_list_res.is_err() {
        return Err(content_list_res.unwrap_err());
    }

    let content_list = content_list_res?;

    Ok(content_list)
}

pub const SQL_CONTENT_OF_SOURCE: &str =
    "SELECT * FROM content WHERE source_id = :ID ORDER BY id DESC LIMIT 150";

pub fn db_list_content_of_source(source_id: i32) -> Result<Vec<Content>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;

    let mut content_list_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCE)?;
    let id_string = source_id.to_string();
    let named_params = [(":ID ", id_string.as_str())];
    let content_list_res = db_map_content_query(&mut content_list_query, &named_params);

    if content_list_res.is_err() {
        return Err(content_list_res.unwrap_err());
    }

    let content_list = content_list_res?;

    Ok(content_list)
}

pub const SQL_CONTENT_OF_SOURCES: &str = "
    SELECT * FROM content WHERE
    source_id IN (SELECT * FROM rarray(?1))
    ORDER BY date_published DESC
    LIMIT 150;
";

pub fn db_list_content_of_sources(source_ids: &Vec<i32>) -> Result<Vec<Content>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let s_id_values = create_rarray_values(source_ids.to_owned());
    let params = [s_id_values];
    let mut c_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCES)?;

    let content_list = db_map_content_query(&mut c_query, params)?;

    Ok(content_list)
}

pub fn db_list_content_full(source_ids: &Vec<i32>) -> Result<Vec<FullContent>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let s_id_values = create_rarray_values(source_ids.to_owned());
    let params = [s_id_values];
    let mut c_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCES)?;
    let content_list = db_map_content_query(&mut c_query, params)?;

    let ids: Vec<i32> = content_list
        .clone()
        .into_iter()
        .map(|c| c.id)
        .collect::<Vec<i32>>();
    let id_values = create_rarray_values(ids);
    let params = [id_values];

    let mut bodies_query: Statement =
        conn.prepare("SELECT * FROM content_body WHERE content_id IN (SELECT * FROM rarray(?1))")?;
    let bodies_res: Vec<ContentBody> =
        db_map_content_body_query(&mut bodies_query, params.clone())?;

    let mut medias_query: Statement =
        conn.prepare("SELECT * FROM content_media WHERE content_id IN (SELECT * FROM rarray(?1))")?;
    let medias_res: Vec<ContentMedia> =
        db_map_content_media_query(&mut medias_query, params.clone())?;

    // println!("bodies count {:?}", bodies_res.clone().len());
    // println!("medias count {:?}", medias_res.clone().len());

    let mut bodies = bodies_res.into_iter();
    let medias = medias_res.into_iter();

    let full_content: Vec<FullContent> = content_list
        .into_iter()
        .map(|c| {
            let m = medias.clone().filter(|m| m.content_id == c.id);
            let b = bodies.find(|b| b.content_id == c.id);
            let cb = if b.is_some() {
                b.unwrap()
            } else {
                ContentBody {
                    id: 0,
                    content_id: c.id,
                    body_text: String::new(),
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
                content_media: m.collect(),
            };

            return fc;
        })
        .collect();

    Ok(full_content)
}

pub fn db_content_bodies(content_ids: Vec<String>) -> Result<Vec<ContentBody>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let content_id_values = create_rarray_values(content_ids.to_owned());
    let params = [content_id_values];

    let mut bodies_query: Statement =
        conn.prepare("SELECT * FROM content WHERE content_id IN (SELECT * FROM rarray(?1))")?;
    let bodies_res = db_map_content_body_query(&mut bodies_query, params.clone());

    if bodies_res.is_err() {
        println!("Error retrieving content bodies ");
        let err = bodies_res.unwrap_err();
        println!("{:?}", err);
        return Err(err);
    }

    let bodies: Vec<ContentBody> = bodies_res.unwrap();

    // URLs that already exist (from provided URLs)
    Ok(bodies)
}
