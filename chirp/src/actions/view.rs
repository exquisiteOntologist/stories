use std::error::Error;

use crate::{db::db_content_retrieve, entities::Content};


pub async fn view_content(args: Vec<String>) -> Result<(), Box<dyn Error>> {
    if args.len() < 3 {
        println!("When using \"view\" pass the ID of the content you wish to view");
        return Ok(());
    }

    let id: i32 = args.get(2).unwrap().parse().unwrap();
    let c_res = db_content_retrieve(id).await;

    if c_res.is_err() {
        println!("The ID does not exist");
        println!("{:?}", c_res.unwrap_err());
        return Ok(());
    }

    let c: Content = c_res?;

    let title = c.title;
    let url = c.url;

    print!("
        Content for ID:
        \"{title}\"
        {url}
");

    Ok(())
}
