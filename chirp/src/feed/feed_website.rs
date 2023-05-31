use std::{error::Error, collections::HashSet, vec};
use futures::future::join_all;
use scraper::{Html, Selector};

use crate::{utils::{fetch_url_to_string, get_datetime_now, fully_form_url}, entities::{WebPage, FullContent, Content, ContentBody, Source, SourceKind, ContentMedia, MediaKind}, db::db_check_content_existing_urls};

pub async fn parse_website(s_id: &i32, url: &String, doc_text: &String, article_url_segment: &String) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
	if article_url_segment.is_empty() {
		print!(
			"
				For website sources...

					Also provide a typical article URL path segment.

				\"add {{URL}} {{SEGMENT}}\"

				For example, if website.com has articles under \"/articles/\",
					as you would see with URLs like \"website.com/articles/an-informative-article\",
					then we want to pass that URL segment when calling \"add\".
					\"add website.com articles\"
			"
		);
		return Err("Cannot add website without path segment".into());
	}
	
	// use scraper
	// https://docs.rs/scraper/latest/scraper/
	
	// let doc = Html::parse_document(doc_text); // <- ! Html does not implement Send, hence parsing in each method
	let title = scrape_title(&doc_text).unwrap();

	let website_source = Source {
		id: s_id | 0,
		name: title,
		url: url.to_owned(),
		site_url: url.to_owned(),
		kind: SourceKind::WEB,
		data: vec![("article_url_segment".into(), article_url_segment.into())]
	};

	let website_contents_res: Result<Vec<FullContent>, Box<dyn Error>> = parse_web_articles(url, &doc_text, article_url_segment).await;

	if website_contents_res.is_err() {
		println!("Could not find or retrieve articles for provided URL and path pattern");
		return Err("Could not find or retrieve articles".into());
	}

	let website_contents: Vec<FullContent> = website_contents_res.unwrap().into_iter().map(|mut c| {
		c.content.source_id = s_id.to_owned();
		return c;
	}).into_iter().collect::<Vec<FullContent>>();

	Ok((website_source, website_contents))
}

pub async fn parse_web_articles(url: &String, doc_text: &String, article_url_segment: &String) -> Result<Vec<FullContent>, Box<dyn Error>> {
	let article_links = scrape_links(&doc_text, &article_url_segment.to_string()).unwrap();
	let article_urls: Vec<String> = article_links.into_iter().filter_map(|href| fully_form_url(url, &href).ok()).collect();
	if article_urls.is_empty() {
		return Err("No article links found".into());
	}
	
	println!("Urls found {:?}", article_urls.len());
	
	let urls_already_crawled = db_check_content_existing_urls(&article_urls)?;

	println!("Urls already crawled {:?}", urls_already_crawled.len());

	// note the way into_iter works means it consumes the vector, so it must be cloned in each instance of filter
	let urls_to_crawl: Vec<String> = article_urls.into_iter().filter(|au| urls_already_crawled.clone().into_iter().find(|uac| au == uac).is_none()).collect();

	println!("Urls to crawl {:?}", urls_to_crawl.len());
	
	// TODO: We can query the DB to see if the articles' pages were already fetched
	let article_futures = urls_to_crawl.into_iter().map(|p_url| contents_from_page(p_url.to_string()));
	let website_contents: Vec<FullContent> = join_all(article_futures).await.drain_filter(|r| r.is_ok()).map(|r| r.unwrap()).collect();

	Ok(website_contents)
}

// For a URL get the page doc, scrape the page, and return the Contents
pub async fn contents_from_page(url: String) -> Result<FullContent, Box<dyn Error + Send + Sync>> {
	let doc: Result<Html, Box<dyn Error>> = get_page_doc(&url).await;

	if doc.is_err() {
		return Err(format!("Page could not be retrieved for {url}").into());
	}

	let page = scrape_web_page(&doc.unwrap(), &url).unwrap();

	let contents = FullContent {
		content: Content {
			id: 0,
			source_id: 0,
			title: page.title,
			url: page.url,
			date_published: get_datetime_now(),
			date_retrieved: get_datetime_now()
		},
		content_body: ContentBody {
			id: 0,
			content_id: 0,
			body_text: page.body_text
		},
		content_media: if page.cover_img.is_some() {
			vec![ContentMedia {
				id: 0,
				content_id: 0,
				src: page.cover_img.unwrap(),
				kind: MediaKind::IMAGE
			}]
		} else {
			vec![]
		}
	};

	Ok(contents)
}

// Scrape the content of a web page
pub fn scrape_web_page(doc: &Html, url: &String) -> Result<WebPage, Box<dyn Error>> {
	let page = WebPage {
		url: url.to_owned(),
		title: scrape_title_from_doc(&doc)?,
    	body_text: doc.html(),
		cover_img: scrape_cover_image(&doc)?
	};

	// println!("Cover is {:?}", page.cover_img.clone().unwrap_or_default());

	Ok(page)
}

// Retrieve a web page from a URL
pub async fn get_page_doc(url: &String) -> Result<Html, Box<dyn Error>> {
	let doc_text = fetch_url_to_string(&url).await?;
	let doc = Html::parse_document(&doc_text);

	Ok(doc)
}

pub fn scrape_title_from_doc(doc: &Html) -> Result<String, Box<dyn Error>> {
	let title_selector = Selector::parse("title").unwrap();
	let node_title = doc.select(&title_selector).next().unwrap();
	let title = node_title.text().collect::<Vec<_>>().join(&String::new());
	
	Ok(title)
}

pub fn scrape_title(doc_text: &String) -> Result<String, Box<dyn Error>> {
	let doc = Html::parse_document(doc_text);
	let title = scrape_title_from_doc(&doc).unwrap();
	
	Ok(title)
}

pub fn scrape_cover_image(doc: &Html) -> Result<Option<String>, Box<dyn Error>> {
	let src_og_res = scrape_cover_images_og(&doc);
	if src_og_res.is_ok() {
		return Ok(Some(src_og_res?));
	}
	
	Ok(None)
}

pub fn scrape_cover_images_og(doc: &Html) -> Result<String, Box<dyn Error>> {
	let og_image_selector = Selector::parse("meta[property=\"og:image\"]").unwrap();
	let node_og_image_res = doc.select(&og_image_selector).next();

	if node_og_image_res.is_none() {
		return Err("No image found".into());
	}

	let node_og_image = node_og_image_res.unwrap();
	let (_k, img_src) = node_og_image.value().attrs().find(|a| a.0 == "content").unwrap();
	
	Ok(img_src.into())
}

pub fn scrape_links(doc_text: &String, article_url_segment: &String) -> Result<Vec<String>, Box<dyn Error>> {
	let doc = Html::parse_document(doc_text);
	let article_link_pattern = format!("a[href*=\"{article_url_segment}\"]");
	// println!("Article link pattern is: {:?}", article_link_pattern);
	let article_link_selector = Selector::parse(&article_link_pattern).unwrap();

	let links: Vec<String> = doc.select(&article_link_selector).map(|l| {
		let article_href = l.value().attr(&"href").unwrap_or("").to_string();

		article_href
	}).collect::<HashSet<String>>().into_iter().collect();

	Ok(links)
}

// TODO: Retrieve favicon
// TODO: Retrieve the OG:IMAGE etc.
