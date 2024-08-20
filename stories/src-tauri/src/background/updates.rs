use std::time::Duration;

const MIN_INTERVAL: Duration = Duration::from_secs(30);

pub async fn update() {
    _ = chirp::actions::update::update().await;
}

pub async fn panicky() {
    eprintln!("Oh no, I'm going to panic!");
    panic!();
}

pub async fn continual_updates() -> Box<dyn 'static + Send> {
    // Repeatedly call update (perform content updates and retrievals).
    // let min_interval = Duration::from_secs(30);
    loop {
        println!("Before updates");
        tokio::spawn(update());
        println!("After updates");
        tokio::time::sleep(MIN_INTERVAL).await;
        println!("after sleep");
    }
}

pub async fn replicating_update_schedule() {
    update().await;
    tokio::time::sleep(MIN_INTERVAL).await;
    tokio::spawn(replicating_update_schedule());
}
