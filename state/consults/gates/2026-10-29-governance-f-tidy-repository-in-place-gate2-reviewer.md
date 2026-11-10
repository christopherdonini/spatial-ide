Reviewed: PR #270 at f6168c9993a3cb29e0b6a538cdcc551914647c15, gate 2, reviewer
Verdict: PASS
Branch: cut/governance-f-tidy-repository-in-place @ f6168c9993a3cb29e0b6a538cdcc551914647c15. I read the brief whole first. `sha256sum` gives 6ee8e3820305818bdbfbea086170b2bcca0478cb03ecf11c94d56b0200db7c1f, which matches. I also read both gate 1 reports on main whole.

## Correctness
None. C1 is closed at the head:
- `node scripts/adrIndex.mjs --check` exits 0: "adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line".
- CI's `verify:adr-index` step at f6168c99 logs the same line.

## Evidence
None open for this gate. The Guardian tests (gate 1's E1) are with the human under the brief, so they are not judged here.

## Documentation
None. One observation that is not a finding: the new parenthetical says "phase 1's commit", but `wip/governance-f-scripts` holds two phase 1 commits, e91bcf30 and 810f6f15. The hash in the comment names the commit exactly, and e91bcf30 is the one that holds the tests, so the sentence is true as written.

## Check 1: the merge 563cb209
- **Parents and base.** 563cb209's parents are 494cea7b and ac89960e. `git merge-base 494cea7b ac89960e` gives 51a2cbad (P), rc 0.
- **Main's commits since P:** a1ed4c54, 72771a33 and ac89960e, rc 0.
- **Same file set.** `git diff --name-status 51a2cbad ac89960e` (rc 0) and `git diff --name-status 494cea7b 563cb209` (rc 0) list the same 11 files. The only difference is that the root `CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md` and `PLAN.yaml` appear as `governance/…`. Nothing else came in.
- **State files.** I compared blob ids at 563cb209 and at ac89960e. All six `state/` files are equal: CUT-STATE.md, gate-log.json, the two worker reports and the two gate 1 reports.
- **PLAN.yaml, by my own script** (`pf-g2r-plan.mjs`, rc 0). It applies `rewriteGateLines` to `ac89960e:PLAN.yaml`, using the map from `563cb209:governance/MOVED.tsv`:
  - 162 gates, 160 rewritten.
  - The result is byte-equal to `563cb209:governance/PLAN.yaml`.
  - A second pass rewrites 0, so the rewrite is idempotent.
  - The head's PLAN.yaml is equal to the merge's.
- **MOVED.tsv is unchanged.** `git diff --quiet` gives rc 0 for 494cea7b..563cb209 and rc 0 for 563cb209..f6168c99.
- **Generated files at 563cb209,** in a local clone in the OS temp folder:
  - `queue.mjs --check`: rc 0, "CUSTODIAN-QUEUE.md/.json are current."
  - `site.mjs --check`: rc 1 at first. That was an artifact of my clone, whose origin was a local path, so the site's repo slug was wrong. Re-run with `--repo christopherdonini/spatial-ide`: rc 0, "site/ is current."
  - `moved-map.mjs --check`: rc 0.

## Check 2: the correction commit f6168c99
By my own script (`pf-g2r-corr.mjs`). It ran rc 1 on one false FAIL: I had searched for the marker `adr-index:start`, but the file's marker is `adr-index:begin`. Re-run with the right marker (`pf-g2r-blk.mjs`): rc 0. Every other assertion was OK.
- **Size and shape.** 13 files, +33 −33. Every hunk replaces line for line. The file set is exactly the files the findings name.
- **`docs/README.md`.**
  - The changed lines are exactly 54, 60, 64, 65, 69, 70, 71 and 72, and each is byte-equal to main's (ac89960e) line.
  - The whole adr-index block (lines 35 to 74) is byte-equal to main's.
  - At the head, the file differs from main only at lines 27 and 28. Those two lines are kept as they were at the merge.
- **`governance/README.md`.** Only lines 12, 19, 23, 29 and 32 changed.
  - Line 12 is the architect's D2 words (architect report line 34).
  - Line 19 is the architect's D1 words (line 30).
  - Line 29 is the architect's D3 words (line 38), and its tail is the reviewer's D3 words (reviewer report line 71).
  - Line 32 is the reviewer's C3 words (line 34).
  - Line 23 keeps its prefix and replaces only the last sentence, which was "`node scripts/plan/moved-map.mjs plan` prints where rule R would place each form that is tracked now.", with the reviewer's C2 words (line 22).
  - Each comparison is a byte comparison.
- **`.claude/agents/worker.md`.** Only line 15 changed: `(AI_DEVELOPMENT.md` became `(governance/AI_DEVELOPMENT.md`, a path-only edit (architect D4).
- **The three header comments** (reviewer D1):
  - The changed lines are `movedMap.mjs:5`, `moved-map.mjs:6` and `forms-layout.mjs:6`, one line in each file.
  - Each line's old path is replaced by MOVED.tsv's new path for the form row, `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`, and nothing else changes.
- **The sixteen parentheticals** (reviewer D2):
  - All 16 named lines changed, and only those.
  - Each `(the commit holding this test)` is replaced by the reviewer's words (report line 66) and nothing else. No old parenthetical is left in the seven files.
  - The words are still true:
    - `git merge-base --is-ancestor e91bcf30807a f6168c99` gives rc 1, so the branch does not contain the commit.
    - `git branch -a --contains` names only `wip/governance-f-scripts` and its origin copy.
    - `gh api …/branches/wip/governance-f-scripts` gives rc 0, so the branch is still on origin.

## Check 3: the proof at the head
Run in a local clone at f6168c99. The clone's porcelain was empty after every run.
- **`frontends/shell`: `node scripts/adrIndex.mjs --check`.** rc 0, PASS, 34 ADRs.
- **`node --test` over the plan, hooks and evidence tests.** rc 0. 589 tests, 589 pass, 0 fail.
- **`verify.mjs --offline`.** rc 1 at first, on site drift, for the same origin-slug reason as in check 1. I set the clone's origin URL to the GitHub URL (a config change in my own clone, no fetch) and re-ran: rc 0, "verify:plan PASS".
- **`verify-cites.mjs`.** rc 0. 2523 files, 78 loose references advised. Gate 1 had 2519 files; the 4 extra are the state files the merge brought in from main.
- **`verify-quotes.mjs`.** rc 0, in 402 s. "132 checked, 101 verified, 30 baselined, 1 advisory, … 0 hash-reference errors (2 hash-baselined) … 887 ruling cites resolved". These counts are identical to gate 1's.
- **`verify-test-claims.mjs`.** rc 0. 695 claims across 214 files.
- **`moved-map.mjs --check`.** rc 0.
- **`forms-layout.mjs`.** rc 0, 178 files.

## Check 4: CI
- **Checks.** `gh pr checks 270` first gave rc 8, with the Windows cargo job pending. I waited with a loop that slept 30 s per turn against a 560 s deadline; the run completed with success at 11:36:57Z. A second `gh pr checks 270` gave rc 0: 13 of 13 checks pass.
- **Every run is at the head.** `gh run view` gives head sha f6168c99 for all of them:
  - 40864351570 Rust (pull_request): ubuntu and windows both success.
  - 40864345098 and 40864351532 Governance (push and pull_request): success.
  - 40864351476 DCO: success.
  - 40864354203 Exposure scan: success.
  - 40864345148 and 40864351489 Ported notices: success.
  - 40864351533 Shell: success. The `verify:adr-index` step logged "adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line", and both jobs were success.
  - 40864351751 Viewer: success.
- **The PR.** The head is f6168c99, it is MERGEABLE, and it is still a draft.
- **Main has moved one commit** to 5a827c1b. That commit touches only `state/CUT-STATE.md`, which the branch holds at ac89960e's bytes. This is a condition for the click, not a finding of this gate.

## Disclosures and cleanup
- **Writes.** I wrote only to my scratch folder, under `pf-g2r-` names, and to one local clone `pf-g2r-clone` in the OS temp folder (core.longpaths set; origin URL set as above, with no fetch). The clone is removed.
- **No background shell is running.** The verify-quotes run and the CI wait loop were each moved to the background by the harness after 180 s, and both exited with code 0.
- **Clean state.** The worktree `C:/dev/wt/pf` is at f6168c99 with an empty porcelain. I made no commit, push, PR action or cargo call, and ran no `claude` command.
- **Not this gate's.** The README's words, the architect's D5 and D6, the reviewer's D4 (closing-amendment items) and the Guardian tests are with the human or the closing record, as the brief says.
