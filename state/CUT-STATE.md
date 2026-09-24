# CUT-STATE — opened 2026-09-24 (the post-tag arc's ledger archived; the work continues)

## SESSION-CONTINUITY
flushed_at: 2026-09-24T21:29:56Z
tip: f082c3128a2ce0ab89fd842e65345ab585e648b2
branches: Ready for the human's click, merge commit (never squash): #116 fix/kernel-ticket-drop-under-registry-lock @ 51bf4d5 (attempt 3 PASS/PASS; CI 9/9; no generated files); #117 governance/test-claims-superseded @ c25efd5 (architect PASS index 171, reviewer scoped PASS index 175; re-merged after #112, CI watched). STOPPED, draft: #114 docs/adr-035-dataset-session-ended @ 22a0272 (after #116 merges: one read under round 19 item 1). Merged today: #97, #104-#109, #111-#113, #115. Closed unmerged: #110.
position: 2026-09-24 21:35Z -- rounds 17-20 ruled and applied; #112 merged 21:14Z; PLAN true on main at d818c5a (ready set empty). Waiting on the human's clicks (#116, #117). context: unmeasured (the status-line proposal state/drafts/statusline-context-proposal.md is the human's to apply).
half-made judgments: Main PLAN commits are no longer held: keep PLAN true and re-merge open PRs promptly (generated files regenerated; check `file PLAN.yaml` for CRLF). On #116's merge: kernel-ticket-drop-under-registry-lock -> done (evidence pr 116); then ADR-035's redraft by the architect under a fresh count, stating round 19 item 1 as Decision text and the #116 architect's constraints (gate-log index 173): GenerationRegistry::invalidate is the single end point; the at-most-once gate keys on the live generation actually removed; emission is a non-blocking enqueue that never re-enters a lock; close-time ends emit before forget_dataset. On #117's merge: briefa-p3b-owner-side-invalidation and governance-test-claims-superseded-scanner -> done (evidence pr 117, gate = the form, which main then carries); governance-verify-mutation-multiline-attrs stays in progress (round 20); governance-test-claims-withdrawn-marker becomes ready (one round, fully gated, riders (a)/(b) as requirements; five-line form committed before code); test-claims-landedness-bound also unblocks.
intended sequencing (next session): Resume from this block and the ledger's 21:35Z entry. (1) On #117's CI watcher: tell the human it is clickable. (2) After #116's click: node done; dispatch ADR-035's redraft (architect), then both gates. (3) After #117's click: nodes done; dispatch the withdrawn-marker piece (worker, form first). (4) Sweep merged worktrees (clean+pushed+merged: crs-unit-fact-and-bounds, verify-mutation-multiline-attrs, known-limitations-owed-rows, adr-021-023-b1-notes, fixture-regeneration-entry-point, shell-dependency-audit, engine-tests-configured-connections, verify-gate-file-exists, drill-*) and read main's CI. Weekly window 2026-09-25: raise the unreported findings.
unreported findings: For the 2026-09-25 weekly window: the skp_admission timing flake (cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock) -- not the ticket-drop defect per #116's reviewer (its message prints after host.cancel returns); cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory also flakes; main's verify-mutation mkdtemp tests leave 263+263 temp dirs; ADR-023 section 2 widenings vs ADR-021 notes; extent.ts degenerate-zoom doc drift; the class-3 row / round 15 (e) tension; Catalog's write guard drop; verify-quotes --show-cites narrowed gives false FAILs; the #116 architect's process note (an Out-of-scope line naming a section-21a category takes the full form at dispatch) as a proposal; the gate-log node id governance-test-claims-superseded differs from the PLAN id -scanner; whether B1's build may start before the watcher lands (PLAN now sequences it after, by the night ruling's literal order).
in-flight gate states: No agent running. #117 CI watcher (background). gate-log: 178 records (latest: #116 attempt 3 PASS/PASS; #117 reviewer scoped PASS at index 175).

Previous ledger: `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md` (the post-tag arc, 2026-09-13 → 2026-09-24; archived byte-identical by `git mv`; its last flush named tip d4362bd). Before it: `state/cut-archive/CUT-STATE-2026-09-13-release-0.1.0.md` (the release cut; v0.1.0 = b391e43).

