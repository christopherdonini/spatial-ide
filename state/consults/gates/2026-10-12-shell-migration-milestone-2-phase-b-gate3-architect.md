# PR #217 gate 3 — architect
Reviewed: cut/shell-migration-milestone-2-phase-b @ f64418bcc7eee2d0f418bd59f8c00c9554f2c04b

**Verdict: pass for correction round 2's scope.** Round 2's own finding, C1-R, is closed in the code and has evidence behind it.

C-1 below is not this round's finding and does not fail this gate. It is a gap in Amendment 7's design that the round leaves unchanged and that gates 1 and 2 both passed. It is a promise question about the human's ruling, so it goes to the human. Like C-2 (OPEN-13), it holds the merge until the human answers.

D-1 and D-2 are Documentation findings. Fix both before the merge; no re-gate.

C-2 (OPEN-13), OPEN-14, OPEN-15 and the item 2e drafts stay with the human. I note them and do not judge them here.

How I checked: I have no Bash, so I recomputed no diff, count or hash. I confirmed the refs by reading them: the branch and origin are both at f64418bc, and main is at 0d9e923e. Gate 3's reviewer confirms the round's file list (`git diff 31e7a4ad..f64418bc --stat`) and re-runs `npm run verify`, whose second run in the round report shows no exit code.

## Correctness

**Round 2: C1-R is fixed. No finding.**
- **The fix.** `handleExportRunning` adds the run to a standing ask right after it enters `exportRunsRef` (frontends/shell/src/App.tsx:1119-1122 @ f64418bc). The ask and its runs share the same `ExportRun` object, so `run.end`, set in the `ended` handler (:1125-1126), can be read at the choice.
- **The choice.** `answerOpenAsk` marks each run before its single `cancel()` and never reads the answer (:1158-1163). A run that ended before the choice is decided there, by `lateCancelOutcome(true, run.end)` (:1161-1162). A run still going is decided when it ends (:1127-1128).
  - That meets Amendment 7 item 2(c), including its clause on a run already ended (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1054-1061 @ f64418bc).
  - It meets item 3's operator-observable promise for the single-run case (:1081-1084 @ f64418bc).
  - It meets §8 item 31: no silent cancel (:759 @ f64418bc).
  - Items 34 to 37 (:1134-1137) are untouched: the statement still comes from the outcome alone, uses `bundle_path` whole, has no timer and appears in `region.layers` (App.tsx:1905-1909 @ f64418bc).
- **Keep, and an ask dropped by a later open, are unchanged.**
  - Keep does not read `ask.runs`.
  - A second `confirmOpen` builds a new ask from the runs standing (:1135-1147), so a run that ended under the dropped ask stays undecided. This is the drop-as-Keep that RB12f pins.
- **RB12g pass 3 pins the fix** (frontends/shell/src/App.selection.test.tsx:1050-1073 @ f64418bc).
  - It drives the reviewer's sequence through the real panel and dialog: the execute is reported after the ask appears and ends before the choice.
  - Before the choice it requires the ask standing, `Exported.` and no statement.
  - It asserts the statement path before the cancels, so the mutation fails on the statement.
  - The mutation is recorded as observed at d245975c (:1012-1015). f64418bc changes comments only, which the round report says and the reviewer confirms.
- **The seam.** The test uses the real `prepareCancelKey` and the real PublishPanel run report (PublishPanel.tsx:499-509 @ f64418bc). No imagined interface.
- **The round's reach.** From the round report and the spans I read, it touched `App.tsx` (the added line, its comment and the `askRef` doc comment at :1109) and the test (pass 3 and its mutation comment). Nothing goes beyond C1-R. The reviewer confirms the file list.

