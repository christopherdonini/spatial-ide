// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The session history**: the kernel's command log for workspace mutations (ADR-006 class 2),
//! written by `record_step` (`protocol/skp/SKP-V0.md` §10) in ADR-036's step format (Proposed, §6
//! and §9; `kernel/B2-1B-RECORDING-PREREGISTRATION.md` §2.3). It replays nothing and holds no
//! workspace state beyond the last step's id.
//!
//! - **Crash safety.** One `write_all` and one `sync_all` per line, no buffer in the process, and
//!   the file locked exclusively while the session lives (the operating system frees the lock when
//!   its holder ends abnormally). A power loss is not claimed to preserve a line: the kernel only
//!   asks the operating system to flush, as the audit log does.
//! - **A normal end clears; a crash leaves.** [`StepRecorder::end_session`] removes this run's
//!   records and nothing else; [`recover`] reads one back, the longest valid prefix (§9).
//! - **The home** is the per-user data directory the audit log resolves ([`default_root`]), never a
//!   project folder. `locations.json` beside a history is the only file that holds a path.
//!
//! [`recover`] and `locations.json` are a producer ahead of its consumer,
//! `b2-piece-1c-save-and-reopen`'s recovery offer (the human's round 8 exemption).

use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};

use serde_json::Value;
use spatial_engine::{AdmittedPredicate, Dataset, MAX_PREDICATE_BYTES};
use spatial_renderer::canonical::{sha256_hex, to_canonical_string, Json};
use spatial_renderer::style::{self, MAX_OUTLINE_WIDTH};
use spatial_skp::v0::{
    RecordStepRequest, RecordStepResponse, SkpError, StepIntent, StyleSetParams,
};

use crate::dataset_ref::{
    bounded, closed, join, malformed, observed_json, parse_observed, state_json, Admission,
    DatasetRef, DatasetUri, RefParseError,
};
use crate::permission::audit::{log::data_dir, rfc3339_utc_now};
use crate::skp::{check_version, predicate_admit_error_of, require_live, SkpHost};

/// Declared ceilings (ADR-010 rule 6; ADR-036 §9), checked before any write: a step's line, the
/// header's line, and the whole history.
const MAX_STEP_LINE_BYTES: usize = 262_144;
const MAX_HEADER_LINE_BYTES: usize = 1_048_576;
const MAX_SESSION_HISTORY_BYTES: u64 = 33_554_432;
/// The action vocabulary this kernel registers (ADR-036 §3, §6): a header's `actions`.
const ACTIONS: u64 = 2;
const HISTORY: &str = "history.jsonl";
const LOCATIONS: &str = "locations.json";

// ---------------------------------------------------------------------------------------------
// The writer
// ---------------------------------------------------------------------------------------------

/// One history's append path, generic over where the bytes go and how they are flushed. After a
/// write or a flush fails it takes no later line.
struct History<W: Write> {
    out: W,
    sync: fn(&mut W) -> std::io::Result<()>,
    bytes: u64,
    stopped: bool,
    /// A step's line, the header's line, the whole history.
    ceilings: [u64; 3],
}

impl<W: Write> History<W> {
    fn new(out: W, sync: fn(&mut W) -> std::io::Result<()>) -> Self {
        let ceilings = [
            MAX_STEP_LINE_BYTES as u64,
            MAX_HEADER_LINE_BYTES as u64,
            MAX_SESSION_HISTORY_BYTES,
        ];
        Self {
            out,
            sync,
            bytes: 0,
            stopped: false,
            ceilings,
        }
    }

    /// Check the line against its ceilings, then write it and its LF in one `write_all` and flush.
    /// Every refusal before the write writes nothing.
    fn append(&mut self, line: &str, header: bool) -> Result<(), SkpError> {
        let [step, head, whole] = self.ceilings;
        let (saw, ceiling) = (line.len() as u64, if header { head } else { step });
        if self.stopped {
            return Err(SkpError::session_history_stopped());
        } else if saw > ceiling && header {
            return Err(SkpError::session_history_unwritable(&format!(
                "the header is {saw} bytes"
            )));
        } else if saw > ceiling {
            return Err(SkpError::step_line_over_ceiling(saw, ceiling));
        } else if self.bytes + saw + 1 > whole {
            return Err(SkpError::session_history_full(whole));
        }
        let bytes = [line.as_bytes(), b"\n"].concat();
        if let Err(e) = self
            .out
            .write_all(&bytes)
            .and_then(|()| (self.sync)(&mut self.out))
        {
            self.stopped = true;
            return Err(SkpError::session_history_unwritable(&e.to_string()));
        }
        self.bytes += saw + 1;
        Ok(())
    }
}

/// One record: one opened file's history, from its first step.
struct Record {
    dir: PathBuf,
    uri: DatasetUri,
    path: PathBuf,
    admission: Admission,
    history: History<File>,
    last_step: Option<String>,
}

/// Records committed steps. Built once by the shell's binding with the store root and the host it
/// reads the catalog and the generations from; `SkpHost::new` is unchanged.
pub struct StepRecorder {
    host: Arc<SkpHost>,
    root: PathBuf,
    records: Mutex<Vec<Record>>,
}

/// The default store root, `<per-user data directory>/spatial-ide/sessions`, from the one resolver
/// the audit log uses (PORTABILITY R2's application-directory boundary).
pub fn default_root() -> Option<PathBuf> {
    data_dir().map(|d| d.join("spatial-ide").join("sessions"))
}

impl StepRecorder {
    pub fn new(root: PathBuf, host: Arc<SkpHost>) -> Self {
        Self {
            host,
            root,
            records: Mutex::new(Vec::new()),
        }
    }

