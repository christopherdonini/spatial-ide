Reviewed: PR #259 at 26c88a93b3046896f91deb9538136258307ce375 (base 959f4706), gate 1, reviewer; cut/session-generation-t1-t3-reobservation @ 26c88a93b3046896f91deb9538136258307ce375
Verdict: PASS WITH NOTES

The diff does what the form says. It is one file and 46 lines, and every changed line is a `///` doc line. The head is exactly the base with W1 to W4 substituted. Every clause in note 1 holds of the code at the base. I re-ran M1 to M3 on my own export of the base, and each failed at the assertion and with the detail its new comment states. The head's 12 tests pass, and fmt, the four verify scripts and all 18 CI checks are green. There are no Correctness or Evidence findings. Two Documentation findings must be fixed before the merge, with no re-gate.

## Findings

### Correctness
None.

### Evidence
None against the piece.

One method note for the custodian. My first unmutated M1 run on the export did not compile anything (it finished in 0.39 s) and reused `session_generation-030efec7bddb6398.exe` from `D:/wt-targets/sefd`, a binary built from another checkout of the same workspace. The cause: `git archive` gives the extracted files the commit's mtime, which is older than that build, so cargo treated the export as already built. That binary was built from code equal to the base apart from comments, but it was not a build of my export. So I restored and touched the export's `kernel/src/lib.rs`, `kernel/src/skp.rs` and `kernel/tests/session_generation.rs`, and ran M1's unmutated check again: `Compiling spatial-kernel v0.0.0 (D:\wt-targets\sgr-g1r-export\kernel)`, then a pass. Every run after that compiled spatial-kernel from the export, because each mutate or restore wrote a new mtime. Future briefs that pair an export with a shared warm target should say to touch the export's sources first.

### Documentation (must be fixed before the merge; not the human's wording; the worker applies these words with no re-gate and the PR body lists them)

**D1. Four new doc lines run past 100 columns, against the form's note 1** ("Lines are wrapped at 100 columns without changing a word. An identifier longer than a line stays on one line.").
- Where: `kernel/tests/session_generation.rs` at the head, lines 357 (107 columns), 365 (135), 442 (106) and 492 (131).
- Lines 365, 442 and 492 are long because of the substituted 40-hex id. Line 357, W1's last line, is past 100 in the form's own words, before any substitution.
- The worker disclosed this (report, disclosure 2).
- The fix replaces each span at the head with the words below. Each span is checked by my script `sgr-g1r-wrapcheck.mjs`: the words are identical to the head span's, and the widest line is 100, 98, 99 and 97 columns.
- Applied to the base, the result's numstat is 30 insertions and 19 deletions, 49 lines, inside the declared 60.

Head 350-357 (W1), 9 lines:
```
/// The window this exercises is the one §5 prediction 1 names, with every liveness read after the
/// end: a ticket minted, its generation ended while the ticket is still pending, and the redemption
/// arriving afterwards, so `create_from_ticket`'s first read refuses by name. Since
/// `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` §2b (#147) the same refusal is also reached
/// when the end is recorded after that first read and before `redeem`, at the second read
/// `redeem_or_liveness_refusal` makes; that order is pinned in-crate by
/// `an_end_between_liveness_and_redeem_refuses_by_its_code`, in `kernel/src/skp.rs`'s
/// `ticket_drop_under_lock_regression` module. Every step runs through the product path — the
/// ticket comes
```

