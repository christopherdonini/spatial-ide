# CUT-STATE — opened 2026-09-24 (the post-tag arc's ledger archived; the work continues)

## SESSION-CONTINUITY
flushed_at: 2026-09-24T22:01:44Z
tip: a6431050c2eb8e1dd055063317d25bb20cf934ab
branches: In flight: #114 docs/adr-035-dataset-session-ended @ 8d4b13d (draft; the round-19 redraft; fresh-count attempt 1: reviewer and architect running; worktree C:/dev/wt/adr-035-dataset-session-ended). governance/test-claims-withdrawn (worker running, worktree .claude/worktrees/test-claims-withdrawn; the withdrawn marker per state/consults/2026-09-24-withdrawn-marker.md; #108's node flips done in that PR). Merged today: #97, #104-#109, #111-#113, #115-#117. Closed unmerged: #110. Kept worktree: .claude/worktrees/verify-mutation-header-token (dropped, unmerged).
position: 2026-09-24 22:01Z -- rounds 17-20 ruled and applied; all of the day's PRs landed except #114; PLAN true on main (708e361, then docs-only commits). context: 371.4k/800k (46%), measured by the human's /context at about 21:55Z (the first measured reading this session; the status-line proposal state/drafts/statusline-context-proposal.md is still the human's to apply).
half-made judgments: ADR-035: Status stays Proposed (acceptance is the human's red line); if both gates pass, mark #114 ready and raise acceptance in a question round with Decision 4's section-8 reading. The drafter's gate-log index note was wrong (line vs array index) and is carried nowhere. The withdrawn marker: the consult's design binds the worker; the custodian's reading adds the entry-id citation form (rider (a) names it); full form; <=280 lines; five #108 rows (ruling round 20 item 1, carrier round 18 item 4) pinned at the merge-base. When it lands, governance-test-claims-superseded-followups and test-claims-landedness-bound follow in sequence (same functions, same AUTONOMY line), never in parallel. Owed PLAN node: the ADR-035 drafter's two kernel notes (a post-close invalidate's stray invalidated entry; a viewport_query racing close_dataset minting for a closed name). kernel-ticket-drop-followups stays proposed (full gating when scheduled).
intended sequencing (next session): Resume from this block and the ledger's 22:01Z entry. (1) On the ADR-035 gate reports: record both in the gate log; on PASS/PASS mark #114 ready and ask the human about acceptance (red line, typed); on FAIL, correct under the fresh count (record cap applies). (2) On the withdrawn-marker worker's report: verify mechanically (CI at the head, file PLAN.yaml, the 15-withdrawn prediction, append-only, the mutations) then full gate (reviewer + architect). (3) After it lands: the followups node, then the landedness bound. (4) Add the owed kernel follow-up node from the ADR-035 drafter's notes. (5) Weekly window 2026-09-25: raise the unreported findings list.
unreported findings: For the 2026-09-25 weekly window: the skp_admission timing flake (cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock; not the ticket-drop defect per #116's reviewer); cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory flakes; main's verify-mutation mkdtemp tests leave 263+263 temp dirs; ADR-023 section 2 widenings vs ADR-021 notes; extent.ts degenerate-zoom doc drift; the class-3 row / round 15 (e) tension; Catalog's write guard drop; verify-quotes --show-cites narrowed gives false FAILs; the #116 architect's process note (an Out-of-scope line naming a section-21a category takes the full form) as a proposal; the gate-log node id governance-test-claims-superseded differs from the PLAN id; whether B1's build may start before the watcher lands; a removal marked superseded still passes verify:test-claims (the withdrawn consult's disclosed bypass).
in-flight gate states: Running: ADR-035 fresh-count attempt 1 (reviewer + architect); the withdrawn-marker worker. gate-log: 178 records (latest: #116 attempt 3 PASS/PASS).

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
- 2026-09-24T22:01Z - **ADR-035 redrafted and at its fresh-count gates; the withdrawn marker dispatched.**
  - **ADR-035 (PR #114):**
    - Main merged in at 1f96ba1, with no conflicts.
    - The architect's round-19 redraft was applied byte-exact at 8d4b13d, with the ADR index row regenerated. It covers:
      - round 19 item 1 as Decision text: a single end point, every end emitting, at most once, keyed on the live generation removed;
      - a non-blocking enqueue, with close-time ends emitted before `forget_dataset`;
      - the Open item removed;
      - the tree described as main after #116;
      - the watcher's literal, `skp/0.5`.
    - The drafter's gate-log index note was wrong: it counted file lines. Array index 173 is file line 175, #116's architect attempt 2. The note is not carried anywhere.
    - Attempt 1 of the fresh count dispatched: reviewer and architect in parallel. The PR body was updated.
    - The drafter suggested one follow-up node, owed. It covers two items:
      - a post-close `invalidate` leaves a never-removed `invalidated` entry;
      - a `viewport_query` racing `close_dataset` can mint a generation for a closed name.
  - **The withdrawn marker:**
    - The architect's pre-work consult is filed at `state/consults/2026-09-24-withdrawn-marker.md` (90de3e9). Its design:
      - token `withdrawn-test`;
      - rider (a) resolved against the current ledger's RULED blocks, by round/item or by entry;
      - rider (b)'s carrier required on every row;
      - the full form, with a ≤280-line budget;
      - #108's five rows citing ruling round 20 item 1 and carrier round 18 item 4, pinned at the merge-base.
    - Worker dispatched in `.claude/worktrees/test-claims-withdrawn`. The form is committed before any code, and #108's node flips to done in the same PR.
  - **Context: 371.4k of 800k (46%),** measured by the human's `/context` at about 21:55Z. The first measured reading this session.
- 2026-09-24T22:52Z - **ADR-035 ready and accepted as merged (round 21, red line, typed). #118 failed its first gates; one correction round granted. Main briefly red.**
  - **ADR-035 (PR #114):**
    - Fresh count under round 19 item 1:
      - Attempt 1: the architect FAILED on close-time ordering (a data-plane-thread end recorded before `forget_dataset`, whose enqueue follows it); the reviewer PASSED.
      - The drafter's ten edits at ce5b8e2.
      - Attempt 2: PASS/PASS.
      - Three custodian wording fixes at f8e77ad, with the architect's scoped PASS.
    - CI 5/5. Marked ready: merge commit, Status Proposed.
  - **PR #118 (the withdrawn marker), attempt 1: both gates FAILED on the same substance item.** Rider (a)'s "fails by name" was built weaker: a row with an unresolvable citation is checked only when its claimed test is missing. The reviewer's probe passed a row citing `round 99, item 1` with carrier `nonsense`. There was record-only residue besides. Verified as sound: #108's five pins, 15 withdrawn, and SUPERSEDED unchanged.
  - **Round 21** (f086085), both answers typed and verbatim in the RULED block:
    - Item 1, a red line: ADR-035 is accepted as merged, and Decision 4's reading is confirmed with rider (a)-(c).
      - After #114 merges, one fully gated docs piece: Status Accepted, an Acceptance section with the words byte-copied by script, and the SKP-V0 §8 dated note (rider (c)). The architect is pre-drafting the texts.
      - Riders (a) and (b) bind the watcher's preregistration.
    - Item 2: one correction round for #118. The reviewer's probe becomes a named regression test. If the round fails again, Rule 7 stops the piece.
    - A worker-high round was dispatched.
  - **Main red for one run.** The round-21 PLAN commit f086085 was pushed by a chain whose `;` bypassed a failed `site.mjs`. The PLAN summary's "SKP-V0 section 8" had tripped the duration pattern. It was fixed at 618dada (reworded, regenerated), and Governance is green again. The lesson is appended to the gate-on-exit-code memory.
