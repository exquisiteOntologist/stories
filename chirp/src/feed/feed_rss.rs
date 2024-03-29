use chrono::{DateTime, Utc};
use rss::Channel;
use std::{error::Error, str::FromStr};

use crate::{
    entities::{Content, ContentBody, FullContent, Source, SourceKind},
    utils::get_datetime_now,
};

// https://docs.rs/chrono/latest/chrono/format/strftime/index.html
// "Thu, 13 Apr 2023 08:00:00 +0100"
const RSS_DATE_FORMAT: &str = "%a, %d %b %Y %T %z";

pub fn parse_rss_date(date_str: &str) -> DateTime<Utc> {
    if date_str.is_empty() {
        return get_datetime_now();
    }

    let new_date_res = DateTime::parse_from_str(date_str, RSS_DATE_FORMAT);
    if new_date_res.is_err() {
        return get_datetime_now();
    }

    let new_date_utc = new_date_res.unwrap_or_default().with_timezone(&Utc);

    new_date_utc
}

pub fn parse_rss(
    s_id: &i32,
    url: &String,
    feed_text: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    let channel_result = Channel::from_str(&feed_text);

    if channel_result.is_err() {
        println!("Encountered error. Possibly invalid feed.");
        let err = channel_result.unwrap_err();
        println!("{:?}", err);
        return Err(Box::new(err));
    }

    let channel = channel_result.unwrap_or_default();

    let rss_source = Source {
        id: s_id | 0,
        name: channel.title,
        url: url.to_owned(),
        site_url: channel.link,
        kind: SourceKind::RSS,
        data: vec![],
    };

    let rss_contents: Vec<FullContent> = channel
        .items
        .into_iter()
        .map(|fc| FullContent {
            content: Content {
                id: 0,
                source_id: s_id | 0,
                title: fc.title.unwrap_or_default(),
                author: fc.author.unwrap_or_default(),
                url: fc.link.unwrap_or_default(),
                date_published: parse_rss_date(&fc.pub_date.unwrap_or(String::new())),
                date_retrieved: get_datetime_now(),
            },
            content_body: ContentBody {
                id: 0,
                content_id: 0,
                body_text: fc.content.unwrap_or(fc.description.unwrap_or_default()),
            },
            content_media: vec![],
        })
        .collect();

    return Ok((rss_source, rss_contents));
}
