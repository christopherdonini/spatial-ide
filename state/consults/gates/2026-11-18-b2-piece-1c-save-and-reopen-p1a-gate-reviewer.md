Reviewed: PR #333 at 7e76347271780d20103bb3b4b36b8650a0967456 (the custodian's filing note, 2026-11-18: the reviewer, one of PR 333's two gates under its form's Amendment 30 item 5 (f); Bash 63, Read 10, Grep 2, none errored, model claude-opus-5-5, from 2026-11-18T21:26:13Z to 21:43:39Z; its departures (an extra mutation X1 and a clippy run, each in a hold) are in its own section; the report below byte for byte from its hand-back of 18117 bytes, sha256 bc52e8b3a213b840b7076be0c5346ac144a433a42edb3ae7804575c77cb30687, with this note in its first line and one final newline), gate, reviewer
cut/b2-piece-1c-p1a @ 7e76347271780d20103bb3b4b36b8650a0967456
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. The three Documentation findings below are must-fix before the merge, and none needs a re-gate.

## Findings

### Correctness
None. I read the walk for security, clause by clause, in `kernel/src/project/resolver.rs:164-187 at H`:
- **Text check first.** `in_canonical_form` runs before anything touches the disk. It refuses `\`, `:`, control characters, empty, `.` and `..` segments, a trailing dot or space, and device names in any case. That rules out the escapes I looked for: alternate data streams, a drive or UNC prefix pushed into the `PathBuf`, `..` normalisation under `\\?\`, and Win32 trailing-dot stripping.
- **Links.** Each segment is read with `symlink_metadata`, and links are refused before the kind check. The kind check is a second defence. Under M1, a junction used as a folder on the path is still refused, as `NotADirectory`.
- **The real regression is caught.** My extra probe X1 made the walk follow links (`symlink_metadata` changed to `metadata`). T1 then got `Ok(...)` through the junction and failed.
- **Handles.** No handle comes back from the function.

### Evidence
None. All five mutations were observed failing again, at their own assertions. P-base is supported by the logs. CI at H passed on all three platforms.

### Documentation (must-fix before the merge; none is the human's wording, so the worker applies these words without a re-gate and the PR body lists them)

**D1. Sentences that claim more than the code does.**

(a) `kernel/src/project/resolver.rs:157 at H`.
- Now: "No file is opened and no handle is held."
- Replace with: "No file's contents are read, and no handle is held after the check returns."
- Clause check:
  - "contents not read": the only file-system calls are `std::fs::canonicalize(folder)` and `std::fs::symlink_metadata(&path)`. Both read metadata only.
  - "no handle held after": the function returns `Result<PathBuf, CheckRefused>`, and nothing is kept.
- Why: my reading of std's Windows code, from memory, is that `symlink_metadata` and `canonicalize` each open and close a no-access handle. rust-src is not installed here, so no call in this run checks that. The binding rule (OPEN-5 (B), form §2.5) is "no handle held", and the new words are true either way.

(b) `kernel/src/project/resolver.rs:153-154 at H`.
- Now: "A cloud placeholder is not a name surrogate, so it is a regular file here and opens (H1)."
- Replace with: "A cloud placeholder is not a name surrogate, so the check reads it as a regular file and passes it (H1); no test here makes one (Amendment 30 item 5 (c))."
- Clause check:
  - "not a name surrogate": this is H1, observed by O0, not by this diff.
  - "reads it as a regular file and passes it": `is_symlink()` is false and `is_file()` is true, so no branch at lines 175-185 refuses it.
  - "no test here makes one": true, as item 5 (c) states.
- Why: `check_inside` opens nothing. "Opens" describes what P3a's caller does with the result.

(c) `kernel/tests/project_resolver.rs:8 at H`.
- Now: "the check opens no file."
- Replace with: "the check reads no file's contents."
- Clause check: as in (a).

**D2. The `FolderUnresolvable` variant needs a record.**
- The worker added it; item 5 (a) does not name it.
- It is right in substance:
  - §2.5 needs a canonical F;
  - `canonicalize` can fail (the folder removed or renamed, or access denied);
  - no segment can be named for that failure.
- It is a variant of the pre-committed type, not a new `pub` item, so R2 (d) is not triggered.
- Fix:
  - P1a's closing amendment names it as a class-1 departure;
  - the PR body names it (the draft body in `<S>/pr-p1a-body.md` does not);
  - P3a/P3b's packet lists a wire code for it, beside R1 (e)'s codes for a non-folder segment and a non-regular final.

**D3. Item 5 (f) says CI runs clippy. It does not.**
- `git grep -i clippy origin/main -- .github/` finds one line: a comment in `.github/workflows/rust-fmt.yml:14` saying the job is "not clippy".
- The worker did not run clippy either.
- I ran `cargo clippy --locked -p spatial-kernel --all-targets` at H: rc 0, and no warning in any of the three changed files (`grep -c` gives 0). Warnings elsewhere predate this PR: `renderer/src/canonical.rs`, `renderer/src/style.rs`, `engine/src/app_dirs.rs`, `kernel/src/permission/boundary.rs`, `kernel/src/publish/mod.rs`, `kernel/src/skp.rs`, `kernel/src/lib.rs`, `kernel/src/bin/publish-bundle.rs`.
- Fix: the closing amendment records that clippy ran at the gate (this run, at H), not in CI. The form itself is not edited.

### Observations (for P3a, P3b and the record; none blocks)
- **O1.** `NotCanonical` carries a `RefParseError` whose path is `"$"`, from `in_canonical_form(at, "$")` (`resolver.rs:165 at H`). P3a should not forward that as the locator's member path. The restated K-R3 asserts the path the reader sees when it parses the project file.
- **O2.** `Unresolvable` and `FolderUnresolvable` drop the io error kind, so P3a cannot tell "missing" from "access denied". Both would reach the user as `project_target_unresolvable`. This belongs in P3b's code packet.
- **O3.** On Windows, "regular file" means std's `is_file()`: not a folder and not a link. A non-link reparse file, such as an AF_UNIX socket file, passes. That is not a way out of the folder, and device names are already refused by the text check. Hard links pass on every platform; §2.5 names only links and junctions, so this matches the form.
- **O4.** M3 removes both kind checks at once. Removing either one alone is caught by its own `assert_eq!` in T3 (lines 109 and 116 at H). I established that by reading, not by a run.
- **O5.** §2.11's counting command still excludes the form's old path `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`. The form now lives under `governance/forms/kernel/`. This PR does not touch the form, so nothing changes here.
- **O6.** On Windows, T1 can only build a link as the final segment with a folder junction. A file symlink as the final is not built on any platform. With the link check removed, it would still be refused, by the kind check (`is_file()` is false for a link). Only the variant name would differ.

## Checks

**1. Start**
- `git fetch -q origin` rc 0.
- `<W>` HEAD = 7e76347271780d20103bb3b4b36b8650a0967456, and porcelain is 0 bytes.
- `ls-remote` gives the same commit for `refs/heads/cut/b2-piece-1c-p1a` (rc 0).
- `df -h /c /d` (rc 0): C: 49G free, D: 360G free.

**2. The diff**
- `diff --numstat B...H`: `1 1 kernel/src/dataset_ref.rs`, `95 1 kernel/src/project/resolver.rs`, `145 0 kernel/tests/project_resolver.rs`. Name-only gives the same three files. Two commits: fe162292 and 7e763472.
- Against item 5 (a):
  - `dataset_ref.rs`: the only change is line 593, `fn` becoming `pub(crate) fn in_canonical_form`.
  - `resolver.rs`: a module-doc paragraph, a widened `use` line, `CheckRefused`, `check_inside`, and `mod tests` holding T5.
  - The test file is new.
- Nothing else changes:
  - `git diff --name-only B...H -- '*Cargo.toml' protocol/ frontends/ '*fixtures*'` is empty (rc 0).
  - The lock-file diff is quiet: `git diff --quiet` over `Cargo.lock`, `frontends/shell/src-tauri/Cargo.lock` and `frontends/shell/package-lock.json`, rc 0.
  - `CheckRefused` has no `Display`: `git grep "impl.*Display\|impl.*Error for"` in `resolver.rs` gives rc 1.
  - So no wire byte, protocol line, fixture, shell string, lock file or `Cargo.toml` changes.
- Main against the PR's paths:
  - `git diff --name-only B origin/main --` the three paths is 0 bytes.
  - Main changed under `kernel/` since B: `kernel/src/project/mod.rs`, `kernel/src/project/store.rs`, `kernel/tests/project_lock_crash.rs`, `kernel/tests/project_save.rs`, `kernel/tests/project_store.rs`. None of it is used by this diff: a grep of main's kernel diff for `resolver|dataset_ref|in_canonical_form` finds only `DatasetUri` imports, and `pub mod resolver;` is still at `mod.rs:25` on origin/main.
  - `git merge-tree --write-tree origin/main H` is clean: rc 0, tree d856863b…

**3. §2.11's command** at B...H, rc 0. Output: 1/1, 95/1, 145/0; 241 added and 2 deleted, 3 files. Against item 5 (b):
- `resolver.rs`: 95/1 (96) of 130.
- `dataset_ref.rs`: 1/1 (2) of 5.
- Kernel product group: 96/2 (98) of 135.
- `project_resolver.rs`: 145/0 of 200.
- P1a: 243 lines, 3 files, of 335 and 3.

All of the worker's rows are confirmed, and there is no overrun.

**4. The change against item 5**
- `pub` items added (`grep "^+.*pub"` over the diff): `pub(crate) fn in_canonical_form`, `pub enum CheckRefused`, `pub fn check_inside`. These match 5 (d), and there is no other `pub` item.
- Callers of `check_inside` and `CheckRefused` in code are only `resolver.rs` and `kernel/tests/project_resolver.rs`. That is a producer with no caller yet, pre-committed under ADV-2026-11-16-10 R2.
- Its consumer and seam tests are named:
  - in the doc at `resolver.rs:159-162 at H`;
  - in origin/main `governance/PLAN.yaml` summary, the P1a sentence: "its pre-committed producer is check_inside with its error type, for P3a, seam tests K-R1, K-R2 and K-R4, K-R3 as C-7 restates it (a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open), then E-REOPEN."
  - I read the PR body only as the scratch draft `<S>/pr-p1a-body.md`, which names them. `gh pr view` is outside the network list.
- `make_link` copy (ADV-2026-11-16-18 item 3): `awk` extracts of `fn make_link` from `project_save.rs` at B and at origin/main, and from `project_resolver.rs` at H, are identical (`cmp` rc 0, 16 lines each).
- The walk, clause by clause:
  - text check first (line 165);
  - folder canonicalized (166);
  - `symlink_metadata` only (171);
  - a link refused (175);
  - missing → `Unresolvable` (173);
  - a non-regular final → `NotARegularFile` (179); a non-folder in the middle → `NotADirectory` (182);
  - returns F plus the segments, with `\\?\` from `canonicalize` on Windows (T4 and M4's right-hand side show the prefix).
  - No `cfg` in product code other than `#[cfg(test)]`.
