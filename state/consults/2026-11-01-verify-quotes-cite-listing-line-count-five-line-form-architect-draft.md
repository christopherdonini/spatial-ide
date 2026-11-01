*Custodian's filing note (2026-11-01): the architect's read-only draft for `verify-quotes-cite-listing-line-count` (VQ), the governance lane's last piece, read at main b84a2b26 (dispatched 2026-11-01T04:59:05Z by the main transcript, its prompt equal to its brief by script). It finds the five-line form closed (§21a: an existing test's asserted figure changes) and drafts the full form; that form is committed in the same commit at its governance path, with Amendment 1. The run 04:59:06Z to 05:04:04Z by its transcript (Read 20, Grep 14, Glob 1; no write tool; no call outside the repository). The custodian checked its central claim by reading: the existing test asserts `out of range (file has 4 lines)` for a three-line file that ends in a newline. Its OPEN-1 to OPEN-3 are not red lines and take its recommendation under the human's direction of 2026-10-31, item 4. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 565815fd042b812535d23b469e10f5b0438f8b6f9ffb0da8379e651b906e8300.*

---

Drafted: verify-quotes-cite-listing-line-count, five-line form, architect
Read at: main @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b, in the main checkout. I have no shell, so this report carries no sha256. All prose below is my own wording. The only byte-copied text is the reuse index, copied from the brief. I wrote fixture cites in words so that verify-cites does not read them as cites.

## First: the five-line form is closed for this piece

- **The guarantee category (§21a).** The fix cannot land without changing what an existing test asserts. `a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end` (scripts/plan/verify-quotes.test.mjs:183-191 @ b84a2b26) asserts the defective figure at scripts/plan/verify-quotes.test.mjs:190 @ b84a2b26: a three-line file that ends in a newline is listed as having 4 lines. Its RECORDED MUTATION comment (scripts/plan/verify-quotes.test.mjs:178-182 @ b84a2b26) carries the same figure.
- **Why that closes the form.** Changing an asserted figure touches "any property currently under test" (governance/AUTONOMY.md:325-327 @ b84a2b26). Under round 25, item 2 (e) (docs/PREREGISTRATION-TEMPLATE.md:176 @ b84a2b26; governance/AUTONOMY.md:482 @ b84a2b26), no five-line form is committed for a piece whose Out-of-scope line names a category as touched.
- **Precedent.** governance/forms/scripts/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:5-8 @ b84a2b26 took the full form for exactly this kind of change. The fold draft also found it for this same test, state/consults/2026-10-26-verify-cites-past-end-bound-five-line-form-architect-draft.md:10-13 @ b84a2b26. The human then split the node out without naming its form (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:24 @ b84a2b26).
- **What follows.** Draft A is the five lines as briefed, written honestly; it routes to the full form and is not to be committed as a five-line form. Draft B is a compact full form for the same path, which can be committed under OPEN-1 (A).

## Draft A: the five lines (route to the full form; not committable as a five-line form)

