Read: main at 44c6132360a8ee00823860c07e7bb8f63a7460b5, in the detached read checkout C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's reading of what bounds node (g)'s awaited close, for ADV-2026-11-22-35 item 4, node:describe-fails-after-opened-closes-the-handle@open-3-bound-architect, dispatched at 2026-11-22T19:50:25.897Z; its run: Read 29, Grep 19, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T19:50:31Z to 2026-11-22T19:55:48Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 11708 bytes, sha256 8e6f7d2bc1733393c149c96681ac4e00f73717bc67ec7dced0ded6b405b4be03, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. A drafting consult, not a gate.)

---

Stall in ordinary use: not determined

Read: C:/dev/wt/read-1122 @ 44c6132360a8ee00823860c07e7bb8f63a7460b5
REPORT PATH: state/consults/2026-11-22-describe-fails-after-opened-closes-the-handle-open-3-bound-architect.md

This is a drafting consult for ADV-2026-11-22-35 item 4, not a gate. I found no path where ordinary use meets a stall. Two things are still open, so the answer cannot be "no":
- The awaited close is reached only after `describe` fails. Under the form's §0.4, only (d), a transport failure, might be reached in ordinary use, and the form says it was not read.
- The close has two waits that no code in this repo bounds, and neither has been measured (item 1 below).

The advisor should have this answer before attempt 2 ends.

All cites below are at 44c6132360a8ee00823860c07e7bb8f63a7460b5.

## 1. What bounds the wait

**Nothing times the call out, in the shell or in the host.**
- `call` awaits `invoke` with no time limit (`frontends/shell/src/skp/client.ts:61`).
- The watchdog is an instrument. It only logs (`frontends/shell/src/diagnostics/watchdog.ts:6-12`, `:42-54`; its handler is `frontends/shell/src/main.tsx:19-21`).
- The `close_dataset` binding is a plain (non-`async`) command. It calls `state.close_dataset(request)` directly, with no timeout (`frontends/shell/src-tauri/src/commands.rs:133-142`).
- The binding hands `release_ended`, which can wait on the `Projects` mutex, to a thread of its own and does not wait for it (`:143-147`). The pool-poll `stop` is a dev or measure-build abort and does not block (`:148-151`; `frontends/shell/src-tauri/src/pool_poll.rs:144-153`).
- So when the kernel does not answer, the host waits as long as the kernel's call takes.
- One fact not read in this repo: by Tauri 2's documentation, a command without `async` runs on the main thread. If that holds, a stalled close also holds the host's main thread. Every existing close already goes through this binding (`frontends/shell/src/App.tsx:1647`, not awaited there).

**What the kernel's close waits on** (`kernel/src/skp.rs:1614-1675`):
1. **Five in-process guards, each held only for in-memory work:**
   - the `watches` mutex (`:1628-1632`, `:1668-1672`);
   - the catalog's read guard (`:1634`; `kernel/src/lib.rs:238-240`);
   - the generations mutex (`:1645`, `:767-770`);
   - the tickets mutex (`:1647`, `:367-404`). What it removes is dropped after the mutex is released. Cancelling a redeemed stream sets a flag and interrupts DuckDB (`:348-353`). A dropped `BatchStream` cancels and does not join (`kernel/src/lib.rs:600-605`);
   - the catalog's write guard (`:1651-1661`). It waits for read guards held by `get` and `names` (`kernel/src/lib.rs:238-255`), and by an admission's mint and record insert (`kernel/src/skp.rs:1286-1309`, `:1330-1351`).
2. **The join of the open's watch threads** (`:1633`; `engine/src/watch.rs:486-513`).
   - Each handle's read is cancelled with `CancelIoEx`, and each thread is joined. A thread returns when the operating system completes its cancelled overlapped read (`engine/src/watch.rs:322-331`), or when a sink call already in flight returns (`:332-359`).
   - The sink takes the generations and tickets mutexes and never blocks on its queue (`kernel/src/skp.rs:894-899`, `:914-926`, `:1191-1198`).
   - The completion time belongs to the operating system, and no code here bounds it.
   - There is no join when the open is checks-only (`:1347`). A reopen arms its watch through the same `open_under` (`kernel/src/skp.rs:1108-1111`, `:1203`; `kernel/src/project/mod.rs:826`).
