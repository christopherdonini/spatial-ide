Reviewed: PR #307 at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6 (the custodian's filing note, 2026-11-12: gate 1, attempt 2 completed, the architect, before the reviewer, PLAN node b2-piece-1c-save-and-reopen, step 1; over R2 and R3 together by Amendment 22 item 5; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #307 at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6 (base e3fb4a97), gate 1 attempt 2 completed, architect
Verdict: PASS WITH NOTES (WORDS-ONLY)

Branch and commit: `cut/b2-piece-1c-save-and-reopen @ 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6`.

How I worked:
- I have no shell. I cannot show the packet's sha256, I ran no command, I started no shell, and I leave no background shell.
- I read the packet whole with the Read tool. Before anything else I read Part 1 of the 2026-11-05 gate-rounds directive (items 1 to 9), and it governs this report.
- The worktree at C:/dev/wt/b2c is on the branch: `.git/worktrees/b2c/HEAD` names the branch, and the branch's loose ref reads 9e0d4b08. I cannot see uncommitted changes.
- Cites marked `@ 9e0d4b08` are in the worktree. Cites marked `@ 7693001e` are in the main checkout.
- Text in backticks or double quotes is copied from the file cited. Everything else is my own wording, and every suggested replacement text below is mine. None of it is the human's.

## Findings by class

### Correctness (blocking; only words, with my replacement words, so WORDS-ONLY)

**C-6. The draft of KNOWN-LIMITATIONS item 63 states its limit for cases where it does not happen** (`KNOWN-LIMITATIONS.md:506-507 @ 9e0d4b08`). This is R3-2's DRAFT. It is not yet the human's wording, so I give replacement words. The human sees the item at the click after the worker has applied them.
- The rule broken: this is a claim of a limit that the code does not support (the proportional-gates paragraph). Ordinary use can reach the counter-case.
- The counter-case:
  1. Open F. Save to folder 1 before any filter or style change. No record exists, so `adopt_project` does nothing (`kernel/src/session_history.rs:279-281 @ 9e0d4b08`).
  2. Close F. Open F again and change the style. `record_step` creates a new record with `project: None` (`session_history.rs:246-252`, `:414`).
  3. Save to folder 2. `adopt_project` moves that record under B (`:283-293`). `mark_saved_here` finds it held by B (`:318`), so the mark can be `Written` (`:324-335`).
  - So the headline, `A file the app has saved, opened again and saved to another folder, gets a project file and no `saved-here` mark`, is untrue here. So is the body's first sentence, `The first save of an open dataset moves the session history's record for that file under the new project.`: at a first save made before any change, there is no record to move.
- The fix (my words). Keep the item number. Replace the headline with:
  > **A file opened again in the same run and saved to another folder can get a project file and no `saved-here` mark in the session history.**
- Replace the body's first two sentences, from `The first save` up to and including `writes its `project.spatial`.`, with:
  > The session history keeps one record for a file and the claims it was admitted under, from the first filter or style change recorded on it, and a save of an open dataset moves that record under the save's project when no project holds it yet. If a save has moved the record, and that dataset is closed and the same file is opened again in the same run (the same path, admitted under the same claims), and the second open is saved to a folder, the save makes another project and writes its `project.spatial`.
- The rest of the item stays as the worker wrote it.
- The clause check:
  - "can get": true exactly when the condition in the body holds.
  - "one record for a file and the claims it was admitted under": `session_history.rs:243-252` matches records by path and `same_claims` (`:557-567`).
  - "from the first filter or style change recorded on it": `create` has one caller, `record_step` (`:249`). The intents it records are `FilterApply` and `StyleSet` (`:152-171`).
  - "a save ... moves that record ... when no project holds it yet": every save runs `history` (`kernel/src/project/mod.rs:313 @ 9e0d4b08`), which calls `adopt_project` (`mod.rs:358`). `adopt_project` moves the record only when it finds one and `project` is `None` (`session_history.rs:279-293`).
  - "the save makes another project": `saved` is keyed by the catalog name (`mod.rs:244-253`). `open_dataset` mints a new name at each open (`frontends/shell/src-tauri/src/commands.rs:158-160 @ 9e0d4b08`). K-S15 asserts B ≠ A (`kernel/tests/project_save_skp.rs:428`).
  - The worker's remaining sentences hold: `session_history.rs:283-285` and `:318-320`, `mod.rs:340-343`, and K-S15 at `project_save_skp.rs:427-439`.
- A case to name in the item's source comment (an IO failure, not ordinary use): if the record move fails, the save replies `withheld` with `HistoryUnwritable` (`mod.rs:358-360`) and the record stays unheld. The second open's save then moves it.
- I also suggest the comment's code list adds `StepRecorder::record_step` (it creates the record and continues it for every open of the same path and claims).
- **Closure:** the words are applied. The PR body lists them, and they go to the human at the click.

### Evidence (blocking)
None.

### Documentation (must be fixed before the merge; none blocks; none is the human's wording, so the worker applies the words with no re-gate and the PR body lists them)

**D-10. "the first save's record move" is untrue of the code. These were my words (attempt-1 W3, and Amendment 21 item 2).**
- The code moves the record at any save that finds it unheld (`session_history.rs:279-293`). In ordinary use (save, then a change, then save), the move happens at the second save.
- Replacement words (mine):
  - `protocol/skp/SKP-V0.md:1346 @ 9e0d4b08`: replace "the first save's record move, unless another project this run has saved holds the record," with "the record move, when the history holds a record for the file and no project holds it yet,".
  - `kernel/src/project/mod.rs:233-234`: replace "the first save's record move, unless another project of this run holds the record," (the text runs across the `///` break) with the same words.
  - `mod.rs:16`: replace "(the first save's record move and the `saved-here` mark)" with "(the record move, when no project holds the file's record yet, and the `saved-here` mark)".
