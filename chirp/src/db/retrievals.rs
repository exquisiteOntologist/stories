use std::error::Error;

use rusqlite::{params, Row};

use crate::entities::Source;

use super::{source::db_map_sources_query, utils::db_connect};

const SQL_CHECK_RECENT_RETRIEVALS: &str = "SELECT COUNT(*) FROM retrieval WHERE substr(date_last_attempt, 1, 21) > strftime('%Y-%m-%d %H:%M:%S', 'now', '-2 minutes')";

pub fn db_retrievals_is_content_upating() -> Result<bool, Box<dyn Error>> {
    let conn = db_connect()?;
    match conn.query_row(
        SQL_CHECK_RECENT_RETRIEVALS,
        params![],
        |r: &Row| -> Result<bool, rusqlite::Error> {
            let count: i32 = match r.get::<_, i32>(0) {
                Ok(v) => v,
                Err(e) => return Err(e),
            };
            let is_updating: bool = count > 0;
            Ok(is_updating)
        },
    ) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string().into()),
    }
}

// Adds a sources retrieval table row. Only should be done once (when source is created).
pub fn db_source_retrievals_add(source_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    conn.execute(
		"INSERT INTO retrieval (source_id, date_last_success, date_last_attempt, fails_since_success, fails_all_time, successes_all_time) VALUES (?1, NULL, NULL, ?2, ?3, ?4)
			ON CONFLICT DO NOTHING",
		(&source_id, 0, 0, 0),
	)?;
    _ = conn.close();

    Ok(())
}

const SQL_RETRIEVAL_OUTDATED_ID: &str = "SELECT source_id FROM retrieval WHERE ((date_last_attempt IS NULL) OR (date_last_attempt < datetime('now', '-1 hours'))) AND fails_since_success < 10";

// Check retrievals to find Source Ids that haven't been updated for a while (or have no date)
pub fn db_retrievals_outdated_ids() -> Result<Vec<i32>, Box<dyn Error>> {
    let conn = db_connect()?;
    let mut retrievals_query = conn.prepare(SQL_RETRIEVAL_OUTDATED_ID)?;
    let rows_map = retrievals_query.query_map([], |r| Ok(r.get::<usize, i32>(0)?))?;
    let outdated_ids = rows_map.map(|r| r.unwrap()).collect::<Vec<i32>>();

    Ok(outdated_ids)
}

// Check retrievals to find Source(s) that haven't been updated for a while (or have no date)
pub fn db_retrievals_outdated_sources() -> Result<Vec<Source>, Box<dyn Error>> {
    let conn = db_connect()?;
    let mut retrievals_query = conn.prepare(&format!(
        "SELECT * FROM source WHERE id IN ({SQL_RETRIEVAL_OUTDATED_ID})"
    ))?;
    let sources = db_map_sources_query(&mut retrievals_query, [])?;

    Ok(sources)
}

// Retrievals success increment with date (and reset fails since)
pub fn db_source_retrievals_update_success(source_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    if let Err(e) = conn.execute(
        "UPDATE retrieval
			SET date_last_success = datetime(),
				date_last_attempt = datetime(),
				fails_since_success = 0,
				successes_all_time = successes_all_time + 1
		 WHERE
		 	source_id = :source_id
		",
        &[(":source_id", &source_id)],
    ) {
        eprintln!("Error updating retrievals successes");
        eprint!("{:?}\n", e);
    };
    _ = conn.close();

    Ok(())
}

// Retrievals fails increment with date
pub fn db_source_retrievals_update_failures(source_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    if let Err(e) = conn.execute(
        "UPDATE retrieval
			SET date_last_attempt = datetime(),
				fails_since_success = fails_since_success + 1,
				fails_all_time = fails_all_time + 1
		 WHERE
			 source_id = :source_id
		",
        &[(":source_id", &source_id)],
    ) {
        eprintln!("Error updating retrievals failures");
        eprint!("{:?}\n", e);
    };
    _ = conn.close();

    Ok(())
}

// TODO: Find dead retrievals (retrievals that have failed too many times)
