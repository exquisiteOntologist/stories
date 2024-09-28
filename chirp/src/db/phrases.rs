use std::error::Error;

use rusqlite::{params, Connection, Statement};

use crate::entities::PhraseResult;

use super::utils::db_connect;

pub const PHRASES_COLLECTION_TODAY: &str = "
    -- today's phrases from the collection, recursive
    WITH today_content AS (
        SELECT id
        FROM CONTENT
        WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now')
        AND source_id IN (SELECT source_id AS id FROM collection_to_source WHERE collection_id IN (WITH RECURSIVE hierarchy AS (
            SELECT id AS entity_id
            FROM collection
            WHERE id = ?1

            UNION ALL

            SELECT cc.collection_inside_id
            FROM collection_to_collection cc
            INNER JOIN hierarchy h ON cc.collection_parent_id = h.entity_id
        )
        SELECT entity_id
        FROM hierarchy))
    ),
    frequent_phrases AS (
        SELECT phrase_id, SUM(frequency) AS total
        FROM content_phrase
        WHERE content_id IN (SELECT id FROM today_content)
        GROUP BY phrase_id
        HAVING SUM(frequency) > 5
    )
    SELECT p.*, fp.total
    FROM phrase p
    JOIN frequent_phrases fp ON p.id = fp.phrase_id
    ORDER BY fp.total DESC
    LIMIT 300;
";

pub const PHRASES_COLLECTION_TODAY_COUNT: &str = "
    -- today's phrases from the collection, as a count
    WITH today_content AS (
        SELECT id
        FROM CONTENT
        WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now')
        AND source_id IN (SELECT source_id AS id FROM collection_to_source WHERE collection_id IN (WITH RECURSIVE hierarchy AS (
            SELECT id AS entity_id
            FROM collection
            WHERE id = ?1

            UNION ALL

            SELECT cc.collection_inside_id
            FROM collection_to_collection cc
            INNER JOIN hierarchy h ON cc.collection_parent_id = h.entity_id
        )
        SELECT entity_id
        FROM hierarchy))
    ),
    frequent_phrases AS (
        SELECT phrase_id
        FROM content_phrase
        WHERE content_id IN (SELECT id FROM today_content)
        GROUP BY phrase_id
    )
    SELECT COUNT(*) as today
    FROM phrase p
    WHERE p.id IN (SELECT phrase_id FROM frequent_phrases)
    ORDER BY p.id DESC;
";

pub fn today_phrases(collection_id: &i32) -> Result<Vec<PhraseResult>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;

    let mut query: Statement = conn.prepare(PHRASES_COLLECTION_TODAY)?;
    let results = query.query_map(
        params![collection_id],
        |r| -> Result<PhraseResult, rusqlite::Error> {
            Ok(PhraseResult {
                id: r.get::<_, i32>(0).unwrap(),
                phrase: r.get::<_, String>(1).unwrap(),
                total: r.get::<_, i32>(2).unwrap(),
            })
        },
    );

    match results {
        Ok(v) => {
            // println!(
            //     "Phrase from today in collection {:1}: {:2} {:3} {:4}",
            //     collection_id, v.id, v.phrase, v.total
            // );
            let phrases: Vec<PhraseResult> = v.map(|pr| pr.unwrap()).collect::<Vec<PhraseResult>>();
            Ok(phrases)
        }
        Err(e) => {
            eprintln!("Failed to count today's content in the given collection");
            Err(e.to_string().into())
        }
    }
}
