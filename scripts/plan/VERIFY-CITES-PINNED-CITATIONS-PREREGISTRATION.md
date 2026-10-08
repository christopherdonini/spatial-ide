# verify-cites reads a pinned citation at its pinned commit before calling it unresolved — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code. Placed by the human's Decision B (`state/directives/2026-10-08-decisions-a-b-c.md` lines 17-24 at the commit that adds it, sha256 55ac849dfa481cb43f579a9edaefa4fa7fd729ec98424fef46595c04a11b32d4; its RULED block in `DECISIONS-PENDING.md`), as a one-off, bounded exception to the 2026-10-05 freeze. Found by `shell-migration-milestone-1` stage 2 (its form's Amendment 4, item 8): that form's citations pinned at 30e77c10 name lines past App.tsx's new end. A single combined reviewer gate (§21b) applies, because none of §21a's categories is touched.*

```
Authority: PLAN node verify-cites-pinned-citations; the human's Decision B of 2026-10-08 (state/directives/2026-10-08-decisions-a-b-c.md, lines 17-24); a one-off exception to the 2026-10-05 freeze, merged before shell-migration-milestone-1 opens its PR
Scope: scripts/plan/verify-cites.mjs and scripts/plan/verify-cites.test.mjs only; 2 files; <= 150 changed lines, tests included, this form excluded
Change: a citation that carries a pin (path:line or path:line-range, then @ and a commit) and does not resolve in the tree is resolved at its pinned commit (the file exists there and the line or range is within it) before it is called unresolved; a pin whose commit is missing, or whose file is missing at that commit, or whose line is out of range there, still fails; unpinned citations are checked against the tree exactly as today, and nothing else in the checker changes (the archived prefixes, the loose and doc-number classes, the output format and the exit codes)
Tests+mutation: four new tests in verify-cites.test.mjs, each on a temporary git repository: P1 a pinned cite past the tree's end that resolves at its commit passes; P2 a pinned cite whose commit does not exist fails by name; P3 a pinned cite whose file is missing at that commit fails by name; P4 an unpinned cite past the tree's end still fails (the old behaviour); mutation for P1: the pinned fallback removed, so P1 fails; for P2: an unknown commit treated as resolved, so P2 fails; for P3: the file check at the commit skipped, so P3 fails; P4 guards the unpinned path against a fallback applied to every cite; each observed, reverted and recorded in a RECORDED MUTATION comment with its commit
Out-of-scope: ADR none; security none; wire none; guarantee none -- §21a's four categories untouched, so the single reviewer gate applies; no product file, no workflow, no record rule and no other checker changes; the freeze stands for everything else
```

## Amendments

Opens empty, append-only.
