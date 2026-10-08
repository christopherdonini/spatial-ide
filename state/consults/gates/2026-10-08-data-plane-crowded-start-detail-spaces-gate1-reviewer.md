# PR #189 gate 1 — reviewer
Reviewed: cut/data-plane-crowded-start-detail-spaces @ 9867fa9faa2feb9e61cb8b5d25f120be154f18f0

**Verdict: PASS.** I found no Correctness or Evidence finding. There are five Documentation findings, D1 to D5. Each must be fixed, or disclosed where it cannot be fixed, in this PR before the merge. They cause no correction round and no re-gate. CI is not fully green yet; see the CI section. That failure is outside this diff, but one condition must be met before the merge.

Base e888787eeec1e5ce63adf56a9aff1b087951e889, which is also the merge-base with origin/main 8c9e3e9526f5cd176f6d2edb8a5c8b03acdbe94d.

## Correctness — none

- **The diff (three-dot).** Only §7's two files changed: `protocol/data-plane/src/server.rs` and `protocol/data-plane/tests/candidate_a.rs`. `git diff --stat origin/main...HEAD -- protocol/skp kernel engine frontends` is empty (rc 0).
- **C1.** Line 462 of the base `server.rs` becomes lines 462-465 at 9867fa9f, with `\` continuations, each continued line ending in a space before its `\`. This is the shape of the admission refusal. The produced string differs from the base only at the three joins. M1's two sides below show this byte for byte. No word, placeholder, specifier, code or branch changed. The in-pool `"no operation started"` arm is untouched.
- **§8, item by item.**
  - 1: clean.
  - 2: clean.
  - 3: no new `pub` or `pub(crate)` item, option, callback, code path or dependency. T1 imports three `pub` constants that already exist.
  - 4: no constant changed, and `wire.rs` is untouched.
  - 5: the `candidate_a.rs` hunk is additions only, so no existing test changed.
  - 6: no sleep, no elapsed-time assertion, no wait on `START_TIMEOUT`. Every connection is closed before `dp.shutdown()`.
  - 9: clean.
  - 10: clean.
- **T1's determinism, read against `handle`.**
  - `handle` takes `st.idle.try_acquire_owned()` once, at entry (server.rs:430 at 9867fa9f). The permit lives until the `drop(idle_permit)` after START (line 481) or until `handle` returns.
  - No connection in T1 sends a frame or closes before the first terminal. So none of the `MAX_IDLE_CONNECTIONS + 1` handlers releases a permit, and exactly one gets `CROWDED_START_TIMEOUT`, whatever order they run in.
  - Each test starts its own data plane, so each has its own semaphore.
  - The crowded terminal comes at about 5 s. The others wait 120 s, and each `drain` receive is bounded by `RECV_DEADLINE` (30 s). So the first future to finish is the crowded one.
  - If a connection ended without a terminal, it would fail loudly at the `expect`, not pass silently.
  - The argument holds. On the wording of its comment, see D3.
- **Seam.**
  - Producer: `handle`'s timeout arm, then `terminal_and_drain` (server.rs:611-632 at 9867fa9f), then `wire::terminal_payload`.
  - Consumer: I read the shell's decoder at the head (`frontends/shell/src/streaming/wire.ts:169-177`, unchanged by this diff). It takes `payload[0]` as the code and decodes `payload.subarray(1)` with `TextDecoder`, as opaque text.
  - T1 reads the real frame through the suite's real-WebSocket `drain`, with the same shape: code byte, then `from_utf8_lossy` over the rest.
- **Caller rule.** Nothing new to call.

## Evidence — none

**M1 row:**

| Mutation | Run | Failing assertion | Reverted |
|---|---|---|---|
| The base `server.rs`, written over the worktree from `git show e888787eeec1e5ce63adf56a9aff1b087951e889:protocol/data-plane/src/server.rs`. The only hunk is the literal: three 22-space runs restored, one line. Applied at 9867fa9f. | T1 alone, by name, `--exact` | (b). It panicked at line 869 of `protocol/data-plane/tests/candidate_a.rs` at 9867fa9f, `assertion \`left == right\` failed: the crowded-start detail, as received`. Left: the three 22-space runs, with `MAX_IDLE_CONNECTIONS=4`, `5s` and `120s`. Right: the single-spaced text. rc 101. | Yes, by `git checkout -- protocol/data-plane/src/server.rs`. Porcelain empty, HEAD 9867fa9f. |

