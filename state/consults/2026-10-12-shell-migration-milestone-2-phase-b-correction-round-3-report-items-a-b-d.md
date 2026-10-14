*Custodian's filing note (2026-10-12): the worker-high's report on PR #217's correction round 3, items (a), (b) and (d) of Amendment 14 (item (c), OPEN-15, waits on the human), branch cut/shell-migration-milestone-2-phase-b at a8aa46b2085326483327009f17b8aa5ca97259a0, the run 2026-10-12T17:33:01Z to 2026-10-12T17:43:23Z by its transcript (Read 3, Bash 29); its one SubagentHandback call, at 17:43:21Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is 51f835e4c7fa318ce016d8804baa4bc0df195c3bdd5f3b1292a58f36332d601c; this file's, from line 5 to the end, is 51f835e4c7fa318ce016d8804baa4bc0df195c3bdd5f3b1292a58f36332d601c. Its test-count sentence under npm run verify is the worker's own arithmetic; the gate recounts.*

---

Round 3 items (a), (b) and (d) are built and pushed. Head is a8aa46b2085326483327009f17b8aa5ca97259a0 on cut/shell-migration-milestone-2-phase-b, equal to origin after a fetch. Porcelain is empty. Every command exited 0.

I did not touch state/, PLAN.yaml, the form, clickPick.ts, e2e/selection.mjs or e2e/README.md. I ran no e2e and left no background process.

**Start check.** After `git fetch origin` the head was f64418bc and the porcelain was empty.

**Commits** (`fix:`, `-s`, each ending with the Co-Authored-By line you gave; I did not add the Claude-Session trailer from the harness reminder)
1. ac66c4ab: item (a) code, RB12g pass 4, and D2, D3, D5.
2. 41f270b4: item (b) filter and its wiring test.
3. a8aa46b2: the observed mutations, as comments only. Its body says "2 observations, 2 tests".

**Item (a), as built**
- App.tsx: `lateCancel` is `useState<readonly FinishedOutcome[]>([])`.
- Both clears set `[]` (in `handleExportRunning` and `confirmOpen`).
- Both decision sites append with `setLateCancel((shown) => [...shown, finished])` (the choice in `answerOpenAsk`, and the `ended` handler).
- The render is `lateCancel.map((outcome, index) => <LateCancelStatement key={index} outcome={outcome} />)`. The index key is deliberate: the list only grows and is cleared whole, and two runs could share a `bundle_path`. The strings are unchanged and nothing new sits over the map.
- The doc comment now describes the list.
- The test is RB12g pass 4 in App.selection.test.tsx, in the reviewer's probe sequence:
  - the ask stands over a prepare;
  - the prepare ends as a prompt, and the execute finishes with C:/out/first (`Exported.`);
  - the panel runs a second whole-file export, which finishes with C:/out/second, while the ask still stands;
  - it asserts the two executes started and that no statement shows before the choice;
  - then Cancel the export and go on is chosen.
- Pass 4 asserts the `.late-cancel-path` texts equal `["C:/out/first","C:/out/second"]` in that order.
- It asserts the cancels are `[prepareKey, at_g4a, prepareKey, secondExecuteKey]`. That is four runs, one cancel each: the two prepare runs share the dataset handle's key.
- It asserts `closes(handle4)` is 1.
- `styles.css` and `OpenDuringExportAsk.tsx` needed no change; the statements already carry a bottom margin.

**Item (b), as built**
- WorkingCanvas.tsx now has `onClick: (_info, event) => { if (event.type === "dblclick") return; onTap(event); }`, with a short comment. It uses `event.type`, not `tapCount`. No delay was added.
- The test is in WorkingCanvas.wiring.test.tsx: "a double-click event neither picks nor emits, and a click event at the same pixel still does". It sends a `{type:"dblclick"}` event and asserts `onClickPick` is not called and `pickCalls` does not grow. That covers no inspection and no selection change, because `onClickPick` is the single channel for both. It then sends a `click` at the same pixel and asserts `onClickPick` is called once with `kind` `"feature"`.
- The three existing `onClick` stand-ins (lines 247, 264 and 280) already carry `type: "click"`, so none changed.

**Mutations.** Each was applied alone at 41f270b4, the test file run and the failure read, then reverted by `git checkout`. Porcelain was empty after each. 2 observations, 2 tests.

