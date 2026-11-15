# The advisor's merge check of PR #315 at 4541c8208a70: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 8c693657

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-315-4541c8208a70.md in the human's advisory folder and told the custodian by session message; the custodian acts on the file. 6129 bytes, sha256 0041dfe0e2bca76934244fbc083266d22f6c358076d2af8e10c7b23b6e4d3d99, last modified at 2026-11-13T21:42:47Z by the file system; read by the custodian at 2026-11-13T21:43:47Z and again at this filing (2026-11-13T22:14:38Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #315 merged at 2026-11-13T21:43:01Z with the merge commit 8c693657801fd4168b078a601724bdacd9f479b8 (parents f0f3f558 and 4541c820).*

---

Merge check: PR #315 at 4541c8208a70f38280355f97e7e5893ee0f7c862
Verdict: MERGE

Checked by the advisor session under the delegation of 2026-11-13, between 21:39Z and 21:43Z on 2026-11-13 (from the clock). The piece is `ci-rust-toolchain-pin`, filler entry 16, under the five-line form `governance/forms/root/CI-RUST-TOOLCHAIN-PIN-PREREGISTRATION.md` as it stands on main at f0f3f558ca7ce91f6bca162eab1629390d11b3cc (its settlement and Amendment 1).

What I read: the custodian's request of 21:39:15Z; PR #315 from GitHub (head, author, base, draft state, body, checks); the branch's one commit and its whole diff from 3857425be64a77dfec8639bac366d6bb697889cb; both gate reports as filed on main, whole; the form's five lines, N1 to N8, its settlement and Amendment 1; the human's approval of ADV-2026-11-13-05 as filed on main, its items 1 to 6; my rulings ADV-2026-11-13-10 and ADV-2026-11-13-17; the logs of the eight jobs of the PR's pull_request runs; every run on main of the seven workflows and of release-artifacts since run 43473141005, and the logs of the three jobs found.

1. The PR. It is opened from the custodian's account, from the branch `cut/ci-rust-toolchain-pin` of this repository, based on main, out of draft, open, and GitHub reads it MERGEABLE and CLEAN at the head named above. The branch is one commit on main at 3857425b.

2. The head is the gated head. Both gates reviewed 4541c8208a70f38280355f97e7e5893ee0f7c862, and nothing was committed after it.

3. The gates. The architect: PASS, no finding in any class. The reviewer: PASS, no finding in any class. Nothing is left to close. The reviewer's one remark for the custodian (the worker's report was staged and not yet committed when it read) concerns a record, not the PR; that report is on main now.

4. Rulings. Nothing on the piece waits for a ruling. The form's four open items were ruled in ADV-2026-11-13-17, filed on main with its body equal to my file. No ruled wording is in the diff: the seven lines are the shape the form's N1 gives. The stop of ADV-2026-11-13-17, item 5, did not fire: no job of the PR is red.

5. The files, and the human's directive for them. The diff has seven files, all under `.github/workflows/`, the seven the form's Scope line names: six at 3 lines in and 1 out, `rust-fmt.yml` at 2 in and 1 out, 27 lines against a declared 27. These are CI workflow files, and what CI installs is a matter the human kept. The directive that names this change is the human's message of 2026-11-13 (11:48Z), filed on main, whose line "approved ADV-2026-11-13-05" approves these words: all seven install steps name one exact Rust version and the toolchain action is pinned by commit; the version is the one main's first green Rust run logs after filler entry 15 merges; the piece changes the seven install steps and nothing else. No dependency, lockfile, licence or mod file changes, `release-artifacts.yml` is not in the diff, and no other action is added or changed.

6. What the piece does. In each of the seven files the one deleted line is `- uses: dtolnay/rust-toolchain@stable`, and the added lines are that step naming the action at b725eda525362e7cf34af9a7243cac1e3f01a7ec with the input `toolchain: "1.100.0"`. In `rust-fmt.yml` the input is added under the existing `with:` and `components: rustfmt` stays. No comment, path filter, cache key or header is touched. The version and the commit are the ones I read from main's run 43473141005 for ADV-2026-11-13-17, item 1.

7. The evidence the human's item 3 asks for: every Rust workflow green on the PR, each logging the same rustc version. I read the logs of the eight jobs of the pull_request runs at the head myself. Each job concluded success; each downloads `dtolnay/rust-toolchain@b725eda525362e7cf34af9a7243cac1e3f01a7ec`; each installs 1.100.0 and logs `rustc 1.100.0 (0ef1bc386 2026-11-09)`; each logs "default toolchain set to 1.100.0" for its target after the `rustup default 1.100.0` sub-step. Each ran on the merge of the head into main at 3857425b.
   - Run 43500536277 (Rust workspace): jobs 132144827148 (ubuntu-24.04) and 132144826666 (windows-latest).
   - Run 43500536227 (shell): jobs 132144827152 (typecheck, build, vitest, cargo test) and 132144827576 (the tauri build, through the reusable `tauri-build.yml`).
   - Run 43500536046 (bundle viewer): job 132144826427.
   - Run 43500536296 (Rust fmt): job 132144827085.
   - Run 43500536155 (ADR-003 spike, macOS): job 132144825940, on aarch64-apple-darwin.
   - Run 43500536158 (ADR-003 spike, Linux): job 132144825494.
   Every other check on the PR passes as well: the push runs of the same workflows, the DCO sign-off, the exposure scan and the ported notices, 20 checks in all.

8. The repeated read of main (ADV-2026-11-13-17, item 4). At 21:40:48Z I listed every main run of the seven workflows and of release-artifacts created after run 43473141005. Two exist, both at 204c176282c37786f322a530dc0ab89b59e915b5: product-ci-shell run 43505810170 (jobs 132163054681 and 132163055265) and rust-fmt run 43505809481 (job 132163052114). Each of the three jobs logs `rustc 1.100.0 (0ef1bc386 2026-11-09)` and takes the action's `stable` ref at b725eda525362e7cf34af9a7243cac1e3f01a7ec. The other five workflows and release-artifacts have no main run in the window. No main run has logged another Rust version, so the pin changes no compiler on main. This agrees with the custodian's read of 21:38:15Z.

9. CI and main. CI is green at the head. Since the branch's base, main has gained #314's merge and two record commits; none changes any file under `.github/`. Main's own runs at f0f3f558 are green.

One record follows the merge and is not a condition of it: the form's N6 says the closing names the pin's merge commit, which cannot exist before the merge. Amendment 1, item 8, says the node's done commit appends it as Amendment 2. I will read that it is there.

From this merge on, a tagged release build takes the pinned toolchain through `tauri-build.yml`, as the form's N3 says. A bump to a newer version is its own piece and needs the human's approval each time (ADV-2026-11-13-05, item 4).
