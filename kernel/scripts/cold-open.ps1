# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

<#
.SYNOPSIS
  The cold-open phase of the 5 GB scale pass. Run ONCE, FIRST, after each of three Restarts.

.DESCRIPTION
  `docs/08`: "Cold open of a 5 GB GeoParquet < 5 s". Every other row in this pass is unattended;
  this one needs an operator, because the only reliable way to evict a 5 GB file from the Windows
  file cache is to reboot.

  Everything here is pre-registered in kernel/SCALE-PASS-PREREGISTRATION.md section 4. This script
  implements that protocol and refuses to produce a number when any of its conditions is unmet --
  "unmeasurable, with reason" is a legitimate verdict and a warm number labelled cold is not.

  ## THREE REBOOTS ARE THREE SESSIONS

  This repository forbids between-session comparison. So the three cold samples are NEVER pooled:
  each is reported individually, and each is compared against a warm control taken IN THE SAME BOOT
  -- the only within-session comparison available. The verdict against the 5 s budget is taken on the
  MAXIMUM of the three, declared before measuring.

  ## USE "RESTART", NOT "SHUT DOWN"

  A Windows 10 "Shut down" is a hybrid hibernation (Fast Startup) that restores the kernel session
  and can leave cache warm. Only "Restart" performs a full boot. This script records
  HiberbootEnabled and refuses if uptime exceeds 20 minutes.

.EXAMPLE
  # After each Restart, before opening anything else:
  powershell -NoProfile -ExecutionPolicy Bypass -File kernel\scripts\cold-open.ps1 -Boot 1
#>

