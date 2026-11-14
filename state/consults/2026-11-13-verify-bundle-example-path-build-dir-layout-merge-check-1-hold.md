# The advisor's merge check of PR #313 at 4261bcec852e, the first: HOLD, under the human's delegation of 2026-11-13, not the human's words: the form's closing amendment lacked the CI citation its N3 asks of it, and spoke of the reopen as still to come

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-313-4261bcec852e.md in the human's advisory folder and told the custodian by session message; the custodian acts on the file. 7371 bytes, sha256 a3c5ba94c09527d12d1d1cc7d9dd5a20e2d00e0dc13fc5651b555e4a6a6b6747, last modified at 2026-11-13T16:44:19Z by the file system; read by the custodian at 2026-11-13T16:44:41Z and again at this filing (2026-11-13T16:54:04Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's note, not the verdict: the folder's place on the machine is not written here; what settles the hold is the form's Amendment 2, in the commit that files this.*

---

Merge check: PR #313 at 4261bcec852e991767564f1684267020807925e7
Verdict: HOLD

Written by the advisor session under the delegation of 2026-11-13, at 2026-11-13T16:44Z. One thing is missing, and it is a record on main, not a change to the PR. Everything else passes.

## What holds the merge

The form's closing amendment does not yet carry the CI citation that the form and the architect's gate both ask of it.

- The form's Tests+mutation line says the PR's own Product CI — Rust workspace run at the head commit is recorded by run id, job, head commit, the Running line and the logged rustc line. Its note N3 says the closing amendment cites that run by references: run id, job names, head commit, the logged rustc line, and one Running line per job showing a test binary under `build/<package>/<hash>/out/`.
- The architect's gate report, under check 2, lists the same five things as what the closing amendment must cite from CI.
- Amendment 1, item 4, says only that the example's place is shown by the PR's CI on rustc 1.100.0 in both jobs. It names no run, no job and no Running line. The reviewer's gate report holds all of them in its check 7, but for the gated head 5977712d, and Amendment 1 does not point at that check.
- Amendment 1, item 6, also speaks of the close and reopen as still to come. Three reopens happened, under ADV-2026-11-13-14, -15 and -16; the PR body records them and the form does not.

## What settles it

An Amendment 2 to the form, on main, that:

1. cites the Product CI — Rust workspace run at 4261bcec by run id, with its two job names, the head commit, the rustc line it logs, and for each job the verify_bundle Running line under `build/<package>/<hash>/out/`; it may add the gated head's runs by pointing at the reviewer's check 7;
2. records the route as it happened: the three reopens, the rulings ADV-2026-11-13-14, -15 and -16, the runs that count and the red runs left from before.

Nothing is added to the branch. The head stays 4261bcec and the PR's runs stay the ones named below; no further reopen is needed. Main's CI is green at the amendment's commit. Then the request comes again and I check only what changed.

For the amendment's author, what I read at the head, to be checked against the logs and not taken from me: run 43459202334 (pull_request, the third reopen), jobs `cargo test --workspace (windows-latest)` and `L1 portable correctness · cargo test --workspace (ubuntu-24.04)`, each logging rustc 1.100.0 (0ef1bc386 2026-11-09), the step Run the ordinary suite succeeding in each, and verify_bundle's Running line under `target/debug/build/spatial-kernel/<hash>/out/` in each (hash 22da53baa802e9be on Windows, 66dea325524b6dc7 on Linux). The push run 43432787282 shows the same.

## What I read

- The PR from GitHub at 16:40:42Z and again at 16:43:46Z; its body, whole; its checks; the file list of its diff.
- The diff from the base 3fe9f97d to the head, whole, and the diff from the gated head 5977712d to the head.
- Both gate reports under `state/consults/gates/`: the architect's whole, the reviewer's findings and its checks 6 to 12.
- The form, whole, with its Amendment 1, at main 8fb2835a.
- The logs of the third reopen's seven runs for each job's checkout line; the five push runs' event, head and result; the two Rust runs' rustc and Running lines.
- My rulings ADV-2026-11-13-11, -13, -14, -15 and -16 as filed on main, each equal to my file below its filing note.
- Main's runs at aaedd2da and at 8fb2835a.