- The clause check is `session_history.rs:279-293`, and `mod.rs:313,358`.
- Amendment 21 item 2's text for §11.3 is then superseded. The closing amendment's superseded index should name it.

**D-11.** `mod.rs:324-325`: the sentence "The reply carries the identity and whether the history took the mark, and no path." (across the `///` break) leaves out the reply's new member.
- R3's report discloses this.
- Replacement (mine): "The reply carries the identity, whether the history took the mark, and the resolver's judgment ([`ProjectRelativeLocator`]), and no path."
- The clause check is `mod.rs:344-348` and `protocol/skp/src/v0/commands.rs:737-741`. The path is dropped at `mod.rs:383`.

**D-12.** `frontends/shell/e2e/README.md:834 @ 9e0d4b08` says "two empty project folders" and "removes all three". R3-1 added the third project folder, so both counts are now wrong.
- Replacement (mine): "It makes the scratch store and three empty project folders with `mkdtempSync` under the OS temp folder, and removes all four at the end of every run;".
- The clause check is `frontends/shell/e2e/project.mjs:56-59`. `dropFolders` covers four paths (`:88-96`) and runs at `:389,400,408,479`.

**D-13. Drift-sweep finding 1, as it stands at H** (`kernel/tests/no_generation_in_persisted_artifacts.rs`, test text, so class 3 by named exception).
- The "no writer yet" text is gone at H (`:18,42-46`). Two sentences are untrue at H.
- Lines 55-59: "No standalone project-file or recipe-file format exists in this tree at this commit" and "nothing outside the four families and the one exclusion resolves".
  - This piece writes `project.spatial`.
  - The machine store's files are written outside the families: `write_machine_file`, `mod.rs:531-540`, writes `locations.json` at `:289` and `folders.json` at `:300`.
- Replacement for lines 55-59 (mine): "**The project file is this tree's one standalone project-file format** (item 5's second writer), and no recipe-file format exists — grepped, not assumed, against the same four-path scope above (`protocol/skp/src`, not the whole `protocol/*` tree: `protocol/transport-bakeoff/src/main.rs:302,566` write outside `#[cfg(test)]`, but the workspace root `Cargo.toml`'s `exclude` list names that crate). Three more writers are outside the families above: the session record's `locations.json` (`kernel/src/session_history.rs`), which `G2` reads, and the machine store's `locations.json` and `folders.json` (`kernel/src/project/mod.rs`'s `write_machine_file`), which no test here scans."
- Line 795-796: replace "a sixth family" with "the fifth family's first writer". Lines 42-46 name the history as the first of family 5's two writers, and line 913 calls the project file the second.
- The clause check: `G2` reads the session record's `locations.json` at `:865`. A Grep of this file for `folders.json` and `machine` finds nothing.

**D-14.** `mod.rs:163`: "/// The dataset has not been saved, and the request gave no folder."
- Replacement (mine): "/// This open of the dataset has no project to save to, and the request gave no folder."
- The clause check is `mod.rs:244-251` and the `Display` arm at `:190-193`. This is the independent review's documentation item 1.

**D-15.** `mod.rs:21-22`: "The only file written in a project folder is `project.spatial`, and only through [`store`]'s atomic replace."
- Replacement (mine): "The only files written in a project folder are `project.spatial` and the temporary file that [`store`]'s atomic replace renames over it."
- The clause check is `kernel/src/project/store.rs:104-127,136,149`. The only write in `mod.rs` into `folder` is `replace` at `:302`. This is the independent review's documentation item 2.

