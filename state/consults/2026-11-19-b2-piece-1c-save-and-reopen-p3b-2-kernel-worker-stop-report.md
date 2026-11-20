*Filed by the custodian: the worker-high's first hand-back (claude-opus-5-5), 6651 bytes, sha256 dccfa0dcea671b82ae4b25bcc2017fe51a03172f9d4b71941ff9404c8584a471, below the rule, byte for byte but for one scratch-folder path as <S>, with one final newline added. Calls Read 30, Bash 21, SubagentHandback 1, 0 errored, from 2026-11-19T21:11:17Z to 2026-11-19T21:17:59Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P3b-2 kernel, worker-high

**STOPPED at step 0, before any code, on stop 3. A second finding under stop 10 needs a ruling too.** I wrote nothing, committed nothing and pushed nothing. The worktree `C:/dev/wt/1c-p3b-2` is at 65c4739a3055cb0544b2048e70d1816ba4ae2543 and `git status --porcelain` is empty. I ran no holds and no cargo commands, and no background process is left running.

**Stop 3 (Amendment 43 item 15, as Amendment 45 item 5 bounds it).**
- P-8 (i) is ruled (ADV-2026-11-19-23 items 2 and 8). Amendment 45 item 2 (b) names `rule` of `project_machine_record_refused` "in the save's `skp_error_of`". The first worker's SKP-V0.md §8 `skp/0.14` entry on the branch already says a save's machine-store refusal is now `skp.project_machine_record_refused`.
- So `skp_error_of`'s `SaveFailure::MachineRecordRefused` arm must change from `project_file_refused(r.file, ..)` to `project_machine_record_refused`.
- The existing unit test `each_save_failure_maps_to_its_own_code_with_the_kernels_text` (U-P1, in the `tests` module of `kernel/src/project/mod.rs`) pins the old code and field. At branch commit 65c4739a these are lines 1153-1159, the case expecting `"skp.project_file_refused"`, and lines 1180-1185, which assert `refused.fields["path"] == "folders.json"`. `fields` is a `BTreeMap`, so a missing `path` key panics.
- The test therefore needs an edit beyond the literal. Amendment 45 item 5 allows test edits only in `store.rs`, `file.rs` and `strict_json.rs`, and only for old texts, so this edit is "any other edit". This needs a ruling: edit U-P1's two places to the new code and the field `file`, or something else.

**Stop 10 as restated (Amendment 45 item 2 (d)), read literally.** Three reply members carry text from a file the kernel did not write. Item 2 (b) does not put the helper on them, and item 2 (e) does not except them:
- `opened.workspace`: the filter, clause texts and style values from `project.spatial`, each up to 4,096 bytes. Control characters can arrive through `\u` escapes, because `strict_json::Parser::string` refuses only raw ones.
- `opened.view.basis`: `view_state` puts in the file's `view.crs.identifier`, which `file::space` checks only for being non-empty (up to 4,096 bytes, control characters possible).
- `not_found.file_name`: the last name of a path read from `locations.json`, up to 4,096 bytes, control characters possible.

I did not choose a treatment. The helper would cut the workspace and the file name, and could cut a `basis` built from long identifiers.

**Step 0's list** (the helper named is Amendment 45 item 2's):
- **Reopen, refusals.**
  - `FileRefused`, from `read_project`, and from `write_project` in the copy arm: `path` and `rule` of `project_file_refused`. Both repeat keys, number tokens (100,000+ bytes) and values (4,096 bytes). The helper covers them.
  - `MachineRecordRefused`, from `KnownFolders::from_bytes`, `read_locations`, `to_bytes` and `locations_to_bytes`: `rule`. The readers repeat keys and tokens; after A1 the writers repeat no path. The helper covers them. `file` is a fixed name.
  - `TargetRefused`: `segment` comes from the file's `at` and is covered. `locator` is built by the kernel.
  - `ProjectFileUnreadable`, `MachineStore` and `ProjectFileUnwritable`: OS error text and fixed names, no file bytes.
  - `FolderUnresolvable`: the request's own string.
  - `PathNotUnicode`: no field.
  - The two exceptions of item 2 (e): the engine message through `Open(e)`; and the identity in `KnownFoldersFull`, `OpenElsewhere` and O3's `found`, which is read from a file and validated by `ProjectUri::from_str`.
  - `asks` reads the first folder's `project.spatial` but returns only a bool.
- **Reopen, replies.** The three members under stop 10 above. `check`, `lineage` and the `question` kind are closed words and numbers.
- **Save.**
  - `FileRefused`, from `read_project(&there)` at a later save: `path` and `rule`, covered.
  - `MachineRecordRefused`: writers only, so after A1 it repeats no file bytes; the helper is applied anyway.
  - `Bind`: the `RefBuildError` Debug text, kernel values.
  - `FolderHoldsProject`: the request's folder.
  - O3's `found`: the identity exception.
  - The reply holds the identity and closed values.

**The `saved` mutex.** `open_project` can wait on it in two places:
- `self.release_ended()` at its step 3, which takes `saved` before the catalog. It waits for a `Projects::save` in flight (the save holds the mutex through its writes, up to 5 rename tries of 100 ms, and the history moves), another `release_ended`, or another reopen's push.
- The final `self.saved.lock()` before `saved.push`.

Nothing that holds the catalog takes `saved`, so the lock order holds. So the binding must run on `spawn_blocking`, as Amendment 49 item 3 says.

**Everything else in the report's shape:**
- Commits, pushed head, P-base, P-head, mutations, counts, the lock-file check, `pub` items added, copied texts, edited tests, doc sentences: none. Nothing was built.
- Items 8, 9 and 13 and Amendment 49 item 4 (a): not checked at a head, since none was built.
- Holds: none.

**Read for the resume, with no action taken:**
- I read "make the `OpenFailure` arm equal to the fence line" as the whole line. On that reading, `MachineStore`'s `Display` gains the `project_machine_store_failed` head, `FileRefused`'s gains the new `project_file_refused` head, `OpenElsewhere` becomes "{project} is already open", and `PathNotUnicode` becomes the no-path line.
- No kernel test under `kernel/tests/` pins any of these texts or `stored_path`'s texts; U-P1 is the only existing test that needs an edit.
- Amendment 49 item 4 (c): `open_project` can be added to the module doc's first bullet (the SKP v0 command list) without editing the "This file contains no logic" sentence.
- The brief's "read only" list did not include the architect's packet. I read its P-8 entry (`state/consults/2026-11-19-b2-piece-1c-save-and-reopen-amendment-43-p3b-declaration-architect.md`) to confirm what P-8 (i) means.

**Pre-gate self-check:** nothing was built, so none of the four classes has code to check. Every claim above is a reading of code at 65c4739a or of the filed rulings.

**Model:** claude-opus-5-5 (Opus 5.5), as the harness reports. No override by me. No context handoff received or produced.

Scratch files, from read-only commands: `<S>/1cp3b2b-start.txt`, `1cp3b2b-wire-stat.txt`, `1cp3b2b-wire-diff.txt`, `1cp3b2b-wire-skpmd.txt` and `1cp3b2b-end-status.txt`, all in that same folder.