```
Authority: PLAN node `verify-quotes-cite-listing-line-count` (governance/PLAN.yaml:6132-6148 @ b84a2b26), its own node, S4, last in the governance lane, no form until its turn, by the human's ruling of 2026-10-26 (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:24 @ b84a2b26); VQ last by state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:23 @ b84a2b26; VQ in the governance lane after the docs lane by state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 5; proposed by verify-cites-out-of-range-line-count's drafting consult; the reuse index found no prior art on either search (line count trailing newline; cite listing out of range), a miss noted here.
Scope: 2 files: scripts/plan/verify-quotes.mjs, scripts/plan/verify-quotes.test.mjs; declared line budget 70 (insertions plus deletions, tests and comments counted, governance/AUTONOMY.md:357 @ b84a2b26); this form exempt; one existing test changed, a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end (its expected count, 4 to 3, and its RECORDED MUTATION comment, rewritten and re-observed at the head), because the figure it asserts is the defect this piece corrects; no test removed.
Change: verify-quotes' cite listing (listCiteContents, printed under --show-cites) bounds a cited line by the file's true line count (a final newline ends the last line and starts no new one, and an empty file has 0 lines) and prints that count in its out-of-range note, so the line just past the end of a file that ends in a newline, and line 1 of an empty file, are listed out of range instead of as a blank line, and every out-of-range note for such a file prints a count one lower than today; no gated check changes, and the hash check's line slice is not touched.
Tests+mutation: a_cite_listing_reports_the_line_just_past_a_newline_ended_files_end_as_out_of_range (new; fails at the base, which lists `(blank line)`); M1: the listing's range comparison reads the split's piece count again, and the test fails by name (with a_cite_listing_reports_line_1_of_an_empty_file_as_out_of_range). a_cite_listing_reports_line_1_of_an_empty_file_as_out_of_range (new; fails at the base, which lists `(blank line)`); M2: the count's empty-file term dropped, and the test fails by name (alone). a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end (changed: expects `out of range (file has 3 lines)`; fails at the base, which prints 4); M3: the note's figure read from the split's piece count again, and the test fails by name (with both new tests); its existing mutation, the out-of-range guard removed, is re-observed at the head and fails it (with both new tests). Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (Node's standard library only, no dependency, no workflow change); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: TOUCHED, since the piece changes the asserted figure of an existing test (scripts/plan/verify-quotes.test.mjs:190 @ b84a2b26), a property currently under test (governance/AUTONOMY.md:325-327 @ b84a2b26); verify-cites, the hash check and governance CI are not touched.
```

## Draft B: the full form (committable at governance/forms/scripts/VERIFY-QUOTES-CITE-LISTING-LINE-COUNT-PREREGISTRATION.md under OPEN-1 (A))

- **Header.**
  - Title: verify-quotes' cite listing bounds and prints the file's true line count (PLAN node `verify-quotes-cite-listing-line-count`), preregistration.
  - Authority: as in Draft A's Authority line.
  - Drafted by the architect on the custodian's brief, read at main b84a2b26. Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
  - Form: full (§21a, a property currently under test; §25(e)). The size is under §21c and does not decide the form.
- **§0 Disclosure.** Reasoned from code at b84a2b26; nothing was run. The piece relies on these reads:
  - The listing is scripts/plan/verify-quotes.mjs:1055-1105 @ b84a2b26. The defect is at scripts/plan/verify-quotes.mjs:1085-1088 @ b84a2b26: `split('\n').length` serves as both the bound and the printed count. That is the piece count, one above the true count for a newline-ended or empty file. A cite to the line just past the end therefore falls into the in-range branch (scripts/plan/verify-quotes.mjs:1091-1094 @ b84a2b26) and is listed as `(blank line)`.
  - The listing's only product caller is main() under --show-cites (scripts/plan/verify-quotes.mjs:1142-1150 @ b84a2b26). Governance CI runs verify-quotes without that flag (`.github/workflows/governance-ci.yml` lines 157-158 at b84a2b26).
  - No other count shares the defect:
    - The hash check's slice, linesWithLF (scripts/plan/verify-quotes.mjs:666-674 @ b84a2b26), takes the true count for newline-ended text (scripts/plan/verify-quotes.mjs:669 @ b84a2b26).
    - The blockquote extent count (scripts/plan/verify-quotes.mjs:334 @ b84a2b26) is also true.
    - The other splits in the file iterate over lines and print no count.
    - verify-cites' countOf (scripts/plan/verify-cites.mjs:274-277 @ b84a2b26) is correct and unexported.
  - The listing's tests are scripts/plan/verify-quotes.test.mjs:147-206 @ b84a2b26 and scripts/plan/verify-quotes.test.mjs:785-802 @ b84a2b26.
  - The reuse index, byte for byte as in the brief, is below; it is a miss.
