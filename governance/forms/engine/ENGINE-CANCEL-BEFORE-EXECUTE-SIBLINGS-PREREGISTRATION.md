# engine: the six other cancel.attach sites run inside the execute-window guard — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node engine-cancel-before-execute-siblings, the filler queue's entry 4a (S3). The five lines, the notes and the OPEN items are lead-data's draft (`state/consults/2026-10-29-engine-cancel-before-execute-siblings-five-line-form-lead-data-draft.md`, read only at main 32041d12; its sha256 from line 5 is 22a20d5770b20a0aca56e8244c1837af0ffe1572feda687b205c58e0671c6b79), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ 32041d12`, and each cite on a line before that line's last marker, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>; 2 such) (36 pins; 12 by a file name that resolves to one tracked path at that commit; 3 bare line numbers bound to the path written before them; 4 bare line numbers the draft leaves unmarked kept as written; 1 remaining markers given the full commit id); this title and lead line added; the draft's preamble above its form heading dropped. Every pin is historical, read before governance piece F moved the forms and the process files: for the code, the piece's base on main is authoritative. Form path: `governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node `engine-cancel-before-execute-siblings` (PLAN.yaml:2714-2730 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:1d5428e657fb91c654923d63955f948b05129e9716637f10163df17d68b56423); filler queue entry 4a (state/FILLER-QUEUE.md:10 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:3d6536e70bd08ad029f4f4d9e8b9845c04cc1dec740d50046adc2495e95afcd5), run under AUTONOMY §36 (AUTONOMY.md:687-693 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:c88b70dfb0c312cb218f078c980820b9f406957bf1b5a4645f994f54a2b92cf6): a five-line form under §21c's size, the reviewer and the architect gating from dispatch, §25 (e) set aside. The sibling list is engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md §0 (fifth bullet) and §2 item 4, from the architect's sibling search (state/consults/2026-09-30-engine-cancel-before-execute-architect-draft.md, item 2). Drafted by lead-data, read at main 32041d1263cf3640dc6697a0201d3b732cb72938. Reuse index: a miss. `node tools/reuse.mjs cancel before execute attach guard` (the custodian's run for this brief, exit 1) reported no prior art.
Scope: engine/src/cancel.rs, engine/src/dataset.rs, engine/src/index.rs, engine/src/rowgroup.rs, engine/src/layout.rs, engine/README.md (6 files); at most 150 changed lines, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/src engine/README.md` at a named commit.
Change: Each of the six other `cancel.attach` sites runs its statement inside `CancelToken::execute_guarded`, mapped back to `Result` by one new crate-private `Guarded::into_result`, so a cancel landing between attach and DuckDB's own interrupt clear is either refused before the statement starts or re-raised while it runs. Before, the statement ran to its end, and the outcome stays `Cancelled` as it was. `IDENTITY_VERIFICATION_SCANS`' increment moves inside the guarded closure, so it still counts only scans that ran. The `is_executing` doc names its new callers, and engine/README.md item 3's blockquote and the owner's-index Cancellation row are brought into line.
Tests+mutation: (T-A) `a_cancellable_open_read_runs_inside_the_execute_window`, a dataset.rs unit test on in-memory DuckDB: the closure given to `cancellable` returns `cancel.is_executing()`, and the test asserts `Ok(true)`. Mutation: `cancellable` calls `run(conn)` outside the guard; it returns `Ok(false)` and the test fails by name. (T-B) `a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`, a dataset.rs unit test on a per-run parquet of 4,000,000 u64 ids written by a DuckDB COPY and removed at the end, calling `admit_identity` on the native `id`: a cfg(test)-only, crate-private helper in cancel.rs spins on `is_executing()` (with a done flag and `TEST_LIVENESS_DEADLINE`, never timing anything) and then cancels. The test asserts that the helper saw the window and that the result is `Err(Cancelled)`. Mutation: `run_identity_scan` runs outside the guard; the window is never seen, admission returns `Ok`, and the test fails by name on that assertion. (T-C) `a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled`, an index.rs unit test on a per-run parquet of 4,000,000 rows (id plus four bbox doubles, DuckDB COPY) calling `SpatialIndex::build_observed` with the same helper and assertions. Mutation: `Self::scan` runs outside the guard; the window is never seen and the test fails by name. Each mutation is observed by applying it, running the named test, recording the failure by name and commit, and reverting (the template's Round 25 additions). Unchanged and green before and after: the tests already in engine/src/cancel.rs; engine/tests/cancel_execute_window.rs; the three callers named in the `identity_verification_scans` doc; kernel/tests/skp_filter_cancellation.rs; kernel/tests/publish_cancellation.rs; kernel/tests/indexed_budgets.rs (no figure re-measured or claimed). Invalidator: if the window is not seen under the fix, the run is invalid rather than a result, and the row count is re-declared by amendment.
Out-of-scope: ADR: not touched (no status, text or amendment; ADR-018 items 1 and 5 govern unchanged). Security: not touched. Wire: not touched (no SKP, MCP or kernel file). Guarantee: touched, which §36 allows by setting §25 (e) aside for a filler. ADR-018 item 1's stopping is extended to six sites, and the G-A1 counter's meaning is kept by moving the increment. The piece claims no time bound (ADR-018 item 5) and no docs/08 figure. It does not change stream.rs, the guard's four steps or the re-interrupter. It adds no dependency and no string a user sees, and the outcome stays `Cancelled`.
```

