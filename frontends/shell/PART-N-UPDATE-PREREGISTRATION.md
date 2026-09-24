# Part N walkthrough update -- five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline.

```
Authority: round 16, item 1 (DECISIONS-PENDING.md RULED 2026-09-18); the describe-fields landing, PR #93 (frontends/shell/DESCRIBE-FIELDS-PREREGISTRATION.md); AUTONOMY.md §21d
Scope: frontends/shell/MANUAL-WALKTHROUGH.md only; declared line budget <= 40 non-generated (insertions + deletions)
Change: Part N's preamble pin sentence is re-read and re-pinned at the current origin/main commit, N1 gains the CRS provenance row's expected reading, and N3 gains the Session identity row's expected reading, all three describing the two rows PR #93 shipped
Tests+mutation: no test -- a walkthrough script; the checks are verify-cites and the reviewer's byte comparison of every quoted on-screen string against its source
Out-of-scope: no code, no wire, no ADR, no security, no guarantee; the operator-facing label wording (`CRS provenance`, `Session identity`) is the human's at the sitting (template §10 class 7) and is not changed or judged here
```

Budget: 24 of 40 lines across 1 file (git diff --numstat origin/main...HEAD, the form excluded).

Correction round 1 (reviewer attempt 1, state/gate-log.json record 102): N2's and N6's pointers corrected (template §10 class 3); the two row labels added to N3's judgement clause (class 7, a sight-list addition); the preamble's third file and its known-gap sentence removed; budget after this round: 25 of 40 lines across 1 file (git diff --numstat origin/main...HEAD, the form excluded); commit 9d8c52b.

Superseded (round 12 clause (e)): the Budget line above, 24 of 40, by the correction-round line, 25 of 40. Landing after reviewer attempt 2 PASS (state/gate-log.json record 103): the should-fix S1 phrase and nits 1 and 2 applied on lines already in the diff, budget unchanged at 25 of 40 (git diff --numstat origin/main...HEAD, the form excluded); no claim elsewhere changes; commit 7beada4.
