VERDICT: FAIL
Reviewed cut/publish-attempt-lifecycle-src-tauri @ 4d92733a382ad905108c76fa3c0a2db05d996d51. PR #163, gate 1, reviewer.

**Merge status (a fact, not a code finding).** PR #163 was merged while this gate was running. GitHub reports it MERGED at 2026-10-03T08:01:55Z by the account christopherdonini, as merge commit 4e3c8a8b4fd48205c5e988b10d3dc246da92ac02. PR #162 had merged at 08:01:40Z, as 25b57c4. No gate-1 report had been filed.

What the merge changed:
- `git diff --stat 4d92733 4e3c8a8` is empty for `frontends/shell/src-tauri` and `frontends/shell/MANUAL-WALKTHROUGH.md`.
- `KNOWN-LIMITATIONS.md` differs only by #162's addition to item 1. Item 30 is still the only item 30 in the merged file.
- Every finding below is therefore a correction after the merge.

On §8 item 14: the PR body showed item 30 under a heading asking for the human's sight before the merge. That text matches `KNOWN-LIMITATIONS.md` lines 302-314 at 4d92733 byte for byte (checked with `cmp`). Whether the merge click was that sight, I cannot tell.

## S1 (blocking)

1. **KNOWN-LIMITATIONS 30 says the publish is not cancelled at the ceiling, and it is cancelled.** This is a correctness failure under §1 (fourth may-claim) and §2 item 3.
   - The sentence is at `KNOWN-LIMITATIONS.md:306-308 @ 4d92733 sha256:57d8f3cb551d19618d569cfa3ce42060cffe0a4341feb5feb93000a04d3a9384`. Paraphrase: it lists "a publish that has not stopped when the 30 seconds end" among the cases in which the app does not cancel the publish.
   - In the code, `on_exit_requested` cancels every registered token before the drain begins (`frontends/shell/src-tauri/src/publish.rs:1139-1150 @ 4d92733 sha256:91521ac61fc3a51c5a688885ba70a24242b165bbb276e9607e7e55d698595476`). T6 asserts that the token is cancelled, and T4 proves the effect.
   - The form's own §1 fourth may-claim states the same (`frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md:81 @ ff57832 sha256:844a3554aac80e8c20298076c249cc0159cd14af5be29bea5d864bcc4b93ce78`).
   - So for the ceiling case the item tells the operator the opposite of what the code does.
   - Fix: take the ceiling case out of the "not cancelled" list and state it separately: cancelled, but not stopped when the 30 s end. The new wording needs the human's sight again (§8 item 14). Because the PR is merged, this has to be a follow-up.

## Checklist results

**My own runs**
- **P0** at 6035fe7. That commit is the base's product code plus T2: `git diff ff57832 6035fe7` touches only `mod tests`. T2 FAILED with the panic text quoted here byte for byte: "try_lock found the shared grants mutex held while publish_prepared ran". The `park.reached()` assertion before it passed. Reproduced.
- **M1 to M6** at 4d92733. Each was applied with perl, its test run alone, and the file restored with `git checkout`. Every run was rc 101, and `git status --porcelain` is empty afterwards. The failures:
  - **M1** (unconditional insert): T1 failed at "the second call must be refused".
  - **M2** (`Authority::Shared` always): T2 failed at its `try_lock` assertion.
  - **M3** (`remove_matching` after the boundary on the Local path): T3 failed at "C's grant must have survived A's consumption: refused: no grant authorizes `publish-static-bundle`…".
  - **M4** (empty `cancel_all`): T4 failed at its `Refused` let-else. The output was `got Some(Success {` followed by the full struct.
  - **M5** (`wait_idle` returns Drained without reading the count): T5 failed at "one entry left at a zero ceiling" (left Drained, right TimedOut).
  - **M6** (no once-flag): T6 failed at "a drain has already begun" (left PreventAndDrain, right Proceed).
  
  This matches the recorded comments, apart from N2.
