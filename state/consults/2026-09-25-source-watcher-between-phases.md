*Custodian's filing note (2026-09-25): the architect agent's consult for PLAN node `engine-source-change-watcher` between its phases, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. Its Amendments 2 and 3 are appended byte-exact to `engine/SOURCE-WATCHER-PREREGISTRATION.md` on `cut/source-change-watcher`; its section 4 is phase 2's brief.*

---

**Verdict: pass with notes.** Phase 2 may start. Three phase-1 items will block the final gate by name if they are still open then:
- **E8** does not prove what its name says (ADR-035 Consequences' second close-time test).
- **Two coverage-lost detail strings are unmarked** (§8 item 9).
- **Test names do not match §4's registered names.**

None of the three needs the human. I read the tree at `C:\dev\wt\source-change-watcher`. I have no Bash, so I computed no numstat and no hash; the reviewer recomputes both.

## 1. Substance

**The code keeps ADR-035 Decision 3's close-time ordering.**
- `invalidate` takes the `SessionRef` under the guard, into `EndReport`, by value.
- `SessionInvalidator::end_generation` calls `try_send` after the guard is released.
- `close_dataset` runs in this order: remove and drop the `OpenRecord` (disarm and join), then `cancel_all_for_dataset`, then `forget_dataset`, then `catalog.remove`.
- The sink cannot reach `invalidate` after `forget_dataset`.

**Point 2 (E5, E7, E8)**
- **E5 holds.**
- **E7 holds its claim.** Its registered mutation was swapped for a close-line swap.
- **E8 does not prove its name.** The worker's reasoning ("no window where a record precedes `forget_dataset` and its enqueue follows") is true only on `close_dataset`'s own thread.
  - ADR-035 Decision 3's close bullet names a second route: a data-plane thread records the end, releases the guard, `forget_dataset` runs, and then that thread enqueues. The window exists there.
  - E8 as built is E7 with two tickets on one thread. Both enqueues come before `forget_dataset`.
  - So neither Decision 3's rule ("even when its enqueue follows `forget_dataset`") nor the Consequences' test for that route is proved.
  - A regression of the form "skip the enqueue when the dataset is no longer known" would pass E8.
  - **Remedy, inside the preregistration:** §4 already registered the record/enqueue split. Build it as two private fns called by `end_generation`; that is its product caller, and the in-crate test module can reach private items.
- **No human needed.**

**Point 3 (A7)**
- The claims hold. Case (b) is proved by A7's Change.
- §7's case-fold row is proved by `names_match_folds_case`, which calls the shipped private `names_match`.
- A7's doc comment generalises from two observed scenarios (A3, A7) to every rename scenario. That generalisation is not a recorded result, and the record must not carry it.
- **No human needed.**

**Point 4 (K5, K6)**
- **K5 holds.** Its registered mutation cannot be expressed at the host level, because each open mints a fresh `DatasetHandle` key. The property "does not restore an ended generation" rests on two things:
  - K10: its mutation is `live_or_mint` minting over an end;
  - §7: zero re-arms per open.
- **K6 changes what is proved.** Case (e)'s refusal is proved. §4's "no catalog entry, no generation" is not:
  - the refused open returns no handle;
  - the retry runs under a fresh key;
  - so the comment's claim that the retry would fail if anything were left behind is false.
- `Catalog::names()` already exists and restores "no catalog entry". "No generation" needs an accessor. Even as an instrument accessor it would trip §5's invalidator ("a test-only `pub` item is needed"). So reduce that clause.
- **No human needed**, unless the human wants "no generation" proved. That route goes through §5's invalidator and is theirs.

**Not in the hand-back, found in the tree**
- **(a) Budget figures do not add up.** 1,848 + 2,334 + 303 + 24 + 132 = 4,641, not the stated 4,677. The reviewer recomputes.
- **(b) §2b's sink log line is not built.** The `Admitted` arm of the sink in `open_dataset` logs nothing.
- **(c) Two coverage-lost detail strings lack `[P6 placeholder]`** (§7, §8 item 9):
  - the `EndedByCoverageLoss` arm in `EngineSourceFactory::create_from_ticket` (`kernel/src/lib.rs`);
  - the mint-race arm in `SkpHost::viewport_query`, which reuses one unmarked string for both reasons.
- **(d) Test names do not resolve against §4.** Every A, K, W and E name carries a prefix (`a1_`, `k1_`, `w1_`, `e1_`), and A11's name differs in substance.
- **(e) Undisclosed deviations, each recorded in its test's own doc comment:**
  - A3: mutation changed;
  - A6: suspends threads instead of a blocked sink;
  - A10: construction and mutation changed;
  - A11: share-mode conflict instead of `icacls`, and renamed;
  - Amendment 1's kernel test: mutation changed, because the registered one no longer type-checks.
- **(f) H1, H3 and H4 are not observed by passing tests.** Their discriminators are mutations whose doc comments say "expected", not observed. A1 does not separate the write's notification from the mtime restore's own `LAST_WRITE` (H2). A9 accepts a Change from either handle (H4).
- **(g) Point 6 confirmed.** No step in `.github/workflows/*` at `4137f4d` runs `cargo fmt` or `clippy`. The one grep hit is a comment in `governance-ci.yml`. Product CI runs `cargo test --workspace` on `windows-latest`, so A6's thread suspension, A10's `mklink` and A11 run in CI.
- **(h) Outside scope, for the ledger.** The pre-existing post-check `eprintln!` in `kernel/src/lib.rs` logs the `DatasetHandle`, against SKP-V0 §3's no-logging rule. Not this piece's.

## 2. Amendment 2 (byte-exact)

````
### Amendment 2 — 2026-09-26, written after phase 1's results were seen: RULED 2026-09-25 — question round 23, items 2 and 3

Class 5, a scope settled on a ruling. The rulings are cited by round and item and are not reproduced. S1–S4 are the stop items of `state/consults/2026-09-25-adr-035-decision-4-note.md` §4.

1. **Item 2 (S1, a red line).** §2c's `SKP-V0.md` work gains a second dated note, appended at the end of §8, after the `skp/0.5` entry and after main's 2026-09-24 note to the `skp/0.3` entry. The note states three things:
   - a `SessionRef` no client holds does not engage `skp/0.3`'s no-generation-value rule, under round 21 item 1's riders: it carries no ticket attribution, and it is never persisted or published;
   - that reference is containment for the close race, not a protocol feature;
   - PLAN node `kernel-generation-close-races` makes the unheld path unreachable and adds a test proving it. That obligation is the node's, not this piece's.

   The note reproduces none of the human's words. §2c's sub-bullet on rider (c)'s note stands; this note is round 23's.
2. **Item 3, S2** (§2b, the session reference). Every `SessionRef`, held or unheld, is minted by `SessionRef::mint` (`protocol/skp/src/v0/handles.rs`, the OS CSPRNG) and is never reused. `SkpHost::open_dataset` and the minting branch of `GenerationRegistry::live_or_mint` both call it; K14 and Amendment 1's kernel test assert distinctness. No test is added.
3. **Item 3, S3** (§2d, the listener; §8 item 19). The line logged for a dropped unknown-session event carries no reference. SH11 also asserts that the line contains neither the event's `session` value nor any `sr_` followed by 32 lowercase hex digits; its added mutation writes the reference into the line. Amendment 1 item 2 stands.
4. **Item 3, S4** (§2c, `SKP-V0.md` §3). The third minting rule is worded to cover a reference no client holds, and §3's count of its session-scoped kinds becomes four.
5. **§9, architect.** The gate adds two checks: the second note against round 23 item 2, and §3's wording against round 23 item 3's S4.
````

**The second dated note to `protocol/skp/SKP-V0.md` §8.**
- It goes at the end of the file, after the `skp/0.5` entry, once main is merged in (see §4 below).
- It quotes the human nowhere, so nothing needs the custodian's script. It is labelled as a paraphrase, following the 2026-09-24 note's precedent.

````
### Second note to the `skp/0.3` entry: a session reference no client holds (2026-09-25)

**Appended on the human's ruling of 2026-09-25** (`DECISIONS-PENDING.md`, RULED 2026-09-25 — question round 23, item 2; a red line, answered in typed text). The `skp/0.3` entry and the note of 2026-09-24 above are unchanged; this note clarifies the rule in writing and does not reinterpret it. It is paraphrased here; the ruling's words govern.

`skp/0.5`'s kernel mints a `SessionRef` for every dataset-session generation, including one that `open_dataset` did not create (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, Note 2026-09-25). No response returns that reference, so no client holds it. It appears only on the `dataset_session_ended` event that ends its generation, which the shell drops as naming an unknown session.

- That reference does not engage the `skp/0.3` rule that no generation value crosses the wire, under round 21 item 1's riders: it carries no ticket attribution, and it is never persisted or published.
- It is containment for the close race, not a protocol feature. PLAN node `kernel-generation-close-races` makes the path that mints it unreachable and adds a test proving that.

A reference that fails any condition in this note or in the 2026-09-24 note gets no clarification from either.
````

**S4: replacement for the branch's own unmerged §3 paragraph.** It replaces the paragraph that begins "`skp/0.5`'s third minting rule". The next paragraph's "All three are" becomes "All four are".

````
**`skp/0.5`'s third minting rule, stated beside the first two:** the kernel mints a value wherever the value only names a kernel-side session and authorizes nothing, and no command accepts it as input. `SessionRef` is that value. The kernel mints one for every dataset-session generation, from the OS CSPRNG, and never reuses one. For a generation a successful `open_dataset` creates, the reference is handed back exactly once, on `OpenDatasetResponse.session`. For a generation created any other way, no response returns it and no client holds it. Either way it is not looked up, and its only other appearance is on the `dataset_session_ended` event that names the generation it ends (`engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b and Amendment 2; `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` Decision 4 and its Note 2026-09-25; round 21 item 1, rider (a); round 23, items 2 and 3).
````

## 3. Amendment 3 (byte-exact)

````
### Amendment 3 — 2026-09-26, written after phase 1's results were seen: the phase-1 record

Post-result record; each row names its template class. Phase 1's head is `4137f4d` on `cut/source-change-watcher`; names below are as they stand there.

1. **Budget, class 1 (§7).** The engine and kernel rows are overrun at `4137f4d`. The final per-module, total and file figures, under §21c's counting rule, are recorded by the closing amendment.
2. **E5, E7, E8, class 2.** §4's `pub(crate)` split of `end_generation` was not built; E5 and E7 assert their named properties against the single call, and E7's recorded mutation (swap `cancel_all_for_dataset` and `forget_dataset` in `close_dataset`) replaced the registered one. E8 does not exercise its named order: both of its ends are enqueued before `forget_dataset` runs, so it does not prove ADR-035 Decision 3's close bullet for an end recorded on another thread. The comment above E5 that denies such a window is withdrawn; the closing amendment pins the superseded span at a commit on main.
3. **A7, class 2.** A7's registered mutation (byte-exact comparison) does not fail A7: its case-only rename delivers `RENAMED_OLD_NAME` on the stored spelling first, and a handle signals at most once. The fold is proved by `names_match_folds_case` in `engine/src/watch.rs`, on the shipped `names_match`; its mutation replaces the body with `a == b`. A7 stays a case (b) test with no mutation of its own. Only A3's and A7's scenarios were observed; nothing wider is recorded.
4. **K5, K6, class 2.**
   - K5's registered mutation cannot fail at the `SkpHost` level, because every open mints a fresh `DatasetHandle` as the registry key. Its recorded mutation (drop the `OpenRecord` insert on the `Watching` arm) proves that a reopen watches again. No restored generation rests on K10 and on §7's zero re-arms per open.
   - K6's registered mutation (mint before the latch check) is not discriminated: a refused open returns no handle, and the retry opens under a fresh one. The comment saying the retry would fail on a leftover is withdrawn. The recorded mutation (skip steps 1 and 2) proves the refusal. The absence of a catalog entry is asserted in phase 2. The absence of a generation is reduced: no test asserts it, since an accessor would be the test-only `pub` item §5 forbids.
5. **Other deviations, class 2**, each stated in its test's doc comment at `4137f4d`:
   - A3's mutation ignores `REMOVED` and `RENAMED_NEW_NAME`;
   - A6 forces the overflow by suspending the watch threads, not with a blocked sink;
   - A10 nests the junction one level deeper, and its mutation skips `canonicalize`;
   - A11 forces the failure with a share-mode conflict, not an `icacls` deny, under a changed name;
   - Amendment 1's kernel test reuses one shared reference as its mutation, since the registered one no longer type-checks with `EndReport.session` not optional.

   The gate's `verify-mutation` run, commit named, is the observation of record for every mutation in rows 2–5.
6. **H1–H5, class 1.** This amendment records none as observed. Each resolves at the gate's run, commit named:
   - H1 by A8 under its mutation;
   - H2 by A1 passing (A1 does not separate the write's notification from the mtime restore's);
   - H3 by A6 under its mutation;
   - H5 by A13 passing.

   H4 is not discriminated by A9 as built, because A9 accepts a `Change` from either handle; it stays open.
7. **Found at `4137f4d`, owed in phase 2, class 1:**
   - §2b's sink log line is not built;
   - the coverage-lost details of `create_from_ticket`'s `EndedByCoverageLoss` arm and of `viewport_query`'s mint-race arm lack the `[P6 placeholder]` mark (§7; §8 item 9);
   - test names carry prefixes and do not resolve against §4.
````

## 4. Phase-2 deltas

**From Amendment 2**
1. **Merge `origin/main` into the branch before any §8 edit.** This brings in ADR-035's acceptance and its Note, SKP-V0's 2026-09-24 note and PLAN.
   - In `SKP-V0.md`, keep main's 2026-09-24 note byte-identical, directly after the `skp/0.4` entry; the `skp/0.5` entry follows it.
   - Regenerate the generated files; do not hand-resolve them (directive 2026-09-19).
2. Append the second note (text above) at the end of `SKP-V0.md`.
3. Replace the §3 paragraph (text above), and change "All three are" to "All four are".
4. Extend SH11 with S3's assertion and mutation.

**From Amendment 3**
5. **Split `SessionInvalidator::end_generation`** into a private `record` (the `invalidate` call, returning `Option<EndReport>`) and a private `enqueue(&EndReport)`. `end_generation` calls them in that order, then cancels.
6. **Rebuild E8** as `record` → `host.close_dataset` → `enqueue`, asserting that the event's `session` equals `open.session`.
   - Mutations: `enqueue` reads the reference from `GenerationRegistry` instead of the report (the registered one); and `enqueue` is skipped when `ended_reason` is `None`.
   - E7 also takes the registered mutation and keeps its swap as a second.
   - Rewrite the comment above E5: drop the no-window claim, and replace the bare `:783`, `:1280` and `:1298-1301` cites (already stale) with symbol names.
7. **K6:** assert that `host.catalog().names()` is empty after the refusal, before the retry, and correct the comment.
8. **The sink's `Admitted` arm gets one `eprintln!` line**, following the kernel's post-check convention in `kernel/src/lib.rs`. It carries the reason's wire spelling only: no reference, no dataset handle, no duration.
9. **Mark the two coverage-lost detail strings `[P6 placeholder]`.** The mint-race arm needs one string per reason.
10. **Rename every test to its §4 name** (A1–A13, K1–K14, W1–W3, E1–E10) and give A11 its registered name, so the caller-grep and `verify-test-claims` resolve them.
11. **Optional (K5):** injecting `CoverageLost` rather than `Change` would match case (c)'s trigger.
12. **Budget.** Shell phase 2 has only about 150 lines left under the 4,830 total, and the 55-file ceiling is effectively used up. Both will overrun. §7 records that in the closing amendment; it is not a stop.

## For the custodian
- The hand-back's module figures sum to 4,641, not 4,677. That is why Amendment 3 defers every figure to the closing amendment.
- The E7/E8 doc comments cite `close_dataset` lines that are already stale (`:1298`, `:1301`; the calls sit at 1300 and 1303).
- I computed no hash. The closing amendment's pin of the withdrawn comment needs a commit on main (round 15 (e)).

**Files**
- C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md
- C:\dev\wt\source-change-watcher\kernel\src\skp.rs (`SessionInvalidator::end_generation`, `SkpHost::close_dataset`, the `open_dataset` sink, `ticket_drop_under_lock_regression` E5/E7/E8)
- C:\dev\wt\source-change-watcher\kernel\src\lib.rs (`create_from_ticket`'s `EndedByCoverageLoss` arm; the post-check `eprintln!`)
- C:\dev\wt\source-change-watcher\kernel\tests\source_watch_ordering.rs (K5, K6)
- C:\dev\wt\source-change-watcher\engine\tests\source_watch_adapter.rs (A3, A6, A7, A9, A10, A11)
- C:\dev\wt\source-change-watcher\engine\src\watch.rs (`names_match`, `names_match_folds_case`)
- C:\dev\wt\source-change-watcher\protocol\skp\SKP-V0.md (§3; §8's `skp/0.5` entry)
- C:\dev\wt\source-change-watcher\protocol\skp\src\v0\handles.rs (`SessionRef`)
- C:\dev\spatial-ide\protocol\skp\SKP-V0.md (main's 2026-09-24 note)
- C:\dev\spatial-ide\docs\adr\ADR-035-dataset-session-ended-control-plane-event.md
- C:\dev\spatial-ide\state\questions\round-23.md
- C:\dev\spatial-ide\state\consults\2026-09-25-adr-035-decision-4-note.md
