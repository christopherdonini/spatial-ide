// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! RFC-3339 UTC from the system clock, with no date crate.
//!
//! **Moved here from `bin/publish-bundle.rs`, so there is one spelling.** The binary needed it for
//! `started_at` and `finished_at`; the audit record needs it for every record's `at`. Two
//! hand-rolled civil-from-days implementations that must agree is exactly the arrangement
//! `publish::viewer_bundle_path` exists to prevent one level up — each site can be individually
//! correct and the pair still disagree.
//!
//! **It is a function, and the boundary takes a `&dyn Fn() -> String` rather than calling it.** The
//! same reason `PublishRequest::finished_at` is a closure: a test that cannot pin the clock cannot
//! assert on a record's contents, and a clock read inside the thing being tested is a clock nobody
//! can fix.

/// The current instant as an RFC-3339 UTC string, to whole seconds.
pub fn rfc3339_utc_now() -> String {
    let d = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default();
    rfc3339_utc(d.as_secs() as i64)
}

/// RFC-3339 UTC for a Unix timestamp. Split out so the conversion itself is testable against known
/// values rather than only against "whatever the clock said".
pub fn rfc3339_utc(unix_seconds: i64) -> String {
    let secs = unix_seconds;
    let days = secs.div_euclid(86_400);
    let tod = secs.rem_euclid(86_400);
    // Civil-from-days (Howard Hinnant's algorithm), so no date crate is pulled in for one string.
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z.rem_euclid(146_097);
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let day = doy - (153 * mp + 2) / 5 + 1;
    let month = if mp < 10 { mp + 3 } else { mp - 9 };
    let year = if month <= 2 { y + 1 } else { y };
    format!(
        "{year:04}-{month:02}-{day:02}T{:02}:{:02}:{:02}Z",
        tod / 3_600,
        (tod % 3_600) / 60,
        tod % 60
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Pinned against instants whose civil form is independently known, because a hand-rolled
    /// calendar that is only ever compared with itself is a calendar nobody has checked.
    #[test]
    fn known_instants_convert_correctly() {
        assert_eq!(rfc3339_utc(0), "1970-01-01T00:00:00Z");
        assert_eq!(rfc3339_utc(1_000_000_000), "2001-09-09T01:46:40Z");
        // A leap day, which is where a civil-from-days implementation goes wrong if it is wrong.
        assert_eq!(rfc3339_utc(1_709_164_800), "2024-02-29T00:00:00Z");
        assert_eq!(rfc3339_utc(1_754_524_800), "2025-08-07T00:00:00Z");
    }

    #[test]
    fn the_live_clock_produces_the_declared_shape() {
        let s = rfc3339_utc_now();
        assert_eq!(s.len(), 20, "{s}");
        assert!(s.ends_with('Z'), "{s}");
        assert_eq!(s.as_bytes()[10], b'T', "{s}");
    }
}