Head 362-368 (W2), 8 lines:
```
/// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), which
/// `create_from_ticket` calls before `redeem` and `redeem_or_liveness_refusal` calls again when
/// `redeem` refuses, delete the `TicketLiveness::EndedBySourceChange` arm and add that variant to
/// the `Live | Unknown => None` arm, so neither read refuses by name. Applied at
/// `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and reverted:
/// `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`
/// FAILED on `the refusal must carry its typed code as a prefix`, the detail being `redeem`'s
/// `was cancelled before it was redeemed`.
```

Head 439-446 (W3), 8 lines:
```
/// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), the first
/// read `create_from_ticket` makes, add `TicketLiveness::Unknown` to the `EndedBySourceChange` arm
/// and leave `Live => None`, so a handle this registry has no record of is answered with the
/// source-changed refusal. Applied at `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and
/// reverted: `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` FAILED on the
/// `is unknown` assertion, which fires before the negative one, its detail carrying the
/// `engine.source_changed: ` prefix. The preregistration predicted the negative assertion; the
/// positive one is simply written first, and both cover the same defect.
```

Head 490-493 (W4), 5 lines:
```
/// RECORDED MUTATION: drop the `st.dead_tickets.retain(..)` line from
/// `GenerationRegistry::forget_dataset` (`kernel/src/skp.rs`; `mint_for_open`'s own line of that
/// form stays). Applied at `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and reverted:
/// `the_dead_ticket_record_is_bounded` FAILED on `close clears this dataset's dead handles`
/// (`left: 1`).
```

Clause check: the words are unchanged, so note 1's clause checks carry over unchanged, and each of them holds at the base (check 2). The rewrap keeps the backtick code spans whole, and the 40-hex id and every identifier stay on one line. The one break is in the prose of W1's last sentence, so line 358 at the head ("from `SkpHost::viewport_query`…") still follows "the ticket comes".

**D2. The PR body's sentence on the long lines** reads: "Four doc lines run past 100 columns with the base id substituted, as the form's words are kept byte for byte."
- Where: the PR #259 body, Evidence section, last bullet.
- What is wrong: only three of the four lines are long because of the id. W1's last line holds no id and is 107 columns in the form's own words.
- If D1 is applied, replace the sentence with: "The four doc lines that ran past 100 columns (W2 to W4's lines carrying the base id, and W1's last line as the form gives it) are rewrapped at 100 columns without changing a word, as the form's note 1 provides."
- If the custodian keeps the long lines instead, replace it with: "Four doc lines run past 100 columns: three carry the substituted base id, and W1's last line is past 100 in the form's own words; the words are kept byte for byte."
- Clause check:
  - "four": my check script `sgr-g1r-check12.mjs` lists head lines 357, 365, 442 and 492 as the only new lines over 100 columns. Lines 335, 336, 480 and 486 are over 100 too, but they are outside the diff's hunks.
  - "three carry the substituted base id": W2, W3 and W4 each hold one `<base>` and W1 holds none (the script's counts are 1, 1, 1 and 0), and 365, 442 and 492 are those three lines.
  - "without changing a word": the D1 script reports the words identical for all four spans.

## Checks

1. **The diff.**
   - `git diff --numstat 959f4706...HEAD` gives rc 0: `27	19	kernel/tests/session_generation.rs`. That is one file and 46 lines, within 60.
   - My script `sgr-g1r-check12.mjs` (rc 0) over `git diff -U0 959f4706...26c88a93` found 46 changed lines, 0 of them not a `///` line.
   - Its four hunks are `-350,3 +350,8`, `-357,5 +362,7`, `-432,8 +439,8` and `-483,3 +490,4`. These are exactly note 1's spans 350-352, 357-361, 432-439 and 483-485.
   - At both the pin a305e541 and the base, those spans hash to the form's sha256 values (all four true). `git diff --stat a305e541 959f4706` over the test file, `lib.rs`, `skp.rs` and `kernel/Cargo.toml` is empty (rc 0), so every pin in the form resolves at the base as well.
   - The branch is one commit, 26c88a93, and 959f4706 is an ancestor of origin/main (rc 0).

