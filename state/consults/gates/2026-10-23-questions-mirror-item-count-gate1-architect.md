Reviewed: PR #245 at 0f93c12264879535ac40de1d87f0139bc927fbf5, gate 1, architect (`cut/questions-mirror-item-count @ 0f93c12264879535ac40de1d87f0139bc927fbf5`)
Verdict: FAIL

The block is on wording only (AUTONOMY.md §31; the 2026-10-11 directive, item 2). The code's Correctness and Evidence are closed. None of the sentences below is the human's wording: the doc comment is the worker's, the form was drafted by the architect, and the PR body is the custodian's. So the worker applies the words below with no re-gate, and the PR body lists them.

## C (Correctness): wording only, replacement words given

**C-1. The doc comment's two limits state outcomes the code does not produce** (`scripts/hooks/questions-mirror.mjs:46-49`). Untrue claims of a limit are Correctness by the 2026-10-05 directive, section 2. They also touch §8 item 6.
- "counts 0" is not general. A hand-written file is counted from whatever paragraph-opening `1. `, `2. `, ... lines it holds (`:54`), and it counts 0 only when none opens with `1. `.
- "is counted one high" is wrong in both directions.
  - If item i < k holds a paragraph opening `<i+1>. `, the scan counts that paragraph, skips the real item i+1, and still returns k. That case is counted right.
  - If item 1 of 2 holds paragraphs `2. ` and `3. `, the count is 3. So the overcount is not bounded at one.
- The overcount is real. It needs some item i whose text holds a paragraph opening `<i+1>. `: the first time the scan gets ahead, it is inside item i with `expected` equal to i + 1. §1's second may-not-claim (form `:39`) is therefore a correct limit. Only the comment's description of the outcome is wrong.
- Replacement for `:46-49`:
```
/** Item count = the numbered items `1. `, `2. `, ... each opening a paragraph (the first line or a line after
 * an empty line), counted in order from 1. Best-effort, for the summary line only. Two limits: a file
 * whose items are not numbered `<n>. ` at a paragraph's start (a hand-written one) is not counted by its
 * items, and counts 0 when no paragraph opens with `1. `; and an item whose own text (its question or an
 * option) holds a paragraph opening with the next item's number can be counted high. */
```
- Clause check:
  - "not counted by its items": the scan reads only the lines `:54` matches, after the split at `:53`. I1 at the head shows round 1 and round 32 at 0.
  - "counts 0 when no paragraph opens with `1. `": `expected` moves only on the string `"1"` first (`:54`), and `:57` returns `expected - 1`.
  - "its question or an option": `renderRound` joins the question and its option lines with `\n` (`:151-158`), so a `\n\n` in either one opens a paragraph.
  - "can be counted high": the last item k holding `<k+1>. ` gives k+1, and a non-last case gives k. Both follow from `:54`. Nothing in the words claims "one".
  - The words state the same two limits as §1 (form `:38`, `:39`), so §8 item 6 is met. §1's phrase "a question's own text" is read as the item's text, its options included.
- §7: the comment grows by one line, so the `.mjs` file goes to 16 added / 6 deleted (22, ceiling 30) and the total to 66 (ceiling 120). The PR body's Scope line becomes "66 lines".

**C-2. The red-line claim states a guarantee the declared pattern does not give.** It appears in form `scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:36` (§1 may-claim 3) and is repeated in the PR body's Summary, second sentence.
- The claim says the header lists a question when it opens with "one leading label that ends `. ` or ` — `".
- The pattern at `scripts/hooks/questions-mirror.mjs:128` accepts only a lead that holds no full stop, em dash or line break.
- So the label `§2.1` in `§2.1 — RED LINE` ends ` — ` and is still not listed. In the other direction, `Was this — RED LINE?` is listed, though it arguably "only mentions the marker later".
- Ordinary use can reach both cases: a round question is free text the custodian writes, and the human reads the header.
- The code matches §7 exactly, so this is the claim's wording, not the code.
- PR body replacement for the Summary's second sentence:
  > The hook's header now lists a question as red-line when its text opens with `RED LINE`, or with a run holding no full stop, em dash or line break, then `. ` or ` — `, then `RED LINE` (case-sensitive): `OPEN-1 — RED LINE` and `Item 8. RED LINE` are listed; `§2.1 — RED LINE`, `Item 5. F — RED LINE` and a lower-case `red line` are not.
- Clause check against `:128`, `/^(?:[^.—\n]*?(?:\. | — ))?RED LINE/`:
  - `^` and the optional group give "opens with".
  - `[^.—\n]*?` is the run.
  - `(?:\. | — )` is the joiner.
  - There is no `i` flag, so it is case-sensitive.
  - Traces: `OPEN-1` + ` — ` matches. `Item 8` + `. ` matches. `§2` is followed by `.1`, which is not `. `, so it fails. `Item 5` + `. ` is then followed by `F —`, not the marker, and the run cannot cross the `.`, so it fails.
- Form: the form is append-only, so the same words go in as an appended amendment. Its class is 1, because it is written after this gate's results (round 15 (g)). Its first line says so. Proposed text:
  > *Written after the architect's gate 1 findings (post-result).* §1 may-claim 3 is read as §7's red-line pattern: a question is listed when its text opens with `RED LINE`, or with a run holding no full stop, em dash or line break, then `. ` or ` — `, then `RED LINE`, case-sensitive; any other question is not listed, so a lead holding a full stop (`§2.1 — RED LINE`) is not. §1's second may-not-claim reads "a question's own text" as the item's text, its options included.
