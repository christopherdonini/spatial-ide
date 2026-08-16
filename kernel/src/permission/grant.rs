// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Scoped publish grants** — `docs/09`'s capability grants, for exactly one operation.
//!
//! `docs/09` replaces four coarse permissions with "scoped, expiring grants", and gives the grammar
//! in its own words:
//!
//! ```text
//! read dataset A
//! cannot publish
//! expires in 20 minutes
//! ```
//!
//! This module implements that shape for one operation kind. What it is **not** is a permission
//! system: there is no authentication, no client, and no extension surface. See [`Principal`] for
//! what is and is not established about identity, and `kernel/PERMISSION-BOUNDARY.md` for what
//! exposing any of this would still require.
//!
//! ## Grants are in-process and non-persistent, and that is load-bearing
//!
//! Nothing here outlives the process. The justification is the same one
//! `protocol/data-plane/src/session.rs` gives for deferring the OS keychain — it holds *only while
//! nothing outlives the process*, and it is void the moment something does.
//!
//! **The moment a grant is persisted, `docs/11`'s ResourceRef model, `docs/14`'s plain-text rule and
//! a revocation design all become live requirements, and this paragraph must be retired rather than
//! inherited.** A persisted grant is a resource: it needs a stable URI, a schema, a lifecycle, a
//! diffable text format, a revocation story, and — because it authorizes an irreversible act — its
//! own integrity story. None of that is in this cut, and none of it is claimed.
//!
//! ## The single-user reality, stated rather than obscured
//!
//! The grantor and the operator are the same OS user today, and at the command line the tool mints
//! its own grant. The object model deliberately does **not** assume it — a grant carries its
//! grantor, and [`PrincipalKind`] has room for kinds that do not exist yet — so the multi-principal
//! case is a data change rather than a redesign. But no authentication is built, and an identity
//! read from the environment is not a verified one.

use std::path::{Path, PathBuf};
use std::time::{Duration, Instant, SystemTime};

use super::error::PermissionError;

/// The class-3 operation kinds a grant can authorize.
///
/// One variant, because one class-3 operation exists. A second is a variant, not a redesign — which
/// is the property that keeps this from having to be rewritten when export arrives.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum OperationKind {
    Publish,
}

impl OperationKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Publish => crate::publish::OPERATION,
        }
    }
}

/// What kind of principal a grantor is.
///
/// **One variant, and the honest one.** `OsUser` says exactly what is known: an identity read from
/// the environment of the process. It is not authenticated, and recording an unauthenticated remote
/// identity as a grantor *fact* is precisely what ADR-015 refuses in the CRS case — so a future SKP
/// client does not get to reuse this variant, it gets its own, once there is an authentication
/// story to back it.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PrincipalKind {
    OsUser,
}

impl PrincipalKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::OsUser => "os-user",
        }
    }
}

/// Who granted, or who is operating. Today these are the same person; the type does not assume it.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Principal {
    pub kind: PrincipalKind,
    pub id: String,
}

impl Principal {
    /// The current OS user, from the environment.
    ///
    /// Best-effort and **unverified**: `USERNAME`/`USER`/`LOGNAME` are environment variables a
    /// process can set for its own children, so this is what the process was told, not what the
    /// operating system knows. It is recorded as the grantor because an audit record with no
    /// principal is not attributable (`docs/09`), and it is labelled `os-user` rather than
    /// `authenticated-user` because the second word would be false.
    pub fn from_environment() -> Self {
        // The emptiness test lives **inside** the closure. Outside it, a set-but-empty `USERNAME`
        // would satisfy `find_map`, short-circuit the search, and then fail the filter — yielding
        // `(unknown)` while `USER` and `LOGNAME` sat there unread.
        let id = ["USERNAME", "USER", "LOGNAME"]
            .iter()
            .find_map(|k| std::env::var(k).ok().filter(|v| !v.trim().is_empty()))
            .unwrap_or_else(|| "(unknown)".to_string());
        Self { kind: PrincipalKind::OsUser, id }
    }
}

