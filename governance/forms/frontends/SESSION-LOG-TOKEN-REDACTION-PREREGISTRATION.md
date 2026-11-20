# shell: `binding_log_session_event` passes the page's text through `Session::redact`, and `SessionLog::append` writes every text as one line with no hidden character; full form, both gates

*File: `governance/forms/frontends/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md`. PLAN node `session-log-token-redaction-rests-on-page-code`.*
*Drafted by the architect (claude-opus-5-5) for the custodian, read only, at main db6eb550bc88fe492f41b5973d16dc8a675a5ee9. It revises the draft of 2026-10-23 (`state/consults/2026-10-23-session-log-token-redaction-rests-on-page-code-architect-draft.md`), with the re-read of 2026-11-20 (`state/consults/2026-11-20-session-log-token-redaction-rests-on-page-code-form-re-read-architect.md`) and ADV-2026-11-20-17, its item 6 as ADV-2026-11-20-19 item 2 reads it. The custodian commits it before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-16-06 item 2 (a): security, for redaction, and persistence, for the log's line format; ADV-2026-11-19-35 item 1 (d)).*

## §0 Disclosure

**0.1 Authority.**
- The human's words:
  - `state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md`, item 2: the node, graded S2. Two of its spans are kept as the human's, byte-copied from that item by my Read, not by script: "binding_log_session_event runs Session::redact on the text before it appends" and "a test shows a token in the page's text never reaches the log".
  - `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md`, item 5: OPEN-1 and OPEN-4 (§12).
  - `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its Session-log line: OPEN-2 and OPEN-3 (§12).
  - The grant, `state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 to 4. Item 2 delegates the human's rulings to the advisor, scope changes to what the human ruled among them. Item 3 sets how a ruling is filed and worded. Item 4 keeps dependencies, credentials and keys with the human.
- **The advisor's addition (ADV-2026-11-20-17 item 1 (a) and (c)).** The control-character rule of §2.3 item 5 is a third behaviour. It is not in the human's item 2. It is the advisor's wording, under the delegation of 2026-11-13. It is listed for the human to overturn.
- The advisor's rulings, under the delegation of 2026-11-13, never the human's words. Each is filed under `state/directives/` by its id:
  - ADV-2026-11-20-17, items 1 to 12, marked where each lands;
  - ADV-2026-11-20-19 item 2: how item 6 of ADV-2026-11-20-17 is read (§9.3);
  - ADV-2026-11-19-35 item 1 and ADV-2026-11-20-04 item 6: the placement (§10.3). ADV-2026-11-20-04 item 2, P-10: the picker's doc carried here (§2.4);
  - ADV-2026-11-16-06 item 2 (a): the class;
  - ADV-2026-11-18-01 item 3 and ADV-2026-11-18-02 item 2: the cap and the model (§10.4);
  - ADV-2026-11-19-10 items 2 and 3; ADV-2026-11-19-33 items 2 (v), 3 and 5; ADV-2026-11-18-24 item 5 (b): how it is built and gated (§9, §10);
  - ADV-2026-11-19-12 items 1 and 6: no line is cut or packed to fit (§7).

**0.2 Evidence, not Authority.**
- Candidate 2 of `state/consults/2026-10-16-boundary-inventory-architect.md`, as the draft took it.
- The draft of 2026-10-23 and the re-read of 2026-11-20 (header).

**0.3 The reuse index.** Byte-copied from the custodian's brief for this form, marked so. The brief is not tracked. It is evidence here, not Authority.

```text
$ node tools/reuse.mjs session log redaction
No prior art recorded for "session log redaction". Research it before planning an implementation.
$ node tools/reuse.mjs control character sanitize
No prior art recorded for "control character sanitize". Research it before planning an implementation.
$ node tools/reuse.mjs secret in log
No prior art recorded for "secret in log". Research it before planning an implementation.
```

All three searches missed, as did the draft's two. In this repository the prior art is `Session::redact` (`protocol/data-plane/src/session.rs`) for the token. For the character set it is `shownText` (`frontends/shell/src/project/shownText.ts`).

**0.4 Cites.** By file and symbol, at main db6eb550. The draft's pins at b5ac52e9 and the re-read's lines at 897e7bd9 are historical. The tree at the base is authoritative (ADV-2026-11-20-17 item 8). At dispatch, the tree at the dispatch base is authoritative, and I1 checks it (§11).

