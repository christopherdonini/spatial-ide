# PR #205 gate 1 — reviewer
Reviewed: cut/known-limitations-item-2-on-main-paragraph @ dd01801e811a521c5c4583499ca1cca428b9b018

**Verdict: FAIL, on one Correctness finding (C-1).** One clause of the human's paragraph is wrong at the base. Following the form's own Change line, it goes to the human before the merge and is not reworded. Every mechanical check passes: the byte-copy, the scope, the 8 pins, the governance scripts and CI. The worktree is clean at the head.

## Correctness

**C-1 (blocking). A clause is wrong at base 4fd3259a, and the "Still refused" list leaves out a refusal.**
- The clause is in the new paragraph at `KNOWN-LIMITATIONS.md:60`: "A file with no `crs` key opens as OGC:CRS84, which is the format's own rule, and the summary records it as `crs:format-default`."
- At the base, a file with no `crs` key under a pinned version does not always open:
  - The sanity check runs before the dataset exists, at engine/src/dataset.rs:522-532 @ 4fd3259a.
  - Under `CrsProvenance::FormatDefault`, `convicts` is true (engine/src/dataset.rs:1223 @ 4fd3259a).
  - The open is then refused as `engine.format_default_contradicted` whenever the file's `geo` bbox, its covering statistics or its first-row-group covering sample leaves ±180/±90 (engine/src/dataset.rs:1338-1351 @ 4fd3259a).
  - The refusal's Display is at engine/src/error.rs:330-336 @ 4fd3259a.
  - The test that proves it is `f2_coordinates_outside_the_domain_convict_the_format_default`, at engine/tests/admission_format_semantics.rs:149-171 @ 4fd3259a. It writes a file in metres with no `crs` key and expects `FormatDefaultContradicted`.
- Example: a projected file with no `crs` key and a footer bbox outside ±180/±90 is refused, not opened.
- The paragraph's "Still refused:" list does not name this refusal.
- No other line of `KNOWN-LIMITATIONS.md` names `format_default_contradicted`. Item 22 says only that the check "can flag" such a coordinate.
- The paragraph is the human's verbatim text, so I propose no wording. The human asked to be told when a clause is wrong (state/directives/2026-10-10-drift-sweep-area-e-instructions.md:7).
- Every other clause holds at the base:
  - pinned versions: geoparquet.rs:37
  - absent key gives OGC:CRS84 / `crs:format-default`: geoparquet.rs:556-571, :95
  - the summary renders the provenance verbatim: frontends/shell/src/admission/describeSummaryText.ts:48
  - latitude-first gives the WKB order / `axis:format-override`, with the declared order kept: geoparquet.rs:531-540, :599-604; dataset.rs:441-487
  - nothing is transformed: geoparquet.rs:597-598
  - explicit `null` is still refused: geoparquet.rs:555; dataset.rs:415
  - a latitude-first assertion is still refused: dataset.rs:411-426
  - an unpinned version is still refused: geoparquet.rs:541-552, :572-581; dataset.rs:398-404, :422

  All of these are @ 4fd3259a.

## Evidence

**E-1 (part of C-1's fix).** Two records say every clause holds, and that is not true:
- the PR body: "Every clause was checked against the code at the base and holds."
- the worker report on main: "Every clause of the paragraph is true at the base, so nothing goes to the human."

The PR body has to state the outcome once the human rules.

## Documentation (must fix before the merge)

- **D-1.** The PR body says "There are 2 files under §21c's bounds". The diff changes 1 file. The form's Scope declares 2 because it includes PLAN.yaml, which this branch does not touch. Say which count is meant.
- **D-2.** The PR body says "`git merge-base origin/main H`". It should say `HEAD`.

Not a finding: the new paragraph has no source comment. The file header says each line carries one, but item 3's on-main paragraph (line 70) sets the same precedent, and the form's Change allows nothing beyond the byte-copy.

## Checks
1. **Out-of-scope line: true.**
   - The change touches no ADR file, nothing under protocol/ or scripts/plan, no code, no test and no app string. It records behaviour that already exists in code and changes no guarantee.
   - Within §21c's bounds: 8 changed lines (5+, 3−) in 1 file, against limits of 150 lines and 8 files.
2. **Scope: pass.**
   - `git diff --numstat origin/main...HEAD` (rc 0) shows only `KNOWN-LIMITATIONS.md` (5, 3).
   - The changes are item 2's appended paragraph plus a blank line, and one comment line each in items 19, 20 and 22.
   - Nothing above the new paragraph in item 2 changed, and the crs_undeclared quote is untouched.
3. **Byte-copy: pass.**
   - `cmp` of instruction line 9 against `KNOWN-LIMITATIONS.md:60`: rc 0.
   - Both hash to sha256 846786d76d40004eea476f77aecc0c531fa71046736393675fde31d05863cd23.
   - The three leading spaces are present, and the file has no CR bytes.
4. **Clauses against the base:** see C-1.
5. **Pins: all 8 recompute** with `git show 4fd3259a:<path> | sed -n a,bp | sha256sum`. Each lands on the line its sentence means:
   - error.rs:377-382, SourceChanged Display
   - dataset.rs:319-327, the R-I4 gate
   - dataset.rs:1646-1686, `partitioned_source_detail` with GLOB_METACHARACTERS
   - error.rs:383-388, the partitioned Display
   - skp.rs:2092-2095, the wire code
   - dataset.rs:1206-1223, `rule` and `convicts`
   - dataset.rs:1352-1362, the non-convicting branch
   - dataset.rs:1166-1217, the doc comment through the NotChecked return

   Other confirmations:
   - Each old cite lands on unrelated code at the base (for example, error.rs:342 is `),`).
   - 4fd3259a is on main.
   - Every pin sits contiguous on one line.
   - `verify-quotes --show-cites KNOWN-LIMITATIONS.md` reports [hash: PASS] for each pin.
6. **Governance scripts, run at the head, all exit 0:**
   - `node scripts/plan/verify-cites.mjs`: PASS, 1685 files, 49 loose advised.
   - `verify-quotes.mjs`: PASS. 121 checked, 0 hash-reference errors. Its 1 advisory is in engine/ADMISSION-PREREGISTRATION.md, not this diff.
   - `verify-test-claims.mjs`: PASS, 534 claims.
   - `verify.mjs`: PASS.
   - `queue.mjs --check`: current.
   - `site.mjs --check`: current.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 457 pass, 0 fail.
7. **CI:** `gh pr checks 205` (rc 0) printed four lines, none pending:
   - cfg boundary (PORTABILITY R2): pass
   - every commit is signed off: pass
   - no profile path in the range: pass
   - test · verify:plan · queue/site drift: pass
8. **PR body and commits:**
   - The head in the body matches dd01801e.
   - The title, the body and both commit messages carry no outside issue or PR reference and no @mention.
   - The body's errors are E-1, D-1 and D-2.

The worktree `C:/dev/wt/kl2` is clean at dd01801e811a521c5c4583499ca1cca428b9b018. I made no commits and wrote no files outside my scratch folder.
