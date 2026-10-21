*Custodian's filing note (2026-10-21): the architect's draft of the full form for `verify-quotes-round-item-cites`, the governance lane's first piece after D, read only at main 40b04b46. The run 2026-10-21T13:30:06Z to 13:46:18Z by its transcript (Grep 54, Glob 5, Read 39; no Write, Edit or Bash), up to its SubagentHandback call. OPEN-1 to OPEN-7 are the human's. The form is committed after their rulings, with its pins added by script. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 5b357e8eb89879878dd471c514c8a63ef5b5413788e3514e2575444375cc753d.*

---

Drafted: verify-quotes-round-item-cites, its form, at main 40b04b46

The route is the full form under full gating (`AUTONOMY.md` §21a). There are two reasons:
- The predicted diff is about 450 lines of code, tests and docs across 7 files besides the form, well over §21c's bound (`AUTONOMY.md:349-357 @ 40b04b46`).
- Under OPEN-2 (B) the piece also changes a property under test: how verify-test-claims resolves a withdrawn-test row's `ruling:` and `carrier:` riders.

Under §25 (e) (`AUTONOMY.md:482 @ 40b04b46`), no five-line form is committed.

I have no shell, so no cite below carries a sha256. The custodian fills the hashes by script. Every `path:line` reads at main 40b04b46, which is the working tree I read; only untracked files differ. None of my cites is a line cite into `DECISIONS-PENDING.md` or its archive: ledger text is cited by round and item, or by entry.

Findings for the custodian, outside the form:
- **No README section to read.** The brief names verify-quotes' README section, but `scripts/plan/README.md` at 40b04b46 has none (its headings run from :1 to :367). The hash grammar is described only inside the verify-test-claims section (`scripts/plan/README.md:128-156 @ 40b04b46`).
- **A latent gap in verify-test-claims.**
  - Its item pattern (`scripts/plan/verify-test-claims.mjs:491 @ 40b04b46`) accepts only a single asterisk before `Item`. The archive's RULED blocks from round 41 on write `- **Item M` (63 lines).
  - Its header pattern (`:489`) does not match the plural headers of rounds 63/64 and 66/67, or round 71's header, which lacks the word "question".
  - So a withdrawn-test row whose ruling cites any of those rounds would be refused. No row on main does this, since main is green. This is OPEN-2.
- **A superseded sheet row.** The first-pass sheet row `state/drafts/decisions-pending-c-en3.md:12 @ 40b04b46` still reads E104 as done by `ledgerRoundItemResolves`. It is superseded by the corrected row at `state/drafts/decisions-pending-c-obligations.md:385 @ 40b04b46`. No action is owed.

---

# verify-quotes resolves round + item cites — full form (PLAN node verify-quotes-round-item-cites)

File: scripts/plan/VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md

Authority:
- round 12, item 1: its Applied text owes the checker's resolution of round + item cites as a follow-on;
- entry 104, mechanism (a);
- placed by `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:15 @ 40b04b46` (item 5: the governance lane after D, 1 of 3);
- governance C's rows L1541 and E104 (`state/drafts/decisions-pending-c-obligations.md:58 @ 40b04b46`; `state/drafts/decisions-pending-c-obligations.md:385 @ 40b04b46`);
- C's gate 1 architect finding D-3 (`state/consults/gates/2026-10-20-governance-decisions-pending-open-and-archive-gate1-architect.md:42-49 @ 40b04b46`).

Drafted by: the architect agent on the custodian's brief, read at main 40b04b46.

Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

Form: full. The reasons are §21a by §21c's size, and, under OPEN-2 (B), a property currently under test. §25 (e) applies.

## §0. Disclosure

0.1 Read at 40b04b46:
- the PLAN node (`PLAN.yaml:5513-5529 @ 40b04b46`);
- round 12's RULED block, item 1, and entry 104 (both in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`, found by round and by entry);
- `state/questions/round-12.md:3 @ 40b04b46`;
- `scripts/plan/verify-quotes.mjs` whole, and its test's names and its ruling-set tests (`scripts/plan/verify-quotes.test.mjs:971-1001 @ 40b04b46`);
- `scripts/plan/verify-quotes.baseline.json` (30 `entries`, 2 `hashEntries`);
- `scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md` and its Amendments 1 to 11;
- `scripts/plan/rulingSet.mjs` whole;
- `scripts/plan/verify-test-claims.mjs:475-570 @ 40b04b46` and `:741-748`;
- `scripts/plan/verify.mjs:143-165 @ 40b04b46`;
- `scripts/plan/rotate-decisions-pending.test.mjs:263-295 @ 40b04b46`;
- `.github/workflows/governance-ci.yml`;
- `AUTONOMY.md` §6a, §21, §25 and :609;
- `docs/PREREGISTRATION-TEMPLATE.md` whole.

