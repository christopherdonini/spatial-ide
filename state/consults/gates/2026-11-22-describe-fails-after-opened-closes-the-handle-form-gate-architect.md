Reviewed: main at 44c6132360a8ee00823860c07e7bb8f63a7460b5, in the detached read checkout C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's form gate, attempt 1, on node (g)'s full form, node:describe-fails-after-opened-closes-the-handle@form-gate-architect-1, dispatched at 2026-11-22T19:25:34.706Z; its run: Read 34, Glob 2, Grep 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T19:25:38Z to 2026-11-22T19:32:19Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13811 bytes, sha256 fee9d29a17980c4d2bd3d7d077b62a1949e662db1d5f963941277386a1e9536e, byte for byte except that 1 scratch-folder paths are written as <S>, and with one final newline added. FAIL: two Evidence findings in section 4 (E-1, E-2) and four Documentation findings (D-1 to D-4), their words for the form's Amendment 1; OPEN-2 to OPEN-6 ruled by the advisor's ruling ADV-2026-11-22-35 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-35-node-g-open-2-to-open-6-as-recommended-open-3-the-awaited-close-bounded-by-reading-amendment-1-then-attempt-2.md`).)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1122 @ 44c6132360a8ee00823860c07e7bb8f63a7460b5

Branch: none. I read the form on main, in the detached read worktree, at the commit above. The FAIL rests on two Evidence findings, both in §4 (the tests and their mutations). The change itself is sound against the shell's real interfaces, the class holds, and every quote matches its source. Both Evidence findings can be fixed with words, and replacement words are below. The form is append-only, so every old/new pair below goes into an Amendment 1 (class 4 for E-1 and E-2) committed before any code. No committed line is edited. Attempt 2 reads that amendment.

## Correctness
None. What I checked against the tree at 44c61323:
- **The seam (ADV-2026-11-22-32 item 1).**
  - `admitProject` matches §0.3: it calls `describeDataset(dataset)` at openProject.ts:70, and its catch turns only an `SkpCallError` into `refused` (:72-77).
  - `admitDataset` matches too (admitDataset.ts:56-74). Its catch calls `end` for both phases whatever the error, so moving the close inside `describeOpened` leaves the watchdog's pairing as §2.1 says.
  - `describe` and `closeDataset` are `call(...)` with `{ skp, dataset }` (client.ts:97-99, :136-138). `call` records before it invokes (:59), throws `SkpCallError` for an envelope and rethrows any other error as the same object (:64-71). So `describeOpened` can rethrow "the same error".
  - Importing from openProject.ts into admitDataset.ts creates no runtime import cycle: admitDataset.ts imports only `type Reopened`.
  - openProject.test's `vi.mock("../skp/client")` also covers admitDataset.ts's imports at C2. No App test mock makes `describe` fail (grep over every `describe:` mock), so no existing close-count assertion moves.
  - Kernel `describe` refuses only by `check_version` and by a handle missing from the catalog (skp.rs:1361-1366), so `version_unsupported` is the only refusal that leaves the handle open (K1 step 3).
  - `ProjectLock::try_lock` refuses `Held` within the same process (store.rs `LockRefused::Held` doc; W-4 "held").
- **§1 claims.**
  - `runAdmitPath` awaits `admit` (AdmissionPanel.tsx:238), so an awaited close lands before the run ends, on both the typed and the untyped path.
  - No wire change: `close_dataset` is an existing class-A row (surfaceRegistry.ts:86), and §8 item 1 forbids anything under `protocol/`.
  - No new refusal, string or log line.
- **The class (ADV-2026-11-22-32 item 2).**
  - Under item 2 of ADV-2026-11-16-06 it is full: the seam ground of 2 (a), and 2 (b)'s "In doubt".
  - The custodian's §21a to §21c reading holds. "No new user-visible behaviour" (§21c) fails: the new Console row, and the retry's outcome (see D-1).
  - The fuller class is taken. Both readings agree: full.
- **Constitution.**
  - docs/01 principle 7 holds: the close is awaited inside the admission run, it is the same synchronous binding every close already uses (commands.rs:133-153), and the release runs on a thread of its own (:142-147).
  - docs/02: the change is shell-only, plus a kernel test.
  - docs/10: control plane only.
  - ADR-006: closing a handle that was never admitted mutates no workspace and records no step.
  - Round-25 items: §7 records an overrun as class 8 and is never edited; §4.4 uses the observation wording; no branch-commit pins.
- **Caller rule.** `describeOpened` has two product callers.

## Evidence
**E-1 (§4.4, KM1): the predicted failure point is wrong.**
- `saved.retain(|_| true)` at mod.rs:265 also keeps the entry, and the lock, of the save made in K1's step 1. `Rig::saved` relies on that same `release_ended` (project_reopen_skp.rs:135-142).
- So step 2's reopen fails at `ProjectLock::try_lock`, which runs after `release_ended` at mod.rs:780-782, with `skp.project_open_elsewhere`.
- K1 dies at step 2, never at step 6. Step 6's assertion is left with no mutation that reaches it.
- Any product mutation of the release path bites at the rig's setup first. The mutation that isolates step 6 has to be in K1 itself.

```text
- **KM1** (at C2): `release_ended` keeps every entry (`saved.retain(|_| true)` at `kernel/src/project/mod.rs:265`). Kills K1 at step 6, by its message.
```
```text
- **KM1** (at C2, in K1 alone): step 5's `rig.close(&handle)` removed, `rig.projects.release_ended()` kept. Kills K1 at step 6, by its message: the catalog still holds the reopened handle, so `release_ended` keeps its entry and its lock. A product mutation of `release_ended` (`saved.retain(|_| true)` at `kernel/src/project/mod.rs:265`) is not listed: it also keeps the entry of the save `rig.inside()` makes, so K1 fails at step 2 (`skp.project_open_elsewhere`) and never reaches step 6.
```
Clause check:
- With the close removed, the catalog holds the handle and `require_live` passes (mod.rs:263-265), so the entry and its `_lock` stay, and step 6's `try_lock` answers `Held`.
- Steps 1 to 4 are unchanged, so they pass.
- The product mutation fails at step 2, as reasoned above.

**E-2 (§4.2 A2 and §4.4 M4): M4's named set is wrong, and A2 declares no assertion that would kill M4.**
- As worded, "the caught error replaced by a new one" also turns a typed refusal into an untyped rethrow. S1, S3 and A1 then fail too, so the named set "S2 and A2" will not match what the run records.
- A2 declares no same-object assertion. If A2 is written like the existing `rejects.toThrow(TypeError)` (admitDataset.test.ts:125), a replacement `TypeError` passes it. That is a known pass case.

```text
- **A2** `a describe that fails untyped after open_dataset sends close_dataset and rethrows`. C1: red. C2: green.
```
```text
- **A2** `a describe that fails untyped after open_dataset sends close_dataset and rethrows the same error`. `describe`'s `invoke` rejects with a `TypeError`. `admitDataset` rejects with that same object, and the third call is `close_dataset` for the opened handle. C1: red at the third call (two calls). C2: green.
```
```text
- **M4** (at C2): the caught error replaced by a new one before the rethrow. Kills S2 and A2.
```
```text
- **M4** (at C2): in `describeOpened`, a caught error that is not an `SkpCallError` replaced by `new TypeError(String(e))` before the rethrow. Kills S2 and A2, each at its same-object assertion. A typed refusal is still rethrown as caught, so S1, S3 and A1 pass.
```
Clause check:
- `call` rethrows a non-envelope error as the same object (client.ts:69-70), so A2 can assert identity.
- An envelope arrives as the real `SkpCallError` (client.ts:67), so the mutation leaves the typed path alone.
- `admitDataset` and `admitProject` rethrow whatever is not an `SkpCallError` (admitDataset.ts:73; openProject.ts:73).

The other mutations are sound:
- M1 kills S1 to S3, A1 and A2.
- M2 kills S3, whatever the close rejects with.
- M3 kills S4 only. The existing success tests check the 1st and 2nd calls, not the count.
- No other listed mutation has a known pass case.

## Documentation (must be fixed before the merge, in Amendment 1)
None of these sentences is the human's wording. All are lead-data's draft, so the worker applies them with no re-gate, and the PR body lists them.

**D-1 (§1, "No wire change" bullet): "the only change an operator can see" is untrue.** A retry of the same reopen also changes outcome.
```text
  - The Console shows that call as a row, since `call` records every command (`frontends/shell/src/skp/client.ts:59`). That is the only change an operator can see, and only after a failed `describe`.
