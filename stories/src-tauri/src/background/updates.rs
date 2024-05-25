use std::time::Duration;

pub async fn continual_updates() {
    // Repeatedly call update.
    // Each source is updated based on time since its last update.
    let dur = Duration::from_secs(30);
    let mut interval = tokio::time::interval(dur);
    loop {
        println!("Before updates");
        _ = chirp::actions::update::update().await;
        println!("After updates");
        interval.tick().await;
        println!("after sleep");
    }
}
