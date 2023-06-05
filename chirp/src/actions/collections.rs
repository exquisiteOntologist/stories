use std::error::Error;

use crate::db::{db_set_collection_settings};
use crate::{entities::CollectionSettings};

pub fn collection_settings_set(cs: &CollectionSettings) -> Result<(), Box<dyn Error>> {
    db_set_collection_settings(cs)
}
