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
        tokio::spawn(update());
        println!("After updates");
        tokio::time::sleep(min_interval).await;
        println!("after sleep");
    }
}
