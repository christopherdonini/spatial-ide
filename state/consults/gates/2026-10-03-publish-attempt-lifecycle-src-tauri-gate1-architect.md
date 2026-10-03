VERDICT: FAIL
Reviewed cut/publish-attempt-lifecycle-src-tauri @ 4d92733. PR #163, gate 1, architect.

Everything I say below about a cited span is paraphrase. Nothing is quoted. Spans that exist only on the branch are named in words at 4d92733. Each pin is given as `path:line @ rev` for the reviewer to hash. I computed no hash.

**Reading conditions.** The worktree was shared with the reviewer's runs while I read it:
- Its reflog shows a checkout to 6035fe7 and then back to the branch.
- One later read showed M3 applied inside `execute_with_progress`, with consumption after the boundary on the Local arm. A later read showed it reverted.

My code judgments rest on the unmutated shape. These are the five shapes I judged; the reviewer should confirm each at 4d92733, and a clean `git status --porcelain`, after its runs:
- `try_insert` refuses when the key is present.
- `wait_idle` reads the `watch` count.
- `on_exit_requested` swaps the once-flag.
- `cancel_all` cancels every value.
- `execute_with_progress` calls `remove_matching` inside the critical section that ran `find`, and calls it after the boundary only on the Shared arm.

I read KNOWN-LIMITATIONS 30 and Part R after the worktree had returned to the branch.

## S1 (blocking)