2. **The words.**
   - The same script took the form's four `> ` blocks from main (8, 7, 8 and 4 lines), replaced `<base>` with 959f4706fbd8824dc27352d719dae71c9a1a7c4d (1 occurrence in each of W2 to W4, 0 in W1) and spliced them into the base file bottom to top. The result equals the head file byte for byte: `head equals base with W1..W4 substituted: true`.
   - I checked note 1's clauses against the base, reading `lib.rs` and `skp.rs` as of the base:
     - W1:
       - `create_from_ticket`'s first read is `lib.rs`:495-497, and it reaches the `EndedBySourceChange` arm at :517.
       - The second read is `redeem_or_liveness_refusal`, at :567-569.
       - `end_generation` records the end (`skp.rs`:915) before it cancels (:920-924).
       - `an_end_between_liveness_and_redeem_refuses_by_its_code` is at `skp.rs`:4839, inside `mod ticket_drop_under_lock_regression`, which starts at :3415.
       - §2b is item **2b.** under §2 of `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, and that form's Amendment 1 names PR #147.
     - W2 and W3:
       - The arms are at `lib.rs`:517 and :550, and the coverage arm at :543.
       - `ticket_liveness` maps `ObservedChange` to `EndedBySourceChange` (`skp.rs`:683), and T1's end is `ObservedChange` (:1452 and :1537).
     - W4:
       - `forget_dataset` is at :827-837, and its retain line is at :836. `mint_for_open`'s retain line is at :591.
       - `prune_locked` prunes `dead_tickets` by age only (:746-747).
     - The messages are substrings of test lines 419, 465 and 501. All of the above hold.
   - #258 (rc 0, 138 diff lines) adds or removes no line naming `an_end_between_liveness_and_redeem_refuses_by_its_code`, `ticket_drop_under_lock_regression`, `dead_tickets.retain` or `forget_dataset`. The same pattern matches 5 lines in the base `skp.rs`, so the grep itself works.

3. **The observations, again.** These are my own runs, not `verify-mutation`.
   - **The export.** `git archive 959f4706…` (rc 0), extracted with `tar --force-local` into `D:/wt-targets/sgr-g1r-export` (rc 0; a first `tar` without `--force-local` returned 128 and extracted nothing).
     - Hashes after extraction equal `git show 959f4706:<path>`: `lib.rs` f6d57439e5b48cf20816385a7c9ce315ca3ec1fa4f127ca6b98fd58d7054ba19, `skp.rs` ae7ea6ef07a83498436a6c29fc8114a24e2d6d684d9cf703023ddd7bb3078808, the test file d96605a7497743a8f1c13a6ed53d2622a3c1712717a0438623cb4679a4cf30ed.
     - Every export run used `CARGO_TARGET_DIR=D:/wt-targets/sefd`.
     - My script `sgr-g1r-mut.mjs` refuses to apply unless the file is at base, and restores from `git show`.
   - **M1** (`a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`):
     - Unmutated: rc 0 and `1 passed`. The first such run reused the stale binary (see the Evidence note); I touched the sources and re-ran: Compiling spatial-kernel from the export, rc 0, `1 passed`.
     - Applied: `lib.rs` lines 517-538 (the `EndedBySourceChange` arm) deleted, and :550 changed to `skp::TicketLiveness::Live | skp::TicketLiveness::Unknown | skp::TicketLiveness::EndedBySourceChange => None,`.
     - Mutated: compiled, rc 101, panicked at `kernel\tests\session_generation.rs:417:5`: "the refusal must carry its typed code as a prefix, which is what the shell's own `isSessionEndedTerminal` matches: ticket `sh_8d60f3ac982afb607f0a5993533cc4d8` was cancelled before it was redeemed". This matches W2: the prefix assertion, with `redeem`'s cancelled wording.
     - Restored: sha256 f6d57439…ba19, equal true.
   - **M2** (`an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal`):
     - Unmutated: compiled, rc 0, `1 passed`.
     - Applied: :517 changed to `skp::TicketLiveness::EndedBySourceChange | skp::TicketLiveness::Unknown => {` and :550 to `skp::TicketLiveness::Live => None,`.
     - Mutated: compiled, rc 101, panicked at `:463:5` (the `is unknown` assertion), with "`redeem`'s own refusal is what answers: engine.source_changed: refused: the source file changed while it was open ({this dataset's session ended when its source was observed to have changed}). …". This matches W3: the first assertion, and the `engine.source_changed: ` prefix.
     - Restored: equal true.
   - **M3** (`the_dead_ticket_record_is_bounded`):
     - Unmutated: compiled, rc 0, `1 passed`.
     - Applied: `skp.rs`:836 `st.dead_tickets.retain(|_, (d, _, _)| d != dataset);` dropped. It is the only retain line inside `forget_dataset` (827-837).
     - Mutated: compiled, rc 101, panicked at `:498:5` with "assertion `left == right` failed: close clears this dataset's dead handles", `left: 1`, `right: 0`. This matches W4.
     - Restored: sha256 ae7ea6ef…8808, equal true.
   - No stop was met.
   - Final hashes of the export's `lib.rs`, `skp.rs` and test file equal the base's (the values above).
   - The export folder was then removed: `rm -rf` rc 0, and `ls` afterwards rc 2.

4. **The head.**
   - In `C:/dev/wt/sgr` with `CARGO_TARGET_DIR=D:/wt-targets/m4a`, inside a shared hold: `cargo test -p spatial-kernel --locked --test session_generation -v`, rc 0. It compiled spatial-kernel from the worktree (`-v` shows the worktree crates Dirty and recompiled). Result: `test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s`.
   - `cargo fmt --all -- --check`: rc 0, empty output.

5. **The verify scripts and CI.**
   - The verify scripts, in the worktree:
     - `verify.mjs --offline`: rc 0, `verify:plan PASS`.
     - `verify-cites.mjs`: rc 0, `verify:cites PASS` (2405 files).
     - `verify-quotes.mjs`: rc 0, `verify:quotes PASS` (131 checked, 0 hash-reference errors).
     - `verify-test-claims.mjs`: rc 0, `verify:test-claims PASS` (666 claimed tests).
     - None of the four outputs names `session_generation` or the form (grep rc 1).
   - `gh pr checks 259`: rc 0, 18 of 18 pass, nothing in progress.
   - `gh run view` gives head sha 26c88a93b3046896f91deb9538136258307ce375 for all 12 runs, each completed with success:
     - push runs: 40226796465, 40226796470, 40226796480, 40226796484 and 40226796524;
     - pull_request runs: 40226916155, 40226916145, 40226916170, 40226916243, 40226916137, 40226916184 and 40226916225.
   - `git ls-remote` shows origin's branch at 26c88a93b3046896f91deb9538136258307ce375 (rc 0).

6. **The PR body.**
   - True against the head and my runs:
     - "46 of the declared 60 lines, every changed line a `///` doc line": check 1.
     - M1's prefix assertion and cancelled wording, M2's `is unknown` assertion and prefix, and M3's left 1: check 3.
     - "the test file's 12 tests pass" and the fmt and verify passes: checks 4 and 5.
     - The worker's disclosure of the shared target.
     - Rule (00): no open PR other than #259 touches `kernel/tests/session_generation.rs`, and none touches `protocol/`. I checked with `gh pr diff --name-only` (rc 0) for each of #258, #257, #252, #249, #244 and #241, which is one method where the body names `git diff --name-only`.
   - One sentence is inexact: D2.
   - The commit message's figures (27 insertions and 19 deletions, the export of 959f4706) are true.

## Hold lines (my project only)
All eight holds were shared and granted, and each was followed by a release:
- M1 unmutated ×2
- M1 mutated
- M2 unmutated
- M2 mutated
- M3 unmutated
- M3 mutated
- the head suite

Each hold printed `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` and each release printed `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`. No 96-99 exit codes. Every heavy run had `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`.

## End state
- The PR worktree's `git status --porcelain` is empty (0 bytes, rc 0), and its HEAD is 26c88a93b3046896f91deb9538136258307ce375.
- `D:/wt-targets/sgr-g1r-export` is gone.
- `tasklist` shows no `cargo.exe`, `rustc.exe` or `session_generation-030efec7bddb6398.exe` running (each filter: "No tasks are running").
- I committed, pushed and edited nothing in any repository. My writes were scratch files named `sgr-g1r-*` in my scratch folder, the two cargo targets and the export.
