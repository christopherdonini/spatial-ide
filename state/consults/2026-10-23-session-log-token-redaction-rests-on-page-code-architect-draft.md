*Custodian's filing note (2026-10-23): the form for `session-log-token-redaction-rests-on-page-code`, drafted ahead by the architect, read only at main b5ac52e9 (main moved after it only in records). The run 09:28:17Z to 09:38:58Z by its transcript (Grep 37, Glob 4, Read 32; no Write, Edit or Bash). Nothing is committed from it before the human answers OPEN-1 (a dev-dependency feature, a red line), OPEN-2 and OPEN-3; OPEN-4 is the custodian's under rule (00) and is taken as (a), recorded on the node. It is re-swept and re-pinned at its base. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is e886e1f94b7b6b4494c4819dc638dd0cf76a713041b1f466183900bb28fe4edd.*

---

Drafted: session-log-token-redaction-rests-on-page-code, at main b5ac52e9

Reviewed: main @ b5ac52e9 (short id as briefed; I have no shell, so I could not resolve the full id or compute any sha256. Every cite below is a line read in the main checkout at b5ac52e9 and carries no hash.)
Verdict: none. This is a draft form, not a gate.

---

# Session-log token redaction: `binding_log_session_event` runs `Session::redact` (full form)

## Header

- **Authority:**
  - the human's item 2 in `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:10 @ b5ac52e9`, graded S2;
  - PLAN node `session-log-token-redaction-rests-on-page-code`;
  - the custodian's call under rule (00), recorded in that directive's RULED block in `DECISIONS-PENDING.md` and cited by directive, not by line: after 1c's src-tauri group merges, not inside 1c.
- **The human's words for the change and the test.** Two sub-line spans of the directive's line 10, byte-copied from my Read, not by script: "binding_log_session_event runs Session::redact on the text before it appends" and "a test shows a token in the page's text never reaches the log".
- **Drafted by** the architect, read only at main b5ac52e9, on the custodian's brief. It is re-swept at its base.
- **Committed before any code.** Append-only once committed.
- **Proposed path:** `frontends/shell/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md`.

## §0. Disclosure

- **Input:** candidate 2 of the boundary inventory (`state/consults/2026-10-16-boundary-inventory-architect.md:26 @ b5ac52e9`). That consult was read at b88b1d2f, and every fact it states that this form relies on was read again at b5ac52e9 (§2).
- **Reuse index:** a miss. The private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c answered both queries (`session log token redaction`; `secret scrubbing before logging`) with "No prior art recorded for" the query. The in-tree prior art is `Session::redact` itself (`protocol/data-plane/src/session.rs:125-127 @ b5ac52e9`).
- **The known limit of the technique:** exact-substring replacement catches only the exact text. That limit is stated in §1 and in the comments below.
- **Not read:** tauri 2.11.5's `test` module (`frontends/shell/src-tauri/Cargo.lock:4476-4477 @ b5ac52e9`). See OPEN-1 and the dispatch checks.

## §1. What this may and may not claim

- **May claim:**
  - every occurrence of the session token's exact text in the page's `level` and `message` is replaced by `<redacted>` before the binding appends;
  - the token in the form the page holds it (`tok.<hex>`, from `binding_data_plane_attach`) is written as `tok.<redacted>`.
- **May not claim:**
  - that the session log can never hold the token. The origin self-check's lines (OPEN-2) are not redacted, and neither is text that holds the token in another form (another case, another encoding, split across calls, or truncated);
  - any performance number or docs/08 row;
  - any wire change;
  - any change to an ADR.
- **ADRs cited:** ADR-020 (`docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:74-81 @ b5ac52e9`: the token is the only barrier against local processes, and ADR-020 touches origin admission only). None is amended.
- **`kernel/PERMISSION-BOUNDARY.md`** says nothing about the session token. Its one match for "token" is about path normalization (`kernel/PERMISSION-BOUNDARY.md:277 @ b5ac52e9`).

## Which form, and why

The full form, with full gating:

