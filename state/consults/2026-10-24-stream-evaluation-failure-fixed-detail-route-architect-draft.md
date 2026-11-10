*Custodian's filing note (2026-10-24): the architect's read-only draft of the two routes open to filler 2 (draft PR #255) after its gate 1, for the human's choice: route A covers the fetch site (over section 21c by the architect's estimate, so it leaves the filler slot), route B narrows the claim to the prepare and execute sites with a node for the fetch case; O1 drafted as a proposed node; the architect recommends B. The brief named AUTONOMY.md section 36, which is PR #254's text and not yet on main; the architect read the human's rule at its directive instead and says so. #241 is open. The run 18:31:19Z to 18:39:47Z by its transcript (Read 33, Grep 19; no write tool). Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 91c0cc0ad1ba9b4e9dfca60209761d57c3116a6db6afa53fb5ed116e507d828e.*

---

Drafted: stream-evaluation-failure-fixed-detail, the route after gate 1, architect

Read at: main @ c8a24a95 (the main checkout); branch cut/stream-evaluation-failure-fixed-detail @ 27924bbe2fe7cd2655db3406227153b55dccd671 (C:/dev/wt/sefd, read only). This is a draft with no verdict. I changed no file. I have no shell, so this report carries no sha256. The words below are mine unless they are marked as byte-copied.

## Route A: the piece covers the fetch site

**§21c first: Route A crosses it.**
- The current diff is 134 of 150 lines in 3 files (state/consults/gates/2026-10-24-stream-evaluation-failure-fixed-detail-gate1-reviewer.md:59 @ c8a24a95). That leaves 16 lines of headroom. The E1 test function alone, with its drain loop, five assertions and RECORDED MUTATION doc, will not fit in 16 lines.
- My estimate (mine, not measured):
  - engine/src/stream.rs about +50: two constants with docs, the recogniser, the fetch call site, the doc rewrites, T2's new samples.
  - engine/tests/admission_property_campaign.rs about +115 to +135: a local GeoParquet writer (precedent: `write_format_default_covering` in engine/tests/b1_projection_hostile_covering.rs, about 75 lines at 27924bbe), E1 with its doc, and D1's fix.
  - Final figure about 300 to 320 lines in 3 files. The file bound holds, the line bound does not. There is no new dependency: `arrow` and `parquet` are already normal dependencies in engine/Cargo.toml at 27924bbe.
- **Consequence for the slot.** The filler rule requires a piece that "fits a five-line form under §21c's size" (state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md:8 @ c8a24a95, sub-line span). So Route A leaves the filler slot and needs the human's placement in slot 1 or 2.
- **The form it needs.** It keeps its five-line form, because a full preregistration is never written after the code (AUTONOMY.md:345 @ c8a24a95; round 5, item 2). The overrun is recorded as class 6, with the declared 150, the final figure and the reason, and the Scope line is not edited (docs/PREREGISTRATION-TEMPLATE.md:125-131 @ c8a24a95). Both gates are already open from dispatch, so full gating is met.
- **The amendment's classes.**
  - Its first line says it was written after results were seen (the form's line 3 rule).
  - E1 and its mutation are class 4, added after a gate finding (docs/PREREGISTRATION-TEMPLATE.md:115-118 @ c8a24a95).
  - The recogniser item has no clean class (see the last section).

**How the payload is recognised.** This rests on reading the crate's code. The crate is duckdb 1.10505.0.
- `Arrow::next` in src/arrow_batch.rs panics on any `step()` error. Byte-copied: `Err(err) => panic!("Failed to fetch Arrow record batch: {err}"),`.
- `{err}` is `duckdb::Error`'s Display. For `DuckDBFailure(_, Some(s))` it writes `s` alone (src/error.rs, `impl fmt::Display for Error`).
- Where the label sits: after the crate's fixed prefix `Failed to fetch Arrow record batch: `.
  - In the one observed run, which was outside the engine, DuckDB's own text came next: `Invalid Input Error: Attempting to execute an unsuccessful or closed pending query result`. Then, on the next line, `Error: Out of Range Error: …` (gate1-reviewer.md:16 @ c8a24a95).
  - The exact separator bytes are in no record. The reviewer's report describes them as "its next line".
- The recogniser (mine), anchored, with no contains-match:
  1. Strip the crate's exact prefix.
  2. Then accept either the label at the start (`is_out_of_range`, unchanged), or DuckDB's exact pending-result line, then its exact separator, then the label at the start.
  3. Anything else keeps `{phase}: {message}`. `Cancelled` still comes first.
- **Step 0, before any recogniser code.** The worker runs E1's fixture through the engine with the head's code, and records the payload's bytes in escaped form in the amendment. The wrapper constant and T2's samples are byte-copied from that record and from the crate's source, never written from the reviewer's prose (the seam rule: write against the interface the other side actually has).
- **What else that wrapping can carry** (from the crate's code):
  - DuckDB's result error of any class, through `check_result_error`: an interrupt, an I/O failure in a later row group, the pending-result wrapper around any original error.
  - DuckDB's error-data message from `chunk_to_arrow`.
  - The crate's own `Could not import DuckDB Arrow array: …` (`arrow_conversion_failure`).
  - Any other panic inside `next()` arrives with text that is not the crate's.
  - Only the anchored out-of-range forms change. Everything else keeps its text, so the diagnostics note "Keep what the panic actually said." stands for every other class.
- **Rejected:** calling `Statement::step()` directly instead of `catch_unwind(arrow.next())`. It would change how an interrupted fetch surfaces, which is ADR-018's cancellation path and a §21a guarantee category (AUTONOMY.md:325-327 @ c8a24a95).
- **Note B's stop rule.** It reads "The fix is then a class 3 amendment, never a looser match." (engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md:41 @ c8a24a95). The Change line keys on "DuckDB's message begins with its out-of-range class label" (same file, :8). At the fetch site DuckDB's message begins with `Invalid Input Error`. Accepting the label after DuckDB's wrapper widens the accepted text forms but not the class. Whether that counts as a "looser match" is the form's own rule, and the human decides it by choosing A.

**The fetch-site test E1** (name, mine): `an_admitted_integer_overflow_first_raised_during_a_fetch_ends_the_stream_with_the_fixed_detail`, in engine/tests/admission_property_campaign.rs.
- **Fixture.** A local writer in the test file, written with arrow-rs. engine/src/fixture.rs is not edited: the form records #241's edit of it (form :130 @ c8a24a95), and I did not check whether #241 is still open. The file mirrors the reviewer's only fetch-reaching observation: 4,000,000 rows of `id`, a point `geometry` and a BIGINT `v`.
  - `v` is small on every row except the last 1,000.
  - On those rows, `v` is near 3.6e18 (3,600,000,000,000,000,000 + i). Operands of that size were observed to raise (gate1-reviewer.md:16, :32 @ c8a24a95). Operands near 4e9 were observed to wrap, so they are not used (O1).
- **Predicate:** `v * v > 0`, over the whole extent.
- **Path:** `Dataset::stream_with_cancel`, the entry the kernel calls with no projection (kernel/src/lib.rs:271-281 @ c8a24a95).
- **Asserts:**
  - (1) admitted;
  - (2) at least one batch delivered before the terminal, which proves the failure came after `stream_arrow` returned, that is, at the fetch site;
  - (3) the stream ends in error;
  - (4) the text equals `OVERFLOW_TERMINAL` byte for byte;
  - (5) no operand digits and no `read_parquet(`.
- **Stop rules:**
  - (i) no batch before the terminal on this machine: stop, because the fixture does not reach the fetch site;
  - (ii) the stream completes: stop, it wrapped (O1);
  - (iii) the payload's shape differs from the reviewer's account: stop.
- **M3:** the fetch arm passes the raw payload to `classify` (the head's behaviour). E1 fails by name at (4), with the crate's prefixed text.
- **M4:** the wrapper branch accepts any inner text. T2 fails at a new negative sample: the observed wrapper with a non-range inner error.
- **Cost:** the run time and disk use of a 4,000,000-row fixture are unmeasured. The record states no figure until one is measured.
- **Wording:** gate 1's W1 and D1 still apply. Under A, W1's words change to name both sites as covered.

## Route B: the claim narrows

- **The piece.** Its code is unchanged at 27924bbe. Its claim covers the prepare and execute sites. A class 5 amendment records the narrowing on the human's choice, cited by round and item (docs/PREREGISTRATION-TEMPLATE.md:119-124 @ c8a24a95). The Change line is lead-data's wording and is not edited. The closing amendment carries one reference item, for example: Change line, carries no file value and no SQL: at prepare and execute, proven by T1 and B-T1; the fetch site is node `stream-fetch-overflow-fixed-detail`'s.
- **Replacement words** (mine; none is the human's wording; worker doc comments under §31). Each is checked against the code at 27924bbe.

1. **The doc above `OUT_OF_RANGE_DETAIL`** (engine/src/stream.rs):
> The whole terminal detail when a stream that was not cancelled fails with DuckDB's text beginning with its out-of-range class label (`is_out_of_range`), as the prepare and execute sites pass DuckDB's text; on the product path the known source is an admitted predicate's integer `+`, `-`, `*` or unary `-` overflowing. DuckDB's own message for this class names operands read from the file, so at those sites it is withheld. Proven at the execute site by `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail` and B-T1; no test starts from the prepare site. Not at the fetch site: there the `duckdb` crate's fetch panic (1.10505.0, `Arrow::next` in src/arrow_batch.rs) puts its own words before DuckDB's, so the label is not at the start and an overflow first raised during a fetch keeps DuckDB's text, operands included; node `stream-fetch-overflow-fixed-detail` holds that case. `[P6 placeholder]`: the words are the engine's own facts, with no consequence sentence; the human's wording is owed at P6.

   Clause check:
   - "not cancelled": `classify` returns `Cancelled` first.
   - "beginning with … label": `is_out_of_range` uses `starts_with`.
   - "prepare and execute sites pass DuckDB's text": the `prepare` map_err and the `Guarded::Err` arm pass `&e.to_string()`.
   - "known source": gate 1's architect check of predicate.rs (gate1-architect.md:32 @ c8a24a95).
   - "names operands": the M1 text at gate1-reviewer.md:76 @ c8a24a95.
   - "Proven at the execute site": that M1 text begins `query: execute:`. For B-T1, see gate1-reviewer.md:29.
   - "no test starts from the prepare site": T2's `prepare` sample is a non-range unit input.
   - "own words before DuckDB's": the crate's panic line quoted under Route A.
   - "keeps DuckDB's text, operands included": the fetch arm passes the payload, and `classify`'s else arm renders `{phase}: {message}`. The probe's payload is at gate1-reviewer.md:16. The probe ran outside the engine; the step to the engine's detail is the reviewer's reading (gate1-reviewer.md:22).

2. **The doc above `is_out_of_range`:**
> DuckDB's out-of-range class, read from `message` (without the engine's phase prefix: DuckDB's own text at the prepare and execute sites; at the fetch site the `duckdb` crate's panic payload, whose own words come first, so the crate's payload does not match) by its label at the very start and nowhere else, so a file value that happens to carry the words is not misread.

   Clause check: the three call sites as above; the crate's prefix; `starts_with`; T2's mid-message and leading-space samples are asserted false.

3. **The doc above `classify`.** Its last clause becomes:
> every other failure keeps `phase` and `message` as passed (DuckDB's text at prepare and execute, the crate's panic payload at the fetch site).

   Clause check: the third call site passes `&detail`, the downcast payload.

4. **D1** (engine/tests/admission_property_campaign.rs, the doc of `is_declared_integer_arithmetic_overflow`): gate 1's words stand as written (gate1-architect.md:57-58 @ c8a24a95). The key is unchanged at 27924bbe.

**Form and PLAN fixes.** These are Documentation findings, must-fix before the merge. The node's title still says "carrying no file values and no SQL" without bound (PLAN.yaml:3374 @ c8a24a95). That is the custodian's PLAN text: narrow it, or let the summary name the fetch node.

**The new node.**
- id: `stream-fetch-overflow-fixed-detail`
- lane: engine
- depends_on: [stream-evaluation-failure-fixed-detail]
- status: proposed

Summary:
> PROPOSED 2026-10-24 by stream-evaluation-failure-fixed-detail's gate 1 (state/consults/gates/2026-10-24-stream-evaluation-failure-fixed-detail-gate1-reviewer.md, C1 and E1), for the human's placement: at the fetch site the duckdb crate (1.10505.0, Arrow::next in src/arrow_batch.rs) panics with its own words before DuckDB's text, and in the one observed run DuckDB's text there began with its pending-result wrapper before the out-of-range error, so an admitted predicate's integer overflow first raised during a fetch keeps DuckDB's text, row values included. The piece: record the payload's bytes through the engine first; recognise it by its fixed prefixes, anchored, never a contains-match; a test from the real shape through Dataset::stream_with_cancel on a fixture whose overflowing rows follow the first delivered batches, with operands observed to raise rather than wrap, asserting a batch before the terminal and the terminal text exactly the fixed detail; a mutation restoring the raw payload. Over section 21c's line bound by the architect's estimate, so not a filler. Not graded.

**Does the narrowed piece still remove a leak at a site a user reaches? Yes, at execute.**
- T1 runs through `Dataset::stream_with_cancel` (`completed_ids` in the campaign file at 27924bbe). Under M1 its terminal carried operands from the file, `query: execute: Out of Range Error: … (-3602189387807864356 * -3602189387807864356)!`. At the head it carries S1 (gate1-reviewer.md:76 @ c8a24a95).
- The kernel calls `stream_with_cancel` or `stream_projected_with_cancel` (kernel/src/lib.rs:277-280 @ c8a24a95). Both call `stream_inner` (stream.rs at 27924bbe), whose one product call of `produce` is the path `classify` sits on.
- The reviewer's controls ran outside the engine: a 2,048-row file, and a file whose overflow starts at row 2,000,000 of 4,000,000. Both failed at `stream_arrow` and matched (gate1-reviewer.md:18 @ c8a24a95). So for small files, and for an overflow early enough in a large one, a user's filtered stream ends with S1.
- No shell-level run has observed the banner. That chain is the form's note A reading.

## O1

- **Node:**
  - id: `admitted-integer-overflow-silent-wraparound`
  - lane: engine
  - status: proposed
  - needs_human: ruling

  Summary:
> PROPOSED 2026-10-24 by stream-evaluation-failure-fixed-detail's gate 1 (state/consults/gates/2026-10-24-stream-evaluation-failure-fixed-detail-gate1-reviewer.md, O1), for the human's routing: on the locked duckdb crate, outside the engine, a BIGINT v * v with v near 4e9 returned rows with no error where the product overflows: v * v < 0 returned the 1,024 rows of that magnitude, and on a 2,048-row file whose last row overflows, v * v > 0 returned 0 rows instead of 2,046; operands near 3.6e18 raised instead. The mechanism is not determined, and it has not been run through the engine. It is the same typed class FILTER-BIND section 2.5(d) routes to stream-evaluation-failure-fixed-detail, whose direction (B-1 point 4) assumes the overflow ends the stream in error. First: reproduce through Dataset::stream_with_cancel and determine the mechanism; then the human's decision. Not graded.

- **No engine-path observation of O1 is on record** (my reading). In the worker's stop report, `i64 + 9223372036854775807 > 0` completed with 800 ids on the 800-row fixture (state/consults/2026-10-24-stream-evaluation-failure-fixed-detail-worker-stop-report.md:15 @ c8a24a95; `FIXTURE_FEATURES` = 800 at 27924bbe). A wraparound would have dropped the rows with positive `i64`, so that predicate did not wrap. The stop report's other completions do not settle it either way.
- **No property under test would see it.** The campaign's count oracle is DuckDB itself: "the same composition evaluated by an independent connection" (engine/tests/admission_property_campaign.rs:942 @ c8a24a95, sub-line span).
- **Which clause it meets** (no ruling):
  - No accepted ADR decides it. ADR-021's Note leaves it open: "An integer overflow in `+`, `-`, `*` or unary `-` involves no conversion and is not decided here." (docs/adr/ADR-021-row-filter-on-viewport-query.md:265 @ c8a24a95, sub-line span).
  - It meets the premise of the human's direction, B-1 point 4: "an evaluation failure ends the stream with a fixed, engine-authored detail…" (state/directives/2026-09-29-a2-1-and-b-1-sightings.md:70 @ c8a24a95, sub-line span).
  - It meets the premise of O-6's identification, "by the typed class and an `Overflow` terminal text together" (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:12 @ c8a24a95, sub-line span). A wrapped overflow has no terminal text at all.
  - Principle by reading: docs/01 principle 8, "No black boxes." (docs/01_Principles.md:14 @ c8a24a95), the principle docs/01 names for silent errors (:21).
  - It does not meet ADR-010 rule 7 by its letter. The stream ends normally; it does not "terminate silently" (docs/adr/ADR-010-render-frames-origins-boundaries.md:82 @ c8a24a95).
- **Decision skeleton** (for the human, if it is wanted):
  - Context: ADR-021 Note 2026-09-30, item 4 leaves overflow undecided, and the O1 observation.
  - Decision: open. The options are refusing at admission, a checked evaluation, or a recorded limitation.
  - Consequences: the first changes what admission admits, so it is an ADR-021 Note and a red line.

## Red lines and strings

- **Route A:**
  - No wire change: the terminal code stays `engine.query`, and only the detail text changes for this class.
  - No security change.
  - No ADR text.
  - The cancellation path is unchanged, with `Cancelled` first.
  - The open decision is whether the second anchored form breaks note B's "never a looser match". It is the human's in choosing A; it is not red-line text.
- **Route B:** no red-line text. The narrowing delivers part of the human's B-1 point 4 direction and defers the fetch case. Accepting that is the human's choice of B.
- **O1:** routing only. Any resolution that changes admission is an ADR-021 Note and a red line (AUTONOMY.md:319-321 @ c8a24a95).
- **Strings a user sees:** S1 only, unchanged in both routes, a P6 placeholder for the sitting. Byte-copied from the form, line 63: `[P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld`. Neither route adds a string. Under B, the fetch case shows DuckDB's own text, as it did before this piece: that is not a regression, and it is not an engine-authored string.

## Recommendation (mine): Route B

1. Route A crosses §21c by about double, so it leaves the filler slot. It would take a slot 1 or 2 place for a piece graded S2 that Fable's grading note calls hygiene (form :96 @ c8a24a95).
2. Route A's recogniser and fixture rest on one DuckDB wrapper text, observed once, outside the engine, at one row count on one machine. Whether the fixture reaches the fetch site depends on how far DuckDB runs ahead before `stream_arrow` returns. That design needs its own form with an observation step first, not an amendment made in a filler after gate 1.
3. The narrowed piece removes a leak users reach, proven through the product entry point. It needs no code change, and the fetch case keeps a named home.
4. Under B, the strict direction holds: the campaign's leak assertion has no exclusion, so any test that reaches a fetch-site leak fails rather than hides it.

## What I could not settle

- **Re-gate under B.** C1 and E1 were the reviewer's Correctness and Evidence findings, not §31 wording blocks with the gate's own words. My reading is that the reviewer re-gates the narrowed head, and the architect checks the amendment. The custodian rules.
- **Route A's recogniser class.** Note B names class 3, but class 3 "Never changes a claim" (docs/PREREGISTRATION-TEMPLATE.md:112 @ c8a24a95, sub-line span). The custodian picks the class.
- **§36 is not on main.** The brief cites AUTONOMY.md §36, but AUTONOMY.md at c8a24a95 ends at §35. The rule lives only at the directive's line 8, and state/FILLER-QUEUE.md:3 @ c8a24a95 says it is "to be appended".
- **KNOWN-LIMITATIONS.** Under B, whether the remaining fetch-site case also needs a KNOWN-LIMITATIONS item. The form's Scope excludes that file. That is the human's call.
- **Unmeasured:** E1's run time and disk cost, and the exact separator bytes of the pending-result wrapper.
- **Unchecked:** whether #241 is still open.
