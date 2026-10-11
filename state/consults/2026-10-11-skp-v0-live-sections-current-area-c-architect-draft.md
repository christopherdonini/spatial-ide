*Custodian's filing note (2026-10-11): the architect's draft of `skp-v0-live-sections-current-area-c`'s preregistration, on the custodian's brief at main 58ec72ae, after lead-data's impact read (forms ahead). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is a0181c4d99ade829acf3abac6ef8476d3ebb84b824e585d16dec0639098616f0. Write audit PASS: zero write calls (Read 50, Grep 23, SubagentHandback 1). Run window from the transcript: 02:47:57Z to 03:00:43Z. Committed as the form `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md` in the same commit, with the custodian's 116 pins; its OPEN-1 (for sight) and OPEN-2 are the human's.*

---

Reviewed: main @ 58ec72aeacd1903c501faa1972e6f85bdc152a69

## 1. Form and gating, and what is the human's

**Form: the full form, with full gating from dispatch.** The draft is in section 2. The piece takes the full form for three reasons:
- **§21a, category 3.** The wire contract's text under `protocol/skp/**` changes: SKP-V0.md's normative sections, and doc comments in `protocol/skp/src/v0`.
- **§21a, category 4.** It changes stated guarantees: what a client receives for a refusal, and the exposure statement about publish.
- **Round 25, item 2 (e).** An `Out-of-scope` line at dispatch would have to name these categories as touched, so no five-line form is committed.

Counting by §21c's rule (insertions plus deletions, comment lines and comment-only files included):
- **Lines:** the declared ceiling is 180, or 200 under OPEN-2 (a). That is over the 150-line bound.
- **Files:** 6, plus the form and PLAN.yaml, makes 8. With codec.rs under OPEN-2 it is 9.

**Location.** The form goes at `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md`, beside SKP-V0.md and `CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`. That path becomes PLAN's `gate`.

**Red-line text.** Row S3, publish exposure, is red-line text. It restates ADR-017's 2026-08-17 completion section and adds nothing to it.

**What is the human's:**
- OPEN-1: for sight only. Nothing in the piece waits on it.
- OPEN-2: two rows beyond the node's own list. Only those two rows wait on it.
- The merge click.

No string the app shows changes, so there is no wording sight.

## 2. The draft

````markdown
# SKP-V0.md's live sections brought current to the wire, and three unproduced codes struck (sweep area C) — preregistration (full form)

**Authority.** PLAN node `skp-v0-live-sections-current-area-c` (`PLAN.yaml:4406-4422 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). It was proposed on the human's area C instruction 3 (`state/directives/2026-10-10-drift-sweep-area-c-instructions-filed-late.md:9 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). It was placed as the docs lane's item 3e (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`), under the lane's terms (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). The human's ruling, item 4, widened it (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:30 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). It is drafted ahead of its slot (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). The ruling moves the question of a typed refusal to a named open item (`PLAN.yaml:1977 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`).

**Drafted by** the architect, on the custodian's brief. The inputs were:
- lead-data's impact read (`state/consults/2026-10-11-skp-v0-live-sections-current-area-c-impact-read.md`, whole-file sha256 388dec3644b0bbfe53f655ba6c35aa0c260838bf3412eda9485fc658387cf834 as filed, read at main 5b64b9f8);
- the drift sweep report and the custodian's check;
- the form of piece d (`module-docs-stale-statements`);
- the architect's own reads, all at main 58ec72aeacd1903c501faa1972e6f85bdc152a69 (C below).

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating.** Full form and full gating from dispatch, under round 25, item 2 (e). Two §21a heads apply:
- the wire (`AUTONOMY.md:323-324 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`);
- a stated guarantee (`AUTONOMY.md:325-327 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`).

