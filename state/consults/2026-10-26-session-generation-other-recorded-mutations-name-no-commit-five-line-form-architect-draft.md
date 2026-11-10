*Custodian's filing note (2026-10-26): the architect's read-only draft of the five-line form for `session-generation-other-recorded-mutations-name-no-commit`, the filler queue's entry 5c (S3), read at main 564a98b2. By reading, three of the five comments are untrue of the code at the base (two mutations predicted to pass their tests, one failing at another assertion) and the torn-read half of the fourth is not detectable by its test; the piece stays doc-only and records each outcome as observed. The custodian commits the form on main from it, its cites pinned by script at 564a98b2, with OPEN-1 (A), the pass recorded and a test node proposed (`invalidate-generation-clause-observed-by-a-test`), OPEN-2 (A), W-F in, and OPEN-3 read as the rule that a PR awaiting the click leaves its slot. The run 04:01:27Z to 04:10:50Z by its transcript (Grep 16, Read 16, Glob 2; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 8e643c2811d31e757dee0aa5f01321e5af3a5dd89b7567e7f9148ed0999323fa.*

---

Drafted: session-generation-other-recorded-mutations-name-no-commit, five-line form, architect

I read everything at main @ 564a98b2, in the main checkout, and changed no file. I have no shell, so this draft carries no sha256 and I made no runs; the custodian expands each `path:line @ 564a98b2` by script. I read no branch.

**Read this first.** By reading, three of the five comments are untrue of the code at the base:
- **C2:** the mutation does not fail its test.
- **C3:** the mutation does not fail its test.
- **C5:** the mutation fails at a different assertion from the one the comment names.

The torn-read half of C4 is not detected by its test, whatever the timing. The comments are claims that tests catch defects they do not catch, so this is a Correctness matter under the proportional-gates rule, not wording. The piece is still doc-only: the words below record what each run will show, including the passes. Whether a test is owed is OPEN-1.

## The five lines

```
Authority: PLAN node `session-generation-other-recorded-mutations-name-no-commit` (PLAN.yaml:3193-3209 @ 564a98b2), generation 1; filler queue entry 5c, graded S3, placed by the human (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:26 @ 564a98b2, item 2; state/FILLER-QUEUE.md:18 @ 564a98b2); proposed under session-generation-t1-t3-reobservation's OPEN-2 (A) (kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md, the custodian's settlement); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ 564a98b2): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; the reuse index found no prior art on either search (recorded mutation commit; mutation reobservation), a miss noted here.
Scope: 1 file, kernel/tests/session_generation.rs, `///` doc lines only: the recorded-mutation comments above a_ticket_is_attributable_only_under_a_live_generation, invalidate_returns_exactly_the_tickets_of_the_generation_it_ended, dead_generation_attributions_are_pruned_rather_than_accumulating, the_registry_is_consistent_when_two_threads_use_it_at_once and a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it, and the concurrency test's "What it establishes" sentence; declared line budget 90 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ 564a98b2); this form exempt; no code line, assertion, message, fixture or test name changes, and no other file changes (the mutations are applied and reverted on an export of the base and never land).
Change: each of the five comments restates its mutation against the code at the base and names the 40-hex base commit on main its outcome was observed at, with the outcome by the assertion's message: two FAILED (attribute_ticket's live-generation check; the dead-ticket record's order), two PASSED and are recorded as not detected (invalidate's `*tg == g`; attribute_ticket's prune call), and one does not build (the Mutex); the torn-read mutation is recorded as a reading, never observed, which the concurrency test does not detect, and that test's doc stops claiming a consistency it does not assert.
Tests+mutation: no new test; changed in doc comments only: a_ticket_is_attributable_only_under_a_live_generation (M-A: attribute_ticket's no-live-generation `else { return false; }` replaced by generation 0; predicted FAIL on `an ended session attributes nothing`); invalidate_returns_exactly_the_tickets_of_the_generation_it_ended (M-B: `*tg == g` dropped from invalidate's filter; predicted PASS); dead_generation_attributions_are_pruned_rather_than_accumulating (M-C: attribute_ticket's `Self::prune_locked(&mut st)` call removed; predicted PASS); the_registry_is_consistent_when_two_threads_use_it_at_once (M-D1: the registry's `Mutex` replaced by `RefCell`; predicted build failure, E0277 at `impl SourceFactory for EngineSourceFactory`; M-D2, the torn read: not applied, a reading); a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it (M-E: the dead-ticket insert loop moved after the prune and fed from `st.tickets`; predicted FAIL on `and the record kept the handle`, left 0); each of M-A to M-E observed by applying it alone at the base on an export, running that test alone, recording its outcome by name with the commit in its doc lines, and reverting; a verify-mutation run is not an observation; any outcome other than the predicted one is a stop.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/ (W-D names `SourceFactory` in words only), no literal, code or message text; guarantee: none touched: the five tests pin properties under test, and every assertion, message, fixture and name keeps its text, so no property changes; three comments stop claiming a detection their tests do not make, which corrects a record and moves no property; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index**, byte-copied from the custodian's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs recorded mutation commit
No prior art recorded for "recorded mutation commit". Research it before planning an implementation.
$ node tools/reuse.mjs mutation reobservation
No prior art recorded for "mutation reobservation". Research it before planning an implementation.
```

## Notes (my reading)

### 0. The comments in scope

At 564a98b2 there are five comments that record a mutation and name no commit. The count matches the sibling draft's OPEN-2. That draft's :532-535 @ a305e541 is now :544-547, moved by #259's lines.

| | Where (kernel/tests/session_generation.rs @ 564a98b2) | Test |
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
- **The replaced statements:** kernel/src/skp.rs:628-631 @ 564a98b2.
- **"`closing` refusal stays":** that refusal is :625-627.
- **"never issues" 0:** `next` defaults to 0 and is incremented before it is used (:581-582). No other code writes it.
- **"FAILED on …":** after `invalidate`, `attribute_ticket("sh_2", ..)` returns `true`, so the assertion at kernel/tests/session_generation.rs:136-139 @ 564a98b2 panics with that message, which is a byte-copy of :138. The first half is not affected: :127-131 still passes. This is a reading; the run confirms it.
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
- **The field:** kernel/src/skp.rs:437-439. All 10 `self.inner.lock()` sites are GenerationRegistry's (:575 to :828).
- **Why it fails to build:** `SourceFactory: Send + Sync + 'static` (protocol/data-plane/src/transport.rs:154 @ 564a98b2). `AdmissionMode::TicketOnly` holds `Arc<skp::GenerationRegistry>` (kernel/src/lib.rs:321-324 @ 564a98b2), and the impl is at kernel/src/lib.rs:389 @ 564a98b2.
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
- **The loop and the prune:** kernel/src/skp.rs:808-812 and :816. After the prune, `live` no longer holds ds_a, so :736-739 has swept sh_a1 and nothing is inserted.
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
  - `git archive <base>`, extracted outside the repository with `tar --force-local` (state/consults/gates/2026-10-25-session-generation-t1-t3-reobservation-gate1-reviewer.md:111 @ 564a98b2).
  - Its own `CARGO_TARGET_DIR`: never the worktree's, never sefd, and never shared with the worktree. That sharing was the deviation recorded at kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md:179 @ 564a98b2.
  - Before the first run, touch the export's kernel/src/lib.rs, kernel/src/skp.rs and kernel/tests/session_generation.rs (:180 @ 564a98b2). The first run's output must show `Compiling spatial-kernel` from the export's path.
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
- **What counts as an observation.** A `verify-mutation` run is not one (docs/PREREGISTRATION-TEMPLATE.md:172 @ 564a98b2). The observation of record is the worker's run or the reviewer's re-run, and the reviewer re-makes all five on its own export.
- **Branch test text.** It is named by commit id in words until the merge, and the closing record pins it at the merge commit (docs/PREREGISTRATION-TEMPLATE.md:174 @ 564a98b2).

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

