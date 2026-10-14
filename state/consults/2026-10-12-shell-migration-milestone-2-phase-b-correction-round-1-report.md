*Custodian's filing note (2026-10-12): the worker-high's report on PR #217's correction round 1 of 2 (the reviewer's C1, the architect's C-1 and S2, the document items), branch cut/shell-migration-milestone-2-phase-b at 7ffdb6a7757fd65c2f12a861e9a1f70ddea83e48, the run 2026-10-12T11:57:59Z to 2026-10-12T12:08:39Z by its transcript (Read 9, Bash 38, Edit 4); its one SubagentHandback call, at 12:08:38Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is edd2fe7d0b173b0b618802777367b0e54ff8e95029ff8d0098dbf91c6157c8c7; this file's, from line 5 to the end, is edd2fe7d0b173b0b618802777367b0e54ff8e95029ff8d0098dbf91c6157c8c7. Its section 7 per-file ceilings are read against section 7 without the amendments' additions; Amendment 10 item 1 gives them with the additions.*

---

PR 217 phase B, correction round 1 of 2: done and pushed.

**Head:** 7ffdb6a7757fd65c2f12a861e9a1f70ddea83e48. Before I started, the head was 575cd4b3 and the porcelain was empty. The branch is pushed with a plain push, no PR. Final porcelain is empty. No background process is left.

