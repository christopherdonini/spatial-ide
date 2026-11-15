Reviewed: PR #301 at 0c92da34497a8d2d13474171fcc481bb33399dfa (base 75390735), gate 1, reviewer
Verdict: PASS WITH NOTES
Branch: cut/stale-harness-comments-find-prime-and-late-result @ 0c92da34497a8d2d13474171fcc481bb33399dfa (worktree C:/dev/wt/shc, HEAD equal to it; every line cite below is read at this commit unless it names another)

The brief and the packet hashes matched: brief af059878…2f53, packet 7dfa3f2f…1baa07ea4f6e62, 6980 bytes. The form at main 217fd16e is aafbe6ab…547cc, the human's ruling 145fe05e…000ef92, the stop report 0229a2b6…cff348 and the built report a5c88a5f…b326bd, all equal to the packet.

## Findings by class

**Correctness:** none.
**Evidence:** none.
**Documentation (must-fix before merge):** none.

**Notes.** These are preferences. Under item 6 they set no acceptance condition and carry no closure. Each changed sentence is true at H as written.
- **N1. "No branch of the step reads `unminted`" (regression.mjs:1948) and "never in a branch condition" (regression.mjs:2088-2089).**
  - The only conditional that reads `unminted` is the ternary `unminted === null ? … : …` at regression.mjs:2325-2328. It picks the text of `unmintedText`, and that text goes only into `observed` (:2329-2336).
  - Both sentences say that read belongs to the observed summary, so they are true. Read "branch" in the coverage sense and a reader could still count the ternary.
  - Optional sharper words, if the worker wants them: "No pass-or-fail branch of the step reads `unminted`, …".
- **N2. "The branches below test `truncated` and the settled status only" (regression.mjs:2252-2253).**
  - In step 4's comment this means step 4's three branches (:2272, :2279, :2287), and for those it is true.
  - Read literally, "below" also covers step 5's branches (:2308, :2314), which test `refit` and `returnedFraction`, and the `failures.length` check (:2337).
  - Optional: "Step 4's three branches below test …".
- **Observation, no action.** OPEN-2 (a) in the form says the repointed line is 111 columns. Line 1930 at H is 112. It is the form's estimate, it is append-only, and nothing depends on it.

## Checks 1 to 11

**1. The Out-of-scope line, first.**
- `git diff --name-only 75390735...0c92da34` exited 0 and listed exactly the two files: `frontends/shell/e2e/regression.mjs` and `frontends/shell/src/App.lateResult.test.tsx`.
- `--numstat` exited 0: 21 insertions and 15 deletions in regression.mjs, 13 and 6 in the test file. That is 55 lines against the declared 60. There is one commit past the base.
- The line, clause by clause:
  - **ADR:** no file under docs/. ADR-033 appears only as a number inside the status comment (regression.mjs:2264).
  - **Security:** no dependency, hook, label or exposure surface.
  - **Wire:** nothing under protocol/.
  - **Guarantee:** every token of both files is unchanged (check 2), and the changed comments state code facts.
  - **No string the app shows:** both files are a harness and a test.
- The four §21a categories are untouched, so the single gate applies.

**2. Comment-only, by my own scripts.** The Write tool was not available in my run, so I wrote each script with a quoted heredoc and checked with `od -c` that its backslashes survived. I disclose this as a departure from the brief's "written with the Write tool".
- **Token equality, `<S>/shc-g1r-tokens.cjs`.**
  - It uses `ts.createScanner` from the worktree's typescript 5.6.3 with trivia skipped: the JSX variant for the .tsx file, Standard for the .mjs file.
  - It re-scans the template at each template-closing brace, and re-scans a slash as a regex wherever the previous token permits one.
  - As a second witness, it compares the TS printer's output with `removeComments: true` over a full parse of each file.
  - Negative self-tests came first:
    - head regression.mjs:2272 `truncated` changed to `truncatedX`: exit 1, "tokens DIFFER at index 9661".
    - head test file :1218 `handleA` changed to `handleQ`: exit 1, "DIFFER at index 7548".
    - The printed output also differed in both.
  - Base against base: exit 0 for each file.
  - Real run, B against H:
    - regression.mjs: exit 0, 13080 tokens equal, printed output equal (86451 characters, 0 parse diagnostics).
    - App.lateResult.test.tsx: exit 0, 9078 tokens equal, printed output equal (55261 characters, 0 parse diagnostics).
