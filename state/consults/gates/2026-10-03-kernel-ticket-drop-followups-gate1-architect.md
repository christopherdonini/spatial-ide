*Custodian's filing note (2026-10-03): the gate-1 architect for PR #168 (node 9) returned this report as its final message; the architect agent type has no Write tool. The custodian saved the hand-back text, with the harness's indentation removed, and committed it as saved, below the rule. The hash of record, from this file's line 5 (the report's first line) to the end, is d7dcd8581df5914ee081dce6a48c4794d4a0d70b368fbe6a657850192abec688, computed by the custodian; the agent returned "sha256: not computed". Write audit PASS: zero write calls and no shell call (Read 20, Grep 17). C3: both worktrees were clean before and after; in the main checkout the only differences were the custodian's own commit 09992021, made during the run.*

---

VERDICT: PASS (with notes) · cut/kernel-ticket-drop-followups @ 86774b06
Reviewed cut/kernel-ticket-drop-followups @ 86774b06. PR #168, gate 1, architect.

All cites below are read at 86774b06 unless another commit is named. The head was confirmed from `.git/refs/heads/cut/kernel-ticket-drop-followups` (86774b0647b93f7ecf35de4b23a895f546f522d8). The base was read from the main checkout's `kernel/src/skp.rs`, which is unchanged since 4c50677c.

**S1 (blocking): none.**

**Judgments**

1. **docs/01 principle 7 and derived rule 1: pass.**
   - The form claims one thing: the invariant holds on the return path, and on an unwind that starts in `SourceCancel::cancel` or `StreamHandle::mint`. It makes no never-block, performance or macOS/Linux claim (§1 "May not claim").
   - Reading the code supports exactly that claim. `swept`, `retired` and `prev` are declared before the guard, so on an unwind the guard drops first.
   - The poisoned lock left by the unwind is recovered by `unwrap_or_else(|e| e.into_inner())`. That holds at all five product lock sites, and at no other product site, so the re-entrant `cancel` from `end_generation` proceeds and does not block.
   - Nothing beyond that scope is claimed.

2. **ADR-018 Decision 1: pass.**
   - `cancel_requested` is defined as the instant the cancellation call returns to its caller (ADR-018, the Decision 1 table row).
   - In `cancel` and `cancel_all_for_dataset` the return-path order is unchanged: `drop(tickets)`, `drop(swept)`, `drop(retired)`, then return. Swept and retired sources still drop before the return, so the instant does not move.
   - On an unwind the call never returns, and the form claims no instant there.

3. **ADR-019: pass.** §1 names it as Proposed, binding nothing, and as the mechanism only. The diff adds no ADR-019 citation. The ADR-019 mentions near the `TicketState` and `Redeemed` arms are pre-existing and descriptive.

4. **Caller rule: pass.**
   - `EmptySource`, `PanickingCancel`, `UnwindSetup` and the function-local `MAX_REKEY_ATTEMPTS` are private items inside `#[cfg(test)] mod ticket_drop_under_lock_regression`.
   - Head and base have the same counts of top-level `pub` items (48 each), `cfg(test)`/`cfg(debug_assertions)` (12 each) and `#[allow`/`#[expect` (1 each).
   - Product code gains locals, two `debug_assert!`s and comments, and nothing else.
   - Seam: the stubs implement the real `spatial_data_plane::transport` traits, and they compile against them. The tests drive the real `mint`, `redeem`, `cancel`, `cancel_all_for_dataset`, `GenerationRegistry`, `SessionInvalidator` and `wrap_for_data_plane`.

5. **§8, item by item:**
   1. Pass. The return-path order is unchanged in all five methods. `prev` drops at the end of scope, after `drop(swept)`. `mint`'s parameters still drop after every local.
   2. Pass, read in all five methods:
      - `sweep_expired`: `swept` at 226, before the lock at 227.
      - `mint`: `swept` and `prev` at 242-243, before 244.
      - `redeem`: `swept` and `prev` at 278-279, before 280.
      - `cancel`: `swept` and `retired` at 321-322, before 323.
      - `cancel_all_for_dataset`: `swept` and `retired` at 368-369, before 370.
   3. Pass.
      - `debug_assert!(prev.is_none(), ..)` comes right after `drop(tickets)`: lines 266-267 in `mint` and 313-314 in `redeem`.
      - Under the guard, `prev = tickets.insert(..)` and `retired = Some(..)` drop only the previous `None`. Neither drops a `TicketState`.
      - A firing assert in `redeem` drops `result`'s `EngineSource` during the unwind, after the guard has been released.
   4. Pass (Judgment 4).
   5. Pass, on the commit list in worker report 1 and lead-data's reflog check. The branch diff is `kernel/src/skp.rs`, plus three lines of `kernel/README.md` (350, 353, 373), all inside `## Owner's index` (346-383). Public signatures read identical. The reviewer's full diff is the proof of file scope.
   6. Pass.
      - Each of T1 to T3 asserts four things through `call_unwinds_and_drops_p`: the call returned in time, it unwound (`expect_err`), the panic message names the test, and P is `EndedBySourceChange`.
      - T3 also asserts `CancelledBeforeRedeem`. A failed precondition fails by name at `put_p_before_q`'s assert.
   7. Pass, on the same evidence as item 5.
   8. Pass by reading: no new `allow`. Clippy is the reviewer's to re-run. The worker reports the baseline unchanged.
   9. Pass.
      - The doc comment's words match §2.1. The bold first sentence names `SourceCancel::cancel` and `StreamHandle::mint`.
      - "Not covered" carries the four std-call sites as examples of a scope stated by where the panic starts, and claims none of them.
      - A blank `///` line was added (see N1). That is within "words unchanged".
   10. Pass.
       - M1 to M3 are recorded as "Observed at commit 1c8cea2207e2 (applied, run, reverted)".
       - The backticked failure fragment ": StreamRegistry::cancel did not return within 5s" is a byte substring of the panic format with `HANG_TIMEOUT` = 5 s, as Debug prints it.
       - No record names a `verify-mutation` run as the observation.
   11. Pass. See Judgment 6.

