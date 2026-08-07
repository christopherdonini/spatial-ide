// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Style v0 — the typed, versioned style **document**: its schema, its refusals, and its canonical
//! form.
//!
//! `docs/03` calls for style-as-code: "A typed, diffable style DSL. The style editor is a GUI over
//! the DSL, not a separate system." `docs/06` requires the compile to be deterministic — "same style
//! + same data → identical style and layout *decisions*". `docs/02` puts style compilation in this
//! module. This file is the document half; [`crate::compiled`] is the compile half.
//!
//! ## What v0 is, stated as a ceiling rather than as a roadmap
//!
//! Four properties over polygons — fill colour, fill opacity, outline colour, outline width — whose
//! values are **literals plus at most one categorical `match`** over a named text column. A second
//! `match` anywhere in the document is a typed error, not a last-one-wins.
//!
//! Everything else is **refused by the schema**, never ignored: labels, icons, scale-dependent
//! rules, any general expression language. An unknown key is an error naming the key, because a
//! style that silently drops half of what its author wrote is the "black box" `docs/01` principle 8
//! forbids, and a style file is meant to be diffable and reviewable text.
//!
//! ## The two fallbacks are mandatory, and that is the whole point of the match
//!
//! `on_null` and `on_unmatched` are **required members**. Omitting either is a compile error rather
//! than a default, because the two questions a categorical style always faces — "what does a row
//! with no value look like" and "what does a value nobody declared look like" — are exactly the ones
//! a default answers invisibly. The legend then carries both, so a viewer's reader can see what they
//! render as without reading the style.
//!
//! ## One match, one document, one hash
//!
//! The canonical form is produced by [`crate::canonical`], and the style's hash is taken over those
//! bytes. **The bundle ships the canonical bytes themselves**, not a second "compiled" artifact:
//! two representations of one style would be two sources of truth, and a consumer that
//! re-canonicalizes to check a hash is trusting its own serializer rather than the bytes it was
//! given. A reader verifies the hash of the stored bytes and reads those.

use std::collections::BTreeSet;

use crate::canonical::{self, Json};

/// The only style document version this build implements.
pub const STYLE_VERSION: i64 = 1;

/// The only geometry v0 styles.
pub const GEOMETRY_POLYGON: &str = "polygon";

/// Outline width ceiling, in CSS pixels. Declared rather than discovered (ADR-010 rule 6): a width
/// large enough to cover the canvas turns "styled" into "blank", and a ceiling is cheaper than
/// discovering that in a published bundle.
pub const MAX_OUTLINE_WIDTH: f64 = 64.0;

/// Cases one `match` may declare. Declared because the legend renders one row per case and the
/// resolution table is carried into every consumer.
pub const MAX_MATCH_CASES: usize = 64;

/// Keys that name a v0-excluded construct. Recognised **only** to make the refusal say why; they are
/// refused by the same unknown-key rule as any other stray key, not by a special path.
const V0_EXCLUDED: &[(&str, &str)] = &[
    ("label", "labels"),
    ("labels", "labels"),
    ("text", "labels"),
    ("icon", "icons"),
    ("icons", "icons"),
    ("marker", "icons"),
    ("min_zoom", "scale-dependent rules"),
    ("max_zoom", "scale-dependent rules"),
    ("zoom", "scale-dependent rules"),
    ("scale", "scale-dependent rules"),
    ("expression", "an expression language"),
    ("expr", "an expression language"),
    ("filter", "an expression language"),
    ("case", "an expression language"),
    ("interpolate", "an expression language"),
];

/// An 8-bit-per-channel opaque colour. Alpha is `fill_opacity`, deliberately separate: one place to
/// declare transparency beats two that can disagree.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct Rgb {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl Rgb {
    /// Canonical spelling: `#` then six **lowercase** hex digits.
    pub fn to_hex(self) -> String {
        format!("#{:02x}{:02x}{:02x}", self.r, self.g, self.b)
    }

    fn parse(s: &str) -> Option<Self> {
        let hex = s.strip_prefix('#')?;
        if hex.len() != 6 || !hex.bytes().all(|b| b.is_ascii_hexdigit()) {
            return None;
        }
        let byte = |i: usize| u8::from_str_radix(&hex[i..i + 2], 16).ok();
        Some(Self { r: byte(0)?, g: byte(2)?, b: byte(4)? })
    }
}