```
```text
  - The Console shows that call as a row, since `call` records every command (`frontends/shell/src/skp/client.ts:59`). After a failed `describe`, an operator can see that row, and a retry of the same reopen in this window is no longer refused as `skp.project_open_elsewhere`, since `open_project` runs `release_ended` before it takes the lock. Ordinary use does not reach a failed `describe` (§0.4).
```
Clause check:
- The row is recorded at client.ts:59.
- `release_ended` runs before `try_lock` (mod.rs:780-781). It drops an entry whose handle the catalog no longer holds (:263-265).
- Ordinary use does not reach it, per §0.4.

**D-2 (§0.2, last bullet): the lifetime is understated.** After its session ends, the lock is held until the next reopen or close, not freed when the session ends (mod.rs:23-26).
```text
- So an open whose handle the shell never closes keeps the lock until its session ends or the app exits. In the meantime, a retry of the same reopen is refused as `skp.project_open_elsewhere`.
```
```text
- So an open whose handle the shell never closes keeps the lock until the app exits, or, after its session ends, until this process's next reopen or close runs `release_ended`. Until then, a retry of the same reopen is refused as `skp.project_open_elsewhere`.
```
Clause check: mod.rs:23-26 and :259-266. A retry's own `release_ended` drops an ended entry (:780).

**D-3 (§1, may claim, second bullet): the claim omits the binding's timing and its thread-start failure case.** That case is not ordinary use, so it is named here and does not block.
```text
  - for a reopen, this frees the project's lock through the kernel's existing release (§0.2), which the seam test pins.
