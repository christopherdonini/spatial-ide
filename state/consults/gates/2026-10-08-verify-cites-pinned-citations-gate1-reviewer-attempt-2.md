# PR #191 gate 1 attempt 2 — reviewer (single gate)
Reviewed: cut/verify-cites-pinned-citations @ 2d684ad5bcc1155a1cce568633cdf3342db33ec7

**Verdict: PASS.** No Correctness or Evidence finding blocks. C1 and C2 are fixed, and so are D1 and D2. The out-of-range test I suggested in attempt 1 is now P6, and its mutation was observed. There is one low Correctness finding (C3), which does not block. There are two Documentation findings (D4, D5) to fix in this PR before the merge, with no re-gate. D3 stays with the closing record, as the brief directs.

Base: ed396e94. The diff `origin/main...origin/cut/verify-cites-pinned-citations` touches 2 files, both in the Scope:
- `scripts/plan/verify-cites.mjs`: 45 lines added, 7 removed;
- `scripts/plan/verify-cites.test.mjs`: 94 lines added.

That is 146 changed lines out of the 150 allowed. `git diff --check` is clean, and all four branch commits carry a Signed-off-by.

Amendment 1 (63b1ec76, on main, committed 2026-10-08T17:32:36+02:00) comes before the fix commit 7f332caf (17:35:24+02:00). The form's Amendment 1 is read from origin/main. The branch does not carry the form.

## Out-of-scope line (read first)
The line is unchanged and still true: "ADR none; security none; wire none; guarantee none". The change touches one governance checker and its tests. There is no product file, no workflow, no `protocol/` and no ADR. The 15 tests that existed before the piece pass unchanged. No §21a category is touched, so the single gate applies. Amendment 1 item 6 keeps the Scope and this line.

## Attempt-1 findings: status
| Finding | Status | Proof at 2d684ad5 |
|---|---|---|
| C1: a pinned directory path passes | **Fixed** | The pin is read with `git cat-file blob` at `scripts/plan/verify-cites.mjs:267`. A tree is told apart with `cat-file -t` (line 269) and fails with the reason "is a directory at pinned commit" (line 270). Test P5 asserts it, and its mutation (`show` for `cat-file blob`) fails P5 alone. |
| C2: a failing pin's "not found" replaced a true tree reason | **Fixed** | Line 340 keeps the tree's reason when the pin returns `missingFile` and the tree found a file. The m1 run: the architect-draft's advisory entries at its lines 139 and 145 again give the tree's reasons, "line 2006 exceeds frontends/shell/src/App.tsx (1997 lines)" and "line 2020 exceeds frontends/shell/src/App.tsx (1997 lines)". The advisory sets from main's checker and the branch's are identical on m1, vcp and the main checkout. |
| Suggestion: a test for a line out of range at the pin | **Done** | Test P6. Its mutation (`\|\| maxL > lc` removed) fails P6 alone. |
| D1: the header | **Fixed** | `verify-cites.mjs` lines 14-16 state the pinned fallback. Lines 56-58 list the three limits. |
| D2: the JSDoc of `extractCitations` | **Fixed** | Lines 131-132 name `pin`. |
| D3 | Left for the closing record, per the brief | — |

## The new code against Decision B
- **No cite changes tier.**
  - Routing still depends only on `res.status`, `cls` and `archived` (lines 342-351). A pin either drops the cite, which is the ruled pass (line 338), or changes only its reason.
  - The probes in scratch repos agree:
    - a cite under `state/consults/gates/` or `state/drafts/` whose pin fails stays advisory;
    - a loose basename cite stays advisory;
    - a rooted cite stays gated.
  - main's checker and the branch's give identical gated and advisory sets on `C:/dev/wt/vcp` (0/35) and on the main checkout (0/36).
