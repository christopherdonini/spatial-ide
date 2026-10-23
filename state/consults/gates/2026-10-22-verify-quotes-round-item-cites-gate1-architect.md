Reviewed: PR #242 at b08a1fec4e3405153b4998882427355fa18db319, gate 1, architect — cut/verify-quotes-round-item-cites @ b08a1fec4e3405153b4998882427355fa18db319
Verdict: FAIL

This FAIL comes from one finding, C-1, and only words need to change. The code's correctness and evidence are closed. None of the sentences involved are the human's wording. The worker applies the replacement words below without a re-gate (the 2026-10-11 directive, item 2; AUTONOMY.md §31), and the PR body lists them. D-1 to D-3 must be fixed before the merge, with no re-gate. H-1 goes to the human.

Method: I have no shell. I read the head in C:/dev/wt/vqri and the pre-piece files in C:/dev/spatial-ide. Grep counts were taken over the tree at the head. I did not recompute U1 to U4, the §7 figures or any hash; the reviewer does those under §9. Where I rely on those figures, they come from the step reports and are marked as such.

## C — Correctness

**C-1. The docs say every `round N, item M` cite is checked. Cites wrapped across a line break are not, and neither are lines that start with `>` after leading spaces. For itemless blocks, the header claims more than the code proves.**

What the code does:
- `extractRoundItemCites` (scripts/plan/verify-quotes.mjs:839-854) reads each line on its own. `CITE_HEAD_RE` (:834) needs `round N … item M` all on one line, and `CITE_TAIL_RE` (:836) is sticky to that line.
- `CITE_BLOCKQUOTE_LINE_RE` (:830) is `^\s*>`. It skips any line whose first non-blank character is `>`, not only a `> ` line.
- For a block with no item lines, `resolveRoundItem` (scripts/plan/rulingSet.mjs:92-97) proves the item exists in `state/questions/round-N.md`, not in the block.

Ordinary use reaches the wrapped case. Two real wrapped cites in the scan set are read by nothing:
- engine/ADMISSION-PREREGISTRATION.md:1086-1087 has "round 5" at the end of one line and "item 1" on the next.
- frontends/shell/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md:523-524 has "question round 17," and "item 1".

Both probably resolve, so nothing is wrong today. The claim is still untrue.

The claims:
- README, scripts/plan/README.md:381: "resolves every `round N, item M` cite in the files it scans".
- Workflow comment, .github/workflows/governance-ci.yml:34-35: "Every `round N, item M` cite outside backtick, double-quoted and `> ` text resolves". It also names no scan set and says "its archive" where the code reads every tracked archive.
- Step name, governance-ci.yml:151.
- Header, verify-quotes.mjs:113-115: the "Not read" list leaves out wrapped cites and gives `> ` where the code uses `^\s*>`.
- Header, verify-quotes.mjs:119: "proves EXISTENCE of the item in its block".
- The PR body's first sentence. I read the custodian's scratch draft, `pr-vqri-body-1.md`, not the live PR.

