*Custodian's filing note (2026-11-12): the worker-high's report on milestone 4 PR B's session-end phase (the form's Amendment 12, continued), from its hand-back (10476 bytes, sha256 21925a4472b6ec8c8918a7c6a881ed61c6fc51b564739647a1414cd5d96712f1), below the rule; a final newline is added; nothing else is changed. Its brief by file (13178 bytes, sha256 b71d5f162ea0380d58b7b70bd57d70c3d1daf8f8defac746277f68a8d7dac2e2); the run 17:15:31Z to 17:36:29Z by its transcript, 180 calls (Read 43, Bash 49, Grep 13, Edit 70, Write 4, SubagentHandback 1), model claude-sonnet-5-5. Checked by script: the branch's two commits, its remote head b8127685, and the numstat from M″ (16 files, 311 lines). Three calls errored: a first hold call that exited 2, which the report names as an extra `echo` after `exit`, and two Edit calls the harness refused (a file not yet read, then one changed since its read), which the report does not name. **The custodian's brief error:** it asked for `npm test` and also said no build, but `npm test`'s pretest step builds the bundle viewer and the notice; the worker discloses this as its departure 3. Its other departures are as it lists them, for the gate at PR B's head. Six files pass their per-file ceilings, and each group is within its total; these are class 8, recorded at Amendment 13. A reading and not Authority.*

---

Built: b1-shell-half PR B session-end phase at b8127685ae7c563857c6306e67b8dcf576ac92bc

Branch cut/b1-shell-half-pr-b, worktree C:/dev/wt/m4b, base M'' c85788f1b9f5d1deb34fec9f91bf5f47d699eb0e. Brief sha256 b71d5f162ea0380d58b7b70bd57d70c3d1daf8f8defac746277f68a8d7dac2e2 matched. Model: Sonnet 5.5 (claude-sonnet-5-5).

Limits of this report: it was written after a context compaction. The earlier tool outputs are in the subagent transcript agent-ab2ab6313062704c8.jsonl. I did not re-run the Where checks or the hold calls, so I do not quote the hold lines or the Where-check outputs here. Audit them from that transcript.

COMMITS
1. T = 0b247f2903d580c55b7c037b8728e7edb4e22730
   - Subject: "feat: the session-end lines name coverage-lost apart from a source change".
   - Stat: 16 files changed, 217 insertions(+), 76 deletions(-).
   - Checks at T:
     - `npm run typecheck`: rc=0.
     - `npm test`: rc=0, 111 files, 1462 tests passed, 0 failed.
     - `verify-cites.mjs`: rc=0.
     - `verify-test-claims.mjs`: rc=0 (793 claimed tests).
     - `profile-path-scan.mjs --staged`: rc=0 ("clean").
2. Record = b8127685ae7c563857c6306e67b8dcf576ac92bc
   - Subject: "docs: the session-end tests' recorded mutations, observed at 0b247f29".
   - Stat: 6 files changed, 18 insertions(+). Comments only.
   - Checks before the commit: typecheck rc=0; `npm test` rc=0 (111 files, 1462 passed); verify-cites rc=0; verify-test-claims rc=0; scan rc=0.
   - `m4b-se-verify-record.mjs` printed bad = 0. It checked each recorded failing-test title and assertion line against the mutation run output, byte for byte.
   - Whole diff: I printed it with `git show HEAD`. It is 3 comment lines (RECORDED MUTATION, OBSERVED AT 0b247f2903d580c55b7c037b8728e7edb4e22730, and the AssertionError line) above each of SE-U1, SE-U2, SE-U3, SE-U4, SE-U5 and SE-R1. The files are App.test.ts, HoverReadoutView.test.tsx, FeatureTab.test.tsx, selection.test.ts, pick.test.ts and App.lateResult.test.tsx.
   - Both commits carry the Co-Authored-By and Claude-Session trailers. Git added the `-s` Signed-off-by automatically (see departures).

