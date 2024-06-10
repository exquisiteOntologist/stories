use std::error::Error;

use crate::{db::phrases::today_phrases, entities::PhraseResult};

pub fn action_today_phrases(collection_id: &i32) -> Result<Vec<PhraseResult>, Box<dyn Error>> {
    today_phrases(collection_id)
}
