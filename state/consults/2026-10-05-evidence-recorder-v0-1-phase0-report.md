*Custodian's filing note (2026-10-05): evidence-recorder-v0-1's worker phase 0 (the switch check, the timer reading of record, the verify-mutation scan), by a worker on the custodian's brief (run 10:27Z to 10:29Z; 38,789 subagent tokens, 9 tool uses), written to the custodian's scratchpad and copied here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is 3bb47b1279b76045bc8d47e750e0d297717a353e97066ae8923b72625a96191a. It wrote nothing else; the worktree `C:/dev/wt/rec01` stayed clean. Its step B confirms the form's I9 at 2.1.288 types; the architect drafts the form's Amendment 2 before any code. Profile paths redacted at filing: none.

---

# Evidence Recorder v0.1 — worker phase 0 (switch, timer reading, verify-mutation scan)

Worktree C:/dev/wt/rec01, branch cut/evidence-recorder-v0-1, HEAD 0c382bda490f4bb9a68825736f3eb42d476ab0fa. Nothing written but this file.

## Step A — plugin-test switch

Answer (observed at claude 2.1.289): `claude plugin test tools/mods/spatial-evidence-recorder` ran and exited 0 with 20 pass, 0 fail, 1 file; no "hooks modules turned off" message, no remote-off message.

Output (verbatim):
```
2.1.289 (Claude Code)

test\recorder.test.ts:
(pass) an approved command produces one complete run record [459.36ms]
(pass) a command outside the approved list produces no record and makes no engine call [275.88ms]
(pass) every approved spelling in the matcher table produces one record [541.02ms]
(pass) a failing or timed-out git call gives unavailable fields and leaves the result unchanged [323.67ms]
(pass) an edit or a commit during the run sets tree_changed_during_run [466.22ms]
(pass) an unavailable side reads tree_changed_during_run unavailable [243.44ms]
(pass) the errored arm records the tool's error flag and the text fields, never stdout or stderr [224.22ms]
(pass) persisted output gives unavailable stdout and stderr fields [142.00ms]
(pass) a refused call produces no record [227.98ms]
(pass) a background call passes with no engine call [294.59ms]
(pass) a subagent's turn end produces one usage record [242.98ms]
(pass) the main loop's turn end writes nothing, and missing values read unavailable [167.71ms]
(pass) every hook returns what next produced, byte for byte [481.20ms]
(pass) a leading absolute cd sets the tree, and any other cd leaves it unresolved [320.01ms]
(pass) the log root comes from git's common directory, one new file per record, with no read [454.64ms]
(pass) the before-side git calls are issued together [470.67ms]
(pass) every process call is git with no optional locks, a listed subcommand and the declared timeout [241.66ms]
(pass) a subagent's approved run records its listed type [327.73ms]
(pass) an auto-backgrounded result records backgrounded_after_ms with after fields unavailable [562.22ms]
(pass) a record carries no output, status or diff text [533.72ms]

 20 pass
 0 fail
Ran 20 tests across 1 file. [8.25s]
```
Note: the installed CLI is 2.1.289; the readable plugin types are 2.1.288's.

## Step B — timer reading (typed at 2.1.288)

Answer (typed at 2.1.288): `setTimeout` and `clearTimeout` are NOT declared for hook modules; the doc says a hooks module has no timers and waits on `$.clock`. `$.clock` has now/sleep/after/every; the hook budget is `ms` 10_000, the clock stops during `next` and `$` calls except a `$.clock` wait, which counts; the test kit has `mock.clock` (MockClock) that moves only on advance/set/settle.

Sources: `<skill-root>/types/claude-code.d.ts` and `<skill-root>/reference.md`.

Globals block, `<skill-root>/types/claude-code.d.ts:13763-13772` (header and `global {`), verbatim:
```
  /**
   * The globals of a hooks module's environment: these and no others (no DOM,
   * no Node). No code generation either: `eval` and `new Function` over a
   * string throw, and there is no `WebAssembly` (deliberately; a module that
   * needs compiled code runs it in a process of its own through `$.process.run`).
   * A surface module's environment (Client) has the same globals and a
   * `console`; neither has timers (a hooks module waits on `$.clock`, a
   * surface module on `surface.every`).
   */
  global {
```
Declared globals (each at its `<skill-root>/types/claude-code.d.ts` line, block 13772-13897):
- 13784 `const h`; 13793 `const Fragment`; 13800 `namespace JSX`
- 13813 `interface AbortSignal`; 13824 `var AbortSignal`; 13830 `interface AbortController`; 13834 `var AbortController`
- 13838 `interface TextEncoder`; 13842 `var TextEncoder`; 13843 `interface TextDecoder` (opens at 13843-13847 region); 13847 `var TextDecoder`
- 13848 `interface URLSearchParams`; 13858 `var URLSearchParams`; 13862 `interface URL`; 13878 `var URL`
- 13883 `function atob`; 13884 `function btoa`; 13885 `function structuredClone<T>`; 13886 `var crypto`; 13896 `var performance: { now(): number }`
- No `setTimeout`/`clearTimeout` declaration in that block; a grep of the whole file for both names matched nothing (the only timer mentions are the note at 13769 and the Timer types).

