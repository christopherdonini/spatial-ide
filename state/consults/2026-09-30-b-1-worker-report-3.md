# B-1 — correction round 2, the worker's report (2026-09-30)

*Custodian's filing note: the hand-back of the fresh worker-high that ran correction round 2 (the last the record cap allows) for PLAN node `filter-bind-admission-implicit-coercions` at node:filter-bind-admission-implicit-coercions@g4, on `cut/filter-bind-coercions` from f78c7d6 to 42a8c73. It is copied from the hand-back message with the harness's two-space indent removed. Its branch-only `path:line` cites are read at 42a8c73. Two of them, `kernel/skp.rs` (sic, for `kernel/src/skp.rs`) at line 1989 and `engine/src/predicate.rs` at line 2703, are de-rooted at filing to the words form "line N", because on main they fail `verify-cites`; nothing else in the report is changed.*

*The custodian re-checked these claims in the tree at 42a8c73:*
- *Both commits are signed off and pushed.*
- *42a8c73 is formatting only: both of its files hash identically at ec98415 and 42a8c73 with whitespace and `,{};` removed.*
- *The three main lines the branch newly changes in this round are the two F2 doc comments that counted twelve, in `engine/src/predicate.rs` (`FilterError`'s doc) and `kernel/src/skp.rs`. §2.9 and §8 item 11 require that change.*
- *The data-plane diff is empty.*
- *The custodian's counter reports 1 hunk touching an added line, the known pre-existing one in `engine/src/lib.rs`'s `pub use` block. The report's second residual in `predicate.rs` is a hunk identical to one `rustfmt --check` shows on main's own file.*
- *The budget recount with §7's exclusions is 25 files, 3,214 insertions plus 244 deletions, 3,458 in all.*

*The mutation table names the observation commit as "ec98415→42a8c73". 42a8c73 changes formatting only, and the gate's own table is the observation of record.*

---

B-1 correction round 2 complete. Branch `cut/filter-bind-coercions`, pushed. Commits on top of f78c7d6: `ec98415` (the round-2 code, per Amendment 4), `42a8c73` (rustfmt on this round's added lines only). Both signed off, no amends/force-push.

**W1** `engine/src/predicate.rs`: `check_boolean_operand`'s OPERATOR wildcard now refuses `ConstructNotAdmitted` (was `Ok(())`); `comparison_construct_name` returns `Result`, refusing on an unrecognized `cmp_type` instead of emitting `"?"`.
**W2**: comparison rule 4 bounds a non-literal integer side to 64 bits (`int64_or_literal`); `determine_reason` gains the matching `ConversionCanFail` branch (decimal literal beside a >64-bit non-literal integer); B-T1's `is_declared_cast` oracle aligned to §7 (no unconditional integer→UHUGEINT; DECIMAL only from a ≤64-bit integer).
**W3**: `admitted_arithmetic_result` gains rule 1 (identical REAL/DOUBLE types only, to avoid reopening VARCHAR/DECIMAL arithmetic) and rule 2 (NULL literal, guarded on the other side being numeric); unary `-` admits a NULL literal.
**W4**: rule 6 widens a REAL column to DOUBLE beside a double literal (was the column's own type).
**W5**: `type_of_value` now has an arm per `walk_expr`'s admitted class (COMPARISON, BETWEEN, CONJUNCTION, NOT, IS [NOT] NULL, IN, LIKE/ILIKE), each walked under its own check then typed BOOLEAN.
**W6**: `check_between` checks all three pairs (input-lower, input-upper, lower-upper).
**W7-W9**: B-T1b added (below); B-T1's enumeration and B-T3 corpus extended (below).
**W10-W12**: two "twelfth"→"thirteenth" doc fixes (`predicate.rs:227`, `kernel/skp.rs` line 1989); 3 DuckDB-behaviour comments gained "at v1.5.5" (2 of the architect's 5 named sites were deleted along with the removed re-derived oracle, so versioning there is moot); kernel's `filter_type_not_admitted` doc corrected (B-T6 calls `filter_error_of`, not it directly).

**Amendment 4 rows** — all held, no falsification, no §5 invalidator: C29 (HUGEINT expr < DECIMAL(2,1) literal, `conversion_can_fail`, exact operand_types) — held. C30 (`conversion_can_fail`, operand_types unchecked per the form) — held. C31 (f32*f32, f64+f64 admitted) — held. C32 (i32+NULL, -NULL admitted) — held. C33 (admitted via rule7) — held. C34 (three admitted cases via the new BOOLEAN-typing arm) — held. C35/C36 (BETWEEN refused on the lower-upper pair specifically, matching operand_types/reason exactly) — held, confirms the all-pairs order. C37 (both admitted; hypothesis pinned via two extra cases in B-T1's own enumeration, part 3) — held, not falsified. C38 control — held.

**B-T1**: five parts, each asserted: part 1 probe set 7,620; part 2 N-ARY (discriminators.txt) 18; part 3 boundary literals + C32/C37 pins 323; part 4 C23-shaped 16; part 5 BETWEEN triples 1,728 — total 9,705, checks (i)/(iii) only, 0 failures (4,553 admitted / 5,152 refused), 132s. **B-T1b** (new, `predicate.rs` `mod tests`, no `pub` item): 2,083 rebuilt cases (probe's arithmetic forms + C29-C33), 897 arithmetic nodes actually compared against `json_serialize_plan`'s `return_type`, 0 failures.

**Twelve mutations, all observed at ec98415→42a8c73 (final: 42a8c73), applied/run/reverted, `git status --porcelain` clean after each:**
| # | Mutation | Test | Result |
|---|---|---|---|
|1|rule5→64-bit|B-T1|FAILED, 72 counterexamples incl. `i64=1e3` BIGINT→DOUBLE|
|2|check_between: only input-vs-bounds|B-T1|FAILED, 56 counterexamples incl. `u16 BETWEEN f32 AND i64`|
|3|rule6(i)→decimal-only|B-T2|FAILED: `f32=16777217: expected admitted, got refused`|
|4|MAX_INTEGER_LITERAL_DIGITS=21|B-T3|FAILED: C14 expected TNA, got Ok|
|5|type_walk skipped|B-T4|FAILED: "zone=1" expected TNA, got Admitted|
|6|type_walk skipped|B-T5|FAILED: 5 counterexamples (P1×4, P4×1)|
|7|kernel arm→filter_rejected_by_binder|B-T6|FAILED: left "…rejected_by_binder", right "…type_not_admitted"|
|8|type_walk skipped|B-T7 (kernel)|FAILED: ticket minted|
|9|FX-4 "reason"→"reasons"|B-T8|FAILED: exact key set|
|10|same rename|B-T9 (vitest)|FAILED: "reasons" vs "reason"|
|11|type_of_value final arm→Ok|B-T10|FAILED: expected ConstructNotAdmitted, got Ok|
|12|rule6 reverted to column's-own-type|B-T1b|FAILED: 10 counterexamples, all `f32 {+,-,*} 1e3`-shaped|

**Checks**: `cargo build --workspace --tests --locked` rc 0 (twice, before/after mutation testing). `cargo test --workspace --locked` rc 0 both times, 811 passed / 0 failed / 0 panicked each run (log-verified). `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` rc 0, 353/353. `verify-cites.mjs` PASS rc 0. `verify-quotes.mjs --show-cites` on the 3 changed files PASS rc 0 (0 checked — no verbatim quotes added). `verify-test-claims.mjs` PASS rc 0 (389 claims). `verify.mjs` PASS rc 0. `git diff --stat origin/main...HEAD -- protocol/data-plane/` empty. rustfmt counter: 2 residual hits, both pre-existing/unrelated (not fixed, documented in the fmt commit): `engine/src/lib.rs:126` (round-1's proven pre-existing pub-use disorder) and `engine/src/predicate.rs` line 2703 (`a_future_clause_this_module_has_never_seen`, byte-identical to origin/main:1560/1563, only renumbered by this round's insertions above it). Caller grep: no new `pub` item in this round's diff (`git diff f78c7d6...HEAD` has zero `pub` additions). `npm run verify` not run — no shell file touched.

**Budget**: `git diff --numstat origin/main...HEAD` with §7's exclusions: 25 files, 3,214+244=3,458 (class 8, already ruled by the architect's consult; not written into the form by me).

`git status --porcelain`: clean. Model: the worker-high default (`claude-sonnet-5`), no override. No cargo, test-binary, or node process of mine left running (checked `tasklist`; remaining `node.exe`/`node_repl.exe` are OpenAI Codex runtime processes, pre-existing, confirmed via command line).

Files touched: `engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs`, `kernel/src/skp.rs` (all in `C:\dev\wt\b-1-coercions`).