    /// `record_step` (SKP-V0 §10.3), the checks in order: the version, the catalog entry, the live
    /// check (the one point it linearizes at), the action and its admission, then the record
    /// (created at the first step for an opened file), the line, its bounds, one write and one
    /// flush, and the reply.
    pub fn record_step(&self, req: RecordStepRequest) -> Result<RecordStepResponse, SkpError> {
        check_version(&req.skp)?;
        let name = req.dataset.as_str();
        let ds = self
            .host
            .catalog()
            .get(name)
            .ok_or_else(|| SkpError::unknown_dataset(name))?;
        require_live(&self.host.generations(), name)?;
        let (action, kind, params, referenced) = prepare(&ds, &req.intent)?;
        let intent = Json::obj([("action", Json::str(action)), ("params", params)]);
        let dependencies = dependencies_json(&ds, &referenced)?;
        let observed = Json::obj([("observed", observed_json(&ds.descriptor().observation()))]);
        // Unreachable through `SkpHost::open_dataset`, which gives every assertion a definition.
        let reference = DatasetRef::linked(DatasetUri::mint(), &ds).map_err(|e| {
            SkpError::session_history_unwritable(&format!("no reference can be built: {e}"))
        })?;

        let mut records = self.records.lock().unwrap_or_else(|e| e.into_inner());
        let same =
            |r: &Record| r.path == ds.path() && same_claims(&r.admission, reference.admission());
        let at = match records.iter().position(same) {
            Some(i) => i,
            None => {
                records.push(self.create(&reference, &ds)?);
                records.len() - 1
            }
        };
        let rec = &mut records[at];
        let id = format!("step_{}", hex32());
        let data = Json::obj([
            ("dataset", Json::str(rec.uri.as_str())),
            ("identity", observed),
        ]);
        let parent = rec.last_step.as_deref();
        let at = rfc3339_utc_now();
        let step = step_object(&id, parent, &at, kind, intent, dependencies, data);
        rec.history
            .append(&canonical(&Json::obj([("step", step)]))?, false)?;
        rec.last_step = Some(id);
        Ok(RecordStepResponse {})
    }

    /// Normal end of the application: delete this run's records, their files and folders, and
    /// nothing else. A record another run left is never touched.
    pub fn end_session(&self) {
        let records = std::mem::take(&mut *self.records.lock().unwrap_or_else(|e| e.into_inner()));
        for Record { dir, history, .. } in records {
            drop(history);
            let _ = std::fs::remove_file(dir.join(HISTORY));
            let _ = std::fs::remove_file(dir.join(LOCATIONS));
            let _ = std::fs::remove_dir(&dir);
        }
    }

    /// A new record: its folder, `locations.json`, and the locked history with its header.
    fn create(&self, reference: &DatasetRef, ds: &Dataset) -> Result<Record, SkpError> {
        let fail = |what: &str, e: &dyn std::fmt::Display| {
            SkpError::session_history_unwritable(&format!("{what}: {e}"))
        };
        let dir = self.root.join(format!("unsaved-{}", hex32()));
        std::fs::create_dir_all(&self.root)
            .and_then(|()| std::fs::create_dir(&dir))
            .map_err(|e| fail("the record folder", &e))?;
        let entry = Json::obj([
            ("dataset", Json::str(reference.uri().as_str())),
            ("path", Json::str(ds.path().to_string_lossy())),
        ]);
        let locations = Json::obj([
            ("format", Json::str("spatial-locations")),
            ("version", Json::Int(1)),
            ("entries", Json::Arr(vec![entry])),
        ]);
        std::fs::write(dir.join(LOCATIONS), canonical(&locations)? + "\n")
            .map_err(|e| fail(LOCATIONS, &e))?;
        // Read and write, not append: Windows refuses to lock an append-only handle. Nothing else
        // writes the file while it is locked, so each `write_all` lands at its end.
        let mut options = OpenOptions::new();
        let file = options
            .read(true)
            .write(true)
            .create_new(true)
            .open(dir.join(HISTORY));
        let file = file.map_err(|e| fail(HISTORY, &e))?;
        file.try_lock().map_err(|e| fail("the history lock", &e))?;
        let mut rec = Record {
            dir,
            uri: reference.uri().clone(),
            path: ds.path().to_path_buf(),
            admission: reference.admission().clone(),
            history: History::new(file, |f| f.sync_all()),
            last_step: None,
        };
        rec.history
            .append(&canonical(&header_object(reference.to_json()))?, true)?;
        Ok(rec)
    }
}

/// ADR-036 §6's header for a session history that has not saved a project.
fn header_object(dataset_entry: Json) -> Json {
    let not_saved = state_json(("not-yet-saved", "this session has not saved a project"));
    Json::obj([
        ("format", Json::str("spatial-steps")),
        ("version", Json::Int(1)),
        ("purpose", Json::str("session-history")),
        ("project", not_saved),
        ("actions", Json::UInt(ACTIONS)),
        ("datasets", Json::Arr(vec![dataset_entry])),
        ("lineage", Json::Null),
    ])
}

fn canonical(j: &Json) -> Result<String, SkpError> {
    to_canonical_string(j)
        .map_err(|e| SkpError::session_history_unwritable(&format!("no canonical spelling: {e}")))
}