- **§7.** The form's command over `ff57832...4d92733` gives 657 insertions and 37 deletions, 694 lines over exactly §7's five files. That is within the 700 budget, so there is no overrun and nothing to record as class 8.
- **Pins.** The form has 70 `@ rev sha256` references, 68 of them distinct. All 68 recompute (`git show <rev>:./<path>`, lines a-b, LF). Both revs, b43c0eb and f421ad1, are ancestors of origin/main. Every reference is contiguous on one line.
- **Tool commits** (last commit touching each file at 4d92733; the same on origin/main 4e3c8a8):
  - `verify-cites.mjs`: 522e448d55e089b974e115e23f0c72bfc6e1120a
  - `verify-quotes.mjs`: f9444a4d99a9087394c55d4b1d4c414a8b11f980
  - `verify-test-claims.mjs`: e9735d4749f094f03b69a8b570e8bf10f511c279
  - `verify.mjs`: 260720226f136d1ec7d72da64656f07d29400ed7
  - `verify-mutation.mjs`: 7d24ed155a120556d6e726eea68237409270d975 (I did not run it, and treat no run of it as an observation)
- **CI on PR #163.** Every check passed:
  - PR runs: Product CI — shell 37107890259 (vitest, cargo test and NSIS tauri build), Exposure scan 37107890128, DCO 37107890156, Rust fmt 37107890106.
  - Push runs: Rust fmt 37107749213, Product CI — shell 37107749472.
  - No Governance CI ran on the branch. I ran its steps myself (below).
- **CI on main after the merge** (4e3c8a8): Product CI — shell 37108325597, Governance 37108325398, Pages 37108325352, Rust fmt 37108325435 and Exposure 37108325360 all succeeded. **Pending at finish:** #162's Product CI — Rust workspace, 37108309616, still in progress. No Rust-workspace run is listed for 4e3c8a8.

**§8, one by one**
1. Only the five files are touched.
2. No command, parameter, event, outcome variant, SKP or MCP change.
3. No UI string, Display or log line changed. The `.expect` text is byte-identical to the base.
4. On the Ok path the guard drops before `boundary::execute`, and there is no second `remove_matching`. The only route to the shared path after a found grant is `GrantSet::add` failing on a fresh set, which cannot happen (`MAX_GRANTS` = 64). See S2-5.
5. `run_exclusive` and `try_insert` check and insert in one critical section, and only the registrant removes the key.
6. No wait on the event-loop thread. `on_exit_requested` takes the registry mutex briefly; nothing holds that mutex across a wait. `prevent_exit` runs once per process (T6). The drain's own `app.exit(0)` is the only exit caller in src-tauri (grep).
7. No sweep or deletion.
8. src-tauri has no `append_intent` or `append_outcome` call. T4 asserts exactly 2 audit records.
9. No sleep. For the 60 s bounds, see (c).
10. The diff adds no `cfg`, platform ignore or OS key.
11. No single-instance mechanism.
12. T1 to T6 are present, and I observed P0 and M1 to M6 myself. No record calls a `verify-mutation` run an observation: the worker report says so explicitly.
13. Caller grep: `try_insert` is called from `run_exclusive`, and `run_exclusive` from `commands.rs`. `cancel_all` is called from `on_exit_requested`. `on_exit_requested`, `ExitAction`, `wait_idle` and `EXIT_DRAIN_CEILING` are used in `lib.rs:565-576 @ 4d92733 sha256:a106a2c6836692fcd810bda0cebba7ec1b846f5d16b39896ccb6b69ab3c0b352`. For `DrainOutcome`, see S2-7.
14. See the merge status above.
15. No overrun and no scope addition.

