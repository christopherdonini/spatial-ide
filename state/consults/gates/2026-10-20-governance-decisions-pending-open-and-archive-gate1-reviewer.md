Reviewed: PR #232 at 6b8b3688ea0a99978ce9d641fef6dd6df6f1e38c (base e7430b420cfe73c8ecf5b93fcc606ede6ac1345f), gate 1 at G0, reviewer
cut/decisions-pending-open-and-archive @ 6b8b3688ea0a99978ce9d641fef6dd6df6f1e38c
Verdict: FAIL

The FAIL rests on one Evidence finding, and the fix is a change to one test. There are no Correctness findings. The code, all 26 recorded mutations, all 53 hashes, the sheet, the struck dry run and both blob equalities hold.

## Correctness
None.

## Evidence (blocking)

**E-1. R11's hash-reference part proves nothing.** R11 is the end-to-end seam test from the real rotation (§4, and §9 lists it as a seam test). Its name claims "the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference".
- **What I ran.** At d7ebd86ba827 in my throwaway worktree I applied MT4 (the archives left out of the hash scan in `verify-quotes.mjs`) and ran `node --test scripts/plan/rotate-decisions-pending.test.mjs`. Exit 0, pass 12, fail 0: R11 still passes.
- **Why it passes.** R11's only check on this part is the assertion copied below. When the archive is never scanned, it finds nothing, so the assertion passes.

  `assert.equal(quotes.hashFindings.length, 0, JSON.stringify(quotes.hashFindings));`
- **The shape is also wrong.** The fixture's reference has no `@ <rev>`, so it is not pinned. §3 asks R11's repository to hold "a pinned hash reference", and the real ledger's one hash reference is pinned (§0).
- **The other three parts work.** At d7ebd86ba827, MT1a (verify.mjs), MT1b (verify-test-claims) and MV1 (verify-cites) each fail R11 by name.
- **T4 does not close the gap.** T4 proves the reader on a hand-built archive (MT4 fails T4, re-observed). It is not the end-to-end test from the rotation that the seam rule asks for.
- **Fix (test only, about 6 lines, inside the 380 budget for this test file):**
  1. In R11, commit `T.md` first.
  2. Give the moved RULED block two references, both pinned at that commit and written in the same form as the real ledger's reference: one valid, and one with a deliberately wrong sha256.
  3. Assert that `quotes.hashFindings` holds exactly one finding, with `relPath` equal to the archive path and a reason matching `/sha256 mismatch/`. This shows the valid pinned reference raises nothing and the archive is scanned.
  4. Run MT4 again at the fix commit. R11 must now fail by name. Record it in a `RECORDED MUTATION:` comment with that commit's id.

## Documentation (each must be fixed before the merge; no re-gate)

