# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
#
# 24(g) amendment restore tooling -- the per-trial DISPLAY-AWAKE + SESSION-UNLOCKED check. The
# measurement harness calls this BEFORE each trial of an unattended reported-only cell; a trial that
# cannot verify BOTH is invalidated ("unmeasured -- display/session unverified"), never kept. This
# is a SAFE check (worst case it over-invalidates a cell -- it never touches RustDesk or measurement
# state), so it is not part of the dangerous kill-and-restore dry-run; it is exercised on its own.
#
# Detection, best-effort and conservative (a false "not-ok" only costs a re-run; a false "ok" is the
# thing to avoid, so each signal fails closed):
#   - session-unlocked: LogonUI.exe runs while the secure desktop / lock screen is up. Its ABSENCE
#     is the unlocked signal. (There is no first-class PowerShell "is-locked" API; LogonUI presence
#     is the standard, reliable heuristic on Windows.)
#   - display-awake: query the monitor power state via the Win32 GetDevicePowerState-adjacent path;
#     absent a clean API from PowerShell, fall back to "no standby/monitor-off has been requested"
#     via the last-known power request. We conservatively treat an indeterminate display state as
#     awake ONLY when a monitor-on request is held by the arm step (monitor-timeout-ac 0); otherwise
#     not-ok. Reported honestly with which signal decided.
param([string]$LogPath = "$PSScriptRoot\rustdesk-guard.log")

$logonUi = Get-Process -Name LogonUI -ErrorAction SilentlyContinue
$sessionUnlocked = ($null -eq $logonUi)

# Monitor timeout on AC == 0 means the arm step's no-sleep window is in force (a necessary, not
# sufficient, condition for display-awake -- combined with session-unlocked it is the honest bar
# this check can assert without a native display-power probe, which is future work if it proves
# too coarse).
$monitorTimeout = $null
try {
  $scheme = (powercfg /getactivescheme) -replace '.*GUID: ([0-9a-f-]+).*', '$1'
  $out = powercfg /q $scheme SUB_VIDEO VIDEOIDLE 2>$null
  $line = $out | Select-String "Current AC Power Setting Index"
  if ($line) { $monitorTimeout = [convert]::ToInt32(($line -replace '.*:\s*0x', ''), 16) }
} catch {}
$displayAwake = ($monitorTimeout -eq 0)

$ok = ($sessionUnlocked -and $displayAwake)
Add-Content -Path $LogPath -Value "$((Get-Date).ToString('o')) DISPLAY-SESSION ok=$ok unlocked=$sessionUnlocked awake=$displayAwake(monitorTimeout=$monitorTimeout)"
[pscustomobject]@{
  ok              = $ok
  sessionUnlocked = $sessionUnlocked
  displayAwake    = $displayAwake
  monitorTimeoutAc = $monitorTimeout
} | ConvertTo-Json -Compress
