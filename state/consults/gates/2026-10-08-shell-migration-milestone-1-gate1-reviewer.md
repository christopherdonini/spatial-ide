# PR #195 gate 1 — reviewer
Reviewed: cut/shell-migration-milestone-1 @ 8127b0f59e3dd7df97898ed7475b9380d9b54594

**Verdict: FAIL.** Two Correctness findings and three Evidence findings block. Twelve Documentation findings must be fixed in this PR before the merge.

Diff: `origin/main...origin/cut/shell-migration-milestone-1`, merge base 176ab9127463a8d3fdec1a69b640a4c1754f7349. The worktree is clean and at the head. No app is running and ports 9223 and 5400 are free. I made no product edit and no commit.

---

## Correctness (blocking)

**C1. The K6 case (iii) re-aim changes what the case asserts, not an assumption about the map.**
- **Where:** `frontends/shell/e2e/regression.mjs:1308-1326` at the head.
- **What changed:** before, the case compared the readout after the zoom-in and zoom-out pair with the id a real hover named at that same camera and pointer. Now it compares it with whatever id the settle re-pick left standing one notch in. That is the output of the mechanism under test. If no id stands there, the case moves the pointer and establishes the hover again.
- **What the record shows:** at the 731-row buffer the two picks disagree at an unchanged camera and pointer. The hover named 50244, and the re-pick named 53722 both one notch in and after the return. Sources: `state/consults/2026-10-08-shell-migration-milestone-1-worker-report-3.md:61` (at the base) and `…-worker-report-4.md:51` (at m1). That disagreement is exactly what (iii) existed to catch: the human's failing case, where the id changes after one zoom in and one zoom out with the pointer still.
- **Why the change was not needed:** at the shipped 1280 × 800 geometry (730-row buffer), the old (iii) passed (report 3:60). The re-aim only absorbs the 1280 × 801 variant.
- **Against the ruling:** Decision A (`state/directives/2026-10-08-decisions-a-b-c.md:8-9`) allows a change to a size, a distance or a threshold, never to what is asserted. The only ruled exception is case (v) (`state/directives/2026-10-08-k6-case-v-ruling.md:6-8`).
- **The worker saw this:** report 4:195 flags it for the reviewer to look at first.
- **Route:** either the human rules on (iii) as they did for (v), or (iii) goes back to its old comparison and the hover-versus-re-pick disagreement is diagnosed. That disagreement is pre-existing, but this piece's 1fr map now makes fractional map heights the default.

**C2. The declared map minimum (480 × 320 at every viewport at or above the floor) is not held by the CSS.**
- **The claim:** `layout/layoutConstants.ts:10-16`, `effectiveSizes`' doc, the styles.css header comment, §7, and the U1 acceptance item.
- **The model:** `effectiveSizes` budgets the chrome as 40 + 48 + 128 px (`layoutState.ts:138-140`).
- **The CSS:** `.attention-strip` and `.status-bar` use content-box `max-height` plus padding and a border (`styles.css:146-169`). Their real caps are 136 px and 53.8 px.
- **Probed on real WebView2 at the head:** a scratch script injected text into the DOM; no product file was touched. At 1024 × 640, with Activity open and both bars past their caps, the map is **480 × 306.2**. With the bars as they are, it is 480 × 466.2.
- **Scope:** U1 proves only the model. E-FIT never sets the bars to their caps.
- **Fix:** `box-sizing: border-box` on the two bars, or put their padding and border into the fit. Then one test that holds the real DOM to the minimum at the floor.

## Evidence (blocking)

**E1. K6 case (iii)'s change is not shown still able to fail.**
- Decision A (`decisions-a-b-c.md:13-14`) requires this.
- The K6 mutations observed are case (ii) (at 65391e79) and case (v) (at 82d1f73a): `regression.mjs:1261-1271`, report 5:20-21, report 7:45-52.
- The PR body's table has no row for (iii).

