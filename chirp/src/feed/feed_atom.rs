use atom_syndication::Feed;
use chrono::{DateTime, FixedOffset, Utc};
use std::error::Error;

use crate::{
    entities::{Content, ContentBody, FullContent, Source, SourceKind},
    utils::get_datetime_now,
};

pub fn parse_atom_date(opt_date: Option<DateTime<FixedOffset>>) -> DateTime<Utc> {
    if opt_date.is_none() {
        return get_datetime_now();
    }

    let date_time = opt_date.unwrap().with_timezone(&Utc);

    date_time
}

pub fn parse_atom(
    s_id: &i32,
    url: &String,
    feed_text: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    let atom_feed = feed_text.parse::<Feed>().unwrap();

    let atom_source = Source {
        id: 0,
        name: atom_feed.title.to_string(),
        url: url.to_string(),
        site_url: atom_feed.links.first().unwrap().href.to_owned(),
        kind: SourceKind::RSS,
        data: vec![],
    };

    let atom_content: Vec<FullContent> = atom_feed
        .entries
        .iter()
        .map(|atom_item| {
            let author = atom_item.authors().first();
            let author_name: String = if author.is_some() {
                let name = &author.unwrap().name;
                name.to_owned()
            } else {
                String::new()
            };

            let fc = FullContent {
                content: Content {
                    id: 0,
                    source_id: s_id | 0,
                    title: atom_item.title.to_string(),
                    author: author_name,
                    url: atom_item.links.first().unwrap().href.clone(),
                    date_published: parse_atom_date(atom_item.published),
                    date_retrieved: get_datetime_now(),
                },
                content_body: ContentBody {
                    id: 0,
                    content_id: 0,
                    body_text: atom_item
                        .content
                        .clone()
                        .unwrap()
                        .value
                        .unwrap_or_default()
                        .to_string(),
                },
                content_media: vec![],
            };

            fc
        })
        .collect();

    Ok((atom_source, atom_content))
}
