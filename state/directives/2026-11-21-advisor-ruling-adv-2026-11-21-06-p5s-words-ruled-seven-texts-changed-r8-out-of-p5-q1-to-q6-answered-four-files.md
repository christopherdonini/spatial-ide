# The advisor's ruling ADV-2026-11-21-06, under the human's delegation of 2026-11-13, not the human's words: P5's words ruled: the packet stands with seven texts changed by the advisor, R8's bullet out of P5, Q1 to Q6 answered; four files

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-06.md in the advisory folder, 23399 bytes, sha256 ac37761ef0ffc63767933d9ee824b331ba16cd42edffb959781a458a2e2cd8ed, last modified at 2026-11-21T05:03:03Z by the file system; the advisor's message naming it received at 2026-11-21T05:03:10.243Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T05:14:48Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-06, to the custodian, 2026-11-21. P5's words: the packet is ruled, with seven of its texts changed by me, one entry taken out of P5, and Q1 to Q6 answered. The drafter's texts below are copied by script from its filed report on main at 1fee18e2; the old blocks are checked once each in their files at that main. Read by me against the code at that main: `open_project`, `save`, `data_at`, `asks` and `write_machine_file` in `kernel/src/project/mod.rs`; the lock and the folder record in `store.rs`; `judge` and `check_inside` in `resolver.rs`; `reopenApply` in `frontends/shell/src/project/openProject.ts`; `shownText.ts`; the texts of the notices named below. Not read by me, and resting on the drafter's symbols until the reviewer reads them: the session history's code (item 70), the engine's cancel (item 75), the Console's row (item 74's last sentence), `handleReopened` (item 10), the picker's call sites, and the walkthrough rows' steps. I ran nothing.

**The questions**

1. **Q1: option B,** as item 75, with "Open project" named where the draft says "an open". It is replaced when OP3 has been observed at the sitting.
2. **Q2: (a).** OP6 joins with step 3.
3. **Q3: neither.** R8's bullet leaves P5. `protocol/skp/SKP-V0.md` is not edited by this part, and I do not rule whether a sentence there is a wire touch. Section 12.3 already says the lock is kept within one user's machine store and does not reach another user's. The bullet is carried on the 1c form to the next piece that edits that file under both gates, where the architect, whose note it answers, reads it. P5 is then four files.
4. **Q4: I rule it.** The sentence is untrue at this main, and KNOWN-LIMITATIONS wording is mine under the grant. The item's comment says the new sentences are the advisor's and replace one the human approved. It is listed in the digest for the human to overturn. Item 10's sentence is ruled the same way.
5. **Q5: keep the clause.** A folder shared by two computers is what a OneDrive folder is.
6. **Q6: as drafted.** A second start that does not run is recorded as a finding.
7. **R6: not owed,** as the drafter says. **R11: not owed in P5;** whether S9's other line fits a project this window's own export still holds is carried to the human's sight of that line at P6. **R17: not owed.**

**The words.** Each block is whole lines for whole lines, the fence lines not part of it; items 16 and 17 alone replace a sentence inside a line. The numbers are re-taken at P5's base if they have moved, and each cross-reference with them.

8. **Item 69, new, after item 68 (K-2).** Mine in three places: the title and the first sentence say which projects record such a path, the sentence on a seen change points at items 19 and 23 to 28 without restating them, and the last sentence covers data inside the folder that the file does not record by a path.

````
69. **When a project file records its data by a path from the project folder, the check that no name on that path is a link is made once, before the data is opened.**
    When a project is saved with its data inside its folder, the project file records the data by its path from the folder, unless the data was reached through a link or its path has no spelling the file can carry. When you open a project whose file records such a path, the app walks the path one name at a time from the folder before it opens the data, and refuses the open if a name on it is a link (on Windows a junction counts as one), is missing, or is not a folder or a file where it should be. The folder itself is resolved first, so a link at or above the folder is followed. A link, a rename or a replacement that another program makes after the check is not prevented, at the open or at any later read. A change that the change detector or the advisory watch sees is handled as items 19 and 23 to 28 describe, and a change they do not see is not detected. A project whose file records no such path is opened at the path this machine recorded for its data, with no check of the names on the way.
````

9. **Item 62.** Replace its title line and its paragraph line:

````
62. **Each project the app saves leaves a folder in this machine's store, and nothing removes it.**
    The first save of an open dataset makes a new project identity and a folder for it in the machine store, `<data dir>/spatial-ide/projects/<32 hex>/`, where `<32 hex>` is the identity's 32 lowercase hex characters and `<data dir>` is the per-user data directory (on Windows, the folder the `LOCALAPPDATA` variable names). Every save of that open writes `locations.json` there, which holds the path at which this machine found the dataset. The first save also writes `folders.json`, which holds the folder the project was first saved to, as an absolute path, and an empty list of other folders. Both files are written before `project.spatial` is replaced. A first save that fails after the store folder is made leaves that folder and any file it wrote there, and the next save of that open is a first save again, which makes another identity and another folder. A later save that fails at the replace leaves the `locations.json` it wrote. A dataset that is opened again and saved again also makes a new identity and a new folder at its first save. The app removes none of these folders or files.
