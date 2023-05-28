use std::{error::Error};
use atom_syndication::Feed;
use chrono::{DateTime, FixedOffset, Utc};

use crate::{entities::{ContentBody, Contents, Source, Content, SourceKind}, utils::get_datetime_now};

pub fn parse_atom_date(opt_date: Option<DateTime<FixedOffset>>) -> DateTime<Utc> {
	if opt_date.is_none() {
		return get_datetime_now();
	}
	
	let date_time = opt_date.unwrap().with_timezone(&Utc);
	
	date_time
}

pub fn parse_atom(s_id: &i32, url: &String, feed_text: &String) -> Result<(Source, Vec<Contents>), Box<dyn Error + Send + Sync>> {
	let atom_feed = feed_text.parse::<Feed>().unwrap();

	let atom_source = Source {
		id: 0,
		name: atom_feed.title.to_string(),
		url: url.to_string(),
		site_url: atom_feed.links.first().unwrap().href.to_owned(),
		kind: SourceKind::RSS,
		data: vec![]
	};

	let atom_content: Vec<Contents> = atom_feed.entries.iter().map(|e| Contents {
		content: Content {
			id: 0,
			source_id: s_id | 0,
			title: e.title.to_string(),
			url: e.links.first().unwrap().href.clone(),
			date_published: parse_atom_date(e.published),
			date_retrieved: get_datetime_now()
		},
		content_body: ContentBody {
			id: 0,
			content_id: 0,
			body_text: e.content.clone().unwrap().value.unwrap_or_default().to_string()
		},
		content_media: vec![]
	}).collect();

	Ok((atom_source, atom_content))
}