## Ledger
- 2026-09-24T19:40Z - **Ledger rotated on the human's post-compaction check.** The post-tag arc's ledger (2026-09-13 → 2026-09-24, 466 lines) was moved byte-identical to `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`. The resume order reads only this file.
  - **"Open at the close" (dated 2026-09-13) is not carried over.** Every item in it is either done or tracked as a PLAN node:
    - blocked: entry-77-code-signing, signpath-application-draft, entry-79-b1-consult-items, geometry-types-beyond-polygons, and m13-bracketed-values (behind release-v0-1-1);
    - proposed: release-v0-1-1.
    - The SESSION-CONTINUITY block and the generated queue cover what is open now.
  - **Cites into the old file were moved with it:**
    - `state/drafts/sitting-2026-09-14-prep-pack.md`'s two cites now name the archive path. The line numbers are unchanged and their text was checked to still be there.
    - `state/consults/2026-09-24-crs-unit-fact-and-bounds.md` cited line 8 of the continuity block, which every flush rewrites. The cite now names commit 464a6a1, where that line held the cited log.
  - **Lease:** held by this session since the archive's 00:50Z entry (a verified handover). No handover since.
  - **In-flight agents at the check:**
    - The #116 correction round (worker-high) is still running. The one uncommitted change in its worktree (`kernel/src/skp.rs`) belongs to that live worker's mutation step and was left alone.
    - The scanner round finished at cba517d, pushed, worktree clean. It opened PR #117 (draft).
  - **Context:** unmeasured. Entry 118 item 3 was re-verified on 2.1.282: the status line's input carries `context_window` with `used_percentage`. The user-level setting is proposed in `state/drafts/statusline-context-proposal.md`, for the human to apply.
- 2026-09-24T19:41Z - **#108 merged by the human (26ff84a), before #112. #112 re-merged. #117 at its fresh-count gate.**
  - **#108:** its node `governance-verify-mutation-multiline-attrs` stays in progress with the form as its gate (round 19 item 2), until the scanner lands.
  - **#112:** main conflicted in the generated files only. Main was merged at e5d3a09, the generated files regenerated (both `--check`s pass), and PLAN.yaml auto-merged. The scripts suite passed 262/0; cites, quotes, test-claims and mutation all PASS. Pushed; CI is watched. It is next for the click.
  - **#117 (the scanner, cba517d):**
    - The round's report was verified mechanically: 264/0 tests; quotes, cites, test-claims, mutation and plan all PASS; the form has zero deleted lines since 138a5c6.
    - AUTONOMY.md changed on one existing line of section 6a.
    - Attempt 1 of the fresh count dispatched: reviewer and architect in parallel. The reviewer also tests the landing precondition: main plus #108 plus #117, with both nodes set to done, under verify:test-claims.
    - #117 now conflicts with main in the generated files only. It is re-merged after its gates, because the reviewer is reading the worktree.
  - **#116:** no conflict with main; its correction round is still running.