WHAT T DOES
- `SessionEndReason` ("source-changed" | "coverage-lost") now travels with the hover latch, the click latch and the workspace action `resource.generationEnded`.
- `sessionEndReasonOf(code)` in App.tsx gives "source-changed" only for exactly `engine.source_changed`. Every other code gives "coverage-lost" (OPEN-3 (a)).
- The source-changed and reopened sentences are unchanged. The two coverage-lost sentences are byte-copied from the draft, start `[P6 placeholder] `, and were verified byte-identical by script.
- `GenerationEndReason` (workspace/selection.ts) and `SessionEndReason` (canvas/pick.ts) are declared apart because of boundary UA6. tsc checks assignability at App's dispatch.
- The tsc fill list at T matched the draft's list exactly. The runtime fills in App.test 1159/1294 and viewportStreamManager.test 925 were also made.
- App.selection.test.tsx was not edited. tsc named no fill there, and SE-R1 is in App.lateResult.test.tsx as the brief says.

MUTATIONS
Six mutations, each applied to T, run, and reverted. Porcelain was empty after each revert. Each failed exactly its predicted test, except SE-U1, which also fails SH7 as the draft predicts. Raw outputs are m4b-se-mut-SE-*.txt and the -rc files in the scratchpad.

| Id | Mutation | Files run | rc | Result |
|---|---|---|---|---|
| SE-U1 | App.tsx `sessionEndReasonOf` returns "source-changed" always | App.test.ts, viewportStreamManager.test.ts | 1 | 2 failed, 114 passed |
| SE-U2 | `sessionEndedText` ignores its reason, returns HOVER_SESSION_ENDED_TEXT | HoverReadoutView.test.tsx | 1 | 1 failed, 5 passed |
| SE-U3 | `ENDED_BECAUSE["coverage-lost"]` set to "the source file changed" | FeatureTab.test.tsx | 1 | 1 failed, 10 passed |
| SE-U4 | `endGeneration` passes "source-changed" whatever the action's reason | selection.test.ts | 1 | 1 failed, 14 passed |
| SE-U5 | `latchedHoverReadout` sets reason "source-changed" | pick.test.ts | 1 | 1 failed, 13 passed |
| SE-R1 | `endSession`'s dispatch passes `reason: "source-changed"` | App.lateResult.test.tsx | 1 | 1 failed, 21 passed |

Failing tests and assertion lines, byte-copied from the run outputs:
- SE-U1:
  - Test: "handleSessionEnded names coverage-lost from the kernel's real coverage-lost details, and source-changed only from its exact code".
  - Line: `AssertionError: setSessionEnded's reason for a real coverage-lost detail: expected 'source-changed' to be 'coverage-lost' // Object.is equality`.
  - Also failing: "SH7: a matching dataset_session_ended event ends a real baseline manager's session through the full route".
  - Line: `AssertionError: expected "vi.fn()" to be called with arguments: [ { kind: 'session-ended', …(1) } ]`.
- SE-U2:
  - Test: "a session-ended readout names its reason: coverage-lost and source-changed each their own sentence, no id in either".
  - Line: `AssertionError: the coverage-lost readout names the lost watch: expected 'The source file changed while it was …' to contain 'lost coverage'`.
- SE-U3:
  - Test: "the notice and the last-click line name each end reason in their own words".
  - Line: `AssertionError: the coverage-lost notice: expected '[P6 placeholder] The selection ended:…' to be '[P6 placeholder] The selection ended:…' // Object.is equality`.
- SE-U4:
  - Test: "a generation ended by coverage-lost ends the selection with the reason coverage-lost".
  - Line: `AssertionError: the notice a coverage-lost end leaves: expected { kind: 'ended', …(2) } to deeply equal { kind: 'ended', …(2) }`.
- SE-U5:
  - Test: "the latch carries the reason it is given".
  - Line: `AssertionError: the latched readout for coverage-lost: expected { kind: 'session-ended', …(1) } to deeply equal { kind: 'session-ended', …(1) }`.
- SE-R1:
  - Test: "a session ended by the real dataset_session_ended route for coverage-lost names coverage-lost in the hover readout, the notice, the status bar item and the last click".
  - Line: `AssertionError: the notice names the lost watch: expected '[P6 placeholder] The selection ended:…' to contain 'lost coverage'`.

SIZE
Counted by `git diff --numstat c85788f1...HEAD`, as insertions plus deletions per file.
Whole branch: 16 files, 235 insertions, 76 deletions, sum 311.

