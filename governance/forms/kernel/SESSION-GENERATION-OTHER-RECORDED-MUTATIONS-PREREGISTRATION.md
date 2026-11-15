# kernel/tests/session_generation.rs: the other five recorded-mutation comments, each re-observed at a named base commit — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's mutations has been seen says so in its first line. PLAN node session-generation-other-recorded-mutations-name-no-commit, the filler queue's entry 5c (S3). The five lines and the notes are the architect's draft (`state/consults/2026-10-26-session-generation-other-recorded-mutations-name-no-commit-five-line-form-architect-draft.md`, read only at main 564a98b2; its sha256 from line 5 is 8e643c2811d31e757dee0aa5f01321e5af3a5dd89b7567e7f9148ed0999323fa), with two changes, both the custodian's: each cite at 564a98b2 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>`, a cite naming several places under one commit written as one pin each, and a cite by a bare file name written with that file's one tracked path (23 pins; the draft reads every cite at 564a98b2, so the 2 written without that marker are pinned at it too); and the settlement below. Line numbers written with no file name in the notes name lines of the file the sentence names, at 564a98b2; they are not pinned. One cite with no file name, note 2's `:180`, is pinned to the sibling form (`kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md`), whose `:179` the bullet before it cites, not to the test file its own sentence names. A cite at another commit (a305e541) stays as written. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Form path: `kernel/SESSION-GENERATION-OTHER-RECORDED-MUTATIONS-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer and the architect, from dispatch (§36).*

```
Authority: PLAN node `session-generation-other-recorded-mutations-name-no-commit` (PLAN.yaml:3193-3209 @ 564a98b279188e44e6658b95107473521a13a70d sha256:aa5a86e80f208f486857f14ce0f96808ef49a713417d807ff293022520f42354), generation 1; filler queue entry 5c, graded S3, placed by the human (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:26 @ 564a98b279188e44e6658b95107473521a13a70d sha256:b389a257fe249cb460e72ea5a3f710195b0697e0b5f51be089329efd546d97c6, item 2; state/FILLER-QUEUE.md:18 @ 564a98b279188e44e6658b95107473521a13a70d sha256:2478d00d3e6a2094f60af724140c0b65c4d4cc940100156be6dcaa9006fcda35); proposed under session-generation-t1-t3-reobservation's OPEN-2 (A) (kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md, the custodian's settlement); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 564a98b279188e44e6658b95107473521a13a70d sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; the reuse index found no prior art on either search (recorded mutation commit; mutation reobservation), a miss noted here.
Scope: 1 file, kernel/tests/session_generation.rs, `///` doc lines only: the recorded-mutation comments above a_ticket_is_attributable_only_under_a_live_generation, invalidate_returns_exactly_the_tickets_of_the_generation_it_ended, dead_generation_attributions_are_pruned_rather_than_accumulating, the_registry_is_consistent_when_two_threads_use_it_at_once and a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it, and the concurrency test's "What it establishes" sentence; declared line budget 90 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ 564a98b279188e44e6658b95107473521a13a70d sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no code line, assertion, message, fixture or test name changes, and no other file changes (the mutations are applied and reverted on an export of the base and never land).
Change: each of the five comments restates its mutation against the code at the base and names the 40-hex base commit on main its outcome was observed at, with the outcome by the assertion's message: two FAILED (attribute_ticket's live-generation check; the dead-ticket record's order), two PASSED and are recorded as not detected (invalidate's `*tg == g`; attribute_ticket's prune call), and one does not build (the Mutex); the torn-read mutation is recorded as a reading, never observed, which the concurrency test does not detect, and that test's doc stops claiming a consistency it does not assert.
Tests+mutation: no new test; changed in doc comments only: a_ticket_is_attributable_only_under_a_live_generation (M-A: attribute_ticket's no-live-generation `else { return false; }` replaced by generation 0; predicted FAIL on `an ended session attributes nothing`); invalidate_returns_exactly_the_tickets_of_the_generation_it_ended (M-B: `*tg == g` dropped from invalidate's filter; predicted PASS); dead_generation_attributions_are_pruned_rather_than_accumulating (M-C: attribute_ticket's `Self::prune_locked(&mut st)` call removed; predicted PASS); the_registry_is_consistent_when_two_threads_use_it_at_once (M-D1: the registry's `Mutex` replaced by `RefCell`; predicted build failure, E0277 at `impl SourceFactory for EngineSourceFactory`; M-D2, the torn read: not applied, a reading); a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it (M-E: the dead-ticket insert loop moved after the prune and fed from `st.tickets`; predicted FAIL on `and the record kept the handle`, left 0); each of M-A to M-E observed by applying it alone at the base on an export, running that test alone, recording its outcome by name with the commit in its doc lines, and reverting; a verify-mutation run is not an observation; any outcome other than the predicted one is a stop.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/ (W-D names `SourceFactory` in words only), no literal, code or message text; guarantee: none touched: the five tests pin properties under test, and every assertion, message, fixture and name keeps its text, so no property changes; three comments stop claiming a detection their tests do not make, which corrects a record and moves no property; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs recorded mutation commit
No prior art recorded for "recorded mutation commit". Research it before planning an implementation.
$ node tools/reuse.mjs mutation reobservation
No prior art recorded for "mutation reobservation". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine or my, they mean the architect's. They are this form's reading.*

