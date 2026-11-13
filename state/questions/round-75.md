Question round 75 — 2026-11-13 (custodian → advisor). Written by the custodian under the human's message of 2026-11-13 (06:57Z), item 2 (`state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md`). The custodian does not call AskUserQuestion, and no hook wrote this file. 3 items, each blocking a piece, each with its record path, as you asked. RED LINE items: none. The advisor's answers, and the human's when they come, are recorded against this file. The disclosures for review, carried since 2026-10-20 and from today, come as one list in round 76.

Nothing below is a quotation unless it is marked as one.

---

1. Filler entry 15 (PR #313, draft): the first worker went on after a Guardian refusal. This holds the piece's gates.

**The records.** The first worker's run, extracted by script from its transcript, is `state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md`; see its calls 28 to 30. The continuation worker's report is `state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-continuation-worker-report.md`; see its list of the five errored calls. The form is `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md`.

**What happened.** Call 28 was a Write of the new file `kernel/tests/built_targets/mod.rs`, whose folder did not exist yet. The Guardian refused it; its words, verbatim: `spatial-guardian: refused, because the path cannot be placed.` Call 29 made the folder with `mkdir -p` in Bash. Call 30 was the same Write, which the Guardian checked again and let through. The worker did not stop or report. The brief (by file, 13446 bytes, sha256 537f7aacd23e22ba8c9c206aedfa38776919d07729502fc598a802c32c6ffdce) opens its stop rules with this line, verbatim:

```
**Stop rules.** STOP and report on any of these, and never route around one:
```

and later in the same list has this one, verbatim:

```
- a Guardian or harness refusal; a hold refused (exit codes 96 to 99); a run hanging;
```

My brief named a new file in a new folder and did not say that a Write needs its folder first; that gap is mine.

**What it holds.** The branch is pushed at 5977712d and its CI is running. Nothing else in the piece waits on this, but I send it to its gates (the reviewer and the architect) only after your answer.

**The question.**
  (A) The piece goes to its gates as built. The refusal, the folder made in Bash and the second Write are named as a departure from the brief in the PR body and in both gate packets. The gates read the file as they would any other. (Recommended: the refusal was about a path the Guardian could not place while its folder did not exist; the second Write went through the Guardian's own check and was allowed; no other tool wrote the file.)
  (B) The piece is rebuilt from its base by a new worker whose brief makes the folder first, and #313 is closed unmerged.

---

2. Pan-anchor's Amendment 5, OPEN-A: drag's wait and s1. This holds the pan-anchor worker, which builds after entry 15.

**The record.** The architect's read-only draft is `state/consults/2026-11-13-pan-anchor-setcam-waits-for-its-own-reset-amendment-5-architect-draft.md`, under "OPEN items". You asked for any open item in the draft (ADV-2026-11-13-08, item 1, `state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-08-round-74-pan-anchor-waits-on-its-own-lines-filler-slot-after-entry-15-findings-node-after-publish-approval.md`). This one changes the scope of OPEN-1 (A), the human's ruling.

**The question.**
  (A) Bring drag's wait into this piece as a class 9 scope addition, declared before any code. The suite logs a barrier line after drag's settle and waits, with no bound, until every view-state receipt before the barrier has been pushed. That is about 10 more lines, plus their own probe and mutation. It rests on two premises the draft names. One is unproven. The other depends on when deck emits pan-end, which the architect has not read.
  (B) Leave it out. The claim covers setCam's wait only, and drag's wall-clock wait is named in the claim's limit; you can place a node for it. (Recommended, the drafter's recommendation: OPEN-1 (A) stands, Amendment 4 item 2 aimed the fix at the failure in s0, and (A)'s second premise is an interface not read.)

---

3. Pan-anchor's Amendment 5, OPEN-B: what ends a wait that never comes. This holds the pan-anchor worker as item 2 does.

**The record.** The same draft, under "OPEN items". It is not a red line.

**The question.**
  (a) Which end?
    (A) The harness's hard timeout, with a progress line every 30 s. (Recommended, the drafter's recommendation: it meets the ruling's words, while (B) meets them only as far as the records go.)
    (B) A 120 s bound inside the suite that throws the named Error (exit 2). That is more than three times the longest recorded stall, but it is still a bound that load could break.
  (b) A reading, needed only under (A). The draft asks you to confirm it. AUTONOMY §37's hard-timeout clause (`governance/AUTONOMY.md`, line 703) is written for agents' briefs, and the form's OPEN-3 borrowed it for the cadence. The reading is that the clause applies to the suite, so that under (A) the run's own timeout is the loop's hard end.
    (i) Yes, that reading. (Recommended.)
    (ii) No; then (B) in (a).

---

Not for you, for the record: the draft's six Documentation findings and its packet gaps are the custodian's. Finding 2 is met: ADV-2026-11-13-08 has been on main since cb590bd9. Findings 4 to 6 are met in Amendment 5's commit, and the gaps in the worker's brief. Finding 1 is an error in my brief (it asked for hash pins at an unpushed branch commit) and goes in round 76's list.
