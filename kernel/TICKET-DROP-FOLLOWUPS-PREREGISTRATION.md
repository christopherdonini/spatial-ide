# StreamRegistry tickets — the no-drop-under-guard invariant made unwind-safe and checkable: preregistration

- **Decomposes:** PLAN node `kernel-ticket-drop-followups` (`PLAN.yaml:1558-1574 @ c9f41126 sha256:66059639834d2709d83c8e2a1f67bcc14c4728023fe1c3177a49d52c74cf42b5`), placed by question round 31, item 1. PR #116 deferred these items when it landed: `state/gate-log.json` indices 173 and 174 (the architect's and the reviewer's attempt 2) and 176 (the architect's attempt-3 re-read). Index 177, the reviewer's attempt-3 pass, defers two of them as well. The predecessor is `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md` (DECISIONS-PENDING.md entry 132). Its record closed at the record cap (index 176 counts two record rounds), and this piece does not amend it.
- **Drafted by** lead-data on the custodian's brief, under the 2026-10-03 lead-data clarification. The inputs are listed in §0, read at main `c9f41126`. The architect gates this draft. lead-data does not review it.
- **Gating:** full form and full two-agent gating. The change touches a stated invariant, which is the stated-guarantee bullet of AUTONOMY.md §21a (`AUTONOMY.md:325-327 @ c9f41126 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7`). It does so on the never-block path. An Out-of-scope line would therefore name a §21a category, so the template's Round 25 additions (Out-of-scope at dispatch) rule out a five-line form.
- **Committed before any code**, as its own commit.
- **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line, and states what work it touches or invalidates.

## §0. Disclosure

- **Inputs, all read at `c9f41126`:**
  - the PLAN node;
  - gate-log indices 173, 174, 176 and 177;
  - the whole predecessor form;
  - from `kernel/src/skp.rs`: `StreamRegistry`, `SessionInvalidator::end_generation` and the `ticket_drop_under_lock_regression` module;
  - from `kernel/src/lib.rs`: `EngineSource` and its `Drop`;
  - the owner's index of `kernel/` and of `engine/`.
- **Not found: the gate reports behind indices 173, 174 and 176.** They are not filed in the repository at `c9f41126`.
  - The labels N3, N4 and R-S5, and the PLAN summary's reference to the architect's drafted text, occur only in `PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `site/data/plan.json`, `state/CUT-STATE.md` and `state/gate-log.json`. `state/consults/gates/` holds no file dated before 2026-09-27.
  - §2's text is therefore this draft's own. It is mapped item by item to the PLAN summary, and it is not the architect's drafted text.
- **No architect-drafted text exists for this piece.** None is filed at `c9f41126`, and none was supplied for this form. §2.1 is this draft's own text, and nothing in this form presents it as the architect's. The parenthetical `architect, PR #116 attempt 1, S1` in §2.1's first line is carried from the current doc comment (`kernel/src/skp.rs:152 @ c9f41126 sha256:b9a750d259d00466075f9ad092f446b3ee58216fb8044aabf719bdb4802dcf9e`). It credits the original invariant, not §2.1's wording.
- **The predecessor has no §10.** It is a five-line form with a Results section and Amendments 1 and 2. This draft reads those two amendments as its amendment record.
- **Hypothesis H1 (labelled as a hypothesis).**
  - Claim: at `c9f41126`, a panic that unwinds out of `cancel` or `cancel_all_for_dataset` hangs the panicking thread, with the registry's lock still held, when `swept` or `retired` holds a `Pending` state whose `EngineSource` recorded a change at its post-check.
  - Reasoning, step 1: locals drop in reverse order of declaration. `swept` and `retired` are declared after the guard (`kernel/src/skp.rs:298-305 @ c9f41126 sha256:9f73e4e5a23866f3e47c282738bebc0b200ee636ceef087d7fddcb18754b63ea`, `kernel/src/skp.rs:344-348 @ c9f41126 sha256:dea6d203c402e0f59edc7fd34e9e2f5bf13f527206cda2b6b87e65bd376fa3bf`), so an unwind drops them first, while the guard is still held.
  - Step 2: `EngineSource`'s `Drop` reaches `SessionInvalidator::end_generation` (`kernel/src/lib.rs:636-641 @ c9f41126 sha256:eb4c96d3101e6b60cc1c185b7ef2cc640900186f1341e19a63e2c0f596a1872d`, `kernel/src/lib.rs:592-607 @ c9f41126 sha256:da4c2ce49bfde668871ce060824ca525d53fc72db504488eaf927d2dcf2ac67d`).
  - Step 3: `end_generation` calls `StreamRegistry::cancel` for each of the generation's tickets (`kernel/src/skp.rs:894-898 @ c9f41126 sha256:a2728a9f0154c4e429be6d2d68f3ac5440650857b53b2dbb836e39038b2fcc49`), and that call locks the held `Mutex` on the same thread.
  - Discriminator: §4's three tests, committed before §2's code and run against the `c9f41126` code. H1 predicts that each fails by timeout (§5, P1).
