# Shell-scale-display's words, the worker's report

*Filed by the custodian, 2026-11-27. The one words commit of ADV-2026-11-27-28 (the form's Amendment 14), made in D:/wt/scale from 8c1e68d3bc928346c8f1fe21415aec3d96fc82af to cbea7d4e06622e5b1debc058ba2a23ea696df761. A sonnet worker made it, with no app, dev server or e2e suite started. Its run, from its completion notice only (ADV-2026-11-26-02), was 17 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (3834 bytes, sha256 4e22517b015fa39d639017de2c50abc9dc00e7431cf4d6fe50b7861302c28c4f), byte for byte. Its account is the worker's.*

---

cbea7d4e06622e5b1debc058ba2a23ea696df761 is the pushed head (origin/cut/shell-scale-display). Every step completed. The worktree is clean. No PR was opened.

The words commit is cbea7d4e06622e5b1debc058ba2a23ea696df761, "docs: shell-scale-display's words, under ADV-2026-11-27-28: S-1 to S-4 without the mark, KNOWN-LIMITATIONS item 80 and Part AI". It was made with -s, carries the Co-Authored-By trailer and has no email in it. HEAD was 8c1e68d3 and the tree was clean when I started.

How the texts went in:
- A script (D:/wt/scale-logs/fix-words.mjs) read the filed ruling and took its five fenced blocks in order.
- It put item 80 into KNOWN-LIMITATIONS.md and the two comment spans into the comment there, and it put the Part AI body into MANUAL-WALKTHROUGH.md. I wrote the scaleBar.ts strings and the doc comment's wrapping by hand, because the code needs `${decimal}` and the file's line wraps.
- The ruling's Old text was in the file exactly once for each of those edits. The script stops if it is not.

Each fenced text, checked by script (D:/wt/scale-logs/fix-check.mjs, exit 0, every line OK):
- The item 80 title and paragraph are in KNOWN-LIMITATIONS.md exactly as the ruling has them.
- Both comment spans: the New text is present and the Old text is gone.
- The Part AI body ends the walkthrough file exactly as the ruling has it.
- S-1 to S-4 are in scaleBar.ts, with {L} written as `${decimal}`.
- The doc comment's New sentence is in scaleBar.ts, checked with its line wraps joined.
- MARK and "P6 placeholder" no longer occur in scaleBar.ts.

Test text changed: App.scale.test.tsx only (searched; scaleBar.test.ts, the e2e and StudioLayout hold none of the old strings).
- Three expectations dropped the "[P6 placeholder] " prefix: the 100 m label, the 500 m label and the not-metre line.
- The title expectation `toContain("A length of 100 metres")` is now `toContain("The bar spans 100 m on the map")`. It still checks that the title carries the length.
- layout.mjs calls the functions (`scaleBarLabel`, `scaleBarTitle` and so on) and holds no literal, so it did not change.
- StudioLayout.test.tsx line 372 has an unrelated "[P6 placeholder] Table", and I left it.

Checks at cbea7d4e:
1. Shared hold, in frontends/shell: `npm run typecheck` then `npm test` exited 0. Vitest: Test Files 134 passed (134), Tests 1688 passed (1688).
2. Shared hold, at the root: `node --test` over the three script folders exited 0. tests 623, pass 623, fail 0.
3. The four verify scripts all exited 0:
   - verify-cites: PASS, 3747 files, 221 loose references advised.
   - verify-quotes: PASS, 159 checked, 128 verified, 0 hash-reference errors, 0 ruling-cite errors.
   - verify-test-claims: PASS, 901 claimed tests across 293 files.
   - verify-mutation (--base 530d7b0e --head HEAD): PASS, "all 5 new test(s) have a recorded mutation naming them".
4. §7 count over 530d7b0e...HEAD, by the form's command: 10 counted files, and insertions, deletions and each file's lines are the same as at 8c1e68d3. The 10 files total 491 of 760 changed lines; regionParts.tsx is 37 of 45, scaleBar.ts 71 of 90 and App.scale.test.tsx 184 of 240. Outside the count: KNOWN-LIMITATIONS.md 4 of 10, MANUAL-WALKTHROUGH.md 29 of 45, e2e/README.md 2 of 20. There is no overrun and no class 8.
5. `git diff --stat 8c1e68d3..HEAD` shows 4 files, 24 insertions and 24 deletions: KNOWN-LIMITATIONS.md (6), MANUAL-WALKTHROUGH.md (20), App.scale.test.tsx (8) and scaleBar.ts (14). The e2e README is not in it.

Departures from the ruling, the form or this message: none.
- verify-cites printed its usual advisory lines about loose references, and no failures.
- The first of the two background waits timed out and was moved to the background by the tool. The verify scripts were not affected. None of them is a heavy command, so none ran under a hold.