The §21c line bound is also crossed (§7). The piece amends no ADR and touches no security posture. Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md:15 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`).

**Reuse index.** `tools/reuse.mjs` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c recorded no prior art for this query. The miss is noted, and it does not block.

## §0. Disclosure

- **Pins are historical.** Every `path:line @ C sha256:` below is a pin at C.
  - Before code, the worker recomputes each pin at its base B. B is the merge-base on main after piece d (`module-docs-stale-statements`) has merged, and so after PR #206.
  - Where B's tree no longer matches a pin, the worker names B's tree as authoritative for that row and records the moved line as a class 3 row before code.
  - A changed fact, as opposed to a moved line, is an invalidator (§5).
- **Lines that exist only on a branch** are named in words and never pinned. Piece d edits `kernel/README.md`, and its lines are read at B after it merges.
- **The impact read was taken at 5b64b9f8.** Every line pinned below was re-read at C.
- **Found by the architect beyond the impact read:** rows S10 and S11, and the facts marked (A).
- No measurement, no fixture and no 5 GB read, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten sentence states a fact that its pin shows at B.
- **May not claim:**
  - any behaviour change. No code logic, assertion, test name, literal, fixture or string the app shows changes.
  - that a typed refusal is or will be produced for the three codes. That is the named open item on `first-external-plugin-skp-client`.
  - the text of Tauri's decode error.
  - that the decode rejection is tested end to end. No test drives it through Tauri.
  - that the cancel-key branch's `unknown` is tested. No test reaches it.
  - that the host itself checks a `HexF64` for finiteness. It does not: `HexF64`'s field is public (`protocol/skp/src/v0/codec.rs:38 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`), and no code in `kernel/src` checks finiteness (A).
  - that the conformance harness reads `expected_refusal_code`. Nothing in the tree reads it.
  - any version event, or any wire change.
  - an exposure review or discharge for any surface other than the shell's UI.
  - a Proposed ADR (019, 023) described as binding.
  - a draft's block-on-sight item presented as accepted ADR text.
  - any performance figure, or any platform level.
- **The three `pub` constructors stay, with no caller.** The human's ruling says nothing else changes in `error.rs`. This piece adds no item.
- **ADRs cited, none amended:** 004, 016, 017, 019 (Proposed), 023 (Proposed), 034, 035.

## §2. The change

### 2.0 Rules every rewrite follows

- **(a) Cites.** The text cites by section, item name (fn, test), or ADR number with section or amendment item. It never cites by a bare `path:line`.
- **(b) Tests.** A fact no test pins is not called tested.
- **(c) ADR status.** Status words match the ADR's Status line.
- **(d) Quotes.** No new quotation marks unless the text is byte-copied by script. Existing quoted spans stay byte-identical.
- **(e) One place for the literal.** The current literal is stated in one live sentence only, §4 item 3. §1's lead, §7.1 and §9.1 point there, so that the next bump edits one sentence.
- **(f) Cancellation vocabulary.** ADR-018's words are used only in ADR-018's sense. The cancel rows use the wire's own `state` values.
- **(g) Order of commits.** Rows S1 to S11 first, then the comment rows, then the §8 note (S12) last, so that its list matches the diff.

### 2.1 Rows (SKP-V0.md)

**S1 — §1's shapes (finding 1).**
- **Stale:**
  - `protocol/skp/SKP-V0.md:26 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:60-62 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:79 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `protocol/skp/src/v0/commands.rs:63-69 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1294-1297 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/src/v0/commands.rs:267-290 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1308-1335 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1336-1359 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1360-1363 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/src/v0/commands.rs:223-235 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1967 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - the members' shapes in §8's `skp/0.5` entry: `protocol/skp/SKP-V0.md:840-856 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - in §8's `skp/0.6` entry: `protocol/skp/SKP-V0.md:904-909 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:**
  - `open_dataset`'s response is `{ dataset: DatasetHandle, session: SessionRef }`.
  - The `describe` block gains `coverage`, `checks` and `session_end`, in the shapes the `skp/0.5` entry gives.
  - `schema` rows gain `projectable`.
  - The lead at 60-62 says the block carries every member the host sends at the literal §4 item 3 states, brought current again with no literal change (§8's dated note, S12).
- **Worker's check at B:** struct by struct, every member of `DescribeResponse` and of its nested structs appears in the block. The architect's read at C: every member does, once the four are added.
- **Not:** types or value domains beyond what §8's entries already give. AMBIGUITIES A1 stays as recorded.
- **Tests:**
  - `protocol/skp/tests/fixtures.rs::open_dataset_response_carries_a_session_reference`;
  - `protocol/skp/tests/fixtures.rs::describe_carries_coverage_checks_and_session_end_as_independent_members`;
  - `protocol/skp/tests/fixtures.rs::describe_fixtures_carry_projectable_on_every_schema_row`;
  - `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`.

**S3 — §4 item 1, publish (finding 3; red-line text).**
- **Stale:** `protocol/skp/SKP-V0.md:202 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`, its parenthetical only.
- **Facts:**
  - the binding-local family is outside SKP: `frontends/shell/src-tauri/src/commands.rs:11-12 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` (A);
  - `frontends/shell/src-tauri/src/commands.rs:265 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `frontends/shell/src-tauri/src/commands.rs:402 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `frontends/shell/src-tauri/src/commands.rs:451 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1127-1132 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1134-1142 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - SKP declares no publish request type. This is an absence, asserted by script at B over `protocol/skp/src/v0/commands.rs`.
- **Says:**
  - SKP has no `publish` command.
  - The shell's UI reaches publish through its binding-local `binding_publish_*` commands, outside SKP.
  - ADR-017's exposure-review completion of 2026-08-17 discharged the acceptance condition for that UI surface only.
  - The surfaces ADR-017 names still each need their own review: SKP, CLI-as-product (`publish-bundle` stays developer/test tooling), MCP, plugin, notebook and AI. No more surfaces and no fewer.
- **Not:** any surface beyond ADR-017's text; that SKP may gain publish; that the exposure scope is tested (no test pins it).
- **Tests:** `frontends/shell/e2e/publish.mjs` (drives publish through IPC, by its header); `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`.

**S4 — §1's path sentence (finding 4).**
- **Stale:** `protocol/skp/SKP-V0.md:29-30 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`, the second sentence only.
- **Facts:**
  - `engine/src/dataset.rs:325-327 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `engine/src/dataset.rs:328-332 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - the two shapes, a directory and a glob metacharacter: `engine/src/dataset.rs:1637-1641 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` (A);
  - `kernel/src/skp.rs:2092-2095 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:**
  - The host passes the path to the engine without canonicalizing it.
  - A directory, or a path carrying a glob metacharacter, is refused first, as `engine.identity_ordinal_partitioned_unsupported`.
  - Any other path that is not a file is refused as `engine.source`, with `EngineError::Source`'s own text.
  - The first sentence (UTF-8, absolute, from the OS file picker) stays.
- **Not:** a platform behaviour; a claim that the host checks that the path is absolute.
- **Tests:**
  - `engine/tests/session_identity.rs::a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file`;
  - `engine/tests/session_identity.rs::a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not`;
  - `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`.
- **No canonicalization** is an absence. It is asserted by script at B: every `canonicalize` in `engine/src` and `kernel/src` is listed, and none is on the open path. It is not called tested.

**S5 — the three codes struck (finding 5, the human's ruling).**
- **S5a, §3.**
  - **Stale:**
    - `protocol/skp/SKP-V0.md:184 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `protocol/skp/SKP-V0.md:186-187 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
  - **Facts:**
    - `protocol/skp/src/v0/codec.rs:45-60 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `protocol/skp/src/v0/codec.rs:69-77 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `protocol/skp/src/v0/commands.rs:366-371 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `protocol/skp/src/v0/commands.rs:428-431 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `frontends/shell/src-tauri/src/commands.rs:86-90 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `frontends/shell/src/skp/client.ts:33-42 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `frontends/shell/src/skp/client.ts:58-65 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - Tauri invoke is the only binding: `protocol/skp/SKP-V0.md:207-211 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
  - **Says:**
    - The lead says a malformed value is rejected, never parsed on a best-effort basis.
    - The `HexF64` bullet: a wrong length or case, or a non-finite bit pattern, is rejected by `HexF64`'s deserializer while the request is decoded, before any command runs.
    - The host returns no `SkpError` for it. On the Tauri binding the shell's client receives an error that is not an `SkpError`, records it as thrown, and rethrows it unchanged (`call` in `client.ts`).
    - The bullet's ADR-004 amendment 1 and spike M4 sentences stay.
  - **Not:** the error's text; a test end to end; a host-side finiteness check.
  - **Tests:**
    - `protocol/skp/src/v0/codec.rs::tests::hex_f64_rejects_wrong_length_case_and_prefix`;
    - `protocol/skp/src/v0/codec.rs::tests::hex_f64_rejects_non_finite_bit_patterns`;
    - `protocol/skp/tests/conformance/main.rs::spec_derived_fixtures_against_wire_types`;
    - the case in `frontends/shell/src/skp/client.test.ts` that records an untyped transport failure as thrown and rethrows it.
    - No test drives a Tauri decode rejection.
- **S5b, §5.**
  - **Stale:** `protocol/skp/SKP-V0.md:329-331 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
  - **Facts:**
    - the constructors: `protocol/skp/src/v0/error.rs:74-80 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `protocol/skp/src/v0/error.rs:82-88 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `protocol/skp/src/v0/error.rs:90-96 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - no call site, asserted by script at B: `git grep` for each constructor's call over `*.rs`, `*.ts` and `*.tsx`, outside its definition. The script is self-tested positive.
  - **Says:**
    - The `skp.` example list drops the three codes. The rest of the list and its ellipsis stay.
    - One new line lists `skp.unknown_handle`, `skp.malformed_hex_f64` and `skp.bbox_not_finite` as reserved and not produced at `skp/0.x`, pointing to §3 for `HexF64` and to §1 `cancel` for an unknown handle.
- **S5c, §1 `cancel`.**
  - **Change:** one sentence is added after the first sentence of `protocol/skp/SKP-V0.md:119-123 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
  - **Facts:**
    - `protocol/skp/src/v0/commands.rs:464-469 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `kernel/src/skp.rs:1556-1568 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `kernel/src/skp.rs:330-331 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `kernel/src/skp.rs:954-957 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
    - `kernel/src/skp.rs:73-79 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
  - **Says:**
    - The host tells the two kinds apart by shape. A well-formed `sh_` handle is looked up among tickets; any other string is looked up among in-flight opens.
    - A handle found in neither answers `state: "unknown"`.
    - A version mismatch is still refused first.
  - **Tests:**
    - `kernel/src/skp.rs::tests::cancel_on_an_unknown_handle_is_unknown_not_an_error`;
    - `kernel/src/skp.rs::tests::the_real_cancel_responses_match_the_shared_fixtures`;
    - `kernel/src/skp.rs::tests::version_mismatch_is_refused_before_anything_else`.
    - The cancel-key branch's `unknown` is stated from code only.
- **S5d, `protocol/skp/src/v0/error.rs`.**
  - **Change:** insertions only. Each of the three constructors gains `///` lines directly above it, saying it is reserved and not produced at `skp/0.x`, that nothing calls it, and pointing to SKP-V0.md §5.
  - Nothing else in the file changes, the test literal at `protocol/skp/src/v0/error.rs:153 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` included.

**S9 — the literal (finding 9).**
- **Stale:**
  - `protocol/skp/SKP-V0.md:15 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:219-221 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:361 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:1096 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:1101-1103 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `protocol/skp/src/v0/mod.rs:109 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1614-1619 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `frontends/shell/src/skp/types.ts:15 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - the §8 entries: `protocol/skp/SKP-V0.md:956 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:993 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:1021 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:1055 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:**
  - §4 item 3 gains one sentence: `skp/0.7` to `skp/0.11` each bumped the literal again in turn (§8), `==` unchanged, and the literal the host compares today is `skp/0.11`.
  - §1's lead says every request carries the version literal stated in §4 item 3 (`skp/0` at v0), compared as before.
  - §7.1 and §9.1 each gain a dated note, with no literal change: the literal has been bumped since, and §4 item 3 states the current one.
- **Tests:**
  - `protocol/skp/tests/fixtures.rs::skp_version_is_skp_0_11`;
  - `protocol/skp/tests/fixtures.rs::every_request_fixture_carries_the_current_skp_version`;
  - `kernel/src/skp.rs::tests::version_mismatch_is_refused_before_anything_else`.

**S10 — §9.5's heading (the check's observation).**
- **Stale:** `protocol/skp/SKP-V0.md:1152 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `protocol/skp/SKP-V0.md:1156-1163 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:1169-1173 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:** the heading names eight codes, in place.
- **Why not §7.5's precedent** (`protocol/skp/SKP-V0.md:497 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`): §7.5's twelfth code was added in a note and never in its table. §9.5's table already carries the eighth row, so the heading is the only line out of step with the table beneath it.

**S11 — §5 cited as §6 (A).**
- **Stale:**
  - `protocol/skp/SKP-V0.md:256 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:468 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `protocol/skp/SKP-V0.md:319 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:338 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:** §5, in both places. Nothing else in either line changes.

**S12 — §8 dated note, appended.**
- **Where:** one dated note, no literal change, appended after the last line of the covering note (`protocol/skp/SKP-V0.md:1079-1086 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`) and before `## 9.`.
- **Shape:** it follows the precedents (`protocol/skp/SKP-V0.md:975-983 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`; `protocol/skp/SKP-V0.md:1043-1053 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`).
- **It names the PLAN node, and B as a full commit id on main.** It records:
  - (i) each in-place change of S1, S3, S4, S5a to S5c, S9, S10 and S11, by section;
  - (ii) that the three codes were never produced, are struck by the human's ruling (the directive, item 4), and are listed in §5 as reserved;
  - (iii) that the conformance fixtures' `expected_refusal_code` values for the nine `HexF64` fixtures still name two of those codes, unchanged under the ruling, and that nothing reads that field; and that AMBIGUITIES A3 and A8 stay as recorded;
  - (iv) the reading this piece applies: §§1–7 and §9 are the live current-shape description. §8's preamble names §§1–7 (`protocol/skp/SKP-V0.md:547-550 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). §9 is laid out as §7 and updated in place by its own dated notes. §7's lead of 2026-08-13 (`protocol/skp/SKP-V0.md:351-352 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`) describes §§1–6 as they stood then;
  - (v) that no key, value or command is added or removed, that no code the host produces is added or removed, that the kernel's serialized responses are unchanged, and that `protocol/data-plane/` has an empty diff.
- **The preamble is not edited.**

### 2.2 Comment rows

**S6 — `frontends/shell/src/skp/types.ts` (finding 6).**
- **Stale:** `frontends/shell/src/skp/types.ts:290-292 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `frontends/shell/src/skp/events.ts:23 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `frontends/shell/src/skp/events.ts:59 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `frontends/shell/src/App.tsx:1206 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:** `skp/events.ts`'s `decodeDatasetSessionEnded` and `listenDatasetSessionEnded` consume this event; this file mirrors only the wire shape.
- **Tests:** the `decodeDatasetSessionEnded (SH6)` block in `frontends/shell/src/skp/events.test.ts`. No test names the listener.

**S7 — `protocol/skp/src/v0/handles.rs` module doc (finding 7).**
- **Stale:** `protocol/skp/src/v0/handles.rs:4-13 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `protocol/skp/src/v0/handles.rs:104-113 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:175 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `protocol/skp/SKP-V0.md:177 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:**
  - Three minting rules, one type per kind.
  - A third bullet: `SessionRef`, kernel-minted, names a kernel-side session, authorizes nothing, and no command's request accepts it (`skp/0.5`).
  - All four kinds are session-scoped and non-persistable.
  - The two existing bullets stay.
- **Tests:** `protocol/skp/tests/fixtures.rs::open_dataset_response_carries_a_session_reference`.

**S8 — `projection_error_of`'s doc (finding 8).**
- **Stale:** `kernel/src/skp.rs:1720-1721 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `kernel/src/skp.rs:1725-1782 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `kernel/src/skp.rs:1686-1693 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` (A);
  - `protocol/skp/SKP-V0.md:1135-1136 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Says:** the seven `skp.projection_*` codes are mapped from `ProjectionError`. The eighth, `skp.projection_empty_list`, is minted in `viewport_query_build_error_of`, not here.
- **Tests:**
  - `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint`;
  - `protocol/skp/tests/fixtures.rs::every_new_projection_error_fixture_round_trips`.

### 2.3 Conditional rows (OPEN-2; applied only on the answer)

**S5e — `protocol/skp/src/v0/codec.rs`.**
- **Stale:** `protocol/skp/src/v0/codec.rs:15-16 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:** `protocol/skp/src/v0/codec.rs:69-77 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`, and S5b's no-call-site script.
- **Says:**
  - Why a `HexF64` failed to decode, in two cases.
  - `HexF64`'s `Deserialize` turns either case into a serde error carrying this `Display` text.
  - No caller maps either case to an SKP code. The two codes are reserved and not produced at `skp/0.x` (SKP-V0.md §5).

**SX2 — `kernel/src/skp.rs`, the naming-rule cite.**
- **Stale:** `kernel/src/skp.rs:417-420 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`. Recorded for this piece by `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:338 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`.
- **Facts:**
  - `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`;
  - `docs/adr/ADR-016-stable-feature-identity-admission.md:238 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`. The accepted text is the draft's Proposed text block, which holds no block-on-sight items.
- **Worker first:** confirms that 433413a is on main, and reads the draft's block-on-sight 3 at 433413a.
- **Says:** the parenthetical names the rule's origin in words, as history: block-on-sight 3 of the draft amendment to ADR-016, `docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md` at 433413a, deleted at acceptance. It never presents the rule as ADR-016 Amendment 1's accepted text.

### 2.4 Places outside the node that name the three codes

| Place | Decision | Why |
|---|---|---|
| `protocol/skp/src/v0/error.rs:153 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` | out | test data for the envelope's default, not a statement of what a client receives; a test literal is outside the lane and the ruling |
| `protocol/skp/src/v0/codec.rs:15-16` (S5e) | OPEN-2 | a doc comment the ruling does not name |
| `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:129 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` and `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:275 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` (nine values by `git grep -c` at B: six `skp.malformed_hex_f64`, three `skp.bbox_not_finite`) | out (no fixture change); disclosed by S12 (iii); OPEN-1 | the field is defined at `protocol/skp/tests/conformance/README.md:15-16 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` and read by nothing |
| `protocol/skp/tests/conformance/AMBIGUITIES.md:11 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` (A3) and `protocol/skp/tests/conformance/AMBIGUITIES.md:16 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` (A8) | out; named by S12 (iii) | a phase-1 record of the spec at bb98f71, recorded and not resolved (`protocol/skp/tests/conformance/AMBIGUITIES.md:3-5 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`); its consequence column stays true |
| `frontends/shell/CANCELLATION-FACTS.md` | out | a cut record, already consistent |

**Already current, no change:**
- finding 2 (`protocol/skp/SKP-V0.md:485-492 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`);
- §3's two-rules lead (`protocol/skp/SKP-V0.md:164 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`), with the third rule stated beside it at 175.

**Observed, not in scope, for the custodian to route:** `protocol/skp/src/v0/commands.rs:199-200 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` calls ADR-016 Amendment 1 PROPOSED, but it is Accepted.

### 2.5 In place, or appended

- **Edited in place:** current-state text, which is SKP-V0.md §§1–5, §9.5's heading and the doc comments.
- **Added as dated notes:** §7.1 and §9.1, each beneath its existing text.
- **§8 is append-only.** The S12 note is the only §8 change. Append-only is proved against B: §8's text from its heading through the covering note's last line is byte-identical at H.

### 2.6 Owner's-index update

lead-data writes it before the final gate (the pilot's §1 item 2), and the worker applies it in this PR.
- **`kernel/README.md`, Governed by:** the line listing the kernel halves of pieces filed elsewhere gains this form (`kernel/README.md:378 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`, read again at B after piece d).
- **lead-data checks three pointers against H:**
  - SKP v0 host (`kernel/README.md:352 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`);
  - stream tickets (`kernel/README.md:353 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`);
  - wire error codes (`kernel/README.md:359 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`).

  None is expected to change.
- **`engine/README.md`:** no change, since no engine file is touched.
- **`protocol/`** has no owner's index, and this piece creates none. Its absence is reported to the custodian.
- **Last verified at:** the line is untouched unless lead-data re-checks every pointer in the section.

### 2.7 Overlap (rule 00) and wait

- **Paths:**
  - `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/error.rs` and `protocol/skp/src/v0/handles.rs`, under `protocol/`;
  - `protocol/skp/src/v0/codec.rs` under OPEN-2, also under `protocol/`;
  - `kernel/src/skp.rs`, `frontends/shell/src/skp/types.ts` and `kernel/README.md`;
  - this form, under `protocol/`;
  - `PLAN.yaml`.
- **Code waits for piece d to merge** (PLAN `depends_on`). Piece d itself waits on #205 and #206, so #206's `protocol/skp/tests/data/v0-error-example.json` is on main before B.
- **The branch is cut from main after piece d.** `kernel/README.md` is shared with piece d only in sequence.
- **At dispatch:** no other piece in progress and no PR awaiting merge touches `protocol/` (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD`). Rule 00 is re-checked for every path above against both slots and every PR awaiting merge.