3. **The drop of the removed dataset** (`:1664`, after the write guard is released).
   - If the catalog held the last reference and no lease is in flight, the dataset's idle DuckDB connections close at this point (`engine/src/pool.rs:324`).
   - The code calls that close "in an external section this code does not bound" (`kernel/src/lib.rs:189`, sub-line; ADR-018 §4 class (b)).

**What the user sees while the wait lasts:**
- The panel keeps its in-flight line (`frontends/shell/src/admission/AdmissionPanel.tsx:167-173`, `:238`).
- A new open starts nothing (`:403-408`).
- Cancel does not end the wait. It cancels by the open's key (`:182-185`; `kernel/src/skp.rs:1605-1607`), and that key was removed from the registry when the open returned (`kernel/src/skp.rs:950-955`, `:982-986`; `kernel/src/project/mod.rs:709`).
- So the user is shown "Opening…" with no end, not nothing at all. That is for the advisor to weigh.

No deadlock was found:
- The close holds no guard while it drops the watch or the dataset.
- The sink does not take the catalog's lock while holding generations (`kernel/src/skp.rs:1005-1014`).

## 2. A stall a user can meet in ordinary use

**Not determined.** Two things decide it:
- **The awaited close is reached only on `describeOpened`'s rejection branch.**
  - Under the form's §0.4, (a) to (c) are not reachable from the shell: the kernel's `describe` refuses only at `kernel/src/skp.rs:1362-1366`.
  - (d) is not read.
- **Even when it is reached, the close stalls only in the watch thread's cancelled-read completion or in DuckDB's connection close.** No code here bounds either one, and neither has been measured.

## 3. Words for Amendment 1

None of these is the human's wording. They touch no `KNOWN-LIMITATIONS.md` text and no string the app shows. They state the existing watchdog log lines, they add none. The custodian's script adds the span hashes.

**(a) The bound.**

Placement: after the line
```text
- It awaits `describe(dataset)`. On any rejection it first awaits `closeDataset(dataset)`, drops any rejection of the close, and then rejects with the **same** error it caught.
```
New text:
```text
- **What bounds the awaited close** (read at 44c6132360a8ee00823860c07e7bb8f63a7460b5; every cite in this item is at that commit and historical). Nothing times it out: `call` awaits `invoke` with no time limit (`frontends/shell/src/skp/client.ts:61`), the watchdog only logs (`frontends/shell/src/diagnostics/watchdog.ts:42-54`), and the `close_dataset` binding calls the kernel's close directly, with no timeout, and does not wait for the release it starts (`frontends/shell/src-tauri/src/commands.rs:142-147`). The kernel's close (`kernel/src/skp.rs:1614-1675`) waits on:
  - five in-process guards, each held only for in-memory work: `watches` (`:1628-1632`, `:1668-1672`), the catalog's read guard (`:1634`), generations (`:1645`), tickets (`:1647`), and the catalog's write guard (`:1651-1661`), which waits for the read guards of `get`, `names` (`kernel/src/lib.rs:238-255`) and an admission's mint and insert (`kernel/src/skp.rs:1286-1309`, `:1330-1351`);
  - the join of the open's watch threads (`:1633`; `engine/src/watch.rs:486-513`), which return when the operating system completes each cancelled directory read (`engine/src/watch.rs:322-331`) or a sink call in flight returns; the sink never blocks on its queue (`kernel/src/skp.rs:894-899`). The completion is not bounded by this code;
  - the drop of the removed dataset (`kernel/src/skp.rs:1664`): when the catalog held the last reference and no lease is in flight, its idle DuckDB connections close there (`engine/src/pool.rs:324`), "in an external section this code does not bound" (`kernel/src/lib.rs:189`, sub-line; ADR-018 §4 class (b)).
  So the wait has no bound in this code: in-memory critical sections plus two sections this code does not bound. Neither is measured, and this piece measures nothing (§6). While it lasts the panel keeps its in-flight line (`frontends/shell/src/admission/AdmissionPanel.tsx:167-173`, `:238`), and Cancel does not end it, since the open's key no longer names a call in flight (`kernel/src/skp.rs:950-955`, `:982-986`). The wait is reached only after a failed `describe`, which ordinary use does not reach by §0.4 (a) to (c); §0.4 (d) is not read.
```
Clause check:
- "nothing times it out": client.ts:61; watchdog.ts:42-54 (logs, resets, no reject); commands.rs:142 (direct call) and :143-147 (spawn, not joined).
- "five guards, in-memory": skp.rs lines as cited. Each section between lock and unlock is map work. Removed values are dropped after release (:400-402, :1632-1633, :1662-1664, :1672-1673).
- "watch join": watch.rs:493-505 cancels, then joins. :322-331 is the wait and the disarm return. skp.rs:894-899 is `try_send`.
- "DuckDB close": pool.rs:324; lib.rs:189, quoted inside one line.
- "Cancel does not end it": AdmissionPanel.tsx:182-185 cancels by `cancelKey`. kernel `cancel` goes to `opens.cancel` for a non-stream handle (skp.rs:1605-1607). `OpenGuard` removed the key when the open returned (:982-986, :950-955).
- "reached only after a failed describe": the form's §2.1 and §0.4.

