*Custodian's filing note (2026-09-27): scoped read (reviewer) of the exposure-profile-paths piece's record round 1 and final merge, range `4155fcf..2511028`, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ 2511028a45b6bdb68ed9d4163927d6cc8d169e18. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), numbered as gate 4 (the first scoped read). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed.*

---

governance/exposure-profile-paths @ 2511028a45b6bdb68ed9d4163927d6cc8d169e18: **Scoped read (reviewer), record round 1 plus the final merge, range 4155fcf..2511028. Result: FAIL on Documentation only, low severity. Correctness and Evidence PASS.**

Main was `origin/main` = `3b421d5`, which is also the merge base with the head. The form is cited by amendment and item. No profile-shaped string is reproduced here.

## §22 verdicts

| Verdict | Result | Severity | Scope | Disposition |
|---|---|---|---|---|
| Correctness | **PASS** | — | the whole range | The scanner, the test file and both hooks are byte-identical to C′ `955e6c7`. Both merges are pure automatic merges: each merge's tree equals `git merge-tree --write-tree` of its parents (`2b8813f` gives `ca4dde6…`, `3c25302` gives `267605a…`). `kernel/` is identical to `4155fcf`, so cargo was not needed. |
| Evidence | **PASS** | — | Amendments 10 to 12's figures | Every re-run matches the record (below). CI is green at `2511028`. |
| Documentation | **FAIL** | low | Amendment 11 (11.1 and 11.6) and Amendment 12 (suites bullet) | Two gate-3 sub-findings are not cured in text, R1 and R2 below. My re-runs verify both in substance. Disposition: record round 2, the last under the record cap, with two corrections of at most three sentences each, or the architect's reduction. No code. |

## Gate-3 findings: cured or not

