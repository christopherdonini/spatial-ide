// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The recovery offer** (`protocol/skp/SKP-V0.md` §13 to §15; B2 piece 1c, step 3,
//! `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` §2.3 as its amendments
//! leave it): what a crashed run left in the session store, offered at a start (the `unsaved-`
//! records) and at a project's open (that project's record), and what accepting or declining one
//! does. Three entry points on [`StepRecorder`], which owns the state they read and push into:
//! [`StepRecorder::list_recoverable`], [`StepRecorder::recover_session`] and
//! [`StepRecorder::discard_recoverable`].
//!
//! - **A record is read through its own handle, under its own lock** (H1: on Windows a held lock
//!   makes a read through any other handle fail). A record whose lock is held is another run's, and
//!   is never offered, read or removed. Listing removes nothing.
//! - **No reply carries a path.** The data's place is read from `locations.json`, and only its last
//!   name crosses, cut and marked as `open_project`'s `not_found` is.
//! - **The state lock is never held across a probe, a read, `metadata` or the open.**

use std::fs::{File, OpenOptions, TryLockError};
use std::io::{ErrorKind, Read, Seek, SeekFrom};
use std::path::{Path, PathBuf};
use std::sync::{Mutex, MutexGuard};

use serde_json::{json, Value};
use spatial_engine::EngineError;
use spatial_renderer::style::{self, Rgb};
use spatial_skp::v0::{
    AdmissionChange, CannotBeOfferedReason, CloseDatasetRequest, DatasetHandle,
    DiscardRecoverableRequest, DiscardRecoverableResponse, ListRecoverableRequest,
    ListRecoverableResponse, ObservedChange, OpenDatasetRequest, RecoverSessionRequest,
    RecoverSessionResponse, RecoverableData, RecoverableRecord, RecoveredOpen, ReopenCheck,
    SkpError, StepIntent, StyleSetParams, SKP_VERSION,
};

use crate::dataset_ref::{DatasetRef, DatasetUri, RefCheck};
use crate::project::store::{self, LOCATIONS_LIMITS};
use crate::project::ProjectUri;
use crate::session_history::{
    match_wire, read_through, recover_bytes, recover_head, History, Holder, Reached, Record,
    Recovered, State, StepRecorder, ACTIONS, HISTORY, LOCATIONS, MAX_SESSION_HISTORY_BYTES,
};
use crate::skp::{check_version, error_of, SkpHost};

/// The `unsaved-` records one start's listing takes (a draft value; the gates check it). A folder
/// the walk skips, or a `<hex>` folder, does not count.
const MAX_RECOVERABLE_RECORDS: usize = 64;
/// The `<hex>` folders holding a `locations.json` that one dedupe examines (a draft value; the
/// gates check it). One more makes the dedupe incomplete, and every record it examined is then
/// withheld.
const MAX_DEDUPE_RECORDS: usize = 256;
const UNSAVED: &str = "unsaved-";

fn lock<T>(m: &Mutex<T>) -> MutexGuard<'_, T> {
    m.lock().unwrap_or_else(|e| e.into_inner())
}

// ---------------------------------------------------------------------------------------------
// Names and words
// ---------------------------------------------------------------------------------------------

/// The two shapes of a record's folder name: `unsaved-` and 32 lowercase hex characters (an open
/// that never saved), or 32 lowercase hex characters (a project's record).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Shape {
    Unsaved,
    Project,
}

fn shape_of(name: &str) -> Option<Shape> {
    let hex = |s: &str| s.len() == 32 && s.bytes().all(|b| matches!(b, b'0'..=b'9' | b'a'..=b'f'));
    match name.strip_prefix(UNSAVED) {
        Some(rest) if hex(rest) => Some(Shape::Unsaved),
        None if hex(name) => Some(Shape::Project),
        _ => None,
    }
}

/// A text taken from a file or a request, as it may reach the wire: every control character
/// replaced by U+FFFD, then, past 256 bytes, cut at the last character boundary within them and
/// marked with ` [cut]` (`open_project`'s `file_name`, SKP-V0 §12.2).
fn bounded(text: &str) -> String {
    const MAX: usize = 256;
    let mut out: String = text
        .chars()
        .map(|c| if c.is_control() { '\u{fffd}' } else { c })
        .collect();
    if out.len() > MAX {
        let cut = (0..=MAX).rev().find(|&i| out.is_char_boundary(i));
        out.truncate(cut.unwrap_or(0));
        out.push_str(" [cut]");
    }
    out
}

fn unknown(record: &str) -> SkpError {
    SkpError::recoverable_record_unknown(&bounded(record))
}

fn refused(record: &str, file: &str, rule: &str) -> SkpError {
    SkpError::recoverable_record_refused(&bounded(record), file, rule)
}

/// The file and the rule a record that cannot be offered is refused with at `recover_session`.
fn refusal_of(record: &str, reason: CannotBeOfferedReason) -> SkpError {
    match reason {
        CannotBeOfferedReason::NoStep => refused(
            record,
            HISTORY,
            "the history holds no step the reader keeps",
        ),
        CannotBeOfferedReason::LaterVersion => refused(
            record,
            HISTORY,
            "the history was written by a later version, or holds a restored mark",
        ),
        CannotBeOfferedReason::LocationsRefused => refused(
            record,
            LOCATIONS,
            "the record of the data's place is refused, or holds none for the dataset",
        ),
    }
}

// ---------------------------------------------------------------------------------------------
// Reading one record
// ---------------------------------------------------------------------------------------------