/// The source half of a grant's scope.
///
/// **Both members, with different jobs.** The content hash is the binding fact — it is read off the
/// dataset's own pin, never off the request, so there is nothing here for a caller to misstate. The
/// catalog name is *also* scoped, because it is not a handle: `publish` turns it into
/// `spatial://dataset/<name>` inside the manifest, so it is part of the artifact the grant
/// authorizes. A grant for `parcels` must not authorize publishing byte-identical data as
/// `internal-parcels`.
///
/// The name alone would be a mutable pointer — "whatever is registered under this name right now" —
/// and is refused as a sole basis for the same reason ADR-005 pins content rather than names.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SourceScope {
    pub dataset_name: String,
    /// `sha256:<hex>`, exactly as `ContentPin` reports it.
    pub content_hash: String,
}

/// The destination half of a grant's scope.
///
/// **A grant may name a filesystem path, and ADR-017 §13 does not reach it.** §13's scope is
/// "anywhere in a **bundle**" (Corrigendum 2 confirms it supplies what *redacted* means for the
/// emitted artifact). A grant lives in memory, is never serialized, and ships nowhere; a grant
/// forbidden from naming a path could not scope anything. Two things keep that true rather than
/// merely intended: [`PublishGrant`] has a hand-written [`std::fmt::Debug`] that prints the
/// **normalized** destination, so a `{:?}` in a panic never emits the raw path; and the only route
/// from a grant to disk is the audit record's normalized `destination` field.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum DestinationScope {
    /// One resolved path, and nothing else.
    Exact(PathBuf),
    /// Any **direct child** of this directory — the "destination class".
    ///
    /// Direct child, deliberately: a prefix test would let `dir/a/b/c` through, and a grant for a
    /// directory is not a grant for the tree beneath it.
    DirectChildOf(PathBuf),
}

impl DestinationScope {
    /// Scope one destination, resolving it the same way the check will.
    pub fn exact(destination: &Path) -> Result<Self, PermissionError> {
        Ok(Self::Exact(resolve_destination(destination)?))
    }

    /// Scope a directory's direct children. The directory must exist — it is resolved, not assumed.
    pub fn direct_child_of(dir: &Path) -> Result<Self, PermissionError> {
        let resolved = std::fs::canonicalize(dir).map_err(|e| PermissionError::DestinationUnresolvable {
            path: dir.display().to_string(),
            detail: e.to_string(),
        })?;
        Ok(Self::DirectChildOf(resolved))
    }

    fn covers(&self, resolved_destination: &Path) -> bool {
        match self {
            Self::Exact(p) => p == resolved_destination,
            Self::DirectChildOf(d) => resolved_destination.parent() == Some(d.as_path()),
        }
    }

    fn describe(&self) -> String {
        match self {
            Self::Exact(p) => format!("exactly `{}`", super::audit::normalize_destination(p)),
            Self::DirectChildOf(d) => format!(
                "a direct child of `{}`",
                super::audit::normalize_destination(d)
            ),
        }
    }
}

/// Resolve a destination that does not exist yet into the filesystem's own answer.
///
/// **Both sides of every comparison go through this one function**, which is what makes the check a
/// comparison of facts rather than of spellings — and what makes Windows' `\\?\` verbatim prefix
/// cancel out instead of being a silent mismatch.
///
/// The destination itself cannot be canonicalized, because publishing to an existing path is a
/// refusal and so the path is expected to be absent. Its **parent** must exist — `Staging::create`
/// already requires that, and it creates the staging directory there — so the parent is canonicalized
/// and the final component rejoined.
pub fn resolve_destination(destination: &Path) -> Result<PathBuf, PermissionError> {
    let unresolvable = |detail: &str| PermissionError::DestinationUnresolvable {
        path: destination.display().to_string(),
        detail: detail.to_string(),
    };
    let name = destination
        .file_name()
        .ok_or_else(|| unresolvable("it has no final path component to name a bundle"))?;
    let parent = destination.parent().unwrap_or_else(|| Path::new("."));
    let parent = if parent.as_os_str().is_empty() { Path::new(".") } else { parent };
    let parent = std::fs::canonicalize(parent).map_err(|e| {
        PermissionError::DestinationUnresolvable {
            path: destination.display().to_string(),
            detail: format!("its parent directory could not be resolved: {e}"),
        }
    })?;
    Ok(parent.join(name))
}

