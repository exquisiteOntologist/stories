use std::error::Error;

use rusqlite::{params, Connection, Statement};

use crate::entities::TodayCount;

use super::utils::db_connect;

pub const SQL_STATISTICS_TODAY_YESTERDAY_CONTENT_IN_COLLECTION: &str = "
    -- Today's articles count within collection and nested collections, but rewritten by OpenAI for performance
    -- BEGIN
    -- Recursive CTE to get all entity IDs in the hierarchy
    WITH RECURSIVE hierarchy AS (
        SELECT id AS entity_id
        FROM collection
        WHERE id = ?1

        UNION ALL

        SELECT cc.collection_inside_id
        FROM collection_to_collection cc
        INNER JOIN hierarchy h ON cc.collection_parent_id = h.entity_id
    ),
    -- CTE to get all source IDs from the collection hierarchy
    collection_sources AS (
        SELECT source_id
        FROM collection_to_source
        WHERE collection_id IN (SELECT entity_id FROM hierarchy)
    )
    -- Main query to count content items from today and the specified source IDs
    SELECT * FROM (
    	(
            SELECT COUNT(*) AS today
            FROM content
            WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now')
            AND source_id IN (SELECT source_id FROM collection_sources)), (
           	    SELECT COUNT(*) AS yesterday
                FROM content
                WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now', '-1 days')
                AND source_id IN (SELECT source_id FROM collection_sources)
        )
    );
";

pub fn today_content_count(collection_id: &i32) -> Result<TodayCount, Box<dyn Error>> {
    let conn: Connection = db_connect()?;

    let mut query_today: Statement =
        conn.prepare(SQL_STATISTICS_TODAY_YESTERDAY_CONTENT_IN_COLLECTION)?;
    match query_today.query_row(
        params![collection_id],
        |r| -> Result<TodayCount, rusqlite::Error> {
            let today = r.get::<_, i32>(0);
            let yesterday = r.get::<_, i32>(1);

            if let Err(e) = today {
                return Err(e);
            }

            if let Err(e) = yesterday {
                return Err(e);
            }

            Ok(TodayCount {
                today: r.get::<_, i32>(0).unwrap(),
                yesterday: r.get::<_, i32>(1).unwrap(),
            })
        },
    ) {
        Ok(v) => {
            println!(
                "Number of today's articles in collection {:1}: {:2} VS. {:3} yesterday",
                collection_id, v.today, v.yesterday
            );
            Ok(v)
        }
        Err(e) => {
            eprintln!("Failed to count today's content in the given collection");
            Err(e.to_string().into())
        }
    }
}
