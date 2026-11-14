Reviewed: PR #315 at 4541c8208a70f38280355f97e7e5893ee0f7c862 (base 3857425b) (the custodian's filing note, 2026-11-13: the gate, the reviewer, attempt 1, dispatched beside the architect, the five-line form's two gates from dispatch, PLAN node ci-rust-toolchain-pin, filler entry 16; its brief by file (8026 bytes, sha256 3f0b79701f96462b06a2771337e5c56dd370031cddd3e832c88d6d0259aeefb1), its packet by file (9307 bytes, sha256 8a5c141e); the run 20:46:04Z to 20:54:13Z by its transcript, 30 calls (Bash 24, Read 5, SubagentHandback 1), none errored, model claude-opus-5-5; its checks 1 to 11 each have calls in the transcript, and no claim lacks one; below, the hand-back byte for byte (with one final newline, 11994 bytes, sha256 ac1a76690a740d2ba06d7e10d70d9a7ba2ff18d8a2867fc97fb1b4fb7e51e41f), save its three scratch-folder paths, written here as <S>. Nothing else is changed. Its note that the worker's report was not yet on main at its read: the report was filed on main at b97c3816, after that read.)

Reviewed: PR #315 at 4541c8208a70f38280355f97e7e5893ee0f7c862 (base 3857425b), gate, reviewer, attempt 1
Verdict: PASS
Branch and commit reviewed: cut/ci-rust-toolchain-pin @ 4541c8208a70f38280355f97e7e5893ee0f7c862

## Findings by class (governance/AUTONOMY.md §22)

- **Correctness: none.** The diff is the form's change and nothing more. Every check under N4 holds at H.
- **Evidence: none.** All eight jobs that N3 names concluded success. Each logs `rustc 1.100.0 (0ef1bc386 2026-11-09)` byte for byte, downloads the action at b725eda525362e7cf34af9a7243cac1e3f01a7ec, and shows the `rustup default 1.100.0` sub-step with `outcome=success`. My second S1 read found no main run in the window.
- **Documentation: none in the PR.** The PR's only prose is the commit message body. I checked its clauses against checks 2 to 5 and they hold: the seven steps, the commit, the input 1.100.0, and the rustfmt component kept.
- **Not a PR finding, for the custodian.** Packet §1 says the worker's report is "filed on main in the custodian's records commit after 3857425b". When I read at 20:46:52Z, after the fetch, origin/main was 3857425be64a77dfec8639bac366d6bb697889cb. `git log --oneline 3857425b..origin/main` printed nothing (rc=0). In the main checkout the report is staged (`A`) and not committed. I read it from the working tree.

## Checks 1 to 11

**Check 1: the start state.**
- In C:/dev/wt/pin, `git rev-parse HEAD` returned 4541c8208a70f38280355f97e7e5893ee0f7c862 (rc=0).
- The branch is `cut/ci-rust-toolchain-pin` and `git status --porcelain` printed 0 bytes (rc=0).
- `git -C C:/dev/spatial-ide fetch -q origin` returned rc=0. Afterwards origin/cut/ci-rust-toolchain-pin is 4541c8208a70f38280355f97e7e5893ee0f7c862, which is H.
- The merge-base of origin/main and H is 3857425b (rc=0). H is one commit, and its parent is 3857425be64a77dfec8639bac366d6bb697889cb.

**Check 2: N4 point 1.** `git diff --numstat B...H` returned rc=0. It names the seven Scope files and nothing else:
- 3 and 1 for adr-003-spike-ci-linux, adr-003-spike-ci-macos, product-ci-rust, product-ci-shell, product-ci-viewer and tauri-build;
- 2 and 1 for rust-fmt.yml.

The shortstat reads ` 7 files changed, 20 insertions(+), 7 deletions(-)`. `git diff --quiet B H -- .github/workflows/release-artifacts.yml` returned rc=0, so that file is byte-equal. `git diff --name-only B H` lists the same seven files only, so every other file is byte-equal too.

**Check 3: N4 point 2.** The script is `<S>/pin-gr-c3.mjs`. `node --check` returned rc=0, and a grep shows its backslashes survived. It ran over `git diff -U0 B...H` (rc=0) and exited 0 with `files=7 fail=0`.
- In each file the one deleted line is `      - uses: dtolnay/rust-toolchain@stable`.
- In six files the added lines are exactly N1's three lines, at the hunks `@@ -71 +71,3`, `-53 +53,3`, `-205 +205,3`, `-181 +181,3`, `-102 +102,3` and `-46 +46,3`.
- In rust-fmt.yml they are N1's commit line and `toolchain` line (`@@ -68 +68 @@`, `@@ -69,0 +70 @@`).
- No changed line contains a CR or a tab. Every file ends with a newline at H, no file has a CR at H, and every step has N1's shape at H.
- Negative control: replacing the toolchain value with `"1.100"` makes the script exit 1 with `fail=7`.

