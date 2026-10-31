# P3b test-name alignment — five-line short form (`AUTONOMY.md` §21d)

Committed before any code, per the short-form discipline.

```
Authority: frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md §4 (the P3b test-name claims T3-T7, T9); round 14, item 2 (class 3's test-text exception, docs/PREREGISTRATION-TEMPLATE.md:112-114); scripts/plan/verify-test-claims.mjs
Scope: kernel/tests/session_generation.rs, frontends/shell/src/streaming/viewportStreamManager.test.ts, frontends/shell/src/residency/candidateArmSession.test.ts, frontends/shell/src/App.test.ts, frontends/shell/src/streaming/tileViewportStreamManager.test.ts, frontends/shell/src/streaming/formatTerminalRefusal.test.ts; declared line budget <= 30 non-generated
Change: rename one Rust fn and five vitest test titles to the exact strings OWNER-INVALIDATION-PREREGISTRATION.md §4 claims for T3, T4, T5 (the UNTILED case), T6, T7 and T9, updating each test's own RECORDED MUTATION comment in the same commit; no assertion changes
Tests+mutation: no new test -- the six renamed tests keep their existing recorded mutations verbatim in behaviour, retitled in place; scripts/plan/verify-test-claims.mjs and scripts/plan/verify-mutation.mjs are the checks this piece must pass, not a new test
Out-of-scope: no assertion touched, no product file touched, OWNER-INVALIDATION-PREREGISTRATION.md not edited; none of ADR / security / wire / guarantee touched
```

Amendment: class 6, budget deviation, Scope not edited. Declared line budget <= 30 non-generated across the declared 6 files (met exactly on file count). Final figure 32 (16 insertions + 16 deletions; `git diff --numstat origin/main...HEAD` over the same 6 test files, PLAN.yaml/CUSTODIAN-QUEUE.*/site/** and this preregistration excluded) -- each file's own RECORDED MUTATION comment needed a second changed line beside its test's title line, undercounted when the budget was declared. Well inside `AUTONOMY.md` §21c's real bound (<= 150 lines, <= 8 files); the single-gate route is unaffected.

Amendment 3: class 6, the strict §21c figure (reviewer S1 -- `AUTONOMY.md:357`'s exempt set is this preregistration alone, plus governing-doc sentences the piece is obliged to update; PLAN.yaml and the two other-piece records count, `CUSTODIAN-QUEUE.*`/`site/**` stay exempt as generated). `git diff --numstat origin/main...HEAD` over that set: 94 (77 insertions + 17 deletions) across 10 files -- crosses §21c's <= 8 files bound. Scope unedited; the architect gate is taken alongside the reviewer, attempt 2.

Amendment 4: class 2, deviation from the declared Scope and Out-of-scope lines; neither is edited. `kernel/src/skp.rs`'s `dead_ticket_count` doc comment names the tests that call it — the instrument exemption's own condition (round 5, item 4) — so the rename obliges the name there (no behaviour, no signature, no surface); and the two closed records plus `PLAN.yaml` are edited by append, so "not edited" holds only of in-place edits. Both are inside Amendment 3's strict figure; §21a's four categories remain untouched. Amendment 2 (the figure carried by d193fd8) was reverted at 803c396 and is superseded by Amendment 3. Amendments: 1 (unnumbered in its line), 2 (reverted), 3, 4.
