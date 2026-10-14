*Custodian's filing note (2026-10-12): the worker's report on the e2e mutation patches (eighteen patch files written into the custodian's scratch folder, each checked by git apply --check at a6607738; no repository write), the run 2026-10-12T09:42:43Z to 2026-10-12T09:45:56Z by its transcript (Bash 16, Write 20); its one SubagentHandback call, at 09:45:55Z. It arrived as a message and is extracted here by script. 1 occurrence(s) of the scratchpad's absolute path, which holds a local profile path, are replaced by a bracketed placeholder. 0 rooted path:line cite(s) are de-rooted by script and one final newline is added; nothing else is changed. The message's sha256 as handed back is 3c750e78ced426c1e81e424754410fb5e5f02bab73ca780177cc14c76c0f07a3; this file's, from line 5 to the end, is 3eeba24c4d81d6f738b6ff8b296849b3939fd89d797cb7df6b794e69f7477d97.*

---

All 18 patches are written and `git -C C:/dev/wt/mm2b apply --check` exits 0 on every one. That worktree is at a6607738, and its `git status --porcelain` printed nothing. Nothing was written in any repository or worktree. I did not run e2e or start any app.

The folder is [the session scratchpad, a profile path removed by the custodian]/mm2b-e2e/mutations/. Each patch starts with a `#` line naming the step and the header's mutation text. Paths are in the form `a/frontends/shell/src/...`.

Patches, each with the file it changes. All exit 0.
- E-CLICK: canvas/WorkingCanvas.tsx. The tap's `resolveCandidate` dep takes `gpuOrdinal + 1`. The hover site's dep is untouched.
- E-CLICK-FAST: canvas/WorkingCanvas.tsx. The tap's dep returns `lastHoverReadoutRef.current` when it is a pick (`"id" in hovered`), else `resolvePick`.
- E-SELECT: canvas/highlightLayers.ts. `SELECTED_OUTLINE_RGBA` alpha becomes 0.
- E-NODRAG-1: canvas/WorkingCanvas.tsx. Adds `onDragEnd: (_info, event) => onTap(event)` to the Deck props.
- E-NODRAG-2: canvas/WorkingCanvas.tsx. See the first ambiguity below.
- E-ZOOMSEL: App.tsx. `fitToBbox` gets a point box at `union.xmin`, `union.ymin`.
- E-SEL-PAN: App.tsx. `transit({action:"selection.clear", params:{}})` in the `onViewportChanged` JSX callback.
- E-SEL-FILTER: App.tsx. `commitActiveFilter` also dispatches `selection.clear`.
- E-REFUSED: feature/clickEffect.ts. See the third ambiguity below.
- E-GEN: workspace/workspaceState.ts. Both halves in one patch.
- E-GEN-1: workspace/workspaceState.ts. The `admit` half only.
- E-GEN-2: workspace/workspaceState.ts. The `endGeneration` half only.
- E-KINDS: canvas/pick.ts. `const row = gpuOrdinal;`.
- E-EXPORT: App.tsx. `filterActive={activeFilter !== null || selection.size > 0}`.
- E-SCOPE: publish/PublishPanel.tsx. `const check: ScopeCheck = { ok: true };`. `ScopeCheck` is already imported there.
- E-ASK-1: App.tsx. `return Promise.resolve(true);` as the first statement of `confirmOpen`.
- E-ASK-2: App.tsx. See the fifth ambiguity below.
- E-ASK-STATEMENT: App.tsx. The loop body is replaced with the header's two statements.

Ambiguities and decisions.
1. **E-NODRAG-2 adds a second hunk beyond the header's literal text.** The Deck is built once (empty deps), so the header's controller line is read only at mount and would do nothing after a tool switch. The patch has the header's line, now `controller: toolRef.current === "select" ? { dragPan: false } : true`. It also has a `useEffect(() => { deckRef.current?.setProps({ controller: tool === "select" ? { dragPan: false } : true }); }, [tool]);` after `toolRef.current = tool;`. Drop that hunk if you want the literal reading.
2. **E-GEN is also split.** The header's E-GEN is one mutation, so E-GEN.patch carries both halves. I added E-GEN-1 and E-GEN-2 so each half can be run alone. In E-GEN-2 the loop body is now empty.
3. **E-REFUSED has no header-specified content for the added `selection.apply`.** The below-resolution branch has no pick, so the patch uses `mode: viewSelectionMode(view), id: BigInt(0), bounds: {xmin:0,ymin:0,xmax:0,ymax:0}`. It applies in every tool. If the e2e step's count only changes in Select, the effect is the same.
4. **E-KINDS may throw instead of yielding extra ids.** With `row = gpuOrdinal`, a multipolygon has more parts than rows, so `batch.parts[row][0]` can throw a TypeError rather than produce more than three ids. The step should fail either way.
5. **E-ASK-2 releases on the old dataset.** The header gives no resource, so the patch reads `admittedDatasetRef.current` before it is overwritten and releases each `exportRunsRef` key against that. It sits as the first lines of `handleAdmitted`.
6. **Unreachable code after `return` in E-ASK-1.** This is fine under vite and esbuild.
7. **No `ScopeCheck` type breakage in E-SCOPE.** `checkStagedScope` is left unused, which only produces an unused-variable lint warning.
8. **E-CLICK-FAST depends on timing.** It is race-dependent, as the header says.

INDEX.tsv (tab-separated: patch, step, step that should fail, note):
```
E-CLICK.patch	E-CLICK	E-CLICK	tap resolveCandidate uses gpuOrdinal + 1 (WorkingCanvas.tsx)
E-CLICK-FAST.patch	E-CLICK-FAST	E-CLICK-FAST	tap emits lastHoverReadoutRef pick when it is a pick; race-dependent, run at odd map height, three runs
E-SELECT.patch	E-SELECT	E-SELECT	SELECTED_OUTLINE_RGBA alpha 0 (highlightLayers.ts)
E-NODRAG-1.patch	E-NODRAG (1)	E-NODRAG	onDragEnd selects on release (WorkingCanvas.tsx)
E-NODRAG-2.patch	E-NODRAG (2)	E-NODRAG	dragPan false in select tool; also a tool-change effect since the Deck is built once
E-ZOOMSEL.patch	E-ZOOMSEL	E-ZOOMSEL	fit a point box at the union corner (App.tsx)
E-SEL-PAN.patch	E-SEL-PAN	E-SEL-PAN	selection.clear on every onViewportChanged (App.tsx)
E-SEL-FILTER.patch	E-SEL-FILTER	E-SEL-FILTER	selection.clear in commitActiveFilter (App.tsx)
E-REFUSED.patch	E-REFUSED	E-REFUSED	below-pick-resolution click returns selection.apply, id 0, zero bounds (clickEffect.ts)
E-GEN.patch	E-GEN (both halves)	E-GEN	admit keeps view on rebind and endGeneration leaves views (workspaceState.ts)
E-GEN-1.patch	E-GEN (admit half)	E-GEN	reopen notice only
E-GEN-2.patch	E-GEN (endGeneration half)	E-GEN	source change notice only
E-KINDS.patch	E-KINDS	E-KINDS	resolvePick row = gpuOrdinal (pick.ts); may throw a TypeError on the multipolygon rather than yield extra ids
E-EXPORT.patch	E-EXPORT	E-EXPORT	filterActive also true on a selection (App.tsx)
E-SCOPE.patch	E-SCOPE	E-SCOPE	scope check always ok (PublishPanel.tsx); clean target/e2e-selection-out after
E-ASK-1.patch	E-ASK (1)	E-ASK	confirmOpen returns true first (App.tsx)
E-ASK-2.patch	E-ASK (2)	E-ASK	handleAdmitted releases standing export consumers on the old resource (App.tsx)
E-ASK-STATEMENT.patch	E-ASK-STATEMENT	E-ASK-STATEMENT	statement only when cancel() answers true (App.tsx)
```

Off-scope notes: none. Scratch files are in `.../scratchpad/work/` (the generator `gen.mjs` and staging copies), outside the repository. No background process is running.

Model observed: Sonnet 5.5, no override, no context handoff.
