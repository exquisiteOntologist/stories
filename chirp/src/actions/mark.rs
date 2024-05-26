use std::error::Error;

use crate::db::mark::{db_mark_add, db_mark_remove};

pub fn mark_add(content_id: &i32) -> Result<(), Box<dyn Error>> {
    db_mark_add(content_id)
}

pub fn mark_remove(content_id: &i32) -> Result<(), Box<dyn Error>> {
    db_mark_remove(content_id)
}
