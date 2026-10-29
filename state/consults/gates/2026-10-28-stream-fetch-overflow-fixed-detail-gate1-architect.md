Reviewed: PR #268 at 5efcc6696481a729a658f1e39c8dcfaa0ccdc5e6, gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/stream-fetch-overflow-fixed-detail @ 5efcc6696481a729a658f1e39c8dcfaa0ccdc5e6 (worktree C:/dev/wt/e9; base B 1fa66237; the form read on main at 626357c5)

I have no shell, so I computed no sha256 and ran no git, cargo or gh command. Every figure below comes from files I read.

## Findings by class (AUTONOMY §22)

**Correctness: none.**

**Evidence: none found. Two checks are still open because I could not run them:**
- **E-open-1 (§8 items 7 and 14).** I could not read the PR's CI. §1's claim holds only when E1 and T3 are green on the Windows and Linux L1 entries. Before the merge, the custodian or the reviewer reads both entries. Either entry red, or E1 not run on it, is a FAIL on Evidence.
- **E-open-2 (check 3, the PR body).** I could not read the PR body. Before the merge, it must claim no more than §1 as the split reads it: the wrapped shape observed through the engine at step 0; the bare shape by T3's unit sample only; nothing for macOS or for another crate or DuckDB version.

**Documentation: must-fix before the merge.** None of these is the human's wording. All are worker doc comments or a README line, so §31 applies: the worker applies the words, there is no re-gate, and the PR body lists them.

- **D1. T3's doc, engine/src/stream.rs:2781-2782 at the head, attributes 233 bytes to Amendment 1.** Amendment 1 records the 263-byte terminal and does not give 233. The figure 233 comes from the step-0 report's panic-hook `payload_len`.
  - Current: `The wrapped sample is the payload as step 0 recorded it (the form's Amendment 1; 233 bytes on` / `all 16 runs), byte-copied by script.`
  - Replace with: "The wrapped sample is the payload as step 0 recorded it (in the step-0 report the form's Amendment 1 names: the terminal's bytes after `query: duckdb fetch panicked: `, 233 bytes, identical on all 16 runs), byte-copied by script."
  - Clause check:
    - "the terminal's bytes after …": in the report, the phase prefix ends at offset 30 and the terminal is 263 bytes. The raw stdout of both processes shows `terminal_len=263` on all 8 runs in each.
    - "233 bytes": every `PANIC-HOOK` line in both processes reads `payload_len=233`. The constant `WRAPPED` is 36 + 97 + 100 = 233 bytes.
    - "identical on all 16 runs": both processes show the same `terminal_sha256=1a18f782…` on every run.
    - "byte-copied by script": this is the worker's claim, kept as it is. Its proof is the worker's transcript.
- **D2. `PENDING_RESULT_WRAPPER`'s doc, stream.rs:2612-2613, has the same attribution.** Amendment 1 holds references and hashes, not these bytes.
  - Current: `byte-copied by script from the bytes the form's Amendment 1 records at step 0.`
  - Replace with: "byte-copied by script from step 0's recorded terminal, bytes 66 to 163 (the step-0 report the form's Amendment 1 names)."
  - Clause check: the report gives the wrapper as 66 to 163 (97 bytes), and the raw stdout shows `wrapper_start=Some(66) wrapper_end=Some(163)`. I counted the constant at 97 bytes: 21 + 68 + 1 LF + 7.
- **D3. `OUT_OF_RANGE_DETAIL`'s doc, stream.rs:2597-2603, can be read as covering all four operators at the fetch site.** The sentence before it lists `+`, `-`, `*` and unary `-`. §1 ("May not claim", second item) gives the fetch site `*` only.
  - Current: `(the wrapped payload shape, observed; the bare shape by a unit sample only); no test starts`
  - Replace with: "(an INT64 `*` only; the wrapped payload shape, observed; the bare shape by a unit sample only); no test starts"
  - Clause check:
    - E1's predicate is `v * v > 0` with `v` Int64 (stream_fetch_overflow.rs:236 and :66).
    - T3's samples are all `Overflow in multiplication of INT64` (stream.rs:2800-2802).
    - The code itself reads every operator by the label (`is_out_of_range`, :2635-2637). So this narrows a proof statement and does not describe the behaviour.
