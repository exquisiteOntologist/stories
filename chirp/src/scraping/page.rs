use crate::{
    entities::{Content, ContentBody, ContentMedia, FullContent, MediaKind, WebPage},
    utils::{fetch_url_to_string, get_datetime_now},
};
use scraper::{Html, Selector};
use std::{collections::HashSet, error::Error, vec};

/// For a URL get the page doc, scrape the page, and return the Contents
pub async fn contents_from_page(url: String) -> Result<FullContent, Box<dyn Error + Send + Sync>> {
    let Ok(doc) = get_page_doc(&url).await else {
        return Err(format!("Page could not be retrieved for {url}").into());
    };

    let Ok(page) = scrape_web_page(&doc, &url) else {
        return Err(format!("Failed to scrape page {url}").into());
    };

    let contents = FullContent {
        content: Content {
            id: 0,
            source_id: 0,
            title: page.title,
            author: String::new(),
            url: page.url,
            date_published: get_datetime_now(),
            date_retrieved: get_datetime_now(),
        },
        content_body: ContentBody {
            id: 0,
            content_id: 0,
            body_text: page.body_text,
        },
        content_media: if page.cover_img.is_some() {
            vec![ContentMedia {
                id: 0,
                content_id: 0,
                src: page.cover_img.unwrap_or_default(),
                kind: MediaKind::IMAGE,
            }]
        } else {
            vec![]
        },
    };

    Ok(contents)
}

/// Scrape the content of a web page
pub fn scrape_web_page(doc: &Html, url: &String) -> Result<WebPage, Box<dyn Error>> {
    let page = WebPage {
        url: url.to_owned(),
        title: match scrape_title_from_doc(&doc) {
            Ok(v) => v,
            Err(e) => {
                eprintln!("Failed to retrieve title from page for {:1}. {:2}", url, e);
                String::new()
            }
        },
        body_text: doc.html(),
        cover_img: scrape_cover_image(&doc),
    };

    // println!("Cover is {:?}", page.cover_img.clone().unwrap_or_default());

    Ok(page)
}

// Retrieve a web page from a URL
pub async fn get_page_doc(url: &String) -> Result<Html, Box<dyn Error + Send + Sync>> {
    let doc_text: String = match fetch_url_to_string(&url).await {
        Ok(v) => v,
        Err(e) => return Err(e),
    };
    let doc = Html::parse_document(&doc_text);

    Ok(doc)
}

pub fn scrape_title_from_doc(doc: &Html) -> Result<String, Box<dyn Error>> {
    let title_selector = Selector::parse("title").unwrap();
    let Some(node_title) = doc.select(&title_selector).next() else {
        return Ok(String::new());
    };
    let title = node_title.text().collect::<Vec<_>>().join(&String::new());

    Ok(title)
}

pub fn scrape_title(doc_text: &String) -> Result<String, Box<dyn Error>> {
    let doc = Html::parse_document(doc_text);
    let title = scrape_title_from_doc(&doc).unwrap();

    Ok(title)
}

pub fn scrape_paragraphs(doc: &Html) -> Result<String, Box<dyn Error>> {
    let p_selector = Selector::parse("p").unwrap();

    let paragraphs = doc.select(&p_selector);
    let text: String = paragraphs
        .map(|p| p.text().collect::<String>() + " ")
        .collect();

    Ok(text)
}

pub fn scrape_feed_url_from_page(html_string: &str) -> Option<String> {
    let doc = Html::parse_document(html_string);

    let link_selector = Selector::parse("link[type=\"application/rss+xml\"]").unwrap();
    if let Some(link) = doc.select(&link_selector).next() {
        if let Some(url) = link.attr("href") {
            return Some(url.into());
        }
    };

    None
}

#[test]
fn test_scrape_paragraphs() {
    let markup =
        "<body><div>Hello this is a div</div><div><p>Hello <span>this <strong>is</strong></span> the <i>text</i>.</p></div></body>";
    let doc = Html::parse_document(markup);
    let text = scrape_paragraphs(&doc).unwrap();
    assert_eq!("Hello this is the text.", text);
}

pub fn scrape_paragraphs_from_text(doc_text: &String) -> Result<String, Box<dyn Error>> {
    let doc = Html::parse_document(doc_text);
    scrape_paragraphs(&doc)
}

pub fn scrape_cover_image(doc: &Html) -> Option<String> {
    match scrape_cover_images_og(&doc) {
        Ok(v) => Some(v),
        Err(_e) => {
            // eprintln!("Failed to retrieve cover image og, {}", e);
            None
        }
    }
}

pub fn scrape_cover_images_og(doc: &Html) -> Result<String, Box<dyn Error>> {
    let og_image_selector = Selector::parse("meta[property=\"og:image\"]").unwrap();
    let node_og_image_res = doc.select(&og_image_selector).next();

    if node_og_image_res.is_none() {
        return Err("No image found".into());
    }

    let node_og_image = node_og_image_res.unwrap();
    let (_k, img_src) = node_og_image
        .value()
        .attrs()
        .find(|a| a.0 == "content")
        .unwrap();

    Ok(img_src.into())
}

pub fn scrape_links(
    doc_text: &String,
    article_url_segment: &String,
) -> Result<Vec<String>, Box<dyn Error>> {
    let doc = Html::parse_document(doc_text);
    let article_link_pattern = format!("a[href*=\"{article_url_segment}\"]");
    // println!("Article link pattern is: {:?}", article_link_pattern);
    let article_link_selector = Selector::parse(&article_link_pattern).unwrap();

    let links: Vec<String> = doc
        .select(&article_link_selector)
        .map(|l| {
            let article_href = l.value().attr(&"href").unwrap_or("").to_string();

            article_href
        })
        .collect::<HashSet<String>>()
        .into_iter()
        .collect();

    Ok(links)
}
