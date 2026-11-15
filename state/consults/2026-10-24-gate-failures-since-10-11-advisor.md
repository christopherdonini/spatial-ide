# Gate failures since 2026-10-11: classification and time cost (advisor consult, 2026-10-24)

*An advisory consult, not a ruling. Read at main `56441fcab5bea571ebb9aa2ac724d28c2fd0ea0d`: `state/gate-log.json` rows 472–618 and the gate reports they name. One agent classified every non-passing row, and a second agent classified the same rows blind, from the gate log and the reports alone. The advisor settled the disagreements from the notes (section 9); the counts and tables here are the settled values. Judgment calls are marked "?" in the table. The time figures in section 7 were computed by the advisor from the run times in the notes and recomputed independently by the second agent, with the same result. Nothing in the repository was edited.*


147 gate runs since 10-11; 57 not PASS/PASS WITH NOTES (56 FAIL, 1 VOID = row 540). Per-row data: the appendix table (`fails.csv`, settled values). "?" = judgement call. Where a count says "(n ?)", n of those rows carry the "?".

## 1. Counts (57 rows)
- Classes of blocking findings: C only 34, E only 9, C+E 13, none 1 (the VOID). By label: C in 47 rows, E in 22. No D finding blocked anything. Wording blocks labelled W were counted as the gate filed them: W-1..3 in 538 as C; W1 in 615 under the "Evidence (blocking)" heading, so E.
- Target: sentence 28, code-behaviour 16 (2 ?), test-or-evidence 11, other 2 (the 540 VOID; 588, a CI job hit GitHub API 503s). No row was mainly record-or-process or scope. Those showed up only as secondary findings (507 C-2 scope; 472/509/609 records).
- Origin: code 27, form 12, worker-record 9, human 4, custodian-record 3, n.a. 2. "human" is an added value: in 479, 480, 481 and 505 the untrue words were typed by the human, verbatim per the directives. It is kept apart from "form".
- Mechanical: yes 3, no 53, n.a. 1. The 3 are 509 (suite not run at the head), 588 (CI red) and 609 (the brief named the wrong mutations). 538/539 (an option with only test callers) and 563/565 (a stale 120 s comment) are not counted: catching them needs the caller grep and the sibling search the rules already require, not a generic script. Pins, hashes and counts were recomputed at almost every gate with 0 mismatches.
- code_changed_after: yes 29, no 5, no? 5, unknown 3, n.a. 15.
  - no? = the files changed are outside md/state/docs but only comments changed. The literal file rule gives yes 34, no 5.
  - unknown = commits missing from the shallow clone (581/582, 609).
  - n.a. = no later gate run on the node: the fix was applied without a re-gate, the human still holds it, or it is pending from 10-24.
- Shape: full 40, scoped 15, single 2. Only 5 notes say "full gating". The other 35 are inferred because both gates ran at gate 1 (AUTONOMY §21a).
- Attempt: 1 → 41, 2 → 12, 3 → 3, 4 → 1. Gate: architect 28, reviewer 29.

## 2. Both gates on the same finding
- A round here means the same node at the same reviewed commit, with the VOID excluded. There were 35 rounds with at least one non-pass:
  - 5 were single-gate rounds;
  - 9 had one gate fail and the other pass;
  - 21 had both gates fail.
- Of the 21 both-fail rounds:
  - 7 had identical blocking sets: 488/489, 541/542, 563/565, 567/568, 593/594, 595/596, 617/618.
  - 12 shared at least one blocking finding, with extra findings on one side (one of these, 615/616, is a "?").
  - 2 shared nothing: 509/510 and 585/586.
- In 2 of the 9 split rounds, the passing gate had written down the same defect as non-blocking: 511 vs 512, and 556 vs 557.

## 3. Per node
- 48 nodes had gate runs and 28 had at least one non-pass. The top 8 by runs:

