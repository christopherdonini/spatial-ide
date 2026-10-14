# Two slot-2 pieces from the research review (an engine clause-composition property test, five-line form; a read-only boundary inventory by the architect) and notes for the record on the review — the human, verbatim

*Custodian's filing note (2026-10-14): typed by the human, received at 07:04:48Z by the transcript. Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
Two small pieces from the Anthropic research review and its critique. Neither takes slot 1 or delays milestones 2 and 3: both go in slot 2, after what is already queued there. No new agent, lead, mod or dependency. I approve the invariants below as written; the forms may sharpen them, not widen them. Any product defect either piece finds goes through normal triage; neither piece grows to fix it.

1. Engine test piece — clause composition (five-line form). Tests only: no product code, no fixture change, no dependency.
   Reuse engine/tests/admission_property_campaign.rs: its SplitMix64 generator, its MultiType fixture (whose zone column already holds NULLs) and its G1 grammar. Add properties there or in a sibling file; the form decides.

   Why: milestone 3's E-AND test already shows one simple conjunction end to end. What nothing checks is the exact set of returned ids for generated clause lists, including OR, NOT and NULL.

   The join follows the shell's convention exactly:
   - zero enabled clauses: no filter;
   - one: the text unchanged, byte for byte;
   - two or more: each text in one pair of brackets, joined by " AND ".

   - P5: generate 1 to 4 texts from G1, each admitted alone. G1 is wider than the simple texts the shell joins under OPEN-3 (A), on purpose.
     - Admission: the join is admitted, or refused only with skp.filter_too_long or skp.filter_too_deep.
     - Result: if admitted, its rows are exactly the intersection of the rows each text returns alone.
     - Run conditions: same unchanged fixture, a whole-extent viewport, and a limit above the fixture's row count.
   - P6: if a join is admitted, every order-preserving subset of its clauses, under the convention above, is admitted too. Turning a card off never turns an applied filter into a refusal.
   - Rules for both:
     - Admission assertions and result assertions are separate.
     - Compare ids only from streams that completed; partial rows are not a result.
     - Check for duplicate ids before turning a result into a set.
     - The campaign's declared integer-overflow exclusion applies when any of the n+1 runs (each text alone, or the join) ends in it. That case is counted and reported as excluded, never compared and never a pass.
     - Any other execution failure fails the test.
   - Mutation: the test helper joins without the brackets. It must be observed failing on a witness where precedence changes the returned ids. Keep that witness, minimized, as a fixed regression case. Record the mutation as the campaign does, stating that it mutates the Rust test helper, not the shell's combineClauses; UC3 and E-AND cover that half.
   - Every failure is a candidate until it is reproduced and minimized. Report: seeds, case counts, excluded counts, time spent, the candidates and how many were real.

2. Boundary inventory (architect, read-only, one page, descriptive only).
   One table: boundary | enforced by code or the OS (path:line @ commit) | supporting tests | instructed only | not built. A documented requirement is not enforcement.
   - Rows:
     - file admission;
     - publishing (exposure scan and audit);
     - the data plane and its origin admission (ADR-020);
     - control-plane tickets (ADR-019);
     - credentials and tokens;
     - the agents' filesystem limits (hooks against instructions);
     - piece 1c's project-relative resolver.
   - For the resolver row, the question is whether the authorisation stays attached to the object actually read, or only to a pathname checked earlier. Follow it through to the engine's own reopen by path, not only the resolver's first check. Start from the reuse index: node tools/reuse.mjs ADR-036, rows path-containment, engine-open-identity and reserved-filename-checks.
   - The table is an input to piece 1c's form; ADR-036 line 81 already owes "how the target that is checked is the target that is opened". It changes nothing by itself.

3. For the record, if anything cites the review:
   - Its five-phase programme, agent org chart, context-package YAML and agent-evaluation platform are not adopted.
   - Its claim that only I merge is wrong: AUTONOMY §9's docs-only auto-merge stands.
   - Its "October 9 property-map" incident is unverified. Do not cite it.
   - The property-testing article's figures come from 50 manually reviewed reports: 56% valid, 32% valid and worth reporting. They are not a general rate. That is why every generated failure is a candidate first.
   - CRS property tests wait for the transformation service. Its form takes its invariants from state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md, not from a bare A to B to A round trip.