fn hex32() -> String {
    let mut bytes = [0u8; 16];
    getrandom::fill(&mut bytes).expect("OS CSPRNG unavailable");
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

/// Two opens continue one record when one path was admitted under the same claims.
fn same_claims(a: &Admission, b: &Admission) -> bool {
    fn crs(x: &Admission) -> Option<(&str, &str)> {
        let c = x.crs_assertion.as_ref();
        c.map(|c| (c.identifier.as_str(), c.definition_json.as_str()))
    }
    fn id(x: &Admission) -> Option<&str> {
        x.identity.as_ref().map(|i| i.column.as_str())
    }
    crs(a) == crs(b) && id(a) == id(b)
}

/// The action's name, registry `kind` and `params`, and the columns a filter names. A filter is
/// admitted as `viewport_query` admits it; a style value as the style model admits it.
fn prepare(
    ds: &Dataset,
    intent: &StepIntent,
) -> Result<(&'static str, &'static str, Json, Vec<String>), SkpError> {
    let p = match intent {
        StepIntent::StyleSet(p) => return Ok(("style.set", "style", style_params(p)?, Vec::new())),
        StepIntent::FilterApply(p) => p,
    };
    let Some(f) = &p.filter else {
        return Ok((
            "filter.apply",
            "data",
            Json::obj([("filter", Json::Null)]),
            Vec::new(),
        ));
    };
    let admitted =
        AdmittedPredicate::admit(f.predicate.clone(), ds).map_err(predicate_admit_error_of)?;
    let filter = Json::obj([
        ("predicate", Json::str(&f.predicate)),
        ("dialect", Json::str(&f.dialect)),
    ]);
    let columns = admitted.referenced_columns().to_vec();
    Ok((
        "filter.apply",
        "data",
        Json::obj([("filter", filter)]),
        columns,
    ))
}

/// A style value is checked by wrapping it in a whole style document and calling the renderer's
/// `parse` (ADR-022 decision 2: the one Rust implementation), plus the kernel's own rules: a colour
/// is lowercase, and the value has a canonical spelling.
fn style_params(p: &StyleSetParams) -> Result<Json, SkpError> {
    let colour = |v: &String| (Value::from(v.clone()), Json::str(v));
    let (property, key, (wire, value)) = match p {
        StyleSetParams::FillColor { value } => ("fillColor", "fill_color", colour(value)),
        StyleSetParams::OutlineColor { value } => ("outlineColor", "outline_color", colour(value)),
        StyleSetParams::FillOpacity { value: v } => (
            "fillOpacity",
            "fill_opacity",
            (Value::from(*v), Json::Double(*v)),
        ),
        StyleSetParams::OutlineWidth { value: w } => {
            let width = Json::obj([("value", Json::Double(w.value)), ("unit", Json::str("px"))]);
            (
                "outlineWidth",
                "outline_width",
                (Value::from(w.value), width),
            )
        }
    };
    let refuse = |detail: String| SkpError::style_value_not_admitted(property, &detail);
    let mut layer = serde_json::json!({
        "geometry": "polygon", "fill_color": {"literal": "#000000"},
        "fill_opacity": {"literal": 1.0}, "outline_color": {"literal": "#000000"},
        "outline_width": {"literal": 0.0}
    });
    layer[key] = serde_json::json!({ "literal": wire });
    let document = serde_json::json!({ "style_version": 1, "layer": layer });
    style::parse(&document.to_string()).map_err(|e| refuse(e.to_string()))?;
    if matches!(&value, Json::Str(s) if *s != s.to_ascii_lowercase()) {
        return Err(refuse("a colour is `#rrggbb` in lowercase".into()));
    }
    to_canonical_string(&value).map_err(|e| refuse(e.to_string()))?;
    Ok(Json::obj([
        ("property", Json::str(property)),
        ("value", value),
    ]))
}

/// ADR-036 §6's `dependencies`, from the open's own accessors: no file is read.
fn dependencies_json(ds: &Dataset, referenced: &[String]) -> Result<Json, SkpError> {
    let unwritable = |what: String| SkpError::session_history_unwritable(&what);
    let schema = ds.file_schema();
    let mut fields = Vec::new();
    for name in referenced {
        let field = schema.fields().iter().find(|f| f.name() == name);
        let field = field.ok_or_else(|| unwritable(format!("`{name}` is not a file column")))?;
        let ty = Json::str(field.data_type().to_string());
        fields.push(Json::obj([("name", Json::str(name)), ("type", ty)]));
    }
    // `describe`'s `crs.provenance`, from the admission record every opened dataset has.
    let admission = ds
        .admission()
        .ok_or_else(|| unwritable("the open has no admission record".into()))?;
    let crs = ds.crs();
    let hash = |d: &str| Json::str(sha256_hex(d.as_bytes()));
    let none = state_json(("none-admitted", "the engine admitted no definition"));
    let undeclared = state_json(("not-declared", "the file declares no geometry_types"));
    let types = ds.declared_geometry_types();
    let crs = Json::obj([
        ("identifier", Json::str(crs.identifier())),
        ("provenance", Json::str(admission.crs_provenance.as_str())),
        ("definition", crs.definition_json().map_or(none, hash)),
    ]);
    let types = types.map_or(undeclared, |t| Json::Arr(t.iter().map(Json::str).collect()));
    Ok(Json::obj([
        ("fields", Json::Arr(fields)),
        ("crs", crs),
        ("geometry_types", types),
    ]))
}

/// ADR-036 §6's step line, members in the table's order.
fn step_object(
    id: &str,
    parent: Option<&str>,
    at: &str,
    kind: &str,
    intent: Json,
    dependencies: Json,
    data: Json,
) -> Json {
    let one = |k: &str, v: &str| Json::obj([(k, Json::str(v))]);
    Json::obj([
        ("id", Json::str(id)),
        ("parent", parent.map_or(Json::Null, Json::str)),
        ("at", Json::str(at)),
        ("kind", Json::str(kind)),
        ("effect", one("class", "workspace-mutation")),
        ("actor", one("kind", "user")),
        ("intent", intent),
        ("dependencies", dependencies),
        ("data", data),
        ("scope", one("kind", "layer")),
        ("links", Json::Arr(Vec::new())),
    ])
}

// ---------------------------------------------------------------------------------------------
// The reader
// ---------------------------------------------------------------------------------------------

/// What [`recover`] found: the header, the kept lines (from the header on, as written, without
/// their LF) and the first line that failed, if any. Nothing after a failing line is recovered.
#[derive(Debug)]
pub struct Recovered {
    pub header: Option<Header>,
    pub lines: Vec<String>,
    pub failure: Option<Failure>,
}

#[derive(Debug)]
pub struct Header {
    pub actions: u64,
    pub datasets: Vec<DatasetRef>,
}

/// `line` is 1-based, and 0 when the file could not be read at all.
#[derive(Debug)]
pub struct Failure {
    pub line: usize,
    pub rule: String,
}

type Res<T> = Result<T, RefParseError>;
const MAX_TEXT: usize = 4_096;
const MAX_ITEMS: usize = 1_024;

/// A member's shape under ADR-036 §2 and §3: closed key sets, named words, named states.
enum S {
    Null,
    Any,
    Text(usize),
    /// A prefix and this many lowercase hex characters.
    Hex(&'static str, usize),
    /// `YYYY-MM-DDTHH:MM:SSZ`: RFC 3339, UTC, whole seconds (the shape only).
    At,
    Observed,
    Word(&'static [&'static str]),
    Int(u64, u64),
    Num(f64),
    State(&'static [&'static str]),
    Obj(&'static [(&'static str, S)]),
    /// A closed object whose tag member picks the other members.
    Tagged(
        &'static str,
        &'static [(&'static str, &'static [(&'static str, S)])],
    ),
    List(&'static S, usize),
    Or(&'static S, &'static S),
    /// A named state when the object has a `state` member, the shape otherwise.
    StateOr(&'static S),
}

const TEXT: S = S::Text(MAX_TEXT);
const ID: S = S::Hex("step_", 32);
const HASH: S = S::Hex("sha256:", 64);
const COLOUR: S = S::Hex("#", 6);
const WIDTH: S = S::Obj(&[
    ("value", S::Num(MAX_OUTLINE_WIDTH)),
    ("unit", S::Word(&["px"])),
]);
const FILTER: S = S::Obj(&[
    ("predicate", S::Text(MAX_PREDICATE_BYTES)),
    ("dialect", S::Word(&["duckdb-expr/0"])),
]);
/// The registry: each registered action's name, its `kind` (both are workspace mutations) and the
/// shape of its `params`. The collapse key and the wide collapse are ADR text only (block C);
/// compaction is piece 2's.
const REGISTRY: [(&str, &str, S); ACTIONS as usize] = [
    (
        "filter.apply",
        "data",
        S::Obj(&[("filter", S::Or(&S::Null, &FILTER))]),
    ),
    (
        "style.set",
        "style",
        S::Tagged(
            "property",
            &[
                ("fillColor", &[("value", COLOUR)]),
                ("outlineColor", &[("value", COLOUR)]),
                ("fillOpacity", &[("value", S::Num(1.0))]),
                ("outlineWidth", &[("value", WIDTH)]),
            ],
        ),
    ),
];
const HEADER: S = S::Obj(&[
    ("format", S::Word(&["spatial-steps"])),
    ("version", S::Int(1, 1)),
    ("purpose", S::Word(&["session-history"])),
    (
        "project",
        S::Or(
            &S::State(&["not-yet-saved"]),
            &S::Hex("spatial://project/", 32),
        ),
    ),
    ("actions", S::Int(1, 1_000_000)),
    ("datasets", S::List(&S::Any, 8)),
    ("lineage", S::Null),
]);
const REVERSIBILITY: S = S::Word(&["reversible", "compensatable", "irreversible"]);
const DEPENDENCIES: S = S::Obj(&[
    (
        "fields",
        S::StateOr(&S::List(
            &S::Obj(&[("name", TEXT), ("type", TEXT)]),
            MAX_ITEMS,
        )),
    ),
    (
        "crs",
        S::StateOr(&S::Obj(&[
            ("identifier", TEXT),
            (
                "provenance",
                S::Word(&["crs:declared", "crs:asserted", "crs:format-default"]),
            ),
            ("definition", S::Or(&S::State(&["none-admitted"]), &HASH)),
        ])),
    ),
    (
        "geometry_types",
        S::Or(&S::State(&["not-declared"]), &S::List(&TEXT, MAX_ITEMS)),
    ),
]);
const LINK: S = S::Tagged(
    "rel",
    &[
        (
            "audit-record",
            &[("ref", TEXT), ("held", S::Word(&["machine"]))],
        ),
        ("snapshot", &[("ref", HASH)]),
    ],
);
const STEP: S = S::Obj(&[
    ("id", ID),
    ("parent", S::Or(&S::Null, &ID)),
    ("at", S::At),
    (
        "kind",
        S::Word(&["data", "scope", "style", "snapshot", "export"]),
    ),
    (
        "effect",
        S::Tagged(
            "class",
            &[
                ("workspace-mutation", &[]),
                ("pure-transformation", &[]),
                ("external-side-effect", &[("reversibility", REVERSIBILITY)]),
            ],
        ),
    ),
    (
        "actor",
        S::Tagged(
            "kind",
            &[
                ("user", &[]),
                ("ai", &[("id", TEXT)]),
                ("plugin", &[("id", TEXT)]),
            ],
        ),
    ),
    ("intent", S::Obj(&[("action", TEXT), ("params", S::Any)])),
    ("dependencies", DEPENDENCIES),
    (
        "data",
        S::Obj(&[
            ("dataset", S::Hex("spatial://dataset/ref/", 32)),
            (
                "identity",
                S::Or(
                    &S::Obj(&[("observed", S::Observed)]),
                    &S::Obj(&[("content_hash", HASH)]),
                ),
            ),
        ]),
    ),
    ("scope", S::Obj(&[("kind", S::Word(&["layer"]))])),
    ("links", S::List(&LINK, 16)),
]);
const MARK: S = S::Tagged(
    "kind",
    &[
        ("saved-here", &[("after", ID), ("at", S::At)]),
        ("restored", &[("to", ID), ("at", S::At)]),
    ],
);

/// Check `v` against `shape`, naming the member's path on a failure.
fn check(v: &Value, path: &str, shape: &S) -> Res<()> {
    let bad = |what: String| Err(malformed(path, what));
    let text = |max| bounded(v, path, max);
    let lower_hex =
        |h: &str, n| h.len() == n && h.bytes().all(|b| matches!(b, b'0'..=b'9' | b'a'..=b'f'));
    match shape {
        S::Null if v.is_null() => Ok(()),
        S::Null => bad("expected null".into()),
        S::Any => Ok(()),
        S::Text(max) if text(*max)?.is_empty() => bad("expected text".into()),
        S::Text(_) => Ok(()),
        S::Hex(prefix, n) => match text(MAX_TEXT)?.strip_prefix(prefix) {
            Some(h) if lower_hex(h, *n) => Ok(()),
            _ => bad(format!(
                "expected `{prefix}` and {n} lowercase hex characters"
            )),
        },
        S::At => {
            let at = text(32)?;
            let mark = |i| match i {
                4 | 7 => Some(b'-'),
                10 => Some(b'T'),
                13 | 16 => Some(b':'),
                19 => Some(b'Z'),
                _ => None,
            };
            let digits = at
                .bytes()
                .enumerate()
                .all(|(i, c)| mark(i).map_or(c.is_ascii_digit(), |m| m == c));
            if at.len() == 20 && digits {
                Ok(())
            } else {
                bad("expected RFC 3339, UTC, whole seconds".into())
            }
        }
        S::Observed => parse_observed(v, path).map(drop),
        S::Word(words) => {
            let w = text(MAX_TEXT)?;
            if words.contains(&w) {
                Ok(())
            } else {
                bad(format!("`{w}` is not one of {words:?}"))
            }
        }
        S::Int(lo, hi) => match v.as_u64() {
            Some(n) if (*lo..=*hi).contains(&n) => Ok(()),
            _ => bad(format!("expected an integer from {lo} to {hi}")),
        },
        S::Num(max) => match v.as_f64() {
            Some(n) if (0.0..=*max).contains(&n) => Ok(()),
            _ => bad(format!("expected a number from 0 to {max}")),
        },
        S::State(words) => {
            let o = closed(v, path, &["state", "basis"])?;
            let word = bounded(&o["state"], &join(path, "state"), MAX_TEXT)?;
            if word.is_empty() || !(words.is_empty() || words.contains(&word)) {
                return bad(format!("`{word}` is not a state word here"));
            }
            check(&o["basis"], &join(path, "basis"), &TEXT)
        }
        S::Obj(members) => {
            let keys: Vec<&str> = members.iter().map(|m| m.0).collect();
            let o = closed(v, path, &keys)?;
            members
                .iter()
                .try_for_each(|(k, m)| check(&o[*k], &join(path, k), m))
        }
        S::Tagged(tag, variants) => {
            let w = bounded(&v[*tag], &join(path, tag), MAX_TEXT)?;
            let Some((_, members)) = variants.iter().find(|(name, _)| *name == w) else {
                return Err(malformed(
                    &join(path, tag),
                    format!("`{w}` is not a known {tag}"),
                ));
            };
            let keys: Vec<&str> = std::iter::once(*tag)
                .chain(members.iter().map(|m| m.0))
                .collect();
            let o = closed(v, path, &keys)?;
            members
                .iter()
                .try_for_each(|(k, m)| check(&o[*k], &join(path, k), m))
        }
        S::List(item, max) => {
            let items = v.as_array().filter(|a| a.len() <= *max);
            let items =
                items.ok_or_else(|| malformed(path, format!("expected at most {max} entries")))?;
            items
                .iter()
                .enumerate()
                .try_for_each(|(i, x)| check(x, &format!("{path}[{i}]"), item))
        }
        S::Or(a, b) => check(v, path, a).or_else(|_| check(v, path, b)),
        S::StateOr(_) if v.get("state").is_some() => check(v, path, &S::State(&[])),
        S::StateOr(inner) => check(v, path, inner),
    }
}

/// The longest valid prefix of the history in `dir` (ADR-036 §9 as amended): the lines, from the
/// header on, that end in LF, hold no NUL, parse under §2 and §3, and chain.
pub fn recover(dir: &Path) -> Recovered {
    let mut bytes = Vec::new();
    let file = File::open(dir.join(HISTORY));
    match file.and_then(|f| {
        f.take(MAX_SESSION_HISTORY_BYTES + 1)
            .read_to_end(&mut bytes)
    }) {
        Ok(_) => recover_bytes(&bytes),
        Err(e) => {
            let rule = format!("{HISTORY} could not be read: {e}");
            Recovered {
                header: None,
                lines: Vec::new(),
                failure: Some(Failure { line: 0, rule }),
            }
        }
    }
}

/// Where a line chains: the header's `actions`, the step ids seen, the last step, and the id the
/// next step's `parent` must be (the last step, or after a restored mark the mark's `to`).
#[derive(Default)]
struct Chain {
    actions: u64,
    seen: Vec<String>,
    last: Option<String>,
    parent: Option<String>,
}

fn recover_bytes(bytes: &[u8]) -> Recovered {
    let mut out = Recovered {
        header: None,
        lines: Vec::new(),
        failure: None,
    };
    let mut chain = Chain::default();
    let mut total = 0u64;
    let mut n = 0;
    for raw in bytes.split_inclusive(|b| *b == b'\n') {
        n += 1;
        total += raw.len() as u64;
        let line = if total > MAX_SESSION_HISTORY_BYTES {
            Err(malformed(
                "$",
                format!("the history passes {MAX_SESSION_HISTORY_BYTES} bytes"),
            ))
        } else {
            read_line(raw, n == 1, &mut chain, &mut out.header)
        };
        match line {
            Ok(line) => out.lines.push(line),
            Err(e) => {
                out.failure = Some(Failure {
                    line: n,
                    rule: e.to_string(),
                });
                return out;
            }
        }
    }
    if n == 0 {
        out.failure = Some(Failure {
            line: 1,
            rule: "the file holds no header line".into(),
        });
    }
    out
}

fn read_line(
    raw: &[u8],
    first: bool,
    chain: &mut Chain,
    header: &mut Option<Header>,
) -> Res<String> {
    let Some(body) = raw.strip_suffix(b"\n") else {
        return Err(malformed("$", "the line does not end in LF: a torn write"));
    };
    let ceiling = if first {
        MAX_HEADER_LINE_BYTES
    } else {
        MAX_STEP_LINE_BYTES
    };
    if body.len() > ceiling {
        return Err(malformed("$", format!("the line passes {ceiling} bytes")));
    } else if body.contains(&0) {
        return Err(malformed("$", "the line holds a NUL"));
    }
    let text = std::str::from_utf8(body).map_err(|_| malformed("$", "the line is not UTF-8"))?;
    let v: Value =
        serde_json::from_str(text).map_err(|e| malformed("$", format!("not JSON: {e}")))?;
    if has_duplicate_key(text) {
        return Err(malformed(
            "$",
            "an object holds a duplicate key (ADR-036 §2)",
        ));
    }
    let text_of = |v: &Value| v.as_str().map(str::to_string);
    let key = v
        .as_object()
        .filter(|o| o.len() == 1)
        .and_then(|o| o.keys().next());
    match (first, key.map(String::as_str)) {
        (true, _) => {
            check(&v, "$", &HEADER)?;
            let items = v["datasets"].as_array().filter(|a| !a.is_empty());
            let items =
                items.ok_or_else(|| malformed("$.datasets", "expected one to eight entries"))?;
            let datasets = items
                .iter()
                .map(DatasetRef::parse)
                .collect::<Res<Vec<_>>>()?;
            chain.actions = v["actions"].as_u64().unwrap_or(0);
            *header = Some(Header {
                actions: chain.actions,
                datasets,
            });
        }
        (false, Some("step")) => {
            let step = &v["step"];
            check(step, "$.step", &STEP)?;
            check_intent(
                &step["intent"],
                step["kind"].as_str().unwrap_or(""),
                chain.actions,
            )?;
            if text_of(&step["parent"]) != chain.parent {
                let rule = "a step's parent is the id of the step before it or, after a restored mark, the mark's `to`";
                return Err(malformed("$.step.parent", rule));
            }
            chain.last = text_of(&step["id"]);
            chain.seen.extend(chain.last.clone());
            chain.parent = chain.last.clone();
        }
        (false, Some("mark")) => {
            let mark = &v["mark"];
            check(mark, "$.mark", &MARK)?;
            if mark["kind"] == "saved-here" && text_of(&mark["after"]) != chain.last {
                return Err(malformed(
                    "$.mark.after",
                    "`after` is the last step before the mark",
                ));
            } else if mark["kind"] == "restored" {
                let to = text_of(&mark["to"]).unwrap_or_default();
                if !chain.seen.contains(&to) {
                    return Err(malformed(
                        "$.mark.to",
                        "`to` is the id of a step before the mark",
                    ));
                }
                chain.parent = Some(to);
            }
        }
        _ => {
            return Err(malformed(
                "$",
                "a line holds exactly one of `step` or `mark`",
            ))
        }
    }
    Ok(text.to_string())
}

/// A registered action's `params` are checked in full, and its `kind` against the registry. An
/// action this reader has not registered is accepted only in a file whose `actions` is greater than
/// the reader's own, validated outside its `params`, which are kept as written: ADR-036 §3's one
/// opaque slot.
fn check_intent(intent: &Value, kind: &str, actions: u64) -> Res<()> {
    let action = intent["action"].as_str().unwrap_or("");
    match REGISTRY.iter().find(|(name, ..)| *name == action) {
        Some((_, k, params)) if *k == kind => check(&intent["params"], "$.step.intent.params", params),
        Some((_, k, _)) => Err(malformed("$.step.kind", format!("`{action}` is a `{k}` step"))),
        None if actions > ACTIONS => Ok(()),
        None => Err(malformed(
            "$.step.intent.action",
            format!("`{action}` is not registered, and `actions` {actions} is not greater than {ACTIONS}"),
        )),
    }
}

/// Whether any object in `text` (already valid JSON) holds two keys that decode equal.
fn has_duplicate_key(text: &str) -> bool {
    let bytes = text.as_bytes();
    let mut stack: Vec<Option<Vec<String>>> = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        match bytes[i] {
            b'{' => stack.push(Some(Vec::new())),
            b'[' => stack.push(None),
            b'}' | b']' => drop(stack.pop()),
            b'"' => {
                let start = i;
                i += 1;
                while bytes[i] != b'"' {
                    i += if bytes[i] == b'\\' { 2 } else { 1 };
                }
                let is_key = text[i + 1..].trim_start().starts_with(':');
                if let (Some(Some(keys)), true) = (stack.last_mut(), is_key) {
                    let key = serde_json::from_str::<String>(&text[start..=i]).unwrap_or_default();
                    if keys.contains(&key) {
                        return true;
                    }
                    keys.push(key);
                }
            }
            _ => {}
        }
        i += 1;
    }
    false
}

