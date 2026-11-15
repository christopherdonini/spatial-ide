*Custodian's filing note (2026-10-24): the worker-high's build of filler entry 2, `stream-evaluation-failure-fixed-detail`, on its branch from f0804432, final head 27924bbe2fe7cd2655db3406227153b55dccd671. The run 14:47:36Z to 16:40:49Z by its transcript, both stretches (Read 8, Bash 68, Edit 13, Write 2; Edit only on the Scope's three files; its branch diff is those three files; no rebase, reset, merge, amend, force push or PR action). It handed back twice: first at 15:21:24Z, stopped (sha256 b65378f69053e514ff00494bab3dbcc4a7e28cf82c5bc0a06303beeb63fba0f6, filed as `state/consults/2026-10-24-stream-evaluation-failure-fixed-detail-worker-stop-report.md`), on the defect the form's Amendment 1 records; then, resumed with that amendment, the report below. Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 99e261e7804e847b0a95931ebbe1c9b72fb0650dd3b8d334497eea5b6b17555e.*

---

Built: stream-evaluation-failure-fixed-detail at 27924bbe2fe7cd2655db3406227153b55dccd671

All commits are pushed and no stop rule was met after Amendment 1. HEAD equals origin's branch (both 27924bbe2fe7cd2655db3406227153b55dccd671), and `git status --porcelain` is empty.

**Commits** (signed off with `-s`, each message file checked to have no `@` outside the Co-Authored-By line, each pushed in its own call):
- da4fa6f67e1ff2a134502f5a0eabcd1b61c7a541 `feat(engine): stream-evaluation-failure-fixed-detail, the fixed detail (Change line)`. It touches `engine/src/stream.rs` only: the code and T2.
- 86612bdd3bf5d2d8c193e9eea70c7265b14afe47 `test(engine): stream-evaluation-failure-fixed-detail, T1 and the three changed sites (Tests+mutation line)`. This is the final code commit; both mutations were applied at it.
- 27924bbe2fe7cd2655db3406227153b55dccd671 `docs(engine): stream-evaluation-failure-fixed-detail, the two RECORDED MUTATION lines (Tests+mutation line)`.

Commit da4fa6f6 on its own leaves the three changed test sites red until 86612bdd.

**The change**
- **S1:** one private const, `OUT_OF_RANGE_DETAIL`, with its doc comment. A node script found S1 byte-equal to the form's text, and to the dispatch text, in all three files. The test files carry it once each, prefixed `query: `.
- **The check:** a private `is_out_of_range(message)` uses `message.starts_with("Out of Range Error")`. DuckDB's label is read only at the start of DuckDB's message, without the engine's phase prefix.
- **`classify`:** it is now `classify(cancel, phase, message)`, as Amendment 1 item 3 reads it. `Cancelled` is returned first, then out-of-range gives `Query(S1)`, and anything else renders as `{phase}: {message}`. Its three call sites pass "prepare", "execute" and "duckdb fetch panicked" with the message.
- **The three changed sites:**
  - `is_declared_integer_arithmetic_overflow` in the campaign file and `is_declared_overflow` in `filter_type_admission.rs` are re-keyed. Each keeps its typed class and requires the terminal text to equal exactly `query: ` + S1.
  - The campaign's two call sites and its header doc needed no edit, and the leak assertion is unchanged.
  - No new dependency, `pub` item or `EngineError` variant.

**Tests (all pass at head)**
- T1 `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail` ok. It runs `i64 * i64 > 0` and keeps the form's name, fixture and four assertions.
- T2 `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` ok.
- The three changed sites are ok: `filter_admission_property_campaign`, `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` and `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`.
- At head, B-T1 (suite run 1) printed `B-T1: 4564 admitted, 5164 refused, 0 failures`, with every overflow ending in S1.

**M1:** the out-of-range arm of `classify` deleted, applied alone at 86612bdd and run alone with the five named tests; the porcelain was empty after the revert.
- **T1** fails at `assert_eq!(text, OVERFLOW_TERMINAL)` in `engine/tests/admission_property_campaign.rs`. The text was `query: execute: Out of Range Error: Overflow in multiplication of INT64 (-3602189387807864356 * -3602189387807864356)!`.
- **Changed tests under M1:**
  - B-T1 fails on 135 counterexamples (`B-T1: 4564 admitted, 5164 refused, 135 failures`). The first 40 are printed, all with DuckDB's own text.
  - P5 fails on 4 candidates; its tally shows excluded 0, against 4 unmutated.
  - `filter_admission_property_campaign` still passes: its stream_errors were 0 in all four generators, which is Amendment 1 item 2 observed.
- T2 also fails under M1, at its first `classify` assertion.

**M2:** `is_out_of_range` made to return true for every message, applied alone at 86612bdd and run with T2 alone.
- T2 fails at its first non-range sample: `read as out of range: IO Error: No files found that match the pattern "x.parquet"`.
- The porcelain was empty after the revert.

Both are recorded in `RECORDED MUTATION:` doc lines naming 86612bdd3bf5d2d8c193e9eea70c7265b14afe47. M1 is on T1, with the B-T1 and P5 counts. M2 is on T2. No `verify-mutation` run was used as an observation.

**Scope count** (`git diff --numstat f0804432...HEAD`): stream.rs 65/5, admission_property_campaign.rs 44/6, filter_type_admission.rs 9/5, total 118 + 16 = 134 of 150. Only the three files changed.

**Checks at head** (the engine, kernel and clippy runs were in shared holds; fmt, the Scope count and the verify scripts ran outside them):

| Check | Exit | Last line / result |
|---|---|---|
| `cargo test -p spatial-engine --locked` | 0 | 47 result lines summed: 447 passed, 0 failed, 17 ignored |
| `cargo test -p spatial-kernel --locked --test typed_terminal_codes` | 0 | `test result: ok. 7 passed; 0 failed` |
| `cargo fmt --all -- --check` | 0 | no output |
| `cargo clippy -p spatial-engine --tests --locked` | 0 | `Finished dev profile` |
| `verify-cites` | 0 | PASS |
| `verify-quotes` | 0 | PASS |
| `verify-test-claims` | 0 | PASS |
| `verify` (`verify.mjs`) | 0 | PASS |

I also ran `verify-quotes --show-cites` on the three changed files; it exited 0 and listed no cite.

Clippy reports 39 `warning` lines overall. The ones in the three files (stream.rs 2355 and 2471, campaign 218/270/543/556, filter_type_admission 955) are all outside my changed lines, so they are not new.

**Pre-gate self-check**
- Cross-module: there is no new seam. The `EngineError::Query` variant and its `Display` are unchanged, and I read them in `engine/src/error.rs`.
- Completion claims: each rests on a run recorded above.
- User-facing message: S1 is the only string that changes. It is a P6 placeholder for the sitting, in the form note D gives.
- Required tests: each reaches its assertion. T1 fails by name at `assert_eq!` under M1, and T2 fails on its non-range sample under M2.

**Disclosures**
- `classify`'s signature changed, as Amendment 1 item 3 reads it, and is private.
- The earlier probe test was removed. Probe results are in my first report and in Amendment 1.
- No `pub` item, dependency or variant added, and nothing outside the Scope changed.

**Holds** (my project's only): shared holds, each `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` and each followed by `MACHINE_RELEASED project=SpatialIDE`, for:
- the whole-suite run before the commits
- the M1 run
- the M2 run
- the whole-suite run at head
- the kernel test
- clippy

No hold was refused (no exit 96 to 99), and none of the runs was timing-sensitive.

**Processes:** none I started still runs. A filter on the sefd target path finds no cargo or rustc process.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`) as the harness reports it. No override. I received your mid-task message as a context handoff.
