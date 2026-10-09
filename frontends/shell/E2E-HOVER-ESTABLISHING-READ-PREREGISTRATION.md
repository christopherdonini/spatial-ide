# E2E: K6 (and A9′) take their starting hover id only after the hover pick for the new pointer has run
# (PLAN node e2e-hover-establishing-read-stale)

File: frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md
Authority: the PLAN node e2e-hover-establishing-read-stale; the human's direction of 2026-10-09, items 1 and 2a (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:6-7 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:0861bd514d5168a28a0c5095508971b3f1ecb1b352d60ab25edb1ddf84652404 and state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:9-14 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:334b0d539bd3d563aa179554d4df14d904e8e9fcc61770343af39c92b6b333a3; its RULED 2026-10-09 block in DECISIONS-PENDING.md); the K6 case (iii) ruling, which stands as given (state/directives/2026-10-08-k6-case-iii-ruling.md:6-15 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:aec86de380ae721fcf522c30a532d07132b79233cac7cadbb22e55546a93d2cd; its RULED 2026-10-08 block); the K6 case (v) ruling (state/directives/2026-10-08-k6-case-v-ruling.md:6-20 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:c7e76c209b8be036851ec8c304e35086347e911ce832d876c78cbc195d3a4298).
Drafted by: the architect agent, alone (no engine/ or kernel/ path; product-first direction, section 1); code read at main dba12b8ccac70dd1e7ec50ecc2814a797597836e.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)). Size per §21c is under the threshold and does not decide the form.

## §0. Disclosure

0.1 Inputs.
- The pick-paths diagnosis (state/consults/2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md, §2 to §4). It is evidence, not Authority: its ids, counts and runs are its worker's, and the custodian checked only the code it describes.
- Milestone 1's form, Amendments 6, 7 and 10 to 13 (frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md).
- Milestone 1's worker report 2, section 3, for the launch on this machine.
- The code at dba12b8, listed in 0.3.
- Nothing was run for this form. No pilot, no spike, nothing measured.

0.2 Pins. Every `@ dba12b8…` pin is historical. The worker re-derives each cite at the code branch's base. For the work, the tree at that base is authoritative; for what this form read, the pin is.

0.3 The code as read.
- The poll helper reads once before its first sleep: frontends/shell/e2e/regression.mjs:145-154 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:f885e24f1adbbb50e26bcd035bcef5834608b9adac279762dd2101b32edbee90.
- K6's establishing helper: frontends/shell/e2e/regression.mjs:1093-1138 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:bb0d846bad7d0548f2cfdb004cf92e6ecccc47587070503b83b22d14204d3213.
  - Its attempt loop moves and then polls: frontends/shell/e2e/regression.mjs:1113-1128 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:839518efe4769221da8d052f2a544c94d67319e210a9427dc14df69a70582b7b.
  - Its comment says a fresh pick owns the readout, which is false at the first poll: frontends/shell/e2e/regression.mjs:1116-1118 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:3a369a6af603925b4edf82f11b66c8fa180241f0f7bfcc7092e78802bdf9e8d5.
