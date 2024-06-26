use super::{collection::db_map_collection_query, utils::db_connect};
use crate::{
    db::{
        content::{db_map_content_body_query, db_map_content_query},
        source::db_map_sources_query,
        utils::{db_query_as_like, db_query_as_like_exact, load_rarray_table},
    },
    entities::{
        dto_maps::{content_to_dto, source_to_dto},
        Collection, Content, ContentBody, ContentDto, SearchResultsDto, Source, SourceDto,
    },
};
use rusqlite::{named_params, Connection};
use std::error::Error;

pub fn db_search(user_query: &String) -> Result<SearchResultsDto, Box<dyn Error>> {
    let conn = db_connect()?;

    let collections: Vec<Collection> = db_search_collections(&conn, user_query)?;
    let sources: Vec<Source> = db_search_sources(&conn, user_query)?;
    let sources_dtos: Vec<SourceDto> = sources.into_iter().map(source_to_dto).collect();
    let contents: Vec<Content> = match db_search_content(&conn, user_query) {
        Ok(v) => v,
        Err(e) => return Err(e),
    };
    let contents_dtos: Vec<ContentDto> = contents.into_iter().map(content_to_dto).collect();
    let mut contents_all_dtos: Vec<ContentDto> = vec![];
    contents_all_dtos.append(&mut contents_dtos.clone());
    contents_all_dtos.dedup_by(|a, b| a.id == b.id);

    _ = conn.close();

    let results = SearchResultsDto {
        search_id: 0,
        search_phrase: user_query.into(),
        collections: collections,
        sources: sources_dtos,
        contents: contents_all_dtos,
        entity_people: vec![],
        entity_places: vec![],
        entity_brands: vec![],
        entity_chemicals: vec![],
        entity_materials: vec![],
        entity_concepts: vec![],
        mean_temperament: 1,
    };

    Ok(results)
}

// Search collection names with like, giving higher sort order to exact sequence
const SQL_SEARCH_COLLECTION: &str = "
    SELECT *
    FROM collection
    WHERE name LIKE :Q
    ORDER BY CASE
        WHEN name LIKE :EQ THEN 0
        WHEN name LIKE :Q THEN 1
        ELSE 2
    END
    LIMIT 1000
";

pub fn db_search_collections(
    conn: &Connection,
    user_query: &String,
) -> Result<Vec<Collection>, Box<dyn Error>> {
    let mut collections_query = match conn.prepare(SQL_SEARCH_COLLECTION) {
        Ok(v) => v,
        Err(e) => return Err(e.into()),
    };
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str()),
    ];
    let collections = match db_map_collection_query(&mut collections_query, &named_params) {
        Ok(v) => v,
        Err(e) => return Err(e.into()),
    };

    Ok(collections)
}

/// Sources search based on likes, giving higher sort order to exact sequence
const SQL_SEARCH_SOURCES: &str = "
    SELECT *
    FROM source
    WHERE name LIKE :Q OR url LIKE :Q OR site_url LIKE :Q
    ORDER BY CASE
        WHEN name LIKE :EQ OR url LIKE :EQ OR site_url LIKE :EQ THEN 0
        WHEN name LIKE :Q OR url LIKE :Q OR site_url LIKE :Q THEN 1
        ELSE 2
    END
    LIMIT 1000
";

pub fn db_search_sources(
    conn: &Connection,
    user_query: &String,
) -> Result<Vec<Source>, Box<dyn Error>> {
    let mut sources_query = conn.prepare(SQL_SEARCH_SOURCES)?;
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str()),
    ];
    db_map_sources_query(&mut sources_query, &named_params)
}

const _SQL_SEARCH_CONTENT_OLD: &str = "
    SELECT *
    FROM content
    WHERE title LIKE :Q OR url LIKE :Q
    ORDER BY CASE
        WHEN title LIKE :EQ OR url LIKE :EQ THEN 0
        WHEN title LIKE :Q OR url LIKE :Q THEN 1
        ELSE 2
    END
    LIMIT 1000";

