*Custodian's filing note (2026-09-30): the reviewer's gate on PR #145, B-1's code, for PLAN node `filter-bind-admission-implicit-coercions` at generation 3, the node's attempt 2 (attempt 1 was PR #144). Reviewed: cut/filter-bind-coercions @ ff3a841ce05f698a7b81d7be25f5e982c6000585 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at ff3a841. Its mutation table is the observation of record at ff3a841. Its B1 (a `BETWEEN` with column bounds is admitted while the binder casts all three operands to one type) is a §5 invalidator of the form, so it returns to the architect before any correction code. After the gate, the reviewer's probe file was confirmed absent and the worktree clean. Profile paths redacted at filing: none.*

---

Reviewed: cut/filter-bind-coercions @ ff3a841

**Overall: FAIL.** All ten mutations fail by name at ff3a841 and every suite is green. The fail comes from the type walk itself: it admits two conversions the form forbids, one of which puts a value derived from the file into a terminal error, and it wrongly refuses three predicate shapes that bind cleanly.

- **Correctness: FAIL.** Severity high: two unsound admissions (B1, B2), and wrong refusals whose messages misstate the cause (B3, B4). Scope: `engine/src/predicate.rs`, the type walk only. Disposition: return to the worker for bounded fixes. B1 also goes to the architect, because §2.3 as written is falsified by the form's own falsification clause.
- **Evidence: FAIL.** Severity medium. Scope: `engine/tests/filter_type_admission.rs`. B-T1's enumeration is short of what §4 requires (B5), and its check (ii) never looks at the walk's own types (B4). Disposition: worker.
- **Documentation: FAIL.** Severity low (B7, two doc comments). Disposition: worker.

**How the behaviour was probed.** I added an untracked `engine/tests/zz_reviewer_probe.rs` using the FX-1 spec, `AdmittedPredicate::admit`, `stream_with_cancel(ViewportQuery::all())` and `json_serialize_plan`. I ran it with `cargo test -p spatial-engine --locked --test zz_reviewer_probe -- --nocapture`, then deleted it; `git status --porcelain` was empty afterwards. All DuckDB behaviour below is at v1.5.5.

### Blocking
- **B1 — `check_between` (predicate.rs:2049) checks the input against each bound separately, but DuckDB casts all three operands to one common type.**
  - `i16 BETWEEN f32 AND i64` is ADMITTED. Its plan casts the `BIGINT` column to `FLOAT`.
  - `i32 BETWEEN i64 AND f64` is ADMITTED. Its plan casts the `BIGINT` column to `DOUBLE`.
  - Both casts round stored values and are outside §7's cast set: §8 item 6, and the §5 falsification clause.
  - Bounded fix: also check the lower/upper pair, or refuse non-literal bounds, and add column-bound rows to B-T1. The architect rules whether §2.3 needs an amendment.
- **B2 — `is_admitted_comparison` rule 4 (lines 1887 and 1916) uses `is_int`, which admits 128-bit non-literal operands.** §2.3 rule 4 allows only an integer of at most 64 bits, or an integer literal.
  - `u64 * -9223372036854775808 < 0.5` is ADMITTED. The plan casts the `HUGEINT` result to `DECIMAL(38,1)`.
  - The stream ends with `Conversion Error: Could not cast value -170141183460469231722463931679029329920 to DECIMAL(38,1)`. That value is the file's `u64::MAX` times the literal.
  - This is not the §2.5(d) overflow class. It breaks §1's "carries no value read from the file".
  - Fix: limit non-literal operands to at most 64 bits in rule 4.
- **B3 — `type_of_value` (line 1670) has no arm for the BOOLEAN-valued nodes `walk_expr` admits in a value position** (COMPARISON, BETWEEN, CONJUNCTION, OPERATOR, `~~`).
  - `(i32 > 0) = flag` and `(i32 > 0) IS NOT NULL` are refused `ConstructNotAdmitted` ("an untyped node class `COMPARISON` in a value position").
  - `flag = (zone LIKE 'c%')` is refused ("a function call (`~~`)").
  - All three plans bind with no cast of file data, and main admits them (stages 1 to 3 unchanged).
  - This breaks §2.2 ("arms mirror `walk_expr`'s admitted arms one to one"). The operator sees "is not on the admitted construct list", which is false (docs/01 principle 8).
- **B4 — `admitted_arithmetic_result` rule 6 (line 1821) returns `l.ty`, so a REAL column plus a double literal is typed REAL. The binder gives DOUBLE.**
  - `(f32 + 1e3) = i32` is refused `conversion_rounds` with operand types `["REAL expression","INTEGER"]`. The plan shows `fn "+" returns "DOUBLE"`, with lossless casts.
  - This breaks §2.2 ("takes the type the binder gives it").
  - B-T1 (ii) missed it because the check at test line 1172 compares the plan with the test's own re-derived table (`expected_arith_type`), never with the walk's type. The comment's claim ("the walk's arithmetic result type equals the plan's return_type") is therefore false.
  - Fix: return DOUBLE when a double literal is involved. Observe the walk's types from a `predicate.rs` unit test, which has private access, so no `pub` accessor is needed.
