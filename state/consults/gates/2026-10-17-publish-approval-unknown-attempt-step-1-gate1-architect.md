Reviewed: PR #227 at 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2 (base 28163cb6). Branch and commit: cut/unknown-attempt-step-1 @ 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2

Verdict: PASS WITH NOTES

Nothing blocks on Correctness or Evidence. There are four Documentation findings (D1 to D4), each must-fix before the merge, with no re-gate. None of the sentences involved is the human's wording, so the worker applies the words below and the PR body lists them. All line numbers are at the head, in the C:/dev/wt/ua1 tree.

## Correctness

**Check 1 (the human's interim rule): met.**
- The eight export steps and their eleven pairs all print the figure. The tail is built at exportElapsed.mjs:34-37 and attached at publish.mjs:598, publish.mjs:602, selection.mjs:826 and selection.mjs:830. R1 and R2 in the e2e record show it on every export step.
- An `unknown-attempt` with U > T throws `ExportInconclusive` (exportElapsed.mjs:28 and exportElapsed.mjs:44). It prints as the third status, never PASS (publish.mjs:603, selection.mjs:830). R3 shows a real expiry: `[APPROVED'] INCONCLUSIVE`, exit 3.
- The FAIL inference holds:
  - the host's interval lies inside [p0, e1];
  - the host expires an attempt only when elapsed > TTL (publish.rs:212 and publish.rs:221);
  - so U <= T excludes an expiry.
- One gap remains, named in the form (§1.6). An ask step's late read is unchecked (only selection.mjs:628 calls `pairRead` on the ask path). It needs the execute's answer to arrive inside one request round trip after the ask showed, so it does not block (§31). D2 names it in the README.

**Check 2 (§1.7, the §21a question): holds.**
- `verdict` returns null for every outcome except `unknown-attempt` (exportElapsed.mjs:26).
- Every checked site already rejected `unknown-attempt`: publish.mjs:359, 425 and 497; selection.mjs:584, 604 and 727. The selection.mjs:628 path threw before and still throws.
- Exit codes change only for runs that already failed: 1 becomes 3 when the only non-pass is INCONCLUSIVE (publish.mjs:651, selection.mjs:833). The set of passing runs is unchanged. No §21a category is touched.

**Seams and the caller rule.**
- The helper's interface is the page's real `window.__SPATIAL_E2E__` hooks, unchanged.
- The outcome shape is the real one. T2 parses the two real run lines, and R1 to R3 run end to end.
- Every export of exportElapsed.mjs has a caller in a suite. `readTtlMs` is reached through `initTtl`.
- The only consumers of the new exit code 3 are custodian run scripts and milestone 3's sweeps. No tracked script reads these suites' exit codes.

Two non-blocking notes:
- **N1.** `pairs` is module-global (exportElapsed.mjs:13 and exportElapsed.mjs:50). When a step times out, its body keeps running and can push or stamp pairs into the next step's list. That step's figures or U can then be wrong. No PASS changes, because the timed-out step already FAILs and the suite exits 1. Recorded for the cause step.
- **N2.** U is rounded with `Math.round` (exportElapsed.mjs:42). A real U less than 0.5 ms above T therefore reads FAIL, not INCONCLUSIVE. It is sub-millisecond and never a pass. `Math.ceil` would close it. This is optional.

**Check 3 (may-claim / may-not-claim).**
- In the README, the figure is "a reading for triage, not a measurement under docs/08". Nothing claims a TTL change.
- The FAIL message, "the TTL did not end the attempt", excludes one cause and names none. The form authorises it (§1.4).
- I could not read the PR body (no shell). The reviewer or the custodian checks it against §1.1, F9's "This step grades no cause" and the Out-of-scope line.

## Evidence

**M1** was observed by hand at dcaed6edf21fe96776ee5dab1b938cf675972df2, the final code commit (80890488 changed only a comment line). It is recorded by full id in words, with no hash, at exportElapsed.test.mjs:5. Round 25, item 2 (c) and (d) are met.

R1 exited 0, R2 exited 0 and R3 exited 3, as §2.2 predicted.

**E1 (to resolve, not recomputable by me).** Amendment 2 item 5 says the main merge and the README commit change no e2e script and no exe source. If that holds, R1 to R3, which ran at 80890488, stand for the head. The reviewer runs `git diff --stat 80890488 39dc2c8e -- frontends/shell kernel engine protocol renderer ':!frontends/shell/e2e/README.md'`. The output must be empty. If it is not, R1 to R3 re-run at the head, and that is an Evidence finding.

## Documentation (must-fix before the merge, no re-gate)

**D1. frontends/shell/e2e/README.md:222 (the publish entry; the worker's words).** Two changes:
- Replace "each of `APPROVED'`, `REFUSED'` and `FILTERED'` ends its line with `prepare-to-execute`" with: **each of `APPROVED'`, `REFUSED'` and `FILTERED'` that sends its execute ends its line with `prepare-to-execute`**
  - Clause check: the tail lists only pairs with e0 set (exportElapsed.mjs:35-36). e0 is set only at the execute's or the send's evaluate (exportElapsed.mjs:50). A step that fails before its execute prints no figure.
- Replace "it reads INCONCLUSIVE (exit code 3) if more than" with: **it reads INCONCLUSIVE (exit code 3, unless a step failed or the suite's deadline passed) if more than**
  - Clause check: any FAIL gives 1, else INCONCLUSIVE gives 3 (publish.mjs:651). The watchdog exits 2 (publish.mjs:536-539).

**D2. frontends/shell/e2e/README.md:771 (the selection entry; not the human's wording, per README.md:767).** Three changes:
- Replace "ends its line with `prepare-to-execute` and, for each prepare and execute pair in the step, the whole milliseconds" with: **ends its line with `prepare-to-execute` and, for each prepare and execute pair in the step whose execute was sent, the whole milliseconds**
  - Clause check: exportElapsed.mjs:35-36 and exportElapsed.mjs:50.
- Replace "An execute that returns `unknown-attempt` never passes:" with: **An `unknown-attempt` outcome that the step checks never passes:**
  - Clause check: only the sites listed under check 2 and selection.mjs:628 call `pairRead`.
- Replace "an `unknown-attempt` read only after the ask was seen standing is not checked." with: **an `unknown-attempt` read only after the ask was seen standing is not checked and is judged by the step's own assertions, as before; `E-ASK`'s Cancel half does not assert the outcome's status, so it can pass there, which needs the export to end inside one request round trip after the ask showed (the form's §1.6).**
  - Clause check: the late reads are at selection.mjs:651-652 (Keep asserts `success`), selection.mjs:662-665 (Cancel asserts no status; it only requires the statement exactly when the export finished), selection.mjs:673-674 and selection.mjs:722-723 (both assert `success`).
  - The timing: once the ask stands with done false, the execute is in flight, and the host answers `unknown-attempt` only on a miss at its take (publish.rs:221). That answer must land after the driver's done read (selection.mjs:628).
  - This is a timing-inside-one-round-trip case (§31), named here and not blocking.

**D3. The form (on main): one appended row, class 3, references only, recording three deviations.**
- (a) The Change line says the figure is printed "on its own line". As built, it ends the line `runStep` prints, per §1.5 (exportElapsed.mjs:36, publish.mjs:598, selection.mjs:826). The row names §1.5 as the governing text.
- (b) publish.mjs's summary is a table whose export rows now carry the tail, so §1.5's "byte-identical" holds for selection.mjs:872 only.
- (c) §2.2 says "The exe built at the head", but the e2e record ran the exe built at be6aa620. The proof that this does not matter is the branch diff, which touches no exe source (and E1).

**D4. Amendment 2 item 2** cites "the worker's report" for the README clauses. That report is not filed: only the code worker's report is under state/consults. File the README worker's report under state/consults before the merge. Without it the item cannot be resolved.

**Check 5 (milestone 3).** The form says it: the sweeps will meet INCONCLUSIVE and exit 3, and how milestone 3 reads them belongs to its own record (the form's §3). Milestone 3's own form (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md, Amendment 3 item 12) counts "a failure of any other step" and does not define INCONCLUSIVE. This is not a finding against this PR: its §0.3 re-sweep at code start should carry a row on how an INCONCLUSIVE export step (exit 3) is read. My recommendation is not a pass, re-run alone under the machine rule (state/directives/2026-10-06-machine-script-adopted.md:20).

Other checks: the size overrun (154 lines over 7 files, against 150) is correctly class 6 for a five-line form (AUTONOMY.md:345). The Out-of-scope line names no §21a category as touched. The CI comment matches package.json's verify chain at the head. The pins I checked are at e54e4af2, on main; the reviewer recomputes the hashes.

Files:
- C:/dev/wt/ua1/frontends/shell/e2e/exportElapsed.mjs
- C:/dev/wt/ua1/frontends/shell/e2e/exportElapsed.test.mjs
- C:/dev/wt/ua1/frontends/shell/e2e/publish.mjs
- C:/dev/wt/ua1/frontends/shell/e2e/selection.mjs
- C:/dev/wt/ua1/frontends/shell/e2e/README.md
- C:/dev/spatial-ide/frontends/shell/PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-17-publish-approval-unknown-attempt-step-1-e2e-custodian-runs.md