`$.clock` members, `<skill-root>/types/claude-code.d.ts:3218-3257`:
- 3225 `now: () => Promise<number>;`
- 3239 `sleep: (ms: number, options?: SleepOptions) => Promise<void>;`
- 3246 `after: TimerCall;`
- 3256 `every: TimerCall;`
- 11923 `export type TimerCall = (ms: number, fn: () => void) => Timer;`
- 11912-11917 `export type Timer = {` with `cancel: () => void;` at 11916
- 11215 "Options of `$.clock.sleep`." (SleepOptions; `signal` per 3234)

Verbatim, `<skill-root>/types/claude-code.d.ts:3229-3231`:
```
           * The wait is the hook's own time and its budget runs on through it, as
           * through no other `$` call: a `turn.step` generator that polls with it
           * pays every sleep out of its one budget (`next.budget.remainingMs`).
```

Hook budget, verbatim, `<skill-root>/types/claude-code.d.ts:4796-4798`:
```
   * Each bounds the hook's OWN time: the clock stops while a `next(e)` call or
   * any `$` call of the hook's is in flight (a `$.clock` wait excepted), so a
   * slow chain beneath or a minute-long `$.model.complete` costs it nothing.
```
and `<skill-root>/types/claude-code.d.ts:4803-4812`:
```
  export type HookBudget = {
      /**
       * A hook's budget per dispatch, from its call to its return; past it the
       * hook is absent (its `.catch` asked, else `next(e)` run on its behalf).
       *
       * A streaming hook's (an async generator) counts only while its own code
       * runs, never at a `yield` or while it reads beneath: on `turn.step` the
       * sum over the response; on `process.spawn` per piece, anew at each pull.
       */
      readonly ms: 10_000;
```
- `ms` = 10_000 (line 4812); `catchMs` = 1_000 (line 4820). A `$.clock` wait counts against the budget; other `$` calls do not (lines 4796-4798, 3229-3231). `<skill-root>/reference.md:124` agrees ("a `next` or `$` call in flight does not count; a `$.clock.sleep` does").

Test kit clock, module `claude-code/testing` (declared at line 13900), `<skill-root>/types/claude-code.d.ts:14461-14474`, verbatim:
```
  export type Mock = {
      /**
       * Answers `$.clock` from a clock in memory that moves only when the test
       * moves it: `clock.now` reads it, and each wait is held.
       *
       * A held wait resolves when an advance crosses the time it is due, and is
       * dropped when its dispatch aborts; one held past a hook's budget (ten
       * seconds of real time) is let go, as a hook that overran.
       *
       * @param on the test's `on`
       * @param options where the clock starts (`now`, 0 when not given)
       * @returns the clock: its time, and the calls that move it
       */
      clock: (on: On, options?: MockClockOptions) => MockClock;
```
MockClock (`<skill-root>/types/claude-code.d.ts:14505-14549`): 14512 `now: () => number;` · 14523 `advance: (ms: number) => Promise<void>;` · 14530 `set: (ms: number) => Promise<void>;` · 14540 `settle: () => Promise<void>;` · 14548 `sleep: (ms: number) => Promise<void>;`. 14554 `MockClockOptions` (`now`, ms, 0 default, 14552-14553).

## Step C — verify-mutation scan (at 0c382bda490f4bb9a68825736f3eb42d476ab0fa)

Answer: `scripts/plan/verify-mutation.mjs` names no directory. It diffs only files matching `TEST_GLOBS`, `scripts/plan/verify-mutation.mjs:249`: `const TEST_GLOBS = ['*.rs', '*.test.mjs', '*.test.ts', '*.test.tsx', '*.test.js', '*.test.jsx'];`, passed as git pathspecs at `scripts/plan/verify-mutation.mjs:259` (`git diff --unified=0 base...head -- ...TEST_GLOBS`). By git pathspec semantics (a `*` crosses `/`; stated from git's behaviour, not run) `tools/mods/**/*.test.ts` and `scripts/evidence/*.test.mjs` match; non-test files under `scripts/evidence/` (for example `archive.mjs`) are not scanned. A grep of the file for "scripts/evidence" and "tools/mods" matched nothing.

## Commands run (all with timeouts or short reads)
1. `timeout 30 claude --version` — rc 0
2. `timeout 120 claude plugin test tools/mods/spatial-evidence-recorder` (cwd the worktree) — rc 0
3. grep on scripts/plan/verify-mutation.mjs for globs — rc 0
4. ls and grep on the d.ts under `<skill-root>` — rc 0
5. sed excerpts of the d.ts and of verify-mutation.mjs lines 240-262 — rc 0
6. awk globals listing, git rev-parse HEAD, grep of verify-mutation for paths, ls scripts/evidence — rc 0
7. grep on `<skill-root>/reference.md` — rc 0
8. one report-write heredoc failed (rc 2, shell parse error, nothing written); the report was then written with the Write tool
