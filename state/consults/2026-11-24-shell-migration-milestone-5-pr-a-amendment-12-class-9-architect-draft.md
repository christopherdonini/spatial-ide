# Milestone 5 PR A: Amendment 12, the architect's class 9 draft under ADV-2026-11-24-14 items 4 and 6 and ADV-2026-11-24-09 item 4

*Filed by the custodian: node:shell-migration-milestone-5@pr-a-amendment-12-architect-draft-1. It is a draft and gives no verdict. It is not appended to the form: its open questions Q1 to Q4 (the store mutation, the reach of D-4's words, C-E2's one passing reading, and the path of N8-G's Apply) go to the advisor first. The custodian checked its nine Old texts against `cut/shell-migration-milestone-5-pr-a` at 806ad30843269f8012ec1d89f0224703a8078ad7 by git show: each is found once, on the line it cites. It ran during no build, in the sitting. Dispatched at 2026-11-24T05:42:58Z; its run: Read 29, Grep 17, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T05:42:58Z to 2026-11-24T05:52:22Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T05:52:21Z. 19043 bytes, sha256 e007e049f6b8fbda9fdc84213501e85a26c3a1f56539131e851cdde3944af9f8, byte for byte, nothing masked, with one final newline added.*

---

Draft, no verdict (cut/shell-migration-milestone-5-pr-a @ 806ad30843269f8012ec1d89f0224703a8078ad7)
Reviewed: D:/wt/m5a @ 806ad30843269f8012ec1d89f0224703a8078ad7; records in D:/wt/read-1124e @ 7a07ca1c331eba03812e8e609115c0c4179ac5aa
REPORT PATH: state/consults/2026-11-24-shell-migration-milestone-5-pr-a-amendment-12-class-9-architect-draft.md

The draft is below, ready to append. It declares two new tests, C-U6b and N8-G, and three mutations, M12-1 to M12-3. I checked the form for each id and none is used there yet. I wrote no file and ran nothing. Every line cite is read at 806ad308. "Paraphrase" marks the places where I restate something rather than quote it.

## 1. The amendment

`````text
## Amendment 12 — 2026-11-24 — the architect's, class 9 before code: C-E1 and C-E2 step 4 fail at the bound (ADV-2026-11-24-14 item 4), the store's re-raise guard (item 6), the N8 test (ADV-2026-11-24-09 item 4)

*Written by the architect before any code of the changes it declares and before any run of C-E1 or C-E2. Every "`path`, line N at 806ad308" below is read at 806ad30843269f8012ec1d89f0224703a8078ad7 on `cut/shell-migration-milestone-5-pr-a`, a branch commit; no span is pinned by hash.*

1. **Authority.** The advisor's rulings ADV-2026-11-24-14 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-14-milestone-5-pr-a-part-af-approved-af0a-read-back-q1-a-for-both-suites-a-narrow-read-a-store-guard.md`), items 4, 6 and 9, and ADV-2026-11-24-09 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-09-milestone-5-pr-a-after-adv-2026-11-24-07-no-stop-c-u4-the-pin-x-2-found-g-1-and-g-2-a-new-n8-test-after-the-sitting.md`), item 4, under the human's delegation of 2026-11-13; they are not the human's words. The evidence is the architect's build gate, gate-log row 898 (`state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-build-gate-architect.md`): check 3 case 3, ER-1 with Q1, and D-4. All three changes are class 9 and inside the Scope (§2.6 as Amendments 2 and 9 widen it). Neither suite has run, so items 2 and 3 are changes before any result. Every run waits until the human says the sitting is over (ADV-2026-11-24-14 item 9); the N8 test is added after the sitting (ADV-2026-11-24-09 item 4).

2. **C-E1 step 4 as it becomes** (`frontends/shell/e2e/conditions-baseline.mjs`, lines 155-165 at 806ad308). Steps 1 to 3 and the start of step 4 are unchanged: S-3 opens Problems, Dismiss, the reopen, and a reopen that is not admitted ending the run VOID (line 163).
   - **The wait.** After the reopen is admitted, the step reads the strip and Problems (`read`, lines 86-102) every 200 ms, within `WAIT_TIMEOUT_MS` (90,000 ms, line 38; a harness bound on readiness, not a timing), until no `.canvas-session-ended` stands. This wait throws no `Void`, so `waitFor` (lines 56-69) is not used for it.
   - **FAIL at the bound.** If the old session's block still stands at the bound, the step records a FAIL with the last reading and ends. It does not end VOID. The hash check (lines 167-169) still runs, and the run exits 1.
   - **The passing readings,** judged on the first reading in which the block is gone:
     - (i) S-4: Problems' text holds S-4, the strip is hidden, Problems has no row, and no `.canvas-refusal` that is not a notice and no `.canvas-session-ended` stands (line 165's checks);
     - (ii) the new open's refusal: the strip's top element carries `canvas-refusal`, it is the one such refusal in the DOM, the strip carries no S-5 line (`.condition-occurrences`), and Problems' rows are exactly one, the top's row (`problem-row-top`, no owner class, S-10's text).
   - **Any other reading FAILS.**
   - **The no-`Raised`-line clause is kept.** By reading, the new open cannot raise the refusal twice without a pan:
     - Each open mounts a fresh canvas (`frontends/shell/src/App.tsx`, line 2433 at 806ad308).
     - The baseline open issues one query of its own, the first look (`App.tsx`, line 2087 at 806ad308). Any other query comes through the debounce from the canvas's `onViewportChanged` (`App.tsx`, lines 2064-2076 and 2507 at 806ad308).
     - The canvas calls `onViewportChanged` only through `reportViewport` (`frontends/shell/src/canvas/WorkingCanvas.tsx`, lines 1116-1119 at 806ad308). A resize asks for an area only once one has been asked for (lines 2123-2126), and a fresh canvas has asked for none (line 1113). A view shown by the auto-fit issues no query (`App.tsx`, lines 2452-2454 at 806ad308).
     - Within the first look's one stream, `pushBatch` is synchronous (`WorkingCanvas.tsx`, lines 1496-1541 at 806ad308): the refused batch calls `onCanvasRefusal` and returns (lines 1544-1554). App's handler calls `cancelStream` in the same turn (`App.tsx`, lines 2475 and 2493, through line 673, at 806ad308). `cancelStream` drops the stream as current before its first await (`frontends/shell/src/streaming/viewportStreamManager.ts`, lines 461-467 at 806ad308), so a later batch of that stream is dropped before the canvas (lines 280-288).
     - So a second raise needs a second stream, and a second stream needs a pan. A reading whose refusal carries an S-5 line is "any other reading": a FAIL.
   - This item supersedes, for step 4, the end of §4's C-E1 row ("reopen, and both are empty"). The row is not edited.

3. **C-E2 step 4 takes the same rule for the old conditions** (`frontends/shell/e2e/conditions.mjs`, lines 155-159 at 806ad308). Steps 1 to 3 and a reopen that is not admitted ending the run VOID (line 157) are unchanged.
   - **The wait.** After the admitted reopen, the step reads every 200 ms, within `WAIT_TIMEOUT_MS` (60,000 ms, line 39; a harness bound), until no `.canvas-session-ended` and no `.save-notice` stands.
   - **FAIL at the bound.** If session ended or the save notice is still shown at the bound, the step records a FAIL and ends, not VOID. The hash check (lines 161-163) still runs.
   - **The passing reading** is S-4: Problems' text holds S-4 and line 159's checks hold. Reading (ii) of item 2 is not taken here, because canvas-ceiling is a baseline-only route (Amendment 2, E-1.0).
   - **Any other reading FAILS.**
   - This item supersedes, for step 4, the end of §4's C-E2 row ("reopen the copy, and S-4 shows"). The row is not edited.

4. **D-4's words, following the suites as amended.** Each Old text is byte for byte from the file at 806ad308.

   (a) `frontends/shell/e2e/conditions-baseline.mjs`, line 16 at 806ad308.

Old:
````text
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy, and both the strip and Problems are empty (S-4 shows).
````
New:
````text
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy. Once the reopen is admitted, wait within WAIT_TIMEOUT_MS for the old session's block to go; if it still
//      stands at that bound the step FAILS. Then PASS on S-4, or on the new open's refusal as the strip's top with no S-5 line and Problems listing only the top's row; any other reading FAILS.
````

   (b) The same file, line 17 at 806ad308.

Old:
````text
// Exit 0 all PASS; 1 a check failed; 2 VOID (the arm pin, the fixture, a wait that timed out).
````
New:
````text
// Exit 0 all PASS; 1 a check failed (step 4's wait for the old session's block included); 2 VOID (the arm pin, the fixture, any other wait that timed out).
````

   (c) The same file, a span of line 5 at 806ad308.

Old:
````text
C-E1 as Amendments 2, 3 and 4 leave it
````
New:
````text
C-E1 as Amendments 2, 3, 4 and 12 leave it
````

   (d) `frontends/shell/e2e/conditions.mjs`: its header needs the same. Line 17 at 806ad308:

Old:
````text
//   4. reopen the copy, and S-4 shows.
````
New:
````text
//   4. reopen the copy. Once the reopen is admitted, wait within WAIT_TIMEOUT_MS for session ended and the save notice to go; if either still stands at that bound the step FAILS.
//      Then PASS on S-4; any other reading FAILS.
````
   Line 18 at 806ad308:

Old:
````text
// Exit 0 all PASS; 1 a check failed; 2 VOID (a precondition failed: the arm, the fixture, a wait that timed out).
````
New:
````text
// Exit 0 all PASS; 1 a check failed (step 4's wait for the old conditions included); 2 VOID (a precondition failed: the arm, the fixture, any other wait that timed out).
````
   A span of line 5 at 806ad308:

Old:
````text
C-E2 as Amendments 2 and 4 leave it
````
New:
````text
C-E2 as Amendments 2, 4 and 12 leave it
````

   (e) `frontends/shell/e2e/README.md`, the C-E1 sentence, the last sentence of line 931 at 806ad308.

Old:
````text
It clicks S-3, dismisses the canvas refusal, reopens the copy, and checks that the strip and Problems are empty.
````
New:
````text
It clicks S-3, dismisses the canvas refusal and reopens the copy. Once the reopen is admitted it waits, within the suite's bound, for the old session's block to go, and fails if the block still stands at that bound; it then passes when Problems shows S-4, or when the new open's canvas refusal is the strip's top with no S-5 line and Problems lists only the top's row, and fails on any other reading.
````

   (f) The same file, the C-E2 sentence, the last sentence of line 929 at 806ad308.

Old:
````text
It reopens the copy and checks that Problems then shows S-4.
````
New:
````text
It reopens the copy; once the reopen is admitted it waits, within the suite's bound, for session ended and the save notice to go, fails if either still stands at that bound, and then checks that Problems shows S-4, failing on any other reading.
````

   (g) The same file, a span of line 933 at 806ad308.

Old:
````text
Each exits 0 when all checks pass, 1 when one fails, and 2 when the run is VOID (the arm, the fixture, or a wait that timed out).
````
New:
````text
Each exits 0 when all checks pass, 1 when one fails (step 4's wait for the old conditions to go included), and 2 when the run is VOID (the arm, the fixture, or any other wait that timed out).
````

   None of these is the human's wording. The gate's narrow read checks them (ADV-2026-11-24-14 item 4).

5. **The store's re-raise guard, C-U6b (ADV-2026-11-24-14 item 6).**
   - **File and name:** `frontends/shell/src/conditions/conditions.test.ts`, in a new `describe` after C-U6a's (which ends at line 187 at 806ad308): `it("C-U6b: a condition raised twice, dismissed, then raised again: a new id, one occurrence, and no count carried over", …)`.
   - **Steps:**
     - `opened(R)`, then two raises of one key on the canvas-ceiling route (code `canvas.vertex_ceiling`, the view target, generation R) with two displays. This gives one condition with `occurrences` 2.
     - `dismiss` of its id: no condition stands.
     - A third raise of the same key with a third display gives exactly one condition. Its id is not the dismissed one's, its `occurrences` is 1, and its `first` and `latest` are both the third display. No `Raised` count is carried over; ConditionView shows S-5 only when `occurrences > 1` (`frontends/shell/src/conditions/ConditionView.tsx`, line 37 at 806ad308).
   - **It is a guard, green at the head.** No red run is asked.
   - **Mutation M12-1:** in `conditions.ts`'s `dismiss` case (line 179 at 806ad308), return `{ ...without(state, (c) => c.id === event.id), nextId: state.nextId - 1 }`, so that the next mint reuses the dismissed condition's id. §2.2 declares a condition's id "minted by the store, never reused in a session".
     - Expected failure: C-U6b, at its new-id assertion.
     - It is observed and recorded as one dated line beside the test (§4, "How a mutation is observed").
   - **Declared unchanged:** every existing case of the file.

6. **The N8 test, N8-G (ADV-2026-11-24-09 item 4),** in `frontends/shell/src/App.lateResult.test.tsx`, in the baseline-arm `describe` (line 436 at 806ad308; the arm is pinned at line 452). It is a new `it` after the test that ends at line 870 at 806ad308.
   - **Name:** `it("A's late failure terminal and canvas refusal, after a reopen while B's own Apply is in flight with Cancel shown, leave B's Cancel shown (baseline arm)", …)`.
   - **Shape:** A admitted, then B admitted by a reopen, with both admissions flushed, as the item-7 probe does (lines 694-701 at 806ad308). A's `onTerminal` and A's `WorkingCanvas` props are captured as at lines 792-796.
   - **B's Apply in flight, with Cancel shown:** `queryWithFilter` on B, and B's second request resolved `{kind: "issued", …}` (the pattern of lines 706-714). The test asserts that `.filter-cancel` stands.
   - **A's late failure terminal:** `onTerminalA("a-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: A's own stream" })`, the call of line 829. Then it asserts that `.filter-cancel` still stands (assertion T).
   - **A's late canvas refusal:** `canvasA.onCanvasRefusal("a-stream-ceiling", "A's own ceiling refusal", "vertex-ceiling")`, the call of line 831. Then it asserts that `.filter-cancel` still stands (assertion C).
   - **Mutations, each a dated line:**
     - M12-2: G-1's guard alone removed (`App.tsx`, line 1932 at 806ad308). It fails at assertion T.
     - M12-3: G-2's guard alone removed (`App.tsx`, line 2471 at 806ad308). It fails at assertion C.
     - With both guards in place, the test passes.
   - If either removal does not fail, that is recorded as found and goes to the advisor; nothing is changed to make it fail (ADV-2026-11-24-09 item 4, paraphrase).
   - The existing test (lines 791-870 at 806ad308) is not changed, and no assertion of the file is removed or loosened.

7. **§7.** No file outside the Scope, so no Scope addition. §7 is not edited, and any overrun is class 8 at the count, in PR A's closing amendment.
   - `conditions.test.ts` (A-T, 450): adds about 20 lines.
   - `App.lateResult.test.tsx` (in the Scope by Amendment 9; no §7 ceiling, so class 8 against 0, with its 56 of row 898): adds about 45 lines.
   - `conditions-baseline.mjs` (in the Scope by Amendment 2; no §7 ceiling, so class 8 against 0, with its 204): about 25 lines changed.
   - `conditions.mjs` (A-E, 480): about 15 lines changed.
   - Groups, against row 898's figures:
     - A-T: about 1,425 against 1,480;
     - A-E: about 440 against 620;
     - PR A: about 2,500 against 3,094.
   - `e2e/README.md` is a record, outside the count: 3 lines replaced, about 23 against its 40.

Read the last amendment first.

Nothing above is edited.
`````

