Reviewed: PR #232 at e174f367adf1ede1ab2d711ead72045c8a7a8880 (base d2045496), gate 2 at G0, reviewer, scoped to round 1 and the custodian's words
cut/decisions-pending-open-and-archive @ e174f367adf1ede1ab2d711ead72045c8a7a8880
Verdict: PASS WITH NOTES

I found nothing that blocks. Every change in the scope diff falls within Amendment 5 items 1 to 4. The fixed R11 now fails by name under MT4. The sheet's pin, its counts and the struck dry run all recompute. The PR body's new section matches gate 1's words byte for byte.

## Correctness
None.

## Evidence
None.

## Documentation
None in this gate's scope.

## Notes (not findings)
- **N-1. The new file's blob depends on P.** The struck dry run, run now from the worktree, names P as d2045496e50fd03a2401daa6275b9cdc7da6316e, because origin/main has moved. At that P the blob is 1617edb2542f731feeef5d70f09534190467779f, not 7db1ac1f9f7bcacec047622a835d2143ae5f3e31. The byte count is the same, 77,060, because the notice line carries P's 40 hex characters.
  - I rebuilt the text with the script's own `parseUnits`, `classify` and `buildLiveText`. At P = fbd752117c8597bbdd6e1470e44755b3c8a958d1, the P the sheet and the PR body name, it gives blob 7db1ac1f9f7bcacec047622a835d2143ae5f3e31 and 77,060 bytes.
  - The same rebuild at d2045496 reproduces the script's printed blob 1617edb2…, which checks the rebuild.
  - Neither the sheet nor the PR body states a blob, so nothing is wrong. Any blob compared at F0 must be taken at S9's P.
- **N-2. For the custodian's next amendment** (the form is on main and outside this diff). Amendment 4 item 1's figures (56 struck, 7, 23 kept, 72,298 bytes) and item 4's "none of the 56 struck entries does" no longer hold after Amendment 5 item 4. Amendment 5 restates 55 and 24 but not 8 or 77,060. Round 12 (e) asks a correction round to end with a superseded index.
  - Suggested words: "Superseded: Amendment 4 item 1's 56 struck, 7, 23 kept and 72,298 bytes, and item 4's 'none of the 56 struck entries does', by Amendment 5 item 4; the current figures (55 struck, 8, 24 kept, 77,060 bytes) are the sheet's section 'The human's rule, applied' at e174f367adf1ede1ab2d711ead72045c8a7a8880."
  - Clause check: the sheet at e174f367 says "8 of those carry an obligation not represented", "55 entries", "It keeps 24 entries" and "77,060 bytes". My dry run printed `kept (24)` and `77060 bytes`.