#[cfg(test)]
mod tests {
    use spatial_engine::crs::MAX_CRS_DEFINITION_BYTES;

    use super::*;

    const URI: &str = "spatial://dataset/ref/0123456789abcdef0123456789abcdef";
    const HASH: &str = "abababababababababababababababababababababababababababababababab";
    const OBSERVED: &str = r#"{"byte_size":27132,"modified_ns":"1700000000000000000","footer_length":11806,"footer_sha256":"abababababababababababababababababababababababababababababababab"}"#;
    const FILTER: &str = r#"{"action":"filter.apply","params":{"filter":{"predicate":"zone = 'civic'","dialect":"duckdb-expr/0"}}}"#;
    const OPACITY: &str =
        r#"{"action":"style.set","params":{"property":"fillOpacity","value":0.5}}"#;
    const COLOUR: &str =
        r##"{"action":"style.set","params":{"property":"fillColor","value":"#4285f4"}}"##;

    fn header(actions: u64) -> String {
        let project = r#"{"state":"not-yet-saved","basis":"b"}"#;
        let entry = format!(
            r#"{{"resource":{{"logical_uri":"{URI}","content_hash":{{"state":"not-taken","basis":"b"}},"source_revision":{{"state":"none-pinned","basis":"b"}},"locators":[{{"kind":"machine-recorded","at":"{URI}"}}],"cache_status":"linked","portability_policy":"linked-live-file"}},"observed":{OBSERVED},"admission":{{"crs_assertion":null,"identity":null}}}}"#
        );
        format!(
            r#"{{"format":"spatial-steps","version":1,"purpose":"session-history","project":{project},"actions":{actions},"datasets":[{entry}],"lineage":null}}"#
        )
    }

