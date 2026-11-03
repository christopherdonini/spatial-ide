*Custodian's filing note (2026-11-03): the build of `posix-backslash-in-shared-path-logic` (filler 7b) by a worker on `cut/posix-backslash-in-shared-path-logic` from b900c712, head 9999ef4d, under its five-line form `governance/forms/kernel/POSIX-BACKSLASH-IN-SHARED-PATH-LOGIC-PREREGISTRATION.md`. The custodian's check by git: origin's branch is at 9999ef4d, ten commits on b900c712, the three Scope files and no other, 160 lines (the form's Amendment 1, class 6); CI at the head, five workflows, each success (the Rust workspace run 41728423442). The run 20:14:52Z to 22:32:22Z by its transcript: Bash 109, Read 6, Edit 21, Write 12 (the Scope files, and its message and wait files in the custodian's scratchpad); one Monitor call refused as no such tool, one Bash call (a sleep of 240 s before a tail) refused by the harness, one Edit refused as its file had changed since it was read, and two cargo runs exiting 101; five pushes of its branch, three revert commits each by `git revert --no-commit` and a commit, two `git checkout --` of one Scope file each after its local mutation, and no reset, rebase, amend, force, PR action or claude command. Every run id, job id and byte-copied failure line the report names appears in a tool result of the transcript. One slip in the report: its Commits heading says 11, while its list and git give ten. No process of its was running when the custodian looked after the hand-back (before 22:35Z, by command line). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 2d434ed330ef94d3ced951764582f25173775c7bea6e84384787ae0b6f5cfb6a.*

---

Built: posix-backslash-in-shared-path-logic at 9999ef4dc451211a96733548eac333b343f6d158 (branch cut/posix-backslash-in-shared-path-logic, worktree C:/dev/wt/pbsl; no PR action taken)

**Setup:** base b900c71219aff87beab709a371998681460e4a14. `.cargo/config.toml` sha256 is 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, equal to the brief's. The form's sha256 is 881ce2de..., as briefed. The brief's sha256 was 95db890d.... The form's cited lines in the two existing Scope files had not moved.

**Commits (11, all `-s`):**
1. 73aeb5b6 fix: the two sites map only the platform's separators
2. 724cb1fb test: T1 T2 T3 and the platform spelling of the existing normalize tests
3. 1949a5ce test: M4 and M5 recorded
4. a47d8f72 M1 temporary (the mutation commit)
5. d441774c revert of M1
6. cd29f057 M2 temporary
7. 761ff213 revert of M2
8. 2618f4b7 M3 temporary
9. 33102721 revert of M3
10. 9999ef4d test: M1, M2 and M3 recorded beside T1 and T2

That is ten commits as briefed; `git log origin/main..HEAD` lists the nine above plus the first commit, 73aeb5b6.

**Product changes (lines at base):**
- `normalize.rs`: step 2 (line 80) is now `to_slashes(&stripped)`.
- `normalize.rs`: new private `to_slashes`, built on `std::path::is_separator`.
- `normalize.rs`: `roots_from_environment` (116) delegates to a private `roots_from(lookup)`, which reads each root through `to_slashes`.
- `normalize.rs`: the step-2 doc now says why.
- `viewer_assets.rs`: the walk's relative name (134-135) maps only what `is_separator` names, with a short comment.
- No cfg form, no signature or caller change, no unsafe, no new dependency.

**Tests:**
- T1 `a_posix_backslash_stays_a_name_byte_in_a_profile_root_and_a_destination` has three assertions:
  - `roots_from` with HOME `/home/x\b` gives that root unrewritten.
  - `/home/x\b/out` becomes `<user-home>/out`.
  - `/home/x/b/out` stays as it is.
  - It is ignored on Windows.
- T2 `a3_1b_..._refused_not_renamed` has A3-1(b)'s body byte for byte, with a reworded ignore reason and doc. It is ignored on Windows.
- T3 `a_nested_viewer_asset_is_named_with_forward_slashes_on_every_platform` asserts `["assets/app.js", "index.html"]`, on every platform.
- `a_user_profile_destination_becomes_a_token` and `a_unc_path_keeps_its_share_form` are ignored off Windows.
- `norm` feeds this platform's separator. The non-ASCII test takes forward-slash inputs.

**M4 and M5 (Windows, each inside a hold, observed at 724cb1fbd65952d371c575620f51500b8eccb3fe):**
- M4, byte-copied: `a nested asset is admitted: ViewerAssetPathRejected { path: "assets\\app.js", detail: "contains a backslash; bundle paths use forward slashes only" }`. It panicked at `kernel\tests\posix_backslash_in_shared_path_logic.rs:64:47`.
- M5, byte-copied: `left: "C:\\Users\\someone\\out"` and `right: "<user-home>/out"`, from `normalize.rs:240:9`.
- After each revert the file was byte-equal to commit 2 by sha256. Those hashes are 06675a26... for `viewer_assets.rs` and 0a581227... for `normalize.rs`.

**CI (product-ci-rust; the two jobs are windows-latest and ubuntu-24.04):**

| Run | Head | Windows job | ubuntu-24.04 job |
|---|---|---|---|
| 41716300536 (base) | 1949a5ce | success, 126197068073 | success, 126197069097 |
| 41719825618 (M1) | a47d8f72fb5ea7b939dbb417e05d8ca2255977a2 | success, 126209331619 | failure, 126209332158 |
| 41722839219 (M2) | cd29f057aeb2b98da60f37ff380de7e947fd529e | success, 126219815874 | failure, 126219815352 |
| 41725054647 (M3) | 2618f4b7700fab1f6bcc8c4a18a633a801e5a856 | success, 126227537485 | failure, 126227537123 |
| 41728423442 (final) | 9999ef4d | success, 126239155300 | success, 126239156059 |

- In the base and final ubuntu-24.04 logs, T1, T2 and T3 each read `... ok`. The two Windows-syntax tests show as `ignored, boundary: path syntax (std::path::is_separator); ...`.
- The base windows log shows T3 `ok`, and the `--list --ignored` listing names T1 and T2.
- M1, byte-copied, from `normalize.rs:333:9`: `left: "/home/x/b/out"` and `right: "<user-home>/out"`. That is T1's second assertion. The binary's result line is `162 passed; 1 failed; 3 ignored`.
- M2, byte-copied, from `normalize.rs:331:9`: `left: [("/home/x/b", "<user-home>")]` and `right: [("/home/x\\b", "<user-home>")]`. That is T1's first assertion.
- M3, byte-copied: `the file `a\b.js` was admitted and renamed; the published paths are ["a/b.js", "index.html"]`. It came from `posix_backslash_in_shared_path_logic.rs:47:13` in T2. The binary's result line is `1 passed; 1 failed`, and T3 was the one that passed.
- After each revert the three files were byte-equal to commit 3 by sha256. Those hashes are 7522e5c3..., 06675a26... and 987fb4cb....

**Checks at head (all exit 0):**
- `cargo test -p spatial-kernel --locked`: 47 result lines, 391 passed, 0 failed, 44 ignored.
- `cargo clippy -p spatial-kernel --locked --tests --no-deps`: nothing printed for the three Scope files. It has existing warnings in other test targets.
- `cargo fmt --all -- --check`.
- `verify.mjs --offline` PASS.
- `verify-cites.mjs` PASS.
- `verify-quotes.mjs --show-cites <3 files>` PASS (0 checked).
- `verify-test-claims.mjs` PASS.
- `cfg-boundary.mjs`: 18 sites in 6 files, 0 outside every boundary. The main checkout reads the same, so the count is unchanged.
- At the first commit's own run, no test changed outcome on Windows.

**Disclosures:**
- **Size:** `git diff --numstat origin/main...HEAD` over the three files gives 66+7 (`normalize.rs`), 5+1 (`viewer_assets.rs`) and 81+0 (new test file). That is 160 against the Scope's 140, an overrun of 20. About 25 of the lines are the RECORDED MUTATION doc lines, which the form's estimate did not count. I reported it and did not trim.
- **Mutation reviews:** M4 and M5 were applied on Windows at 724cb1fb. Their records name that commit.
- **Edit tooling:** the tool collapsed backslashes once, in a sed for M1. I caught it from the diff before committing, and the committed M1 is correct.

**Stop rules:** none met. I touched nothing outside the three Scope files and no workflow. Every CI run failed only where predicted, and none was cancelled.

**Holds:** my own project only, all shared (`hold shared -Project SpatialIDE`), none refused.
1. The cold first test run.
2. The test run and the `--list --ignored` listing.
3. M4.
4. M5.
5. The final test and clippy run.
Every hold was released.

**Background shells:** none left running. The CI waiters and cargo holds all exited on their own, and I started no other process.

**End state:** HEAD equals origin/cut/posix-backslash-in-shared-path-logic (9999ef4dc451211a96733548eac333b343f6d158), and `git status --porcelain` is empty. The scratch files are `pbsl-*` in my scratch folder.

**Model:** the harness reports Sonnet 5.5 (claude-sonnet-5-5). No override, and no context handoff received or produced.

**Self-check:**
- Interfaces: both sites are inside their own modules. `roots_from_environment` has a product caller via `normalize_destination`, and `kernel/tests/permission_boundary.rs` calls it directly.
- Completion claims: each points to a run id, a job id or a hash above.
- User-facing text: no string a user sees was added or changed.
- Required tests: each reached its intended assertion, shown by the failing lines byte-copied above.
