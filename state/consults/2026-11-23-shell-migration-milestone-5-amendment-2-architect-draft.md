*Filed by the custodian: the architect's draft of Amendment 2 to `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`, after the architect's form gate, attempt 1 (FAIL; `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect.md`, gate-log row 862), node:shell-migration-milestone-5@amendment-2-architect-draft, dispatched at 2026-11-23T15:07:57Z. Its run: Read 32, Grep 27, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:07:58Z to 2026-11-23T15:18:58Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 33659 bytes, sha256 ec866000d7d3afdc7c865dc6248161aa2d316aaaa3c05079c2eea9f8f0dc5d2e, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 3 follows it.*

---

Result: I drafted Amendment 2 at `C:/dev/wt/read-1123b` @ 96f56d28206e74d6992156f3f7735483d8063fa8. It splits the seam proofs between the two residency arms: the canvas-ceiling and stream-terminal routes go to a separate baseline-pinned process, and everything else is re-aimed at the shipped candidate arm. It also gives the reducer a generation guard and a `notKept` reset, adopts D-a to D-g, and sends D-h and D-i to the advisor.

---AMENDMENT 2---
## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL): E-1, C-1 and the documentation findings

*Written after the outcome of the architect's form gate, attempt 1, was seen. The gate report is `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect.md`, cited by finding id. It is written before any code. Every `path:line` in this amendment is read at 96f56d28206e74d6992156f3f7735483d8063fa8. Between 0bcf5434 and that commit only records changed (the gate report's header). The custodian adds span hashes by script.*

### E-1. The arms

**E-1.0 The arm map. This is binding for every row below.**
- **Baseline-pinned process:**
  - C-E1, H2, H3 and §3 row 1.
  - Operator steps 0a to 3.
  - The new suite `frontends/shell/e2e/conditions-baseline.mjs` pins the arm once, in `main()`, before its first `openPath`. It calls `setResidencyArm("baseline")`, reads back `getResidencyArm()`, and fails the run on a refused pin, as `frontends/shell/e2e/refusal-contract-baseline.mjs:596-617` does.
- **Shipped candidate arm.** `setResidencyArm` is never called. Each e2e reads back `getResidencyArm()` as `"candidate"` before its first `openPath`.
  - The App tests: C-A1 to C-A4, J-A1 and J-A2. Their harness is `App.streamFailure.test.tsx`'s, on `DEFAULT_RESIDENCY_ARM` (`frontends/shell/src/residency/residencyArm.ts:50`).
  - The e2e tests C-E2, J-E1 and J-E2.
  - H4, H6 and H7.
  - §3 rows 2 and 3, and the new row.
  - Operator steps 3a, 4 and 5.
- **No arm:** the C-U, C-R, J-U, J-R and C-K1 tests (pure, or a component alone). H1 runs each existing suite on its own arm, as at the base. H5 has no arm.
- **Why.** Two routes exist only on the baseline arm:
  - canvas-ceiling: `App.tsx:667` is reached only from the baseline `pushBatch` catch (`frontends/shell/src/canvas/WorkingCanvas.tsx:1536-1548`);
  - stream-terminal: `App.tsx:1892` is in the baseline branch (`:1853` on). The candidate branch returns before it (`:1838-1850`).
- The other routes:
  - **viewport-refusal** is raised on candidate only at the first look (`App.tsx:1834`) and at the Colour-by refill (`:2146`), never from a pan. On baseline it is also raised at `:2012` and `:2031`.
  - **session-ended and the three notices** are raised on both arms.

**Addition, at the end of §2.2's bullets after the routes table:**

````text
- **Arms.** canvas-ceiling and stream-terminal are baseline-only routes (`App.tsx:667` from `WorkingCanvas.tsx:1536-1548`; `App.tsx:1892`, after the candidate branch has returned at `:1838-1850`). viewport-refusal is raised on candidate only at the first look (`:1834`) and the Colour-by refill (`:2146`). session-ended and the three notices are raised on both arms.
````

**E-1 item 1.** C-E1, H2, H3 and §3 row 1 run in their own baseline-pinned process (E-1.0).

Old:
````text
| H3 | A pan on that copy raises the same ceiling refusal again, under the same view and open. | C-E1, step 3 |
````
New:
````text
| H3 | A pan on that copy, on the pinned baseline arm, raises the same ceiling refusal again, under the same view and open. | C-E1, step 3 |
````