- That is 1 file. I declare 90 to leave room for rewraps. It is under §21c's 150 lines and 8 files (AUTONOMY.md:349-351 and :357 @ 564a98b2).
- There is no dependency, no exposure surface and no user-visible behaviour.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ 564a98b2).
- **Node budget, 60 minutes.** It covers five pairs of runs, one build failure and the suite on a warm target. A fresh target for the export compiles the bundled DuckDB cold, which may exceed 60 minutes. That is the custodian's estimate to make; I would book 90.

### 4. Out-of-scope readings

- **ADR, security and wire:** nothing is touched. The mutations exist only on the export. W-D names `SourceFactory` (protocol/) in words, and no protocol path is edited.
- **Guarantee.** I read "touched" as "changed" (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ 564a98b2). The five tests pin properties under test (AUTONOMY.md:325-327 @ 564a98b2), and their code and text are unchanged. Two of the new words differ from the sibling's case:
  - **W-B, W-C and W-D's second half record that a test does not detect its mutation.** The tests were never pinning those properties. Withdrawing a false claim of coverage corrects the record of what was already true and moves no property. Leaving the claims standing would itself be a Correctness finding, under the proportional-gates paragraph's unsupported-guarantee item.
  - **W-F** narrows a claim to what the assertions do.
- The Out-of-scope line therefore asserts that none of the four is touched, and §36 sets (e) aside in any case (docs/PREREGISTRATION-TEMPLATE.md:176 @ 564a98b2).

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

## OPEN items

- **OPEN-1: is a test owed for `invalidate`'s `*tg == g`?**
  - The facts: the clause can be observed through the public API (mint, attribute, mint the same name again, then invalidate). The product never reaches it, because each open mints a fresh handle (kernel/src/skp.rs:1114 @ 564a98b2).
  - (A) Record the PASS (W-B) and have the custodian propose a test node for the human to place.
  - (B) Widen this piece with about 15 lines in the test file: a re-mint-while-live step, failed by M-B. The Scope stops being doc-only, and that widens a node the human placed.
  - **I recommend (A).** This is a low-value path, and (A) keeps the node's shape. (A) is the custodian's choice, and so is proposing the node; (B) and the node's placement are the human's.
  - M-C needs no test, because only a clock could observe it.
- **OPEN-2: W-F in or out.**
  - (A) In. W-D's words make :251-253's "internally consistent" visibly untrue right beside it.
  - (B) Out, with a node proposed for it.
  - **I recommend (A).** It is the same file and the same kind of correction, it adds 8 lines, and a gate reading W-D would raise it. It is the custodian's choice, on the precedent of the sibling's W1. If (B), drop W-F's clause from the Scope and Change lines.
- **OPEN-3 (the custodian's): the slot.** #260 (6c) is awaiting the click. Whether a filler awaiting the click is still "in flight" under "one filler piece is in flight at a time" is the custodian's reading of its own precedent for 6a.

## What I could not settle

- **Every outcome is a reading, not a run.** That covers M-A's message, M-B's and M-C's passes, M-D1's E0277 and its site, and M-E's `left: 0`. A mismatch is a stop.
- **The exact rustc text, and whether other E0277 sites print first.** For that reason the words say "among any other sites".
- **The cold-target build time** for the export.
- **No branch was read and no sha256 was computed**, because I have no shell.
- **The abbreviated `12ccbeb` comments** are outside the node. Whether to expand them to 40-hex is not settled here.
