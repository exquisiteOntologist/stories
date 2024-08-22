use crate::{
    db::logging::db_log_add,
    entities::{FullContent, Source},
    feed::{feed_atom::parse_atom, feed_rss::parse_rss, feed_website::parse_website},
    utils::fetch_url_to_string,
};
use std::error::Error;

pub async fn feed_fetch_from_url(
    source_id: i32,
    url: String,
    other_param: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    let feed_text = match fetch_url_to_string(&url).await {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Failed to fetch feed content");
            eprintln!("{:?}", e.to_string());
            _ = db_log_add(e.to_string().as_str());
            return Err(e);
        }
    };

    // Note that even if a feed mentions "atom" it's more likely to be RSS if it doesn't begin with "<feed"
    let is_atom = feed_text.contains(&"<feed");
    let is_rss = !is_atom && feed_text.contains(&"<rss")
        || feed_text.contains(&"http://purl.org/rss/1.0/")
        || url.contains(".rss");

    // print!("\n\nFeed test\n{:?}\n\n", feed_text);

    let parse_result: Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> = if is_atom
    {
        println!("Parsing atom {:?}", &url);
        parse_atom(&source_id, &url, &feed_text)
    } else if is_rss {
        println!("Parsing RSS {:?}", &url);
        parse_rss(&source_id, &url, &feed_text).await
    } else {
        println!("Parsing website {:?}", &url);
        parse_website(&source_id, &url, &feed_text, &other_param).await
    };

    parse_result
}