D-d below carries H2's arm clause.

Old:
````text
| `over-ceiling-refused.parquet` (copy) | C-E1 | A canvas refusal first. A pan re-raises it (H3). A write and a pan end the session (H2). Problems has 2 rows. |
````
New:
````text
| `over-ceiling-refused.parquet` (copy) | C-E1, in the baseline-pinned process (`e2e/conditions-baseline.mjs`) | A canvas refusal first. A pan re-raises it (H3). A write and a pan end the session (H2). Problems has 2 rows, or 3 when the session ended on the baseline post-check route (a stream-terminal row, declared unchanged in Amendment 2). |
````

Old:
````text
| C-E1 | A | the real app, §3: open the copy; the refusal is the top with no S-3; pan, and Problems shows 1 row with S-5; write and pan, and the top is session ended with S-3 at 1 and both rows standing; S-3 opens Problems; Dismiss the refusal; reopen, and both are empty | the session-ended raise ends the other conditions; {C-E1} |
````
New:
````text
| C-E1 | A | the real app on the baseline arm, in its own process (`e2e/conditions-baseline.mjs`), the arm pinned once in `main()` before the first `openPath` with a `getResidencyArm()` readback, a refused pin failing the run (`refusal-contract-baseline.mjs:596-617`); then §3: open the copy; the refusal is the top with no S-3; pan, and Problems shows 1 row with S-5; write and pan, and the top is session ended with S-3 at 1 and both rows standing, or S-3 at 2 only when the session log holds a `stream-terminal-failure` line whose detail opens with `engine.source_changed` (`App.tsx:1887`), the extra row being that stream-terminal condition; any other count fails; S-3 opens Problems; Dismiss the refusal; reopen, and both are empty | the session-ended raise ends the other conditions; {C-E1, C-E2} |
````

**E-1 item 2.** C-A1 moves to routes the candidate harness reaches: viewport-refusal, record-notice and session-ended.

Old:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App, with the canvas stand-in capturing `WorkingCanvasProps`).
````
New:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App on the shipped candidate arm, whose baseline `ViewportStreamManager` is a stub that captures no callbacks, with the canvas stand-in capturing `WorkingCanvasProps`). No App test reaches `App.tsx:667` from the canvas or `:1892`.
````

Old:
````text
| C-A1 | A | the real App: two terminal failures with different codes, then a session end; the strip's top is session ended, S-3 reads 2, and Problems has 3 entries | App clears before it raises at `:1892`; {C-A1} |
````
New:
````text
| C-A1 | A | the real App on the shipped candidate arm: the first look's untiled query refused once with `SkpCallError({code: "engine.connections_exhausted", …})` (the shape at `App.streamFailure.test.tsx:240`), giving a viewport-refusal condition; a style commit whose `recordStep` the transport mock refuses (the `refuseRecordWith` pattern, `App.recording.test.tsx:229`), giving a record notice; then a `DatasetSessionEnded` `{session, reason: "observed-change"}` for the open, delivered through the handler the `./skp/events` mock captures, giving session ended; the strip's top is session ended, S-3 reads 2, and Problems has 3 entries | App ends the viewport-refusal condition when it raises session ended; {C-A1} |
````

The transport mock gains `recordStep`, and the events mock keeps its handler. Both modules are already mocked by the harness, so no new module is mocked (I5).

**E-1 item 3. The shipped arm's proof of seam 8.**
- **Real App (candidate):**
  - C-A1 covers session-ended, viewport-refusal and a record notice.
  - C-A4 covers the viewport-refusal route's suppression.
  - C-A3 covers Dismiss, the owner-clear and the reopen notices.
- **Real app (candidate):** C-E2 (new) covers session-ended and a save notice, and checks that no viewport-refusal condition is raised on that route.
- **Not covered in the real app:** a viewport refusal that is not suppressed, on the shipped arm. No ordinary step or e2e hook produces a pre-check refusal at the candidate first look or refill on demand. The one that can be produced, a source change, takes the session route. So its raise is proven only in the real App (C-A1, C-A3).

