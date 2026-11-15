Reviewed: PR #280 at bbb786e42c39396647ab0e8f282ca7d1943b463d (base 13e6dfbd), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/open-dataset-close-serialised-under-the-catalog-lock @ bbb786e42c39396647ab0e8f282ca7d1943b463d

## Findings

### Correctness: none
I read the lock order across the latch (L), the catalog lock (C), `GenerationRegistry.inner` (G) and `watches` (W) and found no deadlock.
- **Open:** takes L, then C(read). G is reached only through `mint_for_open`, and G is a leaf: `mint_for_open` and `forget_dataset` at kernel/src/skp.rs:574-593 and :827-837 never call out. W is taken under C(read). L is dropped before W.
- **Close:** takes C(write), then G (kernel/src/skp.rs:1626-1636). It holds no other lock while it waits for C(write). Step 0 and the late removal hold W alone, and each drops its record after W is released.
- **`describe`:** takes C through `get`, releases it, then takes W (kernel/src/skp.rs:1338-1346). There is no C/W nesting.
- **Sink:** the Admitted arm drops L before `end_generation`, which takes G and then T, never C.
- **Close's refusal path:** it returns before the write section, so the late removal never runs there. It cannot strand a record. A close refuses only when the catalog lacks the name, and an admission inserts a record only after it has seen the name under C(read).

### Evidence: none

### Documentation (must-fix before the merge, no re-gate; none of these is the human's wording)

**D1. The M-T2 record's label differs from the form.**
- What is wrong: the form's Tests+mutation line records each observed mutation "in a `RECORDED MUTATION:` doc line". T2's doc uses `OBSERVED MUTATION (M-T2, not registered):` instead. That label appears nowhere else in the tree (grep over kernel, engine, protocol and frontends finds one hit). No script parses either label: `scripts/plan/verify-mutation.mjs` names `RECORDED MUTATION` only in its line-20 comment.
- Where: kernel/src/skp.rs:5071 @ bbb786e4.
- The fix: replace `OBSERVED MUTATION (M-T2, not registered):` with `RECORDED MUTATION (M-T2, not registered):`. The two are the same length, so nothing reflows.
- Clause check:
  - "RECORDED MUTATION" is the label the form's line names.
  - "not registered" matches the form's "observed but not registered".
  - The rest of the line is unchanged, and my run below confirms it: T2 passed and T1 failed on `the close removed the record`.
- Whose words: the worker's doc comment, not the human's.

**D2. "a close lands wholly before the check or wholly after the insert" says more than the code does.**
- What is wrong: only the close's steps 3 and 4 run under the write guard (kernel/src/skp.rs:1626-1636). Steps 0 to 2 can run before an admission's check while steps 3 and 4 run after its insert: step 0's removal, the `get` check at :1609, `begin_close` and `cancel_all_for_dataset`. That case is exactly the one the late removal at :1643-1648 exists for.
- Why it does not block: the outcome equals a close made wholly after the insert. Nobody but the open's caller holds the name before the open returns, and per form note 2 the interleaving is unreachable in the shipped app. Read literally as a statement about the whole call, though, the sentence is not true.
- Where:
  - kernel/src/skp.rs:1197-1198 @ bbb786e4, the admission comment.
  - protocol/skp/SKP-V0.md:55 @ bbb786e4. These are the form note 6 words, which the form says are not the human's ("it is the reviewer's and the architect's").
- The fix for kernel/src/skp.rs:1197-1198: replace those two lines with
  ```
          // generations or `watches`), so `close_dataset`'s `forget_dataset` and removal, under
          // the write guard, land wholly before the check or wholly after the insert.
  ```
- The fix for protocol/skp/SKP-V0.md:55: replace the line with
  `<!-- The refusal above is made in SkpHost::open_dataset's Watching and ChecksOnly arms, at one check under the catalog's read guard, held through the mint and the OpenRecord's insert; close_dataset holds the catalog's write guard across forget_dataset and the name's removal, so those two steps land wholly before the check or wholly after the insert, and a record inserted before them is removed before the close returns. Neither interleaving is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. -->`
