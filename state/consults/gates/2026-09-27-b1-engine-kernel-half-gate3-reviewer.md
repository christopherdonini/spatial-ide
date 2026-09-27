*Custodian's filing note (2026-09-27): gate 3 (attempt 3), reviewer, full gating, for PLAN node `b1-engine-kernel-half`. Reviewed: cut/b1-engine-projection @ c9ec02e32cb36a64a446424f6db2f4584cacdefc. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed.*

---

**Gate 3, reviewer (attempt 3): PASS. Reviewed `cut/b1-engine-projection @ c9ec02e32cb36a64a446424f6db2f4584cacdefc`.** `origin/main` is `254fbfa`, which is also the merge base. The range is `origin/main...HEAD`, after `git fetch`. Every cite below is read at `c9ec02e` unless it names another commit.

At hand-back the worktree was clean and HEAD was still `c9ec02e`. All mutations ran on a `git archive c9ec02e` export, in `C:/dev/b1-gate3-scratch` with its own target directory, and each was reverted after its run. That scratch directory is now deleted. None of my processes is still running. Four `node.exe`/`node_repl.exe` processes are running; they started on 2026-09-25 and are not mine.

Two facts for the custodian, both outside the branch's diff:
- **The merge's parent.** The brief says `37b3644` merges `e606af7`. Its second parent is actually `254fbfa`, which is `e606af7` plus the Amendment 9 draft and the round-2 worker report. There is no code or conformance difference between them. Amendment 9 names `e606af7` only for the trial merge, so it is not wrong.
- **Ledger line cites in your filing note.** Your note at the top of `state/drafts/b1-amendment-9.draft.md` (on main at `254fbfa`) cites `DECISIONS-PENDING.md` by line ("line 97", "line 227"). Round 12 (a) forbids that form.

### Verdicts (`AUTONOMY.md` §22)
- **Correctness: PASS.**
  - Severity: none.
  - Scope: `engine/src/{attributes,stream,predicate}.rs`, `kernel/src/publish/mod.rs`, `kernel/src/skp.rs`, `protocol/skp/tests/conformance/`.
  - Disposition: none.
- **Evidence: PASS with notes.**
  - Severity: low.
  - Scope: Amendment 8's X10 row (E1); a gap in how publish's flag reaches `flush` (E2).
  - Disposition: none blocking. This report is the observation of record for 9.3 and 9.6, as Amendment 9's Record states. E1 goes to the architect's reduction. E2 is a suggestion for a later piece.
- **Documentation: PASS with notes.**
  - Severity: low.
  - Scope: Amendment 9 §9.6's cite, the `DIVERGENCES.md` header, and in-code nits.
  - Disposition: record items go to the architect's reduction under the record cap. The `DIVERGENCES.md` wording can take an optional class-3 fix. None of it blocks.

### Gate-2 findings against round 2
- **B1 (X7): closed.**
  - E-14's small runs now assert `Arc::ptr_eq` (`engine/src/stream.rs:2619`, `:2646`).
  - Removing the 64-byte term now fails at `:2619`, which is `:2612` at `ca3d7ae`.
- **B2 (X6): closed, on the constructor route both gate-2 reports offered.**
  - `StreamPlan::for_publish` (`stream.rs:580`) is the one constructor `stream_for_publish` calls.
  - Declaring the plan `true` fails at `:2798` (`:2787` at `ca3d7ae`), on nullable Utf8 8/3.
  - The residual gap is E2 below.
- **B3 (X2): closed.**
  - The test exists (`kernel/tests/skp_projection.rs:831`).
  - Running the restriction before `resolve_projection` fails at `:856` (`:845` at `ca3d7ae`).
  - R2-B3's own form, re-run at `a472add`, fails at `:848`, as recorded.
  - The claim that it does not compile at `ca3d7ae` holds by inspection: the loop there reads `projection`.
- **B4: closed.**
  - Every Amendment 8 observation names its commit.
  - The round-2 `RECORDED MUTATION` comments say "observed at `ca3d7ae`". I checked each against that commit, and each is true.
  - The suite counts and Amendment 7 are superseded.
- **B5: closed.**
  - The class-2 row is pinned in the X6 test's `changes` column, and the test passes at head.
  - The pin is live: my E15full mutation flipped the Boolean 3/5 case and the test failed by name.
  - The two H3 docs now state what was observed. D3 covers two places that still say "nullable" only.
