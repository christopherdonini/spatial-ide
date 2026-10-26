# engine/tests/slice.rs: the traced cancellation test reads only its own stamps — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node slice-traced-test-cross-stamping, the filler queue's entry 6c (S3). The five lines and the notes are the architect's draft (`state/consults/2026-10-26-slice-traced-test-cross-stamping-five-line-form-architect-draft.md`, read only at main dcd85569; its sha256 from line 5 is 171b35c04d592cb473f9668a076e671f4aeba8581762fb38d22c538cf1c270ac), with two changes, both the custodian's: each cite at dcd85569 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>`, a cite naming several places under one commit written as one pin each, and a cite by a bare file name written with that file's one tracked path (68 pins; 26 by a bare name; the draft reads every cite at dcd85569, so the 25 written without that marker are pinned at it too); and the settlement below. Line numbers written with no file name in the notes (`:802-807` and the like) name lines of the file the sentence names, at dcd85569; they are not pinned. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Form path: `engine/SLICE-TRACED-TEST-CROSS-STAMPING-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer and the architect, from dispatch (§36).*

```
Authority: PLAN node `slice-traced-test-cross-stamping` (PLAN.yaml:4489-4505 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ccced65f6e64e36e014c71724453bb900f0d4bea7933562aa8470964467d7ea9), generation 2; filler queue entry 6c, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:14 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:a7fd3b3f0272cefda40d6ae51db2a9dc4a2ee2a36d7dd7fc1b0a0124adefb3b2; state/FILLER-QUEUE.md:15 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:7f7dda5d0bd3f90af5f1cfb47d4a3c03fbd7ab83b66cd4a6cc1ecd426cd8b30c), running in the filler slot by the human's message of 2026-10-26, item 1 (state/directives/2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md:10 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:599d2000ace8e252767a3488cc6f4d78eeb9f1fce39c21ac739c261febb5b853); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; proposed by the human's rulings of 2026-10-09, item 6 (state/directives/2026-10-09-rulings-on-the-eight-forms.md:52 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:51388350a22b2ddb388e58ba21d2d420a967d5987c91a86b7c33c9c7a1d9f19b), as the sibling site at kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md §0.7 (its Amendment 1, item 2), with the human's note of 2026-10-10, item 3 (state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:9 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:e744379d7b44a1389f3e55ef44b9aa367a367fc65640fa6640c79d14f63abf45); the budget assertion is kept as round 53 orders (state/directives/2026-10-04-round-53-open-1-ruling.md:6-7 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ebf502fb79d55138fb81ab3de5077abd527b4714ac67a452ba76eb0ff3df9bf7); the reuse index found no prior art on either search (trace test lock; test serialisation), a miss noted here.
Scope: 1 file, engine/tests/slice.rs: one file-local `static TRACE_LOCK: std::sync::RwLock<()>` with `fn exclusive()`, `fn shared()` and `fn quiesce(ds: &Dataset)` and their docs, placed after `impl Drop for Watchdog` and above `fn small()`; one new first statement in each of the eleven tests the next line but one names; one `quiesce(&ds);` (after `drop(s);` where `s` is still live) at the end of the five it names; declared line budget 100 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no assertion, message, test name, fixture, constant, watchdog or other test changes, and no other file changes.
Change: while `cancelling_mid_stream_stops_production_promptly` holds its trace, no other test in the slice binary can stamp `cancellation_requested` or `producer_cancelled` into it: that test takes `exclusive()` as its first statement, and every test whose stream reaches a producer takes `shared()` as its first statement and, if it drops a stream that has not ended, waits in `quiesce` until its dataset holds no lease, so the budget reading pairs only the test's own two stamps.
Tests+mutation: no new test; changed by one first statement each: cancelling_mid_stream_stops_production_promptly (`exclusive()`) and, taking `shared()`, streaming_the_whole_file_returns_every_feature_with_bit_identical_coordinates, the_payload_is_variable_width_geoarrow_with_holes, a_viewport_filter_selects_a_subset_and_every_selected_feature_intersects_it, a_viewport_cannot_name_a_definition_only_crs_because_that_identifier_names_nothing, a_viewport_without_a_covering_bbox_column_is_refused_not_silently_scanned, every_batch_carries_the_envelope_not_just_the_first, cancelling_before_the_first_batch_stops_the_stream_without_producing_anything, dropping_the_stream_cancels_the_query, a_paused_consumer_bounds_producer_resident_memory and the_first_batch_is_handed_over_before_the_result_is_materialized, of which the_payload_is_variable_width_geoarrow_with_holes, a_viewport_cannot_name_a_definition_only_crs_because_that_identifier_names_nothing, a_viewport_without_a_covering_bbox_column_is_refused_not_silently_scanned, dropping_the_stream_cancels_the_query and a_paused_consumer_bounds_producer_resident_memory also end with `quiesce(&ds)`; M-1: in `exclusive()`, after the lock is taken, insert `std::mem::forget(trace::start(trace::TraceKey::default()));`, predicted to fail cancelling_mid_stream_stops_production_promptly, run alone, by name at its start's expect (`no other trace is running`); M-2: in `shared()`, after the lock is taken, insert `panic!("M-2: shared() reached");`, predicted to fail exactly the ten shared tests by name with that message, in a run of the whole binary; M-3: in `quiesce`'s assertion, replace its left side with `ds.connections().active_leases() + 1`, predicted to fail exactly the five quiescing tests by name with quiesce's message, in a run of the whole binary; each is observed in a debug build on the branch's code commit, recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` doc line, and reverted; a verify-mutation run is not an observation; a mutation that passes, fails a test outside its predicted set, or fails anywhere else, is a stop.
Out-of-scope: ADR: no status line or amendment (ADR-010 rule 6's one-traced-stream limit and ADR-018's scored pair are read, not changed); security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no literal, code or message text; guarantee: none changed, "touched" read as changed as settled for governance-hash-grammar-shared: the traced test re-asserts a property under test (docs/08's cancel_requested → cancel_observed budget on the producer's clock, ADR-018), and its assertion, message, bound and pair keep their text, as round 53 orders; the lock narrows what a pass can rest on to the test's own two stamps, a property-under-test contact disclosed here, and no figure is re-taken; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs trace test lock
No prior art recorded for "trace test lock". Research it before planning an implementation.
$ node tools/reuse.mjs test serialisation
No prior art recorded for "test serialisation". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine or my, they mean the architect's. They are this form's reading.*

