# The sort-window cancel test reads INCONCLUSIVE by name when the sort ends before the cancel reaches it, never a failure — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node publish-sort-window-cancel-not-exercised-on-ci. The five lines and sections A to D are lead-data's draft (`state/consults/2026-10-23-publish-sort-window-cancel-not-exercised-on-ci-lead-data-draft.md`, read only at main 5c6b7e37; its sha256 from line 5 is e122e290dc2e1e42d509b7bfcc3ac9a3e13630d603ce37617deefe4e9b8175be), with three changes, all the custodian's, for the human's ruling headed 2026-10-24, item 1: the Authority line names that ruling; the Out-of-scope line's guarantee clause names the narrowed property under test and the ruling that sets round 25, item 2 (e) aside; and each cite at 5c6b7e37 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a path that starts with a dot as `` `path:line` at <commit>, sha256 <hex> ``), a cite naming two places under one commit written as two pins (37 pins). Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Main changed PLAN.yaml, PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md, kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md, frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md between 5c6b7e37 and 4de4b9a9. Form path: `kernel/PUBLISH-SORT-WINDOW-CANCEL-NOT-EXERCISED-ON-CI-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer and the architect, from dispatch.*

```
Authority: PLAN node `publish-sort-window-cancel-not-exercised-on-ci` (PLAN.yaml:4280-4296 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:6e5aa09bddedfc8b7b4acf2357933f39a65b511272a54316bc4c8037ce8536f9); the human's ruling state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:10 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:855a19966e6dd774281dfa50db75e1461e028ca0437c767a7d826d8bd44adfb9 (graded S3, placed ahead of port-2, a five-line form); the human's ruling headed 2026-10-24, item 1 (state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md:8 @ 4de4b9a91837a4faa181e8f1e8b6260158db665d sha256:f038df3a9e98965a4a968a2003ea03f85b2aead025832a1896c6f8283978f816): OPEN-1 (A), the five-line form with the reviewer and the architect from dispatch, round 25, item 2 (e) set aside for this piece as for engine-clause-composition-properties; the reuse index found no prior art on either search (cancel window inconclusive test; sort cancellation timing), a miss noted here.
Scope: 1 file, kernel/tests/publish_cancellation.rs; declared line budget 80 (insertions plus deletions, AUTONOMY.md:357 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; the test keeps its name and no test is added or removed.
Change: a_cancel_inside_the_sort_is_observed_rather_than_waited_out stops failing when QueryRunning never fires: when the run's own phases show no QueryRunning, the token was never cancelled and the publish completed with every row, the test writes one line beginning INCONCLUSIVE and naming itself straight to the process's stderr (past libtest's output capture) and returns; when QueryRunning fired it asserts the cancel exactly as it does now; any other shape fails, with the outcome and phases in its message.
Tests+mutation: a_cancel_inside_the_sort_is_observed_rather_than_waited_out (changed); M1: the first `watch.check()?;` of the partition loop (kernel/src/publish/mod.rs:754 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:e28b8aa84649df0c9b1496570eeb1f7d798c8fcfebd09159360f14c343201a59) becomes `return Err(PublishError::Cancelled);`, so QueryRunning never fires and the token is never cancelled, and the test fails by name at its sort-ended-first guard on every machine (a bare early return on a missing QueryRunning would pass it); observed by applying it, running the test, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: touched by §21a's letter, as a property currently under test (AUTONOMY.md:317-327 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:436349471dc7ff504a46e7463ba78749089a99588938555b91e7b2f7d1d8fd6b): the sort-window cancel, asserted today on every run or the test fails, is asserted only on a run that reaches the window, and a regression that removes the window reads INCONCLUSIVE instead of failing (the predicted survivor in section C below); no product code, ceiling, docs/08 claim or ADR-018 cancellation semantics changes, and every assertion of the sort-window cancel is unchanged on a run that reaches the window. The five-line form with the reviewer and the architect from dispatch stands by the human's ruling on OPEN-1, recorded as setting round 25, item 2 (e) aside for this piece.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs cancel window inconclusive test
No prior art recorded for "cancel window inconclusive test". Research it before planning an implementation.
$ node tools/reuse.mjs sort cancellation timing
No prior art recorded for "sort cancellation timing". Research it before planning an implementation.
```

*Sections A to D are lead-data's notes from its draft, carried byte for byte except for the pins. They are this form's reading. Where one puts a question to the custodian or the human, the settlement after them answers it.*

## A. How INCONCLUSIVE is reported: CI shows it by name, the job stays green

