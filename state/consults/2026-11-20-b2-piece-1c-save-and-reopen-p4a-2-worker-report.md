*Filed by the custodian: P4a-2's worker-high, its second, after it resumed, hand-back (claude-opus-5-5), 13277 bytes, sha256 8417f892edff99edc13c39d660cd0df7a6adf7362f40ba49ca95fb08b64e042f, below the rule, byte for byte but for 2 of the project name as <m> and one cite de-rooted to the file name, because it names a line of the branch and verify-cites reads a rooted cite on main, with one final newline added. Calls Bash 159, Edit 26, Write 13, Read 12, SubagentHandback 1, 9 errored, from 2026-11-20T07:52:56Z to 2026-11-20T08:32:55Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-2, worker-high

Everything is done and pushed. All three commits, tests first, went up together in one `git push`. Product lines are within their ceiling. Shell tests are over theirs: 825 against 690 (class 8). One test correction was found once the code ran, and it is committed after the product commit. I hit no stop, and no Guardian or harness call was refused. Two tool-side failures, neither a refusal: one bash heredoc failed to parse and ran nothing (the tree was checked clean), and one typecheck failed on my own code, which I fixed before any commit.

**Step 0's answers (they stand)**
1. The new App test is `App.reopen.test.tsx`, beside `App.tsx`.
2. The guidance is withheld for `engine.crs_assertion_conflict` alone.
3. (a) Yes, `ProjectUri`'s length is fixed by the reader's grammar. (b) No, the copy's `project_file_unwritable` text names no path.
4. Yes, `readStyleDocument` can answer null, and that case is now W-STYLE.