## Notes

### 0. The comments in scope

At 564a98b2 there are five comments that record a mutation and name no commit. The count matches the sibling draft's OPEN-2. That draft's :532-535 @ a305e541 is now :544-547, moved by #259's lines.

| | Where (kernel/tests/session_generation.rs) | Test |
|---|---|---|
| C1 | :121-122 | a_ticket_is_attributable_only_under_a_live_generation |
| C2 | :145-147 | invalidate_returns_exactly_the_tickets_of_the_generation_it_ended |
| C3 | :229-230 | dead_generation_attributions_are_pruned_rather_than_accumulating |
| C4 | :255-257 | the_registry_is_consistent_when_two_threads_use_it_at_once |
| C5 | :544-547 | a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it |

Not in scope:
- The comments at :44-48, :81-84, :103-107 and :178-184 name the abbreviated commit `12ccbeb`, so they fall outside the node's title. I am noting them only.
- T1 to T3 were #259's.

### 1. The words

All the words are mine. None is the human's wording; they are doc comments. The worker applies them as written and substitutes only `<base>`, the 40-hex merge base with main.
- Each line is pre-wrapped at 100 columns or less. Each line that carries `<base>` is 66 columns or less before the substitution, so it is 100 or less after it. This avoids #259's D1.
- If a line still overruns, the worker rewraps it without changing a word.
- If an observed outcome differs from the words, that is a stop. The worker does not edit the words to fit.
- The C2 to C4 comments change their label from "Mutation recorded in-source:" to "RECORDED MUTATION:", which is the form #259 used.

**W-A replaces :121-122 (C1).**
```
/// RECORDED MUTATION: in `GenerationRegistry::attribute_ticket` (`kernel/src/skp.rs`), replace
/// its `let Some((g, _)) = st.live.get(dataset) else { return false; };` and `let g = *g;` with
/// `let g = st.live.get(dataset).map_or(0, |(g, _)| *g);`, so a dataset with no live generation
/// has its ticket inserted under generation 0, which `mint_for_open` never issues, and `true`
/// returned; the `closing` refusal stays. Applied at `<base>`,
/// run alone and reverted: `a_ticket_is_attributable_only_under_a_live_generation` FAILED on
/// `an ended session attributes nothing`, the assertion of its second half.
```
Each clause checked against the code:
- **The replaced statements:** kernel/src/skp.rs:628-631 @ 564a98b279188e44e6658b95107473521a13a70d sha256:d8b4ce5f074abb0f9983198230e61b5fb3a4c98f0c8cf510f7b381f857e60cfc.
- **"`closing` refusal stays":** that refusal is :625-627.
- **"never issues" 0:** `next` defaults to 0 and is incremented before it is used (:581-582). No other code writes it.
- **"FAILED on …":** after `invalidate`, `attribute_ticket("sh_2", ..)` returns `true`, so the assertion at kernel/tests/session_generation.rs:136-139 @ 564a98b279188e44e6658b95107473521a13a70d sha256:c49db5917845a3ade6d36d8b6686cce420fa5264b20b421b88cf158d51c800e5 panics with that message, which is a byte-copy of :138. The first half is not affected: :127-131 still passes. This is a reading; the run confirms it.
- **It builds:** the closure pattern has the same shape as prune_locked's `.map(|(live_g, _)| live_g)` (:738).