/// The declared ceiling on a grant's lifetime (ADR-010 rule 6).
///
/// **Twenty minutes, and the number is `docs/09`'s own**: its grant grammar reads "expires in 20
/// minutes". Promoting the example to the ceiling means the constitution's illustration and the
/// code's bound are one value rather than two that can drift.
pub const MAX_GRANT_LIFETIME: Duration = Duration::from_secs(20 * 60);

/// The declared ceiling on how many grants may be held at once (ADR-010 rule 6).
pub const MAX_GRANTS: usize = 64;

/// An explicit authorization for one class-3 operation kind against a declared scope.
#[derive(Clone)]
pub struct PublishGrant {
    operation: OperationKind,
    source: SourceScope,
    destination: DestinationScope,
    granted_by: Principal,
    /// **Monotonic, and that is the decision.** A `SystemTime` basis would let an NTP step or an
    /// operator changing the clock silently extend an authorization for an irreversible act.
    granted_at: Instant,
    lifetime: Duration,
    /// Display and audit only — **never** compared. Carried because "granted at 14:03" is what a
    /// human reads, and `Instant` has no readable form.
    granted_at_wall: SystemTime,
}

/// Hand-written so a `{:?}` never emits a raw filesystem path (`docs/09`: secrets and machine
/// provenance are redacted from logs). The normalized form is what any other route to disk uses.
impl std::fmt::Debug for PublishGrant {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("PublishGrant")
            .field("operation", &self.operation)
            .field("dataset_name", &self.source.dataset_name)
            .field("content_hash", &self.source.content_hash)
            .field("destination", &self.destination.describe())
            .field("granted_by", &self.granted_by.kind)
            .field("lifetime_s", &self.lifetime.as_secs())
            .finish()
    }
}

impl PublishGrant {
    /// Issue a grant. Refuses a lifetime above the declared ceiling.
    pub fn new(
        operation: OperationKind,
        source: SourceScope,
        destination: DestinationScope,
        granted_by: Principal,
        lifetime: Duration,
    ) -> Result<Self, PermissionError> {
        if lifetime > MAX_GRANT_LIFETIME {
            return Err(PermissionError::GrantLifetimeExceeded {
                requested_s: lifetime.as_secs(),
                limit_s: MAX_GRANT_LIFETIME.as_secs(),
            });
        }
        Ok(Self {
            operation,
            source,
            destination,
            granted_by,
            granted_at: Instant::now(),
            lifetime,
            granted_at_wall: SystemTime::now(),
        })
    }

    pub fn operation(&self) -> OperationKind {
        self.operation
    }

    pub fn granted_by(&self) -> &Principal {
        &self.granted_by
    }

    pub fn lifetime(&self) -> Duration {
        self.lifetime
    }

    pub fn granted_at_wall(&self) -> SystemTime {
        self.granted_at_wall
    }

    /// Seconds left, saturating at zero.
    pub fn remaining(&self, now: Instant) -> Duration {
        self.lifetime
            .checked_sub(now.saturating_duration_since(self.granted_at))
            .unwrap_or(Duration::ZERO)
    }

    fn elapsed(&self, now: Instant) -> Duration {
        now.saturating_duration_since(self.granted_at)
    }