0.2 **Reuse.** The prior art in the tree is `ledgerRoundItemResolves` and `resolveCitation` (`scripts/plan/verify-test-claims.mjs:488-530 @ 40b04b46`), with `readRulingSet` (`scripts/plan/rulingSet.mjs:30-38 @ 40b04b46`). The reuse index records no prior art. Its output, as the brief carries it:

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
- verify-test-claims resolves `round N, item M` and `entry K` only in withdrawn-test riders (`scripts/plan/verify-test-claims.mjs:555-570 @ 40b04b46`).
- verify.mjs does a substring search of `verdict.cite` (`scripts/plan/verify.mjs:159-164 @ 40b04b46`), which is not a resolution of round + item.

0.4 **Survey of the citing side.**
- Tool: the Grep tool (ripgrep, which respects `.gitignore`) over the working tree at 40b04b46, case-insensitive, counting matching lines.
- Glob: `{**/*PREREGISTRATION*.md,docs/adr/*.md}`, which is verify-quotes' `claimFiles` set and includes the template (`scripts/plan/verify-test-claims.mjs:746-748 @ 40b04b46`). The search listed the working tree, not `git ls-files`, so S2 re-derives every figure against the tracked index.

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
- Cites by item to rounds whose header the existing pattern misses: 5 lines. These are `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:851 @ 40b04b46`, `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:5 @ 40b04b46`, `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:377 @ 40b04b46`, `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:5 @ 40b04b46` and `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:125 @ 40b04b46`.
- Deliberately unresolvable fixture cites, inside backtick spans: `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md:76 @ 40b04b46` and `:83`.
- No cite by item to rounds 47, 48, 60, 71 or 72 and above was found.

0.5 **Survey of the target side.** Same tool, over `DECISIONS-PENDING.md` and `state/cut-archive/`.
- RULED headers: 185 in the archive, 6 in the live file. None of the live file's 6 names a question round.
- Header forms that name rounds:
  - `— question round N` (the common form);
  - `— question rounds N and M` (rounds 63 and 64, 66 and 67);
  - `— round 71`, without "question".
- Item-line forms in the archive: `- *Item M —` (125 lines) and `- **Item M` (63 lines, round 41 onward). The live file has none.
- By my reading of the archive's bullet heads, these blocks carry no item line at all: rounds 32, 47, 48, 53 to 58, 63 to 71. They are keyed by OPEN labels, by `G1` to `G3`, or by `The ruling(s)` alone.
- Each round from 1 to 73 has a tracked `state/questions/round-N.md`. In the mirror-hook format, items are lines starting `M. ` (for example `state/questions/round-66.md:12 @ 40b04b46`).

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
- The ruling set: `rulingSetPaths` over the tracked index (`scripts/plan/rulingSet.mjs:16-18 @ 40b04b46`), which is the live `DECISIONS-PENDING.md` and then each tracked `state/cut-archive/DECISIONS-PENDING-*.md`. verify-quotes already lists it as `rulingFiles` (`scripts/plan/verify-quotes.mjs:402-404 @ 40b04b46`).
- For an itemless block only, the tracked `state/questions/round-N.md` (OPEN-7 (A)).
- The set is indexed once per run: each file maps a round to its block's item set, or to "itemless".

2.3 **What resolves.** One file at a time, nothing joined across files:
- (i) A header line: it starts `**RULED <yyyy-mm-dd>`, then an optional parenthetical, then ` — `, then an optional `question `, then `round N`, or `rounds N and M` with the cited round equal to N or M.
- (ii) The block runs from the header's next line to the line before the next line starting `**` or `## `. This is the boundary at `scripts/plan/verify-test-claims.mjs:493 @ 40b04b46`.
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
- The PASS line gains `, C ruling cites resolved, 0 ruling-cite errors`. No consumer parses that line: Grep finds `runVerifyQuotes` imported only by the verify-quotes tests and `scripts/plan/rotate-decisions-pending.test.mjs:19 @ 40b04b46`.

2.6 **The shared resolver (OPEN-2 (B)).**
- `scripts/plan/rulingSet.mjs` gains, appended at its end, one export: `resolveRoundItem(texts, round, item, roundFileText)` returning `{ ok: true }` or `{ ok: false, reason }`. It takes `texts: string[]`, the shape both callers actually hold:
  - verify-test-claims' `loadDecisionsPending` returns `string[]` (`scripts/plan/verify-test-claims.mjs:481-486 @ 40b04b46`);
  - verify-quotes reads the `rulingFiles` paths.
- `roundFileText` is the tracked round file's text, or null. Each caller reads it.
- Callers:
  - verify-quotes' new pass;
  - verify-test-claims' `ledgerRoundItemResolves`, which keeps its name and position and delegates to it. `withdrawnRiders` binds the round-file reader, since it holds `root` (`:555-570`).
