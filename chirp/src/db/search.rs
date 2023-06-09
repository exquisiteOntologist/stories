use crate::{entities::{Content, Source, ContentBody, SearchResultsDto, SourceDto, ContentDto, source_to_dto, content_to_dto, Collection}, db::{db_query_as_like, db_map_sources_query, db_query_as_like_exact, db_map_content_query, db_map_content_body_query}};
use std::{error::Error};
use rusqlite::Connection;
use super::{db_connect, db_map_collection_query, db_contents_retrieve};

pub fn db_search(user_query: &String) -> Result<SearchResultsDto, Box<dyn Error>> {
    let conn = db_connect()?;

    let collections: Vec<Collection> = db_search_collections(&conn, user_query)?;
    let sources: Vec<Source> = db_search_sources(&conn, user_query)?;
    let sources_dtos: Vec<SourceDto> = sources.into_iter().map(source_to_dto).collect();
    let contents: Vec<Content> = db_search_content(&conn, user_query)?;
    let contents_match_titles_dtos: Vec<ContentDto> = contents.into_iter().map(content_to_dto).collect();
    let bodies: Vec<ContentBody> = db_search_content_body(&conn, user_query)?;
    let body_content_ids: Vec<i32> = bodies.into_iter().map(|b| b.content_id).collect();
    let contents_of_body_matches: Vec<Content> = db_contents_retrieve(&body_content_ids)?;
    let contents_of_bodies_dtos: Vec<ContentDto> = contents_of_body_matches.into_iter().map(content_to_dto).collect();
    
    let mut contents_all_dtos: Vec<ContentDto> = vec![];
    contents_all_dtos.append(&mut contents_match_titles_dtos.clone());
    contents_all_dtos.append(&mut contents_of_bodies_dtos.clone());
    contents_all_dtos.sort_by_key(|c| c.id);
    contents_all_dtos.dedup_by(|a, b| a.id == b.id);

    _ = conn.close();

    let results = SearchResultsDto {
        search_id: 0,
        search_phrase: user_query.into(),
        collections: collections,
        sources: sources_dtos,
        contents: contents_all_dtos,
        contents_match_titles: contents_match_titles_dtos,
        contents_match_bodies: contents_of_bodies_dtos,
        body_content_ids: body_content_ids,
        entity_people: vec![],
        entity_places: vec![],
        entity_brands: vec![],
        entity_chemicals: vec![],
        entity_materials: vec![],
        entity_concepts: vec![],
        mean_temperament: 1
    };

    Ok(results)
}

pub fn db_search_collections(conn: &Connection, user_query: &String) -> Result<Vec<Collection>, Box<dyn Error>> {
    // Search based on like, but give higher sort order to exact sequence
    let mut collections_query = conn.prepare(
        "
            SELECT *
            FROM collection 
            WHERE name LIKE :Q 
            ORDER BY CASE 
                WHEN name LIKE :EQ THEN 0 
                WHEN name LIKE :Q THEN 1 
                ELSE 2 
            END 
            LIMIT 1000 
        "
    )?;
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str())
    ];
    let collections = db_map_collection_query(&mut collections_query, &named_params)?;

    Ok(collections)
}

pub fn db_search_sources(conn: &Connection, user_query: &String) -> Result<Vec<Source>, Box<dyn Error>> {
    // Search based on like, but give higher sort order to exact sequence
    let mut sources_query = conn.prepare(
        "
            SELECT *
            FROM source 
            WHERE name LIKE :Q OR url LIKE :Q OR site_url LIKE :Q 
            ORDER BY CASE 
                WHEN name LIKE :EQ OR url LIKE :EQ OR site_url LIKE :EQ THEN 0 
                WHEN name LIKE :Q OR url LIKE :Q OR site_url LIKE :Q THEN 1 
                ELSE 2 
            END 
            LIMIT 1000 
        "
    )?;
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str())
    ];
    let sources = db_map_sources_query(&mut sources_query, &named_params)?;

    Ok(sources)
}

pub fn db_search_content(conn: &Connection, user_query: &String) -> Result<Vec<Content>, Box<dyn Error>> {
    // Search based on like, but give higher sort order to exact sequence
    let mut content_query = conn.prepare(
        "
            SELECT * 
            FROM content 
            WHERE title LIKE :Q OR url LIKE :Q 
            ORDER BY CASE 
                WHEN title LIKE :EQ OR url LIKE :EQ THEN 0 
                WHEN title LIKE :Q OR url LIKE :Q THEN 1 
                ELSE 2 
            END 
            LIMIT 1000"
    )?;
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str())
    ];
    let content = db_map_content_query(&mut content_query, &named_params)?;

    Ok(content)
}

pub fn db_search_content_body(conn: &Connection, user_query: &String) -> Result<Vec<ContentBody>, Box<dyn Error>> {
    // Search based on like, but give higher sort order to exact sequence
    let mut content_query = conn.prepare(
        "
            SELECT * 
            FROM content_body 
            WHERE body_text LIKE :Q 
            ORDER BY CASE 
                WHEN body_text LIKE :EQ THEN 0 
                WHEN body_text LIKE :Q THEN 1 
                ELSE 2 
            END 
            LIMIT 1000"
    )?;
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str())
    ];
    let bodies = db_map_content_body_query(&mut content_query, &named_params)?;

    Ok(bodies)
}
