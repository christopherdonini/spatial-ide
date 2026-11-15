Reviewed: PR #311 at b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a (the custodian's filing note, 2026-11-12: the reviewer's gate from dispatch, after the architect's, under the form's §9 and the human's third message of 2026-11-12, item 1, its edge check by Amendment 4 item 1; PLAN node recentre-crossing-view-displaced-fix, slot 2; its pins marked for the custodian or a reviewer to compute; below, the hand-back, one final newline added and one change: its scratch folder's path, in its last paragraph, written `<S>`)
Reviewed: PR #311 at b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a (base 9398efc6), gate, reviewer
Verdict: PASS WITH NOTES
Branch and commit: cut/recentre-crossing-view-displaced-fix @ b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a. The cites below are read at that commit; a line given without a commit is at H.

No edge-check stop. There are no Correctness or Evidence findings. There are four Documentation findings, each must-fix before the merge. None of them is the human's wording or red-line text.

## Findings

### Correctness
None.

### Evidence
None.

### Documentation (must-fix before the merge)

**D1. `frontends/shell/e2e/README.md`, the new Recentre crossing entry, first sentence.**
- The defect: the sentence says the e2e "checks that a pan, a double-click or a wheel tick that carries the target past the re-centring bound moves the frame's origin and does not move the view". This is untrue for the double-click. Case 2 (i) of `e2e/recentre-crossing.mjs` asserts that no origin changes from the double-click to its settle. Only the wheel tick after it is asserted to move the origin, under (iii).
- Replacement words: "`e2e/recentre-crossing.mjs` checks that a pan that carries the target past the re-centring bound moves the frame's origin without moving the view; that a double-click whose zoom carries the target past the bound moves no origin until its transition has ended, and zooms by one step; and that the wheel tick after it moves the origin without moving the view."
- Clause check:
  - "a pan … moves the frame's origin without moving the view": case 1 (a). Line 278 makes an origin change in each leg a precondition; without one the run is VOID.
  - "a double-click whose zoom carries the target past the bound": case 2 drags out into the window (0, half], where half is shift·2^-z/2 (lines 294-307).
  - "moves no origin until its transition has ended": case 2 (i).
  - "zooms by one step": case 2 (ii), which asserts the zoom before plus 1.
  - "the wheel tick after it moves the origin without moving the view": case 2 (iii), which fails when there is no origin change ("nothing to compare").

**D2. `frontends/shell/src/canvas/WorkingCanvas.tsx` 2337-2339, the DEV seam comment, now stale.**
- The defect: it says the seam reuses the primitives "`fitToExtent`/the real interactive `onViewStateChange` handler already use", including "deck's own uncontrolled `initialViewState`". After the fix the interactive handler no longer writes `initialViewState`. It returns `rebased` (2157, 2172), and the in-callback `setProps({initialViewState})` is removed. Only `fitToExtent` (1416, 1424) and the seam (2364, 2369) still use that pair.
- Replacement for lines 2337-2339, with the sentence continuing at 2340 as it stands: "Reuses the EXACT primitives `fitToExtent` already uses -- `OffsetFrame.forceRecenter` and deck's own uncontrolled `initialViewState`, written here outside deck's view-state callback (this file's own top doc comment on why `initialViewState`, never `viewState`, works there and not inside the callback) -- and"
- Clause check:
  - `fitToExtent` calls `forceRecenter` at 1416 and `setProps({initialViewState})` at 1424.
  - The seam calls the same two at 2364 and 2369, outside the `onViewStateChange` handler (2091-2173).
  - The top doc comment, 103-108, gives the inside-versus-outside reason.
  - `onViewportChangedRef` is called only at 1092, which `reportViewport` reaches, so the continuation at 2340 stays true.
- Size: −3/+3, so the file goes from 60 to 66 against its ceiling of 70.