    fn expired(&self, now: Instant) -> bool {
        self.elapsed(now) >= self.lifetime
    }

    /// Whether this grant's scope covers these facts, ignoring expiry.
    ///
    /// Returns the failing predicate rather than a bool, so the refusal can name which of three
    /// things was wrong.
    fn scope_mismatch(&self, facts: &OperationFacts) -> Option<String> {
        if self.source.dataset_name != facts.dataset_name {
            return Some(format!(
                "the grant scopes dataset `{}` and this publish names `{}` — the catalog name \
                 becomes `spatial://dataset/<name>` in the manifest, so it is part of the artifact \
                 the grant authorizes, not a handle",
                self.source.dataset_name, facts.dataset_name
            ));
        }
        if self.source.content_hash != facts.content_hash {
            return Some(format!(
                "the grant scopes source content `{}` and this publish's source hashes to `{}`. \
                 The hash compared is the one read from the file, never one the request supplied",
                self.source.content_hash, facts.content_hash
            ));
        }
        if !self.destination.covers(&facts.destination) {
            return Some(format!(
                "the grant scopes {} and this publish resolves to `{}`",
                self.destination.describe(),
                super::audit::normalize_destination(&facts.destination)
            ));
        }
        None
    }
}

/// What the operation **actually is**, assembled from facts rather than from the request.
///
/// Every member is derived from something that cannot be asserted: the content hash comes off the
/// dataset's pin, the destination from [`resolve_destination`]. The dataset name is the one
/// exception and is legitimately the caller's, because that value *becomes* the artifact's logical
/// URI — it is not a description of the operation, it is part of it.
#[derive(Clone, Debug)]
pub struct OperationFacts {
    pub operation: OperationKind,
    pub dataset_name: String,
    pub content_hash: String,
    /// Already through [`resolve_destination`].
    pub destination: PathBuf,
}

/// The grants held right now. Not a store, not a database — a list that dies with the process.
#[derive(Default)]
pub struct GrantSet {
    grants: Vec<PublishGrant>,
}

impl GrantSet {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn len(&self) -> usize {
        self.grants.len()
    }

    pub fn is_empty(&self) -> bool {
        self.grants.is_empty()
    }

    pub fn add(&mut self, grant: PublishGrant) -> Result<(), PermissionError> {
        if self.grants.len() >= MAX_GRANTS {
            return Err(PermissionError::GrantCeilingExceeded {
                ceiling: "MAX_GRANTS",
                limit: MAX_GRANTS,
            });
        }
        self.grants.push(grant);
        Ok(())
    }

    /// Removes every grant whose lifetime has elapsed against `now`. **Not called automatically by
    /// [`Self::add`]** — a caller decides when the linear scan is worth it; this exists because a
    /// one-shot process like `publish-bundle` mints one grant and exits, so `MAX_GRANTS` was never
    /// reachable there, but a long-lived `GrantSet` (`frontends/shell`'s own managed state, alive
    /// for the whole app session) has no such natural bound — without pruning, every `prepare` call
    /// only ever grows the set, and the 65th in a session refuses `GrantCeilingExceeded` forever
    /// (S1, found at this cut's own reviewer gate). `frontends/shell/src-tauri/src/publish.rs`
    /// calls this once per `binding_publish_prepare`, mirroring `PendingAttempts::insert`'s own
    /// prune-on-insert precedent in the same file. Every grant this crate mints declares a bounded
    /// `lifetime` (`PublishGrant::new`), so an expired grant is dead weight, never a live
    /// authorization anything could still need: removing it changes nothing [`Self::find`] could
    /// have located (an expired grant already refuses there with `GrantExpired`), only how long the
    /// dead weight sits around first.
    pub fn prune_expired(&mut self, now: Instant) {
        // `!g.expired(now)`, the exact predicate `find` already applies (`in_scope.iter().find(|g|
        // !g.expired(now))` above) -- pruning can never disagree with what a lookup would have done.
        self.grants.retain(|g| !g.expired(now));
    }