**Check 4: N4 point 3, at H.**
- `grep -rn 'dtolnay/rust-toolchain@' .github/workflows/` returned rc=0 with 7 lines, and all 7 end `@b725eda525362e7cf34af9a7243cac1e3f01a7ec`. They are at linux:71, macos:53, product-ci-rust:205, shell:181, viewer:102, rust-fmt:68 and tauri-build:46.
- `grep -rnx '          toolchain: "1.100.0"'` returned rc=0 with 7 lines, at 73, 55, 207, 183, 104, 70 and 48. `-A2` shows each one directly under `        with:`, which is directly under a uses line.
- `rust-toolchain@stable` returned rc=1 with 0 lines. Positive control: the same `git grep` at B returns 7 lines (rc=0).
- `grep -rnw stable` at H returned rc=1 with 0 lines. At B it returns 7, all of them the @stable lines.
- The case-insensitive substring search finds one line: release-artifacts.yml:29, the word "untestable" in a comment. It does not name the toolchain's channel. No line at H names the channel.

**Check 5: N4 point 4.**
- At B, rust-fmt.yml:70 is `          components: rustfmt`: lines 68 to 70 are uses, `with:`, components.
- At H, rust-fmt.yml:71 is the identical line: lines 68 to 71 are uses, `with:`, `toolchain: "1.100.0"`, components.
- So it is still the last input of the step and is unchanged. It is a context line in the diff, and H has one `components:` line.

**Check 6: N4 point 5.** I read the jobs with `gh run view <run> --json jobs` at 20:47:56Z (rc=0 for all six runs). Every run is `pull_request`, head 4541c8208a70f38280355f97e7e5893ee0f7c862, completed/success. I downloaded the eight logs with `gh run view --log --job` (rc=0 each). The script `<S>/pin-gr-c6.mjs` exited 0 with `bad=0 of 8`. Each job has exactly one action-download line.

For every job, point 1 is success, point 2 equals N3's line byte for byte, and point 4 shows `;outcome=success;conclusion=success;` on the `__run_5` end-action line (the rustup default sub-step). The table gives point 3 as the download line's timestamp, the point 2 line's timestamp and the point 4 line's timestamp. Every download line reads `Download action repository 'dtolnay/rust-toolchain@b725eda525362e7cf34af9a7243cac1e3f01a7ec' (SHA:b725eda525362e7cf34af9a7243cac1e3f01a7ec)`.

| run / job | name | point 3 at | point 2 at | point 4 at |
|---|---|---|---|---|
| 43500536046 / 132144826427 | typecheck · build · test | 20:19:49.9969715Z | 20:20:02.0164544Z | 20:20:01.8700553Z |
| 43500536155 / 132144825940 | validate (macOS) | 20:19:49.9775190Z | 20:20:01.3912110Z | 20:20:00.9927400Z |
| 43500536158 / 132144825494 | validate (Linux) | 20:19:50.5748889Z | 20:20:36.8244895Z | 20:20:36.6609396Z |
| 43500536227 / 132144827152 | typecheck · build · vitest · cargo test | 20:19:50.7366543Z | 20:20:18.0507711Z | 20:20:16.8036640Z |
| 43500536227 / 132144827576 | tauri build (NSIS…) | 20:19:52.3819516Z | 20:20:30.0132007Z | 20:20:28.6950933Z |
| 43500536277 / 132144826666 | cargo test --workspace (windows-latest) | 20:19:50.4309112Z | 20:20:07.8827490Z | 20:20:06.6710491Z |
| 43500536277 / 132144827148 | L1 … (ubuntu-24.04) | 20:19:49.8593070Z | 20:20:01.3350519Z | 20:20:01.2161965Z |
| 43500536296 / 132144827085 | cargo fmt --check | 20:19:54.0154581Z | 20:20:10.7959072Z | 20:20:10.6987238Z |

- The full lines are in `<S>/pin-gr-c6-out.txt`. All dates are 2026-11-13.
- rust-fmt also logs `2026-11-13T20:20:10.8253049Z rustfmt 1.11.0-stable (0ef1bc3860 2026-11-09)`. The same job logs `commit-hash: 0ef1bc386059596dada8fb65b50425aab2ea637a`, so the commit is the same.
- Point 2 is the first line after the sub-step's `##[endgroup]`. In all eight jobs it is the same line as the packet's "first `Z rustc` line" (same=true).
- These match the packet's reading with no difference: the same job ids, lines and rustfmt line.
- Push runs at H are recorded only, not the evidence: 43499850556, 43499850562, 43499850720, 43499850819, 43499850832, 43499850927 and 43499851088. All are completed/success, read by `gh run list` at 20:50:09Z.

