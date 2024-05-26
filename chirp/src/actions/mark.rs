use std::error::Error;

use crate::{
    db::mark::{db_list_marks, db_mark_add, db_mark_remove},
    entities::ContentDto,
};

pub fn mark_add(content_id: &i32) -> Result<(), Box<dyn Error>> {
    db_mark_add(content_id)
}

pub fn mark_remove(content_id: &i32) -> Result<(), Box<dyn Error>> {
    db_mark_remove(content_id)
}

pub fn marks_list(source_ids: &Vec<i32>) -> Result<Vec<ContentDto>, Box<dyn Error>> {
    db_list_marks(source_ids)
}
