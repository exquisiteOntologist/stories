use article_scraper::ArticleScraper;
use chrono::{DateTime, Utc};
use reqwest::Client;
use url::Url;

pub struct ScrapedArticle {
    pub title: Option<String>,
    pub author: Option<String>,
    pub url: Url,
    pub date: Option<DateTime<Utc>>,
    pub thumbnail_url: Option<String>,
    pub html: Option<String>,
}

pub async fn article_scraper(article_url: &str) -> ScrapedArticle {
    let scraper = ArticleScraper::new(None).await;
    let url = Url::parse(article_url).unwrap();
    let client = Client::new();
    let scraped = scraper.parse(&url, false, &client, None).await.unwrap();
    let article = ScrapedArticle {
        title: scraped.title,
        author: scraped.author,
        url: scraped.url,
        date: scraped.date,
        thumbnail_url: scraped.thumbnail_url,
        html: scraped.html,
    };
    article
}

pub fn strip_html_tags_from_string(html: &str) -> String {
    let mut html_out: String = String::new();
    let mut within_bracket = false;
    for c in html.chars() {
        let is_opening = !within_bracket && c == '<';
        let is_closing = !is_opening && c == '>';

        if is_opening {
            within_bracket = true;
        }

        if within_bracket == false {
            html_out.push(c);
        }

        if is_closing {
            within_bracket = false;
        }
    }

    html_out
}

#[cfg(test)]
mod tests {
    use crate::scraping::articles::{article_scraper, strip_html_tags_from_string};

    #[tokio::test]
    async fn get_live_article_content() {
        let article_url = "https://www.nytimes.com/interactive/2023/04/21/science/parrots-video-chat-facetime.html";
        let article = article_scraper(article_url).await;
        let html = article.html.unwrap();
        print!("article \n {:?}", html);
        assert!(html.is_empty() == false);
    }

    #[test]
    fn remove_tags_from_html() {
        const HTML_IN: &str = "
            <div>
                <hr />
                <h1>Howdy</h1>
                <main>
                    <div>Yay</div>
                    What?
                </main>
            </div>
        ";
        assert!(HTML_IN.find("<").is_none() == false);
        let html_stripped = strip_html_tags_from_string(HTML_IN);
        print!("text without tags: \n {:?}", html_stripped);
        assert!(html_stripped.find("<").is_none() == true);
        assert!(html_stripped.find("Howdy").is_none() == false);
        assert!(html_stripped.find("Yay").is_none() == false);
        assert!(html_stripped.find("What").is_none() == false);
    }
}
