Reviewed: PR #242 at 91ccdab4904b5937b53b296b03a91a62b41fd2f3, the scoped re-gate after correction round 1, architect — cut/verify-quotes-round-item-cites @ 91ccdab4904b5937b53b296b03a91a62b41fd2f3
Verdict: PASS WITH NOTES

The round closes gate 1's C-1 and E-1. Nothing blocks on Correctness or Evidence. D-1 to D-4 below must be fixed before the merge, with no re-gate. None of their sentences is the human's wording. H-1 is still the human's, and the merge waits for it (Amendment 4, item 5).

Method: I have no shell. I read the head in C:/dev/wt/vqri, and the form and records in the main checkout. For the PR body I read the custodian's scratch draft `pr-vqri-body-2.md`, not the live PR. I recomputed no hash and ran no suite.

Disclosure: one of my reads saw `scripts/plan/verify-test-claims.mjs:557` without its round-file reader. A later read showed it restored. Another agent was mutating the worktree while I read it. So after that restore I checked again, by Grep, every head text I rely on below: the new words are present and the old words are gone.

## Correctness
None.

## Evidence
None blocking.

N-1 (a note, inferred and not observed): C2 reaches only the ruling call's reader. Its carrier is the fixture default, `round 2, item 5` (`scripts/plan/verify-test-claims.test.mjs:558`), which resolves through the synthetic ledger's item line. The reviewer's gate 1 probe showed that dropping both readers left every test passing, and C2 is the only test added since. It follows that dropping the reader from the carrier call alone (`scripts/plan/verify-test-claims.mjs:557`) would pass the suite. This does not block. The seam rule asks for one end-to-end test from the real shape, and C2 is that test: both calls bind the same reader, MC2 as Amendment 4 declares it fails, and it fails on the positive case. A carrier-side twin is a one-test follow-on, if anyone wants one.

## Documentation (must fix before the merge, no re-gate; none of these is the human's wording)

**D-1. The round report states a cite that does not resolve, outside backticks (§8.4).** Step 1's negative case (round report, line 10) ends with the regex text `/unresolvable ruling: round 66, item 9/`, written outside backticks. Round 66 has no item 9; C2 asserts that. The report is filed byte for byte, so the fix is one row in the closing amendment (S4). Words:
> The round-1 report's step 1, negative case, carries the test's expected failure text, `round 66, item 9`, as its instrument's output; it is not a reference.

Clause check: `scripts/plan/verify-test-claims.test.mjs:1719` asserts that the round-66 file has no item 9, and :1734 matches that exact failure text.

**D-2. MC2's commit.** Amendment 5, item 1 reads as if MC2 was observed at 91ccdab4. The round report, step 2, applied it to b08a1fec's tree with C2 not yet committed. One S4 row. Words:
> MC2 was observed on b08a1fec4e3405153b4998882427355fa18db319's tree with C2 uncommitted (the round-1 report, step 2); `scripts/plan/verify-test-claims.mjs` is unchanged from b08a1fec to 91ccdab4 (the same report, step 4's diff list).

Clause check:
- Step 4 lists four changed files, and verify-test-claims.mjs is not among them.
- Sections 1 to 4 account for exactly the 13 deletions that step 4 reports (9 + 1 + 2 + 1).
- The C2 block accounts for the remaining 32 insertions (53 − 21): it is lines 1705 to 1735 plus one blank line.
- If the reviewer re-observes MC2 at 91ccdab4, cite that observation instead.

**D-3. The PR body draft is stale in three places.**
- In line 5, "with Amendments 1 to 3" becomes:
  > with Amendments 1 to 5

  Check: the form on main ends at Amendment 5.
- Line 6, "**H** is b08a1fec4e3405153b4998882427355fa18db319.", becomes:
  > **H** is 91ccdab4904b5937b53b296b03a91a62b41fd2f3 (gate 1 read b08a1fec4e3405153b4998882427355fa18db319).

  Check: Amendment 5, item 1.
- In line 21, "(lines 113 to 123)" becomes:
  > (lines 113 to 123 at b08a1fec, 113 to 129 at 91ccdab4)

  Check: the replacement occupies `scripts/plan/verify-quotes.mjs:113-129` at the head.

**D-4. The comment at the constant's site still says `> `.** This line is outside this round's diff, and both gate 1 reports missed it. `scripts/plan/verify-quotes.mjs:835` reads "A `> ` blockquote line is not read.", but the rule is `/^\s*>/` (:836). Replace it with:
> // A line whose first non-blank character is `>` is not read.

Clause check: `CITE_BLOCKQUOTE_LINE_RE` (:836) is tested on the raw line at :848, before any span is masked.

**Carried: the reviewer's gate 1 D-4 (S4).** The closing amendment is still not on main. Its two contents are now recorded: the §7 range in Amendment 4, item 4, and S1's third parameter in Amendment 2, item 1, as corrected by Amendment 4, item 4. S4 is still owed before the merge, after H-1 is ruled, as references only, and it carries the rows of D-1 and D-2.

