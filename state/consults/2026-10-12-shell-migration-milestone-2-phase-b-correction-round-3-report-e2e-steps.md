*Custodian's filing note (2026-10-12): the worker-high's report on PR #217's correction round 3, the e2e steps E-DBLCLICK (item (b)) and E-ASK-TWO (item (a)) in selection.mjs, branch cut/shell-migration-milestone-2-phase-b at f18dbefb4f119dcbecdba7c714d5a3cb4960fd19, the run 2026-10-12T17:48:41Z to 2026-10-12T17:58:02Z by its transcript (Read 9, Bash 22, Grep 1); its one SubagentHandback call, at 17:58:01Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is 0d76b22c13cef4cb9c3107e19a5e7de2eee110ff9bbe82d3625e704e6b4600f8; this file's, from line 5 to the end, is 0d76b22c13cef4cb9c3107e19a5e7de2eee110ff9bbe82d3625e704e6b4600f8. The steps were written, not run, by the worker; the custodian runs them, with their two mutations, under the harness approval.*

---

Both e2e steps are written, committed and pushed. I did not run the e2e, so neither step has run against the real app.

**Head:** f18dbefb4f119dcbecdba7c714d5a3cb4960fd19 on cut/shell-migration-milestone-2-phase-b, equal to origin after a fetch. At the start, after `git fetch origin`, the head was a8aa46b2 and the porcelain was empty.

**Files and counts (insertions plus deletions from a8aa46b2)**
- `frontends/shell/e2e/selection.mjs`: 60 (+60, -0). That leaves 40 of the round's 100, so item (c)'s ~30 fits.
  - 2 lines of header mutation entries, as comments
  - 53 lines for the two steps
  - 2 `runStep` lines
- `frontends/shell/e2e/README.md`: 2 (+1, -1), against your limit of 6. I edited the existing "Asserted, each as a named step" line in place, adding one entry per step. The inconclusive sentence in that line now covers E-ASK-TWO.
- E-KINDS is untouched. The README's "whole CSS pixels" sentence is untouched (item (c)'s).

**E-DBLCLICK (`stepDblClick`)**
- **Position:** right after the E-SEL-PAN block, before E-SEL-FILTER, with `runStep("E-DBLCLICK", 600_000, ...)`.
- **Why there:** the step reopens `filter-zoned` with `openFixture`. A rebind clears the inspected feature and the selection, so no feature is inspected beforehand. It then builds its own scene with `buildScene` (want 1, min 1), and its double-clicks zoom the view.
- **Why later steps are safe:** E-SEL-FILTER starts by clearing the selection, zooming to the layer and building its own scene. Every later step reopens or zooms to the layer itself. E-GEN's precondition (a standing selection) is created by E-SEL-FILTER, which runs after this step.
- **Sequence:**
  1. Navigate, show the Feature tab. A precondition expect requires `id === null` and `selected === 0`.
  2. Read the zoom: the last `view-state` render-trace line's `zoom` field. The regex is the same shape regression.mjs parses.
  3. `page.mouse.dblclick` at the scene feature's CSS point, then `waitForSettle` (1500 ms quiet), which is past the 300 ms tap delay and the zoom transition.
  4. Assert the Feature tab id is null, Selected is unchanged, and the zoom rose.
  5. Select with mode "Add only", double-click again, assert Selected unchanged.
  6. Back to Navigate. Take the oracle id at the same point through `hoverIdAfterBarrier` (the camera has zoomed, so the oracle id is re-taken, with no first poll of my own). Then `clickAt` and poll `readTab`.
  7. Assert the inspected id equals the oracle id.
- **Mutation:** remove the `if (event.type === "dblclick") return;` line in `src/canvas/WorkingCanvas.tsx`.
  - **Assertion that fails:** the Navigate one, `E-DBLCLICK: a Navigate double-click on id N left the Feature tab showing id M; none was expected`.
  - The Select count assertion would fail next, but the step throws at the first.
- Both mutation entries are recorded in the file's header comment.

