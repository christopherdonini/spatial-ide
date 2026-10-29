Reviewed: PR #270 at 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2 (M a8ae51d9, P 51a2cbad), gate 1, reviewer
Verdict: FAIL
Branch: cut/governance-f-tidy-repository-in-place @ 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2. I read my brief whole first: its sha256 is c57e49cefcf0d51da58a0a3d09b21839166c181b4bc15e27dd41a7e19923b66b, which matches.

M is sound: 188 R100 renames, equal to rule R at P. Section 5's proof holds for verify-cites, verify-quotes and verify-test-claims. The gate fails for three reasons:
- **Product CI for the shell is red at this head.** C2 path-edited eight generated rows of the ADR index in `docs/README.md`.
- **Two sentences in `governance/README.md` are untrue of the code.** Exact replacement words are below (AUTONOMY §31).
- **Two of section 9's suites have no green run at this head:** the Guardian tests (never run) and the shell suite (its CI job stopped early).

## Correctness (blocking)

**C1. Product CI for the shell fails at 494cea7b (run 40855847408).** Step `verify:adr-index`, byte-copied from the log: "adrIndex: FAIL -- docs/README.md's ADR index has drifted: the committed row does not match the ADR's own Status line for ADR-016, ADR-022, ADR-026, ADR-027, ADR-032, ADR-033, ADR-034, ADR-035."
- **Where:** `docs/README.md:54`, `:60`, `:64`, `:65`, `:69`, `:70`, `:71`, `:72` at C2.
- **Cause:** these rows are generated from each ADR's Status line. The ADRs are immutable and not edited, and still name `DECISIONS-PENDING.md`.
- **Reproduced:** `node scripts/adrIndex.mjs --check` in `frontends/shell` exits 0 at P and 1 at C2.
- **Fix:** restore those eight lines to P's bytes and keep the edits at lines 27 and 28. I tested exactly that in my clone: rc 0, "adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line". The clone was then restored byte-equal.
- **Record:** the PR body or closing record should say that the OPEN-7 edit of `docs/README.md` covers lines 27 and 28 only.
- **Consequence:** this is a check that passed at P and fails at C2 (section 8 item 7). The shell job stopped at this step, so the rest of the shell's `npm run verify` and its vitest did not run at this head (see E2).

**C2. `governance/README.md:23`, the last sentence, is untrue of the code.** It is the worker's wording, not the human's.
- **What the code does:** at C2, `node scripts/plan/moved-map.mjs plan` exits 1 with "root entry "governance" has no row under rule R". `ROOT_STAYS` (`scripts/plan/moved-map.mjs:36-40`) does not hold `governance`.
- **Replacement words (mine):** "`node scripts/plan/moved-map.mjs plan` derived the move from rule R at the move commit's parent; in a tree that already holds `governance/` it stops, naming that root entry as one rule R does not place."
- **Clause check:**
  - "derived the move at the parent": check 1 below; `plan` at P equals M's 188 rows.
  - "stops, naming that root entry": `planRows` pushes the problem `root entry "${e}" has no row under rule R`, and `main` prints FAIL and sets exitCode 1. I observed this at C2 (rc 1).
- **Alternative:** add `'governance'` to `ROOT_STAYS`. That is a code change, outside §31, and needs the gate to check it.

**C3. `governance/README.md:32` claims more than verify-cites does.** It is the worker's wording.
- **What the code does:**
  - verify-cites reads only `path:line` cites.
  - Its post-move fault is gated only when the map hit is exact: `(res.mapped.exact ? sink : advisory)` in `scripts/plan/verify-cites.mjs`.
  - The sink is advisory under `ARCHIVED_PREFIXES` (`state/drafts/`, `state/consults/gates/`).
- **C2's own lines show the gap:** the three header comments in D1 name the form by its old path after the move, and C2 passes verify-cites.
- **Replacement words (mine):** "- An unpinned `path:line` cite to an old path, on a line written after the move (uncommitted, or in a commit that has the move commit as an ancestor), fails `node scripts/plan/verify-cites.mjs` by name when it names the moved file exactly: a path with a folder, or a name relative to the citing file's folder (its folder before the move, for a moved file). A bare file name from another folder, and such a cite in a file under `state/drafts/` or `state/consults/gates/`, is reported as advice instead; a path written without a line is not checked. Cite the new path."
- **Clause check:**
  - "unpinned": pinned cites take `checkCitation(..., cite.pin ? undefined : map)`.
  - "written after": `postMoveChecker.writtenAfter` (the `0{40}` sentinel, or `isAncestor(root, row.commit, sha)`).
  - "exact": `resolveMoved` tries `[p, true]` when p has a slash, `[rel, true]` from `originPath`, and `[p, false]` for a bare name.
  - "advice in state/drafts, gates": `ARCHIVED_PREFIXES`.
  - "without a line": the cite grammar is `path:line`.
