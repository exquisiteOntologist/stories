use super::{Content, ContentDto, FullContent, Source, SourceDto};

pub fn source_to_dto(s: Source) -> SourceDto {
    SourceDto {
        id: s.id,
        name: s.name,
        url: s.url,
        site_url: s.site_url,
        kind: s.kind,
    }
}

pub fn full_content_to_content_dto(fc: FullContent) -> ContentDto {
    ContentDto {
        id: fc.content.id,
        source_id: fc.content.source_id,
        title: fc.content.title,
        url: fc.content.url,
        date_published: fc.content.date_published.to_rfc3339(),
        date_retrieved: fc.content.date_retrieved.to_rfc3339(),
        media: fc.content_media, //.into_iter().map(|m| m.)
    }
}

pub fn content_to_dto(c: Content) -> ContentDto {
    ContentDto {
        id: c.id,
        source_id: c.source_id,
        title: c.title,
        url: c.url,
        date_published: c.date_published.to_rfc3339(),
        date_retrieved: c.date_retrieved.to_rfc3339(),
        media: vec![],
    }
}
