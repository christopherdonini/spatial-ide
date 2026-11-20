*Filed by the custodian: P4a-1's worker, its second, after it resumed, hand-back (claude-sonnet-5-5), 10815 bytes, sha256 3cb3a9f0b471ef6c88f32b307a6b4d292f85d5b9e065e7187b6ee85570568c3e, below the rule, byte for byte but for 1 of the scratch-folder path as <S> and 1 of the project name as <m>, with one final newline added. Calls Bash 53, Write 10, Read 4, SubagentHandback 1, 0 errored, from 2026-11-20T06:52:57Z to 2026-11-20T07:03:58Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-1, worker. Everything in the brief is done except O-9 and T-16, which are held back on stop 3 (below). Nothing is running that I started.

**Step 0 answers (as I gave them; the workspace apply's tests left open, per your note):**
1. Test files, each beside its product file, all existing files (no existing test's lines changed except T-15's declared edit).
   - Style reader: `frontends/shell/src/style/document.test.ts`.
   - Camera write: I said `WorkingCanvas.test.ts`. I used `canvas/WorkingCanvas.wiring.test.tsx` instead, because it already tests `currentView` and `shownViewportBbox` through a real mount, which a bit-for-bit check needs.
   - Workspace apply's tests: left open for the second brief. `workspace/viewTransitions.ts` is read only.
   - Others: T-1 in `skp/client.test.ts`, T-6 in the new `project/reopenNotices.test.ts`, T-15 in `console/surfaceCompleteness.test.ts`.
2. Lineage: a later save is refused as `skp.project_lineage_not_kept_by_this_version` for every reopen whose project file records a lineage, no history file included.
   - The cause is `kernel/src/project/mod.rs:344` (`f.lineage != Lineage::NotKept` returns `SaveFailure::LineageNotKept`). It does not depend on any history file.
   - `read_lineage` (`session_history.rs:1731`): a project file that keeps no lineage gives folder `Absent` or `NotRead` with previous `None`.
   - So "records a lineage" is NOT (folder in {`absent`, `not-read`} AND `previous_file` null).
   - Differs from P-7 in two cases, so stop 8: `previous_file: used`, and folder `absent` with `previous_file: absent` (not null). Both imply a recorded lineage and a refused save. P-7 gives them no place.
   - The advisor gets this from you. I mapped no lineage fact to any place.
3. Hooks: `openPath`, `queryWithFilter`, `e2eSaveProjectToFolder`, `e2eSetViewState(x, y, zoom)` (identity-mode only), `crsCatalog`, `capturePixels`, `residentCounts` and the residency/publish hooks exist. None reads or sets clauses, style or `currentView`, which `e2e/project.mjs:227-237` does by DOM clicks. E-REOPEN needs no hook beyond item 7 (a)'s three. I wrote none.
4. Only `console/surfaceCompleteness.test.ts` pins the class-A set (T-15's declared edit). `surfaceRegistry.test.ts` and `soleCaptureSite.test.ts` do not.

**Stops and departures:**
- **Stop 3, O-9 and T-16 not done.** The existing test at `project/saveProject.test.ts:117-120` expects `[SAVED_NOTICE]` alone for `through-link`. Showing O-9 turns it red, and an edit of that line is barred. This needs a ruling (the one-line fix is to drop `through-link` from that loop). I did not touch `saveProject.ts` or its test.
- **Stop 3 hit and avoided.** My first camera write was a fourth `cameraRef.current =` site, and the existing `WorkingCanvas.test.ts` RF10 pins three. I changed the product, not the test. `applyView` now passes the saved view to `fitToExtent` (new optional third parameter `saved`), unreported, as Amendment 54 item 5 (h) says. A side effect is that `onViewShown` receives the box it shows, as an auto-fit's does. I corrected my own T-17 to expect that one call (commit `e1f21e87`).
- O-19a and O-19b are the second brief's, and I wrote them nowhere.
- `LineageRefusal.line` and `.limit` are typed `number`, because the Rust wire fields are plain `u64` serialized as JSON numbers.
- `readStyleDocument` returns `null` for a document outside the shell's own shape, which has no place in the words. The second brief decides how to show that.
- The brief says the strings file counts at most 90. It is 120 lines, mostly doc comments. That is class 8 and I changed nothing to fit.

**Commits (pushed with `git push -u origin cut/b2-piece-1c-p4a`; head `e1f21e87ea459b12a23b3a47e20dff91f9f30cb2`):**
- `8d3bb394393d3cfc064208da2c85240cea9c6e2a` test: P4a-1 tests first (T-1, T-6, T-9, T-15, T-17), failing at this commit
- `24833eeb` feat: P4a-1 types, openProject, eighth class-A row, style reader, camera member, notices' places
- `e1f21e87ea459b12a23b3a47e20dff91f9f30cb2` feat: P4a-1 camera member goes through fitToExtent, as Amendment 54 item 5 (h) says

The seam was written against `protocol/skp/src/v0/commands.rs` (`OpenProjectRequest`, `OpenProjectResponse`, `OpenedProject`, `ReopenView`, `ReopenCheck`, `ReopenLineage`, `LineageRefusal`), `SKP-V0.md` §12.2, and `kernel/src/project/mod.rs` `opened_of`. The end-to-end seam test (E-REOPEN) is the third brief's. Nothing here has a product caller yet; the second brief supplies them (stop 12, below).

**P-base and P-head:**
- **P-base** (vitest on the 5 test files, at `8d3bb394`): exit 1, 4 tests failed and 2 files failed to load.
  - `openProject is not a function`: T-1, both tests.
  - `ref.current.applyView is not a function`: T-17.
  - The T-15 assertion: the derived set has 7 commands, 8 expected.
  - The two other files fail on the missing import `./reopenNotices` (T-6 and T-9).
- **P-head** (`e1f21e87`): `npm run typecheck` rc 0. `npx vitest run src/skp src/console src/style src/canvas src/project` gave 42 files and 569 tests, all passed, rc 0. The first product commit failed only the existing RF10 test, which is the fix above.

**Mutations** (applied, run, reverted; head `e1f21e87`):

| Id | Change | Test that failed | After revert |
|---|---|---|---|
| T-1 | `openProject` calls `invoke` directly | `openProject sends the eighth command through the one capture site` | `git diff --quiet` rc 0 |
| T-6 | observed and admission joined into one list | `the changed-file notice names each component` | rc 0 |
| T-9 | the reader drops the match's cases | `the style document reads back; a Colour by whose column is gone keeps the rest and says so` | rc 0 |
| T-15 | the `open_project` row removed | `the registry's class-A command set equals exactly skp/client.ts's derived command set` | rc 0 |
| T-17 | the saved view's target is the centre, origin not subtracted | `the camera write applies the saved view through the frame origin and marks the fit done` | rc 0 |

T-16 has no test (see stop 3).

**Counts** (§2.11's command, B = `7f7eb6d60d18862278fe06f6488c762b831c63a8`, form path excluded):

| File | Added / deleted |
|---|---|
| `canvas/WorkingCanvas.tsx` | 18 / 2 |
| `console/surfaceRegistry.ts` | 7 / 6 |
| `project/reopenNotices.ts` | 120 / 0 |
| `skp/client.ts` | 17 / 0 |
| `skp/types.ts` | 76 / 0 |
| `style/document.ts` | 53 / 0 |

- **Shell product:** 291 added, 8 deleted, 299 in all, against my share of about 255. Whole-P4a ceiling is 820, so I am inside it.
- **Shell tests:** 157 added, 4 deleted, 161 in all, against my share of about 200. Whole-P4a ceiling is 690, so I am inside it.
- **Strings file:** 120 lines, over its 90 cap by 30. This is class 8; I changed nothing to fit.
- **Other groups:** 0, as the ceilings require.
- **Lock files:** `git diff --quiet B...HEAD -- frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json frontends/shell/package.json` gave rc 0.

**Words script check:** `1cp4a1-words.mjs` read the filed ruling's one four-backtick fence (30 lines), split each line at its first ` | `, and wrote `project/reopenNotices.ts` from a template with each text as `JSON.stringify` gives it. It then read the file back. Output is in `<S>/1cp4a1-words.out`.
- **OK, 25 places:** S8 (question, 3 choices), S9-own, S9-other, S10, S12, the file's part, the admission's part, S11, S11-none, S11's choice, S16, S17, S17's refused line, S19, S20, S21, R-ENG, R-CODE, R-CODE's locator form, S-PANIC, W-TEXT, O-18.
- **Not placed:** O-19a (idle, opening), O-19b (label, word), O-9.

**Exports and their callers** (all come in the second brief; none exists at this head, stop 12 is judged at P4a's head):
- `skp/types.ts`: the §12.2 types, by `openProject` and the reopen's handling.
- `skp/client.ts`: `openProject`, called by the reopen's `admit` in `AdmissionPanel.tsx`.
- `style/document.ts`: `readStyleDocument` and `ReadStyle`, called by App's workspace apply.
- `canvas/WorkingCanvas.tsx`: `WorkingCanvasHandle.applyView`, called by App's workspace apply.
- `project/reopenNotices.ts`, called by `project/openProject.ts`, `AdmissionPanel.tsx` and `App.tsx`:
  - `QUESTION_TEXT`, `QUESTION_COPY`, `QUESTION_SAME`, `QUESTION_CANCEL`
  - `OPEN_ELSEWHERE_OWN_NOTICE`, `OPEN_ELSEWHERE_OTHER_NOTICE`
  - `CheckWords`, `changedFileNotice`, `relinkedFileNotice`
  - `fileNotFoundNotice`, `RELINK_CHOICE`
  - `LINEAGE_NOT_RECORDED_NOTICE`, `LINEAGE_NOT_KEPT_NOTICE`, `lineageFileRefusedNotice`
  - `viewNotAppliedNotice`
  - `KNOWN_FOLDERS_FULL_NOTICE`, `MACHINE_RECORD_REFUSED_NOTICE`
  - `ENGINE_REFUSAL_NOTICE`, `REOPEN_REFUSAL_NOTICE`, `REOPEN_LOCATOR_REFUSAL_NOTICE`, `OPEN_PANICKED_NOTICE`
  - `workspaceTextNotice`, `colourByNotRestoredNotice`
- No lineage fact is mapped to S16 or S17 anywhere.

**Doc texts I wrote:**
- `reopenNotices.ts` header: the words are the advisor's, copied by script; builders take slot values as given and apply no bound (the bound is the caller's); routing is the caller's; no lineage fact is mapped; no caller yet.
- `readStyleDocument`: the inverse of `toStyleDocument`; a Colour by whose column is gone falls back to the default literal and is named; `null` outside the shell's shape; no re-normalising.
- `applyView`: writes through the frame origin (ADR-010 rule 1); marks the fit done; reports no viewport.
- `fitToExtent`'s `saved`: a saved view is the fit state, so `bbox` is not read.
- `surfaceRegistry.ts` doc: eight commands, `open_project` the eighth.
- `skp/client.ts` `openProject`: keys never omitted; no state between its calls.

**Hold lines:** four holds, each `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m>`, each released by `MACHINE_RELEASED`. No MACHINE_WAITING or MACHINE_ERROR lines, and no exit code 96 to 99. The `npm ci` and mutation-run holds were also granted; their logs hold the same shape.

**Self-check:**
- Cross-module code uses the interface the other side exposes: yes, read at the cited files.
- Completion claims point to evidence: yes.
- User-facing messages describe implemented behaviour: they are placeholders with no caller yet.
- Required tests reach their assertions: T-1, T-6, T-9, T-15 and T-17 each fail by name under their mutation. T-16 is not written.
- Model: Sonnet 5.5 (`claude-sonnet-5-5`), no override. Handoff: this was a resume after stop 8 and your release, with no other handoff.

**State:** `git status --porcelain` is empty. Branch `cut/b2-piece-1c-p4a` is at `e1f21e87ea459b12a23b3a47e20dff91f9f30cb2` and pushed. No PR opened, nothing fetched, and no files written outside `C:/dev/wt/1c-p4a`, `D:/wt-data/1c-p4a` and the scratchpad under `1cp4a1-` names.