| Test | Mutation | Observed failure |
|---|---|---|
| RB12g pass 4 (App.selection.test.tsx) | the append at the choice becomes `setLateCancel([finished])` | 1 failed, 27 passed, RB12d green. `AssertionError: pass 4: one statement for each bundle, in the order decided: expected [ 'C:/out/second' ] to deeply equal [ 'C:/out/first', 'C:/out/second' ]` |
| the double-click wiring test | the `dblclick` early return removed | 1 failed, 13 passed. `AssertionError: no inspection and no selection change: nothing is emitted: expected "vi.fn()" to not be called at all, but actually been called 1 times` |

Both are recorded in the tests' own comments, in the existing OBSERVED AT style.

**Item (d)**
- D2: appended after the first RB12g mutation comment, byte for byte.
- D3: the comment above the union in `answerOpenAsk` is replaced with the reviewer's words, byte for byte. The line had not moved.
- D5, final text as written in the `lateCancel` doc comment:
  `A run marked at an earlier choice that ends in a bundle while a later ask stands shows its statements, and an export report during that ask ends them before the next choice; that bundle needs the earlier cancel to land after the kernel's last cancel check, a window OpenDuringExportAsk.tsx's constants comment names as shorter than one request round trip.`
- D5 changed two things from the reviewer's words: "its statement" became "its statements", and "ends it" became "ends them". The second change is needed because "its statements" is now the plural antecedent. Everything else is byte-identical.
- I also reworded the first sentence of that doc comment for the list, as part of item (a).

**Budget** (insertions plus deletions from f64418bc to a8aa46b2)

| File | Count | Budget |
|---|---|---|
| App.tsx | 21 (13+8) | 30 |
| feature/OpenDuringExportAsk.tsx | 0 | 10 |
| canvas/WorkingCanvas.tsx | 7 (6+1) | 30 |
| styles.css | 0 | 5 |
| App.selection.test.tsx | 43 | 90 |
| canvas/WorkingCanvas.wiring.test.tsx | 18 | 60 |
| Total | 89 | |

No overrun. The clickPick files and selection.mjs are item (c)'s.

**Commands and exit codes**
- `npm run verify` in frontends/shell, inside a shared hold (granted, then released): 0. 93 test files and 1,333 tests passed (1,332 at f64418bc plus the two new tests, minus one that is now a different count of my pass in RB12g, which is one test; the arithmetic is 1,332 + 1 wiring test = 1,333). Residency-trace 76 passed, 0 failed; citation-integrity 30 passed, 0 failed.
- `node scripts/plan/verify-cites.mjs`: 0 (1,849 files, 60 advisories).
- `verify-quotes.mjs`: 0 (121 checked, 90 verified, 30 baselined, 1 advisory).
- `verify-test-claims.mjs`: 0 (560 claims, 164 files).
- `verify.mjs`: 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 0, 457 pass and 0 fail.
- `verify-quotes.mjs --show-cites` on the four changed src files: 0, nothing checked.
- `git push origin cut/shell-migration-milestone-2-phase-b`: f64418bc..a8aa46b2.
- No exit code from 96 to 99 came from the machine script. The two vitest files were run outside a hold; they are small.

**Pre-gate self-check**
- Cross-module interfaces: I read deck's `onClick` event shape from the existing wiring tests and the architect's Q2 source cites. `LateCancelStatement` and `FinishedOutcome` are used as exported.
- Evidence for each claim: it is a test or a command above.
- Messages: no new user-facing text.
- Assertions: each test reaches its intended assertion, shown by the observed failure messages above.
- Model: Sonnet 5.5, no override, no context handoff.

**What the custodian should run in e2e**
- (a): the selection suite's late-cancel row, plus a probe like c1r with two bundles under one ask. That means two executes finishing while one ask stands, then Cancel the export and go on, expecting two `.late-cancel-path` elements in order. The unit test covers jsdom only.
- (b): a real double-click on a feature in the real app should zoom and leave `feature.inspect` and the selection unchanged (no new row, no selection change), and a single click should inspect or select after about 300 ms as before. This proves that deck delivers `type` "dblclick" in WebView2, which jsdom cannot show.

**Not done, noticed**
- The comments naming `offsetCenter` at WorkingCanvas.tsx (about line 2021) and in clickPick.ts are item (c)'s documentation. I left them.

Final porcelain: empty.