## Notes

### 1. What crosses into the traced test

**The site.**
- The traced test is engine/tests/slice.rs:756 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:babe60488fb32116cb092603b15193cbda7cdecc4ea924f5f5ab09132a3a55da. It starts the trace at :776-782 and expects `no other trace is running`. It cancels at :791, reads the events at :799 and drops the guard at :800.
- It takes the first event by name from the sorted list (:802-807). The two instants are read at :808-809.
- docs/08's assertion is at engine/tests/slice.rs:811-818 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:f74d57a382588018d404af1bb09172b515bb1c6cb5e6dee3fc0db11d2c71d62c: `observed.saturating_sub(requested)` must be under 100 ms. The budget is docs/08_Testing.md:8 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:1185356552cbb402306f649f0c38dd4f85c109e86a2a64b34c12009d3e6ea558.
- It is the only test in the binary that starts a trace (search for `trace::start` in the file: :776 only). So its start is never refused by another test here. Unlike in 6b, an overlap cannot fail loudly at `expect`; it can only change the reading.

**The facility.**
- One flag (engine/src/trace.rs:88 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ca4aedce41edc82d7097afb1299c606270ec8d2b31fa6a6f78dcdef58991afd7) and one slot (:98).
- `mark` records from any thread while the flag is on (:302-307, :312-316).
- An event carries a name, an offset, rows and bytes, with no stream identity (:100-111, and :113-118 says this is deliberate).
- `events()` sorts by offset (:189-197).
- `TEST_LOCK` is `#[cfg(test)]` and `pub(crate)` (:554-560), so it is not visible to an integration test. A file-local lock is needed.