1. **KNOWN-LIMITATIONS 30 states a false fact about the ceiling case** (§2 item 4 requires facts only; it also contradicts §1's fourth may-claim and §2 item 3).
   - In paraphrase, the item's third sentence lists the exits the app does not drain. For each, it says the app does not cancel the publish. It puts "a publish not stopped when the 30 s end" in that list.
   - At the ceiling the publish was cancelled. `on_exit_requested` runs `cancel_all` before `prevent_exit` (the `lib.rs` run callback at 4d92733), and T6 asserts the token is cancelled. Only its quiescence outlasted the ceiling (ADR-018 §2).
   - Fix: move the ceiling case out of that list into its own clause: cancelled, not stopped within 30 s, the process exits anyway. The rest of the paragraph still holds for it unchanged: staging may remain, it is safe to delete, the intent has no outcome, and "unknown" cannot be recorded.
   - The PR body shows KL 30, so it must show the corrected text. KL 30 then goes to the human's sight as amended (§8 item 14).
   - §7 stands at 694 by the worker's count, which the reviewer recounts. The fix must stay at or under 700. Any overrun is class 8, and the §7 line is never edited.

## S2 (not blocking)

1. **The `Authority` fallback (point f).** In `execute_with_progress` at 4d92733, if `add` fails on the new local set, an `Ok` from `find` falls to `Authority::Shared`. There the boundary would find the same grant and run `publish_prepared` under the shared guard, which is the shape §8 item 4 forbids.
   - It is unreachable: the only refusal in `add` is the `MAX_GRANTS` ceiling (`kernel/src/permission/grant.rs:379-388 @ ff57832`), and the new set is empty.
   - So §8 item 4 is not breached. In the S1 fix round, add one comment line saying it is unreachable and why, or have the fallback refuse rather than hold the guard. Behaviour does not change either way.
2. **A publish that registers after the drain began is not cancelled (point b).** In practice this means an execute whose IPC was dispatched before `Destroyed` but whose `try_insert` runs after `cancel_all`.
   - It is bounded by the ceiling. If it outlasts 30 s it is KL 30's ceiling case; otherwise it completes a publish that was already approved.
   - §1's fourth bullet reads at the moment of the request, so it holds, and §8 item 6 is not breached.
   - Route it as a ledger finding (for example, `run_exclusive` refuses or cancels at once after a drain begins). Adding that here would be a class 9 scope addition.
3. **R1's "repeat with a larger viewport" advice.** A larger viewport risks the ADR-025 refusal at preflight (`frontends/shell/MANUAL-WALKTHROUGH.md:456-461 @ ff57832`). It is also unnecessary: `verifying-source` re-hashes the whole 5 GB source whatever the viewport, and the re-hash polls the token (`kernel/src/publish/mod.rs:701-711 @ 80cbcba`). Fold a correction into the S1 fix round, or drop the sentence.

## Judgments per §9

**Constitution items**
- **ADR-018 §1-2: pass.**
  - A cancel during the re-hash maps engine Cancelled to `PublishError::Cancelled` (`kernel/src/publish/error.rs:410-419 @ 80cbcba`), and the boundary maps that to the cancelled outcome (`kernel/src/permission/boundary.rs:276-279 @ 80cbcba`).
  - The ceiling's doc says it does not bound quiescence.
- **ADR-017 §15: pass.** T4 proves staging is removed through the kernel's `Err` arm.
- **ADR-006 row 17: pass.** There is no sweep. The only product-side deletions are the kernel's own.
- **ADR-024: pass.**
  - The grant leaves the shared set inside the critical section that found it.
  - The local set dies with the call.
  - `store.take` is unchanged, so the attempt stays single-use.
  - Nothing is persisted.
- **`docs/01` principle 7: pass.**
- **ADR-010 §6-7: pass.** `EXIT_DRAIN_CEILING` is declared at its own site, with a doc that names it a declared ceiling, not a measured bound.

**The 2026-10-03 exit-drain ruling** (`state/directives/2026-10-03-exit-drain-ruling.md:7-12 @ f421ad1`)
- **(a): met.** §2 item 5's R3 table covers all three OSes, including macOS's convention, which is not followed and is routed. The code adds no OS-keyed logic, and KL 30's last sentence carries the same statement.
- **(b): met in code.** There is no `append_intent` or `append_outcome` in src-tauri. T4 asserts exactly two records, both the kernel's. §1 says where the shell cannot record "unknown". KL 30's wording is S1-1.
- **(c): met.**
  - Step 4 relaunches the app at once.
  - The checks cover the data plane (i), staging (iii) and the audit (iv: cancelled, no corrupt line), plus (ii) and (v).
  - The audit check is passive, because the new process does not publish. That is §2 item 6's declared residual.

**Point (a), R1's additions: pass, and not class 9.** §9's step list is marked as paraphrase, and both additions are concretizations inside its constraints.
- Current view sized as H6 does: Whole dataset is refused before the pin (`frontends/shell/MANUAL-WALKTHROUGH.md:456-461 @ ff57832`), so it could never reach staging.
- The built debug executable for both launches: this is the normal build, not the measure build, and §9 requires the same launch both times. `strictPort` makes a second `tauri dev` unusable.

**Seams**
- **S1: pass.** The shell uses the kernel's actual `find`, `remove_matching`, `add`, `PublishGrant: Clone`, and the `&GrantSet` field of `PublishAttempt`. T2 and T3 drive the real `boundary::execute` and the real publish.
- **S2: pass.** T4 runs the real kernel publish through `run_exclusive` and `on_exit_requested`, and asserts that staging is gone and that the kernel's cancelled outcome is the last of only two records.
- **S3: the source read checks out; R1 is queued** (question round 40, item 3).
  - I re-read tauri 2.11.5 `src/app.rs`:
    - `ExitRequested` carries `code` and `api`;
    - `prevent_exit` sends unless the code is the restart code;
    - `AppHandle::exit` calls `request_exit`;
    - the run callback forwards `ExitRequested` unaltered.
  - I re-read tauri-runtime-wry 2.11.4 `src/lib.rs`:
    - the last window's `Destroyed` emits `code: None` and reads the answer with `try_recv` straight after;
    - `request_exit` posts `RequestExit` through the event-loop proxy, which is safe from the tokio worker;
    - that path re-emits `Some(code)` with `try_recv`.
  - tauri 2.11.5 `src/async_runtime.rs` uses the default `TokioRuntime::new()`, and the shell sets no runtime, so the drain's `tokio::time::timeout` has its timer driver.

**Caller rule (point d): pass at the head.**
- Callers at 4d92733:
  - `run_exclusive` is called by `binding_publish_execute`;
  - `try_insert` is called by `run_exclusive`;
  - `on_exit_requested`, `ExitAction`, `wait_idle` and `EXIT_DRAIN_CEILING` are used by the `lib.rs` run callback;
  - `cancel_all` is called by `on_exit_requested`;
  - `DrainOutcome` is `wait_idle`'s return type.
- The dead code at 40aa795 is an artefact of how the commits were split. §8 item 13 reads the code that lands, and every item there has a product caller.

**§8, item by item**
1. **Pass.** The worker's numstat covers exactly the 5 files; the reviewer recounts.
2. **Pass.**
3. **Pass.** The `.expect` text and the panicked-message format are identical to the base.
4. **Pass**, with S2-1 noted.
5. **Pass.** Execute keys are only `try_insert`ed and are removed only by their registrant. Prepare keys carry their own prefix.
6. **Pass (point b).**
   - The callback takes only a short registry lock and does not wait.
   - The once-flag allows exactly one `prevent_exit`.
   - A second `ExitRequested` gets Proceed. The drain's own `app.exit` at the ceiling needs this; without it the exit would be prevented forever, as M6 shows.
   - No other `app.exit` or `restart` caller exists in src-tauri. The only plugins are opener and dialog, so an early exit is unreachable at the head. A future caller is that piece's gate concern.
7. **Pass.**
8. **Pass.**
9. **Pass (point c).**
   - `Park` and `Settle` cannot hang. `Settle`'s drop takes both rendezvous if the execute never parked, and that includes an unwind.
   - Under each of M1-M6, no lock-taking call follows a held lock.
   - T4's 60 s is a hang guard. It asserts no duration, and the work after the release takes milliseconds.
   - T5's ZERO and 60 s ceilings are deterministic on a current-thread runtime.
10. **Pass (point f).**
    - `Authority` is private.
    - The `CancelToken` closure annotation is neither a `cfg` nor OS-keyed; it avoids the `cfg` that §8 item 10 forbids.
    - The `#[cfg(test)] fn len` on `RunningPublishes` predates this piece (`frontends/shell/src-tauri/src/publish.rs:1022-1025 @ 80cbcba`).
11. **Pass.**
12. **Pass**, pending the reviewer's observations.
    - T1-T6 are present.
    - The `RECORDED MUTATION` comments name c92b17b.
    - The worker's report does not call the `verify-mutation` run an observation.
13. **Pass.**
14. **Open.** The human's sight is still owed, on KL 30 as corrected for S1-1.
15. **Pass.** 694 is within 700, and there is no scope addition.

## N

1. **The KL 30 number (point e) is confirmed.**
   - At base, item 29 sits out of order at `KNOWN-LIMITATIONS.md:163 @ ff57832`, and the file ends at 28.
   - At 4d92733, item 30 is appended after 28, at the end of the file.
   - KL 30's other facts match §1, §2 items 4 and 5, and condition (b).
   - Optional: "Only Windows has been exercised" is premature until R1 runs. At merge, Windows has L1 only.
2. `DrainOutcome`'s variants are read only by tests, and the product caller discards the value. §2 item 3 fixed that shape, and §8 item 3 forbids logging it. Acceptable.
3. `try_insert` and `cancel_all` are `pub` but called only from inside the module. They could be private. This is not a violation.
4. The mapping of `None` to `UnknownAttempt` in `binding_publish_execute` has no automated test, the same as the existing prepare precedent, and R1 does not reach it either.
5. The shared worktree hazard is described under Reading conditions above.

## ADR skeleton

None; no decision is missing.
