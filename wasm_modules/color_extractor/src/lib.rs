use image::{GenericImageView, Pixel};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Color {
    r: u8,
    g: u8,
    b: u8,
}

#[wasm_bindgen]
impl Color {
    #[wasm_bindgen(getter)]
    pub fn r(&self) -> u8 {
        self.r
    }

    #[wasm_bindgen(getter)]
    pub fn g(&self) -> u8 {
        self.g
    }

    #[wasm_bindgen(getter)]
    pub fn b(&self) -> u8 {
        self.b
    }

    #[wasm_bindgen]
    pub fn hex(&self) -> String {
        format!("#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
    }
}

#[wasm_bindgen]
pub fn extract_palette(image_data: &[u8], count: usize) -> Vec<Color> {
    let Ok(img) = image::load_from_memory(image_data) else {
        return vec![];
    };

    let mut buckets = std::collections::HashMap::<(u8, u8, u8), u32>::new();

    for (_, _, pixel) in img.pixels() {
        let rgb = pixel.to_rgb();
        // Quantize to reduce noise and speed up histogram collection.
        let key = (
            (rgb[0] / 16) * 16,
            (rgb[1] / 16) * 16,
            (rgb[2] / 16) * 16,
        );
        *buckets.entry(key).or_insert(0) += 1;
    }

    let mut entries: Vec<_> = buckets.into_iter().collect();
    entries.sort_by(|a, b| b.1.cmp(&a.1));

    entries
        .into_iter()
        .take(count.max(1).min(10))
        .map(|((r, g, b), _)| Color { r, g, b })
        .collect()
}

#[wasm_bindgen]
pub fn hex_to_rgb(hex: &str) -> Color {
    let cleaned = hex.trim().trim_start_matches('#');
    if cleaned.len() != 6 {
        return Color { r: 0, g: 0, b: 0 };
    }

    let r = u8::from_str_radix(&cleaned[0..2], 16).unwrap_or(0);
    let g = u8::from_str_radix(&cleaned[2..4], 16).unwrap_or(0);
    let b = u8::from_str_radix(&cleaned[4..6], 16).unwrap_or(0);

    Color { r, g, b }
}