### 2.8 Portability (R1-R6)

- No OS-dependent feature is added or changed, so R3's section does not apply.
- No rewrite states a platform behaviour. S4 names the engine's refusals only, not its Windows prefix handling.
- No platform level is claimed (R5). The Tauri statements rest on code, not on a run.

## §3. Fixtures

None changed. No file under `protocol/skp/tests/`, `frontends/shell/src/skp/__tests__/` or `protocol/data-plane/` changes.

## §4. Tests, and the mutation per new test

- **No new test,** no assertion change and no rename.
- **No mutation is owed.** No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Run by name at H:**
  - every test named in §2;
  - `cargo test -p spatial-skp --test fixtures` and `--test conformance`;
  - `frontends/shell/src/skp/__tests__/fixtures.test.ts` (both fixture loaders).

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:**
  - **E1.** Every changed line in a `.rs` or `.ts` file is a comment line. The `error.rs` diff is `///` insertions only, directly above the three constructors.
  - **E2.** `cargo test -p spatial-skp -- --list` and `cargo test -p spatial-kernel -- --list` are identical at B and H.
  - **E3.** The §4 runs pass.
  - **E4.** `cargo doc --no-deps -p spatial-skp -p spatial-kernel` warnings at H are a subset of those at B.
  - **E5.** `cargo fmt --all -- --check` exits 0, and the shell's lint and format checks pass as CI runs them.
  - **E6.** At H, each named with its commit: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0; `queue.mjs --check` and `site.mjs --check` report current; the `node --test` scripts suites exit 0.
  - **E7.** `git diff --quiet B H -- protocol/skp/tests protocol/skp/src/v0/mod.rs protocol/skp/src/v0/commands.rs protocol/data-plane frontends/shell/src/skp/__tests__` exits 0, and `types.ts` line 15 is identical.
  - **E8.** The 2.5 byte check holds.
  - **E9.** Outside §8 at H, each of the three codes appears in SKP-V0.md exactly once, on §5's reserved line. This is checked by script, with the pattern self-tested positive.
  - **E10.** PR CI is green.