/// Perform a case-insensitive search on content phrases, and then on the matching contents' body text
const _SQL_SEARCH_CONTENT_V1: &str = "
    -- Select all content where all of the phrases are present and in sequence
    -- CTE to get content IDs with all phrases
    WITH matching_content AS (
        SELECT *
        FROM content_phrase
        WHERE phrase_id IN (
            SELECT id
            FROM phrase
            WHERE phrase COLLATE NOCASE IN (SELECT * FROM rarray(:Q))
            COLLATE NOCASE
        )
        GROUP BY content_id
        HAVING COUNT(DISTINCT phrase_id) >= :N
        ORDER BY frequency DESC
        LIMIT 30
    ),
    -- CTE to mark content that has search text in body_text
    content_with_phrases AS (
        SELECT content_id, 1 AS priority
        FROM content_body
        WHERE body_text LIKE :EQ
        COLLATE NOCASE
    ),
    -- CTE to mark content that has search text in title
    content_with_title_match AS (
        SELECT id AS content_id, 0 AS priority
        FROM content
        WHERE title LIKE :EQ
        COLLATE NOCASE
    )
    -- Main query to select and order the content
    SELECT c.*
    FROM content c
    LEFT JOIN content_with_title_match ct ON c.id = ct.content_id
    LEFT JOIN content_with_phrases cwp ON c.id = cwp.content_id
    JOIN matching_content mc ON c.id = mc.content_id
    WHERE c.id IN (SELECT content_id FROM matching_content) OR c.title LIKE :EQ
    ORDER BY COALESCE(ct.priority, cwp.priority, 2)
    COLLATE NOCASE
    -- End search query
";

/// Perform a case-insensitive search on content phrases, and then on the matching contents' body text.
/// This version only scans the content_body text for matching_content and not all content or content_with_title_match.
const SQL_SEARCH_CONTENT: &str = "
    -- Select all content where all of the phrases are present and in sequence
    -- CTE to get content IDs with all phrases
    WITH matching_content AS (
        SELECT content_id
        FROM content_phrase
        WHERE phrase_id IN (
            SELECT id
            FROM phrase
            WHERE phrase COLLATE NOCASE IN (SELECT * FROM rarray(:Q))
        )
        GROUP BY content_id
        HAVING COUNT(DISTINCT phrase_id) >= :N
        ORDER BY frequency DESC
        LIMIT 100
    ),
    -- CTE to mark content that has search text in body_text and is in matching_content
    content_with_phrases AS (
        SELECT mc.content_id AS id, 1 AS priority
        FROM content_body cb
        JOIN matching_content mc ON cb.content_id = mc.content_id
        WHERE cb.body_text LIKE :QLE
        COLLATE NOCASE
    ),
    -- CTE to mark content that has search text in title
    content_with_title_match AS (
        SELECT c.id, 0 AS priority
        FROM content c
        WHERE c.title LIKE :QL
        COLLATE NOCASE
    )
    -- Main query to select and order the content
    SELECT c.*, COALESCE(ct.priority, cp.priority, 2) AS priority
    FROM content c
    LEFT JOIN content_with_title_match ct ON c.id = ct.id
    LEFT JOIN content_with_phrases cp ON c.id = cp.id
    JOIN matching_content mc ON c.id = mc.content_id
    ORDER BY COALESCE(ct.priority, cp.priority, 2) COLLATE NOCASE
    LIMIT 300;
";

pub fn db_search_content(
    conn: &Connection,
    user_query: &String,
) -> Result<Vec<Content>, Box<dyn Error>> {
    load_rarray_table(&conn)?;
    let mut content_query = match conn.prepare(SQL_SEARCH_CONTENT) {
        Ok(v) => v,
        Err(e) => return Err(e.into()),
    };
    let phrases: Vec<String> = user_query.split(' ').map(|s| s.to_string()).collect();
    let phrases_array = super::utils::create_rarray_values(phrases);
    let search_phrase_count = phrases_array.len();
    let search_for_like = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let params = named_params! {
        ":Q": phrases_array,
        ":N": &search_phrase_count,
        ":QL": search_for_like,
        ":QLE": search_for_like_exact.as_str(),
    };
    db_map_content_query(&mut content_query, params, Some(false))
}

/// Search content body with like, giving higher sort order to exact sequence
const SQL_SEARCH_CONTENT_BODY: &str = "
    SELECT *
    FROM content_body
    WHERE body_text LIKE :Q
    ORDER BY CASE
        WHEN body_text LIKE :EQ THEN 0
        WHEN body_text LIKE :Q THEN 1
        ELSE 2
    END
    LIMIT 1000
";

pub fn db_search_content_body(
    conn: &Connection,
    user_query: &String,
) -> Result<Vec<ContentBody>, Box<dyn Error>> {
    let mut content_query = conn.prepare(SQL_SEARCH_CONTENT_BODY)?;
    let search_for_likely = db_query_as_like(user_query);
    let search_for_like_exact = db_query_as_like_exact(user_query);
    let named_params = [
        (":Q", search_for_likely.as_str()),
        (":EQ", search_for_like_exact.as_str()),
    ];
    db_map_content_body_query(&mut content_query, &named_params)
}
