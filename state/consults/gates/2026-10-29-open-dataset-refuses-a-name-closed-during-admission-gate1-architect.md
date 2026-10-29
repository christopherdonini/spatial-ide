Reviewed: PR #269 at da8c6cdc1eab427c6f5a4c521698748a0528104e, gate 1, architect
Branch: cut/open-dataset-refuses-a-name-closed-during-admission @ da8c6cdc1eab427c6f5a4c521698748a0528104e (base fa3d09f6, main cac8cba0)
Verdict: PASS WITH NOTES

I have no shell, so I recomputed no sha256 and ran no command. I read every file at the head in the worktree `C:/dev/wt/odr`, and the form, directives, ADR, PLAN and AUTONOMY on main.

## Findings by class

**Correctness: none.** The check is placed where the Change line puts it: after `resolves_unchanged` and the signal refusal, before `SessionRef::mint()` (kernel/src/skp.rs:1250-1254 at head). The guard is dropped, then the watch, and the call returns `SkpError::unknown_dataset`. Nothing is minted or inserted after it. The ChecksOnly arm (:1273-1305), `close_dataset`, `Catalog` and `GenerationRegistry` are unchanged. The lock order has no cycle.

**Evidence: none blocking.** The fix-alone run, M1, M2, M3 and the head runs rest on the filed worker report, and the custodian's filing note sums the head runs. I could not re-run any of them. That re-run is the reviewer's.
- One reporting nit, not on the PR: the report gives M3's failing line as skp.rs:5173 without saying it is the mutated file's line. At commit 2, the assertion `the open inserted no record` sits at the line the head's :5176 maps to. M1 is labelled the same way; M3 is not.

**Documentation: must-fix before the merge, no re-gate (§31). None of these sentences is the human's wording.**

- **D1. The new test's summary line** (skp.rs:5108-5110) states the refusal for any close "after the catalog insert and before the mint". A close after the check and before the mint is also in that span, and it is not refused. "nothing minted, inserted" is also wrong for the open as a whole: the handle was minted (:1116) and the entry inserted (:1177-1179). The paragraph below names the two open windows, so this is not an unsupported guarantee, but the sentence itself is wrong.
  - Replacement words (wrap at 100 columns): `KCDO. A close run from inside the Watching arm's admission, in the watch's `resolves_unchanged` (after the catalog insert and before the check that precedes the mint), makes the open refuse as `skp.unknown_dataset`: no generation is minted, no `OpenRecord` is inserted and nothing is emitted.`
  - Clause check:
    - "in the watch's resolves_unchanged": the close runs there (:5079-5087), called at :1208 under the latch, in the Watching arm.
    - "after the catalog insert": the insert is at :1177-1179 (lib.rs:233).
    - "before the check that precedes the mint": the check is at :1250, the mint at :1256.
    - "refuse as skp.unknown_dataset": :1253; the test asserts it at :5162-5163.
    - "no generation": the return comes before :1256-1258; asserted at :5173-5175.
    - "no OpenRecord": the return comes before :1261; asserted at :5176.
    - "nothing emitted": asserted at :5193.

- **D2. "proposed node", now stale.** The human placed `open-dataset-close-serialised-under-the-catalog-lock` (OPEN-1 (A), state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:28). PLAN.yaml on main holds it, status blocked, depends_on this node.
  - **(a) The test doc, skp.rs:5117-5118.** Replace `The proposed node `open-dataset-close-serialised-under-the-catalog-lock` takes them.` with `PLAN node `open-dataset-close-serialised-under-the-catalog-lock` takes them.`
  - **(b) The SKP-V0 source comment's last sentence, protocol/skp/SKP-V0.md:55.** These are the architect's words from note 5, not the human's. Replace `The remaining window is proposed as its own node.` with `The remaining windows are PLAN node open-dataset-close-serialised-under-the-catalog-lock.`
  - Clause check:
    - The id is in PLAN.yaml on main.
    - Its title covers both arms and the close's forget and removal, so it covers both windows.
    - The plural matches the two windows the comment's own previous sentence names.