## Gate 1 findings
- **Reviewer E-1 / architect E-1 (R11's hash part): resolved.**
  - R11 now commits the fixture first. It holds two references pinned at that commit, one valid and one with a wrong sha256.
  - It asserts exactly one finding, on the archive path, matching `/sha256 mismatch/` (`scripts/plan/rotate-decisions-pending.test.mjs:289-291` at the head).
  - MT4 now fails R11 by name (check 2). The record is the MR11b comment at `scripts/plan/rotate-decisions-pending.test.mjs:101`, at 904ea7c1a09e. It describes the mutation I applied, and its "only this one" holds.
- **Reviewer D-1 (S0 and the predicted D1-b in the PR body): resolved.** Byte-identical to my gate 1 words (check 6).
- **Reviewer D-2 (§34 Part B (ii)): resolved.** My replacement sentence occurs exactly once in `AUTONOMY.md` at the head, line 663. That edit falls inside the bytes the piece appended (check 7). The PR body names it ("§34 Part B (ii)'s first sentence in the reviewer's words").
- **Reviewer D-3 (counts as clause counts): resolved.** The first sentence is my words. The second carries the 55-entry figures that follow from entry 104 being kept, and they recompute (check 5).
- **Architect D-1 (the pin, whole):** the replacement sentence, with the hash filled in, is in the sheet's header and in all eight passes' first lines. The hash recomputes, and the blob is equal at the four revisions (check 3). Resolved.
- **Architect D-2 (entry 118's row):** the row's words are the architect's. Resolved.
- **Architect D-3 (entry 104):**
  - E104's row carries the architect's not-represented clause, and its done clause for verify-test-claims is gone.
  - 104 is out of `--archive-entries`, and the dry run keeps 24 entries, 104 among them. The table gives 104 as 4,678 bytes, which equals the unit's UTF-8 length.
  - The PR body's kept list is the new one.
  - Resolved.
- **The architect's note on the `verify-quotes.mjs` `DECISIONS-PENDING.md:48` token:** the token is present at M0 564aadae (grep -c 1). No added line in `git diff origin/main...HEAD` carries a ledger line token: grep -c 0, rc 1, and the pattern self-tests positive (2 of 2).

## What I checked (each command run in the foreground, output to my scratch folder, exit code printed right after)
1. **Scope against Amendment 5 items 1 to 4.** `git diff 6b8b3688 e174f367` (rc 0) touches 11 files, 29 insertions and 22 deletions:
   - item 1: R11 and the MR11b comment, in `rotate-decisions-pending.test.mjs`;
   - item 2: one line in `AUTONOMY.md`;
   - item 3: the sheet's header, the eight passes' first lines, entry 118's row and the counts;
   - item 4: 55 struck, entry 104 kept, the new dry-run sentence, 104's table row and E104's row, plus the knock-on "8 of those".

   Nothing else changed. The scope range touches no `DECISIONS-PENDING.md`, no `state/cut-archive/` and not the form (0 bytes, 0 commits). Over the whole PR, `git diff --stat origin/main...HEAD` touches none of PLAN.yaml, `.claude`, `.github`, `measure-reads.mjs`, `rotate-cut-state.mjs` or `verify-quotes.baseline.json` (rc 0, empty).
2. **MT4 again at 904ea7c1**, in my own throwaway worktree under `C:/dev/wt/`, detached at 904ea7c1a09edf4f4296f714e8d9d715ba69934f.
   - Unmutated: `node --test scripts/plan/rotate-decisions-pending.test.mjs` rc 0, 12/12.
   - The mutation: `verify-quotes.mjs:408` changed to `rulingFiles(root, index).slice(0, 1)`, so only the live file is hash-scanned.
   - Mutated: rc 1, pass 11, fail 1. The one failure is R11, by its full name. The failing assertion is `hashFindings.length` (actual 0, expected 1, at test line 288 of that commit).
   - Reverted with `git checkout -- scripts/plan/verify-quotes.mjs` (rc 0). Porcelain with untracked files: 0 bytes.
   - No `verify-mutation` run was used as an observation.
3. **The sheet's pin.**
   - `git show ed8731a7…:DECISIONS-PENDING.md` (rc 0) is 708,850 bytes of LF-only UTF-8.
   - Its sha256 is 23e5ffb165c8d0e57a217f3d9b29ff7c7534175c69e7f05158612fe89da7c3c8, which equals the sentence.
   - `git rev-parse <rev>:DECISIONS-PENDING.md` gives 2788e5728604883e31af5f2206f04125db49310e (rc 0 each) at ed8731a7, 81b350f5, fbd75211, the head e174f367, and d2045496 (origin/main).
   - fbd75211 and 81b350f5 are both ancestors of origin/main (rc 0).
4. **The struck dry run** from `C:/dev/wt/dpa`, with the 55 extracted by script from the sheet's line 7. The list has 55 numbers, no duplicates and no 104, and it is `cmp`-equal to the PR body's list.
   - rc 0, stderr empty, porcelain 0 bytes after.
   - `kept (24)`: 115 113 112 111 110 109 108 107 104 102 95 74 72 71 70 62 59 58 48 46 42 39 2 1, the sheet's table in order.
   - `archived (298)`: blocks 2 + 14 + 182 + 3 and 42 marked entries make 243, plus 55 named.
   - `77060 bytes`. The blob at today's P is per N-1; at fbd75211 the blob is 7db1ac1f9f7bcacec047622a835d2143ae5f3e31 by the module-level rebuild (rc 0).
5. **The sheet's counts, recomputed by script from its rows** (rc 0):
   - 243 archived rows: done 633, represented 131, not represented 24, no obligation 131. Entry 118's new clause reads "no obligation in this unit…", so a strict `no obligation:` match gives 130; the lenient match gives 131.
   - 22 rows carry `not represented`. The not-represented list is those 22 rows, byte-equal and in order.
   - The 55 struck entry rows: done 93, represented 11, no obligation 22, with 0 not represented.
   - Of the 79 entry rows, 63 are RULED. Eight carry not represented: 113 112 95 62 48 107 104 102. The rule "RULED and no not-represented clause" derives exactly the 55 (entry 5's status is "RULED (read from…").
6. **The PR body** (`gh pr view 232`, rc 0; head e174f367, draft, open; no CR bytes). Its lines 78 to 80 against my gate 1 report's D-1 words, taken from `git show d2045496:` of the filed report with the 2-space indent and the outer quotes stripped: `cmp` rc 0, both sha256 fb2d5b80c0ca9e3021c939d9aa46c2aae6736266a2055c063bf858f7d9a68bd9.
7. **§8 item 7.** `cmp -n 99811 <(git show 564aadae:AUTONOMY.md) <(git show HEAD:AUTONOMY.md)`: rc 0.
8. **§7's counting command at the head.** numstat rc 0; awk gives `858 15`. `rotate-decisions-pending.test.mjs` is 307 against its 380, and the total is within 1,260 over 16. The two per-file overruns recorded in Amendment 3 item 7 are unchanged, and §7's line is not edited.
9. **Suites at the head**, in my throwaway worktree checked out at e174f367, porcelain 0 before and after:
   - CI's `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, inside a shared hold (MACHINE_HOLD granted, MACHINE_RELEASED printed): rc 0, 509 tests, 509 pass, 0 fail.
   - `verify.mjs --offline`: rc 0, PASS.
   - `verify-cites.mjs`: rc 0, 2066 files, 53 advisory.
   - `verify-quotes.mjs`: rc 0, 0 hash-reference errors.
   - `verify-test-claims.mjs`: rc 0, 571 claims.
   - `verify-mutation.mjs`: rc 0, 26 of 26, R11 listed ok.

My throwaway worktree is removed (`git worktree remove` rc 0; it no longer appears in the worktree list or on disk). `C:/dev/wt/dpa` is clean at e174f367. I made no commit, push or PR action, and wrote nothing outside my scratch folder and that worktree.

Files: `C:/dev/wt/dpa/scripts/plan/rotate-decisions-pending.test.mjs`, `C:/dev/wt/dpa/AUTONOMY.md`, `C:/dev/wt/dpa/state/drafts/decisions-pending-c-obligations.md`, `C:/dev/spatial-ide/scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md`
