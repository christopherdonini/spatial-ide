// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The project file**, `project.spatial` (ADR-036 §1 to §5, §8 and §11, and its Amendment 1):
//! its model, its writer and its reader.
//!
//! - **The writer** lays the document out through `spatial_renderer::canonical` (ADR-022 decision
//!   3: the kernel canonicalizes nothing itself), and checks the bytes it is about to give back
//!   against the reader's own rules, so it cannot write a file the reader refuses.
//! - **The reader** is [`super::strict_json`] and then this file's closed shape: the members, in
//!   the order the ADR declares; the dataset entry as [`DatasetRef::parse`] reads it; the
//!   `workspace` of Amendment 1; and last, the layout and spelling, which are the writer's.
//! - **Nothing here opens a dataset.** A project-relative locator is checked on its text; that it
//!   leads inside the folder is the resolver's, when the data is opened.
//!
//! The refusals carry a member path and a rule. They become `skp.project_file_refused` where the
//! protocol carries that code.

use spatial_engine::crs::MAX_CRS_DEFINITION_BYTES;
use spatial_renderer::canonical::{to_canonical_string, to_line_oriented_string, Json};
use spatial_renderer::style::{self, StyleDocument};
use spatial_skp::v0::HexF64;

use super::strict_json::{
    check_spelling, closed_in_order, member_order_difference, parse, to_value, Layout, Limits,
    StrictError,
};
use super::ProjectUri;
use crate::dataset_ref::{state_json, DatasetRef, Locator, RefParseError};

/// A project file's ceiling in bytes (ADR-036 Amendment 1, item 6).
pub const MAX_PROJECT_FILE_BYTES: usize = 1_048_576;
/// A `project-relative` locator's most segments (ADR-036 Amendment 1, item 6).
pub const MAX_LOCATOR_SEGMENTS: usize = 64;
/// Any string in a project file, except a CRS assertion's definition (ADR-036 Amendment 1, item 6).
const MAX_STRING_BYTES: usize = 4_096;
/// Deeper than the style document, a dataset entry and the view nest.
const MAX_DEPTH: usize = 32;
const LIMITS: Limits = Limits {
    max_bytes: MAX_PROJECT_FILE_BYTES,
    max_depth: MAX_DEPTH,
    max_string_bytes: MAX_CRS_DEFINITION_BYTES,
};
const DEFINITION_JSON: &str = "$.datasets[0].admission.crs_assertion.definition_json";

const FORMAT: &str = "spatial-project";
const DIALECT: &str = "duckdb-expr/0";
const PROVENANCE: [&str; 3] = ["crs:declared", "crs:asserted", "crs:format-default"];
const NOT_KEPT: (&str, &str) = (
    "not-kept",
    "this version of the application writes no lineage file",
);
const NONE_ADMITTED: (&str, &str) = ("none-admitted", "the engine admitted no definition");
const TOP: [&str; 6] = [
    "format",
    "version",
    "project",
    "datasets",
    "lineage",
    "workspace",
];

/// A project file read or about to be written.
#[derive(Clone, Debug)]
pub struct ProjectFile {
    pub project: ProjectUri,
    pub dataset: DatasetRef,
    pub lineage: Lineage,
    pub workspace: Workspace,
}

/// What the file records of a lineage file (ADR-036 §8): a named state in this version, or the
/// properties of a lineage kept by a later one.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Lineage {
    NotKept,
    Kept { sha256: String, steps: u64 },
}

/// The `workspace` member (ADR-036 Amendment 1, item 1).
#[derive(Clone, Debug, PartialEq)]
pub struct Workspace {
    /// The predicate applied when the project was saved; its dialect is fixed.
    pub filter: Option<String>,
    pub clauses: Vec<Clause>,
    pub style: StyleDocument,
    pub view: View,
}

/// One filter clause. It carries no id.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Clause {
    pub text: String,
    pub enabled: bool,
}

