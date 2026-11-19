# The advisor's ruling ADV-2026-11-19-26, under the human's delegation of 2026-11-13, not the human's words: P3b-2's strings: P-9's bound met at the wire by one helper, the sixteen messages, the three A1 places, ADR-036 Amendment 4, P3b-2's ceilings restated

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-26.md in the advisory folder, 9090 bytes, sha256 632ce258fc5264fc508c65834203f6c011ee3ba38f8d33259d7095beb905bfd3, last modified at 2026-11-19T15:35:23Z by the file system; the advisor's message naming it received at 2026-11-19T15:35:43.081Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T15:42:45Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-26, to the custodian, 2026-11-19. P3b-2's strings: the one ruling the 1c form's Amendment 43 item 20 asks for, given now so that the cut does not wait for it. On the architect's table filed at 8ed6de02 (`state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-2-strings-table-architect.md`), read whole. Read by me on main for it: `stored_path` in `kernel/src/project/store.rs`; `OpenFailure`'s text and `StepRecorder::reopened`; the constructors in `protocol/skp/src/v0/error.rs` that the table quotes; the binding's two refusals in `frontends/shell/src-tauri/src/commands.rs`; and which files pin the old texts. I ran nothing. The amendment that carries this is yours, from these items, on main before P3b-2's code.

1. **The point before the cut: P-9's bound is met at the wire, not in the reader.** The architect is right that the shared reader, as merged, can repeat far more than 256 bytes of a file, and control characters. The reader's files are not touched.
   - (a) One helper in `kernel/src/project/mod.rs` bounds a text taken from a file the kernel did not write: at most 256 bytes, cut on a character boundary, the cut marked with ` [cut]`; every control character replaced by U+FFFD.
   - (b) It is applied to `path` and `rule` of `project_file_refused`, to `rule` of `project_machine_record_refused`, and to `segment`, in the reopen's map and in the save's (`skp_error_of`), before the constructor builds the message.
   - (c) W-4 gains three cases: a `project.spatial` whose number token is 100,000 digits; one with a control character in a key; one with a word of 4,096 bytes where a closed word is expected. Each asserts that no field and no message holds a control character, and that each bounded field is at most 262 bytes. The mutation: the helper returns its input. Predicted: all three red.
   - (d) Stop 10 then reads: a text from a file the kernel did not write that reaches the wire without the helper.
   - (e) Two exceptions, named. An engine message through `Open(e)` stays unedited (SKP-V0.md §5), as P-11 has it: it can repeat bytes of the data file, or of the claim the project file recorded, and this part sets no bound on it. An identity read from a file is 50 validated bytes and needs no helper.

2. **The messages.** Each line below is the whole format of one message. A worker copies it byte for byte. Where `OpenFailure`'s own text differs from the line, the worker makes that arm equal to it.

````
skp.cancel_key_in_use | cancel key `{key}` already names a live `open_dataset` or `open_project` call
skp.project_file_unreadable | project.spatial cannot be read: {detail}
skp.project_file_refused | the project file's reader refuses it: {path}: {rule}
skp.project_machine_record_refused | {file}: {rule}
skp.project_known_folders_full | {project} remembers {count} folders, and no more can be added
skp.project_open_elsewhere | {project} is already open
skp.project_machine_store_failed | this machine's store for the project could not be used: {detail}
skp.project_target_unresolvable, the folder | {folder} cannot be resolved
skp.project_target_unresolvable, a segment | {locator}: {segment} cannot be resolved
skp.project_target_unresolvable, not canonical | {locator}: not canonical
skp.project_target_unresolvable, the folder at the check | {locator}: the folder cannot be resolved
skp.project_target_unresolvable, not Unicode | the data's path is not valid Unicode
skp.project_target_through_link | {locator}: {segment} is a link
skp.project_target_wrong_kind, a folder expected | {locator}: {segment} is not a folder
skp.project_target_wrong_kind, a file expected | {locator}: {segment} is not a regular file
skp.project_file_names_another_project | the folder's project.spatial names another project, {found}, and was not replaced
````

   What each line answers in the table:
   - Row 3: the key can now be held by a reopen, so the message names both calls. `OpenRegistry`'s doc in `kernel/src/skp.rs` is untrue for a reopen in two clauses; `skp.rs` joins P3b-2's files for those comment lines only, in words the architect's gate gives.
   - Row 7: `detail` is the operating system's error text alone.
   - Row 8 and the reviewer's A1 (i): the head changes for the save and the reopen alike. "would break" was untrue for a file that is read. The new head is true for a file as read and for a document a save or a copy would write, because `write_project` checks the document against the same reader's rules. The data file `v0-error-project_file_refused.json` changes with it, class 1.
   - Row 11: the lock can be held in this process, so "elsewhere" is untrue there. The code's name stays.
   - Rows 12a to 12c: a new code, `skp.project_machine_store_failed`, with the one field `detail`, for the reopen's `MachineStore` failures. `detail` is the file's fixed name, a colon and the error's text, as the arm prints it now. `project_file_unwritable` keeps the save's failures and the copy's `replace` (row 18), where its message is true. This replaces the P-7 note that `MachineStore` stays under `project_file_unwritable`.
   - Row 17: the two unreachable arms take `skp.project_target_unresolvable`, with `locator` alone.
   - Row 19: no field and no path. The form's item 5 (c) said `detail`; this line replaces it.
   - Row 20: the fields are `project`, the open's own identity, and `found`, the identity the file names.
   - The binding with no `Projects`: `skp.project_machine_store_failed`, its `detail` the binding's existing words for it. A join failure: `skp.open_project_panicked`, by the binding's pattern.
   - Rows 1, 2, 6, 9, 10, 13 to 16 and 18: as built.

