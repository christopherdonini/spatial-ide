# The review-packet consult: A's supplement and C's results (the custodian, 2026-11-06)

*The custodian's record, for the human's sight. It answers the human's message of 2026-11-06 (`state/directives/2026-11-06-u12-e2e-on-5400-u1-size-accepted-tier-folder-node-review-packet-decisions.md`), item 3, decisions 1 and 3 to 6, against sections A and C of `state/consults/2026-11-06-review-packet-design-part-2-architect.md`. Every figure is computed by script. Nothing here decides a dependency; that stays the human's typed word.*

## A. The share on the ruled basis

**Window and records.** As in the filed re-run (`state/consults/2026-11-05-governance-e-reading-2-re-run-part-2-table-tester-report.md`):
- the window is 2026-11-02T00:00:00Z to 2026-11-05T00:00:00Z, and only records of version 2.1.312 or later count;
- 12,497 records fall in the window and 11,298 are counted, the same as the re-run;
- 1,107 transcript files were read (the re-run read 1,070); the in-window counts equal the re-run's.

**Self-check.** On the re-run's inline basis the script reproduces the re-run's figures:
- 6,755,704 tool-result bytes;
- code-area Read, Grep and Glob: 1,108,138;
- whole-repository searches: 59,376;
- Bash searches: 1,157,916;
- lower bound 16.4%, upper 34.4%.

**The ruled basis:**
- Decision 3: a result persisted to a side file is counted at the side file's size.
- Decision 4: worktree checkouts are the repository; clones and exports in scratch are outside. The re-run already classed them this way.

Five in-window results were persisted to side files: one in the main session, one in a reviewer, three in workers, all of them Bash results. Their inline previews were 10,718 bytes; their side files are 549,355 bytes. Every side file is present, and each one's size equals its record's.

| population | all tool-result bytes | code-area Read, Grep, Glob | whole-repository searches | Bash searches |
|---|---|---|---|---|
| main | 2,745,554 | 0 | 833 | 753,099 |
| architect | 1,958,456 | 767,820 | 58,543 | 0 |
| reviewer | 955,795 | 66,881 | 0 | 208,524 |
| worker | 984,495 | 25,918 | 0 | 543,790 |
| worker-high | 354,241 | 129,322 | 0 | 54,480 |
| lead-data | 295,800 | 118,197 | 0 | 0 |
| total | 7,294,341 | 1,108,138 | 59,376 | 1,559,893 |

The other agent types have no in-window results.

**The share:**
- The lower bound is 1,108,138 / 7,294,341 = **15.2%**.
- The upper bound adds the whole-repository and Bash searches: 2,727,407 / 7,294,341 = **37.4%**.

**Against decision 1** (15% on the lower bound): this is a lower-bound crossing by 0.2 points. The crossing is narrow:
- 93,246 more bytes in the denominator alone would bring the lower bound to 15%;
- so would 13,987 fewer code-area bytes.

**Gaps:**
- (a) The 1,199 in-window records with no version hold no tool result, so leaving them out drops no tool-result bytes.
- (b) As in the re-run, a call counted in the window whose result record falls outside the window, or carries no version, has its bytes left uncounted. This is not measured.

**The run:**
- Script: `a-supplement.mjs`, sha256 de797fb2f5b99ac9d70bbc0256cab0da6c829be198b6d8ddce387ce918997822. It was written fresh from the re-run's method lines and read this project's transcript folder only.
- It ran inside a shared hold, granted and released (cores 0-7). It exited 0.
- Output: sha256 7ce54ea594c1598534034aca8c29db4e3f5c2585fc5791cfc54060ad9c731c4d, written 2026-11-06T08:33:33Z.
- The script and its output stay in the custodian's scratch, not filed.

## C. The three trial packets against C's criteria

**The three packets** are those the ledger records as 1, 2 and 3 of 3:
- PR #281 gate 1: 6,068 bytes, sha256 71870b7a01fe8ef9e6f64623194f4bf9bc4cb3d1499fdf50478a75a3c1b3ac08;
- PR #282 gate 1: 14,629 bytes, sha256 16c8c10ea954a2b08900f1d7e6b7fb65bdc72328712c8306804adb5080ea5d89;
- PR #283 gate 1: 59,674 bytes, sha256 b1c0a899ed309d5349c5c9942aed9f81d7a183ab9e9e36b3eaf4e76c5529c2fd.

