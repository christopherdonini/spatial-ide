# PR #217 gate 2 — reviewer
Reviewed: cut/shell-migration-milestone-2-phase-b @ 7ffdb6a7757fd65c2f12a861e9a1f70ddea83e48

**Verdict: FAIL.** One finding blocks: C1-R (Correctness), the rest of my gate 1 C1. E1 is closed by the post-route run, which the custodian has recorded but not yet committed. There are four Documentation findings (D1 to D4). Each must be fixed before the merge and is not re-gated. OPEN-13, OPEN-14 and OPEN-15 are still with the human, and I do not block on them.

## Correctness

**C1 as built is fixed.** I ran RB12g (`-t "RB12g"`) and it exited 0. It now asserts what my gate 1 probe saw go wrong:
- both cancel keys are called, the prepare's and the execute's;
- the old handle is closed 0 times before the execute's outcome and once after it;
- after success the statement names the bundle path; after refused there is no statement.

Iterating `ask.runs` only fails on the cancels list (mutation table below).

**C1-R (blocking): an execute that starts and ends while the ask stands is outside the choice, so "Cancel the export and go on" shows no statement for a bundle that was written.**
- **Where:** `answerOpenAsk` acts on `ask.runs` plus the runs standing at the choice (frontends/shell/src/App.tsx:1156 @ 7ffdb6a7). `handleExportRunning` deletes a run from `exportRunsRef` when it ends (frontends/shell/src/App.tsx:1115-1129 @ 7ffdb6a7). So a run that was reported after the ask appeared and ended before the choice is in neither set. Its `ended` handler ran with `cancelChosen` false, and nothing decides it at the choice.
- **How ordinary use reaches it:** this is my gate 1 sequence, with a small export.
  1. Start a whole-file export. The prepare starts.
  2. Open another file. The ask shows.
  3. The prepare ends into the prompt. Type the phrase and Submit. The execute finishes while the ask still stands.
  4. Choose "Cancel the export and go on".
- **Proven by a probe test.** I appended it to App.selection.test.tsx in my scratch worktree, ran it, then reverted the file (porcelain empty). Observed:
  - askShown true; executes `["at_p"]`; the panel headline before the choice was `Exported.`; askStill true;
  - cancels `["prepare:ds_…01"]`;
  - the open result `{kind:"admitted"}`;
  - statement **null**; closedOld 1.
- **Why it blocks:**
  - Amendment 7 item 2(c) says that when `ended` has resolved before the choice, the statement is decided at the choice (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1060 @ 7ffdb6a7).
  - Item 3 promises what the operator can observe. When the old export's outcome is a finished bundle, the statement appears, and ordinary use reaches this case: the ask stands while the export finishes (:1083-1084 @ 7ffdb6a7).
  - The round's own comment at App.tsx:1155 @ 7ffdb6a7 states the rule this breaks: an execute that started after the ask appeared is a run too.
  - The operator chooses cancel, the bundle is on disk, the old panel and its `Exported.` leave the screen, and nothing says the bundle was written.
  - This gap is in the fix I proposed at gate 1. That fix took the union at the choice, so it missed runs that had already ended.
- **Fix (a code change, so it is re-gated; correction round 2 of 2):**
  - In `handleExportRunning`, after `exportRunsRef.current.set(id, run)` (App.tsx:1120 @ 7ffdb6a7), add the run to a standing ask. For example: `if (askRef.current !== null) askRef.current = { ...askRef.current, runs: [...askRef.current.runs, run] };`.
  - A run reported during the ask is then marked at the choice. If it has ended by then, it is decided at the choice by the existing `lateCancelOutcome(true, run.end)`.
  - The union at :1156 can stay; it does no harm.
  - Test: add a pass 3 to RB12g. The execute resolves `success` at once (`pendingExecute = null`), so `Exported.` shows while the ask stands. Then choose Cancel and go on. The statement names the bundle path (`C:/out/bundle`), and the old handle is closed once.
  - Mutation: remove the added line. It must fail on pass 3's statement assertion.

**Checked with no finding:**
- `mode.set`:
  - `handleSelectMode` returns early when the mode is unchanged, as `handleSelectTool` does, then calls `transit` and records the row (App.tsx:1834-1839 @ 7ffdb6a7);
  - the class-C row is in surfaceRegistry.ts with a `[P6 placeholder]` statement, in the form of `tool.set`'s;
  - the mode is view state only: it is not persisted and not sent;
  - the console completeness tests pass unedited.
- RB12f pins stage 7's drop-as-Keep behaviour, which Amendment 11 item 3(f) records as a promise change.
- RB12g imports the real `prepareCancelKey`: the mock spreads `importOriginal`, so the seam has its real shape.
- The D3 message is dev-hook only.

