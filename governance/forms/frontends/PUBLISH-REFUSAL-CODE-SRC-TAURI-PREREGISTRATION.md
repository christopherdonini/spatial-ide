# A publish refusal keeps its typed code at execute and at the pin phase (wave-1 A4-1 and A4-3, src-tauri) — preregistration

**Authority:** PLAN node `publish-refusal-codes-and-attempt-lifecycle`, its second piece. Question round 32, G1 and G3, and the "With them" item (RULED 2026-09-30). A4-2 is closed by G2 and nothing is written for it. The lines are outside the shell hold under round 31, item 2 (RULED 2026-09-30). Origin: wave-1 A4-1 and A4-3 (`state/cloud/wave1/A4.md`, evidence and not Authority).
**Drafted by** the architect agent on the custodian's brief, read at `main` 0f98934. The first piece's form, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, is the shape model, and nothing in its scope is touched here. Earlier reading of these sites: `state/consults/2026-09-30-publish-refusal-codes-architect-draft.md`, sections 1-3. **Committed before any code**, as the first commit of its branch, `cut/publish-refusal-src-tauri`, from main 0f98934 (see the custodian's edits). Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at 0f98934 (the architect had no Bash), in the `path:line` @ rev sha256 form; (2) the bare `:line` cites are written with their full path; (3) the draft's §8 (Portability) is moved, unchanged in substance, into §2 as item 5, so that §8 to §10 keep the template's Block-on-sight, Gates and Amendments, and the Gates line that pointed at it is renumbered; (4) the committed-before-code line names this form's branch, not main: node 3's PLAN `gate` names the first piece's form until that piece's PR merges, and `verify-test-claims` treats only a non-done node's gate file as planned, so on main this form's T1 and T2 would fail it until the first piece lands; (5) this line. Nothing else changed.
**The node closes** only when A4-4's PR and this piece are both done (round 32, "With them").
**Gating:** full. Two §21a grounds apply. First, the change makes the shell meet the shape stated at `protocol/skp/SKP-V0.md:750-758` @ 0f98934 sha256:b514cd6021d219e6a265d28ab7d5d7658cc8fb1648516a1beec68a50f1ffc5c8. Second, it changes user-visible behaviour (the refusal label), which crosses §21c's bound. Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- Reasoned from code. The A4 reproducer on `cloud/wave1-A4` is evidence, not Authority, and nothing from that branch merges.
- Sites:
  - execute: `frontends/shell/src-tauri/src/publish.rs:734` @ 0f98934 sha256:e65253fe4166202a1df3cca916cc03da29ac9c7bd08f87a09d2974838b525e14;
  - pin phase: `frontends/shell/src-tauri/src/publish.rs:1073` @ 0f98934 sha256:4fd968ac5caa65c7dc66a65bb2978887f17726b8f6e96030730b06ec326aa85f, surfaced by `frontends/shell/src-tauri/src/publish.rs:417` @ 0f98934 sha256:cba54ce3ceb74ca4987ed5f3b24d69f52cea054ccbc72c020f4edbe82ee9add1;
  - the two preflight sites that already call `refusal_detail`: `frontends/shell/src-tauri/src/publish.rs:409` @ 0f98934 sha256:bda50e59246bcfe053c7b9c53e31f6046d9a637c0717001d382c7314a72c8c76 and `frontends/shell/src-tauri/src/publish.rs:513` @ 0f98934 sha256:983e61222e14a7279e8789de6a1e2ca19f1c090e6bea4dfa083cc868a973dcb7.
- Untyped refusals on this seam that are not `PublishError`s stay untyped and are out of scope:
  - `frontends/shell/src-tauri/src/publish.rs:518` @ 0f98934 sha256:80212b759091473eb23b3ea1ffaa6b5139b5ff676f0aa5544d9f31562b588fbd, `frontends/shell/src-tauri/src/publish.rs:531` @ 0f98934 sha256:80212b759091473eb23b3ea1ffaa6b5139b5ff676f0aa5544d9f31562b588fbd, `frontends/shell/src-tauri/src/publish.rs:543` @ 0f98934 sha256:80212b759091473eb23b3ea1ffaa6b5139b5ff676f0aa5544d9f31562b588fbd, `frontends/shell/src-tauri/src/publish.rs:556` @ 0f98934 sha256:ed07ba2ee677d2304a5757da33c11c14a2fe347e169b0c4922f095211972db8a, `frontends/shell/src-tauri/src/publish.rs:662` @ 0f98934 sha256:c4dd3dfcab954b4cc7efdaf7df0908c5ad13a5f9445f960fdf41810e351237b5 (all `PermissionError`);
  - `frontends/shell/src-tauri/src/publish.rs:690` @ 0f98934 sha256:f759377094e24f1e9ac28027977b32acef52d46cd83b5ed0b60a4d50e75f8e48 (`AuditError`);
  - `frontends/shell/src-tauri/src/publish.rs:577` @ 0f98934 sha256:642f4fb8539c036fbdc2c98a8271860e1ac86b0f5b8d4610762574cc6f5e8f75 (the CSPRNG string);
  - `frontends/shell/src-tauri/src/commands.rs:290` @ 0f98934 sha256:44dc269bbb79c8b4fcc9f9425ddc7332040b4a1ac2fe748ad7fa1f82cd8a1546 (the viewer string).
  - The SKP-V0 list at `protocol/skp/SKP-V0.md:754-756` @ 0f98934 sha256:512eb294ac719122dada9e9e01c427e119337061c60a373823f9e9c8f458caba names some of them as examples. The scoping sentence covers all of them.
- The test-only `ensure_pinned` (`frontends/shell/src-tauri/src/publish.rs:1037-1043` @ 0f98934 sha256:580f3034033956b975f24d0ee73a7832266e582b8a1249e1687e9c8b53bc5bc5) inherits the new `Failed` string. It has no product caller, and no test asserts its `Err` text.
- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:**
  - a `BoundaryError::Publish` reaching the execute arm crosses to JS as `PublishError::refusal_detail()`;
  - a non-cancel pin-phase `EngineError` crosses as `publish.engine` through `PublishError::from(e).refusal_detail()`;
  - the panel shows that code as the label and the Display, unchanged, as the message.
- **May not claim:**
  - a code for any non-`PublishError` refusal;
  - anything about A4-2's per-cause codes;
  - anything off Windows (R5);
  - any `docs/08` figure.
- **Unchanged:** no new code, no new or changed Display string, no kernel, protocol, engine or TS product edit, no ADR amended, no new dependency, no new `pub` item.

## §2. The change
1. Execute (A4-1): in `execute_with_progress`'s final match, add the arm `Err(BoundaryError::Publish(e)) => ExecuteOutcome::Refused { message: e.refusal_detail() }` ahead of the catch-all. The catch-all keeps `e.to_string()` for `Permission` and `Audit`.
2. Pin phase (A4-3): `ensure_pinned_with_progress`'s `Err(e)` arm becomes `EnsurePinnedOutcome::Failed(PublishError::from(e).refusal_detail())`. The type is named through the existing `spatial_kernel::publish` import or a path, either way.
3. Comments: at most 2 lines at each site, naming the SKP-V0 bullet. The module doc's claim that a refusal crosses as plain Display text (`frontends/shell/src-tauri/src/publish.rs:29-30` @ 0f98934 sha256:cbdb725831561173f15af49f3db8c8b267fea1a8f260b2e0fa58d5bd8ed573a9) is already false at the preflight sites. It is corrected to state both conventions, in at most 4 lines.
4. Nothing else. The following are untouched:
   - `ExecuteOutcome`, `PrepareOutcome` and `EnsurePinnedOutcome`'s shapes;
   - the `OutcomeNotAudited` arm and the `Cancelled` arm at `frontends/shell/src-tauri/src/publish.rs:1072` @ 0f98934 sha256:f3fcc32cd84d5256a78017b74fb22c4100a7b805fbcc3fc3dcdc3f7557551853;
   - `ensure_pinned`;
   - `kernel/**`, `protocol/**` including `SKP-V0.md`, `engine/**`;
   - every TS product file;
   - `MANUAL-WALKTHROUGH.md`.
5. **Portability** (`state/directives/PORTABILITY-2026-09-30.md` §2, rule by rule; round 32, "With them"):
   - **R1:** met. `refusal_detail` is pure formatting, the codes are the same on every platform, and T2 re-derives the engine Display rather than matching OS text.
   - **R2:** not engaged. There is no `cfg`, and the one nearby boundary, publish's OS error classification (`kernel/src/publish/error.rs:386-425` @ 0f98934 sha256:40735e09b590a87c74113d787ebe9647efdf58b304050002fdd0cd7c88cd7cab), is untouched.
   - **R3:** not engaged. The piece is not OS-dependent, so there is no per-platform statement.
   - **R4:** met.
     - Product code and TS get no drive letter, backslash, `LOCALAPPDATA` or OS-keyed rule.
     - T4's literal is a labelled Windows capture, and its assertions are OS-neutral.
     - F2's deletion has a precedent on Windows CI (`engine/tests/session_identity.rs:555-558` @ 0f98934 sha256:e9f52afa33726fafd557fff7633ee79ea37e9293506817519046fd8af34f4756) and always succeeds on Unix.
   - **R5:** the claim is Windows L1 only. `src-tauri` has never compiled off Windows (PORTABILITY §1c item 3).
   - **R6:** no test is ignored on any platform. A new ignore is block-on-sight.

## §3. Fixtures and predicted outcomes
- **F1** (T1): the suite's `prepared` helper (50 features, LV95, pinned) with the audit-log environment set. `execute_with_progress` is called with a `CancelToken` cancelled before the call.
  - Predicted after the fix: `ExecuteOutcome::Refused`, the message equal to `publish.cancelled: ` followed by `PublishError::Cancelled`'s Display, and the destination absent.
  - At base: the same Display with no prefix.
- **F1c** (T1, control): a second prepared attempt executed with a wrong phrase.
  - Predicted before and after: `Refused`, the message not starting with `publish.` (a `PermissionError`).
- **F2** (T2): `unpinned_fixture` (10 features, LV95). The source file is removed after `Dataset::open`, then `prepare_with_progress` is called with a fresh token and no sink.
  - Predicted after the fix: `PrepareOutcome::Refused`, the message equal to `publish.engine: ` followed by the Display of the error that `ds.pin_content_observed` returns on the same deleted path. That is an `EngineError::Source` whose detail begins `open for hashing: ` (`engine/src/index.rs:614-615` @ 0f98934 sha256:5799b2241a407640077def8996b3e7ee7c375a582c06f196f5da0df8fb0f6b7e). No pin is taken, and nothing is stashed.
  - At base: the same Display with no prefix.

## §4. Tests, one mutation each
- **P0** (before any product code): T1 and T2, committed first and run at the branch base, each fail on their prefix or equality assertion by name. This is the reproduction.
- **T1** `an_execute_time_publish_refusal_carries_its_typed_code_and_a_permission_refusal_does_not`, in `publish.rs` `mod tests`, on F1 and F1c. It asserts:
  - F1: the message equals `format!("publish.cancelled: {}", PublishError::Cancelled)`, and the destination does not exist;
  - F1c: the message does not start with `publish.`.
  - Mutation: delete the new `BoundaryError::Publish` arm. F1's equality then fails by name.
- **T2** `a_pin_phase_engine_failure_refuses_as_publish_engine`, in `publish.rs` `mod tests`, on F2. It asserts:
  - the outcome is `Refused`;
  - the message starts with `publish.engine: `;
  - the remainder equals the engine error's Display, re-derived at run time from the same call, so no assertion depends on OS text (R1);
  - the remainder does not start with `publish.`;
  - `content_pin()` is `None`, and `store.len() == 0`.
  - Mutation: restore `e.to_string()` at the pin-phase line. The prefix assertion then fails by name.
- **T3** (`frontends/shell/src/publish/PublishPanel.test.ts`, `nextStateFromDialogSettled`), the seam test from the real shape.
  - Input: an `ExecuteOutcome` `refused` whose message is T1's received string, byte-captured at the fix commit (temporary print, run, record, revert).
  - Asserts: `refusal.code` is `publish.cancelled`, and `refusal.message` is the string without the prefix.
  - Mutation: in `nextStateFromDialogSettled`'s refused arm, bypass `formatPublishRefusal` with a fixed `publish-refused` label. T3 then fails by name.
- **T4** (same file, `nextStateFromPrepareOutcome`), the seam test from the real shape.
  - Input: a `PrepareOutcome` `refused` whose message is T2's received string, byte-captured the same way. It carries Windows OS text; it is labelled as a Windows capture at its commit and no assertion depends on that text.
  - Asserts: `refusal.code` is `publish.engine`, and the message has no `publish.` prefix.
  - Mutation: the same bypass in the prepare-refused arm.
- T3 and T4 pass at base because the consumer is unchanged. They prove the seam and are not reproductions.
- Mutations are observed by applying one, running the named test, recording its failure by name with the commit, and reverting it. A `verify-mutation` run is not an observation (round 25, item 2 (c)).
- Timing: nothing asserts elapsed time (round 25, item 1 (a)).

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** P0 fails at base for T1 and T2. T1 to T4 pass on the fix, and each fails under its own mutation.
- **Declared unchanged (green before and after):**
  - in `publish.rs` `mod tests`:
    - `a_second_execute_on_the_same_attempt_id_is_unknown_not_a_stale_approval`;
    - `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt`;
    - `a_row_predicate_refuses_through_prepare_with_the_p0_message_and_stashes_nothing`;
    - `execute_with_progress_emits_every_phase_reached_stamped_with_the_right_attempt_id`;
    - `ensure_pinned_pins_an_unpinned_dataset_and_is_idempotent_on_an_already_pinned_one`;
    - `an_unpinned_dataset_still_refuses_through_the_pin_free_path_but_prepare_now_pins_it`;
    - `cancel_during_the_pin_phase_produces_a_typed_cancelled_outcome_with_no_side_effect`;
    - `prepare_with_progress_reports_the_pin_phase_and_still_reaches_a_prompt`;
    - `a_license_refusal_reaches_prepare_with_progress_before_any_pin_is_taken`;
    - `seventy_sequential_prepare_execute_cycles_never_hit_the_grant_ceiling`;
  - `frontends/shell/src-tauri/tests/sole_caller_scan.rs`;
  - `frontends/shell/src/publish/formatPublishRefusal.test.ts`, the existing `PublishPanel.test.ts` cases, and `frontends/shell/src/admission/formatRefusal.test.ts`;
  - `kernel/tests/typed_terminal_codes.rs`;
  - `PublishError::code`, `refusal_detail` and every Display, byte for byte;
  - walkthrough row G4.
- **Invalidators:**
  - **Stop:** keeping the code needs a new code, a new or changed string, a kernel, protocol, engine or TS product edit, or an outcome-shape change. Amend and route to the human.
  - **Stop:** a consumer is found that matches an execute-time or pin-phase refusal by equality or by prefix on the unprefixed text (TS product code, `e2e/*.mjs`, or a walkthrough row). Route it.
  - **Invalid run:** P0 passes at base for T2 (the refusal came from `preflight_pinless`, already prefixed), or F2's `remove_file` fails. F2 is re-declared by a class-2 amendment.
- **Falsification:**
  - a `PublishError` reaches the execute arm through a `BoundaryError` variant other than `Publish`;
  - a `Failed` reaches `PrepareOutcome::Refused` with a code other than `publish.engine`.

## §6. Instruments
Assertions only: the outcome variant, the message prefix and equality, the destination's absence, the pin and store state. No measurement.

## §7. Declared values and ceilings
- No new constant.
- **Size budget:** ≤ 170 changed lines, insertions plus deletions over non-generated code and tests, excluding this file.
  - Files: ≤ 2, `frontends/shell/src-tauri/src/publish.rs` and `frontends/shell/src/publish/PublishPanel.test.ts`.
  - Counted by `git diff --numstat <base>...HEAD -- frontends/shell/src-tauri/src frontends/shell/src` at a named commit.
  - An overrun is class 8.

## §8. Block-on-sight
1. Any edit outside the two files in §7, including `kernel/**`, `protocol/**` including `SKP-V0.md`, `engine/**`, TS product files, `MANUAL-WALKTHROUGH.md`, and A4-4's files.
2. A new code, a new `PublishError` variant, a new or changed Display string, or a prefix composed anywhere other than `refusal_detail`.
3. A code given to a non-`PublishError` refusal.
4. A change to `ExecuteOutcome`, `PrepareOutcome` or `EnsurePinnedOutcome`, to the `OutcomeNotAudited` arm, to the `Cancelled` arm, or to `ensure_pinned`.
5. A new `pub` item.
6. A timing assertion.
7. A `cfg`, a platform ignore, or OS-keyed logic (R2, R4, R6).
8. T1 to T4 missing, P0 unobserved, or a mutation unobserved; a record calling a `verify-mutation` run an observation.
9. Any file from `cloud/wave1-A4` merged or cherry-picked.

## §9. Gates
- **Architect:**
  - `protocol/skp/SKP-V0.md:750-758` @ 0f98934 sha256:b514cd6021d219e6a265d28ab7d5d7658cc8fb1648516a1beec68a50f1ffc5c8;
  - round 32, G1 and G3;
  - `docs/01` principle 8;
  - the seam rule (T3 and T4 from the real shape);
  - the caller rule;
  - §2 item 5 rule by rule, and §8 checked one by one.
- **Reviewer:** the full diff; P0 observed; four mutations observed.
- **Suites:**
  - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`;
  - `npm run verify` in `frontends/shell`;
  - `verify:cites` and `verify:plan`;
  - CI's `node --test` scripts suite.
- **Operator:** none required.
  - Visible change: the refusal block's code label (`frontends/shell/src/admission/RefusalBlock.tsx:28` @ 0f98934 sha256:2d1706f12e7fea5fc9c570cefbd7eaf4de9c5f0528eca465b8390907976d41e5) reads `publish.cancelled` after Cancel publish, `publish.engine` for a failed pin, or the refusal's own `publish.*` code at execute, instead of `publish-refused`. The message is unchanged.
  - The human accepted this label change in ruling G1 (round 32).

## §10. Amendments (opens empty, append-only)

### Amendment 1 — the closing record (class 1, references only)

Written after the piece merged (class 1).
- **The merge:** PR #149 merged at 2026-09-30T20:33:26Z as merge commit 88e238b (parents 98ad9ca and a633b02), not a squash. 4a2bb00 (this form), 55ce85e (B), cc9c9a1 (C), 855d826 (D) and a633b02 are reachable from main, so this form's commit precedes its code on main (the gate-1 architect, item 1 (b)).
- **The gates:** gate 1 at a633b02, PASS/PASS: `state/consults/gates/2026-09-30-publish-refusal-src-tauri-gate1-architect.md` and `state/consults/gates/2026-09-30-publish-refusal-src-tauri-gate1-reviewer.md`.
- **The observations of record:**
  - P0 at 55ce85e: the gate-1 reviewer's check 2;
  - M1 to M4 at a633b02: the gate-1 reviewer's mutation table;
  - the worker's own runs: `state/consults/2026-09-30-publish-refusal-src-tauri-worker-report-1.md`.
- **Readings the gate made:** committing this form as its branch's first commit is accepted (the gate-1 architect, item 1). The architect's N1 is answered by the reviewer's checks 4 and 7.
- **Size:** 120 against §7's 170, over 2 files. No overrun.
- **The node** closes with its first piece, PR #148 (`kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, the node's PLAN `gate`).