3. **Two messages stand though a clause of each can be untrue, and are named.**
   - Row 4: an engine refusal at a reopen can say "the caller asserted", where the claim was the project file's. The wire keeps the engine's text. P4's form decides what the shell shows for an engine refusal at a reopen; it does not show that clause bare.
   - Row 5: `skp.unknown_dataset` from the reopen's own check after its open says "or never opened this session". It needs a close of a handle the client has never received, inside one call. Named in the source comment and in the closing; not changed.

4. **The three A1 places** (item 5 (g)).
   - The architect's A1 and the reviewer's A1 (ii), together: `stored_path` takes a noun and prints no path. The noun is `the dataset's path` for `locations.json` and `a folder's path` for `folders.json`. Its three texts:

````
{noun} is {n} bytes, over the ceiling of {max}
{noun} is not absolute
{noun} is not valid Unicode
````

   - The reviewer's A1 (i): the head of item 2's third line.
   - A test inside `store.rs`, `file.rs` or `strict_json.rs` that pins one of the three old texts, or the old head, is edited to the new text and to nothing else. The worker names each in its report. Any other edit of an existing test is stop 3.

5. **ADR-036** (item 11). Appended after Amendment 3, by script, byte for byte, with the date of landing in the slot:

````
## Amendment 4 — piece 1c: the dataset reference identity of a reopened open (b2-piece-1c-save-and-reopen, <date of landing>)

Appended after acceptance, from piece 1c's form (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 43). The words are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-19-26). It completes Amendment 2, item 3, for an open made by a reopen.

1. An open made by reopening a saved project (`Projects::open_project` in `kernel/src/project/mod.rs`) does not keep a dataset reference identity minted for it. Before any step of that open, it takes the identity that the project file's dataset entry carries (`StepRecorder::reopened` in `kernel/src/session_history.rs`). The history's header and each step's `data.dataset` then carry the file's identity, and a save of that open writes the same identity back. This holds after the answer `copy` too: the project's identity is then new, and the dataset's is still the file's. For every other open, Amendment 2, item 3, stands as written.
````

   Both gates check each clause against the code at P3b-2's head. An untrue clause comes to me.

6. **Docs that widen**, in the worker's words, read by both gates: the doc of `project_file_refused` (it now serves the reopen, and no longer the machine store's files); SKP-V0.md §4 item 5's list, which gains `open_project`; the new §12.

7. **P3b-2's ceilings, restated for items 1, 2 and 4:** protocol 455, fixtures 390, literal 190 in at most 22 files, kernel product 285, kernel tests 590, src-tauri 35, records 10; 1,955 in all. Item 20's rows for P3b-2 are superseded by these. Stop 11 of item 20 is met by this ruling once the amendment is on main.

8. **For P4's strings**, which come to me: the shell's own words for each code above; row 4's clause; and how the shell bounds what it shows and logs of an engine message.

9. Nothing here is reserved. The human is told in the digest that these are my words and theirs to overturn.
