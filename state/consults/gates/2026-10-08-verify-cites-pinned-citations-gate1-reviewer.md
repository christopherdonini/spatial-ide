# PR #191 gate 1 — reviewer (single gate)
Reviewed: cut/verify-cites-pinned-citations @ 57e8d2b3 57e8d2b35254a1f6b060c69db8c31f2ce6264018

**Verdict: FAIL (Correctness).** One blocking finding (C1): a pin whose path is a directory at the pinned commit passes, which breaks Decision B's "a pin whose ... file is missing fails". The fix is one line plus one test. The scope, the Out-of-scope line, P1 to P4, the seam proof, the suites and CI all hold.

Base: ed396e94. Diff `origin/main...origin/cut/verify-cites-pinned-citations`: 2 files, 97 lines added and 4 removed, so 101 changed lines out of the 150 allowed. Both files are the Scope's: `scripts/plan/verify-cites.mjs` and `scripts/plan/verify-cites.test.mjs`. The form landed at 994b9737, which is an ancestor of the first code commit 0e092a40 (`git merge-base --is-ancestor`, rc 0). I recomputed the form's Decision B span hash, `state/directives/2026-10-08-decisions-a-b-c.md` lines 17-24, at 994b9737 (the commit that adds the file) and at origin/main. Both give 55ac849dfa481cb43f579a9edaefa4fa7fd729ec98424fef46595c04a11b32d4, which matches the form.

## Out-of-scope line (read first)
"ADR none; security none; wire none; guarantee none". This holds. The change touches one governance checker and its tests. There is no ADR, no product file, no `protocol/` and no workflow. The checker's existing 15 tests still pass unchanged, so no property under test is weakened. The single gate (§21b) applies.

## Correctness