Old:
````text
| C-A4 | A | the real App: a session-ended pre-check refusal gives one condition, not two | raise the viewport condition too; {C-A4} |
````
New:
````text
| C-A4 | A | the real App on the shipped candidate arm: the first look's untiled query refused with `engine.source_changed` (the pre-check route, `App.tsx:1623-1629`) gives one condition, session ended, not two | raise the viewport condition too; {C-A4} |
````

Old:
````text
| C-A3 | A | the real App: Dismiss; a resolved viewport outcome clears its condition; a refused reopen keeps session ended; a successful open clears everything | clear on a refused admission; {C-A3} |
````
New:
````text
| C-A3 | A | the real App on the shipped candidate arm: Dismiss; a resolved viewport outcome clears its condition (the first look refused, then the canvas stand-in calls the captured `onAttributesNotHeld`, `App.tsx:2373`, and a Colour-by change issues the refill, `:2137-2147`, whose resolved outcome reaches `:1613`); a refused reopen keeps session ended; a successful open clears everything; a reopen whose file carries a notice leaves its `.reopen-notice` standing after its own open | clear on a refused admission; {C-A3} |
````

Old:
````text
| C-A2 | A | the real App: two ceiling refusals with identical text, one vertex and one pick, through the captured `onCanvasRefusal`, give two conditions | App passes a constant `kind`; {C-A2} |
````
New:
````text
| C-A2 | A | the real App, App's consumer side of the callback (App passes the prop on both arms, `App.tsx:2396`; the producer is baseline-only, C-K1 and C-E1): two ceiling refusals with identical text, one vertex and one pick, through the captured `onCanvasRefusal`, give two conditions | App passes a constant `kind`; {C-A2} |
````

**Addition, after the row C-E1 in §4's table:**

````text
| C-E2 | A | **the shipped arm's real-app proof of seam 8:** `e2e/conditions.mjs`, `getResidencyArm()` read back as `"candidate"` before the first `openPath`, `setResidencyArm` never called; §3's 100k copy in the run's TMP folder: open it; save through `e2eSaveProjectToFolder` into a new folder under the run's TMP, and the strip's top is a `.save-notice`, the save notices include the owner's `SAVED_NOTICE` (read from `src/project/saveProject.ts` by name, as `project.mjs:372-378` reads S18), and S-3 is absent; write to the copy and pan (H7), and the top is session ended with S-3 at 1; S-3 opens Problems, which lists the top row and the `.save-notice` row; `.canvas-session-ended` and each `.save-notice` are each once in the DOM; no `.canvas-refusal` holds an `.admission-refusal-code` (no viewport-refusal condition); reopen the copy, and S-4 shows | the session-ended raise ends the other conditions; {C-E1, C-E2} |
````

**Addition, after the row C-R3 in §4's table:**

