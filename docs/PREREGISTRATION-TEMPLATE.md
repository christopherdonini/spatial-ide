# Preregistration template

*A reusable skeleton for a preregistered piece. It pre-declares the discipline every campaign has
converged on and the **amendment classes** the last two campaigns actually used
(`frontends/shell/POLISH-87-88-89-PREREGISTRATION.md`, `engine/ADMISSION-PREREGISTRATION.md`), so a
worker who needs one of those classes has a named, pre-authorised shape to record it in rather than
inventing one after results are in. Copy the relevant form, fill the placeholders, delete the
guidance italics. Authorised by the human's third directive (`AUTONOMY.md` Appendix A3, the
speed-work part: "A preregistration template pre-declaring the amendment classes the last two
campaigns needed").*

**Which form to use is a proportionate-gating question (`AUTONOMY.md` §21).** A change that touches
an ADR, security posture, the data plane / wire, or a stated guarantee — or that exceeds the
declared size threshold (§21c) — takes the **full form** below and full two-agent gating. A docs,
tests, or polish change that touches none of those and stays under the threshold may use the
**five-line short form** at the end and a single combined reviewer gate.

---

## The full form

### Header (before §0)

- Title, and the authority it decomposes (a node id, a ruling in `DECISIONS-PENDING.md`, a brief).
- **Drafted by** whom (architect agent on the custodian's brief, or the custodian), from which
  inputs, read at which `main` commit.
- **Committed before any code** — the same discipline both campaigns kept; note it explicitly.
- **Append-only once committed. An amendment made after any outcome has been seen MUST say so in its
  first line** (the ADMISSION rule, `engine/ADMISSION-PREREGISTRATION.md:5`) and states what work it
  touches or invalidates.

### §0. Disclosure

*What informed this document, disclosed rather than left to be inferred: any pilot, spike, consult,
or already-collected corpus. Every `file:line` is a read of `main` at a named commit; a worker
re-derives every cite it touches. A hypothesis is labelled as one and carries its discriminator.*

**Fixture-drive confound (standing, `AUTONOMY.md` §15a).** If this piece **measures** against the
5 GB hero-slice fixture, state **which drive it was read from (C: or D:)** here, as a confound: a
different physical disk has different read characteristics and the number cannot be compared across
drives.

### §1. What this preregistration may and may not claim

*The negative space, stated up front: no performance number and no `docs/08` row unless a measured
one is declared with its p50/p95 and dataset; no duration or cancellation-vocabulary drift
(ADR-018); no wire change (SKP / MCP) unless the piece is scoped to one and gated for it; wording of
any user-visible string is the human's; which ADRs are cited, and that none is amended here.*

### §2. The rule / the change — stated before it is applied

*What is admitted, refused, recorded, or altered — in the terms the code will use, before the code
exists. Split on the module boundary where more than one module is touched.*

### §3. Fixtures / corpus — pre-declared outcomes

*One row per fixture or corpus file, with the outcome predicted before the run. The prediction is
never edited to match a result (see the deviation class in §10). Hash-verify every fixture before
and after the run.*

### §4. Tests, and the mutation per new test

*Each test named. For every new test, **one mutation that makes it fail by name**, recorded
(`AUTONOMY.md` §14; verified mechanically as a pre-gate self-check, §6a).*

### §5. Registered predictions · declared unchanged · invalidators · falsification

*What is predicted (wrong is a result); what is declared unchanged; the invalidators that stop the
piece; the falsification conditions that make the whole preregistration wrong.*

### §6. Instruments

*Per quantity: is it an **assertion** (a structural fact — a read count, a typed outcome) or a
**measurement** (a number against `docs/08`)? A measurement carries its p50/p95, its dataset, and —
if against the 5 GB fixture — its drive (§0).*

### §7. Declared values and ceilings

*Every constant declared, not discovered (ADR-010 rule 6): its value, and the quantity it bounds,
at its own site.*

### §8. Block-on-sight

*The conditions that stop a merge on sight, numbered, each checkable one by one at the gate.*

### §9. Gates

- **Architect** (full gating only) — the ADR rules and principles checked, block-on-sight one by one.
- **Reviewer** — the full diff; each contract change reviewer-gated in its own right.
- **Suites** — the mechanical suites and the pre-gate self-checks (§6a) that must be green first.
- **Operator** — the walkthrough rows, committed with blank result logs, queued into the next sitting
  (felt verdicts are the human's).

### §10. Amendments — opens empty, append-only

*This section opens empty and is append-only from the first commit. Use one of the pre-declared
classes below; each has a fixed first-line convention so a reader sees the class at a glance. Do not
invent a class after the fact — if none fits, that is a finding to route to the human, not a new
freeform amendment.*

**Pre-declared amendment classes (from the last two campaigns):**

1. **Post-result amendment** — *made/written AFTER the piece's results were seen.* Its **first line
   says so**, verbatim in that shape (`POLISH…` Amendments 1–6 each open this way; the ADMISSION
   rule at `:5`). Records what the result was and what, if anything, it invalidates.
2. **Deviation recorded after results, with the reason** — a run whose outcome differs from a §3/§5
   registered prediction. The deviation is a **recorded result**; the prediction is **never edited to
   match it** (`ADMISSION…` §8, the brief's P4 rule; `POLISH…` Amendment 1's confirmed-discriminator
   record). State the reason and the evidence.
3. **Cite / line-number / tense fixes** — stale cross-references corrected (`POLISH…` Amendment 5(g):
   *"Stale cites fixed: `tileGridConstants.ts:38` → `:40`"*). Mechanical; also caught by `verify:cites`
   (§6a). Never changes a claim, only where it points.
4. **A mutation added or corrected after a gate finding** — a gate found a test whose mutation was
   missing, weak, or mis-described; the mutation is added or corrected and its **observed failure
   recorded by name** (`POLISH…` Amendments 2, 4, 5; §14). If no second harness run was made, say the
   mutation was unit-only.
5. **A scope-narrowing on a ruling** — the human's ruling (or a gate) narrows what the piece does; the
   narrowed scope is recorded with the ruling **quoted verbatim** (`POLISH…` Amendment 4 narrowing the
   retryable set on the Q3 ruling; Amendment 2's substitution of a superseded field). A **quote is
   never a paraphrase** — quote the ruling's own words, label any paraphrase as such (the worker
   citation-fabrication lesson; `POLISH…` Amendment 5(a) substituted the verbatim gate quote for a
   worker paraphrase).

---

## The five-line short form (`AUTONOMY.md` §21d)

*For a single-gate piece (docs / tests / polish under the §21c threshold). Committed before code.*

```
Authority: <the node id / ruling / directive that authorises this piece>
Scope: <files, <= 8; declared line budget, <= 150 non-generated>
Change: <what the diff does, in one sentence — the observable delta>
Tests+mutation: <the test(s) added or changed, and the one mutation per new test that fails it by name>
Out-of-scope: <the §21a categories this piece asserts it does not touch — ADR / security / wire / guarantee>
```

The `Out-of-scope` line is the custodian's written claim that §21a's full-gating categories do not
apply; the single reviewer checks it first, and a false one is a block-on-sight that re-enters full
gating. A short-form piece that needs an amendment uses the same five classes above, in a one-line
`Amendment:` note appended beneath the five lines.
