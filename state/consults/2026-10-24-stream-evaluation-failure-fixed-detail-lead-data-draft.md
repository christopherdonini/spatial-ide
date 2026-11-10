*Custodian's filing note (2026-10-24): lead-data's draft of the five-line form for `stream-evaluation-failure-fixed-detail`, the filler queue's entry 2 (state/FILLER-QUEUE.md), read only at main ae8cfdcc. The run 14:18:32Z to 14:28:39Z by its transcript (Grep 43, Read 36, Glob 4; no write and no shell). Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 5dbff0402207dfe4f75a530fca770085b59c6aa201a868b70557187646c1400d.*

---

Drafted: stream-evaluation-failure-fixed-detail, at main ae8cfdcc

Result: the piece fits a five-line form. It has 3 files, all under engine/, with about 135 changed lines estimated against a declared budget of 150. Nothing under kernel/, protocol/, frontends/ or KNOWN-LIMITATIONS.md changes, and it is disjoint from every in-flight path by rule (00).
Blocking question 1 (OPEN-1): the class's exclusion sits at three test sites, keyed on DuckDB's `Overflow` text. Once this lands they cannot simply be removed, because an overflow still ends the stream. I recommend replacing each with an assertion that this class ends with exactly the fixed detail. This is a reading of B-1's O-6 and of the 2026-09-29 sightings, point 4.
Blocking question 2 (OPEN-3): this class's banner text changes. Does that sit within §21c's fourth bound ("no new user-visible behaviour"), as the filler rule's P6 clause implies?
Report path: C:/dev/spatial-ide/state/consults/2026-10-24-stream-evaluation-failure-fixed-detail-lead-data-draft.md
sha256: none. I have no shell, so no hash appears anywhere in this report. Every cite is `path:line @ ae8cfdcc`, read in the main checkout, and the custodian expands the pins by script.

---

## The five lines

```
Authority: PLAN node `stream-evaluation-failure-fixed-detail` (PLAN.yaml:3373-3389 @ ae8cfdcc), the filler queue's entry 2, graded S2, its strings P6 placeholders for the sitting (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:10 @ ae8cfdcc and :17 @ ae8cfdcc); the standing filler rule, a five-line form under §21c's size with the reviewer and the architect gating from dispatch and round 25, item 2 (e) set aside (state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md:8 @ ae8cfdcc); the direction is the human's B-1 point 4 (state/directives/2026-09-29-a2-1-and-b-1-sightings.md:67-75 @ ae8cfdcc), and the class is FILTER-BIND §2.5(d) (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97 @ ae8cfdcc) as O-6 rules it (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:12 @ ae8cfdcc); the reuse index found no prior art on any of three searches (evaluation failure detail; integer overflow error message; error detail sql leak), a miss noted here.
Scope: 3 files, engine/src/stream.rs, engine/tests/admission_property_campaign.rs, engine/tests/filter_type_admission.rs; declared line budget 150 (insertions plus deletions, AUTONOMY.md:357 @ ae8cfdcc), about 135 estimated (section C); this form exempt; no new dependency, no new `pub` item, no new `EngineError` variant, and no file under kernel/, protocol/, frontends/, or KNOWN-LIMITATIONS.md.
Change: when a stream's DuckDB failure is not a cancellation and DuckDB's message begins with its out-of-range class label, `classify` (engine/src/stream.rs:2591-2597 @ ae8cfdcc) returns `EngineError::Query` carrying one fixed, engine-authored `[P6 placeholder]` detail instead of DuckDB's message, so the terminal detail for an admitted predicate's same-type integer overflow carries no file value and no SQL; every other DuckDB failure keeps its own text, and the three test sites that excluded this class by DuckDB's `Overflow` text instead assert that the class ends with exactly that fixed detail (OPEN-1).
Tests+mutation: T1 an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail (new, engine/tests/admission_property_campaign.rs), M1: `classify`'s out-of-range arm deleted, so DuckDB's message passes as before; T1 fails by name at its equality assertion; T2 only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure (new, engine/src/stream.rs mod tests), M2: the out-of-range check returns true for every message, so T2 fails by name on its non-range samples; changed, each failing under M1: filter_admission_property_campaign (stream-error half), a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit (P5's call site), the_type_walk_agrees_with_the_binder_over_the_p0_matrix (B-T1 (iii)); each mutation observed by applying it, running the named tests, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment, and ADR-021's Note leaves integer overflow undecided (docs/adr/ADR-021-row-filter-on-viewport-query.md:265 @ ae8cfdcc); security: nothing ADR-020, ADR-009 or ADR-021 governs, with no admission rule, refusal code or extension load changed; wire: no SKP or data-plane message, literal, field or code, the terminal code stays `engine.query`, SKP-V0 §5's message rule is unchanged (protocol/skp/SKP-V0.md:343-344 @ ae8cfdcc), and nothing under protocol/ changes; guarantee: touched by §21a's letter only as properties currently under test, and only strengthened: the three sites that accepted any `Overflow` text for the §2.5(d) class accept exactly the fixed detail for that class alone, the leak assertion is unchanged, `classify` still returns `Cancelled` first (no ADR-018 change), and no ceiling, docs/08 claim or undo class changes; the five-line form with both gates from dispatch stands by the human's filler rule, which sets round 25, item 2 (e) aside.
```

