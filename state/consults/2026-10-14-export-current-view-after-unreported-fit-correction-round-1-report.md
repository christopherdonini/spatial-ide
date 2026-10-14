*Custodian's filing note (2026-10-14): the worker-high's report for PR #219's correction round 1 (the form's Amendment 6: the e2e suite's open step waits for the canvas hook; the disabled reason's comment), built in C:/dev/wt/cvfix from eebf7298; the head e3a140427b3b60b96ab56c1f87aa0be2df127d99, pushed and checked by the custodian (porcelain empty; local equals origin). The run 2026-10-14T12:44:05Z to 2026-10-14T12:52:48Z by its transcript (Read 5, Bash 12, Grep 1, Edit 3); its one SubagentHandback call, at 12:52:47Z. Extracted by script; 0 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is a52c0c6b5d040ea906434a34ce09d9ecd0011cc9fef12669a728fecda747347d; this file's, from line 5 to the end, is a52c0c6b5d040ea906434a34ce09d9ecd0011cc9fef12669a728fecda747347d. The e2e is the custodian's, recorded separately.*

---

Correction round 1 of PR #219 is built, committed and pushed. The new head is e3a140427b3b60b96ab56c1f87aa0be2df127d99 (parent eebf7298), on cut/export-current-view-after-unreported-fit. The worktree was clean at eebf7298 before I started, and origin matched. Porcelain is empty at the end. I did not run e2e.

Commit message: `fix: export-view open step waits for the canvas hook; the disabled reason's comment says the words are the human's`. It is signed off and ends with the Co-Authored-By line you named. The push was a plain `git push origin cut/export-current-view-after-unreported-fit`, eebf7298..e3a14042. The diff is 2 files, 3 insertions and 2 deletions.

**Change 1: `frontends/shell/e2e/export-view.mjs`, `stepOpen`.**
- The first-pixels poll now reads `capturePixels` only when `typeof window.__SPATIAL_E2E__?.capturePixels === "function"`. Otherwise the read returns 0, which counts as nothing drawn yet.
- The bound is the same `RESIDENT_TIMEOUT_MS`, and the predicate is still `n > 0`.
- I added one comment line above the poll saying that the hook is registered when the canvas mounts, after the open is admitted. That is the +1 in the export-view.mjs count.
- No other step, assertion or mutation text changed.

**Change 2: `frontends/shell/src/publish/PublishPanel.tsx`.** The comment on `CURRENT_VIEW_DISABLED_REASON` is replaced; the constant's value is unchanged. The new comment, byte for byte:
`/** Why "Current view" is disabled (the form's section 2.4, OPEN-1 (a)). These words are the human's, approved on 2026-10-14 (the form's Amendment 4, item 3). */`

**Other steps that could run before the canvas mounts.** None. The other hooks the file calls are `residentCounts` (registered at the top level in App.tsx:1213), `queryWithFilter`, `e2eSetViewState` (WorkingCanvas.tsx:2323) and `publishPrepareWithDestination` (PublishPanel.tsx). Each is first called after `stepOpen`'s first-pixels poll has passed. The one hook called before the poll, `openPath`, is awaited by the ready check in `main`. I changed nothing else.

**Commands and exit codes**, all in the worktree, with 600 s timeouts where a timeout was used:

| Command | Exit code | Result line |
|---|---|---|
| `node --check e2e/export-view.mjs` | 0 | |
| `npx tsc --noEmit` in `frontends/shell` | 0 | |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 38 loose references advised |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 121 checked |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 560 claims |
| `node scripts/plan/verify.mjs` | 0 | `verify:plan` PASS |

**§7 count at e3a14042.** I ran the form's own command against merge base f8bc295162c2520dee37541c5ee2c9203900a016: `git diff --numstat f8bc2951...HEAD -- frontends/shell` with the three excludes. The branch totals 468 lines over 8 files, against Amendment 5's 467 before this round.
- `e2e/export-view.mjs` is 189 (188 before), against its ceiling of 220.
- `src/publish/PublishPanel.tsx` is 72 (35 insertions plus 37 deletions), unchanged and still over its ceiling of 60. The comment swap is one line in and one line out.
- Per-file numstat for the rest:

| File | Insertions | Deletions |
|---|---|---|
| `package.json` | 1 | 0 |
| `src-tauri/src/publish.rs` | 24 | 2 |
| `src/App.selection.test.tsx` | 100 | 11 |
| `src/App.tsx` | 7 | 24 |
| `src/publish/PublishPanel.test.ts` | 21 | 12 |
| `src/publish/types.ts` | 2 | 3 |

**Final porcelain:** empty. origin/cut/export-current-view-after-unreported-fit is at e3a14042.
