# K7's re-read of the residency status gets a bound of its own, 60 s — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The second step of the plan node k7-residency-status-after-zoom-out-under-the-suite-launch, placed by the advisor's ruling ADV-2026-11-21-05 under the human's delegation of 2026-11-13, filed at `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-05-k7-the-steps-wait-at-fault-its-own-60-s-bound-the-nodes-second-step-the-slowness-to-the-launcher-node.md`. Its class is the five-line form and the reviewer alone, with the standard worker (that ruling, item 3). Drafted by the custodian.

```
Authority: PLAN node k7-residency-status-after-zoom-out-under-the-suite-launch, its second step; ADV-2026-11-21-05 items 3 to 6 and 9 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-05-k7-the-steps-wait-at-fault-its-own-60-s-bound-the-nodes-second-step-the-slowness-to-the-launcher-node.md); the node's first read (state/consults/2026-11-21-k7-residency-status-after-zoom-out-under-the-suite-launch-read-1-tester-report.md); reuse index: three misses, no prior art recorded for e2e wait bound, status line poll timeout or playwright wait for text (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form).
Scope: 1 file, frontends/shell/e2e/regression.mjs (stepK7's re-read of the status and its failure line, a new constant beside K7's constants, K7's outer timeout where runStep calls stepK7, and each comment that calls K7_STATUS_SETTLE_TIMEOUT_MS the bound of K7's own re-read); declared line budget <= 40 changed lines by §21c's counting, this form excluded; no file under frontends/shell/src/ or frontends/shell/src-tauri/.
Change: K7's re-read of the residency status after the fifteen zoom-out notches waits up to a new constant K7_FILL_END_STATUS_TIMEOUT_MS of 60 s in place of K7_STATUS_SETTLE_TIMEOUT_MS's 10 s, K7's outer timeout is set from the sum of the step's inner bounds so that a passing step cannot reach it, and K7's failure line adds how many tiles were still queued at the bound, read from the page hook residencyQueuedTileCount; the assertion, the notch loop, the per-notch wait, the hover read and the restore are unchanged.
Tests+mutation: no unit test is added or changed (an e2e step); the evidence is ADV-2026-11-21-05 item 5, two runs of regression.mjs at the piece's head under the suites' own launch on port 5180, by the tester on a quiet machine: (a) one run with no failed row, a failed K7 in it being a stop to the advisor with no second run; (b) the mutation, one character of K7_SETTLED_PARTIAL_TEXT changed in the worktree and not committed, predicted to fail K7 at its new bound with its line naming the product's sentence as last read, then reverted to an empty porcelain.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no product code, no string the app shows, no dependency; K7_STATUS_SETTLE_TIMEOUT_MS keeps its name, its 10 s and its other users; the slowness under the suites' own launch is not read here (that ruling, item 8).
```

### §A. The advisor's ruling (by reference)

ADV-2026-11-21-05, the advisor's under the human's delegation of 2026-11-13, not the human's words (`state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-05-k7-the-steps-wait-at-fault-its-own-60-s-bound-the-nodes-second-step-the-slowness-to-the-launcher-node.md`). Its item 4 lists what changes, and nothing else changes; its item 6 is what the reviewer reads; by its item 9, ADV-2026-11-21-03 item 11 stands until this fix merges.

### §B. On the node's record (class 3)

By that ruling's item 7, the advisor's two leads in ADV-2026-11-21-03 item 8 were wrong, by the node's first read: the same failure is filed under the harness on 2026-10-11, before PR 335, so that merge is not its origin; and the harness's fresh-launch K7 passed at least 12 times, not three.

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the closing at 23f04d93, before its merge request: the gate PASS WITH NOTES, D1 and D2 closed by ADV-2026-11-21-10 with no re-gate; the two runs standing for the head; the size (class 8); N1 carried

*Written by the custodian, 2026-11-21, after the gate and the comment commit, before the merge request, by ADV-2026-11-21-10 item 4 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-10-k7s-d1-and-d2-closed-with-the-reviewers-words-five-blocks-one-commit-no-re-gate-a-watchdog-end-is-a-stop.md). References only; nothing below is a quotation.*

