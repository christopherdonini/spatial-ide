# PR #217 gate 3 — reviewer
Reviewed: cut/shell-migration-milestone-2-phase-b @ f64418bcc7eee2d0f418bd59f8c00c9554f2c04b

**Verdict: FAIL.** One Correctness finding blocks (C1). If two executes finish while one ask stands, only the last one's statement is shown after Cancel the export and go on. My gate 2 C1-R is fixed as I specified it, and this residue comes from that same fix. Nothing blocks on Evidence. There are five Documentation findings (D1 to D5); each must be fixed before the merge and none is re-gated. OPEN-13, OPEN-14, OPEN-15 and the item 2e drafts (KNOWN-LIMITATIONS 36, 38, 40, 41 and Part W) are still with the human. I do not block on them.

## Correctness

**C1-R is fixed.**
- The added line is at frontends/shell/src/App.tsx:1122 @ f64418bc.
- RB12g passes at the head: 28 of 28 tests in the file.
- With the line removed, RB12g fails at pass 3's statement assertion. The failure is the recorded one, byte for byte (mutation table, M1).
- Pass 3 follows my gate 2 sequence: the ask stands over the prepare, the execute finishes while it stands (`Exported.`), then the choice is made. It asserts the statement path, both cancel keys once each, and one close.

**C1 (blocking): two executes that finish while one ask stands get one statement. The earlier bundle's statement is lost.**
- **Where.** `answerOpenAsk` decides every ended run in turn, and each decision calls `setLateCancel(finished)` (frontends/shell/src/App.tsx:1158-1162 @ f64418bc). `lateCancel` holds a single outcome (:1113), and the render shows that one (:1909). Both calls happen in one click handler, so only the last is ever rendered.
- **Proven by a probe test.** I appended it to App.selection.test.tsx in my scratch worktree, ran it, then reverted (porcelain 0). It uses the real App and the real PublishPanel, with the publish client mocked as RB12g mocks it.
  1. Start a whole-file export. Open b.parquet, and the ask shows.
  2. The prepare ends into the prompt. Submit; the execute succeeds with `C:/out/first`, and the panel shows `Exported.`.
  3. While the ask still stands, the panel's Publish button is enabled. Publish, type the phrase, Submit; the second execute succeeds with `C:/out/second`.
  4. Choose Cancel the export and go on.
  - Observed: executes `["at_x1","at_2"]`; askStill true; open `{kind:"admitted"}`; closedOld 1; the `.late-cancel-path` elements are `["C:/out/second"]`.
- **Why it blocks.**
  - Amendment 7 item 2(c) shows the statement "when, and only when" the choice was made for the run, the run is an execute, and it ended in a bundle (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1054-1060 @ f64418bc). Run at_x1 meets all three conditions and is not shown.
  - Item 2(d) ends a statement only at the next `confirmOpen` or the next export report (:1065). at_x2's report came before the choice, so it cannot end a statement that is decided at the choice.
  - Ordinary use reaches this: the ask has no timer, and the panel stays usable. No timing, dev hook or instrumented build is needed.
  - Before d245975c neither bundle got a statement (C1-R). The round's line puts both runs into the ask, and the single slot then drops the first.
  - The round report's "the last decided shows alone … the existing rule is unchanged" names no rule. The form has no rule for two statements.
  - The PR body's "an execute reported while the ask stands, and ended before the choice, now gets its statement" is untrue for the first of two.
- **Fix (a code change, so it is re-gated).** Round 2 of 2 is spent, so whether a third round needs the human is the custodian's call.
  - Make `lateCancel` a `readonly FinishedOutcome[]`, starting as `[]`.
  - The two clears (:1123 and :1136) set `[]`.
  - Both decision sites (:1128 and :1162) append: `setLateCancel((shown) => [...shown, finished])`.
  - The render maps one `LateCancelStatement` per outcome, keyed. The strings are the human's and do not change, and nothing new sits over the map (§8 items 4 and 18 hold).
  - Update the doc comment at :1112 to match.
  - Test: add an RB12g pass 4 using the probe's sequence. Assert the paths are `["C:/out/first","C:/out/second"]`, the cancels are each run's key once, and closes is 1.
  - Mutation: replace the append at the choice with `setLateCancel([finished])`. It must fail pass 4. RB12d's clear-on-report must stay green (M4 shows RB12d pins it).
  - The alternative is a ruling that only the last bundle is named. That is a promise change to Amendment 7 item 2(c), for the architect and the human, not for this gate.

