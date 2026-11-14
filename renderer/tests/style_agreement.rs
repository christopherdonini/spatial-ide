// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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
use spatial_renderer::compile;
use spatial_renderer::style::Rgb;

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
    let published: Vec<String> = v["published"]
        .as_array()
        .unwrap()
        .iter()
        .map(|s| s.as_str().unwrap().into())
        .collect();

    let compiled = compile(&style_src, &schema, &published).expect("the vector's style compiles");

    // 1. The canonical bytes, and therefore the hash the manifest carries.
    assert_eq!(
        compiled.canonical_json(),
        v["expected_canonical_json"].as_str().unwrap(),
        "canonical form drifted from the shared vector"
    );
    assert_eq!(
        compiled.style_hash(),
        v["expected_style_hash"].as_str().unwrap()
    );
    // …and the hash really is over those bytes, which is what the viewer checks.
    assert_eq!(
        compiled.style_hash(),
        sha256_hex(compiled.canonical_json().as_bytes())
    );

    // 2. Resolution, branch by branch. `null` is a NULL key, not an absent probe.
    //
    // **The non-empty assertion is the point of this line, not decoration.** Every resolution check
    // below lives inside this loop, so an empty `probes` array makes the whole cross-implementation
    // agreement vacuous while both languages' tests still report green — the agreement would then
    // rest on constants hardcoded separately in each. Demonstrated by emptying the vector: both
    // sides passed, resolving nothing.
    let probes = v["probes"].as_array().unwrap();
    assert!(
        !probes.is_empty(),
        "the shared vector declares no probes, so this test would assert nothing about resolution"
    );
    for probe in probes {
        let key = probe["key"].as_str();
        let d = compiled.resolve(key);
        let label = probe["key"].to_string();
        assert_eq!(
            hex(d.fill_color),
            probe["fill_color"].as_str().unwrap(),
            "fill_color at {label}"
        );
        assert_eq!(
            d.fill_opacity,
            probe["fill_opacity"].as_f64().unwrap(),
            "fill_opacity at {label}"
        );
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
    assert_eq!(
        compiled.legend().len(),
        v["expected_legend_rows"].as_u64().unwrap() as usize
    );
}

/// The match-key rule over the vector's typed rows: Rust admits a column as a match key exactly when
/// the row says `admitted`. The TypeScript reader of the same rows is `matchKeyRule.test.ts` in the
/// shell. The Arrow type is built here from its display string, which each row is checked to equal.
// RECORDED MUTATION for PB-U7 (the Rust side), applied alone: in renderer/tests/data/style-agreement.json set the Dictionary(Int32, Utf8) row's `admitted` to true.
// Expected failure: this test, at the Dictionary row.
// OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- `cargo test -p spatial-renderer --test style_agreement`, "the_match_key_rule_admits_exactly_the_vectors_admitted_rows": assertion `left == right` failed: admission of Dictionary(Int32, Utf8) (left: false, right: true). Reverted after observing.
#[test]
fn the_match_key_rule_admits_exactly_the_vectors_admitted_rows() {
    let v: serde_json::Value = serde_json::from_str(VECTOR).expect("agreement vector is JSON");
    let rows = v["match_key_rows"].as_array().unwrap();
    assert!(!rows.is_empty(), "the vector declares no match_key_rows, so this test would assert nothing");
    for row in rows {
        let spelled = row["arrow_type"].as_str().unwrap();
        let ty = match spelled {
            "Utf8" => DataType::Utf8,
            "LargeUtf8" => DataType::LargeUtf8,
            "Utf8View" => DataType::Utf8View,
            "UInt64" => DataType::UInt64,
            "Int32" => DataType::Int32,
            "Float64" => DataType::Float64,
            "Boolean" => DataType::Boolean,
            "Binary" => DataType::Binary,
            "Date32" => DataType::Date32,
            "Dictionary(Int32, Utf8)" => DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8)),
            other => panic!("the vector names an unhandled type `{other}`"),
        };
        assert_eq!(ty.to_string(), spelled, "the row's spelling is Arrow's display of the type");
        let style_src = serde_json::to_string(&v["style"]).unwrap().replace("\"zone\"", "\"key\"");
        let schema = vec![("key".to_string(), ty)];
        let admitted = compile(&style_src, &schema, &["key".to_string()]).is_ok();
        assert_eq!(admitted, row["admitted"].as_bool().unwrap(), "admission of {spelled}");
    }
}
