*Custodian's filing note (2026-10-22): #242's gate 1 architect, resumed on the custodian's message to reconcile its W1 to W6 with the reviewer's D-1 to D-3 into one set of words (the form's Amendment 4, item 3); read only at b08a1fec. The resumed run 13:38:27Z to 13:58:20Z by its transcript (Read 1, Grep 1; no Write, Edit or Bash). None of these words is the human's; a worker applies sections 1 to 4 with no re-gate, and the custodian sections 5 and 6 in the PR body. Extracted by script from the run's second SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 8352a124402a9f9d52e6ea4a0d2457768c77beb80a8c9926b74e3dd615e41a35.*

---

Reconciled: PR #242 gate 1 words, at b08a1fec

Reviewed: PR #242 at b08a1fec4e3405153b4998882427355fa18db319, gate 1, architect (words reconciled) — cut/verify-quotes-round-item-cites @ b08a1fec4e3405153b4998882427355fa18db319

I merged the reviewer's D-1 to D-3 (filed under `state/consults/gates/`) with my W1 to W6 into one set of words. Each true fact from either gate is kept, including the reviewer's probe that a number after a list is read as an item (`items 1 and 2, 15 tests` is read as item 15). I added nothing that neither gate checked. Two of my wordings replace the reviewer's because they are more exact: "each tracked archive" instead of "its archive", and "pair left to right" instead of "pairs with the next one". Both are checked below.

None of these sentences is the human's wording. The worker applies them with no re-gate (§9; the 2026-10-11 directive, item 2), and the PR body lists them. This report sits outside `gates/`, so it cites lines in words, not as `path:line` tokens.

## 1. `scripts/plan/verify-quotes.mjs`, the header: lines 113 to 123 at b08a1fec

This covers both of the header's sentences, plus the sentence about the unread block that follows them.

Current lines 113 to 123, byte-copied:
```
// byte that is not a letter or digit (so a directive item such as `item 2e` is out). Not read: inside an
// inline backtick span, inside a straight or curly double-quoted span on the same line, or on a `> ` line;
// fenced blocks are read. The scan set is the quote pass's own (claimFiles, or exactly the explicit files).
// A failure prints `FAIL — ruling cite: <file>:<line> — <cite> — <reason>` and exits 1; no baseline route
// exists for it. DISCLOSED GAPS: a sub-clause cite (`item 2(b)`), an entry cite, a clause cite, a directive
// item (`…, item 2e`), a bare round, and a cite in a file outside the scan set are not checked; and the
// check proves EXISTENCE of the item in its block, not that the cite means what its sentence says. THE ONE
// UNREAD BLOCK: the RULED header for question round 72, in the 2026-10-20 archive, names its round outside
// the header grammar (in a trailing parenthesis, after the PR), so no cite to it resolves -- a cite to round
// 72 by item is refused by name, and a record cites that ruling by a hash pin instead (the form's
// Amendment 3, item 1).
```

Replace them with these lines (the first and the ninth are unchanged):
```
// byte that is not a letter or digit (so a directive item such as `item 2e` is out). Not read: inside an
// inline backtick span; inside a straight or curly double-quoted span on the same line (straight `"` marks
// pair left to right on their line, so an unpaired `"`, such as an inch mark, hides any cite up to the next
// `"`); or on a line whose first non-blank character is `>`; fenced blocks are read. Each line is read on
// its own: a cite broken across a line break is not read, and a list is read only up to the break. A list
// reads each `, K`, `, and K`, `and K` or `to K` that directly follows it on the line, so a number after
// a list (`items 1 and 2, 15 tests` reads item 15) is resolved as an item. The scan set is the quote
// pass's own (claimFiles, or exactly the explicit files).
// A failure prints `FAIL — ruling cite: <file>:<line> — <cite> — <reason>` and exits 1; no baseline route
// exists for it. DISCLOSED GAPS: a sub-clause letter (the `(b)` of `item 2(b)`, whose item 2 is checked),
// an entry cite, a clause cite, a directive item (`…, item 2e`), a bare round, a `rounds N and M, items …`
// list, and a cite in a file outside the scan set are not checked; and the check proves EXISTENCE of the
// item -- in its block, or, for a block with no item lines, as a line starting `M. ` in the tracked
// state/questions/round-N.md -- not that the cite means what its sentence says. THE ONE UNREAD BLOCK: the
// RULED header for question round 72, in the 2026-10-20 archive, names its round outside the header grammar
// (in a trailing parenthesis, after the PR), so no cite to it resolves -- a cite to round 72 by item is
// refused by name, and a record cites that ruling by a hash pin instead (the form's Amendment 3, item 1).
```

Each clause, checked against the code at b08a1fec (line numbers are in verify-quotes.mjs unless named):
- **Backtick spans** are masked by the first pattern of `CITE_SKIP_SPAN_RES` (line 832), applied at line 844.
- **Straight and curly double quotes** are masked by `/"[^"\n]*"/g` and `/“[^”\n]*”/g` (line 832).
- **Left-to-right pairing.** A global regex takes the leftmost `"` and the next `"` on the same line (`[^"\n]`), then starts again after that. So an unpaired `"` masks everything up to the next one. The reviewer's odd-quote probe found 0 cites.
- **`>` lines.** `CITE_BLOCKQUOTE_LINE_RE = /^\s*>/` (line 830) is applied at line 842. The reviewer's `>round` probe and indented probe both found 0 cites. 4 real cites on indented `>` lines are skipped (reviewer's D-1).
- **Fenced blocks.** `extractRoundItemCites` (lines 839 to 854) has no fence case, so they are read.
- **Each line on its own.** The text is split at line 841. `CITE_HEAD_RE` (line 834) needs `round N`, the item word and `M` within one line string. Two real wrapped cites are not read: lines 1086 and 1087 of `engine/ADMISSION-PREREGISTRATION.md`, and lines 523 and 524 of `frontends/shell/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md`.
- **A list is read only up to the break.** `CITE_TAIL_RE` (line 836) is sticky (`/y`) on the same line string (lines 849 and 850).
- **A list reads what directly follows it.** The tail patterns are `,\s*(?:and\s+)?K`, `\s+and\s+K` and `\s+to\s+K`. Because the regex is sticky, each must follow directly. The reviewer's probe read `items 1 and 2, 15 tests` as item 15.
- **"Resolved as an item".** Each tail number becomes a cite (line 850) and goes through `resolveRoundItem` (line 1015).
- **Scan set.** `scanAbs` (line 870), used at line 1010. This is unchanged.
- **Sub-clause letter.** `CITE_HEAD_RE` ends with `(?![0-9A-Za-z])`, and `(` passes that check. The reviewer's `item 99(b)` probe produced a finding on item 99.
- **`item 2e` is excluded.** The same lookahead rejects it. Q11 asserts 7 cites checked.
- **Plural rounds are not read.** `\bround\s+` cannot match `rounds 12`. The reviewer's probe found 0 cites.
- **Existence, in its block.** In `scripts/plan/rulingSet.mjs` at b08a1fec, lines 89 and 90 check the block's own items.
- **Existence, itemless block.** In the same file, lines 92 to 97 use `questionFileHasItem` with `QUESTION_FILE_ITEM_RE = /^(\d+)\. /` (line 49). The file is read only when tracked (verify-quotes.mjs line 1006).
- **Round 72.** The text is unchanged. `RULED_BLOCK_HEADER_RE` (rulingSet.mjs line 43) does not match the archive header that names round 72 only in a parenthesis after "PR #217". The cite gets the `no RULED block` reason (rulingSet.mjs line 101). The reviewer's probe confirmed it is refused by name.

