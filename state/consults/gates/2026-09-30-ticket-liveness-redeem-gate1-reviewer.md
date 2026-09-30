*Custodian's filing note (2026-09-30): the reviewer's gate 1 on PR #147, for PLAN node `kernel-ticket-liveness-redeem-wording` at generation 1, full gating. Reviewed: cut/ticket-liveness-redeem @ 616f20d5940c0d5cd5d2a4d94e9baf380f0ca24e (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 616f20d. Its mutation table (each applied at 616f20d, run and reverted) is the observation of record for §4's three mutations. N1 and N4 go to the gate-1 architect for a scoped confirmation. Profile paths redacted at filing: none.*

---

Reviewed: cut/ticket-liveness-redeem @ 616f20d

**Verdict: PASS, reviewer gate 1, PR #147.** Reviewed `cut/ticket-liveness-redeem @ 616f20d5940c0d5cd5d2a4d94e9baf380f0ca24e` (B = add5ef8, base 6b77287). There are no blocking issues. N1 is worth the architect's attention.

## Checks

**1. Is the re-read correct?** Yes. The composition is at kernel/src/lib.rs:424-427, and the re-read is at kernel/src/lib.rs:493-495. The `map_err` closure only runs after `redeem` has returned, and `redeem` releases its guard and drops its swept entries before that (kernel/src/skp.rs:277-280). `liveness_refusal` takes the `GenerationRegistry` lock only inside `ticket_liveness` (kernel/src/skp.rs:625-643), and it builds the detail string after that lock is released. So no lock is nested, none is held across `redeem` or the re-read, and nothing is dropped under a lock. The only thing dropped is the discarded `refusal` String, after both locks are released. I walked these interleavings:
- **End, then cancel.** `end_generation` calls `record` (`invalidate` writes `dead_tickets`, kernel/src/skp.rs:754-757) before it calls `cancel` (kernel/src/skp.rs:851-861). A refusal caused by that cancel therefore finds the record. This is the fixed case.
- **W2.** Live, then invalidate, then a successful `redeem`: the `Ok` value is returned untouched, so W2 is unchanged (§1).
- **An end recorded, then `close_dataset` before the redeem step.** `forget_dataset` clears the record (kernel/src/skp.rs:777 and kernel/src/skp.rs:1468), so the re-read gives Unknown and `redeem`'s own wording. That matches §1(iii).
- **A client cancel with no end.** No record, so `redeem`'s wording (R4).
- **The record expires, or a reopen happens, between the two reads** (the prune at kernel/src/skp.rs:693; `mint_for_open`'s retain at kernel/src/skp.rs:541). The answer falls back to `redeem`'s wording, which is weaker but never wrong.
- **Live or Unknown at the re-read.** These always return `None`, so no diagnosis is made from them (§8.6 holds).
- A coverage loss keeps its own code.

**2. P1 at B.** I ran it in a scratch worktree at D:/wt-targets/ticket-liveness-redeem/scratch-b, checked out at add5ef8. Result: 2 passed, 2 failed, exit code 101.
- R1 failed at kernel/src/skp.rs:3746, the `engine.source_changed: ` prefix assertion.
- R3 failed at kernel/src/skp.rs:3783, the `engine.source_coverage_lost: ` prefix assertion.
- In both, the detail was the cancelled-before-redeem wording.
- R2 and R4 passed.

The only B→C change is the re-read in product code plus doc comments; the test text is identical at B and C, so P2 holds. I removed the scratch worktree and ran `git worktree prune`.

**3. Mutations.** The table is below. Each mutation was applied, run and reverted at 616f20d, and porcelain was empty after each revert.

**4. Suites at 616f20d.**
- `cargo test -p spatial-kernel`: exit 0; 309 passed, 0 failed, 28 ignored.
- `cargo clippy -p spatial-kernel --tests`: exit 0. `lib.rs` and `skp.rs` have the same three `type_complexity` warnings at base and at head:
  - at base, kernel/src/skp.rs:244, kernel/src/lib.rs:353 and kernel/src/lib.rs:406;
  - at head, the same three items, with `create_from_ticket` now at kernel/src/lib.rs:418.
  - The new function carries `#[allow(clippy::type_complexity)]`. No new warning.
- `rustfmt --edition 2021 --check`, run in-tree, hunk counts: `lib.rs` 16 at 6b77287 and 16 at 616f20d; `skp.rs` 99 and 99.
- Governance scripts, run from C:/dev/spatial-ide with the tools at main 9ec24ab:
  - `node --test` on the scripts/plan and scripts/hooks tests: exit 0, 353 of 353 passed.
  - `verify-cites`: exit 0, PASS.
  - `verify-quotes`: exit 0, PASS.
  - `verify-test-claims`: exit 0, PASS. On main, R1-R4 show as "planned" because the node is in progress. With the tool at 616f20d in the worktree it reports 0 planned, so R1-R4 exist there.
  - `verify.mjs`: exit 0, PASS.

**5. P3 and §7.**
- Every `-U0` line outside `mod ticket_drop_under_lock_regression` that contains a quote is a comment. The two product hunks at lib.rs -437/+459 and -448/+470 change only `Err(` to `Some(`; the detail literal lines are unchanged context.
- `git diff --numstat 6b77287...616f20d -- kernel/src` gives `lib.rs` 60/22 and `skp.rs` 167/4. That is 253 changed lines in 2 files, within ≤300 and ≤2, so there is no overrun.

**6. The caller rule.**
- `redeem_or_liveness_refusal`'s only product caller is `create_from_ticket` (kernel/src/lib.rs:427).
- `liveness_refusal`'s product callers are `create_from_ticket` (kernel/src/lib.rs:424) and `redeem_or_liveness_refusal` (kernel/src/lib.rs:495). The second is required by §2b.
- Both functions are private. The diff adds no `pub`, `cfg(test)`, hook, option or callback.
- R1-R4 contain no sleep, thread or timeout; `Duration` appears only in the existing mtime helper.

**Seam.** There is no new seam. The detail keeps the `"<code>: "` prefix that the shell's `isSessionEndedTerminal` matches (frontends/shell/src/streaming/liveTicketSet.ts:58-63). The corrected comment references (the `factory.create` arm at protocol/data-plane/src/server.rs:475, and `isSessionEndedTerminal`) both resolve.

**7. PR CI** (`gh pr checks 147`, head 616f20d): the sign-off, tauri build and typecheck/vitest/cargo jobs pass. One `cargo test --workspace (windows-latest)` job was still **pending** when I read it; that job had passed on the earlier run.

## Mutation table (observations of record, at 616f20d)

| # | Mutation (as §4 registers it) | Result | Failing assertion |
|---|---|---|---|
| M1 | Delete 2b's re-read: kernel/src/lib.rs:495 becomes `.map_err(\|refusal\| { let _ = generations; refusal })` | R1 and R3 FAIL; R2 and R4 pass | R1 at kernel/src/skp.rs:3748 (`starts_with("engine.source_changed: ")`); R3 at kernel/src/skp.rs:3785 (`starts_with("engine.source_coverage_lost: ")`) |
| M2 | 2b's fallback becomes `unwrap_or_else(\|\| terminal_detail_of(SourceChanged{..}))`, so every refusal with no record answers source-changed | R2 and R4 FAIL; R1 and R3 pass | R2 at kernel/src/skp.rs:3764 and R4 at kernel/src/skp.rs:3814 (`!detail.starts_with("engine.")`) |
| M3 | In `liveness_refusal`, `EndedByCoverageLoss` builds `SourceChanged` (kernel/src/lib.rs:470) | R3 FAILS; the rest pass | R3 at kernel/src/skp.rs:3785 (the coverage-lost prefix) |

## Blocking

None.

## Non-blocking

- **N1. The composition in `create_from_ticket` is covered by no test.** I tried one unregistered mutation (M4, observed at 616f20d): replace kernel/src/lib.rs:427 with a direct `tickets.redeem(handle.as_str())`.
  - R1-R4 still pass (4/4) and `session_generation` still passes (12/12), because R1-R4 call the step functions directly.
  - The only signal is a `dead_code` warning in the non-test lib build: `redeem_or_liveness_refusal is never used`.
  - CI does not deny warnings; the workflows have no `-D warnings`.
  - §8.2 forbids a hook, so the window cannot be driven through a real START. That makes this warning the only tripwire. The architect should accept this explicitly, or the closing record should name the warning as the guard.
- **N2. The form contradicts itself on callers.** §8.1 says the step functions may have no caller other than `create_from_ticket`, but §2b requires `redeem_or_liveness_refusal` to call `liveness_refusal`. The code follows §2b. The architect should read §8.1 as meaning product callers outside the composition.
- **N3. P3's wording.** P3 says no string literal is added. The tests add literals (fixture tags, messages, the `engine.` prefixes); the worker's report flags this at line 42. I agree with reading P3 as the product diff, and so does the brief. The architect should rule on that reading so the record can say which one holds.
- **N4. A reading R case for the architect.** Suppose the client cancels, then an end is recorded (the handle is still attributed, so `invalidate` records it), and then the redeem step refuses. The START then answers the record's code, even though the client's cancel caused the refusal. This matches §1(i) and (iii): a whole run at that moment would give the same answer. It also fits the falsification clause. The case is named here so that I6 is decided knowing about it.
- **N5.** Wait until the pending windows `cargo test --workspace` job has passed before the merge click.

The worktree is clean (porcelain empty) and the scratch worktree is removed. Only C:/dev/wt/ticket-liveness-redeem and main's own worktrees remain in this checkout's worktree list.

Files: C:/dev/wt/ticket-liveness-redeem/kernel/src/lib.rs, C:/dev/wt/ticket-liveness-redeem/kernel/src/skp.rs, C:/dev/wt/ticket-liveness-redeem/kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-09-30-ticket-liveness-redeem-worker-report-1.md
