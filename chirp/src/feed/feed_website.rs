use futures::future::join_all;
use std::{borrow::Borrow, error::Error, vec};

use crate::{
    db::content::db_check_content_existing_urls,
    entities::{FullContent, Source, SourceKind},
    scraping::page::{contents_from_page, scrape_links, scrape_title},
    utils::fully_form_url,
};

use super::feed_enrichment::enrich_content_further;

pub async fn parse_website(
    s_id: &i32,
    url: &String,
    doc_text: &String,
    article_url_segment: &String,
) -> Result<(Source, Vec<FullContent>), Box<dyn Error + Send + Sync>> {
    if article_url_segment.is_empty() {
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
        data: vec![("article_url_segment".into(), article_url_segment.into())],
    };

    let website_contents_res: Result<Vec<FullContent>, Box<dyn Error + Send + Sync>> =
        parse_web_articles(url, &doc_text, article_url_segment).await;

    if let Err(e) = website_contents_res {
        eprint!(
            "Could not find or retrieve articles for provided URL and path pattern.\n{:?}\n",
            e
        );
        return Err("Could not find or retrieve articles".into());
    }

    let mut website_contents: Vec<FullContent> = website_contents_res
        .unwrap()
        .into_iter()
        .map(|mut c| {
            c.content.source_id = s_id.to_owned();
            return c;
        })
        .into_iter()
        .collect::<Vec<FullContent>>();

    website_contents = enrich_content_further(website_contents).await;

    Ok((website_source, website_contents))
}

const MAX_ARTICLES_TO_CRAWL: usize = 30;

pub async fn parse_web_articles(
    url: &String,
    doc_text: &String,
    article_url_segment: &String,
) -> Result<Vec<FullContent>, Box<dyn Error + Send + Sync>> {
    let article_links = scrape_links(&doc_text, &article_url_segment.to_string()).unwrap();
    let article_urls: Vec<String> = article_links
        .into_iter()
        .filter_map(|href| fully_form_url(url, &href).ok())
        .collect();
    if article_urls.is_empty() {
        return Err("No article links found".into());
    }

    println!("Urls found {:?}", article_urls.len());

    let urls_already_crawled: Vec<String> = db_check_content_existing_urls(&article_urls)?;

    println!("Urls already crawled {:?}", urls_already_crawled.len());

    // note the way into_iter works means it consumes the vector, so it must be cloned in each instance of filter,
    // or alternatively use borrows
    let urls_to_crawl: Vec<String> = article_urls
        .into_iter()
        .filter(|url| {
            (urls_already_crawled.borrow() as &Vec<String>)
                .into_iter()
                .find(|existing_url| &url == existing_url)
                .is_none()
        })
        .take(MAX_ARTICLES_TO_CRAWL)
        .collect();

    println!("Urls to crawl {:?}", urls_to_crawl.len());

    let articles_being_retrieved = urls_to_crawl
        .into_iter()
        // .map(|p_url| contents_from_article(p_url.to_string()));
        .map(|p_url| contents_from_page(p_url.to_string()));

    let website_contents: Vec<FullContent> = join_all(articles_being_retrieved)
        .await
        .into_iter()
        .filter(|af| af.is_ok())
        .map(|r| r.unwrap())
        .collect();

    Ok(website_contents)
}