````text
| C-K1 | A | **the ceiling's kind comes from its class:** `ceilingKindOf` (new, `src/canvas/limits.ts`; its product caller is WorkingCanvas's catch at `:1538-1540`, which passes it as `kind`) returns `"vertex-ceiling"` for `new ResidentVertexCeilingExceeded(MAX_RESIDENT_VERTICES + 1)` and `"pick-ceiling"` for the error `checkPickCeiling(DECKGL_PICK_INDEX_CEILING + 1)` throws (`limits.test.ts:24-41`'s shapes) | return `"vertex-ceiling"` for both; {C-K1} |
````

**Addition, after the row `| `100k-happy-path.parquet` | J-E2 |…` in §3's table:**

````text
| `100k-happy-path.parquet` (copy) | C-E2, on the shipped candidate arm (`e2e/conditions.mjs`) | A save notice first. A write and a pan end the session (H7). Problems has 2 rows. A reopen empties it. |
````

**Addition, after the row H5 in §0.4's table:**

````text
| H6 | On the shipped candidate arm, after the slow fixture's first look has settled, a pan starts a tile fill during which the Jobs scan row stands until it is clicked. | J-E1, the pan step |
| H7 | On the shipped candidate arm, a write to the opened 100k copy and a pan end the session, and raise neither a viewport-refusal nor a stream-terminal condition. | C-E2, the write step |
````

**E-1 item 4. J-A1 and J-E1 are re-aimed at candidate.**
- The baseline `cancelStream` path is dropped from the Jobs tests, for this reason:
  - `handleCancelScan` is App's inline handler moved whole (`App.tsx:2261-2330`), and FilterPanel's Cancel calls it.
  - Its baseline branch is therefore reached through FilterPanel's Cancel by `refusal-contract-baseline.mjs`'s SLOW'/CANCEL' step (`:479-508`), which runs at every head.
  - A Jobs test on baseline would prove a branch of the same function, which the Jobs row does not choose.
- J-A1 observes `relinquishFill` through its owner's outcome, not a spy. The candidate session is not mocked (§4).

Old:
````text
| J-A1 | B | the real App: the Jobs Cancel calls `handleCancelScan`; the manager's `cancelStream(handle)` runs once; the state is `cancelled`; FilterPanel's Cancel and the row are gone | Jobs dispatches `cancelledByUser` without `cancelStream`; {J-A1, J-E1} |
````
New:
````text
| J-A1 | B | the real App on the shipped candidate arm, set up as APP-SR2 (`App.streamFailure.test.tsx:223-238`: open, the first look's batch and terminal, one pending tile): the Jobs scan row and `.filter-cancel` stand; the Jobs Cancel calls `handleCancelScan`, whose candidate branch calls `relinquishFill` (`App.tsx:2306-2321`): the row and `.filter-cancel` are gone, `.scan-incomplete` is absent, and `.residency-status` changes to the owner's relinquished statement (`src/residency/residencyStatus.ts:463`), equal to the text a twin case in the same file gives when `.filter-cancel` is clicked at the same point | the Jobs row's Cancel dispatches `applyScanEvent({kind: "reset"})` and does not call `handleCancelScan`; {J-A1, J-E1} |
````

Old:
````text
| J-E1 | B | the real app, §3: the Jobs scan row; Cancel; `.scan-incomplete`; a `cancel` row in Console; no stream left | Jobs Cancel not wired; {J-E1} |
````
New:
````text
| J-E1 | B | the real app on the shipped candidate arm, `getResidencyArm()` read back as `"candidate"` before the first `openPath`, `setResidencyArm` never called: open the slow fixture, wait for the first look's settle, pan (H6); the Jobs scan row and `button.filter-cancel` stand; Cancel from Jobs; the row and `button.filter-cancel` are gone, `.residency-status` matches the owner's relinquished statement (`src/residency/residencyStatus.ts:463`), and `.scan-incomplete` is absent over a bounded settle window | Jobs Cancel not wired; {J-E1} |
````

Old:
````text
| `slow-filter-scan.parquet` | J-E1 | The Jobs scan row, then Cancel from Jobs, then `.scan-incomplete`. |
````
New:
````text
| `slow-filter-scan.parquet` | J-E1, on the shipped candidate arm | The Jobs scan row during a tile fill after the first look (H6), then Cancel from Jobs, then the row and FilterPanel's Cancel gone, the relinquished status, and no `.scan-incomplete`. |
````

**§2.5, items 1, 2 and 4:**

Old:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. It is proven from the real App by C-A1 to C-A4, and in the real app by C-E1.
````
New:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. On the shipped candidate arm it is proven from the real App by C-A1, C-A3 and C-A4, and in the real app by C-E2. The baseline-only routes are proven in the real app by C-E1, in its own baseline-pinned process. A viewport refusal that is not suppressed is proven on the shipped arm in the real App only (Amendment 2, E-1 item 3).
````

Old:
````text
2. `onCanvasRefusal` with its kind (OPEN-2 (a)): C-A2 drives the captured real `WorkingCanvasProps`, and C-E1 runs it in the real app.
````
New:
````text
2. `onCanvasRefusal` with its kind (OPEN-2 (a)), a baseline-only producer: C-K1 proves the class-to-kind mapping, C-A2 drives App's consumer through the captured real `WorkingCanvasProps`, and C-E1 runs it in the real app on the pinned baseline arm.
````

Old:
````text
4. FilterPanel's `onCancel` and the Jobs Cancel as one function: J-A1, then J-E1.
````
New:
````text
4. FilterPanel's `onCancel` and the Jobs Cancel as one function, `handleCancelScan`: J-A1, then J-E1, on the shipped candidate arm, where it calls `relinquishFill`. Its baseline branch is reached through FilterPanel's Cancel by `refusal-contract-baseline.mjs`'s SLOW'/CANCEL' step, unchanged.
````

**E-1 item 5. The operator Part.** Step 0a pins baseline in a dev build, as Part D's D0 does (`frontends/shell/MANUAL-WALKTHROUGH.md:218`). Steps 3a and 4 run in a fresh launch on the shipped arm.

Old:
````text
  - 1 (A). Open the over-ceiling copy. The strip shows one refusal. Felt: do you know where the others would go?
  - 2 (A). Pan, then change the file and pan. The strip shows session ended and "1 more". Open Problems. Felt: is the count noticed, and does the strip feel calmer?
  - 3 (A). Dismiss the refusal in Problems. Reopen the file, and both are gone.
  - 4 (B). Slow fixture: filter, open Jobs, and cancel there. Felt: did you look in Jobs or in Filter?
````
New:
````text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build.
  - 1 (A). Open the over-ceiling copy. The strip shows one refusal. Felt: do you know where the others would go?
  - 2 (A). Pan, then change the file and pan. The strip shows session ended and "1 more". Open Problems. Felt: is the count noticed, and does the strip feel calmer?
  - 3 (A). Dismiss the refusal in Problems. Reopen the file, and both are gone.
  - 3a (A). Close the app and launch it again with no DevTools step (the shipped arm). Open a copy of the 100k fixture and save the project; the strip shows the save notice. Change the file and pan; the strip shows session ended and "1 more", and Problems lists the save notice. Reopen the file, and Problems is empty.
  - 4 (B). In a shipped-arm launch: slow fixture: wait for the map, filter, open Jobs, and cancel there. The row and Filter's Cancel go, the status bar says filling stopped, and no incomplete-scan line shows. Felt: did you look in Jobs or in Filter?
````

### C-1. The lifecycle of `notKept`, and the generation guard

Old:
````text
**The reducer** is `conditionsReducer(state, event)`. It is pure, and it holds `{ byId, nextId, nextSeq, notKept }`. Its events:
````
New:
````text
**The reducer** is `conditionsReducer(state, event)`. It is pure, and it holds `{ byId, nextId, nextSeq, notKept, current }`, where `current` is the open's generation, `null` before the first `opened`. Its events:
````

Old:
````text
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
````
New:
````text
  - A raise whose generation is not `current` (any raise while `current` is `null` included) is dropped first, before the identity match, the replacement and the cap: nothing is minted, and `occurrences`, `nextId`, `nextSeq` and `notKept` are unchanged. It applies at every raise site: session-ended (`App.tsx:1492-1496`), canvas-ceiling (`:667`), stream-terminal (`:1892`), viewport-refusal (`:1623`), record-notice (`:879`, generation `report.dataset`), save-notice (`:2193`, generation `held.dataset`) and reopen-notice (`:1238`, generation `next.dataset`).
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
````

Old:
````text
- `opened(resource)`: ends every condition whose generation is not `resource`. It is dispatched where `admitAndResetStaleUiState` runs on a successful admission, never on a refused one.
````
New:
````text
- `opened(resource)`: sets `current` to `resource`, ends every condition whose generation is not `resource`, and resets `notKept` to 0. It is dispatched where `admitAndResetStaleUiState` runs on a successful admission (`App.tsx:1182`), never on a refused one. On a reopen, `handleAdmitted(next)` runs before the reopen notices are set (`:1221`, `:1238`), so their raise follows `opened` and carries `next.dataset`.
````

Old:
````text
- Each raise sits after the site's existing generation guard (`App.tsx:1604`, `:1620`, `:1888`, `:2404`), so a late call is still logged and dropped as today.
````
New:
````text
- Each raise sits after the site's existing generation guard (`App.tsx:1604`, `:1620`, `:1888`, `:2404`, and `endSessionForDataset`'s at `:742` for session ended), so a late call is still logged and dropped as today. The step-queue report (`:879`), the save (`:2193`) and the reopen (`:1238`) have no guard in App; the reducer's generation drop is their guard.
````

**Addition, after the row C-U7 in §4's table.** These rows extend C-U6 and C-U7, one mutation each:

````text
| C-U6a | A | **a raise under another generation is dropped:** after `opened(R)`, a raise under R′, and in a fresh state a raise before any `opened`, leave `byId`, `nextId`, `nextSeq` and `notKept` unchanged | delete the generation drop from `raise`; {C-U6a, C-U7b} |
| C-U7a | A | **`opened` resets `notKept`:** `CONDITIONS_MAX + 1` raises under R give `notKept` 1; `opened(R′)` then gives `notKept` 0 and no condition | `opened` leaves `notKept` as it was; {C-U7a} |
| C-U7b | A | **a stale raise takes no cap room:** `opened(R)`, `CONDITIONS_MAX` raises under R, then one raise under R″: `notKept` stays 0 and the 64 are unchanged | apply the generation drop after the cap check; {C-U7b} |
````

### The new or changed tests: their files, red-before reasons and mutations

Every test below is red before its fix for the reason given. Each has one mutation, named in its table row with the set that fails.

| Test | File | Red before |
|---|---|---|
| C-U3 | `src/conditions/conditions.test.ts` | `conditions.ts` is absent |
| C-U6a, C-U7a, C-U7b | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; without `current`, a stale raise mints and is counted |
| C-R1 | `src/conditions/ConditionView.test.tsx` | `ConditionView.tsx` is absent |
| C-K1 | `src/canvas/limits.test.ts` | `ceilingKindOf` is absent |
| C-A1 to C-A4 | `src/App.conditions.test.tsx` | no store, no S-3, no Problems; today App hides the viewport refusal while session ended stands (`App.tsx:2518`) |
| C-E1 | `e2e/conditions-baseline.mjs` | the suite, S-3 and Problems are absent |
| C-E2 | `e2e/conditions.mjs` | the suite, S-3 and Problems are absent |
| J-A1 | `src/App.jobs.test.tsx` | no Jobs tab |
| J-E1 | `e2e/jobs.mjs` | the suite and the Jobs tab are absent |

**Known pass cases.** I checked each mutation above against its set and found none.
- C-U3's mutation fails C-A1: the record notice (view target) raised after the viewport refusal (view target) would end it.
- C-U6a's mutation fails C-U7b: without the drop, the stale raise at the cap counts.
- J-A1 asserts the status both changes and matches the owner's statement, so a mutation that leaves the status standing cannot pass.

### The gate's notes

- **C-U3 and the C-U1 mutation.**

Old:
````text
| C-U3 | A | **a newer raise never ends an older blocker:** refusal A, refusal B, a notice, then session ended; all four stand, and the top goes from A to session ended | a raise ends earlier conditions of its target; {C-U3, C-A1} |
````
New:
````text
| C-U3 | A | **a newer raise never ends an older blocker:** refusal A, refusal B, a notice, then session ended; refusals A and B are both raised on the stream-terminal route, with the same view and generation and different codes, so that C-U1's mutation fails here; all four stand, and the top goes from A to session ended | a raise ends earlier conditions of its target; {C-U3, C-A1} |
````

- **The baseline post-check route is declared unchanged.**
  - There, a session-ended terminal calls `endSession` and then `opts.onTerminal` (`frontends/shell/src/streaming/viewportStreamManager.ts:338-367`).
  - So it raises session-ended and a stream-terminal condition with the same code, as today's banner already stands beside session ended.
  - C-E1's count names it.

  **Addition, at the end of §5's "Declared unchanged" list:**

````text
- the baseline post-check route (`streaming/viewportStreamManager.ts:338-367`): a session-ended terminal raises session-ended and a stream-terminal condition, as the banner stands beside session ended today.
````

- **C-A3, reopen notices.** C-A3 asserts them, as in its New row above.
- **C-R1, the alert role per place.**

Old:
````text
| C-R1 | A | **no remedy invented:** per route, ConditionView renders App's moved markup exactly; its buttons are exactly the owner's Dismiss; S-5 is the only added text | add a Reopen button to session ended; {C-R1} |
````
New:
````text
| C-R1 | A | **no remedy invented:** per route, ConditionView renders App's moved markup exactly; its buttons are exactly the owner's Dismiss; S-5 is the only added text; per place, the element in the strip carries `role="alert"`, and no Problems row, the `problem-row-top` row included, carries it | add a Reopen button to session ended; {C-R1} |
````

- **One re-sweep and one closing amendment per PR.**

Old:
````text
- **One re-sweep amendment** (0.3) before each PR's code.
````
New:
````text
- **One re-sweep amendment** (0.3) before each PR's code, and **one closing amendment** per PR, each naming its own PR.
````

### D-a to D-g, adopted in the gate's words

D-a:
````text
- All are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`).
````
````text
- `canvasRefusal`, `viewportRefusal` and `sessionEnded` are cleared by `admitAndResetStaleUiState` (`App.tsx:251-262`). The record, save and reopen notices are not cleared there: each carries its dataset and is shown only while that dataset is the open one (`:921-923`).
````

D-b:
````text
  - `:1194-1196` and `:1492-1496` (session ended).
````
````text
  - `:1492-1496` (session ended). `:1194-1196` is the reset's adapter, which only sets it to null: a clear site.
````
````text
| session-ended | `:1492-1496`, `:1194-1196` | session | `refusal.code` | resource | 1 | next-open |
````
````text
| session-ended | `:1492-1496` | session | `refusal.code` | resource | 1 | next-open |
````
````text
`sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its two set sites also raise.
````
````text
`sessionEnded` stays a state, because the hover latch, the table and the watcher read it. Its one set site (`:1492-1496`) also raises; its clear at `:1194-1196` runs where `opened` is dispatched.
````

D-c:
````text
The open-during-export ask calls `run.cancel()` (`:1299-1305`).
````
````text
The open-during-export ask (`:1299-1305`) calls `run.cancel()` (`:1313`).
````
````text
  - The ask's call (`:1299-1305`) is unchanged.
````
````text
  - The ask's call (`:1313`) is unchanged.
````

D-d:
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet` ends its session after a write and a pan, as `source-changed.mjs` does with the 100k copy (`:770`). | C-E1, step 4 |
````
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan. This is a new mechanism: `source-changed.mjs` copies its 100k fixture (`:770`) and changes the source by repointing a junction, not by a write (`:33-39`). | C-E1, step 4 |
````

D-e:
````text
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12).
````
````text
- `surfaceRegistry.ts`: the statement of `layout.selectActivityTab` names the new tab (S-12), and the statements of `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal` (`:234-236`, `:243-244`), which name the removed setters, name the store's `dismiss(id)` instead (S-13, a P6 draft).
````

**Addition, after the row S-12 in §2.7's table:**

````text
| S-13 | the `canvas.dismissCanvasRefusal` and `canvas.dismissViewportRefusal` statements, naming the store's `dismiss(id)` in place of the removed setters | `surfaceRegistry.ts:234-236`, `:243-244` |
````

Old:
````text
  - 6. P6 sight of S-1 to S-12.
````
New:
````text
  - 6. P6 sight of S-1 to S-13.
````

D-f:
````text
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`.
````
````text
- the dismiss sweeps at `e2e/console.mjs:1041`, `e2e/admission-remediation.mjs:856` and `e2e/regression.mjs:2671`;
- also `e2e/project.mjs:274`, `e2e/reopen.mjs:295`, `e2e/refusal-contract-baseline.mjs:377-382` and `:623`, and `e2e/residency-harness.mjs:829` and `:2754` (found at the form gate; the 0.3 re-sweep's list is the complete one).
````

D-g:
````text
  - the diff `origin/main...HEAD`;
````
````text
  - the diff from the recorded base to HEAD (ADV-2026-11-23-15 item 4), not `origin/main...HEAD`;
````

### For the advisor, not adopted (P6 drafts and a note)

- **D-h, S-7.** The gate's draft is `[P6 placeholder] No map loading or export is running.`, replacing `[P6 placeholder] Nothing is running.` Its reason: an open, a save or a reopen can run while Jobs is shown.
- **D-i, S-5.** The gate's draft defines `{n}` as `occurrences − 1`.
- **The gate's note on plan §9 and the cap:** whether `CONDITIONS_MAX` with `notKept` is declared as a bound under §9.

None of these is ruled here.

### Scope (class 9) and §7

The scope additions below are declared before any code. All are in PR A:
- `frontends/shell/e2e/conditions-baseline.mjs`, new: C-E1 in its baseline-pinned process. About 460 lines.
- `frontends/shell/src/canvas/limits.ts`: `ceilingKindOf`. About 10 lines.
- `frontends/shell/src/canvas/limits.test.ts`: C-K1. About 25 lines.
- `frontends/shell/package.json`: a second script line, `e2e:conditions-baseline`. 1 line.

`e2e/conditions.mjs` now carries C-E2 in place of C-E1, at about 420 lines. `WorkingCanvas.tsx` calls `ceilingKindOf` within its 12 lines.

Old:
````text
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`, under OPEN-2 (a) only;
````
New:
````text
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`, under OPEN-2 (a) only, and `frontends/shell/src/canvas/limits.ts` for `ceilingKindOf` (class 9, Amendment 2);
````

Old:
````text
  - `frontends/shell/src/layout/StudioLayout.test.tsx`;
````
New:
````text
  - `frontends/shell/src/layout/StudioLayout.test.tsx`;
  - `frontends/shell/src/canvas/limits.test.ts` (C-K1; class 9, Amendment 2);
````

Old:
````text
  - `frontends/shell/e2e/conditions.mjs`, new;
````
New:
````text
  - `frontends/shell/e2e/conditions.mjs`, new (C-E2, the shipped arm), and `frontends/shell/e2e/conditions-baseline.mjs`, new (C-E1, its own baseline-pinned process; class 9, Amendment 2);
````

Old:
````text
  - `frontends/shell/package.json`, one script line.
````
New:
````text
  - `frontends/shell/package.json`, two script lines (Amendment 2).
````

**§7 is not edited.** Its ceilings do not all hold under this amendment. These overruns are predicted:
- package.json: 2 against 1;
- A-E: about 960 against 620;
- App.conditions: about 560 against 480, from C-A1's and C-A3's harness lines;
- PR A's total: about 3,550 against 3,094.

Each overrun is recorded as class 8 at the count, in PR A's closing amendment. A-P's and A-T's other files, and PR B's groups, are predicted to hold. B-P's App 150 is the exception the gate named.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**What I could not settle:**
1. **Seam 8, item 3: the gap is disclosed, not closed.** No ordinary step or e2e hook makes the candidate first look or Colour-by refill return a non-session-ended refusal on demand, so a viewport refusal that is not suppressed is proven on the shipped arm in the real App only (C-A1, C-A3). The next gate attempt should rule whether that is enough.
2. **The kind at the producer.** C-K1 proves `ceilingKindOf`, but nothing tells the catch's call to it (`WorkingCanvas.tsx:1538-1540`) apart from a constant `"vertex-ceiling"` at the call site. C-E1 reaches only the vertex ceiling, and I could not confirm that the pick ceiling can be reached in the real app.
3. **Unmeasured predictions.** H6 (the Jobs row stands long enough to be clicked after a pan on candidate) and H7 (a write and a pan end the session on candidate with no viewport or stream-terminal condition) have not been run. If either is wrong, that is class 2 and a stop.
4. **C-E1's count has two declared outcomes.** Which route ends the baseline session after a write and a pan (the watcher's event, the pre-check, or the post-check) is not deterministic, so S-3 may read 1 or 2. The second is allowed only on the post-check route's own log line.
5. **C-A3's owner-clear step uses the Colour-by refill.** On candidate that is the only resolved viewport outcome after a refused first look. Its harness lines are part of the App.conditions overrun prediction.
6. **Line estimates are mine, not counted.** I did not re-check the gate's note on extending item 4 to the re-link's in-progress branch; it stays with the advisor.
7. **The reuse index.** As your message says, the form already records both misses, so the amendment adds no reuse line.

Files read (all in `C:/dev/wt/read-1123b`):
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`
- the gate report (scratchpad copy)
- `frontends/shell/e2e/refusal-contract-baseline.mjs`, `source-changed.mjs` and `project.mjs`
- `frontends/shell/src/App.tsx`
- `frontends/shell/src/residency/residencyArm.ts`, `candidateArmSession.ts` and `residencyStatus.ts`
- `frontends/shell/src/canvas/WorkingCanvas.tsx`
- `frontends/shell/src/App.streamFailure.test.tsx` and `App.recording.test.tsx`
- `frontends/shell/src/skp/events.ts`
- `frontends/shell/src/streaming/liveTicketSet.ts`
- `frontends/shell/src/project/saveProject.ts`
- `frontends/shell/MANUAL-WALKTHROUGH.md` (Part D)
- `frontends/shell/package.json`

Model: Opus 5.5.