/// The map view: a centre and a zoom in the space of the dataset it was saved over.
#[derive(Clone, Debug, PartialEq)]
pub struct View {
    pub crs: Space,
    pub centre: [f64; 2],
    pub zoom: f64,
}

/// A coordinate space in `dependencies.crs`'s form (ADR-036 §6). `definition` is the hash of the
/// definition text, or `None` where the engine admitted none.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Space {
    pub identifier: String,
    pub provenance: String,
    pub definition: Option<String>,
}

/// Why a project file was refused, naming the member's path.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ProjectFileRefused {
    pub path: String,
    pub rule: String,
}

impl std::fmt::Display for ProjectFileRefused {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.path, self.rule)
    }
}

impl std::error::Error for ProjectFileRefused {}

type Res<T> = Result<T, ProjectFileRefused>;

fn refused(path: impl Into<String>, rule: impl Into<String>) -> ProjectFileRefused {
    ProjectFileRefused {
        path: path.into(),
        rule: rule.into(),
    }
}

fn from_strict(e: StrictError) -> ProjectFileRefused {
    refused(e.path, format!("line {}: {}", e.line, e.rule))
}

/// The bytes of `file`, in the line-oriented layout and followed by one LF. They are read back
/// with [`read_project`] before they are returned.
pub fn write_project(file: &ProjectFile) -> Res<String> {
    let layout =
        to_line_oriented_string(&file.to_json()).map_err(|e| refused("$", e.to_string()))?;
    let text = layout + "\n";
    read_project(text.as_bytes())?;
    Ok(text)
}

/// Read a project file, strictly.
pub fn read_project(bytes: &[u8]) -> Res<ProjectFile> {
    let doc = parse(bytes, &LIMITS).map_err(from_strict)?;
    string_ceilings(&doc, "$")?;
    let file = typed(&doc)?;
    check_spelling(&doc, bytes, Layout::LineOriented).map_err(from_strict)?;
    Ok(file)
}

impl ProjectFile {
    pub fn to_json(&self) -> Json {
        let lineage = match &self.lineage {
            Lineage::NotKept => state_json(NOT_KEPT),
            Lineage::Kept { sha256, steps } => {
                Json::obj([("sha256", Json::str(sha256)), ("steps", Json::UInt(*steps))])
            }
        };
        Json::obj([
            ("format", Json::str(FORMAT)),
            ("version", Json::Int(1)),
            ("project", Json::str(self.project.as_str())),
            ("datasets", Json::Arr(vec![self.dataset.to_json()])),
            ("lineage", lineage),
            ("workspace", self.workspace.to_json()),
        ])
    }
}

impl Workspace {
    fn to_json(&self) -> Json {
        let filter = self.filter.as_ref().map_or(Json::Null, |predicate| {
            Json::obj([
                ("predicate", Json::str(predicate)),
                ("dialect", Json::str(DIALECT)),
            ])
        });
        let clause = |c: &Clause| {
            Json::obj([
                ("text", Json::str(&c.text)),
                ("enabled", Json::Bool(c.enabled)),
            ])
        };
        let hex = |d: f64| Json::str(HexF64(d).to_hex());
        let space = &self.view.crs;
        let definition = space
            .definition
            .as_ref()
            .map_or_else(|| state_json(NONE_ADMITTED), Json::str);
        let crs = Json::obj([
            ("identifier", Json::str(&space.identifier)),
            ("provenance", Json::str(&space.provenance)),
            ("definition", definition),
        ]);
        let [x, y] = self.view.centre;
        let view = Json::obj([
            ("crs", crs),
            ("centre", Json::Arr(vec![hex(x), hex(y)])),
            ("zoom", hex(self.view.zoom)),
        ]);
        Json::obj([
            ("filter", filter),
            (
                "clauses",
                Json::Arr(self.clauses.iter().map(clause).collect()),
            ),
            ("style", self.style.to_canonical_json()),
            ("view", view),
        ])
    }
}

