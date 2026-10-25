Reviewed: PR #258 at 7b437be350acb93f4c1210c948147f658e1cadf9, gate 1, architect
Branch and commit: cut/kernel-close-during-open-admission @ 7b437be350acb93f4c1210c948147f658e1cadf9

Verdict: PASS WITH NOTES

I have no shell, so I recomputed no sha256 and ran no `git diff`, no numstat, no cargo and no `gh`. The diff's extent comes from comparing the head file (`C:/dev/wt/kcdo/kernel/src/skp.rs`) with the main checkout's file at a63f5fa5, plus the custodian's numstat in the worker report's filing note. I did not read the PR body.

## Findings by class (AUTONOMY §22)

**Correctness: none.** **Evidence: none.**

**Documentation: two findings, both must be fixed before the merge, with no re-gate (§31).** Neither is the human's wording and neither is red-line text, so the worker or custodian applies these words and the PR body lists them.

**D1. The test's doc comment** (kernel/src/skp.rs @ 7b437be3, the second sentence of the paragraph that opens "**This pins today's behaviour"**) says that "nothing can name the entry before the open returns". The test's own watch does name it, through `host.catalog().names()` (kernel/src/skp.rs:5068 @ 7b437be3). The sentence also leaves out the second premise that note 1 gives for unreachability. Replacement words for that sentence:

> The handle is 16 bytes of OS CSPRNG that only this open returns, and `Catalog::names`, which this test's watch calls, has no product caller, so nothing in the product can name the entry before the open returns.

Clause check:
- "16 bytes of OS CSPRNG": `[0u8; 16]` and `getrandom::fill` (protocol/skp/src/v0/handles.rs:19-23 @ 7b437be3).
- "only this open returns": the handle is minted at kernel/src/skp.rs:1114 and returned at 1295-1297 @ 7b437be3.
- "this test's watch calls": kernel/src/skp.rs:5068 @ 7b437be3.
- "no product caller": I searched for `.names()` over `*.rs` in the worktree, and for `names()` / `Catalog::names` under kernel/src. The only hits are kernel/tests/catalog_replace.rs, kernel/tests/source_watch_ordering.rs, kernel/src/skp.rs:4363 and :5068 (both inside the test module, which opens at :3415), and publish/mod.rs:526, which is a projection's `names()`. There is no hit in frontends/shell/src-tauri/src.

The change costs about one line, so the piece goes from 128 to about 129 of 140 and stays inside Scope.

**D2. The form's Out-of-scope guarantee clause and note 4's guarantee bullet 2 overstate the close-races record.**
- The clause says kernel-generation-close-races declared this state outside its claims. That piece declared `open_dataset` *unchanged* (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md §5, "Declared unchanged"). Its §1 May-not-claim list does not name this interleaving, and its §10 does not qualify claim (i).
- Read literally, §1 claim (i) and §5 Falsification's second bullet ("after `close_dataset(A)` returns … `GenerationState` holds any entry for A") are met by the test's item 4 as well as item 7. At item 4 the inner close has returned `Ok` and `live` holds the name (kernel/src/skp.rs:5133 and :5141 @ 7b437be3).
- Note 4 named only item 7.

The form is append-only, so the fix is an appended amendment. Words, at most three sentences (round 12 (d)):

> ### Amendment 1 — the guarantee reading corrected (written after this piece's test runs were seen)
> The Out-of-scope line's guarantee clause and note 4's guarantee bullet 2 overstate kernel-generation-close-races' record: that piece declared `open_dataset` unchanged (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §5, Declared unchanged), and its §1 May-not-claim list does not name this interleaving. Read literally, its §1 claim (i) and its §5 Falsification second bullet are met by this test's items 4 and 7, in an interleaving the product cannot reach; on note 4's reading, that those claims describe the state at a close's return, they are not. The proof is the test `a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds` (kernel/src/skp.rs @ 7b437be3), items 4 and 7; the fix node `open-dataset-refuses-a-name-closed-during-admission` is to remove that state.

