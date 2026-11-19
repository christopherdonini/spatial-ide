# The selection suite's export steps that end unknown-attempt: which place answered, whether a person can reach it, and the suite's wait for the dialog — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The piece the advisor's ruling ADV-2026-11-18-05 item 2 asks for, filed at `state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-05-selection-e-export-pr-b-does-not-wait-the-selection-piece-settles-the-answering-place-first.md`, under the node id the advisor's ruling ADV-2026-11-18-07 keeps, filed at `state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-07-the-daily-batch-the-selection-node-id-stands-no-time-zone-place-or-account-detail-in-a-filed-report-the-figures.md`. Its class is the five-line form with the reviewer alone and the Sonnet worker (ADV-2026-11-18-05 item 2; ADV-2026-11-16-06 item 2). The rulings are the advisor's under the human's delegation of 2026-11-13, not the human's words. The evidence it starts from is the diagnosis report filed at `state/consults/2026-11-18-b1-shell-half-pr-b-selection-export-diagnosis-tester-report.md`, with its run at main's 619a7cc9, and the series at 6f7e744c filed at `state/consults/2026-11-16-b1-shell-half-pr-b-head-series-tester-report.md`.

```
Authority: PLAN node selection-export-unknown-attempt; the advisor's ruling ADV-2026-11-18-05 items 2 (a) to (e) and 3, and ADV-2026-11-18-07, both under the human's delegation of 2026-11-13 and filed as named above.
Scope: frontends/shell/e2e/selection.mjs, and the selection suite's entry of frontends/shell/e2e/README.md; 2 files; declared line budget <= 40 added and <= 10 removed. Step 1 changes no tracked file: a line logged for (a) goes in the test build of the worker's own worktree only, is never committed, and is shown removed before step 2.
Change: Step 1 is a read, reported before any change: (a) which place answered unknown-attempt, the page's own answer while its attempt reference is not yet set or the host's store of attempts, by reading the code, else by one run of the selection suite with a line logged at each place; (b) from the code, whether a person can reach the execute in that window, that is, how the dialog's confirm reaches the execute and whether the dialog can be on screen and clickable before the reference is set; (e) whether the logs of the two runs at 6f7e744c, of 2026-11-16 and 2026-11-18, name the web view runtime's version, and each version they name. Step 2, by that read: if only a caller that does not wait for the dialog reaches the window, the suite waits for the dialog before each execute, as the publish suite does, and its README entry says so and says that the wait hides nothing a person can meet (item 2 (c)); if a person can reach it, no file changes, the piece stops, and the read goes to the advisor as a defect of the product (item 2 (d)).
Tests+mutation: no unit test is added or changed. The selection suite runs once at the piece's head, in the piece's one series, and every step passes. The mutation is the suite without the wait: at the merge base it fails E-EXPORT with unknown-attempt, as the filed run at 619a7cc9 shows; the reviewer confirms that no file on the export's path changed between 619a7cc9 and the merge base, or else the worker runs the suite once at the merge base and records the failure.
Out-of-scope: ADR, security, wire and guarantee are not touched: no product file under frontends/shell/src or frontends/shell/src-tauri changes (they are read, and the logging of step 1 is never committed); no other e2e script or README entry changes, the colour and publish entries included; KNOWN-LIMITATIONS, the walkthrough, the harness and the fixtures are not touched.
```

The closing amendment records step 1's answers, (e)'s versions if the logs name them, the series' run, and the reviewer's gate. Until the piece merges, a series that runs selection records these steps as the known failure of ADV-2026-11-18-05 item 1, with this node's id (item 3).

### Amendments

*(Opens empty; append-only.)*

#### Amendment 1 (2026-11-19), class 1: the closing record, before PR 336's merge request. Step 1's answers and (e); the gates; the words commit; the runs; the earlier words corrected (class 3); the window that remains; finding 5; the counts; the departures; CI; the holds. Written after both gate reports were filed.

*Written by the custodian, 2026-11-19. References and hashes only. Nothing below is a quotation.*

1. **Step 1's answers** (the Change line), from its report, `state/consults/2026-11-19-selection-export-unknown-attempt-step-1-worker-report.md`, as the reviewer's check 3 at 9a4c5833 reads it.
   - (a) The page answered: `runExecute` in `PublishPanel.tsx` gives unknown-attempt while the panel's attempt reference is not yet set. The host's two places are ruled out on the evidence step 1 names. This was settled by reading. No line was logged, so step 1 changed no file.
   - (b) A person cannot reach the window. The dialog mounts from the panel's state, and a person's confirm passes the dialog's own attempt id and never reads the reference. This is the form's first outcome, so nothing went to the advisor under ADV-2026-11-18-05 item 2 (d).
   - (e) Neither run at 6f7e744c names the web view runtime's version. The reviewer's scan of the twelve files found none (its check 3 (e)).
