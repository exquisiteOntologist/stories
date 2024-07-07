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
        // This function is blocking, and should not be used in async functions. (oopsies)
        std::thread::sleep(dur);
        println!("after sleep");
    }
}
