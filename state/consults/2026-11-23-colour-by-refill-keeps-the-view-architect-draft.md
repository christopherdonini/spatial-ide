*Filed by the custodian: the architect's draft preregistration for colour-by-refill-keeps-the-view, the camera kept when a Colour by refills the map (the human's message of 2026-11-23 item 3 (d); ADV-2026-11-23-15 item 7 (d), the first gap piece), node:colour-by-refill-keeps-the-view@architect-draft-1, dispatched at 2026-11-23T14:04:34.803Z. It read the repository at 0bcf5434 in a detached read worktree and ran nothing. Its run: Read 43, Grep 31, Glob 4, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-23T14:04:59Z to 2026-11-23T14:18:02Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 23151 bytes, sha256 a35264d84834d588283047addf76609ec69608fa55e06e66e554effba9ae4609, byte for byte, with one final newline added. Its form is filed beside it in the same commit.*

---

# Preregistration: a Colour-by refill keeps the view (`colour-by-refill-keeps-the-view`)

Proposed file: `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md`. The architect drafted this read-only at main `0bcf543452af79df6251cc7d86ab9f2cf644fcc2` (detached worktree). Every `path:line` below is at that commit unless it names another one. The architect has no shell, so the custodian computes the span hashes at filing.

**Class: full form, both gates** (ADV-2026-11-16-06 item 2 (a)). These rows of (a) apply:
- concurrency and cancellation. A refill cancels and restarts the map's stream while the camera must hold.
- what the user is told about a partial view. This piece changes item 51's sentence.
- a seam. It changes the `WorkingCanvasHandle`, `CandidateArmSession` and `issueQueryRef` interfaces that App, canvas and residency share.
- size. With its tests and the e2e it runs over 260 changed lines.

Row (b), routine code in one module, does not apply. AUTONOMY §21a also applies: a property under test changes (the refit after a refill).

**Grounds** (ADV-2026-11-18-02 item 2): concurrency.

## 0. Disclosure

