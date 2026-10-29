# verify-quotes resolves round + item cites — full form (PLAN node verify-quotes-round-item-cites)

File: scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md

Authority:
- round 12, item 1: its Applied text owes the checker's resolution of round + item cites as a follow-on;
- entry 104, mechanism (a);
- placed by `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:15` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:899864444f78d8b1155f37e7478adc392a16c64a698ec8836c43cad900ca50fe (item 5: the governance lane after D, 1 of 3);
- governance C's rows L1541 and E104 (`state/drafts/decisions-pending-c-obligations.md:58` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:7df1009b219c77c73916e599d87d77af55a388030a9dd428b4ac46b0f7a489a4; `state/drafts/decisions-pending-c-obligations.md:385` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:488af3bfddc5171d6e5846da77a20cfb4a5727875047c0618e220fdce0de1917);
- C's gate 1 architect finding D-3 (`state/consults/gates/2026-10-20-governance-decisions-pending-open-and-archive-gate1-architect.md:42-49` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:b3917d20875ab2e53535efcf38236e51e5f91a8d08cd236f209220713eab9269).

Drafted by: the architect agent on the custodian's brief, read at main 40b04b46.

Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

Form: full. The reasons are §21a by §21c's size, and, under OPEN-2 (B), a property currently under test. §25 (e) applies.

## §0. Disclosure

0.1 Read at 40b04b46:
- the PLAN node (`PLAN.yaml:5513-5529` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:1a717db24f3a0e0c55304eef9bbf7195a269c6a658af8c07599796788e2e49ec);
- round 12's RULED block, item 1, and entry 104 (both in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`, found by round and by entry);
- `state/questions/round-12.md:3` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:8c70572216c53b355bd2e89465a7a58f2dc914006c9517f177fd6de6cd5aad83;
- `scripts/plan/verify-quotes.mjs` whole, and its test's names and its ruling-set tests (`scripts/plan/verify-quotes.test.mjs:971-1001` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:21acf69a19101afb5c0cb624e9537c76aa2764bb7b7ea2982ec3954f04f35dc0);
- `scripts/plan/verify-quotes.baseline.json` (30 `entries`, 2 `hashEntries`);
- `scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md` and its Amendments 1 to 11;
- `scripts/plan/rulingSet.mjs` whole;
- `scripts/plan/verify-test-claims.mjs:475-570` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:853c6ad548da8dd01f8e4e6d499f83f78e17e97e67c665ddf84e8583dbff2b4b and `scripts/plan/verify-test-claims.mjs:741-748` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:3dc91789d21b53658003ec0d82057135bc45e5789b317fe20dc02f1f36e7a5a5;
- `scripts/plan/verify.mjs:143-165` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:bc5a4c686c13a9a67e52902aa63e85b9a2cd9f246904aa04452d10caebe65749;
- `scripts/plan/rotate-decisions-pending.test.mjs:263-295` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:9f3c687221ff114e0e5220de7b433490de233a6b1c33fe026b13b24e488b8410;
- `.github/workflows/governance-ci.yml`;
- `AUTONOMY.md` §6a, §21, §25 and :609;
- `docs/PREREGISTRATION-TEMPLATE.md` whole.

0.2 **Reuse.** The prior art in the tree is `ledgerRoundItemResolves` and `resolveCitation` (`scripts/plan/verify-test-claims.mjs:488-530` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:a87c5ad4f389957cfba26afcd241b98f0d100d916fc12ff4f381939d938fed89), with `readRulingSet` (`scripts/plan/rulingSet.mjs:30-38` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:e7e6dc2bc415615fc509d6c884f1315b55810e083ca49e2f0aee32b60e40cb62). The reuse index records no prior art. Its output, as the brief carries it:

```text
$ node tools/reuse.mjs quote checker
No prior art recorded for "quote checker". Research it before planning an implementation.
$ node tools/reuse.mjs citation resolver
No prior art recorded for "citation resolver". Research it before planning an implementation.
$ node tools/reuse.mjs round item cite
No prior art recorded for "round item cite". Research it before planning an implementation.
```

0.3 **The tree as found (tool claims at 40b04b46, round 15 (c)).**
- verify-quotes has no round + item resolution.
- verify-test-claims resolves `round N, item M` and `entry K` only in withdrawn-test riders (`scripts/plan/verify-test-claims.mjs:555-570` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:ccb3a76517db5de4f5d412e06f7588ad8ed7873d1e9f55774af0fb6529a52b88).
- verify.mjs does a substring search of `verdict.cite` (`scripts/plan/verify.mjs:159-164` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:f19eb6f1a9e7f4a6cfcd3e824ba9ec33444cccb219192985e2e1ec27d3c6c8ff), which is not a resolution of round + item.

0.4 **Survey of the citing side.**
- Tool: the Grep tool (ripgrep, which respects `.gitignore`) over the working tree at 40b04b46, case-insensitive, counting matching lines.
- Glob: `{**/*PREREGISTRATION*.md,docs/adr/*.md}`, which is verify-quotes' `claimFiles` set and includes the template (`scripts/plan/verify-test-claims.mjs:746-748` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:7412016b5b48773dc4380b5aa8c1da1fd9dfe63a9f187dcdea21128c55894660). The search listed the working tree, not `git ls-files`, so S2 re-derives every figure against the tracked index.