- **A git failure never crashes the checker and never passes a cite.**
  - All three git calls sit in try/catch.
  - `{ok:true}` is returned only after a blob was read and the range check passed.
  - The probes all returned `{ok:false}` with no throw:
    - PATH emptied, so git is missing (ENOENT);
    - a directory that is not a repo;
    - a tree id used as the pin ("pinned commit … not found").
- **`missingFile` and its one reader.**
  - It is set at line 271 only: the blob read failed and `cat-file -t` did not say `tree`.
  - Its only reader is line 340 (grep over the repo's `*.mjs`, `*.js` and `*.ts` files). It only chooses between two reasons and never decides pass or fail.
- **Unpinned cites are checked as today.** P4 covers this. Both P4a and P4b fail P4 alone (table below).

## The worker's three declared deviations
1. **A third test, `a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found`.** It guards C2 and can fail: my mutation (line 340 made unconditional) fails it alone. It has no RECORDED MUTATION comment, and Amendment 1 does not declare it (see D5). Accepted.
2. **`pinnedRun`, a test-file helper used only by the three new tests.** This is test scaffolding, not a `pub` item. Accepted.
3. **`missingFile`.** It has a product reader (`runVerifyCites`, line 340), and it is internal to the module. Accepted.

## Correctness
**C3 (low, does not block): when a pinned cite starts at line 0, the pin's reason is false.**
- For `engine/src/pool.rs:0-2 @ <rev>`, with a 5-line file at the pin, the gated reason is "line 2 exceeds "engine/src/pool.rs" at pinned commit … (6 lines)". Line 2 does not exceed 6 lines; line 0 is the defect.
- This contradicts Amendment 1 item 3's own claim that the pin's reason replaces the tree's only when it states something true.
- It does not block, for three reasons:
  - the cite still fails;
  - no tier changes;
  - main's tree path gives the same wording for the same input, unpinned (main: "line 2 exceeds "engine/src/pool.rs" (6 lines)"). The pin path copies a defect that is already there.
- Suggested fix, in this PR: give a reason of its own when `startL < 1` at line 275, or narrow item 3's wording in the closing record.

**Checked and correct:** the pin parse at line 149 is unchanged from attempt 1. The full edge-case list is in the attempt-1 report.

## Evidence
No blocking finding.

**The mutations, re-made by hand at 2d684ad5.** A script in my scratch folder applied each change to `scripts/plan/verify-cites.mjs` and ran `node --test --test-reporter=tap scripts/plan/verify-cites.test.mjs` with a 120 s timeout. It reverted each change with `git checkout --` and checked that `git status --porcelain` was empty after each one.

| Mutation | Change applied | Test rc | Failing tests |
|---|---|---|---|
| baseline | none | 0 | 22 pass, 0 fail |
| P1 | `if (pr.ok) continue;` commented out | 1 | `a_pinned_cite_past_the_trees_end_that_resolves_at_its_commit_passes` (only) |
| P2 | the `cat-file -e` catch returns `{ ok: true }` | 1 | `a_pinned_cite_whose_commit_does_not_exist_fails_by_name` (only) |
| P3 (head equivalent, narrow) | the `missingFile` return replaced by `text = '';` | 1 | `a_pinned_cite_whose_file_is_missing_at_that_commit_fails_by_name`, and the C2 test |
| P3 (wide) | the whole blob-read catch replaced by `text = ''` | 1 | P3, P5 and the C2 test |
| P5 | `cat-file blob` replaced by `show` | 1 | `a_pinned_cite_whose_path_is_a_directory_at_that_commit_fails_by_name` (only) |
| P6 | `\|\| maxL > lc` removed | 1 | `a_pinned_cite_whose_line_is_past_the_file_end_at_that_commit_fails_by_name` (only) |
| P4a (mine) | `cite.pin &&` replaced by `true &&`, so every non-ok cite is read at a pin | 1 | `an_unpinned_cite_past_the_trees_end_still_fails` (only) |
| P4b (mine) | unpinned cites given the pin `HEAD~1` | 1 | `an_unpinned_cite_past_the_trees_end_still_fails` (only) |
| C2 (mine) | line 340 made unconditional | 1 | `a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found` (only) |
| DIR (mine) | the `kind === 'tree'` return disabled | 1 | P5 (only) |

- P3's RECORDED MUTATION comment describes the `git show` read of 0e092a40, which is not in the head. The comment names its commit, so it is a historical record and is not read as current. At the head, the equivalent mutation still fails P3.
- P4 covers the unpinned path against both forms of "a fallback applied to every cite".

**Seam proof, re-run.** I imported `runVerifyCites` from `C:/dev/wt/vcp/scripts/plan/verify-cites.mjs`, and main's file (`git show origin/main:…` into scratch), with `repoRoot` `C:/dev/wt/m1` at m1's HEAD 65391e79b048f51f3ca4d7b5eeac7533f5b64639. The run was read-only: `git status --porcelain` in m1 gave 0 lines afterwards.
- main: gated 4, advisory 37, scanned 1513.
- branch: gated 0, advisory 37, scanned 1513. The advisory sets are identical in path, line, target and reason.
- The four cites that main gates, all `frontends/shell/src/App.tsx` pinned at `30e77c10`. `checkPinned` returns `{"ok":true}` for each:
  - `frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md:17` → `App.tsx:1649-2024`;
  - the same file's line 95 → `:1997-2006`;
  - its line 101 → `:2014-2020`;
  - `state/consults/2026-10-07-shell-migration-milestone-1-architect-draft.md:61` → `:1649-2024`.
- 30e77c10 is an ancestor of origin/main (`merge-base --is-ancestor`, rc 0).
- The advisory cites in the architect-draft file: line 139, `App.tsx:1997-2006`, gives "line 2006 exceeds frontends/shell/src/App.tsx (1997 lines)". Line 145, `App.tsx:2014-2020`, gives "line 2020 exceeds frontends/shell/src/App.tsx (1997 lines)". Both are tree reasons, so C2 holds.

## Documentation (must-fix before the merge, no re-gate)
- **D4: the header leaves out a limit of the pinned fallback.**
  - `checkPinned` reads the cite's path as written, from the repo root (line 265). It does not use the tree's own resolution:
    - a cite resolved relative to the citing file;
    - the `.md` fallback;
    - a basename suffix match.
  - My probes, on 5-line files at the pin, cut to 2 lines in the tree:
    - `src/App.tsx:4 @ <rev>`, cited from `frontends/shell/NOTE.md`, stays **gated** with the tree's reason, although the file it resolves to has 5 lines at the pin;
    - `docs/README:4 @ <rev>` stays gated in the same way;
    - `pool.rs:4 @ <rev>` stays advisory.
  - A loose pinned cite that matches nothing is never read at its pin. This behaviour is unchanged from main.
  - All of this fails closed and does not break Decision B's conditions. But the header's sentence at lines 14-16 reads as if every pinned cite is resolved at its commit. Add one clause to the "Of the pin" list at lines 56-58: the pin is read at the path as written, from the repo root, so a relative, `.md`-fallback or basename cite keeps the tree's verdict.
  - Resolving the pin with the tree's own resolution would change more than Decision B allows during the freeze. It belongs in a later piece.
- **D5: the third test is not in the form's record.** The closing record names `a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found` as an addition beyond Amendment 1's P5 and P6, with its mutation (line 340 made unconditional, observed above). It does that by reference, under the record cap.
- **D3** (attempt 1) stays with the closing record.

## Commands (cwd `C:/dev/wt/vcp` unless stated)
| Command | rc | Hold |
|---|---|---|
| `git status --porcelain`, `rev-parse`, `log`, `fetch origin`, `diff --stat`/`--numstat`/`--check` on `origin/main...HEAD`, `merge-base` | 0 | none |
| `git show origin/main:scripts/plan/VERIFY-CITES-PINNED-CITATIONS-PREREGISTRATION.md` (Amendment 1), `git log -1 --format=%cI 63b1ec76` | 0 | none |
| `timeout 120 node --test --test-reporter=spec scripts/plan/verify-cites.test.mjs` (baseline) | 0 | none (one file, light) |
| `timeout 600 node <scratch>/mut.mjs`, then `node <scratch>/mut2.mjs` (the mutations above) | 0, 0 | none (one file per run, light) |
| `timeout 180 node <scratch>/probe.mjs <scratch>/repos` (edge cases) | 0 | none |
| `timeout 60 node <scratch>/zero.mjs` (line-0 cite, main vs branch) | 0 | none |
| `timeout 300 node <scratch>/seam.mjs` (m1, main vs branch), then `git -C C:/dev/wt/m1 status --porcelain` | 0; 0 lines | none |
| `timeout 300 node <scratch>/cmp.mjs C:/dev/wt/vcp C:/dev/spatial-ide` | 0 | none |
| `cd C:/dev/wt/vcp && powershell.exe … -File <M> hold shared -Project SpatialIDE -What "verify-cites-pinned-citations gate: node --test scripts suites" -Minutes 6 -MaxWaitMinutes 5 && CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 node --test --test-reporter=tap scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs > <scratch>/suite.txt 2>&1 ; rc=$? ; powershell.exe … -File <M> release -Project SpatialIDE ; exit $rc` | 0 | shared hold granted (cores 0-7), then released; tests 457, pass 457, fail 0, 43.3 s |
| `node scripts/plan/verify-cites.mjs` | 0 | none; PASS, 1517 files, 35 advisory |
| `node scripts/plan/verify-quotes.mjs` | 0 | none; PASS, 121 checked |
| `node scripts/plan/verify-test-claims.mjs` | 0 | none; PASS, 523 claims |
| `node scripts/plan/verify.mjs` | 0 | none; PASS |
| `node scripts/plan/queue.mjs --check` | 0 | none; current |
| `node scripts/plan/site.mjs --check` | 0 | none; current |
| `node scripts/plan/cfg-boundary.mjs` | 0 | none; 18 sites, 0 outside every boundary |
| `timeout 60 gh pr checks 191` | 0 | none |
| `gh run view <id> --json headSha,event` for the four run ids | 0 | none; every run on 2d684ad5… |

Each verifier ran with `timeout 180`.

`gh pr checks 191`, every line (head 2d684ad5bcc1155a1cce568633cdf3342db33ec7, OPEN):
```
cfg boundary (PORTABILITY R2)	pass	8s	https://github.com/christopherdonini/spatial-ide/actions/runs/37802116503/job/113397039166	
cfg boundary (PORTABILITY R2)	pass	9s	https://github.com/christopherdonini/spatial-ide/actions/runs/37802124739/job/113397138599	
every commit is signed off	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37802124735/job/113396792324	
no profile path in the range	pass	9s	https://github.com/christopherdonini/spatial-ide/actions/runs/37802124748/job/113396753518	
test · verify:plan · queue/site drift	pass	1m25s	https://github.com/christopherdonini/spatial-ide/actions/runs/37802116503/job/113397038499	
test · verify:plan · queue/site drift	pass	1m4s	https://github.com/christopherdonini/spatial-ide/actions/runs/37802124739/job/113397137961	
```
Nothing was pending.

## Disclosures
- All my temporary files are in my scratch folder: the mutation, probe, seam and compare scripts, a copy of main's checker, the scratch git repos and the suite output.
- `C:/dev/wt/vcp` is clean (`git status --porcelain`, 0 lines) and at 2d684ad5bcc1155a1cce568633cdf3342db33ec7.
- I wrote nothing in `C:/dev/wt/m1`.
- I made no commit, rebase or merge, and published nothing. I started no long-lived process.
- Round 25 checks: the worker report names `verify-mutation` as not used and calls no run of it an observation. The two new RECORDED MUTATION comments name their commit, 7f332caf669e.