**Seams**
- **S1** (shell into `boundary::execute` and `GrantSet`). I read the kernel side: `find` and `remove_matching` at `kernel/src/permission/grant.rs` in this tree; `PublishGrant: Clone`; boundary steps 4 and 6 run `find` on `attempt.grants` before `publish_prepared`. T2 and T3 start from `execute_with_progress`, which is the shape the product calls.
- **S2** (cancel into staging and the audit outcome): T4, through `run_exclusive`.
- **S3** (the Tauri event loop). I read tauri-runtime-wry 2.11.4's `Destroyed` branch and `RequestExit` branch, and tauri 2.11.5's `prevent_exit` and default runtime. Paraphrase: when the last window is destroyed, the runtime emits `ExitRequested { code: None }` and calls `try_recv` straight after the callback, and the default runtime enables timers. That fits the code, and R1 remains the proof (round 40, item 3).
- The managed type `Arc<publish::RunningPublishes>` is the same in `setup()` and in `try_state`.

**The custodian's points**
- **(a) R1's additions.** Both stay inside §9's paraphrase and condition (c).
  - Part H's H6 itself says to stay under about 300k rows and to choose Current view. M10 refuses Whole dataset on the 5 GB fixture.
  - `strictPort: true` is set in `frontends/shell/vite.config.ts`. M12's mode 2 runs the built executable from the path R1 names. Using it both times satisfies "the same way it was launched", and it is a normal build, not the measure build.
  - Condition (c)'s audit and staging checks are vacuous for the second process. That is §2 item 6's own prediction; see S2-9.
- **(b) The second `ExitRequested` returning Proceed** matches §2 item 3 to the letter. It does not breach §8 item 6 today, because the drain is the only exit caller. A future exit caller would end a drain early (S2-2). The publish that registers after the drain has begun is S2-1.
- **(c) The 60 s `wait_idle` bounds in T4 and T5** are not sleeps, and no test asserts a duration. They are liveness guards, so no test hangs under M1 to M6, which I confirmed. They do make an asserted value depend on wall time (S2-3).
  - Park/Settle: one rendezvous on a `Barrier(2)`, with an atomic once, so no sleep is involved. Settle covers an execute that never parks. A hang is still possible if the controlling thread panics between `wait_parked` and `release` (S2-4), but not under its own mutation, so §8 item 9 is met.
- **(d) Dead code at 40aa795.** The caller rule and §8 item 13 read the piece's diff, and at 4d92733 every new `pub` item has a product caller. Not a failure (N3).
- **(e) KNOWN-LIMITATIONS 30.**
  - Number 30 is confirmed: item 29 sits at line 163, out of order, item 28 is at line 294, and no other 30 exists in the file at 4d92733 or 4e3c8a8.
  - Facts: S1-1 and S2-6.
- **(f) The `Authority` enum and the `CancelToken` annotation.**
  - The private enum implements §2 item 2's Ok and Err semantics exactly. Its silent fallback is S2-5.
  - `|cancel: CancelToken|` is a type annotation, not a `cfg` or an OS key, so §8 item 10 is clean.

**My checklist**
- No JSON on a data path. T4's `serde_json` reads the audit log in test code only.
- No CRS, float or perf claims.
- The "No duration is measured" line in Part R is consistent with that.

## Exit codes

| Command | rc | Notes |
|---|---|---|
| `cargo test --lib` T2 at 6035fe7 | 101 | P0 |
| M1 to M6, at 4d92733, each | 101 | |
| `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` at 4d92733 | 0 | 65 lib, 0 main, 2 `sole_caller_scan`, 0 doc. All nine §5 declared-unchanged `publish.rs` tests ok. |
| `cargo fmt … -- --check` | 0 | |
| `npm run verify` in `frontends/shell` | 0 | 72 files, 1096 tests; citation integrity 29 checks |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 408 passed, 0 failed |
| `verify-cites.mjs` | 0 | |
| `verify-quotes.mjs` | 0 | |
| `verify-test-claims.mjs` | 0 | |
| `verify.mjs` (verify:plan) | 0 | |

- Every cargo command used `CARGO_TARGET_DIR=D:/wt-targets/publish-lifecycle`.
- The tree was clean at the end. No cargo or rustc process of mine remains, and the app was not launched.

## S2

