*Custodian's filing note (2026-11-03): lead-data's read-only draft of the five-line form for `stream-cancel-returns-left-unmarked`, the filler queue's entry 4b (S3), read at main ab9b52ab (dispatched 2026-11-03T11:34:56Z by the main transcript, its prompt equal to its brief by script). Its headline reads the five-line form closed by the template's line 176 alone, and its OPEN-1 recommends (A), the five-line form with Guarantee touched under AUTONOMY section 36, which sets section 25 (e) aside for a filler, as the human ruled for entry 4a. OPEN-1 (A) and OPEN-2 to OPEN-5 (a), none a red line by its marking or the custodian's reading, are taken under the human's direction of 2026-10-31, item 4, and the form is committed next at its governance path. The run 11:35:15Z to 11:43:17Z by its transcript (Grep 14, Read 26; no write tool; no call outside the repository). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 42e51c19a40e00b4c6bc0ac73a2b3ca54d619003710fac509008538778f1aece.*

---

Draft: stream-cancel-returns-left-unmarked, the five-line form closed
Blocking questions: none. OPEN-1 to OPEN-5 below each carry a recommendation, and none of the recommendations is a red line. OPEN-2's option (b) and OPEN-1's option (C) would be red lines; I do not recommend either.
Report path: C:/dev/spatial-ide/state/consults/2026-11-03-stream-cancel-returns-left-unmarked-five-line-form-lead-data-draft.md
sha256: none. I have no shell, so I cannot hash. I leave no background shell.

---

All text below is my own words unless it is marked as byte-copied. I read every file with the Read and Grep tools in the C:/dev/spatial-ide checkout. I cite each line as `@ ab9b52ab`. That the checkout is at ab9b52ab rests on the session-start git status the harness supplied (main at ab9b52ab, untracked files only), not on a call of mine. The custodian's pin script confirms it.

## Item 1: the guarantee categories (settled first)

