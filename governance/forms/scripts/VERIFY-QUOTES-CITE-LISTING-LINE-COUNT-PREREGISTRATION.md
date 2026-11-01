# verify-quotes' cite listing bounds and prints the file's true line count (PLAN node `verify-quotes-cite-listing-line-count`), preregistration.

## First: the five-line form is closed for this piece

- **The guarantee category (§21a).** The fix cannot land without changing what an existing test asserts. `a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end` (scripts/plan/verify-quotes.test.mjs:183-191 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:1e07e8b1779c24fbd2829ba0d6abc8ae60e9106a63cb688bb85a78d71a7f56d8) asserts the defective figure at scripts/plan/verify-quotes.test.mjs:190 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:a0078d5ed43618961bd76b399caff48fa44226c0b8a5ff25a718af84db1ad275: a three-line file that ends in a newline is listed as having 4 lines. Its RECORDED MUTATION comment (scripts/plan/verify-quotes.test.mjs:178-182 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:f29a412c0c427f4f22672b698a8f89f7911e1aed12d6f4d66482627213d1f651) carries the same figure.
- **Why that closes the form.** Changing an asserted figure touches "any property currently under test" (governance/AUTONOMY.md:325-327 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7). Under round 25, item 2 (e) (docs/PREREGISTRATION-TEMPLATE.md:176 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917; governance/AUTONOMY.md:482 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669), no five-line form is committed for a piece whose Out-of-scope line names a category as touched.
- **Precedent.** governance/forms/scripts/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:5-8 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:e7a079c8e1ffd12cabd7d56ba82f7db336851f9cb31dd86251ed0157125f5a0d took the full form for exactly this kind of change. The fold draft also found it for this same test, state/consults/2026-10-26-verify-cites-past-end-bound-five-line-form-architect-draft.md:10-13 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:767cdd418ecbd3382c2599ac7a6edd1e0ac92c58e6fc3406639b1a8ed7a8c0e3. The human then split the node out without naming its form (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:24 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:d7096c8beb15a17d774ddb43942041318487f596b9433e3779705c2f73d6c723).
- **What follows.** Draft A is the five lines as briefed, written honestly; it routes to the full form and is not to be committed as a five-line form. Draft B is a compact full form for the same path, which can be committed under OPEN-1 (A).

## Draft A: the five lines (route to the full form; not committable as a five-line form)

```
Authority: PLAN node `verify-quotes-cite-listing-line-count` (governance/PLAN.yaml:6132-6148 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:61485b64f065c093cad00d6bd911c681fc78fa8b9a6012421563b05083493267), its own node, S4, last in the governance lane, no form until its turn, by the human's ruling of 2026-10-26 (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:24 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:d7096c8beb15a17d774ddb43942041318487f596b9433e3779705c2f73d6c723); VQ last by state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:23 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:75ef4955e796484b3eeacdac24ba0b4c970fe25fa1a0fe273e7a3cba12e4ef1e; VQ in the governance lane after the docs lane by state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 5; proposed by verify-cites-out-of-range-line-count's drafting consult; the reuse index found no prior art on either search (line count trailing newline; cite listing out of range), a miss noted here.
Scope: 2 files: scripts/plan/verify-quotes.mjs, scripts/plan/verify-quotes.test.mjs; declared line budget 70 (insertions plus deletions, tests and comments counted, governance/AUTONOMY.md:357 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; one existing test changed, a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end (its expected count, 4 to 3, and its RECORDED MUTATION comment, rewritten and re-observed at the head), because the figure it asserts is the defect this piece corrects; no test removed.
Change: verify-quotes' cite listing (listCiteContents, printed under --show-cites) bounds a cited line by the file's true line count (a final newline ends the last line and starts no new one, and an empty file has 0 lines) and prints that count in its out-of-range note, so the line just past the end of a file that ends in a newline, and line 1 of an empty file, are listed out of range instead of as a blank line, and every out-of-range note for such a file prints a count one lower than today; no gated check changes, and the hash check's line slice is not touched.
Tests+mutation: a_cite_listing_reports_the_line_just_past_a_newline_ended_files_end_as_out_of_range (new; fails at the base, which lists `(blank line)`); M1: the listing's range comparison reads the split's piece count again, and the test fails by name (with a_cite_listing_reports_line_1_of_an_empty_file_as_out_of_range). a_cite_listing_reports_line_1_of_an_empty_file_as_out_of_range (new; fails at the base, which lists `(blank line)`); M2: the count's empty-file term dropped, and the test fails by name (alone). a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end (changed: expects `out of range (file has 3 lines)`; fails at the base, which prints 4); M3: the note's figure read from the split's piece count again, and the test fails by name (with both new tests); its existing mutation, the out-of-range guard removed, is re-observed at the head and fails it (with both new tests). Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (Node's standard library only, no dependency, no workflow change); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: TOUCHED, since the piece changes the asserted figure of an existing test (scripts/plan/verify-quotes.test.mjs:190 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:a0078d5ed43618961bd76b399caff48fa44226c0b8a5ff25a718af84db1ad275), a property currently under test (governance/AUTONOMY.md:325-327 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7); verify-cites, the hash check and governance CI are not touched.
```

