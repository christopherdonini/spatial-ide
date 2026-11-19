Reviewed: PR #335 at e374eb711caaeae4dd898e8ddb49a35d4d80c619, gate, reviewer (cut/open-first-look-fills-fit-view @ e374eb711caaeae4dd898e8ddb49a35d4d80c619)
Verdict: FAIL

The verdict fails on one Correctness finding, C1. The form makes it Correctness by name: Amendment 4 item 6's last sentence reads "A gate that finds the property weakened reports it as a Correctness finding." C1 goes to the advisor. All other findings are Documentation, to be fixed before the merge.

Paths are written `<S>` (the session scratchpad), `<W>` = C:/dev/wt/fl, `<R>` = C:/dev/wt/fl-rv, `<H>` = `<S>`/fl-e2e-h, `<M>` = the machine script and `<u>` = the app's per-user folder. B = 349cec82e5ecbfab40db3ae9b6811d471d9ea2de, F = e1fd84957b7ae042a075e7ccc5628a3de5670eb7 and H = e374eb711caaeae4dd898e8ddb49a35d4d80c619. Branch files are cited as `<path>:<line> at H`. Paraphrase is marked "(mine)".

## Correctness

**C1. E-AND's new reading after card B does not keep "one row per commit". It accepts a commit that records card A's step a second time before its own row (Amendment 4 item 6).**
- Where: `frontends/shell/e2e/command-bar.mjs:375 at H` (`waitCommitted`) and `:429-444 at H` (`stepAnd`).
- What changed (mine): after card B the check takes the last n = min(rows, 2) rows and compares their keys with `[A, AB]`. If B's commit adds two rows (A again, then AB), the rows end `…, A, A, AB`. Their last two keys are `[A, AB]`, so the check passes. At F the check `r.length === rowsBefore + 1` would have rejected those two rows.
- Observed by my own mutation M-X2 (not one of Amendment 4's), run in the real app at H. It was applied by one anchored `node -e`, which adds one line before the `App.tsx:1060` step:
  `+      if (dataset !== null && filter !== null && filter.predicate.startsWith("(") && filter.predicate.includes(") AND (")) stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter: { ...filter, predicate: filter.predicate.slice(1, filter.predicate.indexOf(") AND (")) } } }); // gflr M-X2: the previous card s step re-sent before its own`
  - Run `gflr-mx2-command-bar`: rc 0, 14 PASS and 0 FAIL. Byte-copied: `[E-AND] PASS (25377ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, one more record_step row reached ok; B off: 4.4%, Applied A's text`.
  - Reverted with `git -C <W> checkout -- frontends/shell/src/App.tsx`, rc 0, porcelain empty.
  - Limit of this evidence: I did not read the two extra rows from the console. They follow from the diff. The queue does not coalesce steps (`frontends/shell/src/workspace/stepRecorder.ts:69-76 at H`). The combined predicate begins `("zone" = 'residential') AND (`, as the M-A4-3 failure line below shows, so the added line sends `"zone" = 'residential'`, which is card A's key.
- Three things become untrue with C1. Per the brief they go to the advisor, and I do not reword them:
  - `frontends/shell/e2e/README.md:802 at H`, E-AND: "adds exactly one `record_step` row that reaches `ok` and carries that text".
  - The PASS text at `frontends/shell/e2e/command-bar.mjs:451 at H`: "one more record_step row reached ok".
  - The worker report's sentence that these entries "are still true after the edit".
- `project.mjs` `waitRecorded` has the same tail-length gap at its second step: `[A, A, AC]` passes. This is not a weakening against F, because F's project reading counted "at least". The README CLAUSES and STYLE entries (`README.md:844 at H`) stay true.
- Fix proposal (mine, not run). It keeps the ring-safe tail and restores one row per commit.
  - After A's wait: `const beforeA = settledRows.last.length > 1 ? stepKey(settledRows.last.at(-2).request) : null;`
  - Before B's wait: `if (beforeA !== null) committed.unshift(beforeA);` and then the existing `committed.push(...)`.
  - Unmutated, the rows `[P, A, AB]` pass. If the ring has dropped P, `[A, AB]` passes with n = 2. Under M-X2, `[A, A, AB]` fails unless P equals A. M-A4-1 and M-A4-3 still fail.

## Evidence

None blocking.
- Amendment 4 item 6, condition 1 (the failed prediction is recorded as failed): met by item 5.
- Condition 2 (the new reading is declared before its code): met. The property is kept for `project.mjs`, where the new reading is stronger than F's "at least". It is not kept for E-AND (C1).
- Condition 3 (each of item 7's mutations is seen to fail): met. I re-ran all three at H (check 8). M-A4-1 fails E-AND at the wait after A, not after B as item 7 predicted. The Amendment 4 worker report already records this. The reading is stricter than predicted.

## Documentation (must fix before the merge; none of these sentences is the human's wording, so the worker applies the words and the PR body lists them, with no re-gate)

**D1. `frontends/shell/src/residency/candidateArmSession.ts:61-66 at H` is untrue (ADV-2026-11-19-01 item 3 (b)).**
- The sentence says the frame is set up at the first batch with geometry, "exactly once, ever". The frame is in fact set up at the untiled sink's terminal (`:1425-1426 at H`; the function's own comment is at `:1142-1145 at H`). After a reissue, `establishFrameFromExtent` can call `manager.establishGridFrame` again, and the manager returns at once (`tileViewportStreamManager.ts:468-470 at H`). The fix is class 9 in this PR, per §10.4.
- Replace from "The FIRST batch" to "for this session." with:
  "The FIRST batch that carries any geometry gives `pushTileBatch` a non-null `fitAnchor` (`WorkingCanvas.tsx`'s own `fitAnchorRef`, shared with the baseline arm's identical one-shot auto-fit) and fits the camera to it once -- exactly mirroring baseline's own auto-fit timing (`pushBatch`'s `!hasAutoFitRef.current && residentExtentRef.current` check). The grid frame waits for the look to end: the untiled sink's `onTerminal` (`issueUntiledQuery`, below) calls `establishFrameFromExtent` on the union of every batch the look delivered (`latestUnionedExtent`), and `manager.establishGridFrame` fixes the frame once for the session (it returns at once when a frame exists)."
- Clause check:
  - The first batch with geometry sets the fit anchor and fits once: `WorkingCanvas.tsx:1798-1803 at H`.
  - The frame is set at the terminal: `candidateArmSession.ts:1425-1426 at H`.
  - The union is fed by every batch: `:1146 at H`.
  - The frame is fixed once: `tileViewportStreamManager.ts:469 at H`.

**D2. `candidateArmSession.ts:84-85 at H`: "With no input, that box is the look's own auto-fit" is untrue for a reissued look that admits no rows.**
- In that case the frame survives, no auto-fit runs, and the block plans the camera left standing. Ordinary use reaches it: an Apply whose filter matches nothing.
- Replace with: "With no input, that box is the look's own auto-fit when the look admitted geometry, and otherwise the view left standing; either way the view's tiles are planned without a pan."
- Clause check:
  - The auto-fit needs a resident extent: `WorkingCanvas.tsx:1801 at H`.
  - The block's terms do not depend on the row count: `candidateArmSession.ts:1490-1505 at H`.
  - It needs only `manager.gridFrame !== null`, which a reissue leaves set: `:1501 at H`.

**D3. The block's not-covered note (`candidateArmSession.ts:1487-1489 at H`) omits what the probe in check 7 shows.**
- This window needs timing inside one request round trip, so it does not block. It belongs in the source comment.
- Replace the three lines with:
  "// Not covered (AUTONOMY §31), the same window as S1's: an earlier look's Completed terminal that
  // arrives after a reissue but before the new look's ticket is minted is read as current, and can
  // plan the pre-fit view under the new filter (`untiled-reissue-holds-earlier-look-handle-until-mint`).
  // That plan sets `hasPlanned`, so the new look's own terminal plans nothing: its fit view is asked
  // for at the next camera change, and until then the status S1 recomputes there can read settled
  // for the pre-fit view's cells."
- Clause check against the probe's output:
  - The pre-fit box was planned under f2: lines A.
  - `hasPlanned` is set: `:1557 at H`.
  - No plan ran at the new terminal: C, planned lines `[]`, apply `[]`.
  - The fit view was planned at the next camera change: D, apply `[["4:4"]]`.
  - The status read settled: C, "Showing all 7 features in view".

**D4. `frontends/shell/e2e/command-bar.mjs:39-40 at H`: E-AND-b's expected failure text no longer exists at H.** The worker report flagged this as off-scope, but the file is in Scope.
- Replace line 40 with:
  "//             Expected: step E-AND fails at its first record_step wait, `E-AND: the newest record_step rows did not end with card A's step at ok before card B (...)`: card A is a card change, which this mutation no longer records."
- Clause check (by reading, not run):
  - The message is the one at `:434 at H`.
  - Cards commit with `filter.clauses.set` (`App.tsx:2084 at H`), so the mutated condition is false for card A.
  - The Clear before A still records `filter.apply` (`FilterPanel.tsx:70-72 at H`), so the rows do not end with A.

**D5. The §4 row for M-U2g says "(g) fails, with two status emits". The second half was never observed (ADV-2026-11-19-01 item 3 (a)).**
- No declared mutation reaches U-FL2 (g)'s status assertion at `candidateArmSession.test.ts:3984 at H`. M-U2g stops at 3983.
- My own mutation M-X, which drops S1's `emitResidencyStatus()` (`:1470 at H`), does fail at 3984. So that assertion catches a real fault.
- The form is not edited. The closing amendment cites the S5-S6 report's M-U2g finding and this report by reference, and claims no observation of the two emits.

## Observation

- **K7 (ADV-2026-11-19-06 item 7): no, by reading.**
  - K7 starts with Zoom to layer (`regression.mjs:1779 at H`). That makes a plan, so term (iv) excludes the block for all of K7.
  - The zoom-out settles reach the status through `handleViewportChange` and the tile terminals. Neither changed from B to H: the product diff in `candidateArmSession.ts` is the doc paragraph and the block only.
  - No reissue happens during K7: the only callers of `reissueUnrestricted` are `App.tsx:1725` and `:1758 at H`.
  - No Correctness finding; no run made.
- **Item 67 (`KNOWN-LIMITATIONS.md:525-527 at H`).** Every clause is true by the symbols its comment names. 256/110 ≈ 2.33, so "little more than two" holds. The 110 matches the S9 session-log counts. No untrue clause, so nothing goes to the advisor.
- **Scope.** `git diff --name-only F H` names only `KNOWN-LIMITATIONS.md`, `command-bar.mjs` and `project.mjs` (A4-3's condition is met). numstat: 4/0, 16/5 and 24/14, within ceilings of 30 and 40.

## Checks

1. **Start (05:36:19Z).**
   - `<W>` and `<R>` HEAD = H, porcelain empty. `ls-remote` gave H.
   - df: C: 46G free, D: 347G free. origin/main de4a4471734c89eed5cc13ebec93288228d39b88.
2. **Diff B...H, all within §7.**
   - Product 60 of 85: `candidateArmSession.ts` 38/8, `WorkingCanvas.tsx` 14/0.
   - Unit 336 of 430: `candidateArmSession.test.ts` 301/0, wiring test 35/0.
   - e2e table files 276 of 412: `open-fills-fit-view.mjs` 255/0, `layout.mjs` 19/1, `package.json` 1/0. Class 9 adds 59 lines: `command-bar.mjs` 21 and `project.mjs` 38, both against F.
   - Docs 49 of 114: KNOWN-LIMITATIONS 12, walkthrough 21, README 16.
   - §11 items 1, 2 and 12: no app string (one session-log line only), no §2.6 file, no dependency or lockfile.
3. **Setup and verify.**
   - Hold 1, 05:40:34Z to 05:40:44Z: the bundle-viewer `npm ci` and build, rc 0. Deviation: one `date -u` sat between the hold and `npm ci`.
   - Hold 2, 05:41:19Z to 05:45:05Z: the shell `npm ci` and `npm run verify`, rc 0. `Test Files  120 passed (120)`, `Tests  1542 passed (1542)`.
   - Light checks in `<R>`: plan rc 0, cites rc 0, quotes rc 0 (`verify:quotes PASS — 156 checked, 125 verified, …`), test-claims rc 0, `node --test` rc 0 (`ℹ tests 606`, `ℹ pass 606`, `ℹ fail 0`). `<R>` porcelain empty.
4. **The change.** See C1 and D1 to D5 above. Seams: `shownViewportBbox` has a product caller (`candidateArmSession.ts:1500 at H`), and E-FL tests it end to end in the real app.
6. **Vitest mutations.** Each was applied by one anchored `node -e` that refuses unless its anchor occurs once. Each revert was `git -C <W> checkout -- <file>`, rc 0, porcelain empty.
   - **M-U1** (the block removed): rc 1, 4 failed. Each fails at its own assertion; U-FL3 fails at its earlier "started" guard.
     - U-FL1 `:3888:50` "one plan, in the terminal: expected "vi.fn()" to be called 1 times, but got 0 times"
     - U-FL3 `:4014:85` "the terminal's plan started both covering streams: expected [ 'sh_1' ] to deeply equal [ 'sh_1', 'sh_t1', 'sh_t2' ]"
     - U-FL5 `:4055:33` "one plan: expected "vi.fn()" to be called 1 times, but got 0 times"
     - U-FL6 `:4072:75` "no reset at the first look's terminal: expected "vi.fn()" to not be called at all, but actually been called 1 times"
   - **M-U2** (term (vii) dropped): rc 1. U-FL2 (a), through `expectNoPlanAt` at `:3921:9`: "no plan reached the canvas: expected "vi.fn()" to not be called at all, but actually been called 1 times". It fails at its own assertion.
   - **M-U2g** (term (iv) dropped): rc 1. U-FL2 (g), at `:3871:53` through `:3983:9`, the same message. It does not reach 3984.
   - **M-X** (mine; run with `-t "U-FL2 \(g\)"`): rc 1, at `:3984:77`: "one status emit, S1's: expected [] to deeply equal [ [ { …(3) } ] ]".
   - **M-U3**: rc 1, 3 failed: U-FL1 `:3888:50`; U-FL3 `:4024:29` "expected { kind: 'query-issued' } to deeply equal { …(3) }"; U-FL5 `:4055:33`.
   - **M-U4**: rc 1. U-FL4 at `WorkingCanvas.wiring.test.tsx:447:38`: "after the fit: expected { xmin: -59.58972922953156, …(3) } to deeply equal { xmin: 2599981.036343164, …(3) }".
   - **M-U5**: rc 1, 3 failed: U-FL1 `:3888:50`, U-FL3 `:4014:85`, U-FL6 `:4072:75`.
   - All match the S5-S6 report.
7. **Probe.** One test (53 lines) was inserted after U-FL6 by one anchored `node -e`.
   - It ran twice. The first run hid the console output, so the second used `--disableConsoleIntercept`. Both were rc 0, "1 passed".
   - Reverted, rc 0, porcelain empty.
   - Lines from the second run:
     - A (the earlier look's terminal, after `reissueUnrestricted(null, f2)` and before the mint): apply `[["0:0","0:1"]]`, which is SHOWN_BOX, the pre-fit box. Planned line `{xmin:-0.99,ymin:-0.99,xmax:-0.8,ymax:-0.9}`. Both tile queries carry `"zone = 2"`. No status event.
     - B (new look minted, its batch delivered, the old plan's tiles ended): no status event.
     - C (the new look's terminal, the canvas now showing PENDING_BOX, cell 4:4, then 10 s): apply `[]`, planned lines `[]`. Status `candidate-within-budget`, complete, "Showing all 7 features in view". `isFillComplete` true.
     - D (`onViewportChanged(PENDING_BOX)` plus 120 ms): apply `[["4:4"]]`, status `candidate-fill-progress`.
   - Reading (mine): the new fit does not fill without a pan. The status reads complete for the old box until the next pan or zoom. The form's §3 line 171 states this window. The source comment does not (D3).
8. **e2e mutations.** For each: the anchor line at F was shown by `git show F:… | sed`, and the same text matched once at H (`App.tsx:1060`, `:2051`; `WorkingCanvas.tsx:2102`, the same at F and H). Each suite ran whole in its own hold. Each revert gave rc 0 and an empty porcelain.
   - **M-A4-1, command-bar.** Busy check FREE at 05:54:56Z; load line 05:55:06Z 64,63,64; log 05:55:16Z to 05:58:13Z; rc 1, 13 PASS and 1 FAIL. `[E-AND] FAIL (44745ms): E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])`. Last line `rc=1 end 2026-11-19T05:58:13Z`.
   - **M-A4-1, project.** FREE at 05:59:06Z; load 05:59:19Z 35,57,29; log 05:59:29Z to 06:00:11Z; rc 1, 1 PASS and 1 FAIL. `[CLAUSES] FAIL (30168ms): CLAUSES: waited 30000ms for the newest record_step rows to end with ["filter:\"zone\" = 'residential'"], the last ok (after clause A); the last reading was []`.
   - **M-A4-2, project.** FREE at 06:01:00Z; load 06:01:10Z 26,23,9; log 06:01:19Z to 06:02:10Z; rc 1, 2 PASS and 1 FAIL. `[STYLE] FAIL (30230ms): STYLE: waited 30000ms for the newest record_step rows to end with ["filter:\"zone\" = 'residential'","filter:(\"zone\" = 'residential') AND (\"zone\" IS NOT NULL)","style.set:fillOpacity=0.37"], the last ok (after the opacity); the last reading was [{"request":"{\n  \"skp\": \"skp/0.13\",\n  \"dataset\": ` (cut here). CLAUSES PASS.
   - **M-A4-3, command-bar.** FREE at 06:02:56Z; load 06:03:14Z 13,13,3; log 06:03:23Z to 06:05:59Z; rc 1, 13 PASS and 1 FAIL. `[E-AND] FAIL (48792ms): E-AND: after card B was added the newest record_step rows did not end with A's step then the combined text's, the last at ok: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`.
   - **M-X2 (mine), command-bar.** FREE at 06:06:44Z; load 06:06:56Z 9,17,28; log 06:07:07Z to 06:09:21Z; rc 0 (C1).
   - **FILL's mutation, layout.** `reportViewport(decision.bbox)` became `reportViewport(lastQueriedRef.current ?? decision.bbox)`. FREE at 06:10:55Z; load 06:11:04Z 12,10,7; log 06:11:14Z to 06:12:15Z; rc 1, 9 PASS and 2 FAIL. FILL fails by name: `[FILL] FAIL (24378ms): FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`. RESIZEQ also fails: `[RESIZEQ] FAIL (11015ms): RESIZEQ: closing the Inspector gave 0 new viewport_query lines within 3000ms, expected at least 1 (predicted new cells 96)`.
   - Every log's first line reads `worktree C:/dev/wt/fl head e374eb711caaeae4dd898e8ddb49a35d4d80c619 start …`. The command-bar runs end with `This run launched the app; it stays RUNNING on CDP port 9223.` and then `rc=…`.
   - Hold lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (…)` and `MACHINE_RELEASED project=<m> …`. The shell pids were 44704, 24292, 69676, 53120, 62876 and 72540. There were no `others=`, MACHINE_WAITING or MACHINE_ERROR lines, and every hold exited 0.
   - Every app-down printed `port 9223 free` and `port 5400 free`.
   - No failure is timing-shaped: each is a content mismatch or an empty reading after a 30 s wait.
9. **E-FL, recomputed from the logs (before this report's mutations).**
   - Base, S4 at E': log sha256 equals the filed log (0f81f7d8…). Precondition met. (a) FAIL (0 further), (b) PASS, (c) FAIL (status null), (d) FAIL (14 of 28 blank), (e) holds. Exit 1, so P-E-base and M-E-FL hold: (a), (c) and (d) fail.
   - Head, S7 at C e4c1dfba (log sha256 2f5bd936…) and S9 at F: (a) PASS (42 further), (b) PASS, (c) "Showing all 30443 features in view", (d) 0 blank, (e) 0.
   - The product is unchanged from C to H.
10. **Runs reused.**
    - command-bar and project at H come from the Amendment 4 report. Their logs were read by call: `a4-command-bar` 14 PASS / 0 FAIL, rc 0; `a4-project` 12 / 0, rc 0, with the E-AND, CLAUSES and STYLE lines as the report gives them.
    - The other suites at F come from the S9 series and re-runs reports. Those were read from the reports; of their logs, only layout's (FILL PASS, rc 0) and E-FL's were read by call.
    - Reproduced: none unmutated.
11. **CI (05:55:07Z).** `gh pr checks 335`: 8 checks, all pass. `gh run view` gives headSha e374eb71… for all six runs (DCO, Exposure scan, Ported notices ×2, Product CI — shell ×2). None red or cancelled.
12. **End (06:12:43Z).** `<W>` and `<R>` HEAD = H, porcelain 0 each. `ls-remote` gives H. df: C: 46G, D: 358G. Busy check FREE. Ports 5400 and 9223 are not listening.

## Draft for the advisor

"C1 (gate reviewer, PR 335 at e374eb71): E-AND's tail reading after card B accepts a commit that records card A's step again before its own. A mutation that adds that row passed E-AND in the real app (`gflr-mx2-command-bar`, rc 0). F's count rejected it. Amendment 4 item 6 names this a Correctness finding. README.md:802 at H ('adds exactly one `record_step` row') and the PASS text at command-bar.mjs:451 at H become untrue with it. The reviewer's proposed fix carries the row read before card A into the committed tail. Theirs to rule: that fix, or the weaker reading with new words for the two texts."

Background shells: all seven I started have ended: bzw9es3b3, bdbgkxlz5, bh7csw1ay, b5mtcs6ur, bwtde0hre, bjbrqtgq2, bgv2chype. None is still running, and I killed no process.

Model: Opus 5.5 (claude-opus-5-5).