- **D1: closed.**
  - SKP-V0 §4 item 13 now marks the `2963021` message as paraphrase.
  - The paraphrase is accurate against that commit's message.
- **Medium findings: all closed.**
  - X3's K-5 case (`skp_projection.rs:642-649`): removing the `ID_COLUMN` arm fails at `:595`.
  - `flush`'s comment: main's sentence is restored byte-identical to `46ff585`, then narrowed (`stream.rs:2353-2364`).
  - `v0/mod.rs`: seven codes, and the commit facts match each commit's file list.
  - `skp.rs` now cites RULED 2026-09-16, round 7, item 1, which resolves in the ledger.
  - Amendments 6 and 7 are superseded by Amendment 8's index.

### Mutations re-observed
All ran at `c9ec02e`, except one at `a472add`. Lines are the failing assertion at `c9ec02e`, with the `ca3d7ae` line in brackets.

| Row | Mutation | Result |
|---|---|---|
| X1 | final arm set to a placeholder | fails, `skp_projection.rs:511` |
| X2 | interleaved passes | fails E-6 (`attributes.rs:644`) and the multi-failure test (`:658`) |
| X2 | restriction before shared admission | fails `:856` [845]; R2-B3's own form at `a472add` fails `:848` |
| X3 | `ID_COLUMN` arm removed | fails `attributes.rs:711` and K-5 `skp_projection.rs:595` |
| X4 | `From` renders the final arm for every type | fails `attributes.rs:777` |
| X5 | `REAL` arm removed; separately `LargeUtf8`/`Utf8View` removed | each fails `predicate.rs:1284` [1283]; `a_float32_column_is_filterable` also fails |
| X6 | `for_publish` declares `true` | fails `stream.rs:2798` [2787] |
| X6 | compacted copy drops its null buffer | fails `:2835` [2824], "index 5" |
| X7 | 64-byte term removed | fails `:2619` [2612] |
| X7 | compaction never taken | fails E-14 `:2585` [2578] and the live text test `:2917` [2906] |
| X7 | `flush`'s single-run arm returns `Arc::clone` | fails `:2917` |
| X8 | file order | fails `skp_projection.rs:223` |
| X9 | `known_columns`, `id_column`, `detail` each renamed | each fails `:379` and `:462` |
| X11 | runs sliced one row late | fails `:261` |
| X12 | one byte appended between the hashes, in each test | fails `skp_projection.rs:277`, `live_projection.rs:177`, `stream.rs:2939` [2928] |
| X13 | the gate emits `Float64` for `Float32` | fails `live_projection.rs:66` ("EncodingMismatch … Float64 … Float32"); see E3 |
| C-a | the 273a79d dictionary text restored | fails `attributes.rs:822` [818] |
| C-b | the emitted type carried as source type | fails `:855` [847] |
| C-c | publish's `From` renders the reworded text | fails `:883` [871] |
| X10 | the row's wording, realized literally | survives, engine lib 167/167; see E1 |
| 9.6(a) | a real full-length copy (via `Buffer::ptr_offset`) | fails E-15 `stream.rs:2669` (left 5000) |
| 9.6(b) | the same window over a whole-chunk copy | fails E-14 `:2585` and the live text test `:2917` ("text run retained 2097344 bytes over its 84424-byte allowance"). No STOP. |
| M-1 | `columns` removed from `req-viewport-all-null` | fails `conformance/main.rs:114`: `pass=61 deferred_to_host=15 diverged=2`, and the set gains that id |
| M-2 | `skip_serializing_if` on `ViewportQueryRequest::columns` | fails `:114`: `pass=58 … diverged=5`, and the four ids of 9.1 join the set |
| S1 (supplementary) | `flush` ignores the plan's flag and always compacts | survives: engine lib 167, `publish_stream` 12, `live_projection` 4; see E2 |

### Amendment 9
- **The fixture commit's diff (`c9ec02e`).**
  - It touches 6 files, all under `protocol/skp/tests/conformance/`.
  - Compared with main: 78 fixtures (32+23+14+9), and `expect`, `roundtrip`, `expected_refusal_code` and `wire_type` are unchanged.
  - Documents differ only by the literal, the three renumbered version documents, and `"columns": null` on 9.1's four.
  - The nine version specs name `skp/0.6`.
  - `"skp": "skp/0.5"` occurs 0 times in each of the four files.
  - `main.rs` is unchanged.
  - The five re-pointed `DIVERGENCES.md` ranges match main's ranges line for line.
  - Block-on-sight 24 does not fire.
