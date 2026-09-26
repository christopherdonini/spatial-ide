# `data-plane-origin-non-ascii`: a stated `Origin` that is not visible ASCII is refused as a foreign origin — preregistration

## Header

- **Authority.** PLAN node `data-plane-origin-non-ascii`; RULED 2026-09-26 — question round 24, item 1 (A1-1 an S1 cut, run now in parallel with the watcher on disjoint files, full gate).
- **Evidence (not Authority).** `state/cloud/wave1/A1.md`, Finding A1-1 and its custodian fields (the Windows reproduction). The reproducer that finding names lives on branch `cloud/wave1-A1`, a branch commit not on `main`; nothing merges from that branch, and this piece writes its own test file.
- **Drafted by** the architect agent on the custodian's brief of 2026-09-26, read-only (no command run), from the files named in §0, read at `main` `4d0e727`.
- **Reference form.** Code by symbol, documents by section, the ledger by round and item. No line cites; a gate that needs a line pins it at a commit on `main`.
- **Committed before any code.** Append-only once committed; an amendment written after any outcome has been seen says so in its first line.
- **Branch.** `cut/data-plane-origin-non-ascii`, from `main`. Disjoint from the watcher's files.
- **Gating.** Full (`AUTONOMY.md` §21a): security posture governed by ADR-020, and a stated guarantee under test (docs/09 "Local listening sockets"; `Session::request_allowed`'s doc).

## §0. Disclosure

- **Read:** ADR-020 (Status, Decision, Consequences, Amendment 1 (c)); docs/09 "Local listening sockets"; `AUTONOMY.md` §21a–§21c; `docs/PREREGISTRATION-TEMPLATE.md`; `PRECEDENTS.md` (no precedent on header encoding or admission fixes; P-013 and P-015 apply as stated in §1); `protocol/data-plane/README.md` (its admission summary already states exact match and needs no edit).
- **Code read:** `protocol/data-plane/src/server.rs` (`upgrade`), `protocol/data-plane/src/session.rs` (`Session::request_allowed`, `token_from_offers`, `token_matches`, and the `tests` module), `protocol/data-plane/tests/candidate_a.rs` (`connect_with`, `credentials_and_origins_are_enforced_on_the_data_channel`), `kernel/tests/skp_admission.rs` (`connect` and the two declared-origin tests), `protocol/data-plane/Cargo.toml` (`tokio-tungstenite` is already a dev-dependency), and the root `Cargo.toml`'s `exclude` list.
- **Pinned versions read from `Cargo.lock`:** `http` 1.5.0, `axum` 0.8.9, `tokio-tungstenite` 0.29.0, `tungstenite` 0.29.0. Every statement below about how these crates behave is a hypothesis (§5, H1–H3), not a claim.
- **The defect (paraphrase of Finding A1-1).** `upgrade` reads `Origin` with `.and_then(|v| v.to_str().ok())`, so a present header that `to_str` refuses becomes `None`. `request_allowed`'s `None` arm, which exists for an absent header, then admits on `sec-fetch-site: same-origin`. The reproduction presented a valid token every time, so the token barrier held.
- **Same pattern, out of scope:** `protocol/transport-bakeoff`'s `check` fn. That crate is excluded from the workspace as ADR-012 decision evidence pinned to measured trees (the root `Cargo.toml`'s `exclude` comment). The spike harness under `spikes/adr-003-crs-rendering` is also not touched.
- No pilot, corpus or measurement. The 5 GB fixture is not read.

## §1. What this preregistration may and may not claim

- **May claim, once §4 passes:**
  - A present `Origin` whose bytes are not all visible ASCII is refused with the same response as a stated foreign ASCII origin (403, body `origin`), before the token check, both with and without a host-declared `expected_origin`.
  - An absent `Origin` with `sec-fetch-site: same-origin` and a valid token is still admitted.
- **May not claim:**
  - Anything about exploitability beyond Finding A1-1's own bound.
  - Anything about the token's strength, or about repeated `Origin` headers (`HeaderMap::get` reads the first; unchanged, not tested).
  - Anything about `transport-bakeoff` or the spikes.
  - Any performance number or docs/08 row.