**C-1 (the human's, holds the merge beside OPEN-13): with two finished bundles, only the last one decided is stated.**
- **What the code does.**
  - App holds one statement (App.tsx:1113 @ f64418bc), and every finished outcome replaces it (:1128, :1162). At the choice, runs are decided in report order (:1158). A run that ends after the choice is decided when it ends.
  - A stopped or refused run never clears the statement (`lateCancelOutcome` returns null: OpenDuringExportAsk.tsx:30-34 @ f64418bc).
  - The round report's account (its lines 35-39) is accurate.
- **How ordinary use reaches it.**
  - The ask is not modal (App.tsx:1905-1909).
  - After a success the panel's Export button is enabled again: it is disabled only while preparing or in the dialog (PublishPanel.tsx:683-690 @ f64418bc).
  - The sequence:
    1. The ask shows over export A.
    2. A finishes.
    3. The operator exports again: prepare B, then execute C, which finishes or is still running.
    4. The operator chooses Cancel the export and go on.
  - The statement names C's bundle only. A's bundle is written, and A is the export the ask was shown over, yet nothing names it after the choice.
  - Before the round, the same sequence lost C instead (the C1-R gap). So the round moved this gap; it did not create it. With C still running at the choice, A is lost both before and after the round.
- **Is it consistent with the form?** No, not as the form is written.
  - Amendment 7 item 2(c) is a per-run condition: shown when, and only when, the conditions hold for this run (:1054-1061). A meets every condition, and its statement is never rendered.
  - Item 2(d)'s single slot (:1062-1065) does not settle the case. It clears a statement only on the next `confirmOpen` or the next export report, and neither falls between A's decision and C's.
  - The human's ruling (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 4) asks that the app state that the export finished and where its bundle is (my paraphrase). Read per export, that covers A.
  - So this narrows the ruling, not just a build detail. A class 2 note alone is not enough: the human decides.
- **Why it does not fail this gate.**
  - No untrue word is shown, and §8 items 34 and 35, the guards for an external side effect under ADR-006, hold.
  - A's own `Exported.` and its destination were on screen before the operator started the second export.
  - The gap is in my Amendment 7 design and predates this round.
- **Options for the human:**
  - **(A) Accept one statement.** Record it in the next amendment as a class 2 row. Words (not the human's wording): *Amendment 7 item 2(c), when one choice marks more than one finished run: App holds one statement (item 2(d)), and each finished bundle replaces it, decided at the choice in report order or when the run ends after the choice. So when two marked runs both end in a bundle, only the last decided is stated. A stopped or refused run never clears it.*
    - Each clause checked: one statement, App.tsx:1113; replaced by a finished bundle, :1128 and :1162; report order, :1144 and :1122, iterated by the Set at :1158; decided after the choice, :1125-1128; never cleared by a stopped or refused run, OpenDuringExportAsk.tsx:30-34 (all @ f64418bc).
    - The same rule also goes into the source comment at App.tsx:1113.
  - **(B) State every finished bundle of the choice.** `lateCancel` becomes a list in decision order, cleared as 2(d) says now. RB12g gains pass 4: two finished executes, both paths shown. Its mutation keeps only the last statement. This is a code change, so it is re-gated, and it needs the human's leave beyond round 2 of 2.
  - My recommendation: (B). It is small, and it matches the ruling as worded.

## Evidence

**Closed for the round. No finding.**
- **Run 4** (state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-4.md:7-23 @ 0d9e923e):
  - the thirteen base suites, selection, and source-changed's post route all exit 0 at f64418bc;
  - fixtures are 17 unchanged;
  - pan-anchor is read by its own summary line, and residency-harness as giving no verdicts.
  - This matches the run-3 correction's terms (run-3.md:45-55 @ 0d9e923e).
- **The scratch probe** (run-4.md:25-43 @ 0d9e923e):
  - It drives the C1-R sequence through the dev hooks the suites use. The execute hook goes through `executeInStagedScope`, so it reports a real run (PublishPanel.tsx:499-509).
  - It refuses a pass, reporting INCONCLUSIVE, unless the ask stood, `Exported.` showed and no statement was shown before the choice. All four runs met those conditions.
  - It passed twice unmutated and failed twice with the round's line removed, with no statement shown. That is C1-R observed on real WebView2, and its reversal.
  - The probe and its patch are untracked. Each is named with its sha256 and cited as evidence of a run, not as Authority.
  - RB12g pass 3 is the committed proof. Moving the probe into selection.mjs would be a follow-up, not owed here.
- Amendment 13 item 2's discharge clause resolves to these rows. Item 1's names RB12g pass 3 and d245975c, and both resolve.
- **§7.** Amendment 13 item 4 (form:1331 @ 0d9e923e) agrees with the gate 2 reviewer's counts plus the round's net change: App.tsx +3 −1 on a line the piece added gives +2, and the test gives +29. That is 5,632 + 31 = 5,663 insertions, App.tsx 254 → 256 and the test 1,046 → 1,075. Nothing is over, and no class 8 is owed. The reviewer recounts.
- **Left to gate 3's reviewer:** the `npm run verify` exit code and CI at f64418bc.

## Documentation (must fix before the merge; no re-gate)

**My gate 2 D-2 and D-3, as applied at 31e7a4ad: resolved, no finding.**
- KNOWN-LIMITATIONS item 40's second to fourth sentences are my D-2 words byte for byte (KNOWN-LIMITATIONS.md:377 @ f64418bc). They are still a draft for the human under item 2e.
- AdmissionPanel's comment is my D-3 words (frontends/shell/src/admission/AdmissionPanel.tsx:328 @ f64418bc).

**Amendments 12 and 13 against both gate 2 reports: they match.**
- Amendment 12 item 1 is my E-1 row, and item 2 is my D-4 row (form:1318-1319 @ 0d9e923e).
- Amendment 13 item 3 matches the reviewer's D3 row word for word (form:1330 @ 0d9e923e; reviewer report line 79).
- Item 4's sums are checked under Evidence above.

**D-1. Amendments 12 and 13 correct earlier amendments and carry no superseded index** (round 12, clause (e); Amendment 11 had one, form:1308-1310 @ 0d9e923e).
- Append this row, as references only, to the next amendment (or the closing amendment): *Superseded index: Amendment 11 item 1, the document items' attribution → Amendment 12 item 2 and Amendment 13 item 3; Amendment 11 item 2 → Amendment 12 item 1.*
- C-1's row goes in the same amendment if the human answers (A).

**D-2. The PR body; the custodian confirms each point, because I cannot read it.**
- The reviewer's gate 2 D1: the e2e line reads `source-changed (default route and post route)`, and it now adds run 4.
- The reviewer's gate 2 D2: the Form line names Amendment 13, or the last amendment on main when this lands.
- Amendments 11 to 13 are on main only. The branch takes them when main is merged in before the merge.

**Noted, not judged:** C-2 (OPEN-13), OPEN-14, OPEN-15, and the item 2e drafts, item 40 among them.

## Files read
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-correction-round-2-report.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate2-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate2-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-4.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-3.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendments 11 to 13, @ 0d9e923e)
- C:/dev/spatial-ide/AUTONOMY.md (§22) and AI_DEVELOPMENT.md (the record cap line)
- C:/dev/spatial-ide/.git refs: HEAD, refs/heads/main, refs/heads/cut/shell-migration-milestone-2-phase-b, refs/remotes/origin/cut/shell-migration-milestone-2-phase-b, worktrees/mm2b/HEAD
- In C:/dev/wt/mm2b @ f64418bc:
  - frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendment 7; §8 item 31)
  - frontends/shell/src/App.tsx (110-129, 1090-1184, 1900-1913)
  - frontends/shell/src/App.selection.test.tsx (960-1076)
  - frontends/shell/src/feature/OpenDuringExportAsk.tsx
  - frontends/shell/src/publish/PublishPanel.tsx (370-530, 640-769)
  - frontends/shell/src/admission/AdmissionPanel.tsx (267-331)
  - KNOWN-LIMITATIONS.md (374-381)
  - state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md (item 4, by search)