    /// Removes every grant matching these exact facts — **the "consumed" half of pruning**,
    /// `prune_expired`'s complement: a grant `boundary::execute` just located and used (S1's own
    /// gap) serves no further purpose the instant its single-use attempt is spent, whether or not
    /// it would also have expired naturally on its own 120 s-class lifetime. Matches on the SAME
    /// predicate `find` uses (`operation` and `scope_mismatch`), **ignoring expiry** — consumed is
    /// consumed either way — so a caller that just successfully (or unsuccessfully) executed an
    /// attempt can evict its grant immediately rather than waiting on a future `prune_expired` to
    /// notice it has gone stale. `frontends/shell/src-tauri/src/publish.rs` calls this once
    /// `execute_with_progress` reaches a terminal outcome. Returns whether anything was removed —
    /// `false` is not an error, only "nothing here matched" (e.g. the attempt's own grant issuance
    /// itself had already refused, so nothing was ever added).
    pub fn remove_matching(&mut self, facts: &OperationFacts) -> bool {
        let before = self.grants.len();
        self.grants
            .retain(|g| g.operation != facts.operation || g.scope_mismatch(facts).is_some());
        self.grants.len() != before
    }

    /// The grant authorizing these facts, or the reason there is none.
    ///
    /// **The refusal order is what makes three different failures produce three different errors**,
    /// and it is deliberate:
    ///
    /// 1. no grant for this operation kind at all → [`PermissionError::NoGrant`]
    /// 2. none whose scope covers these facts, **expiry ignored** →
    ///    [`PermissionError::GrantScopeMismatch`], naming the predicate that failed on the closest
    ///    candidate
    /// 3. scope matches but every such grant has lapsed → [`PermissionError::GrantExpired`]
    ///
    /// Expiry is tested **last** so an otherwise-matching expired grant reports expiry. The other
    /// order would send an operator to fix a destination that was never the problem.
    ///
    /// A linear scan, deliberately: the match is a conjunction over three predicates including a
    /// directory-class test rather than a single-key lookup, and 64 entries do not earn an index.
    pub fn find(
        &self,
        facts: &OperationFacts,
        now: Instant,
    ) -> Result<&PublishGrant, PermissionError> {
        let for_operation: Vec<&PublishGrant> =
            self.grants.iter().filter(|g| g.operation == facts.operation).collect();
        if for_operation.is_empty() {
            return Err(PermissionError::NoGrant { operation: facts.operation.as_str() });
        }

        let mut in_scope: Vec<&PublishGrant> = Vec::new();
        let mut closest: Option<String> = None;
        for g in &for_operation {
            match g.scope_mismatch(facts) {
                None => in_scope.push(g),
                Some(detail) => {
                    if closest.is_none() {
                        closest = Some(detail);
                    }
                }
            }
        }
        if in_scope.is_empty() {
            return Err(PermissionError::GrantScopeMismatch {
                detail: closest.unwrap_or_else(|| "no grant covers it".into()),
            });
        }

        match in_scope.iter().find(|g| !g.expired(now)) {
            Some(g) => Ok(g),
            None => {
                // Every in-scope grant has lapsed; report the one that lapsed **most recently**,
                // which is the one an operator is most likely to be thinking of.
                //
                // That is `elapsed − lifetime`, not `elapsed`: a grant issued 100 s ago with a 90 s
                // lifetime lapsed 10 s ago, while one issued 50 s ago with a 10 s lifetime lapsed
                // 40 s ago. Ordering by age alone picks the second and reports the wrong numbers.
                // Every grant here is expired, so the subtraction cannot wrap; `saturating_sub`
                // says so without depending on the reader to check.
                let g = in_scope
                    .iter()
                    .min_by_key(|g| g.elapsed(now).saturating_sub(g.lifetime))
                    .expect("in_scope is non-empty");
                Err(PermissionError::GrantExpired {
                    lifetime_s: g.lifetime.as_secs(),
                    elapsed_s: g.elapsed(now).as_secs(),
                })
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn facts(dir: &Path, name: &str, hash: &str, dest: &str) -> OperationFacts {
        OperationFacts {
            operation: OperationKind::Publish,
            dataset_name: name.into(),
            content_hash: hash.into(),
            destination: dir.join(dest),
        }
    }

    fn tmp(name: &str) -> PathBuf {
        let d = std::env::temp_dir().join("spatial-kernel-grant-tests").join(name);
        let _ = std::fs::remove_dir_all(&d);
        std::fs::create_dir_all(&d).unwrap();
        std::fs::canonicalize(&d).unwrap()
    }

    fn grant(dir: &Path, dest: DestinationScope, lifetime: Duration) -> PublishGrant {
        let _ = dir;
        PublishGrant::new(
            OperationKind::Publish,
            SourceScope { dataset_name: "parcels".into(), content_hash: "sha256:aa".into() },
            dest,
            Principal { kind: PrincipalKind::OsUser, id: "someone".into() },
            lifetime,
        )
        .unwrap()
    }

    #[test]
    fn an_empty_set_refuses_with_no_grant_rather_than_a_scope_mismatch() {
        let dir = tmp("empty");
        let set = GrantSet::new();
        assert!(matches!(
            set.find(&facts(&dir, "parcels", "sha256:aa", "out"), Instant::now()),
            Err(PermissionError::NoGrant { .. })
        ));
    }

    /// Each of the three scope predicates refuses on its own, and the message names which.
    #[test]
    fn each_scope_predicate_refuses_independently_and_says_which_one_failed() {
        let dir = tmp("scope");
        let mut set = GrantSet::new();
        set.add(grant(
            &dir,
            DestinationScope::exact(&dir.join("out")).unwrap(),
            Duration::from_secs(60),
        ))
        .unwrap();
        let now = Instant::now();

        // The happy case first, so the refusals below are not simply "everything is refused".
        assert!(set.find(&facts(&dir, "parcels", "sha256:aa", "out"), now).is_ok());

        for (f, needle) in [
            (facts(&dir, "other", "sha256:aa", "out"), "catalog name"),
            (facts(&dir, "parcels", "sha256:bb", "source hashes"), "source hashes"),
            (facts(&dir, "parcels", "sha256:aa", "elsewhere"), "resolves to"),
        ] {
            match set.find(&f, now) {
                Err(PermissionError::GrantScopeMismatch { detail }) => {
                    assert!(detail.contains(needle), "detail was {detail:?}");
                }
                other => panic!("expected a scope mismatch naming {needle:?}, got {other:?}"),
            }
        }
    }

    /// A directory-class grant covers direct children and **not** the tree beneath them.
    #[test]
    fn a_destination_class_grant_covers_direct_children_only() {
        let dir = tmp("class");
        std::fs::create_dir_all(dir.join("nested")).unwrap();
        let mut set = GrantSet::new();
        set.add(grant(
            &dir,
            DestinationScope::direct_child_of(&dir).unwrap(),
            Duration::from_secs(60),
        ))
        .unwrap();
        let now = Instant::now();

        assert!(set.find(&facts(&dir, "parcels", "sha256:aa", "out"), now).is_ok());
        assert!(set.find(&facts(&dir, "parcels", "sha256:aa", "also-fine"), now).is_ok());
        // A grandchild is outside the class: a grant for a directory is not a grant for its tree.
        assert!(matches!(
            set.find(&facts(&dir, "parcels", "sha256:aa", "nested/deep"), now),
            Err(PermissionError::GrantScopeMismatch { .. })
        ));
    }

    /// An expired grant whose scope matches reports **expiry**, not mismatch.
    #[test]
    fn expiry_is_reported_as_expiry_rather_than_as_a_scope_mismatch() {
        let dir = tmp("expired");
        let mut set = GrantSet::new();
        set.add(grant(
            &dir,
            DestinationScope::exact(&dir.join("out")).unwrap(),
            Duration::from_millis(1),
        ))
        .unwrap();
        std::thread::sleep(Duration::from_millis(5));
        match set.find(&facts(&dir, "parcels", "sha256:aa", "out"), Instant::now()) {
            Err(PermissionError::GrantExpired { lifetime_s, .. }) => assert_eq!(lifetime_s, 0),
            other => panic!("expected GrantExpired, got {other:?}"),
        }
    }

    #[test]
    fn a_lifetime_over_the_declared_ceiling_is_refused_at_issue_time() {
        let dir = tmp("ceiling");
        let e = PublishGrant::new(
            OperationKind::Publish,
            SourceScope { dataset_name: "parcels".into(), content_hash: "sha256:aa".into() },
            DestinationScope::exact(&dir.join("out")).unwrap(),
            Principal::from_environment(),
            MAX_GRANT_LIFETIME + Duration::from_secs(1),
        );
        assert!(matches!(e, Err(PermissionError::GrantLifetimeExceeded { .. })));
    }

    #[test]
    fn the_grant_ceiling_is_enforced() {
        let dir = tmp("many");
        let mut set = GrantSet::new();
        for _ in 0..MAX_GRANTS {
            set.add(grant(
                &dir,
                DestinationScope::exact(&dir.join("out")).unwrap(),
                Duration::from_secs(60),
            ))
            .unwrap();
        }
        assert!(matches!(
            set.add(grant(
                &dir,
                DestinationScope::exact(&dir.join("out")).unwrap(),
                Duration::from_secs(60)
            )),
            Err(PermissionError::GrantCeilingExceeded { .. })
        ));
    }

    /// **S1, this cut's own reviewer gate**: a long-lived `GrantSet` (`frontends/shell`'s own
    /// managed state) that never prunes hits `MAX_GRANTS` forever after 64 `prepare` calls in one
    /// session, since nothing ever removed an old, already-expired grant. `prune_expired` is the
    /// fix, called before `add` on every prepare (`publish.rs`) -- this proves the UNDERLYING
    /// property directly: many more than `MAX_GRANTS` short-lived grants, pruned between each add,
    /// never hit the ceiling.
    #[test]
    fn prune_expired_keeps_a_long_lived_set_under_the_ceiling_across_many_more_grants_than_it_holds() {
        let dir = tmp("prune-many");
        let mut set = GrantSet::new();
        let short = Duration::from_millis(1);

        for _ in 0..(MAX_GRANTS + 6) {
            std::thread::sleep(Duration::from_millis(2));
            set.prune_expired(Instant::now());
            set.add(grant(&dir, DestinationScope::exact(&dir.join("out")).unwrap(), short))
                .expect("pruning keeps the set well under MAX_GRANTS, so add must not refuse");
        }
        assert!(
            set.len() < MAX_GRANTS,
            "every earlier grant used a 1ms lifetime and 2ms elapsed before each prune; the set \
             should hold at most the handful still unexpired, got {}",
            set.len()
        );
    }

    /// The narrower unit property, independent of the ceiling: an expired grant is gone after
    /// pruning, and a still-live one is not touched.
    #[test]
    fn prune_expired_removes_only_grants_whose_lifetime_has_elapsed() {
        let dir = tmp("prune-selective");
        let mut set = GrantSet::new();
        set.add(grant(&dir, DestinationScope::exact(&dir.join("short")).unwrap(), Duration::from_millis(1)))
            .unwrap();
        set.add(grant(&dir, DestinationScope::exact(&dir.join("long")).unwrap(), Duration::from_secs(300)))
            .unwrap();
        assert_eq!(set.len(), 2);

        std::thread::sleep(Duration::from_millis(5));
        set.prune_expired(Instant::now());

        assert_eq!(set.len(), 1, "exactly the expired grant must be removed");
        // The survivor is still findable -- proving `prune_expired` did not disturb a live grant's
        // own usability, only remove the dead one.
        assert!(set.find(&facts(&dir, "parcels", "sha256:aa", "long"), Instant::now()).is_ok());
    }

    /// `remove_matching` -- the "consumed" half of pruning -- removes exactly the grant matching
    /// an attempt's own facts and leaves an unrelated one untouched, regardless of expiry.
    #[test]
    fn remove_matching_evicts_exactly_the_consumed_grant_ignoring_expiry() {
        let dir = tmp("remove-matching");
        let mut set = GrantSet::new();
        // A long-lived grant for `out` -- NOT expired, but about to be "consumed".
        set.add(grant(&dir, DestinationScope::exact(&dir.join("out")).unwrap(), Duration::from_secs(300)))
            .unwrap();
        // An unrelated grant for a different destination -- must survive.
        set.add(grant(&dir, DestinationScope::exact(&dir.join("other")).unwrap(), Duration::from_secs(300)))
            .unwrap();
        assert_eq!(set.len(), 2);

        let consumed = OperationFacts {
            operation: OperationKind::Publish,
            dataset_name: "parcels".into(),
            content_hash: "sha256:aa".into(),
            destination: dir.join("out"),
        };
        assert!(set.remove_matching(&consumed), "the matching grant must be reported as removed");
        assert_eq!(set.len(), 1, "exactly the consumed grant is gone");
        assert!(
            set.find(&facts(&dir, "parcels", "sha256:aa", "other"), Instant::now()).is_ok(),
            "the unrelated grant must be untouched"
        );

        // A second call against the same (now-gone) facts finds nothing to remove -- not an error.
        assert!(!set.remove_matching(&consumed));
    }

    /// **S1's own end-to-end shape**: many more publish attempts than `MAX_GRANTS`, each one
    /// minted then immediately consumed (mirroring `execute_with_progress`'s own
    /// `remove_matching` call after a terminal outcome) -- the set never grows past what is
    /// momentarily live, so the 65th (or 700th) never refuses.
    #[test]
    fn a_grant_removed_the_instant_its_attempt_is_consumed_never_grows_the_set_across_many_more_than_the_ceiling() {
        let dir = tmp("consume-many");
        let mut set = GrantSet::new();

        for i in 0..(MAX_GRANTS * 10) {
            let dest = dir.join(format!("out-{i}"));
            set.add(grant(&dir, DestinationScope::exact(&dest).unwrap(), Duration::from_secs(300)))
                .unwrap_or_else(|e| panic!("prepare #{i} refused despite immediate consumption: {e}"));
            let facts = OperationFacts {
                operation: OperationKind::Publish,
                dataset_name: "parcels".into(),
                content_hash: "sha256:aa".into(),
                destination: dest,
            };
            assert!(set.remove_matching(&facts), "consumption #{i} found nothing to remove");
            assert_eq!(set.len(), 0, "the set must be empty again after each consumption, iteration {i}");
        }
    }

    /// A `{:?}` on a grant must not print a raw filesystem path (`docs/09`).
    #[test]
    fn debug_prints_a_normalized_destination_and_never_a_raw_path() {
        let dir = tmp("debug");
        let g = grant(
            &dir,
            DestinationScope::exact(&dir.join("out")).unwrap(),
            Duration::from_secs(60),
        );
        let rendered = format!("{g:?}");
        // The temp directory is under a user-profile root on both reference platforms, so the
        // normalized form must not contain the raw prefix that `normalize_destination` replaces.
        assert!(
            !rendered.contains("\\\\?\\"),
            "a verbatim prefix reached a Debug rendering: {rendered}"
        );
        assert!(rendered.contains("out"), "the destination is not identifiable at all: {rendered}");
    }
}