**E2. KNOWN-LIMITATIONS 39 states a limit that the evidence does not support, and my probe contradicts its unhedged sentence.**
- **The claim:** `KNOWN-LIMITATIONS.md:369` says that what you will see is a strip with no features where the map has grown.
- **Its evidence:** RESIZEQ, which counts `viewport_query` lines. It does not look at pixels.
- **My probe** (the 100k fixture, two notches in, pointer parked, then Ctrl+I): the uncovered edge strips read 20.7% non-background at 3 s and at 13 s, against 20.3% in the centre. They filled at once from the tiles already loaded.
- The title's "can" may hold elsewhere, but the body sentence must be reduced to what is shown, or left to U6.

**E3. CI is not green at the head.**
- `L1 portable correctness · cargo test --workspace (ubuntu-24.04)` fails in `skp::ticket_drop_under_lock_regression::after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`, at the setup guard (`kernel/src/skp.rs:3462`).
- This piece touches no kernel file. It is the same guard class as the recorded F-1 sibling (`kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:218`, node `skp-drained-stream-helper-post-check-race`). Main's runs of the same workflow pass.
- No code change is asked of this piece. A green re-run is needed before the merge; that is for the custodian.

## Documentation (must-fix before the merge, no re-gate)

**D1. The PR body has no walkthrough row list.** §2.8 requires every changed row with its old and new location words. Amendment 1 item 1 names B2 and I1, and Amendment 2 item 1 names T4 and T5.

**D2. The PR body says "Results at the head: reports 2, 4 and 7".** Those reports ran at 27e4816c/f214f1f4, 65391e79 and 82d1f73a. Before this gate, no e2e suite had run at 8127b0f5; Amendment 8 item 3 lists only the governance checks. Cite the commits, or this gate's runs.

**D3. The PR body is missing two lists §9 requires.** It does not list every e2e suite at the base (only the failures), and it does not name the verify tools with their commits.

**D4. Three PR-body failure quotes are not byte-identical to report 5.**
- A9′: the body uses a prime (U+2032) and drops "after 120000ms" with no elision mark (source: report 5:19).
- FIND′: the body closes the parenthesis early (report 5:22).
- S4: the body cuts the message with no elision mark (report 5:17).
- K6 (ii), K6 (v), CLASSC′, S5b and there-and-back-net match.

**D5. Amendment 8 item 3 claims tool results without the tools' commits (round 15 (c)).** At this head the tools are: verify-cites 04f6332b, verify-quotes f9444a4d, verify-test-claims e9735d47, verify 26072022.

**D6. Amendment 8's class 8 table records the group overruns but not §7's per-file G6 ceilings.** `regression.mjs` is at 190 against ≤ 24, `source-changed.mjs` is at 39 against ≤ 4, and G6 has 8 files against the 5 declared.

**D7. §8 item 8: two edits fall outside Amendment 6 item 5's "these checks only".**
- The `setCam` wait (`pan-anchor.mjs:100-103`) is in a shared helper. Report 4 classed it 3, but no amendment carries it and the PR body omits it.
- The CLASSC′ return click is disclosed in the PR body but appears in no amendment.

**D8. Two committed lines carry invalid UTF-8.**
- `regression.mjs:854` has a lone 0xA7 byte where § stood.
- `pan-anchor.mjs:149` has two lone 0xB1 bytes for ±.
- Separately, `pan-anchor.mjs:130-131` has a garbled clause (the word "measured" twice).

**D9. §8 item 11: `VIEWPORT_FLOOR` (`layoutConstants.ts:16`) has only a test caller** (`layoutState.test.ts:22-23`). Commit 64eb6e76 says it gave the constant its caller. Either give it a product reader, or record that §7 pre-committed it with U1 as its named consumer.

**D10. §8 item 13 residue in files this piece may not edit.** These still read as current:
- `src/console/ConsolePanel.tsx:20-24` ("bottom drawer … below every other panel");
- `src/residency/residencyStatus.ts:6` (calls `.residency-status` a `.canvas-status-stack` child).
Amendment 3 item 10 sent them to the gates. Record a home for each.

