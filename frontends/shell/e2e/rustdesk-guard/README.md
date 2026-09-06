# RustDesk restore guard — the 24(g) unattended-measurement protocol

Tooling for the **2026-09-04 amendment to decision 24(g)** (DECISIONS-PENDING): a **reported-only
measured cell** may run unattended with RustDesk stopped, provided RustDesk is restored no matter
what happens. **Scored cells and felt verdicts remain human-present** — this tooling is not for
them.

RustDesk is the machine's remote-access lifeline. Stopping it while unattended means, if restore
fails, the operator is locked out with no way to intervene. Everything here exists to make that
restore unconditional and **proven before any measurement trusts it**.

## The three restore triggers (all armed BEFORE the kill)

1. **Happy-path disarm** (`disarm-rustdesk-guard.ps1`) — the harness calls this when the window
   finishes normally: it restores RustDesk, releases the watchdog, unregisters the backstop.
2. **Watchdog** (`rustdesk-watchdog.ps1`) — a detached process, independent of the harness, that
   restores fast when the harness stops touching the heartbeat file (i.e. the harness died
   mid-window). Survives harness death (launched via `Start-Process`, not as a child job).
3. **Hard-time-bound scheduled task** — a Windows Scheduled Task running as **SYSTEM** at a fixed
   wall-clock time (`now + HardBoundMinutes`), registered by `arm-rustdesk-guard.ps1`. The
   death-proof backstop: it fires and restores even if the watchdog dies, the harness dies, and the
   console closes. Idempotent restore, so a late fire on an already-running service is harmless.

Restore is one proven code path (`restore-rustdesk.ps1`): ensure the RustDesk **service** is
Running (the service accepts incoming connections; the tray exe is relaunched as a secondary). It
NEVER stops anything — it only ever re-establishes access.

## The heartbeat contract (harness integration)

While an unattended cell holds RustDesk down, the harness must:
- **Arm first, verify armed, only then stop RustDesk.** `arm-rustdesk-guard.ps1` prints
  `{"armed":true,...}` with the watchdog pid and task name; the caller must confirm both triggers
  are live (task `State: Ready`, watchdog pid alive) before the kill.
- **Touch the heartbeat file** (`%TEMP%\rustdesk-guard\heartbeat`, `LastWriteTime`) at least every
  `StaleSeconds` throughout. Stop touching it ⇒ the watchdog treats the harness as dead and
  restores.
- **Before each trial**, run `check-display-session.ps1` and **invalidate the cell**
  (`unmeasured — display/session unverified`) unless it reports `ok:true` (session unlocked AND
  display awake).
- **On normal completion**, call `disarm-rustdesk-guard.ps1` (restores, releases, unregisters).
- Record the attest string **`unattended, RustDesk stopped and verified absent, display-awake
  verified`** on the cell — never on a scored cell or a felt verdict.

## Dry-run — PASSED 2026-09-04 (mandatory precondition, no measurement)

Per the amendment, the kill-and-restore cycle was dry-run once with no measurement before any real
cell. All three triggers proven (see `rustdesk-guard.log`, runtime-only, gitignored):
- **Backstop fires (SYSTEM):** the scheduled task, fired on-demand, ran the restore in SYSTEM
  context, `LastTaskResult 0`, logged `RESTORE trigger=scheduled-backstop-TEST service=Running` —
  proven BEFORE any kill, so the worst-case downtime was bounded to the hard time bound.
- **Happy path:** armed → killed (service `Stopped`, verified absent) → disarm restored →
  `Running`; backstop unregistered, watchdog released.
- **Simulated harness hang:** armed → killed → heartbeat abandoned (no disarm) → the **watchdog**
  restored unaided in ~28s (`heartbeat stale 32.4s > 30s -> restore`, `service=Running`, clean
  exit) with zero manual intervention.

## Side effects / notes

- `arm` disables monitor sleep and standby on AC (`powercfg monitor-timeout-ac 0`,
  `standby-timeout-ac 0`) for the window; `disarm` restores them (defaults 10 / 30 min,
  configurable). If the harness dies before disarm, restore them manually. On this machine
  monitor-timeout-ac was already 0 before arming.
- Windows-only, this reference machine only, admin required (service control + SYSTEM task
  registration). `check-display-session.ps1` uses LogonUI presence for session-lock (the standard
  Windows heuristic; no first-class PowerShell API) and monitor-timeout-0 for display-awake — both
  fail closed; a native display-power probe is future work if the coarse check over-invalidates.