- `ledgerEntryResolves`, `CITATION_RE`, `resolveCitation`'s signature and the `CITATION_EXACT_RE` row grammar are unchanged.

2.7 **Unchanged:** quote extraction, the haystack, baseline matching, the hash grammar and check, `--show-cites`, the CLI arguments, `verify-quotes.baseline.json`, `site.mjs`, the health strip and the CI `paths:` filter (OPEN-6 (A)). No cite baseline route lands unless OPEN-5 (A) rules entries: a route with no entry has no product caller.

2.8 **Docs.**
- `verify-quotes.mjs`'s header gains one paragraph, "ROUND + ITEM CITES": §2.1 to §2.4 and the disclosed gaps (sub-clauses, entries, clause cites, directive items, files outside the set, existence not meaning).
- `scripts/plan/README.md` gains one section, appended at its end: `## verify-quotes.mjs — round + item cites`, naming the shared resolver.
- `governance-ci.yml`'s step name (`:149`) and its green-run comment (`:20-47`) each gain one clause.
- No governing doc is edited.

2.9 **The seam (the actual interfaces, read).** `rulingSetPaths(tracked)`, `readRulingSet(repoRoot, tracked)` and `LIVE_RULINGS` (`scripts/plan/rulingSet.mjs:11-38 @ 40b04b46`); `rulingFiles(root, index)` (`scripts/plan/verify-quotes.mjs:402-404 @ 40b04b46`); `resolveCitation(texts, citationText)` (`scripts/plan/verify-test-claims.mjs:528-530 @ 40b04b46`). The end-to-end proofs from the real shape are Q12 and Q13.

## §3. Fixtures

- Q1 to Q11 build `gitTree` fixtures. Their header, item and bullet lines copy the grammar of named real blocks:
  - round 12, item 1's line (single asterisk);
  - round 46, item 1's line (bold);
  - the header and first bullet of the rounds 66 and 67 block;
  - `state/questions/round-66.md`'s item heads.
  The worker locates each by its round with `git show 40b04b46:state/cut-archive/DECISIONS-PENDING-2026-10-20.md`, never by a line number.
- Every fixture cite that must not resolve sits in backticks in this form.
- Q12 to Q14 use `byteCopiedLine('40b04b46', …)` and `fixtureFile` (`scripts/plan/verify-quotes.test.mjs:821-836 @ 40b04b46`) against REPO_ROOT.

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
- `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:5`: 1 cite;
- `tools/mods/GUARDIAN-V0-PREREGISTRATION.md:553`: 2 cites;
- `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:5`: 5 cites;
- `scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md:120`: 4 cites;
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
- **Overruns:** class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 40b04b46`), with §7 never edited.

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
- **Rule (00)** (`AUTONOMY.md:609 @ 40b04b46`). This piece's paths:
  - `scripts/plan/rulingSet.mjs`;
  - `scripts/plan/verify-quotes.mjs` and its test;
  - `scripts/plan/verify-test-claims.mjs` and its test;
  - `scripts/plan/README.md` (appended at the end);
  - `.github/workflows/governance-ci.yml` (comment and step name);
  - this form.

  PLAN.yaml is the custodian's. Nothing is under `protocol/`, and neither lockfile changes.
  - **The redaction scan (in progress).** Its paths (`kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:359-370 @ 40b04b46`) are disjoint. Its suites run verify-quotes, so its form's cites are in S2's branch scan.
  - **PR #239.** Its paths (`frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 40b04b46`: `MANUAL-WALKTHROUGH.md` Parts G and N, its form, PLAN.yaml and the generated files) are disjoint. Its form is in S2's branch scan.
  - **ADR-036's pre-acceptance block.** Its paths (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:329 @ 40b04b46`: ADR-036, the generated `docs/README.md`, its form and PLAN.yaml) are disjoint. Once it lands, ADR-036 is scanned under `docs/adr/`, so its new text's round + item cites must resolve. The custodian tells the docs lane.
  - **Piece 1c.** Its paths (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md:563-622 @ 40b04b46`) touch `protocol/` and no `scripts/plan/`. They are disjoint, and this piece keeps the one-toucher rule for `protocol/` by touching none.
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

## What I could not settle

- The figures: the B quote tuple, C, U, P2's count and Q13's per-line counts. They are predictions to be measured at S2. I had no shell.
- Whether every header and item-line form in the ruling set is covered. I surveyed the archive's bullet heads by Grep; I4 re-checks this.
- Which rounds are itemless. This is my reading and needs S2's confirmation.
- That item heads are `M. ` in the older round files. Under OPEN-7 (A) this matters only for itemless blocks.
- Every sha256. The custodian fills them by script.