Clause check:
- "declared `open_dataset` unchanged": GENERATION-CLOSE-RACES-PREREGISTRATION.md, §5 (opens at :244 @ a63f5fa5), its Declared-unchanged list, third item.
- "§1 May-not-claim list does not name this interleaving": §1's four May-not-claim items, read whole at a63f5fa5 (performance, A2/S1, viewport_query's live-check-to-mint window, shell behaviour).
- "met by items 4 and 7": the test's item 4 assertions (live generation, record held, watch held) and item 7's final `live_session` assertion, @ 7b437be3.
- "on note 4's reading … they are not": note 4, guarantee bullets 1 and 2, on main.
- "the fix node": PLAN.yaml, node `open-dataset-refuses-a-name-closed-during-admission`, status proposed, at a63f5fa5.

## Notes (none blocks)

**N1. For the human: a consequence of OPEN-1 (A), not a finding on it.** Once this merges, main carries a green test that exhibits the literal falsification condition of close-races' claim (i), at item 4 and not only at item 7. The settlement's PR-body sentence covers this. D2 makes the record say so. The ruling stands as given; I offer no words on it.

**N2. The fix node** `open-dataset-refuses-a-name-closed-during-admission`:
- Its summary matches M1 and the test: the Watching arm, before the mint, refuses as `skp.unknown_dataset` when the catalog no longer holds the name.
- Its *title* claims more than M1 reaches ("so no generation is minted for a name the catalog no longer holds"):
  - M1 checks under the per-open latch, and `close_dataset` never takes that latch (kernel/src/skp.rs:1554-1595 @ 7b437be3). A concurrent close between M1's check and `mint_for_open` is still open.
  - The ChecksOnly arm (:1261-1293) is untouched.
- The fix's own form must either close those windows or narrow the title. I designed nothing for it.
- ADRs a fix in M1's shape would read, none amended:
  - ADR-035 Decision 4: the mint happens per *successful* open. M1 makes this open unsuccessful, so nothing is minted.
  - ADR-035's Note 2026-09-25: the fix removes, on this path, the state that round 22, item 1 calls the defect.
- Not an ADR, but for the fix's form: SKP-V0's `open_dataset` section names no `skp.unknown_dataset` refusal. Whether that refusal is a wire change has to be stated there, on the model of close-races §1's "Wire change: none" reading.

**N3. An observation.** `ArmedWatch::resolves_unchanged`'s documented contract is "A synchronous, lock-free check" (engine/src/watch.rs:41 @ 7b437be3). The test-owned watch breaks that contract on purpose to reach the window. This makes the unreachability stronger: the product's watch cannot call back. The test still uses the real trait signatures, so the seam rule holds. No action is needed.

## Check 1: the five lines against the head

- **Authority:** the PLAN node, filler entry 5, §36 and the filler rule. The filler-rule directive (line 8, read) confirms a five-line form under §21c, the reviewer and the architect from dispatch, §25 (e) set aside, and S3. Holds.
- **Scope:** holds.
  - The head file is 5162 lines and main's is 5034. Main's module closes at :5034, right after T2 (`a_close_drops_its_watch_before_it_returns`).
  - Head :5020-5033 is byte-for-byte the same text as main :5020-5033. The head's additions run from :5034 to :5161, which is 128 lines, and the module closes at :5162.
  - Every product anchor I grepped sits on the same line in both files: `mint_for_open` :574, `open_dataset` :1100, `resolves_unchanged()` :1206, both `SessionRef::mint()` at :1244 and :1277, `close_dataset` :1554, `FlagWatch` arm :4940.
  - The custodian's numstat is 128 / 0. So nothing outside the test module changed, and no existing test changed.
  - 128 is within 140, in one file.
- **Change:** holds. I read the test whole at :5094-5161 @ 7b437be3, with its arm and watch at :5038-5092.
  - `resolves_unchanged` runs a real `host.close_dataset` (:5071).
  - The close returns `Ok` with `cancelled_streams == 0` (:5133).
  - The open returns `Ok` (:5135).
  - The minted generation carries `open.session` (:5141).
  - The catalog no longer holds the name (:5139).
  - `describe` and `viewport_query` return `skp.unknown_dataset` and no ticket is minted (:5149-5153).
  - Nothing is emitted (:5155).
  - The second close refuses, the record is gone, the watch is dropped and the generation stays live (:5157-5160).
  - The product path matches: close's catalog check passes at :1573, then :1584-1593 run, then admission mints at :1244-1246 with no catalog or closing check (`mint_for_open` :574-593).
