Reviewed: PR #218 at 720bb50dd0710697b869346c9726b0c50c9435e3 (base f8bc2951), cut/shell-status-bar-one-height @ 720bb50dd0710697b869346c9726b0c50c9435e3
Verdict: PASS WITH NOTES

Nothing blocks. Three Documentation findings below must be fixed before the merge, with no re-gate.

## Correctness
None found.
- The status row track and the bar's height both read `var(--status-h)` (frontends/shell/src/styles.css:34, :162). That variable comes from one constant: frontends/shell/src/layout/StudioLayout.tsx:203, from frontends/shell/src/layout/layoutConstants.ts:36.
- No other row track or CSS variable is set from slot content (StudioLayout.tsx:194-204).
- The wrap (styles.css:165) and the inner scroll (:163) are kept.
- The fit's chrome is unchanged at 40 + 48 + 128 (frontends/shell/src/layout/layoutState.ts:138).
- No reader of `STATUS_BAR_MAX_HEIGHT_PX` or `--status-max-h` is left in code. The only places that still name them are the form, milestone 1's form and records.
- The window handling in `stepStatusHeight` (frontends/shell/e2e/selection.mjs:788-816) matches Amendment 3, item 2, s1 to s6:
  - it sets the window to 880 x 800 and polls for 5 s;
  - a failure before the body runs is INCONCLUSIVE and names the size it read;
  - the restore happens in `finally`, with its own poll;
  - a restore failure is added to an earlier failure's message rather than replacing it, and is thrown when there was no earlier failure;
  - the CDP session is detached.
- Gate 1's notes N-1 (the session is opened outside the `try`, :791) and N-2 (a maximized start) stand as notes. Neither can produce a false pass.

## Evidence
None blocking.
- SB1 and SB2 (frontends/shell/src/layout/StudioLayout.test.tsx:207-233) render the real StudioLayout with nothing mocked. I re-observed both mutations at the head (below).
- E-STATUS-HEIGHT (selection.mjs:741-816) follows Amendment 1's S0 to S3, G1 and G2, at Amendment 3's window:
  - G1's probe is :771;
  - S3 is :783-784.
- Run 2 at d9e9b817 records two passes at 388 x 712 in A, B and C, with the bar at 48. That is the canvas Amendment 3, item 3, s7 predicts.
- Run 2 also records the mutation failing at S3 (736 before the notice, 718.640625 while it stands). The recorded-mutation comment (selection.mjs:59-60) names d9e9b817. Its message text matches run 2's failure line byte for byte: I compared them by script against state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md at main 50cc228e.
- 720bb50d differs from d9e9b817 only in comments. That is two lines in two files over 6f72d0a7, by diff, and 6f72d0a7 is itself comment-only.
- Gate 1's pan-anchor condition is met: run 2 records 3 of 3 passes (16/16 each) at d9e9b817, run alone in an exclusive hold.
- No existing test or assertion changed:
  - StudioLayout.test.tsx has 56 insertions and 0 deletions; the one existing-region line is the added import at :18;
  - selection.mjs has 1 deletion, the header's step list at :8, which Amendment 1's §2.10 allows;
  - layoutState.test.ts, layout.mjs and App.*.test.tsx are not in the diff.
- PR CI (`gh pr checks 218`, exit 0) is all green at 720bb50d. The PR's head is 720bb50d and it is MERGEABLE.

## Documentation (must-fix before the merge; no re-gate; none of these is the human's wording, so section 31 (d) applies and the PR body lists the words applied)

**D-1. The PR #218 body is stale at the head.**
- It describes the change at e1f92a97.
- It gives §7 as 136, where the count at the head is 166 (below).
- It lists the e2e and both gates as Pending.
- It does not mention Amendment 3, the window step.
- It does not list gate 1's D-1 and D-2 as applied with no re-gate (section 31 (d)).
- It does not name each verify script with its commit (§9; gate 1 D-5).
- It does not list the e2e suites run (§9).

Fix: update the body to cover all seven points. The verify-script runs below can be cited: verify-cites, verify-quotes, verify-test-claims and verify.mjs, each exit 0 at 720bb50d.

