Reviewed: PR #232 at 6b8b3688ea0a99978ce9d641fef6dd6df6f1e38c (base e7430b420cfe73c8ecf5b93fcc606ede6ac1345f), gate 1 at G0, architect — cut/decisions-pending-open-and-archive @ 6b8b3688ea0a99978ce9d641fef6dd6df6f1e38c
Verdict: PASS WITH NOTES

I confirmed the head from `.git/refs/heads/cut/decisions-pending-open-and-archive` and from the origin ref. Both read 6b8b3688. The branch reflog shows: the S1–S8 commits, then d7ebd86b, then a merge of origin/main (f8c973bf), then the sheet commit. I had no shell, so I did not run the struck dry run, `cmp`, the diff, the hashes or `gh pr view`. Every line cite below is at 6b8b3688.

## Correctness: PASS
No findings.

## Evidence: PASS (one low-severity item, must be fixed before the merge)

**E-1. R11's verify-quotes check proves nothing.**
- R11's fixture holds a *valid* hash reference, and R11 then asserts `assert.equal(quotes.hashFindings.length, 0, JSON.stringify(quotes.hashFindings));` (`scripts/plan/rotate-decisions-pending.test.mjs:285`).
- That assertion also passes if the archives are dropped from the hash-scan list (MT4). MR11 fails R11 at its first assertion, the felt-verdict one, so no mutation ever showed this check can fail.
- It does not block, because the property is proven elsewhere:
  - T4 runs the default scan in a git tree with the archive at the real path pattern, and the finding names the archive (`scripts/plan/verify-quotes.test.mjs:978-984`).
  - R1 proves the rotation writes `state/cut-archive/DECISIONS-PENDING-<today>.md`.
  - R11's other assertions prove that archive enters `rulingSetPaths`, the same list `rulingFiles` uses for the hash scan (`scripts/plan/verify-quotes.mjs:402-404`).
- **Fix:** in R11, give the RULED block's hash reference a wrong hash. Replace line 285 with an assertion that `quotes.hashFindings.map((f) => f.relPath)` deep-equals `` [`state/cut-archive/DECISIONS-PENDING-${today()}.md`] ``, with the reason matching `/sha256 mismatch/`. Then record MT4's mutation failing R11 by name at the fix commit.
- The reviewer re-runs that mutation. No architect re-gate is needed, because the change only strengthens an assertion.

## Documentation: must be fixed before the merge (D-3 before S10)

None of these is the human's wording, so the custodian applies the words below with no re-gate and the PR body lists them (§31 d).

**D-1. The sheet's `L<n>` labels are line cites into the ledger with no hash (§8 item 10).**
- This applies to `state/drafts/decisions-pending-c-obligations.md` and to the eight passes beside it. Each names commit ed8731a7 but carries no sha256.
- Replace the header clause "lines are given as L<n>." with: "Read at that commit's `DECISIONS-PENDING.md`, pinned whole: `git show ed8731a7bdf19a48d37049cbe14e3d00d9db0372:DECISIONS-PENDING.md | sha256sum` gives `<hex, filled by script>`. L<n> is the dry run's `line` field for a unit: the line of the unit's head in that blob. It is a historical pin, never read as current."
- Put the same sentence in each pass's filing note.
- Clause check:
  - "the dry run's `line` field": the script prints `line ${r.line}`, which is `u.line`, counted from 1 (`rotate-decisions-pending.mjs:53`, `:98`, `:173`).
  - The pin: when filling the hash, the custodian must also confirm that `git rev-parse` of `DECISIONS-PENDING.md` gives the same blob at ed8731a7 and at 81b350f5, the P of the struck dry run. Both runs report 708,850 bytes; I could not compare the blobs.
- `scripts/plan/verify-quotes.mjs:336` also holds a `DECISIONS-PENDING.md:48` token. It quotes a stray token in another file, so it is not a cite, and it reads as already there at M0. The reviewer confirms that from the diff.

