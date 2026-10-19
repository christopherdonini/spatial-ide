# shell-migration-milestone-3: the re-sweep from B to the code base 564aadae, and the e2e suites there

*The custodian's record (2026-10-19), for the form's §0.3 as Amendment 4 item 3 places it: what changed from B = b88b1d2fba04e43489d4ef480060f45df2026173 to the code base 564aadae556a39c2f3a0f567730ec58e4cfe0439, PR A's branch `cut/shell-migration-milestone-3-pr-a` cut there. The pins and files by git, read only; the e2e suites from each run's artifacts, every quoted line byte-copied whole (CR removed).*

## 1. Pins and named files

- The form at the base carries 82 distinct pins. Of the 36 files they name, one differs from B to the base: KNOWN-LIMITATIONS.md.
- In it, item 44 landed between B and the base, four lines above both pins Amendment 3 takes at B. Each pinned line is unchanged and moved by four: line 390 at B is line 394 at the base, and line 379 at B is line 383 at the base (`KNOWN-LIMITATIONS.md:394 @ 564aadae556a39c2f3a0f567730ec58e4cfe0439 sha256:c22c976f428e62d266bf47043a06e577a3dc7e77d07c4136a1aa34a97c1353eb`, `KNOWN-LIMITATIONS.md:383 @ 564aadae556a39c2f3a0f567730ec58e4cfe0439 sha256:ade05ff3699847fc81592b239f647a4be3bb3b9338b4614efb3ef7196e647ade`). Class 3.
- No other pin moves: no other named file changed.

## 2. The §0.5 interfaces

- `git diff --stat b88b1d2f 564aadae` over `frontends/shell/src`, `frontends/shell/src-tauri`, `kernel/src`, `engine/src` and `protocol/src`: empty. Every interface reads at the base as Amendments 3 and 4 read it at B.
- The e2e folder changed, by PR #227 (the unknown-attempt node's step 1): `M frontends/shell/e2e/README.md`, `A frontends/shell/e2e/exportElapsed.mjs`, `A frontends/shell/e2e/exportElapsed.test.mjs`, `M frontends/shell/e2e/publish.mjs`, `M frontends/shell/e2e/selection.mjs`. Milestone 3 edits none of these.

## 3. The walkthrough letter and the KNOWN-LIMITATIONS numbers

- `MANUAL-WALKTHROUGH.md` is unchanged from B to the base, so the new Part is AB (Amendment 3 item 10).
- `KNOWN-LIMITATIONS.md` at the base holds 44 numbered items, the highest 44. Item 44 has landed, so by Amendment 3 item 10's rule the two new items take 45 and 46, read again at PR B's KNOWN-LIMITATIONS commit.

## 4. Every e2e suite at the base (one shared hold)

