> **Status: draft — the AI_DEVELOPMENT review-loop amendment of 2026-09-09; superseded by the amendment as ported into `AI_DEVELOPMENT.md`.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# DRAFT 1 — AI_DEVELOPMENT.md amendment: bounded closing attempt and delegation matrix

*Fable, 2026-09-09. For the human's review; ported to the repo by the custodian on approval as an
appended, dated amendment to AI_DEVELOPMENT.md's Custodian section. Docs-only. Narrow by design:
it does not touch the red lines, and it does not introduce current-contract summaries (those need
reviewed clause references and explicit precedence — a separate proposal).*

## Context (facts on the record)

Entries 61, 64, 65 and 67 each reached rule 7 on residue that both gates had already classed as
mechanical — stale line cites, a test the record claimed but the tree lacked, a discriminant pin,
a false clause, a bold heading — after the design had been affirmed. The human ruled "(a): one
closing commit, custodian-verified, no further gate" four times. The queue also received
formatting and citation items that no ruling could change. Meanwhile the loop caught, in the same
fortnight, an author-spoof hole in the DCO gate, a message pump inside `setup()`, and an accepted
ADR whose behaviour never reached the artifact. The loop is right; its routing is not.

## Amendment text (proposed)

### §A — Rule 7 becomes a bounded closing attempt

1. After two failed gate attempts on one piece, the custodian writes a **root-cause note**
   (≤10 lines: what failed each time, and its class — *semantic* or *mechanical*).
2. The custodian may then make **one bounded closing commit without human authorization** if
   and only if ALL of: (i) every gate that applies to the piece (reviewer; architect where the
   piece is architect-blockable) has affirmed the *design*; (ii) every remaining item is
   record-only or mechanically verifiable — cites, line numbers, tense, a claimed-but-missing
   test, wording that follows a ruled standard, formatting; (iii) no item touches behaviour,
   a guarantee, authority, scope, or a property under test.
3. The closing commit is **self-verified mechanically** and the verification is recorded in the
   ledger: every cite re-grepped; every new or changed test run AND mutated; every check line;
   CI green. The PR body and ledger say "closed under §A" with the root-cause note.
4. If anything **newly discovered** during the closing attempt is semantic — a behaviour change,
   a new defect in a property the batch fixed, a guarantee or authority question — the closing
   route is not available: stop and queue. One closing attempt only; a failed closing attempt
   escalates.

### §B — Delegation matrix

**Always the human (red lines, unchanged):** ADR statuses and amendments; preregistered gate
pass/fail rulings; walkthrough evidence and felt verdicts; new exposure surfaces and public
exposure; dependency changes; history rewrites; security posture; docs/08 normative rows; scope
changes to a ruled item; any change to user-visible behaviour not already ruled.

**Delegated to gates + custodian (reported, never queued):**
- Mechanical closure under §A.
- **Wording that follows the ruled standard** — a string asserts only what the system did or
  verified; absent is stated, never omitted; no wire-level claims in UI text; no durations
  (ADR-018); no perf words. The human sights strings only when a **new state** is introduced,
  never for new wording of an existing state.
- Formatting, citation, line-number and tense nits: fixed in sweeps, never queued.
- Test re-aims that encode an already-ruled contract: reported with the ruling cited.
- CI, watcher, hygiene and tooling mechanics (eol pins, hooks, watchers).

**Escalate to the human when:** authority is missing; a product decision is needed; a guarantee
changes; user-visible behaviour changes; or a §A closing attempt fails.

### §C — Reporting

Every custodian report lists delegated closures explicitly: "Closed under delegation: …" with the
matrix row cited. Silence therefore means *delegated and reported*, never *missed*. The
DECISIONS-PENDING queue carries only §B's human items.

### §D — Bounds

Applies only to pieces already under a preregistration or a named gate. Loosens no red line.
Reversible by a one-line human note.
