// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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

/// The class given to an **identity** match that lies wholly inside a string the operator
/// deliberately published.
///
/// **Still a finding, and still reported.** Only its class changes, and it changes to one that says
/// why the text is there. Suppressing it would make `viewer_license.copyright` a hole a genuine leak
/// could hide in; reporting it as `username` would tell a reader their bundle leaked something when
/// what it carries is a copyright notice they typed.
pub const OPERATOR_DECLARED: &str = "operator-declared";

/// The classes a declaration can explain: [`OPERATOR_DECLARED`] replaces **only** these.
///
/// **`credential` and `local-filesystem-path` are deliberately absent, and this is the whole of the
/// mechanism's safety.** The argument for attributing a match is about *identity*: ADR-009 item 7
/// forces a copyright notice into every manifest, a copyright notice names a person, and on a
/// single-maintainer machine that person's name is also the login name. None of that reasoning
/// reaches a secret. `docs/09` makes credential redaction unconditional, and it does not become
/// conditional because the credential happens to sit inside a string somebody typed.
///
/// The concrete case this closes: a corresponding-source route of
/// `https://example.org/src?api_key=…` puts a real credential **wholly inside** a declared
/// occurrence. Re-classing it would have moved it out of the set
/// `kernel/tests/publish.rs` treats as leaks — so the redaction test would have passed with a live
/// secret in the bundle. An operator writing that URL plausibly does not realise it carries one,
/// which is exactly when a scan has to be the thing that notices.
const ATTRIBUTABLE_CLASSES: &[&str] = &["username", "machine-identifier"];

