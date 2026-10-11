# PR #211 gate 1 — reviewer
Reviewed: docs/wording-block-rule @ 2ad00400eb05a1b458126afbcba4850392505c3e

**Verdict: PASS.** Correctness passes and Evidence passes. There are six Documentation findings (D1 to D6). Each must be fixed in this PR before the merge. None of them blocks.

I confirmed the head with `git -C C:/dev/wt/wordblock rev-parse HEAD`, which gives `2ad00400eb05a1b458126afbcba4850392505c3e`. The merge-base equals origin/main, `ceff6d82`. The three-dot diff touches 3 files with 27 insertions and 0 deletions. No file has CR bytes.

## Correctness — PASS
- **Placement of §31.** It is appended after §30 at the end of `AUTONOMY.md`. No line above it changes, since the diff has 0 `-` lines in all three files. The two agent paragraphs are appended after the Proportional-gates paragraph, and nothing above them changes.
- **The fenced block matches.**
  - `git show 9a7da36a:state/directives/2026-10-11-direction-after-status-review.md | sed -n '14,25p' | sha256sum` gives `d26d781228f0ac58aa937aa3793ff96560f334f3401dcb70ee663f48480882ec`, which is the hash §31 states.
  - I extracted the fence from the head and ran `cmp` against those lines: they are byte-identical.
  - `9a7da36a` is an ancestor of origin/main, and the directive's blob is unchanged on main (the same sha256).
  - The pin is written on one line as `path:line @ <full rev> sha256:<hex>` (round 15 (d) and (e)). It is marked as byte-copied by script, and it gives its reason for reproducing the text (round 12 (b)).
- **Quotation marks.** Neither paragraph and none of the §31 prose or bullets contains quotation marks. The only quoted span is "tell me and do not reword". It sits inside the byte-identical fence, so it is the human's own text.
- **Red lines.** Neither agent definition nor AUTONOMY §31 is a red-line text under item 2f.

## Evidence — PASS
I ran these in `C:/dev/wt/wordblock` at the head:

| Check | Result |
|---|---|
| `node scripts/plan/verify.mjs` | rc 0 |
| `verify-cites.mjs` | rc 0 |
| `verify-quotes.mjs` | rc 0 |
| `verify-test-claims.mjs` | rc 0 |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | rc 0: 457 tests, 457 pass, 0 fail |

The worktree was clean before and after the runs.

## Documentation — must-fix before the merge
All six sentences below are the worker's wording, not the human's. The paragraphs are marked "paraphrased here", and the §31 bullets are the worker's. So item 2d applies: the worker applies the words below with no re-gate, and the PR body lists them. The human's wording in this PR is the fenced block only, and it needs no change.

Directive cites below are to `state/directives/2026-10-11-direction-after-status-review.md` @ 9a7da36a.

**D1 — the Yes branch drops its PR-body record.** This is in both paragraphs. Item 2b, line 17, reads: "Yes: the worker applies the proposed words. No re-gate. The PR body records it." Both paragraphs have: "Yes: the worker applies your words, with no re-gate."
- Replace with: Yes: the worker applies your words, with no re-gate, and the PR body records it.
- Clause check against line 17:
  - "applies" matches "applies the proposed words".
  - "no re-gate" matches "No re-gate".
  - "PR body records it" matches "The PR body records it".

**D2 — item 2g's "my rulings since" is lost.** This is in both paragraphs. Line 24 reads: "(my instruction of 2026-10-10 and my rulings since)". Both paragraphs have: "For the cases it covers, this replaces the human's earlier instruction to report such a sentence and not reword it."
- Replace with: For the cases it covers, this replaces the human's instruction of 2026-10-10 to report such a sentence and not reword it, and the human's rulings since.
- Clause check against line 24:
  - "for the cases it covers" matches.
  - "instruction of 2026-10-10" matches.
  - "rulings since" matches.
  - "report … not reword" is an unquoted paraphrase of the human's quoted phrase. It must stay unquoted.

