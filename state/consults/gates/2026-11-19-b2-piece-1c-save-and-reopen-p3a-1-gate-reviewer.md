Reviewed: PR #334 at c905c7ea06cbe9e354c346e3a7777c3a2546bd85 (the custodian's filing note, 2026-11-19: the reviewer, one of PR 334's two gates under its form's Amendment 36 item 13; Bash 80, Read 10, none errored, model claude-opus-5-5, from 2026-11-19T03:34:23Z to 03:52:06Z; its departures (a supplementary mutation (d), the test names passed after `-- --exact`, and a first probe call that Git Bash's path conversion turned into an invalid parameter, run again with that conversion off) are in its own checks 6 and 7; the report below byte for byte from its hand-back of 28524 bytes, sha256 27094ed62d0214c5058dff12d65720b38b408b0322ff5dc8b24f7c5f4ef87154, but for the scratch folder written <S> (1), with this note in its first line and one final newline), gate, reviewer
Branch and commit: cut/b2-piece-1c-p3a-1 @ c905c7ea06cbe9e354c346e3a7777c3a2546bd85
Verdict: PASS WITH NOTES

The notes are WORDS-ONLY (the human's 2026-11-05 Part 1, item 2). I found no Correctness or Evidence finding. Two Documentation findings must be fixed before the merge (D1, D2). Their replacement words are below, each with its clause check. D2 also goes to the advisor (see the drafts at the end).

Sources I read. The form at origin/main is sha256 bcf06717c4024d3916718ffe58c9836653714ecfa539e8761ac103cd07bb5aa6. It is the same at 3d94561d and at 4443b678: main moved during this review, and the form did not change. I also read §2.11, Amendment 36 whole, Amendment 37 whole with its item 9, and these rulings, each whole: ADV-2026-11-16-10, -16-16, -18-18, -18-24, -19-04 and -19-05. Of the 2026-11-05 directive I read Part 1, items 1 to 9. The first worker report I read on main. The resumed report I read from its scratch source, `<S>/p3a1r-1.md` (8666 bytes, sha256 c0242ece8344a0be071ff4c1f394d187cadfcf7ef80b9bb8e3cce2479b6e4436, recomputed equal). When I fetched, it was not on origin/main. It then landed at 4443b678, and I diffed that copy against the scratch file after its first line: they are equal except for the masked project value in two hold lines and the final newline, which is what its filing note says.

## Findings

### Correctness
None.

### Evidence
None. One check is incomplete, by the brief's network list (see check 10): I could not name the red runs on earlier commits.

### Documentation (must fix before the merge; no re-gate)

**D1.** `kernel/src/project/mod.rs:320-322 at H`, the code comment above the lock. It says the lock is taken "before the first write". That is untrue. Taking the lock is the save's first write: `ProjectLock::try_lock` makes the identity's folder and creates `open.lock` (`kernel/src/project/store.rs:241-244 at H`). That folder is the very thing T14 asserts as "no identity folder" (`kernel/tests/project_save.rs:1043 at H`). The words are the worker's, from 2519aef1, not the human's, and not in Amendment 37. So the worker applies these words, with no re-gate, and the PR body lists them.

Replacement words:
```
        // A first save takes the identity's open lock after both documents are built, so that a
        // refusal above writes nothing, and before the documents are written; taking it makes the
        // identity's machine folder and `open.lock` (the form's Amendment 36, item 6 (a)). A lock
        // that cannot be taken refuses the save, naming `open.lock`.
```
Clause check at H:
- "after both documents are built": the documents are built at mod.rs:304-319, and the lock is taken at mod.rs:333-337.
- "a refusal above writes nothing": mod.rs:254-319 holds only reads and in-memory builds. Every `?` there returns before any write.
- "before the documents are written": `write_machine_file` is called at mod.rs:339-343, after the lock.
- "taking it makes the identity's machine folder and `open.lock`": store.rs:241 (`create_dir_all`) and store.rs:242-244 (`create(true)`).
- "A lock that cannot be taken refuses the save, naming `open.lock`": mod.rs:323-334 maps the refusal to `SaveFailure::MachineStore { what: store::OPEN_LOCK, .. }`.

**D2.** `kernel/src/project/mod.rs:23 at H`, the module doc: "No handle is held in a project folder." The old sentence was scoped to the module ("Nothing here holds a handle"). The new one drops that scope, and as a statement about the shipped app it is untrue on Windows. When the data sits in the project folder or a folder below it, the advisory source watcher holds directory handles on the dataset's parent and grandparent for the whole open (`engine/src/watch.rs:205-212 at H`, `open_directory`; `engine/src/watch.rs:474 at H`, "the parent handle always, the grandparent's if it was armed too"). Ordinary use reaches this case: E-SAVE's INSIDE-OPEN and INSIDE-SAVE steps do it. I class it as Documentation, not an untrue guarantee: the handles are opened with full sharing (watch.rs:209), so nothing an operator does is blocked.

The sentence is not the human's wording (Amendment 37 item 4). But ADV-2026-11-19-05 item 4 approved those exact words, so the change is a conflict with that ruling and goes to the advisor (draft A below).

Replacement words for the second paragraph (mod.rs:23-26 at H):
```
//! Nothing in this module holds a handle in a project folder. [`Projects`] holds one on
//! `open.lock` in the machine store for each identity it saved first, until it is dropped. The
//! only files this module writes in a project folder are `project.spatial` and the temporary file
//! that [`store`]'s atomic replace renames over it.
```
Clause check at H:
- "Nothing in this module holds a handle in a project folder": `read_existing` opens and drops its file (mod.rs:536-545). `stage` and `sync_folder` open and drop theirs (store.rs:121-127, 188-191). `resolver.rs` and `file.rs` open no `File`.
- "[`Projects`] holds one on `open.lock` … until it is dropped": the entry is pushed at mod.rs:345-354, its field is mod.rs:132, and no code removes an entry from `saved`. My grep for `saved.retain|remove|clear|drain|truncate` found none.
- "The only files this module writes in a project folder are …": the only write into `folder` is `replace` (mod.rs:344), which is `stage` then `commit` (store.rs:116-181). `write_machine_file` writes only in `dir`, which is in the machine store.

### Observation (no fix asked)
- **O1. ef6d6594 changes no assertion,** as Amendment 37 item 6 (d) and ADV-2026-11-19-05 item 6 ask me to confirm. The `assert_eq!(reply, held, "the other process is refused the lock")` line is unchanged. The value bound to `held` goes from `Ok(Some("ko17: held".to_string()))` to `Ok(Some("held".to_string()))`, because the extraction now drops the `ko17: ` prefix. The asserted fact, that the child replied `held`, is the same.
- **O2. Not covered, for the closing amendment.**
  - `lock_refused`'s mapping (mod.rs:323-332) has no test. The `Held` arm cannot be reached (Amendment 36 item 6 (a)). The `Io` arm can be, and nothing tests it.
  - Beside Note 4's row (ADV-2026-11-19-05 item 9): a refusal by `try_lock`'s own `Io`, after store.rs:241, also leaves the identity's folder behind.
- **O3. What the user is told, at a first save whose machine store cannot be written.** `try_lock` now makes the folder before `create_dir_all` runs, so the not-saved notice's `{message}` changes. It used to read `the project could not be written: the project's machine folder: <OS error>` and now reads `the project could not be written: open.lock: <OS error>`. This is a kernel fact (`LockRefused::Io` covers the folder, at store.rs:265). See draft B.
- **O4.** `kernel/src/project/store.rs:204 at H`: in "Each holds its own identity's open lock …, so the one that renames first can remove the other's temp here", the "so" reads as if the lock causes the removal. The sentence is true as written, and only its clarity is in question.
- **O5.** In K-O24 (`kernel/tests/project_save.rs:1160 at H`), `expect_err("a read-only folder takes no project file")` names a read-only folder, which is not how the folder is set up on Windows. Amendment 37 item 3 keeps "the rest of K-O24" unchanged, so I propose no edit.
- **O6. The worker's P-head log has no head line.** I date it to c905c7ea from its file time (02:55Z), which falls after c905c7ea's commit (02:53:48Z) and inside the resumed run's window (02:49:13Z to 02:58:06Z). CI at H corroborates it (check 10).
- **O7. More red runs are owed in the closing amendment.** Amendment 37 item 6 (e) names only 2519aef1. The pushes of 077fe26b and ef6d6594 should also be red, because K-O17 fails before its code (the worker's P-base). I could not name them (check 10).
- **O8. Masks owed when `<S>/p3a1e-1.md` is filed.** Its line 25 carries a local UTC offset, and its lines 53 and 56 carry a user-profile path (ADV-2026-11-18-07).

## The checks

**1. Start.** At 03:34:41Z:
- `<W>` HEAD is c905c7ea06cbe9e354c346e3a7777c3a2546bd85, and the porcelain is 0 bytes.
- `ls-remote` gives c905c7ea06cbe9e354c346e3a7777c3a2546bd85.
- `df`: C: 47G free, D: 348G free.
- The fetch exited 0.
- The merge base of origin/main and H is 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d, which is B.

**2. The diff.**
- `git diff --numstat B...H` (rc 0):
  - `44 12 kernel/src/project/mod.rs`
  - `8 1 kernel/src/project/store.rs`
  - `125 2 kernel/tests/project_save.rs`
- `--name-only` (rc 0) gives the same three files.
- Per commit:
  - 077fe26b: test file only, 112/0;
  - ef6d6594: test file only, 3/2;
  - 2519aef1: mod.rs 34/7 and store.rs 8/1;
  - 3bcd0217: test file only, 25/15;
  - c905c7ea: mod.rs 13/8, and all 21 changed lines are comments. My grep for a changed line that is not a comment found none (rc 1).
- Against Amendment 36 item 6 (a) and Amendment 37 item 8, each hunk is in a declared region:
  - mod.rs: the `SavedProject` field; departure (c)'s `derive` and lookup; the lock and the doc in `Projects::save`; `write_machine_file`'s doc; the module doc (Amendment 37 item 8).
  - store.rs: the docs of `Staged::commit` and `remove_stale_temps` only.
  - project_save.rs: one module-doc line; K-S13's last assertion (Amendment 37 item 8); K-O17 and K-O24 appended.
- I extracted every Old and New block of Amendment 37 by script and counted each in its file:
  - each New block occurs exactly once at H, and its Old block does not occur;
  - each Old block occurs exactly once at 2519aef1.
- Wire bytes, protocol lines, fixtures, shell strings, lock files and `Cargo.toml`: `git diff --quiet B...H` over every lock file, every `Cargo.toml`, `protocol`, `frontends` and `fixtures` gives rc 0. No shell string changes. One new kernel message text exists (O3, draft B).
- `git diff --name-only B origin/main` over the three paths: empty (rc 0). Main took only records files over that range.

**3. §2.11's command,** excludes set to `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` and `governance/{PLAN.yaml,CUSTODIAN-QUEUE.md,CUSTODIAN-QUEUE.json}` (rc 0). Both columns count:

| File | Added + deleted | Ceiling | Worker's figure |
|---|---|---|---|
| mod.rs | 44 + 12 = 56 | 60 | 56, confirmed |
| store.rs | 8 + 1 = 9 | 20 | 9, confirmed |
| project_save.rs | 125 + 2 = 127 | 130 | 127, confirmed |
| kernel product group | 65 | 80 | 65, confirmed |
| kernel tests group | 127 | 130 | 127, confirmed |

Nothing is over its ceiling, so there is no class 8 row. In all: 192 lines in 3 files.

**4. The change against Amendments 36 and 37.**
- **After both documents are built, before `create_dir_all`.** The documents are built at mod.rs:304-319 and the lock is taken at mod.rs:333-337, before `create_dir_all` at mod.rs:338. My supplementary mutation (check 7, d) fails T14, so T14 guards where the lock sits.
- **A refusal before that writes nothing.** Every `?` at mod.rs:254-319 comes before any write (D1's clause check). T14 passes unedited at H.
- **`LockRefused` maps to `MachineStore`, naming the lock file.** mod.rs:323-332 maps `Held` to `io::Error::other("another handle holds it")` and `Io(e)` to `e`, both as `SaveFailure::MachineStore { what: store::OPEN_LOCK, source }`. That variant goes to `project_file_unwritable` (mod.rs:493).
- **Kept with the saved entry, freed when `Projects` is dropped.**
  - The entry is pushed only `if let Some(lock) = lock` (mod.rs:345-354), into the field at mod.rs:132.
  - Dropping it unlocks and closes the file (store.rs:253-257).
  - The shipped `Projects` is `app.manage`d for the app's life (`frontends/shell/src-tauri/src/lib.rs:457-462 at H`).
- **A first save refused after the lock frees it.** `lock` is a local `Option<ProjectLock>`, dropped at each `?` from mod.rs:338 to 344. K-O24 shows this, and so does its mutation (check 7).
- **No new `pub` item.**
  - `grep -nE '^\+.*\bpub\b'` over the whole `B...H` diff: 0 matches, rc 1.
  - The same pattern on a two-line control (`+pub fn x() {}`, `+    pub(crate) struct Y;`): 2 matches, rc 0.
  - `^-.*\bpub\b`: none (rc 1).
- **Departure (c).** `SavedProject` is private, and no `derive(Clone)` remains on it. The lookup now clones `project`, `folder` and `uri` (mod.rs:255-256), the same three fields the old code read from the whole cloned entry. `first` is still `known.is_none()`. No behaviour changes.
- **Doc sentences at H:**
  - The module doc bullet (mod.rs:14-19): true; it is the code's order.
  - The module doc handle sentence (mod.rs:23-26): D2.
  - `SavedProject::_lock` (mod.rs:130-131): true.
  - `Projects::save` (mod.rs:234-240): true. The documents are built before the lock; "A first save that replaces it keeps the lock … one refused after the lock frees it" matches mod.rs:338-354.
  - The comment at mod.rs:320-322: D1.
  - `write_machine_file` (mod.rs:548-550): true. The name is 8 random bytes as 16 hex characters; the temp is removed only on an error (`inspect_err`); and `remove_stale_temps` matches only `project.spatial.tmp-` in a project folder.
  - `Staged::commit` (store.rs:142-145): true; the link is gone.
  - `remove_stale_temps` (store.rs:201-207): true (O4). Within one `Projects`, the `saved` mutex serializes saves, so the race needs two processes or two `Projects`.

**5. The tests.**
- At H: K-O17 is `kernel/tests/project_save.rs:1072 at H`, K-O24 is :1134, K-S13 is :940 with its last assertion at :974, and T14 is :1020.
- K-O17 asserts that, after a real first save, a child copy of the test binary is refused the identity's lock as `Held`, while the parent's `Projects` lives (:1118), and that `open.lock` is 0 bytes (:1121). Both waits on the child are bounded at 60 s.
- K-O24 asserts:
  - the save is refused as `ProjectFileUnwritable` (:1161-1162);
  - the machine store holds one identity (:1164);
  - `try_lock` on that identity then succeeds (:1168).
- K-S13 at H matches Amendment 37 item 2's New block exactly.
- T14 is unedited (it is not in any commit of the branch).
- ef6d6594: see O1.
- **Can K-O24 pass without reaching its assertions?** Not on any platform at H. The early return of 2519aef1 is gone, and the test has no other `return` and no `#[ignore]`. If `icacls` fails, the closure's `assert!` fails the test (:1150-1153). Off Windows, a run as root would let the save succeed, and `expect_err` would fail the test rather than pass it. The only way it passes vacuously is at base, where no lock is taken, and that is its declared exemption.

**6. The probe on D:** (Amendment 37 item 9).
- `mkdir -p D:/wt-data/1c-p3a-1/g334r-aclprobe`, in a call of its own: rc 0.
- First try, `icacls "D:\wt-data\1c-p3a-1\g334r-aclprobe" /deny "*S-1-1-0:(WD)"`: rc 87, output `Invalid parameter "C:/Program Files/Git/deny"`. Git Bash rewrote the `/deny` argument as a path, so icacls changed nothing. This is a finding about the shell, not about icacls. Rust's `Command` passes the argument straight through, so the test is not affected.
- `MSYS_NO_PATHCONV=1 icacls "D:\wt-data\1c-p3a-1\g334r-aclprobe"` (the ACL listed, an extra read): rc 0, eight inherited entries, no DENY.
- `MSYS_NO_PATHCONV=1 icacls "D:\wt-data\1c-p3a-1\g334r-aclprobe" /deny "*S-1-1-0:(WD)"`: rc 0
  ```
  processed file: D:\wt-data\1c-p3a-1\g334r-aclprobe
  Successfully processed 1 files; Failed processing 0 files
  ```
- `cmd //c "echo x> D:\wt-data\1c-p3a-1\g334r-aclprobe\probe1.txt"`: rc 1, output `Access is denied.` The folder stayed empty. **Refused.**
- `MSYS_NO_PATHCONV=1 icacls "D:\wt-data\1c-p3a-1\g334r-aclprobe" /remove:d "*S-1-1-0"`: rc 0, with the same two lines as the deny.
- `cmd //c "echo x> D:\wt-data\1c-p3a-1\g334r-aclprobe\probe2.txt"`: rc 0, no output. The folder now holds `probe2.txt` (3 bytes). **Taken.**
- So on D:, the volume the test's rig uses, both results are as Amendment 37 item 7 (1) requires.

**7. Mutations** (applied, run and reverted at H; no `verify-mutation` run).
- The list agrees with Amendment 36 item 6 (b), Amendment 37 items 2 and 7 (5), and `<S>/1cp3a1-mutate2.mjs`, which has three mutations. Each one below is the script's own edit, applied again by my own anchored `node -e`, which refuses unless each anchor occurs exactly once.
- I added one supplementary mutation, (d).
- One departure from the brief's command form: the names went after `--`, as `-- --exact <names>`.

(a) **K-O17's mutation, no lock taken at a first save.**
- The diff: `-        let lock_refused = |e| {` / `+        let _lock_refused = |e: store::LockRefused| {`, and `-            Some(store::ProjectLock::try_lock(&self.root, &project).map_err(lock_refused)?)` / `+            None::<store::ProjectLock>`.
- The run: cargo rc 101, `test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 19 filtered out; finished in 0.24s`.
- K-S13 fails:
  ```
  thread 'the_first_save_records_its_folder_as_first_in_folders_json' (63228) panicked at kernel\tests\project_save.rs:974:5:
  assertion `left == right` failed: the two documents and the lock, and no temp file
    left: ["folders.json", "locations.json"]
   right: ["folders.json", "locations.json", "open.lock"]
  ```
- K-O17 fails:
  ```
  thread 'a_project_saved_first_in_this_process_is_refused_to_another_process' (61296) panicked at kernel\tests\project_save.rs:1118:5:
  assertion `left == right` failed: the other process is refused the lock
    left: Ok(Some("taken"))
   right: Ok(Some("held"))
  ```
- Each fails at its own assertion: K-S13 at its last, K-O17 at its reply assertion.

(b) **K-O24's mutation, the lock kept with the saved entry on a failed save.**
- The diff replaces the 5-line `let lock = if first {…}` with:
  - `if first { let lock = …try_lock(…)?; saved.push(SavedProject { dataset: name.to_string(), project: project.clone(), folder: folder.clone(), uri: uri.clone(), _lock: lock }); }`
  - `let lock: Option<store::ProjectLock> = None;`
  
  That is +11/−5.
- The run: cargo rc 101, `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 20 filtered out; finished in 0.17s`.
- icacls printed its `processed file: D:\wt-data\1c-p3a-1\spatial-ide-project-save-tests\ko24\project` line twice, so the deny and the remove both ran. The failure:
  ```
  thread 'a_first_save_refused_after_the_lock_leaves_it_free' (60700) panicked at kernel\tests\project_save.rs:1168:5:
  the refused save freed the lock: Err(Held)
  ```
- It fails at its last assertion, on Windows, on the laptop. Afterwards `icacls` on that folder shows 0 DENY entries.

(c) **T14's mutation (b), the documents built after the first write,** with T14 unedited.
- The diff moves the 16-line block from `let at = …` to the end of `folders` so that it comes after `create_dir_all` (+16/−16).
- The run: cargo rc 101, `T14 runs on windows`, `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 20 filtered out; finished in 0.15s`.
  ```
  thread 'a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing' (63176) panicked at kernel\tests\project_save.rs:1043:5:
  no identity folder
  ```
- It fails at its own last assertion.

(d) **Supplementary, the lock moved alone above the documents**, with `create_dir_all` left where it is.
- The diff moves the `lock_refused` closure and the `let lock` block before `let at = …` (+15/−15).
- The run: cargo rc 101, `T14 runs on windows`, `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 20 filtered out; finished in 0.16s`.
  ```
  thread 'a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing' (61176) panicked at kernel\tests\project_save.rs:1043:5:
  no identity folder
  ```
- So the lock's own position is guarded by T14, apart from `create_dir_all`'s.

Reverts. After each one, `git -C <W> checkout -- kernel/src/project/mod.rs` gave rc 0, `git diff` was 0 bytes and the porcelain was empty. The file's sha256 was da641d156509266094bd19f5239406f738d6be62a6ceb5ee77e5133537a1bd9f, equal to `git show H:kernel/src/project/mod.rs | sha256sum`.

All four fail where the amendments say they should. There is no coverage finding.

**8. The runs.**
- **Reused, at c905c7ea, from the worker's P-head.** Each figure rests on `<S>/1cp3a1-phead2.log`, a log and not only the report's words:
  - lib `test result: ok. 193 passed; 0 failed; 1 ignored` (line 201);
  - project_lock_crash `1 passed` (208);
  - project_save `21 passed` (239);
  - project_save_crash `1 passed` (246);
  - project_store `5 passed` (257).
  
  The log dates to c905c7ea by O6.
- **`cargo fmt --check` rc 0** rests on the report: `1cp3a1-fmt9.log` is 0 bytes and carries no exit code. CI's "Rust fmt" passed at H in runs 44447998412 and 44448999026, so I did not run it again.
- I doubted nothing else, so I reproduced nothing else. The mutations are mine (check 7).
- **Run by me, at H, in one hold:** `cargo test --locked -p spatial-kernel --no-fail-fast --test project_reopen --test project_resolver --test session_history --test project_save_skp`, cargo rc 0:
  - project_reopen: `test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.13s`
  - project_resolver: `test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s`
  - project_save_skp: `test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.79s`
  - session_history: `test result: ok. 13 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.69s`
- **Clippy at H, in a hold:** `cargo clippy --locked -p spatial-kernel --all-targets`, rc 0.
  - It gave 9 warnings, all in files the part does not change: renderer/src/canonical.rs:303, renderer/src/style.rs:10, engine/src/app_dirs.rs:39, kernel/src/permission/boundary.rs:536, kernel/src/publish/mod.rs:839, kernel/src/skp.rs:277, kernel/src/lib.rs:415, kernel/src/lib.rs:490 and kernel/src/bin/publish-bundle.rs:149.
  - None is in mod.rs, store.rs or project_save.rs: a grep of the log for those three files finds 0 lines.
  - So there is no finding (ADV-2026-11-18-24 item 5 (b)).
- **E-SAVE, evidence, not Authority.** The report is `<S>/p3a1e-1.md` (7431 bytes, sha256 9871e042a17ba6b1117fd748dc4731fefd27c9295a6aad484ac2437000036ce1).
  - Its log's first line is `worktree C:/dev/wt/1c-p3a-1 head c905c7ea06cbe9e354c346e3a7777c3a2546bd85 start 2026-11-19T03:32:17Z`.
  - My counts of the log: 12 `] PASS` lines, 0 `] FAIL` lines, and a last line of `rc=0 end 2026-11-19T03:32:53Z`.
  - I recomputed the exe's sha256 as c2806c52856d9e1d5359682d3c1617da4c3610299879ab82e40f6e4de10700ca, the report's figure.
  - What it shows: the shipped app's first saves, now taking the lock, still save through the app window, including SECOND-SAVE and INSIDE-SAVE. It does not read `open.lock`.

**9. Light runs from `<W>`.**
- `node scripts/plan/verify-test-claims.mjs`: rc 0, `verify:test-claims PASS — all 867 claimed test(s) across 275 file(s) exist or are planned, superseded or withdrawn (56 planned, 16 superseded, 17 withdrawn, advisory).`
- `node scripts/plan/verify.mjs --offline`: rc 0, `verify:plan PASS`, with the PR-merged and release-published checks skipped.
- Afterwards the porcelain was empty.

**10. CI.** I read `gh pr checks 334` (rc 0) at 2026-11-19T03:42:40Z, and every check passed. `gh run view` gives the head sha, event and conclusion of each run:
- push runs, all at c905c7ea06cbe9e354c346e3a7777c3a2546bd85 and all success:
  - 44447998372, Product CI — Rust workspace;
  - 44447998412, Rust fmt;
  - 44447998415, Governance CI;
  - 44447998428, Ported notices;
  - 44447998429, Product CI — shell.
- pull_request runs, all at c905c7ea06cbe9e354c346e3a7777c3a2546bd85 and all success:
  - 44448999249, Rust workspace;
  - 44448999026, Rust fmt;
  - 44448999009, Governance;
  - 44448999060, Ported notices;
  - 44448999005, shell;
  - 44448999053, DCO sign-off;
  - 44448999003, Exposure scan.
- **Red or cancelled runs on the branch:** none at H. The runs on 077fe26b, ef6d6594 and 2519aef1 are not in the PR's checks. `gh run view` needs a run id, and listing a branch's runs needs `gh run list`, which is outside the brief's network list. So I name none of them, including the run at 2519aef1 that is expected red from K-S13. Under O7, the closing amendment owes them all.
- **K-O24's line on each platform** (ADV-2026-11-19-05 item 7), byte-copied from the run logs at H; tab-separated job and step names abridged by me:
  - run 44447998372, ubuntu-24.04: `2026-11-19T03:01:59.6870963Z test a_first_save_refused_after_the_lock_leaves_it_free ... ok`
  - run 44447998372, macos-latest: `2026-11-19T03:02:00.3849550Z test a_first_save_refused_after_the_lock_leaves_it_free ... ok`
  - run 44447998372, windows-latest: `2026-11-19T03:10:58.6702684Z test a_first_save_refused_after_the_lock_leaves_it_free ... ok`. It is preceded by two `processed file: <runner temp>\spatial-ide-project-save-tests\ko24\project` lines, at 03:10:58.6304907Z and 03:10:58.6662351Z (the profile part masked by me).
  - run 44448999249: ubuntu at `2026-11-19T03:09:54.7089233Z`, macOS at `2026-11-19T03:12:06.0389910Z` and Windows at `2026-11-19T03:15:46.4897182Z`, each `test a_first_save_refused_after_the_lock_leaves_it_free ... ok`. On Windows it is preceded by two `processed file:` lines for the same folder.
- K-O24 has no early return at H (check 5), so it ran its assertions on all three platforms in both runs.

**11. End.**
- `<W>` HEAD is c905c7ea06cbe9e354c346e3a7777c3a2546bd85, and the porcelain is empty (0 lines).
- `D:/wt-data/1c-p3a-1/g334r-aclprobe` holds only `probe2.txt` (3 bytes). I left it in place. `icacls` on it (rc 0) shows 0 DENY entries.
- `df` at 03:48:53Z: C: 47G free, D: 347G free.

## Holds
Each hold ran one cargo command with the `-What` text `b2-piece-1c P3a-1 gate reviewer: <command>`. Each was granted at once:
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`

There was no MACHINE_WAITING or MACHINE_ERROR line, and no exit code from 96 to 99.

| Hold | Start (date -u) | End | cargo rc |
|---|---|---|---|
| focused targets | 03:42:19Z | 03:43:06Z | 0 |
| clippy | 03:43:20Z | 03:44:25Z | 0 |
| mutation K-O17 | 03:45:19Z | 03:45:45Z | 101 (expected) |
| mutation K-O24 | 03:46:20Z | 03:46:48Z | 101 (expected) |
| mutation T14 (b) | 03:47:18Z | 03:47:45Z | 101 (expected) |
| supplementary, lock first | 03:48:10Z | 03:48:36Z | 101 (expected) |

## Drafts for the advisor
- **A (D2).** ADV-2026-11-19-05 item 4 approved Amendment 37 item 4's second New block in its exact words. Its first sentence, "No handle is held in a project folder.", is untrue in the shipped app on Windows: when a project's data sits in its folder or a folder below it, the engine's source watcher holds directory handles there (engine/src/watch.rs:205-212 and 474 at H). My draft replaces that paragraph of `kernel/src/project/mod.rs:23-26 at H` with D2's words, which scope the claim back to the module and keep every other clause. It is not the human's wording. If you take it, the worker applies it before the merge with no re-gate.
- **B (O3, for your information; I propose no change).** P3a-1 adds one kernel message text. The not-saved notice can now carry `the project could not be written: open.lock: another handle holds it`. Ordinary use cannot reach it (a freshly minted identity already held, Amendment 36 item 6 (a)). At a first save whose machine store cannot be written, the notice moves from `… the project's machine folder: <OS error>` to `… open.lock: <OS error>`. Both state kernel facts.

## Background shells
None left. All six hold calls completed and notified me. `tasklist` for `cargo.exe` and `project_save*` shows no task.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.

## My scratch files
All in `<S>`, under names starting `g334r-`. The ones the checks rest on:
- the four mutation logs: `g334r-mut-ko17.log`, `g334r-mut-ko24.log`, `g334r-mut-t14b.log` and `g334r-mut-lockfirst.log`;
- `g334r-focused.log` and `g334r-clippy.log`;
- `g334r-count.txt`;
- `g334r-blocks.txt`;
- the probe outputs: `g334r-probe0.txt` to `g334r-probe4.txt`, with `g334r-probe1b.txt` and `g334r-probe-end.txt`;
- `g334r-ws-push.log` and `g334r-ws-pr.log`;
- `g334r-checks.txt` and `g334r-runs.txt`.
