Reviewed: PR #261 at ce318b5ef99124f42dae00c4c41aa163e4dcf8aa, gate 1, architect
Branch: cut/session-generation-other-recorded-mutations-name-no-commit @ ce318b5ef99124f42dae00c4c41aa163e4dcf8aa

Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. There is one Documentation finding, which must be fixed before the merge without a re-gate.

I have no shell. I recomputed no sha256 and ran no git, cargo or verify script. I read the head at `C:/dev/wt/sgo`. I read the base in the main checkout, whose working tree is at 391d9058. Its two commits after 2a6adbb1 are custodian records by their subjects (68ca7dd2, 391d9058). I could not confirm by git that `kernel/src/skp.rs`, `kernel/src/lib.rs` and the test file are unchanged across them. The worker's report records equal blob ids at 564a98b2, 2a6adbb1 and its head.

## Findings by class

**Correctness:** none.

**Evidence:** none. The runs are the worker's, as its report records them. I compared each recorded outcome with the code at the base by reading (check 2), and each agrees. Form note 2 also requires the reviewer's own re-run of all five, and that is the reviewer's to report.

**Documentation (must-fix before merge, no re-gate; not the human's wording, since form note 1 says none of W-A to W-F is):**

- **D1, W-C's premise sentence (head `kernel/tests/session_generation.rs` :243-245).** The sentence "Every public method that reads the attributions prunes before it reads them, except `invalidate`" is untrue as worded. `forget_dataset` reads the attributions in `st.tickets.retain(|_, (d, _, _)| d != dataset)` (skp.rs:832 at base) and makes no pruning call (:827-837). W-C's conclusion still holds, because `forget_dataset` answers nothing. Only the premise overstates.
  - **Replacement:** on head line 243, replace the words `reads the` with `answers from the`. The line becomes:
    `/// `invalidate` prunes after it removes the generation. Every public method that answers from the`
    That is 98 columns, so no rewrap is needed. Lines 244-246 stay as they are.
  - **Clause check:**
    - `attributed_ticket_count` prunes at :660 and then reads `st.tickets.len()` at :661.
    - `ticket_liveness` prunes at :680 and then reads `st.tickets.get` at :690.
    - `invalidate` collects at :795-800 with no prune before it on the `Some` arm, and prunes only at :816. It remains the named exception.
    - `forget_dataset` returns `()`, so it answers from nothing.
    - `mint_for_open` answers `st.next` (:581-582).
    - `live_generation`, `ended_reason` and `dead_ticket_count` answer from `live`, `invalidated` and `dead_tickets`.
    - `begin_close` is `pub(crate)` and does not touch `tickets` (:767-770).
    - With "answers from", every clause of the sentence is true at the base.
  - **Cost:** the numstat stays at 49/17, within the budget of 90.

## Check 1: the five lines against the head

- **Authority:** the node is at PLAN.yaml:3193-3209 on main, with the gate set to the form, the branch named, `budget_minutes: 90` and generation 1. The pins are historical, and I did not recompute their hashes.
- **Scope:**
  - Only doc lines changed. Removed: C1 2, C2 3, W-F's sentence 3, C4 3, C5 4, which is 17. Added: 7 + 8 + 8 + 5 + 13 + 8, which is 49. This matches the 49/17 numstat.
  - I read each test body at base against head and found no code line, assertion, message, fixture or name changed. The shifts are consistent: +5 after C1, +10 after C2, +16 after C3, +28 after W-F and W-D, +32 after C5.
  - 66 lines against 90; one file.
- **Change:**
  - M-A and M-E are recorded FAILED, M-B and M-C PASSED, and M-D1 as not building.
  - M-D2 is recorded as a reading "never observed" (head :279).
  - W-F removes "internally consistent".
  - Each of the five comments names `2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf`, which is on main.
- **Tests+mutation:**
  - No test was added.
  - No head comment and no line of the worker's report calls a `verify-mutation` run an observation. The `verify-mutation.mjs` mention at head :44 is a 12ccbeb comment outside the Scope and was there before this piece.
  - The predicted outcomes equal the recorded ones (check 2).
- **Out-of-scope:** see check 3.
- **W-A to W-F in place:** I compared each fence in form note 1 line by line with the head:
  - W-A at :121-127
  - W-B at :150-157
  - W-C at :239-246
  - W-F at :267-271
  - W-D at :273-285
  - W-E at :572-579

  Each matches, with only `<base>` replaced by the 40-hex commit.

## Check 2: the words against the code at base and the recorded outcomes

- **W-A:**
  - The statements it replaces are at skp.rs:628-631, and the `closing` refusal is at :625-627.
  - `next` is written only at :581, and the incremented value is used at :582. No other `st.next` exists in skp.rs. The unit-test modules lock it with `let st` (immutable), so generation 0 is never issued.
  - The closure pattern has the shape of :738.
  - The recorded failure matches the base assertion :136-139, message "an ended session attributes nothing".
- **W-B:**
  - The filter is at :798.
  - `mint_for_open` prunes at :580 before it inserts at :583.
  - `invalidate` removes the live generation (:789) before collecting and prunes only at :816.
  - `forget_dataset` drops the dataset's tickets (:832). `begin_close` makes no pruning call.
  - So an older-generation attribution reaches `invalidate` only through a re-mint over a live name, as the words say.
  - The test mints ds_a and ds_b once each (head :161-162).
  - `open_dataset` mints a fresh handle at :1114 and passes it to `mint_for_open` at :1246 and :1279. There is no other product caller of `mint_for_open`: grep finds only test modules in skp.rs (lines from :3576 on) and `kernel/tests/*`.
  - The PASS is as recorded.
- **W-C:**
  - The call is at :624, and `invalidate`'s prune is at :816.
  - The readers that prune first are :660 and :680, and `invalidate` collects without a prior prune at :795-800.
  - The clock route is the age half (:734-737).
  - One premise is untrue (D1). The conclusion, that the call is unobservable without a clock, is true.
- **W-D:**
  - The field is at :438, and all 10 non-test `self.inner.lock()` sites are at :575-828.
  - `SourceFactory: Send + Sync + 'static` is at transport.rs:154.
  - `AdmissionMode::TicketOnly` holds `generations: Arc<skp::GenerationRegistry>` (lib.rs:321-324), and the impl is at lib.rs:389.
  - The worker's other two sites are lib.rs:679 (`impl BatchSource for EngineSource`, with `BatchSource: Send` at transport.rs:114) and skp.rs:1132 (the `WatchSink` closure). Both are consistent with an `Arc` of a non-`Sync` type.
  - On the torn read: `total` counts every `true` (head :313-320), and the final `invalidate` prunes before the count of 0 (:324-329). True.
- **W-E:**
  - The loop is at :808-812 and the prune at :816.
  - After the prune, `live` lacks ds_a, so :736-739 sweeps sh_a1 and nothing is inserted.
  - The base assertion :563 fails with `left: 0`, as recorded.
- **W-F:**
  - The join with `expect("no thread panicked")` is at head :313-316, `total > 0` at :317-320, and the end and count at :324-329.
  - At base, `true` is returned only under the lock that checks `live` (:622-635).

## Check 3: Out-of-scope

- **ADR:** none.
- **Security:** none (ADR-020, ADR-009 and ADR-021 untouched).
- **Wire:** nothing under protocol/. `SourceFactory` appears in words only.
- **Guarantee:** I concur with the form's reading in note 4. No assertion, message or name moved, so no property under test changed. W-B, W-C and W-D's second half withdraw detection claims the tests never made. The gaps they record are disclosures, and for W-B the human has the proposed node `invalidate-generation-clause-observed-by-a-test` (PLAN.yaml:3210-3226) to place.
- **Outside this piece's Scope, not blocking, for the queue:**
  - The module doc at head :6-9 ("Every rule it holds is asserted here: … invalidation's ticket collection, … the lock under concurrent use") now reads more broadly than the file's own W-B and W-D record.
  - The test names `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended` and `the_registry_is_consistent_when_two_threads_use_it_at_once` keep claims the doc lines now narrow.
  - The Scope forbids changing names, so these are a candidate docs-lane or filler entry, not a finding on this PR.

## Check 4: the worker's disclosures

1. **The tar file beside the export folder, deleted at once.** This was a write-location lapse with no bearing on the evidence. The export was then extracted by pipe, and the worker records the three files as sha256-equal to `git show 2a6adbb1:<path>`.
2. **The revert and the next unmutated run in one message.** This has no bearing on the evidence. The M-D1 file does not build, so the passing M-E unmutated run cannot have compiled it. The worker records the restored skp.rs equal to the base by `cmp` and sha256. The reviewer's independent re-run (form note 2) is the second observation.
3. **M-B leaves an unused `tg` beside `g`.** This is true: the pattern `(d, tg, _)` at :798 keeps `tg`. W-B's words make no claim about warnings, so they are unaffected. Form note 1's W-B clause check names only `g`. That note is append-only form reading and needs no correction under the record cap.
4. **M-D1's three E0277 errors.** These do not meet the stop rule, because the SourceFactory site is present with E0277. W-D's "among any other sites" covers the other two.
   - One error in the report, not in the words: it names two `generations.inner.lock()` sites in the unit-test module (:4373, :4529). Grep finds six: :4373, :4529, :4583, :4640, :4752 and :5086.
   - All six sit in `mod ticket_drop_under_lock_regression` (`#[cfg(test)]`, :3414-5163), so the report's conclusion that the integration-test build does not compile them holds for all six.

Not run: any cargo, git, verify-* or sha256 check (no shell); path disjointness under rule (00), which I take from the custodian's settlement.
