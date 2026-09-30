*Custodian's filing note (2026-09-30): the reviewer's gate on PR #145 after correction round 2, for PLAN node `filter-bind-admission-implicit-coercions` at generation 4, the node's attempt 3. Reviewed: cut/filter-bind-coercions @ 53c6e3eca88e45a5a0f43f0be2fd28a9d9210920 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 53c6e3e. Its mutation table is the observation of record at 53c6e3e. Its N1, a code defect in NULL-literal arithmetic that it calls non-blocking, goes to the architect for a ruling with the confirmation of the comment-only reduction. After the gate, the probe file was confirmed absent and the worktree clean. Profile paths redacted at filing: none.*

---

Reviewed: cut/filter-bind-coercions @ 53c6e3e

**Overall: PASS.** All seven of my attempt-2 findings (B1–B7) and the architect's B3 are resolved at 53c6e3e. All twelve mutations fail by name, and every suite and CI job is green. There are no blocking findings. One code defect in NULL-literal arithmetic remains (N1). It is non-blocking, and the architect should look at it because it meets the letter of one §5 invalidator.
- **Correctness: PASS.** Severity low. Scope: `engine/src/predicate.rs`, rule 2 in arithmetic only (N1). Disposition: land; N1 goes to a follow-up node or the architect's call.
- **Evidence: PASS.** Severity: none blocking. Scope: B-T1, B-T1b and B-T3 at head. Disposition: none needed; my mutation table below is the observation of record.
- **Documentation: PASS.** Severity: record-only (N2, N3). Disposition: no change needed.

How the behaviour was probed: I added an untracked `engine/tests/zz_reviewer_probe.rs` using the FX-1 spec, `AdmittedPredicate::admit`, a full stream and `json_serialize_plan`. I ran it with `cargo test -p spatial-engine --locked --test zz_reviewer_probe -- --nocapture`, then deleted it; `git status --porcelain` was empty afterwards. All DuckDB behaviour below is at v1.5.5.

### Items
1. **Attempt-2 findings, re-probed.**
   - B1, resolved. `i16 BETWEEN f32 AND i64` is refused `BETWEEN`, `["REAL","BIGINT"]`, `conversion_rounds`. `i32 BETWEEN i64 AND f64` is refused `["BIGINT","DOUBLE"]`, `conversion_rounds`. `check_between` (predicate.rs:2168) now checks all three pairs.
   - B2, resolved. `u64 * -9223372036854775808 < 0.5` is refused `<`, `["HUGEINT expression","DECIMAL(2,1) literal"]`, `conversion_can_fail`. Rule 4 is now limited to 64 bits (`int64_or_literal`, line 2001).
   - B3, resolved. `(i32 > 0) = flag`, `(i32 > 0) IS NOT NULL` and `flag = (zone LIKE 'c%')` are admitted. Their plans cast only constants, and the streams end without error.
   - B4, resolved. `(f32 + 1e3) = i32` is admitted. The plan's `+` returns DOUBLE, and B-T1b now compares the walk's own type with the plan's (see M12).
   - B5, resolved: see item 4.
   - B6, resolved. The OPERATOR arm now refuses (line 2303), and so does `comparison_construct_name` (line 2117).
   - B7, resolved. predicate.rs:227 and kernel/src/skp.rs:1989 now say "thirteenth". I checked with `grep -n -i "eleven\|twelfth"`: the two hits left, predicate.rs:107 and :374, are correct as written.
   - Architect's B3 (arithmetic rules 1 and 2) is resolved for C31 and C32. `f32*f32`, `f64+f64`, `i32+NULL`, `NULL*f32` and `-NULL` are all admitted, with only NULL cast. The remaining edge cases are N1.
   - Attempts to break the new code. No unsound admission found:
     - BETWEEN with mixed literals and columns: 12 triples (e.g. `i64 BETWEEN 0.5 AND u64` and `u64 BETWEEN -1 AND i64` admitted; `i16 BETWEEN 1e3 AND i64` and `i32 BETWEEN 16777217 AND f32` refused). Every admitted plan casts only within §7's set.
     - Nested boolean nodes: 12 predicates behave correctly, e.g. `(i32 AND flag) = flag` refused `boolean_conversion` and `zone = (i32 > 0)` refused `text_with_non_text`.
     - Boolean nodes inside arithmetic: all six are refused `rejected_by_binder` before the walk runs.