**H-1.** The last sentence holds under either answer, because it does not say where the pin points. If the human rules that the pin targets the question file, append ", at the round's tracked state/questions/round-72.md" before " (the form's". If the human rules that it points into the archive, append ", into the archive by the human's named exception" in the same place. Nothing else changes.

## 2. `scripts/plan/README.md`, line 381 at b08a1fec (the README's sentences)

Current line, byte-copied:
```
`verify-quotes.mjs` also resolves every `round N, item M` cite in the files it scans against the ruling set (the live `DECISIONS-PENDING.md` and each tracked `state/cut-archive/DECISIONS-PENDING-*.md`), one file at a time, and fails by name (`FAIL — ruling cite: <file>:<line> — <cite> — <reason>`) on one that does not resolve. The resolver is `resolveRoundItem(texts, round, item, roundFileText)` in `scripts/plan/rulingSet.mjs`, shared with `verify-test-claims.mjs`' `ledgerRoundItemResolves`. A cite inside a backtick span, a double-quoted span or a `> ` line is not read. Not checked: sub-clauses, entries, clause cites, directive items, files outside the scan set; it proves the item exists, not what the cite means. One block is unread: the RULED header for question round 72 (2026-10-20 archive) names its round outside the header grammar, so a cite to it by item is refused by name, and a record cites that ruling by a hash pin. The header of `verify-quotes.mjs` carries the full grammar.
```

