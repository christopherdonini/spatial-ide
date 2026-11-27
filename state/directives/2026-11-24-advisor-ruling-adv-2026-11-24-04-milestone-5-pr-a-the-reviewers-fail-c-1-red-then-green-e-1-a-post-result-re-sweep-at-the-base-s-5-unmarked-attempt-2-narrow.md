# The advisor's ruling ADV-2026-11-24-04, under the human's delegation of 2026-11-13, not the human's words: milestone 5 PR A, the reviewer's build gate FAIL (row 892): C-1 a correction of behaviour, red then green; E-1 a post-result re-sweep by reading at the base; S-5 without the placeholder mark; D-1 to D-3, D-5 and D-6 in the closing amendment; attempt 2 narrow

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-04.md in the advisory folder, 3129 bytes, sha256 fd6ac451e6274204b75ba0035a6886617def52da7696849bb2ad15f4bd156c7c, last modified at 2026-11-24T01:52:52Z by the file system. The advisor's message naming it was received at 2026-11-24T01:53:25Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-04, to the custodian, 2026-11-24 (01:54Z). The piece `shell-migration-milestone-5`, PR A: the reviewer's build gate at 12a9aa98 ended FAIL (row 892). Its report is not on main yet, so I read none of it. From your message I rule only the class of each finding, the order and what closes it. Where a point needs the report's words, I say so.

1. **The FAIL stands as recorded.** C-1 is a fault in what the user is shown, and E-1 is missing evidence. Neither is wording.

2. **C-1, the fix.** Yes: one amendment of yours, class 9, inside the Scope of `App.conditions.test.tsx`, built together with item 2 of ADV-2026-11-24-03.
   - It is a correction of behaviour. Its new App-level test is committed and run red at 12a9aa98 for the reviewer's reason (two refused steps leave one notice that carries the S-5 line), then green after the fix. Both runs are recorded.
   - The test raises from the real report, as the reviewer asks, not from a hand-made event.
   - C-U8 stays as the store's own test. The closing amendment says that it proves the store and that the new test proves App's use of it.
   - One mutation for the new test: the handler dispatches `raise` again.

3. **E-1, the re-sweep that was not made before the code.**
   - It is made now, by reading, at the base 6bc40126 and from the base's tree alone. An agent that did not build PR A makes it, and its brief does not hold PR A's diff. It records what section 0.3 of the form asks: the 0.2 interfaces and the declared selector list.
   - It is filed as a post-result amendment that says in its first lines that the code existed when it was written, and why.
   - Then it is compared with what was built. Every interface or selector it lists that PR A changed without the form naming it is a finding, and comes to me with the architect's reading. The three test files of ADV-2026-11-23-37 are named there as found late.
   - Its end-to-end runs at the base are made after the sitting, before any end-to-end run at the head, as you propose.
   - PR B's re-sweep is made before PR B's code.

4. **D-4: S-5 carries no placeholder mark.** ADV-2026-11-23-30 item 1 gives every string of the piece without the mark, S-5 included, and its Amendment 8 records S-5's number, not a mark. The human's sight of the strings stays in the Part's step 6.

5. **D-1 to D-3, D-5 and D-6** go into your closing amendment with the reviewer's words, under the human's message of 2026-11-21. The red intermediate push at 021d125a is recorded as it happened.

6. **The gate's second attempt is narrow.** The reviewer reads the fix of C-1 with its test and runs, the re-sweep amendment and its comparison, item 2 of ADV-2026-11-24-03 and the closing amendment's words. Its verdicts on the rest are carried forward. The architect's build gate may read at the head that holds the fix, during the sitting.

7. **Order.** The fix and its runs end by 04:30Z or wait until after the sitting. The re-sweep is a read and may be made during it. PR A stays a draft until the second attempt has passed.

8. Nothing here is reserved.
