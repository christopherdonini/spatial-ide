*Custodian's filing note (2026-10-09): the architect's draft of `e2e-hover-establishing-read-stale`'s preregistration, on the custodian's brief at main dba12b8c, drafted alone. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b5520f5d961460b1fb23ebbfbd4b5ee164f33d58a68d8e6842ce15a0f6008a54. Write audit PASS: zero write calls (Read 34, Grep 21, SubagentHandback 1). Run window from the transcript: 2026-10-09T05:18:44Z to 05:28:59Z. The form as committed, `frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md`, is part 2's block with its 39 pins computed at dba12b8c, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 7df18fb92771a22d578e8230f76f10abd45c5eefa9f339b77b50fa95daffc817). Part 1's path into the installed deck.gl package names an untracked file; the form cites that file by name and line numbers in words, not as a pin.*

---

Reviewed: main @ dba12b8ccac70dd1e7ec50ecc2814a797597836e

## 1. Which form, and why

**Full form, with full gating (reviewer and architect), from dispatch.**

- **The guarantee category is touched.** `AUTONOMY.md` §21a counts any property currently under test as a stated guarantee. K6 is the end-to-end evidence for the hover re-pick contract: entry 47, B1's labelled state, and Amendments 3 and 5 of the hover-repick form. Changing how K6 takes its starting id changes what K6 can show, even though no assertion and no product line changes. The diagnosis shows this: the same case fails at odd map heights and passes at even ones purely because of how it takes that id. So the piece touches the evidence for a guarantee.
- **The five-line form is closed.** §21b allows a single gate only for tests that touch none of the four categories. An honest `Out-of-scope` line could not say the guarantee is untouched, so §25(e) sends the piece to the full form from dispatch.
- **Size, by §21c, is not what decides it.** I estimate about 100 lines in one file, tests counted, which is under the threshold. The category alone decides the form.
- **How the form carries the human's last bound** (item 2a: no product code unless the form shows the test-side ways fail). §2 sets out stages. Stage 2 tries route A, then route B, each with a pass condition the run can observe. If both fail, invalidator I2 stops the piece before any product code, and §8 item 4 blocks product code on sight. The product route itself is not declared in this form (OPEN-2).

**Decisions that are the human's:**
- OPEN-1: whether A9′ gets the fix or is examined only.
- OPEN-2: how the product route is taken if both test-side routes fail.
- OPEN-3: whether the frame-count route must be tried before any product code.

**What I checked against the code at dba12b8:**
- **The seam (round 4).** Deck's `pointerleave` sets the pick request to (-1, -1). This is `frontends/shell/node_modules/@deck.gl/core/dist/lib/deck.js:146-171`, an untracked installed file, cited as evidence of the interface and not as Authority, at the lockfile's 9.3.9 (`frontends/shell/package-lock.json:452-454`).
  - The deck-level `onHover` gets `emptyInfo` when nothing is picked (deck.js:583-598).
  - An async pick is dropped if a newer pick has started (deck.js:856-883).
  - `WorkingCanvas.tsx` sends a null readout for an empty pick, and `HoverReadoutView.tsx:55` then renders nothing.
  - No layer sets its own `onHover`, so nothing can suppress the deck-level call.
- **The PLAN node's `budget_minutes: 60` is far below the runs this form needs** (about 12 to 14 regression runs plus builds). The budget is the custodian's to set.

## 2. The draft

````markdown
# E2E: K6 (and A9′) take their starting hover id only after the hover pick for the new pointer has run
# (PLAN node e2e-hover-establishing-read-stale)