*Notes A to G below are mine (lead-data) and are this form's reading. Where a note puts a question to the custodian or the human, the OPEN section after them carries it.*

## A. The engine path, and where a user sees the detail

- **Where the detail is made.** The producer `produce` turns a DuckDB failure into a terminal error through `classify` at three sites: prepare (engine/src/stream.rs:1799-1801 @ ae8cfdcc), execute (engine/src/stream.rs:1848-1857 @ ae8cfdcc) and the fetch panic (engine/src/stream.rs:1913-1937 @ ae8cfdcc). `classify` returns `Cancelled` if the token is cancelled, and otherwise `EngineError::Query(detail)` (engine/src/stream.rs:2591-2597 @ ae8cfdcc), where `detail` is the engine's phase prefix plus DuckDB's text. The terminal passes through unchanged after the post-check (engine/src/stream.rs:1366-1375 @ ae8cfdcc). `Display` is `query: {d}` (engine/src/error.rs:350 @ ae8cfdcc).
- **What DuckDB's text carries for this class.** It names the operands, which are values from the rows in view. The P0 matrix had 91 leaking cases and 8 without a value (state/drafts/b1-p0/B1-P0-AND-PROPOSAL.md:80-82 @ ae8cfdcc and :89-92 @ ae8cfdcc). W2-B records a slice of the composed SQL in `engine.query` details (state/cloud/wave2/W2-B.md:88 @ ae8cfdcc). The observed shape is `Out of Range Error: Overflow in multiplication of INT64`, byte-copied from evidence, a gate report's account of a run (state/consults/gates/2026-09-28-wave2-b-admission-campaign-merge-gate1-reviewer.md:75 @ ae8cfdcc).
- **The kernel.** It prefixes the code: `terminal_detail_of` builds `"<code>: <display>"` (kernel/src/skp.rs:2050-2052 @ ae8cfdcc), and `Query` maps to `query` (kernel/src/skp.rs:2127 @ ae8cfdcc). The kernel hands that string to the data plane mid-stream (kernel/src/lib.rs:700-704 @ ae8cfdcc), which closes the stream as `ProducerFailed` (protocol/data-plane/src/adapter_ws.rs:211 @ ae8cfdcc, :310 @ ae8cfdcc). No kernel line changes, because the variant and its `Display` shape are unchanged.
- **The shell.** The operator reads the canvas banner `stream ProducerFailed: <message>`, where `message` is the detail with its `engine.` code stripped (frontends/shell/src/App.tsx:1719 @ ae8cfdcc; frontends/shell/src/streaming/formatTerminalRefusal.ts:33-45 @ ae8cfdcc). The session log records the whole detail (frontends/shell/src/App.tsx:1714 @ ae8cfdcc). No shell line changes.
- **Publish.** Publish is not reached: a filtered publish is refused before any stream (kernel/src/publish/mod.rs:461-463 @ ae8cfdcc).
- **No new seam.** The engine-to-kernel seam is the same variant and the same `Display` format, so the cross-module rule has nothing new to prove.