*The notes and OPEN items below are lead-data's from its draft, carried byte for byte except for the pins; where they say I or my, they mean lead-data's. They are this form's reading.*

## Notes

### The guard being reused
- `execute_guarded` is at engine/src/cancel.rs:181-201 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:6edcd5b3f72f723fffd0087c167ee4a7c69c456607f3b447dcb7a7f40c6eed0e. It runs four steps: set `in_execute`; refuse if already cancelled; run the closure; clear the flag and re-check.
- The re-interrupter is at engine/src/cancel.rs:134-164 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:49f0444a749a86c92bed4f3efb03b498d720c47f3d6198fe66b9ad13e1052932. It is spawned once, on the false-to-true transition, only while `in_execute` is set. It interrupts under the slot mutex while the slot is bound.
- Its proofs are in engine/src/cancel.rs, at the test functions `a_cancel_landing_before_execution_begins_is_re_raised_once_it_has`, `the_re_interrupter_exits_when_the_execute_window_closes` and `a_cancel_after_execution_returns_is_seen_by_the_post_return_check`.
- **What this piece's tests add:** each tested site's statement runs inside that guard in the shipped build. That is the shape T5 established (engine/tests/cancel_execute_window.rs:96-106 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:e5adf78f1c9dba66986be6b46beaed96d6ae9cefb08d3562709abca93e699be4).
- **What they do not add:** a new observation that the work stopped. That rests on the three cancel.rs tests above applying at each site.
- Every site already detaches and checks `is_cancelled()` after its statement. That check stays, so a closure `Err` caused by our own interrupt still ends `Cancelled`.

### The sites, one by one
Each has moved since its 8efc554 pin.

1. **engine/src/dataset.rs:1684 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:ec8d9ce8bd3585a09cfa323c71c81096220b119cf42b844e7e4798126fa36910, `cancellable`** (8efc554 pin: dataset.rs:1332).
   - It serves four open-path reads: engine/src/dataset.rs:1432 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:4b9c9345f4d3e30e3c030c22d7c5b8e64b6f70c8d6635cc7d55cd55101f57be6, :1704, :1734 and engine/src/dataset.rs:1810 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:a981dab8412259b8c5c8cdb1147e5c34db089e76774de675a98cb791d38d8035.
   - The change wraps `run(conn)` at :1685, which covers prepare, execute and fetch, and touches the doc at :1673-1678.
   - What the guard proves here: a read whose cancel is already set no longer runs, and a cancel arriving during the read is re-raised past prepare's and execute's clears.
   - The work is bounded by the footer and by `SANITY_SAMPLE_MAX_ROWS`.
   - Product path: kernel/src/skp.rs:1177 → kernel/src/lib.rs:226 → open. Neither kernel file is edited.
   - T-A is deterministic and needs no file.