/// What probing a record's history found.
enum Probe {
    /// No `history.jsonl`, or one of 0 bytes: a run creates its history empty and locks it before
    /// the header is written, so a 0-byte history may be another run's. Nothing was locked.
    Gone,
    /// Another handle holds the lock: a live run's record.
    Busy,
    /// A metadata, open or lock call failed in any other way.
    Failed,
    /// The history, open for reading and writing and locked by this handle.
    Held(File),
}

fn probe(dir: &Path) -> Probe {
    let path = dir.join(HISTORY);
    match std::fs::metadata(&path) {
        Ok(m) if m.len() > 0 => {}
        Ok(_) => return Probe::Gone,
        Err(e) if e.kind() == ErrorKind::NotFound => return Probe::Gone,
        Err(_) => return Probe::Failed,
    }
    // Read and write, not read alone: Windows refuses to lock an append-only handle, and the
    // accept cuts the file to its kept steps through this handle.
    let opened = OpenOptions::new().read(true).write(true).open(&path);
    let file = match opened {
        Ok(file) => file,
        Err(e) if e.kind() == ErrorKind::NotFound => return Probe::Gone,
        Err(_) => return Probe::Failed,
    };
    match file.try_lock() {
        Ok(()) => Probe::Held(file),
        Err(TryLockError::WouldBlock) => Probe::Busy,
        Err(TryLockError::Error(_)) => Probe::Failed,
    }
}

/// What was read of one record: its history through its own locked handle, and its
/// `locations.json` (`None` when it could not be read within its bound).
struct Seen {
    recovered: Recovered,
    locations: Option<Vec<u8>>,
}

fn read_seen(dir: &Path, file: &File) -> Option<Seen> {
    let bytes = read_through(file, MAX_SESSION_HISTORY_BYTES + 1).ok()?;
    Some(Seen {
        recovered: recover_bytes(&bytes),
        locations: read_locations_bytes(&dir.join(LOCATIONS)),
    })
}

/// `locations.json`, bounded to the reader's own limit and one byte more, which the reader then
/// refuses.
fn read_locations_bytes(path: &Path) -> Option<Vec<u8>> {
    let file = File::open(path).ok()?;
    let mut bytes = Vec::new();
    let limit = LOCATIONS_LIMITS.max_bytes as u64 + 1;
    file.take(limit).read_to_end(&mut bytes).ok()?;
    Some(bytes)
}

/// How a record reads, from what was read of it.
enum Say {
    /// Offered with Recover and Discard.
    Offer,
    /// Listed with Discard only.
    Only(CannotBeOfferedReason),
    /// A project's record with no step after its last `saved-here` mark: not listed, and left.
    Quiet,
}

struct Judged {
    say: Say,
    steps: u64,
    last_at: Option<String>,
    /// The dataset's place, from `locations.json`'s entry for the header's dataset.
    place: Option<PathBuf>,
    file_name: Option<String>,
}

/// The steps and marks of the kept lines.
struct Scan {
    steps: u64,
    last_at: Option<String>,
    first_step: Option<String>,
    restored: bool,
    marked: bool,
    after_mark: u64,
}

fn scan(lines: &[String]) -> Scan {
    let mut out = Scan {
        steps: 0,
        last_at: None,
        first_step: None,
        restored: false,
        marked: false,
        after_mark: 0,
    };
    for line in lines.iter().skip(1) {
        let Ok(v) = serde_json::from_str::<Value>(line) else {
            continue;
        };
        if let Some(step) = v.get("step") {
            out.steps += 1;
            out.after_mark += 1;
            out.last_at = step["at"].as_str().map(str::to_string);
            let id = step["id"].as_str().map(str::to_string);
            out.first_step = out.first_step.take().or(id);
        } else if v["mark"]["kind"] == "saved-here" {
            (out.marked, out.after_mark) = (true, 0);
        } else if v["mark"]["kind"] == "restored" {
            out.restored = true;
        }
    }
    out
}

/// Judge a record. The order is the listing's: no kept step, then a later version (a header's
/// `actions` over this kernel's, or a `restored` mark, which no product code writes), then a
/// `locations.json` that is refused or holds no entry for the header's one dataset. At a project's
/// open, a record with no step after its last `saved-here` mark is then left unlisted.
fn judge(seen: Option<&Seen>, at_open: bool) -> Judged {
    let only = |reason| Judged {
        say: Say::Only(reason),
        steps: 0,
        last_at: None,
        place: None,
        file_name: None,
    };
    let Some(seen) = seen else {
        return only(CannotBeOfferedReason::NoStep);
    };
    let found = scan(&seen.recovered.lines);
    let header = seen.recovered.header.as_ref();
    let uri = header
        .filter(|h| h.datasets.len() == 1)
        .map(|h| h.datasets[0].uri());
    let entries = seen
        .locations
        .as_deref()
        .and_then(|bytes| store::read_locations(bytes).ok());
    let place = entries
        .zip(uri)
        .and_then(|(entries, uri)| entries.into_iter().find(|l| &l.dataset == uri))
        .map(|l| l.path);
    let file_name = place.as_ref().and_then(|p| p.file_name());
    let file_name = file_name.and_then(|n| n.to_str()).map(bounded);
    let say = if found.steps == 0 {
        Say::Only(CannotBeOfferedReason::NoStep)
    } else if header.is_some_and(|h| h.actions > ACTIONS) || found.restored {
        Say::Only(CannotBeOfferedReason::LaterVersion)
    } else if place.is_none() {
        Say::Only(CannotBeOfferedReason::LocationsRefused)
    } else if at_open && found.marked && found.after_mark == 0 {
        Say::Quiet
    } else {
        Say::Offer
    };
    if let Say::Only(reason) = say {
        let mut judged = only(reason);
        judged.file_name = file_name;
        return judged;
    }
    Judged {
        say,
        steps: found.steps,
        last_at: found.last_at,
        place,
        file_name,
    }
}

