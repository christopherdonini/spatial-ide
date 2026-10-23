*Custodian's filing note (2026-10-23): the five-line form for `publish-sort-window-cancel-not-exercised-on-ci`, drafted by lead-data, read only at main 5c6b7e37, on the human's ruling of 2026-10-23 (headed 2026-10-24). The run 16:30:41Z to 16:38:36Z by its transcript (Grep 27, Read 20, Glob 3; no Write, Edit or Bash). Nothing is committed from it before the human answers its OPEN-1, the reading of §21a's fourth category for the Out-of-scope line, which decides whether a five-line form can carry it; its OPEN-2 to OPEN-4 go with it. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is e122e290dc2e1e42d509b7bfcc3ac9a3e13630d603ce37617deefe4e9b8175be.*

---

Drafted: publish-sort-window-cancel-not-exercised-on-ci, at main 5c6b7e37

Result: I drafted the five-line form. It changes one test file, about 80 lines, and keeps the test's name.
Blocking question, OPEN-1: can the Out-of-scope line truthfully assert "guarantee: not touched" under AUTONOMY.md §21a's "any property currently under test"? My reading is that it is contestable (see section C).
REPORT PATH: C:/dev/spatial-ide/state/consults/2026-10-23-publish-sort-window-cancel-not-exercised-on-ci-lead-data-draft.md. I give no sha256: the custodian files the file from this message.

I read in the main checkout. The session's git status gives its HEAD as 5c6b7e37. I have no Bash in this role, so that HEAD and every branch diff below were not checked by a command. Every line cite below is at 5c6b7e37, and none carries a sha256 (per the brief). The form's cites are for the custodian to pin by script at commit.

## The five lines

```
Authority: PLAN node `publish-sort-window-cancel-not-exercised-on-ci` (PLAN.yaml:4280-4296 @ 5c6b7e37); the human's ruling state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:10 @ 5c6b7e37 (graded S3, placed ahead of port-2, a five-line form); the reuse index found no prior art on either search (cancel window inconclusive test; sort cancellation timing), a miss noted here.
Scope: 1 file, kernel/tests/publish_cancellation.rs; declared line budget 80 (insertions plus deletions, AUTONOMY.md:357 @ 5c6b7e37); this form exempt; the test keeps its name and no test is added or removed.
Change: a_cancel_inside_the_sort_is_observed_rather_than_waited_out stops failing when QueryRunning never fires: when the run's own phases show no QueryRunning, the token was never cancelled and the publish completed with every row, the test writes one line beginning INCONCLUSIVE and naming itself straight to the process's stderr (past libtest's output capture) and returns; when QueryRunning fired it asserts the cancel exactly as it does now; any other shape fails, with the outcome and phases in its message.
Tests+mutation: a_cancel_inside_the_sort_is_observed_rather_than_waited_out (changed); M1: the first `watch.check()?;` of the partition loop (kernel/src/publish/mod.rs:754 @ 5c6b7e37) becomes `return Err(PublishError::Cancelled);`, so QueryRunning never fires and the token is never cancelled, and the test fails by name at its sort-ended-first guard on every machine (a bare early return on a missing QueryRunning would pass it); observed by applying it, running the test, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: no product code, ceiling, docs/08 claim or ADR-018 cancellation semantics changes, and every assertion of the sort-window cancel is unchanged on a run that reaches the window.
```

Before this form is committed, the Out-of-scope line has to settle OPEN-1. Round 25 (e) (docs/PREREGISTRATION-TEMPLATE.md:176 @ 5c6b7e37) sends any qualified line to the full form.

## A. How INCONCLUSIVE is reported: CI shows it by name, the job stays green

