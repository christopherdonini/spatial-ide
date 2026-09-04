# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
#
# 24(g) amendment restore tooling -- HAPPY-PATH disarm. Called by the measurement harness when the
# window finishes normally: it (1) restores RustDesk itself (the happy-path restore), (2) signals
# the watchdog to exit without acting (creates the release file), (3) unregisters the hard-bound
# scheduled task so it does not fire late, (4) restores the monitor/standby timeouts. Idempotent and
# safe to call more than once. If the harness DIES before reaching this, the two armed triggers
# restore RustDesk on their own -- that is the whole point of the net.
param(
  [string]$TaskName = "RustDeskRestoreBackstop",
  [string]$StateDir = "$env:TEMP\rustdesk-guard",
  [int]$MonitorTimeoutAc = 10,
  [int]$StandbyTimeoutAc = 30
)

$here = $PSScriptRoot
$restoreScript = Join-Path $here "restore-rustdesk.ps1"
$logPath = Join-Path $here "rustdesk-guard.log"
$release = Join-Path $StateDir "release"

# 1) Happy-path restore FIRST -- RustDesk is up before we tear down the net.
& powershell.exe -NonInteractive -ExecutionPolicy Bypass -File $restoreScript -Trigger "disarm-happy-path" -LogPath $logPath | Out-Null

# 2) Release the watchdog (it sees this and exits without restoring, since #1 already did).
New-Item -ItemType File -Force -Path $release | Out-Null

# 3) Unregister the death-proof scheduled task (restore is idempotent, so a late fire would be
#    harmless, but a clean teardown leaves no stray SYSTEM task behind).
try { Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction Stop } catch {}

# 4) Restore ordinary monitor/standby behaviour.
try { powercfg /change monitor-timeout-ac $MonitorTimeoutAc 2>$null; powercfg /change standby-timeout-ac $StandbyTimeoutAc 2>$null } catch {}

Add-Content -Path $logPath -Value "$((Get-Date).ToString('o')) DISARM done (restored, released watchdog, unregistered $TaskName)"
$svc = Get-Service -Name RustDesk -ErrorAction SilentlyContinue
[pscustomobject]@{ disarmed = $true; rustdeskService = "$($svc.Status)" } | ConvertTo-Json -Compress
