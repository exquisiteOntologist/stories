use std::error::Error;

use super::utils::{cuter::Cuter, db_create_directory};

pub fn db_init() -> Result<(), Box<dyn Error>> {
    db_seed_tables()?;
    Ok(())
}

pub fn db_seed_tables() -> Result<(), Box<dyn Error>> {
    db_create_directory();
    let cuter = Cuter::new();

    // Calling VACUUM goes over entire database
    // So don't call it here as it will slow startup.
    cuter.execute("PRAGMA auto_vacuum = FULL;")?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS source (
            id          INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            name        TEXT NOT NULL,
            url         TEXT NOT NULL UNIQUE,
            site_url    TEXT NOT NULL,
            kind        INTEGER NOT NULL
        )",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS source_id_index on
            source (id)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS source_name_index on
            source (name)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS source_url_index on
            source (url)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS source_data_web (
            source_id               INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            article_url_segment     TEXT NOT NULL,
            FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS log (
            id                      INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            date_of_failure         TEXT,
            message                 TEXT
        )",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS retrieval (
            source_id               INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            date_last_success       TEXT,
            date_last_attempt       TEXT,
            fails_since_success     INTEGER NOT NULL,
            fails_all_time          INTEGER NOT NULL,
            successes_all_time      INTEGER NOT NULL,
            FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS retrieval_date_last_attempt_index on
            retrieval (date_last_attempt)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS retrieval_fails_since_success_index on
            retrieval (fails_since_success)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS collection (
            id          INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            name        TEXT NOT NULL
        )",
    )?;

    cuter.execute(
        "INSERT INTO collection (id, name) VALUES (0, 'Home')
            ON CONFLICT DO NOTHING",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS collection_id_index on
            collection (id)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS collection_name_index on
            collection (name)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS collection_settings (
            id              INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            collection_id   INTEGER NOT NULL UNIQUE,
            layout          TEXT,
            FOREIGN KEY (collection_id) REFERENCES collection(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "INSERT INTO collection_settings (id, collection_id, layout) VALUES (0, 0, 'ROWS')
            ON CONFLICT DO NOTHING",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS collection_widget (
            id              INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            collection_id   INTEGER NOT NULL UNIQUE,
            widget          TEXT NOT NULL,
            FOREIGN KEY (collection_id) REFERENCES collection(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS collection_to_source (
            collection_id                       INTEGER NOT NULL,
            source_id                           INTEGER NOT NULL,
            PRIMARY KEY (collection_id, source_id),
            FOREIGN KEY (collection_id) REFERENCES collection(id)   ON DELETE CASCADE,
            FOREIGN KEY (source_id)     REFERENCES source(id)       ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS collection_to_source_index on
            collection_to_source (collection_id, source_id)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS collection_to_collection (
            collection_parent_id                INTEGER NOT NULL,
            collection_inside_id                INTEGER NOT NULL,
            PRIMARY KEY (collection_parent_id, collection_inside_id),
            FOREIGN KEY (collection_parent_id) REFERENCES collection(id) ON DELETE CASCADE,
            FOREIGN KEY (collection_inside_id) REFERENCES collection(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS content (
            id               INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            source_id        INTEGER NOT NULL,
            title            TEXT NOT NULL,
            url              TEXT NOT NULL UNIQUE,
            date_published   TEXT NOT NULL,
            date_retrieved   TEXT NOT NULL,
            FOREIGN KEY (source_id) REFERENCES source(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS content_id_index on
            content (id)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS content_url_index on
            content (url)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS content_date_published on
            content (date_published)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS content_body (
            id           INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            content_id   INTEGER NOT NULL UNIQUE,
            body_text    TEXT,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS content_body_id_index on
            content_body (id)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS content_media (
            id           INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            content_id   INTEGER NOT NULL UNIQUE,
            src          TEXT,
            kind         INTEGER NOT NULL,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS phrase (
            id           INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            phrase       TEXT NOT NULL UNIQUE
        )",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS phrase_id_index on
            phrase (id)",
    )?;

    cuter.execute(
        "CREATE INDEX IF NOT EXISTS phrase_index on
            phrase (phrase)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS content_phrase (
            id              INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
            phrase_id       INTEGER NOT NULL,
            content_id      INTEGER NOT NULL,
            frequency       INTEGER NOT NULL,
            FOREIGN KEY (phrase_id) REFERENCES phrase(id) ON DELETE CASCADE,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )",
    )?;

    cuter.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS phrase_to_content_index on
            content_phrase (phrase_id, content_id)",
    )?;

    cuter.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS content_to_phrase_index on
            content_phrase (content_id, phrase_id)",
    )?;

    cuter.execute(
        "CREATE TABLE IF NOT EXISTS mark (
            content_id      INTEGER PRIMARY KEY NOT NULL UNIQUE,
            FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )",
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

    _ = cuter.conn.close();

    Ok(())
}