**D3. The same README entry, its VOID parenthetical.**
- The defect: it lists three of the Void causes. The script also exits 2 when:
  - an app is already listening on the CDP port (66);
  - the canvas is too narrow for a drag (114);
  - case 1 has no origin change in a leg (278);
  - case 2's drag-out cannot land inside its window (300, 307);
  - there is a fatal error (347).
- Replacement: "2 when the run is VOID (an app already listening on the CDP port, the fit line never arrives, no canvas or a canvas too narrow for a drag, case 1 has no origin change in a leg, case 2's drag-out cannot land inside its window, or a fatal error)"
- Clause check: these are the throws at 66, 94, 107, 114, 278, 300 and 307, and the fatal exit 2 at 347. The missing-argument exit 2 at 52 is covered by the entry's existing "without a measure build" words.

**D4. `WorkingCanvas.tsx`, the settled-tick note in the handler (the sentence carrying "would silently defer the origin advance by one gesture; harmless within `RECENTER_MAX_DRIFT`'s own headroom").**
- The defect: the sentence is carried from B and reworded in this diff. "By one gesture" and "harmless" are not established.
  - A deck that stops emitting the settled tick would never re-centre in a pan-only session. The guard at 2153 is the only interactive re-centre, and there is no timer or fallback.
  - No record measures either case, and §3 forbids any claim about `pointercancel`. The sentence itself says "neither read nor run".
- Why Documentation and not Correctness, under the wording-blocks rule: neither case can be reached by an operator in the shipped app. Deck is locked at 9.3.9, so a deck upgrade is not ordinary use. The `pointercancel`-with-no-`panend` case is the form's own unread case, which the rule says to name in the source comment, and the replacement does.
- Replacement: "A deck upgrade that stops emitting that tick -- or a gesture ended by `pointercancel` with no `panend`, neither read nor run -- would leave the origin where it is until the next tick the guard below lets through, and the frame's offset may exceed the re-centring bound until then; that is not measured, and there is no in-code fallback."
- Clause check:
  - "leave the origin where it is until the next tick the guard below lets through": the guard at 2153, `!isDragging && !inTransition && !startsTransition && frame.maybeRecenter(...)`, is the only interactive re-centre.
  - "may exceed the re-centring bound": `maybeRecenter` only acts when the guard admits the tick (`offsetFrame.ts` 64-69, 84-91).
  - "not measured": no record in the form or the reports runs either case.
  - "no in-code fallback": the existing words, unchanged.
- See READING QUESTION 2.

### Notes (not findings)
- (e) The S6b to S7 report hashes the dcheck's code slice at branch commit f88bc008 and names that commit. It is a reading under §11 item 10, not a path:line pin.
- The refactor makes an exception in `analyze` fatal (exit 2) where it was "capture failed" (lines 110-111 against 88). No verdict changes on any recorded run.
- scan-dist printed "record written", and the porcelain stayed empty afterwards.

## Checks

1. **Start state.**
   - HEAD is b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a and the porcelain has 0 lines.
   - `df -h`: C: 17G free, D: 216G free, both above their floors.
   - The fixture list `<S>/rcf-gr-fix-before.txt` has 34 files.
2. **Scope.**
   - `git diff --name-only B...H` names exactly §7's six files, all under `frontends/shell/`. Nothing is under kernel/, engine/, protocol/, renderer/ or docs/, and KNOWN-LIMITATIONS.md is not touched.
   - `package.json`'s one line is the `e2e:recentre-crossing` script line, and `package-lock.json` is unchanged.
   - §3 and §11 were read clause by clause against H, with no breach.
3. **§7's counts** (numstat):

| File | Sum | Ceiling |
|---|---|---|
| `WorkingCanvas.tsx` | 60 | 70 |
| `WorkingCanvas.recentre.test.tsx` | 218 | 300 |
| `recentre-crossing.mjs` | 347 | 450 |
| `package.json` | 1 | 2 |
| `e2e/README.md` | 12 | 45 |
| `MANUAL-WALKTHROUGH.md` | 1 | 4 |

   The added lines hold 0 CR and 0 tab, counted by node. Each file ends with a newline.