**E-ASK-TWO (`stepAskTwo`)**
- **Position:** last, after E-ASK-STATEMENT, with `runStep("E-ASK-TWO", 600_000, ...)`. It leaves `filter-zoned` admitted and nothing runs after it.
- **Sequence:**
  1. `startExportThenOpen`: opens the 100k fixture, starts the first export and the pending open. It already throws INCONCLUSIVE if that export ended before the ask was read.
  2. Await `__askRun.promise` and require `status === "success"`.
  3. With the ask standing, `prepareExport` to `freshDestination("ask-two")`, then `executeExport`. Require a prompt, then success.
  4. Before the choice, read whether `.open-during-export-ask` is present and whether `__askOpen.promise` is still pending (a race against a 100 ms timer). If either is false, throw `E-ASK-TWO: INCONCLUSIVE (class 2, never a pass)`.
  5. Click `.open-during-export-cancel` and require the open `admitted`.
  6. Poll up to 10 s until there are at least 2 `.late-cancel-path` elements.
  7. Assert the path texts equal `[first.bundle_path, second.bundle_path]` exactly, in that order.
  8. Assert there are exactly 2 `.late-cancel-text` elements, each matching E-ASK-STATEMENT's pattern.
  9. Assert `manifest.json` exists under both bundles.
- **Mutation:** replace the append at the choice in `answerOpenAsk` with `setLateCancel([finished])`.
  - **Assertion that fails:** the paths one, `E-ASK-TWO: the statements name ["<second>"]; the outcomes' bundle_paths, in the order the runs ended, are ["<first>","<second>"]`.
  - The poll waits its 10 s first, because only one path ever shows.

**Commands and exit codes (all in `C:/dev/wt/mm2b`)**

| Command | Exit code |
|---|---|
| `node --check frontends/shell/e2e/selection.mjs` | 0 |
| `npm run verify` in `frontends/shell`, inside a shared hold (granted, then released) | 0 |
| `node scripts/plan/verify-cites.mjs` | 0 |
| `node scripts/plan/verify-quotes.mjs` | 0 |
| `node scripts/plan/verify-quotes.mjs --show-cites` on the two files | 0 (nothing checked) |
| `node scripts/plan/verify-test-claims.mjs` | 0 |
| `node scripts/plan/verify.mjs` | 0 |
| `git commit -s` | 0 |
| `git push origin cut/shell-migration-milestone-2-phase-b` (a8aa46b2..f18dbefb) | 0 |

- `npm run verify`: 93 test files and 1,333 tests passed, residency-trace 76 passed and 0 failed, citation-integrity 30 passed and 0 failed.
- `verify-cites`: 1,849 files, 60 advisories.
- `verify-quotes`: 121 checked, 90 verified, 30 baselined, 1 advisory.
- `verify-test-claims`: 560 claims over 164 files.
- No exit code from 96 to 99 came from the machine script.

**What the custodian must know to run it**
- **Fixtures:** the same as the existing suite (`filter-zoned` and `100k-happy-path`). Nothing new.
- **Time added:**
  - E-DBLCLICK: one reopen, one scene build and two 1.5 s settles. It will probably take under a minute or two.
  - E-ASK-TWO: two whole-file exports of the 100k fixture, about twice E-ASK-STATEMENT.
- **E-DBLCLICK (assumptions that may not hold in the real app):**
  - It assumes deck delivers the double-click as one `dblclick` and no `click`, per the architect's check.
  - It assumes the Orthographic controller's double-click zoom raises the `view-state` zoom.
  - If the zoom assertion fails because no `view-state` line parses from the console text, that is a harness read problem, not a product finding.
  - After the first double-click, the pointer stays at the same world point, so the single-click point still lies in the same feature. The oracle id is re-taken to avoid relying on that.
  - Select mode is left at "Add only". E-SEL-FILTER and the later steps set their own mode.
- **E-ASK-TWO:** it writes two bundles under `target/e2e-selection-out/ask-<ts>` and `ask-two-<ts>`, both git-ignored.
- **Machine:** I ran only `npm run verify` under a hold. The plan scripts and the node check ran outside it, being short and light.

**Pre-gate self-check**
- Cross-module interfaces: the steps use the dev hooks `publishExecute`, `publishPrepareWithDestination` and `openPath`, and the DOM classes, as `startExportThenOpen` and E-ASK-STATEMENT already do.
- Evidence: `npm run verify` and the plan scripts exit 0, shown above. Neither step has run.
- Messages: the new failure messages describe the assertions in the code.
- Assertions: no mutation was applied (the e2e is not runnable here). The failing assertion for each is reasoned from `App.tsx`, `WorkingCanvas.tsx` and `clickEffect.ts` as read, not observed.
- Model: Sonnet 5.5, no override, no context handoff.

**Commit note:** `git commit -s` puts the Signed-off-by line after the Co-Authored-By line. I did not add the Claude-Session trailer.

**Final porcelain:** empty.