## B. The class (settles item 1)

- **In scope.** A stream's DuckDB failure whose DuckDB message begins with DuckDB's out-of-range class label, when the stream was not cancelled. On the product path that is the §2.5(d) class: integer `+`, `-`, `*` and unary `-` overflowing. The only computed expressions in the composed SQL are the caller's admitted predicate and the DOUBLE bbox comparisons (engine/src/stream.rs:1440-1465 @ ae8cfdcc), so I know of no other product source of this class.
- **Detection (my settlement; the gates check it).** The check matches DuckDB's class label at the start of DuckDB's message, after the engine's phase prefix. It never matches anywhere else in the text, so a file value that happens to contain the words is not misread.
  - This repository has observed the label only in the gate report's account above.
  - The fetch site's panic payload format is unobserved here.
  - **Stop rule:** if the worker's first B-T1 run shows any overflow case ending in DuckDB's own text, the worker stops and reports. The fix is then a class 3 amendment, never a looser match.
- **Out of scope by default: W2-B observation 2**, that every other `engine.query` terminal detail repeats composed SQL (state/cloud/wave2/W2-B.md:123 @ ae8cfdcc). This change does not cover it within the size, because covering it means withholding DuckDB's text for every stream failure, I/O included. That contradicts the fetch site's own design note, "Keep what the panic actually said." (engine/src/stream.rs:1914 @ ae8cfdcc), and loses diagnostics. That is a contract question, so it goes to OPEN-2 with its own node proposed. T2 holds the boundary: M2, which masks every message, fails it.

## C. The size (settles item 2)

Estimated insertions plus deletions, by §21c's counting rule (AUTONOMY.md:357 @ ae8cfdcc):

| File | What changes | Lines |
|---|---|---|
| engine/src/stream.rs | the fixed detail as a private const with its doc; the private out-of-range check; `classify`'s arm and doc; T2 | about 40 |
| engine/tests/admission_property_campaign.rs | header doc (:33-39 @ ae8cfdcc); `is_declared_integer_arithmetic_overflow` (:1016-1032 @ ae8cfdcc) replaced by a function asserting the fixed detail for the same typed class; its two call sites (:1162 @ ae8cfdcc, :1379 @ ae8cfdcc); the expected text once; T1, reusing `completed_ids` (:1312-1344 @ ae8cfdcc) and `file_tokens` (:973-992 @ ae8cfdcc) | about 72 |
| engine/tests/filter_type_admission.rs | `is_declared_overflow` and its doc (:991-1001 @ ae8cfdcc) re-keyed the same way; call site (:1338 @ ae8cfdcc) | about 24 |

- **Total:** about 135 of a declared 150, in 3 files of 8. This fits, but the margin is thin. If the count crosses 150, it is a class 6 amendment, and the Scope line is never edited.
- **§21c's other bounds:** no new dependency and no new exposure surface. The user-visible bound is OPEN-3.
- **Not on the brief's reading list.** I found engine/tests/filter_type_admission.rs by search. Its B-T1 (iii) excludes this class by `Overflow` text (:999-1001 @ ae8cfdcc), so it fails the moment the text is fixed. It has to be in Scope.

## D. The strings (settles item 3)

One string a user can see changes.

- **S1, the fixed detail.** It is the payload of `EngineError::Query`, in the precedent's form (engine/src/error.rs:422-431 @ ae8cfdcc), with the `[P6 placeholder] ` prefix that SOURCE-WATCHER §7 declares (engine/SOURCE-WATCHER-PREREGISTRATION.md:402 @ ae8cfdcc). Draft words, mine, not the human's, stating engine facts only and no consequence:
  `[P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld`
- **Where the operator meets it:**
  - the canvas banner: `stream ProducerFailed: query: [P6 placeholder] …`;
  - the session log: `engine.query: query: [P6 placeholder] …`.
  - The doubled "query" comes from the unchanged `Display` (engine/src/error.rs:350 @ ae8cfdcc). I note it for the sitting and do not change it, because changing it would change every `engine.query` message.
- S1 joins the sitting's sight list as a P6 placeholder, on the custodian's record. There is no red-line text.

