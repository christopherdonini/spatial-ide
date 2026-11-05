Reviewed: PR #281 at be4e3d46d97055a0274fa8a88747a0e36352190f (base 4009a97e), gate 1, reviewer; cut/verify-cites-moved-file-relative-pinned-cites @ be4e3d46d97055a0274fa8a88747a0e36352190f
Verdict: PASS WITH NOTES

The brief's sha256 matched (a8cf79b3…, 8202 bytes). The packet's sha256 matched (71870b7a…, 6068 bytes). I read the Part 1 rulings, the form (all 188 lines, unchanged between base and head: `git diff --quiet` rc=0), the ruling's item 2 at 8e90c244, the C1, D1 and D2 finding lines, and the F form's lines 360-375, 413-416 and 504-507 at 8e90c244.

## Findings

### Correctness: none.

### Evidence: one note. It does not block.
- **E-1 (note, item 6: a preference, not a new acceptance condition).** The pin-path-list call site has no test of its own. The Change line declares two sites: the tree resolution and the path list the pin is read at. M1 and M2 mutate the shared helper, so they cover both sites together. I mutated only the second site, in the clone, at be4e3d46. The mutation (M3) replaced `const [rx, ra] = pinnedRefs(cite.pathRaw, relPath, index, map);` with `const { exact: rx, all: ra } = resolveRef(cite.pathRaw, relPath, index);`. Result: `verify-cites.test.mjs`: 56 tests, 56 pass, rc=0. The mutation survives.
  - Why it does not block: the form's Tests+mutation line asks for T-A, T-B, M1 and M2, the existing tests passing, and base/head scan equality. All are present and observed (checks 2, 3 and 5). By reading, the second site is correct.
  - Where the site matters: when the folder-before-the-move exact path is not among the suffix candidates (a `../` path), or when several same-basename candidates exist. No cite in the current tree reaches it: the base and head verify-cites outputs are byte-identical.
  - What would close it (optional): a fixture cite whose pin exists and holds the line only at the folder-before-the-move path, which passes only through the second site.

### Documentation: none.
- D1, D2 (a) and D2 (b) are byte-equal to the form's section 5.
- The three reworded comments and the helper's comment are true of the code (clause check under check 1).
- None of the replaced lines is the human's wording. `git blame` at the base shows `governance/README.md:30` from 494cea7b (piece F's paths commit), `scripts/plan/README.md:57` from deb56edd (plan tooling) and `scripts/hooks/README.md:164-165` from 8c966952 (the hooks feature).

## Check 1: the diff against the five lines
- **Size and scope.** `git diff --numstat 4009a97e...be4e3d46` rc=0 gives 1/1, 3/2, 1/1, 17/6 and 73/0. That is 95 insertions and 10 deletions, 105 lines against a budget of 130. The 5 files are exactly the Scope's.
- **Helper and call sites.** The unexported `pinnedRefs(pathRaw, citingRel, index, map)` returns the union of `resolveRef` from `originPath(map, citingRel)` (listed first) and from `citingRel`, as `[exact, all]`. It is called at the tree resolution (`cite.pin ? checkResolved(cite, ...pinnedRefs(...), root) : checkCitation(cite, index, root, map)`) and at the pin path list.
- **No new export.** `grep -c "^+.*\bexport\b"` on the diff returned 0. The test file imports `REPO_ROOT` and `addCommit`, and both were already exported at the base.
- **Unchanged code.** A scratch script compared each function's text at base and head (rc=0). `resolveRef`, `resolveRefMapped`, `checkCitation`, `checkResolved`, `checkPinned`, `classifyPath`, `extractCitations` and `backwardReason` are all EQUAL, and so is `movedMap.mjs`. The unpinned arm still passes `map` (base: `cite.pin ? undefined : map`; head: the non-pin arm `checkCitation(cite, index, root, map)`). `git diff --stat` on `movedMap.mjs`, `moved-map.mjs` and `movedFixture.mjs` is empty.
- **The form's named risk (F form :372-373).** I recomputed the hashes at 8e90c244: :364 9e9feaee…, :372 273bc972…, :372-373 57402150…, :373 0a09c0db…, :415 d3257fb6… and :506 86aa89db…, all matching the form.
  - Line 373 reads: "A cite with `@ <commit>` takes today's code path in verify-cites, with no map and no post-move check."
  - The change keeps a pinned cite's own path free of any mapping: `pinnedRefs` calls only `resolveRef`, never `resolveMoved` or `resolveRefMapped`.
  - It also keeps it free of the post-move check: `checkResolved` returns no `mapped`, so `res.mapped && post.writtenAfter(...)` is never taken for a pinned cite.
  - What changes is only the folder the citing file's relative path is read from, which carries out :364 ("A moved citing file always resolves its relative cites against its old folder").
  - I read :372 as the form and the custodian do: it binds the cite's own path, not the citing file's folder. §8 item 15 (:506) was piece F's stop condition, and the human's ruling of 2026-11-05, item 2 (ruling file line 9 @ 8e90c244, sha256 cb77dc04… recomputed) directs this change. The single-gate route stands.
