*Filed by the custodian: the architect's draft of Amendment 4 to `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`, after the architect's form gate, attempt 2 (FAIL; `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-2.md`, gate-log row 870) and the advisor's ruling ADV-2026-11-23-17 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-17-milestone-5-open-items-as-recommended-the-cap-if-urgency-1-is-always-kept-pieces-that-share-a-file.md`), node:shell-migration-milestone-5@amendment-4-architect-draft, dispatched at 2026-11-23T16:25:39Z. Its run: Read 28, Grep 9, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:25:39Z to 2026-11-23T16:36:25Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 28763 bytes, sha256 df2e361f56759b5c835e634dcefb23ee02a33871ba377ec9967796444230a1eb, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 5 follows it.*

---

Result: I drafted Amendment 4. It records ADV-2026-11-23-17's rulings, keeps the urgency-1 condition at the cap by holding one place for it, adopts the gate's E-2 (i) and (ii), D-1 to D-4 and N-1 and N-3 to N-6, and fixes one Correctness defect I found in the reducer: a save that gives several notices keeps only its last, and a save that answers `[]` clears nothing.

---AMENDMENT 4---
## Amendment 4 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 2 (FAIL), and ADV-2026-11-23-17: E-2, the documentation findings, the cap and the rulings

*Written after the outcome of the architect's form gate, attempt 2 (FAIL), and the advisor's ruling ADV-2026-11-23-17 were seen. The gate report is `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-2.md`, cited by finding id. The ruling is cited by id and item. This amendment is written before any code. Every `path:line` in it is read at caea224a6cb081edc4577e978e408692c0c1172c. The custodian adds the span hashes by script.*

### R. The rulings (ADV-2026-11-23-17)

- **Ruled:** OPEN-1 (D) (item 1); OPEN-2 (a) (item 2); OPEN-3 (a), oldest first (item 3); OPEN-4 (a) (item 4); OPEN-5 (a) (item 5); OPEN-6 (a) (item 6); OPEN-7 (a) (item 7). I7 no longer stops their code.
- **Urgency classes confirmed** (item 3): 1, the session has ended; 2, refusals; 3, notices. These are §2.2's `Urgency` values as drafted.
- **OPEN-8 and the strings** (item 8): S-1 to S-13 and KL-A to KL-E stay drafts and are built under the placeholder mark. The advisor words them from the filed text after the form's gate has passed and before each PR's words commit. Operator step 6 stays.
- **Item 9.** These change the drafts. They do not rule them:

Old:
````text
| S-7 | `[P6 placeholder] Nothing is running.` | JobsTab, empty |
````
New:
````text
| S-7 | `[P6 placeholder] No map loading or export is running.` | JobsTab, empty |
````