- **No wire change** (SKP, MCP, data-plane frames). **No new user-visible or operator-visible string.**
- **No operation-class change** (ADR-006): this is an admission refusal before any operation exists.
- **ADRs cited, none edited:** ADR-020 (Accepted). ADR-012 is not cited as authority (it is Proposed). docs/09 is not edited: its text already states exact-match validation, and the code now conforms to it.
- **No scope change** on the ruling (P-015). No change to security posture beyond restoring ADR-020's Decision (P-013, ruled by round 24, item 1).

## §2. The change, stated before it is applied

**`protocol/data-plane/src/server.rs`, `upgrade` (the fix).** The `Origin` read distinguishes three states:
- the header is absent → `None`, exactly as today;
- the header is present and `to_str` accepts it → `Some(&str)`, exactly as today;
- the header is present and `to_str` refuses it → the handler returns `(StatusCode::FORBIDDEN, "origin").into_response()` immediately. That is the same status and body `request_allowed`'s refusal produces, and it comes before the credential check. It is never mapped to `None`, a sentinel, or a transformed string.

A comment at the site states the reason by section cite (ADR-020 Decision; docs/09 "Local listening sockets"), with no line cites.

Shape, not text:
```rust
let origin = match headers.get("origin") {
    None => None,
    Some(v) => match v.to_str() {
        Ok(o) => Some(o),
        Err(_) => return (StatusCode::FORBIDDEN, "origin").into_response(),
    },
};
```

**`protocol/data-plane/src/session.rs`: doc only.** `request_allowed`'s doc gains at most two sentences: `None` means the header is absent, and a caller never passes `None` for a present header it cannot read (`server::upgrade` refuses that case itself). The body, the signature and the `tests` module stay byte-identical.

**`protocol/data-plane/tests/origin_header_encoding.rs`: new.** It holds §4's five tests. It uses the real `spatial_data_plane::serve` over a loopback socket with a `tokio_tungstenite` client, the shape `skp_admission.rs::connect` and `candidate_a.rs::connect_with` already use.

The shared helper sends:
- the `Origin` bytes via `HeaderValue::from_bytes` (or no `Origin` at all);
- `sec-fetch-site: same-origin`;
- a valid `tok.` credential beside `SUBPROTOCOL`.

It returns `Ok(())` on an admitted upgrade and `Err(status)` on `tungstenite::Error::Http(resp)`. **Any other error panics**, so a client-side failure can never pass as a refusal.

