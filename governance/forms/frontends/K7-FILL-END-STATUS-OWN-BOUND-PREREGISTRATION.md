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