**Commits (branch cut/b2-piece-1c-p4a)**
- `a86af94b72dfea51679a74f22ed9ecf1edf478ad` test: P4a-2 tests first (T-2 to T-5, T-7, T-8, T-9's two cases, T-10 to T-14, T-16, T-18), failing at this commit
- `f38bb37ce249d4a98ef7a6bc48ed3d8328b3bc61` feat: the reopen's run, its refusal routing, the bound and App's reopen handler (P4a-2)
- `7cb3d90bbcfd5d5194d7ab435bc9933ff68bd0fd` test: T-9's bounded column expects W-TEXT for the style, found once the code ran (P4a-2)
- The push printed `e1f21e87..7cb3d90b  cut/b2-piece-1c-p4a -> cut/b2-piece-1c-p4a`. The pushed head is 7cb3d90bbcfd5d5194d7ab435bc9933ff68bd0fd, and `@{u}` equals HEAD.
- The seam cites in the feat message are `client.ts:165` (openProject), `kernel/src/project/mod.rs:894` (open_project_command) and `frontends/shell/src-tauri/src/commands.rs:216` (where `skp.open_project_panicked` is minted).
- Messages were written with the Write tool as `<S>/1cp4a2-msg-tests.txt`, `-msg-product.txt` and `-msg-testfix.txt`, and committed with `git commit -s -F`. Each ends with the two trailer lines and holds no typed sign-off.

**P-base** (at a86af94b, from before the compaction; log `<S>/1cp4a2-pbase.log`)
- Exit 1: Test Files 6 failed (6); Tests 4 failed | 41 passed (45).
- Three files failed to load because a module was missing:
  - App.reopen.test.tsx (`./project/shownText`);
  - openProject.test.ts (`./openProject`);
  - reopenNotices.test.ts (`./shownText`).
- Four assertions failed: T-11's block side, T-11's Console case, the actionRegistry pinned list, and T-16 (`expected [ Array(1) ] to strictly equal [ …(2) ]`).
- **Departure:** reopenNotices.test.ts uses `await import("./shownText")`, and vite resolves a literal `import()` at transform time. So the whole file failed at the base, and the first brief's T-6 tests in it did not run there.
- No declared test passed at its base.

**P-head** (at 7cb3d90b, each run in a hold)
- `npm run typecheck`: exit 0 (log `<S>/1cp4a2-typecheck-head.log`).
- `npx vitest run src`: exit 0, Test Files 123 passed (123), Tests 1569 passed (1569) (log `<S>/1cp4a2-vitest-head.log`).
- How I got there:
  - The first typecheck failed with TS1161: the regexes in shownText.ts held literal U+2028/U+2029 characters. Every character there is now a `\u` escape. This was fixed before the product commit, so nothing broken was committed.
  - The first full vitest run failed in two ways. One was T-9's bounded column (corrected in 7cb3d90b). The other was 7 notice tests, because the worktree had no `dist-metafile.json`; the pretypecheck step had written a provisional NOTICE.txt.
  - **Departure:** to fix the notice tests I ran `npm run build` in a hold. It is not in the brief's step list. It changed no tracked file (porcelain empty afterwards).

**Mutations** (script `<S>/1cp4a2-mutations.mjs`, one hold; log `<S>/1cp4a2-mutations.log`)
Every mutation was applied alone at head 7cb3d90bbcfd5d5194d7ab435bc9933ff68bd0fd and its test file was run. Every run exited 1 and was reverted, with `git diff --quiet` rc=0 after each and at the end. Named failures:
- **T-2** (the handler calls admitProject/onReopened itself): T-2 red, first error "the control is busy: expected false to be true", which is earlier than the recorded "no Cancel". T-3, T-4, T-5, T-11, T-12 and T-18 also went red.
- **T-3** (answer null): T-3 red, `expected [ null, null ] to deeply equal [ null, 'same' ]`; T-4 also red.
- **T-4 (a)** (re-link with answer null): T-4 red.
- **T-4 (b)** (`relink: ""`): T-4 and T-2 red ("the first call").
- **T-5** (wasCancelled ignored): T-5 red ("no S8").
- **T-7** (the view written whatever its state): T-7 red ("no camera write…: length of 1 but got 2").
- **T-8** (the filter set in a setTimeout): T-8 red ("the first query: expected null"); T-13 also red.
- **T-9 W-STYLE**, run in three variants:
  - style kept and no place: red at the place (`expected [] to deeply equal [ Array(1) ]`);
  - style kept alone: red at the state ("the state is the default");
  - place dropped alone: red at the place.
  So it turns red at both the state and the place.
- **T-9, the bounded column:** red.
- **T-10** (no adopt): red, `expected [ 'C:/projects/parcels' ] to deeply equal [ null ]`.
- **T-11:**
  - form family: red ("no CRS form");
  - the block's two sides (withheld for every code): red ("another code keeps its guidance at a reopen");
  - the Console (no prop): red ("withheld on the reopen's row").
- **T-12:**
  - the helper returns its input: red ("no hidden character in the block");
  - the cut splits a pair: the reopenNotices bound test red ("the pair is not split").
- **T-13** (shownText on the clauses): red ("the first query runs the file's text").
- **T-14** (every fact maps to S16): red.
- **T-16** (O-9 entry removed): red.
- **T-18** (always OTHER): red.

**Counts** (§2.11's command; B=7f7eb6d60d18862278fe06f6488c762b831c63a8, H=7cb3d90b, excluding `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`; output `<S>/1cp4a2-numstat.txt`)

| Group | Lines | Ceiling | Files |
|---|---|---|---|
| Shell product | 773 | 820 | 17 |
| Shell tests | 825 | 690 | 10 |
| Strings file (`project/reopenNotices.ts`) | 122 | 90 | 1 |
| e2e | 0 | 485 | 0 |
| Every other group | 0 | 0 | 0 |

- Shell tests are over by 135 (class 8). Of the 825, this brief added 664 (the first brief had 161). Per ADV-2026-11-19-12 item 6, I cut nothing to fit.
- The strings file is over (class 8): it was 120 after the first brief, and W-STYLE adds 2.
- Product files (added deleted):
  - App.tsx 71 5
  - AdmissionPanel.tsx 129 14
  - RefusalBlock.tsx 11 2
  - admitDataset.ts 13 4
  - formatRefusal.ts 6 0
  - WorkingCanvas.tsx 18 2 (first brief)
  - ConsolePanel.tsx 1 1
  - surfaceRegistry.ts 7 6
  - StudioLayout.tsx 6 0
  - actionRegistry.ts 6 2
  - openProject.ts 145 0
  - reopenNotices.ts 122 0
  - saveProject.ts 9 1
  - shownText.ts 46 0
  - skp/client.ts 17 0, skp/types.ts 76 0, style/document.ts 53 0 (all three first brief)
- Test files (added deleted):
  - App.reopen.test.tsx 446 0
  - RefusalBlock.test.tsx 38 0
  - WorkingCanvas.wiring.test.tsx 29 0 (first brief)
  - surfaceCompleteness.test.ts 4 4 (first brief)
  - actionRegistry.test.ts 1 0
  - openProject.test.ts 149 0
  - reopenNotices.test.ts 59 0
  - saveProject.test.ts 12 1
  - client.test.ts 32 0, document.test.ts 50 0 (first brief)
- Lock-file check: `git diff --quiet B...H -- frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json frontends/shell/package.json` gave rc=0.

**The words script's check**
- `node <S>/1cp4a2-words.mjs apply`, rc=0. Each id was "written 1, read back equal": O-19a idle, O-19a opening, O-19b label, O-19b word, O-9, W-STYLE, and O-18 (replaced).
- At the head, `check` mode rc=0, and `<S>/1cp4a2-words-at-head.mjs` rc=0. Each fence literal is found once in its file, and the old O-18 literal 0 times.
- `grep @@` finds no token left.

**Exports added, with their product callers** (git grep at HEAD, comments and tests excluded)
- `admitProject`: AdmissionPanel.tsx:353 `admit: (path, cancelKey, options) => admitProject(path, cancelKey, options, heldProject()),`
- `reopenApply`: App.tsx:1220 `const applied = reopenApply(reopened, projectionFor(next.describe) ?? []);`
- `reopenRefusalPlace`: openProject.ts:76 (inside `admitProject`).
- `lineagePlaces`: openProject.ts:136 (inside `reopenApply`).
  - These last two are exported for their tests; their product callers are in their own module.
- `Reopened` (type): App.tsx:1216; AdmissionPanel.tsx:195 and :306; admitDataset.ts:24.
- `shownText`: openProject.ts:68, :137 and :142; shownText.ts:45.
- `holdsHiddenText`: openProject.ts:120 to :122.
- `shownRefusal`: openProject.ts:74.
- `STYLE_NOT_APPLIED_NOTICE`: openProject.ts:141.
- `THROUGH_LINK_NOTICE`: saveProject.ts:118.
- `ProjectSaver.adopt`: App.tsx:1235 `projectSaver.adopt(next.dataset);`
- `AdmissionPanelHandle.requestProjectPick`: App.tsx:2182.
- `onOpenProject`: App.tsx:2182 → StudioLayout.tsx:217 and :264.
- Every first-brief export of reopenNotices.ts now has a caller in openProject.ts or AdmissionPanel.tsx (each grep printed). Stop 12 holds.

**Doc texts I wrote, by symbol, and what in the form each states**
- `openProject.ts`, module doc: item 5 (b), (g), (j), (k), (l).
- `admitProject`: (b), and (e)'s late `opened`, named but not covered (packet P-13); a non-typed failure is rethrown.
- `reopenRefusalPlace`: ADV-2026-11-20-05 item 4.
- `lineagePlaces`: Amendment 55 item 1.
- `hiddenTextMembers`: (k).
- `reopenApply`: (h) O-16/O-17/O-18/V3, Amendment 57 item 1, and the place order.
- `shownText.ts`, module doc and functions: (j), including "The figure 1,024 rests on nothing measured" (ADV-2026-11-20-04 item 2).
- `AdmissionOutcome` and `AdmitOptions.reopen`: (b).
- `runAdmitPath`'s reopen paragraph: (b) to (e), (g).
- The `question`/`not_found` states: O-14.
- `onReopened` and `wasCancelled`: O-15, (e).
- `heldProject` and `requestProjectPick`: (f), O-19b.
- The `RefusalBlock` paragraph: (g), Amendment 56 item 4.
- The `formatRefusal` exception: (j)'s last point, in my words.
- `THROUGH_LINK_NOTICE`: O-9. `adopt`: O-11/(i).
- `actionRegistry` and `onOpenProject`: (m).
- App's `handleReopened`, `heldProjectRef`, `reopenNotices`, `reopenViewRef` and the effect comment: O-15, (f), (h), (i), O-17.
- `reopenNotices.ts`: the module doc now names the routing's home and the callers (lines 10-15 were untrue), and the `STYLE_NOT_APPLIED_NOTICE` doc states Amendment 57 item 1.

**Each hold's lines** (all exited as stated)
Every hold printed this pair, with its own shell PID:
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`

| Run | Shell PID | Exit |
|---|---|---|
| P-base | 43288 | 1 |
| typecheck 1 | 79576 | 2 |
| typecheck 2 | 72804 | 0 |
| vitest 1 | 69760 | 1 |
| build | 18808 | 0 |
| typecheck at head | 28272 | 0 |
| vitest at head | 42640 | 0 |
| mutations | 53948 | 0 |

No exit code was in 96 to 99.

**The three ruled files and the surfaceRegistry fixes**
- `formatRefusal.ts`: the doc exception alone (6 lines).
- `RefusalBlock.tsx`:
  - the two optional props, `reopen` and `owner`; the owner shows as `<p class="admission-refusal-owner">` after the fields;
  - plus a doc paragraph and a module-private `ASSERTION_GUIDANCE_CODES` set holding only `engine.crs_assertion_conflict`, which the `reopen` prop reads. The gates should judge whether that constant is within "the props it names"; it can be inlined.
- `ConsolePanel.tsx`: the single prop `reopen={vm.commandLabel === "open_project"}`.
- `surfaceRegistry.ts`:
  - line 11 is now ` * NEXT-CUT.md's three-class table:`. A byte check against `git show f5442f71…:frontends/shell/src/console/surfaceRegistry.ts` line 11 returned True;
  - line 12 now says "one of the eight SKP commands". There are eight class-A rows, lines 82-89.

**Not done, departures and stops**
- No stop was hit.
- Class 8 overruns: shell tests 825/690 and strings 122/90.
- Departures: the extra `npm run build`, the P-base T-6 file not loading, and the test correction in 7cb3d90b.
- **For the gates to rule:** for O-16, when the file has clauses, the filter applied is `combineClauses(clauses)` through `filter.clauses.set`, since the reducer derives the filter from them. With no clauses, the saved filter goes through `filter.apply`, which mints one clause. A file whose filter and clauses disagree is therefore applied by its clauses.
- `cancelledKeys` keeps every key Cancel was pressed for and is never cleared.
- No background process of mine is running. The holds all ended, and a command-line process check found only that check's own shells; nothing was killed.

**Pre-gate self-check**
1. Every quote is byte-copied, and every text is script-written and checked.
2. Scope: only my files and the three ruled ones changed (porcelain and numstat checked).
3. Every claim here has a call behind it.
4. Counts and ceilings are reported, with the overruns named.

Model: Opus 5.5 (claude-opus-5-5). Context handoffs: the summary this session resumed from records two compactions, and work continued from the latest.