## Draft B: the full form (committable at governance/forms/scripts/VERIFY-QUOTES-CITE-LISTING-LINE-COUNT-PREREGISTRATION.md under OPEN-1 (A))

- **Header.**
  - Title: verify-quotes' cite listing bounds and prints the file's true line count (PLAN node `verify-quotes-cite-listing-line-count`), preregistration.
  - Authority: as in Draft A's Authority line.
  - Drafted by the architect on the custodian's brief, read at main b84a2b262f5ba4b4b49c14bd4a83129ca694f27b. Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
  - Form: full (§21a, a property currently under test; §25(e)). The size is under §21c and does not decide the form.
- **§0 Disclosure.** Reasoned from code at b84a2b262f5ba4b4b49c14bd4a83129ca694f27b; nothing was run. The piece relies on these reads:
  - The listing is scripts/plan/verify-quotes.mjs:1055-1105 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:8f1b807f08b7112a6addd5dfb72c593564df7b3a6548c71441129c772d91ef99. The defect is at scripts/plan/verify-quotes.mjs:1085-1088 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:d72fadc01cce39dd8e3122b731975a5cdf874eb7605978cffc9d2c95b1786b25: `split('\n').length` serves as both the bound and the printed count. That is the piece count, one above the true count for a newline-ended or empty file. A cite to the line just past the end therefore falls into the in-range branch (scripts/plan/verify-quotes.mjs:1091-1094 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:ed61042ee3d52b8ec1f8adb7ced999d350fcf5f89bda211e322d10e8caad1d49) and is listed as `(blank line)`.
  - The listing's only product caller is main() under --show-cites (scripts/plan/verify-quotes.mjs:1142-1150 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:2beadd04c5f6300547673b689dec9ae3b98cbda0e3e8639ff872779e50c65df2). Governance CI runs verify-quotes without that flag (`.github/workflows/governance-ci.yml` lines 157-158 at b84a2b262f5ba4b4b49c14bd4a83129ca694f27b).
  - No other count shares the defect:
    - The hash check's slice, linesWithLF (scripts/plan/verify-quotes.mjs:666-674 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:3623a8785ecc52ac64d6fb816dae8b3f843add0e952419df2e6786ba8b13ea30), takes the true count for newline-ended text (scripts/plan/verify-quotes.mjs:669 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:1dbd4325aa2c71113f81a0f146b16bed87ea08e324ad22660f90371d0d61acc0).
    - The blockquote extent count (scripts/plan/verify-quotes.mjs:334 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:06da15c0ca5a5ef60017ab0c2df71064355c1dc3e5c89d42aed1745d48ddf64a) is also true.
    - The other splits in the file iterate over lines and print no count.
    - verify-cites' countOf (scripts/plan/verify-cites.mjs:274-277 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:1fef8d3b5e6f30c02bd074d04a687f0348025d7b769bdb79ef8edb9b9444a2a3) is correct and unexported.
  - The listing's tests are scripts/plan/verify-quotes.test.mjs:147-206 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:5addbd8c5992ddc723c35f90dbf7144661cdef84eeebcf28bfcb6676777cbc71 and scripts/plan/verify-quotes.test.mjs:785-802 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:2196ff66e15ccddbb3d6d977851431b679c5f086e8e35259684f8aaa6f22ebe3.
  - The reuse index, byte for byte as in the brief, is below; it is a miss.
