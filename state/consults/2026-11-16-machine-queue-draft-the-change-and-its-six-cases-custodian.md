# The machine queue: the custodian's drafted change to the machine script and its six cases, for the advisor's draft ADV-2026-11-16-08 (the human's directive of 2026-11-16, item 4); a draft, not in force

*Filed by the custodian, 2026-11-16: the change against the live script's copy, sha256 6826d814d961e3e15fadd9f9a79c6e0d5f7c695fad5a09e878376e9e9f33ea2b (684 lines); the draft, sha256 5d2a695dc9eeded270fb932c7d6c4427a82e974b659544b0ba8924b2f8c70a72 (712 lines), parsed with 0 errors; tried on scratch copies only. Nothing in the machine's folder is changed by this filing.*

## What it does

1. A project's entry in the machine's config can set `"turns": true`. It is the only switch. A project without it runs as today.
2. A project that takes turns:
   - Its shared requests run one at a time, in order of arrival.
   - A shared request that cannot start takes a place in the script's queue folder, marked mode shared. It starts when no hold of its own project is live and no earlier place of its own project is waiting, in addition to the existing rules: no exclusive held or waiting, and no other project's booking now.
   - The next request starts at the waiting loop's next check, every 5 s as today.
   - A waiting process's place goes with it. A clean stop or a give-up removes it in a finally block. A killed process's place is dropped by the stale check.
   - Nothing polls from outside: the waiting is inside the script's own loop. A request still gives up with exit 97 (WAIT_TIMEOUT) after `-MaxWaitMinutes`.
   - `hold` takes the same path as `run`: Invoke-Hold calls Wait-AndTake, the function `run` calls.
3. A project that does not take turns:
   - Its shared runs overlap each other as today.
   - They are not held back by a turns project's waiting shared places. Today every queue place counts as an exclusive waiting; the draft counts only non-shared places as that.
   - The turns check covers only the requesting project's own holds and places.
4. Exclusive requests: no change.
   - Their order counts only non-shared places, so a shared place never holds an exclusive back.
   - An exclusive that is waiting still goes before a shared request that is waiting.

## The six cases

Each case ran in a fresh scratch folder holding a copy of the script and its own config with two test projects:
- TestA takes turns (cores 0-7, or 4-7 for h1 and t1);
- TestB does not (cores 8-15).

Every hold, place and log line stayed in that folder. The commands were pings. Times are seconds after the case's start.

- **c1**, the draft.
  - A1, A2 and A3 (TestA) launched at +0.1, +1.1 and +2.2, then B1 (TestB) at +2.8.
  - Status at about +6: holds A1 and B1; A2 and A3 queued, mode shared.
  - Held: A1 +1.9 to +12.2, A2 +15.9 to +18.1, A3 +23.0 to +25.1, B1 +6.4 to +11.8. Nothing was left.
- **c1**, the live script's copy, for comparison: A1 +1.1 to +11.4, A2 +2.6 to +5.7, A3 +4.2 to +7.1, B1 +5.6 to +7.8. All overlapped.
- **c2**, the draft, TestB alone: B1 +1.1 to +7.4 and B2 +2.6 to +4.8. They overlapped.
- **c3**, the draft. A2 (TestA) was killed while waiting, at +3.3. A1 held +2.1 to +12.4, then A3 +15.7 to +17.9. The killed waiter's place was gone.
- **c4**, the draft. A1 and A2 (TestA, shared) launched at +0.1 and +1.2, then X1 (TestB, exclusive, with its quiet thresholds lowered for the test) at +1.7. Held: A1 +1.9 to +8.1, X1 +9.8 to +12.0, A2 +14.4 to +16.6.
- **h1**, the draft: the hold and release path.
  - Two throwaway child shells, each a PowerShell of its own, each ran `hold shared -Project TestA`, a ping, then `release`. H1 launched at +0.4 and H2 at +1.7.
  - While H2 waited (+5.7), the queue folder held one place, mode shared, what=H2, and H2 printed `MACHINE_WAITING shared: turn of TestA held by pid <H1's shell> since <time>`.
  - H1 held +3.1 to +12.9 and H2 +15.8 to +19.5. Each hold and release exited 0.
  - Each throwaway shell read affinity F0 while held. The test runner's affinity was FFFF before and after.
  - Nothing was left.
