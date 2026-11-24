# Milestone 5 PR A: the C-1 fix and the guard observations of ADV-2026-11-24-03 item 2, the worker report

*Filed by the custodian from the worker's hand-back, as claims, not evidence. Dispatched at 2026-11-24T02:19:45Z; its run: Bash 43, Read 8, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-24T02:19:48Z to 2026-11-24T02:47:20Z by its transcript; 1 call named the main checkout (a Read of its own agent definition there, which change nothing); handed back at 2026-11-24T02:47:20Z. 8741 bytes, sha256 e67bc3e31d5d1ab6bb712172a1138996c096570118e5f0e93d93880b657867c9, byte for byte, nothing masked, with one final newline added.*

---

REPORT, node:shell-migration-milestone-5@pr-a-c1-fix-1. C-1 is fixed, red then green, and everything is pushed. THREE both-stops removals did NOT fail (X-2, G-1, G-2), which is a stop under ADV-2026-11-24-03 item 2; they come to you.

HEAD before: 12a9aa9853b25f88deb79c6cc8af1843537f1d37 (branch, HEAD and clean status checked first).
Commits, all `git commit -s`:
- 18697749c18d756213c1edd278d0199b38d03eb8: the red test, C-A7.
- 7c18e29fbbb90dc91eb9ff0869f17d70375c6b8e: the fix, F.
- 7c816dd4e61b426f9fcdc4e48b0c3c0c87189795: comments only; the head.
Push: `12a9aa98..7c816dd4  cut/shell-migration-milestone-5-pr-a`. `git status --porcelain` is empty.

**Red and green**
- The test is C-A7 in App.conditions.test.tsx. It is the last case of the first describe.
  - It opens, makes a refused style drag with message FIRST, then a second drag to 0.55 with message SECOND, both through App's step queue.
  - It asserts both steps were sent, one `.record-notice`, no `.condition-occurrences`, no S-5 text, and the notice text equals SECOND's.
  - It changes the file's import line to add `raisedTimesText`. Nothing else in the file changed.
- Red at 12a9aa98's product code: D:/wt-data/m5a/c1-red.log, exit 1. The failing assertion is "its owner replaced it: no occurrence count: expected [ <div …(1)></div> ] to have a length of +0 but got 1". The 11 other tests passed. This is the reviewer's reason.
- Green after the fix: D:/wt-data/m5a/c1-green.log, exit 0. It ran App.conditions.test.tsx and conditions.test.ts together: 27 passed.
- The fix swaps one dispatch in App.tsx's createStepQueue report handler: `raise` becomes `replaceBatch` with route, code, target, generation `report.dataset`, and `displays: [{kind:"text", text}]`. Nothing else in product code changed.
- `npm run verify` in frontends/shell, inside a shared hold, exit 0. Log: D:/wt-data/m5a/verify.log. 132 files and 1667 tests passed, and all the sub-scripts passed. The hold's `also=` value is `<m>`.

**Step 3, observations at F (7c18e29f)**
One node script did each: D:/wt-data/m5a/obs.mjs. It checked each anchor occurs once, edited, ran the whole vitest file, ran `git checkout --`, and compared sha256 with F's blob. Every restore matched, and the status was empty each time. Logs: D:/wt-data/m5a/obs-<id>.log.
- **M-C1.** App.tsx: the replaceBatch dispatch swapped back to the original `raise`.
  - Ran App.conditions.test.tsx: exit 1, one failure.
  - C-A7 failed: "its owner replaced it: no occurrence count: expected [ <div …(1)></div> ] to have a length of +0 but got 1".
- **X-1 guard alone.** I removed the resolved-arm `if (forDataset !== admittedDatasetRef.current) return;` in `reportViewportOutcome`. It sits before the "P3b, P3a architect note 6" comment, at App.tsx:1635.
  - Ran the whole App.lateResult.test.tsx. **NOT FAILED**: exit 0, 22 passed.
- **X-2 guard alone.** I removed the rejected-arm guard before the "The pre-check route raises" comment, at App.tsx:1652.
  - **NOT FAILED**: exit 0, 22 passed.
- **X-1 both stops.** I removed the guard and the `c.generation === event.generation && ` clause in `ownerClear`'s filter. That clause is the store line that plays the part for a clear; it is conditions.ts:183 at F, in `case "ownerClear"`.
  - **FAILED**, exit 1, 4 tests failed, all with "AssertionError: expected undefined to be 'engine.no_covering_bbox' // Object.is equality":
    - "a late old-generation SUCCESS after a reopen does not clear the new generation's standing viewport refusal" (the first)
    - "the human's full ended -> reopen -> old SUCCESS sequence ... (baseline arm)"
    - "a late old-generation SUCCESS from the candidate arm's own reissueUnrestricted ..."
    - "the human's full ended -> reopen -> old SUCCESS sequence ... (candidate arm)"
- **X-2 both stops.** I removed the rejected-arm guard and `if (event.generation !== state.current) return state;`, the first line of `raise`, conditions.ts:140 at F.
  - **NOT FAILED**: exit 0, 22 passed.
