# Directive — Fable's advice for the forms that follow question round 51 (relayed by the human, verbatim)

*Custodian's filing note (2026-10-04): the human's message, received mid-turn at 18:06:24Z by the session transcript (its enqueue record), relaying Fable. It arrived three seconds after round 51 was answered. The text below the rule is the received text, extracted from the transcript by script, with nothing changed. By its own first line it is advice, not rulings. It answers no question round, so it has no RULED block (§105). Under round 51, O-2 was answered with the data-plane piece and O-3 with closing the publish half; these are the cases its items 1 to 3 and item 4 address. How each item was applied is in the ledger entry of 2026-10-04 for round 51. Cited as "Fable's round-51 advice".*

---
From Fable, 2026-10-04, for the forms that follow round 51 (advice, not rulings):

1. If H-S is confirmed and O-2 is (1): the data-plane form should say whether TERM_COMPLETED is covered
   too. In protocol/data-plane/src/adapter_ws.rs the writer acquires a credit permit before rx.recv(),
   and a closed channel (None) is what yields Terminal::Completed. So a normal completion also waits
   for one credit beyond the last batch, not only a producer failure.

2. The same form should state what happens to batches queued before a failure: delivered under credit
   first, or dropped in favour of the terminal.

3. A fact for its user-visible section, read not run: the shell client is not exposed.
   frontends/shell/src/streaming/adapterWs.ts grants CREDIT_WINDOW (4) at start and tops up whenever
   outstanding <= CREDIT_WINDOW / 2 after a batch.

4. If O-3 is (1): on the publish test's next failure, file the failing job's log text verbatim before
   re-running it. The last occurrence's text was lost.