- **No third status.** libtest has only pass, fail and ignore, and `#[ignore]` cannot be decided at run time. So the test returns normally: libtest prints `ok` and the "Run the ordinary suite" step (`.github/workflows/product-ci-rust.yml:233-234` at 5c6b7e377c4aabec3e8ab1a658125b0a53db4929, sha256 b583ae49475deb6fd0c6a7b2d4ee8a35323f6b6f814b70b68e8b908491ceed3c) stays green.
- **Not `eprintln!`.** It is captured for a passing test, so CI would not show it. The test's own comment (kernel/tests/publish_cancellation.rs:242-247 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:a3f59a6d27c51e062afc2e6c0d16c1391596b2eb9738123c028923d335264448) explains why that early return was removed, and the piece must not bring it back.
- **The mechanism.** One `writeln!` to `std::io::stderr().lock()`, with its result ignored. libtest's capture intercepts the print macros, not writes to the stderr handle, so the line reaches the job log. That is my understanding of the toolchain, and nothing in this repository has observed it: no Rust test here writes to `io::stderr()` directly (a search under engine/, kernel/, protocol/ and renderer/ found only kernel/src/main.rs:166 and kernel/src/permission/approval.rs:165, neither a test). By round 15 (c) it needs observing with the toolchain named. Two runs, which the custodian decides on (OPEN-3):
  - **L0 (local, scratch, never committed).** Drop the observer's QueryRunning arm (kernel/tests/publish_cancellation.rs:210-214 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:9966a6a07203d51050a4a269b308f000039702d60c09c1ca7c79e6c1f738ae1d), so it neither records nor cancels. The INCONCLUSIVE branch then runs on every machine. Run the binary under default capture (the command shape at engine/B1-PROJECTION-PREREGISTRATION.md:640 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:20aa03efdb5e3eae7f2607ffea576007907d7a78f3f2f211353771a4eeaf9f53, `--test publish_cancellation` alone). The line should appear, the test report `ok`, and `rustc -V` be recorded.
  - **C0 (CI probe).** The same scratch change on a probe branch, pushed once, never merged or gated, and deleted once its run id is recorded (the precedent is port-2's E0b, PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:428 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:4ec5d13874531d5d63a3b84ae8ef7aaf8cd5645a801aa9015a3711fd3735a341). Predicted: both entries on main's matrix (windows-latest, ubuntu-24.04) are green and each step log carries the line. macOS is not on main's matrix, so its first look is port-2's E1 after port-2 merges main.
- **The line's words (my draft, not the human's; test text, not an app string):** `INCONCLUSIVE (not a failure; the sort-window cancel was not exercised on this run): kernel/tests/publish_cancellation.rs a_cancel_inside_the_sort_is_observed_rather_than_waited_out: QueryRunning never fired, so the sort ended inside one poll interval and the publish completed uncancelled ({rows} rows, {partitions} partitions). Phases seen: {phases:?}`. The test's name is written as a literal, so a later rename has to update it.
- **It takes "never a pass" out.** The e2e precedents say "never a pass" (frontends/shell/e2e/exportElapsed.mjs:14 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:23f22cab91282be4b9afc6c542984aa650687c15311646caa01b92c7abf47741, frontends/shell/e2e/s5dVerdict.mjs:8 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:b7975d33001c3d27977a99313a9b7f27dd75e9aac2dd11cb6becc5b8eb756e13), but their suite exits 3. Here libtest prints `ok`, so those words would contradict the log.
- **The rewritten comment.** It replaces lines 242-247 and names two things. The design note's claim is reachability only (kernel/CANCELLATION-AND-TRACING.md:130 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:d1ed14c65498d7d3cf44c56bc62e2946d859106e3d70eebb803fae3741e72e54 and kernel/src/publish/mod.rs:198-200 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:66bb269c1ce6fe62ae56abe072beffaa69d0bed845e483d0dd59994c3134d749: if the phase fires, it is in the window, not that it always fires). The line's visibility rests on the observed capture behaviour at the recorded toolchain version. The change also makes the file's FEATURES doc true again (kernel/tests/publish_cancellation.rs:55-58 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:86171ab68e968f38967e10717bdf326e7e209a2741975014b7dbe4977556bac0); it is contradicted today by lines 248-255.

## B. How the test tells the three cases apart from the run's own phases

