Reviewed: cut/cancel-stamp-order at 74c06805a61c64485d9bed90118c4aedfa27d9a5 (the custodian's filing note, 2026-11-22: PR 350's narrow read of the merge of main 51a1c84dd8502c5b9a7295e113f78101923d9c01, the entries' commit 315e44d3cf3ad5f35f4dc33910708bef9e263669 and the words commit, by ADV-2026-11-22-10 item 5 and the form's Amendment 3 item 5; Read 2, Bash 40, SubagentHandback 1, by unique call ids, 3 calls errored, each a script of its own redone; model claude-opus-5-5, from 2026-11-22T13:45:21Z to 2026-11-22T14:01:31Z by its transcript; no call named the main checkout; no compaction; the report below from its hand-back, 9673 bytes, sha256 38960e93b6aefc0bc4c8298e1f9ee9a8f74712ee259a082a5aa5993687450cf5, byte for byte.)

---

Verdict: PASS WITH NOTES, PR #350 narrow read @ 74c06805a61c64485d9bed90118c4aedfa27d9a5
(Branch cut/cancel-stamp-order @ 74c06805a61c64485d9bed90118c4aedfa27d9a5. Everything was read in `C:/dev/wt/gate-read`, detached at that commit, and the governing texts with `git show 069b91e0:<path>`.)

## Correctness
None. Nothing blocks.

## Evidence
None. Nothing blocks. Two Windows CI jobs were still pending when I read; see N1.

## Documentation
None that must be fixed. D1 to D4 are applied as the architect's report gives them (check 3).

## Notes
- N1. **Two Windows CI jobs still pending.** At 2026-11-22T14:00:48Z (`date -u`), `cargo test --workspace (windows-latest)` was still pending in both runs at the head: run 45028975594 (push) and run 45028979947 (pull_request). Both runs have headSha 74c06805. Every other check passes. The merge check must read both green. My own Windows run of the two kernel binaries passed (check 4).
- N2. **The architect's cancel.rs line cites have moved by one line at the head.** D3 added one line to the doc comment above `cancel`, so the cites below it are one higher. The mark is now at :202, not :201, and `drop(publish)` at :209, not :208. The store at :98 and trace.rs :98 and :313 are above the edit and unchanged. The report's cites are read at 3f3820c9. A closing amendment that cites these lines must pin them at a commit.
- N3. **The errored call: no effect.** The worker's transcript (`agent-a6deee08d44c684f1.jsonl`, the call at 2026-11-22T13:38:17.554Z, in C:/dev/wt/cancel-stamp) is `sed -n 144,152p … | awk length; grep -n "max_width\|comment_width" rustfmt.toml .rustfmt.toml 2>/dev/null`.
  - It still printed the widths `7 100 101 99 98 93 98 89 26`. These are before the edit, and line 146 is the 101.
  - Only the `grep` set exit 2, because the repo has no rustfmt.toml or .rustfmt.toml: `git ls-files | grep -i rustfmt` finds only records, and `ls` finds neither file. So rustfmt runs on its defaults.
  - After the edit, lines 145 to 152 are 100, 96, 98, 94, 100, 99, 92 and 16 characters, all within 100. Line 150 is 101 bytes because of its em dash.
  - `cargo fmt --check` passes in my run and in CI.
  - The worker's report was silent on the call, but nothing it says depends on that `grep`.
- N4. **Tracked files in gate-read.** `verify-cites` writes no tracked file. The export was cleaned by `checkout-index` (`git status --porcelain` count 0). No write was made in gate-read: its `git status --porcelain` is empty.

## Checks
1. **The merge.**
   - `git log -1 --format='%P%n%B' 51a1c84d`: the parents are `3f3820c9eddaca61d503c76e8d2308e50c6a8667 069b91e07b2ab8f1aa3670f804cbed8c60dfa511`. The subject is "chore: merge main at 069b91e07b2a into cut/cancel-stamp-order", and it carries a Signed-off-by.
   - `git diff 069b91e0 51a1c84d --stat`: 10 files, the same set as `git diff --name-only 4b7655a2 3f3820c9` (sorted diff, SAME_SET).
   - Each of the ten has the same blob at 51a1c84d as at 3f3820c9, so the merge took the branch side unchanged.
   - `git diff 3f3820c9 51a1c84d --stat`: 42 files, exactly the set of `git diff --name-only 4b7655a2 069b91e0` (sorted diff, SAME).
   - The branch's files and main's files since 4b7655a2 (the merge base) do not overlap (`comm -12` is empty). No conflict was resolved by hand.
2. **The entries.** The script is `<S>/cstn-work/entries.js`, run on 315e44d3. For each of the ten:
   - The token occurs on its citing line, at form :13 (×2), :169 (×2), :170, :174 and :175, at timing-tests consult :18 (and :64), and at flake-hunt :64 and :65.
   - `git blame --porcelain -L n,n 315e44d3` gives 16c896558ac9… (seven form cites), b3beb0f77395… (both lines in the timing-tests consult) and 1c13810fa112… (two flake-hunt cites).
   - At each blame commit the cited file exists: skp_admission.rs has 950 lines and skp_filter_cancellation.rs 282, so every cite's last line holds there. The filed-commit branch of the rule applies.
   - Each entry's commit equals its blame commit in full, and each is an ancestor of 74c06805 (rc 0).
   - The cited lines do not resolve at the head (910 and 253 lines), so the list is needed.
   - `git show --stat 315e44d3`: one file, `scripts/plan/verify-cites-shortened-target.json`, +12 −1.
   - `$doc` is unchanged: the parsed values are equal, and the 363-byte prefix before `"entries"` is byte-identical. `file` reports JSON text with no CRLF. There are 10 entries.
   - `node scripts/plan/verify-cites.mjs` at 74c06805 (gate-read): rc 0. Last line: `verify:cites PASS — every rooted (in-tree) path:line reference across 3591 file(s) resolves. (219 loose reference(s) advised above.)`
   - At 315e44d3, in an export (`<S>/cstn-export`: a shared bare clone with HEAD set by update-ref, read-tree, checkout-index and longpaths on; status clean, rev-parse 315e44d3): rc 0, with the same last line.
   - At 51a1c84d in the same export: rc 1, and the FAIL block names exactly the ten cites. So Amendment 3 item 2's stop condition did not occur.
   - Tampered control at 315e44d3, with the `skp_admission.rs:923` entry removed: rc 1, and it fails on that cite. The file was restored afterwards.
