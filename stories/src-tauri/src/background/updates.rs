use std::time::Duration;

pub async fn continual_updates() {
    // Repeatedly call update (perform content updates and retrievals).
    let min_interval = Duration::from_secs(30);
    loop {
        println!("Before updates");
        _ = chirp::actions::update::update().await;
        println!("After updates");
        // This function is blocking, and should not be used in async functions. (oopsies)
        std::thread::sleep(min_interval);
        println!("after sleep");
    }
}
