# Milestone 2's OPEN-11 (A) with its terms; piece f's OPEN-1 to OPEN-3; two proposed nodes; the ported-notices required check — the human, verbatim

*Custodian's filing note (2026-10-11): typed by the human, received at 18:02:04Z by the transcript. Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
1. Milestone 2, OPEN-11: (A). A third exception under canvas/ is allowed: WorkingCanvas gains one report-only prop, onViewShown(bbox). Terms:
   - It is called in exactly two places: where the camera is fitted without a report (the auto-fit), and at a change of size that asks for nothing because no area was last asked for.
   - App's handler writes the counts' box and nothing else. It issues no query, does not write lastViewportBboxRef or the canvas's last-asked area, and dispatches no workspace transition.
   - A test proves that a call issues no query, with a mutation that routes the call into onViewportChanged's handler.
   - Item 39, the Export panel's Current view and every existing callback stay as they are.
   - Nothing else under canvas/ beyond section 2.7's list, Amendment 2 and this.
   Your notice on the tool prop: I read it as you do, part of the cursor change I ruled.
   Your information item on the Export panel's Current view: propose a node. Say in it whether the default export scope after an Apply or Clear carries the box from before the map fitted itself, whether that holds at the v0.1.0 tag, and what the approval dialog shows of the box. I grade and place it when I have read that.

2. Piece f (stale-test-names-and-comments):
   OPEN-1: yes. Both places take piece d's qualified sentence as their model, with no change of ADR-006 class. It is a second exception to the test-files rule, and its row waits for piece e's merge.
   OPEN-2: yes, the list names all three callers.
   OPEN-3: yes to (a), (b) and (c). Comments only.
   Items 4 and 5 of your questions: propose one node for the four lines outside the lane and one for the missing remount test. Both stay proposed.

3. ported-notices: I add it to main's required checks myself and tell you when it is done. If an open PR then shows the check as expected but never reported, merge main into its branch so that it runs.
