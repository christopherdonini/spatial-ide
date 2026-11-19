*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 21390 bytes, sha256 d065a220ae133052f3194f498f08a69562bd21fcd74927c20b4b47e35df39c36, below the rule with one final newline added, the scratch folder's path written <S>/ (1); calls Read 21, Grep 21, 1 of them errored, from 2026-11-19T01:30:11Z to 01:41:32Z. A draft, read only, at main 85250a8d and the branch head 2519aef1; nothing in it is ruled by its filing, and the advisor rules it, with its packet P-10, before P3a-1's code goes on. Its six Old blocks were checked by the custodian's script against their files at 2519aef1 by git show: each occurs exactly once.*

---

Draft, not a gate verdict. The branch I read is cut/b2-piece-1c-p3a-1 @ 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1, and the form is read at main 85250a8d95b788e4f1e84ba8f0fff39f0fd5b0c1. Two doc sentences at the head claim a limit the code does not support, which is Correctness-class under the proportional-gates rule. The draft fixes both with words (items 4 and 5 below; notes, item 7).

---

## Amendment 37 — P3a-1's stop at its head, written after the result was seen (class 1): K-S13's expected list gains `open.lock`, and `mod.rs`'s module doc is corrected, a scope addition (class 9) on ADV-2026-11-16-16 item 3; K-O24 on every platform (packet P-10); `Projects::save`'s doc corrected; the worker's departures; the next steps

*Drafted by the architect for the custodian, read only, at main 85250a8d95b788e4f1e84ba8f0fff39f0fd5b0c1 and at the branch head 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1, and appended by the custodian's script. References only. Each Old block is code text the architect copied byte for byte from its own Read of the named file at 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1, not by script. Before appending, the custodian's script checks that each Old block occurs exactly once in that file at that commit. Nothing else below is a quotation. Code is cited by path and symbol. Each choice is the custodian's declaration. Where it is the architect's recommendation, it says so.*

1. **The stop.**
   - The worker-high ran from 2026-11-19T00:53:47Z to 01:27:38Z, by its transcript.
   - The branch is `cut/b2-piece-1c-p3a-1`, base 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d. It has three commits: 077fe26bc26672336895224b91b675f4b87d1381, ef6d65942e5b3013319fcdc9c74eea0cbbefa2a2 and 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1. The pushed head is 2519aef1 and there is no pull request. The worker's report is filed by the custodian.
   - **P-base** at ef6d6594, exit 101:
     - K-O17 failed at its reply assertion, with `Ok(Some("taken"))` against `Ok(Some("held"))`, as predicted.
     - K-O24 passed. It is exempt by name.
     - Every existing test passed.
   - **P-head** at 2519aef1, exit 101. One test failed: K-S13, `the_first_save_records_its_folder_as_first_in_folders_json`, at its last assertion. The identity's folder holds `open.lock` beside its two documents, because `store::ProjectLock::try_lock` creates `store::OPEN_LOCK` under `store::record_dir`.
   - This is item 12's stop 3: an existing test needs an edit.
   - Stop 4 also waits at the mutation step. K-O24 returns at once on Windows, so its mutation cannot fail it on the laptop. The worker's probe found that a Windows folder with the ReadOnly attribute still takes a new file. Its output is evidence and is filed with the worker's report.
   - No mutation was observed, and §2.11's command was not run.