**D11. K6's return summary is now wrong** (`regression.mjs:1705-1706`). It says "hovered id … the same id", but `repickId` is now the standing id. This goes with C1.

**D12. Two return strings were not updated.** ABSENTCRS′'s return string (`regression.mjs` near 2449) still says "no describe-summary", though its check is now Layers-only.

## Suggestions (optional)

- **S1.** The re-aimed B2′/ABSENTCRS′ absence checks (`regression.mjs:2391`, `:2447`) cannot fail by construction, because AdmissionPanel no longer renders DescribeSummary. Consider asserting that Source shows the earlier dataset's summary, or none.
- **S2.** Under a refusal that persists, A9′ hits its step timeout of 120 s before its evidence message. Mutation 3 failed as a timeout. A per-notch attempt bound would keep the evidence.
- **S3.** `pan-anchor.mjs`'s `waitForFill` returns silently at its 20 s bound.
- **S4.** The map's fractional height (730.22) comes from the status bar's rem padding (29.78 px). Integral chrome heights would remove the 730/731-row buffer sensitivity behind A9′ and K6.
- **S5.** In `source-changed.mjs`, the `?? 0` zoom fallback is not derived.
- **S6.** Re-selecting the active tab records a row, and a splitter click with no move records a resize row.

---

## Checks

**§8, item by item.**
- Items 1–7, 10, 12, 14 and 15: clean. The App.tsx hunks are the imports and the return only. No canvas/, streaming/, residency/ or skp/ file. No dependency or lockfile change. The map is never keyed on layout state and never hidden. Closed content is hidden, not unmounted. Layout actions record only §2.6 rows (R6 covers the SKP count). Every new string is sighted or marked. The only platform read is in `actionRegistry.ts`.
- Item 8: D7. Item 11: D9. Item 13: D10.
- Item 9: clean. Every walkthrough hunk falls outside the result logs. The new Part U's log is blank. The word changes are location or label words.
- Item 16: every new U and R test has an observed mutation. The E rows are recorded in report 2 and Amendment 4 item 6.

**§7**, by its own command at the head: 3,317 lines over 28 files. G1 952, G2 273, G3 337, G4 66, G5 1,004, G6 685. That matches Amendment 8's table. Outside the count: walkthrough 118, e2e/README.md 12, KNOWN-LIMITATIONS 15, all within ceiling.

**Hash pins.** All 74 `path:line @ rev sha256` pins in the form (at 732fa048) recompute at their pinned commits. So do the 8 amendment-level hashes, each at the commit that adds its file.

**The re-aims against Decision A:**
- A9′, FIND′, CLASSC′, pan-anchor's four checks and source-changed's S4 each change an assumption, and the test states the derivation. I checked the A9′ arithmetic, the 0.42 × 40 m ring in `engine/src/fixture.rs:1256`, and the 9 px threshold in `pickResolution.ts:81`.
- K6 (ii): its margin is derived in the test.
- K6 (v): changed as the human ruled.
- K6 (iii): C1 and E1.
- A9′ and K6 no longer depend on one pixel.

**The mutation record.**
- Reports 5 and 7 and their filing notes agree with the comments recorded at 512aab08 and 629a21fd.
- The case (v) order was: clean run at 19:45:29Z, the change committed at 19:50:05Z, one application at 19:50:16Z, one run at 19:50:21Z, then the restore and a clean check at 19:54:50Z. That meets Amendment 7 item 4.
- No re-observation is needed apart from (iii), which has none (E1).

**Seams.** App passes slots as `Record<SlotId, ReactNode>`. R1–R8 drive the real App, admit through the real `openPath`, and use a typed `DescribeResponse` fixture. The e2e suites run on the real build.

**Low profile.** The PR title, the PR body and the branch's commit messages carry no outside reference and no @mention.

## Commands (rc, hold)

