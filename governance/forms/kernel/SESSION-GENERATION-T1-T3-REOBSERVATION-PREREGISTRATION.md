# kernel/tests/session_generation.rs T1 to T3: the recorded mutations re-observed at a named commit, and T1's window after #147 — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node session-generation-t1-t3-reobservation, the filler queue's entry 6a (S3). The five lines and the notes are the architect's draft (`state/consults/2026-10-25-session-generation-t1-t3-reobservation-five-line-form-architect-draft.md`, read only at main a305e541; its sha256 from line 5 is 8ecae862729d94c0b050582162c9adc1798a1e5ebfe25b1d32edfb8f88b0d485), with two changes, both the custodian's: each cite at a305e541 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>`, a cite naming several places under one commit written as one pin each (48 pins); and the settlement below. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Form path: `kernel/SESSION-GENERATION-T1-T3-REOBSERVATION-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer and the architect, from dispatch (§36).*

```
Authority: PLAN node `session-generation-t1-t3-reobservation` (PLAN.yaml:3176-3192 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:332d38b5585871df1275e67e15c6ef5fa1b7bfde5f776173e0d0605e37433d23), generation 2; filler queue entry 6a, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:14 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:a7fd3b3f0272cefda40d6ae51db2a9dc4a2ee2a36d7dd7fc1b0a0124adefb3b2; state/FILLER-QUEUE.md:13 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:4653600961377ca73bb1f7de6a4cb6186eb8325afa78cd6aa045204ba54fa49c); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; routed by question round 59, item 3 (kernel-close-races-followups OPEN-3 (A); kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md, Amendment 1, item 3); the reuse index found no prior art on either search (recorded mutation reobservation; session generation test), a miss noted here.
Scope: 1 file, kernel/tests/session_generation.rs, `///` doc lines only, above T1, T2 and T3; declared line budget 60 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no code line, assertion, message, fixture or test name changes, and no other file changes (the mutations are applied and reverted on an export of the base and never land).
Change: T1's doc names the second read at which #147 made its refusal reachable; each of T1, T2 and T3's `RECORDED MUTATION:` comments restates its mutation against the code at the base (T1's and T2's in `EngineSourceFactory::liveness_refusal`, which `create_from_ticket` composes) and names the 40-hex base commit on main it was observed at, with the failing assertion by its message.
Tests+mutation: no new test; changed in doc comments only: a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code (M1: in `liveness_refusal`, the `EndedBySourceChange` arm deleted and that variant added to the `Live | Unknown => None` arm; predicted to fail on its prefix assertion, the detail `redeem`'s cancelled wording); an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal (M2: in `liveness_refusal`, `Unknown` added to the `EndedBySourceChange` arm, leaving `Live => None`; predicted to fail on its `is unknown` assertion, the detail carrying the `engine.source_changed: ` prefix); the_dead_ticket_record_is_bounded (M3: `forget_dataset`'s `st.dead_tickets.retain(..)` line dropped; predicted to fail on `close clears this dataset's dead handles`, left 1); each observed by applying it alone at the base, running that test alone, recording its failure by name with the commit in its `RECORDED MUTATION:` doc lines, and reverting; a verify-mutation run is not an observation; a mutation that passes, or that fails other than as predicted, is a stop.
Out-of-scope: ADR: no status line or amendment (ADR-035 Decision 2's `create_from_ticket` dead-ticket arm resolves through the composition, by PR #147 gate 1's N3, and is not edited); security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no literal, code or message text; guarantee: none touched: the three tests pin properties under test (the dead-ticket refusal by its code, `Unknown` never a source-change diagnosis, the dead-ticket record's bound), and every assertion, message, fixture and name keeps its text, so no property changes; the comments are corrected to the code at the base and their mutations re-observed; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs recorded mutation reobservation
No prior art recorded for "recorded mutation reobservation". Research it before planning an implementation.
$ node tools/reuse.mjs session generation test
No prior art recorded for "session generation test". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine, they mean the architect's. They are this form's reading.*

## Notes

### 1. What changes: four doc-comment replacements, words whole

None of these is the human's wording; they are doc comments. The worker applies them as written and substitutes only `<base>`, the 40-hex id of the branch's merge base with main, which is a commit on main. This follows the C7 shape at kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:127 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:51912539a4207ecf5574d6d5be078edfe1d2eadd8c8a8b8db8ca46de48f29c1a. If a run's observed failure differs from these words, the worker stops (note 2) and does not edit the words to fit. Lines are wrapped at 100 columns without changing a word. An identifier longer than a line stays on one line.

**W1: T1's window sentence.** It replaces kernel/tests/session_generation.rs:350-352 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:df37ea5fa0724061c94cca8594ba96da6f53cea19d92dc2c4a3e167dd93ce2cc. That span starts at "The window this exercises" and runs to "the ticket comes" at the end of line 352, so lines 353-355 stay as they are.

> /// The window this exercises is the one §5 prediction 1 names, with every liveness read after the
> /// end: a ticket minted, its generation ended while the ticket is still pending, and the redemption
> /// arriving afterwards, so `create_from_ticket`'s first read refuses by name. Since
> /// `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` §2b (#147) the same refusal is also reached
> /// when the end is recorded after that first read and before `redeem`, at the second read
> /// `redeem_or_liveness_refusal` makes; that order is pinned in-crate by
> /// `an_end_between_liveness_and_redeem_refuses_by_its_code`, in `kernel/src/skp.rs`'s
> /// `ticket_drop_under_lock_regression` module. Every step runs through the product path — the ticket comes

Each clause checked against the code:
- "the one §5 prediction 1 names": frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:418-420 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:1d5d21fe92899c1c888cf16dac01b69b59506a5f4095864cf8bb1bc57660f3ac names the mint→invalidate→redeem window and says T1 constructs it. Holds. I keep the original's "§5", meaning P3b's.
- "every liveness read after the end … first read refuses by name": T1 ends the generation at step 3 and redeems at step 4 (kernel/tests/session_generation.rs:398-415 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:afae3bd92e22fe8a75c3c38a9b639440e7f788ebc4877849c9441498279e6073). The first read is kernel/src/lib.rs:495-497 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:89f362370cace7724ab6d5e1961e6e8eb2403b22828d1030ca141fa43be05b45, which reaches the arm at kernel/src/lib.rs:517 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:84adf256a819b5774c8854860f64d8249b399972a26b96c53ee579bf4b4392e2. Holds.
- "also reached … at the second read": kernel/src/lib.rs:567-569 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:9b33a278edbfa0bd79464b006e0717a1e7557c2ca2b68ea1fdcdd582f15bd381. The end records before it cancels (kernel/src/skp.rs:914-926 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:c6f9be8cf603fa8dc178181c2348e084f75790f2ebd54fc3bd7d33448fc41b11). Holds.
- "pinned in-crate by …": the test is at kernel/src/skp.rs:4839 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:b2eef15a318a189bdd83b46937f0d5809582acf5df46287d7492e3eb96af67ce. Holds.
- What W1 removes: the old "the only one in which the dead-ticket arm is reachable at all". Since #147 that is untrue of T1's narrower window. That is the node's "T1 describes the arm before #147" defect, beyond the mutation text.

**W2: T1's RECORDED MUTATION.** It replaces kernel/tests/session_generation.rs:357-361 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:c1711020b37de783455d2ec098d89320d796c81ebd11beedfb3894b80b38c7f1.

> /// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), which
> /// `create_from_ticket` calls before `redeem` and `redeem_or_liveness_refusal` calls again when
> /// `redeem` refuses, delete the `TicketLiveness::EndedBySourceChange` arm and add that variant to
> /// the `Live | Unknown => None` arm, so neither read refuses by name. Applied at `<base>`, run alone
> /// and reverted: `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`
> /// FAILED on `the refusal must carry its typed code as a prefix`, the detail being `redeem`'s
> /// `was cancelled before it was redeemed`.

Each clause checked:
- The arms are at kernel/src/lib.rs:517 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:84adf256a819b5774c8854860f64d8249b399972a26b96c53ee579bf4b4392e2 and kernel/src/lib.rs:550 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:5d342798617a8f6c0b0befa015927b289274a8025e68fdb0f80e2984ab10b872. The two callers are kernel/src/lib.rs:495 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:cd9d722f593f5b843be9fa5062ae098a45894e391de6c62c75bb84aba3fdc5ce and kernel/src/lib.rs:569 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:3d2a79e1a51d78af9c4f8ad757c29c6067e5db628fef7618fa718db2908c0157. Holds.
- "neither read refuses by name": T1's end is `ObservedChange` (kernel/src/skp.rs:1449-1455 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:e9c1fc2216056c966e6e70b08bd19c9fa03f628aebda3d4d58b133c7185fe810 and kernel/src/skp.rs:1533-1538 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:abd73d6a759be7e70a918a8a62bd1c1e9cee06091ddb36405825406a623a709b), so its handle is `EndedBySourceChange`, and after M1 both reads return `None`. The coverage-loss arm is untouched and is not reached. Holds.
- "the detail being `redeem`'s …", by reading: `end_generation` cancels the attributed ticket (kernel/src/skp.rs:920-924 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:a2728a9f0154c4e429be6d2d68f3ac5440650857b53b2dbb836e39038b2fcc49). Pending becomes `CancelledBeforeRedeem` (kernel/src/skp.rs:333-340 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:28f3b39eced9f2a62262781bb236eb5b7e4e0f249504e6658554f0154cb5f1fb), and `redeem` answers kernel/src/skp.rs:287-289 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:b6df49d1bde58e578e2ebd034fc41dabfe8c2157a04890f49ca78985b5a3a97a. The run must confirm it.
- The assertion message is a byte-substring of kernel/tests/session_generation.rs:419 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:f457340d7193442e50a73d7144452d1880f23d4d559cc7e357aa83a5e32721eb. Holds.
- M1 leaves the match exhaustive with no unreachable arm, so it compiles.

**W3: T2's RECORDED MUTATION.** It replaces kernel/tests/session_generation.rs:432-439 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:ad633125ae2f925dc9d4d693dd739c8c70349cc28abdaedc54f3a5fc9e8aadde.

> /// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), the first
> /// read `create_from_ticket` makes, add `TicketLiveness::Unknown` to the `EndedBySourceChange` arm
> /// and leave `Live => None`, so a handle this registry has no record of is answered with the
> /// source-changed refusal. Applied at `<base>`, run alone and reverted:
> /// `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` FAILED on the
> /// `is unknown` assertion, which fires before the negative one, its detail carrying the
> /// `engine.source_changed: ` prefix. The preregistration predicted the negative assertion; the
> /// positive one is simply written first, and both cover the same defect.

Each clause checked:
- The first read is at kernel/src/lib.rs:495 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:cd9d722f593f5b843be9fa5062ae098a45894e391de6c62c75bb84aba3fdc5ce. After M2, `Unknown` takes the first arm, so `create` returns that refusal before `redeem`. Holds.
- The `is unknown` assertion comes first (kernel/tests/session_generation.rs:463-466 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:92dc12475783753ca7367ae81eb948a5713e8df3511f46f0116fc2b08249f23c) and the negative one after it (:467-470). The `ticket_liveness` assertion at :448-452 reads the registry, which M2 does not touch, so it still passes. Holds.
- The prefix is built by `terminal_detail_of`, the shape T1 asserts. Holds by reading; the run must confirm it.
- The last sentence keeps the original's words (from :437-439).
- What W3 drops: "performed once on this branch", which names no commit, and the printed diagnosis in italics. That printout was never tied to a commit.

**W4: T3's RECORDED MUTATION.** It replaces kernel/tests/session_generation.rs:483-485 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:c227991c7b786c573a212f5ae4bbf1f6ee1430e59e33805ce0b9de5e8c35a355.

> /// RECORDED MUTATION: drop the `st.dead_tickets.retain(..)` line from
> /// `GenerationRegistry::forget_dataset` (`kernel/src/skp.rs`; `mint_for_open`'s own line of that
> /// form stays). Applied at `<base>`, run alone and reverted: `the_dead_ticket_record_is_bounded`
> /// FAILED on `close clears this dataset's dead handles` (`left: 1`).

Each clause checked:
- The line is kernel/src/skp.rs:836 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:e2418150e3418072406b3968da6a052a92b4910699aa168e6c0a5bfc730d70b6, and `mint_for_open`'s is :591. Holds.
- "`left: 1`", by reading: `dead_ticket_count` prunes by age only (kernel/src/skp.rs:733-748 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:2fd4f53ebc33048d5f06f8bcab08a3c3de68c3ddbf35bc53d466515c1300d716), so the count stays 1 at kernel/tests/session_generation.rs:498-502 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:5766817bcffa1b4b5765480cbe80431beb5aa686c68a4c074e70bada70275660. That assertion's message is :501. The run must confirm it.

### 2. The observations

- **Where:**
  - an export of `<base>` (`git archive`) outside the repository's tree, with its own `CARGO_TARGET_DIR`, as in C7's method (kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:129-134 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:8a26194f4ce5c790d219b97c8c3392fe77f7db339a0339f5c4cbc0a3eaa1fae5);
  - the test code at the base equals the branch's, since only comments differ;
  - each heavy run inside a shared hold only (§36).
- **For each of M1, M2 and M3, alone and in turn:**
  1. Run the named test unmutated: `cargo test -p spatial-kernel --locked --test session_generation <name> -- --exact`. `fixture` comes from the dev-dependency at kernel/Cargo.toml:38 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:d0fa1d237054e708ae644c6edd8050dfccf684b04485037bda3534a7c6c35b9d. It must pass.
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
- **What counts as the observation.** A `verify-mutation` run is not one. The observation of record is the worker's run or the gate's re-run, as docs/PREREGISTRATION-TEMPLATE.md:172 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2 states. The reviewer re-makes M1 to M3 at `<base>`, as for W-1 (kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:185 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:b7ac5ecff37fa592d0ee12c1f6becee0d0e2300724e2b5c1e9d1181cc413e6f5).
- **No test-text span on a branch** (docs/PREREGISTRATION-TEMPLATE.md:174 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:ada780d90b6c8fafc49c49938b6a1ed0e0c338415dd2f0c6f4d3f0ed8850ccda). The comments name the base commit on main. The closing record pins the rewritten lines at the merge commit.

### 3. The size, and the node's budget

- **My estimate:**
  - W1 is 3 lines out and 8 in, so 11;
  - W2 is 5 out and 7 in, so 12;
  - W3 is 8 out and 8 in, so 16;
  - W4 is 3 out and 4 in, so 7.
- That totals about 46 lines in 1 file, under the declared 60 and under §21c's 150 lines and 8 files (AUTONOMY.md:350-351 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333 and AUTONOMY.md:357 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec).
- There is no dependency, no exposure surface and no user-visible behaviour.
- An overrun is class 6, and the Scope line is not edited (AUTONOMY.md:345 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3).
- **Node budget:** `budget_minutes: 0` (PLAN.yaml:3187 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:c730f3011e042a625d9c690c7788c2b43d4da2c96dbe5a78331dddbac9c8fd61) should be **60**. That covers one base build on the export, six targeted runs, the suites, and the comment edit. The precedent is the 30-to-60 settlement at scripts/plan/VERIFY-CITES-OUT-OF-RANGE-LINE-COUNT-PREREGISTRATION.md:159 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:534f7b007a8e9122f1e266995da003659e65a32600fdad54d7ae49b73d860a17.

### 4. Out-of-scope readings

- **ADR.** Nothing is touched. ADR-035 Decision 2 names `create_from_ticket`'s dead-ticket arm, and that resolves through the composition (state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:49 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:527607634ea840133b9dbe3b9c49eb528414c01e3b006164b091ec573e494b8a, N3). W2 and W3 name `liveness_refusal` *as* composed by `create_from_ticket`, which is consistent with that resolution.
- **Security.** Nothing is touched.
- **Wire.** Nothing is touched. The mutations alter strings' reachability only on an export, and nothing lands.
- **Guarantee.** I read "touched" as "changed", per the settlement at kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:409f44fb055bb53fc13bf4c1160cefdcaf7048472a76a84f512cbd94ece5e113. The three tests are properties under test (AUTONOMY.md:325-327 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7): the dead-ticket refusal by code, docs/01 principle 8's no-fabricated-diagnosis, and the record's bound.
  - A comment-only diff that keeps every assertion, message, fixture and name leaves each property as tested.
  - Re-observing the mutations adds evidence that each test detects its defect. It does not move the property.
  - W1 corrects a statement to what the code does since #147, as the verify-cites precedent did. Leaving the untrue "only" in place would itself be a Correctness finding under the proportional-gates rule.
- **The earlier declaration.** The followups form declared these texts unchanged for *its* piece (kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:192 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:e2da9296a0ff478ab52b38ba8257c1efac7b9b669872c7a9592c6bcdb73611dd). Its Amendment 1, item 3 routes them here (:327). That form is not edited.
- **The form.** The line asserts that none of the four is touched, and §36 sets (e) aside in any case (AUTONOMY.md:482 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669), so the five-line form stands.

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
- No kernel/README.md index line is owed: entry 5's five-line form is not in the list at kernel/README.md:387 @ a305e54181d43978353e67c18b52a02d56c6bd22 sha256:de42e85963877b971e4c86aeda00964cae4b260385b4e0b05b352ec91dd97423, and #241 holds README in any case.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A).** W1 is included: the node's title asks for T1 describing the arm after #147, and the sentence it replaces is untrue at the base.
- **OPEN-2: (A).** The file's other recorded-mutation comments that name no commit are left out. They are node `session-generation-other-recorded-mutations-name-no-commit`, proposed for the human to place and listed among the filler queue's proposed additions.
- **The node's budget** is 60 minutes, from 0, as note 3 gives.
- **The worker's runs** settle what the draft read without running (its last section): a predicted failure that differs from W2 to W4 is a stop, reported with the words unchanged (note 2).
- **Rule (00)** was checked again at main 2c5a4b96 by `git diff --name-only origin/main...<branch>` for every open branch: none touches `kernel/tests/session_generation.rs`, and none touches `protocol/`.

## Amendments (opens empty; append-only)

## Amendment 1 — the closing record, written after gate 1's reports and the words commit were seen: the gate's words applied with no re-gate, and the observation method's deviation named (class 1)

*Written by the custodian at the PR's final head 44107aa726206d33d61efac0cd5b251a8e51fe5e. References only, and nothing below is a quotation. The gate: `state/consults/gates/2026-10-25-session-generation-t1-t3-reobservation-gate1-architect.md` (gate-log 627; sha256 d372a07d5c13efe11b41e78673e587009a91a003df37ceb0bb0173b484c6dfa9) and `state/consults/gates/2026-10-25-session-generation-t1-t3-reobservation-gate1-reviewer.md` (gate-log 628; sha256 1efa0c1b285959a05a44a87b4291c4e19039657f555213bf5d09c3c35a8d39de), both PASS WITH NOTES. The words commit: `state/consults/2026-10-25-session-generation-t1-t3-reobservation-gate1-words-worker-report.md` (sha256 from line 5 17e5b90ae37549d70795964e1351e0bf260f132e4bca09d1c0e13551b32064de).*

1. **The words, applied with no re-gate** (AUTONOMY §31). None is the human's wording.
   - The four doc spans are rewrapped at 100 columns, every word kept: W1, W2 and W4 in the reviewer's words (its D1), W3 in the architect's (its D1 and D2).
   - W3 now names its failing assertion by its message as well, as the Change line requires (the architect's D2).
   - The PR body's sentence on the long lines takes the reviewer's words (its D2).
2. **The size.** By the numstat from the merge base 959f4706 to 44107aa7, the diff is 46 lines in the one file the Scope names, under its 60, every changed line a doc line.
3. **The observation method's deviation** (the architect's D3). Note 2 orders the export built with its own cargo target. The build's runs used one target for both the export and the worktree, by the custodian's brief; the worker disclosed it (`state/consults/2026-10-25-session-generation-t1-t3-reobservation-build-worker-report.md`, disclosure 1, and its filing note). The reviewer's re-observation of M1 to M3 used a separate target for its export.
4. **The reviewer's method note.** The extracted export's files carry the commit's mtime, older than the warm target's build, so the reviewer's first unmutated run reused a binary built from another checkout; it touched the export's sources, and every run after that compiled from the export.
5. **The record.** This is correction round 1 of 2.

Nothing above is edited.
