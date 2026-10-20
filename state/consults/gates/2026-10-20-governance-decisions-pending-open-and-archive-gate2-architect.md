Reviewed: PR #232 at e174f367adf1ede1ab2d711ead72045c8a7a8880 (base d2045496), gate 2 at G0, architect, scoped to round 1 and the custodian's words — cut/decisions-pending-open-and-archive @ e174f367adf1ede1ab2d711ead72045c8a7a8880
Verdict: PASS WITH NOTES

I confirmed the head from the branch ref (e174f367). The branch reflog shows 904ea7c1, 9fc4f2c6 and b83681d8 after 6b8b3688, then e174f367. Every cite below is at e174f367 unless it says otherwise.

I had no shell. So I did not run the tests, MT4, `git diff`, any sha256 or blob id, or `gh pr view`. For the PR body I read the custodian's scratch copy `pr232-body-r1.md`, not the live body. I worked out what the diff touched from the reflog subjects and from the files I read.

## Correctness
None.

## Evidence
None open. E-1 is resolved; see below. The reviewer still has to re-run MT4.

## Documentation (fix before the merge, no re-gate; none of it is the human's wording, so the worker applies the words and the PR body lists them)

**D-1. MR11b's comment says "only this one" outside the scope that comment block declares.**
- Where: `scripts/plan/rotate-decisions-pending.test.mjs:101`.
- The block header (`:88-89`) says each mutation was applied to `rotate-decisions-pending.mjs` and "the file run".
- MR11b mutates `verify-quotes.mjs` instead, and it does not name MT4.
- The same mutation is MT4. MT4's own record says it fails T4 (`scripts/plan/verify-quotes.test.mjs:977-984`). Read across the whole suite, "and only this one" is therefore not what the run showed.
- Replace line 101 with:
  `// RECORDED MUTATION (MR11b, MT4 re-made) at 904ea7c1a09e, applied alone and reverted (the porcelain clean after), this file run: the archives left out of the hash-scan list in `scripts/plan/verify-quotes.mjs` (only the live file kept) -> fails by name, and only this one of this file's tests: `rotate-decisions-pending: after a rotation commit the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference`. MT4's own record, in `scripts/plan/verify-quotes.test.mjs`, names T4; that file was not run here.`
- Clause check:
  - "MT4 re-made": the mutation text is the same as MT4's (`verify-quotes.test.mjs:977`), and Amendment 5 item 1 asks for MT4 to be recorded again.
  - "this file run" and "only this one of this file's tests": the round-1 report ran `node --test scripts/plan/rotate-decisions-pending.test.mjs` and got exit 1, pass 11, fail 1, with R11 the only failure.
  - "that file was not run here": the report lists no other file run while the mutation was applied.

**D-2. The PR body's L<n> labels carry no pin.**
- Where: the PR body (scratch copy), under "Every row not represented, for your word before the merge". The rows are labelled L14 to L3893.
- My gate 1 D-1 gave the sheet and the eight passes a pin sentence. The PR body did not get it.
- Add as the second sentence of that section's paragraph: "L<n> is the line of the unit's head in `DECISIONS-PENDING.md` at ed8731a7, the sheet's whole-file pin (its header); a historical pin, never read as current."
- Clause check: the sheet's header (`state/drafts/decisions-pending-c-obligations.md:3`) defines L<n> the same way, as the dry run's `u.line` (`rotate-decisions-pending.mjs:53`, `:173`).

## Gate 1 findings
- **E-1 (both gates): resolved, subject to the reviewer's MT4 re-run.** R11 is at `rotate-decisions-pending.test.mjs:263-295`.
  - `T.md` is committed first, and `v1` is that commit (`:267-268`).
  - Two references are pinned at `v1`: `ok` is the sha256 of all of `T.md`, and `bad` is `sha('a wrong figure')` (`:269-270`). Both are in the moved RULED block (`:272`). The ledger is committed after `v1` (`:274`).
  - It asserts exactly one finding, on the archive path, whose reason matches `/sha256 mismatch/` (`:289-291`).
  - Checked against the real shape:
    - The real ledger's one pinned reference has the form `` `path:a-b` @ <rev> sha256:<hex> ``. The fixture has the same form with a full rev.
    - `HASH_REF_RE` accepts both forms (`verify-quotes.mjs:562-566`), and the mismatch reason is the text at `:778-782`.
    - If the valid reference were not parsed, `findUnboundHashTokens` would report it, so the count would not be one.
    - With MT4 applied, the archive is not in `defaultHashScanFiles` (`:406-414`), and `defaultScanFiles` does not match `DECISIONS-PENDING-*.md`. That gives 0 findings, so R11 fails at `:289`.
  - MT4's record sits right beside it (`:101`); see D-1 above.