2. **The gates.** The reviewer alone (ADV-2026-11-18-05 item 2):
   - at 9a4c5833: FAIL, `state/consults/gates/2026-11-19-selection-export-unknown-attempt-gate-reviewer.md`. Its blocking finding 1 was Evidence, the mutation at the merge base. Findings 2 to 4 were wording.
   - at 40173dfe, attempt 2, limited to findings 1 to 4 and running nothing (ADV-2026-11-19-13 item 6): PASS, `state/consults/gates/2026-11-19-selection-export-unknown-attempt-gate-reviewer-attempt-2.md`.
3. **The words commit** 40173dfe (ADV-2026-11-19-13 item 2). Findings 2 to 4 were applied by the worker's script from the filed report, `state/consults/2026-11-19-selection-export-unknown-attempt-words-worker-report.md`. Against 9a4c5833 the commit changes comment and README text only, 5 lines added and 5 removed in the two files (attempt 2's check 3). So the series at 9a4c5833 stands for the head.
4. **The runs.**
   - The series at 9a4c5833, `state/consults/2026-11-19-selection-export-unknown-attempt-series-at-9a4c5833-tester-report.md`: the selection suite gave 18 PASS, 0 FAIL, 1 SKIP, rc 0, from 2026-11-19T07:24:04Z to 07:35:26Z.
   - The mutation, at the merge base f5584f28 on the app built at 9a4c5833 (ADV-2026-11-19-13 item 1), `state/consults/2026-11-19-selection-export-unknown-attempt-base-run-tester-report.md`: E-EXPORT, E-ASK and E-ASK-TWO failed with unknown-attempt; 15 PASS, 3 FAIL, 1 SKIP, rc 1. This answers finding 1.