- **How to apply (C2 and C3):** none of this is the human's wording, so the worker applies these words with no re-gate and the PR body lists them.

## Evidence (blocking)

**E1. The Guardian tests were not run at C2, by the worker or by me.** They need `claude plugin test`, and the `claude` command is forbidden to both of us. Section 5 ("Tests") and section 9 ("Suites") require them.
- Static reading: no file under `tools/mods/spatial-guardian` changes in M or C2. A grep of its code and tests finds no moved root path; its forms are only named in comments, and its fixtures are synthetic. So no change is expected.
- **Fix:** the custodian runs `claude plugin test tools/mods/spatial-guardian` at the fixed head and records the result.

**E2. No green run of the shell's `npm run verify` or of product-ci-shell exists at this head** (C1 stopped it). Section 9 requires both.
- **Fix:** after C1 is fixed, CI on the new head with both jobs of product-ci-shell green.

## Documentation (must-fix before the merge)

**D1. Three header comments that C2 writes name the form by its pre-move path:** `scripts/plan/movedMap.mjs:5`, `scripts/plan/moved-map.mjs:6`, `scripts/plan/forms-layout.mjs:6`. This is section 8 item 8 as written; verify-cites misses them because they carry no line.
- **Fix:** replace `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md` with `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`. That is M's row in MOVED.tsv.

**D2. Sixteen test comments read "RECORDED MUTATION at e91bcf30807a (the commit holding this test)".** e91bcf30 is not in C2's history: `git merge-base --is-ancestor e91bcf30807a 494cea7b` gives rc 1. It sits only on `wip/governance-f-scripts`.
- **Where:**
  - `scripts/hooks/hooks.test.mjs:1419`
  - `scripts/plan/forms-layout.test.mjs:32`, `:42`
  - `scripts/plan/moved-map.test.mjs:18`, `:32`
  - `scripts/plan/site.test.mjs:630`
  - `scripts/plan/verify-cites.test.mjs:644`, `:654`, `:664`, `:674`, `:685`, `:698`, `:709`
  - `scripts/plan/verify-quotes.test.mjs:1159`, `:1174`
  - `scripts/plan/verify.test.mjs:338`
- **Replacement words (mine), for the parenthetical:** "(phase 1's commit, on the branch wip/governance-f-scripts; this branch carries the test from it by patch and does not contain the commit)".
  - Checked: `git branch -a --contains` names only that branch. Amendment 1 and the build report state the carry by path and by `git apply --3way`.
- **Also:** keep `wip/governance-f-scripts` on origin, so the named commit stays reachable.

**D3. `governance/README.md:29` lists the map's readers without verify-test-claims** (Amendment 4).
- **Replacement words (mine):** "`scripts/plan/verify-cites.mjs`, `scripts/plan/verify-quotes.mjs`, `scripts/plan/verify-test-claims.mjs`, `scripts/plan/verify.mjs` and `scripts/plan/site.mjs` read the old path through `MOVED.tsv` and open the file where it is now."
- **Clause check:** verify-test-claims imports `loadMovedMap` and `currentPath`, and `samePinnedPath` compares through the map. Its reads at a pin follow the next bullet's rule, through `pathAtPinnedRev`.

**D4. T2's observed failure differs from section 4's prediction.**
- Section 4 predicts the reason stops naming the new path. Under the mutation, the gated set is empty, because the suffix tier turns the finding into advice. The test's own comment says the same.
- **Fix:** the closing amendment records the observed failure. As a reference only: the form is append-only.

## For the human (the human's words)

