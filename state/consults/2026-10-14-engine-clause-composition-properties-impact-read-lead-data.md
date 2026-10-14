# Impact read: engine-clause-composition-properties (lead-data, 2026-10-14)

Impact read only. This is not a draft and holds no form text. Every pointer is at 3c640e474df798d51c528d8e841f8c8007046dd3 (3c640e47). I read the main checkout's working tree, which the session's git status gives as HEAD 3c640e47. I had no shell, so I did not confirm HEAD with git, computed no hashes and listed no branch diffs.

Authority read: state/directives/2026-10-14-two-slot-2-pieces-clause-composition-boundary-inventory.md:8-30 (item 1), DECISIONS-PENDING.md:47-50 (its RULED block) and PLAN.yaml:5206-5222 (the node, status proposed, depends_on b2-piece-1b-recording). The convention, copied from the directive at :13-16:

```text
   The join follows the shell's convention exactly:
   - zero enabled clauses: no filter;
   - one: the text unchanged, byte for byte;
   - two or more: each text in one pair of brackets, joined by " AND ".
```

Reuse index (the standing step): all three terms missed (property test, clause composition, predicate conjunction). The misses are noted here and do not block.

## 1. What P5 and P6 need, and what is missing

What is already there and can be reused unchanged:
- Generator: `Rng`, SplitMix64, engine/tests/admission_property_campaign.rs:78-102 @ 3c640e47. It uses std only (:8-11).
- Fixture: `fixture()`, MultiType, 800 features, seed at :55-56, built at :116-153 behind a `OnceLock` (:117). This means a new `#[test]` in the same file shares the fixture with the campaign.
  - Only `zone` holds NULLs: engine/src/fixture.rs:359-367 @ 3c640e47 (one in five), and the MultiType column list at :182-187.
  - `facts.extent` is the union of every feature's bbox: engine/src/fixture.rs:598-603 and :1086-1089 @ 3c640e47. A viewport equal to that extent therefore reaches every row. The campaign already reads it at admission_property_campaign.rs:1036.
- G1 grammar: `leaf` at :214-276 and `gen_expr` at :279-309.
  - The OR arm (:293-300) joins its operands with no brackets. That gives the precedence witnesses the mutation needs.
  - The NOT arm (:301) and both AND arms (:285-292, :302-307) cannot change ids under the bare join.
  - Note: G1's admission rate is lower than its draw count. Wave 2 B recorded 378 of 500 G1 cases admitted (state/cloud/wave2/W2-B.md:41). That count is from before the type walk, so it is historical. The current rate is not measured here.
- Admission: `admit` (:641-655) returns `Outcome::{Admitted, Refused, Panicked}`, and `code_of` (:617-632) maps a refusal to its `skp.filter_*` code. That is enough for P5's assertion that a refusal carries only filter_too_long or filter_too_deep, and for P6.
- The integer-overflow exclusion: `is_declared_integer_arithmetic_overflow` (:1009-1025). It can be applied per run to each of the n+1 texts. Its authority is engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97 and :131 @ 3c640e47.
- Limit: `FIXTURE_FEATURES` (:56) gives a limit above the row count. `ViewportQuery::with_limit` has no ceiling: engine/src/stream.rs:276-279 @ 3c640e47.

What is missing. Each item is test code only, and none needs product code, a fixture change or a dependency:
- (a) A join helper that reproduces the convention. Nothing in the engine joins clauses. The engine only wraps the one admitted text: engine/src/predicate.rs:217-222 (`sql_text`, composed in one paren pair) and :459-461 (`wrap_with`) @ 3c640e47.
- (b) Ids from a completed stream. `stream_check` (:866-958) collects ids at :895-914 but returns only `violations` and `error`. On error it returns before any comparison (:916-918), which already keeps partial rows out. P5 needs either an `ids` field on `StreamCheck` or a sibling helper.
  - Reusing `stream_check` also runs its count oracle (:935-956) and its bbox check (:925-934) on every P5 run. Whether their violations count toward P5 is for the form.
- (c) A seed constant and a case count for P5 and P6. G1_SEED (:60) could be reused, but folding P5 into `filter_admission_property_campaign` would consume draws from its RNG stream and change the existing campaign's G1 cases. So P5 needs its own `#[test]` and its own seed.
- (d) Bounded rejection sampling, so that each text is admitted alone. It needs a draw cap per case and a discarded-draw count for the report.
- (e) Tallies for excluded cases and a timer for time spent. The campaign has no timing today (its report is at :1183-1206).
- (f) A minimizer. None exists (see 3).

