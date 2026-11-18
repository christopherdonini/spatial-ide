# shell-tiled-arm-stream-refusal-shown-to-the-user: cases A and B2 traced at the v0.1.0 tag, read only (the advisor's question of 2026-11-16); the reviewer's report

*Filed by the custodian from the hand-back: 13816 bytes, sha256 edca06780e7ef6cc72746ef6811af751568964e324abb59466951e01115ffffa, claude-opus-5-5, 55 calls by its transcript. Byte for byte below the rule. Not a gate.*

---

v0.1.0 trace: B2 at the tag: silent; A at the tag: does not exist — main @ 45e68459cb1a3903d2230f920b4843e8db512c92 (records read); tag v0.1.0 (annotated, fbba9ae8cfd825e837dc71c0df596dc14ff3b2c5) → commit b391e43622056324c56d35cc33065305140a8415 (code read)

*My words throughout, except text in quotation marks or code blocks marked byte-copied.* Short version, in my words: B2 was silent in the released app, the same way it is today. A in its exact form (refused twice, then dropped) did not exist at the tag, because there was no retry then. But a refused tile at the tag was dropped after its first refusal, with no call back to the session and not even a log line. That is the same silence, reached sooner.

Shipped code is the tag's code. The tag message says the installer was "built from 13471a9 on release/0.1.0". `git merge-base --is-ancestor 13471a9 v0.1.0` succeeded, and `git diff --stat 13471a9 v0.1.0 -- frontends/shell/src kernel/src engine/src` printed nothing.

**1. The arm v0.1.0 shipped: candidate.**
Commands: `git show v0.1.0:frontends/shell/src/residency/residencyArm.ts`, `git grep -n -E "shouldConstructCandidateSession|startCandidateArmSession|…" v0.1.0 -- frontends/shell/src/App.tsx`, `git show v0.1.0:frontends/shell/src/App.tsx`.
- `v0.1.0:frontends/shell/src/residency/residencyArm.ts:50`, byte-copied: `export const DEFAULT_RESIDENCY_ARM: ResidencyArm = "candidate";`
- `v0.1.0:frontends/shell/src/residency/residencyArm.ts:84-86`: `shouldConstructCandidateSession()` returns `getResidencyArm() === "candidate"`.
- The call site is `v0.1.0:frontends/shell/src/App.tsx:1013`, `if (shouldConstructCandidateSession()) {`, followed by `const session = startCandidateArmSession({` at `:1014`. Nothing at that site checks `isInstrumentedBuild()`.
- The only way to switch to baseline is `setResidencyArm`. It is registered only inside the `isInstrumentedBuild()`-gated effect (`v0.1.0:frontends/shell/src/App.tsx:827` and `:899`).
- The session at the tag gets only these inputs: `dataset`, `canvas`, `tileGridLevel`, `onResidencyStatusChange`, `applyScanEvent` (`v0.1.0:frontends/shell/src/App.tsx:1014-1046`). It has no refusal or failure callback.
- The first look at open is `reportViewportOutcome(session.reissueUnrestricted(null, activeFilterRef.current))` (`:1069`). Apply goes through `issueQueryRef.current = (bbox, _bboxCrs, filter) => session.reissueUnrestricted(bbox, filter)` (`:1051`).

**2. B2 at the tag: the first look's stream fails after its ticket and before any batch.**
Commands: `git show v0.1.0:frontends/shell/src/residency/candidateArmSession.ts`, `git show v0.1.0:frontends/shell/src/App.tsx`, `git show v0.1.0:frontends/shell/src/residency/residencyStatus.ts`, `git show v0.1.0:frontends/shell/src/filter/FilterPanel.tsx`.

