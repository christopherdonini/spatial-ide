//! The `docs/09` redaction scan, as a function so it can be run over a real emitted bundle rather
//! than believed about one.
//!
//! `docs/09`: credentials are redacted from logs, lineage, notebooks, fix reports and AI context; a
//! published bundle is a **redistributable copy handed to other people**, which makes it the most
//! consequential of the lot. The brief requires this asserted "by a test that greps the emitted
//! bundle, not by intention", and that is the shape here: the scan takes bytes and returns findings,
//! and the test walks a real bundle directory through it.
//!
//! ## What it looks for, and what it cannot
//!
//! It finds **shapes**: Windows drive letters, UNC prefixes, absolute POSIX paths under the usual
//! home and temp roots, `file://` URLs, the running user's own name, the machine's own hostname, and
//! the obvious credential spellings. It is a **necessary condition, not a sufficient one** — no
//! grep establishes that a bundle carries nothing sensitive, and this module does not claim it does.
//! What it does establish is that the specific classes `docs/09` names are absent, which is the
//! claim the manifest makes.
//!
//! The scan is deliberately run over **every byte of every file** in the bundle, including the
//! partitions and the sidecar. Attribute values are untrusted input (`docs/09` names dataset
//! contents and metadata as such) and a source could carry a path in a text column; that would be
//! the source's doing rather than the publisher's, but it would still be in the artifact, and a scan
//! that skipped the data could not say so.
//!
//! ## Why a match must sit inside a run of printable text
//!
//! Scanning binary for short patterns finds them by chance. The drive-letter rule is three bytes,
//! and a partition is tens of megabytes of IEEE-754 coordinates: the first run of this scan over a
//! real bundle reported `p:/` and `x:\` from inside the coordinate buffer, at roughly the rate
//! arithmetic predicts for a 3-byte pattern over that many positions.
//!
//! Dropping the rule for binary files would be the wrong fix — a leaked path in a partition is
//! exactly the case worth catching. So a match is reported only when it lies inside a **printable
//! ASCII run** of at least [`MIN_PRINTABLE_RUN`] bytes. A genuine path is surrounded by more path;
//! a coincidence in a float buffer is surrounded by float. Every byte is still scanned, and in the
//! JSON files — which are printable throughout — the condition is satisfied everywhere and changes
//! nothing.
//!
//! **Two real limits on the guarantee, both stated rather than glossed.** A path deliberately
//! embedded in binary and surrounded by non-printable bytes is not reported. And a short path in a
//! short printable run is not reported either — `C:/tmp/x` is 8 bytes, below the threshold. The
//! honest statement is therefore **"a printable run of at least [`MIN_PRINTABLE_RUN`] bytes
//! containing one of the named shapes"**, not "any path". The scan is a necessary condition, never
//! a sufficient one, and these are two of the places that is true.

/// One thing the scan found, with enough context to act on it.
#[derive(Clone, Debug, PartialEq)]
pub struct Finding {
    /// Bundle-relative path of the file it was found in.
    pub file: String,
    pub class: &'static str,
    /// The matched text, truncated. Included because "there is a path in your bundle" without the
    /// path is not actionable.
    pub excerpt: String,
    pub byte_offset: usize,
}

/// The identifiers a scan should treat as this machine's, supplied rather than discovered so a test
/// can drive the scan with known values instead of depending on who is running it.
#[derive(Clone, Debug, Default)]
pub struct MachineIdentifiers {
    pub usernames: Vec<String>,
    pub hostnames: Vec<String>,
}