[CmdletBinding()]
param(
    # Which of the three boots this is. Each writes its own artifact; nothing is appended or pooled.
    [Parameter(Mandatory = $true)][ValidateRange(1, 3)][int]$Boot,

    [string]$Fixture = "target\slice-evidence\scale-pass\parcels-5gb.parquet",
    [string]$TimeOpen = "target\release\examples\time-open.exe",
    [string]$OutDir = "target\slice-evidence\scale-pass\cold-open",

    # Declared in the preregistration; exposed so a dry run can be quick, never so a real run can be
    # made lenient. A run with non-default values records them and is marked `protocol_modified`.
    [int]$SettleSeconds = 120,
    [int]$SampleSeconds = 30,
    [int]$MaxUptimeMinutes = 20,
    [double]$MaxCpuMeanPct = 5.0,
    [double]$MaxCpuMaxPct = 25.0,
    [int]$MaxSettleDiskMB = 50,
    [int]$MinFreeGiB = 20,
    [int]$WarmRepeats = 5
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repo

function Fail([string]$why) {
    Write-Host ""
    Write-Host "REFUSED: $why" -ForegroundColor Red
    Write-Host "No number is produced. This is 'unmeasurable, with reason' -- not a failure to work around." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$artifact = Join-Path $OutDir "boot-$Boot.json"
if (Test-Path $artifact) { Fail "$artifact already exists. Each boot writes once; nothing is overwritten." }

Write-Host "=== Cold-open protocol, boot $Boot of 3 ===" -ForegroundColor Cyan

# ---- 1. Machine state, recorded before anything else ------------------------------------------
$os        = Get-CimInstance Win32_OperatingSystem
$bootTime  = $os.LastBootUpTime
$uptimeMin = [math]::Round(((Get-Date) - $bootTime).TotalMinutes, 2)
$freeBytes = (Get-PSDrive C).Free
$freeGiB   = [math]::Round($freeBytes / 1GB, 2)

$hiberboot = try {
    (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power' -Name HiberbootEnabled -ErrorAction Stop).HiberbootEnabled
} catch { 'unknown' }
$sysmain   = try { (Get-Service SysMain -ErrorAction Stop).Status.ToString() } catch { 'absent' }
$defender  = try { (Get-MpComputerStatus -ErrorAction Stop).RealTimeProtectionEnabled } catch { 'unknown' }
$media     = try { (Get-PhysicalDisk | Select-Object -First 1 -ExpandProperty MediaType) } catch { 'unknown' }

Write-Host "  boot time     : $bootTime  (uptime $uptimeMin min)"
Write-Host "  free disk     : $freeGiB GiB"
Write-Host "  HiberbootEnabled : $hiberboot   SysMain: $sysmain   Defender RTP: $defender"
Write-Host "  media type    : $media"

# SysMain and Defender are RECORDED, never disabled: turning either off would measure a different
# machine from the one under test, and a first-touch scan is part of this machine's honest cold cost.

if ($uptimeMin -gt $MaxUptimeMinutes) {
    Fail "uptime is $uptimeMin min, above the declared $MaxUptimeMinutes. This is not a fresh boot -- the file cache may already hold the fixture."
}
if ($freeGiB -lt $MinFreeGiB) { Fail "$freeGiB GiB free, below the declared $MinFreeGiB GiB floor." }
if ($hiberboot -eq 1) {
    Write-Host ""
    Write-Host "  NOTE: Fast Startup (HiberbootEnabled=1) is on. A 'Shut down' would NOT have evicted" -ForegroundColor Yellow
    Write-Host "  the cache. This run is valid ONLY if you used Restart. The disk-read evidence below" -ForegroundColor Yellow
    Write-Host "  is what actually decides it." -ForegroundColor Yellow
}
if (-not (Test-Path $Fixture))  { Fail "the fixture is absent at $Fixture." }
if (-not (Test-Path $TimeOpen)) { Fail "the time-open instrument is absent at $TimeOpen. The build is frozen before this phase; it is not built here." }

# ---- 2. The quiet gate -- verified, not assumed --------------------------------------------------
Write-Host ""
Write-Host "  settling for $SettleSeconds s..." -NoNewline
Start-Sleep -Seconds $SettleSeconds
Write-Host " done"

function Read-DiskCounters {
    $d = Get-CimInstance Win32_PerfRawData_PerfDisk_PhysicalDisk -Filter "Name='_Total'"
    [pscustomobject]@{ Read = [uint64]$d.DiskReadBytesPersec; Write = [uint64]$d.DiskWriteBytesPersec }
}

Write-Host "  quiet gate: sampling $SampleSeconds s..."
$diskA = Read-DiskCounters
$cpu = @()
for ($i = 0; $i -lt $SampleSeconds; $i++) {
    $cpu += (Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'").PercentProcessorTime
    Start-Sleep -Seconds 1
}
$diskB = Read-DiskCounters

$cpuMean = [math]::Round(($cpu | Measure-Object -Average).Average, 2)
$cpuMax  = ($cpu | Measure-Object -Maximum).Maximum
$settleDiskMB = [math]::Round((($diskB.Read - $diskA.Read) + ($diskB.Write - $diskA.Write)) / 1MB, 2)

# The build-process check instruments what the third measurement section could only assert.
$busy = Get-Process -ErrorAction SilentlyContinue |
        Where-Object { $_.ProcessName -in @('cargo','rustc','link','node','msbuild','MSBuild') } |
        Select-Object -ExpandProperty ProcessName -Unique

Write-Host "  CPU mean $cpuMean % (max $cpuMax %) | disk $settleDiskMB MB | build processes: $(if ($busy) { $busy -join ',' } else { 'none' })"

if ($cpuMean -gt $MaxCpuMeanPct)      { Fail "CPU mean $cpuMean % exceeds the declared $MaxCpuMeanPct %. Wait and re-run, or abandon this boot and repeat it." }
if ($cpuMax  -gt $MaxCpuMaxPct)       { Fail "CPU max $cpuMax % exceeds the declared $MaxCpuMaxPct %." }
if ($settleDiskMB -gt $MaxSettleDiskMB) { Fail "$settleDiskMB MB of disk traffic during the gate exceeds the declared $MaxSettleDiskMB MB." }
if ($busy)                            { Fail "a build process is running ($($busy -join ', ')). The tree is frozen for this pass; nothing should be compiling." }

# ---- 3. The binary pin -- a small read, and the fixture is NOT hashed here -----------------------
$binHash = (Get-FileHash -Algorithm SHA256 $TimeOpen).Hash.ToLower()
Write-Host "  time-open sha256: $binHash"

# Cold-time integrity is length + mtime ONLY. Hashing the fixture would read 5 GB and warm the very
# file being measured; the full hash is re-verified after the last cold sample, by the harness.
$fx = Get-Item $Fixture
Write-Host "  fixture: $($fx.Length) bytes, mtime $($fx.LastWriteTimeUtc.ToString('o'))"

# ---- 4. THE cold sample ---------------------------------------------------------------------------
Write-Host ""
Write-Host "  cold open (one sample, this boot's only one)..." -ForegroundColor Cyan
$procBefore = Read-DiskCounters
$coldJson = Join-Path $OutDir "boot-$Boot-cold.json"
& $TimeOpen --data $Fixture --repeat 1 --json $coldJson | Out-Null
if ($LASTEXITCODE -ne 0) { Fail "the cold open failed with exit $LASTEXITCODE." }
$procAfter = Read-DiskCounters

$diskReadMB = [math]::Round(($procAfter.Read - $procBefore.Read) / 1MB, 2)
$cold = (Get-Content $coldJson -Raw | ConvertFrom-Json).samples_ms[0]
Write-Host "  cold open: $([math]::Round($cold,1)) ms | physical disk read during it: $diskReadMB MB"

# **Positive evidence, not an assertion.** If the bytes did not come off the device, the file was
# already cached and "cold" is falsified -- the sample is discarded, not reported.
$coldEstablished = $diskReadMB -ge 5

# ---- 5. The within-boot warm control, and the canary ---------------------------------------------
Write-Host "  warm control ($WarmRepeats opens, same boot -- the only within-session comparison available)..."
$warmJson = Join-Path $OutDir "boot-$Boot-warm.json"
& $TimeOpen --data $Fixture --repeat $WarmRepeats --json $warmJson | Out-Null
if ($LASTEXITCODE -ne 0) { Fail "the warm control failed with exit $LASTEXITCODE." }
$warm = (Get-Content $warmJson -Raw | ConvertFrom-Json).samples_ms
$warmMin = ($warm | Measure-Object -Minimum).Minimum
$ratio = if ($warmMin -gt 0) { [math]::Round($cold / $warmMin, 2) } else { 0 }
Write-Host "  warm min: $([math]::Round($warmMin,1)) ms | cold/warm ratio: ${ratio}x"

$protocolModified = ($SettleSeconds -ne 120) -or ($SampleSeconds -ne 30) -or ($MaxUptimeMinutes -ne 20) `
    -or ($MaxCpuMeanPct -ne 5.0) -or ($MaxCpuMaxPct -ne 25.0) -or ($MaxSettleDiskMB -ne 50) `
    -or ($MinFreeGiB -ne 20) -or ($WarmRepeats -ne 5)

$record = [ordered]@{
    boot                 = $Boot
    preregistration      = 'kernel/SCALE-PASS-PREREGISTRATION.md section 4'
    protocol_modified    = $protocolModified
    boot_time            = $bootTime.ToString('o')
    uptime_minutes       = $uptimeMin
    free_gib             = $freeGiB
    hiberboot_enabled    = $hiberboot
    sysmain              = $sysmain
    defender_rtp         = $defender
    media_type           = $media
    time_open_sha256     = $binHash
    fixture_bytes        = $fx.Length
    fixture_mtime_utc    = $fx.LastWriteTimeUtc.ToString('o')
    quiet_cpu_mean_pct   = $cpuMean
    quiet_cpu_max_pct    = $cpuMax
    quiet_disk_mb        = $settleDiskMB
    cold_open_ms         = $cold
    cold_disk_read_mb    = $diskReadMB
    cold_established     = $coldEstablished
    warm_samples_ms      = $warm
    warm_min_ms          = $warmMin
    cold_over_warm       = $ratio
    note                 = 'Never pooled with another boot. The verdict against the 5 s budget is taken on the maximum of the three cold samples, declared before measuring.'
}
$record | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 $artifact

Write-Host ""
if (-not $coldEstablished) {
    Write-Host "  COLD NOT ESTABLISHED: only $diskReadMB MB came off the device, below the declared 5 MB." -ForegroundColor Red
    Write-Host "  The file was already cached. This sample is DISCARDED, not reported. Repeat this boot." -ForegroundColor Red
    Write-Host "  Artifact written anyway (with cold_established=false), because a discarded attempt is recorded." -ForegroundColor Yellow
} else {
    Write-Host "  boot $Boot recorded: $artifact" -ForegroundColor Green
    if ($Boot -lt 3) {
        Write-Host "  Next: Restart (NOT Shut down), then run this script with -Boot $($Boot + 1)." -ForegroundColor Cyan
    } else {
        Write-Host "  All three boots recorded. The harness re-verifies the fixture's full SHA-256 next." -ForegroundColor Cyan
    }
}
