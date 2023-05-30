use std::error::Error;
use crate::{entities::{Source, FullContent}, feed::{parse_atom, parse_rss, parse_website}, utils::fetch_url_to_string};

pub async fn feed_fetch(source_id: i32, url: String, other_param: &String) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
	let feed_text = fetch_url_to_string(&url).await.unwrap();

	let is_atom = feed_text.contains(&"<feed");
	let is_rss = !is_atom && feed_text.contains(&"<rss");

	let parse_result: Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> = if is_atom {
		parse_atom(&source_id, &url, &feed_text)
	} else if is_rss {
		parse_rss(&source_id, &url, &feed_text)
	} else {
		parse_website(&source_id, &url, &feed_text, &other_param).await
	};

	if parse_result.is_err() {
		return Err(parse_result.unwrap_err());
	}

	let (parsed_source, parsed_content) = parse_result?;

	Ok((parsed_source, parsed_content))
}
