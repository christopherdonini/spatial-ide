Reviewed: PR #320 at fd101297612bbafbd15a1819f44b47335240b425 (the custodian's filing note, 2026-11-14: the gate, the reviewer, at the head, one of the two gates from dispatch under the five-line form `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md`, section 36 and its N3, PLAN node close-races-three-untested-kernel-tests, filler entry 14; dispatched 2026-11-14T19:18:33Z by a prompt naming its brief by file (sha256 7b51aa2d); run 2026-11-14T19:18:33Z to 2026-11-14T19:59:29Z by its transcript, 75 calls (Read 16, Bash 58, SubagentHandback 1), none errored, no file written by a Write or Edit call, model claude-opus-5-5; by script, every run it claims has a call behind it whose result is not an error; below, the hand-back byte for byte (with one final newline, 14053 bytes, sha256 693586a4bb501b0c60da19930cea2b8969a0be5e6cb455ce2e548a2c6db1a2f2). Nothing is changed.)

Reviewed: PR #320 at fd101297612bbafbd15a1819f44b47335240b425, gate reviewer
cut/close-races-three-untested-kernel-tests @ fd101297612bbafbd15a1819f44b47335240b425
Verdict: PASS WITH NOTES

There are no Correctness, Evidence or Documentation findings. Nothing needs fixing before the merge. The notes are four Observations. The brief's sha256 (7b51aa2d…eb63e2, 11812 B), the packet's (d16a5a8f…cb8a, 3476 B) and mut-320.mjs's (9a3f4509…0bbe, 2553 B) all matched.

## Findings

**Correctness:** none.
**Evidence:** none. Every prediction on the form's Tests+mutation line and in N6 was observed at H, including the optional `session_generation` extra.
**Documentation:** none must-fix.

**Observation (none blocks, none must-fix):**
- O1, the form's Tests+mutation line, U3 (on main, not in this diff). The line says the resolved query "continues through `viewport_query_mint` and `viewport_query_attribute`". No product chain can reach the attribute step once the mint step refuses: `viewport_query` chains the steps with `?` at kernel/src/skp.rs:1413-1415 at H, and a refused mint gives no handle. U3 drives exactly the place that N1 (3) and the architect's C1 name: a query resolves before step 4, and its `require_live` (:1472) runs after `forget_dataset` (:830-831), so it gets `NotOpen` and is refused as `skp.unknown_dataset` (:1673). Amendment 1 already discloses this. The closing amendment can cite this report by reference. No form line should be edited.
- O2, U1's M1 `REGISTERED MUTATION:` paragraph (diff lines 4820-4824 at H). It names U1 only. Under M1, U2 also failed (observed below; the form predicts it as a recorded extra). The paragraph is true but incomplete. That record lives on the form's Tests+mutation line and in this report. Adding lines would grow the 154 overrun, so I do not ask for a change.
- O3, kernel/README.md:361 at H. The new Last-verified clause (b7133d0a, 2026-11-14) sits before the build-dir layout clause (3fe9f97d, 2026-11-13). The preregistration list appends the form at the end instead. The README states no ordering, so nothing in it is untrue.
- O4, U1's doc comment says "refuses as the close's answer". My reading of that: the answer is `skp.unknown_dataset`, the same answer a query issued after the close gets (:1529-1532). It is true but loose wording. Optional replacement: "refuses as `skp.unknown_dataset`". This is the worker's wording, not the human's.

## Checks

**1. Start.** I ran `git -C C:/dev/spatial-ide fetch -q origin` (rc 0); origin/main is eedcbcef369c5b85d20ed410d8323f52f91bea86. In `<W>`: HEAD is fd101297…, the branch is `cut/close-races-three-untested-kernel-tests`, the porcelain is empty, and `ls-remote` gives fd101297… (rc 0). The merge base with main is a9c884ba…. The commits after it are C1 b7133d0a… and C2 fd101297…, as the packet says. `df -h`: C: 50G free, D: 342G free.

