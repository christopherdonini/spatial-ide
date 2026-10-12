# PR #196 gate 1 — architect
Reviewed: cut/e2e-hover-establishing-read-stale @ 86c26f2bd1d11dba1b195ea54ce6592180cac10e

**Verdict: block. One Evidence finding (E1), which needs evidence only and no code. Correctness: pass. Documentation: two must-fix findings (D1, D2).**

Every cite below is read at the head named on line 2, unless it names main or the base. Main's `frontends/shell` is identical to the base d007a50b, so I read the base text from main. I have no shell, so I recomputed no hash. The reviewer's diff check under §9 covers the byte-identity of items 14, 15 and §2.3.

## Correctness: pass

**The code against §2 and Amendment 1:**
- **The barrier** is at `frontends/shell/e2e/lib.mjs:639-658`.
  - The standing read comes first (640).
  - The leave point is 4 CSS px above the top edge at the horizontal centre, then 4 px left of the left edge at the vertical centre. Each point is accepted only if `elementFromPoint` is neither the canvas nor inside it (641-647).
  - If no point qualifies, it fails by name (648).
  - The leave move is at 649.
  - The clear-wait is bounded by `HOVER_BARRIER_CLEAR_TIMEOUT_MS` = 5,000 (599) and fails by name with the label, the standing readout and the last state (650-653).
  - Then it moves to the target and runs the unchanged confirmed-id poll for 5,000 ms (654-655).
  - It logs one line per attempt (656) and returns `{ ok, last }` (657).
- **Why the ordering holds:** the §2.1 reasoning against the §0.4 interfaces holds whether or not the readout was already clear.
- **Route A as built:** route B was not written, and the report's stage 2 states that route A holds.
- **OPEN-3:** no fixed sleep and no frame count is used as a wait. The only `sleep` is the 200 ms poll interval inside `waitForCondition`, which is a predicate wait.

**§8, item by item, as Amendment 1 amends it:**
1. Only `lib.mjs` and `regression.mjs` change; the report's §8 item 1 states this, and the custodian's filing note checked it. Pass.
2. Case (iii)'s non-comment lines are unchanged: head `regression.mjs:1303-1342` against base `:1304-1343`. Only base 1319-1320 changed, inside the permitted 1318-1320, and its comparison (head 1324-1342) is untouched. Pass.
3. There is no retry or re-established hover in (iii). Pass.
4. No product code is committed. Pass.
5. No assertion, predicate, timeout, notch count or step bound changed. The 5,000 ms id wait moved into the export with the same value. Pass.
6. Pass (OPEN-3, above).
7. Every id-taking attempt goes through the export: A9′ at `regression.mjs:858`, and K6's helper at `:1116`, which all five callers (1281, 1307, 1459, 1473, 1586) use. The other id reads in K6 (1375, 1472-1539) are assertion reads after camera changes, not candidate attempts. Pass.
8. No timing figure is reported. Only bounds appear. Pass.
9. Every changed test has a recorded mutation (M1, M-B, M2 to M5), and no `verify-mutation` run is called an observation. M1's observation is subject to E1.
10. The one export has a caller in `regression.mjs`, with two call sites. Pass.
11. There is no dependency or lockfile change. Pass.
12. No quote is marked verbatim. Pass.
13. `source-changed.mjs` and `residency-harness.mjs` are untouched. Pass.
14. `lib.mjs` has insertions only, after its last line at the base. Base line 595 is `}` at EOF, and the head adds 596-658, which is 63 lines. Pass.
15. The private copies match the base by reading: `lib.mjs:602-611` against `regression.mjs` base 145-154, `:613-629` against base 1177-1193, and `:631-633` against base 1199-1201. None is exported. Pass, with the reviewer confirming by diff.
16. There is one export. Its `(page, target, label)` are all passed by both call sites. Pass.