**(b) §1, "May not claim".**

Placement: after the line
```text
  - that a lock is freed when the close itself cannot reach the kernel.
```
New text:
```text
  - that the refusal of `describe` is shown when the close never settles: it is returned only after the close's reply, and nothing times the close out (§2.1, the bound in Amendment 1).
```
Clause check:
- The close is awaited before the rethrow (§2.1 sketch).
- No timeout is set (client.ts:61; commands.rs:142).
- The self-reference is by section and amendment, not by line.

**(c) The watchdog note.**

Placement: after the line
```text
  - the watchdog's `begin`/`end` stay where they are.
```
New text:
```text
  - in `admitDataset` the close falls inside the `describe` watchdog phase, begun before the describe (`frontends/shell/src/admission/admitDataset.ts:60` @ 44c6132360a8ee00823860c07e7bb8f63a7460b5) and ended in the catch (`:67-68`) after `describeOpened` rejects. So a describe and its close open together past five seconds (`WATCHDOG_PHASE_TIMEOUT_MS`, `frontends/shell/src/diagnostics/watchdog.ts:13`) are logged under the `describe` phase, by the existing `watchdog` and `watchdog-stall` lines (`watchdog.ts:46-47`; `frontends/shell/src/main.tsx:19-21`), and again after each further five seconds while the wait lasts (`watchdog.ts:49-51`). `admitProject` begins no watchdog phase (`frontends/shell/src/project/openProject.ts:62-78`), so a reopen's stalled close is logged under none.
```
Clause check:
- `begin("describe")` is at admitDataset.ts:60. `end("describe")` at :62 is skipped on a rejection, and the catch's :68 ends the phase.
- The threshold is :13. The check is :45. The messages are :46-47 and main.tsx:20.
- The clock reset is :51.
- openProject.ts imports no watchdog and has no `begin` (:18-24, :62-78).

## Files read (under C:/dev/wt/read-1122/ unless marked `<S>`)
- `<S>`/brief-g-open3-bound.md
- `<S>`/g-form-gate-1-report.md
- `<S>`/ADV-2026-11-22-35.md
- governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md (whole)
- frontends/shell/src/skp/client.ts (whole)
- frontends/shell/src/diagnostics/watchdog.ts (whole)
- frontends/shell/src/main.tsx (whole)
- frontends/shell/src/admission/admitDataset.ts (whole)
- frontends/shell/src/project/openProject.ts (whole)
- frontends/shell/src/admission/AdmissionPanel.tsx (:160-249, :398-409)
- frontends/shell/src/App.tsx (:1640-1649)
- frontends/shell/src-tauri/src/commands.rs (:1-200)
- frontends/shell/src-tauri/src/pool_poll.rs (grep)
- frontends/shell/src-tauri/Cargo.toml (grep)
- kernel/src/skp.rs (:36-60, :120-136, :195-207, :330-404, :755-838, :880-1089, :1180-1259, :1280-1354, :1355-1414, :1590-1719)
- kernel/src/lib.rs (:120-256, :600-689)
- kernel/src/project/mod.rs (grep)
- engine/src/watch.rs (:180-609)
- engine/src/pool.rs (:286-325 and grep)
- engine/src/lod.rs (:1490-1509)
- docs/adr/ADR-018-what-cancellation-acknowledged-means.md (:70-99)

Model: claude-opus-5-5 (Opus 5.5).