- **D4. `classify_fetch_panic`'s doc, stream.rs:2652-2653, says every other payload renders as the panic text.** It leaves out that a cancellation comes first. It also leaves out that a payload which itself begins with the label reads as out of range, as `classify` did on main. That second case needs a fetch panic not raised by the crate's line 46, so ordinary use cannot reach it. It is named here, not blocking.
  - Current: `` `classify` for the fetch site: DuckDB's text when `fetch_panic_duckdb_text` reads it out of the `` / ``payload, else the payload whole, so every other payload renders as `duckdb fetch panicked: <payload>`.``
  - Replace with: "`classify` for the fetch site, a cancellation first: DuckDB's text when `fetch_panic_duckdb_text` reads it out of the payload, else the payload whole, so every other payload renders as `duckdb fetch panicked: <payload>` (a payload that itself begins with the label, which the crate's fetch panic never does, still reads as out of range, as before this piece)."
  - Clause check:
    - "a cancellation first": `classify` returns `Cancelled` before anything else (:2643-2644), and T3 checks this (:2847-2857).
    - The crate's panic always starts with `Failed to fetch Arrow record batch: `: duckdb 1.10505.0, src/arrow_batch.rs line 46, which I read in the package source.
    - "as before": main's fetch arm passed the payload whole to `classify` (main stream.rs:1936).
- **D5. engine/README.md:533 at the head: the "Last verified" segment names a branch, not a commit.** The segment reads `checked at the head of `cut/stream-fetch-overflow-fixed-detail` (the merge commit replaces this)`. Once merged, main would carry a reference that cannot be resolved until a later commit fixes it.
  - Replace with: "the Viewport stream row's fetch-site overflow test, at e967da33", in a third commit on the branch.
  - Clause check:
    - The pointer names `engine/tests/stream_fetch_overflow.rs::an_admitted_integer_overflow_first_raised_during_a_fetch_ends_the_stream_with_the_fixed_detail`, and that test exists at the head (:180).
    - The worker's report says E1 passed at e967da33 and that 5efcc669 changes comment lines only. I could not read e967da33 itself.
    - If the PR is squash-merged, e967da33 will not be on main. The custodian then pins the squash commit instead, and says so in the PR body.

**Notes (no fix required):**
- **N1.** T3's sixth negative sample, "a doubly wrapped payload" (stream.rs:2825), repeats the crate prefix together with the wrapper. A double wrapper from DuckDB would repeat only the wrapper after a single crate prefix. Reading the code, both give `None`. The form did not ask for this sample, and §1 claims nothing for it.
- **N2.** E1 writes to a fixed temp path (`spatial-engine-stream-fetch-overflow/F-1M.parquet`, :182-184). Two concurrent runs on one machine, for example from two worktrees, would race on it, and the hash assertion would fail spuriously. This is for the reviewer and does not block.
- **N3.** Amendment 2 calls the header of engine/tests/admitted_integer_overflow.rs:14-16 "now stale". Read at the head, it is still true: that file does not reach the fetch site, and the node it names holds the case. It is incomplete, not false. Nothing to fix inside this Scope.

## Check 1: §1's ADR readings and the fixed detail's own records
- **ADR-021 (admission unchanged).** Line offsets show that nothing in stream.rs changed above the fetch arm: the arm is at :1905 on both main and the head. Between the arm and the classify block, the only shift is the arm's own +3 lines (`OUT_OF_RANGE_DETAIL`'s doc moves from main :2591 to head :2594). No admission file is among the four changed paths. ADR-021:265 (Note item 4) is read as current from the tree; its pin at ef31514a is historical, and here the tree is the authority.
- **ADR-010 rule 7** (ADR-010:82 in the tree). The arm still returns `Err(classify_fetch_panic(...))` (:1939), a typed `EngineError` that is surfaced. The variants are unchanged. Pass.
- **ADR-018.**
  - The `PRODUCER_CANCELLED` mark is unchanged (:1936-1938).
  - `classify_fetch_panic` goes through `classify`, which returns `Cancelled` first (:2643).
  - T3 asserts `Cancelled` for the wrapped and bare samples and for an IO payload.
  - Pass.