**Checked: `setLateCancel(null)` in `handleExportRunning` (:1123), now that a report also joins the ask.** It hides no statement in ordinary use.
- `confirmOpen` clears the statement when the ask appears (:1136).
- No run in the current ask is marked until the choice, so no statement from the current ask can be standing for a report to clear.
- The only statement that can be visible while an ask stands comes from a run marked at an earlier choice that then ends in a bundle during the later ask. That requires the earlier cancel to land after the kernel's last cancel check. OpenDuringExportAsk.tsx:16-17 @ f64418bc names that window as shorter than one request round trip. A report during the later ask then clears the statement, as 2(d) says.
- That is a timing-only case, so it is named in D5, not blocked.
- M4 shows RB12d pins the clear on a report ("the next export report ends the statement", App.selection.test.tsx:928 @ f64418bc).

**Checked with no finding:**
- The joined run gets one `cancel()` and is marked before it (the `Set` at :1158 de-duplicates).
- A run that joined the first ask and ended before a second `confirmOpen` is not in the second ask. That is consistent with a run that ended before any ask appeared: the choice was not made for it.
- `handleExportRunning` acquires on `admittedDatasetRef.current`, which does not change while the ask stands.

## Evidence

- **`npm run verify` at the head, in a shared hold (granted, then released): exit 0.**
  - Typecheck, dev-origin, origin-event, adrIndex (34 ADRs), build, dist-clean and dist-notice all pass.
  - Vitest: 93 files and 1,332 tests passed. residency-trace: 76 passed, 0 failed. citation-integrity: 30 passed, 0 failed.
  - This settles the worker's second run, whose exit code was not shown.
