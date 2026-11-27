Reviewed: PR 360, the branch cut/describe-failed-close at 3755df8132e3a4c83814451ecab1eda9f0172cc5, in C:/dev/wt/gclose (the custodian's filing note, 2026-11-22: the reviewer's build gate, node:describe-fails-after-opened-closes-the-handle@build-gate-reviewer-1, dispatched at 2026-11-22T22:02:32.679Z; its run: Bash 58, Read 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T22:02:38Z to 2026-11-22T22:23:00Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 16610 bytes, sha256 b58929e27b9d46618a632e7c759627537f0341ca930f1c01c02c00c43cb23c0d, byte for byte, nothing masked, with one final newline added. FAIL on one blocking finding in words only: C-1 (Correctness, four doc comments, the worker's words, claim a limit and an order the code does not give), with replacement words R1 to R4 checked clause by clause; under governance/AUTONOMY.md section 31 item d the worker applies them with no re-gate, as C4, dispatched at 2026-11-22T22:26:03.609Z, and the PR body lists them. D-1 to D-3 are for the closing amendment. The code, the C1 reds, all eight mutations, the suites and CI hold by its own runs.)

---

Verdict: FAIL · cut/describe-failed-close @ 3755df8132e3a4c83814451ecab1eda9f0172cc5
Reviewed: C:/dev/wt/gclose @ 3755df8132e3a4c83814451ecab1eda9f0172cc5
REPORT PATH: state/consults/gates/2026-11-22-describe-fails-after-opened-closes-the-handle-build-gate-reviewer.md

The code, the tests, the C1 reds, all eight mutations, the suites, §7 and CI all hold. There is one blocking finding, and it is in the words only. Four doc comments claim a hard upper bound on the wait ("at most", "caps", "cannot"), or say that the handle is closed before the error goes on. The code does not give either. These are the worker's words and not the human's (§2.1 text 3 says "These are the worker's words"). Under §31 (the wording-blocks rule) the worker applies the words below with no re-gate, and the PR body lists them.

## Correctness (blocking)

**C-1. The doc clauses claim a limit and an order the code does not give.** Places: `frontends/shell/src/admission/admitDataset.ts:46-48` and `:80-82`; `frontends/shell/src/project/openProject.ts:10-12` and `:62-63`.
- **The limit.** The wait ends when the timer at `admitDataset.ts:99` fires, and a timer fires at its delay or later. The bound is therefore not a ceiling. ADV-2026-11-22-39 item 2 calls "no later than the bound" "a guarantee the code cannot give". The form's §1 "may not claim" (Amendment 1 item 2) excludes "that the refusal is returned at the bound exactly". "Waiting at most", "after at most", "it caps" and "cannot hold the `describe` phase past it" each make that excluded claim. The watchdog note in Amendment 1 item 4 keeps the qualifier "unless the webview runs the bound's timer late", which the constant's doc drops.
- **The order.** "First closes the opened handle" and "closes the opened handle first" are not true once the bound passes. The error then goes on while the close is still running (`:96`, then `:101` to `:103`). The code only sends the close first.
- **Reach.** Under the proportional-gates rule an untrue claim of a limit stays Correctness. It is not exempt as unreachable: §0.4 (d) leaves the reach of an untyped failure unread, and ADV-2026-11-22-38 item 1 does not rest on a guess that ordinary use cannot meet it.
- **The case not covered.** A timer the webview runs late, which is taken from documentation and not read in this repo. R4 records it in the constant's own comment.

**R1.** `admitDataset.ts`, the doc of `admitDataset`. Old:
```text
 * into product UI; an unexpected failure is exactly what those handlers exist for. A `describe` that
 * fails, typed or not, first closes the opened handle (`describeOpened`), waiting for the close at most
 * `DESCRIBE_FAILED_CLOSE_WAIT_MS`.
```
New:
```text
 * into product UI; an unexpected failure is exactly what those handlers exist for. A `describe` that
 * fails, typed or not, first sends `close_dataset` for the opened handle (`describeOpened`), and the failure
 * goes on when the close settles or once `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first.
```
Clause check against the code:
- "typed or not": the catch at `:95` takes any `e`.
- "first sends `close_dataset`": `closeDataset` at `:96` calls `client.ts`'s `call`, which calls `invoke` before its first await. The timer is armed after that (`:97-100`).
- "goes on when the close settles or once … has passed, whichever is first": the race at `:101`, then `throw e` at `:103`, which reaches the catch at `:68`.
- "has passed" also holds for a late timer.

**R2.** `openProject.ts`, the header's first bullet. Old:
```text
 *   (O-14); the panel re-enters the run with the answer, or with the re-link and the answer the run already gave. A `describe` that fails after
 *   `opened` closes the opened handle first, waiting for the close at most `DESCRIBE_FAILED_CLOSE_WAIT_MS` (`admission/admitDataset.ts`'s
 *   `describeOpened`).
```
New:
```text
 *   (O-14); the panel re-enters the run with the answer, or with the re-link and the answer the run already gave. A `describe` that fails after
 *   `opened` first sends `close_dataset` for the opened handle, and the failure goes on when the close settles or once
 *   `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first (`admission/admitDataset.ts`'s `describeOpened`).
```
Clause check against the code: `openProject.ts:74` calls `describeOpened`. The rest is checked as R1.

**R3.** `openProject.ts`, the doc of `admitProject`. Old:
```text
 * handle, which frees the project's lock once the kernel has closed it and its release has run; the failure goes on when the close settles or
 * after at most `DESCRIBE_FAILED_CLOSE_WAIT_MS`. A cancel after the engine's open answers `opened` and is applied as any `opened` is
```
New:
```text
 * handle, which frees the project's lock once the kernel has closed it and its release has run; the failure goes on when the close settles or
 * once `DESCRIBE_FAILED_CLOSE_WAIT_MS` has passed, whichever is first. A cancel after the engine's open answers `opened` and is applied as any `opened` is
```
Clause check against the code:
- The lock clause is kept. `commands.rs` `close_dataset` calls the host's close, then spawns `release_ended`. K1 proves that the lock is free after the close and the release (my run: ok).
- The bound clause is checked as R1.

**R4.** `admitDataset.ts`, the doc of `DESCRIBE_FAILED_CLOSE_WAIT_MS`. Old:
```text
 * How long a `describe` that failed after a handle was returned waits for that handle's close before its error goes on. It caps how long the
 * error waits. It is under the watchdog's `WATCHDOG_PHASE_TIMEOUT_MS` (5_000 ms, `diagnostics/watchdog.ts`), so the close alone cannot hold the
 * `describe` phase past it. It is declared, not measured.
```
New:
```text
 * How long a `describe` that failed after a handle was returned waits for that handle's close before its error goes on. It is the delay of the
 * timer that ends that wait; a timer runs at its delay or later (taken from documentation, not read in this repo). It is under the watchdog's
 * `WATCHDOG_PHASE_TIMEOUT_MS` (5_000 ms, `diagnostics/watchdog.ts`), so the close alone does not hold the `describe` phase past it, unless that
 * timer runs late. It is declared, not measured.
```
Clause check against the code:
- "the delay of the timer that ends that wait": `setTimeout(resolve, DESCRIBE_FAILED_CLOSE_WAIT_MS)` at `:99`, raced at `:101`.
- "under … 5_000 ms": `watchdog.ts:13`.
- "does not hold the phase past it": `begin("describe")` at `admitDataset.ts:62`, ended at `:64` or `:70`. The watchdog logs only when `openMs > WATCHDOG_PHASE_TIMEOUT_MS` (`watchdog.ts:45`).
- "declared, not measured": nothing measures it.

Each old text occurs once in its file. I checked a distinctive span of each with `grep -c -F`, and each count was 1.

## Evidence
None. Every claim below rests on my own runs at the head.

## Documentation (must fix before the merge, in the closing amendment)
- **D-1. A1's "two calls".** A1 and A2 count SKP commands through `skpCommands()` (`admitDataset.test.ts`, the helper beside `describeFailsWith`). At C1 the raw `invoke` count for A1 is three, because `logSessionEvent` invokes `binding_log_session_event`. The closing amendment names that the form's "(two calls)" is read over `skpCommands()`, by reference to that line.
- **D-2. The form's own wording.** Amendment 1's §2.1 text 1 gives the constant's reason in the same unqualified words ("caps", "cannot hold"). The form is append-only, so the closing amendment records, by reference, that the constant's doc now carries the late-timer qualifier (R4), as the watchdog note in Amendment 1 item 4 has it.
- **D-3. A note, not a must-fix.** C2's commit subject says "waiting at most 2000 ms". It is the brief's subject and cannot be changed on the branch (no amend). The closing amendment and the PR body should not repeat it.

## The checks

**1. The full diff, §2 and §7 as amended, and §8 item by item.**
- The diff touches five files, the five §7 paths.
- `describeOpened` matches the Amendment 1 sketch line for line.
- §8, item by item:
  1. Nothing under protocol/, engine/ or kernel/src/ (count 0), and no new code, field or message. Holds.
  2. No string the app shows and no log line. Holds.
  3. `throw e` rethrows the caught object, and the close's outcome is dropped. Holds.
  4. The close is sent only in the catch, after `open_dataset` or `opened` has returned a handle. Holds.
  5. No manifest, lockfile, dependency or workflow edit. Holds.
  6. S5 and S6 use the fake clock. There is no sleep, retry or skip. Holds.
  7. The C1 reds are reproduced below. Holds.
  8. No file outside §7. Holds.
  9. The PR is a draft. Holds.
- §5.2 holds: `runAdmitPath`, the binding and item 72's words are unchanged.
- C3 changes comment lines only against C2. A check of `git diff b3dbbdff 3755df81` for any non-comment line found none (rc 1).

**2. The C1 reds** (`<S>/gr-c1-red.txt`, vitest rc 1). With B's two product files in place:
- S1 is red at `openProject.test.ts:189`: `expected [] to deeply equal [ 'ds_s1' ]`.
- S2 is red at `:200`: `expected [] … [ 'ds_s2' ]`.
- S3 is red at `:213`: `expected [] to have a length of 1 but got +0`.
- S5 is red at `:235` and S6 at `:255`: `describeOpened is not a function`.
- A1 is red at `admitDataset.test.ts:198` and A2 at `:206`: `expected [ 'open_dataset', 'describe' ] to deeply equal […3]`.
- S4 is green, and the other 10 tests pass.

Each red is for the reason the form gives. After the restore, porcelain was 0 bytes.

**3. The mutations.** I made each one with one anchored `sed` at the head. C3 differs from C2 in comments only. I ran both shell files for every shell mutation, so that a kill outside its set would show. Each file was restored by `git checkout --`, porcelain was 0 bytes after each, and the sha256 matched the head (admitDataset.ts c410a2cd…bfdde, project_reopen_skp.rs 0b0c5271…d1a7ea).

| Mutation | Change | Failing tests | Out-of-set kills | Output |
|---|---|---|---|---|
| M1 | lines 96-102 deleted | S1 :189, S2 :200, S3 :213, S5 :240 ("the close is sent before the clock moves"), S6 :256, A1 :198, A2 :206; 7 in all | none | `<S>/gr-mut-M1.txt`, rc 1 |
| M2 | `.then(() => {})` | S3 only, by the close's own Error thrown out of `admitProject` (:212) | none | `<S>/gr-mut-M2.txt` |
| M3 | close on success, one line | S4 only, :224 `expected [ 'ds_s4' ] to deeply equal []` | none; the admitDataset success test does not catch it, and the form's set does not ask it to | `<S>/gr-mut-M3.txt` |
| M4 | `e instanceof SkpCallError ? e : new TypeError(String(e))` | S2 :199 and A2 :205, at `toBe` | none; S1, S3 and A1 pass | `<S>/gr-mut-M4.txt` |
| M5 | `await closed` in place of the race, one line; the worker removed the whole deadline, and both are faithful | S5 only, :244 "settled once the bound has passed" | none | `<S>/gr-mut-M5.txt` |
| M6 | delay 0 | S5 only, :242 "not settled before the bound" | none | `<S>/gr-mut-M6.txt` |
| M7 | `clearTimeout` removed | S6 only, :257 `expected 1 to be +0` | none | `<S>/gr-mut-M7.txt` |
| KM1 | line 703 `rig.close(&handle);` removed | K1 only, at step 6 by its message: `open.lock is free after the close and the release: Err(Held)`; 7 others pass | none | `<S>/gr-mut-KM1.txt`, cargo rc 101, in a hold |

The worker ran M2, M3 and M5 to M7 on `openProject.test.ts` alone. My runs of both files show no out-of-set kill.

**4. The worker's four things to check.**
1. C2 committed before the mutations: the form allows it. §4.4 records each failure "with the commit", which needs C2 committed. The worker's mutation logs carry b3dbbdff.
2. `skpCommands()`: the form allows it. It filters out only the binding-local log command, and the mock throws on any other unexpected command. The raw `toHaveBeenNthCalledWith(3, "close_dataset", {request:{skp:"skp/0.14",dataset}})` still asserts the form's "third call". D-1 records the reading.
3. S3's plain `Error`: the form allows it. §4.1 says only "`closeDataset` rejects". With the describe's own envelope, M2 would be indistinguishable from a pass.
4. The brief's additions (`--locked`, verify-test-claims, TMP/TEMP): the form allows them. They are stricter and conflict with nothing.

**5. The doc clauses against the code.**
- `describeOpened`'s doc holds clause by clause: sends, waits whichever first, clears, same error, dropped whenever, left running.
- K1's doc holds: `SkpHost::describe` refuses only on the version and on `unknown_dataset` (`kernel/src/skp.rs:1362-1366`). The binding's order is close, then spawn `release_ended`.
- The test-helper docs hold. `unknown_dataset`'s message matches `protocol/skp/src/v0/error.rs:64-72`.
- The three §2.1 doc clauses and the constant's doc fail, as C-1.

**6. The suites at the head.**

| Suite | Result | Output |
|---|---|---|
| `npm run typecheck` | rc 0 | `<S>/gr-suite-typecheck.txt` |
| whole shell unit suite (`npx vitest run`, in a hold) | rc 0, `Test Files 123 passed (123)`, `Tests 1578 passed (1578)` | `<S>/gr-suite-unit.txt` |
| `cargo test --locked -p spatial-kernel --test project_reopen_skp` (in a hold) | rc 0, K1 ok, `8 passed; 0 failed` | `<S>/gr-suite-k1.txt` |
| `cargo fmt --all -- --check` | rc 0, empty | `<S>/gr-suite-fmt.txt` |
| `cargo clippy --locked -p spatial-kernel --tests` (in a hold) | rc 0, 14 warnings, none in `project_reopen_skp.rs` (grep rc 1) | `<S>/gr-suite-clippy.txt` |

**7. §7.** `git diff --numstat origin/main...HEAD` (`<S>/gr-numstat.txt`, rc 0):

| File | Added | Removed |
|---|---|---|
| admitDataset.test.ts | 34 | 0 |
| admitDataset.ts | 33 | 3 |
| openProject.test.ts | 112 | 2 |
| openProject.ts | 9 | 5 |
| project_reopen_skp.rs | 44 | 4 |

That is 246 lines over 5 files. It is within Amendment 1's class 9 ceiling of 270, declared before any code. 246 is over the first line's 220, which that addition supersedes, so it is not a class 8 overrun. origin/main is 1938c1b5 and the merge base is B.

**8. The caller rule.**
- `describeOpened` has two product callers, `admitDataset.ts:63` and `openProject.ts:74`. Each of those is called from `AdmissionPanel.tsx` (`:366` and the default admit).
- `DESCRIBE_FAILED_CLOSE_WAIT_MS` is read by product code at `admitDataset.ts:99`. Its export is read by S5 alone, as Amendment 1's sketch declares.
- `closeDataset` is an existing export with existing callers.

No finding.

**9. CI.** Read at 2026-11-22T22:21:21Z (`gh pr checks 360`, rc 0, `<S>/gr-ci.txt`): 20 pass, 0 fail, 0 pending. At my first read, 22:13:16Z, one run of `cargo test --workspace (windows-latest)` was still pending. It has since passed.

**The holds.** Every hold was granted, and there were no codes 96 to 99. The hold and release lines carried `also=<m>` and `project=<m>`. The KM1 hold printed 8 MACHINE_WAITING lines (`<m>`) before it was granted.

**State at the end.** `git status --porcelain` was empty and HEAD was 3755df8132e3a4c83814451ecab1eda9f0172cc5. I made no commit and no push.

## Files read
- `C:/dev/wt/read-1122/governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md` (whole, Amendment 1 first)
- `C:/dev/wt/read-1122/state/directives/`: the files of ADV-2026-11-22-32, -35, -38 and -39 (whole)
- `<S>/g-diff-3755df81.txt`, `<S>/g-build-report.md`, `<S>/g-build-report-2.md`, `<S>/brief-g-build-1.md`, `<S>/g-run-mut.sh`, `<S>/g-numstat.txt`, `<S>/g-commit-c*.txt`, `<S>/g-mut-*.txt`
- `C:/dev/wt/gclose/frontends/shell/src/admission/admitDataset.ts`
- `C:/dev/wt/gclose/frontends/shell/src/admission/admitDataset.test.ts`
- `C:/dev/wt/gclose/frontends/shell/src/project/openProject.ts`
- `C:/dev/wt/gclose/frontends/shell/src/project/openProject.test.ts` (through the diff)
- `C:/dev/wt/gclose/frontends/shell/src/diagnostics/watchdog.ts`
- `C:/dev/wt/gclose/frontends/shell/src/diagnostics/log.ts`
- `C:/dev/wt/gclose/frontends/shell/src/skp/client.ts` (40-150)
- `C:/dev/wt/gclose/frontends/shell/src/admission/AdmissionPanel.tsx` (by grep)
- `C:/dev/wt/gclose/frontends/shell/src-tauri/src/commands.rs` (75-150)
- `C:/dev/wt/gclose/kernel/src/skp.rs` (1361-1386)
- `C:/dev/wt/gclose/kernel/tests/project_reopen_skp.rs` (30-172, 669-711)
- `C:/dev/wt/gclose/protocol/skp/src/v0/error.rs` (64-72)
- `C:/dev/wt/gclose/KNOWN-LIMITATIONS.md` (item 72)

My outputs are in `<S>`: `gr-c1-red.txt`, `gr-mut-M1.txt` to `gr-mut-M7.txt`, `gr-mut-KM1.txt`, `gr-suite-typecheck.txt`, `gr-suite-fmt.txt`, `gr-suite-unit.txt`, `gr-suite-k1.txt`, `gr-suite-clippy.txt`, `gr-numstat.txt`, `gr-ci.txt` and `gr-run-mut.sh`. The hold script is `<u>/Development/Claude/machine/machine.ps1`.

Model: Opus 5.5 (claude-opus-5-5).
