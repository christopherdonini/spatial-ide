# verify.mjs -- gate path must be a tracked file -- five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: PLAN.yaml node governance-verify-gate-file-exists; state/directives/2026-09-24-night-program.md item 5 (the human, verbatim): "All are light-lane fixes to tools that can silently skip tests, not new policy."
Scope: scripts/plan/verify.mjs (one new check inside verifyStatusAgreement) and scripts/plan/verify.test.mjs (new tests + fixtures); declared line budget <= 60 non-generated lines across <= 3 files.
Change: for every node whose status is in-progress or ready and whose gate is a path (not the literal "none"), verify.mjs now requires that path to be a tracked file (git ls-files) in the repo being verified, failing by name (node id and path) when it is not; the existing trackedPathExists helper is reused, so the check runs offline.
Tests+mutation: two new tests in verify.test.mjs -- a fixture plan with a ready node whose gate names a nonexistent path fails verifyStatusAgreement naming that node and path; a fixture plan with a ready node whose gate names a real tracked path (this preregistration file itself) passes; the mutation is the fixed gate path in the passing fixture broken (path misspelled) -- the new check fails it by name, then the fixture is restored.
Out-of-scope: no ADR, wire, security or guarantee text; no change to evidence.path/evidence.log checking (already present, confirmed unchanged); no change to plan.mjs's structural gate-is-a-string validation; no PLAN.yaml status is edited by this piece.
```

Budget: (filled at landing).
