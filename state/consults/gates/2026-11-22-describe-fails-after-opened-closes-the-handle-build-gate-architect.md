Reviewed: PR 360, the branch cut/describe-failed-close at 8d1f2f4ee6cef58ef5975ebfc6c2d8790d2fbcfb, in C:/dev/wt/gclose, with the records in the detached read worktree C:/dev/wt/read-1122 at be11bd986dbcd8301f46fb124e0b512f45c4b8ec (the custodian's filing note, 2026-11-22: the architect's build gate, node:describe-fails-after-opened-closes-the-handle@build-gate-architect-1, its first attempt after the build, attempts 1 and 2 having been the form gates; dispatched at 2026-11-22T22:29:44.341Z; its run: Read 51, Glob 3, Grep 10, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T22:29:48Z to 2026-11-22T22:36:50Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 10518 bytes, sha256 349ec4ab83c22319836a9ec0f3f3dc8f02f422ac5ae4d053cb3b8656953601cb, byte for byte, nothing masked, with one final newline added. FAIL on words only: C-1 (Correctness, C2's subject claims a limit) and E-1 (Evidence, C1's subject claims reds the logs contradict); the code, the tests and the doc comments at the head hold. The two subjects cannot be reworded without a force-push: the gate's words stand in the PR body under governance/AUTONOMY.md section 31 item d, and the closing amendment names C1 and C2 by id as superseded. D-1, KM1's log, is for the closing amendment. It discloses one Grep that returned two lines of the reviewer's report, which it says it did not read.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/gclose @ 8d1f2f4ee6cef58ef5975ebfc6c2d8790d2fbcfb
REPORT PATH: state/consults/gates/2026-11-22-describe-fails-after-opened-closes-the-handle-build-gate-architect.md

Branch `cut/describe-failed-close` @ 8d1f2f4ee6cef58ef5975ebfc6c2d8790d2fbcfb, base B 939bb764. I used only Read, Grep and Glob, and ran nothing. Form cites are to the form in C:/dev/wt/read-1122 at be11bd98. Code cites are at the head.

**The code and the tests are sound.** The FAIL rests only on the words of two branch commit subjects (C-1, E-1). Both are words only, and neither is the human's wording. By `governance/AUTONOMY.md` §31, the worker applies the words below with no re-gate, and the PR body lists them. A pushed commit cannot be reworded without a force-push, which is a red line. So the words go into the PR body and any squash message, and the closing amendment names C1 and C2 by id as superseded.

Disclosure: one Grep over `<S>/g-*` returned two lines of `<S>/g-rev-gate-1-report.md`, the reviewer's report. I did not read that report, and nothing below rests on it.

## Correctness

**C-1. C2's subject claims a limit the code does not give.** The subject is `fix: shell: a describe that fails after the handle is returned closes it, waiting at most 2000 ms` (`<S>/g-msg-c2.txt`).
- The wait ends on a 2000 ms timer (admitDataset.ts:98-103).
- A timer runs at its delay or later. ADV-2026-11-22-39 item 2 rules "no later than" a guarantee the code cannot give, and Amendment 1's §1 "may not claim" lists the exact bound.
- This is a claim of a limit, so it is never Documentation-only.

```text
fix: shell: a describe that fails after the handle is returned closes it, waiting at most 2000 ms
```
```text
fix: shell: a describe that fails after the handle is returned sends close_dataset for it, and the failure goes on when the close settles or once DESCRIBE_FAILED_CLOSE_WAIT_MS (2000 ms) has passed, whichever is first
```
Clause check:
- "sends close_dataset for it": admitDataset.ts:97, client.ts:136-138.
- "goes on when the close settles or once … has passed, whichever is first": admitDataset.ts:97-104. `closed` maps both outcomes to undefined, `deadline` only resolves, and `throw e` follows the race.
- "(2000 ms)": admitDataset.ts:85.

## Evidence

**E-1. C1's subject claims a red that the logs contradict, and makes a red claim for K1, which §8 item 7 forbids.** The subject is `test: shell: a describe that fails after the handle is returned leaves it open, red at the base (S1 to S6, A1, A2, K1)` (`<S>/g-msg-c1.txt`). The logs show S4 green at C1 (`<S>/g-c1-red.txt`) and K1 green at C1 (`<S>/g-c1-k1.txt`). The code's evidence itself is closed, so only the words need fixing.

```text
test: shell: a describe that fails after the handle is returned leaves it open, red at the base (S1 to S6, A1, A2, K1)
```
```text
test: shell: a describe that fails after the handle is returned leaves it open: S1 to S3, S5, S6, A1 and A2 red at the base; S4 and K1 green, K1 the kernel's seam pin
```
Clause check:
- The seven reds are in `<S>/g-c1-red.txt`: `7 failed | 10 passed`, with S4 marked ✓.
- K1 is `... ok` in `<S>/g-c1-k1.txt`.
- "seam pin" is §4.3, and it matches K1's own doc at project_reopen_skp.rs:671-677.

## Documentation (must be fixed before the merge)

**D-1. KM1's log carries neither its commit nor the applied change.**
- `<S>/g-mut-KM1.txt` begins at `Compiling`. The shell logs record HEAD and `git diff` (`<S>/g-run-mut.sh:9-10`); this one does not.
- §4.4 asks for each failure to be recorded "by name with the commit".
- The panic at project_reopen_skp.rs:705:5 shows one line removed above the step-6 `assert!` (head :706). Both step-5 lines would give that line and the same message, so the log does not show that the close was removed and not the release.
- The fix: the closing amendment cites a KM1 run that records HEAD and the diff. An outcome that differs is class 2.

## Checks (§9 as amended)

**1. The diff, §2, §7 and §8.**
- §2.1 is built as amended (admitDataset.ts:85, :93-106):
  - the constant, at one site;
  - the close is sent first, then the race, then `clearTimeout`, then `throw e`;
  - the reply and any rejection are dropped by `.then(() => {}, () => {})`;
  - no string, log line or retry;
  - two product callers: admitDataset.ts:63 and openProject.ts:74.
- §7: the diff has exactly the five files.
  - The line count is 247 by `<S>/g-c4-numstat.txt` (34+0, 34+3, 112+2, 9+5, 44+4). I counted the same from the diff.
  - That is within Amendment 1's class-9 ceiling of 270, which came before any code (the form is at the base). The 220 line is unedited, so there is no class 8 overrun.
- §8, item by item:
  1. No change under protocol/, engine/ or kernel/src/.
  2. No new string or log line.
  3. The describe's error is not replaced: `throw e`, and M2 shows the handler is needed.
  4. A close happens only in `describeOpened`'s catch, which is reached only after a handle is returned (admitDataset.ts:59-63; openProject.ts:70-74).
  5. No manifest, lockfile or workflow edit.
  6. No sleep or skip; the fake clock is allowed by §2.4 as amended.
  7. Fails at C1's subject (E-1). The code's K1 doc says it is not a red/green test.
  8. No file outside §7.
  9. The PR is a draft.

**2. The seam rule (§0.3), checked against each actual interface.**
- client.ts:50-72, :97-99 and :136-138 hold. `call` is async, so `closeDataset` cannot throw synchronously.
- skp.rs:1361-1366 holds: the only refusals are `check_version` and `unknown_dataset`. Its `unreachable!` is at :1412. commands.rs:83-88 holds: `describe` is synchronous.
- error.rs:64-72 holds. The test envelopes copy its message byte for byte (openProject.test.ts:177; admitDataset.test.ts:26).
- A1 and A2 mock at `invoke`, and check the real `{ request: { skp, dataset } }` shape the binding takes (commands.rs:138).
- **K1 is built from the real shape:**
  - `rig.reopen` goes through `Projects::open_project_command`, the binding's call (commands.rs:214);
  - `SkpHost::describe` with `DescribeRequest`;
  - `host.close_dataset`, then `projects.release_ended()`, in the binding's order (commands.rs:142-144);
  - `ProjectLock::try_lock(&rig.machine, …)`, as W-5 does (:521), and `LockRefused::Held` (store.rs:263-265).

**3. docs/01 principle 7.** Held.
- The shell's wait is an await, ended by the bound.
- The close is the existing `close_dataset` command.
- `release_ended` runs on a thread of its own (commands.rs:144).
- The binding's main-thread fact is pre-existing and queued after the tag (ADV-2026-11-22-38 item 6).

**4. The mutations.** By reading, each named set is the one to expect.
- Seven are shown by name, at C2 b3dbbdff, with their diffs:
  - M1 kills S1, S2, S3, S5, S6, A1 and A2;
  - M2 kills S3;
  - M3 kills S4;
  - M4 kills S2 and A2, at `Object.is`;
  - M5 kills S5 at "settled once the bound has passed";
  - M6 kills S5 at "not settled before the bound";
  - M7 kills S6 at its timer count.
- KM1 is shown by its message only (D-1).
- M2, M3 and M5 to M7 ran openProject.test.ts alone. By reading, no admitDataset test would die under them: the A-tests' closes resolve, and the success tests check calls 1 and 2. So "alone" holds, though not by a run.

**5. The C1 reds.** Each fails for its stated reason (`<S>/g-c1-red.txt`):
- S1 and S2 at the closes (`[]`);
- S3 at the close count;
- S5 and S6 with "describeOpened is not a function";
- A1 and A2 with two SKP calls.

S4 and K1 are green. The tests are unchanged after C1: C2 to C4 touch only the two product files (`<S>/g-c2-diffstat.txt`, `<S>/g-c3-diff.txt`, `<S>/g-c4-diff.txt`), and the failure lines match the head.

**6. The doc clauses, at the head.** All are true, and C4's four comments hold.
- admitDataset.ts:46-48 and openProject.ts:10-12 match :97-104. They use "once … has passed, whichever is first", with no "at most" and no "no later than".
- openProject.ts:61-63: "frees the project's lock once the kernel has closed it and its release has run" is conditioned, so it claims nothing at the bound or when the close is unreached (§1 "may not claim"). It matches mod.rs:263-265.
- The constant's doc (admitDataset.ts:79-84): the late timer is marked as taken from documentation; the 5_000 ms matches watchdog.ts:13; "the close alone … unless that timer runs late" holds, since the phase is ended in the catch (:68-70).
- `describeOpened`'s doc (:87-92) matches :94-105.
- K1's doc matches skp.rs:1361-1366.
- KNOWN-LIMITATIONS item 72 (:545-546) stays true.

**7. The caller rule.**
- `describeOpened` has two product callers.
- `DESCRIBE_FAILED_CLOSE_WAIT_MS` is read by product code (admitDataset.ts:100). Its export is read only by S5, as Amendment 1's sketch and §7 declare. It is a constant and does nothing. Not a finding.

**8. Records in the new comments.**
- No passage in quotation marks.
- No line cite into the ledger, and no line cite at all.
- K1's doc cites the form by path and §4.3, and the form is on main.

Files read:
- C:/dev/wt/read-1122/:
  - governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md (whole)
  - state/directives/: ADV-2026-11-22-32, -35, -38 and -39 (whole)
  - state/consults/gates/: 2026-11-22-describe-fails-after-opened-closes-the-handle-form-gate-architect.md and …-attempt-2.md
- `<S>/`:
  - g-diff-8d1f2f4e.txt
  - g-build-report.md, g-build-report-2.md and g-c4-report.md
  - g-c1-red.txt and g-c1-k1.txt
  - g-c2-green.txt and g-c2-diffstat.txt
  - g-mut-M1 to M7 and g-mut-KM1 (.txt), g-status-KM1.txt and g-run-mut.sh
  - g-c3-diff.txt, g-c4-diff.txt, g-c4-numstat.txt and g-c4-vitest.txt
  - g-commit-c1.txt and g-msg-c1 to g-msg-c4 (.txt)
- C:/dev/wt/gclose/:
  - frontends/shell/src/admission/admitDataset.ts (whole) and admitDataset.test.ts (:1-174)
  - frontends/shell/src/project/openProject.ts (:1-90) and openProject.test.ts (:1-70)
  - frontends/shell/src/skp/client.ts (:40-149)
  - frontends/shell/src/diagnostics/watchdog.ts (whole) and a grep of diagnostics/log.ts
  - frontends/shell/src/admission/AdmissionPanel.tsx (:205-254)
  - frontends/shell/src-tauri/src/commands.rs (:75-164, plus a grep)
  - kernel/src/skp.rs (:1355-1426, :1610-1676)
  - kernel/src/project/mod.rs (:255-268)
  - kernel/src/project/store.rs (:225-268)
  - kernel/tests/project_reopen_skp.rs (:30-189, plus greps)
  - protocol/skp/src/v0/error.rs (:60-72)
  - KNOWN-LIMITATIONS.md (:545-547)
  - docs/01_Principles.md (a grep)

Model: claude-opus-5-5 (Opus 5.5).