**W-B replaces :145-147 (C2). Predicted PASS.**
```
/// RECORDED MUTATION: in `GenerationRegistry::invalidate` (`kernel/src/skp.rs`), drop `*tg == g`
/// from the filter that collects the ended tickets, leaving `d == dataset` alone. Applied at
/// `<base>`, run alone and reverted, it fails nothing here:
/// `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended` PASSED. An attribution
/// naming an older generation of a name is left when `invalidate` runs only if `mint_for_open`
/// minted again for that name while it was still live, with no pruning call between, since
/// `prune_locked` sweeps an attribution whose generation is no longer live. This test mints
/// each name once, and `SkpHost::open_dataset` mints a fresh `DatasetHandle` for every open.
```
Each clause checked:
- **The filter:** :798.
- **Old attributions stay out:** prune_locked's second condition is at :736-739. `mint_for_open` prunes before it replaces `live` (:580, :583). `invalidate` prunes after it removes the generation (:816). `forget_dataset` drops the dataset's attributions (:832). So an attribution under an older generation survives to an `invalidate` only through a re-mint over a live name.
- **"This test mints each name once":** :151-152.
- **"`SkpHost::open_dataset` mints a fresh `DatasetHandle`":** :1114. Its two mint calls, :1246 and :1279, use that handle.
- **PASSED:** under the mutation, `ended` is still sh_a1 and sh_a2. The original comment's "cross-dataset assertion fails" was untrue twice over: `d == dataset` stays in the filter, so ds_b's ticket is excluded either way. The mutation compiles: `g` becomes unused, which is a warning only, and neither the workspace nor kernel/src/lib.rs denies warnings.

**W-C replaces :229-230 (C3). Predicted PASS.**
```
/// RECORDED MUTATION: remove the `Self::prune_locked(&mut st)` call from
/// `GenerationRegistry::attribute_ticket` (`kernel/src/skp.rs`). Applied at
/// `<base>`, run alone and reverted, it fails nothing here:
/// `dead_generation_attributions_are_pruned_rather_than_accumulating` PASSED. Each round's
/// `invalidate` prunes after it removes the generation. Every public method that reads the
/// attributions prunes before it reads them, except `invalidate`, whose filter keeps only the
/// generation it ends; so, without a clock this file must not take (ADR-018), the call is not
/// observable through this registry's public methods.
```
Each clause checked:
- **The call:** :624.
- **`invalidate` prunes after the removal:** :816.
- **Readers prune first:** `attributed_ticket_count` (:660) and `ticket_liveness` (:680).
- **`invalidate` does not prune before it collects:** :795-800; its filter is at :798.
- **Why a clock is the only remaining route:** the one difference left is an attribution of the live generation aged past `TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`, which `invalidate` would collect. The test file itself declines a clock (:226-227).
- **Precedent:** the shape is the PASSED record at :181-184.

**W-D replaces :255-257 (C4).**
```
/// RECORDED MUTATION, the first of two: replace `GenerationRegistry`'s `Mutex<GenerationState>`
/// with `RefCell<GenerationState>`, each `lock().unwrap_or_else(..)` becoming `borrow_mut()`.
/// Applied at `<base>` and reverted: `spatial-kernel`
/// does not build, failing with E0277 (`cannot be shared between threads safely`) at, among
/// any other sites, `impl SourceFactory for EngineSourceFactory` (`kernel/src/lib.rs`): that
/// trait is `Send + Sync` and the factory holds the registry in an `Arc`. The second, by
/// reading only and never observed: make `attribute_ticket` read `live` under one lock and
/// insert under a second, so that another thread's `invalidate` and `mint_for_open` can fall
/// between the two: the ticket is then attributed to the generation just ended, and `true` is
/// returned. That interleaving is timing-dependent, and this test's assertions hold under it in
/// any case: such an attribution still counts toward `total`, and the next pruning call sweeps
/// it, so the final count is 0 either way. The window can open in this test; the test does not
/// detect it.
```
Each clause checked:
- **The field:** kernel/src/skp.rs:437-439 @ 564a98b279188e44e6658b95107473521a13a70d sha256:f61336e0b172be66f5153e170f16c40f27d516f0ae940cdb45df59c300fbd89f. All 10 `self.inner.lock()` sites are GenerationRegistry's (:575 to :828).
- **Why it fails to build:** `SourceFactory: Send + Sync + 'static` (protocol/data-plane/src/transport.rs:154 @ 564a98b279188e44e6658b95107473521a13a70d sha256:7c1e46729e1b465442618dbc68ed733c729a85657d69acf633e2ebe64e86f8da). `AdmissionMode::TicketOnly` holds `Arc<skp::GenerationRegistry>` (kernel/src/lib.rs:321-324 @ 564a98b279188e44e6658b95107473521a13a70d sha256:a6d0fad929f8f07b4450c3032c2ccbe50c41f8904b587a69a4333bda7f06f923), and the impl is at kernel/src/lib.rs:389 @ 564a98b279188e44e6658b95107473521a13a70d sha256:e31fc36de191cdf22daa2316cafe1d702e9e7a1d1a56b96df942cce7cf8150ba.
- **The E0277 text:** the wording rustc prints for a type that is not `Sync`. This is a reading; the run must show it.
- **"Unsynchronised interior mutability" is narrowed to `RefCell`:** an `UnsafeCell` with an `unsafe impl Sync` would build, so the original claim was too broad.
- **The torn read:** `total > 0` (:289-292) counts every `true`. The final `invalidate` prunes (:296, then :816) before the count of 0 at :297-301. Nothing asserts that the generation was live at insert time.