- Clause check:
  - "one check under the catalog's read guard" in both arms: kernel/src/skp.rs:1261-1267 and :1305-1310.
  - "held through the mint and the OpenRecord's insert": `drop(catalog)` at :1284 and :1326 comes after the mints (:1269-1271, :1311-1313) and the inserts (:1274-1283, :1316-1325).
  - "write guard across forget_dataset and the name's removal": :1626-1636.
  - "those two steps land wholly before the check or wholly after the insert": the RwLock makes C(write) exclusive of C(read).
  - "a record inserted before them is removed before the close returns": the late removal at :1643-1648. My M1 run, `a_record_inserted_during_a_close_is_removed_before_the_close_returns`, fails without it.
  - "minted from the OS CSPRNG": `getrandom::fill` in protocol/skp/src/v0/handles.rs `mint_hex_id`.
  - "returned only by this open": :1330-1333.
  - "Catalog::names has no product caller": `.names()` over kernel, engine, protocol, frontends and renderer hits only tests and the projection's own `names()` at kernel/src/publish/mod.rs:530.
- After this edit, line 55 no longer equals the form's note 6 words byte for byte. Under §31, the PR body lists these words as applied.

## Checks

### 1. The diff
- `git diff 13e6dfbd...bbb786e4`: rc=0, 255 lines.

**Watching arm**
- C(read) is taken at kernel/src/skp.rs:1261. That is after the signal refusal (:1217-1252), after `resolves_unchanged` (:1216) and after the refusal's `catalog.remove` at :1224 (constraint 1).
- The check uses the guard's own `contains_key` (:1262).
- On refusal it uses `SkpError::unknown_dataset` and drops in this order: `drop(catalog)`, `drop(guard)`, `drop(watch)` (:1263-1266). That is before any mint.
- On success it mints (:1269-1271) and inserts (:1274-1283), then `drop(catalog)` (:1284).
- No `Catalog` method runs under the guard (constraint 3).

**ChecksOnly arm**
- Same shape at :1305-1326, after its signal refusal (:1294-1302).

**Close**
- C(write) is taken after `cancel_all_for_dataset` (:1622) and spans only `forget_dataset` and `catalog.remove` (:1626-1636, constraint 2).
- `removed_dataset` is dropped after the guard is released (:1639).
- The late record is removed under W and dropped after W is released (:1643-1648). The `let` statement's temporary guard ends at the semicolon.

**Comments**
- The lock-order doc (:1003-1012), the close's two ordering comments (:1623-1625, :1637-1642) and step 0's comment (:1595-1602) are true of the code.
- The admission comment is true except for D2.
- `git diff 13e6dfbd bbb786e4 -- kernel/src/lib.rs`: rc=0, 0 bytes. The piece calls the existing private `lock_read` and `lock_write` (kernel/src/lib.rs:163-168).

**Nothing else added**
- The added lines contain no new `pub` item, no `unsafe` and no non-test string.
- Name-only shows the 2 Scope files and no manifest.

**SKP-V0**
- Only line 55 changed.
- `git show bbb786e4:protocol/skp/SKP-V0.md | sed -n '55p'` was compared with the form's line 108 words (`  - My words for it: ` and the backticks stripped). `cmp` rc=0. Both are 517 bytes, sha256 d79690b5d96233bd8e0ea24cb3c4714705a1b79ff348d350563aa8b1e4c8b3e3.

**Size**
- `git diff --numstat 13e6dfbd...bbb786e4`: rc=0. `133 26 kernel/src/skp.rs`, `1 1 protocol/skp/SKP-V0.md`, 161 lines in total. That matches Amendment 1 (161 against 145, overrun 16).
- By commit (`git show --stat`, rc=0): 14c6b664 is 67+24 = 91, d95baf4d is 57+3 = 60, bbb786e4 is 10+0 = 10. Each touches only the two Scope files.

**Bytes**
- Counted by node over the 134 added lines. The counter was checked first on a planted file and found its CR, its tab and its non-ASCII byte. Git Bash grep missed the planted CR, so its count was not used.
- Added lines: CR 0, tab 0, non-ASCII 5 bytes. These are one em dash, carried from the removed lock-doc line, and one `§`, both intended.
- Both files at the head end in LF. The diff has no "No newline" marker.

