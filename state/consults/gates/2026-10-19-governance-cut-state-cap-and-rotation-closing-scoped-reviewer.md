Reviewed: PR #229's closing amendment (Amendment 8) at 521fc031ed049fcda4a8c563aa1cd80799918ec9, scoped to its items 1 and 4 to 10 (commits and hashes)
main @ 521fc031ed049fcda4a8c563aa1cd80799918ec9
Verdict: PASS

All eight checks agree with Amendment 8, items 1 and 4 to 10. There are no findings.

## Findings
- **Correctness:** none.
- **Evidence:** none.
- **Documentation:** none.

Three things to know, none of them a finding:
- **The Pages deploy job.** Its status is still `waiting` with no conclusion when I read it, after the amendment's own read at 16:09Z. Item 10 already says its conclusion will be read again at the done commit, so that read is still owed.
- **Item 8's hook line.** Item 8 gives F's hook stderr as text, not as a hash. The saved `F-E-hook.err` matches that line plus one LF byte for byte (cmp exit 0); its sha256 is 005b120a4e345309e4ced9b0c394fbc9b6928da41ab7b4c8e3063427aa3a5d42.
- **Item 4's script run.** No saved file records the exit code of the rotation script itself ("exited 0 on main at 4b2a9976"). Its result is proven instead: R's parent is 4b2a9976, and the blob ids and the rebuilt ledger match byte for byte (check 2).

## The checks
1. **Commits (item 1, §2 item 10): pass.**
   - `gh pr view 229` gives mergedAt 2026-10-19T12:56:02Z and merge commit 4b2a99767a7633b838b4eef178848bf08c71b9f6.
   - The merge's parents are bc0d1e9fbead1c49a0c3c5cc782f257b9950323b ((b), the first parent) and ab0532e7e8b9e99650ad10595ba72462ba8f7703. Main took no commit between (b) and the click.
   - `git log --first-parent --reverse bc0d1e9f..521fc031` lists, in order, the merge 4b2a9976…, then R d86ebac7…, then F d4ab5c72…, then 521fc031… and nothing else.
   - 521fc031 is the commit that adds Amendment 8: the form at F has no "Amendment 8", and the form's newest commit is 521fc031.
2. **R (item 4, E3): pass.**
   - `git diff --no-renames --name-status R^ R` lists exactly `M state/CUT-STATE.md` and `A state/cut-archive/CUT-STATE-2026-10-19.md`.
   - Both blob ids are 5d3f326d993c633e1308a213ffaabb5aac42f2e3, the amendment's id.
   - `buildRotatedLedger({oldText: <R^'s ledger>, name: 'CUT-STATE-2026-10-19.md', commit: 4b2a9976…})` equals R's ledger byte for byte: 4,396 bytes each.
   - R is signed off and its parent is 4b2a9976.
3. **F (item 8): pass.**
   - R to F changes only `state/CUT-STATE.md`.
   - F's ledger has `flushed_at: 2026-10-19T15:31:22Z` (line 2) and `tip: d86ebac73aa271625934b1d075bd87edd60c30d8` (line 3).
   - With the eight field lines (lines 2 to 9, labels checked) masked, R's ledger is a prefix of F's and ends `## Ledger\n`. F adds 2,946 bytes after it. Neither file has a CR byte.
   - F is on origin/main.
4. **Predicate (items 5 and 8): pass.** `judgeContinuity` was imported from each worktree's own `continuity.mjs`, with a `run(args)` that spawns git in that worktree.
   - At R: `{"judged":true,"stale":true,"flushedAt":"2026-10-18T12:12:15Z"}`. At F: `{"judged":true,"stale":false,"flushedAt":"2026-10-19T15:31:22Z"}`.
   - My outputs are byte-identical to the saved `R-E-pred.out` and `F-E-pred.out` (cmp exit 0). Their sha256 are 5ed83e5b… and cba31384…, as in the row files.
   - `git log -1 --format=%H HEAD -- state/CUT-STATE.md` prints R at R and F at F.
5. **Hook (items 5 and 8): pass.**
   - The freshness rule (`checkFreshness`, header lines 17 to 23) is fresh only when all of these hold:
     - `flushed_at` is at most 10 minutes old (`FLUSH_FRESHNESS_MS`);
     - `flushed_at` is not before the `%cI` of the newest ledger commit below HEAD (`HEAD~1`);
     - `tip` equals HEAD, or HEAD's parent when HEAD changes only `state/CUT-STATE.md`;
     - no tracked file is modified;
     - `@{u}` resolves and HEAD is an ancestor of it.
   - A manual trigger blocks (exit 2) when the ledger is stale, unless the same session was blocked within the last 15 minutes.
   - `R-E-hook.err` sha256 is 348c23b4018f297a4318b1fccd0d532e47ecfb303388262e74e652a2d563050b, which matches item 5. It has two lines, the first `block: flushed_at is more than 10 minutes old`.
   - `F-E-hook.err` is exactly item 8's line plus LF.
   - E7 at 15:35:53Z is 271 s (4 min 31 s) after `flushed_at` 15:31:22Z, within 600 s.
   - The row files give: R hook rc=2 with empty stdout and 2 stderr lines; F hook rc=0 with empty stdout and 1 stderr line.
   - F is fresh under the rule. Its tip is R, which is F's parent, and F is ledger-only. R's commit time, 15:27:05Z, is before 15:31:22Z.
6. **session-resume (items 6 and 9): pass.**
   - Both runs exit 0, with 23 stdout lines and empty stderr.
   - The saved `R-E-resume.out` hashes to 83ae8973…3dee and `F-E-resume.out` to 351898d3…b748, both matching the amendment.
   - My stdout hashes differ (705a84be… at R, d8fce08d… at F). The only differing line is line 23:
     - R: `Resume facts: block_age_min=1635` became `1686` (`commits_past_tip=21 modified_tracked_files=0` the same).
     - F: `block_age_min=4` became `47` (`commits_past_tip=1 modified_tracked_files=0` the same).
   - That is the time-dependent line, as expected.