/// An entry of the list, from a judged record. `metadata` of the data's place is the only look at
/// the data (no byte of it is read), and is taken by the caller after every lock is released.
fn entry(record: &str, judged: &Judged) -> Option<RecoverableRecord> {
    let data = match &judged.say {
        Say::Quiet => return None,
        Say::Only(reason) => RecoverableData::CannotBeOffered { reason: *reason },
        Say::Offer => match judged.place.as_deref().map(std::fs::metadata) {
            Some(Ok(_)) => RecoverableData::Found {},
            _ => RecoverableData::NotFound {},
        },
    };
    Some(RecoverableRecord {
        record: record.to_string(),
        file_name: judged.file_name.clone(),
        last_step_at: judged.last_at.clone(),
        steps: judged.steps,
        data,
    })
}

// ---------------------------------------------------------------------------------------------
// A start's listing: the walk, then the dedupe
// ---------------------------------------------------------------------------------------------

/// One `unsaved-` record the walk took: its lock is kept (in `_lock`) until the dedupe ends.
struct Taken {
    name: String,
    _lock: Option<File>,
    seen: Option<Seen>,
}

struct Walked {
    taken: Vec<Taken>,
    more: bool,
}

/// The names of the folders under `root`, in name order. A root that is not there holds none.
fn folder_names(root: &Path) -> Option<Vec<String>> {
    let entries = match std::fs::read_dir(root) {
        Ok(entries) => entries,
        Err(e) if e.kind() == ErrorKind::NotFound => return Some(Vec::new()),
        Err(_) => return None,
    };
    let names = entries.filter_map(|e| e.ok()?.file_name().into_string().ok());
    let mut names: Vec<String> = names.collect();
    names.sort();
    Some(names)
}

/// The walk of a start: the `unsaved-` folders in name order that this run does not hold, each
/// probed and, where its lock is taken, read. At most [`MAX_RECOVERABLE_RECORDS`] are taken; a
/// folder with no history, an empty one or a locked one is skipped before it counts.
fn walk(root: &Path, held: &[String]) -> Walked {
    let mut walked = Walked {
        taken: Vec::new(),
        more: false,
    };
    for name in folder_names(root).unwrap_or_default() {
        if shape_of(&name) != Some(Shape::Unsaved) || held.contains(&name) {
            continue;
        }
        let dir = root.join(&name);
        let (file, seen) = match probe(&dir) {
            Probe::Gone | Probe::Busy => continue,
            Probe::Failed => (None, None),
            Probe::Held(file) => {
                let seen = read_seen(&dir, &file);
                (Some(file), seen)
            }
        };
        if walked.taken.len() == MAX_RECOVERABLE_RECORDS {
            walked.more = true;
            break;
        }
        walked.taken.push(Taken {
            name,
            _lock: file,
            seen,
        });
    }
    walked
}

/// What the dedupe says of one taken record.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Verdict {
    Offer,
    /// A `<hex>` record already holds it: the project's record is the one offered, at its open.
    Twin,
    /// A live run's lock stands between this record and an answer.
    Locked,
    /// The dedupe could not be made, so this record is not offered.
    Withheld,
}

/// The `<hex>` folders that hold a `locations.json`, with its length: read afresh from the root,
/// after the walk's locks are held. `None` when the dedupe cannot be completed, by a failure or by
/// finding more than [`MAX_DEDUPE_RECORDS`].
fn hex_folders(root: &Path) -> Option<Vec<(String, u64)>> {
    let mut found = Vec::new();
    for name in folder_names(root)? {
        if shape_of(&name) != Some(Shape::Project) {
            continue;
        }
        match std::fs::metadata(root.join(&name).join(LOCATIONS)) {
            Ok(_) if found.len() == MAX_DEDUPE_RECORDS => return None,
            Ok(m) => found.push((name, m.len())),
            Err(e) if e.kind() == ErrorKind::NotFound => {}
            Err(_) => return None,
        }
    }
    Some(found)
}

/// The dedupe, once per start, after the walk and while the walk's locks are held: the verdict on
/// each taken record, in the walk's order. It reads the folder names itself.
fn dedupe(root: &Path, taken: &[Taken]) -> Vec<Verdict> {
    let Some(folders) = hex_folders(root) else {
        return vec![Verdict::Withheld; taken.len()];
    };
    let verdict = |t: &Taken| {
        let seen = t.seen.as_ref();
        let first = seen.and_then(|s| scan(&s.recovered.lines).first_step);
        let locations = seen.and_then(|s| s.locations.as_deref());
        verdict_of(root, locations, first.as_deref(), &folders)
    };
    taken.iter().map(verdict).collect()
}

