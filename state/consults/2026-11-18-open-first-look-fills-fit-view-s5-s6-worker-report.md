Built: open-first-look-fills-fit-view S5 and S6, worker-high (the custodian's filing note, 2026-11-18: worker-high, model claude-opus-5-5, its run 2026-11-18T22:12:42Z to 22:28:12Z by its transcript, Bash 49, Read 11, Edit 9, Write 2, two errored; 10431 bytes, sha256 82699fcf7d5b1654f3f7ad575a521f25f9dc04dd2cc6a57b866dc066f7658d35; below byte for byte, with this note and one final newline)
Result: the change is committed as C (e4c1dfba) on top of the merge of U (M, 3ab8c8a7), and both are pushed. At C every U-FL test and every existing test passes and the typecheck is clean. All six mutations fail as §4 says, with one gap: under M-U2g the test stops at its first assertion, so the "two status emits" were never seen. No STOP.

**Start state and installs.** Worktree C:/dev/wt/fl on branch cut/open-first-look-fills-fit-view. HEAD was 9cea65d9d6519c088bdf0c853234ecd665e9b60b and the porcelain was empty. ls-remote gave E' 9cea65d9… and U fe23634c0bcf692b3e21e798033447d19f88a149. `df` showed C: 49G free and D: 360G free. `git fetch` returned rc=0. `npm ci` returned rc=0 in renderer/bundle-viewer and rc=0 in frontends/shell, and the porcelain was still empty afterwards.

**M and C, and the pushes.**
- M = 3ab8c8a79029111ca100ac52bfa427362a9c95ad, "Merge U, the tests U-FL1 to U-FL6 (open-first-look-fills-fit-view S3), into the first look's branch before S5". The merge returned rc=0 with no conflict, and `git diff --name-only 9cea65d9 HEAD` named only the two test files. Push: `9cea65d9..3ab8c8a7`; ls-remote printed 3ab8c8a7….
- C = e4c1dfba36cca15dbfa5dd6105cd2c4028f27221, "fix: the first look plans the view it shows at its Completed terminal (open-first-look-fills-fit-view S5)". It touches 2 files, 52 insertions and 8 deletions, and the porcelain was empty after the commit. Push: `3ab8c8a7..e4c1dfba`; ls-remote printed e4c1dfba….

**The change at C.**
- **WorkingCanvas.tsx:** the member's doc is at 151-155 and the member `shownViewportBbox?(): AuthoritativeBbox | null;` at 156, just after `currentView?`. Its implementation is at 1636-1642, after `currentView()`.
- **candidateArmSession.ts:**
  - The top doc paragraph is at 68-85.
  - The block is at 1482-1506: comment 1482-1489, guard 1490-1499, box 1500, session line 1502, `handleViewportChange(box)` 1503. The sink's final `syncScanLiveness()` follows at 1507, and S1's block above it is unchanged.
  - The eight terms, by line: (i) 1491, (ii) 1492, (iii) 1493, (iv) 1494, (v) 1495, (vi) 1496, (vii) 1497, (viii) 1498.
- **§10.3 comments:**
  - The member's doc, byte-copied: "Its one product caller is the candidate session's first-look terminal (`candidateArmSession.ts`'s untiled sink, through `CandidateArmSessionDeps.canvas`), which plans this box. Optional in the type only, as `currentView?` is; the component always provides it." It rests on the only non-test reference to the member outside its own file, candidateArmSession.ts:1500 (caller grep: WorkingCanvas.tsx:156 and 1636, and candidateArmSession.ts:78, a comment, and 1500).
  - The top doc paragraph, byte-copied (line 78 onward): "the untiled sink (`issueUntiledQuery`, below) plans the box the canvas then shows (`shownViewportBbox`) by calling `handleViewportChange` itself, not through the debounce. It plans nothing there for the terminal of a look the session no longer holds (`wasCurrent`; …), after a self-cancel (an operator Cancel with a frame, or `stop()`'s teardown cancel), while a relinquish stands, once the session is stopped or ended, while a viewport change is pending (that change plans instead), or with no frame or no shown box." It rests on the guard at 1490-1499 and the inner test at 1501.
  - The block's comment, byte-copied: "the complement of S1's block above. Terms (i) to (iii) are S1's guard and (iv) and (v) negate its last term, so at most one of the two blocks acts on a terminal" and "Not covered (AUTONOMY §31), the same window as S1's: an earlier look's Completed terminal that arrives after a reissue but before the new look's ticket is minted is read as current". It rests on S1's guard at 1468; `reissueUnrestricted` does not clear `untiledStreamHandle`, which only line 1317 (set at the mint) and line 1354 (cleared at the terminal) do.

**Ceilings.** `git diff --numstat 349cec82…HEAD` gives 38 added and 8 deleted for candidateArmSession.ts (46 against a ceiling of 60), and 14 added and 0 deleted for WorkingCanvas.tsx (14 against 25).

**§11 items 1 to 9:**
1. No string the app shows is added: the only new text is a session-log line.
2. Only the two product files change, and S1's block is untouched (the diff only adds lines after line 1481).
3. The first look's query, its limit and when it is issued are untouched.
4. The block calls `handleViewportChange`; the only `manager.onCameraChange` call is still 1548, inside it.
5. `fitToExtent`, `lastQueriedRef` and `onViewShown` are untouched.
6. Terms (i) to (viii), plus the null-box and no-frame test, rule out every case the item names.
7. The block comes after S1's (1482 against 1468).
8. The new member has a product caller, candidateArmSession.ts:1500.
9. No test file or fake was edited.

**Step 4 runs at C.**
- The two files: rc=0, "Test Files  2 passed (2)" and "Tests  112 passed (112)". The default reporter prints no passing lines, so I re-ran with `--reporter=verbose` (<S>/fls5-vitest-head-verbose.log, rc=0, same summary). Each U-FL line, byte-copied:
  - "✓ src/residency/candidateArmSession.test.ts > the first look plans its shown view at its Completed terminal (open-first-look-fills-fit-view) > U-FL1: a first look that ends Completed with no plan plans the box the canvas shows, synchronously in its terminal, with no onViewportChanged and no timer advanced 10ms"
  - The ten U-FL2 cases all show ✓ in the same form: (a) twice, (b), (c), (d), (e), (f), (g), and (h) twice. They are at lines 3504-3513 of the verbose log.
  - "✓ … > U-FL3: when every covering stream of that plan completes, the status settles complete-in-view and residencyStatusText renders that sentence 7ms"
  - "✓ … > U-FL5: after a settled plan, reissueUnrestricted(null, f) -- Apply's, Clear's and the Colour-by refill's seam -- ends Completed and one plan of the shown box runs under f 8ms"
  - "✓ … > U-FL6: across that terminal the scan events hold no reset until the last covering tile ends, then exactly one 7ms"
  - "✓ src/canvas/WorkingCanvas.wiring.test.tsx > U-FL4: the view the canvas shows (open-first-look-fills-fit-view, the form's §2.1 and §4) > U-FL4: shownViewportBbox is null before any camera write, the box onViewShown received after the one-shot fit, and the box onViewportChanged received after an interactive tick 10ms"
- The typecheck: rc=0.
- The whole shell suite: rc=0, "Test Files  120 passed (120)" and "Tests  1542 passed (1542)", in 70.29 s, so no hold was needed.

**Step 5 mutations at C (e4c1dfba).** Each was applied by one anchored `node -e` that refuses unless its anchor occurs exactly once. After each, `git checkout --` left the diff empty and the file's sha256 equal to C's: candidateArmSession.ts 2d4007d8213bd6050ef258867e264e3ba0d5f17350ca92296e9da5b30904ee74, WorkingCanvas.tsx 3f45fb7b35523c5a7121e1c8b2c5b0ee446d6c497a5a930ff9fcb2cf917c3c43.
- **M-U1** (lines 1482-1506 deleted): rc=1, "Tests  4 failed | 91 passed (95)".
  - × U-FL1: "AssertionError: one plan, in the terminal: expected "vi.fn()" to be called 1 times, but got 0 times"
  - × U-FL5: "AssertionError: one plan: expected "vi.fn()" to be called 1 times, but got 0 times"
  - Also failing: × U-FL3 ("…started both covering streams: expected [ 'sh_1' ] to deeply equal [ 'sh_1', 'sh_t1', 'sh_t2' ]") and × U-FL6 ("no reset at the first look's terminal…").
- **M-U2** (`!relinquishClearPending && // (vii)` replaced by a comment): rc=1, 1 failed. × "U-FL2 (a): no plan at the terminal when relinquishFill() ran after the look was issued and before its ticket was minted", with "AssertionError: no plan reached the canvas: expected "vi.fn()" to not be called at all, but actually been called 1 times" at test line 3921. That is (a), as §4 says.
- **M-U2g** (term (iv) replaced by a comment): rc=1, 1 failed. × U-FL2 (g), with "AssertionError: no plan reached the canvas: …" at test line 3983. **Finding:** (g) fails at its no-plan assertion, so the "one status emit, S1's" assertion at line 3984 is never reached. The two status emits §4 names were not observed.
- **M-U3** (`handleViewportChange(box)` replaced by `manager.onCameraChange(box, currentFilter)`): rc=1, 3 failed. U-FL3 fails with "AssertionError: expected { kind: 'query-issued' } to deeply equal { …(3) }" at line 4024: no settled status, as §4 says. U-FL1 (3888) and U-FL5 (4055) also fail.
- **M-U4** (`originX: 0, originY: 0` in `shownViewportBbox`): rc=1, 1 failed. U-FL4 fails with "AssertionError: after the fit: expected { xmin: -59.58972922953156, …(3) } to deeply equal { xmin: 2599981.036343164, …(3) }" at wiring test line 447. That is at the fit, as §4 says.
- **M-U5** (`pendingViewportChange = true; debounced.call(box);`): rc=1, 3 failed. U-FL6 fails with "AssertionError: no reset at the first look's terminal: expected "vi.fn()" to not be called at all, but actually been called 1 times" at line 4072, as §4 says. U-FL1 and U-FL3 also fail.
- Every mutation was applied as S3's plan describes; M-U1 also removes the block's comment. Under M-U1, M-U3 and M-U5, tests beyond the one §4 names also fail. Each row's own failure appears in every case.

**Not named in the brief:**
- Before committing C, I ran the typecheck once (<S>/fls5-precommit-typecheck.log, rc=0) and the two test files once (<S>/fls5-precommit-vitest.log, rc=0, 112 passed).
- I re-ran the two files at C with the verbose reporter, as above.
- I wrapped the whole-suite run in `timeout 200`.
- I wrote the form, S3's report and the two test files at U into <S>, under fls5- names, to read them.
- The typecheck's pretypecheck step writes ignored build output.

**Off-scope, not done:** the top doc's earlier sentence at lines 62-66 says the frame is set up at the first batch's fit anchor, but the code sets it up at the first look's terminal. It is outside §8's paragraph, so I left it.

**State:** HEAD and the remote are both e4c1dfba36cca15dbfa5dd6105cd2c4028f27221, the porcelain is empty, and no process I started is still running. No context handoff was given or received. Self-check: the session calls the canvas member exactly as `WorkingCanvasHandle` declares it, and U-FL4 runs on the real `WorkingCanvasHandle`. Every claim above points to a log in <S>. No user-facing message was added. Each failing mutation stops at a named assertion.

**Model:** Opus 5.5 (claude-opus-5-5), no override.