- **Amendment 1's check, `<S>/shc-g1r-commentlines.cjs`,** over `git diff -U0 75390735...0c92da34 -- <the two files>` (exit 0).
  - A line passes if it matches `^[+-]\s*//`. Otherwise it must open with `/*` or `*`, and its first and last non-blank characters must fall inside one `MultiLineCommentTrivia` range of the file on its own side. The ranges come from the scanner with trivia kept.
  - The scan saw 0 Unknown tokens and 0 open templates at end of file, on both sides of both files.
  - Negative self-test 1, a code line (`const x = 1; // new`): exit 1.
  - Negative self-test 2, `const b = a` continued by a line `  * 2;`: exit 1. The genuine ` * genuine` block line in the same diff passed, as a positive control.
  - Real run: exit 0. 51 lines passed as `//` lines and 4 as block-comment lines (regression.mjs:2088-2089 at B and at H). None failed. 51 + 4 = 55, matching numstat.
  - The hunk headers match the packet's.
- **`node --check e2e/regression.mjs`** in frontends/shell: exit 0.

**3. The pins, `<S>/shc-g1r-pins.cjs`.**
- It parses every `sha256:` in the added lines and recomputes it over `git show <rev>:<path>` as whole lines with their LFs.
- Negative self-test: one hex digit changed, exit 1. Real run: exit 0.
- There are 9 pins, all at 058244086f9914525ea8e4761c7baa07ea4f6e62. Each is rooted and contiguous on one line, and every `sha256:` on a line was parsed into a full reference.
- `git merge-base --is-ancestor 05824408 origin/main` exited 0. `git diff --quiet 05824408 75390735` over the seven files exited 0, as did `git diff --quiet 05824408 0c92da34` over the five cited files. So each pin's lines are identical in the tree at H, and pin and tree agree.
- Each pinned range is the code its sentence means:
  - predicate.rs:145-147 is `.acquire(LeaseClass::Admission)`.
  - pool.rs:132 is `MAX_ADMISSION_CONNECTIONS: usize = 4`.
  - pool.rs:111-115 is the declaration: 3 tile streams plus 1 baseline query, 3 + 1 = 4.
  - candidateArmSession.ts:1271-1291 (pinned twice) holds `issueUntiledQuery`: the `stopped` returns at :1272, :1286 and :1291, and the uncaught `await viewportQuery` at :1283.
  - candidateArmSession.ts:1705 is `deps.onResidencyStatusChange?.({ kind: "query-issued" })`, inside `reissueUnrestricted` (:1640).
  - candidateArmSession.ts:146 is the `applyScanEvent` type, inside `CandidateArmSessionDeps` (:95-178).
  - candidateArmSession.ts:1061 is the `onSessionEnded` option of `new TileViewportStreamManager({` (:922).
  - candidateArmSession.ts:1089-1103 is `endCandidateSession`, which fires the dependency at :1102.

**4. Every changed sentence, clause by clause, at H.**
- **FIND' header (regression.mjs:1946-1950) against note 1a:**
  - (a) step 4 is the `// 4)` comment at :2246.
  - (b) truncated: the push at :2272-2278.
  - (c) settled-partial: :2279-2286.
  - (d) never within-budget, on `null` or no match of the pattern: :2287-2292.
  - (e) `unminted` is assigned at :2256. Outside comments it is read only at :2325-2328, inside `unmintedText` (see N1).
  - (f) the observed summary: :2325-2336.
  - (g) the throw at the end: :2337-2339.
  - The lead sentence at :1937-1938 stays true.
- **The worker's one change in 1a:** "No branch of the step reads `unminted`", in place of "No branch reads the unminted-tile counts". It is true:
  - Nothing in `stepFind` decides pass or fail on `unminted`.
  - The worker's reason holds: `settledUnmintedTilesSince` reads `counts.unmintedTiles` as its polling condition (:2096), and that is in the callee, not in a branch of the step.
