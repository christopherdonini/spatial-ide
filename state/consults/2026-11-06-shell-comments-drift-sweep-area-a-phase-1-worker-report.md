*Custodian's filing note (2026-11-06): the phase 1 worker's report for `shell-comments-drift-sweep-area-a`, built at 809127d3 on `cut/shell-comments-drift-sweep-area-a` under its five-line form (`governance/forms/frontends/SHELL-COMMENTS-DRIFT-SWEEP-AREA-A-PREREGISTRATION.md`, the custodian's settlement). Dispatched at 2026-11-06T18:10:22.674Z by its transcript from a brief of 8299 bytes (sha256 b31674c36582954a22add3277001466083f7491ac6862c53171e54983a942b09). The run to its final hand-back at 2026-11-06T18:35:16.057Z by its transcript (claude-sonnet-5-5; unique calls Bash 55, Read 5, Write 3, Edit 2 and two hand-backs, 67). Two hand-backs, both below, byte for byte with one final newline each. The first, at 2026-11-06T18:28:59.283Z (sha256 e42da3e8b8db4982c855b186f926d92e1b40de01353d4000071b378f3ddef611), is a stop at the commit: the brief said commit with no `-s`, and the repository's DCO hook needs a sign-off, which was the custodian's error. It also named no install for the viewer that `npm run typecheck` and `npm test` build first. In it, one path, the session scratch folder, a user-profile path, is written as `<the session scratch folder>/`. It holds each finding's comment before and after, with the code. The custodian's correction reached the worker by message at 2026-11-06T18:29:48.927Z by the transcript: `git commit -s -F` after showing one `@` line; `npm ci` in renderer/bundle-viewer from its lockfile; the suite as written; the scanner deviation accepted. The second (sha256 1942c098617679fbe377a1d04a79461f24932b491a9f63920ea2ec86e5c53a20) is the build. The custodian re-read, after a fetch: the branch at 809127d3eebde501ccc089e77667c5257deb0123, one commit on 8fdf8d69; `git diff --numstat origin/main...` 57/39 over exactly the eight phase 1 files; the message's lines with an `@` are the Co-Authored-By trailer and the Signed-off-by that `-s` added. CI at the head was read at 2026-11-06T18:35:31Z (Ported notices passed, Product CI shell in progress); it is read again before the gates, which come after phase 2. Model output, not Authority.*

---

Stopped: shell-comments-drift-sweep-area-a phase 1 is edited and checked in `C:/dev/wt/sca`, but not committed or pushed. HEAD is still 8fdf8d693492634b1cad0a00701aa55bfbe28b68, with the eight files staged.

**Why I stopped**
- Step 5 says `git commit -F`, with no `-s` and no Signed-off-by. The repo's commit hook rejects that: "error: commit has no Signed-off-by trailer (DCO 1.1 ... fix: git commit -s)".
- `-s` would add a Signed-off-by line carrying the account email, which the brief forbids. I did not bypass the hook.
- Ruling needed: allow `git commit -s` for this commit, or tell me another route. The message is ready at `<the session scratch folder>/sca-p1-msg.txt`.

**Second blocker: `npm run typecheck` and `npm test` cannot run as written**
- Their pre-hooks need `renderer/bundle-viewer/node_modules`, and the brief says install nothing else. `npm run typecheck` printed "buildViewerFirst: ...renderer\bundle-viewer\node_modules not found".
- I ran the underlying commands instead:
  - `npx tsc --noEmit`: rc=0.
  - `npx vitest run`: rc=1, 18 failed files / 91 passed. Tests: 18 failed | 1141 passed (1159).
  - Every failure traces to missing artifacts: the viewer `dist/`, `dist-metafile.json` and `src/generated/NOTICE.txt`. These are the App.*, StudioLayout, statusItems, tauriConfig, duckdbAmalgamation and noticeByteIdentity tests.
  - `noCoordinateLeak`, `noCut2Language` and `soleCaptureSite` all pass: 3 files, 7 tests, rc=0.
  - I did not run a base-commit vitest to compare. The failures are explained by the error messages only.
- `npm run test:citation-integrity`: rc=0, "30 passed, 0 failed".
- `npm ci` ran in the hold, rc=0. `package-lock.json` sha256 is unchanged (8e5031937d33...).

**Rule (00)**
For every `cut/` branch on origin, `git diff --name-only origin/main...origin/<branch>` listed none of the eight files.

**Findings: all six held at the base. Each comment was rewritten from the code (`@ 8fdf8d69`, the base).**
- **A1 (`candidateArmSession.ts` header):** the dead-code claim is gone. It now says the arm defaults to "candidate", `App.tsx` calls `shouldConstructCandidateSession()` with no `isInstrumentedBuild()` operand, and `startCandidateArmSession` is not on `check:dist-clean`'s forbidden list. Code: `residencyArm.ts:50,84-86`, `App.tsx:1611`, `e2e/checkDistClean.mjs:90-99`.
- **A9 (`candidateArmSession.ts` `tileGridLevel` doc):** the "dev-gated read" and "DEV-only selector" wording is replaced by "an ungated call, made where the session is constructed". Code: `App.tsx:1624`.
- **A9 (`residencyTileSizeLevel.ts`, plus its first paragraph under OPEN-3 (a)):** "DEV-only counterpart" is dropped. The gated callers are named as the hook registrations and the open/closed notifications, and the ungated `App.tsx` read is stated. Code: `App.tsx:1246,1334-1335,1555,1624,1713,1907`.
- **A7 (`FilterPanel.tsx`):** "No consumer ... exists" now says the command bar's field completion lists column names. The 200px floor is called history, citing `styles.css`'s header. Code: `CommandBar.tsx:95`, `fieldCompletion.ts:46-50`, `App.tsx:2037`.
- **A8 (`DescribeSummary.tsx`):** "both render only within this component" and `.canvas-status-stack` are gone. The path is now `governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md`. It now says the same two facts also render in the status bar as `WatcherStatusItem`. Code: `App.tsx:2378`, `layout/statusItems.ts:27-35`, `layout/contributions.ts:50-54`. The P6 `<dt>` strings are untouched.
- **A10 (`recorder.ts` header and `recordNamed` doc):** the fence is stated per exported name. The class-C list adds `notices/NoticesPanel.tsx` and `layout/StudioLayout.tsx`. `console/ConsolePanel.tsx` is described as importing both names, with the scan allowing it as a self-reference. Code: `soleCaptureSite.test.ts:36,49-61`, `ConsolePanel.tsx:18`.
- **A11 (`pick.ts`, `tileGrid.ts`, `renderTrace.ts`):** the off-target cites now point at items by name, with no line number (OPEN-4 (a)). The tileGrid history cites with no commit are dropped. The on-target `tileIngest.ts:43-51` is kept.

**Token proof (script `sca-p1-tokens.cjs`) at the uncommitted worktree vs base: all equal.**
```
DescribeSummary.tsx 553/553 equal=true
pick.ts 342/342 true
tileGrid.ts 1515/1515 true
recorder.ts 847/847 true
renderTrace.ts 587/587 true
FilterPanel.tsx 608/608 true
candidateArmSession.ts 3390/3390 true
residencyTileSizeLevel.ts 166/166 true
ALL_EQUAL=true
```
- Self-test on a scratch git repo: one identifier changed gives `equal=false` (rc=1). A comment-only change gives `equal=true`.
- **Deviation:** the bare `ts.createScanner` mis-scans files with template literals and JSX. On `tileGrid.ts` it gave 725 vs 704 tokens for a pure-comment diff. The script therefore takes the leaves of `ts.createSourceFile` (the compiler's own scanner, trivia skipped, `ScriptKind.TSX` for the two `.tsx` files), with JSDoc nodes skipped. Say if you want the raw scanner anyway.

**Root checks, run before the commit on the worktree (not after it)**
- `verify-cites`: rc=0, PASS.
- `verify-quotes` (in the hold): rc=0, "verify:quotes PASS — 138 checked ... 920 ruling cites resolved, 0 ruling-cite errors".
- `verify-test-claims`: rc=0, PASS.
- `verify.mjs --offline`: rc=0, "verify:plan PASS".
- Not run: `node --test` on the scripts suites, because I stopped before the commit.

**Numstat and CI**
- Uncommitted diff: 8 files, 57 insertions and 39 deletions, only the eight. The committed `origin/main...HEAD` numstat is not run.
- No push, so there is no CI locator.

**Held machine lines (this project only)**
- Six shared holds, each released: `npm ci`, the typecheck attempt, tsc, vitest, the scans, `verify-quotes`.
- No background shell or process is left running.

**Notes**
- `e2e-test-surface.ts` is untouched.
- Self-check on the four failure classes:
  - Interfaces: every comment was read against the actual code on the other side of its seam.
  - Completion claims: the committed-state claims have no proof yet, because there is no commit.
  - User-facing messages: no string the app shows changed.
  - Required tests: the three src-text scans reached their assertions. The full suite did not, for the artifact reason above.

**State and model**
- `git status --porcelain` shows 8 `M` lines staged: `DescribeSummary.tsx`, `pick.ts`, `tileGrid.ts`, `recorder.ts`, `renderTrace.ts`, `FilterPanel.tsx`, `candidateArmSession.ts`, `residencyTileSizeLevel.ts`.
- Model per the harness: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

---

Built: shell-comments-drift-sweep-area-a phase 1 at 809127d3eebde501ccc089e77667c5257deb0123

The branch `cut/shell-comments-drift-sweep-area-a` is pushed. Base is 8fdf8d693492634b1cad0a00701aa55bfbe28b68. It is one commit, `git commit -s -F`, and it adds no hook bypass.

**Pre-commit check:** `grep -c @` on the message file gave 1, the Co-Authored-By line. `-s` added the Signed-off-by (email elided here).

**Suite at the head, one shared hold, in order:**
- `npm ci` in `renderer/bundle-viewer`: rc=0. Lockfile sha256 before and after both 6ccfc6deeb0a...a617 (unchanged).
- `npm run typecheck` in `frontends/shell`: rc=0. Last line is `> tsc --noEmit`.
- `npm test` in `frontends/shell`: rc=0. Test Files 109 passed (109), Tests 1446 passed (1446). The output ends with a vitest note about jsdom.
- `npm run test:citation-integrity`: rc=0. Last line `== 30 passed, 0 failed ==`.
- `git status --porcelain` in `C:/dev/wt/sca` after the suite and after `node --test`: empty (0 lines). No build step changed a tracked file.

**Root checks:**
- The earlier `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs --offline` runs all gave rc=0, but they ran on the uncommitted worktree. I did not re-run them at the committed head.
- `node --test` over the three script suites: rc=0, tests 598, pass 598, fail 0.

**Token proof at committed HEAD vs base (leaves of `ts.createSourceFile`, JSDoc nodes skipped):** all eight equal, `ALL_EQUAL=true`.
- DescribeSummary.tsx: 553/553
- pick.ts: 342/342
- tileGrid.ts: 1515/1515
- recorder.ts: 847/847
- renderTrace.ts: 587/587
- FilterPanel.tsx: 608/608
- candidateArmSession.ts: 3390/3390
- residencyTileSizeLevel.ts: 166/166

The self-test from my earlier report stands: a changed identifier gives `equal=false`, a comment-only change gives `equal=true`.

**Numstat (`origin/main...HEAD`)** shows only the eight files, 57 insertions and 39 deletions, against the declared 150:
- DescribeSummary.tsx 5/4
- pick.ts 2/1
- tileGrid.ts 7/7
- recorder.ts 13/7
- renderTrace.ts 2/2
- FilterPanel.tsx 7/3
- candidateArmSession.ts 13/9
- residencyTileSizeLevel.ts 8/6

`--name-only` lists 8 files.

**CI**, read 2026-11-06T18:35:00Z, head sha 809127d3eebde501ccc089e77667c5257deb0123 on both runs:
- run 42271969684, "Product CI — shell": in_progress at the read, not yet green.
- run 42271969585, "Ported notices": completed, success.

I did not wait for the shell run to finish. Re-read it before any gate.

**Findings, deviations, notes:**
- All six findings held at the base. Before/after for each, with the code it rests on, is in my earlier report in this thread (bodies unchanged by the commit).
- Deviation, accepted by you: the token proof uses the leaves of `ts.createSourceFile` instead of the bare scanner.
- Deviation: I ran the frontends checks before committing, then repeated the full suite after.
- `e2e-test-surface.ts` is untouched (phase 2).

**Housekeeping:** shared holds were taken and released for each heavy command, six in the earlier run and two in this one. No background shell or process is left. Model per the harness: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