- **Window reached.** `PublishPhase::QueryRunning` is in the recorded phases. It is emitted only on the first `WouldBlock` before the first batch (kernel/src/publish/mod.rs:770-785 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:6e11bce90fc26b4c8d72a23e27d2dcdb546c392976b469145911fd591ec4c9e3). The observer cancels synchronously inside that callback (kernel/tests/publish_cancellation.rs:212-214 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:2d8de234a6f7f42957fc284d958275125f1f65ea60647e233134f511d758b779), and `watch.check()?` follows at once (kernel/src/publish/mod.rs:786 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:9d247ee6ec27c35480a5e230429ac34a6c0ad31fa7a4dd3a52dca639c5f74d00). So once the phase is seen, the cancel was raised before any partition, deterministically. On this branch the existing assertions (kernel/tests/publish_cancellation.rs:257-282 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:ce081b383c6adc3d159a1e583338707e038f8e2ae7429290d4b0f4d464035785) stay byte for byte.
- **Consistency, on every run.** `rec.saw(QueryRunning) == cancel.is_cancelled()` (`CancelToken::is_cancelled`, engine/src/cancel.rs:167 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:009ed45e2c78d0c39c462acbe586c43f8ce085a85e290fbfdb275293e5a802e6). The observer is the only canceller, so a mismatch is a failure.
- **Sort ended first (INCONCLUSIVE), only when all of these hold:**
  - there is no QueryRunning and the token is not cancelled;
  - the outcome is `Ok` with `rows == FEATURES` and `partitions > 0` (`PublishOutcome`, kernel/src/publish/mod.rs:336-341 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:b4bf3cbc2177b111bfc8972c0615aacb7620dce4fbf9d68f506a588c821f9fa1);
  - no acknowledgement was reported.
- **Anything else fails** with the outcome and phases in its message. This is the cancel-rescore lesson: "QueryRunning never fired" once hid a publish that had refused outright (kernel/RESULTS.md:2477 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:84e0b28366cb95100e37ae5fdd109f5db956466a7740a1d65cf2830f6aabec23 and kernel/RESULTS.md:2482-2487 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:0f6e3fc7baee6614e04a167c0c405b93f5b6e124947af0e18b4aeea11c770901). The `Ok` requirement adds no new dependence: two tests in the same file already require an uncancelled publish of this request to succeed (kernel/tests/publish_cancellation.rs:295-300 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:84788c69ea25066d20aace93967862d9998dcd511431d61d35ae72e7635cd2a0 and kernel/tests/publish_cancellation.rs:537-538 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:6884e0e1aa0213a2a41443f86ff6a4df9b674654e7d0e177fede064fb85d214c).

## C. The mutation, and whether the Out-of-scope line can say §21a is untouched

- **M1 is in the Tests+mutation line.** It is deterministic on every machine because it fires before the first poll. It tells the form's guard apart from a naive `if !saw { report; return }`, which it survives. It also fails other tests in the file; that is expected and is not its proof.
- **A predicted survivor, disclosed rather than taken as a mutation.** Put back the blocking wait (`next_into` for `next_into_timeout` at kernel/src/publish/mod.rs:756-757 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:d9bd6314e96e44789645fdcfe203551df414e12e644e6dfc34fb671ae589d68f) — the fifth section's mechanism 1 (kernel/tests/publish_cancellation.rs:18-20 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:8030ec94446bcdc42fa5bb5a552de4e4d143c8f06069f5a289e8b06c7f768c7b). `WouldBlock` then never occurs, so QueryRunning never fires. The changed test then reads INCONCLUSIVE on every machine and stays green; today's test fails on every machine. No other non-ignored test covers that path: a search for `QueryRunning`, `QUERY_RUNNING_OBSERVED` and `WouldBlock` under kernel/ and engine/ found only this file and kernel/tests/cancel_rescore.rs, whose test is `#[ignore]`d (kernel/tests/cancel_rescore.rs:551 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:64a882347d1016158b5cfe5c4f8b28893fb6dda2397798574809dfd23900aeb0).
- **OPEN-1, the §21a reading.** The categories are at AUTONOMY.md:317-327 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:436349471dc7ff504a46e7463ba78749089a99588938555b91e7b2f7d1d8fd6b.
  - ADR, security and wire are untouched without qualification.
  - "Guarantee": no product guarantee changes. But §21a's fourth bullet ends with "any property currently under test". The property that a cancel inside the sort is observed goes from asserted-or-fail on every run to asserted only when the window is reached, and the survivor above shows a regression of that exact mechanism would no longer redden.
  - A reviewer reading the bullet literally could call an unqualified Out-of-scope line false, and §21d makes that a block on sight (AUTONOMY.md:373-375 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:ae087cea5159947e5c012ddf625b06b4987ecf2381f12ae78b78a20e00c9d741).
  - Three routes, for the custodian and the human (not mine to choose):
    - (A) the five-line form as drafted, read as: the narrowing of when the test asserts is the human's ruled change, and no product property changes;
    - (B) the full form and both gates;
    - (C) the human confirms in words that this narrowing is not a §21a guarantee change, and the form cites that as Authority.
  - Since the human ruled the five-line form, a gate failing it by name falls under (A) unless (C) is recorded first.
