*Custodian's filing note (2026-10-04): PR #173's gate 1, the architect, for PLAN node `watch-grandparent-spawn-signal`, under the tag node:watch-grandparent-spawn-signal@g1. Reviewed: cut/watch-grandparent-spawn-signal @ f0e892806b0ab1ba28171a50c76afe25254fc148 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 5 to the end, is ec519506c0337616a124582a7be5c88c32247ac8b7dd0170c339209d252c3ed0. Write audit PASS: zero write calls (Read 23, Grep 7, the hand-back 1); the run lasted 16:28:40Z to 16:31:37Z. C3: the worktree is at f0e89280 with an empty porcelain before (16:28:07Z); the main checkout's porcelain held only its two pre-existing untracked items before and after (16:31:48Z), and main did not move. The architect read a byte-exact export of the head's `kernel/` and `engine/` trees at `C:/dev/wt/wgss-head-f0e89280`, while the parallel reviewer ran mutations in the worktree. Profile paths redacted at filing: none.*

---

Reviewed: cut/watch-grandparent-spawn-signal @ f0e892806b0ab1ba28171a50c76afe25254fc148 · Verdict: PASS

I read the branch in the byte-exact export at C:/dev/wt/wgss-head-f0e89280/. Every branch cite below is at f0e89280 and carries no hash, because round 25 item 2 forbids a hash pin at a branch commit and the reviewer recomputes hashes. Base comparisons are against main's working tree. The four code files there are unchanged since 4c91a76e. The form is cited by section and item.

## The three custodian changes at filing
None of them changes the form.
- **The 20 pins at 38bb2d63.** Each pin covers the line range the draft named. By reading, I checked that every range still covers its claim at base: watch.rs 649-666, 484-510, 681-691, 693-707, 330-357 and 90-99; skp.rs 1130-1137, 1258-1276 and 1203-1239. I cannot recompute the sha256 values without Bash. The reviewer's recomputation is the proof.
- **The `:16` expansion** to `engine/WATCHER-FIRST-READ-PREREGISTRATION.md:16`. This is the same reference in full form, as round 14 requires for a continuation.
- **The header line now says "on main before any code".** This fixes the draft's contradiction with its own §8 item 1, which my draft had flagged.

## §8, item by item
1. **Code before the form on main.** PASS. The form landed at 4c91a76e, and P-1's base is 4c91a76e (worker report 1, P-1). The code is in f25aef60, after it. The reviewer should confirm the parentage with git.
2. **Wire, detail or `Display` string changes.** PASS, none. The kernel adds kernel/src/skp.rs:1259-1273 @ f0e89280, which reuses `engine_error_of_pre_admission_signal` and `error_of`. It adds no literal.
3. **`engine/src/watch.rs` beyond §2a.** PASS. The only change is the doc at engine/src/watch.rs:58-60 @ f0e89280: two clauses that carry §2a's one engine fact (numstat 3+1). It adds no cfg.
4. **New `pub` item, option, callback or test-only path in product code.** PASS, none. The plumbing change is in `kernel/tests/injected_watch/mod.rs`, which is test code.
5. **`Watching` arm, sink closure, K6 or K8 edited.** PASS. The `Watching` arm (1187-1257) and the sink closure (1126-1169) are byte-identical to base. K6 and K8 are byte-identical to main's 336-371 and 415-435.
6. **What a refused open leaves behind.** PASS.
   - It drops the guard, then calls `catalog.remove`, then returns. That is the `Watching` refusal's order.
   - It mints no `SessionRef`, does not call `mint_for_open`, and stores no `OpenRecord`.
   - The latch stays `PreAdmission`, so the sink's `Admitted` arm, the only route to an event, is unreachable.
   - GS1 and GS2 assert an empty catalog and no event (kernel/tests/source_watch_ordering.rs:399-407 @ f0e89280).
7. **Mutation recorded as observed on a `verify-mutation` run.** PASS. Both mutations were applied by hand, run, and reverted at f25aef60. The report states this was not via verify-mutation.
8. **§7 overrun.** PASS. The four files total 95 lines (3+1, 14+0, 6+0, 71+0), against ceilings of 160 lines and 4 files. This matches the custodian's 97/4 minus the README's 3/3. §7 is not edited.
9. **Diffs under `protocol/`, `frontends/` or `renderer/`.** PASS, none. Five files changed, all in kernel/ and engine/.

## §0 item 4's readings
- **(a) holds.** `engine/SOURCE-WATCHER-PREREGISTRATION.md:149` (step 1) names no coverage condition. Step 3, at :151, stores `OpenRecord { watch, coverage }`, so the admission steps were written for both arm outcomes.
- **(b) holds.** Admitting would discard a recorded engine fact silently. The descriptor checks are a backstop, not a trace.
- **(c) holds.**
  - The new engine doc states an engine fact only: delivery may already have happened, and it returns before `arm` does.
  - The consequence (refusal) appears only in the kernel comment at kernel/src/skp.rs:1260-1264 @ f0e89280. This complies with round 7's operator-visible-text ruling.

## §1 seam, read against engine/src/watch.rs @ f0e89280
- **Every `ChecksOnly` return comes before any thread exists or after every thread is joined:**
  - 608-635 return before any spawn.
  - 667: `spawn_watch_thread` either joins on `Err` (590) or never created a thread (572-581).
  - 686 and 707 drop `SourceWatch`, which joins P (502-505) before returning.