No `verify-mutation` run was made.

- **P2** holds.
- **P3** holds. The right side above is `no operation started, and the declared ceiling MAX_IDLE_CONNECTIONS=4 was already reached, so this connection was held for 5s rather than 120s`, which is the form's §2 C1 template rendered with the current constants.
- **P1** holds. `candidate_a` runs 17 tests at the head, all passing. The diff only adds T1.
- **§7 count, by its command.** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- <the two files>` gives:
  - `server.rs`: 4+1 = 5, against a ceiling of 8.
  - `candidate_a.rs`: 40+0 = 40, against a ceiling of 60.
  - Total 45, against 68. No class 8.
- **P4, at the base.** `git grep -n "already reached, so this" e888787e -- protocol kernel engine frontends` (rc 0) finds `protocol/data-plane/src/server.rs:462`. It also finds the form's own lines 55, 104 and 105 (see D2).
  - No reader of the text exists: I also grepped `declared ceiling`, `no operation started` and `MAX_IDLE_CONNECTIONS=` over kernel, engine, frontends, renderer and scripts, excluding `*.md`. None reads this detail.
  - The invalidator does not fire.
- **Hashes.** All 18 hash references in the form were recomputed over the cited lines at a21435ed0fe586b3f2c4b42e1e1d783d93468ecb, with `git show | sed -n | sha256sum`. They cover 16 distinct spans, and all match. a21435ed is an ancestor of origin/main.
  - Every pinned span says what the form says it does: server.rs:478 is `drop(idle_permit);`, candidate_a.rs:841 is the M2 recorded-mutation comment, :251 is `RECV_DEADLINE`, and N7 says two runs.
  - `state/questions/round-26.md:33` also says two runs, which supports the form's §0 claim.

## Documentation — must-fix before the merge

- **D1.** The form's §0 says the node's summary is corrected "in the same pull request". This PR does not touch `PLAN.yaml`: the correction is being made on main. The closing record must name this deviation from §0. (Known to the custodian.)
- **D2.** P4 predicts that the grep "finds only `protocol/data-plane/src/server.rs`". At the base it also finds the form's own lines 55, 104 and 105. The prediction is literally false, but no reader exists. The closing record must state this. (Known to the custodian; the form cannot be edited, by append-only.)
- **D3.** Line 850 of `protocol/data-plane/tests/candidate_a.rs` at 9867fa9f says an idle permit is "released only at START or at that connection's own timeout". The form's §4 step 3 says the same.
  - This is incomplete. `handle` also releases the permit when it returns because the peer left before START (`Ok(Ok(None)) => return`) or sent a START it cannot parse (the `Ok(Err(detail))` arm).
  - T1's determinism still holds, because no connection sends or closes before the first terminal. That is why this is not a Correctness finding.
  - Fix: reword the T1 comment to name all three releases, plus the condition T1 relies on. This stays well inside §7's 60.
- **D4.** The PR body says "No wire literal changes: the detail is TERMINAL payload text". The form's Header says the opposite: a changed space is a changed wire byte, which is why this piece took the full wire-category form.
  - Fix: reword the body. Frame tags, codes and framing are unchanged; the TERMINAL detail's bytes change at three joins.
- **D5.** The head commit's message says "consumer side read: … the shell's opaque-text decoder (frontends/shell/src/streaming/wire.ts)". The worker report's line 7 says the worker did not re-read that site and cited it from the form.
  - The commit message cannot be fixed without rewriting history, so disclose it in the closing record. My own reading of the decoder at the head is above, under Seam.
- **Note, not a finding.** §9 asks for clippy as CI runs it. No workflow runs clippy, the worker did not run it, and I did not either. (Known to the custodian.)

## CI (`gh pr checks 189`, rc 1, every line as printed)

```
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	fail	3m31s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999952/job/113137892822
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	pass	3m56s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702038732/job/113067518420
cargo fmt --check (workspace and src-tauri)	pass	15s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702038680/job/113067517991
cargo fmt --check (workspace and src-tauri)	pass	13s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999630/job/113137891530
cargo test --workspace (windows-latest)	pass	12m45s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702038732/job/113067518260
cfg boundary (PORTABILITY R2)	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702038669/job/113067518517
every commit is signed off	pass	8s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999592/job/113137891593
no profile path in the range	pass	6s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999642/job/113137891234
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m37s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702039088/job/113067519936
test · verify:plan · queue/site drift	pass	1m24s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999638/job/113137891686
typecheck · build · vitest · cargo test	pass	5m34s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702039088/job/113067519492
typecheck · build · vitest · cargo test	pass	5m49s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999911/job/113137892637
cargo test --workspace (windows-latest)	pending	0	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999952/job/113137892551
cfg boundary (PORTABILITY R2)	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999638/job/113137891891
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m31s	https://github.com/christopherdonini/spatial-ide/actions/runs/37723999911/job/113137893444
test · verify:plan · queue/site drift	pass	1m22s	https://github.com/christopherdonini/spatial-ide/actions/runs/37702038669/job/113067518408
```

**Run 37702038732** is the branch-update run on 9867fa9f itself. Ubuntu and Windows `cargo test --workspace` both pass, and every other check in that set passes.

**Run 37723999952** is the `pull_request` run. It checked out merge ref 34f614a6, which is 9867fa9f merged into 8c9e3e95.
- Ubuntu failed in `kernel/tests/wire_bytes_invariant.rs`. Test `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` panicked at line 378 with "tracing is off unless a trace is started". The other test in that binary passed.
- Windows was still pending when I last read the checks.
- I read this as unrelated to this diff:
  - kernel/ is untouched.
  - `trace::is_enabled()` reads a process-global `ENABLED` flag (`engine/src/trace.rs:320-322` at 9867fa9f). `tracing_changes_no_byte_on_the_wire`, in the same binary, starts a trace, and nothing in that file serializes the two tests. That makes it a parallel-test race on global state.
  - Main's Rust CI at 8c9e3e95 is green. The merge ref differs from main only by this PR's two data-plane files.
- **Before the merge:** re-run the failed job and see it green, and see the pending Windows job finish green. The kernel race is a ledger candidate for its owner, not something this piece fixes.

## Commands (all light; none ran under a hold)

The cargo commands used `CARGO_TARGET_DIR=D:/wt-targets/dpcs`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`. Each incremental build recompiled only `spatial-data-plane`, in 8-13 s.

