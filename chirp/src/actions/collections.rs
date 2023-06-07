use std::error::Error;

use crate::db::{db_set_collection_settings, db_get_collection, db_get_collection_settings, db_collection_add};
use crate::entities::Collection;
use crate::{entities::CollectionSettings};

pub fn collection_get(collection_ids: &Vec<i32>) -> Result<Vec<Collection>, Box<dyn Error>> {
    db_get_collection(collection_ids)
}

pub fn collection_add(c_name: &String, c_parent_id: &i32) -> Result<(), Box<dyn Error>> {
    db_collection_add(c_name, c_parent_id)
}

pub fn collection_settings_get(collection_ids: &Vec<i32>) -> Result<Vec<CollectionSettings>, Box<dyn Error>> {
    db_get_collection_settings(collection_ids)
}

pub fn collection_settings_set(cs: &CollectionSettings) -> Result<(), Box<dyn Error>> {
    db_set_collection_settings(cs)
}