At open, what the session does:
- `reissueUnrestricted` (`v0.1.0:frontends/shell/src/residency/candidateArmSession.ts:1497-1554`) emits `deps.onResidencyStatusChange?.({ kind: "query-issued" })` at `:1551`, then calls `issueUntiledQuery`.
- `issueUntiledQuery` (`:1183-1333`) gets the ticket (`:1195`) and sets `untiledStreamHandle = stream`. Then `syncScanLiveness()` (`:1206`) sends `applyScanEvent({kind:"issued", streamHandle: CANDIDATE_SCAN_HANDLE})` (`:562-571`). It returns `{ kind: "issued", streamHandle: stream }` (`:1332`), so the promise resolves before any failure.
- When the failure terminal arrives, the sink's `onTerminal` (`:1232-1326`) does five things:
  - clears the handle (`:1242`);
  - logs `"candidate-untiled-terminal"` (`:1263-1268`);
  - records `failedCoveringTerminals.set(INITIAL_TILE_KEY, terminal.kind)` (`:1269-1271`);
  - calls `establishFrameFromExtent(latestUnionedExtent)` (`:1293`), which does nothing because no batch arrived and the extent is null (`:1126`, `if (frameEstablished || !extent) return;`);
  - calls `syncScanLiveness()` (`:1325`), which sends `{kind:"reset"}`.
- No `onResidencyStatusChange` call happens on that path. The only emit in `onTerminal` is the relinquish re-emit, gated on `lastEmittedRelinquishedUntiled` (`:1321-1324`), and `reissueUnrestricted` has just reset that flag to false (`:1525`).
- No grid frame is made, so a later pan stops at `if (outcome.kind !== "planned") return;` (`:1371`) and emits nothing.

At open, what App shows (reading, not run):
- `query-issued` folds to `null` (`v0.1.0:frontends/shell/src/residency/residencyStatus.ts:203-205`), so `.residency-status` (`v0.1.0:frontends/shell/src/App.tsx:1478-1482`) does not render.
- The promise resolved, so `reportViewportOutcome` runs `() => setViewportRefusal(null)` (`v0.1.0:frontends/shell/src/App.tsx:926-928`).
- `canvasRefusal` is set only by the baseline arm's `onFailureTerminal` (`:1102-1106`) and by the batch-ceiling handler (`:589-600`, `:1366-1376`). The candidate session reaches neither.
- The scan state goes issued, then reset, ending `idle` (`:449-450`). So `scanLivenessText` gives null (`:485-493`), Cancel is hidden (`:461-463`), and `.scan-incomplete` (`:1490-1494`) does not render.
- Result: the whole `.canvas-status-stack` block (`:1436`) does not render, and the map is empty. At the tag there is no status bar. The status surface is this stack, plus the filter panel's liveness line and Cancel.

On an Apply:
- `handleApplyFilter` → `applyFilter` (`v0.1.0:frontends/shell/src/App.tsx:739-759`, `:289-331`) → `issueQueryRef.current` → `session.reissueUnrestricted(null, filter)`.
- The session does the same as at open, with one difference: `manager.clearAll()` and `canvas?.clearAllTiles()` run first (`v0.1.0:frontends/shell/src/residency/candidateArmSession.ts:1508`, `:1512`). The frame from the earlier open survives.
- The outcome is `"issued"`, so `applyFilter` commits the filter and returns `{ kind: "applied", … }` (`v0.1.0:frontends/shell/src/App.tsx:325-328`). FilterPanel then clears its refusal (`v0.1.0:frontends/shell/src/filter/FilterPanel.tsx:56`) and, for a non-null filter, shows `Applied: {appliedFilter.predicate}` (`:123`).
- After the failure, the status stack shows nothing and the map is cleared, while the panel says the filter was applied. A later pan re-plans tiles, because the frame survives.

