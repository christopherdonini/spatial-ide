//! Per-session authentication, origin validation, and credential redaction (`docs/09`).
//!
//! `docs/09`'s posture is local-first with no network access without an explicit grant. A listening
//! TCP socket is a real change in local attack surface, so each of these is a hard requirement.
//!
//! **What changed from the bake-off harness, and why it changed here rather than later.** ADR-012's
//! threat model records two things the harness did that "the production transport must not":
//! mint tokens from a splitmix64 stream, and write the credential to disk. `spikes/` has a
//! messiness carve-out; `protocol/` does not. So:
//!
//! - the token comes from the **OS CSPRNG**, and
//! - **nothing here writes it anywhere** — there is no launch-url file, and the only exit is the
//!   caller printing it once.
//!
//! Still deferred, and named rather than quietly skipped: the **OS keychain** (`docs/09`) — nothing
//! persists across sessions here, so an in-memory ephemeral token is strictly stronger than a stored
//! one — and **peer authentication on loopback** (ADR-012 open risk 8): the token authenticates a
//! session, not a process. This slice also has **no capability-grant model** and claims none.

use subtle::ConstantTimeEq;

/// The literal string that replaces a credential anywhere it would otherwise be printed.
pub const REDACTED: &str = "<redacted>";

/// The subprotocol name the data channel negotiates. The credential rides beside it as a second
/// offered value, never as a query parameter (which would land in logs) and never in a document.
pub const SUBPROTOCOL: &str = "spatial-dp.v0";
/// Prefix of the credential-bearing subprotocol entry.
pub const TOKEN_PREFIX: &str = "tok.";

#[derive(Clone)]
pub struct Session {
    /// 32 bytes from the OS CSPRNG, hex-encoded. Never serialized, never logged, never written to
    /// disk, never in a query string.
    token: String,
    /// The exact origin the served page will have. Anything else is rejected.
    origin: String,
}

impl Session {
    pub fn new(port: u16) -> std::io::Result<Self> {
        Ok(Self { token: mint_token()?, origin: format!("http://127.0.0.1:{port}") })
    }

    /// The credential, for the one caller that must hand it to a consumer out of band. In
    /// production this delivery is the **control plane** (Tauri IPC, per ADR-004); here it is the
    /// launch URL's fragment, which browsers never transmit.
    pub fn token_for_delivery(&self) -> &str {
        &self.token
    }

    /// Constant-time comparison. A short-circuiting `==` on a credential is a timing oracle, and
    /// "it's only loopback" is not an argument for building one.
    pub fn token_matches(&self, presented: &str) -> bool {
        let a = self.token.as_bytes();
        let b = presented.as_bytes();
        if a.len() != b.len() {
            let _ = a.ct_eq(a);
            return false;
        }
        a.ct_eq(b).into()
    }

    /// A stated `Origin` must match exactly. The literal string `null` is **explicitly rejected**
    /// rather than accepted by omission — the opaque-origin case flagged for WebView2.
    ///
    /// **Absent `Origin` is not by itself sufficient.** Browsers omit it on same-origin GET, so
    /// rejecting on absence would reject the consumer page's own requests. The fix is a *positive*
    /// same-origin signal from Fetch Metadata, which page script cannot forge. A client sending
    /// neither is rejected.
    pub fn request_allowed(&self, origin: Option<&str>, sec_fetch_site: Option<&str>) -> bool {
        match origin {
            Some("null") => false,
            Some(o) => o == self.origin,
            None => sec_fetch_site == Some("same-origin"),
        }
    }

    /// Pull the credential out of an offered subprotocol list.
    pub fn token_from_offers<'a>(&self, offered: &'a str) -> Option<&'a str> {
        offered
            .split(',')
            .map(str::trim)
            .find_map(|p| p.strip_prefix(TOKEN_PREFIX))
    }

    pub fn redact(&self, s: &str) -> String {
        s.replace(&self.token, REDACTED)
    }

    pub fn leaks_into(&self, artifact: &str) -> bool {
        artifact.contains(&self.token)
    }
}

/// 32 bytes from the operating system's CSPRNG.
fn mint_token() -> std::io::Result<String> {
    let mut bytes = [0u8; 32];
    getrandom::fill(&mut bytes)
        .map_err(|e| std::io::Error::other(format!("OS CSPRNG unavailable: {e}")))?;
    Ok(hex::encode(bytes))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_wrong_and_absent_credentials() {
        let s = Session::new(1234).unwrap();
        assert!(s.token_matches(s.token_for_delivery()));
        assert!(!s.token_matches(""));
        assert!(!s.token_matches("deadbeef"));
        let mut wrong = s.token_for_delivery().to_string();
        let last = wrong.pop().unwrap();
        wrong.push(if last == 'a' { 'b' } else { 'a' });
        assert!(!s.token_matches(&wrong));
    }

    #[test]
    fn origin_null_and_foreign_are_explicitly_rejected() {
        let s = Session::new(4321).unwrap();
        assert!(s.request_allowed(Some("http://127.0.0.1:4321"), None));
        assert!(!s.request_allowed(Some("null"), None));
        assert!(!s.request_allowed(Some("http://evil.example"), None));
        // localhost is a *different* origin from 127.0.0.1 and is not waved through.
        assert!(!s.request_allowed(Some("http://localhost:4321"), None));
        // A stated foreign Origin is not rescued by a forged same-origin claim.
        assert!(!s.request_allowed(Some("http://evil.example"), Some("same-origin")));
    }

    #[test]
    fn absent_origin_needs_a_positive_same_origin_signal() {
        let s = Session::new(4321).unwrap();
        assert!(s.request_allowed(None, Some("same-origin")));
        assert!(!s.request_allowed(None, None));
        assert!(!s.request_allowed(None, Some("cross-site")));
        assert!(!s.request_allowed(None, Some("same-site")));
    }

    #[test]
    fn the_credential_is_read_out_of_the_offered_subprotocols() {
        let s = Session::new(1).unwrap();
        let offers = format!("{SUBPROTOCOL}, {TOKEN_PREFIX}{}", s.token_for_delivery());
        assert_eq!(s.token_from_offers(&offers), Some(s.token_for_delivery()));
        assert_eq!(s.token_from_offers(SUBPROTOCOL), None);
    }

    #[test]
    fn redaction_removes_the_token() {
        let s = Session::new(1).unwrap();
        let leaky = format!("connecting with token={}", s.token_for_delivery());
        let clean = s.redact(&leaky);
        assert!(!s.leaks_into(&clean));
        assert!(clean.contains(REDACTED));
    }

    #[test]
    fn tokens_are_full_entropy_and_differ_between_sessions() {
        let a = Session::new(1).unwrap();
        let b = Session::new(1).unwrap();
        assert_ne!(a.token_for_delivery(), b.token_for_delivery());
        assert_eq!(a.token_for_delivery().len(), 64);
        // A weak-source smoke check: 32 CSPRNG bytes are not all the same byte, and are not the
        // low-entropy pattern a time/PID stream produces.
        let bytes = hex::decode(a.token_for_delivery()).unwrap();
        assert!(bytes.windows(2).any(|w| w[0] != w[1]));
    }
}
