use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct PdfOptions {
    pub page_size: Option<String>,
    pub margin_mm: Option<f32>,
    pub title: Option<String>,
    pub author: Option<String>,
}

#[wasm_bindgen]
pub fn normalize_pdf_job(html: &str, options_json: &str) -> String {
    let options: PdfOptions = serde_json::from_str(options_json).unwrap_or(PdfOptions {
        page_size: Some("a4".to_string()),
        margin_mm: Some(12.0),
        title: None,
        author: None,
    });

    serde_json::json!({
        "html": html,
        "options": {
            "pageSize": options.page_size.unwrap_or_else(|| "a4".to_string()),
            "marginMm": options.margin_mm.unwrap_or(12.0),
            "title": options.title,
            "author": options.author
        }
    })
    .to_string()
}
