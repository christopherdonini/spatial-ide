# b2-piece-1b-recording at 10173747: the custodian's e2e run 4, at correction round 1's head (Amendment 8)

*The custodian's record, 2026-10-16. The port-5400 harness; the detached checkout C:/dev/wt/mm2b-e2e at 10173747ea44a22d2830a74e378e5a6db0841a39; the exe rebuilt from C:/dev/wt/1b at that head (the round changes the kernel), into its own copy. Each suite is a fresh app; the recording suite runs with the harness keeping the app attached (`E2E_SHIM_WAIT=1`). The build, the suites and the mutations ran in one shared hold; the post route's second run in a shared hold of its own, its third in an exclusive hold, and run 4b in a further shared hold. Log lines are byte-copied by script, cut at 300 characters; every run recorded the fixtures unchanged. Each mutation was made at the head by an anchored one-line edit, applied alone, run, reverted, and the checkout proven clean. The round's worker report: `state/consults/2026-10-16-b2-piece-1b-recording-correction-round-1-worker-report.md` (from its one hand-back, its branch cites de-rooted as its filing note states; the hand-back's sha256 ff1c0ab2; its run 2026-10-16T08:38:54Z to 2026-10-16T09:48:28Z by its transcript).*

## The exe, and every suite, unpatched

```text
build rc=0     Finished `dev` profile [unoptimized + debuginfo] target(s) in 3m 22s
recording: rc=0, 2026-10-16T09:54:19Z to 2026-10-16T09:54:27Z
export-view: rc=0, 2026-10-16T09:54:39Z to 2026-10-16T09:55:00Z
selection: rc=0, 2026-10-16T09:55:13Z to 2026-10-16T09:59:00Z
regression: rc=0, 2026-10-16T09:59:13Z to 2026-10-16T10:03:41Z
layout: rc=0, 2026-10-16T10:04:06Z to 2026-10-16T10:04:59Z
style: rc=0, 2026-10-16T10:05:13Z to 2026-10-16T10:05:22Z
console: rc=0, 2026-10-16T10:05:35Z to 2026-10-16T10:10:56Z
publish: rc=0, 2026-10-16T10:11:15Z to 2026-10-16T10:11:40Z
admission-remediation: rc=0, 2026-10-16T10:11:55Z to 2026-10-16T10:12:22Z
filter: rc=0, 2026-10-16T10:12:34Z to 2026-10-16T10:12:45Z
filter-panel: rc=0, 2026-10-16T10:12:58Z to 2026-10-16T10:13:27Z
refusal-contract-baseline: rc=0, 2026-10-16T10:13:40Z to 2026-10-16T10:14:21Z
residency-harness: rc=0, 2026-10-16T10:14:33Z to 2026-10-16T10:14:48Z
source-changed: rc=0, 2026-10-16T10:15:01Z to 2026-10-16T10:15:20Z
source-watch-idle: rc=0, 2026-10-16T10:15:32Z to 2026-10-16T10:15:47Z
pan-anchor: rc=0, 2026-10-16T10:15:59Z to 2026-10-16T10:18:39Z
source-changed-post: rc=1, 2026-10-16T10:18:54Z to 2026-10-16T10:19:13Z
```

- **recording:** every step passes at the head.

```text
[OPEN] PASS (111ms): admitted
[APPLY] PASS (536ms): applied, and one record_step row reached ok
[STYLE] PASS (292ms): opacity 0.37 and colour #112233 committed; three record_step rows reached ok
[RESET] PASS (231ms): Reset committed; five record_step rows reached ok
[RECORD] PASS (682ms): unsaved-a5ae1b4faf0819842c18b463c3751139: a header and five steps, in order and chained; the filter names the field zone; the recorded opacities 0.37 and 0.7058823529411765 equal the applied values bit for bit (H6)
```

- **console** (11 steps) and **style** (6 steps) pass. The round's new console row is written only by a Reset that changes nothing; `style.mjs`'s RESET' follows edits, so no suite step writes it (`App.recording.test.tsx` A4 proves it).

```text
HEADER' PASS
ECHO' PASS
TWOCMD' PASS
HEXLIM' PASS
REFUSAL' PASS
CLASSB' PASS
CLASSC' PASS
GROUP' PASS
COPYTRUNC' PASS
UNCLASS' PASS
REGRESS' PASS
OPEN PASS
STYLE' PASS
OPACITY' PASS
OUTLINE' PASS
DOC' PASS
RESET' PASS
```

- **source-changed, post route:** S5d lost the race to a tile's pre-check, the timing-sensitive step run 1 also met; every other step passed. A second shared run lost it the same way (2026-10-16T10:27:32Z to 2026-10-16T10:27:50Z, rc=1). A third run, alone on the machine in an exclusive hold (2026-10-16T10:30:07Z to 2026-10-16T10:30:24Z, rc=1), lost it again. The round changes neither the tile path nor the source watch.