**D3 — an added requirement.** This is in both paragraphs. Item 2a, line 15, reads: "The report shows each clause of those words checked against the code." Both paragraphs have: "Check each clause of your words against the code, naming the file and line that bears it out." The words "naming the file and line" are a form requirement that item 2 does not state.
- Replace with: Show each clause of your words checked against the code.
- Clause check against line 15: "each clause" matches; "checked against the code" matches.

**D4 — item 2e's approval, and where it happens.**
- Line 22 reads: "the architect drafts it in the form with the same clause check, and I approve or replace it there."
- The reviewer's paragraph drops the approval altogether: "Where a piece needs a new sentence of the human's that states what the code does, the architect drafts it in the form with the same clause check."
- The architect's paragraph drops "there": "Where a piece needs a new sentence of the human's that states what the code does, you draft it in the form with the same clause check, for the human to approve or replace."
- Architect, replace with: Where a piece needs a new sentence of the human's that states what the code does, you draft it in the form with the same clause check, and the human approves or replaces it there.
- Reviewer, replace with: Where a piece needs a new sentence of the human's that states what the code does, the architect drafts it in the form with the same clause check, and the human approves or replaces it there.
- Clause check against line 22:
  - "new sentence … that states what the code does" matches.
  - "architect drafts it in the form" matches.
  - "same clause check" matches.
  - "approves or replaces it there" matches.
- The only difference between the two paragraphs stays who drafts it, which matches item 2e.
- Line 22 also says "I no longer write such a sentence first." That binds the human, not the agent, so leaving it out is not a finding.

**D5 — the §31 "From when" bullet is broader than "from now".** The bullet reads: "- **From when:** the rule applies from 2026-10-11, before this section merged (the item's h)." Item 2h, line 25, reads: "The rule applies from now, before that pull request merges." The directive was queued at 18:23:36Z (the filing note, line 3). "From 2026-10-11" would take in gates earlier that day.
- Replace with: - **From when:** the rule applies from the direction itself (queued 2026-10-11 18:23:36Z, by its filing note), before this section merged (the item's h).
- Clause check: "from now" matches the direction's own time; "before that pull request merges" matches.

**D6 — the §31 "Where it is carried" bullet narrows item 2h.** The bullet reads: "- **Where it is carried:** every gate brief cites this section by reference." Line 25 says "every gate brief by reference" and names no target. The brief may cite the directive, this section, or both, and this gate's own brief cites both.
- Replace the first sentence with: - **Where it is carried:** every gate brief carries it by reference.
- Keep the second sentence. "The architect's and the reviewer's definitions" are the two gate agents, per `state/directives/2026-10-05-product-first-direction.md` section 2.

## Checked and clean
- **Item 2c.** The operator-observable test, the three exempt cases (timing inside one round trip, a dev-only switch, an instrumented build), "name it" and the source-comment record, and "ordinary use still blocks" are all intact.
- **Item 2b.** The own-words branch (one check only, the author's words land unless the human accepts theirs, no third round) is intact. The accepted branch (source comment and form) is intact.
- **Item 2d.** The examples list is complete, and "with no re-gate" and the PR-body list are kept. "No answer from me is needed" is carried by the yes/no routing.
- **Item 2f.** The not-covered list is complete: the red-line texts with all four examples, the P6 strings, and any finding that changes the code. "Keep my typed words" is not restated, but the red-line rule stands elsewhere unchanged, so no meaning is lost.
- **The §31 "What stays" bullet.** It matches item 2g. §22 does hold the proportional-gates text (§22 at the head, the sentence citing the 2026-10-05 direction, section 2).
- **"Say of each sentence whether it is the human's wording".** This is derived from the 2b and 2d split, which needs it, so it is not an addition.

Files:
- C:/dev/wt/wordblock/AUTONOMY.md
- C:/dev/wt/wordblock/.claude/agents/architect.md
- C:/dev/wt/wordblock/.claude/agents/reviewer.md
- C:/dev/wt/wordblock/state/directives/2026-10-11-direction-after-status-review.md
