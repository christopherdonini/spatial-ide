*Custodian's filing note (2026-10-08): `data-plane-crowded-start-detail-spaces`'s worker report, for C1 and T1 at the branch head 9867fa9faa2feb9e61cb8b5d25f120be154f18f0 (worker run 22:35:43Z to 23:25:16Z on 2026-10-07, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 53eae644fc4e11dbc377b81d2c127564190675768f71e6cd3cd6b5e00aeccda6. Paths and lines below are at the branch head, not main, except the P4 bullet's bare cite of `protocol/data-plane/src/server.rs:462`, which is at the base e888787e (the gate-1 architect's D4).*

---

**Report: node:data-plane-crowded-start-detail-spaces@g1 (C1 + T1)**

**Commit (one, pushed as an ordinary update, worktree clean):** 9867fa9faa2feb9e61cb8b5d25f120be154f18f0 "fix: the data plane's crowded-start detail loses its three runs of 22 spaces; T1 pins the received bytes". It holds both C1 and T1. The message cites server.rs `handle` -> `terminal_and_drain`, the suite's `drain`, and the shell decoder `frontends/shell/src/streaming/wire.ts`. I did not re-read the wire.ts site; the commit message cites it from the form.

**What was built**
- **C1:** the `format!` literal in `server.rs` is now `\`-continued, in the admission-refusal shape, with each continued line ending in a space. All three 22-space runs are gone and no word, placeholder or punctuation changed. Before editing I confirmed `protocol/data-plane/` differs from a21435ed only by the form.
- **T1:** `a_connection_beyond_the_idle_ceiling_that_never_starts_is_told_why_in_single_spaced_words`, placed before the M2-commented test in `candidate_a.rs`.
  - It opens `MAX_IDLE_CONNECTIONS + 1` real WebSocket connections with `start`, `factory` and `connect`, and sends no START or credit.
  - It races the suite's `drain` over all of them with `futures_util::future::select_all` and takes the first TERMINAL.
  - It asserts code `TERM_TRANSPORT_FAILED`, then detail equal to the §2 template rendered from the public constants, then no `"  "`.
  - It drops the pending receives, closes every connection, and calls `dp.shutdown()`.
  - It has no sleep, no elapsed-time assertion, no wait on `START_TIMEOUT`, and no new `pub` item.

**§7 count** (`git diff --numstat e888787e HEAD -- <the two files>`, merge-base = e888787eeec1e5ce63adf56a9aff1b087951e889):
- `server.rs`: 4+1 = 5, ceiling 8.
- `candidate_a.rs`: 40+0 = 40, ceiling 60.
- Total 45, ceiling 68. No class 8.

**M1 (applied by hand)**
- **Test and mutation:** T1 by name. The mutation restored the base's `server.rs` bytes with `git show e888787e:protocol/data-plane/src/server.rs`, so the three 22-space runs came back.
- **Failing assertion:** the `assert_eq!(detail, expected, "the crowded-start detail, as received")` assertion, i.e. (b). Left side: `...declared ceiling                      MAX_IDLE_CONNECTIONS=4 was already reached, so this                      connection was held for 5s rather than                      120s`. Right side: the single-spaced text.
- **Observation commit:** 9867fa9f with M1 applied to the working tree. I ran `cargo test -p spatial-data-plane --test candidate_a a_connection_beyond_the_idle_ceiling_that_never_starts`, and it came back FAILED.
- **Reverted:** yes, with `git checkout -- protocol/data-plane/src/server.rs`; `git status --porcelain` is empty.
- **T1's comment:** `RECORDED MUTATION (M1)` says the literal is restored to its three runs of 22 spaces and that it fails at the assertion that the detail equals the template text rendered from the public constants. It has no line number. No `verify-mutation` run was made.

**P3 and P4**
- **P3, detail as T1 received it, with the unmutated C1:** `no operation started, and the declared ceiling MAX_IDLE_CONNECTIONS=4 was already reached, so this connection was held for 5s rather than 120s`. This is inferred from the `assert_eq!` against the rendered template passing. The M1 failure output shows the same words, spaces aside.
- **P4, at the base (`git grep -n "already reached, so this" -- protocol kernel engine frontends`, rc 0):** it finds the code literal at `protocol/data-plane/src/server.rs:462`, plus the form itself at `protocol/data-plane/CROWDED-START-DETAIL-SPACES-PREREGISTRATION.md` lines 55, 104 and 105. The form is in `protocol/` at the base, so it matches. No reader of the detail's text was found, so the invalidator does not fire. The prediction's wording "only server.rs" is literally off by the form's own lines; I treat that as not a defect.

**Checks (exit codes)**
- `cargo test --workspace --locked --features spatial-engine/fixture`: rc 0. Every `test result` line read ok and none FAILED. `candidate_a` ran 17 tests, passing, including T1.
- `cargo fmt --all -- --check`: rc 0.
- **Clippy:** no workflow under `.github/workflows/` runs it. `product-ci-rust.yml` runs build, test and fmt, and `rust-fmt.yml` says "not clippy". I did not run clippy.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 450 tests, 450 pass, 0 fail.
- `verify.mjs`: 0. `queue.mjs --check`: 0. `site.mjs --check`: 0.
- `verify-cites.mjs`: rc 0 with no arguments (34 advisory, none gated). It rejects file arguments and `--help` with "unknown argument" (rc 1), so I ran it bare.
- `verify-quotes.mjs --show-cites <the two files>`: rc 0, PASS, 0 checked. It reports 2 stale baseline entries under `engine/LOD-PREREGISTRATION.md`, which are not mine.
- `verify-test-claims.mjs`: rc 0, PASS.

**Heavy commands:** all ran under the shared hold with the one-call shape: the cold workspace `cargo test` (background, hold granted) and the node suite (foreground, hold granted). The M1 test run was an incremental build of about 25 s plus a 5 s test, so it ran outside a hold and was never heavy.

**Deviations from the form:** none, so no amendment class is owed. The only differences are P4's wording note above and clippy being absent from CI.

**Noticed, not done:** nothing outside the two files. The node's summary correction (two runs becomes three) is not in this commit, because `PLAN.yaml` is outside the worker scope here. The form's §0 puts it in the same PR, so the custodian owes it.

**Model:** claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff.