- **Amendment 2, third bullet.** It reads line 8 of the 2026-10-29 ruling ("Piece F moves the file, nothing more.") as about §37 only. C2 appends a pointer to `governance/AUTONOMY.md`; that rests on your OPEN-7 (C). No finding; if you meant line 8 for the whole file, the pointer comes out.
- **The README's words are yours to approve.** I checked them as follows:
  - Kept sections against P, by sha256 of the line spans: Install (37-52 at P, 70-85 at C2), First five minutes, Local-first, License, Contributing, and the vision lines 3-7. All are equal.
  - Proposed words of mine, only if you want the map complete: "`scripts/` — the plan's checks, the session hooks, the evidence tools, the licence and notice audits, and measurement scripts (`scripts/run-cold-open.ps1`)." Checked against `git ls-tree 494cea7b scripts/`: `check-ported-notices.mjs`, `summarize-*.mjs` and `run-cold-open.ps1` are there and the current bullet leaves them out. `tools/` also holds `make-standalone-bundle.mjs`, which its bullet does not name.

## Checks

**1. M, by my own script.**
- `git diff --name-status -M100% P M`: 188 lines, 0 not R100; shortstat 0 insertions, 0 deletions.
- Per row: all 188 blobs and basenames equal.
- Check 3 as Amendment 3 states it: the oldest commit of `--follow` equal on both sides, and the commit lists equal with M excluded. 0 failures. Script rc 0.
- Rule R at P, by `moved-map.mjs plan --all` extracted from C2 (rc 0): "188 rows move, 34 stay". It equals section 2.1's 186 rows plus Amendment 1's two delta rows, and M's 188: 0 mismatches, 0 collisions, comparison rc 0.

**2. C2 against section 2.2.**
- Size by section 7's command: 45 files, +1298 −244 = 1542 lines. PLAN.yaml: 160+ / 160−.
- File list: every file is in the table, the settlement's OPEN-7 rows, Amendment 1 (`movedFixture.mjs`) or section 4's tests (`site.test.mjs` holds T16).
- **Path-only, by my own script.** I paired every −/+ line outside the logic and generated files. The only non-path items are the build report's list:
  - the governance-ci filters and its two steps
  - the CLAUDE.md bullet
  - the AUTONOMY pointer
  - the three `join` lines in `citationIntegrity.test.mjs`
  - `Set-Location` in `run-cold-open.ps1`
  - the `mkdir` lines
  - the two `DECISIONS-PENDING.md ${FELT}` cites
  - the escaped-regex path edits in `hooks.test.mjs` and `rotate-decisions-pending.test.mjs`
  - the appended tests
- **Not touched:** no record (no `state/` file, no form, no ledger), neither append-never list, nothing under `tools/mods/spatial-guardian`, `governance/RELEASE-DAY-CHECKLIST.md`, `LICENSES/README.md`.
- **Agent definitions:** changes only at `architect.md:11/15/17/19` and `reviewer.md:25/29/31/33`. Each is a backticked path token outside any quoted span, checked by word diff. No backticked old root name is left in the agent files, CLAUDE.md, CONTRIBUTING.md, `docs/README.md` or the template.
- **MOVED.tsv:** `file` reports ASCII, 0 CR; 189 lines; header plus 188 rows on one commit. `moved-map.mjs --check` rc 0; `forms-layout.mjs` rc 0 (178 forms).
- **PLAN.yaml gates:** I re-ran `rewriteGateLines` on P's file with C2's map: 162 gates, 160 rewritten, byte-equal to C2's file, idempotent. The two left are `scripts/plan/DRAFT-4-landing-page-design.md`, which is not a moved path.
- **Queue and site:** P to C2 differ only in `plan_hash`, the stamps and the seven evidence links.
- **Section 8 item 11:** the open PRs are #270 and #269. #269 (3 files) shares no file with C2. It edits `kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md`, which M moves; direction item 5 sets rule (00) aside for M.

**3. The logic.**
- **Resolution matches section 2.3, OPEN-5 (A) and OPEN-6 (A).** The map comes before the exact and suffix tiers and keeps the tier of the path as written. A moved citer resolves from its pre-move folder. The post-move check uses blame plus ancestry. verify-quotes reads `pathAtRev`. verify-test-claims compares through the map. verify and site map evidence paths and verdict cites. The site default is `REPO_ROOT/site` in all three scripts.
- **Section 8 item 15, by my own script over all 2,519 scanned files:**
  - 773 pinned cites changed resolution route at C2:
    - 283 are now read at their pin instead of at HEAD;
    - 477 resolve by the suffix tier to the same file;
    - 13 are bare `README.md` cites with one more candidate.
  - 0 changed pass or fail.