## E. Tests and mutations (settles item 4)

- **A correction to the brief.** At ae8cfdcc the campaign's leak assertion carries no exclusion. Its own comment says a leak is always a counterexample (engine/tests/admission_property_campaign.rs:1150-1158 @ ae8cfdcc). The class is excluded at three other sites:
  - the campaign's "ends in error" half (:1160-1167 @ ae8cfdcc);
  - P5's call site (:1376-1386 @ ae8cfdcc), which CLAUSE-COMPOSITION item 13 assigns to this node's form (engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md:40 @ ae8cfdcc);
  - B-T1 (iii) (engine/tests/filter_type_admission.rs:1334-1345 @ ae8cfdcc).
- **What changes at those sites.** Each loses its DuckDB-text test. Each then accepts a stream error only when the predicate is of the same typed class as today *and* the terminal text equals exactly `query: ` + S1. Every other stream error still fails. The leak assertion now meets this class's fixed text with no exclusion, so the campaign asserts this class.
- **T1.** On the campaign fixture, `i64` spans the 64-bit range (engine/src/fixture.rs:404-408 @ ae8cfdcc).
  - Predicate: `i64 * 9223372036854775807 > 0`, over the whole extent. It overflows on any row with |i64| ≥ 2.
  - Asserts: the predicate is admitted, so a refusal fails loudly rather than passing vacuously; the stream ends in error; the error equals `query: ` + S1 byte for byte; and it contains no `file_tokens()` entry and no `read_parquet(`.
  - If admission refuses this predicate at the worker's run, the worker stops and reports (class 3).
  - Under M1, T1 fails at the equality assertion.
- **T2.** A unit test of the private check.
  - Input shaped like the gate report's out-of-range message → true.
  - An I/O, a conversion and a binder message → false.
  - Its literals are unit inputs only. The real shape is proven by T1 and B-T1.
  - Under M2, T2 fails on the first false sample.
- **What fails under M1 among the changed tests:**
  - B-T1, on its overflow cases. Its part 1 is the P0 matrix's 7,620 cases (state/drafts/b1-p0/B1-P0-AND-PROPOSAL.md:88 @ ae8cfdcc). The count is recorded at the run, not predicted.
  - P5, on its excluded cases: 4 of 201 at that piece's closing (engine/CLAUSE-COMPOSITION-PROPERTIES-PREREGISTRATION.md:145 @ ae8cfdcc).
  - The campaign, if its seeds reach an overflow. The 2026-09-28 gate report saw three. This is observed, not assumed.
- **Kernel tests.** None change. kernel/tests/typed_terminal_codes.rs needs no edit: its prefix test builds four variants and none is `Query` (:380-398 @ ae8cfdcc), and no variant is added. A search for `Overflow` and `engine.query` under kernel/ finds no test asserting this text. #241's edit of that file is untouched.

## F. Out-of-scope readings (settles item 5)

- **ADR.** None is amended. ADR-021's Note leaves integer overflow undecided (docs/adr/ADR-021-row-filter-on-viewport-query.md:265 @ ae8cfdcc). ADR-010's surfaced-error rule (docs/adr/ADR-010-render-frames-origins-boundaries.md:82 @ ae8cfdcc) still holds, because the stream still ends with a typed terminal that names the class.
- **Security.** Fable's grading note calls this hygiene, not confidentiality (state/directives/2026-09-29-a2-1-and-b-1-sightings.md:74-75 @ ae8cfdcc). No admission rule, refusal code or extension load changes.
- **Wire.**
  - There is no terminal-code change and no SKP or data-plane field change.
  - The `detail` string's text changes for this class only, inside the existing free-text field, under SKP-V0 §5's unchanged rule that `message` is `Display` verbatim.
  - Nothing under `protocol/` changes, so the at-most-one-protocol rule is untouched.
  - A distinct code would be a wire change; see OPEN-4.
- **Guarantee.**
  - The properties under test are strengthened only, as the line says.
  - No record is edited. FILTER-BIND §1's "may not claim" list (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:53 @ ae8cfdcc) is immutable, and this form is where the claim now lives.
- **Owner's index.** No pointer changes, so no index update follows. That matters because engine/README.md is in #241's paths and in covering-case's.

