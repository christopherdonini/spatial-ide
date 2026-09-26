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
   (§6a). Never changes a claim, only where it points. Test text is the named exception (the human,
   2026-09-17, round 14; the custodian's wording): a record correction that changes a claim living in a
   test comment or an operator-facing test string is class 3, recorded by row with the superseded span pinned.
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
6. **Budget deviation, Scope not edited** (short form only; added 2026-09-16 on the human's round-5
   ruling) — a five-line piece exceeded its declared `Scope` line budget or file count. The
   `Amendment:` line records the declared figure, the final figure under §21c's counting rule
   (insertions plus deletions over non-generated code and tests, the piece's own preregistration and
   its obligatory governing-doc sentences excluded), and the reason; the `Scope` line is **never**
   edited to match. If the final figure crosses §21c's bound, the single-gate route closes as §21b's
   mid-piece clause says and the architect gate is taken; the short form stays.
7. **Sight-list or gate-list addition, evidence-driven** — a P6 sight-list entry, block-on-sight item or gate step added because the piece's own runs showed an operator will meet something §9 does not name. Not class 5 (no ruling is narrowed) and not class 3 (it adds a thing to be looked at, not a pointer). The first line says **"sight-list addition"**, names the evidence by report or `file:line`, and states that no claim elsewhere changes. A sight-list addition never settles wording — the strings stay the human's at P6. (Adopted 2026-09-17 on the human's round-14 ruling, byte-copied from `state/consults/2026-09-17-p3b-re-scope.md:204` @ 1a0251461aa2 sha256:6662739f32c34e66492117a92cd2beb1e90fb9e4a35f21ef7ea9c98c2e9ed93c.)

**Every "discharged" / "done" clause names its proof** (the human, 2026-09-16, round 7; permanent in
both gate checklists): "every "discharged" or "done" clause in an amendment names the test or line that proves it, and the gate resolves each — a discharge claim with no resolvable proof is a gate failure by name, the same way an imagined interface and a stale cite are." Name the test by its function name or the file:line; a clause
the gate cannot resolve fails the gate.

**Quote by reference** (the human, 2026-09-17, round 12; permanent in this section, both gate checklists and the worker brief). Adopted as proposed, the clauses byte-copied from `state/questions/round-12.md:3` (sha256 of that line 8c70572216c53b355bd2e89465a7a58f2dc914006c9517f177fd6de6cd5aad83): "(a) ledger rulings cited by round and item, never by line; (b) a passage that must be invoked is cited path:line with the span's sha256 and reproduced only when byte-copied by a script and marked so — the gate recomputes the hash; (c) custodian briefs reference binding text by path:line only, anything else marked paraphrase; (d) a correction is at most three sentences — the defect, the corrected reference, the proof — and never restates an earlier amendment's claim; (e) a correction round ends with a superseded index, and "read the last amendment first" joins the P6 sight list." Riders, the human's words: on (b) "reproduction is the exception — the default is a path:line reference with span hash and no reproduced text; a passage is reproduced only when the sentence cannot be understood without it, by script, marked." and on (d) ""three sentences" is a ceiling, not a form — a correction that needs fewer uses fewer." Hash form: sha256 over the cited whole lines as committed, LF bytes (`git show <commit>:<path> | sed -n '<a>,<b>p' | sha256sum`), the commit named when the file is not on main; a sub-line span carries its line's hash and says so. Class 5's "quoted verbatim" is read through (a) and (b): the ruling is cited by round and item, and its words are reproduced only under (b).

**Clause (a′) and the root-cause rule** (the human, 2026-09-17, round 14; permanent here, in both gate checklists and the worker brief). Adopted as proposed, byte-copied from `state/consults/2026-09-17-p3b-re-scope.md:206` @ 1a0251461aa2 sha256:3ba887681e265c681c69fe6845a99f3ce717ef7e7aeb8f3d1152d8fb0a4ac122 and `state/consults/2026-09-17-p3b-re-scope.md:208` @ 1a0251461aa2 sha256:b7b3f7de5fc0b1299cfe04795df667836ea16e16c8e7e10c09566b02a6823d8d: "A ledger passage with no round or item is cited by the entry number the block itself carries ('entry 98'), never by line. Because (a) forbids a line cite into the ledger, no ledger passage is pinned by (b)'s path:line + hash: round + item, or the entry number, is its reference form, and the gate's own resolution against the RULED block or the entry is the proof." "A record never carries a bare `:line` into a file the same commit edits. A self-reference inside a preregistration is by section, amendment and item, never by line. A reference that must carry a line is pinned `path:line[-line] @ <commit> sha256:<hex>` at a commit the citing commit does not create; a pinned reference is stable under any later insertion, and the gate fails a bare self-line by name." The human's addition, verbatim: "a pinned path:line @ commit sha256 reference is a historical pin — when the current tree no longer matches it, the gate resolves it by naming which is authoritative, the pin or the tree; a pin is never silently read as current." The standing rule of the same round, verbatim: "nothing tracked may cite an untracked file as Authority."

**The consult mechanism, tool claims, durable references, the restore bound and class 1** (the human, 2026-09-18, round 15; permanent here, in both gate checklists and the worker brief). Adopted as proposed, byte-copied from `state/questions/round-15.md` at 83cad32c93eb (lines 4, 5, 6, 7, 8, 9, 10; each line's sha256 beside it): (a) "A consult whose deliverable is a frozen, byte-copied block carries a final numbered step: before committing, the worker resolves each summary sentence of the block against the consult's own steps and against every piece of evidence the consult orders collected, and **STOPS on a mismatch** instead of committing." (`state/questions/round-15.md:4` @ 83cad32c93eb sha256:9d442a0af0bbc637bcfed11014f2d091cffa25d3d437bfeb02128d21e5bb11f7) (b) "A re-scope that freezes prose and forbids adjustment needs a per-row resolution step, or the row's claim must be reduced to what its own pin proves." (`state/questions/round-15.md:5` @ 83cad32c93eb sha256:d7480f797d04efa87b2336ff6725369185d2bd9036f4b0ea3122f67598442efe) (c) "a record statement about a tool's behaviour names the tool's commit, the same way a reference names its own; a tool claim read as current is a pin read as current." (`state/questions/round-15.md:6` @ 83cad32c93eb sha256:44820912b3d0e3fbd534a4fa764302e78210ddbb4ecd3e8032bce3a6543f14ae) (d) "a `path:line @ <rev> sha256:<hex>` reference is written contiguous on one line, even past 100 columns (rustfmt does not reflow comments)." (`state/questions/round-15.md:7` @ 83cad32c93eb sha256:784248325acedd1004c9e23bee7b4349a0de40587bb2a20705c5fb33adb98b0c) (e) "a hash reference written in an append-only record carries an explicit `@ <rev>` **at a commit on main**, never a branch commit and never the HEAD default." (`state/questions/round-15.md:8` @ 83cad32c93eb sha256:39e24cb0fbb0854a9361278081bc04dcdf86ff4da091187572dabb81320bc29f) (f) "a record's committed byte is restored only to revert an in-place edit the append-only rule forbade, on a branch that has not merged, with the intended correction re-carried by an appended row; append-only is then proved against the named base commit, not the immediate parent." (`state/questions/round-15.md:9` @ 83cad32c93eb sha256:9344a28c0b59786e6a5c453ca2b56e923d6c3783ddf9c03d44a8851f2c511df7) (g) "confirm class 1 for a withdrawal row in a record-correction round, on the reading both amendments state — a gate round's findings are the round's results, and a row that records what they invalidate is a post-result record." (`state/questions/round-15.md:10` @ 83cad32c93eb sha256:79f67cda22b27a9d8960ec50370344cd47f08866e6287a76513fe9e11a673b41) Class 1 covers a withdrawal row in a record-correction round on the reading (g) confirms. The record cap (the human's standing directive of 2026-09-18, verbatim at `state/directives/2026-09-18-record-cap.md:5` (the directive line; its sha256 e44168d98d83bff75fc1155dd8b1f94b4ac077e113c8deabacaa93fd2622ef58 at the commit that adds it)): a piece's record is the smallest text a gate can verify; a closing amendment is references and hashes, never prose restating them; record correction is two rounds per piece, after which the architect reduces the record to references and the piece lands; record-fidelity failures spawn no clauses — a new class is a ledger finding and a proposal to the human at most once a week. The untracked-Authority rule is dated non-retroactive (the same round), the human's words: "the untracked-Authority rule is dated non-retroactive; the disclosure in the record suffices — with one distinction kept: those e2e reports are evidence (a run's output, cited for what it reported), not Authority (binding text a gate resolves against), and the round-14 rule was written for the latter."

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

---

## Round 25 additions (the human, 2026-09-26, round 25, item 2; appended at the end so that no line a record cites above it moves)

*Round 25, item 2 adopted (a) to (e) of `state/questions/round-25.md` item 2 as one governance piece, this week's allowance under the record cap (`state/directives/2026-09-18-record-cap.md`); each is cited by round and item and not reproduced, and the operative text is this section's own. §10's class list now runs 1 to 9: classes 8 and 9 join classes 1 to 7 above, whose numbers and texts are unchanged. No record written before this section is re-labelled.*

8. **Budget overrun, full form, §7 not edited** (round 25, item 2 (a)) — a full-form piece exceeded a line budget or a file count its §7 declares. Its first line carries the words `budget overrun, §7 not edited`. It records the declared figure, the final figure by §7's own counting command at a named commit (by §21c's counting rule where §7 names none), and the reason; the §7 line is **never** edited to match. It opens no gate route, since the piece is already under full gating. Class 6 stays the short form's budget class, and class 2 stays the class of a missed §3/§5 prediction; an overrun recorded as class 2 before this section (round 23, item 4, O7) keeps its label.
9. **Scope addition on a standing rule** (round 25, item 2 (a)) — a standing rule of the human, a permanent ruling or a standing directive, adds work to a piece already preregistered. Not class 5, which narrows. Its first line carries the words `scope addition` and cites the rule by round and item, or by the directive's path, without reproducing it. Before any code of the addition, the amendment declares it as the form declares everything else: its §2 shape, its §4 tests each with a mutation, what §5 declares unchanged and what would invalidate it, and its §8 and §9 items. An addition recorded as class 5 before this section (the source-change watcher's Amendment 4) keeps its label. In a short-form piece, an addition that brings a §21a category follows §21b's mid-piece clause.

**Mutation-observation wording** (round 25, item 2 (c)). `scripts/plan/verify-mutation.mjs` at `a5d8b8b` checks that a mutation is recorded and runs none (its header's WHAT THIS DOES NOT GUARANTEE paragraph). No record calls a `verify-mutation` run an observation of a mutation, or names one as a mutation's observation of record. A mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it; that run, or the gate report that made it, is the observation of record. A later record stating that the tool runs mutations names the tool's commit (round 15 (c)).

**A test-text span on an unmerged branch** (round 25, item 2 (d)). When the span a class-3 test-text row pins exists only at a commit not yet on main, the row names it by that commit's id until merge, in words and with no hash: lines <a>-<b> of `<path>` at `<commit>`. Round 15 (e) forbids a hash reference at a branch commit in an append-only record, and the words form carries no `path:line` token for `verify-cites` to read against a later tree. The piece's PR body names the row and asks for a merge that keeps the commit reachable from main, never a squash. After the merge, the hash pin follows on main as an appended class-3 row, `<path>:<a>-<b> @ <commit> sha256:<hex>`, carried until then by a PLAN node blocked on the piece.

**Out-of-scope at dispatch** (round 25, item 2 (e)). When the `Out-of-scope` line a piece would carry at dispatch names a §21a category as touched, anything short of asserting that the piece touches none of the four, the piece takes the full form and full gating from dispatch, and no five-line form is committed for it. A category first found mid-piece still follows §21b's mid-piece clause, and a five-line form already committed is not rewritten.
