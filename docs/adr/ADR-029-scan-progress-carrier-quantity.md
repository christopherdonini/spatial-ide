# ADR-029 — The Scan-Progress Carrier Quantity

**Status:** Proposed — **decision deliberately undrafted; binds nothing.** Filed 2026-09-02 as the
named home for the true-scan-progress debt (SKP-V0.md §4 item 5), so the gap has an address
instead of rolling to "the next SKP version that opens the wire" a third time (the ADR-023
pattern, the ADR-011-gate-8 pattern applied to a protocol quantity). Not architect-blockable. No
implementation exists or is licensed by this filing.
**Drafted by:** the custodian, per `DECISIONS-PENDING.md`'s resolved entry 9 — the human's
2026-09-02 confirmation of `SKP-V0.md`'s second explicit re-deferral of this debt, which named
this filing as the stronger carrier that makes the re-deferral bearable.
**Related:** ADR-021 (the acceptance condition this debt descends from: the filter-panel cut must
present liveness + a working cancel during zero-batch filtered scans as the interim, with true
scan-progress the named SKP-V0 §4.5 debt); ADR-018 (what "cancellation acknowledged" means — the
same discipline of naming a quantity precisely before scoring it, applied here to a different
quantity); `SKP-V0.md` §4 item 5 (the debt's own dated history: parked 2026-08-14 on "the next SKP
version that opens the wire for any reason"; `skp/0.2` was that version, confirmed 2026-09-02 as
the second explicit re-deferral, this ADR being the condition that made it acceptable); ADR-004
(bit-critical wire scalars — a future carrier, whatever shape it takes, is wire-visible and inherits
that discipline).

## Context

The filter-panel cut shipped an interim for zero-batch filtered scans: indeterminate liveness (a
scan-liveness indicator) plus a working, client-derived Cancel — never a true progress figure,
because none exists on the wire. `TAG_PROGRESS` (the data-plane frame that could carry one) fires
only after a batch, so a scan that produces zero batches yet — the exact case the interim covers —
has nothing to report progress *from*. That gap was named a debt at ADR-021's own acceptance
(2026-08-13) and parked with a deadline: "the next SKP version that opens the wire for any reason
— a `skp/0.2`, or `docs/07`'s 1.0 freeze, whichever comes first." The admission-remediation cut's
`skp/0.2` was that version (it opens the wire for two `open_dataset` fields, unrelated to scanning),
so the debt's own carrier clause fired again — and was re-deferred a second time, 2026-08-14 to
2026-09-02, on the same three reasons as before (no batch-independent data-plane carrier exists;
the quantity itself is undecided; the interim already ships) plus this filing as the condition that
makes a third rollover impossible: the question now has an address, here, rather than a clause
buried in a spec file that the next SKP version has to remember to re-read.

## Decision

> OPEN: what the scan-progress quantity actually **is** — rows scanned, bytes read, row groups
> completed, elapsed-since-first-source-row, or something else entirely — is undecided and is an
> ADR-class question, not an implementation detail (a wrong choice here is wire-visible and
> version-locked, the same reason ADR-018 named its own three instants precisely before scoring
> anything against them). Also open: whether the carrier is a new `TAG_PROGRESS`-adjacent
> data-plane frame independent of batch delivery, a control-plane poll, or something else; its own
> refusal/error shape if the source can't report it (e.g. a scan DuckDB can't size in advance);
> and whether it is universally available or only for admitted-but-unscored quantities (matching
> this project's own docs/08 "reported, never gated" discipline until it earns a budget row). A
> future SKP version string is implied.

## Consequences (of the deferral, not of a decision)

Until this is decided: a zero-batch filtered scan continues to show indeterminate liveness only,
never a percentage or a count — the ADR-021 interim stays the shipped behavior, not a placeholder
silently upgraded. No SKP version may re-defer this debt to "the next version that opens the wire"
again without amending this ADR first — that escape hatch is spent; this filing is the debt's
permanent address now. **Due before `docs/07`'s Prototype exit** (the deadline the human's
2026-09-02 confirmation carried), per the same accepted-with-a-deadline discipline ADR-027 already
applies to principle 4's own style/publish gaps.