- **§21c's other bounds hold** (AUTONOMY.md:350-351 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333): no new dependency (`std::io::Write` is std), no exposure surface, no user-visible behaviour, and one file of about 60 changed lines estimated, under a budget of 80.

## D. Rule (00) against the in-flight pieces, read from their forms

The custodian confirms each by `git diff --name-only origin/main...<branch>`.

- **#241 (`cut/bundle-redaction-scan`).** Its §7 files (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:277-290 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:2cc1df614265a49b91206beff8596c6488cceb20ef871ee891b368bb203b9a16) do not include this file. Contacts:
  - its gate goes into the Finalizing window, after the partition loop (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:139 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:e6b02e27dd65000abdeb9b78f62e695c4948f375b81a9b0e53e60b842f48f0f4);
  - it edits engine/src/fixture.rs, which this test calls only through `..Default::default()`;
  - if #241 merges first, M1's line number moves and nothing else changes.

  Disjoint by path.
- **#244 (`cut/walkthrough-row-f7-cli-refusal`).** Nothing under kernel/ (frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:168 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:9338b7e608465f54608c07826792cd6266819df9233b49689e1a4c5fbda2d6c7). Disjoint.
- **Port-2 (`cut/port-2-macos-l1-and-app-dirs`).** Its 16 files (PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:b4768e57e2a86ae698295215d1538c0322b39d2b209f856b93f8ac09e053aeab) do not include this file. Disjoint by path. What port-2 needs from this piece:
  - **Amendment 3, item 3** (lines 438-440): the human orders this node first. That is the ruling.
  - **I11** (line 234): this piece merging first means main is merged into port-2's branch and E1 is read at the merged head.
  - **P3** (lines 204-207) holds only because this piece keeps the test's name and adds or removes no test.
  - **OPEN-4, for port-2's custodian.** §1's "0 failed" (line 60) and W1's "passes in CI" (line 357) will count an INCONCLUSIVE run as passing. Whether W1 or §1 should say so is port-2's text, not this piece's.
- **1c step 1 (`cut/b2-piece-1c-save-and-reopen`).** Its groups (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:443-458 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:c3a14f85d53a68f81b9362cb24dc54e10f00dab26929f0c5a6e0cdc978cb4bc6) do not include this file. It touches protocol/ and this piece does not, so the at-most-one-protocol rule holds. This piece edits no kernel/README.md, so it shares nothing with 1c's or #241's records.
- **Owner's index.** kernel/README.md:356-398 @ 5c6b7e377c4aabec3e8ab1a658125b0a53db4929 sha256:ab8948073539130888b5515af94cc7ec7dbfaa51ea1c0d89c0de7b563ef35eff has no pointer to this test, so no index update follows. No KNOWN-LIMITATIONS item names it (a search of KNOWN-LIMITATIONS.md for the test's name and file found none).

## The custodian's settlement of the draft's OPEN-2 to OPEN-4 (class 1, before any code)

- **OPEN-1** is the human's ruling, (A), in the Authority line.
- **OPEN-2:** no `::warning` workflow command. The line goes to the process's stderr only, as section A drafts it.
- **OPEN-3:** both runs, with C0 moved off a probe branch.
  - **L0** runs as section A gives it, by the worker in its worktree, never committed. Its report records the line as printed, the test's `ok` and `rustc -V`.
  - **C0** runs on this piece's own branch, so that no branch is created that the custodian cannot delete. After the code commit is pushed, one commit drops the observer's QueryRunning arm as L0 does, and is pushed once. Its `product-ci-rust.yml` run is waited out to the end, because the workflow cancels a branch's earlier run on a newer push. The run id, each matrix entry's conclusion and each entry's line from its "Run the ordinary suite" step log are recorded. Then one commit reverting it is pushed. The final head's diff against main holds neither commit.
- **OPEN-4:** port-2's §1 and W1 words are port-2's text. They are noted on its node for its next amendment, and nothing here changes for them.

## Amendments (opens empty; append-only)

## Amendment 1 — written after the worker's step 2 run and its L0 run were seen, before M1, C0 or any push: the token conditions struck (class 3)