- **t1**, the draft: the timeout.
  - A1 (TestA) ran shared for about 80 s, held +2.9 to +83.1. A2 asked at +1.7 with `-MaxWaitMinutes 1`.
  - A2 gave up at +63.5, while A1 still ran, with the script's exit 97 and `MACHINE_ERROR WAIT_TIMEOUT turn of TestA held by pid <A1's run> since <time>`.
  - The queue folder, read the moment A2 ended, held no place.
  - A first run of this case read the queue only after A1 had also ended, and was run again.

The gap between turns, 3 to 5 s, is the loop's 5 s sleep. Not tried: a booking, and a config with more than two entries.

## The change

The change as `diff -u` of the live script's copy against the draft, with the two file-header lines left out:

```
@@ -318,7 +318,7 @@
   if (($mask -band $AllCores) -ne $mask -or $mask -eq 0) { Stop-Machine 98 "MASK_OUTSIDE_THIS_MACHINE $($entry[0].mask)" }
   $count = 0
   for ($bit = 0; $bit -lt 64; $bit++) { if (($mask -shr $bit) -band 1) { $count++ } }
-  [pscustomobject]@{ Mask = $mask; Cores = [string]$entry[0].cores; Count = $count }
+  [pscustomobject]@{ Mask = $mask; Cores = [string]$entry[0].cores; Count = $count; Turns = [bool](Get-Field $entry[0] 'turns') }
 }
 
 # The busy share of the logical processors, one value per second, from the raw counters (the CIM
@@ -369,12 +369,22 @@
 }
 
 # What stops a shared run from starting: an exclusive run held or waiting, of any project, or a
