*Custodian's filing note (2026-10-05): the architect's draft of the preregistration for `kernel-close-races-followups` (the lead-data second pilot's measured piece 3), on the custodian's brief, after lead-data's impact read. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 882ec37f5e2934af484905b7e380804e89401d6caf27795e310378db81b0e6ae. Write audit PASS: zero write calls (Read 50, Grep 21, SubagentHandback 1). Run window from the transcript: 2026-10-05T19:25:32.809Z to 2026-10-05T19:34:40.919Z (201,152 subagent tokens, 72 tool uses, 548,131 ms, from the harness's task notification). The form as committed is part 2's block with its pin hashes computed at a1109023 and two changes of form only: the declared-unchanged line's three test-text spans, written as one shared pin, are written as three full pins; and the pin of `liveTicketSet.ts:71-72` gains its directory, `frontends/shell/src/streaming/`, which its preceding pin names.*

---

Reviewed: main @ a1109023

All my reads were of the main checkout's working tree. Per the session's git status, the only tracked files modified there are `PLAN.yaml`, `state/CUT-STATE.md` and `tools/mods/GUARDIAN-V1-PREREGISTRATION.md`. None of them is a code file this draft pins. The draft cites the PLAN node by id, never by line. I ran no command and made no write.

## 1. Form and gating, and what is the human's

- **Full form, full gating from dispatch** (AUTONOMY §21a; §25(e)). The piece edits `protocol/skp/SKP-V0.md`, which §21a's wire bullet names under `protocol/skp/**`. It also rewrites a stated property: §1's `close_dataset` paragraph says the dataset outlives its last stream. A five-line `Out-of-scope` line could not say the piece touches none of the four categories, so §25(e) closes the five-line route before dispatch.
  - Size is not the deciding factor. My estimate by §21c's rule, tests included, is about 150 lines over 6 files without the OPEN widenings, and over 150 with them. Full form either way.