File: frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md
Authority: the PLAN node e2e-hover-establishing-read-stale; the human's direction of 2026-10-09, items 1 and 2a (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:6-7 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD and state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:9-14 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD; its RULED 2026-10-09 block in DECISIONS-PENDING.md); the K6 case (iii) ruling, which stands as given (state/directives/2026-10-08-k6-case-iii-ruling.md:6-15 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD; its RULED 2026-10-08 block); the K6 case (v) ruling (state/directives/2026-10-08-k6-case-v-ruling.md:6-20 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD).
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
- The poll helper reads once before its first sleep: frontends/shell/e2e/regression.mjs:145-154 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- K6's establishing helper: frontends/shell/e2e/regression.mjs:1093-1138 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - Its attempt loop moves and then polls: frontends/shell/e2e/regression.mjs:1113-1128 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - Its comment says a fresh pick owns the readout, which is false at the first poll: frontends/shell/e2e/regression.mjs:1116-1118 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- Every caller of the helper:
  - frontends/shell/e2e/regression.mjs:1282 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD (i);
  - frontends/shell/e2e/regression.mjs:1308 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD (iii, whose id case (iv) also compares against at frontends/shell/e2e/regression.mjs:1416 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD);
  - frontends/shell/e2e/regression.mjs:1460 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD (ii);
  - frontends/shell/e2e/regression.mjs:1474 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD (ii, re-established);
  - frontends/shell/e2e/regression.mjs:1587 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD (v, which uses only the helper's `css`, at frontends/shell/e2e/regression.mjs:1624-1625 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD and frontends/shell/e2e/regression.mjs:1635 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD).
- Case (iii): frontends/shell/e2e/regression.mjs:1304-1343 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - Its comparison is frontends/shell/e2e/regression.mjs:1321-1343 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - Its comment's last sentence names the disagreement node as a diagnosis still to come: frontends/shell/e2e/regression.mjs:1318-1320 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- A9′'s candidate loop reads the same way, moving then polling at once: frontends/shell/e2e/regression.mjs:847-870 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- The readout is read by class: frontends/shell/e2e/regression.mjs:1177-1201 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- The recorded mutations:
  - K6's: frontends/shell/e2e/regression.mjs:1266-1276 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD;
  - A9′'s: frontends/shell/e2e/regression.mjs:724-727 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- The step bounds: frontends/shell/e2e/regression.mjs:2582 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD and frontends/shell/e2e/regression.mjs:2598 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- Every zoom notch moves the pointer to the canvas centre: frontends/shell/e2e/lib.mjs:581-584 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD, called from frontends/shell/e2e/lib.mjs:590-595 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.

0.4 Consuming-side interfaces, read before the barrier is drafted (round 4).
- The product's hover handler: frontends/shell/src/canvas/WorkingCanvas.tsx:1989-2021 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - It captures the pointer and cancels any pending settle on every call: frontends/shell/src/canvas/WorkingCanvas.tsx:1996-1998 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - It sends null for an empty pick: frontends/shell/src/canvas/WorkingCanvas.tsx:1999-2001 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- Null renders no `.hover-readout`: frontends/shell/src/canvas/HoverReadoutView.tsx:55 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
- Deck (installed 9.3.9, frontends/shell/package-lock.json:452-454 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD).
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
- **Mutation M1 (item b of the brief): restore the first-poll read.** Delete the barrier call from the K6 helper, leaving the base's move-then-poll. At the odd window, K6 fails at the message beginning at frontends/shell/e2e/regression.mjs:1332 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - The expected id is the standing id; the last seen id is the true one.
  - The stale read is a race, so if the first run passes, up to two more runs are made under the same application. Every run is recorded, and the first failing run is the observation.
  - 0 failures in 3 runs is invalidator I4.

**T2. The barrier's own guard.**
- **Mutation M-B:** delete only the leave move, and keep the clear-wait.
- At the odd window, the first establishing call with an id standing fails by name at the clear-wait (§2.1, step 3).
- It is observed at the odd window because at even heights the centre stands on a gap and the readout is already clear (§5, P3).

**T3. K6 still catches what it exists to catch** (no case becomes vacuous). All at the default window, one run each, product lines applied and reverted, never committed:
- **M2 (new, case (iii)):** the settle re-pick picks at the stored pixel moved +40 CSS px in x, at frontends/shell/src/canvas/WorkingCanvas.tsx:1190 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD.
  - Why 40 px: a feature at the established camera spans at most about 19 px (fixture extent ≤ 33.6 m at zoom about -0.85, from the comment at frontends/shell/e2e/regression.mjs:717-723 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD), so the offset pixel lies on another feature or on a gap.
  - Prediction: K6 fails at K6/re-pick, the message at :1332. This is the product's two pick paths disagreeing, which the ruling says (iii) must keep showing. If K6 fails at an earlier case, STOP and report.
- **M3 (recorded, case (ii)):** the marker span deleted from frontends/shell/src/canvas/HoverReadoutView.tsx:88 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD. Prediction: the recorded K6/discrete message.
- **M4 (recorded, case (v)):** `lastPointerPxRef.current = null;` deleted at frontends/shell/src/canvas/WorkingCanvas.tsx:1860 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD. Prediction: the recorded K6/release-edge message.
- **M5 (recorded, A9′ and K6's establishing, only if A9′ is changed):** `isBelowPickResolution` returns `true`, at frontends/shell/src/canvas/pickResolution.ts:204-206 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD. Prediction: A9′ times out, and K6/continuous names no above-threshold candidate.
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

The worker's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:HASH-TBD. This form names no other rule for builds.
````

## 3. Open items

**OPEN-1: is A9′ fixed or only examined?**
- Options:
  - (a) Apply the same barrier, with nothing else changed (§2.4).
  - (b) Examine and report only, and propose a node.
- Recommendation: (a). The defect is the same, it costs about 6 lines through the same helper, and A9′'s read is not covered by any ruling. The stale read can make A9′ pass on an id the candidate never named, which is an Evidence risk. Item 2a says only that the piece examines A9′, so the scope is the human's to narrow.
- Not a red line.
- What waits: nothing, unless the human narrows before dispatch; a narrowing is then recorded as Amendment 1 (class 5).

**OPEN-2: the product route, if routes A and B both fail.**
- Options:
  - (a) The custodian records the showing as a post-result amendment and declares a DEV-only accessor before code, in the shape class 9 asks for, under item 2a.
  - (b) It goes back to the human before any product code.
- Recommendation: (b). A new hook on the DEV-only e2e test surface sits next to the exposure posture under ADR-020 / docs/09. It costs nothing unless I2 fires, and the code reading in §0.4 makes route A very likely to hold.
- Not a red line.
- What waits: only the product route, and only if I2 fires.

**OPEN-3: must the frame-count route be tried first?**
- Options:
  - (a) The form's rejection stands: a frame count is a wait, not an ordering.
  - (b) The human requires it to be tried before any product code.
- Recommendation: (a).
- Not a red line.
- What waits: nothing.

**Findings for the custodian (not the human's):**
- The same first-poll pattern is in frontends/shell/e2e/source-changed.mjs:383-394 and frontends/shell/e2e/residency-harness.mjs:1589-1601 (both @ dba12b8). They are out of scope here, and I suggest a proposed node.
- The PLAN node's `budget_minutes: 60` does not cover about 12 to 14 regression runs plus the odd-window builds.

## 4. Files read

- C:\dev\spatial-ide\state\directives\2026-10-09-slot-orders-pilot-and-reuse-standing-step.md
- C:\dev\spatial-ide\state\consults\2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md
- C:\dev\spatial-ide\state\directives\2026-10-08-k6-case-iii-ruling.md
- C:\dev\spatial-ide\state\directives\2026-10-08-k6-case-v-ruling.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (the RULED 2026-10-09 and 2026-10-08 blocks)
- C:\dev\spatial-ide\PLAN.yaml (the node's block)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md (header, §0 to §1, §5 to §12, Amendments 6 to 13)
- C:\dev\spatial-ide\frontends\shell\e2e\regression.mjs (145-154, 560-1885, 2459-2618)
- C:\dev\spatial-ide\frontends\shell\e2e\lib.mjs (1-150, 330-596)
- C:\dev\spatial-ide\frontends\shell\e2e\source-changed.mjs (370-399)
- C:\dev\spatial-ide\frontends\shell\e2e\residency-harness.mjs (1585-1609)
- C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx (1140-1199, 1980-2029)
- C:\dev\spatial-ide\frontends\shell\src\canvas\HoverReadoutView.tsx (55-94)
- C:\dev\spatial-ide\frontends\shell\src\canvas\pickResolution.ts (204-206)
- C:\dev\spatial-ide\frontends\shell\src-tauri\tauri.conf.json
- C:\dev\spatial-ide\frontends\shell\package-lock.json (452-454)
- C:\dev\spatial-ide\frontends\shell\node_modules\@deck.gl\core\dist\lib\deck.js (146-172, 583-598, 856-883)
- C:\dev\spatial-ide\state\consults\2026-10-08-shell-migration-milestone-1-worker-report-2.md (1-70)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\AUTONOMY.md (§21 to §22, §25)
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md (§2)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (searched for hover and re-pick)
- C:\dev\spatial-ide\frontends\shell\e2e\README.md (searched)
