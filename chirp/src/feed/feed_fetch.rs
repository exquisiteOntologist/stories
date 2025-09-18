use url::Url;

use crate::{
    db::logging::db_log_add,
    entities::{FullContent, Source},
    feed::{feed_atom::parse_atom, feed_rss::parse_rss, feed_website::parse_website},
    scraping::page::scrape_feed_url_from_page,
    utils::fetch_url_to_string,
};
use std::error::Error;

pub async fn feed_fetch_from_url(
    source_id: i32,
    mut url: String,
    other_param: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    let mut feed_text = match fetch_url_to_string(&url).await {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to fetch feed content");
            eprintln!("{:?}", e.to_string());
            _ = db_log_add(e.to_string().as_str());
            return Err(e);
        }
    };

    let mut feed_type = determine_feed_type(&feed_text, &url);

    // Here we scrape the page for RSS feed URLs.
    // If there is a feed URL we replace the url, feed_text, and feed_type.
    // This should only happen when adding a feed (in theory).
    if feed_type == FeedType::Website && other_param.is_empty() {
        if let Some(new_feed_url) = get_nested_feed_url(&url, &feed_text) {
            println!("New feed url {}", new_feed_url);
            url = new_feed_url;
            feed_text = fetch_url_to_string(&url).await?;
            feed_type = determine_feed_type(&feed_text, &url);
            // we cannot replace this with recursion
        };
    }

    // print!("\n\nFeed test\n{:?}\n\n", feed_text);

    let parse_result: Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> =
        match feed_type {
            FeedType::Atom => {
                println!("Parsing atom {:?}", &url);
                parse_atom(&source_id, &url, &feed_text)
            }
            FeedType::Rss => {
                println!("Parsing RSS {:?}", &url);
                parse_rss(&source_id, &url, &feed_text).await
            }
            FeedType::Website => {
                println!("Parsing website {:?}", &url);
                parse_website(&source_id, &url, &feed_text, &other_param).await
            }
        };

    parse_result
}

fn determine_feed_type(feed_text: &str, url: &str) -> FeedType {
    // Note that even if a feed mentions "atom" it's more likely to be RSS if it doesn't begin with "<feed"
    if check_is_atom(&feed_text) {
        FeedType::Atom
    } else if check_is_rss(&feed_text, &url) {
        FeedType::Rss
    } else {
        FeedType::Website
    }
}

fn check_is_atom(feed_text: &str) -> bool {
    feed_text.contains(&"<feed")
}

fn check_is_rss(feed_text: &str, url: &str) -> bool {
    feed_text.contains(&"<rss")
        || feed_text.contains(&"http://purl.org/rss/1.0/")
        || url.contains(".rss")
}

fn check_has_feeds(feed_text: &str) -> bool {
    feed_text.contains("application/rss+xml")
}

/// if the page is a webpage it may contain links to feeds
fn get_nested_feed_url(page_url: &str, feed_text: &str) -> Option<String> {
    if !check_has_feeds(feed_text) {
        return None;
    }

    if let Some(feed_url) = scrape_feed_url_from_page(feed_text) {
        if feed_url.contains("http") {
            return feed_url.into();
        }

        let parsed_page = Url::parse(page_url).unwrap();
        let parsed_feed = parsed_page.join(&feed_url).unwrap();
        return Some(parsed_feed.as_str().into());
    };

    None
}

#[derive(PartialEq)]
enum FeedType {
    Rss,
    Atom,
    Website,
}
