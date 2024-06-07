use std::error::Error;

use crate::{db::statistics::today_content_count, entities::TodayCount};

pub fn action_today_content_count(collection_id: &i32) -> Result<TodayCount, Box<dyn Error>> {
    today_content_count(collection_id)
}
