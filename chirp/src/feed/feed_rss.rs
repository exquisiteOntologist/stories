use chrono::{DateTime, Utc};
use futures::future::join_all;
use rss::Channel;
use std::{error::Error, str::FromStr};

use crate::{
    entities::{Content, ContentBody, ContentMedia, FullContent, MediaKind, Source, SourceKind},
    scraping::page::contents_from_page,
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

pub async fn parse_rss(
    s_id: &i32,
    url: &String,
    feed_text: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    let channel_result = Channel::from_str(&feed_text);

    if let Err(err) = channel_result {
        println!("Encountered error. Possibly invalid feed.");
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

    let mut rss_contents: Vec<FullContent> = channel
        .items
        .into_iter()
        .map(|fc| {
            let mut content_media: Vec<ContentMedia> = vec![];

            if let Some(enclosure) = fc.enclosure {
                content_media.push(ContentMedia {
                    id: 0,
                    content_id: 0,
                    src: enclosure.url,
                    // there probably won't ever be a video here based on parser, so optimize op
                    kind: match enclosure.mime_type.as_str() {
                        "image/jpeg" => MediaKind::IMAGE,
                        "image/png" => MediaKind::IMAGE,
                        "video" => MediaKind::VIDEO,
                        _ => MediaKind::IMAGE,
                    },
                })
            }

            if let Some(atom) = fc.atom_ext {
                // atom features (the other "feed_atom.rs" is for pure atom)
                for atom_link in atom.links() {
                    let mimetype = atom_link.mime_type().unwrap();
                    println!("atom LINK ! ! ! {:1} {:2}", mimetype, &atom_link.href);
                }
            }

            if let Some(_dublin) = fc.dublin_core_ext {
                // data for Dublin, academia
            }

            for (_ext_a_name, ext_a_extensions) in fc.extensions {
                // println!("Found extension");
                // println!("{:?}", &ext_a_name);
                for (_ext_b_name, ext_b_extensions) in ext_a_extensions {
                    // println!("ext ([a]:b) {:1} {:2}", &ext_a_name, ext_b_name);
                    for ext in ext_b_extensions {
                        for (att_name, att_value) in ext.attrs {
                            // println!("att {:1} {:2}", &att_name, &att_value);
                            if &ext.name == "media:thumbnail" && att_name == "url" {
                                // media:thumbnail is defined by MediaRSS
                                content_media.push(ContentMedia {
                                    id: 0,
                                    content_id: 0,
                                    src: att_value,
                                    kind: MediaKind::IMAGE,
                                });
                            }
                        }

                        // ...for child in ext.children
                    }
                }
            }

            for media in &content_media {
                println!("Image in RSS feed {:?}", &media.src);
            }

            return FullContent {
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
                content_media,
            };
        })
        .collect();

    let update_futures = rss_contents
        .into_iter()
        .map(|fc| enrich_rss_article_from_page(fc));

    rss_contents = join_all(update_futures)
        .await
        .into_iter()
        .map(|r_fc| r_fc.unwrap())
        .collect();

    return Ok((rss_source, rss_contents));
}

async fn enrich_rss_article_from_page<'a>(
    mut fc: FullContent,
) -> Result<FullContent, Box<dyn Error + Send + Sync>> {
    let missing_media = fc.content_media.is_empty();
    let incomplete = missing_media && !fc.content.url.is_empty();
    if !incomplete {
        return Ok(fc);
    }
    if let Ok(page) = contents_from_page(fc.content.url.clone()).await {
        for media in page.content_media {
            fc.content_media.push(media);
        }
    }
    return Ok(fc);
}
