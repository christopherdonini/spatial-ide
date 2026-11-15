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

---

## Closing commit (AI_DEVELOPMENT.md Amendment 1 §A)

Branch-commit disclosure: pins below into `eac705a` and `db9d20b` name branch commits on `governance/verify-gate-file-exists`, not yet on `main` at this writing (the same disclosure Amendment 16's head states in `engine/ADMISSION-PREREGISTRATION.md:1637`).

1. Superseded-index gap (round 12, item 1, clause (e)): this round's own lines 8, 9 and 13 go stale against the code with no marker. Corrected by the superseded index below. Proof: the index's reference column, each hash recomputed from the commit named.
2. Class 6 with no reason, not an `Amendment:` line: the paragraph above states no reason and does not open `Amendment:`. Corrected by the `Amendment:` line below. Proof: `git diff --numstat origin/main...HEAD -- scripts/plan/verify.mjs scripts/plan/verify.test.mjs` and `git diff --numstat eac705a..HEAD -- scripts/plan/verify.mjs`.
3. `trackedGateFileExists`'s `git ls-files` call set no stdio, printing git's "pathspec did not match" to stderr on every failing gate. Corrected: `scripts/plan/verify.mjs:111-118 @ db9d20b` adds `stdio: ['ignore', 'pipe', 'ignore']`. Proof: manual repro shows the stderr text before the fix and none after, with `verifyStatusAgreement`'s returned failure list unchanged.
4. Nit, overclaim: the comment and this record called the required entry "one tracked regular file", but the check does not distinguish a regular file from a symlink or gitlink among tracked entries. Reworded rather than narrowed: `scripts/plan/verify.mjs:102-106 @ db9d20b`; narrowing was not chosen because `core.symlinks` is `false` on this machine, so `ln -s` there produces a plain tracked file (`git ls-files -s` mode `100644`, not `120000`) and no real symlink can be created here to test a narrower check.
5. Nit, bare line cite: line 16's "AUTONOMY.md §1 (line 44)" is a bare line cite into a file this piece does not pin by commit+hash. Corrected reference: AUTONOMY.md §1 (no line number carried).

**Superseded index** (round 12, item 1 (e)).

| id | status | reference |
| --- | --- | --- |
| line 8 ("the existing trackedPathExists helper is reused") | corrected: the check now uses `trackedGateFileExists` | `scripts/plan/VERIFY-GATE-FILE-EXISTS-PREREGISTRATION.md:17 @ eac705a sha256:166daf57a63e7445af8d6e5534021cf458ae695c40883d652c61c3e5e72da201` |
| line 9 ("two new tests" / "this preregistration file itself") | corrected: five tests total; the passing-gate fixture points at CLAUDE.md | `scripts/plan/VERIFY-GATE-FILE-EXISTS-PREREGISTRATION.md:18-19 @ eac705a sha256:a02f1ef4dfa74480b135069d484dfd7343635ded62c3bbeab45a56ec9d078830` |
| line 13 ("53 of 60") | corrected: the Amendment line below | this section, Amendment (below) |
| line 16 (bare "AUTONOMY.md §1 (line 44)") | corrected: §1 without the line number | this section, item 5 (above) |

Amendment: class 6 (docs/PREREGISTRATION-TEMPLATE.md §10 item 6). Declared 60; final 139 non-generated lines across scripts/plan/verify.mjs and scripts/plan/verify.test.mjs (`git diff --numstat origin/main...HEAD`, form excluded); this closing round's own addition is 17 lines, 12 insertions + 5 deletions (`git diff --numstat eac705a..HEAD -- scripts/plan/verify.mjs`). Reason: reviewer attempt 1 findings 2-3 (the `trackedGateFileExists` rewrite and its five tests) plus attempt 2 findings 3-4 (this round's items 3-4 above).

Checks (commit db9d20b): `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` -- 256 pass, 0 fail; verify-cites.mjs rc=0; verify-quotes.mjs rc=0; verify-test-claims.mjs rc=0; verify.mjs --offline rc=0; queue.mjs --check rc=0; site.mjs --check rc=0.