- **Not held (light), at the head:**
  - verify-cites rc 0, verify-quotes rc 0, verify-test-claims rc 0, verify rc 0, `queue --check` rc 0, `site --check` rc 0, cfg-boundary rc 0;
  - the §7 numstat, rc 0;
  - the pin recompute, rc 0;
  - two probe scripts, rc 0 each;
  - `app-down.ps1` after every suite.
- **`cargo build` in src-tauri** (target D:/wt-targets/m1): shared hold, rc 0, 4 m 06 s. The exe was stale against the head's merged kernel, engine and data-plane code, and this plain build dropped the worker's TAURI_CONFIG overlay. I rebuilt it with that overlay, as report 2 section 3 describes: shared hold, rc 0, 2 m 52 s.
- **`npm run verify`:** shared hold. The first call ran nothing: my output-redirect path was wrong, rc 1. The second call: rc 0, with 78 test files and 1,184 tests passed, then 76 passed and 30 passed.
- **`node e2e/layout.mjs`:** shared hold. The first call, rc 1, never got a debug port, because the exe lacked the overlay (my launch, not a finding). The second, rc 0: OPEN, E-KEYS, E-FIELD, E-LANDMARKS (the accessibility tree read over CDP), E-FOCUS, E-FIT (668 × 524.2 native and 754 × 492.2 at 1366 × 768), RESIZEQ (0 and 0, recorded) and E-REOPEN all PASS, and FIXTURES PASS (hashes unchanged).
- **`node e2e/regression.mjs`:** shared hold, rc 1.
  - PASS: A1′, A3′, A4′, A5′/A6′, A7′, A8′, A9′ (at notch 4), K6 (cases (i) to (v)), K7, CURSOR′, FIND′, MP′, PT′, LN′, B2′/B3′, ABSENTCRS′.
  - INFO: NET′.
  - FAIL: C2′/C3′ only, present at the base.
- **`node e2e/filter-panel.mjs`:** shared hold, rc 0. OPEN, PANEL′, PANELREFUSE′, CLEAR′ and FIND′ PASS (0.27% against a 0.08% floor).
- **`node e2e/console.mjs`:** shared hold, rc 1.
  - PASS: HEADER′, ECHO′, TWOCMD′, CLASSB′, CLASSC′, COPYTRUNC′, UNCLASS′.
  - FAIL, present at the base: HEXLIM′, GROUP′, REGRESS′. The visible part of REGRESS′'s output shows only C2′/C3′ failing. A9′ and K6 do not appear in it.
  - REFUSAL′ also failed. That is the listed flake, and it was timing-sensitive in a shared run, so I report it to you rather than record it as a failure.
- **`node e2e/pan-anchor.mjs`:** shared hold, rc 0, 16 of 16. Small box: paint-vs-event at ±85 within 0.01 px, there-and-back-net 0.00. Large box: ±250 within 0.08 px, there-and-back-net 1.00.
- **`node e2e/source-changed.mjs` with `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post`:** shared hold, rc 0. S1, S2, S4, S5a to S5d and fixture-integrity PASS; S3 INFO.
- **`node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`:** shared hold, rc 0, 457 of 457.
- **`gh pr checks 195`:** rc 1, 11 lines, nothing pending. Every check passes except the ubuntu `cargo test --workspace` job (E3):
  - cargo fmt;
  - cargo test on windows-latest;
  - cfg boundary;
  - signed-off;
  - no profile path;
  - both tauri builds;
  - verify:plan, queue and site drift;
  - both typecheck/build/vitest/cargo test jobs.

Every hold was granted and released. No script exit code from 96 to 99 occurred. The worker's tools were used unchanged. My temporary files are in my scratch folder only.

Relevant paths:
- `C:/dev/wt/m1/frontends/shell/e2e/regression.mjs`
- `C:/dev/wt/m1/frontends/shell/src/layout/layoutState.ts`
- `C:/dev/wt/m1/frontends/shell/src/styles.css`
- `C:/dev/wt/m1/KNOWN-LIMITATIONS.md`
- `C:/dev/wt/m1/frontends/shell/e2e/pan-anchor.mjs`
- `C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md`