2. **engine/src/dataset.rs:2007 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:f8e573a66d680b27d47310f1696aaf6c2aecc8065e22a772fceb8bd891d27504, the identity scan** (8efc554 pin: dataset.rs:1636).
   - This site's work is unbounded by file size, and it runs at open, after the sanity reads (engine/src/dataset.rs:563 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:ee241c0c0e44651c664dc54964cc315ece35ee801bec17d72d210477ca4c9f68).
   - The change wraps `run_identity_scan(conn, &sql)` at :2008.
   - It also moves the `IDENTITY_VERIFICATION_SCANS.fetch_add` at :2003 into the closure. Otherwise a guard refusing at its step 2 would count a read that never happened, against the counter's own doc at engine/src/dataset.rs:58-76 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:ed972bdb420c86d3dfdc4f1f41d38368d4f4530b1cb3445c4fd0033ffdd83e22 and engine/src/dataset.rs:2000-2002 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:a27382cb123bea5c0a11478c56c8284d897b89aa6c6a3d8f35117ddf7cc9ac98.
   - T-B calls `admit_identity` directly, so the identity scan is the only guarded window in view. That avoids any race on the process-wide counter.
3. **engine/src/index.rs:335 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:001b6404ebaf081dcf141630ec0465b74451a8e39fa9795a7e9063da0e98d80e** (8efc554 pin: index.rs:332).
   - The change wraps `Self::scan` at :337; `observe(observer, DuckDbScan)` at :336 stays outside the guard.
   - The work: `query_arrow` materialises up to `MAX_INDEXED_FEATURES` rows (engine/src/index.rs:451-468 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:e266b805a8b6f3c3334801a442cfe697182d7306dd58fb3eaa27d811bb488373).
   - No caller in kernel/src. `Dataset::build_index` (engine/src/dataset.rs:728-801 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:4243047f090206a25592f52668f2b880b1e3cdb8892bb21bb9153e8653bd8f2f) is reached only from kernel/tests/indexed_budgets.rs:883 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:182f40c1c0b19b410ed90b4ea697e2e2348c96d729c5bf985a4b07323edaac15, a cancel ladder that is declared unchanged and measures nothing for this piece.
   - T-C builds its own `CoveringBbox` from the public `FieldPath` fields.
4. **engine/src/rowgroup.rs:344 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:001b6404ebaf081dcf141630ec0465b74451a8e39fa9795a7e9063da0e98d80e** (8efc554 pin: rowgroup.rs:336).
   - The change wraps `Self::read_metadata` at :345, including its own polled reduction loop at :408-414.
   - The work is bounded by the footer, on an experimental seam the planner never reaches. No test (OPEN-1).
5. **engine/src/layout.rs:349 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:f8e573a66d680b27d47310f1696aaf6c2aecc8065e22a772fceb8bd891d27504** (8efc554 pin: layout.rs:345).
   - The change wraps `conn.execute_batch(&copy)` at :350, with the `Query` mapping at :355 moved into the closure.
   - This is the measurement harness only, behind the `fixture` feature. No test (OPEN-1).
6. **engine/src/layout.rs:447 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:f8e573a66d680b27d47310f1696aaf6c2aecc8065e22a772fceb8bd891d27504** (8efc554 pin: layout.rs:438).
   - The change wraps only `stmt.query_arrow([])` at :448; the prepare at :444 comes before attach.
   - The `scanned` map at :452 becomes a plain `?`. Harness only. No test (OPEN-1).

Not changed: engine/src/stream.rs's guarded call (engine/src/stream.rs:1837-1859 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:a5e01948f21dbb621fe2e51697b5bf47e3fc2c68ac490b90bf29c68e48d987d7) and `lease_for_stream` (engine/src/dataset.rs:2170-2177 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:ad22adc7ea7e07662add3788d4d4a2810766906ab476004df3d80b6606fee4fe), the seventh attach site, whose execute is already guarded.