- **§21b is closed.** The single-gate route is for "docs, tests, and polish" only (`AUTONOMY.md:334-343 @ b5ac52e9`), and this piece changes the product behaviour of a binding.
- **§21a's guarantee head is engaged.** `frontends/shell/src-tauri/src/state.rs:22-23 @ b5ac52e9` states an invariant ("never written here") that this piece makes true by code for the page's lines. `Session::redact`'s property is under test (`protocol/data-plane/src/session.rs:213-220 @ b5ac52e9`), and this piece gives it its first product caller (`AUTONOMY.md:325-327 @ b5ac52e9`).
- **§21a's security head, by its letter, is not engaged.** It names "anything ADR-020 (config/origin), ADR-009 ... or ADR-021 ... governs" (`AUTONOMY.md:321-322 @ b5ac52e9`), and ADR-020 excludes authentication (`ADR-020…md:81 @ b5ac52e9`). The substance is still credential leakage, which `docs/09_Security_and_Privacy.md:27 @ b5ac52e9` lists among the threats designed for. I recommend the form record security as touched. Under round 25, item 2 (e) (`docs/PREREGISTRATION-TEMPLATE.md:176 @ b5ac52e9`), an Out-of-scope line that does not assert all four categories untouched already forces the full form, so a five-line form here would be a gate failure by name.
- **Size:** within §21c (§7), which does not change the route.
- **The S2 grade is a priority, not a form shape:** the 2026-10-05 direction defines S1 at `state/directives/2026-10-05-product-first-direction.md:21 @ b5ac52e9`.
- **Red lines (`AI_DEVELOPMENT.md:451-454 @ b5ac52e9`):**
  - "dependency changes" covers OPEN-1 (a);
  - "scope changes to a ruled item" covers OPEN-2 and OPEN-3;
  - each needs the human's typed answer.

## §2. The change