Facts that bound what P5 and P6 can find. These are not decisions.
- **Depth.** filter_too_deep cannot arise from the join of texts each admitted alone. Each top-level operand is walked fresh at depth 1 (predicate.rs:515-525). DuckDB flattens a same-operator AND chain into one node (:952-954), so `(t1) AND (t2)` plus the sentinel gives the same operands as each text alone.
- **Length.** filter_too_long arises only if the joined bytes exceed `MAX_PREDICATE_BYTES` (predicate.rs:59). With G1 at depth 4 or less (admission_property_campaign.rs:1056) that is likely rare. The allowed-code branch may go unexercised, and the report should say so by count.
- **P6.** P6 is informative only for subsets of size 2 to n-1, which means only when n is 3 or more.
  - n = 3 gives 3 such subsets; n = 4 gives 10.
  - Singletons are admitted by construction, and the empty subset is no filter, so it has no admission call. The form could state how it counts these subsets.
- **NULL.** Under SQL's three-valued WHERE, a row passes `(t1) AND (t2)` only if both texts are TRUE, so P5's intersection is exact with NULL `zone` values.

## 2. Where the shell's join convention lives, and a helper with a one-line mutation

- **Where it lives.** At 3c640e47 the convention exists only as text in the milestone 3 form:
  - frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:206-215 @ 3c640e47, §2.5, `combineClauses` at :210-215;
  - its unit row UC3 at :372, its e2e row E-AND at :400, and H1 and H5 at :94 and :98.
- **No code yet.**
  - Grep finds no `combineClauses` or `filterClauses` under frontends/shell/src.
  - Glob finds no frontends/shell/src/**/filterClauses*.
  - shell-migration-milestone-3 is `status: proposed` (PLAN.yaml:5017-5022).
  - A Rust helper therefore reproduces the form's §2.5 text, not built code.
- **The helper.** A test-file function that takes the enabled texts in order:
  - an empty slice gives no filter (None);
  - one text is returned unchanged;
  - two or more: each text is mapped to `(` + text + `)`, and the results are joined by ` AND `.
- **The mutation.** If the bracket wrapping is the one map expression on its own line, the bracket-join mutation is a one-line change: map each text to itself instead. Under §2.5 nothing is trimmed or case-folded (:215), so the helper must not trim either.

## 3. How a failure is kept today, and what a kept witness costs

- **Today, nothing is minimized and nothing is kept automatically.**
  - A counterexample records generator, seed, case, property, predicate and detail (:1000-1007, :1085-1094).
  - The report groups by property, skips repeated details, prints at most 8 per property and then asserts that there are none (:1209-1230).
  - The comment at :1208 says Minimise, but the code does not minimize.
  - A failure is reproduced by rerunning the deterministic seed.
- **The one precedent for a kept witness is B-1.** A counterexample was turned by hand into a fixed `#[test]` with literal predicates (:1233-1272). The doc comment records the mutation and the assertion that fails by name (:1242-1243). That is how the campaign records a mutation.
- **Cost of a kept witness:**
  - one `#[test]` of about 20-25 lines with its doc;
  - n+1 (at most 5) admissions and full-extent streams over the shared 800-row fixture (not measured, so no time is claimed).
  - If the expected ids are computed at run time from the alone runs, no fixture-coupled id list is needed.
  - The witness only keeps discriminating while the fixture's data makes precedence matter. An added assertion that the unbracketed join's ids differ from the intersection would guard that. The form decides.
- **Minimizing.** Hand minimization, recorded in the report, costs no lines. A delta-debugging minimizer in test code would cost about 30-50 lines and would likely break the 150-line budget (see 5).

## 4. Files, and overlap with work in progress

**Files the piece would touch:**
- engine/tests/admission_property_campaign.rs: the only code file, if P5 and P6 go in the same file.
- The five-line form: exempt under AUTONOMY.md:357.
- PLAN.yaml: the custodian's bookkeeping.
- Possibly engine/README.md:535: a pin under Filter admission at merge, about 1 line, as an owner's-index update.
- Nothing under kernel/ or protocol/, and no Cargo.lock, package-lock.json or wire fixture.

**Costs of a sibling file.** These are the form's to weigh:
- An integration-test file is its own crate, so `Rng`, `fixture`, `leaf` and `gen_expr` are private to the campaign's file.
- Copying them would cost about 200 lines.
- `#[path]`-including the file would compile and run the 2,500-case campaign a second time.
- A sibling `fixture()` would write to the same temp path, `spatial-engine-wave2-admission-property/multitype.parquet` (:126-128). That races if the binaries run concurrently.