/// What the enabled clauses combine to (ADR-036 Amendment 1, item 1): none gives no filter, one
/// gives its text byte for byte, and several give each text inside one pair of brackets, joined by
/// ` AND `, in list order. The shell's `combineClauses` is the same rule
/// (`frontends/shell/src/workspace/filterClauses.ts`).
fn combine(clauses: &[Clause]) -> Option<String> {
    let on: Vec<&str> = clauses
        .iter()
        .filter(|c| c.enabled)
        .map(|c| c.text.as_str())
        .collect();
    match on.as_slice() {
        [] => None,
        [one] => Some((*one).to_string()),
        many => Some(
            many.iter()
                .map(|t| format!("({t})"))
                .collect::<Vec<_>>()
                .join(" AND "),
        ),
    }
}

fn closed<'a>(v: &'a Json, path: &str, keys: &[&str]) -> Res<Vec<&'a Json>> {
    closed_in_order(v, path, keys).map_err(|(path, rule)| refused(path, rule))
}

fn text<'a>(v: &'a Json, path: &str) -> Res<&'a str> {
    match v {
        Json::Str(s) => Ok(s),
        _ => Err(refused(path, "expected a string")),
    }
}

fn word(v: &Json, path: &str, expected: &str) -> Res<()> {
    match text(v, path)? {
        got if got == expected => Ok(()),
        got => Err(refused(path, format!("`{got}` is not `{expected}`"))),
    }
}

fn sha256_text(s: &str) -> bool {
    let hex = s.strip_prefix("sha256:");
    hex.is_some_and(|h| h.len() == 64 && h.bytes().all(|b| matches!(b, b'0'..=b'9' | b'a'..=b'f')))
}

/// Every string but the one definition is within [`MAX_STRING_BYTES`]; the tokenizer has bound the
/// definition and the file.
fn string_ceilings(v: &Json, path: &str) -> Res<()> {
    match v {
        Json::Str(s) if s.len() > MAX_STRING_BYTES && path != DEFINITION_JSON => Err(refused(
            path,
            format!("a string over {MAX_STRING_BYTES} bytes"),
        )),
        Json::Arr(items) => items
            .iter()
            .enumerate()
            .try_for_each(|(i, x)| string_ceilings(x, &format!("{path}[{i}]"))),
        Json::Obj(members) => members
            .iter()
            .try_for_each(|(k, x)| string_ceilings(x, &format!("{path}.{k}"))),
        _ => Ok(()),
    }
}

fn typed(doc: &Json) -> Res<ProjectFile> {
    let top = closed(doc, "$", &TOP)?;
    word(top[0], "$.format", FORMAT)?;
    if *top[1] != Json::Int(1) {
        return Err(refused(
            "$.version",
            "this reader implements version 1 only",
        ));
    }
    let project = text(top[2], "$.project")?;
    let project = project.parse::<ProjectUri>();
    Ok(ProjectFile {
        project: project.map_err(|e| refused("$.project", e.to_string()))?,
        dataset: dataset(top[3])?,
        lineage: lineage(top[4])?,
        workspace: workspace(top[5])?,
    })
}

fn dataset(v: &Json) -> Res<DatasetRef> {
    let base = "$.datasets[0]";
    let entry = match v {
        Json::Arr(items) if items.len() == 1 => &items[0],
        _ => {
            return Err(refused(
                "$.datasets",
                "a project holds exactly one dataset entry",
            ))
        }
    };
    let rebase = |at: &str| format!("{base}{}", at.trim_start_matches('$'));
    let read = DatasetRef::parse(&to_value(entry)).map_err(|e| {
        let (path, rule) = match e {
            RefParseError::UnknownMember { path } => (path, "an unknown member".to_string()),
            RefParseError::MissingMember { path } => (path, "a missing member".to_string()),
            RefParseError::UnknownState { path, value } => (
                path,
                format!("`{value}` is not a word this version defines here"),
            ),
            RefParseError::OverCeiling { path, ceiling } => {
                (path, format!("over the ceiling of {ceiling}"))
            }
            RefParseError::Malformed { path, detail } => (path, detail),
        };
        refused(rebase(&path), rule)
    })?;
    if let Some(at) = member_order_difference(entry, &read.to_json()) {
        return Err(refused(
            rebase(&at),
            "the members are out of the declared order",
        ));
    }
    for (i, locator) in read.locators().iter().enumerate() {
        if let Locator::ProjectRelative(at) = locator {
            if at.split('/').count() > MAX_LOCATOR_SEGMENTS {
                let path = format!("{base}.resource.locators[{i}].at");
                let rule = format!("over {MAX_LOCATOR_SEGMENTS} segments");
                return Err(refused(path, rule));
            }
        }
    }
    Ok(read)
}