- **Existing tests' asserted figures: none changes.**
  - T-2 (`the_pre_prepare_cancel_exit_stamps_producer_cancelled`, engine/src/stream.rs:3227-3271 @ ab9b52ab) keeps its three assertions.
  - Its M-2 (delete the pre-prepare check's mark, flush form §4, governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:193-197 @ ab9b52ab) still fails it. M-2 keeps the check's `return` (engine/src/stream.rs:1794-1797 @ ab9b52ab), so `prepare` and `classify` are never reached.
  - What becomes false is the reason T-2's doc gives (engine/src/stream.rs:3227-3230 @ ab9b52ab). With `classify` marking, deleting the whole check would no longer be caught with invalid SQL. That was never a recorded mutation. The doc's own instruction to revisit it is met by revising the doc (OPEN-3).
  - The two `classify` unit tests (engine/src/stream.rs:2743-2776 and :2803-2863 @ ab9b52ab) keep their assertions. They gain `TEST_LOCK` (OPEN-4).
- **The Out-of-scope line would name Guarantee as touched.** It cannot truthfully assert none of the four.
  - The piece adds ADR-018's `cancel_observed` instant (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46 @ ab9b52ab; producer side `PRODUCER_CANCELLED`, engine/src/trace.rs:380-384, :441 @ ab9b52ab) to two more `Cancelled` returns.
  - It also moves two existing stamps into `classify`. Both stamps carry a property under test: kernel/tests/skp_filter_cancellation.rs expects them (flush form §2.4, :142-146 @ ab9b52ab). §21a names a cancellation guarantee (ADR-018) and any property under test (governance/AUTONOMY.md:325-327 @ ab9b52ab).
- **So, read alone, line 176 closes the five-line form** (docs/PREREGISTRATION-TEMPLATE.md:176 @ ab9b52ab; AUTONOMY §25 (e), governance/AUTONOMY.md:482 @ ab9b52ab).
- **But §36 sets §25 (e) aside for a filler** (governance/AUTONOMY.md:692 @ ab9b52ab), and line 176 restates the same round-25 item 2 (e). The human ruled exactly this shape for entry 4a: its OPEN-2 (a) ("Guarantee: touched, which §36 allows", governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md:10 and :114 @ ab9b52ab). The architect fails by name a five-line form whose Out-of-scope line names a category (.claude/agents/architect.md:15 @ ab9b52ab), so the architect's brief must cite §36, as 4a's did.
- **The route is therefore OPEN-1.** I recommend (A), the five-line form below, which matches the placement as the human ruled it (PLAN.yaml:4948 @ ab9b52ab). The outline of the full form, option (B), follows it.

## Option (A): the five lines (the draft)

Form path: `governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md`.

```
Authority: PLAN node `stream-cancel-returns-left-unmarked` (governance/PLAN.yaml:4933-4949 @ ab9b52ab); filler queue entry 4b (state/FILLER-QUEUE.md:11 @ ab9b52ab), run under AUTONOMY §36 (governance/AUTONOMY.md:687-696 @ ab9b52ab): a five-line form under §21c's size, the reviewer and the architect gating from dispatch, §25 (e) set aside. Its rows are the custodian's list (state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37 @ ab9b52ab), as the flush piece's form leaves them out of scope (governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:115-123 @ ab9b52ab). Drafted by lead-data, read at main ab9b52ab. Reuse index: a miss. `node tools/reuse.mjs cancel classify unmarked` and `node tools/reuse.mjs receiver disconnected cancel observation` (the custodian's runs for this brief, exit 1 each) reported no prior art.
Scope: engine/src/stream.rs, engine/README.md (2 files); at most 150 changed lines, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/src/stream.rs engine/README.md` at a named commit.
Change: `classify` stamps `PRODUCER_CANCELLED` when its one read of the token returns `Cancelled`, and the separate reads that marked before it at the execute-`Err` and fetch-panic exits are removed. So a prepare error under a cancel is now stamped, and a cancel landing between the old two reads can no longer return `Cancelled` unmarked. Every exit's outcome is unchanged, and each `classify` call is still followed at once by a return out of `produce`, so a stream stamps at most once. The send to a receiver that is gone is unchanged: a disconnect is no flag load, so it is not ADR-018 item 1's observation. The pre-prepare test's doc is revised as it asks, and engine/README.md's owner's index gains the new test and this form.
Tests+mutation: (T-3, new) `classify_stamps_producer_cancelled_when_it_returns_cancelled`, in engine/src/stream.rs `mod tests`: takes `crate::trace::TEST_LOCK` first, starts a trace, cancels a token with `cancel()`, and asserts (i) `classify(&cancelled, "prepare", "Binder Error: no such column")` is `EngineError::Cancelled` and `PRODUCER_CANCELLED` is present; then, in a second trace started after the first guard is dropped, (ii) the same for `classify_fetch_panic(&cancelled, "no panic message")`. Presence only, never an absence or an exact list. Mutation M-3: delete the mark in `classify`; T-3 fails by name at (i). (Changed, assertions byte-unchanged) `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` and `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start` take `TEST_LOCK` as their first statement, because they now stamp the event into any live trace. `the_pre_prepare_cancel_exit_stamps_producer_cancelled` has its doc revised and its assertions unchanged; its M-2 (delete the pre-prepare check's mark) is re-observed at the piece's head and still fails it by name at its presence assertion, because the check's return comes before prepare. Each mutation is observed by applying it, running `cargo test -p spatial-engine --lib <test name>`, recording the failure by name with its commit, and reverting (the template's Round 25 additions). All tests are deterministic: in-memory, with no sleep, retry, timeout or fixture. On CI they run in the workspace job (`cargo test --workspace --locked`, windows-latest and ubuntu-24.04). Unchanged and green, before (main's CI at the base) and after (the PR's CI): `flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`, engine/tests/slice.rs, engine/tests/stream_fetch_overflow.rs, engine/tests/admitted_integer_overflow.rs, kernel/tests/trace_spans.rs, kernel/tests/skp_admission.rs, kernel/tests/skp_filter_cancellation.rs. Invalidator: if T-3 cannot reach `classify`'s mark without a product seam, or M-3 or M-2 does not fail its test, the worker stops and returns to the architect.
Out-of-scope: ADR: not touched (no status, text, note or amendment; ADR-018 items 1, 2 and 4 govern unchanged). Security: not touched. Wire: not touched (no SKP, MCP, data-plane or kernel file). Guarantee: touched, which §36 allows by setting §25 (e) aside for a filler. ADR-018 item 1's `cancel_observed` is stamped on every `Cancelled` that `classify` returns: this adds the prepare route and closes the two-read window, and the two stamps at the execute-`Err` and fetch-panic exits move into `classify`. No existing test's assertion changes. The piece claims no time bound and no docs/08 figure, adds no dependency, product seam, pub item or string a user sees, and leaves flush's send and its error arm unchanged.
```

## Option (B): the outline of the full form, if OPEN-1 goes that way

- **§0 Disclosure:** the custodian's list (state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37 @ ab9b52ab); the flush form's §2.3 rows and the paragraph after them (governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:115-123 @ ab9b52ab); the reuse miss; the gating route (§21a guarantee, both gates).
- **§1 May claim:**
  - `classify` stamps on every `Cancelled` it returns (T-3);
  - by reading the code, the three `classify` routes in `produce` therefore stamp, at most once per stream;
  - M-3 and M-2 as observed.
- **§1 May not claim:**
  - a route test through `produce` for the prepare row or the window;
  - anything for the send row;
  - any rate or time bound;
  - any docs/08 figure.
- **§2 Change:**
  - C1: `classify` marks.
  - C2: the two outer reads are removed.
  - C3: T-2's doc.
  - A sibling table for the node's three rows.
  - ADR-018 item 1 and item 4 readings (Notes below).
  - The disconnect reading.
  - Seams: none.
  - Portability R1 to R6: no OS dependence.
- **§3 Fixtures:** in-memory only.
- **§4 Tests:** T-3 with M-3; the two lock-only changed tests; M-2 re-observed.
- **§5:**
  - Predictions: P-1, T-3 passes and M-3 fails it; P-2, M-2 still fails T-2; P-3, the declared-unchanged tests stay green.
  - Unchanged: every product line except C1 and C2; cancel.rs; trace.rs; flush's send.
  - Invalidators: as in the Tests+mutation line.
- **§7:** at most 150 lines over the 2 Scope files; the form, PLAN.yaml and FILLER-QUEUE.md are outside the count.
- **§8 Block-on-sight:**
  - any code for the send row;
  - a product seam or cfg(test) hook;
  - a mark on a path that runs per row;
  - an outer read kept beside `classify`'s mark (a double stamp);
  - an absence or exact-list assertion;
  - a time bound;
  - a path:line cite in a code comment.
- **§9 Gates:** both gates; the suites named in the Tests+mutation line; the owner's-index update; no KNOWN-LIMITATIONS item owed; rule (00).

## Notes

### Item 2: the size (§21c, governance/AUTONOMY.md:347-357 @ ab9b52ab)

My estimate is about 80 changed lines over 2 files, against 150 lines and 8 files:

| Where | Lines (about) |
|---|---|
| `classify`'s doc and mark | 4 |
| a comment at the prepare site | 2 |
| execute-`Err` arm (delete engine/src/stream.rs:1849-1855 @ ab9b52ab, a shorter comment) | 10 |
| fetch-panic arm (delete :1924-1938 @ ab9b52ab, a shorter comment) | 19 |
| T-3 | 30 |
| T-2's doc | 9 |
| the two lock insertions, rustfmt'd as at :3166-3168 @ ab9b52ab | 8 |
| engine/README.md | 4 |

The node's 120 minutes looks plausible. The only heavy run is building the lib tests, which goes in a shared hold under §36.

### Item 3: the route for each of the node's three rows

1. **The prepare error through `classify`: in, by a `classify` that marks when it returns `Cancelled`.**
   - The route is `.map_err(|e| classify(cancel, "prepare", &e.to_string()))?` (byte-copied, engine/src/stream.rs:1801 @ ab9b52ab).
   - `classify` loads the flag once (:2644 @ ab9b52ab). When it reads set, `produce` returns: that is item 1's load-and-stop (ADR-018:46 @ ab9b52ab).
   - Without a seam, a test cannot make the flag change from unset at the pre-prepare check (:1794 @ ab9b52ab) to set inside prepare. So T-3 proves the mechanism at `classify` itself, and the route is claimed by reading the code only.
   - ADR-018 item 4 (:78-88 @ ab9b52ab): the section this exit now ends is DuckDB's prepare, class (b). No bound is derived.
2. **The two-read window: in, by a single read.**
   - Today the execute-`Err` arm (:1848-1857 @ ab9b52ab) and the fetch-panic arm (:1936-1939 @ ab9b52ab) each read the flag once for the mark and again inside `classify`.
   - With the mark inside `classify` and the outer reads deleted, one read decides both the mark and the `Cancelled`. The window stops existing by construction. A test cannot reach it, because it lies between two adjacent loads; the structure is checked by reading the diff.
   - Outcomes are unchanged, because `classify`'s own read always decided `Cancelled`; the outer read decided only the mark.
   - At most one stamp per stream still holds: each `classify` call is followed by a return out of `produce` (:1801, :1856, :1939 @ ab9b52ab), and nothing else marks after it.
   - One shift to disclose: the stamp now follows `e.to_string()` at the execute site, and `fetch_panic_duckdb_text` at the fetch site (:2658-2664 @ ab9b52ab). That is bounded in-memory work over the error text (class (a) in bytes, no time bound).
   - Rejected alternative: splitting `classify` into pure halves called after one read at each site. It costs more lines and changes the existing unit tests' calls, which assert `classify(&cancelled, …)` returns `Cancelled`.
   - Seam in product code: none.
3. **The send to a receiver that is gone: out.**
   - The arm is `.map_err(|_| EngineError::Cancelled)` (byte-copied, :2591 @ ab9b52ab), under the comment at :2580-2581 @ ab9b52ab. No flag is loaded there.
   - It is outside the flush piece's defect class, which is a load that reads set and then returns unmarked (flush form :112 @ ab9b52ab).
   - A deterministic test of a load added there would need to know that flush has passed its check (:2558 @ ab9b52ab) before the cancel lands. That needs either a wait loop on `resident_bytes`, which a committed test may not carry, or a product seam.
   - The disconnect question is item 4 and OPEN-2.

### Item 4: is a disconnect an ADR-018 observation?

- **As ADR-018 stands, no.** Item 1 defines `cancel_observed` as the worker loading the flag set and stopping (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:43-47 @ ab9b52ab). A disconnect is not a load of the flag.
- **The code facts behind that:**
  - The only product receiver is `BatchStream.rx` (engine/src/stream.rs:1251, :1412-1421 @ ab9b52ab).
  - `BatchStream`'s `Drop` body calls `cancel_for_drop` (:898-907 @ ab9b52ab), which sets the flag with no stamp (engine/src/cancel.rs:125-127, :132-136 @ ab9b52ab) before the `rx` field drops. So in the product, a disconnect always follows a set flag.
  - A load added after the disconnect would therefore always read set. Its instant would be fixed by when the consumer drops the stream, not by any producer check.
- **What the piece does:** nothing that depends on that answer. It needs no ADR status line, note or amendment.
- **What remains today:** on that path a trace may hold a request and no observation, so `segment_ms` is `None` and the run drops out of any sample. That is instrument surface, and no KNOWN-LIMITATIONS item is owed (the flush form's reasoning, :291 @ ab9b52ab).

### Item 5: tests and mutations

| Test | Status | Mutation and predicted failure | Notes |
|---|---|---|---|
| T-3 | new | M-3, delete `classify`'s mark: fails at (i) | deterministic, in-memory |
| `the_pre_prepare_cancel_exit_stamps_producer_cancelled` | doc revised | M-2 re-observed: fails at its presence assertion | |
| `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` | lock only | none (not new) | |
| `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start` | lock only | none (not new) | |
| `flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing` | unchanged | M-1 unaffected | |

- **Why the two lock-only changes are needed:** without the lock, those two tests' new stamps could land in T-1's, T-2's or T-3's trace, and M-1, M-2 or M-3 could then pass by chance.
- **Why T-3's presence assertion is unambiguous under the lock:**
  - The only stampers in this crate are in stream.rs (Grep of `PRODUCER_CANCELLED` over engine/src).
  - The only in-crate tests that make real streams drain uncancelled tokens to disconnection (:3465-3467, :3560-3566 @ ab9b52ab).
- **CI:** all of these run in the workspace job.
- **Unchanged kernel tests, checked by reading only:**
  - trace_spans' absence assertion stays true: `classify` marks only when it returns `Cancelled`, and a completed run never reaches it.
  - skp_filter_cancellation's expected stamps now come from `classify`, at the same position relative to the other events.

### Item 6: strings

There is no new string a user sees. `classify`'s messages and `OUT_OF_RANGE_DETAIL` (:2606 @ ab9b52ab, already a P6 placeholder) are untouched.

### Item 7: rule (00), path by path

- **This piece's paths:**
  - engine/src/stream.rs and engine/README.md;
  - the form at its governance path;
  - the custodian's PLAN.yaml and FILLER-QUEUE.md edits.
- **Against each branch in flight:**
  - `cut/b2-piece-1c-save-and-reopen`: nothing under engine/. Disjoint for both Scope files. Its other 14 or so paths are not visible to me; you check PLAN.yaml at dispatch.
  - `cut/port-2-macos-l1-and-app-dirs`: app_dirs.rs, lib.rs, lod.rs and the lod tests. Disjoint (neither stream.rs nor README.md).
  - `cut/b1-shell-half-pr-c`: 0 files. Disjoint.
  - PR #271: nothing under engine/. Disjoint.
  - `cut/verify-quotes-cite-listing-line-count`: scripts only. Disjoint.
- No protocol/ path.
- **The owner's index needs lines, so engine/README.md is in Scope:**
  - the Producer trace row gains T-3 (engine/README.md:551 @ ab9b52ab);
  - the preregistration list gains this form (:557 @ ab9b52ab);
  - Last verified at (:537 @ ab9b52ab).

## OPEN items

Under the human's direction that the brief names (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4; not read by me), each non-red-line item takes my recommendation until 2026-11-04.

- **OPEN-1. The form route.**
  - (A) The five-line form above, Guarantee touched, under §36, with the architect's brief citing §36 as for 4a.
  - (B) The full form with both gates, in the filler slot.
  - (C) Narrowed so that it touches no category. Only the doc and lock changes would be left, and the node would go unfixed.
  - (D) Back to the human.
  - Recommendation: (A). It is the placement as ruled, with 4a's OPEN-2 (a) as precedent. Not a red line.
  - I read (C) as a red line: a scope change to a ruled item. (B) and (D) depart from the placement's stated form, so they are the human's to choose and should not be taken by default.
- **OPEN-2. The disconnect.**
  - (a) Not an observation as item 1 stands. The send row stays out, with no code and no new node; the form records the reading.
  - (b) A single load and mark in the send's error arm. That would put an interval set by the consumer into the scored segment. I read it as needing an ADR-018 note (a red line), plus a seam or a wait loop for its test.
  - (c) A proposed node for the human to decide (b).
  - Recommendation: (a). Not a red line.
- **OPEN-3. T-2's revisit.**
  - (a) Revise the doc only, and re-observe M-2.
  - (b) Also switch to valid SQL and add an assertion that `SQL_PREPARED` is absent, so the test again catches the check's removal. That changes what T-2 asserts.
  - (c) Leave the doc, which would then be false.
  - Recommendation: (a).
- **OPEN-4. Locks on the two classify unit tests.**
  - (a) Add them.
  - (b) Leave them, and accept that the mutation observations can pass by chance.
  - Recommendation: (a).
- **OPEN-5. The owner's index omits 4a's form.** `ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md` does not appear in engine/README.md (Grep, no match).
  - (a) Add it in this piece's index update, as a class-3 fix inside a Scope file.
  - (b) Leave it to a docs-lane piece.
  - Recommendation: (a).

## What I could not settle

- Whether any kernel test reaches the send row: whether the kernel drops a `BatchStream` while its producer is parked in `send` after a `cancel()`. I did not read kernel/src for this.
- Whether comments in kernel/tests/skp_filter_cancellation.rs describe the two outer reads. Not read. If they do, they go stale outside Scope.
- How the new form's entry should be written in the index list, whose entries use the old `engine/` paths. I did not read governance/MOVED.tsv.
- Whether the checkout I read is byte-identical to ab9b52ab. The custodian's pin script settles it.
