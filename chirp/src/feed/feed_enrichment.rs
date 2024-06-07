use std::error::Error;

use futures::future::join_all;

use crate::{entities::FullContent, scraping::page::contents_from_page};

/// Enrich content from page article scraper or RSS with page HTML metadata
pub async fn enrich_content_further(mut fc_items: Vec<FullContent>) -> Vec<FullContent> {
    let update_futures = fc_items
        .into_iter()
        .map(|fc| enrich_content_item_from_page(fc));

    fc_items = join_all(update_futures)
        .await
        .into_iter()
        .map(|r_fc| r_fc.unwrap())
        .collect();

    fc_items
}

pub async fn enrich_content_item_from_page<'a>(
    mut fc: FullContent,
) -> Result<FullContent, Box<dyn Error + Send + Sync>> {
    let missing_media = fc.content_media.is_empty();
    let incomplete = missing_media && !fc.content.url.is_empty();
    if !incomplete {
        return Ok(fc);
    }
    if let Ok(page) = contents_from_page(fc.content.url.clone()).await {
        if !page.content.title.is_empty() {
            fc.content.title = page.content.title;
        }
        for media in page.content_media {
            fc.content_media.push(media);
        }
    }
    return Ok(fc);
}