**C1 (blocking): a pinned directory path passes.** The code is at `scripts/plan/verify-cites.mjs:262` @ 57e8d2b3:
```
  try { text = git(['show', `${cite.pin}:${p}`]); } catch { return { ok: false, reason: `"${p}" not found at pinned commit ${cite.pin}` }; }
```
- When `<rev>:<path>` names a tree, `git show` exits 0 and prints a listing: a `tree <rev>:<path>` header, a blank line, then one entry per line. `checkPinned` counts that listing as the file's lines.
- I reproduced it in a scratch repo. `engine/src` held `a.rs` and `b.rs`, and the cite was `engine/src:3 @ <rev>`. The pinned cite gave `gated []`. The same cite unpinned was gated with "no tracked file matches".
- The same happens when the directory still exists in the tree: a rooted `no-match`, then the pin path, then a pass.
- So the pinned branch passes a cite that the unpinned path fails. That breaks Decision B ("A pin whose commit or file is missing fails", the directive's line 20) and the form's Change line ("the file exists there").
- **Fix:** read the blob, not "anything showable": `git(['cat-file', 'blob', `${cite.pin}:${p}`])`. I checked that `git cat-file blob <rev>:engine/src` exits 128 on a tree, and that the same command returns the file's bytes for a file.
- **Test:** add one test, a pinned cite whose path is a directory at that commit fails by name, with its mutation (the current `show`). Declare the added test in the form's Amendments before the fix lands. The budget stays under 150 lines.

**C2 (low, fix with C1): a failing pin's reason replaces the tree's reason, and it can say something false.**
- `runVerifyCites` reads the pin for every non-`ok` cite except a loose `no-match`. A failed pin's reason then replaces `res.reason` for `oob-exact`, `oob-suffix` and rooted `no-match`.
- `checkPinned` only tries `pathRaw` from the repo root. It does not use the suffix match or the `.md` fallback that the tree check uses.
- So a loose `App.tsx:1997-2006 @ 30e77c10` now reports `"App.tsx" not found at pinned commit 30e77c10`. The file is there, at `frontends/shell/src/App.tsx`. The old reason, "line 2006 exceeds …", was true.
- This shows up in the m1 run below: two advisory entries in `state/consults/2026-10-07-shell-migration-milestone-1-architect-draft.md` (its lines 139 and 145 at m1's HEAD) changed their reason.
- A rooted cite without an extension (`docs/README:9 @ rev`) does the same.
- The tier never changes (probe: archived stays advisory, loose stays advisory), but the message states something that is not so.
- **Fix:** keep `res.reason` when the pin's file is not found and the tree did find a file, or resolve the pin path with the tree's own resolution.

**Checked and correct:**
- **Pin parse, at `verify-cites.mjs:144`.**
  - It reads only the text right after the token: an optional space, `@`, an optional space, then 7 to 40 hex digits not followed by an alphanumeric.
  - On a line with two cites, the pin goes only to the cite directly before it. Probe: `a/x.rs:1 and b/y.rs:2 @ 30e77c10` gives `[null, "30e77c10"]`.
  - It reads no pin from a 64-hex run, a 41-hex run, 6 hex digits, two spaces, or a pin after a closing backtick (`` `path:4` @ rev ``).
  - A hex word ("defaced") is read as a pin, but only in the safe direction. It is consulted only when the cite already fails, and it then fails with "pinned commit defaced not found".
  - A blob id used as a pin fails on `^{commit}`.
- **git failures.** Both git calls sit in try/catch. stderr is ignored, maxBuffer overflow and ENOENT are caught, and I saw no crash in the probes. A cwd that is not a repo returns `{ok:false}`. The arguments are hex, or start with a path-token character, so no option can be injected. The only case where a git outcome passes a cite is C1.
- **Nothing else changes.** The archived prefixes, the doc-number skip, the loose `no-match` skip, the tiers, `main()`, the output format and the exit codes are untouched.
  - On the vcp tree itself, main's checker and the branch's give identical gated sets (0 and 0) and identical advisory sets (34 and 34, no entry differs).
  - A pin on a cite that resolves in the tree is not read. That matches the ruling, which reads the pin only when the cite does not resolve, and the worker disclosed it.
  - At the pin, the line count uses the same lenient count as the tree check (`split('\n').length`), as the worker disclosed.

## Evidence

No blocking finding.
- **The mutations, re-made by hand at 57e8d2b3.** Each was applied with `sed`, I ran `node --test --test-reporter=tap scripts/plan/verify-cites.test.mjs`, then reverted with `git checkout --`. The worktree was clean after each one.

| Mutation | Change applied | Test rc | Failing test (only one failed) |
|---|---|---|---|
| baseline | none | 0 | 19 pass, 0 fail |
| P1 | `if (pr.ok) continue;` commented out | 1 | `a_pinned_cite_past_the_trees_end_that_resolves_at_its_commit_passes` |
| P2 | the `cat-file` catch returns `{ ok: true }` | 1 | `a_pinned_cite_whose_commit_does_not_exist_fails_by_name` |
| P3 | the `show` catch sets `text = ''` | 1 | `a_pinned_cite_whose_file_is_missing_at_that_commit_fails_by_name` |
| P4a (mine) | `cite.pin &&` dropped, so every non-ok cite is read at a pin | 1 | `an_unpinned_cite_past_the_trees_end_still_fails` |
| P4b (mine) | unpinned cites given pin `HEAD~1` | 1 | `an_unpinned_cite_past_the_trees_end_still_fails` |
| extra (mine) | `maxL > lc` dropped from `checkPinned` | **0** | none: it survives |

- P4 covers the unpinned path against both forms of "a fallback applied to every cite".
- The extra mutation survives. The Change line's "whose line is out of range there, still fails" is true in code: my probe found `line 9 exceeds "engine/src/pool.rs" at pinned commit … (3 lines)`, gated. But no test guards it, and the form's four tests did not promise one. Suggestion: add that test alongside C1's.
- **Seam proof, re-run.** I imported `runVerifyCites` from the branch file and from main's file (read from `origin/main`) with `repoRoot` `C:/dev/wt/m1`, at m1's HEAD 65391e79b048f51f3ca4d7b5eeac7533f5b64639. The run was read-only, and `git -C C:/dev/wt/m1 status --porcelain` showed 0 lines afterwards.
  - main: gated 4, advisory 37, scanned 1513.
  - branch: gated 0, advisory 37, scanned 1513.
  - The four that main gates, all pinned at 30e77c10 and all resolving now:
    - `frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md:17`, cite `App.tsx:1649-2024`;
    - the same file's line 95, cite `App.tsx:1997-2006`;
    - its line 101, cite `App.tsx:2014-2020`;
    - `state/consults/2026-10-07-shell-migration-milestone-1-architect-draft.md:61`, cite `App.tsx:1649-2024`.
  - The tree's App.tsx has 1997 lines. 30e77c10 is on main (`--is-ancestor`, rc 0), and governance CI checks out with `fetch-depth: 0`, so the pin resolves in CI.
  - 125 cites in m1 carry a 30e77c10 pin.
  - The advisory count is the same, but two reasons changed (C2).
- **The worker's suite run.** They read its exit code through `tail`. My re-run below supersedes that.

## Documentation (must-fix before merge, no re-gate)
- **D1.** The header of `verify-cites.mjs`, lines 9-14 @ 57e8d2b3, still says every reference is resolved against the working tree. Add the pinned fallback. Add to "WHAT THIS DOES NOT CATCH":
  - a pin after a closing backtick, or after two spaces, is not read;
  - a pin on a cite that resolves in the tree is not checked;
  - a hex word directly after `@` is read as a pin.
- **D2.** The `extractCitations` JSDoc at `verify-cites.mjs:127` @ 57e8d2b3 lists a return shape without `pin`.
- **D3.** The worker report, at `state/consults/2026-10-08-verify-cites-pinned-citations-worker-report-1.md:13` in the main checkout (staged, not committed), puts the new regex at `verify-cites.mjs:142`. At 57e8d2b3 it is line 144. The report is a byte-copied extraction, so the correction belongs in the custodian's filing note, not in the report's bytes.

## Commands (cwd `C:/dev/wt/vcp` unless stated)
| Command | rc | Hold |
|---|---|---|
| `git status --porcelain`, `rev-parse`, `fetch origin`, `diff --stat origin/main...origin/cut/verify-cites-pinned-citations`, `log` | 0 | none |
| `git diff origin/main...origin/cut/…` and the form and directive reads | 0 | none |
| `node probe.mjs <scratch>/repos` (parse and edge cases, scratch repos) | 0 | none |
| `node probe2.mjs` (directory pinned vs unpinned) | 0 | none |
| the mutation runs above (`timeout 120 node --test --test-reporter=tap scripts/plan/verify-cites.test.mjs`) | as tabled | none (single file, light) |
| `node seam.mjs` (m1, main vs branch) | 0 | none |
| `node adv.mjs` on m1 and on vcp (set comparison) | 0, 0 | none |
| the hold-shaped call: `cd C:/dev/wt/vcp && powershell.exe … -File <M> hold shared -Project SpatialIDE -What "verify-cites-pinned-citations gate: node --test scripts suites" -Minutes 6 -MaxWaitMinutes 3 && CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 node --test --test-reporter=tap scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs > <file> 2>&1 ; rc=$? ; powershell.exe … -File <M> release -Project SpatialIDE ; exit $rc` | 0 | shared hold granted (cores 0-7), released; tests 454, pass 454, fail 0, 46.0 s |
| `node scripts/plan/verify-cites.mjs` | 0 | none; PASS, 1517 files, 35 advisory |
| `node scripts/plan/verify-quotes.mjs` | 0 | none; PASS |
| `node scripts/plan/verify-test-claims.mjs` | 0 | none; PASS, 523 claims |
| `node scripts/plan/verify.mjs` | 0 | none; PASS |
| `node scripts/plan/queue.mjs --check` | 0 | none; current |
| `node scripts/plan/site.mjs --check` | 0 | none; current |
| `node scripts/plan/cfg-boundary.mjs` | 0 | none; 18 sites, 0 outside every boundary |
| `git show <adds>:state/directives/… \| sed -n '17,24p' \| sha256sum`, at 994b9737 and at origin/main | 0 | none |
| `git cat-file blob <rev>:engine/src` (scratch, fix check) | 128 | none |
| `gh pr checks 191` | 0 | none |

`gh pr checks 191`, every line (head 57e8d2b3…, OPEN):
```
cfg boundary (PORTABILITY R2)	pass	14s	https://github.com/christopherdonini/spatial-ide/actions/runs/37799742652/job/113388846612	
cfg boundary (PORTABILITY R2)	pass	9s	https://github.com/christopherdonini/spatial-ide/actions/runs/37799759464/job/113388514592	
every commit is signed off	pass	5s	https://github.com/christopherdonini/spatial-ide/actions/runs/37799759424/job/113388515149	
no profile path in the range	pass	8s	https://github.com/christopherdonini/spatial-ide/actions/runs/37799759511/job/113388514919	
test · verify:plan · queue/site drift	pass	1m22s	https://github.com/christopherdonini/spatial-ide/actions/runs/37799742652/job/113388846134	
test · verify:plan · queue/site drift	pass	1m24s	https://github.com/christopherdonini/spatial-ide/actions/runs/37799759464/job/113388515003	
```
Nothing was pending.

## Disclosures
- I wrote three test-output files to the system temp folder instead of my scratch folder (`vcp-mut.txt`, `vcp-suite.txt`, `vcp-v.txt`), then deleted them. All other temporary files, the probe scripts and the scratch git repos, are in my scratch folder.
- `C:/dev/wt/vcp` is clean and at 57e8d2b35254a1f6b060c69db8c31f2ce6264018. I wrote nothing in `C:/dev/wt/m1`. I made no commit, rebase or merge and published nothing. I started no long-lived process.