Replacement line:
```
`verify-quotes.mjs` also resolves each `round N, item M` cite it reads in the files it scans against the ruling set (the live `DECISIONS-PENDING.md` and each tracked `state/cut-archive/DECISIONS-PENDING-*.md`), one file at a time, and fails by name (`FAIL — ruling cite: <file>:<line> — <cite> — <reason>`) on one that does not resolve. The resolver is `resolveRoundItem(texts, round, item, roundFileText)` in `scripts/plan/rulingSet.mjs`, shared with `verify-test-claims.mjs`' `ledgerRoundItemResolves`. A cite inside a backtick span or a double-quoted span (straight `"` marks pair left to right on their line, so an unpaired `"` hides any cite up to the next one), or on a line whose first non-blank character is `>`, is not read; each line is read on its own, so a cite broken across a line break is not read, and a list is read only up to the break. Not checked: sub-clause letters (the item before one is checked), entries, clause cites, directive items, `rounds N and M, items …` lists, files outside the scan set; it proves the item exists (in its block, or, for a block with no item lines, in the round's tracked question file), not what the cite means. One block is unread: the RULED header for question round 72 (2026-10-20 archive) names its round outside the header grammar, so a cite to it by item is refused by name, and a record cites that ruling by a hash pin. The header of `verify-quotes.mjs` carries the full grammar.
```

Clause check:
- **"each … cite it reads in the files it scans"** is lines 1010 to 1016.
- **The ruling set** is `rulingFiles` (lines 423 to 425): the live file plus every tracked archive, filtered by `index.set`.
- **"one file at a time"**: `resolveRoundItem` loops over `texts`, and `rulingBlocks` parses one text at a time (rulingSet.mjs lines 86 and 87). The reviewer re-observed MQ9.
- **The FAIL line** is printed at line 1197, and exit code 1 is set at line 1198.
- **The resolver's name, signature and sharing** are at rulingSet.mjs line 84, with callers at verify-quotes.mjs line 1015 and verify-test-claims.mjs line 498.
- **Spans, `>` lines, line breaks and the list break**: as in section 1.
- **Sub-clause letters, `item 2e` and plural rounds**: as in section 1.
- **Existence**: as in section 1.
- **Round 72**: as in section 1, with the same H-1 note. If the human rules, append the same clause before the full stop of "by a hash pin".

## 3. `.github/workflows/governance-ci.yml`, the green-run comment: lines 34 and 35 at b08a1fec

Current lines, byte-copied:
```
# that cannot be fixed in place). Every `round N, item M` cite outside backtick, double-quoted and `> ` text resolves
# against the ruling set (DECISIONS-PENDING.md and its archive), one file at a time: the item exists, not what the cite means.
```

