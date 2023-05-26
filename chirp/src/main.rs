use std::process;

// tokio async main polling macro with ["macros", "rt-multi-thread"]
#[tokio::main]
async fn main() {
    // Everything involves DB, so init DB first
    if let Err(e) = chirp::db::db_init() {
        eprintln!("Local App DB error: ${e}");
        process::exit(1);
    }

    // Perform action based on user-provided command
    if let Err(e) = chirp::actions::take_command().await {
        eprintln!("Application error: ${e}");
        process::exit(1);
    }
}