## G. Rule (00), path by path (settles item 6)

- **engine/src/stream.rs.** It is in no listed branch. Port-2 touches engine/src/{app_dirs,lib,lod}.rs, covering-case touches engine/src/dataset.rs, and #241 touches engine/src/fixture.rs. Disjoint.
- **engine/tests/admission_property_campaign.rs.** In no listed branch. Disjoint. It calls `spatial_engine::fixture`, which #241 edits; that is a contact, not an overlap (OPEN-5).
- **engine/tests/filter_type_admission.rs.** In no listed branch. Disjoint. It has the same fixture contact.
- **Not touched by this piece:**
  - KNOWN-LIMITATIONS.md, including items 9, 47, 51 to 56 and port-2's;
  - engine/README.md;
  - every kernel/ file, including kernel/tests/typed_terminal_codes.rs and kernel/src/lib.rs;
  - frontends/shell/ and its MANUAL-WALKTHROUGH.md;
  - protocol/;
  - AUTONOMY.md;
  - scripts/;
  - .github/;
  - any e2e README suite entry.
- **Entry 1** (`kernel/src/permission/audit/log.rs`) is not touched.

## OPEN items

- **OPEN-1 (blocking: it shapes the Change and Tests lines).** Two records read differently once this lands. FILTER-BIND §2.10 (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:131 @ ae8cfdcc) and CLAUSE-COMPOSITION item 13 say the exclusion function "is removed when that node lands". The human's point 4 says the exclusion holds "until it lands". But the node's own direction keeps overflow ending the stream, so pure removal would fail B-T1, P5 and probably the campaign.
  - (A) Recommended. Remove the DuckDB-text identification and replace it, at all three sites, with an asserted ending: the same typed class (O-6's first half) *and* exactly `query: ` + S1. It is no broader than the ruled class.
  - (B) Accept S1 for any admitted predicate. This is broader than O-6.
  - (C) Keep the `Overflow` key. This is impossible, because the text no longer carries it.
  - The custodian decides, or carries it to the human as a reading of their ruling.
- **OPEN-2 (not blocking).** W2-B observation 2, the composed SQL in other `engine.query` terminal details, stays out.
  - A node is proposed; the name is mine: `engine-query-terminal-detail-sql-audit`. It would first audit which stream-terminal paths still carry DuckDB text with SQL after B-1, then decide whether to withhold DuckDB's text more widely.
  - Withholding it more widely trades away diagnostics and the fetch site's design note, so it is a contract question for the custodian, and the human's to decide.
- **OPEN-3 (blocking for filler eligibility).** §21c's fourth bound, "no new user-visible behaviour" (AUTONOMY.md:350-351 @ ae8cfdcc), set against a changed banner text for this class.
  - My reading: the behaviour is unchanged (the stream still ends in a failure banner) and only the text changes. The filler rule's clause that its "strings a user sees are P6 placeholders" anticipates such a string.
  - This is the custodian's call. If the answer is no, the piece is not a filler and the custodian moves to the next entry.
- **OPEN-4 (not blocking).** A distinct code, for example `engine.evaluation_failed`, would let a client act on the class. It needs a new `EngineError` variant, a kernel arm (no wildcard; kernel/src/skp.rs:2057-2059 @ ae8cfdcc) and SKP-V0 §5 text, which is a wire change. Recommended: not here. If wanted, it is its own node.
- **OPEN-5 (not blocking).** #241 edits engine/src/fixture.rs. If its diff changes `AttributeMode::MultiType` or `FilterWitness` values, B-T1's overflow set and P5's excluded count could move. The custodian can confirm from #241's diff of that file, which I cannot read.

## Not settled

- DuckDB's message at the fetch site, and whether the class label begins it inside the panic payload. Section B's stop rule covers this.
- The overflow counts B-T1 and the campaign reach at the worker's run. They are recorded, not predicted.
- Whether `i64 * 9223372036854775807 > 0` is admitted at the current type walk. I believe it is (integer with integer, literal within 20 digits), but I have not observed it. T1's stop rule covers this.
- No sha256 for any cite, because I have no shell. The custodian expands every pin by script.
