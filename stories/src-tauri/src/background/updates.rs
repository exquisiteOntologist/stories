use std::time::Duration;


const MIN_INTERVAL: Duration = Duration::from_secs(30);

pub async fn update() {
    _ = chirp::actions::update::update().await;
}

pub async fn continual_updates() -> Box<dyn 'static + Send> {
    loop {
        println!("Before updates");
        tokio::spawn(update());
        println!("After updates");
        tokio::time::sleep(MIN_INTERVAL).await;
        println!("after sleep");
    }
}