7. **verify-cites and verify-quotes (items 7 and 10): pass.**
   - All four runs exit 0.
   - The cites stdout is ce4210fbf5adaccad083b99625d7828f5e0a14a56fe7505168d2686aa41f29ef at both R and F; the quotes stdout is 4b348e921b6d8ecd2bc6db3f992ee9c6e257822d904f474d939f30208ded9605 at both. All four match the amendment.
   - The stderr of all four is also byte-identical to the saved `.err` files (45 and 36 lines).
8. **CI (item 10): pass.**
   - At F (d4ab5c72…): run 39279219930 Exposure scan, success; run 39279219927 Ported notices, success.
   - Run 39279219906 Pages has status `waiting`. Its gate job `verify:plan (gate) · generate site/ · upload artifact` is completed, success. Its job `deploy to GitHub Pages` is waiting with no conclusion.
   - `gh run list --commit F` shows exactly these three runs, so "every workflow its push started" holds.
   - Governance CI run 39255937194 is success at headSha 4b2a9976… (the merge), and its verify:cites and verify:quotes steps are success.
   - Governance CI's push `paths` (`.github/workflows/governance-ci.yml`, `on:` block) do not include `state/**`, which agrees with "path-filtered and does not run on a ledger-only commit".

## Every command, with its exit code
All were run in the foreground with a timeout of at least 300 s, output redirected to files in my scratch folder `…/scratchpad/rev229/`.
- `git fetch origin` 0; `git rev-parse main origin/main HEAD` 0 (all 521fc031…)
- `gh pr view 229 --json mergedAt,mergeCommit` 0
- `git rev-list --parents -n 1 4b2a9976…` 0
- `git log --first-parent --reverse --format=%H bc0d1e9f..521fc031` 0; the same with `%H %cI %s` 0
- `git rev-parse bc0d1e9f d86ebac7^ d4ab5c72^ 521fc031^` 0
- `git log --format='%H %s' -3 -- <form>` 0; `git show d4ab5c72:<form>` 0; `grep -c "Amendment 8"` on it 1 (count 0, which is the expected result); `git diff --stat d4ab5c72 521fc031` 0
- `git diff --no-renames --name-status R^ R` 0; `git rev-parse R^:state/CUT-STATE.md` 0; `git rev-parse R:state/cut-archive/CUT-STATE-2026-10-19.md` 0; `git show R^:state/CUT-STATE.md` 0; `git show R:state/CUT-STATE.md` 0; `git rev-parse R^` 0
- `git diff --name-only 4b2a9976 521fc031 -- rotate-cut-state.mjs flush.mjs session-resume.mjs` 0 (empty)
- `node c2-build.mjs` (`buildRotatedLedger` byte comparison) 0
- `git log -1 --format=%B R` 0; `git branch -r --contains F` 0
- `git diff --name-only R F` 0; `git show F:state/CUT-STATE.md` 0; `grep` of the two fields 0; `grep "^## "` on F's and R's ledgers 0 and 0; `grep` of the labels in `flush.mjs` 1 (no match, informational only)
- `node c3-cmp.mjs` (masked-prefix comparison) 0
- `ls -d` of the two worktree paths beforehand 2 (they did not exist); `git worktree add --detach C:/dev/wt/rev229-r R` 0; `git worktree add --detach C:/dev/wt/rev229-f F` 0; `git rev-parse HEAD` in each 0 and 0
- `node c4-pred.mjs` at R 0; at F 0; `git log -1 --format=%H HEAD -- state/CUT-STATE.md` at R 0, at F 0; `git config --get core.autocrlf` 0 (false)
- `ls -la erows` 0; `sha256sum R-E-hook.err F-E-hook.err` 0; `sha256sum` of the four predicate outputs 0; `cmp` R predicate 0; `cmp` F predicate 0; `cmp` of F's hook line 0; `node` E7 time delta 0
- session-resume at R 0 and at F 0. Stdin was `printf '{}'` written to a file and redirected, not piped, so that the exit code reported is node's own.
- `sha256sum` of the resume outputs 0; `diff` at R 1 and at F 1 (differences found, listed in check 6)
- `verify-cites.mjs` at R 0; `verify-quotes.mjs` at R 0; `verify-cites.mjs` at F 0; `verify-quotes.mjs` at F 0
- `sha256sum` of the verify outputs 0; `wc -l` of the stderr files 0; four `cmp` of stderr against the saved files 0, 0, 0, 0
- `gh run view` 39279219930 0; 39279219927 0; 39279219906 0; 39255937194 0; `gh run view 39279219906 --json jobs` 0, summary `node` 0
- `gh run list --commit F` 0; `gh run list --commit R` 0; `ls .github/workflows` 0; `grep -l "Governance CI"` 0; `sed -n 1,45p governance-ci.yml` 0; `gh run view 39255937194 --json jobs` 0, step `node` 0; `grep -A25 "^on:"` 0
- Cleanup:
  - `git status --porcelain` in both worktrees 0 (clean);
  - `git worktree remove` of both 0 and 0;
  - `git worktree list` 0, with no rev229 entry left;
  - main's `git status --porcelain` 0, showing only the two pre-existing untracked entries, and HEAD is still 521fc031.

I made no commit, push or PR action, ran no `claude` command, and edited nothing tracked. I wrote only inside my scratch folder and the two temporary worktrees, which are now removed. I did not run `precompact-flush.mjs`.