- **§1 What this form may and may not claim.**
  - No performance number. No gated check changes, and no wire change. No string of the app (the listing is a developer tool's advisory output). No ADR is cited or amended.
  - The listing checks a range cite's first line only. That stays as it is, and nothing is claimed about a range's end.
- **§2 The change.**
  - In the single-candidate branch, read the candidate's text once and split it, then compute `count = lines.length - (text === '' || text.endsWith('\n') ? 1 : 0)`. This is countOf's formula, written inline (OPEN-2).
  - The guard compares `c.startL` with `count`, and the note prints `count`. The in-range branch is unchanged.
  - No export, no signature change, and no edit to verify-cites.mjs.
  - The header (scripts/plan/verify-quotes.mjs:65-70 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:65d11b2d80897f69e59bdfb073b8ea65dc6fbc63238b9ec2748876fc4738bb91) and the docstring (scripts/plan/verify-quotes.mjs:1047-1054 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:ae91681cc9d1304c1368308e3052118dbb2e58313cde845287aae80cfa5f4adb) become true as worded and are not edited. At most one comment line is added at the count.
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
  4. A record calls a verify-mutation run an observation of a mutation (docs/PREREGISTRATION-TEMPLATE.md:172 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2).
  5. T3's RECORDED MUTATION comment carries a figure or actual output not observed at the commit it names.
  6. The P4 run shows a difference outside (i) and (ii).
- **§9 Gates.**
  - The architect and the reviewer (§21a, governance/AUTONOMY.md:315-332 @ b84a2b262f5ba4b4b49c14bd4a83129ca694f27b sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3).
  - Suites: CI's `node --test` set, verify:cites, verify:quotes, verify:test-claims, verify:plan, and verify-mutation (a floor, not an observation).
  - Operator: none.
- **§10 Amendments.** Opens empty; append-only.

```text
$ node tools/reuse.mjs line count trailing newline   (exit 1)
No prior art recorded for "line count trailing newline". Research it before planning an implementation.
$ node tools/reuse.mjs cite listing out of range   (exit 1)
No prior art recorded for "cite listing out of range". Research it before planning an implementation.
```

## Amendment 1 — committed: the custodian's settlement and the pins (class 1)

- **Committed** on 2026-11-01 at `governance/forms/scripts/VERIFY-QUOTES-CITE-LISTING-LINE-COUNT-PREREGISTRATION.md` from the architect's read-only draft (`state/consults/2026-11-01-verify-quotes-cite-listing-line-count-five-line-form-architect-draft.md`, read at main b84a2b26; its sha256 from line 5 is 565815fd042b812535d23b469e10f5b0438f8b6f9ffb0da8379e651b906e8300). This form's heading is Draft B's Title line, byte for byte after its label; the rest is the draft's form part, from its first section (the five-line form closed) to the end of Draft B's reuse block, byte for byte except for the pins. The draft's opening lines and its sections after Draft B (the defect as read, the size, rule (00), the OPEN items, what it could not settle) are in that file. **The pins:** each cite the draft marks `@ b84a2b26` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (29 pins; 0 in the prose shape for a dot path or a root file whose bare name other tracked files share; 0 by a file name that resolves to one tracked path at that commit; 0 bare line numbers bound to the path written before them); a cite the draft gives without its own marker is kept as written; 3 remaining markers are given the full commit id.
- **OPEN-1: (A),** the full form (Draft B) and both gates, taken on 2026-11-01 as the architect recommends, by the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4), for the human's review on return. Draft A stays above as the lines Draft B's §4 refers to; it is not a five-line form, and none is committed for this piece.
- **OPEN-2: (A),** the count written inline with verify-cites' formula, taken the same way; the piece stays on its two files, disjoint from #272.
- **OPEN-3: (A),** the P4 run by the worker, its counts for each class filed in its hand-back, taken the same way.
- **The node:** its gate names this form; its status goes from unscheduled to blocked, with `depends_on` naming `verify-cites-reversed-range`, the governance lane's piece before it (VQ last, `state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md`, line 23): the custodian's reading, for the human's review on return. Its budget is kept as placed.
- **Rule (00),** by git at main b84a2b26 (`git diff --name-only origin/main...<branch>` over the open PRs, #274, #273, #272, #271, and the branches in flight): none touches `scripts/plan/verify-quotes.mjs`, its test or this form; re-checked at dispatch.
- **Not settled by the draft, and checked by the piece:** T3's current RECORDED MUTATION comment's actual output, re-observed at the head; the adjacent empty-text count in the hash check's slice is outside Scope, and nothing is claimed of it.