3. **The words commit.**
   - `git show --stat 74c06805`: four files (cancel.rs, cancel_request_stamp.rs, skp_admission.rs, skp_filter_cancellation.rs), 16 lines added and 12 deleted. It is signed off.
   - D1: skp_admission.rs lines 761 to 765 at the head match the architect's report lines 61 to 65, once the wrapping is removed (`cmp`, rc 0). The old lines 762 and 763 are the only lines replaced.
   - D2: skp_filter_cancellation.rs lines 113 to 116 match the report lines 74 to 77 (`cmp`, rc 0).
   - D1 and D2 clause check: the stamp comes before the publication (mark at cancel.rs:202, `drop(publish)` at :209; PublishOnDrop's SeqCst store at :98 is the only store to `cancelled`, `git grep`). The clock assumption is stated in ADR-018's note of 2026-11-22, at line 155. `CURRENT` is process-wide (trace.rs:98, `mark_cold` at :313). All hold.
   - D3: the old paragraph's words, with "so the stamp precedes every observer that loads the flag" replaced by "so the stamp happens before every load of the flag that finds it set", equal the new paragraph's words, compared by script with whitespace normalised. The only removed or added lines in cancel.rs are `///` lines of that one comment.
   - D3 widths (characters), lines 145 to 152: 100, 96, 98, 94, 100, 99, 92, 16. Before the edit, lines 145 to 151 were 100, 101, 99, 98, 93, 96, 89.
   - D3 clause: the mark is sequenced before the only store. A SeqCst load that reads true synchronizes with that store, so the mark happens before that load. This holds.
   - D4: cancel_request_stamp.rs:197 is exactly `"a segment opening on the request is derivable for a token whose drop came first"` (script, true), and its indentation is unchanged. `segment_ms(...).is_none()` is the predicate.
   - Clippy line: only `spins % 1024 != 0` became `!spins.is_multiple_of(1024)`, and the rest of the line, `|| Instant::now() < deadline,`, is unchanged. `spins` is `u32` (`let mut spins: u32 = 0;`). For unsigned integers with a non-zero divisor, `is_multiple_of(1024)` is `spins % 1024 == 0`, so its negation has the same truth value for every u32. The short-circuit is also the same. The toolchain is rustc 1.97.1, and `is_multiple_of` is stable for unsigned integers.
4. **The runs.** All four ran in one shared hold, 13:57:04Z to 14:00:39Z, with CARGO_TARGET_DIR=D:/wt-targets/cancel-g1, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. The hold printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF … also=<m>`, then `MACHINE_RELEASED project=<m>`. There was no MACHINE_WAITING or MACHINE_ERROR line, and the outer exit was 0.
   - `cargo fmt --all -- --check`: rc 0, no output (0 bytes).
   - `cargo clippy -p spatial-engine --tests`: rc 0. Last line: ``Finished `dev` profile [unoptimized + debuginfo] target(s) in 50.83s``. `manual_is_multiple_of` occurs 0 times. The one warning is `variant name ends with the enum's name` at engine/src/app_dirs.rs:39, outside the Scope.
   - `cargo test -p spatial-engine --test cancel_request_stamp`: rc 0. `test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.45s`
   - `cargo test -p spatial-kernel --test skp_admission --test skp_filter_cancellation`: rc 0. skp_admission: `test result: ok. 10 passed; 0 failed; … finished in 5.63s`. skp_filter_cancellation: `test result: ok. 1 passed; 0 failed; … finished in 47.93s`. There was no timing failure.
5. **The count.** `git diff --numstat 069b91e0...74c06805` over the eleven Scope paths gives 11 rows and a total of 726, within the 800 ceiling. The merge base is 069b91e0, so main's changes are not counted. The whole three-dot range touches exactly 11 files, so nothing is outside the Scope.
6. **CI.** `gh pr checks 350` at 2026-11-22T14:00:48Z (an earlier read at 13:57:07Z gave the same): rc 8. The only checks not passing are the two pending `cargo test --workspace (windows-latest)` jobs (N1). All others pass, including fmt, signed-off, verify:plan, macOS/Ubuntu L1, tauri build and ported-notices.

Files:
- C:\dev\wt\gate-read\engine\src\cancel.rs
- C:\dev\wt\gate-read\engine\tests\cancel_request_stamp.rs
- C:\dev\wt\gate-read\kernel\tests\skp_admission.rs
- C:\dev\wt\gate-read\kernel\tests\skp_filter_cancellation.rs
- C:\dev\wt\gate-read\scripts\plan\verify-cites-shortened-target.json
- The logs are in `<S>/cstn-work/` (fmt.log, clippy.log, test-engine.log, test-kernel.log, rcs.txt, vc-head.log, entries.js, runs.sh) and `<S>/cstn-export/` (vc-315.log, vc-merge.log, vc-ctl.log).

Model: Opus 5.5 (claude-opus-5-5).
