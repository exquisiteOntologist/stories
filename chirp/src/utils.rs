use std::error::Error;
use chrono::{NaiveDate, Utc, DateTime};
use reqwest::Url;

pub fn get_date_now_naive() -> NaiveDate {
	Utc::now().date_naive()
}

pub fn get_datetime_now() -> DateTime<Utc> {
	Utc::now()
}

pub async fn fetch_url_to_string(url: &String) -> Result<String, Box<dyn Error + Send + Sync>> {
	println!("fetching {:?}", url);
	let res = reqwest::get(url.to_owned())
		.await?;
	if let Err(_e) = &res.error_for_status_ref() {
		return Err(format!("There was an error fetching {url}").into());
	}
	let content_bytes = res.bytes()
		.await?;
	let content_text = String::from_utf8((&content_bytes).to_vec())?;

	Ok(content_text)
}

// With a website URL extract the domain and apply to the content URL, if the content URL is relative
pub fn fully_form_url(website_url: &String, content_url: &String) -> Result<String, Box<dyn Error>> {
	let parsed_content_url_res = Url::parse(&content_url);

	if parsed_content_url_res.is_ok() {
		return Ok(parsed_content_url_res?.into())
	}

	let parsed_website_url = Url::parse(
		&website_url
	)?;

	let full_url_res = parsed_website_url.join(&content_url);

	if let Err(e) = full_url_res {
		return Err(format!("Failed to parse URL.\n{e}").into());
	}

	let full_url = full_url_res?;

	Ok(full_url.into())
}
