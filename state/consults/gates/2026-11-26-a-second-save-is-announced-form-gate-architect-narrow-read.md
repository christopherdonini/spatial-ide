Reviewed: the form text a-form-r2-text.txt in the scratch folder, 40779 bytes, sha256 38e472a34fe58d0e5bba12b16c04765622440050d9b78bccf45866c2fceba540 (the draft with attempt 1's 24 pairs applied by script), read only. This is the custodian's filing note, 2026-11-26: the architect's form gate, attempt 2, node:a-second-save-is-announced@form-gate-architect-2, under ADV-2026-11-26-17 item 2. The narrow read that closes attempt 1, by the same agent resumed by a message sent before 2026-11-26T21:08:10Z. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 1 tool use, 51104 ms, 209753 tokens; model opus. Its one call can be one read of r2; the report says its check is by reading, not a byte diff. It handed back once, before 2026-11-26T21:10:27Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The scratch folder's full path is written below as `<scratch folder>` (2 places); nothing else is changed, so the filed report is not byte-identical to the saved one (4200 bytes, sha256 21d43556). Verdict: PASS WITH NOTES, one Documentation pair, applied by script, giving r3 (40784 bytes, sha256 3f3eeb8b); gate-log row 914.

---

**Verdict: PASS WITH NOTES. The form gate closes, with one Documentation fix to make before the commit.** Reviewed: `a-form-r2-text.txt` sha256 38e472a34fe58d0e5bba12b16c04765622440050d9b78bccf45866c2fceba540. That is your hash; I have no Bash and did not recompute it. It was made from `a-form-text.txt` sha256 27ef3e0513ec42dbbb6d0e306272559117c5e843d1385d1645bfdf2fe21228ff. The code reading still stands at 7dbf2f3e635db418d4a6cc0c24a66970939eff59 (D:/wt/read-1126c), and the forms and docs at main @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08 (D:/wt/read-1124f).

**Does the applied diff equal the pairs?** Yes, as far as reading can show. I read r2 at each of the 24 places, and each New text is there in full, in place of its Old. Everything else I read in r2 matches r1. I have no tool to diff the bytes, so this is reading, not a byte diff.

| Pair | r2 line | Applied as written |
|---|---|---|
| P1a | 200 | yes |
| P1b | 202 | yes |
| P2a | 393 | yes |
| P2b | 221 | yes |
| P2c | 254 | yes |
| P3 | 415 | yes |
| P4 | 216 | yes |
| P6 | 385 | yes |
| P5 | 102 | yes |
| D1a | 38 | yes |
| D1b | 343 | yes |
| D2 | 213 | yes |
| D3a | 388 | yes |
| D3b | 390 | yes |
| D4a | 299 | yes |
| D4b | 307 | yes |
| D5 | 417 | yes |
| D6a | 366 | yes |
| D6b | 364 | yes |
| D6c | 365 | yes |
| D7 | 238 | yes |
| D8 | 104-105 | yes |
| D9 | 350 | yes |
| D10 | 74 | yes |

**Is each finding closed?**
- **B1 is closed.** E-A1's wait after the save throws no `Void`, its red at T is a FAIL, and step 1 is not changed at T.
- **B2 is closed.** (ii) is open only with (a) or (c), or with a restated (b); `App.save.test.tsx` line 213 is on §4's list; I3's search is widened.
- **B3 is closed.** Under OPEN-A4 (ii), CV-K1's kept half raises the save-notice route twice, so M-A2 can fail it.
- **B4 is closed.** Under (c), M-A3 is two mutations, each predicted to fail at a template assertion.
- **B6 is closed.** The time is no longer claimed to be late "by up to one round trip", and §1 line 111 is consistent with the new words.
- **P5 is closed.** §1 claims only the strip, and says Problems rows are neither changed nor tested.
- **D1 to D10 are all closed.** Your check of ADV-2026-11-24-19 items 2 and 5 confirms D1's reading.

**Did any applied text break a neighbour?** One break, which my own pair P1a caused, at line 200. "Step 1 is not changed at T." now sits between the clock wait and "That is a harness bound on readiness, not a timing." So "That" now points at the wrong sentence. This is a Documentation finding, to fix before the commit. It is not the human's wording and changes nothing the code does, so it is applied with no re-gate and listed in the PR body. The Old text was byte-copied from my Read of r2 line 200 and occurs once there:

Old:
```
which follows step 1's. Step 1 is not changed at T. That is a harness bound on readiness, not a timing.
```
New:
```
which follows step 1's. That wait is a harness bound on readiness, not a timing. Step 1 is not changed at T.
```

Nothing else broke:
- **Cross-references hold.** OPEN-A6 (a) now has its record under OPEN-A5 for every candidate. §5's predictions match §4 and §9 ("red at E-A1 only"). The new text at §4 line 216 (P4) qualifies the differs-assertion sentence before it rather than contradicting it. P4's extra A-A1 template assertion at P is covered by line 178's "template-equality assertions" at P.
- **The tables hold.** Every Overlap row still has two cells. The README row correctly keeps B's piece, which touches only the `project.mjs` entry.
- **§7's figures add up.** OPEN-A2 (b) alone gives 250 + 40 = 290 lines over 8 files, which matches line 297. (c) with (ii) is about 256 lines against a ceiling of 330. Under (ii), the one changed line in `App.save.test.tsx` is in a file already counted and fits inside the 40-line margin. The file counts are unchanged.

The OPEN-A items stay with the advisor. I reviewed none of them again.

Files:
- <scratch folder>/a-form-r2-text.txt
- <scratch folder>/a-form-text.txt
