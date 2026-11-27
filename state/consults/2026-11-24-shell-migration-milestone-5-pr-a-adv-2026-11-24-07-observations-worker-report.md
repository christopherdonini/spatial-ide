# Milestone 5 PR A: the observations of ADV-2026-11-24-07 items 3 and 5 at 7c816dd4, the worker report

*Filed by the custodian from the worker hand-back, as claims, not evidence: node:shell-migration-milestone-5@pr-a-adv07-observations-1. Its commit 1b38e62c53c44a7b0237e636d19280ae1a4ec54f adds 8 comment lines in two test files and nothing else, as the custodian read from its diff. Dispatched at 2026-11-24T02:53:11Z; its run: Bash 44, Edit 5, Read 4, Monitor 1, SubagentHandback 1, by unique call ids, 3 calls errored; model claude-sonnet-5-5, from 2026-11-24T02:53:14Z to 2026-11-24T03:13:37Z by its transcript; 1 call named the main checkout (a Read of its own agent definition there, which change nothing); handed back at 2026-11-24T03:13:36Z. 10307 bytes, sha256 3b95b22a29cf90fe56c2a8b397568a2081b84f5f19577e567363473bf459c02c, byte for byte, nothing masked, with one final newline added.*

---

REPORT: node:shell-migration-milestone-5@pr-a-adv07-observations-1

State: finished, pushed, nothing else changed. Head before 7c816dd4e61b426f9fcdc4e48b0c3c0c87189795. Commit 1b38e62c53c44a7b0237e636d19280ae1a4ec54f (comments only; 2 files, +8/-0). Push output: `7c816dd4..1b38e62c  cut/shell-migration-milestone-5-pr-a -> cut/shell-migration-milestone-5-pr-a`. Worktree `D:/wt/m5a` is clean. Run ended 03:13Z. Preflight: C: had 43763 MB free, D: 190929 MB. The ruling copy was 3752 bytes with the stated sha256. Branch, HEAD and a clean tree checked.

**Stop conditions: none.** T-X2, T-G1, T-G2 and C-U6a all failed. Nothing goes to the advisor under item 3 on that count. One finding does (V-probe, below).

**Step 1: observations at H.** Script: `D:/wt-data/m5a/adv07-obs.mjs`. It checks anchor counts and lines, runs the test file whole, restores with `git checkout -- <file>`, then checks sha256 against the blob at H and an empty porcelain. Every restore matched. The line cites are in App.tsx and conditions.ts. All logs are in `D:/wt-data/m5a/`.
- **T-X2.** Removed: X-2's guard (App.tsx 1652), raise's first line (conditions.ts 140), `visibleFor`'s generation clause (conditions.ts 211).
  - Ran `src/App.lateResult.test.tsx`: exit 1, 1 failed and 21 passed. Log `adv07-T-X2.log`.
  - Failed: "...baseline arm > a late old-generation REJECTION carrying a different refusal code after a reopen does not write the new generation's viewport refusal either". The assertion is `AssertionError: expected <div …(1)></div> to be null`. The element received was `.admission-refusal-code`, engine.connections_exhausted (test line 547 at H).
  - The sibling engine.source_changed REJECTION test still passed.
- **T-G1.** Removed: G-1's guard (App.tsx 1931) plus the same two store lines.
  - Exit 1, 1 failed and 21 passed. Log `adv07-T-G1.log`.
  - Failed: "...baseline arm > A's ended -> reopen sequence: the late filter-Apply completion and the dev-gated baseline arm's canvas-refusal/failure-terminal/resident-ceiling callbacks do not contaminate B -- B's own equivalents still work (baseline arm)".
  - The assertion is `expected <div class="canvas-refusal" …(1)>…(1)</div> to be null`, at test line 822, straight after `onTerminalA("a-stream-failed", ...)`. The page showed "stream ProducerFailed: A's own stream".
- **T-G2.** Removed: G-2's guard (App.tsx 2469) plus the same two store lines.
  - Exit 1, 1 failed and 21 passed. Log `adv07-T-G2.log`.
  - Same test and same assertion message, at test line 824, after `canvasA.onCanvasRefusal("a-stream-ceiling", ...)`. The page showed "A's own ceiling refusal".
