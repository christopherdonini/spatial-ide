//! Compiling a style document against a dataset schema, deterministically.
//!
//! `docs/06`: "Deterministic: same style + same data → identical style and layout *decisions*."
//! The compile here is a total function of `(document, schema, published projection)` — it reads no
//! clock, no environment and no filesystem, and it holds no interior mutability — so "deterministic"
//! is a property of the signature before it is a property of a test.
//!
//! ## What compiling adds over parsing
//!
//! Parsing ([`crate::style`]) establishes that the document is a well-formed style. Compiling
//! establishes that it is a style **for this dataset**: that the match column exists, that its type
//! can be a categorical key, and that it is actually in the published projection. All three are
//! typed errors here, at compile time — the brief's "mismatch is a typed error at style-compile
//! time, not a runtime surprise", and the third is what stops a bundle shipping a style the viewer
//! has nothing to bind.
//!
//! ## The legend is a function of the style, not of the data
//!
//! Every declared case appears in the legend whether or not any published feature carries it, plus
//! the two fallbacks. Deriving the legend from the *data* would make it filter-dependent — two
//! bundles of the same layer at different viewports would legend differently — and would make it
//! non-deterministic in exactly the place the style exists to be predictable.

use arrow::datatypes::DataType;

use crate::canonical::Json;
use crate::style::{parse, Rgb, StyleDocument, StyleError, Value};

/// One feature's resolved draw parameters. The whole output of the compile, per category.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct DrawParameters {
    pub fill_color: Rgb,
    pub fill_opacity: f64,
    pub outline_color: Rgb,
    pub outline_width: f64,
}

/// Which branch of the match a resolution took. Carried so a legend row, and any explanation of why
/// a feature looks the way it does, names the branch rather than only its colour.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum LegendKind {
    /// A value the style declares a case for.
    Case(String),
    /// The declared `on_null` behaviour.
    Null,
    /// The declared `on_unmatched` behaviour.
    Unmatched,
}

#[derive(Clone, Debug, PartialEq)]
pub struct LegendEntry {
    pub kind: LegendKind,
    pub draw: DrawParameters,
}

/// Which branch to take, as a type rather than as a sentinel string.
///
/// `Unmatched` cannot be expressed as "some value not in the case table" without inventing a value
/// that might one day be in it, which is how a legend row silently becomes a case row.
#[derive(Clone, Copy, Debug)]
enum Branch<'a> {
    Null,
    Value(&'a str),
    Unmatched,
}

/// A style document validated against a dataset, with its canonical bytes and hash.
#[derive(Clone, Debug)]
pub struct CompiledStyle {
    document: StyleDocument,
    canonical_json: String,
    style_hash: String,
    match_column: Option<String>,
    legend: Vec<LegendEntry>,
}

impl CompiledStyle {
    /// The canonical bytes. **These are what the bundle ships** — there is no second compiled
    /// artifact, because two representations of one style are two things that can disagree.
    pub fn canonical_json(&self) -> &str {
        &self.canonical_json
    }

    /// `sha256:<hex>` over [`Self::canonical_json`]'s bytes.
    pub fn style_hash(&self) -> &str {
        &self.style_hash
    }

    /// The one match column, if the document declares one.
    pub fn match_column(&self) -> Option<&str> {
        self.match_column.as_deref()
    }

    /// Declared cases in declaration order, then the two fallbacks. Empty when the style declares
    /// no match — a consequence stated rather than discovered: such a bundle carries no legend.
    pub fn legend(&self) -> &[LegendEntry] {
        &self.legend
    }

    pub fn document(&self) -> &StyleDocument {
        &self.document
    }

    /// Resolve one feature's draw parameters from its match-key value.
    ///
    /// `None` is a NULL key — a real value the source carries, not an absence the caller invented —
    /// and takes the declared `on_null` branch. A value with no declared case takes `on_unmatched`.
    pub fn resolve(&self, key: Option<&str>) -> DrawParameters {
        let branch = match key {
            None => Branch::Null,
            Some(v) => Branch::Value(v),
        };
        self.draw(branch)
    }

