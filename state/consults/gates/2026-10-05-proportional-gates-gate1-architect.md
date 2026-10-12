# PR #180 gate 1 — architect
Reviewed: docs/proportional-gates @ 988e4cdd25de9afaf4e5a22a02a5e2505aa0e768

**Verdict: pass with notes.** Correctness: PASS. Evidence: PASS. Documentation: two findings (D1, D2) and one note (D3). Under the proportional-gates rule (`state/directives/2026-10-05-product-first-direction.md`, section 2) none of them fails the gate. Each is fixed in this PR before the merge, and the custodian checks each fix against its finding.

Scope read: the three files the brief names, at the head in `C:/dev/wt/pgates`. I have no Bash, so I did not run `git diff origin/main...HEAD` to confirm the diff touches only those three files. The reviewer should confirm that.

## Correctness — PASS
- **Section 2 mapped part by part.** I mapped section 2 of the direction (line 15) onto `AUTONOMY.md:389`:
  - The rule that a gate fails only on Correctness or Evidence is the unchanged "Correctness or Evidence FAIL blocks" plus the new rule that Documentation and record findings never fail a gate.
  - The new text says those findings get no correction round and no re-gate.
  - It says they are fixed in the same PR before the merge, the custodian checks each fix, and the closing record lists them.
  - All three never-documentation-only items are there.
  - It keeps the record cap.
  - It says every gate brief carries section 2 by reference.
  - Nothing is added. The fragments and the clarification (`state/directives/2026-10-05-product-first-fragments.md`, `state/directives/2026-10-05-product-first-clarification.md`) say nothing about section 2, so they do not change it.
- **Coherence.** The line still reads as one rule. It keeps the three verdicts, the C/E FAIL sentence and the carry-forward paragraph (`AUTONOMY.md:391`). The replaced text was "Documentation-only FAIL → one bounded correction round…", main `AUTONOMY.md:389`. It was replaced in place on the same line, so the file's line count is unchanged. Nothing in the tree hash-pins `AUTONOMY.md:389`. The only cites into this range are in filed gate reports, worker reports and `state/gate-log.json`, and all of those are historical.
- **The in-place edit to a human-ruling record.** Under the §22 table this record is Immutable, and an in-place edit would normally break that. Section 2 itself orders the change ("This replaces AUTONOMY section 22's Documentation-only sentence"). The new text names what it replaced, and git history keeps the old wording. That discharges it. It is not a violation.
- **Red lines.** No red-line text is changed. The red-line list (`AI_DEVELOPMENT.md:39-51`) is untouched, and section 7 of the direction is respected. The PR is for the human's click, as section 2 says.
- **Quotes.** The diff contains no passage marked verbatim. Both agent paragraphs label themselves "cited by section, paraphrased here". `AUTONOMY.md:389` attributes the rule without quotation marks. So the round 10 verbatim rule has nothing to check.

## Evidence — PASS
None is required: the diff is docs only and makes no claim of a guarantee, a limit or a measurement.

## Documentation findings (fix in this PR before the merge; none fails the gate)
- **D1. A contradiction left behind in both agent definitions.**
  - Where: `.claude/agents/architect.md:11` and `:15`, and `.claude/agents/reviewer.md:25` and `:29`.
  - The problem: these lines still say that record-fidelity items "fail by name" or "block". Examples are a line cite into `DECISIONS-PENDING.md`, a bare self-line, a hash reference without an explicit rev on main, a tool claim without the tool's commit, closing-amendment prose that restates a reference, and the round 25 class 8/9 items.
  - The new paragraphs (`architect.md:17`, `reviewer.md:31`) are appended but never say they take precedence over these lines. A gate that reads its definition in order meets the older failure rules first.
  - Fix: add one sentence to each paragraph. It should say that where the definition calls a documentation or record finding a failure or a block, that finding is now reported under this paragraph. Items that are really Correctness or Evidence keep their class: an imagined seam, a discharge claim with no proof, and the three never-documentation-only items. This brings the definitions in line, which section 2 orders, and adds no new rule.
- **D2. The output formats have no slot for a must-fix-but-non-failing finding.**
  - Architect: `architect.md:13` gives "Verdict (pass / pass with notes / block) → violations". It does not name the three verdicts (Correctness / Evidence / Documentation) that `AUTONOMY.md:389` requires and that the new paragraph assumes ("you report them under Correctness or Evidence").
  - Reviewer: `reviewer.md:27` sorts output into "blocking issues first … then suggestions, then nits". A Documentation finding must be fixed before the merge but does not block, and "suggestions/nits" reads as optional.
  - Fix: one clause in each paragraph mapping the output onto the three verdicts. Documentation findings are listed as must-fix-before-merge, not as optional suggestions.
- **D3. Note.** No `PLAN.yaml` node names this piece, on the branch or on main, although the brief is tagged `node:proportional-gates@g1`. If the custodian's tooling expects a node for the tag or for the closing record, add one. Otherwise the tag should not suggest that a node exists.

No ADR is needed: the direction is the authority, and no architectural decision is missing.
