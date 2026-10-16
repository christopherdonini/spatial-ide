# shell-migration-milestone-3: the custodian's e2e runs at the code base, main b88b1d2f

*The custodian's record, 2026-10-16, for the form's section 0.3 (the re-sweep at code start): every e2e suite at the base B = b88b1d2fba04e43489d4ef480060f45df2026173 (the code of PR #222's merge 6282b5ed and records). The port-5400 harness; the detached checkout C:/dev/wt/mm2b-e2e at B; the exe built there into the e2e target's own copy. Each suite is a fresh app; the recording suite runs with the harness keeping the app attached (`E2E_SHIM_WAIT=1`); source-changed runs on its default route and then on its post route. The build and every run in one shared hold. Lines byte-copied by script.*

## The exe, and every run, unpatched

```text
build rc=0     Finished `dev` profile [unoptimized + debuginfo] target(s) in 8m 29s
recording: rc=0, 2026-10-16T21:26:47Z to 2026-10-16T21:27:37Z
export-view: rc=0, 2026-10-16T21:27:37Z to 2026-10-16T21:28:11Z
selection: rc=0, 2026-10-16T21:28:11Z to 2026-10-16T21:32:12Z
regression: rc=0, 2026-10-16T21:32:13Z to 2026-10-16T21:36:59Z
layout: rc=0, 2026-10-16T21:36:59Z to 2026-10-16T21:38:13Z
style: rc=0, 2026-10-16T21:38:13Z to 2026-10-16T21:38:35Z
console: rc=0, 2026-10-16T21:38:35Z to 2026-10-16T21:44:12Z
publish: rc=0, 2026-10-16T21:44:12Z to 2026-10-16T21:44:57Z
admission-remediation: rc=0, 2026-10-16T21:44:57Z to 2026-10-16T21:45:38Z
filter: rc=0, 2026-10-16T21:45:38Z to 2026-10-16T21:46:01Z
filter-panel: rc=0, 2026-10-16T21:46:01Z to 2026-10-16T21:46:43Z
refusal-contract-baseline: rc=0, 2026-10-16T21:46:43Z to 2026-10-16T21:47:37Z
residency-harness: rc=0, 2026-10-16T21:47:37Z to 2026-10-16T21:48:05Z
source-changed: rc=0, 2026-10-16T21:48:05Z to 2026-10-16T21:48:36Z
source-watch-idle: rc=0, 2026-10-16T21:48:36Z to 2026-10-16T21:49:03Z
pan-anchor: rc=0, 2026-10-16T21:49:03Z to 2026-10-16T21:51:57Z
source-changed-post: rc=0, 2026-10-16T21:51:57Z to 2026-10-16T21:52:30Z
```

## The fixture check, each run

```text
recording: fixtures unchanged
export-view: fixtures unchanged
selection: fixtures unchanged
regression: fixtures unchanged
layout: fixtures unchanged
style: fixtures unchanged
console: fixtures unchanged
publish: fixtures unchanged
admission-remediation: fixtures unchanged
filter: fixtures unchanged
filter-panel: fixtures unchanged
refusal-contract-baseline: fixtures unchanged
residency-harness: fixtures unchanged
source-changed: fixtures unchanged
source-watch-idle: fixtures unchanged
pan-anchor: fixtures unchanged
source-changed-post: fixtures unchanged
```

Every run passed at the base.