## Evidence

**E1, closed.**
- Run 3 (state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-3.md @ ca2eae15) ran source-changed on its default route only. My E1 named both routes, and phase A's 14 base runs include the post route.
- The custodian has since run the post route at 7ffdb6a7. I read its log, `r1-source-changed-post-7ffdb6a7.log` in the custodian's scratch `mm2b-e2e/out`:
  - head 7ffdb6a7; started 12:44:12Z and ended 12:44:35Z;
  - 8 PASS, including S5d-post-check-route-confirmed; S3 INFO; rc=0;
  - the fixture lists before and after are byte-equal.
- With the 13 base runs and selection in run 3, phase A's fourteen base runs and selection all pass at 7ffdb6a7.
- I checked every run-3 log at 7ffdb6a7 by its last line and its FAIL count. All end `rc=0`. The only FAIL text is in selection's log, and selection reports 15 PASS, 0 FAIL.
- pan-anchor printed `==== 16/16 PASS ====` at both 719568f8 and 7ffdb6a7, so the cells' "0 PASS" is a script miscount. The staged correction says so.

**Other evidence:**
- **Mutations:** the four recorded mutations re-observed exactly (table below). Each failed in only its own test, 1 failed and 27 passed. The unmutated file passed 28 of 28.
- **A timeout in a shared run.** The first `npm run verify` in a shared hold timed out once: `noCoordinateLeak.test.ts` at 5,000 ms. That file is unchanged since gate 1. Under the machine rule this is not recorded as a failure; I report it here for a solo re-run if you want one. Run alone it passed in 1.38 s, and the full `npm run verify` re-run exited 0.
- **CI at 7ffdb6a7:** 8 check runs, all success. The governance, cfg-boundary and cargo workflows did not trigger, because the round touches none of their paths. I ran verify:plan and the scripts suite locally (below).

## Documentation (must fix before the merge; no re-gate)

**D1. The E1 correction is staged, not committed.**
- The appended "Correction after gate 2" in the run-3 record and the form's Amendment 12 are staged in the main checkout, not on main or origin. They must land on main before the merge.
- The PR body's e2e line names `source-changed` once. Replace it with `source-changed (default route and post route)`, citing the run-3 record's appended correction.

**D2. The PR body's Form line reads "Amendments 1 to 10. Read the last first."** That is stale. Name the last amendment on main when this is fixed (11, or 12 once it lands).

**D3. Amendment 11 item 1 and the PR body's Documents line list the reviewer's "D1, D3, D4 and D5".**
- My D2 was applied by the architect's D-4 README words.
- My D6 was applied in the PR body.
- My D7 is Amendment 11 item 3(g).
- Under the record cap, one reference row in the next amendment is enough: `Reviewer D2 → architect D-4's README line; D6 → the PR body; D7 → Amendment 11 item 3(g).`

**D4. Notes, nothing to fix:**
- **KNOWN-LIMITATIONS item 40.** This is Amendment 11 item 4, and it is with the human under item 2e. Commit 31e7a4ad is local and not pushed; it is a child of 7ffdb6a7 and changes item 40 and one AdmissionPanel comment. It is outside the head I reviewed and I did not review it.
- **The round report's §7 lines.** "the overruns are class 8" and "498 over" were read against §7 without the amendments' additions; the filing note says so. Under the amended ceilings nothing is over, so no class 8 is owed.

## §7, recounted from the merge base f87a7b66 (its own command, three excludes)
- 575cd4b3: 5,534 + 110 = **5,644**. 7ffdb6a7: 5,632 + 110 = **5,742**, so the round adds 98.
- The piece is 1,170 + 5,742 = **6,912 of 8,352**.
- Per file at the head, against the ceilings as §7 and its amendments set them:

| File | Lines | Ceiling |
|---|---|---|
| App.selection.test.tsx | 1,046 | 1,290 |
| selection.mjs | 707 | about 750 |
| App.tsx | 254 | 565 |
| surfaceRegistry.ts | 58 | 60 (B-X) + 5 (AM1-X) |
| AdmissionPanel.tsx | 18 | 20 (AM1-X) |

- Outside the count: KNOWN-LIMITATIONS.md 16, MANUAL-WALKTHROUGH.md 41, e2e/README.md 16.
- No new overrun. Amendment 9's two overruns stand as recorded.
- The round's diff (`git diff 575cd4b3..7ffdb6a7`) is 8 files, 113 insertions and 15 deletions. Each hunk maps to a finding: C1 and C-1 (App.tsx, surfaceRegistry.ts, App.selection.test.tsx), S2 (RB12f), D1 (the selection.mjs header), D3 (AdmissionPanel.tsx), D4 and D-5 (KNOWN-LIMITATIONS.md), D5, D-6 and D-7 (Part W), and D-4 (the README). Nothing goes beyond the findings.

