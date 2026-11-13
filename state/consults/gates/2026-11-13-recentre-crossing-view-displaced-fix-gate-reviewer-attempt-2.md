Reviewed: PR #311 at eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8 (the custodian's filing note, 2026-11-13: the gate, the reviewer, attempt 2, its re-gate after the first correction, dispatched beside the architect under Part 1, items 5 and 6 of the rulings on gate rounds, PLAN node recentre-crossing-view-displaced-fix, slot 2; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #311 at eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8 (base 9398efc6), gate, reviewer, attempt 2
Verdict: PASS WITH NOTES
Branch and commit: cut/recentre-crossing-view-displaced-fix @ eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8. The cites below are read at that commit (H2). H1 = b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a, B = 9398efc6e3db7474cc9b1346ea9e1a5f1d5c7832. `<S>` is the brief's folder.

The brief's sha256 matched (318cd42a…5ad513), and so did the packet's (194a77c9…6f592f, 5043 bytes). The rulings (the 2026-11-05 directive, Part 1, items 1 to 9) were read first. I read, at main 2cde1069: both attempt 1 reports, the correction worker's report, the mutation worker's report (`<S>/rcfm-report.txt`, sha256 c73fc8da…5cd85a, 3287 bytes, which matches the packet) and the form's §3, §4, §7, §11, §12 and Amendment 4. The form's sha256 is 401b44c1f945c67ab697cf1705a4a94d54bfb260b09ac9418450a0a2fe8cfbf7. The correction diff `<S>/rcf-g2-diff.txt` matched the packet (cfc0913c…6a71a4, 13981 bytes).

## Findings

### Correctness
None.

### Evidence
None. E-1's closure conditions are met and I observed them myself (check 4).

### Documentation (must fix before the merge)
- **D-A. The PR body.** It still reads "Built at b7ba9f77" and says the gates "run next". It does not list the words applied under the wording-blocks rule: the architect's D-1 to D-3 and the reviewer's D2 and D4. It also does not record the custodian's choice to apply the architect's words in place of the reviewer's D1 and D3. The rule says that, for words that are not the human's, "the PR body lists them". To close this, rewrite the body at the final head with that list and the head named. This is not the human's wording.

### Notes (not findings)
- N1 (a preference, Part 1 item 6). `Partial<DeckProps>` takes deck's default `ViewsT = null` (`@deck.gl/core` `dist/lib/deck.d.ts:56`, `:110`), so `views` is typed `null`, and `viewId()` has to cast through `unknown`. `Partial<DeckProps<OrthographicView>>` would type `views` with no cast. E-1's closure ("`Partial<DeckProps>` or a `Pick` of it") is met as written.
- N2 (a record on main, outside this PR). The correction worker's gap 2 says the D4 last line is "about 107 columns". My script measures line 2104 at 139 columns. The shell has no width rule (71 lines in the file are over 120 columns), so the line itself is not a finding.
- N3. The mutation report says each revert check gave rc 0, and that M-U1 and M-U2 are the diffs it quotes. The `rcfm-` logs hold only the vitest output, so neither claim can be checked from them. The audit `<S>/rcfm-audit.json` shows the `git diff --quiet HEAD` revert command in the run, and the worker's worktree `C:/dev/wt/rcf` is now at H2 with 0 tracked changes. The refused Edit the packet names (00:28:19, "File has not been read yet") is in the audit's `errs` and not in the report.
- N4. M-U1 restores the move as `deckRef.current?.setProps({ initialViewState: { ...viewState, target: [localX, localY, vs.target[2] ?? 0] } })`. The base's move was `{ target: [localX, localY, 0], zoom: vs.zoom }` (B's `WorkingCanvas.tsx:2144`). Both are an in-callback `setProps({ initialViewState })` that returns nothing, so this is §4's M-U1 in substance.

## Checks

