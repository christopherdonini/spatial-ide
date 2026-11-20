*Filed by the custodian: P4a-3's worker, its second (the hooks) hand-back (claude-sonnet-5-5), 4640 bytes, sha256 36da1c2b8e25643147a3cba00019346cd6eb2a065054169776e8fe2636222e35, below the rule, byte for byte but for 2 of the project name as <m>, with one final newline added. Calls Bash 10, Write 2, SubagentHandback 1, 0 errored, from 2026-11-20T08:48:38Z to 2026-11-20T08:53:41Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-3, worker (partial, as the custodian's resume message directed). Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. Port 5180 is still unfree, so no suite was run and the README is unchanged.

COMMIT (pushed)
- da94ae0b8fbd4ed1af926e2d01a70ef670da0ff2, `feat: the reopen's three DEV-only e2e hooks (B2 piece 1c, Amendment 54 item 7 (a))`.
- Pushed head: cut/b2-piece-1c-p4a at da94ae0b (7cb3d90b..da94ae0b, push rc 0, log 1cp4a3-push1.log).
- Seam read, cited in the commit body: `AdmissionPanel.tsx` handleProjectPick and handleRelink, `App.tsx` handleSaveProject's reads, and `registerE2eHook`.

RUNS (each in its own shared hold)
- `npm run typecheck`: rc 0, log 1cp4a3-typecheck1.log.
- `npx vitest run src`: rc 0, 1569 passed (1569), log 1cp4a3-vitest1.log.
- Both ran with the three hooks in the working tree, before the commit.
- Hold lines, masked: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<shell> also=<m> (...)`, then `MACHINE_RELEASED project=<m> shell=<shell> affinity=FF (cores 0-7)`, for each of the two runs. Neither had a MACHINE_WAITING or MACHINE_ERROR line.

HOOKS
- `e2eOpenProjectFolder?: (folder: string) => Promise<string>`
  - Registered in `AdmissionPanel.tsx`.
  - It puts the folder in a one-shot slot read by `takeSlot`, then awaits `handleProjectPick`. That is the click's handler, which now returns `AdmissionOutcome | null`.
  - It answers `admitted`, `question`, `not_found`, a refusal's code, or `dropped`.
- `e2eRelinkFile?: (file: string) => Promise<string>`
  - Registered in `AdmissionPanel.tsx`.
  - If the state ref is `not_found`, it fills the file slot and awaits `handleRelink(state.folder, state.options)`, which now returns the outcome. Otherwise it answers `not-asked`.
- `e2eReadWorkspace?: () => Promise<{filter: string|null; clauses: {text; enabled}[]; style: StyleState|null; view: {centre: [number, number]; zoom: number}|null}>`
  - Registered in `App.tsx`, as a read-only counterpart to `e2eSaveProjectToFolder`.
  - It reads the drawn view's `filter.predicate`, `viewClauses`, `style` and the canvas's `currentView`.
- All three are registered through `registerE2eHook` behind `isInstrumentedBuild()`.
- Product-caller grep: the only caller of each is `e2e/reopen.mjs`, which is uncommitted. That is the declared DEV-hook exemption (Amendment 54 item 10).

COUNTS
- Command: `git diff --numstat 7f7eb6d6...HEAD` with the form's excludes. Output is in `1cp4a3-numstat.txt`.
- This commit: App.tsx +15/-0, AdmissionPanel.tsx +40/-6, e2e-test-surface.ts +16/-0. That is 71 added, 6 deleted, 77 in both columns.
- Shell product group at HEAD: my awk over non-test files under `frontends/shell/src/` gives 801 added and 37 deleted. In both columns that is 838, 18 over the 820 ceiling. By the brief's own figures (773 before this commit plus 77), the group is 850.
  - The two figures disagree, so the reviewer recounts.
  - Either way it is over 820: class 8, finished as written (ADV-2026-11-19-12 item 6). Nothing was cut or packed.
- The other groups were not separately counted. This commit touches only the three product files above.
- Lock-file check of the three lock/package files: not run, because nothing near them changed.

SUITE (uncommitted)
- `C:/dev/wt/1c-p4a/frontends/shell/e2e/reopen.mjs`, 457 lines (ceiling 485), syntax-checked with `node --check`, not run.
- Untracked in the worktree (`git status --porcelain` shows only `?? frontends/shell/e2e/reopen.mjs`).
- It covers R1 to R9 and E-CHANGED.
- It takes the fixture from this worktree's own generator output, `<repo>/target/fixtures/manual-walkthrough/filter-zoned.parquet`, never from the main checkout. The path is derived from the file's own location. Its error message gives the regeneration command, which needs a heavy cargo run in a hold. The fixture does not exist in the worktree yet.
- `e2e/README.md` is unchanged, as instructed.

REPORT ITEMS FOR THE ADVISOR AND CUSTODIAN
- The README entry will need `node e2e/reopen.mjs`: `package.json` has no `e2e:reopen` script and must not change.
- The suite reads S8's text, the own-window place and others from `reopenNotices.ts` by constant name. It reads the Console right after each call, and it prints the ring label and the entries newer than the row at R5 and R6.
- R8 assumes a hand copy Q of P gives `question` while P is still open in the window. That is the form's R8 as written, and it is untested.
- Nothing is running: no app, dev server or background process of mine remains.
- Still blocking: port 5180 for the suite runs, and the README wording ruling.