```
```text
  - for a reopen, this frees the project's lock through the kernel's existing release (§0.2), which the seam test pins: once the thread the `close_dataset` binding starts has run `release_ended`, or at this process's next reopen or close if that thread does not start (`frontends/shell/src-tauri/src/commands.rs:119-128`).
```
Clause check: commands.rs:119-128 states both cases, and :142-147 does them.

**D-4 (§9, architect bullet 2): "one in-memory command" is looser than the code.** `close_dataset` joins watch threads and drops the dataset (skp.rs:1628-1664).
```text
  - `docs/01` principle 7 (the awaited close is one in-memory command, and the release runs off the caller's thread, `commands.rs:142-147`);
```
```text
  - `docs/01` principle 7 (the awaited close is the existing `close_dataset` command, which every close already sends, and the release runs off the caller's thread, `commands.rs:142-147`);
```

## OPEN-2 to OPEN-6 (whether each recommendation is sound; not ruled)
- **OPEN-2 (include `admitDataset`):** sound. The same leak holds its catalog entry and watch, and the same close frees them.
- **OPEN-3 (await the close):** sound. The order is deterministic, and a retry cannot overtake the close. In `admitDataset` the close falls inside the `describe` watchdog phase, so a close stalled past 5 s would be logged under "describe" (watchdog.ts:46). That is an existing line and an edge case; it does not block.
- **OPEN-4 (close on an untyped failure too):** sound. The same object is rethrown, so the ADR-010 rule 7 handlers still see it. §1 already declines to claim anything when the close cannot reach the kernel.
- **OPEN-5 (the class):** sound, and full. It misses the plainest ground: the 220-line budget is over §21c's 150, so §21c puts it under full gating whatever it touches.
- **OPEN-6 (no log line for the close):** sound. The Console row shows the close (client.ts:59), and a log line would be a new string under P6.

## Records
- Every quoted passage is byte-identical to its source:
  - ADV-2026-11-21-15 :24, both spans;
  - ADV-2026-11-22-11 :17 and :19;
  - ADV-2026-11-16-06 :13 and :25-26;
  - the architect's gate report :123, the reviewer's :190, and merge check PR-341 :24;
  - SKP-V0.md :66 and :1433.
- The reuse-index output is quoted "from the brief", which is untracked. I cannot resolve it, and the form cites it as evidence, not Authority.
- There is no line cite into the ledger, no bare self-line, and no pin read as current: "Every `@ 08783d07…` pin is historical".
- The 13 pinned spans are the lines the form means. I did not recompute their hashes; the reviewer does.
- The line cites in §0.3, §0.4, §3 and §4.4 carry no span hashes. I read every one of them at 44c61323, and each holds there.
- The brief asks for §11. The form has no §11, and the template's sections end at §10.

## Files read (all under C:/dev/wt/read-1122/)
- the brief: `<S>/brief-g-form-gate-1.md`
- governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md
- state/directives/: ADV-2026-11-22-32, ADV-2026-11-21-15, ADV-2026-11-16-06 and ADV-2026-11-22-11 (each whole)
- state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4a-gate-architect.md (:118-127)
- state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4a-gate-reviewer.md (:186-193)
- state/consults/merge-checks/PR-341-51fed8a55340.md
- state/consults/2026-11-22-describe-fails-after-opened-lock-held-lead-data-draft.md (:1-30)
- governance/AUTONOMY.md (§21 to §21d)
- docs/01_Principles.md
- docs/PREREGISTRATION-TEMPLATE.md (§10 and its classes)
- frontends/shell/src/:
  - project/openProject.ts and admission/admitDataset.ts
  - skp/client.ts and console/surfaceRegistry.ts
  - diagnostics/watchdog.ts (and a grep of renderTrace.ts)
  - admission/AdmissionPanel.tsx (:170-280)
  - App.tsx (:1625-1652) and App.layout.test.tsx (:60-104)
  - admission/admitDataset.test.ts and project/openProject.test.ts (:1-120)
  - plus greps for `vi.mock` and `describe:` mocks
- frontends/shell/src-tauri/src/commands.rs (:75-154)
- kernel/:
  - src/project/mod.rs (:1-60, :225-284, :760-889) and src/project/store.rs (a grep of `try_lock`)
  - src/skp.rs (:1355-1440, :1612-1686)
  - tests/project_reopen_skp.rs (whole), with greps of project_save.rs and project_reopen.rs
- protocol/skp/SKP-V0.md (:66, :143-154, :1404, :1433) and protocol/skp/src/v0/error.rs (:1-80)
- KNOWN-LIMITATIONS.md (:540-549)

Model: claude-opus-5-5 (Opus 5.5).