1. **Start state.** HEAD is eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8 and detached (`git symbolic-ref -q HEAD` rc 1). The porcelain has 0 lines. `df -h`: C: 17G free, D: 207G free, both above their floors. `git diff --quiet B H2 -- frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json` gave rc 0.
2. **Scope** (each rc 0).
   - `git diff --name-only H1 H2` names the packet's four files: `e2e/README.md`, `e2e/recentre-crossing.mjs`, `src/canvas/WorkingCanvas.recentre.test.tsx` and `src/canvas/WorkingCanvas.tsx`, all under `frontends/shell/`.
   - `git diff --name-only B...H2` names exactly §7's six files.
   - A grep for `kernel|engine|protocol|renderer|docs|KNOWN-LIMITATIONS` over that list counts 0.
   - The merge base is B.
   - The commits H1..H2 are 0153449420ccda2ce0ec17f1d635921a1fb6a6e0 (test, 01:11:36+01:00) and eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8 (docs, 01:12:40+01:00).
3. **§7's counts** (`git diff --numstat B...H2`, rc 0). Every file is inside its ceiling, so there is no class-8 overrun:
   - `MANUAL-WALKTHROUGH.md`: 1/0 = 1, ceiling 4
   - `e2e/README.md`: 12/0 = 12, ceiling 45
   - `e2e/recentre-crossing.mjs`: 347/0 = 347, ceiling 450
   - `package.json`: 1/0 = 1, ceiling 2
   - `WorkingCanvas.recentre.test.tsx`: 222/0 = 222, ceiling 300
   - `WorkingCanvas.tsx`: 41/26 = 67, ceiling 70

   H1..H2's numstat is README 2/2, e2e 1/1, test 13/9 and product 7/6. My script `<S>/rcf-gr2-c3.mjs` (rc 0) found 23 added lines with 0 CR and 0 tab. Each of the six files at H2 ends with a newline and holds 0 CR bytes (`<S>/rcf-gr2-c3.out`).
4. **E-1's closure, observed.** Each run was in its own shared hold.
   - `npx tsc --noEmit`: rc 0 (`<S>/rcf-gr2-c4-tsc.log`).
   - `npx vitest run src/canvas/WorkingCanvas.recentre.test.tsx` at H2: rc 0, "Test Files  1 passed (1)", "Tests  2 passed (2)" (`<S>/rcf-gr2-c4-vt-head.log`).
   - I wrote `git show B:frontends/shell/src/canvas/WorkingCanvas.tsx` over the file (rc 0). The porcelain then showed only ` M frontends/shell/src/canvas/WorkingCanvas.tsx`, and `git diff --quiet B -- <file>` gave 0.
   - The same vitest then gave rc 1, "Tests  2 failed (2)" (`<S>/rcf-gr2-c4-vt-base.log`). Byte-copied:
     - `FAIL  src/canvas/WorkingCanvas.recentre.test.tsx > the re-centre keeps the view where it was > U1: a drag past the bound and its settled tick change the origin and not W, at the first crossing and at a second one at the same zoom` / `AssertionError: crossing 1: W.x moved by 157286.3999999999 world units: expected 157286.3999999999 to be less than or equal to 0.000001`
     - `FAIL  src/canvas/WorkingCanvas.recentre.test.tsx > the re-centre keeps the view where it was > U2: no origin change on a settled tick in a transition or on one that starts a transition; the next tick with none re-centres and W is continuous` / `AssertionError: (a) a settled tick with inTransition true: the origin stays: expected [ [ 2600040.6260723933, …(1) ], …(1) ] to deeply equal [ [ 2600040.6260723933, …(1) ], …(1) ]`

     This is P-U-base's prediction: U1 fails at the first crossing and U2 at (a). The run is the base's product code with the new test, not a mutation.
   - `git checkout H2 -- src/canvas/WorkingCanvas.tsx`: rc 0. Then `git diff --quiet HEAD` gave 0 and the porcelain had 0 lines.
   - C1 against E-1's closure bullets:
     - The types are imported: `import type { DeckProps, InteractionState, ViewStateChangeParameters } from "@deck.gl/core";` (test line 21). deck exports them (`dist/index.d.ts:67`, `:85`).
     - FakeDeck's `props`, its constructor and `setProps` are typed `Partial<DeckProps>`.
     - `tick` takes `interactionState: InteractionState`, and so do `FakeDeckLike.tick` and the helper `tick`. It builds `params: ViewStateChangeParameters`, which already carries `viewId: string` (`controller.d.ts:72-80`).
     - The `viewId()` helper casts `this.props.views as unknown as { id: string }`, because `views` is typed `null` (N1).
     - Every bullet is met.
