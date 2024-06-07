use std::error::Error;

use rusqlite::{params, Connection, Statement};

use crate::entities::TodayCount;

use super::utils::db_connect;

/// Count the number of content items from the current day
pub const SQL_STATISTICS_TODAY_CONTENT: &str = "
    SELECT COUNT() FROM content
        WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now')
";

/// Count the number of content items from the current day that are in a set of sources (ids).
/// Use the `format!()` macro to combine with a query that retrieves Source IDs
pub const SQL_STATISTICS_TODAY_CONTENT_IN_SOURCES: &str = "
    SELECT COUNT() FROM content
        WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now')
        AND source_id IN ({});
";

pub const SQL_STATISTICS_TODAY_CONTENT_IN_COLLECTION: &str = "
    SELECT COUNT() FROM content WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now') AND source_id IN (SELECT source_id AS id FROM collection_to_source WHERE collection_id IN (WITH RECURSIVE hierarchy AS (
        SELECT id AS entity_id
        FROM collection
        WHERE id = ?1

        UNION ALL

        SELECT cc.collection_inside_id
        FROM collection_to_collection cc
        INNER JOIN hierarchy h ON cc.collection_parent_id = h.entity_id
    )
    SELECT entity_id
    FROM hierarchy));
";

pub const SQL_STATISTICS_YESTERDAY_CONTENT_IN_COLLECTION: &str = "
    SELECT COUNT() FROM content WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now', '-1 days') AND source_id IN (SELECT source_id AS id FROM collection_to_source WHERE collection_id IN (WITH RECURSIVE hierarchy AS (
        SELECT id AS entity_id
        FROM collection
        WHERE id = ?1

        UNION ALL

        SELECT cc.collection_inside_id
        FROM collection_to_collection cc
        INNER JOIN hierarchy h ON cc.collection_parent_id = h.entity_id
    )
    SELECT entity_id
    FROM hierarchy));
";

pub fn today_content_count(collection_id: &i32) -> Result<TodayCount, Box<dyn Error>> {
    let conn: Connection = db_connect()?;

    let mut query_today: Statement = conn.prepare(SQL_STATISTICS_TODAY_CONTENT_IN_COLLECTION)?;
    let count_res_today: Result<i32, rusqlite::Error> =
        query_today.query_row(params![collection_id], |r| r.get(0));

    let mut query_yesterday: Statement =
        conn.prepare(SQL_STATISTICS_YESTERDAY_CONTENT_IN_COLLECTION)?;
    let count_res_yesterday: Result<i32, rusqlite::Error> =
        query_yesterday.query_row(params![collection_id], |r| r.get(0));

    if count_res_today.is_err() || count_res_yesterday.is_err() {
        return Err("Failed to count today's content in the given collection".into());
    }

    let counts = TodayCount {
        today: count_res_today.unwrap(),
        yesterday: count_res_yesterday.unwrap(),
    };

    println!(
        "Number of today's articles in collection {:1}: {:2} VS. {:3} yesterday",
        collection_id, counts.today, counts.yesterday
    );

    Ok(counts)
}
