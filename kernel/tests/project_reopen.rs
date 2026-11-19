// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The lineage reader**, `session_history::read_lineage`, on hand-built files: piece 1c writes
//! no lineage, so every lineage file and previous lineage file here is made by the test (the 1c
//! form, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 31 item 5:
//! L1 to L4 and K-L5 to K-L8; ADR-036 §6 and §8, and its Amendment 1 items 2, 4 and 6). The file
//! names are the test's own: the reader is given both paths. Nothing here times anything.

use std::path::{Path, PathBuf};

use spatial_kernel::project::file::Lineage;
use spatial_kernel::session_history::{
    read_lineage, recover, FolderLineage, LineageRead, LineageRefused, PreviousLineage,
};
use spatial_renderer::canonical::sha256_hex;

const URI: &str = "spatial://dataset/ref/0123456789abcdef0123456789abcdef";
const PROJECT: &str = "spatial://project/fedcba9876543210fedcba9876543210";
const HASH: &str = "abababababababababababababababababababababababababababababababab";
const OBSERVED: &str = r#"{"byte_size":27132,"modified_ns":"1700000000000000000","footer_length":11806,"footer_sha256":"abababababababababababababababababababababababababababababababab"}"#;
const FILTER: &str = r#"{"action":"filter.apply","params":{"filter":{"predicate":"zone = 'civic'","dialect":"duckdb-expr/0"}}}"#;
const OPACITY: &str = r#"{"action":"style.set","params":{"property":"fillOpacity","value":0.5}}"#;
const COLOUR: &str =
    r##"{"action":"style.set","params":{"property":"fillColor","value":"#4285f4"}}"##;
const COMPLETE: &str = r#"{"state":"complete"}"#;
const AT_FIRST_SAVE: &str = r#"{"state":"at-first-save"}"#;

/// A dataset entry (ADR-036 §5) carrying `locators`.
fn entry(locators: &str) -> String {
    format!(
        r#"{{"resource":{{"logical_uri":"{URI}","content_hash":{{"state":"not-taken","basis":"b"}},"source_revision":{{"state":"none-pinned","basis":"b"}},"locators":[{locators}],"cache_status":"linked","portability_policy":"linked-live-file"}},"observed":{OBSERVED},"admission":{{"crs_assertion":null,"identity":null}}}}"#
    )
}

/// A lineage header. Its dataset entry carries the project file's locators, a `project-relative`
/// one among them (ADR-036 Amendment 1 item 4).
fn lineage_header(completeness: &str, starts: &str) -> String {
    let entry = entry(&format!(
        r#"{{"kind":"machine-recorded","at":"{URI}"}},{{"kind":"project-relative","at":"data/zones.parquet"}}"#
    ));
    format!(
        r#"{{"format":"spatial-steps","version":1,"purpose":"lineage","project":"{PROJECT}","actions":2,"datasets":[{entry}],"lineage":{{"completeness":{completeness},"starts":{starts}}}}}"#
    )
}

fn header() -> String {
    lineage_header(COMPLETE, AT_FIRST_SAVE)
}