- **Declared unchanged:**
  - every code token, assertion, literal, fixture and test name;
  - all ADR files, `KNOWN-LIMITATIONS.md` and `engine/**`;
  - `protocol/skp/src/v0/error.rs` outside the three insertions.
- **Invalidators (stop and report):**
  - a pinned fact that changed at B, as opposed to a moved line;
  - a rewrite that would need a code, literal or fixture change;
  - a fact with no pin;
  - exposure text that ADR-017 does not carry;
  - a `DescribeResponse` member at B that the block lacks, beyond the four;
  - for SX2 only: 433413a is not on main, or its block-on-sight 3 is not this rule.
- **Falsified if** any rewritten sentence is shown untrue at B.

## §6. Instruments

Assertions only (E1 to E10). No measurement.

## §7. Declared values and ceilings

- **Counting.** Count with `git diff --numstat B...H -- <path>`, insertions plus deletions. B and H are named in the PR body. The form and PLAN.yaml are outside the line count and inside the file count.
- **Per-file ceilings:**
  - `protocol/skp/SKP-V0.md` 130
  - `protocol/skp/src/v0/error.rs` 9, insertions only
  - `protocol/skp/src/v0/handles.rs` 24
  - `kernel/src/skp.rs` 6
  - `frontends/shell/src/skp/types.ts` 8
  - `kernel/README.md` 2