### Risks for the gates
- **No nesting.** One token never runs two windows at once: `attach` refuses a second binding (engine/src/cancel.rs:233-251 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:c32497ad2ba56085669f41f2c872b71701842143cdce2b619cd714a9379e4bc0), and no guarded closure attaches.
- **Prepare inside the window.** At sites 1 to 4 the window spans prepare as well as execute, unlike stream.rs. A re-raise during prepare gives a closure `Err`, which the existing post-detach check turns into `Cancelled`.
- **The test helper.** It is cfg(test) test support, not a product path with only a test caller. The gates should still confirm that reading under the architect's caller rule (`.claude/agents/architect.md:11` at 32041d1263cf3640dc6697a0201d3b732cb72938, sha256 9d0edd65fa280b6d0b2bff4cd08d72b2800529c6f6d39e42909d004bed69d019).
- **Instrument accessor docs.** The `is_executing` doc (engine/src/cancel.rs:203-213 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:15e0d943ff15f0be2c1cdf2fda6a99aee8a03c6f8d1e927e5931eaf3e072b6f3) must name T-B and T-C beside T5, under the instrument-accessor exemption. T-A calls it inside a closure, so it names T-A too.
- **The parent form's cites.** If #270 does not rewrite the code comments that cite engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md (engine/src/cancel.rs:12 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:1a0615ce3bf1c94d3ee4c64e65c0790de9f2e6cba26b61931e95c305cd686b18 and :174, engine/src/stream.rs:1832 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:15c9ed3c7502466d4b557c430ed61bbcaf18b319823eb59d17850f7e06797269), those cites in Scope files go stale. Fixing them is in Scope and costs lines.

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
The gate-1 reviewer's note N4 is at state/consults/gates/2026-09-30-cancel-before-execute-gate1-reviewer.md:85 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:410741a98d14d0770a71e51807e3c4c1d71ca91daf954b6419dae35a79d6e655.
- **The `lease_for_stream` half is already discharged.** The connection-reuse piece's F5 (engine/CONNECTION-REUSE-RECYCLED-INTERRUPT-FLAKE-PREREGISTRATION.md:19 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:510e12f5f4461445f979e77fc1e10f22ab27ed7c23e12b11f2ea1a68771a0ef5) replaced that doc; the current text is engine/src/dataset.rs:2155-2169 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:0a40edb377417eec6e4c4a165d68310da1c2763d2772e2328c396424cec1a6b2. I propose recording it discharged by that reference, with no edit.
- **The README half is still open.** The blockquote at engine/README.md:52-56 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:29b5010fa7d4921211080a7cf2f8d9fc087ccc923da81fd9171472320f6371a4 still calls the producer's check "the only thing"; the paragraph at engine/README.md:58-60 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:d1a49493f985208154950ec77c44cba5076e4ec765000b03b889d758f3e5b4e9 names the guard. That is OPEN-3.

### Paths for rule (00)
- **This piece's paths:** the six Scope files, the form at the proposed governance path, and your PLAN.yaml and FILLER-QUEUE edits.
- **#269:** disjoint (kernel/src/skp.rs, protocol/skp/SKP-V0.md, a kernel form). kernel/src/skp.rs:1177 calls into the open path but is not edited.
- **#270:** probably overlaps engine/README.md, since the owner's index lists engine form paths (engine/README.md:553 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:1a134cf905b7c47d0b3ae41fd76e446efa7e90e8017e9b2f491051e26b38a6ff). It may also overlap engine/src/cancel.rs if it rewrites code cites. I cannot read its branch. Either way the form waits for #270 to merge.
- **`cut/b2-piece-1c-save-and-reopen` and `cut/port-2-macos-l1-and-app-dirs`:** I could not read these branches. You check them at dispatch.

## OPEN items for the human

- **OPEN-1. The three sites with no test** (rowgroup.rs:344, layout.rs:349, layout.rs:447).
  - (a) Route all six through the guard; test the three sites the product reaches or whose work is unbounded; the other three are one-expression changes of the tested shape, claimed as "routed through the guard" only.
  - (b) Only the three tested sites now; a new node for the other three.
  - (c) All six tested. That is about 200 lines or more, over §21c, so it leaves the filler slot for the full form.
  - Recommendation: (a). Two of the three are harness-only and the third's work is bounded by the footer; a spin test on a footer read's short window would be flaky.
