*Custodian's filing note (2026-10-21): correction round 1 of ADR-036's pre-acceptance block (C3, the form's Amendment 2), by a worker in `C:/dev/wt/a36`, building d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 on 70edd381. The run 2026-10-21T16:06:57Z to 16:13:57Z by its transcript (Bash 8, Read 5, Write 1; its one Write was its commit message, in its scratch folder). The custodian checked that the commit changes one line of ADR-036 and nothing else. It measures §7 at 62, not Amendment 2's predicted 64: C3 changes a line A4 had already changed. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 865c938be45e9d14ff852a004eec73dcf7a945462e482c4c4b055218c43c62c0.*

---

Built: adr-036-pre-acceptance-block correction round 1 at d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 (pushed, 70edd381..d0c257d9, no force).

Steps (every command run in the foreground with output redirected to a file; exit codes read directly, none piped):
1. C3 by my own scratch script (not committed): the old span occurred exactly once; replaced. rc=0 "C3 applied". The blocks were read from the form on main (Amendment 2 item 2, three-space indent removed).
2. V1: a scratch script rebuilt ADR-036 from B (ad921f55) by applying the form's blocks for 2.1 to 2.4 and then C3, and compared the result with the worktree file. rc=0 "V1 EQUAL". Before C3 was applied the same script, run against the 70edd381 file, rc=1, differed only at A4's C3 span. Self-test with a wrong old span for C3: rc=1, it threw "C3 old occurs 0".
3. `node frontends/shell/scripts/adrIndex.mjs --check`: rc=0, "adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line". docs/README.md is unchanged.
4. V3: `git diff --name-only ad921f55` (before the commit, working tree) lists docs/README.md and the ADR-036 file. docs/README.md is the form's earlier regenerated row, already at 70edd381. `git diff --numstat 70edd381` shows `1 1` on ADR-036 and nothing else.
5. V4/V5, all rc=0:
   - verify.mjs: "verify:plan PASS — ... PLAN.yaml agrees with the repository."
   - verify-cites.mjs: "verify:cites PASS — every rooted (in-tree) path:line reference across 2161 file(s) resolves. (85 loose reference(s) advised above.)"
   - verify-quotes.mjs: PASS, 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors.
   - verify-test-claims.mjs: PASS, all 581 claimed tests across 185 files exist or are planned, superseded or withdrawn.
   - queue.mjs --check: "CUSTODIAN-QUEUE.md/.json are current."
   - site.mjs --check: "site/ is current."
   - node --test (plan, hooks, evidence): rc=0, tests 527, pass 527, fail 0.
6. §7 count: `git diff --numstat ad921f55 -- <ADR-036>` gives 44 insertions + 18 deletions = 62, against 90. Amendment 2 item 2 predicts 64; I measure 62, which is 2 below the prediction. The one-line C3 change adds 1+1 to the count at 70edd381 (V3 shows `1 1`), so 61 at 70edd381 would have given 62 at the new head. This is a discrepancy for the custodian to resolve.
7. Committed ADR-036 alone (`git add` of that path, `git commit -s -F`), subject as briefed, with the two trailer lines. `git status --porcelain` after the commit: empty. Pushed in a separate call.

C3 at the new head: line 95 of docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md. The line is long, so I give its changed tail byte for byte and the rest unchanged from 70edd381: "...Canonical form is checked on the text alone and does not by itself show that a path leads inside the project folder: containment, below, checks that when the data is opened;"

Pre-gate self-check:
- Cross-module seams: none touched. This is a docs-only change.
- Completion claims: each points to the output files above, which I read.
- User-facing messages: none.
- Required tests reach their assertion: V1 compares full bytes, and the wrong-span self-test fails.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override. No context handoff received or produced.

Off-scope noticed, not done: none.
