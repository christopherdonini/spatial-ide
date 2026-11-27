# A's correction after its two build-gate read parts, the worker's report

*Filed by the custodian, 2026-11-27. The correction of the form's Amendment 7 (ADV-2026-11-27-20 items 1, 3 and 4), made in D:/wt/a2save from dab4e9d3b45f487d9e0af2531030104a6dd5b761, with no app, dev server or e2e suite started. A sonnet worker made it. Its run, from its completion notice only (ADV-2026-11-26-02), was 23 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (4399 bytes, sha256 9a5fe81e32db3208583806e5cac3a9838ded97de9b1dfc08d7fdf0daf6437900), byte for byte. Its account is the worker's. The custodian checked the head, its parent, both counts and E-A1's block hash by git. No gate-log row: a correction is not a gate.*

---

38e9209db45d9b00063b2801381554d57f330fa7 is pushed (origin/cut/a-second-save-is-announced). Every step completed.

Commit: 38e9209db45d9b00063b2801381554d57f330fa7, "fix: A's correction after its two build-gate read parts (ADV-2026-11-27-20 items 1, 3 and 4)". Signed with `-s`, with the Co-Authored-By line. Start state was HEAD dab4e9d3 with a clean tree. Worktree is clean after the commit.

Spans, all four done. A script (D:/wt/a2save-logs/apply-corr1.mjs) read each Old and New from origin/main by `git show`. It printed them and checked that each Old stood exactly once. The ruling has 3 Old and 3 New lines, in the order of places 1, 2 and 3. D2's pair came from the backtick spans of the reviewer's read-part lines "  - Old, in saveProject.test.ts" and "  - New: ".
1. frontends/shell/e2e/conditions.mjs line 188, step 3's check. It now reads `... === afterSecondSave.text && isSavedLine(open.saveNotices[0], saved),`.
2. frontends/shell/e2e/README.md, the C-E2 entry. "reads a whole second past the first save's" is now "has passed into a later second than its reading after step 1".
3. frontends/shell/e2e/conditions.mjs header line 14. The rest of the line is unchanged.
4. D2's pair, once in frontends/shell/src/project/saveProject.test.ts and once in frontends/shell/src/App.conditions.test.tsx. "not to be the same text" is now "not to be 'The project was saved. (<the time, elided here>)'".

Checks:
1. `git diff --numstat dab4e9d3..HEAD` shows 1/1 on README.md, 2/2 on conditions.mjs, 1/1 on App.conditions.test.tsx and 1/1 on saveProject.test.ts. The conditions.mjs hunks are at lines 11-17 and 185-191, so only lines 14 and 188 changed. Lines 142 and 147 are untouched; the script refused if either changed.
2. E-A1 block sha256 at HEAD is bafadedc8a3576d73ba23f4c8a84a3c8ec753927f971a7e128390a3a19f821eb. The same slice at dab4e9d3 gives the same hash, which matches the figure you named. The slice runs from the line starting "  // 1b." up to, but excluding, the line starting "  // 2. The write". I cut it with `git show <rev>:frontends/shell/e2e/conditions.mjs | awk '/^  \/\/ 1b\./{f=1} /^  \/\/ 2\. The write/{f=0} f' | sha256sum`.
3. No merge commit lies in f64fac32..HEAD, so I used the three-dot form: `git diff --numstat f64fac32...HEAD` over the seven code and test paths. That is the form's seven paths less its two records (README.md and MANUAL-WALKTHROUGH.md). I took the path list from the form's §7 wording, not from its counting command. Result: 237 insertions, 30 deletions, 267 in total, 7 files. This equals the 267 the form recorded at dab4e9d3, since the correction changes 5 lines and removes 5.
4. `node --check frontends/shell/e2e/conditions.mjs` exited 0.
5. Inside one shared hold, `npm run typecheck` (tsc --noEmit) and then `npm test` exited 0. vitest: 132 test files passed, 1673 tests passed.
6. All four exited 0:
   - verify-cites: "verify:cites PASS — every rooted (in-tree) path:line reference across 3743 file(s) resolves. (237 loose reference(s) advised above.)"
   - verify-quotes: "verify:quotes PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 944 ruling cites resolved, 0 ruling-cite errors."
   - verify-test-claims: "verify:test-claims PASS — all 901 claimed test(s) across 293 file(s) exist or are planned, superseded or withdrawn (18 planned, 16 superseded, 17 withdrawn, advisory)."
   - verify-mutation (--base f64fac32 --head HEAD): "verify:mutation PASS — all 4 new test(s) have a recorded mutation naming them."

Departures:
- The disk read 41241 MB free, which is above the 40960 floor, so I ran the hold. The margin is about 280 MB.
- The verifier runs (cites, quotes, test-claims, mutation) ran outside a hold, because each is a single light script. The typecheck and vitest run was inside the hold.
- Logs are in D:/wt/a2save-logs/ as corr1-*.log. I wrote nothing in the mutations/ folder.
- No other departure.

Pre-gate four classes:
1. Cross-module use: none. The edits are test text, e2e text and a README sentence.
2. Completion claims: each is backed by a check above.
3. User-facing messages: unchanged by this commit.
4. Tests reach their assertions: the full vitest run passed. I ran no e2e suite and no app, as instructed.

Model: Sonnet 5.5, no override. No context handoff received or produced.