fn session_header() -> String {
    let entry = entry(&format!(r#"{{"kind":"machine-recorded","at":"{URI}"}}"#));
    format!(
        r#"{{"format":"spatial-steps","version":1,"purpose":"session-history","project":{{"state":"not-yet-saved","basis":"b"}},"actions":2,"datasets":[{entry}],"lineage":null}}"#
    )
}

fn sid(n: u8) -> String {
    format!("step_{n:032x}")
}

fn parent(p: Option<u8>) -> String {
    p.map_or("null".to_string(), |p| format!("\"{}\"", sid(p)))
}

fn step(n: u8, p: Option<u8>, kind: &str, intent: &str) -> String {
    let crs = format!(
        r#"{{"identifier":"EPSG:2056","provenance":"crs:declared","definition":"sha256:{HASH}"}}"#
    );
    format!(
        r#"{{"step":{{"id":"{}","parent":{},"at":"2026-10-14T10:00:00Z","kind":"{kind}","effect":{{"class":"workspace-mutation"}},"actor":{{"kind":"user"}},"intent":{intent},"dependencies":{{"fields":[{{"name":"zone","type":"Utf8"}}],"crs":{crs},"geometry_types":["Polygon"]}},"data":{{"dataset":"{URI}","identity":{{"observed":{OBSERVED}}}}},"scope":{{"kind":"layer"}},"links":[]}}}}"#,
        sid(n),
        parent(p)
    )
}

fn withheld(n: u8, p: Option<u8>) -> String {
    format!(
        r#"{{"withheld":{{"id":"{}","parent":{}}}}}"#,
        sid(n),
        parent(p)
    )
}

/// The lineage of one save: a header, two steps and a withheld line.
fn saved() -> Vec<String> {
    vec![
        header(),
        step(1, None, "data", FILTER),
        step(2, Some(1), "style", OPACITY),
        withheld(3, Some(2)),
    ]
}

/// A valid lineage file from another save: its second step sets another property.
fn other_save() -> Vec<String> {
    vec![
        header(),
        step(1, None, "data", FILTER),
        step(2, Some(1), "style", COLOUR),
    ]
}

fn bytes(lines: &[String]) -> Vec<u8> {
    lines.iter().flat_map(|l| l.bytes().chain(*b"\n")).collect()
}

/// The member a project file records over `lines`: their sha256, each line with its LF, and the
/// number of their step and withheld lines.
fn member(lines: &[String]) -> Lineage {
    Lineage::Kept {
        sha256: sha256_hex(&bytes(lines)),
        steps: lines.len() as u64 - 1,
    }
}

fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-reopen-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    dir
}

/// The folder's lineage file and the previous one, in `dir`, each written when it is given.
fn files(dir: &Path, folder: Option<&[u8]>, previous: Option<&[u8]>) -> (PathBuf, PathBuf) {
    let (f, p) = (dir.join("folder.jsonl"), dir.join("previous.jsonl"));
    for (path, b) in [(&f, folder), (&p, previous)] {
        if let Some(b) = b {
            std::fs::write(path, b).expect("a hand-built file");
        }
    }
    (f, p)
}

fn read(dir: &Path, folder: Option<&[u8]>, previous: Option<&[u8]>, m: &Lineage) -> LineageRead {
    let (f, p) = files(dir, folder, previous);
    read_lineage(&f, &p, m)
}

/// L1. Mutation: arm 1's hash comparison removed. Expected failure: the control, a member that
/// records the same count over another save's bytes, reads as `Recorded`.
#[test]
fn a_lineage_file_whose_recorded_prefix_matches_the_member_is_the_projects_lineage() {
    let dir = scratch("l1");
    let lines = saved();
    let got = read(&dir, Some(&bytes(&lines)), None, &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::Recorded,
        previous_file: None,
        lineage: Some(lines.clone()),
    };
    assert_eq!(got, want);
    let another = Lineage::Kept {
        sha256: sha256_hex(b"another save"),
        steps: 3,
    };
    let got = read(&dir, None, None, &another);
    assert_eq!(
        (got.folder_file, got.lineage),
        (FolderLineage::NotTheRecordedOne, None)
    );
}

/// L2. Mutation: the prefix taken as the whole file, not cut by the step count. Expected failure:
/// the file reads as `NotTheRecordedOne`.
#[test]
fn lines_after_the_recorded_prefix_are_named_and_not_read_as_the_projects() {
    let dir = scratch("l2");
    let lines = saved();
    let mut file = lines.clone();
    file.extend([
        step(4, Some(3), "data", FILTER),
        step(5, Some(4), "style", OPACITY),
    ]);
    let got = read(&dir, Some(&bytes(&file)), None, &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::RecordedWithLinesAfter,
        previous_file: None,
        lineage: Some(lines),
    };
    assert_eq!(got, want);
}

/// L3. Mutation: arm 2 removed. Expected failure: the first case's previous file reads as
/// `NotTheRecordedOne`, with no lineage.
#[test]
fn a_previous_lineage_matching_the_member_is_used_and_the_folders_file_named() {
    let lines = saved();
    let cases = [
        (
            "l3-other",
            Some(bytes(&other_save())),
            FolderLineage::NotTheRecordedOne,
        ),
        ("l3-absent", None, FolderLineage::Absent),
    ];
    for (case, folder, fact) in cases {
        let dir = scratch(case);
        let got = read(
            &dir,
            folder.as_deref(),
            Some(&bytes(&lines)),
            &member(&lines),
        );
        let want = LineageRead {
            folder_file: fact,
            previous_file: Some(PreviousLineage::Used),
            lineage: Some(lines.clone()),
        };
        assert_eq!(got, want, "{case}");
    }
}

/// L4. Mutations: (a) arm 3 returns the folder's lines; (b) the not-kept check removed, so a
/// not-kept member names every folder's file `Absent`. Expected failures: (a) the first assertion,
/// whose lineage is the other save's lines; (b) the last, whose folder file reads as `Absent`.
#[test]
fn a_lineage_file_from_a_different_save_is_named_and_not_read_as_the_projects() {
    let lines = saved();
    let dir = scratch("l4-other");
    let got = read(&dir, Some(&bytes(&other_save())), None, &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::NotTheRecordedOne,
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(got, want);
    let dir = scratch("l4-none");
    let want = LineageRead {
        folder_file: FolderLineage::Absent,
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(read(&dir, None, None, &member(&lines)), want);
    let none = |folder_file| LineageRead {
        folder_file,
        previous_file: None,
        lineage: None,
    };
    let got = read(&dir, None, None, &Lineage::NotKept);
    assert_eq!(got, none(FolderLineage::Absent));
    let dir = scratch("l4-not-kept");
    let file = bytes(&lines);
    let got = read(&dir, Some(&file), Some(&file), &Lineage::NotKept);
    assert_eq!(got, none(FolderLineage::NotRead));
}

/// K-L5 (Amendment 1 item 5, C1). Mutation: the file-size check removed. Expected failure: the
/// file extended to 33,554,433 bytes is read, and is refused as `Damaged` at its torn last line,
/// not as over its bound.
#[test]
fn a_lineage_file_over_its_bounds_is_named_and_not_read() {
    let lines = saved();
    let dir = scratch("k-l5-file");
    let (f, p) = files(&dir, Some(&bytes(&lines)), None);
    let file = std::fs::OpenOptions::new().write(true).open(&f).unwrap();
    file.set_len(33_554_433).unwrap();
    drop(file);
    let want = LineageRead {
        folder_file: FolderLineage::Refused(LineageRefused::OverBound {
            line: None,
            limit: 33_554_432,
        }),
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(read_lineage(&f, &p, &member(&lines)), want);
    assert_eq!(std::fs::metadata(&f).unwrap().len(), 33_554_433);

    let base = step(1, None, "data", FILTER);
    let pad = "x".repeat(262_145 - base.len());
    let long = base.replacen("zone = 'civic'", &format!("zone = 'civic{pad}'"), 1);
    assert_eq!(long.len(), 262_145);
    let long = vec![header(), long];
    let dir = scratch("k-l5-line");
    let got = read(&dir, Some(&bytes(&long)), None, &member(&long));
    let over = LineageRefused::OverBound {
        line: Some(2),
        limit: 262_144,
    };
    assert_eq!(
        (got.folder_file, got.lineage),
        (FolderLineage::Refused(over), None)
    );
}

/// K-L6. Mutation: the reader keeps the valid prefix. Expected failure: each file reads as
/// `Recorded`, its prefix being the member's.
#[test]
fn a_torn_lineage_file_is_named_and_never_cut_back() {
    let lines = saved();
    let mut torn = bytes(&lines);
    torn.extend(step(4, Some(3), "data", FILTER).bytes());
    let mut unparsable = bytes(&lines);
    unparsable.extend(b"{\"step\":\n");
    for (case, file) in [("k-l6-torn", torn), ("k-l6-unparsable", unparsable)] {
        let dir = scratch(case);
        let (f, p) = files(&dir, Some(&file), None);
        let got = read_lineage(&f, &p, &member(&lines));
        let at = matches!(
            &got.folder_file,
            FolderLineage::Refused(LineageRefused::Damaged { line: 5, .. })
        );
        assert!(at, "{case}: {got:?}");
        assert_eq!(got.lineage, None, "{case}");
        assert_eq!(
            std::fs::read(&f).unwrap(),
            file,
            "{case}: the file is unchanged"
        );
    }
}

/// K-L7. Mutation: mark lines admitted in a lineage file. Expected failure: the file holding a
/// mark line reads as `RecordedWithLinesAfter`.
#[test]
fn a_lineage_header_and_withheld_lines_are_read_in_their_shape_and_a_mark_line_is_refused() {
    let first = step(1, None, "data", FILTER);
    let mark = format!(
        r#"{{"mark":{{"kind":"saved-here","after":"{}","at":"2026-10-14T10:00:05Z"}}}}"#,
        sid(1)
    );
    let cases = [
        (
            "k-l7-header",
            vec![session_header(), first.clone()],
            1,
            "$.purpose",
        ),
        (
            "k-l7-mark",
            vec![header(), first.clone(), mark],
            3,
            "$.mark",
        ),
        (
            "k-l7-chain",
            vec![header(), first, withheld(2, Some(9))],
            3,
            "$.withheld.parent",
        ),
    ];
    for (case, lines, at, path) in cases {
        let dir = scratch(case);
        let m = member(&lines[..at.max(2) - 1]);
        let got = read(&dir, Some(&bytes(&lines)), None, &m);
        match &got.folder_file {
            FolderLineage::Refused(LineageRefused::Damaged { line, rule }) => {
                assert_eq!(*line, at, "{case}: {rule}");
                assert!(rule.contains(path), "{case}: {rule}");
            }
            other => panic!("{case}: {other:?}"),
        }
        assert_eq!(got.lineage, None, "{case}");
    }
    let incomplete = r#"{"state":"incomplete","withheld":1,"kinds_not_recorded":["export"]}"#;
    let later = r#"{"state":"later","basis":"the steps before the first save are not kept"}"#;
    for (i, (c, s)) in [COMPLETE, incomplete]
        .into_iter()
        .flat_map(|c| [(c, AT_FIRST_SAVE), (c, later)])
        .enumerate()
    {
        let mut lines = saved();
        lines[0] = lineage_header(c, s);
        let dir = scratch(&format!("k-l7-forms-{i}"));
        let got = read(&dir, Some(&bytes(&lines)), None, &member(&lines));
        assert_eq!(got.folder_file, FolderLineage::Recorded, "{c} {s}");
    }
}

/// K-L8. It guards the shared framing, and its assertions hold at main by design. Mutation: the
/// lineage shapes admitted by `read_line`. Expected failure: the withheld line is kept.
#[test]
fn the_session_history_reader_still_refuses_a_withheld_line_and_a_lineage_header() {
    let dir = scratch("k-l8-withheld");
    let first = step(1, None, "data", FILTER);
    let lines = vec![session_header(), first.clone(), withheld(2, Some(1))];
    std::fs::write(dir.join("history.jsonl"), bytes(&lines)).unwrap();
    let got = recover(&dir);
    assert_eq!(got.lines, lines[..2]);
    let failure = got.failure.expect("the withheld line is named");
    assert_eq!(failure.line, 3, "{}", failure.rule);

    let dir = scratch("k-l8-header");
    std::fs::write(dir.join("history.jsonl"), bytes(&[header(), first])).unwrap();
    let got = recover(&dir);
    assert!(got.lines.is_empty() && got.header.is_none());
    let failure = got.failure.expect("the lineage header is named");
    assert_eq!(
        (failure.line, failure.rule.contains("$.purpose")),
        (1, true),
        "{}",
        failure.rule
    );
}

// ---------------------------------------------------------------------------------------------
// L5 to L7 (the form's Amendment 36, item 7 (b)): the reader as P2 merged it
// ---------------------------------------------------------------------------------------------

/// A link at `link` to the folder `target`: a junction on Windows, which needs no privilege, and a
/// symlink elsewhere (`project_save.rs`'s `make_link`).
fn link_to(link: &Path, target: &Path) {
    #[cfg(windows)]
    {
        // `cmd` reads a `/` in a path as a switch, so both paths are given with `\`.
        let back = |p: &Path| p.display().to_string().replace('/', "\\");
        let made = std::process::Command::new("cmd")
            .args(["/C", "mklink", "/J"])
            .arg(back(link))
            .arg(back(target))
            .output()
            .expect("cmd");
        assert!(made.status.success(), "mklink /J: {made:?}");
    }
    #[cfg(not(windows))]
    std::os::unix::fs::symlink(target, link).expect("symlink");
}

/// **L5** (ADV-2026-11-18-23 item 2 (a)). A previous lineage file whose bytes have the member's
/// `sha256`, but whose step count is not the member's `steps`, is named `NotTheRecordedOne`, and
/// no lineage is used.
///
/// RECORDED MUTATION: the count comparison in `read_lineage`'s arm 2 removed. Expected failure: the
/// previous file reads as `Used`, with its lines.
#[test]
fn a_previous_lineage_whose_hash_matches_but_whose_step_count_does_not_is_named_and_not_used() {
    let lines = saved();
    let Lineage::Kept { sha256, steps } = member(&lines) else {
        unreachable!("member records a lineage")
    };
    let m = Lineage::Kept {
        sha256,
        steps: steps + 1,
    };
    let got = read(&scratch("l5"), None, Some(&bytes(&lines)), &m);
    let want = LineageRead {
        folder_file: FolderLineage::Absent,
        previous_file: Some(PreviousLineage::NotTheRecordedOne),
        lineage: None,
    };
    assert_eq!(got, want);
}

/// **L6** (Amendment 34 item 9). A lineage file with two broken lines, a withheld line whose
/// `parent` is not the line before it at line 3 and a mark line at line 5, is refused as `Damaged`
/// at line 3, the first in file order, and no lineage is read.
///
/// RECORDED MUTATION: the reader goes past the first failure and names the last. Expected failure:
/// the file is named at line 5.
#[test]
fn a_lineage_file_with_two_broken_lines_is_named_by_the_first() {
    let mark = format!(
        r#"{{"mark":{{"kind":"saved-here","after":"{}","at":"2026-10-14T10:00:05Z"}}}}"#,
        sid(3)
    );
    let lines = vec![
        header(),
        step(1, None, "data", FILTER),
        withheld(2, Some(9)),
        step(3, Some(2), "style", OPACITY),
        mark,
    ];
    let (dir, m) = (scratch("l6"), member(&saved()));
    let got = read(&dir, Some(&bytes(&lines)), None, &m);
    match &got.folder_file {
        FolderLineage::Refused(LineageRefused::Damaged { line, rule }) => {
            assert_eq!(*line, 3, "{rule}");
        }
        other => panic!("refused at a line: {other:?}"),
    }
    assert_eq!(got.lineage, None);
}

/// **L7** (ADV-2026-11-18-23 item 2 (c)). For a `not-kept` member, a link at the lineage file's
/// name whose target is gone (a junction on Windows, a symlink elsewhere) is named `NotRead`. It
/// is not followed: the link is still there, and nothing is made at its target.
///
/// RECORDED MUTATION: `symlink_metadata` replaced by `metadata` in `read_lineage`'s not-kept arm.
/// Expected failure: the link is followed to nothing, and the folder's file reads as `Absent`.
#[test]
fn a_link_at_the_lineage_name_beside_a_not_kept_member_is_named_and_never_followed() {
    let dir = scratch("l7");
    let (link, target) = (dir.join("folder.jsonl"), dir.join("gone"));
    std::fs::create_dir(&target).expect("the link's target, removed below");
    link_to(&link, &target);
    std::fs::remove_dir(&target).expect("the target removed");
    let got = read_lineage(&link, &dir.join("previous.jsonl"), &Lineage::NotKept);
    let want = LineageRead {
        folder_file: FolderLineage::NotRead,
        previous_file: None,
        lineage: None,
    };
    assert_eq!(got, want);
    assert!(std::fs::symlink_metadata(&link).is_ok(), "the link is kept");
    assert!(!target.exists(), "nothing is made at the target");
}