**Unchanged by construction:**
- the `sec-fetch-site` read;
- the fallback for a truly absent `Origin` (`request_allowed`'s `None` arm);
- the `null` refusal, the exact-match comparison and the token path.

**Seams.**

| Seam | Actual interface on `main` | Proof from the real shape |
|---|---|---|
| WebSocket client → `upgrade` | axum 0.8.9 `HeaderMap` + `WebSocketUpgrade`; 403 `origin` / 401 `credential` | §4's T1–T5 over a real socket |
| `upgrade` → `Session::request_allowed` | `(Option<&str>, Option<&str>) -> bool`, unchanged | existing `session.rs` unit tests; T1, T5 |

No `pub` item, option or code path is added. The caller rule is not engaged.

## §3. Fixtures: outcomes declared in advance

No fixture files: every input is a byte literal in the test file. Every row sends `sec-fetch-site: same-origin` and a valid token. "Admitted" means the upgrade succeeds.

| Row | `expected_origin` | `Origin` bytes | Before the fix | After the fix |
|---|---|---|---|---|
| F1 | `None` (port-derived) | `http://evil.example` (ASCII) | 403 | 403 |
| F2 | `None` | `http://evil.example` + `0xFF` | admitted (observed in Finding A1-1, cloud and Windows) | 403 |
| F3 | `None` | `http://évil.example`, `é` as UTF-8 `0xC3 0xA9` | admitted (predicted) | 403 |
| F4a | `Some("http://localhost:5180")` | `http://evil.example` + `0xFF` | admitted (observed in Finding A1-1) | 403 |
| F4b | `Some("http://localhost:5180")` | `http://localhost:5180` + `0xFF` | admitted (predicted) | 403 |
| F5 | `None` | absent (no `Origin` header) | admitted (predicted) | admitted |

## §4. Tests, one mutation per new test

All five tests are in `protocol/data-plane/tests/origin_header_encoding.rs`. Each refusal is asserted as `Err(403)`, never as `is_err()` alone. Each mutation is performed once on the branch, observed to fail the named test, and reverted. Each is recorded in this section and verified mechanically by `verify-mutation` as a pre-gate self-check.

- **T1** `a_stated_foreign_ascii_origin_with_a_same_origin_claim_is_refused_as_an_origin` (F1, the control). Mutation: `request_allowed`'s `Some(o)` arm also admits when `sec_fetch_site == Some("same-origin")`.
- **T2** `a_stated_origin_with_a_non_utf8_byte_is_refused_as_a_foreign_origin` (F2). Mutation: the new refusal arm fires only when the value is valid UTF-8; a non-UTF-8 value is read as `None`. T2 fails and T3 passes.
- **T3** `a_stated_origin_with_a_utf8_non_ascii_character_is_refused_as_a_foreign_origin` (F3). Mutation: the new refusal arm fires only when the value is not valid UTF-8; a valid-UTF-8 non-ASCII value is read as `None`. T3 fails and T2 passes.
- **T4** `a_stated_non_ascii_origin_is_refused_under_a_host_declared_expected_origin` (F4a and F4b in one test). Mutation: the fix reverted, i.e. the `Origin` read restored to `.and_then(|v| v.to_str().ok())`.
- **T5** `an_absent_origin_with_a_same_origin_claim_is_still_admitted` (F5). Mutation: `upgrade` returns 403 whenever the `Origin` header is absent.

**Existing tests, unchanged and green:**
- the `session.rs` `tests` module, including `origin_null_and_foreign_are_explicitly_rejected`, `absent_origin_needs_a_positive_same_origin_signal` and `with_origin_admits_a_declared_non_same_origin_consumer_and_nothing_else`;
- `candidate_a.rs`'s `credentials_and_origins_are_enforced_on_the_data_channel`;
- `kernel/tests/skp_admission.rs`'s `a_declared_webview_origin_is_admitted_and_the_port_derived_default_no_longer_authenticates_it` and `a_declared_origin_with_a_wrong_token_is_refused_as_a_credential_rejection`.

**Test-first run.** Before the fix, on the uncommitted working tree, T2, T3 and T4 fail (admitted) while T1 and T5 pass. The fix and the tests then land in one commit.

## §5. Hypotheses · predictions · declared unchanged · invalidators · falsification

**Hypotheses** (each names its pinned version; round 15 (c)):
- **H1.** In `http` 1.5.0, `HeaderValue::to_str` refuses any value holding a byte outside visible ASCII, so both F2's and F3's values take its `Err` arm. Discriminator: the test-first run of T2 and T3.
- **H2.** `tungstenite` 0.29.0's client, and the server's pinned HTTP/1 parser (its version read from `Cargo.lock` by the worker), carry F2's–F4b's bytes unchanged into `upgrade`'s `HeaderMap`. Discriminator: the test-first run admits F3 and F4b, as Finding A1-1 already observed for F2 and F4a.
- **H3.** In `http` 1.5.0, `HeaderValue::from_bytes` accepts bytes `0x80`–`0xFF`. Discriminator: the tests construct their requests without panicking.

**Predictions.** §3's two outcome columns; the test-first run in §4; all existing tests green after the fix. A wrong prediction is a class-2 result, never edited.

**Declared unchanged:**
- `Session::request_allowed`'s signature and body, the exact-match comparison and the `null` refusal;
- the `sec-fetch-site: same-origin` fallback for an absent `Origin` (proved by T5), and the `sec-fetch-site` read;
- the token check (`token_from_offers`, `token_matches`, 401 `credential`) and its order after the origin check;
- the 403 status and `origin` body;
- `DataPlaneConfig`, `Session::new`, `Session::with_origin`, and every `pub` signature;
- the wire: `wire.rs`, the frames, `SUBPROTOCOL`, `TOKEN_PREFIX`, SKP, MCP;
- `protocol/transport-bakeoff`, `spikes/`, `frontends/`, `kernel/`, docs/09, every ADR, and the data-plane `README.md`.

**Invalidators** (the piece stops and returns to the architect; a posture question goes to the human):
- H2 false for any row: the test would not reach `upgrade`, so it proves nothing.
- The fix needs a `pub` signature change, a new `pub` item, a new dependency, or an edit to any existing test.
- Any existing admission test changes outcome.
- The fix needs a docs/09 or ADR-020 text change.

**Falsification:** after the fix, some present `Origin` not in visible ASCII is admitted under either `expected_origin` mode, or F5 is refused.

## §6. Instruments

Assertions only: the HTTP status of the upgrade response, or an admitted upgrade. No measurement, no docs/08 figure, no counter or accessor.

## §7. Declared values and ceilings

- No new constant.
- **Line budget:** at most 200 insertions plus deletions over non-generated code and tests, counted by §21c's rule (this preregistration excluded).
- **File ceiling:** 3 code and test files: `server.rs`, `session.rs` (doc only), and `tests/origin_header_encoding.rs`. Beyond those, only this preregistration and the custodian's `PLAN.yaml` and generated set.
- **Time:** PLAN `budget_minutes` 120.

## §8. Block-on-sight (each checked separately)

1. A present `Origin` header reaching `request_allowed` as `None` on any path.
2. A refusal of a non-visible-ASCII `Origin` with any status or body other than 403 `origin`, or one decided after the token check.
3. Admission reached by transforming the value: lossy or percent decoding, IDNA/punycode, trimming, case folding, or prefix comparison.
4. Any change to `request_allowed`'s body or signature, its unit tests, the exact-match comparison, the `null` refusal, or the absent-`Origin` fallback.
5. Any change to the token path or to its order after the origin check.
6. A refusal assertion by `is_err()` alone, or a helper that counts a non-HTTP error as a refusal.
7. A test written against an imagined client instead of the real `serve` over a real socket (the seam rule).
8. Any diff outside §7's files, including `wire.rs`, SKP, MCP, `transport-bakeoff`, `spikes/`, `frontends/`, `kernel/`, docs/09 and any ADR.
9. Any change to `Cargo.toml` or `Cargo.lock`, or a new dependency.
10. A new `pub` item, option or code path with no product caller.
11. A new user-visible or operator-visible string.
12. Any edit to an existing test.
13. A bare line cite in a code comment or in this record; any performance claim; any exploitability claim beyond Finding A1-1's bound.

## §9. Gates

- **Architect** (full gating, §21a): §8 item by item; ADR-020 Decision and docs/09 "Local listening sockets"; the seam table in §2; the caller rule; every discharge claim resolved.
- **Reviewer:**
  - the full diff;
  - `git diff --stat origin/main...HEAD` shows only §7's files;
  - each test's 403 assertion and helper panic arm;
  - each §4 mutation's recorded run;
  - every discharge claim resolved;
  - any hash recomputed.
- **Suites, green before either gate, each result naming its commit:**
  - `cargo test -p spatial-data-plane` and `cargo test -p spatial-kernel`;
  - `cargo fmt --check`, and `cargo clippy -p spatial-data-plane --all-targets` as CI runs it;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`;
  - `verify-quotes.mjs` (a floor), `verify-cites.mjs` and `verify-test-claims.mjs`;
  - `verify-mutation.mjs --base origin/main --head HEAD` (all five new tests named);
  - `verify.mjs --offline`.
- **E2E: none.** §4's tests are the end-to-end proof from the real shape: the real `serve`, a real loopback socket, a real WebSocket client. The shell's webview origins are ASCII, and their admission path is byte-identical (declared unchanged, covered by `skp_admission.rs`). No `pub` item changes, and no visible behaviour changes.
- **Operator:** none. No walkthrough row, no felt verdict.
- **Merge:** independent of the watcher (disjoint files). `data-plane-stream-registry-bound` follows this piece.

## §10. Amendments

*(Opens empty; append-only. Results are recorded in the closing amendment as references and hashes only, per the record cap.)*
