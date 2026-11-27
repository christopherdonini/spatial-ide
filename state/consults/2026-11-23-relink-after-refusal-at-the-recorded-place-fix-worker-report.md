*Filed by the custodian: the worker's report of the build gates' words, node:relink-after-refusal-at-the-recorded-place@fix-worker-1, on branch cut/relink-after-refusal (commit e4e6493d92ec941425dd6566c0a4ec154c7eb633, parent 06a2825a1dd9e55649605487f1065810905dad58), dispatched at 2026-11-23T16:15:01Z. Its run: Bash 10, Read 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-23T16:15:03Z to 2026-11-23T16:19:50Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 2156 bytes, sha256 1df4e5ed5425b653721beb3b7166eddb2532e905af11b8c50e1b45a647bb15fe, byte for byte, with one final newline added. Its commit changes comments and documents only, so it needs no narrow read (ADV-2026-11-22-05). It is evidence for the closing amendment, not a gate.*

---

Commit e4e6493d92ec941425dd6566c0a4ec154c7eb633 on cut/relink-after-refusal (parent 06a2825a), pushed. 6 files, +7/-6.

Items at the new head (file:line):
1 arch D-1: protocol/skp/SKP-V0.md:1174
2 arch D-2: frontends/shell/e2e/README.md:892
3 arch D-3: frontends/shell/src/project/reopenNotices.ts:109
4 arch D-4: frontends/shell/src/admission/AdmissionPanel.tsx:407
5 arch D-5: KNOWN-LIMITATIONS.md:550
6 rev D-5 (your text): KNOWN-LIMITATIONS.md:550 (same line as item 5)
7 arch D-6: frontends/shell/e2e/reopen.mjs:20 (M-E1 line after RECORDED MUTATIONS)
8 rev D-4: frontends/shell/e2e/reopen.mjs:5

Checks:
- Each old text occurred exactly once before replacing (script `<S>/rlf-apply.cjs` stops otherwise; it did not stop).
- After replacing, each new text occurs once and each old text zero times by grep -c -F. For item 5 I checked the sentence it adds.
- node --check frontends/shell/e2e/reopen.mjs exited 0.
- npm run verify in frontends/shell, in a shared hold, exited 0: 126 test files and 1599 tests passed, ended before 05:00Z on 2026-11-24. The hold printed MACHINE_HOLD with also=<m> and MACHINE_RELEASED, with no MACHINE_WAITING or MACHINE_ERROR line and no exit code 96 to 99. Output is at `<S>/rlf-verify.txt`.
- Numstat (git diff --numstat 0f02c164e070960c326573560815f2eb0a880684...HEAD -- . ':!governance/**' ':!site/**' ':!state/**'): 10 files, total 410 added+deleted lines, within the 10-file and 420-line ceilings. Files: KNOWN-LIMITATIONS.md, frontends/shell/MANUAL-WALKTHROUGH.md, frontends/shell/e2e/README.md, frontends/shell/e2e/reopen.mjs, frontends/shell/src/admission/AdmissionPanel.test.ts, frontends/shell/src/admission/AdmissionPanel.tsx, frontends/shell/src/project/reopenNotices.ts, kernel/tests/project_relink_inside_folder_skp.rs, protocol/skp/SKP-V0.md, protocol/skp/src/v0/commands.rs.

The commit message file `<S>/rlf-msg.txt` has no typed Signed-off-by line and no email address; the Signed-off-by line in the commit comes from `git commit -s`. The push was its own call. The worktree is clean. Architect D-7 and D-8 and reviewer D-6 are left to the custodian, as briefed.

Model: Sonnet 5.5 (claude-sonnet-5-5).
