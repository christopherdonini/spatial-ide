Reviewed: PR 362, the branch cut/command-bar-enter-after-applied at ac75eb64222fb654113e660c6e0a75f66a318b9d, in C:/dev/wt/henter (the custodian's filing note, 2026-11-23: the reviewer (Opus, ground: hard reviews), the five-line form's one gate (ADV-2026-11-23-11 item 5), node:command-bar-enter-after-an-applied-result@gate-reviewer-1, with its brief in a scratch file it checked by size and sha256; its run: Read 5, Grep 2, Bash 31, SubagentHandback 1, by unique call ids, 0 calls errored; its four held runs (the red run at the base, M1, the whole file, verify) are in its transcript; model claude-opus-5-5, from 2026-11-23T12:33:33Z to 2026-11-23T12:43:48Z by its transcript. Filed below the rule from its hand-back, 11425 bytes, sha256 cef6afd4c15780f1cf49113c85eed5d578b59d8bb36cde6a8d922a497e2b7545, byte for byte but for the hold lines' values: 5 `shell=` values are written `<m>`; with one final newline added. Its line cites are to the branch head it names.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/henter @ ac75eb64222fb654113e660c6e0a75f66a318b9d

Branch cut/command-bar-enter-after-applied, PR 362, base main 36b788ba6940b0427bcc7ab37704a719be9a5ea7. Brief size 7100 and sha256 fc5fad9f…a37a2 both matched.

**Check 1: scope and count (passes)**
- `git diff --numstat 36b788ba…...HEAD` gives `29 0 frontends/shell/src/App.command.test.tsx` and `6 0 frontends/shell/src/command/CommandBar.tsx`. That is 35 changed lines against the budget of 80, in the form's 2 files only. There are two commits, de315ebd (the test) and ac75eb64 (the fix).
- Nothing on the Block on sight list is touched: no change to changeClauses, App.tsx, the workspace state, the props, a string the bar shows, a dependency, a lockfile or a workflow. No retry, sleep, timer or skip is added.

**Check 2: no lock-out (passes).** These are the places at the head that set the draft (CommandBar.tsx):
- L113 `setPos(typeDraft(text))` in `take`: the ref is written at L112 with the same text. `typeDraft` keeps the text unchanged (commandDraft.ts:102-103).
- L137 `close`: a functional update, `{ ...p, open: false, active: null }`. It never changes `draft`.
- L143 `complete`: the ref is written at L142 with the same `completion`. It is called from onKeyDown L181 and from the option click at L246.
- L168, the applied branch of `sendCondition`: the ref is written at L167 (`""`).
- L182 `setPos(step.pos)` in onKeyDown: the ref is not written here. It needs no write, because L176 has already made sure `latestDraft.current === pos.draft`, and L181 returns through `complete` whenever `step.pos.draft !== pos.draft`. So the draft set here equals the ref.
- L217 `onChange`: the ref is written at L216 with the same value.
- L84, the initial `typeDraft("")`, matches the ref's initial `""` at L91.

Every value-setting `setPos` sets the same value as the ref write just before it, and `close` preserves the draft. React applies all queued updates in the order they were called once every lane has committed, so the committed `pos.draft` always ends up equal to the last value written to the ref. Lane rebasing does not change this, and the default lane cannot be starved indefinitely. A gap exists only while an update is still unrendered, and it closes when that update commits. No path leaves the two different after the render.

**Check 3: the test reaches the real window (passes).** Files read (react-dom 18.3.1, jsdom 25.0.1, vitest 5.0.1):
- `frontends/shell/node_modules/react-dom/cjs/react-dom.development.js`:
  - L10992-10999 `getCurrentEventPriority`: if `window.event` is undefined the result is DefaultEventPriority; otherwise it comes from the event type.
  - L25483-25496 `requestUpdateLane`: with no update priority set, the lane falls back to the event priority.
  - L25661-25688: SyncLane is flushed in a microtask.
  - L25689-25718 and L27566-27577: other lanes go to the Scheduler (a macrotask) when no act queue is active.
  - L6654-6677: the `message` event type maps to DefaultEventPriority outside a Scheduler callback.
  - L4136-4152 and L4215-4216: `invokeGuardedCallbackDev` captures `window.event` and puts it back by assignment.
- `node_modules/vitest/dist/chunks/index.D4dXTzh9.js` L1097-1111 (`populateGlobal`): the global's `event` getter returns an assigned value first (L1099), and its setter keeps that value (L1103-1104).
- `node_modules/jsdom/lib/jsdom/browser/Window.js` L485-487 and L505, and `living/events/EventTarget-impl.js` L338-361: jsdom itself restores `_currentEvent` after each listener. A plain-jsdom probe (node -e; it wrote no file) showed `window.event` undefined after `focus()` and after a keydown.

Judgement:
- In the shipped app, the bar's continuation after the IPC wait runs outside any event dispatch (a fetch resolution), or at most inside a `message` event. Either way React gives it DefaultEventPriority, so the render goes to the Scheduler's macrotask, and a keydown task can come first. That is the real window.
- The test gives exactly that priority: `window.event` is undefined, and `release()` runs outside act, so `ReactCurrentActQueue.current` is null and the update reaches the real Scheduler. Draining microtasks cannot run that macrotask, and the precondition assertion confirms the window is open.
- The thing the override removes is a test-environment artefact. React's development build assigns `window.event` back after a handler, and vitest's global keeps the assigned value, so `window.event` stays stuck on an earlier event. A discrete type would then make React flush the update in a microtask. The test comment blames this on jsdom; see D1.
- `IS_REACT_ACT_ENVIRONMENT=false` only suppresses act warnings (L25292-25303, L27595ff). It does not change scheduling.
- Restoring the overrides: `eventSlot` is saved before the `try`. Both overrides are set inside or immediately before the `try`, with no statement between the flag's assignment and `try {`. The `finally` restores the saved descriptor, or deletes the property when nothing was saved, and sets the flag back to `true`, which is the file's value at L171. The keydown dispatched inside the `try` does not trip React's restore, because the value is `undefined` at L4151.
- No sleep, retry, longer timeout, fake timer or skip: the loop is 50 `await Promise.resolve()`, microtasks only.

**Check 4: runs, each in its own shared hold in frontends/shell, with TMP and TEMP set to D:/wt-data/henter**

(a) Red at the base: base CommandBar.tsx written from 36b788ba, then `npx vitest run src/App.command.test.tsx -t RC-ENTER-AFTER-APPLIED`, exit 1. The failure lines, byte for byte with ANSI codes stripped:
```
     × RC-ENTER-AFTER-APPLIED: an Enter after an applied result and before its render leaves the bar empty and shows no busy line 174ms
AssertionError: empty, no note, one filter apply asked for: expected [ …(3) ] to deeply equal [ '', …(2) ]

- Expected
+ Received

  [
-   "",
-   "(no element matches .command-note)",
+   "/filter \"zone\" = 'residential'",
+   "[P6 placeholder] A filter change is still being applied.",
    1,
  ]

 ❯ src/App.command.test.tsx:718:136
      Tests  1 failed | 24 skipped (25)
```
It fails for the form's reason: the applied text is back and the busy line shows, with one apply asked for. After `git checkout -- frontends/shell/src/command/CommandBar.tsx`, `git status --porcelain` printed nothing.

(b) M1:
- Keep-copy saved to D:/wt-data/henter/rv-m1-keep.tsx. `sed -i '/latestDraft\.current !== pos\.draft/d'` removed exactly that one line (diff `1 deletion(-)`, the L176 guard).
- The same test, exit 1, with the same lines as in (a): `× RC-ENTER-AFTER-APPLIED: … 184ms`, the same AssertionError and the same `-`/`+` rows, then `Tests  1 failed | 24 skipped (25)`.
- Restored from the keep-copy. `cmp` against `git show HEAD:…CommandBar.tsx` printed CMP-HEAD-SAME, and porcelain was empty.

(c) `npx vitest run src/App.command.test.tsx`, exit 0: `Test Files  1 passed (1)`, `Tests  25 passed (25)`.

(d) `npm run verify`, exit 0, with 123 test files and 1571 tests passed. One deviation from the brief's one-call shape: a `grep -n '"verify"' package.json &&` sat between the `cd` and the hold in that call. It is read-only and harmless.

Hold and release lines (`also=` and `project=` values masked):
- (a) `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)` / `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- (b) the same form with shell=<m>, released.
- (c) the same form with shell=<m>, released.
- (d) the same form with shell=<m>, released.

No `others=`, no exit code 96-99, no MACHINE_ERROR, no WAIT_TIMEOUT. The script is `<u>/Development/Claude/machine/machine.ps1`. Logs: D:/wt-data/henter/rv-red.log, rv-m1.log, rv-green.log, rv-verify.log.

**Check 5: the words (passes)**
- The one comment line at L176 is true of the code. The only path that can leave the ref ahead of the committed draft when a later key task runs is the applied clear, which renders at default priority. Every other draft write renders before the next task: a discrete update flushes in a microtask, and `onChange` flushes synchronously.
- The changed string literals in CommandBar.tsx are only `useRef("")` and `latestDraft.current = ""`. No string the app shows changed.

**Findings**

Correctness: none.

Evidence: none. The worker's red, M1, green and verify claims all match my own runs.

Documentation:
- **D1, must-fix before merge.** The test comment in App.command.test.tsx (the comment line just before `const eventSlot`), sentence 3, blames jsdom. jsdom restores `window.event` itself; the artefact comes from React's development build together with vitest's global. "the last focus event" is also not shown: the stuck value is the event captured when the assignment first happens. This is not the human's wording, so the worker applies these words without a re-gate and the PR body lists them. Replace the sentence "jsdom leaves the last focus event as window.event, which would make React render at once as it does for a key press; a browser has none outside an event." with:
  "React's development build puts window.event back by assignment after a handler it calls, and vitest's global keeps an assigned value, so window.event stays an earlier event and React would render the continuation's updates at once, as for a key press; a browser has no window.event outside an event."
  Each clause checked against the code:
  - "puts window.event back by assignment after a handler it calls": react-dom.development.js L4136 and L4150-4152.
  - "vitest's global keeps an assigned value": chunks/index.D4dXTzh9.js L1099 and L1103-1104.
  - "React would render … at once, as for a key press": L10992-10999 and L25661-25688.
  - "a browser has no window.event outside an event": the HTML current-event rule. The shipped production build does not run `invokeGuardedCallbackDev`.

Notes (not blocking):
- **N1.** During the same window, a printable key (or Backspace) still brings back the applied text, because onKeyDown returns without `preventDefault`. The browser then edits the old text that is still in the field, and `onChange` sets that as the draft. This is unchanged from the base, and the form's test covers Enter only. The form's Change sentence "so the applied result's clear stands" therefore holds for keys the bar acts on, not for typed text. The case needs timing inside one Scheduler task after the IPC reply, which is shorter than a request round trip, so under the wording-blocks rule it is named here rather than blocking. Record it in item 68's KNOWN-LIMITATIONS text. The form is append-only.
- **N2.** The test carries no RECORDED MUTATION / OBSERVED AT comment, although the other tests in the file have one. The worker said so in its report. The M1 record therefore lives in the gate report and the PR body.
- **N3.** The `finally` sets `IS_REACT_ACT_ENVIRONMENT` back to the literal `true` instead of the saved value. That matches the file-level setting at L171, so it is correct as the file stands.

Files: C:/dev/wt/henter/frontends/shell/src/command/CommandBar.tsx, C:/dev/wt/henter/frontends/shell/src/App.command.test.tsx, C:/dev/wt/henter/governance/forms/frontends/COMMAND-BAR-ENTER-AFTER-AN-APPLIED-RESULT-PREREGISTRATION.md