**D-2. Entry 118's row contradicts the 2026-09-20 rows.**
- Entry 118's row says the status-line wiring is "not owed work". The rows for the two 2026-09-20 RULED blocks (the sitting day, and entry 118 with the state reconciliation) list the same proposal as not represented.
- Replace that row's no-obligation clause with: "no obligation in this unit beyond the rows of the two 2026-09-20 RULED blocks, which list the status-line wiring proposal as not represented; the 200k flag was the human's own one-week pilot, and pasting /context is the human's act."
- Clause check:
  - The sitting-day block's entry-118 Applied line ends "the status-line wiring proposal stands unapplied".
  - The reconciliation block's context-measurement line ends "so it is not applied".
  - The counts stay 22 units and 24 clauses.

**D-3. Entry 104 is struck, but the sheet's own reading says it carries an obligation that is not represented.**
- Entry 104's mechanism (a) says "(the checker learns to resolve that form as a follow-on)". The round-12 RULED block's Applied text for item 1 says "the checker's resolution of round + item cites owed as a follow-on".
- The sheet's row for that block resolves this as **not represented**. Entry 104's own row resolves it as **done**, citing `verify-test-claims.mjs`'s `ledgerRoundItemResolves`.
- "The checker" in entry 104 is the quote checker: the same entry says "The checker reported zero findings in the new text". `verify-quotes.mjs` has no round + item resolution; a Grep for `ledgerRoundItemResolves|RULED_HEADER_RE|question round` across `scripts/plan/*.mjs` finds only verify-test-claims and test files. So the block row's reading is the right one, and Amendment 4 item 4's "none of the 56 struck entries does" does not hold.
- Nothing can be lost: §2 item 6 runs no rotation while the round-12 row stands not represented, and both possible outcomes (placed in PLAN, or ruled no obligation) make entry 104's strike valid. That is why this is a record finding, not a block. But the struck list the human checks has to be true.
- Replace entry 104's done clause with: "not represented: mechanism (a)'s follow-on, the quote checker resolving round + item cites, owed by round 12, item 1's Applied text; verify-test-claims.mjs resolves them for withdrawn-test rows only and verify-quotes.mjs not at all (the same row as the round-12 RULED block's)."
  - Clause check: `withdrawnRiders` calls `resolveCitation` only for `ruling:`/`carrier:` keys (`verify-test-claims.mjs:555-569`). verify-quotes has no such resolution (the Grep above).
- Then append a class-3 correction (round 12 (d)), in words like these: "Amendment 4 item 4's 'none of the 56 struck entries does' does not hold for entry 104, whose mechanism (a) follow-on is the round-12 RULED block's not-represented row (round 12, item 1). Entry 104 [is removed from `--archive-entries`: 55 struck, 24 kept] / [stays struck only if that row is placed in PLAN before S10; otherwise it is kept]."
  - Either choice goes to the human with the 22 rows. If 104 is un-struck, the kept list differs from the PR body's dry run (I7).

## What I checked

1. **§8 item by item, at the head:**
   - (1) Not run until S10. The code asserts that the staged archive blob equals P's blob (`rotate-decisions-pending.mjs:184-189`), and R1 tests it.
   - (2) and (3) `parseUnits`, `classify` and `buildLiveText` (`:43-88`) match §2 items 4 and 5. R1 to R5 assert the exact text.
     - On the ledger on main, all 121 lines matching `^\d+\.\s*\*\*` lie between the only two `^## ` lines (Pending, Resolved), and 121 = 42 marked + 79 unmarked. So no line inside a block splits a unit at this blob.
   - (4) Every reader searches one file at a time:
     - `verify.mjs:162-163`;
     - `verify-test-claims.mjs:481-486`, `:528-529`;
     - `verify-quotes.mjs:402-408`, `:909`.
     - The set is listed through git (`rulingSet.mjs:21-24`; `gitList` at `verify-test-claims.mjs:741-744`), and a git failure throws.
   - (5) R12 checks the hooks. The script has no commit, push or fetch call. Refusals, the not-due path and exit 3 all come before the first write (`:131-176`).
   - (6) Not applicable yet.
   - (7) Main's `AUTONOMY.md` ends at line 640. The branch carries the same text there and §34 begins at line 642. The `cmp` is the reviewer's.
   - (8) measure-reads.mjs: not checked by me; that is the reviewer's diff.
   - (9) No typed date in the script. The tests use the clock and epoch arithmetic.
   - (10) D-1.
