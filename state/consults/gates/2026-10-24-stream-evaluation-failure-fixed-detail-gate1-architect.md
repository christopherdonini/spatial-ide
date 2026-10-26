Reviewed: PR #255 at 27924bbe2fe7cd2655db3406227153b55dccd671, gate 1, architect
Branch: cut/stream-evaluation-failure-fixed-detail @ 27924bbe2fe7cd2655db3406227153b55dccd671

Verdict: FAIL

The only blocking finding is wording (AUTONOMY §31, item 2 a and d). The code's Correctness and Evidence are closed for what it does. Every blocked sentence is a worker's doc comment, not the human's wording, so the worker applies the words below with no re-gate and the PR body lists them.

All line cites below are into the branch head 27924bbe in C:/dev/wt/sefd. That tree is authoritative. I had no shell, so no span hashes were computed; the reviewer recomputes any it needs. I did not check the diff's file list with git. It rests on the brief and the worker report, and every file I read inside the diff is one of the three Scope files.

## Findings

### Evidence (blocking: wording only, §31)

**W1. The withholding claim covers a path no run has observed.**
- `classify` gets its message from three call sites:
  - prepare: `e.to_string()` (engine/src/stream.rs:1801)
  - execute: `e.to_string()` (engine/src/stream.rs:1856)
  - fetch panic: the downcast panic payload (engine/src/stream.rs:1916-1920, 1936)
- The fixed detail is proven only where DuckDB's message reached `classify` starting with `Out of Range Error`. That is T1, whose unmasked text under M1 came from `execute:` (the worker report's M1 bullet and T1's RECORDED MUTATION doc, admission_property_campaign.rs:1455-1463), and B-T1.
- Note B, under Detection, says the fetch site's payload format is unobserved. Nothing in the diff observes it, and there is no recorded fetch-panic payload anywhere in the tree.
- If an overflow first shows up in a fetch, and the payload does not begin with the label, it keeps DuckDB's text, operands included. That is the pre-change behaviour, so nothing regresses. But ordinary use can reach it: a large file whose overflowing row lies past the first chunk.
- Two doc comments state the guarantee without that bound:
  - stream.rs:2591-2594 says DuckDB's message for the class "is withheld".
  - stream.rs:2597-2599 calls `message` "DuckDB's own text".
- A looser match is forbidden by note B's stop rule, so the fix is words, not code.