- **The run-4 e2e record, checked against the custodian's scratch files in the session scratchpad under `mm2b-e2e/`.** I read:
  - `probe-c1r.mjs` (its sha256 is 8f118dba…0c025, as recorded) and `mutations/C1R.patch` (7e71d65e…f77a, as recorded; it removes exactly line 1122);
  - `run-c1r.sh`, `run-suite.sh` and `app-up.ps1` (lines 1-23: vite serves the checkout's source, so a patch takes effect on each fresh app);
  - `out/c1r-summary.txt`, `out/c1r-{unmutated,mutated}-{1,2}-f64418bc.log` and their fixture lists;
  - `out/r2-*-f64418bc.log` for all fifteen rows, and their fixture lists.
- **What the files show:**
  - Every c1r and r2 log starts at head f64418bcc7ee…. The start and end times match the record.
  - The two unmutated probe runs exit 0 and PASS, with the statement path equal to bundle_path and manifest true. The two mutated runs exit 1 and FAIL, with statementPath null and the rest the same.
  - Before the choice, all four logged ask true, openDone false, headline `Exported.` and statement false.
  - The summary ends "reverted; porcelain empty".
  - All fifteen r2 rows end `rc=0`, and every fixture list before and after is 17 lines and byte-equal.
  - selection: `15 PASS, 0 FAIL`; the only FAIL text is that summary line, and EXPORT-TODAY's SKIP is the recorded one. pan-anchor: `==== 16/16 PASS ====`. source-changed post route: S5d PASS. publish: EXPIRED' SKIP, for the standing reason.
- Amendment 13 items 1, 2 and 4 resolve against these files and against my recount below.
- **CI at f64418bc:** `gh pr checks 217` shows 8 of 8 pass, and the check-runs API lists the same 8, all success at f64418bc.
- **Governance scripts at the head:** all exit 0 (commands below). The scripts suite has 457 pass and 0 fail.

## Documentation (must fix before the merge; no re-gate)

None of D1 to D5 is the human's wording. Under item 2 the worker applies the words, and the PR body lists them.

**D1. The PR body's §7 line is stale.**
- It reads: **§7 (Amendment 10 item 1):** phase B is 5,644 lines, and the piece is 6,814 of 8,352.
- Replace it with: `**§7 (Amendment 13 item 4):** phase B is 5,773 lines at f64418bc, and the piece is 6,943 of 8,352.`
- Clause check: my recount below.

**D2. RB12g's first recorded mutation now survives.**
- The comment is at frontends/shell/src/App.selection.test.tsx:1008-1011 @ f64418bc. Iterating `ask.runs` only passes 28 of 28 at the head (M2).
- Reason: every run reported while the ask stands is now in `ask.runs` (:1122), so the union at App.tsx:1158 adds no run.
- Pass 1 is still caught when both the line and the union go (M3, the recorded message byte for byte). So the evidence holds, but the comment reads as a current kill.
- Append after :1011: `// AT f64418bcc7eee2d0f418bd59f8c00c9554f2c04b (PR 217 gate 3) this mutation survives (28 of 28 pass): since d245975c a run reported while the ask stands is added to the ask's runs, so they hold every run the choice acts on. With that line also removed, RB12g fails as observed above.`
- Clause check: App.tsx:1122 and :1144 @ f64418bc; mutations M2 and M3.

**D3. The comment at frontends/shell/src/App.tsx:1157 @ f64418bc now gives the wrong reason for the union.**
- Words: `// The ask's runs and the runs standing now. A run reported while the ask stands is added to the ask (handleExportRunning), so the runs standing add none; the union is kept and changes nothing.`
- Clause check: :1122 appends each run set while `askRef` is non-null; :1144 snapshots the runs standing when the ask appears; M2 survives.

**D4. The run-4 record overstates the probe's guard.** Its "What it asserts" bullet says that before the choice the probe requires the headline `Exported.` and no statement, or else reports INCONCLUSIVE.
- `probe-c1r.mjs` records the headline and the statement but returns INCONCLUSIVE only when the ask has gone or the open has finished (`if (!before.ask || before.openDone)`).
- The observations are not affected: all four runs logged `Exported.` and no statement.
- Appended correction words: `Correction (gate 3 reviewer, D4): before the choice the probe requires only that the ask stands and the open is pending, else INCONCLUSIVE; it records the headline and the statement without requiring them. All four runs recorded the headline Exported. and no statement (c1r-summary.txt).`

**D5. Name the timing-only case in the statement's source comment** (frontends/shell/src/App.tsx:1112 @ f64418bc; the wording rule's naming of a case that needs timing inside one round trip).
- Append: `A run marked at an earlier choice that ends in a bundle while a later ask stands shows its statement, and an export report during that ask ends it before the next choice; that bundle needs the earlier cancel to land after the kernel's last cancel check, a window OpenDuringExportAsk.tsx's constants comment names as shorter than one request round trip.`
- Clause check: :1127-1128 (the ended handler decides when `cancelChosen` is true); :1123 (a report clears); OpenDuringExportAsk.tsx:16-17.
- If C1's fix lands, write it as "its statements".