- **`gate: none` is not a gating route.** In `PLAN.yaml` the `gate:` key names the form file; other nodes carry a path there. `none` only means no form is committed yet. In the form's own commit the custodian sets `gate:` to the form's path, and does not mark the node in progress before that commit lands.
- **Where the form lives:** `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`.
  - The node is in the kernel-protocol lane, and four of the six files are kernel files.
  - The parent form is `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, and the new name mirrors `engine/B1-FOLLOWUPS-PREREGISTRATION.md`.
  - The kernel index's in-module list then names it.
- **The human's:** OPEN-1 (widening to files the routed items do not edit), OPEN-2 (the `close_dataset` paragraph withdraws a stated property; AI_DEVELOPMENT §B says to escalate when a guarantee changes), and OPEN-3 (re-observing T1 to T3's recorded mutations). The draft is written for my recommendation on each, and the conditional parts are marked.

## 2. The draft

````markdown
# kernel-generation-close-races' routed items: the open_dataset sink comment, stale cites into skp.rs, B1's wire_bytes recorded-mutation comment, the engine-code prefix sites, SKP-V0's close_dataset paragraph and the kernel index line — preregistration

## Header

- **Status.** The preregistration of PLAN node `kernel-close-races-followups`. Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form and full gating from dispatch (AUTONOMY §21a, wire and stated-guarantee categories; §25(e)). The piece edits `protocol/skp/SKP-V0.md` (`protocol/skp/**`) and rewrites the property §1's `close_dataset` paragraph states. No five-line form exists for this piece.
- **Authority:**
  - PLAN node `kernel-close-races-followups`, placed by question round 31, item 1 (RULED 2026-09-30). Drafting by the architect: question round 43, item 2.
  - Routed by:
    - `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, Amendment 2, row 11 (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:454-456 @ a1109023 sha256:HASH-TBD`), carrying the worker's noticed-but-not-done list (`state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md:62-64 @ d4245fe sha256:b3899e2d9fa44d7539e2614513d03c10932212e99116f2cf198461408d95ee97`), and Amendment 1, item 1.4 (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:392 @ a1109023 sha256:HASH-TBD`);
    - PR #147's gate-1 architect, item 6 and N5 (`state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:41-44 @ a1109023 sha256:HASH-TBD`, `state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:51 @ a1109023 sha256:HASH-TBD`);
    - PR #148's gate-1 architect, N1 (`state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-architect.md:53 @ a1109023 sha256:HASH-TBD`);
    - the catalog form's intake row (`kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:29 @ a1109023 sha256:HASH-TBD`);
    - `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, Amendment 1, item 7, second bullet (`engine/B1-FOLLOWUPS-PREREGISTRATION.md:283 @ a1109023 sha256:HASH-TBD`).
  - The owner's-index update: `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2.
- **Drafted by** the architect agent on the custodian's brief. Inputs: lead-data's impact read (`state/consults/2026-10-05-kernel-close-races-followups-impact-read.md`, sha256 80a69e996b41cb0cc333f57db63daf8fda1b68019837110ba96997d47f661424, read at e32798ae) and a re-read of main at a1109023. Read-only; the architect ran no command.
- **Reference form.**
  - Code and records at main are pinned `path:line @ a1109023 sha256:<hex>`.
  - A pin is historical. It is authoritative for the defect it names. The tree at the branch's base is authoritative for the edit, and the worker re-derives every site before editing (template §0).
  - Self-references are by section and item. The ledger is cited by round and item.
  - Every cite the piece writes into code names its target by item (function, type, test, section), never by line.
- **Branch.** `cut/kernel-close-races-followups`, cut from main in the product slot. It merges by a merge commit, never a squash, so that every commit the closing record or the index names stays reachable. The custodian sets `merge: merge-commit` on the node (AUTONOMY §27).

## §0. Disclosure

- **Read:**
  - the impact read;
  - the node, and `adr-035-close-races-note`, in PLAN.yaml;
  - the routing sources above;
  - `engine/B1-FOLLOWUPS-PREREGISTRATION.md` in full;
  - B1's gate-1 architect report;
  - ADR-035's Note 2026-09-25;
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md` Amendments 1 and 2;
  - SKP-V0 §1, §3, §5 and §8;
  - AUTONOMY §21a to §21d and §25;
  - the template, Round 25 additions included;
  - the portability directive §2;
  - the code sites cited below.
- **What B1 already discharged.** B1's Amendment 1, item 6 discharges the `kernel/tests/skp_projection.rs` half of close-races item 1.4 (`engine/B1-FOLLOWUPS-PREREGISTRATION.md:280 @ a1109023 sha256:HASH-TBD`). B1's node split leaves this node `kernel/tests/wire_bytes_invariant.rs:368-372 @ b438c587 sha256:79d1171cc3961e365c1838c07a914b11ab534da6e7eb671a95950ede2e29b0f8` (B1 §2, node split).
- **The scope rule.** Every stale cite or false site claim in a comment of a file this piece edits for a routed item is in scope. A file the routed items do not edit is out, unless the human widens the piece (OPEN-1). The precedent is the cancel-state form's intake row (`protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:35 @ a1109023 sha256:HASH-TBD`) and B1 gate 1's S1-1.
- **Noticed, outside the files in scope** (OPEN-1 lists them):
  - `frontends/shell/src/streaming/liveTicketSet.ts:35-38 @ a1109023 sha256:HASH-TBD` calls `EngineSource::next_into` the single place a typed `EngineError` becomes the terminal's `String`;
  - `liveTicketSet.ts:71-72 @ a1109023 sha256:HASH-TBD` cites stale skp.rs lines, including a mint-race arm that close-races removed;
  - stale skp.rs line cites in `tileViewportStreamManager.ts`, its test, `App.tsx`, `pool_poll.rs`, `engine/tests/admission_p4_corpus.rs` and `kernel/tests/no_generation_in_persisted_artifacts.rs`;
  - `frontends/shell/src-tauri/src/lib.rs:423-427 @ a1109023 sha256:HASH-TBD`, whose own comment cites a stale line for the `SkpHost` construction.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **No product behaviour change.** Product source changes only in `//`, `///` and `/** */` comment lines.
- **No wire change.** No literal, key, value, code or command changes. `protocol/skp/src/`, `protocol/skp/tests/` and `protocol/data-plane/` have empty diffs.
- **No performance number** and no docs/08 row. No ADR-018 vocabulary. No new operator-visible text.
- **ADRs cited, none amended:** ADR-035 (its Note 2026-09-25), ADR-004, ADR-018. ADR-019 is Proposed and binds nothing.
- **May not claim anything about a session reference no client holds:** not that one can exist, and not that one cannot. Whether ADR-035's Note 2026-09-25, SKP-V0 §3's third minting rule or SKP-V0's second note to the `skp/0.3` entry has become historical is for PLAN node `adr-035-close-races-note`, which waits on the human's ruling and has not run.
- **May claim, for `close_dataset`, only the catalog form's reading.** A ticket's registry entry holds the dataset by name. A live stream holds no `Arc<Dataset>`. A pool lease in flight keeps the pool alive until it is released (`kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:39 @ a1109023 sha256:HASH-TBD`). Conditional on OPEN-2 (A).

## §2. The change

For every item below, the content is binding and the wording is the worker's.

### C1: S1, the comment in `open_dataset`'s sink, `Admitted` arm

- **Site:** `kernel/src/skp.rs:1139-1143 @ a1109023 sha256:HASH-TBD`.
- **The rewording states:**
  - this arm is reached only after this call's admission minted the dataset's generation, under the latch and before the latch is set to `Admitted` (`kernel/src/skp.rs:1240-1244 @ a1109023 sha256:HASH-TBD`, `kernel/src/skp.rs:1274-1277 @ a1109023 sha256:HASH-TBD`);
  - that generation carries the `SessionRef` this call returns on `OpenDatasetResponse.session` (`kernel/src/skp.rs:1292-1295 @ a1109023 sha256:HASH-TBD`);
  - the lock-order sentence stays.
- **It drops** the bare Amendment 1 reference and the clause about a reference no client holds. If the invariant that every generation carries a kernel-minted `SessionRef` is named, it is cited as question round 22, item 1, by round and item.
- **It does not state:**
  - anything about a reference no client holds;
  - that a client holds the returned reference (that is the shell's fact);
  - anything about ADR-035, SKP-V0 §3 or SKP-V0's 2026-09-25 note (§1).
- It may name `ticket_drop_under_lock_regression::the_close_race_mints_no_generation_so_no_unheld_reference_exists` (`kernel/src/skp.rs:4205 @ a1109023 sha256:HASH-TBD`) as the pin of the close race, by test name only.

### C2: S2, `SkpHost::generations`'s doc

- **Site:** `kernel/src/skp.rs:1086-1093 @ a1109023 sha256:HASH-TBD`.
- The bare `SkpHost::new` line becomes `SkpHost::new` by name (`kernel/src/skp.rs:1054-1071 @ a1109023 sha256:HASH-TBD`).
- The product caller is named by item: the `EngineSourceFactory::ticket_only(catalog, tickets, host.generations())` call in the `serve(DataPlaneConfig { .. })` call of `frontends/shell/src-tauri/src/lib.rs`'s `run` setup, with no line (`frontends/shell/src-tauri/src/lib.rs:428-432 @ a1109023 sha256:HASH-TBD`).

### C3: S5, two cites of SKP-V0 line 266

- **Sites:** `kernel/src/skp.rs:1704 @ a1109023 sha256:HASH-TBD` and `kernel/src/skp.rs:2070 @ a1109023 sha256:HASH-TBD`.
- Each is repointed to SKP-V0 §5's `code` rule by section, with no line (`protocol/skp/SKP-V0.md:325-329 @ a1109023 sha256:HASH-TBD`).

### C4: `TicketLiveness`'s doc, in skp.rs

- **Site:** `kernel/src/skp.rs:539-544 @ a1109023 sha256:HASH-TBD`.
- **The defects.** Its ledger line cite no longer lands on the ruling. The words it quotes are the ADMISSION form's (`engine/ADMISSION-PREREGISTRATION.md:741-744 @ a1109023 sha256:HASH-TBD`), not the human's. Its quotation also differs from that source in its inner quotation marks.
- **The fix.**
  - The ruling is cited as question round 4, item 1.
  - The words are attributed to the ADMISSION form at its existing cite.
  - The passage is either byte-identical to that source or unquoted paraphrase.
  - The `engine/ADMISSION-PREREGISTRATION.md:742-744` token stays, as PR #147's gate found it accurate.

### C5: `terminal_detail_of`'s doc

- **Site:** `kernel/src/skp.rs:2010-2013 @ a1109023 sha256:HASH-TBD`.
- It names where the kernel hands an engine refusal to the data plane as a `String` at the base:
  - mid-stream, at `EngineSource::next_into` (`kernel/src/lib.rs:684 @ a1109023 sha256:HASH-TBD`);
  - at create time, in `EngineSourceFactory::create_from_raw_params` (`kernel/src/lib.rs:432 @ a1109023 sha256:HASH-TBD`);
  - at create time, in `EngineSourceFactory::liveness_refusal`'s two dead-ticket arms (`kernel/src/lib.rs:513 @ a1109023 sha256:HASH-TBD`, `kernel/src/lib.rs:526 @ a1109023 sha256:HASH-TBD`).
- Each calls this function, which stays the one place the prefix is built.

### C6: S7 and S8, `kernel/tests/session_generation.rs`'s comments

Each cite is repointed by item, with no line:

| Site @ a1109023 | Target, by item |
|---|---|
| `kernel/tests/session_generation.rs:310 @ a1109023 sha256:HASH-TBD` (ledger line) | question round 4, item 1 (its class fix) |
| `kernel/tests/session_generation.rs:311 @ a1109023 sha256:HASH-TBD`, `:406` (shell `lib.rs` lines) | the shell's `run` setup, the `ticket_only` call (as C2) |
| `kernel/tests/session_generation.rs:313 @ a1109023 sha256:HASH-TBD`, `:407` (`server.rs` line) | the data plane's START arm, its `factory.create` call (`protocol/data-plane/src/server.rs:508 @ a1109023 sha256:HASH-TBD`) |
| `kernel/tests/session_generation.rs:317 @ a1109023 sha256:HASH-TBD` | `typed_terminal_codes.rs`'s `fixture` |
| `kernel/tests/session_generation.rs:336 @ a1109023 sha256:HASH-TBD` | `typed_terminal_codes.rs`'s `touch_modification_time` |
| `kernel/tests/session_generation.rs:353-354 @ a1109023 sha256:HASH-TBD` | `SkpHost::viewport_query`, and its `open_engine_stream` refusal arm that ends the generation on `EngineError::SourceChanged` |
| `kernel/tests/session_generation.rs:427 @ a1109023 sha256:HASH-TBD` | `StreamRegistry::redeem` |
| `kernel/tests/session_generation.rs:476-477 @ a1109023 sha256:HASH-TBD` | `GenerationRegistry::prune_locked` and its doc's condition 1 |

Also: T1's assertion message names the shell function by its current name, `isSessionEndedTerminal` (`kernel/tests/session_generation.rs:419-420 @ a1109023 sha256:HASH-TBD`). The assertion's condition is unchanged. This is a test-text claim correction (template class 3, its named exception).

### C7: S9, B1's recorded-mutation comment in `kernel/tests/wire_bytes_invariant.rs`, a re-observation

- **Site:** `kernel/tests/wire_bytes_invariant.rs:368-372 @ a1109023 sha256:HASH-TBD`.
- **Shape:** B1's K-row shape (B1 §2, the skp_projection.rs paragraph).
  - The mutation text is unchanged.
  - The comment gains the 40-hex id of the commit it is re-observed at: the branch's base, a commit on main.
  - The bare self-line is dropped. The comment carries the failing assertion's message as observed, with no line number.
- **The re-observation:**
  - made on a `git archive <base>` export with its own `CARGO_TARGET_DIR`;
  - the mutation applied in `engine/src/envelope.rs`'s `BatchEnvelope::build`;
  - `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` run with the workspace suite's features;
  - its failure recorded by name, then the mutation reverted.
- The test code at the base equals the branch's, because only comments differ.

### C8: S14, `formatTerminalRefusal.ts`'s doc

- **Site:** `frontends/shell/src/streaming/formatTerminalRefusal.ts:9-11 @ a1109023 sha256:HASH-TBD`.
- It no longer names one kernel site. It names `kernel/src/skp.rs::terminal_detail_of` as the builder of the prefix, applied wherever the kernel turns an engine refusal into a terminal's detail, both mid-stream and at create time.
- It enumerates no site and states no count. The site list lives in C9's note.

### C9: SKP-V0

**In place, §1's `close_dataset` paragraph** (conditional on OPEN-2 (A)).
- Its second sentence (`protocol/skp/SKP-V0.md:134-136 @ a1109023 sha256:HASH-TBD`) is replaced by §1's `close_dataset` reading.
- Basis: §8's rule that §§1–7 are updated in place where a version note says so (`protocol/skp/SKP-V0.md:541-544 @ a1109023 sha256:HASH-TBD`). The precedent is the 2026-10-02 note (`protocol/skp/SKP-V0.md:969-977 @ a1109023 sha256:HASH-TBD`).
- The paragraph's first sentence stays.

**One dated note, no literal change, appended at the end of §8**, after `protocol/skp/SKP-V0.md:979-985 @ a1109023 sha256:HASH-TBD` and before §9. It states:
- **(i)** The `skp/0.3` entry's refusal-surfaces bullet (`protocol/skp/SKP-V0.md:755-757 @ a1109023 sha256:HASH-TBD`) names `EngineSource::next_into`. At the base commit, which the note names, `terminal_detail_of` is called from three product functions: C5's three. The shape is the same at each, and the bullet is not edited.
- **(ii)** §1's `close_dataset` paragraph was corrected in place, and why (conditional on OPEN-2 (A)).
- **(iii)** No literal, key, value, code or command changes, and `protocol/data-plane/` has an empty diff.

**Not edited:** the `skp/0.3` bullet, the stale `:266` token at `protocol/skp/SKP-V0.md:689 @ a1109023 sha256:HASH-TBD` (append-only), and everything in §8 above its end.

### Owner's index (`kernel/README.md`, applied in the PR, lead-data's text)

- `Last verified at` (`kernel/README.md:350 @ a1109023 sha256:HASH-TBD`).
- Governed by → preregistrations in this module, which gains this form (`kernel/README.md:374 @ a1109023 sha256:HASH-TBD`).
- Governed by → kernel halves of pieces filed elsewhere, which gains `engine/B1-FOLLOWUPS-PREREGISTRATION.md`. This is B1 Amendment 1, item 7, and B1 gate 1's N-4 (`kernel/README.md:376 @ a1109023 sha256:HASH-TBD`).
- No interface pointer moves, so lead-data confirms the Interfaces rows against the diff. The index stays within its 60-line cap.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** no semantics change.
- **R2 and R4:** no `cfg`, and no path literal.
- **R5:** no level claim.
- **R6:** no new ignore.

### KNOWN-LIMITATIONS

No item is owed. No user-visible behaviour changes and nothing is reduced.

## §3. Fixtures

None new. C7 uses the test's own fixture at the base.

## §4. Tests, and the mutation per new test

No new test. Every mutation is applied, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.

| Row | Test | Mutation | Observed at |
|---|---|---|---|
| W-1 | `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` | As written at `kernel/tests/wire_bytes_invariant.rs:368-369 @ a1109023 sha256:HASH-TBD`; unchanged | the base commit, named in the comment; re-made by the reviewer |

**Changed tests, comments only, assertions unchanged:**
- `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` (also its message, C6);
- `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal`;
- `the_dead_ticket_record_is_bounded`.

**Declared unchanged** (OPEN-3 (A)): T1 to T3's recorded-mutation texts (`kernel/tests/session_generation.rs:357-361`, `:432-439` and `:483-485 @ a1109023`, each sha256:HASH-TBD). They name `create_from_ticket`, which composes `liveness_refusal` (the reading in PR #147 gate 1's N3).

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- **P1.** The workspace suite at the head has the base's passed, failed and ignored sets, unchanged.
- **P2.** W-1 fails by name at the base under its mutation, at the per-frame byte-comparison assertion.
- **P3.** At the base, the product callers of `terminal_detail_of` are exactly C5's three functions.
- **P4.** At the base, the holder grep finds no stream-held `Arc<Dataset>`. The grep is `git grep -n "Arc<Dataset>" -- engine/src kernel/src protocol frontends/shell/src-tauri/src`, the catalog form's §6 item 3.

**Declared unchanged:**
- every non-comment line of product code;
- every assertion condition, fixture and test name, and every message except C6's;
- `kernel/tests/skp_projection.rs`;
- SKP-V0 outside C9;
- the close-races, B1, catalog, cancel-state and source-watcher forms;
- every ADR;
- `KNOWN-LIMITATIONS.md`;
- `Cargo.lock`.

**Invalidators (stop and return to the architect; nothing is adjusted to pass):**
- a product non-comment line must change;
- an assertion condition must change;
- W-1 survives at the base;
- P3 or P4 fails;
- C1 cannot be made true without a statement §1 forbids.

**Falsification.** `close_dataset`'s safety, as §1 states it, is shown to depend on a stream-held `Arc<Dataset>`.

## §6. Instruments

All are assertions or readings: one re-made mutation, a grep and a call-site read. None is a measurement.

## §7. Declared values and ceilings

No constant is added or changed. `TICKET_TTL` and `TERMINAL_ENTRY_MAX_AGE` are named only.

**Line budget, by §21c's rule** (insertions plus deletions, tests included; this form and generated files excluded):

| File | Ceiling |
|---|---|
| `kernel/src/skp.rs` | ≤ 60 |
| `kernel/tests/session_generation.rs` | ≤ 40 |
| `kernel/tests/wire_bytes_invariant.rs` | ≤ 12 |
| `frontends/shell/src/streaming/formatTerminalRefusal.ts` | ≤ 10 |
| `protocol/skp/SKP-V0.md` | ≤ 24 |
| `kernel/README.md` | ≤ 6 |
| **Total** | **≤ 152 over these 6 files** |

Conditional rows: OPEN-1 (B) adds `frontends/shell/src/streaming/liveTicketSet.ts` ≤ 16, so the total is ≤ 168 over 7 files. OPEN-3 (B) adds ≤ 20 to `session_generation.rs`.

**Counting command, at a named commit:** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- <the files above>`. An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. A non-comment change to any product line, Rust or TypeScript.
2. A new `pub` or `pub(crate)` item, option, callback or code path (the caller rule).
3. An existing assertion condition, fixture or test name changed, or any message other than C6's.
4. A path in the diff outside §7's list and this form. `protocol/skp/src/`, `protocol/skp/tests/` and `protocol/data-plane/` are shown empty.
5. In SKP-V0, anything beyond C9's in-place sentence and one dated note at §8's end. Also any change to a literal, key, value, code or command, or an edit to the `skp/0.3` bullet.
6. C1, or any comment, that states anything about a reference no client holds, or calls ADR-035's Note 2026-09-25, SKP-V0 §3's third minting rule or SKP-V0's 2026-09-25 note historical, superseded or obsolete.
7. A repointed cite that carries a line number, a new rooted line token in a comment, or a line cite into the ledger.
8. Quotation marks around text that is not byte-identical to its named source, comments included (C4).
9. Any text that calls a prefix site the only one, or a site list in the note that is not stated at a named commit.
10. `close_dataset` text that states a property beyond §1's catalog reading.
11. A rewritten recorded-mutation comment without the commit it was observed at, or with a line number. A record that calls a `verify-mutation` run an observation.
12. An edit to an ADR, to any form §5 declares unchanged, or to `KNOWN-LIMITATIONS.md`.
13. A record hash at a branch commit. A test-text span named without its commit id (round 25, item 2 (d)).
14. The word zero-copy, a performance number or a timing assertion.
15. A new `cfg`, platform ignore or path literal (portability R4 and R6).
16. A `kernel/README.md` change outside the three index lines in §2, or an index over 60 lines.