**0.5 Not read by this form.**
- Tauri 2.11.5's `test` module. The re-read read part of it: `mock_context`'s empty authority; the ACL check skipped for an app command when there is no app manifest and the URL is local; and the `test = []` line of tauri's manifest, read in the local cargo registry. I did not read these again.
- Still unverified: `generate_handler!` over the two commands by path from inside the crate's test module, and the mock runtime on the Windows runner. I6 stays (§11).
- The crate has never used the mock runtime. A comment in `binding_publish_prepare` (the RELEASE-0.1 item 10 paragraph) says, in paraphrase, that that command needs a live Tauri app to reach.

## §1 What this may and may not claim

**May claim:**
- Every occurrence of the session token's exact text in the page's `level` and `message` is replaced by `<redacted>` before the binding appends. The token in the form the page holds it (`tok.<hex>`, from `binding_data_plane_attach`) is written as `tok.<redacted>`.
- No line written through `append` holds a Unicode Cc other than its final LF. No such line holds a Bidi_Control character, U+2028 or U+2029 (ADV-2026-11-20-17 item 1 (c)).

**May not claim:**
- That the session log can never hold the token. The origin self-check's lines are not redacted (OPEN-2 (i)). Neither is text that holds the token in another form: another case, another encoding, split across calls, or cut.
- Any length bound on a line (ADV-2026-11-20-17 item 1 (c)).
- That a line's fields can always be told apart. A `level` that holds a space reads as it does today. So does a backslash followed by `n` that the page typed (ADV-2026-11-20-17 item 1 (c)).
- Any performance number or docs/08 row; any wire change; any change to an ADR.

**ADRs.**
- ADR-020 is cited, not amended. It names the session token as the only barrier against a local process for this consumer class. It touches origin admission only.
- docs/09's credential-leakage threat is the design aim (§2.4 says what is not edited).

## §2 The change

### 2.1 The interface it is written against (read at the base)
- `spatial_data_plane::Session` (`protocol/data-plane/src/session.rs`): `#[derive(Clone)]`; `with_origin`; `token_for_delivery(&self) -> &str`; `redact(&self, s: &str) -> String`, which is `s.replace(&self.token, REDACTED)`; `leaks_into(&self, artifact: &str) -> bool`. `REDACTED` is `"<redacted>"`.
- `Session` is re-exported by the crate root (`pub use session::Session`). `RunningDataPlane::session` is a `pub` field (`server.rs`).
- The shell depends on the crate by path (`spatial-data-plane` in `frontends/shell/src-tauri/Cargo.toml`).
- `Session::redact`'s only caller at the base is its own test. No edit under `protocol/` is needed.

### 2.2 Before
- `DataPlaneHandle { port: u16, token: String }` (`state.rs`) is built once in `lib.rs`'s `setup`, from `running.session.token_for_delivery().to_string()`. `running` is moved into `Box::leak` later in `setup`.
- `binding_data_plane_attach` formats `tok.{}` from `state.token`.
- `binding_log_session_event(state: State<'_, SessionLog>, level, message)` calls `state.append(&level, &message)`.
- `SessionLog::append` writes `<unix-ms> <level> <message>` and one LF. It escapes an LF in `message` only. `level` is written raw, and every other character passes in both.
- The page side:
  - `logSessionEvent` (`diagnostics/log.ts`) invokes the command with `{ level, message }`;
  - the re-read counted 40 calls outside tests at 897e7bd9;
  - only the `reopen-refused` line goes through `shownText` (`project/openProject.ts`);
  - the global handlers send error stacks that hold LFs (`diagnostics/errorHandlers.ts`).
- The page's only use of the credential is `new WebSocket(opts.url, opts.subprotocols)` (`streaming/adapterWs.ts`).