**My gate 2 D1 to D3, as applied:**
- **D1:** the PR body's e2e line under "After gate 1" reads `source-changed (default route and post route; the post route in the run-3 record's appended correction)`. The appended correction is on main.
- **D2:** the Form line reads `Amendments 1 to 13. Read the last first.`
- **D3:** Amendment 13 item 3 is my row byte for byte, and the PR body's Documents line points to it.

**31e7a4ad's two changes:**
- KNOWN-LIMITATIONS.md:377 @ f64418bc contains the architect's gate 2 D-2 words byte for byte. The clauses hold in the code: endViewGeneration, and `selection.end` gives a notice only when `dropped > 0` (viewTransitions.ts @ f64418bc). Item 40 is still a draft for the human (item 2e).
- AdmissionPanel.tsx:328 @ f64418bc is the architect's D-3 words, identical once the markdown escapes are removed. The "replaced by a later open" clause holds: `confirmOpen` answers the earlier ask false (App.tsx:1137).

**Scope.**
- `git diff 31e7a4ad..f64418bc` is two files, 32 insertions and 1 deletion: the line at :1122, the askRef doc comment at :1109, RB12g pass 3, and its mutation comment. Nothing goes beyond C1-R.
- The commit trailers name Sonnet 5.5, which matches worker-high's `model: sonnet`.

## §7, recounted from the merge base f87a7b66 (its own command, three excludes)

- At f64418bc: 5,663 + 110 = **5,773**, over 39 files. 7ffdb6a7 and 31e7a4ad are both 5,742, so the round adds 31.
- The piece is 1,170 + 5,773 = **6,943 of 8,352**.
- Per file:
  - App.selection.test.tsx: 1,075 of 1,290;
  - App.tsx: 251 + 5 = 256 of 565;
  - selection.mjs: 707;
  - surfaceRegistry.ts: 58;
  - AdmissionPanel.tsx: 18.
- Outside the count: KNOWN-LIMITATIONS.md 16, MANUAL-WALKTHROUGH.md 41, e2e/README.md 16.
- Amendment 13 item 4 is correct. Nothing is over, so no class 8 row is owed.

## Commands and exit codes

- `git fetch origin` (piped to tail): the branch then read back as f64418bc, and the merge base as f87a7b66.
- `git worktree add --detach C:/dev/wt/mm2b-review3 f64418bc…`: succeeded ("HEAD is now at f64418bc").
- `npm ci` in renderer/bundle-viewer: 0. `npm ci` in frontends/shell: 0.
- `npm run verify` in a shared hold (granted, then released): **0**.
- The mutation script (`npx vitest run src/App.selection.test.tsx` after each change) in one shared hold (granted, then released): base 0; M1 1; M2 **0**; M3 1; M4 1; base2 0. Porcelain was empty after each revert.
- The C1 probe (`-t "PROBE g3"`): 1, by design, because it is a printing assertion. Reverted with `git checkout -- frontends/shell/src`, and porcelain was empty.
- At f64418bc:
  - `node scripts/plan/verify-cites.mjs`: 0 (1,849 files, 60 advisories);
  - `verify-quotes.mjs`: 0 (121 checked, 90 verified, 30 baselined, 1 advisory);
  - `verify-test-claims.mjs`: 0 (560 claims, 164 files);
  - `verify.mjs`: 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 0, with 457 pass and 0 fail.
- The §7 numstat at f64418bc, 7ffdb6a7 and 31e7a4ad: 0.
- `gh pr checks 217`: 0, 8 of 8 pass. `gh api …/commits/f64418bc…/check-runs`: 8, all success.
- No exit code from 96 to 99 came from the machine script.

## Mutation table (src/App.tsx at f64418bc, one at a time, App.selection.test.tsx run, then reverted)

| # | Mutation | Observed | Matches the record |
|---|---|---|---|
| M1 | remove :1122, the join to the standing ask (RB12g pass 3's recorded mutation) | 1 failed, 27 passed. RB12g fails with: "pass 3: decided at the choice, the statement names the bundle the finished execute gave: expected null to be 'C:/out/g3'" | Yes, exact (App.selection.test.tsx:1012-1015 @ f64418bc) |
| M2 | `for (const run of ask.runs)` at :1158 (RB12g's earlier recorded mutation) | **28 of 28 pass: it survives** | No. It was observed at b258dff0 and is now equivalent (D2) |
| M3 | M1 and M2 together | 1 failed, 27 passed. RB12g fails with: "the prepare's key and the execute's key, once each: expected [ Array(1) ] to deeply equal [ …(2) ]" | Yes. It is the b258dff0 message: pass 1 is caught once the join is gone |
| M4 | remove `setLateCancel(null)` at :1123 | 1 failed, 27 passed. RB12d fails with: "the next export report ends the statement" | No record (a probe of 2(d)'s clear) |

## The scratch worktree

- C:/dev/wt/mm2b-review3 was clean before removal (porcelain 0).
- It was removed with `git worktree remove --force` (exit 0) and pruned. It is gone from `git worktree list` and from C:/dev/wt.
- No background process from this review is running. A process query for the worktree path matched only the query's own shells.
- I wrote nothing in the repository or in C:/dev/wt/mm2b. The main checkout's porcelain is as it was at the start.
- My scratch files are in the session scratchpad: `g3-verify.log`, `g3-mut.sh`, `g3-mut-*.log`, `g3-probe.txt`, `g3-probe.log`, `g3-scripts.log`, `g3-d3.js`, `g3-kl.md` and `g3-ap.tsx`.
