*Filed by the custodian: the architect's draft of Amendment 4 to `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md`, after the architect's form gate, attempt 2 (FAIL; `state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect-attempt-2.md`, gate-log row 871) and the advisor's ruling ADV-2026-11-23-18 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-18-colour-by-refill-open-items-as-recommended-one-ac12-bullet-in-the-sitting-script.md`), node:colour-by-refill-keeps-the-view@amendment-4-architect-draft, dispatched at 2026-11-23T16:51:12Z. Its run: Read 24, Grep 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:51:15Z to 2026-11-23T16:57:44Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 16714 bytes, sha256 72987f6b440c4d6ee818d9eb18c78d41d925a8f290c7ed362afd38d5f1ba63aa, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 5 follows it.*

---

Result: Amendment 4 is drafted, read-only at main @ a846072d4be622ade7356d36bccd13c346ffa34a (detached worktree C:/dev/wt/read-1123e). It records the ADV-2026-11-23-18 rulings, adopts E-A to E-C and D-a to D-d, and adds one point of my own on E-RK1 (item 5 below) for the concurrency ground.

---AMENDMENT 4---
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
---END OF AMENDMENT---

**What I could not settle**
- **What the advisor read.** ADV-2026-11-23-18 names its read at main caea224a and lists the form's sections 1, 2, and 7 to 12, with no amendment. The commit log at session start suggests Amendment 2 (with D3 to D5 and the fourth draft, item 61's third sentence) was filed only at a846072d. If so, the advisor's item 5 counts three drafts without having seen Amendment 2's changes or the fourth. Item 5 rules the drafts from the filed text after the build gates, so nothing blocks. The custodian should confirm this and say so when sending the words.
- **The merge bullet in §8 is my reading.** The new §8 words block a merge before the advisor has ruled the words. Item 5 says the build does not wait, and says nothing about the merge. If that is too strict, the custodian or advisor can strike the clause.
- **How E-RK1 launches the app.** I did not read `e2e/lib.mjs` or `e2e/README.md`. That the typecheck does not touch E-RK1's launch rests only on `frontends/shell/src-tauri/tauri.conf.json:7` (`beforeDevCommand` is `npm run dev`, which runs vite and no tsc), and assumes the suites launch through `tauri dev`. The worker confirms this at the build head.
- **Not checked: RK-A1's typed stand-in.** I did not check whether the `WorkingCanvasHandle`-typed stand-in with a reset parameter typechecks after the change. That is for the code's gates.
- **Not read:** PR 358's head and the re-link head (stop I1 and the code's gates cover them).

**Drafts for the advisor** (none is the human's wording or the advisor's; none is ruled here):
- Item 51's sentence: §2.6's draft as Amendment 2's D3 changes it.
- Item 61's span: §2.6's draft as Amendment 2's D4 changes it.
- Item 61's third sentence (`KNOWN-LIMITATIONS.md:507`): goes unreworded. A card change also arms the fit.
- AC12's third cell: §2.6's draft as Amendment 2's D5 changes it. A point for the advisor, not ruled: AC12's second cell still ends with the step "Then pan or zoom once." (`frontends/shell/MANUAL-WALKTHROUGH.md:1998`), and the draft third cell no longer says what that step shows.

Model: claude-opus-5-5 (Opus 5.5).
