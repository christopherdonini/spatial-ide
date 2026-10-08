// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The recorded source observation** — `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`
//! §2.4 (E-1) and §4 (O1 to O4), exercised against real GeoParquet files written by the engine's
//! own fixture writer into this test's scratch directory.
//!
//! It asserts typed outcomes only. It times nothing, and an empty list from a comparison is never
//! described here as "unchanged": it says no component differed, which is a weaker statement
//! (`engine/src/descriptor.rs`'s module header).

use std::fs::{File, OpenOptions};
use std::io::{Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime};

use sha2::{Digest, Sha256};
use spatial_engine::descriptor::{SourceDescriptor, SourceObservation};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::Dataset;

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/source-observation");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

/// F1: 500 features, declared LV95, native `id`.
fn f1() -> FixtureSpec {
    FixtureSpec {
        features: 500,
        avg_vertices: 12,
        ..Default::default()
    }
}

fn write(name: &str, spec: &FixtureSpec) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

fn set_mtime(path: &Path, at: SystemTime) {
    OpenOptions::new()
        .write(true)
        .open(path)
        .expect("reopen to set mtime")
        .set_modified(at)
        .expect("set mtime");
}

fn mtime(path: &Path) -> SystemTime {
    std::fs::metadata(path)
        .expect("metadata")
        .modified()
        .expect("this filesystem reports a modification time")
}

/// The footer length and the footer's sha-256, read here from the file's own last bytes and
/// footer, independently of the descriptor's reader.
fn footer_of(path: &Path) -> (u64, String) {
    let mut f = File::open(path).expect("open");
    let size = f.metadata().expect("metadata").len();
    f.seek(SeekFrom::End(-8)).expect("seek tail");
    let mut tail = [0u8; 8];
    f.read_exact(&mut tail).expect("tail");
    assert_eq!(
        &tail[4..],
        b"PAR1",
        "the fixture ends with the parquet magic"
    );
    let len = u64::from(u32::from_le_bytes([tail[0], tail[1], tail[2], tail[3]]));
    f.seek(SeekFrom::Start(size - 8 - len))
        .expect("seek footer");
    let mut footer = vec![0u8; len as usize];
    f.read_exact(&mut footer).expect("footer");
    (len, format!("{:x}", Sha256::digest(&footer)))
}

/// **O1.** The observation of an open holds the four components that open read: the file's size
/// and modification time from its metadata, and the footer's length and hash from its tail.
///
/// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted):
/// `observation()` records `footer_hash: None`. OBSERVED FAILURE: the footer-hash assertion, `left:
/// None`, `right: Some(<the footer's sha-256>)`.
#[test]
fn an_observation_carries_the_four_components_the_open_read() {
    let path = write("o1", &f1());
    let ds = Dataset::open(&path).expect("opens");
    let observed = ds.descriptor().observation();

    let md = std::fs::metadata(&path).expect("metadata");
    let (footer_len, footer_hash) = footer_of(&path);
    assert_eq!(observed.byte_size(), md.len());
    let nanos = mtime(&path)
        .duration_since(SystemTime::UNIX_EPOCH)
        .expect("after the epoch")
        .as_nanos();
    assert_eq!(observed.modified_nanos(), Some(nanos));
    assert_eq!(observed.footer_length(), footer_len);
    assert_eq!(observed.footer_hash(), Some(footer_hash.as_str()));

    // Recorded values come back as they went in.
    let again = SourceObservation::recorded(
        observed.byte_size(),
        observed.modified_nanos(),
        observed.footer_length(),
        observed.footer_hash().map(str::to_string),
    );
    assert_eq!(again, observed);
}

