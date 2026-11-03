# engine: `classify` stamps `PRODUCER_CANCELLED` on every `Cancelled` it returns — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node stream-cancel-returns-left-unmarked, the filler queue's entry 4b (S3). The reading of the guarantee categories, the five lines, the notes, the OPEN items and what was not settled are lead-data's draft (`state/consults/2026-11-03-stream-cancel-returns-left-unmarked-five-line-form-lead-data-draft.md`, read only at main ab9b52ab; its sha256 from line 5 is 42e51c19a40e00b4c6bc0ac73a2b3ca54d619003710fac509008538778f1aece), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ ab9b52ab`, and each cite listed before it in the same list, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>`, a bare line number written out with its path (a dot path as `path:line` at <commit>, sha256 <hex>; 1 such) (55 pins; 1 by a file name that resolves to one tracked path at that commit; 20 lists whose first cite is a bare line number, each given the path its context names by the custodian's table in the filing script, read against the file; 1 written `ADR-018` given the ADR's path); 2 remaining markers given the full commit id; this title and lead line added; the draft's opening lines above its first section, and its Option (B), the outline of the full form, dropped (both stay in the filed draft). Text not marked as byte-copied is lead-data's own words; where it says I or my, it means lead-data. Form path: `governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## Item 1: the guarantee categories (settled first)