2. **Seam tests from the real shape:**
   - T1a's cite matches PLAN.yaml's real `verdict.cite` forms (`PLAN.yaml:724`, `:1256`).
   - T1b runs `runVerifyTestClaims` on the real row grammar in a git repo.
   - T4 is real-shape, as described under E-1.
   - R11 uses the real CLI, a real commit and the readers with `repoRoot`; its felt-verdict, test-claims and cites checks are non-vacuous. Only its hash check is E-1.
   - B's interface was read: `archiveNameFor(date, taken)` and `noticeLine(name, commit)` (`rotate-cut-state.mjs:40-51`). The stem is mapped inside the new script (`:151-155`), so Amendment 3 item 6's reading of item 11 (d) holds.
3. **§2 item 4 against the directive, and the 2026-10-20 rule:**
   - Item 4 matches C.1: title, notice, `## Pending`, units copied verbatim with their archive lines, and "when in doubt, an entry stays". Archiving every block is the definition the human had in sight when ruling OPEN-1 (A).
   - The struck list is identical across the brief, the sheet and Amendment 4, and it holds 56 numbers. Each has a RULED row.
   - Every struck entry carries no not-represented clause of its own, apart from D-3.
   - The 23 kept entries add up: 7 ruled but carrying an unplaced obligation, plus 5 PARTIAL, 3 RECORD ONLY and 8 NONE FOUND.
   - The kept bytes in the table total 70,173. With the header, the notice and 23 archive lines, that is consistent with 72,298.
   - Units I read on main: entries 5, 24, 38, 66, 90, 93, 96 to 99, 104, 110 to 118, 12 to 15, 22 and 27; the round-3 and round-12 RULED blocks; the two 2026-09-20 blocks; and the 2026-10-14 two-slot-2-pieces block.
4. **Rows flagged and resolved "no obligation":**
   - In the units read, each reason holds: a standing rule, a condition the human holds, a hold that has ended, or optional idle work. Examples: "CRS property tests wait for the transformation service"; entry 38's defer-with-trigger; entry 22's idle work; entries 12 to 15 overtaken by events.
   - The exceptions are D-2 and D-3.
   - I sampled these rows; I did not read every flagged unit.
5. **D1-a, as the human read it:**
   - verify-cites' file count 2023 → 2027 is the four new tracked files; Glob confirms `rulingSet.mjs`, `rulingSet.test.mjs`, `rotate-decisions-pending.mjs` and `rotate-decisions-pending.test.mjs`.
   - verify-mutation 0 → 26 and `node --test` 483 → 509 match the form's 26 tests (H1–H2, T1a–T3b, T1b–T3a, T4, Q1–Q2, V1–V2, R1–R12, S3).
   - Not I1. This was measured at S8; the head adds only a merge of main and the drafts.
6. **What else gates F0.** No new blocker, provided:
   - (a) D-3 is settled with the human's answer on the 22 rows, before S10.
   - (b) The 2026-10-20 RULED block stays held until after the click. If it lands after the redaction, P becomes its commit, which breaks the human's "P is then that commit", and §2 item 12 then owes the block its own rows.

Notes for the human:
- Line 1964 is inside entry 110, which is kept. The redacted line is copied into the new live file. The human's one-line note goes at the end of the file, under `## Resolved`, so it lands only in the archive.
- A block cannot stay (§2 item 4 archives every block). So each of the 22 rows can only be placed or ruled.
- Two of the 24 clauses (the FELT VERDICTS block's and round 1's) are carried by entry 95, which stays.
- Entry 5's ruling was read from the 2026-09-22 direction, which does not name entry 5. Its work is represented by `briefb-b3-publish-v2`.
- Entry 93 is struck on its own text. The geographic-CRS follow-on comes from its round-3 ruling, which is among the 22 rows.

Files:
- C:/dev/wt/dpa/scripts/plan/rotate-decisions-pending.mjs
- C:/dev/wt/dpa/scripts/plan/rotate-decisions-pending.test.mjs
- C:/dev/wt/dpa/scripts/plan/rulingSet.mjs
- C:/dev/wt/dpa/scripts/plan/verify-quotes.test.mjs
- C:/dev/wt/dpa/state/drafts/decisions-pending-c-obligations.md
- C:/dev/spatial-ide/scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md
