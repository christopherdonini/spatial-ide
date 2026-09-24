# CUT-STATE — opened 2026-09-24 (the post-tag arc's ledger archived; the work continues)

## SESSION-CONTINUITY
flushed_at: 2026-09-24T19:37:39Z
tip: 2118ec6109794d6caa7c1c3f13d46a716c57e7d0
branches: Waiting on the human's click (merge commit, never squash), in this order: (1) #112 cut/crs-unit-fact-and-bounds @ 2d0d51e (both gates PASS, fresh count; CI 6/6 green, mergeable CLEAN at 19:30Z); then the custodian re-merges main into #108 (generated files only, regenerate); then (2) #108 governance/verify-mutation-multiline-attrs @ 419c526 (union design; node stays in progress after merge, gate = its form, round 19 item 2). In flight: #116 fix/kernel-ticket-drop-under-registry-lock @ 7744fbd on origin (worktree C:/dev/wt/kernel-ticket-drop, local merge 8caae2a unpushed; correction round running). #117 governance/test-claims-superseded @ cba517d (draft; the scanner round's report received 19:3xZ, pushed, worktree clean; custodian verification then full gate next). STOPPED, draft: #114 docs/adr-035-dataset-session-ended @ 22a0272 (waits for #116, then one read under round 19 item 1). Merged today: #97, #104-#107, #109, #111, #113, #115. Closed unmerged: #110.
position: 2026-09-24 19:40Z -- rounds 17-19 ruled and applied; the post-tag arc's ledger archived (state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md) and this ledger opened; the stale 'Open at the close' list dropped (all items done or PLAN nodes). Only the clicks wait on the human (#112 then #108); the status-line proposal (state/drafts/statusline-context-proposal.md) is the human's to apply. context: unmeasured.
half-made judgments: Do not push PLAN.yaml or generated-file changes to main until #112 and #108 are merged: every such commit re-conflicts both (gate-log and CUT-STATE commits are safe). After #112 merges, #108 needs one re-merge of main (generated files only) before its click. #116: after the correction round, run gate attempt 2 (reviewer + architect); record-only residue is reduced to references under the record cap. ADR-035's read under a fresh count states round 19 item 1 as Decision text: emission at the single place the kernel records a generation's end (every end emits: pre-check, post-check, drop path, watcher), the Open item on post-check emission removed, the at-most-once gate kept as that single point's precondition, rider (a) unchanged, the record nits corrected. #117: the worker appended condition (e) to AUTONOMY.md's section 6a sentence on the same line (no line shift claimed; verify-cites PASS claimed) -- check that it is a clause the round authorised, not a new governance clause (record cap: no new clauses from record failures); it reports P3b's three names already SUPERSEDED and #108's twelve PLANNED.
intended sequencing (next session): Resume by reading this block and the ledger's 19:40Z entry. Then: (1) when the human clicks #112, re-merge main into #108 and tell the human; (2) verify #117's report mechanically (tests, verify-quotes/cites/test-claims/mutation, the AUTONOMY.md edit's authority, append-only) then its full gate (reviewer + architect) under the fresh count; (3) on #116's correction report: verify mechanically, dispatch gate attempt 2; on PASS mark ready; (4) after #116 merges: ADR-035's read (architect redraft stating round 19 item 1, then both gates under a fresh count); (5) after #117 lands: close briefa-p3b-owner-side-invalidation and governance-verify-mutation-multiline-attrs as done, then test-claims-landedness-bound becomes ready. Deferred: the health refresh commit until the clicks; sweep merged worktrees once clean+pushed+merged is confirmed.
unreported findings: Weekly-window list additions today (next window 2026-09-25): two timing tests flake under load (cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory; cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock); main's verify-mutation mkdtemp tests leave verify-mutation-* and verify-mutation-noref-* directories in %TEMP% (263 each); whether each later ADR-023 section 2 widening needs its own ADR-021 note; extent.ts's degenerate-zoom doc drift; a class-3 row whose span exists only on an unmerged branch cannot meet round 15 (e) and the template's span pin at once; Catalog's write guard drops a replaced Arc<Dataset> in-statement; verify-quotes --show-cites narrowed to a file list gives two false FAILs in AUTONOMY.md (the #117 worker's note). Earlier items: the archived ledger's round-17 list (state/questions/round-17.md's end).
in-flight gate states: Running: #116 correction round (worker-high, aed536fd4544e086d). Finished: the scanner round (a7dd24057ad8d3297, report received as a message). #112's CI watcher finished green. No gate running. gate-log: 171 records (latest: #116 attempt 1). Health refresh still deferred (it would re-conflict #112/#108).

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
