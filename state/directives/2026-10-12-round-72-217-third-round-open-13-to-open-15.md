# PR #217: C-1 (B), a third round (the late-cancel list, OPEN-14, OPEN-15 (B)), one gate, no fourth round without the human; OPEN-13 keep both, OPEN-14 filter, OPEN-15 (B) on the human's terms — the human, verbatim

*Custodian's filing note (2026-10-12): question round 72 on PR #217's C-1 (gate 3's two-bundle gap), answered by selection at 17:05:02Z; then two typed messages, queued at 17:05:07Z and 17:09:28Z by the transcript, which govern. The first names the second, which arrived after the custodian said it had not. Below the rule are the selected option's label and both messages, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. They name no other project. They get one RULED block in `DECISIONS-PENDING.md`.*

---
Question round 72, the answer (selected, 17:05:02Z): (B) Third round (Recommended)

The typed message (17:05:07Z):

Round 72: (B), a third round. It carries three things together, so that the e2e and the gate run once:
1. the late-cancel notice as a list, as the reviewer's fix describes;
2. OPEN-14, the double-click filter;
3. OPEN-15 (B), the tap's pixel.
My answers on OPEN-13 to OPEN-15 and the rest are in my other message. If it has not reached you, tell me. One gate, scoped to these three. No fourth round without me.

The typed message (17:09:28Z):

Milestone 2, OPEN-13 to OPEN-15.

OPEN-13: keep both test files (class 9, their lines class 8). "Nothing else under canvas/" was about product files.

OPEN-14: filter it. A double-click only zooms; it never selects and never inspects. No delay is added to a single click to achieve this. If the two cannot be told apart at the click, tell me instead.

OPEN-15: (B), on these terms.
- The tap's pixel is computed from the tap event's own client coordinates, truncated as the hover's are, less the canvas rect. No hover state and no pointer-down info is read, so section 8 item 3 stands. Section 2.2's rule that the tap takes event.offsetCenter is amended to this.
- Proof: a unit test of the pixel function, with a mutation that rounds; and the E-KINDS point step goes back to the fractional pointer position that failed, and passes.
- The agreement is claimed for WebView2. On macOS and Linux it is checked at shell-real-app-run-macos-linux; add it to that node.
- Why not (C): the two pixels can differ on both axes at once, which a 1 px radius does not cover, and no radius helps when the tap lands in the neighbouring polygon. If the architect finds this reading wrong, tell me before building.