### 2.3 After
1. **`state.rs`, `DataPlaneHandle`.** The handle "holds a clone of the data plane's `Session` in place of today's copied token string" (the re-read's section 1, ADV-2026-11-20-17 item 5). The field `session: spatial_data_plane::Session` replaces `token: String`.
2. **`lib.rs`.** The re-read's words for its item 2 (section 1, ADV-2026-11-20-17 item 5): "at the handle's one construction (lib.rs:445-448), `session: running.session.clone()` replaces the `token` line; `running` is moved into `Box::leak` later (lib.rs:546)". The two line numbers in those words are lines at main db6eb550, and the tree at dispatch is authoritative. Nothing else in `lib.rs` changes.
3. **`commands.rs`, `binding_data_plane_attach`.** It formats `tok.{}` from `state.session.token_for_delivery()`. The reply's shape and bytes are unchanged.
4. **`commands.rs`, `binding_log_session_event`.**
   - It takes `State<'_, DataPlaneHandle>` beside `State<'_, SessionLog>`.
   - Its body is `log.append(&session.redact(&level), &session.redact(&message))` (OPEN-3 (a)).
   - The page's IPC arguments do not change, because a State parameter is not read from the payload.
   - It still returns `()` and never fails.
5. **`state.rs`, `SessionLog::append`: the control-character rule** (ADV-2026-11-20-17 item 1 (b); the advisor's addition, §0.1). It applies to both texts of every line `append` writes:
   - an LF is written as a backslash and `n`;
   - every other Unicode Cc (Rust's `char::is_control`), the tab and the CR among them, becomes U+FFFD;
   - so does each Bidi_Control character (U+061C, U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069), and so do U+2028 and U+2029;
   - no length bound is added.

   It is the set `shownText` replaces, with the LF written as `append` writes a message's LF today. The binding redacts first, and `append` replaces after. The token is hex, so the order cannot change what redaction catches.
6. **Unchanged:**
   - `protocol/**`;
   - all page code and every e2e file;
   - the text each host line is composed with (each now passes through §2.3 item 5; P4 predicts it unchanged);
   - the handler list in `lib.rs`'s `generate_handler!`;
   - `tauri.conf.json` and the capabilities;
   - `Cargo.lock`.

   `append` is not declared unchanged (ADV-2026-11-20-17 item 1 (c)).
7. **Behaviour.**
   - A page line that holds `tok.<64 hex>` is written as `tok.<redacted>`.
   - A line with none of §2.3 item 5's characters is written byte for byte as before (P4).

**Other checks.**
- **ADR-006:** no operation is added, and no class changes.
- **docs/02:** the binding gains no branching. It calls the data plane's own redaction. The line rule sits in `SessionLog`, which owns the line format.
- **docs/10:** delivery of the credential stays on the control plane.
- **Portability:** nothing here depends on the OS.

### 2.4 Words (none is the human's wording)

The worker applies these words. The PR body lists each one, and both gates read each clause against the code.

**(a) The doc of `binding_pick_project_folder`** (ADV-2026-11-20-17 item 2). Byte-copied from the ruling's fenced block. These are the architect's words less one phrase (from the Open project control), and they are not the human's:

````
The OS folder picker for a project folder: the folder of an open's first save (`save_project`), and the folder a reopen opens (`open_project`). **Not SKP**, for the same reason as [`binding_pick_file`]: both commands take a folder already chosen, and how the caller got one is UI. The folder this returns never comes from the page: the dialog is native, and `None` means the operator cancelled.
````

Clause check:
- **The first save:** `App.tsx` calls `pickProjectFolder` before `save_project`.
- **The reopen:** `handleProjectPick` in `admission/AdmissionPanel.tsx`, which both the Open project control and `requestProjectPick` (the bar's entry) reach.
- **A folder already chosen:** the `folder` field of `SaveProjectRequest` and of `OpenProjectRequest` (`protocol/skp/src/v0/commands.rs`).
- **The native dialog, and `None` on cancel:** the binding's body.
- **Named, not blocking:** a folder that a DEV hook supplies (`takeSlot`; `App.tsx`'s instrumented-build branch) never reaches this binding. That case is dev-only.

**(b) The module doc's parenthetical in `commands.rs`** (ADV-2026-11-20-17 item 2), in the re-read's words (its section 5): "(`close_dataset` also starts [`Projects::release_ended`], after the host's close, and `binding_log_session_event` passes the page's text through the data plane's `Session::redact` before the append)".

Clause check: `close_dataset` as built; §2.3 item 4.

**(c) `SessionLog`'s doc.** It replaces the sentence that says the session token is never written to the log. The draft's words, byte-copied from the draft's §2:

> The session token does not reach this file through the page's lines: `binding_log_session_event` (`commands.rs`) passes the page's `level` and `message` through the data plane's `Session::redact`, which replaces every occurrence of the token's exact text with `<redacted>`, before it calls `append`. The host's own lines are composed in this crate and take no token, with one exception that ordinary use does not reach: the origin self-check (`lib.rs`, `on_page_load`) writes the main window's actual origin, or its whole URL when that URL has no host, unredacted, so a page script that navigates the main window to an address holding the token puts it here. Text holding the token in any other form (another case, another encoding, split across calls) is not redacted.

Clause check, re-pinned by symbol at the base:
- **Through `Session::redact` before `append`:** §2.3 item 4.
- **Every occurrence:** `str::replace`.
- **The host's own lines take no token:**
  - `refuse_to_start`, whose messages come from config before the session exists;
  - the self-check's ok arm and the config-origin line in `setup`;
  - `pool_poll.rs`'s two `append` calls, which carry counts and reasons.
- **The exception:**
  - `on_page_load`'s MISMATCH arm logs `actual`;
  - its UNVERIFIABLE arm logs the error, and `OriginError::NoHost`'s Display holds the URL (`origin.rs`).
  - Page script can navigate the window: with `csp: null`, as the `OriginSelfCheckOutcome` doc states.
- **Ordinary use does not reach it:** the page's only use of the credential is the WebSocket. The case needs page script, so it is named here and does not block.

**(d) `binding_log_session_event`'s doc.** Its four lines are kept, because `pool_poll.rs`'s `POOL_POLL_LOG_CLASS` doc paraphrases them. The draft's words are appended, byte-copied from the draft's §2:

> Both `level` and `message` are the page's text, and each passes through the data plane's `Session::redact` before `SessionLog::append`: every occurrence of the session token's exact text becomes `<redacted>`, so a page line carrying the credential `binding_data_plane_attach` hands out (`tok.<hex>`) is written as `tok.<redacted>`. The token in any other form is not caught (`SessionLog`'s doc).

Clause check: §2.3 items 3 and 4; `REDACTED`.

**(e) The new `DataPlaneHandle.session` field doc**, byte-copied from the draft's §2:

> The data plane's own session (`RunningDataPlane::session`, cloned at startup): its token is what `binding_data_plane_attach` hands out and what `binding_log_session_event` redacts.

Clause check: §2.3 items 1 to 4.

**(f) `append`'s doc and its comment.** These are the worker's words (ADV-2026-11-20-17 item 1 (e)). Both gates read each clause against the code.

**Not edited:**
- `DataPlaneHandle`'s type doc, which stays true.
- `Session`'s field doc under `protocol/`, out of this piece.
- docs/09, which is constitution. After this piece its redaction line holds for the page's lines, but not for OPEN-2's lines.

**P6.**
- No string the app shows changes.
- The Console's effect text for `binding_log_session_event` (`console/surfaceRegistry.ts`) stays true: one line is written.
- The Console's effect text for `binding_pick_project_folder` names the first save alone. It is page code and a shown string, so it is carried for P5's words, not this node's (ADV-2026-11-20-17 item 2).

**KNOWN-LIMITATIONS:** none. Nothing the user sees changes.

**Not this node's:** the stale `state.rs` line cite in `pool_poll.rs` that the re-read names goes to the docs lane (ADV-2026-11-20-17 item 9).

## §3 Fixtures

None.
- Each test builds a real `Session` (`Session::with_origin`) and a real `SessionLog::open`, each in a fresh temp directory of its own.
- The precedent is the `workspace(name)` helper in `publish.rs`'s tests.
- A directory per test is needed because the log's file name has one-second resolution (`SessionLog::open`).

## §4 Tests, and the mutations

All three tests go in a new `#[cfg(test)] mod tests` in `commands.rs`. `mod commands` is private to the crate (`lib.rs`). The tests run through tauri's mock runtime (OPEN-1 (a)).

The mock app:
- registers `binding_data_plane_attach` and `binding_log_session_event`;
- manages a `SessionLog` and a `DataPlaneHandle`.

Each test:
1. invokes the attach command and takes `subprotocols[1]`, the page's real value;
2. asserts that the value equals `tok.` followed by `session.token_for_delivery()`;
3. invokes the log command with the page's argument names, `{ level, message }`;
4. reads the file.

| Test | Asserts | Mutation |
|---|---|---|
| K-1 `a_token_in_the_pages_message_never_reaches_the_session_log` | `!session.leaks_into(text)`; one line; that line holds the message's other words around `tok.<redacted>` | the binding appends `message` as given |
| K-2 `a_token_in_the_pages_level_never_reaches_the_session_log` | the same, for `level` | the binding appends `level` as given |
| K-3 `a_control_character_in_the_pages_text_never_breaks_the_session_log_line` | see below | (a) and (b), below |

**K-3** (ADV-2026-11-20-17 item 1 (d), as the re-read's section 7 gives it).
- **Input:** a `level` and a `message`, each holding CR, U+0007, U+202E, U+2028 and LF. Then a second call with plain text.
- **Asserts:**
  - the file has exactly two lines, each ending in one LF;
  - no Cc other than those LFs, no Bidi_Control, and no U+2028 or U+2029;
  - U+FFFD at each replaced place, and a backslash and `n` at each LF;
  - the plain call's line is exactly `<ms> <level> <message>` and one LF.
- **Mutations:**
  - (a) `append`'s replacement removed, with the message's LF escape kept;
  - (b) the rule applied to `message` alone.

**How a mutation is observed.** Each of the four mutations is applied, the named test is run and seen to fail by name, and the failing assertion and the commit are recorded. Then the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is called an observation.

No existing test is edited.

## §5 Predictions, declared unchanged, falsification

**Predictions:**
- **P1:** K-1, K-2 and K-3 pass, and each fails under each of its mutations.
- **P2:** `frontends/shell/src-tauri/Cargo.lock` is byte-identical, and `cargo test --locked` passes (ADV-2026-11-20-17 item 4).
- **P3:** every existing src-tauri test, and `npm run verify`, pass unedited.
- **P4:** a line that holds none of §2.3 item 5's characters is written byte for byte as before. K-3's plain line holds this (ADV-2026-11-20-17 item 1 (c)).
- **P5:** the two e2e suites of §9.3 pass in each route, S5d of the post route excepted under its standing rule.
- **P6:** §7 holds.

A wrong P1 to P5 is class 2. A wrong P6 is class 8.

**Declared unchanged:** as §2.3 item 6. `append` and the host lines' bytes are not declared unchanged: P4 predicts them.

**Falsification:**
- the token as the page holds it is not the substring that `Session::redact` replaces; or
- the mock IPC decodes arguments differently from the page's IPC; or
- a line with none of the replaced characters changes.

## §6 Instruments

Assertions only: byte absence and presence, the line count and the character set. No measurement.

## §7 Declared values and the ceiling

- **No new constant.** The redaction literal is the data plane's `REDACTED`. The replacement character is U+FFFD.
- **The ceiling** (ADV-2026-11-20-17 item 3): at most 230 changed lines, both numstat columns summed, over the four files `frontends/shell/src-tauri/src/commands.rs`, `frontends/shell/src-tauri/src/state.rs`, `frontends/shell/src-tauri/src/lib.rs` and `frontends/shell/src-tauri/Cargo.toml`.
  - Budget (b) is dropped.
  - An overrun is class 8. Nothing is cut or packed to fit it (ADV-2026-11-19-12).
  - This section is never edited.
- **Counting**, at a named commit:
  - `git diff --numstat B...H -- frontends/shell/src-tauri/src/commands.rs frontends/shell/src-tauri/src/state.rs frontends/shell/src-tauri/src/lib.rs frontends/shell/src-tauri/Cargo.toml`;
  - `git diff --name-only B...H`, which shows no other path but this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`;
  - `git diff B...H -- frontends/shell/src-tauri/Cargo.lock`, which is empty.
- **Estimate** (the re-read's section 2): `commands.rs` about 133 in and 8 out, the tests about 115 of them; `state.rs` 24 and 6; `lib.rs` 1 and 1; `Cargo.toml` 5 and 0. About 178 lines.
- **`Cargo.toml`:** one entry under `[dev-dependencies]` that enables tauri's `test` feature, with its comment. This is the human's typed word of 2026-10-23 and nothing else (ADV-2026-11-20-17 item 4).

## §8 Block-on-sight

1. An edit under `protocol/`.
2. A claim beyond §1:
   - that the session log can never hold the token;
   - that every line is redacted;
   - a length bound;
   - that a line's fields can always be told apart.
3. In the advisor's words (ADV-2026-11-20-17 item 5), byte-copied from the ruling: "The token held in the shell's state anywhere other than in the handle's clone of `Session`, or the token printed or logged. The attach's reply is the delivery and is not such a copy."
4. Page code or an e2e file changed.
5. Any dependency or lockfile change beyond §7's `Cargo.toml` entry, or a feature added to a non-dev dependency.
6. A test that writes the page's credential by hand instead of taking it from `binding_data_plane_attach`'s reply (an imagined interface).
7. Any of these in product code: a `pub` item without a product caller; `allow(dead_code)`; a new `cfg` (the `#[cfg(test)]` module excepted).
8. A string the app shows changed.
9. A line cut or packed to fit §7.
10. A lint silenced on code this piece did not write (ADV-2026-11-19-33 item 3).
11. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form.
12. Record items:
    - quotation marks around text that is not byte-identical to its named source;
    - a line cite into the ledger;
    - a bare self-line;
    - a pin read as current.

## §9 Gates

**9.1 Architect** (full gating):
- §8, item by item.
- The seam rule on three seams: the attach's credential to the binding; the binding to `SessionLog`; the shell to `spatial_data_plane::Session`, by its actual interface at the base.
- The caller rule: `DataPlaneHandle.session` has two product callers, and `Session::redact` gains its first.
- Each clause of §2.4's words, and of the worker's words for `append`, against the code.
- docs/01, 02 and 10; round 25.

**9.2 Reviewer:**
- the full diff, `origin/main...HEAD`;
- the four mutations made again;
- §7 by its commands, the empty `Cargo.lock` diff included;
- `cargo fmt --check`;
- clippy on the changed crate at the gated head, in a hold. This follows the practice ADV-2026-11-18-24 item 5 (b) set for P3a and P3b. A warning in a file the piece changes is a finding.

**9.3 Suites:**
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`;
- `npm run verify`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI, including `product-ci-shell`'s `cargo test` step on windows-latest.

**E2E** (ADV-2026-11-20-17 item 6, as ADV-2026-11-20-19 item 2 reads it):
- `e2e/regression.mjs` and `e2e/source-changed.mjs` run once each, at the gated head, in each route the standing series runs them.
- They run on port 5180, through the suites' own launch.
- The Sonnet tester runs them, taking turns with P4b's runs.
- Step S5d of the post route stays under its standing rule: inconclusive is not a pass, and holds nothing.
- Any other failed row is a stop (I7).
- The four readers of the session log are `regression.mjs`, `source-changed.mjs`, `source-watch-idle.mjs` and `residency-harness.mjs`. The last two do not run.

**Operator:** no Part. Ordinary use never sends the token, and nothing the user sees changes.

**PR body:**
- asks for a merge commit;
- names base B and the OPEN rulings;
- lists §2.4's applied words and the worker's words for `append`;
- shows the `Cargo.lock` diff (expected empty) and names any crate it adds (expected none).

## §10 Where it is built, the order, the placement and the model

**10.1 Where.**
- The branch `cut/session-log-token-redaction`, the worktree `C:/dev/wt/redact`, the build folder `D:/wt-targets/redact` and the test data folder `D:/wt-data/redact`.
- It is cut from main at dispatch.

**10.2 Commits and pushes.**
- The tests' commit is its own commit, before the code. It is pushed together with the code commit that makes it pass. That the tests fail before their code is shown by the worker's local run, in its report (ADV-2026-11-19-10 item 2).
- A stop still pushes the branch as it stands (ADV-2026-11-19-10 item 3).
- A test correction found once the code runs is committed after the product commit. Its message says the run against the code found it (ADV-2026-11-19-33 item 2 (v)).
- A worker does not fetch. The push's own output shows the remote head (ADV-2026-11-19-33 item 5).

**10.3 The order and the placement** (ADV-2026-11-20-17 items 7 and 11):
- This form is committed at its path as its own commit, before any code. Then the piece goes in slot 1 beside P4b, with both gates.
- The placement is after P4a's merge, recorded as the 1c form's Amendment 64, and beside P4b. This is ADV-2026-11-19-35 item 1, with its P4 read as P4a by ADV-2026-11-20-04 item 6. Heavy runs take turns.
- **Rule (00).** The node's four paths are §7's four files and this form. P4b's four paths are `e2e/lib.mjs`, `e2e/second-open.mjs`, the `e2e/README.md` entry and the `package.json` scripts line (the 1c form's Amendment 65 item 2). They are disjoint. The node has no e2e README entry and no path under `protocol/`.
- **P5.** P5's declared files are checked at its dispatch (ADV-2026-11-20-17 item 7). Beside P5 holds only if those files hold no src-tauri path (ADV-2026-11-19-35 item 1 (c)).

**10.4 The model** (ADV-2026-11-20-17 item 10):
- worker-high, on the strongest model, in one brief;
- its ground is security: the piece changes where the session credential is held and what a persisted log takes;
- the brief names that ground in one line (ADV-2026-11-18-02 item 2);
- it counts under the cap of ADV-2026-11-18-01 item 3.

## §11 Stops

Each stop is reported, and the custodian sends it to the advisor.

- **I1:** a pinned interface differs at the base. That covers §2.1's items, `DataPlaneHandle`'s fields and its one construction, `log.ts`'s arguments, and the attach's shape.
- **I2:** `Cargo.lock` changes at all, or a package is added. The worker stops. The advisor reads whether the change is inside the human's word, and anything outside it is the human's (ADV-2026-11-20-17 item 4; ADV-2026-11-19-35 item 1 (e)).
- **I3:** an existing test needs an edit.
- **I4:** any edit under `protocol/`.
- **I5,** as ADV-2026-11-20-17 item 7 words it (byte-copied from the ruling): "a path of this node is in the declared files of any piece in flight at dispatch". The e2e README's entries are counted (ADV-2026-11-20-04 item 6).
- **I6:** the mock runtime cannot invoke an app command without a capability or config edit.
- **I7:** in §9.3's e2e runs, any failed row other than S5d of the post route (ADV-2026-11-20-17 item 6).

## §12 OPEN items (as the re-read's section 6 gives them; ADV-2026-11-20-17 item 11)

- **OPEN-1: (a).** This is the human's typed word, in the weekend-open-items directive's item 5: tauri's `test` feature as a dev-dependency.
  - The PR body lists the `Cargo.lock` diff and names any crate it adds.
  - ADV-2026-11-19-35 item 1 (e)'s stop applies (I2).
  - The (b) fallback and its budget are dropped.
- **OPEN-2: (i),** by the human's clicks directive, its Session-log line. The self-check's lines stay unredacted and are named in `SessionLog`'s doc (§2.4 (c)).
- **OPEN-3: (a),** by the same line. Both `level` and `message` are redacted, and K-2 is kept.
- **OPEN-4: (a),** by the weekend-open-items directive's item 5. In effect the placement rulings of §10.3 overtake it. The draft's 1c-gap text is removed.

## §13 Amendments

*(Opens empty; append-only.)*

## Amendment 1 — K-3's two mutations, as ADV-2026-11-20-20 item 1 reads them (class 5), before any code

*2026-11-20, by the custodian, under the advisor's ruling ADV-2026-11-20-20, filed under state/directives/ by its id: the advisor's words under the delegation of 2026-11-13, never the human's.*

1. **K-3's mutations** (section 4; the ruling's item 1). Mutation (a) removes the U+FFFD replacement from `append` and keeps the LF escape of both texts: it goes red at the hidden-character check. Mutation (b) applies the whole rule to `message` alone and writes `level` raw: it goes red at the line count. K-3 asserts the line count first. Section 4's words for mutation (a) are read by this item. Class 5.
2. **The build rules** of sections 8 item 10, 9.2 and 10.2 reach this node (the ruling's item 2), and are standing for every piece with a worker and a reviewer.
3. **P5** (section 10.3; the ruling's item 3). If P5's declared files hold a src-tauri path while this node is in flight, P5's dispatch waits for this node's merge.
4. **Section 2.4 (a)** (the ruling's item 4). The clause on a folder already chosen stands. The gates read it against the code as every clause, and a finding that it is untrue goes to the advisor unreworded.
5. **The class** (the header; the ruling's item 6) rests on ADV-2026-11-19-35 item 1 (d), whatever the week of ADV-2026-11-16-06 comes to.
6. The note's points (d), (e), (h) and (i) need no ruling (the ruling's item 5).
7. Superseded: section 4's wording of mutation (a), by item 1. Nothing else.

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — the stop at 37fc83bc and the route below the binding, as ADV-2026-11-20-22 rules it (classes 5, 1 and 2), before any further code

*2026-11-20, by the custodian, under the advisor's ruling ADV-2026-11-20-22, filed under state/directives/ by its id: the advisor's words under the delegation of 2026-11-13, never the human's. The words of this amendment are the custodian's (the ruling's item 6).*

1. **The stop (class 2).** At the code commit 37fc83bc057bbcfd274af65e600e26c9728b4d0f the crate's lib test executable did not start: exit 0xc0000139, STATUS_ENTRYPOINT_NOT_FOUND. No test reached an assertion, and the mutations and clippy were not run. The worker's report is state/consults/2026-11-20-session-log-token-redaction-rests-on-page-code-worker-stop-i6-report.md. Section 0.5 left the mock runtime on the Windows runner unverified, and on this machine it did not hold. The stop, reported as I6, is closed by the ruling (its item 6).
2. **The route (class 5; the ruling's item 1).** The redaction of both texts and the append go into one method of `SessionLog`, in `state.rs`. It takes the session and the page's `level` and `message`, passes each through `Session::redact`, and then appends. The body of `binding_log_session_event` is that one call. The method's name and its doc are the worker's, and the gates read each clause against the code.
3. **The tests (class 5; the ruling's item 2).** They stay in a test module of `commands.rs`, without tauri's mock runtime.
   - K-1, K-2 and K-3 call the method with a real `Session` and a real `SessionLog`. The credential is `tok.` followed by `token_for_delivery()`, composed in the test. Their asserts are section 4's, with Amendment 1. Section 4's steps 1 to 3 and its mock app go; each test still reads the file.
   - K-4, new, is a presence scan of `commands.rs`, after the precedent of `tests/sole_caller_scan.rs`. It shows that the binding's body calls the method, and that no line of `commands.rs` outside a comment and outside its test module calls the log's `append`. It states its limits as the precedent does. No existing test file is edited (I3).
   - The mutations, each seen red by name as section 4 says: K-1, the method appends `message` as given; K-2, it appends `level` as given; K-3, (a) and (b) as Amendment 1 has them; K-4, the binding calls `append` with the page's texts as given.
4. **What the tests no longer reach (class 5; the ruling's item 3):** the command's registration, its argument names, the IPC, and the attach's reply. The PR body says so in these terms. The gates read the attach's line, and the binding's argument names against `diagnostics/log.ts`. No e2e case is added.
5. **The departure from OPEN-1 (a) (class 1; the ruling's item 5).** OPEN-1 (a) was the human's typed choice, in item 5 of the weekend-open-items directive of 2026-10-23. Moving to (b) is a scope change on a thing the human ruled: the advisor's, under the grant's item 2, listed in the digest for the human to overturn. (b) is further from the human's sentence of 2026-10-23 that section 0.1 keeps: the binding no longer runs `Session::redact` itself, and calls the one method that does.
6. **The files and the ceiling (the ruling's items 5 and 9).** The dev-dependency line is not used. At the gated head `Cargo.toml` and `Cargo.lock` are byte-identical to main, and the node's files are `commands.rs`, `state.rs` and `lib.rs`. Section 7's count still names `Cargo.toml`, and gives 0 there. The PR body's `Cargo.lock` line stays. The 264 lines at 37fc83bc against the ceiling of 230 are recorded as counted. The count is taken again at the gated head, and any excess there is class 8 in the closing. Nothing is cut or packed to fit (ADV-2026-11-19-12).
7. **The commits (the ruling's item 7).** 0db62d91 and 37fc83bc stay; nothing is reset, amended or rebased (ADV-2026-11-20-21 item 3). After this amendment is on main and main is merged into the branch: one tests' commit, K-1 to K-4 in this shape with the mock-runtime module and the `Cargo.toml` line removed, shown red by the worker's local run; then the code commit; both pushed together (ADV-2026-11-19-10 item 2).
8. **The first check after the code commit (the ruling's item 8):** the crate's lib test executable starts and every existing test runs. If it does not start, the worker stops, and it goes to the advisor.
9. **CI at 37fc83bc,** as ADV-2026-11-20-24 item 1 rules it, replacing the ruling's item 10. Both jobs of run 44798555221 failed while building `libduckdb-sys` on the runner's image, before any Rust test was built. The run says nothing about the lib test executable. The closing records it as that, and claims nothing from CI about the worker's finding. Until the CI piece of draft ADV-2026-11-20-25 merges, ADV-2026-11-20-24 item 4 holds, and if the Windows jobs at the gated head are red with that signature, the merge request waits for that piece (its item 6).
10. **Route (i)** is not taken in this node (the ruling's item 4). It goes to the daily batch as a proposed node, not placed and not on v0.2's list.
11. The model and the ground are section 10.4's (the ruling's item 11).
12. **Superseded** (the ruling's item 6): what section 4 says of the mock app, its steps 1 to 3, and its sentence that the tests run through tauri's mock runtime; section 7's fourth file, and its line on `Cargo.toml`'s entry; OPEN-1's answer (a), and its third sub-item, which dropped (b) and its budget. OPEN-1's first two sub-items stand. Nothing else.

Read the last amendment first.

Nothing above is edited.