- **Status comment (regression.mjs:2261-2271) against note 1b:**
  - (a) "FAILS whenever …": :2279-2292, with the throw at :2337-2339.
  - (b) "its own engine class, `LeaseClass::Admission`": predicate.rs:145-147 and pool.rs:108-109.
  - (c) "(entry 91 (a), ADR-033)": predicate.rs:131.
  - (d) "= 4": pool.rs:132, with pool.rs:240 mapping the Admission class to it.
  - (e) three streams plus one baseline: pool.rs:111-115 and tileGridConstants.ts:40 (`MAX_IN_FLIGHT_TILE_STREAMS = 3`).
  - (f) the last sentence is retained and true.
  - It names no cause and makes no claim that FIND' passes.
- **The late-result pair (test file :1350-1357) against note 1c:**
  - (a) :1061 is the manager's callback, called by the manager at tileViewportStreamManager.ts:752 inside `endSession` (:740-753).
  - (b) :1089-1103 is `endCandidateSession`, with :1102 firing the dependency.
  - The retained "NOT by `session.stop()`" holds: `runB2CandidateSequence` ends A by `depsA.onSessionEnded` at :1387, and nothing stops A before that.
- **The six lines against the settlement's paragraph:**
  - regression.mjs:2088-2089 and :2252-2253 no longer carry the false-PREMISE-BROKEN or "silently skip" text. Each new sentence states what the code does at H (the status read at :2254 comes before the `unminted` read at :2256, and the branches are as in 1a), with no cause, history or FIND' result.
  - Test file :284-287 and :1216-1217 are repointed to `issueUntiledQuery`'s `stopped` returns (:1271-1291).
  - Test file :1249-1250 is repointed to the `query-issued` dispatch (:1705).
  - Test file :1327 is repointed to the `applyScanEvent` type (:146).
  - Each is pinned and true.
- **OPEN-2 (a):** line 1930 now reads `governance/forms/frontends/FILTER-84-85-PREREGISTRATION.md`.
  - That path is tracked, and governance/MOVED.tsv:67 maps the old path to it.
  - §2.4 is at :21 and §3.4 at :35 of that form.
  - The line is unwrapped, on one line.
  - The human's quoted ruling at :1931-1933 is byte-unchanged: sha256 f263ccf3c1d6a6ecc3c44a43d669df86ab813f94f1ef4ef85cab2132ea2d3838 at B and at H.
- **Note 5's block-on-sight list:**
  1. No path outside the two files.
  2. No changed token.
  3. No clause untrue at H.
  4. No sentence claims FIND' passes or names the cause of a red.
  5. The OPEN-3 lines were edited under the human's ruling of 2026-11-08.
  6. No pin is split and every hash recomputes.
  7. No CI entry is red.

**5. Amendment 1.**
- It changes only the comment-line check: note 3 step 4, and the same phrase where the Tests+mutation line restates that check. Scope, Change, the budget, the other checks and the gate are unchanged, as the amendment itself says.
- Its first line says it was written after the worker's checks were seen.
- Read with token equality, the widened check still shows comment-only:
  - No token changed.
  - Every one of the 55 changed lines is a `//` line or lies wholly inside a block comment.
  - The 4 block-comment lines are inside `settledUnmintedTilesSince`'s `/** … */` block (regression.mjs:2084-2092) on both sides.

**6. The shell suite at H,** in C:/dev/wt/shc/frontends/shell, each inside its own shared hold:
- `npm run typecheck`: exit 0 (`tsc --noEmit`).
- `npx vitest run src/App.lateResult.test.tsx`: exit 0, 1 file, 21 tests passed.
- `npm run verify`: exit 0.
  - vitest: 109 files and 1446 tests passed.
  - citationIntegrity: 30 passed and 0 failed. residencyTrace: 76 passed and 0 failed.
  - node:test: 5/5 and 7/7 passed, with 0 fail.

**7. The governance checks at H,** from the worktree root:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, in a shared hold: exit 0, 598 passed, 0 failed.
- `node scripts/plan/verify-cites.mjs`: exit 0, PASS across 2775 files, with 177 loose references advised.
- `node scripts/plan/verify-quotes.mjs`, in a shared hold: exit 0. PASS: 152 checked, 121 verified, 30 baselined, 0 hash-reference errors, 921 ruling cites resolved, 0 ruling-cite errors.
- `node scripts/plan/verify-test-claims.mjs`: exit 0, PASS on 772 claimed tests across 247 files.
- `node scripts/plan/verify.mjs --offline`: exit 0, `verify:plan PASS`.

