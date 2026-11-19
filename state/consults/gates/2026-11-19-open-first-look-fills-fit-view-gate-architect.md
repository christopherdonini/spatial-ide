Reviewed: PR #335 at e374eb711caaeae4dd898e8ddb49a35d4d80c619, gate, architect
Branch: cut/open-first-look-fills-fit-view @ e374eb711caaeae4dd898e8ddb49a35d4d80c619

Verdict: PASS WITH NOTES

I found no Correctness or Evidence finding. The Documentation findings D1 to D4 are must-fix before the merge, by class 9, with no re-gate. The words for each are in "Drafts" below.

Gaps in my reads:
- I did not read these directives: ADV-2026-11-13-02, ADV-2026-11-14-18, ADV-2026-11-18-16, ADV-2026-11-18-17, ADV-2026-11-18-20, ADV-2026-11-18-27, or the 2026-11-05 Part 1 items 1-9 directive. I read ADV-2026-11-18-28 whole, and ADV-2026-11-19-01, -02 and -06 as they bear on checks 6, 7 and 5.
- I did not read docs/01 principles 7 and 8 in their source text. I applied them as the CLAUDE.md digest and ADR-010 rule 7's quote of principle 7 state them. I read ADR-010 rules 1-7 in the source.
- I did not read the commit messages: I have no shell. Check 10 is resolved for the added comments only.
- I did not read the E-FL run outputs, and found no record of FILL's mutation being re-observed after Amendment 3 (see check 7).

## Correctness
None. The partition, the seam, the rule-1 box and the cancel path all hold at H (checks 1 and 2).

## Evidence
None blocking. Two record items for the closing amendment follow. They are record findings, not Evidence, because the assertions they concern pass at H.
- E-R1, §4's M-U2g row. The row reads "(g) fails, with two status emits". The S5/S6 worker report says (g) failed at its no-plan assertion, the status assertion was never reached, and "The two status emits §4 names were not observed".
  - By my reading, none of the declared mutations M-U1 to M-U5 reaches the status assertion in U-FL2 (g).
  - Fix: the closing records by reference that the row's second clause was not observed. Leave §4 unedited.
  - A mutation that would reach that assertion is S1's `emitResidencyStatus()` at frontends/shell/src/residency/candidateArmSession.ts:1470 at H removed or duplicated. This is offered, not required.
- E-R2, Amendment 4 item 7. Its prediction for M-A4-1 said it would fail after B. The run failed after A: `[E-AND] FAIL (42234ms): E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])` (the Amendment 4 worker report).
  - Failing after A is stronger than predicted, not weaker.
  - Fix: the closing records the miss by reference. Leave item 7 unedited (§11 item 11).

## Documentation (must-fix before the merge, no re-gate; none of these is the human's wording)
- D1. frontends/shell/src/residency/candidateArmSession.ts:65-66 at H, the clause "at which point this module calls `establishGridFrame` exactly once, ever, for this session" is untrue at H. This is ADV-2026-11-19-01 item 3 (b).
  - The frame is set at the look's terminal (candidateArmSession.ts:1425-1427 at H; the comment at 1138-1145 at H says so).
  - `frameEstablished` is reset for each generation by `reissueUnrestricted`, so the call is made again on later generations, and the manager makes those calls no-ops (1416-1422 at H).
  - The paragraph this PR adds at 68-74 leans on that clause.
  - Words: Draft 1.
- D2. frontends/shell/src/residency/candidateArmSession.ts:84-85 at H: "With no input, that box is the look's own auto-fit" is untrue when a look after an Apply admits no geometry.
  - `fitAnchor` is non-null only for a batch that carries geometry (62 at H), so no fit fires, and the box is the camera left standing.
  - Ordinary use can reach this: an Apply whose filter matches nothing.
  - Words: Draft 2.
- D3. frontends/shell/e2e/command-bar.mjs:39-40 at H: the header's expected E-AND-b message quotes the old count reading ("the console holds N record_step rows against N + 1 …"). Amendment 4's tail reading replaced it, and under E-AND-b the run fails at the wait after card A (433-434 at H).
  - A `/filter` condition is a card change: `changeClauses` calls `commitFilterChange` with `filter.clauses.set` (frontends/shell/src/App.tsx:2085 and 2125 at H).
  - Words: Draft 3.
- D4. The README's E-FL entry: "(b) the render trace then goes quiet for 3 s within 180 s" is looser than the check. frontends/shell/e2e/open-fills-fit-view.mjs:156 at H watches only `viewport_query`, `stream-issued` and batch lines.
  - Words: Draft 4.