- **ADR-006.** No undo class is touched. Pass.
- **The parent form and O1's form** are not among the four changed paths, so neither is edited. Pass.
- **Wire, protocol and strings.** No path under protocol/. S1 at :2606 is byte-identical to main :2602. No string is added. Pass.

## Check 2: §8 item by item, at the head
1. **Code after Amendment 1.** The branch is cut from B 1fa66237, the commit of Amendment 1. Both code commits come after it. Pass.
2. **Constants.**
   - `FETCH_PANIC_PREFIX` (:2610) matches the package source, duckdb 1.10505.0 src/arrow_batch.rs line 46, `Err(err) => panic!("Failed to fetch Arrow record batch: {err}"),`, and the probe's `CRATE_PREFIX`. It is 36 bytes, the same as offsets 30 to 66.
   - `PENDING_RESULT_WRAPPER` (:2617) matches the probe's `WRAP` and is 97 bytes, the same as offsets 66 to 163.
   - That the copy was made by script is the worker's claim. Its proof is the worker's transcript.
   - I could not re-read the DuckDB source lines (exception.cpp, error_data.cpp, stream_query_result.cpp, multiply.hpp): they are only in the libduckdb-sys archive, and I had no extraction. The recorded bytes confirm the wrapper and the inner text independently.
3. **Anchored match only.** The product code uses `strip_prefix` twice and `starts_with` once (:2623-2637). There is no `contains`, `find` or regex. Pass.
4. **No other text changed.** The arm's non-match path is `classify(cancel, "duckdb fetch panicked", payload)`, the same as main :1936. T3 checks six negatives byte for byte. Pass.
5. **`Cancelled` first.** Pass, as in check 1.
6. **No new `pub` item, variant or dependency.**
   - Counting `^pub |^    pub fn` gives 58 on main (60 matches with the two test names in the pattern) and 58 at the head.
   - The four changed paths exclude Cargo.toml, Cargo.lock and engine/src/lib.rs.
   - Callers: `fetch_panic_duckdb_text` is called from `classify_fetch_panic` (:2658), and `classify_fetch_panic` from the fetch arm (:1939). Both have product callers.
   - Pass.
7. **E1.** It has no `#[ignore]` and no `cfg` (:179-181). Assertion 2 (:237-241) and assertion 4 (:245-249) are not weakened. Whether it ran on both entries is open (E-open-1).
8. **Own targets.** Step 0 used D:/wt-targets/e9-step0 (report, build facts) and the worker used D:/wt-targets/e9. Nothing from them is committed. Pass.
9. **Campaign.** Only the doc changed (4/3). `is_declared_integer_arithmetic_overflow`'s body at the head (:1032-1041) matches main (:1031-1040). Pass.
10. **No docs/08 figure and no macOS claim** in the code or the docs. Pass.
11. **Paths.** Four paths, all in the form's Rule (00) list. Pass.
12. **No `verify-mutation` run called an observation.** Each `RECORDED MUTATION:` line says "applied alone at commit e967da33…", with its failing assertion. Pass.
13. **No new user-visible string, and S1 unchanged.** E1's `FIXED_DETAIL` (:40) is a test copy of S1, byte-equal to :2606. Pass.
14. **CI red.** Open (E-open-1).

Mutation records against §4's predictions:
- **M1** fails at assertion 4 with the message format of :247, "all" first because `view` iterates false then true. This matches §4.
- **M2** fails at the first negative, "the wrapper with an IO Error inside", which is §4's predicted sample.
- **M3**: under `find`, the first two negatives give `None`. The third, "label later", gives `Some(...)`, which is §4's predicted sample.
- These are consistent by reading the code. The observation itself is the worker's transcript.

## Check 3: the claim and the settlement
- **Test names.** E1's and T3's names are the form's (§4).
- **Doc comments.**
  - E1's module doc (:9-11) says "The wrapped payload shape is what the engine saw at step 0 on all 16 runs; the bare shape is proven by a unit sample in `engine/src/stream.rs` only."
  - T3's doc (:2782) says "The bare sample was never observed through the engine".
  - The `OUT_OF_RANGE_DETAIL` doc gives the split. With D3 applied it also limits the operator.
  - Each follows the human's ruling (OPEN-1 (B)) as the settlement references it.
