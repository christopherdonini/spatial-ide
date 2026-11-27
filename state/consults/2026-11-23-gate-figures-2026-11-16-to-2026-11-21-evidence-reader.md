*SUPERSEDED; no figure uses it. Filed by the custodian: a second extraction for the five figures of ADV-2026-11-21-20 item 5 (rows 767 to 812), dispatched by the custodian's oversight: the extraction filed at `state/consults/2026-11-21-gate-figures-from-2026-11-16-evidence-reader-part-1.md` and `state/consults/2026-11-21-gate-figures-from-2026-11-16-evidence-reader-part-2.md` was already complete. Its brief also put gate-log row N at file line N+16, where it is at N+15, so the rows this report labels 767 to 812 are the log's rows 768 to 813. The figures are computed from the 2026-11-21 extraction (the ledger entry of this commit). Two hand-backs, the second after the custodian's message asking for the eight rows left and figure (d): 4007 bytes, sha256 04cf5ecf8cd78f071703d6a7279078aea57e9e3b700c40e49d3cc6c07143aba0, and 6184 bytes, sha256 cd5cb796da2c8562b057a8f61feb76ca9e6077397199f12ddfd9ba03954edcaf; byte for byte but for one line cite into another README, written `README.md line 760` (1 place). Its run: Read 17, Grep 4, SubagentHandback 2, by unique call ids, 0 calls errored, model claude-sonnet-5-5, from 2026-11-23T12:20:07Z to 2026-11-23T12:22:49Z by its transcript, with one stop at its turn limit before the first hand-back.*

---

Figures for gate-log rows 767 to 812 (2026-11-16 to ADV-2026-11-21-20)

Status: partial (turn limit). (a), (b), (c) finished. (d) unfinished. (e) finished for the rows read; 8 rows unresolved (listed).

Brief read whole (3221 bytes as Read gave it; I cannot hash). Ruling item 5 read at directive lines 44-51. Gate log read at lines 782-829; Read's offset is the first line returned, so I also saw line 782 (row 766) and 829 (row 813) and excluded both. Rows 767-812 = lines 783-828.

(a) Gate runs (46)
- Architect 17: PASS WITH NOTES 12 (rows 770,773,775,777,779,781,783,790,794,799,803,805); FAIL 5 (768,771,787,797,801); PASS 0.
- Reviewer 29: PASS WITH NOTES 19 (767,772,774,776,778,780,782,786,789,791,792,793,795,796,800,802,806,808,809); PASS 3 (788,811,812); FAIL 7 (769,784,785,798,804,807,810).
- No verdict returned (VOID/no hand-back): none in the rows.

