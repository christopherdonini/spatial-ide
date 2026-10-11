*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 11, the reviewer's gate 5 D1 (the doc comment of resetFitForNewGeneration), the worker run 13:22:49Z to 13:24:48Z by its transcript, on cut/shell-map-refill-after-resize, head e8f39d291a36dfe9fc6efaa85ea53c58b50662da, published; the custodian checked edfa187f..e8f39d29 changes 3 lines of WorkingCanvas.tsx, each a doc-comment line. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is c2f7810916345e50b1418f59bfbf743ad1f7be62420e59c89786bc14e6804fa4.*

---

D1 is fixed and pushed. The new head is e8f39d291a36dfe9fc6efaa85ea53c58b50662da, on top of edfa187f, in one signed-off commit with the requested message and trailer. Before editing, HEAD and origin/cut/shell-map-refill-after-resize both equalled edfa187fbd7817ff493159e4ed90fdf046eaf738, and `git status --porcelain` was empty.

I read App.tsx:336-338 (`applyFilter` resets on `issued`, on both arms) and the gate's D1 pins before writing the clauses. The change is 3 lines in `/c/dev/wt/refill/frontends/shell/src/canvas/WorkingCanvas.tsx`, comment only, in the doc comment of `resetFitForNewGeneration`.

Old text:
```
   * called, on the candidate residency arm, at the start of a reissue begun while the session is live
   * (`candidateArmSession.ts`'s `reissueUnrestricted`; an Apply after the session has ended runs none,
   * because that function returns before the reset) and at the open's first look (`App.tsx`); on the
   * baseline arm, after an issued outcome (`App.tsx`'s `applyFilter`).
```
New text:
```
   * called, on both arms, after an issued outcome (`App.tsx`'s `applyFilter`); on the candidate
   * residency arm, also at the start of a reissue begun while the session is live
   * (`candidateArmSession.ts`'s `reissueUnrestricted`; an Apply after the session has ended runs none,
   * because that function returns before the reset) and at the open's first look (`App.tsx`).
```

Runs, with exit codes:
- `git fetch origin`: rc 0.
- Comment-only proof (node script): it prints `equal`, and the control prints `not equal`. The control changed one token, `const` to `cons7`. The script compared the HEAD blob with the edited working file before the commit; the commit then contains only that edit. rc 0.
- `npx vitest run src/canvas/WorkingCanvas.test.ts` in `frontends/shell`: 1 file passed, 41 tests passed. rc 0.
- `node scripts/plan/verify-cites.mjs`: PASS, 1685 files, 49 loose advisories. rc 0.
- `node scripts/plan/verify-quotes.mjs`: PASS, 121 checked, 90 verified, 30 baselined, 1 advisory, 0 errors. rc 0.
- `git commit -s`: rc 0.
- `git push origin cut/shell-map-refill-after-resize`: a plain push, edfa187f..e8f39d29. rc 0.

Final `git status --porcelain`: empty.

I changed nothing off scope.