- **C-U6a.** Removed: raise's first line alone (conditions.ts 140).
  - Ran `src/conditions/conditions.test.ts` whole: exit 1, 2 failed and 13 passed. Log `adv07-C-U6a.log`.
  - Failed 1: "C-U6a: after opened(R) a raise under R2, and in a fresh state a raise before any opened, leave byId, nextId, nextSeq and notKept unchanged". The assertion is `expected { 'condition-1': { …(10) }, …(1) } to deeply equal { 'condition-1': { …(10) } }`, at conditions.test.ts 173.
  - Failed 2: "C-U7b: a stale raise takes no cap room: ...". The assertion is `expected 1 to be +0`, at 217. This matches the line's "Also fails C-U7b".

**V-probe (no comment line written).**
- **Recorded mutations that change `visibleFor`'s generation clause:** none. A grep over the piece's test files (including ConditionView, ProblemsTab, StudioLayout, WorkingCanvas.wiring, limits, App.table and App.test) found one RECORDED MUTATION line naming `visibleFor`: C-U4, at conditions.test.ts 97 at H. It drops the target test and leaves "a condition matches on its generation alone". My reading agrees that it is a different clause.
- **Probe:** removed the generation clause alone (conditions.ts 211).
  - `conditions.test.ts` failed 1 of 15 (log `adv07-V-probe-src_conditions_conditions_test_ts.log`). The test is "C-U4: view-1's condition is absent from visibleFor({view-2, R}); the resource's is present in both; another generation's is absent". The assertion is `expected [ { id: 'condition-1', …(9) }, …(1) ] to deeply equal []`, at conditions.test.ts 103: `visibleFor(state, { view: "view-1", resource: R2 })` expected `[]`.
  - `App.conditions.test.tsx` passed, 12 of 12 (exit 0).
  - `App.lateResult.test.tsx` passed, 22 of 22 (exit 0).
- **Finding for the advisor:** no recorded mutation pins the clause alone. The C-U4 test does pin it in practice, through its third expect (the R2 line), but its recorded mutation names a different clause. I changed nothing about this; it needs a ruling on whether the closing amendment names C-U4's third expect, or a mutation line is added.

**Step 2: what each guard of `reportViewportOutcome` protects (by reading at H).** `dispatchConditions` is the plain `useReducer` dispatch (App.tsx 879). `viewTargetNow` is a read of a ref (952).
- **X-1 (1635, resolved arm), only the store's event.** After it come:
  - 1643: `if (sessionEndedRef.current) return;`, a read.
  - 1644: `viewTargetNow()`, a read.
  - 1645: the `ownerClear` dispatch.
  - No state setter, ref write, scan event or callback.
- **X-2 (1652, rejected arm), also writes.** After it come:
  - 1654 to 1666: `viewTargetNow()`, then the store `raise` of viewport-refusal when the refusal is not a session-ended one.
  - 1672: `if (isSessionEndedRefusal(e)) endSession(refusalDetailOf(e), forDataset);`. `endSession` (1518) runs `endSessionForDataset` (739), which drops a call whose `forDataset` differs from `admittedDatasetRef.current`. Past that guard it writes the following, and all of it sits behind that second, identical guard:
    - `sessionEndedRef.current` (1523);
    - `setSessionEnded` (1524);
    - `setHover` (via `handleSessionEnded`);
    - a store `raise` of session-ended (1525);
    - the workspace dispatch `resource.generationEnded` (1527).
  - So X-2's guard "also writes" those, but redundantly: the identical guard in `endSessionForDataset` protects them too.
  - The existing test "a late old-generation REJECTION carrying engine.source_changed ... neither ends the new generation nor writes its refusal" still passed in T-X2. Whether item 4 applies to X-2 is for the advisor. I followed the brief and wrote no X-2 "evidence" line.

