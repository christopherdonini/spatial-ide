Read: main at 44c6132360a8ee00823860c07e7bb8f63a7460b5, in the detached read checkout C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the same architect's draft for ADV-2026-11-22-38, node:describe-fails-after-opened-closes-the-handle@amendment-1-bound-architect, sent to it by message at 2026-11-22T19:58:27.519Z; its run: Read 5, Grep 4, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T19:58:32Z to 2026-11-22T20:03:27Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 19249 bytes, sha256 ab104bcb31cafa5bddc61afe7bf31a53fc2bd7cc32aaa095dc1e2ea80f942a9c, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. A drafting consult, not a gate.)

---

Ceiling: 270 lines (class 9)

Read: C:/dev/wt/read-1122 @ 44c6132360a8ee00823860c07e7bb8f63a7460b5
REPORT PATH: state/consults/2026-11-22-describe-fails-after-opened-closes-the-handle-amendment-1-bound-architect-draft.md

This is a drafting consult, not a gate. It drafts ADV-2026-11-22-38 items 3 and 4 for Amendment 1. Every code cite is at 44c6132360a8ee00823860c07e7bb8f63a7460b5. Every old text and "after the line" line below is copied byte for byte from the form, and each occurs once there. None overlaps another, and none overlaps the gate's E-1, E-2 or D-1 to D-4 old texts (form lines 56, 83, 89, 153, 169, 170 and 231). Three texts contain the form's own ``` fence, so they are in ````text fences. None of the texts touches `KNOWN-LIMITATIONS.md` or a string the app shows. None is the human's wording.

**Three things for the custodian:**
- **The ceiling is an estimate.** The form never stated how much of its 220 lines the drafted piece uses. The bound adds about 49 lines, so I cannot show it fits under 220, and I declare 270.
- **D-1's new text no longer holds as worded.** With the bound, a retry is no longer refused only once the close has settled. D-1 is the gate's sentence, not the human's. Replacement words are under item 2 (iv); they go in place of the gate's D-1 new text.
- **The bound is not measured.** The 2_000 ms value has a stated reason but no measurement behind it, and the form claims none.

## 1. The bound's value and its site

**Existing pattern.** The shell has no helper that puts a deadline on a promise. A grep for `Promise.race` outside the tests finds nothing.
- The nearest code is `capturePixels` in `frontends/shell/src/canvas/WorkingCanvas.tsx:2292-2319`. It keeps a `settled` flag, arms a `setTimeout` deadline, and calls `clearTimeout` on the completion. It is a dev end-to-end hook, not a product path.
- So `describeOpened` races the close against a timer and clears the timer once the race settles.
- No timer stays armed after the error is thrown. If the close wins, the timer is cleared. If the timer wins, it has already fired.

**Site.** `frontends/shell/src/admission/admitDataset.ts`, beside `describeOpened`: `export const DESCRIBE_FAILED_CLOSE_WAIT_MS = 2_000;`

**Its reason:**
- It caps how long a failed `describe`'s error waits for the close.
- It is under `WATCHDOG_PHASE_TIMEOUT_MS` = 5_000 (`frontends/shell/src/diagnostics/watchdog.ts:13`). That leaves room for `describe` itself, so the close alone cannot hold the describe phase past the watchdog's threshold.
- It is a declared value, not a measured one. It bounds the shell's wait, not the kernel's close. It has no docs/08 row.

**(i) Old (§2.1):**
```text
- It awaits `describe(dataset)`. On any rejection it first awaits `closeDataset(dataset)`, drops any rejection of the close, and then rejects with the **same** error it caught.
```
New:
```text
- It awaits `describe(dataset)`. On any rejection it first sends `closeDataset(dataset)`, then waits until the close settles or `DESCRIBE_FAILED_CLOSE_WAIT_MS` (`admitDataset.ts`, 2_000 ms) has passed since it was sent, whichever is first. It clears its timer, drops the close's reply and any rejection of it, whenever they come, and rejects with the **same** error it caught. After the bound the close is left running. Nothing else is added: no string, no log line, no retry of the close. The constant's doc gives its reason: it caps how long the error waits; it is under the watchdog's 5_000 ms (`frontends/shell/src/diagnostics/watchdog.ts:13` @ 44c6132360a8ee00823860c07e7bb8f63a7460b5), so the close alone cannot hold the describe phase past it; it is declared, not measured.
```
Clause check:
- "sends, then waits … whichever is first": the race in (ii).
- "clears its timer": the `clearTimeout` after the race.
- "drops … whenever they come": `.then(() => {}, () => {})` on the close's promise, which also covers a settle after the race.
- "left running": nothing cancels the call (`frontends/shell/src/skp/client.ts:59-71`).
- watchdog.ts:13 is `5_000`.

**(ii) Old (§2.1, the sketch):**
````text
  ```ts
  export async function describeOpened(dataset: string): Promise<DescribeResponse> {
    try { return await describeDataset(dataset); }
    catch (e) { await closeDataset(dataset).catch(() => {}); throw e; }
  }
  ```
````
New:
````text
  ```ts
  export const DESCRIBE_FAILED_CLOSE_WAIT_MS = 2_000;
  export async function describeOpened(dataset: string): Promise<DescribeResponse> {
    try { return await describeDataset(dataset); }
    catch (e) {
      const closed = closeDataset(dataset).then(() => {}, () => {});
      let timer: ReturnType<typeof setTimeout> | undefined;
      const deadline = new Promise<void>((resolve) => { timer = setTimeout(resolve, DESCRIBE_FAILED_CLOSE_WAIT_MS); });
      await Promise.race([closed, deadline]);
      clearTimeout(timer);
      throw e;
    }
  }
  ```
````
Clause check:
- The close is sent before the timer is armed, in the same synchronous turn: `call` records and invokes before its first `await` (client.ts:59-61).
- `closed` never rejects, so the race cannot carry the close's error, and a late settle is dropped.
- The race waits on a real completion signal with a deadline. It is not a sleep.

**(iii) Old (§2.1, the doc clauses):**
```text
- The doc comments of `admitProject` (`openProject.ts:56-61`), of the file header's first bullet (`openProject.ts:8-10`) and of `admitDataset` (`admitDataset.ts:41-47`) each gain one clause naming the close. These are the worker's words, read by both gates.
```
New:
```text
- The doc comments of `admitProject` (`openProject.ts:56-61`), of the file header's first bullet (`openProject.ts:8-10`) and of `admitDataset` (`admitDataset.ts:41-47`) each gain one clause naming the close and its bound. These are the worker's words, read by both gates.
```
Clause check: the only change is "and its bound", so the doc comments do not describe an unbounded wait.

**(iv) After the line (§2.3):**
```text
- Fire-and-forget close (OPEN-3): it would let the refusal show before the close is sent.
```
New:
```text
- An unbounded await of the close (OPEN-3 as first drafted): a close that never settled would hold the refusal back, with only the panel's in-flight line shown (ADV-2026-11-22-38 item 1).
```
Clause check:
- The in-flight line is `frontends/shell/src/admission/AdmissionPanel.tsx:167-173`, shown while `admit` is awaited (`:238`).

## 2. The changed sentences of §1

**(i) After the line (§1, May claim):**
```text
  - after an `opened` or an `open_dataset` reply, any failure of `describe` makes the shell send `close_dataset` for that handle before the run ends;