**The interface it is written against (read at b5ac52e9):**
- `Session::redact(&self, s: &str) -> String` is `s.replace(&self.token, REDACTED)` (`protocol/data-plane/src/session.rs:125-127 @ b5ac52e9`).
- `REDACTED` is `"<redacted>"` (`protocol/data-plane/src/session.rs:44-45 @ b5ac52e9`).
- `Session` is `Clone` and re-exported (`protocol/data-plane/src/session.rs:53-60 @ b5ac52e9`, `protocol/data-plane/src/lib.rs:54 @ b5ac52e9`).
- `RunningDataPlane::session` is `pub` (`protocol/data-plane/src/server.rs:250-259 @ b5ac52e9`).
- The shell depends on the crate by path (`frontends/shell/src-tauri/Cargo.toml:72 @ b5ac52e9`).
- **No edit under `protocol/` is needed.** 1c also declares `protocol/data-plane` unchanged (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:677 @ b5ac52e9`).

**Before:**
- The binding is `state.append(&level, &message)` (`frontends/shell/src-tauri/src/commands.rs:183-186 @ b5ac52e9`).
- `append` writes `<unix-ms> <level> <message, \n escaped>` and one LF (`frontends/shell/src-tauri/src/state.rs:49-61 @ b5ac52e9`).
- Both strings are the page's, as given: `logSessionEvent` sends `{ level, message }` (`frontends/shell/src/diagnostics/log.ts:20-22 @ b5ac52e9`).
- **Page callers.** About forty call sites send:
  - fixed text;
  - handles and dataset ids;
  - kernel terminal details and refusal messages;
  - the global handlers' error stack or string form (`frontends/shell/src/diagnostics/errorHandlers.ts:35-40 @ b5ac52e9`, `frontends/shell/src/diagnostics/errorHandlers.ts:58-68 @ b5ac52e9`).
- No caller composes the credential into its text. The page's only use of it is `new WebSocket(opts.url, opts.subprotocols)` (`frontends/shell/src/streaming/adapterWs.ts:39 @ b5ac52e9`). An error's text is whatever the error carries.
- The shell holds the token only as a string (`frontends/shell/src-tauri/src/state.rs:13-16 @ b5ac52e9`, built at `frontends/shell/src-tauri/src/lib.rs:443-446 @ b5ac52e9`). No `Session` is in managed state, so `Session::redact` has only its own test as a caller.

**After:**
1. **`state.rs`:** `DataPlaneHandle { port: u16, session: spatial_data_plane::Session }` replaces the `token: String` field. The token is then held once, not copied a second time.
2. **`lib.rs`:** the handle is built with `session: running.session.clone()`, one line before `Box::leak` (`frontends/shell/src-tauri/src/lib.rs:534 @ b5ac52e9`). Nothing else in `lib.rs` changes.
3. **`commands.rs`, `binding_data_plane_attach`:** formats `tok.{}` from `state.session.token_for_delivery()`. The returned shape is byte-identical.
4. **`commands.rs`, `binding_log_session_event`:** takes `State<'_, DataPlaneHandle>` beside `State<'_, SessionLog>`, and its body is `log.append(&session.redact(&level), &session.redact(&message))` (OPEN-3). The page's IPC arguments do not change, because State parameters are not read from the payload. The binding still returns `()` and never fails.
5. **Unchanged:**
   - `SessionLog::append` and its line format;
   - every host-composed line: `lib.rs`'s self-check and startup lines, and `pool_poll.rs`'s lines at `frontends/shell/src-tauri/src/pool_poll.rs:223 @ b5ac52e9` and `:260 @ b5ac52e9`;
   - `lib.rs:546`'s registration;
   - all page code.
6. **Behaviour.** A page line holding `tok.<64 hex>` is written as `tok.<redacted>`. A page line without the token is written byte for byte as before.

**Other checks:**
- **ADR-006:** no operation is added and no class changes.
- **docs/02:** the binding gains no branching, and it calls the data plane's own redaction rather than a second one.
- **docs/10:** delivery of the credential stays on the control plane.
- **Portability:** nothing OS-dependent changes, so no R3 item is needed (`docs/PREREGISTRATION-TEMPLATE.md:177 @ b5ac52e9`). The test runs where `product-ci-shell` runs (`.github/workflows/product-ci-shell.yml:170 @ b5ac52e9`, `:217 @ b5ac52e9`).

**Comments, with the words to apply.** None of these is the human's wording. The worker applies the words below and the PR body lists them.

- **`frontends/shell/src-tauri/src/state.rs:22-23 @ b5ac52e9`** is untrue today: the type receives the page's lines, and the page holds the token. Replacement:
  > The session token does not reach this file through the page's lines: `binding_log_session_event` (`commands.rs`) passes the page's `level` and `message` through the data plane's `Session::redact`, which replaces every occurrence of the token's exact text with `<redacted>`, before it calls `append`. The host's own lines are composed in this crate and take no token, with one exception that ordinary use does not reach: the origin self-check (`lib.rs`, `on_page_load`) writes the main window's actual origin, or its whole URL when that URL has no host, unredacted, so a page script that navigates the main window to an address holding the token puts it here. Text holding the token in any other form (another case, another encoding, split across calls) is not redacted.

  Clause check:
  - **"passes ... through Session::redact ... before it calls append":** §2 item 4.
  - **"every occurrence of the token's exact text":** `str::replace` replaces all non-overlapping occurrences (`session.rs:126 @ b5ac52e9`).
  - **"host's own lines ... take no token":** I read every other caller of `append`:
    - `lib.rs:92 @ b5ac52e9` (refusal messages built from config, before the session exists);
    - `lib.rs:234-237 @ b5ac52e9` (pinned origin);
    - `lib.rs:417 @ b5ac52e9` (config origin);
    - `pool_poll.rs:223 @ b5ac52e9` and `:260 @ b5ac52e9` (counts and reasons).
  - **"the exception":**
    - MISMATCH logs `actual` (`lib.rs:239-244 @ b5ac52e9`);
    - UNVERIFIABLE logs the error (`lib.rs:254-265 @ b5ac52e9`), and the `NoHost` Display includes the URL (`frontends/shell/src-tauri/src/origin.rs:92-94 @ b5ac52e9`);
    - page script can navigate the window, as `lib.rs:161-171 @ b5ac52e9` already states.
  - **"ordinary use does not reach":** the page's only use of the credential is a WebSocket, not a navigation (`adapterWs.ts:39 @ b5ac52e9`). This case needs page script, not ordinary use, so it is named here and does not block.
  - **"any other form":** follows from exact replacement.

- **`frontends/shell/src-tauri/src/commands.rs:179-182 @ b5ac52e9`:** keep the four lines, including "free text ... not a closed enum", which `frontends/shell/src-tauri/src/pool_poll.rs:64-69 @ b5ac52e9` paraphrases, so that paraphrase stays true. Append:
  > Both `level` and `message` are the page's text, and each passes through the data plane's `Session::redact` before `SessionLog::append`: every occurrence of the session token's exact text becomes `<redacted>`, so a page line carrying the credential `binding_data_plane_attach` hands out (`tok.<hex>`) is written as `tok.<redacted>`. The token in any other form is not caught (`SessionLog`'s doc).

  Clause check:
  - attach formats `tok.{}` (`commands.rs:174 @ b5ac52e9`), and §2 item 3 keeps it;
  - `REDACTED` is `"<redacted>"` (`session.rs:45 @ b5ac52e9`).

- **The new `DataPlaneHandle.session` field doc:**
  > The data plane's own session (`RunningDataPlane::session`, cloned at startup): its token is what `binding_data_plane_attach` hands out and what `binding_log_session_event` redacts.

  Clause check: §2 items 2 to 4.

**Not edited, and why:**
- **`frontends/shell/src-tauri/src/state.rs:10-12 @ b5ac52e9`** stays true. It describes how delivery is designed.
- **`protocol/data-plane/src/session.rs:55-56 @ b5ac52e9`** ("never logged") is under `protocol/`, out of this piece. It describes that crate's code.
- **`docs/09_Security_and_Privacy.md:27 @ b5ac52e9`** is a design statement in the constitution. After this piece it holds for the page's lines, but not for OPEN-2's lines.
- **The module doc's "call one `SkpHost`/state method" (`commands.rs:14-17 @ b5ac52e9`)** is already not literally true for `binding_publish_prepare` (`commands.rs:284-379 @ b5ac52e9`). This binding goes from one call to three, with no branching. I recommend no edit here; a docs-lane candidate if wanted.

**P6:** no string the app shows changes. The console's effect text for this binding stays true: it writes one line (`frontends/shell/src/console/surfaceRegistry.ts:105-112 @ b5ac52e9`).

**KNOWN-LIMITATIONS:** none. In ordinary use the page never sends the token, the remaining route needs page script, and nothing the user sees changes.

## §3. Fixtures

None. Each test builds a real `Session` (`Session::with_origin`) and a real `SessionLog::open` in its own fresh temp directory, following the precedent at `frontends/shell/src-tauri/src/publish.rs:1653 @ b5ac52e9`. A directory per test is needed because the file name has one-second resolution (`state.rs:32-36 @ b5ac52e9`).

## §4. Tests, and one mutation per new test

Both tests go in a new `#[cfg(test)] mod tests` in `commands.rs`, which is private to the crate (`lib.rs:18 @ b5ac52e9`), run through the real IPC under OPEN-1 (a). The mock app registers:
- `binding_data_plane_attach` and `binding_log_session_event`;
- the managed `SessionLog` and `DataPlaneHandle`.

Each test:
1. invokes the attach command and takes `subprotocols[1]`, the page's real value;
2. asserts that value equals `"tok." + session.token_for_delivery()`;
3. invokes the log command with the page's argument names `{ level, message }` (`log.ts:22 @ b5ac52e9`);
4. reads the file.

| Test | Asserts | Mutation |
|---|---|---|
| K-1 `a_token_in_the_pages_message_never_reaches_the_session_log` | `!session.leaks_into(text)`; the one line holds the message's other words around `tok.<redacted>`; one line | the binding appends `message` as given |
| K-2 `a_token_in_the_pages_level_never_reaches_the_session_log` | the same for `level` | the binding appends `level` as given |

- **How a mutation is observed:** apply it, run the named test, record its failure by name with its commit, and revert it (round 25, item 2 (c)). No `verify-mutation` run is called an observation.
- **No existing test is edited.**

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions:**
- **P1:** K-1 and K-2 pass, and each fails alone under its mutation.
- **P2:** under OPEN-1 (a), `frontends/shell/src-tauri/Cargo.lock` is byte-identical and `cargo test --locked` passes.
- **P3:** every existing src-tauri test and `npm run verify` pass unedited.
- **P4:** §7 holds.
- A wrong P1 to P3 is class 2. A wrong P4 is class 8.

**Declared unchanged:**
- `protocol/**`;
- all of `frontends/shell/src/**`;
- `SessionLog::append`;
- every host-composed log line;
- the attach response's bytes;
- the command list at `lib.rs:538-558 @ b5ac52e9`;
- `tauri.conf.json` and the capabilities;
- every e2e suite's outcomes.

**Invalidators (stop and report):**
- **I1:** a pinned interface differs at the base. That covers §2's data-plane items, `DataPlaneHandle`'s fields and its one construction site, `log.ts`'s arguments, and attach's shape.
- **I2:** a lockfile change or a new package.
- **I3:** an existing test needs an edit.
- **I4:** any edit under `protocol/`.
- **I5:** a 1c step, or any other in-flight piece, has `commands.rs`, `lib.rs`, `state.rs` or `src-tauri/Cargo.toml` in its paths at dispatch.
- **I6:** the mock runtime cannot invoke an app command without a capability or config edit.

**Falsification:**
- the token as the page holds it is not the substring `Session::redact` replaces; or
- the mock IPC decodes arguments differently from the page's IPC.

## §6. Instruments

Assertions only: byte absence and presence, and the line count. No measurement.

## §7. Declared values and ceilings

- **No new constant.** The redaction literal is the data plane's `REDACTED`.
- **Budget:**
  - under OPEN-1 (a): at most 180 changed lines over at most 4 files (`commands.rs`, `state.rs`, `lib.rs`, `src-tauri/Cargo.toml`);
  - under (b): at most 160 lines over 3 files.
- **Counting command:** `git diff --numstat B...H -- . ':!frontends/shell/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**' ':!frontends/shell/src-tauri/Cargo.lock'`, at a named commit.
- **An overrun is class 8**, and §7 is never edited.
- **Estimate:** commands.rs 10 plus tests 90, state.rs 12, lib.rs 1, Cargo.toml 4. About 117 lines.

## §8. Block-on-sight

1. An edit under `protocol/`.
2. A claim that the session log can never hold the token, or that every line is redacted (§1; OPEN-2).
3. A second copy of the token held, printed or logged.
4. Page code changed.
5. A new dependency, a lockfile change, or a feature added to a non-dev dependency.
6. A test that writes the page's credential by hand instead of taking it from `binding_data_plane_attach`'s response (an imagined interface).
7. A `pub` item without a product caller, `allow(dead_code)`, or a new `cfg` in product code.
8. A string the app shows changed.
9. The round-25 items, by name:
   - an overrun not recorded as class 8, or §7 edited;
   - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
   - a `verify-mutation` run called an observation;
   - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
   - a five-line form.
10. Quotation marks around text that is not byte-identical. A line cite into the ledger. A bare self-line. A pin read as current.

## §9. Gates

**Architect** (full gating):
- §8, item by item;
- the seam rule on:
  - attach's credential → the binding;
  - the binding → `SessionLog`;
  - the shell → `spatial_data_plane::Session`, by its actual interface at the base;
- the caller rule: `DataPlaneHandle.session` has two product callers, and `Session::redact` gains its first;
- each comment's clauses, against the code;
- docs/01, 02 and 10;
- round 25.

**Reviewer:**
- the full diff, `origin/main...HEAD`;
- both mutations made again;
- §7 by its command;
- an empty `Cargo.lock` diff;
- fmt and clippy.

**Suites:**
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`, `cargo fmt --check` and clippy;
- `npm run verify`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI.

**E2E:** none run.
- No page code, wire or line format changes.
- The one suite that reads the session log reads tile-mint lines that hold no token (`frontends/shell/e2e/regression.mjs:2026-2059 @ b5ac52e9`), and those lines are byte-identical.

**Operator:** no Part. Ordinary use never sends the token, so no operator can observe the change.

**PR body:**
- asks for a merge commit;
- names base B and the OPEN rulings;
- lists the applied words;
- shows the lockfile diff.

## §10. Amendments

*(Opens empty; append-only.)*

## Rule (00), and the facts to check again at dispatch

**This piece's paths:**
- `frontends/shell/src-tauri/src/commands.rs`;
- `frontends/shell/src-tauri/src/state.rs`;
- `frontends/shell/src-tauri/src/lib.rs`;
- `frontends/shell/src-tauri/Cargo.toml` (OPEN-1 (a));
- the form.

It touches no `protocol/`, wire fixture, `Cargo.lock` or `package-lock.json`.

- **1c, shared by file.**
  - Step 1's P4 edits `commands.rs` and `lib.rs` (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:988 @ b5ac52e9`), and steps 2 and 3 each have a src-tauri group (`:453 @ b5ac52e9`, `:469 @ b5ac52e9`, `:485 @ b5ac52e9`; §2.7 at `:342-346 @ b5ac52e9`).
  - §2.7's "held in the binding's state" may land in `state.rs`, so check it at each step's base.
  - Every 1c step touches `protocol/` (`:536 @ b5ac52e9`), and this piece does not.
  - **Re-check:** which 1c step is in progress or awaiting merge, and its file list.
