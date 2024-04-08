use crate::{
    db::db_log_add,
    entities::{FullContent, Source},
    feed::{parse_atom, parse_rss, parse_website},
    utils::fetch_url_to_string,
};
use std::error::Error;

pub async fn feed_fetch(
    source_id: i32,
    url: String,
    other_param: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    let feed_text_res = fetch_url_to_string(&url).await;
    if let Err(e) = feed_text_res {
        eprintln!("Failed to fetch feed content");
        eprintln!("{:?}", e.to_string());
        _ = db_log_add(e.to_string().as_str());
        return Err(e);
    }
    let feed_text = feed_text_res.unwrap();

    // Note that even if a feed mentions "atom" it's more likely to be RSS if it doesn't begin with "<feed"
    let is_atom = feed_text.contains(&"<feed");
    let is_rss = !is_atom && feed_text.contains(&"<rss")
        || feed_text.contains(&"http://purl.org/rss/1.0/")
        || url.contains(".rss");

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

    if parse_result.is_err() {
        return Err(parse_result.unwrap_err());
    }

    let (parsed_source, parsed_content) = parse_result?;

    Ok((parsed_source, parsed_content))
}
