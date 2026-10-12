# PR #211 gate 1 — architect
Reviewed: docs/wording-block-rule @ 2ad00400eb05a1b458126afbcba4850392505c3e

**Verdict: pass.** There is no Correctness or Evidence finding. Six Documentation findings (D1 to D6) must be fixed in this PR before the merge, with no re-gate (`AUTONOMY.md` §22; the 2026-10-05 direction, section 2). None of the sentences they touch is the human's wording. All are custodian paraphrase or custodian bullets, so the directive's item 2d applies: the worker applies the words below with no re-gate, and the PR body lists them.

## Correctness
None.

- **The §31 reproduction** is at `AUTONOMY.md:535-546` on the branch. I compared it line by line with `state/directives/2026-10-11-direction-after-status-review.md:14-25`, and it matches.
  - Neither file has trailing whitespace, tabs or CR bytes.
  - The pin is `@ 9a7da36ace6e…`. That commit is on main (round 15 (e)), the reference is written on one line (round 15 (d)), and the cited file is not edited in this PR (round 14).
- **The hash.** I have no Bash, so I could not recompute sha256 `d26d7812…`. That recomputation is the reviewer's, and it is not discharged by this gate.

## Evidence
None. The PR is docs-only and makes no claim of a guarantee, a limit or a measurement.

## Documentation (must fix before the merge)

**D1. Item 2b, "Yes": the PR-body record is lost.** This is in both definitions: `.claude/agents/architect.md:19` and `.claude/agents/reviewer.md:33`. The directive says "Yes: the worker applies the proposed words. No re-gate. The PR body records it." (directive `:17`). Both paragraphs drop the last sentence.
- Replace "Yes: the worker applies your words, with no re-gate." with:
  "Yes: the worker applies your words, with no re-gate, and the PR body records it."
- Clause check against `:17`: the worker applies the words, matches; no re-gate, matches; the PR body records it, matches.

**D2. Item 2f: the consequences are reduced to "Not covered."** This is in both definitions (architect `:19`, reviewer `:33`). The directive `:23` says red-line texts "keep my typed words" and strings the app shows "stay under P6". The paraphrase keeps only the exclusion.
- Replace "Not covered: red-line texts (ADR statuses and amendments, gate rulings, licensing, security posture), strings the app shows (P6), and any finding that changes what the code does." with:
  "Not covered: red-line texts (ADR statuses and amendments, gate rulings, licensing, security posture) keep the human's typed words; strings the app shows stay under P6; and nothing here applies to a finding that changes what the code does."
- Clause check against `:23`: each of the three clauses maps one to one. Nothing is added.

**D3. Item 2g: the scope of what is replaced is narrowed.** This is in both definitions. The directive `:24` says the rule replaces the instruction "(my instruction of 2026-10-10 and my rulings since)". The paraphrase "the human's earlier instruction" drops both the date and "and my rulings since".
- Replace "For the cases it covers, this replaces the human's earlier instruction to report such a sentence and not reword it." with:
  "For the cases it covers, this replaces the human's instruction of 2026-10-10 to report such a sentence and not reword it, and the human's rulings since."
- Clause check against `:24`: the date matches, "and my rulings since" matches, and "for the cases it covers" matches.

**D4. Item 2e: the human's half is missing in the reviewer's definition.** At `.claude/agents/reviewer.md:33` the paragraph omits "and I approve or replace it there" (directive `:22`). The difference between the two definitions is otherwise correct: the architect's says "you draft", the reviewer's says "the architect drafts".
- Replace "…the architect drafts it in the form with the same clause check." with:
  "…the architect drafts it in the form with the same clause check, for the human to approve or replace."
- Clause check against `:22`: the architect drafts it, matches; in the form, matches; with the same clause check, matches; the human approves or replaces it, matches.

**D5. §31 bullet 1 widens "now".** The bullet is at `AUTONOMY.md:549` on the branch. The directive `:25` says "The rule applies from now". The directive's filing note `:3` gives the time "queued at 18:23:36Z by the transcript". "From 2026-10-11" reaches back over gates held earlier that day.
- Replace with:
  "- **From when:** the rule applies from the human's direction of 2026-10-11, queued at 18:23:36Z (the directive's filing note), before this section merged (the item's h)."
- Clause check: the time matches `:3`, and "before … merges" matches `:25`.

**D6. Item 2a: the paraphrase adds a requirement.** This is in both definitions. "naming the file and line that bears it out" is not in `:15`, which says "The report shows each clause of those words checked against the code." It also sits uneasily with item 2c's operator-observable standard: a clause about what an operator can observe is not always borne out by one line.
- Replace "Check each clause of your words against the code, naming the file and line that bears it out." with:
  "Show each clause of your words checked against the code."
- Clause check against `:15`: the words match.

## Not findings: the remaining checks
- **Item 2c** is faithful in both paragraphs: the operator-observable standard, the three cases that do not block, "name it" recorded in the source comment, and ordinary use still blocks.
- **Item 2d** is faithful, including all three examples of a sentence that is not the human's wording, no re-gate, and the PR body listing the words.
- **The three answers** are intact, apart from D1. That includes "only, once", "your words land unless the human accepts theirs as they stand" and "no third round".
- **"Say of each sentence whether it is the human's wording"** is not in item 2 in those words, but the routing between items 2b and 2d needs it. I accept it as derived.
- **Coherence with `AUTONOMY.md` §22 and the proportional-gates paragraphs:** they fit. A wording block can only be a Correctness or Evidence finding, such as an untrue claim of a limit, which item 2g keeps. The rule changes how the block is resolved, not how it is classed.
- **Record cap:** §31 is a governing section, not a closing amendment. Its bullets are short.
- **Reproduction under round 12's (b) rider:** justified. Item 2h makes this section one of the places the rule lives (`:25`). The text is byte-copied by script, marked as such, and pinned with its hash. The alternative would put a custodian paraphrase of binding text into a governing document.
- **Item 2h, "each gate agent's definition":** the architect and the reviewer are the only gate agents (`AUTONOMY.md` §14, "full two-agent gating"; §25(b)), so two paragraphs is complete.

## Red lines
The PR touches no red line. It carries the human's own ruling, and item 2f excludes red-line texts.

One thing is for the human, not the PR. Item 2f's list (`:23`) names ADR statuses and amendments, gate rulings, licensing and security posture. `AI_DEVELOPMENT.md:45-46` and `:453` also make budget-wording changes, anything docs/08-normative, and docs/08 normative rows red lines. If 2f's list is read as complete, item 2d's "a row I have not worded" (`:21`) could let a worker apply gate words to a docs/08 normative row with no answer from the human.

Proposed question (for `DECISIONS-PENDING.md`):
- **Context:** is item 2f's list of red-line texts complete, or does it give examples from the full red-line set (`AI_DEVELOPMENT.md` Red lines section and §B)?
- **Decision (recommended):** the full set. docs/08 normative rows and budget wording keep the human's typed words.
- **Consequence:** until the human rules, gates read "red-line texts" as the full set.