- Display and messages: there is no `Display`, and nothing reaches a user. P3a will map the type.

**5. Tests and P-base**
- T1 to T5 stand at H with the item 5 (c) names. The test file is unchanged between fe162292 and H (0 diff lines).
- Each test asserts what its row says. T1 checks the link both as a folder on the path and as the final segment. T4 checks `\\?\` at run time with `std::env::consts::OS`.
- On Windows, T1 builds a junction only. The symlink case runs off Windows: CI's Ubuntu and macOS jobs (check 9).
- P-base accepted from the logs, not reproduced:
  - `<S>/p1a-base-integ.log`: `error[E0432]: unresolved imports `spatial_kernel::project::resolver::check_inside`, `spatial_kernel::project::resolver::CheckRefused``, status=101.
  - `<S>/p1a-base-lib.log`: E0425 at `resolver.rs:138` and E0433 at `:140`, status=101.
  - Those line numbers match fe162292's `resolver.rs`, where line 123 is `use super::*;` and line 138 is the `check_inside(&folder, at)` call; at H the same lines hold other code. So the log is from fe162292.

**6. Mutations.** All were applied by an anchored `node -e` that refused unless its anchor occurred exactly once. Each was run in a shared hold, then reverted with `git checkout -- kernel/src/project/resolver.rs`. After every revert, `git diff` was 0 bytes and the sha256 was 96c0bc2bb02ac68a62727aee4854a66ab6337127572596aec648307d1572466a, equal to `git show H:` of the file. The list matches item 5 (c) and `<S>/p1a-mutations.mjs` M1 to M5; none differs. Test scratch went to TMP/TEMP = `D:/wt-targets/1c-p1a/g333r-tmp`.
- **M1, the link check skipped.** Diff: `-        if link {` / `-            return Err(CheckRefused::ThroughLink { segment });` / `-        }`. Test rc 101.
  - `test check_inside_refuses_a_link_below_the_folder_naming_its_segment ... FAILED`
  - `panicked at kernel\tests\project_resolver.rs:70:5:` / `assertion `left == right` failed: the link as an intermediate` / `  left: Err(NotADirectory { segment: "data/alias" })` / ` right: Err(ThroughLink { segment: "data/alias" })`
  - Fails at its own assertion: line 70 is the `assert_eq!(`.
- **M2, a missing segment treated as a folder.** Diff: `-            Err(_) => return Err(CheckRefused::Unresolvable { segment }),` / `+            Err(_) => (false, true, false),`. Test rc 101.
  - `test check_inside_refuses_a_missing_segment_as_unresolvable ... FAILED`
  - `panicked at kernel\tests\project_resolver.rs:85:5:` / `assertion `left == right` failed: a missing intermediate` / `  left: Err(NotARegularFile { segment: "data/gone/parcels.parquet" })` / ` right: Err(Unresolvable { segment: "data/gone" })`
  - Own assertion.
- **M3, the kind check skipped.** Diff: both `if last && !file {…}` and `if !last && !dir {…}` removed (6 lines). Test rc 101.
  - `test check_inside_refuses_a_final_that_is_not_a_regular_file_or_an_intermediate_that_is_not_a_folder ... FAILED`
  - `panicked at kernel\tests\project_resolver.rs:109:5:` / `assertion `left == right` failed: a file as an intermediate` / `  left: Err(Unresolvable { segment: "data/real/parcels.parquet/inner.parquet" })` / ` right: Err(NotADirectory { segment: "data/real/parcels.parquet" })`
  - Own assertion.
- **M4, the folder not canonicalized.** Diff: `-    let mut path = std::fs::canonicalize(folder).map_err(|_| CheckRefused::FolderUnresolvable)?;` / `+    let mut path = folder.to_path_buf();`. Test rc 101.
  - `test check_inside_returns_the_engine_path_for_data_reached_without_a_link ... FAILED`
  - `panicked at kernel\tests\project_resolver.rs:137:5:` / `assertion `left == right` failed` / `  left: "D:\\wt-targets\\1c-p1a\\g333r-tmp\\spatial-ide-project-resolver-tests\\t4\\spelled\\..\\data\\real\\parcels.parquet"` / ` right: "\\\\?\\D:\\wt-targets\\1c-p1a\\g333r-tmp\\spatial-ide-project-resolver-tests\\t4\\data\\real\\parcels.parquet"`
  - Own assertion.
- **M5, `in_canonical_form` not called.** Diff: `-    in_canonical_form(at, "$").map_err(CheckRefused::NotCanonical)?;`. Run with `cargo test -p spatial-kernel --lib project::resolver`, rc 101.
  - `test project::resolver::tests::check_inside_refuses_a_non_canonical_at_before_any_file_is_read ... FAILED`
  - `panicked at kernel\src\project\resolver.rs:206:13:` / `data/NUL.parquet: Err(FolderUnresolvable)`
  - Own `assert!`: line 207 at H, one line earlier in the mutated file.
- **X1, an extra probe beyond item 5 (c), disclosed: the walk follows links.** Diff: `-        let (link, dir, file) = match std::fs::symlink_metadata(&path) {` / `+        let (link, dir, file) = match std::fs::metadata(&path) {`. T1 rc 101.
  - `panicked at kernel\tests\project_resolver.rs:70:5:` / `assertion `left == right` failed: the link as an intermediate` / `  left: Ok("\\\\?\\D:\\wt-targets\\1c-p1a\\g333r-tmp\\spatial-ide-project-resolver-tests\\t1\\data\\alias\\parcels.parquet")` / ` right: Err(ThroughLink { segment: "data/alias" })`
  - Reverted the same way: diff empty, sha256 equal.

**7. Runs reused and reproduced**
- Reused, each resting on a log in `<S>`:
  - at 7e763472: `--test project_resolver` 4 passed (`p1a-head-integ.log`, status=0) and `--lib project::resolver` 1 passed, 192 filtered out (`p1a-head-lib.log`, status=0);
  - at 7e763472: `cargo fmt --check` rc 0 (`p1a-fmt-head.log`, 0 bytes);
  - at fe162292: P-base (`p1a-base-*.log`).
- Lock-file diff: re-checked by me at H, rc 0.
- Reproduced: nothing. I had no doubt about any of it.
- New at H, by me: M1 to M5, X1, and clippy.
- No timing-dependent failure was seen.

**8. Light runs** from `<W>`:
- `node scripts/plan/verify-test-claims.mjs`: rc 0, "verify:test-claims PASS — all 826 claimed test(s) across 271 file(s) …".
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".

**9. CI** (`gh pr checks 333` at 21:32:17Z, rc 8 for the pending jobs; read again at 21:42:23Z: 19 pass, 1 pending). Head SHA from `gh run view`:
- Push runs at 7e76347271780d20103bb3b4b36b8650a0967456, all success: 44267900966 (Rust workspace), 44267900969, 44267900983, 44267900985, 44267901029.
- Pull-request runs at the same head: 44401138272, 44401138364, 44401138400, 44401138414, 44401138448, 44401138527 all succeeded. 44401138203 (Rust workspace) was queued: Ubuntu and macOS had passed by 21:42Z, and Windows was still pending.
- `project_resolver`, all four tests and T5 `ok`, ran in run 44267900966's logs on Ubuntu (job 134676895842, the symlink case), macOS (job 134676895665, the symlink case) and Windows (job 134676895804, the junction case).
- No red or cancelled run is visible among H's checks. I could not list runs on the earlier branch commit fe162292: `gh run list` is outside the network list. A red run there is likely, since the tests did not compile at that commit.

**10. End**
- `<W>`: HEAD 7e763472…, porcelain 0 bytes.
- No `C:/dev/wt/1c-p1a-g333r` was made.
- `df -h /c /d`: C: 49G free, D: 360G free.

## Holds (`date -u` before the call and after its release; every `also=` value is shown as `<m>`; no MACHINE_WAITING or MACHINE_ERROR line; no exit 96 to 99)
1. M1: 21:32:12Z to 21:33:45Z.
2. M2: 21:34:04Z to 21:35:05Z.
3. M3: 21:35:19Z to 21:36:07Z.
4. M4: 21:36:25Z to 21:37:15Z.
5. M5: 21:37:55Z to 21:38:29Z.
6. clippy: 21:39:21Z to 21:40:43Z.
7. X1: 21:40:56Z to 21:41:30Z.

Each hold line reads `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …`, and each release line `MACHINE_RELEASED project=<m> …`.

## Departures, disclosed
- `git merge-tree --write-tree` wrote unreferenced objects into the main checkout's object store. No file in the checkout changed.
- Test scratch folders remain in `D:/wt-targets/1c-p1a/g333r-tmp`.
- X1 and the clippy run go beyond the brief's list. Each ran in a hold.

## Drafts for the advisor
None. The diff adds no wording a user sees.

## Background shells left
None. All seven hold calls ended with their notifications.

## Model
Opus 5.5 (claude-opus-5-5).
