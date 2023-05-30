use chrono::{DateTime, Utc};
use serde::{Serialize};
use typeshare::typeshare;

#[derive(Debug)]
// #[typeshare::typeshare] // <- cannot do tuples as in data:
#[derive(Serialize)]
pub struct Source {
    pub id: i32,
    pub name: String,
    pub url: String,
    pub site_url: String,
    pub kind: SourceKind,
    pub data: Vec<(String, String)>
}

#[derive(Debug)]
#[typeshare]
#[derive(Serialize)]
pub enum SourceKind {
    RSS,
    WEB
}

pub fn select_source_kind(i: i32) -> SourceKind {
    match i {
        0 => SourceKind::RSS,
        1 => SourceKind::WEB,
        _ => SourceKind::RSS
    }
}

pub fn get_source_kind_index(sk: SourceKind) -> i32 {
    match sk {
        SourceKind::RSS => 0,
        SourceKind::WEB => 1
    }
}

#[derive(Debug)]
#[derive(Clone)]
pub struct FullContent {
    pub content: Content,
    pub content_body: ContentBody,
    pub content_media: Vec<ContentMedia>
}

#[derive(Debug)]
#[derive(Clone)]
pub struct Content {
    pub id: i32,
    pub source_id: i32,
    pub title: String,
    pub url: String,
    pub date_published: DateTime<Utc>,
    pub date_retrieved: DateTime<Utc>
}

#[derive(Debug)]
#[derive(Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct ContentDto {
    pub id: i32,
    pub source_id: i32,
    pub title: String,
    pub url: String,
    pub date_published: String,
    pub date_retrieved: String,
    pub media: Vec<ContentMedia>
}

#[derive(Debug)]
#[derive(Clone)]
#[derive(Serialize)]
pub struct ContentBody {
    pub id: i32,
    pub content_id: i32,
    pub body_text: String
}

#[derive(Debug)]
#[derive(Clone)]
#[typeshare]
#[derive(Serialize)]
pub enum MediaKind {
    IMAGE
}

#[derive(Debug)]
#[derive(Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct ContentMedia {
    pub id: i32,
    pub content_id: i32,
    pub src: String,
    pub kind: MediaKind
}

#[derive(Debug)]
pub struct WebPage {
    pub url: String,
    pub title: String,
    pub body_text: String,
    pub cover_img: Option<String>
}
