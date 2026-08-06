//! The style's meaning is a **cross-implementation** contract, and this is where that is pinned.
//!
//! Style v0 is compiled in Rust at publish and read again in TypeScript by the bundle viewer. Two
//! implementations of one resolution rule is exactly the shape in which a style silently means two
//! things — the publisher's legend saying one thing and the drawn map another, with nothing raised.
//! `docs/06` requires "same style + same data → identical style and layout *decisions*", and a
//! per-language test proves that only per language.
//!
//! So the agreement vector lives in `tests/data/style-agreement.json` and **both** implementations
//! read it: this test, and `renderer/bundle-viewer/scripts/style-agreement.test.mjs`. Neither
//! generates it from its own output.
//!
//! It also pins the canonicalization and the hash, which is what makes the viewer's
//! `style-hash-mismatch` state meaningful: the viewer verifies the hash of the **stored** bytes and
//! never re-canonicalizes, so the two sides must agree on what those bytes are.

use spatial_renderer::canonical::sha256_hex;
use spatial_renderer::style::Rgb;
use spatial_renderer::compile;

use arrow::datatypes::DataType;

const VECTOR: &str = include_str!("data/style-agreement.json");

fn hex(c: Rgb) -> String {
    c.to_hex()
}

#[test]
fn rust_agrees_with_the_shared_vector_that_typescript_also_reads() {
    let v: serde_json::Value = serde_json::from_str(VECTOR).expect("agreement vector is JSON");

    // The style is embedded as a JSON value, not a string, so the file stays reviewable as one
    // document rather than as an escaped blob.
    let style_src = serde_json::to_string(&v["style"]).unwrap();

    let schema: Vec<(String, DataType)> = v["schema"]
        .as_array()
        .unwrap()
        .iter()
        .map(|c| {
            let name = c["name"].as_str().unwrap().to_string();
            let ty = match c["type"].as_str().unwrap() {
                "utf8" => DataType::Utf8,
                "uint64" => DataType::UInt64,
                "float64" => DataType::Float64,
                other => panic!("the vector names an unhandled type `{other}`"),
            };
            (name, ty)
        })
        .collect();
    let published: Vec<String> =
        v["published"].as_array().unwrap().iter().map(|s| s.as_str().unwrap().into()).collect();

    let compiled = compile(&style_src, &schema, &published).expect("the vector's style compiles");

    // 1. The canonical bytes, and therefore the hash the manifest carries.
    assert_eq!(
        compiled.canonical_json(),
        v["expected_canonical_json"].as_str().unwrap(),
        "canonical form drifted from the shared vector"
    );
    assert_eq!(compiled.style_hash(), v["expected_style_hash"].as_str().unwrap());
    // …and the hash really is over those bytes, which is what the viewer checks.
    assert_eq!(compiled.style_hash(), sha256_hex(compiled.canonical_json().as_bytes()));

    // 2. Resolution, branch by branch. `null` is a NULL key, not an absent probe.
    for probe in v["probes"].as_array().unwrap() {
        let key = probe["key"].as_str();
        let d = compiled.resolve(key);
        let label = probe["key"].to_string();
        assert_eq!(hex(d.fill_color), probe["fill_color"].as_str().unwrap(), "fill_color at {label}");
        assert_eq!(d.fill_opacity, probe["fill_opacity"].as_f64().unwrap(), "fill_opacity at {label}");
        assert_eq!(
            hex(d.outline_color),
            probe["outline_color"].as_str().unwrap(),
            "outline_color at {label}"
        );
        assert_eq!(
            d.outline_width,
            probe["outline_width"].as_f64().unwrap(),
            "outline_width at {label}"
        );
    }

    // 3. The legend's shape: one row per declared case, then NULL, then unmatched.
    assert_eq!(compiled.legend().len(), v["expected_legend_rows"].as_u64().unwrap() as usize);
}
