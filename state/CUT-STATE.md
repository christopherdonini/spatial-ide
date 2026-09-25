# CUT-STATE — opened 2026-09-24 (the post-tag arc's ledger archived; the work continues)

## SESSION-CONTINUITY
flushed_at: 2026-09-24T22:56:05Z
tip: 1ac335d4e6a77110c2d3e8a4748dc4f2c055de12
branches: Ready for the human's click (merge commit): #114 docs/adr-035-dataset-session-ended @ f8e77ad (ADR-035, Proposed; fresh count PASS/PASS plus the architect's scoped PASS; CI 5/5; ACCEPTED AS MERGED by round 21 item 1 -- the acceptance edits come in a follow-up docs PR after the merge). In flight: #118 governance/test-claims-withdrawn @ dc769fd (the correction round, worker-high, worktree .claude/worktrees/test-claims-withdrawn). Merged today: #97, #104-#109, #111-#113, #115-#117. Closed unmerged: #110.
position: 2026-09-24 23:00Z -- rounds 17-21 ruled and applied; main green. context: 532.3k/800k (67%) by the human's /context at about 23:00Z (371.4k at 21:55Z).
half-made judgments: After #114 merges: apply the architect's drafted acceptance texts (filed at state/consults/2026-09-24-adr-035-acceptance-drafts.md, 1ac335d) (Status Accepted; Acceptance section with round 21 item 1's words byte-copied by script from DECISIONS-PENDING; the SKP-V0's section 8 dated note of rider (c), not widening the rule) on a fresh branch; regenerate the ADR index; both gates (red-line content: the words must be byte-exact). Riders (a) and (b) go into the watcher's preregistration requirements. #118: if this correction round's gates FAIL on substance, the piece stops under Rule 7 and #108's node reverts to not-done with advisory names (round 21 item 2); a record-only FAIL goes to the architect's reduction (the custodian's reading from round 19 item 2, stated in the RULED block's Applied text). PLAN summaries must avoid a digit followed by whitespace and 'sec' (site.mjs's duration pattern): write 'SKP-V0's section'. Owed PLAN node: the ADR-035 drafter's two kernel notes (post-close invalidated entry; live_or_mint close race).
intended sequencing (next session): Resume from this block and the ledger's 22:52Z entry. (1) On the architect's acceptance drafts: hold until #114 merges, then branch, apply, gate. (2) On #118's correction report: verify mechanically (CI, file PLAN.yaml, the named probe test fails by name, 15 withdrawn/0 findings, append-only both forms), then both gates (attempt 2). (3) After #118 lands: governance-test-claims-superseded-followups, then test-claims-landedness-bound, in sequence. (4) The watcher's preregistration (engine-source-change-watcher) after ADR-035's acceptance lands, carrying rounds 17-21 including riders (a)/(b). (5) Weekly window 2026-09-25: raise the unreported findings.
unreported findings: For the 2026-09-25 weekly window: the skp_admission timing flake (cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock) recurred on #114's CI and passed on rerun -- not the ticket-drop defect; cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory flakes; main's verify-mutation mkdtemp tests leave 263+263 temp dirs; ADR-023 section 2 widenings vs ADR-021 notes; extent.ts degenerate-zoom doc drift; the class-3 row / round 15 (e) tension; Catalog's write guard drop; verify-quotes --show-cites narrowed gives false FAILs; the #116 architect's process note (an Out-of-scope line naming a section-21a category takes the full form); the gate-log node id governance-test-claims-superseded differs from the PLAN id; whether B1's build may start before the watcher lands; a removal marked superseded still passes verify:test-claims; the template's class 6 is short-form only and a full form's overrun has no class but 2 (the #118 gates).
in-flight gate states: Running: #118's correction round (worker-high). The ADR-035 acceptance drafts are filed; waiting on #114's click. gate-log: 185 records.

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
- 2026-09-25T00:32Z - **Handoff: round 21 applied; three PRs ready; wave 1 prepared as the recorded program; the lease relinquished.** The human's instruction of 2026-09-25 had four items: finish the current task and apply round 21's two rulings; copy the wave-1 prompts; set the baseline; write the program, then flush, push and relinquish.
  - **Round 21 item 1 (ADR-035 accepted as merged):**
    - #114 was merged by the human.
    - PR #119 carries the acceptance texts (the architect's drafts, `state/consults/2026-09-24-adr-035-acceptance-drafts.md`): the Status line Accepted; the Acceptance section with the human's words byte-copied by script; the SKP-V0 §8 note of rider (c).
    - Reviewer PASS and architect PASS at 3c7a638. The note's three wording should-fixes are at d2936d7, with the architect's scoped PASS (gate-log node `adr-035-acceptance`).
    - Ready: merge commit, immutable after merge.
  - **Round 21 item 2 (#118's one correction round):**
    - Attempt 2 was a FAIL from both gates, record-only; the substance is fixed and proven (indices 185 and 186).
    - The architect's reduction was applied byte-exact at 9bf9fc1.
    - The scoped confirmation (index 187) found five comment pointers, repointed mechanically at 5f03481. CI 3/3. Ready: merge commit.
    - With it, `governance-verify-mutation-multiline-attrs` closes as done (its rows are in the PR).
  - **For the human's word** (the refused-line residual, on the followups node): a line carrying the `withdrawn-test` marker whose reference the grammar refuses exempts nothing but is never named. The architect reads rider (a) as governing withdrawals only; the human may read it otherwise.
  - **Wave 1: the prompts.** `state/cloud/wave1-prompts.md` is the tracked record of the prompts, byte-identical to the draft except for the baseline SHA and one marked custodian note. Nothing tracked cites the untracked original.
  - **Wave 1: the baseline.**
    - Re-pinned from 59406134a447d6187fae4a6a79fb9f390c8efefb to bb98f71f43a2891d317b10a124387df9d5ee0ebf, uniformly (6 places).
    - Why: #114's merge changed code under `frontends/`, one header string in `frontends/shell/scripts/adrIndex.mjs` and its test naming ADR-034 as reserved. Nothing changed under `engine/`, `kernel/`, `protocol/` or `renderer/`.
    - Product CI was dispatched on bb98f71 and is green: Rust workspace https://github.com/christopherdonini/spatial-ide/actions/runs/36076675466, shell https://github.com/christopherdonini/spatial-ide/actions/runs/36076678443, bundle viewer https://github.com/christopherdonini/spatial-ide/actions/runs/36076681073.
    - Every main commit after bb98f71 touches `state/` only. #119 and #118, if merged, add only a docs change under `protocol/` (the SKP-V0 note) and `scripts/plan/` tooling, neither of them product code.
  - **RECORDED PROGRAM — wave 1** (from `state/cloud/wave1-prompts.md` §5 and §6; while it exists, its order governs, per the session-start ruling (1)):
    1. **Calibration first: A3** (panics reachable from untrusted input), alone.
       - It is bounded and read-mostly like the other audits, so it predicts their cost.
       - It is the audit most likely to need a compiled reproducer, so it tests the build path and the DCO proof before anything depends on them.
    2. **After calibration, decide by what the platform shows:**
       - If per-session spend is visible:
         - batch 1: A1, A2, A4 and A5 in parallel;
         - batch 2: C and D in parallel (both build heavily, independently);
         - batch 3: B alone (the network exception, and the licences need attention).
       - If only the shared balance moves:
         - the same batches, but batch 1 runs as two pairs, A1+A2 and then A4+A5, recording each pair's balance delta;
         - never parallelise past the point where a delta can still be tied to a named batch.
    3. **Recording (§6, custodian only):**
       - `state/cloud/wave1.md` holds the ledger. It is created with the baseline line and the table header of §6.
       - Each report goes verbatim into `state/cloud/wave1/<item>.md`, as immutable evidence.
       - Balance is recorded before and after *each* launch batch, even when per-session figures exist, so the two can be reconciled.
       - Spend is never estimated from tokens. A figure that is not shown reads "not attributable".
       - The custodian fields of §3 are filled locally, never by the worker.
    4. **Prompt assembly (§7):**
       - A2–A5 are built by copying A1 in full and swapping exactly the item id, the branch name and the TASK block. "[paste §3's schema]" becomes §3's worker fields verbatim.
       - The exact assembled text of each prompt is recorded beside its session ID.
    5. **Triage (§4):** the custodian decides severity. S1 candidates go to the human in one batch after the wave, with evidence. Nothing becomes a cut in this wave.
  - **Lease:** relinquished by this session (856bc41b), on the human's word. `CUSTODIAN-LEASE` is rewritten to a single `relinquished:` line. The incoming session verifies the relinquish and that origin's tip matches this flush before taking the lease.
