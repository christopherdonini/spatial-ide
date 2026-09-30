# Consult — node 3's first piece, correction round 1, the worker's report (A4-4, g1)

*Custodian's filing note: the worker's hand-back for correction round 1 of PR #148 (PLAN node `publish-refusal-codes-and-attempt-lifecycle`, g1, the first piece, A4-4), on the form's Amendment 1 (class 1), delivered as a message on 2026-09-30. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 3777ad0 (signed off) on 8b4f153; `git diff 8b4f153..3777ad0` is the one line in `kernel/tests/end_to_end.rs` that changes T1's fixture name from `crs` to `crs-raw-create`; `git diff --numstat 8cee33b...3777ad0 -- kernel/src kernel/tests` is 6/1 and 37/0, 44 over 2 files; every check on PR #148 at 3777ad0 passes (both workspace test runs, both shell jobs, both tauri builds, the sign-off check). The report's line numbers are unpinned working pointers at 3777ad0.*

---

node:publish-refusal-codes-and-attempt-lifecycle@g1 (A4-4, correction round 1) — done, pushed, no PR opened.
- Commit 3777ad0 (-s) on cut/raw-path-refusal-code. The only change is kernel/tests/end_to_end.rs line 525, where T1's fixture argument goes from "crs" to "crs-raw-create". `git diff --stat 8b4f153..HEAD` names only that file (1 line changed).
- Paired runs: T1 plus its sibling, default threads, ran 10 times and passed 10 times (2 passed each). The whole `--test end_to_end` passed (10 tests). No timing-sensitive failure, so no rerun was needed.
- Mutation observed at 3777ad0: I restored `.map_err(|e| e.to_string())?` at the create-time site in kernel/src/lib.rs (line 383). T1 `a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` failed with a panic at kernel/tests/end_to_end.rs:546:28. I did not capture the assertion message text, only the panic location. I reverted with `git checkout` and porcelain was empty. This was applied and run directly, not via verify-mutation.
- Checks:
  - `cargo test -p spatial-kernel` exited 0 (133 unit tests plus all integration binaries passed).
  - The rustfmt hunk count for end_to_end.rs is 21 at 8b4f153 and 21 at HEAD.
  - numstat `8cee33b...HEAD -- kernel/src kernel/tests` gives kernel/src/lib.rs +6/-1 and kernel/tests/end_to_end.rs +37/-0. That is 2 files and 43 added lines, against the form's 60 over 2 files.
- CI on 3777ad0, read with `gh pr checks 148` (the output lists two runs, each with the same four jobs): both `cargo test --workspace (windows-latest)` jobs pass (20m39s and 19m53s), both `typecheck · build · vitest · cargo test` jobs pass, "every commit is signed off" passes, and both tauri NSIS build jobs show "pa…" (truncated by my column cut, so read as pass but not verified).
- Four-class self-check: the change is test-only and adds no cross-module code. It runs against the existing kernel path and is checked by the mutation failure above. It adds no user-facing message. The required test reaches its assertion, since the mutation fails at line 546 rather than in setup.
- Off-scope: none noticed. Nothing written under state/, PLAN.yaml, CUSTODIAN-QUEUE.* or site/. I observe myself running as Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff.
