# The advisor's merge check of PR #313 at 4261bcec852e, the second: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 6edbfa71

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-313-4261bcec852e-2.md in the human's advisory folder and told the custodian by session message; the custodian acts on the file. 4406 bytes, sha256 c5d2c76169cb74c0afa710067b9b66c51aad8934e4d5495eef219f2e929faa1e, last modified at 2026-11-13T17:28:11Z by the file system; read by the custodian at 2026-11-13T17:28:48Z and again at this filing (2026-11-13T18:04:42Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; the first check is `state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-merge-check-1-hold.md`; by GitHub, PR #313 merged at 2026-11-13T17:28:28Z with the merge commit 6edbfa71d5b7f7f796589c3812c1abcc08957fc5 (parents 99bb445e and 4261bcec); the verdict's own line gives its writing time as 17:29Z, and the file system's last-modified time above is the earlier of the two.*

---

Merge check: PR #313 at 4261bcec852e991767564f1684267020807925e7
Verdict: MERGE

Written by the advisor session under the delegation of 2026-11-13, at 2026-11-13T17:29Z. This is the second check at this head. The first ended HOLD for one record on main (`MERGE-CHECKS/PR-313-4261bcec852e.md` in the advisory folder, filed in the repository as `state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-merge-check-1-hold.md`, equal to my file below its filing note). That record is now on main. This file covers what changed since; the first check's findings on the seven checks stand for everything else.

## What held the merge, and how it is settled

The form's closing amendment did not carry the CI citation that the form's Tests+mutation line, its note N3 and the architect's check 2 ask of it. Main at 99bb445e6119bc088667b87c38032e85cbb5c6a0 appends Amendment 2 to the form; Amendment 1 is unchanged (the form's diff from 8fb2835a is 22 added lines after it and nothing else).

Amendment 2, item 1, cites the PR's Product CI — Rust workspace run at the head: run 43459202334, its two jobs by id and name, the head commit, the rustc line each job logs, and each job's verify_bundle Running line with the binary's path under `build/<package>/<hash>/out/`. It adds the push run 43432787282 and points at the reviewer's check 7 for the gated head. I checked each fact against the runs:

- run 43459202334: event pull_request, head 4261bcec, success. Job 132001286796 is `cargo test --workspace (windows-latest)`, job 132001287076 is `L1 portable correctness · cargo test --workspace (ubuntu-24.04)`. The step Run the ordinary suite succeeded in both.
- Windows: the toolchain step logs rustc 1.100.0 (0ef1bc386 2026-11-09) at 16:06:16Z; verify_bundle's Running line in Run the ordinary suite is at 16:22:20Z and names the binary under `target\debug\build\spatial-kernel/22da53baa802e9be\out\`; its result line reads 3 passed, 0 failed.
- Linux: the same rustc line at 16:05:57Z; the Running line at 16:12:29Z, the binary under `target/debug/build/spatial-kernel/66dea325524b6dc7/out/`; 3 passed, 0 failed.
- run 43432787282: event push, head 4261bcec, success; jobs 131910212642 (Windows) and 131910212761 (Linux); the same rustc line, the same two binary paths, 3 passed and 0 failed in each.

Amendment 2, item 2, records the route as it happened: the three reopens with their times, the rulings ADV-2026-11-13-13 to -16, the two test merges, the twelve runs that count and the four red runs left from before. It agrees with what I read in the first check.

## What I read for this check

- Main's tip, 99bb445e (parent 8fb2835a), and its diff from 8fb2835a: the form's Amendment 2, the filed HOLD verdict, and the custodian's queue, plan, site and state records. None of the piece's four paths.
- Main's four runs at 99bb445e (43472137496, 43472137437, 43472137359, 43472137427): all success.
- The PR from GitHub at 17:27:27Z: head 4261bcec852e991767564f1684267020807925e7, open, out of draft, based on `main`, from the branch `cut/verify-bundle-example-path-build-dir-layout` of this repository, mergeable and clean. Its 18 checks all pass. It was last updated at 16:39:51Z, before my first check read it, so its body and head are the ones I checked.
- The logs of runs 43459202334 and 43432787282, for the lines above.

## The seven checks, now

1. The PR: passes, as before.
2. The head against the gated head 5977712d: passes, as before. One comment-only commit, in one file.
3. The gates: both ended with a pass, and both D1s are closed by the architect's words under ADV-2026-11-13-11. The closing amendment's citation, which the architect's check 2 set, is now in the form. Passes.
4. Rulings and ruled wording: passes, as before. The two blocks equal ADV-2026-11-13-11 byte for byte; nothing waits for a ruling.
5. The files: passes, as before. The form's four files, 95 lines against 120; no dependency, lockfile, workflow, licence or mod file.
6. The piece does what was ruled: passes, as before.
7. CI and main: passes. The twelve runs that count are green and unchanged. None of the piece's four paths has changed on main since the branch's base 3fe9f97d, and main is green at 99bb445e.

Nothing Chris has put on hold touches this PR, and it changes nothing of the Guardian or any mod. The merge is a merge commit, so that f740eeef and 5977712d stay reachable from main.
