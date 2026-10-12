# PR #213 gate 1 — reviewer
Reviewed: docs/recorder-retired @ f5fa9ad5b14b23fcb6d9244fb970cee59922d9ce

**Verdict: PASS.** There are no Correctness or Evidence findings. There is one Documentation finding (D1), which must be fixed in this PR before the merge.

## Correctness
None.

## Evidence
None.

The five checks were run in `C:/dev/wt/recret` at f5fa9ad5, and every one exited 0:
- `node scripts/plan/verify.mjs`: PASS.
- `verify-cites.mjs`: PASS. It printed 49 loose-reference advisories, none of them in this README.
- `verify-quotes.mjs`: PASS. It checked 121 passages and reported 0 hash-reference errors.
- `verify-test-claims.mjs`: PASS, 545 claims.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 457 tests, 457 pass, 0 fail.

The worktree was clean (`git status --porcelain` printed nothing) after the runs.

## Documentation

**D1 (must fix before the merge). The paragraph's last sentence leaves README line 23 reading as current practice, and the uninstall ended that practice.**
- **Where:** `tools/mods/spatial-evidence-recorder/README.md:23 @ f5fa9ad5b14b23fcb6d9244fb970cee59922d9ce` is in the present tense. It begins "From install on, the custodian's worker and tester briefs tell agents to run approved test commands through the Bash tool, so that they are recorded."
- **Why it is now wrong:** that practice is round 50, item 1, O-12 (a), as the RULED 2026-10-04 block in `DECISIONS-PENDING.md` applies it. Amendment 10, item 3 of `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md` ends it from the uninstall on. Item 3 of `state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md` says the same.
- **Why the new paragraph does not cover it:** its closing sentence says the rest "describes the mod as it was built". Line 23 describes the briefs, not the built mod, and so does line 33, which rests on a different ruling, the repeat-runner's. A reader therefore still takes line 23 as current.
- **The fix (wording-block rule, `AUTONOMY.md` §31).** Replace the paragraph's last sentence with: "The rest of this README describes the mod, and the briefs' practice around it, as they were before the uninstall." Each clause, checked:
  - "the mod … as they were before the uninstall": the mod's code and docs below are the merged v0.1. The README's last change before this PR is 9d9b92db (#184).
  - "the briefs' practice around it": this covers line 23 (round 50, item 1, O-12 (a)) and line 33 (the repeat-runner's ruling).
  - "before the uninstall": the uninstall is `state/directives/2026-10-11-recorder-uninstalled.md`. The clause is true of line 23, which ended at the uninstall (Amendment 10, item 3). It is also true of line 33, because it says nothing about whether that practice continues.
- **Size:** the fix is still one changed line, so the diff stays at 2 insertions.

## Other checks (no findings)
- **Clauses of the paragraph, each against its sources:**
  - "Retired (2026-10-11)": the mark item 3 orders; the directive is dated 2026-10-11.
  - "The human uninstalled this mod on 2026-10-11": `state/directives/2026-10-11-recorder-uninstalled.md`, and Amendment 10, item 2 (20:26:44Z).
  - "after its overhead check E10 failed": Amendment 9, items 1 and 2 (E10: FAIL). Amendment 8's superseded index makes E10's bound the overhead stop's bound.
  - "Amendments 9 and 10": both exist at origin/main 1d8f1f1c, as headed.
  - "Its code stays here unchanged": item 3 ("The mod's code stays in the repository") and Amendment 10, item 1. The last change to a non-README file in the folder is 05fc645d, an ancestor of the #177 merge e29a725b. Every commit since then touches only the README (1eb82dba, 9d9b92db, f5fa9ad5).
  - "for reference": this states a purpose only and makes no factual claim. No source contradicts it, so it is not a finding.
- **Location:** item 3 says "the mods README". No `tools/mods/README.md` exists (`git ls-files tools/mods` lists only the two mod READMEs). Amendment 10, item 1 reads it as "its README", which matches the diff.
- **Nothing else changes:** `git diff --stat origin/main...f5fa9ad5` shows one file, 2 insertions and 0 deletions. The branch is a single commit, f5fa9ad5, on merge base 1d8f1f1c (origin/main).
- **Line cites into the moved README:** I ran `git grep` at f5fa9ad5 for `recorder/README.md:<n>`, `#L` and "README.md, line N" forms. It found no unpinned cite:
  - Every hit is pinned with `@ <commit>` (976e64cd, 609ab945), or names its commit in the text ("at 2d95575e", "at 1eb82dba").
  - The one exception is `state/consults/2026-10-06-mods-readme-local-scope-worker-report-2.md:12` ("touches only line 73"). It describes that report's own commit, and it is a historical report.
- **Red lines:** item 4 of the 2026-10-11 rulings says README lines are not red-line text, so the custodian's wording here is permissible.

Files: `C:/dev/wt/recret/tools/mods/spatial-evidence-recorder/README.md`, `C:/dev/spatial-ide/tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md`, `C:/dev/spatial-ide/state/directives/2026-10-11-recorder-uninstalled.md`.
