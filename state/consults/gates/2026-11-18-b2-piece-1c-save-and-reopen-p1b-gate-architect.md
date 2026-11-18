Reviewed: PR #331 at 1ad509ad69f1be832ef92af43c26cb03ada00a56 (the custodian's filing note, 2026-11-18: the architect, one of PR 331's two gates under its form's Amendment 30 item 6 (f); Read 23, Grep 34, Glob 2, model claude-opus-5-5, from 2026-11-18T17:09:26Z to 17:20:07Z; the report below byte for byte from its hand-back of 14106 bytes, sha256 bc2c9ff4311df86ab20229165915d81f74e12f962b91ff2b886548925b4e4f20, with this note in its first line and one final newline), gate, architect
cut/b2-piece-1c-p1b @ 1ad509ad69f1be832ef92af43c26cb03ada00a56

Verdict: PASS WITH NOTES

Gaps in my reads: the PR body. CI's state at F. The commit message bodies (I saw only the subjects, in the worker report). The worker's logs under `<S>` (p1b-mut-summary.txt, p1b-count.txt, the P-base and P-head logs): I took its runs and mutation outcomes as reported. E-SAVE at F (still running). I had no git, so I could not confirm that main has not changed the PR's paths since B. I did not read docs/02, docs/08 or ADR-036's text (§9, Amendment 1 items 3 and 6). Of `kernel/tests/project_save.rs` at F I read only lines 1–120 and 960–1047, which hold the rig, the module doc and T11/T14. The diff showed 0 deletions in that file. My point that Windows may free a lock late after a crash comes from what I remember of the LockFileEx documentation, which I did not read here (O-1).

## Findings

**Correctness:** none.

**Evidence:** none that blocks. Two conditions remain open before the merge (O-5).

**Documentation** (must fix before the merge; no re-gate):
- **D-1** `kernel/tests/project_store.rs:50 at F`. T9's doc says "Expected failure: the first equality." Under the recorded mutation (old first kept in `same`), the first assertion, `moved.first` at line 58, still passes. The one that fails is the `same` assertion at lines 59–63. Fix: the words in Drafts W1. This is the worker's wording.
- **D-2** `kernel/tests/project_store.rs:143-145 at F`. T13 (b)'s "expected failure: the path that is not Unicode is written" is not what was observed. Worker report §4 shows the mutation as applied (main's `to_string_lossy`, which also has no bound) fails at the 4,097-byte case. That case comes first in the array at lines 159–162, so the not-Unicode case is never reached. Fix: W2. This is the worker's wording. The closing amendment records T13b's observed failure point.
- **D-3** Closing amendment, class 8. It needs a row for `project_store.rs` (166 of 140). It also needs a row for `mod.rs` (15/27 = 42 of 40). The group total of 335 of 340 counts both columns for `store.rs` and `mod.rs`, so the per-file count has to count both too (Amendment 30 item 6 (b)). The same amendment names `mod.rs`'s import hunk (O-6) and the fix commit's edit to T6 (worker departure (d): the piece's own new test, no assertion changed, so not an I3 stop). §2.11 and §7 stay unedited; the diff leaves both untouched.
- **D-4** The plan summary on main (`governance/PLAN.yaml`, node `b2-piece-1c-save-and-reopen`) names P1b's producers and their consuming pieces, but not the seams' end-to-end tests. ADV-2026-11-16-10 R2 (a) and Amendment 30 item 6 (d) require them there and in the PR body: K-O4 and K-O5, the two working-named tests, E-SECOND and E-CRASH-UNLOCK; K-O11 and K-O6; K-O6 widened; K-O3 and K-O10 widened. Fix: the custodian adds them. I could not read the PR body; the reviewer or the custodian checks it against the same list.
- **D-5** What the user is told: the closing amendment states it from the built code. Amendment 30 item 4 (a) says "no string changes". The shell's strings do not change. But the kernel adds one rule text, at `kernel/src/project/store.rs:311 at F` (`a path of {n} bytes, over the ceiling of {max}`). It reaches the user through `project_file_refused`'s message (`protocol/skp/src/v0/error.rs:205 at F`) inside `notSavedNotice` (`frontends/shell/src/project/saveProject.ts:39,118 at F`). The text for a document over the byte bound (`store.rs:340-344 at F`) uses the same words as `strict_json.rs:66-70 at F`. The not-Unicode text is main's existing `folders.json` text, as the diff's removed lines show. Amendment 30 itself is append-only: the closing amendment corrects this by reference, in at most three sentences.

**Observation:**
- **O-1** Windows may free a lock late after a crash. That documentation (from my memory, not read here) says the OS frees a dead process's LockFileEx locks after a delay that depends on system resources. T6 (`kernel/tests/project_lock_crash.rs:99 at F`) calls `try_lock` right after `try_wait` reports the exit, so it could flake rarely on Windows CI. P3a and P4 (K-O5, E-CRASH-UNLOCK) should decide whether a reopen after a crash retries for a bounded time before `project_open_elsewhere`. The ProjectLock doc (`store.rs:212-214 at F`) makes no timing claim, so it stands.
- **O-2** T13 (b) does not on its own show that the not-Unicode assertion detects a lossy writer. By reading, the assertion does guard it: a lossy writer with the bound kept gives `Ok`, so `expect_err("not Unicode")` panics. The form's declared mutation was applied, observed and failed its test, which meets 6 (c) and stop 5. Optional, before the merge: one more observation with `to_string_lossy` replacing `to_str` and the bound kept. It should fail at "not Unicode".
- **O-3** Branches no test covers, none of them a claim in item 6 (c):
  - `with_same` where the folder equals `first` (`store.rs:359 at F`);
  - `locations_to_bytes` refusing a relative path (worker departure (b));
  - the reader refusing a relative `path` or a bad dataset URI (`store.rs:494-500 at F`);
  - the `eprintln!` line itself (`store.rs:157-162 at F`, proven by reading only).
- **O-4** Already true at main, outside P1b's scope: a crash during `write_machine_file` (`kernel/src/project/mod.rs:519-534 at F`) leaves a `<name>.tmp-<hex>` in the identity's folder. Nothing removes it. No reader reads it as whole.
- **O-5** This gate does not discharge two things. Item 6 (f)'s E-SAVE run at F and CI green at F are conditions of the merge. Under Part 1 item 4 of the 2026-11-05 directive (a gate is dispatched only after the full suite has passed at the reviewed head), with ADV-2026-11-16-16 item 1 (b) (the full suites are CI's), the precondition for this dispatch is CI green at F. The brief does not give CI's state, so the custodian confirms it. I see no conflict between the two rulings.
- **O-6** The import hunk at `mod.rs` line 36 is forced by removing `locations_json`. Its two names were used only there; the build passes with them gone. I read it as part of that removal region, so it is not a stop 2 breach. It is recorded under D-3.
- **O-7** For P3a's consumer: `with_same` compares paths component by component (`store.rs:359 at F`). On Windows, the same folder spelled with different case counts as a new folder toward the 256.