impl MachineIdentifiers {
    /// The current machine's, from the environment. Best-effort: an identifier this cannot read is
    /// simply not scanned for, which is a gap in the scan and not a pass.
    pub fn from_environment() -> Self {
        let mut usernames = Vec::new();
        let mut hostnames = Vec::new();
        for key in ["USERNAME", "USER", "LOGNAME"] {
            if let Ok(v) = std::env::var(key) {
                if v.len() >= 3 && !usernames.contains(&v) {
                    usernames.push(v);
                }
            }
        }
        for key in ["COMPUTERNAME", "HOSTNAME"] {
            if let Ok(v) = std::env::var(key) {
                if v.len() >= 3 && !hostnames.contains(&v) {
                    hostnames.push(v);
                }
            }
        }
        Self { usernames, hostnames }
    }
}

/// Literal needles that are a finding wherever they appear, ASCII-case-insensitively.
const CREDENTIAL_NEEDLES: &[(&str, &str)] = &[
    ("credential", "credential"),
    ("password", "credential"),
    ("passwd", "credential"),
    ("secret", "credential"),
    ("api_key", "credential"),
    ("apikey", "credential"),
    ("authorization:", "credential"),
    ("bearer ", "credential"),
    ("private_key", "credential"),
    ("BEGIN RSA", "credential"),
    ("BEGIN PRIVATE", "credential"),
    ("file://", "local-filesystem-path"),
    ("\\\\?\\", "local-filesystem-path"),
    ("/home/", "local-filesystem-path"),
    ("/Users/", "local-filesystem-path"),
    ("/tmp/", "local-filesystem-path"),
    ("/var/folders/", "local-filesystem-path"),
    ("AppData\\Local\\Temp", "local-filesystem-path"),
    ("AppData/Local/Temp", "local-filesystem-path"),
];

/// The shortest run of printable ASCII a match must sit inside to be reported.
///
/// **Twelve, and the trade runs in both directions.** A 3-byte drive-letter pattern matches by
/// chance roughly once per 2^24 positions, so a 44 MB partition of IEEE-754 coordinates yields a
/// handful — which is exactly what a real bundle produced. Requiring the match to sit inside a run
/// of printable ASCII removes those, because a float buffer is not printable for twelve consecutive
/// bytes except by an accident far rarer than the one being filtered.
///
/// The cost, stated because it is the other half of the trade: **a short path in a short run is
/// missed.** `C:/tmp/x` is 8 bytes and would not be reported; a 16-byte path is. The threshold is a
/// declared filter on noise, not a proof of absence.
pub const MIN_PRINTABLE_RUN: usize = 12;

/// Whether `bytes[offset..offset+len]` sits inside a long enough run of printable ASCII.
fn in_printable_run(bytes: &[u8], offset: usize, len: usize) -> bool {
    let printable = |b: u8| (0x20..=0x7e).contains(&b);
    if !bytes[offset..offset + len].iter().copied().all(printable) {
        return false;
    }
    let mut lo = offset;
    while lo > 0 && printable(bytes[lo - 1]) {
        lo -= 1;
    }
    let mut hi = offset + len;
    while hi < bytes.len() && printable(bytes[hi]) {
        hi += 1;
    }
    hi - lo >= MIN_PRINTABLE_RUN
}

/// Scan one file's bytes.
pub fn scan(file: &str, bytes: &[u8], machine: &MachineIdentifiers) -> Vec<Finding> {
    let mut findings = Vec::new();

    for (needle, class) in CREDENTIAL_NEEDLES {
        for offset in find_all_ascii_ci(bytes, needle.as_bytes()) {
            if in_printable_run(bytes, offset, needle.len()) {
                findings.push(finding(file, class, bytes, offset, needle.len()));
            }
        }
    }

    // A Windows drive-letter path: `X:\` or `X:/`, letter-anchored so `sha256:` and an RFC-3339
    // `12:30` cannot match.
    for i in 0..bytes.len().saturating_sub(2) {
        let (a, b, c) = (bytes[i], bytes[i + 1], bytes[i + 2]);
        if a.is_ascii_alphabetic() && b == b':' && (c == b'\\' || c == b'/') {
            // Anchored: the drive letter must not be part of a longer word, or `https://` after a
            // scheme-like token would match.
            let preceded_by_word = i > 0 && (bytes[i - 1].is_ascii_alphanumeric() || bytes[i - 1] == b'_');
            if !preceded_by_word && in_printable_run(bytes, i, 3) {
                findings.push(finding(file, "local-filesystem-path", bytes, i, 3));
            }
        }
    }

    for u in &machine.usernames {
        for offset in find_all_ascii_ci(bytes, u.as_bytes()) {
            if in_printable_run(bytes, offset, u.len()) {
                findings.push(finding(file, "username", bytes, offset, u.len()));
            }
        }
    }
    for h in &machine.hostnames {
        for offset in find_all_ascii_ci(bytes, h.as_bytes()) {
            if in_printable_run(bytes, offset, h.len()) {
                findings.push(finding(file, "machine-identifier", bytes, offset, h.len()));
            }
        }
    }

    findings
}

