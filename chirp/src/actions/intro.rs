use std::error::Error;

pub fn intro() -> Result<(), Box<dyn Error>> {
    print!(
        "
            :)\n
            Pass a command to perform an action, like:\n
            - add {{URL}}:          Add a source
            - remove {{Source ID}}:     Remove a source
            - update:               Update all sources
            - sources:                      List sources
            - search {{Phrase}}:        Search content & sources
            - view {{Content ID}}:   Get URL to content for viewing
            \n
            Sources can be websites or feeds.
            \n"
    );

    Ok(())
}