## Checks

1. **Design against 6 (a) and (d).** Every hunk falls inside 6 (a)'s regions.
   - `store.rs` at F:
     - lines 17 and 26 (imports), 44, 54–58, 146–191 (`commit`, `commit_with`, `sync_folder`);
     - 212–258 (the lock), 269–277, 301–316 (`stored_path`, a private helper for item 4 (a)), 323–383;
     - 424–512, 514–542 (`mod tests`).
   - `mod.rs`: line 36, 289–313 at F, and the removal of `locations_json`.
   - The two protocol comments, which are deletions only.

   The `pub` items added:
   - in 6 (d): `OPEN_LOCK` (44), `ProjectLock` (223), `try_lock` (231), `LockRefused` (253), `KnownFoldersFull` (275), `with_same` (358), `moved_to` (377), `Location` (432), `read_locations` (467);
   - `locations_to_bytes` (449), with its product caller at `mod.rs:294 at F`.

   No other `pub` item; `commit_with`, `LOCATIONS_LIMITS` and the helpers are private. No new cross-crate dependency (`store.rs:22-27 at F`). The canonical form is still written only through `renderer/src/canonical.rs`'s `to_canonical_string` (§8 item 14). Stop 1: no wire byte, wire type, fixture or protocol line changes beyond the two comments. The §11.4 row at `protocol/skp/SKP-V0.md:1370 at F` already covers machine store files.

2. **Concurrency and the crash.**
   - **One process twice:** `Held`. Each `try_lock` opens its own handle or descriptor (`store.rs:234-241 at F`), and std's lock is per handle on Windows and per open file description (flock) elsewhere. T6 lines 56–60 observe it.
   - **Two processes:** `Held` while the child holds the lock. After the child aborts, the lock is taken again (T6 lines 83 and 99).
   - **Leaks:** Drop unlocks (245–249). The file is opened with `truncate(false)` and never written (235). A crash leaves an empty `open.lock`, which is not a marker, and the OS frees the lock (§8 item 4; timing in O-1).
   - **What the user is told:** nothing in P1b. `LockRefused` has no product caller until P3a maps `Held` to `project_open_elsewhere` (§2.4 step 3).
   - **The save's write order** (`mod.rs:292-314 at F`):
     - both documents are built, then the identity's folder is made, then `locations.json` and `folders.json` are each written temp, synced, renamed, then `replace`: stage (`create_new`, `write_all`, `sync_all`), rename, flush, stale-temp sweep (`store.rs:116-175 at F`);
     - a crash before the rename leaves the previous `project.spatial`, or none, plus a temp no reader opens;
     - a crash after the machine writes at a first save leaves an identity folder that no project file names;
     - a crash after the rename leaves the new file, whole, because its bytes were synced before the rename. A truncated file cannot be read as whole: the strict reader refuses it;
     - D-16: a flush failure after the rename now returns `Ok` and writes an engine fact (kind only) to stderr (`store.rs:157-162 at F`). The reply now matches the commit (docs/01 derived rule 6; ADR-006 class 2).
   - **O-7:** the lock sits at `<data>/spatial-ide/projects/<hex>/open.lock` (`store.rs:68-70,232-236 at F`). The recorder locks `sessions/<hex>/history.jsonl` (`session_history.rs:249,480-488,519-523 at F`). The two are kept apart.

