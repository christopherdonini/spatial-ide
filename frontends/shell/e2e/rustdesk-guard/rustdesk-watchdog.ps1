# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
#
# 24(g) amendment restore tooling -- the WATCHDOG process (restore trigger #1 of 2). Runs as an
# INDEPENDENT, detached process (launched by arm-rustdesk-guard.ps1 via Start-Process, so it
# survives the measurement harness's own death -- the named "survive harness death" case). It does
# NOT itself kill anything; it only ever restores. Loop:
#   - a RELEASE file appearing => the harness finished the happy path and restored RustDesk itself,
#     so the watchdog exits WITHOUT restoring (nothing to do).
#   - the HEARTBEAT going stale (harness stopped touching it => harness died mid-window) => restore.
#   - a MAX-run ceiling => restore and exit (a backstop on the watchdog's own runaway).
# The hard-time-bound scheduled task (arm-rustdesk-guard.ps1) is the SECOND, death-proof trigger
# that covers even this watchdog dying.
param(
  [Parameter(Mandatory = $true)][string]$HeartbeatFile,
  [Parameter(Mandatory = $true)][string]$ReleaseFile,
  [Parameter(Mandatory = $true)][string]$RestoreScript,
  [int]$StaleSeconds = 30,
  [int]$PollSeconds = 5,
  [int]$MaxRunSeconds = 900,
  [string]$LogPath = "$PSScriptRoot\rustdesk-guard.log"
)

function Log($msg) { Add-Content -Path $LogPath -Value "$((Get-Date).ToString('o')) WATCHDOG $msg" }
function Restore($trigger) { & powershell.exe -NonInteractive -ExecutionPolicy Bypass -File $RestoreScript -Trigger $trigger -LogPath $LogPath }

Log "start heartbeat=$HeartbeatFile stale=${StaleSeconds}s poll=${PollSeconds}s maxrun=${MaxRunSeconds}s"
$start = Get-Date
while ($true) {
  Start-Sleep -Seconds $PollSeconds
  if (Test-Path $ReleaseFile) { Log "release seen -> exit, no restore (harness restored on the happy path)"; break }
  $ageSeconds = if (Test-Path $HeartbeatFile) { ((Get-Date) - (Get-Item $HeartbeatFile).LastWriteTime).TotalSeconds } else { [double]::MaxValue }
  if ($ageSeconds -gt $StaleSeconds) { Log "heartbeat stale (${ageSeconds}s > ${StaleSeconds}s) -> restore"; Restore "watchdog-heartbeat-stale"; break }
  if (((Get-Date) - $start).TotalSeconds -gt $MaxRunSeconds) { Log "max-run reached -> restore"; Restore "watchdog-maxrun"; break }
}
Log "exit"