```text
S5d-post-check-route-confirmed        FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's touch lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not 
S5d-post-check-route-confirmed        FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's touch lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not 
S5d-post-check-route-confirmed        FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's touch lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not 
```

## The recording suite's four mutations, re-made at the head, each failing at the step it names

The round moved two of the anchors (STYLE: the loop now runs over `transitions`; RESET: Reset passes its source). REC-CHAIN is a kernel edit: its exe was built from C:/dev/wt/1b with the patch applied, then the patch reverted there and the porcelain shown empty.

- **REC-APPLY** (2026-10-16T10:19:28Z to 2026-10-16T10:20:02Z):

```text
-      if (dataset !== null) stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter } });
[APPLY] FAIL (30646ms): expected 1 record_step rows, all ok; saw []
```

- **REC-STYLE** (2026-10-16T10:20:15Z to 2026-10-16T10:20:50Z):

```text
-    for (const transition of transitions) stepQueue.enqueue(dataset, transition);
[STYLE] FAIL (30182ms): expected 2 record_step rows, all ok; saw ["ok"]
```

- **REC-RESET** (2026-10-16T10:21:02Z to 2026-10-16T10:21:38Z):

```text
-    onCommit(DEFAULT_STYLE_STATE, "reset");
[RESET] FAIL (30128ms): expected 5 record_step rows, all ok; saw ["ok","ok","ok"]
```

- **REC-CHAIN** (2026-10-16T10:26:42Z to 2026-10-16T10:26:49Z):

```text
-        let parent = rec.last_step.as_deref();
+        let parent: Option<&str> = None;
[RECORD] FAIL (692ms): step 2 does not chain: parent null
```

## Run 4b: does the piece change the post route's race?

Run 4 lost S5d three times of three at the head, where this harness's earlier post-route runs had passed it six times of seven. So the post route ran four more times on each of three builds, interleaved, in one shared hold. Each build has its own checkout head and exe: **base**, the PR's base B 31e25f15, with an exe built at B from the e2e checkout; **pre**, 3dfc1a0e (1b before the round), with the 936b7982 exe; **head**, 10173747, with run 4's exe. Every run recorded the fixtures unchanged, and S5d is the only step that failed in any run.

```text
base build rc=0     Finished `dev` profile [unoptimized + debuginfo] target(s) in 8m 24s
base 1 (31e25f15): rc=0, S5d PASS, 2026-10-16T10:40:45Z to 2026-10-16T10:41:03Z
pre 1 (3dfc1a0e): rc=0, S5d PASS, 2026-10-16T10:41:17Z to 2026-10-16T10:41:38Z
head 1 (10173747): rc=0, S5d PASS, 2026-10-16T10:41:50Z to 2026-10-16T10:42:09Z
base 2 (31e25f15): rc=1, S5d FAIL, 2026-10-16T10:42:21Z to 2026-10-16T10:42:40Z
pre 2 (3dfc1a0e): rc=0, S5d PASS, 2026-10-16T10:42:53Z to 2026-10-16T10:43:11Z
head 2 (10173747): rc=1, S5d FAIL, 2026-10-16T10:43:24Z to 2026-10-16T10:43:43Z
base 3 (31e25f15): rc=0, S5d PASS, 2026-10-16T10:43:56Z to 2026-10-16T10:44:14Z
pre 3 (3dfc1a0e): rc=0, S5d PASS, 2026-10-16T10:44:27Z to 2026-10-16T10:44:45Z
head 3 (10173747): rc=1, S5d FAIL, 2026-10-16T10:44:58Z to 2026-10-16T10:45:16Z
base 4 (31e25f15): rc=1, S5d FAIL, 2026-10-16T10:45:30Z to 2026-10-16T10:45:48Z
pre 4 (3dfc1a0e): rc=1, S5d FAIL, 2026-10-16T10:46:01Z to 2026-10-16T10:46:20Z
head 4 (10173747): rc=1, S5d FAIL, 2026-10-16T10:46:33Z to 2026-10-16T10:46:51Z
```

- **The tally of S5d passes:** base 2 of 4, pre 3 of 4, head 1 of 4. With run 4's three, the head has passed it once in seven runs.
- **What this shows:** the race is already on main at B, which lost S5d twice in four runs. Samples of this size do not separate the head from the base, and no claim is made either way. The file's header note states the route's limit: a sibling tile whose mint resolves after the touch hits the pre-check. Each of the 9 failing runs of runs 4 and 4b has one `tile-session-ended-source-changed` line and one `tile-stream-mint-refused` line, 11 to 15 ms after it, by the timestamps in S5d's evidence.
