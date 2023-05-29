use std::{time::Duration};

pub async fn continual_updates() {
    // Repeatedly call update.
    // Updates are then performed on each individual source,
    // according to the time since source's last retrieval.
    let dur = Duration::from_secs(30);
    loop {
        println!("Before updates");
        _ = chirp::actions::update().await;
        println!("After updates");
        tokio::time::sleep(dur).await;
        println!("after sleep");
    }
}