/// The verdict on one record whose `locations.json` is `locations` and whose first step is
/// `first`: each `<hex>` folder whose `locations.json` holds the same bytes is a candidate, and is
/// a twin when its history's first step is the same step, or neither holds one.
fn verdict_of(
    root: &Path,
    locations: Option<&[u8]>,
    first: Option<&str>,
    folders: &[(String, u64)],
) -> Verdict {
    let Some(mine) = locations else {
        return Verdict::Offer;
    };
    let mut twin = false;
    for (hex, _) in folders.iter().filter(|(_, len)| *len == mine.len() as u64) {
        match candidate(&root.join(hex), mine, first) {
            Verdict::Offer => {}
            Verdict::Twin => twin = true,
            other => return other,
        }
    }
    if twin {
        Verdict::Twin
    } else {
        Verdict::Offer
    }
}

fn candidate(dir: &Path, mine: &[u8], first: Option<&str>) -> Verdict {
    match read_locations_bytes(&dir.join(LOCATIONS)) {
        Some(theirs) if theirs == mine => {}
        Some(_) => return Verdict::Offer,
        None if !dir.join(LOCATIONS).exists() => return Verdict::Offer,
        None => return Verdict::Withheld,
    }
    let file = match probe(dir) {
        Probe::Gone => return Verdict::Offer,
        Probe::Busy => return Verdict::Locked,
        Probe::Failed => return Verdict::Withheld,
        Probe::Held(file) => file,
    };
    match recover_head(&file) {
        Ok(head) if head.header.is_some() => {
            let theirs = scan(&head.lines).first_step;
            if theirs.as_deref() == first {
                Verdict::Twin
            } else {
                Verdict::Offer
            }
        }
        _ => Verdict::Withheld,
    }
}

// ---------------------------------------------------------------------------------------------
// The entry points
// ---------------------------------------------------------------------------------------------

/// A record's name held by one `recover_session` or `discard_recoverable` call, so that a second
/// call on it is `unknown` and not `locked`. Released when the call ends.
struct Reservation<'a> {
    recorder: &'a StepRecorder,
    name: String,
}

impl Drop for Reservation<'_> {
    fn drop(&mut self) {
        lock(&self.recorder.state)
            .reserved
            .retain(|n| *n != self.name);
    }
}

/// The names of the records this run holds or is working on.
fn held_names(state: &State) -> Vec<String> {
    let dirs = state.records.iter().filter_map(|r| r.dir.file_name());
    let names = dirs.map(|n| n.to_string_lossy().into_owned());
    names.chain(state.reserved.iter().cloned()).collect()
}

impl StepRecorder {
    /// `list_recoverable` (SKP-V0 §13). With no `dataset`, a start's list: the `unsaved-` records
    /// left by runs that ended without `end_session`. With one, that open's project's record, when
    /// the open is a reopen. Nothing is removed, and no record another run holds is offered.
    pub fn list_recoverable(
        &self,
        req: ListRecoverableRequest,
    ) -> Result<ListRecoverableResponse, SkpError> {
        check_version(&req.skp)?;
        if let Some(handle) = &req.dataset {
            let name = handle.as_str();
            if self.host.catalog().get(name).is_none() {
                return Err(SkpError::unknown_dataset(name));
            }
        }
        let (held, project) = {
            let state = lock(&self.state);
            let project = req.dataset.as_ref().and_then(|h| {
                let open = state.opens.iter().find(|o| o.name == h.as_str());
                open.and_then(|o| o.reopened_as.clone())
            });
            (held_names(&state), project)
        };
        let mut judged = Vec::new();
        let mut more = false;
        match (&req.dataset, project) {
            (None, _) => {
                let Walked { taken, more: over } = walk(&self.root, &held);
                let verdicts = dedupe(&self.root, &taken);
                more = over;
                for (t, verdict) in taken.iter().zip(verdicts) {
                    match verdict {
                        Verdict::Offer => {
                            judged.push((t.name.clone(), judge(t.seen.as_ref(), false)))
                        }
                        Verdict::Twin => {}
                        Verdict::Locked | Verdict::Withheld => more = true,
                    }
                }
                drop(taken);
            }
            (Some(_), Some(project)) => {
                let name = project.hex().to_string();
                if !held.contains(&name) {
                    let dir = self.root.join(&name);
                    let seen = match probe(&dir) {
                        Probe::Gone | Probe::Busy => None,
                        Probe::Failed => Some(judge(None, true)),
                        Probe::Held(file) => Some(judge(read_seen(&dir, &file).as_ref(), true)),
                    };
                    judged.extend(seen.map(|j| (name, j)));
                }
            }
            (Some(_), None) => {}
        }
        // Every lock is released: only now is the data's place looked at.
        let records = judged.iter().filter_map(|(name, j)| entry(name, j));
        Ok(ListRecoverableResponse {
            records: records.collect(),
            more,
        })
    }