**W-E replaces :544-547 (C5).**
```
/// RECORDED MUTATION: in `GenerationRegistry::invalidate` (`kernel/src/skp.rs`), move the
/// `st.dead_tickets.insert(..)` loop to after the `Self::prune_locked(&mut st)` call, taking
/// its handles from `st.tickets` (those naming this dataset and generation, collected into a
/// `Vec` first so that it builds) instead of from `ended`. Applied at
/// `<base>`, run alone and reverted:
/// `a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it` FAILED on
/// `and the record kept the handle` (`left: 0`), which fires before the `EndedBySourceChange`
/// assertion; both cover the same defect, the prune having swept the attribution first.
```
Each clause checked:
- **The loop and the prune:** kernel/src/skp.rs:808-812 @ 564a98b279188e44e6658b95107473521a13a70d sha256:941939729dc30129cc7aa93c8a671b9961e52c4ff61cbf92944dbd847b64db52 and :816. After the prune, `live` no longer holds ds_a, so :736-739 has swept sh_a1 and nothing is inserted.
- **Where it fails:** :558-562 passes (0). The assertion at :563 (`dead_ticket_count` 1) fails first with `left: 0`; its message is a byte-copy from :563. :564-568 would fail too (`Unknown`).
- **Why the `Vec`:** iterating `st.tickets` while inserting into `st.dead_tickets` through the guard is a borrow conflict, so the handles are collected first.
- **Correction to the comment:** the original named the `EndedBySourceChange` assertion as the predicted failure, which is untrue by reading.

**W-F replaces :251-253, the concurrency test's sentence. It goes in only if OPEN-2 is (A).**
```
/// **Asserts a count and a bound, never a timing.** What it establishes is that two threads
/// using the registry at once neither deadlock nor panic, that some attributions land under a
/// live generation, and that once the session is ended no attribution survives. It does not
/// establish that each attribution `attribute_ticket` answers `true` for names a generation still
/// live when inserted (the torn read below).
```
Each clause checked:
- **Join and `expect("no thread panicked")`:** :285-288.
- **Some attributions land under a live generation:** `total > 0` (:289-292). At the base, `true` is returned only under the one lock that also checks `live` (:622-635).
- **No attribution survives the end:** :296-301.
- **The last sentence:** it is W-D's reading.
- **What it removes:** "internally consistent", which the assertions do not establish.

### 2. The observations (route)

- **The base.** `<base>` is the branch's merge base with main, a commit on main. Every pin above is historical, and for the code the base tree is authoritative.
- **Stop if the code has moved.** Before the first run, check that each named line is at the base as described: attribute_ticket's live-generation check, its prune call, invalidate's filter, loop and prune, the `Mutex` field, and `impl SourceFactory for EngineSourceFactory`. If any is not, stop. 1c step 1 edits kernel/src/lib.rs, so if it merges first, re-check that impl.
- **The export.**
  - `git archive <base>`, extracted outside the repository with `tar --force-local` (state/consults/gates/2026-10-25-session-generation-t1-t3-reobservation-gate1-reviewer.md:111 @ 564a98b279188e44e6658b95107473521a13a70d sha256:61b76f5084a6c7cd103088cb9b269f5e848cee24a7431f916ab7604199f7133b).
  - Its own `CARGO_TARGET_DIR`: never the worktree's, never sefd, and never shared with the worktree. That sharing was the deviation recorded at kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md:179 @ 564a98b279188e44e6658b95107473521a13a70d sha256:174297d1d95bd23933f59bd5cbd50ac25d91d8383f226c20fb69a3c6643e8c51.
  - Before the first run, touch the export's kernel/src/lib.rs, kernel/src/skp.rs and kernel/tests/session_generation.rs (kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md:180 @ 564a98b279188e44e6658b95107473521a13a70d sha256:9734feeeb5cc0a71d62c5fd1c949a0fe055fd65cf5fae8a9f2648c68ba024277). The first run's output must show `Compiling spatial-kernel` from the export's path.
  - Heavy runs take a shared hold only (§36).
