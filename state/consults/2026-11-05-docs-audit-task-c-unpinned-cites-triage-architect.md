*Custodian's filing note (2026-11-05): the architect's triage reading of the platform docs audit's Task C (the unpinned path-and-line cites under docs/ whose cited line no longer says what the citing sentence claims, its rows 1 to 87), under the human's direction of 2026-11-05, item 2 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`): the drift sweeps and the two docs audits triaged as on 2026-10-10, confirmed findings to nodes by the custodian's grading. Its brief by file (sha256 bd4ba94326ae50e5cefa9206a4e3c2106e2f5fe7712db7f8347a4cb6a2d4bd40), carrying the human's Part 1 rulings of 2026-11-05 by reference; its inputs the filed audits `state/consults/2026-11-03-cloud-adr-docs-audit-report.md` and `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md` and the filed comparison `state/consults/2026-11-05-platform-and-cloud-adr-docs-audit-comparison.md`; read at main 61a677d7. The run 18:55:47Z to 19:05:22Z by its transcript (claude-opus-5-5; unique calls Read 106, Grep 49, Glob 5 and the hand-back, equal to the notification's). Extracted by script from the hand-back message in that transcript (31349 bytes, sha256 f972a9b4157c4f71cd7e4dc06c99b6b66d68d83c716ece8a9aab93ea79beb225). Two changes: three path-and-line cites to a form at its path before governance piece F moved it are written as the path and then the word line with the number, so that `verify-cites.mjs` does not gate them as cites on main; and the brief's path in its list of files read is written from `<the session scratchpad>/`, a profile path being kept out of tracked files; nothing else is changed. A reading, not Authority: the grading and any node are the custodian's; ADR text, Status lines, notes and amendments and KNOWN-LIMITATIONS words are the human's.*

---

**Verdict:** none. This is a triage reading, not a gate, so it gives no Correctness, Evidence or Documentation verdict. Reviewed: main @ 61a677d7. That commit is HEAD in the session's git status. I have no shell, so I could not confirm it, and I could not check the brief's sha256. The working tree has staged edits from the custodian. None of them is in a file I read. Every node is cited by its id.

Tag: `triage:docs-audit@task-c`. "Row n" means row n of the Task C table in `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md`, which was worked at 652752af. Every verdict comes from reading files on main; I ran nothing. On main, every citing line still sits at the line number the audit gives. Byte-copied line text has its leading indentation trimmed. Where I write "→ X", X is where the claimed thing is on main.

**Totals:** 82 CONFIRMED, 5 PARTLY (rows 12, 15, 20, 38 and 55), 0 NOT CONFIRMED.

In 14 rows I found the claimed thing at a different or more exact place than the audit did. These are rows 5, 18, 30, 34, 37, 42, 43, 47–49, 54, 64, 66, 69, 84 and 86, and each is noted at its row.

**Two notes for filing:**
- Rows 60 and 69 quote rooted cites to an old path, `engine/ADMISSION-PREREGISTRATION.md` line 248 and `:252`. Those strings may trip verify-cites under `state/consults/`, so run it before committing.
- Rows 1 and 77 quote `DECISIONS-PENDING.md:37` only as the ADRs' own text. I do not cite the ledger or its archive by line.

## ADR-013, rows 1–3
- **Status:** `**Status:** Accepted — 2026-08-09, with the granularity ruling and three clarifications recorded in the **Acceptance appendix** below`
- **Where the cites sit:** all in `## Amendment 1 — a geographic-degrees CRS instance, and how it is displayed (2026-09-23, appended — Accepted)`. Row 3 is in its "**Owed at acceptance.**" paragraph.

- **Row 1, CONFIRMED.**
  - The cite: `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:288`, quoting the ADR: `DECISIONS-PENDING.md:37`.
  - On main the ledger's line at that number is a bullet of a later RULED block: `- **Applied this session:** the filing; the form committed from the draft with the settlement, its cites pinned by script; then the build.`
  - The ledger shifts with every block added at its top, so any line cite into it is unstable by design.
  - → The ruling is entry 59, ruled 2026-09-08 (evening). The ledger's own header sends pre-rotation line references to the 2026-10-20 cut archive, which carries the "equirectangular wording" text. I give no line there, as the brief requires.
- **Row 2, CONFIRMED.**
  - The cite: `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:303`, quoting `frontends/shell/src/canvas/tileGrid.ts:78`, "justified at `:73-77`".
  - `frontends/shell/src/canvas/tileGrid.ts:77-78` now says the opposite of the claim: `THE DATASET'S OWN COORDINATE UNIT (`skp/0.4`, crs-unit-fact-and-bounds) -- one authoritative-CRS` / `unit is not one span in every unit a dataset can declare.`
  - → `frontends/shell/src/canvas/tileGrid.ts:97` (`MIN_ANCHOR_SPAN: Record<CrsUnit, number>`). The metre rationale is at `frontends/shell/src/canvas/tileGrid.ts:81-82`.