**3. A at the tag: does not exist as defined; a refused tile was dropped at its first refusal.**
Commands: `git show v0.1.0:frontends/shell/src/streaming/tileViewportStreamManager.ts`, `git grep -n "connections_exhausted" v0.1.0`.
- `v0.1.0:frontends/shell/src/streaming/tileViewportStreamManager.ts:660-669`, byte-copied:
```
    let ticket: { stream: string };
    try {
      ticket = await viewportQuery(this.opts.dataset, wireBbox, null, null, this.currentFilter);
    } catch {
      if (this.issueEpoch.get(tileKey) === epoch) {
        this.tileState.delete(tileKey);
        this.drainQueueIfRoom();
      }
      return;
    }
```
- At the tag there is no retry, no log line and no `this.opts.*` call on this path, for any refusal code.
- The session's `syncScanLiveness` runs only from the session's own handlers (`v0.1.0:frontends/shell/src/residency/candidateArmSession.ts:562-571`). So when the refused tile is the last one tracked, nothing sends `reset`. The scan stays `issuing` and Cancel stays up (`v0.1.0:frontends/shell/src/App.tsx:461-463`). No status event follows either.
- When other tiles are still tracked, the next terminal's `emitResidencyStatus` sees `isFillComplete()` false (`v0.1.0:frontends/shell/src/residency/candidateArmSession.ts:634-655`). That matches the tester's A-control. I did not trace that by run.
- `engine.connections_exhausted` was a kernel refusal at the tag (`v0.1.0:kernel/src/skp.rs:40`, `:669-672`). Entry 87's diagnosed code was `skp.filter_rejected_by_binder`. The tag's catch treats every code the same.

**4. What v0.1.0's own records say.**
Commands: `git show v0.1.0:KNOWN-LIMITATIONS.md`, `git show v0.1.0:RELEASE-0.1.md` (at the tag the file is at the repository root; `governance/RELEASE-0.1.md` does not exist there), `git cat-file -p v0.1.0`, `git ls-tree -r --name-only v0.1.0 | grep -iE "release|notes|changelog"` (matched only `RELEASE-0.1.md`).

What the release notes are, `v0.1.0:RELEASE-0.1.md:148-149`, byte-copied:
```
(red line: outward-facing, hard to reverse). Release notes = the KNOWN-LIMITATIONS text plus the
hero-slice sentence and the install pointer; nothing else. No numbers.
```

On case A, `v0.1.0:KNOWN-LIMITATIONS.md:152-155`, byte-copied:
```
Under a row filter at wide zooms, some of the view's per-tile queries are refused by the
app's own filter-admission check and never run. The status then reports those areas as not loaded,
which is true: any matching features there are not drawn until you pan or zoom in and they are
queried again. The app cannot know whether those areas are empty.
```
- Its source comment, `v0.1.0:KNOWN-LIMITATIONS.md:156`, contains, byte-copied: `skp.filter_rejected_by_binder refusals discarded in tileViewportStreamManager.ts mintAndStart's catch; the fix is queued post-tag`.
- The tag message carries the same bullet. Byte-copied from `git cat-file -p v0.1.0`: "The status then reports those areas as not loaded, which is true" (one line break inside it in the source).
- My reading of the tag's code: "The status then reports those areas as not loaded" holds only when another tracked tile reaches a terminal after the drop. When the refused tile was the last one tracked, the status said nothing.

Item 7, `v0.1.0:KNOWN-LIMITATIONS.md:81-82`, byte-copied:
```
   Filling can also stop with part of the view not loaded, which the status says as *"Filling has
   finished for this view — some areas were not loaded; pan or zoom to load them."* This is the
```

On B2: I found nothing. A grep of the tag's `KNOWN-LIMITATIONS.md` and `RELEASE-0.1.md` for `untiled|first look|stream fail|ProducerFailed|TransportFailed|silent` found no line about a failed first look. The only "first look" line is `v0.1.0:RELEASE-0.1.md:128`, about over-budget zoom-out.

Not in the tag: `governance/RELEASE-0.1.md` Amendments 14 to 18 are not in the tag's `RELEASE-0.1.md`, which ends at Amendment 13. Entry 87's mechanism paragraph came in e217f15edb44c4da4987bb9bcdb37e40c0b99322 (2026-09-13T20:15:33+02:00), and `git merge-base --is-ancestor e217f15e v0.1.0` failed. On main, `45e68459:governance/RELEASE-0.1.md:1276` contains, byte-copied: "and the shell's minting code discards the refusal silently; those tiles never become streams, their areas are never read, matching features there are not drawn, and the status sentence is true of them."