    fn draw(&self, branch: Branch<'_>) -> DrawParameters {
        DrawParameters {
            fill_color: pick(&self.document.fill_color, branch),
            fill_opacity: pick(&self.document.fill_opacity, branch),
            outline_color: pick(&self.document.outline_color, branch),
            outline_width: pick(&self.document.outline_width, branch),
        }
    }

    /// The style's identity as it appears in the manifest: path, hash, version.
    pub fn manifest_json(&self, path: &str) -> Json {
        Json::obj([
            ("path", Json::str(path)),
            ("content_hash", Json::str(self.style_hash.clone())),
            ("style_version", Json::Int(crate::style::STYLE_VERSION)),
            (
                "match_column",
                match &self.match_column {
                    Some(c) => Json::str(c.clone()),
                    None => Json::Null,
                },
            ),
        ])
    }
}

fn pick<T: Clone>(v: &Value<T>, branch: Branch<'_>) -> T {
    match v {
        Value::Literal(t) => t.clone(),
        Value::Match(m) => match branch {
            Branch::Null => m.on_null.clone(),
            Branch::Unmatched => m.on_unmatched.clone(),
            Branch::Value(s) => m
                .cases
                .iter()
                .find(|(w, _)| w == s)
                .map(|(_, t)| t.clone())
                .unwrap_or_else(|| m.on_unmatched.clone()),
        },
    }
}

/// Compile a style document against a dataset schema and the columns the bundle will publish.
///
/// `schema` is the dataset's columns; `published` is the projection the publish operation declared.
/// Both are needed: a match on a column that exists but is not published would compile against the
/// dataset and fail at view time, which is the runtime surprise this compile exists to prevent.
pub fn compile(
    src: &str,
    schema: &[(String, DataType)],
    published: &[String],
) -> Result<CompiledStyle, StyleError> {
    let document = parse(src)?;
    let match_column = document.match_column().map(|s| s.to_string());

    if let Some(column) = match_column.as_deref() {
        let field = schema.iter().find(|(n, _)| n == column).ok_or_else(|| {
            StyleError::MatchColumnMissing {
                column: column.to_string(),
                available: schema.iter().map(|(n, _)| n.clone()).collect(),
            }
        })?;
        admit_match_type(column, &field.1)?;
        if !published.iter().any(|p| p == column) {
            return Err(StyleError::MatchColumnNotPublished {
                column: column.to_string(),
                published: published.to_vec(),
            });
        }
    }

    let (canonical_json, style_hash) = document.canonical_and_hash()?;

    // Legend: declared cases in declaration order, then NULL, then unmatched. A function of the
    // style alone.
    let mut legend = Vec::new();
    if match_column.is_some() {
        let entry = |kind: LegendKind, branch: Branch<'_>, doc: &StyleDocument| LegendEntry {
            kind,
            draw: DrawParameters {
                fill_color: pick(&doc.fill_color, branch),
                fill_opacity: pick(&doc.fill_opacity, branch),
                outline_color: pick(&doc.outline_color, branch),
                outline_width: pick(&doc.outline_width, branch),
            },
        };
        for value in document.case_values() {
            legend.push(entry(LegendKind::Case(value.clone()), Branch::Value(&value), &document));
        }
        legend.push(entry(LegendKind::Null, Branch::Null, &document));
        legend.push(entry(LegendKind::Unmatched, Branch::Unmatched, &document));
    }

    Ok(CompiledStyle { document, canonical_json, style_hash, match_column, legend })
}

