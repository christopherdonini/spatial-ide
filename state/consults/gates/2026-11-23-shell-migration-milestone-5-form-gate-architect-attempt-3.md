Reviewed: main at a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201, in the detached read worktree C:/dev/wt/read-1123x (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 5, attempt 3, node:shell-migration-milestone-5@form-gate-architect-3, dispatched at 2026-11-23T17:22:55Z; its run: Read 29, Grep 21, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T17:22:59Z to 2026-11-23T17:32:54Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13145 bytes, sha256 92c51714868dadbb1c120fba24b77a99d9853eabc35b3659aea4a0f4d3f3011b, byte for byte, nothing masked, with one final newline added. FAIL on one Evidence finding, E-3 (a save's notices as one batch has no test from the real App; replacement words and a new test row C-A6 given), with D-5 to D-7 Documentation; E-2, D-1 to D-4 and N-1 to N-6 answered; item 10 met in the code's terms; A4-1 real, its store fix sound; KL-E partly untrue, for the advisor.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123x @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201

I read all cites at a12ab7e2. As the brief says, no code changed after caea224a. Every code cite in Amendment 4 holds, except where a finding below says otherwise.

## Attempt-2 findings, by id

- **E-2: answered.**
  - (i) The words at form:1356 match attempt 2's text byte for byte. The log line is `${streamHandle}: ${terminal.kind} — ${terminal.detail}` (`frontends/shell/src/App.tsx:1887`), and `makeManagerCallbacks` drops Cancelled and Completed before it (`:622-630`).
  - (ii) C-A5 (form:1366) is sound:
    - the harness mocks `ViewportStreamManager` (`App.streamFailure.test.tsx:95-104`);
    - App spreads `makeManagerCallbacks`'s `onTerminal` into the constructor options (`App.tsx:1863-1921`, `:601-632`);
    - the arm pin's shape is at `canvas/WorkingCanvas.wiring.test.tsx:84-85`.
  - Seam 1's new text (form:1390) is true.
- **D-1: answered** (form:1402, and C-U7, C-U7a and C-U7b at form:1301, 1310 and 1319). The changed counts are item 10's, and form:1293 discloses that.
- **D-2, D-3 and D-4: answered.** Each matches attempt 2's words.
- **N-1: answered by C-K2.**
  - The catch is at `WorkingCanvas.tsx:1538-1540`, and `checkPickCeiling` is called at `residentSet.ts:73`.
  - A pass-through mock of `./limits` keeps the original classes, so the `instanceof` test at `:1538` holds.
- **N-2: left to PR B, which is fine.**
- **N-3: answered.** The mtime touch with its hash check is at `e2e/source-watch-idle.mjs:446-458`.
- **N-4: answered.**
- **N-5: answered.** These cites hold: `skp/client.ts:145`, `:165`; `admission/AdmissionPanel.tsx:448-450`; `project/openProject.ts:132-144`.
- **N-6: answered.**
- **N-7: the custodian's** (Amendment 5, item 3).

## Ruling items (ADV-2026-11-23-17)

- **Items 1 to 7, 9 and 11:** recorded as ruled, and nothing ruled is changed. S-7's new draft (form:1222) matches item 9's text. The branch is `cut/relink-after-refusal` (`governance/PLAN.yaml:7818`).
- **Item 8:** recorded, but it is widened to S-13 and KL-E, which item 8 does not name. See D-7.
- **Item 10: met in the code's terms.**
  - App ends a session only through `endSession`'s adapter (`App.tsx:1492-1496`). That adapter is reached only after the latch at `:717`, which reads `sessionEndedRef` (`:1491`). The adapter sets the ref in the same call (`:1493`). A successful admission clears the ref (`:1194-1196`).
  - The only other `setSessionEnded` calls are `:720`, reached through `:743`, and the reset at `:254`/`:1196`. So App raises urgency 1 at most once per open, and 63 + 1 = 64 holds.
  - The test is C-U7c. Its mutation fails it: the session-ended raise is refused at 63 kept.
  - The KNOWN-LIMITATIONS draft is KL-E. It is not exactly true; that goes to the advisor, below.
- **Item 12:** the class-8 route is kept. The predicted total grows from the 3,550 that item 12 accepted to about 3,730, and about 30 more with E-3's row. That is for the advisor to know, not a block.

## A4-1 (the drafter's own Correctness finding)

The defect is real:
- `saveProject.ts:115-121` answers up to four notices, and `:110` answers `[]`.
- App replaces the whole list at `App.tsx:2193`, `[]` included; a `null` answer changes nothing.
- §2.2's per-raise replacement (form:228) would end ordinal 0 when ordinal 1 is raised.

The store-level fix is sound, and C-U8 kills its mutation. The App half is unproven (E-3), and the event's signature has no code (D-6).

## Correctness and Evidence findings (these block)

**E-3 (Evidence): the save site's batch has no test from the real App.** Place: the A4-1 New text (form:1245) and §2.5 seam 1.

Suppose App sends one single-notice `replaceBatch` per text at `:2193`. Then each batch ends the one before it, which brings back the defect A4-1 fixes. Every test would still pass:
- C-U8 runs only in the reducer.
- C-E2 sees exactly `[SAVED_NOTICE]` (form:1486).
- `e2e/project.mjs:381-386` (NOTICE-S18) looks only for S18. S18 is the last notice, so it stands under the defect too.

A two-notice route exists in the existing harness:
- give the canvas stand-in a `currentView`. Without it the save answers `[NO_VIEW_NOTICE]` (`saveProject.ts:101`, `App.tsx:2190`);
- add `saveProject` (`skp/client.ts:155`) to the transport mock;
- run the save through the hook at `App.tsx:1454-1462`.

The `[]` answer cannot be reached that way. The harness does not mock `skp/dialog.ts`, so `invoke` (`:30`) rejects, and the save answers a not-saved notice instead (`saveProject.ts:108`).

Fix 1, the A4-1 sentence:
```text
App's record-notice site (`:879`) and save site (`:2193`) dispatch it.
```
```text
App's record-notice site (`:879`) and save site (`:2193`) dispatch it. C-A6 proves the save site's batch from the real App. The empty batch is proven at store level only (C-U8): the harness reaches no folder picker that answers `null` without mocking `skp/dialog`, which it does not mock (I5).
```

Fix 2, a new row added after the row C-A5 in §4's table:
```text
| C-A6 | A | **a save's notices are one batch, from the real App on the shipped candidate arm:** the canvas stand-in answers `currentView` (`App.tsx:2190`); the transport mock gains `saveProject` (`src/skp/client.ts:155`), answering with `history_mark: "withheld"` and a `project_relative` that adds no notice; a save through the `e2eSaveProjectToFolder` hook (`App.tsx:1454-1462`) gives exactly `[SAVED_NOTICE, MARK_WITHHELD_NOTICE]` (`src/project/saveProject.ts:115-117`): the strip's top is the `.save-notice` holding `SAVED_NOTICE`, S-3 reads 1, and Problems' other row is the `.save-notice` holding `MARK_WITHHELD_NOTICE` | App dispatches one `replaceBatch` per notice at `:2193`; {C-A6} |
```

Fix 3, its row in the tests table:
```text
| C-A5 | `src/App.conditions.test.tsx` |
```
```text
| C-A6 | `src/App.conditions.test.tsx` | no store; as drafted, the second notice's raise ends the first | one `replaceBatch` per notice at `:2193`; {C-A6} |
| C-A5 | `src/App.conditions.test.tsx` |
```

Clause check against the code:
- Without a view the save answers one notice (`:101`).
- A withheld mark adds the second notice (`:117`).
- `afterwards` is empty at selection 0 (`:102`).
- Under the mutation, the second batch ends the first. Then the top is `MARK_WITHHELD_NOTICE` and S-3 is absent, so C-A6 fails.
- The App.conditions overrun grows by about 30 lines, recorded as class 8 at the count.

## Documentation findings (must fix before the merge; none is the human's wording, so the worker applies these words with no re-gate and the PR body lists them)

**D-5. The reasoning about the top at the cap** (form:1265 and form:1271). A dismissal frees a place, so a later raise can be kept after an earlier one was not. Item 2's premise is then untrue, and item 4 leaves out the case of a newer refusal.
```text
A raise that is not kept is newer than every kept condition.
```
```text
Until a kept condition is dismissed, a raise that is not kept is newer than every kept condition.
```
```text
If the operator dismisses every kept refusal while one that was not kept would still stand, the strip shows a notice or nothing.
```
```text
A dismissal frees a place, so a later raise can be kept while an earlier one was not. If the operator then dismisses every kept refusal older than one that was not kept, the strip shows a newer refusal, a notice or nothing where that refusal would have been the top.
```

**D-6. `replaceBatch` has no `code`.** `ConditionReason` needs a code (form:170-171). The record-notice code is `step-record-<kind>`, from `report.kind` (`App.tsx:878`). The four-argument event therefore cannot mint the code the routes table declares (form:216). Nothing a user sees depends on it, because a batch ends conditions by route, target and generation.
```text
Its owner's report is one `replaceBatch(route, target, generation, displays)` event.
```
```text
Its owner's report is one `replaceBatch(route, code, target, generation, displays)` event, `code` being the route's typed code (`step-record-<kind>` from `report.kind`, `App.tsx:878`, or `project.save_notice`).
```
```text
`replaceBatch(save-notice, resource, R, [a, b])`
```
```text
`replaceBatch(save-notice, project.save_notice, resource, R, [a, b])`
```
```text
`replaceBatch(save-notice, resource, R, [])`
```
```text
`replaceBatch(save-notice, project.save_notice, resource, R, [])`
```

**D-7. Item 8's reach** (form:1213). Item 8 names S-1 to S-12 and KL-A to KL-D only.
```text
S-1 to S-13 and KL-A to KL-E stay drafts and are built under the placeholder mark.
```
```text
S-1 to S-12 and KL-A to KL-D stay drafts and are built under the placeholder mark (item 8); this amendment holds S-13 (Amendment 2) and KL-E (below) to the same, as item 8 does not name them.
```

## New tests: red-before reason, mutation, named set, known pass cases

- C-U7, C-U7a, C-U7b, C-U7c, C-U8, C-K2, C-A3, C-A5, C-E1 and C-E2 each have a red-before reason and one mutation, and each mutation fails its named set.
- I found no known pass case beyond those the amendment lists (form:1537-1541).
- The identity match comes before the cap, by Amendment 2's order (form:1259). So a re-raise at the cap is an occurrence of the kept condition and does not count as not kept, and S-6 stays true.

## Old texts and placements

- Each Old text in Amendment 4 occurs once in the form above it. I checked by grep: form:228, 283, 345, 347, 372, 382, 385, 497, 557, 750 (the clause), 761, 813, 832, 877, 909, 913, 934-935, 960, 961, 1081, 1134 and 1158.
- Each addition names where it goes.

## Scope and §7

- The class-9 addition, `WorkingCanvas.wiring.test.tsx`, is declared before any code, with its declared-unchanged set and its PR A tests line. This meets §21a to §21c; the piece is already fully gated.
- §7 is not edited, and each overrun is recorded as class 8 at the count. The arithmetic checks: 560 + 45 + 25 = 630, and 3,550 + 180 = 3,730.

## The points the drafter could not settle

1. **The latch: for the code's gates.** It holds as shown under item 10. The reviewer reads that a session-ended raise sits only in `endSession`'s adapter.
2. **The leftover case at the top: for the advisor.** It meets item 10's "never" only for urgency 1. The case needs 63 refusals and notices with distinct keys standing at once on the product's one view (form:127). I did not count the typed codes.
3. **A4-1:** the defect is real, the store fix is sound, and E-3 and D-6 apply.
4. **C-K2's first caller: settled.**
   - `decodeBatch.ts` has only the comment at `:178`; it makes no call.
   - `buildLayers.ts:448` loops over resident batches only.
   - So on a fresh mount, the first push's first call is `residentSet.ts:73`. The re-sweep confirms this at the base.
5. **The reopen calls: for the re-sweep.** E-3 also adds `saveProject`.
6. **Round 4, item 1:** I did not re-resolve it. It is for the reviewer.
7. **The hashes:** the custodian's and the re-sweep's.

## Strings and KNOWN-LIMITATIONS drafts (to the advisor; not ruled)

- **S-5:** true. The wording "1 times" is the advisor's.
- **S-6:** true with the held place.
- **S-7:** true as far as `isScanInFlight` goes.
- **KL-D (changed):** true. `opened` ends every other generation, and every open mints a fresh handle (`App.tsx:726-731`).
- **KL-E:** partly untrue. Refusals and notices are kept only up to 63; the 64th place is held for an ended session. "Past that" therefore reads as if a 64th refusal were kept. Its other sentences are true.

## Files read (at a12ab7e2, in C:/dev/wt/read-1123x)

- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`: :100-565, :691-1581
- `state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-2.md`
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-17-milestone-5-open-items-as-recommended-the-cap-if-urgency-1-is-always-kept-pieces-that-share-a-file.md`
- `state/consults/2026-11-23-shell-migration-milestone-5-amendment-4-architect-draft.md`: :368-390
- `governance/forms/frontends/OWNER-INVALIDATION-PREREGISTRATION.md`: :1056-1059
- `governance/AUTONOMY.md` (by grep)
- `governance/PLAN.yaml` (by grep)
- `state/gate-log.json` (partial)
- `frontends/shell/src/App.tsx`: :590-770, :840-940, :1175-1255, :1450-1510, :1830-1930, :2170-2210, and by grep
- `frontends/shell/src/App.test.ts`: :1170-1228
- `frontends/shell/src/App.streamFailure.test.tsx`: :1-130, and by grep
- `frontends/shell/src/project/saveProject.ts`: :60-135, and by grep
- `frontends/shell/src/project/openProject.ts`: :95-146
- `frontends/shell/src/skp/client.ts` (by grep)
- `frontends/shell/src/skp/dialog.ts` (by grep)
- `frontends/shell/src/admission/AdmissionPanel.tsx`: :430-464
- `frontends/shell/src/canvas/WorkingCanvas.tsx`: :1505-1555
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`: :1-140
- `frontends/shell/src/canvas/buildLayers.ts`: :436-451
- `frontends/shell/src/canvas/` `limits.ts`, `residentSet.ts` and `decodeBatch.ts` (by grep)
- `frontends/shell/e2e/source-watch-idle.mjs`: :440-460
- `frontends/shell/e2e/project.mjs`: :262-291, :366-415

Model: Opus 5.5 (claude-opus-5-5).