**D-16. The POSIX case to name, as the wording-blocks rule requires.** The independent review's C1 is confirmed by reading at H. It cannot happen in the shipped Windows app.
- What happens: `Staged::commit` returns the folder sync's error after a successful rename (`store.rs:136-141,161-166`), and `Projects::save` then fails at `mod.rs:302` before `saved.push`.
- On Windows `File::open` of a folder fails, so the sync is skipped (`store.rs:159-164`).
- So "a refusal leaves the previous one in place" (`protocol/skp/src/v0/error.rs:189-190 @ 9e0d4b08`) and "A refusal leaves the previous file in place" (`SKP-V0.md:1346`) hold on Windows. They do not hold on POSIX when the folder flush fails.
- Words for a `//` comment above `error.rs:188` (mine): "// Not on Windows: on POSIX, a failure to flush the folder after the rename (kernel/src/project/store.rs, Staged::commit and sync_folder) is refused with this code after project.spatial was replaced. The shipped app is Windows-only, where a folder is not opened to be flushed."
- Words for an `<!-- -->` comment after the §11.3 bullet in SKP-V0.md: the same words.
- **The code defect is Linux L1's (§2.9), not step 1's on Windows.** I suggest the custodian places it with the Linux port or with step 2's form. One possible fix: a failed folder flush after a successful rename does not refuse the save.

**D-17. Records.**
- Amendment 21 item 5 says that if the steps are appended, a later amendment must say so and the custodian must propose the S3 node.
- My answer by reading (check 6) is that they are appended. The reviewer's observation follows.
- **Closure:** an amendment that records both answers by reference and names `second-open-history-before-1c-step-3` (`governance/PLAN.yaml:5571 @ 7693001e`) as that node, or proposes S3 apart from it.

