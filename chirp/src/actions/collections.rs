use std::error::Error;

use crate::db::{db_set_collection_settings, db_get_collection, db_get_collection_settings, db_collection_add, db_get_collection_to_collection, db_get_collection_to_source, db_collection_rename, db_collection_remove};
use crate::entities::{Collection, CollectionToCollection, CollectionToSource};
use crate::{entities::CollectionSettings};

pub fn collection_get(collection_ids: &Vec<i32>) -> Result<Vec<Collection>, Box<dyn Error>> {
    db_get_collection(collection_ids)
}

pub fn collection_add(c_name: &String, c_parent_id: &i32) -> Result<(), Box<dyn Error>> {
    db_collection_add(c_name, c_parent_id)
}

pub fn collection_remove(parent_id: &i32, collection_ids: &Vec<i32>) -> Result<(), Box<dyn Error>> {
    db_collection_remove(parent_id, collection_ids)
}

pub fn collection_rename(collection_id: &i32, name: &String) -> Result<(), Box<dyn Error>> {
    db_collection_rename(collection_id, name)
}

pub fn collection_settings_get(collection_ids: &Vec<i32>) -> Result<Vec<CollectionSettings>, Box<dyn Error>> {
    db_get_collection_settings(collection_ids)
}

pub fn collection_settings_set(cs: &CollectionSettings) -> Result<(), Box<dyn Error>> {
    db_set_collection_settings(cs)
}

pub fn collection_to_collection_get(parent_ids: &Vec<i32>) -> Result<Vec<CollectionToCollection>, Box<dyn Error>> {
    db_get_collection_to_collection(parent_ids)
}

pub fn collection_to_source_get(collection_ids: &Vec<i32>) -> Result<Vec<CollectionToSource>, Box<dyn Error>> {
    db_get_collection_to_source(collection_ids)
}