- **The bare sample's text.** It is the crate prefix plus `DUCKDB_TEXT`. `DUCKDB_TEXT` is byte-equal to cell I's recorded error string (`Out of Range Error: Overflow in multiplication of INT64 (3600000000000000000 * 3600000000000000000)!`, 100 bytes, in both processes). It is cited to its source lines (:2784-2786), as the ruling asks.
- **Platforms and versions.** Nothing claims macOS or another crate version.
- **The PR body is open** (E-open-2).

## Check 4: the amendments
- **Amendment 1 (class 1, written after step 0, says so).** Each figure matches the report and the raw files in the local evidence folder under 2026-10-28/e9-step0/:
  - 16 runs, all WRAPPED;
  - 263 bytes, sha256 1a18f782…;
  - offsets contiguous at 30, 66 and 163, with the LF;
  - no bare shape;
  - N = 1,000,000 with 31 batches, and F-4M with 123;
  - cell I raised and did not wrap;
  - no invalidator fired.

  It names the report at main c98921bc2e03…, the full id, which meets round 15(e). I could not recompute the five raw-file hashes (no shell); the custodian's filing note says it recomputed them.
- **Amendment 2 (class 8, §7 not edited).**
  - §7 still reads 380, which meets Round 25's class-8 rule.
  - The numstat is 2/2 + 139/16 + 4/3 + 266/0, so 411 added and 21 deleted, 432 in all. This matches the worker's report.
  - The stream.rs total of 155 is consistent with my offsets: the arm +3, the classify block +34, T3 +86, a net 123, which is 139 − 16.
  - The disclosures match the worker's report: the `git fetch --dry-run`, and a commit with its push in one call. On "stale", see N3.

## Check 5: the docs made true (§2 item 4), clause by clause
- **The fetch arm's design note (:1914-1918).** The exception is out-of-range in the accepted shapes, and the arm then ends with the fixed detail, as at prepare and execute. The code is :1939, :2654-2660 and :2642-2650, and the prepare and execute sites also return `Cancelled` first. True.
- **`OUT_OF_RANGE_DETAIL` (:2594-2605).** True, with D3 to apply.
- **`FETCH_PANIC_PREFIX` (:2608-2609).** Line 46 and `Arrow::next` are verified in the package source. True.
- **`PENDING_RESULT_WRAPPER` (:2612-2616).** The bytes are true. Fix the attribution with D2.
- **`fetch_panic_duckdb_text` (:2619-2622).** The order of strips, `None` for a doubled wrapper of either form, and "Nothing is searched for" all match the code at :2623-2629. True.
- **`is_out_of_range` (:2631-2634).** True.
- **`classify` (:2639-2641).** True.
- **`classify_fetch_panic` (:2652-2653).** Apply D4.
- **The campaign sentence (admission_property_campaign.rs:1022-1027).** "does the same for an overflow first raised during a fetch, in the payload shapes the engine accepts" holds by code: the recogniser reads by label regardless of operator. The sentence that follows ("keeps DuckDB's text, in any other shape, is not accepted by this check") matches the function at :1032-1041. True.
- **README :536.** The pointer is added and resolves at the head (stream_fetch_overflow.rs:180). For :533, apply D5.

Files read: C:/dev/spatial-ide/engine/STREAM-FETCH-OVERFLOW-FIXED-DETAIL-PREREGISTRATION.md; C:/dev/spatial-ide/state/directives/2026-10-28-entry-9-open-1-b-both-shapes-anchored-the-claim-split-step-0-on-clang-cl.md; C:/dev/spatial-ide/state/consults/2026-10-28-stream-fetch-overflow-fixed-detail-step0-tester-high-report.md; C:/dev/spatial-ide/state/consults/2026-10-28-stream-fetch-overflow-fixed-detail-build-worker-report.md; C:/dev/spatial-ide-local/evidence/2026-10-28/e9-step0/ (the probe, both stdout files, and proc2-stderr); C:/dev/wt/e9/engine/src/stream.rs; C:/dev/wt/e9/engine/tests/stream_fetch_overflow.rs; C:/dev/wt/e9/engine/tests/admission_property_campaign.rs; C:/dev/wt/e9/engine/README.md; C:/dev/wt/e9/engine/tests/admitted_integer_overflow.rs; on main, the matching ranges of stream.rs, the campaign file and the README; docs/adr/ADR-010:82, ADR-021:265 and ADR-018.