**D-2. Gate 1's record items D-3, D-4 and D-5 are still open on main.**
- The form on main ends at Amendment 3, and no closing amendment exists. So the following are all still missing:
  - the title's entry in the superseded index (D-3);
  - the one reference to run 2's mutation section for 718.640625 against the predicted 715.45 (D-4);
  - H3's diagnostic order run, or a record that it was not run, class 2 (D-5). H3 appears in neither run record.
- Fix: the custodian's closing amendment, written as references and hashes (the record cap).

**D-3. frontends/shell/MANUAL-WALKTHROUGH.md:1861 (Z4).**
- The row says DevTools device toolbar but does not say that this needs a dev build.
- `tauri` is built with `features = []` (frontends/shell/src-tauri/Cargo.toml:58), so a release or packaged build has no DevTools.
- Part U's U1 (MANUAL-WALKTHROUGH.md:1725) names `npm run tauri dev` for the same toolbar.
- The words are the form's row (Amendment 1, item 3, §9's Z4), transcribed by the worker. They are not the human's.

Replacement words for the Step cell of line 1861:

At 1024 × 640 (a dev build, `npm run tauri dev`, with DevTools' device toolbar at 100%, as Part U's U1 sets it), open the file again over a selection and read the bar.

Clause check:
- a dev build, `npm run tauri dev`: release has no devtools feature (Cargo.toml:58), and U1 is the precedent (:1725);
- device toolbar at 100%: U1's own setting;
- open the file again over a selection: unchanged from the form's Z4;
- read the bar: unchanged.

The Expected cell is unchanged. It is outside the §7 count, and Part Z stays under its 30-line ceiling.

## Mutations observed (by me, in C:/dev/wt/sb1h at 720bb50d)
- **SB1:** at StudioLayout.tsx:203, `--status-h` set from `TOP_BAR_HEIGHT_PX`. Command: `npx vitest run src/layout/StudioLayout.test.tsx`, exit 1, 1 failed and 7 passed. The failure: SB1: .app carries --status-h at the status bar's fixed height and no --status-max-h, with AssertionError: expected '40px' to be '48px'. Reverted with `git checkout`; porcelain empty.
- **SB2:** at StudioLayout.tsx:203, `--status-h` set to 48 when `hasContent(slots["status.selectionEnded"])` and to 24 otherwise. Same command, exit 1, 2 failed and 6 passed:
  - SB2: --status-h is the same with the ended-selection notice absent, present and absent again, with AssertionError: expected '48px' to be '24px';
  - SB1, with expected '24px' to be '48px'.

  Reverted; porcelain empty; HEAD 720bb50dd0710697b869346c9726b0c50c9435e3.
- **Unmutated:** the same file, exit 0, 8 of 8 passed.
- **E-STATUS-HEIGHT:** taken as run 2 gives it, not re-run. The mutation was the status row back to `auto` and `.status-bar` back to `min-height: 1.5rem; max-height: 48px`. The step failed at S3: 388 x 736 before the notice, 388 x 718.640625 while it stands, 388 x 736 after it clears.

## Commands and exit codes
- `git diff --stat f8bc2951...720bb50d`: 0. Seven files.
- D-1 and D-2 against gate 1's words, compared by `cmp`:
  - gate1-architect.md:34-35 against StudioLayout.tsx:46-47 at 720bb50d: exit 0, identical (sha256 863362ee796d50af6a90a26e160ab240b12def720727848852b8395240d3e23c, both);
  - gate1-architect.md:47 against selection.mjs:741: exit 0, identical (sha256 4181c5df64061f4e069c66a6b4bdb8a824c6cdd1231d6794de585db5043f4a06, both).
