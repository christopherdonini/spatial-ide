Built: b2-piece-1c-save-and-reopen P3a-1, worker-high. **STOPPED at step 3 on stop 3 (I3): an existing test needs an edit.** I ran as Opus 5.5 (claude-opus-5-5, from the harness note). There was no model override and no context handoff. (the custodian's filing note, 2026-11-19: the worker-high, model claude-opus-5-5, its run 2026-11-19T00:53:47Z to 01:27:38Z by its transcript, Read 18, Bash 42, Edit 22, Write 4, 6 of them errored; 7755 bytes, sha256 c92870e61e27d445ef8bd3ca0e1c1b8d2e6f6c519126542b073da17fc5e653ac; below byte for byte, with the hold line's project value written <m> (2), with this note and one final newline. The probe log it names, its scratch file 1cp3a1-roprobe.log, is 30 bytes, sha256 2629272a0ab3563318bc1c05d13c2b29915d638ddb678d234b2a07bbcbe74ed1, two lines ending CR LF: ReadOnly, Directory; created)

**The stop.** At the head, the existing test K-S13 `the_first_save_records_its_folder_as_first_in_folders_json` fails at kernel/tests/project_save.rs:974 ("no temp file is left"): left `["folders.json", "locations.json", "open.lock"]`, right `["folders.json", "locations.json"]`. `ProjectLock::try_lock` puts `open.lock` in the identity's folder (store.rs, `OPEN_LOCK` under `record_dir`), so every first save now leaves that file there. Amendment 33 item 9 foresaw the same thing for T14 but not for K-S13. Moving the lock elsewhere would go against P1b's `ProjectLock`, so I did not route around it. The way out is a declared edit of K-S13's expected list or another ruling; that is yours or the advisor's to decide. Steps 4 and 5 were not run.

**A second stop is waiting at step 4 (K-O24).** K-O24 is declared off Windows, so on this laptop it returns at once and its mutation cannot fail its test (stop 4). I checked this with a probe: a folder with the Windows ReadOnly attribute still accepted a new file ("created", scratchpad 1cp3a1-roprobe.log). Its mutation can only be observed off Windows. CI on push does run K-O24 at the head on Ubuntu and macOS, but that is not an observation of the mutation.

**Commits** on `cut/b2-piece-1c-p3a-1`, base 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d:
- 077fe26bc26672336895224b91b675f4b87d1381 test: K-O17 and K-O24, the lock at a first save, before its code
- ef6d65942e5b3013319fcdc9c74eea0cbbefa2a2 test: K-O17 reads the child's reply wherever libtest prints it
- 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1 feat: the identity's open lock at a first save
- Pushed head: 2519aef1, equal to origin. `git status --porcelain` is empty. No PR.

**P-base:**
- **At 077fe26b, exit 101.** K-O17 failed at its assertion with `Ok(None)`, which is a defect in the test, not the predicted reason. libtest prints the child's line after `test <name> ... ` on the same line, so a match at the start of a line never found it. The fix, ef6d6594, is to K-O17's own new test and changes no assertion. This run stopped after project_save, so project_save_crash and project_store did not run.
- **At ef6d6594, exit 101,** with `--no-fail-fast` added:
  - K-O17 failed at its assertion with left `Ok(Some("taken"))`, right `Ok(Some("held"))`. This is the predicted failure.
  - K-O24 passed (it returns at once on Windows), exempt by name.
  - The existing tests all passed: project_save 20 of 21 (only K-O17 failed), project_lock_crash 1, project_save_crash 1, project_store 5.

**P-head at 2519aef1, exit 101** (`--no-fail-fast`, and the whole `--lib` rather than `--lib project`, so that the hold ran one command):
- lib: 193 passed, 1 ignored.
- project_save: 20 passed and 1 failed, the failure being K-S13 above. K-O17 and K-O24 passed. T14 passed unedited.
- project_lock_crash 1, project_save_crash 1, project_store 5.
- 0 warnings. `cargo fmt --check -p spatial-kernel` gave rc 0.

**Mutations:** none observed because of the stop. The script is written but not run: scratchpad 1cp3a1-mutate.mjs. Its anchors were dry-checked: each occurs once, and the file has LF endings.