/// **O2.** A recorded observation of F1, compared with the same path rewritten as F1′ (1,000
/// features, an mtime 60 s later), names exactly the components the descriptor's own comparison
/// names, which is all four.
///
/// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted):
/// `SourceObservation::components_differing_from` bypasses the shared rule and omits `footer-hash`.
/// OBSERVED FAILURE: the first assertion: `left` is `["size", "mtime", "footer-length"]` and
/// `right` adds `"footer-hash"`.
#[test]
fn a_recorded_observation_differs_from_a_rewritten_file_by_the_descriptors_own_rule() {
    let path = write("o2", &f1());
    let before = SourceDescriptor::of(&path).expect("descriptor");
    let recorded = before.observation();
    let opened_at = mtime(&path);

    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 1_000,
            ..f1()
        },
    )
    .expect("rewrite");
    set_mtime(&path, opened_at + Duration::from_secs(60));
    let now = SourceDescriptor::of(&path).expect("descriptor after the rewrite");

    let named = recorded.components_differing_from(&now);
    assert_eq!(named, vec!["size", "mtime", "footer-length", "footer-hash"]);
    assert_eq!(
        named,
        before.components_differing_from(&now),
        "the observation and the descriptor it came from name the same components"
    );
}

/// **O3.** The declared limit. One byte flipped inside the first data page, with the size and the
/// modification time restored, leaves all four components as they were, so the comparison names
/// none. That is an outcome of a change detector, and it is not a statement that the file is the
/// same one: the bytes are asserted to differ.
///
/// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted):
/// `observation()` records `modified_nanos: None`. OBSERVED FAILURE: the empty-list assertion, `the
/// declared limit: no component is named for this edit`, because the missing time is then named.
#[test]
fn a_data_page_edit_under_preserved_size_mtime_and_footer_is_not_detected() {
    let path = write("o3", &f1());
    let before = SourceDescriptor::of(&path).expect("descriptor");
    let recorded = before.observation();
    let opened_at = mtime(&path);
    let original = std::fs::read(&path).expect("read before");
    let (footer_len, _) = footer_of(&path);

    // Inside the first data page: past the leading magic and the first page header, and well
    // before the footer.
    let offset = 4 + 256u64;
    assert!(offset < original.len() as u64 - 8 - footer_len);
    let mut f = OpenOptions::new()
        .write(true)
        .open(&path)
        .expect("open to edit");
    f.seek(SeekFrom::Start(offset)).expect("seek");
    f.write_all(&[original[offset as usize] ^ 0xFF])
        .expect("flip");
    f.sync_all().expect("flush the edit");
    drop(f);
    // Restored from a second handle, after the edit has been flushed and closed.
    set_mtime(&path, opened_at);

    let edited = std::fs::read(&path).expect("read after");
    assert_eq!(edited.len(), original.len(), "the size is preserved");
    assert_eq!(
        edited.iter().zip(&original).filter(|(a, b)| a != b).count(),
        1,
        "exactly one byte differs"
    );

    let now = SourceDescriptor::of(&path).expect("descriptor after the edit");
    assert!(
        recorded.components_differing_from(&now).is_empty(),
        "the declared limit: no component is named for this edit"
    );
}

/// **O4.** An unestablished component compares by the descriptor's degradation rule. A recorded
/// modification time that was never reported against a live one that is: observable, so named
/// (fail closed). A recorded footer hash that was never taken against a live one that is: not a
/// change, because it was never read, so not named.
///
/// The case with no modification time on both sides cannot be built from a file on a filesystem
/// that reports one, and is covered inside `engine/src/descriptor.rs`, which routes it through the
/// same function.
///
/// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the shared
/// rule counts a footer hash present on one side only. OBSERVED FAILURE: `a footer hash that was
/// never taken is not a changed component`.
#[test]
fn an_unestablished_component_compares_by_the_degradation_rule() {
    let path = write("o4", &f1());
    let now = SourceDescriptor::of(&path).expect("descriptor");
    let live = now.observation();

    let no_mtime = SourceObservation::recorded(
        live.byte_size(),
        None,
        live.footer_length(),
        live.footer_hash().map(str::to_string),
    );
    assert_eq!(no_mtime.components_differing_from(&now), vec!["mtime"]);

    let no_hash = SourceObservation::recorded(
        live.byte_size(),
        live.modified_nanos(),
        live.footer_length(),
        None,
    );
    assert!(
        no_hash.components_differing_from(&now).is_empty(),
        "a footer hash that was never taken is not a changed component"
    );

    let neither = SourceObservation::recorded(live.byte_size(), None, live.footer_length(), None);
    assert_eq!(neither.components_differing_from(&now), vec!["mtime"]);

    // The live side's own record compares as the descriptor does: nothing named.
    assert!(live.components_differing_from(&now).is_empty());
}
