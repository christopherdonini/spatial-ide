# Milestone 5 PR A: which element or state the ADV-2026-11-24-07 item 4 assertions read, the architect reading

*Filed by the custodian: node:shell-migration-milestone-5@pr-a-adv07-item-4-architect-1, the read ADV-2026-11-24-07 item 4 orders before the test is written. It is a read and gives no verdict, and it ran during no build. Dispatched at 2026-11-24T03:28:22Z; its run: Read 16, Grep 9, Glob 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T03:28:23Z to 2026-11-24T03:31:19Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T03:31:19Z. 10626 bytes, sha256 d6af14498f07fb5bc38d707bda1578413b1050d9a116205bf9667e7b753899b1, byte for byte, nothing masked, with one final newline added.*

---

Item 4: the scan-state observable at 1b38e62c
Read: D:/wt/m5a @ 1b38e62c53c44a7b0237e636d19280ae1a4ec54f
REPORT PATH: state/consults/2026-11-24-shell-migration-milestone-5-pr-a-adv-2026-11-24-07-item-4-the-scan-state-observable-architect.md
Branch: cut/shell-migration-milestone-5-pr-a @ 1b38e62c53c44a7b0237e636d19280ae1a4ec54f. I ran nothing, so I did not confirm the commit id with git. It is the one the brief gives for the worktree, which I read as I found it.

This is a read, and it gives no verdict (the brief, its opening paragraph).

## Part 1. The tests

These are all the N8 tests in `frontends/shell/src/App.lateResult.test.tsx` that make A's late `onTerminal` call or A's late `onCanvasRefusal` call.

Baseline arm (the describe block at line 436):

1. "A's ended -> reopen sequence: the late filter-Apply completion and the dev-gated baseline arm's canvas-refusal/failure-terminal/resident-ceiling callbacks do not contaminate B -- B's own equivalents still work (baseline arm)". The test starts at line 790. It makes two such calls:
   - line 828: `act(() => onTerminalA("a-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: A's own stream" }));`. This call reaches `onFailureTerminal`.
   - line 830: `act(() => canvasA.onCanvasRefusal("a-stream-ceiling", "A's own ceiling refusal", "vertex-ceiling"));`.
   This is the test the observations worker named (T-G1 and T-G2). The test file's own OBSERVED lines at lines 775 and 780 agree with the worker's claims.
2. "A's late onBatchRows/onDeliveryCompleted, delivered well after A's own effect cleanup has run, do not overwrite B's own in-flight scan state (baseline arm, item 7 probe)". The test starts at line 693. It makes one such call:
   - line 737: `act(() => onTerminalA("a-first-stream", { kind: "Completed", detail: "" }));`.
   Paraphrase: this is A's late `onTerminal` call, but it carries `Completed`, so `makeManagerCallbacks` sends it to `onDeliveryCompleted` and not to `onFailureTerminal`. See `frontends/shell/src/App.tsx`, lines 630–631 at 1b38e62c: `if (terminal.kind === "Completed") {` and `handlers.onDeliveryCompleted();`. Its guard is not G-1 or G-2. Whether item 4 reaches this test is the advisor's call. I list it because the ruling's words ("A's late `onTerminal` call") cover it.

Calls I left out because they are B's own: lines 853, 860, 1072 and 1143.

Candidate arm (the describe block at line 1159): there are none. No test in lines 1159–1530 makes either call. The comment at lines 1366–1370 says why. Paraphrase: the candidate arm has no `ViewportStreamManager`, and it never reaches `onFailureTerminal` or `onCanvasRefusal`.

## Part 2. The scan state

**Where each handler applies the scan event after its guard** (all in `frontends/shell/src/App.tsx`, at 1b38e62c):
- `onFailureTerminal`:
  - The guard is line 1931: `if (admitted.dataset !== admittedDatasetRef.current) return;`.
  - The event is line 1948: `applyScanEvent({ kind: "failed" });`. It runs whether or not the `raise` at lines 1937–1947 is dispatched.