- **The harness count line.**

  | Tree | Count line |
  |---|---|
  | `c9ec02e`, run in the worktree, rc 0 | `pass=62 deferred_to_host=15 diverged=1` |
  | main `e606af7`, `protocol/skp` exported | `pass=62 deferred_to_host=15 diverged=1` (re-observed) |
  | `37b3644`'s tree | `pass=58 deferred_to_host=15 diverged=5`: 9.1's four ids plus `rej-resp-cancel-bad-state` |

  9.4's invalidators do not fire.
- **The merge.**
  - The conformance directory at `37b3644` is byte-identical to main's: the diff against `254fbfa` is empty.
  - The merge's file set equals the branch's own. Only four generated files conflicted (`CUSTODIAN-QUEUE.json`/`.md`, `site/data/plan.json`, `site/index.html`), and `queue --check` and `site --check` pass on the result.
  - Amendment 9 is byte-identical to the draft's amendment section.
  - The class-9 amendment `8b06927` precedes the addition's code `c9ec02e`.

### Amendment 8's table
- Every test named in the table exists.
- All 17 hash pins match when recomputed at `cec34b8`, which is on main.
- Every line cited at `ca3d7ae` is that assertion's start line at `ca3d7ae`.
- The superseded index covers what the architect named (Amendment 6's class-4 section and its superseded entry, and Amendment 7's re-verification paragraph), plus R2-B4 and Amendment 6's cites.
- Its `i64_for` reference is lines 273-274 of `engine/src/fixture.rs` at `273a79d`. I checked it; it is named with its commit, not pinned by hash.

### Findings (none blocking)
- **E1 (low): Amendment 8's X10 row records a survival that tested nothing E-15 reads.**
  - The row's realization is "the run's data rebased to offset 0 over offset + length rows". At arrow 58.4.0 that changes nothing for E-15's `Int64` run. A sliced `Int64Array` or `StringArray` carries the slice in `Buffer::ptr_offset`, so `ArrayData::offset()` is 0.
  - Observed: that form left engine lib 167/167 green. Without the re-slice it failed only the X6 test's Boolean 3/5 case (the one type with a bit offset), never E-15's length assertion.
  - 9.6's effective realizations are recorded above: (a) fails E-15; (b) fails E-14 and the live text test.
- **E2 (suggestion): publish's flag is proven only up to the constructor.**
  - The X6 test proves the constructor's declaration and `single_run_retention`. It does not prove the path from the plan through `stream_inner` to `flush` for publish, so S1 survives everything.
  - Gate 2's second route would close it: drive `stream_for_publish` over a nullable fixture and assert the kept runs are pointer-equal to their slices. That belongs to a later piece.
- **E3 (info): X13's re-observed failure line differs from gate 2's.**
  - My mutation site differs from gate 2's, so the test fails earlier: at `drain`'s `expect` (`live_projection.rs:66`), not at `:132`.
  - It still fails by name.