/// A categorical match over one named column.
///
/// The key type is `String` because v0 admits **text columns only** as match keys. Float equality is
/// a wrong-but-plausible trap (`docs/01` principle 8) and integer keys would reopen the number
/// grammar question inside the style document for no benefit; both are refused at compile against
/// the dataset schema, and this type is what makes that refusal structural rather than remembered.
#[derive(Clone, Debug, PartialEq)]
pub struct CategoricalMatch<T> {
    pub column: String,
    /// Declaration order, which is legend order. Duplicate `when` values are refused, so the order
    /// is a presentation choice and never a precedence one.
    pub cases: Vec<(String, T)>,
    pub on_null: T,
    pub on_unmatched: T,
}

/// A property's value: a literal, or the document's one match.
#[derive(Clone, Debug, PartialEq)]
pub enum Value<T> {
    Literal(T),
    Match(CategoricalMatch<T>),
}

impl<T> Value<T> {
    pub fn match_column(&self) -> Option<&str> {
        match self {
            Self::Literal(_) => None,
            Self::Match(m) => Some(&m.column),
        }
    }
}

/// A parsed, schema-valid style document.
#[derive(Clone, Debug, PartialEq)]
pub struct StyleDocument {
    pub fill_color: Value<Rgb>,
    pub fill_opacity: Value<f64>,
    pub outline_color: Value<Rgb>,
    pub outline_width: Value<f64>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum StyleError {
    /// The bytes are not JSON at all.
    NotJson { detail: String },
    /// A version this build does not implement. **Refused, never read best-effort** — a reader that
    /// guesses at a future version's meaning is the silent-conversion failure one level up.
    UnsupportedVersion { found: i64, supported: i64 },
    MissingKey { at: String, key: String },
    /// A key the schema does not define. `excluded_construct` is set when the key names something
    /// v0 deliberately does not have, so the refusal says *why* rather than only *that*.
    UnknownKey { at: String, key: String, excluded_construct: Option<&'static str> },
    TypeMismatch { at: String, expected: &'static str },
    BadColor { at: String, found: String },
    OutOfRange { at: String, value: f64, min: f64, max: f64 },
    /// Two `match` constructs. v0's value vocabulary is "literals plus one match"; a second one is
    /// refused rather than resolved by position.
    MoreThanOneMatch { first_at: String, second_at: String },
    DuplicateCase { at: String, value: String },
    MatchHasNoCases { at: String },
    TooManyCases { at: String, cases: usize, limit: usize },
    /// The match names a column the dataset does not have.
    MatchColumnMissing { column: String, available: Vec<String> },
    /// The match names a column whose type cannot be a categorical key.
    MatchColumnTypeInadmissible { column: String, found: String },
    /// The match column exists in the dataset but is not in the published projection, so a viewer
    /// would have nothing to bind the style to. Caught at compile, not at view time.
    MatchColumnNotPublished { column: String, published: Vec<String> },
    Canonical(canonical::CanonicalError),
}

impl std::fmt::Display for StyleError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotJson { detail } => write!(f, "style: not JSON — {detail}"),
            Self::UnsupportedVersion { found, supported } => write!(
                f,
                "style: `style_version` is {found}; this build implements {supported} and refuses \
                 versions it does not implement rather than reading them best-effort"
            ),
            Self::MissingKey { at, key } => write!(
                f,
                "style: `{key}` is required at {at} and is absent. v0 has no defaults — a fallback \
                 nobody declared is a decision nobody can see"
            ),
            Self::UnknownKey { at, key, excluded_construct } => match excluded_construct {
                Some(c) => write!(
                    f,
                    "style: `{key}` at {at} names {c}, which style v0 deliberately does not have. \
                     Refused rather than ignored, so a style is never silently half-applied"
                ),
                None => write!(f, "style: `{key}` at {at} is not part of the style v0 schema"),
            },
            Self::TypeMismatch { at, expected } => {
                write!(f, "style: the value at {at} must be {expected}")
            }
            Self::BadColor { at, found } => write!(
                f,
                "style: `{found}` at {at} is not a colour; v0 spells colours `#rrggbb`"
            ),
            Self::OutOfRange { at, value, min, max } => {
                write!(f, "style: {value} at {at} is outside the admissible range {min}..={max}")
            }
            Self::MoreThanOneMatch { first_at, second_at } => write!(
                f,
                "style: v0 admits literals plus **one** categorical match; there is one at \
                 {first_at} and another at {second_at}"
            ),
            Self::DuplicateCase { at, value } => write!(
                f,
                "style: `{value}` is declared twice in the cases at {at}; which one wins would be a \
                 precedence rule nobody wrote down"
            ),
            Self::MatchHasNoCases { at } => write!(
                f,
                "style: the match at {at} declares no cases, so every feature would take a fallback"
            ),
            Self::TooManyCases { at, cases, limit } => {
                write!(f, "style: the match at {at} declares {cases} cases, above the declared limit of {limit}")
            }
            Self::MatchColumnMissing { column, available } => write!(
                f,
                "style: the match names column `{column}`, which the dataset does not have \
                 (it has: {})",
                available.join(", ")
            ),
            Self::MatchColumnTypeInadmissible { column, found } => write!(
                f,
                "style: match column `{column}` is {found}; style v0 matches on text columns only. \
                 Matching on a float would decide equality on a value that rarely compares equal, \
                 and would be wrong in a way nobody sees"
            ),
            Self::MatchColumnNotPublished { column, published } => write!(
                f,
                "style: match column `{column}` is in the dataset but not in the published \
                 projection ({}), so the bundle would carry a style the viewer cannot bind",
                if published.is_empty() { "none".to_string() } else { published.join(", ") }
            ),
            Self::Canonical(e) => write!(f, "style: {e}"),
        }
    }
}