| Command | rc |
|---|---|
| `git fetch origin` | 0 |
| `git diff --stat` / `--name-only origin/main...origin/cut/data-plane-crowded-start-detail-spaces` | 0 |
| `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- <the two files>` | 0 |
| `git grep -n "already reached, so this" e888787e -- protocol kernel engine frontends` (P4) | 0 |
| Hash recompute loop, 18 references | all match |
| `cargo test --locked -p spatial-data-plane --test candidate_a a_connection_beyond_the_idle_ceiling_that_never_starts_is_told_why_in_single_spaced_words -- --exact` at the head | 0 (1 passed, 5.03 s) |
| The same, under M1 | 101 (FAILED at (b), as above) |
| `git checkout -- protocol/data-plane/src/server.rs` (revert M1) | 0 |
| `cargo test --locked -p spatial-data-plane --test candidate_a` | 0 (17 passed) |
| `cargo fmt --all -- --check` | 0 |
| `node scripts/plan/verify.mjs` | 0 (PASS) |
| `node scripts/plan/queue.mjs --check` | 0 |
| `node scripts/plan/site.mjs --check` | 0 |
| `node scripts/plan/verify-cites.mjs` | 0 (PASS, 34 loose advisories, none in this diff) |
| `node scripts/plan/verify-quotes.mjs` | 0 (PASS, 121 checked; the 2 hash-baselined entries are in `engine/LOD-PREREGISTRATION.md`) |
| `node scripts/plan/verify-test-claims.mjs` | 0 (PASS, 504 claims) |
| `gh pr checks 189` (twice) | 1 (one fail, one pending; see above) |
| `gh run view` / `gh api .../jobs/113137892822/logs` | 0 |

I did not run the workspace suite, the node scripts suite or clippy. The worktree `C:/dev/wt/dpcs-rev` is left with empty porcelain and HEAD at 9867fa9faa2feb9e61cb8b5d25f120be154f18f0. I did not touch `C:/dev/wt/dpcs`.