- **Tests+mutation:** holds.
  - The test name is the one the form names.
  - The M1 doc lines (:5103-5108) name the mutation, the failing expect and the full id bc7b0fbd479f97d05a60f4f48578c9870fed639e.
  - The worker's reported panic location, :5131:27 at the mutated tree, is consistent with the head expect at :5135. The 7 doc lines are absent at bc7b0fbd and M1 adds about 3 lines, and column 27 is where `expect` starts.
  - No `verify-mutation` run was used, and none is called an observation (round 25, item 2).
- **Out-of-scope:** see check 2. D2 is the only wording defect.

## Check 2: Out-of-scope

- **ADR.** No ADR file is in the diff. I read ADR-035's Decision 4 Note 2026-09-25 (lines 149-158 at a63f5fa5).
  - The test records a generation minted after its dataset's close, which is the state round 22, item 1 calls the defect. It names that state as a gap and does not assert that an ADR permits it.
  - Its generation carries a kernel-minted `SessionRef` (:5141), so the Note's invariant holds.
  - The open succeeded and minted, which is consistent with Decision 4's wording.
  - The test asserts nothing that an accepted ADR forbids the code to do.
- **Security.** `mint_hex_id`'s 16-byte `getrandom` (handles.rs:19-23 @ 7b437be3) is untouched, and there is no product diff.
- **Wire.** There is no file under protocol/ in the diff and no message text. The test reads only the existing `skp.unknown_dataset`.
- **Guarantee.**
  - No product line changes.
  - Close-races claims (i) to (v) (§1 :79-84 at a63f5fa5) and its falsification (§5 :270-273) were read.
  - Note 4's reading of item 7 is that the refusing second close closes nothing, so claim (i), which concerns a close that closes, is not engaged. That reading holds for item 7.
  - The literal reading is met at item 4 as well. That is D2 and N1, a record wording, not a code property.

## Check 3: the reading the human ruled (OPEN-1 (A), directive of 2026-10-25, item 1)

- **Pins today's behaviour in full and is named for the defect:** yes. All seven of note 1's items are asserted, the live generation included at items 4 and 7. The name states the state.
- **The doc comment's four things:** all present and true.
  - "pins today's behaviour: a known gap the product cannot reach": true, with D1's premise fix.
  - "M1 below is the fix shape": true.
  - "A fix flips this test, and it is then replaced under the fix's own form": true.
  - "It claims no property": true.
- **M1 flips it by name:** M1 fails it at the open's expect, by name.
- **Does anything read as a property or as a guarantee that the state is correct?** No.
  - The step comments state facts ("leaves the generation live").
  - The failure messages ("the open returns Ok although a close ran inside its admission") are framed as the defect.

## Check 4: the fix node

The summary matches M1 and the test. The title overreaches M1's reach (N2). A fix in M1's shape reads ADR-035 Decision 4 and the Note 2026-09-25 and amends neither. The SKP-V0 `open_dataset` refusal set belongs to the fix's own form.

**Round 25, item 2's fail-by-name checks:**
- No full-form §7 overrun, since this is a five-line form.
- No scope addition.
- No `verify-mutation` run is called an observation.
- In this report, test text on the unmerged branch is cited with commit 7b437be3, and no span is pinned by hash.
- Out-of-scope's §21a categories stand under §36's setting-aside of (e).

**Could not run:** git, cargo, sha256 and the PR body (no shell or `gh`).

**Files read:**
- C:/dev/spatial-ide/kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-25-kernel-close-during-open-admission-build-worker-report.md
- C:/dev/spatial-ide/state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md
- C:/dev/spatial-ide/state/directives/2026-10-25-filler-entry-5-open-1-a-pr-b-open-1-2-3-a-o1-probe-lead-data-designs-tester-high-runs.md
- C:/dev/spatial-ide/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md
- C:/dev/spatial-ide/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md
- C:/dev/spatial-ide/PLAN.yaml
- C:/dev/spatial-ide/protocol/skp/SKP-V0.md
- C:/dev/wt/kcdo/kernel/src/skp.rs
- C:/dev/wt/kcdo/engine/src/watch.rs
- C:/dev/wt/kcdo/protocol/skp/src/v0/handles.rs
- C:/dev/wt/kcdo/kernel/src/lib.rs
