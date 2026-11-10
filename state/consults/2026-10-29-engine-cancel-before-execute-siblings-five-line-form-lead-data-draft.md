*Custodian's filing note (2026-10-29): lead-data's read-only draft, ahead, of the five-line form for filler entry 4a, on the custodian's brief (its REPORT PATH), read at main 32041d12; the reuse index a miss, carried. It is a draft and not Authority; its OPEN-1 to OPEN-4 go to the human, and the form is committed only after #270 merges (at the governance path it proposes). By its transcript: Read 36, Grep 26; run 2026-10-29T11:46:30Z to 11:54:11Z. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 22a20d5770b20a0aca56e8244c1837af0ffe1572feda687b205c58e0671c6b79.*

---

Draft: engine-cancel-before-execute-siblings five-line form, lead-data

Result: the five-line form is drafted below. All six sites go through `execute_guarded` in 6 files, about 115 of the 150 lines. Three sites get a test, each with a mutation. Three sites have no test (OPEN-1). The form says outright that the piece touches the guarantee category, and says why §36 lets a five-line form carry that (OPEN-2).
Blocking question: OPEN-1, whether three sites may change with no test.
Blocking question: OPEN-2, whether to dispatch with "guarantee: touched" under §36.
Report path: C:/dev/spatial-ide/state/consults/2026-10-29-engine-cancel-before-execute-siblings-five-line-form-lead-data-draft.md (I wrote no file; you file this text there).
sha256: none. I have no shell.

Read note: I read the main checkout's working tree. The session-start status puts it on main at 32041d12 with two untracked files, neither under engine/ or kernel/. So the cites below are given `@ 32041d12`, but I could not confirm HEAD myself. Where the tree differs from the 8efc554 pins in the sibling list, the tree at 32041d12 is what this piece follows.

---

## The form (proposed path `governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md`, to be committed only after #270 merges)