**Who stamps the two names.**
- `cancellation_requested` is stamped only by `CancelToken::cancel`, once, on the false→true transition (engine/src/cancel.rs:96-98 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:6ba8b0cb06e100673a4bee0b95299feba256041e57f78f0b2ae8d661e33f72aa, engine/src/cancel.rs:120-124 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91). A drop cancels without stamping (engine/src/cancel.rs:113-115 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:855021fc659e24c2e4fc2ec4d8cd3d6e30a6d130110080aefd72bd7b3e102e1f; engine/src/stream.rs:898-908 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:59e6fb89cc203213ddb0853675f55cda4ef24770e83d455f60b53a4c473196bb). The only other caller in this binary is engine/tests/slice.rs:722 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:2fc1073f69499eff9f2799403883afb872b8dada4d0011bcf0eb0baa72725cde (cancelling_before_the_first_batch…).
- `producer_cancelled` is stamped inside `produce` and `flush` whenever the producer finds its token cancelled: engine/src/stream.rs:1795 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ba3549c307a1a262817a4bbce250a3bff4380c34de53481912524275b2ecb9a1, engine/src/stream.rs:1845 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:8ac02869fab50b25d1f4c05948f16185ff40348482a25af86625d7b525848eae, engine/src/stream.rs:1854 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:14fc7508519b01ceabcf2056b37323919257a07074ed60c54253912880c15aa6, engine/src/stream.rs:1901 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:8ac02869fab50b25d1f4c05948f16185ff40348482a25af86625d7b525848eae, engine/src/stream.rs:1934 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:59163e527cabf2148b4ba8c2859eae359fdb69bee172455b4c8eee547b7ec229, engine/src/stream.rs:2001 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:14fc7508519b01ceabcf2056b37323919257a07074ed60c54253912880c15aa6, engine/src/stream.rs:2558 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ba3549c307a1a262817a4bbce250a3bff4380c34de53481912524275b2ecb9a1. A dropped stream's token is cancelled (:906). So any test that drops a stream while its producer is still running can stamp it.
- The producer is spawned at `stream()` time (engine/src/stream.rs:1265-1268 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:9fe4d1b1181c1bdb9e5705d4f70830460e9ea001a1bd6dd5db3a882e9d6c0320) and is never joined: the handle is discarded by `?;` at :1410. So a producer can outlive its stream and its test's body.
- Search for `mark(` in engine/src: only stream.rs, cancel.rs and trace.rs. `Dataset::open` and the fixture writer stamp nothing.

**The tests, one by one** (fn lines in engine/tests/slice.rs):

| Test | Stream reaches a producer? | Leaves a live producer? | This piece |
|---|---|---|---|
| admission tests :184-435 | no stream | — | none |
| streaming_the_whole_file… :442 | yes (:449) | no, drained to None | shared |
| the_payload… :466 | yes (:483) | yes, one batch read, `s` dropped at the end | shared + drop + quiesce |
| a_viewport_filter… :528 | yes (:546-548) | no, drained | shared |
| a_viewport_in_another_crs… :559 | no: refused at engine/src/stream.rs:1212-1219 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:dd947bdbfc91b50105c410b690e9b71408c7525249ec1961af11297259096741, before `build_sql` (:1222) and `SQL_BUILT` (:1227) | — | none |
| a_viewport_cannot_name… :580 | first refused at engine/src/stream.rs:1209-1210 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:99c45822a2cd25a9db953a5dd5dab405ec867129d5f19015eca6bde2eb38a42e; second admitted (:609-616) | yes, a temporary dropped at once | shared + quiesce |
| a_viewport_without_a_covering… :620 | first refused in `build_sql` (engine/src/stream.rs:1492 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ab6c938354fe623d9ad30f221c42a5e6d66297539423a8a3dd4cc232a9286c93); second admitted (:642) | yes, a temporary dropped at once | shared + quiesce |
| every_batch_carries… :646 | yes (:656) | no, looped to None | shared |
| cancelling_before_the_first_batch… :689 | yes (:717-719) and cancels (:722) | no: `next_into` returned after `produce` did (the Err send is at engine/src/stream.rs:1374 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:019a4a5e72b36cfdd0fc464f466f3007425f7f462633c54a0dfb097ef968e0cf, after the lease decision) | shared |
| cancelling_mid_stream… :756 | the traced test | — | exclusive |
| dropping_the_stream… :845 | yes (:857) | yes, dropped in the block :856-860 | shared + quiesce |
| a_paused_consumer… :868 | yes (:880) | yes, the producer blocked on send at the end | shared + drop + quiesce |
| the_first_batch… :917 | yes (:937) | no, drained (:947) | shared |
| h6 :981, arrow version :1055 | no stream | — | none |