2. **Code review, ff3a841 to 42a8c73.** Command: `git diff ff3a841 42a8c73 -- engine/src/predicate.rs kernel/src/skp.rs engine/tests/filter_type_admission.rs`, 3 files, +766/−413.
   - BETWEEN pairs are checked in Amendment 4's order.
   - Unary `-` accepts a NULL literal, as §2.5(b) now says.
   - The value-position arms now match `walk_expr`'s one to one.
   - Rule 6 widens to DOUBLE beside a double literal.
   - `determine_reason` refuses a wide integer expression beside a decimal literal as `conversion_can_fail`, which is §2.6 item 4.
   - B-T1's `is_declared_cast` is tightened to §7 (HUGEINT only; a DECIMAL target only from a source of at most 64 bits).
   - The delta has no new `pub` item: `git diff ff3a841 42a8c73 -- '*.rs' | grep -E '^\+' | grep -E '\bpub\b'` matches only a doc comment. No file value appears in any field. The only defect found is N1.
3. **Mutations**, each observed by me at 53c6e3e: applied with `sed`, the named test run, reverted with `git checkout -- <file>`, and `git status --porcelain` empty after every one.

| # | Test | Mutation | Failure observed |
|---|---|---|---|
| M1 | B-T1 | line 2017: rule 5 `int_le(·,32)` changed to 64 | FAILED, 72 counterexamples, including `cmp = i64 lit:dbl: undeclared cast column BIGINT -> DOUBLE` |
| M2 | B-T1 | lines 2185–6: the lower–upper pair not checked | FAILED, 56 counterexamples, including `between-triple i16 BETWEEN f32 AND i64: undeclared cast column BIGINT -> FLOAT` |
| M3 | B-T2 | lines 2021–2: rule 6(i) restricted to decimal literals | FAILED: `f32 = 16777217: expected admitted, got refused` |
| M4 | B-T3 | line 1251: `MAX_INTEGER_LITERAL_DIGITS = 21` | FAILED: `C14 ("i64 = 100000000000000000000"): expected TypeNotAdmitted, got Ok` |
| M5 | B-T4 | line 191: `type_walk` commented out | FAILED: `"zone = 1": expected a TypeNotAdmitted refusal, got Admitted` |
| M6 | B-T5 | same | FAILED: P1 ×4, P4 ×1 |
| M7 | B-T7 | same | FAILED: `a text/non-text coercion must be refused…` (a ticket was minted) |
| M8 | B-T6 | skp.rs:2070: the arm maps to `filter_rejected_by_binder` | FAILED: `left: "skp.filter_rejected_by_binder"` |
| M9 | B-T8 | FX-4 line 7: `"reason"` renamed `"reasons"` | FAILED: `exact key set` |
| M10 | B-T9 | same rename; `npx vitest run …fixtures.test.ts` | FAILED (× 1): `"reasons"` against `"reason"` |
| M11 | B-T10 | `type_of_value`'s final arm returns `Ok(Boolean)` | FAILED: `expected ConstructNotAdmitted…, got Ok(Typed…)` |
| M12 | B-T1b | lines 1896/1903: rule 6 returns the column's own type (the ff3a841 behaviour) | FAILED, 10 counterexamples, e.g. `arith + f32 1e3: the walk says FLOAT, the plan's + return_type says DOUBLE` |

   An extra check, beyond the twelve: forcing division to DOUBLE (line 1798) makes B-T1b fail with 37 counterexamples (`arith / i8 f32 …`). So B-T1b does check `/`'s own node, as Amendment 4 requires.
4. **Counts, all at filter_type_admission.rs.** B-T1's five parts are each checked with `assert_eq!`: 7,620 (line 1073), 18 (1075), 323 (1081), 16 (1087) and 1,728 (1089), and the total 9,705 (1102). B-T1b asserts its case count, 2,083, at predicate.rs `assert_eq!(cases.len(), 2_083, …)`. The number of nodes it actually compares (897 in my baseline `--nocapture` run) is only printed; the code asserts just that it is above zero (N2).
5. **Suites.**
   - `cargo build --workspace --tests --locked`: rc 0.
   - `cargo test --workspace --locked`: rc 0. 87 `test result` lines, 811 passed, 0 failed, 40 ignored.
   - `npm run verify`: not rerun. `git diff --name-only ff3a841 53c6e3e -- frontends/` is empty, B-T9 ran under M10, and the shell CI job is green at 53c6e3e.
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0 (353 of 353).
   - `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs`: rc 0 each, PASS.
6. **CI.** `gh pr checks 145`, head 53c6e3eca88e45a5a0f43f0be2fd28a9d9210920 (rc 0), every line:
   - cargo test --workspace (windows-latest): pass 17m36s and pass 16m13s
   - every commit is signed off: pass 5s
   - tauri build (NSIS…) ×2: pass 5m8s and 4m26s
   - test · verify:plan · queue/site drift: pass 1m3s
   - typecheck · build · vitest · cargo test ×2: pass 5m3s and 5m35s
   - `gh run view <id> --json headSha` gives 53c6e3e for all six runs.
   - Observed CI times: B-T1 about 81 s (05:32:42 to 05:34:03) and the B-T4+B-T5 binary about 17.5 s.
7. **Formatting.**
   - `node …/fmtcount.mjs --where` exits 1: 1 hunk touching an added line, at `engine/src/lib.rs:126`, the known one that is already on main.
   - 42a8c73 is formatting only. Both files hash the same at ec98415 and 42a8c73 with whitespace and `,{};` removed (`git show <c>:<f> | tr -d ' \t\r\n,{};' | sha256sum`): predicate.rs 7006c55d…, filter_type_admission.rs cd0e5c82….
8. **Budget.** `git diff --numstat origin/main...<c>` with §7's exclusions gives 25 files, 3,214 + 244 = 3,458 at 42a8c73 and the same at 53c6e3e. Amendment 5's figure holds. `git diff --stat 42a8c73 53c6e3e -- ':!*.md'` is empty, and the data-plane diff is empty.
9. **Discharge claims and scope.**
   - `grep -inwE 'done|fixed|discharged'` finds none in the round-2 delta (rc 1) and none in report 3.
   - Report 3's row claims are proved by B-T3 at head, which passes: C29 and C35/C36 check operand types exactly, and C34 and C37 are admitted.
   - Everything in the delta maps to W1–W12 or Amendment 4. The C25/C27 assertions in B-T3 are Amendment 4 wording, grouped under "W7–W9".

### Non-blocking
- **N1 (code defect, low).** Arithmetic rule 2 (predicate.rs:1882) types `NULL op x` as a plain expression marked within bounds. All cases below evaluate to NULL, and none cast file data unsafely.
  - (a) `NULL + NULL > 0` is refused `conversion_rounds`, but rule 2 applied pairwise per §2.5(a) admits it, and the binder binds it. This is §5's "a refusal that no five-reason sentence states truly", so the architect rules. The fix is bounded: admit NULL with NULL.
  - (b) `NULL - 0.5 > 0` is refused `conversion_rounds` with no file value involved.
  - (c) `i64 < NULL + 0.000000000000000000000000001` gets `conversion_rounds`, not `literal_out_of_bounds`.
  - (d) The out-of-bounds flag is lost: `i64 = (NULL + 170141183460469231731687303715884105728)` is admitted. The plan casts the constant UHUGEINT to HUGEINT; the stream returns 0 batches with no error.
- **N2 (record-only).** B-T1b's 897 compared nodes are printed but not asserted beyond `checked > 0`. Report 3's "897 compared" matches my run's output.
- **N3 (record-only).** Report 3's mutation table is labelled "ec98415→42a8c73"; my table above is the observation at this head.
- **Observation, out of scope.** `u64 BETWEEN (u64 - 1) AND 0.5` ends with "Overflow in subtraction of UINT64 (0 - 1)", which carries a file value. This is the §2.5(d) class, routed to node `stream-evaluation-failure-fixed-detail`.
- No process of mine is left (checked with `tasklist`), and porcelain is clean.
