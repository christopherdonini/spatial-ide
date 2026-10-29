# The human's message of 2026-10-29, its typed text: wait loops sleep and time out; a background shell is killed at its piece's closing record

*Filed verbatim by the custodian from the session transcript (received 2026-10-29T05:25:29.687Z), its text unchanged; nothing in it names another project. The message's typed text, after a paste filed at `state/directives/2026-10-29-governance-f-mapping-table-approved-open-1-to-open-10-ruled.md`. The RULED block in DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
The 31-hour background shell waiting on fsre-d1-w-c-plan_verify_quotes_mjs_.txt is killed: a busy loop with no sleep and an exit test that never fires on this shell. Standing, for every agent's briefs: a wait loop sleeps at least one second per turn and carries a hard timeout that ends it; a background shell left running when its piece closes is killed at the piece's closing record, and the closing checklist says so.