impl std::error::Error for StyleError {}

impl From<canonical::CanonicalError> for StyleError {
    fn from(e: canonical::CanonicalError) -> Self {
        Self::Canonical(e)
    }
}

/// Parse and validate a style document. Schema validation against a dataset is [`crate::compiled`].
pub fn parse(src: &str) -> Result<StyleDocument, StyleError> {
    let root: serde_json::Value =
        serde_json::from_str(src).map_err(|e| StyleError::NotJson { detail: e.to_string() })?;
    let root = obj(&root, "$")?;

    known_keys(root, "$", &["style_version", "layer"])?;

    let version = root
        .get("style_version")
        .ok_or_else(|| StyleError::MissingKey { at: "$".into(), key: "style_version".into() })?;
    let version = version
        .as_i64()
        .ok_or(StyleError::TypeMismatch { at: "$.style_version".into(), expected: "an integer" })?;
    if version != STYLE_VERSION {
        return Err(StyleError::UnsupportedVersion { found: version, supported: STYLE_VERSION });
    }

    let layer = root
        .get("layer")
        .ok_or_else(|| StyleError::MissingKey { at: "$".into(), key: "layer".into() })?;
    let layer = obj(layer, "$.layer")?;
    known_keys(
        layer,
        "$.layer",
        &["geometry", "fill_color", "fill_opacity", "outline_color", "outline_width"],
    )?;

    let geometry = layer
        .get("geometry")
        .ok_or_else(|| StyleError::MissingKey { at: "$.layer".into(), key: "geometry".into() })?
        .as_str()
        .ok_or(StyleError::TypeMismatch {
            at: "$.layer.geometry".into(),
            expected: "the string \"polygon\"",
        })?;
    if geometry != GEOMETRY_POLYGON {
        return Err(StyleError::TypeMismatch {
            at: "$.layer.geometry".into(),
            expected: "the string \"polygon\" — style v0 is polygons only",
        });
    }

    // Tracks where the document's one permitted match was found, so a second one can be refused
    // naming both sites rather than only the offender.
    let mut match_site: Option<String> = None;

    let fill_color = value(layer, "$.layer", "fill_color", &mut match_site, parse_color)?;
    let fill_opacity =
        value(layer, "$.layer", "fill_opacity", &mut match_site, |v, at| number(v, at, 0.0, 1.0))?;
    let outline_color = value(layer, "$.layer", "outline_color", &mut match_site, parse_color)?;
    let outline_width = value(layer, "$.layer", "outline_width", &mut match_site, |v, at| {
        number(v, at, 0.0, MAX_OUTLINE_WIDTH)
    })?;

    Ok(StyleDocument { fill_color, fill_opacity, outline_color, outline_width })
}

