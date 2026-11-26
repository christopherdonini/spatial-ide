# Preregistration: a Colour-by refill keeps the view (`colour-by-refill-keeps-the-view`)

*Committed by the custodian on 2026-11-23 from the architect's draft (`state/consults/2026-11-23-colour-by-refill-keeps-the-view-architect-draft.md`; the hand-back 23151 bytes, sha256 a35264d84834d588283047addf76609ec69608fa55e06e66e554effba9ae4609): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The note after the end mark stays in the consult. Read the last amendment first.*

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

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The human's message of 2026-11-23 is filed at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, and the advisor's ruling ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`. The draft is filed at `state/consults/2026-11-23-colour-by-refill-keeps-the-view-architect-draft.md`.
2. **The node's gate.** In the same commit the PLAN node `colour-by-refill-keeps-the-view` names this form as its gate. Its class is full, with both gates, by ADV-2026-11-16-06 item 2 (a), as its header says. The path is the one the draft proposes.
3. **Span hashes.** Every `path:line` cite above is read at 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence or list names.

- `frontends/shell/src/residency/candidateArmSession.ts:1497-1512` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2b7726214ee18f798846dc3e14c9bb4f1224760baecba5652095822061d7ffc2 — §0, §2; as written `:1497-1512`
- `frontends/shell/src/App.tsx:300-400` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f9e0de197b98abbdd8503bfb129230dc9d8d6e0def229ca0a6f7bd913d196c6f — §0; as written `:300-400` (r)
- `frontends/shell/src/App.tsx:827-834` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1cc8b0f13406a05754752e3e0174ed30d2f2c4d89ce9244e5531990c42dc0e08 — §0, §2; as written `:827-834`, `App.tsx:827-834` (r)
- `frontends/shell/src/App.tsx:862` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:302e8dd072ad063a126904e37b317817dcedec67d76a12d633c77cd2286c0fa0 — §0, §2; as written `:862` (r)
- `frontends/shell/src/App.tsx:1055-1057` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1b828a29567b58b16e715e423dbb731c0d12c782c02ca6392e35c54da11a0457 — §0, §2; as written `:1055-1057`, `App.tsx:1055-1057` (r)
- `frontends/shell/src/App.tsx:1107-1143` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:695ef8cff614f517bfd41e1818174a98edff80742d11c0ffac6f546b0a045f0f — §0, §2; as written `:1107-1143` (r)
- `frontends/shell/src/App.tsx:1745-1861` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:070b43228600b9b0f2f9096584e4843a11eb26cf7fb5415754547053bec09ac9 — §0; as written `:1745-1861` (r)
- `frontends/shell/src/App.tsx:1937-1958` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3c5ced083adf28f46f921b548a579290645981dbe6409e453cda10ba3c268976 — §0, §1; as written `:1937-1958`, `App.tsx:1937-1958` (r)
- `frontends/shell/src/App.tsx:2137-2147` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8c66493655c4a4dfb8ad8fb2a99e3224d223cfe222ce1d91b4a8d7c8f5375d20 — §0, §2; as written `:2137-2147`, `App.tsx:2137-2147` (r)
- `frontends/shell/src/App.tsx:2373-2388` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:96c3efb6449028be0af884dc5d10c9afa867175fc74ddc9913ae9d490880e960 — §0; as written `:2373-2388` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:35-90` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a6c4cc7fd8622391de7e08a1f750019f18ed49088c1e665396e674726da89d4c — §0; as written `:35-90`
- `frontends/shell/src/residency/candidateArmSession.ts:239-250` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1b1f86f15fe9203a7ae77343b937d0507aa1868011c1b5412f38bf354a3345c8 — §0, §2; as written `:239-250`, `candidateArmSession.ts:239-250`
- `frontends/shell/src/residency/candidateArmSession.ts:1126-1260` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:630ef2ec0119b17b606e4a324405362529619bf76568efc163462d1d7b5a8010 — §0; as written `:1126-1260`
- `frontends/shell/src/residency/candidateArmSession.ts:1283-1521` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f2ae3ed8b9f1f21171711b3a4cbc0f9c16e5dc2519c9eba472cd60c757cc14fa — §0; as written `:1283-1521`
- `frontends/shell/src/residency/candidateArmSession.ts:1526-1564` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:73329fd071885fb0bd130cdc03a494eca6d89375136c9285df8989d5602c7897 — §0; as written `:1526-1564`
- `frontends/shell/src/residency/candidateArmSession.ts:1703-1813` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ad399a5e06e7d4f0f498de094a284053779a8e55ff2ce0deebe092b2932af904 — §0; as written `:1703-1813`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:139-241` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6e96ef2bb03745734dcf90f00b166f7e31b2fc4dcd213f5ca3c9a2b5ef01d2d9 — §0; as written `:139-241` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1017` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b6f44873941b7b83edc42d3db040bbb8ddcd4648d0561d3633e048c6b0e5d64b — §0; as written `:1017` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1085` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:52a46a1bcce540e9ad4c7c0d2203188d6adfe9fdb33d2e6beb768a3cea535b33 — §0; as written `:1085` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1455-1458` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0917384144c96cb11c0bd6a1ea54a916921642d5fbf4366cf4001c3625545c50 — §0; as written `:1455-1458` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1582-1583` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1839f81a837c83e0c11a49f6f51a0a536d4489ebe3525c0eb71d79649ace9506 — §0; as written `:1582-1583` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1618-1664` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:bb38f74b37a53febb0ef53da79abc386e52d091df4a1a92eca7ba370b04cd3c6 — §0; as written `:1618-1664` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1740-1854` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7ec0cb6233568c01c0b52eb3b86f09398ad90841f6d225894865f65ea28a1191 — §0; as written `:1740-1854` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2116-2127` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:835c7ccada0359ef52dc635ce28149d04da8e59e886de28dff9f3c3fec43576d — §0, §2; as written `:2116-2127`, `WorkingCanvas.tsx:2116-2127` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2385-2423` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:06f0c6307c0e81f73ff654b651bf6dc745c1b22829a647bc8227c872fdcfe61c — §0; as written `:2385-2423` (r)
- `frontends/shell/src/streaming/tileViewportStreamManager.ts:518-728` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1a342ee394edf259b1b706567280599fd1affeb8b03a759b8d93865dceb698b5 — §0; as written `:518-728` (r)
- `frontends/shell/src/canvas/tileIngest.ts:115-193` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:609dbe0771ae9154be05339f1f26bea20b4d77f9ceefa403c546ba7a7d4c30c3 — §0; as written `:115-193` (r)
- `frontends/shell/src/canvas/limits.ts:84-99` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:78b72ed0fd14f60bbc95857d9001c51a2bb3025a884d8b7b489b07509202f1b6 — §0; as written `:84-99` (r)
- `KNOWN-LIMITATIONS.md:465-467` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:612de39a4fde78a9f4a7f2b836c8c741a97fad72b0e35aa7e7febbeb98343dd2 — §0; as written `:465-467` (r)
- `KNOWN-LIMITATIONS.md:487` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c8dd4f0e4a98d8e3ca0252df3a21c03546a898344033bf3d7f87c7f5b221e2bb — §0, §2; as written `:487` (r)
- `KNOWN-LIMITATIONS.md:506-507` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ef794ace1741687a9a43a0f022dae5e51b3893588796fb3338829466625dbef1 — §0; as written `:506-507` (r)
- `KNOWN-LIMITATIONS.md:529-530` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d373c96932c493f3f99a0aef9054d1f2ed236a157fd2eb35aaadba8ba5b28885 — §0; as written `:529-530` (r)
- `frontends/shell/MANUAL-WALKTHROUGH.md:1998` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3ad887319230bcd284c1554e1d8285d68507b6cb7d5dcee85dab10cc88430f5a — §0, §2; as written `:1998`, `MANUAL-WALKTHROUGH.md:1998` (r)
- `frontends/shell/MANUAL-WALKTHROUGH.md:2019` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0d40bc96b49f49839686e4f63f777b43b90e592f52c633bf62ab70c6c2e8a0b6 — §0, §12; as written `:2019` (r)
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:166-184` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:876cacb2a32cf9a995c16054d0d2ac779b3be6a73f4ecb8b7ae5c28aab623585 — §0, §4; as written `:166-184` (r)
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:424-484` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d339ae6eacd36dc540f9ea6b5391eacf0c85444aaf65cc7f6620a2a6f1883001 — §0; as written `:424-484` (r)
- `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md:1-680` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:fb0ca53644188f25c7de527eb6bc83cc9b0e68adf6917df91020e42c5e86546a — §0; as written `:1-680` (r)
- `kernel/tests/manual_walkthrough_fixtures.rs:44-758` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:029b8581a1ceee6ea17f8b3b7728c2efd75f2e7a4658a95460dbdb08f7753f96 — §0; as written `:44-758` (r)
- `frontends/shell/src/App.tsx:2145` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8b63e249de3d1a16e29474bfaab90cd61bea22e46e73b6a61eb67dbac9eba25c — §1, §2; as written `App.tsx:2145`, `:2145`
- `frontends/shell/src/App.tsx:1801` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:180ff8f6909930675388d34df840c7a0d518c41d5715829d64a885661c0d4f3a — §1, §2, §4; as written `App.tsx:1801`, `:1801` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1744` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e93d4521cc9b648fe7b369c56e03747a2ab4aa19121211ca1a4378a214753555 — §1, §2; as written `candidateArmSession.ts:1744`, `:1744`
- `frontends/shell/src/residency/candidateArmSession.ts:1745` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:afd8c4c71c8ab144d9f80d65acda489a7a63c5108d49a7b60bd664742eda80eb — §1, §2; as written `:1745` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1662` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6c57a7a5d2f9683ebaacb09e28d048eaffe2b27ba0c9799424b3526164f12239 — §1, §2; as written `WorkingCanvas.tsx:1662`, `:1662` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1817-1818` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1839f81a837c83e0c11a49f6f51a0a536d4489ebe3525c0eb71d79649ace9506 — §1; as written `WorkingCanvas.tsx:1817-1818`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:193` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c0c7ce858b1deaf5648596d1fb88ab9bfe96b51b88f4f0992802edd8a578442e — §2; as written `WorkingCanvas.tsx:193`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1660-1664` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e82b33496db058c3b71421e7cabd6b3facbe4a6e6b4b7ebd3b7546f2aa7ac706 — §2; as written `:1660-1664`
- `frontends/shell/src/residency/candidateArmSession.ts:1718-1787` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:754ad28bf30c8e2d7e951537997dc3ff7ba7166b457577bad9601525c3cd937a — §2; as written `:1718-1787`
- `frontends/shell/src/residency/candidateArmSession.ts:1746` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a3378362189fcf8fdcd39d96dd954597dd7cbce5179d12b672e53d5d043afefc — §2; as written `:1746` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1749` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ca9e88b252bac47e33316c6dd5587dee2cc5c8873ebcf0ebc287da7aa457c52f — §2; as written `:1749` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1758` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5265ad8fd6590f3af3922111d1c1deda09351a96cf7ce8d01cd3788e8588ccca — §2; as written `:1758` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1783` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6f0216ea7346caf5812b860a33d01cedac1ff8a4c4f0e7f6bf17d297b3b073b8 — §2; as written `:1783` (r)
- `frontends/shell/src/App.tsx:1834` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:586b4842a3325b2c19e2d7cd609a8c03be34b2c68f7c172eb5b30cab8edd2cd6 — §2; as written `:1834`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1762` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:cd2507c1f0c939bd39ec2a19d85a2ae9257c4de54c68020615775f63f73f81ee — §2; as written `WorkingCanvas.tsx:1762`
- `frontends/shell/src/canvas/tileIngest.ts:180` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:03c398742867bc50713573966cb0463d3600e1aa21b23be0d4dd4df92ffae4af — §2; as written `tileIngest.ts:180`
- `frontends/shell/src/residency/candidateArmSession.ts:1150` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6088e3cbb084a9e4d86f7ffa68ae428a8a0bbcef6a33491d79887ea9a0752faf — §2; as written `candidateArmSession.ts:1150`
- `frontends/shell/src/residency/candidateArmSession.ts:1234-1242` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3ca4d3869411f13cc6d5e19e3a2ce30438a5b7139804045c46c2ba72625078f6 — §2; as written `:1234-1242`
- `frontends/shell/src/residency/candidateArmSession.ts:1731` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2dbf527da03fa0218ff7c0958eaca0ad8cfc22655a3cc469e25b1ea70189fcd1 — §2; as written `:1731` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1505` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:26465c34aa19e2befcfb51815a57b2af8d66d6a4020f8d4d6f11215c240496c5 — §2; as written `:1505` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1649` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f88d4421a61af9771912bb60bfebb645d8f20c95da70cb5b5dd0f98433a1fe28 — §2; as written `:1649` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1729` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:66c8099d098a12f5fac187069ab0d753259e8ee19601d3f41df45494ae8a21a0 — §2; as written `:1729` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:164-193` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:234f79fff59d739de68b2127d4d316709e3b647c4c31dc7ea4e57c73f7696003 — §2; as written `WorkingCanvas.tsx:164-193`
- `frontends/shell/src/App.tsx:2137` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2beb41e980051d573b44bbf40e2c6dd401fa1d1212489909c249b1f21bd4abd2 — §2; as written `App.tsx:2137`
- `KNOWN-LIMITATIONS.md:466` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ce2db9961b69710567d337c3d4f2b96d67122275fc017a3b898e1e7a2dcf0da0 — §2
- `frontends/shell/src/residency/candidateArmSession.ts:1740` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:02350c969f609181b8907f67d2cfacc29b1ebfd46426314833f98ff1301fb82d — §2, §5; as written `candidateArmSession.ts:1740`, `:1740` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1583` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3fdc0c272b3de83351b197ee9f7abc7a03e3c0dcd32ccc188a63e437d0f04b9f — §2; as written `:1583` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1818` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3fdc0c272b3de83351b197ee9f7abc7a03e3c0dcd32ccc188a63e437d0f04b9f — §2; as written `:1818` (r)
- `frontends/shell/src/App.tsx:2373-2375` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:15e99cec6767a678f4a197dcd09d3fb48567d50e1e8ef195950533e22722e0c0 — §2; as written `:2373-2375` (r)
- `KNOWN-LIMITATIONS.md:467` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4a146f5f4899e1351fb8a04e68450a077333c03365986da11e8d893387d940da — §2; as written `:467`
- `KNOWN-LIMITATIONS.md:507` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6a25d91c59c01a9007cebcb3c4e4bc6b8809dc541f961ca25de0ebcd50d85768 — §2, §7; as written `:507` (r)
- `frontends/shell/src/canvas/limits.ts:84` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b3f16f662398bfb539fe531994067cedceab1a4653dadff55d83e55b69588027 — §3; as written `limits.ts:84`
- `frontends/shell/src/residency/candidateArmSession.ts:1509` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a2bb5924271972694af6695fcd52220231dbe6dc1da305e346465c5b7122e541 — §6; as written `:1509` (r)
- `frontends/shell/src/residency/candidateArmSession.ts:1255` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:31bfd0f6d6b0ade525342fc431507c56f109de6b2b235d6745b745259a922145 — §6; as written `:1255` (r)
- `frontends/shell/src/App.tsx:1374` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:164e53dfa02b0069359d02cd57ee6f87915c3371d3abcfcddc40f7e2066b08f0 — §6; as written `App.tsx:1374`
- `KNOWN-LIMITATIONS.md:466-467` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a144e7b31ac2f00ef846ff79e12da778da73e3ae5ac66cf37ab6e8c228669b35 — §7; as written `:466-467` (r)
- `frontends/shell/src/canvas/tileIngest.ts:179` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d1e90478fa3524ef6c9e42a70b005c3cba4e1a4fb856176dd8f32f74dbb4fa24 — §12; as written `tileIngest.ts:179`

