Reviewed: main at cfe25dc197af1a2fc8d652a91ba9f383f4dc3c23, in the detached read worktree C:/dev/wt/read-1123y (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 5, attempt 3, node:shell-scale-display@form-gate-architect-3, dispatched at 2026-11-23T17:46:35Z; its run: Read 26, Grep 20, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T17:46:35Z to 2026-11-23T17:56:12Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 15712 bytes, sha256 be843a4aa2f57fbda2cee614a148dd28adbe5268233da7a6ba8fdfb923aa3ebd, byte for byte, nothing masked, with one final newline added. FAIL on one Evidence finding, E6 (Amendment 4 item 3 says no record in the tree shows WebView2 honouring a scale argument, and milestone 2's custodian run 5 records one; the answer no still stands on two grounds; words only, given), with D11 to D15 Documentation; E5 and D7 to D10 answered; M4 has no sure survival at one unit check.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123y @ cfe25dc197af1a2fc8d652a91ba9f383f4dc3c23

Tag: node:shell-scale-display@form-gate-architect-3. I used only Read, Grep and Glob, and ran nothing. I recomputed no hash. All cites are at cfe25dc1. I read code at cfe25dc1 in place of a846072d and b42c0ed7: the brief says no code changed between them, and the record files I read at cfe25dc1 had been appended to, never edited.

The core of this gate holds. Amendment 4's bounded search, together with M4 at one unit check, leaves M4 no sure survival. One Evidence fault blocks, and it is in item 3's answer to ruling item 7. The fix is words only, given below.

## Evidence (blocking)

**E6. Amendment 4 item 3 (form :654, :659) claims that no record shows WebView2 honouring a scale argument. A record in the tree shows it did.**
- What the form says:
  - :654 says that no record in the tree shows WebView2 honouring a scale argument passed this way.
  - Milestone 2 ran its E-KINDS point step at forced factors 1.25 and 1.5, "with only a launch argument added" (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1376`). That is the line just above the precedent the amendment cites (:1377).
- What the run record shows:
  - The run is recorded in `state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md`.
  - At :3, `--force-device-scale-factor` was added to WebView2's browser arguments in a scratch launch script.
  - At :45-48, `devicePixelRatio` read 1.25 and 1.5, and the CSS viewport shrank from 1280 by 800 to 1024 by 640 and 854 by 534. A real device scale factor does exactly that.
- Why this is Evidence: the sentence makes a claim about the evidence that the evidence contradicts. It is also one of the reasons behind an answer that the advisor accepted (ADV-2026-11-23-22 item 8). Under the proportional gates paragraph, that is never documentation-only.
- The answer "no" still stands, on two grounds that hold against the code:
  - (a) Through the suites' own launch, the argument can only go into the shared overlay (`frontends/shell/e2e/lib.mjs:97-114`, :169, :193-200). The launched app is meant to keep running after the CLI exits (:172-173), and later suites attach to it (:158-167). `attachSecondApp` runs the same compiled exe (:316-318, :325).
  - (b) E-SCALE's widths and label are computed from the zoom in CSS pixels. They do not depend on the ratio, so a run at a forced factor would pass and show nothing about the drawn map. Item 3 states this ground only for the CDP override.
- Because the advisor accepted the answer as it was stated, the corrected record goes back to the advisor.
- These words are not the human's; they are the drafter's. Whether they land under `governance/AUTONOMY.md` §31 without an attempt 4 is the advisor's call, as gate E5 was.

```text
  - No record in the tree shows that WebView2 honours a scale argument passed this way.
```
```text
  - A forced factor has reached WebView2 once, outside the suites' launch: milestone 2's custodian run 5 added `--force-device-scale-factor` to WebView2's browser arguments in a scratch launch script and recorded `devicePixelRatio` 1.25 and 1.5, with the CSS viewport shrunk to 1024 by 640 and 854 by 534 (`state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:3`, `state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:45-48`). Through the suites' own `attachOrLaunch`, the argument could go only in the shared overlay above.
```
```text
  - E-SCALE asserts CSS widths and DOM text computed from the camera's zoom (§2 item 1), and the override changes neither. A run under it would pass while showing nothing about a scaled display.
```
```text
  - E-SCALE asserts CSS widths and DOM text computed from the camera's zoom (§2 item 1). Neither the override nor a forced factor changes them, because both are in CSS pixels at any ratio, so the width predicted beforehand is the same at every factor. A run under either would pass while showing nothing about whether the map is drawn at 2^zoom CSS pixels per unit at that ratio, which is what row 5 checks.
```

Clause check of these words:
- **"reached WebView2 once" and the figures.** These are run 5's :3 and :45-48, quoted as figures, not as its words.
- **"outside the suites' launch".** Run 5's :3 names a scratch `app-up.ps1`, not `attachOrLaunch`.
- **"only in the shared overlay".** This is `lib.mjs:16-25` and :97-114.
- **"in CSS pixels at any ratio".** `widthPx` is the product m × 10^k × 2^zoom (form :680), and the label comes from `scaleLabel` (:99). Neither reads `devicePixelRatio`.
- **What row 5 checks.** Row 5 compares the bar with the parcels drawn on the screen (:664), so it does measure the drawn map.
- **The new cites.** They need pins at a commit on main. That is the custodian's job, as in Amendment 5.

## Correctness

No findings.
- **E5's words against the code.**
  - The amended `scaleReading` takes no unit in its callee. So `noUnusedParameters` (`frontends/shell/tsconfig.json:16`) no longer forces a second unit check, and `not-metre` is decided at one site (form :94-95, :680).
  - The search is bounded: for 0, ±Infinity and NaN, every comparison fails or the pre-MIN candidate qualifies, so the search ends at `out-of-range`.
  - `2 ** 1100` is Infinity and `2 ** -1100` is 0 in IEEE doubles. A saved zoom reaches the product unclamped (`frontends/shell/src/project/openProject.ts:143`).
- **M4 at one site (item 10).** Under M4, `other` and `unestablished` with any finite zoom pass the unit check. They then reach `readingAtPxPerUnit` and come back as `bar` or `out-of-range`, never `not-metre`. A case expecting S-3 needs a finite zoom, so U-SB4 kills M4 for any zoom those cases can carry. There is no sure survival.
- **The return-type sentence (:680).** It is true: the P0 stub's `{kind:"none"}` type-checks against `scaleReading`'s type.
- **Class and scope.**
  - The class is full under §21a (`governance/AUTONOMY.md:327`) and §21c (:349-353), unchanged.
  - Item 11 declares row 5 and the E5 lines as class 9 before any code. Each addition stays inside its declared ceiling (90, 180 and 45; form :231, :237, :245). §7 is not edited, and I7 adds no file.
- **The ruling items.**
  - Item 2 records OPEN-1 to OPEN-7, the drafts and item 8's notice to the human as the ruling sets them out (ruling items 1-6 and 8). It changes no ruled thing.
  - Item 7 is answered, with E6.

## Attempt-2 findings, by id

- **E5: answered** in the gate's words, with one added sentence that is true. D11 below concerns that sentence's rationale.
- **D7: answered**, in the gate's words (:713, :719).
- **D8: answered.** "adds" ends `frontends/shell/e2e/regression.mjs:729`, and "0.93" opens :730. The readouts at :730-731 are -1.78 and -0.85, which agree with -4.57 + 3 × 0.93 and one notch more.
- **D9: answered.** S-1 is `{L} m (CRS)` (:116), and `scaleLabel` builds only the decimal (:99).
- **D10: answered by Amendment 5.**
  - All 29 P pins and 20 Q pins are present, each with its rev on main. Each Q span is the lines item 3, 4 or 6 means: I read Q1-Q20 at cfe25dc1, and they match.
  - P26-P29 are `WorkingCanvas.tsx:193`, :1660-1664, :164-193 and :148, which are Amendment 2 item 7's cites (:499, :504).
  - P29 also covers Amendment 2 item 2's `:148`. No change is needed.
  - The reviewer recomputes the hashes.

## The guard on `pxPerUnit`

Keep the words; whether the code has an explicit guard is up to the build.
- The clause in :680 is what makes the function total. At 0 and Infinity, "the smallest m × 10^k" does not exist.
- In code, an explicit guard is redundant: the bounded search returns `out-of-range` for 0, ±Infinity and NaN.
- Removing the guard is therefore an equivalent mutant, not a survival.
- A guard that answered wrongly (`none`, or a bar) would fail U-SB4's 1100 and -1100 cases. So the outcome is proven either way.

## Documentation (must be fixed before the merge, by an appended amendment; these are the drafter's words, not the human's)

**D11. Item 4 (:674): the rationale for the return type is too broad.** A narrower type that still includes `{kind:"none"}` would also type-check the stub.
```text
and a return type narrower than `scaleReading`'s would not type-check that stub.
```
```text
and a return type that leaves out `{kind:"none"}` would not type-check that stub.
```

**D12. Item 4 (:705): the S-4 clause check leaves out the unit.** `not-metre` is decided before the search (:94-95, :680). So a degree dataset at zoom 1100 shows S-3, not S-4.
```text
S-4 is shown exactly when `scaleReading` returns `out-of-range`: k is outside [SCALE_EXPONENT_MIN, SCALE_EXPONENT_MAX], or the zoom is finite and `2 ** zoom` is 0 or Infinity (Amendment 4, item 4).
```
```text
S-4 is shown exactly when `scaleReading` returns `out-of-range`: the unit is `metre`, the zoom is finite, and either `2 ** zoom` is 0 or Infinity or k is outside [SCALE_EXPONENT_MIN, SCALE_EXPONENT_MAX] (Amendment 4, item 4).
```

**D13. Item 1 (:637) contradicts item 8 (:769-771).**
- Item 1 says that every path:line the amendment adds is read at a846072d.
- But the `regression.mjs` spans that item 6's New texts add are pinned at b42c0ed7 as P5 to P7.
- The file is the same at both commits, so this is harmless.
```text
- Every `path:line` this amendment adds is read at a846072d4be622ade7356d36bccd13c346ffa34a, which is on main. Item 9 lists these pins.
```
```text
- Every `path:line` this amendment adds is read at a846072d4be622ade7356d36bccd13c346ffa34a, which is on main, and item 9 lists these pins; the exception is the `regression.mjs` spans in item 6's New texts, which join Amendment 2's text and are read at b42c0ed72a8a94885bdd1f057c5c7463e5127a0e as P5 to P7 (item 8).
```

**D14. Item 3 (:656) says that the suites "already use" the override.** No file under `frontends/shell/` sends `setDeviceMetricsOverride` (I searched; node_modules excluded). `layout.mjs` only clears it, after resizing with `page.setViewportSize` (`frontends/shell/e2e/layout.mjs:248`, :264).
```text
  - CDP `Emulation.setDeviceMetricsOverride` needs no launch change, and the suites already use it and clear it (`frontends/shell/e2e/layout.mjs:264`).
```
```text
  - CDP `Emulation.setDeviceMetricsOverride` needs no launch change. No suite sends it; `layout.mjs` only clears it after resizing the page (`frontends/shell/e2e/layout.mjs:248`, `frontends/shell/e2e/layout.mjs:264`).
```

**D15. Amendment 2 item 4 (:450): M1's site under the bounded search.**
- The problem:
  - Attempt 2's clause check describes a pre-check on 5 × 10^(MIN−1) before the scan.
  - If the build writes it that way, there are two `≥` comparisons.
  - M1 applied only at the pre-check would pass U-SB1, because 5×10⁻⁴ × 30 is 0.015 under either operator.
- This is not a sure survival, since nothing forces two sites. But the site must be named.
- Clause check of the new words:
  - At 30, any pre-check is false and 2 × 30 > 60 is false, so the reading is L 5, not 2.
  - At 12, 5 × 12 > 60 is false, so the reading is L 10, not 5.
  - The words hold with one site or with two.
```text
- M1: `≥` becomes `>`. Fails at 30 and 12.
```
```text
- M1: `≥` becomes `>` at every comparison with SCALE_BAR_MIN_PX in `readingAtPxPerUnit`, the bounded search's included. Fails at 30 and 12.
```

## Old texts and placement

- **Amendment 4's twelve Old texts each occur once above it,** at form :123, :173, :411, :436, :443, :449, :466 (twice, as separate spans), :560, :567, :574 and :579 (I checked by Grep).
- **Each addition has its place.** Row 5 goes after :311, and I7 after :205. Each anchor occurs once.
- **The superseded index (:850-859) covers each replacement and each addition.**
- **My five Old texts each occur once in the form,** at :674, :705, :637, :656 and :450 (the last by Grep against :165 and :446).

## The drafter's unsettled points (the consult's note, :244-250)

- **Old texts checked by Grep: settled.** They hold, as above.
- **The code between a846072d and b42c0ed7, not diffed: for the reviewer's recompute.** It does not block. §0's rule stands: for the code, the piece's base is authoritative.
- **Row 5 resting on 0.93: for the advisor.** The band check holds: the 200 m band runs from 0.3 to 0.6 in 2^zoom, which is one zoom unit wide, and 0.93 is less than 1. A further note for the advisor: at the low end, the parcels' pitch is about 12 CSS px, so half a parcel is about 6 px. Row 5's red bands are then tight against how precisely two paper marks can be placed. Zooming until the bar is near its longest would ease that.
- **The guard: settled above.**
- **§8 item 8's "landed": does not block.** "Landed" is this project's word for merged, which agrees with ADV-2026-11-23-16 item 10 ("the build does not wait for me"). The advisor may confirm.
- **§31 (d) or a re-gate: the advisor's,** for E6 as it was for E5.
- **M4's literal: for the code's gates.** If the code writes `unit !== "metre"` (:95), M4 is applied in meaning, as `unit === "degree"`.

## For the advisor (not ruled here): truth against the code

- **S-1 to S-4: true.** S-3 holds for degree, other and unestablished (`frontends/shell/src/skp/types.ts:105-114`). S-4 holds for a metre dataset only, per D12.
- **The KNOWN-LIMITATIONS draft: true.** Its last sentence holds while E-SCALE records a ratio of 1. Item 13's note on "only" is right.
- **Row 5: true.**
  - The parcel centres are 40 m apart (`engine/src/fixture.rs:93`, :1411-1412), so a 200 m bar spans five pitches.
  - Wrong by 125% or 150%, it would span 4, 6.25, 3.3 or 7.5 pitches, and all four are red.
- **I7: true to ruling item 7's stop.**

## Files read (in C:/dev/wt/read-1123y)

- governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md (whole, and grep)
- state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect-attempt-2.md
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-19-the-scale-display-open-1-a-without-the-humans-word-the-rest-as-recommended-a-question-on-display-scaling.md
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-22-…-c2-fix-i.md (grep)
- state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-16-….md (grep)
- state/directives/2026-10-12-open-15-wording-webview2-scale-runs-status-bar-piece.md (grep)
- state/consults/2026-11-23-shell-scale-display-amendment-4-architect-draft.md (:240-262, grep)
- state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md (whole)
- state/consults/2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md (:38-45)
- governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md (:60-69, :198-207)
- governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (:1372-1381)
- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (:118-122, grep)
- governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md (:290-321)
- governance/AUTONOMY.md (:315-359)
- state/gate-log.json (:1-18, :885-889, grep)
- frontends/shell/e2e/lib.mjs (:1-340, grep)
- frontends/shell/e2e/layout.mjs (:225-274, grep)
- frontends/shell/e2e/pan-anchor.mjs (:40-54)
- frontends/shell/e2e/regression.mjs (:724-733)
- frontends/shell/MANUAL-WALKTHROUGH.md (:140-151)
- frontends/shell/tsconfig.json
- frontends/shell/src/project/openProject.ts (:130-145)
- frontends/shell/src/canvas/WorkingCanvas.tsx (:140-197, :1636-1667, grep)
- frontends/shell/src-tauri/tauri.conf.json (grep)
- engine/src/fixture.rs (:60-134, grep)
- frontends/shell/ (grep for DeviceMetricsOverride, deviceScaleFactor, force-device-scale-factor)

Model: claude-opus-5-5 (Opus 5.5).
