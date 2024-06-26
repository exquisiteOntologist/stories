use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

pub mod dto_maps;

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct Collection {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct CollectionSettings {
    pub id: i32,
    pub collection_id: i32,
    pub layout: String,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum SettingsLayout {
    ROWS,
    CARDS,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct CollectionWidget {
    pub id: i32,
    pub collection_id: i32,
    pub widget: String,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct CollectionToCollection {
    pub collection_parent_id: i32,
    pub collection_inside_id: i32,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct CollectionToSource {
    pub collection_id: i32,
    pub source_id: i32,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct CollectionToSearch {
    pub collection_id: i32,
    pub search_id: i32,
}

#[derive(Debug)]
// #[typeshare] // <- cannot do tuples as in data:
#[derive(Serialize)]
pub struct Source {
    pub id: i32,
    pub name: String,
    pub url: String,
    pub site_url: String,
    pub kind: SourceKind,
    pub data: Vec<(String, String)>,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct SourceDto {
    pub id: i32,
    pub name: String,
    pub url: String,
    pub site_url: String,
    pub kind: SourceKind,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum SourceKind {
    RSS,
    WEB,
}

pub fn select_source_kind(i: i32) -> SourceKind {
    match i {
        0 => SourceKind::RSS,
        1 => SourceKind::WEB,
        _ => SourceKind::RSS,
    }
}

pub fn get_source_kind_index(sk: SourceKind) -> i32 {
    match sk {
        SourceKind::RSS => 0,
        SourceKind::WEB => 1,
    }
}

#[derive(Debug, Clone)]
pub struct FullContent {
    pub content: Content,
    pub content_body: ContentBody,
    pub content_media: Vec<ContentMedia>,
}

#[derive(Debug, Clone)]
pub struct Content {
    pub id: i32,
    pub source_id: i32,
    pub title: String,
    pub author: String,
    pub url: String,
    pub date_published: DateTime<Utc>,
    pub date_retrieved: DateTime<Utc>,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct ContentDto {
    pub id: i32,
    pub source_id: i32,
    pub title: String,
    pub url: String,
    pub date_published: String,
    pub date_retrieved: String,
    pub media: Vec<ContentMedia>,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct ContentBody {
    pub id: i32,
    pub content_id: i32,
    pub body_text: String,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub enum MediaKind {
    IMAGE,
    VIDEO,
}

pub fn select_media_kind(i: i32) -> MediaKind {
    match i {
        0 => MediaKind::IMAGE,
        1 => MediaKind::VIDEO,
        _ => MediaKind::IMAGE,
    }
}

pub fn get_media_kind_index(mk: MediaKind) -> i32 {
    match mk {
        MediaKind::IMAGE => 0,
        MediaKind::VIDEO => 1,
    }
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct ContentMedia {
    pub id: i32,
    pub content_id: i32,
    pub src: String,
    pub kind: MediaKind,
}

#[derive(Debug)]
pub struct WebPage {
    pub url: String,
    pub title: String,
    pub body_text: String,
    pub cover_img: Option<String>,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct Search {
    pub id: i32,
    pub search_phrase: String,
    // pub collection_ids: Vec<i32>,
    // pub sources_ids: Vec<i32>,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct SearchQueryDto {
    pub search_id: i32,
    pub search_phrase: String,
    pub collections_ids: Vec<i32>,
    pub sources_ids: Vec<i32>,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct SearchResultsDto {
    pub search_id: i32,
    pub search_phrase: String,
    pub collections: Vec<Collection>,
    pub sources: Vec<SourceDto>,
    pub contents: Vec<ContentDto>,
    pub entity_people: Vec<i32>,
    pub entity_places: Vec<i32>,
    pub entity_brands: Vec<i32>,
    pub entity_chemicals: Vec<i32>,
    pub entity_materials: Vec<i32>,
    pub entity_concepts: Vec<i32>,
    pub mean_temperament: i32,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct TodayCount {
    pub today: i32,
    pub yesterday: i32,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct GenericCount {
    pub today: i32,
    pub yesterday: i32,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct PhraseResult {
    pub id: i32,
    pub phrase: String,
    pub total: i32,
}

#[derive(Debug, Clone)]
#[typeshare]
#[derive(Serialize)]
pub struct CollectionToPhrase {
    pub collection_id: i32,
    pub phrase_id: i32,
}