4. **OPEN items.** OPEN-1 to OPEN-5, and the drafts for item 51, item 61 and AC12 (§2.6) go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL): E1, E2 and the documentation findings

*Written by the architect after the gate's outcome was seen. The gate is `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect.md`: FAIL on E1 and E2, with D1 to D6. This amendment comes before any code. It was drafted read-only at main b42c0ed72a8a94885bdd1f057c5c7463e5127a0e, and every `path:line` below is read at that commit. The custodian adds the span hashes at filing. Old texts are located by section, never by line.*

### 1. E1: tests that are red before the change, and guards

The gate's split is adopted. The extra argument is ignored at the build head: today's `resetFitForNewGeneration` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1660-1664`) and `reissueUnrestricted` (`frontends/shell/src/residency/candidateArmSession.ts:1718-1787`) take no options. The shell's `vitest run` (`frontends/shell/package.json:16`, vitest `^5.0.1` at `:76`) runs with a config that sets no type check (`frontends/shell/vitest.config.ts:7-13`). So a guard cannot be made red before the change without asserting the camera, and that is RK-C1's assertion.

§4, the first paragraph. Old:
````text
Each test is red at the build head before the change and green after. Each mutation is observed by running the named test red against the mutated code and recording that run. A `verify-mutation` run is not an observation.
````
New:
````text
RK-C1, RK-S1, RK-A1 and E-RK1 are red at the build head before the change and green after. RK-C2 to RK-C5, RK-S2, RK-S3 and RK-A2 are guards: green at the build head and after, each shown by its mutation; the register in Amendment 2 item 3 gives each test's reason. Each mutation is observed by running the named test red against the mutated code and recording that run. A `verify-mutation` run is not an observation.
````

§11, stop I4. Old:
````text
- **I4**: a §4 test is green before the change.
````
New:
````text
- **I4**: RK-C1, RK-S1, RK-A1 or E-RK1 is green before the change, or a guard (RK-C2 to RK-C5, RK-S2, RK-S3, RK-A2) is red before it.
````

### 2. E2: mutations with no known pass case

Each row below was checked against the code at b42c0ed7. The RK-C tests run on the candidate arm, in U-FL4's shape (`frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:433-435`), and use `pushTileBatch`. Before each reset they call `clearAllTiles()`, as the session does (`candidateArmSession.ts:1744-1745`). A fit is observed through `onViewShown`, because only an unreported camera write calls it (`WorkingCanvas.tsx:1455-1458`; the resize branch at :2120-2126 is not exercised in these tests). So a refit to an extent the camera already shows still counts.

In the harness, batch A is the default batch (`WorkingCanvas.wiring.test.tsx:116`). Batch B is `attributeBatchIpc([10n], [])` (`frontends/shell/src/testUtils/attributeBatchIpc.ts:38-56`), whose ring lies at local (0..1, 0..1), far from A.

Correction to the gate's RK-C2. Under M-C2 the anchor is the union of A and B (`tileIngest.ts:180`), and that union equals B's extent exactly when A's extent is inside B's. So the condition that leaves no pass case is that A's extent is not inside B's. The gate's wording, "B not inside A", allows the pass case.

Correction beyond the gate's rows: RK-C4 and RK-C5 as filed say "fits". With the same batch and a camera that has not moved, a lost fit leaves the camera where a fit would put it. Counting `onViewShown` closes that pass case.

RK-C1. Old:
````text
| RK-C1 | After an auto-fit, `reset({keepCamera:true})` then a batch elsewhere leaves `currentView()` bit for bit | M-C1: the option is ignored and `hasAutoFitRef` is cleared |
````
New:
````text
| RK-C1 | After the auto-fit on batch A and a settled tick that moves the camera off the fit, `clearAllTiles()` and `reset({keepCamera:true})`, then batch B: `currentView()` is unchanged bit for bit and `onViewShown` is called no more | M-C1: the option is ignored and `hasAutoFitRef` is cleared |
````

RK-C2. Old:
````text
| RK-C2 | After `reset({keepCamera:true})`, Zoom to layer after one new batch frames that batch alone | M-C2: `keepCamera` also keeps `fitAnchorRef` |
````
New:
````text
| RK-C2 | After batch A, `clearAllTiles()` and `reset({keepCamera:true})`, then batch B: B's returned `fitAnchor` equals its returned `batchExtent`, and Zoom to layer (`fitToBounds()`) reports the box `fitToBbox` reports for that extent. The test asserts that A's extent is not inside B's: were it inside, the union with A would be B's extent and M-C2 would pass | M-C2: `keepCamera` also keeps `fitAnchorRef` |
````

RK-C3. Old:
````text
| RK-C3 | After `reset({keepCamera:true})`, a resize goes to `onViewShown`, not `onViewportWithinLastQuery` (:166-184 shape) | M-C3: `keepCamera` keeps `lastQueriedRef` |
````
New:
````text
| RK-C3 | :166-184's shape: after the auto-fit, `fitToBbox` reports an area (asserted: `onViewportChanged` once), then `clearAllTiles()` and `reset({keepCamera:true})`; a size change that shrinks inside that area goes to `onViewShown`, not to `onViewportWithinLastQuery`. With no area reported before the reset, M-C3 cannot show | M-C3: `keepCamera` keeps `lastQueriedRef` |
````

RK-C4. Old:
````text
| RK-C4 | A plain reset, then `reset({keepCamera:true})` before any batch: the first batch fits | M-C4: `keepCamera` sets `hasAutoFitRef` true |
````
New:
````text
| RK-C4 | After the auto-fit on batch A (`onViewShown` once), `clearAllTiles()` and a plain reset (an Apply's), then `clearAllTiles()` and `reset({keepCamera:true})` (a refill before the Apply's first batch), then batch B: `onViewShown` is called a second time, with the box `shownViewportBbox()` then answers | M-C4: `keepCamera` sets `hasAutoFitRef` true |
````

RK-C5. Old:
````text
| RK-C5 | A plain reset after a fit: the next batch fits (guard) | M-C5: a plain reset leaves `hasAutoFitRef` |
````
New:
````text
| RK-C5 | After the auto-fit on batch A, `clearAllTiles()` and a plain reset, then batch B: `onViewShown` is called a second time (guard) | M-C5: a plain reset leaves `hasAutoFitRef` |
````

RK-S1. The gate's words are adopted: after §2.2 (ii) the session passes `undefined`. Old:
````text
| RK-S1 | `reissueUnrestricted(null, f, {keepCamera:true})` calls the canvas reset once with `{keepCamera:true}`. Without the option it is called with no argument | M-S1: the session drops the option |
````
New:
````text
| RK-S1 | `reissueUnrestricted(null, f, {keepCamera:true})` calls the canvas reset once with `{keepCamera:true}`. Without the option it is called once with no `keepCamera` (its first argument `undefined`) | M-S1: the session drops the option |
````

RK-S2. The gate's words are adopted. Every reissue sets `hasPlanned = false` (`candidateArmSession.ts:1749`), and only `handleViewportChange` sets it true (:1564). Old:
````text
| RK-S2 | After a keep-camera refill with a frame, a Completed terminal plans the fake canvas's `shownViewportBbox()` under `f` | M-S2: the keep-camera path skips `hasPlanned = false` |
````
New:
````text
| RK-S2 | With a frame and a plan already run (`hasPlanned` true from the earlier look's terminal plan), after a keep-camera refill a Completed terminal plans the fake canvas's `shownViewportBbox()` under `f` | M-S2: the keep-camera path skips `hasPlanned = false` |
````

RK-S3. The gate's words are adopted, with two additions. The earlier look's terminal is never delivered, because an orphan terminal also calls `establishFrameFromExtent` (`candidateArmSession.ts:1429-1431`, not gated on `wasCurrent`). And (a) and (b) each start from a fresh session. Old:
````text
| RK-S3 | Frameless refill: the frame's observed union (the `candidate-grid-frame-established` log line) equals the new look's batch extent alone | M-S3: the keep-camera path skips `latestUnionedExtent = null` |
````
New:
````text
| RK-S3 | Frameless refill, an earlier look having admitted a batch and its terminal never delivered, each part in a fresh session: (a) the new look admits batch B, and the `candidate-grid-frame-established` line's union equals B's extent alone; (b) the new look reaches its Completed terminal with no batch, and no `candidate-grid-frame-established` line is written. M-S3 is observed by (b): the first admitted batch overwrites `latestUnionedExtent` (`candidateArmSession.ts:1150`), so only (b) can show it | M-S3: the keep-camera path skips `latestUnionedExtent = null` |
````

RK-A2. The gate's words are adopted (App's post-issue reset, `frontends/shell/src/App.tsx:1136-1139`). Old:
````text
| RK-A2 | An Apply and a Clear each record a plain reset | M-A3: the binding always passes `keepCamera` |
````
New:
````text
| RK-A2 | An Apply and a Clear: every reset each records is plain, the session's reset that follows `clearAllTiles` included (App's post-issue reset at `App.tsx:1138` is plain whatever the binding passes, so it alone cannot show M-A3) | M-A3: the binding always passes `keepCamera` |
````

RK-A1 is unchanged.

### 3. The test register (an addition, read as the last part of §4)

Each test's `it` title begins with its id. The sets are predicted and cover this piece's tests. Each observation runs the named test's whole file and records every test that fails, by name. E-RK1 is run against a mutation only where this register says so.

| Test | File | Red before, or guard (why) | Mutation | Set it fails |
|---|---|---|---|---|
| RK-C1 | `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` (a describe appended) | Red: today's reset ignores the option and clears `hasAutoFitRef` (`WorkingCanvas.tsx:1662`), so batch B refits (:1817-1819) | M-C1 | RK-C1 |
| RK-C2 | same | Guard: today's reset clears `fitAnchorRef` (:1661) whatever is passed | M-C2 | RK-C2 |
| RK-C3 | same | Guard: today's reset clears `lastQueriedRef` (:1663) | M-C3 | RK-C3 |
| RK-C4 | same | Guard: today every reset clears `hasAutoFitRef`, so the waiting fit stays armed | M-C4 | RK-C4 |
| RK-C5 | same | Guard: the plain reset is unchanged by this piece | M-C5 | RK-C4, RK-C5 |
| RK-S1 | `frontends/shell/src/residency/candidateArmSession.refillKeepsView.test.ts` | Red: today the session calls the reset with no argument (`candidateArmSession.ts:1745`) | M-S1 | RK-S1, RK-A1 |
| RK-S2 | same | Guard: today every reissue sets `hasPlanned = false` (:1749) | M-S2 | RK-S2 |
| RK-S3 | same | Guard: today every reissue sets `latestUnionedExtent = null` (:1758) | M-S3 | RK-S3 |
| RK-A1 | `frontends/shell/src/App.colourRefill.test.tsx` | Red: today the effect passes three arguments (`App.tsx:2145`) and the binding two (:1801) | M-A1; M-A2 | M-A1: RK-A1, E-RK1. M-A2: RK-A1 |
| RK-A2 | same | Guard: today every reset is plain | M-A3 | RK-A2 |
| E-RK1 | `frontends/shell/e2e/colour-refill.mjs` | Red: at the build head the planned box is the refitted view | M-A1, observed by one E-RK1 run against a build with M-A1 applied, recorded in the series report | as M-A1 |

### 4. The documentation findings, D1 to D6 (the gate's words, adopted)

**D1** (§10). The fallback base agrees with ADV-2026-11-23-15 item 4: where paths overlap, the base is main's tip with each overlapped held head taken in by a merge commit. This piece touches no `protocol/`, so PR 353 is not an overlap of its own.

Old:
````text
If that head is not pushed, PR 358's head (`cut/untiled-reissue-mint-window`), with the README, item and AC12 regions taken in turn.
````
New:
````text
If that head is not pushed, main's tip with the heads of PR 358 (`cut/untiled-reissue-mint-window`) and PR 359 taken in by merge commits (ADV-2026-11-23-15 item 4), and the re-link's item and AC12 regions taken in turn.
````
Old:
````text
- **Ordered** behind the filed-not-built milestone-5 and recovery-offer forms on `App.tsx` and `WorkingCanvas.tsx`. Regions: the Colour-by effect, the `issueQueryRef` declaration and binding, and the canvas reset.
````
New:
````text
- **Ordered** behind the filed-not-built milestone-5 and recovery-offer forms on `App.tsx` and `WorkingCanvas.tsx`, and beside the filed-not-built `shell-scale-display` form, which shares `App.tsx`, `WorkingCanvas.tsx` (the comment in `currentView`'s doc), `e2e/README.md`, `KNOWN-LIMITATIONS.md` (a new item) and `MANUAL-WALKTHROUGH.md`; whichever is built later takes the other in before its gate (ADV-2026-11-16-06 item 4). Regions: the Colour-by effect, the `issueQueryRef` declaration and binding, the canvas reset (`resetFitForNewGeneration`'s doc, signature and body), items 51 and 61, row AC12, and one suite entry in `e2e/README.md`.
````

**D2** (§4, E-RK1). The instrument is `traceViewState` (`frontends/shell/src/diagnostics/renderTrace.ts:52-54`). It is always on, with no DEV gate, and a gesture writes it at `WorkingCanvas.tsx:2161`. It logs the target and the origin from before any recentre, the same values `cameraRef` holds (:2169) and `shownViewportBbox` reads (:1652-1658).

Old:
````text
  - the `candidate-first-look-view-planned` box in the session log equals the view shown before the Colour by, within a pixel's world span;
````
New:
````text
  - the `candidate-first-look-view-planned` box in the session log equals the view shown before the Colour by, within a pixel's world span; that view is computed from the last `view-state` render-trace line before the Colour by (`WorkingCanvas.tsx:2161`) at the canvas's client size;
````
Old:
````text
- It uses no DEV-only switch that acts.
````
New:
````text
- Beyond the suites' own open through `openPath`, it uses no DEV-only hook that acts.
````

**D3** (§1, and item 51's draft in §2.6). A card change arms the waiting fit: `App.tsx:2168` goes to `applyFilterWith`, then to the session's reset (`candidateArmSession.ts:1745`) and App's reset (`App.tsx:1138`). A refused Apply arms it too, at the attempt and again at the recovery (`App.tsx:377-380`).

Old:
````text
of an open, an Apply or a Clear (`hasAutoFitRef` false)
````
New:
````text
of an open, an Apply, a Clear or a card change (`hasAutoFitRef` false)
````
Old:
````text
An Apply, a Clear and an open behave exactly as before.
````
New:
````text
An Apply, a Clear, a card change and an open behave exactly as before.
````
Old:
````text
unless the map was still waiting to move the view to the first features of an open, an Apply or a Clear, and then it moves
````
New:
````text
unless the map was still waiting to move the view to the first features after an open, an Apply, a Clear or any other change of the filter, and then it moves
````

The drafter's consistency edit with D3 (§5, declared unchanged). Old:
````text
  - the open's, an Apply's and a Clear's fit;
````
New:
````text
  - the open's, an Apply's, a Clear's and a card change's fit (a card change reaches `applyFilterWith` at `App.tsx:2168`, as an Apply does, so RK-A2's Apply covers its binding);
````

**D4** (item 61's draft span in §2.6). Old:
````text
> since the open, or since the last Apply or Clear, or since Colour by last cleared the map (item 51)
````
New:
````text
> since the open, or since the last Apply, Clear or other change of the filter, or since Colour by last cleared the map (item 51)
````

**D5** (AC12's draft in §2.6). Old:
````text
Draft expected outcome:
````
New:
````text
Draft for the row's whole third cell:
````
Old:
````text
> The map clears and fills again for the view you had; the view does not move. The status bar still says that attributes were not held.
````
New:
````text
> The map is cleared and, once its first data load completes, fills again for the view you had; the view does not move. The status bar still says that some features' attributes were not held (KNOWN-LIMITATIONS item 51). Record what the status bar says besides, and whether the view moved. **Felt:** did the map clearing and filling again surprise you, and is it clear from the screen when it has finished filling?
````

**D6** (§3, and the class header). No existing `AttributeMode` has a highly compressible text column (`engine/src/fixture.rs:173-197`). `MultiType` has the fixture's shape: `zone` is the column Colour by uses, and `text` is about 1 KiB of hash hex per row (`text_for`, `engine/src/fixture.rs:424-433`). The generator in `kernel/tests/manual_walkthrough_fixtures.rs`, path 9 in Scope, already uses `MultiType` (:768). So E-RK1 needs no edit outside Scope, but the file is not small.

Old:
````text
A highly compressible text column keeps the file small; the worker states the file's bytes and the disk floor (I5).
````
New:
````text
The generator uses the existing `AttributeMode::MultiType` (`engine/src/fixture.rs:173-197`): `zone` is the column Colour by uses, and `text` (`text_for`, `engine/src/fixture.rs:424-433`) is about 1 KiB of hash hex per row, so the attribute bytes held pass the ceiling at roughly 250,000 resident rows (an estimate), with the features' vertices kept under `MAX_RESIDENT_VERTICES` (`limits.ts:73`); the file is not small, and the worker states its bytes and the disk floor (I5). No mode has a highly compressible text column today; a new mode is an edit outside Scope, so stop I2 fires before it.
````
Old:
````text
AUTONOMY §21a also applies: a property under test changes (the refit after a refill).
````
New:
````text
AUTONOMY §21a also applies, by §21c's size bound. No current test asserts the refit after a refill (ADV-2026-11-14-15 item 8).
````

**§3, the App harness.** This is the drafter's addition, needed for RK-A1 and RK-A2 to run. `App.reopen.test.tsx`'s client throws on `viewportQuery` unless that query is held (`frontends/shell/src/App.reopen.test.tsx:79-82`), so its harness cannot mint the candidate look.

Old:
````text
The App test uses `App.reopen.test.tsx`'s shape: candidate arm, real session, and a canvas stand-in typed as `WorkingCanvasHandle` that records reset arguments in order.
````
New:
````text
The App test uses the canvas stand-in shape of `App.reopen.test.tsx` (`frontends/shell/src/App.reopen.test.tsx:122-158`), typed as `WorkingCanvasHandle`, recording `clearAllTiles` and each reset with its arguments in one list, in order; and the client, data-plane and stream mocks and the Colour-by helpers of `App.colour.test.tsx` (`frontends/shell/src/App.colour.test.tsx:61-79`, :179-209), so that the real candidate session mints its untiled look; candidate arm, real session.
````

### 5. Drafts for the advisor

These are the drafter's words, adopted only as the form's drafts. They are not the human's wording or the advisor's. All four go to the advisor in one message (ADV-2026-11-23-15 item 8), and none lands before the advisor rules (§8).
- Item 51: §2.6's draft as D3 changes it.
- Item 61's span: §2.6's draft as D4 changes it.
- Item 61's earlier sentence on the fit being armed again: its third sentence (`KNOWN-LIMITATIONS.md:507`, a sub-line span carrying its line's hash). It is outside the span and goes to the advisor unreworded; a card change also arms the fit (D4).
- AC12's third cell: §2.6's draft as D5 changes it.

Clause check of the changed clauses:

| Clause | Code |
|---|---|
| item 51: after an open | `App.tsx:1834` calls the session, then `candidateArmSession.ts:1745`, then `WorkingCanvas.tsx:1662` |
| item 51: an Apply, a Clear | `candidateArmSession.ts:1745` and `App.tsx:1138`; a refused Apply reaches :1745 at the attempt and at the recovery (`App.tsx:377-380`) |
| item 51: any other change of the filter | a card change at `App.tsx:2168` |
| item 51: nothing else arms it | `hasAutoFitRef` is written only at `WorkingCanvas.tsx:1017`, :1583, :1649, :1662 and :1818 |
| item 61: Apply, Clear or other change of the filter | the same resets, which clear the anchor at `WorkingCanvas.tsx:1661` |
| item 61: since Colour by last cleared the map | §2.2 (i): `keepCamera` still clears `fitAnchorRef` |
| AC12: cleared | `candidateArmSession.ts:1740`, :1744 |
| AC12: once its first data load completes, fills again for the view you had | :1497-1512 after `hasPlanned = false` at :1749, at the box `shownViewportBbox` answers (`WorkingCanvas.tsx:1652-1658`) |
| AC12: the view does not move | §2.2 (i); in AC12 the open's fit (:1818) or the saved view (:1649) set the flag long before |
| AC12: some features' attributes were not held | `ATTRIBUTES_NOT_HELD_TEXT` (`App.tsx:834`); its state (:862) is set by `onAttributesNotHeld` (:2373-2375), and the refill does not clear it |

### 6. Scope and §7

No file is added, and §7 is not edited. The row changes add an estimated 60 lines across paths 4, 5 and 6, which brings the total to about 900. The ceiling of 980, and of 650 under OPEN-3 (b), holds. There is no class-9 scope addition: the e2e fixture uses an existing mode (D6). An overrun is class 8.

### 7. Superseded index

This amendment supersedes:
- the class header's §21a sentence (D6);
- in §1, the "unless" bullet's last clause and the sentence on an Apply, a Clear and an open (D3);
- in §2.6, item 51's "unless" clause (D3), item 61's span (D4), and AC12's lead line and draft (D5);
- in §3, the App-harness sentence and the fixture sentence (§3 addition; D6);
- §4's first paragraph (E1);
- §4's rows RK-C1 to RK-C5, RK-S1 to RK-S3 and RK-A2 (E2);
- in E-RK1, the planned-box bullet and the DEV line (D2);
- §5's declared-unchanged fit line (D3's consistency edit);
- in §10, the fallback sentence of "Built on" and the "Ordered" bullet (D1);
- §11's I4 (E1).

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — 2026-11-23 — the custodian's, at the commit that files Amendment 2: references only

*Written by the custodian at the commit that files Amendment 2, before any code. References only.*

1. Amendment 2 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-colour-by-refill-keeps-the-view-amendment-2-architect-draft.md` (the hand-back's sha256 ef42c4365ade11aa676fd000ef590795a5da16a6208e897b5a05f6d2a76a35fd): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 1, FAIL: `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect.md` (gate-log row 865).
3. Its cites are read at b42c0ed72a8a94885bdd1f057c5c7463e5127a0e. Its sentence that the custodian adds sha256 values by script is not acted on: no hashes are added here. The architect's attempt 2 reads each cite at its own commit, and the form's re-sweep binds before code.
4. The points it could not settle (the consult's note after its end mark) go to the architect's attempt 2, and those that are rulings go to the advisor.
5. Next: the architect's form gate, attempt 2, on Amendment 2. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 2 (FAIL), and ADV-2026-11-23-18: E-A to E-C, the documentation findings and the rulings

*Written by the architect after the outcome of the architect's form gate, attempt 2, and the ruling ADV-2026-11-23-18 were both seen, and before any code. The gate is `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect-attempt-2.md`, cited by finding id. The ruling is the advisor's under the delegation of 2026-11-13, not the human's words, and is cited by id and item. Drafted read-only at main a846072d4be622ade7356d36bccd13c346ffa34a; every `path:line` below is read at that commit. Old texts are located by section and item, never by line.*

### 1. The rulings (ADV-2026-11-23-18)

- **Item 1, OPEN-1: (a).** The `keepCamera` option of §2.2, passed by the Colour-by refill alone. Option (b) is not asked for now.
- **Item 2, OPEN-2: (a).** A refill that comes before the first fit of an open, an Apply or a Clear still fits.
- **Item 3, OPEN-3: (a).** The new fixture and the suite E-RK1. The worker states the fixture's bytes before making it, and the disk floor stands (I5).
- **Item 4, OPEN-4: yes and OPEN-5: yes.** AC12's expected outcome is replaced in this piece, and item 61's span is included.
- **Item 5.** The three §2.6 drafts (item 51's sentence, item 61's span, AC12's third cell) stay drafts. They go to the advisor after the build gates' clause check and are ruled from the filed text. The build does not wait: they land in the build's words commit. The two Old/New pairs below bring §8 and Amendment 2 item 5 into line with this.
- **Item 6.** The piece is built where §10 (as Amendment 2's D1 changes it) says, with ADV-2026-11-23-17 item 11 for `App.tsx` and `WorkingCanvas.tsx`.
- **Item 7.** The sitting-script bullet is the custodian's, and it is already filed.
- **Item 8.** The docs-only piece that follows the sitting corrects row AC12 on main, and this piece replaces the row again when it merges. How that works is in the addition to §8 and the paragraph below.

§8, item 5. Old:
````text
- Item 51's, item 61's or AC12's words landed before the advisor rules them.
````
New:
````text
- Item 51's, item 61's or AC12's words landed outside the build's words commit, or merged before the advisor has ruled them from the filed text (ADV-2026-11-23-18 item 5).
````

Amendment 2 item 5, item 5. Old:
````text
All four go to the advisor in one message (ADV-2026-11-23-15 item 8), and none lands before the advisor rules (§8).
````
New:
````text
All four go to the advisor in one message after the build gates' clause check, and the three drafts land in the build's words commit without waiting for the ruling (ADV-2026-11-23-18 item 5); item 61's third sentence goes with them unreworded (§8).
````

**Item 8: the merge check for AC12.** §10 has main merged in before the merge request. At that merge, and again whenever main moves before the merge, the worker runs `git diff <build base> <the main commit taken in> -- frontends/shell/MANUAL-WALKTHROUGH.md` and reads row AC12 in it.
- If the row has changed, this piece replaces the third cell as main then has it: the corrected cell, not the build base's. The replacement is this piece's own third cell, either §2.6's AC12 draft as D5 changes it or the advisor's words under item 5.
- The row's first and second cells stay as main has them. §2.6's clause check of the third cell is re-run against main's second cell, and if a step has changed, that goes to the advisor with the words.
- The PR body names the main commit whose AC12 third cell this piece replaces.
- If the row has not changed, the build base's third cell is the one replaced.

Addition to §8, after its last bullet:
````text
- A merge that keeps main's AC12 third cell, or brings back the build base's over a cell main has corrected (Amendment 4 item 1, item 8).
````

### 2. E-A: the command for the unit-test runs (the gate's words, with one correction)

The correction: the gate's words name `npx vitest run <file>` for every red-before, guard and mutation run. E-RK1 is not a vitest test. The shell's e2e scripts run as `node e2e/<suite>.mjs` (`frontends/shell/package.json:44-46`), and adding a script is a `package.json` change (I6). This also settles §0.4's not-read point on how the suites are launched. The rest is the gate's text, checked: `pretest` at `frontends/shell/package.json:15`, `build` beginning `tsc --noEmit` at `:14`, and `"include": ["src"]` at `frontends/shell/tsconfig.json:19`. `frontends/shell/vitest.config.ts:7-13` sets no type check.

Amendment 2 item 1's New for §4's first paragraph. Old:
````text
the register in Amendment 2 item 3 gives each test's reason.
````
New:
````text
the register in Amendment 2 item 3 gives each test's reason. Every unit-test red-before, guard and mutation run is `npx vitest run <file>` in `frontends/shell`, never `npm test`: `npm test` runs `pretest` (`frontends/shell/package.json:15`), whose build typechecks all of `src`, the test files included (`package.json:14`, `frontends/shell/tsconfig.json:19`), and at the build head the new tests' extra arguments do not typecheck, so `npm test` there reports no test. That typecheck failure is not a test's red and does not trigger I4. E-RK1's runs are `node e2e/colour-refill.mjs` in `frontends/shell`, the form of the e2e scripts at `package.json:44-46`; no script is added (I6).
````

### 3. E-B: M-S1's set is observed across both files (the gate's words, with the command named)

Amendment 2 item 3, the register's preamble. Old:
````text
Each observation runs the named test's whole file and records every test that fails, by name.
````
New:
````text
Each observation runs, by the command Amendment 4 item 2 names, the whole file of every unit test in the mutation's set (for M-S1, both `candidateArmSession.refillKeepsView.test.ts` and `App.colourRefill.test.tsx`) and records every test that fails, by name.
````

### 4. E-C: the ceiling sentence

Is E-C's sentence about option (b) still needed? No. With OPEN-3 ruled (a), paths 7 to 9 stay in Scope and §7's (b) ceiling never applies, so the only correction left is to withdraw the untrue claim that it holds.

Amendment 2 item 6. Old:
````text
which brings the total to about 900. The ceiling of 980, and of 650 under OPEN-3 (b), holds.
````
New:
````text
which brings the estimate to about 900, within the ceiling of 980. OPEN-3 is ruled (a) (ADV-2026-11-23-18 item 3), so §7's ceiling for (b) binds nothing and no claim is made of it.
````

### 5. E-RK1: which planned line is read, and the window it is read in (the drafter's addition)

This is my addition; the gate did not raise it. It concerns the concurrency ground. Every first look's terminal writes `candidate-first-look-view-planned` (`frontends/shell/src/residency/candidateArmSession.ts:1509`), the open's first look included. So "the box in the session log" can be read from the open's line, which is red both before the fix and after it. A camera change after the Colour by also sets `pendingViewportChange` (`:1707`). Term (viii) (`:1505`) then stops the refill's terminal from planning, and no line is written: §2.4 (c).

Under M-A1, two things close the pass case:
- The refit writes the camera unreported (`frontends/shell/src/canvas/WorkingCanvas.tsx:1455-1458`, reached from `:1817-1819`), so `pendingViewportChange` stays false and the terminal plans the refit view.
- The one view a refit is known to reach is the open's own fit, and the first precondition below rules that view out as the pre-Colour-by view.

The auto-fit writes a `view-state` line (`WorkingCanvas.tsx:1441`), and a gesture writes one at `:2161` (`frontends/shell/src/diagnostics/renderTrace.ts:52-54`).

§4 E-RK1, the planned-box bullet as Amendment 2's D2 changes it. Old:
````text
  - the `candidate-first-look-view-planned` box in the session log equals the view shown before the Colour by, within a pixel's world span; that view is computed from the last `view-state` render-trace line before the Colour by (`WorkingCanvas.tsx:2161`) at the canvas's client size;
````
New:
````text
  - the box of the first `candidate-first-look-view-planned` line written after the Colour by (the open's first look writes one too, `candidateArmSession.ts:1509`) equals the view shown before the Colour by, within a pixel's world span; that view is computed from the last `view-state` render-trace line before the Colour by (`WorkingCanvas.tsx:2161`) at the canvas's client size. Asserted first, as preconditions: that view differs by more than that span from the open's fitted view, computed the same way from the last `view-state` line before the first wheel step (the auto-fit writes one, `WorkingCanvas.tsx:1441`); and no input reaches the canvas from the Colour by until that line is written, since a camera change there plans instead and the terminal writes no line (§2.4 (c), `candidateArmSession.ts:1505`);
````

The changed test:
- **File:** `frontends/shell/e2e/colour-refill.mjs`. **Name:** E-RK1.
- **Red before the fix:** at the build head the reset clears `hasAutoFitRef` (`WorkingCanvas.tsx:1662`), so the refill's first batch refits (`:1817-1819`). The planned box after the Colour by is then the refit view, not the zoomed-out, panned view.
- **Mutation:** M-A1. Its set is RK-A1 and E-RK1, as in the register.
- **Pass case:** none known, by the two points above.

### 6. The documentation findings, D-a to D-d (the gate's words, adopted)

Each Old text was checked against the form and occurs once. Each claim was checked against the code at a846072d:
- `ring` is at `frontends/shell/src/testUtils/attributeBatchIpc.ts:18`, and `ring(i * 10 + p * 2)` is at `:44`.
- The resize branch is at `WorkingCanvas.tsx:2120-2126`.
- The client mock starts at `frontends/shell/src/App.colour.test.tsx:46`, the props capture is at `:104`, and PB-U11 raises the fact at `:268`.
- `parcel()`'s grid is at `engine/src/fixture.rs:1405-1406`, and the vertex floor of 4 is at `:1414-1417`.
- `MAX_RESIDENT_VERTICES` is at `frontends/shell/src/canvas/limits.ts:73`.
- The attempt-1 report's D6 fixture New (its D6 section) differs from Amendment 2's D6 fixture New.

**D-a** (Amendment 2 item 2, the RK-C preamble). Old:
````text
the resize branch at :2120-2126 is not exercised in these tests
````
New:
````text
the resize branch at :2120-2126 is exercised only by RK-C3, which asserts it
````
Old:
````text
whose ring lies at local (0..1, 0..1), far from A
````
New:
````text
whose ring lies at (0..1, 0..1) in the batch's own coordinates (`ring`, `attributeBatchIpc.ts:18`), far from A
````

**D-b** (Amendment 2 item 4, the §3 App harness). Old:
````text
and the client, data-plane and stream mocks and the Colour-by helpers of `App.colour.test.tsx` (`frontends/shell/src/App.colour.test.tsx:61-79`, :179-209), so that the real candidate session mints its untiled look; candidate arm, real session.
````
New:
````text
and the client, data-plane and stream mocks and the Colour-by helpers of `App.colour.test.tsx` (`frontends/shell/src/App.colour.test.tsx:46-79`, :179-209), with that file's capture of the canvas's props (:104), through which the test raises the not-held fact by `onAttributesNotHeld` as PB-U11 does (:268), so that the real candidate session mints its untiled look; candidate arm, real session.
````

**D-c** (§4 E-RK1). Old:
````text
- E-RK1: pan by pointer to a view away from the fit, then Colour by a new column through the UI. Asserts:
````
New:
````text
- E-RK1: after the open's first look has planned, zoom out by the mouse wheel until the not-held status stands, then pan by pointer to a view away from the fit, then Colour by a new column through the UI; the worker records the zoom steps and the fixture's feature count. The fit frames only the first look's 10,000 rows, which, if they are the file's first rows, lie in the first rows of `parcel()`'s square grid (`engine/src/fixture.rs:1405-1406`), so at about 250,000 features the fit view alone may hold too few rows; I5 governs. Asserts:
````

**D-d** (Amendment 2 item 4's heading). Old:
````text
### 4. The documentation findings, D1 to D6 (the gate's words, adopted)
````
New:
````text
### 4. The documentation findings, D1 to D6 (the gate's words, adopted, except D6's fixture sentence, which is the drafter's)
````

### 7. The gate's notes ("The drafter's unsettled points")

- **PR 358's head and the re-link head:** left to the code's gates. Stop I1 covers the signatures, and the reviewer reads RK-S2's and RK-S3's setup at the build head.
- **Comparing paths with the other held PRs:** left to the custodian, before code (ADV-2026-11-23-15 item 4).
- **E-RK1's fixture:** acted on here, by D-c (item 6) and by ADV-2026-11-23-18 item 3's "bytes before making it" (item 1).
- **Typecheck:** acted on here, by E-A (item 2).
- **Hashes:** left to the form's re-sweep before code (Amendment 3 item 3), `KNOWN-LIMITATIONS.md:507`'s sub-line span included.

### 8. Scope and §7

No file or line is added outside §7's eleven paths, so this amendment makes no class-9 addition. Item 5's preconditions and D-c's zoom steps and records add about 25 lines to path 7 (`frontends/shell/e2e/colour-refill.mjs`). That brings the estimate to about 925, within the ceiling of 980. §7 is not edited, and an overrun is class 8.

### 9. Superseded index

This amendment supersedes:
- §8's bullet on item 51's, item 61's and AC12's words (item 1, ruling item 5);
- Amendment 2 item 5's routing sentence (item 1, ruling item 5);
- in Amendment 2 item 1's New for §4's first paragraph, the sentence ending "gives each test's reason." (E-A);
- the register preamble's observation sentence in Amendment 2 item 3 (E-B);
- Amendment 2 item 6's ceiling sentence (E-C);
- §4 E-RK1's planned-box bullet as Amendment 2's D2 changes it (item 5);
- in Amendment 2 item 2's RK-C preamble, the resize-branch clause and batch B's ring clause (D-a);
- Amendment 2 item 4's New for the §3 App-harness sentence (D-b);
- §4 E-RK1's first bullet (D-c);
- Amendment 2 item 4's heading (D-d).

It adds one bullet to §8 (item 1, ruling item 8).

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — 2026-11-23 — the custodian's, at the commit that files Amendment 4: references only

*Written by the custodian at the commit that files Amendment 4, before any code. References only.*

1. Amendment 4 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-colour-by-refill-keeps-the-view-amendment-4-architect-draft.md` (the hand-back's sha256 72987f6b440c4d6ee818d9eb18c78d41d925a8f290c7ed362afd38d5f1ba63aa): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 2, FAIL (`state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect-attempt-2.md`, gate-log row 871), and the advisor's ruling ADV-2026-11-23-18 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-18-colour-by-refill-open-items-as-recommended-one-ac12-bullet-in-the-sitting-script.md`).
3. Its cites are read at a846072d4be622ade7356d36bccd13c346ffa34a. No hashes are added here: the form's re-sweep before code (Amendment 3) binds them, and the architect's attempt 3 reads each cite at its own commit.
4. Its drafts and the points it could not settle go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. Any finding of its own goes to the architect's attempt 3.
5. Next: the architect's form gate, attempt 3, on Amendment 4. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 6 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 3 (PASS WITH NOTES): that gate's replacement words for N-1 to N-4, carried byte for byte

*Written by the custodian before any code. It carries the attempt-3 gate's own replacement words, each copied by script from the filed report in the report's order; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 3, PASS WITH NOTES (`state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect-attempt-3.md`, gate-log row 876; the hand-back's sha256 a739cc389f3587ba77d7ef603a759eda10b13382ce44cb94bfdd6c6b6d5c9048). It has no Correctness and no Evidence finding. Its four Documentation findings, N-1 to N-4, are to be fixed before the merge and ask for no further attempt (ADV-2026-11-21-20); they are carried here before any code, so the build reads them as the form's text, and the PR body lists them (AUTONOMY §31). Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it.

2. **N-1:** Amendment 4 item 5, its first paragraph: which terminal writes the planned line.

Old:

````text
Every first look's terminal writes `candidate-first-look-view-planned` (`frontends/shell/src/residency/candidateArmSession.ts:1509`), the open's first look included.
````

New:

````text
A first look's Completed terminal writes `candidate-first-look-view-planned` (`frontends/shell/src/residency/candidateArmSession.ts:1509`) when every term at `:1498-1505` holds and a frame and a shown box exist (`:1508`); the open's first look writes one.
````

3. **N-2:** Amendment 4 item 6, D-c's New: what the fit frames.

Old:

````text
The fit frames only the first look's 10,000 rows, which, if they are the file's first rows, lie in the first rows of `parcel()`'s square grid (`engine/src/fixture.rs:1405-1406`), so at about 250,000 features the fit view alone may hold too few rows; I5 governs.
````

New:

````text
The fit frames only the open's first batch, since the auto-fit runs once, on the first batch (`WorkingCanvas.tsx:1817-1819`); that batch holds at most the first look's 10,000 rows, which, if they are the file's first rows, lie in the first rows of `parcel()`'s square grid (`engine/src/fixture.rs:1405-1406`), so at about 250,000 features the fit view alone may hold too few rows; I5 governs.
````

4. **N-3:** Amendment 4 item 1, the item-6 bullet.

Old:

````text
- **Item 6.** The piece is built where §10 (as Amendment 2's D1 changes it) says, with ADV-2026-11-23-17 item 11 for `App.tsx` and `WorkingCanvas.tsx`.
````

New:

````text
- **Item 6.** The piece is built where §10 says, with ADV-2026-11-23-17 item 11 for `App.tsx` and `WorkingCanvas.tsx`. The advisor read §10 at caea224a, before Amendment 2's D1 changed its fallback base and its Ordered bullet; D1 follows ADV-2026-11-23-15 item 4, and it goes to the advisor in the one message of Amendment 5 item 4.
````

5. **N-4:** Amendment 5 item 4: when the drafts go to the advisor.

Old:

````text
4. Its drafts and the points it could not settle go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. Any finding of its own goes to the architect's attempt 3.
````

New:

````text
4. The points it could not settle go to the advisor in one message (ADV-2026-11-23-15 item 8), with Amendment 2's D1 and D6 and Amendment 4's D-c, which ADV-2026-11-23-18 was read before; its drafts go after the build gates' clause check and land in the build's words commit (ADV-2026-11-23-18 item 5). None is ruled here. Any finding of its own goes to the architect's attempt 3.
````

6. **For the advisor**, in the one message N-4's New names: Amendment 2's D1 and D6 and Amendment 4's D-c, which ADV-2026-11-23-18 was read before; the §8 bullet that holds the merge until the advisor rules; and the gate's point on AC12, that in its second cell the view may read the same before and after the fix.
7. **For the code's gates**, as the gate names them: both client sizes recorded at E-RK1's two boxes; RK-A1's typed stand-in at the final candidate; PR 358's head and the re-link head (stop I1).
8. Next: the build, on the base §10 names as Amendment 2's D1 changes it, under ADV-2026-11-23-17 item 11 for `App.tsx` and `WorkingCanvas.tsx`. No build, test or app start runs from 05:00Z on 2026-11-24 until the human says the sitting is over (ADV-2026-11-23-15 item 9).

Read the last amendment first.

Nothing above is edited.