## The seven checks

1. The PR. Passes. It is opened from the branch `cut/verify-bundle-example-path-build-dir-layout` of this repository by the account the custodian works under, based on `main`, open and out of draft.

2. The head against the gated head. Passes. Both gates reviewed 5977712d. One commit follows it, 4261bcec, which changes `kernel/tests/built_targets/mod.rs` alone, 8 lines added and 6 removed, all comment lines.

3. The gates. Both ended with a pass: the architect PASS WITH NOTES (WORDS-ONLY), the reviewer PASS WITH NOTES. Each has no Correctness finding and one finding to fix before the merge, D1, on the doc comments of `kernel/tests/built_targets/mod.rs`. Both D1s are closed by the architect's words under ADV-2026-11-13-11, item 1; the sentence the reviewer's D1 faults is gone from the source. What does not pass under this check is the closing amendment's citation, above: the architect's report sets it as something the closing amendment must carry.

4. Rulings and ruled wording. Passes. Nothing on the piece waits for a ruling. Lines 6 to 11 and lines 15 to 17 of `kernel/tests/built_targets/mod.rs` at the head equal the two blocks of ADV-2026-11-13-11 byte for byte, compared by `cmp` against my file. The PR body lists them as the architect's words by that ruling and names the worker's departure from its brief under ADV-2026-11-13-09.

5. The files. Passes. Four files, all in the form's Scope line: `kernel/tests/built_targets/mod.rs` (new), `kernel/tests/verify_bundle.rs`, `kernel/tests/scale_pass.rs` and `kernel/README.md`. 63 lines added and 32 removed, 95 against the declared 120. No dependency, lockfile, workflow, licence or mod file. Nothing of the Guardian.

6. The piece does what was ruled. Passes. The three helpers lose their walk of two parents up and call one shared function, `built_targets::profile_dir`, which takes the nearest ancestor of the test binary named `debug` or `release` by `cfg!(debug_assertions)` and panics, naming the test binary's path, when there is none. The executable name moves into `built_targets::exe_name` with the same result on each OS. Every existence assertion is kept, and so is verify_bundle's build fallback. No test is added, removed or renamed. The README change is the form's own entry in the preregistration list and the Last-verified clause.

7. CI and main. Passes. Every check on the PR passes at the head. The five push runs at 4261bcec are green (43432787007, 43432787037, 43432787115, 43432787282, 43432787767). The third reopen's seven pull_request runs are green (43459201996, 43459202016, 43459202040, 43459202106, 43459202151, 43459202153, 43459202334), all created at 16:05:42Z. I read each job's checkout line: every job checked out fae37957, the merge of 4261bcec into d5598e2a, except the shell run's NSIS job, which checked out f887af5, the merge of 4261bcec into aaedd2da. Both have the fixed main as first parent, as ADV-2026-11-13-16 requires. No job ran on a7e1b806. The red runs left from before are 43432797208, 43442533155, 43442533188 and 43453730800; I read the logs of the last and of the second reopen's shell run, and the cause is the one the PR body gives: GitHub's old test merge, on a main from before the extract's cites were pinned. The branch has not taken main in since its base 3fe9f97d, and none of the piece's four paths has changed on main since then.

## Also checked

- ADV-2026-11-13-13's four conditions: the extract's change on main (d5598e2a) changes three lines and adds or removes none, its filing note gives each cite before and after, main's CI was green there, and the head did not change.
- Nothing Chris has put on hold touches this PR. It is a fix for main's red Rust CI, placed in the filler slot by his message of 2026-11-13 (06:43Z).
- The merge is to be a merge commit, so that f740eeef and 5977712d stay reachable from main.