Replacement words (none are the human's):

**W1. verify-quotes.mjs header, the sentence at :113-115 that begins "Not read:"**
> Not read: inside an inline backtick span, inside a straight or curly double-quoted span on the same line, or on a line whose first non-blank character is `>`; fenced blocks are read. Each line is read on its own: a cite broken across a line break is not read, and a list is read only up to the break.

Clause check:
- Backtick and quoted spans are masked by `CITE_SKIP_SPAN_RES` (:832, :844).
- The `>` rule is `^\s*>` (:830, :842).
- Fenced blocks have no special case, so they are read.
- Lines are split at :841, and `CITE_HEAD_RE` matches within one line.
- `CITE_TAIL_RE` is sticky to the same line string (:849-850).

**W2. verify-quotes.mjs header, the clause at :118-119 that begins "and the check proves EXISTENCE"**
> and the check proves EXISTENCE of the item (in its block, or, for a block with no item lines, as a line of the round's tracked question file), not that the cite means what its sentence says.

Clause check:
- rulingSet.mjs:89-90 checks the block's own item lines.
- rulingSet.mjs:92-97 handles the itemless block with `questionFileHasItem`.
- verify-quotes.mjs:1006 reads the question file only when it is tracked.

**W3. README, :381. Replace the first sentence's "resolves every `round N, item M` cite in the files it scans" and the sentence "A cite inside a backtick span, a double-quoted span or a `> ` line is not read."**
> `verify-quotes.mjs` also resolves each `round N, item M` cite it reads in the files it scans against the ruling set (…unchanged…). … A cite inside a backtick span or a double-quoted span, or on a line whose first non-blank character is `>`, is not read; each line is read on its own, so a cite broken across a line break is not read, and a list is read only up to the break.

Clause check: as for W1. "In the files it scans" is `scanAbs` (:870, :1010).

**W4. Workflow comment, the sentence at :34-35**
> Every `round N, item M` cite that verify:quotes reads (in a file it scans, on one line, outside a backtick span, a double-quoted span and a line whose first non-blank character is `>`) resolves against the ruling set (DECISIONS-PENDING.md and each tracked archive), one file at a time: the item exists, not what the cite means.

Clause check:
- `scanAbs` (:1010).
- The line, span and `>` rules as in W1.
- `rulingFiles` (:423-425) is the live file plus every tracked archive.
- `resolveRoundItem` takes one text at a time (rulingSet.mjs:86-87).

**W5. Step name, :151. Replace "and every `round N, item M` cite resolves against the ruling set" with:**
> and every `round N, item M` cite it reads on one line resolves against the ruling set

Clause check: :1012-1016 and :1186. The words contain no colon-space and no " #", so the YAML plain scalar stays valid.

**W6. PR body, the first sentence**
> `verify-quotes` now checks that every `round N, item M` cite it reads in the claim files resolves against the ruling set; a cite broken across a line break, or in a backtick span, a double-quoted span or a line starting `>`, is not read.

Clause check: as for W1.

## E — Evidence

No blocking finding. The notes are at the end.

## D — Documentation (must be fixed before the merge, no re-gate)

**D-1. A false sentence about the code, in Amendment 2, item 1 (fourth sentence) and in the PR body ("Every two-argument call is unchanged").**

There were exactly two calls on main (scripts/plan/verify-test-claims.mjs:560 and :566 in the main checkout). Both now pass a third argument (head :551 and :557). Neither `resolveCitation` (:519) nor `resolveInText` (:511) is exported. So no two-argument call remains.

The property the sentence was meant to show is carried by U4, which S2 recorded at 85ac5d78 (step 4). Amendment 2 is append-only, so the fix is a row in S4. These are the custodian's words, not the human's.

- S4 row:
  > Amendment 2, item 1's fourth sentence is corrected: the only two calls of `resolveCitation`, both in `withdrawnRiders`, now pass the round-file reader, and neither it nor `resolveInText` is exported. The proof is `withdrawnRiders` in `scripts/plan/verify-test-claims.mjs` at H, and U4 at 85ac5d78 (S2's report, step 4).
- PR body, in place of that sentence:
  > Neither function is exported; their only two calls, both in `withdrawnRiders`, now pass the reader, and U4 holds.

**D-2. §7: an overrun by the letter of §7's own command, not recorded as class 8 (round 25, item 2 (a)).**

§7's command is `B...H`. Because main was merged in, it counts main's drift: S3's report gives 3,652 lines over 38 files. The PR body's "375 lines over 7 files" uses 49a7f532 in place of B; that figure is from the custodian's filing note on S3's report. The reviewer recomputes both. §7 is not edited.

S4 row (custodian's words). The reviewer fills both figures at H:
> budget overrun, §7 not edited. §7 declares 550 lines and 7 files; §7's own command at H gives 3,652 lines over 38 files, because B...H carries main's merges at c86b2c9c and 49a7f532; the same command over 49a7f532...H gives 375 lines over 7 files, the piece's own.

**D-3. Line cites in this piece's records: a §8.5 hit, and pins without a commit.**
- The S2 report (state/consults/2026-10-21-verify-quotes-round-item-cites-s2-worker-report.md:6 and :25) carries `state/cut-archive/DECISIONS-PENDING-2026-10-20.md:125`. Its :24 lists archive and live-file line numbers.
- The S1 report (:70) carries a bare `scripts/plan/verify-quotes.mjs:994`. That line was right at 81a287a6, but the code is at :1015 at H.
- The S3 report (:34) names "line 1176", which was right at 8e04dbe2 and is :1197 at H.

The reports are extractions filed byte for byte, so the fix is one row in S4:
> S2's report names archive and ledger lines as its instrument's output at 85ac5d78, S1's names a verify-quotes.mjs line at 81a287a6 and S3's at 8e04dbe2; none is a reference, and the record's reference to the round-72 block is Amendment 2, item 3.

## To the human (no replacement words)

**H-1. I4 (A): what "pinned instead" pins.**
- The human's words are at state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md:13.
- Amendment 3, item 1 records them as "a record cites that ruling by a hash pin".
- If the pin points into the archive, it conflicts with round 12, item 1's clause (a), with round 14's clause (a′) ("no ledger passage is pinned"), and with this form's own §8.5.
- A pin into the tracked `state/questions/round-72.md` item line would satisfy all three.
- The human should name the target, or state the exception. The words in the header (:122) and the README (:381) follow whatever the human rules.

## The six checks

1. **§2.3 against the real blocks, by round** (archive at H, the only archive; read with Grep):
   - The header grammar at rulingSet.mjs:43 covers every header that names a round: `— question round N` for rounds 1 to 46, 49 to 59, 61, 62, 65 and 68 to 70 (65 headers), `— question rounds 63 and 64`, `— question rounds 66 and 67`, and `— round 71 (`. That is 68 blocks, matching S2.
   - The one exception is round 72's header (archive :125), where the round sits in a parenthesis after "PR #217". That is I4.
   - The live file's 11 headers name no round.
   - The item grammar at rulingSet.mjs:45 matches the `- *Item M —` and `- **Item M` lines in every round block. That includes forms such as `- **Item 1, OPEN-1:**` and `- **Item 1** (MP-1`.
   - Every item-like line that does not match sits in a block with no round: archive :186, 296, 308, 326-327, 350-353, 364, 370-371, 482, 683, 777-779, 952, 1252-1259, 1323-1325, 1848, 1861, 1918 and 3398.
   - Non-header `**` boundaries (for example :950, :1602) cut off no item line of a round block.
   - The boundary rule (:47) and the question-file rule (:49) match §2.3 (ii) and (iv).

2. **The OPEN rulings and I4 (A) as applied:**
   - OPEN-1 (A): the three skip kinds; F5 and entries are not read.
   - OPEN-2 (B): both tools call `resolveRoundItem`.
   - OPEN-3 (A): no attribution code.
   - OPEN-4 (A): `defaultScanFiles` is `claimFiles` (:410-412), or exactly the explicit files.
   - OPEN-5 (A): no cite baseline route; `citeEntries` appears in no code.
   - OPEN-6 (A): the `paths:` lists at :81-96 and :98-113 are byte-equal to main's :79-94 and :96-111. The existing comment at :70-78 already discloses that a ledger-only edit leaves the job unrun.
   - OPEN-7 (A): rulingSet.mjs:92-97, with tracked-only reads at verify-quotes.mjs:1006 and verify-test-claims.mjs:490-494.
   - I4 (A): a round-72 cite gets the `no RULED block` reason (rulingSet.mjs:101) and fails by name. S3's header (:119-123) and README (:381) name the block. See H-1.

3. **§2.9's seam:**
   - `resolveRoundItem(texts, round, item, roundFileText)` (rulingSet.mjs:84) is the only new export.
   - Caller 1: verify-quotes reads the `rulingFiles` paths into `string[]` (:1014) and calls it at :1015.
   - Caller 2: verify-test-claims' `ledgerRoundItemResolves` (:497-499) keeps its name and position and wraps the single text it is given in an array. `loadDecisionsPending` still returns `string[]` (:481-486).
   - End-to-end tests from the real shape: Q12 (verify-quotes.test.mjs:1123, the real CLI), Q13 and Q14 (:1131, :1146, the real ruling set), and C1 (verify-test-claims.test.mjs:1692, through `runVerifyTestClaims`).

4. **S1's third parameter.** It is within the form, and it is not C, E, class 5 or class 9:
   - §2.6 also requires that "`withdrawnRiders` binds the round-file reader". Without module state, that cannot reach `ledgerRoundItemResolves` while `resolveCitation`'s parameters stay unchanged, so §2.6 contradicts itself.
   - The optional, module-private parameter is the smallest change. U4 is identical (S2, step 4).
   - It stays recorded under Amendment 2's class 1. The only defect is the sentence in D-1.

5. **S3's words, clause by clause:**
   - Header :104-123: the grammar, set, boundary, item, fallback, scan-set, FAIL-line and no-baseline clauses match :830-854, :1010-1016, :1197 and rulingSet.mjs:43-101. The exceptions are the `> ` clause, the missing wrapped-cite clause and "in its block" (C-1, W1 and W2).
   - README :381: correct except the "every" claim and the `> ` claim (W3).
   - Workflow :34-35 and :151: as C-1 (W4 and W5).

6. **§8, item by item:**
   1. U1 to U4 hold by S2's record at 85ac5d78. S3 changed only comments and docs in the code files; the reviewer recomputes at H.
   2. No cite baseline route.
   3. The reasons state what the resolver found (rulingSet.mjs:91-101). See note N-2.
   4. The form's five cites outside backticks (:6, :91, :159, :160, :169) are rounds 12, 11, 46 and 25 by item. They resolve per S2's P4 and S3's 0 ruling-cite errors at H.
   5. Hit in the step reports (D-3).
   6. Seven paths, all within §9 rule (00); nothing under `protocol/`; no governing doc.
   7. Q1 to Q11's header, item and bullet lines are byte-copied by script from 40b04b46 (verify-quotes.test.mjs:1009-1024). See note N-3.
   8. `resolveRoundItem` has two product callers.
   9. Tool claims name their commits (Amendment 2: 81a287a6 and 85ac5d78). No hash reference was added.
   10. No mutation is recorded as observed by verify-mutation (S1 report :43; test comment :1003-1006).
   11. `paths:` unchanged.

## Notes (none block)

- **N-1:** In verify-test-claims, the round-file reader path (`trackedRoundFileText`, :488-494, bound at :551 and :557) has no test. C1 covers bold item lines only, so passing null there would survive the suite. §4 declares C1 alone and U4 holds. A one-test follow-on is advised.
- **N-2:** For round 72, the reason "no RULED block for question round 72 in any file of the ruling set" is literally untrue. A block exists that the grammar does not read. The text is §2.5's, Q3 asserts it, and changing it is a code change. The header discloses it.
- **N-3:** Q7's `state/questions/round-12.md` (verify-quotes.test.mjs:1081) is made up, but it copies the `M. ` grammar. It is not a header, item or bullet line, so §8.7 does not reach it.
- **N-4:** "THE ONE UNREAD BLOCK" (header :119) is true at H. It describes the ledger's state, which a later header could change.
