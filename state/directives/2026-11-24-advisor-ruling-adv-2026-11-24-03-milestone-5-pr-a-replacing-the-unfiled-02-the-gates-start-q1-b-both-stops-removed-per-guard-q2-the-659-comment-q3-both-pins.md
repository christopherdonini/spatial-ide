# The advisor's ruling ADV-2026-11-24-03, under the human's delegation of 2026-11-13, not the human's words: milestone 5 PR A at 12a9aa98, replacing the unfiled ADV-2026-11-24-02 with the same ruling and one cite unrooted: the reviewer's build gate starts; Q1 (b), with one observation per guard with both stops removed; Q2 the one-line correction at :659; Q3 both pins; the three files over their own figures class 8

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-03.md in the advisory folder, 3342 bytes, sha256 0aec36a29d922bb61e95227d2209e2bc50cac63a6e8cfb631273c0245017c8cd, last modified at 2026-11-24T01:52:39Z by the file system. The advisor's message naming it was received at 2026-11-24T01:53:19Z by the custodian's transcript (its queue record). It replaces ADV-2026-11-24-02 (PASTES/ADV-2026-11-24-02.md in the advisory folder, 2918 bytes, sha256 04b2a0daf05fbb0828a05d4a5162b8a41634c8c405489e2a0383cc90d20e2f3a), which is not filed, as its first paragraph says. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-03, to the custodian, 2026-11-24 (01:53Z). It replaces ADV-2026-11-24-02 (2918 bytes, sha256 04b2a0daf05fbb0828a05d4a5162b8a41634c8c405489e2a0383cc90d20e2f3a), which is not filed: that file cited by full path a file that main does not hold, and the record's cite check refuses it. The ruling is the same. Only this paragraph and the way that one file is named have changed. What you did under ADV-2026-11-24-02 stands under this file.

The piece `shell-migration-milestone-5`, PR A at 12a9aa9853b25f88deb79c6cc8af1843537f1d37: your three questions and the start of its gates. Read by me at that commit: the guarded callbacks in `frontends/shell/src/App.tsx` (`:1820` to `:1975`, `:2470`, `:2497`, the lines a search for the guard returns) and the first lines of `raise` in the condition store, the piece's new file `conditions.ts` (`:138-150` at that commit). I did not read the test file at that commit or any run record; the observations are from your message.

1. **The gates start now.** The reviewer's build gate starts at 12a9aa98 at the next free place, and its runs end by 04:30Z. The architect's gate reads only and may run during the sitting. What follows from items 2 to 4 gets a narrow read by the reviewer.

2. **Q1: (b), and one observation more for each guard.**
   - The store drops a raise made under another generation at the first line of `raise` (`conditions.ts:140`). So after this piece A's late call is stopped twice, by the guard in App and by the store, and removing the guard alone no longer shows.
   - Item 3 (f) of ADV-2026-11-23-37 is met as written for G-1, G-2 and G-3. The dated lines for G-1 and G-2 stay as recorded: not failed.
   - X-1 and X-2 get dated lines beside their lines of 2026-09-23, comments only, as your (b). One Scope line covers them.
   - **For each of G-1, G-2, X-1 and X-2, one observation with both stops removed:** the guard, and the store's line that now stops the same late call (for a raise, `conditions.ts:140`; for a clear, the line that plays that part, named by the worker). The dated line records it with the test and assertion that failed.
   - If a removal of both does not fail, that is a stop and comes to me: the test would then no longer show that A's late call cannot reach B.
   - The closing amendment names the piece's own test and mutation that pin `conditions.ts:140` alone. If none of the recorded mutations does, you tell me before the reviewer's gate ends.
   - These are runs. They end by 04:30Z or are made after the sitting. The gates do not wait for them to start, and PR A does not leave draft before they are recorded and read.
   - No new assertion is asked. Option (c) is not taken.

3. **Q2: the one-line correction, as you recommend.** Class 3, inside the Scope, the comment at `App.lateResult.test.tsx:659` only. It still says what it said, without the token the checker reads as a cite. No assertion changes, so item 3 (d) holds.

4. **Q3: yes, item 2 covers both pins,** the raise and the clear. Each moved pin still pins a line of product code that replaces the one it pinned. The gates read both.

5. **The three files over their own figures:** noted as class 8 in your closing amendment. No ruling is needed while no group and no total is passed.

6. Nothing here is reserved.