- **Existing tests' asserted figures: none changes.**
  - T-2 (`the_pre_prepare_cancel_exit_stamps_producer_cancelled`, engine/src/stream.rs:3227-3271 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:5fca441ad23186cf17c6790bddfedc5fab7a8f676731c0d2b8d5ace69b0111a4) keeps its three assertions.
  - Its M-2 (delete the pre-prepare check's mark, flush form §4, governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:193-197 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:2921ce4589113f976116dc4a89c55bec3421de3573087cbeaa4b0664ad72b946) still fails it. M-2 keeps the check's `return` (engine/src/stream.rs:1794-1797 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:2c824571b08ab4ef32be6770f3126556e5c6fd7fcf62cc0e4b848f96f238f3b9), so `prepare` and `classify` are never reached.
  - What becomes false is the reason T-2's doc gives (engine/src/stream.rs:3227-3230 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:a4159c40f6f796258ae4577b97011ef052b3da7db88da186e600b8e23a47ffa0). With `classify` marking, deleting the whole check would no longer be caught with invalid SQL. That was never a recorded mutation. The doc's own instruction to revisit it is met by revising the doc (OPEN-3).
  - The two `classify` unit tests (engine/src/stream.rs:2743-2776 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:a3a82cbfecdbadc54e4ec0dc07cc156a177a6d00a58fcccf4122306377931ee4 and engine/src/stream.rs:2803-2863 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:c5743009c3345b0e51d640676f28885f8e185fcfe0c54f00b8b6683dddffb7f3) keep their assertions. They gain `TEST_LOCK` (OPEN-4).
- **The Out-of-scope line would name Guarantee as touched.** It cannot truthfully assert none of the four.
  - The piece adds ADR-018's `cancel_observed` instant (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:ee8ca11cf4c5ed0ff2a728f8e5cb0c4e20df9d567c97fa47c7942f6aa7d0f5c9; producer side `PRODUCER_CANCELLED`, engine/src/trace.rs:380-384 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:2f15e44a3595aa1a42cfe46d2c7c9063410a2419875de81a933b73c04a46aacf, engine/src/trace.rs:441 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:ac4e388380d42b0930e6a3a65fb9561c59f3ebd8adb24f1e9a31ebbb6a999b19) to two more `Cancelled` returns.
  - It also moves two existing stamps into `classify`. Both stamps carry a property under test: kernel/tests/skp_filter_cancellation.rs expects them (flush form §2.4, governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:142-146 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:57b69a0393c8aa7d1609d0be624d5a7488244515fda3d330ddd18934faed1155). §21a names a cancellation guarantee (ADR-018) and any property under test (governance/AUTONOMY.md:325-327 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7).
- **So, read alone, line 176 closes the five-line form** (docs/PREREGISTRATION-TEMPLATE.md:176 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917; AUTONOMY §25 (e), governance/AUTONOMY.md:482 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
- **But §36 sets §25 (e) aside for a filler** (governance/AUTONOMY.md:692 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84), and line 176 restates the same round-25 item 2 (e). The human ruled exactly this shape for entry 4a: its OPEN-2 (a) ("Guarantee: touched, which §36 allows", governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md:10 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:9fe3e4c0855cc24cb9fac6c67158380bc9e263e2f7438b98ff1078243e5d500a and governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md:114 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:d707f9f1178f6e2e9063b6635663a1d4ad8656557bba268604671db34a834475). The architect fails by name a five-line form whose Out-of-scope line names a category (`.claude/agents/architect.md:15` at ab9b52abf15e17693133d395330657e9840a5663, sha256 5ae312f90be5138059fab8917f6a80c88920feac989253e3fba7e0e7e8d926de), so the architect's brief must cite §36, as 4a's did.
- **The route is therefore OPEN-1.** I recommend (A), the five-line form below, which matches the placement as the human ruled it (governance/PLAN.yaml:4948 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:0e268bfc4336ab770e894855bbe6899aa892b1c27bb218617e0d35a83e797b30). The outline of the full form, option (B), follows it.

## Option (A): the five lines (the draft)

Form path: `governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md`.

```
Authority: PLAN node `stream-cancel-returns-left-unmarked` (governance/PLAN.yaml:4933-4949 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:dd61dc23a2b1fce7ca5456bb4bdff76bb310239bf3c5cd1220c2c024cc16bcc9); filler queue entry 4b (state/FILLER-QUEUE.md:11 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:92c60bc77d31b9cf0b96df93a96fdeb79a2ff57fb4ceeab9607b38879a352930), run under AUTONOMY §36 (governance/AUTONOMY.md:687-696 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:55e91962a3ccb7ffd9a2f8d14709f233628e38da33909874f939732ed9c2ea60): a five-line form under §21c's size, the reviewer and the architect gating from dispatch, §25 (e) set aside. Its rows are the custodian's list (state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:e909483f580dee5645d4dc2c007952a917b7d9aaea203ad7837e53b4f73b73c9), as the flush piece's form leaves them out of scope (governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:115-123 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:f32c799d45ef45f5134f8c046c2316dd908835e650fd4713e342d5e99c2835b5). Drafted by lead-data, read at main ab9b52abf15e17693133d395330657e9840a5663. Reuse index: a miss. `node tools/reuse.mjs cancel classify unmarked` and `node tools/reuse.mjs receiver disconnected cancel observation` (the custodian's runs for this brief, exit 1 each) reported no prior art.
Scope: engine/src/stream.rs, engine/README.md (2 files); at most 150 changed lines, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/src/stream.rs engine/README.md` at a named commit.
Change: `classify` stamps `PRODUCER_CANCELLED` when its one read of the token returns `Cancelled`, and the separate reads that marked before it at the execute-`Err` and fetch-panic exits are removed. So a prepare error under a cancel is now stamped, and a cancel landing between the old two reads can no longer return `Cancelled` unmarked. Every exit's outcome is unchanged, and each `classify` call is still followed at once by a return out of `produce`, so a stream stamps at most once. The send to a receiver that is gone is unchanged: a disconnect is no flag load, so it is not ADR-018 item 1's observation. The pre-prepare test's doc is revised as it asks, and engine/README.md's owner's index gains the new test and this form.
Tests+mutation: (T-3, new) `classify_stamps_producer_cancelled_when_it_returns_cancelled`, in engine/src/stream.rs `mod tests`: takes `crate::trace::TEST_LOCK` first, starts a trace, cancels a token with `cancel()`, and asserts (i) `classify(&cancelled, "prepare", "Binder Error: no such column")` is `EngineError::Cancelled` and `PRODUCER_CANCELLED` is present; then, in a second trace started after the first guard is dropped, (ii) the same for `classify_fetch_panic(&cancelled, "no panic message")`. Presence only, never an absence or an exact list. Mutation M-3: delete the mark in `classify`; T-3 fails by name at (i). (Changed, assertions byte-unchanged) `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` and `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start` take `TEST_LOCK` as their first statement, because they now stamp the event into any live trace. `the_pre_prepare_cancel_exit_stamps_producer_cancelled` has its doc revised and its assertions unchanged; its M-2 (delete the pre-prepare check's mark) is re-observed at the piece's head and still fails it by name at its presence assertion, because the check's return comes before prepare. Each mutation is observed by applying it, running `cargo test -p spatial-engine --lib <test name>`, recording the failure by name with its commit, and reverting (the template's Round 25 additions). All tests are deterministic: in-memory, with no sleep, retry, timeout or fixture. On CI they run in the workspace job (`cargo test --workspace --locked`, windows-latest and ubuntu-24.04). Unchanged and green, before (main's CI at the base) and after (the PR's CI): `flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`, engine/tests/slice.rs, engine/tests/stream_fetch_overflow.rs, engine/tests/admitted_integer_overflow.rs, kernel/tests/trace_spans.rs, kernel/tests/skp_admission.rs, kernel/tests/skp_filter_cancellation.rs. Invalidator: if T-3 cannot reach `classify`'s mark without a product seam, or M-3 or M-2 does not fail its test, the worker stops and returns to the architect.
Out-of-scope: ADR: not touched (no status, text, note or amendment; ADR-018 items 1, 2 and 4 govern unchanged). Security: not touched. Wire: not touched (no SKP, MCP, data-plane or kernel file). Guarantee: touched, which §36 allows by setting §25 (e) aside for a filler. ADR-018 item 1's `cancel_observed` is stamped on every `Cancelled` that `classify` returns: this adds the prepare route and closes the two-read window, and the two stamps at the execute-`Err` and fetch-panic exits move into `classify`. No existing test's assertion changes. The piece claims no time bound and no docs/08 figure, adds no dependency, product seam, pub item or string a user sees, and leaves flush's send and its error arm unchanged.
```

## Notes

### Item 2: the size (§21c, governance/AUTONOMY.md:347-357 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31)

My estimate is about 80 changed lines over 2 files, against 150 lines and 8 files:

| Where | Lines (about) |
|---|---|
| `classify`'s doc and mark | 4 |
| a comment at the prepare site | 2 |
| execute-`Err` arm (delete engine/src/stream.rs:1849-1855 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:20d0e066bce7b54e82538be5742d2d6e236e45a2ce4c480fe57e232fb5ec5fd9, a shorter comment) | 10 |
| fetch-panic arm (delete engine/src/stream.rs:1924-1938 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:1f85f3005de0da71c1b4d22b589c228419b796283b49a829161fdb1ae6ac06e1, a shorter comment) | 19 |
| T-3 | 30 |
| T-2's doc | 9 |
| the two lock insertions, rustfmt'd as at engine/src/stream.rs:3166-3168 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:387aa0e6095b54ae722e5e364d28a884f4806736ba4a97f08308467b1c1aa920 | 8 |
| engine/README.md | 4 |

The node's 120 minutes looks plausible. The only heavy run is building the lib tests, which goes in a shared hold under §36.

### Item 3: the route for each of the node's three rows

1. **The prepare error through `classify`: in, by a `classify` that marks when it returns `Cancelled`.**
   - The route is `.map_err(|e| classify(cancel, "prepare", &e.to_string()))?` (byte-copied, engine/src/stream.rs:1801 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:0793781feb43ce3a65ba0df5529690b30a1fb663fa7653981dd0a0233c7508ed).
   - `classify` loads the flag once (engine/src/stream.rs:2644 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:f578a75b858768c6e0b766cc23a2d41f14c170ac5f9ccb3e8cd28254abe2d658). When it reads set, `produce` returns: that is item 1's load-and-stop (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:ee8ca11cf4c5ed0ff2a728f8e5cb0c4e20df9d567c97fa47c7942f6aa7d0f5c9).
   - Without a seam, a test cannot make the flag change from unset at the pre-prepare check (engine/src/stream.rs:1794 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:f578a75b858768c6e0b766cc23a2d41f14c170ac5f9ccb3e8cd28254abe2d658) to set inside prepare. So T-3 proves the mechanism at `classify` itself, and the route is claimed by reading the code only.
   - ADR-018 item 4 (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:d25698d56329e26cf6bf8ab59cba7c5ef6d9eb19893aa9d1ac8fed312c66d628): the section this exit now ends is DuckDB's prepare, class (b). No bound is derived.
2. **The two-read window: in, by a single read.**
   - Today the execute-`Err` arm (engine/src/stream.rs:1848-1857 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:501367d46d259c695ddde095ce16027eed4b8b8f60852309a5f96f2b9240aaae) and the fetch-panic arm (engine/src/stream.rs:1936-1939 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:243e87344770fef54e875ff952d36cb63485aa2026e775bb6b96571acf54b1e0) each read the flag once for the mark and again inside `classify`.
   - With the mark inside `classify` and the outer reads deleted, one read decides both the mark and the `Cancelled`. The window stops existing by construction. A test cannot reach it, because it lies between two adjacent loads; the structure is checked by reading the diff.
   - Outcomes are unchanged, because `classify`'s own read always decided `Cancelled`; the outer read decided only the mark.
   - At most one stamp per stream still holds: each `classify` call is followed by a return out of `produce` (engine/src/stream.rs:1801 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:0793781feb43ce3a65ba0df5529690b30a1fb663fa7653981dd0a0233c7508ed, engine/src/stream.rs:1856 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:d79b412c54dae3beda6deb54d54997699d03fdb1fa99c8e04cbc5ecb694d8a9f, engine/src/stream.rs:1939 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:8e3d1244298f213f59b88d191b0f8362acb75fc44a929521ac0258fb67647d50), and nothing else marks after it.
   - One shift to disclose: the stamp now follows `e.to_string()` at the execute site, and `fetch_panic_duckdb_text` at the fetch site (engine/src/stream.rs:2658-2664 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:174c16f3653c8886390bab9e5ae326741a7ea0fbc715c10ccb78846baff50a3f). That is bounded in-memory work over the error text (class (a) in bytes, no time bound).
   - Rejected alternative: splitting `classify` into pure halves called after one read at each site. It costs more lines and changes the existing unit tests' calls, which assert `classify(&cancelled, …)` returns `Cancelled`.
   - Seam in product code: none.
3. **The send to a receiver that is gone: out.**
   - The arm is `.map_err(|_| EngineError::Cancelled)` (byte-copied, engine/src/stream.rs:2591 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:b8d9571993fd8726a5b42960bce94dfbcfd332111cd84d9916b8640612735bd3), under the comment at engine/src/stream.rs:2580-2581 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:b88ca51dfe2a9922c8a58692ad13f1c4d0f9174a0e8beb2b888694e26703d226. No flag is loaded there.
   - It is outside the flush piece's defect class, which is a load that reads set and then returns unmarked (flush form governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:112 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:e98e31efec4f68fa12f74b98421467d2db7d57af08cb28346e8562f5b4cbc42f).
   - A deterministic test of a load added there would need to know that flush has passed its check (engine/src/stream.rs:2558 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:f578a75b858768c6e0b766cc23a2d41f14c170ac5f9ccb3e8cd28254abe2d658) before the cancel lands. That needs either a wait loop on `resident_bytes`, which a committed test may not carry, or a product seam.
   - The disconnect question is item 4 and OPEN-2.

### Item 4: is a disconnect an ADR-018 observation?

- **As ADR-018 stands, no.** Item 1 defines `cancel_observed` as the worker loading the flag set and stopping (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:43-47 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:0696edd67a5e6b1142ff7750d69e37648ae3522213848a9275d1d2549e68e86f). A disconnect is not a load of the flag.
- **The code facts behind that:**
  - The only product receiver is `BatchStream.rx` (engine/src/stream.rs:1251 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:427fa25970aa4fa8ff805fd089f08a16a2c7064cb1d9174b2ff7459f5851c39a, engine/src/stream.rs:1412-1421 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:b623d1f59fbd2160c809f3237df8473c2226ed7752a2073213acad87fd9b193b).
  - `BatchStream`'s `Drop` body calls `cancel_for_drop` (engine/src/stream.rs:898-907 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:f905b5c3cc6ee05f930a3786d2c0e882d211debe614e7961c423236855a09617), which sets the flag with no stamp (engine/src/cancel.rs:125-127 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:855021fc659e24c2e4fc2ec4d8cd3d6e30a6d130110080aefd72bd7b3e102e1f, engine/src/cancel.rs:132-136 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91) before the `rx` field drops. So in the product, a disconnect always follows a set flag.
  - A load added after the disconnect would therefore always read set. Its instant would be fixed by when the consumer drops the stream, not by any producer check.
- **What the piece does:** nothing that depends on that answer. It needs no ADR status line, note or amendment.
- **What remains today:** on that path a trace may hold a request and no observation, so `segment_ms` is `None` and the run drops out of any sample. That is instrument surface, and no KNOWN-LIMITATIONS item is owed (the flush form's reasoning, governance/forms/engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md:291 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:d183d1d1dc201f74c120fa8c648157a31c0bb425f0261c2c3aee9befa8586b41).

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
  - The only in-crate tests that make real streams drain uncancelled tokens to disconnection (engine/src/stream.rs:3465-3467 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:7ff1f0d4edb067d30deb52c262e26c88bb3e2697e974b4ae2bca647630c5bda3, engine/src/stream.rs:3560-3566 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:18beefcb5e4d35e9dfa1310fef04739f7a399418f96718f0cb0387ee3d7ebbc7).
- **CI:** all of these run in the workspace job.
- **Unchanged kernel tests, checked by reading only:**
  - trace_spans' absence assertion stays true: `classify` marks only when it returns `Cancelled`, and a completed run never reaches it.
  - skp_filter_cancellation's expected stamps now come from `classify`, at the same position relative to the other events.

### Item 6: strings

There is no new string a user sees. `classify`'s messages and `OUT_OF_RANGE_DETAIL` (engine/src/stream.rs:2606 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:5081f5519527f790774491fb7482d1ac44d4920e0a38b8c7bda2fcfcafda5c2c, already a P6 placeholder) are untouched.

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
  - the Producer trace row gains T-3 (engine/README.md:551 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:4cec86bfb3ff072f033f15353a7fe6be88dca18402777997b79a62fc794e6be2);
  - the preregistration list gains this form (engine/README.md:557 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:1a134cf905b7c47d0b3ae41fd76e446efa7e90e8017e9b2f491051e26b38a6ff);
  - Last verified at (engine/README.md:537 @ ab9b52abf15e17693133d395330657e9840a5663 sha256:a4db046469923efb578438d04004ee9ab507f6f2f6d761a223e400e44b0d0487).

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
- Whether the checkout I read is byte-identical to ab9b52abf15e17693133d395330657e9840a5663. The custodian's pin script settles it.

## The custodian's settlement (class 1, before any code)

- **Taken on 2026-11-03 under the human's direction of 2026-10-31** (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4), each for the human's review on return; none is a red line by its marking or the custodian's reading:
  - **OPEN-1: (A).** This five-line form, its Out-of-scope line naming Guarantee as touched, under AUTONOMY §36, which sets §25 (e) aside for a filler. The human ruled the same shape for entry 4a (its OPEN-2 (a), `state/directives/2026-10-30-270-readme-r1-r3-d5-open-1-class-1-269-clicked-4a-7a-rulings.md`, line 17). The architect's gate brief cites §36 setting §25 (e) aside, as 4a's did.
  - **OPEN-2: (a).** A disconnect is not an observation as ADR-018 item 1 stands: the send row stays out, with no code and no new node, and this form records the reading.
  - **OPEN-3: (a).** T-2's doc is revised only, and its M-2 is re-observed at the piece's head.
  - **OPEN-4: (a).** The two `classify` unit tests take `TEST_LOCK` as their first statement, their assertions byte-unchanged.
  - **OPEN-5: (a).** 4a's form is added to engine/README.md's preregistration list in this piece's index update, a class-3 fix inside a Scope file.
- **What lead-data could not settle, the custodian's readings:**
  - The doc of `cancel_reaches_the_producer_during_a_late_matching_filtered_scan` in kernel/tests/skp_filter_cancellation.rs tells what an earlier piece fixed: marking on both error paths, conditional on `cancel.is_cancelled()`. With the mark moved into `classify`, both paths still mark on that read, so the account stays true; the file is outside Scope and the piece does not edit it.
  - The preregistration list's `engine/` entries are old paths that resolve through governance/MOVED.tsv. A form that was never at an old path has no row there, so this form and 4a's are written in the list by their governance paths.
  - Whether a kernel test reaches the send row is not settled. The piece claims nothing for that row (OPEN-2 (a)), so nothing rests on it.
  - The checkout: 55 of the 55 pinned ranges read the same at main 60334c66 as at ab9b52ab, and the draft's byte-copied quotes of engine/src/stream.rs's lines 1801 and 2591, and of 4a's form line 10, stand there at ab9b52ab, by script.
- **Rule (00)** was checked at main 60334c66 by `git diff --name-only origin/main...<branch>` over the open PRs (#271) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`; `cut/verify-quotes-cite-listing-line-count`, its local branch touching 2 files, none of them): none touches `engine/src/stream.rs`, `engine/README.md` or this form. It is checked again at dispatch.

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-03 — class 3, the settlement's cite of 4a's ruling pinned (gate 1, the architect's D2)

- The OPEN-1 bullet's bare line cite: state/directives/2026-10-30-270-readme-r1-r3-d5-open-1-class-1-269-clicked-4a-7a-rulings.md:17 @ 6dff90e9637a6368e695b56916c165f7d1f4b022 sha256:b58d768e47186ebcb2804b539dc8194d5ae6ef53d7a2cfa7cb18e2966cd0f056. No claim changes.