    fn sid(n: u8) -> String {
        format!("step_{n:032x}")
    }

    /// A step line; `crs` is the JSON text of its `dependencies.crs`.
    fn step(n: u8, parent: Option<u8>, kind: &str, intent: &str, crs: &str) -> String {
        let parent = parent.map_or("null".to_string(), |p| format!("\"{}\"", sid(p)));
        let deps = format!(
            r#"{{"fields":[{{"name":"zone","type":"Utf8"}}],"crs":{crs},"geometry_types":["Polygon"]}}"#
        );
        format!(
            r#"{{"step":{{"id":"{}","parent":{parent},"at":"2026-10-14T10:00:00Z","kind":"{kind}","effect":{{"class":"workspace-mutation"}},"actor":{{"kind":"user"}},"intent":{intent},"dependencies":{deps},"data":{{"dataset":"{URI}","identity":{{"observed":{OBSERVED}}}}},"scope":{{"kind":"layer"}},"links":[]}}}}"#,
            sid(n)
        )
    }

    fn crs(provenance: &str, definition: &str) -> String {
        format!(
            r#"{{"identifier":"EPSG:2056","provenance":"{provenance}","definition":{definition}}}"#
        )
    }

    fn sound() -> String {
        crs("crs:declared", &format!("\"sha256:{HASH}\""))
    }

