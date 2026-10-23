*Custodian's filing note (2026-10-22): milestone 4 PR A's Amendment 4 row 15 fix (PA-E3 reads each clicked id again under `id = N`) and the source comment rows 4 and 13 name, by a worker, two commits on 3e14068e to 507197c1, touching `frontends/shell/e2e/attributes.mjs` and `frontends/shell/src/App.tsx` only. The run 20:28:23Z to 20:43:54Z by its transcript (Bash 41, Read 2, Edit 2); its claims were read against that transcript's calls before filing: two commits and two pushes, origin's branch equal to the head, the porcelain empty, no force push or rebase; its development runs' lines are in the transcript, the PA-E3 mutation now failing PA-E3. Its runs are development, not evidence: the evidence is the full series with both e2e mutations at the head after #243 merges (Amendment 4 row 16). No process of the runs was left (the custodian's check after it stopped; ports 5400 and 9223 free). Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 9be9d47c7f8f1a58d4ab82e889fd9c54768f1e37194bc46181dc0fdab359d43d.*

---

Row 15: b1-shell-half PR A at 507197c125179e002eb28fe961e44348466ff66e

**Commits** (both pushed, each in its own Bash call; origin/cut/b1-shell-half-pr-a = HEAD = 507197c1; `git status --porcelain` empty):
- 62d15cf1 `fix(shell): milestone 4 PR A, Amendment 4 row 15: PA-E3 reads each clicked id again under id = N`
- 507197c1 `docs(shell): milestone 4 PR A, Amendment 4 rows 4 and 13: source comment for the case the not-held status item does not cover`
- Both are signed off and carry the two trailer lines.

**Diffs**
- `frontends/shell/e2e/attributes.mjs`:
  - Added an `applyFilter` helper (queryWithFilter plus the same settle wait).
  - After the six unfiltered clicks, the step applies `id = N` for each clicked id and clicks the same point again. The id and the zone must equal the unfiltered read.
  - Then `zone = 'residential'`, as before.
  - The PASS line now names the ids.
  - The header's PA-E3 description and its mutation-expectation line were updated.
  - PA-E1 is untouched. The file went from 340 to 351 lines.
- `frontends/shell/src/App.tsx`: the one-line doc comment on `ATTRIBUTES_NOT_HELD_TEXT` became a block, and no string changed. Its clauses, against the code at 3e14068e:
  - "only the dev-gated `setResidencyArm` switch selects the baseline arm": `residency/residencyArm.ts`, where `DEFAULT_RESIDENCY_ARM` is "candidate", and the `setResidencyArm` hook in App.tsx's `isInstrumentedBuild()`-gated effect.
  - "`pushBatch` runs `withinAttributes`, which calls `onAttributesNotHeld`": `canvas/WorkingCanvas.tsx`, in `pushBatch` (the `withinAttributes(decodeBatch(...), residentRef.current.getBatches())` call) and in `withinAttributes` (the `onAttributesNotHeldRef.current?.()` call).
  - "and only then `residentRef.current.addBatch`, which can refuse (`ResidentVertexCeilingExceeded`)": the same `pushBatch`, in the try/catch after the `traceResidency` call that follows decode.
  - "The candidate arm's `pushTileBatch` refuses no batch": the comment inside `pushTileBatch` ("the candidate arm never refuses a batch (item B)"). `candidateArmSession.ts` ingests through `canvas.pushTileBatch`.
  - The baseline manager's `onBatch` reaches `pushBatch` at App.tsx (`canvas?.pushBatch(streamHandle, batchSeq, payload)`).
  - KNOWN-LIMITATIONS.md is not changed.

**Development runs** (port-5400 harness, approval item 1; copies under `m4a-r15-` names; exe sha256 49045e2d…a675a verified before use; nothing built; no tracked file written by the harness). Three runs of the four allowed.
- Run 1 (no mutation): rc 0, 20:29:42Z to 20:31:53Z.
  - `[PA-E1] PASS (10688ms): 2 oracle ids (242 at notch 0, 240 at notch 0) reached by click …, in 12 hovers`
  - `[PA-E3] PASS (115926ms): unfiltered clicks showed ["[P6 placeholder] NULL","residential","industrial"]; ids ["158","20","22","247","335","337"] each read the same zone again under id = N; under zone = 'residential' 3 clicks all showed residential`
  - The fixtures were hash-identical before and after, and the suite line was `2 PASS, 0 FAIL`.