- **Suite:**
  - At C2: 589 pass, 0 fail. The hold line ended in `exit`, so rc was not printed; the summary reads fail 0.
  - At P: rc 0, 570 pass.
  - Before-names are a subset of after-names. The 19 added names are byte-equal to the form's section 4 names (no T17) plus T18 and T19 (diff rc 0).
- **Mutations**, each alone, in turn, on a local clone at C2. Each run had the unmutated test passing first, then the test failing by name, and the file restored equal by sha256:
  - T2: gated empty
  - T3: gated empty
  - T5: "cited after the move" reported for a branch forked before the move
  - T6: the pinned cite routed into the post-move fault
  - T8: "git show failed"
  - T13: "RELEASE-0.1.md does not exist"
  - T14: the allow-with-no-plan path, "allow: no PLAN.yaml at …"
  - T16: wrong site folder
  - T18: the claim reported as not found
  - T19: "refused: hash does not recompute"
- All rc 1 under mutation; `git status --porcelain` was 0 after.

**4. Section 5's proof.** Own clones at P and C2, both in shared holds, both released.

| Check | P | C2 |
|---|---|---|
| verify-cites | rc 0, scanned 2512 | rc 0, scanned 2519 (P plus 7) |
| verify-test-claims | rc 0 | rc 0 |
| verify-quotes `--show-cites` | rc 0 | rc 0 |
| `verify.mjs --offline` | rc 0 | rc 0 |
| `site.mjs --check` | rc 0 | rc 0 |
| `queue.mjs --check` | rc 0 | rc 0 |

- **verify-cites:** 78 advisories on each side; the output sets are equal after mapping both sides, except the scanned line.
- **verify-test-claims:** stdout and stderr equal after mapping. 695 claims across 214 files; 43 planned, 11 superseded, 17 withdrawn.
- **verify-quotes:**
  - Counts identical: 132 checked, 101 verified, 30 baselined, 1 advisory, 2 hash-baselined, 887 ruling cites, 214 scanned, 8126 cites, 6403 hash PASS, 0 FAIL.
  - The listing's cite, target and hash keys are equal after mapping. The 153 lines that differ are first-line text of unpinned cites into the 14 files C2 edits, plus two README.md candidate counts (44 to 45).
- **Measurement:** (a) 59 at P, 32 at C2; (b) 206 at P, 46 at C2. Forms outside `governance/forms/` and `state/` at C2: 2, both on OPEN-1's list.
- **verify-cites wall time:** P 7280 ms, C2 26388 ms. One run each, with the two sides running at once: a fact, not a measurement.
- **Not run by me:** online verify, measure-reads, the live hooks run (T14 and T15 cover them in the suite), and the Guardian tests (E1).

**5. CI.** `gh pr checks 270` gives rc 1 (one failure). Every run's head sha from `gh run view` is 494cea7b, event push.
- governance-ci (40855847329): success. Both new steps ran and passed: "governance/MOVED.tsv equals its regeneration…" and "preregistration forms sit under governance/forms/ or state/…". The plan job took 2m37s, within its 15-minute limit.
- product-ci-rust (40855847300): success, on ubuntu and windows.
- product-ci-viewer (40855847176): success.
- product-ci-shell (40855847408): failure (C1). Its tauri build passed.
- **Condition for the click:** the PR is CONFLICTING. Main is at 72771a33, two custodian commits past P, and both touch the root `PLAN.yaml`, the queue, the site and `state/CUT-STATE.md`. Section 9 then requires merging main, re-running R and `rewrite-gates`, and redoing the proof. This gate's results hold at 494cea7b only.

## Disclosures and cleanup

- **One rule breach:** one `git ls-remote --heads origin wip/governance-f-scripts`. It is a read-only network read through git, not `gh`, against the brief.
- **Scratch and temp writes:**
  - My first clones under the scratch folder failed on Windows' path-length limit and were removed. I recloned into the OS temp folder with `core.longpaths`.
  - One file written to the OS temp folder was removed.
  - In my own clones only, I set the origin URL to GitHub, a config change with no fetch.
- **Background shells:** three. Both proof runs and one wait loop exited on their own (exit 0); none is left. A process filter shows no node process with my clones on its command line.
- **Clean state:** the three clones are removed. The worktree is at 494cea7b with an empty porcelain. My scratch files all start with `pf-g1r-`.
