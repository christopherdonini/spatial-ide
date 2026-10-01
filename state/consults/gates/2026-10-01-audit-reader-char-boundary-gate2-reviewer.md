*Custodian's filing note (2026-10-01): the reviewer's gate 2 on PR #152, scoped to correction round 1, for PLAN node `audit-reader-char-boundary` at g1. Reviewed: cut/audit-reader-char-boundary @ ad728d94b3d929f05acb5f08fb76c667c0ab170d (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 12:30:12Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at ad728d9. Its M1 and M2 observations on T2 at ad728d9 are the observations of record for this round (its N2). Its N1, the six pending CI jobs, is read before the merge. Profile paths redacted at filing: none.*

---

Reviewed: cut/audit-reader-char-boundary @ ad728d94b3d929f05acb5f08fb76c667c0ab170d
Verdict: PASS, scoped. B1 from gate 1 is discharged. The only open item is CI, which is still pending (N1).

## Checks

1. **Diff `1b112b1..ad728d9`.** One file changed, +7/−2.
   - The only changes are T2's `at` literal and T2's doc comment.
   - The literal is at kernel/src/permission/audit/reader.rs:464 @ ad728d9. `od -c` on that line reads `r " 2 0 2 6 - 0 8 - 1 7 T 0 8 : 4 \ u 0 0 e 9 " ;`, so the raw string holds backslash, u, 0, 0, e, 9 and no `c3 a9` bytes.
   - `stored` and every assertion are untouched.
2. **Tests at ad728d9.**
   - T2 `each_sentence_whose_at_cuts_a_character_at_byte_16_starts_with_the_stored_value` passes.
   - `cargo test -p spatial-kernel`: rc 0. lib 137 passed, publish-bundle bin 5 passed, 0 failed in any binary.
3. **Mutations:** see the table below.
4. **rustfmt 1.9.0 over stdin (reader.rs).**
   - 13 `Diff in` at 1b112b1 and 13 at ad728d9.
   - The hunks at ad728d9 are at stdin lines 173–431. None reaches T2, which is around line 458 onward.
   - §7 by the form's command, merge base 7d7ea70 (`git diff --numstat 7d7ea70...ad728d9` plus the form's exclusions): publish-bundle.rs 18/0 and reader.rs 78/21. That is 117 of 175 over 2 files, so no overrun and no class 8.
5. **`gh pr checks 152`** (rc 8; head oid ad728d9 confirmed).
   - Passed: `every commit is signed off`, run 36861662749.
   - Pending, by run id:
     - `cargo test --workspace (windows-latest)`: 36861662513 and 36861657831.
     - `typecheck · build · vitest · cargo test`: 36861663074 and 36861658400.
     - `tauri build (NSIS, build-only, no signing)`: 36861658400 and 36861663074.

## Mutation observations of record (at ad728d9; each edit applied to reader.rs:201, T2 run, reverted with `git checkout`; porcelain empty after each)

| Mutation | Test | Result | Panic |
|---|---|---|---|
| M1: `at.is_char_boundary(16)` changed back to the base text `at.len() >= 16` (7d7ea70 reader.rs:195) | T2 | FAILED, rc 101 | reader.rs:202:41, `end byte index 16 is not a char boundary; it is inside 'é' (bytes 15..17 of string)` |
| M2: `is_char_boundary(16)` changed to `is_char_boundary(15)` | T2 | FAILED, rc 101 | the same panic, location and message |

Both mutations were applied by editing the file and running the test. Neither was a `verify-mutation` run.

## Blocking

None.

## Non-blocking

- **N1.** Six CI jobs are pending at ad728d9 (run ids above). Read them before merge.
- **N2.** T2's doc (reader.rs:454-461 @ ad728d9) dates both mutations at efe19e6. The observations of record for this round are at ad728d9. The two commits differ only in that doc comment, so the code is the same, but the closing record should name ad728d9 as the commit of record.
- **N3.** T2's doc states M2 twice: in the first paragraph and again at the end of the new M1 paragraph. The second mention adds nothing.
- **N4.** The worker report (state/consults/2026-10-01-audit-reader-char-boundary-worker-report-2.md:12) shows the literal with an é. The custodian's filing note at line 6 already corrects this, and the file bytes above confirm the correction.

## Paths

- C:/dev/wt/audit-reader-char-boundary/kernel/src/permission/audit/reader.rs
- C:/dev/wt/audit-reader-char-boundary/kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md

The worktree is clean at ad728d9. Main was not touched.
