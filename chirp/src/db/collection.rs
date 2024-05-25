use rusqlite::{params, Connection, Params, Statement};
use std::error::Error;

use crate::entities::{Collection, CollectionSettings, CollectionToCollection, CollectionToSource};

use super::utils::{create_rarray_values, db_connect, load_rarray_table};

pub fn db_map_collection_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<Collection>, Box<dyn Error>> {
    // assumes used a SELECT *
    let mapped_cs = s.query_map(p, |row| {
        Ok(Collection {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    })?;

    let collection_settings = mapped_cs.map(|x| x.unwrap()).collect::<Vec<Collection>>();

    Ok(collection_settings)
}

pub fn db_map_collection_settings_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<CollectionSettings>, Box<dyn Error>> {
    // assumes used a SELECT *
    let mapped_cs = s.query_map(p, |row| {
        Ok(CollectionSettings {
            id: row.get(0)?,
            collection_id: row.get(1)?,
            layout: row.get(2)?,
        })
    })?;

    let collection_settings = mapped_cs
        .map(|x| x.unwrap())
        .collect::<Vec<CollectionSettings>>();

    Ok(collection_settings)
}

pub fn db_map_collection_to_collection_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<CollectionToCollection>, Box<dyn Error>> {
    // assumes used a SELECT *
    let mapped_cs = s.query_map(p, |row| {
        Ok(CollectionToCollection {
            collection_parent_id: row.get(0)?,
            collection_inside_id: row.get(1)?,
        })
    })?;

    let c_to_c = mapped_cs
        .map(|x| x.unwrap())
        .collect::<Vec<CollectionToCollection>>();

    Ok(c_to_c)
}

pub fn db_map_collection_to_source_query<P: Params>(
    s: &mut Statement,
    p: P,
) -> Result<Vec<CollectionToSource>, Box<dyn Error>> {
    // assumes used a SELECT *
    let mapped_cs = s.query_map(p, |row| {
        Ok(CollectionToSource {
            collection_id: row.get(0)?,
            source_id: row.get(1)?,
        })
    })?;

    let c_to_s = mapped_cs
        .map(|x| x.unwrap())
        .collect::<Vec<CollectionToSource>>();

    Ok(c_to_s)
}

pub fn db_collection_add(c_name: &String, c_parent_id: &i32) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;

    if let Err(e) = conn.execute(
        "INSERT INTO collection (name) VALUES (?1)
                ON CONFLICT DO NOTHING;
            ",
        params![c_name],
    ) {
        eprint!("Error adding collection: {:?}\n", e);
        return Err(e.into());
    };

    if let Err(e) = conn.execute(
        "INSERT INTO collection_to_collection (collection_parent_id, collection_inside_id)
            VALUES (?1, (SELECT id FROM collection ORDER BY id DESC LIMIT 1));",
        params![&c_parent_id.to_string()],
    ) {
        eprint!("Error associating collections: {:?}\n", e);
        return Err(e.into());
    };

    if let Err(e) = conn.execute(
        "INSERT INTO collection_settings (collection_id, layout)
            VALUES ((SELECT id FROM collection ORDER BY id DESC LIMIT 1), 'ROWS');",
        params![],
    ) {
        eprint!("Error adding settings entry for new collection: {:?}\n", e);
        return Err(e.into());
    };

    _ = conn.close();

    Ok(())
}

pub fn db_collection_remove(
    parent_id: &i32,
    collection_ids: &Vec<i32>,
) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    load_rarray_table(&conn)?;

    let c_id_values = create_rarray_values(collection_ids.to_owned());

    // DELETE collection_to_collection associations for specified collections of parent
    if let Err(e) = conn.execute(
        "DELETE FROM collection_to_collection WHERE
            collection_parent_id = ?1 AND
            collection_inside_id IN (SELECT * FROM rarray(?2));
        ",
        params![parent_id, c_id_values],
    ) {
        eprint!("Error deleting collections: {:?}\n", e);
        return Err(e.into());
    };

    // DELETE collections that have no parent collections (& not root/home/oldest)
    if let Err(e) = conn.execute(
        "DELETE FROM collection WHERE
            id NOT IN (SELECT collection_inside_id FROM collection_to_collection) AND
            id NOT IN (SELECT id FROM collection ORDER BY id ASC LIMIT 1)
        ",
        params![],
    ) {
        eprint!("Error deleting orphaned collections: {:?}\n", e);
        return Err(e.into());
    };

    _ = conn.close();

    Ok(())
}

pub fn db_collection_rename(collection_id: &i32, name: &String) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;

    if let Err(e) = conn.execute(
        "UPDATE collection
            SET name = ?1
            WHERE id = ?2;
        ",
        params![name, collection_id],
    ) {
        eprint!("Error adding collection: {:?}\n", e);
        return Err(e.into());
    };

    _ = conn.close();

    Ok(())
}

pub fn db_get_collection(collection_ids: &Vec<i32>) -> Result<Vec<Collection>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let c_id_values = create_rarray_values(collection_ids.to_owned());
    let params = [c_id_values];

    let mut c_query: Statement =
        conn.prepare("SELECT * FROM collection WHERE id IN (SELECT * FROM rarray(?1))")?;

    let c = db_map_collection_query(&mut c_query, params)?;

    Ok(c)
}

pub fn db_get_collection_settings(
    collection_ids: &Vec<i32>,
) -> Result<Vec<CollectionSettings>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let c_id_values = create_rarray_values(collection_ids.to_owned());
    let params = [c_id_values];

    let mut c_settings_query: Statement = conn.prepare(
        // using collection_id instead of id
        "SELECT * FROM collection_settings WHERE collection_id IN (SELECT * FROM rarray(?1))",
    )?;

    let c_settings = db_map_collection_settings_query(&mut c_settings_query, params)?;

    Ok(c_settings)
}

pub fn db_set_collection_settings(cs: &CollectionSettings) -> Result<(), Box<dyn Error>> {
    let conn = db_connect()?;
    if let Err(e) = conn.execute(
        "UPDATE collection_settings
            SET layout = ?2
            WHERE collection_id = ?1;",
        (&cs.collection_id, &cs.layout),
    ) {
        eprint!("Update failed: {:?}\n", e);
        return Err(e.into());
    };
    _ = conn.close();
    Ok(())
}

pub fn db_get_collection_to_collection(
    parent_ids: &Vec<i32>,
) -> Result<Vec<CollectionToCollection>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let c_id_values = create_rarray_values(parent_ids.to_owned());
    let params = [c_id_values];

    let mut c_to_c_query: Statement = conn.prepare(
        // using collection_id instead of id
		"SELECT * FROM collection_to_collection WHERE collection_parent_id IN (SELECT * FROM rarray(?1))"
	)?;

    let c_to_c = db_map_collection_to_collection_query(&mut c_to_c_query, params)?;

    Ok(c_to_c)
}

pub fn db_get_collection_to_source(
    collection_ids: &Vec<i32>,
) -> Result<Vec<CollectionToSource>, Box<dyn Error>> {
    let conn: Connection = db_connect()?;
    load_rarray_table(&conn)?;

    let c_id_values = create_rarray_values(collection_ids.to_owned());

    let mut c_to_s_query: Statement = conn.prepare(
        // using collection_id instead of id
        "SELECT * FROM collection_to_source WHERE collection_id IN (SELECT * FROM rarray(?1))",
    )?;

    let c_to_s = db_map_collection_to_source_query(&mut c_to_s_query, params![c_id_values])?;

    Ok(c_to_s)
}