**5. The first commit from which each silence holds.**
Commands: `git log --first-parent --format='%H %cI %s' -S <string> <rev> -- <path>` (strings below), `git log --first-parent -G …`, `git merge-base --is-ancestor`, `git show fdb7c87a^1:…`, `git show 20cee317:…`, `git show 4619d4b4:…`, `git diff 9a42af20^1 9a42af20 -- …`.

B2: fdb7c87a05944004c861aaf70f142ba60cf5e0ce, 2026-09-08T08:56:20+02:00, "Merge pull request #30 from christopherdonini/cut/release-arm-flip". It is an ancestor of v0.1.0.
- This is the default flip, found by `-S 'DEFAULT_RESIDENCY_ARM: ResidencyArm = "candidate"'`.
- Before it, `fdb7c87a^1:frontends/shell/src/residency/residencyArm.ts:26` sets the default to `"baseline"`, and `fdb7c87a^1:frontends/shell/src/App.tsx:988` gates the candidate arm with `if (isInstrumentedBuild() && getResidencyArm() === "candidate") {`.
- In a shipped build the baseline arm surfaced a stream failure: `fdb7c87a^1:frontends/shell/src/App.tsx:1077-1080` calls `setCanvasRefusal(\`stream ${terminal.kind}: ${terminal.detail}\`)`.
- The candidate arm's untiled terminal had no status emit from its first landing: 20cee3171e7f083bc8f627ed82da7e6ceb0d3ca7, 2026-09-03T06:03:03+02:00, #16, an ancestor of the tag. See `20cee317:frontends/shell/src/residency/candidateArmSession.ts:677-698`. In instrumented builds, then, it was silent from #16.
- From the tag to main the untiled `onTerminal` gained only the session-ended branch (`45e68459:frontends/shell/src/residency/candidateArmSession.ts:1355-1358`). `deps.onResidencyStatusChange?.(` appears 8 times at both revisions. `git log --first-parent -G "onResidencyStatusChange\?\.\(" v0.1.0..45e68459` on that file lists no commit.
- Reading cannot settle what today's App renders. The tester read that, and it differs in layout (a status bar).

A, as defined: 4619d4b4a6c26d8b52da8e19df8a3e6720aca30c, 2026-09-14T00:01:05+02:00, "Merge pull request #55 from christopherdonini/polish/filter-and-hover". It is **not** an ancestor of v0.1.0 (`git merge-base --is-ancestor` failed). The tag is b391e436 at 2026-09-13T20:28:44+02:00.
- #55 added `logMintRefused`, `isRetryableRefusal` (with `"engine.connections_exhausted"`) and the one-shot requeue. The drop after the retry has no session call (`4619d4b4:frontends/shell/src/streaming/tileViewportStreamManager.ts:862-898`).
- The only first-parent change to that block since is 9a42af20 (#127, 2026-09-26), which adds the `isSessionEndedRefusal` check. It ends the session for `engine.source_changed` and leaves the `connections_exhausted` drop as it was (`45e68459:frontends/shell/src/streaming/tileViewportStreamManager.ts:947-999`).
- The earlier form (one refusal, dropped silently, no log) is unchanged from 20cee317 (#16; `20cee317:frontends/shell/src/streaming/tileViewportStreamManager.ts:470-477`) to the tag. `git log --first-parent -G "ticket = await viewportQuery|\} catch \{" 20cee317..v0.1.0` lists nothing. In shipped builds it was reachable from fdb7c87a (#30).
- Reading cannot settle whether any intermediate commit briefly changed the session side. I compared only the tag, #55, #127 and main, plus the `-G` searches named above.

No file was written and no build or test was run. I started no background shell, and none is still running.