-# booking of another project that covers now (rule (a) of the product owner, 2026-10-06).
-function Get-SharedBlockers([string]$ownFile) {
+# booking of another project that covers now (rule (a) of the product owner, 2026-10-06). For a
+# project that takes turns, also a live hold of the same project, or an earlier shared request of
+# the same project waiting in the queue: its requests run one at a time, in order of arrival.
+function Get-SharedBlockers([string]$ownFile, [string]$ownPlace, [bool]$turns) {
   $blockers = @()
-  foreach ($hold in @(Get-LiveHolds)) { if ($hold.File -ne $ownFile -and $hold.Data.mode -eq 'exclusive') { $blockers += ('exclusive held by {0}' -f $hold.Data.project) } }
+  foreach ($hold in @(Get-LiveHolds)) {
+    if ($hold.File -eq $ownFile) { continue }
+    if ($hold.Data.mode -eq 'exclusive') { $blockers += ('exclusive held by {0}' -f $hold.Data.project) }
+    elseif ($turns -and $hold.Data.project -eq $Project) { $blockers += ('turn of {0} held by pid {1} since {2}' -f $Project, $hold.Data.pid, $hold.Data.started) }
+  }
   if (Get-LegacyMarker) { $blockers += 'legacy marker' }
-  foreach ($entry in @(Get-LiveQueue)) { $blockers += ('exclusive waiting for {0}' -f $entry.Data.project) }
+  $ownName = if ($ownPlace) { Split-Path -Leaf $ownPlace } else { '' }
+  foreach ($entry in @(Get-LiveQueue)) {
+    if ((Get-Field $entry.Data 'mode') -ne 'shared') { $blockers += ('exclusive waiting for {0}' -f $entry.Data.project) }
+    elseif ($turns -and $ownName -and $entry.Data.project -eq $Project -and [string]::CompareOrdinal($entry.Name, $ownName) -lt 0) { $blockers += ('earlier request of {0} waiting, pid {1}' -f $Project, $entry.Data.pid) }
+  }
   $now = Get-NowUtc
   foreach ($booking in @(Get-OtherBookingsIn $now $now.AddSeconds(1))) { $blockers += ('booking of {0} until {1}' -f $booking.Data.project, $booking.Data.end) }
   $blockers
@@ -468,25 +478,43 @@
   $deadline = (Get-NowUtc).AddMinutes($MaxWaitMinutes)
   $lastNote = (Get-NowUtc).AddMinutes(-2)
   if ($Mode -eq 'shared') {
-    while ($true) {
-      $taken = $false
+    $turns = (Get-ProjectCores $Project).Turns
+    $placePath = $null
+    if ($turns) {
+      # The place in the queue belongs to this waiting process, as an exclusive's does: if the wait is
+      # stopped, the place goes with it, and the next request of the project has the turn.
+      $placePath = Join-Path $QueueDir ('{0:D19}-{1}-{2}.json' -f (Get-NowUtc).Ticks, $Project, $PID)
+      $place = [ordered]@{ project = $Project; mode = $Mode; kind = $record.kind; what = $record.what; pid = $PID; processStart = (Get-ProcessStart $PID); started = (Format-Iso (Get-NowUtc)); expectedMinutes = $Minutes }
       $lock = Enter-Lock
-      try {
-        Remove-Stale
-        $blockers = @(Get-SharedBlockers $holdPath)
-        if ($blockers.Count -eq 0) {
-          $record.started = Format-Iso (Get-NowUtc)
-          New-RecordFile $holdPath $record
-          $taken = $true
+      try { New-RecordFile $placePath $place } finally { $lock.Dispose() }
+    }
+    try {
+      while ($true) {
+        $taken = $false
+        $lock = Enter-Lock
+        try {
+          Remove-Stale
+          $blockers = @(Get-SharedBlockers $holdPath $placePath $turns)
+          if ($blockers.Count -eq 0) {
+            $record.started = Format-Iso (Get-NowUtc)
+            New-RecordFile $holdPath $record
+            if ($placePath) { Remove-Item -LiteralPath $placePath -Force; $placePath = $null }
+            $taken = $true
+          }
+        } finally { $lock.Dispose() }
+        if ($taken) { return }
+        if ((Get-NowUtc) -gt $deadline) { Stop-Machine 97 ('WAIT_TIMEOUT ' + ($blockers -join '; ')) }
+        if (((Get-NowUtc) - $lastNote).TotalMinutes -ge 1) {
+          $lastNote = Get-NowUtc
+          Say ('MACHINE_WAITING shared: ' + ($blockers -join '; '))
         }
-      } finally { $lock.Dispose() }
-      if ($taken) { return }
-      if ((Get-NowUtc) -gt $deadline) { Stop-Machine 97 ('WAIT_TIMEOUT ' + ($blockers -join '; ')) }
-      if (((Get-NowUtc) - $lastNote).TotalMinutes -ge 1) {
-        $lastNote = Get-NowUtc
-        Say ('MACHINE_WAITING shared: ' + ($blockers -join '; '))
+        Start-Sleep -Seconds 5
+      }
+    } finally {
+      if ($placePath) {
+        $lock = Enter-Lock
+        try { Remove-Item -LiteralPath $placePath -Force -ErrorAction SilentlyContinue } finally { $lock.Dispose() }
       }
-      Start-Sleep -Seconds 5
     }
   }
 
@@ -523,7 +551,7 @@
       $lock = Enter-Lock
       try {
         Remove-Stale
-        $queue = @(Get-LiveQueue)
+        $queue = @(Get-LiveQueue | Where-Object { (Get-Field $_.Data 'mode') -ne 'shared' })
         $isFirst = ($queue.Count -ge 1 -and $queue[0].File -eq $queuePath)
         $now = Get-NowUtc
         $blocking = @(Get-OtherBookingsIn $now $now.AddMinutes([Math]::Max(1, $Minutes)))
```