- **D1, D2 (a) and D2 (b).** The form's line 111 and line 123 (outer backticks stripped) and lines 131-133, all at be4e3d46, were each compared with `cmp` against `governance/README.md:30`, `scripts/plan/README.md:57` and `scripts/hooks/README.md:164-166`. All three returned rc=0 (sha256 b4d73931…, 12a04890… and e07932c4…).
- **D1's clauses against the code:**
  - verify-quotes reads at the revision: `gitShowFile(root, ref.rev, …)` on both branches.
  - verify-test-claims reads at the revision (`gitShowFile`/`pathAtPinnedRev`).
  - verify-cites reads the pin "only when no file the current tree resolves its path to holds the line": the `res.status === 'ok'` `continue` comes before the pin read.
  - "without MOVED.tsv's old-to-new rows": the path goes through `resolveRef` only.
  - "from its folder before the move too": `pinnedRefs` at both sites.
  - All true.
- **D2 (a) and D2 (b) against the code:** `plan.mjs` defaults to `'governance/PLAN.yaml'` and reads it with `fs.readFileSync(path)`, relative to the working directory. `READING_ORDER` in `session-resume.mjs` lists `governance/DECISIONS-PENDING.md`, `state/directives/`, `governance/PRECEDENTS.md`, `governance/AUTONOMY.md` and `governance/AI_DEVELOPMENT.md`. Both true.
- **Comments.** The header (:52-54), the pin-read note (:92-93), the helper's comment (:405) and the call-site comment (:445-446) each describe the code as written: the before-the-move folder comes first, "first move" because `originPath` walks the whole chain, and both sites are named. True.
- **Bytes.** A scratch script (rc=0) found 95 added lines with no CR, no tab and no non-ASCII byte. All 5 files end in LF and hold no CR.

## Check 2: the suite at the head, run by me
- I ran `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` in `C:/dev/wt/vcmf` at be4e3d46, inside a shared hold. Exit 0: tests 598, pass 598, fail 0.
- T-A, `verify-cites: a moved form's relative pinned cites resolve from its pre-move folder at the exact tier`: ✔.
- T-B, `verify-cites: a pinned cite from a moved file to a file moved beside it stays at the exact tier`: ✔.

## Check 3: mutations, observed by me
I made a shared clone in my scratch folder (`vcmf-g1r-clone`, clone rc=0, checkout rc=0, HEAD be4e3d46, 8e90c244 present as a commit). Eight long-named `state/directives/` files did not check out until `-c core.longpaths=true`; after that the porcelain was empty. The unmutated baseline was 56/56, rc=0.

| Mutation | Edit | Result (rc=1) | Restored sha256 |
|---|---|---|---|
| M1 | `originPath(map, citingRel)` → `citingRel` in `pinnedRefs` | 56 tests, 55 pass, 1 fail. ✖ T-A by name, `0 !== 41`, all 41 advisory | f4e72957…, equal to head's |
| M2 | `pinnedRefs` returns the before-the-move candidates only | 55 pass, 1 fail. ✖ T-B by name, `0 !== 9`, 9 advisory | f4e72957… |

- The base's `verify-cites.mjs` under the head's tests fails T-A only, `0 !== 41` (rc=1). The file was restored to f4e72957…
- M3: see E-1.
- The clone was removed (`test -e` rc=1).