4. **The code and its words.**
   - The handler matches §2.1 (Shape A): `rebased` returned, `render()` called, the in-callback `setProps({initialViewState})` removed, and the guard as above.
   - U1 and U2 match §4.
   - F2's words equal line 235. F3's are contained in line 18 and end it (`<S>/rcf-gr-f2f3.out`).
   - Every added comment, README sentence and test name was read against the code. D1 to D4 are the sentences that fail.
5. **Amendment 2 item 8's code facts.**
   - `git diff 3df3e57c H -- e2e/recentre-crossing.mjs` (`<S>/rcf-gr-c5-diff.txt`) shows (c)'s code changed only by F1 (B from the start image, `ringB`) and the move to a REPORT line, with (d) added. `edgeVerdict` (lines 217-229) implements rule (d) as Amendment 2 item 4 declares it: B from the start ring, marking at more than 8, the boxes, inner edges, K, the unreadable cases, differs on N_end 0 or a K move over 4.0 scaled by bw/cw and bh/ch.
   - The product tree is unchanged since 3df3e57c.
   - Both exes match R7 and R10 in size and sha256.
   - Item 1's record (c failed at 3df3e57c) is not re-labelled in the diff or in the filed text.
6. **Installs.** `npm ci` in `frontends/shell` and in `renderer/bundle-viewer` both returned rc 0 (holds 66428 and 33380). The porcelain stayed empty.
7. **`npm run verify`**, rc 0:
   - vitest: Test Files 112 passed, Tests 1458 passed;
   - residency-trace: 76 passed, 0 failed;
   - citation-integrity: 30 passed, 0 failed;
   - export-elapsed: 5 pass, 0 fail;
   - s5d-verdict: 7 pass, 0 fail.
8. **E1 at the head measure exe.**
   - Before: the exe's sha256 was abb38571221ae4b26d035914df1d3dfad7214fab3a2eee82cc5b6645e46ec6ed (= R7). Port 9223 had no lines and no spatial-ide-shell process was running.
   - The run returned rc 0 and its log ends `==== 6/6 PASS ====`. The log `<S>/rcf-gr-e1.log` is 2097 bytes, sha256 e0e32739270fe51448af16335b5e6f43d10a1dcf70a07f00428fc867502d4b83. Its lines are identical to S6d's except the image paths.
   - Origin changes came at drags 35 and 74, as P-head predicts.
   - REPORT end line: target (-4.547473508864641e-13, 0), origin (2603460.114163697, 1200019.902370003), zoom -3.692532927362801.
   - (d): K {left, bottom}, moves 0.00 and 0.00.
   - Case 2: 20 lines and 0 origin changes from the double-click to its settle; (iii) shows 1 origin change and a jump of 0.00.
   - After: 9223 shows one TIME_WAIT line only and no spatial-ide-shell process.
   - Images copied:
     - `<S>/rcf-gr-recentre-crossing-e1-1794521469089-case1-start.png`, 34623 bytes, sha256 102996b1…f3f2;
     - `<S>/rcf-gr-recentre-crossing-e1-1794521469089-case1-end.png`, 107990 bytes, sha256 cf7fd271…f519.
9. **Recompute** (`<S>/rcf-gr-recompute.mjs`, output `<S>/rcf-gr-recompute.out`).
   - All 10 images were checked by sha256 against their records. The rule's definitions are taken from lines 185 (`ringB`), 195-200 (`analyze`), 206-211 (`pairVerdict`) and 217-229 (`edgeVerdict`), with TOLERANCE at line 38.
   - The S6c (base) pair: (c) differ, N 35248 → 0, shift 0.00. (d) differs, with N_end 0.
   - The S6d pair and my pair agree with each other:
     - start C (365.660, 307.568), end C (366.562, 178.021);
     - (c) differ, shift 129.55, matching the REPORT lines;
     - (d): K {left, bottom}, moves 0.00 and 0.00, pass.
   - The four stored images: 3 AGREES and 4 "EQUALS item 2" against Amendment 2's settlement item 2, with 0 mismatches.
   - Afterwards I ran `rcf-s6b-dcheck.mjs` at H (`<S>/rcf-gr-dcheck-at-h.out`). It agrees with mine, with the same slice sha db217dd1.