- Every caller of the helper:
  - frontends/shell/e2e/regression.mjs:1282 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:063a95b7c6d18a0c4b9a8cd5312dc67d44e27066c527b41ea78c97dad566c84e (i);
  - frontends/shell/e2e/regression.mjs:1308 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:8a09a3b899e6b1a5ea55014538021ce6fbd14d75b4f7b1146d2897207f051d4f (iii, whose id case (iv) also compares against at frontends/shell/e2e/regression.mjs:1416 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:f11c9e843eba9fb5ee99facab55d7921f401013f005a6b00ccb1aab1e5da2bd9);
  - frontends/shell/e2e/regression.mjs:1460 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:8143a55d12d072571c01f62b348f9da975534855641a8c6663d857e2b5b72a55 (ii);
  - frontends/shell/e2e/regression.mjs:1474 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:ec2216350c65c9124931a2eccb3a9288cc6f9ed27e76774f76f8a4c6177d33f9 (ii, re-established);
  - frontends/shell/e2e/regression.mjs:1587 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:6de7ca85e0b3838e50576f63dab96ddc1a5f3f8de980c457365c1f08e16f5783 (v, which uses only the helper's `css`, at frontends/shell/e2e/regression.mjs:1624-1625 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:eb60b61accbb27d376dc01a16e82d4bd4b8e5454ec1e6c7a1b5180e467d2d52b and frontends/shell/e2e/regression.mjs:1635 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:862c6c589f62529f00a6a1f6409ed93df8e0162da4369c562f7a1cc215a8bb96).
- Case (iii): frontends/shell/e2e/regression.mjs:1304-1343 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:1765351fe3eb54126374a0c9dbe484bc77ac96ba1b47d009eb62a2a7b45248fc.
  - Its comparison is frontends/shell/e2e/regression.mjs:1321-1343 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:978ff1cefd8a9d2ceb55db039653a50bdff7b7b5b95a2f1c8738771cabb11fe7.
  - Its comment's last sentence names the disagreement node as a diagnosis still to come: frontends/shell/e2e/regression.mjs:1318-1320 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:704871633dbf515b905dbfcd6f466a0884de8ea1cb0cba6b57a7c4b559ebc74d.
- A9′'s candidate loop reads the same way, moving then polling at once: frontends/shell/e2e/regression.mjs:847-870 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:5679b35abe3adc5187f4370a8415bdd022f443a6758601c25102a723dc275335.
- The readout is read by class: frontends/shell/e2e/regression.mjs:1177-1201 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:1e69af8f798c6e6a9a157979a089c8439faf200e643363fb891ec567015043ef.
- The recorded mutations:
  - K6's: frontends/shell/e2e/regression.mjs:1266-1276 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:a7964822a88a8d3434d31bbcd26da40ed73e1798e39cd573b71c45292288f372;
  - A9′'s: frontends/shell/e2e/regression.mjs:724-727 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:05e1d0d5027efbaccff3eef45435f67ce8cb313e4784c38ed13c625dfdc3c151.
- The step bounds: frontends/shell/e2e/regression.mjs:2582 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:733aea4b33de3f947aa6d5bc1811eba178b3a2a61015c04a35df8cd24a6c788f and frontends/shell/e2e/regression.mjs:2598 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:b89f499fbd7ecffb3ccd8bb493ebacecd6dff362a22ad1a4ac3d7cd510ca9d6c.
- Every zoom notch moves the pointer to the canvas centre: frontends/shell/e2e/lib.mjs:581-584 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:be5c21d1be8ea5342d935d1de018c7a916e141f63f7dd17b826d0ffc74346bdd, called from frontends/shell/e2e/lib.mjs:590-595 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:ee887682fe21ed004514dc139562fd8e1879473a56fef55d9dbbe5a2372ccdb1.

0.4 Consuming-side interfaces, read before the barrier is drafted (round 4).
- The product's hover handler: frontends/shell/src/canvas/WorkingCanvas.tsx:1989-2021 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4385c48fc726075627f5ca66b9c9511b7ecc529f42ad63a2b5eb758b0b9ff7fb.
  - It captures the pointer and cancels any pending settle on every call: frontends/shell/src/canvas/WorkingCanvas.tsx:1996-1998 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:f7b9305aa8b4225a45994f4ebc6a65754c96746ff4c663ed186d798fbd22372f.
  - It sends null for an empty pick: frontends/shell/src/canvas/WorkingCanvas.tsx:1999-2001 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4f1dd3d876cccb219abf352540cab161469d968c1c2c8042c20568c3f200d2aa.
- Null renders no `.hover-readout`: frontends/shell/src/canvas/HoverReadoutView.tsx:55 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:87d2f69992cbba05b6aa3dc2e246d6c65ac315627114dc7d7ffc1f61cc6916cd.
- Deck (installed 9.3.9, frontends/shell/package-lock.json:452-454 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4a67a78a4641e3fb3ad70bdeb3c65fa90d1cbac536bf58646e5f8d4cd9ecbf72).
  - Its pointer handler treats `pointerleave` as a pick at (-1, -1).
  - Its hover callback runs with the empty info when nothing is picked.
  - An async pick is dropped once a newer one has started.
  - These are read from `node_modules/@deck.gl/core/dist/lib/deck.js` (lines 146-171, 583-598 and 856-883). That file is untracked: it is cited as the interface's evidence, not as Authority.

0.5 Hypothesis H1 (from the diagnosis, §4). K6 (iii) fails at odd map heights because the first poll after the candidate move reads the readout left by the centre pointer.
- Discriminator: the M1 run (§4) against the clean runs at the same window.

0.6 The reuse index (item 5 of the 2026-10-09 direction). `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c found no prior art for hover pick, e2e, readout or playwright. This is noted and does not block.

0.7 Fixture drive. The 5 GB fixture is not read. The suite reads 100k-happy-path. Nothing is measured.

## §1. May and may not claim

- **May claim:** K6 and A9′ accept a hover id only after the hover pick for the new pointer has run, and the properties §4 tests.
- **May not claim:**
  - any timing figure or duration (ADR-018: every wait is a bound);
  - any performance number or docs/08 row;
  - anything about macOS or Linux (PORTABILITY R5: the e2e runs only on Windows and WebView2);
  - that the product's two pick paths agree beyond what the diagnosis observed.
- **No product, wire, kernel, engine or protocol change.** ADR-018 and ADR-010 rule 6 are cited, and no ADR is amended.

## §2. The change

**2.1 The barrier**, a new function in frontends/shell/e2e/regression.mjs, not exported. Before every candidate move:
1. Read the readout's state and keep it as the standing readout.
2. Move the pointer to a point outside `.working-canvas`.
   - Try first 4 CSS px above the canvas's top edge, at its horizontal centre. Failing that, try 4 CSS px left of its left edge, at its vertical centre.
   - Each point is accepted only if `document.elementFromPoint` there is neither the canvas nor inside it. If neither point qualifies, the step fails by name.
3. Wait, under the bound `HOVER_BARRIER_CLEAR_TIMEOUT_MS` (§7), for the readout state `clear`. If it does not come, fail by name, with the label, the standing readout and the last state seen.
4. Move to the candidate.
5. Run the unchanged poll: same predicate, 5,000 ms.
6. Log one line per attempt (an observation, not asserted):
   - the label;
   - the standing readout before the barrier;
   - whether the barrier saw a change to `clear` or found it clear already;
   - the confirmed id taken, or the last state seen.

**Why this ordering holds, by the interfaces in §0.4:**
- After `clear` is seen, deck's pending request is the leave or a later one.
- The candidate move replaces that request, and every hover call cancels any pending settle re-pick.
- A settle re-pick is armed only while a readout is standing, and none is standing once `clear` is seen.
- So an id read after the candidate move can only come from the hover pick for that pointer, which is item 2a's condition. This holds in sync and async pick modes; the worker records which mode is in force.

**2.2 K6.** `establishAboveThresholdHoverK6` runs the barrier before each flipY attempt. All five callers go through it.
- Nothing else in the helper changes: not the notch loop, the bisection, the interior check, the predicate or the bounds.
- The false comment at 1116-1118 is rewritten to describe the barrier.

**2.3 Case (iii).** Its code from the ASSERTION (iii) comment through its trace check is byte-identical, including its call at 1308, its zoom-in, its comparison and its fragment of the summary string.
- Only the comment's last sentence (1318-1320) may change: it may say the node has since been diagnosed and point to this piece.
- No retry, and no re-established hover (the K6 case (iii) ruling).

**2.4 A9′** (the human's item 2a: it is examined; see OPEN-1).
- Examination: A9′'s first poll can accept the id left by the centre pointer (after a notch) or by the previous attempt. The step then passes, attributing to the candidate an id that the candidate's pick never named. This is a false pass and never a false fail, so reverting the read cannot fail A9′.
- Change: the same barrier before each A9′ candidate move. Nothing else changes: not the predicate, the refusal-continues rule, the notch budget, the clear-over-the-emptiest-cell check or the bounds.
- The report gives, per run, how many A9′ attempts had an id standing before the barrier that differed from the id taken.
- If OPEN-1 is ruled examine-only, A9′ is not edited. The report then gives the same count from the barrier log of K6's calls, plus the code reading above, and the custodian proposes a node.

**2.5 Stages.** Each ends in the worker's report to the custodian.
1. **Read, no code.**
   - Re-derive every cite in §0.3 and §0.4 at the base. A differing interface is invalidator I1.
   - Find a mechanism that gives an odd map height: the diagnosis's scratch overlay, a TAURI_CONFIG window overlay as in report 2, section 3, or another. Record it, uncommitted.
   - Build under a shared hold.
2. **Route A, the leave barrier (§2.1).** One clean run at the odd window.
   - Route A holds if the barrier's log shows at least one change from an id to `clear`, and the run's A9′ and K6 pass.
   - If the barrier's clear-wait fails in a clean run, go to route B.
   - **Route B:** the same barrier, but step 2 moves to an in-canvas pixel whose 5 × 5 neighbourhood `capturePixels` reads as all background, found through the existing hook, test-side. The same pass condition applies. If no such pixel exists at the establishing camera, route B fails.
   - **If A and B both fail, STOP (invalidator I2).** No product code is written under this form (OPEN-2).
   - Not a route: a fixed sleep, or a count of animation frames. Deck picks inside its own frame callback, and React commits the readout in a later scheduler task, so neither one orders the read; each is a wait, not a barrier (OPEN-3).
3. **The runs and mutations of §4,** in the order of the runs table.

**2.6 Portability (R1 to R6).** The piece adds no OS-dependent feature, so R3 is not triggered. It adds no OS-conditional code (R4) and no ignore (R6). Its evidence is Windows and WebView2 e2e only and implies nothing for other platforms (R5). R1 and R2 are untouched.

**2.7 KNOWN-LIMITATIONS.** None. No user-visible behaviour changes, and no existing item covers the readout's first poll.

## §3. Fixtures and predicted outcomes

| Fixture | Use | Prediction |
|---|---|---|
| 100k-happy-path.parquet (sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49, per report 2, section 2) | e2e:regression | unchanged; hashed before and after the runs |
| The regression list's other fixtures | e2e:regression | present; hashed before and after |

## §4. Tests, and one recorded mutation each

Every run is a fresh launch (`launched:true`) of the whole `e2e:regression` suite; A9′ and K6 are steps in it. Each run records:
- the window spec;
- the measured `.working-canvas` CSS size and the `capturePixels` buffer size (the measured map height is authoritative, not the window);
- every step's result;
- the barrier lines.

Each mutation is observed by the human's case (v) method: one application, one run, a restore, and a clean check (`git status --porcelain` and `git diff` empty), recorded with the commit it was observed at. A `verify-mutation` run is not an observation.

**T1. The fixed read reaches the true id.**
- At the odd window (1280 × 801, odd map height): A9′ and K6 pass in 3 of 3 runs, and in 1 of 1 at 1280 × 803.
- At the default window (1280 × 800): A9′ and K6 pass in 2 of 2 runs.
- In each run, K6/re-pick's barrier line gives the standing readout and the id taken. The id taken is the true id: the hover pick for the candidate pointer named it, and the settle re-pick that (iii)'s trace check requires names it too.
- **Mutation M1 (item b of the brief): restore the first-poll read.** Delete the barrier call from the K6 helper, leaving the base's move-then-poll. At the odd window, K6 fails at the message beginning at frontends/shell/e2e/regression.mjs:1332 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:c41854e504d79b785a01ce66e289c4739845f312cc30c57972c73d6715f712c1.
  - The expected id is the standing id; the last seen id is the true one.
  - The stale read is a race, so if the first run passes, up to two more runs are made under the same application. Every run is recorded, and the first failing run is the observation.
  - 0 failures in 3 runs is invalidator I4.

**T2. The barrier's own guard.**
- **Mutation M-B:** delete only the leave move, and keep the clear-wait.
- At the odd window, the first establishing call with an id standing fails by name at the clear-wait (§2.1, step 3).
- It is observed at the odd window because at even heights the centre stands on a gap and the readout is already clear (§5, P3).

**T3. K6 still catches what it exists to catch** (no case becomes vacuous). All at the default window, one run each, product lines applied and reverted, never committed:
- **M2 (new, case (iii)):** the settle re-pick picks at the stored pixel moved +40 CSS px in x, at frontends/shell/src/canvas/WorkingCanvas.tsx:1190 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:17a5d219eb85bb3ecbd75d86342066a9be99742a3a9710a1f619f8fc9a438d08.
  - Why 40 px: a feature at the established camera spans at most about 19 px (fixture extent ≤ 33.6 m at zoom about -0.85, from the comment at frontends/shell/e2e/regression.mjs:717-723 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:fa7b14c5e217443faa07578397a0c3f1fcdcdf5dee9fb60d490a5c361b1fd3ea), so the offset pixel lies on another feature or on a gap.
  - Prediction: K6 fails at K6/re-pick, the message at :1332. This is the product's two pick paths disagreeing, which the ruling says (iii) must keep showing. If K6 fails at an earlier case, STOP and report.
- **M3 (recorded, case (ii)):** the marker span deleted from frontends/shell/src/canvas/HoverReadoutView.tsx:88 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:7162e3dc999871b39b4b8dae9743c94fb431d3531c3e9da2ddea2c6cfce4292b. Prediction: the recorded K6/discrete message.
- **M4 (recorded, case (v)):** `lastPointerPxRef.current = null;` deleted at frontends/shell/src/canvas/WorkingCanvas.tsx:1860 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:f50ebabd3c3efdccbcc396a185516ce6acc546de1beb82b824e7db709b201a4f. Prediction: the recorded K6/release-edge message.
- **M5 (recorded, A9′ and K6's establishing, only if A9′ is changed):** `isBelowPickResolution` returns `true`, at frontends/shell/src/canvas/pickResolution.ts:204-206 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:7904554dd5e248101b430c9ef6a0c43d12cc1667711f1686d682927d8b92ddb8. Prediction: A9′ times out, and K6/continuous names no above-threshold candidate.
- **Cases (i) and (iv)** have no recorded mutation, and none is added.
  - The barrier changes neither assertion. (i) asserts only the refusal after a fit.
  - (iv)'s reference id becomes the true id rather than a possibly stale one.
  - Their clean-run summaries must show each case reached an outcome; for (iv), the outcome string.

The recorded-mutation comment beside the K6 helper names M1, M-B and M2 and the commit each was observed at. M3 to M5 update the existing comments' observation commits.

**Runs**, all e2e:regression, each inside a shared hold:

| # | Window | What | Runs |
|---|---|---|---|
| 1 | 1280 × 801 | route A check (stage 2) | 1, counted in row 2 |
| 2 | 1280 × 801 | T1 clean | 3 |
| 3 | 1280 × 803 | T1 clean | 1 |
| 4 | 1280 × 800 | T1 clean | 2 |
| 5 | 1280 × 801 | M1 | 1 to 3 |
| 6 | 1280 × 801 | M-B | 1 |
| 7 | 1280 × 800 | M2, M3, M4, M5 | 1 each |

- **A result** at a window is every listed clean run passing A9′ and K6.
- **Steps other than A9′ and K6** are recorded, not judged. At 1280 × 800 they are compared with the known base failures (milestone 1 Amendment 11, item 3).
- **If 1280 × 801 does not give an odd map height,** the worker uses the first of 799, 803 or 805 that does, and records it as class 2.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted** (a wrong prediction is a result):
- **P1:** M1 fails as T1 says.
- **P2:** at the odd heights, in at least one run, K6/re-pick's standing readout before the barrier is an id different from the id taken.
- **P3:** at 1280 × 800, K6/re-pick's standing readout before the barrier is `clear`.
- **P4 to P7:** M-B, M2, M3 and M4 (and M5, if A9′ changes) fail as §4 says.

**Declared unchanged:**
- Case (iii)'s comparison and every non-comment line of case (iii) (§2.3). The PR body says (iii) is unchanged and names the diagnosis node.
- Every K6 and A9′ assertion, predicate, timeout, notch count and constant (K6_*, MAX_ZOOM_NOTCHES, the 5,000 ms and 10,000 ms waits, the 120 s and 240 s step bounds).
- Every file other than frontends/shell/e2e/regression.mjs and this form, apart from PLAN, records and generated files. That includes lib.mjs, source-changed.mjs, residency-harness.mjs, src/**, src-tauri/**, tauri.conf.json, package.json and the lockfile.
- Milestone 1's Amendment 6, item 2, for every case but (iii).

**Invalidators.** Each means STOP and report.
- **I1:** an interface in §0.4 differs at the base.
- **I2:** routes A and B both fail (§2.5). This is the item 2a condition; no product code follows under this form.
- **I3:** an edit is needed outside §2's lines, or to case (iii)'s code.
- **I4:** M1 does not fail in 3 runs.
- **I5:** with the barrier in place, a clean run fails K6 at K6/re-pick. This may be the product's pick paths really disagreeing, which (iii) exists to show. It is recorded as class 2 and goes to the human; nothing is bent.
- **I6:** A9′ or K6 fails in a clean run at 1280 × 800, or a step bound is reached. Recorded as class 2; no bound is tuned.
- **I7:** no odd map height is reachable.

**Shared runs.** Under the machine paragraph, a timing-sensitive failure seen in a shared run is not recorded as a failure; it is reported to the custodian, who decides whether to re-run it alone. That applies to M1's observation and to I5.

**Falsification.** The form is wrong if, with the barrier in place, K6/re-pick still fails at odd map heights: the stale read would then not be the cause, and the diagnosis's verdict would not hold for this case.

## §6. Instruments

- **Assertions:** K6's and A9′'s, unchanged, and the barrier's two named failures (no point outside the canvas; no clear within the bound).
- **Observations, not asserted:** the barrier log lines, the map and buffer sizes, the pick mode.
- **Measurements:** none.

## §7. Declared values and ceilings

| Constant | Value | Bounds |
|---|---|---|
| HOVER_BARRIER_CLEAR_TIMEOUT_MS | 5,000 | the wait for `clear` after the pointer leaves the canvas; a harness bound (ADR-018), the same as the existing id wait |
| The off-canvas offset | 4 CSS px | the distance outside the canvas edge at which the leave point is taken |

**Budget.** Insertions plus deletions per §21c, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md'`, where `<base>` is the merge base with origin/main when the branch is cut.
- frontends/shell/e2e/regression.mjs: 1 file, at most 140 lines.
- An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight

1. A file edited outside frontends/shell/e2e/regression.mjs and this form, apart from PLAN, records and generated files.
2. A change to a non-comment line of case (iii), or to its comment beyond 1318-1320.
3. A retry, or a re-established hover, inside case (iii).
4. Any product code committed (src/**, src-tauri/**), or a product mutation left applied.
5. A change to an assertion, predicate, timeout, notch count or step bound of K6 or A9′, other than the barrier's own.
6. A fixed sleep or a frame count used as the barrier.
7. A K6 or A9′ attempt that takes an id without its barrier line.
8. A timing figure asserted or reported.
9. A new or changed test without its observed mutation, or a record that calls a `verify-mutation` run an observation.
10. An export, option or parameter without a caller.
11. A dependency or lockfile change.
12. A quote of the human's words marked verbatim that does not match its source.
13. An edit to source-changed.mjs or residency-harness.mjs (same pattern, out of scope).

## §9. Gates

- **Architect and reviewer,** full gating, verdicts per the product-first direction, section 2: Correctness or Evidence blocks, and a documentation or record finding is fixed in the same PR before the merge. Each checks §8 item by item. The reviewer also checks §2.3 by diff.
- **Suites,** green first:
  - frontends/shell `npm run verify`;
  - the runs table, listed in the PR body with every run's result;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each tool named with its commit.
- **Operator:** none. There is no user-visible change.
- **Owner's index:** none was found for frontends/shell. If the custodian names one, the worker updates it in this PR.

## §10. Amendments

Opens empty, append-only.

## §11. Open items for the human

- OPEN-1 (A9′ fixed or examined only). Recommended: fixed (§2.4).
- OPEN-2 (the product route, if I2). Recommended: back to the human before any product code.
- OPEN-3 (frame counts). Recommended: not a way (§2.5).

None is a red line. Each answer is recorded as Amendment 1 before dispatch if it narrows §2.

## §12. Heavy runs

The worker's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for builds.
