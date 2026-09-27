*Custodian's filing note (2026-09-27): scoped read (reviewer) of the exposure-profile-paths piece's record round 2, range `2511028..42ea38a`, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ 42ea38a79de551a4435abf6c97d2ec452229b290. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), numbered as gate 5 (the second scoped read). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed.*

---

**Scoped read of record round 2: Correctness PASS, Evidence PASS, Documentation FAIL (low, two findings). `governance/exposure-profile-paths @ 42ea38a79de551a4435abf6c97d2ec452229b290`**

Range `2511028..42ea38a`: one commit, 1 file (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md`), +35 lines. Main's checkout `C:/dev/spatial-ide` was at `3b421d58d87c1017a41bbc3e03e889a3ee62555e` before and after the R2 run. Worktree `C:/dev/wt/exposure-profile-paths` is clean at `42ea38a`. `C:/dev/exp-scoped2-scratch` did not exist beforehand and has been deleted. Nothing was edited, committed or pushed. No segment, `$USERNAME` or `$COMPUTERNAME` value was printed; every range of form text I printed went through a redaction pass, which made 0 redactions.

## Verdicts (`AUTONOMY.md` §22)
- **Correctness: PASS.** No code changed. The shipped scanner finds nothing in the added text or the commit message.
- **Evidence: PASS.** Both verbatim commands reproduce their recorded counts exactly (below).
- **Documentation: FAIL, low.** Findings D1 and D2 below. The record cap's two correction rounds are used up, so the disposition is the architect's reduction of the record, not a third round.

## R1: cured
- I extracted 13.3's fenced block from the committed file by script. It is one line, 1771 bytes, ending in ` -- <rev> <out>`. I executed it byte for byte through bash, with only the placeholders substituted; each output file was in scratch. Both runs exited 0.
  - At `3b421d5`: `rev=3b421d5 file_count=1124 files_with_findings=30`.
  - At `3c25302`: `rev=3c25302 file_count=1128 files_with_findings=22`.
- I recomputed both revisions independently, with a different harness (`ls-tree --name-only` plus `git show` per path, the shipped `scanText`, the canary checked first). The paths, per-file totals and per-class counts match the command's output exactly at both revisions. They also match 11.6's recorded 30-file and 22-file listings once parsed.
- The 22 equal §2a's 20 untouched rows (as revised by Amendment 2) plus the two routed files, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` and `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md`: 0 missing, 0 extra.
- The 30 less the 22 are exactly the 8 reworded files: the 7 whole-file substitutions and `normalize.rs`.

## R2: cured
13.4's line, extracted by script and executed byte for byte, gave `branch_loose=68 main_loose=75 branch_only=0` (exit 0). `runVerifyCites` reads only `git ls-files`, so the untracked directory in the main checkout does not affect the count.

## N2: indexed, but see D2
Amendment 13's superseded index now lists Amendment 8's Minutes bullet and its last bullet. The quoted last bullet matches Amendment 8's last bullet byte for byte.

## Findings (Documentation, low)
- **D1: a correction restates an earlier amendment's claim, contrary to round 12, item (d).** 13.1's second sentence says the result at `3b421d5` and `3c25302` "reproduces 11.6's file/class/count listing exactly (checked by script; not re-carried here)". That is Amendment 12's re-derivation claim again, nearly word for word. 13.1's third sentence ("The proof is 13.3's command and counts") already carries the proof. The claim is repeated a third time in 13.3's two result bullets.
- **D2: the N2 index names Amendment 10 as the superseding amendment, but Amendment 10 says the opposite.** Amendment 10's last bullet reads "Amendment 10 supersedes Amendment 8's first line and its Reason. Amendment 8's other bullets stand." Amendment 13's "Also indexed" paragraph and its index say the Minutes bullet and last bullet are "superseded by Amendment 10". Indexing them is correct, but the superseding act is Amendment 13's own, not Amendment 10's.

## Nits
- 13.3's result bullets record `rev=3b421d5...` and `rev=3c25302...`. With `<rev>` given as the short id, the command prints `rev=3b421d5 file_count=…` with no dots, so the recorded output is not what the command prints.
- 13.3 calls the written listing "byte-for-byte 11.6's … listing". 11.6's listing is prose in a different format, so it matches in content, not in bytes.

## Form
- **Correction length:** 13.1 is 3 sentences, 13.2 is 2 and the N2 paragraph is 3. None is over the ceiling; the restatement is D1.
- **Cites and pins:** no `path:line` cite, no sha256, no 40–64-hex hash and no `@ <rev>` pin in the added text.
- **Append-only:** `2511028`'s form (95829 bytes) is a byte prefix of `42ea38a`'s (100833 bytes). The added text has no CR.
- **Sign-off:** the commit has one `Signed-off-by` trailer, and its parent is `2511028`.
- **Scope:** the diff touches only the form.
- **Round 25, item 2:** no class-8 or class-9 matter arises and no `verify-mutation` wording appears.

## CI at `42ea38a` (all runs completed, watched to the end)

| Run | Workflow | Conclusion |
|---|---|---|
| 36344028046 | DCO sign-off (pull_request) | success |
| 36344028076 | Governance CI (pull_request) | success |
| 36344025041 | Governance CI (push) | success |
| 36344028078 | Product CI — Rust workspace | success |
| 36344028329 | Product CI — shell | success |

`gh pr checks 133` shows all 6 checks passing.

Files:
- C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md
- C:/dev/wt/exposure-profile-paths/scripts/plan/verify-cites.mjs
- C:/dev/spatial-ide/AUTONOMY.md