    /// Reserve `record` for one call: `unknown` when this run holds it or another call has it.
    fn reserve(&self, record: &str) -> Result<Reservation<'_>, SkpError> {
        let mut state = lock(&self.state);
        if held_names(&state).iter().any(|n| n == record) {
            return Err(unknown(record));
        }
        state.reserved.push(record.to_string());
        Ok(Reservation {
            recorder: self,
            name: record.to_string(),
        })
    }

    /// `discard_recoverable` (SKP-V0 §15): the record's two files are removed under its lock (H2:
    /// a removal made while the locking handle is open takes effect when it closes), the handle is
    /// dropped, and the folder is removed. A folder's removal that fails is ignored; a file's is
    /// refused.
    pub fn discard_recoverable(
        &self,
        req: DiscardRecoverableRequest,
    ) -> Result<DiscardRecoverableResponse, SkpError> {
        check_version(&req.skp)?;
        let record = req.record.as_str();
        shape_of(record).ok_or_else(|| unknown(record))?;
        let _reserved = self.reserve(record)?;
        let dir = self.root.join(record);
        let file = match probe(&dir) {
            Probe::Held(file) => file,
            Probe::Busy => return Err(SkpError::recoverable_record_locked(record)),
            Probe::Gone => return Err(unknown(record)),
            Probe::Failed => {
                return Err(refused(record, HISTORY, "the history could not be locked"))
            }
        };
        for name in [HISTORY, LOCATIONS] {
            match std::fs::remove_file(dir.join(name)) {
                Ok(()) => {}
                Err(e) if e.kind() == ErrorKind::NotFound => {}
                Err(e) => return Err(refused(record, name, &e.to_string())),
            }
        }
        drop(file);
        let _ = std::fs::remove_dir(&dir);
        Ok(DiscardRecoverableResponse {})
    }

    /// `recover_session` (SKP-V0 §14), in the form's order: the name, the reservation, the lock and
    /// the read, the listing's conditions again, for an `unsaved-` record the dedupe for it alone,
    /// then the open (or the check of the open given), the cut to the kept steps and the push into
    /// this run's records. A refusal leaves the record as it was, with its lock released.
    pub fn recover_session(
        &self,
        req: RecoverSessionRequest,
    ) -> Result<RecoverSessionResponse, SkpError> {
        check_version(&req.skp)?;
        let record = req.record.as_str();
        let shape = shape_of(record).ok_or_else(|| unknown(record))?;
        let _reserved = self.reserve(record)?;
        let dir = self.root.join(record);
        let file = match probe(&dir) {
            Probe::Held(file) => file,
            Probe::Busy => return Err(SkpError::recoverable_record_locked(record)),
            Probe::Gone => return Err(unknown(record)),
            Probe::Failed => {
                return Err(refused(record, HISTORY, "the history could not be locked"))
            }
        };
        let Some(seen) = read_seen(&dir, &file) else {
            return Err(refused(record, HISTORY, "the history could not be read"));
        };
        let judged = judge(Some(&seen), false);
        if let Say::Only(reason) = judged.say {
            return Err(refusal_of(record, reason));
        }
        if shape == Shape::Unsaved {
            self.twin_check(record, &seen)?;
        }
        let (Some(header), Some(place)) = (&seen.recovered.header, judged.place) else {
            return Err(refusal_of(record, CannotBeOfferedReason::LocationsRefused));
        };
        let replayed = replay(&seen.recovered.lines).ok_or_else(|| {
            refused(
                record,
                HISTORY,
                "a kept step does not read back as an intent",
            )
        })?;
        let kept: u64 = seen
            .recovered
            .lines
            .iter()
            .map(|l| l.len() as u64 + 1)
            .sum();
        let adopt = Adopt {
            record: record.to_string(),
            dir,
            cancel_key: req.cancel_key.clone(),
            reference: header.datasets[0].clone(),
            place,
            kept,
            replayed,
        };
        match (shape, &req.dataset) {
            (Shape::Unsaved, None) => self.adopt_new(&adopt, file),
            (Shape::Project, Some(handle)) => self.adopt_bound(&adopt, file, handle),
            _ => Err(SkpError::recoverable_record_not_for_this_open(record)),
        }
    }

    /// Step 3a: the dedupe for this record alone, its names read after its lock. A twin is
    /// `unknown`; a candidate another run's lock refuses is `locked`; any other withheld case, or a
    /// dedupe that could not be completed, is `unknown`.
    fn twin_check(&self, record: &str, seen: &Seen) -> Result<(), SkpError> {
        let first = scan(&seen.recovered.lines).first_step;
        let folders = hex_folders(&self.root).ok_or_else(|| unknown(record))?;
        let locations = seen.locations.as_deref();
        match verdict_of(&self.root, locations, first.as_deref(), &folders) {
            Verdict::Offer => Ok(()),
            Verdict::Locked => Err(SkpError::recoverable_record_locked(record)),
            Verdict::Twin | Verdict::Withheld => Err(unknown(record)),
        }
    }
}

// ---------------------------------------------------------------------------------------------
// Accepting a record
// ---------------------------------------------------------------------------------------------

/// What the kept lines of a record hold that the accept needs.
struct Replayed {
    last_step: Option<String>,
    reached: Reached,
    /// The last `StepIntent` for each key, in the order filter, fillColor, outlineColor,
    /// fillOpacity, outlineWidth.
    intents: [Option<StepIntent>; 5],
}

/// The fill colour a `fillColor` step sets, as the renderer's `parse` holds it (the one place a
/// colour or a match is read, as `record_step` reads it).
fn fill_of(intent: &StepIntent) -> Option<style::Value<Rgb>> {
    let leaf = match intent {
        StepIntent::StyleSet(StyleSetParams::FillColor { value }) => json!({ "literal": value }),
        StepIntent::StyleSet(StyleSetParams::FillColorMatch { value }) => match_wire(value),
        _ => return None,
    };
    let document = json!({ "style_version": 1, "layer": {
        "geometry": "polygon", "fill_color": leaf, "fill_opacity": {"literal": 1.0},
        "outline_color": {"literal": "#000000"}, "outline_width": {"literal": 0.0}
    }});
    style::parse(&document.to_string())
        .ok()
        .map(|p| p.fill_color)
}