````

with the drafter's text, changed by me in three clauses (when `open.lock` is made; the condition is no `folders.json`, not no folder; a first folder that is not a folder is a move too):

````
62. **Each project the app saves or opens leaves a folder in this machine's store, and nothing removes it.**
    The first save of an open dataset makes a new project identity and a folder for it in the machine store, `<data dir>/spatial-ide/projects/<32 hex>/`, where `<32 hex>` is the identity's 32 lowercase hex characters and `<data dir>` is the per-user data directory (on Windows, the folder the `LOCALAPPDATA` variable names). Opening a saved project makes that folder too, on a machine that has none for it, and makes a new identity and a new folder when you answer that the folder is a copy. The folder can hold three files. `open.lock` is made by the first save, and by an open of the project where it is not there yet; nothing is written to it. `locations.json` holds the path at which this machine found the dataset: every save of the project writes it, and so does an open that follows a re-link or a copy answer. `folders.json` holds the folder the project was first saved to, as an absolute path, and a list of other folders. The first save writes it with an empty list, and so does an open of a project for which this machine holds no `folders.json`, with the folder opened as the first folder. An open from another folder, when the first folder is gone, is not a folder or no longer holds this project's file, replaces the first folder with the folder opened and says nothing about it; the answer that a folder is the same project adds it to the list. A first save writes `locations.json` and `folders.json` before `project.spatial` is replaced, and an open that answers a copy writes `folders.json` before it replaces the copy's `project.spatial`. A first save or an open that fails after the store folder is made leaves that folder and any file it wrote there. After a failed first save the next save of that open is a first save again, which makes another identity and another folder. A later save that fails at the replace leaves the `locations.json` it wrote. A copy whose `project.spatial` cannot be replaced is refused and leaves its new identity's folder with `folders.json` and `open.lock`. A dataset that is opened again with Open GeoParquet and saved again makes a new identity and a new folder at its first save; opening the saved project again keeps its identity. A process that ends while it writes `locations.json` or `folders.json` can leave a file named like it with `.tmp-` and 16 hex characters after the name. A first save that cannot make the folder or take `open.lock` is refused, and the line that says the project was not saved then shows a message that begins `open.lock:` and the operating system's error text. The app removes none of these folders or files.
````

10. **Item 70, new,** as drafted:

````
70. **A project's session history that an earlier run left is not read, continued or mentioned when the project is opened again.**
    When a project is saved, the session history of that open is kept under the project's own identity in the `sessions` folder of item 43. If the app crashes, that folder stays. Opening the project in a later run does not read it, does not add the later run's steps to it and does not say that it is there. The later run's steps go to a record of their own. When the later run saves the project, the history cannot be moved under the project's identity while the earlier run's folder is there, so the save succeeds and the only sign is the line that the session history holds no saved-here mark for the save. It shows at every save of the project in that run, until the earlier run's folder is removed by hand, because the app removes only the records its own run made. A project opened again in the run that saved it continues that run's history for the project, when it has one, and makes no file of its own.
````

11. **Item 71, new,** as drafted:

````
71. **A project file that records a history this version does not keep can be opened but not saved.**
    The project files this version writes record no history file. A project file from a later version, or one edited by hand, can record one. Opening such a project works, and a line says that a save of it will be refused. Save project is then refused with the message that `project.spatial` records a lineage, which this version of the application does not keep, and the file is left as it was.
````

12. **Item 72, new,** as drafted:

````
72. **A project is kept open once at a time only within one user's machine store.**
    The lock that keeps a project open once at a time is held in the project's folder in the machine store, which belongs to one user of the computer (item 62). Two users of one computer each have a store, so each can open the same project folder at the same time, and so can one user on two computers that share the folder. Neither window is told of the other. Each save replaces `project.spatial` whole, so the last save stands and the other's is lost.
````

13. **Item 73, new.** Mine in its condition, for the same reason as item 69's last sentence:

````
73. **A project whose file records its data by a path from the project folder is refused when that file is missing, and the app offers no re-link.**
    If the project file records its data by a path from the project folder (item 69) and the file is no longer at that place in the folder, the open is refused. The line beside the refusal says that the project was not opened and, if its data file was moved or renamed, to put it back where the project recorded it and open the project again. The app does not offer to choose the file again. Choosing the file again is offered only for a project whose file records no such path, when the file at the path this machine recorded is missing or no path is recorded.
````

14. **Item 74, new.** The drafter's, with three changes: no place is named for the refusal block, the replacement character is named and not typed, and the cut is in the unit the code counts.