- **B5 — B-T1's enumeration (`generate_cases`) is only the probe's set.** §4 also requires discriminators.txt's N-ARY lists, the boundary literals from the sightings' point 2 with their negatives (bare and in mixed `IN`/`BETWEEN`), and C23-shaped rows.
  - `grep -n "N-ARY" engine/tests/filter_type_admission.rs` finds nothing. `18446744073709551616` and `99999999999999999999` appear only in B-T3's corpus, which asserts outcomes but not checks (i) to (iii).
  - This is §8 item 15.
- **B6 — `check_boolean_operand`'s OPERATOR arm is `_ => Ok(())` (line 2178), an admit-by-default arm.** `walk_expr` makes it unreachable today, but §8 item 5 blocks it on sight. Fix: make the arm refuse.
- **B7 (Documentation) — two doc comments still count as if there were eleven codes.**
  - predicate.rs:227: `FilterError`'s doc (an F2 site) says "a twelfth variant here would be inventing wire taxonomy".
  - kernel/src/skp.rs:1989: "a twelfth `FilterError` variant fails this build".
  - This is §8 item 11. Found with `grep -n -i "eleven\|twelfth"`.

### Items
1. **The diff.** Command: `git diff origin/main...HEAD`, 28 files, +2899/−242. Merge-base f7d10e1. Findings are B1 to B7 above.
   - Checked and correct: the walk runs after `bind_admit` returns `Ok` (line 191); one parse, reused through `StructuralAdmission`; the reason precedence in `determine_reason` matches Amendment 1; `construct` comes from the declared map; `operand_types` renders types only.
   - I found no file value in any field or in Display.
2. **Data-plane diff.** `git diff --stat origin/main...HEAD -- protocol/data-plane/` printed nothing.
3. **Mutations**, each observed by me at ff3a841: applied with `sed`, the named test run, reverted with `git checkout -- <file>`, and `git status --porcelain` empty after every one.

| Test | Mutation as applied | Failure observed |
|---|---|---|
| B-T1 | line 1924: `int_le(·,32)` changed to 64 | FAILED, 72 counterexamples, including `cmp = i64 lit:dbl: undeclared cast column BIGINT -> DOUBLE` (that is, `i64 = 1e3`) |
| B-T2 | lines 1928–9: rule 6(i) restricted to `is_decimal_literal` | FAILED: `f32 = 16777217: expected admitted, got refused` |
| B-T3 | line 1250: `MAX_INTEGER_LITERAL_DIGITS = 21` | FAILED: `C14 ("i64 = 100000000000000000000"): expected TypeNotAdmitted, got Ok` |
| B-T4 | line 191: `type_walk` commented out | FAILED: `"zone = 1": expected a TypeNotAdmitted refusal, got Admitted` |
| B-T5 | same | FAILED: P1 ×4 (`stream ended in error outside section 2.5(d)`), P4 ×1 |
| B-T6 | kernel skp.rs:2068: the arm maps to `filter_rejected_by_binder` | FAILED: `left: "skp.filter_rejected_by_binder"` |
| B-T7 | same as B-T4 | FAILED: `a text/non-text coercion must be refused…` (a ticket was minted) |
| B-T8 | FX-4 line 7: `"reason"` renamed `"reasons"` | FAILED: `exact key set` |
| B-T9 | same rename; `npx vitest run …fixtures.test.ts` | FAILED (× 1): `"reasons"` against `"reason"` |
| B-T10 | `type_of_value`'s final arm returns `Ok(Boolean)` | FAILED: `expected ConstructNotAdmitted…, got Ok(Typed…)` |

4. **Discharge claims.**
   - The diff has no "done", "fixed" or "discharged" clause: `git diff … | grep -E '^\+' | grep -inwE 'done|fixed|discharged'` matched only node names and "fixed values". "now asserting the fixed behaviour" resolves to B-T4.
   - Unresolvable: report 2's "891 admitted arithmetic cases, verified by instrumented count, removed after". No test or line proves the count, and 9b6782b's subject repeats it.
   - False: the test comment at line 1172 (see B4).
5. **CI wall times** (observation, not a docs/08 figure). Source: run 36662283349, job 109719440537, taken with `gh run view … --log`.
   - B-T1: about 93.0 s (03:03:23.337 to 03:04:56.374; the binary finished in 93.66 s).
   - B-T5: 25.35 s (the binary line; B-T4 took 0.17 s of it).
   - Local runs: B-T1 96–98 s, B-T5 18.5 s (the latter under the mutation).