1. **A publish that registers after the drain begins is not cancelled.** `cancel_all` runs once. An execute already dispatched when the window closes reaches `try_insert` after it, and is then awaited to the ceiling, or completes and publishes after the close. Suggest that `try_insert` refuse, or cancel at once, when `drain_begun` is set.
2. **The once-flag makes any future exit caller end a drain early.** Suggest that `on_exit_requested`'s doc name the drain as the sole permitted exit caller, as a constraint on future code.
3. **T4's `Drained` depends on finishing within 60 s.** Suggest joining `a` first and then asserting with `wait_idle(Duration::ZERO)`. T5 already proves the wake path. The code is at `publish.rs:3066-3074 @ 4d92733 sha256:1815e7acd9662f81bc94c4f9635815af6ca1051038091b3666410addbfaad8b5`.
4. **Park/Settle can still hang if the controller panics.** If the controller panics while A is parked (`staging_entries`' `unwrap`, T3's `prepare_one` panic), `thread::scope` waits forever. Suggest a release-on-drop guard on the controlling side.
5. **The `Authority` fallback is silent.** `one.add(grant).ok()?` falls back to the shared path, where `publish_prepared` would run under the guard with a found grant, which is §8 item 4's letter. It is unreachable, since a fresh set is below `MAX_GRANTS`. Make it explicit, or say so in a comment. The code is at `publish.rs:801-814 @ 4d92733 sha256:5ae10146ec5934d2d6fa136502b2f2a5ba752acab85ff88535fed51b9479b7fe`.
6. **KNOWN-LIMITATIONS 30 overstates two things.**
   - It says the audit "records an outcome of cancelled" on a drained close. A cancel that lands after the kernel's last cancel check can still end in success.
   - Its macOS and Linux sentence is a claim off Windows. §1 forbids that. The source-read qualifier exists only in the HTML comment, so "Only Windows has been exercised" is the only qualifier a reader sees. #162's item 1 now says the shell has no level off Windows.
7. **`DrainOutcome` is produced on a product path but read only by tests.** `lib.rs` discards it. Consider narrowing its visibility, or saying in its doc that tests are its only reader.
8. **`run_exclusive` skips removal if `body` panics or is dropped.** Removal is not RAII (`publish.rs:1166-1181 @ 4d92733 sha256:149054915383abe6ef98bda4972f904ccabebd17f15e09b85c7947e516b6f8d7`). The base had the same shape, and the product body turns a panic into `JoinError`. Under the drain, a leaked key now costs the 30 s ceiling.
9. **Condition (c) is checked only trivially for the audit log and staging.** The relaunched process neither publishes nor writes the audit, as §2 item 6 predicts. It is the architect's call whether R1 discharges "checks that the two processes don't conflict" for those two.

## N

1. `commands.rs:248-251 @ 4d92733 sha256:0c29f7f8b64fd3ec33e722a4e49adee4eb3368a3a9f9feb9ad810a73fe129b5b` still calls the prepare key's unconditional removal "the SAME precedent" as `binding_publish_execute`. The execute no longer removes unconditionally.
2. M4's recorded comment puts `got Some(Success { .. })` in quotes. The actual panic prints the full struct, and the `..` is not marked as an elision. This is test text, not an amendment.
3. 40aa795 carries the exit API with no caller until 005d2f5. With a merge-commit merge, that commit is in main's history and would warn on its own.
4. "Before R1" does not say to build `target\debug\publish-bundle.exe`. Step (iv) relies on H9's pre-check.
5. The worker report is staged (`A`) in the custodian's checkout and is not in origin/main at 4e3c8a8. It carries line cites without a commit (`commands.rs:422`, `lib.rs:567-572`). Both resolve at 4d92733.

Files:
- C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/publish.rs
- C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/lib.rs
- C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/commands.rs
- C:/dev/wt/publish-lifecycle/KNOWN-LIMITATIONS.md
- C:/dev/wt/publish-lifecycle/frontends/shell/MANUAL-WALKTHROUGH.md
- C:/dev/wt/publish-lifecycle/frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md