/// The document's single match column, if it declares one.
impl StyleDocument {
    pub fn match_column(&self) -> Option<&str> {
        self.fill_color
            .match_column()
            .or_else(|| self.fill_opacity.match_column())
            .or_else(|| self.outline_color.match_column())
            .or_else(|| self.outline_width.match_column())
    }

    /// The declared case values, in declaration order. Legend order.
    pub fn case_values(&self) -> Vec<String> {
        fn from<T: Clone>(v: &Value<T>) -> Option<Vec<String>> {
            match v {
                Value::Literal(_) => None,
                Value::Match(m) => Some(m.cases.iter().map(|(k, _)| k.clone()).collect()),
            }
        }
        from(&self.fill_color)
            .or_else(|| from(&self.fill_opacity))
            .or_else(|| from(&self.outline_color))
            .or_else(|| from(&self.outline_width))
            .unwrap_or_default()
    }

    /// The canonical JSON form, in the schema's declared key order.
    pub fn to_canonical_json(&self) -> Json {
        Json::obj([
            ("style_version", Json::Int(STYLE_VERSION)),
            (
                "layer",
                Json::obj([
                    ("geometry", Json::str(GEOMETRY_POLYGON)),
                    ("fill_color", value_json(&self.fill_color, color_json)),
                    ("fill_opacity", value_json(&self.fill_opacity, |o| Json::Double(*o))),
                    ("outline_color", value_json(&self.outline_color, color_json)),
                    ("outline_width", value_json(&self.outline_width, |w| Json::Double(*w))),
                ]),
            ),
        ])
    }

    /// The canonical bytes and their `sha256:` hash — the pair the bundle carries.
    pub fn canonical_and_hash(&self) -> Result<(String, String), StyleError> {
        Ok(canonical::canonical_and_hash(&self.to_canonical_json())?)
    }
}

fn color_json(c: &Rgb) -> Json {
    Json::str(c.to_hex())
}

fn value_json<T>(v: &Value<T>, leaf: impl Fn(&T) -> Json) -> Json {
    match v {
        Value::Literal(t) => Json::obj([("literal", leaf(t))]),
        Value::Match(m) => Json::obj([(
            "match",
            Json::obj([
                ("column", Json::str(m.column.clone())),
                (
                    "cases",
                    Json::Arr(
                        m.cases
                            .iter()
                            .map(|(w, t)| {
                                Json::obj([("when", Json::str(w.clone())), ("then", leaf(t))])
                            })
                            .collect(),
                    ),
                ),
                ("on_null", leaf(&m.on_null)),
                ("on_unmatched", leaf(&m.on_unmatched)),
            ]),
        )]),
    }
}

// ---------------------------------------------------------------------------------------------
// parsing helpers
// ---------------------------------------------------------------------------------------------

type ObjMap = serde_json::Map<String, serde_json::Value>;

fn obj<'a>(v: &'a serde_json::Value, at: &str) -> Result<&'a ObjMap, StyleError> {
    v.as_object().ok_or(StyleError::TypeMismatch { at: at.to_string(), expected: "an object" })
}

/// Refuse any key the schema does not define, and say why when the key names an excluded construct.
fn known_keys(map: &ObjMap, at: &str, allowed: &[&str]) -> Result<(), StyleError> {
    for key in map.keys() {
        if !allowed.contains(&key.as_str()) {
            let excluded = V0_EXCLUDED
                .iter()
                .find(|(k, _)| k.eq_ignore_ascii_case(key))
                .map(|(_, construct)| *construct);
            return Err(StyleError::UnknownKey {
                at: at.to_string(),
                key: key.clone(),
                excluded_construct: excluded,
            });
        }
    }
    Ok(())
}

fn parse_color(v: &serde_json::Value, at: &str) -> Result<Rgb, StyleError> {
    let s = v
        .as_str()
        .ok_or(StyleError::TypeMismatch { at: at.to_string(), expected: "a `#rrggbb` string" })?;
    Rgb::parse(s).ok_or_else(|| StyleError::BadColor { at: at.to_string(), found: s.to_string() })
}

