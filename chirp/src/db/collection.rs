use std::error::Error;
use crate::entities::CollectionSettings;

use super::db_connect;

pub fn db_set_collection_settings(cs: &CollectionSettings) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    conn.execute(
        "UPDATE collection_settings
        SET layout = ?2
        WHERE collection_id = ?1;",
        (&cs.collection_id, &cs.layout)
    )?;
    _ = conn.close();
    Ok(())
}
