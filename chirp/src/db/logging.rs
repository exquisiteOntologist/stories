use std::error::Error;

use crate::utils::get_datetime_now;

use super::utils::db_connect;

// Adds a message to the log table
pub fn db_log_add(message: &str) -> Result<(), Box<dyn Error>> {
    let date_of_failure = get_datetime_now();
    let conn = db_connect()?;
    if let Err(e) = conn.execute(
        "INSERT INTO log (date_of_failure, message) VALUES (?1, ?2)
			ON CONFLICT DO NOTHING",
        (&date_of_failure.to_string(), message),
    ) {
        eprint!("Error logging: {:?}\n", e);
    };
    _ = conn.close();

    Ok(())
}
