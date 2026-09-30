# Preregistration: a generation end between `ticket_liveness` and `redeem` (`kernel-ticket-liveness-redeem-wording`)

## Header
- **Authority.** PLAN node `kernel-ticket-liveness-redeem-wording`, generation 1, placed by round 31, item 1. The record is wave-1 A2, unproven observation 2, recorded S2 under the wave-1 severity rule (RULED 2026-09-25, the cloud hooks). The governing clause is ADR-035 Decision 2, the redemption sub-bullet (accepted, round 21 item 1). Nothing is amended: no ADR, not SKP-V0, not KNOWN-LIMITATIONS.
- **Drafted by** the architect agent on the custodian's brief, reading main at `ce2a59b` (the consult: `state/consults/2026-09-30-ticket-liveness-redeem-architect-draft.md`). References are by path, symbol and section; none carries a line. The worker re-derives at the branch's base, which is main after PR #146 merges.
- **Committed before any code,** on main, as node 1's form was. **Append-only**; an amendment made after any outcome has been seen says so in its first line.
- **Custodian's edit to the draft, before commit:** the committed-before-code line names main rather than the branch's first commit, following node 1's precedent. Nothing else changed.

## §0. Disclosure
1. **Read:**
   - `kernel/src/lib.rs`: `create_from_ticket`;
   - `kernel/src/skp.rs`: `StreamRegistry::{redeem, cancel}`, `GenerationRegistry::{ticket_liveness, invalidate, prune_locked}`, `SessionInvalidator::end_generation`, `SkpHost::{viewport_query_attribute, close_dataset}`, and the module `ticket_drop_under_lock_regression`;
   - `protocol/data-plane/src/server.rs`: START's `factory.create` arm;
   - `frontends/shell/src/streaming/liveTicketSet.ts`: `isSessionEndedTerminal`;
   - ADR-035; the close-races form's §0 item 5, §1 and §2d.
2. **Evidence, not Authority:** `state/cloud/wave1/A2.md` (observation 2 and its custodian field; not reproduced by A2). The fix shape comes from `state/drafts/kernel-generation-close-races-prereg.draft.md`, "For the custodian", and is adopted here as this form's own.
3. **Reading R.** A START whose `redeem` refusal is decided after an end is recorded, while the dead-ticket record holds, falls under ADR-035 Decision 2's by-name refusal. The gate confirms R, or I6 applies.
4. **Fixture-drive confound: none.** Nothing is measured.

## §1. May and may not claim
- **May claim:**
  - (i) A START whose `redeem` refuses while its handle's dead-ticket record holds answers that record's code, `engine.source_changed` or `engine.source_coverage_lost`, with the dead-ticket arm's existing detail.
  - (ii) A refusal with no record (a close, a client cancel, an unknown handle) keeps `redeem`'s own wording.
  - (iii) Every refusal equals what `create_from_ticket` run whole at its final read would answer.
- **May not claim:**
  - any duration, cost or `docs/08` row (ADR-018);
  - anything about W2 (the liveness read returns `Live`, then `invalidate`, then a successful `redeem`, then the cancel), which is unchanged and linearizable;
  - the shell's display, or the order of terminal and event (ADR-035 Consequences);
  - real-thread concurrency. The window is driven by a step split on one thread.
- **Wire change: none.** No code, member, literal or string. No diff under `protocol/`, `engine/` or `frontends/`. **Operation classes: unchanged** (ADR-006). **Seam:** no new one. The refusal is an existing one that the shell already matches, and T1 is its end-to-end test.

