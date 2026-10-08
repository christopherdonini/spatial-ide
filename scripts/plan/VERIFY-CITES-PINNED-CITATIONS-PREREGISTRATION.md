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

### Amendment 1 — the gate-1 reviewer's C1 and C2: two tests added after a gate finding (class 4), and the failing pin's reason

*Written by the custodian after the single reviewer gate failed (`state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer.md`, gate-log 441), at the branch head 57e8d2b3, before any code of the fix. Correction round 1 of 2. Nothing below is a quotation.*

1. **C1, the file at the pin.** A pin is read as a file, not as anything the commit can show. `checkPinned` reads the pinned path as a blob, so a path that is a directory at the pinned commit fails, with the pin's reason.
   - **New test P5:** a pinned cite whose path is a directory at that commit fails by name.
   - **Mutation:** the blob read replaced by the current `git show` read, so P5 fails.
2. **The line at the pin.** The Change line's out-of-range clause gets its own test.
   - **New test P6:** a pinned cite whose file exists at that commit, but whose line is past that file's end there, fails by name.
   - **Mutation:** the range check at the pin removed, so P6 fails.
3. **C2, the reason.** When the pin's file is not found at the pinned commit but the tree found a file for the cite, the tree's own reason is kept. The pin's reason replaces it only when it states something true: a missing commit, a directory, or a line out of range at the pin. No cite changes tier.
4. **D1 and D2.** The checker's header states the pinned fallback and its limits: a pin after a closing backtick or two spaces is not read; a pin on a cite that resolves in the tree is not checked; and a hex word right after `@` is read as a pin. `extractCitations`'s JSDoc names the `pin` field.
5. **D3, for the record.** The worker report places the new pattern at line 142 of `verify-cites.mjs`. It is at line 144 at 57e8d2b3. The report is not edited.
6. **The Scope stands:** the same two files, still at most 150 changed lines, tests included. The other tests and the Out-of-scope line are unchanged.

**Superseded index.** The Change line's file-exists clause → item 1. The Tests+mutation line → items 1 and 2 add P5 and P6. None is edited.