10. **Edge check** (Amendment 3 item 2, as Amendment 4 item 1 reads it).
    - The extent: my footer reader `<S>/rcf-gr-extent.mjs` checked the fixture's sha256 against the packet and read the bbox leaf statistics. The writer is `engine/src/fixture.rs`, which writes the bbox column with statistics. The extent is xmin 2600003.256712603, ymin 1200003.2761975063, xmax 2612676.76241853, ymax 1212636.7777399363.
    - The projection (OrthographicView flipY false, WorkingCanvas.tsx:2052; deck's orthographic-viewport scale 2^zoom, y scale +1 with flipY false; `viewportBbox.ts` 38-44):
      - col = cw/2 + (X − Wx)·2^z
      - row = ch/2 − (Y − Wy)·2^z
    - Applied at the S6d / my end line, the fixture's edges fall at left 66.627, right 1046.869, top −619.863, bottom 357.286. The end image's box is left 66, right 667, top 0, bottom 357.
    - The tolerance: the parcel half-extent is at most 16.8 m. That comes from the 40 m grid (fixture.rs:93), the ring at cell·0.42 (1419) and jitter of at most 1.0 (1688). At 2^z = 0.077346 it is 1.299 px. The outline width is 0 (`style/document.ts:79`; the outline layer is drawn only when the width is > 0, `buildLayers.ts:501`). With the 4.0 buffer px, the tolerance is 5.299 buffer px.
    - I used the half-extent and the outline width in place of the point radius.
    - The K edges: left is 0.627 off and bottom 0.286 off, both within the tolerance.
    - The fixture reaches the canvas's top and right edges at that view, so the start image is the partial one. There is no stop.
11. **The dev build and its prerequisites.**
    - `npm run build` in `renderer/bundle-viewer`: rc 0. The scan's last lines, byte-copied:
      - "scan-dist: 3 files scanned, 2 findings, all reviewed; record written"
      - "reviewed row NOTICE.txt credential 19092: matched"
      - "reviewed row NOTICE.txt local-filesystem-path 111337: matched"
      - "reviewed row app.js local-filesystem-path 7291: not found"
    - `generate:notice`: rc 0, `src/generated/NOTICE.txt (3506979 bytes)`.
    - The exe build: rc 0, `copied exe`. The exe is 91544064 bytes, mtime 2026-11-12 23:35:26 +0100, sha256 cf899401a6de017e3d905c23a62866e5dcb6e14f5ae067a177398ff271648124.
    - verify-bundle example: rc 0.
    - The porcelain stayed empty.
12. **The suites.** The e2e list at H is the sixteen given, plus `e2e:debug` and `e2e:recentre-crossing` (`<S>/rcf-gr-e2e-list.txt`). All 18 runs, `pan-anchor` included, returned rc 0, and none was re-run. Each app-down printed "killed tree ×2, port 9223 free, port 5400 free", and each run's session log was copied to `<S>/rcf-gr-gr-<tag>.session.log`. `pan-anchor` passed 16/16, including recenter-crossing-A dx=±1200 at both sizes, the step that failed at 1c's head. The table is below.
13. **Fixtures after:** 34 files; `cmp` with the before list gives 0.
14. **Governance at H:**
    - the scripts suite: rc 0, 598 tests, 598 pass, 0 fail;
    - verify-cites: rc 0, PASS, 2890 files;
    - verify-quotes: rc 0, `verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 925 ruling cites resolved, 0 ruling-cite errors.`;
    - verify-test-claims: rc 0, PASS, 793 claimed tests across 256 files;
    - `verify.mjs --offline`: rc 0, PASS.
15. **The S6b to S7 report against its outputs** (`<S>/rcf-gr-c15.mjs`, output `<S>/rcf-gr-c15.out`). No untrue sentence found.
    - Every file size and hash it names matches.
    - The README tail and the A7a row at H equal the drafts (`cmp` 0).
    - The numbers it gives match: d = 3749.395, n1 = 37, first crossing 35, back leg 74, window 1939.342; first notch at or under a tenth is notch 8; k = 3, N = 5; the procs-before files have 5 processes each.
    - Its line 24 (edgeVerdict "exactly as Amendment 2 item 4 declares it") is true; see check 5.
    - The TIME_WAIT claims are true, from the port files:
      - S6c before: empty. After: 9223→7652 TIME_WAIT.
      - S6d before: the same 7652 line. After: 9840.
      - S6e before: 9840. After: 11634.
16. **CI**, read at 2026-11-12T22:21:26Z: all 8 checks pass and the PR is a draft, open, at head H. Each run's headSha is b7ba9f77…, all success:
    - 43313525659 DCO sign-off;
    - 43313525673 Exposure scan;
    - 43235997807 and 43313525555 Ported notices;
    - 43235997749 and 43313525562 Product CI — shell.
17. **End:**
    - no spatial-ide-shell process, and no lines on 9223 or 5400;
    - the busy check printed FREE (rc 0) at 2026-11-12T23:43:02Z;
    - HEAD is b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a and the porcelain has 0 lines;
    - the harness's app-down stopped each suite's own process trees.

## Suite runs
Every script is run as `node e2e/<file>.mjs` through `rcg-e2e-run-suite.sh`, on the dev build on port 5400. All 18 have rc 0.

| Tag | Script | env | Start | End | Load line | Last line before `rc=` |
|---|---|---|---|---|---|---|
| gr-regression | regression.mjs | – | 22:47:53Z | 22:53:23Z | 22:47:44Z 27,21,19 | This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use. |
| gr-refusal-contract-baseline | refusal-contract-baseline.mjs | – | 22:54:19Z | 22:55:08Z | 22:54:08Z 30,17,0 | (same) |
| gr-admission | admission-remediation.mjs | – | 22:55:36Z | 22:56:05Z | 22:55:28Z 22,16,7 | (same) |
| gr-filter | filter.mjs | – | 22:56:32Z | 22:56:46Z | 22:56:24Z 7,4,6 | (same) |
| gr-filter-panel | filter-panel.mjs | – | 22:57:14Z | 22:57:42Z | 22:57:05Z 2,14,8 | (same) |
| gr-style | style.mjs | – | 22:58:07Z | 22:58:18Z | 22:57:58Z 37,23,13 | (same) |
| gr-publish | publish.mjs | – | 22:58:46Z | 22:59:01Z | 22:58:37Z 27,27,12 | (same) |
| gr-console | console.mjs | – | 22:59:36Z | 23:05:33Z | 22:59:27Z 8,26,22 | (same) |
| gr-layout | layout.mjs | – | 23:06:06Z | 23:07:02Z | 23:05:54Z 25,21,23 | This run launched the app; it stays RUNNING on CDP port 9223. |
| gr-selection | selection.mjs | – | 23:07:40Z | 23:18:05Z | 23:07:30Z 26,34,31 | [EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover. |
| gr-export-view | export-view.mjs | – | 23:18:42Z | 23:19:07Z | 23:18:32Z 22,27,31 | [export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS |
| gr-recording | recording.mjs | SHIMDIR=shim-wait | 23:19:38Z | 23:19:48Z | 23:19:28Z 31,26,20 | Full console ledger: C:\dev\wt\rcg\frontends\shell\e2e\out\recording-console-ledger-1794525587798.json |
| gr-command-bar | command-bar.mjs | – | 23:20:17Z | 23:21:53Z | 23:20:07Z 25,22,26 | This run launched the app; it stays RUNNING on CDP port 9223. |
| gr-attributes | attributes.mjs | – | 23:22:47Z | 23:25:11Z | 23:22:37Z 34,35,45 | [attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS |
| gr-table | table.mjs | SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]' | 23:25:44Z | 23:26:40Z | 23:25:36Z 21,8,8 | [table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS |
| gr-project | project.mjs | – | 23:27:08Z | 23:27:34Z | 23:26:59Z 16,13,3 | Full console ledger: C:\dev\wt\rcg\frontends\shell\e2e\out\project-console-ledger-1794526054660.json |
| gr-residency-harness | residency-harness.mjs | – | 23:28:04Z | 23:28:22Z | 23:27:55Z 6,11,16 | (rc only; no figure recorded) |
| gr-pan-anchor | pan-anchor.mjs | – | 23:28:51Z | 23:32:16Z | 23:28:42Z 6,13,16 | ==== 16/16 PASS ==== |

Step results:
- regression: A1', A3', A4', A7', A8', A9', K6, K7, CURSOR', FIND', MP', PT', LN', ABSENTCRS' PASS; NET' INFO.
- refusal-contract-baseline: OVERCEIL' and REOPEN' PASS.
- admission: 11 PASS.
- filter: OPEN, FILTER' and REFUSED' PASS.
- filter-panel: 5 PASS.
- style: 6 PASS.
- publish: 4 PASS.
- console: 11 PASS, including REGRESS'.
- layout: 13 PASS, including FIXTURES.
- selection: 18 PASS, 0 FAIL.
- recording: OPEN, APPLY, STYLE, RESET and RECORD PASS.
- command-bar: 14 PASS.
- project: 12 PASS.

## READING QUESTION lines
- READING QUESTION 1 (check 10): the extent comes from the bbox statistics, which are geometry extents and so already contain each polygon's half-extent. Provisional reading used: I added the half-extent (1.299 px) to the tolerance anyway, as Amendment 4 item 1 orders. Without it the tolerance is 4.0; both K edges (0.627, 0.286) pass on either reading.
- READING QUESTION 2 (D4): whether a carried sentence claiming "harmless" for a case the form leaves unread is Documentation under the wording-blocks rule, or an unsupported guarantee under Evidence. Provisional reading used: Documentation, because neither case can be reached in ordinary use of the shipped app (deck locked at 9.3.9; `pointercancel` unread and named in the replacement).

## For the human
- Row A7a (your step and the approved outcome): no finding.
  - The step span is 181 bytes, sha256 4572484e…bb17, and the step cell equals it with N = 5.
  - The outcome span is 167 bytes, sha256 6268732a…073f, and the outcome cell equals the draft.
  - N = 5 is consistent with S6e.

## The packet's gaps
- The packet says "770 lines plus Amendment 4"; the form has 800 lines.
- The packet does not name the sources for the projection or the half-extent. I took them from code at H, as cited in check 10.

## Hold lines
Every heavy call ran in a shared hold of the form `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<elided>`, released at its end. The verify-quotes run shows the pair: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:73240 also=<elided>` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:73240 affinity=FF (cores 0-7)`.

Shell PIDs:
- npm ci: 66428 and 33380;
- verify: 65032;
- E1: 7896;
- bundle-viewer build: 81440;
- generate:notice: 79900;
- exe build: 17588;
- verify-bundle: 60308;
- the suites, in table order: 37216, 51920, 73200, 16768, 66444, 79360, 54632, 65332, 3864, 79360, 38152, 35280, 6140, 14948, 61524, 52600, 20852, 53304;
- scripts suite: 74764;
- verify-quotes: 73240.

The script's status shows no SpatialIDE hold left.

## Background shells left
None. bhtyp72ku, the verify-quotes run, completed with exit 0.

## Model
claude-opus-5-5

Files: the form is `C:\dev\spatial-ide\governance\forms\frontends\RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md`. The finding sites are `C:\dev\wt\rcg\frontends\shell\e2e\README.md` (D1, D3) and `C:\dev\wt\rcg\frontends\shell\src\canvas\WorkingCanvas.tsx` (D2, D4). The outputs are in `<S>` (names starting `rcf-gr-`, and `rcg-e2e-h\out\`).
