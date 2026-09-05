# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
#
# 24(g) amendment restore tooling -- ARM the restore net. MUST be called (and its two triggers
# confirmed armed) BEFORE RustDesk is ever stopped. Arms both independent restore triggers plus the
# display-awake window, and prints a JSON summary the caller parses to confirm arming succeeded.
#
#   Trigger #1 (fast, harness-death-aware): a detached watchdog process (rustdesk-watchdog.ps1),
#     independent of the harness, restores when the heartbeat goes stale.
#   Trigger #2 (death-proof backstop): a Scheduled Task running as SYSTEM at a hard wall-clock time
#     (now + HardBoundMinutes) that unconditionally runs the restore -- survives the watchdog dying,
#     the harness dying, the console closing.
#
# The heartbeat contract: the measurement harness must touch $HeartbeatFile at least every
# StaleSeconds while it holds RustDesk down, and on the happy path create $ReleaseFile + restore
# itself + call disarm-rustdesk-guard.ps1. This script does NOT stop RustDesk -- the caller does,
# only after this returns armed=true.
param(
  [int]$HardBoundMinutes = 5,
  [int]$StaleSeconds = 30,
  [int]$PollSeconds = 5,
  [int]$WatchdogMaxRunSeconds = 900,
  [string]$TaskName = "RustDeskRestoreBackstop",
  [string]$StateDir = "$env:TEMP\rustdesk-guard"
)

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$restoreScript = Join-Path $here "restore-rustdesk.ps1"
$watchdogScript = Join-Path $here "rustdesk-watchdog.ps1"
$logPath = Join-Path $here "rustdesk-guard.log"

New-Item -ItemType Directory -Force -Path $StateDir | Out-Null
$heartbeat = Join-Path $StateDir "heartbeat"
$release = Join-Path $StateDir "release"
Remove-Item $release -ErrorAction SilentlyContinue
Set-Content -Path $heartbeat -Value (Get-Date).ToString("o")   # fresh at arm time

# --- Trigger #2 first: the death-proof scheduled task. Armed BEFORE the watchdog and before any
# kill, so the backstop exists even if the watchdog launch below fails. ---
$fireAt = (Get-Date).AddMinutes($HardBoundMinutes)
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NonInteractive -ExecutionPolicy Bypass -File `"$restoreScript`" -Trigger scheduled-backstop -LogPath `"$logPath`""
$trigger = New-ScheduledTaskTrigger -Once -At $fireAt
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Force | Out-Null
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
$taskArmed = ($null -ne $task)

# --- Trigger #1: the detached watchdog process. Start-Process => independent of this shell/harness. ---
$wd = Start-Process -FilePath "powershell.exe" `
  -ArgumentList @("-NonInteractive", "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", "`"$watchdogScript`"",
    "-HeartbeatFile", "`"$heartbeat`"", "-ReleaseFile", "`"$release`"", "-RestoreScript", "`"$restoreScript`"",
    "-StaleSeconds", $StaleSeconds, "-PollSeconds", $PollSeconds, "-MaxRunSeconds", $WatchdogMaxRunSeconds, "-LogPath", "`"$logPath`"") `
  -PassThru
Start-Sleep -Milliseconds 500
$watchdogArmed = ($null -ne $wd) -and (-not $wd.HasExited)

# --- The display-awake window: no monitor sleep / no standby while we hold RustDesk down. Restored
# by disarm-rustdesk-guard.ps1. (Session-lock is verified per-trial by check-display-session.ps1.) ---
try { powercfg /change monitor-timeout-ac 0 2>$null; powercfg /change standby-timeout-ac 0 2>$null } catch {}

Add-Content -Path $logPath -Value "$((Get-Date).ToString('o')) ARM task=$taskArmed(fireAt=$($fireAt.ToString('o'))) watchdog=$watchdogArmed(pid=$($wd.Id)) heartbeat=$heartbeat"

[pscustomobject]@{
  armed          = ($taskArmed -and $watchdogArmed)
  taskArmed      = $taskArmed
  taskName       = $TaskName
  taskFireAt     = $fireAt.ToString("o")
  watchdogArmed  = $watchdogArmed
  watchdogPid    = $wd.Id
  heartbeatFile  = $heartbeat
  releaseFile    = $release
  restoreScript  = $restoreScript
} | ConvertTo-Json -Compress
