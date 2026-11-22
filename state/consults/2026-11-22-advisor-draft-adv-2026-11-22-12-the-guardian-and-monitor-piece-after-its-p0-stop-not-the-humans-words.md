# The advisor's draft ADV-2026-11-22-12, for the human's approval: the Guardian and Monitor piece after its stop at P0 (the custodian's stop of 2026-11-22); its approval is the human's typed approval naming the live checks it names. Not the human's words and not a ruling: it is reserved to the human under the grant's item 4 (c), so nothing in it is acted on until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-22: PASTES/ADV-2026-11-22-12.md in the advisory folder, 2959 bytes, sha256 47f3dbdf99724d29b81a0cbf22a6cf7b8973f79e951d815aed8da3838e72ba6b, last modified at 2026-11-22T12:48:21Z by the file system; the advisor's message naming it received at 2026-11-22T12:48:36.495Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T12:56:54Z), equal. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-22. The Guardian and Monitor piece after its stop at P0. This changes item 3 (a) of ADV-2026-11-22-02, which I approved today, and adds one conditional call to its live checks. Everything else of it stands.

1. The finding. At 2.1.330 the engine writes no types folder into the mod's copy, after `claude plugin validate` or after `claude plugin test`. So the first of the two sources my item 3 (a) names for a Monitor call's event does not exist at this build. Whether the engine hands a Monitor call to a tool.call handler, and whether the event carries the command, is not shown and not ruled out.

2. The piece goes on without the types.
   (a) P0b as the form has it: the one registration line, then `claude plugin validate tools/mods/spatial-guardian`. Its hook line must name Monitor in the form of the Bash entry, with every other entry unchanged. No Monitor entry, or a warning or error that names Monitor or the filter, stops the piece and it comes back to me.
   (b) The fixtures are built from what is known: the Monitor call's input as the installed version defines it (description, timeout_ms, command, ws), and the event fields the Guardian's handlers already read for a Bash call (the tool's name, the command, the agent's id). That a Monitor event has those fields is assumed, not read. The form, the README and the pull request say so in those words, until the live checks settle it.
   (c) No other `claude` command is run to look for the types.

3. The live checks settle what the types would have shown. They are the two of ADV-2026-11-22-02 item 6, unchanged, and one more call only if the first fails.
   (a) If the Monitor call for the forced dry-run push is refused by Guardian G1 and logged with tool Monitor and the command's sha256, the event carries the command. Nothing more is needed.
   (b) If it is not refused by Guardian G1, or the log line is not as predicted, the custodian makes the same command once through Bash.
     - Refused there by Guardian G1: the Guardian is loaded and does not see a Monitor call's command. The piece is undone by a revert pull request, and the finding comes back to me.
     - Not refused there by the Guardian: the Guardian is not acting. Everything stops at once, nothing else is run, and I am told.
     - If another layer refuses first, the check is inconclusive, as before, and that layer is not loosened.
   (c) No real force-push, merge or clean.

4. My approval of this draft, by its id, is my typed approval naming these live checks: the two of ADV-2026-11-22-02 item 6 and the conditional call of item 3 (b) here.

5. Until the piece is live, nobody runs a push, a merge or a delete through Monitor. That stands.

6. The custodian records the finding of item 1 in the form's amendment headed P0, with the worker's report. If a later build writes the types again, they are read then and compared with what the live checks showed.
