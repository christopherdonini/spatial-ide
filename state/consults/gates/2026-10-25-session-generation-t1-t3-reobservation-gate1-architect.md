Reviewed: PR #259 at 26c88a93b3046896f91deb9538136258307ce375, gate 1, architect
Verdict: PASS WITH NOTES

`cut/session-generation-t1-t3-reobservation @ 26c88a93b3046896f91deb9538136258307ce375`. I have no shell, so I recomputed no sha256 and ran no `git diff` or `gh`. I could not read the PR body. I read the base in the main checkout (at 82f497b1). I read the head and kernel/src in `C:/dev/wt/sgr`. That worktree's kernel/src equals the base's, because the diff touches one file.

## Findings by class

**Correctness:** none.

**Evidence:** none blocking. One note on method is under check 4, and D3 below records it.

**Documentation (must-fix before the merge; none of it is the human's wording. The worker applies these words with no re-gate, and the PR body lists them):**

- **D1. Four doc lines run past 100 columns, against the form's note 1.** Note 1 says: "Lines are wrapped at 100 columns without changing a word."
  - At the head, lines 357 (W1), 365 (W2), 442 (W3) and 492 (W4) are over 100.
  - Three of them are long because the 40-hex id was substituted for `<base>`. W1's line 357 is long because of the form's own words: the form's W1 quote line is already 107 columns.
  - Replacement words below. They change no word. Their only effect is to break lines.
  - W1: replace line 357 with two lines:
    ```
    /// `ticket_drop_under_lock_regression` module.
    /// Every step runs through the product path — the ticket comes
    ```
  - W2: replace line 365 with:
    ```
    /// the `Live | Unknown => None` arm, so neither read refuses by name. Applied at
    /// `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone
    ```
  - W4: replace line 492 with:
    ```
    /// form stays). Applied at `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and reverted:
    /// `the_dead_ticket_record_is_bounded`
    ```
  - W3: see D2, which rewraps line 442 too.
  - Clause check: every word and its order is unchanged. Each new line is at most 95 columns. The 40-hex id is not longer than a line, so note 1's identifier exception does not apply. rustdoc reflows a paragraph, so the rendered text is the same.

- **D2. W3 names its failing assertion by its condition, not its message.** The Change line says: "with the failing assertion by its message". W2 and W4 name a message. W3 says "FAILED on the `is unknown` assertion". `is unknown` is the argument to `contains`. The assertion's message at head :472 is "`redeem`'s own refusal is what answers: {detail}".
  - Replacement for head lines 439-446, which also does D1's wrap of line 442:
    ```
    /// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), the first
    /// read `create_from_ticket` makes, add `TicketLiveness::Unknown` to the `EndedBySourceChange` arm
    /// and leave `Live => None`, so a handle this registry has no record of is answered with the
    /// source-changed refusal. Applied at `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and
    /// reverted: `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` FAILED on the
    /// `is unknown` assertion (`` `redeem`'s own refusal is what answers ``), which fires before the
    /// negative one, its detail carrying the `engine.source_changed: ` prefix. The preregistration
    /// predicted the negative assertion; the positive one is simply written first, and both cover the
    /// same defect.
    ```
  - Clause check:
    - The added span is the leading bytes of the message literal at head :472.
    - The worker's M2 output begins with that text, ahead of the detail.
    - Every other clause is unchanged from W3, and each was checked under check 2.
    - The widest line is 98 columns.
  - Budget: D1 and D2 together add 4 inserted lines, from 27+19 to 31+19 = 50. That is under the declared 60 and §21c's 150 and 8.

- **D3. The closing record must name a deviation from the observation method.** Note 2 orders the export built "with its own `CARGO_TARGET_DIR`". The runs used one shared target for the export and the worktree. Per the filing note, that was the custodian's brief.
  - The closing amendment should state this by reference: the worker report's disclosure 1 and the filing note.
  - It is not Evidence, for the reason under check 4.

## Check 1: the five lines against the head

- **Authority.** PLAN.yaml on main shows node `session-generation-t1-t3-reobservation`: generation 2, `budget_minutes: 60` (the settlement), gate = this form, status in-progress. The filler rule (directive line 8) makes these requirements:
  - it is on the filler queue;
  - it is disjoint by rule (00) (the settlement re-checked this at 2c5a4b96);
  - it uses a five-line form under §21c's size;
  - the reviewer and the architect gate from dispatch;
  - §25 (e) is set aside;
  - it is graded S3.

  All hold. No red-line text is in the diff. Holds.
- **Scope.** One file, 27+19 = 46 changed lines (the worker's numstat, confirmed in the filing note).
  - My count of the four spans matches: W1 3 out / 8 in, W2 5/7, W3 8/8, W4 3/4, so 19 out / 27 in.
  - The head's offset below the spans is +8. The base's T4 `RECORDED MUTATION` at :532 is at :540 at the head, which is consistent with no other changed line.
  - Every changed line is `///`. In the range I read, every code line is identical between base and head.
  - Holds. D1 and D2 keep it inside 60.
- **Change.**
  - T1's doc names the second read (`redeem_or_liveness_refusal`, #147). Holds.
  - Each of the three restates its mutation against the base, and T1's and T2's are in `liveness_refusal`. Holds.
  - Each names `959f4706fbd8824dc27352d719dae71c9a1a7c4d`. That is the commit on main that carries the form, and it is the branch's base. Holds.
  - "The failing assertion by its message" holds for W2 and W4. It does not hold for W3 (D2).
- **Tests+mutation.**
  - No test was added and no code line changed.
  - M1, M2 and M3 were observed by the worker's runs, not by `verify-mutation`, which the report never calls an observation.
  - Each failed as predicted (check 4). Holds.
- **Out-of-scope.** See check 3. Holds.
- **W1 to W4 in place.**
  - W1 is at 350-357, W2 at 362-368, W3 at 439-446 and W4 at 490-493.
  - I compared each with note 1's `> ` lines. They match byte for byte except for the `<base>` substitution.
  - Base lines 353-355, which became head 358-360, are untouched, as note 1 orders.

## Check 2: the words against the code at the base

- **W1.**
  - "every liveness read after the end … first read refuses by name". T1 ends the generation at step 3 (base :401-404) and creates at step 4 (:409-415). `create_from_ticket` calls `liveness_refusal` first (lib.rs:495-497). `ticket_liveness` maps `ObservedChange` to `EndedBySourceChange` (skp.rs:683), and that arm returns `Some(terminal_detail_of(..))` (lib.rs:517-538). True.
  - "also reached … at the second read". The test it names is in skp.rs:
    - lib.rs:567-569 re-reads `liveness_refusal` on a `redeem` refusal.
    - `end_generation` records through `invalidate`, which writes `dead_tickets`, before it cancels (skp.rs:914-926, 808-812).
    - `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` §2b describes exactly that re-read, and its Amendment 1 records PR #147's merge.
    - `an_end_between_liveness_and_redeem_refuses_by_its_code` is at skp.rs:4839, inside `mod ticket_drop_under_lock_regression` (3415-5034).

    True.
  - The removed "the only one in which the dead-ticket arm is reachable at all" is untrue since #147. Removing it is correct.
- **W2.**
  - The arms are at lib.rs:517 and 550. The two callers are 495 and 569.
  - After M1, `EndedBySourceChange` maps to `None` at both reads. The coverage arm is untouched and T1 does not reach it.
  - `end_generation` cancels the pending ticket, which becomes `CancelledBeforeRedeem` (skp.rs:333-340). `redeem` then answers "was cancelled before it was redeemed" (skp.rs:287-289).
  - The assertion message is a byte-substring of base :419.
  - M1 leaves the match exhaustive.

  True.
- **W3.**
  - After M2, `Unknown` takes the refusal arm at the first read (lib.rs:495), before `redeem`.
  - The detail is built by `terminal_detail_of`, which is `format!("{}: {e}", ..code)` (skp.rs:2050-2051), so it carries the `engine.source_changed: ` prefix.
  - The `is unknown` assertion (base :463-466) precedes the negative one (:467-470).
  - The `ticket_liveness` assertion reads the registry, which M2 does not touch.

  True. Naming is D2.
- **W4.**
  - `forget_dataset`'s retain is at skp.rs:836, and `mint_for_open`'s line of the same form is at :591.
  - `dead_ticket_count` (skp.rs:712-716) prunes, and `prune_locked` bounds `dead_tickets` by age only (746-747). The count stays 1 at base :498-502, whose message is :501.

  True. The form's historical pin put `dead_ticket_count` at 733-748 @ a305e541. At the base it is at 712, with the same behaviour. The base tree is authoritative, as the form's header says.

## Check 3: Out-of-scope

- **ADR.** No ADR file is in the diff. ADR-035 line 30 still names "`EngineSourceFactory::create_from_ticket`'s dead-ticket arm". PR #147 gate 1's N3 (state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md, item N3) resolves that through the composition. W2 and W3 name `liveness_refusal` as composed by `create_from_ticket`, which is consistent. No amendment is owed.
- **Security.** Nothing ADR-020, 009 or 021 governs.
- **Wire.** No change under protocol/, and no literal, code or message text. The mutations alter reachability only on the export, and nothing of them lands.
- **Guarantee.** Not changed:
  - The three tests pin properties under test: the dead-ticket code, docs/01 principle 8's no-fabricated-diagnosis, and the record's bound.
  - Every assertion, message, fixture and name is byte-identical.
  - Re-observing the mutations adds detection evidence without moving any property.
  - W1 removes an untrue "only", which corrects a claim rather than touching a guarantee.

## Check 4: the worker's disclosures

- **Disclosure 1 (the shared-target rerun).** No bearing on the evidence or the words.
  - The first worktree run's failure (left 1) was a stale mutated M3 artifact. After `cargo clean -p spatial-kernel` the file ran 12 of 12 passed.
  - On the export, each mutated failure is specific to its own mutation, so a stale artifact cannot fake it:
    - M1's cancelled-wording detail needs `EndedBySourceChange` to map to `None`, which neither M2 nor M3 produces.
    - M2's prefix on an `Unknown` handle needs `Unknown` to take the refusal arm, which M1 does not produce.
    - M3's left 1 needs `forget_dataset`'s retain dropped, which is in skp.rs.
  - Each unmutated "pre" run passed, so no stale mutation was carried into a pre run.
  - The report does not list Compiling for m1-mut. Its predicted failure, impossible on an unmutated build, shows the mutation was compiled.
  - The method still deviates from note 2's own target dir (D3). The reviewer's re-run, which note 2 orders, is the independent observation.
- **Disclosure 2 (four lines past 100).** No bearing on the evidence. It is a Documentation finding (D1).
  - The disclosure attributes W1's long line to the id substitution. That is inaccurate: W1 carries no id, and its line is long in the form's own words.
  - The report is filed, so this is noted only, with no correction owed.

Files read:
- C:/dev/spatial-ide/kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-25-session-generation-t1-t3-reobservation-build-worker-report.md
- C:/dev/spatial-ide/state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md
- C:/dev/wt/sgr/kernel/tests/session_generation.rs
- C:/dev/spatial-ide/kernel/tests/session_generation.rs
- C:/dev/wt/sgr/kernel/src/lib.rs
- C:/dev/wt/sgr/kernel/src/skp.rs
- C:/dev/wt/sgr/kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md
- C:/dev/spatial-ide/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md
- C:/dev/spatial-ide/state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md
- C:/dev/spatial-ide/PLAN.yaml
