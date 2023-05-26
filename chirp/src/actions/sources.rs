use std::error::Error;

use crate::{db::db_sources_retrieve, entities::SourceKind};

pub fn list_sources() -> Result<(), Box<dyn Error>> {
    let sources = db_sources_retrieve()?;

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
