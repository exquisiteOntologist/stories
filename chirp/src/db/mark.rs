use std::error::Error;

use rusqlite::params;

use crate::entities::Source;

use super::{source::db_map_sources_query, utils::db_connect};

pub fn db_mark_add(content_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    conn.execute(
        "INSERT INTO mark (content_id) VALUES (?1)
			ON CONFLICT DO NOTHING",
        params![&content_id],
    )?;
    _ = conn.close();

    Ok(())
}

pub fn db_mark_remove(content_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    conn.execute(
        "DELETE FROM mark WHERE content_id = ?1",
        params![&content_id],
    )?;
    _ = conn.close();

    Ok(())
}

// pub fn db_list_marks(
//     source_ids: &Vec<i32>,
// ) -> Result<Vec<FullContent>, Box<dyn Error + 'static>> {
//     let conn: Connection = db_connect()?;
//     load_rarray_table(&conn)?;

//     let s_id_values = create_rarray_values(source_ids.to_owned());
//     let params = [s_id_values];
//     let mut c_query: Statement = conn.prepare(SQL_CONTENT_OF_SOURCES)?;
//     let content_list = db_map_content_query(&mut c_query, params)?;

//     let ids: Vec<i32> = content_list
//         .clone()
//         .into_iter()
//         .map(|c| c.id)
//         .collect::<Vec<i32>>();
//     let id_values = create_rarray_values(ids);
//     let params = [id_values];

//     let mut bodies_query: Statement =
//         conn.prepare("SELECT * FROM content_body WHERE content_id IN (SELECT * FROM rarray(?1))")?;
//     let bodies_res: Vec<ContentBody> =
//         db_map_content_body_query(&mut bodies_query, params.clone())?;

//     let mut medias_query: Statement =
//         conn.prepare("SELECT * FROM content_media WHERE content_id IN (SELECT * FROM rarray(?1))")?;
//     let medias_res: Vec<ContentMedia> =
//         db_map_content_media_query(&mut medias_query, params.clone())?;

//     let mut bodies = bodies_res.into_iter();
//     let medias = medias_res.into_iter();

//     let full_content: Vec<FullContent> = content_list
//         .into_iter()
//         .map(|c| {
//             let m = medias.clone().filter(|m| m.content_id == c.id);
//             let b = bodies.find(|b| b.content_id == c.id);
//             let cb = if b.is_some() {
//                 b.unwrap()
//             } else {
//                 ContentBody {
//                     id: 0,
//                     content_id: c.id,
//                     body_text: String::new(),
//                 }
//             };

//             let fc = FullContent {
//                 content: c.to_owned(),
//                 content_body: cb,
//                 content_media: m.collect(),
//             };

//             return fc;
//         })
//         .collect();

//     Ok(full_content)
// }