## 2. Each new test checked by reading the head

**C-U6b at the head: green.**
- Setup:
  - The test's `raise` helper defaults to generation R and to the route's own target. Canvas-ceiling's target is a view, so the helper gives VIEW_1 (`frontends/shell/src/conditions/conditions.test.ts`, lines 28-33 at 806ad308).
  - Canvas-ceiling declares `dismissed` (`frontends/shell/src/conditions/conditions.ts`, line 47 at 806ad308).
- The second raise matches the key, so `occurrences` becomes 2 and `latest` is replaced (lines 142-152).
- `dismiss` removes the condition by id (lines 176-180). `without` keeps `nextId` (lines 132-136).
- The third raise finds no match. The cap allows it, because `keptForCap` is 0 (line 155). So it mints `condition-${nextId}`, which is `condition-2` (line 156), with `occurrences: 1` and `first` and `latest` both the new display (lines 164-166).

**M12-1 fails C-U6b at its new-id assertion.** After the mutated `dismiss`, `nextId` is 1, so line 156 mints `condition-1`, the dismissed id. Inside the file, no other case raises after a dismiss: C-U6's dismissals are followed by no raise (lines 147-150). So only C-U6b is predicted to fail. The dated line names what does fail.

**N8-G at the head: green.**
- B's Apply in flight shows Cancel:
  - `queryWithFilter` reaches `issueViewportQuery` (`App.tsx`, line 2031 at 806ad308). B's second request is the mock's second registry (`App.lateResult.test.tsx`, lines 263-281 at 806ad308).
  - The `.then` passes the guard at line 2005 (B is current) and dispatches `issued` (line 2008), so the scan is `issuing` (lines 487-488).
  - FilterPanel shows Cancel while the scan is in flight (`frontends/shell/src/filter/FilterPanel.tsx`, lines 120-121 at 806ad308; `App.tsx`, lines 534-536).
