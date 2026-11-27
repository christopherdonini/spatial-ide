Reviewed: main at a846072d4be622ade7356d36bccd13c346ffa34a, in the detached read worktree C:/dev/wt/read-1123e (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 3, attempt 2, node:colour-by-refill-keeps-the-view@form-gate-architect-2, dispatched at 2026-11-23T16:37:08Z; its run: Read 40, Grep 16, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:37:08Z to 2026-11-23T16:48:37Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13982 bytes, sha256 25ebae8dccee8096a1f5c3bfd967918c6754d5c31d82693d37a5aeefb253e2da, byte for byte, nothing masked, with one final newline added. FAIL: E-A (the red-before, guard and mutation runs must be npx vitest run, since npm test typechecks all of src first), E-B (M-S1 set spans two test files) and E-C (the ceiling claim under OPEN-3 (b) untrue by the form estimates); no Correctness finding; D-a to D-d Documentation; the OPEN items read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123e @ a846072d4be622ade7356d36bccd13c346ffa34a

The form is `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md`, with Amendment 2 (lines 393-705) and Amendment 3 (lines 707-719). There are no Correctness findings. The gate fails on three Evidence findings, E-A to E-C. Each is a matter of wording in the test plan, and the exact replacement words are given below. There are also four Documentation findings, D-a to D-d, each must-fix before the merge. None of these words is the human's or the advisor's. AUTONOMY §31 does not reach the E findings because they are Evidence, so attempt 3 re-checks only the applied words.

## What holds

**Attempt-1 findings, by id:**
- **E1 is answered, except for E-A.** The split is right against the code:
  - Today's reset takes no option (`WorkingCanvas.tsx:1660-1664`), and neither does `reissueUnrestricted` (`candidateArmSession.ts:250`).
  - So RK-C1, RK-S1, RK-A1 and E-RK1 are red before the change. RK-C1 is red because B refits through `:1662` and `:1817-1819`. RK-S1 is red because the reset is called bare at `:1745`. RK-A1 is red because of the three arguments at `App.tsx:2145` and the two at `:1801`. E-RK1 is red because of the refit.
  - The seven guards are green before the change and after it. Each guard's reason holds: `:1661`, `:1663`, `:1662`, `candidateArmSession.ts:1749` and `:1758`, and the plain post-issue reset at `App.tsx:1136-1139`.
  - The new I4 words are sound.
- **E2 is answered, except for E-B.** I traced each re-aimed row for a pass case and found none:
  - **RK-C1:** the refit to B changes `cameraRef`, and the count of `onViewShown` rises (`WorkingCanvas.tsx:1458`).
  - **RK-C2:** `unionedExtent` is the prior anchor joined with B (`tileIngest.ts:180`), and `chooseFitTarget` returns its input (`extent.ts:90-92`).
  - **RK-C3:** the area is asserted before the reset, and the shrink takes the within branch (`WorkingCanvas.tsx:2117-2119`).
  - **RK-C4 and RK-C5:** counted through `onViewShown`.
  - **RK-S1:** called with `undefined`.
  - **RK-S2:** term (iv) at `candidateArmSession.ts:1501`, and `hasPlanned` is set true only at `:1564`, by the earlier look's terminal plan (`:1510`).
  - **RK-S3 (b):** under M-S3, `establishFrameFromExtent` gets the earlier look's union (`:1429-1431`, `:1234-1258`) and writes the line.
  - **RK-A2:** the session's reset carries the binding's option.
- **D1 to D5 are answered,** in the gate's words, byte for byte with the attempt-1 report.
- **D6 is answered, except for D-c.**

**The drafter's corrections:**
- **RK-C2's condition is right.** The union of A and B equals B exactly when A lies inside B, so the condition must be that A is not inside B. The gate's wording allowed a pass case.
- **RK-C4 and RK-C5 are right to count `onViewShown`.** A fit to the same extent writes the same camera.
- **RK-S3 is right on both points.**
  - Fresh sessions are needed because part (a) delivers the terminal, which builds the frame.
  - The earlier look's terminal must not be delivered: before the refill it would build the frame, and as an orphan it writes the line itself, because that call is not gated on `wasCurrent` (`:1429-1431`).
- **The App harness premise is true.** The reopen client throws on `viewportQuery` (`App.reopen.test.tsx:79-82`), and the colour client mints (`App.colour.test.tsx:61-64`, `:73-79`). Its gaps are D-b.

**Old texts, placement and scope:**
- Every Old text in Amendment 2 occurs once above it. Where a prefix repeats, at lines 76 and 129, the full Old strings differ.
- Each addition is placed by section, and the superseded index is present.
- No file is added, and there is no class-9 addition: `MultiType` is an existing mode (`engine/src/fixture.rs:187`), and the generator at path 9 already uses it (`kernel/tests/manual_walkthrough_fixtures.rs:768`).
- The ceiling claim for OPEN-3 (b) is E-C.

**The constitution:** no wire or MCP change, and no undo class. The class stays full under §21a and §21c.

## Findings

### E-A (Evidence; Amendment 2 item 1, E1's answer): a typecheck at the build head bears on I4

`tsconfig.json:19` includes all of `src`, so the new test files are typechecked. At the build head the tests call `resetFitForNewGeneration` with an argument, but the method takes none (`WorkingCanvas.tsx:193`). They also call `reissueUnrestricted` with three arguments, but it takes two (`candidateArmSession.ts:250`). So the typecheck fails.

The answer cites `package.json:16`, the `test` script. But `npm test` runs `pretest` (`:15`), which runs the build (`:14`), and the build starts with `tsc --noEmit`. So at the build head `npm test` reports no test result at all, and every test, guards included, reads as failed. That trips the new I4, or records a red-before that is really a type error. The form must name the command for these runs.

```text
the register in Amendment 2 item 3 gives each test's reason.
```
```text
the register in Amendment 2 item 3 gives each test's reason. Every red-before, guard and mutation run is `npx vitest run <file>` in `frontends/shell`, never `npm test`: `npm test` runs `pretest` (`frontends/shell/package.json:15`), whose build typechecks all of `src`, the test files included (`package.json:14`, `frontends/shell/tsconfig.json:19`), and at the build head the new tests' extra arguments do not typecheck, so `npm test` there reports no test. That typecheck failure is not a test's red and does not trigger I4.
```

### E-B (Evidence; Amendment 2 item 3, the register): M-S1's predicted set cannot be observed as written

M-S1 is predicted to fail RK-S1 and RK-A1. But the rule is that each observation runs the named test's whole file. RK-S1's file is the session test, and RK-A1 is in `App.colourRefill.test.tsx`, so RK-A1 is never run under M-S1. RK-A1 does fail under M-S1, because the stand-in records a reset with no `keepCamera`.

```text
Each observation runs the named test's whole file and records every test that fails, by name.
```
```text
Each observation runs the whole file of every unit test in the mutation's set (for M-S1, both `candidateArmSession.refillKeepsView.test.ts` and `App.colourRefill.test.tsx`) and records every test that fails, by name.
```

### E-C (Evidence; Amendment 2 item 6): the claim that the ceiling holds under OPEN-3 (b) is not true by the form's own estimates

§7's estimates for paths 1 to 6, 10 and 11 (lines 218-228) sum to about 608. Adding the 60 lines makes about 668, which is over the 650 ceiling for (b). This is a claim of a limit, so it is never a Documentation finding.

```text
which brings the total to about 900. The ceiling of 980, and of 650 under OPEN-3 (b), holds.
```
```text
which brings the total to about 900, and the ceiling of 980 holds under OPEN-3 (a). Under OPEN-3 (b) the estimate is about 670 (§7's estimates for paths 1 to 6, 10 and 11, about 610, plus these 60), over that option's ceiling of 650, which this amendment does not change: if (b) is ruled, stop I3 is expected, and an overrun is class 8.
```

### D-a (Documentation; Amendment 2 item 2, the RK-C preamble)

The preamble says the resize branch is not exercised in these tests, but RK-C3 exercises it and asserts it. It also calls B's ring "local", which in this code means relative to the frame. The ring is in the batch's own coordinates (`attributeBatchIpc.ts:18`, `:44`).

```text
the resize branch at :2120-2126 is not exercised in these tests
```
```text
the resize branch at :2120-2126 is exercised only by RK-C3, which asserts it
```
```text
whose ring lies at local (0..1, 0..1), far from A
```
```text
whose ring lies at (0..1, 0..1) in the batch's own coordinates (`ring`, `attributeBatchIpc.ts:18`), far from A
```

### D-b (Documentation; Amendment 2 item 4, the §3 App harness)

The client mock starts at `App.colour.test.tsx:46`, not `:61`. The sentence also does not say how RK-A1 reaches the not-held fact. The reopen stand-in does not keep the canvas's props. The colour file does keep them (`:104`), and raises the fact through `onAttributesNotHeld` (`:268`).

```text
and the client, data-plane and stream mocks and the Colour-by helpers of `App.colour.test.tsx` (`frontends/shell/src/App.colour.test.tsx:61-79`, :179-209), so that the real candidate session mints its untiled look; candidate arm, real session.
```
```text
and the client, data-plane and stream mocks and the Colour-by helpers of `App.colour.test.tsx` (`frontends/shell/src/App.colour.test.tsx:46-79`, :179-209), with that file's capture of the canvas's props (:104), through which the test raises the not-held fact by `onAttributesNotHeld` as PB-U11 does (:268), so that the real candidate session mints its untiled look; candidate arm, real session.
```

### D-c (Documentation, D6's class; §4 E-RK1): can a `MultiType` fixture reach the not-held fact at an ordinary view?

At the open's fit view, only if the file is about three times larger than the 250,000-row estimate:
- The fit frames the first look's 10,000 rows. If those are the file's first rows, they sit in the first few rows of `parcel()`'s square grid, which is filled row by row (`engine/src/fixture.rs:1405-1406`).
- Fitted to that strip, the view holds roughly a third of the layer's rows.

At a zoomed-out view the fact is reachable near the estimate, with average vertices kept low: at least 4 per feature (`:1414-1417`), under 2,000,000 in all (`limits.ts:73`). E-RK1 as written has no zoom step, so it would likely stop at I5.

```text
- E-RK1: pan by pointer to a view away from the fit, then Colour by a new column through the UI. Asserts:
```
```text
- E-RK1: after the open's first look has planned, zoom out by the mouse wheel until the not-held status stands, then pan by pointer to a view away from the fit, then Colour by a new column through the UI; the worker records the zoom steps and the fixture's feature count. The fit frames only the first look's 10,000 rows, which, if they are the file's first rows, lie in the first rows of `parcel()`'s square grid (`engine/src/fixture.rs:1405-1406`), so at about 250,000 features the fit view alone may hold too few rows; I5 governs. Asserts:
```

### D-d (Documentation; Amendment 2 item 4's heading): who wrote the words

The heading says the gate's words are adopted for D1 to D6. But the new D6 fixture sentence (line 640) is the drafter's, not the gate's (compare line 258 of the attempt-1 report).

```text
### 4. The documentation findings, D1 to D6 (the gate's words, adopted)
```
```text
### 4. The documentation findings, D1 to D6 (the gate's words, adopted, except D6's fixture sentence, which is the drafter's)
```

## The drafter's unsettled points

- **PR 358's head and the re-link head:** for the code's gates. Stop I1 covers the signatures. The reviewer reads at the build head whether setting the earlier look aside changes the setup of RK-S2 and RK-S3. Not blocking.
- **Comparing paths with the other held PRs:** the custodian's, before code (ADV-2026-11-23-15 item 4, first bullet). Not blocking.
- **E-RK1's fixture:** settled as D-c above. I5 governs, and it goes to the advisor only through OPEN-3.
- **Typecheck:** settled as E-A. It blocks.
- **Hashes:** the custodian's re-sweep before code, as Amendment 3 item 3 says. That includes the sub-line span of `KNOWN-LIMITATIONS.md:507`, which Amendment 2 item 5 says carries its line's hash, but no hash is filed yet. Not blocking.

## The OPEN items and drafts (for the advisor; not ruled)

- **OPEN-1 (a):** sound, the smallest change.
- **OPEN-2 (a):** sound. Option (b) would leave an Apply unfitted (`App.tsx:394-397`).
- **OPEN-3 (a):** sound, with D-c. Option (b) is subject to E-C.
- **OPEN-4 and OPEN-5:** yes.
- **The drafts.** Item 51 with D3's changes, item 61's span with D4's, and AC12 with D5's are each true against the clause table. I checked it row by row: `hasAutoFitRef` is written only at `WorkingCanvas.tsx:1017`, `:1583`, `:1649`, `:1662` and `:1818`; the other rows rest on `App.tsx:834`, `:862`, `:2168`, `:2373-2375` and `:377-380`, and on `candidateArmSession.ts:1740`, `:1744`, `:1749` and `:1497-1512`.
- **Item 61's third sentence:** going to the advisor unreworded is sound. A card change also arms the fit.
- None of these words is the human's.

## Files read (at a846072d, under C:/dev/wt/read-1123e)

- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (lines 1-392 for the Old texts; Amendments 2 and 3 whole)
- state/consults/gates/2026-11-23-colour-by-refill-keeps-the-view-form-gate-architect.md (whole)
- state/consults/2026-11-23-colour-by-refill-keeps-the-view-amendment-2-architect-draft.md:321-357
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-….md:18-47
- governance/AUTONOMY.md:315-359
- governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md (searched)
- frontends/shell/src/canvas/WorkingCanvas.tsx:1090-1119, :1420-1479, :1560-1669, :1740-1864, :2095-2239 (and searched)
- frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:1-200, :410-486
- frontends/shell/src/canvas/tileIngest.ts:110-193
- frontends/shell/src/canvas/extent.ts:90-92
- frontends/shell/src/canvas/limits.ts:60-99
- frontends/shell/src/residency/candidateArmSession.ts:238-251, :1120-1264, :1283-1572, :1700-1794
- frontends/shell/src/residency/candidateArmSession.test.ts:3790-3879
- frontends/shell/src/App.tsx:330-399, :826-865, :1050-1144, :1792-1839, :2128-2174, :2366-2379
- frontends/shell/src/App.reopen.test.tsx:1-185
- frontends/shell/src/App.colour.test.tsx:1-299
- frontends/shell/src/testUtils/attributeBatchIpc.ts (whole)
- frontends/shell/src/diagnostics/renderTrace.ts:1-60
- frontends/shell/package.json, frontends/shell/vitest.config.ts, frontends/shell/tsconfig.json (whole)
- engine/src/fixture.rs:165-204, :410-439, :1400-1429 (and searched)
- kernel/tests/manual_walkthrough_fixtures.rs:726-778
- KNOWN-LIMITATIONS.md:505-507

Model: claude-opus-5-5 (Opus 5.5).