/// The categorical-key type test — **text only**, and the refusals name why.
///
/// A dictionary-encoded string is refused rather than unwrapped: a dictionary *index* is an ordinal,
/// which ADR-016 §4 names explicitly as a synthesized identity wearing a mapping's clothes, and the
/// bundle format carries no dictionaries at all (see the publish format declaration). Refusing here
/// keeps the style's admissible types and the format's admissible types the same set.
fn admit_match_type(column: &str, ty: &DataType) -> Result<(), StyleError> {
    match ty {
        DataType::Utf8 | DataType::LargeUtf8 | DataType::Utf8View => Ok(()),
        other => Err(StyleError::MatchColumnTypeInadmissible {
            column: column.to_string(),
            found: other.to_string(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const ZONE: &str = r##"{
      "style_version": 1,
      "layer": {
        "geometry": "polygon",
        "fill_color": {"match": {
          "column": "zone",
          "cases": [{"when": "residential", "then": "#aa3333"},
                    {"when": "industrial",  "then": "#333388"}],
          "on_null": "#888888",
          "on_unmatched": "#cccccc"}},
        "fill_opacity": {"literal": 0.8},
        "outline_color": {"literal": "#202020"},
        "outline_width": {"literal": 1.0}
      }
    }"##;

    fn schema() -> Vec<(String, DataType)> {
        vec![
            ("id".into(), DataType::UInt64),
            ("zone".into(), DataType::Utf8),
            ("area".into(), DataType::Float64),
        ]
    }

    fn published() -> Vec<String> {
        vec!["zone".into()]
    }

    fn rgb(r: u8, g: u8, b: u8) -> Rgb {
        Rgb { r, g, b }
    }

    #[test]
    fn the_categorical_path_resolves_every_branch_it_declares() {
        let c = compile(ZONE, &schema(), &published()).unwrap();
        assert_eq!(c.resolve(Some("residential")).fill_color, rgb(0xaa, 0x33, 0x33));
        assert_eq!(c.resolve(Some("industrial")).fill_color, rgb(0x33, 0x33, 0x88));
        // NULL is a value the source carries, and takes the declared branch.
        assert_eq!(c.resolve(None).fill_color, rgb(0x88, 0x88, 0x88));
        // A value nobody declared takes the other declared branch — never a built-in default.
        assert_eq!(c.resolve(Some("agricultural")).fill_color, rgb(0xcc, 0xcc, 0xcc));
        // Literal properties are unaffected by the key.
        for key in [Some("residential"), Some("nope"), None] {
            assert_eq!(c.resolve(key).fill_opacity, 0.8);
            assert_eq!(c.resolve(key).outline_color, rgb(0x20, 0x20, 0x20));
            assert_eq!(c.resolve(key).outline_width, 1.0);
        }
    }

    #[test]
    fn the_legend_is_a_function_of_the_style_and_not_of_any_data() {
        let c = compile(ZONE, &schema(), &published()).unwrap();
        let kinds: Vec<_> = c.legend().iter().map(|e| e.kind.clone()).collect();
        assert_eq!(
            kinds,
            vec![
                LegendKind::Case("residential".into()),
                LegendKind::Case("industrial".into()),
                LegendKind::Null,
                LegendKind::Unmatched,
            ]
        );
        // Declaration order, and every declared case present whether or not data carries it.
        assert_eq!(c.legend()[0].draw.fill_color, rgb(0xaa, 0x33, 0x33));
        assert_eq!(c.legend()[2].draw.fill_color, rgb(0x88, 0x88, 0x88));
        assert_eq!(c.legend()[3].draw.fill_color, rgb(0xcc, 0xcc, 0xcc));
    }

    #[test]
    fn an_all_literal_style_compiles_and_carries_no_legend() {
        let src = r##"{"style_version":1,"layer":{"geometry":"polygon",
          "fill_color":{"literal":"#123456"},"fill_opacity":{"literal":1.0},
          "outline_color":{"literal":"#000000"},"outline_width":{"literal":0.5}}}"##;
        let c = compile(src, &schema(), &[]).unwrap();
        assert!(c.legend().is_empty());
        assert_eq!(c.match_column(), None);
    }

    #[test]
    fn a_match_on_a_missing_column_is_refused_at_compile_not_at_view_time() {
        let src = ZONE.replace("\"zone\"", "\"district\"");
        match compile(&src, &schema(), &["district".to_string()]).unwrap_err() {
            StyleError::MatchColumnMissing { column, available } => {
                assert_eq!(column, "district");
                assert!(available.contains(&"zone".to_string()));
            }
            other => panic!("{other:?}"),
        }
    }

    #[test]
    fn a_match_on_a_non_text_column_is_refused() {
        let src = ZONE.replace("\"column\": \"zone\"", "\"column\": \"area\"");
        assert!(matches!(
            compile(&src, &schema(), &["area".to_string()]).unwrap_err(),
            StyleError::MatchColumnTypeInadmissible { .. }
        ));
        // A dictionary-encoded string is refused too: its index is an ordinal, and the bundle
        // format carries no dictionaries.
        let dict = vec![(
            "zone".to_string(),
            DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8)),
        )];
        assert!(matches!(
            compile(ZONE, &dict, &published()).unwrap_err(),
            StyleError::MatchColumnTypeInadmissible { .. }
        ));
    }

    #[test]
    fn a_match_on_an_unpublished_column_is_refused_before_the_bundle_is_written() {
        // The column exists in the dataset, so a dataset-only check would pass and the viewer would
        // then have nothing to bind.
        match compile(ZONE, &schema(), &["area".to_string()]).unwrap_err() {
            StyleError::MatchColumnNotPublished { column, published } => {
                assert_eq!(column, "zone");
                assert_eq!(published, vec!["area".to_string()]);
            }
            other => panic!("{other:?}"),
        }
    }

    #[test]
    fn compiling_twice_gives_identical_bytes_hash_and_draw_parameters() {
        let a = compile(ZONE, &schema(), &published()).unwrap();
        let b = compile(ZONE, &schema(), &published()).unwrap();
        assert_eq!(a.canonical_json(), b.canonical_json());
        assert_eq!(a.style_hash(), b.style_hash());
        assert_eq!(a.legend(), b.legend());
    }

    /// The property the brief asks to be property-tested: over a seeded space of case tables and
    /// probe keys, compilation is deterministic and resolution goes through the declared table —
    /// never through position, and never through a built-in default.
    #[test]
    fn property_the_categorical_path_is_deterministic_and_table_driven() {
        let mut state = 0x5EED_2056_0000_00C1u64;
        let mut next = || {
            state = state.wrapping_add(0x9E37_79B9_7F4A_7C15);
            let mut z = state;
            z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
            z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
            z ^ (z >> 31)
        };

        for trial in 0..400u64 {
            let n = (next() % 8 + 1) as usize;
            let cases: Vec<(String, Rgb)> = (0..n)
                .map(|i| {
                    let v = next();
                    (
                        format!("cat-{trial}-{i}"),
                        Rgb { r: (v & 0xff) as u8, g: (v >> 8 & 0xff) as u8, b: (v >> 16 & 0xff) as u8 },
                    )
                })
                .collect();
            let null_c = Rgb { r: 1, g: 2, b: 3 };
            let unmatched_c = Rgb { r: 4, g: 5, b: 6 };

            let case_json: Vec<String> = cases
                .iter()
                .map(|(w, c)| format!("{{\"when\":\"{w}\",\"then\":\"{}\"}}", c.to_hex()))
                .collect();
            let src = format!(
                "{{\"style_version\":1,\"layer\":{{\"geometry\":\"polygon\",\
                  \"fill_color\":{{\"match\":{{\"column\":\"zone\",\"cases\":[{}],\
                    \"on_null\":\"{}\",\"on_unmatched\":\"{}\"}}}},\
                  \"fill_opacity\":{{\"literal\":1.0}},\"outline_color\":{{\"literal\":\"#000000\"}},\
                  \"outline_width\":{{\"literal\":1.0}}}}}}",
                case_json.join(","),
                null_c.to_hex(),
                unmatched_c.to_hex()
            );

            let a = compile(&src, &schema(), &published()).unwrap();
            let b = compile(&src, &schema(), &published()).unwrap();
            assert_eq!(a.canonical_json(), b.canonical_json(), "compile is not deterministic");
            assert_eq!(a.style_hash(), b.style_hash());

            // Every declared case resolves to its own declared colour — so a lookup by value, not
            // a lookup by position, which is the property that survives reordering.
            for (w, c) in &cases {
                assert_eq!(a.resolve(Some(w)).fill_color, *c, "case `{w}`");
            }
            assert_eq!(a.resolve(None).fill_color, null_c);
            assert_eq!(a.resolve(Some("definitely-not-declared")).fill_color, unmatched_c);

            // …and the legend has exactly one row per declared case plus the two fallbacks.
            assert_eq!(a.legend().len(), cases.len() + 2);
        }
    }
}