3. **The writers' bounds and item 4 (a)**, clause by clause:
   - `to_bytes` refuses a path over the string bound or not valid Unicode (`store.rs:324-326`) and a document over the byte bound (339–346): ✔.
   - `locations_to_bytes` sits in the store under `LOCATIONS_LIMITS`, refuses a path that is not Unicode or is over the bound (449–453), and the old `locations_json` is gone: ✔.
   - Both documents are built before the first write (`mod.rs:292-308`): ✔.
   - The refusal is `MachineRecordRefused`, mapped to `project_file_refused` with the file as `path` (`mod.rs:463`): ✔.
   - Nothing changes on the wire: ✔. The user-visible text is not unchanged (D-5).
   - Every refusal is reported by the save; no path is altered.
   - The writer accepts only what the reader accepts. The reader bounds decoded bytes (`strict_json.rs:322-345 at F`), and its raw-length check (6 × max + 2) is at least the writer's worst escape (6 bytes per byte). Depth stays at 3 or less, under 4. The dataset URI has a fixed 54 bytes (`dataset_ref.rs:40-41 at F`).

4. **Tests against their claims.** T6, T7, T8, T10, T11, T12 and T14 would each fail if their claim were false, and each recorded mutation is the change the test names. T9's and T13's expected-failure texts are wrong (D-1, D-2). T13 (b) does not isolate the not-Unicode claim (O-2). Every claim in item 6 (c)'s table has a test; the uncovered branches in O-3 are not claims there.

5. **Class 8.** Everything in `project_store.rs` is in scope: the helpers, T8, T9, T10, T12, `not_unicode` with `cfg` in the test only, as 6 (c) allows, and T13. Everything in `mod.rs` is the two regions plus the import (O-6). The rows are owed (D-3).

6. **Discharge claims and verbatim quotes.** The comments in the diff quote nothing. Each "its own test is …" and "its product caller is …" resolves: T6 in `project_lock_crash.rs`; T8, T9, T10, T13 in `project_store.rs`; T11 in `project_save.rs:992 at F`; `Projects::save` at `mod.rs:294 at F`. The commit subjects carry no quote and no done-claim. I did not read the bodies.

## Drafts

**W1** (worker's wording; applied without a re-gate). `kernel/tests/project_store.rs:50 at F` becomes:
`/// **T9** (S2-2 (a)). Mutation: the old first kept in `same`. Expected failure: the first `same``
`/// equality, "it leaves `same`; the old first is gone".`
Clause check:
- With the mutation, `moved.first == folder(2)` still holds (line 58 passes).
- `moved.same` becomes `[folder(1), folder(0)]`, not equal to `[folder(1)]`, so lines 59–63 fail with that message. ✔

**W2** (worker's wording; applied without a re-gate). `kernel/tests/project_store.rs:143-145 at F` becomes:
`/// **T13**. Mutations: (a) the string bound removed; expected failure: the 4,097-byte path is`
`/// written. (b) `to_string_lossy` restored, as at main, which also drops the string bound;`
`/// observed failure: the 4,097-byte path is written, before the case that is not Unicode runs.`
Clause check:
- Main's `locations_json` used `to_string_lossy` with no bound (the diff's removed lines). ✔
- The observed failure point is the one in worker report §4. ✔
- "over 4,096" comes before "not Unicode" at lines 159–162. ✔

**A1** (for the advisor; a string the app shows, under P6; not a gate condition). The rule text at `store.rs:311 at F`:
- for `locations.json`: `the dataset's path is {n} bytes, over the ceiling of {max}`;
- for `folders.json`: `a folder's path is {n} bytes, over the ceiling of {max}`.

Clause check:
- `stored_path` gets `LOCATIONS` only for `at`, the dataset's absolute path (`store.rs:453`; `mod.rs:292-294 at F`). ✔
- It gets `FOLDERS` only for `first` and the `same` entries, which are all folders (`store.rs:325-331 at F`). ✔
- `{n}` is the path's UTF-8 byte length and `{max}` is 4,096 (`store.rs:309-311,324,450 at F`). ✔

This needs `stored_path` to take the noun. The message's head, "the project file would break a rule its reader holds" (`error.rs:205 at F`), already exists and also wraps machine-store refusals. It is not P1b's, and is noted for the advisor's P6 sitting.

Files: `C:/dev/wt/1c-p1b/kernel/src/project/store.rs`, `C:/dev/wt/1c-p1b/kernel/src/project/mod.rs`, `C:/dev/wt/1c-p1b/kernel/tests/project_store.rs`, `C:/dev/wt/1c-p1b/kernel/tests/project_lock_crash.rs`, `C:/dev/wt/1c-p1b/kernel/tests/project_save.rs`, `C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (Amendment 30).
