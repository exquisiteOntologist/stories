use chrono::{DateTime, NaiveDate, Utc};
use reqwest::Url;
use std::error::Error;

pub fn get_date_now_naive() -> NaiveDate {
    Utc::now().date_naive()
}

pub fn get_datetime_now() -> DateTime<Utc> {
    Utc::now()
}

pub async fn fetch_url_to_string(url: &String) -> Result<String, Box<dyn Error + Send + Sync>> {
    println!("fetching {:?}", url);

    let client = reqwest::Client::new();
    let mut headers = reqwest::header::HeaderMap::new();

    headers.insert("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36".parse().unwrap());
    headers.insert("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7".parse().unwrap());

    match client.get(url.to_owned()).headers(headers).send().await {
        Ok(res) => {
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
