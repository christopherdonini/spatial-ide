# b2-piece-1b-recording at 936b7982: the custodian's e2e run 1, every suite, the recording suite again, and its four mutations

*The custodian's record, 2026-10-14. The port-5400 harness (the human's approval of 2026-10-11, item 1); the detached checkout C:/dev/wt/mm2b-e2e at 936b7982deea6f32ad6c21a824f15c068a425a50; the exe built from C:/dev/wt/1b at that head (src-tauri changed: the record_step binding); each suite a fresh app, in shared holds. Log lines are byte-copied by script; every run recorded the fixtures unchanged. The piece is stopped at I3 (Amendment 5), and this record is evidence for the human's ruling. No patch was committed; each mutation was applied from a scratch patch, run, reverted, and the checkouts proven clean.*

## Run 1: every suite, unpatched

```text
recording: rc=1, 2026-10-14T20:20:07Z to 2026-10-14T20:20:51Z
export-view: rc=0, 2026-10-14T20:21:05Z to 2026-10-14T20:21:26Z
selection: rc=0, 2026-10-14T20:21:41Z to 2026-10-14T20:25:38Z
regression: rc=0, 2026-10-14T20:25:53Z to 2026-10-14T20:30:28Z
layout: rc=0, 2026-10-14T20:30:54Z to 2026-10-14T20:31:48Z
style: rc=0, 2026-10-14T20:32:02Z to 2026-10-14T20:32:10Z
console: rc=1, 2026-10-14T20:32:23Z to 2026-10-14T20:37:40Z
publish: rc=0, 2026-10-14T20:38:00Z to 2026-10-14T20:38:28Z
admission-remediation: rc=0, 2026-10-14T20:38:43Z to 2026-10-14T20:39:10Z
filter: rc=0, 2026-10-14T20:39:22Z to 2026-10-14T20:39:33Z
filter-panel: rc=0, 2026-10-14T20:39:45Z to 2026-10-14T20:40:15Z
refusal-contract-baseline: rc=0, 2026-10-14T20:40:27Z to 2026-10-14T20:41:08Z
residency-harness: rc=0, 2026-10-14T20:41:21Z to 2026-10-14T20:41:35Z
source-changed: rc=0, 2026-10-14T20:41:47Z to 2026-10-14T20:42:06Z
source-watch-idle: rc=0, 2026-10-14T20:42:18Z to 2026-10-14T20:42:33Z
pan-anchor: rc=0, 2026-10-14T20:42:45Z to 2026-10-14T20:45:23Z
source-changed-post: rc=1, 2026-10-14T20:45:38Z to 2026-10-14T20:45:57Z
```

- **console** fails at two steps, by design under I3 (Amendment 5 item 2): CLASSC' finds no class-C style row, and GROUP' finds its three queries interleaved with `record_step` rows. ECHO' and TWOCMD' pass.

```text
ECHO'       PASS    open_dataset request parses as JSON with exactly {skp, path, cancel_key, crs_assertion, identity}; crs_assertion/identity explicit null; label version "skp/0.12" === the entry's own parsed skp field (self-consistent, no hard-coded version anywhere in this suite)
TWOCMD'     PASS    both open_dataset AND describe entries present from the ONE openPath call; describe's request parses with exactly {skp, dataset}
CLASSC'     FAIL    CLASSC': no .console-entry-class-c entry with an ADR-022 owner found after the style edit
GROUP'      FAIL    GROUP': grouping not exercised: no group in the window shows two or more rows inside it; window items: ["single a:viewport_query x1","single a:record_step x1","single a:viewport_query x1","single a:record_step x1","single b:writes one diagnostic log line to a ho x1","single a:viewport_query x1"]
```

- **recording**: OPEN to RESET pass; RECORD fails because the harness started the exe detached, so the suite's own stop did not end it and the live history stayed locked (the step's own message says a live lock reads this way). After the harness stopped the app, the run's history file held six lines, a header and five steps. In 1 line the scratch folder's temporary path, which holds a user-profile segment, is masked as `<the suite scratch folder>`; nothing else is changed.

```text
[OPEN] PASS (130ms): admitted
[APPLY] PASS (593ms): applied, and one record_step row reached ok
[STYLE] PASS (306ms): opacity 0.37 and colour #112233 committed; three record_step rows reached ok
[RESET] PASS (201ms): Reset committed; five record_step rows reached ok
[RECORD] FAIL (30352ms): no readable history.jsonl under <the suite scratch folder>\spatial-ide\sessions (folders: ["unsaved-ae74fa84ab6b247909ba303d9c718373"]); a live lock would read as this
```

- **source-changed, post route**: S5d lost the race to a tile's pre-check, a timing-sensitive step in a shared run; run 2 repeats it.

```text
[S5d-post-check-route-confirmed] FAIL: S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's touch lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silen
```

## Run 2: the recording suite with the app kept attached, and the post route again

The harness's launcher gained one opt-in mode (`E2E_SHIM_WAIT`): it stays alive as the exe's parent, as `npx tauri dev` does, so the suite's own stop reaches the exe. The suite is unchanged. Recording 2026-10-14T20:47:38Z to 2026-10-14T20:47:44Z, rc=0; the post route 2026-10-14T20:47:56Z to 2026-10-14T20:48:14Z, rc=0.

```text
[OPEN] PASS (102ms): admitted
[APPLY] PASS (587ms): applied, and one record_step row reached ok
[STYLE] PASS (313ms): opacity 0.37 and colour #112233 committed; three record_step rows reached ok
[RESET] PASS (220ms): Reset committed; five record_step rows reached ok
[RECORD] PASS (682ms): unsaved-0bcd48a06b2344c97e28e022eb1c051b: a header and five steps, in order and chained; the filter names the field zone; the recorded opacities 0.37 and 0.7058823529411765 equal the applied values bit for bit (H6)
S5d-post-check-route-confirmed        PASS    "tile-session-ended-source-changed" present, no "tile-stream-mint-refused" since this run's own baseline -- the terminal (post-check) route ended this session, not the pre-check
```

## The recording suite's four mutations, each observed failing at the step it names

- **REC-APPLY**: the `stepQueue.enqueue` line removed from `commitActiveFilter` (App.tsx).
- **REC-STYLE**: the enqueue loop removed from `handleStyleCommit` (App.tsx).
- **REC-RESET**: `onCommit(DEFAULT_STYLE_STATE)` removed from the Reset handler (StylePanel.tsx).
- **REC-CHAIN**: the kernel writes every step's `parent` as null (session_history.rs); its exe was built from C:/dev/wt/1b with the patch applied, then the patch reverted there and the porcelain shown empty.

```text
REC-APPLY (2026-10-14T20:49:28Z to 2026-10-14T20:50:04Z): [APPLY] FAIL (30627ms): expected 1 record_step rows, all ok; saw []
REC-STYLE (2026-10-14T20:50:18Z to 2026-10-14T20:50:53Z): [STYLE] FAIL (30169ms): expected 2 record_step rows, all ok; saw ["ok"]
REC-RESET (2026-10-14T20:51:07Z to 2026-10-14T20:51:43Z): [RESET] FAIL (30150ms): expected 5 record_step rows, all ok; saw ["ok","ok","ok"]
REC-CHAIN (2026-10-14T20:57:06Z to 2026-10-14T20:57:13Z): [RECORD] FAIL (727ms): step 2 does not chain: parent null
```