fn number(v: &serde_json::Value, at: &str, min: f64, max: f64) -> Result<f64, StyleError> {
    let n = v
        .as_f64()
        .ok_or(StyleError::TypeMismatch { at: at.to_string(), expected: "a number" })?;
    if !n.is_finite() || n < min || n > max {
        return Err(StyleError::OutOfRange { at: at.to_string(), value: n, min, max });
    }
    Ok(n)
}

/// Parse one property, which is either `{"literal": …}` or `{"match": …}` and never both.
fn value<T>(
    layer: &ObjMap,
    layer_at: &str,
    key: &str,
    match_site: &mut Option<String>,
    leaf: impl Fn(&serde_json::Value, &str) -> Result<T, StyleError> + Copy,
) -> Result<Value<T>, StyleError> {
    let at = format!("{layer_at}.{key}");
    let v = layer
        .get(key)
        .ok_or_else(|| StyleError::MissingKey { at: layer_at.to_string(), key: key.to_string() })?;
    let map = obj(v, &at)?;
    known_keys(map, &at, &["literal", "match"])?;

    match (map.get("literal"), map.get("match")) {
        (Some(_), Some(_)) => Err(StyleError::TypeMismatch {
            at,
            expected: "exactly one of `literal` or `match`, not both",
        }),
        (Some(lit), None) => Ok(Value::Literal(leaf(lit, &format!("{at}.literal"))?)),
        (None, Some(m)) => {
            let m_at = format!("{at}.match");
            if let Some(first) = match_site.as_ref() {
                return Err(StyleError::MoreThanOneMatch {
                    first_at: first.clone(),
                    second_at: m_at,
                });
            }
            *match_site = Some(m_at.clone());
            Ok(Value::Match(parse_match(m, &m_at, leaf)?))
        }
        (None, None) => Err(StyleError::MissingKey { at, key: "literal` or `match".into() }),
    }
}

fn parse_match<T>(
    v: &serde_json::Value,
    at: &str,
    leaf: impl Fn(&serde_json::Value, &str) -> Result<T, StyleError> + Copy,
) -> Result<CategoricalMatch<T>, StyleError> {
    let map = obj(v, at)?;
    known_keys(map, at, &["column", "cases", "on_null", "on_unmatched"])?;

    let column = map
        .get("column")
        .ok_or_else(|| StyleError::MissingKey { at: at.to_string(), key: "column".into() })?
        .as_str()
        .ok_or(StyleError::TypeMismatch {
            at: format!("{at}.column"),
            expected: "a column name string",
        })?
        .to_string();
    if column.is_empty() {
        return Err(StyleError::TypeMismatch {
            at: format!("{at}.column"),
            expected: "a non-empty column name",
        });
    }

    let cases_v = map
        .get("cases")
        .ok_or_else(|| StyleError::MissingKey { at: at.to_string(), key: "cases".into() })?;
    let cases_arr = cases_v.as_array().ok_or(StyleError::TypeMismatch {
        at: format!("{at}.cases"),
        expected: "an array of {when, then} objects",
    })?;
    if cases_arr.is_empty() {
        return Err(StyleError::MatchHasNoCases { at: at.to_string() });
    }
    if cases_arr.len() > MAX_MATCH_CASES {
        return Err(StyleError::TooManyCases {
            at: at.to_string(),
            cases: cases_arr.len(),
            limit: MAX_MATCH_CASES,
        });
    }

    let mut seen: BTreeSet<String> = BTreeSet::new();
    let mut cases = Vec::with_capacity(cases_arr.len());
    for (i, c) in cases_arr.iter().enumerate() {
        let c_at = format!("{at}.cases[{i}]");
        let cm = obj(c, &c_at)?;
        known_keys(cm, &c_at, &["when", "then"])?;
        let when = cm
            .get("when")
            .ok_or_else(|| StyleError::MissingKey { at: c_at.clone(), key: "when".into() })?
            .as_str()
            .ok_or(StyleError::TypeMismatch {
                at: format!("{c_at}.when"),
                expected: "a string — style v0 matches on text columns only",
            })?
            .to_string();
        if !seen.insert(when.clone()) {
            return Err(StyleError::DuplicateCase { at: at.to_string(), value: when });
        }
        let then = cm
            .get("then")
            .ok_or_else(|| StyleError::MissingKey { at: c_at.clone(), key: "then".into() })?;
        cases.push((when, leaf(then, &format!("{c_at}.then"))?));
    }

    // Both fallbacks are required. This is the clause that makes NULL and unmatched behaviour a
    // declaration rather than a default.
    let on_null = leaf(
        map.get("on_null")
            .ok_or_else(|| StyleError::MissingKey { at: at.to_string(), key: "on_null".into() })?,
        &format!("{at}.on_null"),
    )?;
    let on_unmatched = leaf(
        map.get("on_unmatched").ok_or_else(|| StyleError::MissingKey {
            at: at.to_string(),
            key: "on_unmatched".into(),
        })?,
        &format!("{at}.on_unmatched"),
    )?;

    Ok(CategoricalMatch { column, cases, on_null, on_unmatched })
}