```
New:
```text
  - the run receives the refusal of `describe`, or the error rethrown, when the close settles or once `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed since the close was sent, whichever is first, and shows it as today; after the bound the close is left running, its reply and its rejection are dropped, and its Console entry is resolved only when it settles (`frontends/shell/src/skp/client.ts:59-71` @ 44c6132360a8ee00823860c07e7bb8f63a7460b5);
```
Clause check:
- "whichever is first": the race (§2.1), proven by S5 and S6.
- "shows it as today": `runAdmitPath` is unchanged (§5.2).
- "Console entry resolved only when it settles": `entry.resolveOk`, `resolveRefused` and `resolveThrew` run after `await invoke` (client.ts:61-69).

**(ii) After the line (§1, May not claim):**
```text
  - that a lock is freed when the close itself cannot reach the kernel.
```
New:
```text
  - that the project's lock is freed when the close has not settled by `DESCRIBE_FAILED_CLOSE_WAIT_MS`, or that a retry of the same reopen then finds it free: the refusal is then shown while the close still runs, and the lock is freed only once the close settles and the release it starts has run (§0.2);
  - that the refusal is returned at the bound exactly: the bound is a timer, which a webview runs no earlier than its delay and may run later (taken from documentation, not read in this repo);
  - that the close settles within the bound: the value is declared, not measured, and two of the close's waits have no bound in this code (§0.4, Amendment 1).
```
Clause check:
- A retry's `release_ended` keeps an entry whose handle the catalog still holds (`kernel/src/project/mod.rs:263-265`, `:780-782`). The kernel removes the handle only at `kernel/src/skp.rs:1660`, late in the close.
- Timer lateness: documentation, marked as such.
- "two waits": the §0.4 addition in item 5.