**Other checks:**
- **§7:** by hunk count I get `regression.mjs` +17 −18 and `lib.mjs` +63, so 98 lines in 2 files against 140. No class 8.
- **Round-4 seam:** the barrier is written against deck's and `WorkingCanvas.tsx`'s actual interfaces (§0.4; the worker re-derived them at the base and I1 did not fire). It is proven end to end against the real app.
- **Round 25:** no overrun, so no class 8 is owed. The class 9 placement is declared in Amendment 1, which is in the base's ancestry, so it came before any code. No `verify-mutation` run is called an observation. No test-text span is pinned at a branch commit; the observation commits are named in full in the code comments. The form is the full form.
- **Milestone 2's later use (a reading only):** `{ ok, last }` with `last.id` set when `ok` gives the "oracle id only through the establishing helper" that `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:315` (on main) requires.
  - A later caller that needs a non-id outcome would add its parameter together with its own caller, in its own piece. Item 16 binds this PR only.
  - The two texts of the readout reader stay until milestone 2's re-sweep consolidates them, as the ruling foresees.

## Evidence: FAIL, on E1 only

**E1 (Evidence, blocking): M1's observation comes from one run in a shared hold, and nothing records that it was re-run alone.**
- **The rule:** the human's machine rule, `state/directives/2026-10-06-machine-script-adopted.md:20` (paraphrased here), says a timing-sensitive failure seen in a shared run is not recorded as a failure; the custodian re-runs it alone.
- **M1 is in scope:**
  - The form names M1 under that rule (§5, the Shared runs paragraph).
  - The form calls the stale read a race (§4 T1).
- **Where it was recorded:** the report runs M1 in a shared hold (report line 80, "Run M1: rc 1"). It is recorded as a failure in the committed comment at `regression.mjs:1273-1274`, in the report and in the PR body. No record shows an alone re-run or a decision on one.
- **A drafting defect in the form:** the form's §5 has the custodian "decide whether" to re-run. That softens the human's line, and by precedence the human's line governs.
- **Why it is narrow:** the failure message's expected id, 50244, is the standing readout that the barrier logged in all four clean runs at 801, and the last-seen id is the true one. So the message shows the mechanism. H1 and §5's falsification are not in doubt. What is missing is admissibility under the human's rule.
- **To resolve it, either of these:**
  - (a) the custodian shows from this project's own hold records and transcripts that no other heavy run overlapped M1's hold, so the run was alone in fact;
  - (b) one M1 run alone, on the same terms.
- Either way, append one row to the PR body and the record. With no code change, the Correctness verdict carries forward under `AUTONOMY.md` §22's carry-forward rule, and the re-gate reads E1 alone.
- M-B and M2 to M5 are deterministic edits, not races, so the rule does not reach them.

**Everything else in the PR body is supported by the report:**
- the runs and their results;
- the barrier lines: 801 K6/re-pick, standing 50244 then taken 47080; 800 A9′, standing 27683 then taken 28625, stated as "could have";
- the mutation messages, which match the report;
- the fixtures' hashes;
- the worker's checks;
- the known base failure, C2′/C3′;
- the node that follows, `e2e-stale-expectations-reaim`, which `PLAN.yaml` places in slot 1 right after this fix.

`npm run verify` has not been run. The PR body says so, and the reviewer gate owns it (§9). The merge waits on it.

## Documentation: must-fix before the merge, with no re-gate

- **D1:** §4's last paragraph and Amendment 1 (A1.2, §4) place the M1 and M2 comment beside the K6 helper (`regression.mjs:1091`). It sits instead with K6's existing recorded-mutation block above `stepK6` (`regression.mjs:1270-1275`). Fix: either one sentence in the PR body recording where it sits, or a one-line pointer comment at the helper.
- **D2:** the PR body's runs table lists 4 runs at 1280 × 801 against §4's 3 and does not say why. Fix: add the report's account. The 4th run is a clean run: a failed M-B edit left the file unchanged, and the run was relabelled. That way every run is listed with where it came from (§9).

Files:
- `C:/dev/wt/k6/frontends/shell/e2e/lib.mjs`
- `C:/dev/wt/k6/frontends/shell/e2e/regression.mjs`
- `C:/dev/wt/k6/frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-10-09-e2e-hover-establishing-read-stale-worker-report-1.md`
- `C:/dev/spatial-ide/state/directives/2026-10-06-machine-script-adopted.md`