**Step 3: dated lines written** (the diff text is at `D:/wt-data/m5a/adv07-diff.txt`).
- **`App.lateResult.test.tsx`, X-1 block** (one READ line, added before its "Reverted after observing."): `READ 2026-11-24 at 7c816dd4 (ADV-2026-11-24-07 item 5): after this guard the resolved arm writes only the condition store's ownerClear (it reads sessionEndedRef and the view's target, and writes nothing else), so the two-stops observation above, FAILED at 7c18e29f, is this guard's evidence.` (backticks omitted here)
- **X-2 block** (two lines, from `adv07-X-2-both` logs and `adv07-T-X2.log`):
  - Two-stops, at 7c18e29f: NOT FAILED, the whole file passed (22 passed). Reason: `visibleFor`'s generation clause still kept A's late raise out of B's view.
  - Three-stops, at 7c816dd4: FAILED in the sibling "different refusal code" test, with `expected <div …(1)></div> to be null` (engine.connections_exhausted). The engine.source_changed test still passed, because a session-ended rejection raises no viewport-refusal and `endSession` has its own guard.
- **G-1 block** (two lines, after its a17db128 line):
  - Two-stops, at 7c18e29f: NOT FAILED, 22 passed, same reason.
  - Three-stops, at 7c816dd4: FAILED, test "A's ended -> reopen sequence: ... (baseline arm)", with `expected <div class="canvas-refusal" …(1)>…(1)</div> to be null`, at the assertion after A's late `onTerminalA("a-stream-failed", ...)`.
- **G-2 block** (two lines): the same two-stops text, and a three-stops FAILED line at the assertion after A's late `canvasA.onCanvasRefusal("a-stream-ceiling", ...)`.
- **`conditions.test.ts`, C-U6a** (one line): `OBSERVED 2026-11-24 at 7c816dd4: FAILED -- "C-U6a: after opened(R) a raise under R2, and in a fresh state a raise before any opened, leave byId, nextId, nextSeq and notKept unchanged": AssertionError: expected { 'condition-1': { …(10) }, …(1) } to deeply equal { 'condition-1': { …(10) } }. Also failed: C-U7b (AssertionError: expected 1 to be +0). The mutation is the first line of raise alone (if (event.generation !== state.current) return state;). Reverted after observing.`
- The lines use no `file:N` form. Test-file lines are described by their assertion, and conditions.ts lines by their words.

**Step 4: checks at 1b38e62c, all exit 0.** Logs are `D:/wt-data/m5a/adv07-c-*.log`.
- vitest over `App.lateResult.test.tsx` and `conditions.test.ts`: 2 files, 37 passed.
- `npx tsc --noEmit`: exit 0, empty log.
- `verify.mjs`: 0.
- `verify-cites.mjs`: 0.
- `verify-quotes.mjs`: 0 (PASS).
- `verify-quotes.mjs --show-cites` with the two changed files: 0.
- `verify-test-claims.mjs`: 0.
- `verify-mutation.mjs --base 6bc40126 --head HEAD`: 0 (PASS, all 42 new tests have a recorded mutation naming them).
- `node --test` over the plan, hooks and evidence suites: 0, fail 0.
- `git diff --numstat 7c816dd4..HEAD`: `7 0 frontends/shell/src/App.lateResult.test.tsx` and `1 0 frontends/shell/src/conditions/conditions.test.ts`.
- `git diff 6bc40126...HEAD -- '**/package-lock.json' Cargo.lock`: printed nothing.

**Anything otherwise than the brief.**
- My first two attempts to insert the comment lines garbled the files, because two anchors began mid-line. I caught it in the diff and restored with `git checkout -- <the two files>`. I corrected the script and re-applied it before the commit; nothing was committed from the faulty attempts.
- I made the step 3 comment edits with a node script, not the Edit or Write tool, to stay inside the product-file rule. The script is `D:/wt-data/m5a/adv07-comments.mjs`.
- I used `READ` (not `OBSERVED`) as the prefix of the X-1 line, because it is a reading and not an observation.
- The commit carries the Signed-off-by line that `git commit -s` adds, as the brief required. I typed none.
- The two-stops lines say "22 passed" and not "exit 0", because the previous worker's logs do not record an exit code.
- I did not re-run the earlier observations; I only read their logs.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