5. **The earlier words corrected** (class 3; ADV-2026-11-19-13 item 3; the reviewer's note 6). ADV-2026-11-18-05 item 2 (c) and this form's Change line compare the wait with the publish suite's. By the gate's read, `publish.mjs` waits for the hook alone. `colour.mjs` waits for the dialog and the hook, as the selection suite now does. Step 2's worker reported the same and used the suite's own `pollUntil` (`state/consults/2026-11-19-selection-export-unknown-attempt-step-2-worker-report.md`). The comment and the README say what the code does, in the words of findings 2 and 3. Neither the ruling nor the form is edited.
6. **The window that remains** (ADV-2026-11-19-13 item 4; the reviewer's check 4). The panel's passive effect sets the attempt reference after the commit that mounts the dialog. So the dialog can be in the DOM a moment before the reference is set. The wait narrows that moment and does not close it. A person cannot reach it, and the suite can meet it only as an unknown-attempt FAIL, never as a false pass. It is recorded in the source comment in finding 2's words, and here. No node is opened. If a selection export step fails with unknown-attempt after this piece merges, it goes to the advisor with that item.
7. **Finding 5** (ADV-2026-11-19-13 item 5). Step 1's report, at its line 39, cites line 23 of `client.ts` for the publish execute's `recordNamed` line. That line is `frontends/shell/src/publish/client.ts:62 at 9a4c5833`; line 23 is a doc-comment line. The report is not edited.
8. **The counts** (Scope: at most 40 added and 10 removed, in 2 files). By `git diff --numstat f5584f28...40173dfe`:
   - `selection.mjs`: 14 added, 1 removed;
   - `README.md`: 1 added, 1 removed;
   - in all, 15 added and 2 removed in 2 files.
   No class 8 row is owed: both files are inside the budget.
   Paths changed on main since the merge base (ADV-2026-11-14-21 item 6 (a)):
   - At attempt 2, from 09:34:22Z to 09:36:51Z, there were none.
   - Since then, PR 335's merge f73a131c has changed `frontends/shell/e2e/README.md`. Its commits 5c913c14 and e1fd8495 touch the E-FL entry, not the selection entry.
   - `git merge-tree` of main and the head is clean.
   - The branch has not taken main in. The merge request names this.
9. **The departures** (class 1, disclosed). The run at the merge base was a tester's, where the form names the worker (ADV-2026-11-19-13 item 1).
10. **CI** (ADV-2026-11-18-12 item 6). At 40173dfe, by `gh run list` read at 2026-11-19T10:48:23Z, there were six runs, all success:
    - 44495676678 (Exposure scan);
    - 44495676520 (DCO sign-off);
    - 44495676554 (Product CI — shell, pull_request);
    - 44495676544 (Ported notices, pull_request);
    - 44495669079 (Product CI — shell, push);
    - 44495668921 (Ported notices, push).
    No run on the branch was red or cancelled.
11. **The holds** (ADV-2026-11-16-06 item 2 (e)). By the machine log, the piece had 3 holds, from 2026-11-19T07:01:30Z to 08:58:13Z: the series' build and its suite, and the run at the merge base. None stood beside another hold of this project.
12. **Superseded index.** Nothing in the form is superseded.

Read the last amendment first.

Nothing above is edited.

#### Amendment 2 (2026-11-19), class 1: PR 336's hold on the path drift; main taken in at N by the merge commit M; the run at M; the reviewer's third attempt; the counts; CI at M; the holds. Written after the third attempt's report was filed.

*Written by the custodian, 2026-11-19, from the advisor's ruling ADV-2026-11-19-20 item 6, under the delegation of 2026-11-13. References and hashes only. Nothing below is a quotation.*

1. **The hold.** The advisor's merge check on 40173dfe ended HOLD, on the path drift: `state/consults/merge-checks/PR-336-40173dfe3a07.md`. What settles it is the advisor's ruling ADV-2026-11-19-20, `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-20-pr-336-hold-on-the-path-drift-the-branch-takes-main-in-by-one-merge-commit-shown-by-script-one-run-at-m-the-reviewers-third-attempt-pr-337s-paths-listed.md`.
2. **N and M** (ADV-2026-11-19-20 items 2 and 3). The branch took main in at N = 7c3ccbcfc8f71d6535a3f7134f034874ecb29167 by one merge commit made by git, M = 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6, signed off, its message naming N. By the reviewer's script at M (its check 2):
   - M has two parents, 40173dfe then N;
   - `selection.mjs` at M is byte-equal to 40173dfe;
   - the README at M is N's file with one line replaced by the selection entry's line from 40173dfe, which is line 760 of the README at M and line 756 at 40173dfe (the reviewer's D2);
   - `git diff --name-only N M` names those two files only;
   - M's tree is the tree git computes for the merge of its two parents, so the merge has no hand edit.
3. **What main brought** (the reviewer's check 3 and its D1). From the old merge base f5584f28 to N, main changed 77 paths, 11 of them under `frontends/`: the first look's product change in the canvas and the residency session, with their tests; four other e2e scripts; the walkthrough; one script line in the shell's package manifest; and README hunks outside the selection entry.
   - Those hunks are the residency harness section (two insertions), the layout entry's line and the E-FL entry. Amendment 1 item 8 named PR 335's commits as touching the E-FL entry only. By the reviewer's check 3, e1fd8495 also changed the residency harness section and the layout entry's line. Amendment 1 is not edited.
   - None of these hunks is in the selection entry. No file that the source comment or the README line cites changed from 40173dfe to M.
   - The reviewer found every clause of the comment above `waitForExportDialog`, of the README's selection line and of `executeExport`'s doc true at M.
4. **The run at M** (ADV-2026-11-19-20 item 4), by a tester: `state/consults/2026-11-19-selection-export-unknown-attempt-run-at-m-tester-report.md`.
   - The selection suite ran once on an app built at M, on 2026-11-19 from 11:37:53Z to 11:48:48Z: 18 PASS, 0 FAIL, 1 SKIP, rc 0.
   - No export step ended unknown-attempt, and every step's result is the series' at 9a4c5833.
   - The reviewer tied the exe to M by its hash, size and time (its check 4).
   - The reviewer observed one field that the suite records and does not assert: it changed from the series, in E-STATUS-HEIGHT. This fits the first look's change, and the selection entry claims nothing about it.
   - Amendment 1 item 6 stands. One pass does not show the window closed.
5. **The third attempt** (ADV-2026-11-19-20 item 5): PASS WITH NOTES at M, `state/consults/gates/2026-11-19-selection-export-unknown-attempt-gate-reviewer-attempt-3.md`, gate-log 792.
   - It has no Correctness or Evidence finding.
   - Its D1 is item 3 here, and its D2 is item 2.
   - It ran reads and one byte-compare script, and named its reason before reading the exe's hash and times.
6. **The counts** (Scope: at most 40 added and 10 removed, in 2 files). By `git diff --numstat N...M`: `README.md` 1 added and 1 removed; `selection.mjs` 14 added and 1 removed; in all, 15 added and 2 removed in 2 files. Both files are inside the budget.
   - Paths changed on main since N (ADV-2026-11-14-21 item 6 (a)): none of the piece's two. By script at origin/main 25cf5a3f, read at 2026-11-19T12:40:29Z.
7. **CI at M** (ADV-2026-11-18-12 item 6). By gh run list, read at 2026-11-19T12:40:31Z, there are 9 runs at M, all success: 44514845319 (Exposure scan); 44514845323 (Ported notices); 44514845351 (DCO sign-off); 44514845383 (Product CI — shell); 44514839754 (Ported notices); 44514839767 (Rust fmt); 44514839822 (Governance CI — plan, queue, site); 44514839810 (Product CI — shell); 44514839764 (Product CI — Rust workspace). The branch has 21 runs, and none is red or cancelled.
8. **The holds** (ADV-2026-11-16-06 item 2 (e)). By the machine log, by the custodian's script, the run at M had 2 holds, the build and the suite, from 2026-11-19T11:34:04Z to 11:48:55Z. None stood beside another hold of this project. With Amendment 1 item 11's 3, the piece had 5. The third attempt took no hold.
9. **Superseded index.** Nothing in the form is superseded.

Read the last amendment first.

Nothing above is edited.