- **Row 3, CONFIRMED.**
  - The cite: `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:328`, quoting `frontends/shell/src/canvas/tileGrid.ts:78` and `frontends/shell/src/canvas/offsetFrame.ts:37`.
  - The tileGrid line is as in row 2, and `frontends/shell/src/canvas/offsetFrame.ts:37` is blank.
  - → `frontends/shell/src/canvas/offsetFrame.ts:64` (`RECENTER_MAX_DRIFT: Record<CrsUnit, number>`).
  - The sentence also says, in the present tense, "Item 6 is not true of the build". `crs-unit-fact-and-bounds` is done, so that is no longer true of these two constants. Item 6's remaining class is still open on `crs-zoom-constants-per-unit` (proposed).

## ADR-020, rows 4–14
- **Status:** `**Status:** **Accepted — 2026-08-13, by the human**, on the 2026-08-12 architect security review`
- **Where the cites sit:** all in `## Amendment 1 — the tauri build --debug origin selector replaced by a config mirror (2026-09-08, rewritten on the human's ruling)`.
- Files: `lib.rs`, `commands.rs` and `state.rs` resolve to `frontends/shell/src-tauri/src/`.

- **Row 4, CONFIRMED.** `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:213` cites `lib.rs:174`. That line is `enum OriginSelfCheckOutcome {`. → `frontends/shell/src-tauri/src/lib.rs:183`.
- **Row 5, CONFIRMED.**
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:301` cites `lib.rs:374-377`.
  - On main that range is `if !origin::main_window_url_is_app(&main_window_config.url) {` and the start of a `refuse_to_start(` call. That is another startup site, not the pump-history comment the audit reported.
  - → `serve(DataPlaneConfig {` at `frontends/shell/src-tauri/src/lib.rs:423`, and its `.expect(` at `frontends/shell/src-tauri/src/lib.rs:439`.
- **Row 6, CONFIRMED.** `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:303` cites `lib.rs:493`. That line is `// all, so nothing here still depends on this block running before anything else in this`. → `frontends/shell/src-tauri/src/lib.rs:559-560`.
- **Row 7, CONFIRMED.**
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:435` cites `commands.rs:61-66`.
  - The range runs from `request: OpenDatasetRequest,` to the `spawn_blocking` `.unwrap_or_else(...)`, and the poll start is not in it.
  - → `frontends/shell/src-tauri/src/commands.rs:67-72`.
- **Row 8, CONFIRMED.**
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:437` cites `commands.rs:114-` / `120`.
  - The range runs from `not(any(debug_assertions, feature = "measure-build")),` to `state: State<'_, Arc<SkpHost>>,`.
  - → The stop is at `frontends/shell/src-tauri/src/commands.rs:126-129`.
- **Row 9, CONFIRMED.** `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:443` cites `commands.rs:416`. That line is a doc line on `run_exclusive`'s registration. → `frontends/shell/src-tauri/src/commands.rs:535-537`.
- **Row 10, CONFIRMED.** Same line, `lib.rs:490`. That line is `// **Restored to this position (ADR-020 Amendment 1's rewrite, 2026-09-08):** the`. → `frontends/shell/src-tauri/src/lib.rs:556-557`.
- **Row 11, CONFIRMED.** `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:445` cites `frontends/shell/src/publish/PublishPanel.tsx:294`. That line is `/** `PublishDialog`'s own settle result, turned into this panel's next state -- pure, covering`. → `frontends/shell/src/publish/PublishPanel.tsx:571`.
- **Row 12, PARTLY.**
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:516` cites `state.rs:41-50`.
  - Lines 41–45 are the constructor's `Ok(Self {`.
  - Line 47 does state the format: `/// Append one line: `<unix-ms> <level> <message>`.`
  - The `format!` that builds the line is outside the range. → `frontends/shell/src-tauri/src/state.rs:47-56`.
- **Row 13, CONFIRMED.**
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:666` cites `AI_DEVELOPMENT.md:233`.
  - That line is `run concurrently — the E2E's fixed step timeouts are load-sensitive (2026-09-13: a regression run`.
  - → Rule 7 is at `governance/AI_DEVELOPMENT.md:369`. The quoted words match it, without the bold markers.
- **Row 14, CONFIRMED.**
  - `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:674` cites `AI_DEVELOPMENT.md:147`.
  - That line is `- **A hash-pinned upstream corpus keeps its own bytes: `-text` scoped to the pinned files, never`.
  - → `governance/AI_DEVELOPMENT.md:209`.

## ADR-021, row 15
- **Status:** `**Status:** **Accepted — 2026-08-13, by the human**, carrying the acceptance condition below.`
- **Where the cite sits:** `## Amendment 2026-09-15 — the no-runtime-fetch property is held by configuration, not only by content`. This is security-posture text, a red line.

- **Row 15, PARTLY.**
  - `docs/adr/ADR-021-row-filter-on-viewport-query.md:214` cites `engine/src/layout.rs:269`.
  - That line sits inside the comment for the same open site: `// geometry stays BLOB in and BLOB out and the WKB bytes that arrive are the WKB bytes that`.
  - The call is 3 lines below. → `engine/src/layout.rs:272`, with its comment at `engine/src/layout.rs:265-271`.

## ADR-023, rows 16–53
- **Status:** `**Status:** Proposed — **decision deliberately undrafted; binds nothing.**`
- Its Record line says the Decision text was accepted as drafted, with two §2 amendments, by the human on 2026-09-14, and that the Status stays unchanged until B1's close.
- **Where the cites sit:** all in the body, under `## Decision`, which was "Ported verbatim" from the B1 consult.
- Bare `attributes.rs` resolves to `engine/src/attributes.rs`, `envelope.rs` to `engine/src/envelope.rs`, and `stream.rs` to `engine/src/stream.rs`.

- **Row 16, CONFIRMED.** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:37` cites `protocol/skp/src/v0/commands.rs:256-264`. That range is `pub struct LicenseInfo {` and its fields. → `protocol/skp/src/v0/commands.rs:433-441`, and `columns` at `protocol/skp/src/v0/commands.rs:442-448`.
- **Row 17, CONFIRMED.** Same line, `protocol/skp/SKP-V0.md:321-333`. That range is the `skp/0.5`/`skp/0.6` assembly notes, for example `them**: one commit changed the Rust-side literal and fixtures, and the TypeScript side followed`. → `protocol/skp/SKP-V0.md:407-415`.
- **Row 18, CONFIRMED.** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:39` cites `engine/src/envelope.rs:128-131`. That range is the `crs_asserted_by`/`crs_asserted_at` inserts. → `engine/src/envelope.rs:253-256`, where `id` is first and non-nullable at `:254`.
- **Row 19, CONFIRMED.** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:39` and `:56` cite `attributes.rs:156-165`. The range starts at `pub enum ProjectionError {`. → `ColumnIsIdentity` at `engine/src/attributes.rs:169-177`, with the checks at `engine/src/attributes.rs:469` and `:558`.
- **Row 20, PARTLY.** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:43` cites `engine/src/attributes.rs:58-97`. The range now opens 20 lines early, takes in the fn head at `engine/src/attributes.rs:78`, and stops before the refusal arm at `engine/src/attributes.rs:109-115`.
- **Row 21, CONFIRMED.** `:47` cites `attributes.rs:61-63`. Line 62 is `use crate::error::{EngineError, Result};`. → `engine/src/attributes.rs:81-83`.
- **Row 22, CONFIRMED.** `:48` cites `attributes.rs:64`. That line is `/// Attribute columns one bundle or one live query may carry. Declared, not discovered (ADR-010`. → `engine/src/attributes.rs:84`.
- **Row 23, CONFIRMED.** `:49` cites `attributes.rs:65-72`. The range holds a doc comment and `pub const MAX_PROJECTED_ATTRIBUTES: usize = 32;`. → `engine/src/attributes.rs:85-92`.
- **Rows 24–26, CONFIRMED.** `:50` and `:51` cite `attributes.rs:73`, `:82-88` and `:74-81`.
  - Line 73 is `/// what it is emitted as.`. Lines 82–88 are the admitted arms from `| D::LargeUtf8` to `| D::Int64`. Lines 74–81 are the doc, the signature and the head of the match.
  - The sentences describe draft code that the amendment superseded, and that code no longer exists. `Float32` is admitted at `engine/src/attributes.rs:94` and dictionaries at `engine/src/attributes.rs:101`.
- **Row 27, CONFIRMED.** `:55` cites `attributes.rs:150-155`. That range is the "`**Not [`EngineError`].**`" doc. → `engine/src/attributes.rs:167-168`.
- **Row 28, CONFIRMED.** `:57` cites `attributes.rs:89-96`. The range runs from `| D::UInt8` to `| D::Float32 => Ok(ty.clone()),`. → The final arm is at `engine/src/attributes.rs:109-115`.
- **Row 29, CONFIRMED.** `:57` cites `attributes.rs:197-204`. That range is `ColumnNameNotAddressable` and the head of the Display impl. → `engine/src/attributes.rs:633` and `:669`.
- **Row 30, CONFIRMED.** `:62` cites `attributes.rs:174-176`. That range is `ColumnIsIdentity`'s doc. → The rule is at `engine/src/attributes.rs:50-58`, and the nullable `Field::new(name, emitted, true)` is at `engine/src/attributes.rs:495`.
- **Row 31, CONFIRMED.** `:64` cites `protocol/skp/SKP-V0.md:68`. That line is `**Brought current again, with no literal change (§8's dated note on the live sections): the block`. → `protocol/skp/SKP-V0.md:84` (the field) and `:208` (the rule).
- **Row 32, CONFIRMED.** `:68` cites `kernel/src/skp.rs:379-388`. That range is `cancel_all_for_dataset`'s `TicketState::CancelledBeforeRedeem` replacement. → `kernel/src/skp.rs:1423-1433`.
- **Row 33, CONFIRMED.** `:70` cites `protocol/skp/SKP-V0.md:505`. That line is `` | `skp.filter_not_boolean` | `inferred_type` | ``. → The form is defined at `protocol/skp/SKP-V0.md:587-591`.
- **Row 34, CONFIRMED.**
  - `:70` cites `engine/src/stream.rs:821-832`. That range is `next_into_timeout`.
  - The sentence is stale in its own right. `resolve_projection` (`engine/src/stream.rs:978-983`) now only wraps `admit_projection`, and the live path calls `Dataset::admit_projection` (`engine/src/stream.rs:989`).
  - → The unknown-column arm is at `engine/src/attributes.rs:566-569`.
- **Row 35, CONFIRMED.** `:71` cites `attributes.rs:82-96`. That range is the admitted arms. → The detail text is at `engine/src/attributes.rs:111-114`.
- **Row 36, CONFIRMED.** `:77` cites `attributes.rs:166-171`. The range holds the geometry and identity variants. → `engine/src/attributes.rs:179`, with the check at `:589`.
- **Row 37, CONFIRMED.** `:78` and `:87` cite `attributes.rs:139-145`. The range is the end of `is_admitted_scalar` and a doc head. → `TooManyColumns` at `engine/src/attributes.rs:159`, and the check that uses the constant at `engine/src/attributes.rs:542-547`.
- **Row 38, PARTLY.** `:81` cites `DRAFT-3-BRIEF-B-recipe-replay-publish.md:81-83`. The range holds the opening of the sentence: `**Surface.** ADR-023 decided as **named-column projection on `viewport_query`**: an explicit`. → The two codes are at `state/drafts/post-tag/DRAFT-3-BRIEF-B-recipe-replay-publish.md:85`.
- **Row 39, CONFIRMED.** `:87` cites `engine/src/attributes.rs:52`. That line is `//! Not "nullable if the source says so". ...`. → The constant was renamed as §4 itself ordered: `MAX_PROJECTED_ATTRIBUTES` at `engine/src/attributes.rs:70`, with the rename recorded at `:68-69`.
- **Rows 40–44, CONFIRMED.** All are on `:93` and `:95`.
  - Row 40: `envelope.rs:49-51` is `impl BatchEnvelope {` and a test-only doc. → `engine/src/envelope.rs:253-256`.
  - Row 41: `:120-126` is the `frame`/`crs`/`crs_source` inserts. → `engine/src/envelope.rs:239-251`.
  - Row 42: `attributes.rs:18-20` is the `docs/09` bullet. → The determinism sentence is at `engine/src/attributes.rs:22-24`. The audit gave `:435`.
  - Row 43: `:174-208` is unit, sanity and id metadata. → The claim is at `engine/src/envelope.rs:319-339` (`TaggedBatch::assemble`). The audit reported it not found.
  - Row 44: `:52-56` and `:57-61` are the `#[cfg(test)]` constructor. → The coordinate-space clause is at `engine/src/envelope.rs:95-97`, and the unchanged frame tag at `engine/src/envelope.rs:89-93` and `:121`.
- **Row 45, CONFIRMED.** `:99` cites `frontends/shell/src/canvas/decodeBatch.ts:23-27`. That range is the geometry-encodings doc. → `frontends/shell/src/canvas/decodeBatch.ts:178-181` and `:230`.
- **Row 46, CONFIRMED.** `:107` cites `envelope.rs:70-88`. That range is `pub(crate) fn admitted(`. → `engine/src/envelope.rs:120-144`.
- **Rows 47–49, CONFIRMED.** These are on `:108` to `:110`.
  - Row 47: `stream.rs:1131-1133` is a factorial-hook doc. → `engine/src/stream.rs:1433-1440`.
  - Row 48: `:1140-1158` is a `StreamPlan {` literal and the head of `stream_inner`. → `engine/src/stream.rs:1447-1463`.
  - Row 49: `:1134-1137` is `pub fn stream_rowgroup_pruned_budgeted_experimental(`. → `engine/src/stream.rs:1441-1444`.
  - These locations are closer than the audit's `:1472-1477` and `:3782`.
- **Row 50, CONFIRMED.** `:111` cites `protocol/skp/SKP-V0.md:69`. That line is `below carries every member the host sends at the literal §4 item 3 states.**`. → `protocol/skp/SKP-V0.md:86`. The quoted shape is also stale: it now has a fourth member, `projectable`.
- **Row 51, CONFIRMED.** `:120` cites `protocol/skp/src/v0/mod.rs:29`. That line is a doc line from the `skp/0.2` history. → `protocol/skp/src/v0/mod.rs:115` (`skp/0.12`). The words "Current literal is `skp/0.2`" are themselves no longer true.
- **Row 52, CONFIRMED.** `:120` cites `DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:67`, `:76` and `:89`. Line 67 is `existing ticket; no new wire field. ...`, line 76 is blank, and line 89 is the P0 table row. → `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:70`, `:79` and `:92`.
- **Row 53, CONFIRMED.** `:138` cites `stream.rs:2189`. That line is `Self::MultiLineString(b) => b.vertices(),`. → `engine/src/stream.rs:3755`.

## ADR-028, rows 54–55
- **Status:** `Status: **Accepted, 2026-09-02**`
- **Where the cites sit:** `## Amendment 4 — the within-generation qualification (2026-09-23, appended — Accepted)`.

- **Row 54, CONFIRMED.**
  - `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:558` cites `frontends/shell/src/streaming/tileViewportStreamManager.ts:685` and `:699`.
  - Both lines are inside `clearAll`'s doc and body.
  - → The capture is at `frontends/shell/src/streaming/tileViewportStreamManager.ts:1044`, the drop checks at `:1058-1059`, and the hand-out through `onBatch` at `:1068`.
- **Row 55, PARTLY.**
  - `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:560` cites `viewportStreamManager.ts:189-212` and `:193-201`.
  - Lines 189–193 still hold the generation and supersede drop.
  - From line 197 on, the range is an Amendment-4 comment and the `sessionEnded` check.
  - → The post-mint drop is at `frontends/shell/src/streaming/viewportStreamManager.ts:208-213`.

## ADR-029, rows 56–73
- **Status:** `**Status:** Proposed — **decision drafted 2026-09-14 for the human's sight (below); binds nothing until its gate and the human's word.**`
- **Where the cites sit:**
  - Rows 56–72 are in the body, `## Decision — drafted 2026-09-14 for the human's sight (Proposed; ...)`, "Ported verbatim".
  - Row 73 is in `### Acceptance gates`.
- None of this decision is built. `kernel/src/skp.rs` has no `operation_id`, and `decision-adr-029-scan-progress-route` is unscheduled.

- **Row 56, CONFIRMED.** `docs/adr/ADR-029-scan-progress-carrier-quantity.md:74` cites `protocol/skp/SKP-V0.md:71` and `:126-129`. Line 71 is a code fence, and 126–129 is the `cancel` shape. → `protocol/skp/SKP-V0.md:88`, and C2 at `protocol/skp/SKP-V0.md:162-165`.
- **Row 57, CONFIRMED.** `:75` cites `frontends/shell/src-tauri/src/publish.rs:752-758`. The range is the end of a match and the S1 comment. → `frontends/shell/src-tauri/src/publish.rs:891-897`.
- **Row 58, CONFIRMED.** `:78` cites `SKP-V0.md:216` and `:214-215`. Line 216 is `1. **Semantic command model** — ...`. → Item 7 is at `protocol/skp/SKP-V0.md:272-276`, and item 6 at `protocol/skp/SKP-V0.md:270-271`.
- **Row 59, CONFIRMED.** `:79` cites `protocol/data-plane/src/adapter_ws.rs:249-252`. The range is halt and discard control flow. → `protocol/data-plane/src/adapter_ws.rs:284-287`.
- **Row 60, CONFIRMED.**
  - `:81` and `:85` cite `engine/ADMISSION-PREREGISTRATION.md` line 248 and `ADMISSION-PREREGISTRATION.md:248,250`. These resolve to `governance/forms/engine/`.
  - Line 248 is `` `1.10505.0` (reporting DuckDB `v1.5.5`) accepts `file_row_number = true` on the `read_parquet` ``.
  - → The batch-loop placement is §13 C at `governance/forms/engine/ADMISSION-PREREGISTRATION.md:316`, and R-D2 is at `governance/forms/engine/ADMISSION-PREREGISTRATION.md:73`.
- **Row 61, CONFIRMED.** `:84` cites `SKP-V0.md:97`. That line is `` `duckdb_version()` is deliberately **not** in `describe`: ... ``. → `protocol/skp/SKP-V0.md:126`.
- **Row 62, CONFIRMED.** `:85` cites `SKP-V0.md:273-275`. That range is item 7's event text. → `protocol/skp/SKP-V0.md:280`, `:284` and `:356-358`.
- **Row 63, CONFIRMED.**
  - `:89` cites `kernel/src/skp.rs:137-162` and `:405`. Line 137 is `redeemed_at: Instant,` and line 405 is `}`.
  - The cites name the sites where an unbuilt id would go. → `mint` at `kernel/src/skp.rs:236` and `viewport_query` at `kernel/src/skp.rs:1385`.
- **Row 64, CONFIRMED.** `:90` cites `SKP-V0.md:141-142` and `kernel/src/skp.rs:203-225`. Line 142 is `` ### `close_dataset` ``, and the skp.rs range is the terminal sweep and `sweep_expired`. → The minting rule is at `protocol/skp/SKP-V0.md:176-178`.
- **Row 65, CONFIRMED.** `:91` cites `kernel/src/skp.rs:413`. That line is a `GenerationRegistry` doc line. → `kernel/src/skp.rs:320` and `:1552`, with the handle shapes at `protocol/skp/SKP-V0.md:129`.
- **Row 66, CONFIRMED.** `:91` cites `publish.rs:888-897`, a bare name. That range is `PublishProgressEvent`'s fields, `pub attempt_id: String,` among them. → `frontends/shell/src-tauri/src/publish.rs:1027-1037`.
- **Row 67, CONFIRMED.** `:92` cites `SKP-V0.md:150-152`. Line 150 is `` no `Arc<Dataset>`; ... ``. → `protocol/skp/SKP-V0.md:189`.
- **Row 68, CONFIRMED.** `:95` cites `frontends/shell/src/App.tsx:485-491`. The range is reducer code. → `frontends/shell/src/App.tsx:551-554`.
- **Row 69, CONFIRMED.** `:97` cites `engine/ADMISSION-PREREGISTRATION.md` line 252. That line is `the identity mechanism is unchanged from §2d's. ...`. → §13 E is at `governance/forms/engine/ADMISSION-PREREGISTRATION.md:320`. The audit did not locate it.
- **Row 70, CONFIRMED.** `:97` cites `SKP-V0.md:243-252`. That range is items 4 and 5. → `protocol/skp/SKP-V0.md:308-318`.
- **Row 71, CONFIRMED.** `:99` cites `publish.rs:740`. That line is `started_at: pending.started_at,`. → `frontends/shell/src-tauri/src/publish.rs:881-897`.
- **Row 72, CONFIRMED.** `:99` cites `SKP-V0.md:47-48`. → `protocol/skp/SKP-V0.md:51-52`.
- **Row 73, CONFIRMED.** `:113` cites `ADMISSION-PREREGISTRATION.md:254`. That line is `2. **R-I3's reach, narrowed in implementation ...`. → `governance/forms/engine/ADMISSION-PREREGISTRATION.md:322`.

## ADR-032, rows 74–84
- **Status:** `**Status:** **Accepted** — 2026-09-23, on the human's word, as it stands`
- **Where the cites sit:** all in the body: Context at `:11` and `:17`, Decision at `:26` and `:29`, Consequences at `:44`, and What this does NOT decide at `:48`.

- **Row 74, CONFIRMED.** `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:11` cites `engine/src/dataset.rs:302-307`. The range is `open_cancellable`'s `Self::open_inner(` call. → `engine/src/dataset.rs:423-427`. The refusal has narrowed since (R-C4).
- **Row 75, CONFIRMED.** `:11` and `:44` cite `engine/src/error.rs:213-217`. Line 214 is `/// A DuckDB connection could not be created or configured.`. → `engine/src/error.rs:327-332`, already corrected, with the correction noted at `engine/src/error.rs:323-326`.
- **Row 76, CONFIRMED.** `:11` cites `engine/src/crs.rs:120-124`. Line 121 is `pub struct CrsAssertion {`. → `engine/src/crs.rs:161-163`, and the enum at `engine/src/crs.rs:142-147`.
- **Row 77, CONFIRMED.** `:17` quotes `DECISIONS-PENDING.md:37`. It is the same case as row 1.
- **Row 78, CONFIRMED.** `:17` cites `kernel/src/publish/mod.rs:1259`. That line is `coordinate_layout: "interleaved-xy".into(),`. → `kernel/src/publish/mod.rs:1436`.
- **Row 79, CONFIRMED.** `:17` cites `frontends/shell/src/canvas/tileGrid.ts:76-78`. Those lines now say "one authoritative-CRS unit is not one span in every unit", which is the opposite of the claim. → `frontends/shell/src/canvas/tileGrid.ts:97`.
- **Row 80, CONFIRMED.** `:26` cites `engine/src/geoparquet.rs:98-109` and `engine/src/crs.rs:236-239`. These are `pub enum AxisProvenance {` and the accessors. → `engine/src/geoparquet.rs:20-21` and `:554-555`.
- **Row 81, CONFIRMED.** `:29` cites `engine/src/envelope.rs:88`. That line is `///`. → `engine/src/envelope.rs:67-69` and `:141-144`.
- **Row 82, CONFIRMED.** `:44` cites `engine/src/crs.rs:122-123`. Those lines are `` /// e.g. `EPSG:2056`. `` / `pub identifier: String,`. → `engine/src/crs.rs:145` and `:162`.
- **Row 83, CONFIRMED.** `:48` cites `engine/src/geoarrow.rs:97-103`. The range is the `GeometryKind` enum. → `engine/src/geoarrow.rs:434-449`.
- **Row 84, CONFIRMED.**
  - `:48` cites `engine/src/dataset.rs:275-282`. The range is `open_with_connections`'s parameters.
  - → The geometry-type gate is `encoding_for_declared_types` at `engine/src/dataset.rs:370`. The audit's `:424` is the axis refusal, not this gate.
  - Reading cannot decide whether the gate still "refuses most public GeoParquet" after ADR-034's five encodings. That depends on the files in the wild.
- **Also stale in this ADR, not a numbered row:** `:28`'s self-relative `(:120-124)` and `(:218-240)`. → `engine/src/crs.rs:161` and `engine/src/crs.rs:275`.

## ADR-033, rows 85–87
- **Status:** `**Status:** Accepted 2026-09-14`
- **Where the cites sit:** the body, Context at `:9` and Decision at `:19`.

- **Row 85, CONFIRMED.** `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md:9` cites `kernel/src/skp.rs:777-781`. The range is a doc on session marks. → `kernel/src/skp.rs:2302-2305`.
- **Row 86, CONFIRMED.**
  - `:19` cites `kernel/src/skp.rs:705-708`. That range is `ticket_liveness`'s doc.
  - → The `error_of` arm is at `kernel/src/skp.rs:2196-2202`, and the route through `predicate_admit_error_of` at `kernel/src/skp.rs:1737-1743`.
- **Row 87, CONFIRMED.** `:19` cites `protocol/skp/SKP-V0.md:266`. That line is `item stays on this list, unmet and named. ...`. → `protocol/skp/SKP-V0.md:348`.
- **Also stale, not numbered rows (the audit did not check self-relative cites):**
  - `:9` `today :170-179` (`LeaseClass`). → `engine/src/pool.rs:216`.
  - `:19` `:511-518` and `:393`. → `kernel/src/skp.rs:1737` and `:1385`.

## Kin outside `docs/`
1. **The cite the audit named, `AI_DEVELOPMENT.md:147`:** confirmed at `frontends/shell/src-tauri/src/lib.rs:127` and `:343`. Both are comments, and the mechanic is at `governance/AI_DEVELOPMENT.md:209`.
   - `skp-line-cites-outside-close-races` (blocked) holds src-tauri `lib.rs`, but only for its skp.rs line cites. No PLAN node names this cite.
2. **The same cite, which the audit did not name:** `frontends/shell/src-tauri/src/origin.rs:10`. No node holds it.
3. **Row 82's cite `crs.rs:122-123`:** at `engine/src/error.rs:324` and `frontends/shell/e2e/admission-remediation.mjs:366`. No node holds either.
4. **Row 87's cite `:266`:**
   - `protocol/skp/SKP-V0.md:720` is in a file that `b2-piece-1c-save-and-reopen` (in progress) and `skp-spec-and-protocol-comments-drift-sweep-c` (proposed) edit.
   - `kernel/src/publish/error.rs:253` has no node.
5. **Governance records carrying the same cites** (forms are dated records): `governance/forms/engine/ADMISSION-PREREGISTRATION.md:29` (`envelope.rs:88`), `:577` (`tileGrid.ts:78`) and `:579` (`offsetFrame.ts:37`).

## Proposal (grading is the custodian's)
ADR text, Status lines, notes and amendments are the human's words. Only a dated note in the human's words can carry a correction, so I write none.

1. **ADR-029 (Proposed, unbuilt; rows 56–73).** These stale cites can lead a reader to act wrongly. When the scan-progress route is built, an implementer will follow them to the mint site, the cancel parser, the ticket state and the no-wildcard rule, and all of them now land on other code.
   - No open node holds ADR-029's text. `decision-adr-029-scan-progress-route` is unscheduled.
2. **ADR-023 (Proposed, built in B1, awaiting acceptance; rows 16–53).** These mislead a verifier, and the human at acceptance.
   - Besides stale lines, six sentences are stale in themselves:
     - rows 24–26: the superseded draft code is gone;
     - row 34: the arm moved;
     - row 39: the constant was renamed;
     - row 50: the schema shape grew;
     - row 51: "Current literal is `skp/0.2`".
   - Nodes touching this ADR: `adr-notes-stale-statements-and-indices` (proposed; A-S5, its Status words) and `adr-023-s2-widenings-adr-021-consult` (proposed). Neither holds these cites.
   - The Status line's acceptance is the natural moment for a dated note.
3. **Accepted ADRs.**
   - **Stale references only, in dated records:**
     - ADR-020 Amendment 1, rows 4–14;
     - ADR-021 Amendment 2026-09-15, row 15 (PARTLY, red-line text);
     - ADR-028 Amendment 4, rows 54–55;
     - ADR-032's body, rows 74–84;
     - ADR-033's body, rows 85–87 and the three unnumbered cites.
   - **One exception, ADR-013 Amendment 1, rows 1–3.** Row 3's "Item 6 is not true of the build" reads as current, and it is now only partly true: the two cited constants landed via `crs-unit-fact-and-bounds`, and the rest is on `crs-zoom-constants-per-unit`. This is a stale statement of the A-S class, so it fits `adr-notes-stale-statements-and-indices` if the human widens it.
   - No open node holds ADR-020, ADR-028, ADR-032 or ADR-033 for these cites.
4. **Kin in product code** (`lib.rs`, `origin.rs`, `engine/src/error.rs`, `kernel/src/publish/error.rs`, the e2e script and SKP-V0.md:720). These are not the human's words. Each is a wrong pointer a reader would follow, and none needs the human to fix.

**Files read:**
- `<the session scratchpad>/brief-tri-dc.md`
- `state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`
- `state/drafts/2026-11-03-platform-adr-notes-docs-paths-audit.md` (Task C)
- `state/consults/2026-11-05-platform-and-cloud-adr-docs-audit-comparison.md`
- `state/consults/2026-11-05-drift-sweep-areas-c-d-triage-architect.md` (head)
- `governance/DECISIONS-PENDING.md` (head)
- `governance/PLAN.yaml` (by search)
- `governance/AI_DEVELOPMENT.md` (by search)
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md`
- `state/cut-archive/DECISIONS-PENDING-2026-10-20.md` (count only)
- `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md`
- `state/drafts/post-tag/DRAFT-3-BRIEF-B-recipe-replay-publish.md`
- `docs/adr/` ADR-013, ADR-020, ADR-021, ADR-023, ADR-028, ADR-029, ADR-032 and ADR-033
- `frontends/shell/src/canvas/tileGrid.ts`, `frontends/shell/src/canvas/offsetFrame.ts` and `frontends/shell/src/canvas/decodeBatch.ts`
- `frontends/shell/src-tauri/src/lib.rs`, `commands.rs`, `state.rs`, `publish.rs` and `origin.rs`
- `frontends/shell/src/publish/PublishPanel.tsx` and `frontends/shell/src/App.tsx`
- `frontends/shell/src/streaming/tileViewportStreamManager.ts` and `frontends/shell/src/streaming/viewportStreamManager.ts`
- `frontends/shell/e2e/admission-remediation.mjs`
- `engine/src/` `layout.rs`, `attributes.rs`, `envelope.rs`, `stream.rs`, `dataset.rs`, `error.rs`, `crs.rs`, `geoparquet.rs`, `geoarrow.rs` and `pool.rs`
- `kernel/src/skp.rs`, `kernel/src/publish/mod.rs` and `kernel/src/publish/error.rs`
- `protocol/skp/src/v0/commands.rs`, `protocol/skp/src/v0/mod.rs`, `protocol/skp/SKP-V0.md` and `protocol/data-plane/src/adapter_ws.rs`