**(iii) Old (§6):**
```text
Every quantity is an assertion: call order, call counts, request shapes, typed codes and lock state. Nothing is timed.
```
New:
```text
Every quantity is an assertion: call order, call counts, request shapes, typed codes, timer counts and lock state. Nothing is measured: S5 and S6 run on vitest's fake clock, which the test moves, and no duration is recorded.
```
Clause check: S5 and S6 below; their only clock is the fake one.

**(iv) Replacement for the gate's D-1 new text.** This changes no form line; it goes in place of D-1's new words.
```text
  - The Console shows that call as a row, since `call` records every command (`frontends/shell/src/skp/client.ts:59`). After a failed `describe`, an operator can see that row, and once the close has settled, a retry of the same reopen is no longer refused as `skp.project_open_elsewhere`, since `open_project` runs `release_ended` before it takes the lock. Ordinary use does not reach a failed `describe` (§0.4).
```
Clause check:
- This is the gate's clause check, plus "once the close has settled". The release drops the entry only when the catalog no longer holds the handle (mod.rs:263-265; skp.rs:1660).

## 3. The tests and mutations

**(i) After the line (§4.1):**
```text
- **S4** `an opened reopen whose describe succeeds closes nothing`. A control: green at C1 and C2.
```
New:
```text
- **S5** `a describe failure whose close never settles rethrows the same error once the bound has passed`. On vitest's fake clock (a clock the test moves, not a sleep, so §2.4 and §8 item 6 hold), `describe` throws `err`, an `SkpCallError` of the mock's class with the envelope above, and `closeDataset` records its handle and returns a promise that never settles. `describeOpened("ds_s5")` is reached through the module namespace (`import * as admission from "../admission/admitDataset"`), and its settlement is recorded.
  - Outcome: closes equal `["ds_s5"]` before the clock moves; after `vi.advanceTimersByTimeAsync(DESCRIBE_FAILED_CLOSE_WAIT_MS - 1)` it has not settled; after one more ms it has rejected with `err` itself (`toBe`); `vi.getTimerCount()` is 0.
  - C1: red at the call: `describeOpened` is not exported at C1, so `admission.describeOpened` is not a function; the namespace import keeps S1 to S4 loading for their own reds. C2: green.
- **S6** `a describe failure whose close settles leaves no timer armed`. On the fake clock, `describe` throws `err` and `closeDataset` resolves. `describeOpened("ds_s6")` rejects with `err` itself without the clock moving, closes equal `["ds_s6"]`, and `vi.getTimerCount()` is 0.
  - C1: red at the call, as S5. C2: green.
```
Clause check:
- The `describe` mock is settable and the `closeDataset` mock records (§4.1). The mock covers admitDataset.ts's imports (gate attempt 1, Correctness).
- A typed `err` keeps M4 (E-2's words) from reaching S5 and S6, so E-2's named set "S2 and A2" stays true.
- No timers run in the rejection path: a grep of `console/recorder*`, `diagnostics/log.ts`, `diagnostics/renderTrace.ts` and `formatRefusal.ts` finds no `setTimeout` or `setInterval`. So the timer count measures only `describeOpened`'s timer.

**(ii) Old (§4.4, M1):**
```text
- **M1** (at C2): the close removed from `describeOpened`. Kills S1, S2, S3, A1 and A2.
```
New:
```text
- **M1** (at C2): the close removed from `describeOpened`, with its deadline: the caught error is rethrown at once. Kills S1, S2, S3, S5, S6, A1 and A2.
```
Clause check: S5 and S6 assert the closes, so both die. The rest is the gate's own check.

**(iii) After the line (§4.4):**
```text
- **M3** (at C2): `describeOpened` closes on success as well. Kills S4.
```
New:
```text
- **M5** (at C2): the deadline removed: the close awaited alone, as first drafted. Kills S5 at its settled-after-the-bound assertion.
- **M6** (at C2): the timer armed with a delay of 0 in place of `DESCRIBE_FAILED_CLOSE_WAIT_MS`. Kills S5 at its not-settled-before-the-bound assertion.
- **M7** (at C2): the `clearTimeout` removed. Kills S6 at its timer count.
```
Clause check:
- M5: S5 never settles. Every other test's close settles.
- M6: S5 settles at 0. In S6 the zero-delay timer is never advanced and is cleared. In the real-timer tests the mocked close settles in microtasks, and the close is sent first in every case.
- M7: S6 leaves one timer. In S5 the timer has fired.
- M2 stands as worded: removing the rejection handler makes the race reject with the close's error, which kills S3.

**The order tests still hold as drafted.** The close is sent before the race awaits, so:
- S1's order "describe, close, outcome" still holds;
- A1's third call and its shape are unchanged (`closeDataset` is untouched);
- S2, S3, A2 and S4 hold, with the same reasons as in the gate's check.

**(iv) Old (§5.3):**
```text
- any of S1 to S3, A1 or A2 not red at C1 for its own reason;
```
New:
```text
- any of S1 to S3, S5, S6, A1 or A2 not red at C1 for its own reason;
```
**(v) Old (§8):**
```text
7. A red/green claim for K1, or S1 to S3, A1 or A2 lacking their recorded C1 reds.
```
New:
```text
7. A red/green claim for K1, or S1 to S3, S5, S6, A1 or A2 lacking their recorded C1 reds.
```
Clause check for (iv) and (v): S5 and S6 are added; nothing else changes.

## 4. The watchdog note

After the line (§2.1):
```text
  - the watchdog's `begin`/`end` stay where they are.
```
New:
```text
  - in `admitDataset` the close falls inside the `describe` watchdog phase, begun before the describe and ended in the catch (`frontends/shell/src/admission/admitDataset.ts:60`, `:67-68` @ 44c6132360a8ee00823860c07e7bb8f63a7460b5). With the bound, the close holds that phase open for at most `DESCRIBE_FAILED_CLOSE_WAIT_MS`, under the watchdog's 5_000 ms (`frontends/shell/src/diagnostics/watchdog.ts:13`, `:45`), so a stalled close is no longer logged under "describe", unless the webview runs the bound's timer late (taken from documentation, not read in this repo); a `describe` that itself stays open past the remainder still is, by the existing line (`watchdog.ts:46-47`). No line is added. `admitProject` begins no watchdog phase (`frontends/shell/src/project/openProject.ts:62-78`).
```
Clause check:
- `begin("describe")` is at :60. The rejection skips :62, and `end("describe")` runs at :68.
- The phase is the describe plus the shorter of the close and the bound, and the bound is under 5_000 (:13, :45).
- The log line is :46-47.
- openProject.ts has no `begin` (:18-24, :62-78).
- The gate's "an existing line and an edge case" is kept as "No line is added".

## 5. The two unbounded waits and the host's main thread

After the line (§0.4):
```text
- Out of this node: a panic in `opened_of` after the entry is kept (`kernel/src/project/mod.rs:967-1046`, node (d)); and a webview reload that leaves every handle open (not read).
```
New:
```text
- Out of this node, a finding by reading for the queue (ADV-2026-11-22-38 item 6), each part marked by its source, read at 44c6132360a8ee00823860c07e7bb8f63a7460b5:
  - read in this repo: the kernel's close joins the open's watch threads, which return when the operating system completes each cancelled directory read (`engine/src/watch.rs:486-513`, `:322-331`); no code here bounds that completion;
  - read in this repo: the close drops the removed dataset after its guard (`kernel/src/skp.rs:1664`), and when the catalog held the last reference and no lease is in flight, its idle DuckDB connections close there (`engine/src/pool.rs:324`), "in an external section this code does not bound" (`kernel/src/lib.rs:189`, sub-line);
  - taken from Tauri 2's documentation, not read in this repo: a command declared without `async` runs on the main thread. The `close_dataset` binding is declared so (`frontends/shell/src-tauri/src/commands.rs:133-139`, read), so by that documentation every close holds the host's main thread while the kernel's close runs.
  No one has seen it stall. The piece bounds only the shell's wait (§2.1); it neither bounds nor changes either kernel wait.
```
Clause check:
- watch.rs:493-505 cancels, then joins. :322-331 is the wait that ends with `ERROR_OPERATION_ABORTED`.
- skp.rs:1662-1664. pool.rs:324. The lib.rs:189 quote is within one line.
- commands.rs:133-134 is `#[tauri::command]` and `pub fn close_dataset(`, with no `async`. The main-thread rule is from documentation only.

## 6. The budget (class 9)

After the line (§7):
```text
- **Line budget:** at most 220 changed lines (insertions plus deletions under §21c's rule, this form excluded), counted by `git diff --numstat origin/main...HEAD --` over the five paths at a named commit. An overrun is class 8, and this line is never edited.
```
New:
```text
- **Line budget, Amendment 1 (class 9, a scope addition on ADV-2026-11-22-38 item 4):** at most 270 changed lines, counted as the line above counts, over the same five paths. The bound adds an estimated 49: about 13 in `frontends/shell/src/admission/admitDataset.ts` (the constant and its doc, the race and the cleared timer) and about 36 in `frontends/shell/src/project/openProject.test.ts` (S5, S6, the namespace import, the fake clock's reset). The form declared 220 without its margin, so the addition is declared, not fitted. The line above is not edited; an overrun of 270 is class 8.
```
Old (§7):
```text
- No constant is added.
```
New:
```text
- One constant is added: `DESCRIBE_FAILED_CLOSE_WAIT_MS = 2_000` in `frontends/shell/src/admission/admitDataset.ts`, with its reason in its doc (§2.1, Amendment 1).
```
Clause check:
- No new file is needed: S5 and S6 go in an existing Scope file.
- No constant is added in a test.
- The full form already applies under §21c, so the class does not change.

## Files read (under C:/dev/wt/read-1122/ unless marked `<S>`)
- `<S>`/ADV-2026-11-22-38.md (whole)
- `<S>`/g-form-gate-1-report.md and `<S>`/ADV-2026-11-22-35.md (in the prior task)
- governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md (whole, prior task)
- frontends/shell/src/admission/admitDataset.test.ts (whole)
- frontends/shell/src/project/openProject.test.ts (:1-60)
- frontends/shell/src/canvas/WorkingCanvas.tsx (:2285-2329)
- frontends/shell/src/App.tsx (:1395-1419)
- greps over frontends/shell/src: `Promise.race`, `clearTimeout`, `deadline`, fake-timer usage, `capturePixels`, and timers in the recorder, log, renderTrace and formatRefusal files
- From the prior task, at the same commit: client.ts, watchdog.ts, main.tsx, admitDataset.ts, openProject.ts, AdmissionPanel.tsx, commands.rs, pool_poll.rs, kernel/src/skp.rs, kernel/src/lib.rs, engine/src/watch.rs, engine/src/pool.rs, ADR-018

Model: claude-opus-5-5 (Opus 5.5).
