*Filed by the custodian: P4a-1's worker, its first hand-back (claude-sonnet-5-5), 6292 bytes, sha256 76f20ce176b71b90189ea0b5dce48413612591e8d36361b15eb7f1fd9cf83ddf, below the rule, byte for byte, with one final newline added. Calls Bash 17, Read 1, SubagentHandback 1, 0 errored, from 2026-11-20T06:49:09Z to 2026-11-20T06:50:54Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-1, worker. STOPPED at step 0 on stop 8, so I have written no test and no code, and made no commit, push or hold.

Worktree `C:/dev/wt/1c-p4a` is on `cut/b2-piece-1c-p4a` at 7f7eb6d60d18862278fe06f6488c762b831c63a8. Porcelain is empty. `npm ci` was not run, `D:/wt-data/1c-p4a` was not made, and nothing is running.

**Why I stopped.** My reading of the kernel differs from the architect's P-7 table (stop 8), in two cases. I read the stop as binding even though ADV-2026-11-20-05 item 4 anticipates the question, so the two P-7 differences below come to the advisor before any work resumes. Please send the advisor's answer, or release me to continue with the lineage places held back.

**Step 0, answer 2: the lineage facts.** From `kernel/src/session_history.rs`:
- `read_lineage` (line 1731) tells a project file that keeps no lineage from one that does, by whether `member` is `Lineage::Kept`.
- **Project file keeps no lineage.** The folder file is never read, and previous is `None`. The folder fact is `FolderLineage::Absent` if the file is missing, else `FolderLineage::NotRead`. On the wire that is `absent` or `not-read`, with `previous_file` null.
- **Project file records a lineage.** `previous_file` is `Some(...)` on every path except `Recorded` and `RecordedWithLinesAfter`:
  - `Absent` here means nothing is in the folder.
  - `Recorded` and `RecordedWithLinesAfter` mean the folder file starts with the recorded steps. The latter also has valid lines after them.
  - `NotTheRecordedOne` and `Refused` are the other folder outcomes.
  - `PreviousLineage::Absent`, `Used`, `NotTheRecordedOne` and `Refused` apply to the machine's previous file.
- `kernel/src/project/mod.rs:344` is the save's condition: a later save returns `SaveFailure::LineageNotKept` when the project file in the folder has `f.lineage != Lineage::NotKept`. `mod.rs:1252` maps it to `skp.project_lineage_not_kept_by_this_version`.
- **Answer.** Yes. A later save is refused for every reopen whose project file records a lineage, including when no history file is in the folder or on this machine. The refusal depends only on the project file's member, not on any history file. On the wire, "records a lineage" is: NOT (`folder_file` is `absent` or `not-read` AND `previous_file` is null).

**Two differences from P-7's table:**
1. `previous_file: used` means the project file records a lineage, so a save is refused. P-7 gives it no place.
2. `folder_file: absent` with `previous_file: absent` (not null) means the project file records a lineage and no history file exists anywhere. A save is refused. P-7 gives "absent" no place.

`recorded`, `recorded-with-lines-after`, `not-the-recorded-one` and every `refused` always imply a lineage record, so S17 is true for them. `not-read`, and `absent` with null previous, mean no lineage is recorded, so they get no S17. Rule: S17 shows exactly when the pair is not (`absent` or `not-read`, null). S16 stays for `not-the-recorded-one` of either file, which also takes S17. The advisor will want to confirm the table gains those two rows. I wired nothing.

**Step 0, answer 1: test files.** New tests go in existing files, and no existing test's lines change:
- Style reader: `frontends/shell/src/style/document.test.ts`, beside `style/document.ts`.
- Camera write: `frontends/shell/src/canvas/WorkingCanvas.test.ts`, beside `canvas/WorkingCanvas.tsx`. `WorkingCanvas.recentre.test.tsx` is an alternative if a DOM render is needed.
- Workspace apply: `frontends/shell/src/workspace/viewTransitions.test.ts`, beside `workspace/viewTransitions.ts`. Its apply is the second brief's (O-16). Say if you want it elsewhere.
- Notices: a new `project/reopenNotices.test.ts` (T-6, T-9's column) and `project/saveProject.test.ts` (T-16). T-1 goes in `skp/client.test.ts`. T-15 is the one declared edit in `console/surfaceCompleteness.test.ts`.

**Step 0, answer 3: the hooks.**
- `e2e-test-surface.ts` already has `openPath` (registered in `AdmissionPanel.tsx:326`), `queryWithFilter` (`App.tsx:1727`), `e2eSaveProjectToFolder` (`App.tsx:1401`) and `e2eSetViewState(x, y, zoom)`.
- `e2eSetViewState` moves the camera. Its doc says identity-mode only, and a measured cell never calls it.
- There is no hook for the clauses, the style, or reading `currentView` or the applied state. The clauses and fill colour are set by DOM clicks, as `e2e/project.mjs:227-237` does.
- E-REOPEN needs no hook beyond item 7 (a)'s three: the folder slot, the re-link slot and the applied-workspace read. I found no further one, and wrote none.
- Caveat: I did not read `e2e/filter-panel.mjs` for the camera move. E-REOPEN's R2 can use `e2eSetViewState` or a gesture. Its identity-mode-only note should be read first.

**Step 0, answer 4: existing tests and the eighth row.**
- `console/surfaceCompleteness.test.ts` pins the class-A set at lines 203-207. It has `expectedSeven = [...]`, the test name "exactly the seven named commands", and the registry-equals-derived assertion at lines 209-214.
- This is T-15's declared edit, so it is not stop 3. The `derived` set picks `open_project` up from `client.ts` automatically, so the test goes red until the set changes.
- Other grep hits are not count pins: line 273 (`toContain("record_step")`), `App.save.test.tsx`, and `surfaceRegistry.test.ts` (no seven/eight). `soleCaptureSite.test.ts` has no count pin. I found no other test turned red by the eighth row. This is a grep reading, not a run.

**Report items that do not apply, because no work was done:** commits, P-base and P-head, mutations, the counting command and lock-file check, the words script's check, exports and their callers, doc texts, and hold lines. I wrote no `<m>` values.

**Off-scope, not done:** the brief says to cite `read_lineage` and `LineageNotKept`, and I found `LineageNotKept` at `kernel/src/project/mod.rs`, not in `session_history.rs`.

**Model:** I observe myself running as Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff received or produced.

**Four-class self-check:**
- Cross-module interfaces: read, not written against.
- Completion claims: none.
- User-facing messages: none written.
- Required tests: none written.

**State:** `git status --porcelain` is empty, and nothing was pushed.