- `onCanvasRefusal`:
  - The guard is line 2469: `if (admitted.dataset !== admittedDatasetRef.current) return;`.
  - Next comes `handleCanvasCeilingRefusal` (line 2473), with `applyScanEvent,` (line 2487).
  - Inside it, line 671 is `deps.setCanvasRefusal(message);` (the store's raise, lines 2474–2486). Line 672 is `deps.applyScanEvent({ kind: "failed" });`. Line 673 is `deps.cancelStream(streamHandle);`, which goes to `managerRef.current?.cancelStream(h)` at line 2491.
- `onDeliveryCompleted` (test 2 only):
  - The guard is line 1957.
  - Line 1959 sets the residency status.
  - The event is line 1960: `applyScanEvent({ kind: "completed" });`.

**The setter and the reducer:**
- `applyScanEvent` is at lines 1065–1070. It calls `commitScanState(nextScanState(scanStateRef.current, event));` (line 1067).
- `commitScanState` (lines 1057–1060) writes `scanStateRef.current` and the React state. That state is line 1046: `const [scanState, setScanState] = useState<ScanState>({ kind: "idle" });`.
- This is component state, not the condition store. That agrees with the ruling's item 2.
- The reducer is `nextScanState` (line 485). Its `failed` case is lines 506–507: `case "failed":` / `return !isScanInFlight(state) ? state : { kind: "failed", streamHandle: state.streamHandle };`.
- `isScanInFlight` (lines 534–536) is true only for `issuing`, `open-no-rows` and `delivering`.

**How the scan state reaches what the harness can read:**
- `.filter-cancel`: `FilterPanel` gets `scanState={scanState}` (App.tsx, line 2325). In `frontends/shell/src/filter/FilterPanel.tsx`, line 120 at 1b38e62c is `{isScanInFlight(scanState) && (` and line 121 is `<button type="button" className="filter-cancel" onClick={onCancel}>`. It shows only while a scan is in flight.
- `.scan-liveness`: FilterPanel.tsx, lines 129–133. It shows text only for `open-no-rows` or `delivering`, after `SCAN_LIVENESS_DELAY_MS` (`scanLivenessText`, App.tsx lines 558–567).
- `.status-scan-liveness`: App.tsx, line 2562, renders `ScanLivenessMirror` (`frontends/shell/src/layout/regionParts.tsx`, lines 196–214). It shows the same delayed in-flight text.
- `.scan-incomplete`: App.tsx, lines 2569–2573. It shows only for `cancelled`.
- `viewComplete: scanState.kind === "complete"` (line 2616) and `mapSettled={!isScanInFlight(scanState)}` (line 2685). I did not follow where these two props go. By their expressions, each has the same value for `idle` and for `failed`.

Paraphrase of what follows from this: no reader in the shipped tree tells `failed` apart from `idle`. A `failed` event can be read only as a scan leaving the in-flight states, when Cancel and the liveness text go away.

## Part 3. The observable

**Test 1, after line 828 (G-1) and after line 830 (G-2): no observable exists in the harness at that point.**
- **B's scan state there is `{ kind: "idle" }`. Why:**
  - B's admission sets it to idle: `setters.setScanState({ kind: "idle" });` (App.tsx, line 265), reached through `setScanState: commitScanState,` (line 1218).
  - B's first request is never settled in this test. Its deferred is used only to find `handleB` (test file, line 817).
  - A's late filter completion at test line 814 is dropped by A's own `issueViewportQuery` guard (App.tsx, line 2004).
  - The test already asserts, at line 823, `expect(container.querySelector(".filter-cancel")).toBeNull();`.
- **Why nothing of A's call shows while the guard is in place:** the guard returns before line 1948 (or before line 2473).
- **With the guard alone removed, by reading:**
  - `nextScanState(idle, {kind:"failed"})` returns the same `state` object (lines 506–507), so `commitScanState` writes back the value it already holds.
  - In the G-2 path, the `raise` is dropped by the store's stops. These are the existing evidence, and they are not scan state.
  - `cancelStream` reaches the mocked manager's `async cancelStream(): Promise<void> {}` (test file, line 286), which records nothing.
  - So no element, text, attribute, class or captured state that the harness can read changes. An assertion on any scan-state reader would pass with the guard removed. By reading, removing the guard alone does not make it show A's call.
- Under the ruling's item 4, third bullet, this is a "found" case. I invent no observable.
- A fact for the advisor, with no proposal: the `failed` event becomes readable only while B's scan is in flight. In this test, B first goes in flight at lines 846–849 (B's own Apply, `"b-filter"`), which is after A's late calls.

