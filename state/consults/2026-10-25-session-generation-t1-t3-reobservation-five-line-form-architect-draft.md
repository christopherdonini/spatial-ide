*Custodian's filing note (2026-10-25): the architect's read-only draft, ahead, of the five-line form for `session-generation-t1-t3-reobservation`, the filler queue's entry 6a (S3), read at main a305e541 while entry 5 (#258) is in its gate. Nothing is committed from it until #258 leaves the slot (one filler at a time); then the custodian commits the form on main, its cites pinned by script at a305e541. The custodian's choices on its open items: OPEN-1 (A), W1 included (the node's title asks for T1 describing the arm after #147); OPEN-2 (A), the file's other recorded-mutation comments that name no commit left out, proposed as node `session-generation-other-recorded-mutations-name-no-commit` for the human to place; the node's budget 60 minutes, from 0, as its note 3 gives. The run 18:39:10Z to 18:44:56Z by its transcript (Grep 15, Read 20, Glob 1; no write tool). Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 8ecae862729d94c0b050582162c9adc1798a1e5ebfe25b1d32edfb8f88b0d485.*

---

Drafted: session-generation-t1-t3-reobservation, five-line form, architect

Read at: main @ a305e541 (read only; no file changed). I have no shell, so this draft carries no sha256. The custodian expands each `path:line @ a305e541` cite by script. I could not read branches or git history.

## The five lines

```
Authority: PLAN node `session-generation-t1-t3-reobservation` (PLAN.yaml:3176-3192 @ a305e541), generation 2; filler queue entry 6a, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:14 @ a305e541; state/FILLER-QUEUE.md:13 @ a305e541); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ a305e541): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; routed by question round 59, item 3 (kernel-close-races-followups OPEN-3 (A); kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md, Amendment 1, item 3); the reuse index found no prior art on either search (recorded mutation reobservation; session generation test), a miss noted here.
Scope: 1 file, kernel/tests/session_generation.rs, `///` doc lines only, above T1, T2 and T3; declared line budget 60 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ a305e541); this form exempt; no code line, assertion, message, fixture or test name changes, and no other file changes (the mutations are applied and reverted on an export of the base and never land).
Change: T1's doc names the second read at which #147 made its refusal reachable; each of T1, T2 and T3's `RECORDED MUTATION:` comments restates its mutation against the code at the base (T1's and T2's in `EngineSourceFactory::liveness_refusal`, which `create_from_ticket` composes) and names the 40-hex base commit on main it was observed at, with the failing assertion by its message.
Tests+mutation: no new test; changed in doc comments only: a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code (M1: in `liveness_refusal`, the `EndedBySourceChange` arm deleted and that variant added to the `Live | Unknown => None` arm; predicted to fail on its prefix assertion, the detail `redeem`'s cancelled wording); an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal (M2: in `liveness_refusal`, `Unknown` added to the `EndedBySourceChange` arm, leaving `Live => None`; predicted to fail on its `is unknown` assertion, the detail carrying the `engine.source_changed: ` prefix); the_dead_ticket_record_is_bounded (M3: `forget_dataset`'s `st.dead_tickets.retain(..)` line dropped; predicted to fail on `close clears this dataset's dead handles`, left 1); each observed by applying it alone at the base, running that test alone, recording its failure by name with the commit in its `RECORDED MUTATION:` doc lines, and reverting; a verify-mutation run is not an observation; a mutation that passes, or that fails other than as predicted, is a stop.
Out-of-scope: ADR: no status line or amendment (ADR-035 Decision 2's `create_from_ticket` dead-ticket arm resolves through the composition, by PR #147 gate 1's N3, and is not edited); security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no literal, code or message text; guarantee: none touched: the three tests pin properties under test (the dead-ticket refusal by its code, `Unknown` never a source-change diagnosis, the dead-ticket record's bound), and every assertion, message, fixture and name keeps its text, so no property changes; the comments are corrected to the code at the base and their mutations re-observed; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index.** These lines are byte-copied from the custodian's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs recorded mutation reobservation
No prior art recorded for "recorded mutation reobservation". Research it before planning an implementation.
$ node tools/reuse.mjs session generation test
No prior art recorded for "session generation test". Research it before planning an implementation.
```

## Notes (mine, the architect's)

### 1. What changes: four doc-comment replacements, words whole

None of these is the human's wording; they are doc comments. The worker applies them as written and substitutes only `<base>`, the 40-hex id of the branch's merge base with main, which is a commit on main. This follows the C7 shape at kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:127 @ a305e541. If a run's observed failure differs from these words, the worker stops (note 2) and does not edit the words to fit. Lines are wrapped at 100 columns without changing a word. An identifier longer than a line stays on one line.

**W1: T1's window sentence.** It replaces kernel/tests/session_generation.rs:350-352 @ a305e541. That span starts at "The window this exercises" and runs to "the ticket comes" at the end of line 352, so lines 353-355 stay as they are.

> /// The window this exercises is the one §5 prediction 1 names, with every liveness read after the
> /// end: a ticket minted, its generation ended while the ticket is still pending, and the redemption
> /// arriving afterwards, so `create_from_ticket`'s first read refuses by name. Since
> /// `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` §2b (#147) the same refusal is also reached
> /// when the end is recorded after that first read and before `redeem`, at the second read
> /// `redeem_or_liveness_refusal` makes; that order is pinned in-crate by
> /// `an_end_between_liveness_and_redeem_refuses_by_its_code`, in `kernel/src/skp.rs`'s
> /// `ticket_drop_under_lock_regression` module. Every step runs through the product path — the ticket comes

Each clause checked against the code:
- "the one §5 prediction 1 names": frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:418-420 @ a305e541 names the mint→invalidate→redeem window and says T1 constructs it. Holds. I keep the original's "§5", meaning P3b's.
- "every liveness read after the end … first read refuses by name": T1 ends the generation at step 3 and redeems at step 4 (kernel/tests/session_generation.rs:398-415 @ a305e541). The first read is kernel/src/lib.rs:495-497 @ a305e541, which reaches the arm at kernel/src/lib.rs:517 @ a305e541. Holds.
- "also reached … at the second read": kernel/src/lib.rs:567-569 @ a305e541. The end records before it cancels (kernel/src/skp.rs:914-926 @ a305e541). Holds.
- "pinned in-crate by …": the test is at kernel/src/skp.rs:4839 @ a305e541. Holds.
- What W1 removes: the old "the only one in which the dead-ticket arm is reachable at all". Since #147 that is untrue of T1's narrower window. That is the node's "T1 describes the arm before #147" defect, beyond the mutation text.

**W2: T1's RECORDED MUTATION.** It replaces kernel/tests/session_generation.rs:357-361 @ a305e541.

> /// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), which
> /// `create_from_ticket` calls before `redeem` and `redeem_or_liveness_refusal` calls again when
> /// `redeem` refuses, delete the `TicketLiveness::EndedBySourceChange` arm and add that variant to
> /// the `Live | Unknown => None` arm, so neither read refuses by name. Applied at `<base>`, run alone
> /// and reverted: `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`
> /// FAILED on `the refusal must carry its typed code as a prefix`, the detail being `redeem`'s
> /// `was cancelled before it was redeemed`.

Each clause checked:
- The arms are at kernel/src/lib.rs:517 and :550 @ a305e541. The two callers are kernel/src/lib.rs:495 and :569 @ a305e541. Holds.
- "neither read refuses by name": T1's end is `ObservedChange` (kernel/src/skp.rs:1449-1455 and :1533-1538 @ a305e541), so its handle is `EndedBySourceChange`, and after M1 both reads return `None`. The coverage-loss arm is untouched and is not reached. Holds.
- "the detail being `redeem`'s …", by reading: `end_generation` cancels the attributed ticket (kernel/src/skp.rs:920-924 @ a305e541). Pending becomes `CancelledBeforeRedeem` (kernel/src/skp.rs:333-340 @ a305e541), and `redeem` answers kernel/src/skp.rs:287-289 @ a305e541. The run must confirm it.
- The assertion message is a byte-substring of kernel/tests/session_generation.rs:419 @ a305e541. Holds.
- M1 leaves the match exhaustive with no unreachable arm, so it compiles.

**W3: T2's RECORDED MUTATION.** It replaces kernel/tests/session_generation.rs:432-439 @ a305e541.

> /// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), the first
> /// read `create_from_ticket` makes, add `TicketLiveness::Unknown` to the `EndedBySourceChange` arm
> /// and leave `Live => None`, so a handle this registry has no record of is answered with the
> /// source-changed refusal. Applied at `<base>`, run alone and reverted:
> /// `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` FAILED on the
> /// `is unknown` assertion, which fires before the negative one, its detail carrying the
> /// `engine.source_changed: ` prefix. The preregistration predicted the negative assertion; the
> /// positive one is simply written first, and both cover the same defect.

Each clause checked:
- The first read is at kernel/src/lib.rs:495 @ a305e541. After M2, `Unknown` takes the first arm, so `create` returns that refusal before `redeem`. Holds.
- The `is unknown` assertion comes first (kernel/tests/session_generation.rs:463-466 @ a305e541) and the negative one after it (:467-470). The `ticket_liveness` assertion at :448-452 reads the registry, which M2 does not touch, so it still passes. Holds.
- The prefix is built by `terminal_detail_of`, the shape T1 asserts. Holds by reading; the run must confirm it.
- The last sentence keeps the original's words (from :437-439).
- What W3 drops: "performed once on this branch", which names no commit, and the printed diagnosis in italics. That printout was never tied to a commit.

**W4: T3's RECORDED MUTATION.** It replaces kernel/tests/session_generation.rs:483-485 @ a305e541.

> /// RECORDED MUTATION: drop the `st.dead_tickets.retain(..)` line from
> /// `GenerationRegistry::forget_dataset` (`kernel/src/skp.rs`; `mint_for_open`'s own line of that
> /// form stays). Applied at `<base>`, run alone and reverted: `the_dead_ticket_record_is_bounded`
> /// FAILED on `close clears this dataset's dead handles` (`left: 1`).

Each clause checked:
- The line is kernel/src/skp.rs:836 @ a305e541, and `mint_for_open`'s is :591. Holds.
- "`left: 1`", by reading: `dead_ticket_count` prunes by age only (kernel/src/skp.rs:733-748 @ a305e541), so the count stays 1 at kernel/tests/session_generation.rs:498-502 @ a305e541. That assertion's message is :501. The run must confirm it.

### 2. The observations

- **Where:**
  - an export of `<base>` (`git archive`) outside the repository's tree, with its own `CARGO_TARGET_DIR`, as in C7's method (kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:129-134 @ a305e541);
  - the test code at the base equals the branch's, since only comments differ;
  - each heavy run inside a shared hold only (§36).
- **For each of M1, M2 and M3, alone and in turn:**
  1. Run the named test unmutated: `cargo test -p spatial-kernel --locked --test session_generation <name> -- --exact`. `fixture` comes from the dev-dependency at kernel/Cargo.toml:38 @ a305e541. It must pass.
  2. Apply the mutation as worded and run the same command.
  3. Record the first failing assertion's message as printed, and the detail it shows.
  4. Revert the file to its bytes at `<base>` and confirm it is unchanged.
- **Stops.** On any of these, report and change no word:
  - the test fails, or does not build, unmutated;
  - the arm or line named is not at the base as described (for example, 1c step 1 changed `liveness_refusal`, or #258 changed `forget_dataset`);
  - the mutated build does not compile;
  - the test passes under the mutation;
  - it fails at another assertion, or with another detail than W2 to W4 state (M1 without `redeem`'s cancelled wording, M2 without the `engine.source_changed: ` prefix, M3 without left 1);
  - it hangs or panics elsewhere;
  - any file other than the Scope's must change.
- **What counts as the observation.** A `verify-mutation` run is not one. The observation of record is the worker's run or the gate's re-run, as docs/PREREGISTRATION-TEMPLATE.md:172 @ a305e541 states. The reviewer re-makes M1 to M3 at `<base>`, as for W-1 (kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:185 @ a305e541).
- **No test-text span on a branch** (docs/PREREGISTRATION-TEMPLATE.md:174 @ a305e541). The comments name the base commit on main. The closing record pins the rewritten lines at the merge commit.

### 3. The size, and the node's budget

- **My estimate:**
  - W1 is 3 lines out and 8 in, so 11;
  - W2 is 5 out and 7 in, so 12;
  - W3 is 8 out and 8 in, so 16;
  - W4 is 3 out and 4 in, so 7.
- That totals about 46 lines in 1 file, under the declared 60 and under §21c's 150 lines and 8 files (AUTONOMY.md:350-351 and :357 @ a305e541).
- There is no dependency, no exposure surface and no user-visible behaviour.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ a305e541).
- **Node budget:** `budget_minutes: 0` (PLAN.yaml:3187 @ a305e541) should be **60**. That covers one base build on the export, six targeted runs, the suites, and the comment edit. The precedent is the 30-to-60 settlement at scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md:159 @ a305e541.

### 4. Out-of-scope readings

- **ADR.** Nothing is touched. ADR-035 Decision 2 names `create_from_ticket`'s dead-ticket arm, and that resolves through the composition (state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:49 @ a305e541, N3). W2 and W3 name `liveness_refusal` *as* composed by `create_from_ticket`, which is consistent with that resolution.
- **Security.** Nothing is touched.
- **Wire.** Nothing is touched. The mutations alter strings' reachability only on an export, and nothing lands.
- **Guarantee.** I read "touched" as "changed", per the settlement at kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ a305e541. The three tests are properties under test (AUTONOMY.md:325-327 @ a305e541): the dead-ticket refusal by code, docs/01 principle 8's no-fabricated-diagnosis, and the record's bound.
  - A comment-only diff that keeps every assertion, message, fixture and name leaves each property as tested.
  - Re-observing the mutations adds evidence that each test detects its defect. It does not move the property.
  - W1 corrects a statement to what the code does since #147, as the verify-cites precedent did. Leaving the untrue "only" in place would itself be a Correctness finding under the proportional-gates rule.
- **The earlier declaration.** The followups form declared these texts unchanged for *its* piece (kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:192 @ a305e541). Its Amendment 1, item 3 routes them here (:327). That form is not edited.
- **The form.** The line asserts that none of the four is touched, and §36 sets (e) aside in any case (AUTONOMY.md:482 @ a305e541), so the five-line form stands.

### 5. Rule (00), path by path

This piece's paths are kernel/tests/session_generation.rs and the form on main. My proposed form path is kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none. Contact: M1 and M2 are applied in kernel/src/lib.rs on the export only. If 1c merges first and moves `liveness_refusal`, that is a stop (note 2), not a path overlap. |
| port-2 | none (its kernel tests are app_data_dir_resolution.rs and case_policy_volume.rs) |
| #258 | none. Contact: M3 is applied in kernel/src/skp.rs's `forget_dataset` on the export only, and W1 names a test in skp.rs's `cfg(test)` module by name. #258 edits only that module. |
| #257 | none |
| #252 | none (engine/ and KNOWN-LIMITATIONS.md) |
| #249 | none |
| #244 | none |
| #241 | none. Contact: the file's helper comments name `typed_terminal_codes.rs` by item, and #241 edits that test. This piece edits no helper comment and not kernel/README.md. |

- Disjoint by path.
- Nothing under protocol/.
- The path lists are the brief's.
- No kernel/README.md index line is owed: entry 5's five-line form is not in the list at kernel/README.md:387 @ a305e541, and #241 holds README in any case.

## OPEN items

- **OPEN-1: W1 in or out.**
  - (A) Include W1, so that T1's "only" sentence is corrected with its mutation.
  - (B) Change only the three `RECORDED MUTATION:` comments, and leave W1's span as it is.
  - **I recommend (A).** The node's title asks for T1 "describing the arm after #147", and the "only" claim is untrue at the base. It adds about 11 lines.
- **OPEN-2: the file's other recorded-mutation comments that name no observation commit**, at kernel/tests/session_generation.rs:121-122, :145-147, :229-230, :255-257 and :532-535 @ a305e541.
  - (A) Leave them out, and the custodian proposes a node for the human to place.
  - (B) Widen the piece to :532-535 only. That is the same P3b block and a deterministic mutation, about 6 lines.
  - (C) Widen to all of them. :255-257's torn-read mutation is not deterministically observable, so it would need its own reading.
  - **I recommend (A).** The human placed T1 to T3 by name, and widening is a scope change for the human's queue, not this form's.

## What I could not settle

- **The code before #147.** Without git, I read the pre-#147 `create_from_ticket` arm only through kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md:33-34 @ a305e541 (§2a: "today's two `EndedBy*` arms, unchanged") and the gate's comparison at state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:28 @ a305e541. The old T1 text's leftover pattern (`… | EndedByCoverageLoss => tickets.redeem(..)`) implies both `EndedBy` arms were folded, and I cannot confirm that against the pre-#147 code. M1 deliberately folds only the source-change arm, which is all T1's handle reaches.
- **The predicted failures are readings, not runs.** M1's detail, M2's prefix and M3's `left: 1` come from reading the code. The worker's run settles them, and a mismatch is a stop.
- **Hashes and branch states.** No sha256 was computed, because I have no shell. No branch was read.