### Notes (do not block)
- **K-S15 compares lengths, not bytes** (the packet's flag 1).
  - The claim "A's record is unchanged by B's saves" is supported by three things:
    - the history writer only appends at the end (`session_history.rs:108-117`);
    - a held record leaves `adopt_project` before any copy (`:283-285`);
    - after the drop, `recover` finds a valid chain with one mark (`project_save_skp.rs:441-456`).
  - On Windows, another handle cannot read the locked file (`project_save_skp.rs:8-9`; R3-2's departure 1).
  - Under the declared mutation, the test fails at B's reply, which comes first. No mutation exercises the length assertion itself. See "For the human".
- **`Projects::history`'s private doc** (flag 2, `mod.rs:351-353`) is true of `:358-372`. Item 1 asks for the sentences the change made untrue to be brought current, and this is one of them. Not a finding.
- **Five Edits errored** (flag 5). They leave no trace in the bytes. Not a finding.
- **SH-9's mock** returns untyped strings through the `invoke` mock (`saveProject.test.ts:103-107`). The real client and saver run, and the existing mock at `:55` has the same shape. This touches Part 1 item 7's first clause; it is style only.
- **E1, from the independent review, holds at H.** No kernel test asserts `withheld` for a save with no step (Grep of `kernel/tests`: the only `Withheld` assertions are `WorkspaceDiffers` and K-S15's).
  - The behaviour is observed through the real shape: the m-s18 run's output lists S5 for INSIDE-SAVE's save, which had no step (R3's report). That is evidence, not Authority.
  - No §4 row requires the assertion. One assertion in K-S14 or NOTICE-S18 would close the gap cheaply.
- **E2, from the independent review, holds at H.** No test covers the later save over a file the reader refuses (`mod.rs:266-271`), or the machine store write failures (`:286-300`). No §4 row requires one. Note.
- **C2, from the independent review, holds at H** (`session_history.rs:279-281`). Nothing in step 1 consumes it; step 3's recovery does. ADR-036 Amendment 1 item 5 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:272 @ 9e0d4b08`) names the move "At a project's first save" and does not address a save made before any step. See "For the human".
- **The independent review's other notes, at H.** Each is an observation for step 2 or step 3. None is a step-1 defect on Windows in ordinary use:
  - two dataset URIs;
  - a foreign project file overwritten at a later save;
  - `remove_stale_temps` across processes;
  - `to_bytes` unbounded against the 4,096-byte string limit `from_bytes` enforces.
- **Readiness (Part 1 item 4).** I name this; it is not a finding.
  - The last `npm run verify` ran at 190c6c80, and R3-2's seven files include nothing under `frontends/`.
  - E-SAVE ran at c57f090b.
  - Amendment 22 item 5 puts the suites at the final head after both gates.

## Checks 1 to 9

**1. §8 over 791e7e9e...9e0d4b08.** R2's 14 files are as attempt 2 read them (my attempt-2 report, check 4). Against R3's 18 files:
- Item 1: the file's locators are unchanged. NOTICE-S18 asserts `machine-recorded` alone (`project.mjs:372-374`). No path crosses (`mod.rs:381-389`).
- Items 2 to 7: R3 touches no resolver check at reopen, no replace, no lock, no question and no lineage. R3's numstat has no `docs/adr/` file.
- Item 8: R3 adds no kernel message. S18 is the owner's own consequence (`saveProject.ts:29-31`).
- Item 9: check 3.
- Item 10: the only `cfg` is in the test file (`project_save_skp.rs:284,296`). R3-2's report says no lockfile changed; the reviewer runs the lock diffs.
- Item 11: none.
- Item 12: the overruns are class 8 (Amendments 23 and 25), and the scope additions are class 9 (Amendments 20 and 21 item 4). Whether Amendments 20 to 22 reached main before c57f090b is the reviewer's to check with git. No `verify-mutation` run is called an observation. Branch code is named without a hash (the Amendment 20 and 21 headers, and the item 63 comment). The form is the full form.
- Item 13: Amendments 20 to 25 each say they hold no quotation. The pins at c1aea32a are not read as current. There is no ledger line cite.
- Items 14 and 15: the `ProjectRelativeLocator` doc says "as the kernel judged it at this save". Nothing claims containment beyond that.

**2. The seam rule.**
- **Shell → `save_project` → `judge`.**
  - The wire value is a closed kebab-case enum (`commands.rs:764-771`). It is mirrored as the TypeScript union (`frontends/shell/src/skp/types.ts:353,360`).
  - The conformance fixture carries `no-canonical-spelling` (`responses-accept.json:122`).
  - E-SAVE's three steps run the real app, binding and kernel. The driver reads S18 from the constant by its name (`project.mjs:358-363`) and asserts the notice and the file (`:366-375`). m-s18 was observed failing at NOTICE-S18 (R3's report).
  - K-S14 runs from `SkpHost::open_dataset` through `save_project` (`project_save_skp.rs:303-369`).
- **History → mark.**
  - `mark_saved_here(ds, project, differs)` (`session_history.rs:308-336`) is consumed by `Projects::history` with its real signature (`mod.rs:361-374`).
  - K-S15 runs through the real `open_dataset`, `close_dataset`, `record_step` and `save_project` (`project_save_skp.rs:382-457`).
- Neither seam rests on an imagined interface.

**3. The caller rule.**
- `Carried`: `project_relative_of` matches on it (`mod.rs:381-389`). `Projects::save_project` calls that at `:347`. The binding's `save_project` (`src-tauri/src/commands.rs:171`) calls `save_project`, and it is registered at `src-tauri/src/lib.rs:557`. The shell's `saveProject` (`skp/client.ts:153-154`) reaches it from `createProjectSaver().save` (`saveProject.ts:108`), which App wires at `App.tsx:875-883`.
- `Why`: the same match's three arms (`mod.rs:384-388`).
- `Saved::carried`: written at `mod.rs:317` and read at `:347`.
- The new variants: `SavedHere::HeldByAnotherProject` is returned at `session_history.rs:319` and matched at `mod.rs:370-372`.
- The reply member is consumed at `saveProject.ts:113`.

**4. The words, clause by clause.**
- **Amendment 20 item 3.**
  - The `ProjectRelativeLocator` doc (`commands.rs:756-763`) matches `judge` (`kernel/src/project/resolver.rs:63-95`) and the `Why` docs (`:33-43`):
    - `outside`: `:68-73`;
    - `no-canonical-spelling`: `:74-87`;
    - `through-link`: `:88-90` and `:101-119`;
    - `machine-recorded` alone: `:64-67`.
  - The `SaveProjectResponse` sentence is at `:733-734`.
  - SKP-V0 §11.2 is at `:1324,1333,1341`, and §8's skp/0.13 entry at `:1140,1144`. All of these hold.
- **Amendment 21 item 2.**
  - The `HistoryMarkState` doc (`commands.rs:743-747`) and §11.2 (`SKP-V0.md:1340`) hold against `mod.rs:354-374` and `session_history.rs:314-335`.
  - §11.3 (`:1346`) holds except for "the first save's record move" (D-10).
- **Amendment 21 item 1's six sentences** hold at `mod.rs:14-17,231-236,153-155` and `session_history.rs:184-186,300-307`, except mod.rs's first-save wording (D-10).
- **Item 63:** C-6.

**5. The OPEN answers as applied.**
- **OPEN-20-1 (a): yes.** S18 shows only for `no-canonical-spelling` (`saveProject.ts:113`). SH-9 asserts that `carried`, `outside` and `through-link` show none (`saveProject.test.ts:119-122`). No through-link notice exists in the shell (Grep).
- **OPEN-21-1 (b): yes.** The check runs at every save, before anything is written (`session_history.rs:318-320`). `rec.project` never goes back to `None` (only `adopt_project` sets it, at `:293`). K-S15 asserts that the second save is `withheld` (`project_save_skp.rs:431-439`).
- **OPEN-21-3 (a): yes.** No ADR file is in R3. The node is placed (`governance/PLAN.yaml:5571 @ 7693001e`), and the piece's summary names it (`:5739`).

**6. Amendment 21 item 5, by reading.** The second open's steps are appended to A's record before any save:
- `record_step` matches a record by path and claims only (`session_history.rs:243-252`), and so does `find` (`:423-427`);
- the kernel's `close_dataset` (`kernel/src/skp.rs:1590`) does not reach the recorder: the file's only mention of `session_history` is a doc line at `:1661`;
- the binding's `close_dataset` calls only the host and the pool poll (`src-tauri/src/commands.rs:120-133`).
- R3-2's reading agrees, and it pins nothing in K-S15.
- The observation is the reviewer's. The record is D-17.

**7. The attempt-2 notes closed by R3-3.**
- D-8 / DOC-1: `surfaceRegistry.ts:76` reads "An eighth command changes".
- D-9 / DOC-3: `surfaceCompleteness.test.ts:203,206` read `expectedSeven`.
- DOC-2: `skp/client.ts:56` reads "the seven commands".
- All three are closed as Amendment 22 item 1 says. My other attempt-2 notes stand as notes. Item 62's spans are still pinned at 88a35355, and the comment does not read them as current.

**8. The two readings.**
- The independent review at 190c6c80, its items read at H:
  - C1 → D-16 (documentation, plus a placement for the code defect);
  - C2 → a note, and "For the human";
  - E1 and E2 → notes;
  - its documentation items 1 and 2 → D-14 and D-15;
  - its documentation item 3 → D-16;
  - its notes → the notes above.
- The drift sweep's finding 1 → D-13 (partly closed at H).

**9. The records and the scope.**
- The classes are right: Amendment 22 class 1; Amendment 23 class 1 and class 8; Amendment 24 class 5; Amendment 25 class 1 and class 8.
- All 18 of R3's numstat files are in Amendment 22 item 2's list of 18.
- D-13, D-14, D-15 and D-16 touch three files outside that list: `no_generation_in_persisted_artifacts.rs`, `error.rs`, and SKP-V0's comment (SKP-V0.md itself is in the list). Each file is within the step's diff, by the drift sweep for the first. The custodian records the scope.
- Amendment 22 item 9's superseded index is correct as it stands. It gains Amendment 21 item 2's §11.3 text if D-10's words land, and K-S15's "bytes" if the human accepts the length check.

## For the human
- **K-S15's shape.** Your C1 (a) ruling says "A's record bytes are equal before and after B's save". The test compares the record's length while the file is live, because Windows refuses a second handle's read of a locked file. After the drop, it reads the record back with `recover` and checks one mark. You can accept that shape, or ask for another design.
- **Item 63, after the gate's answer.** Its "Not covered" clause leaves out what is now known by reading: the second open's steps append to A's record. You decide whether the item states that at the click.
- **The independent review's C2** (a save before any step leaves later steps in an `unsaved-` record until the next save). ADR-036 Amendment 1 item 5 is silent on that order of events. I propose it joins `second-open-history-before-1c-step-3` or step 3's form. Any ADR text for it is yours.

## The packet's gaps
- R2's numstat was given only by reference to attempt 2's packet.
- I had no means to confirm that the worktree's porcelain is empty at H. I read the branch ref and HEAD only.
- The times at which Amendments 20 to 22 reached main, needed to show the class 9 code came after its declaration.
- The drift sweep's finding 1 was given at 572416aa, with no note that H had changed lines 18 and 42-46.
- There was no pointer to ADR-036 Amendment 1 item 5, which the independent review's C2 rests on.
- There was no pointer to `same_claims` or `close_dataset`, which item 5's reading needs.

Model: Opus 5.5 (claude-opus-5-5).