    fn mark(kind: &str, key: &str, step: u8) -> String {
        format!(
            r#"{{"mark":{{"kind":"{kind}","{key}":"{}","at":"2026-10-14T10:00:05Z"}}}}"#,
            sid(step)
        )
    }

    /// H1: a filter step, two style steps, a `restored` mark, and a step after it.
    fn h1() -> Vec<String> {
        vec![
            header(2),
            step(1, None, "data", FILTER, &sound()),
            step(2, Some(1), "style", OPACITY, &sound()),
            step(3, Some(2), "style", COLOUR, &sound()),
            mark("restored", "to", 1),
            step(4, Some(1), "data", FILTER, &sound()),
        ]
    }

    type Fault = fn(&str) -> String;

    fn bytes(lines: &[String]) -> Vec<u8> {
        lines.iter().flat_map(|l| l.bytes().chain(*b"\n")).collect()
    }

    fn failure(lines: &[String]) -> Option<(usize, String)> {
        recover_bytes(&bytes(lines))
            .failure
            .map(|f| (f.line, f.rule))
    }

    /// U1. Mutation: recovery keeps every complete line (the rule block A replaces). Expected
    /// failure: this test fails at the first broken line, which is kept.
    #[test]
    fn recovery_keeps_the_longest_valid_prefix_and_names_the_first_failing_line() {
        let lines = h1();
        let whole = recover_bytes(&bytes(&lines));
        assert!(whole.failure.is_none(), "{:?}", whole.failure);
        assert_eq!(whole.lines, lines);
        assert_eq!(
            whole.header.map(|h| (h.actions, h.datasets.len())),
            Some((2, 1))
        );
        let faults: [(&str, Fault); 4] = [
            ("not JSON", |_| "{".to_string()),
            ("a NUL", |l| format!("{l}\0")),
            ("a duplicate key", |l| {
                l.replacen(":{", ":{\"x\":1,\"x\":2,", 1)
            }),
            ("an unknown key", |l| l.replacen(":{", ":{\"x\":1,", 1)),
        ];
        for k in 1..=lines.len() {
            for (what, fault) in faults {
                let mut broken = lines.clone();
                broken[k - 1] = fault(&lines[k - 1]);
                let got = recover_bytes(&bytes(&broken));
                assert_eq!(
                    got.lines,
                    lines[..k - 1],
                    "{what} at line {k}: nothing after it is kept"
                );
                assert_eq!(got.failure.map(|f| f.line), Some(k), "{what} at line {k}");
                assert_eq!(got.header.is_some(), k > 1);
            }
        }
        let mut broken = lines.clone();
        broken[2] = step(2, Some(9), "style", OPACITY, &sound());
        let (at, rule) = failure(&broken).unwrap();
        assert_eq!((at, rule.contains("parent")), (3, true), "{rule}");
    }