- D5, optional. frontends/shell/e2e/layout.mjs:449 at H: the step's error text still says "after the notch", but the step now drags (441-445 at H; FILL_PAN_PX and FILL_PAN_STEPS at 43-45).
  - Words: "after the drag" in place of "after the notch".
  - Clause check: 441-445 is the drag. Nothing else in the message changes.

## Observation
- O1. Amendment 4's tail reading catches a duplicate or a miss at the second commit or later. It does not catch a duplicate of a suite's first commit: under M-A4-3 the wait after A passed.
  - The old count reading did not catch that case either, so this is not a weakening.
  - The rows before the first commit are outside the property.
- O2. Amendment 3 item 3 says FILL's mutation "still fails by name". No run record I read shows it after Amendment 3. If the closing states it as observed, it names that run; otherwise the closing states it as a prediction.
- O3. Departures in the Amendment 4 worker report:
  - The mutations were applied by a script at `<S>`. That is evidence, not Authority.
  - h3-h6 were stamped inside the hold's own call. That is acceptable.
  - The report says "The whole diff is above" but leaves the diff out. The closing cites the commit range, not that sentence.
  - The header at command-bar.mjs:40 was left; that is D3.
- O4. Of the terminals neither block plans, guard (vi) is redundant: `stop()` and `endCandidateSession` clear the handle, so `wasCurrent` is already false. It is harmless.
  - Guard (vii) alone decides only when `relinquishFill` ran between the issue and the mint. That is U-FL2 (a)'s second case and M-U2's target.

## Checks
1. Design (§2.1, §2.4, §2.6, §8). Holds.
   - ADR-010 rule 1: `shownViewportBbox` computes the box from the camera's authoritative target and origin in f64 through `computeAuthoritativeViewportBbox`, the same as onResize's branch. It is at frontends/shell/src/canvas/WorkingCanvas.tsx:1636-1642 at H, beside 2104-2109 at H.
   - Rule 3: nothing new narrows a value to f32.
   - Rule 5: no new cache. The first look's rows stand until tiles replace them, and the settle sentence speaks.
   - Rule 6: no new ceiling; UNTILED_FIRST_LOOK_ROW_LIMIT is unchanged.
   - Rule 7: the new path is synchronous inside the sink's terminal. A session line is logged (`candidate-first-look-view-planned`), which serves principle 8.
   - Principle 7: Cancel reaches the fill through `relinquishFill`.
   - ADR-006: view planning only, so no class changes.
   - Product callers: `shownViewportBbox`'s only caller is candidateArmSession.ts:1500 at H. App passes `canvas` in (App.tsx:1674 at H). The only `manager.onCameraChange` call is at 1548.
   - Seam: the tests' `fakeCanvas` is typed against the real `WorkingCanvasHandle` with no cast (frontends/shell/src/residency/candidateArmSession.test.ts:98 at H). The end-to-end check is e2e/open-fills-fit-view.mjs at H, on the measure build.
2. Partition. Holds.
   - S1's guard at 1468 is `wasCurrent && !wasSelfCancelled && !relinquishedReEmitted && (hasPlanned || terminal.kind !== "Completed")`. The new block at 1482-1505 requires (iv) `!hasPlanned` and (v) `Completed`, which together are the negation of S1's disjunction, so the two blocks are disjoint.
   - S1 runs first.
3. §3 against the code. Holds.
   - The cases with no plan are each a guard: (i)-(viii), a null box, or a null frame.
   - The may-not-claim rows (Cancel, failure, silence during the fill, a standing over-budget sentence, the mint window) match the code.
4. §11 items 1-15. Hold as read. Item 4 holds: one `onCameraChange`. Item 11 holds: item 7 is not edited; see E-R2.
5. §10 words, clause by clause.
   - Item 64 and its comment: true at what an operator observes in the shipped app. The comment's not-covered list matches §3 and the guards.
     - Open edge, for the advisor and not reworded: an open whose first look returns no geometry (an empty file) asks for no tiles.
   - Item 51: true. The 10,000-row clause is gone.
   - Item 7 (G1), re-read at frontends/shell/KNOWN-LIMITATIONS.md:105-111 at H: still true. The three sentences are unchanged, and the plan's settled-partial sentence still speaks.
   - Item 67, every clause against the code:
     - The 256 ring with shift and a dropped count: true (recorder.ts:141, 283-292 at H).
     - "(N dropped)": true (ConsolePanel.tsx:65-68 at H).
     - The group closing when its first entry is dropped: true (ConsolePanel.tsx:96 and 107 at H).
     - Two clauses go to the advisor; see Drafts A1 and A2.
   - §10.2 rows L1, L2, L5, A7, the Part L note, V2 and V3: consistent with the code. Each is marked "[CHANGED 2026-11-18 … by reading; not sighted since.]".
   - §10.3 comments: true.
   - recentre-crossing.mjs `capture` comment (G2), at frontends/shell/e2e/recentre-crossing.mjs:235 at H: still true, as §10.4 says.
   - README entries:
     - E-AND: "adds exactly one `record_step` row that reaches `ok` and carries that text" stays true under the tail reading.
     - CLAUSES and STYLE: true.
     - FILL: consistent with Amendment 3 item 3.
     - E-FL: D4.
