Reviewed: PR #225 at d9c083d0d30e341dbb02c5becd84f4a6a7d84b5b (base e54e4af2)
(cut/e2e-readme-status-bar-steps @ d9c083d0d30e341dbb02c5becd84f4a6a7d84b5b)
Verdict: PASS WITH NOTES

## Correctness
None. All of §A's new clauses are backed by the code at the base. Clause-by-clause check is below.

## Evidence
None. All four verifiers exit 0 at the head. The pull_request CI runs are green at the head. One push-event job was still pending when I read the checks (see check 5). That is a CI state, not a finding about the diff.

## Documentation (must-fix before the merge, no re-gate)
D-1. `PLAN.yaml:5190` (the head and the base have the same bytes). The node `e2e-readme-status-bar-steps` still has the title "e2e/README.md: the status bar's two new steps and E-FOCUS's new stop in the layout and selection entries (…)". That describes the original OPEN-1 (a) design, not what merged or what this piece edits:
- there is one new step;
- there is no E-FOCUS stop;
- the layout entry is untouched.

PLAN.yaml is in the form's Scope ("this node's record"). Whose wording: the architect's draft, section 4, lists it under "Not the human's". I have not confirmed its authorship independently. Replacement title (the architect's proposed words, unchanged):
"e2e/README.md: the selection entry gains E-STATUS-HEIGHT, and E-DBLCLICK's run-last reason becomes history (the docs-lane follow-up of shell-status-bar-one-height, OPEN-2 (b); as merged under OPEN-1 (d): one new step, no E-FOCUS stop)"

Clause check, at base e54e4af2:
- "the selection entry gains E-STATUS-HEIGHT": this diff, README.md:771.
- "E-DBLCLICK's run-last reason becomes history": this diff, edit 2.
- "one new step": the only added step is the `runStep("E-STATUS-HEIGHT", …)` at frontends/shell/e2e/selection.mjs:866. Header list: selection.mjs:8.
- "no E-FOCUS stop": E-FOCUS's expected walk is `["top", "layers", "map", "inspector", "activity"]`, with no `status`, at frontends/shell/e2e/layout.mjs:217.

Not a finding: the form's Scope, Change and Tests lines say "line 770". At the base it is line 771, with the same bytes. The PR body records this as class 3, as the brief says. The closing amendment can carry it by reference.

## Checks

1. One line, one file, and the line move.
- `git diff --numstat e54e4af2...d9c083d0` gives `1 1 frontends/shell/e2e/README.md`, exit 0. It is the only file. The hunk is `@@ -771 +771 @@`.
- `cmp` of README.md line 770 at 7c648c1c against line 771 at e54e4af2: exit 0. Both have sha256 6da77c9c4dbb5dae1d1679841770791db8ceaac162845e8742248cba51f932f2, which matches the line-move pin in the architect's draft. Head line 771: efcca6de…a3a.
- The form has identical bytes at the base and the head (`cmp` exit 0). The fences were read from it.