| Finding | Status | Proof |
|---|---|---|
| A3-D1 / G3-D1 (class-8 words) | **Cured** | Amendment 10's first line contains the template's words byte for byte, including the U+00A7 section sign. I checked this by script against `docs/PREREGISTRATION-TEMPLATE.md`'s class 8 (the Round 25 additions). The header Budget line is not edited: the form at `7037d7a` is a byte prefix of the form at the head. |
| A3-D2 / G3-D2 (a) (reason is prose) | **Cured** | Amendment 10's reason is exactly "7.1, 7.3". Its supersession line covers Amendment 8's first line and its Reason. |
| G3-D2 (b) (minutes declined) | Cured in substance, with a note | Amendment 10 now records minutes by reference to the gate-3 architect report's filing note (456 and 309 against 600). See N2. |
| A3-D3 / G3-D5 (restatement, §8 item 10) | **Partly cured** | 11.1 withdraws the verify-quotes clause, the Mutations narration and the cargo Disclosure, and 11.5 is references only, with no file line. **R2, open:** A3-D3's fourth sub-item, verify-cites' "pre-existing" asserted with no proof, is not addressed by 11.1 and is re-carried in 11.6's and Amendment 12's verify-cites bullets. It is true in fact: at the head, the branch's 68 loose references are a strict subset of main's 75 at `3b421d5` (0 branch-only). A one-line reference carrying that proof would cure it. |
| A3-D4 / G3-D3: command verbatim | **Not cured (R1)** | 11.6's re-derivation "Commands:" are the same text shape the gate failed: `git ls-tree -r --name-only <rev>` and `git show <rev>:<path>` in backticks, then "a one-off import of this piece's own `scanText`". Amendment 9 already had both git commands in backticks. The scan step, 4.7(ii)'s "one-line command", is still described, not recorded. This is the fourth occurrence (A-E4, A2-E3, R2-D1, A3-D4). The substance reproduces exactly (below). |
| A3-D4 / G3-D3: per-file listing | **Cured** | 11.6 lists 30 files at `9c9616a` and 22 at `2b8813f` by path, form class and count. My recomputation matches both listings file for file, class for class and count for count. |
| A3-D4 / G3-D4: prediction-4 range by ids | **Cured** | 11.6 records `ccdccfd~1..2b8813f` (17 commits) and Amendment 12 records `ccdccfd~1..3c25302` (19 commits). Both ends are ids, and my commit lists are identical to the recorded ones. |
| A3-D5 / G3-D6 (discharge map) | **Cured** | 11.3's map resolves: 7.3's tables exist; 7.9's rows for 7.1(a) to (c) name tests and its 7.1(d) row names the `AI_DEVELOPMENT.md` bullet; 11.6's M″ and prediction-4 bullets exist. The 4.1–4.13 sentence is superseded whole (index). Note: 4.7's last bullet is discharged by Amendment 12, which 11.3 predates. That is resolvable and needs no action. |
| A3-D6 (two bases) | **Cured** | 11.4 and 11.6 name `00cf306` (this piece's base) and the `origin/main...M″` base `9c9616a` separately. |
| G3 nits ("(20)", "36 binaries") | **Cured** | 11.7 |
| A3-D7 (the custodian's) | **Open, and not the worker's** | PR #133's body does not name 7.4's rows at `da80db0`; A3 said "already met", but the current body has no such text. No PLAN node blocked on the piece carries post-merge pins, and 7.4 still reads these rows as class 4. The PR body is also stale: "one step remains… then gate 3", "Amendments 1–7", "Record-round count: 0", and pre-push figures over `origin/main..HEAD` with no ids. Refresh it before ready. |
| A3 E-a, N-a | Routing notes | Not addressed in the record. They were optional ("record in one line, or route"). |

**Round 12 / round 25 checks on Amendments 10 to 12:**
- 11.1 to 11.4 and 11.7 are each at most three sentences.
- The superseded index is present and carries "Read the last amendment first".
- The new text has no hash pin, no line cite (`path:line`), no `verify-mutation` wording and no class-9 work.
- Every double-quoted span in Amendment 11, other than the grep pattern, matches Amendment 9 byte for byte.
- The form is append-only across the round: `4155fcf` is a prefix of `7f422a9`, `7f422a9` equals `3c25302`, and `3c25302` is a prefix of `2511028`. There are no CR bytes.

## Re-runs, all through node scripts (canary and a positive self-test first, every exit status 0)

- **Re-derivation** (`ls-tree -r -z` plus `cat-file --batch`, shipped `scanText`, the real local name, file names scanned too):

  | Revision | Files | With findings | Name findings |
  |---|---|---|---|
  | `9c9616a` | 1123 | 30 | 0 |
  | `2b8813f` | 1127 | 22 | 0 |
  | `3b421d5` | 1124 | 30 | 0 |
  | `3c25302` | 1128 | 22 | 0 |
  | `2511028` | 1128 | 22 | 0 |

  - The worker's 30 and 22 hold. Each set is identical to Amendment 11's listings, as Amendment 12 says.
  - The base minus M″ is exactly the 8 reworded files.
  - The 22 are §2a's 20 untouched rows plus the two routed files. Invalidator 1 does not fire.
  - `b1-engine-kernel-half-gate3-reviewer.md` was added at `3b421d5` and has 0 findings.
- **Prediction 4** over first-parent `ccdccfd~1..3c25302`: 19 commits, 0 failures. Messages went through the shipped CLI's `--message`; the self-test gave 1 plus the refused line, and a clean message gave 0 plus the clean line. Non-merge `+` lines went under `scanText`. Through `2511028` it is 20 commits, 0 failures.
- **2a′** (`3b421d5...2511028`):
  - numstat `1\t1`, one hunk at ledger line 1840, inside entry 49 (which starts at 1809);
  - `redactRoots` gives count 1, the output equals the added line, and the added line scans clean;
  - entry 110's finding (in the entry starting at 784) is untouched.
- **Five prefixes:** all true, with 11 + 10 + 4 + 2 + 12 = 39 appended lines and 0 findings.
- **N = 6:** the highest Custodian-role heading is Amendment 5 at both `9c9616a` and `3b421d5`.
- **§8 item 1, three-dot:** 2733 added lines, 0 findings with or without the local name; 19 names, 0 findings. The local name occurs as a substring in 3 added comment lines, in `.githooks/pre-commit`, `profile-path-scan.mjs` and the test file. Each is part of the git author's full name (a boolean check), not a path, and these files are unchanged since C′.
- **Merge claims:** `queue.mjs --check` and `site.mjs --check` report current at the head. M″ brought only 5 added files under `state/consults/` plus `state/gate-log.json`, which matches 11.6.

## Nothing outside the record changed

- `git diff --stat 4155fcf 2511028` touches 14 files. 13 are equal to `3b421d5`, meaning main brought them. The form is the only other, changed by `7f422a9` (+69) and `2511028` (+26), with 0 deletions.
- The three-dot file set is still 19, and it is the same set as at gate 3.
- `PLAN.yaml` equals main's. Its only change in the range is main's own `3b421d5`.
- The scanner, the test file and both hooks: `git diff --quiet 955e6c7 2511028` returns 0.

## Suites at the head `2511028`

| Suite | Result |
|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 349 pass, 0 fail |
| verify-cites | PASS: 840 files, 68 loose references |
| verify-quotes | PASS: 110 / 79 / 30 / 1 / 0, 2 hash-baselined |
| verify-test-claims | PASS: 300 claims in 88 files (11 / 3 / 15) |

These match Amendment 12. I did not independently re-run 11.6's M″ verify counts or its cargo counts: an export lacks git, and `kernel/` is unchanged.

## CI at `2511028` (`gh run list --branch governance/exposure-profile-paths`)

All success:
- Governance CI push `36342456693` and PR `36342460614`;
- **DCO sign-off `36342460559`**;
- Product CI shell `36342460841`;
- Product CI Rust workspace `36342460583` (I watched it to completion).

PR #133 is an open draft, and its head is `2511028`, matching the remote ref.

**Sign-off:** `2b8813f`, `7f422a9`, `3c25302` and `2511028` each carry one `Signed-off-by`.

## Notes (not blocking)

- **N1, low.** 11.1 withdraws three clauses but is labelled class 3. Round 15 (g) makes a withdrawal row in a record-correction round class 1. This is a no-action candidate under the record cap.
- **N2, low.** Amendment 10's minutes are the 18:17Z count, taken before the record round, and are set against §10's 600. The declared 300 stands in Amendment 8's header bullet. Amendment 8's "Minutes… not this amendment's to state" bullet is not in the superseded index, and neither is its last bullet in the "Not superseded" list. The index lists only the figure and file-count bullets.
- **N3, nit.** Amendment 12 re-carries 11.6's commands in full where "11.6's commands, at M‴" would carry them. "Generated-file conflicts:" introduces files that did not conflict. "PLAN nodes under `state/consults/gates/`" is imprecise, and `3b421d5` also edited a draft.
- **N4, nit.** Amendment 11 says nothing is quoted "except where marked verbatim", but its double-quoted spans are not so marked. All of them match their source.

## Hygiene

- I never printed the values of `$USERNAME` or `$COMPUTERNAME`, or anything derived from them. Every output was scanned (0 findings) before it was read.
- Every process had a timeout, and every exit status was checked.
- `C:/dev/exp-scoped-scratch` did not exist before; I deleted it after.
- The worktree is clean at `2511028`. The main checkout is unchanged (only the pre-existing untracked `.codex-remote-attachments/`).
- I edited, committed and pushed nothing.

Files at issue:
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` (Amendment 11's 11.1 and 11.6; Amendment 12's suites bullet)
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-exposure-profile-paths-gate3-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-exposure-profile-paths-gate3-reviewer.md`