fn finding(file: &str, class: &'static str, bytes: &[u8], offset: usize, len: usize) -> Finding {
    let lo = offset.saturating_sub(24);
    let hi = (offset + len + 24).min(bytes.len());
    Finding {
        file: file.to_string(),
        class,
        excerpt: String::from_utf8_lossy(&bytes[lo..hi]).replace(['\n', '\r'], " "),
        byte_offset: offset,
    }
}

fn find_all_ascii_ci(haystack: &[u8], needle: &[u8]) -> Vec<usize> {
    if needle.is_empty() || needle.len() > haystack.len() {
        return Vec::new();
    }
    let mut out = Vec::new();
    for i in 0..=haystack.len() - needle.len() {
        if haystack[i..i + needle.len()]
            .iter()
            .zip(needle)
            .all(|(a, b)| a.eq_ignore_ascii_case(b))
        {
            out.push(i);
        }
    }
    out
}

/// Walk a bundle directory and scan every byte of every file.
pub fn scan_directory(
    root: &std::path::Path,
    machine: &MachineIdentifiers,
) -> std::io::Result<Vec<Finding>> {
    let mut findings = Vec::new();
    let mut stack = vec![root.to_path_buf()];
    while let Some(dir) = stack.pop() {
        let mut entries: Vec<_> = std::fs::read_dir(&dir)?.collect::<std::io::Result<Vec<_>>>()?;
        // Deterministic order, so two runs of the scan report findings in the same sequence.
        entries.sort_by_key(|e| e.path());
        for entry in entries {
            let path = entry.path();
            if path.is_dir() {
                stack.push(path);
                continue;
            }
            let rel = path
                .strip_prefix(root)
                .unwrap_or(&path)
                .to_string_lossy()
                .replace('\\', "/");
            let bytes = std::fs::read(&path)?;
            findings.extend(scan(&rel, &bytes, machine));
        }
    }
    findings.sort_by(|a, b| (&a.file, a.byte_offset).cmp(&(&b.file, b.byte_offset)));
    Ok(findings)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn machine() -> MachineIdentifiers {
        MachineIdentifiers {
            usernames: vec!["someuser".into()],
            hostnames: vec!["somebox".into()],
        }
    }

    #[test]
    fn it_finds_each_class_docs_09_names() {
        let cases: [(&[u8], &str); 6] = [
            (b"opened C:\\dev\\parcels.parquet", "local-filesystem-path"),
            (b"/home/someone/data", "local-filesystem-path"),
            (b"file:///tmp/x", "local-filesystem-path"),
            (b"authorization: Bearer abc", "credential"),
            (b"built by someuser today", "username"),
            (b"host somebox", "machine-identifier"),
        ];
        for (bytes, class) in cases {
            let f = scan("x", bytes, &machine());
            assert!(
                f.iter().any(|f| f.class == class),
                "{class} not found in {:?}",
                String::from_utf8_lossy(bytes)
            );
        }
    }

    #[test]
    fn it_does_not_fire_on_the_things_a_manifest_legitimately_contains() {
        // These are the false positives that would make the scan unusable, so they are pinned: a
        // hash prefix, an RFC-3339 instant, a logical URI, and a bundle-relative asset path. The
        // transform string carries the manifest's real **em dash**, not an ASCII hyphen, so the
        // test exercises the bytes a real bundle actually holds — a non-ASCII byte is not
        // "printable" to this scan and therefore splits a run, which is worth having covered.
        let clean = r#"{"content_hash":"sha256:ab12","started_at":"2026-08-06T12:30:45Z",
            "logical_uri":"spatial://dataset/parcels","path":"data/part-00000.arrows",
            "crs":"EPSG:2056","transform":"none — rendered in source CRS"}"#;
        let f = scan("manifest.json", clean.as_bytes(), &machine());
        assert!(f.is_empty(), "false positives: {f:#?}");
    }

    #[test]
    fn the_printable_run_threshold_is_where_the_constant_says_it_is() {
        // The threshold is a real limit on the guarantee, so it is pinned **at the boundary** rather
        // than only demonstrated far from it — one byte either side of `MIN_PRINTABLE_RUN`. Without
        // this, the constant could drift and the only symptom would be findings quietly vanishing.
        let needle = b"/home/";
        for (run_len, expected) in [(MIN_PRINTABLE_RUN - 1, false), (MIN_PRINTABLE_RUN, true)] {
            let mut buf = vec![0u8; 256];
            let mut run = vec![b'x'; run_len];
            run[..needle.len()].copy_from_slice(needle);
            buf[64..64 + run_len].copy_from_slice(&run);
            let found = !scan("x", &buf, &machine()).is_empty();
            assert_eq!(
                found, expected,
                "a printable run of {run_len} bytes should {}be reported",
                if expected { "" } else { "not " }
            );
        }
    }

    #[test]
    fn the_drive_letter_rule_is_anchored_so_a_url_scheme_does_not_match() {
        assert!(scan("x", b"see https://example.org/a", &machine()).is_empty());
        assert!(scan("x", b"spatial://dataset/parcels", &machine()).is_empty());
        // …but a real drive path still matches.
        assert!(!scan("x", b"at D:/data/x.parquet", &machine()).is_empty());
    }

    #[test]
    fn a_short_pattern_in_binary_noise_is_not_reported_but_a_real_path_in_binary_is() {
        // Both halves matter. The first is the false positive a real bundle produced: `p:/` and
        // `x:\` inside a coordinate buffer. The second is the case the rule exists for, and
        // filtering must not have thrown it away.
        let mut noise = vec![0u8; 4096];
        for (i, b) in noise.iter_mut().enumerate() {
            *b = ((i * 97 + 13) % 256) as u8;
        }
        noise[100..103].copy_from_slice(b"p:/");
        noise[200..203].copy_from_slice(b"x:\\");
        let f = scan("data/part-00000.arrows", &noise, &machine());
        assert!(f.is_empty(), "binary coincidences reported: {f:#?}");

        let mut planted = noise.clone();
        let path = br"C:\dev\parcels\secret.parquet";
        planted[1000..1000 + path.len()].copy_from_slice(path);
        let f = scan("data/part-00000.arrows", &planted, &machine());
        assert!(
            f.iter().any(|f| f.class == "local-filesystem-path"),
            "a real path embedded in a partition must still be found"
        );
    }

    #[test]
    fn a_finding_carries_enough_context_to_act_on() {
        // "there is a path in your bundle" without the path is not actionable, and a scan whose
        // output cannot be acted on gets ignored, which is worse than not running it.
        let f = scan("manifest.json", b"........ opened C:\\dev\\parcels.parquet ........", &machine());
        let hit = f.iter().find(|f| f.class == "local-filesystem-path").expect("found");
        assert_eq!(hit.file, "manifest.json");
        assert!(hit.excerpt.contains("C:\\dev\\parcels"), "excerpt was {:?}", hit.excerpt);
        assert!(hit.byte_offset > 0);
    }
}