**Commits** (all `-s`, all with the Co-Authored-By line):
- b258dff0 `fix:` the C1 fix, the `mode.set` row, RB12f and RB12g, and the RB16 assertions.
- 42df913d `fix:` the observed mutations recorded (comments only, plus the test file's header line "RB12a to RB12g"). The body says 4 mutations observed at b258dff0620ea5e46a6a53856b8c70d4c0ce8781, in 3 tests: RB12f and RB12g are new, RB16 is extended.
- 7a0b595d `fix:` the dev-hook message for a dropped open (D3).
- 7ffdb6a7 `docs:` the document fixes (a), (b), (d) and (e).

**Fixes, each with its test and mutation.** I applied each mutation alone, ran `App.selection.test.tsx`, and restored `App.tsx` from a backup copy. Each run failed in exactly one test, 1 failed and 27 passed. The unmutated file passes all 28.
1. **Reviewer C1.** `answerOpenAsk` in `src/App.tsx` now iterates `new Set([...ask.runs, ...exportRunsRef.current.values()])`. It marks each run before calling its `cancel()` once. The statement is still decided per run: at the choice for an ended run, and in the `ended` handler for a running one.
   - **RB12g** runs the sequence in the brief: the prepare run is held, the ask shows, the prepare ends into the prompt, the phrase is submitted, and the execute starts. Then it chooses Cancel the export and go on.
     - It asserts the cancels are the prepare's key and the execute's key, once each, in that order. The prepare's key is still called because it was in the ask's runs.
     - It asserts the old handle is not closed before the execute's outcome and is closed once after it.
     - Pass 1 ends the execute in success, and the statement names `C:/out/g1`. Pass 2 repeats on handle 2 and ends in refused, and no statement shows.
   - **Mutation:** iterate `ask.runs` only. Observed failure: `RB12g: ...`, AssertionError "the prepare's key and the execute's key, once each: expected [ Array(1) ] to deeply equal [ …(2) ]".
2. **Architect C-1.** `src/console/surfaceRegistry.ts` has a new class-C row `mode.set`, with a statement marked `[P6 placeholder]` in the form of `tool.set`'s. `handleSelectMode` now returns early when the mode is unchanged (as `handleSelectTool` does), then calls `transit`, then `recordNamed("gui-action","mode.set")`.
   - **RB16** now selects Replace, then Replace again. It asserts exactly one `mode.set` row.
   - I did not add `mode.set` to the file's `MILESTONE_ROWS` set, because RB2 and other tests would then see extra rows. RB16 filters for `mode.set` on its own.
   - **Mutation (i):** remove the `recordNamed` call. Failure: "a change of mode records one mode.set row: expected [] to deeply equal [ 'mode.set' ]".
   - **Mutation (ii):** remove the same-mode guard. Failure: "the mode already chosen records none: expected [ 'mode.set', 'mode.set' ] to deeply equal [ 'mode.set' ]".
   - The console completeness tests passed with no edit to them.
3. **Architect S2, RB12f.** A second `startOpen` while the ask stands leaves the first open resolved as refused with code `open.dropped`. The ask is shown once, with no row for the drop and `opens()` still 1. Keep exporting then resolves the second open the same way. The total is exactly one `dataset.openDuringExport` row, no cancel, and the export reaches its own outcome.
   - I read "records one row" as one row for the one choice. Stage 7's code records no row for the drop itself, so the test pins that.
   - **Mutation:** remove `askRef.current?.answer(false);` from `confirmOpen`. Failure: "the first open was answered Keep by the second: expected 'pending' to match object { kind: 'refused', …(1) }".

**Document changes** (all keep their draft marks and source comments):
- **(a) `e2e/selection.mjs` header**, the E-NODRAG (2) line: replaced with the brief's words, wrapped over three comment lines.
- **(b) `e2e/README.md`**, Selection entry: the three D-4 replacements (E-CLICK-FAST clause, EXPORT-TODAY line, What it proves not).
- **(c) `AdmissionPanel.tsx`**: the dropped-open message is now the brief's text. No test or e2e step asserts the old message.
- **(d) `KNOWN-LIMITATIONS.md`**: items 36 and 38's click sentences and item 40's second sentence, all with the given words.
  - **Item 40 loses a clause.** The old sentence also said the advisory source watcher ending the session ends the selection, and the architect's replacement does not carry that. The item's title and its DRAFT comment still mention a source change. Please have it reinstated in the human's words, or rule that it is intended.
- **(e) `MANUAL-WALKTHROUGH.md` Part W**:
  - W2's Expected cell and W9's Expected cell use the given words.
  - W11's Step cell is the architect's D-6 words.
  - W11's Expected cell gets one added sentence naming three [P6 placeholder] strings read at the sitting. They are the ask's still-running clause, the ask's new-dataset-opened clause, and the tool switch's click-inspects clause. It describes them without quoting or rewording them.

**H3.** This round edited no base suite. `App.selection.test.tsx` is an added file of the PR, and the console tests were not touched. I did not touch `WorkingCanvas.wiring.test.tsx` or `StudioLayout.test.tsx`. Existing-suite edits against the merge base are unchanged since 575cd4b3.

**Commands and exit codes** (all at 7ffdb6a7):
- `npm run verify`, under a shared hold with the Rust env vars set: rc 0. Vitest: 93 files, 1332 tests passed. The residency trace test and citation integrity both passed (30 passed, 0 failed).
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs`: rc 0, PASS (121 checked, 30 baselined).
- `verify-test-claims.mjs`: rc 0, PASS (560 claimed tests).
- `verify.mjs`: rc 0, PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.

**§7 count**, from the merge base f87a7b66 with the three excludes: **5742** (5632 inserted plus 110 deleted). The count from 575cd4b3 to the head is +106 lines in `frontends/shell` and +6 in `KNOWN-LIMITATIONS.md`.
- The all-phases total is 6,644. Subtracting groups A-P (600) and A-T (800) gives 5,244 for phase B alone, so the count is 498 over that. That subtraction is my own derivation, not a figure in §7.
- Per file against its ceiling, for the files I changed:

| File | Lines | Ceiling | My change |
|---|---|---|---|
| `src/App.selection.test.tsx` | 1046 | 700 | +89 |
| `e2e/selection.mjs` | 707 | 650 | +5 |
| `src/App.tsx` | 254 | 420 (group B-A) | +7 |
| `src/console/surfaceRegistry.ts` | 58 | 60 | +7 |
| `src/admission/AdmissionPanel.tsx` | 18 | no ceiling | +2 |

  - `App.selection.test.tsx` was already over by 257 before this round, so it is 346 over now, of which my 89 lines are a part.
  - `e2e/selection.mjs` was already over by 52 before this round; the +5 takes it to 57 over, if 650 is read as covering the whole file.
  - `AdmissionPanel.tsx` is not in §7's file lists.
- Outside the count, counted from the merge base:
  - `KNOWN-LIMITATIONS.md`: 16 lines against 30.
  - `MANUAL-WALKTHROUGH.md`: 41 lines against 140.
  - `e2e/README.md`: 16 lines against 30.
- The overruns are class 8. I did not edit §7.

**For the custodian to run in e2e at 7ffdb6a7:**
- `selection.mjs`: the head's product-code diff since 719568f8 is only `App.tsx`'s two handlers and the `mode.set` row. Only a rerun shows whether `E-NODRAG` and the others still pass.
- Gate 1's E-1 suites that never ran in phase B: `filter`, `filter-panel`, `refusal-contract-baseline`, `residency-harness`, `source-changed.mjs`, `source-watch-idle.mjs` and `pan-anchor.mjs`.
- `regression`, `layout` and `style`, which last ran before stages 6 and 7.
- Note: `E-ASK` and `E-ASK-STATEMENT` drive the ask with the prepare standing, so they can show RB12g's route end to end, and the mode picker now records one console row per change.