1. **The gate** (item 4 (a)). The reviewer read the fix at 9aa34054 and ended PASS WITH NOTES, with no Correctness or Evidence finding (state/consults/gates/2026-11-21-k7-residency-status-after-zoom-out-under-the-suite-launch-gate-reviewer.md). Its D1 and D2, on comments, are closed by the ruling's five blocks, the reviewer's words, applied by the standard worker in one commit, 23f04d93, with no gate reading it again (item 4). The custodian's script found that commit one commit on 9aa34054, regression.mjs alone, every changed line a comment line, and the file byte-equal to the ruling's build (state/consults/2026-11-21-k7-residency-status-after-zoom-out-under-the-suite-launch-step-2-comments-worker-report.md). The worker ran node --check on the file, exit 0, and nothing else (item 2).

2. **The two runs** (item 4 (b)), at 9aa34054, under the suites' own launch on port 5180, by the tester on a quiet machine (state/consults/2026-11-21-k7-residency-status-after-zoom-out-under-the-suite-launch-step-2-evidence-tester-report.md). Run (a) had no failed row, and K7 passed in 159.5 s. Run (b), with one character of K7_SETTLED_PARTIAL_TEXT changed in the worktree, failed K7 at its new bound, its line naming the product's sentence and 0 tiles queued. The change was reverted to an empty porcelain. The two runs stand for the head, whose commit changes no line of code (item 3).

3. **The tester's report** (item 4 (c)). The gate's R1 to R4 are corrected in the filing note of the tester's report: the outer timeout it names, its port checks listing IPv4 only, the frontends log's redirect, and run (a)'s K7 line, cut short in the report. The logs are the record.

4. **The size** (item 4 (d)). At 23f04d93 against the base af3cd53c: 33 lines in and 15 out in regression.mjs, 48 in all, against the form's 40. At 9aa34054 it stood at 39. The re-wrapped comments touch lines the fix had not touched. The excess is class 8, the gate's own words, and needs no further ruling at that count.

5. **Class 3, the record.** The Change line's clause that a passing step cannot reach K7's outer timeout is stronger than the code, by the gate's D1. The comment at the head says what holds: a passing step reaches it only if the waits' poll overshoot and the page calls with no bound of their own take 30 s or more together (ADV-2026-11-21-10 item 1 (e)).

6. **Carried** (item 4 (e)). N1 goes to the proposed launcher node's first question, beside the slowness (ADV-2026-11-21-05 item 8). The whole-run watchdog of 900 s is armed before the launch, and run (a) used about 704 to 717 s of it.

7. **Standing** (items 5 and 6). Until the launcher node is read, a run of regression.mjs that the whole-run watchdog ends is a stop for the advisor, with how long the launch took, and is not read as a failed row. From this fix's merge, K7 is an ordinary row again, and ADV-2026-11-21-03 item 11 ends (ADV-2026-11-21-05 item 9).

8. **The PR.** PR 345, cut/k7-fill-end-status-bound at 23f04d93, out of draft. CI at that head was read at 2026-11-21T08:19:31Z: 6 runs, all completed with success.

9. **Superseded:** the Change line's clause named in row 5, as row 5 reads it.

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — PR 345 merged at 89238a20 by the advisor's merge; main's CI there; K7 an ordinary row again

1. **Merged.** The advisor's verdict on PR 345 at 23f04d93 is MERGE, filed at state/consults/merge-checks/PR-345-23f04d93253c.md. The advisor merged it by merge commit 89238a20f5f16adf206e9cd3aefc7ec45e583e44, at 2026-11-21T08:50:43Z (the grant, item 5).

2. **Main's CI at the merge commit:** 4 workflow runs and their 6 jobs, each completed success, read at 2026-11-21T08:57:37Z.

3. **From this merge** K7 is an ordinary row again, and ADV-2026-11-21-03 item 11 has ended (ADV-2026-11-21-05 item 9). The rule of ADV-2026-11-21-10 item 5 stands until the launcher node is read.

4. **The plan node** is done, its evidence the PR.

5. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.
