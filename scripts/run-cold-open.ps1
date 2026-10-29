# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

<#
.SYNOPSIS
  Run the next cold-open boot. Figures out which one that is by itself.

.DESCRIPTION
  The cold-open phase of the 5 GB scale pass needs three full Restarts, and after each one the
  measurement must be the FIRST thing that touches the fixture. This wrapper exists so none of that
  has to be remembered: run it, and it works out which boot is next, runs it, and tells you what to
  do afterwards.

  It also handles the case the underlying protocol makes awkward on purpose. kernel/scripts/
  cold-open.ps1 refuses to overwrite a boot's artifact, because each boot records once. So when a
  boot's sample is discarded -- "cold" was falsified because the file was already cached -- this
  wrapper moves that artifact aside as a recorded, discarded attempt and re-runs the same boot
  number, rather than letting you either overwrite it or silently skip ahead.

  Nothing here changes the protocol. It picks the boot number and prints what to do next.

.EXAMPLE
  # After every Restart, before opening anything else:
  powershell -NoProfile -ExecutionPolicy Bypass -File run-cold-open.ps1
#>

[CmdletBinding()]
param(
    # Force a specific boot number instead of letting the wrapper decide.
    [ValidateRange(1, 3)][int]$Boot = 0,
    # Show what would run, and the current state, without running anything.
    [switch]$Status
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$outDir   = 'target\slice-evidence\scale-pass\cold-open'
$fixture  = 'target\slice-evidence\scale-pass\parcels-5gb.parquet'
$timeOpen = 'target\release\examples\time-open.exe'
$inner    = 'kernel\scripts\cold-open.ps1'
$total    = 3

function Say([string]$m, [string]$c = 'Gray') { Write-Host $m -ForegroundColor $c }

Say ""
Say "=== 5 GB scale pass -- cold-open phase ===" Cyan
Say ""

# ---- What is already recorded -------------------------------------------------------------------
$done = @()
$needsRepeat = 0
for ($i = 1; $i -le $total; $i++) {
    $a = Join-Path $outDir "boot-$i.json"
    if (-not (Test-Path $a)) { continue }
    $r = Get-Content $a -Raw | ConvertFrom-Json
    if ($r.cold_established) {
        $done += $i
        Say ("  boot {0}: recorded  cold {1:N0} ms, warm min {2:N0} ms, {3:N1}x, {4:N1} MB off disk" -f `
             $i, $r.cold_open_ms, $r.warm_min_ms, $r.cold_over_warm, $r.cold_disk_read_mb) Green
    } else {
        Say ("  boot {0}: DISCARDED -- only {1:N1} MB came off the disk, so the file was already cached" -f `
             $i, $r.cold_disk_read_mb) Yellow
        if ($needsRepeat -eq 0) { $needsRepeat = $i }
    }
}
if ($done.Count -eq 0 -and $needsRepeat -eq 0) { Say "  nothing recorded yet" }
Say ""

# ---- Which boot is next -------------------------------------------------------------------------
if ($Boot -ne 0) {
    $next = $Boot
} elseif ($needsRepeat -ne 0) {
    $next = $needsRepeat
} else {
    $next = 1
    while ($next -le $total -and (Test-Path (Join-Path $outDir "boot-$next.json"))) { $next++ }
}

# ---- All three in: report the verdict and stop --------------------------------------------------
if ($next -gt $total) {
    Say "All three boots are recorded." Green
    Say ""
    $samples = 1..$total | ForEach-Object {
        (Get-Content (Join-Path $outDir "boot-$_.json") -Raw | ConvertFrom-Json).cold_open_ms
    }
    # The verdict rule was declared before measuring: the MAXIMUM of the three, never a mean, and
    # never pooled -- three reboots are three sessions, and this repository does not compare across
    # them. See SCALE-PASS-PREREGISTRATION.md section 4c.
    $worst = ($samples | Measure-Object -Maximum).Maximum
    $budget = 5000
    Say ("  samples (ms): {0}" -f (($samples | ForEach-Object { '{0:N0}' -f $_ }) -join ', '))
    Say ("  verdict is taken on the MAXIMUM, as pre-registered: {0:N0} ms against a {1:N0} ms budget" -f $worst, $budget)
    if ($worst -lt $budget) {
        Say "  -> docs/08 cold-open budget MET" Green
    } else {
        Say "  -> docs/08 cold-open budget MISSED. That is a result, not a failure -- it gets written up." Yellow
    }
    Say ""
    Say "Nothing further for you to do. Tell Claude the boots are done." Cyan
    Say ""
    exit 0
}

Say ("Next: boot {0} of {1}." -f $next, $total) Cyan

# ---- Preconditions, checked here so a refusal costs no restart ------------------------------------
$problems = @()
if (-not (Test-Path $fixture))  { $problems += "the 5 GB fixture is missing at $fixture" }
if (-not (Test-Path $timeOpen)) { $problems += "the timing instrument is missing at $timeOpen (the tree is frozen; it is not built here)" }
if (-not (Test-Path $inner))    { $problems += "the protocol script is missing at $inner" }

$uptime = ((Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime).TotalMinutes
if ($uptime -gt 20) {
    $problems += ("uptime is {0:N0} minutes. The protocol needs under 20 -- this machine has not just been restarted, so the fixture may still be cached." -f $uptime)
}

if ($Status) {
    Say ""
    Say ("  uptime: {0:N1} min" -f $uptime)
    if ($problems) { $problems | ForEach-Object { Say "  blocked: $_" Yellow } } else { Say "  ready to run" Green }
    Say ""
    exit 0
}

if ($problems) {
    Say ""
    foreach ($p in $problems) { Say "  BLOCKED: $p" Red }
    Say ""
    if ($uptime -gt 20) {
        Say "  What to do: Restart (Start > Power > RESTART, not Shut down), log in, and run this" Cyan
        Say "  script again straight away without opening anything else." Cyan
    }
    Say ""
    exit 1
}

# ---- A discarded boot is moved aside, not overwritten ---------------------------------------------
$artifact = Join-Path $outDir "boot-$next.json"
if (Test-Path $artifact) {
    $n = 1
    while (Test-Path (Join-Path $outDir "boot-$next-discarded-$n.json")) { $n++ }
    foreach ($suffix in @('', '-cold', '-warm')) {
        $src = Join-Path $outDir "boot-$next$suffix.json"
        if (Test-Path $src) { Move-Item $src (Join-Path $outDir "boot-$next-discarded-$n$suffix.json") }
    }
    Say ("  (the earlier boot-{0} attempt is kept as boot-{0}-discarded-{1}.json -- a discarded attempt is recorded, not deleted)" -f $next, $n) Yellow
}

Say ""
Say "  Running the protocol. About 6-8 minutes: 120 s settle, 30 s quiet gate, one cold open," Gray
Say "  then five warm opens as this boot's own control. Please leave the machine alone." Gray
Say ""

& powershell -NoProfile -ExecutionPolicy Bypass -File $inner -Boot $next
$code = $LASTEXITCODE

Say ""
if ($code -ne 0) {
    Say "That boot did not produce a number. The reason is printed above." Yellow
    Say ""
    Say "  A refusal here is the protocol working, not a fault. The usual ones:" Gray
    Say "    - not quiet yet     -> wait two minutes and run this script again (no restart needed)" Gray
    Say "    - uptime over 20 min-> Restart and run it again immediately" Gray
    Say ""
    exit $code
}

$r = Get-Content $artifact -Raw | ConvertFrom-Json
if (-not $r.cold_established) {
    Say "That sample was DISCARDED: the file was already cached, so it was not a cold open." Yellow
    Say "  Restart and run this script again -- it will repeat boot $next." Cyan
    Say ""
    exit 1
}

Say ("Boot {0} recorded: cold {1:N0} ms, warm min {2:N0} ms, {3:N1}x, {4:N1} MB off the disk." -f `
     $next, $r.cold_open_ms, $r.warm_min_ms, $r.cold_over_warm, $r.cold_disk_read_mb) Green
Say ""
if ($next -lt $total) {
    Say ("Next: Restart (RESTART, not Shut down), log in, and run this script again for boot {0}." -f ($next + 1)) Cyan
} else {
    Say "That was the last boot. Run this script once more to see the verdict, then tell Claude." Cyan
}
Say ""