- Follow-up candidate, outside this piece (adding it here would be a class-9 scope addition): a lead with a full stop (`§2.1`, `v0.2`, a file name) still reads `none`. That is this piece's defect class. It is worth a proposed node.

## E (Evidence)
None.

## D (Documentation): fix before the merge, no re-gate
- **D-1.** Form §1 claim 2, §2.3 and §4 carry bare line cites into `scripts/hooks/questions-mirror.test.mjs`: `:46-67`, `:43-67`, `:64`, `:82-97`, `:96`, `:346-356`. After this branch they point at shifted lines. At the head:
  - the doc-path test is `:47-68`;
  - the old `:64` is `:65`;
  - the old `:96` is `:97`;
  - T13 is `:349-358`.

  They must not be read as current (round 14). Append one sentence to the same class-1 amendment: "The bare line cites into `scripts/hooks/questions-mirror.test.mjs` in §1, §2 and §4 are read at 769c39af0ea83a245205d42e9817cba859372f1e, the commit the form's **Drafted by** line names; they are historical pins, and the tree after this piece is not what they describe."
- **D-2.** The PR body's Gates paragraph cites "the human's ruling of 2026-10-23" without its source. Replace with: "By the human's ruling in `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md`, item 1, this PR's gates run alongside `verify-cites-pin-resolution-and-line-zero`." I read that directive: its item 1 says questions-mirror's PR and gates run alongside verify-cites-pin.

## The six checks

1. **§2.1 to §2.3 against the code at the head.**
   - Split on `\r?\n` (`:53`).
   - Paragraph-opening: `afterEmpty` starts true and is set from `line === ''` (`:52`, `:55`).
   - `^(\d+)\. ` compared with `expected`, giving `expected - 1` (`:54`, `:57`). The comparison is a string compare, so `01. ` is not counted. The hook never writes a padded number, so this is not a finding.
   - Pattern as in §7 (`:128`), tested against `q.question` (`:145`).
   - Summary: n = 0 gives no count, n = 1 gives `1 item`, n ≥ 2 is unchanged (`:62-64`).
   - Agreement point: `rulingSet.mjs:49`/`:72-77` splits on `\n` only and applies the same regex. Every line `countItems` counts, CRLF ones included (the trailing `\r` is not anchored), is found by `questionFileHasItem`. It holds.
2. **§1 against the doc comment.** This is C-1. The comment claims no limit beyond §1's two, but it mis-states both outcomes. §1's may-not-claim list is itself correct.
3. **Seams.**
   - `mirrorRound` into `buildSummary` (`:83`) is unchanged.
   - The hook into `mirrorRound` (`:204`) is unchanged.
   - T13 (`questions-mirror.test.mjs:349-358`) spawns the shipped hook. It asserts the exact dry-run line, whose prefix I read at `telegram.mjs:46`.
   - T14(a) (`:370-374`) reads committed `state/questions/round-52.md`.
   - T15 (`:382-394`) feeds committed rounds 52 and 59 through the hook in the recorded fixture's shape.
   - I read rounds 52 and 59. The traces give `1, 3` and `1, 2, 4`, and the negative case gives `none`.
   - No new export: the same five exports as at B, `:38`, `:41`, `:50`, `:61`, `:74`. A repo search for the summary string finds no other consumer.
4. **I1 and I2 against §3.** I compared row by row.
   - I1 at B matches "Today" and at the head matches "Predicted", 14 rows of 14.
   - Rounds 36 to 73 at the head equal `headerK` in 38 of 38. The unchanged rows are 2 to 15 and 17 to 20. That gives 55 changed and 18 unchanged.
   - I2 at the head matches the §3 list in 38 of 38. I2 at B has committed equal to rerun in 38 of 38, which is a control that the extraction is faithful.
   - Reader step (§5, I2): a search of `^\d+\. .{0,80}red.?line`, case-insensitive, over `state/questions/` gives the lead-marker items. For 36 to 73 those are 40, 41, 42, 45, 46, 52 to 59, 61, 62 and 63, with exactly the listed numbers. The only lower-case ones are 55/2, 59/3 and 61/2 (`not a red line`), and none of them is listed. This agrees with I2.
   - Records: the worktree's `round-52.md:1` still reads `RED LINE items: none.`, the same as main. Reading the 13 headers as records of what was sent, not edited, is right (§1 may-not, Amendment 1 item 5).
   - I have no shell, so the block sha256s are the reviewer's to recompute.
5. **Amendment 1's choices.** n = 0 and n = 1 are applied as in §2.3 (`:63-64`). The strings the human reads change only in the summary's count words and the header list's contents (§2.2). Hook mode's stderr lines and the header format (`:144-160`, `:162-213`) are byte-identical to B's `:135-204`.
6. **§8.**
   - (1) No round file is edited. The diff is 2 files (the brief; the worker's numstat), and I spot-read round 52 above.
   - (2) No new export.
   - (3) T13 and T14(a) use real shape. T14(b) and (c) are the synthetic and CRLF cases that §4 orders by name. I read §8 item 3 as governing the seam assertions, so it is not tripped, and this report carries that reading.
   - (4) Every `RECORDED MUTATION` for M15 to M21 says "observed at f5570106 (applied, run, reverted)". None cites `verify-mutation`.
   - (5) 21/30, 44/90 and 65/120 (the worker's numstat). My own line count of the test diff, 41 added and 3 deleted, agrees.
   - (6) This is C-1.
   - Not a finding: §5's falsification line is broader than the real failure case (an inner next-number paragraph mid-round is counted right). It can only over-report a falsification, never hide one.