*Written by the custodian. References only. The runs are the worker-high's, at its local commit 7f7af5a580cf5b95ac1122ca26048be7f94be340 (not pushed), as its hand-back reports them; that commit is the change as first briefed.*

1. **What the runs showed.** Step 2 passed all six tests of the file, and on this machine the window was reached, so the existing assertions ran. L0 (the observer's QueryRunning arm dropped, scratch only) failed at the consistency assertion: the outcome was `Ok` with every row and partition, no phase was seen, and `cancel.is_cancelled()` read true.
2. **Why (class 3: a fact the form relied on is false).** `BatchStream`'s `Drop` cancels the token on every drop, a stream that ran to completion included (engine/src/stream.rs:898-908 @ 80713d4433e7a7f853d13e1fec5e2cfc3d9cd40e sha256:59e6fb89cc203213ddb0853675f55cda4ef24770e83d455f60b53a4c473196bb). The token's own documentation says the same (engine/src/cancel.rs:100-115 @ 80713d4433e7a7f853d13e1fec5e2cfc3d9cd40e sha256:816d5f0a469f4057d76980ceb3bb26538444f6c0fd69a84217e89d52c482481f). So after any completed publish, `is_cancelled()` reads true. These parts of the form are false as written, and the INCONCLUSIVE branch they guard could never be reached:
   - the Change line's condition "the token was never cancelled";
   - section B's consistency bullet, `rec.saw(QueryRunning) == cancel.is_cancelled()`;
   - the sub-bullet "there is no QueryRunning and the token is not cancelled", in its second half;
   - the Tests+mutation line's "and the token is never cancelled".
3. **The correction.** Those conditions are struck.
   - **The INCONCLUSIVE shape:** no QueryRunning among the run's phases; an `Ok` outcome with `rows == FEATURES` and `partitions > 0`; no acknowledgement reported.
   - **When QueryRunning fired,** every existing assertion runs byte for byte, as before.
   - **Any other shape** fails, with the outcome and phases in its message.
   - **No assertion is made on the token's flag.** Nothing is lost by that. The observer is the only canceller inside the run, and a cancel that took effect would show as a refused or partial outcome or as an acknowledgement, and each of those fails.
4. **M1** is unchanged as a mutation. Its prediction now reads: QueryRunning never fires and the outcome is `Err(Cancelled)`, so the test fails by name at its shape guard, on every machine.
5. **Unchanged:** the Scope line (one file, 80 lines), the test's name, the Out-of-scope line, L0 and C0 as the settlement gives them, and the gates. The worker's commit 7f7af5a5 stays; the correction is a second commit on it.
6. **Superseded index:**
   - the Change line's "the token was never cancelled": by item 3;
   - section B's consistency bullet, and its sub-bullet's second half: by item 3;
   - the Tests+mutation line's "and the token is never cancelled": by item 4.

Read the last amendment first.

Nothing above is edited.

## Amendment 2 — the closing record: gate 1, the gate's words applied, the head's CI (class 1); written after both reports and the words commit were seen

*Written by the custodian. References only: `state/consults/gates/2026-10-24-publish-sort-window-cancel-not-exercised-on-ci-gate1-architect.md` (gate-log 607), `state/consults/gates/2026-10-24-publish-sort-window-cancel-not-exercised-on-ci-gate1-reviewer.md` (gate-log 608), `state/consults/2026-10-24-publish-sort-window-cancel-not-exercised-on-ci-gate1-words-worker-report.md`; the final head a853802efda0ff8677bf5fd76f875dad0d79d897.*

1. **Gate 1.** The architect and the reviewer both PASS WITH NOTES at 14cdbcc0, with no Correctness or Evidence finding. The reviewer re-observed M1 and L0 at that head and read C0's two job logs and both of the head's Rust runs.
2. **The words.** The architect's replacement for the comment (its D1 and D2) also answers the reviewer's D1, and is the one applied, by a853802e. One line over 100 columns is broken at a space, the words unchanged. No assertion, string or test changed, so M1's recorded failure text stands.
3. **The count.** 45 added and 14 removed in the one file, 59 of the declared 80.
4. **The words commit's message** carries a sign-off line the worker typed, before its trailer lines, as well as the configured sign-off that `-s` added after them. The address in the typed line is already in the repository's records. The commit is not amended (no amend, no force push). The code is unaffected, and every check passes.
5. **CI at the head:** 18 of 18 checks pass.
6. **The record is closed** for the human's click, a merge commit. Port-2 follows it, with main merged into its branch.

Nothing above is edited.