- **The sink is called only from the watch thread (335, 348, 357).** A G thread that fails its handshake exits before any sink call (311-315). So every sink call returns before `arm` does. I3 does not fire.
- **I4.** `PlatformWatch` (84) is the only product implementor. The others are `#[cfg(test)]` (skp.rs 2302-2346 and FlagArm) or under tests/.
- **The end-to-end proof is real.** It drives the real `SkpHost::open_dataset` through `InjectedArm`, a real `SourceWatchArm`. Under checks-only, `InjectedArm` calls the sink inside `arm` and then returns `ChecksOnly` (kernel/tests/injected_watch/mod.rs:86-96 @ f0e89280), which is the engine's actual ordering. No test in kernel/ combines `mark_checks_only` with `fire_on_next_arm` except GS1 and GS2, so the plumbing change shifts no other test. The seam satisfies the round-4 rule.

## docs/01 principle 8
PASS. A delivered engine fact is no longer dropped silently. It surfaces as the typed refusal that already exists.

## R1 to R6 against §2d
PASS.
- **R1.** There is one admission rule everywhere. Off Windows the branch cannot be reached in the product, because the non-Windows arm never calls the sink (engine/src/watch.rs:92-101 @ f0e89280). That is checks-only mode, already declared in KNOWN-LIMITATIONS 24 and in R2's table.
- **R2 and R4.** No new cfg. The kernel change does not depend on the platform.
- **R3.** §2d states the owning boundary and each platform's behaviour and tests.
- **R5.** L1 only, and nothing is claimed above it.
- **R6.** GS1 and GS2 are plain `#[test]` with no ignore. The Windows-only compile-outs in watch.rs are untouched.

## The user-visible change
I agree with the custodian. The change is already ruled, and no ruling from the human is needed before merge.
- §2b step 1 is unconditioned, and it was filed, gated and merged by the human.
- The node's source, the gate-2 reviewer's S1, proposes this exact remedy: refuse by kind when the latch already holds a signal (`state/consults/2026-09-26-source-watcher-gate2-reviewer.md:173`). The human placed that node in round 31, item 1.
- No new state appears: the codes and detail strings already exist. So P-016's line between a new state and an already-ruled change falls on the ruled side.
- The human was told before the form was committed, and the merge is the human's click.

## Owner's index
PASS.
- kernel/README.md:356 @ f0e89280 matches the line at my draft's line 202 (inside the fence at 199-205) by reading. The reviewer can confirm it byte for byte.
- The form is appended to the preregistration list (:373).
- "Last verified at" is f25aef60 (:350). That is the last commit touching pointed-to code, and every pinned test exists there.
- `engine/README.md` is untouched, as §9 says.

## The tests against §4
PASS.
- GS1 and GS2 share the helper `a_checks_only_open_refuses_a_recorded_signal` (kernel/tests/source_watch_ordering.rs:381-414 @ f0e89280).
- Each carries its own RECORDED MUTATION doc and a `// Mutation: see` line (416-419 and 429-432), following the file's existing Expected-failure convention (compare K7 at 448-452).
- GS1 asserts the second checks-only open succeeds and `describe` reports `ChecksOnly` (409-413), as §4 requires.
- The GS2 mutation was observed failing at the code assertion (397) with GS1 still green.

## Findings
- **N1, the closing record.** P-1's span is named as "line 396 in that uncommitted state", identified by base 4c91a76e and the diff sha256 95e5cea2… (worker report 1, P-1). By reading, the same line holds the same `expect_err` at f25aef60. The closing amendment should name the commit for every test-text span. Any hash pin must be at a main commit after merge, never at f25aef60 (round 15 (e); round 25 item 2).
- **N2, the closing record.** Worker report 1 records neither P-3 (each CI entry's `--list` gains exactly GS1 and GS2, and `--list --ignored` is unchanged) nor §5's declared-unchanged cfg-boundary site count, base against head. The closing amendment must resolve both from CI output, by reference.
- **N3, outside this piece's scope.** The older doc sentence at engine/src/watch.rs:57-58 @ f0e89280, which says the caller falls back to checks alone, states a consumer consequence in engine text. It is now incomplete for the refused case. §8 item 3 rightly forbade touching it here. It could be a later doc nit.

## Closing-record list (references and hashes only, per the record cap)
- P-1: base 4c91a76e, diff sha256 95e5cea2af21d98c8435a11c7e8bc62fe2fc3e35b110e06f5621bbf4a488f348, failing at the `expect_err` line by commit.
- P-2: f25aef60, the per-crate result lines.
- The GS1 and GS2 mutations, each observed at f25aef60 by name.
- P-3 and the cfg-boundary site count, each from CI runs by reference.
- §7: 95 of 160, 4 of 4.
- The gate reports for gate 1.

Files: C:/dev/spatial-ide/kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-04-watch-grandparent-spawn-signal-worker-report-1.md, C:/dev/wt/wgss-head-f0e89280/kernel/src/skp.rs, C:/dev/wt/wgss-head-f0e89280/engine/src/watch.rs, C:/dev/wt/wgss-head-f0e89280/kernel/tests/injected_watch/mod.rs, C:/dev/wt/wgss-head-f0e89280/kernel/tests/source_watch_ordering.rs, C:/dev/wt/wgss-head-f0e89280/kernel/README.md
