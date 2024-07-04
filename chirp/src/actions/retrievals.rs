use std::error::Error;

use crate::db::retrievals::db_retrievals_is_content_updating;

pub fn action_retrievals_is_updating() -> Result<bool, Box<dyn Error>> {
    db_retrievals_is_content_updating()
}
