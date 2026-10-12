*Custodian's filing note (2026-10-07): `typed-terminal-codes-post-check-race`'s build worker (worker-high) report, Parts A and B, at the branch head 0c94dcb033b8b5f3b961329a7525ab1484ffd297. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 1a94bedda096fd958b4c33ed6ec9fca0dec66b78df84dc9dc46e0630adf353ac. Run window from the transcript: 2026-10-07T18:16:06.734Z to 2026-10-07T18:44:05.880Z. The custodian re-checked the branch head, the two commits, the diff (2 files, 92 changed lines, both under `kernel/tests/`) and the clean worktree. Paths and lines below are at the branch head, not main.*

---

Report: node:typed-terminal-codes-post-check-race@g2. Part A and Part B are done and published. I made no edit under protocol/, to any wire fixture, to a lockfile, or to any file in the lines cut's §7 list. The stop condition never fired.

**Commits** on `cut/typed-terminal-codes-post-check-race`, base 92884cc4. Both are signed off, and both are on origin (origin's head is 0c94dcb0):
1. `150ea7d7918cd8bcdd16ce88b269295e5ed8ed45` "test: typed_terminal_codes' end-to-end test made unable to lose its post-check race (Part A, A1-A5)". It touches `kernel/tests/typed_terminal_codes.rs` only.
2. `0c94dcb033b8b5f3b961329a7525ab1484ffd297` "test: session_end_event's E2 and E3 made unable to lose their post-check race (Part B, B1-B3)". It touches `kernel/tests/session_end_event.rs` only.

**§7 count** by `git diff --numstat 92884cc4...HEAD -- <the two test files>` at 0c94dcb0:
- Part A: 45+7 = 52 lines, against a ceiling of 80.
- Part B: 34+6 = 40 lines, against a ceiling of 70.
- Non-generated files changed: 2 (the two test files), against a ceiling of 4. This count covers the files this branch changes; the form and PLAN.yaml are not among them.
- `kernel/README.md` was not touched.

**Mutations.** Each was applied by hand, the named test was run alone, and I reverted it afterwards. The working tree is clean. All were observed over 92884cc4 on the uncommitted tree of the commit that records them. No `verify-mutation` run was used.

| Row | Test | Mutation | Failing assertion | Reverted |
|---|---|---|---|---|
| M-0 | `the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code` | In `kernel/src/lib.rs`, `skp::terminal_detail_of(&e)` replaced with `e.to_string()` | The prefix assertion: "the terminal the data plane receives must open with the typed code ...: refused: the source file changed ..." | yes (`git checkout` of `kernel/src/lib.rs`) |
| M-1 | same test | `5_000` changed to `200` | The batch-count assertion: "the ordering argument needs more than MAX_QUEUED_BATCHES batches; got 1" | yes |
| M-2 (observation only) | same test | `touch_modification_time` moved to just after the drain loop | The terminal `expect`: "a changed source terminates this stream with a typed refusal" | yes |
| M-B2 | `a_post_check_end_on_a_clean_terminal_emits_once` | E2's `5_000` changed to `300` | The batch-count assertion: "...; got 1" | yes |
| M-B3 | `a_post_check_end_on_an_error_terminal_emits_once` | `cancel.cancel()` moved after the drain loop | "cancellation keeps its own terminal: engine.source_changed: refused: ..." | yes |

My first M-B3 attempt put the cancel inside the loop by mistake. The test passed, so I discarded that attempt, restored the file and redid it correctly. Only the correct run is recorded.

The M-0, M-1, M-2, M-B2 and M-B3 observations are recorded in the tests' doc comments. M-2 is labelled "not a test of record" and "does not show that this was its cause". The comments carry no `path:line` cite into `engine/src` or `kernel/src` and no line cite into their own file. The batch-count assertion sits before the terminal `expect` in both tests. There is no sleep, no timeout and no timing assertion in any changed test.

**Predictions** (each is a held `node scripts/evidence/repeat.mjs 20 -- cargo test --locked ...` call):
- P-1: `--test typed_terminal_codes` passed 20 of 20 (`summary runs=20 failed=0`).
- P-3: `--test session_end_event` passed 20 of 20 (`summary runs=20 failed=0`).
- The invalidator did not fire: the batch-count assertions held, and E3 never ended with `source_changed`.

**Checks**, all at head 0c94dcb0:

| Check | Exit code | Result |
|---|---|---|
| `cargo test --locked -p spatial-kernel --test typed_terminal_codes` | 0 | 7 passed |
| `cargo test --locked -p spatial-kernel --test session_end_event` | 0 | 7 passed |
| `cargo fmt --all --check` | 0 | |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`, held | 0 | 450 pass, 0 fail |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `verify-cites.mjs` | 0 | PASS |
| `verify-quotes.mjs` | 0 | PASS |
| `verify-test-claims.mjs` | 0 | PASS |

The last three scripts print advisories about older files (`state/drafts`, `engine/LOD-PREREGISTRATION.md`, withdrawn test claims). None of them involve this branch's files.

**Heavy commands:**
- Held: the cold build plus the first `typed_terminal_codes` run (17m43s), the P-1 repeat, the P-3 repeat, and the node scripts suite. Every hold was granted.
- Unheld: the warm incremental rebuilds and single-test runs for the mutations and the intermediate checks. Each build took under 10 seconds and each test run under 1 second, so I treated them as free under the machine paragraph.

**Deviations from the form:** none, so no amendment class applies.
- The P-3 call had a stray `| grep` appended after `exit $rc`. It had no effect on the hold, the command or the exit code. The call was still a single held command in the required shape.
- The `-m` message trailers are the two required lines. `git commit -s` appended its own Signed-off-by after them, as usual.

**Noticed and not done:**
- The `kernel/src/skp.rs` sibling and E4's sleep are out of scope per the form. The custodian routes the first as a proposed node.
- Some older comments in `typed_terminal_codes.rs` say "restore `Some(Err(e.to_string()))`", which no longer matches the code's shape. I left them, since the form declares every other test and comment unchanged.

**Model:** the harness reports Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff.

**Pre-gate self-check:**
- The tests use only interfaces the other side actually exposes: `MAX_QUEUED_BATCHES` is imported from `spatial_engine`.
- Every completion claim points to a run above.
- No user-facing message changed.
- Every required assertion is reached: each mutation fails at its named assertion, not only in setup.