## §2. The change
- **2a.** `create_from_ticket` becomes three steps, composed in order and by nothing else: parse, then `liveness_refusal(generations, handle) -> Option<String>` (today's two `EndedBy*` arms, unchanged), then `redeem_or_liveness_refusal(tickets, generations, handle)`. Both steps are private, and their only product caller is `create_from_ticket`.
- **2b.** `redeem_or_liveness_refusal` calls `tickets.redeem(handle)`. On `Err(r)` it returns `liveness_refusal(generations, handle)`, or `r` when that is `None`. On `Ok` it returns the pair untouched. No lock is held across either call.
- **2c.** The doc on `create_from_ticket` says why the re-read is sound: `end_generation` records before it cancels. It also says `Live` and `Unknown` never become a diagnosis. Line cites in that doc block, and in `ticket_liveness`'s product-caller paragraph, are replaced by symbol references (class 3).
- **2d. Out of scope:** `StreamRegistry`, `GenerationRegistry`, `SessionInvalidator`, `TicketState`, `viewport_query`; W2; the shell.

## §3. Scenarios, outcomes declared in advance
All scenarios: a real `open_dataset` (`no_watch_arm`) and a real `viewport_query` ticket; step 1 returns `None`; then:

| # | Then | Step 2 at B (split only) | Step 2 after C |
|---|---|---|---|
| S1 | the file's mtime is moved, and a second `viewport_query` refuses at the pre-check (the product end) | `redeem`'s cancelled wording | `engine.source_changed: ` prefix |
| S2 | `close_dataset` | cancelled wording | same (no by-name code) |
| S3 | `host.invalidator.end_generation(name, CoverageLost)` (the sink's call) | cancelled wording | `engine.source_coverage_lost: ` prefix |
| S4 | `host.cancel(ticket)`; the generation stays live | cancelled wording | same |

## §4. Tests (in-crate, `ticket_drop_under_lock_regression`; no sleeps, threads or timeouts)
Mutation observation, per round 25, item 2 (c): each registered mutation is applied, the test run, the failure recorded by name with its commit, and the mutation reverted. `verify-mutation` is a floor.

| Test | Scenario | Asserts | Registered mutation | Test-first |
|---|---|---|---|---|
| R1 `an_end_between_liveness_and_redeem_refuses_by_its_code` | S1 | the ticket is `CancelledBeforeRedeem` before step 2 (guards against a vacuous pass); step 2's detail has the source-changed prefix | delete 2b's re-read (return `r`) | yes, fails at B |
| R2 `a_close_between_liveness_and_redeem_keeps_redeems_wording` | S2 | the cancelled wording; no `engine.` prefix | make 2b's fallback return the source-changed refusal for every `r` | no |
| R3 `a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code` | S3 | the coverage-lost prefix; never source-changed | in `liveness_refusal`, map `EndedByCoverageLoss` to the source-changed refusal | yes, fails at B |
| R4 `a_client_cancel_between_liveness_and_redeem_keeps_redeems_wording` | S4 | as R2 | R2's mutation | no |

Unchanged and passing: T1 and T2 (`kernel/tests/session_generation.rs`), and every other kernel test.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - **P1.** R1 and R3 fail at B, on their prefix assertions.
  - **P2.** At C, everything passes. The only tests that change between B and C are R1 and R3.
  - **P3.** No string literal is added or changed. The string diff is comments only.
- **Declared unchanged:**
  - `protocol/**`, `engine/**`, `frontends/**`;
  - `StreamRegistry`, `GenerationRegistry`, `SessionInvalidator`;
  - the success path;
  - T1 and T2's assertions;
  - ADR-035, SKP-V0.
- **Invalidators** (stop and return):
  - **I1.** R1 passes at B.
  - **I2.** The fix needs a new string, code or field, or a diff outside `kernel/src`.
  - **I3.** The fix needs two locks held at once, or a drop under a lock.
  - **I4.** An existing test fails at C.
  - **I5.** #146 changed a symbol named here.
  - **I6.** The gate rejects reading R. That goes to the human.
- **Falsification.** After C, either:
  - a refusal decided while the handle's dead-ticket record holds answers other than that record's code; or
  - a handle with no record answers `engine.source_changed` or `engine.source_coverage_lost`.

## §6. Instruments
All are assertions: the typed prefixes and the registry state in §4, read in-crate. The test-first run is at B and the mutation runs are each at a named commit. `verify-cites`, `verify-quotes`, `verify-mutation` and `verify-test-claims` are each named with the tool's commit (round 15 (c)).

## §7. Declared values
- **No new constant.**
- **Budget:** ≤ 300 changed lines, ≤ 2 files. Counted with `git diff --numstat <merge-base>...<head> -- kernel/src`, summing the first two columns. The closing amendment names the merge base. Estimate: about 40 product lines, 15 comment lines, 200 test lines.
- An overrun is class 8, and this line is never edited to match.

## §8. Block-on-sight
1. Any new `pub` item. The step functions are not private, or have a caller other than `create_from_ticket`.
2. Any test-only hook, `cfg(test)` branch in product code, callback or option.
3. Two registry locks nested, or a lock held across `redeem`, the re-read, or a drop.
4. Any change to `StreamRegistry`, `GenerationRegistry`, `SessionInvalidator`, `end_generation`'s order, or `TicketState`.
5. Any new code, message text, member or literal; any detail string changed; any diff outside `kernel/src`.
6. `Live` or `Unknown` mapped to a by-name refusal (docs/01 principle 8; round 4).
7. A coverage loss answered as `engine.source_changed`.
8. A sleep, thread or timeout in R1–R4; T1 or T2's assertions edited.
9. A §7 overrun not recorded as class 8, or §7 edited. Any code of a scope addition before its class-9 amendment.
10. A record calling a `verify-mutation` run an observation, or an observation without its commit.
11. Record-form failures:
    - a line cite into `DECISIONS-PENDING.md`;
    - a verbatim passage not byte-copied and marked;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash, or named without its commit id;
    - a bare self-line.

## §9. Gates
- **Architect:** ADR-035 D2 (reading R), ADR-019, ADR-006, docs/01 principle 8; §8 item by item.
- **Reviewer:** the full diff.
- **Suites:** the whole kernel suite, clippy, `fmt --check`, the `node --test` scripts suite, `verify:plan`.
- **Operator:** none. The window has no operator interposition point, and no new state is introduced.
- **Portability:** not OS-dependent (R3 not engaged); L1 on all three.

## §10. Amendments (opens empty, append-only)