- **The exe:** `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, built at be6aa6203a196f553ec08f697d678dfa08a78bd4. The series checked by git that no exe source differs between that commit and the base. The port-5400 harness; each suite a fresh app; the run set of Amendment 3 item 12. This project's lines of the machine script's output:

```text
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:36464 also=bash.exe:20972 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:36464 affinity=FF (cores 0-7)
```

```text
label mm3-base2 base 564aadae556a39c2f3a0f567730ec58e4cfe0439 exe D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f built at be6aa6203a196f553ec08f697d678dfa08a78bd4; no exe source differs; start 2026-10-19T16:51:18Z
recording: rc=0, 2026-10-19T16:51:18Z to 2026-10-19T16:51:50Z, fixtures unchanged
export-view: rc=0, 2026-10-19T16:51:50Z to 2026-10-19T16:52:27Z, fixtures unchanged
selection: rc=1, 2026-10-19T16:52:27Z to 2026-10-19T16:56:52Z, fixtures unchanged
regression: rc=0, 2026-10-19T16:56:53Z to 2026-10-19T17:01:44Z, fixtures unchanged
layout: rc=0, 2026-10-19T17:01:44Z to 2026-10-19T17:02:59Z, fixtures unchanged
style: rc=0, 2026-10-19T17:02:59Z to 2026-10-19T17:03:22Z, fixtures unchanged
console: rc=0, 2026-10-19T17:03:22Z to 2026-10-19T17:09:15Z, fixtures unchanged
publish: rc=0, 2026-10-19T17:09:15Z to 2026-10-19T17:09:58Z, fixtures unchanged
admission-remediation: rc=0, 2026-10-19T17:09:58Z to 2026-10-19T17:10:41Z, fixtures unchanged
filter: rc=0, 2026-10-19T17:10:41Z to 2026-10-19T17:11:05Z, fixtures unchanged
filter-panel: rc=0, 2026-10-19T17:11:05Z to 2026-10-19T17:11:47Z, fixtures unchanged
refusal-contract-baseline: rc=0, 2026-10-19T17:11:48Z to 2026-10-19T17:12:45Z, fixtures unchanged
residency-harness: rc=0, 2026-10-19T17:12:46Z to 2026-10-19T17:13:15Z, fixtures unchanged
source-changed: rc=0, 2026-10-19T17:13:15Z to 2026-10-19T17:13:50Z, fixtures unchanged
source-watch-idle: rc=0, 2026-10-19T17:13:50Z to 2026-10-19T17:14:22Z, fixtures unchanged
pan-anchor: rc=0, 2026-10-19T17:14:22Z to 2026-10-19T17:17:30Z, fixtures unchanged
source-changed (post): rc=1, 2026-10-19T17:17:30Z to 2026-10-19T17:18:05Z, fixtures unchanged
checkout clean at end, 564aadae556a39c2f3a0f567730ec58e4cfe0439
end 2026-10-19T17:18:05Z
```

- **selection (rc=1):** E-EXPORT's execute returned `unknown-attempt`. Its line and the suite's summary, byte-copied:

```text
[E-EXPORT] FAIL (12820ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 92ms, T 120000ms); prepare-to-execute 0ms
[selection] 17 PASS, 1 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=FAIL E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
```

  U, the time from the prepare being sent to the execute's outcome, is 92 ms; T, the pending attempt's TTL, is 120,000 ms. By step 1's §1.4 that is a FAIL: the TTL did not end the attempt. This is the first unknown attempt since step 1 (the unknown-attempt node, its Amendment 6).
- **source-changed, post route (rc=1):** S5d alone failed, the race the PLAN item `source-changed-post-route-s5d-race` judges; recorded beside the base's runs, neither I12 nor I3 (Amendment 3 item 12):

```text
S5d-post-check-route-confirmed        FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's touch lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":32,"newLineCount":8,"mintRefused":["1792430274643 tile-stream-mint-refused 7:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792430274633 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
```

## 5. The selection suite alone (one exclusive hold)

The machine rule re-runs a failure seen in a shared run alone. Two runs, each a fresh app; this project's lines of the machine script's output, then the summary:

```text
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_WAITING exclusive: quiet=False average=2.2% peaks-over-25=0 samples=5 others=none since-last-end=29s because: samples 5/60; last heavy run ended 29 s ago (at least 120 s)
MACHINE_WAITING exclusive: quiet=False average=3.2% peaks-over-25=0 samples=60 others=none since-last-end=93s because: last heavy run ended 93 s ago (at least 120 s)
MACHINE_QUIET quiet=True average=3.5% peaks-over-25=0 samples=60 others=none since-last-end=120s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:14300 also=bash.exe:8548 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:14300 affinity=FF (cores 0-7)
```

```text
label mm3-sel-alone base 564aadae556a39c2f3a0f567730ec58e4cfe0439 exe sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f start 2026-10-19T17:20:07Z
selection1: rc=0, 2026-10-19T17:20:07Z to 2026-10-19T17:24:10Z, [selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLI, fixtures unchanged
selection2: rc=0, 2026-10-19T17:24:10Z to 2026-10-19T17:28:26Z, [selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLI, fixtures unchanged
checkout clean at end, 564aadae556a39c2f3a0f567730ec58e4cfe0439
end 2026-10-19T17:28:26Z
```

#### selection1

```text
[E-EXPORT] PASS (11554ms): row scope "row scope: the whole file — every row the dataset contains" and 2000 rows with a selection and without; prepare-to-execute 0ms 0ms
[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
```

#### selection2

```text
[E-EXPORT] PASS (11837ms): row scope "row scope: the whole file — every row the dataset contains" and 2000 rows with a selection and without; prepare-to-execute 0ms 0ms
[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
```

- An unknown attempt in either run alone: no.