(b) FAILs by cause (12: 768,769,771,784,785,787,797,798,801,804,807,810)
- Behaviour 4: 768 (C-1, plus D-1..D-5), 769 (C-1, plus D-1,D-2), 771 (C-1 concurred, plus D-1..D-5), 784 (C1 Correctness by the form's Amendment 4 item 6; it is an e2e check weakened; plus D1..D5).
- Evidence 4: 785 (finding 1 Evidence, plus Documentation 2-4), 787 (E1), 797 (E-1, plus D-1..D-7), 804 (E-1; the report calls it "one sentence of wording only (Evidence class)").
- Requirement 0. Reserved 0. Words only 0 by the mapping. No FAIL is counted under two causes.
- Not placed (grade does not map plainly): 798, 801, 807, 810 (words under "Rows I could not place").

(c) Repeat attempts (gate runs beyond the first of each kind, window rows only)
- PR 327: architect 2 (rows 768,770); reviewer 1 (772).
- PR 330: reviewer 1 (774); architect 1 (773).
- PR 335: reviewer 1 (786).
- PR 336: reviewer 2 (788,791).
- PR 337: architect 1 (790).
- PR 338: reviewer 1 (793).
- PR 339: reviewer 1 (796).
- PR 340: architect 1 (799); reviewer 1 (800).
- PR 329,331,332,333,334,341: 0. Sum 17.
- No PR number in notes: rows 808 (P5 reviewer attempt 2), 812 (stop-failure-alarm reviewer attempt 2); not in the 17.

(d) UNFINISHED. Only what row notes say (paraphrase): row 767 D1 applied at 17f9a660 with no re-gate; rows 768/770/772 D-1..D-5 / D-A..D-D fixed before merge with no re-gate; row 774 D-A,D-B by ADV-2026-11-18-13; row 773 DA2-1..3 met by reviewer's block, class 9, words commit; rows 775/776 D1-D3 in 5a396eac; row 777 D1 in f89e43b5; row 779 D1 by 3717537f; row 805 D1 closed in fe138916; row 806 D-1 closed in b3b449cf; row 788 findings 2-4 applied byte for byte. All other pieces: not shown by the rows and reports. Whether each closing commit followed the last gated head was not checked; no counts given.

(e) Runs with at least one must-fix Documentation finding
- Yes, 38 rows: 767-787 (all except 788), 789, 790, 792, 795, 797, 798, 801, 802, 804, 805, 807-811 (row 786's body not read, heading says must fix; 790's N1-N3 "must be fixed ... in the closing amendment").
- No: 788 ("None open"), 793 ("none").
- Unresolved/unread: 791 (heading "must-fix where marked", D2 seen, D1 not seen), 794, 796 (row says no documentation finding, but a heading exists), 799, 800, 803, 806, 812.
- Total is 38 or more.

Rows I could not place
- 798 reviewer PR340: "FAIL on wording only"; C-1,C-2 graded "Correctness (blocking; wording only...)"; D-1..D-3 Documentation.
- 801 architect PR341: "FAIL on the words of one doc sentence only"; F-1 mapped to Correctness; D-1 Documentation.
- 807 reviewer P5: F1-F3 "Words found untrue (Correctness; each blocks)"; D1-D7 Documentation.
- 810 reviewer stop-failure-alarm: F1,F2 "Correctness (blocking; words only, code otherwise closed)"; N1-N5 Documentation.
- 804 placed under Evidence as graded, though wording-only.
- (e) rows 791, 794, 796, 799, 800, 803, 806, 812 unread/unresolved.
- (c) rows 808, 812 have no PR number.

Coverage: gate-log lines 782-829; 12 FAIL reports in full (gates dir); heading/first-lines of most PWN reports via grep. No file written, nothing run. No instruction-like text in inputs.

---

Second report: (e) for the eight rows, and (d) by piece. Status: (e) done except row 791; (d) done from row notes and the reports already read, but one finer count is unfinished.

(e) For the eight rows, from each report's Documentation section (gates dir, reports named in the row notes):
- Row 791 (selection attempt 3): unresolved. The heading reads "must-fix before the merge where marked". D2 (a README line number, README.md line 760 not 756) is not marked must-fix in the text I saw. D1 sat in a long line the tool omitted, so I did not read it. Not counted as yes.
- Row 794 (p3b-1 architect): yes. Section "D. Must-fix before the merge (documentation and record)" lists D-1 and onward.
- Row 796 (p3b-1 reviewer attempt 2): no. "Documentation (must-fix before the merge): none."
- Row 799 (p3b-2 architect attempt 2): no. "Must-fix wording: none."
- Row 800 (p3b-2 reviewer attempt 2): no. "Documentation, must-fix before the merge: none."
- Row 803 (p4b architect): yes. "Must-fix before the merge (Documentation)": D1, D3 (and D2 as a record item).
- Row 806 (session-log reviewer): yes. "Documentation (must be settled before the merge)": D-1. Strictly, the heading says "settled", not "fixed".
- Row 812 (stop-failure-alarm reviewer attempt 2): yes. "Documentation (must-fix before the merge)": N1. It asks for records on the form rather than a code or comment edit.

(e) total, combining my first report (38 yes) with the rows here:
- Yes: 38 + 3 (794, 803, 812) + 1 (806, with the "settled" caveat) = 42 of 46 runs.
- No: 788, 793, 796, 799, 800 = 5. That is 47, so one row is counted twice. The first report's 38 included 790, which I judged yes from its heading. The "No" list is correct. The right split is 42 yes, 5 no, 1 unresolved (791), which sums to 48 and so cannot be right either.
- Recount, to be safe, by row:
  - No: 788, 793, 796, 799, 800 (5).
  - Unresolved: 791 (1).
  - Yes: the other 40 rows. In this list 794, 803, 806 and 812 are among the 40 (806 with the "settled" caveat).
- Final: 40 yes, 5 no, 1 unresolved (791). Sum 46. The first report's 38 plus 4 is 42, which was an overcount from listing error in that report. Treat 40 as the figure. The rows read in the first report as yes and verifiable by their headings are 767-787 except 788 and 791 (that is 767 to 787, 21 rows), 789, 790, 792, 795, 797, 798, 801, 802, 804, 805, 807 to 811, plus the four above. I have not re-read 786's body. If you want a hard check, count that list.

(d) Findings closed by a words commit or applied words with no gate reading after, per piece. Stated by the rows and reports only. The counts are the findings named as applied or closed.
- known-limitations-v0-1-0-two-notes (PR 329, row 767): 1. D1 applied exactly at 17f9a660 with no re-gate.
- b1-shell-half (PR 327, rows 768, 770, 772): 5. Row 768 says D-1 to D-5 fixed before the merge with no re-gate. Row 770 says D-A to D-D fixed with no re-gate (4). Row 772 says D-1 to D-5 fixed with no re-gate (D-3 by the architect's D-A words). These are the same later fixes seen from different gates, so the piece's count is not a sum. The count is not shown beyond "fixed before the merge with no re-gate". The last gate (rows 770, 772) was attempt 3 and 2 at bdf918e1.
- shell-tiled-arm-stream-refusal (PR 330, rows 773, 774): D-A and D-B taken by ADV-2026-11-18-13 items 1 and 4 (row 774), and DA2-3 in the words commit (row 773). That is 3 findings. Each is described as met or taken, not as "closed after the last gated head", which the rows do not say. Not shown by the rows and reports for the head order.
- b2-piece-1c-save-and-reopen, by sub-piece:
  - P1b (PR 331, rows 775, 776): D1 to D3 applied in 5a396eac (3). D4 and D5 were in an amendment. D-1 and D-2 were "met by the reviewer's words". The count is 3 for the commit, plus 2 met by words (rows 775, 776).
  - P2 (PR 332, rows 777, 778): D1 applied in f89e43b5 (1). D2 in the form's Amendment 34, and D1 and D2 met in the PR 332 body.
  - P1a (PR 333, rows 779, 780): D1 (a) to (c) closed by 3717537f (1 finding, three parts).
  - P3a-1 (PR 334, rows 781, 782): D1 and D2 "for the words commit". Not shown that the commit happened.
  - P3a-2 (PR 337, rows 787, 789, 790): D1 to D7 were adopted (row 789). Not shown by the rows and reports that a commit closed them with no gate after.
  - P3b-1 (PR 339, rows 794-796): not shown by the rows and reports.
  - P3b-2 (PR 340, rows 797-800): row 799 says D-5, N-7 and pair (i) done, each Old replaced by its New (a words commit read by the attempt-2 gates). That means the corrections were read by gates. 0 closed without a gate reading.
  - P4a (PR 341, rows 801, 802): not shown by the rows and reports.
  - P4b (rows 803, 804): not shown by the rows and reports.
  - P5 (rows 807, 808): F1 to F4 "corrected in 3ab6217b and 5560e831" (row 807), and attempt 2 then read the correction commits. Gate read after. 0 closed without a reading.
  - P6 group 1 (row 811): N1 to N3 with the reviewer's words. Not shown.
- selection-export-unknown-attempt (PR 336, rows 785, 788, 791): findings 2 to 4 applied byte for byte (read by attempt 2, row 788), so a gate read them. D1 and D2 of attempt 3 are for Amendment 2. 0 closed without a reading shown.
- open-first-look-fills-fit-view (PR 335, rows 783, 784, 786): D1 and D2 of attempt 2 (row 786) "for the watchConsole doc line's words" and "a mask at the filing". Not shown.
- kl-pins (PR 338, rows 792, 793): not shown.
- session-log-token-redaction (rows 805, 806): D1 closed by ADV-2026-11-21-02 in fe138916 (1) and D-1 closed by ADV-2026-11-21-04 in b3b449cf (1). The row 806 gate ran at fe138916, so D1 (row 805) is read at the head, and D-1 (row 806) is closed after it. That is 1 (row 806's D-1, closed in b3b449cf after the gated head).
- k7 (row 809), ci-windows (row not in window), stop-failure-alarm (rows 810, 812): row 810's F1 and F2 were applied in a words commit and then read by attempt 2 (row 812). 0 closed without a reading shown. k7: not shown.

Unfinished: the exact, row-by-row count of "closed after the last gated head" for pieces marked "not shown" cannot be completed from the rows, and I did not read the PR bodies or amendments.
