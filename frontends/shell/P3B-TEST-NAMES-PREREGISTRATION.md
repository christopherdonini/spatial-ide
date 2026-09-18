# P3b test-name alignment — five-line short form (`AUTONOMY.md` §21d)

Committed before any code, per the short-form discipline.

```
Authority: frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md §5 (the P3b test-name claims T3-T7, T9); round 14, item 2 (class 3's test-text exception, docs/PREREGISTRATION-TEMPLATE.md:112-114); scripts/plan/verify-test-claims.mjs
Scope: kernel/tests/session_generation.rs, frontends/shell/src/streaming/viewportStreamManager.test.ts, frontends/shell/src/residency/candidateArmSession.test.ts, frontends/shell/src/App.test.ts, frontends/shell/src/streaming/tileViewportStreamManager.test.ts, frontends/shell/src/streaming/formatTerminalRefusal.test.ts; declared line budget <= 30 non-generated
Change: rename one Rust fn and five vitest test titles to the exact strings OWNER-INVALIDATION-PREREGISTRATION.md §5 claims for T3, T4, T5 (the UNTILED case), T6, T7 and T9, updating each test's own RECORDED MUTATION comment in the same commit; no assertion changes
Tests+mutation: no new test -- the six renamed tests keep their existing recorded mutations verbatim in behaviour, retitled in place; scripts/plan/verify-test-claims.mjs and scripts/plan/verify-mutation.mjs are the checks this piece must pass, not a new test
Out-of-scope: no assertion touched, no product file touched, OWNER-INVALIDATION-PREREGISTRATION.md not edited; none of ADR / security / wire / guarantee touched
```