### 2. The head (worktree, target D:/wt-targets/odcl, shared holds)
- `timeout 1800 cargo test -p spatial-kernel --locked`: rc=0.
  - 48 `test result:` lines, all ` 0 failed`. `FAILED` or `panicked` appear 0 times.
  - lib: `test result: ok. 167 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 2.59s`.
  - Passing by name (`... ok`): `a_record_inserted_during_a_close_is_removed_before_the_close_returns`, `a_close_during_open_admission_refuses_the_open_and_mints_no_generation`, `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` (T1) and `a_close_drops_its_watch_before_it_returns` (T2).
  - The rest of the regression set also passes: CR1 `the_close_race_mints_no_generation_so_no_unheld_reference_exists`, CR2 `a_viewport_query_inside_close_is_refused_before_it_builds_or_mints`, CR3 `a_ticket_minted_before_close_and_attributed_after_it_refuses_as_unknown_dataset`, CR4 `an_end_reaching_invalidate_after_close_leaves_no_mark_and_emits_nothing`, R2 `a_closing_dataset_refuses_new_attributions_but_still_records_an_end` and `a_close_between_liveness_and_redeem_keeps_redeems_wording`, E7 `a_pending_drop_inside_close_emits_once_with_its_session_reference`, and E8 `an_end_recorded_before_forget_dataset_and_enqueued_after_it_carries_its_reference`.
- `timeout 290 cargo fmt --all -- --check`: rc=0, no output.
- `timeout 1800 cargo clippy -p spatial-kernel --locked --tests --no-deps`: rc=0. 33 warning or error lines. The only one in skp.rs is `type_complexity` at kernel/src/skp.rs:277, an unchanged line. None falls on a changed line, and none is in protocol/.

### 3. Mutations
**Setup**
- `git archive bbb786e4` into the new D:/wt-targets/odcl-g1r-export with `tar --force-local`: rc=0. The export's skp.rs sha256 is a42584dd01839e5b4ae0dbb784372007e4e2453f002d69e0ac00474ec40dbdf2, equal to `git show bbb786e4:kernel/src/skp.rs`.
- Cold build in a hold with no timeout: `CARGO_TARGET_DIR=D:/wt-targets/odcl-g1r-target cargo test -p spatial-kernel --locked --lib --no-run`, rc=0, `Finished ... in 12m 00s`.

**M1**
- Deleted lines 1640-1648 of the export's skp.rs (the late removal and its comment). `git diff --no-index --stat` shows 9 deletions.
- `timeout 1800 cargo test -p spatial-kernel --locked --lib a_record_inserted_during_a_close_is_removed_before_the_close_returns`: rc=101.
  - The kernel recompiled.
  - `test skp::ticket_drop_under_lock_regression::a_record_inserted_during_a_close_is_removed_before_the_close_returns ... FAILED`
  - `panicked at kernel\src\skp.rs:5132:9:` / `the close removed the record inserted during it`. Line 5132 is :5141 shifted by the 9 deleted lines, i.e. the no-record assertion.
  - `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 167 filtered out`.
- Restored by `git show bbb786e4:kernel/src/skp.rs`: sha256 a42584dd... is equal.

**M-T2**
- Deleted lines 1603-1608, step 0's `let removed_watch ... drop(removed_watch);`. The diff shows 6 deletions, exactly those lines.
- `... --lib a_close_drops_its_watch_before_it_returns`: rc=0. The kernel recompiled. `... ok`, `test result: ok. 1 passed; 0 failed; ... 167 filtered out`.
- `... --lib a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch`: rc=101. `... FAILED`, `panicked at kernel\src\skp.rs:5045:9:` / `the close removed the record`, `test result: FAILED. 0 passed; 1 failed; ...`.
- Restored: sha256 a42584dd... is equal.

**Not run, as the brief directs:** R-M2 to R-M5 and the placement mutation.

**Cleanup:** `rm -rf` of both directories, rc=0 each. `ls` of each afterwards gives rc=2, so both are gone.

