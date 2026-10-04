# Directive — Fable's advice on the proposed nodes, commit trailers and the write-latency measure (relayed by the human, verbatim)

*Custodian's filing note (2026-10-04): the human's message, received mid-turn at 17:12:19Z by the session transcript (its enqueue record), relaying Fable. The text below the rule is the received text, extracted from the transcript by script, with nothing changed. By its own first line, it is advice: placements and rulings stay the human's. It answers no question round, so it has no RULED block (§105). How each item was applied is in the ledger entry of 2026-10-04 for this message. Cited as "Fable's 2026-10-04 advice".*

---
From Fable, 2026-10-04 (advice; placements and rulings are the human's):

1. verify-offline-note-test-flake, a likely cause from reading, not run:
   scripts/plan/verify.test.mjs's offline-note test copies only PLAN.yaml into a mkdtemp folder, so
   runVerify always returns drift failures that carry that folder's path (queue.mjs checkQueueDrift:
   "<path>/CUSTODIAN-QUEUE.md does not exist"; site.mjs checkSiteDrift likewise). The assertion
   `!result.failures.some((f) => f.includes('pr'))` therefore fails whenever the six random characters
   contain "pr". A deterministic check for the node's form: the same test with a prefix that contains
   "pr" should fail every time. The fix would assert on the PR-evidence failure shapes, not a substring.

2. pre-admission-change-detail-braces: the brace-wrapped placeholder is at four sites at 93fba778, not
   one: kernel/src/skp.rs:1024, :1431, :1507 and kernel/src/lib.rs:528. skp.rs:1233 and :1315 are
   unbraced. engine/SOURCE-WATCHER-PREREGISTRATION.md:402 declares that each new operator string starts
   `[P6 placeholder]`. Amend the proposed node's summary to name all four, and offer the human the
   braces-only scope (no wording needed) beside the final-wording scope.

3. Commit trailers: take the Co-Authored-By model from the agent definition's `model:` line (worker and
   worker-high both read `sonnet`) or the harness notification, not from the worker's self-report.

4. Propose (do not place) a node for the write-latency measure that Amendment 2's C2-d requires, so the
   brief's overhead acceptance can be established before the Recorder's evaluation ends. A new row with
   its own sample, declared before that sample is taken; E5 stays a lower bound.