5. **The mutation record** (Part 1 item 3; §4's "Observing mutations"). I applied no mutation.
   - **M-U1** is the one §4 declares (see N4). Its log `rcfm-mu1.log` shows 2 failed. U1 fails "crossing 1: W.x moved by 157286.3999999999 world units", which is the declared failure at the first crossing. U2 also fails, at (c), and the report discloses this.
   - **M-U2** is the one §4 declares: the guard's `!inTransition && !startsTransition` clauses are removed, as the report's diff quotes. `rcfm-mu2.log` shows "Tests  1 failed | 1 passed (2)". U2 fails at "(a) a settled tick with inTransition true: the origin stays", the declared failure, and U1 passes.
   - `rcfm-head1.log` and `rcfm-head2.log` each show 2 passed.
   - Each revert check gave 0 by the report only: the logs do not carry it (N3).
   - The two lines the mutations replace are at H2's `WorkingCanvas.tsx:2153` and `:2157`, as the report quotes them.
   - No record calls a `verify-mutation` run an observation.
6. **What changed in the product tree since H1.** My script `<S>/rcf-gr2-c6.mjs` (rc 0, `<S>/rcf-gr2-c6.out`) found:
   - `WorkingCanvas.tsx`: 13 changed lines, 0 that are not `//` comment lines.
   - `recentre-crossing.mjs`: 2 changed lines, 0 that are not comment lines.
   - The README: 2 lines removed and 2 added. In each pair exactly one sentence differs: the entry's first sentence and its exit-code sentence, the two that the correction names.

   No changed line is code. So the e2e suites and E1 run at H1 at attempt 1 stand for H2, and I did not re-run them at this re-gate.
7. **The words, clause by clause against H2** (Part 1 item 1).
   - **D2 and D4.** My script `<S>/rcf-gr2-c7.mjs` (rc 0) joined the comment lines and compared them with my attempt 1 report's replacement words, read from main 2cde1069. D2 at lines 2337-2340 and D4 at lines 2101-2104 are each equal: `true`.
   - **D2's clauses at H2.**
     - `fitToExtent` calls `forceRecenter` at 1416 and `setProps({ initialViewState })` at 1424.
     - The seam calls the same two at 2365 and 2370, outside the handler, which returns `rebased` at 2172.
     - The top doc comment is unchanged H1..H2, so its reason holds as attempt 1 checked it.
   - **D4's clauses at H2.**
     - The guard at 2153 is the only `maybeRecenter` call in the file (grep).
     - "not measured" holds: §3 forbids the claim.
     - "no in-code fallback" holds: there is no timer.
     - All of it is true.
   - **D1, closed by the architect's D-1 words.**
     - "a drag whose settled tick finds the target past the re-centring bound moves the frame's origin and does not move the view": case 1 (a) at `recentre-crossing.mjs:280`, with an origin change in each leg as a VOID precondition at 278, and (b) and (d) at 283 and 287.
     - "a double-click which carries the target past the bound": by construction. The drag-out lands within (0, half], where half is the double-click's target move (295-307), and the double-click is at 312.
     - "moves no origin until its settle": (i) at 316.
     - "and its zoom completes": (ii) at 318, the zoom before plus 1 within 1e-6. This matches §3's "the zoom completes".
     - "a wheel notch after it then moves the origin without moving the view": (iii) at 322-325, which fails with "nothing to compare" when there is no origin change.
     - D1's defect, that the double-click was said to move the origin, is gone.
   - **D3, closed by the architect's D-3 words.**
     - "Exit 0 when all six asserted steps pass": there are six `record` calls (280, 283, 287, 316, 318, 325), and exit 0 is at 344.
     - "1 when one or more fails": 343.
     - "2 when the run is VOID — among others … or an app is already listening on the CDP port": the Void throws at 66, 94, 300, 307 and 278, exit 2 at 340. "Among others" marks the list as incomplete, which closes D3's defect.
     - "or ends on a fatal error": a non-Void error is rethrown at 335, and 347 exits 2.
   - **Every other changed line.**
     - The D-2 header, "refuses an app already listening on the CDP port": `lib.mjs:266` returns `launched: false` on attach, and `setup()` then throws Void at 66. True.
     - C1's lines are type annotations and the `viewId()` helper. No doc comment changed.
     - The two commit messages are true of their diffs.
   - No untrue clause, so no replacement words.
8. **`npm run verify`** in `frontends/shell`, in a shared hold: rc 0 (`<S>/rcf-gr2-c8-verify.log`).
   - vitest: "Test Files  112 passed (112)", "Tests  1458 passed (1458)"
   - residency-trace: "== 76 passed, 0 failed =="
   - citation-integrity: "== 30 passed, 0 failed =="
   - export-elapsed: tests 5, pass 5, fail 0
   - s5d-verdict: tests 7, pass 7, fail 0
   - scan-dist: "3 files scanned, 2 findings, all reviewed; record written"

   The porcelain afterwards had 0 lines.
9. **Governance at H2**, from the worktree root:
   - The scripts suite (in a hold): rc 0, tests 598, pass 598, fail 0, cancelled 0.
   - verify-cites: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2890 file(s) resolves. (188 loose reference(s) advised above.)"
   - verify-quotes (in a hold): rc 0, "verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 925 ruling cites resolved, 0 ruling-cite errors."
   - verify-test-claims: rc 0, "verify:test-claims PASS — all 793 claimed test(s) across 256 file(s) exist or are planned, superseded or withdrawn (25 planned, 14 superseded, 17 withdrawn, advisory)."
   - `verify.mjs --offline`: rc 0, "verify:plan PASS — … agrees with the repository."
10. **CI**, read at 2026-11-12T00:41:27Z by `date -u`... corrected: read at 2026-11-13T00:41:27Z by `date -u`. `gh pr checks 311` gave rc 0 and all 8 checks pass. `gh pr view` shows head eb63a3f8, draft, open. Every run's headSha is eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8, and every conclusion is success:
    - 43335673284, DCO sign-off (pull_request)
    - 43335673281, Exposure scan (pull_request)
    - 43335666607, Ported notices (push)
    - 43335673322, Ported notices (pull_request)
    - 43335666878, Product CI — shell (push)
    - 43335673429, Product CI — shell (pull_request)
11. **End.**
    - My six hold shells (54224, 79424, 72388, 7776, 80020, 11224) are each absent from `tasklist`.
    - No spatial-ide-shell process is running.
    - The machine script's status prints no SpatialIDE line.
    - HEAD is eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8, and `git -C C:/dev/wt/rcg status --porcelain --untracked-files=no` is empty (0 lines, and the full porcelain is 0 lines too).

## READING QUESTION lines
None.

## For the human
Nothing new. The custodian's choice to apply the architect's D-1 and D-3 in place of my D1 and D3 is for your review at the click: under check 7, the applied words close both of my findings.

## The packet's gaps
- The mutation logs do not carry the revert checks' rc or the mutation diffs, and the packet does not give the mutation worker's transcript path. I relied on the report and the audit for those (N3).
- Otherwise none.

## Hold lines
Six shared holds, one command each, each released at its end. The form is `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<elided> (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. By PID:
- tsc: 54224
- vitest at H2: 79424
- vitest with the base's file: 72388
- verify: 7776
- scripts suite: 80020
- verify-quotes: 11224

No hold was refused (no exit code 96 to 99).

## Background shells left
None. bc4viocw2, bf16wuuen, b7afy7tvx, bxgcqd7ov, bs3ikevmk, b8fe0ghgt and bpcabn9qw (a wait loop) have all completed.

## Model
claude-opus-5-5

Files:
- The finding site is PR #311's body.
- The sites checked are `C:\dev\wt\rcg\frontends\shell\e2e\README.md`, `C:\dev\wt\rcg\frontends\shell\e2e\recentre-crossing.mjs`, `C:\dev\wt\rcg\frontends\shell\src\canvas\WorkingCanvas.tsx` and `C:\dev\wt\rcg\frontends\shell\src\canvas\WorkingCanvas.recentre.test.tsx`.
- The outputs are in `<S>`, under names starting `rcf-gr2-`.