- **§1 What this form may and may not claim.**
  - No performance number. No gated check changes, and no wire change. No string of the app (the listing is a developer tool's advisory output). No ADR is cited or amended.
  - The listing checks a range cite's first line only. That stays as it is, and nothing is claimed about a range's end.
- **§2 The change.**
  - In the single-candidate branch, read the candidate's text once and split it, then compute `count = lines.length - (text === '' || text.endsWith('\n') ? 1 : 0)`. This is countOf's formula, written inline (OPEN-2).
  - The guard compares `c.startL` with `count`, and the note prints `count`. The in-range branch is unchanged.
  - No export, no signature change, and no edit to verify-cites.mjs.
  - The header (scripts/plan/verify-quotes.mjs:65-70 @ b84a2b26) and the docstring (scripts/plan/verify-quotes.mjs:1047-1054 @ b84a2b26) become true as worded and are not edited. At most one comment line is added at the count.
- **§3 Fixtures** (temporary git trees inside the tests; written in words here).
  - T1: a three-line text ending in a newline, cited at line 4. Base: `(blank line)`. Head: `out of range (file has 3 lines)`.
  - T2: an empty tracked file, cited at line 1. Base: `(blank line)`. Head: `out of range (file has 0 lines)`.
  - T3, the existing test: the same three-line text, cited at line 99. Base: 4 lines. Head: 3 lines.
  - Unchanged at base and head: the first-line test, the ambiguous test, the blank-line test (line 2 of a text whose second line is empty) and the hash-mark test.
- **§4 Tests and mutations.** As in Draft A's Tests+mutation line, M1 to M3 plus the re-observed guard removal. My traces, against the head design:

  | Mutation | T1 | T2 | T3 |
  |---|---|---|---|
  | M1 | blank, fails | blank, fails | 99 above 4, prints 3, passes |
  | M2 | count 3, passes | count 1, blank, fails | passes |
  | M3 | prints 4, fails | prints 1, fails | prints 4, fails |
  | guard removed | blank, fails | blank, fails | blank, fails |

  No other test fails under any of these. No existing test other than T3 is changed.
- **§5 Predictions, unchanged, invalidators.**
  - P1: §3's outcomes.
  - P2: every other test in verify-quotes.test.mjs keeps its text and passes, and the full `node --test` set CI runs over scripts/plan passes.
  - P3: CI's verify:quotes step gives the same output and exit, since the listing is computed only under --show-cites.
  - P4 (OPEN-3): over one clean tree at the base, the base's and the head's --show-cites listings have the same rows (relPath, citeLine, target, hashMark). They differ only in firstLine, in two ways:
    - (i) an out-of-range note whose count is one lower at the head, for a file that ends in a newline or is empty;
    - (ii) a row listed `(blank line)` at the base whose target is one above its file's true count, listed out of range at the head.
  - Invalidators, each a stop: any other difference, or a row-count change.
  - Falsification: a just-past-end cite still listed as blank at the head, or a real blank line listed as out of range.
- **§6 Instruments.** Assertions only; no measurement.
- **§7 Declared values.** 70 lines over 2 files, by `git diff --numstat <merge-base>...<head>`, insertions plus deletions, tests and comments counted. An overrun is class 8. No constants.
- **§8 Block-on-sight.**
  1. A file outside the two in Scope is changed (verify-cites.mjs above all).
  2. An existing test other than T3 has its text changed, or any test is removed.
  3. A cite at or below its file's true count is listed differently at the head than at the base.
  4. A record calls a verify-mutation run an observation of a mutation (docs/PREREGISTRATION-TEMPLATE.md:172 @ b84a2b26).
  5. T3's RECORDED MUTATION comment carries a figure or actual output not observed at the commit it names.
  6. The P4 run shows a difference outside (i) and (ii).
- **§9 Gates.**
  - The architect and the reviewer (§21a, governance/AUTONOMY.md:315-332 @ b84a2b26).
  - Suites: CI's `node --test` set, verify:cites, verify:quotes, verify:test-claims, verify:plan, and verify-mutation (a floor, not an observation).
  - Operator: none.
- **§10 Amendments.** Opens empty; append-only.

```text
$ node tools/reuse.mjs line count trailing newline   (exit 1)
No prior art recorded for "line count trailing newline". Research it before planning an implementation.
$ node tools/reuse.mjs cite listing out of range   (exit 1)
No prior art recorded for "cite listing out of range". Research it before planning an implementation.
```

## 1. The defect at this main (as read)

- **Still present.** The bound and the printed figure at scripts/plan/verify-quotes.mjs:1085-1088 @ b84a2b26 both come from the piece count.
  - A newline-ended file is counted one line too many.
  - Its line just past the end reaches scripts/plan/verify-quotes.mjs:1091-1094 @ b84a2b26, where `lines[n]` is the empty string, so it is listed as `(blank line)`.
  - An empty file counts 1 line, and its line 1 is listed the same way.
  - A CRLF file ends in `\n`, so the fix covers it too.
- **No other caller shares the count.** It is local to listCiteContents. That function's only product caller is main() (scripts/plan/verify-quotes.mjs:1143 @ b84a2b26), and its only other callers are five tests. The hash check's slice and the blockquote count are true, as §0 shows. The node's claim that the hash check is not affected holds.

## 2. Size (my estimate, against §21c, governance/AUTONOMY.md:347-357 @ b84a2b26)

| Part | Lines |
|---|---|
| verify-quotes.mjs: text read once, count, guard, note, one comment | about 8 |
| T1 and T2 with their mutation comments | about 26 |
| T3: assertion plus rewritten mutation comment | about 15 |
| **Total** | **about 49, 2 files** |

This is under 150 lines and 8 files, and it leaves a margin of about 21 against the declared 70. The size is not what decides the form.

## 3. Rule (00)

The piece's paths are scripts/plan/verify-quotes.mjs and scripts/plan/verify-quotes.test.mjs, plus the form on main.

| Branch | Overlap |
|---|---|
| cut/b2-piece-1c-save-and-reopen | nothing under scripts/; disjoint |
| cut/port-2-macos-l1-and-app-dirs | cfg-boundary.mjs and its test; disjoint files |
| cut/b1-shell-half-pr-c | no files |
| #274 | nothing under scripts/; disjoint |
| #273 | nothing under scripts/; disjoint |
| #272 | verify-cites.mjs and its test; disjoint under OPEN-2 (A), overlapping under (B) |
| #271 | verify-quotes.baseline.json; a separate file that this piece neither reads nor changes; disjoint |

- Nothing touches protocol/.
- I cannot read the branches; these path lists are the brief's.

## OPEN items (none is a red line by item 4's list in the 2026-10-31 direction)

- **OPEN-1, the form.** My recommendation is (A).
  - (A) The full form (Draft B) and both gates. This applies §25(e) on the precedent reading.
  - (B) The five-line form and the reviewer alone. This would read an assertion of the defect itself as not a property under test. That is a new reading of §21a, which the fold draft already declined; it needs the human, and I do not recommend it.
  - Under the 2026-10-31 direction, item 4, (A) is taken and recorded with its date; the human may reverse it on return. It changes no ruled scope, since the 2026-10-26 ruling did not name a form for this node.
- **OPEN-2, the count helper.** My recommendation is (A).
  - (A) Inline, using countOf's formula. Two files, and disjoint from #272.
  - (B) Export countOf from verify-cites and import it. One definition, with product callers on both sides, but it adds verify-cites.mjs, which overlaps #272 under rule (00) and would wait for its merge.
- **OPEN-3, the P4 run.** My recommendation is (A).
  - (A) The worker runs the base's and the head's listing over one clean tree at the base and files the counts for each class in its hand-back.
  - (B) Rely on the tests alone.

## What I could not settle

- **No hashes.** The pins and span hashes are the custodian's to compute by script.
- **Node fields.** The node's `gate: none` must name the form in the form's own commit, so that verify-test-claims reads the three tests as planned. Its 60 minutes are likely short with two gates; that is the custodian's call.
- **An adjacent edge, not this piece's.** linesWithLF counts an empty text as 1 line (scripts/plan/verify-quotes.mjs:669 @ b84a2b26). A hash reference to line 1 of an empty file therefore recomputes over the empty string, which matches the sed form the hash rule names. I make no claim that this is a defect, and it is not in Scope.
- **T3's current comment.** It records an actual output of `''` under guard removal. At main the in-range branch would print `(blank line)`, so the comment's actual output may already be stale. The re-observation at the head settles this.
