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