fn key_of(intent: &StepIntent) -> usize {
    match intent {
        StepIntent::FilterApply(_) => 0,
        StepIntent::StyleSet(StyleSetParams::FillColor { .. })
        | StepIntent::StyleSet(StyleSetParams::FillColorMatch { .. }) => 1,
        StepIntent::StyleSet(StyleSetParams::OutlineColor { .. }) => 2,
        StepIntent::StyleSet(StyleSetParams::FillOpacity { .. }) => 3,
        StepIntent::StyleSet(StyleSetParams::OutlineWidth { .. }) => 4,
    }
}

/// The kept lines read back: a `StepIntent` is serialized as the `intent` member of a step line,
/// so deserializing that member inverts it. `None` when a kept step's intent does not read back.
fn replay(lines: &[String]) -> Option<Replayed> {
    let mut out = Replayed {
        last_step: None,
        reached: Reached::default(),
        intents: Default::default(),
    };
    for line in lines.iter().skip(1) {
        let v: Value = serde_json::from_str(line).ok()?;
        let Some(step) = v.get("step") else {
            continue;
        };
        let intent: StepIntent = serde_json::from_value(step["intent"].clone()).ok()?;
        out.last_step = step["id"].as_str().map(str::to_string);
        out.reached.note(&intent, fill_of(&intent));
        let key = key_of(&intent);
        out.intents[key] = Some(intent);
    }
    Some(out)
}

/// A record read and judged, ready to be adopted.
struct Adopt {
    record: String,
    dir: PathBuf,
    cancel_key: String,
    reference: DatasetRef,
    place: PathBuf,
    /// The byte length of the kept lines, each with its LF.
    kept: u64,
    replayed: Replayed,
}

/// Closes the open this call started, on every exit that is not the reply: a refusal or an unwind.
struct CloseOnDrop<'a> {
    host: &'a SkpHost,
    handle: Option<DatasetHandle>,
}

impl Drop for CloseOnDrop<'_> {
    fn drop(&mut self) {
        if let Some(dataset) = self.handle.take() {
            let skp = SKP_VERSION.to_string();
            drop(
                self.host
                    .close_dataset(CloseDatasetRequest { skp, dataset }),
            );
        }
    }
}

/// The history cut to its kept steps: `set_len`, a seek to the new end so that the next append
/// leaves no gap, and `sync_all`. A failure is `skp.session_history_unwritable`, its `detail`
/// naming the failed call.
fn cut(mut file: &File, kept: u64) -> Result<(), SkpError> {
    let failed = |call: &str, e: std::io::Error| {
        let detail = format!("{call}: {e}");
        SkpError::protocol_with_fields(
            "session_history_unwritable",
            format!(
                "[P6 placeholder] the history could not be cut to its kept steps, so the record was not recovered: {detail}"
            ),
            [("detail", detail)],
        )
    };
    file.set_len(kept).map_err(|e| failed("set_len", e))?;
    file.seek(SeekFrom::End(0)).map_err(|e| failed("seek", e))?;
    file.sync_all().map_err(|e| failed("sync_all", e))
}

/// The check word of the engine's comparison, as `open_project` words it.
fn check_of(found: RefCheck) -> ReopenCheck {
    let (observed, admission) = match found {
        RefCheck::NoChangeDetected => (Vec::new(), Vec::new()),
        RefCheck::Differs {
            observed,
            admission,
        } => (observed, admission),
    };
    let observed = observed.into_iter().map(|w| match w {
        "size" => ObservedChange::Size,
        "mtime" => ObservedChange::Mtime,
        "footer-length" => ObservedChange::FooterLength,
        "footer-hash" => ObservedChange::FooterHash,
        other => unreachable!("an observation component the wire has no word for: {other}"),
    });
    let admission = admission.into_iter().map(|w| match w {
        "crs" => AdmissionChange::Crs,
        "identity" => AdmissionChange::Identity,
        other => unreachable!("an admission claim the wire has no word for: {other}"),
    });
    ReopenCheck {
        observed: observed.collect(),
        admission: admission.collect(),
    }
}

