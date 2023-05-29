use std::error::Error;

use crate::{db::{db_sources_retrieve, self}, entities::{SourceKind, self}};

pub fn list_sources_action() -> Result<(), Box<dyn Error>> {
    let sources: Vec<entities::Source> = list_sources()?;

    for s in sources {
        let id = s.id;
        let name = s.name;
        let url = s.url;
        let kind: &str = match s.kind {
            SourceKind::RSS => "RSS",
            SourceKind::WEB => "Web"
        };
        println!("Source ID {id}, {kind}:      \"{name}\"");
        println!("  url: {url}");
    }
    
    Ok(())
}

pub fn list_sources() -> Result<Vec<entities::Source>, Box<dyn Error>> {
    let sources = db_sources_retrieve()?;

    Ok(sources)
}