fn basis(v: &Json, path: &str) -> Res<()> {
    if text(v, path)?.trim().is_empty() {
        return Err(refused(path, "a named state's basis is not blank"));
    }
    Ok(())
}

fn lineage(v: &Json) -> Res<Lineage> {
    let path = "$.lineage";
    if matches!(v, Json::Obj(ms) if ms.iter().any(|(k, _)| k == "state")) {
        let m = closed(v, path, &["state", "basis"])?;
        word(m[0], "$.lineage.state", NOT_KEPT.0)?;
        basis(m[1], "$.lineage.basis")?;
        return Ok(Lineage::NotKept);
    }
    let m = closed(v, path, &["sha256", "steps"])?;
    let sha256 = text(m[0], "$.lineage.sha256")?;
    if !sha256_text(sha256) {
        return Err(refused(
            "$.lineage.sha256",
            "expected `sha256:` and 64 lowercase hex characters",
        ));
    }
    let steps = match m[1] {
        Json::Int(n) if (0..1 << 53).contains(n) => *n as u64,
        _ => {
            return Err(refused(
                "$.lineage.steps",
                "expected an integer from 0 to 2^53 - 1",
            ))
        }
    };
    Ok(Lineage::Kept {
        sha256: sha256.to_string(),
        steps,
    })
}

fn workspace(v: &Json) -> Res<Workspace> {
    let m = closed(v, "$.workspace", &["filter", "clauses", "style", "view"])?;
    let clauses = clauses(m[1])?;
    let filter = filter(m[0])?;
    if filter != combine(&clauses) {
        let rule = "the filter is not what the enabled clauses combine to";
        return Err(refused("$.workspace.filter", rule));
    }
    Ok(Workspace {
        filter,
        clauses,
        style: style_document(m[2])?,
        view: view(m[3])?,
    })
}

fn filter(v: &Json) -> Res<Option<String>> {
    if *v == Json::Null {
        return Ok(None);
    }
    let m = closed(v, "$.workspace.filter", &["predicate", "dialect"])?;
    word(m[1], "$.workspace.filter.dialect", DIALECT)?;
    text(m[0], "$.workspace.filter.predicate").map(|p| Some(p.to_string()))
}

fn clauses(v: &Json) -> Res<Vec<Clause>> {
    let path = "$.workspace.clauses";
    let Json::Arr(items) = v else {
        return Err(refused(path, "expected an array"));
    };
    let mut out = Vec::with_capacity(items.len());
    for (i, item) in items.iter().enumerate() {
        let at = format!("{path}[{i}]");
        let m = closed(item, &at, &["text", "enabled"])?;
        let enabled = match m[1] {
            Json::Bool(b) => *b,
            _ => return Err(refused(format!("{at}.enabled"), "expected true or false")),
        };
        let text = text(m[0], &format!("{at}.text"))?.to_string();
        out.push(Clause { text, enabled });
    }
    Ok(out)
}

/// The document the renderer reads, in the order of §5a's canonical form.
fn style_document(v: &Json) -> Res<StyleDocument> {
    let path = "$.workspace.style";
    let source = to_canonical_string(v).map_err(|e| refused(path, e.to_string()))?;
    let doc = style::parse(&source).map_err(|e| refused(path, e.to_string()))?;
    if doc.to_canonical_json() != *v {
        return Err(refused(
            path,
            "not ADR-017 §5a's canonical form of the style it holds",
        ));
    }
    Ok(doc)
}

