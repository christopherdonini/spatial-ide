# Consult — the architect's draft for kernel-ticket-liveness-redeem-wording (2026-09-30)

*Custodian's filing note: the architect agent's final report, delivered as a hand-back message on 2026-09-30, on the custodian's brief (a drafting consult, not a gate), read at main ce2a59b. Recorded verbatim below the rule, from the message, with the harness's report indentation removed, except for one elision marked in parentheses at the end: the DRAFT section, committed as `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` with the one edit its header lists. The custodian's checks before commit, at ce2a59b: `create_from_ticket` reads `ticket_liveness` and then calls `redeem`, with no lock held across the two; `redeem`'s cancelled wording is at its `CancelledBeforeRedeem` arm; `SessionInvalidator::end_generation` records the end before it cancels; ADR-035 Decision 2's redemption sub-bullet reads as item 1 says; the draft named in the Notes is tracked.*

---

**Verdict: draft ready. Pass with notes. No ruling needed** (reading R below, which the gate confirms). Reviewed main @ ce2a59b.

## 1. The defect, from the code (main @ ce2a59b)

- **The two locks.** `EngineSourceFactory::create_from_ticket` (`kernel/src/lib.rs:402-458`) first calls `GenerationRegistry::ticket_liveness` (`:421`), which takes `GenerationRegistry.inner` (`kernel/src/skp.rs:623-641`). On `Live | Unknown` it then calls `StreamRegistry::redeem` (`lib.rs:454-456`), which takes `StreamRegistry.tickets` (`skp.rs:241-281`). Nothing holds the first lock across the second call.
- **What an end does.** Every product end goes through `SessionInvalidator::end_generation` (`skp.rs:849-859`), in this order:
  1. `invalidate` writes the handle into `dead_tickets` and releases the generations guard (`skp.rs:731-761`, the write at `:752-755`);
  2. `cancel` moves each `Pending` ticket to `CancelledBeforeRedeem` (`skp.rs:293-301`).
- **The window (W1).** The liveness read returns `Live`, then a whole `end_generation` runs, then `redeem` runs. `redeem` hits its `CancelledBeforeRedeem` arm (`skp.rs:252-254`) and returns the "cancelled before it was redeemed" wording.
- **What the client gets today.** The data plane forwards that string as a `TERM_PRODUCER_FAILED` detail (`protocol/data-plane/src/server.rs:479-490`). It has no `engine.` prefix, so the shell's `isSessionEndedTerminal` (`frontends/shell/src/streaming/liveTicketSet.ts:58-63`) does not match it. The baseline manager treats it as an ordinary terminal (`viewportStreamManager.ts:334-340`), and the session end reaches the shell only through the best-effort event (ADR-035 Decision 3).
- **Why it is a defect.** This answer matches neither sequential order:
  - START wholly before the end: redeemed, then cancelled.
  - START wholly after the end: the dead-ticket arm's `engine.source_changed` (`lib.rs:422-442`), or `engine.source_coverage_lost` (`:447-453`).
  - Yet the `dead_tickets` record that proves the end exists before `redeem` refuses.
- **Which clause it falls short of** (paraphrase): ADR-035 Decision 2, second sub-bullet (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:30`). Redeeming a ticket from the ended generation is refused by name, coded by reason, while the dead-ticket record holds (also `:28`). The `dead_tickets` field doc states the same intent (`skp.rs:432-434`).
- **Sibling standard.** The close-races form's §1 (iii) and §2d hold a racing call to one of the two sequential answers. That form's §0 item 5 (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:69-74`) puts this window out of its scope and records that on a close the cancelled wording is the true answer. The fix must keep that.
- **SKP-V0.** It defines `engine.source_changed` and `engine.source_coverage_lost` (`protocol/skp/SKP-V0.md:687`, `:849-851`) and says nothing about this interleaving. It is not the clause.
- **The other window (W2).** The liveness read returns `Live`, then `invalidate` runs, then `redeem` succeeds, then `end_generation`'s cancel reaches the now-`Redeemed` stream. That equals the "START before the end" order, so it is linearizable and not a defect. It is declared unchanged.

## 2. User-visible or wire?