**D-1. The PR body is missing §2 item 12's S0 results and predicted D1-b.** My preview also shows that D1-b as §5 words it will differ outside its exception.
- **Preview.** In a shared clone at 6b8b3688, with origin/main set to e7430b42, I ran the struck rotation and the five checks on the staged tree and on HEAD:
  - verify-cites: stdout went from 2066 to 2067 files (the new archive path), and advisory from 53 to 74 (21 class-1 lines, and the ledger's own build.rs cite moved to the archive path at the same line, class 2). Gated: 0 in both.
  - verify-quotes, verify-test-claims and verify-mutation: stdout and stderr byte-identical.
  - verify.mjs: identical in both states. It failed in both on site drift that only appears in the clone; in a worktree at 6b8b3688 it exits 0.
- **Why it matters.** §5's stdout exception names only verify-cites's advisory count. Unless the human sees the file-count change first, I2 fires at F0.
- **Words to add to the PR body** (the worker's text, not the human's wording):

  "### S0 and the predicted D1-b
  - **S0** (the worker's report; re-run by gate 1 at M0 564aadae on the staged probe): `verify.mjs --offline` exit 1, four felt-verdict cites; `verify-test-claims` exit 1, the seven withdrawn-test rows; `verify-quotes` exit 1, no hash finding and one passage not found (`engine/LOD-PREREGISTRATION.md`, which the fourth reader covers under OPEN-2 (A)); `verify-cites` exit 1, 12 gated root-level cites, advisory 44 to 147; `verify-mutation` unchanged. No I6.
  - **Predicted D1-b** (S9 against S10): the five exit codes unchanged; `verify.mjs`, `verify-quotes`, `verify-test-claims` and `verify-mutation` byte-identical; `verify-cites` gates nothing new, its advisory list gains the unpinned `DECISIONS-PENDING.md` line cites past the new file's end (class 1), the ledger's own build.rs cite reappears under the archive path (class 2), and its stdout file count rises by one, the archive path, which §5's exception does not name: by I2 that difference is yours before the click."
- **Clause check against my runs:**
  - "exit 1, four felt-verdict cites": matches my S0 stderr (four nodes listed).
  - "seven withdrawn-test rows": 7 findings.
  - "no hash finding and one passage not found": verify-quotes printed 0 hash-reference errors and 1 not found.
  - "12 gated, advisory 44 to 147": verify-cites printed "12 unresolved" and "147 advisory", against 44 at M0.
  - "verify-mutation unchanged": same stdout sha256 (c5cd2f9c…) at M0 and in the probe.
  - D1-b clauses: the preview figures above.

**D-2. AUTONOMY.md §34 Part B (ii) does not say the marker must be bracketed.** As written it implies that any RULED, RESOLVED or APPLIED word in a head archives the entry. The code requires the bracketed shape: entry 24's head carries "RESOLVED" and was kept until it was struck. Part B is the custodian's text, marked "not a quotation", so it is not the human's wording; apply the words with no re-gate and list them in the PR body.
- **Replacement for its first sentence:** "Under `## Pending`, a RULED, DIRECTIVE, FELT VERDICTS or CLOSED block is archived, and so is a numbered entry whose head opens with a bracketed RULED, RESOLVED or APPLIED marker (`<n>. **[RULED`, `**[RESOLVED`, `**[APPLIED`) or that the human strikes (`--archive-entries`)."
- **Clause check:**
  - "block is archived": `BLOCK_HEAD_RE` matches the four kinds, and `classify` returns `archive: true` for a block.
  - "opens with a bracketed … marker": `MARKED_RE` is `^\d+\.\s*\*\*\[(RULED|RESOLVED|APPLIED)\b`.
  - "that the human strikes": `named.has(unit.number)`.

**D-3. The sheet's "Counts by resolution" (repeated in the PR body) reads as unit counts, but the numbers are clause counts.** 131 + 633 + 24 + 131 = 919, more than 243 units.
- **Replacement:** "Resolution clauses across the 243 archived units (a unit can carry several): no obligation 131, done 633, not represented 24, represented 131. Across the 56 struck entries: done 96, represented 11, no obligation 23."
- **Clause check:** my script counted 131/633/24/131 and 96/11/23 clauses.

## What I checked (exit codes from foreground runs; outputs in my scratch folder)

1. **Diff and scope.** `git diff origin/main...HEAD` (merge-base ed8731a7) gives 24 files, all in Scope.
   - Untouched, by diff at 564aadae..d7ebd86b: `rotate-cut-state.mjs`, `measure-reads.mjs`, `.claude/settings.json`, PLAN.yaml, `verify-quotes.baseline.json`, `.github`.
   - §8 item 7: `cmp -n` of M0's AUTONOMY.md against the head's exits 0.
   - The form is append-only across its five commits (each `cmp -n` exits 0).
   - §8 item 10: no `DECISIONS-PENDING…md:<n>` token in the added lines (grep -c gives 0). The form's only ledger line cite is pinned.
   - The rotation script makes no commit, push or fetch call (grep exits 1).
   - Item 11 (d): B's R2 calls `archiveNameFor('D', …)`, so the stem is mapped inside C's script. I confirm Amendment 3 item 6's reading.
   - §8 items 2 and 3, on a staged real run (below): 23 kept units, each byte-identical to its archive span; the new file holds only the title, the notice, `## Pending`, the kept units and their archive lines.
2. **Mutations.** All 26 were re-made at their recorded commits in a throwaway worktree: H at 2914103800f4, T*a at 8dd1e7af87cc, T*b at fb42c2590c9c, T4/Q at c3e70acb4914, V at a382c50813c3, R at e8d92a1aa67d, S3 at b3f90b292e57.
   - Each mutation fails its named test by name (exit 1), with exactly the same extra failures the worker recorded.
   - Each was reverted, with the porcelain empty after every revert.
   - MR12 used a scratch copy of the settings file.
   - No `verify-mutation` run was used as an observation.
3. **Hashes.** 52 pinned refs in the form, 3 in §34, and the CI span given in words (2ffe6f47…), all recomputed over LF bytes: 0 bad.
   - Every pin revision is on main.
   - §34's two `text` fences are byte-identical to the 2026-10-14 directive's lines 59–63 and 69 at 76d038d5 (`cmp` exits 0 twice).
   - READING_ORDER item 3 equals the text inside the quotes of that directive's line 62.
   - Amendment 4 item 3: of the ledger pins on main, exactly two hold the profile-path line, fbbffe89 (whole file) and e684c775 (that line).
4. **S0 and D1-a.**
   - S0 at M0 on the staged probe (the commit is refused by the profile-path pre-commit hook, as recorded): verify 1, cites 1 (12 gated), quotes 1 (0 hash, 1 not found), test-claims 1 (7), mutation 0. This is the worker's table.
   - D1-a, M0 against d7ebd86b in the same path: every exit code 0 in both. Byte-identical apart from verify-cites's file count (2023 to 2027) and verify-mutation's count (0 to 26, plus 26 ok lines).
   - `node --test` with CI's globs, in shared holds: 483/483 at M0, 509/509 at the head, exit 0 both.
5. **The struck dry run**, from the worktree with P = e7430b42: exit 0, nothing written (porcelain empty).
   - Kept 23: 115 113 112 111 110 109 108 107 102 95 74 72 71 70 62 59 58 48 46 42 39 2 1, the sheet's list.
   - 72,298 bytes, blob 009a4be91c70052d390a68f46445a09a41dc1221; stdout sha256 abe11795….
   - The real run in my shared clone (origin/main set to e7430b42) staged that same new-file blob.
   - The archive blob 2788e5728604883e31af5f2206f04125db49310e equals main's `DECISIONS-PENDING.md` blob at e7430b42 (also at ed8731a7, 81b350f5, e684c775 and b68a8bd9).
   - The staged rotation's profile-path scan refuses only the archive's profile-path line, as Amendment 3 item 5 says.
6. **The sheet, checked by script.** 243 archived rows match the parsed units in order, by line and kind. The 79 entry rows cover the unmarked set exactly.
   - 0 problems: every represented id is in PLAN at e7430b42 with a status other than done; every block field named exists; every done evidence exists (a done node, a path at main, or a merged PR among #22–#227). The three free-text done rows check out.
   - The struck list derived from the rule equals the 56 passed.
   - The not-represented list equals the 22 rows.
   - All 322 rows are byte-equal to rows of the eight passes.
7. **§7 counting command** at the head: `852 15` (git diff exit 0). The two per-file overruns are recorded as class 8 in Amendment 3 item 7, and §7's line is not edited.
8. **Checks at 6b8b3688:** verify --offline 0, verify-cites 0, verify-quotes 0, verify-test-claims 0, verify-mutation 0. The rise in verify-cites advisories (44 to 53) is main's drift.

Origin/main moved twice during this review (b68a8bd9, then d6cbda29, both docs-only; the ledger blob is unchanged). My throwaway worktree and clone under `C:/dev/wt/` are removed, and `C:/dev/wt/dpa` is clean at 6b8b3688.

Files: `C:/dev/wt/dpa/scripts/plan/rotate-decisions-pending.test.mjs` (R11), `C:/dev/wt/dpa/AUTONOMY.md` (§34 Part B (ii)), `C:/dev/wt/dpa/state/drafts/decisions-pending-c-obligations.md` (counts).