- **OPEN-2. The Out-of-scope line.**
  - (a) Dispatch as drafted, "guarantee: touched", with the architect's brief citing §36 setting §25 (e) aside. The architect's checklist otherwise fails by name a five-line piece whose Out-of-scope line names a category (`.claude/agents/architect.md:15` at 32041d1263cf3640dc6697a0201d3b732cb72938, sha256 c9fd9064adbeeb4afbbdd0433bd5eccee6f06698156dc467ead0859291e1e37c).
  - (b) Full form and full gating. The piece leaves the filler queue.
  - Recommendation: (a). "None touched" would be false: §21a names a cancellation guarantee and any property under test (AUTONOMY.md:325-327 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7).
- **OPEN-3. engine/README.md item 3's blockquote** (engine/README.md:52-56 @ 32041d1263cf3640dc6697a0201d3b732cb72938 sha256:29b5010fa7d4921211080a7cf2f8d9fc087ccc923da81fd9171472320f6371a4).
  - (a) Edit the clause in place to say that the producer's check, together with `execute_guarded`'s check before every guarded statement, is what stops a stream cancelled before it started. These words are a draft for the architect's clause check, not the human's wording.
  - (b) Leave the measured blockquote alone and add one sentence to the paragraph at :58-60 naming the six sites.
  - (c) Leave both. The gate-1 architect ruled the blockquote still true.
  - Recommendation: (b). It does not rewrite a "measured while building" record, and it still removes the inconsistency N4 names.
- **OPEN-4. The G-A1 counter.**
  - (a) Move the increment inside the guarded closure, as drafted.
  - (b) Leave it and qualify its doc.
  - Recommendation: (a). It keeps "a read happened" true with no doc change, and the three tests that call the counter run with no cancel.

## The custodian's settlement (class 1, before any code)

- **The human's ruling of 2026-10-30** (`state/directives/2026-10-30-270-readme-r1-r3-d5-open-1-class-1-269-clicked-4a-7a-rulings.md`, line 17), referenced and not restated:
  - **OPEN-1: (a).** All six sites run inside the guard. The three sites with no test are named here in the human's words:
    - the rowgroup.rs site (the Notes' site 4, `engine/src/rowgroup.rs:344` at 32041d12): routed through the guard, cancellation there unobserved;
    - the first layout.rs site (site 5, `engine/src/layout.rs:349` at 32041d12): routed through the guard, cancellation there unobserved;
    - the second layout.rs site (site 6, `engine/src/layout.rs:447` at 32041d12): routed through the guard, cancellation there unobserved.
  - **OPEN-2: (a).** Dispatched as drafted, with `guarantee: touched`; the architect's brief cites AUTONOMY §36 setting §25 (e) aside for a filler.
  - **OPEN-3: (b).** engine/README.md item 3's measured blockquote is left as it is; one sentence naming the six sites is added to the paragraph after it.
  - **OPEN-4: (a).** `IDENTITY_VERIFICATION_SCANS`' increment moves inside the guarded closure, as drafted.
- **The parent form's old path** (the Notes' last risk): governance piece F moved `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` to `governance/forms/engine/`, and the code comments that cite its old path resolve through `governance/MOVED.tsv`, so they are not stale and this piece need not edit them.
- **Rule (00)** was checked at main 2fab14b1 by `git diff --name-only origin/main...<branch>` over the open PRs (none) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`): none touches the six Scope files or this form. It is checked again at dispatch.

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-01 — class 6, the size (written after this piece's tests and mutations were seen)

- `git diff --numstat origin/main...5317510c3f7b06bf647932ae4b3d77bb91fb96e4 -- engine/src engine/README.md` gives 216 changed lines (202 insertions, 14 deletions) over the six Scope files, against §21c's 150 (tests count, by the human's counting note of 2026-09-16). The worker's report is `state/consults/2026-11-01-engine-cancel-before-execute-siblings-worker-report.md`.
- Class 6, the short form's budget class. The short form stays: the reviewer and the architect gate this piece from dispatch (§36), so §21b's mid-piece clause opens no gate it lacks. The precedent is `subagent-write-audit-script`, gate 1, the reviewer's S1-1 (`state/consults/gates/2026-10-03-subagent-write-audit-script-gate1-reviewer.md`).
- The cause, from the report: the test-only helper (about 29 lines) and the two 4,000,000-row tests (about 55 lines each after rustfmt). Nothing was trimmed.

### Amendment 2 — 2026-11-01 — class 1, a reading of Amendment 1 (written after this piece's tests and mutations were seen)

- §36's size condition held at dispatch (the Notes' size estimate, about 115 lines); the overrun is §21b's mid-piece size case (round 5, item 2), which keeps the five-line form, and §25 (e) reads the form a piece is dispatched on, so its set-aside under §36 stands.
- The words are the gate-1 architect's D3 (`state/consults/gates/2026-11-01-engine-cancel-before-execute-siblings-gate1-architect.md`), the custodian's to append, taken as given.

### Amendment 3 — 2026-11-01 — class 2, a deviation recorded after results, with the reason (written after this piece's tests and mutations were seen)

- The Tests+mutation line names three kernel files as unchanged and green before and after. The gate-1 architect's E1 found no run recorded for them.
- `kernel/tests/skp_filter_cancellation.rs` and `kernel/tests/publish_cancellation.rs`: before, main's Product CI Rust push run 41208809578 at 578ec704 (success; `git diff --name-only 578ec704 e3fb936a -- kernel engine Cargo.lock Cargo.toml` is empty, so its tree is this piece's base for those paths); after, PR #273's runs 41257549617 (push) and 41259750415 (pull_request) at 5317510c, whose `cargo test --workspace` jobs on windows-latest and ubuntu-24.04 pass.
- **The deviation:** `kernel/tests/indexed_budgets.rs`'s measurement harness is `#[ignore]` (release only). `cargo test --workspace --locked` compiles the file and runs none of that harness, and this piece ran it neither before nor after. For that file, green is reduced to compiled, in the same runs. A run of its cancel ladder would be a new measurement (the architect's N2), which this piece does not make.
- **The reason:** the cheaper of E1 (b)'s two routes, taken under the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), the cheapest reversible option. The human reviews it on return.

