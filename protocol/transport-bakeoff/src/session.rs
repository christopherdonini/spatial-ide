//! Per-session authentication, origin validation, and credential redaction (docs/09).
//!
//! docs/09's posture is local-first with no network access without an explicit grant. A listening
//! TCP socket is a real change in local attack surface, so every one of these is a hard requirement
//! (README H4), not a nicety.

use std::sync::atomic::{AtomicU64, Ordering};
use subtle::ConstantTimeEq;

/// The literal string that replaces a credential anywhere it would otherwise be printed or
/// serialized. docs/09: "secrets are redacted from logs, lineage, notebooks, fix reports, and AI
/// context" — a benchmark report is that class of artifact.
pub const REDACTED: &str = "<redacted>";

#[derive(Clone)]
pub struct Session {
    /// 32 bytes, hex-encoded. Never serialized, never logged, never in a URL query string.
    token: String,
    /// The exact origin the served page will have. Anything else is rejected.
    origin: String,
}

impl Session {
    pub fn new(port: u16) -> Self {
        Self {
            token: mint_token(),
            origin: format!("http://127.0.0.1:{port}"),
        }
    }

    /// Only the page-serving path may see this, and only to inject it into the document it serves.
    /// This stands in for delivery over the Tauri IPC control plane; in production the token
    /// crosses the control plane and is never embedded in a document.
    pub fn token_for_injection(&self) -> &str {
        &self.token
    }

    /// Constant-time comparison (docs/09 — H4). A short-circuiting `==` on a credential is a
    /// timing oracle, and "it's only loopback" is not an argument for building one.
    pub fn token_matches(&self, presented: &str) -> bool {
        let a = self.token.as_bytes();
        let b = presented.as_bytes();
        if a.len() != b.len() {
            // Still burn a comparison so the length check is the only observable difference.
            let _ = a.ct_eq(a);
            return false;
        }
        a.ct_eq(b).into()
    }

    /// Origin validation.
    ///
    /// A stated `Origin` must match exactly. The literal string `null` is **explicitly rejected**
    /// rather than accepted by omission — the specific failure mode flagged for WebView2, where an
    /// opaque origin serializes as `null`.
    ///
    /// **Absent `Origin` is not, by itself, sufficient.** Per the Fetch standard a browser omits
    /// `Origin` on same-origin GET/HEAD, so "reject whenever `Origin` is missing" would reject the
    /// harness page's own requests — which is exactly what it did on first run. The fix is not to
    /// start trusting an absent header: it is to require a *positive* same-origin signal from
    /// Fetch Metadata (`Sec-Fetch-Site: same-origin`), which the browser sets and page script
    /// cannot forge. A non-browser client that sends neither header is still rejected.
    pub fn request_allowed(&self, origin: Option<&str>, sec_fetch_site: Option<&str>) -> bool {
        match origin {
            Some("null") => false,
            Some(o) => o == self.origin,
            None => sec_fetch_site == Some("same-origin"),
        }
    }

    /// Redact the token out of any string bound for a log or a report artifact.
    pub fn redact(&self, s: &str) -> String {
        s.replace(&self.token, REDACTED)
    }

    /// H4's byte-scan assertion: no artifact may contain the token.
    pub fn leaks_into(&self, artifact: &str) -> bool {
        artifact.contains(&self.token)
    }
}

/// Token material. Not a cryptographic-grade CSPRNG binding — deliberately: this is a loopback
/// benchmark session token with a process lifetime, and the harness must not pretend to a security
/// property it has not established. ADR-012 states this in its threat model rather than leaving a
/// reader to assume otherwise.
fn mint_token() -> String {
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    let mut bytes = [0u8; 32];
    let t = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos() as u64)
        .unwrap_or(0);
    let pid = std::process::id() as u64;
    let c = COUNTER.fetch_add(1, Ordering::Relaxed);
    let mut state = t ^ pid.rotate_left(32) ^ c.rotate_left(11) ^ 0xa076_1d64_78bd_642f;
    for chunk in bytes.chunks_mut(8) {
        // splitmix64
        state = state.wrapping_add(0x9e37_79b9_7f4a_7c15);
        let mut z = state;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
        z ^= z >> 31;
        chunk.copy_from_slice(&z.to_le_bytes()[..chunk.len()]);
    }
    hex::encode(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_wrong_and_absent_credentials() {
        let s = Session::new(1234);
        assert!(s.token_matches(s.token_for_injection()));
        assert!(!s.token_matches(""));
        assert!(!s.token_matches("deadbeef"));
        let mut wrong = s.token_for_injection().to_string();
        // flip one hex char — same length, so the constant-time path is what rejects it
        let last = wrong.pop().unwrap();
        wrong.push(if last == 'a' { 'b' } else { 'a' });
        assert!(!s.token_matches(&wrong));
    }

    #[test]
    fn origin_null_and_foreign_are_explicitly_rejected() {
        let s = Session::new(4321);
        assert!(s.request_allowed(Some("http://127.0.0.1:4321"), None));
        assert!(!s.request_allowed(Some("null"), None), "null Origin must not pass");
        assert!(!s.request_allowed(Some("http://evil.example"), None));
        // localhost is a *different* origin from 127.0.0.1 and is not waved through.
        assert!(!s.request_allowed(Some("http://localhost:4321"), None));
        // A stated foreign Origin is not rescued by a forged same-origin fetch-metadata claim.
        assert!(!s.request_allowed(Some("http://evil.example"), Some("same-origin")));
        assert!(!s.request_allowed(Some("null"), Some("same-origin")));
    }

    #[test]
    fn absent_origin_needs_a_positive_same_origin_signal() {
        let s = Session::new(4321);
        // Browsers omit Origin on same-origin GET; Fetch Metadata is what makes that safe to allow.
        assert!(s.request_allowed(None, Some("same-origin")));
        // Everything else with no Origin is rejected — including a bare client sending neither.
        assert!(!s.request_allowed(None, None));
        assert!(!s.request_allowed(None, Some("cross-site")));
        assert!(!s.request_allowed(None, Some("same-site")));
        assert!(!s.request_allowed(None, Some("none")));
    }

    #[test]
    fn redaction_removes_the_token() {
        let s = Session::new(1);
        let leaky = format!("connecting with token={}", s.token_for_injection());
        let clean = s.redact(&leaky);
        assert!(!s.leaks_into(&clean));
        assert!(clean.contains(REDACTED));
    }

    #[test]
    fn tokens_differ_between_sessions() {
        let a = Session::new(1);
        let b = Session::new(1);
        assert_ne!(a.token_for_injection(), b.token_for_injection());
        assert_eq!(a.token_for_injection().len(), 64);
    }
}