- **D3. The block comment, skp.rs:5047-5050.** "X pinned, and Y replaced, the test below" reads as if the earlier form pinned the test below. It pinned the old test.
  - Replacement words (wrap at 100 columns): `// `kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md` pinned the test that // `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` replaced with the // test below: a real close run from inside `open_dataset`'s admission. No sleep, spawned thread // or timeout.`
  - Clause check:
    - The earlier form's Tests line pins the old name; the old test is at main skp.rs:5111.
    - This form's Tests line names the replacement.
    - The test body (:5137-5198) holds no sleep, no spawn and no timeout.

- **D4. The form's guarantee clause.** The Out-of-scope line says close-races' §1 claim (i) and §5 Falsification second bullet "are no longer met". It uses "met" in the earlier form's Amendment 1 sense. Note 7 of the same form says claim (i) "is now met". Read plainly, claim (i) (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md §1, its item (i)) now holds in the pinned interleaving, and the second Falsification bullet no longer fires.
  - The form is append-only, so the fix goes in the closing amendment the settlement already requires, as a correction of two sentences:
    `The guarantee clause of this form's Out-of-scope line, and the earlier form's Amendment 1 it cites, use "met" for close-races' §1 claim (i) where the test's state contradicts it; read plainly, the earlier test's items 4 and 7 broke claim (i) and fired the §5 Falsification second bullet, and in the pinned interleaving this piece's test shows claim (i) holding and that bullet not firing, as note 7 states. The proof is a_close_during_open_admission_refuses_the_open_and_mints_no_generation, items 4 and 7.`
  - Clause check:
    - Claim (i) is the state after `close_dataset` returns.
    - Main's old test asserted a live generation after the close (main skp.rs:5142, :5161).
    - The new test asserts none (:5173-5175, :5197).

**Observation (no finding).** The inline comment at skp.rs:1187-1190 still gives the lock order as "latch, then generations". It is true, only incomplete, and it is outside the Scope, which names only the latch's doc comment.

**Reminder.** The settlement's closing amendment carries a superseded pin to this form's own Tests+mutation line.

## Check 1: the constitution and the ADRs

- **ADR-035.**
  - Decision 4 mints one session reference per successful open (docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:83).
  - The Note of 2026-09-25 calls a generation minted for a closing dataset the defect (:153-155).
  - A refused open reaches no `SessionRef::mint()` and no `mint_for_open` (:1250-1254 before :1256), so the piece is consistent with both and nothing in the ADR needs amending.
- **ADR-006.** The operation class is unchanged. The close already removed the catalog entry, and the refusal adds no workspace state: no generation, no record, no marks.
- **docs/02 and docs/10.** The change is a control-plane error on an existing command (docs/10_SKP_Protocol.md:16). There is no data-plane change, and no MCP or bulk data is involved.
- **The wire.**
  - The human's sentence sits at SKP-V0.md:54, in §1's `open_dataset` section, before `### describe`. By reading it matches the quoted span at state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 character for character. No hash was recomputed.
  - `skp/0.12` stands.
  - §8's preamble (SKP-V0.md:572-575) lets §§1–7 be updated in place where a version note says so. The new note (:1132-1134) says exactly that, in the words of OPEN-2 (B).
  - It is appended at the end of §8, after the skp/0.12 entry, and the 2026-10-09 no-bump note is its precedent.
  - The error constructor is unchanged (protocol/skp/src/v0/error.rs:64-72). Its message ("closed, or never opened this session") states an engine fact that is true here.
- **The seam.** No new seam. `admitDataset.ts:57-63` handles any `SkpCallError` from `open_dataset` generically. The path is unreachable in the product. No `pub` item is added: `Catalog::get` is an existing `pub fn` (lib.rs:237-239).

## Check 2: the five lines against the head

- **Scope.**
  - The three files the Scope names. 122 lines against 140, by the custodian's numstat in the filing note. No product line outside the Watching arm changed.
  - The test-module diff is confined to the block comment, the test's doc comment and the test's body. I compared the helper items with main skp.rs:5040-5092: `Inside`, `CloseOnAdmissionArm`, `CloseOnAdmissionWatch`, `live_session` and `assert_unknown_dataset` are unchanged.
  - The earlier form gains only Amendment 3. Head lines 125-150 match main's; numstat 9/0.