- Run 2 (the first worker's PA-E3 mutation alone, `readRow(candidate.batch, row)` to `readRow(candidate.batch, 0)` in `src/canvas/clickPick.ts`; development, not evidence): rc 1, 20:32:20Z to 20:33:25Z.
  - `[PA-E3] FAIL (49572ms): PA-E3: clicked unfiltered, id 158 shows zone "residential"; under id = 158 the same pointer shows id 158 with zone "[P6 placeholder] NULL"`.
  - PA-E1 also failed in the same run, with id 242 showing the wrong values. The suite line was `0 PASS, 2 FAIL`.
  - I reverted it at once with `git checkout --` and showed the porcelain: only `attributes.mjs` was modified, and that was committed next.
- A fourth run was not needed. Each run's own PID tree was killed by the harness's down script. The harness's busy script now prints `FREE`, and ports 9223 and 5400 were free.

**Checks at my head**
- `npx tsc --noEmit`: rc 0, no output.
- `npm run verify`: rc 0. vitest ran 104 files and 1413 tests, all passed. The last line is `ℹ duration_ms 9.3976` of the final s5dVerdict test (`ℹ pass 7`, `ℹ fail 0`).
- `node --check e2e/attributes.mjs`: rc 0.
- Lock diffs over `55618ab5...HEAD`: 0 lines. The only dependency-file diff is one `package.json` line, the `e2e:attributes` script.
- verify-cites: rc 0, "PASS … 2207 file(s)". verify-quotes: rc 0, "PASS — 130 checked, 99 verified". verify-test-claims: rc 0, "PASS — all 613 claimed test(s)". verify.mjs: rc 0, "verify:plan PASS".
- Scripts suite: rc 0, 527 pass, 0 fail, 0 cancelled. `guardian parity` ran green, so no single-file re-run was needed.
- §4 text checks, from my own script run line by line and joined: zero matches in `frontends/shell/src` and `renderer/tests` for `requests none`, `requests no projection`, `gains no parameter`, and zero for `Proposed, so it binds nothing` in `viewTransitions.ts`. I did not self-test the patterns positive at base 55618ab5, so that part is not shown.
- `buildLayers.ts`: none of the three patterns match. The stale clause "`viewport_query` carries no attributes" is positive at `buildLayers.ts` line 31, and that edit waits for the docs-lane merge (§2.6). The file is untouched.

**§7** (numstat, added plus deleted, over `55618ab5...HEAD` by the form's command)
- A-E = 433 of 570: `attributes.mjs` 351 of 420, and the generator (`kernel/tests/manual_walkthrough_fixtures.rs`) 82 of 90.
- A-P = 479 of 1,094. A-T = 981 of 1,860.
- Per-file overruns:
  - `style/document.ts` 7 against 6, the known class 8 of Amendment 4 row 1.
  - `viewportStreamManager.test.ts` 88 against 40.
  - `candidateArmSession.test.ts` 149 against 60.
  - The last two are named in Amendment 4 row 2 as class 8, to be recorded in the closing amendment.
- Changed files with no per-file line in the §7 table, all within their group totals:
  - Product: `feature/clickEffect.ts` 7, `canvas/tileIngest.ts` 2, `canvas/tileResidentSet.ts` 10.
  - Tests: `testUtils/attributeBatchIpc.ts` 56, `tileResidentSet.test.ts` 46, `clickEffect.test.ts` 31, `tileIngest.test.ts` 24, `buildLayers.test.ts` 9, `pick.test.ts` 8, `App.command.test.tsx` 4, `App.selection.test.tsx` 2, `highlightLayers.test.ts` 3, `WorkingCanvas.wiring.test.tsx` 3, `residentSet.test.ts` 1.

**Invalidators and disclosures**
- No invalidator was met. Only the two named files changed in my commits. `buildLayers.ts`, ports, lockfiles and SKP are untouched.
- The harness ran on port 5400 under the approval. Vite served this worktree, so no rebuild was needed.
- Per-file ceilings of the two Amendment 4 row 2 test files are overrun as noted above.

**Hold lines** (my project only): MACHINE_HOLD/MACHINE_RELEASED pairs for run 1, run 2, tsc plus verify, and the scripts suite. The two e2e runs and the scripts suite were backgrounded; verify-cites, verify-quotes, verify-test-claims and verify.mjs ran in the foreground, outside the hold.

**Pre-gate self-check:**
1. Cross-module interfaces: the `__SPATIAL_E2E__.queryWithFilter` hook and the Feature tab DOM read were used as they exist. The first run proved the `id = N` filter against the real fixture.
2. Completion claims point to evidence: the run logs in my scratch folder (`m4a-r15-h/out/m4a-r15-run1.log`, `m4a-r15-run2mut.log`) and the check outputs under `m4a-r15-*`.
3. No new user-facing text. The comment is source only.
4. The assertions were reached: run 1 printed both PASS lines, and run 2 printed PA-E3's own new-half FAIL message.

**Model:** I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

**Off-scope noticed, not done:** the self-test of the §4 patterns at base 55618ab5 was not rerun (see above).
