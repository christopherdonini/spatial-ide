Reviewed: the form text a-form-r5-text.txt in the scratch folder, 47224 bytes, sha256 0a0e88f58da84541380100ad4f845daa4fae7d74e1a4acadf0cba8a2aac7db58 (r4 with attempt 1's 17 pairs applied by script), read only. This is the custodian's filing note, 2026-11-26: the reviewer's form gate, attempt 2, node:a-second-save-is-announced@form-gate-reviewer-2, under ADV-2026-11-26-17 item 2. The narrow re-read that closes attempt 1, by the same agent resumed by a message sent before 2026-11-26T21:35:52Z. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 6 tool uses, 114878 ms, 200828 tokens; model opus. It handed back once, before 2026-11-26T21:38:41Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The scratch folder's full path is written below as `<scratch folder>` (3 places); nothing else is changed, so the filed report is not byte-identical to the saved one (6408 bytes, sha256 c39b1b7f). Verdict as written: BLOCK on r5 (Evidence N1, the hours' two digits untested), with the stated condition that once its four pairs (N1 to N3) are applied the gate closes PASS WITH NOTES and no further read is needed; C1 and E1 to E4 close. The custodian applied the four pairs by script, giving r6, 47807 bytes, sha256 4e313bc4, the report's own figure byte for byte; so the gate is recorded closed, PASS WITH NOTES, on r6, the form as filed. Gate-log row 919.

---

**Verdict: BLOCK, with one Evidence finding (N1).** My own E1 pair introduced it, and two exact pairs below close it. Once they are applied the form gate closes PASS WITH NOTES, and no further read is needed. Reviewed text: `a-form-r5-text.txt`, 47224 bytes, sha256 0a0e88f58da84541380100ad4f845daa4fae7d74e1a4acadf0cba8a2aac7db58 (I recomputed it). Code read in detached D:/wt/read-1126c @ 7dbf2f3e635db418d4a6cc0c24a66970939eff59; forms and docs in detached D:/wt/read-1124f @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08. The form is not on a branch.

## Is r4 to r5 exactly my 17 pairs?
Yes. I checked it with a script file, `nr-check-r5.cjs` in the scratch folder. It writes no literal backslash: it builds one with `String.fromCharCode(92)`.
- The saved report is 16907 bytes, sha256 60411d375579f2ec3233af3b06eb864f4bf0c6f55412463b26c5fd8785b77f94 (recomputed). It holds 34 ```text blocks, which make 17 pairs.
- Applied to r4 in order, each Old text occurs once at its turn, and the result equals r5 byte for byte.
- r4 has 0 backslashes and r5 has 3. With those 3 removed, r5 is 47221 bytes, sha256 8f863be805646721c1a5412019970029c5c490ee463f9e3e554ab9aab99f147b. That is the figure my first check printed.
- The custodian's diagnosis is confirmed: my first script lost the backslashes. My first draft of the new script lost one the same way, even inside a quoted heredoc, and failed with a syntax error. r5 line 188 holds the pattern `^\d{2}:\d{2}:\d{2}$` as intended.

## Do the findings close?
- **C1 closes.** E-A1's three checks at r5 lines 201-204 are all present from commit T, and nothing in E-A1 applies at P only. Line 205 says its text is the same at T and at P, so it agrees with §9a Runs (line 350), §8 item 12 and ADV-2026-11-26-24 item 2's fourth condition. The red at T is still the first two checks (lines 206, 237 and 349). The pattern check now sits in step 1's checks at lines 131 and 134, which change at P as existing tests. Line 131's wait needs that change anyway, or P ends VOID. §6 (line 270) matches.
  - Note, no pair needed: step 1's change at P must keep the names E-A1 reads, such as step 1's reading `afterSave`. Otherwise E-A1's text would change, which §8 item 12 catches on sight.
- **E1 closes, but its claim is too wide (N1).** SP-T1's field assertion fails under M-A6 (hour 23 taken modulo 12 is 11). The pattern and field check involve no literal string. But with both clocks at 23:04:0x, nothing tests the hours' two digits: an implementation that pads the minutes and seconds but not the hours passes. Line 188's "proves ... the two digits" is therefore untrue for the hours.
- **E2 closes.** The picker case at line 208 reaches `saveProject.ts` line 108 through `failureOf(error).message`. Under M-A7 the kernel-message lines keep their time, so SP-T2's differs assertion passes and the picker case fails.
- **E3 closes.** The kept half now runs first (line 184). A-A1's prediction at T is reduced to the assertion it reaches first (line 196), and M-A3 still shows that A-A1's differs assertion can fail. H0 and §5 still agree.
- **E4 holds on figures, with a note (N3).** The table sums to 255 over the same 7 files, and the Size line says 280. No other 250 or 241 remains in r5. §8 item 1's file set is unchanged.
  - ADV-2026-11-26-25 item 10's condition names "the author's count with (ii)". The 255 includes the gate's additions, so the pair's "as item 10 provides" is a reading of the ruling and should be named as one (N3).
- **M-A6 and M-A7 are within §4's rule.** Each new test still has at least one mutation, and CV-K1 already carries two (M-A1, M-A2). Each added mutation fails at an assertion it can reach, as set out under E1 and E2.
- **No other applied pair adds a defect.** I read C2 and D1 to D5 in place: each reads correctly and matches the code.

## Evidence (blocking until applied)
**N1. The hours' two digits are untested.** The fix reduces SP-T1's claim and builds SP-T2's clocks at hour 9. Both are pairs on r5; neither contains a backslash.
Old:
```text
That proves the 24-hour clock and the two digits with no literal clock string (§8 item 9).
```
New:
```text
That proves the 24-hour clock, and the two digits of the minutes and the seconds, with no literal clock string (§8 item 9); SP-T2 proves the hours' two digits.
```
Old:
```text
answer first lines that differ. That assertion is red at T.
```
New:
```text
answer first lines that differ. That assertion is red at T. Its two clocks are built from local components, `new Date(2026, 10, 26, 9, 4, 5)` and the second after it, and at P its check of the time's form is SP-T1's pattern and field assertion, which proves the hours' two digits.
```

## Documentation (must fix before the commit)
**N2.** §6's list of instruments leaves out the unit tests' pattern and field check.
Old:
```text
and a pattern match on the time's form in C-E2's step 1 at P.
```
New:
```text
a pattern match on the time's form in C-E2's step 1 at P, and in SP-T1 and SP-T2 the same pattern with the time's fields compared to the set clock's local getters.
```
**N3.** Name the reading of item 10, and tell the advisor about the 280.
Old:
```text
so the ceiling is restated before the form is committed, as item 10 provides.
```
New:
```text
so the ceiling is restated before the form is committed. Item 10 names the author's count with (ii); this form reads it as the estimates the form now carries, the gate's two additions included, and the custodian tells the advisor of the restated 280 before the commit.
```

## Applying the pairs
- I checked all four pairs with a second script file, `nr-pairs-r5.cjs` in the scratch folder. Each Old occurs once in r5, and they apply in order with no overlap.
- Applied in that order, they give 47807 bytes, sha256 4e313bc4c9b42cb01105308b5bfaae9f795766fcc89649c085cc76d95431febb.
- None of the four is the human's wording, and none changes an advisor string.
- The new SP-T2 clock adds about one line to `saveProject.test.ts`, which stays well inside 280.

Files:
- <scratch folder>/a-form-r5-text.txt
- <scratch folder>/nr-check-r5.cjs
- <scratch folder>/nr-pairs-r5.cjs