- **OPEN-2 additions,** applied only on the answer: `protocol/skp/src/v0/codec.rs` 8; `kernel/src/skp.rs` +10.
- **Totals:** at most 180 lines and 8 files; with OPEN-2 (a), at most 200 lines and 9 files.
- **No constant is added.**
- **An overrun is class 8,** and this section is never edited.

## §8. Block-on-sight

1. A changed non-comment line in any `.rs` or `.ts` file.
2. Any literal, fixture, assertion, test name or string the app shows changes.
3. In `error.rs`, anything but `///` insertions directly above the three constructors.
4. A path outside §7 changes.
5. A rewritten sentence that claims more than its pin shows. That includes Tauri's error text, an end-to-end test, a host finiteness check, a tested cancel-key `unknown`, a future typed refusal, or a reader of `expected_refusal_code`.
6. Exposure text beyond ADR-017's 2026-08-17 completion section and the paragraph above it. This is red-line text and never documentation-only.
7. An accepted ADR called Proposed in a touched line, or a Proposed ADR called accepted or binding. A draft's block-on-sight item presented as accepted text.
8. Any edit to an existing §8 line, the preamble included, or the S12 note placed anywhere but after the covering note.
9. A version entry added to §8, or the change described as a version bump.
10. Any of these: a new bare `path:line` in SKP-V0.md or a comment, a pin split across lines, or a pin at a branch commit.
11. A quotation not byte-copied, or a byte changed inside an existing quoted span.
12. Code before piece d has merged, or while another piece or open PR touches `protocol/`.
13. A conditional row applied before its answer.
14. A §7 overrun not recorded as class 8, or §7 edited.
15. A scope addition not recorded as class 9 before its code.
16. ADR-018 vocabulary used outside ADR-018's sense.

