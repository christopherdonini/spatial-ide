Built: b2-piece-1c-save-and-reopen P3a-1 (resumed), worker-high (the custodian's filing note, 2026-11-19: the worker-high, model claude-opus-5-5, its resumed run 2026-11-19T02:49:13Z to 02:58:06Z by its transcript, Bash 24, Read 3, Write 4, Edit 1, none errored; 8666 bytes, sha256 c0242ece8344a0be071ff4c1f394d187cadfcf7ef80b9bb8e3cce2479b6e4436; below byte for byte but for the project value of the hold lines as <m> (3), with this note and one final newline)

P3a-1 is done under Amendment 37 with option (ii). The probe gave both required results. P-head at c905c7ea passes with exit 0, K-O24's assertions now run on Windows, every mutation fails its test, and every count is within its ceiling. There were no stops. I ran as Opus 5.5 (claude-opus-5-5, from the harness note), with no override and no context handoff.

**The probe** (in `<S>\1cp3a1-aclprobe`, made with `mkdir -p` in a call of its own; no repository file used, nothing written in the worktree):
- `cmd //c "echo TEMP=%TEMP%& echo TMP=%TMP%"` gave rc 0, `TEMP=<T>` and `TMP=<T>`. `<S>` is `<T>`'s long-name form followed by `\claude\C--dev-spatial-ide\<session>\scratchpad`. `fsutil file queryfileid` gives `File ID is 0x0000000000000000000100000003109f` both for `%TEMP%` and for the long-name path, so they are the same directory, on C:.
- `icacls "<S>\1cp3a1-aclprobe" /deny "*S-1-1-0:(WD)"` gave rc 0:
  ```
  processed file: <S>\1cp3a1-aclprobe
  Successfully processed 1 files; Failed processing 0 files
  ```
- `cmd //c "echo x> <S>\1cp3a1-aclprobe\probe1.txt"` gave rc 1, `Access is denied.`, and the folder stayed empty. **Refused.**
- `icacls "<S>\1cp3a1-aclprobe" /remove:d "*S-1-1-0"` gave rc 0, with the same two lines as above.
- `cmd //c "echo x> <S>\1cp3a1-aclprobe\probe2.txt"` gave rc 0, and the folder now holds `probe2.txt`. **Taken.**
- **The volume (a disclosure).** The brief's env sets `TMP=D:/wt-data/1c-p3a-1`, so in the test runs `std::env::temp_dir()` and the rig's folders are on D:, not on C: where the probe ran. `Get-Volume` shows both C and D as NTFS. The runs below show the deny entry working on D: directly.

**Commits** (base 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d):
- 077fe26bc26672336895224b91b675f4b87d1381 test: K-O17 and K-O24, the lock at a first save, before its code
- ef6d65942e5b3013319fcdc9c74eea0cbbefa2a2 test: K-O17 reads the child's reply wherever libtest prints it
- 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1 feat: the identity's open lock at a first save
- 3bcd02171b887137064b23577150ef8a1e6be744 test: K-S13 names open.lock, and K-O24 runs on every platform
- c905c7ea06cbe9e354c346e3a7777c3a2546bd85 docs: the project module's save order and handle sentence, and when a first save keeps its lock
- Items 2 to 5's New blocks went in by script (`<S>/1cp3a1-apply37.mjs`), byte-copied from the form at 0d6e5705. Each Old block occurred exactly once.
- 3bcd0217 changes only `kernel/tests/project_save.rs`. In c905c7ea, a grep for changed lines that are not comments found none (rc 1).
- Pushed head: c905c7ea, equal to origin. The push was a call of its own. The porcelain is empty.

**P-head at c905c7ea, exit 0** (`--no-fail-fast`, run as one cargo command over the four targets and the whole `--lib`):
- lib: 193 passed, 1 ignored (`permission::audit::normalize::tests::a_posix_backslash_stays_a_name_byte_in_a_profile_root_and_a_destination`).
- project_save: 21 passed, among them K-O17, K-O24, K-S13 and T14.
- project_lock_crash 1, project_save_crash 1, project_store 5.
- No warnings. `cargo fmt --check` gave rc 0.
- **K-O24's platform:** Windows. Its assertions ran there: the log shows icacls's `processed file: D:\wt-data\1c-p3a-1\spatial-ide-project-save-tests\ko24\project` twice, once for the deny and once for the remove. Afterwards no DENY entry was left on that folder.

**Mutations at c905c7ea**, in one hold (`<S>/1cp3a1-mutate2.mjs`). `git diff --quiet` gave rc 0 before the first mutation, after each revert, and at the end.
- **K-O17** (no lock taken at a first save): the lock statement gives `None::<store::ProjectLock>` at a first save, and the closure is renamed `_lock_refused` with a typed argument so it still compiles. Two tests failed, cargo rc 101:
  - K-S13 failed at its last assertion, "the two documents and the lock, and no temp file": left `["folders.json", "locations.json"]`.
  - K-O17 failed at its reply assertion: left `Ok(Some("taken"))`, right `Ok(Some("held"))`.
- **K-O24** (the lock kept with the saved entry on a failed save): the entry, with its lock, is pushed into the saved list when the lock is taken. K-O24 failed at its last assertion, at project_save.rs:1168, with `the refused save freed the lock: Err(Held)`. This was on this laptop, Windows. cargo rc 101.
- **T14 (b)** (the documents built after the first write): the block that builds both documents is moved after the lock and `create_dir_all`, with T14 unedited. T14 failed at "no identity folder" (project_save.rs:1043). cargo rc 101.

**Counts:** §2.11's command over 0c5f85a1...c905c7ea, with the form's present path as its exclude; both columns count:

| File | Added/deleted | Total | Ceiling |
|---|---|---|---|
| `kernel/src/project/mod.rs` | 44/12 | 56 | 60 |
| `kernel/src/project/store.rs` | 8/1 | 9 | 20 |
| `kernel/tests/project_save.rs` | 125/2 | 127 | 130 |

- The groups are kernel product 65 of 80 and kernel tests 127 of 130. Nothing is over, so there is no class 8 row.
- The lock-file `git diff --quiet` gave rc 0.
- No new `pub` item: the grep of `^\+.*\bpub\b` over the diff gave rc 1, and the same pattern matched a positive control.

**Text written at this resumption**, byte-copied from the file (by script from the form):
- K-S13's message: `"the two documents and the lock, and no temp file"`, with `"open.lock"` added to its expected list.
- K-O24's doc (rests on `Projects::save` and on K-O24's icacls and `set_readonly` branches):
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
  ```
- `mod.rs`'s module doc (rests on `Projects::save`'s order, `SavedProject::_lock` and `store::ProjectLock`):
  ```
  //! - [`Projects::save`]: the save, in order: the checks that can refuse it, the judgment, the
  //!   document, the machine store's documents built, at a first save the identity's open lock
  //!   ([`store::ProjectLock`]), the machine store's documents written, the atomic replace of
  //!   `project.spatial`, and last the history's two moves (binding the open to the project, which
  //!   moves the open's own record under the project if it has one, and the `saved-here` mark in the
  //!   project's record).
  ```
  ```
  //! No handle is held in a project folder. [`Projects`] holds one on `open.lock` in the machine
  //! store for each identity it saved first, until it is dropped. The only files written in a
  //! project folder are `project.spatial` and the temporary file that [`store`]'s atomic replace
  //! renames over it.
  ```
- `Projects::save`'s doc (rests on the `lock` local and its drop at each `?`, and on the `if let Some(lock) = lock` push):
  ```
      ///   lock ([`store::ProjectLock`]). The save then writes `locations.json`, and `folders.json`
      ///   at a first save, and replaces `project.spatial` whole or not at all. A first save that
      ///   replaces it keeps the lock in [`Projects`] until that is dropped; one refused after the
      ///   lock frees it.
  ```
- The doc sentences from 2519aef1 stand as my first report gave them, apart from item 5's correction.

**Holds** (masked):
- P-head: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> ...`, then `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`, with no wait.
- Mutations: one `MACHINE_WAITING shared: <m>` line, then `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF ...`, then `MACHINE_RELEASED ...`.
- No exit code from 96 to 99, and no Guardian refusal.

**Not done, departures, stops:**
- P-head again ran the whole `--lib` rather than `--lib project`, so that the hold ran one command. The run was widened, as in Amendment 37 item 6 (b).
- The probe ran on C: (in `<S>`, as you instructed) while the rig runs on D: under the brief's `TMP`. Both are NTFS, and the runs on D: show the deny working there.
- No stop occurred. No process of mine is still running: the tasklist checks for cargo and project_save found none. The scratch files are in `<S>` under `1cp3a1-` names.
