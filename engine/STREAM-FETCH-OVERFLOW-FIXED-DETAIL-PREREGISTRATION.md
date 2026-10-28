# engine: an admitted predicate's integer overflow first raised during a fetch ends the stream with the fixed detail — full preregistration

*Committed before the step-0 observation and before any code. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node stream-fetch-overflow-fixed-detail, filler entry 9 (S3), the full form with both gates by the human's ruling B of 2026-10-28. Its sections and notes are the architect's draft (`state/consults/2026-10-28-stream-fetch-overflow-fixed-detail-form-architect-draft.md`, read only at main ef31514a; its sha256 from line 5 is 526b95ffe503de15e671522e6dcc87b265e7966a16e04adec35464fa163f1903), carried byte for byte with these changes, all the custodian's: each cite read at ef31514a is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a path starting with a dot, and the root `Cargo.lock`, whose name the tree holds more than once, as `path:line` at <commit>, sha256 <hex>; 2 such): the cites the draft marks, every cite on a line before that line's last marker, and every cite written with a file name that resolves to one tracked path (17 pins; 0 by a bare or partial name; 0 line numbers bound to the path before them; 0 left as written); the one sub-line cite, the ruling B directive's line 17, written as a path:line cite with that line's hash; the draft's own lead line replaced by this one; its section 10 heading moved after the notes and the settlement; its closing list of files read dropped. Third-party files stay cited by package root and line, as the draft writes them. Every pin is historical: for the code, the piece's base tree is authoritative. Form path: `engine/STREAM-FETCH-OVERFLOW-FIXED-DETAIL-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## Header

- **Title:** At the fetch site, the duckdb crate's panic payload is recognised by its fixed prefixes, anchored. An admitted predicate's integer overflow first raised during a fetch then ends the stream with the existing fixed detail, after the batches already delivered. Every other fetch-site failure keeps its text.
- **Authority:**
  - PLAN node `stream-fetch-overflow-fixed-detail` (PLAN.yaml:3511-3527 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:8ec7c5273a26286c5b12fa00c1504de08c03794536c61f5d9fb88c450559b75e): route B of stream-evaluation-failure-fixed-detail, S3 by the filler rule unless the human grades it.
  - Placed on the filler queue by the human's ruling of 2026-10-25, item 1 (`state/directives/2026-10-25-255-route-b-o1-lead-data-probe-session-end-lines-s2-context-monday-no-redaction-pr.md`).
  - Ordered and sized by the human's ruling B of 2026-10-28 (state/directives/2026-10-28-rulings-by-lane-o1-filler-order-8a-governance-slots-docs-adr-017-note.md:17 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:33e6d0be5e27c01f4a019c852eecb4198eb51cbc31fee04c7573a9e3be099905, B; a sub-line span, the line's hash). Paraphrase: over 260 lines, the full form with both gates, kept in the filler slot, with its strings P6 placeholders.
  - The filler rule is AUTONOMY.md §36.
- **Drafted by:** the architect, on the custodian's brief, read only at main ef31514a.
- **Order:** this form is committed first. Step 0 (§9) observes the payload through the engine, with nothing committed. A class 1 amendment records step 0. Only then is any code written.

## §0 Disclosure

1. **Evidence this form rests on:**
   - The reviewer's probe, outside the engine, on the MSVC-built DuckDB: state/consults/gates/2026-10-24-stream-evaluation-failure-fixed-detail-gate1-reviewer.md:13-18 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:6e6cd9fcf70201c881af3b89f0ba89a35a399ddef7dfab0daba2737872dad3fe. It used 4,000,000 arrow-rs-written rows, where only the last 1,000 overflow `v * v` with operands near 3.6e18. `stream_arrow` returned Ok, 1,932 chunks were delivered, and then `next()` panicked. The reviewer recorded the payload in words only, with its separator described as "its next line" (:16). The probe file is in the reviewer's scratch: it is evidence and is never cited as Authority.
   - The controls in the same report (:18): with the overflow starting at row 2,000,000, and on a 2,048-row file, the error came at `stream_arrow`.
   - O1's P0: the 4,096-row B3 files raised at the `execute:` site on clang-cl (state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md:112 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:53e5bb161e02f253a5fc97ce12f9cdd518c9918fffc5ca64e34b3e3e545ac418). So no engine run on record has reached the fetch site.
   - The route draft's Route A: state/consults/2026-10-24-stream-evaluation-failure-fixed-detail-route-architect-draft.md:24-62 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:b98eeeefe866a34aff8ae4250e26f60aadf5e9e214e6ea68ea1de49417939643.
2. **The engine path at main:**
   - The fetch arm catches the panic around `arrow.next()`, downcasts the payload and passes it whole to `classify` (engine/src/stream.rs:1909-1937 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:01509710e7c0306bbc6d479cc084b574f5b2abe88c1de1fbd7b0222bf593c28e). Its design note says to keep what the panic said (:1914-1915).
   - `classify` returns `Cancelled` first. Otherwise it returns the fixed detail when `is_out_of_range(message)` holds, and `{phase}: {message}` for anything else (engine/src/stream.rs:2604-2623 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:7350ed1bceeab91c709a956a9e0674464b4cedb9298f1043a3fc4c17fb6f2670).
   - `is_out_of_range` is `starts_with` on DuckDB's class label. The crate's words come first at this site, so the arm never matches here (engine/src/stream.rs:2591-2601 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:25cd3817ee5865ea2e94954baee5f0640c434b95ca44cd54a11cf36be4621ee2, the doc that states it).
3. **The payload's construction, read from package source.** Each line below is the architect's byte-copy from the named file, text after its indentation. The worker re-copies each by script into the class 1 amendment.
   - The duckdb crate 1.10505.0 (`Cargo.lock:541-543` at ef31514ac3f3ada109325d81fa0f4b5a8b380c8b, sha256 0eff2b212b4fc4b15402067850420adf50261e2e0f65668c9399d1b842e2b4ac), `src/arrow_batch.rs`, line 46: `Err(err) => panic!("Failed to fetch Arrow record batch: {err}"),`. `ArrowStream` is `Arrow` (line 55).
   - The same crate, `src/error.rs`, line 171: `Self::DuckDBFailure(_, Some(ref s)) => write!(f, "{s}"),`. So `{err}` is DuckDB's message alone.
   - The same crate, `src/executed_result.rs`, lines 239-243 and 258-264: a null chunk from `duckdb_fetch_chunk` returns `duckdb_result_error`'s text as the error.
   - libduckdb-sys 1.10505.0 (`Cargo.lock:1185-1187` at ef31514ac3f3ada109325d81fa0f4b5a8b380c8b, sha256 1feafbd60b77d06cab6c9128a077bca5a6ed10f5eaad49b163a473da28080f1b) vendors DuckDB v1.5.5, per its `duckdb.tar.gz` read in an extraction, `src/function/table/version/pragma_version.cpp`, line 11.
   - In that source, `src/main/stream_query_result.cpp`, lines 179-187 (`CheckExecutableInternal`) and 36-45 (`LockContext`), throw `InvalidInputException` with `Attempting to execute an unsuccessful or closed pending query result`, plus the format `"\nError: %s"` of the stored error when one exists.
   - `src/common/error_data.cpp`, lines 62-67, renders each error as its type name, a space, `Error: `, then the raw message. The type names come from `src/common/exception.cpp`: line 146 is `Invalid Input` and line 116 is `Out of Range`.
   - By that reading, the wrapped shape is, byte for byte: the crate prefix `Failed to fetch Arrow record batch: `, then `Invalid Input Error: Attempting to execute an unsuccessful or closed pending query result`, then one LF byte, then `Error: `, then DuckDB's out-of-range message beginning `Out of Range Error`. That agrees with the reviewer's account. The separator bytes are first observed at step 0.
4. **Hypothesis H-BARE** (labelled; discriminator: step 0). By `src/main/capi/stream-c.cpp`, lines 28-35, and `stream_query_result.cpp`, lines 87-101, an overflow thrown inside the fetch call's own task can also be stored unwrapped. The payload would then be the crate prefix followed directly by `Out of Range Error…`. Which shape a run shows is not determined here (OPEN-1).
5. **Hypothesis H-REACH** (discriminator: step 0, then the PR's CI runs). Whether an engine stream reaches the fetch site depends on how far DuckDB runs ahead before `stream_arrow` returns, on thread count and row-group layout. The controls show it is not a property of row position alone.
6. **No fixture-drive confound.** No measurement is made against the 5 GB fixture.

## §1 What this preregistration may and may not claim

- **May claim, once §4 is green on the Windows and Linux L1 entries.** On the build of record (libduckdb-sys 1.10505.0 / DuckDB 1.5.5; Windows compiled with clang-cl per `.cargo/config.toml`; Linux as CI builds it), the following holds for an admitted same-type BIGINT `*` whose overflow is first raised during a fetch, with the payload in a shape §2 accepts:
  - it ends the stream after at least one delivered batch;
  - its terminal text is exactly `query: ` followed by S1;
  - every other fetch-site failure keeps `duckdb fetch panicked: <payload>` byte for byte.
- **May not claim:**
  - A payload shape §2 does not accept, which keeps its text: a doubly wrapped one, and the bare one if OPEN-1 is (A).
  - `+`, `-` or unary `-` at the fetch site: they are read by the same label, but only `*` is proven.
  - Which overflows reach the fetch site rather than execute (H-REACH).
  - Another duckdb crate or DuckDB version.
  - macOS, until an entry there has run E1. If port-2's macOS entry runs E1 in this PR's CI, the closing amendment may cite that run.
  - Any docs/08 figure, and any run time or disk figure.
  - W2-B observation 2 (SQL in other `engine.query` details), which is node `engine-query-terminal-detail-sql-audit`'s.
- **ADR readings, none amended:**
  - ADR-021: admission is unchanged. Its Note 2026-09-30 item 4 still leaves integer overflow undecided (docs/adr/ADR-021-row-filter-on-viewport-query.md:265 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:c69f5c769759153e20d322e6661a09a0bf36425c489beb99d8d235c145887e37). No admission rule, refusal code or composition changes.
  - ADR-010 rule 7 (docs/adr/ADR-010-render-frames-origins-boundaries.md:82 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:f02fe0482bd64195c5d0b3108475d065d291e9aa23b1b3a4e018b32ea6d1d779): the stream still ends with a typed, surfaced `EngineError::Query`.
  - ADR-018: `Cancelled` is still returned first at the fetch arm. The interrupted-fetch path's handling and trace mark are unchanged.
  - ADR-006: no undo class is touched.
- **The fixed detail's own record:**
  - engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md, Amendment 2, item 1, and Amendment 3, item 3, bound that piece's claim to the prepare and execute sites and give the fetch site to this node.
  - engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md, §1 ("May not claim", fourth item), excludes the fetch-site terminal for the same reason.
  - Both are immutable. This form carries the fetch-site claim, and neither is edited.
  - The parent's note B stop rule binds the parent only. This form's own matching rule is §2.
- **Wire:** no SKP, data-plane or MCP change. The terminal code stays `engine.query`. Only the `detail` text changes, for this class at this site, inside the existing free-text field, under SKP-V0 §5's unchanged rule. Nothing under `protocol/` changes.
- **Strings:** none added. S1 is reused unchanged, a `[P6 placeholder]` (engine/src/stream.rs:2602 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:5081f5519527f790774491fb7482d1ac44d4920e0a38b8c7bda2fcfcafda5c2c).

## §2 The change, stated before it is applied (engine/src/stream.rs only)

1. **Two private constants.** Their bytes are byte-copied by script from step 0's record and from the source lines in §0.3, never from prose:
   - `FETCH_PANIC_PREFIX`: the crate's prefix, the bytes before `{err}` at `src/arrow_batch.rs`, line 46.
   - `PENDING_RESULT_WRAPPER`: DuckDB's wrapper and separator, up to and including the `Error: ` that follows the LF.
   - Each constant's doc names its source by package root and line.
2. **A private recogniser of the fetch-site payload,** using anchored prefix strips only:
   - strip `FETCH_PANIC_PREFIX` at the start, or no match;
   - then, under OPEN-1 (B), either the remainder itself, or the remainder after stripping `PENDING_RESULT_WRAPPER` at its start (under (A), only the shapes step 0 records);
   - then the result must satisfy `is_out_of_range`, unchanged, which is `starts_with` the label.
   - No `contains`, `find`, regex or search anywhere.
3. **The fetch arm.**
   - If the recogniser matches, `classify` is called with DuckDB's text from the label on. It returns `Cancelled` first, else the fixed detail.
   - Otherwise `classify(cancel, "duckdb fetch panicked", &detail)` runs exactly as today, so every other payload renders byte-identically.
   - The design note at :1914-1915 gains its one exception: the out-of-range class.
4. **Docs made true.**
   - The docs above `OUT_OF_RANGE_DETAIL`, `is_out_of_range` and `classify` now say the fetch site keeps DuckDB's text. They are rewritten to name the fetch site as covered for the accepted shapes.
   - The campaign doc sentence at engine/tests/admission_property_campaign.rs:1022-1026 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:bff82e2092bd669c36c019e3cddc64d65f40b034be20dc5bb11d5bc4c94b568b changes the same way.
   - These are worker doc comments, and §31 applies at the gates.
5. **Not changed:**
   - prepare and execute (:1799-1801, :1848-1857);
   - `classify`'s signature and order;
   - S1;
   - `EngineError`;
   - `engine/src/lib.rs`, which is port-2's path;
   - Cargo.toml and Cargo.lock;
   - any `pub` item;
   - every file under kernel/, protocol/ and frontends/;
   - KNOWN-LIMITATIONS.md: no item exists for this case, and none is added.
6. **Portability:** not an OS-dependent feature. The payload is the crate's and DuckDB's on every platform. No R3 item is needed, and the claim is limited to the entries that ran (§1).

## §3 Fixtures, outcomes predicted before step 0 and before code

| Cell | File | Query | At main (step 0) | At the head (E1) |
|---|---|---|---|---|
| F-1M | 1,000,000 rows | `v * v > 0`, shapes `all` and `view` (bbox = the file's extent) | admitted; then unpredicted (H-REACH): an error after ≥1 batch, or at execute with 0 batches | if chosen by the rule below: ≥1 batch, then exactly `query: ` + S1 |
| F-4M | 4,000,000 rows | as F-1M | admitted; predicted by analogy with the reviewer's probe, not certain: ≥1 batch, then `query: duckdb fetch panicked: Failed to fetch Arrow record batch: ` + DuckDB's text, wrapped as §0.3 or bare (H-BARE) | as F-1M |
| I | each F file | an independent connection: `SELECT v * v FROM read_parquet(?) WHERE id = <first tail id>` | an error beginning `Out of Range Error` (raise, not wrap) | the same, asserted inside E1 |

- **Every F-N file:**
  - columns `id` UInt64 (the row index), a Point WKB `geometry` declared `["Point"]`, a covering bbox (the view shape needs one: engine/src/stream.rs:1492 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:ab6c938354fe623d9ad30f221c42a5e6d66297539423a8a3dd4cc232a9286c93), and `v` Int64;
  - `v = id` on every row except the last 1,000, where `v = 3,600,000,000,000,000,000 + k` for k = 0..999. These magnitudes are at or above 2^32, so they raise on the MSVC build too (O1's reading), and step 0 observes them raising on clang-cl;
  - written by a local arrow-rs writer in the test file, after the precedent at engine/tests/b1_projection_hostile_covering.rs:44-118 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:df53fcaca49b3e0628d354a7b3ef87e1b41faac97ca06f738bb4b626dfc28268, with writer defaults: row groups of 1,048,576 rows and statistics on.
- **Each file is checked before use:**
  - its row count;
  - `Dataset::open` returns Ok;
  - `v` is Int64;
  - the tail values read back;
  - its sha256 is equal before and after the stream.
- **The size rule, fixed now:** E1 uses the smallest N at which every step-0 run, in both shapes, reached the fetch site, meaning at least one batch before the terminal.

## §4 Tests, and the mutation per new test

**E1** `an_admitted_integer_overflow_first_raised_during_a_fetch_ends_the_stream_with_the_fixed_detail` (new; placement per OPEN-2).
- Runs through `AdmittedPredicate::admit`, then `Dataset::stream_with_cancel(&ViewportQuery, CancelToken)`, drained with `next_into`. That is the interface the kernel calls, and the drain's real shape is engine/tests/admitted_integer_overflow.rs:326-378 @ ef31514ac3f3ada109325d81fa0f4b5a8b380c8b sha256:08df3d74ff76c2b2315d379f14f9f74622b0d0aaa8c43108c85ad6205cb27ba6.
- Both shapes. Asserts:
  1. admitted;
  2. at least one batch before the terminal;
  3. the stream ends in error;
  4. the Display equals `query: ` + S1 byte for byte;
  5. no tail operand's decimal digits and no `read_parquet(` in the text.
- Before streaming, cell I is asserted: the operands raise, they do not wrap.
- No `#[ignore]` and no `cfg`.
- **M1** (the node's): the fetch arm restored to pass the raw payload to `classify`, so the recogniser is not called. Predicted to fail by name at assertion 4, with the left side beginning `query: duckdb fetch panicked: Failed to fetch Arrow record batch: `.

**T3** `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start` (new, `engine/src/stream.rs` mod tests).
- Positive samples, built from step 0's recorded bytes: each accepted shape → the fixed detail through `classify`.
- Negative samples:
  - the wrapper with a non-range inner error (an `IO Error`);
  - the crate prefix with an `IO Error`;
  - the label later in the text after the crate prefix;
  - the wrapper without the crate prefix;
  - a leading space.
  - Each negative must keep `duckdb fetch panicked: <payload>` exactly.
- A cancelled token → `Cancelled`.
- **M2:** after the wrapper strip, the recogniser accepts any inner text. Predicted to fail by name at the wrapped `IO Error` sample.
- **M3:** the anchored strip replaced by a search for the label after the crate prefix. Predicted to fail by name at the label-later sample.

**Each mutation is observed** by applying it alone, running the named test, recording the failing assertion with the full commit id in a `RECORDED MUTATION:` doc line, and reverting. No `verify-mutation` run is called an observation (template, Round 25 additions, (c)).

**Existing tests that must stay green, unloosened:**
- `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` (T2, unchanged);
- `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail`;
- `filter_admission_property_campaign`, with its leak assertion unchanged;
- `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit`;
- `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`;
- the five tests in `engine/tests/admitted_integer_overflow.rs`.

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:** the §3 table; E1 and T3 green on the Windows and Linux L1 entries; M1 to M3 failing as §4 says.
- **Declared unchanged:**
  - the prepare and execute renderings;
  - every non-matching fetch-site text, byte for byte;
  - `Cancelled` first;
  - S1;
  - admission;
  - the wire;
  - every existing assertion;
  - Cargo.toml and Cargo.lock;
  - no `pub` item and no variant.
- **Invalidators. Each stops the piece and goes to the human, or to the architect where marked:**
  1. Any step-0 run completes with no error (a wrap). This is an S1-shaped finding and goes to the human at once.
  2. No N meets §3's size rule (architect).
  3. A fetch-site payload not beginning with the crate prefix, for example `no panic message`.
  4. DuckDB's text, after the crate prefix and any wrapper, not beginning with the label.
  5. A shape §2 does not name, such as a double wrapper. It is recorded and not recognised.
  6. A step-0 run over §7's ceiling (architect).
  7. Any non-matching text changed.
  8. E1 on a CI entry ending with 0 batches. Pre-authorised once: the next larger step-0 N that met the size rule is taken by a class 2 amendment. A second occurrence is a stop.
- **Falsification:** at the head, a payload in an accepted shape reaching the fetch arm does not end in S1; or a non-out-of-range payload ends in S1.

## §6 Instruments

- Every quantity is an assertion: typed outcome, batch count, exact text, raise or wrap, fixture hash.
- Step 0's wall time and file bytes are observations for §7's ceiling, not docs/08 figures.

## §7 Declared values and ceilings

- **Fixture values:** as §3. N is in {1,000,000; 4,000,000}. The tail is 1,000 rows. The magnitude base is 3,600,000,000,000,000,000. The predicate is `v * v > 0`.
- **Step 0's per-run ceiling:** 300 s on the machine, in the test profile (OPEN-3). This is not a measurement claim.
- **Size:** at most 380 lines over at most 4 files (`engine/src/stream.rs`, the E1 file, `engine/tests/admission_property_campaign.rs`, `engine/README.md`). This form and PLAN.yaml are excluded.
  - Counting command: `git diff --numstat origin/main...HEAD -- <the four paths>` at a named commit. An overrun is class 8.
  - My estimate is about 300, with rustfmt's expansion included (O1's lesson: 523 lines against an estimate of about 350):

| File | What changes | Lines |
|---|---|---|
| engine/src/stream.rs | two constants with docs (~12); recogniser with doc (~15); fetch arm and design note (~9); three docs rewritten (~32); T3 with its RECORDED MUTATION lines (~30) | ~100 |
| E1 file (new, OPEN-2 (A)) | header and uses (~22); writer with covering, checks and hash (~85); drain (~35); E1 with cell I and its doc (~45) | ~185 |
| engine/tests/admission_property_campaign.rs | the doc sentence at :1022-1026 | ~9 |
| engine/README.md | the Viewport stream pinned-by pointer and the Last verified line (:533, :536) | ~4 |

- **Budget:** the node's 120 minutes of worker time is the custodian's to revise. Builds under holds are excluded.

## §8 Block-on-sight

1. Any code committed before the class 1 amendment recording step 0.
2. A constant's bytes not byte-copied by script from step 0's record or the named source lines.
3. Any match that is not an anchored prefix strip (`contains`, `find`, regex, search).
4. S1 for any class but out-of-range, or any other text changed at any site.
5. `Cancelled` not first.
6. A new `pub` item, `EngineError` variant or dependency; an edit to Cargo.toml, Cargo.lock or `engine/src/lib.rs`.
7. E1 `#[ignore]`d, `cfg`-gated, or not run on both entries; assertion 2 or 4 weakened.
8. Step 0, or any probe, on a shared cargo target, or anything from it committed.
9. A campaign exclusion or the leak assertion loosened.
10. A docs/08 figure or a macOS claim without a run.
11. Any path under kernel/, protocol/, frontends/ or .github/, KNOWN-LIMITATIONS.md, or a path in §(00)'s in-flight lists.
12. A `verify-mutation` run called an observation.
13. A new user-visible string, or S1 changed.
14. Any CI entry red.

## §9 Gates and sequence

1. **This form is committed.**
2. **Step 0, by a tester-high, nothing committed.** Machine rules apply, shared hold only (§36).
   - **What is run.** A new detached checkout at main at dispatch, under C:/dev/wt/, on its own new target. The tester records:
     - that `.cargo/config.toml` is Amendment 2's bytes in the O1 form (sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f);
     - with `CC_ENABLE_DEBUG_OUTPUT=1`, one DuckDB `running:` line naming clang-cl;
     - the output of `clang-cl --version`.
   - **The probe.** An untracked probe test writes F-1M and F-4M per §3. It runs cell I and each F cell in both shapes through `Dataset::stream_with_cancel`, twice per process, in two processes.
   - **What is recorded, per run:**
     - batches and ids before the terminal;
     - the terminal Display in Rust `{:?}`-escaped form, its byte length and its sha256;
     - the byte offsets where the crate prefix ends, where any wrapper ends, and where the label begins;
     - the panic hook's stderr location line;
     - wall time;
     - file bytes.
   - **What stops:** §5's invalidators 1 to 6.
   - The report goes under `state/consults/`.
3. **A class 1 amendment** (references and hashes) records step 0, the accepted shapes (OPEN-1 as ruled), and N by §3's rule.
4. **Code, by a worker,** on a branch in its own checkout and on its own new target. M1 to M3 are observed and recorded.
5. **The draft PR, then both gates from dispatch** (ruling B):
   - the architect: §1's readings and §8 item by item;
   - the reviewer: the full diff, and the seam against the crate's actual payload.
6. **Suites:**
   - product-ci-rust, on Windows and Linux L1 (and macOS if port-2 has merged);
   - the governance checks;
   - `node --test` over the scripts suite before pushing.
7. **Operator:** no new walkthrough row. The custodian notes on S1's owed P6 sighting that the banner now also shows S1 for an overflow first raised during a fetch.

# Rule (00), path by path

This piece's paths:
- `engine/src/stream.rs`
- the E1 file (OPEN-2 (A): `engine/tests/stream_fetch_overflow.rs`, new)
- `engine/tests/admission_property_campaign.rs`
- `engine/README.md`
- this form (new)
- `PLAN.yaml` (the custodian's rows)

| In flight (the brief's lists, at main f5f91424) | Overlap |
|---|---|
| cut/port-2-macos-l1-and-app-dirs @ 83d2ecef | None. Its engine paths are `engine/src/{app_dirs,lib,lod}.rs` and `engine/tests/lod_tier_*.rs`; this piece does not touch `engine/src/lib.rs` (§8 item 6). Contact, not overlap: after both merge, E1 runs on its macOS entry. |
| cut/b2-piece-1c-save-and-reopen @ 7109aeb2 | None (kernel/, renderer/, docs/adr ADR-022 and ADR-036, spikes/). |
| Open PRs | None, per the brief. |
| Docs and governance lanes | Not in the brief's lists. The custodian checks them at dispatch by `git diff --name-only origin/main...<branch>`. |

# The reuse index (the custodian's run in the read-only reuse clone, byte for byte; no prior art, a miss noted)

```text
$ node tools/reuse.mjs stream fetch overflow
No prior art recorded for "stream fetch overflow". Research it before planning an implementation.
$ node tools/reuse.mjs arrow batch panic
No prior art recorded for "arrow batch panic". Research it before planning an implementation.
$ node tools/reuse.mjs fixed detail fetch
No prior art recorded for "fixed detail fetch". Research it before planning an implementation.
```

---

## OPEN items

- **OPEN-1 (the human's): the bare shape (H-BARE).**
  - (A) The recogniser accepts only the shapes step 0 records. A shape not seen keeps DuckDB's text, the behaviour before this piece.
  - (B) It accepts both anchored shapes:
    - the wrapped shape, proven end to end by E1;
    - the bare shape (crate prefix, then DuckDB's text with the label at its start, which is the parent's own rule applied after the crate's fixed words). The bare shape is read from source (§0.4), proven by a T3 unit sample only, and disclosed as unobserved through the engine.
  - **I recommend (B).** It is not a looser match, since it is the same class label at the start of DuckDB's own text. It closes a leak that ordinary use may reach, and the code path has the product caller (the fetch arm). If step 0 records both shapes, (A) and (B) coincide.
- **OPEN-2 (the custodian's): where E1 lives.**
  - (A) A new file, `engine/tests/stream_fetch_overflow.rs`, plus the owner's-index pointer in `engine/README.md`.
  - (B) `engine/tests/admission_property_campaign.rs` beside T1, with no README edit, but a large local writer in a large file.
  - (C) `engine/tests/admitted_integer_overflow.rs`. Its header says that every file is one 2,048-row group and that the fetch site is not reached by construction (:14-16), so that sentence would also change.
  - **I recommend (A).**
- **OPEN-3 (the custodian's): step 0's per-run ceiling and the N candidates.** 300 s, and {1,000,000; 4,000,000}. These are my choices for planning, not measurements. The alternatives are a tighter ceiling, or 4,000,000 alone (the only shape observed to reach the fetch site, outside the engine).

## What I could not settle

- Which payload shape a run shows, and why the reviewer's run showed the wrapper (H-BARE).
- Whether 1,000,000 rows reaches the fetch site through the engine, and whether the CI runners' core counts change that (H-REACH). §5 invalidator 8 pre-authorises one move.
- Run time and disk for F-4M in the test profile, on the machine and on CI.
- Whether a doubly wrapped payload can occur. If step 0 sees one, it is §5 invalidator 5.
- The docs and governance lanes' in-flight paths, which the brief did not list.
- I recomputed no hashes and ran no git commands. Every pin above awaits the custodian's script.

## The custodian's settlement (class 1, before step 0 and before any code)

- **OPEN-1: (B), the human's** (`state/directives/2026-10-28-entry-9-open-1-b-both-shapes-anchored-the-claim-split-step-0-on-clang-cl.md`), referenced and not restated:
  - Both shapes are recognised, anchored at the start: the crate's fixed prefix, then DuckDB's overflow text, nothing looser.
  - The claim is split, and §1's claim reads through it:
    - the wrapped shape is observed through the engine (step 0, then E1);
    - the bare shape is recognised by the mapping and proven by a T3 unit sample fed the exact text DuckDB's source composes, cited to its source line. It is never observed through the engine.
  - If step 0 observes the bare shape, the class 1 amendment upgrades its claim to observed.
- **OPEN-2: (A), the custodian's.** E1 lives in a new file, `engine/tests/stream_fetch_overflow.rs`, with the owner's-index pointer in `engine/README.md`.
- **OPEN-3, the custodian's, as drafted.** Step 0's per-run ceiling is 300 s, and N is 1,000,000 or 4,000,000.
- **Step 0's build:** main's clang-cl build. #266 merged as fa720a7f before this commit, and a run on an MSVC build counts for nothing (the same ruling).
- **Rule (00), and the docs and governance lanes the draft could not see:**
  - Checked at main ac3b697c by `git diff --name-only origin/main...<branch>`, over the open PRs (0) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`).
  - None touches the piece's paths, and none touches `protocol/`.
  - The other unmerged `cut/` branches on origin carry no open PR and no node in progress, so they are not in flight: `cut/b1-close-nul-names` (last commit 2026-09-29, no PR), `cut/kernel-ticket-drop-followups-p1-base` (last commit 2026-10-03, no PR), `cut/publish-approval-ttl-ten-minutes` (last commit 2026-10-21, its PR #236 merged), `cut/workspace-rustfmt` (last commit 2026-10-02, its PR #157 merged).

## §10 Amendments (opens empty; append-only)

### Amendment 1 (2026-10-28), class 1: step 0 recorded. Written after step 0's results were seen. References and hashes only.

- **The report:** `state/consults/2026-10-28-stream-fetch-overflow-fixed-detail-step0-tester-high-report.md`, at main c98921bc2e0309bad64730bbe42bf7548014032b, on the clang-cl build (the config's sha256 as Amendment 2 of the O1 form gives it; one cold DuckDB build on the checkout's own target).
- **No invalidator** (§5, items 1 to 6) fired. Cell I raised on both files, with no wrap.
- **The shapes** (the settlement's OPEN-1 (B)):
  - The wrapped shape was observed on all 16 runs (F-1M and F-4M, both query shapes, twice per process, two processes), each terminal byte-identical: 263 bytes, sha256 1a18f782fb2bf7242d176e8cd47cc98432c11df3b72301bf5ab8e2b46fe5fd25.
  - The crate prefix, the wrapper and the label are contiguous, with one LF inside the wrapper (the report's byte offsets).
  - The bare shape was not observed, so its claim stays as the settlement words it: recognised, proven by a unit sample, never observed through the engine.
  - No other shape appeared.
- **N by §3's size rule:** 1,000,000. Every F-1M run delivered 31 batches before the terminal; F-4M delivered 123.
- **The raw files**, in the local evidence folder under `2026-10-28/e9-step0/`: `e9_step0_probe.rs` (sha256 b55ce87c71c2bcff72401e65f831a1cc8c18a9a5beeccfdd8086050380ac728e), `e9s0-proc1-stdout.txt` (sha256 26f9c46b43d7c4a55c7adf5b9a30e1893911c308b28ef1f7bf623cb158cfa6f8), `e9s0-proc1-stderr.txt` (sha256 7ce3e85abb806956691e8c896cf39dbb03ec65fe0c09711a64b27ff552d92eaf), `e9s0-proc2-stdout.txt` (sha256 1d006aac552839f2a37f783ff4f7a7afd07fc964827c168bcf96ac478fc4f69c), `e9s0-proc2-stderr.txt` (sha256 0646b9ac114bde197bd356ec8de1a5f6e6885ed7c514309d8e3da020e8a76fba). The constants of §2 item 1 are byte-copied by script from these records and the source lines §0 item 3 names.
- **Next under §9:** the code, by a worker, on a branch in its own checkout and on its own new target.

### Amendment 2 (2026-10-28), class 8: budget overrun, §7 not edited. Written after the piece's results were seen.

- **Declared** (§7): at most 380 lines over 4 files. **Final at 5efcc669**, by §7's counting command: 432 lines over the 4 files (`engine/README.md` 2/2, `engine/src/stream.rs` 139/16, `engine/tests/admission_property_campaign.rs` 4/3, `engine/tests/stream_fetch_overflow.rs` 266/0).
- **The reason:** the E1 file came to 266 lines against about 185, and `engine/src/stream.rs` to 155 against about 100 (`state/consults/2026-10-28-stream-fetch-overflow-fixed-detail-build-worker-report.md`); nothing was trimmed to fit.
- **Disclosed for the gates, not changed:** `engine/tests/admitted_integer_overflow.rs`'s header (lines 14 to 16 at main) still says the fetch site is not reached and belongs to this node, which is now stale; the file is outside this form's Scope. The worker's report also discloses one `git fetch --dry-run` against the brief's no-network rule, and a commit and its push in one call.