2. Edits rebuilt by my own script (node, scratch `check.mjs`), exit 0.
- It extracted the three ```text fences from the form at the head.
- Counts in base line 771: anchor `` `E-DBLCLICK` (on a fresh open `` occurs 1 time (index 1261); the old span occurs 1 time (index 1438). They do not overlap.
- Expected line = base line, with insert + ", " placed before the anchor and the old span replaced by the new fence.
- `head === expected`: true. Both are 2943 chars, with no CR in either line.
- With numstat 1/1, no other byte in the file differs.
- Extra check (`paren.mjs`, exit 0): parentheses are balanced in both lines (final depth 0, never below 0). Backticks are even (48 at the base, 58 at the head).

3. Clause check of §A's new words, at base e54e4af2. selection.mjs, lib.mjs, styles.css and layout/ have no diff between 7c648c1c and the base (`git diff --stat` empty, exit 0), so the architect's line numbers still hold.

Edit 1 (E-STATUS-HEIGHT):
- "run after `E-ASK-TWO` and before `E-DBLCLICK`": selection.mjs:865-867.
- "a window of 880 x 800 set over CDP with `Browser.setWindowBounds`": selection.mjs:794-798. It calls getWindowForTarget, getWindowBounds and setWindowBounds with 880/800, then polls until the inner size is 880 x 800.
- "and restored after": selection.mjs:804-813. The saved bounds are re-sent and inner size is polled until it matches the pre-resize size. A restore that fails throws, so the step cannot pass with a failed restore.
- "with a selection standing": S0, selection.mjs:755-762.
- "a reopen ends it and shows the ended-selection notice": S1, selection.mjs:765-767. The step asserts the `.selection-ended` notice appears (statusItem is read at selection.mjs:157). That the reopen ends the selection is asserted by E-GEN in the same entry (selection.mjs:470). Supported as the entry reads.
- "on a second line of the status bar": guard G1, selection.mjs:771.
- "a Select click clears the notice": S2, selection.mjs:774-778.
- "the canvas's width and height are the same before…, while…, after…": selection.mjs:783. This is an exact equality of A, B and C. `canvasRect` is at lib.mjs:572.
- "the status bar is 48 px tall in all three": selection.mjs:784.
- "inconclusive, never a pass, when the window cannot be set": selection.mjs:802.
- "… when the notice is not on a second line": selection.mjs:771.
- "… when the attention strip's height changes": selection.mjs:772 and :780.
- No other inconclusive path exists in the step. The recorded-only values (selection.mjs:785) are not claimed.

Edit 2 (E-DBLCLICK):
- "it runs last": selection.mjs:867 is the final runStep.
- "while the status bar grew with its content, before `shell-status-bar-one-height`": history. styles.css:34 @ 117aac6c sha256:dcb018dbdc37f212e2f6fc2c09bf3bb82d78db0d1d7cd97c2c2503a6204eb1fa (status row `auto`). styles.css:159-172 @ 117aac6c sha256:7db1301b36d263e867d332a30315f134e0908ab7395a46d8df42b081755705bb (min-height 1.5rem, max-height cap, wrap). I recomputed both hashes and they match.
- "run earlier its reopen ended … the map grew under the following step's points (run 5's E-SEL-FILTER diagnosis)": the old words, put in the past tense. Evidence: state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:17 @ 2cf707a3 sha256:f10aa01fd35f6d7d5ff6eedb880b0315686657dce714f8e3e5d8466ad30daeb9 (recomputed, matches). Also the mutation observation at selection.mjs:59-60.
- "the status bar now has one height, 48 px":
  - styles.css:34: the grid row is `var(--status-h)`.
  - styles.css:161-162: border-box, `height: var(--status-h)`.
  - StudioLayout.tsx:203 sets the variable from STATUS_BAR_HEIGHT_PX.
  - layoutConstants.ts:36: the constant is 48.
  - `.status-bar` has only the rule at styles.css:159, and no other source sets `--status-h` (`git grep` at the base). An operator can see this in the shipped app.
- "`E-STATUS-HEIGHT` asserts that the notice coming and going leaves the canvas's size unchanged": selection.mjs:783.
- Unsupported clauses: none.

Pins in the form, recomputed:
- README.md:766 @ 7c648c1c gives 48c3b20d…f8c. Matches.
- The directive's line 10 @ 2cf707a3 gives 9caa52ff…4d4. Matches.
- lib.mjs:572-579 @ 2cf707a3 (in the architect's draft) gives 000eee7c…128. Matches.

4. Verifiers, in a detached worktree C:/dev/wt/gate225 at d9c083d0. Each ran in the foreground (timeout 600 s), output went to a file, and `$?` was printed right after:
- `node scripts/plan/verify-cites.mjs`: exit 0. "verify:cites PASS … 1968 file(s) … (40 loose reference(s) advised above.)"
- `node scripts/plan/verify-quotes.mjs`: exit 0. "verify:quotes PASS — 129 checked, 98 verified, 30 baselined, 1 advisory … 0 hash-reference errors (2 hash-baselined) …"
- `node scripts/plan/verify-test-claims.mjs`: exit 0. "verify:test-claims PASS — all 570 claimed test(s) across 174 file(s) …"
- `node scripts/plan/verify.mjs`: exit 0. "verify:plan PASS — …PLAN.yaml agrees with the repository."
- `git worktree remove C:/dev/wt/gate225`: exit 0. The worktree list no longer has it. The main checkout's porcelain is unchanged.

5. `gh pr checks 225`: exit 8 (one check pending). Each run checked with `gh run view`; all are at d9c083d0d30e341dbb02c5becd84f4a6a7d84b5b:
- DCO sign-off (pull_request): pass.
- Exposure scan (pull_request): pass.
- Ported notices (pull_request and push): pass.
- Product CI — shell, pull_request run 39052051011: tauri build pass; "typecheck · build · vitest · cargo test" pass (6m1s).
- Product CI — shell, push run 39052023924: tauri build pass; "typecheck · build · vitest · cargo test" pending (in_progress).
- `gh pr view 225`: head d9c083d0, base e54e4af2, MERGEABLE, mergeStateStatus UNSTABLE (the pending job).
- Read the push run's last job again before the merge click.

Nothing heavy was run, and no file was written outside the scratch folder and the temporary worktree.