## §9. Gates

**Architect** (full gating):
- §8, item by item;
- C1 against ADR-035's Note 2026-09-25, SKP-V0 §3's third rule and SKP-V0's 2026-09-25 note, with `adr-035-close-races-note` unrun;
- C9 against §8's append-only rule and the 2026-10-02 precedent;
- C9's `close_dataset` text against the catalog form's §1 item 3;
- C5's and C9's site lists against the base;
- verbatim quotes and discharge claims resolved;
- the round-25 checks: class 8 against §7; class 9 for any addition; the mutation wording; test-text spans.

**Reviewer:**
- the full diff with `origin/main...HEAD`, with the three protocol paths shown empty, and every hunk shown to be a comment, the C6 message, or SKP-V0 or README text;
- §7's count by its command;
- W-1 re-made at the base;
- P3's call-site read and P4's grep, at the base;
- every repointed cite resolved by item at the base;
- every hash recomputed;
- the index lines checked against the diff.

**Suites, green before either gate:**
- `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and `clippy`;
- the shell's unit suite and type check, as Product CI shell runs them;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Operator:** none.

**PR body:** asks for a merge commit, never a squash.

**Closing record (after the merge; references and hashes only):**
1. The PR, its merge commit and the reviewed head.
2. The gate report paths.
3. The worker report, by section.
4. W-1's observation commit, and the rewritten comment pinned at the merge commit with its hash.
5. Each routed item marked done names its proof:
   - row 11's first bullet by C1, C2 to C6 and the pinned comments;
   - item 1.4's `wire_bytes` half by W-1's row and the pinned comment;
   - PR #147's item 6 by C2;
   - PR #148's N1 by C8 and C9 (i);
   - the catalog row by C9 (ii);
   - B1's item 7 by the index line.
6. §7's count.
7. PLAN done with `{pr}` in the done commit only.

## §10. Amendments

*(Opens empty; append-only.)*
````

## 3. OPEN items (the human's)

**OPEN-1. Widening to files the routed items do not edit.**
- **The files:**
  - `liveTicketSet.ts`: lines 35-38 make a false single-site claim, the same defect C8 fixes. Lines 71-72 and 90 carry stale skp.rs cites, one of them naming the mint-race arm that close-races removed.
  - `tileViewportStreamManager.ts:947` and its test at `:1423`.
  - `App.tsx:621` and `:659`.
  - `src-tauri/src/pool_poll.rs:12` and `src-tauri/src/lib.rs:425`.
  - `engine/tests/admission_p4_corpus.rs:408`.
  - `kernel/tests/no_generation_in_persisted_artifacts.rs:8`.
- **Options:**
  - (A) None of them; route them all to a new proposed node.
  - (B) `liveTicketSet.ts` only, routing the rest.
  - (C) All of them: about 9 more files and about 60 more lines.
- **Recommendation: (B).** Without it, the shell's two docs contradict each other after this piece. The rest are line cites only, best swept by item names in one node.
- **What waits:** §2's added item, §7's conditional row and §8 item 4's path list.

**OPEN-2. SKP-V0 §1's `close_dataset` paragraph withdraws a stated property.**
- AI_DEVELOPMENT §B says to escalate when a guarantee changes.
- **Options:**
  - (A) Edit §1 in place and add C9's note, bound to the catalog form's reading.
  - (B) A §8 note only, which flags §1's sentence and leaves §1 unchanged.
  - (C) Take the item out of this piece and give it its own node.
- **Recommendation: (A).** The code does not change, the sentence is false as a description, and §8's own rule keeps §§1–7 as the live current shape (the 2026-10-02 precedent).
- **What waits:** C9's in-place sentence, C9 (ii), §1's may-claim and §8 item 10.

**OPEN-3. T1 to T3's recorded mutations in `session_generation.rs`.**
- None of them names a commit. T1's mutated shape describes the `create_from_ticket` arm as it was before #147. Neither is a routed item.
- **Options:**
  - (A) Declare them unchanged, as drafted, and route them to a candidate node.
  - (B) Re-observe all three at the base in this piece, in B1's K-row shape, adding about 20 lines.
- **Recommendation: (A).** The claims still resolve through the composition in PR #147 gate 1's N3, and no gate or worker routed them.
- **What waits:** §4's declared-unchanged line and §7's conditional row.

## 4. Files read, and the impact read's pointers

**Read:**
- the impact read, in full;
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`;
- `PLAN.yaml`: 2657-2673 and 3080-3117, plus grep for the `gate:` key's values;
- `AUTONOMY.md`: 300-379 and 470-509;
- `docs/PREREGISTRATION-TEMPLATE.md`, in full;
- `state/directives/PORTABILITY-2026-09-30.md`, in full;
- `AI_DEVELOPMENT.md`: 451-467;
- `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`: 355-464;
- the close-races worker report: 55-73;
- the gate reports for #147 (30-59), #148 (40-62) and B1 gate 1 (in full);
- `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, in full;
- `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`: 15-44, plus grep;
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`: 30-41;
- the rustfmt consult: 260-269;
- `docs/adr/ADR-035-...`: 140-159, plus grep;
- `engine/SOURCE-WATCHER-PREREGISTRATION.md`: 473-498;
- `engine/ADMISSION-PREREGISTRATION.md`: 740-745;
- `DECISIONS-PENDING.md`: 38-49 and 998-1002;
- `protocol/skp/SKP-V0.md`: 124-178, 255-269, 318-329, 535-549, 745-774 and 868-992, plus a grep for line tokens;
- `kernel/src/skp.rs`: 530-545, 662-673, 715-736, 1040-1297, 1455-1470, 1540-1614, 1698-1709 and 2004-2075, plus grep;
- `kernel/src/lib.rs`: 388-537 and 655-694;
- `kernel/tests/session_generation.rs`: 296-490, plus grep;
- `kernel/tests/wire_bytes_invariant.rs`: 286-435;
- `kernel/tests/typed_terminal_codes.rs`: 44-71, plus grep;
- `kernel/README.md`: 340-384;
- `frontends/shell/src/streaming/formatTerminalRefusal.ts`: 1-45;
- `frontends/shell/src/streaming/liveTicketSet.ts`: 25-99;
- `frontends/shell/src-tauri/src/lib.rs`: 284-291, 370-379 and 420-434;
- `protocol/data-plane/src/server.rs`: 500-513;
- `engine/src/envelope.rs`: grep only;
- grep for `terminal_detail_of` across `.rs` and `.ts`, for skp.rs line cites repo-wide, and for the three test names.

