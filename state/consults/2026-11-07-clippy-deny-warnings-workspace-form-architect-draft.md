*Custodian's filing note (2026-11-07): the architect's draft for filler entry 12, `clippy-deny-warnings-workspace`: five lettered five-line pieces, 12a to 12c given as outlines for lead-data's forms, 12d and 12e given whole, 12e held for the human's Q1 to Q4; drafted ahead while 8f runs its step 0; read only at main 4cbcab1e, from the Windows read and lead-data's impact read. Its brief by file (10230 bytes, sha256 491a2a33d05aebd91dc9a08aea74807d0e85cefa291dd7f187bbaf3c68f58f0b), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's two misses byte for byte. The run 2026-11-07T11:53:19.493Z to 2026-11-07T12:13:36.519Z by its transcript (claude-opus-5-5; unique calls Read 69, Grep 23, Glob 3 and the hand-back, 96, equal to the notification's). Extracted by script from its one SubagentHandback call, at 2026-11-07T12:13:36.417Z, one final newline added; its sha256 is 62141b7c63478efe098dcd9fb2de79630a846867dee8c0e69d05b452428a7059. No form is committed: Q1 and Q2 are the human's red lines (what CI installs), and Q3 and Q4 are held for the human; the split of entry 12 into lettered entries keeps its place in the queue and is named to the human, who orders it; the items that are not red lines (OPEN-1 to OPEN-8) take the draft's recommendations under the human's direction of 2026-10-31, item 4, when each form is committed. A reading, not Authority.*

---

Draft: clippy-deny-warnings-workspace, five five-line forms (12a, 12b and 12c are lead-data's, given here as outlines only; 12d and 12e are the architect's, given whole), architect

Read at: main @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078 (see the read note).

Every sentence here is mine (the architect's) unless it is in quotation marks. Quoted text is byte-copied from the file cited. Every cite reads `@ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078` unless it names another commit.

**Read note.**
- I read the main checkout's working tree and could not print its HEAD.
- The session's git snapshot names aca36808 as the latest commit, one past 4cbcab1e. Its subject is 8f's form commit. I did not read its diff.
- I have written every cite at 4cbcab1e, as the brief orders. A cite into a file that aca36808 changed (governance/PLAN.yaml, possibly) is re-pinned by the custodian's script.
- I have no shell, so I give no sha256.
- I ran no clippy, no cargo and no git.

---

## 1. Route and slicing

**My recommendation: OPEN-1 (A), five lettered five-line pieces, 12a to 12e.**
- They run one at a time in the filler slot under §36 (governance/AUTONOMY.md:692 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), each with the reviewer and the architect from dispatch.
- No workspace `[lints]` table and no clippy.toml (custodian's answer 2).
- Each piece is sized by §21c with tests counted (governance/AUTONOMY.md:357 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). Row numbers are the Windows read's (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:46-92 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).

| Piece | Rows | Files | Estimate (insertions plus deletions) | Form drafted by | Form path | Waits on |
|---|---|---|---|---|---|---|
| 12a | 1-6, L7, 12, 13-15, 16-17, 26 | engine/src/rowgroup.rs, stream.rs, trace.rs, watch.rs; engine/tests/filter_type_admission.rs, fixture_generation.rs, identity.rs, publish_stream.rs (8) | about 35 | lead-data (confined to engine/, AI_DEVELOPMENT.md:749) | governance/forms/engine/ | 8f merged (shared engine files, see section 7) |
| 12b | 7-11, 18-25 | engine/tests/admission_p4_corpus.rs, admission_property_campaign.rs, import_layout_5gb_digest.rs, import_layout_5gb_fixtures.rs, import_layout_digest.rs, import_layout_fixtures.rs, lod_tier_measurements.rs (7) | about 25-30 | lead-data | governance/forms/engine/ | 12a merged; entry 11's files are checked first |
| 12c | 33-43, L35, L42 | kernel/tests/import_layout_factorial.rs, indexed_budgets.rs, publish.rs, scale_pass.rs, slice_budgets.rs, support/mod.rs, wire_bytes_invariant.rs (7) | about 17-21 | lead-data (confined to kernel/) | governance/forms/kernel/ | nothing in flight |
| 12d | 27-32, 44, 45 | kernel/src/bin/publish-bundle.rs, lib.rs, permission/boundary.rs, publish/mod.rs, skp.rs; renderer/src/canonical.rs, style.rs (7) | about 16 | architect (it crosses kernel/ and renderer/), drafted whole below | governance/forms/kernel/ (the larger part; no renderer forms folder exists) | 1c merged (lib.rs, canonical.rs); 12a to 12c merged |
| 12e | the CI step | .github/workflows/product-ci-rust.yml (1) | about 8-12 | architect, drafted whole below, held | governance/forms/root/ | port-2 merged (same file); 12d merged; the human's answers to Q1 to Q4 |

**Why this route.**
- One form over S1 to S6 is 30 files. That fails §21c's file bound (governance/AUTONOMY.md:306-375 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), which would make it a full form with full gating, and all of it would wait on 1c.
- The lettered pieces let 12a to 12c start as soon as the slot reaches entry 12, and they keep lead-data's drafting role where the pilot gives it.
- 12d is one cross-module form, not two, for three reasons:
  - Both halves wait on the same 1c merge.
  - The renderer half is two rows and about six lines.
  - Together they carry the Windows workspace exit-0 claim.
- S4a is not split off ahead of 1c. The step needs every slice anyway, so an early S4a moves no end state and adds a filler cycle.

**Owner's-index lines** (engine/README.md:537, :557; kernel/README.md:360, :387 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078):
- These are lead-data's after-merge update, "applied by a worker and checked by the reviewer" (governance/AI_DEVELOPMENT.md:749 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). They are therefore in no piece's Scope, which keeps 12a at 8 files.
- engine/README.md:567's pointer to WATCH_BUFFER_BYTES stays true under OPEN-2 (A). kernel/README.md:381 does not change, because no alias is taken.

---

## 2. The forms

The reuse index, byte for byte from the brief. Each Authority line below notes both misses.

```text
$ node tools/reuse.mjs clippy deny warnings workspace   (exit 1)
No prior art recorded for "clippy deny warnings workspace". Research it before planning an implementation.
$ node tools/reuse.mjs lint warnings ci step   (exit 1)
No prior art recorded for "lint warnings ci step". Research it before planning an implementation.
```

### 12a: outline only (lead-data drafts the form)

- **Authority:**
  - the node (governance/PLAN.yaml:6634-6650 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078);
  - entry 12 (state/FILLER-QUEUE.md:35 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), lettered 12a;
  - the placement (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078);
  - §36;
  - the reuse index's two misses.
- **Scope:** the 8 files in the table; declared budget 80.
- **Change, per row:**
  - Row 1: an allow.
  - Row 2: `#[allow(clippy::if_same_then_else)]` on `attr_row_bytes` (engine/src/stream.rs:2323 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), the expression at :2323-2377 byte-identical (OPEN-3).
  - Row 3: an allow. Row 4: a local alias in `mod tests`. Rows 5-6: drop the `*`.
  - L7: OPEN-2 (A). WATCH_BUFFER_BYTES and its two doc lines (engine/src/watch.rs:71-73 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) move byte for byte into `mod windows_watch` (:105), and the name leaves the `use super::{…}` list (:107). The const is read only at :222 and :250 in that module.
  - Row 12: `int_info(from).is_some()` (engine/tests/filter_type_admission.rs:1267 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
  - Rows 13-15: drop the `&`.
  - Rows 16-17: `!md.contains_key(..)` (engine/tests/identity.rs:321, :324 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
  - Row 26: the enumerate form over `union`, keeping `to_bits()` and the message "bound {i}" (engine/tests/publish_stream.rs:534-536 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
- **Tests and mutations,** each observed by applying it, running the named test, recording the failure by name with its commit, and reverting it:
  - Row 12, M: `is_some` becomes `is_none`. Predicted failure: `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`. If it survives, that is class 2. The fix stays, because it is an equivalence the language defines, and the survival is reported as a coverage finding.
  - Row 16, M: engine/src/envelope.rs:221-223 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078 inserts `id_js_exact` unconditionally. Predicted failure: identity.rs:321 in `skipping_the_uniqueness_check_is_recorded_rather_than_hidden`.
  - Row 17, M: envelope.rs:214-215 inserts `id_verified_rows` unconditionally. Predicted failure: :324.
  - Row 26, M: one coordinate's accumulation in the union fold (engine/tests/publish_stream.rs:523-528 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) swapped from max to min. Predicted failure: "bound 3" (or the bound of the coordinate mutated).
  - Row 2 needs no twin and no mutation, because the expression is byte-identical (the gate reads this from the diff). The existing `float32_costs_four_bytes_in_the_estimate` (engine/src/stream.rs:2863-2870 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) passes.
  - L7 has no Windows observation. On Linux, the PR's own product-ci-rust build-step log no longer prints `dead_code` for watch.rs. `node scripts/plan/cfg-boundary.mjs` passes, and the shipped-tree count for engine/src/watch.rs stays 3 (scripts/plan/cfg-boundary.test.mjs:65-90 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
- **Out of scope:**
  - ADR, security and wire: none.
  - Guarantee: none. Every asserted path keeps its strength, and the estimator expression is byte-identical.
  - No new `pub` item and no new cfg site.

### 12b: outline only (lead-data drafts the form)

- **Authority:** as 12a, lettered 12b.
- **Scope:** the 7 files in the table; declared budget 60.
- **Change, per row:**
  - Row 7: an allow on the test-local enum.
  - Row 8: drop the `*`.
  - Row 9: the inline at engine/tests/admission_property_campaign.rs:270-278 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078, with the inner `format!`'s two arguments placed last so that the draw order holds.
  - Rows 10-11: `*` dropped, and `.last()` becomes `.next_back()` (:543, :556-561).
  - Rows 19-20: `log.as_str()` (engine/tests/import_layout_5gb_fixtures.rs:318, :326 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
  - Guards 18, 21-25: form (i), `#[allow(clippy::assertions_on_constants)]` on each enclosing fn, one line each, the guard byte-identical. Section 4 covers this.
- **Tests and observations:**
  - Rows 8-11 (seeded generators; seeds at :62-78, `pick` returning `&'a T` at :87-109), a one-off observation:
    - A scratch patch, never committed, writes each generator's draws at its committed seeds to a file.
    - The same patch is applied at the base and at the head, and the two outputs' sha256 are recorded equal.
    - M: row 9's two trailing arguments swapped at the head. Predicted: the head's sha256 differs. It is reverted, and `git status --porcelain` is shown empty.
  - Guards: one debug `--ignored --exact` run per guarded site, of one test that reaches it, with a 300 s timeout. Each must exit with rc 101 on the guard's own message (precedent: governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md). This shows that the refusal stands; it is not a mutation.
  - Recorded, not claimed: `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings` and its exit code. A nonzero exit caused only by a dependency outside the Scope is not an invalidator.
- **Out of scope:**
  - ADR, security, wire and guarantee: none.
  - No harness is re-run in release, and no recorded figure changes.

### 12c: outline only (lead-data drafts the form)

- **Authority:** as 12a, lettered 12c.
- **Scope:** the 7 files in the table; declared budget 40.
- **Change, per row:**
  - Row 33: a statement-level `#[allow(clippy::manual_contains)]` on `let gate_overall` (kernel/tests/import_layout_factorial.rs:1858-1861 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). It falls back to the fn if the JSON still reports the row (OPEN-6).
  - Row 35: a statement-level `#[allow(clippy::format_in_format_args)]` on `let art` (kernel/tests/indexed_budgets.rs:1166 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). The template at :1214 and the call at :1324 are byte-identical.
  - Rows 36-38: `assert!(!…)` (kernel/tests/publish.rs:279-280, :957 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
  - Row 39: `n.is_multiple_of(50)` (kernel/tests/scale_pass.rs:191 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
  - Guards 34, 40, 41: form (i). The guards are at indexed_budgets.rs:568-574, slice_budgets.rs:466-472 and support/mod.rs:341-348 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078.
  - Rows 42-43: `#[allow(clippy::await_holding_lock)]` on each `#[tokio::test]` fn (kernel/tests/wire_bytes_invariant.rs:189-191, :396-398 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). The std Mutex and `serial()` (:172-187) are byte-identical.
  - L35 and L42: the `peak_working_set` field is deleted from the `#[cfg(not(windows))]` stubs only (indexed_budgets.rs:209; slice_budgets.rs:186 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). No reader of the stubs reads that field: the samplers read only `private_usage` and `working_set` (indexed_budgets.rs:241-243; slice_budgets.rs:219-221 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). The Windows `#[repr(C)]` structs (indexed_budgets.rs:165-182; slice_budgets.rs ending at :159) are untouched.
- **Mutations:**
  - Row 37, M: kernel/src/bundle/mod.rs:889 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078 writes `hashed` true.
  - Row 38, M: :890 writes `verified` true.
  - Row 36, M: :874 writes `available` true.
  - Each is predicted to fail the rewritten assertion by name in its test, :223's or :888's. If the test fails earlier than the rewritten line, that is class 2, and the test-side mutation (the `!` dropped) is observed instead.
- **Observations and record notes:**
  - Rows 33 and 35: the diff is one attribute line each, and the harness code is byte-identical.
  - Guards: as 12b, for indexed_budgets, slice_budgets and one of the nine binaries that compile support/mod.rs, named by the worker.
  - Rows 42-43: the recorded M-1 (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:148-151 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) still applies, and test names and assertions stay byte for byte (:113).
  - L35 and L42: the PR's Linux build-step log shows no `dead_code` at either site.
- **Out of scope:**
  - ADR: none (ADR-004 Amendment 4's tests keep their names and assertions).
  - Security, wire and guarantee: none.
  - No FFI layout change and no recorded figure change.

### 12d: the form, whole

Form path: `governance/forms/kernel/CLIPPY-DENY-WARNINGS-KERNEL-AND-RENDERER-SOURCES-PREREGISTRATION.md`.

```
Authority: PLAN node `clippy-deny-warnings-workspace` (governance/PLAN.yaml:6634-6650 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), filler queue entry 12 (state/FILLER-QUEUE.md:35 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), its lettered piece 12d as the custodian names the split; placed by the human (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078); run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078); evidence, not Authority: the Windows read, rows 27-32, 44, 45 (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:46-92 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), lead-data's impact read (state/consults/2026-11-07-clippy-deny-warnings-workspace-impact-read-lead-data.md, sections 1 and 3) and the cloud report (state/consults/2026-11-03-cloud-suite-linux-report.md:190-298 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078); reuse index: two misses, no prior art recorded for "clippy deny warnings workspace" or "lint warnings ci step" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1 each, run by the custodian for the impact read's brief).
Scope: kernel/src/bin/publish-bundle.rs (row 27); kernel/src/lib.rs (rows 28, 29: one attribute line each); kernel/src/permission/boundary.rs (row 30); kernel/src/publish/mod.rs (row 31); kernel/src/skp.rs (row 32: one attribute line); renderer/src/canonical.rs (row 44: one attribute line); renderer/src/style.rs (row 45: the module doc's lines 8-10 re-wrapped); 7 files; declared line budget 40 by §21c's counting rule (estimate 16).
Change: the eight clippy diagnostics whose primary spans are in these files at the base are removed — rows 28, 29 and 32 (`type_complexity`) and row 44 (`manual_range_contains`) by an item-level `#[allow(clippy::<lint>)]` with the item's code byte-identical; row 27 by `index.is_multiple_of(20)`, row 30 by `bundle: &std::path::Path`, row 31 by passing `watch` for `&watch`; row 45 by re-wrapping the doc paragraph so that no line begins with `+` — so that, with 12a to 12c merged, `cargo clippy --workspace --all-targets --locked -- -D warnings` exits 0 on Windows; no behaviour, signature, wire shape or rendered doc sentence changes.
Tests+mutation: no test is added or changed. M1: in `write_double` (renderer/src/canonical.rs:232-245 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), `mag < MIN_ABS_DOUBLE` becomes `mag <= MIN_ABS_DOUBLE` beneath the new attribute; predicted failure `the_no_exponent_promise_is_kept_by_refusing_what_it_cannot_express` (the impact read, section 6), which proves that ADR-017's domain is still under test at the head; observed by applying it, running that test, recording its failure by name with the commit, and reverting it. Rows 28, 29, 32 and 44 are read from the diff as one attribute line each over a byte-identical item; rows 27, 30 and 31 are type-checked; row 45 is checked by the reviewer: the quoted span on the re-wrapped line equals docs/06_Rendering.md:21 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078 byte for byte. At the head: the JSON run lists no row in the Scope files and the rows outside it as at the base; the -D command exits 0 with `cargo clippy --version` recorded; the full suite passes.
Out-of-scope: ADR: none (ADR-017's domain, docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:75 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078, is the code at renderer/src/canonical.rs:240 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078, left byte-identical under an attribute; ADR-019's ticket path at kernel/src/lib.rs:485-489 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078 gains one attribute line). Security: none (the fn at kernel/src/permission/boundary.rs:536 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078 is private, and its one caller at :436 is unchanged). Wire: none (`redeem`'s signature, kernel/src/skp.rs:272-277 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078, is byte-identical; no SKP, data-plane or MCP shape changes). Guarantee: none (no expression on a tested path changes). §25 (e) is set aside for a filler by §36. No new dependency, no `unsafe`, no new string, no new `pub` item, no `[lints]` table, no clippy.toml.
```

**12d's notes (mine):**
- **N1, size.**
  - Estimate per row: 27, 2 lines; 28-29, 2; 30, 2; 31, 2; 32, 1; 44, 1; 45, 6 (three doc lines changed).
  - Total: 16 lines over 7 files, inside §21c.
- **N2, row 45.**
  - The current lines (renderer/src/style.rs:8-10 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) split docs/06's quotation after "same style". Line 9 therefore begins `//! + same data`, which opens a Markdown list.
  - Two fixes exist:
    - `\+` (the cloud's and lead-data's) puts a byte inside a quotation of docs/06:21 that docs/06 does not have.
    - A re-wrap that starts line 9 at the opening quotation mark keeps the quoted span contiguous and byte-identical to docs/06:21.
  - I recommend the re-wrap (OPEN-7). rustfmt does not reflow comments.
- **N3, row 44.**
  - No test catches the upper bound made inclusive (the impact read, section 6), so a range rewrite would land unproven at 1e15. The allow keeps the domain code byte-identical.
  - That missing boundary test is named here as a candidate for renderer's own queue, not this piece's.
- **N4, rows 28-29 and 32.**
  - Allows follow the same file's precedent (kernel/src/lib.rs:561 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). No reason sentence is added.
  - The precedent's own reason (:559-560) says that the alias would name a type "nothing else here shares", yet `create_from_raw_params` (:411-414) and `create_from_ticket` (:485-489) share it. That sentence is named as a docs-lane candidate and not edited here.
- **N5, base re-read.**
  - 1c edits kernel/src/lib.rs and renderer/src/canonical.rs. The worker re-reads every row's site at 12d's base by fn name.
  - Before the form is committed, the custodian runs the JSON at that base. Any new row in a Scope file goes into the form before the commit.
- **N6, whose words.** No sentence this piece writes is red-line text. It writes no comment beyond row 45's re-wrap of existing words. Any comment a worker adds is written after the code and checked clause by clause (Part 1, item 1).

### 12e: the form, whole, held for Q1 to Q4

Form path: `governance/forms/root/CLIPPY-DENY-WARNINGS-CI-STEP-PREREGISTRATION.md`. The custodian commits it only once the human has answered Q1 to Q4. The bracketed holes are filled from those answers.

```
Authority: PLAN node `clippy-deny-warnings-workspace` (governance/PLAN.yaml:6634-6650 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), filler queue entry 12 (state/FILLER-QUEUE.md:35 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), its lettered piece 12e; the placement's step clause (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:22 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078); the human's answers to Q1 to Q4 [cited by round and item]; run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078); reuse index: two misses, no prior art recorded for "clippy deny warnings workspace" or "lint warnings ci step" (tools/reuse.mjs in the reuse clone at 89bbac37, exit 1 each, run by the custodian for the impact read's brief).
Scope: .github/workflows/product-ci-rust.yml (one step in job `workspace` after "Run the ordinary suite"; one sentence in the header's "What a green run here means", in the human's words, written after the code; the toolchain step only under Q1 (a) or Q2 (b)); 1 file; declared line budget 30 (estimate 8 to 12).
Change: on [the matrix entries Q3 names], after the ordinary suite and under the list step's guard, the job runs `cargo clippy --version` and then `cargo clippy --workspace --all-targets --locked -- -D warnings`, so that a clippy diagnostic or a rustc warning in any workspace member's compiled targets fails that entry, while a test failure and a lint failure each still report; the job's name and matrix names, the build, suite and list steps, the cache key and `timeout-minutes` are byte-identical; no RUSTFLAGS.
Tests+mutation: no Rust test. The evidence is the PR's own product-ci-rust run: the new step green on each named entry with its `cargo clippy --version` line [Q4 (a): that run is the Linux and macOS evidence]. M1: the `#[allow(clippy::too_many_arguments)]` line 12a adds at row 1 (engine/src/rowgroup.rs) is deleted in its own pushed commit on the PR branch; predicted: on every named entry the clippy step fails naming `clippy::too_many_arguments` at that site, and the suite and list steps still run; observed in that commit's run by its id; restored by the next commit re-adding the line byte for byte, whose run is the green evidence; the PR merges with a merge commit, so the M1 commit stays reachable.
Out-of-scope: ADR: none. Security: none [Q1 (a) or Q2 (b): one rustup component or a pinned toolchain, what CI installs, the human's answer]. Wire: none. Guarantee: TOUCHED: what a green product-ci-rust run means (.github/workflows/product-ci-rust.yml:12-18 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) gains a lint clause. §25 (e) is set aside for a filler by §36. No Cargo.toml or Cargo.lock change, no new job, no renamed check.
```

**12e's notes (mine):**
- **E1, placement.**
  - The step goes after "Run the ordinary suite" (:233-234) with the guard the list step carries (:238-240).
  - `-D warnings` goes after `--` and never in RUSTFLAGS, which keeps the build step's fingerprints (:221-223) and the vendored DuckDB's build untouched. The precedent is governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md:307 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078, as a historical pin (section 6).
- **E2, what each answer changes.**
  - Q1 (a) adds `components: clippy` to the step at :205. That is the same step for every entry, so it also touches the Windows entry's toolchain.
  - Q1 (b) changes nothing at :205. The step's `cargo clippy --version` line fails loudly if a runner's toolchain lacks clippy.
  - Q1 (c) and Q2 (c) add a job, which means a new check name, a cold build and a required-check list question.
  - Q2 (b) pins the toolchain for the suite as well.
  - Q3 (b) or (c) adds an `if:` on `matrix.os`.
  - Q4 (b) moves the Linux evidence before dispatch.
- **E3, named risks, with no timing claim.**
  - A cold clippy pass may push the job past `timeout-minutes: 90` (:201). That would be an invalidator for the human, never adjusted in this piece.
  - From the merge on, any rustc warning fails CI on every named entry, a dependency's deprecation included.
- **E4, may not claim:**
  - features that no target enables;
  - targets skipped by `required-features`;
  - the crates the workspace excludes;
  - a pass on any OS that no named entry runs.
- **E5, the header sentence:** no words from me (custodian's answer 1, and the brief). It is the human's wording.

---

## 3. My notes, across pieces

**Allow or fix: the principle and the MARK rows.**
- My principle:
  - A logic rewrite on a guarded product path, or in a harness this piece cannot re-run, takes an item-level allow.
  - A rewrite the type checker proves is fixed.
  - A test-assertion rewrite is fixed and carries a mutation.
  - No allow carries a code comment. Its reason is the row in its form. Any comment a worker adds is written after the code (Part 1, item 1, state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
- The MARK rows, one by one:
  - Row 2: allow (OPEN-3).
  - Row 9: fix, with the digest observation.
  - Row 12: fix, with its mutation.
  - Rows 16-17: fix, with product mutations.
  - Row 26: fix, with its mutation.
  - Row 32: allow (OPEN-5).
  - Row 33: allow (OPEN-6).
  - Row 35: allow (OPEN-6).
  - Rows 36-38: fix, with product mutations.
  - Row 44: allow (OPEN-4), with M1.
  - L35 and L42: stub field deleted, the Windows FFI structs untouched.

**Correction to the impact read: the L7 fix it proposes would collide with port-2 and 7d.**
- The impact read's L7 fix, `#[cfg(windows)]` on the const, adds a fourth OS-cfg site in engine/src/watch.rs.
- The shipped-tree test pins that file at 3 (scripts/plan/cfg-boundary.test.mjs:65-90 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), so `the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site` would fail.
- The fix would therefore need an edit to cfg-boundary.test.mjs, a port-2 path that entry 7d also re-pins.
- Moving the const into `mod windows_watch` adds no site (OPEN-2).

**The guards: form (i).**
- A fn-level allow on each enclosing fn, nine lines in total, with every guard's expression and message byte-identical.
- docs/08 binds the kernel harnesses as "both refusing a debug build outright" (docs/08_Testing.md:17 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078). The engine guards are bound by their own form (governance/forms/engine/LOD-RELEASE-GUARD-PREREGISTRATION.md).
- Form (i) leaves both untouched. No harness is run in release, and no RESULTS figure changes.
- Form (ii) re-indents about 100 lines. `const { assert!(..) }` breaks debug builds (state/consults/2026-11-03-cloud-suite-linux-report.md:190-298 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078, its section 3.4).

**Declared unchanged, all pieces:**
- test names, assertion strength and messages;
- the seeded draws (the digest);
- the Windows FFI layouts;
- every guard's expression and refusal;
- every recorded figure and RESULTS file;
- every accepted ADR and every docs/ line (docs/06's quotation renders unchanged);
- Cargo.toml and Cargo.lock; no `[lints]` table and no clippy.toml;
- every `pub` signature;
- the cfg-boundary counts;
- the workflow's job and check names.

**Invalidators:**
- A diagnostic at a piece's base in a Scope file that the form does not list. Before the form is committed, the form is re-drafted. After it is committed, it is a class 9 scope addition citing the placement directive by path; I read the placement as the standing directive that adds the work, a reading the custodian may overrule.
- A predicted mutation surviving. The declared fallbacks apply: class 2.
- The digest differing at the head without a mutation applied.
- A guard not refusing a debug build.
- An allow that does not silence its row. Row 33 and row 35 fall back to the fn level, and that change is recorded.
- Rows outside the Scope differing between the base and the head.
- 12d's -D command not exiting 0.
- 12e: a cold run overrunning `timeout-minutes`.

**Stale records: named, not edited.**
- PORT-1-LINUX-L1 :49, :66, :87 and §8 item 2 (:307) (governance/forms/root/PORT-1-LINUX-L1-PREREGISTRATION.md @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) are historical pins that bound port-1's own diff.
  - 12e's form names them.
  - It names the tree as authoritative for what the workflow contains after 12e, and the pins as authoritative for what port-1 claimed.
  - No amendment: none of them claims the current tree.
- WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE :131 (governance/forms/kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:129-131 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078) was true of that piece's diff and of its search at 0c2be9cb.
  - 12c's form notes that its allows and 12e's step end that premise from 12c's merge on, the tree being authoritative.
  - No amendment.
- Out of scope, named only:
  - engine/src/stream.rs:2299-2314 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078: `attr_row_bytes`'s doc runs into the next fn's doc.
  - kernel/src/lib.rs:559-560 (N4).

## 4. Sequencing and overlap (rule (00), AUTONOMY.md:609 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078)

- **#292, #293 and area A:** disjoint from all five pieces.
- **port-2:**
  - Only .github/workflows/product-ci-rust.yml is shared, so 12e waits.
  - port-2's engine and kernel files (app_dirs.rs, lib.rs, lod.rs; the lod_tier builder, cancellation, preflight and root tests; audit/log.rs; app_data_dir_resolution.rs; case_policy_volume.rs) are in no piece's Scope. lod_tier_measurements.rs is not one of them.
  - With OPEN-2 (A), the cfg-boundary files are untouched.
- **1c:** kernel/src/lib.rs and renderer/src/canonical.rs, so 12d waits.
- **8f, from my reading of its form:** its shapes touch engine/src/stream.rs and rowgroup.rs (12a), engine/tests/admission_p4_corpus.rs (12b) and kernel/src/skp.rs (12d). Fillers are sequential, so each piece re-reads at its base.
- **Queued:**
  - Entry 3 edits kernel/src/lib.rs, and entry 7d edits kernel/src/bin/publish-bundle.rs. Both are 12d files, and whichever runs later re-reads.
  - 7d's cfg-boundary re-pin does not meet 12a under OPEN-2 (A).
  - Entry 11 may touch lod_tier_measurements.rs, so 12b checks first.
- **protocol/:** no piece touches it. 12d only reads protocol/data-plane/src/transport.rs:151.

## 5. Verification

**The worker, per piece:**
- **At the base:**
  - `git rev-parse HEAD`, `cargo clippy --version` and `rustc -V`.
  - The JSON run and its counting rule, the Windows read's command 2 and rule (state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md:33, :42 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
- **At the head:**
  - The same JSON run: zero rows in the Scope files, and the rows outside them equal to the base's.
  - 12b records the per-package -D command and its exit. 12d records the workspace -D command, which must exit 0.
  - `cargo fmt --all -- --check`.
  - `cargo test --workspace --locked` in one shared hold.
  - 12a only: `node scripts/plan/cfg-boundary.mjs`.
  - The guard runs (12b, 12c), each with its timeout.
  - Each mutation applied, failing by name with its commit, then reverted, with `git status --porcelain` shown after.
  - `git diff --numstat origin/main...HEAD` and `--name-only`.
  - verify-cites, verify-quotes and verify-test-claims, and `node --test` over the scripts suite.
- **The gates re-run at the reviewed head:**
  - the full suite (Part 1, item 4);
  - the JSON run, and the -D command where the piece claims it;
  - each MARK-row mutation;
  - 12a's and 12c's Linux build-step logs, read for L7, L35 and L42.
- No timing claim anywhere.

## 6. OPEN items

Red lines are marked. A non-red-line item takes my recommendation under the human's direction of 2026-10-31, item 4, which holds until 2026-11-09.

- **OPEN-1: the route.**
  - (A) Five lettered five-line fillers, 12a to 12e.
  - (B) One full form over S1 to S6, then 12e.
  - (C) The impact read's seven slices, with S4a ahead of 1c.
  - Recommend (A). Not a red line.
  - Lettering entry 12 is a queue change. The human orders the queue (state/FILLER-QUEUE.md:3 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078), so the custodian names the split to the human. The PLAN child nodes and the budget are the custodian's.
- **OPEN-2: L7.**
  - (A) Move the const into `mod windows_watch`.
  - (B) `#[cfg(windows)]` on the const, with the counts re-pinned after port-2 and 7d.
  - (C) An unconditional `#[allow(dead_code)]`.
  - Recommend (A).
- **OPEN-3: row 2.**
  - (a) The fold, with a Boolean twin of the estimator test; the twin's mutation drops Boolean to the 8-byte catch-all at engine/src/stream.rs:2369-2373 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078.
  - (b) A comment, which relies on unverified clippy behaviour.
  - (c) A fn-level allow.
  - Recommend (c).
- **OPEN-4: row 44.**
  - (a) An allow.
  - (b) The range form plus a boundary test at MAX_ABS_DOUBLE.
  - Recommend (a).
- **OPEN-5: rows 28-29 and 32.**
  - (a) Allows.
  - (b) The `CreatedSource` alias, which touches a `pub` fn's spelling and kernel/README.md:381.
  - Recommend (a).
- **OPEN-6: rows 33 and 35.**
  - (a) Statement-level allows, falling back to the fn level.
  - (b) The rewrites, unprovable without a release harness run.
  - Recommend (a).
- **OPEN-7: row 45.**
  - (a) The re-wrap.
  - (b) `\+`.
  - Recommend (a).
- **OPEN-8: 12e's form kind.**
  - (A) Five-line with Guarantee TOUCHED under §36, as the sigterm precedent did (governance/forms/kernel/PUBLISH-BUNDLE-SIGTERM-PREREGISTRATION.md:10 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078).
  - (B) A full form, as the rustfmt step took (governance/forms/root/WORKSPACE-RUSTFMT-PREREGISTRATION.md).
  - Recommend (A). If the human's Q1 or Q2 answer installs something, the custodian may take (B) before committing.
- **Q1 (red line), held for the human:**
  - (a) `components: clippy` at :205.
  - (b) No input, relying on the runner's toolchain, with `cargo clippy --version` failing loudly if clippy is absent.
  - (c) A separate job.
  - Recommend (b): it fits "(the toolchain's own clippy; nothing installed)" as worded, against the rustfmt form's reading at governance/forms/root/WORKSPACE-RUSTFMT-PREREGISTRATION.md:87 @ 4cbcab1e5e7872112f2f5ae4df020eb52e6a4078.
- **Q2 (red line), held:**
  - (a) Floating @stable, a new-release redness routed to a follow-up code piece.
  - (b) A pin, which applies to the suite too.
  - (c) A pin in a separate job.
  - Recommend (a).
- **Q3, held for the human by the custodian's answer 1:**
  - (a) Every matrix entry, macOS included after port-2.
  - (b) Windows and Linux.
  - (c) One OS.
  - Recommend (a).
- **Q4, held:**
  - (a) The step's own PR run as the Linux and macOS evidence. A red entry goes to a lettered code piece (12f), never into the workflow piece, and the PR stays in draft meanwhile.
  - (b) A cloud Linux clippy run at 12d's merge.
  - Recommend (a).

## 7. What I could not settle

- Whether a comment silences `if_same_then_else` (OPEN-3 (b)).
- Whether a statement-level allow silences `format_in_format_args` and `manual_contains`.
- Whether an fn-level allow reaches a `#[tokio::test]` body.
- The toolchain action's install profile and components on each runner.
- The Linux-only and macOS-only diagnostics since #278/#279, port-2 and 1c.
- Entry 11's files.
- The branches' contents.
- aca36808's diff.
- Whether row 12's mutation is caught.
- Why Windows reports no `dead_code` on the `#[repr(C)]` structs' unread field.
- Whether workspace path dependencies are linted under `-p`, which bears on 12b's recorded exit.

I have no shell, so I give no sha256. I leave no background shell.

The report path for the custodian's filing: C:/dev/spatial-ide/state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md
