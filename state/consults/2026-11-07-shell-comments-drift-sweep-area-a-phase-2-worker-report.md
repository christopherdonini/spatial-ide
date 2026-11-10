*Custodian's filing note (2026-11-07): the phase 2 worker's report for `shell-comments-drift-sweep-area-a`, built at 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a on `cut/shell-comments-drift-sweep-area-a` under its five-line form (`governance/forms/frontends/SHELL-COMMENTS-DRIFT-SWEEP-AREA-A-PREREGISTRATION.md`, the custodian's settlement, OPEN-2 (A): phase 2 after PR #292's merge, main merged in by a merge commit). Its brief was given by file (11331 bytes, sha256 2199fed7cca58829935a383d737207cb729eaf05b285b66319cd774bf6be7981). Dispatched at 2026-11-07T21:10:00Z by its transcript; the run went to 21:26:39Z (claude-sonnet-5-5; unique calls: Bash 32, Monitor 1 and the hand-back, 34 in all, equal to the notification's). The report below was extracted by script from the hand-back in that transcript (6051 bytes, sha256 566a3c6cade789834941bb9e3355218b0a80454c1690c5aff112ad1401b25335) and is unchanged. The custodian checked by git that the branch's head is 5a45e113 and that its first parent's second parent is main 1bc349ae, the merge the report names. The report names two departures of its own: the hold call's command group put in parentheses, against THE MACHINE paragraph; and the phase 1 re-check made by the merge's changed-file list rather than clause by clause. A report, not Authority.*

---

Built: shell-comments-drift-sweep-area-a phase 2 at 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a (pushed; origin branch == HEAD, tracked porcelain empty).

- Step 1: brief sha256 matched. HEAD and origin both 809127d3eebde501ccc089e77667c5257deb0123, tracked porcelain empty. Rule (00): `git diff --name-only origin/main...<b>` over every other origin `cut/` branch, filtered for the nine paths, printed no line. The same filter on this branch returns 2 of the 9 (a positive self-test).
- Merge commit: f7f38acd2a6508c15c4096e429dda4bfcbaee728 (`--no-ff --signoff`, no conflict). No `package-lock.json` in the merge's changed list. `git diff --name-only 809127d3...HEAD` names, under frontends/shell/src, only `e2e-test-surface.ts`. The other files it lists are outside the eight phase 1 files (e2e/README.md, e2e/lib.mjs, src-tauri publish.rs, docs, engine/kernel/protocol, state, governance). Phase 1 re-check: no code file a phase 1 comment cites changed, and I made no change to the eight files. The one non-src cite (`governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md` §2d, DescribeSummary) is in no changed list. I did not re-read phase 1's other cites clause by clause beyond that.
- I-5: the #292 merge moved e2e-test-surface.ts's lines (header). I re-derived all three by item at 1bc349ae/f7f38acd. All three findings still hold; none left alone.

Findings (code: `path:line @ f7f38acd`):
- **A11**: `canvas/WorkingCanvas.tsx:160` is now `canvas/WorkingCanvas.tsx`, by item name, with no line. The method is `getResidentCounts()` at WorkingCanvas.tsx:177 (interface) and :1623 (impl).
- **A5**: "Its only caller is source-changed.mjs" is now "Its callers are three E2E drivers", with "No product module reads it" kept. Grep `residentCounts` over frontends/shell/src, renderer, kernel/src shows only App.tsx:1281 (registration), :1342 (unregister) and e2e-test-surface.ts:222 (type). Each driver, from its own steps:
  - `e2e/source-changed.mjs`: S2 (:866) requires totalResidentVertices > 0 before; S5b (:1214) requires 0 after; R2 (:1330) requires repopulation after a reopen.
  - `e2e/source-watch-idle.mjs`: W2 (:346) before > 0; F2 (:535) after 0.
  - `e2e/export-view.mjs:67,88`: `residentFeatures` reads `totalResidentFeatures` to wait for >0 after `queryWithFilter` applies a predicate, before settle and prepare.
  - P3b's reason paragraph kept, introduced by "The reason below is P3b's, written for source-changed.mjs." The "why the property must be proven" for export-view is not claimed in the comment. Whether it meets the exemption stays a gate question (form: "What I could not settle").
- **A2**: the default is "candidate" (`residency/residencyArm.ts:50` `DEFAULT_RESIDENCY_ARM`, `let currentArm` after it). Harness (`e2e/residency-harness.mjs`): `parseCellArgs` default arm "baseline" (:397), `--arm` parsed (:401), `setResidencyArm(cellArgs.arm)` plus readback at :2696-2704 before any `openFixture`. `e2e/refusal-contract-baseline.mjs:606-614` sets "baseline" and reads it back. `regression.mjs:1774`/`:2633`, `filter-panel.mjs:475` and `console.mjs:73,1029` set nothing and assert the readback is "candidate". Greps: `setResidencyArm|getResidencyArm` over e2e, and `"baseline"` over e2e and src. `getResidencyArm`'s doc is now "candidate" unless a successful `setResidencyArm("baseline")`. The line-305 DEV-ONLY label, the header and all code tokens are untouched. No `.coordinate`, `["coordinate"]` or `{ coordinate }` in the file (grep empty).

Token proof (`sca-p2-tokens.cjs`, fresh run; ran on the worktree before commit and again at HEAD): self-test on a scratch copy with one identifier changed printed `equal=false`, `ALL_EQUAL=false`, rc 1. At HEAD vs 1bc349ae, all nine are equal, ALL_EQUAL=true, rc 0. Token counts: e2e-test-surface 757, DescribeSummary 553, pick 342, tileGrid 1515, recorder 847, renderTrace 587, FilterPanel 608, candidateArmSession 3390, residencyTileSizeLevel 166.

Checks at the head (exit code, last line):
- typecheck: 0, `tsc --noEmit`.
- `npm test`: 0, Test Files 109 passed, Tests 1446 passed.
- test:citation-integrity: 0, `== 30 passed, 0 failed ==`.
- verify-quotes (in the hold): 0, PASS (138 checked, 107 verified, 30 baselined).
- verify-cites: 0, PASS (2742 files).
- verify-test-claims: 0, PASS (751 claimed tests).
- verify.mjs --offline: 0, PASS.
- node --test scripts suite: 0, 598 pass, 0 fail.

`git diff --numstat 1bc349ae...HEAD`: 9 files, 131 lines (insertions plus deletions), against the 150 budget. The paths are only the nine files.

Push: rc 0, 809127d3..5a45e113. CI read 2026-11-07T21:26:17Z, run id / workflow / head:
- 42415848597 / Product CI — Rust workspace / 5a45e113 (queued)
- 42415848550 / Rust fmt / 5a45e113 (in_progress)
- 42415848586 / Product CI — shell / 5a45e113 (in_progress)
- 42415848554 / Governance CI — plan, queue, site / 5a45e113 (in_progress)
- 42415848549 / Ported notices / 5a45e113 (in_progress)
- Not waited for.

Deviations:
1. The shell-suite hold call put the command group in parentheses (`&& ( ... )`), against "not inside braces or parentheses". The hold was granted and released normally. I noticed after launch and let it finish.
2. I started two wait-loop shells (bounded by loop counters). Both completed. No background shell or process of mine is still running.
3. The commit's trailer shows a git-added sign-off (via `-s`). The message files had no `@` outside the first trailer line.

Hold lines (this project, `also=` elided): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:56956`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:56956 affinity=FF (cores 0-7)`. D: free 219 GiB.

Off-scope noticed, not done: nothing. The CHANGELOG-type cites in verify-cites' advisory output are pre-existing.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. Report files: none written.

State: HEAD 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a == origin/cut/shell-comments-drift-sweep-area-a, in C:/dev/wt/sca; `git status --porcelain --untracked-files=no` empty.