## Check 4: the tests' soundness (item 7)
- **Real producers.** Both tests drive the real `runVerifyCites`. Their inputs come from the real producer: `extractCitations` over `git show 8e90c244:<form>`. T-A asserts the counts [39, 1, 1] and T-B asserts [7, 2] before building anything.
- **Fixture limit 1 (one raw cite plus its pin per line).** It does not weaken the property under test, which is the resolution tier. The assertion checks that each re-extracted `target` equals the original `raw`, at line i+1, so the round trip through extraction is proven. What is not proven is extraction from each original line's surrounding text, but the cites were taken from those real lines by the same function.
- **Fixture limit 2 (short or empty target files).** This is deliberate: the tree check fails, and the absent pin makes both arms fail at the pin, so gated versus advisory shows the tier alone. The base run (41 advisory) and M1/M2 confirm that it discriminates. It does not exercise a pin that exists; E-1 covers the second site.
- **History.** `.github/workflows/governance-ci.yml:141-143` is `actions/checkout@v4` with `fetch-depth: 0`, in the job whose :149-150 runs the same `node --test` line. So 8e90c244 is reachable in CI.
- **RECORDED MUTATION lines.** Two were added, by be4e3d46. The diff between 6f29ce60 and be4e3d46 is those 2 comment lines only. Each names its mutation (M1: current folder only, M2: before-the-move folder only) and 6f29ce60. Each claims "fails by name, and only this one". That matches what I observed at be4e3d46 within `verify-cites.test.mjs`. The other `runVerifyCites` caller, `rotate-decisions-pending.test.mjs`, has no MOVED.tsv, so by reading it is unaffected. Neither line calls a verify-mutation run an observation.

## Check 5: the verify scripts and CI
All run in the worktree at the head.

| Command | Result |
|---|---|
| `verify-cites.mjs` | rc=0, "across 2635 file(s) resolves. (131 loose reference(s) advised above.)" |
| `verify-cites.mjs` at the base (in the clone at 4009a97e) | rc=0; output byte-identical to the head's (`cmp` rc=0, 133 lines each) |
| `verify.mjs --offline` | rc=0, verify:plan PASS |
| `verify-test-claims.mjs` | rc=0, 729 claimed tests across 230 files |
| `verify-quotes.mjs` (`timeout 580`) | rc=0, "135 checked, 104 verified, 30 baselined, 1 advisory … 0 hash-reference errors … 910 ruling cites resolved, 0 ruling-cite errors" |

The base/head byte-identity confirms the Tests line's equality clause.

CI: `gh pr checks 281` rc=0, all 8 checks pass. PR head be4e3d46, draft. Each run's head sha by `gh run view` (all rc=0):

| Run | Event | Workflow | Head sha | Conclusion |
|---|---|---|---|---|
| 42066858499 | push | Governance CI | be4e3d46 | success |
| 42070030538 | pull_request | Governance CI | be4e3d46 | success |
| 42070030522 | pull_request | DCO sign-off | be4e3d46 | success |
| 42070030715 | pull_request | Exposure scan | be4e3d46 | success |
| 42066858705 | push | Ported notices | be4e3d46 | success |
| 42070030720 | pull_request | Ported notices | be4e3d46 | success |

## The packet's gaps
- **The F form's line 373.** The risk turns on its exact text, and the packet named the line without giving it; I read it at 8e90c244.
- **Whose wording D2's replaced lines were.** The form's settlement covers D1 only; I ran `git blame`.
- **The clone needs `core.longpaths=true`.** The brief's clone command leaves 8 long-named directive files unchecked-out on this machine.
- **The packet's CI list was taken mid-run.** It shows one Governance CI run as "running" and omits the run IDs; I re-read them by gh.
- **Whether the worker's "only this one" claim covered the whole suite or the one file.** The packet did not say.

## Hold lines (this project's only, `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:62136 also=… (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:62136 affinity=FF (cores 0-7)`
- One hold, for the suite run. Script exit codes 96-99 were not seen.

## Background shells left
- Two commands were moved to the background by the harness (the suite, and verify-quotes). Both completed with exit 0 and were not killed.
- One node `verify-quotes.mjs` process remains (PID 78480). Its parent is a bash started at 18:13:28, after my own verify-quotes started; mine finished with exit 0. It is not mine, so I left it.
- The worktree's porcelain at the end is empty (0 bytes; HEAD be4e3d46). The clone is gone.
- Files written: scratch only, all named `vcmf-g1r-*`.