**Test 2, after line 737: the observable already exists.**
- It is line 738: `expect(container.querySelector(".filter-cancel")).not.toBeNull();`. It reads the `.filter-cancel` element. With B current, the expected value is "present".
- Why the element is present: B's scan is `open-no-rows` for `"b-second-stream"` (lines 716 and 723).
- Why nothing of A's call shows while the guard is in place: the guard at line 1957 drops the call.
- With the guard alone removed, by reading:
  - `nextScanState(open-no-rows, {kind:"completed"})` gives `complete`. That is line 505: `return !isScanInFlight(state) ? state : { kind: "complete", streamHandle: state.streamHandle };`.
  - `isScanInFlight` is then false, Cancel is removed, and line 738 fails.
  - The scan state is not in the condition store, so the store's stops do not cover this write.
- The file's only observation of this removal is OBSERVED 2026-09-23 FAILED (lines 690–691). None is recorded at the head. Whether this test needs anything new under item 4 is the advisor's call.

## Part 4. Limits

Test 1, at both line 828 and line 830, is the case the brief asks about:
- B's own scan state (`idle`) is exactly what A's `failed` would leave, because the reducer returns the same object.
- So an assertion cannot tell the two apart.
- I found no other observable in the harness for that point. Every reader in part 2 depends on in-flight, `cancelled` or `complete`, and the state object does not change.
- The other writes after the two guards are the store's `raise`, which the existing `.canvas-refusal` assertions already read through the store's stops, and the mock's `cancelStream`, which records nothing.

Paraphrase of App.tsx, lines 2464–2466: the comment says that, unguarded, the call would dispatch `failed` onto the live scan state and calls that contamination. By reading, that write has an effect only while B's scan is in flight, and in this test at this point B's scan is not in flight.

Test 2 has no such limit: B is in flight there, and A's `completed` is readable.

## Files read

- the brief, in the session scratchpad: `brief-m5a-item4-arch-1.md`
- `D:/wt/m5a/frontends/shell/src/App.lateResult.test.tsx` (lines 1–889 and 1159–1398, plus a grep of the whole file)
- `D:/wt/m5a/frontends/shell/src/App.tsx` (lines 240–269, 440–679, 1040–1074, 1206–1225, 1895–2024, 2300–2399, 2445–2514 and 2558–2575, plus greps)
- `D:/wt/m5a/frontends/shell/src/filter/FilterPanel.tsx` (lines 83–137)
- `D:/wt/m5a/frontends/shell/src/layout/regionParts.tsx` (lines 196–214, through grep)
- `D:/wt/m5a/frontends/shell/src/layout/statusItems.ts` (lines 43–45, through grep)
- `D:/wt/read-1124c/state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-07-milestone-5-pr-a-the-stop-b-three-stops-removed-c-u6a-again-after-the-sitting-the-scan-state-asserted-for-g-1-and-g-2.md` (whole)
- `D:/wt/read-1124c/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md` (Amendments 11, 10 and 9)

Model: Claude Opus 5.5 (claude-opus-5-5).