    /// U2. Mutation: a step's `parent` must equal the previous step's id. Expected failure: this
    /// test fails at the first assertion, the step after the mark.
    #[test]
    fn the_chain_follows_restored_marks() {
        assert_eq!(failure(&h1()), None);
        let mut lines = h1();
        lines[5] = step(4, Some(3), "data", FILTER, &sound());
        assert_eq!(
            failure(&lines).map(|f| f.0),
            Some(6),
            "the mark moved the parent to its `to`"
        );
        let mut lines = h1();
        lines[4] = mark("restored", "to", 9);
        assert!(failure(&lines).unwrap().1.contains("$.mark.to"));
        let mut lines = h1();
        lines.insert(4, mark("saved-here", "after", 2));
        assert!(
            failure(&lines).unwrap().1.contains("$.mark.after"),
            "not the last step"
        );
        let mut lines = h1();
        lines.insert(4, mark("saved-here", "after", 3));
        assert_eq!(failure(&lines), None);
    }

    /// U3. Mutation: a final line without LF is kept if it parses. Expected failure: this test
    /// fails at the cut that drops only the last LF.
    #[test]
    fn every_truncation_of_a_valid_history_recovers_a_prefix_and_never_a_line_past_the_cut() {
        let lines = h1();
        let all = bytes(&lines);
        let ends: Vec<usize> = (0..all.len())
            .filter(|i| all[*i] == b'\n')
            .map(|i| i + 1)
            .collect();
        for cut in 0..=all.len() {
            let got = recover_bytes(&all[..cut]);
            let whole = ends.iter().filter(|e| **e <= cut).count();
            assert_eq!(got.lines, lines[..whole], "cut at {cut}");
            let clean = cut > 0 && (cut == all.len() || ends.contains(&cut));
            assert_eq!(
                got.failure.map(|f| f.line),
                (!clean).then_some(whole + 1),
                "cut at {cut}"
            );
        }
    }