A drained stream ends at None only when the sender drops at the end of the producer closure, which comes after every mark (engine/src/stream.rs:1399 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:4abebc82b5f656b4052de712e9396f8f8571cde397a88c70a64240f7aaad7d22).

**What a foreign stamp does to the reading.** `at` picks the earliest stamp of each name:
- A foreign `cancellation_requested` earlier than the test's own makes the interval longer: a false failure.
- A foreign `producer_cancelled` earlier than the test's own observation makes it shorter, or 0 through `saturating_sub` if it lands before the request: a false pass.
- A foreign `producer_cancelled` also satisfies :809's expect when the test's own is missing. That is the exact failure the flake hunt found, and a foreign stamp would have hidden it.

**Observed?** No.
- The human's note (state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:9 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:e744379d7b44a1389f3e55ef44b9aa367a367fc65640fa6640c79d14f63abf45) records that the flake hunt's failures were a missing event, with nothing dropped.
- That missing exit is now marked (engine/src/stream.rs:2555-2558 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:72702ab1303681cb580d0241eff38afc2ca6d4803a096a2f3087e2c5c350f89d).
- The custodian's check (state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:55-57 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:7215627ac8745d6fe6053c7ffab59c9ba938dc117a895f58afdb7c99e489a966) records four `events=11` runs with the extra event unnamed. That fits this mechanism but does not show it.
- This piece rests on the code reading above.

### 2. The fix

**OPEN-1 (A), my recommendation: an RwLock.** `exclusive()` takes the write guard and `shared()` takes a read guard. The writer excludes the ten stamping tests, and those ten still run beside each other. Five of them quiesce.

**The lock order argument.**
- The traced test is granted the write guard only when no read guard is held.
- Each reader's body has then ended. Its producer has either finished (drained, or the cancel test) or released its lease (quiesced).
- Every `producer_cancelled` site is inside `produce`/`flush`, before the lease is decided at engine/src/stream.rs:1306-1309 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:49158d66ff8f60d0a6c782b0c230a99b42b939e50b09a1660f7a8f61073297cb. The pool's count goes down under the pool mutex that `quiesce` reads (engine/src/pool.rs:494-497 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:141c81fcaccf6b017df6eb55a7279ef28bd1c9d593a1a577b6bd8c7349a39403, engine/src/pool.rs:589-596 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:6180d00fe7c7cfbeb9646f52f645b09b09d1eff1bbf9dd2048e8f7edcb0900cb). So no stamp of either name can follow.
- No `cancel()` runs outside a body.
- Until the traced test's body ends, no reader starts.

**Drop order.**
- `_serial` is declared first, so it drops last.
- If the traced test panics before :800, the `TraceGuard` unwinds before the lock and clears the flag (engine/src/trace.rs:353-358 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:30150ef28e04c7da7d4a8fc24b6b2bf00c0d18dce65b4bb2a8fe31ef6ff3143a).
- A write-guard panic poisons the lock; `unwrap_or_else(|e| e.into_inner())` recovers it, as in the sibling's `serial()`. A read-guard panic does not poison.
- The lock comes before `Watchdog::new`, so the watchdog bounds the body only. A holder that hangs is aborted by its own watchdog (:76-109), so a waiter cannot wait forever.

**`quiesce`** is the shape of kernel/tests/trace_spans.rs:163-175 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:0938df04b06c64165624b5fd2ea04c739e7510f80c6275218a3b12efbbc23d1d: wait for `ds.connections().active_leases() == 0`, then assert it, in a 10 s window.

