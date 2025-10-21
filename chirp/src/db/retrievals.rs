use std::error::Error;

use rusqlite::{params, Connection, Row};

use crate::entities::Source;

use super::{source::db_map_sources_query, utils::db_connect};

const _SQL_CHECK_RECENT_RETRIEVALS: &str = "SELECT COUNT(*) FROM retrieval WHERE substr(date_last_attempt, 1, 21) > strftime('%Y-%m-%d %H:%M:%S', 'now', '-62 minutes')";
/// Here we count all sources who haven't failed 10 times to update, and compare against the number that have attempted to update in the past hour
const SQL_CHECK_RECENT_RETRIEVALS_VS_RETRIEVALS: &str = "
SELECT * FROM (SELECT COUNT(*) AS total_updatable FROM retrieval WHERE fails_since_success != 10), (SELECT COUNT(*) AS recently_updated FROM retrieval WHERE substr(date_last_attempt, 1, 21) > strftime('%Y-%m-%d %H:%M:%S', 'now', '-61 minutes') AND fails_since_success != 10);
";

pub fn db_retrievals_is_content_updating() -> Result<bool, Box<dyn Error>> {
    let conn = db_connect()?;
    match conn.query_row(
        SQL_CHECK_RECENT_RETRIEVALS_VS_RETRIEVALS,
        params![],
        |r: &Row| -> Result<bool, rusqlite::Error> {
            let total_updatable: i32 = match r.get::<_, i32>(0) {
                Ok(v) => v,
                Err(e) => return Err(e),
            };
            let recently_updated: i32 = match r.get::<_, i32>(1) {
                Ok(v) => v,
                Err(e) => return Err(e),
            };
            let is_updating: bool = total_updatable == recently_updated;
            Ok(is_updating)
        },
    ) {
        Ok(v) => Ok(v),
        Err(e) => Err(e.to_string().into()),
    }
}

/// Find out if any sources are successful. If not it could mean they all failed due to network issues.
const SQL_ARE_ANY_SOURCES_SUCCESSFUL: &str =
    "SELECT COUNT(*) FROM retrieval WHERE fails_since_success = 0";

/// Determine if any sources are successfully updating.
pub fn db_check_if_any_sources_successful(conn: &Connection) -> Result<bool, Box<dyn Error>> {
    let mut stmt = conn.prepare(SQL_ARE_ANY_SOURCES_SUCCESSFUL)?;
    let count = stmt.query_row([], |r| Ok(r.get::<usize, i32>(0)?))?;
    println!("check # sources successful {}", count);
    Ok(count > 0)
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

/// Find sources that need to be updated (were not updated in past X minutes)
const SQL_RETRIEVAL_OUTDATED_ID: &str = "SELECT source_id FROM retrieval WHERE ((date_last_attempt IS NULL) OR (date_last_attempt < datetime('now', '-31 minutes'))) AND fails_since_success < 10";

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
    let any_successful = db_check_if_any_sources_successful(&conn).unwrap();
    if !any_successful {
        // If none of the feeds were successful then the reason for failure is likely
        // something such as the network connection and not individual feeds.
        // So in this case we don't want to record more failures.
        return Ok(());
    }
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
