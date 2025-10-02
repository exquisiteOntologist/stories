use chrono::{DateTime, NaiveDate, Utc};
use reqwest::{redirect::Policy, Url};
use std::{error::Error, process::Command};

pub fn get_date_now_naive() -> NaiveDate {
    Utc::now().date_naive()
}

pub fn get_datetime_now() -> DateTime<Utc> {
    Utc::now()
}

pub async fn fetch_url_to_string(url: &String) -> Result<String, Box<dyn Error + Send + Sync>> {
    println!("fetching {:?}", url);

    fetch_url_to_string_reqwest(url).await
    // fetch_url_to_string_surf(url).await
    // fetch_url_to_string_isahc(url).await
}

pub async fn fetch_url_to_string_reqwest(
    url: &String,
) -> Result<String, Box<dyn Error + Send + Sync>> {
    let client = reqwest::Client::builder()
        .redirect(Policy::limited(3))
        .build()?;
    let mut headers = reqwest::header::HeaderMap::new();

    // some user-agents trigger 403 forbidden on sites like Dezeen
    // headers.insert("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36".parse().unwrap());
    headers.insert("User-Agent", "STORIES/1.0".parse().unwrap());
    // headers.insert("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7".parse().unwrap());
    headers.insert("Accept", "*/*".parse().unwrap());

    match client.get(url.to_owned()).headers(headers).send().await {
        Ok(res) => {
            println!("res url {}", &res.url());
            println!("res status {}", &res.status());
            let content_bytes = res.bytes().await?;
            let content_text = String::from_utf8((&content_bytes).to_vec())?;
            Ok(content_text)
        }
        Err(e) => {
            eprint!("URL retrieval error for {:1}\n{:2}\n", url, e.to_string());
            return Err(e.to_string().into());
        }
    }
}

// pub async fn fetch_url_to_string_curl<'a>(
//     url: &String,
// ) -> Result<String, Box<dyn Error + Send + Sync>> {
//     let mut dst = Vec::new();
//     let mut easy = Easy::new();
//     easy.url("https://www.rust-lang.org/").unwrap();

//     let mut transfer = easy.transfer();
//     transfer
//         .write_function(|data| {
//             dst.extend_from_slice(data);
//             Ok(data.len())
//         })
//         .unwrap();
//     match transfer.perform() {
//         Ok(_) => (),
//         Err(e) => {
//             eprint!("URL retrieval error for {:1}\n{:2}\n", url, e.to_string());
//             return Err(e.to_string().into());
//         }
//     };

//     let Ok(content_text) = String::from_utf8(dst) else {
//         return Err("Failed to convert response bytes to string".into());
//     };

//     Ok(content_text)
// }

// pub async fn fetch_url_to_string_surf<'a>(
//     url: &String,
// ) -> Result<String, Box<dyn Error + Send + Sync>> {
//     let client: Client = Config::new()
//         .add_header("User-Agent", "curl/8.7.1")
//         .unwrap()
//         .add_header("Accept", "*/*")
//         .unwrap()
//         .try_into()?;

//     let req = client.get(url);
//     let mut res = client.send(req).await?;

//     let result = res.body_string().await?;
//     println!("Surf request result: {}", result);

//     Ok(result)
// }

// pub async fn fetch_url_to_string_isahc<'a>(
//     url: &String,
// ) -> Result<String, Box<dyn Error + Send + Sync>> {
//     let client = HttpClient::builder()
//         .default_headers(&[("User-Agent", "curl/8.7.1"), ("Accept", "*/*")])
//         .version_negotiation(VersionNegotiation::http11())
//         .redirect_policy(RedirectPolicy::Limit(10))
//         .timeout(Duration::from_secs(20))
//         // May return an error if there's something wrong with our configuration
//         // or if the client failed to start up.
//         .build()?;

//     let mut response = client.get_async(url).await?;
//     let content = response.text().await?;

//     Ok(content)
// }

pub async fn fetch_url_to_string_shell(
    url: &String,
) -> Result<String, Box<dyn Error + Send + Sync>> {
    let output = Command::new("curl").arg(url).output()?;
    let result = String::from_utf8(output.stdout).unwrap();

    println!("Shell CURL result: {}", result);

    Ok("".into())
}

// With a website URL extract the domain and apply to the content URL, if the content URL is relative
pub fn fully_form_url(
    website_url: &String,
    content_url: &String,
) -> Result<String, Box<dyn Error>> {
    let parsed_content_url_res = Url::parse(&content_url);

    if parsed_content_url_res.is_ok() {
        return Ok(parsed_content_url_res?.into());
    }

    let parsed_website_url = Url::parse(&website_url)?;

    let full_url_res = parsed_website_url.join(&content_url);

    if let Err(e) = full_url_res {
        return Err(format!("Failed to parse URL.\n{e}").into());
    }

    let full_url = full_url_res?;

    Ok(full_url.into())
}