**8. Bytes.**
- The added lines hold 0 CR bytes and 0 tab bytes, out of 34 `+` content lines. A positive control file holding one CR and one tab counted 1 and 1.
- Both files end with `\n` at H. `file` reports no CRLF.

**9. The worker's disclosed departure** (packet section 5, item 1): nothing follows from it for the piece.
- The refused Writes were self-test inputs in the worker's scratch folder. No tracked file was involved.
- Every check those inputs served, I re-ran independently with my own scripts, at H, with my own negative self-tests.
- Whether a Guardian refusal should have been a stop is a process matter for the custodian's record. It is not a Correctness or Evidence finding.

**10. CI.**
- `gh pr checks 301` exited 0, with all 8 entries pass. The PR is OPEN, draft, base main, head 0c92da34497a8d2d13474171fcc481bb33399dfa.
- `gh run view`, each exiting 0, each with headSha 0c92da34497a8d2d13474171fcc481bb33399dfa and conclusion success:

| Run | Event | Workflow |
|---|---|---|
| 42513491837 | pull_request | DCO sign-off |
| 42513491614 | pull_request | Exposure scan |
| 42513491638 | pull_request | Ported notices |
| 42513491835 | pull_request | Product CI — shell |
| 42513368297 | push | Ported notices |
| 42513368360 | push | Product CI — shell |

**11. Porcelain afterwards:** `git -C C:/dev/wt/shc status --porcelain --untracked-files=no` exited 0 with empty output (0 bytes). HEAD is still 0c92da34497a8d2d13474171fcc481bb33399dfa.

## For the human

Nothing. The changed comments are worker-written and the architect's, not the human's wording. The human's quoted 2026-09-13 ruling at regression.mjs:1931-1933 is byte-unchanged. No red-line text is in the diff.

## The packet's gaps

- The packet gave form line numbers at main but not the head line numbers of each changed comment. I derived them from the diff.
- It did not say whether the five cited code files are unchanged between the pin commit 05824408 and H, nor whether 05824408 is on main. I computed both.
- It did not name the test-file lines that ground 1c's retained "NOT by `session.stop()`" clause (`runB2CandidateSequence`, :1380-1387 at H). I found them by grep.
- Otherwise there were none.

## My departures from the brief

- The Write tool was not available, so I wrote the scripts by quoted heredoc and checked their bytes (check 2).
- In each hold line, the command's exit code is echoed (`echo cmdrc=$rc`) before the release step. This is not in the given shape, and it adds no `$( )`, backtick or heredoc.
- verify-quotes ran past 180 s and the harness moved it to the background. I waited with a bounded loop that slept 5 s per turn, with a 540 s cap, and then received its completion notice: exit 0.

## Hold lines (project SpatialIDE only, `also=` elided)

| Command | MACHINE_HOLD | MACHINE_RELEASED |
|---|---|---|
| typecheck | `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:69672 also=…` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:69672 affinity=FF (cores 0-7)` |
| vitest | `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:60268 also=…` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:60268 affinity=FF (cores 0-7)` |
| `npm run verify` | `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:66660 also=…` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:66660 affinity=FF (cores 0-7)` |
| `node --test` | `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:64392 also=…` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:64392 affinity=FF (cores 0-7)` |
| verify-quotes | `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:35252 also=…` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:35252 affinity=FF (cores 0-7)` |

No hold returned a code from 96 to 99.

## Background shells left

None. The one backgrounded call (task bpu8duj7t, verify-quotes) completed with exit 0, and its hold was released. I started no other process, and I killed none.

## Scratch files

All are in `<S>`, named `shc-g1r-*`.
- Scripts: `shc-g1r-tokens.cjs`, `shc-g1r-commentlines.cjs`, `shc-g1r-pins.cjs`.
- Outputs: `shc-g1r-tok-*.txt`, `shc-g1r-cl-*.txt`, `shc-g1r-pins-*.txt`, `shc-g1r-typecheck.txt`, `shc-g1r-vitest.txt`, `shc-g1r-verify.txt`, `shc-g1r-nodetest.txt`, `shc-g1r-cites.txt`, `shc-g1r-quotes.txt`, `shc-g1r-testclaims.txt`, `shc-g1r-verifyplan.txt`, `shc-g1r-checks.txt`, `shc-g1r-runs.txt`.
- The diff: `shc-g1r-u0.diff`.