````
74. **The Console shows a refused open's text as it came.**
    When Open project is refused, the refusal block shows the kernel's message and its fields with each character that does not show, or that changes the direction of text, replaced by the replacement character U+FFFD, and a text over 1,024 UTF-16 code units cut and marked as cut. The session log takes the same text. The Console's row for the same call shows the message and the fields as they came, with those characters in them, so text that came from the project file can read differently there than in the refusal block.
````

15. **Item 75, new, last (K-3),** as item 1 rules:

````
75. **Whether a Cancel stops Open project before an online-only file has finished downloading has not been observed.**
    A Cancel of Open project is looked at between the steps of the open, and it reaches the engine's own queries during the open. While the operating system is still downloading an online-only file, such as one in a OneDrive folder, whether a Cancel stops the open before the download ends has not been seen in the running app. A Cancel that arrives after the data has been opened is not seen, and the project opens.
````

16. **Item 4,** the last sentence of its On-main paragraph. Replace:

````
Nothing yet restores a filter, a style or a view from that record or from a project file.
````

with my text. The draft said the style and the view are restored; the code restores each on a condition and says so in a line when it does not:

````
Opening a saved project with Open project applies the filter and its cards as saved, the style where this version can read it, with Colour by only when the data still offers its column, and the view when the data is in the space the view was saved in; a line says so when the style, Colour by or the view is not restored. Nothing restores them from the session record.
````

17. **Item 10,** the last sentence of its On-main paragraph. Replace:

````
Nothing reads them back, so the panel sentence above still holds: reopening the file asks you to assert again.
````

with, as drafted:

````
Nothing reads them back. Opening the file again with Open GeoParquet asks you to assert again, as the panel sentence above says. A saved project keeps the assertion and the identity declaration its data was opened with, where one was made, and Open project uses them without asking. The app still holds one dataset at a time, and opening a project replaces the dataset as opening a file does.
````

18. **`kernel/README.md`.** Replace:

````
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62
````

with:

````
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62, 69, 70, 71, 72, 73, 75
````

19. **`frontends/shell/src/console/surfaceRegistry.ts`,** the effect text of `binding_pick_project_folder`. Replace:

````
      "opens the native OS folder picker so the operator can choose the project folder at an open's first " +
      "save, before save_project is called; the picker's own answer supplies the folder, never a script's.",
````

with the drafter's text. What is ruled is the string's value; where the two parts break is the formatter's:

````
      "opens the native OS folder picker so the operator can choose the project folder, at an open's first " +
      "save before save_project is called or at a reopen before open_project is called; the picker's own answer supplies the folder, never a script's.",
````

20. **`frontends/shell/MANUAL-WALKTHROUGH.md`, Part AD,** all as drafted. Replace the heading:

````
## Part AD — save a project into a folder under OneDrive: Save project, the folder picker, the saved line and the file that is written (b2-piece-1c-save-and-reopen, step 1)
````

with:

````
## Part AD — save a project into a folder under OneDrive and open it again: Save project, Open project, the question, an online-only file and a second window (b2-piece-1c-save-and-reopen, steps 1 and 2)
````

Replace the intro:

````
This Part is the Operator gate of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §9, for step 1, run only on a build with step 1 merged, with a blank result log. Its rows are §9's P0 and OP1. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). Every sentence in it is a draft for the human's sight (P6) and none is the human's wording. OP2 to OP6 join this Part with steps 2 and 3.
````

with:

````
This Part is the Operator gate of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §9, for steps 1 and 2, run only on a build with step 2 merged, with a blank result log. Its rows are §9's P0 and OP1 to OP5. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). Every sentence in it is a draft for the human's sight (P6) and none is the human's wording. OP6 joins this Part with step 3.
````

Replace the paragraph:

````
**Before AD1:** fixture `filter-zoned.parquet`, no new fixture (Part E's table; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`, which is the fixture `frontends/shell/e2e/project.mjs` opens); an empty folder that you make inside your OneDrive folder, for the project; the app started with no dataset open, so that AD1 opens one.
````

with:

````
**Before AD1:** fixture `filter-zoned.parquet`, no new fixture (Part E's table; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`, which is the fixture `frontends/shell/e2e/project.mjs` opens); an empty folder that you make inside your OneDrive folder, for the project; the app started with no dataset open, so that AD1 opens one. **Before AD2 to AD5:** AD1's project, saved; a second empty folder inside your OneDrive folder for AD2 and AD3; File Explorer, for AD2 to AD4; and, for AD5, a second start of the app while the first is running.
````

Replace the log's lead-in:

````
Fill in after running the rows above (the b2-piece-1c-save-and-reopen Part AD, step 1).
````

with:

````
Fill in after running the rows above (the b2-piece-1c-save-and-reopen Part AD, steps 1 and 2).
````

Add after row AD1:

````
| AD2 | OP2. In the second empty OneDrive folder, put a copy of `filter-zoned.parquet`. Click **Open GeoParquet…**, select that copy, type `"zone" = 'residential'` into the Filter input and click Apply, then click Save project and choose that same folder in the picker. Close the app. In File Explorer, right-click the copy of `filter-zoned.parquet` and choose Free up space, so that the file is online-only. Start the app, click **Open project…** (or press Ctrl+K, type `/open-project` and press Enter) and choose that folder. | The picker opens, titled `[P6 placeholder] Choose the project folder`. While the open runs, the button reads `[P6 placeholder] Opening project…` and a Cancel button shows; once the open has taken a little while, a line reads `Opening…`. When the open ends, the map shows the data and the Filter section shows the filter you applied. Record whether a line about changed data appeared, and whether the file was small enough to arrive before you could see Cancel. **Felt:** did the app look frozen at any moment; did `Opening…` and Cancel stay in view until the open ended? **Strings for sight (P6):** the control's label, its opening label and the picker's title. |
| AD3 | OP3. Close the app. In File Explorer, choose Free up space again on the copy of `filter-zoned.parquet`. Start the app, click **Open project…**, choose the same folder, and click Cancel as soon as the button reads `[P6 placeholder] Opening project…`. | Either a line reads `Open cancelled` and no project is open, or the project opens as in AD2 because the data had arrived before the Cancel was seen. Record which, and whether Cancel seemed to wait for the file. **Felt:** did Cancel seem to wait; did the app look frozen while it waited? |
| AD4 | OP4. In File Explorer, copy the folder of AD1's project, the one holding `project.spatial`, to a new folder with Copy and Paste. Start the app, click **Open project…** and choose the copy. | A question appears. It begins `[P6 placeholder] This machine remembers this project in another folder. Is the project in this folder a copy, or the same project?` and offers `[P6 placeholder] A copy`, `[P6 placeholder] The same project` and `[P6 placeholder] Do not open`. Choose A copy: the project opens with the filter AD1 applied. In a text editor, the copy's `project.spatial` holds a different `project` value from the first folder's file, and the first folder's file is unchanged. Close the app, start it and open the copy again: no question is asked. Copy the first folder once more to a new folder and open that one, choosing The same project: it opens, and opening that folder again asks nothing. **Felt:** are the question and its three choices clear? **Strings for sight (P6):** the question and its three choices. |
| AD5 | OP5. Start the app, open `filter-zoned.parquet` and save a project into a new empty folder inside OneDrive, as in AD1. Start the app a second time, so that two windows run. In the second window click **Open project…** and choose the same folder. Then, in the first window, click **Open GeoParquet…** and select `filter-zoned.parquet`, so that the first window no longer holds the project, and in the second window choose the same folder again with **Open project…**, again if the try is refused. | In the second window the first try is refused: a line reads `[P6 placeholder] The project was not opened in this window. Close it where it is open, then try again.` beside a refusal block with the code `skp.project_open_elsewhere`. After the first window has opened the other file, the second window's try opens the project; record how many tries it took. If the second window does not start, record that and run nothing else in this row. **Felt:** is it clear where the project is open? **Strings for sight (P6):** that line. |
````

Add after AD1's log row:

````
- **AD2 (the picker; the button and Cancel while it opened; the line about changed data; whether the app looked frozen; felt):**
- **AD3 (which outcome; whether Cancel waited for the file; felt):**
- **AD4 (the question and its choices; what each choice did; the copy's `project` value against the first folder's; whether the second open asked; felt):**
- **AD5 (whether the second window started; the refusal and its line; the tries it took after the first window opened the other file; felt):**
````

**The rest**

21. **The comments.** Each new item carries a comment in the shape of item 68's, as the drafter gives it, naming this ruling. Item 62's comment loses its line cites and names symbols. The clauses added to the comments of items 4 and 10 say which sentences are the advisor's, under the delegation of 2026-11-13 and this ruling; item 4's says that they replace a sentence the human approved, which the reopen made untrue. The symbol lists are the applier's, from the drafter's (f) and from what I read above, with no line numbers. The reviewer reads the comments' clauses too.

22. **The reviewer** reads every clause of items 8 to 20 against the code at P5's head, and the parts I did not read first. A clause it finds untrue comes to me unreworded. It also checks that the shell's format check and tests pass with item 19's string.

23. **Size.** Four files, within the five-line form's bounds by the drafter's count less one line. The form's Out-of-scope line says the wire is not touched, which is true with R8 out.

24. **Recorded on the 1c form:** R8 carried (item 3); R11 carried to P6 (item 7); the drafter's correction of the locator, S4-LOCK is ADV-2026-11-20-05 item 5.

25. Nothing here is reserved.