Replacement lines. Line 36 onward is unchanged.
```
# that cannot be fixed in place). Every `round N, item M` cite that verify:quotes reads (in a file it scans,
# on one line, outside backtick spans, double-quoted spans and lines whose first non-blank character is `>`)
# resolves against the ruling set (DECISIONS-PENDING.md and each tracked archive), one file at a time: the item
# exists, not what the cite means (verify-quotes.mjs's header lists the forms not read).
```

Clause check:
- **"in a file it scans"** is `scanAbs` (line 1010).
- **"on one line"** and the spans and `>` lines: as in section 1.
- **"each tracked archive"** is `rulingFiles` (lines 423 to 425).
- **"one file at a time"**: as in section 2.
- **"the item exists, not what the cite means"** is the existence clause in section 1.
- **"the header lists the forms not read"** is true once section 1's words are applied.

These are comment lines, so YAML scalar rules do not apply.

## 4. The step name: line 151 at b08a1fec

Current line, byte-copied:
```
      - name: verify:quotes (a passage marked verbatim occurs in its named file when a path:line cite introduces it, otherwise in the tracked tree's non-quotation text, after presentation normalization, and every path:a-b @ rev sha256:hex reference recomputes, and every `round N, item M` cite resolves against the ruling set; recorded baseline entries advisory)
```

Replacement line:
```
      - name: verify:quotes (a passage marked verbatim occurs in its named file when a path:line cite introduces it, otherwise in the tracked tree's non-quotation text, after presentation normalization, and every path:a-b @ rev sha256:hex reference recomputes, and every `round N, item M` cite it reads on one line resolves against the ruling set; recorded baseline entries advisory)
```

Clause check:
- **"it reads"** is the output of `extractRoundItemCites`.
- **"on one line"**: as in section 1.
- **"resolves"**: the PASS condition at line 1186 includes `citeFindings.length === 0`.

YAML: the value is still a plain scalar. After the key's colon-space, it contains no other colon followed by a space; `verify:quotes`, `path:line`, `path:a-b` and `sha256:hex` all have no space after the colon. It contains no " #", and it does not start with an indicator character.

## 5. The PR body, first sentence

This is the custodian's scratch draft `pr-vqri-body-1.md`, line 3. The current sentence, byte-copied:
```
`verify-quotes` now checks that every `round N, item M` cite in the claim files resolves against the ruling set.
```

Replacement:
```
`verify-quotes` now checks that every `round N, item M` cite it reads in the claim files resolves against the ruling set; a cite broken across a line break, in a backtick span or a double-quoted span, or on a line whose first non-blank character is `>`, is not read (the header of `verify-quotes.mjs` lists every form not read).
```

Clause check: as in sections 1 and 2. "The claim files" is `claimFiles` (the default branch of `scanAbs`, line 870).

## 6. Carried over unchanged: the PR body's two-argument sentence

This is from my gate 1 report's D-1. The reviewer agrees on the facts in their "item 8" section.

Current sentence, byte-copied from the draft's line 10:
```
Every two-argument call is unchanged, and U4 holds.
```

Replacement:
```
Neither function is exported; their only two calls, both in `withdrawnRiders`, now pass the reader, and U4 holds.
```

Clause check:
- In `scripts/plan/verify-test-claims.mjs` at b08a1fec, there is no `export` on `resolveInText` (line 511) or `resolveCitation` (line 519).
- The only call sites are lines 551 and 557, and both pass `(r) => trackedRoundFileText(root, r)`. The only call to `resolveInText` is at line 520.
- U4: S2's report, step 4, at 85ac5d78, and the reviewer's U4 check at b08a1fec (`cmp` rc=0).

## Not in these words

- **E-1** (C2 and MC2) and **U6's count of 16** are code and records under the form's Amendment 4, not wording.
- **The round-72 reason text** stays as §2.5's code output. Both gates noted it, and neither gave words for it.
