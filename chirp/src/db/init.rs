use std::{error::Error};
use rusqlite::Connection;

use super::db_connect;

pub fn db_init() -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    db_seed_tables(conn)?;
    Ok(())
}

pub fn db_seed_tables(conn: Connection) -> Result<(), Box<dyn Error>> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS source (
            id          INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            name        TEXT NOT NULL,
            url         TEXT NOT NULL UNIQUE,
            site_url    TEXT NOT NULL,
            kind        INTEGER NOT NULL
        )",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS source_id_index on
            source (id)",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS source_name_index on
            source (name)",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS source_url_index on
            source (url)",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS source_data_web (
            source_id               INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            article_url_segment     TEXT NOT NULL,
            FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS retrieval (
            source_id               INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            date_last_success       TEXT,
            date_last_attempt       TEXT,
            fails_since_success     INTEGER NOT NULL,
            fails_all_time          INTEGER NOT NULL,
            successes_all_time      INTEGER NOT NULL,
            FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE
        )",
        (),
    )?;
    
    conn.execute(
        "CREATE INDEX IF NOT EXISTS retrieval_date_last_attempt_index on
            retrieval (date_last_attempt)",
        (),
    )?;
    
    conn.execute(
        "CREATE INDEX IF NOT EXISTS retrieval_fails_since_success_index on
            retrieval (fails_since_success)",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS collection (
            id          INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            name        TEXT NOT NULL
        )",
        (),
    )?;

    conn.execute(
        "INSERT INTO collection (id, name) VALUES (0, 'Home') 
            ON CONFLICT DO NOTHING",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS collection_id_index on
            collection (id)",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS collection_name_index on
            collection (name)",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS collection_settings (
            id              INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            collection_id   INTEGER NOT NULL UNIQUE,
            layout          TEXT,
            FOREIGN KEY (collection_id) REFERENCES collection(id) ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "INSERT INTO collection_settings (id, collection_id, layout) VALUES (0, 0, 'ROWS') 
            ON CONFLICT DO NOTHING",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS collection_widget (
            id              INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            collection_id   INTEGER NOT NULL UNIQUE,
            widget          TEXT NOT NULL,
            FOREIGN KEY (collection_id) REFERENCES collection(id) ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS collection_to_source (
            collection_id                       INTEGER NOT NULL,
            source_id                           INTEGER NOT NULL,
            PRIMARY KEY (collection_id, source_id),
            FOREIGN KEY (collection_id) REFERENCES collection(id)   ON DELETE CASCADE,
            FOREIGN KEY (source_id)     REFERENCES source(id)       ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS collection_to_source_index on
            collection_to_source (collection_id, source_id)",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS collection_to_collection (
            collection_parent_id                INTEGER NOT NULL,
            collection_inside_id                INTEGER NOT NULL,
            PRIMARY KEY (collection_parent_id, collection_inside_id),
            FOREIGN KEY (collection_parent_id) REFERENCES collection(id) ON DELETE CASCADE,
            FOREIGN KEY (collection_inside_id) REFERENCES collection(id) ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS content (
            id               INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            source_id        INTEGER NOT NULL,
            title            TEXT NOT NULL,
            url              TEXT NOT NULL UNIQUE,
            date_published   TEXT NOT NULL,
            date_retrieved   TEXT NOT NULL,
            FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS content_id_index on
            content (id)",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS content_url_index on
            content (url)",
        (),
    )?;
    
    conn.execute(
        "CREATE INDEX IF NOT EXISTS content_date_published on
            content (date_published)",
        ()
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS content_body (
            id           INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            content_id   INTEGER NOT NULL UNIQUE,
            body_text    TEXT,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS content_body_id_index on
            content_body (id)",
        (),
    )?;

    conn.execute(
        "CREATE INDEX IF NOT EXISTS content_body_text_index on
            content_body (body_text)",
        (),
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS content_media (
            id           INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            content_id   INTEGER NOT NULL UNIQUE,
            src          TEXT,
            kind   INTEGER NOT NULL,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )",
        (),
    )?;

    // TODO: Add "entity" table (id, text, date_added)
    // TODO: Add "dictionary" table (id, lang, word, description)
    // TODO: Add "characteristic" table (id, entity_id, verb_id)
    // TODO: Add "content_entity" table (entity_id, content_id) order important
    // TODO: Add "classification" table for types of entities (id, name)
    // TODO: Add "media" table (id, source_id, src)
    // TODO: Add "emo" table (id, score, variance)
    // TODO: Add "geo_point" table (id, lat, lon, ele, date, name)
    // TODO: Add "geo_surface" table (id, point_id, corners, name)
    // TODO: Add "geo_perspective" table (id, geo_point, a_x, a_y, a_z)
    // TODO: Add "geo_uv" table (id, geo_point, uv_score, brightness_score)
    // TODO: Add "activity" table (id, characteristic)
    // TODO: Add "time_activity" table (id, time_from, time_to, days, prob, indifference, name)
    // TODO: Add "char_inclination" table (id, characteristic_id, activity_id)
    // TODO: Add "proximity" table (id, a, b, len)
    // TODO: Add "chem" table (id, chem_index)
    // TODO: Add "material" table (id, mat_index)
    // TODO: Add "tune" table (id, sharpness, per, geo_origin, characteristic_id)
    // TODO: Add "price" table (id, entity_id, appraisal)
    // TODO: Add "person" table (id, name)
    // TODO: Add "author" table (id, person_id, email)
    // TODO: Add "group" (id)
    // TODO: Add "classification_to_group" (id, group_id, characteristic_id)
    // TODO: Add "group_to_person" (id, group_id, person_id)
    // TODO: Add "density" table long shot (id, content_id, avg_words_per_concept, conformity_index, answer_confidence)
    // TODO: Add "source_meta" table (id, content_id, )
    
    Ok(())
}
