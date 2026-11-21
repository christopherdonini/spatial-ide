*Filed by the custodian: the drafter of the reopen's P5 words (ADV-2026-11-16-10 R1 (b): the five-line form, the reviewer alone, its words to the advisor), the hand-back of the worker (claude-sonnet-5-5), read only in a worktree detached at 85adddaf, 45583 bytes, sha256 a1e6abf4f7d4e6dc9df4e7ba45005bae9e625b59ac7b34af98ebf07b859824ab, below the rule. Its calls in the transcript, by unique call ids: Read 1, Bash 107, SubagentHandback 1; none wrote a file. The custodian's script found each of its ten old blocks and nine quoted app strings byte-equal in the files at 85adddaf. Its drafts are not ruled: the packet goes to the advisor.*

---

Draft: the reopen's P5 words, at 85adddaf

Summary: 17 entries. 14 are owed (R2's words are not settled and wait on question Q1). 3 are not owed (R6, R11, R17). 6 questions are in the packet. I ran no node, cargo or npm command, wrote no file, and used `git grep`, `git show` and reads only, in the worktree at 85adddaf. No `verify-quotes` run was possible. Old blocks are copied from my reads, and the applier must re-copy each by script before use.

Rulings search. My search agrees with the custodian's list, with these corrections and additions. The S4-LOCK item is ADV-2026-11-20-05 item 5, not -04 item 5 (-04 item 5 only defers the words to a ruling of its own). Additions that carry something to the reopen's P5:
- ADV-2026-11-18-18 item 3, the same as ADV-2026-11-16-16 item 2 (a) (the new refusals' lines).
- ADV-2026-11-19-07 item 6 (item 62 does not name `open.lock`).
- ADV-2026-11-20-05 item 7 (S9-other does not name the holder).
- ADV-2026-11-20-04 item 6, ADV-2026-11-19-35 item 1 (c), ADV-2026-11-20-17 item 7 and ADV-2026-11-20-20 item 3 (c) (P5 waits for the redaction node only if its files hold a src-tauri path; none below does, and PR 343 has merged at this main).
- ADV-2026-11-18-02 item 2 (a) (P5's records are not worker-high work).
- The step-1 gate report state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-reviewer.md (its A1) and state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-architect-2.md (its N-A).

Set aside, with one line each:
- ADV-2026-11-18-03: "P5" is a pair label; it has nothing to do with the reopen (its item 51 is the attribute-bytes item).
- ADV-2026-11-20-28 and ADV-2026-11-21-03: P5 is a prediction class of the redaction node.
- Form Amendment 16 item 5 (step 1's old fifth piece): the console recorder does record the picker; see `pickProjectFolder` in `frontends/shell/src/skp/dialog.ts`.

Form notes. Amendment 54 item 18 names exactly what the brief lists. Amendment 63 item 5 carries the export holder. The code Amendment 69 leaves is E-SECOND on main. Part AD exists in `frontends/shell/MANUAL-WALKTHROUGH.md` with AD0 (§9 P0) and AD1 (§9 OP1); the Part's result log is blank. K-2 and K-3 are not in `KNOWN-LIMITATIONS.md`. K-4 is item 62.

New items below take 69 and on, the next free numbers at 85adddaf (item 68 is last; 63 is withdrawn). The applier re-takes the numbers at P5's base. Each new item carries an HTML comment in the shape of item 68's: "The advisor's wording under the human's delegation of 2026-11-13 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md, items 2 and 3), not the human's words, ruled in <id>; the number is the next after item 68. Where the code does each clause, by symbol: <the symbols in the entry's (f)>." The comment text is the applier's, built by script.

---

R1. K-2 (§2.12)
(a) Source: form §2.12 K-2; Amendment 16 item 2 (K-2 is step 2's); Amendment 54 item 18.
(b) Owed: yes. It is not in `KNOWN-LIMITATIONS.md`. As §2.12 words it ("containment is checked when the project opens its data, on every platform"), it is wrong in one respect: the check is made only for a project-relative locator. The machine-recorded location is opened with no check of the names on the way.
(c) Where: `KNOWN-LIMITATIONS.md`, new item 69, after item 68.
(d) Old: none.
(e) New (drafter's draft for the advisor's ruling):
````
69. **When a project's data lies inside its folder, the check that no name on the way to it is a link is made once, before the data is opened.**
    A project saved with its data inside its folder records that file by its path from the folder. When you open the project, the app walks that path one name at a time from the folder before it opens the data, and refuses the open if a name on it is a link (on Windows a junction counts as one), is missing, or is not a folder or a file where it should be. The folder itself is resolved first, so a link at or above the folder is followed. A link, a rename or a replacement that another program makes after the check is not prevented, at the open or at any later read. A change the change detector or the advisory watch sees ends the session (items 19 and 23 to 28), and a change they do not see is not detected. A project whose data lies outside its folder is opened at the path this machine recorded for it, with no check of the names on the way.
````
(f) True at this main: `resolver::check_inside` and `CheckRefused` (kernel/src/project/resolver.rs: `canonicalize` of the folder, then `symlink_metadata` per segment; `is_symlink` covers Windows name-surrogate points). `data_at` in kernel/src/project/mod.rs takes a `Locator::ProjectRelative` first, else the `locations.json` path, tested with `std::fs::metadata`. `check_inside`'s doc states that the check claims nothing about what the engine later reads. Items 19 and 23 to 28 exist in `KNOWN-LIMITATIONS.md`.

R2. K-3 (§2.12)
(a) Source: form §2.12 K-3; H5 (§2.x, "H5"); Amendment 1 item 3 (H5 is not observed).
(b) Owed: yes, but the words cannot be settled by reading. H5 ("a Cancel ends the open at the engine's next check, after the blocking read returns") has never been observed: the probe saw only that an open and a read complete. OP3 is built to observe it. This is Q1.
(c) Where: `KNOWN-LIMITATIONS.md`, new item 75 (kept last so no other number moves).
(d) Old: none.
(e) New, option B, the drafter's recommendation (option A is in Q1):
````
75. **Whether a Cancel stops an open before an online-only file has finished downloading has not been observed.**
    A Cancel of an open is looked at between the steps of the open, and it reaches the engine's own queries during the open. While the operating system is still downloading an online-only file, such as one in a OneDrive folder, whether a Cancel stops the open before the download ends has not been seen in the running app. A Cancel that arrives after the data has been opened is not seen, and the project opens.
````
(f) `Projects::open_project` calls `live()` after the file read, after the place is decided, after the lineage and before the host's open. `Projects::open_project` takes `host.open_under(req, &cancel)`, and an error with the token cancelled gives `OpenFailure::Cancelled`. A cancel after `open_under` returns is not seen (its doc). `cancellable` and the identity scan in engine/src/dataset.rs attach the token's interrupt to DuckDB queries. SKP-V0.md §12.3 ("Cancellable") says the same for the call.

R3. K-4 and item 62 (Amendment 16 item 2; ADV-2026-11-19-07 item 6; ADV-2026-11-19-21 item 2; ADV-2026-11-20-05 item 5; Amendment 43 item 9 (a))
(a) Source: as the heading, with form §2.12 K-4. Amendment 38 item 13 and Amendment 43 item 9 (a) carry the same note.
(b) Owed: yes. Item 62 is K-4 as step 1 wrote it, and it is stale in these ways at this main:
- A reopen also makes the identity's folder (on a machine with none for it, and for a copy answer).
- It does not name `open.lock`.
- It does not say that `folders.json` is written at a first reopen on a machine, a move or an answer.
- It does not say that `locations.json` is written at a re-link or a copy.
- It does not say that a refused reopen after the lock leaves what it wrote.
- It does not cover the copy whose replace fails (Amendment 43 item 9 (a)).
- It does not name the temp files a crash can leave (`write_machine_file`'s doc).
- It does not say that opening the saved project keeps its identity.
- The `open.lock:` detail of a refused first save (S4-LOCK) is the kernel's message and has no place of its own (ADV-2026-11-20-05 item 5), so item 62 explains it.
The item's comment cites lines "on the piece's unmerged branch" at an old commit; that branch merged, so the applier replaces those cites with symbols (no line numbers).
(c) Where: `KNOWN-LIMITATIONS.md`, item 62: the title line, the paragraph and the comment.
(d) Old, byte-copied from `KNOWN-LIMITATIONS.md` (title line, then paragraph line):
````
62. **Each project the app saves leaves a folder in this machine's store, and nothing removes it.**
    The first save of an open dataset makes a new project identity and a folder for it in the machine store, `<data dir>/spatial-ide/projects/<32 hex>/`, where `<32 hex>` is the identity's 32 lowercase hex characters and `<data dir>` is the per-user data directory (on Windows, the folder the `LOCALAPPDATA` variable names). Every save of that open writes `locations.json` there, which holds the path at which this machine found the dataset. The first save also writes `folders.json`, which holds the folder the project was first saved to, as an absolute path, and an empty list of other folders. Both files are written before `project.spatial` is replaced. A first save that fails after the store folder is made leaves that folder and any file it wrote there, and the next save of that open is a first save again, which makes another identity and another folder. A later save that fails at the replace leaves the `locations.json` it wrote. A dataset that is opened again and saved again also makes a new identity and a new folder at its first save. The app removes none of these folders or files.
````
(e) New (drafter's draft):
````
62. **Each project the app saves or opens leaves a folder in this machine's store, and nothing removes it.**
    The first save of an open dataset makes a new project identity and a folder for it in the machine store, `<data dir>/spatial-ide/projects/<32 hex>/`, where `<32 hex>` is the identity's 32 lowercase hex characters and `<data dir>` is the per-user data directory (on Windows, the folder the `LOCALAPPDATA` variable names). Opening a saved project makes that folder too, on a machine that has none for it, and makes a new identity and a new folder when you answer that the folder is a copy. The folder can hold three files. `open.lock` is made by the first save and by every open of the project that takes its lock; nothing is written to it. `locations.json` holds the path at which this machine found the dataset: every save of the project writes it, and so does an open that follows a re-link or a copy answer. `folders.json` holds the folder the project was first saved to, as an absolute path, and a list of other folders. The first save writes it with an empty list, and so does the first open of a project on a machine that has no folder for it, with the folder opened as the first folder. An open from another folder, when the first folder is gone or no longer holds this project's file, replaces the first folder with the folder opened and says nothing about it; the answer that a folder is the same project adds it to the list. A first save writes `locations.json` and `folders.json` before `project.spatial` is replaced, and an open that answers a copy writes `folders.json` before it replaces the copy's `project.spatial`. A first save or an open that fails after the store folder is made leaves that folder and any file it wrote there. After a failed first save the next save of that open is a first save again, which makes another identity and another folder. A later save that fails at the replace leaves the `locations.json` it wrote. A copy whose `project.spatial` cannot be replaced is refused and leaves its new identity's folder with `folders.json` and `open.lock`. A dataset that is opened again with Open GeoParquet and saved again makes a new identity and a new folder at its first save; opening the saved project again keeps its identity. A process that ends while it writes `locations.json` or `folders.json` can leave a file named like it with `.tmp-` and 16 hex characters after the name. A first save that cannot make the folder or take `open.lock` is refused, and the line that says the project was not saved then shows a message that begins `open.lock:` and the operating system's error text. The app removes none of these folders or files.
````
(f) True at this main:
- `ProjectLock::try_lock` (kernel/src/project/store.rs): `create_dir_all`, `open.lock` opened with create and no truncate, never written. Its doc names `OPEN_LOCK`.
- `Projects::open_project` (kernel/src/project/mod.rs): the `place` match gives `Place::Known`, `Place::Remember` (with `KnownFolders::moved_to`, `with_same`, or `first`) or `Place::Copy` (`mint_identity`). `ProjectLock::try_lock` then `write_machine_file(FOLDERS)` then `replace` of the copy's file. Then `locations_to_bytes` and `write_machine_file(LOCATIONS)` for a re-link or a copy.
- `asks` makes the move: gone, not a folder, no file or another project's.
- `Projects::save`: `try_lock` at a first save, `create_dir_all`, `write_machine_file` of `LOCATIONS` and `FOLDERS`, then `replace`.
- `write_machine_file`'s doc names the `<name>.tmp-<16 hex>` leftover.
- `SaveFailure::MachineStore` shows "{what}: {source}", with `what` = `store::OPEN_LOCK`.
- A fresh `open_dataset` has no `saved` entry, so its first save mints an identity (`Projects::save`, `known.is_none()`).
- Nothing reads `previous-lineage.jsonl` into the store (`PREVIOUS_LINEAGE_FILE` is only read in `open_project`), so it is not a file this item lists.

R4. What a user is not told about a history an earlier run left; item 43 (ADV-2026-11-16-10 R3 (c))
(a) Source: ADV-2026-11-16-10 R3 (c); form Amendment 36 item 5 (f) and (g).
(b) Owed: yes, as a new item. Item 43 stays as worded: its sentences stay true. The one inexact point is "A second open of the same file is another open, with a file of its own": a reopen in the run that still holds the project's record continues that record, with no file of its own. The new item says so, and 43 is not edited, because its words are the human-approved and advisor-amended ones.
(c) Where: `KNOWN-LIMITATIONS.md`, new item 70.
(d) Old: none.
(e) New (drafter's draft):
````
70. **A project's session history that an earlier run left is not read, continued or mentioned when the project is opened again.**
    When a project is saved, the session history of that open is kept under the project's own identity in the `sessions` folder of item 43. If the app crashes, that folder stays. Opening the project in a later run does not read it, does not add the later run's steps to it and does not say that it is there. The later run's steps go to a record of their own. When the later run saves the project, the history cannot be moved under the project's identity while the earlier run's folder is there, so the save succeeds and the only sign is the line that the session history holds no saved-here mark for the save. It shows at every save of the project in that run, until the earlier run's folder is removed by hand, because the app removes only the records its own run made. A project opened again in the run that saved it continues that run's history for the project, when it has one, and makes no file of its own.
````
(f) `StepRecorder::reopened` binds the open to the project's record only when this recorder holds it (kernel/src/session_history.rs). `StepRecorder::adopt_project` and `copy_under`: `create_dir` of `<sessions>/<project hex>` refuses an existing folder, and `adopt_project` returns the "another run left a record there" error when the folder exists. `Projects::history` maps the error to `HistoryMark::Withheld`. `MARK_WITHHELD_NOTICE` in `frontends/shell/src/project/saveProject.ts` (S5) shows when `history_mark` is `withheld`. `StepRecorder::end_session` removes only this run's records. `adopt_project` is tried at each save while the open is unbound.

R5. The refusal `skp.project_lineage_not_kept_by_this_version` (ADV-2026-11-16-10 R3 (d))
(a) Source: ADV-2026-11-16-10 R3 (d); ADV-2026-11-18-18 item 3; form Amendment 55 (S17's table).
(b) Owed: yes, short. The user is told twice already (S17 at the reopen; the refusal's message at the save), but a limitation is where it stands once the line has left the strip. It is reachable only with a project file from a later version or one edited by hand, because this version writes a project file with no lineage.
(c) Where: `KNOWN-LIMITATIONS.md`, new item 71.
(d) Old: none.
(e) New (drafter's draft):
````
71. **A project file that records a history this version does not keep can be opened but not saved.**
    The project files this version writes record no history file. A project file from a later version, or one edited by hand, can record one. Opening such a project works, and a line says that a save of it will be refused. Save project is then refused with the message that `project.spatial` records a lineage, which this version of the application does not keep, and the file is left as it was.
````
(f) `Lineage::NotKept` is what `Projects::save` writes (`ProjectFile { lineage: Lineage::NotKept }`). `Projects::save` returns `SaveFailure::LineageNotKept` before any write, and `SkpError::project_lineage_not_kept_by_this_version` carries the message (protocol/skp/src/v0/error.rs). `lineagePlaces` in `frontends/shell/src/project/openProject.ts` pushes `LINEAGE_NOT_KEPT_NOTICE` (S17) for `recorded`, `recorded-with-lines-after` or any non-null `previous_file`. `read_lineage` (session_history.rs) gives a non-null `previous_file` for every kept member whose folder file is not the recorded one.

R6. A non-Unicode (or over 4,096-byte) path refused at a save (ADV-2026-11-16-16 item 2 (a); ADV-2026-11-18-18 item 3)
(a) Source: ADV-2026-11-16-16 item 2 (a); form Amendment 30 item 3 (what the user is told changes).
(b) Owed: no. The refusal exists: `stored_path` in kernel/src/project/store.rs refuses a path that is not absolute, not valid Unicode or over the bound, naming the file and never printing the path. But the shell hands the kernel every path as a string: `binding_pick_file` and `binding_pick_project_folder` return `Option<String>`, so a non-Unicode path cannot reach a save from the shipped app. A path over 4,096 bytes is reachable in principle only on a machine with long paths enabled, and the refusal then states its own cause (`MachineRecordRefused` shows "file: rule"). A limitation line would describe a case with no way in. If the advisor wants one, it belongs inside item 62's last paragraph, not a new item.
(c), (d), (e), (f): none.

R7. Two users of one machine (ADV-2026-11-20-01 item 9; Amendment 54 item 13)
(a) Source: ADV-2026-11-20-01 item 9, second point; form Amendment 53 item 9; Amendment 54 item 18.
(b) Owed: yes. The lock is kept in the per-user store; SKP-V0.md §12.3 already says it does not reach another user's store. The item adds the consequence. The clause "or the same user on two computers that share the folder" is the drafter's extension, true by the same code (Q5).
(c) Where: `KNOWN-LIMITATIONS.md`, new item 72.
(d) Old: none.
(e) New (drafter's draft):
````
72. **A project is kept open once at a time only within one user's machine store.**
    The lock that keeps a project open once at a time is held in the project's folder in the machine store, which belongs to one user of the computer (item 62). Two users of one computer each have a store, so each can open the same project folder at the same time, and so can one user on two computers that share the folder. Neither window is told of the other. Each save replaces `project.spatial` whole, so the last save stands and the other's is lost.
````
(f) `projects_root` (store.rs) is `data_dir()/spatial-ide/projects`, and `data_dir` is `spatial_engine::app_dirs::user_data_dir`. The shell builds `Projects::new` over `projects_root()` in frontends/shell/src-tauri/src/lib.rs. `ProjectLock::try_lock` locks a file in that folder. `Projects::save` reads the file, checks that it names the same project and not a lineage, and calls `replace` (whole or not at all).

R8. Section 12 and "the machine" (ADV-2026-11-20-03 item 1; Amendment 53 item 8)
(a) Source: ADV-2026-11-20-03 item 1; ADV-2026-11-20-01 item 9; the architect's N-A in the p3b-2 gate report.
(b) Owed: yes, one bullet. "The machine" or "this machine" is used in §12.2's `lineage` bullet and §12.3's `question`, data, `relink` and open bullets, and in §12.4's rows for `skp.project_known_folders_full` and `skp.project_machine_store_failed`, all for one per-user store. The bullet defines it once and leaves the other places as they are. This edit is under `protocol/skp/**`; see Q3.
(c) Where: `protocol/skp/SKP-V0.md`, §12.3, after the bullet that begins "**The open**".
(d) Old: none (new bullet).
(e) New (drafter's draft):
````
- **The machine.** Wherever this section says "the machine" or "this machine", it means one user's machine store: the `spatial-ide/projects` folder in the per-user data directory, with one folder for each project identity, holding that identity's `folders.json`, `locations.json`, `open.lock` and the lineage file kept on this machine. Another user of the same computer has a store of its own, which this user's calls neither read nor write.
````
(f) `projects_root` and `record_dir` (store.rs); the constants `FOLDERS`, `LOCATIONS` and `OPEN_LOCK` and `PREVIOUS_LINEAGE_FILE` (mod.rs, read in `open_project`); the managed `Projects` is built from `projects_root()` in lib.rs.

R9. A reopen whose data inside the folder is missing (ADV-2026-11-20-04 item 2, P-3)
(a) Source: ADV-2026-11-20-04 item 2, P-3; Amendment 54 item 18.
(b) Owed: yes.
(c) Where: `KNOWN-LIMITATIONS.md`, new item 73.
(d) Old: none.
(e) New (drafter's draft):
````
73. **A project whose data lies inside its folder is refused when that file is missing, and the app offers no re-link.**
    If the project was saved with its data inside its folder and the file is no longer at that place in the folder, the open is refused. The line beside the refusal says that the project was not opened and, if its data file was moved or renamed, to put it back where the project recorded it. The app does not offer to choose the file again. Choosing the file again is offered only for a project whose data lay outside its folder, when the file at the path this machine recorded is missing or no path is recorded.
````
(f) `data_at` takes the project-relative locator first and never falls through to the machine location. `check_inside` returns `CheckRefused::Unresolvable`, which `data_at` maps to `OpenFailure::TargetRefused`, and `open_error_of` maps it to `skp.project_target_unresolvable` with `locator` and `segment` (SKP-V0.md §12.4). `reopenRefusalPlace` (openProject.ts) returns `REOPEN_LOCATOR_REFUSAL_NOTICE` for that code with a `locator` field. `Data::NotFound` (hence `Reopen::NotFound`, the re-link offer in `AdmissionPanel.tsx`) arises only in the machine-location arm of `data_at`.

R10. The Console shows a refusal's text as it came (ADV-2026-11-20-04 item 2, P-14)
(a) Source: ADV-2026-11-20-04 item 2, P-14; Amendment 54 item 13 (the console row's line).
(b) Owed: yes.
(c) Where: `KNOWN-LIMITATIONS.md`, new item 74.
(d) Old: none.
(e) New (drafter's draft):
````
74. **The Console shows a refused open's text as it came.**
    When Open project is refused, the refusal block beside the map shows the kernel's message and its fields with each character that does not show, or that changes the direction of text, replaced by �, and a text over 1,024 characters cut and marked as cut. The session log takes the same text. The Console's row for the same call shows the message and the fields as they came, with those characters in them, so text that came from the project file can read differently there than in the refusal block.
````
(f) `shownRefusal` and `shownText` (frontends/shell/src/project/shownText.ts: `REPLACED`, `SHOWN_UNITS` = 1024, the " [cut]" mark). `openProject.ts` logs `shownRefusal(formatRefusal(...))`. `ConsolePanel.tsx` renders `RefusalBlock refusal={formatRefusal(vm.refusal)}` for the `open_project` row. The `formatRefusal` doc (admission/formatRefusal.ts) states the Console is not bounded.

R11. A running export that still holds the project (ADV-2026-11-20-15 item 9; Amendment 63 item 5)
(a) Source: ADV-2026-11-20-15 item 9; Amendment 63 item 5.
(b) Owed: no, and S9's text stays. The window is narrow: the old open of the project stays open while an export of this window runs (`selectClosable` in frontends/shell/src/workspace/workspaceState.ts, the close effect in `App.tsx`), so a reopen of that project made while it stops shows S9's other place, whose advice ("Close it where it is open, then try again") is right on its "try again", and the project opens once the export ends. ADV-2026-11-20-05 item 7 already records that S9-other does not say where the project is open and names "this application's own close not yet finished" as such a holder. The case is untested (Amendment 63 item 5). If the advisor wants it said, it is one clause in item 72: "A project that an export of this window is still stopping is refused as open elsewhere until the export has stopped." That clause rests on code reading alone, which is why I do not recommend it.
(c), (d), (e), (f): none.

R12. The Console's effect text for `binding_pick_project_folder` (ADV-2026-11-20-17 item 2, last bullet)
(a) Source: ADV-2026-11-20-17 item 2.
(b) Owed: yes. The row names the first save alone, and `handleProjectPick` in `frontends/shell/src/admission/AdmissionPanel.tsx` also uses `pickProjectFolder` for a reopen. The picker's own doc in `frontends/shell/src-tauri/src/commands.rs` already says both, so no src-tauri file is touched.
(c) Where: `frontends/shell/src/console/surfaceRegistry.ts`, the class-B row for `binding_pick_project_folder`, its `effect` string.
(d) Old, byte-copied from `surfaceRegistry.ts`:
````
      "opens the native OS folder picker so the operator can choose the project folder at an open's first " +
      "save, before save_project is called; the picker's own answer supplies the folder, never a script's.",
````
(e) New (drafter's draft):
````
      "opens the native OS folder picker so the operator can choose the project folder, at an open's first " +
      "save before save_project is called or at a reopen before open_project is called; the picker's own answer supplies the folder, never a script's.",
````
(f) The call sites: `createProjectSaver`'s `pickFolder` in `App.tsx` (the saver in saveProject.ts calls `pickProjectFolder` at a first save) and `handleProjectPick` in AdmissionPanel.tsx (reopen). Tests: no test pins this string. `consoleLanguage.test.ts` checks only that class-B effects do not match the banned `SKP` label pattern (`\bSKP skp/|\bSKP \d|· control plane`), which the new text does not match. `surfaceCompleteness.test.ts` checks that the command is in the registry, not its text. Prettier may reflow the second line; the applier runs the shell's format check.

R13. Item 4's sentence "Nothing yet restores…" (found by me; not in the brief)
(a) Source: my reading of item 4's On-main paragraph against `handleReopened`. The brief's "every item about saving, reopening…" covers it.
(b) Owed: yes. The sentence is false now. Item 4's own comment records it as approved by the human; the second sentence of the same paragraph already carries advisor edits (ADV-2026-11-18-11 in the comment), so there is precedent for an advisor change here (Q4).
(c) Where: `KNOWN-LIMITATIONS.md`, item 4, the On-main paragraph's last sentence (a substring of that physical line; the rest is untouched), and a clause added to the item's second comment.
(d) Old, byte-copied from the line:
````
Nothing yet restores a filter, a style or a view from that record or from a project file.
````
(e) New (drafter's draft):
````
Opening a saved project with Open project restores the filter, its cards, the style and, when the data is in the space the view was saved in, the view from the project file; nothing restores them from the session record.
````
(f) `handleReopened` in `App.tsx` (filter and clauses dispatched as `filter.clauses.set` or `filter.apply`; `styleTransitions`; `reopenViewRef`) and `reopenApply` in openProject.ts (the view only for `view.state === "applies"`; O-18's column check). The kernel gives `ViewState::Applies` or `SavedInAnotherSpace` in `view_state` (mod.rs). The "session record" is unchanged: no code reads it back (step 3's offer does not exist).

R14. Item 10's On-main paragraph (found by me)
(a) Source: my reading; same reason as R13.
(b) Owed: yes. "Nothing reads them back, so the panel sentence above still holds: reopening the file asks you to assert again" is true for Open GeoParquet, but a saved project keeps its assertion and declaration and Open project uses them without asking. The artifact paragraph above it ("There is no project file") is about the v0.1.0 tag and stays.
(c) Where: `KNOWN-LIMITATIONS.md`, item 10, the On-main paragraph's last sentence (a substring of that physical line), and a clause added to the item's comment.
(d) Old, byte-copied:
````
Nothing reads them back, so the panel sentence above still holds: reopening the file asks you to assert again.
````
(e) New (drafter's draft):
````
Nothing reads them back. Opening the file again with Open GeoParquet asks you to assert again, as the panel sentence above says. A saved project keeps the assertion and the identity declaration its data was opened with, where one was made, and Open project uses them without asking. The app still holds one dataset at a time, and opening a project replaces the dataset as opening a file does.
````
(f) `Projects::open_project` builds `OpenDatasetRequest` from `file.dataset.admission()` (`crs_assertion`, `identity`). `handleReopened` calls `handleAdmitted(next)`, which replaces the admitted dataset as every open does.

R15. kernel/README.md's "Declared limits" (found by me)
(a) Source: form Amendment 16 item 4 (the README names item 62 among the declared limits).
(b) Owed: yes: the kernel-owned new items join the list.
(c) Where: `kernel/README.md`, the "Declared limits" line.
(d) Old, byte-copied:
````
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62
````
(e) New (drafter's draft; add 75 only if Q1 lands it):
````
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62, 69, 70, 71, 72, 73
````
(f) Items 69 to 73 describe kernel code: `check_inside`, the history's adoption, `SaveFailure::LineageNotKept`, `ProjectLock`, `data_at`. Item 74 is shell-owned and not listed. The line's "Last verified" pointer is not affected, because no pointer is added.

R16. Walkthrough Part AD: rows P0 and OP1 to OP5 (§9's Operator list)
(a) Source: form §9 Operator; Amendment 16 item 3; Amendment 54 item 18.
(b) Owed: yes. Already present: AD0 (P0) and AD1 (OP1, "save into a OneDrive folder"). P5 adds AD2 (OP2), AD3 (OP3), AD4 (OP4) and AD5 (OP5), their result-log rows, and the edits to the heading, the intro, the "Before AD1" paragraph and the log's lead-in, all in the same file. OP6 is not added (R17). The rows are written to what the app does now, by the symbols in (f); statements I cannot confirm by reading are phrased as "record whether…" (see Q6).
(c) Where: `frontends/shell/MANUAL-WALKTHROUGH.md`, Part AD.
(d) Old, byte-copied (the Part's heading, intro, "Before AD1" paragraph, log lead-in; then the last log row):
````
## Part AD — save a project into a folder under OneDrive: Save project, the folder picker, the saved line and the file that is written (b2-piece-1c-save-and-reopen, step 1)
````
````
This Part is the Operator gate of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §9, for step 1, run only on a build with step 1 merged, with a blank result log. Its rows are §9's P0 and OP1. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). Every sentence in it is a draft for the human's sight (P6) and none is the human's wording. OP2 to OP6 join this Part with steps 2 and 3.
````
````
**Before AD1:** fixture `filter-zoned.parquet`, no new fixture (Part E's table; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`, which is the fixture `frontends/shell/e2e/project.mjs` opens); an empty folder that you make inside your OneDrive folder, for the project; the app started with no dataset open, so that AD1 opens one.
````
````
Fill in after running the rows above (the b2-piece-1c-save-and-reopen Part AD, step 1).
````
````
- **AD1 (the picker opened once; the saved line; whether the saved-here line appeared; the folder's files; the second Save project; what OneDrive showed; felt):**
````
(e) New (drafter's draft). Heading, intro, "Before AD1" paragraph (which gains sentences for AD2 to AD5), log lead-in:
````
## Part AD — save a project into a folder under OneDrive and open it again: Save project, Open project, the question, an online-only file and a second window (b2-piece-1c-save-and-reopen, steps 1 and 2)
````
````
This Part is the Operator gate of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §9, for steps 1 and 2, run only on a build with step 2 merged, with a blank result log. Its rows are §9's P0 and OP1 to OP5. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). Every sentence in it is a draft for the human's sight (P6) and none is the human's wording. OP6 joins this Part with step 3.
````
````
**Before AD1:** fixture `filter-zoned.parquet`, no new fixture (Part E's table; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`, which is the fixture `frontends/shell/e2e/project.mjs` opens); an empty folder that you make inside your OneDrive folder, for the project; the app started with no dataset open, so that AD1 opens one. **Before AD2 to AD5:** AD1's project, saved; a second empty folder inside your OneDrive folder for AD2 and AD3; File Explorer, for AD2 to AD4; and, for AD5, a second start of the app while the first is running.
````
````
Fill in after running the rows above (the b2-piece-1c-save-and-reopen Part AD, steps 1 and 2).
````
New rows after AD1:
````
| AD2 | OP2. In the second empty OneDrive folder, put a copy of `filter-zoned.parquet`. Click **Open GeoParquet…**, select that copy, type `"zone" = 'residential'` into the Filter input and click Apply, then click Save project and choose that same folder in the picker. Close the app. In File Explorer, right-click the copy of `filter-zoned.parquet` and choose Free up space, so that the file is online-only. Start the app, click **Open project…** (or press Ctrl+K, type `/open-project` and press Enter) and choose that folder. | The picker opens, titled `[P6 placeholder] Choose the project folder`. While the open runs, the button reads `[P6 placeholder] Opening project…` and a Cancel button shows; once the open has taken a little while, a line reads `Opening…`. When the open ends, the map shows the data and the Filter section shows the filter you applied. Record whether a line about changed data appeared, and whether the file was small enough to arrive before you could see Cancel. **Felt:** did the app look frozen at any moment; did `Opening…` and Cancel stay in view until the open ended? **Strings for sight (P6):** the control's label, its opening label and the picker's title. |
| AD3 | OP3. Close the app. In File Explorer, choose Free up space again on the copy of `filter-zoned.parquet`. Start the app, click **Open project…**, choose the same folder, and click Cancel as soon as the button reads `[P6 placeholder] Opening project…`. | Either a line reads `Open cancelled` and no project is open, or the project opens as in AD2 because the data had arrived before the Cancel was seen. Record which, and whether Cancel seemed to wait for the file. **Felt:** did Cancel seem to wait; did the app look frozen while it waited? |
| AD4 | OP4. In File Explorer, copy the folder of AD1's project, the one holding `project.spatial`, to a new folder with Copy and Paste. Start the app, click **Open project…** and choose the copy. | A question appears. It begins `[P6 placeholder] This machine remembers this project in another folder. Is the project in this folder a copy, or the same project?` and offers `[P6 placeholder] A copy`, `[P6 placeholder] The same project` and `[P6 placeholder] Do not open`. Choose A copy: the project opens with the filter AD1 applied. In a text editor, the copy's `project.spatial` holds a different `project` value from the first folder's file, and the first folder's file is unchanged. Close the app, start it and open the copy again: no question is asked. Copy the first folder once more to a new folder and open that one, choosing The same project: it opens, and opening that folder again asks nothing. **Felt:** are the question and its three choices clear? **Strings for sight (P6):** the question and its three choices. |
| AD5 | OP5. Start the app, open `filter-zoned.parquet` and save a project into a new empty folder inside OneDrive, as in AD1. Start the app a second time, so that two windows run. In the second window click **Open project…** and choose the same folder. Then, in the first window, click **Open GeoParquet…** and select `filter-zoned.parquet`, so that the first window no longer holds the project, and in the second window choose the same folder again with **Open project…**, again if the try is refused. | In the second window the first try is refused: a line reads `[P6 placeholder] The project was not opened in this window. Close it where it is open, then try again.` beside a refusal block with the code `skp.project_open_elsewhere`. After the first window has opened the other file, the second window's try opens the project; record how many tries it took. If the second window does not start, record that and run nothing else in this row. **Felt:** is it clear where the project is open? **Strings for sight (P6):** that line. |
````
New log rows after AD1's:
````
- **AD2 (the picker; the button and Cancel while it opened; the line about changed data; whether the app looked frozen; felt):**
- **AD3 (which outcome; whether Cancel waited for the file; felt):**
- **AD4 (the question and its choices; what each choice did; the copy's `project` value against the first folder's; whether the second open asked; felt):**
- **AD5 (whether the second window started; the refusal and its line; the tries it took after the first window opened the other file; felt):**
````
(f) True at this main:
- Open project control and `/open-project`: `OPEN_PROJECT_IDLE` and `OPEN_PROJECT_OPENING` in AdmissionPanel.tsx; `project.open` with `command: "open-project"` in `layout/actionRegistry.ts`.
- Picker title: `PROJECT_FOLDER_PICKER_TITLE` in commands.rs.
- Cancel: the `admission-open-cancel` button and `openCancelKey`; `openLivenessText` returns "Opening…" after `OPEN_LIVENESS_DELAY_MS` (200); the note text "Open cancelled" in `runAdmitPath`; a Cancel after `open_under` returned is not seen (`Projects::open_project`).
- The restored filter: `handleReopened` (R13).
- AD4: `QUESTION_TEXT`, `QUESTION_COPY`, `QUESTION_SAME`, `QUESTION_CANCEL` in reopenNotices.ts. `Place::Copy` rewrites the copy's `project.spatial` with a new identity (`write_project`, `replace`). After a copy or a same answer the folder is known in `folders.json`, so no second question.
- AD5: the code `skp.project_open_elsewhere` (SKP-V0.md §12.4). `OPEN_ELSEWHERE_OTHER_NOTICE` is the line quoted, byte-copied from reopenNotices.ts. The e2e suite `second-open.mjs` shows two processes on one store (Amendment 69 item 1).
- The Part's existing AD1 text stays true at this main: its project folder still holds `project.spatial` alone.

R17. OP6, the recovery offer (§9 Operator; §2.6; Amendment 32)
(a) Source: form §9 Operator OP6; §2.6; Amendment 32.
(b) Owed: no. Step 2 cannot carry it: item 43 itself says "nothing offers them back yet", and no recovery code exists at this main, because step 3 is a node of its own (Amendment 32). I did not settle whether to add a different step-2 row (a crash, then a reopen, which would show the lock free after a crash and the withheld mark of item 70); that is Q2.
(c), (d), (e), (f): none.

---

Size
Files P5 touches: 5. They are `KNOWN-LIMITATIONS.md`, `protocol/skp/SKP-V0.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `frontends/shell/src/console/surfaceRegistry.ts` and `kernel/README.md`. The five-line form file is its own commit and exempt (AUTONOMY §21c).
Lines, insertions plus deletions (a long physical line counts 1):
- KNOWN-LIMITATIONS.md: item 62 title, paragraph and comment, 3 added and 3 deleted; item 4 sentence and comment, 2 and 2; item 10 sentence and comment, 2 and 2; new items 69 to 74, each a title line, a text line, a comment line and a blank, 6 × 4 = 24 added. That is 31 added, 7 deleted (38). If K-3 lands as item 75, 4 more added (35 and 7; 42).
- SKP-V0.md: 1 added.
- surfaceRegistry.ts: 2 added and 2 deleted (4).
- kernel/README.md: 1 added and 1 deleted (2).
- MANUAL-WALKTHROUGH.md: heading, intro and "Before AD1" paragraph and log lead-in, 4 added and 4 deleted; AD2 to AD5, 4 added; log rows, 4 added. That is 12 added and 4 deleted (16).
Total: 47 added and 14 deleted = 61 changed lines (65 with item 75). That is within 150 lines and 8 files.

Tension with AUTONOMY §21a, which is not about size: §21a requires full gating for "any SKP control- or data-plane message, literal, or field (`protocol/skp/**`)". R8's bullet edits `protocol/skp/SKP-V0.md`. It adds no message, literal or field, and §8 of SKP-V0.md has earlier "(no literal change)" notes, but the path is under `protocol/skp/**` (Q3). If the advisor rules it a wire touch, the split is: part P5-a is the other four files (4 files, 60 lines), reviewer alone; part P5-b is `protocol/skp/SKP-V0.md` alone (1 line), gated by the route the advisor names. Their files are disjoint and each is within the bounds. Slot overlap at dispatch: SKP-V0.md is the only `protocol/` path, so it needs no other piece or PR on `protocol/`.

Packet for the advisor
Each entry's (e) is under its entry above. They are indexed here, not repeated:
- R1 (new item 69, K-2)
- R2 (new item 75, K-3, option B; option A in Q1)
- R3 (item 62 rewritten)
- R4 (new item 70)
- R5 (new item 71)
- R7 (new item 72)
- R8 (SKP-V0.md §12.3, one bullet)
- R9 (new item 73)
- R10 (new item 74)
- R12 (the `surfaceRegistry.ts` effect text)
- R13 (item 4's last sentence)
- R14 (item 10's last sentence)
- R15 (`kernel/README.md`'s "Declared limits" line)
- R16 (Part AD's heading, intro, "Before AD1", log lead-in, AD2 to AD5, and the four log rows)

Not owed: R6, R11 and R17. R6 may be reversed if you want a line inside item 62.

Questions I could not settle by reading:
- Q1 (R2). What may K-3 say? Option A, §2.12's wording: "A Cancel during an online-only download takes effect when the current read returns." That is H5, never observed. Option B is R2's draft, which states what the code does and says that the download case has not been seen. Option C: hold K-3 until OP3's result is recorded, then write A or B from it. I recommend B now, replaced after OP3 (item 68 is the precedent for "has not been seen in the running app").
- Q2 (R17). Step 2 cannot carry OP6. Option (a): OP6 stays unadded and the Part's intro says it joins with step 3 (R16 does this). Option (b): add a step-2 row "crash, then reopen". I recommend (a).
- Q3 (R8). Is the SKP-V0.md §12.3 bullet a wire touch under AUTONOMY §21a? ADV-2026-11-20-03 item 1 asked whether section 12 gains a sentence, and R1 (b) of ADV-2026-11-16-10 put P5 under the reviewer alone. Option (i): rule that a clarifying bullet with no message, literal or field change is not a wire touch, and keep it in P5. Option (ii): split P5-b out as above. I recommend (i), with the ruling stated in the five-line form's Out-of-scope line.
- Q4 (R13). Item 4's last sentence is recorded in its own comment as approved by the human, and the paragraph already carries advisor edits (ADV-2026-11-18-11). Does the advisor rule the change under the delegation, or does it go to the human? I recommend the advisor rules it, because the sentence is untrue at this main.
- Q5 (R7). Keep the clause "or one user on two computers that share the folder"? It follows from the same code but is outside the item you carried. I recommend keeping it.
- Q6 (R16). AD5 needs a second running app. I could not settle by reading whether a second start of the packaged app runs, since no single-instance plugin is in the src-tauri tree but the e2e suite gave B a WebView2 data folder of its own. AD2 also cannot say whether a small online-only file shows Cancel before it arrives. Both rows say "record" for these. I recommend keeping them as drafted, so that a result of "did not start" is recorded as a finding.

Pre-gate self-check (the four classes):
1. Cross-module code. Every claim in (f) was read in the file named; the kernel, shell and protocol sides were each read, none imagined.
2. Completion claims. Nothing here claims "done"; the caller-grep rule does not apply, because I add no `pub` item, callback or path. Every sentence in (e) points to a symbol in (f).
3. User-facing messages. Every shown string I quote is byte-copied from `reopenNotices.ts`, `AdmissionPanel.tsx` or `commands.rs` as read at this main. The rows and items describe behaviour that exists at this commit.
4. Required tests. No test is added. I found no test that pins the Console effect text.

Model: claude-sonnet-5-5 (Sonnet 5.5), as the harness gives it. No model override. No context handoff received or produced. No usage figures at hand.