- §7's numstat command at the head (merge base f8bc2951): exit 0.
  - selection.mjs 81+1 = 82 (ceiling 90; Amendment 3's prediction, at most 88);
  - StudioLayout.test.tsx 56 (70);
  - StudioLayout.tsx 7 (10);
  - layoutConstants.ts 4 (6);
  - layoutState.ts 10 (10);
  - styles.css 7 (12).
  - Groups: P 28 of 38, T 56 of 70, E 82 of 110. Total 166 of 218, over 6 files. No overrun, so no class 8.
  - MANUAL-WALKTHROUGH.md, outside the count: 21 of 30.
- `npm run verify` in frontends/shell, run 1, inside a shared hold: exit 1.
  - The one failure was src/notices/noticeDeterminism.test.ts, which timed out at 30000 ms. The log shows 57 lines of cargo's Blocking waiting for file lock on package cache, and two cargo.exe processes I did not start were running.
  - This is a timing-sensitive failure in a shared run, so it is not recorded as a failure (THE MACHINE). It was reported here, and the run was repeated once the lock was free.
  - Everything else passed: 92 of 93 files, 1337 of 1338 tests.
- `npm run verify`, run 2, inside a shared hold, with no cargo process running: exit 0.
  - vitest: 93 files and 1338 tests passed;
  - residency-trace: 76 passed, 0 failed;
  - citation-integrity: 30 passed, 0 failed.
- Verify scripts at 720bb50d (tools at that commit), each exit 0:
  - `node scripts/plan/verify-cites.mjs`: PASS, 38 advisories, not this PR's;
  - `node scripts/plan/verify-quotes.mjs`: PASS;
  - `node scripts/plan/verify-test-claims.mjs`: PASS;
  - `node scripts/plan/verify.mjs`: PASS.
- `gh pr checks 218`: exit 0. Eight checks pass: sign-off, profile path, ported-notices x2, tauri build x2, typecheck/build/vitest/cargo x2.
- Final `git status --porcelain` in C:/dev/wt/sb1h: empty.

## §8 item by item (items 4, 5, 9 and 15 to 18 as Amendment 1 restates them)
1. Every edited file is on Amendment 1's §2.10 May-edit list: styles.css, StudioLayout.tsx, layoutConstants.ts, layoutState.ts, StudioLayout.test.tsx, e2e/selection.mjs, and MANUAL-WALKTHROUGH.md (Part Z only, appended at the tail, :1851-1870). Pass.
2. No dependency, package.json or lockfile change. Pass.
3. Only the status row changed, and it is `var(--status-h)` (styles.css:34). Pass.
4. No item's text changed, truncated, cut by CSS or removed. The wrap (:165) and the scroll (:163) are kept. Pass.
5. No region's size depends on the bar's content (StudioLayout.tsx:194-204). Pass.
6. The footer markup is untouched, so there is no second copy of any item. Pass.
7. No change to the wire, SKP, the kernel, the engine, src/canvas, src/workspace, src/feature, src/publish or App.tsx. Pass.
8. The attention strip is unchanged. Pass.
9. No new or changed operator string. The e2e messages are harness output. Pass.
10. The rulings and Amendments 1 and 2 are at f8bc2951, before the first code commit 5bea403c. Pass.
11. The only export, `STATUS_BAR_HEIGHT_PX`, has product callers (StudioLayout.tsx:27, :203; layoutState.ts:13, :138). No prop, state or callback is added. Pass.
12. No performance claim, and nothing for macOS or Linux above L1. Pass.
13. No quote of the human marked verbatim. Pass.
14. Every mutation was observed:
    - SB1 and SB2 at 5bea403c by the worker, and again by me at 720bb50d;
    - E-STATUS-HEIGHT at d9e9b817 by the custodian (run 2).

    No `verify-mutation` run is called an observation. Pass.
15. E-DBLCLICK is last (selection.mjs:867, after E-STATUS-HEIGHT at :866), and no existing test or assertion changed. Pass.
16. KNOWN-LIMITATIONS.md is not edited. Pass.
17. No button, toggle, console row, focus stop or string for the bar. Pass.
18. e2e/README.md is not edited. Pass.

## Amendment 3 against the code
- s6, the body is not re-indented: the body was renamed to `stepStatusHeightAt880` (:742).
- Item 4, s2: B records whether `.residency-status` is present (:750).
- Item 5, s3: the PASS note carries A's canvas height, B's scrollHeight against its clientHeight, the residency presence, and the inner size after the resize and after the restore (:785, :798, :808).

Every item holds.
