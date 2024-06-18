use std::error::Error;

use crate::{
    db::statistics::{today_content_count, today_phrases_count},
    entities::{GenericCount, TodayCount},
};

pub fn action_today_content_count(collection_id: &i32) -> Result<TodayCount, Box<dyn Error>> {
    today_content_count(collection_id)
}

pub fn action_today_phrases_count(collection_id: &i32) -> Result<GenericCount, Box<dyn Error>> {
    today_phrases_count(collection_id)
}