impl StepRecorder {
    /// Steps 4 to 6 for an `unsaved-` record (a null `dataset`): the kernel opens the data at the
    /// record's place with the header's admission claims, runs the check, cuts the history to its
    /// kept steps and pushes the record into this run's, held by the new open. `file` is the
    /// history's handle, by value: every exit that is not the reply closes the open (the guard),
    /// then drops the handle, then (in the caller) releases the reservation.
    fn adopt_new(&self, a: &Adopt, file: File) -> Result<RecoverSessionResponse, SkpError> {
        let (_end_open_on_drop, cancel) = self.host.begin_open(&a.cancel_key)?;
        let path = a.place.to_str().ok_or_else(|| {
            refused(
                &a.record,
                LOCATIONS,
                "the dataset's place is not valid Unicode",
            )
        })?;
        let admission = a.reference.admission().clone();
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.to_string(),
            cancel_key: a.cancel_key.clone(),
            crs_assertion: admission.crs_assertion,
            identity: admission.identity,
            set_aside_file_id: false,
        };
        let opened = self.host.open_under(req, &cancel).map_err(|e| {
            if cancel.is_cancelled() {
                error_of(&EngineError::Cancelled)
            } else {
                e
            }
        })?;
        let handle = opened.dataset;
        let mut guard = CloseOnDrop {
            host: &self.host,
            handle: Some(handle.clone()),
        };
        // The handle was minted inside `open_under` and no client holds it, so a catalog miss here
        // leaves nothing open that a client could name: the guard closes the open it started.
        let Some(ds) = self.host.catalog().get(handle.as_str()) else {
            return Err(SkpError::unknown_dataset(handle.as_str()));
        };
        let check = check_of(a.reference.check(&ds));
        drop(ds);
        cut(&file, a.kept)?;
        self.push(
            a,
            file,
            Holder::Open(handle.as_str().to_string()),
            &handle,
            None,
        );
        guard.handle = None;
        Ok(RecoverSessionResponse {
            dataset: handle,
            opened: Some(RecoveredOpen {
                session: opened.session,
                check,
            }),
            steps: a.replayed.intents.iter().flatten().cloned().collect(),
        })
    }

    /// Steps 4 to 6 for a project's record, at the open `handle`: the open must be the reopen of
    /// this record's project, of this record's dataset, and hold no record and no binding.
    fn adopt_bound(
        &self,
        a: &Adopt,
        file: File,
        handle: &DatasetHandle,
    ) -> Result<RecoverSessionResponse, SkpError> {
        let project: ProjectUri = format!("spatial://project/{}", a.record)
            .parse()
            .map_err(|_| unknown(&a.record))?;
        let not_here = || SkpError::recoverable_record_not_for_this_open(&a.record);
        if self.host.catalog().get(handle.as_str()).is_none() {
            return Err(SkpError::unknown_dataset(handle.as_str()));
        }
        if !self.bindable(&lock(&self.state), handle, &project, a.reference.uri()) {
            return Err(not_here());
        }
        cut(&file, a.kept)?;
        let holder = Holder::Project(project.clone());
        if !self.push(a, file, holder, handle, Some(project)) {
            return Err(not_here());
        }
        Ok(RecoverSessionResponse {
            dataset: handle.clone(),
            opened: None,
            steps: a.replayed.intents.iter().flatten().cloned().collect(),
        })
    }

    /// Whether the open `handle` is the reopen of `project`, of the dataset `uri`, holding no record
    /// and no binding.
    fn bindable(
        &self,
        state: &State,
        handle: &DatasetHandle,
        project: &ProjectUri,
        uri: &DatasetUri,
    ) -> bool {
        let name = handle.as_str();
        let Some(open) = state.opens.iter().find(|o| o.name == name) else {
            return false;
        };
        let holds = state.records.iter().any(|r| match &r.holder {
            Holder::Open(n) => n == name,
            Holder::Project(p) => p == project,
        });
        open.reopened_as.as_ref() == Some(project)
            && open.uri == *uri
            && open.bound.is_none()
            && !holds
    }

    /// Step 6: under the state lock, the open takes the header's dataset identity (and the
    /// project, for a project's record), and the record joins this run's, with the history handle
    /// at the kept length. `false` when the open stopped being bindable since step 4.
    fn push(
        &self,
        a: &Adopt,
        file: File,
        holder: Holder,
        handle: &DatasetHandle,
        bind: Option<ProjectUri>,
    ) -> bool {
        let mut state = lock(&self.state);
        if let Some(project) = &bind {
            if !self.bindable(&state, handle, project, a.reference.uri()) {
                return false;
            }
        }
        let open = state.open(handle.as_str());
        open.uri = a.reference.uri().clone();
        open.bound = bind;
        let mut history = History::new(file, |f| f.sync_all());
        history.bytes = a.kept;
        state.records.push(Record {
            dir: a.dir.clone(),
            holder,
            history,
            last_step: a.replayed.last_step.clone(),
            reached: a.replayed.reached.clone(),
        });
        true
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
    use spatial_skp::v0::{OpenDatasetRequest, RecordStepRequest};

    use super::*;
    use crate::skp::{session_end_channel, StreamRegistry};
    use crate::Catalog;

    /// A watch arm that arms none, as `crate::skp`'s own `NoWatchArm`, which is private to that
    /// module, has it.
    struct ChecksOnly;

    impl spatial_engine::SourceWatchArm for ChecksOnly {
        fn arm(&self, _: &Path, _: spatial_engine::WatchSink) -> spatial_engine::ArmOutcome {
            spatial_engine::ArmOutcome::ChecksOnly {
                reason: "test fixture: no watch armed".to_string(),
            }
        }
    }

    /// A real host and recorder over one folder, with one step recorded against a small fixture,
    /// and that record's two files copied, as a crashed run leaves them, to a second folder of the
    /// same store: the recorder's own record is held (its lock is its own), the copy is not.
    struct Rig {
        dir: PathBuf,
        host: Arc<SkpHost>,
        recorder: StepRecorder,
        handle: DatasetHandle,
        copy: String,
    }

    impl Drop for Rig {
        fn drop(&mut self) {
            drop(std::fs::remove_dir_all(&self.dir));
        }
    }

    fn rig(test: &str) -> Rig {
        let dir = std::env::temp_dir()
            .join("spatial-ide-recovery-unit")
            .join(test);
        let _ = std::fs::remove_dir_all(&dir);
        let data = dir.join("data").join("parcels.parquet");
        let spec = FixtureSpec {
            features: 50,
            avg_vertices: 8,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        };
        write_geoparquet(&data, &spec).expect("the fixture");
        let host = Arc::new(SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            Arc::new(ChecksOnly),
            session_end_channel().0,
        ));
        let recorder = StepRecorder::new(dir.join("sessions"), host.clone());
        let open = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: data.display().to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
            set_aside_file_id: false,
        };
        let dataset = host.open_dataset(open).expect("open").dataset;
        let intent = StepIntent::StyleSet(StyleSetParams::FillOpacity { value: 0.5 });
        let step = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: dataset.clone(),
            intent,
        };
        recorder.record_step(step).expect("recorded");

        let copy = format!("unsaved-{}", "11".repeat(16));
        let (bytes, from) = {
            let state = lock(&recorder.state);
            let rec = &state.records[0];
            let bytes = read_through(&rec.history.out, MAX_SESSION_HISTORY_BYTES + 1);
            (bytes.expect("read through its own handle"), rec.dir.clone())
        };
        let made = dir.join("sessions").join(&copy);
        std::fs::create_dir(&made).expect("the copy's folder");
        std::fs::write(made.join(HISTORY), bytes).expect("the copy's history");
        std::fs::copy(from.join(LOCATIONS), made.join(LOCATIONS)).expect("the copy's places");
        Rig {
            dir,
            host,
            recorder,
            handle: dataset,
            copy,
        }
    }

    impl Rig {
        fn root(&self) -> PathBuf {
            self.dir.join("sessions")
        }

        fn held(&self) -> Vec<String> {
            held_names(&lock(&self.recorder.state))
        }
    }

    /// **K-C27.** The start's two private steps are called in the product's order: the walk, which
    /// takes and locks the `unsaved-` record and returns no folder names; then, after the test
    /// makes the record's twin `<hex>` folder with its history held by the test, the dedupe, which
    /// reads the names itself. The record is not listed.
    ///
    /// Mutation: the walk's first names passed to the dedupe and used for its `<hex>` side.
    /// Expected failure: this test, at the verdict on the record, which is then `Offer`.
    #[test]
    fn the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names() {
        let r = rig("k-c27");
        let root = r.root();
        let walked = walk(&root, &r.held());
        let taken: Vec<&str> = walked.taken.iter().map(|t| t.name.as_str()).collect();
        assert_eq!(
            taken,
            [r.copy.as_str()],
            "the walk takes the copy and not the held record"
        );
        assert!(!walked.more);

        // The project side appears only now, after the walk's locks are taken.
        let twin = root.join("2".repeat(32));
        std::fs::create_dir(&twin).expect("the twin's folder");
        let from = root.join(&r.copy);
        let places = std::fs::read(from.join(LOCATIONS)).expect("places");
        std::fs::write(twin.join(LOCATIONS), places).expect("the twin's places");
        let header = walked.taken[0]
            .seen
            .as_ref()
            .and_then(|s| s.recovered.lines.first().cloned())
            .expect("the copy's header");
        std::fs::write(twin.join(HISTORY), format!("{header}\n")).expect("the twin's history");
        let mut options = OpenOptions::new();
        let held = options
            .read(true)
            .write(true)
            .open(twin.join(HISTORY))
            .expect("open");
        held.try_lock().expect("the test holds the twin's history");

        let verdicts = dedupe(&root, &walked.taken);
        assert_eq!(verdicts, [Verdict::Locked]);
        drop(held);
    }

    /// **K-C42.** The private body that runs steps 4 to 6 for a null `dataset` is called with the
    /// history handle of a crashed `unsaved-` record that the test opened without write access and
    /// locked itself, so step 5's `set_len` refuses after step 4's real open through the test's own
    /// host. The refusal is `skp.session_history_unwritable`; the host's catalog holds no name; the
    /// history is as it was; and after the call a lock taken through a new handle succeeds.
    ///
    /// Mutation: the guard's close removed from the refusal exit, which leaves the open in the
    /// catalog. Expected failure: this test, at the catalog's names.
    #[test]
    fn a_refused_cut_after_the_open_closes_the_open_and_leaves_the_record() {
        let r = rig("k-c42");
        // The recorder's own open is closed first, so that the catalog is empty before the call.
        let (skp, dataset) = (SKP_VERSION.to_string(), r.handle.clone());
        r.host
            .close_dataset(CloseDatasetRequest { skp, dataset })
            .expect("closed");
        assert_eq!(r.host.catalog().names(), Vec::<String>::new());
        let dir = r.root().join(&r.copy);
        let before = std::fs::read(dir.join(HISTORY)).expect("the history");
        let recovered = recover_bytes(&before);
        let header = recovered.header.as_ref().expect("the header");
        let places = std::fs::read(dir.join(LOCATIONS)).expect("places");
        let place = store::read_locations(&places).expect("read").remove(0).path;
        let adopt = Adopt {
            record: r.copy.clone(),
            dir: dir.clone(),
            cancel_key: "recover".to_string(),
            reference: header.datasets[0].clone(),
            place,
            kept: before.len() as u64,
            replayed: replay(&recovered.lines).expect("replayed"),
        };
        let read_only = File::open(dir.join(HISTORY)).expect("opened without write access");
        read_only.try_lock().expect("the test locks it itself");

        let refused = r
            .recorder
            .adopt_new(&adopt, read_only)
            .expect_err("the cut is refused");
        assert_eq!(refused.code, "skp.session_history_unwritable");
        assert!(
            refused.fields["detail"].starts_with("set_len"),
            "{:?}",
            refused.fields
        );
        assert_eq!(
            r.host.catalog().names(),
            Vec::<String>::new(),
            "nothing is left open"
        );
        assert_eq!(
            std::fs::read(dir.join(HISTORY)).expect("the history"),
            before
        );
        let again = OpenOptions::new()
            .read(true)
            .write(true)
            .open(dir.join(HISTORY));
        again
            .expect("a new handle")
            .try_lock()
            .expect("the lock is free");
    }
}
