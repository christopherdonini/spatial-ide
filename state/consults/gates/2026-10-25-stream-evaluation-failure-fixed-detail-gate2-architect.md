Reviewed: PR #255 at 8cca70aec09942b7eaa66a79292be4a35c7b2335 (gate 1 at 27924bbe), gate 2, architect
Branch: cut/stream-evaluation-failure-fixed-detail @ 8cca70aec09942b7eaa66a79292be4a35c7b2335 (main @ 2fbeb2c0cefd80ca28c4ce7747fe80a704cc1093)

Verdict: FAIL

The only blocking finding is the wording of one sentence (X1), under AUTONOMY §31 (the 2026-10-11 directive, item 2). The code has not changed since gate 1, and the route B words are correct. X1 is a worker's doc comment, not the human's wording, so the worker applies the words below with no re-gate and the PR body lists them. Branch cites are to the head 8cca70ae in C:/dev/wt/sefd. Cites marked "main" are to main at 2fbeb2c0. I have no shell, so I recomputed no hashes and ran no git commands. See "Not run" at the end.

## Gate 1 findings
- **W1 (mine): closed.** Route B's words 1 to 3 replace W1's words (Amendment 2, item 2). They are at engine/src/stream.rs:2591-2601, 2604-2607 and 2612-2614. Joined, each matches the route draft's lines 71, 85 and 90 by my read. I re-checked every clause against the head (check 2).
- **D1 (mine): closed.** engine/tests/admission_property_campaign.rs:1024-1027 matches gate1-architect.md:58. The key is at 1032-1036 and the text check at 1029.
- **Gate 1's form item (the closing amendment's reference item for the Change line): carried.** It is Amendment 2, item 6.3, and is owed at closing.
- **C1 and E1 (the reviewer's): carried** by node `stream-fetch-overflow-fixed-detail` (main PLAN.yaml:3426-3442; its summary names C1 and E1; state/FILLER-QUEUE.md:22, entry 9). The reviewer re-gates them against the narrowed claim.
- **O1: carried** by node `admitted-integer-overflow-silent-wraparound` (main PLAN.yaml:3409-3425).

## New findings

### Correctness (blocking, wording only, §31)

**X1. A doc comment in the campaign file still states the claim with no site bound.**
- Where: engine/tests/admission_property_campaign.rs:1022-1023. The piece added this sentence; main's version of the doc, at :1016-1022, has different words.
- The sentence, byte-copied from the head with its two lines joined by one space: "Such a stream ends in error by direction (B-1 point 4), and node `stream-evaluation-failure-fixed-detail` makes its terminal text the fixed detail alone."
- What is wrong: "Such a stream" means any admitted integer-arithmetic overflow. An overflow first raised during a fetch does not get the fixed detail:
  - stream.rs:1936 passes the panic payload to `classify`;
  - the crate's prefix (duckdb 1.10505.0 per Cargo.lock:541-542; `Arrow::next` at src/arrow_batch.rs:46 in the crate's source, and `ArrowStream` is an alias of `Arrow` at :55) means stream.rs:2609 does not match;
  - so stream.rs:2621 renders `{phase}: {message}`.
- Ordinary use reaches this case: a large file whose overflowing rows come after the first chunks (gate1-reviewer.md, C1). So it blocks.
- This is the same fact W1 covered, and check 3 asks that no statement of the claim reads as covering the fetch site.
- The words are not the human's (they are the worker's doc comment).

Replacement for that sentence (my words):
> Such a stream ends in error by direction (B-1 point 4), and node `stream-evaluation-failure-fixed-detail` makes its terminal text the fixed detail alone when the error is raised at the prepare or execute site; an overflow first raised during a fetch keeps DuckDB's text (node `stream-fetch-overflow-fixed-detail`), which this check does not accept, so it is a counterexample at both call sites.

Clause check against the head:
- "ends in error by direction (B-1 point 4)": the head's words, unchanged. They state the direction, not a fact; O1 has its own node.
- "the fixed detail alone when … prepare or execute": stream.rs:1801 and :1856 pass `&e.to_string()`, and :2618-2619 then return `OUT_OF_RANGE_DETAIL` alone.
- "keeps DuckDB's text": stream.rs:1916-1920 downcast the payload unchanged, and :1936 with :2621 render it after the phase. The payload carries DuckDB's text after the crate's prefix (arrow_batch.rs:46). This is the same reading as approved word 1, "keeps DuckDB's text, operands included".
- "(node `stream-fetch-overflow-fixed-detail`)": main PLAN.yaml:3426.
- "this check does not accept": admission_property_campaign.rs:1029-1031 return false unless the text equals `OVERFLOW_TERMINAL`.
- "a counterexample at both call sites": :1167-1171 call `fail("P1", …)`, and :1384-1385 return `Err`.
- Size: the replacement takes about 3 more doc lines, so about 147 of 150 by my estimate (not counted). The worker counts it. Past 150 is a stop under Amendment 2, item 5.

### Documentation (must fix before the merge; no re-gate)

**D2. The form's title states the claim with no bound, and Amendment 2's superseded index does not name it.**
- Where: main engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md:1, "carrying no file values and no SQL" (byte-copied). The superseded index (same file, Amendment 2, "Superseded:") names only the Change line and W1's words.
- The title is lead-data's wording, not the human's. The form is append-only.
- Fix: the closing amendment's superseded index (Amendment 2, item 6.3, already schedules a closing amendment) carries this item, my words:
> - The title's claim: read with Amendment 2, item 1. The title is unedited.

  Clause check: the title is at line 1 and has no site bound. Amendment 2, item 1, first bullet, bounds the claim to the prepare and execute sites.