**How the bytes were split by source.** These three were built before the tags existed. The custodian tagged them after the fact, line by line, under section B.a:
- S: a script derives it (git, gh, and the form and rulings as records);
- H: the hand-back supplies it (its evidence and disclosures, and what the change means for behaviour, rule c5);
- G: no record holds it (the custodian's dispositions and findings at assembly);
- T: fixed template (headings, the assembly note, fixed lines, blank lines).

A line holding a disclosure and its disposition is split at ` Disposition:`: the part before is H and the rest is G. The line map:

| packet | T | S | H | split | G |
|---|---|---|---|---|---|
| #281 | 1, 3, 5, 20, 27, 33, 48, 50, 57 | 7-18, 22-25, 29, 31, 41-47, 56 | 30, 35-40 | 53-55 | 52 |
| #282 | 1, 3, 5, 18, 26, 153, 170, 179 | 7-16, 20-22, 24, 28, 30-151 (the diff), 161-167 | 23, 29, 155-160 | 173-175 | 168, 172, 176-178 |
| #283 | 1, 3, 5, 13, 19, 134, 149, 157 | 7-11, 15, 17, 21-132 (the diff), 139-146 | 16, 136-138, 154-156 | 152-153 | 147, 151 |

Blank lines are T. The script is `c-split.mjs`, sha256 8db27c78353c01e14c62434b40f98ef5c8858510ed8e332a37356622359a56c5. It checks each packet's sha256, and it checks that the four parts sum to the packet's size.

| packet | bytes | S | H | G | T | S share | H and G share |
|---|---|---|---|---|---|---|---|
| #281 | 6,068 | 3,490 | 1,384 | 362 | 832 | 57.5% | 28.8% |
| #282 | 14,629 | 9,275 | 2,200 | 2,311 | 843 | 63.4% | 30.8% |
| #283 | 59,674 | 56,116 | 2,175 | 623 | 760 | 94.0% | 4.7% |

**In the ruled shape** (decision 7), the inline diff becomes a locator of about 120 bytes:
- #282: 8,966 bytes, S 40.3%, H and G 50.3%;
- #283: 6,232 bytes, S 42.9%, H and G 44.9%;
- #281 had no inline diff.

For context only, the two later packets were built in the ruled shape and tagged by their builders at assembly; neither is one of the three:
- #285: 8,524 bytes, S 65.8%, H and G 24.6%;
- #286: 8,121 bytes, S 66.5%, H and G 24.0%.

**Assembly time,** from the main session's transcript:
- Start: the last user record before the assistant record that holds the builder's first Write, which is when composing began.
- End: the packet file's last write.

| packet | start | end | minutes | builder bytes |
|---|---|---|---|---|
| #281 | 2026-11-05T16:59:37Z | 17:00:58Z | 1.4 | 14,214 |
| #282 | 2026-11-05T17:35:26Z | 17:37:30Z | 2.1 | 22,584 |
| #283 | 2026-11-06T00:07:55Z | 00:09:04Z | 1.1 | 7,753 |

The median is 1.4 minutes. The window leaves out the reads before composing (the hand-back and the form), which item 4 has the custodian make in any case. Each builder was written fresh for its own packet, into the main session. The script is `c-assembly-window.mjs`, sha256 759cf6e759fe0813a468906f9dc8e941aac2a6c4253c6d0f9fedfa84108b0d8f.

**The criteria (decision 6, C's as written):**
- (i) At least 60% S in 2 of 3. **Holds as built** (#282, #283), only through the inline diff. **Does not hold in the ruled shape** (57.5%, 40.3%, 42.9%).
- (ii) Median assembly time of 15 minutes or more. **Does not hold** (1.4).
- (iii) A gap that rule c1, c2 or c6 prevents, in 2 of 3. **Holds, 3 of 3:**
  - Each packet lists CI taken mid-run, which is c2: #281 line 45 (`running`), #282 line 165 (`running`), #283 lines 141-144 (`queued`, `in_progress`).
  - The hand-backs of #281 and #282 were uncommitted inputs at assembly, which is c1. #281's report was committed at bef34834 (17:21:40Z), after its packet (17:00:58Z). #282's report was committed at c5168cde (17:56:35Z), after its packet (17:37:30Z).
- (iv) H and G over 50% in 2 of 3. **Does not hold** as built (28.8%, 30.8%, 4.7%). In the ruled shape it holds in 1 of 3 (#282, 50.3%).
- (v) Median assembly time under 5 minutes. **Holds** (1.4).
- (vi) Every gap semantic. **Does not hold:** the c1 and c2 gaps are mechanical.

## For the human

- **A.** On the ruled basis, the lower bound crosses the 15% threshold by 0.2 points (15.2%; 16.4% on the inline basis). The upper bound is 37.4%. A tool would be a dependency, which needs your typed word.
- **C, as built.** (i) and (iii) hold, which is a justify pair, and (v) holds, which is a do-not-justify item. C does not say which list wins when both hold, so this is yours.
- **C, in the ruled shape** (the packets a script would build). (i) fails and (v) holds: do not justify.
- **One fact C does not count.** The builders, 7,753 to 22,584 bytes each, were written into the main session for each packet.