The form at origin/main: blob 95f10abb…, sha256 66210227052975ac145c45bcbfb0d078875f8dd4076242abf175b555526129d4. I read it whole. From a9c884ba to origin/main it changed only by 11 lines appended after line 145 (Amendment 1), so it is append-only.

I also read whole:
- the worker report;
- ADV-2026-11-14-17 item 13;
- ADR-035's Note 2026-11-11 at 9a77c0a9:164-165 (sha256 3222bc1d…, which equals the form's pin);
- GENERATION-CLOSE-RACES §4 at 9a77c0a9:203-211 (sha256 ccee7577…, which equals the pin);
- the directive of 2026-11-05, Part 1, items 1 to 9.

**2. Diff.**
- `--numstat a9c884ba...fd101297`: `2 2 kernel/README.md` and `150 0 kernel/src/skp.rs`.
- `--name-only`: the same two files.
- `-U0` on skp.rs gives one hunk, `@@ -4813,0 +4814,150 @@`. The module opens at 3455 and closes at 5512 (the file's last line), so the hunk is inside it.
- The new tests sit between T2 (`fn` at 4773) and R2 (`fn` at 4974).
- By script over the `-U0` diff: 150 added lines, 0 deleted, 3 `#[test]`. The names equal the form's U1 to U3 in order (`names match form: true`). There are 3 `fn` lines, and 0 added lines match `pub|sleep|thread::|spawn|timeout|recv_timeout|Duration|Instant`.
- `git -C C:/dev/spatial-ide diff --stat a9c884ba origin/main -- kernel/src/skp.rs kernel/README.md` was empty (rc 0).
- No product line, no new `pub` item, and no helper outside the test module.

**3. The code at H.**
- **U1**, at 4826-4850. Steps in order:
  1. `open_through`;
  2. `close`;
  3. `host.tickets().mint(&name, Box::new(RunOnDrop(None)), Arc::new(NoopCancel))` (the real `StreamRegistry::mint`, as OPEN-1 (A) takes);
  4. `viewport_query_attribute`.

  Assertions: `refused.code == "skp.unknown_dataset"`, then `assert_cancelled_before_redeem` (`TicketState::CancelledBeforeRedeem`). After the close, `attribute_ticket` takes the no-live arm (:628-629). Only :1526 can cancel this ticket, and M1 proves it does. The doc comment is true clause by clause (O4 aside).
- **U2**, at 4864-4904. Steps: open; real resolve and mint; `end_generation(&name, ObservedChange)`, asserted `== 0` (`invalidate` collects only attributed tickets, :795-800); attribute.

  Assertions: code `engine.source_changed`; `fields.detail` equals `Some("{this dataset's session ended while this query was being prepared}")` exactly, as OPEN-2 (A) takes; `assert_cancelled_before_redeem`. By script, the test literal is byte-equal to :1539's (66 bytes), and the `require_live` sentence at :1677-1678 differs. The doc comment is true clause by clause.
- **U3**, at 4919-4963. Steps: open; `end_generation(ObservedChange)`; precondition `live_generation == Err(NotLive::Ended(ObservedChange))`; resolve (a catalog check only, :1432-1435); `close`; `viewport_query_mint`, `expect_err`.

  Assertions: code `skp.unknown_dataset`; an empty `host.tickets.tickets` map; `rx.try_recv().is_ok()`, then `TryRecvError::Empty`. On flag 2: yes, U3 drives the ended-then-closed race at host level as N1 (3) states it (O1). Its doc comment is true:
  - `forget_dataset` removes the mark (:830) and the closing flag (:831);
  - `live_generation` then answers `NotOpen` (:605-614);
  - `require_live` (:1472) runs before the build (:1473) and the mint (:1508);
  - the attribute step is not reached (:1414).
- No test has a sleep, a spawned thread, a timeout or `recv_timeout`; `try_recv` only, per §4 (iii).
- Part 1 item 7 holds: the test doubles implement the real `BatchSource` and `SourceCancel` traits, and the inputs go through real `open_dataset`, `close_dataset` and the host's steps.

**4. Heavy runs at H**, each with `CARGO_TARGET_DIR=D:/wt-targets/cr3`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`, each in its own shared hold:
- `cargo test -p spatial-kernel --lib --locked skp::ticket_drop_under_lock_regression`: exit 0. `test result: ok. 28 passed; 0 failed; 0 ignored; 0 measured; 164 filtered out; finished in 1.44s`. U1, U2 and U3 were each `... ok`.
- `cargo test -p spatial-kernel --locked`: exit 0. The lib gave `191 passed; 0 failed; 1 ignored`. Across all 55 `test result` lines: 445 passed, 0 failed, 47 ignored. The build took `Finished … in 4m 18s`.

**5. Mutations, observed at H.** Each was applied alone by `node <S>/mut-320.mjs M<n>` (printed `M<n> APPLIED`, rc 0). Each was mutated-run, reverted and re-run inside one shared hold.
- **M1** diff (`@@ -1523,7 +1523,6 @@`): it removes `-            self.tickets.cancel(handle.as_str());`. This matches the form's M1 (delete :1526).
  - Run: exit 101, `test result: FAILED. 26 passed; 2 failed; 0 ignored; 0 measured; 164 filtered out; finished in 1.35s`.
  - Failing: `a_ticket_minted_after_the_close_is_cancelled_by_its_failed_attribution` and `an_observed_change_between_mint_and_attribution_refuses_with_the_arms_own_detail`, both `panicked at kernel\src\skp.rs:5044:9:` / `the ticket is CancelledBeforeRedeem before the redeem step runs`. That line is the shared helper's `assert!` (5045 at H, one line deleted above). This matches the prediction, U1 and U2 (flag 4 confirmed).
  - Revert: `checkout` rc 0, re-run exit 0 with `28 passed; 0 failed`, `git diff` empty, porcelain empty.
- **M2** diff (`@@ -1535,8 +1535,9 @@`): the `ObservedChange` branch becomes `EngineError::SourceCoverageLost` with the `[P6 placeholder] this dataset's session ended while this query was \` / `being prepared` detail. That is the `CoverageLost` body, as the form's M2 says.
  - Run: exit 101, `test result: FAILED. 27 passed; 1 failed; …`. Only U2 failed, `panicked at kernel\src\skp.rs:4895:9:`, `  left: "engine.source_coverage_lost"` / ` right: "engine.source_changed"` (its code assertion). T2 `... ok`. This matches.
  - Revert: rc 0, re-run exit 0 with 28 passed, diff empty, porcelain empty.
- **M3** diff (`@@ -827,7 +827,6 @@`): it removes `-        st.invalidated.remove(dataset);`, as the form's M3 says.
  - Run: exit 101, `test result: FAILED. 27 passed; 1 failed; …`. Only U3 failed, `panicked at kernel\src\skp.rs:4947:9:`, `  left: "engine.source_changed"` / ` right: "skp.unknown_dataset"`. This matches.
  - I judged the optional run worth it, since the crate was already built: `cargo test -p spatial-kernel --locked --test session_generation` gave exit 101, `test result: FAILED. 11 passed; 1 failed`. The failing test was `forget_dataset_removes_the_generation_the_invalidation_and_every_attribution`, `panicked at kernel\tests\session_generation.rs:207:5:`, `  left: Err(Ended(ObservedChange))` / ` right: Err(NotOpen)`. This matches the recorded extra.
  - Revert: rc 0, re-run exit 0 with 28 passed, diff empty, porcelain empty.

No mutation survived.

**6. `REGISTERED MUTATION:` paragraphs** (all added in C2, numstat 15/0, `Applied at b7133d0a`):
- U1/M1: the mutation, the test and the failing assertion message all match my observation (O2).
- U2/M2: "its code assertion (`left: "engine.source_coverage_lost"`)" matches.
- U3/M3: "its code assertion (`left: "engine.source_changed"`)" matches.

The commit b7133d0a resolves. C2 changed only doc comments, so the tests at H are byte-identical to C1's.

**7. Light runs**, from `<W>`:
- `cargo fmt --all -- --check`: rc 0, no output.
- `node --test` over the three globs: rc 0, `tests 598`, `pass 598`, `fail 0`.
- `verify-cites`: rc 0, PASS, 3032 files.
- `verify-test-claims`: rc 0, PASS, 802 claimed.
- `verify.mjs --offline`: rc 0, `verify:plan PASS`.
- `verify-quotes`, in a shared hold: rc 0, `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, …, 0 ruling-cite errors`.

**8. kernel/README.md.**
- The preregistration-list line gains `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md`. It resolves at H and at b7133d0a: blob 015afd96 at both, `cat-file -e` rc 0.
- The Last-verified clause, "every pointer the three untested close-race tests piece adds or changes (this piece's form in the preregistration list) at b7133d0a", is true. The only pointer is that form path, and it resolves at b7133d0a. The pattern follows the braces precedent (74fd4f1d is that piece's code commit; its README clause came in abf4bd93).
- Flag 5: this is the worker's wording, not the human's. It is true, so no replacement is needed (O3 aside).

**9. Amendment 1's figures**, recomputed:
- skp.rs is 150/0: C1 is 135 (`git show --stat b7133d0a`: 135 insertions) and C2 is 15 (`git diff --numstat b7133d0a fd101297`: 15 0).
- README is 2/2.
- The total is 154 against the declared 150, as Amendment 1 says. The Scope line is not edited.

The packet's flags:
1. Size: confirmed 154, recorded as class 6. Both gates are from dispatch.
2. U3: answered in check 3 and O1. It drives N1 (3)'s place, and its doc is true.
3. U2's single paragraph: O2.
4. M1: confirmed. Both tests failed at the helper's cancelled-state assertion, :5044:9 mutated.
5. README clause: the worker's wording, true.
6. N5: no stop. U1 to U3 pass at H, and the tests at H are byte-identical to C1's.
7. The worker's departures 2 and 3: process items for round 77, outside this gate's verdict.
8. Packet re-read: B′, H, C1, C2, the numstat, the two files unchanged on main since B′, and CI 18/18 are all confirmed.

**10. CI.** `gh pr checks 320` was read between 2026-11-14T19:56:52Z and 19:56:54Z (`date -u`): rc 0, 18 rows, 18 `pass`. `gh run view` gives head sha fd101297612bbafbd15a1819f44b47335240b425 for every run, all `success`:
- push: 43625748695 (Rust workspace), 43625748714 (shell), 43625748725 (fmt), 43625748781 (Governance), 43625748854 (Ported notices);
- pull_request: 43625945233 (Governance), 43625945234 (DCO), 43625945294 (fmt), 43625945313 (Exposure scan), 43625945322 (Rust workspace), 43625945334 (Ported notices), 43625945354 (shell).

**11. End.** HEAD is fd101297…, the porcelain is empty, and `df -h` shows C: 49G free, D: 341G free. No cargo.exe is running (tasklist).

## Status readings (quiet / average / peaks-over-25; whether a `project=SpatialIDE` line was present)
1. Before the module run: False / 54.0% / 60; none.
2. Before the crate run: False / 51.0% / 60; none.
3. Before M1: False / 38.6% / 60; none.
4. Before M2: False / 31.1% / 60; none.
5. Before M3: False / 30.8% / 60; none.
6. Before verify-quotes: False / 30.9% / 60; none.

## Hold lines (masked)
Each of the six holds came back as:
`MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)`
followed by `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`.

The pids were 20932, 8764, 47084, 46432, 40892 and 49248. No exit codes 96 to 99, no MACHINE_WAITING and no MACHINE_ERROR. Each hold's exit equals its last command's exit: 0, 0, then 0 for each revert run and for verify-quotes.

## Background shells
Eight were started: the six holds plus four wait loops, two of which the harness moved to the background. All completed on their own, and none is running. I killed nothing.

## Files
My scratch outputs are only in `<S>`, all named `g320r-*`: the form copy, the diffs, the run logs, the status files, the checks and per-run files, and the tasklist.

Model, as the harness reports it: Opus 5.5 (claude-opus-5-5).