- **For each of M-A, M-B, M-C, M-D1 and M-E, alone and in turn:**
  1. Run `cargo test -p spatial-kernel --locked --test session_generation <name> -- --exact` unmutated. It must pass.
  2. Apply the mutation exactly as the words give it, and run the same command.
  3. Record the outcome:
     - for a FAIL, the first failing assertion's message and its detail;
     - for M-B and M-C, `1 passed`;
     - for M-D1, the error code and each error's site.
  4. Revert, and confirm the file is byte-equal to `git show <base>:<path>`.
- **M-D2 is never applied.** It is a reading. If someone does run it, that run is not recorded in these words.
- **Stops** (report, and change no word):
  - the test fails or does not build unmutated;
  - a predicted FAIL passes, or a predicted PASS fails;
  - the failure is at another assertion, or shows another detail;
  - M-D1 builds, or fails without E0277 at the SourceFactory impl;
  - a mutation as worded does not build (M-A, M-B, M-C, M-E);
  - a run hangs;
  - any file outside the Scope must change.
- **What counts as an observation.** A `verify-mutation` run is not one (docs/PREREGISTRATION-TEMPLATE.md:172 @ 564a98b279188e44e6658b95107473521a13a70d sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2). The observation of record is the worker's run or the reviewer's re-run, and the reviewer re-makes all five on its own export.
- **Branch test text.** It is named by commit id in words until the merge, and the closing record pins it at the merge commit (docs/PREREGISTRATION-TEMPLATE.md:174 @ 564a98b279188e44e6658b95107473521a13a70d sha256:ada780d90b6c8fafc49c49938b6a1ed0e0c338415dd2f0c6f4d3f0ed8850ccda).

### 3. Size (it fits)

| Span | Out | In | Total |
|---|---|---|---|
| W-A | 2 | 7 | 9 |
| W-B | 3 | 8 | 11 |
| W-C | 2 | 8 | 10 |
| W-D | 3 | 13 | 16 |
| W-E | 4 | 8 | 12 |
| W-F | 3 | 5 | 8 |
| **All six** | | | **66** |

- That is 1 file. I declare 90 to leave room for rewraps. It is under §21c's 150 lines and 8 files (AUTONOMY.md:349-351 @ 564a98b279188e44e6658b95107473521a13a70d sha256:ee853892c013a6ff642458a73227d1c218985cb6644f9d15d3bab7128760efd0 and AUTONOMY.md:357 @ 564a98b279188e44e6658b95107473521a13a70d sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec).
- There is no dependency, no exposure surface and no user-visible behaviour.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ 564a98b279188e44e6658b95107473521a13a70d sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3).
- **Node budget, 60 minutes.** It covers five pairs of runs, one build failure and the suite on a warm target. A fresh target for the export compiles the bundled DuckDB cold, which may exceed 60 minutes. That is the custodian's estimate to make; I would book 90.

### 4. Out-of-scope readings

- **ADR, security and wire:** nothing is touched. The mutations exist only on the export. W-D names `SourceFactory` (protocol/) in words, and no protocol path is edited.
- **Guarantee.** I read "touched" as "changed" (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ 564a98b279188e44e6658b95107473521a13a70d sha256:409f44fb055bb53fc13bf4c1160cefdcaf7048472a76a84f512cbd94ece5e113). The five tests pin properties under test (AUTONOMY.md:325-327 @ 564a98b279188e44e6658b95107473521a13a70d sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7), and their code and text are unchanged. Two of the new words differ from the sibling's case:
  - **W-B, W-C and W-D's second half record that a test does not detect its mutation.** The tests were never pinning those properties. Withdrawing a false claim of coverage corrects the record of what was already true and moves no property. Leaving the claims standing would itself be a Correctness finding, under the proportional-gates paragraph's unsupported-guarantee item.
  - **W-F** narrows a claim to what the assertions do.
- The Out-of-scope line therefore asserts that none of the four is touched, and §36 sets (e) aside in any case (docs/PREREGISTRATION-TEMPLATE.md:176 @ 564a98b279188e44e6658b95107473521a13a70d sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917).

### 5. Rule (00), path by path