6. ADV-2026-11-19-01 item 3.
   - (a): no declared mutation fails U-FL2 (g)'s status assertion (E-R1).
   - (b): the top doc is untrue (D1).
7. ADV-2026-11-19-02 item 6.
   - Amendment 3 item 3 matches stepFill at H; O2 applies.
   - Item 4's two notes are consistent with the e2e at H: step 1 failed as §5 allowed, and step 3 stopped at its precondition.
8. Amendment 4 item 6. Its conditions hold, by my reading, which is a paraphrase:
   - The property is kept: n = min(rows held, committed), the tail matched in order, the last row ok, each commit's row ok at its own wait.
   - The reading is stronger than the old at-least counts in project.mjs.
   - Diffs are within the ceilings: command-bar 16/5 (ceiling 30); project 24/14 (38, ceiling 40).
   - M-A4-1 failed after A, not after B (E-R2).
9. Amendment 4 worker's departures: O3. None blocks.
10. Discharge claims and verbatim quotes:
    - The added comments carry no verbatim quote or discharge claim that I found unresolved.
    - Commit messages: not read (a gap).

## Drafts
Each draft has its clause check. None is the human's wording.

Draft 1 (D1). In candidateArmSession.ts:65-66 at H, replace `at which point this module calls` / `` `establishGridFrame` exactly once, ever, for this session.`` with:
"-- but the grid frame is not set at that batch: it is set at the look's terminal, where the untiled sink in `issueUntiledQuery` calls `establishFrameFromExtent` on the whole look's union (`latestUnionedExtent`), and the manager keeps the session's first frame (a later generation's call does not move it)."
Clause check:
- "not set at that batch" and "set at the look's terminal": true. The call is at 1425-1427 at H, and 1138-1145 at H says the terminal is the one place.
- "on the whole look's union": true, `latestUnionedExtent`.
- "keeps the session's first frame": true, per 1416-1422 at H ("no-op past the first call" contract; `frameEstablished` reset by `reissueUnrestricted`).
- The self-cancel skip at 1425 applies only when a frame already exists, so no clause is false.

Draft 2 (D2). Replace 84-85 at H with:
"With no input, and when the look admitted geometry, that box is the look's own auto-fit, so the fit view's tiles are planned without a pan; when it admitted none, no fit runs and the box is the view left standing."
Clause check:
- The auto-fit exists only for a batch with geometry: true (62 at H).
- With no geometry and a frame from an earlier generation, the box is the current camera: true (`shownViewportBbox` reads `cameraRef`, at WorkingCanvas.tsx:1636-1642 at H).

Draft 3 (D3). Replace command-bar.mjs:40 at H, the expected message, with:
"Expected: step E-AND fails at its record_step wait after card A (a `/filter` condition is a card change, `filter.clauses.set`, which then records no step): `E-AND: the newest record_step rows did not end with card A's step at ok before card B (...)`."
Clause check:
- The card change: true (App.tsx:2085 and 2125 at H).
- The wait after A and its message: true (command-bar.mjs:433-434 at H).
- The message text matches M-A4-1's observed line, quoted above from the worker report.

Draft 4 (D4). In the README's E-FL entry, replace "(b) the render trace then goes quiet for 3 s within 180 s" with:
"(b) then no `viewport_query`, `stream-issued` or `batch` render-trace line arrives for 3 s, within 180 s"
Clause check: true at open-fills-fit-view.mjs:156 at H (the watched lines, the 3 s quiet and the 180 s limit).

For the advisor (item 67, the advisor's words: findings, not reworded):
- A1. "In the app-window tests one such load was 110 requests". The evidence counts 110 tile terminals in the session logs. Requests are at least the terminals, since an abandoned mint has no terminal. So 110 is a floor inferred from terminals, not a count of requests. The comment discloses the inference; the paragraph's words do not.
- A2. "one request for each tile". Not true for cover tiles that are truncated or dropped from the queue, which get no request.
