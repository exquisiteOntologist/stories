pub const TODAY_PHRASES: &str = "
    -- today's phrases from the collection, recursive
    WITH today_content AS (
        SELECT id
        FROM CONTENT
        WHERE strftime('%Y-%m-%d', substr(date_published, 1, 10)) = strftime('%Y-%m-%d', 'now')
        AND source_id IN (SELECT source_id AS id FROM collection_to_source WHERE collection_id IN (WITH RECURSIVE hierarchy AS (
            SELECT id AS entity_id
            FROM collection
            WHERE id = ?1

            UNION ALL

            SELECT cc.collection_inside_id
            FROM collection_to_collection cc
            INNER JOIN hierarchy h ON cc.collection_parent_id = h.entity_id
        )
        SELECT entity_id
        FROM hierarchy))
    ),
    frequent_phrases AS (
        SELECT phrase_id, SUM(frequency) AS total
        FROM content_phrase
        WHERE content_id IN (SELECT id FROM today_content)
        GROUP BY phrase_id
        HAVING SUM(frequency) > 5
    )
    SELECT p.*, fp.total
    FROM phrase p
    JOIN frequent_phrases fp ON p.id = fp.phrase_id
    ORDER BY fp.total DESC
    LIMIT 300;
";
