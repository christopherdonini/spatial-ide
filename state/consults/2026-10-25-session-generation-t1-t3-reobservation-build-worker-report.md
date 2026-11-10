*Custodian's filing note (2026-10-25): the worker's build of `session-generation-t1-t3-reobservation` (the filler queue's entry 6a) on its branch, from main 959f4706, final head 26c88a93; draft PR #259. The custodian's check: the numstat from 959f4706 is 27 and 19 in kernel/tests/session_generation.rs alone, every changed line a doc line; the worktree is clean and equal to origin; the export folder is removed. Its writes were the one file, its own scratch files and the export (4 by the write tools); no rebase, reset, PR action or force push. The shared cargo target that the report discloses was the custodian's brief: one target for both the export and the worktree. The run 19:25:43Z to 19:36:17Z by its transcript (Read 1, Bash 28, Write 4, Monitor 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 40fa62816fac61381ca47e54d1678315d9ef013adf832a76c2cf537e0495d331.*

---

Built: session-generation-t1-t3-reobservation at 26c88a93b3046896f91deb9538136258307ce375
Subject: test(kernel): session-generation-t1-t3-reobservation, the recorded mutations re-observed at the base and T1's window after #147 (Change line). One signed-off commit. Pushed. origin's branch equals HEAD (ls-remote shows 26c88a93...), porcelain is empty, and D:/wt-targets/sgr-export is removed. No process I started still runs: tasklist shows no cargo or test process.

Mutations. Each was applied alone on the export of 959f4706 by my script sgr-w-mut.mjs. The file was restored from `git show 959f4706:<path>` and shown equal by sha256 (lib.rs f6d57439..., skp.rs ae7ea6ef...). No stop was met.
- M1: the unmutated run passed (1 passed). The mutated run failed at session_generation.rs:417 with message "the refusal must carry its typed code as a prefix, which is what the shell's own `isSessionEndedTerminal` matches: ticket `sh_bbbc0745330c41571660727eefb5e458` was cancelled before it was redeemed". The detail is redeem's cancelled wording. The restore check matched.
- M2: the unmutated run passed. The mutated run failed at :463, the `is unknown` assertion: "`redeem`'s own refusal is what answers: engine.source_changed: refused: the source file changed while it was open ({this dataset's session ended when its source was observed to have changed}). ..." The detail carries the `engine.source_changed: ` prefix. The restore check matched.
- M3: the unmutated run passed. The mutated run failed at :498 with "assertion `left == right` failed: close clears this dataset's dead handles", left: 1, right: 0. The restore check matched (skp.rs, shown at the head of the final-record call).

Words. A short script, sgr-w-words.mjs, copied W1 to W4 from the form's `> ` lines with <base> replaced by 959f4706fbd8824dc27352d719dae71c9a1a7c4d. It printed old and new text for each span (original lines 350-352, 357-361, 432-439 and 483-485). It was applied bottom to top.

Scope: `git diff --numstat 959f4706...HEAD` shows 27 insertions and 19 deletions in 1 file (46 lines, budget 60). My script sgr-w-doconly.mjs reports 46 changed lines, 0 of them not `///`.

Checks:
- `cargo test -p spatial-kernel --locked --test session_generation` in the worktree, in a shared hold: rc 0, "test result: ok. 12 passed; 0 failed".
- `cargo fmt --all -- --check`: rc 0.
- `verify.mjs --offline`: rc 0, "PASS".
- `verify-cites.mjs`: rc 0, "PASS".
- `verify-quotes.mjs`: rc 0, "PASS".
- `verify-test-claims.mjs`: rc 0, "PASS".
- I did not run verify-quotes with `--show-cites`; the plain run passed.

Disclosures:
1. A first worktree run of the test file failed `the_dead_ticket_record_is_bounded` (left 1), though the worktree's skp.rs was unmutated and git status showed only the test file modified. Cause: the shared target D:/wt-targets/sefd had kept the mutated library artifact from the export's M3 run, and cargo reused it. This is the known shared-target stale-artifact hazard. I ran `cargo clean -p spatial-kernel` on that target and re-ran, and the 12 tests passed. The first run's result is not a finding about the code. Each export run recompiled the export crates (Compiling lines present in m1-pre, m2-pre and m2-mut; the m3 runs also showed Compiling).
2. Because of the base id substitution, W2 to W4's id-bearing lines and W1's last line exceed 100 columns. I kept the form's words byte for byte; cargo fmt does not reflow comments and passed. If the gate wants wrapping, that is a later change.
3. No other stop was met.

Hold lines (mine only): 8 shared holds, each followed by a release (M1 pre/mut, M2 pre/mut, M3 pre/mut, and the two worktree test runs). All were granted, none refused. Each printed "MACHINE_HOLD shared project=SpatialIDE ... affinity=FF" and then "MACHINE_RELEASED project=SpatialIDE ...".

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override. No context handoff received or produced.
