# a-second-save-is-announced: the architect's pairs carrying ADV-2026-11-26-25 into the form's round 3, giving round 4 (not a gate)

*Filed by the custodian: node:a-second-save-is-announced@form-round-4-pairs. The architect of the form gate (gate-log rows 913 and 914), resumed after its narrow read, was sent ADV-2026-11-26-25 before 2026-11-26T21:12:27Z (date -u) and asked for Old/New pairs that carry it into round 3 (sha256 3f3eeb8b). It handed back before 2026-11-26T21:19:44Z: 74 numbered pairs, 87 Old/New. The custodian applied them by script, each Old found once, giving round 4 (44909 bytes, sha256 122eae6f), which the reviewer's form gate read fresh. Its run figures were not recorded at its hand-back, and no transcript was opened (ADV-2026-11-26-02). The report below is the hand-back as written through the Write tool with the harness's two-space indent removed (26452 bytes, sha256 579ad28b). The scratch folder's path is masked as `<scratch folder>` (3 places); nothing else is changed. Under ADV-2026-11-18-02 item 2 (b), an architect does not draft text that only declares what is ruled; this was put to it all the same, and the custodian reports that in the daily batch.*

---

Here are 74 old/new pairs that carry ADV-2026-11-26-25 into `a-form-r3-text.txt` (sha256 3f3eeb8b4106c1705d5565c7059099064e347af67db6c12bd922d5743415afba). The hashes for r3, adv-26-25.md (42d60457…) and adv-26-24.md (3d6d996a…) are the ones in your message; I have no Bash and did not recompute them.

- **Uniqueness:** I checked by Grep on r3 that each Old occurs exactly once. No Old overlaps another, so the pairs can go in this order.
- **No strings reproduced:** item 1's four lines and item 3's seven spans are carried by reference only (pair 21), not copied in.
- **Item 10, the ceiling:** my count with (ii) comes to about 241 lines over 7 files, under 250, so the ceiling stands and is not restated (pairs 51 to 55).
- **Item 6's finding:** pair 74 records it in a new §9c. Adding it to milestone 5's second part in `governance/PLAN.yaml` is outside r3 and is yours to do.