**D3. The PR body after X1.**
- Once X1's words land, the body lists them (§31) and states the new line count in place of "144 of the declared 150 lines".
- The "At 8cca70ae" evidence bullet gains the new commit, with its fmt and check runs.

## What I checked

1. **Amendment 2 against the human's item 1 and the route draft.**
   - Class 5: matches item 1's "by a class 5 amendment".
   - The claim is narrowed to the prepare and execute sites, proven at execute by T1 and B-T1 (item 1).
   - The fetch node is proposed and placed after the current entries (item 1, third bullet; FILLER-QUEUE.md:22; PLAN.yaml:3431, `status: proposed`).
   - The words are approved (item 2). Item 1 of the human's message approves the architect's replacement words, and D1 is also an architect's replacement for a doc comment.
   - Gate 1's findings are placed: W1 superseded and D1 applied (item 2); C1 and E1 go to the new node, O1 to its own node (item 3).
   - The re-gate is the custodian's ruling on the route draft's open item (item 4). It matches this brief.
   - Nothing is quoted: Amendment 2 has no quotation marks, and its italic line says so.
   - The Change line is unedited: form line 8 equals the lead-data draft's line 20 except for the pin's expansion to the full commit id with its hash.
   - Amendment 2's first line says it was written after gate 1's reports and the route draft were seen.
   - It ends with a superseded index (round 12 (e)). D2 is a gap in that index.
   - Its two sha256 values match the values in the filing notes of the directive (line 3) and the route draft (line 1). I did not recompute them.
2. **The words at the head.** The delta patch is doc lines only: every changed line begins with `///`, which agrees with the worker's script. Each of the four word sets matches its approved source by my read, with lines joined. Each clause holds at the head:
   - "not cancelled": stream.rs:2616-2617.
   - "beginning with … label": :2609, `starts_with`.
   - "prepare and execute sites pass DuckDB's text": :1801 and :1856.
   - "withheld": :2618-2619.
   - "Proven at the execute site": gate1-reviewer.md:76, where M1's text begins `query: execute:`, and :29.
   - "no test starts from the prepare site": T2's only `prepare` sample is non-range (:2722). T1, B-T1 and P5 end at execute (gate1-reviewer.md:29).
   - "puts its own words before DuckDB's" and "1.10505.0, `Arrow::next` in src/arrow_batch.rs": Cargo.lock:541-542, crate src/arrow_batch.rs:46, `ArrowStream` = `Arrow` at :55, and `stream_arrow` returns `ArrowStream` (crate src/statement.rs:155).
   - "keeps DuckDB's text": :1916-1920, :1936, :2621.
   - Word 2's "not misread": T2 samples at :2711-2712 are asserted false at :2714.
   - Word 3's "as passed": :2621.
   - D1's key: :1032-1036.
3. **Every statement of the claim at the head.**
   - Bounded: the stream.rs docs (:2591-2601, 2604-2607, 2612-2614); T1's doc (campaign :1451-1454, a claim about T1's own predicate, which T1 asserts at :1477-1482); T2's doc (:2694-2697); filter_type_admission.rs:991-1001 (a condition, not a claim); the PLAN title (main PLAN.yaml:3374, "at the prepare and execute sites (the fetch site: stream-fetch-overflow-fixed-detail)"); the PR body's change paragraph.
   - Not bounded: campaign :1022-1023 (X1) and the form's title (D2).
4. **The PR body against the head and the records.**
   - The narrowed claim matches Amendment 2, item 1.
   - 144 = 74+5 + 45+6 + 9+5 (the worker's numstat, its report line 15). That agrees with gate 1's 134 plus the delta's 16 lines added and 7 removed in stream.rs, and 2 added and 1 removed in the campaign file.
   - The evidence lines match gate1-reviewer.md:72-88 (447 passed; M1 gives B-T1 135 and P5 4, the campaign passes; M2 fails T2) and the RECORDED MUTATION lines at campaign :1456-1464 and stream.rs :2699-2701, which name 86612bdd.
   - The 8cca70ae bullet matches the worker's report (fmt and check rc 0).
   - The gates paragraph matches Amendment 2, items 3 and 4.
   - No record calls a `verify-mutation` run an observation of a mutation.
5. **Round 25, item 2.**
   - No §7 overrun (144 ≤ 150).
   - No scope addition on a standing rule.
   - No test-text span is pinned by hash at a branch commit, and the RECORDED MUTATION lines name their full commit id.
   - The Out-of-scope line's guarantee category is covered: (e) is set aside by the filler rule (form, line 3).
   - Seams: none new. The variant and its `Display` are unchanged (gate 1).

## Not run
- No sha256 recomputed: the delta patch, the directive's ebe31bd9…, the route draft's 91c0cc0a…. The reviewer recomputes them.
- No `git diff`. I worked from the delta patch and the worker's numstat.
- Word matches were compared by reading, not by script.
- Rule (00), the PR body's claim about the three paths, was not checked.
- CI at 8cca70ae was not checked.

Files: C:/dev/wt/sefd/engine/tests/admission_property_campaign.rs (X1), C:/dev/spatial-ide/engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md (D2), C:/dev/wt/sefd/engine/src/stream.rs (checked).