**In the same file, a new test must not call `canary_dir()`.** That function removes and recreates the directory (:157-162). The campaign, running in parallel in the same binary, reads that directory with `expect("canary dir")` (:1168-1171).

**Overlap. I did not check with git, because I had no shell.** The custodian should list each branch with `git diff --name-only origin/main...<branch>`.
- PR #218 (cut/shell-status-bar-one-height) and PR #219 (cut/export-current-view-after-unreported-fit): neither form names an engine/ or kernel/ path. A grep of frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md and frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md found no match.
- PR #220 (stale-test-names-and-comments): its worker report lists 18 files (state/consults/2026-10-14-stale-test-names-and-comments-worker-report.md:78-99).
  - The engine files among them are engine/tests/identity.rs, engine/src/identity.rs, engine/tests/admission_instruments.rs, engine/tests/admission_format_semantics.rs and engine/tests/session_identity.rs.
  - On the kernel side it touches kernel/README.md.
  - It does not list admission_property_campaign.rs or engine/README.md.
- By these records, no path is shared.
- Not checked: b2-piece-1b-recording, the node's dependency, and any other piece in progress.

## 5. Line estimate (§21c: 150 lines or fewer, tests included, over 8 files or fewer; AUTONOMY.md:347-357)

| Part | Lines |
|---|---|
| P5 and P6 constants | about 3 |
| Join helper with doc | about 12 |
| Ids from a completed stream (a field on `StreamCheck` with its return sites, or a helper) | 8-15 |
| P5 and P6 test: sampling, alone runs, exclusion, admission and result assertions, duplicate check, subsets, tallies, timing, report | 85-95 |
| Kept witness with its mutation doc | 20-25 |
| Module doc lines for P5 and P6 (:13-32) | about 6 |
| **Total** | **about 135-155, in one file** |

- rustfmt expansion and deletions both count. The estimate sits on the ceiling.
- An automatic minimizer, or a sibling file, takes the piece over 150.

## 6. Risks to name before drafting

- **R1, the convention's source is unbuilt.** combineClauses, UC3 and E-AND exist only as rows of a proposed form (see 2).
  - The directive's mutation record is to say that UC3 and E-AND cover the shell's half (:29). At 3c640e47 neither exists in code, and the directive's wording says that E-AND already shows a conjunction (:11).
  - If milestone 3 is built differently, or amended, nothing ties the Rust helper to it.
  - How the record words this goes to the custodian.
- **R2, budget.** The estimate is at the 150-line edge (see 5). A form that declares 150 and lands above it is closed to the single gate.
- **R3, scope of the exclusion.** The ruled text says an excluded case is never compared. Whether P5's admission assertion still runs on an excluded case is for the form to state, sharpening not widening (directive :24, :27).
  - The exclusion function goes when node stream-evaluation-failure-fixed-detail lands (PLAN.yaml:3355; admission_property_campaign.rs:1015). P5's exclusion would go with it.
  - `i64_for` spans the full 64-bit range (engine/src/fixture.rs:406-408), so G1's arithmetic leaf (:263-271) overflows often. Expect a material excluded count.
- **R4, the RNG stream and parallel tests.** Adding draws inside the existing campaign would change its G1 cases (see 1c). The shared `canary_dir()` and the temp fixture path race under parallel runs (see 4).
- **R5, weak findings.** By 1, filter_too_deep is out of reach and filter_too_long is likely rare. P6 is non-trivial only at n of 3 or more. The report should give these as counts and not present them as findings.
- **R6, stale comment.** The comment at :1208 says Minimise, but the code does not minimize. The record should not cite it as a minimizer.
- **R7, run time.** CI runs the existing campaign binary in about 11-16 s in debug on ubuntu:
  - state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt:367 and :371;
  - state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:346 and :350.
  - That is a log reading, not a docs/08 measurement. P5's case count adds n+1 full-extent streams per case, and the report owes the time spent.

Touched by pointer, and changed by none:
- Interfaces: `spatial_engine::AdmittedPredicate::admit`, `FilterError` (engine/README.md:535) and `Dataset::stream_with_cancel` (:533).
- ADR-021 decisions 4, 6, 7 and 8 (docs/adr/ADR-021-row-filter-on-viewport-query.md:67, :75, :86, :93) and its Note 2026-09-30 item 4 (:265).
- engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97 and :131.
- No KNOWN-LIMITATIONS item. None of the engine's declared items (engine/README.md:554) concerns clause composition.
- Kernel: no interface, test or limit. The kernel consumes the filter types unchanged (kernel/README.md:373).