Old:
````text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1` |
````
New:
````text
| S-5 | `[P6 placeholder] Raised again {n} times. The latest:` | ConditionView, when `occurrences > 1`; `{n}` is `occurrences − 1` (ADV-2026-11-23-17 item 9) |
````

### A4-1. A save's notices are one batch (Correctness, found while drafting)

- **The defect.** In §2.2 every raise on a `replaced-by-owner` route ends that route's conditions before it mints. So in a two-notice save (`SAVED_NOTICE`, then `MARK_WITHHELD_NOTICE`: `src/project/saveProject.ts:115-117`), the raise of ordinal 1 ends ordinal 0. A save that answers `[]` (`saveProject.ts:110`) raises nothing, so the old notices stand. Today App replaces the whole list at `App.tsx:2193`, `[]` included.
- **The fix.** The owner's report is one event.

Old:
````text
  - A route declaring `replaced-by-owner` ends that route's conditions for the same target and generation before it mints.
````
New:
````text
  - A route declaring `replaced-by-owner` is never raised by `raise`. Its owner's report is one `replaceBatch(route, target, generation, displays)` event. If its generation is not `current`, it is dropped whole. Otherwise it ends that route's unresolved conditions for the same target and generation, once, and then raises each display in order through `raise`'s own path, the cap included, with `ordinal` its position for save-notice and `null` for record-notice. No condition of a batch ends another. An empty batch ends the old ones and mints nothing, as a save that answers `[]` (`src/project/saveProject.ts:110`) clears today's notices (`App.tsx:2193`). App's record-notice site (`:879`) and save site (`:2193`) dispatch it.
````

### Item 10. The cap

**The rule.** One place is held for urgency 1. It is not outside the count, because the store would then keep 65 conditions, and §7's bound ("the unresolved conditions kept per open", 64) would be untrue. Nothing kept leaves for a newer raise. Pushing out an urgency-2 condition would break §1's "a newer raise never ends an older refusal or blocker" and §8 item 4.

Old:
````text
  - A raise whose generation is not `current` (any raise while `current` is `null` included) is dropped first, before the identity match, the replacement and the cap: nothing is minted, and `occurrences`, `nextId`, `nextSeq` and `notKept` are unchanged. It applies at every raise site: session-ended (`App.tsx:1492-1496`), canvas-ceiling (`:667`), stream-terminal (`:1892`), viewport-refusal (`:1623`), record-notice (`:879`, generation `report.dataset`), save-notice (`:2193`, generation `held.dataset`) and reopen-notice (`:1238`, generation `next.dataset`).
  - A raise past `CONDITIONS_MAX` adds one to `notKept`. The oldest are kept.
````
New:
````text
  - A raise whose generation is not `current` (any raise while `current` is `null` included) is dropped first, before the identity match, the replacement and the cap: nothing is minted, and `occurrences`, `nextId`, `nextSeq` and `notKept` are unchanged. It applies at every raise site: session-ended (`App.tsx:1492-1496`), canvas-ceiling (`:667`), stream-terminal (`:1892`), viewport-refusal (`:1623`), record-notice (`:879`, generation `report.dataset`), save-notice (`:2193`, generation `held.dataset`) and reopen-notice (`:1238`, generation `next.dataset`).
  - **The cap** (ADV-2026-11-23-17 item 10). At most `CONDITIONS_MAX − 1` conditions of urgency 2 and 3 are kept for one open, and one place is held for urgency 1. A raise of urgency 2 or 3 that finds those places full is not kept and adds one to `notKept`. Nothing kept leaves for it, so the oldest are kept. A raise of urgency 1 under `current` is always kept. App raises urgency 1 at most once per open: the session-ended raise is made inside `endSession`'s `setSessionEnded` adapter (`App.tsx:1492-1496`), which `handleSessionEnded` reaches only past its latch (`:717`, with `isAlreadyEnded` at `:1491`; `App.test.ts:1201`). So the store keeps at most `CONDITIONS_MAX` for one open, as §7 declares.
````

**Why the strip's top stays the most urgent at the cap:**
1. Urgency 1 is always kept, and `ordered` sorts by urgency first. So a standing session-ended condition is the top. C-U7c asserts this.
2. The cap never removes a kept condition. A raise that is not kept is newer than every kept condition. So under OPEN-3 (a) it would not be the top while any kept condition of its urgency, or a more urgent one, stands. C-U7 asserts that the top at the cap is the first raise.
3. One open holds at most 13 notices at once:
   - 1 record notice, replaced by its owner (`App.tsx:879`);
   - 4 from a save (`saveProject.ts:115-121`);
   - 8 from a reopen (`src/project/openProject.ts:135-142`, with `lineagePlaces` giving at most 4, `:104-111`).
   So when the 63 places are full, at least 50 of them hold refusals, and a refusal that is not kept never outranks the top.
4. One case is left. If the operator dismisses every kept refusal while one that was not kept would still stand, the strip shows a notice or nothing. S-6's count stays until the next open, and KL-E says so.

The claim this changes:

Old:
````text
- Problems keeps every unresolved condition of the open on the map;
````
New:
````text
- Problems keeps the unresolved conditions of the open on the map, at most `CONDITIONS_MAX` (64) for one open with the session-ended condition always among them, and shows how many it did not keep (ADV-2026-11-23-17 item 10);
````

Old:
````text
5. An owner element twice in the DOM, or a condition with no place an operator can reach.
````
New:
````text
5. An owner element twice in the DOM, or a kept condition with no place an operator can reach. A raise past the cap is not kept, and S-6 counts it (ADV-2026-11-23-17 item 10).
````

**The tests.** D-1's words are adopted here, with item 10's counts. The words that are item 10's are the route and the counts.

Old:
````text
| C-U7 | A | `CONDITIONS_MAX + 1` raises: the oldest 64 are kept and `notKept` is 1 | drop the oldest; {C-U7} |
````
New:
````text
| C-U7 | A | after `opened(R)`, `CONDITIONS_MAX` raises under R, each with its own key on the stream-terminal route: the oldest `CONDITIONS_MAX − 1` are kept, `notKept` is 1, and `attentionOf(ordered(…))`'s top is the first raise | drop the oldest; {C-U7} |
````

Old:
````text
**`opened` resets `notKept`:** `CONDITIONS_MAX + 1` raises under R give `notKept` 1;
````
New:
````text
**`opened` resets `notKept`:** after `opened(R)`, `CONDITIONS_MAX` raises under R, each with its own key on the stream-terminal route, give `notKept` 1;
````

Old:
````text
| C-U7b | A | **a stale raise takes no cap room:** `opened(R)`, `CONDITIONS_MAX` raises under R, then one raise under R″: `notKept` stays 0 and the 64 are unchanged | apply the generation drop after the cap check; {C-U7b} |
````
New:
````text
| C-U7b | A | **a stale raise takes no cap room:** `opened(R)`, `CONDITIONS_MAX − 1` raises under R, each with its own key on the stream-terminal route, then one stream-terminal raise under R″: `notKept` stays 0 and the `CONDITIONS_MAX − 1` are unchanged | apply the generation drop after the cap check; {C-U7b} |
````

**Addition, after the row C-U7b in §4's table:**

````text
| C-U7c | A | **urgency 1 is always kept, in the held place:** after `opened(R)`, `CONDITIONS_MAX` stream-terminal raises under R, each with its own key (`CONDITIONS_MAX − 1` kept, `notKept` 1), then a session-ended raise under R: it is kept, the kept count is `CONDITIONS_MAX`, `notKept` stays 1, and `attentionOf(ordered(…))` gives it as the top with `others` = `CONDITIONS_MAX − 1` | an urgency-1 raise is kept only while fewer than `CONDITIONS_MAX − 1` conditions are kept, as urgency 2 and 3 are; {C-U7c} |
| C-U8 | A | **a notice batch is replaced whole:** after `opened(R)`, a viewport-refusal raise under R; `replaceBatch(save-notice, resource, R, [a, b])` gives two save-notice conditions with ordinals 0 and 1, both standing; `replaceBatch(save-notice, resource, R, [])` ends both and mints none; the viewport-refusal condition stands throughout | end the route's conditions before each display, not once per batch; {C-U8} |
````

**The KNOWN-LIMITATIONS draft for the bound** (P6, for the advisor; its number is the re-sweep's). Addition, after the line `- KL-D: …` in §9a's KNOWN-LIMITATIONS drafts:

````text
- KL-E: Problems keeps at most 64 problems for one open. Past that, a new refusal or notice is not kept, and Problems says how many were not kept; one that was not kept does not come back when others are dismissed. An ended session is always kept, and the attention strip shows it first. The count starts again at the next open.
````

The gate's KL-D note (every successful open empties Problems) as a changed draft:

Old:
````text
- KL-D: Problems is emptied when another dataset is opened. Nothing is kept.
````
New:
````text
- KL-D: Problems is emptied at every successful open, a reopen of the same file included; it then lists only what that open raises. Nothing is kept from before.
````

### E-2. Both (i) and (ii) are adopted

(i) C-E1's count becomes biconditional, in the gate's words:

Old:
````text
write and pan, and the top is session ended with S-3 at 1 and both rows standing, or S-3 at 2 only when the session log holds a `stream-terminal-failure` line whose detail opens with `engine.source_changed` (`App.tsx:1887`), the extra row being that stream-terminal condition; any other count fails;
````
New:
````text
write and pan, and the top is session ended; S-3 is at 1, with both rows standing, exactly when the session log from the write on holds no `stream-terminal-failure` line whose text after `— ` opens with `engine.source_changed` (`App.tsx:1887`), and S-3 is at 2, the extra row being that stream-terminal condition, exactly when it holds one; any other pairing fails;
````

(ii) C-A5 is adopted as the gate recommends. The other way is not taken, because a deterministic route exists:
- App constructs the baseline manager with `makeManagerCallbacks`'s `onTerminal` (`App.tsx:1863-1921`, `:601-632`).
- The harness already mocks that class (`App.streamFailure.test.tsx:95-104`).

**Addition, after the row C-A4 in §4's table:**

````text
| C-A5 | A | **the stream-terminal raise, from the real App on the pinned baseline arm:** in its own `describe` of `App.conditions.test.tsx`, whose `beforeEach` runs `__resetResidencyArmForTests()` and `setResidencyArm("baseline")` before the first `openPath` (`canvas/WorkingCanvas.wiring.test.tsx:84-85`) and whose `afterEach` resets the arm; the mocked `ViewportStreamManager` keeps the options App constructs it with (`App.tsx:1863-1921`); calling their `onTerminal(streamHandle, {kind: "ProducerFailed", detail})`, `detail` opening with a typed code, gives one stream-terminal condition: the strip's top is a `.canvas-refusal` holding App's `stream ProducerFailed: ` line (`:1892`), S-3 is absent, and Problems has one entry | App does not raise at `:1892`; {C-A5} |
````

Old:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App on the shipped candidate arm, whose baseline `ViewportStreamManager` is a stub that captures no callbacks, with the canvas stand-in capturing `WorkingCanvasProps`). No App test reaches `App.tsx:667` from the canvas or `:1892`.
````
New:
````text
The test harness: `frontends/shell/src/App.streamFailure.test.tsx:4-11` (the real App on the shipped candidate arm, with the canvas stand-in capturing `WorkingCanvasProps`). In `App.conditions.test.tsx` the baseline `ViewportStreamManager` stub also keeps its constructor options, for C-A5 only; it is the module the harness already mocks. No App test reaches `App.tsx:667` from the canvas. C-A5 reaches `:1892` in its own baseline-pinned `describe`.
````

**Addition, after the line `  - C-E1, H2, H3 and §3 row 1.` in Amendment 2's E-1.0 arm map:**

````text
  - C-A5, the real App in its own `describe`, whose `beforeEach` pins the arm and whose `afterEach` resets it.
````

Old:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. On the shipped candidate arm it is proven from the real App by C-A1, C-A3 and C-A4, and in the real app by C-E2. The baseline-only routes are proven in the real app by C-E1, in its own baseline-pinned process. A viewport refusal that is not suppressed is proven on the shipped arm in the real App only (Amendment 2, E-1 item 3).
````
New:
````text
1. Seam 8: App's raise sites to ConditionView, ProblemsTab and the strip. On the shipped candidate arm it is proven from the real App by C-A1, C-A3 and C-A4, and in the real app by C-E2. The canvas-ceiling route is proven in the real app by C-E1, in its own baseline-pinned process. The stream-terminal route is proven from the real App on the pinned baseline arm by C-A5, and in the real app by C-E1 only on a run that takes the post-check route, which C-E1's count tells apart. A viewport refusal that is not suppressed is proven on the shipped arm in the real App only (Amendment 2, E-1 item 3).
````

### D-1 to D-4, adopted in the gate's words

Each Old below occurs once in the form. D-1's C-U7 and C-U7a pairs are given under item 10, with its counts.

D-1:
````text
**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5.
````
````text
**What may be mocked:** the App tests mock only what `App.streamFailure.test.tsx:4-11` mocks. Mocking `conditionsReducer`, `ConditionView` or `jobsFrom` is I5. Every C-U case that raises dispatches `opened(R)` before its first raise, except C-U6a's fresh-state case (Amendment 2, C-1).
````

D-2:
````text
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E1.
````
````text
3. StudioLayout's `attention.top` slot and `attentionOthers`: C-R3, then C-E2 on the shipped candidate arm and C-E1 in its baseline-pinned process.
````
````text
| select Console; {C-R3, C-E1} |
````
````text
| select Console; {C-R3, C-E1, C-E2} |
````

D-3:
````text
The scope additions below are declared before any code. All are in PR A:
````
````text
Scope addition (class 9) on the seam rule (round 4, item 1), as the architect's form gate, attempt 1, E-1 applied it. The additions below are declared before any code. Declared unchanged for them (§5): `limits.ts`'s existing exports and every existing case in `limits.test.ts`; I1 to I8 invalidate them as they do the rest. All are in PR A:
````
````text
  - every e2e suite at the base plus the new one, by the suites' own launch;
````
````text
  - every e2e suite at the base plus the new ones (`conditions.mjs` and `conditions-baseline.mjs` for PR A, `jobs.mjs` for PR B), by the suites' own launch;
````

D-4:
````text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build.
````
````text
  - 0a (A). In a dev build, before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`; it resolves `{ok:true}` (Part D's D0). Steps 1 to 3 show the baseline arm, which no operator reaches in the shipped build. In step 2 the strip may show "2 more", and Problems a stream-terminal row, when the session ended on the post-check route (C-E1); in step 3 every row is then gone.
````
````text
Open a copy of the 100k fixture and save the project; the strip shows the save notice.
````
````text
Open a copy of the 100k fixture and save the project into a new folder that does not hold the copy; the strip shows the save notice.
````

### N-1 to N-6

- **N-1: adopted now, as C-K2.** Without it, a constant `"vertex-ceiling"` at `WorkingCanvas.tsx:1540` passes every test. OPEN-2 (a)'s producer then has no proof. A test file of its own is class 9 and must be declared before code.

  **Addition, after the row C-K1 in §4's table:**

````text
| C-K2 | A | **the producer passes the class's kind:** the real `WorkingCanvas` in `canvas/WorkingCanvas.wiring.test.tsx` (baseline pinned, `:84-85`); the file's `./limits` mock passes every call through to the original unless armed, and once armed its next `checkPickCeiling` call throws `new PickCeilingExceeded(n)` or `new ResidentVertexCeilingExceeded(n)` of the original module, reaching the catch at `WorkingCanvas.tsx:1538` from `ResidentSet.addBatch` (`residentSet.ts:73`); a `pushBatch` of a committed batch fixture then calls `onCanvasRefusal` with `"pick-ceiling"` and with `"vertex-ceiling"` respectively | WorkingCanvas passes `"vertex-ceiling"` at `:1540` for both classes; {C-K2} |
````

- **N-2: left to PR B's re-sweep and gates.** J-E1 is PR B's test, and PR B's base comes after PR A. If H6 is wrong, that is class 2 and a stop. The re-sweep can re-aim J-E1 at a FilterPanel Apply of the slow predicate.
- **N-3: adopted now.** The write is named as the mechanism `e2e/source-watch-idle.mjs:446-458` uses. In C-E1, C-E2 and §3's rows, "a write" means that touch.

Old:
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan. This is a new mechanism: `source-changed.mjs` copies its 100k fixture (`:770`) and changes the source by repointing a junction, not by a write (`:33-39`). | C-E1, step 4 |
````
New:
````text
| H2 | A scratch copy of `over-ceiling-refused.parquet`, opened on the pinned baseline arm, ends its session after a write to the copy and a pan; the write is an mtime touch of the copy with its sha256 unchanged, as `e2e/source-watch-idle.mjs:446-458` does on the shipped arm. | C-E1, step 4 |
````

Old:
````text
| H7 | On the shipped candidate arm, a write to the opened 100k copy and a pan end the session, and raise neither a viewport-refusal nor a stream-terminal condition. | C-E2, the write step |
````
New:
````text
| H7 | On the shipped candidate arm, a write to the opened 100k copy (an mtime touch with its sha256 unchanged, as `e2e/source-watch-idle.mjs:446-458`) and a pan end the session, and raise neither a viewport-refusal nor a stream-terminal condition. | C-E2, the write step |
````

- **N-4: adopted now.** The later counts assume exactly one notice. A different count is a wrong prediction, class 2.

Old:
````text
the save notices include the owner's `SAVED_NOTICE`
````
New:
````text
the save notices are exactly `[SAVED_NOTICE]`, the owner's constant
````

- **N-5: adopted now.** C-A3's reopens need a client call that the transport mock does not answer today (`App.streamFailure.test.tsx:57-81`).

Old:
````text
The transport mock gains `recordStep`, and the events mock keeps its handler. Both modules are already mocked by the harness, so no new module is mocked (I5).
````
New:
````text
The transport mock gains `recordStep` and `openProject` (`src/skp/client.ts:145`, `:165`), and every other client call a reopen makes at PR A's base, which the re-sweep lists. C-A3's reopens go through the `e2eOpenProjectFolder` hook (`src/admission/AdmissionPanel.tsx:448-450`): the successful one is answered with an `OpenProjectResponse` whose reply gives at least one notice through `reopenApply` (`src/project/openProject.ts:132-144`), and the refused one with a `SkpCallError`. The events mock keeps its handler. Both modules are already mocked by the harness, so no new module is mocked (I5).
````

- **N-6: adopted now, in one line.** Addition, after D-3's new suites line (`  - every e2e suite at the base plus the new ones …, by the suites' own launch;`):

````text
    - `conditions.mjs` and `jobs.mjs` are never attached to an app another suite left pinned; attached so, their arm readback fails the run loudly.
````

- **N-7** is the custodian's.

### Item 11. The base

Old:
````text
So, by ADV-2026-11-23-15 item 4, PR A is built on the re-link's branch, which carries the heads of PR 353, PR 358 and PR 359. PR B is built on PR A.
````
New:
````text
So, by ADV-2026-11-23-15 item 4, as ADV-2026-11-23-17 item 11 confirms, PR A is built on the re-link's branch, `cut/relink-after-refusal`, which carries the heads of PR 353, PR 358 and PR 359. PR B is built on PR A. Neither merges before a piece it is built on.
````

### The new or changed tests: their files, red-before reasons and mutations

| Test | File | Red before | Mutation; set that fails |
|---|---|---|---|
| C-U5 (D-1) | `src/conditions/conditions.test.ts` | `conditions.ts` is absent | key on the display text; {C-U5, C-A2} |
| C-U7 | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; as §2.2 drafted the cap, 64 urgency-2 conditions are kept, not 63 | drop the oldest; {C-U7} |
| C-U7a | `src/conditions/conditions.test.ts` | `conditions.ts` is absent | `opened` leaves `notKept` as it was; {C-U7a} |
| C-U7b | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; without `current`, a stale raise mints and is counted | apply the generation drop after the cap check; {C-U7b} |
| C-U7c | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; as drafted, a session-ended raise at the cap is not kept | an urgency-1 raise is kept only while fewer than `CONDITIONS_MAX − 1` are kept; {C-U7c} |
| C-U8 | `src/conditions/conditions.test.ts` | `conditions.ts` is absent; as drafted, a two-notice batch keeps one, and `[]` ends none | end the route's conditions before each display; {C-U8} |
| C-K2 | `src/canvas/WorkingCanvas.wiring.test.tsx` | `onCanvasRefusal` has no kind argument (`WorkingCanvas.tsx:1540`) | a constant `"vertex-ceiling"` at `:1540`; {C-K2} |
| C-R3 (D-2) | `src/layout/StudioLayout.test.tsx` | no S-3 button | select Console; {C-R3, C-E1, C-E2} |
| C-A3 (N-5) | `src/App.conditions.test.tsx` | no store; the transport mock answers no reopen | clear on a refused admission; {C-A3} |
| C-A5 | `src/App.conditions.test.tsx` | no store; today no App test reaches `App.tsx:1892` | App does not raise at `:1892`; {C-A5} |
| C-E1 (E-2 (i)) | `e2e/conditions-baseline.mjs` | the suite, S-3 and Problems are absent | the session-ended raise ends the other conditions; {C-E1, C-E2} |
| C-E2 (N-4) | `e2e/conditions.mjs` | the suite, S-3 and Problems are absent | the session-ended raise ends the other conditions; {C-E1, C-E2} |

**Known pass cases.** I checked each mutation above against its set and found none:
- **C-U7b.** With all `CONDITIONS_MAX − 1` places full, a stale urgency-2 raise checked against the cap first is counted, so `notKept` becomes 1.
- **C-U7c.** The mutation's threshold is the places for urgency 2 and 3, not the total, so the session-ended raise at 63 kept is refused.
- **C-U8.** It uses a two-display batch. A one-display batch would pass the mutation.
- **C-K2.** It asserts the pick class, which a constant cannot give.
- **C-U3.** Amendment 2 says C-U3's mutation fails C-A1. That still holds, because `replaceBatch` raises through `raise`'s path.

### Scope (class 9) and §7

Scope addition (class 9) on the seam rule (round 4, item 1), as the architect's form gate, attempt 2, N-1 applied it.
- It is declared before any code.
- Declared unchanged for it (§5): every existing case in `WorkingCanvas.wiring.test.tsx`, run with its `./limits` mock passing every call through. I1 to I8 invalidate it as they do the rest.
- It is in PR A: `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`, C-K2, about 45 lines.

**Addition, after the line `  - `frontends/shell/src/canvas/limits.test.ts` (C-K1; class 9, Amendment 2);` in §2.6's PR A Tests list:**

````text
  - `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` (C-K2; class 9, Amendment 4);
````

**§7 is not edited.** These overruns are predicted. Each is recorded as class 8 at the count, in PR A's closing amendment (ADV-2026-11-23-17 item 12):
- App.conditions: about 630 against 480 (Amendment 2's 560, C-A5 about 45, N-5 about 25);
- conditions.test: C-U7c and C-U8 add about 50 lines against 450;
- A-T: `WorkingCanvas.wiring.test.tsx` has no ceiling of its own, so all of its about 45 lines are over;
- PR A's total: about 3,730 against 3,094. That is Amendment 2's 3,550 plus about 180: C-A5 45, N-5 25, C-U7c and C-U8 50, `replaceBatch` 15, C-K2 45.

`conditions.ts` (280) is predicted to hold. PR B's groups are unchanged. If a build gate finds PR A too large to read as one, the split goes to the advisor (item 12).

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

**What I could not settle**
1. **The once-per-open latch has no store-level App test.** The 64 bound depends on App raising urgency 1 at most once per open. The proof is the latch test that already exists (`App.test.ts:1201`) and the raise being placed inside the adapter, which the reviewer reads in the diff. I did not draft a C-A test that ends a session twice. I could not show that a second end-of-session route in the harness reaches `endSession`, because the candidate manager's `notifySessionEnded` may stop the second call itself, and then the mutation would pass.
2. **The one top-of-strip case left over.** If the operator dismisses every kept refusal while a refusal that was not kept would still stand, the strip shows something less urgent. I disclosed this in KL-E rather than adding a code path, since no product caller reaches it. The bound of 13 notices is read from the owners' code at caea224a and moves if those owners change.
3. **A4-1 is my own finding, not the gate's.** It is a Correctness defect in §2.2 as drafted. The next gate should check it.
4. **C-K2 assumes `ResidentSet.addBatch` is the first `checkPickCeiling` caller after the mock is armed.** I read `decodeBatch.ts` only as far as its comment at `:178`. The re-sweep should confirm the order. A second caller is `buildLayers.ts:448`, at render time.
5. **N-5's full list of reopen client calls is left to the re-sweep.** I verified only `openProject` (`client.ts:165`) and the hook (`AdmissionPanel.tsx:448-450`).
6. **"Round 4, item 1" is taken from attempt 2's D-3.** The gate resolved it. I did not.
7. **Hashes.** No span hashes are in the draft. The custodian adds them by script.

**Drafts for the advisor (none ruled)**
- S-5: `{n}` is `occurrences − 1`, from item 9. When `{n}` is 1 the line reads "Raised again 1 times", which is for the advisor's wording. Under A4-1, notice routes never reach `occurrences > 1`.
- S-6: unchanged. "the list keeps at most 64" stays true with the held place.
- S-7: the gate's draft, from item 9.
- KL-D: the changed draft above.
- KL-E: the new draft above, for the bound (item 10).
- S-1 to S-4, S-8 to S-13 and KL-A to KL-C: unchanged drafts (item 8).

Model: Opus 5.5 (claude-opus-5-5).
