*Custodian's filing note (2026-09-27): gate 2 (attempt 2), architect, full gating, for PLAN node `b1-engine-kernel-half`. Reviewed: cut/b1-engine-projection @ 273a79d002c47215d988b9203b1a975349046a94. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed.*

---

**Verdict: BLOCK.** Reviewed `cut/b1-engine-projection @ 273a79d`.

I read the working tree at `C:/dev/wt/b1-projection` and assumed it matches `273a79d`. I have no Bash, so every per-commit fact and every "observed" claim below is the reviewer's to settle. Line cites point into the branch at `273a79d`.

## Verdicts (AUTONOMY.md §22)
- **Correctness: PASS with notes.**
  - Severity: low.
  - Scope: `engine/src/attributes.rs`, `kernel/src/publish/mod.rs`.
  - Disposition: fix C-a to C-c in round 2. C-d is a reviewer check; if it fires, it goes to the human.
- **Evidence: FAIL.**
  - Severity: blocking.
  - Scope: X2, X3, X6 and X7 (blocking); X10 and X12 (low).
  - Disposition: one worker round for the tests, then gate 3.
- **Documentation: FAIL.**
  - Severity: medium.
  - Scope: SKP-V0 §4 item 13, §8 and §9.1 (X14); the `SKP_VERSION` doc; Amendments 6 and 7; one comment in `kernel/src/skp.rs`.
  - Disposition: record round 2 of 2, in the reduced form below.

## Rows X1–X20 against Amendment 5
- **X1: met** (the reviewer confirms the bytes). The final arm is main's text again (`attributes.rs:113-119`). The kernel test pins the reason through `viewport_query`.
  - C-a (low): the row says no refusal text may sit in the gate unless an owner renders it. The `Dictionary` arm's detail at `attributes.rs:97-104` still has no renderer:
    - `type_check` discards it (`:386`);
    - `filterable_column_type` excludes dictionaries before the gate (`predicate.rs:1058`);
    - publish renders its own text from `source_type`.
  - Fix: drop the text, or give it an owner.
- **X2: code met, evidence unmet (blocking).** The two passes are correct (`attributes.rs:453-491`), and E-6 and the order-table test are in place.
  - The row's kernel test `publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction` does not exist in `kernel/`.
  - So the row's second mutation (the restriction run before shared admission) has no test. That is the half of O1 that publish owns.
  - Amendment 6's X2 row drops it without saying so.
- **X3: code met, row unmet.** See the X3 ruling below.
- **X4: met, through `7765b98`.** My row paired the mutation "`From` renders the final-arm text" with a test that never calls `From`. `admit_bundle_format` does not go through it. The pairing defect was mine, and the worker's new unit test on `From` (`attributes.rs:756-799`) is the right proof. Record it as class 4 against my row.
  - C-b (low): the `.expect` became a typed refusal with new text (`publish/mod.rs:505-512`). That text is unreachable, not the human's wording, and describes code internals. The `From` doc at `:186-190` promises "without a second, fallible lookup", and this is one.
  - Fix: carry the source type from admission, as R suggested.
- **X5: met.**
  - Note: the surrogate test's list omits `LargeUtf8` and `Utf8View` (`predicate.rs:1257-1270`). It is hand-kept, not derived from the gate.
  - The unreachable `filter_surrogate` placeholder (`:1085-1086`) is a new filter text. List it for sighting at B1's close.
