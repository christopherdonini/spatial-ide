<#
.SYNOPSIS
  Samples one process's Windows memory counters until it exits.

.DESCRIPTION
  Emits one CSV line per sample: unixMillis,privateCommitBytes,workingSetBytes.

  `PrivateMemorySize64` is Windows **private commit** — the counter `docs/08`'s memory row and the
  transport bake-off's §6 metric table both name. `WorkingSet64` is recorded alongside it because
  neither counter alone answers the question: private commit includes committed-but-not-resident
  pages, and the working set includes shared pages this process did not commit.

  Nothing here reads a child process's counters. WebView2/Chromium spreads its memory across
  processes this script does not sum, exactly as the bake-off declared that gap rather than
  discovering it later.

.EXAMPLE
  powershell -NoProfile -File kernel/scripts/sample-process-memory.ps1 -TargetPid 1234 -IntervalMs 50
#>
param(
    [Parameter(Mandatory = $true)][int]$TargetPid,
    [int]$IntervalMs = 50
)

$ErrorActionPreference = 'Stop'

try {
    $p = Get-Process -Id $TargetPid
} catch {
    Write-Error "no process with pid $TargetPid"
    exit 1
}

while ($true) {
    try {
        $p.Refresh()
        if ($p.HasExited) { break }
        $ms = [long][DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
        '{0},{1},{2}' -f $ms, $p.PrivateMemorySize64, $p.WorkingSet64
    } catch {
        break
    }
    Start-Sleep -Milliseconds $IntervalMs
}