- **G-1 both stops.** I removed the `onFailureTerminal` guard (App.tsx:1931) and conditions.ts:140. **NOT FAILED**: exit 0, 22 passed.
- **G-2 both stops.** I removed the `onCanvasRefusal` guard (App.tsx:2469) and conditions.ts:140. **NOT FAILED**: exit 0, 22 passed.
- **Why the three raise cases pass.** I read this in conditions.ts and did not test it apart. With line 140 gone, A's late raise is stored under generation A. `visibleFor` (conditions.ts:208-213) shows only conditions whose `generation === context.resource`, so B's view shows nothing. `visibleFor` is a third stop that no recorded mutation removes. I made no run that removes all three, because it is not in the brief.
- The test does not show that A's late raise cannot reach B's store, only that B's screen does not show it. I wrote no comment line for X-2, G-1 and G-2 both-stops. Whether to strengthen these tests is yours.
- **Which test pins conditions.ts:140 alone (ADV-2026-11-24-03 item 2).** I did not run a mutation of that line alone, and none of the 8 observations did. The nearest recorded mutation is C-U6a in conditions.test.ts ("delete the generation drop"), recorded at a17db128 and not re-run by me. C-U7b records the same drop moved after the cap check. Say whether you want a run.
- **C-U1's recorded mutation.** I gave the stream-terminal route `replaced-by-owner` in the routes table, then ran the whole conditions.test.ts: exit 1, 2 failed.
  - C-U1: "AssertionError: expected [ [ 'session-ended', …(4) ], …(6) ] to deeply equal [ [ 'session-ended', …(4) ], …(6) ]".
  - C-U6: "AssertionError: stream-terminal declares no replacement: the batch is refused whole: expected [ { id: 'condition-3', …(9) }, …(2) ] to have a length of 4 but got 3".
  - C-U3 did not fail.
  - So C-U1's New was written: "Also fails C-U6 (a stream-terminal batch is then accepted, not refused whole)."

**Step 4, comments only (commit 7c816dd4)**
- C-A7 now carries a RECORDED MUTATION line naming its full title, then `OBSERVED 2026-11-24 at 7c18e29f: FAILED -- <the assertion above>. Reverted after observing.`
- X-1 has two dated lines beside its 2026-09-23 line: guard alone NOT FAILED, and both stops FAILED, with the test and assertion.
- X-2 has one dated line: guard alone NOT FAILED.
- G-1, G-2 and X-2 have no both-stops line, per the stop clause.
- The :659 comment now reads `N8 residual correction, its first round's item 7 probe:` (the old text occurred once; the line is now 93 columns).
- D-2:
  - The four blocks were taken from <S>/report-m5a-rev-1.md after checking it is 15173 bytes with sha256 6e79b72f…8d35368 (full hash as given in the brief). C-U7b's and C-U1's replacements are both applied.
  - The check "New must not occur" could not be taken literally for C-U7b: its New is a substring of its own Old. I read it as: New must not occur in the file once the Old occurrence is removed. It does not.
- The three test files then ran together: 49 passed. `tsc --noEmit` exited 0.
- The new comment lines use 8-hex F; the file's older lines use full 40-hex hashes.
- I named the `ownerClear` clause by its words in the comment, not by a conditions.ts line number, so the cite checker will not read it as a cite.

**Step 5, at the head 7c816dd4, all exit 0**
- `verify-mutation.mjs --base 6bc40126 --head HEAD`: PASS, all 42 new tests have a recorded mutation naming them.
- `verify.mjs`: PASS.
- `verify-cites.mjs`: PASS. It lists 237 loose references as advisory, none in files I changed.
- `verify-quotes.mjs`: PASS, 159 checked, 128 verified, 30 baselined. With `--show-cites` over the three test files: PASS, 0 errors.
- `verify-test-claims.mjs`: PASS, 901 claimed tests.
- `node --test` over plan, hooks and evidence: 623 pass, 0 fail.
- Numstat 12a9aa98..HEAD: App.conditions.test.tsx +29/-1, App.lateResult.test.tsx +4/-1, App.tsx +2/-3, conditions.test.ts +2/-2.
- The lock diff `6bc40126...HEAD` over package-lock.json and Cargo.lock printed nothing.

**Otherwise and off-scope**
- On the stop: I read it as covering only those three observations. So I still did step 4 for the lines that exist, ran step 5 and pushed, and did not halt. If you meant a full halt before the push, the three commits are already on origin.
- App.conditions.test.tsx is now 563 lines, against the 480 ceiling noted at class 8.
- I ran step 5's script checks outside a hold. They are single-process and finished in about 10 minutes. Only `npm run verify` ran in a hold.
- The main checkout and the scratchpad were not touched. Logs and scripts are in D:/wt-data/m5a. Disk: C: had 43,867 MB free at the heavy step.
- Every run ended before 02:50Z, well before 04:30Z.

Model: Sonnet 5.5 (claude-sonnet-5-5), no model override, no context handoff received or produced.