2. **K-S13** (scope addition, class 9, on ADV-2026-11-16-16 item 3, the lock at a first save; Amendment 36 item 15's first row). This is an edit to an existing test, declared before the edit.
   - The expected list gains `open.lock`.
   - The message "no temp file is left" stays true: the comparison is exact, so it still excludes every temp name. But it would name the wrong cause when the lock is missing, so it changes too.
   - `kernel/tests/project_save.rs`, K-S13. Old:
     ```
         assert_eq!(
             file_names(&record),
             ["folders.json", "locations.json"],
             "no temp file is left"
         );
     ```
     New:
     ```
         assert_eq!(
             file_names(&record),
             ["folders.json", "locations.json", "open.lock"],
             "the two documents and the lock, and no temp file"
         );
     ```
   - Cost: 2 lines added and 2 deleted.
   - **Mutation owed.** K-O17's mutation ("no lock taken at a first save") is applied once. Both of these are recorded by name from that one application:
     - K-O17 fails at its reply assertion;
     - K-S13 fails at its last assertion.
   - K-S13's own recorded mutation is unchanged.

3. **K-O24** (packet P-10, for the advisor).
   - **Reading `Projects::save`'s order at the head:** no set-up built from std alone fails after `store::ProjectLock::try_lock` on every platform.
     - `std::fs::create_dir_all` of the identity's folder cannot fail, because `try_lock` has just made that folder.
     - The two `write_machine_file` calls write into a folder named by an identity that is minted inside the save, so a test cannot place anything there beforehand.
     - `store::replace`'s target is refused before the lock if anything exists there (the first-save `symlink_metadata` check, `SaveFailure::FolderHoldsProject`).
     - The temp name of `store::stage` is random.
     - Two other routes were set aside: a thread racing the save is not deterministic (stop 6's standard), and path-length bounds differ by platform, with T14's 4,096-byte bound refusing first on Windows.
   - **The options:**
     - **(i)** K-O24 stays off Windows. Its mutation is observed on CI: the mutation is committed on a scratch branch that is never merged and pushed in its own call, and Ubuntu's and macOS's Rust workspace runs show K-O24 failing at its last assertion. The run ids and the commit are recorded, and the mutation is then reverted.
       - Cost: no lines (`project_save.rs` 117 of 130 with item 2).
       - Item 13's laptop mutation line is superseded for K-O24.
       - Windows, the shipped build's platform, stays unproven by any test.
     - **(ii)** The same assertions on every platform. Off Windows the folder is made read only, as now. On Windows, `icacls` adds an entry that denies Everyone (`S-1-1-0`) the right to add a file (`WD`) to the folder, and removes it after the save.
       - Cost: about 10 net lines (`project_save.rs` about 127 of 130; an overrun would be class 8 at the closing).
       - This uses a system tool from test code, with no crate, no `cfg` and no lock-file change.
       - It needs a probe first, because no prior art is recorded (the reuse index).
       - The mutation is observed on the laptop, as item 13 asks.
     - **(iii)** The mutation is recorded as not observed on the laptop.
       - Cost: no lines.
       - K-O24 would then have no observed failure anywhere, which leaves its stop-4 exemption (Amendment 36 item 6 (b)) without its basis. That is an Evidence gap at the gate.
   - **Recommended:** (ii), with (i) as the declared fallback if the probe fails. Not (iii).
   - **Under (ii)**, `kernel/tests/project_save.rs`, K-O24. Old A:
     ```
     /// **K-O24**, off Windows only, checked at run time; it prints the operating system it ran on. A
     /// first save into a folder this test made read only is refused when it stages the project file,
     /// which comes after the lock, and `ProjectLock::try_lock` on the identity then succeeds: the
     /// refused save freed its lock. On Windows a folder marked read only still takes a new file, so the
     /// case is not built there: the test returns at once and proves nothing.
     ///
     /// RECORDED MUTATION: the lock kept with the saved entry on a failed save. Expected failure (off
     /// Windows): the lock is refused as held, and this test fails at its last assertion.
     #[test]
     fn a_first_save_refused_after_the_lock_leaves_it_free() {
         println!("K-O24 runs on {}", std::env::consts::OS);
         if std::env::consts::OS == "windows" {
             return;
         }
         let rig = rig("ko24");
     ```
     New A:
     ```
     /// **K-O24**: a first save into a folder this test made refuse a new file is refused when it
     /// stages the project file, which comes after the lock, and `ProjectLock::try_lock` on the
     /// identity then succeeds: the refused save freed its lock. Off Windows the folder is made read
     /// only. On Windows, where a folder marked read only still takes a new file, `icacls` adds an
     /// entry denying Everyone (`S-1-1-0`) the right to add a file to it, and removes that entry after
     /// the save.
     ///
     /// RECORDED MUTATION: the lock kept with the saved entry on a failed save. Expected failure: the
     /// lock is refused as held, and this test fails at its last assertion.
     #[test]
     fn a_first_save_refused_after_the_lock_leaves_it_free() {
         let rig = rig("ko24");
     ```
     Old B:
     ```
         let folder = rig.folder.as_path();
         let before = std::fs::metadata(folder).expect("folder").permissions();
         let mut read_only = before.clone();
         read_only.set_readonly(true);
         std::fs::set_permissions(folder, read_only).expect("the folder made read only");
         let ws = workspace(&ds, None, -4.5);
         let result = rig.projects.save(handle.as_str(), &ds, Some(folder), ws);
         std::fs::set_permissions(folder, before).expect("the folder's permissions restored");
     ```
     New B:
     ```
         let folder = rig.folder.as_path();
         let before = std::fs::metadata(folder).expect("folder").permissions();
         let mut read_only = before.clone();
         read_only.set_readonly(true);
         let windows = std::env::consts::OS == "windows";
         let icacls = |args: [&str; 2]| {
             let status = Command::new("icacls").arg(folder).args(args).status();
             assert!(status.is_ok_and(|s| s.success()), "icacls {args:?}");
         };
         if windows {
             icacls(["/deny", "*S-1-1-0:(WD)"]);
         } else {
             std::fs::set_permissions(folder, read_only).expect("the folder made read only");
         }
         let ws = workspace(&ds, None, -4.5);
         let result = rig.projects.save(handle.as_str(), &ds, Some(folder), ws);
         if windows {
             icacls(["/remove:d", "*S-1-1-0"]);
         } else {
             std::fs::set_permissions(folder, before).expect("the folder's permissions restored");
         }
     ```
     - The rest of K-O24 is unchanged.
     - The mutation stays as declared, and it is now expected to fail on every platform.
     - At base, K-O24 still passes (no lock is taken), so it stays exempt by name from stop 4.
     - A deny entry left by a failed run does not stop the rig from removing the folder on the next run.

4. **`mod.rs`'s module doc** (scope addition, class 9, on ADV-2026-11-16-16 item 3). Its `Projects::save` bullet lists the save's order without the lock. Its sentence on handles is untrue at the head, because `SavedProject::_lock` holds a handle on `open.lock`.
   - `kernel/src/project/mod.rs`, module doc. Old:
     ```
     //! - [`Projects::save`]: the save, in order: the checks that can refuse it, the judgment, the
     //!   document, the machine store's files, the atomic replace of `project.spatial`, and last the
     //!   history's two moves (binding the open to the project, which moves the open's own record under
     //!   the project if it has one, and the `saved-here` mark in the project's record).
     ```
     New:
     ```
     //! - [`Projects::save`]: the save, in order: the checks that can refuse it, the judgment, the
     //!   document, the machine store's documents built, at a first save the identity's open lock
     //!   ([`store::ProjectLock`]), the machine store's documents written, the atomic replace of
     //!   `project.spatial`, and last the history's two moves (binding the open to the project, which
     //!   moves the open's own record under the project if it has one, and the `saved-here` mark in the
     //!   project's record).
     ```
     Old:
     ```
     //! Nothing here holds a handle. The only files written in a project folder are `project.spatial`
     //! and the temporary file that [`store`]'s atomic replace renames over it.
     ```
     New:
     ```
     //! No handle is held in a project folder. [`Projects`] holds one on `open.lock` in the machine
     //! store for each identity it saved first, until it is dropped. The only files written in a
     //! project folder are `project.spatial` and the temporary file that [`store`]'s atomic replace
     //! renames over it.
     ```
   - Cost: 10 + 6 lines.
   - Neither sentence is the human's wording.

5. **`Projects::save`'s doc** (within Amendment 36 item 6 (a)). "which [`Projects`] holds until it is dropped" does not hold for a first save refused after the lock: the `lock` local is dropped at each `?` that follows `try_lock`.
   - Old:
     ```
         ///   lock ([`store::ProjectLock`]), which [`Projects`] holds until it is dropped. The save then
         ///   writes `locations.json`, and `folders.json` at a first save, and replaces
         ///   `project.spatial` whole or not at all.
     ```
     New:
     ```
         ///   lock ([`store::ProjectLock`]). The save then writes `locations.json`, and `folders.json`
         ///   at a first save, and replaces `project.spatial` whole or not at all. A first save that
         ///   replaces it keeps the lock in [`Projects`] until that is dropped; one refused after the
         ///   lock frees it.
     ```
   - This is a worker's sentence, not the human's.
   - `mod.rs` comes to about 58 of 60 with item 4.

6. **The worker's departures** (class 1, disclosed). The record keeps the following.
   - **(a)** The first two pushes ran inside compound calls. The record keeps that the head equals origin, that the porcelain is empty, and that the diff names only item 6 (a)'s three files; the reviewer rechecks the file list.
   - **(b)** `--no-fail-fast` was added, and `--lib` ran whole rather than `--lib project`. The runs were widened, not narrowed. P-base 1 at 077fe26b stopped after `project_save`, so P-base is the run at ef6d6594. From here on, the declared commands carry `--no-fail-fast`. The record names the one ignored lib test from the run's log.
   - **(c)** `Clone` is no longer derived on `SavedProject`, because a `File` is not `Clone`. `SavedProject` is private, and every use is in `kernel/src/project/mod.rs`. `Projects::save`'s lookup now clones the three fields it reads. Behaviour and `pub` items are unchanged.
   - **(d)** ef6d6594 fixes K-O17's own new test (how it finds the child's line), after a P-base failure with the wrong cause (`Ok(None)`) and before the predicted failure was seen. It is not I3, as with Amendment 33 item 3's fix commit. The reviewer confirms that it changes no assertion.
   - **(e)** The branch's CI on push is red at 2519aef1 from K-S13. The closing amendment names each red run on the branch with its commit and its cause.

7. **What the worker does next**, once this amendment is on main. Item 12's stops stand, with one addition: the probe in step (1) shows anything other than both of its results.
   1. **Under (ii) only: the probe.** In a scratch folder outside the repository, with no repository file:
      - `icacls <folder> /deny *S-1-1-0:(WD)`, then a new file is refused;
      - `icacls <folder> /remove:d *S-1-1-0`, then a new file is taken.
      The output goes into the report, copied byte for byte. If the probe shows anything else, the worker stops, and (i) applies as declared in item 3.
   2. **Commit `test:`** with item 2's edit and, under (ii), item 3's edit. Only the test file changes.
   3. **Commit `docs:`** with items 4 and 5. Only comment lines change.
   4. **P-head** at that commit, in one hold, with `--no-fail-fast`, over item 13's focused targets and the lib. Every test passes.
   5. **Mutations, by the round-25 rule:** apply, run the named test, record its failure by name with the commit, and revert, checking that the diff is empty after each revert.
      - K-O17's mutation: K-O17 and K-S13 fail, as item 2 says.
      - K-O24's mutation: on the laptop under (ii), or by (i)'s CI route.
      - T14's mutation (b), observed again (Amendment 36 item 6 (b)).
   6. **Counts and checks:**
      - §2.11's command;
      - `git diff --numstat 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d...HEAD` against item 4's ceilings, with any overrun recorded as class 8 at the closing;
      - empty lock-file diffs;
      - no new `pub` item.
   7. **Push** in its own call. The report is the worker's final message.
   - **Then the custodian's steps, as item 13 sets them:** both gates, the reviewer's clippy, one E-SAVE run, and CI.

8. **Superseded index.**
   - Amendment 36 item 6 (a)'s "No existing line changes" (`project_save.rs`) is superseded for K-S13's last assertion (item 2).
   - Item 6 (a)'s regions gain `mod.rs`'s module doc (item 4).
   - Under (ii), item 6 (b)'s K-O24 row ("off Windows, by a run-time check; the folder made read only") is superseded by item 3. Under (i), item 13's laptop mutation line is superseded for K-O24 alone.
   - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

---

**Notes**

1. **Class 9's hook.** Class 9 (`docs/PREREGISTRATION-TEMPLATE.md`, class 9) requires a standing rule, a permanent ruling or a standing directive. I cite ADV-2026-11-16-16 item 3, the lock at a first save, which Amendment 36 item 15 records as class 5. The advisor should confirm that an ADV ruling counts as that hook. This form's practice in Amendments 30, 31 and 36 uses class 9 for anything outside the declared lists.

2. **Step numbers.** The brief's "steps 3 to 5 of item 6" are the worker brief's numbering. Amendment 36 item 6 has no numbered steps, and the worker brief is untracked, so a tracked cite into it would break round 14's untracked-Authority rule. Item 7 of the draft therefore names its steps by content.

3. **Option (ii) is reasoned, not observed.** The step-(1) probe decides it. Three points to confirm:
   - a deny entry applies to an elevated administrator token, since `std` does not open files with backup semantics;
   - `WD` on a folder is the right to add a file;
   - the owner keeps the right to change the folder's permissions, so `/remove:d` works.

4. **A leftover nobody names.** A first save refused after the lock leaves `projects/<hex>/open.lock` behind, and nothing removes it. K-O24 even asserts that one identity folder exists. At main, a refusal after the first write already left an orphaned identity folder. Amendment 36 item 9 names neither. I suggest a "not covered" row in P3a-1's closing amendment. This is a Documentation finding.

5. **The persisted-artifacts inventory.** The module doc of `kernel/tests/no_generation_in_persisted_artifacts.rs` lists the files this tree writes and does not name `open.lock`. The shipped save now creates that file, empty. The test file is outside P3a-1's scope (stop 1), so this goes to P3b or the docs lane. It is a Documentation finding.

6. **Things I could not check.** I could not read the CI runs, the probe log, or any numstat or run output, because I have no Bash. The worker's counts and run results are its claims. The ReadOnly probe log is in the scratchpad, which loses files after about seven days; the custodian should file its output with the worker's report.

7. **Untrue at the head** (cites at 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1):
   - `kernel/src/project/mod.rs:21`: "Nothing here holds a handle." It is untrue. `SavedProject::_lock` (`mod.rs:126-128`) is pushed at `mod.rs:340-349` and held until `Projects` is dropped. The worker's report does not name this sentence. It is a claim of a limit, so Correctness-class; the draft's item 4 gives the words.
   - `kernel/src/project/mod.rs:232-233`: "which [`Projects`] holds until it is dropped". It is untrue for a first save refused after the lock (`mod.rs:328-339`: the `lock` local is dropped at each `?`). The report gives this text as accurate. Correctness-class; the draft's item 5 gives the words.
   - I found nothing else untrue among the report's checkable claims.
     - `project_save.rs:974` is where K-S13's failing assertion starts.
     - `store.rs:239-244` creates `open.lock` under `record_dir`.
     - `SavedProject` is used only in `mod.rs` (lines 116, 119 and 342).
     - The written doc texts the report gives match `mod.rs:126-127, 230-235, 315-317, 543-545` and `store.rs:142-145, 201-207`.
     - `project_save.rs` has 21 tests.
     - The `remove_stale_temps` residual sentence is consistent with `Staged::commit_with` and `remove_stale_temps`.

**Calls made**

- Read:
  - the brief;
  - the worker's report `<S>/p3a1-1.md`;
  - `C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: Amendment 36 whole, Amendment 33, §2.4, §2.7, §7, §8 and §10;
  - `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`, classes 1 to 9;
  - at the head: `C:/dev/wt/1c-p3a-1/kernel/src/project/mod.rs` (the module doc, `Projects`, `SavedProject`, `Projects::save`, `write_machine_file`), `C:/dev/wt/1c-p3a-1/kernel/src/project/store.rs` (`OPEN_LOCK`, `record_dir`, `stage`, `Staged::commit_with`, `replace`, `remove_stale_temps`, `ProjectLock`, `LockRefused`), and `C:/dev/wt/1c-p3a-1/kernel/tests/project_save.rs` (K-S7, the rig, K-S13, T11, T14, K-O17, K-O24).
- Grep:
  - the form's amendment headings and section headings;
  - `SavedProject` across the worktree's `.rs` files, and its derive at main;
  - the machine-store file names across the worktree;
  - `recording.mjs` and `no_generation_in_persisted_artifacts.rs`;
  - "holds a handle" across `kernel/`;
  - the test count in `project_save.rs`.