Replacement for engine/src/stream.rs:2591-2594 (doc comment; not the human's wording):
> The whole terminal detail when a stream that was not cancelled fails with a message beginning with DuckDB's out-of-range class label (`is_out_of_range`); on the product path the known source is an admitted predicate's integer `+`, `-`, `*` or unary `-` overflowing. DuckDB's own message for this class names operands read from the file, so it is withheld. Proven by `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail` and B-T1; no run has observed a fetch-panic payload, and one that does not begin with the label keeps its own text. `[P6 placeholder]`: the words are the engine's own facts, with no consequence sentence; the human's wording is owed at P6.

Clause check:
- "not cancelled … beginning with … label": stream.rs:2607-2610, with `starts_with` at 2601.
- "known source": predicate.rs admits only `+ - * /` (predicate.rs:75). `/` divides in a float type (predicate.rs:1908, 1927-1930). Integer-with-integer is rule 3 (predicate.rs:2078-2079). Note B words this as knowledge, not as an exclusive rule.
- "names operands": the M1 text, `(-3602189387807864356 * -3602189387807864356)`, from the worker report.
- "Proven by": T1 at admission_property_campaign.rs:1465-1482; B-T1 via filter_type_admission.rs:1342.
- "keeps its own text": stream.rs:1936 passes the payload, and 2611-2612 renders `{phase}: {message}`.

Replacement for engine/src/stream.rs:2597-2599 (doc comment; not the human's wording):
> DuckDB's out-of-range class, read from `message` (without the engine's phase prefix: DuckDB's own text at the prepare and execute sites, the panic payload at the fetch site, whose shape is unobserved) by its label at the very start and nowhere else, so a file value that happens to carry the words is not misread.

Clause check:
- The sources of `message`: stream.rs:1801, 1856, and 1916-1920 with 1936.
- "start and nowhere else": stream.rs:2601.
- "not misread": T2's sample at stream.rs:2702 is asserted false at 2705.

Form (append-only; lead-data's wording):
- The Change line's "carries no file value and no SQL" is bounded by note B's Detection bullet, second sub-bullet.
- The closing amendment carries that as one reference item, by section and item, under the record cap, for example: "Change line, 'carries no file value and no SQL': proven by T1 and B-T1; at the fetch-panic site, bounded by note B, Detection, second sub-bullet."

Proposed for the human's placement, not this PR: observe the fetch-panic payload with a fixture whose overflow lies past the first chunk. It could fold into the OPEN-2 node, `engine-query-terminal-detail-sql-audit`.

### Documentation (must fix before the merge; no re-gate)

**D1. engine/tests/admission_property_campaign.rs:1024-1026 now describes a narrower class than the code matches.**
- The base text named "and any integer literal". The head drops it.
- The key is unchanged (1031-1035). It matches `i64` or `id` beside ` + `, ` - ` or ` * `, whatever the other operand is.

Replacement (not the human's wording):
> Identified by both of these: the predicate's typed class, integer arithmetic (this fixture's own integer-typed operands, `i64` and `id`, and any integer literal, joined by `+`, `-` or `*`; keyed on `i64` or `id` written beside ` + `, ` - ` or ` * `), and a terminal text equal to `OVERFLOW_TERMINAL`. DuckDB's own text is no longer read.

Clause check:
- The key: 1031-1035.
- The text check: 1028, against the constant at 1018.

### Notes (not findings)

- **Unary minus.** Neither key matches unary `-`, though both docs name it (admission_property_campaign.rs:1021, filter_type_admission.rs:991-992). Both lines predate this piece and are unchanged. The gap is in the strict direction: an overflow it misses fails the test rather than passing.
- **Wording swap at filter_type_admission.rs:994.** The cited W11/B8 claim now says "out-of-range error" where the base said "Overflow" text. It is not marked as a quote, and the claim is the same in substance.
- **A trade-off of withholding.** The three sites can no longer tell an overflow from another out-of-range error on an arithmetic predicate. T2 holds that boundary on the engine side.

## Check 1: the five lines with Amendment 1, against the head

- **Authority:** the filler rule (directive line 8) gives a five-line form, gates from dispatch, and §25 (e) set aside. The form cites it.
- **Scope:** met.
  - 3 files, 134 of 150 lines (worker report: 65/5, 44/6, 9/5).
  - The new items are private: `OUT_OF_RANGE_DETAIL` (stream.rs:2595), `is_out_of_range` (2600), and `classify` (2606).
  - The test constants are file-local (campaign:1018; filter_type_admission:1003).
  - No variant is added (error.rs:350 is unchanged). Per the report, no dependency is added.
- **Change:** met.
  - Cancellation is returned first, then the out-of-range class gives `Query(S1)`; anything else is `{phase}: {message}` (stream.rs:2606-2614). That is byte-identical to the base's `format!("prepare: {e}")` and its siblings (main stream.rs:1801, 1856, 1936).
  - The signature change is private and recorded in Amendment 1, item 3.
  - S1 is byte-equal across stream.rs:2595, campaign:1018 (after `query: `), filter_type_admission:1003 and form line 63, by my reading.
- **Tests+mutation:** met, with the campaign read as Amendment 1, item 2 reads it.
  - T1 is at campaign:1465. Its four assertions are at 1469-1481, with the predicate as Amendment 1, item 1 sets it.
  - T2 is at stream.rs:2694.
  - The RECORDED MUTATION lines name 86612bdd (campaign:1455-1463; stream.rs:2690-2692).
  - The record does not call a `verify-mutation` run an observation.
- **Out-of-scope:** see check 2.

## Check 2: Out-of-scope

- **ADR:** no ADR file is in the diff. ADR-021's Note is untouched. ADR-010's surfaced-error rule holds, because the terminal stays a typed `EngineError::Query`.
- **Security:** no admission rule, refusal code or extension load changes. predicate.rs is not in the diff.
- **Wire:**
  - `Query` still maps to `query` (kernel/src/skp.rs:2127).
  - `terminal_detail_of` is unchanged (skp.rs:2050-2052), and so is `Display` (error.rs:350).
  - The shell's code strip is unchanged (formatTerminalRefusal.ts:40).
  - Nothing under protocol/, kernel/ or frontends/ is in the diff.
- **Guarantee:**
  - The leak assertion is unchanged (campaign:1154-1162).
  - All three sites now require exact S1 plus the same typed class (campaign:1027-1036, used at 1166 and 1383; filter_type_admission:1002-1005, used at 1342). That is narrower than "contains Overflow", so the guarantee is strengthened.
  - Cancellation still comes first.
  - No docs/08 claim is touched: `classify` runs only at the terminal, not on the hot path.

## Check 3: the class boundary

- **Detection:** `starts_with("Out of Range Error")` on DuckDB's message without the phase prefix (stream.rs:2601). Note B's detection claim holds at the head:
  - The message carries no prefix at any call site.
  - The label embedded mid-message (2702) or after a leading space (2703) is not matched (2705).
- **Product sources:**
  - Admitted arithmetic is integer, float, or NULL `+ - *`, and float `/` (predicate.rs:75, 1908-1954, 2032-2099).
  - The composed SQL adds plain projected columns and the DOUBLE bbox comparisons (stream.rs:1440-1465).
  - B-T1's key needs `arith_op` in `+ - *` and exact S1 (filter_type_admission:1004), so a non-arithmetic case ending in S1 would count as a B-T1 failure. B-T1 printed 0 failures at the head, so none of the P0 matrix's 4564 admitted cases reached S1 from outside that class.
  - Admission does not route implicit casts into this class. DuckDB raises cast range errors under its Conversion class, which T2 asserts false (2700).
- **Residual:** an out-of-range error raised while reading the file (not computing) has not been ruled out. If one exists it would get S1, which would cost diagnostics but leak nothing. This is covered by "known source" in W1's words.
- **Fetch site:** see W1.

## Check 4: the evidence against the form

- **T1:** passes at the head. Under M1 it fails at `assert_eq!(text, OVERFLOW_TERMINAL)`, with DuckDB's `execute:` text, which shows the real shape.
- **T2:** passes. Under M2 it fails at its first non-range sample, the IO message. Under M1 it also fails at its `classify` assertion (stream.rs:2708-2711).
- **Changed tests under M1:**
  - B-T1: 135 failures.
  - P5: 4 candidates, excluded 0.
  - Campaign: passes, with 0 stream errors in all four generators. Amendment 1, item 2 records this as observed.
  - Because of that, the campaign's site at 1166 is not exercised by its seeds. The shared predicate function is exercised through P5 (1383).
- **Amendment 1:**
  - Item 1 matches the stop report's probe table: `i64 * i64 > 0` was admitted and ended in exact S1; `i64 * 9223372036854775807 > 0` completed with 376 ids.
  - Items 2 and 4 match the build report.
  - Item 3 matches stream.rs:2606.
- **Stop rules:**
  - The B-T1 rule was not met: 0 failures before the commits and at the head.
  - T1's predicate was admitted.
  - The worker stopped correctly on the form's defect (stop report), and class 3 was applied.
- **Seam:** the engine-to-kernel variant and `Display` are unchanged, and T1 runs through `Dataset::stream_with_cancel` (campaign:1328-1329), the real product path.
- **Round 25, item 2 checks:**
  - No §7 overrun (short form, 134 of 150).
  - No standing-rule scope addition.
  - The RECORDED MUTATION lines name their commit and pin no test text by hash.
  - (e) is set aside by the filler rule.