- **Panic routes.**
  - The only call made under the guard that a test can make panic is `SourceCancel::cancel`, in the `Redeemed` arms of `cancel` and `cancel_all_for_dataset` (`kernel/src/skp.rs:329 @ c9f41126 sha256:094db9f631da7d01cf4458af89296d6e83ca4ae2eab18d3d90798440fbe77217`, `kernel/src/skp.rs:367 @ c9f41126 sha256:094db9f631da7d01cf4458af89296d6e83ca4ae2eab18d3d90798440fbe77217`). It is a call through the data plane's trait.
  - The shipped implementation of that trait, `EngineCancel` → `CancelToken::cancel` (`kernel/src/lib.rs:699-705 @ c9f41126 sha256:f7ba4a049c7a18e445db48b65657924a84a87f593a9162fe17b186f26f078bde`, `engine/src/cancel.rs:120-133 @ c9f41126 sha256:21b38380fe35b22ea91e8218d270ac0d95b64e0a8e55e56fcab66f4a4620963b`), is written not to panic.
  - Inside `mint`, `StreamHandle::mint()` calls `expect` on the OS CSPRNG (`protocol/skp/src/v0/handles.rs:19 @ c9f41126 sha256:9f250652bff28c3a3c965f7482ab9a97014765e6e73556282abb0d17a9069f8a`). No test can induce that panic.
  - The piece is defensive: no run has observed an unwind under the guard.
- **Unwinding is live in shipped builds.** A search of every `Cargo.toml` in the checkout for a `panic =` key found none. The root release profile is the repository root's `Cargo.toml`, lines 49-57 at c9f41126, sha256 d60209a7929888184b674801a3f7d3ded1589837889102a64ec46ffed94b8efd.
- **Fixture-drive confound:** not applicable. Nothing reads the 5 GB fixture.
- Every `path:line` in this form is a historical pin at `c9f41126`. A worker re-derives every cite it touches.

## §1. What this preregistration may and may not claim