| Form | Pattern | Lines / files |
|---|---|---|
| F1 | `\bround \d+, item \d+` | 585 / 99 preregistrations; 8 / 4 ADRs |
| F2 | `\bround \d+ item \d+` (no comma) | 84 / 22 (16 in ADR-034 and ADR-035) |
| F3 | `\brounds? \d+, items \d+` (lists) | 31 / 14 |
| F4 | F1 followed by a sub-clause `(x)` | 170 / 66 (a subset of F1) |
| F5 | `\bround \d+ \([a-g]′?\)` (a clause of a round's adopted text, no item) | 105 / 46 |
| F6 | `\bentry \d+\b` | 231 / 60 |
| F7 | `RULED <date>,? (question )?round N` | 17 / 12 |

- Outside the set, `round \d+,? items? \d+` matches AUTONOMY.md 20 lines, AI_DEVELOPMENT.md 9, and `.claude/agents/` architect, reviewer and worker 2 each.
- Rounds 41 to 70 cited by item: 126 lines in 27 files.
- Cites by item to rounds whose header the existing pattern misses: 5 lines. These are `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:851` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:ac0862ab3082eb779054de549ce0cad8d49aed2fb66b70ca4875d5efec596ffd, `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:5` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:e3116e215b30cb370e15d43e3a4a802bb4fbed7214838c35349048ace9189f98, `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:377` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:eaa796745f99f2720cfd23926fcd38350922565b206454b5a7073733bd27bc5b, `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:5` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:94120f2d7dfdfcc3d36e073caa4ec14f251f2270bcd74c797ee146f81c851695 and `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:125` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:731f005a95ef7d1e1b62f2106a655badc7edf69264a3d0ce888a39c076e5a7c6.
- Deliberately unresolvable fixture cites, inside backtick spans: `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md:76` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:9b296c769b92e1674243fd34a43c33f752c572ea657488fa10579522e2b79c0f and `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md:83` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:6a5af176209bce36882c29f30b466b82d0f3fca47cb5b313224efd0ec5d46e98.
- No cite by item to rounds 47, 48, 60, 71 or 72 and above was found.

0.5 **Survey of the target side.** Same tool, over `DECISIONS-PENDING.md` and `state/cut-archive/`.
- RULED headers: 185 in the archive, 6 in the live file. None of the live file's 6 names a question round.
- Header forms that name rounds:
  - `— question round N` (the common form);
  - `— question rounds N and M` (rounds 63 and 64, 66 and 67);
  - `— round 71`, without "question".
- Item-line forms in the archive: `- *Item M —` (125 lines) and `- **Item M` (63 lines, round 41 onward). The live file has none.
- By my reading of the archive's bullet heads, these blocks carry no item line at all: rounds 32, 47, 48, 53 to 58, 63 to 71. They are keyed by OPEN labels, by `G1` to `G3`, or by `The ruling(s)` alone.
- Each round from 1 to 73 has a tracked `state/questions/round-N.md`. In the mirror-hook format, items are lines starting `M. ` (for example `state/questions/round-66.md:12` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:d11a1a2d613753f72fd2725df8c26975cfc74194bccf0aa38d20eff1d9a8b6bf).

0.6 Not a measurement piece; no fixture drive.

## §1. May and may not claim

**May claim:**
- each in-scope cite (§2.1) in the scan set (§2.4) resolves, as §2.3 defines, against the ruling set, one file at a time;
- an unresolved cite fails the check by name;
- every quote and hash result is unchanged (§5).

**May not claim:**
- that the cited ruling says what the citing sentence says (the gate reads that; round 11, item 2's floor clause stands for this pass too);
- that a sub-clause letter `(x)` exists;
- anything about clause cites (F5), entry cites (F6), bare rounds, directive items (`…, item 2e`), or files outside §2.4, unless OPEN-1 or OPEN-4 widens the scope;
- attribution of quotes (OPEN-3);
- any performance figure.

No ADR, security, wire or guarantee of the product is touched. No app string is touched.

## §2. The change

2.1 **The cite grammar (OPEN-1 (A)).**
- The forms read:
  - `round N, item M` or `round N item M`, optionally preceded by `question `, case-insensitive;
  - lists `items M, K and L`;
  - ranges `items M to K`, whose two endpoints are resolved;
  - a trailing `(x)`, which is read and not resolved.
- M must be followed by a byte that is not a letter or digit, so a directive item such as `item 2e` is out.
- Not read:
  - inside an inline backtick span;
  - inside a straight or curly double-quoted span on the same line;
  - on a `> ` blockquote line.
- Fenced blocks are read.

2.2 **The target.**
- The ruling set: `rulingSetPaths` over the tracked index (`scripts/plan/rulingSet.mjs:16-18` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:adac459051a971ff91026d927d8a10d77e40e9032564dad9778f7075a94a5cf3), which is the live `DECISIONS-PENDING.md` and then each tracked `state/cut-archive/DECISIONS-PENDING-*.md`. verify-quotes already lists it as `rulingFiles` (`scripts/plan/verify-quotes.mjs:402-404` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:241990b9e357a32e612eb06b4d580997ce094c33a35974e73a53784ae8487a48).
- For an itemless block only, the tracked `state/questions/round-N.md` (OPEN-7 (A)).
- The set is indexed once per run: each file maps a round to its block's item set, or to "itemless".

2.3 **What resolves.** One file at a time, nothing joined across files:
- (i) A header line: it starts `**RULED <yyyy-mm-dd>`, then an optional parenthetical, then ` — `, then an optional `question `, then `round N`, or `rounds N and M` with the cited round equal to N or M.
- (ii) The block runs from the header's next line to the line before the next line starting `**` or `## `. This is the boundary at `scripts/plan/verify-test-claims.mjs:493` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:9ab181fc696769390b92e39a62502a788e9ecf67efeddf194565baa6bbf4abc5.
- (iii) If the block has at least one item line (`- *Item M` or `- **Item M`), the cite resolves when item M is among them.
- (iv) If the block has none, the cite resolves when `state/questions/round-N.md` is tracked and has a line starting `M. `.
- A cite resolves when some file of the set resolves it.

2.4 **The scan set (OPEN-4 (A)).** The same files as the quote pass: `claimFiles` by default, or exactly the explicit `files` when given.

2.5 **Findings.**
- A new gated array, `citeFindings: [{relPath, line, cite, reason}]`. Each reason states an engine fact:
  - `no RULED block for question round N in any file of the ruling set`;
  - `question round N's RULED block has no item M`;
  - `question round N's RULED block has no item lines, and state/questions/round-N.md has no item M`, or `… is not tracked`.
- `main()` prints `FAIL — ruling cite: <file>:<line> — <cite> — <reason>` and exits 1.
- The PASS line gains `, C ruling cites resolved, 0 ruling-cite errors`. No consumer parses that line: Grep finds `runVerifyQuotes` imported only by the verify-quotes tests and `scripts/plan/rotate-decisions-pending.test.mjs:19` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:c2fdd4fa0acf9114c387fa49ecc4dafbbb4fa6484cdb0b1453a6fc3948af0c99.

2.6 **The shared resolver (OPEN-2 (B)).**
- `scripts/plan/rulingSet.mjs` gains, appended at its end, one export: `resolveRoundItem(texts, round, item, roundFileText)` returning `{ ok: true }` or `{ ok: false, reason }`. It takes `texts: string[]`, the shape both callers actually hold:
  - verify-test-claims' `loadDecisionsPending` returns `string[]` (`scripts/plan/verify-test-claims.mjs:481-486` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:ec66d0d1c085139770283f3bd9cab1b8e43464a1f659508d20227b2af0403d4f);
  - verify-quotes reads the `rulingFiles` paths.
- `roundFileText` is the tracked round file's text, or null. Each caller reads it.
- Callers:
  - verify-quotes' new pass;
  - verify-test-claims' `ledgerRoundItemResolves`, which keeps its name and position and delegates to it. `withdrawnRiders` binds the round-file reader, since it holds `root` (`scripts/plan/verify-test-claims.mjs:555-570` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:ccb3a76517db5de4f5d412e06f7588ad8ed7873d1e9f55774af0fb6529a52b88).
- `ledgerEntryResolves`, `CITATION_RE`, `resolveCitation`'s signature and the `CITATION_EXACT_RE` row grammar are unchanged.

2.7 **Unchanged:** quote extraction, the haystack, baseline matching, the hash grammar and check, `--show-cites`, the CLI arguments, `verify-quotes.baseline.json`, `site.mjs`, the health strip and the CI `paths:` filter (OPEN-6 (A)). No cite baseline route lands unless OPEN-5 (A) rules entries: a route with no entry has no product caller.

2.8 **Docs.**
- `verify-quotes.mjs`'s header gains one paragraph, "ROUND + ITEM CITES": §2.1 to §2.4 and the disclosed gaps (sub-clauses, entries, clause cites, directive items, files outside the set, existence not meaning).
- `scripts/plan/README.md` gains one section, appended at its end: `## verify-quotes.mjs — round + item cites`, naming the shared resolver.
- `governance-ci.yml`'s step name (its line 149 at 40b04b46) and its green-run comment (its lines 20 to 47 at 40b04b46) each gain one clause.
- No governing doc is edited.

2.9 **The seam (the actual interfaces, read).** `rulingSetPaths(tracked)`, `readRulingSet(repoRoot, tracked)` and `LIVE_RULINGS` (`scripts/plan/rulingSet.mjs:11-38` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:9b4413626b10b3bc6279c53c12fc936d8ef7a26290fadb00649141a23debb08e); `rulingFiles(root, index)` (`scripts/plan/verify-quotes.mjs:402-404` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:241990b9e357a32e612eb06b4d580997ce094c33a35974e73a53784ae8487a48); `resolveCitation(texts, citationText)` (`scripts/plan/verify-test-claims.mjs:528-530` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:fb4bee4a1943271f2add53a33e51d5530f2540e9645c315e6891399fd0d1fc8e). The end-to-end proofs from the real shape are Q12 and Q13.

## §3. Fixtures

- Q1 to Q11 build `gitTree` fixtures. Their header, item and bullet lines copy the grammar of named real blocks:
  - round 12, item 1's line (single asterisk);
  - round 46, item 1's line (bold);
  - the header and first bullet of the rounds 66 and 67 block;
  - `state/questions/round-66.md`'s item heads.
  The worker locates each by its round with `git show 40b04b46:state/cut-archive/DECISIONS-PENDING-2026-10-20.md`, never by a line number.
- Every fixture cite that must not resolve sits in backticks in this form.
- Q12 to Q14 use `byteCopiedLine('40b04b46', …)` and `fixtureFile` (`scripts/plan/verify-quotes.test.mjs:821-836` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:874cf3c8ea6018be897c22aa8d7ad6715bc957fad456026300695914b95fff9d) against REPO_ROOT.

## §4. Tests and mutations

New tests go in `scripts/plan/verify-quotes.test.mjs` unless named otherwise. A mutation is observed by applying it, running the named test, recording that test's failure by name with the commit id, and reverting it (round 25, item 2 (c)). No record calls a verify-mutation run an observation.

| Test | What it shows | Mutation |
|---|---|---|
| Q1 `verify-quotes: a round and item cite resolves against its RULED block's item line` | the cite resolves | MQ1: the item compared as M+1 |
| Q2 `verify-quotes: a cite naming an item its block lacks fails by name` | fails with `has no item 5` | MQ2: a header match resolves without an item check |
| Q3 `verify-quotes: a cite of a round with no RULED block fails by name` | fails by name | MQ3: no header found returns ok |
| Q4 `verify-quotes: a bold item line resolves` | the bold form resolves | MQ4: the item pattern takes one asterisk only |
| Q5 `verify-quotes: a plural round header with no item lines resolves its item in the round's question file` | cites the plural header's second round | MQ5: the plural header reads its first round only |
| Q6 `verify-quotes: an itemless block's cite fails by name when the question file lacks the item` | fails by name | MQ6: an itemless block resolves any item |
| Q7 `verify-quotes: a block with item lines is authoritative over the question file` | the block decides | MQ7: the question file consulted for every block |
| Q8 `verify-quotes: a cite resolves when its block is only in an archived ruling file` | the archive is read | MQ8: the live file read alone |
| Q9 `verify-quotes: a header in one ruling file and the item in another does not resolve` | nothing joined across files | MQ9: the set's texts joined before resolving |
| Q10 `verify-quotes: a cite inside a backtick span or a quoted span is not read` | 0 cites checked | MQ10: span stripping removed |
| Q11 `verify-quotes: list, range and no-comma forms resolve each named item` | each item resolved; `items 1 and 3` gives one finding naming item 3 | MQ11: a list reads its first number only |
| Q12 `verify-quotes: the CLI exits 1 and names an unresolvable ruling cite` | real repository, a fixture file citing `question round 19, item 9`; exit 1 and the FAIL line | MQ12: `main()` leaves `citeFindings` out of the exit condition |
| Q13 `verify-quotes: real record lines' round and item cites resolve against this repository's ruling set` | see below | MQ13: the question-file fallback removed |
| Q14 `verify-quotes: a real record line with an item past its round's last item fails by name` | ADR-035 :5 with round 19's item 1 replaced by item 9; one finding | MQ14: item lines read from the whole file, not the block |
| C1 `verify-test-claims: a withdrawn-test row whose ruling cites a round with bold item lines resolves` | in `scripts/plan/verify-test-claims.test.mjs`; accepted | MC1: verify-test-claims keeps its own single-asterisk pattern |

Q13 byte-copies these lines at 40b04b46 and makes a positive count assertion per line:
- `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:5` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:e3116e215b30cb370e15d43e3a4a802bb4fbed7214838c35349048ace9189f98: 1 cite;
- `tools/mods/GUARDIAN-V0-PREREGISTRATION.md:553` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:199540c0e77db203879991212c18be3129c75b47a675fd4dec452b3a89ab51de: 2 cites;
- `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:5` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:d0cbaaa06296e0b13646e9d72a8a9e12d912d265587c70672f68b5ff56a6d6c0: 5 cites;
- `scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md:120` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:f9f54385750da73fa15ff19ce1daf91e947e344b06b48c5493630d19195f74e7: 4 cites;
and then asserts `citeFindings` is empty.

`scripts/plan/rotate-decisions-pending.test.mjs`'s R11 is unchanged and must pass.

## §5. Predictions · unchanged · invalidators · falsification

B is the commit the branch starts from, and it carries this form. H is the head.

**Predictions** (a wrong one is a result, class 2):
- P1: at H, C ≥ 400 on main's default set. The survey's lines are the floor.
- P2: an instrument run with MQ4, MQ5 and MQ13 applied together, then reverted, refuses ≥ 100 cites (the 126 lines citing rounds 41 to 70).
- P3: at S2, the unresolved count U ≤ 10, each listed by file and line.
- P4: S2's scan of the forms of every in-progress piece and every PR awaiting merge finds 0 unresolved cites.
- P5: Q13's counts are 1, 2, 5 and 4.

**Declared unchanged:**
- U1: B's `verify-quotes.mjs`, copied untracked beside H's and run on H's tree, prints the same quote lines as H's own: checked, verified, baselined, advisory, 0 findings, 0 baseline errors, 0 unmatched.
- U2: hash findings 0, hash-baselined 2, unmatched 0, at both.
- U3: `scripts/plan/verify-quotes.baseline.json` is byte-identical (30 and 2 entries) unless OPEN-5 (A)'s ruling.
- U4: under OPEN-2 (B), B's `verify-test-claims.mjs` and H's give identical output on H's tree.
- U5: verify-cites gated count 0.
- U6: every existing test passes unedited, and the suite grows by exactly 15 tests.
- U7: R11 passes.

**Invalidators:**
- I1: U > 0 at S2. STOP: no baseline entry and no record edit; the custodian takes the list to the human (OPEN-5).
- I2: U1 or U2 differs.
- I3: U4 differs.
- I4: S2 finds a header or item-line form in the ruling set outside §2.3. STOP and amend before code.
- I5: a path outside §9 is needed.

**Falsification:** if the human reads the follow-on as attribution (OPEN-3 (C)), this piece is incomplete, not wrong.

## §6. Instruments

Assertions only:
- `node scripts/plan/verify-quotes.mjs` (B's copy and H's);
- `node scripts/plan/verify-test-claims.mjs` (B's copy and H's);
- `node scripts/plan/verify-cites.mjs`;
- `node scripts/plan/verify-mutation.mjs`;
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`.

S2 also runs verify-quotes with explicit `files` set to the branch copies of the open pieces' forms.

## §7. Declared values and ceilings

- **Lines:** ≤ 550 lines, counted by `git diff --numstat B...H -- . ':!scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site'`, insertions plus deletions.
- **Files:** ≤ 7 non-generated files besides the form.
- **Budget:** 180 minutes, replacing the node's 120, because of S2's runs and the possible STOP. The custodian sets it.
- **Constants:** the header, item, boundary and cite patterns and the skip spans are declared at their sites.
- **Overruns:** class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716), with §7 never edited.

## §8. Block-on-sight

1. U1, U2, U3 or U4 differs.
2. A cite baseline route lands without entries the human has ruled.
3. A finding message states another module's consequence.
4. A `round N, item M` in this form, or in any record written by this piece, that sits outside backticks and does not resolve.
5. A line cite into `DECISIONS-PENDING.md` or its archive.
6. A path outside §9, anything under `protocol/`, or any governing doc edited.
7. A fixture header, item or bullet line not copied from a named real block (§3).
8. An exported item with no product caller.
9. A tool claim without the tool's commit, or a hash reference in an append-only record at a commit not on main (round 15 (c) and (e)).
10. A mutation recorded as observed by verify-mutation.
11. The CI `paths:` filter changed, unless OPEN-6 (B) is ruled.

## §9. Gates

- **Architect and reviewer, full.** Verdicts follow `state/directives/2026-10-05-product-first-direction.md`, section 2.
- **Architect:**
  - §2.3 against the real blocks by round;
  - the OPEN rulings as applied;
  - §2.9's seam;
  - §8 item by item.
- **Reviewer:**
  - the full diff;
  - every mutation against its commit id;
  - U1 to U7;
  - the §7 count;
  - every hash recomputed.
- **Suites:** §6's.
- **Steps:**
  - S0: the form, with the custodian's hashes, before any code; the node's `gate` set to it.
  - S1: the code and tests.
  - S2: the instrument runs and P1 to P4, recorded as one class-1 row; on I1 or I4, STOP.
  - S3: the docs.
  - S4: the closing amendment, references and hashes only.
  - S5: both gates.
  Merge by a merge commit.
- **Operator:** none. There is no app string and no walkthrough row.
- **Rule (00)** (`AUTONOMY.md:609` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0). This piece's paths:
  - `scripts/plan/rulingSet.mjs`;
  - `scripts/plan/verify-quotes.mjs` and its test;
  - `scripts/plan/verify-test-claims.mjs` and its test;
  - `scripts/plan/README.md` (appended at the end);
  - `.github/workflows/governance-ci.yml` (comment and step name);
  - this form.

  PLAN.yaml is the custodian's. Nothing is under `protocol/`, and neither lockfile changes.
  - **The redaction scan (in progress).** Its paths (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:359-370` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:fade60db5d57b37c743407a691e240f4df6512ccf333dc1844d1c4ff817dbd71) are disjoint. Its suites run verify-quotes, so its form's cites are in S2's branch scan.
  - **PR #239.** Its paths (`frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:e007af93d7e8ba283a0581acadc65406bba173d2efc314778c3859d8de04fd05: `MANUAL-WALKTHROUGH.md` Parts G and N, its form, PLAN.yaml and the generated files) are disjoint. Its form is in S2's branch scan.
  - **ADR-036's pre-acceptance block.** Its paths (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:329` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:1caa2c26664d66a06bcb97049d2b074c0a6354537e86f3bda0d4f7905fc04f0e: ADR-036, the generated `docs/README.md`, its form and PLAN.yaml) are disjoint. Once it lands, ADR-036 is scanned under `docs/adr/`, so its new text's round + item cites must resolve. The custodian tells the docs lane.
  - **Piece 1c.** Its paths (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:563-622` @ 40b04b46b33a6ce7a86160fac4a616ad1683ff1e sha256:6afe381a12c5c78f9d7a39e83fd27bffc4d64224546a6e91cb4ecc6341b72bc2) touch `protocol/` and no `scripts/plan/`. They are disjoint, and this piece keeps the one-toucher rule for `protocol/` by touching none.
  - **The next governance-lane piece.** questions-mirror-item-count (scripts/hooks) follows this piece, with no shared code.

## §10. Amendments

Opens empty, append-only.

---

## OPEN items, for the human

- **OPEN-1, the forms read.**
  - (A) Round + item only (§2.1), skipping backtick spans, double-quoted spans and blockquote lines.
  - (B) (A), plus the clause form F5, resolved to the round's block.
  - (C) (B), plus `entry K`, resolved to an entry head.
  - A sub-choice: skip backtick spans only, so quoted text is resolved too.
  - Recommended: (A), skipping all three. A wrong round number inside the human's immutable quoted words would be a failure no one can fix. F5 is mostly used as a rule's name. Prose says "entry" in other senses ("baseline entry 21").
- **OPEN-2, sharing.**
  - (A) A shared resolver used by verify-quotes only; verify-test-claims unchanged, with a follow-on node.
  - (B) Both tools use it now.
  - (C) Export verify-test-claims' narrow function. This is refused: it would refuse most of the 126 cite lines to rounds 41 to 70 and turn main red.
  - Recommended: (B). Two definitions of "resolves" for one cite form is the drift class to avoid, and U4 makes the change checkable.
- **OPEN-3, attribution.**
  - (A) Existence only.
  - (B) An advisory list of passages introduced by a round + item cite that are not found in that item's span.
  - (C) Gated against the item's span. This would break U1: the typed answers of round 46 onward are filed in `state/directives/`, not in the block.
  - Recommended: (A).
- **OPEN-4, the scan set.**
  - (A) `claimFiles` (preregistrations, ADRs and the template).
  - (B) (A), plus AI_DEVELOPMENT.md and `.claude/agents/*.md` (15 lines).
  - (C) (B), plus AUTONOMY.md (20 lines).
  - Recommended: (A).
- **OPEN-5, if S2 finds U > 0.**
  - (A) An open record is corrected by its owner's class-3 row. A closed record or an accepted ADR gets a `citeEntries` baseline route carrying the human's ruled entries, with the round 11 dispositions; the route lands only then.
  - (B) Narrow the grammar so those cites fall outside it, disclosed.
  - (C) Hold.
  - Recommended: (A).
- **OPEN-6, the CI path filter.**
  - (A) Unchanged, and disclosed. A new RULED block never breaks an old cite, and rotation keeps blocks inside the set.
  - (B) Add `DECISIONS-PENDING.md`, `state/cut-archive/DECISIONS-PENDING-*.md` and `state/questions/round-*.md`.
  - Recommended: (A).
- **OPEN-7, itemless blocks** (rounds 32, 47, 48, 53 to 58, 63 to 71, by my reading).
  - (A) The item resolves in the tracked `state/questions/round-N.md`.
  - (B) The round's block existing is enough. This is weaker: it proves the round, not the item.
  - (C) Unresolved, and each one goes to OPEN-5.
  - Recommended: (A). It covers the 5 real cites listed in §0.4 truthfully.

## §10 Amendment 1 — committed: the human's rulings; the pins; the budget; S1 next (class 5)

*Written by the custodian before any code. References only: `state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md`, item 7; the architect's draft, `state/consults/2026-10-21-verify-quotes-round-item-cites-architect-draft.md`.*

1. **The rulings:** OPEN-1 (A), skipping all three span kinds (backtick spans, double-quoted spans and blockquote lines); OPEN-2 (B), both tools use the shared resolver; OPEN-3 (A), existence only; OPEN-4 (A), `claimFiles`; OPEN-5 (A); OPEN-6 (A), the CI path filter unchanged; OPEN-7 (A), an itemless block's item resolves in its tracked round file.
2. **The pins:** each `<path>:<lines> @ 40b04b46` cite outside a fenced block was pinned by script, with the full commit id 40b04b46b33a6ce7a86160fac4a616ad1683ff1e and the sha256 of its lines. Three bare cites were expanded and pinned, each read from its sentence: `scripts/plan/verify-test-claims.mjs` lines 741 to 748 and 555 to 570, and `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md` line 83. Two, into `.github/workflows/governance-ci.yml`, are written as words read at 40b04b46, because the quote checker's hash grammar does not take a path with a leading dot.
3. **Budget:** 180 minutes (§7), set in PLAN.yaml with this commit. **S1** follows on `cut/verify-quotes-round-item-cites`, cut from this commit (B). Rule (00) is re-checked when the redaction scan's Amendment 3 names its CI step's workflow file.

Nothing above is edited.

## §10 Amendment 2 — S1 built; S2: STOP on I4 (class 1); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-10-21-verify-quotes-round-item-cites-s1-worker-report.md`; `state/consults/2026-10-21-verify-quotes-round-item-cites-s2-worker-report.md`.*

1. **S1** is 81a287a667d13cfd989331ddcd65357dc6915092: the 15 tests of §4, each of its 15 mutations observed failing alone at that commit; the suite from 527 to 542 (U6); 344 lines over 5 files (§7). It gives `resolveCitation` and `resolveInText` an optional third parameter, `readRoundFile`, through which `withdrawnRiders` binds the round-file reader (§2.6). §2.6 names `resolveCitation`'s signature unchanged. Every two-argument call is unchanged, and U4 holds (item 2). The gates rule on it.
2. **S2,** at 85ac5d781508318f9177d31c9fe15d12eb365011 (S1 with main merged in at c86b2c9c): U1 to U5 hold. P1: 836 ruling cites resolved (floor 400). P2: 152 refused with MQ4, MQ5 and MQ13 applied together (floor 100). P3: U = 0 (ceiling 10). P4: 0 unresolved in each of the four forms it scanned.
3. **I4 fired, by its letter.** One RULED header in the ruling set names its question round outside §2.3 (i)'s grammar. It is the block for question round 72, in the 2026-10-20 archive. It is headed by PR #217, and the round is named in a parenthesis at the end of its header. The block has no item lines; the round's tracked question file has one item. No file of the scan set cites round 72 by item (U = 0). Such a cite would fail by name; it would not pass. Every item-like line inside a round-headed block matches §2.3 (iii): 166 of 166.
4. **S3 has not run.** The human rules how I4 is met, and the ruling is recorded in the next amendment before S3.

Nothing above is edited.

## §10 Amendment 3 — I4 met by the human's (A) (class 5)

*Written by the custodian on the human's message. References only: `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md`.*

1. **I4 (A):** question round 72's RULED header, in the 2026-10-20 archive, is recorded as the one unread block of the ruling set. A cite to round 72 by item is refused by name; a record cites that ruling by a hash pin instead.
2. **S3 follows.** The header paragraph's disclosed gaps name that block. Then the PR and both gates.

Nothing above is edited.

## §10 Amendment 4 — gate 1: both FAIL; correction round 1 (class 9 for E-1's test, class 1 for the records); written after the reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-22-verify-quotes-round-item-cites-gate1-architect.md` (gate-log 585); `state/consults/gates/2026-10-22-verify-quotes-round-item-cites-gate1-reviewer.md` (gate-log 586).*

1. **Gate 1 at b08a1fec4e3405153b4998882427355fa18db319:** the architect FAIL (C-1, words only; D-1 to D-3; H-1 to the human) and the reviewer FAIL (E-1; D-1 to D-4). Both close the code's correctness.
2. **E-1 (class 9, before its code):** one test is added in `scripts/plan/verify-test-claims.test.mjs`, C2 `verify-test-claims: a withdrawn-test row whose ruling cites an itemless round resolves through the tracked round file`. It also shows the cite failing by name when the round file lacks the item. Its fixture byte-copies, at 40b04b46, the real RULED block for question rounds 66 and 67 and `state/questions/round-66.md`, found by round. Its mutation, MC2, drops the round-file reader from `withdrawnRiders`' two calls; it is observed failing alone, with the commit id. U6 becomes: the suite grows by exactly 16 tests.
3. **The words:** the architect's W1 to W6 and the reviewer's D-1 to D-3 replace the same sentences. The architect reconciles them into one set, filed before the worker applies it with no re-gate (§9); the PR body lists them.
4. **Records corrected:**
   - Amendment 2, item 1's fourth sentence: the only two calls of `resolveCitation`, both in `withdrawnRiders`, now pass the round-file reader, and neither it nor `resolveInText` is exported; U4 holds (S2's report, step 4).
   - §7, not edited (class 8 by its letter): its command over B...H at b08a1fec gives 3,240 lines over 32 files, because the range carries main's merges at c86b2c9c and 49a7f532; over 49a7f532...H it gives 375 lines over 7 files, the piece's own, within 550 and 7.
   - The line numbers in the step reports (S2's archive and ledger lines at 85ac5d78, S1's `verify-quotes.mjs` line at 81a287a6, S3's at 8e04dbe2) are their instruments' output, not references. The record's reference to the unread block is Amendment 2, item 3.
5. **H-1 is the human's,** on Monday 2026-10-26: whether a record's hash pin for that block's ruling points into the archive or at the round's tracked question file. The header's and the README's words follow the ruling, so the merge waits for it.
6. **Next:** the reconciled words; correction round 1 by a worker (C2, MC2, the words); then scoped re-gates.

Nothing above is edited.

## §10 Amendment 5 — correction round 1 built (class 1); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-10-22-verify-quotes-round-item-cites-round-1-worker-report.md`; `state/consults/2026-10-22-verify-quotes-round-item-cites-gate1-words-reconciled-architect.md`.*

1. **Round 1** is 91ccdab4904b5937b53b296b03a91a62b41fd2f3: C2 with MC2 observed failing alone, and sections 1 to 4 of the reconciled words applied, each found once and replaced. The suite is 543 (U6 as amended); U4 holds; §7 over 49a7f532...H is 415 lines over 7 files.
2. **Next:** the scoped re-gates at 91ccdab4; H-1 stays the human's.

Nothing above is edited.

## §10 Amendment 6 — the scoped re-gates: both PASS WITH NOTES (class 1); written after the reports were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-22-verify-quotes-round-item-cites-gate2-architect.md` (gate-log 589); `state/consults/gates/2026-10-22-verify-quotes-round-item-cites-gate2-reviewer.md` (gate-log 590).*

1. **Both PASS WITH NOTES** at 91ccdab4904b5937b53b296b03a91a62b41fd2f3: gate 1's C-1 and E-1 are closed; MC2 is re-observed failing alone at that commit (the reviewer's check 2).
2. **D-4, one comment line,** at the blockquote constant's site in `scripts/plan/verify-quotes.mjs`, by a worker with no re-gate, in the architect's words.
3. **The PR body:** the architect's D-3 is applied; it covers the reviewer's D-1.
4. **S4, the closing amendment,** waits for H-1 and carries, as references: the architect's D-1 and D-2 rows (D-2 citing the reviewer's re-observation at 91ccdab4), and §7's figures at the final head.
5. **Noted, not done:** the carrier call's round-file reader has no test of its own (both gates' N-1); a follow-on, not required for this merge.

Nothing above is edited.

## §10 Amendment 7 — H-1 ruled by the human (class 5)

*Written by the custodian on the human's message. References only: `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md`, item 1; the architect's H-1 note in `state/consults/2026-10-22-verify-quotes-round-item-cites-gate1-words-reconciled-architect.md`, its sections 1 and 2.*

1. **H-1:** a record's cite to question round 72's ruling pins the item's line in the tracked `state/questions/round-72.md`, by a hash pin at a main commit, never a line of the archive. That is the hash pin of Amendment 3, item 1.
2. **The words follow:** the clause that the architect's H-1 note gives for a pin at the question file is appended where that note places it, in the header's sentence in `scripts/plan/verify-quotes.mjs` and in the README's sentence in `scripts/plan/README.md`. A worker applies it with no re-gate (§9, as Amendment 4, item 3 applied the reconciled words), and the PR body lists it. A header line may be rewrapped at a word boundary; no word changes.
3. **Next:** S4, the closing amendment (Amendment 6, item 4), at the head that carries the clause; then the PR leaves draft for the human's click, the last of the four at the sitting.

Nothing above is edited.

## §10 Amendment 8 — S4, the closing amendment: references and hashes only (class 1); written after the head was seen

*Written by the custodian. References only: `state/consults/gates/2026-10-22-verify-quotes-round-item-cites-gate2-architect.md`, its D-1 and D-2; `state/consults/gates/2026-10-22-verify-quotes-round-item-cites-gate2-reviewer.md`, its check 2; `state/consults/2026-10-22-verify-quotes-round-item-cites-h-1-clause-worker-report.md`.*

1. **The final head** is 2d2e4633a15b7fa05ed7a10b7637a0f4943f23fd: Amendment 7's clause in the two files it names, on af77b0d10514c9bdca0a46367b9660450d85b295 (D-4). The suite is 543 tests (U6 as amended).
2. **§7 at that head,** by its command over `49a7f532...2d2e4633` (the range Amendment 4, item 4 records): 416 lines over 7 files, within 550 and 7.
3. **D-1, in the architect's words:** The round-1 report's step 1, negative case, carries the test's expected failure text, `round 66, item 9`, as its instrument's output; it is not a reference.
4. **D-2, in the architect's words:** MC2 was observed on b08a1fec4e3405153b4998882427355fa18db319's tree with C2 uncommitted (the round-1 report, step 2); `scripts/plan/verify-test-claims.mjs` is unchanged from b08a1fec to 91ccdab4 (the same report, step 4's diff list). The reviewer re-observed MC2 failing alone at 91ccdab4904b5937b53b296b03a91a62b41fd2f3 (gate 2's reviewer report, its check 2).
5. **Recorded before and not repeated:** the §7 range (Amendment 4, item 4); S1's third parameter (Amendment 2, item 1, as Amendment 4, item 4 corrects it).
6. **Next:** the PR body names the head and lists Amendment 7's clause; the PR leaves draft. The merge is the human's click, the last of the four at the sitting, by a merge commit.

Nothing above is edited.