/// The identifiers a scan should treat as this machine's, supplied rather than discovered so a test
/// can drive the scan with known values instead of depending on who is running it.
#[derive(Clone, Debug, Default)]
pub struct MachineIdentifiers {
    pub usernames: Vec<String>,
    pub hostnames: Vec<String>,
    /// Strings the operator **deliberately** put in the bundle, so a match inside one can be
    /// attributed instead of alarming.
    ///
    /// ## Why this exists (ADR-017 Corrigendum 3)
    ///
    /// ADR-009 item 7 requires every bundle to carry the distributed code's copyright notice, and a
    /// copyright notice names a person. On a machine whose login name is that person's — the
    /// ordinary case for a single-maintainer project — the notice contains the machine's username
    /// **because the operator put it there on purpose**, and `docs/09`'s concern is leaked machine
    /// provenance, not declared identity. The scan cannot tell those apart from bytes alone, so the
    /// caller says which strings are declared.
    ///
    /// A `written-offer` corresponding-source route belongs here too: §13's own limits mean a
    /// postal address is not a class this scan knows, but the operator's own name inside one is.
    ///
    /// **The guarantee is not weakened.** Only a match lying *wholly inside an occurrence of one of
    /// these strings* is re-classed. The same username appearing anywhere else — in a path, in the
    /// sidecar, in a partition — is still reported as `username`.
    pub declared: Vec<String>,
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
        // **Nothing declared**, deliberately: the environment knows what this machine is called and
        // cannot know what the operator meant to publish. A caller that has declarations supplies
        // them (`..MachineIdentifiers::from_environment()`); one that does not gets the strict scan.
        Self { usernames, hostnames, declared: Vec::new() }
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

/// The byte ranges occupied by strings the operator deliberately published.
///
/// Computed per file because the offsets are per file. **It is not a per-file scoping mechanism** —
/// the same declared list is applied to every file, so a copyright that somehow appeared verbatim
/// inside a partition would attribute a username there too. What actually scopes this is that a
/// declaration only explains matches *inside its own occurrences*, wherever those turn out to be.
fn declared_ranges(bytes: &[u8], declared: &[String]) -> Vec<(usize, usize)> {
    let mut out = Vec::new();
    for d in declared {
        // A blank or near-blank declared string would match everywhere and turn the whole scan off,
        // which is the one way this mechanism could become the hole it is written to avoid.
        if d.trim().len() < MIN_PRINTABLE_RUN {
            continue;
        }
        for offset in find_all_ascii_ci(bytes, d.as_bytes()) {
            out.push((offset, offset + d.len()));
        }
    }
    out
}

/// Scan one file's bytes.
pub fn scan(file: &str, bytes: &[u8], machine: &MachineIdentifiers) -> Vec<Finding> {
    let mut findings = Vec::new();
    let declared = declared_ranges(bytes, &machine.declared);

    // An **identity** match lying wholly inside one declared occurrence is attributed rather than
    // alarming. Three conditions, each load-bearing:
    //
    //   - the class must be in `ATTRIBUTABLE_CLASSES` — a credential or a filesystem path is never
    //     explained by a declaration, however deliberately the declaration was written;
    //   - wholly inside, not overlapping: a path that merely begins where a copyright ends is not
    //     explained by that copyright;
    //   - the declared string must have cleared the length floor in `declared_ranges`.
    let class_for = |class: &'static str, offset: usize, len: usize| -> &'static str {
        if ATTRIBUTABLE_CLASSES.contains(&class)
            && declared.iter().any(|&(lo, hi)| offset >= lo && offset + len <= hi)
        {
            OPERATOR_DECLARED
        } else {
            class
        }
    };

    for (needle, class) in CREDENTIAL_NEEDLES {
        for offset in find_all_ascii_ci(bytes, needle.as_bytes()) {
            if in_printable_run(bytes, offset, needle.len()) {
                findings.push(finding(
                    file,
                    class_for(class, offset, needle.len()),
                    bytes,
                    offset,
                    needle.len(),
                ));
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
                findings.push(finding(
                    file,
                    class_for("local-filesystem-path", i, 3),
                    bytes,
                    i,
                    3,
                ));
            }
        }
    }

    for u in &machine.usernames {
        for offset in find_all_ascii_ci(bytes, u.as_bytes()) {
            if in_printable_run(bytes, offset, u.len()) {
                findings.push(finding(
                    file,
                    class_for("username", offset, u.len()),
                    bytes,
                    offset,
                    u.len(),
                ));
            }
        }
    }
    for h in &machine.hostnames {
        for offset in find_all_ascii_ci(bytes, h.as_bytes()) {
            if in_printable_run(bytes, offset, h.len()) {
                findings.push(finding(
                    file,
                    class_for("machine-identifier", offset, h.len()),
                    bytes,
                    offset,
                    h.len(),
                ));
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
            declared: Vec::new(),
        }
    }

    /// A declared string explains a match **inside it**, and explains nothing anywhere else.
    ///
    /// ADR-009 item 7 makes a copyright notice a required member of every manifest, and a copyright
    /// notice names a person — who, on a single-maintainer machine, is also the login name. Without
    /// this the scan would report a leak for text the operator typed on purpose; with it done wrong,
    /// `viewer_license.copyright` would become a place to hide a real one. Both halves are asserted.
    #[test]
    fn an_operator_declared_string_attributes_a_match_inside_it_and_nothing_outside_it() {
        let copyright = "Copyright (C) 2026 someuser and the Spatial IDE contributors";
        let m = MachineIdentifiers {
            declared: vec![copyright.to_string()],
            ..machine()
        };

        // Inside the declared string: reported, and re-classed to say why it is there.
        let inside = format!(r#"{{"copyright":"{copyright}"}}"#);
        let f = scan("manifest.json", inside.as_bytes(), &m);
        assert_eq!(f.len(), 1, "{f:#?}");
        assert_eq!(f[0].class, OPERATOR_DECLARED);

        // The same username **outside** it is still a `username` finding. This is the half that
        // keeps the mechanism from being a hole: a declared copyright does not license every other
        // occurrence in the file.
        let outside = format!(r#"{{"copyright":"{copyright}","built_by":"someuser"}}"#);
        let f = scan("manifest.json", outside.as_bytes(), &m);
        assert!(
            f.iter().any(|f| f.class == "username"),
            "a username outside the declared string was excused: {f:#?}"
        );

        // And a declared string is only an explanation in a file it actually appears in.
        let elsewhere = scan("data/part-00000.arrows", b"...... someuser ......", &m);
        assert!(elsewhere.iter().any(|f| f.class == "username"), "{elsewhere:#?}");
    }

    /// **A declaration explains an identity, never a secret and never a path.**
    ///
    /// The case: a corresponding-source route of `https://…?api_key=…` puts a real credential
    /// wholly inside a declared occurrence. If `OPERATOR_DECLARED` applied to every class, that
    /// credential would move out of the set `kernel/tests/publish.rs` treats as leaks, and the
    /// redaction test would pass with a live secret in the bundle. `docs/09` makes credential
    /// redaction unconditional; a declaration is not an exception to it.
    #[test]
    fn a_declaration_never_excuses_a_credential_or_a_filesystem_path() {
        let route = "https://example.org/spatial-ide/src?api_key=SUPERSECRETVALUE";
        let offer = "Write to C:\\Users\\someuser\\spatial-ide for a copy of the source.";
        let m = MachineIdentifiers {
            declared: vec![route.to_string(), offer.to_string()],
            ..machine()
        };

        // The credential sits inside the declared route and is still reported as a credential.
        let f = scan("manifest.json", format!(r#"{{"at":"{route}"}}"#).as_bytes(), &m);
        assert!(
            f.iter().any(|f| f.class == "credential"),
            "a declared route excused a credential: {f:#?}"
        );
        assert!(
            !f.iter().any(|f| f.class == OPERATOR_DECLARED),
            "a credential was attributed rather than reported: {f:#?}"
        );

        // Same for a filesystem path inside a written offer — and the username in that same offer
        // *is* attributed, so the two behaviours are shown side by side rather than assumed.
        let f = scan("manifest.json", format!(r#"{{"at":"{offer}"}}"#).as_bytes(), &m);
        assert!(
            f.iter().any(|f| f.class == "local-filesystem-path"),
            "a declared offer excused a filesystem path: {f:#?}"
        );
        assert!(
            f.iter().any(|f| f.class == OPERATOR_DECLARED),
            "the operator's own name inside their own offer should still be attributed: {f:#?}"
        );
    }

    /// A too-short declared string is ignored, so the mechanism cannot be used to disable the scan.
    #[test]
    fn a_declared_string_shorter_than_the_printable_run_threshold_excuses_nothing() {
        for degenerate in ["", "   ", "a", "someuser"] {
            let m = MachineIdentifiers {
                declared: vec![degenerate.to_string()],
                ..machine()
            };
            let f = scan("manifest.json", b"........ someuser ........", &m);
            assert!(
                f.iter().any(|f| f.class == "username"),
                "a declared string of {degenerate:?} suppressed a real finding: {f:#?}"
            );
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