## The four checks

**1. Sections 1 to 4 of the reconciled words, as applied at the head.**
- Section 1: `scripts/plan/verify-quotes.mjs:113-129` matches the consult's replacement block line for line. That includes the unchanged first line (:113) and the unchanged ninth line (:121). There is no trailing whitespace and no CR in the file.
- Section 2: `scripts/plan/README.md:381` matches the replacement line.
- Section 3: `.github/workflows/governance-ci.yml:34-37` matches the replacement.
- Section 4: `.github/workflows/governance-ci.yml:153` matches the replacement.
- The old texts are absent (Grep count 0).
- The clause checks still hold at the head, with the code 6 lines lower than at b08a1fec:
  - backtick and quote masking: :838, :850;
  - `>` lines: :836, :848;
  - one line at a time, and the sticky tail: :847, :842, :855-856;
  - a tail only after `items`: :854;
  - the head pattern's lookahead (sub-clause letter; `item 2e`; no `rounds`): :840;
  - the scan set: :876, :1016;
  - every tracked archive: :429-431;
  - an itemless block read through the tracked round file: :1011-1012 and `scripts/plan/rulingSet.mjs:92-97`;
  - one file at a time: `rulingSet.mjs:86-87`;
  - the PASS and FAIL conditions: :1192 and :1203-1204.
- The step name is still a valid YAML plain scalar: it has no colon-space after the key and no " #".
- Sections 5 and 6 are applied in the draft (lines 3 and 10).

**2. C2 against E-1 and Amendment 4, item 2.** It meets both.
- The name is exact (`scripts/plan/verify-test-claims.test.mjs:1708`).
- It enters through the real `runVerifyTestClaims`, over a git fixture in which `state/questions/round-66.md` is committed. So it exercises `trackedRoundFileText`'s tracked-only read (`verify-test-claims.mjs:490-494`) and the reader bound at :551.
- The positive case, `round 66, item 2`, gives 0 findings and 1 withdrawn row. The negative case, item 9, gives one finding by name.
- The block is found by round. The test's header pattern (:1711) is `RULED_BLOCK_HEADER_RE`'s form narrowed to rounds 66 and 67, and its boundary (:1714) is `RULED_BLOCK_BOUNDARY_RE`.
- The test asserts its own preconditions (:1716-1719): the block has no item lines, and the round file has item 2 and lacks item 9. So the fixture cannot drift silently.

Reading the bytes with `git show 40b04b46:` while the test runs is the byte copy Amendment 4 asks for, so it is **not a finding**:
- a commit's blob is immutable;
- `split('\n')` and `join('\n')` lose nothing on LF text, and neither does UTF-8 decoding and re-encoding valid text;
- it is the mechanism that §3 declares for Q12 to Q14 and that C1 uses (:1693), which gate 1 accepted under §8.7.

If the commit is missing from a clone, `execFileSync` throws and the test fails loudly. CI clones with `fetch-depth: 0` (governance-ci.yml:139).

**3. Gate 1 findings.**
- Architect C-1: closed by the head (check 1) and by the draft's line 3.
- Architect D-1: closed. Amendment 4, item 4's first row is true at the head: `resolveInText` (:511) and `resolveCitation` (:519) carry no `export`; their only calls are :551 and :557, both passing the reader; and `resolveInText`'s only call is at :520. The draft's line 10 is also replaced.
- Architect D-2: closed. Amendment 4, item 4 records it as class 8, with §7 not edited.
- Architect D-3: closed by Amendment 4, item 4's third row.
- Architect N-1: closed by C2, with N-1 above remaining.
- Reviewer E-1: closed (check 2), with MC2's base taken up in D-2.
- Reviewer D-1 to D-3: closed, merged into sections 1 to 3.
- Reviewer D-4: carried (see above).

**4. §8, for what this round changed.**
1. U1 to U4: the only code-file change is comments. The round report's verify-quotes PASS line repeats gate 1's U1 figures, and U4's `cmp` gives rc=0 (report, step 4). The reviewer recomputes them.
2. No cite baseline route.
3. No message added.
4. One hit in the round report (D-1). Amendments 4 and 5, the reconciled words and C2's comments carry no other unresolved cite outside backticks.
5. No line cite into the ledger or its archive in this round's records.
6. Four paths, all within §9 rule (00). Only the workflow's comment and step name change. Nothing is under `protocol/`, and no governing doc is touched.
7. C2's fixture lines come from the named real block and the real round-66 file.
8. No new export; verify-test-claims.mjs is unchanged.
9. Amendment 5's tool claims name 91ccdab4. No path:line hash reference was added.
10. MC2 was observed by applying it and running C2 alone, not by verify-mutation.
11. The `paths:` filter is unchanged. Both lists still hold the same 15 entries (:84-98, :101-115), and step 4's 13 deletions are all inside sections 1 to 4.

§7: 375 + 6 + 2 + 32 = 415, which agrees with Amendment 5 (this is arithmetic, not a recount).
