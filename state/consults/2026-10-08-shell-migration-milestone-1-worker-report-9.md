*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s worker report for the rest of correction round 1: K6 case (iii) back to its old comparison under the human's ruling (Amendment 10), and every e2e suite once at one head. The branch head is ae704f0abc924bde7a6f912a853f039dfca66114 (the same worker-high, resumed at 21:29:09Z, report at 21:50:10Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 2168eb6924a86ef4dae852cb507d2db633d87769677f5cf5167b496ea86a973b. The custodian read the commit 773d42af..ae704f0a (`e2e/regression.mjs` only, 9 lines added and 20 removed). Names below are at that head.*

---

# Report: K6 case (iii) restored, and every e2e suite at one head

Case (iii) is back to its pre-stage-4 comparison with no retry, and the real regression suite passes K6, all five cases, at the default window. Every suite then ran once at the final head. The only failures are the known base failures, plus the REFUSAL' flake, which did not fail this time.

## Commit

**ae704f0abc924bde7a6f912a853f039dfca66114**, `e2e/regression.mjs` only, signed off, message from a file, the two trailers, no outside reference or @mention. Published as an ordinary update: 773d42af..ae704f0a, in its own call. The worktree is clean and ports 9223 and 5400 have no listener. I made no product-file edit.

## The (iii) diff against the code before stage 4's K6 change

The base is the parent of 25a8a881, on the region from `const repickHover` up to the line before `ASSERTION (iv)`:

```
--- pre-stage-4
+++ now
@@ -6,2 +6,9 @@
   await wheelWithoutMoving(page, consoleHandle, ZOOM_NOTCH_DELTA_Y); // "Once i zoom in to a feature and hover over one"
+  // CASE (iii) IS UNCHANGED by milestone 1 (the human's ruling on K6 case (iii), PRE-REGISTRATION Amendment 10): it compares the
+  // readout after the zoom-in and zoom-out pair with the id a real hover named at that camera and pointer, with no retry and no
+  // re-established hover. Its dependence on the one candidate pixel is kept on purpose: when the stationary pointer is on the same
+  // feature the two ids agree, and when they do not it is the product's two pick paths disagreeing (the hover pick and the settle
+  // re-pick, same camera, same pointer), which this check must keep showing. The ruling records that at a window one row taller
+  // than the default (1280 x 801) the hover pick answered 50244 and the settle re-pick 53722; that disagreement is the proposed
+  // node `shell-pick-paths-disagree-at-1280x801`, a diagnosis first, and nothing here is bent to hide it.
   const beforeStepOut = consoleHandle.renderTrace().length;
```

- **Code is byte-identical** to the pre-stage-4 code in that region. That includes the comparison to `repickHover.id`, the `sameId` wait, and the `hasConfirmingRepickTrace` assertion. The fallback is gone, as is the `standingAtStepOut` code and its stage-4 comment.
- **Summary string.** `(iii) re-pick: hovered id ${repickId}, ...` is byte-identical to the pre-stage-4 string, and `repickId` is the hovered id again.
- **Cases (ii) and (v) are unchanged.** (ii) keeps its two extra notches and (v) keeps its stronger condition.

## The run (held, fresh launch, default window; map 668 x 736)

`node e2e/regression.mjs` at the commit's content: exit **1**, with only C2'/C3' failing.
- **K6 PASS**, all five cases:
  - (i) continuous: "id 28625" at notch 0, then the refusal text verbatim.
  - **(iii) re-pick: "hovered id 52144 ... -> the same id, named re-picked by its own confirming trace"**. It passed at this default.
  - (iv) discriminator: 1 keyboard pan press, "an absence, confirmed re-picked".
  - (ii) discrete: "hovered id 50249", 8 notches, 3 showed a confirmed id, and the marker was sighted at 3/4 notches with an id standing.
  - (v) release edge: hovered id 52144, 2 zoom-out notches to a standing refusal, a real drag of (67, 74), readout clear, and no camera-settle re-pick line of any kind since the mark.
