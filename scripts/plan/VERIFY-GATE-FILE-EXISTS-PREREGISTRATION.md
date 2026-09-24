# verify.mjs -- gate path must be a tracked file -- five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: PLAN.yaml node governance-verify-gate-file-exists; state/directives/2026-09-24-night-program.md item 5 (the human, verbatim): "All are light-lane fixes to tools that can silently skip tests, not new policy."
Scope: scripts/plan/verify.mjs (one new check inside verifyStatusAgreement) and scripts/plan/verify.test.mjs (new tests + fixtures); declared line budget <= 60 non-generated lines across <= 3 files.
Change: for every node whose status is in-progress or ready and whose gate is a path (not the literal "none"), verify.mjs now requires that path to be a tracked file (git ls-files) in the repo being verified, failing by name (node id and path) when it is not; the existing trackedPathExists helper is reused, so the check runs offline.
Tests+mutation: two new tests in verify.test.mjs -- a fixture plan with a ready node whose gate names a nonexistent path fails verifyStatusAgreement naming that node and path; a fixture plan with a ready node whose gate names a real tracked path (this preregistration file itself) passes; the mutation is the fixed gate path in the passing fixture broken (path misspelled) -- the new check fails it by name, then the fixture is restored.
Out-of-scope: no ADR, wire, security or guarantee text; no change to evidence.path/evidence.log checking (already present, confirmed unchanged); no change to plan.mjs's structural gate-is-a-string validation; no PLAN.yaml status is edited by this piece.
```

Budget: 53 of 60 non-generated lines across 2 of <= 3 files (git diff --numstat origin/main -- scripts/plan/verify.mjs scripts/plan/verify.test.mjs; the form itself excluded per §21c); commit a84b614.

Correction (reviewer attempt 1, Documentation FAIL; commit e2f52cd):
1. Finding 1 (Documentation, misquote): the gate-field comment quoted words AUTONOMY.md §1 does not contain; corrected to a non-quoting reference to AUTONOMY.md §1 (line 44), commit e2f52cd.
2. Finding 2 (Correctness, directory/glob gate passed): added trackedGateFileExists (commit e2f52cd), rejecting pathspec magic and requiring exactly one tracked regular file; proven by tests "verifyStatusAgreement fails by name when a ready node's gate names a directory, not a file" and "verifyStatusAgreement fails by name when a ready node's gate is a glob pathspec, not a file" (commit e2f52cd), each with its own recorded fail-then-fixed mutation.
3. Finding 3 (Evidence, in-progress half untested): added test "verifyStatusAgreement fails by name when an in-progress node's gate names an untracked path" (commit e2f52cd), with a recorded restore-to-gate-none mutation.
4. Finding 4 (nit, unstable fixture path): the passing-gate test now points at CLAUDE.md instead of this piece's own preregistration file, commit e2f52cd.

Checks (commit e2f52cd): `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` -- 256 pass, 0 fail; verify-cites.mjs rc=0; verify-quotes.mjs rc=0; verify-test-claims.mjs rc=0; verify.mjs --offline rc=0; queue.mjs --check rc=0; site.mjs --check rc=0.

Budget overrun (class 6 of docs/PREREGISTRATION-TEMPLATE.md, per AUTONOMY.md §21b's size-overrun clause -- form kept as committed, not rewritten): this round's total across scripts/plan/verify.mjs and scripts/plan/verify.test.mjs is 132 non-generated lines (`git diff --numstat origin/main...HEAD`, form excluded; commit e2f52cd), against the declared <= 60.