fn view(v: &Json) -> Res<View> {
    let path = "$.workspace.view";
    let m = closed(v, path, &["crs", "centre", "zoom"])?;
    let centre = match m[1] {
        Json::Arr(xy) if xy.len() == 2 => [
            hex_f64(&xy[0], &format!("{path}.centre[0]"))?,
            hex_f64(&xy[1], &format!("{path}.centre[1]"))?,
        ],
        _ => {
            return Err(refused(
                format!("{path}.centre"),
                "expected an array of two",
            ))
        }
    };
    Ok(View {
        crs: space(m[0])?,
        centre,
        zoom: hex_f64(m[2], &format!("{path}.zoom"))?,
    })
}

/// A view number is 16 lowercase hex digits, the bit pattern of a finite value (Amendment 1,
/// item 1): the codec SKP gives a bit-critical scalar.
fn hex_f64(v: &Json, path: &str) -> Res<f64> {
    let Json::Str(s) = v else {
        return Err(refused(
            path,
            "expected 16 lowercase hex digits, the value's bit pattern",
        ));
    };
    HexF64::from_hex(s)
        .map(|h| h.0)
        .map_err(|e| refused(path, e.to_string()))
}

fn space(v: &Json) -> Res<Space> {
    let path = "$.workspace.view.crs";
    let m = closed(v, path, &["identifier", "provenance", "definition"])?;
    let identifier = text(m[0], &format!("{path}.identifier"))?;
    let provenance = text(m[1], &format!("{path}.provenance"))?;
    if identifier.is_empty() || !PROVENANCE.contains(&provenance) {
        let rule =
            "an identifier, and a provenance of crs:declared, crs:asserted or crs:format-default";
        return Err(refused(path, rule));
    }
    let at = format!("{path}.definition");
    let definition = match m[2] {
        Json::Str(h) if sha256_text(h) => Some(h.clone()),
        Json::Str(_) => {
            return Err(refused(
                at,
                "expected `sha256:` and 64 lowercase hex characters",
            ))
        }
        state => {
            let s = closed(state, &at, &["state", "basis"])?;
            word(s[0], &format!("{at}.state"), NONE_ADMITTED.0)?;
            basis(s[1], &format!("{at}.basis"))?;
            None
        }
    };
    Ok(Space {
        identifier: identifier.to_string(),
        provenance: provenance.to_string(),
        definition,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const URI: &str = "spatial://dataset/ref/0123456789abcdef0123456789abcdef";
    const HASH: &str = "abababababababababababababababababababababababababababababababab";
    const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.5},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;
    const MATCHED: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"match":{"column":"zone","cases":[{"when":"civic","then":"#ff0000"}],"on_null":"#cccccc","on_unmatched":"#999999"}},"fill_opacity":{"literal":0.25},"outline_color":{"literal":"#000000"},"outline_width":{"literal":0.0}}}"##;

    fn entry() -> DatasetRef {
        let text = format!(
            r#"{{"resource":{{"logical_uri":"{URI}","content_hash":{{"state":"not-taken","basis":"b"}},"source_revision":{{"state":"none-pinned","basis":"b"}},"locators":[{{"kind":"machine-recorded","at":"{URI}"}},{{"kind":"project-relative","at":"data/parcels.parquet"}}],"cache_status":"linked","portability_policy":"linked-live-file"}},"observed":{{"byte_size":27132,"modified_ns":"1700000000000000000","footer_length":11806,"footer_sha256":"{HASH}"}},"admission":{{"crs_assertion":{{"identifier":"EPSG:2056","definition_json":"{{}}"}},"identity":{{"column":"parcel_key"}}}}}}"#
        );
        let value = serde_json::from_str(&text).expect("JSON");
        DatasetRef::parse(&value).expect("a dataset entry")
    }

    fn clause(text: &str, enabled: bool) -> Clause {
        Clause {
            text: text.to_string(),
            enabled,
        }
    }

    fn space() -> Space {
        Space {
            identifier: "EPSG:2056".to_string(),
            provenance: "crs:declared".to_string(),
            definition: Some(format!("sha256:{HASH}")),
        }
    }

    fn base() -> ProjectFile {
        let clauses = vec![clause("zone = 'civic'", true), clause("area > 10", false)];
        ProjectFile {
            project: "spatial://project/0123456789abcdef0123456789abcdef"
                .parse()
                .unwrap(),
            dataset: entry(),
            lineage: Lineage::NotKept,
            workspace: Workspace {
                filter: combine(&clauses),
                clauses,
                style: style::parse(STYLE).unwrap(),
                view: View {
                    crs: space(),
                    centre: [2_612_680.125, 1_267_000.5],
                    zoom: -3.5,
                },
            },
        }
    }

    fn layout(j: &Json) -> Vec<u8> {
        (to_line_oriented_string(j).unwrap() + "\n").into_bytes()
    }

    fn refusal(j: &Json) -> ProjectFileRefused {
        read_project(&layout(j)).unwrap_err()
    }

    /// The member at `path`: a key, or an index into an array.
    fn at<'a>(mut j: &'a mut Json, path: &[&str]) -> &'a mut Json {
        for step in path {
            j = match (j, step.parse::<usize>()) {
                (Json::Arr(items), Ok(i)) => &mut items[i],
                (Json::Obj(ms), _) => &mut ms.iter_mut().find(|(k, _)| k == step).expect(step).1,
                _ => panic!("{step}: nothing there"),
            };
        }
        j
    }

    fn members(j: &mut Json) -> &mut Vec<(String, Json)> {
        match j {
            Json::Obj(ms) => ms,
            _ => panic!("not an object"),
        }
    }

    #[test]
    fn the_strict_reader_refuses_members_out_of_declared_order() {
        let ok = base().to_json();
        assert!(read_project(&layout(&ok)).is_ok());
        let swapped = |path: &[&str], a: usize, b: usize| {
            let mut j = ok.clone();
            members(at(&mut j, path)).swap(a, b);
            refusal(&j)
        };
        let top = swapped(&[], 4, 5);
        assert_eq!(top.path, "$");
        assert!(top.rule.contains("declared order"), "{top}");
        let cases = [
            (&["workspace"][..], "$.workspace"),
            (&["workspace", "view"], "$.workspace.view"),
            (&["workspace", "view", "crs"], "$.workspace.view.crs"),
            (&["workspace", "clauses", "0"], "$.workspace.clauses[0]"),
            (&["workspace", "filter"], "$.workspace.filter"),
        ];
        for (path, expected) in cases {
            let e = swapped(path, 0, 1);
            assert_eq!(e.path, expected, "{e}");
            assert!(e.rule.contains("declared order"), "{e}");
        }
        // A dataset entry and the style document: members in another order than their writers'
        // are refused, the entry by its path and the style by §5a's canonical form.
        let e = swapped(&["datasets", "0"], 0, 1);
        assert_eq!(e.path, "$.datasets[0]", "{e}");
        let e = swapped(&["workspace", "style", "layer"], 1, 2);
        assert_eq!(e.path, "$.workspace.style", "{e}");
    }

    #[test]
    fn every_member_and_the_file_are_refused_over_their_ceilings() {
        let ok = base();
        let mut padded = write_project(&ok).unwrap().into_bytes();
        padded.resize(MAX_PROJECT_FILE_BYTES + 1, b' ');
        let e = read_project(&padded).unwrap_err();
        assert!(e.rule.contains("over the ceiling of 1048576"), "{e}");

        let long = |n: usize| Json::str("x".repeat(n));
        let mut j = ok.to_json();
        let clause_text = ["workspace", "clauses", "1", "text"];
        *at(&mut j, &clause_text) = long(MAX_STRING_BYTES);
        assert!(read_project(&layout(&j)).is_ok());
        *at(&mut j, &clause_text) = long(MAX_STRING_BYTES + 1);
        assert_eq!(refusal(&j).path, "$.workspace.clauses[1].text");

        // The one exception: a CRS assertion's definition, up to the engine's own bound.
        let mut j = ok.to_json();
        let definition = [
            "datasets",
            "0",
            "admission",
            "crs_assertion",
            "definition_json",
        ];
        *at(&mut j, &definition) = long(MAX_CRS_DEFINITION_BYTES);
        assert!(read_project(&layout(&j)).is_ok());
        *at(&mut j, &definition) = long(MAX_CRS_DEFINITION_BYTES + 1);
        assert_eq!(refusal(&j).path, DEFINITION_JSON);

        let locator = |n: usize| {
            let mut j = ok.to_json();
            let target = ["datasets", "0", "resource", "locators", "1", "at"];
            *at(&mut j, &target) = Json::str(vec!["a"; n].join("/"));
            j
        };
        assert!(read_project(&layout(&locator(MAX_LOCATOR_SEGMENTS))).is_ok());
        let e = refusal(&locator(MAX_LOCATOR_SEGMENTS + 1));
        assert_eq!(e.path, "$.datasets[0].resource.locators[1].at", "{e}");

        let mut j = ok.to_json();
        let Json::Arr(items) = at(&mut j, &["datasets", "0", "resource", "locators"]) else {
            panic!("locators are an array");
        };
        let one = items[1].clone();
        items.resize(9, one);
        assert_eq!(refusal(&j).path, "$.datasets[0].resource.locators");
    }

    /// A file whose clauses, style, view and lineage vary with the seed.
    fn generated(seed: u64) -> ProjectFile {
        let mut state = seed.wrapping_mul(0x9E37_79B9_7F4A_7C15) | 1;
        let mut next = || {
            state = state
                .wrapping_mul(6_364_136_223_846_793_005)
                .wrapping_add(1_442_695_040_888_963_407);
            state
        };
        let texts = [
            "zone = 'civic'",
            "name LIKE '%é\"\\%'",
            "a >= 1 AND b < 2",
            "tab\there \u{1} \u{7f}",
            "x IS NULL",
            "(y)",
        ];
        let mut clauses = Vec::new();
        for _ in 0..(next() >> 33) % 5 {
            let text = texts[((next() >> 33) % 6) as usize];
            clauses.push(clause(text, (next() >> 33) % 2 == 0));
        }
        let source = if (next() >> 33) % 2 == 0 {
            STYLE
        } else {
            MATCHED
        };
        let mut style: serde_json::Value = serde_json::from_str(source).unwrap();
        style["layer"]["fill_opacity"]["literal"] = (((next() >> 33) % 65) as f64 / 64.0).into();
        let mut number = || Some(f64::from_bits(next())).filter(|v| v.is_finite());
        let centre = [number().unwrap_or(0.0), number().unwrap_or(0.0)];
        let zoom = number().unwrap_or(0.0);
        let definition = (next() >> 33) % 2 == 0;
        let provenance = PROVENANCE[((next() >> 33) % 3) as usize].to_string();
        let kept = Lineage::Kept {
            sha256: format!("sha256:{HASH}"),
            steps: (next() >> 33) % (1 << 40),
        };
        let lineage = if (next() >> 33) % 2 == 0 {
            Lineage::NotKept
        } else {
            kept
        };
        let identifier = "EPSG:2056".to_string();
        ProjectFile {
            lineage,
            workspace: Workspace {
                filter: combine(&clauses),
                clauses,
                style: style::parse(&style.to_string()).unwrap(),
                view: View {
                    crs: Space {
                        identifier,
                        provenance,
                        definition: definition.then(|| format!("sha256:{HASH}")),
                    },
                    centre,
                    zoom,
                },
            },
            ..base()
        }
    }

    #[test]
    fn writer_then_reader_round_trips_generated_project_files_byte_for_byte() {
        for seed in 0..300 {
            let file = generated(seed);
            let text = write_project(&file).unwrap_or_else(|e| panic!("seed {seed}: {e}"));
            assert!(text.starts_with("{\n  \"format\": \"spatial-project\",\n"));
            assert!(text.ends_with("\n}\n"), "seed {seed}");
            let back = read_project(text.as_bytes()).unwrap();
            assert_eq!(back.workspace, file.workspace, "seed {seed}");
            assert_eq!(back.lineage, file.lineage, "seed {seed}");
            assert_eq!(write_project(&back).unwrap(), text, "seed {seed}");
        }
    }

    #[test]
    fn the_project_file_reader_refuses_a_filter_that_is_not_its_enabled_clauses_combined() {
        let file = |clauses: &[(&str, bool)], filter: Option<&str>| {
            let mut j = base().to_json();
            let list = clauses
                .iter()
                .map(|(t, e)| Json::obj([("text", Json::str(*t)), ("enabled", Json::Bool(*e))]));
            *at(&mut j, &["workspace", "clauses"]) = Json::Arr(list.collect());
            let filter = filter.map_or(Json::Null, |p| {
                Json::obj([("predicate", Json::str(p)), ("dialect", Json::str(DIALECT))])
            });
            *at(&mut j, &["workspace", "filter"]) = filter;
            j
        };
        let three = [("a = 1", true), ("b = 2 OR c = 3", true), ("d = 4", false)];
        let bracketed = "(a = 1) AND (b = 2 OR c = 3)";
        assert!(read_project(&layout(&file(&three, Some(bracketed)))).is_ok());
        let e = refusal(&file(&three, Some("a = 1 AND b = 2 OR c = 3")));
        assert_eq!(e.path, "$.workspace.filter", "{e}");
        let e = refusal(&file(&[("a = 1", false)], Some("a = 1")));
        assert_eq!(e.path, "$.workspace.filter", "{e}");
        let e = refusal(&file(&[("a = 1", true)], None));
        assert_eq!(e.path, "$.workspace.filter", "{e}");
        assert!(read_project(&layout(&file(&[("a = 1", true)], Some("a = 1")))).is_ok());
        assert!(read_project(&layout(&file(&[], None))).is_ok());
    }

    #[test]
    fn a_view_value_outside_the_number_grammar_round_trips_bit_exact_as_hexf64() {
        let mut file = base();
        file.workspace.view.centre = [5e-7, -0.0];
        file.workspace.view.zoom = 1e15;
        let text = write_project(&file).unwrap();
        let back = read_project(text.as_bytes()).unwrap().workspace.view;
        let bits = |v: &View| {
            [
                v.centre[0].to_bits(),
                v.centre[1].to_bits(),
                v.zoom.to_bits(),
            ]
        };
        assert_eq!(bits(&back), bits(&file.workspace.view));
        assert_eq!(back.centre[1].to_bits(), (-0.0f64).to_bits());
        assert!(text.contains(&format!("\"{}\"", HexF64(5e-7).to_hex())));
    }

    #[test]
    fn a_view_number_in_any_other_spelling_or_not_finite_is_refused_by_name() {
        let half = HexF64(0.5).to_hex();
        let (x, y) = ("$.workspace.view.centre[0]", "$.workspace.view.centre[1]");
        let zoom = "$.workspace.view.zoom";
        let cases = [
            (Json::Double(0.5), x),
            (Json::Int(1), y),
            (Json::str(half.to_uppercase()), x),
            (Json::str(&half[..14]), y),
            (Json::str("7ff8000000000000"), zoom),
            (Json::str("fff0000000000000"), zoom),
        ];
        for (value, path) in cases {
            let mut j = base().to_json();
            let target = match path {
                p if p == zoom => vec!["workspace", "view", "zoom"],
                p => vec![
                    "workspace",
                    "view",
                    "centre",
                    if p == x { "0" } else { "1" },
                ],
            };
            *at(&mut j, &target) = value;
            let e = refusal(&j);
            assert_eq!(e.path, path, "{e}");
        }
    }
}