- **Architect D-1: resolved.**
  - My gate 1 words appear in 9 of 9 files, matched byte for byte by one Grep across `state/drafts`: the sheet's header (`:3`) and each pass's filing note.
  - The hex `23e5ffb1…c3c8` is filled in. I could not recompute it.
  - Blob 2788e572 at ed8731a7 and at 81b350f5 rests on gate 1's reviewer. For fbd75211 I have only the commit message (`COMMIT_EDITMSG`) and an inference:
    - The dry run in the sheet (`:9`) names P fbd75211 and lists units.
    - The script refuses when HEAD's `DECISIONS-PENDING.md` blob differs from origin/main's (`rotate-decisions-pending.mjs:134-136`).
    - So that run implies the branch blob equals fbd75211's. I did not run it. The reviewer recomputes the hex and the four blob ids.
- **Architect D-2: resolved.** The words match byte for byte, end the row and are the whole of `:291` after its done clause.
- **Architect D-3: resolved.**
  - Entry 104's row (`:376`) holds no `verify-test-claims` done clause. My words match byte for byte, sit last in the row, and their full stop ends the line (checked with a Grep anchored by `$`).
  - The struck list (`:7`) has 55 numbers and no 104. The kept table (`:13-38`) has 24 rows: 8 RULED-but, 5 PARTIAL, 3 RECORD ONLY and 8 NONE FOUND. 55 + 24 = 79. 55 + 8 = 63, the number with a ruling found.
  - A Grep for `RULED` over the 55 struck E-rows gives 55. The same rows with `not represented` give 0.
  - New file size: 77,060 − 72,298 = 4,762. That is 4,678 (entry 104) plus 80 (its archive line, with a 4-digit line number) plus 4 newlines, which matches `buildLiveText` (`:84-87`).
  - Amendment 5 item 4's quote of Amendment 4 item 4 matches its source.
- **Reviewer D-1: resolved in the scratch copy.** Its words match. The live body was not read.
- **Reviewer D-2: resolved.**
  - `AUTONOMY.md:663` matches the reviewer's words byte for byte (Grep, count 1 in each file).
  - Against the code: blocks are matched by `BLOCK_HEAD_RE` (`rotate-decisions-pending.mjs:28`, `:67`). The bracketed marker is `MARKED_RE` (`:30`, `:68`). Strikes are `named.has` (`:69`). "Every other numbered entry stays" is `:70`.
- **Reviewer D-3: resolved.**
  - `:42` matches the reviewer's sentence byte for byte.
  - I counted the clauses in the 55 struck E-rows by hand (`:319-397`): done 93, represented 11, no obligation 22. These match `:43`.
  - The difference from 96 and 23 is entry 104's old row (three done clauses and one no-obligation clause).

## What I checked against the code
- Keeping entry 104 does not change the predicted D1-b:
  - The ledger holds one `sha256:<hex>` token in all (Grep), and it is outside entry 104. So the live copy of 104 adds no hash finding.
  - No `withdrawn-test` row names round 12 or entry 104 as a carrier (Grep across `*PREREGISTRATION.md`), so splitting the round-12 block from entry 104 breaks no resolution.

## What still blocks F0 at G0
Nothing beyond what waits on the human:
- the redaction;
- the 22 rows not represented (24 clauses). The round-12 row now also stands behind entry 104;
- the predicted D1-b file count.

These two fixes and one check do not block:
- D-1 and D-2 above, which take no re-gate;
- the reviewer's recompute of the sheet's sha256 and of the fbd75211 blob.

Gate 1's note 6(b) still holds: the scratch body says the 2026-10-20 RULED block is held.

Outside this gate's scope, so not a finding: the rotation script's header comment (`rotate-decisions-pending.mjs:9-10`) still says "carries a … marker" without "bracketed".

Files:
- C:/dev/wt/dpa/scripts/plan/rotate-decisions-pending.test.mjs
- C:/dev/wt/dpa/scripts/plan/rotate-decisions-pending.mjs
- C:/dev/wt/dpa/scripts/plan/verify-quotes.mjs
- C:/dev/wt/dpa/scripts/plan/verify-quotes.test.mjs
- C:/dev/wt/dpa/AUTONOMY.md
- C:/dev/wt/dpa/state/drafts/decisions-pending-c-obligations.md
- C:/dev/spatial-ide/scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md
