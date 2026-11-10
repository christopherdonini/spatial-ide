*Custodian's filing note (2026-10-29): the worker-high's report on phase 2 of governance piece F's build, stopped at section 2.2's check 3 on M. The custodian's check: the branch's local head in C:/dev/wt/pf is M e2f9e718 on P cac8cba0, never pushed (origin holds no such branch); the porcelain is empty. By its transcript: one git write (M's commit), no push, no cargo call; to run measure-reads it used a ripgrep binary from an editor install, version 15.0.0 where the SEARCH-IGNORE form's record names 15.2.0, the same binary at P and at C2. The run 2026-10-29T07:42:09Z to 08:11:12Z (Read 7, Bash 55, Write 9). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is e92b171f90727ed9475e56eff212f9eb94f703d3e72c32dd21b0fb8b9139b6d8.*

---

Stopped: governance-f-tidy-repository-in-place, section 2.2's check 3 on M fails on 23 of 188 rows. M is committed locally and not pushed. C2 is not started and nothing is pushed.

**Brief:** sha256 930ecc36d266770573069aa338c36e84c4665d4dd89034582159b5a7bb7dc175, shown first. The form at cac8cba0 has sha256 92c2c518a151e5aad0a77d629bdcd68a532c66ed549b08b97ab7b3a62bba6e37, checked.

**State left**
- Branch `cut/governance-f-tidy-repository-in-place` in C:/dev/wt/pf is at M = e2f9e7183a8de5b447f5c8ca365902c20ee7b16e, signed off, on P = cac8cba08f754ba3b3fabe92d7505b771dc65eb1.
- `git status --porcelain` is empty. No push was made, so origin has no such branch.
- origin/main's local ref (no fetch made) is now 859489f7, one commit ahead of P. That commit is the custodian's own docs commit (#269 opened, this phase dispatched). It touches CUSTODIAN-QUEUE.json/.md, PLAN.yaml, site/data/plan.json, site/index.html and state/CUT-STATE.md.
- Background shells: none left. Every hold was released.

**Step 0, at P, before (outputs saved in my scratch folder)**
- `verify.mjs` online and `--offline`: both exit 0, PASS.
- `verify-cites`: exit 0, "scanned 2507 file(s)", 77 loose advised. Wall time 5466, 5312 and 5190 ms in three runs inside a shared hold.
- `verify-quotes`: exit 0. 132 checked, 101 verified, 30 baselined, 1 advisory, 2 hash-baselined, 887 ruling cites, 214 files scanned.
- `verify-quotes` result dump (all arrays): findings 0, hash findings 0, cite findings 0, unmatched baseline 0, 8125 path:line cites, 6402 hash-checked and all 6402 PASS.
- `verify-test-claims`: exit 0. 695 claimed across 214 files; 43 planned, 11 superseded, 17 withdrawn.
- `node --test` over `scripts/plan`, `scripts/hooks` and `scripts/evidence`: exit 0, 570 pass, 0 fail, 223 s.
- `queue.mjs --check` and `site.mjs --check`: exit 0. P's committed queue, plan and site files are copied to my scratch folder.
- measure-reads `routine P`: two runs byte-identical, total=214487, sha256 d5c081ac13fc2648c1ed4c130132c18b2472d4b86600a56762f546a444f5bd05.
- measure-reads `corpus P`: files=2296, bytes=42152665, tracked_not_listed=669. The checkout is `git archive` of P plus `git init` in my scratch folder, run with a ripgrep taken from a VS Code install (no `rg` is on PATH). The version is ripgrep 15.0.0; the SEARCH-IGNORE form's record says 15.2.0. `RIPGREP_CONFIG_PATH` is unset and no ignore files sit above the scratch folder.
- Digests at P: `measure-reads.mjs` 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1, `.ignore` d59148d1e369b280052884c8434b2b01d083a8ff6012f9ca4ff731fad32673cf.
- Measurement at P: (a) root entries = 59; (b) `.md` files in the code folders = 206.

**Step 1, rule R at P**
- Phase 1's three tools were extracted from 810f6f15. `moved-map.mjs plan --root C:/dev/wt/pf` gave 188 rows to move and 34 stay, with no problems and no collision.
- A script compared those rows with section 2.1's tables: 186 rows match, 0 are missing and 0 differ.
- The delta rows (for the PR body) are exactly the two Amendment 1 names:
  - `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` to `governance/forms/kernel/` with the same basename.
  - `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md` to `governance/forms/scripts/` with the same basename.

**Step 2, M**
- I ran `git mv` per row (188 of 188, no failure) and committed with `git commit -s -F`. Subject: `chore: governance piece F, the moves-only commit (188 renames by rule R)`. The message file had no `@` outside the Co-Authored-By line.
- Check 1 passes: `git diff --name-status -M100% M^ M` gives 188 lines, all `R100`, matching the 188 rows exactly. `git diff --shortstat` shows 188 files, 0 insertions, 0 deletions.
- Check 2 passes: all 188 blob ids are equal and all basenames are equal.
- **Check 3 fails on 23 rows.**
  - Check 3 as worded: the oldest commit of `git log --follow --format=%H M -- <new>` must equal the oldest of the plain `git log --format=%H M^ -- <old>`.
  - Examples of failing rows:
    - `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`: --follow reaches 20f3ffe4, plain old-path log stops at 1f7d06b5.
    - `engine/B1-PROJECTION-PREREGISTRATION.md`: 9e6faf97 against 1e58af59.
    - The other failing rows are mostly the same shape: engine, frontends/shell, kernel and scripts/hooks forms, plus this form itself and the 5b form.
  - For PORT-2 the extra history is the file's origin as a copy of `state/consults/2026-10-23-port-2-macos-l1-and-app-dirs-architect-draft.md`, which `--follow` finds and the plain log does not.
  - I did not route around it. As a diagnostic only, which is not the form's check, I ran `--follow` on both sides. The oldest commit of `--follow M -- <new>` equals the oldest of `--follow M^ -- <old>` on all 188 rows, and the commit sets (without M) are equal on all 188.
  - So the check's wording, a --follow log against a plain log, looks like the defect. The history is reachable. The custodian or the human needs to rule on, or amend, the wording before C2.

**Not done, because of the stop**
- C2, T14 and its mutation, the `MOVED.tsv` and `rewrite-gates` runs, the path edits, governance-ci, `governance/README.md`, the README, the queue and site regeneration, the section 5 "after" comparison, the section 7 size count, and the push.
- No refusal from the Guardian or the harness was met.

**Prepared in my scratch folder, read-only against the tree, for the next run**
- The README draft's kept spans are copied from P's README.md by script. All eight spans (draft file lines 32-41, 67-72, 79-81, 82-83, 93, 96, 101-121, 123-152) match README.md byte for byte, 0 lines differing, and the built file is 121 lines.
- Comparison tools for the before/after sets, the rule-R table check and the M checks.
- The next run can reuse the P-side step 0 outputs as long as it starts from P = cac8cba0. If main moves, section 9 says to merge main into the branch and re-run R, `rewrite-gates` and the proof.

**Readings and observations**
- verify-cites scanned count at P is 2507, so the C2 target is 2514 (P plus 7).
- Measurement (b) after M and C2 should be 206 minus 160 = 46. That is 158 from the form plus the 2 delta forms, both in code folders. Section 5's "158 fewer" is 160 with the delta rows.
- Phase 1's `movedMap.mjs`, `moved-map.mjs` and `forms-layout.mjs` import nothing outside their own three files, so the extraction ran standalone.
- Section 2.2's table cites lines at 79476279; the files it names are unchanged between 79476279 and P except PLAN.yaml, AUTONOMY.md, DECISIONS-PENDING.md and RELEASE-DAY-CHECKLIST.md, none of which is a script or test.

**Pre-gate self-check:** nothing was written to any interface across a module boundary. Every claim above has a transcript call behind it. No user-facing message was written. The only required test reached is the form's check 3, and it fails as reported.

**Model:** Sonnet 5.5 (claude-sonnet-5-5) as the harness reports. No override and no context handoff.
