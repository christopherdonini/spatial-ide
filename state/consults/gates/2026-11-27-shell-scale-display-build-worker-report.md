# Shell-scale-display's build from its base, the worker's report

*Filed by the custodian, 2026-11-27. The build of the form's §2 and §4 (Amendments 8 to 10), made in D:/wt/scale from 530d7b0eff587cce7c71da26295c5dfa2602b63c, with no app, dev server or e2e suite started. A sonnet worker made it. Its run, from its completion notice only (ADV-2026-11-26-02), was 125 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (8744 bytes, sha256 9e4fe9cb18b12c101bb8c06a9406fd3a863053324268a229046b8faebd9321d5), byte for byte. Its account is the worker's. It is filed in this folder because its cites name lines at a branch commit. The custodian checked the head, its four commits and §7's count by git. No gate-log row: a build is not a gate.*

---

9f8b67cdab999426691b53fa452a9526833cf909 is pushed (origin/cut/shell-scale-display, confirmed by fetch). NOT every step completed. The heavy runs were NOT done because the disk is under the floor: `df -m /c` read 40870 to 40886 MB (floor 40960), so I stopped before them per the brief. The undone steps are `npm run typecheck`, `npm test` (its pretest runs the build), the full vitest suite at HEAD, and the `node --test` suites at HEAD. Everything else is done. No PR is opened. No app, e2e or dev server was started.

STEP 0 (suites at the clean base 530d7b0e): typecheck, vitest, verify-cites, verify-quotes, verify-test-claims and `node --test` (623 tests, 0 failures, rc=0) were all green. Logs are D:/wt/scale-logs/step0-*.log.

COMMITS (base 530d7b0e):
- f9604f29505105b36b563ae435456cf035b36e04 "feat: shell-scale-display's skeleton and its tests, red (P0 commit 1)"
- 0fd5b1bb4ee0e10a7deb4e47619cc3f16b5de0e8 "feat: shell-scale-display's scale reading (P0 commit 2)"
- 1d613b045aee86b089fc83004d582357b3b134cb "fix: shell-scale-display's E-SCALE paths for corpus file #8 and the manifest". The two path literals added in commit 1 had lost their doubled backslashes.
- 9f8b67cdab999426691b53fa452a9526833cf909 "fix: shell-scale-display's scaleBar.ts comment names the string ids with the form". One comment wrote S-1 and S-2 bare; words only.

COMMIT 1 REDS (vitest at f9604f29, log D:/wt/scale-logs/c1-red-run-at-f9604f29.log). Each failed at an assertion, not at an import or compile error:
- U-SB1 `scaleReading picks the smallest 1-2-5 length...` failed at scaleBar.test.ts:25. It expected `{kind:'bar',mantissa:2,...}` for "30 px per unit: L 2, width 60" and got `{kind:'none'}`.
- U-SB2 `the bar is never shorter than SCALE_BAR_MIN_PX...` failed at :49. "zoom -19: expected 'none' to be 'bar'".
- U-SB3 `scaleLabel writes the length's exact decimal in OPEN-4's format` failed at :73. "5 x 10^-3: expected '' to be '0.005'".
- U-SB4 `a bar only for metre; SHELL-SCALE-DISPLAY S-3 ...` failed at :78. "metre at zoom 0: expected 'none' to be 'bar'".
- R-SC1 in App.scale.test.tsx failed at :164. "(ii) the label for zoom 0: expected undefined to be '[P6 placeholder] 100 m (CRS)'".
- E-SCALE (in e2e/layout.mjs) is only `node --check`ed (rc 0) and not run. Its red is owed to the tester at the port, and so is M6.

MUTATIONS M1 to M5. Each was applied, its named test run, the failure recorded, then reverted. They ran on a clean tree at 1d613b04. The only later commit, 9f8b67cd, changes one comment line. Logs are D:/wt/scale-logs/mut-M*.log and the driver is mutate.py.
- M1 (`>=` to `>` in readingAtPxPerUnit) failed U-SB1 at "30 px per unit: L 2, width 60" (got mantissa 5).
- M2 (mantissas [1,2,5] to [1,5]) failed U-SB1 at the same assertion, and U-SB2 at "zoom -18.34375: the width stays under SCALE_BAR_MAX_PX" (150.297).
- M3 (`exponent = Math.abs(exponent)` in scaleLabel) failed U-SB3 at "5 x 10^-3: expected '5,000' to be '0.005'".
- M4 (`unit !== "metre"` to `unit === "degree"`) failed U-SB4 at "other at zoom 0: expected a bar to equal not-metre".
- M5 (ScaleItem reads once without `useSyncExternalStore`) failed R-SC1 at "(ii) the label for zoom 0: expected undefined...".
- For M2 to M4 the tests stop at their first failing assertion, so only the first failing case is recorded. I briefly made them soft, then reverted that edit. It is not in the commits.

