*Custodian's filing note (2026-09-26): the architect gate's attempt-3 report (scoped confirmation) for PLAN node `governance-test-claims-superseded-followups` at 6b4f7d2, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: PASS with notes.** The PASS holds on the custodian appending the one-line reduction below byte for byte. Its reason is the record cap's point (3): this piece is past its second record-correction round, so I reduce the record rather than open a third round. I read `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups` at 6b4f7d2. I had no Bash, so byte comparisons, diffs, hashes, mutation runs and the 1,088 figure are for the reviewer to confirm.

**1. Amendment 4 matches my reduction.** I compared the form's §10 Amendment 4 (heading, items 1–5, superseded index) line by line with the fenced block in `state/consults/2026-09-26-test-claims-followups-gate2-architect.md`. By eye, every line matches. The reviewer confirms the bytes.

**2. Amendment 5: references only, with a superseded index, one wrong class.**
- These parts are correct:
  - Its first line says it was written post-result, which makes it class 1 under round 15, item 1, clause (g).
  - It carries no prose restatement.
  - R3 is answered by reference to Amendment 4 item 5.
  - The figure's class 2 reason has the form Amendment 4 item 4 set.
  - b82941e is given no class, which matches Amendment 4 item 1: code that applies §2 carries no class.
  - It revives no label Amendment 4 withdrew.
- **Finding F1 (blocks only until the reduction is appended):**
  - Where: `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md`, §10, Amendment 5 item 1.
  - What is wrong: it labels all of 0f865e8 class 3, including S1.
  - Why that is wrong: S1 replaced test 19's recorded mutation (the union mutation) with §4's literal one and recorded a new observed failure. That is template class 4: "a mutation added or corrected after a gate finding" (`docs/PREREGISTRATION-TEMPLATE.md` §10, class 4). It is also the split Amendment 4 item 1 draws: test-comment changes are class 3, mutation changes are class 4. Only R1's changes are class 3.
  - Why it is not sent back for correction: the form is append-only, and a restore is outside round 15, item 1, clause (f). Under record cap (3) the record is reduced instead of corrected. Append this text byte for byte as the next amendment:

```
### Amendment 6 — 2026-09-26 (UTC), written after gate attempt 3's results were seen (`state/gate-log.json`, node governance-test-claims-superseded-followups, attempt 3): Amendment 5 item 1's class reduced (`state/directives/2026-09-18-record-cap.md`, point (3))

1. 0f865e8's change to the RECORDED MUTATION comment above `a_withdrawn_test_row_whose_pin_and_ruling_both_fail_names_both` (reviewer S1) is class 4; its reviewer R1 changes are class 3.

Superseded index: Amendment 5 item 1's class for S1, by item 1.
```

This text is the record's last amendment. No further record round follows on this piece. The form is outside Amendment 1's counted files, so the 1,088 figure does not change.

**3. b82941e and 0f865e8 change nothing else I passed, as read.**
- `computeWithdrawnRows` (verify-test-claims.mjs, around 586–632): the only difference from attempt 2 is the removed `refLine: lineNo`.
- Nothing else in the module reads or writes `refLine`. Lines 267–268 are `markedSpans`' own local variable.
- The rest of the function is as passed: the grammar branch, the pin condition, the unconditional `withdrawnRiders` call, `invalidRowLines`, the message composition and the `mainUnchecked` return.
- The changed comments are the passage above `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt` (the test file's own recorded mutation, the two companion failure texts "as printed at b82941e"), and the comments above test 19 and `a_marker_in_row_position_without_its_colon_is_still_checked` ("[]" then "0 !== 1").
- The reviewer confirms "nothing else" with `git diff 761915c..0f865e8 --stat` (per the brief, 44bf8df between them only appends Amendment 4).

**4. Test 19 now records §4's own mutation.**
- The comment's label "riders are not read when the pin fails" matches §4 item 19 byte for byte; the only difference is the sentence's final period.
- The mutation `grammarAccepted && reason !== undefined ? { ok: true } : withdrawnRiders(root, lineText)` is exactly "pin failed, so riders are not read". It replaces the real line 612.
- The recorded failure is what that change would produce: the message loses its rider suffix.
- It is isolated by construction. Test 5's row is a range, so `grammarAccepted` is false and riders are still read there.
- Test 5's comment is unchanged and still records the union mutation that attempt 2 accepted. The reviewer confirms 54 of 55.

**Notes (not blocking; carry to `test-claims-landedness-bound` with N2–N6):**
- **N7:** the `computeWithdrawnRows` doc (verify-test-claims.mjs:577) says it returns `{ findings, validSpans, invalidRowLines }`, but line 631 also returns `mainUnchecked` (since 7400dac). I missed this at attempt 2. Fix: add `mainUnchecked` to the doc's return shape.
- N2 (mjs:583, 744) and N6 (mjs:836) are still present, as expected, since they were carried forward.

**Gate-log note:**
@ 6b4f7d2 (attempt 3, scoped): Amendment 4 appended as the architect's reduction (bytes: reviewer); b82941e removes only the unread validSpans.refLine (N1/R2); 0f865e8's comments re-observed at b82941e, test 19 now records §4's own "riders are not read when the pin fails" mutation, isolated by construction; Amendment 5 references only with superseded index, but class 3 for S1 is class 4 (template §10 class 4; Amendment 4 item 1), reduced by the architect under record cap (3) to Amendment 6 (byte-exact text in the report), which the custodian appends and the piece lands; N7 (mjs:577 return doc omits mainUnchecked) carried with N2-N6 to test-claims-landedness-bound; no red line.

Files:
- `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\scripts\plan\TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md`
- `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\scripts\plan\verify-test-claims.mjs`
- `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\scripts\plan\verify-test-claims.test.mjs`
- `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\docs\PREREGISTRATION-TEMPLATE.md`
- `C:\dev\spatial-ide\state\directives\2026-09-18-record-cap.md`
- `C:\dev\spatial-ide\state\consults\2026-09-26-test-claims-followups-gate2-architect.md`