```
Authority: PLAN node `engine-cancel-before-execute-siblings` (PLAN.yaml:2714-2730 @ 32041d12); filler queue entry 4a (state/FILLER-QUEUE.md:10 @ 32041d12), run under AUTONOMY §36 (AUTONOMY.md:687-693 @ 32041d12): a five-line form under §21c's size, the reviewer and the architect gating from dispatch, §25 (e) set aside. The sibling list is engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md §0 (fifth bullet) and §2 item 4, from the architect's sibling search (state/consults/2026-09-30-engine-cancel-before-execute-architect-draft.md, item 2). Drafted by lead-data, read at main 32041d12. Reuse index: a miss. `node tools/reuse.mjs cancel before execute attach guard` (the custodian's run for this brief, exit 1) reported no prior art.
Scope: engine/src/cancel.rs, engine/src/dataset.rs, engine/src/index.rs, engine/src/rowgroup.rs, engine/src/layout.rs, engine/README.md (6 files); at most 150 changed lines, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/src engine/README.md` at a named commit.
Change: Each of the six other `cancel.attach` sites runs its statement inside `CancelToken::execute_guarded`, mapped back to `Result` by one new crate-private `Guarded::into_result`, so a cancel landing between attach and DuckDB's own interrupt clear is either refused before the statement starts or re-raised while it runs. Before, the statement ran to its end, and the outcome stays `Cancelled` as it was. `IDENTITY_VERIFICATION_SCANS`' increment moves inside the guarded closure, so it still counts only scans that ran. The `is_executing` doc names its new callers, and engine/README.md item 3's blockquote and the owner's-index Cancellation row are brought into line.
Tests+mutation: (T-A) `a_cancellable_open_read_runs_inside_the_execute_window`, a dataset.rs unit test on in-memory DuckDB: the closure given to `cancellable` returns `cancel.is_executing()`, and the test asserts `Ok(true)`. Mutation: `cancellable` calls `run(conn)` outside the guard; it returns `Ok(false)` and the test fails by name. (T-B) `a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`, a dataset.rs unit test on a per-run parquet of 4,000,000 u64 ids written by a DuckDB COPY and removed at the end, calling `admit_identity` on the native `id`: a cfg(test)-only, crate-private helper in cancel.rs spins on `is_executing()` (with a done flag and `TEST_LIVENESS_DEADLINE`, never timing anything) and then cancels. The test asserts that the helper saw the window and that the result is `Err(Cancelled)`. Mutation: `run_identity_scan` runs outside the guard; the window is never seen, admission returns `Ok`, and the test fails by name on that assertion. (T-C) `a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled`, an index.rs unit test on a per-run parquet of 4,000,000 rows (id plus four bbox doubles, DuckDB COPY) calling `SpatialIndex::build_observed` with the same helper and assertions. Mutation: `Self::scan` runs outside the guard; the window is never seen and the test fails by name. Each mutation is observed by applying it, running the named test, recording the failure by name and commit, and reverting (the template's Round 25 additions). Unchanged and green before and after: the tests already in engine/src/cancel.rs; engine/tests/cancel_execute_window.rs; the three callers named in the `identity_verification_scans` doc; kernel/tests/skp_filter_cancellation.rs; kernel/tests/publish_cancellation.rs; kernel/tests/indexed_budgets.rs (no figure re-measured or claimed). Invalidator: if the window is not seen under the fix, the run is invalid rather than a result, and the row count is re-declared by amendment.
Out-of-scope: ADR: not touched (no status, text or amendment; ADR-018 items 1 and 5 govern unchanged). Security: not touched. Wire: not touched (no SKP, MCP or kernel file). Guarantee: touched, which §36 allows by setting §25 (e) aside for a filler. ADR-018 item 1's stopping is extended to six sites, and the G-A1 counter's meaning is kept by moving the increment. The piece claims no time bound (ADR-018 item 5) and no docs/08 figure. It does not change stream.rs, the guard's four steps or the re-interrupter. It adds no dependency and no string a user sees, and the outcome stays `Cancelled`.
```

## Notes

### The guard being reused
- `execute_guarded` is at engine/src/cancel.rs:181-201 @ 32041d12. It runs four steps: set `in_execute`; refuse if already cancelled; run the closure; clear the flag and re-check.
- The re-interrupter is at engine/src/cancel.rs:134-164 @ 32041d12. It is spawned once, on the false-to-true transition, only while `in_execute` is set. It interrupts under the slot mutex while the slot is bound.
- Its proofs are in engine/src/cancel.rs, at the test functions `a_cancel_landing_before_execution_begins_is_re_raised_once_it_has`, `the_re_interrupter_exits_when_the_execute_window_closes` and `a_cancel_after_execution_returns_is_seen_by_the_post_return_check`.
- **What this piece's tests add:** each tested site's statement runs inside that guard in the shipped build. That is the shape T5 established (engine/tests/cancel_execute_window.rs:96-106 @ 32041d12).
- **What they do not add:** a new observation that the work stopped. That rests on the three cancel.rs tests above applying at each site.
- Every site already detaches and checks `is_cancelled()` after its statement. That check stays, so a closure `Err` caused by our own interrupt still ends `Cancelled`.

### The sites, one by one
Each has moved since its 8efc554 pin.

1. **engine/src/dataset.rs:1684 @ 32041d12, `cancellable`** (8efc554 pin: dataset.rs:1332).
   - It serves four open-path reads: dataset.rs:1432, :1704, :1734 and :1810 @ 32041d12.
   - The change wraps `run(conn)` at :1685, which covers prepare, execute and fetch, and touches the doc at :1673-1678.
   - What the guard proves here: a read whose cancel is already set no longer runs, and a cancel arriving during the read is re-raised past prepare's and execute's clears.
   - The work is bounded by the footer and by `SANITY_SAMPLE_MAX_ROWS`.
   - Product path: kernel/src/skp.rs:1177 → kernel/src/lib.rs:226 → open. Neither kernel file is edited.
   - T-A is deterministic and needs no file.
2. **engine/src/dataset.rs:2007 @ 32041d12, the identity scan** (8efc554 pin: dataset.rs:1636).
   - This site's work is unbounded by file size, and it runs at open, after the sanity reads (dataset.rs:563 @ 32041d12).
   - The change wraps `run_identity_scan(conn, &sql)` at :2008.
   - It also moves the `IDENTITY_VERIFICATION_SCANS.fetch_add` at :2003 into the closure. Otherwise a guard refusing at its step 2 would count a read that never happened, against the counter's own doc at dataset.rs:58-76 and :2000-2002 @ 32041d12.
   - T-B calls `admit_identity` directly, so the identity scan is the only guarded window in view. That avoids any race on the process-wide counter.
3. **engine/src/index.rs:335 @ 32041d12** (8efc554 pin: index.rs:332).
   - The change wraps `Self::scan` at :337; `observe(observer, DuckDbScan)` at :336 stays outside the guard.
   - The work: `query_arrow` materialises up to `MAX_INDEXED_FEATURES` rows (index.rs:451-468 @ 32041d12).
   - No caller in kernel/src. `Dataset::build_index` (dataset.rs:728-801 @ 32041d12) is reached only from kernel/tests/indexed_budgets.rs:883 @ 32041d12, a cancel ladder that is declared unchanged and measures nothing for this piece.
   - T-C builds its own `CoveringBbox` from the public `FieldPath` fields.
4. **engine/src/rowgroup.rs:344 @ 32041d12** (8efc554 pin: rowgroup.rs:336).
   - The change wraps `Self::read_metadata` at :345, including its own polled reduction loop at :408-414.
   - The work is bounded by the footer, on an experimental seam the planner never reaches. No test (OPEN-1).
5. **engine/src/layout.rs:349 @ 32041d12** (8efc554 pin: layout.rs:345).
   - The change wraps `conn.execute_batch(&copy)` at :350, with the `Query` mapping at :355 moved into the closure.
   - This is the measurement harness only, behind the `fixture` feature. No test (OPEN-1).
6. **engine/src/layout.rs:447 @ 32041d12** (8efc554 pin: layout.rs:438).
   - The change wraps only `stmt.query_arrow([])` at :448; the prepare at :444 comes before attach.
   - The `scanned` map at :452 becomes a plain `?`. Harness only. No test (OPEN-1).

Not changed: engine/src/stream.rs's guarded call (stream.rs:1837-1859 @ 32041d12) and `lease_for_stream` (dataset.rs:2170-2177 @ 32041d12), the seventh attach site, whose execute is already guarded.

### Risks for the gates
- **No nesting.** One token never runs two windows at once: `attach` refuses a second binding (engine/src/cancel.rs:233-251 @ 32041d12), and no guarded closure attaches.
- **Prepare inside the window.** At sites 1 to 4 the window spans prepare as well as execute, unlike stream.rs. A re-raise during prepare gives a closure `Err`, which the existing post-detach check turns into `Cancelled`.
- **The test helper.** It is cfg(test) test support, not a product path with only a test caller. The gates should still confirm that reading under the architect's caller rule (.claude/agents/architect.md:11 @ 32041d12).
- **Instrument accessor docs.** The `is_executing` doc (engine/src/cancel.rs:203-213 @ 32041d12) must name T-B and T-C beside T5, under the instrument-accessor exemption. T-A calls it inside a closure, so it names T-A too.
- **The parent form's cites.** If #270 does not rewrite the code comments that cite engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md (cancel.rs:12 and :174, stream.rs:1832 @ 32041d12), those cites in Scope files go stale. Fixing them is in Scope and costs lines.

### Size estimate
About 115 of the 150 lines:
- cancel.rs: about 35 (`into_result` with its doc, the test helper, the `is_executing` doc);
- dataset.rs: about 40 (two sites, the counter move, a new `#[cfg(test)] mod tests` holding T-A and T-B);
- index.rs: about 22 (one site, T-C);
- rowgroup.rs: about 2;
- layout.rs: about 8;
- engine/README.md: about 6.

The node's `budget_minutes: 90` looks plausible. Writing two 4,000,000-row files by COPY is the heavy run, so it takes a shared hold under §36.

### N4, carried by the node
The gate-1 reviewer's note N4 is at state/consults/gates/2026-09-30-cancel-before-execute-gate1-reviewer.md:85 @ 32041d12.
- **The `lease_for_stream` half is already discharged.** The connection-reuse piece's F5 (engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md:19 @ 32041d12) replaced that doc; the current text is dataset.rs:2155-2169 @ 32041d12. I propose recording it discharged by that reference, with no edit.
- **The README half is still open.** The blockquote at engine/README.md:52-56 @ 32041d12 still calls the producer's check "the only thing"; the paragraph at :58-60 @ 32041d12 names the guard. That is OPEN-3.

### Paths for rule (00)
- **This piece's paths:** the six Scope files, the form at the proposed governance path, and your PLAN.yaml and FILLER-QUEUE edits.
- **#269:** disjoint (kernel/src/skp.rs, protocol/skp/SKP-V0.md, a kernel form). kernel/src/skp.rs:1177 calls into the open path but is not edited.
- **#270:** probably overlaps engine/README.md, since the owner's index lists engine form paths (engine/README.md:553 @ 32041d12). It may also overlap engine/src/cancel.rs if it rewrites code cites. I cannot read its branch. Either way the form waits for #270 to merge.
- **`cut/b2-piece-1c-save-and-reopen` and `cut/port-2-macos-l1-and-app-dirs`:** I could not read these branches. You check them at dispatch.

## OPEN items for the human

- **OPEN-1. The three sites with no test** (rowgroup.rs:344, layout.rs:349, layout.rs:447).
  - (a) Route all six through the guard; test the three sites the product reaches or whose work is unbounded; the other three are one-expression changes of the tested shape, claimed as "routed through the guard" only.
  - (b) Only the three tested sites now; a new node for the other three.
  - (c) All six tested. That is about 200 lines or more, over §21c, so it leaves the filler slot for the full form.
  - Recommendation: (a). Two of the three are harness-only and the third's work is bounded by the footer; a spin test on a footer read's short window would be flaky.
- **OPEN-2. The Out-of-scope line.**
  - (a) Dispatch as drafted, "guarantee: touched", with the architect's brief citing §36 setting §25 (e) aside. The architect's checklist otherwise fails by name a five-line piece whose Out-of-scope line names a category (.claude/agents/architect.md:15 @ 32041d12).
  - (b) Full form and full gating. The piece leaves the filler queue.
  - Recommendation: (a). "None touched" would be false: §21a names a cancellation guarantee and any property under test (AUTONOMY.md:325-327 @ 32041d12).
- **OPEN-3. engine/README.md item 3's blockquote** (engine/README.md:52-56 @ 32041d12).
  - (a) Edit the clause in place to say that the producer's check, together with `execute_guarded`'s check before every guarded statement, is what stops a stream cancelled before it started. These words are a draft for the architect's clause check, not the human's wording.
  - (b) Leave the measured blockquote alone and add one sentence to the paragraph at :58-60 naming the six sites.
  - (c) Leave both. The gate-1 architect ruled the blockquote still true.
  - Recommendation: (b). It does not rewrite a "measured while building" record, and it still removes the inconsistency N4 names.
- **OPEN-4. The G-A1 counter.**
  - (a) Move the increment inside the guarded closure, as drafted.
  - (b) Leave it and qualify its doc.
  - Recommendation: (a). It keeps "a read happened" true with no doc change, and the three tests that call the counter run with no cancel.