6. **Suites.**
   - `cargo build --workspace --tests --locked`: rc 0.
   - `cargo test --workspace --locked`: rc 0. 87 `test result` lines, 810 passed, 0 failed, 40 ignored.
   - `npm ci`: rc 0. `npm run verify`: rc 0 (1092 passed).
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0 (353 of 353).
   - `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs`: rc 0 each, PASS.
7. **CI.** `gh pr checks 145`, head ff3a841ce05f698a7b81d7be25f5e982c6000585 (rc 0), every line:
   - cargo test --workspace (windows-latest): pass 18m14s (push) and pass 21m21s (pull_request)
   - every commit is signed off: pass 8s
   - tauri build (NSIS…) ×2: pass 4m14s and 4m41s
   - typecheck · build · vitest · cargo test ×2: pass 5m29s and 15m19s
   - `gh run view <id> --json headSha` gives ff3a841 for every run. `governance-ci.yml` did not run, because its `paths:` filter matches no file this PR touches. Its checks are covered by the local runs in item 6.
8. **T-B and T-C strings.**
   - Extracted with `sed -n '53,57p' <rulings>`, splitting wire value from sentence on the arrow.
   - Found with `grep -cF "\"$w\""` and `grep -cF "\"$s\""` in predicate.rs: each of the five wire values and five sentences appears exactly once.
   - Code (line 49): `grep -nF '"filter_type_not_admitted"' kernel/src/skp.rs` gives line 2068.
   - Display (line 59): `grep -nF '"refused: \`{construct}\` over {}: {} (docs/01 principle 8)"'` gives line 356, joined with `operand_types.join(" and ")` at line 357; the wire join `"; "` is at skp.rs:2072.
9. **FX-4 and the literal.**
   - B-T7 asserts that code, message and fields equal FX-4, and passes at head.
   - `git show d036c11 | grep -c 'skp/0\.8'` gives 0, and d036c11 touches 0 files under `protocol/` or `frontends/`.
   - The later commits add 0 `skp/0.8` lines. `git log origin/main..HEAD -- <FX-4>` lists 83f0489 only.
10. **Shell diff.** `git diff --name-only origin/main...HEAD -- frontends/shell`: three test files plus `types.ts`. In `types.ts` the only change is `SKP_VERSION` `"skp/0.7"` to `"skp/0.8"`.
11. **Formatting commits.** Each file was hashed with `git show <c>:<f> | tr -d ' \t\r\n,{};' | sha256sum`.
    - From 3a98672 to ff3a841, all seven changed files hash the SAME, and `engine/src/lib.rs` is byte-identical (`git diff --quiet`).
    - Per commit: 2bccc2c is SAME for every file. ad521d8 and ff3a841 each change the hash of `lib.rs`, because ad521d8 moves `TypeRefusalReason` to a standalone `pub use` and ff3a841 moves it back. So "each commit changes only whitespace and `,{};`" is true only for the three commits taken together.
12. **Caller grep and case count.**
    - `TypeRefusalReason` and `wire_value` have a product caller in `kernel::skp::filter_type_not_admitted` (skp.rs:2073), and `TypeNotAdmitted` is constructed by the walk.
    - The 12 `FILTER_WITNESS_*` constants and 12 `filter_witness_*` functions are each called once in `fixture.rs`'s generator. They are dev-feature only (`#[cfg(feature = "fixture")]`, lib.rs:87); the architect rules on §2.11.
    - B-T1 asserts `cases.len() == 7_620` (test lines 1125–1129) and passes. This matches counts.txt, which excludes u_str, n_str and `cmp = TRUE`.

### Non-blocking
- N1: `-NULL > 0` is refused `conversion_rounds` over `NULL literal`. That sentence is false for a NULL operand (`type_of_arithmetic`, line 1757).
- N2: `comparison_construct_name` has `_ => "?"` (line 2006), and `"?"` is not in §2.6's map.
- N3: `is_declared_integer_arithmetic_overflow` (campaign:1016) decides "integer arithmetic" by matching text with exact spacing, not by type. Under the B-T5 mutation it missed `(i64+ -300) * 5`.
- N4: B-T3 checks only the code for C25 ("today's text" is not checked) and C27 (that it names CAST is not checked). B-T8 compares `Value`s, as the precedent test does, not bytes as §4 words it.
- N5: The `filter_type_not_admitted` helper's doc says B-T6 calls it directly; B-T6 calls `filter_error_of`.
- Budget, recomputed with §7's exclusions: 25 files, 2858 + 241 = 3,099 against 1,800. This is class 8, for the custodian's record.
- No process of mine is left. The two `node.exe` processes still running are OpenAI Codex runtimes that were there before.