1. Authority list gains -25 and -24 (rulings list).
```text
- ADV-2026-11-26-19, items 2 to 5 and 7 (what may run, and when).
```
```text
- ADV-2026-11-26-19, items 2 to 5 and 7 (what may run, and when).
- ADV-2026-11-26-25, items 1 to 12 (OPEN-A1 to OPEN-A8 ruled, the runs, the ceiling, the strings and the merge check), and ADV-2026-11-26-24 items 2 and 5, which its item 9 applies to A.
```
2. Item 2.
```text
As drafted it does not; under OPEN-A2 (b) it does.
```
```text
It does not (ADV-2026-11-26-25 item 2), so PR 366 does not join.
```
3. Item 2.
```text
- Into main, in its turn, after PR A and PR 365, and after PR 366 when PR 366 has joined (ADV-2026-11-26-08 item 3).
```
```text
- Into main, in its turn, after PR A and PR 365 (ADV-2026-11-26-08 item 3). PR 366 does not join (ADV-2026-11-26-25 item 2).
```
4. Item 6.
```text
lines 887-895). See OPEN-A6.
```
```text
lines 887-895). See OPEN-A6 and §9c.
```
5. Item 1, §1 claim with its bounds.
```text
- the line OPEN-A1 rules differs from the last save's line in the fact OPEN-A1 rules, under the bound that OPEN-A1 states;
```
```text
- each save's first line (S3, S4, S23 or S7) ends with the time of day at which the shell had that save's outcome, by the machine's local clock, as `HH:MM:SS` on the 24-hour clock (ADV-2026-11-26-25 item 1); two saves whose clock readings are less than a day apart and fall in different seconds therefore show different first lines. The bounds, accepted by item 1: two saves whose outcomes fall in one clock second show the same text, in new elements; a clock set back can show an earlier time; the time is when the shell had the outcome, not when the file was written;
```
6. Item 2.
```text
- no S-5 line and no occurrence count for a save;
- under OPEN-A2 (b) only, that the Save project control shows the advisor's busy words while a save is in flight, as far as A-S1 tests it.
```
```text
- no S-5 line and no occurrence count for a save.
```
7. Item 3 (no Narrator).
```text
At most an operator row under OPEN-A3 observes it;
```
```text
AD1 does not ask for it to be observed (ADV-2026-11-26-25 item 3);
```
8. Item 6.
```text
holds the top (OPEN-A6);
```
```text
holds the top (ADV-2026-11-26-25 item 6; §9c);
```
9. Item 1.
```text
A time of day under OPEN-A1 (a) or (c) is the machine clock's reading, not a duration;
```
```text
The time of day on a save's first line is the machine clock's reading, not a duration;
```
10. Item 1's bound.
```text
It is when the shell handled the kernel's confirmation (OPEN-A1 (a), the bound);
```
```text
It is when the shell had that save's outcome (ADV-2026-11-26-25 item 1);
```
11. Item 2.
```text
Under OPEN-A2 (a), none to `App.tsx` either.
```
```text
None to `App.tsx` either (ADV-2026-11-26-25 item 2).
```
12. Item 1.
```text
- Every shown string is the advisor's, at its OPEN item (§2.5).
```
```text
- Every shown string is the advisor's: ADV-2026-11-26-25 item 1's four lines (§2.5).
```
13. Item 4.
```text
- Under OPEN-A4 (i) this reaches every route.
```
```text
- This reaches every route (ADV-2026-11-26-25 item 4).
```
14. Item 1.
```text
as OPEN-A1 rules.
```
```text
as ADV-2026-11-26-25 item 1 rules: the time, on the first line of every save's batch.
```
15. Item 1, where the clock is read and the form it takes.
```text
- Under (a), the machine's local clock is read once, after `deps.save` resolves (line 113), and the saved line carries that time.
```
```text
- The machine's local clock is read once per save, when the saver has that save's outcome: at the no-view return (line 101), at the picker's failure (line 108), after `deps.save` resolves (line 113), and in its catch (line 123). It is formatted from `Date`'s local getters as `HH:MM:SS`, two digits each, on the 24-hour clock, with no locale form. The batch's first line (S3, S4, S23 or S7) is item 1's line for it, with that time; no other string of the saver changes. A cancelled picker (line 110) still answers no lines.
```
16. Item 1 ((b) not taken).
```text
- Under (b), the saver keeps a count of confirmed saves per dataset beside `saved` (line 93), and raises it on a confirmed save. `adopt` (lines 130-132) sets no count.
```
```text
- No count of saves is kept: (b) and (c) are not taken (item 1).
```
17. Item 1 (the fixed words the driver reads by name).
```text
- The fixed words are exported by name, so that tests and the driver read them
```
```text
- The fixed words stay in the existing exports (`SAVED_NOTICE`, `notSavedNotice`, `NO_VIEW_NOTICE` and `FOLDER_HOLDS_PROJECT_NOTICE`), and the time's form is one exported function that the saver calls, so that tests and the driver read the fixed words by name
```
18. Item 1.
```text
Under (a), tests set the clock
```
```text
Tests set the clock
```
19. Items 1 and 5 (the bounds go in the saver's doc comment).
```text
- The doc comment at lines 15-16 names the ruling that gives the new words.
```
```text
- The doc comment at lines 15-16 names ADV-2026-11-26-25 item 1 as the source of the four first lines and states item 1's bounds in the worker's words: two saves whose outcomes fall in one clock second show the same text, in new elements; a clock set back can show an earlier time; the time is when the shell had the outcome, not when the file was written. It claims nothing beyond them (§8 item 7).
```
20. Item 2.
```text
- (a) Out: nothing changes.
- (b) In: App holds a saving state around `projectSaver.save` (`App.tsx` lines 2241-2248), and the Save project control (lines 2289-2293) shows it in the advisor's words.
```
```text
- Out (ADV-2026-11-26-25 item 2): a click while a save is in flight still changes nothing, and `App.tsx` is not changed.
```
21. Items 1, 3, 11 and 12 (strings by reference).
```text
**2.5 Strings.** None is drafted here. The advisor's:
- the saved line (OPEN-A1);
- under OPEN-A1 (ii), the other first lines;
- under OPEN-A2 (b), the control's busy form;
- AD1's words (OPEN-A3), which are a walkthrough row, not a shown string.

No code of a string lands in words the advisor has not ruled. If code starts before a ruling is filed, the string carries the `[P6 placeholder]` mark until it is.
```
```text
**2.5 Strings.** None is drafted here, and none is reproduced: each is the advisor's, carried by reference.
- S3, S4, S23 and S7 are the four first lines of ADV-2026-11-26-25 item 1, byte for byte, with `{time}` and `{message}` filled as that item says. No other string of the saver changes.
- The walkthrough's seven spans are item 3's Old and New texts, byte for byte: four in AD1, one in AE2 and two in AF3a. They are walkthrough words, not shown strings.

No string carries the `[P6 placeholder]` mark (item 11). The merge check compares item 1's four lines and item 3's seven New texts with the diff byte for byte (item 12).
```
22. Item 1, Portability.
```text
- Under OPEN-A1 (a) or (c), the time comes from
```
```text
- The time comes from
```
23. Item 1 (no locale form).
```text
  - a fixed 24-hour form taken from `Date`'s local getters reads the same on every OS, but a locale form (`toLocaleTimeString`) follows the OS's settings (OPEN-A1's sub-question).
```
```text
  - the form is fixed, `HH:MM:SS` on the 24-hour clock from `Date`'s local getters, so it reads the same on every OS; no locale form is used (ADV-2026-11-26-25 item 1). The value follows the machine's time zone and clock.
```
24. Item 1 ((b) not taken).
```text
- Under (b), nothing is OS-dependent.
```
```text
- Nothing else is OS-dependent.
```
25. Item 1.
```text
at its set clock (a) or its count (b).
```
```text
at its set clock.
```
26. Item 1.
```text
  - Under (a) it sets the clock to two different seconds.
```
```text
  - It sets the clock to two different seconds.
```
27. Item 1.
```text
  - Under (a), the step first waits
```
```text
  - The step first waits
```
28. Item 1 (E-A1 at P matches by pattern, §8 item 9).
```text
    - at P only, its text is the ruled saved line.
```
```text
    - at P only, its text begins with `SAVED_NOTICE`'s words, read by name, and ends with a time in brackets in item 1's `HH:MM:SS` form, matched by pattern and never by a literal time (§8 item 9).
```
29. Item 2.
```text
- **A-S1**, under OPEN-A2 (b) only (`App.save.test.tsx`): a save held in flight by a deferred mock shows the control's state, and the state ends when the save ends.
```
```text
- **A-S1** is not added (ADV-2026-11-26-25 item 2).
```
30. Item 1's (ii).
```text
- **SP-T2**, under OPEN-A1 (ii) only (`saveProject.test.ts`): two refused saves with the same kernel message answer first lines that differ.
```
```text
- **SP-T2** (`saveProject.test.ts`; ADV-2026-11-26-25 item 1's (ii)): two refused saves with the same kernel message, at two set seconds, answer first lines that differ. That assertion is red at T. At P it also asserts each line against `notSavedNotice` and the time's form at its set clock.
```
31. Item 7.
```text
It fails E-A1 too, in one run at the head under OPEN-A7 (a); under OPEN-A7 (b) it is unit-only for E-A1.
```
```text
It is unit-only for E-A1 (ADV-2026-11-26-25 item 7): E-A1's red at T is the proof that its check can fail.
```
32. Item 1.
```text
- **M-A3:** under (a), the clock is read once when the saver is created; under (b), the count is never raised.
```
```text
- **M-A3:** the clock is read once when the saver is created.
```
33. Item 1 ((c) not taken).
```text
whose red at T already shows that check failing. Under OPEN-A1 (c), M-A3 is two mutations, each applied alone (the clock one, then the count one). The other fact still differs under each, so neither can fail a differs assertion: each is predicted to fail SP-T1 at its template assertion, and A-A1 also asserts its second line against the template at its set clock and count, at P, so that each fails A-A1 there.
```
```text
whose red at T already shows that check failing.
```
34. Item 2.
```text
- **M-A4:** under OPEN-A2 (b), the saving state is never set. Fails A-S1.
```
```text
- **M-A4:** not used (A-S1 is not added).
```
35. Item 1's (ii).
```text
- **M-A5:** under OPEN-A1 (ii), the not-saved line carries no fact. Fails SP-T2.
```
```text
- **M-A5:** the not-saved line with the kernel's message (S4) carries no time. Fails SP-T2 at its differs assertion.
```
36. Item 1.
```text
at its set clock or count.
```
```text
at its set clock.
```
37. Item 1's (ii).
```text
Under (ii), lines 132 and 138 too, and
```
```text
Lines 132 (S4) and 138 (S7) too, and
```
38. Item 1.
```text
Its two saves keep one set clock under (a), so its equality still holds. Under (b) line 511 takes count 2.
```
```text
Its two saves keep one set clock, so its equality still holds.
```
39. Item 1's (ii).
```text
- CV-K1's new-element half, SP-T1, A-A1 and E-A1 are red at T and green at P.
```
```text
- CV-K1's new-element half, SP-T1, SP-T2, A-A1 and E-A1 are red at T and green at P.
```
40. Items 2 and 9 (the red commit).
```text
- Under OPEN-A2 (b), A-S1 is red at T, by asserting that the control's text while the save is held is not its idle label, and green at P. Under OPEN-A1 (ii), SP-T2 is red at T at its differs assertion and green at P.
```
```text
- E-A1's run at commit T, the red commit, ends red at E-A1's not-connected and differs checks, and every other C-E2 check passes (ADV-2026-11-26-25 item 9).
```
41. Item 2.
```text
- the in-flight drop, under OPEN-A2 (a);
```
```text
- the in-flight drop (ADV-2026-11-26-25 item 2), and `App.tsx`;
```
42. Item 1's (ii).
```text
(under OPEN-A1 (ii), also for
```
```text
(and also for
```
43. Item 1.
```text
- **I7:** OPEN-A1's ruled words
```
```text
- **I7:** item 1's four lines
```
44. Item 1.
```text
- **I8:** under (a), E-A1's wait
```
```text
- **I8:** E-A1's wait
```
45. Item 9, under ADV-2026-11-26-24 items 2 and 5.
```text
- no build, test or launch of this piece before the e2e runs may (ADV-2026-11-26-19 items 2, 3 and 5; §9a);
```
```text
- no app start of this piece before the port is free and the tester's start is filed; A's code and its vitest runs go ahead inside holds, in A's turn (ADV-2026-11-26-25 item 9; §9a);
- if E-A1's run at T ends green, or red for another reason, the piece stops and goes to the advisor, and the code written by then is not taken further until the advisor rules (ADV-2026-11-26-24 item 2, applied by ADV-2026-11-26-25 item 9);
```
46. Item 1.
```text
at a set clock or count.
```
```text
at a set clock, and a pattern match on the time's form in E-A1.
```
47. Item 7.
```text
- The declared runs are T and P, plus M-A1 under OPEN-A7 (a).
```
```text
- The declared runs are T and P; there is no M-A1 run (ADV-2026-11-26-25 item 7).
```
48. Item 1.
```text
Under (a), E-A1's wait uses the suite's own
```
```text
E-A1's wait for the next second uses the suite's own
```
49. Items 1, 2, 4 and 10.
```text
**Size**, under OPEN-A1 (a) with (i), OPEN-A2 (a) and OPEN-A4 (i):
```
```text
**Size**, for the ruled combination, OPEN-A1 (a) with (ii), OPEN-A2 (a) and OPEN-A4 (i) (ADV-2026-11-26-25 items 1, 2, 4 and 10):
```
50. Item 10 (the count with (ii); the doc comment's bounds included).
```text
`frontends/shell/src/project/saveProject.ts` | about 16 |
```
```text
`frontends/shell/src/project/saveProject.ts` | about 28 |
```
51. Item 10 (SP-T2, and lines 132 and 138).
```text
`frontends/shell/src/project/saveProject.test.ts` | about 47 |
```
```text
`frontends/shell/src/project/saveProject.test.ts` | about 63 |
```
52. Item 10 (line 213).
```text
`frontends/shell/src/App.save.test.tsx` | about 6 |
```
```text
`frontends/shell/src/App.save.test.tsx` | about 8 |
```
53. Item 10 (6+35+28+63+48+8+53).
```text
**about 211**
```
```text
**about 241**
```
54. Items 1, 2, 4 and 10 (options not taken; the ceiling stands).
```text
**The other branches:**
- OPEN-A1: (b) about 10 fewer lines (no fake clock and no wait); (c) about 20 more; (ii) about 25 more, in `saveProject.ts` and its test.
- OPEN-A2 (b): `frontends/shell/src/App.tsx` about 14 lines and `App.save.test.tsx` about 30 more. That makes about 255 over 8 files, so the ceiling becomes 290 over 8 files, and PR 366 joins.
- OPEN-A4 (ii): about 2 more.
- Any other ruled combination: the ceiling is 250 lines over 7 files, plus 40 lines for each of OPEN-A1 (c) and OPEN-A1 (ii) ruled, plus 40 lines and one file for OPEN-A2 (b). These figures are fixed now and are not edited after the ruling.
```
```text
**The other branches** (OPEN-A1 (b), (c) and (i), OPEN-A2 (b) and OPEN-A4 (ii)) are not taken (ADV-2026-11-26-25 items 1, 2 and 4), and their figures are withdrawn before the form is committed. The table above is the ruled combination's: with (ii) it comes to about 241 lines over 7 files, under the 250, so item 10's ceiling stands and is not restated.
```
55. Item 3.
```text
AD1 (line 2030), and the AE2 and AF3a spans under OPEN-A3.
```
```text
item 3's seven spans, four in AD1 (line 2030), one in AE2 (line 2060) and two in AF3a (line 2086).
```
56. Item 5.
```text
- `KNOWN-LIMITATIONS.md`, only if OPEN-A5 takes an item;
```
```text
- no `KNOWN-LIMITATIONS.md` item (ADV-2026-11-26-25 item 5);
```
57. Item 2.
```text
over the seven paths (eight under OPEN-A2 (b)), read
```
```text
over the seven paths, read
```
58. Item 8.
```text
(OPEN-A2 (b) or OPEN-A8)
```
```text
(ADV-2026-11-26-25 item 8)
```
59. Item 2.
```text
4. `App.tsx` changed under OPEN-A2 (a), or changed before PR 366's head is merged in by a merge commit.
```
```text
4. Any change to `App.tsx` (ADV-2026-11-26-25 item 2).
```
60. Items 1, 3 and 11.
```text
5. A shown string in words the advisor has not ruled, or without the placeholder mark before the ruling.
```
```text
5. A first line, or a walkthrough span, that differs by a byte from ADV-2026-11-26-25 item 1's four lines or item 3's seven New texts; another saver string changed; or a `[P6 placeholder]` mark on any of them (items 1, 3 and 11).
```
61. Item 9, with ADV-2026-11-26-24 item 2.
```text
12. Any run of this piece before the e2e runs may (§9a).
```
```text
12. An app start of this piece before the port is free and the tester's start is filed; code before PR A's reviewer has passed its second attempt; or a change to E-A1's text after commit T not recorded by its class (§9a).
```
62. Item 12.
```text
each ruled string against the code clause by clause, and the observed mutations.
```
```text
item 1's four lines and item 3's seven New texts against the diff byte for byte (ADV-2026-11-26-25 item 12), and the observed mutations.
```
63. Items 7 and 9.
```text
  - `node e2e/conditions.mjs` at T (red at E-A1 only) and at P (green), plus one M-A1 run under OPEN-A7 (a);
```
```text
  - `node e2e/conditions.mjs` at T, the red commit (red at E-A1 only), and at P (green), once the port is free (ADV-2026-11-26-25 items 7 and 9);
```
64. Item 3.
```text
AD1 in the advisor's words (OPEN-A3)
```
```text
AD1 as ADV-2026-11-26-25 item 3 changes it
```
65. Item 2.
```text
- PR 366's head joins by a merge commit only if the piece changes `App.tsx`, which happens only under OPEN-A2 (b). The merge-in then gets its narrow read before any `App.tsx` code.
```
```text
- PR 366's head does not join: the piece does not change `App.tsx` (ADV-2026-11-26-25 item 2).
```
66. Item 8.
```text
- A head that moves before the runs: OPEN-A8.
```
```text
- A head of PR A or PR 365 that moves before A's runs is merged in by a merge commit, with a narrow read, and recorded by amendment (ADV-2026-11-26-25 item 8).
```
67. Item 9, under ADV-2026-11-26-24 items 2 and 5 (the red commit and the runs).
```text
**Runs** (ADV-2026-11-26-19):
- Nothing of this piece builds, tests or launches until the human has closed their app, the port is seen free by reading, and the tester's one start in the sitting's checkout is filed (items 2, 3 and 5).
- Then A's runs follow in the ruled build order (ADV-2026-11-26-08 item 4). Item 3's list of what may run beside the human's app does not name A.
- A is not complete, and its pull request leaves no draft, before its e2e runs are made (item 3).
```
```text
**Runs** (ADV-2026-11-26-25 item 9, under ADV-2026-11-26-24 items 2 and 5, with ADV-2026-11-26-19):
- Commit T is the red commit: the first commit with code after the base, holding the new tests and nothing of the fix (§4). Product code starts in commit P.
- Once PR A's reviewer has passed its second attempt, A's code and its vitest runs go ahead inside holds, in A's turn in the ruled build order (ADV-2026-11-26-08 item 4), though the port is still held.
- No app start of this piece comes before the human has closed their app, the port is seen free by reading, and the tester's one start in the sitting's checkout is filed (ADV-2026-11-26-19 items 2 and 5). E-A1's run at commit T is made then, as soon as the port is free.
- That run must end red for E-A1's own reason: its not-connected and differs checks fail, and every other C-E2 check passes. If it ends green, or red for another reason, the piece stops and goes to the advisor, and the code written by then is not taken further until the advisor rules.
- E-A1's text does not change after commit T. If it must, the change is recorded by its class, and the T run is made on the changed text.
- The P run follows. The pull request does not leave draft before the T run and the P run are filed, and A is not complete before then (ADV-2026-11-26-24 item 2; ADV-2026-11-26-19 item 3).
```
68. Item 5.
```text
| `KNOWN-LIMITATIONS.md` (only under OPEN-A5's item) | PRs 358, 363, 365 and 366, PR A, and the identity route and text-id (item 3). By its round-1 draft, B's piece touches neither this file nor the walkthrough. A new item number is taken at the build's re-read. |
```
```text
| `KNOWN-LIMITATIONS.md` | Not touched: no item (ADV-2026-11-26-25 item 5). By its round-1 draft, B's piece touches neither this file nor the walkthrough. |
```
69. Item 2.
```text
| `src/App.tsx` (only under OPEN-A2 (b)) | PR A and PR 365 (in the base), PR 366 (joins), and the identity route (its class-9 Scope addition, the `<AdmissionPanel>` element, two lines above the Save control). |
```
```text
| `src/App.tsx` | Not touched (ADV-2026-11-26-25 item 2). |
```
70. Items 1 to 8 (§9b marked as ruled).
```text
## §9b. OPEN items (to the advisor in one message; the form's gates do not wait)
```
```text
## §9b. OPEN items, ruled by ADV-2026-11-26-25 items 1 to 8 (each entry keeps the draft put to the advisor; its ruling line binds, and an option not taken binds nothing)
```
71. Item 1.
```text
**OPEN-A1: what differs from the last save's line.** Every candidate keeps §2.1's new elements.
```
```text
**OPEN-A1: what differs from the last save's line.** **Ruled (ADV-2026-11-26-25 item 1):** (a) with (ii), the time as `HH:MM:SS` on the 24-hour clock, no locale form; (b), (c) and (i) are not taken. Every candidate keeps §2.1's new elements.
```
72. Items 1 and 5.
```text
  - **Sub-questions:** a fixed 24-hour form or the locale's form; and where the bound is recorded (OPEN-A5).
```
```text
  - **Sub-questions,** answered: `HH:MM:SS` on the 24-hour clock, no locale form (item 1); the bounds are recorded in §1 and the saver's doc comment (items 1 and 5).
```
73. §9b entries marked one by one (items 1 to 8). Each is its own Old/New, applied in this order.
    - Item 1, (b):
      ```text
      - **(b) A count of this open's confirmed saves.**
      ```
      ```text
      - **(b) A count of this open's confirmed saves.** Not taken (item 1).
      ```
    - Item 1, (c):
      ```text
      **(c) Both (a) and (b).**
      ```
      ```text
      **(c) Both (a) and (b).** Not taken (item 1).
      ```
    - Item 1, (i):
      ```text
        - (i) the saved line only.
      ```
      ```text
        - (i) the saved line only. Not taken (item 1).
      ```
    - Item 1, (ii):
      ```text
        - (ii) the first line of every save's batch:
      ```
      ```text
        - (ii), taken with (a) (item 1): the first line of every save's batch:
      ```
    - Item 2:
      ```text
      **OPEN-A2: the control while a save runs.**
      ```
      ```text
      **OPEN-A2: the control while a save runs.** **Ruled (ADV-2026-11-26-25 item 2):** (a), out; (b) is not taken, and PR 366 does not join.
      ```
    - Item 3:
      ```text
      (ADV-2026-11-26-08 item 3: the advisor's, at the form's gates).
      ```
      ```text
      (ADV-2026-11-26-08 item 3: the advisor's, at the form's gates). **Ruled (ADV-2026-11-26-25 item 3):** seven spans, four in AD1, one in AE2 and two in AF3a, each Old and New text as item 3 gives it; AD1 does not ask for Narrator; no Result log line is edited.
      ```
    - Item 3, cost:
      ```text
      - **Cost:** none in code; one row, and up to two spans.
      ```
      ```text
      - **Cost:** none in code; three rows, seven spans (item 3).
      ```
    - Item 4:
      ```text
      **OPEN-A4: the key's reach.**
      ```
      ```text
      **OPEN-A4: the key's reach.** **Ruled (ADV-2026-11-26-25 item 4):** (i); (ii) is not taken.
      ```
    - Item 5:
      ```text
      **OPEN-A5: the record of the bound**
      ```
      ```text
      **OPEN-A5: the record of the bound** (**ruled, ADV-2026-11-26-25 item 5:** neither; no KNOWN-LIMITATIONS item and no words in AD1 beyond item 3's; item 1's bounds are recorded in §1 and the saver's doc comment)
      ```
    - Item 6:
      ```text
      **OPEN-A6: a save under an older condition** (§0.1, Order).
      ```
      ```text
      **OPEN-A6: a save under an older condition** (§0.1, Order). **Ruled (ADV-2026-11-26-25 item 6):** (a), out; recorded as a finding for milestone 5's second part (§9c).
      ```
    - Item 6, where it is recorded:
      ```text
      It is recorded where OPEN-A5 says.
      ```
      ```text
      It is recorded in §9c.
      ```
    - Item 6, (b):
      ```text
      - (b) In. That changes the ruled order
      ```
      ```text
      - (b) In. Not taken (item 6). That changes the ruled order
      ```
    - Item 7:
      ```text
      **OPEN-A7: M-A1's observation on E-A1.**
      ```
      ```text
      **OPEN-A7: M-A1's observation on E-A1.** **Ruled (ADV-2026-11-26-25 item 7):** (b).
      ```
    - Item 8:
      ```text
      **OPEN-A8: a head that moves before A's runs.** Proposed,
      ```
      ```text
      **OPEN-A8: a head that moves before A's runs.** **Ruled as proposed (ADV-2026-11-26-25 item 8),** for PR A and PR 365; PR 366 does not join (item 2). Proposed,
      ```
74. Item 6 (the finding recorded for milestone 5's second part, in paraphrase).
```text
## §10. Amendments (opens empty, append-only)
```
```text
## §9c. A finding for milestone 5's second part (ADV-2026-11-26-25 item 6; paraphrase)

Ordinary use reaches a state this piece leaves: while an older notice holds the strip's top, a save's line shows only in Problems, with no alert role (§0.1, Order). When milestone 5's second part's form comes, two questions go with it to the advisor: whether a newer notice of the same urgency should take the strip's top, and whether that part's KNOWN-LIMITATIONS words cover a save's line under an older notice. This piece changes neither the order nor `conditions.ts`.

## §10. Amendments (opens empty, append-only)
```

Files:
- <scratch folder>/a-form-r3-text.txt
- <scratch folder>/adv-26-25.md
- <scratch folder>/adv-26-24.md