| File | Added/deleted | Sum | Ceiling | Result |
|---|---|---|---|---|
| pick.ts | 12/8 | 20 | 20 | at ceiling |
| HoverReadoutView.tsx | 13/5 | 18 | 20 | within |
| FeatureTab.tsx | 12/5 | 17 | 15 | over by 2 |
| clickEffect.ts | 3/2 | 5 | 10 | within |
| selection.ts | 5/2 | 7 | 6 | over by 1 |
| App.tsx | 26/16 | 42 | 45 | within |
| workspaceState.ts | 9/9 | 18 | 15 | over by 3 |
| App.test.ts | 37/3 | 40 | 35 | over by 5 |
| pick.test.ts | 15/6 | 21 | 20 | over by 1 |
| HoverReadoutView.test.tsx | 20/4 | 24 | 30 | within |
| FeatureTab.test.tsx | 17/3 | 20 | 30 | within |
| clickEffect.test.ts | 2/2 | 4 | 6 | within |
| selection.test.ts | 13/5 | 18 | 30 | within |
| workspaceState.test.ts | 1/1 | 2 | 4 | within |
| viewportStreamManager.test.ts | 1/1 | 2 | 4 | within |
| App.lateResult.test.tsx | 49/4 | 53 | 40 | over by 13 |

Groups:
- New-to-list product group (pick.ts, HoverReadoutView.tsx, FeatureTab.tsx, clickEffect.ts, selection.ts): 67 against 71, within.
- Test group, apart from App.selection.test.tsx's SE-R1 lines (nine test files): 184 against 204, within.
- App.selection.test.tsx's 45-line allowance is unused.

Overruns are class 8. Six files are over their individual ceilings: FeatureTab.tsx, selection.ts, workspaceState.ts, App.test.ts, pick.test.ts and App.lateResult.test.tsx. I did not trim any of them. The App.lateResult.test.tsx overrun is mostly the harness additions it needed (see below).

PUSH
- `git -C C:/dev/wt/m4b push -u origin cut/b1-shell-half-pr-b` ran in its own call and created the new branch on origin.
- `git ls-remote origin refs/heads/cut/b1-shell-half-pr-b` gives `b8127685ae7c563857c6306e67b8dcf576ac92bc`.
- Porcelain is empty.
- No PR action was taken, and I did not wait for CI.

DEPARTURES AND DISCLOSURES
1. The mutation runs used `npm test --ignore-scripts -- <files>`. Through `npm test`, pretest's `tsc --noEmit` (with `noUnusedParameters`) would reject some mutations before vitest ran. vitest does not typecheck, so each mutation applied exactly as the draft gives it.
2. I edited pick.test.ts once with a python heredoc containing `\n` escapes. The brief says to use the Write tool for scripts with a backslash.
3. My exploratory `npm run typecheck` and `npm test` ran the project's own pretypecheck/pretest builds (buildViewerFirst, generate:notice, vite build). The outputs are git-ignored and porcelain stayed clean, but the brief says "no build".
4. SE-U5 is a new test in pick.test.ts, "the latch carries the reason it is given". It does not strengthen the existing latch test.
5. App.lateResult.test.tsx had no listener capture and no `notifySessionEnded` on its manager mock. I added both: `viewportMockState.sessionEnded = { listener }`, captured by the `./skp/events` mock, and `MockViewportStreamManager.notifySessionEnded`. This costs lines and explains the overrun. SE-R1 reads `protocol/skp/tests/data/v0-dataset_session_ended-event.json` and overrides its `session` (to `handle.replace("ds_","sr_")`) and `reason` (to "coverage-lost").
6. `handleAdmitted`'s reset uses `sessionEndedRef.current = value === null ? null : sessionEndReasonOf(value.code)`.
7. FeatureTab's `ENDED_BECAUSE` is a `Record<SelectionEndReason, string>`, not a ternary chain.
8. The `HOVER_SESSION_ENDED_TEXT` comment was reworded, and the constant is now non-exported (text unchanged).
9. The first hold call had an extra `echo` after `exit`.
10. Git added the `-s` Signed-off-by to both commits automatically. The message files have no Signed-off-by line and no email.
11. A first edit placed `SessionEndReason` between the `PickSessionEnded` doc comment and its interface. I moved it above the doc comment before committing.

BACKGROUND SHELLS
I left none. The two background tasks I started (bue5q98gq and booawrjxu) both completed. The process list shows five node-related processes. I did not trace them and cannot say whether they are mine.

SCRATCH
Files are in the scratchpad folder, named `m4b-se-*`: msg-T.txt, msg-R.txt, bytes.mjs, verify-record.mjs, the mut-SE-*.txt outputs with their -rc files, and the tsc, vt, cites, claims and scan outputs.
