use std::{
    error::Error,
    io::{Cursor, Read},
    str,
};

use quick_xml::{
    escape::unescape,
    events::{BytesEnd, BytesStart, BytesText, Event},
    Reader, Writer,
};

///From an RSS feed's XML strip the surrounding CDATA tags.
pub fn remove_cdata_tags<'a>(mut content: &'a mut String) -> Result<&'a String, Box<dyn Error>> {
    let mut reader = Reader::from_str(&content);
    reader.config_mut().trim_text(true);
    let mut writer = Writer::new(Cursor::new(Vec::new()));

    loop {
        match reader.read_event() {
            Ok(Event::Start(ref e)) => {
                // Write start element
                writer.write_event(Event::Start(BytesStart::new(str::from_utf8(e.name().0)?)))?;
            }
            Ok(Event::End(ref e)) => {
                // Write end element
                writer.write_event(Event::End(BytesEnd::new(str::from_utf8(e.name().0)?)))?;
            }
            Ok(Event::Text(e)) => {
                // Convert BytesText to u8 slice and then to string
                match str::from_utf8(e.as_ref()) {
                    Ok(text) => match unescape(text) {
                        Ok(decoded) => writer.write_event(Event::Text(BytesText::new(&decoded)))?,
                        Err(e) => eprintln!("Failed to unescape text: {:?}", e),
                    },
                    Err(e) => eprintln!("Failed to convert BytesText to str: {:?}", e),
                }
            }
            Ok(Event::CData(e)) => {
                // Convert BytesCData to u8 slice and then to string
                match str::from_utf8(e.as_ref()) {
                    Ok(cdata) => match unescape(cdata) {
                        Ok(decoded) => writer.write_event(Event::Text(BytesText::new(&decoded)))?,
                        Err(e) => eprintln!("Failed to unescape CDATA: {:?}", e),
                    },
                    Err(e) => eprintln!("Failed to convert BytesCData to str: {:?}", e),
                }
            }
            Ok(Event::Eof) => break,
            Err(e) => eprintln!("Error at position {}: {:?}", reader.buffer_position(), e),
            _ => (),
        }
    }

    _ = writer.into_inner().read_to_string(&mut content);

    // println!("new content");
    // println!("{}", content);
    // println!("end new content");

    Ok(content)
}