6. **C2 and C1: pass.**
   - Still not crossing at head:
     - The only product `impl SourceCancel` is `EngineCancel` (`kernel/src/lib.rs`). The others are in `protocol/data-plane/tests/` or in kernel `cfg(test)` code.
     - `frontends/shell/src-tauri` calls only `StreamRegistry::new()`.
     - No SKP literal, refusal code, `CancelOutcome` mapping, describe field, bundle or wire semantics changes.
   - The index update matches the diff and is complete:
     - The Stream tickets bullet gains T1 and T3, both of which exist.
     - The new form is appended to the preregistration list.
     - `Last verified at: 4d487d51` is accurate, because 86774b06 changes only the README.
     - Nothing else the diff adds needs a pointer: there is no `pub` item, constant, ADR or limitation.
     - Leaving out T2 is acceptable (N4).

7. **The pilot (C4).** All three conditions from my pre-commit consult reached the committed form:
   - the headline qualifier;
   - "those of … it uses" plus the four sites;
   - §1's statement that the only shipped `SourceCancel` is kernel-internal and does not panic.

   Draft-caused items I should have caught at drafting:
   - **(i) N1, draft-caused, absorbed without a correction round.** §2.1's text ran the paragraph straight on from the last bullet.
   - **(ii) S2-1, draft-caused.** §5's reasoning about the README body.
   - **(iii) S2-2, draft-caused.** §4 says O1 is "recorded with its commit" but names no place to record it.
   - **(iv) N2, draft-caused, cosmetic.** A pin written in words form.

   Implementation defects: none. Changed scope: none. Corrections that block: none. No correction round is caused.

8. **Other constitution checks: none block.**
   - ADR-006: the operation class is unchanged.
   - docs/08: no figure is claimed.
   - docs/02 and docs/10: kernel only, and no protocol change.
   - docs/07: the piece is placed by round 31, item 1.
   - No verbatim passage is in the diff, and no discharge clause.
   - The two `debug_assert` messages are about the kernel's own state.

**S2 (should-fix, non-blocking)**

- **S2-1 (draft-caused). §5 says the `kernel/README.md` body sentence at lines 177-179 "stays true as written". That is not accurate.**
  - The sentence is unqualified. The field doc now lists unwinds out of std calls, under "Not covered", that drop `TicketState`s under the lock: `sweep_locked`'s partly built `Vec`, the `push` argument, and the `insert` argument.
  - The diff does not create the gap: the base text was equally unqualified.
  - §8 item 5 forbids editing the body in this PR. Route it to `module-docs-stale-statements` (lead-data index §7). The closing record should reference that node, not repeat §5's reasoning.
- **S2-2 (draft-caused, closing record).**
  - The closing record references P1 at 2813aead, M1 to M3 and O1 at 1c8cea2207e2, and the suites at 4d487d51. All of these are in worker report 1, which is the only record of O1.
  - The PR body asks for a merge that keeps 1c8cea2207e2 and 4d487d51 reachable from main, never a squash. Both are named in tracked text: the test doc comments and the index's `Last verified at`.

**N (notes)**

- **N1.** Applied verbatim, §2.1's text would very likely trip clippy's `doc_lazy_continuation` (a style lint, warn by default), which conflicts with §8 item 8. The worker's blank `///` line avoided it, but the worker did not test this. The reviewer may confirm.
- **N2.** §0's `Cargo.toml` pin is written in words form ("lines 49-57 at c9f41126, sha256 …"), not as `path:line @ rev sha256:`. c9f41126 is on main, so the token form was available. The reviewer recomputes it as part of "every pin".
- **N3.** §7 has 4 lines of headroom (316 of 320). Any correction to `skp.rs` that overruns it is class 8. §7 is never edited.
- **N4.** Leaving out T2 from the index is acceptable: pointers are representative.
- **N5.** I agree with lead-data index §3. The Close-ordering pointer to `cancel_of_a_pending_ticket_…` was already misfiled, is not moved by this diff, and is routed.
- **N6.** The module doc (around line 2999) still describes `sweep_locked`'s `retain`. It is past-tense history and outside §2.5's scope.

sha256: not computed