This piece's paths are kernel/tests/session_generation.rs and the form on main. I propose the form path kernel/SESSION-GENERATION-OTHER-RECORDED-MUTATIONS-PREREGISTRATION.md.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none. Contact: M-D1's predicted error site is in kernel/src/lib.rs, which 1c edits. That is on the export only and a stop if the impl has moved. |
| port-2 | none |
| 6b (held) | none (kernel/tests/first_batch_factorial.rs) |
| #260 | none (engine/tests/slice.rs) |
| #252 | none (engine/, KNOWN-LIMITATIONS.md) |
| #249 | none |
| #244 | none |
| #241 | none. Contact: the file's helper comments (:317, :335-337) name typed_terminal_codes.rs, which #241 edits. This piece edits no helper comment. |

- No branch's list holds kernel/src/skp.rs, where M-A to M-E are applied on the export.
- Nothing under protocol/.
- No kernel/README.md index line is owed: neither sibling form is listed there, and #241 holds that README in any case.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A).** W-B records the pass as worded; no test is added here. A test that observes `invalidate`'s generation clause (a re-mint of a live name, then `invalidate`) is proposed as its own node, `invalidate-generation-clause-observed-by-a-test`, for the human to place.
- **OPEN-2: (A).** W-F goes in, as the Scope and Change lines already name it.
- **OPEN-3.** #260 (entry 6c), awaiting the click, has left the filler slot under rule (00)'s reading that a PR awaiting merge leaves its slot; this piece is the one filler in flight.
- **The machine rules.** Every build and run is a heavy command in a shared hold. No step here is timed.
- **Two cargo targets of their own.** The export's runs take a new target folder used by no other tree, its sources touched before the first run; the worktree's runs take another new one. No target is shared with any other tree (the lesson of entries 6a and 6b).
- **The node's budget** is revised to 90 minutes for the two cold builds (the architect's note 3); not measured.
- **Rule (00)** was checked again at main 564a98b2 by `git diff --name-only origin/main...<branch>` for every open branch and the branches in flight: none touches `kernel/tests/session_generation.rs`, and none touches `protocol/`.

## Amendments (opens empty; append-only)

## Amendment 1 — the closing record, written after gate 1's reports and the words commit were seen: the gate's word applied with no re-gate (class 1)

*Written by the custodian at the PR's final head aa62b6d0cd1fa34093d17bcc012a1f325f70f3d5. References only, and nothing below is a quotation. The gate: `state/consults/gates/2026-10-26-session-generation-other-recorded-mutations-name-no-commit-gate1-architect.md` (gate-log 631; sha256 08222b4700fd5ce8bb7f234d9db1b416cf20f1eb9db6327a2342e7ddbe284899) and `state/consults/gates/2026-10-26-session-generation-other-recorded-mutations-name-no-commit-gate1-reviewer.md` (gate-log 632; sha256 f70caf24dada64dea7f0894bbe8d8cba15d9ee0e25d3216b181e2a48a1183861), both PASS WITH NOTES. The build: `state/consults/2026-10-26-session-generation-other-recorded-mutations-name-no-commit-build-worker-report.md` (sha256 from line 5 7329c72974279a371008e9ed29dcacc2d71ad537667db69c81429db0281c8766). The words commit: `state/consults/2026-10-26-session-generation-other-recorded-mutations-name-no-commit-gate1-words-worker-report.md` (sha256 from line 5 dc832d597a6952a2c32bf829a0072adfc576d8358b66ff11ecd77463ae4f8952).*

1. **The word, applied with no re-gate** (AUTONOMY §31). It is not the human's wording. Both gates found W-C's premise sentence too broad (forget_dataset reads the attributions with no prune); the architect's one-word fix (D1) is applied, and the reviewer's four-line rewrite (its D1), which says the same, is not. W-C at the head therefore differs from note 1's fence in that one word. The PR body's W-B parenthesis takes the reviewer's words (its D2).
2. **The size.** By the numstat from the merge base 2a6adbb1 to aa62b6d0, the diff is 49 lines in and 17 out, in the one file the Scope names, under its 90, every changed line a doc line.
3. **The observations,** twice: by the worker on its export of the base, and by the reviewer on its own export with its own cargo target; each time each of M-A to M-E as the words record it.
4. **Recorded slips, no bearing on the evidence:** the worker's report counts two unit-test lock sites where there are more, all under cfg(test); the reviewer's report counts eight holds where its own list and its transcript show eleven, all shared.
5. **The record.** This is correction round 1 of 2.

Nothing above is edited.