**Pointers used:** everything in §0; rows S1, S2, S3, S4, S5, S6, S7, S8, S9, S11 to S19; §2's consumer list (it became OPEN-1); §3's ADR-035 note, SKP-V0 :173 and :874-883, SOURCE-WATCHER 475-497, the template lines, AUTONOMY 315-357 and the catalog form; and Q1 to Q5. All three of Q2's and Q3's sources fed C1 and C9. I checked the pointers above against the tree; the test pointers I checked are at the end of this section.

**Pointers found wrong:**
- **Q1** gives the source's capitalised Some in lower case. This is the author's disclosed defect, and it is confirmed at the worker report's line 64.
- **S9** puts the failing assertion's message at `wire_bytes_invariant.rs:427-429`. The `assert!` opens at 427, but the message's format string spans 429-431.
- **S8** says `touch_modification_time` begins at `typed_terminal_codes.rs:66`. Line 66 is the start of its doc comment; the `fn` is at :69. This is imprecise rather than wrong.

**Pointers missing:**
- skp.rs:539-543 calls the ADMISSION form's words the human's own, and changes the source's inner quotation marks (C4). S6 reads that line for its cites only.
- `liveTicketSet.ts:35-38` makes the same false single-site claim as S14. The read's consumer entry also omits that `:72` cites the mint-race arm, which close-races removed.
- T1's assertion message at `session_generation.rs:419-420` names the renamed `isSourceChangedTerminal`.
- `session_generation.rs`'s T1 to T3 recorded-mutation texts name no commit and describe the shape before #147 (OPEN-3).
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:35` is the precedent for the in-file scope rule; the read cites only that form's :38.
- SKP-V0's 2026-10-02 note (`:969-977`) is the precedent for editing §1 in place under a dated note. The read gives it only as the current end of §8.
- AI_DEVELOPMENT §B's escalation rule for a changed guarantee bears on S17 (OPEN-2).
- In `PLAN.yaml`, `gate:` names a form file, so Q3's contrast between `gate: none` and §21a rests on a key that sets no route.
- The read lists `kernel/README.md:376` (S19) but not `:374` or `:350`, which the index update also touches.

**Test pointers checked and correct:** `end_to_end.rs:637`, `source_watch_ordering.rs:336`, `formatTerminalRefusal.test.ts:16`, `skp.rs:4205` and `:2446`, `typed_terminal_codes.rs:342`, and `session_generation.rs:363`, `:441` and `:487`.