    /// U4. Mutation: the line is written back from the parsed value. Expected failure: this test
    /// fails at the byte comparison, since the params below are not in canonical spelling.
    #[test]
    fn an_unregistered_action_under_a_newer_actions_value_is_kept_byte_for_byte_and_refused_otherwise(
    ) {
        let opaque = r#"{ "order" : [2, 1.50, 2e3], "z" : {"n":null} }"#;
        let intent = format!(r#"{{"action":"layer.reorder","params":{opaque}}}"#);
        let line = step(2, Some(1), "data", &intent, &sound());
        let history = |actions| {
            vec![
                header(actions),
                step(1, None, "data", FILTER, &sound()),
                line.clone(),
            ]
        };
        let newer = recover_bytes(&bytes(&history(3)));
        assert!(newer.failure.is_none(), "{:?}", newer.failure);
        assert_eq!(newer.lines[2], line);
        let (at, rule) = failure(&history(2)).unwrap();
        assert_eq!((at, rule.contains("not registered")), (3, true), "{rule}");
    }

    fn history<W: Write>(out: W) -> History<W> {
        History::new(out, |_| Ok(()))
    }

    /// U5. Mutation: the history-ceiling check removed. Expected failure: this test fails at the
    /// third step, which is written.
    #[test]
    fn a_step_over_a_line_or_history_ceiling_is_refused_and_nothing_is_written() {
        let mut h = history(Vec::<u8>::new());
        h.ceilings = [50, 80, 100];
        let step = "x".repeat(40);
        h.append(&step, false).unwrap();
        let e = h.append(&"y".repeat(51), false).unwrap_err();
        let saw_limit = (e.fields["saw"].as_str(), e.fields["limit"].as_str());
        assert_eq!(
            (e.code.as_str(), saw_limit),
            ("skp.step_line_over_ceiling", ("51", "50"))
        );
        assert_eq!(
            h.append(&"h".repeat(81), true).unwrap_err().code,
            "skp.session_history_unwritable"
        );
        h.append(&step, false).unwrap();
        let before = h.out.clone();
        assert_eq!(
            h.append(&step, false).unwrap_err().code,
            "skp.session_history_full"
        );
        assert_eq!(h.out, before, "a refused step writes nothing");
        h.append("z", false).unwrap();
    }

    /// A sink whose write, or whose flush, can be made to fail.
    struct Flaky(bool, bool, Vec<u8>);

    impl Write for Flaky {
        fn write(&mut self, b: &[u8]) -> std::io::Result<usize> {
            if self.0 {
                return Err(std::io::Error::other("the disk is full"));
            }
            self.2.extend_from_slice(b);
            Ok(b.len())
        }
        fn flush(&mut self) -> std::io::Result<()> {
            Ok(())
        }
    }

    /// U6. Mutation: the stop flag is not set. Expected failure: this test fails at the step after
    /// the failed one, which is written.
    #[test]
    fn after_a_failed_write_the_history_takes_no_later_step() {
        let sync: fn(&mut Flaky) -> std::io::Result<()> = |f| {
            if f.1 {
                Err(std::io::Error::other("the flush failed"))
            } else {
                Ok(())
            }
        };
        for (fail_write, fail_sync) in [(true, false), (false, true)] {
            let mut h = History::new(Flaky(false, false, Vec::new()), sync);
            h.append("one", false).unwrap();
            (h.out.0, h.out.1) = (fail_write, fail_sync);
            assert_eq!(
                h.append("two", false).unwrap_err().code,
                "skp.session_history_unwritable"
            );
            (h.out.0, h.out.1) = (false, false);
            let seen = h.out.2.clone();
            assert_eq!(
                h.append("three", false).unwrap_err().code,
                "skp.session_history_stopped"
            );
            assert_eq!(h.out.2, seen, "nothing is written after the stop");
        }
    }

    /// U7. Control characters escape to six bytes, the worst under ADR-036 §2's canonical text.
    /// Bounded here by the engine's own ceilings (a predicate, a CRS definition) and, where none is
    /// declared (a CRS identifier, a column name, a geometry type), by 4,096 bytes each: past that
    /// the ceiling check refuses the step by name. Mutation: `MAX_STEP_LINE_BYTES` set below the
    /// computed worst case. Expected failure: this test fails at the step line's assertion.
    #[test]
    fn the_worst_case_header_and_step_lines_fit_their_ceilings() {
        let ctrl = |n: usize| "\u{1}".repeat(n);
        let column = Json::obj([
            ("name", Json::str(ctrl(1))),
            ("type", Json::str("x".repeat(64))),
        ]);
        let crs = Json::obj([
            ("identifier", Json::str(ctrl(MAX_TEXT))),
            ("provenance", Json::str("crs:format-default")),
            ("definition", Json::str(format!("sha256:{HASH}"))),
        ]);
        let types = Json::Arr(vec![Json::str(ctrl(MAX_TEXT))]);
        let fields = Json::Arr(vec![column; MAX_PREDICATE_BYTES / 4]);
        let deps = Json::obj([("fields", fields), ("crs", crs), ("geometry_types", types)]);
        let predicate = Json::str(ctrl(MAX_PREDICATE_BYTES));
        let filter = Json::obj([
            ("predicate", predicate),
            ("dialect", Json::str("duckdb-expr/0")),
        ]);
        let params = Json::obj([("filter", filter)]);
        let intent = Json::obj([("action", Json::str("filter.apply")), ("params", params)]);
        let data = Json::obj([("dataset", Json::str(URI)), ("identity", Json::Null)]);
        let step = step_object(
            &sid(1),
            Some(&sid(1)),
            "2026-10-14T10:00:00Z",
            "data",
            intent,
            deps,
            data,
        );
        let step = canonical(&Json::obj([("step", step)])).unwrap();
        assert!(
            step.len() <= MAX_STEP_LINE_BYTES,
            "a step line of {} bytes",
            step.len()
        );

        let long = |n: usize| Value::String(ctrl(n));
        let claims = serde_json::json!({
            "crs_assertion": {"identifier": long(MAX_TEXT), "definition_json": long(MAX_CRS_DEFINITION_BYTES)},
            "identity": {"column": long(MAX_TEXT)}
        });
        let mut entry: Value = serde_json::from_str(&header(2)).unwrap();
        entry = entry["datasets"][0].clone();
        entry["admission"] = claims;
        let header =
            canonical(&header_object(DatasetRef::parse(&entry).unwrap().to_json())).unwrap();
        assert!(
            header.len() <= MAX_HEADER_LINE_BYTES,
            "a header line of {} bytes",
            header.len()
        );
    }

    /// U8. Mutation: the reader's word check on `provenance` removed. Expected failure: this test
    /// fails at the first word outside the three.
    #[test]
    fn recover_refuses_a_crs_provenance_outside_the_three_classes() {
        let with = |p: &str| {
            failure(&[
                header(2),
                step(
                    1,
                    None,
                    "data",
                    FILTER,
                    &crs(p, &format!("\"sha256:{HASH}\"")),
                ),
            ])
        };
        for ok in ["crs:declared", "crs:asserted", "crs:format-default"] {
            assert_eq!(with(ok), None, "{ok}");
        }
        for bad in [
            "file",
            "caller_asserted",
            "format-rule",
            "crs:other",
            "not-established",
            "",
        ] {
            let (at, rule) = with(bad).unwrap_or_default();
            assert_eq!(
                (at, rule.contains("crs.provenance")),
                (2, true),
                "{bad:?}: {rule}"
            );
        }
    }

    /// U9. Mutation: the reader accepts any string for `definition`. Expected failure: this test
    /// fails at the first string that is not a hash.
    #[test]
    fn recover_refuses_a_definition_that_is_neither_a_sha256_nor_none_admitted() {
        let with = |d: &str| {
            failure(&[
                header(2),
                step(1, None, "data", FILTER, &crs("crs:declared", d)),
            ])
        };
        let none = r#"{"state":"none-admitted","basis":"b"}"#;
        for ok in [format!("\"sha256:{HASH}\""), none.to_string()] {
            assert_eq!(with(&ok), None, "{ok}");
        }
        let upper = format!("\"sha256:{}\"", HASH.to_uppercase());
        for bad in [
            "\"abc\"",
            &upper,
            "\"sha256:\"",
            "null",
            r#"{"state":"empty","basis":"b"}"#,
        ] {
            let (at, rule) = with(bad).unwrap_or_default();
            assert_eq!(
                (at, rule.contains("crs.definition")),
                (2, true),
                "{bad}: {rule}"
            );
        }
    }
}