- 2026-09-24T21:05Z - **Round 20 ruled; #117 and #116 at their closing commits; #112 green.**
  - **Round 20** (entry 134; the RULED block at 05f70d2): the `withdrawn` marker, with both of the human's riders, after #117 lands. #108's node closes as done when its rows are in. Entry 133's premise, that the scanner would neutralise #108's twelve names, was the custodian's error; entry 134 says so.
  - **#112:** re-merged at e5d3a09. The Rust job failed once, on the known timing flake. #116's reviewer showed from the code that the flake is not the ticket-drop defect: its message prints after `host.cancel` returns. The re-run passed, 6/6. It is next for the click.
  - **#117:**
    - Fresh-count attempt 1: the architect PASSED with the record reduced; the reviewer FAILED on B1, CI drift. The worker's on-disk PLAN.yaml was CRLF, so the generated hashes named bytes no checkout has. The custodian's local check passed on those same bytes.
    - Fixed at c85aa45: LF from the index, main merged, generated files regenerated, and the dropped `governance-hash-grammar-shared` node restored.
    - Closing commit 6e3c8a1: the architect's replacement R-line appended byte-exact, and the follow-up node `governance-test-claims-superseded-followups` added.
    - The reviewer's scoped confirmation is running.
  - **#116:**
    - Attempt 2: both gates FAILED record-only, with the substance passing (CI 9/9; every mutation re-observed).
    - Closing commit 51bf4d5, record round 2: the architect's drafted Amendment 2 and two in-place doc-comment edits, applied byte-exact. The figure is unchanged at 535, and the form has 0 deletions.
    - Scoped re-reads by both gates are running.
  - **PLAN nodes owed on main after #112's click** (held because every main PLAN commit re-conflicts open PRs):
    - (1) the `withdrawn` marker piece (round 20);
    - (2) #116's follow-up: the rest of N3 with the swept/retired declaration order, the `debug_assert` with `prev` kept alive past `drop(tickets)`, the R-S5 text and N4. Full gating, because the unwind reordering changes drop order on a never-block path;
    - (3) the process note from the #116 architect: when a piece's Out-of-scope line names a §21a category at dispatch, it takes the full form.
- 2026-09-24T21:35Z - **#112 merged by the human (8c58596, 21:14Z). PLAN made true on main. #117 re-merged.**
  - **PLAN (d818c5a):**
    - Done: crs-unit-fact-and-bounds (#112), known-limitations-owed-rows (#109), adr-021-023-b1-notes (#113) and fixture-regeneration-entry-point (#115).
    - The scanner node is in progress (PR #117, waiting on the click). It is the branch's block, except that main keeps `gate: none`, because the form is not on main yet.
    - Added: `governance-test-claims-withdrawn-marker` (round 20) and `kernel-ticket-drop-followups`. #108's node is noted with entry 134.
    - `b1-engine-kernel-half` now depends on `engine-source-change-watcher`. With its other dependencies done, it derived ready, and RULED 2026-09-24 (night) item (2) gives B1 the literal after the watcher's, so it lands after the watcher. Its human sight happened in round 17.
    - The ready set is empty.
    - The Stop hook had blocked twice on the stale ready scanner node. The hold on main PLAN commits had kept main untrue; it is lifted, and the custodian re-merges open PRs promptly instead.
  - **#117:** re-merged at c25efd5. One PLAN conflict, the scanner node's gate line, was resolved to the branch's side. The generated files were regenerated from the LF file; plan_hash equals the staged PLAN.yaml. 270/0 tests, and cites, quotes and test-claims PASS. CI is watched.
  - **#116:** touches no generated file; it waits on the click as is.
  - **Correction:** the 21:20Z flush (a21c92a) still listed #112 as waiting. It had merged six minutes earlier.
- 2026-09-24T21:52Z - **#116 (f165218, 21:32Z) and #117 (aa79322) merged by the human. Every PR the day opened has landed except #114.**
  - **PLAN (708e361):**
    - Done: kernel-ticket-drop-under-registry-lock, the scanner, and P3b (round 19 item 2).
    - In progress: engine-source-change-watcher (ADR-035's read, round 19 item 1).
    - Ready: governance-test-claims-withdrawn-marker (round 20, order 1), then test-claims-landedness-bound (round 17 item 8, order 2).
    - `governance-verify-mutation-multiline-attrs` stays in progress (round 20).
    - kernel-ticket-drop-followups stays proposed.
  - **Main's CI is green:** Governance and Pages at 708e361; Rust workspace and shell at f165218.
  - **Dispatched, two architect consults in parallel:**
    - ADR-035's redraft. It states round 19 item 1 and the constraints in gate-log index 173, corrects the premises the kernel fix changed, and names the watcher's literal from `protocol/` on main.
    - The withdrawn marker's design: the row grammar, riders (a) and (b) as mechanical checks, #108's fifteen rows, and the budget.
  - **Worktrees swept.** 13 removed, each verified merged, pushed and clean, with no process running in it. C: went from 39 to 69 GB free. Kept: `C:/dev/wt/adr-035-dataset-session-ended` (active) and `.claude/worktrees/verify-mutation-header-token` (dropped, unmerged).