- **D1 (low): Amendment 9 §9.6 cites "gate 2's A-E6".**
  - A-E6 is gate 1's architect E6 (`state/consults/2026-09-27-b1-engine-kernel-half-gate1-architect.md:47`).
  - Gate 2 labels it "X10 (low)" (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md:53`).
- **D2 (low): the `DIVERGENCES.md` header credits the wrong commit for the count.**
  - `protocol/skp/tests/conformance/DIVERGENCES.md:3-6` credits the 62/15/1 run to "commit `37b3644`".
  - At `37b3644` the harness gives 58/15/5; 62/15/1 holds only once `c9ec02e`'s fixtures are in.
  - The header does what 9.2 asked. Suggested wording: "fixtures updated after the merge at `37b3644`".
- **D3 (nit): H3 wording.**
  - `flush`'s route-(a) comment (`stream.rs:2367`) and E-15's doc (`:2654-2655`) still say "nullable" only.
  - The new "wherever a bitmap is sliced at a byte-aligned offset…" wording (`:92`, `:2298`) generalizes past what was observed. The bytes differ only when the source's padding bits past the window differ from the copy's zeros.
- **D4 (nit, already present at `273a79d`): a misplaced doc.** `retain_or_compact_single_run`'s doc sits on `single_run_retention` (`stream.rs:2248-2266`). Its last sentence reads as if the live stream never compacts.
- **D5 (nit): one comment still has no commit.** The live text test's `RECORDED MUTATION` comment (`stream.rs:2863-2866`) names no commit. It holds when re-run (row X7, `Arc::clone`).
- **D6 (nit): one commit missing from the fixture-commit lists.**
  - SKP-V0 §4 item 13, §8's `skp/0.6` Mechanics, §9.1 and `SKP_VERSION`'s doc list the version's fixture commits.
  - They omit `c9ec02e`, which changed the conformance fixtures. The architect decides whether those lists cover that suite.

### §8 items 15 and 17
- **Publish's texts are byte-identical to main.** Main's engine source is unchanged from `46ff585` to `254fbfa`.
  - The identity text is pinned by the C-c test.
  - The dictionary, `Float32` and final-arm texts match main's source when rendered by Rust's continuation rules.
  - `admit_bundle_format` is unchanged in round 2.
- **The only new operator-visible text** is the mapped reserved-`id` Display (`attributes.rs:226-230`). It states an engine fact, and main has no counterpart.
- **C-a and C-b removed text that no owner rendered.**
- **Filter:** a dictionary is still refused by name before the gate (`predicate.rs:1058`).
- **Item 17:** there is no shell diff, and no sentence calls B1 complete.

### Suites at `c9ec02e`
- **Cargo workspace.** Command: `cargo test --workspace --locked --no-fail-fast --features spatial-engine/fixture`, with `CARGO_TARGET_DIR` set to the worktree's `target/`.
  - Result: **774 passed, 0 failed, 40 ignored, 80 targets**, exit 0, 694 s.
  - Per crate:

    | crate | passed | ignored |
    |---|---|---|
    | engine | 353 | 12 |
    | kernel (lib 123 + `publish-bundle` 4 + integration 167) | 294 | 28 |
    | skp | 48 | 0 |
    | data-plane | 47 | 0 |
    | renderer | 32 | 0 |

  - Disclosure: my first run was concurrent with my own scratch DuckDB build. `engine/tests/slice.rs:683` failed at 101.33 ms against its 100 ms budget, and fail-fast stopped the run. The branch does not touch that file. It passed in the uncontended run above and in CI.
- **Shell:** `tsc --noEmit` exit 0. vitest: 72/72 files, 1090/1090 tests.
- **Scripts:** `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 315/315.
- **Verify tools:** all six exit 0.
  - `verify.mjs` PASS; `queue.mjs --check` and `site.mjs --check` report current.
  - `verify-cites` PASS: 833 files, 39 advisories.
  - `verify-quotes` PASS: 109 checked.
  - `verify-test-claims` PASS: 302 claims.
- **CI at `c9ec02e`:** all four runs concluded **success**.
  - `36337902356` Rust workspace (windows-latest; its log shows 80 targets, 774 passed, 40 ignored)
  - `36337902735` shell
  - `36337902403` Governance
  - `36337902372` bundle viewer

### Commits
- All 9 commits in the round are signed off: `a472add`, `ca3d7ae`, `a30007c`, `d0631fe`, `fd9036f`, `0b517d9`, `37b3644`, `8b06927`, `c9ec02e`.
- Each stages only the files its record declares. `a30007c` and `d0631fe` change comments only.
- The preregistration is append-only: +174/−0 since `e3430d2`.
- The branch diff has no CR bytes and `git diff --check` is clean.

### Round 25 checks
- No full-form §7 budget exists, so class 8 cannot fire.
- The class-9 amendment precedes its code.
- No record calls a `verify-mutation` run an observation.
- No test-text span is pinned by hash at a branch commit, and each is named with its commit.

### Head reviewed
`cut/b1-engine-projection @ c9ec02e32cb36a64a446424f6db2f4584cacdefc` (pushed).

Files:
- `C:/dev/wt/b1-projection/engine/B1-PROJECTION-PREREGISTRATION.md`
- `C:/dev/wt/b1-projection/engine/src/stream.rs`
- `C:/dev/wt/b1-projection/engine/src/attributes.rs`
- `C:/dev/wt/b1-projection/kernel/tests/skp_projection.rs`
- `C:/dev/wt/b1-projection/protocol/skp/tests/conformance/DIVERGENCES.md`
- `C:/dev/wt/b1-projection/state/drafts/b1-amendment-9.draft.md`
