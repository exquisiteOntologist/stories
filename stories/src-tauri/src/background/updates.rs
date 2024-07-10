use std::time::Duration;

pub async fn update() {
    _ = chirp::actions::update::update().await;
}

pub async fn panicky() {
    println!("Oh no, I'm going to panic!");
    panic!();
}

pub async fn continual_updates() -> Box<dyn 'static + Send> {
    // Repeatedly call update (perform content updates and retrievals).
    let min_interval = Duration::from_secs(30);
    loop {
        println!("Before updates");
        // std::thread::spawn(update);
        tokio::spawn(update());
        tokio::spawn(panicky());
        println!("After updates");
        // std::thread::sleep(min_interval);
        tokio::time::sleep(min_interval).await;
        println!("after sleep");
    }
}