- **Change.** Met as worded. The guard is dropped before the watch, the same order as the refusal path at :1215-1221.
- **Tests+mutation.**
  - The replacement test exists and its assertions follow note 4 in order.
  - Each mutation fails where the line predicts, by tracing the code: M1 at `expect_err` (:5162), M2 at the first `no live generation` (:5173), M3 at `the open inserted no record` (:5176).
  - Each `RECORDED MUTATION` line names its commit. The labels read `RECORDED MUTATION (Mn):`, not the bare `RECORDED MUTATION:`. No script keys on the literal: the hits under scripts/ are prose and comments.
  - No `verify-mutation` run is called an observation.
- **Out-of-scope.**
  - ADR: true (check 1).
  - Security: `DatasetHandle` minting is unchanged (handles.rs:19-23).
  - Wire: as the human words it, with no fixture, type or TS change.
  - Guarantee: the substance holds; the "met" wording is D4.
  - §36 (AUTONOMY.md:692) sets §25 (e) aside for filler pieces, so a five-line form that names wire and guarantee categories stands.

## Check 3: the claim

- **Two windows stay open:** a close after the check (:1250, nothing guards it to :1256), and the ChecksOnly arm, which has no check.
- **Neither is reachable in the shipped app.**
  - The handle is 16 OS-CSPRNG bytes (handles.rs:19-23), returned only by this open.
  - `Catalog::names` (lib.rs:252-254) has no product caller. Every `.names()` hit in the worktree's `.rs` files is a test (kernel/tests/catalog_replace.rs, kernel/tests/source_watch_ordering.rs, skp.rs:4375 and :5082, both in `mod ticket_drop_under_lock_regression` from :3427), plus a projection's `names()` at publish/mod.rs:530.
- **Where they go.** The windows belong to `open-dataset-close-serialised-under-the-catalog-lock`, which is placed. That is D2.
- **No overclaim beyond D1.**
  - The test doc names both windows and the reason they cannot be reached.
  - The SKP-V0 source comment says the same and claims nothing further.
  - The Watching arm's comment (:1245-1249) speaks only of the in-`resolves_unchanged` close.

## Check 4: the records

- **Amendment 3 on the earlier form.**
  - Append-only: main's file ends at line 150, and the head adds lines 151-159.
  - Its heading says it was written after the fix commit and the first kernel run, which is true by the report.
  - Both pins are at fa3d09f6, the piece's base on main (round 15 (e)). Each is contiguous on one line, carries "superseded" and names the replacement. It states which is authoritative (the tree at that commit) and that the pins are historical.
  - The report says verify-test-claims does not list line 9 (that line sits inside a code fence); the pin is harmless either way. I could not run the tool.
- **This form's settlement.** It records OPEN-1 (A), OPEN-2 (B) and OPEN-3 as ruled at state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:28. The PR applies them: the §8 note is present, and the worker wrote the pins in the replacing piece at base.
- **5b running on during piece F** agrees with state/directives/2026-10-29-section-37-for-now-release-step-in-checklist-section-0-5b-runs-on.md item 3.
- **Rule (00) at dispatch** (only this piece touching protocol/) needs a branch diff, which I cannot run. It is left to the reviewer and the custodian.

## Check 5: the docs against the code

- **The lock-order doc (skp.rs:1002-1008), clause by clause:**
  - "latch, then the catalog's read guard, then generations": :1193, then :1250, then :1257.
  - "the only place that ever holds the latch with either": the sink's PreAdmission arm only records, and its Admitted arm drops the guard before `end_generation` (:1149). Both refusal paths drop the guard before `catalog.remove` (:1215-1216, :1285-1286).
  - "taken and released inside `Catalog::get`, before the mint": lib.rs:237-239. The `Arc` temporary drops at the end of the `if` condition.
  - "`Catalog` never reaches the latch": the latch is a per-call local (:1129), and `Catalog` holds no reference to it.
  - True.
- **The new test's doc comment.** True apart from D1 and D2(a). The fix-alone line matches main's expect text (main skp.rs:5136).
- **The block comment.** D3.

Files read:
- C:/dev/wt/odr/kernel/src/skp.rs
- C:/dev/wt/odr/protocol/skp/SKP-V0.md
- C:/dev/wt/odr/kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md
- C:/dev/wt/odr/kernel/src/lib.rs
- C:/dev/wt/odr/protocol/skp/src/v0/handles.rs
- C:/dev/wt/odr/protocol/skp/src/v0/error.rs
- C:/dev/spatial-ide/kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md
- C:/dev/spatial-ide/PLAN.yaml