**Seams consumed, all read:**
- `trace::start`, `TraceGuard`, `TraceKey: Default` (engine/src/trace.rs:119 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:02de1c5a21cee24f1f5db6bb9967b56e12cb0cd4c0a8ddb4a2873884217be36c, :329-339);
- `CancelToken::cancel`;
- `Dataset::connections` (engine/src/dataset.rs:704-706 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:f2e893ddc865256199e11cfe18d37d9c43b0fb73d6836c62408428670f17158e);
- `ConnectionPool::active_leases` (engine/src/pool.rs:494-497 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:141c81fcaccf6b017df6eb55a7279ef28bd1c9d593a1a577b6bd8c7349a39403).

No `pub` item is added and no interface is invented.

**What the lock does not cover:**
- a quiesced producer's later marks: the post-check pair (engine/src/stream.rs:1344 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:819eb25701c13a609add637441f27a3510dad03a1bdc2bd9df1f79874810dad4, :1347) and `producer_finished` (:1399). The test reads neither.
- the test's own flag-before-stamp window: engine/src/cancel.rs:121 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:c94d9319712d5acc497467263e7867a27b2a8a262b43c0d1aed65ce14e324d08 sets the flag before :123 stamps, so its own producer can stamp first and `saturating_sub` reads 0. That is not cross-stamping, and it is out of scope.
- the remaining unmarked exits. Those are filler entry 4b's (`stream-cancel-returns-left-unmarked`).

### 3. docs/08 and recorded figures