**The documents as applied:**
- **D1:** the selection.mjs header is my words, wrapped.
- **D3:** the message is my words.
- **D4:** items 36 and 38 are my words byte for byte.
- **D5:** W2 and W9 are my words.
- **D-4:** the three README replacements are the architect's words.
- **D-5:** item 40 is the architect's words; the dropped source-watcher clause is with the human.
- **D-6:** W11's Step cell is the architect's words.
- **D-7:** the three untrue placeholders are named at W11.

**Amendment 11's corrections against both gate 1 reports:**
- Items 3(a) to 3(f) match the architect's D-1, D-2, D-3, D-8 and D-9.
- Item 3(g) matches my D7.
- Item 2's "the ten suites … pass at 719568f8" omitted the post route. Amendment 12 item 1 (staged) corrects that.

## Commands and exit codes
- `git fetch origin`: 0. The PR head is 7ffdb6a7 and the merge base is f87a7b66.
- `git worktree add --detach C:/dev/wt/mm2b-review2 7ffdb6a7…`: 0.
- `npm ci` in renderer/bundle-viewer: 0. `npm ci` in frontends/shell: 0.
- `npm run verify` in a shared hold (granted, then released): **1**. 1,331 of 1,332 passed; `noCoordinateLeak.test.ts` timed out, a timing-sensitive failure (above).
  - That file alone (`npx vitest run`): 0. `test:residency-trace`: 0 (76 passed). `test:citation-integrity`: 0 (30 passed).
- `npm run verify` re-run in a shared hold (granted, then released): **0**. 93 files and 1,332 tests passed; 76 and 30 passed.
- The mutation script in one shared hold (granted, then released):
  - the baseline: 0;
  - four mutations: 1 each;
  - porcelain was empty after each revert;
  - RB12g alone: 0.
- The C1-R probe (`-t "PROBE g2"`): 1, by design; it is a printing assertion. Reverted, and porcelain was empty.
- At 7ffdb6a7:
  - `node scripts/plan/verify-cites.mjs`: 0 (1,849 files);
  - `verify-quotes.mjs`: 0 (121 checked);
  - `verify-test-claims.mjs`: 0 (560 claims);
  - `verify.mjs`: 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` at 7ffdb6a7: 0, with 457 pass and 0 fail.
- §7's numstat at 575cd4b3 and at 7ffdb6a7: 0.
- `gh pr checks 217`: 0; 8 of 8 pass. `gh api …/commits/7ffdb6a7/check-runs` lists the same 8, all success.
- No exit code from 96 to 99 came from the machine script.

## Mutation table (applied at 7ffdb6a7 to src/App.tsx, one at a time, App.selection.test.tsx run, then reverted)

| Test, comment at @ 7ffdb6a7 | Mutation | Observed failing list | Matches the record |
|---|---|---|---|
| RB12g, frontends/shell/src/App.selection.test.tsx:1008-1011 | `for (const run of ask.runs)` | RB12g only: "the prepare's key and the execute's key, once each: expected [ Array(1) ] to deeply equal [ …(2) ]" | Yes, exact |
| RB16 (i), App.selection.test.tsx:633-634 | delete `recordNamed("gui-action", "mode.set");` | RB16 only: "a change of mode records one mode.set row: expected [] to deeply equal [ 'mode.set' ]" | Yes, exact |
| RB16 (ii), App.selection.test.tsx:635-636 | guard reduced to `if (view === null) return;` | RB16 only: "the mode already chosen records none: expected [ 'mode.set', 'mode.set' ] to deeply equal [ 'mode.set' ]" | Yes, exact |
| RB12f, App.selection.test.tsx:974-977 | delete `askRef.current?.answer(false);` in `confirmOpen` | RB12f only: "the first open was answered Keep by the second: expected 'pending' to match object { kind: 'refused', …(1) }" | Yes, exact |

## The scratch worktree
- C:/dev/wt/mm2b-review2 was clean before removal (porcelain empty).
- It was removed with `git worktree remove --force` (exit 0) and pruned. It is gone from `git worktree list` and from C:/dev/wt.
- No background process from this review is running. The process query matched only its own shell.
- I wrote nothing in the repository or in C:/dev/wt/mm2b, and I did not touch the custodian's staged changes in the main checkout. My scratch logs are in the session scratchpad (`g2-*.log`, `g2-mut.sh`).