**Counts:** step 5's command was not run. For information only, `git diff --numstat 0c5f85a1...HEAD` gives mod.rs 34/7 (41 of 60), store.rs 8/1 (9 of 20) and project_save.rs 113/0 (113 of 130). The lock-file check was not run. `git diff | grep "^+.*\bpub\b"` found no new `pub` item.

**Doc and comment text written**, byte-copied from `git diff -U0 0c5f85a1...HEAD -- kernel/src`:
- `SavedProject::_lock` (mod.rs; rests on the push in `Projects::save` and the drop of `Projects`):
  ```
  /// The identity's open lock, taken by the first save. It is held for as long as this entry is,
  /// which is until [`Projects`] is dropped.
  ```
- `Projects::save`'s doc (rests on `Projects::save`: `judge`, `write_project`, `store::locations_to_bytes`, `KnownFolders::to_bytes`, `store::ProjectLock::try_lock`, `write_machine_file`, `replace`):
  ```
  /// - **Every save** judges the locators ([`resolver::judge`]), checks the document against the
  ///   reader's rules, and builds `locations.json`, and `folders.json` at a first save, each
  ///   refused where its reader would refuse it. A first save then takes the identity's open
  ///   lock ([`store::ProjectLock`]), which [`Projects`] holds until it is dropped. The save then
  ///   writes `locations.json`, and `folders.json` at a first save, and replaces
  ///   `project.spatial` whole or not at all.
  ```
- A code comment in `Projects::save` (the `lock_refused` closure and `SaveFailure::MachineStore` with `what: store::OPEN_LOCK`):
  ```
  // A first save takes the identity's open lock after both documents are built, so that a
  // refusal above writes nothing, and before the first write (the form's Amendment 36, item
  // 6 (a)). A lock that cannot be taken refuses the save, naming `open.lock`.
  ```
- `write_machine_file` (mod.rs; rests on its `{name}.tmp-{hex}` from 8 random bytes, and `inspect_err` removing the temp only on an error):
  ```
  /// renamed over the name. A process that ends between the temp file's creation and the rename
  /// leaves `<name>.tmp-<16 hex>` in `dir`, the identity's machine folder, and nothing removes it.
  ```
- `Staged::commit` (store.rs): the link `([`sync_folder`])` is removed. The line now reads `/// and remove the temp files a crash left. Once the rename has succeeded, the`.
- `remove_stale_temps` (store.rs; rests on `is_temp_name`, `Staged::commit_with`, `ProjectLock`, and `Projects::save`'s `symlink_metadata` folder check):
  ```
  /// Remove the temp files a crash left in `folder`, after a successful rename: the files named by
  /// exactly the pattern ([`is_temp_name`]), and nothing else. Not excluded: two first saves of
  /// different identities into one empty folder, between `Projects::save`'s folder check and the
  /// rename. Each holds its own identity's open lock ([`ProjectLock`]), so the one that renames first
  /// can remove the other's temp here, and the other's rename then fails as
  /// [`SaveError::RenameKeepsFailing`]; if the other renames before that removal, its project file
  /// replaces the first one's.
  ```

**Holds** (other values written as <m>): there were three holds, each one command, and all three released.
- P-base 1: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, then `MACHINE_RELEASED`, with no wait.
- P-base 2 and P-head: four `MACHINE_WAITING shared: <m>` lines each, then `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF ... also=<m>`, then `MACHINE_RELEASED`.
- No exit code from 96 to 99.

**Departures and disclosures:**
- (a) The first two pushes ran inside compound calls (`cd && git push > log; echo; cat`, and `sed; git push > log; echo; cat`). The third was a call of its own.
- (b) `--no-fail-fast` was added to P-base 2 and P-head, and P-head ran the whole `--lib`.
- (c) `SavedProject` no longer derives `Clone`, because a `File` is not `Clone`. So `Projects::save`'s lookup now clones the three fields it reads, inside `Projects::save`.
- (d) ef6d6594 is a fix to K-O17's own new test, not an I3 edit.
- (e) I pushed the head that hit the stop, so CI on push will show K-S13 red, as well as K-O24 off Windows.

**Noticed and not done:** mod.rs's module doc (its `Projects::save` bullet) lists the save's order without the lock. It is outside item 6 (a), so I left it.

No background process of mine is still running: the tasklist checks for cargo and project_save found none.
