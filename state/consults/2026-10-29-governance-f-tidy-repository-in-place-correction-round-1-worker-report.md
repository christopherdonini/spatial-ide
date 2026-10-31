*Custodian's filing note (2026-10-29): the worker-high's report on PR #270's correction round 1 of 2 (gate 1's C1 and the gate words), at f6168c99 on the merge 563cb209 of main ac89960e. By its transcript: the merge and the correction commit, one push; no cargo call; its deletions were of its own temporary clone; run 2026-10-29T11:06:23Z to 11:18:43Z (Read 4, Bash 40, Write 4). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 700c18e520b6d0eddeabd51219a46fd00552970a75e1d549fd7b4fb6b7e4f4e4.*

---

Corrected: governance-f-tidy-repository-in-place at f6168c9993a3cb29e0b6a538cdcc551914647c15 (pushed; origin's branch equals it; porcelain empty)

**Merge (563cb209ab544eef19cd1589b1dd2676a5262f4a, parents 494cea7b and ac89960e, main unchanged at push time).**
- `git merge --no-ff --signoff --no-commit origin/main` stopped with conflicts in 4 files, all generated: `governance/CUSTODIAN-QUEUE.json`, `governance/CUSTODIAN-QUEUE.md`, `site/data/plan.json`, `site/index.html`. I regenerated them with `queue.mjs` and `site.mjs` (rc 0 each).
- `governance/PLAN.yaml` did not conflict. Git auto-merged it. I still set it to the bytes of `git show origin/main:PLAN.yaml` and ran `moved-map.mjs rewrite-gates`: "162 gate lines that are not none, 160 named an old path and were rewritten", rc 0. The result is byte-equal (cmp 0) to the auto-merge.
- Everything else in the merge came in clean: the 6 `state/` files, byte-equal to origin/main.
- `moved-map.mjs plan` at the merged head stops, rc 1: `root entry "governance" has no row under rule R`. This is the reviewer's C2 finding. I ran it against origin/main's tree, which is the P side, in a throwaway `--no-checkout` shared clone of my worktree under the OS temp folder, with HEAD set to ac89960e and `git read-tree HEAD`. The clone is removed.
  - Command: `plan --root <clone>`.
  - Result: 188 rows move, 34 stay, rc 0. After sorting, the 188 rows are byte-equal to columns 1 and 2 of `governance/MOVED.tsv` (cmp 0). That is section 2.1's 186 rows plus Amendment 1's 2 delta rows.
  - I did not re-derive the 186 from the form's text. The equality is with MOVED.tsv, which the reviewer's report proved equal to 186 + 2.

**Correction commit f6168c99.** 13 files, 33 insertions and 33 deletions, one line for one line (`git diff --numstat` read: 1/1 worker.md, 8/8 `docs/README.md`, 5/5 `governance/README.md`, 1/1 hooks.test, 1/1 forms-layout.mjs, 2/2 forms-layout.test, 1/1 moved-map.mjs, 2/2 moved-map.test, 1/1 movedMap.mjs, 1/1 site.test, 7/7 verify-cites.test, 2/2 verify-quotes.test, 1/1 verify.test). Every replacement was cut by `pf-cr1-apply.mjs` from the filed report, origin/main or MOVED.tsv. `pf-cr1-verify2.mjs` then checked each new span against its source, and its last line is "ALL EQUAL". Both scripts are in the scratch folder.
- **C1, both reports:** `docs/README.md` lines 54, 60, 64, 65, 69, 70, 71 and 72 are now the bytes of origin/main's same lines (EQUAL on each). Lines 27 and 28 are kept (they differ from main).
- **Architect D1, D2, D3:** `governance/README.md` lines 19, 12 and 29, each replaced whole by the architect's quoted line, which is its report lines 30, 34 and 38 (EQUAL).
- **Reviewer C2:** the last sentence of `governance/README.md` line 23 is replaced by the reviewer's words, report line 22 (EQUAL).
- **Reviewer C3:** `governance/README.md` line 32 is replaced whole by the reviewer's words, report line 34 (EQUAL).
- **Reviewer D3** was not applied; the architect's whole line governs line 29.
- **Architect D4:** `.claude/agents/worker.md` line 15, `AI_DEVELOPMENT.md` to `governance/AI_DEVELOPMENT.md` (one occurrence, path only).
- **Reviewer D1:** the old form path became `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`, taken from MOVED.tsv's row, at `movedMap.mjs:5`, `moved-map.mjs:6` and `forms-layout.mjs:6`.
- **Reviewer D2:** the 16 parentheticals now read "(phase 1's commit, on the branch wip/governance-f-scripts; this branch carries the test from it by patch and does not contain the commit)", from report line 66. The file:line list matched the reviewer's list exactly, and 16 replaced.

**Checks at f6168c99.**

| Check | rc | Last line |
|---|---|---|
| `adrIndex.mjs --check` (in `frontends/shell`) | 0 | adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line |
| `node --test` over `scripts/plan`, `scripts/hooks`, `scripts/evidence`, in a shared hold | 0 | tests 589, pass 589, fail 0 |
| `verify.mjs --offline` | 0 | verify:plan PASS (governance/PLAN.yaml agrees with the repository) |
| `verify-cites.mjs` | 0 | PASS, 2523 files, 78 loose references advised |
| `verify-quotes.mjs`, in a shared hold, went to the background at 180 s and finished | 0 | PASS, 132 checked, 101 verified, 30 baselined, 1 advisory, 0 hash-reference errors, 887 ruling cites resolved |
| `verify-test-claims.mjs` | 0 | PASS, 695 claimed tests across 214 files, 43 planned, 11 superseded, 17 withdrawn |
| `moved-map.mjs --check` | 0 | PASS, governance/MOVED.tsv equals its regeneration |
| `forms-layout.mjs` | 0 | PASS, 178 files |
| `queue.mjs --check` | 0 | current |
| `site.mjs --check` | 0 | current |

- The first `node --test` call used directory arguments, which Node 24 does not run as tests. It failed in about 50 ms per directory, rc 1. I re-ran it with the globs from `governance-ci.yml:150`, and that is the run above.
- No timing-sensitive failure was seen.

**Rule R.** `governance/MOVED.tsv` is unchanged from 494cea7b to HEAD (zero diff). In `moved-map.mjs` the only change is the line 6 comment. No stop was triggered.

**Size, section 7's command from M (a8ae51d9) to head.**
- Raw: 52 files, +1719 −243 = 1962 lines. That is over the 48-file and 1,600-line figures.
- Six of those files are `state/` records that arrived with main: `CUT-STATE.md`, the build and clause-table worker reports, the two gate reports, and `gate-log.json`. They are byte-equal to origin/main, and none of the six is a branch change.
- With `state/` excluded: 46 files, +1291 −237 = 1528 lines. That is within 48 files and 1,600 lines. C2 alone was 45 files and 1542 lines; the difference is the 16 reverted ADR-index lines and the two worker.md lines.
- PLAN gate lines: +160 −160, which is at the 160 limit.
- Whether the raw figure counts as class 8 is the custodian's call.

**Not done, and noticed but not touched.**
- E1: Guardian tests unrun. `claude` is forbidden to me.
- E2: the full shell `npm run verify` and CI at the new head. I ran only `adrIndex --check`.
- E3: rule (00) via `gh`.
- The reviewer's D4 (the form is append-only; the observed T2 failure goes in the closing amendment) and the architect's D5, D6 and R1 to R3 are not mine.
- `wip/governance-f-scripts` must stay on origin; I did not touch it.
- The commit messages carry `Signed-off-by` lines that git added through `-s`. I wrote none, and no `@` appears outside the first trailer line (grep checked both message files).

**Left behind.** No background shell or process of mine is running. The one background call exited with code 0, and both its hold and the others were released. No cargo call, no force push, and no write outside `C:/dev/wt/pf`, the OS temp folder and the scratch folder. My scratch files start with `pf-cr1-`.

**Model.** The harness reports claude-sonnet-5-5 (Sonnet 5.5). I used no override and received or produced no context handoff.