0.1 **Authority.**
- The human's message of 2026-11-23, item 3 (d) (the `state/directives/2026-11-23-the-humans-message-never-idle-…` filing). It is referenced by item, not reproduced.
- ADV-2026-11-23-15, item 7 (d) (advisor's wording) and item 4 (building on a held branch).
- ADV-2026-11-14-15, items 2 (b), 6 (a) and 8.
- ADV-2026-11-14-18, items 1, 2 and 4.
- ADV-2026-11-13-02, item 1.
- ADV-2026-11-16-06, items 2, 4 and 5.

The rulings are the advisor's, not the human's.

Reuse index, run by the custodian in the read-only reuse clone at 89bbac37 on 2026-11-23, byte for byte:
```
No prior art recorded for "colour by refill keeps the view". Research it before planning an implementation.
```
This is a miss. No prior art was used, and this form's mechanism is drawn from this repository's code alone.

0.2 **What this node is now.** ADV-2026-11-14-18 item 2 (b) leaves this node "the cleared map and the camera fitted again", drafted against the code as `open-first-look-fills-fit-view` (PR 335, f73a131c) leaves it. That piece's terminal block already plans the shown view after every first look, the refill included (`frontends/shell/src/residency/candidateArmSession.ts:1497-1512`). So the 10,000-row state is gone, and what remains is the refit.

0.3 **Read.**
- `App.tsx`:
  - :300-400 (`applyFilter`)
  - :827-834 and :862
  - :1055-1057 (`issueQueryRef` type)
  - :1107-1143 (`applyFilterWith`)
  - :1745-1861 (candidate construction and cleanup)
  - :1937-1958 (baseline `issueViewportQuery`)
  - :2137-2147 (the Colour-by effect)
  - :2373-2388
- `candidateArmSession.ts`: :35-90, :239-250, :1126-1260, :1283-1521, :1526-1564, :1703-1813
- `WorkingCanvas.tsx`: :139-241, :1017, :1085, :1455-1458, :1582-1583, :1618-1664, :1740-1854, :2116-2127, :2385-2423
- `tileViewportStreamManager.ts`: :518-728
- `tileIngest.ts`: :115-193
- `limits.ts`: :84-99
- `KNOWN-LIMITATIONS.md`: :465-467, :487, :506-507, :529-530
- `MANUAL-WALKTHROUGH.md`: :1998 and :2019
- `App.colour.test.tsx`, `App.attributes.test.tsx`, `App.reopen.test.tsx` (harness and test names)
- `WorkingCanvas.wiring.test.tsx`: :166-184 and :424-484
- the list of `kernel/tests/manual_walkthrough_fixtures.rs` generator functions
- the forms of PR 335 and PR 358 (the latter :1-680)

0.4 **Not read.**
- PR 358's head (`cut/untiled-reissue-mint-window`) and the re-link head.
- The baseline arm's `viewportStreamManager`.
- `e2e/README.md` and `e2e/lib.mjs`.
- How the e2e suites are launched (a `package.json` script or `node` directly).
- Whether a fixture exists that goes over the attribute ceiling. The generator's function names show none: :44-758.

## 1. The defect, and what this piece may claim

**Defect.** On the shipped candidate arm, a Colour-by on a new column while attributes are not held does three things:
1. The effect calls `issueQueryRef.current(null, null, activeFilterRef.current)` (`App.tsx:2145`).
2. `issueQueryRef` is bound to `session.reissueUnrestricted(bbox, filter)` (`App.tsx:1801`).
3. That function clears the tiles (`candidateArmSession.ts:1744`) and calls `canvas?.resetFitForNewGeneration()` (`:1745`). The reset sets `hasAutoFitRef.current = false` (`WorkingCanvas.tsx:1662`).

So the refill's first geometry batch fits the camera again (`WorkingCanvas.tsx:1817-1818`). The operator loses their place: S3 (ADV-2026-11-14-18 item 2 (c)).

**May claim.** After the change, a Colour-by refill:
- leaves the camera where it stands, unless the canvas was still waiting to fit the first geometry batch of an open, an Apply or a Clear (`hasAutoFitRef` false). In that case it fits as it would have;
- still clears the map and restarts the fit anchor and the last-queried box;
- still fills the view it shows when its first look completes, through PR 335's terminal block, now at the kept camera.

An Apply, a Clear and an open behave exactly as before.

**May not claim.**
- That the map is not cleared. Keeping the map is option (b) of OPEN-1: a design of its own (ADV-2026-11-14-15 item 2 (b)).
- Anything on the baseline arm. It is dev-only, and its binding (`App.tsx:1937-1958`) resets no fit on this path.
- Any timing.

## 2. The change

2.1 **Interfaces, read first (seam rule).**
- `WorkingCanvasHandle.resetFitForNewGeneration(): void` (`WorkingCanvas.tsx:193`). Its implementation is at :1660-1664 and clears `fitAnchorRef`, `hasAutoFitRef` and `lastQueriedRef`.
- `CandidateArmSession.reissueUnrestricted(bbox, filter)`. Its doc is at `candidateArmSession.ts:239-250` and its body at :1718-1787.
- `issueQueryRef`'s type is `(bbox, bboxCrs, filter) => Promise<RequestOutcome>` (`App.tsx:1055-1057`).
- PR 358 adds `untiledLookGeneration` and a `{kind:"superseded"}` outcome to the same function. The worker re-reads both at the build head before code (stop I1).

2.2 **After** (OPEN-1 (a), recommended).
- (i) `resetFitForNewGeneration(options?: { keepCamera: true })`. With `keepCamera`, `hasAutoFitRef` is left as it stands, and `fitAnchorRef` and `lastQueriedRef` are cleared as today. Without the option it behaves byte for byte as today.
- (ii) `reissueUnrestricted(bbox, filter, options?: { keepCamera: true })` passes `options` to the call at :1745. Nothing else in the function changes: the clear, `frameEstablished = false` (:1746), `hasPlanned = false` (:1749), `latestUnionedExtent = null` (:1758), `query-issued` (:1783), and PR 358's generation.
- (iii) `issueQueryRef`'s type gains `options?: { keepCamera: true }` as a fourth parameter. The candidate binding at :1801 passes it through. The baseline binding ignores it.
- (iv) The Colour-by effect at :2145 passes `{ keepCamera: true }`.

`applyFilterWith` (:1107-1143) and the open's first look (:1834) pass nothing.

**Product caller** of every new option: the Colour-by effect (`App.tsx:2137-2147`). There is no test-only caller and no new `pub` item.

2.3 **Why the anchor and the last-queried box still reset.**
- Kept, the earlier look's anchor would feed the new look's union (`WorkingCanvas.tsx:1762`, `tileIngest.ts:180`). In a frameless window that is the extent the grid frame freezes on (`candidateArmSession.ts:1150`, :1234-1242).
- A kept `lastQueriedRef` would let a later zoom inside the pre-refill box report nothing (`WorkingCanvas.tsx:2116-2127`).

2.4 **Orderings declared** (each gets a test in §4 or a declared-unchanged line in §5):
- (a) Refill while an earlier look runs: PR 358 sets the earlier look aside. Unchanged.
- (b) A pan pending at the refill: the debounce is cancelled (:1731), and the terminal plans the shown box, which includes the pan.
- (c) A pan during the refill's look: `pendingViewportChange` plans, and the terminal plans nothing, by term (viii) (:1505).
- (d) Frameless refill: the frame is built from the new look's union only; the camera is kept.
- (e) An Apply issued but not yet fitted, then a refill: `hasAutoFitRef` stays false, and the refill's first batch fits.
- (f) A reopen with a saved view: `applyView` set `hasAutoFitRef` (:1649), so the camera is kept.
- (g) `sessionEnded`: returns before anything (:1729). Unchanged.
- (h) Two quick refills: PR 358's supersede. Unchanged.
- (i) A Colour-by inside the round trip of an Apply's mint. This is not covered (AUTONOMY §31: timing inside one request round trip) and is named in the source comment.

2.5 **Words.**
- Doc comments change at `WorkingCanvas.tsx:164-193`, `candidateArmSession.ts:239-250`, the `issueQueryRef` declaration, and the effect's comment above `App.tsx:2137`.
- No new string is shown in the app. `ATTRIBUTES_NOT_HELD_TEXT` (`App.tsx:827-834`) is unchanged.
- Item 51, item 61 and AC12: §2.6 below. **Drafts for the advisor**, not the human's wording.

2.6 **Drafts for the advisor** (clause-checked against the code).

**Item 51**, replacing the sentence in `KNOWN-LIMITATIONS.md:466` that begins "If you apply Colour by on a column":

> If you apply Colour by on a column the map is not already coloured by while the status bar says that attributes were not held, the map is cleared and, once its first data load completes, filled again for the view it shows; the view does not move, unless the map was still waiting to move the view to the first features of an open, an Apply or a Clear, and then it moves to the first features that arrive, as it would have. The status bar still says that attributes were not held.

Clause check:

| Clause | Code |
|---|---|
| cleared | `candidateArmSession.ts:1740`, :1744 |
| filled once completed | :1497-1512 terms (v) and (iv), after `hasPlanned = false` at :1749 |
| does not move | §2.2 (i) |
| unless still waiting | `hasAutoFitRef` false is set only by a reset (:1662) and true only by a fit (:1583, :1818) or by `applyView` (:1649). A pan does not disarm it: no other writer, by grep of `WorkingCanvas.tsx` |
| status | :862, set by `onAttributesNotHeld` (:2373-2375). The refill does not clear it |

A failed or refused load is item 56's (`KNOWN-LIMITATIONS.md:487`) and item 68's. The dev-only baseline arm goes in the source comment (ADV-2026-11-14-18 item 4). The comment's pins for `resetFitForNewGeneration` and `reissueUnrestricted` (:467) are re-pinned at the build head.

**Item 61** (OPEN-5). `KNOWN-LIMITATIONS.md:507` says Zoom to layer frames the union "since the open, or since the last Apply or Clear". A refill restarts that union today, and it still does after this piece (§2.3). Draft replacement of that span:

> since the open, or since the last Apply or Clear, or since Colour by last cleared the map (item 51)

**AC12** (`MANUAL-WALKTHROUGH.md:1998`). Its expected outcome is stale on main: it still says the view moves to fit and shows at most 10,000 rows. Draft expected outcome:

> The map clears and fills again for the view you had; the view does not move. The status bar still says that attributes were not held.

## 3. Fixtures

- Unit tests: the existing harnesses. These are `WorkingCanvas.wiring.test.tsx`'s `mount()` with deck mocked, and the mocks style of PR 358's `candidateArmSession.mintWindow.test.ts`. The App test uses `App.reopen.test.tsx`'s shape: candidate arm, real session, and a canvas stand-in typed as `WorkingCanvasHandle` that records reset arguments in order.
- e2e (OPEN-3 (a)): one new fixture from `kernel/tests/manual_walkthrough_fixtures.rs`. Its attribute bytes held after open must exceed `RESIDENT_ATTRIBUTE_MAX_BYTES` (`limits.ts:84`, 268,435,456), and it needs a second column Colour by can use. A highly compressible text column keeps the file small; the worker states the file's bytes and the disk floor (I5).

## 4. Tests and mutations

Each test is red at the build head before the change and green after. Each mutation is observed by running the named test red against the mutated code and recording that run. A `verify-mutation` run is not an observation.

**Canvas** (appended to `WorkingCanvas.wiring.test.tsx`; no existing test is edited):

| Test | Asserts | Mutation, observed red |
|---|---|---|
| RK-C1 | After an auto-fit, `reset({keepCamera:true})` then a batch elsewhere leaves `currentView()` bit for bit | M-C1: the option is ignored and `hasAutoFitRef` is cleared |
| RK-C2 | After `reset({keepCamera:true})`, Zoom to layer after one new batch frames that batch alone | M-C2: `keepCamera` also keeps `fitAnchorRef` |
| RK-C3 | After `reset({keepCamera:true})`, a resize goes to `onViewShown`, not `onViewportWithinLastQuery` (:166-184 shape) | M-C3: `keepCamera` keeps `lastQueriedRef` |
| RK-C4 | A plain reset, then `reset({keepCamera:true})` before any batch: the first batch fits | M-C4: `keepCamera` sets `hasAutoFitRef` true |
| RK-C5 | A plain reset after a fit: the next batch fits (guard) | M-C5: a plain reset leaves `hasAutoFitRef` |

**Session** (new file `candidateArmSession.refillKeepsView.test.ts`):

| Test | Asserts | Mutation |
|---|---|---|
| RK-S1 | `reissueUnrestricted(null, f, {keepCamera:true})` calls the canvas reset once with `{keepCamera:true}`. Without the option it is called with no argument | M-S1: the session drops the option |
| RK-S2 | After a keep-camera refill with a frame, a Completed terminal plans the fake canvas's `shownViewportBbox()` under `f` | M-S2: the keep-camera path skips `hasPlanned = false` |
| RK-S3 | Frameless refill: the frame's observed union (the `candidate-grid-frame-established` log line) equals the new look's batch extent alone | M-S3: the keep-camera path skips `latestUnionedExtent = null` |

**App** (new file `App.colourRefill.test.tsx`, real App, candidate arm, real session):

| Test | Asserts | Mutation |
|---|---|---|
| RK-A1 | Open, the not-held fact, then Colour by a new column: the stand-in records `clearAllTiles`, then `reset({keepCamera:true})`, then a new untiled query under the active filter | M-A1: the effect drops the option; M-A2: the :1801 binding drops the fourth argument |
| RK-A2 | An Apply and a Clear each record a plain reset | M-A3: the binding always passes `keepCamera` |

**e2e** (new suite `e2e/colour-refill.mjs`, OPEN-3 (a)). Real app, the over-ceiling fixture, the not-held status awaited:
- E-RK1: pan by pointer to a view away from the fit, then Colour by a new column through the UI. Asserts:
  - the `candidate-first-look-view-planned` box in the session log equals the view shown before the Colour by, within a pixel's world span;
  - the resident count after the plan exceeds the first look's 10,000;
  - the not-held status still stands.
- Red at the build head (the box is the fitted view).
- It uses no DEV-only switch that acts.

**No-regression**: the shell's full vitest suite; the e2e suites `open-fills-fit-view`, `colour`, `attributes`, `filter-panel`, `reopen` and `regression` at the final candidate. One series report (ADV-2026-11-16-06 item 2 (d)).

## 5. Predictions, declared unchanged, falsification

- **Predicted**: the tests and mutations above as stated.
- **Declared unchanged**:
  - the open's, an Apply's and a Clear's fit;
  - the baseline arm;
  - every status line and app string;
  - the wire and the kernel, except one test fixture;
  - ADR-018 cancellation: the clear cancels as today, at :1740.
- **Falsification**:
  - any declared-unchanged test goes red;
  - E-RK1's planned box differs from the pre-refill view;
  - RK-C4 shows the waiting fit lost.

## 6. Instruments

- The session log lines `candidate-first-look-view-planned` (:1509) and `candidate-grid-frame-established` (:1255). They exist in the shipped build.
- E2e hooks already registered (`residentCounts`, `App.tsx:1374`).
- No new instrument.

## 7. Declared values and ceiling

Scope, exactly. Shared paths are marked:
1. `frontends/shell/src/canvas/WorkingCanvas.tsx` (milestone-5 form): about 25 lines
2. `frontends/shell/src/residency/candidateArmSession.ts` (**PR 358**): about 20
3. `frontends/shell/src/App.tsx` (milestone-5 and recovery-offer forms): about 15
4. `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`: about 120
5. `frontends/shell/src/residency/candidateArmSession.refillKeepsView.test.ts` (new): about 220
6. `frontends/shell/src/App.colourRefill.test.tsx` (new): about 200
7. `frontends/shell/e2e/colour-refill.mjs` (new): about 170
8. `frontends/shell/e2e/README.md` (**PR 359, re-link**): about 10
9. `kernel/tests/manual_walkthrough_fixtures.rs`: about 50
10. `KNOWN-LIMITATIONS.md` (**PR 358, re-link**; items 51 and 61 only, :466-467 and :507): about 6
11. `frontends/shell/MANUAL-WALKTHROUGH.md` (**re-link**; row AC12 only): about 2

These are estimates, about 840 lines declared in total. **Ceiling: 980 changed lines over these 11 paths.** If OPEN-3 is (b), paths 7 to 9 leave Scope and the ceiling becomes 650.

Counting: `git diff --numstat B...H -- <the 11 paths>`, added plus deleted. B is `git merge-base origin/main H` once every base has merged. Before that, B is the head commit of the build base, named in the dispatch amendment.

No `package.json`, lockfile, workflow or dependency change. A full-form overrun is class 8, and its §7 line is never edited to match.

## 8. Block on sight

- An option, branch or parameter with no product caller.
- The canvas reset's behaviour changing without the option.
- `applyFilterWith` or the open passing `keepCamera`.
- Any edit to the baseline arm or to `tileViewportStreamManager.ts`.
- A test that encodes an interface the build head does not have.
- A mutation recorded from a `verify-mutation` run.
- A scope addition not recorded as class 9, or code of it landed before the amendment that declares it.
- A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.
- Item 51's, item 61's or AC12's words landed before the advisor rules them.
- An app string changed.

## 9. Gates

- Reviewer, then architect, both to an affirmative PASS (§21a).
- The words go to the advisor after the gates' clause check (ADV-2026-11-14-15 item 5 (b)).
- The PR body states the merge base, the main commit and the changed paths.

## 10. Where built, order, model

- **Built on** the held branch that carries the shared paths (ADV-2026-11-23-15 item 4): the re-link head (`cut/relink-after-refusal`, which carries PRs 353, 358 and 359). If that head is not pushed, PR 358's head (`cut/untiled-reissue-mint-window`), with the README, item and AC12 regions taken in turn.
- **Ordered** behind the filed-not-built milestone-5 and recovery-offer forms on `App.tsx` and `WorkingCanvas.tsx`. Regions: the Colour-by effect, the `issueQueryRef` declaration and binding, and the canvas reset.
- **Merge**: after the v0.2 tag and after PR 358 (and the re-link, if built on it) merge. Main is merged in before the merge request.
- **Model**: worker-high (ADV-2026-11-16-06 item 5 (a)). Grounds: concurrency.

## 11. Stops

The worker stops and reports if:
- **I1**: at the build head, `reissueUnrestricted`'s, `resetFitForNewGeneration`'s or `issueQueryRef`'s signature differs from §2.1 beyond PR 358's generation.
- **I2**: a file outside Scope is needed.
- **I3**: the ceiling is passed.
- **I4**: a §4 test is green before the change.
- **I5**: the fixture cannot reach the not-held fact, or would cross the disk floor.
- **I6**: a `package.json`, lockfile or workflow change is needed. That is the human's matter.
- **I7**: the baseline arm needs an edit.

## 12. OPEN items (to the advisor in one message, ADV-2026-11-23-15 item 8; the gate does not wait)

**OPEN-1, the mechanism.**
- (a) A `keepCamera` option, as in §2.2.
- (b) Keep the map and replace tile by tile. The cross-tile dedupe in `addBatch` (`tileIngest.ts:179`) and the untiled look's tile key make this a design of its own.
- (c) Plan the shown view at the refill itself, when a frame exists. This is a new ordering beside PR 335's terminal block.
- (d) No reset. The earlier anchor leaks into the frame (§2.3).

**Recommend (a)**: the smallest change that answers the node. (b) needs its own node if wanted.

**OPEN-2, the waiting fit.**
- (a) Leave `hasAutoFitRef` as it stands, so a refill before the first fit still fits.
- (b) Always keep the camera.

**Recommend (a)**: the open's, Apply's or Clear's fit was due, and (b) would leave a fresh open unfitted.

**OPEN-3, the e2e.**
- (a) A new over-ceiling fixture plus suite E-RK1.
- (b) No e2e: the operator row alone, recorded as a gap.

**Recommend (a)**: ordinary use reaches the case, and the seam changes (the brief's e2e rule).

**OPEN-4, AC12.** Replace its expected outcome in this piece (§2.6), since it is stale on main. **Recommend yes.** An operator Part is needed: AC12 has not been run (:2019).

**OPEN-5, item 61's span** (§2.6). **Recommend** including it: the span is untrue of a refill today and after this piece.

## 13. Amendments

(none)

---END OF FORM---

Note (not part of the form).

1. **What the code could not settle.**
   - PR 358's head was not read. §2.1's signatures are at main, and PR 358 changes `reissueUnrestricted`'s body and outcome type. Stop I1 covers this. Every `candidateArmSession.ts` cite is re-resolved at the build head.
   - The re-link and PR 359 heads were not read, so the `e2e/README.md` region and the item 51/61 regions may have moved.
   - I did not read how e2e suites are launched. If a suite needs a `package.json` script line, stop I6 fires. That file is shared with PR 353 and milestone 5, and a change there is the human's matter.

2. **The fixture.** No generator function in `kernel/tests/manual_walkthrough_fixtures.rs` (:44 to :758) goes over the attribute ceiling. As far as I read, no e2e suite reaches the not-held fact. OPEN-3 (a) adds a fixture over 268,435,456 held attribute bytes. Whether a compressible text column holds that many bytes in memory once decoded is unverified. The `dictionary-column-described-as-its-value-type-for-the-chooser` node bears on how such a column is described. The worker states the file size against the disk floor (stop I5). The fixture lives in `kernel/`, a different docs/02 module from the shell, but it is test-only and touches no wire.

3. **Stale words on main** (Documentation, for the advisor):
   - AC12's expected outcome (`MANUAL-WALKTHROUGH.md:1998`) still describes the 10,000-row state PR 335 retired.
   - Item 61 (`KNOWN-LIMITATIONS.md:507`) does not name the refill's restart of the Zoom-to-layer union.

   Both are drafted in §2.6.

4. **For the human, not settled by the code.** Whether a release waits for this node is reserved to the human (ADV-2026-11-14-18 item 2 (e)). This form only orders the merge after the tag. No dependency, lockfile or workflow change is proposed.

5. **Hashes.** No span hash is computed, because the architect has no shell. Every cite is `path:line` at 0bcf5434, on main. The custodian or the reviewer computes the hashes at filing (round 15 (e)).

6. **Reach of the mechanism.** The option changes only the Colour-by refill. The camera then holds only where `hasAutoFitRef` was already true. The one case that needs timing inside one request round trip (a Colour by inside an Apply's mint) is named under §31 and does not block.