- **Milestone 4, PR B and PR C: disjoint.** No PR edits `src-tauri/**` (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:401-402 @ b5ac52e9`). This piece edits no `frontends/shell/src/**` and no `package.json`. **Re-check:** that line at the base, and each PR's committed list.
- **`port-2-macos-l1-and-app-dirs`: disjoint by its draft.** Its 16 files name no src-tauri path (`state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-architect-draft.md:272-288 @ b5ac52e9`). **Re-check:** its committed form's Scope.
- **`covering-case-collision-binds-other-column`: disjoint.** It is engine-only by the human's item 1 (`state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:8 @ b5ac52e9`). **Re-check:** its five-line Scope.
- **#241 (the bundle redaction scan): disjoint by file.** It edits `publish.rs`'s `mod tests` and `tauri.conf.json` (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:962 @ b5ac52e9`). **Re-check:** that it has merged, or its paths.

**Seam re-reads at the base:** §2's interface list. Every b5ac52e9 line above is re-pinned at the base, at a commit on main.

---

# OPEN items

**OPEN-1: the test's route.** This is a red line: "dependency changes".
- **(a) Tauri's mock runtime.** `tauri = { version = "2", features = ["test"] }` under `[dev-dependencies]`, which unify features for test builds as the existing entries at `Cargo.toml:78-97 @ b5ac52e9` do. This is the only `cargo test` route that reaches the registered command through IPC from the page's argument names. The crate has never used it: `publish.rs:365-369 @ b5ac52e9` notes that a command "needs a live Tauri app to reach". Its lockfile effect is unread, so I2 stops the piece if `Cargo.lock` changes.
- **(b) Redaction in a `SessionLog` method the binding calls,** tested with a real `Session` and file, plus a presence scan that the binding calls it (precedent: `frontends/shell/src-tauri/tests/sole_caller_scan.rs:74-83 @ b5ac52e9`). This needs no dependency change, but it does not reach the binding through IPC. It is also further from the human's sentence: the binding would no longer itself run `Session::redact`.
- **(c) An e2e case in the real app:** CDP evaluates `window.__TAURI_INTERNALS__.invoke` with attach's token, and the harness reads the newest session log. It is real end to end, but it adds a new suite file, a `package.json` line (shared with milestone 4 and 1c's P6) and a heavy run.
- **Recommendation: (a), on the human's typed word,** with (b) as the fallback if I2 fires.

**OPEN-2: the self-check's lines.** This is a scope change on a ruled item.
- **(i)** Leave them unredacted and name them in the `state.rs` comment, as drafted.
- **(ii)** Redact them too: `try_state::<DataPlaneHandle>()` in `on_page_load`, about 6 lines in `lib.rs`. Its mutation cannot be observed without a webview that navigates.
- **Recommendation: (i).** The case needs page script, which already holds the token.

**OPEN-3: `level`.**
- **(a)** Redact both `level` and `message`. Both are the page's text, which the human's test names.
- **(b)** Redact `message` only. The comment must then name `level` as unredacted, and K-2 goes.
- **Recommendation: (a).**

**OPEN-4: which merge of 1c (the custodian's call under (00), which the human delegated).**
- **(a)** Any gap in which no 1c step that has src-tauri paths is in progress or awaiting merge. The first such gap is after step 1's PR merges and before step 2 dispatches, and a step that becomes ready then waits for this PR.
- **(b)** After step 3 merges, as `depends_on: [b2-piece-1c-save-and-reopen]` reads now.
- **Recommendation: (a),** only where the gap is natural. Slot 1's product order must not wait on an S2 piece.

# What I could not settle

- **tauri 2.11.5's `test` feature:** which packages it adds, and so its effect on `Cargo.lock`, and whether its IPC helper invokes an app command in a mock context with no capability edit. I did not read the registry source. The worker reads it at dispatch, under the seam rule (I2, I6).
- **Whether 1c's steps 2 and 3 edit `state.rs`.** Their src-tauri groups name no files.
- **Hashes:** none computed, because I have no shell. The custodian's script pins every line above at the form's base.