- **X6: code met (route (a), plan field), evidence unmet (blocking).**
  - The test passes a literal `false` (`stream.rs:2722`, `:2752`), not the value `stream_for_publish`'s plan declares (`:899`). The row's first mutation (publish's plan declaring the live retention) therefore survives this test.
  - The comment's recorded mutation (`:2687-2691`) edits the test itself, and Amendment 6 records a different mutation. A test edit is not a mutation of the code under test.
  - The `Boolean` probe compares the uncompacted run with itself, so its outcome was never probed or recorded (5.1). It does not use `TaggedBatch::assemble`.
  - Fix: read the actual plan. Either extract the publish `StreamPlan` constructor and use it in both places, or drive `stream_for_publish` over MultiType's nullable `zone` and read the queued items in-module, as X7 does, asserting no copy. Then probe a compacted `Boolean` against the slice at 8/3 and record the outcome.
- **X7: the live-stream test is met** (`stream.rs:2823-2894`, in-module, with hashing). **The small-run cases are not discriminating (blocking):**
  - The test's allowance closure (`:2545-2549`) carries the 64-byte term itself.
  - The compacted 1-row `Int64` copy is still 64 bytes against an allowance of 80, and the `Boolean` copy 64 against 90.
  - So removing the term from `retain_or_compact_single_run` should leave both cases green.
  - Yet the comment (`:2538-2542`), Amendment 6's X7 row and Amendment 7 all record that mutation as observed failing. The reviewer runs exactly that mutation. If the test stays green, those three records carry a false observation (round 7), a finding by name.
  - Fix: assert the small runs are kept without a copy (`Arc::ptr_eq`, or the same buffer pointer). That is the property the term buys (ADR-004).
- **X8, X9, X11 and X13: met.** K-1 reads the committed fixture over the real data plane with a DuckDB oracle keyed on `id`. K-2 and the fixture test assert exact key sets.
- **X10 (low):** E-15's mutation is recorded nowhere.
- **X12 (low):** the hashing is done. The row's mutation (one byte appended between the two hashes) was declined in Amendment 6 without authority.
- **X14: unmet.** See the SKP-V0 section.
- **X15, X16 and X19: met.**
- **X17: met.** The empty-list message states a kernel fact (`skp.rs:1456-1457`). Neither side's fixture test pins message text (X9 compares keys), so nothing ties the fixture's message to the kernel's. Low.
- **X18: met** (`engine/README.md:414-422`).
- **X20: met** (the reviewer confirms item 3's bytes against main).
  - Nit: the appended note speaks for `skp/0.5`, which is the watcher's literal (§2.8).
  - Nit: SKP-V0 now carries record-process parentheticals ("X20; Amendment 5 row 5.6 …", and at `:300-301`), and they do not belong in a protocol spec.
- **5.2 (route a): met in code.** The flag is `true` only at `stream.rs:971`. Its proof is X6's.
- **5.3: met in the docs** (`stream.rs:67-100`, README). Its small-run proof is X7's.

## The X3 STOP, settled
1. **The worker's premise is right** for a verified mapping:
   - `i64_for` is negative-capable (`engine/src/fixture.rs:273-277`);
   - `admit_identity` refuses a negative minimum (`engine/src/dataset.rs:1499-1509`);
   - the wire always verifies uniqueness (`kernel/src/skp.rs:1420-1431`).
2. **Gate 1's C2 probe could only have opened the file with `skp_uniqueness_check` unset if it used an unverified declaration.** The field is `skip_uniqueness_check = true`, and with it `admit_identity` returns before the scan (`dataset.rs:1464-1468`). The reviewer confirms what the probe used.
3. **The case is executable and the row is unmet.** K-5's harness already opens through `Catalog::open_cancellable` (F12), never through the wire.
   - `skip_uniqueness_check` is a `pub` field (`engine/src/identity.rs:167`), and a kernel test already sets it (`kernel/tests/scale_pass.rs:613`).
   - Admission reads only the identity source column's name, and `describe_dataset` and `Dataset::admit_projection` pass the same one (`skp.rs:1690-1694`; `stream.rs:932-937`). So uniqueness is not an input to the property.
4. **The substitution does not conform.** An engine unit test proves `admit_projection_column`, not the describe ↔ `viewport_query` seam K-5 exists to prove (round 4).
   - Fix: add one K-5 case, MultiType mapped to `i64` with `skip_uniqueness_check = true`. Its doc says why: the wire always verifies, and admission does not read uniqueness.
   - My row said "through the product path". That was imprecise, and the correction is class 4 against my row.
   - Amendment 6's superseded-index entry against row 5.6 is withdrawn by this disposition: a worker's STOP returns a row to the architect and does not supersede it. Calling it class 4 was also a mislabel.

## Amendment 7 under the record cap
- **It sits inside record round 1.** It came from the same worker round, before any gate. The code in it (`7765b98`) is X4's legitimate proof.
- **It is also a defect in form:**
  - it runs past round 12 (d)'s three-sentence ceiling;
  - it restates Amendment 6 (the "no row … otherwise changes" sentence and the suite counts);
  - its blanket claim that "every mutation … re-applied … observed failing" names no failure and no commit. Under round 7 that claim is unresolvable, and under round 25, item 2 (c) it is not an observation of record.
  - Its phrase "reasoned RECORDED MUTATION comments" suggests the comments were reasoned rather than run. The reviewer settles whether Amendment 4's and Amendment 6's "observed" claims hold. X7 above is the test case.
- **Amendment 6** reproduces `i64_for`'s doc text with no script mark and no hash, where a reference would do (round 12 (b)). Since that span exists only on the branch, the reference takes round 25, item 2 (d)'s words form: lines 273-274 of `engine/src/fixture.rs` at the commit.
- **Does this round count as record round 1? No.** Record round 1 is Amendment 5's, which Amendments 6 and 7 close. The corrections this gate orders are **record round 2 of 2, the last.**
- The closing amendment (Amendment 8) is one table: row | test | commit | observation of record (this gate's reviewer report section, or a run naming its failure and commit), plus a superseded index covering:
  - Amendment 6's class-4 section and its superseded entry;
  - Amendment 7's re-verification paragraph.
- No prose. If round 2's record fails a gate, I reduce the record myself.

## §8 items that Amendment 5 touches
- **Item 15:**
  - The filter text is restored (X1).
  - Publish's name-first order is main's again (X2).
  - The dictionary texts are today's (X4).
  - C-b is new but unreachable text.
  - **C-d (reviewer check):** under a mapped identity, a file that carries its own `id` column now gets `[id]` refused at publish too (pass 1 at `attributes.rs:461-466`, and `check_geometry_and_identity`). O8 ruled only the case with no `id` column. If main at `d6d9862` admitted `[id]` in this case, the change is outside O8 and goes to the human.
- **Item 17:** no shell string, and no sentence calls B1 done. Clear.
- **Item 19 (C-c, low):** the `ColumnIsIdentity` Display (`attributes.rs:228-233`) says "a second name for the same fact". In the X3 case the file's `id` is an unrelated column, so the engine fact is a clash with the reserved wire name. Fix the wording before the human sees it.
- **Items 22 and 23:** hold (the reviewer confirms the bytes).
- **Items 3, 7, 13 and 16:**
  - one gate for admission;
  - compaction goes through `make_array` into `TaggedBatch::assemble`;
  - the type is preserved;
  - `Dataset::admit_projection` and `known_columns_wire_field` have kernel callers.
  - Clear.
- **Items 4 and 14:** reviewer checks.
  - Item 4: `9348a40` carries both fixture sides.
  - Item 14: `filter_composition` is unchanged in `5b0e1de`.
- **Quote defect:** the comment at `kernel/src/skp.rs:1451-1454` attributes a quotation to "§1". §1 of the preregistration reads differently, and the quoted words are the round 7 ruling. Cite round 7, or quote §1's actual words.

## SKP-V0 (X14)
- **§4 item 13 (`:291-301`):** it states the commit facts, then calls `2963021` "assembly of one unreleased version". But condition (iii) failed for that addition (the TypeScript side followed in `6cd1764`), and that is the same fact for which the `skp/0.5` paragraph at `:285-289` says the version is not an instance of the rule. It must draw the same conclusion.
- **§8's Mechanics sentence (`:884-889`) and §9.1 (`:899-902`):** both still say every fixture changed in the bump commit, and that is false. Fixtures changed in `2963021`, `6cd1764`, `9348a40` and `5358ff6`. X14 is unmet here.
- **§9.4 (`:937-942`):** it does not say that every name is resolved before any per-column rule runs, which is the C3 fix. State it.
- **§9.5:** true against the code.
- **The `SKP_VERSION` doc (`protocol/skp/src/v0/mod.rs:58-66`):** verbatim, "six new `skp.projection_*` refusal codes appear". The table has seven. Its "updated in this commit" is also false: the paragraph itself landed in `5358ff6`.

## Round 25 checks
- There is no full-form §7 line budget, so class 8 cannot fire.
- No class-9 addition: every X row fixes a declared row against rulings already binding.
- No record cites `verify-mutation`.
- No hash is pinned at a branch commit.
- The gate-1 reports sit under `state/consults/`. If they were filed after the merge of the piece that added §25 (#129), §25(b) puts them under `gates/`. That is for the custodian to check; it is not the worker's defect.

## For the human
- Nothing waits for the human unless the reviewer finds that C-d fired.
- Pending the human's sighting at B1's close, these placeholder or new texts will sit on main:
  - `type_check`'s detail (`attributes.rs:392-394`);
  - `filter_surrogate`'s text;
  - the empty-list message;
  - C-b.

No ADR is needed.

Files:
- `C:/dev/wt/b1-projection/engine/B1-PROJECTION-PREREGISTRATION.md`
- `C:/dev/wt/b1-projection/engine/src/attributes.rs`
- `C:/dev/wt/b1-projection/engine/src/stream.rs`
- `C:/dev/wt/b1-projection/engine/src/predicate.rs`
- `C:/dev/wt/b1-projection/engine/src/fixture.rs`
- `C:/dev/wt/b1-projection/engine/src/dataset.rs`
- `C:/dev/wt/b1-projection/kernel/src/skp.rs`
- `C:/dev/wt/b1-projection/kernel/src/publish/mod.rs`
- `C:/dev/wt/b1-projection/kernel/tests/skp_projection.rs`
- `C:/dev/wt/b1-projection/protocol/skp/SKP-V0.md`
- `C:/dev/wt/b1-projection/protocol/skp/src/v0/mod.rs`