### Amendment 4 — 2026-11-01 — class 6, the size after correction round 1 (written after this piece's tests and mutations were seen)

- Correction round 1 is one commit, 9e32be4c6c0df025e9dfde81179e7e3e2580b112 (engine/README.md +4/-3, engine/src/dataset.rs +6/-5): gate 1's three Documentation fixes, the replacement words taken by script from the two filed reports. The worker's report is `state/consults/2026-11-01-engine-cancel-before-execute-siblings-correction-1-worker-report.md`.
- `git diff --numstat origin/main...9e32be4c6c0df025e9dfde81179e7e3e2580b112 -- engine/src engine/README.md` gives 228 changed lines (209 insertions, 19 deletions) over the six Scope files, against §21c's 150. Amendment 1 recorded 216 at 5317510c.
- Class 6, the short form's budget class, read as Amendment 2 reads Amendment 1: the short form stays, with the reviewer and the architect from dispatch (§36).

### Amendment 5 — 2026-11-01 — class 2, Amendment 3's before (written after this piece's tests and mutations were seen)

- `git diff --name-only 578ec704 e3fb936a -- kernel engine renderer protocol/data-plane protocol/skp Cargo.toml Cargo.lock .github/workflows/product-ci-rust.yml` is empty (rc 0), which covers every path in product-ci-rust.yml's filter that the kernel's dependencies (kernel/Cargo.toml, `[dependencies]`) read; run 41208809578 is the before for both kernel files.
- The words are the gate-2 architect's E1-r (`state/consults/gates/2026-11-01-engine-cancel-before-execute-siblings-gate2-architect.md`), the custodian's to append, taken as given; the custodian ran the command before appending this row.

### Amendment 6 — 2026-11-01 — class 3, a correction to Amendment 1 (written after this piece's tests and mutations were seen)

- Amendment 1 cites the counting rule by date; its reference is round 5, item 2 (governance/AUTONOMY.md §21c, the human's one-line note).
- The words are the gate-2 architect's D-a (the same report), the custodian's to append, taken as given.