- A's terminal:
  - `onTerminal` routes ProducerFailed to `onFailureTerminal` (`App.tsx`, lines 626-635).
  - It logs (line 1931), then G-1 returns (line 1932).
- A's canvas refusal: G-2 returns (line 2471).
- Nothing else writes the scan state.

**M12-2 fails at assertion T.** With line 1932 gone:
- The raise at lines 1939-1947 carries A's generation, which the store drops (`conditions.ts`, line 140).
- Then `applyScanEvent({kind: "failed"})` (line 1949) moves B's in-flight scan to `failed` (lines 506-507), and `.filter-cancel` is gone.

**M12-3 fails at assertion C.** With G-1 kept, assertion T passes. With line 2471 gone:
- `handleCanvasCeilingRefusal` runs (line 2475). Its raise carries A's generation and is dropped (lines 2476-2488; `conditions.ts`, line 140).
- Its `applyScanEvent({kind: "failed"})` (line 672) ends B's scan, and Cancel is gone.
- `cancelStream` reaches B's mock manager, which does nothing (`App.tsx`, line 2493; `App.lateResult.test.tsx`, line 286).

**Why the existing test could not show this** (ADV-2026-11-24-09 item 4's reason, confirmed by reading):
- In it, B's Cancel is already absent before A's late calls (`App.lateResult.test.tsx`, line 824 at 806ad308).
- A `failed` event on a scan that is not in flight changes nothing (`App.tsx`, line 507).

**C-E1 and C-E2 step 4.**
- A regression in which `opened` keeps the old conditions now leaves `.canvas-session-ended` standing until the bound, which is a FAIL, not a VOID.
- Which of C-E1's two readings a run sees depends on the timing inside the run. Both pass. The S-5 reading FAILs, on item 2's reading.

**Owed elsewhere, not in this amendment.** ADV-2026-11-24-14 item 4's class 2 record (the form's end state for C-E1 and §9 step 3 was wrong for the baseline arm) belongs to the closing amendment.

## 3. Open questions for the advisor

I decide none of these.

- **Q1. M12-1.** I named a mutation that reuses the dismissed id; it fails at the new-id assertion.
  - The other candidate: "`dismiss` ends nothing when `occurrences > 1`". It fails at the dismissal assertion, the half of check 3 case 3 that no test reaches. One is named; you may swap them.
- **Q2. D-4's reach.** Beyond line 16 and the C-E1 sentence, item 4 gives words for:
  - each header's exit line and its line-5 list of amendments;
  - the C-E2 sentence;
  - README line 933.
  A step-4 timeout is now exit 1, not 2, so those texts would otherwise be untrue. Keep them, or strike some?
- **Q3. C-E2's one passing reading.** I took it as S-4 only, because canvas-ceiling is a baseline-only route. Confirm?
- **Q4. N8-G's Apply.** I drive it through the dev `queryWithFilter` hook, as the item-7 probe does (`App.lateResult.test.tsx`, lines 706-714 at 806ad308).
  - The real FilterPanel Apply button also reaches Cancel by `issued` (lines 925-933 at 806ad308) and would cost about 10 more lines.
  - Which do you want?

Model: Opus 5.5 (claude-opus-5-5)