- **No third status.** libtest has only pass, fail and ignore, and `#[ignore]` cannot be decided at run time. So the test returns normally: libtest prints `ok` and the "Run the ordinary suite" step (.github/workflows/product-ci-rust.yml:233-234 @ 5c6b7e37) stays green.
- **Not `eprintln!`.** It is captured for a passing test, so CI would not show it. The test's own comment (kernel/tests/publish_cancellation.rs:242-247 @ 5c6b7e37) explains why that early return was removed, and the piece must not bring it back.
- **The mechanism.** One `writeln!` to `std::io::stderr().lock()`, with its result ignored. libtest's capture intercepts the print macros, not writes to the stderr handle, so the line reaches the job log. That is my understanding of the toolchain, and nothing in this repository has observed it: no Rust test here writes to `io::stderr()` directly (a search under engine/, kernel/, protocol/ and renderer/ found only kernel/src/main.rs:166 and kernel/src/permission/approval.rs:165, neither a test). By round 15 (c) it needs observing with the toolchain named. Two runs, which the custodian decides on (OPEN-3):
  - **L0 (local, scratch, never committed).** Drop the observer's QueryRunning arm (kernel/tests/publish_cancellation.rs:210-214 @ 5c6b7e37), so it neither records nor cancels. The INCONCLUSIVE branch then runs on every machine. Run the binary under default capture (the command shape at engine/B1-PROJECTION-PREREGISTRATION.md:640 @ 5c6b7e37, `--test publish_cancellation` alone). The line should appear, the test report `ok`, and `rustc -V` be recorded.
  - **C0 (CI probe).** The same scratch change on a probe branch, pushed once, never merged or gated, and deleted once its run id is recorded (the precedent is port-2's E0b, PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:428 @ 5c6b7e37). Predicted: both entries on main's matrix (windows-latest, ubuntu-24.04) are green and each step log carries the line. macOS is not on main's matrix, so its first look is port-2's E1 after port-2 merges main.
- **The line's words (my draft, not the human's; test text, not an app string):** `INCONCLUSIVE (not a failure; the sort-window cancel was not exercised on this run): kernel/tests/publish_cancellation.rs a_cancel_inside_the_sort_is_observed_rather_than_waited_out: QueryRunning never fired, so the sort ended inside one poll interval and the publish completed uncancelled ({rows} rows, {partitions} partitions). Phases seen: {phases:?}`. The test's name is written as a literal, so a later rename has to update it.
- **It takes "never a pass" out.** The e2e precedents say "never a pass" (frontends/shell/e2e/exportElapsed.mjs:14, frontends/shell/e2e/s5dVerdict.mjs:8 @ 5c6b7e37), but their suite exits 3. Here libtest prints `ok`, so those words would contradict the log.
- **The rewritten comment.** It replaces lines 242-247 and names two things. The design note's claim is reachability only (kernel/CANCELLATION-AND-TRACING.md:130 and kernel/src/publish/mod.rs:198-200 @ 5c6b7e37: if the phase fires, it is in the window, not that it always fires). The line's visibility rests on the observed capture behaviour at the recorded toolchain version. The change also makes the file's FEATURES doc true again (kernel/tests/publish_cancellation.rs:55-58 @ 5c6b7e37); it is contradicted today by lines 248-255.

## B. How the test tells the three cases apart from the run's own phases

- **Window reached.** `PublishPhase::QueryRunning` is in the recorded phases. It is emitted only on the first `WouldBlock` before the first batch (kernel/src/publish/mod.rs:770-785 @ 5c6b7e37). The observer cancels synchronously inside that callback (kernel/tests/publish_cancellation.rs:212-214 @ 5c6b7e37), and `watch.check()?` follows at once (kernel/src/publish/mod.rs:786 @ 5c6b7e37). So once the phase is seen, the cancel was raised before any partition, deterministically. On this branch the existing assertions (kernel/tests/publish_cancellation.rs:257-282 @ 5c6b7e37) stay byte for byte.
- **Consistency, on every run.** `rec.saw(QueryRunning) == cancel.is_cancelled()` (`CancelToken::is_cancelled`, engine/src/cancel.rs:167 @ 5c6b7e37). The observer is the only canceller, so a mismatch is a failure.
- **Sort ended first (INCONCLUSIVE), only when all of these hold:**
  - there is no QueryRunning and the token is not cancelled;
  - the outcome is `Ok` with `rows == FEATURES` and `partitions > 0` (`PublishOutcome`, kernel/src/publish/mod.rs:336-341 @ 5c6b7e37);
  - no acknowledgement was reported.
- **Anything else fails** with the outcome and phases in its message. This is the cancel-rescore lesson: "QueryRunning never fired" once hid a publish that had refused outright (kernel/RESULTS.md:2477 and 2482-2487 @ 5c6b7e37). The `Ok` requirement adds no new dependence: two tests in the same file already require an uncancelled publish of this request to succeed (kernel/tests/publish_cancellation.rs:295-300 and 537-538 @ 5c6b7e37).

## C. The mutation, and whether the Out-of-scope line can say §21a is untouched