- **Wire: no change.** No new code, string, field, frame or literal. The racing START gets a detail string `create_from_ticket` already emits today for a START that arrives after the end, and the shell already matches it.
- **User-visible.** Which existing session-ended text the operator sees in the race changes. That is an existing state. It is not a new one (`AI_DEVELOPMENT.md:458-461`).
- **Reading R.** The refusal is decided after the end is recorded, while the dead-ticket record holds, so Decision 2 (accepted, round 21 item 1) already requires the by-name answer. The fix only makes the code meet that contract.
- **If the gate reads Decision 2's "later call" strictly** (only a call begun after the end), then this is a user-visible change not yet ruled. The human would rule one thing: whether a START whose redemption is refused after a recorded end must answer by that end's code. That is invalidator I6.

## 3. Sibling search (both locks, check-then-act)

- `SkpHost::viewport_query`:
  - live check (`skp.rs:1311`) → mint (`:1363`) → attribute (`:1377`);
  - an end landing between them fails attribution, and `viewport_query_attribute` already re-reads `ended_reason` (`:1377-1399`) to refuse by reason;
  - this is the **precedent for this fix**, and it is already correct.
- `end_generation`: act-then-act (record, then cancel). Only W2, which is linearizable.
- `describe` (`:1239`): read-only. `SkpHost::cancel` and `close_dataset`: one lock per step. Close is already covered by close-races §2d.
- **No other defect found.** The re-read keeps A2's acyclic lock graph (`state/cloud/wave1/A2.md:78`): no lock is held across another.

## 4. Fix shape

- **Change.** When `redeem` refuses, re-read `ticket_liveness`. If it now returns `EndedBy*`, return that existing refusal. Otherwise return `redeem`'s own refusal unchanged.
- **Why it works.** `end_generation` writes `dead_tickets` before it cancels, so a refusal caused by an end always finds the record.
- **Cost.**
  - One extra acquisition of the `GenerationRegistry` mutex, plus its `prune_locked` pass, on the refusal path only.
  - Nothing on the success path, nothing on batches, no new dependency. No timing claim.
- **Needed for the deterministic test.** `create_from_ticket` is split into two private steps, like `viewport_query`'s split (`skp.rs:1244-1247`).
- **Rejected alternatives.**
  - Hold both locks: nests the two locks, and a swept `EngineSource` drop re-enters `end_generation` (entry 132).
  - Redeem first, then check: would admit a ticket in the window after the end but before the cancel, which today is refused by name.
  - Store the end reason in `CancelledBeforeRedeem`: couples `StreamRegistry` to the session-end vocabulary and is a larger diff.
- **What it cannot claim.**
  - W2 is unchanged.
  - Once the dead-ticket record ends (by age, or `forget_dataset`), the answer is still `redeem`'s wording. That is Decision 2's stated degradation.
  - Nothing about the shell's display or the order of terminal and event.
  - The interleaving is driven on one thread through the product's own steps. There is no real-concurrency proof.

## 5. Reproduction and gating

- **Reproduction.** Commit B (the behaviour-preserving split plus tests) makes R1 and R3 fail with `redeem`'s wording. Commit C (the re-read) makes them pass. There is no step at base to interpose on, so "fails today" is shown at B.
- **Full form, full gating** (`AUTONOMY.md` §21a, the fourth category; §25(e)):
  - It changes how code meets a stated guarantee (ADR-035 D2's by-name refusal), and a property under test (`kernel/tests/session_generation.rs:339`, T1).
  - An honest `Out-of-scope` line could not assert "guarantee untouched".
  - A five-line form here would be the round-25 dispatch failure by name.
- **Portability.** Not OS-dependent (R3 not engaged): std mutexes, `no_watch_arm`, and `set_modified` at +120 s. L1 on all three platforms.

## Notes

- The PLAN summary (`PLAN.yaml:2829`) credits the close-races form's §0 item 5 with naming the fix shape. The committed form does not. The shape is in `state/drafts/kernel-generation-close-races-prereg.draft.md:383`. The draft below takes it as its own; correct the summary at the in-progress commit.
- Three stale line cites in the block the piece edits:
  - `lib.rs:424`: `skp.rs:1136`, now `:1846`;
  - `lib.rs:426`: `server.rs:388-401`, now about `:477-490`;
  - `skp.rs:620-621`: `lib.rs:390`, `:321-336`, `server.rs:384`.
  These are class-3 fixes inside Scope, replaced by symbol references.
- No hashes were computed (no Bash). The draft carries no line cites, so it needs none.

---

(The report's DRAFT section followed here. It is not repeated: the committed form, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, is that draft with the edit its header lists.)