## §9. Gates

- **Architect (full gating).** Checks the principles; ADR-017's exposure text (red line); ADR-004 amendment 1's bit-pattern rule, which is kept; ADR status words; ADR-018 vocabulary; then §8, one item at a time.
- **Reviewer.** The full diff; E1 to E10; every rewritten sentence against its pin at B; the struct-by-struct describe check; the absence scripts of S3, S4 and S5b.
- **Verdicts follow product-first section 2.**
  - Correctness covers each sentence's truth: an unsupported claim of a guarantee or a limit is Correctness, never Documentation.
  - Evidence covers E1 to E10.
  - Documentation findings are fixed before the merge, with no re-gate.
- **Briefs** carry `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:HASH-TBD` for E2 to E5, and no other build rule.
- **Operator:** none. No walkthrough row and no sight.
- **KNOWN-LIMITATIONS:** no item is added or edited. None names `HexF64`, SKP-V0 or an SKP literal.
- **Budget:** 90 minutes, as the node records.

## §10. Amendments

Opens empty, append-only, classes 1 to 9.
````

## 3. OPEN items

**OPEN-1: the nine `expected_refusal_code` values in `refusals-any-layer.json`.** These values name two of the struck codes. The ruling forbids a fixture change.
- **Options:**
  - (a) Leave the values unchanged. S12 (iii) discloses that they name reserved codes and that nothing reads the field.
  - (b) The human places a later node that changes or removes the nine values. That is a fixture change, outside this piece.
