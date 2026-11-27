*Filed by the custodian: the architect's draft of Amendment 2 to `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md`, after the architect's form gate, attempt 1 (FAIL; `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect.md`, gate-log row 865), node:colour-by-refill-keeps-the-view@amendment-2-architect-draft, dispatched at 2026-11-23T15:36:44Z. Its run: Read 37, Grep 21, Glob 4, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:36:44Z to 2026-11-23T15:45:52Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 24447 bytes, sha256 ef42c4365ade11aa676fd000ef590795a5da16a6208e897b5a05f6d2a76a35fd, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 3 follows it.*

---

Result: main @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e (detached read worktree): Amendment 2 is drafted. It adopts the gate's red-before/guard split (E1) and its new mutation rows (E2), with three corrections. The gate's RK-C2 condition pointed the wrong way, and RK-C4 and RK-C5 had a known pass case the gate did not flag. It adopts the D1 to D6 words; D6 is completed with an existing fixture mode and no edit outside Scope. It adds no file and no class-9 scope addition, and §7's ceilings hold.

---AMENDMENT 2---
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
---END OF AMENDMENT---

**What I could not settle:**
- **PR 358's head and the re-link head (not read).** RK-S2 and RK-S3 (b) are drafted against main. PR 358 sets the earlier look aside, which may change how an earlier look's batch reaches `latestUnionedExtent` before the refill. Stop I1 covers this at the build head.
- **The other held PRs.** Without a shell I did not compare this form's paths with the files changed by PRs 350, 353, 356, 360, 361 and 362. Under ADV-2026-11-23-15 item 4, that comparison is the custodian's to do before code.
- **E-RK1's fixture.** I could not settle whether a `MultiType` file reaches the not-held fact at an ordinary view. The first look's 10,000-row fit may frame only part of the grid, so the operator step may need a zoom out first. I5 governs this. The figure of roughly 250,000 rows is an estimate (268,435,456 bytes at about 1.06 KiB per row), not a measurement.
- **Typecheck.** I did not check whether `npm run typecheck` (`tsc --noEmit`) includes test files. If it does, the new tests fail the typecheck at the build head. That is not a test's red before the change and does not trigger I4.
- **Hashes.** The span hashes for every `path:line` above, including the sub-line span of `KNOWN-LIMITATIONS.md:507`, are for the custodian to compute at filing. I have no shell.

Files read (under C:/dev/wt/read-1123c at b42c0ed7):
- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md
- the gate report (scratchpad)
- frontends/shell/src/canvas/WorkingCanvas.tsx
- frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx
- frontends/shell/src/residency/candidateArmSession.ts
- frontends/shell/src/App.tsx
- frontends/shell/src/App.reopen.test.tsx
- frontends/shell/src/App.colour.test.tsx
- frontends/shell/src/testUtils/attributeBatchIpc.ts
- frontends/shell/src/testUtils/batchFixtures.ts
- frontends/shell/src/canvas/tileIngest.ts
- frontends/shell/src/canvas/limits.ts
- frontends/shell/src/canvas/extent.ts:90-92
- frontends/shell/src/diagnostics/renderTrace.ts
- frontends/shell/vitest.config.ts
- frontends/shell/package.json
- engine/src/fixture.rs
- KNOWN-LIMITATIONS.md:463-467, :505-507
- frontends/shell/MANUAL-WALKTHROUGH.md:1994-1998
- ADV-2026-11-23-15
- ADV-2026-11-14-15 item 8
- ADV-2026-11-16-06 item 4
- governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md (searched)
- governance/AUTONOMY.md §21a and §21c headings

Model: claude-opus-5-5 (Opus 5.5).
