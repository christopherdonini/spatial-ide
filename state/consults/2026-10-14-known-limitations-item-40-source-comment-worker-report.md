Built: line 384 of KNOWN-LIMITATIONS.md replaced by the form's §A line, by script. One docs: commit, pushed (not forced).

New head: cb9a9fd4b9a92fa98cae0ae7d354cdf75d009adc, on cut/known-limitations-item-40-source-comment. The parent is 31e25f15.

Step 2: the old line 384 plus one newline hashes to b34d265a4058cba02778405f911ce63fb0ae998ffbdcc9946c8fb78682568bd1, which matches the Authority pin. The file has LF endings only.

Step 4: the old line is 1184 characters and the new one is 1515. The first differing column is 440. The last differing column is 1123 in the old line and 1454 in the new one. The span between those two columns includes the parenthetical clauses, which are identical in both lines. The only edits are the clause on where the code is and the three code locations, now written as pins on main.

Pins, each recomputed as specified (lines a to b joined with LF plus a final newline):

| Path | Lines | at 71fd2c4f | at head |
|---|---|---|---|
| frontends/shell/src/workspace/workspaceState.ts | 140-141 | match | match |
| frontends/shell/src/workspace/workspaceState.ts | 149-158 | match | match |
| frontends/shell/src/workspace/viewTransitions.ts | 156-165 | match | match |
| frontends/shell/src/feature/FeatureTab.tsx | 68-76 | match | match |

Commands and exit codes:
- The replacement and pin script: rc 0.
- `git diff --numstat`: rc 0, showing 1 added, 1 removed, KNOWN-LIMITATIONS.md only.
- `node scripts/plan/verify-cites.mjs`: rc 0. PASS, with 38 loose references advised.
- `node scripts/plan/verify-quotes.mjs`: rc 0. PASS, 121 checked, 0 hash-reference errors.
- `git commit -s -F <scratch file>`: rc 0.
- `git push origin cut/known-limitations-item-40-source-comment`, in its own call: rc 0, 31e25f15..cb9a9fd4.

I did not edit PLAN.yaml. The commit message names the node and the form and ends with the two attribution lines you gave.

Final `git status --porcelain` in C:/dev/wt/kl40: empty.

Self-check: no cross-module code was touched. Every pin recomputes at both commits. No user-facing message changed. No tests were required, and none were added or changed.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