| node | runs | non-pass | dominant target |
|---|---|---|---|
| shell-migration-milestone-2 | 10 | 5 | code-behaviour (4/5) |
| governance-cut-state-cap-and-rotation | 8 | 5 | tie: code-behaviour 2, test-or-evidence 2 (+VOID) |
| shell-migration-milestone-3 | 8 | 4 | code-behaviour (4/4) |
| shell-map-refill-after-resize | 7 | 4 | tie: code-behaviour 2, sentence 2 (human's) |
| b2-piece-1b-recording | 6 | 4 | sentence (2/4) |
| governance-plan-summaries-archive | 6 | 2 | test-or-evidence (2/2) |
| adr-036-pre-acceptance-block | 5 | 1 | sentence (1/1) |
| bundle-redaction-scan-not-in-product-publish | 5 | 2 | code-behaviour (2/2) |

## 4. Gate runs vs PR size (first-parent `git diff --shortstat` of "Merge pull request #N")
- Both values are known for 40 nodes. The other 8 nodes have PRs that are not merged at 56441fca: #241, #244, #249, #251, #252, #253, #254, #255.
- Spearman ρ, gate runs vs total changed lines: 0.74 (n=40). Against code-only lines (not md/state/docs): 0.68. Non-pass runs vs total lines: 0.53.
- Restricted to the 32 nodes that took both gates at attempt 1, ρ = 0.52 (code-only 0.48). The all-node figure is inflated by 8 single-reviewer documentation pieces (1-2 runs, 2-24 lines).
- Caveats: #205 had 1 gate run before 10-11, and excluding it changes ρ by less than 0.01. #232's 10,120 lines are mostly archive moves (832 lines of code).
- Largest: milestone-2 (#212 + #217): 10 runs, 7,200 lines. b2-piece-1b: 6 runs, 4,925 lines. milestone-3: 8 runs, 3,221 lines. cut-state rotation: 8 runs, 825 lines. map-refill: 7 runs, 475 lines. adr-036: 5 runs, 64 lines.
- The full table is in the appendix.

## 5. Wall time ("run X to Y" is given for 146 of 147 rows; the VOID shows 20 s in its own text)
- Sum of run durations: 34.1 h. The 56 non-pass runs took 16.2 h, 47%.
- Architect and reviewer run in parallel, so the elapsed time (the union of the run intervals) is 24.7 h. Non-pass runs cover 13.3 h of it, 54%.
- Reviewer runs: median 15.3 min, 27.5 h in total. Architect runs: median 5.8 min, 6.7 h in total.

## 6. Patterns the counts do not show
- **Re-gates fail on what the last correction added.** 15 non-VOID failures came at attempt 2 or later. In 12 of them the blocked text or code was added by the previous correction round or ruling (3 of these, 479 to 481, were the human's own words from a ruling). Of the other 3, two were sibling cases of the same defect that the correction missed (510, 512), and one a suite still not run (509). Examples:
  - 541: R8's assertion, gate 1's own E-1 remedy, breaks on the piece's own rotation.
  - 551: round 1's focus fix regresses reopen.
- **Untrue sentences mostly come from upstream text.** 16 of 28 sentence failures trace to the form (12, often drafted by the architect) or to the human's typed words (4). Examples:
  - 599: the architect FAILs its own §2.3 drafting.
  - 480: the human's verbatim clause.
- **Some FAILs are passes once the words are applied.** In 9 FAIL rows the only blocking finding was a non-human sentence. The gate supplied the replacement words and nothing was re-gated: 504, 515, 563, 565, 595, 596, 599, 600, 615. Five whole rounds closed this way. Examples: 504 ("after which the report reads pass") and 595.

## 7. Time cost (advisor's computation)

**Method.**
- A round is one node at one reviewed commit.
- For each round with a non-passing run, two figures were taken from the gate log's run times:
  - the gate time of the next round on that node;
  - the elapsed time from the failing round's end to the next round's start.
- A group's low figure counts rounds where every blocking row belongs to the group; the high figure counts rounds where any does.

**Totals.**
- 35 failing rounds; 25 were followed by another round.
- 7.6 hours of re-gate time.
- 31.5 hours from failing round to next attempt (median 0.7 h per round).

| Group | Failing rounds | Re-gate time | Time to next attempt |
|---|---|---|---|
| Untrue sentence from the form or the human's words | 10–12 | 1.2–2.4 h | 6.5–9.8 h |
| Failure on what the previous correction or ruling added | 8 | 1.8 h | 6.9 h |
| A sibling case the correction missed, or a leftover | 2 | 0.7 h | 9.7 h |
| Mechanical (a script could have caught it) | 2–3 | 0.0–0.4 h | 3.5–4.3 h |
| The four above together, overlaps removed | 18–20 | 3.4–4.6 h | 22–25 h |
| Sentence-only, the gate supplied the words, no re-gate | 5–6 | about 0 | about 1 h |
| Wrong code behaviour (real defects) | 7–10 | 2.4–3.9 h | 13–16.5 h |

**Not timed:**
- the custodian's own work per round: filing reports, dispatching the correction and the re-gate, amendments;
- tokens.

The elapsed time is not idle time: the other slot keeps working meanwhile.

## 8. Two facts checked by the advisor

- **Tool use since 10-11:**
  - the architect gate used Read, Grep and Glob only (Read 1,679, Grep 1,152, Glob 123);
  - the reviewer gate used Bash 3,602, Read 546, Grep 36, Glob 3.
  The two gates do not repeat each other's commands.
- **Milestone 3, PR A:** the round-1 worker report disclosed an unhandled sibling case and no test for it (`state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-worker-report.md:60`). Gate 2's reviewer failed on that case (`state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate2-reviewer.md:93`).

## 9. Independent re-check and its settlement

**Method.**
- A second agent classified the same 57 rows blind: it did not see the first classification.
- It used the gate log and the 57 gate reports at the same commit, and recomputed the round times by its own method.
- The advisor compared the two row by row and settled each disagreement from the row's note.

**Agreement.**
- target: 56 of 57;
- origin: 54 of 57;
- mechanical: 52 of 57;
- words only: 57 of 57 (the same 9 rows).
- The time figures were identical: 35 failing rounds, 25 with a next round, 457.7 minutes of re-gates, 31.48 hours to the next attempt (median 0.75 h).

**Settled.**
- **505, origin:** human. Its note says "FAIL on the human's wording only".
- **504, origin:** worker-record. The form listed the README claim as one that may not be made, and the worker's README made it.
- **507, origin:** code. The form's section 1 required the class-C row, and the code did not write it.
- **538, 539, 563, 565, mechanical:** no, for the reason given in section 1.
- **588, target:** other. A CI job failed on GitHub API 503s; the piece had no defect.
- **Correction content at attempt 2 or later:**
  - 510 and 512 are sibling cases of milestone 2's C1 that the correction missed, not text or code it added;
  - 509 is a leftover (a suite still not run).
  - The first classification's "14 of 15" is therefore 12 of 15.
- **The effect on section 7:** the total that the four targeted groups cover moves from 19–21 rounds to 18–20, and its hours by less than 0.3 h of re-gates and 1 h of waiting. The split within it changes: the two missed-sibling rounds carry 9.7 of its hours, because milestone 2 waited for a ruling on a third round.

## Appendix: gate runs since 10-11 vs first-parent changed lines per node (None = a PR not merged at 56441fca)

| node | runs | non-pass | PRs | lines | code lines |
|---|---|---|---|---|---|
| shell-migration-milestone-2 | 10 | 5 | #212,#217 | 7200 | 7125 |
| governance-cut-state-cap-and-rotation | 8 | 5 | #229 | 825 | 697 |
| shell-migration-milestone-3 | 8 | 4 | #233,#234 | 3221 | 3148 |
| shell-map-refill-after-resize | 7 | 4 | #207 | 475 | 440 |
| b2-piece-1b-recording | 6 | 4 | #222 | 4925 | 4682 |
| governance-plan-summaries-archive | 6 | 2 | #237 | 1499 | 1042 |
| adr-036-pre-acceptance-block | 5 | 1 | #240 | 64 | 0 |
| bundle-redaction-scan-not-in-product-publish | 5 | 2 | #241 | None | None |
| b1-shell-half | 4 | 2 | #246,#253 | None | None |
| flush-crlf-field-rewrite | 4 | 2 | #248 | 51 | 51 |
| governance-decisions-pending-open-and-archive | 4 | 1 | #232 | 10120 | 832 |
| module-docs-stale-statements | 4 | 2 | #209 | 328 | 186 |
| ported-code-notice-route | 4 | 2 | #208 | 1284 | 1183 |
| skp-v0-live-sections-current-area-c | 4 | 1 | #210 | 115 | 41 |
| source-changed-post-route-s5d-race | 4 | 0 | #235 | 225 | 223 |
| verify-quotes-round-item-cites | 4 | 2 | #242 | 416 | 412 |
| walkthrough-row-f7-cli-refusal | 4 | 2 | #244 | None | None |
| crs-undeclared-message-wording | 3 | 1 | #206 | 55 | 47 |
| guardian-parity-git-timeout-under-load | 3 | 1 | #251 | None | None |
| shell-crs-form-for-format-default-contradicted | 3 | 1 | #214 | 186 | 165 |
| connection-reuse-recycled-interrupt-flake | 2 | 0 | #238 | 81 | 77 |
| covering-case-collision-binds-other-column | 2 | 0 | #252 | None | None |
| engine-clause-composition-properties | 2 | 0 | #224 | 176 | 172 |
| export-current-view-after-unreported-fit | 2 | 0 | #219 | 508 | 471 |
| governance-search-ignore-historical | 2 | 0 | #226 | 331 | 313 |
| guardian-v1 | 2 | 1 | #216 | 1957 | 1873 |
| known-limitations-item-2-on-main-paragraph | 2 | 1 | #205 | 8 | 0 |
| publish-approval-ttl-ten-minutes | 2 | 2 | #236 | 101 | 91 |
| publish-approval-unknown-attempt-under-load | 2 | 0 | #227 | 160 | 154 |
| publish-sort-window-cancel-not-exercised-on-ci | 2 | 0 | #250 | 59 | 59 |
| questions-mirror-item-count | 2 | 2 | #245 | 70 | 66 |
| shell-status-bar-one-height | 2 | 0 | #218 | 187 | 166 |
| source-changed-post-reopen-routes-watcher-visible | 2 | 0 | #231 | 426 | 375 |
| stale-assertion-messages-and-product-comments | 2 | 1 | #243 | 34 | 34 |
| stale-test-names-and-comments | 2 | 1 | #220 | 128 | 124 |
| stream-evaluation-failure-fixed-detail | 2 | 2 | #255 | None | None |
| verify-cites-pin-resolution-and-line-zero | 2 | 2 | #247 | 166 | 166 |
| walkthrough-current-view-rows-g1-n5 | 2 | 0 | #239 | 4 | 0 |
| wording-block-rule | 2 | 0 | #211 | 27 | 0 |
| autonomy-section-36-filler-slot | 1 | 0 | #254 | None | None |
| e2e-readme-status-bar-steps | 1 | 0 | #225 | 2 | 0 |
| known-limitations-crs-epoch-edges-third-axis | 1 | 0 | #223 | 4 | 0 |
| known-limitations-current-view-stale-box | 1 | 1 | #215 | 6 | 0 |
| known-limitations-item-23-watcher-idle-end | 1 | 0 | #230 | 24 | 0 |
| known-limitations-item-40-source-comment | 1 | 0 | #221 | 2 | 0 |
| known-limitations-item-41-source-comment | 1 | 0 | #228 | 2 | 0 |
| known-limitations-items-51-52-render-numbers | 1 | 0 | #249 | None | None |
| recorder-retired | 1 | 0 | #213 | 2 | 0 |

## Appendix: one row per non-passing run (`fails.csv`, settled values; the column `check` records each disagreement and how it was settled)

```csv
row,date,node,gate,attempt,verdict,shape,classes,target,same_as_other_gate,code_changed_after,mechanical,origin,one_line,reviewed_commit,next_attempt_row,code_diff_basis,correction_content,words_only,check
472,2026-10-11,crs-undeclared-message-wording,architect,1,FAIL,full,E,sentence,no,no,no,custodian-record,"PR body says T-1's message is raised for files lacking CRS; only crs::admit's (None,None) arm raises it",d88636ef,474,d88636ef..d88636ef (row 474); same commit d88636ef re-gated; fix was PR body only,n.a.,no,agree
475,2026-10-11,shell-map-refill-after-resize,architect,1,FAIL,full,C;E,code-behaviour,partial,yes,no,code,lastQueried has no generation: after filter Apply/Clear a later shrink can query a stale box; suites unrecorded,cf24f9b4,477,"cf24f9b4..9e657db1 (row 477); 3 files changed, 23 insertions(+), 5 deletions(-); non-md/state/docs: layout.mjs WorkingCanvas.test.ts WorkingCanvas.tsx",n.a.,no,agree
476,2026-10-11,shell-map-refill-after-resize,reviewer,1,FAIL,full,C,code-behaviour,partial,yes,no,code,"Same as architect's C1: lastQueriedRef keeps pre-filter box, so a size change can query",cf24f9b4,478,"cf24f9b4..9e657db1 (row 478); 3 files changed, 23 insertions(+), 5 deletions(-); non-md/state/docs: layout.mjs WorkingCanvas.test.ts WorkingCanvas.tsx",n.a.,no,agree
479,2026-10-11,shell-map-refill-after-resize,architect,3,FAIL,scoped,C,sentence,n.a.,no?,no,human,Human-typed item 39 sentence misses a case: refused Apply/Clear on candidate arm clears lastQueried,58967ff4,481,"58967ff4..66cc80de (row 481); 2 files changed, 6 insertions(+), 5 deletions(-); non-md/state/docs: WorkingCanvas.tsx; WorkingCanvas.tsx changed in doc comments only",yes,no,agree
480,2026-10-11,known-limitations-item-2-on-main-paragraph,reviewer,2,FAIL,single,C,sentence,n.a.,no,no,human,Human-typed clause 'asserting the CRS opens it' untrue: refusal opens no CRS form; northing-first refused,ef401e83,482,"ef401e83..d2294623 (row 482); 1 file changed, 1 insertion(+), 1 deletion(-)",yes,no,agree
481,2026-10-11,shell-map-refill-after-resize,architect,4,FAIL,scoped,C,sentence,n.a.,no?,no,human,Human-typed replacement sentences for item 39 fail for a pan within the Apply/Clear mint round trip,66cc80de,487,"66cc80de..edfa187f (row 487); 2 files changed, 6 insertions(+), 5 deletions(-); non-md/state/docs: WorkingCanvas.tsx; next gate on node (row 487); WorkingCanvas.tsx doc comments only",yes,no,agree
483,2026-10-11,ported-code-notice-route,architect,1,FAIL,full,C,sentence,partial,yes,no,worker-record?,Ported README/CONTRIBUTING claim checks the code does not run; portedRoot option has test callers only,c8196576,485,"c8196576..7b58300b (row 485); 4 files changed, 22 insertions(+), 15 deletions(-); non-md/state/docs: checkDistNotice.mjs generateNotice.mjs; generateNotice.mjs code; checkDistNotice.mjs comment only",n.a.,no,agree
484,2026-10-11,ported-code-notice-route,reviewer,1,FAIL,full,C,sentence,partial,yes,no,worker-record?,CONTRIBUTING's packaged-build claim lacks the git-checkout limit; README table claims checks that never run,c8196576,486,"c8196576..7b58300b (row 486); 4 files changed, 22 insertions(+), 15 deletions(-); non-md/state/docs: checkDistNotice.mjs generateNotice.mjs; generateNotice.mjs code; checkDistNotice.mjs comment only",n.a.,no,agree
488,2026-10-11,module-docs-stale-statements,architect,1,FAIL,full,C,sentence,yes,no?,no,form,'The stream path writes nothing' unsupported: DuckDB can spill intermediates to disk (sentence from form),117d8d5c,490,"117d8d5c..1c3b4dbe (row 490); 5 files changed, 18 insertions(+), 10 deletions(-); non-md/state/docs: lib.rs lib.rs; engine/kernel lib.rs //! doc comments only",n.a.,no,agree
489,2026-10-11,module-docs-stale-statements,reviewer,1,FAIL,full,C,sentence,yes,no?,no,form,"Same 'writes nothing' sentence at three sites; DuckDB spills to .tmp, no temp_directory set",117d8d5c,491,"117d8d5c..1c3b4dbe (row 491); 5 files changed, 18 insertions(+), 10 deletions(-); non-md/state/docs: lib.rs lib.rs; engine/kernel lib.rs //! doc comments only",n.a.,no,agree
494,2026-10-11,skp-v0-live-sections-current-area-c,reviewer,2,FAIL,scoped,C,sentence,n.a.,no,no,worker-record?,SKP-V0 describe sentence names two accessor exceptions as if exhaustive; extent also lacks one,20d8546e,495,"20d8546e..7918de41 (row 495); 1 file changed, 4 insertions(+), 4 deletions(-)",yes,no,agree
502,2026-10-12,shell-crs-form-for-format-default-contradicted,reviewer,1,FAIL,full,E,test-or-evidence,no,yes,no?,code,ABSENTCRS' e2e discarded waitForSettle's result and reported settled unconditionally,bc0b0d7a,503,"bc0b0d7a..48868625 (row 503); 2 files changed, 6 insertions(+), 5 deletions(-); non-md/state/docs: regression.mjs; e2e/regression.mjs (test harness) only",n.a.,no,agree
504,2026-10-12,guardian-v1,architect,1,FAIL,full,E,sentence,no,n.a.,no,worker-record,"Guardian README states which local settings file the engine reads for worktrees; unsupported, a may-not-claim",49b6a012,,no re-gate; words applied at 95b542e0 (README only),n.a.,yes,"origin: first worker-record, checker form, adjudicated worker-record"
505,2026-10-12,known-limitations-current-view-stale-box,reviewer,1,FAIL,single,C,sentence,n.a.,n.a.,no,human,Human-approved sentence 'Current view then publishes what the map shows' untrue after a filter Apply,7f80f18e,,no later gate run; D-2 applied at f4d85944 (KNOWN-LIMITATIONS.md only),n.a.,no,"origin: first form?, checker human, adjudicated human"
507,2026-10-12,shell-migration-milestone-2,architect,1,FAIL,full,C;E,code-behaviour,partial,yes,no,code,Mode picker records no class-C row; OPEN-13 files ahead of ruling; section 9 suites not run at head,575cd4b3,509,"575cd4b3..7ffdb6a7 (row 509); 8 files changed, 113 insertions(+), 15 deletions(-); non-md/state/docs: selection.mjs App.selection.test.tsx App.tsx AdmissionPanel.tsx surfaceRegistry.ts",n.a.,no,"origin: first code, checker form?, adjudicated code"
508,2026-10-12,shell-migration-milestone-2,reviewer,1,FAIL,full,C;E,code-behaviour,partial,yes,no,code,'Cancel the export and go on' misses an execute started after the ask appeared; base e2e not run,575cd4b3,510,"575cd4b3..7ffdb6a7 (row 510); 8 files changed, 113 insertions(+), 15 deletions(-); non-md/state/docs: selection.mjs App.selection.test.tsx App.tsx AdmissionPanel.tsx surfaceRegistry.ts",n.a.,no,agree
509,2026-10-12,shell-migration-milestone-2,architect,2,FAIL,scoped,E,test-or-evidence,no,yes,yes?,custodian-record?,source-changed post route suite never run in phase B; run during the gate and passed,7ffdb6a7,511,"7ffdb6a7..f64418bc (row 511); 4 files changed, 34 insertions(+), 3 deletions(-); non-md/state/docs: App.selection.test.tsx App.tsx AdmissionPanel.tsx; code changes were for the reviewer's C1-R",no (leftover),no,agree
510,2026-10-12,shell-migration-milestone-2,reviewer,2,FAIL,scoped,C,code-behaviour,no,yes,no,code,Execute reported after the ask and ended before the choice is in neither set: no statement,7ffdb6a7,512,"7ffdb6a7..f64418bc (row 512); 4 files changed, 34 insertions(+), 3 deletions(-); non-md/state/docs: App.selection.test.tsx App.tsx AdmissionPanel.tsx",no (missed sibling),no,agree
512,2026-10-12,shell-migration-milestone-2,reviewer,3,FAIL,scoped,C,code-behaviour,no,yes,no,code,Two executes ending under one ask get one statement; architect saw the same gap and passed,f64418bc,514,"f64418bc..d59f1a6a (row 514); 9 files changed, 219 insertions(+), 37 deletions(-); non-md/state/docs: selection.mjs App.selection.test.tsx App.tsx WorkingCanvas.tsx WorkingCanvas.wiring.test.tsx clickPick.test.ts clickPick.ts",no (missed sibling),no,agree
515,2026-10-14,stale-test-names-and-comments,architect,1,FAIL,full,C,sentence,no,no?,no,form,"Form-drafted test comment overclaims: App.lateResult stand-in records props by dataset, not mounts",f73eb803,518,"f73eb803..ec6de56f (row 518); 4 files changed, 10 insertions(+), 6 deletions(-); non-md/state/docs: identity.rs App.test.ts lib.rs; next gate on node (row 518); comments only",n.a.,yes,agree
522,2026-10-16,b2-piece-1b-recording,architect,1,FAIL,full,C,code-behaviour,partial,yes,no,code,Writer writes lines its own reader refuses; failed creation leaves folder; no-op Reset logs nothing,3dfc1a0e,524,"3dfc1a0e..d2501969 (row 524); 21 files changed, 304 insertions(+), 89 deletions(-); non-md/state/docs: console.mjs recording.mjs commands.rs App.recording.test.tsx App.tsx surfaceCompleteness.test.ts surfaceRegistry.ts StylePanel.tsx stepRecorder.test.ts stepRecorder.ts lib.rs session_history.rs no_generation_in_persisted_artifacts.rs record_step_crs.rs session_history.rs error.rs",n.a.,no,agree
523,2026-10-16,b2-piece-1b-recording,reviewer,1,FAIL,full,C,sentence,partial,yes,no,form,SKP-V0 says a refusal at (1)-(8) writes nothing; failed record creation leaves what it wrote,3dfc1a0e,525,"3dfc1a0e..d2501969 (row 525); 21 files changed, 304 insertions(+), 89 deletions(-); non-md/state/docs: console.mjs recording.mjs commands.rs App.recording.test.tsx App.tsx surfaceCompleteness.test.ts surfaceRegistry.ts StylePanel.tsx stepRecorder.test.ts stepRecorder.ts lib.rs session_history.rs no_generation_in_persisted_artifacts.rs record_step_crs.rs session_history.rs error.rs",n.a.,no,agree
524,2026-10-16,b2-piece-1b-recording,architect,2,FAIL,scoped,C,sentence,partial,yes,no,worker-record,"SKP-V0 Bounds: 4,096-byte refusal claim untrue; header's CRS definition is read up to 65,536",d2501969,526,"d2501969..3e63a839 (row 526); 6 files changed, 126 insertions(+), 20 deletions(-); non-md/state/docs: console.mjs session_history.rs session_history.rs",yes,no,agree
525,2026-10-16,b2-piece-1b-recording,reviewer,2,FAIL,scoped,E;C,test-or-evidence,partial,yes,no,code?,Failed-creation cleanup reachable via a deny-write ACE seam; comment and PR body said no test could,d2501969,527,"d2501969..3e63a839 (row 527); 6 files changed, 126 insertions(+), 20 deletions(-); non-md/state/docs: console.mjs session_history.rs session_history.rs",yes,no,agree
538,2026-10-17,governance-cut-state-cap-and-rotation,architect,1,FAIL,full,C;E,code-behaviour?,partial,yes,no,code,--root option has test callers only (caller rule); no test rotates a real-shape ledger,c8b78e90,541,"c8b78e90..620acf4f (row 541); 4 files changed, 35 insertions(+), 17 deletions(-); non-md/state/docs: flush.mjs rotate-cut-state.mjs rotate-cut-state.test.mjs",n.a.,no,"mechanical: first yes?, checker no?, adjudicated no"
539,2026-10-17,governance-cut-state-cap-and-rotation,reviewer,1,FAIL,full,C,code-behaviour?,partial,yes,no,code,"--root CLI option used only by tests (caller rule), as the architect's C-1",c8b78e90,540,"c8b78e90..620acf4f (row 540); 4 files changed, 35 insertions(+), 17 deletions(-); non-md/state/docs: flush.mjs rotate-cut-state.mjs rotate-cut-state.test.mjs",n.a.,no,"mechanical: first yes?, checker no?, adjudicated no"
540,2026-10-17,governance-cut-state-cap-and-rotation,reviewer,2,VOID,scoped,none,other,n.a.,no,n.a.,n.a.,"VOID: report claimed tests, mutations and checks its transcript (one Read, one Bash) never ran",620acf4f,542,620acf4f..620acf4f (row 542); same commit re-run as attempt 3,n.a.,no,"mechanical: first n.a., checker no?, adjudicated n.a."
541,2026-10-17,governance-cut-state-cap-and-rotation,architect,2,FAIL,scoped,C,test-or-evidence,yes,yes,no,code,R8 (gate 1's E-1 remedy) asserts the live ledger's pre-rotation shape; own rotation turns main red,620acf4f,543,"620acf4f..5201bc0b (row 543); 1 file changed, 13 insertions(+), 5 deletions(-); non-md/state/docs: rotate-cut-state.test.mjs; test file only",yes,no,agree
542,2026-10-17,governance-cut-state-cap-and-rotation,reviewer,3,FAIL,scoped,C,test-or-evidence,yes,yes,no,code,"Same as architect's C-2, probed: R8 lines 216/221 hold only before the first rotation",620acf4f,544,"620acf4f..5201bc0b (row 544); 1 file changed, 13 insertions(+), 5 deletions(-); non-md/state/docs: rotate-cut-state.test.mjs; test file only",yes,no,agree
549,2026-10-19,shell-migration-milestone-3,architect,1,FAIL,full,C;E,code-behaviour,partial,yes,no,code,"Tab never completes with list closed, against human's OPEN-1 ruling; bar note misleads; E-SEARCH-b unrun",7e4ea32a,551,"7e4ea32a..621cd1f3 (row 551); 9 files changed, 64 insertions(+), 28 deletions(-); non-md/state/docs: command-bar.mjs App.command.test.tsx CommandBar.tsx commandDraft.test.ts commandDraft.ts StudioLayout.tsx actionRegistry.test.ts styles.css",n.a.,no,agree
550,2026-10-19,shell-migration-milestone-3,reviewer,1,FAIL,full,C;E,code-behaviour,partial,yes,no,code,Bar command closing a region returns focus inside it (leaveBar before toggle); E-SEARCH-b unrun,7e4ea32a,552,"7e4ea32a..621cd1f3 (row 552); 9 files changed, 64 insertions(+), 28 deletions(-); non-md/state/docs: command-bar.mjs App.command.test.tsx CommandBar.tsx commandDraft.test.ts commandDraft.ts StudioLayout.tsx actionRegistry.test.ts styles.css",n.a.,no,agree
551,2026-10-19,shell-migration-milestone-3,architect,2,FAIL,scoped,C;E,code-behaviour,partial,yes,no,code,Round-1 fix leaves focus on hidden splitter and regresses reopen; assertion never observed failing,621cd1f3,553,"621cd1f3..2fa7c8d0 (row 553); 5 files changed, 40 insertions(+), 8 deletions(-); non-md/state/docs: command-bar.mjs App.command.test.tsx CommandBar.tsx StudioLayout.tsx",yes,no,agree
552,2026-10-19,shell-migration-milestone-3,reviewer,2,FAIL,scoped,C,code-behaviour,partial,yes,no,code,"Same splitter focus and reopen regression, both probed failing at the head",621cd1f3,554,"621cd1f3..2fa7c8d0 (row 554); 5 files changed, 40 insertions(+), 8 deletions(-); non-md/state/docs: command-bar.mjs App.command.test.tsx CommandBar.tsx StudioLayout.tsx",yes,no,agree
557,2026-10-20,governance-decisions-pending-open-and-archive,reviewer,1,FAIL,full,E,test-or-evidence,no,yes,no,code,"R11's hash-reference assertion vacuous: with MT4 applied R11 still passes; architect saw it, passed",6b8b3688,559,"6b8b3688..e174f367 (row 559); 11 files changed, 29 insertions(+), 22 deletions(-); non-md/state/docs: rotate-decisions-pending.test.mjs; test file only (+ state drafts)",n.a.,no,agree
563,2026-10-20,publish-approval-ttl-ten-minutes,architect,1,FAIL,full,C,sentence,yes,n.a.,no,form?,grant.rs doc comment still states a 120 s-class lifetime after TTL became ten minutes; file outside Scope,5e922915,,no later gate run,n.a.,yes,"mechanical: first yes?, checker no, adjudicated no"
565,2026-10-20,publish-approval-ttl-ten-minutes,reviewer,1,FAIL,full,C,sentence,yes,n.a.,no,form?,Same stale 120 s-class lifetime comment in grant.rs (plus a PublishDialog.tsx comment),5e922915,,no later gate run,n.a.,yes,"mechanical: first yes?, checker no, adjudicated no"
567,2026-10-21,governance-plan-summaries-archive,architect,1,FAIL,full,C,test-or-evidence,yes,yes,no,code,"R15 fails at S10 and on main (temp repo holds pointers, no archive); post-staging failure prints refusal",2d60ac16,570,"2d60ac16..510f4bac (row 570); 3 files changed, 28 insertions(+), 18 deletions(-); non-md/state/docs: rotate-plan-summaries.mjs rotate-plan-summaries.test.mjs",n.a.,no,agree
568,2026-10-21,governance-plan-summaries-archive,reviewer,1,FAIL,full,C,test-or-evidence,yes,yes,no,code,C1 reproduced (R15 exits 1 on the script's own move); C2 confirmed,2d60ac16,571,"2d60ac16..510f4bac (row 571); 3 files changed, 28 insertions(+), 18 deletions(-); non-md/state/docs: rotate-plan-summaries.mjs rotate-plan-summaries.test.mjs",n.a.,no,agree
576,2026-10-21,adr-036-pre-acceptance-block,architect,1,FAIL,full,C,sentence,no,no,no,form,"ADR-036 A4 clause says containment keeps a path inside the folder, beyond human's B1; form's 2.4 missed it",70edd381,578,"70edd381..d0c257d9 (row 578); 1 file changed, 1 insertion(+), 1 deletion(-)",n.a.,no,agree
581,2026-10-22,bundle-redaction-scan-not-in-product-publish,architect,1,FAIL,full,C,code-behaviour,partial,unknown,no,code,"Build record's bare hex never equals kernel's sha256:-prefixed digest, so the skip never fires",6a10ee24,583,6a10ee24..95edf33b (row 583); commits 6a10ee24 and 95edf33b absent from shallow clone,n.a.,no,agree
582,2026-10-22,bundle-redaction-scan-not-in-product-publish,reviewer,1,FAIL,full,C;E,code-behaviour,partial,unknown,no,code,"Architect's C1-C3 confirmed, C1 reproduced by probe; E-1 R1/R2 to run after the fix",6a10ee24,584,6a10ee24..95edf33b (row 584); commits 6a10ee24 and 95edf33b absent from shallow clone,n.a.,no,agree
585,2026-10-22,verify-quotes-round-item-cites,architect,1,FAIL,full,C,sentence,no,yes,no,worker-record?,Docs claim every round-item cite is read; wrapped cites and space-indented > lines are not,b08a1fec,589,"b08a1fec..91ccdab4 (row 589); 4 files changed, 53 insertions(+), 13 deletions(-); non-md/state/docs: governance-ci.yml verify-quotes.mjs verify-test-claims.test.mjs; code changes were for the reviewer's E-1",n.a.,no,agree
586,2026-10-22,verify-quotes-round-item-cites,reviewer,1,FAIL,full,E,test-or-evidence,no,yes,no?,code,"withdrawnRiders' round-file reader untested: binding dropped from both calls, 81 of 81 still pass",b08a1fec,590,"b08a1fec..91ccdab4 (row 590); 4 files changed, 53 insertions(+), 13 deletions(-); non-md/state/docs: governance-ci.yml verify-quotes.mjs verify-test-claims.test.mjs",n.a.,no,agree
588,2026-10-22,stale-assertion-messages-and-product-comments,reviewer,1,FAIL,full,E,other,no,n.a.,yes,n.a.,"One Governance CI job red on GitHub API 503s; failed job re-run green, nothing left blocking",b24e5281,,no code change; CI job re-run,n.a.,no,"target: first other, checker test-or-evidence?, adjudicated other"
593,2026-10-23,walkthrough-row-f7-cli-refusal,architect,2,FAIL,scoped,C,sentence,yes,n.a.,no,form?,Human-approved OPEN-4 parenthetical claims a refusal at Part G's publish the Windows dev tree never reaches,abc900f2,,no later gate run,yes,no,agree
594,2026-10-23,walkthrough-row-f7-cli-refusal,reviewer,2,FAIL,scoped,C,sentence,yes,n.a.,no,form?,"Same OPEN-4 parenthetical, with different replacement words",abc900f2,,no later gate run,yes,no,agree
595,2026-10-23,questions-mirror-item-count,architect,1,FAIL,full,C,sentence,yes,n.a.,no,worker-record,Doc comment's two limits state outcomes the code never produces; red-line claim in form and PR body,0f93c122,,no later gate run,n.a.,yes,agree
596,2026-10-23,questions-mirror-item-count,reviewer,1,FAIL,full,C,sentence,yes,n.a.,no,worker-record,Same doc comment limits; PR body's and form's red-line claim states more than the pattern gives,0f93c122,,no later gate run,n.a.,yes,agree
599,2026-10-23,verify-cites-pin-resolution-and-line-zero,architect,1,FAIL,full,C,sentence,partial,n.a.,no,form,Header sentence (architect's own form 2.3 drafting) claims a pin-reading limit the code lacks,7a23dbad,,no later gate run,n.a.,yes,agree
600,2026-10-23,verify-cites-pin-resolution-and-line-zero,reviewer,1,FAIL,full,C,sentence,partial,n.a.,no,form,Header's pin limit shown untrue by probes; line-0 sentence too broad; same limit in form,7a23dbad,,no later gate run,n.a.,yes,agree
601,2026-10-23,flush-crlf-field-rewrite,architect,1,FAIL,full,E;C,test-or-evidence,partial,yes,no,code?,"T2 asserts only the extractor, not parseSessionContinuity, though form claims both readers; contract overclaims",197d81ea,604,"197d81ea..9beca99e (row 604); 2 files changed, 7 insertions(+), 2 deletions(-); non-md/state/docs: flush.mjs flush.test.mjs; flush.mjs comment + flush.test.mjs assertions",n.a.,no,agree
602,2026-10-23,flush-crlf-field-rewrite,reviewer,1,FAIL,full,C,sentence,partial,yes,no,form?,Contract comment says no byte outside rewritten values changes; probe: a tab after colon becomes space,197d81ea,605,"197d81ea..9beca99e (row 605); 2 files changed, 7 insertions(+), 2 deletions(-); non-md/state/docs: flush.mjs flush.test.mjs; flush.mjs comment + flush.test.mjs assertions",n.a.,no,agree
609,2026-10-24,guardian-parity-git-timeout-under-load,architect,1,FAIL,full,E,test-or-evidence,no,unknown,yes?,custodian-record,Section 1's three recorded mutations not re-observed; the custodian's brief named the wrong three,7235aa0c,611,7235aa0c..7780de9b (row 611); commits 7235aa0c and 7780de9b absent from shallow clone,n.a.,no,agree
615,2026-10-24,stream-evaluation-failure-fixed-detail,architect,1,FAIL,full,E,sentence,partial?,n.a.,no,worker-record,stream.rs doc comments claim the class is withheld everywhere; fetch-panic payload never observed (W1),27924bbe,,no later gate run,n.a.,yes,agree
616,2026-10-24,stream-evaluation-failure-fixed-detail,reviewer,1,FAIL,full,C;E,code-behaviour,partial?,n.a.,no,code,"At the fetch site duckdb wraps panics as 'Failed to fetch...', so label check never matches",27924bbe,,no later gate run,n.a.,no,agree
617,2026-10-24,b1-shell-half,architect,1,FAIL,full,C;E,sentence,yes,n.a.,no,code,Table's 'file changed' ended line also shown for coverage-lost; PC-U4 stand-in typed by its own shape,ec95eacb,,no later gate run,n.a.,no,agree
618,2026-10-24,b1-shell-half,reviewer,1,FAIL,full,C;E,sentence,yes,n.a.,no,code,Same ended line (probed with coverage-lost terminal) and same imagined-interface stand-in,ec95eacb,,no later gate run,n.a.,no,agree
```
