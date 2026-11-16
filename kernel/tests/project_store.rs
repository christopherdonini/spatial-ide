// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The machine store's documents** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` Amendment 30,
//! item 6 (c)): T8 and T9, the folder list's two answers; T10, the reader of `locations.json`; T12
//! and T13, each writer refusing what its reader refuses, at the bound. Nothing here touches the
//! disk. Each test names its recorded mutation.

use std::path::{Path, PathBuf};

use spatial_kernel::dataset_ref::DatasetUri;
use spatial_kernel::project::store::{
    locations_to_bytes, read_locations, KnownFolders, KnownFoldersFull, Location, FOLDERS,
    LOCATIONS, MAX_KNOWN_FOLDERS,
};

/// An absolute path of exactly `len` bytes: the root of the current drive, then `fill`.
fn path_of(len: usize, fill: char) -> PathBuf {
    let root = std::path::absolute(Path::new("/")).expect("the root");
    let root = root.to_str().expect("a UTF-8 root").to_string();
    let fill = fill.to_string().repeat(len - root.len());
    PathBuf::from(root + &fill)
}

fn folder(i: usize) -> PathBuf {
    path_of(12, 'f').join(format!("{i}"))
}

/// **T8** (M2). Mutation: the oldest `same` entry dropped. Expected failure: the 257th is `Ok`.
#[test]
fn a_same_answer_past_256_known_folders_is_refused_and_the_folders_are_unchanged() {
    let same = (1..255).map(folder).collect();
    let known = KnownFolders {
        first: folder(0),
        same,
    };
    let known = known.with_same(&folder(255)).expect("the 256th folder");
    assert_eq!(1 + known.same.len(), MAX_KNOWN_FOLDERS);
    assert_eq!(
        known.with_same(&folder(7)),
        Ok(known.clone()),
        "a known one"
    );
    let before = known.to_bytes().expect("written");
    let refused = known.with_same(&folder(256));
    assert_eq!(refused, Err(KnownFoldersFull { count: 256 }));
    assert_eq!(known.to_bytes().expect("written"), before);
}

/// **T9** (S2-2 (a)). Mutation: the old first kept in `same`. Expected failure: the first equality.
#[test]
fn a_move_makes_this_folder_first_and_forgets_the_old_first() {
    let known = KnownFolders {
        first: folder(0),
        same: vec![folder(1), folder(2)],
    };
    let moved = known.moved_to(&folder(2));
    assert_eq!(moved.first, folder(2));
    assert_eq!(
        moved.same,
        [folder(1)],
        "it leaves `same`; the old first is gone"
    );
    let moved = known.moved_to(&folder(9));
    assert_eq!(moved.first, folder(9));
    assert_eq!(moved.same, [folder(1), folder(2)]);
}

/// **T10**. Mutation: a refused file read as no entries. Expected failure: the first case is `Ok`.
#[test]
fn a_locations_json_the_reader_refuses_is_named() {
    let uri = DatasetUri::mint();
    let valid = locations_to_bytes(&uri, &path_of(20, 'a')).expect("written");
    let valid = String::from_utf8(valid).expect("UTF-8");
    assert_eq!(read_locations(valid.as_bytes()).expect("read").len(), 1);
    let entry = valid
        .split_once("[")
        .and_then(|(_, rest)| rest.strip_suffix("]}\n"))
        .expect("one entry");
    let many = vec![entry; 25_000].join(",");
    let dataset = format!(r#""dataset":"{}","#, uri.as_str());
    let cases = [
        (
            "a wrong format",
            valid.replace("spatial-locations", "spatial-folders"),
        ),
        (
            "a wrong version",
            valid.replace(r#""version":1"#, r#""version":2"#),
        ),
        ("bytes over the bound", valid.replace(entry, &many)),
        ("malformed JSON", "{\"format\":\n".to_string()),
        ("an entry missing a field", valid.replace(&dataset, "")),
    ];
    for (case, text) in cases {
        let refused = read_locations(text.as_bytes()).expect_err(case);
        assert_eq!(refused.file, LOCATIONS, "{case}: {refused}");
    }
}

/// **T12**. Mutations: (a) the string bound removed; expected failure: the 4,097-byte `first` is
/// written. (b) the byte bound removed; expected failure: the escaped document is written.
#[test]
fn a_folder_path_the_folders_reader_would_refuse_is_refused_when_written() {
    let at_bound = KnownFolders {
        first: path_of(4_096, 'a'),
        same: Vec::new(),
    };
    let bytes = at_bound.to_bytes().expect("a 4,096-byte path is written");
    assert_eq!(KnownFolders::from_bytes(&bytes), Ok(at_bound));
    let long = path_of(4_097, 'a');
    let as_first = KnownFolders {
        first: long.clone(),
        same: Vec::new(),
    };
    let in_same = KnownFolders {
        first: folder(0),
        same: vec![long],
    };
    for known in [as_first, in_same] {
        assert_eq!(known.to_bytes().expect_err("over 4,096").file, FOLDERS);
    }
    // Each string is within its bound; escaped, a hundred of them are over the document's.
    let control = path_of(4_096, '\u{1}');
    let escaped = KnownFolders {
        first: control.clone(),
        same: vec![control; 99],
    };
    let refused = escaped.to_bytes().expect_err("over the byte bound");
    assert_eq!(refused.file, FOLDERS, "{refused}");
}

/// An absolute path that is not valid Unicode: a lone surrogate on Windows, a byte that is not
/// UTF-8 elsewhere.
fn not_unicode() -> PathBuf {
    #[cfg(windows)]
    let name = <std::ffi::OsString as std::os::windows::ffi::OsStringExt>::from_wide(&[0xD800]);
    #[cfg(not(windows))]
    let name = <std::ffi::OsStr as std::os::unix::ffi::OsStrExt>::from_bytes(b"\xff").to_owned();
    std::env::temp_dir().join(name)
}

/// **T13**. Mutations: (a) the string bound removed; expected failure: the 4,097-byte path is
/// written. (b) `to_string_lossy` restored; expected failure: the path that is not Unicode is
/// written.
#[test]
fn the_locations_writer_refuses_what_its_reader_refuses_and_reads_back_the_rest() {
    let uri = DatasetUri::mint();
    let at = path_of(4_096, 'a');
    let bytes = locations_to_bytes(&uri, &at).expect("a 4,096-byte path is written");
    let read = read_locations(&bytes).expect("and read back");
    assert_eq!(
        read,
        [Location {
            dataset: uri.clone(),
            path: at
        }]
    );
    for (case, path) in [
        ("over 4,096", path_of(4_097, 'a')),
        ("not Unicode", not_unicode()),
    ] {
        let refused = locations_to_bytes(&uri, &path).expect_err(case);
        assert_eq!(refused.file, LOCATIONS, "{case}");
    }
}