- No docs/08 figure rests on this test. It is a CI pass/fail check against the declared number.
- The docs/08:8 figures of record come from the kernel harnesses (the test's own comment, engine/tests/slice.rs:704-706 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:b5e6fed8363bc8f4aeae7ace69704fd11b8a0514ec8be8d23b11c9c90638b9ee; docs/08_Testing.md:13-21 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:2f4b25f8f53d7da1c196295e6935553f6e30cd6766172ab7ab06133d3f13f1de).
- Phase R's R-5 to R-7 values were reports, not measurements (kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:223 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:a82b94ce6787eba8253efc6ce2b9718d442c6d37f84b558fbfc17309cd53fe21).
- The change cannot move a recorded figure. It can change a CI outcome only in a run where a foreign stamp would have entered, in either direction.
- It also removes the ten streaming tests' load from the traced test's window. The admission and h6 tests still run beside it.
- No figure and no direction of effect is claimed. Round 53's re-run practice stands.

### 4. Tests, mutations, observation

**What the mutations prove.** They are deterministic and show that each call is on each declared path:
- M-1: the exclusive call precedes the start, and the refusal is kept.
- M-2: exactly the ten tests take `shared()`, and the traced test does not.
- M-3: exactly the five tests reach quiesce's assertion.

**What the exclusion rests on.** Section 2's argument, plus the trace_spans precedent for how much `quiesce` can detect. As in the siblings, the race itself is not forced.

**The route:**
1. On the branch's code commit, run `cargo test -p spatial-engine --test slice` unmutated; all tests pass.
2. M-1: `cargo test -p spatial-engine --test slice -- --exact cancelling_mid_stream_stops_production_promptly`.
3. M-2 and M-3: the whole binary.
4. After each mutation, revert it and confirm the file matches the code commit.

These are debug builds, run in a shared hold. CI on both platforms follows.

**Stops:**
- an unmutated failure. A failure at the budget assertion follows round 53: the failing log is filed, the test is re-run once alone, and both run ids are recorded. It is not counted as a stop until the custodian has the re-run.
- a mutation outside its predicted set;
- a file outside Scope must change.

**May not claim:**
- that cross-stamping was observed;
- any rate;
- that the trace holds only this test's events;
- any timing;
- that the flake hunt's failures had this cause.

### 5. Size (AUTONOMY.md:349-357 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159)

- My estimate is about 70 changed lines in 1 file:
  - W1 and two RECORDED MUTATION lines, about 18;
  - the static and two fns, about 8;
  - quiesce with W2 and its RECORDED line, about 19;
  - blank lines, about 3;
  - eleven first statements;
  - seven quiesce or drop lines.
- The declared budget is 100, under §21c's 150 lines and 8 files.
- No dependency, no exposure surface, no user-visible behaviour.
- An overrun is class 6 (AUTONOMY.md:345 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3), with the Scope line unedited.
- The node's budget is 60 min (PLAN.yaml:4499 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:f988b7c1060276244c8c7488cf667f254cfaa5215e279ddf06d7127bf0829f3e). That is plausible for one debug build and four runs, but it is not measured.

### 6. Out-of-scope readings

- **ADR, security, wire:** none touched.
- **Guarantee:** this follows the settled reading, "touched" means changed (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:409f44fb055bb53fc13bf4c1160cefdcaf7048472a76a84f512cbd94ece5e113). Unlike 6b, the lock here does decide what a pass proves, which is the wire-bytes §0.11 shape (kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:82 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:9bed933ecc09696e2e176170e7f01c26171675436e35d8ce5709ae651dcb0595). The line therefore discloses the property-under-test contact (AUTONOMY.md:325-327 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7) rather than asserting there is none.
- §36 sets §25(e) aside (AUTONOMY.md:482 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669, AUTONOMY.md:692 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84), so the five-line form stands.
- No red-line text and no P6 string.
- Round 53's assertion keeps its text, so I do not read this piece as reopening round 53. If the custodian reads the change of load in the window as altering the assertion, that becomes the human's question.
- No KNOWN-LIMITATIONS item and no README line is owed: the piece is test only, and #241 holds engine/README.md.

### 7. Rule (00)

This piece's paths are engine/tests/slice.rs and the form on main.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none |
| port-2 | none. Contact only: engine/src/lib.rs re-exports what slice.rs imports. |
| 6b (held, out of the slot) | none |
| #252 | none. Contact: engine/src/dataset.rs holds `Dataset::connections`; if #252 merges first, the worker re-reads it at its base. |
| #249, #244 | none |
| #241 | none. Contact: engine/src/fixture.rs supplies `write_geoparquet`, `FixtureSpec` and the constants slice.rs uses. |

Nothing is under protocol/. The path lists are the brief's; I cannot read branches.

### 8. Doc words

These are not the human's wording; they are doc comments. The worker applies them as written, wrapped at 100 columns. Neither carries a path:line.

**W1**, above the static:

> /// **The trace is process-global, and one test here reads two of its stamps.**
> ///
> /// While a trace runs, `spatial_engine::trace` records the `mark` of every thread in this process,
> /// and an event names no stream. `cancelling_mid_stream_stops_production_promptly` reads the first
> /// `cancellation_requested` and the first `producer_cancelled` in its trace and asserts docs/08's
> /// cancellation budget on the interval between them. Another test here that cancels a token can
> /// stamp the first, and a producer that finds its stream cancelled, a dropped stream included, can
> /// stamp the second; either, landing in that trace, could stand in for the test's own. So that
> /// test takes `exclusive()` as its first statement, and every test here whose stream reaches a
> /// producer takes `shared()` as its first statement; each holds its guard to the end of its body,
> /// and the shared tests still run beside each other. A producer is never joined and can outlive its
> /// stream, so a shared test that drops a stream before the stream has ended calls `quiesce` before
> /// its body ends. Tests that open no stream, or whose only stream is refused before it is built,
> /// stamp nothing and take neither. A quiesced producer can still stamp the post-check pair and
> /// `producer_finished` after its lease is released; the test reads neither name.
> ///
> /// RECORDED MUTATION: <M-1: the insertion; the test's name and message; the 40-hex commit>
> /// RECORDED MUTATION: <M-2: the insertion; the ten names and the message; the 40-hex commit>

Each clause checked against the code at dcd85569:
- "records the mark of every thread … names no stream": engine/src/trace.rs:302-316 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:02b08c6ab9f18bf14471e9fa8087d2010c3cf03bdc1472809675f5b6a1eb1fc7 and :100-111. Holds.
- "reads the first … and asserts … budget": engine/tests/slice.rs:802-818 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:c15308df9c75a4cca4e0764538a1cdb0a8d138be52ae0799c3c38d83eaf01da1. Holds.
- "cancels a token can stamp the first": engine/src/cancel.rs:120-124 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91; engine/tests/slice.rs:722 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:2fc1073f69499eff9f2799403883afb872b8dada4d0011bcf0eb0baa72725cde. Holds, and it says "can".
- "a producer that finds its stream cancelled, a dropped stream included, can stamp the second": engine/src/stream.rs:906 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:439b92ce65db94964c621ee26623012d107634faa1dba25afbe3cc707f70f7b1 plus the sites listed in note 1. Holds.
- "could stand in for the test's own": engine/src/trace.rs:189-197 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:720c3c289c8d1bb168886aec9b9040c7557c91ad1196fcf7e46888386f554d41 and engine/tests/slice.rs:802-807 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:412be518bca717e5898b933261b2c60cebd053a13d19e1980fa91860bfa76f5b. Holds.
- "exclusive … shared … to the end of its body": this is what the change makes true; the gate checks the eleven tests.
- "still run beside each other": std's RwLock admits several readers. This is a library claim, read at the toolchain.
- "never joined and can outlive its stream": engine/src/stream.rs:1265-1268 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:9fe4d1b1181c1bdb9e5705d4f70830460e9ea001a1bd6dd5db3a882e9d6c0320, :1410 and :898-908. Holds.
- "refused before it is built, stamp nothing": engine/src/stream.rs:1179-1220 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:466d01dffd731ee174424395f676d3705ea1f3c5858e9097c116af13accb48de and :1492, ahead of :1227; Dataset::open has no mark. Holds.
- "post-check pair and producer_finished after its lease is released": engine/src/stream.rs:1306-1309 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:49158d66ff8f60d0a6c782b0c230a99b42b939e50b09a1660f7a8f61073297cb, :1344, :1347, :1399. Holds.

**W2**, above `quiesce`:

> /// Wait until this dataset holds no lease, before a shared test's guard is released.
> ///
> /// A producer stamps `producer_cancelled` inside `produce`, before it gives its lease up, so a
> /// dataset with no active lease has no producer left that can stamp it. Bounded at ten seconds and
> /// loud on a miss, in the shape of the kernel's trace-span suite.
> ///
> /// RECORDED MUTATION: <M-3: the replacement; the five names and the message; the 40-hex commit>

Each clause checked against the code at dcd85569:
- "inside produce, before it gives its lease up": the sites in note 1 are in `produce`/`flush`, and the lease is decided at engine/src/stream.rs:1306-1309 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:49158d66ff8f60d0a6c782b0c230a99b42b939e50b09a1660f7a8f61073297cb. Holds.
- "no active lease … no producer left": engine/src/pool.rs:494-497 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:141c81fcaccf6b017df6eb55a7279ef28bd1c9d593a1a577b6bd8c7349a39403 and :589-596. Holds.
- "ten seconds … kernel's trace-span suite": kernel/tests/trace_spans.rs:163-175 @ dcd85569054a04f6d0135f686b8f55d4a9eba5d4 sha256:0938df04b06c64165624b5fd2ea04c739e7510f80c6275218a3b12efbbc23d1d. Holds once the change sets the window.

---

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A).** The file-local RwLock: the traced test takes the write guard, the ten tests whose streams reach a producer take a read guard, and the five that drop a stream before it ends quiesce.
- **OPEN-2: (A).** No evidence beyond the three mutations: one unmutated local run of the binary, then CI on both platforms.
- **The machine rules.** Every build and run is a heavy command in a shared hold. A miss at the budget assertion in a shared hold follows round 53 as the notes' section 4 says: the failing log is filed, the custodian re-runs the test once alone, and the piece stops until that re-run; it is not recorded as a failure before then.
- **A cargo target of its own.** The worktree's runs take a cargo target folder no other tree uses, so that no run reuses another tree's build (the lesson of entries 6a and 6b).
- **Rule (00)** was checked again at main dcd85569 by `git diff --name-only origin/main...<branch>` for every open branch and the branches in flight: none touches `engine/tests/slice.rs`, and none touches `protocol/`.

## Amendments (opens empty; append-only)