- **A9' PASS** at notch 4 (buffer 138,437).

## Every suite once at the final head ae704f0a

All were held (`hold shared -Project SpatialIDE`), one per call, with `app-down.ps1` between runs, on a fresh launch. Regression is the run above; all `e2e/*.mjs`.

| Suite | Head | rc | Failing step: message |
|---|---|---|---|
| layout | ae704f0a | 0 | none (every step passed, including E-FLOOR 480x320) |
| regression | ae704f0a | 1 | C2'/C3': "expected {kind:"refused", code:"engine.identity_unusable"}, got {"kind":"admitted"}" (known) |
| refusal-contract-baseline | ae704f0a | 0 | none (OVERCEIL', REOPEN', SLOW'/CANCEL' passed) |
| admission (`admission-remediation.mjs`) | ae704f0a | 1 | MAP': "expected {kind:"refused", code:"engine.identity_unusable"}, got {"kind":"admitted"}" (known); BOTHNEEDED': "expected engine.identity_unusable after asserting the CRS alone, got {"kind":"admitted"}" (known) |
| filter | ae704f0a | 0 | none |
| filter-panel | ae704f0a | 0 | none (FIND' 0.27% > 0.08% floor for 668 x 736) |
| style | ae704f0a | 0 | none |
| publish | ae704f0a | 0 | none (EXPIRED' skipped, as documented) |
| console | ae704f0a | 1 | HEXLIM': "key set mismatch. Expected [...], got [...,"columns",...]" (known); GROUP': "expected exactly one NEW .console-group-header after 3 identical queries (had 3 before), got 6 after (texts: ["×3","×2","×2","×2","×2","×2"])" (known); REGRESS': "npm run e2e:regression exited 1 (266472ms)", carrying only C2'/C3' (known). CLASSC' and REFUSAL' passed. |
| residency-harness (default, instrument-on) | ae704f0a | 0 | none (it ran on `filter-zoned.parquet`; no verdicts are claimed) |
| source-changed, default route | ae704f0a | 1 | S4-issue-one-query: "no viewport_query followed any gesture in the ladder ... queriesBefore 17, queriesAfter 17" (known) |
| source-changed, post route | ae704f0a | 0 | none (S1 to S5d passed) |
| source-watch-idle | ae704f0a | 0 | none (all steps passed) |
| pan-anchor | ae704f0a | 0 | none (16/16; the maps are 328x576 and 788x836) |

- **Exit-code note for layout.** The first run in this batch (layout) had a stray `| grep` on the tail of its held line, so the shell reported no exit status; every step printed PASS and the summary lists no FAIL, so I record it as rc 0. All other runs have the exact held shape, with an unmasked rc.
- **No new failure** outside the known list. Nothing needed fixing, and I did not fix anything.

## §7 numstat at the head (`git diff --numstat 176ab912...HEAD`, three excludes)

| Group | Lines | Ceiling |
|---|---|---|
| G1 | 953 | 1,000 |
| G2 | 273 | 450 |
| G3 | 339 | 400 |
| G4 | 66 | 100 |
| G5 | 1,004 | 900 |
| G6 | 747 | 400 |
| Total | 3,382 | 3,250 |

G6 dropped from 762 to 747 with this commit (9 insertions, 20 deletions in `regression.mjs`).

## Deviations

- **Class 3.** On the first run of the batch (layout), the held call had the `app-down.ps1` call chained before the `cd` and a trailing pipe on the exit. Every later call used the exact shape. The layout result is unaffected: its output shows every step PASS.
- **Class 3.** The comment in (iii) attributes the 50244 / 53722 observation to the ruling ("The ruling records that ..."), not to a run of mine.
- None otherwise.

**Model:** Sonnet 5.5 (claude-sonnet-5-5).
