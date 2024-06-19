use std::error::Error;

use rusqlite::{params, Connection, Statement};

use crate::entities::{dto_maps::content_to_dto, ContentDto, ContentMedia};

use super::{
    content::{db_map_content_media_query, db_map_content_query},
    utils::{create_rarray_values, db_connect, load_rarray_table},
};

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

pub const SQL_MARKED_CONTENT_OF_SOURCES: &str = "
    SELECT * FROM content WHERE id IN (
    	SELECT content_id AS id FROM mark LIMIT 1000
    ) AND source_id IN (SELECT * FROM rarray(?1))
    ORDER BY date_published DESC
    LIMIT 150;
";

pub const SQL_MEDIA_FOR_CONTENT_IDS: &str = "
    SELECT * FROM content_media WHERE content_id IN (
        SELECT * FROM rarray(?1)
    )
";

pub fn db_list_marks(source_ids: &Vec<i32>) -> Result<Vec<ContentDto>, Box<dyn Error + 'static>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let s_id_values = create_rarray_values(source_ids.to_owned());
    let params = [s_id_values];
    let mut c_query: Statement = conn.prepare(SQL_MARKED_CONTENT_OF_SOURCES)?;
    let content_list = db_map_content_query(&mut c_query, params, Some(true))?;

    let ids: Vec<i32> = content_list
        .clone()
        .into_iter()
        .map(|c| c.id)
        .collect::<Vec<i32>>();
    let id_values = create_rarray_values(ids);
    let params = [id_values];

    let mut medias_query: Statement = conn.prepare(SQL_MEDIA_FOR_CONTENT_IDS)?;
    let medias_res: Vec<ContentMedia> =
        db_map_content_media_query(&mut medias_query, params.clone())?;

    let medias = medias_res.into_iter();

    let content_dtos: Vec<ContentDto> = content_list
        .into_iter()
        .map(|c| {
            let media: Vec<ContentMedia> =
                medias.clone().filter(|m| &m.content_id == &c.id).collect();
            let mut c_dto = content_to_dto(c);
            c_dto.media = media;
            c_dto
        })
        .collect();

    Ok(content_dtos)
}
