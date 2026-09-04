# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
#
# 24(g) amendment (2026-09-04) restore tooling. THE single restore action, idempotent: ensure the
# RustDesk *service* is Running (the service is what accepts incoming remote connections; the tray
# exe is secondary). Called by every restore trigger -- the happy-path disarm, the watchdog, and
# the hard-time-bound scheduled task -- so all three converge on one proven code path. Safe to call
# when RustDesk is already up (no-op beyond a log line). Never throws away remote access; it only
# ever RE-ESTABLISHES it. See README.md in this directory for the full protocol.
param(
  [string]$Trigger = "manual",
  [string]$LogPath = "$PSScriptRoot\rustdesk-guard.log"
)

$ts = (Get-Date).ToString("o")
try {
  $svc = Get-Service -Name RustDesk -ErrorAction Stop
  if ($svc.Status -ne 'Running') {
    Start-Service -Name RustDesk -ErrorAction Stop
  }
  $svc.Refresh()
  $svc = Get-Service -Name RustDesk
  # Secondary: relaunch the tray/UI exe if absent. The service already accepts connections without
  # it, so a failure here is logged but never fatal to the restore.
  if (-not (Get-Process -Name rustdesk -ErrorAction SilentlyContinue)) {
    $exe = "C:\Program Files\RustDesk\rustdesk.exe"
    if (Test-Path $exe) { Start-Process -FilePath $exe -ErrorAction SilentlyContinue }
  }
  Add-Content -Path $LogPath -Value "$ts RESTORE trigger=$Trigger service=$($svc.Status)"
  if ($svc.Status -ne 'Running') { throw "RustDesk service is $($svc.Status) after restore attempt" }
  exit 0
} catch {
  Add-Content -Path $LogPath -Value "$ts RESTORE trigger=$Trigger ERROR $($_.Exception.Message)"
  exit 1
}