- **May claim:**
  - The no-drop-under-guard invariant, widened as §2.1 states, holds on the return path, and on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`.
  - Three tests prove the unwind half at the two sites where a test can start an unwind: the `SourceCancel::cancel` calls in `cancel` and in `cancel_all_for_dataset`. The `StreamHandle::mint` case rests on the declaration order, read at the gate (§8, item 2), because no test can induce that panic (§0).
- **May not claim:**
  - any performance number, or any `docs/08` row;
  - anything about macOS or Linux, since the hang that is observed depends on std's `Mutex` not being re-entrant, and it is observed here on Windows only;
  - unwind-safety on an unwind out of a std call while a value that owns an `EngineSource` is in flight under the guard (§2.6 (a));
  - that a test exercises the `debug_assert` (§4).
- **No wire change:**
  - no SKP literal, field, refusal code or `CancelOutcome` mapping changes;
  - no public signature of `StreamRegistry` changes;
  - no `protocol/**` file changes.
- **Not a crossing piece (C2 of the 2026-10-03 lead-data clarification).**
  - Behaviour changes only on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint` while the guard is held.
  - At `c9f41126` the only shipped `SourceCancel` for this registry is kernel-internal: `EngineCancel` in `kernel/src/lib.rs` (`kernel/src/lib.rs:699-705 @ c9f41126 sha256:f7ba4a049c7a18e445db48b65657924a84a87f593a9162fe17b186f26f078bde`). It is written not to panic (§0).
  - `StreamHandle::mint`'s panic route is its `expect` on the OS CSPRNG (§0).
  - `mint`, which takes the `SourceCancel`, is called only from inside `kernel/`. No other module can put a panicking `SourceCancel` into this registry, so no contract another module consumes changes.
- **ADRs and principles:**
  - Full gating rests on docs/01, principle 7 (`docs/01_Principles.md:13 @ c9f41126 sha256:8c6bcdb7ff11f95750cac89842afa4c90b6dff5a3ed5e3aaaab8994b458bcf44`) and derived rule 1 (`docs/01_Principles.md:20 @ c9f41126 sha256:6e49121b8e9dfcb3be371c4a50007e385092470d4601943c98cca95133f92637`), and on ADR-018 Decision 1's `cancel_requested` (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:45 @ c9f41126 sha256:604ad3d56b4a21f39cd69a0e08ba17a86e6fccf0fa4cfd3c4dabe9f672487d93`).
  - ADR-019 is Proposed and binds nothing (`docs/adr/ADR-019-control-plane-admission-tickets.md:3 @ c9f41126 sha256:fc621681dcff98bdcf336c62d8c7aecf99fcecd4535f1c0256ecaac550823d61`). It is named only as the mechanism this code belongs to.
  - No ADR is amended. No operation class changes (ADR-006).
- **No performance risk.** Each method gains stack locals, and a check that compiles only with debug assertions.
- **Nothing user-visible.** The `debug_assert` message and the tests' panic messages are developer-facing.
- No new dependency, and no KNOWN-LIMITATIONS row.

## §2. The change, stated before it is applied

All of the change is in `kernel/src/skp.rs`. The PLAN summary's items map to this section as follows:
- the invariant over every value that owns an `EngineSource`, mint's refused source included → §2.1;
- declaring `swept` and `retired` before the guard → §2.2;
- the `debug_assert`, with `prev` kept alive past `drop(tickets)` → §2.3;
- the enumeration naming redeem's remove → §2.1's third bullet;
- the test doc comments naming the predecessor → §2.4.

**2.1 The invariant.** This text replaces the doc comment of the `tickets` field (`kernel/src/skp.rs:152-161 @ c9f41126 sha256:0788d39c16670684af65604371fe2fd8800ba4dddd27bfcdf8b08a694123160a`). It is drafted text, new and not a quotation. It may be reflowed to rustfmt width with its words unchanged.

    /// **Invariant (architect, PR #116 attempt 1, S1; widened by
    /// `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` §2): no `TicketState`, and no other value
    /// that owns an `EngineSource`, is dropped while this guard is held, on the return path or on an
    /// unwind out of `SourceCancel::cancel` or `StreamHandle::mint`.** The values, by site:
    /// - `sweep_locked`'s removed entries, moved into the `Vec` it returns (`swept` in each caller);
    /// - the `Pending` state `cancel` or `cancel_all_for_dataset` retires, moved out by
    ///   `mem::replace` (`retired`);
    /// - the `Pending` entry `redeem` removes: its `built.source` and `built.cancel` move into
    ///   `redeem`'s `Ok(..)` value, which its caller owns once the guard is released;
    /// - `insert`'s return in `mint` and `redeem` (`prev`): `None` by construction (`mint` inserts a
    ///   freshly minted [`StreamHandle`]'s key; `redeem` re-inserts the key it removed under the same
    ///   guard), and `debug_assert`ed only after the guard is released;
    /// - `mint`'s `source` and `cancel` when [`MAX_PENDING_TICKETS`] refuses them: parameters, which
    ///   drop after every local of the body, the guard included.
    /// Each method declares those of `swept`, `retired` and `prev` it uses. It declares them before
    /// it takes the guard, and locals drop in reverse order of declaration, so an unwind releases the
    /// guard first. On the return path each method calls `drop(tickets)` before any of them drops.
    /// The unwinds covered start in `SourceCancel::cancel`, the only call made under this guard
    /// through a trait object, or in `StreamHandle::mint`, which `mint` calls while `source` is still
    /// a parameter. Not covered: an unwind out of a std call while a value that owns an
    /// `EngineSource` is in flight, as in `sweep_locked`'s `filter_map(..).collect()`,
    /// `cancel_all_for_dataset`'s `retired.push(mem::replace(..))`, `redeem`'s `Pending` arm between
    /// its `remove` and its `Ok(..)`, or `mint`'s `insert` call once `source` has moved into its
    /// argument.

The draft removes a claim from the current text: that each method has its own `// Entry 132` comment. The `cancel` and `cancel_all_for_dataset` comments do not carry that prefix.

**2.2 Declaration order.**
- In each of the five methods below, `swept` is declared before `self.tickets.lock()` and assigned after it:
  - `sweep_expired` (`kernel/src/skp.rs:209-215 @ c9f41126 sha256:664a2dd07834c8b9d0d2c307acded2c5a7082e2ce1e484b73adc8aefd2cc0f7a`);
  - `mint` (`kernel/src/skp.rs:219-250 @ c9f41126 sha256:8c1b91fd7efdb783448f9572d29ed6f0b1ae87ab5a507a2d9aa095ef26f9c66d`);
  - `redeem` (`kernel/src/skp.rs:254-294 @ c9f41126 sha256:5e18ba5206702898b62a9bb2dfbe9427d610bd441833be366eae14aead7bcf7b`);
  - `cancel` (`kernel/src/skp.rs:297-340 @ c9f41126 sha256:97fe03a2bc70b93e4d0130b25c778ac2a14c346bf7bf36c67f260cb05d465699`);
  - `cancel_all_for_dataset` (`kernel/src/skp.rs:343-379 @ c9f41126 sha256:f2614e55637eaf7dd82032c48eab1927841c5537b894ad4f98231d11bca817bb`).
- In `cancel` and `cancel_all_for_dataset`, `retired` moves above the guard too, keeping its present initialiser.
- The worker chooses a form that compiles with no new rustc or clippy warning and no new `allow`.
- The order on the return path is unchanged: `drop(tickets)`, then `swept`, then `retired`.

**2.3 `prev` and the `debug_assert`.**
- In `mint` (`kernel/src/skp.rs:235-242 @ c9f41126 sha256:14a0fd650ba45a084b623bf777f4408ff6facba68c49f01285a049b35ff4784a`) and in `redeem` (`kernel/src/skp.rs:278-286 @ c9f41126 sha256:b0f5d7eaf441c944c08db5e4feadd1a0ef324bf6a9ed82231b6ba29c4cc0d0fe`), `insert`'s return is assigned to `prev`, which is declared as `None` before the guard.
- Immediately after `drop(tickets)`, a `debug_assert!(prev.is_none(), ..)` checks it, with a message naming the method. `prev` drops last, after `swept`.
- So a firing assert panics after the guard has been released.
- In a build without debug assertions, a `Some` drops after the guard rather than under it. §2.1 makes that `Some` unreachable by construction.

**2.4 Test doc comments.** Two doc comments in the regression module refer to the predecessor as "this preregistration":
- `kernel/src/skp.rs:3148 @ c9f41126 sha256:160864dea09720709706a015e36e590cb93ca7185933dd4bbfcdb24b8b04de8a`, in the doc of `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`;
- `kernel/src/skp.rs:3295-3296 @ c9f41126 sha256:334bd01bf71ceee127e7f3aff244e5129fb1f096b2b26ab8405d3fba35a6490e`, in the doc of `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`, where the words are split across the two lines.

In each, those words become `` `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`'s ``. No claim in either comment changes. The edit is made in this piece's own diff, not as an amendment to the predecessor.

**2.5 Two doc edits in the same region.**
- **`sweep_locked`'s doc** (`kernel/src/skp.rs:170-177 @ c9f41126 sha256:6c072960876ab68bb38b777afb93cbeb250c909d858cc5add53dc229060dcd99`) gains one sentence: each caller declares `swept` before it takes its guard, so an unwind also releases the guard first.
- **Three stale line cites in the regression module's comments** become symbol cites:
  - `kernel/src/skp.rs:2980 @ c9f41126 sha256:2b8fd5c68bfc32811907a2a80cb42bba89a71e5fb27d5bc986bbf892b7800b65`: the producer's `record_source_changed` call, which is at `engine/src/stream.rs:1324-1329 @ c9f41126 sha256:b402412256b7fb11f0700d0e4aa723baa3f2dcd579b2cbb9c73229a605b31bf6`;
  - `kernel/src/skp.rs:2991 @ c9f41126 sha256:d4e4bf679136558529dccfa2cbda43c8984c4457aa712eecac6d2733696179b2`: `EngineCancel`, which is at `kernel/src/lib.rs:699-705 @ c9f41126 sha256:f7ba4a049c7a18e445db48b65657924a84a87f593a9162fe17b186f26f078bde`;
  - `kernel/src/skp.rs:3049 @ c9f41126 sha256:c2c44cbf6f39303339af030111d11f827c1f1f6af5017b5219d4cd45a48e1105`: `touch_modification_time` in `kernel/tests/session_generation.rs`, which is at `kernel/tests/session_generation.rs:338 @ c9f41126 sha256:314f56bcd43b6fb933d49ccc4a3576314259220af5df28808c0179c955451b8c`.
- No other comment in the file is audited by this piece.

**2.6 Residuals: named, not fixed.**
- **(a) An unwind out of a std call: not covered.** Such an unwind drops, while the guard is held, any value that owns an `EngineSource` and is then in flight as an arm binding, an expression temporary, a call argument or a partly built collection. The four known sites, as examples:
  - `sweep_locked`'s `filter_map(..).collect()`: the partly built `Vec` and the removed value it holds drop in `sweep_locked`'s own frame, before they reach `swept`, while the caller's guard is held (`kernel/src/skp.rs:193-196 @ c9f41126 sha256:aba7e2317ba5331f365d817b57315e805336267aff1c53455f2fdd6be529f787`);
  - `cancel_all_for_dataset`'s `retired.push(mem::replace(..))`: the argument drops if `push`'s growth panics (`kernel/src/skp.rs:353-358 @ c9f41126 sha256:0c40514d324fc44191f3b4cbd8438d6487dce65c40b1f7c0a28094358eab9f9e`);
  - `redeem`'s `Pending` arm, from its `remove` to its `Ok(..)` (`kernel/src/skp.rs:272-287 @ c9f41126 sha256:647146c74ab0d2b30e6799219be2e35ae92d3e388b81072215bbb730d5d876bc`);
  - `mint`'s `insert` call, once `source` has moved into its argument (`kernel/src/skp.rs:235-242 @ c9f41126 sha256:14a0fd650ba45a084b623bf777f4408ff6facba68c49f01285a049b35ff4784a`).

  The calls at these sites are std's, and none is a trait-object call. No test can start an unwind at any of them.
- **(b) The unwind's own failure mode.**
  - Suppose the panicking `SourceCancel` belongs to a ticket of the same generation that the dropped source then ends. During the unwind, `end_generation` cancels that ticket, and that cancel calls the same `SourceCancel::cancel` again, because the ticket's `cancelled` flag was never set.
  - A second panic there aborts the process. At `c9f41126` the same sequence hangs instead.
  - The shipped `EngineCancel` is written not to panic (§0).
- **(c) `redeem`'s `unreachable!` arm.** The value it would drop is not `Pending`, so it owns no `EngineSource`.

**2.7 Portability.** Not an OS-dependent feature, so R3's section does not apply. The tests observe a hang because std's `Mutex` is not re-entrant, and that is observed on Windows only (§1).

## §3. Fixtures / corpus — pre-declared outcomes

There is no committed fixture or corpus, so there is nothing to hash-verify.
- Each new test generates its own 50-feature GeoParquet under `target/fixtures/ticket-drop-under-lock/`, through the module's `fixture` helper (`kernel/src/skp.rs:3030-3046 @ c9f41126 sha256:ed97bce00a906aa83a1265033e16074817382b5554a86fbbbe4e9a3b819a2eaf`).
- Each test only moves its file's modification time forward (`kernel/src/skp.rs:3052-3060 @ c9f41126 sha256:acc6169ba9086bc17d3a13b2751d8c0e13c8c157e69e95b9fc24540734cc045b`), so the run leaves the file's bytes unchanged.

| Fixture stem | Test | Tests committed first, run against the `c9f41126` code | After §2 |
|---|---|---|---|
| `unwind-cancel-swept` | T1 | fails by timeout | passes |
| `unwind-cancel-all-swept` | T2 | fails by timeout | passes |
| `unwind-cancel-all-retired` | T3 | fails by timeout | passes |

## §4. Tests, and the mutation per new test

**Common setup.** All three tests go in `ticket_drop_under_lock_regression`, after the predecessor's four.
- **Test-only types.** The module defines its own `BatchSource` stub, and a `SourceCancel` whose `cancel` panics with a message naming the test. It needs its own because the `tests` module's `synthetic_source` (`kernel/src/skp.rs:2326-2346 @ c9f41126 sha256:ac7c6f6e67e3cb1d3c3293d0ccf33e377dd920411bdf92e552e73d03d45a873c`) is private to that module.
- **Ticket Q.**
  - Minted with the stub and the panicking cancel, then redeemed, so the registry holds it `Redeemed` and not cancelled.
  - Q is never attributed to a generation. So the generation end that the unwind triggers never cancels Q, which would make Q's cancel panic a second time (§2.6 (b)).
- **Ticket P.**
  - A real `EngineSource` over a drained stream whose post-check recorded a change (`kernel/src/skp.rs:3067-3087 @ c9f41126 sha256:c5db39c92f3516c70b8288fb1bbebe7294e001ae9b6a217573210b8311205bda`).
  - Minted and attributed to its dataset's live generation, as `seeded_pending_ticket` does (`kernel/src/skp.rs:3106-3139 @ c9f41126 sha256:4155f3f0ddd5250f4ed1d105736ba51cea07841d7e0f91c881d6937e1af779ed`), but in the registries the test already holds.
  - Q is minted and redeemed before P is seeded, so no sweep removes P before the call under test.
- **The call under test** runs on a spawned thread through `run_with_timeout` (`kernel/src/skp.rs:3092-3101 @ c9f41126 sha256:55f2741972183e98fa2e9422d6fdb5a0026e39636264e8149be229a55c192c62`), inside `catch_unwind`.
- **Each test asserts three things:**
  - the call returned within `HANG_TIMEOUT`; otherwise the test fails on a "did not return within" message that names it;
  - the call panicked, which shows the unwind happened;
  - `GenerationRegistry::ticket_liveness` of P is `EndedBySourceChange`, which shows P's source was dropped and not leaked.
- **Doc comments.** Each test's doc comment names this form by its path. It records its mutation as planned until the mutation has been observed, and the observation is recorded with its commit (§10).

**The three tests and their mutations:**
- **T1 `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`.**
  - Setup: P is backdated past `TICKET_TTL` under the lock, as at `kernel/src/skp.rs:3203-3220 @ c9f41126 sha256:ed753bc7f3161cc5193bf85ee7b1ccdcc4e1dfb27fe2cfe3ca7d96da36f85cc0`. P and Q are in different datasets.
  - The call is `cancel` on Q.
  - Mutation M1: in `StreamRegistry::cancel`, declare `swept` after the guard again, which is `c9f41126`'s order. Expected: T1 fails by timeout on its own message, and T2 and T3 pass.
- **T2 `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard`.**
  - Setup as T1. The call is `cancel_all_for_dataset` on Q's dataset.
  - Mutation M2: the same change in `cancel_all_for_dataset`. Expected: T2 fails by timeout. T1 and T3 pass, because T3's `swept` is empty.
- **T3 `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`.**
  - Setup: P is not expired, and P and Q are in one dataset D.
  - Precondition, established under the registry's lock before the call: P's key comes before Q's in the map's iteration order. While it does not, the test moves P's entry to a fresh `StreamHandle` key, at most `MAX_REKEY_ATTEMPTS` times, and otherwise fails by name. It attributes P's final key only after that.
  - The call is `cancel_all_for_dataset` on D.
  - An extra assertion: afterwards, P's entry is `CancelledBeforeRedeem`, which shows P was retired before Q's cancel panicked. If the precondition failed, the test fails by name rather than passing vacuously.
  - Mutation M3: in `cancel_all_for_dataset`, declare `retired` after the guard again. Expected: T3 fails by timeout. T1 and T2 pass, because their `retired` is empty.

**No test for six of the nine declarations.** These are:
- `swept` in `sweep_expired`, `mint` and `redeem`;
- `retired` in `cancel`;
- `prev` in `mint` and `redeem`.

No test can make a call panic between their assignment and `drop(tickets)` (§0, panic routes). The gate checks them by reading (§8, item 2).

**No test for the `debug_assert`.**
- No caller can reach its condition (§2.1). Reaching it would need a test-only seam in product code, which the caller rule forbids.
- Observation O1 instead, made once and recorded with its commit:
  - Replace `mint`'s key with a fixed string.
  - Expected: `tests::the_pending_ceiling_is_per_dataset_and_declared` (`kernel/src/skp.rs:2455-2468 @ c9f41126 sha256:3776cafa441bd740a8a9dce4e9441c4b38327d84994dda2c6eac4ff5b41877fe`) fails at the `debug_assert`'s own message on its second mint.
  - Then revert.
- O1 shows that the assert is compiled into test builds and fires. It is not a new test, and it carries no mutation of its own.

**Unchanged in code:** every test of `skp::tests` and of `ticket_drop_under_lock_regression`, with their recorded mutations.

## §5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions:**
- **P1.** The three tests, committed before §2's code, each fail by timeout against the `c9f41126` code (H1).
- **P2.** After §2, T1 to T3 pass, and `cargo test -p spatial-kernel` passes with no other test changed.
- **P3.** M1, M2 and M3 each fail exactly their own test, by timeout, and leave the other two passing.
- **P4.** O1 behaves as §4 states.

**Declared unchanged:**
- The return-path drop order in all five methods: the guard, then `swept`, then `retired`, with `prev` added after them. So every swept or retired value still drops before its method returns, and ADR-018 Decision 1's `cancel_requested` instant does not move.
- Every public signature, SKP response, refusal code and `CancelOutcome`.
- The recovery of a poisoned lock in every method (`unwrap_or_else(|e| e.into_inner())`).
- The predecessor's four tests, their recorded mutations, and the predecessor's file.
- The body sentence at `kernel/README.md:177-179 @ c9f41126 sha256:96475332300218a30378f24c5f46a8e47dccc15ddee4de9608ab7e0c05458150`. It states the `TicketState` half, which §2.1 keeps, so it stays true as written.
- Every file in `engine/`.

**Invalidators, each of which stops the piece and is reported:**
- **I1.** P1 fails: some test does not hang against the `c9f41126` code. Then the route §0 states is not what the code does. No test is weakened to fit.
- **I2.** A test can reach its unwind only through a seam in product code.
- **I3.** A test can pass only by changing the return-path order or a public signature.
- **I4.** T3's precondition cannot be established. Or it holds, and T3's `CancelledBeforeRedeem` check still fails, which would mean the map's `values_mut` order differs from its `keys` order.
- **I5.** No form of §2.2 compiles without a new warning or a new `allow`.

**Falsification:**
- **F1.** With §2 applied, a value that owns an `EngineSource` is shown to drop while the guard is held, on the return path or on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`.
- **F2.** With §2 applied, any of T1 to T3 aborts the process instead of returning a caught panic.

## §6. Instruments

Every quantity here is an assertion. There is no measurement, and no `docs/08` row.

| Question | Instrument |
|---|---|
| Did the call return, or hang? | `run_with_timeout`'s bounded receive, against `HANG_TIMEOUT` |
| Did the call unwind? | `catch_unwind`'s result |
| Was P's source dropped, not leaked? | `GenerationRegistry::ticket_liveness` |
| Did T3's precondition hold? | the state of P's entry, read under the registry's lock |

## §7. Declared values and ceilings

- No product constant is added or changed.
- `HANG_TIMEOUT` (5 s, `kernel/src/skp.rs:3028 @ c9f41126 sha256:30f094a7beca8b92f1a92b592c887a699c96acd542d308cacc06929620710348`) is reused. It bounds how long a hung call is waited for.
- `MAX_REKEY_ATTEMPTS = 64` is test-only and declared at its own site in the regression module. It bounds T3's re-keys.
  - Assumption, labelled: with two entries, a uniform hash puts P first about half the time on each attempt. On that assumption, exhausting the bound is about 2^-64 likely.
- **Line budget:** at most 320 insertions plus deletions in `kernel/src/skp.rs`, counted by `git diff --numstat <merge-base>..<head> -- kernel/src/skp.rs` at the head the final gate reads.
- **Files:** `kernel/src/skp.rs`, this file, and `kernel/README.md` (owner's-index lines only, per C1).
- An overrun is recorded as class 8.
- **Time budget:** 90 minutes, the PLAN node's `budget_minutes`.

## §8. Block-on-sight

1. A change to the return-path drop order in any of the five methods, other than adding `prev` last.
2. `swept`, `retired` or `prev` declared after the guard in any of the five methods. This is read at the gate, because six of the nine declarations have no test.
3. The `debug_assert` evaluated while the guard is held, or `prev` dropped before `drop(tickets)`.
4. A test-only seam, a `cfg(test)` branch, or a new `pub` item in product code.
5. A change to an SKP literal, a refusal code, a `CancelOutcome` mapping or a public signature. Or a change to any file other than `kernel/src/skp.rs`, this file, and the owner's-index lines of `kernel/README.md`.
6. A new test that does not assert its own unwind and P's drop. Or T3 without its `CancelledBeforeRedeem` check.
7. Any edit to `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`.
8. A new rustc or clippy warning, or a new `#[allow(..)]`, in `kernel/src/skp.rs`.
9. The invariant's doc comment claiming an unwind out of a std call (§2.6 (a)), or its bold first sentence claiming an unwind without naming `SourceCancel::cancel` and `StreamHandle::mint`.
10. A mutation recorded as observed without its commit, or a `verify-mutation` run named as the observation of a mutation (the template's Round 25 additions).
11. The owner's-index update missing from the PR, or not matching the diff (C1).

## §9. Gates

- **Architect:**
  - docs/01, principle 7 and derived rule 1;
  - ADR-018 Decision 1;
  - ADR-019, as the mechanism only;
  - the caller rule, checked against §4's test-only types;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - the declaration order, read in all five methods;
  - M1 to M3 and O1, re-observed;
  - every pin, recomputed.
- **Suites, green before either gate:**
  - `cargo test -p spatial-kernel --lib skp::`
  - `cargo test -p spatial-kernel`
  - `cargo clippy -p spatial-kernel --all-targets`, with no new warning
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`
  - `node scripts/plan/verify-quotes.mjs`
  - `node scripts/plan/verify-cites.mjs`
  - `node scripts/plan/verify-test-claims.mjs`
  - `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`
  - `node scripts/plan/verify.mjs --offline`
- **Owner's index (C1 of the 2026-10-03 lead-data clarification):**
  - lead-data writes the update once the implementation is ready, and before the final gate;
  - the worker applies it in this PR;
  - the final review checks it against the diff.
- **Operator:** none. Nothing user-visible changes, so there is no walkthrough row.

## §10. Amendments — opens empty, append-only

