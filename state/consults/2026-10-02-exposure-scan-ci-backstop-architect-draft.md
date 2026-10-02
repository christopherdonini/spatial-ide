# Consult — the architect's draft for exposure-scan-ci-backstop (2026-10-02)

*Custodian's filing note: one hand-back from the architect agent on the custodian's brief (a drafting consult, not a gate), read at main 5d03045, recorded verbatim below with the harness's report indentation removed. Its fenced DRAFT is elided, marked in parentheses: it is committed as `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md` with the edits its header lists. The custodian's checks before commit, at 5d03045:*
- *Every span the draft pins was read at 5d03045 and says what the draft relies on: `runGit` returns null on failure and passes no `stdio`, so git's stderr reaches the parent; the staged filters at lines 438 and 469 are `ACMR`; `MACHINE_ACCOUNTS` is `runner`, `user` and `root`; dco.yml reads the pull-request shas through `env`; governance-ci's setup-node pins Node "24"; the pre-commit hook accepts on status 0 and the exact clean line.*
- *(b) 1 is right: round 30, item 1 rules that the local-profile override never applies to the three machine accounts, and says nothing about runners. The custodian's draft section B.2 and the brief overstated it; the form records the runner behaviour as a consequence of rule (iii).*
- *"The seven pushed commit bodies" is the governing form's own count (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:43`).*
- *Open points: 1 and 3 are applied in the form's commit (PLAN's budget 180, the gate this form); 2, 4, 5 and 7 are read as drafted; 6 is the human's, raised after a green E5. (c) 1 and 2 are noted on the two nodes' summaries; (c) 3 makes no node.*

---

Drafting consult (not a gate), read at main @ 5d03045. The form is below. Every hash is left for you to compute. The draft contains no profile-shaped path: every fixture is described in words and built at run time.

(The fenced DRAFT is elided here: it is committed as `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`, with the custodian's edits its header lists.)

**(a) Open points I could not settle from the record, each with my recommended reading**
1. **Minutes.** PLAN gives `budget_minutes: 120`. The form declares 180 for 13 tests, the probe runs and two gates. I recommend 180, or you set PLAN and §7 to one figure before commit.
2. **The probe branch, E2 to E4.** It is pushed to the public repo and later deleted. I recommend keeping it: no workflow here uses `before`/`after`, so without it the push path is first proven on `main` itself. Deleting the branch is yours; the form claims nothing about what a deletion triggers. If you drop it, E5 becomes the only proof of the push path, and §1's seam bullet must say so.
3. **The node's `gate` field.** It reads `gate: none` (`PLAN.yaml:3408`). It must name this form, or §4's test names stay binding claims and verify-test-claims fails until they exist.
4. **`persist-credentials: false`.** No existing workflow sets it. I recommend keeping it as least privilege, since the job never pushes.
5. **The `edited` trigger** (base retargeted) is left out to match dco.yml, and is declared as a limit. I recommend keeping it out.
6. **Making the check a required status check.** That is branch protection, the human's (AUTONOMY.md Appendix A2, item 13). I recommend raising it after a green E5, not in this piece.
7. **No dated line** is appended to `PRE-PUBLIC-CHECKLIST.md` or to the governing form. Nothing rules one, and the record cap argues against it.

**(b) Places where the record contradicts or strains the adopted shape**
1. **The runner override.** The draft (B.2) and your brief cite round 30 for "no local-profile override on a runner". Round 30, item 1 says nothing about runners: it rules that the override spares the three machine accounts. The form records runner behaviour as a consequence of rule (iii), adds no flag or secret, and declares the CI-side gap (the human's flattened form is not caught in CI).
2. **"Catching" overstates it.** The question text and the draft say the backstop catches what the hooks cannot. Every trigger fires after publication, so it detects and never prevents. §1 says so.
3. **Round 27, item 2 binds the corpus piece.** Its (i) and (ii) were rulings for that piece. The draft cites them directly; the scanner carries them through round 28, items 1 and 2. §9 cites both routes.
4. **"before..after" is ambiguous for a force push.** In the draft and the question it is under-specified when `before` is not an ancestor. §2 item 4 reads it as the merge-base range when `before` resolves, and exit 2 when it does not.
5. **The governing form's own limits.** `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 160 (2h) and §8 item 7 ("a workflow file changed") bind that piece only. Its 7.6 calls the type-change gap declared and unchanged; this piece changes it (§2 item 5). That is not an edit to its record, but the gate should read it as intended.

**(c) Routed items that belong to another node**
1. **`exposure-scan-followups`:** after this piece, it keeps only the two main-side hits, including the punctuation-only segment, which is the human's. You edit its summary to drop the type-change item.
2. **`workspace-rustfmt`:** its PR will be the first large range this backstop scans. The re-derivation listing at `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` line 795 shows no `.rs` file with a finding, so no interaction is predicted. Worth one line in that piece's form.
3. **No node yet:** scanning PR titles and bodies, issues and comments, and the local `pre-merge-commit` gap. These go to a weekly window if wanted.
4. **The human:** the required-status-check setting (point (a)6).

Relevant files:
- C:\dev\spatial-ide\scripts\hooks\profile-path-scan.mjs
- C:\dev\spatial-ide\scripts\hooks\profile-path-scan.test.mjs
- C:\dev\spatial-ide\scripts\hooks\EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md
- C:\dev\spatial-ide\.github\workflows\dco.yml
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml
- C:\dev\spatial-ide\.githooks\pre-commit
- C:\dev\spatial-ide\PLAN.yaml
- C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-02.md
- C:\dev\spatial-ide\state\questions\round-33.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