- **M1 is in the Tests+mutation line.** It is deterministic on every machine because it fires before the first poll. It tells the form's guard apart from a naive `if !saw { report; return }`, which it survives. It also fails other tests in the file; that is expected and is not its proof.
- **A predicted survivor, disclosed rather than taken as a mutation.** Put back the blocking wait (`next_into` for `next_into_timeout` at kernel/src/publish/mod.rs:756-757 @ 5c6b7e37) — the fifth section's mechanism 1 (kernel/tests/publish_cancellation.rs:18-20 @ 5c6b7e37). `WouldBlock` then never occurs, so QueryRunning never fires. The changed test then reads INCONCLUSIVE on every machine and stays green; today's test fails on every machine. No other non-ignored test covers that path: a search for `QueryRunning`, `QUERY_RUNNING_OBSERVED` and `WouldBlock` under kernel/ and engine/ found only this file and kernel/tests/cancel_rescore.rs, whose test is `#[ignore]`d (kernel/tests/cancel_rescore.rs:551 @ 5c6b7e37).
- **OPEN-1, the §21a reading.** The categories are at AUTONOMY.md:317-327 @ 5c6b7e37.
  - ADR, security and wire are untouched without qualification.
  - "Guarantee": no product guarantee changes. But §21a's fourth bullet ends with "any property currently under test". The property that a cancel inside the sort is observed goes from asserted-or-fail on every run to asserted only when the window is reached, and the survivor above shows a regression of that exact mechanism would no longer redden.
  - A reviewer reading the bullet literally could call an unqualified Out-of-scope line false, and §21d makes that a block on sight (AUTONOMY.md:373-375 @ 5c6b7e37).
  - Three routes, for the custodian and the human (not mine to choose):
    - (A) the five-line form as drafted, read as: the narrowing of when the test asserts is the human's ruled change, and no product property changes;
    - (B) the full form and both gates;
    - (C) the human confirms in words that this narrowing is not a §21a guarantee change, and the form cites that as Authority.
  - Since the human ruled the five-line form, a gate failing it by name falls under (A) unless (C) is recorded first.
- **§21c's other bounds hold** (AUTONOMY.md:350-351 @ 5c6b7e37): no new dependency (`std::io::Write` is std), no exposure surface, no user-visible behaviour, and one file of about 60 changed lines estimated, under a budget of 80.

## D. Rule (00) against the in-flight pieces, read from their forms

The custodian confirms each by `git diff --name-only origin/main...<branch>`.

- **#241 (`cut/bundle-redaction-scan`).** Its §7 files (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:277-290 @ 5c6b7e37) do not include this file. Contacts:
  - its gate goes into the Finalizing window, after the partition loop (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:139 @ 5c6b7e37);
  - it edits engine/src/fixture.rs, which this test calls only through `..Default::default()`;
  - if #241 merges first, M1's line number moves and nothing else changes.

  Disjoint by path.
- **#244 (`cut/walkthrough-row-f7-cli-refusal`).** Nothing under kernel/ (frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:168 @ 5c6b7e37). Disjoint.
- **Port-2 (`cut/port-2-macos-l1-and-app-dirs`).** Its 16 files (PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276 @ 5c6b7e37) do not include this file. Disjoint by path. What port-2 needs from this piece:
  - **Amendment 3, item 3** (lines 438-440): the human orders this node first. That is the ruling.
  - **I11** (line 234): this piece merging first means main is merged into port-2's branch and E1 is read at the merged head.
  - **P3** (lines 204-207) holds only because this piece keeps the test's name and adds or removes no test.
  - **OPEN-4, for port-2's custodian.** §1's "0 failed" (line 60) and W1's "passes in CI" (line 357) will count an INCONCLUSIVE run as passing. Whether W1 or §1 should say so is port-2's text, not this piece's.
- **1c step 1 (`cut/b2-piece-1c-save-and-reopen`).** Its groups (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:443-458 @ 5c6b7e37) do not include this file. It touches protocol/ and this piece does not, so the at-most-one-protocol rule holds. This piece edits no kernel/README.md, so it shares nothing with 1c's or #241's records.
- **Owner's index.** kernel/README.md:356-398 @ 5c6b7e37 has no pointer to this test, so no index update follows. No KNOWN-LIMITATIONS item names it (a search of KNOWN-LIMITATIONS.md for the test's name and file found none).

## OPEN items

- **OPEN-1 (blocking):** the §21a guarantee reading in section C: route (A), (B) or (C).
- **OPEN-2:** whether the line should also carry a GitHub `::warning` workflow command, written only when `GITHUB_ACTIONS` is `true`, so that it shows on the run's summary page and not only in the step log. I have not verified that the runner reads workflow commands from stderr; it would need C0 to observe it. Not in the draft.
- **OPEN-3:** whether L0 and C0 run. They are the only evidence that CI shows the line. C0 is a plain push of a probe branch, on port-2's E0b precedent.
- **OPEN-4:** port-2's W1 and §1 words (section D).

## What I could not settle

- Whether libtest's capture is bypassed on the CI toolchain. `dtolnay/rust-toolchain@stable` is unpinned (.github/workflows/product-ci-rust.yml:205 @ 5c6b7e37), so even L0 and C0 prove it only at the version they record. A later libtest that captured at the descriptor level would hide the line again, and nothing would turn red.
- How often a CI run reads INCONCLUSIVE. Known so far: one Windows run in the 2026-10-09 sighting, and one of two macOS runs (E0 and E0b). Nothing counts INCONCLUSIVE lines across runs. A runner on which every run reads INCONCLUSIVE would leave the sort-window cancel unexercised on CI without a red; any tracking would be its own node.
- HEAD at 5c6b7e37 and the four branch diffs were not checked by a command.