- **Recommendation:** (a). Take (b) only if the human wants the conformance fixtures to stop naming reserved codes.
- **Red line:** no.
- **What waits on it:** nothing in this piece. It is raised for sight.

**OPEN-2: two rows beyond the node's listed statements.** They are S5e, `codec.rs` lines 15-16 (the doc comment that says a caller maps its two cases to the struck codes), and SX2, `kernel/src/skp.rs` lines 417-420 (which piece d's form records for this piece). I raise this as the human's because piece d's form made its beyond-node rows conditional (its OPEN-2). The custodian may judge both rows to be within the docs lane's terms, which allow comments only.
- **Options:**
  - (a) Take both rows in.
  - (b) Take `codec.rs` only.
  - (c) Take neither. `codec.rs` then contradicts the struck spec, and SX2 needs a new home, since piece d excludes it.
- **Recommendation:** (a).
- **Red line:** no.
- **What waits on it:** S5e and SX2 only. The rest of the piece may start once its wait conditions hold.

## 4. Files read

**Read:**
- the impact read (whole);
- `PLAN.yaml` 4380-4479, with line 1977 by grep;
- both directives (whole);
- the drift sweep report and the custodian's check (whole);
- `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md` (whole);
- `docs/PREREGISTRATION-TEMPLATE.md` (whole);
- `AUTONOMY.md` 306-391 and 476-483;
- `protocol/skp/SKP-V0.md` 1-564, 640-669, 836-915 and 940-1192, with grep;
- `protocol/skp/src/v0/error.rs` (whole);
- `codec.rs` 1-90;
- `handles.rs` 1-120;
- `commands.rs` 55-442, with grep at 464-469;
- `mod.rs` 95-110;
- `kernel/src/skp.rs` 60-84, 316-335, 405-429, 940-964, 1290-1365, 1550-1624, 1680-1695, 1712-1785, 1960-1969 and 2086-2097, with grep;
- `kernel/README.md` 340-387;
- `frontends/shell/src/skp/types.ts` 280-299;
- `client.ts` 1-80;
- `frontends/shell/src-tauri/src/commands.rs` 1-110, with grep;
- `engine/src/dataset.rs` 314-335 and 1636-1660;
- ADR-016 176-241;
- ADR-017 1120-1149;
- the conformance README and `AMBIGUITIES.md` (whole);
- `refusals-any-layer.json` 110-159, with grep;
- `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md` 1-14;
- `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md` 238-261;
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` 1-30;
- the product-first directive 10-17;
- the machine directive 10-23;
- the PORTABILITY headings, by grep;
- greps across `engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md`, `events.ts`, `client.test.ts`, `engine/tests/session_identity.rs`, `fixtures.rs` and the kernel test names.

**Impact-read pointers used:** almost all of them. That covers its §1 findings and the code-naming places, its §2 facts and tests, the ADR status lines in its §3, its §4 overlap pointers (#206's form 104/200/298, #207's 259, piece d's 338/388) and its five questions. They are answered in 2.1 (S12 (iv) for Q1 and Q2), 2.4 (Q3), 2.3 (Q4, plus :164 and :256) and S10 (Q5).

**Found wrong:** none at C. One pointer is imprecise. `frontends/shell/src/skp/client.ts:59-61` is described as typing a value shaped like an `SkpError`, but the shape test is `isSkpError` at lines 33-42, and 59-62 is the branch.

**Missing from the impact read:**
- `state/directives/2026-10-10-drift-sweep-area-c-instructions-filed-late.md:9`, the human's instruction that originates the node;
- `codec.rs:38`'s public field, and the absence of any finiteness check in `kernel/src`, which bound S5a;
- `kernel/src/skp.rs:1686-1693`, the eighth projection code's mint site;
- `frontends/shell/src-tauri/src/commands.rs:11-12`, the binding-local family outside SKP;
- `ADR-016:238`: the accepted Amendment 1 is the draft's Proposed text block, with no block-on-sight items;
- `SKP-V0.md:338` (§6's heading, which proves 256 and 468 wrong), `:351-352` (§7's unrewritten lead) and `:547` (§8's append-only sentence, which bears on Q1 and Q2);
- the conformance README at 15-16 and 21-25, which define the field and `refused_any_layer`;
- `commands.rs:464-469`, `CancelRequest.handle` as a `String`;
- `engine/src/dataset.rs:1637-1641`, the two partitioned shapes;
- `commands.rs:82-221`, the nested describe structs for the every-member check;
- `kernel/README.md:378`, the index line the update edits;
- `commands.rs:199-200`, an adjacent stale Proposed label.