**Check 7: S1 again.** I read GitHub's API at 20:50:27Z to 20:50:33Z (rc=0 each). Run 43473141005 was created at 2026-11-13T17:28:30Z, head 6edbfa71d5b7f7f796589c3812c1abcc08957fc5. The latest main run of each workflow, newest first:

| workflow | latest main run | created | head |
|---|---|---|---|
| product-ci-rust | 43473141005 (the base itself) | 17:28:30Z | |
| product-ci-shell | 43473140935 | 17:28:30Z | 6edbfa71 |
| rust-fmt | 43473141010 | 17:28:30Z | 6edbfa71 |
| product-ci-viewer | 41755206807 | 2026-11-04 | |
| adr-003-spike-ci-linux | 34327766173 | 2026-09-09 | |
| adr-003-spike-ci-macos | 34327766119 | 2026-09-09 | |
| release-artifacts | 34833992340 (its only run, workflow_dispatch) | 2026-09-14 | |

No run of the seven workflows was created on main after 17:28:30Z, which matches the packet's S1 for every workflow.

The shell and fmt runs were created in the same second, and fmt's id is above the base's, so I read them as well:
- 43473140935 jobs 132049978528 and 132049978841, and 43473141010 job 132049979027 each log `rustc 1.100.0 (0ef1bc386 2026-11-09)`, at 17:29:33.6757030Z, 17:29:09.5465392Z and 17:28:50.4352884Z.
- Each downloads `dtolnay/rust-toolchain@stable' (SHA:b725eda525362e7cf34af9a7243cac1e3f01a7ec)`.
- Departure: I took these three lines with a pipeline and printed the last grep's rc (0). The full logs are in `<S>/pin-gr-c7-log-*.txt`.

**Check 8: the worker's report against the record.**
- **Where:**
  - Shown: a base of 3857425b, and no merge of main (H has one parent, B).
  - Shown by check 1: the branch name, and a clean worktree at 4541c820 that was pushed.
  - Not shown by checks 1 to 5: the empty ls-remote and the empty porcelain before the edit. These were states before the commit.
- **Base greps:** shown. `git grep` at B gives the seven @stable lines at the stated line numbers. The line after each is empty, except rust-fmt's, which is `with:` followed by `components: rustfmt`.
- **Commit:** shown. The subject matches, with 7 files, 20 insertions and 7 deletions.
- **Message file:** not shown by checks 1 to 5. I checked it separately: `<S>/pin-commit-msg.txt` has 0 Signed-off-by lines. The commit carries one Signed-off-by trailer, which `-s` adds, and the DCO check passes.
- **Numstat (point 1):** shown by check 2.
- **diff -U0 (point 2):** shown by check 3, including rust-fmt's lines 68 and 70 with `with:` untouched.
- **Worktree greps (point 3):** shown by check 4, including rc=1 for the @stable grep.
- **rust-fmt context (point 4):** shown by check 5.
- **All LF:** shown by check 3, with no CR in any file at H.
- **Not shown by any check:** the seven Edit errors, nothing running in the background, and the push's output text. These are transcript matters.

No claim is contradicted.

**Check 9: governance at H, from C:/dev/wt/pin.**
- `node scripts/plan/verify-cites.mjs` returned rc=0 with `verify:cites PASS` over 2975 files and 194 loose references advised.
- `node scripts/plan/verify.mjs --offline` returned rc=0 with `verify:plan PASS`.
- The porcelain was empty afterwards.

**Check 10: CI.** I read `gh pr checks 315` at 20:53:01Z (rc=0). All 20 checks pass. That covers both the PR and push runs of the six Rust-bearing workflows, DCO ("every commit is signed off"), the exposure scan and ported-notices. The PR is OPEN, a draft, with base main and head 4541c8208a70f38280355f97e7e5893ee0f7c862.

**Check 11: the end.** HEAD is 4541c8208a70f38280355f97e7e5893ee0f7c862 (rc=0), and `git -C C:/dev/wt/pin status --porcelain` printed 0 bytes (rc=0).

## For the advisor

- At the merge check (OPEN-3 (A)), my read at 20:50Z found no main run in the window for any of the seven workflows. The read must be repeated then.
- N3's rustfmt stop clause names 0ef1bc386. rustfmt prints a ten-character prefix, 0ef1bc3860. It is the same commit (the full hash 0ef1bc386059…), so the stop does not fire.

## The packet's gaps

- Packet §1 says the worker's report is on main. It was not at 20:46Z: it is staged only in the main checkout.
- "Created after run 43473141005" is not defined for runs created in the same second. I read the two such runs (43473140935, 43473141010) as well.
- Point 2 says "first output line" in the brief and "first `Z rustc` line" in the packet. Both readings agree in all eight jobs.

## Background shells left

None.

## Model

claude-opus-5-5 (Opus 5.5).

Scratch files are in <S>, all named `pin-gr-*`. The two scripts are <S>/pin-gr-c3.mjs and <S>/pin-gr-c6.mjs.
