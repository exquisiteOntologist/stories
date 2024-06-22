use quick_xml::events::{BytesStart, BytesText, Event};
use quick_xml::Reader;
use quick_xml::Writer;
use std::error::Error;
use std::fs::File;
use std::io::{self, Write};

/// From an RSS feed's XML strip the surrounding CDATA tags.
pub fn remove_cdata_tags(mut content: String) -> Result<(), Box<dyn Error>> {
    // Read the XML content from a file
    // let mut file = File::open("feed.xml")?;
    // let mut content = String::new();
    // file.read_to_string(&mut content)?;

    let mut reader = Reader::from_str(&content);
    reader.trim_text(true);
    let mut writer = Writer::new(io::stdout());

    let mut buf = Vec::new();
    loop {
        match reader.read_event(&mut buf) {
            Ok(Event::Start(ref e)) => {
                // Write start element
                writer.write_event(Event::Start(BytesStart::owned(
                    e.name().to_vec(),
                    e.name().len(),
                )))?;
            }
            Ok(Event::End(ref e)) => {
                // Write end element
                writer.write_event(Event::End(BytesStart::owned(
                    e.name().to_vec(),
                    e.name().len(),
                )))?;
            }
            Ok(Event::Text(e)) => {
                // Write text content
                writer.write_event(Event::Text(BytesText::from_plain_str(
                    &e.unescape_and_decode(&reader)?,
                )))?;
            }
            Ok(Event::CData(e)) => {
                // Convert CDATA to plain text
                writer.write_event(Event::Text(BytesText::from_plain_str(
                    &e.unescape_and_decode(&reader)?,
                )))?;
            }
            Ok(Event::Eof) => break,
            Err(e) => panic!("Error at position {}: {:?}", reader.buffer_position(), e),
            _ => (),
        }
        buf.clear();
    }

    Ok(())
}