CHECKS at HEAD 9f8b67cd:
- `verify-cites`: rc=0, "PASS — every rooted (in-tree) path:line reference across 3747 file(s) resolves. (221 loose reference(s) advised above.)"
- `verify-quotes`: rc=0, "PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), ... 944 ruling cites resolved, 0 ruling-cite errors."
- `verify-test-claims`: rc=0, "PASS — all 901 claimed test(s) across 293 file(s) exist or are planned, superseded or withdrawn (17 planned, 16 superseded, 17 withdrawn, advisory)."
- `verify-mutation --base 530d7b0e --head HEAD`: rc=0, "PASS — all 5 new test(s) have a recorded mutation naming them." This is not an observation.
- `node --check frontends/shell/e2e/layout.mjs`: rc=0.
- Light stand-ins only, run at HEAD: `npx tsc --noEmit` rc=0, and vitest on scaleBar.test.ts, App.scale.test.tsx and StudioLayout.test.tsx rc=0 (3 files, 18 tests passed). These are NOT `npm run typecheck`, `npm test` or the full suite.
- Not run: `npm run typecheck`, `npm test`, full vitest, `node --test` (disk floor, as above). Logs are D:/wt/scale-logs/v2-*.log and final-*.log.

§7 COUNT (`git diff --numstat 530d7b0e...HEAD -- frontends/shell ':!...MANUAL-WALKTHROUGH.md' ':!...e2e/README.md'`): 487 insertions, 4 deletions, 491 total (at most 760), 10 files (at most 10). Each file against its ceiling:

| File | Changed lines | Ceiling |
|---|---|---|
| scaleBar.ts | 70 | 90 |
| regionParts.tsx | 38 | 45 |
| App.tsx | 7 | 20 |
| contributions.ts | 1 | 3 |
| styles.css | 15 | 25 |
| WorkingCanvas.tsx | 2 | 3 |
| scaleBar.test.ts | 89 | 180 |
| StudioLayout.test.tsx | 1 | 2 |
| App.scale.test.tsx | 184 | 240 |
| e2e/layout.mjs | 84 | 150 |

Outside the count: e2e/README.md 2 (at most 20), KNOWN-LIMITATIONS.md 4 (at most 10), MANUAL-WALKTHROUGH.md 29 (at most 45). There is no overrun.

§8 ITEMS AT HEAD:
1. Untrue (no violation). The diff has only §7's files plus the three declared outside-count files.
2. Untrue. The only `canvas/` edit is the one comment line in WorkingCanvas.tsx (the caller sentence, now :149). No handle method is new or changed.
3. Untrue. No dependency, lockfile, workflow, wire, kernel, engine or src-tauri change.
4. Untrue. A bar appears only for `metre` (`scaleReading`, U-SB4). There is no ratio. "ground" appears only in S-2's negation (scaleBar.ts), and the KL item 80 title and text, which the form drafts.
5. Untrue. The unit is `admitted.describe.crs.unit`, and `getBox() === null ? null : readZoom()` never reads a zoom while the box is null. R-SC1 (iv) covers a second open.
6. Untrue. App has only a `useCallback` `readZoom`. `useSyncExternalStore` is in `ScaleItem` (regionParts.tsx).
7. Untrue. `ScaleItem` has no timer, no await and no `role`. R-SC1 asserts no role.
8. Untrue in the sense the item means, but one thing is for you. I built S-1 to S-4, the KL item and Part AI under the `[P6 placeholder] ` mark (milestone 5's precedent, per the rulings I was given). The form's §3 table lists S-1 as `100 m (CRS)` without the prefix. The words are the form's drafts only. Flag this for the advisor.
9. Partly true. `SCALE_BAR_MAX_PX` has no product caller; only the tests and comments use it. `readingAtPxPerUnit` is exported and its product caller is `scaleReading`. `scaleLabel`, the S-1 and S-2 functions and the S-3 and S-4 constants are all used by `ScaleItem`. `readZoom`'s caller is the slot.
10. Untrue. StudioLayout.test.tsx gets one added `"status.scale": null` line. No existing assertion is edited.
11. Untrue. M1 to M5 are observations with their commit (1d613b04). `verify-mutation` is reported only as a check.
12. Untrue. No overrun, and §7 is not edited.
13. For the custodian. There is no cite into DECISIONS-PENDING.md and no hash at a branch commit. Part AI row AI5 carries the form's own draft cite `frontends/shell/MANUAL-WALKTHROUGH.md:146` (a line in the same file, the fixtures row). Part AI was appended at the end, so line 146 is unmoved. Whether that counts as a "bare self-line" is yours to rule.
14. Not applicable. No merge was made.

DEPARTURES AND NOTES:
- I drafted code in the worktree before step 0 finished. I moved it to D:/wt/scale-logs/held/ and reverted the tree, so step 0 ran on the clean base.
- The `[P6 placeholder] ` prefix is on S-1 to S-4 and on the KL item 80 title and paragraph (item 8 above).
- Part AI's intro, "Before" line and the AI0 and AI2 wording are boilerplate or additions beyond the form's sketch. AI2 names corpus #8's path. Amendment 4 item 3 row 5's added instruction is not drafted in the form, so I omitted it.
- S-2's "1 metres" grammar is the draft's own and is left as drafted.
- KL item 80's closing sentence about devicePixelRatio 1 stands only if E-SCALE records dpr 1, and E-SCALE has not run.
- `ScaleItem`'s `aria-label` on a div is as the form drafts it.
- I started a verify chain at 1d613b04, killed it (its own bash, PID 56440, and node, PID 64492) after finding the bare-id comment, and re-ran all four verify scripts at 9f8b67cd. The `*.log` names without a "v2-" prefix are the killed run's (fin-verify-cites.log, a pass at 1d613b04, and a partial fin-verify-quotes.log).
- The one-off `git checkout --` of tracked files was used to revert mutations and a held-back edit. It is not on the forbidden list.
- Logs are in D:/wt/scale-logs/.