#[cfg(test)]
mod tests {
    use super::*;

    pub(crate) const CATEGORICAL: &str = r##"{
      "style_version": 1,
      "layer": {
        "geometry": "polygon",
        "fill_color": {"match": {
          "column": "zone",
          "cases": [{"when": "residential", "then": "#AA3333"},
                    {"when": "industrial",  "then": "#333388"}],
          "on_null": "#888888",
          "on_unmatched": "#cccccc"}},
        "fill_opacity": {"literal": 0.8},
        "outline_color": {"literal": "#202020"},
        "outline_width": {"literal": 1.0}
      }
    }"##;

    #[test]
    fn a_categorical_style_parses_and_canonicalizes_with_lowercase_colours() {
        let doc = parse(CATEGORICAL).unwrap();
        assert_eq!(doc.match_column(), Some("zone"));
        assert_eq!(doc.case_values(), vec!["residential", "industrial"]);
        let (json, hash) = doc.canonical_and_hash().unwrap();
        // Uppercase in, lowercase out: canonicalization is what makes two spellings one hash.
        assert!(json.contains("\"#aa3333\""), "{json}");
        assert!(!json.contains("AA3333"));
        // Declared key order, not a sort: `style_version` precedes `layer`, `geometry` precedes the
        // four properties.
        assert!(
            json.starts_with(r##"{"style_version":1,"layer":{"geometry":"polygon","##),
            "{json}"
        );
        assert!(hash.starts_with("sha256:"));
    }

    #[test]
    fn the_canonical_form_is_stable_across_irrelevant_input_differences() {
        // Whitespace, key order and colour case are exactly the differences a diffable text format
        // must not turn into two hashes.
        let reordered = r##"{"layer":{"outline_width":{"literal":1.0},
            "outline_color":{"literal":"#202020"},"fill_opacity":{"literal":0.8},
            "fill_color":{"match":{"on_unmatched":"#CCCCCC","on_null":"#888888",
              "cases":[{"then":"#aa3333","when":"residential"},
                       {"then":"#333388","when":"industrial"}],"column":"zone"}},
            "geometry":"polygon"},"style_version":1}"##;
        let a = parse(CATEGORICAL).unwrap().canonical_and_hash().unwrap();
        let b = parse(reordered).unwrap().canonical_and_hash().unwrap();
        assert_eq!(a, b);
    }

    #[test]
    fn a_second_match_is_refused_naming_both_sites() {
        let two = CATEGORICAL.replace(
            r##""outline_color": {"literal": "#202020"}"##,
            r##""outline_color": {"match": {"column":"zone","cases":[{"when":"a","then":"#000000"}],
               "on_null":"#111111","on_unmatched":"#222222"}}"##,
        );
        match parse(&two).unwrap_err() {
            StyleError::MoreThanOneMatch { first_at, second_at } => {
                assert_eq!(first_at, "$.layer.fill_color.match");
                assert_eq!(second_at, "$.layer.outline_color.match");
            }
            other => panic!("expected MoreThanOneMatch, got {other:?}"),
        }
    }

    #[test]
    fn an_all_literal_style_is_legal_and_declares_no_match() {
        // "literals plus at most one match" — zero is inside the ceiling. The consequence, declared
        // rather than discovered, is that such a bundle carries no legend.
        let src = r##"{"style_version":1,"layer":{"geometry":"polygon",
          "fill_color":{"literal":"#123456"},"fill_opacity":{"literal":1.0},
          "outline_color":{"literal":"#000000"},"outline_width":{"literal":0.5}}}"##;
        let doc = parse(src).unwrap();
        assert_eq!(doc.match_column(), None);
        assert!(doc.case_values().is_empty());
    }

    #[test]
    fn omitting_a_fallback_is_a_compile_error_and_not_a_default() {
        for missing in ["on_null", "on_unmatched"] {
            let src = CATEGORICAL.replace(&format!("\"{missing}\""), "\"unused_key_name\"");
            let e = parse(&src).unwrap_err();
            // It surfaces as the unknown key first, which is the same refusal: v0 has no defaults
            // and no ignored keys, so neither spelling of the mistake can pass.
            assert!(
                matches!(e, StyleError::UnknownKey { .. } | StyleError::MissingKey { .. }),
                "{missing} produced {e:?}"
            );
        }
        // And with the key simply deleted, it is unambiguously the missing-key refusal.
        let src = CATEGORICAL
            .replace("\"on_null\": \"#888888\",", "")
            .replace("\n          ", "\n        ");
        assert!(matches!(
            parse(&src).unwrap_err(),
            StyleError::MissingKey { key, .. } if key == "on_null"
        ));
    }

    #[test]
    fn v0_excluded_constructs_are_refused_and_the_refusal_says_which_construct() {
        for (key, construct) in
            [("label", "labels"), ("icon", "icons"), ("min_zoom", "scale-dependent rules")]
        {
            let src = CATEGORICAL
                .replace("\"geometry\": \"polygon\",", &format!("\"geometry\":\"polygon\",\"{key}\":\"x\","));
            match parse(&src).unwrap_err() {
                StyleError::UnknownKey { key: k, excluded_construct: Some(c), .. } => {
                    assert_eq!(k, key);
                    assert_eq!(c, construct);
                }
                other => panic!("{key} produced {other:?}"),
            }
        }
    }

    #[test]
    fn an_unknown_version_is_refused_rather_than_read_best_effort() {
        let src = CATEGORICAL.replace("\"style_version\": 1", "\"style_version\": 2");
        assert!(matches!(
            parse(&src).unwrap_err(),
            StyleError::UnsupportedVersion { found: 2, supported: 1 }
        ));
    }

    #[test]
    fn a_duplicate_case_is_refused_rather_than_resolved_by_position() {
        let src = CATEGORICAL.replace("\"industrial\"", "\"residential\"");
        assert!(matches!(parse(&src).unwrap_err(), StyleError::DuplicateCase { .. }));
    }

    #[test]
    fn ranges_and_colour_spelling_are_enforced() {
        let over = CATEGORICAL.replace("\"literal\": 0.8", "\"literal\": 1.2");
        assert!(matches!(parse(&over).unwrap_err(), StyleError::OutOfRange { .. }));
        let wide = CATEGORICAL.replace("\"literal\": 1.0", "\"literal\": 1000.0");
        assert!(matches!(parse(&wide).unwrap_err(), StyleError::OutOfRange { .. }));
        let bad = CATEGORICAL.replace("\"#202020\"", "\"rebeccapurple\"");
        assert!(matches!(parse(&bad).unwrap_err(), StyleError::BadColor { .. }));
        let short = CATEGORICAL.replace("\"#202020\"", "\"#202\"");
        assert!(matches!(parse(&short).unwrap_err(), StyleError::BadColor { .. }));
    }

    #[test]
    fn a_non_string_case_key_is_refused_because_v0_matches_text_only() {
        let src = CATEGORICAL.replace("\"when\": \"residential\"", "\"when\": 3");
        assert!(matches!(parse(&src).unwrap_err(), StyleError::TypeMismatch { .. }));
    }

    #[test]
    fn a_property_may_not_be_both_a_literal_and_a_match() {
        let src = CATEGORICAL.replace(
            "\"fill_opacity\": {\"literal\": 0.8}",
            "\"fill_opacity\": {\"literal\": 0.8, \"match\": {\"column\":\"z\",\"cases\":[],\
             \"on_null\":0.1,\"on_unmatched\":0.2}}",
        );
        assert!(matches!(parse(&src).unwrap_err(), StyleError::TypeMismatch { .. }));
    }

    #[test]
    fn non_polygon_geometry_is_refused() {
        let src = CATEGORICAL.replace("\"polygon\"", "\"line\"");
        assert!(matches!(parse(&src).unwrap_err(), StyleError::TypeMismatch { .. }));
    }
}