### 4. The tests' soundness
**`a_record_inserted_during_a_close_is_removed_before_the_close_returns` (kernel/src/skp.rs:5107-5149)**
- It opens through `no_watch_arm`, so it goes through the ChecksOnly arm and exercises the new ChecksOnly check on its success path.
- It mints a `Pending` ticket for the open's name directly through `host.tickets().mint(&name, Box::new(racing), Arc::new(NoopCancel))`.
- `close_dataset` runs on the test's own thread. Its `cancel_all_for_dataset` retires that ticket and drops `retired` after the tickets guard is released (:399-402). That is close-races' drop point, after step 0 and before the write section.
- The `RunOnDrop` closure then inserts into the private `watches` map one entry, keyed by the dataset name: `OpenRecord { watch: Some(Box::new(FlagWatch(flag))), coverage: CoverageOutcome::Watching }`. Step 0 had already removed the open's own ChecksOnly record.
- There is no sleep, retry, spawned thread, join or timeout (grep over :5096-5149 finds 0).
- The fixture `record-inserted-during-close` and the cancel key `record-inserted` appear only in this test, and the host is the test's own. Nothing is shared under parallel threads.
- The test's `Arc<SkpHost>` clone inside the ticket is released when the close drops the ticket.
- Whether the private-state write stands (OPEN-1) is the architect's ruling.

**The records**
- M1's line (:5104-5106) names the mutation and d95baf4d603a3d8c4c3cca1a60a773b474c22bfe, and claims only that this test FAILED at the named assertion.
- M-T2's line (:5071-5075) names the mutation and the same commit. It claims T2 PASSED and T1 FAILED on `the close removed the record`; both reproduced above. It claims nothing about other tests. Its label is D1.
- R-M2 to R-M5 and the placement mutation are claimed nowhere in the diff.
- The 5b test's doc (:5221-5226) says the windows are shown by reading, not by a test.

### 5. The verify scripts and CI
- `node scripts/plan/verify.mjs --offline`: rc=0, `verify:plan PASS`.
- `verify-cites.mjs`: rc=0, `verify:cites PASS ... 2611 file(s) ... (82 loose reference(s) advised above.)`
- `verify-quotes.mjs` (timeout 580; it went to the background and finished): rc=0, `verify:quotes PASS — 135 checked, 104 verified, 30 baselined, 1 advisory, ... 0 ruling-cite errors.`
- `verify-test-claims.mjs`: rc=0, `verify:test-claims PASS — all 729 claimed test(s) across 229 file(s) ...`
- `gh pr checks 280`: rc=0, every check pass. `gh pr view`: head bbb786e4, draft.
- `gh run view` for all 12 runs (each rc=0): headSha bbb786e42c39396647ab0e8f282ca7d1943b463d, completed, success. These include Product CI Rust workspace 41766413594 (push) and 41770339157 (pull_request).
- The new test, from the job logs (each `gh run view --job --log` rc=0): `test skp::ticket_drop_under_lock_regression::a_record_inserted_during_a_close_is_removed_before_the_close_returns ... ok` on ubuntu-24.04 job 126378314309 and windows-latest job 126378314537 (run 41770339157). It also passes on ubuntu-24.04 job 126365713984 and windows-latest job 126365714187 (run 41766413594).
- No run was in progress, so no wait was needed.

## Hold lines (own project only, `also=` elided)
Seven shared holds: the suite, clippy, the cold build, M1, M-T2 on T2, M-T2 on T1, and one more M-T2 on T1 call that was the same run. Each printed `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> (commands started from now on inherit it; release when done)` and then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. None was refused, and no exit code was in 96-99.

## Background shells
All seven background tasks completed: the suite, clippy, verify-quotes, the cold build, one wait loop the harness moved to the background, M1, and M-T2 on T2. Their completion notifications arrived, and I killed nothing. `tasklist` shows no cargo.exe running.

## End state
- Worktree C:/dev/wt/odcl: HEAD bbb786e42c39396647ab0e8f282ca7d1943b463d, `git status --porcelain` 0 bytes (rc=0).
- D:/wt-targets/odcl-g1r-export and D:/wt-targets/odcl-g1r-target are gone (ls rc=2 each).
- No commit, push, PR action or file write outside the scratch folder (`odcl-g1r-*` files), the export and the two targets.
