Reviewed: PR #312 at 9826c1c9129f0d243e57ae9bea84534e09b33656 (base bb8835c6), the single gate, reviewer, attempt 1 (the custodian's filing note, 2026-11-13: PLAN node known-limitations-first-look-partial-view, the docs lane; below, the hand-back byte-identical but for one profile path, the session scratch folder at the hand-back's line 111, written as <the custodian's scratchpad>; one final newline added)
Gate: known-limitations-first-look-partial-view at 9826c1c9129f0d243e57ae9bea84534e09b33656, reviewer
Reviewed: cut/known-limitations-first-look-partial-view @ 9826c1c9129f0d243e57ae9bea84534e09b33656 (base main bb8835c6701826f38030c51a095a8f83e7a3c52a)
VERDICT: FAIL. The only blocking finding is the wording of one clause in the custodian's source comment, and it takes the §31 path: the code is untouched and its Correctness and Evidence are closed, so the worker applies my words with no re-gate. Every mechanical check passes: diff, words, number, §B, all eight pins, and the three repository checks.

## Findings

### Correctness (blocking, wording only, §31)

**C1. A clause in the source comment is untrue at the head, in two cases ordinary use can reach.** The comment (the custodian's words, not the human's) reads, byte-copied from the added line 3: `(the residency status is not set until a plan has run)`. It is pinned to `residencyStatus.ts:330-336` and `candidateArmSession.ts:839-845`. Those lines do gate the *within-budget* claims on `hasPlanned`. Two other emit paths set the status with no plan:

- **(a) The first look's rows pass the render budget.** No grid frame exists during the first look, so any overflow is over budget. `frontends/shell/src/canvas/tileIngest.ts` at the head:
  ```
  139:   const projected = tileSet.totalResidentVertices + batch.totalVertices;
  140:   if (projected > maxResidentVertices) {
  164:     } else {
  165:       // No frame yet to order eviction by -- nothing evictable is identified, so this degrades
  166:       // straight to "truncate at budget" rather than ever exceeding the declared ceiling.
  167:       overBudget = true;
  ```
  The budget is `frontends/shell/src/canvas/limits.ts:72` `export const MAX_RESIDENT_VERTICES = 2_000_000;` (passed at `WorkingCanvas.tsx:1724`). The untiled batch then reaches `candidateArmSession.ts:1160` `manager.setOverBudget(true, ...)` and `:1199` `emitResidencyStatus();`. The over-budget branch runs before any settled check:
  ```
  729:     if (overBudget) {
  751:       deps.onResidencyStatusChange?.({
  752:         kind: "candidate-over-budget",
  ```
  That event sets a status (`residencyStatus.ts:187`), and `App.tsx:2418-2423` renders it as `residencyStatus.ts:468`'s `Showing ${status.residentFeatureCount} features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail.` Reaching this takes only 10,000 rows averaging more than 200 vertices each, for example detailed boundary polygons. That is ordinary use.
- **(b) The operator presses Cancel during the first look.** `App.tsx:2205` `session.relinquishFill();` leads to `candidateArmSession.ts:1829` `emitResidencyRelinquished();`. That function emits `kind: "candidate-relinquished"` (`:873-877`) with no plan check (`:1783` sets `hasPlanned = false;`). The status line then shows `relinquishedUntiledStillRunningText` (`residencyStatus.ts:447`), and after the first look's terminal it shows `relinquishedText` (`:439`, re-emitted at `candidateArmSession.ts:1437-1439`). The comment's "Not covered" names only Apply and Clear.

**§31 replacement words.** This is not the human's wording, so the worker applies them with no re-gate and the PR body lists them. Replace the comment's clause `(the residency status is not set until a plan has run)` with:

`(the residency status is not set before a plan has run, unless the first look's rows pass the render budget or the operator presses Cancel)`

Clause check against the head:
- "not set before a plan has run": holds for the within-budget emits. `residencyStatus.ts:331-333` (`input.hasPlanned && ...` / `if (!isSettled) return "not-settled";`) and `candidateArmSession.ts:839-845` (`return; // mid-fill or a re-plan is pending -- absence is honest`) prove it.
- "unless the first look's rows pass the render budget": `tileIngest.ts:164-168`, `candidateArmSession.ts:1153-1160`, `:1199` and `:729-759`, as above.
- "or the operator presses Cancel": `App.tsx:2205`, `candidateArmSession.ts:1829` and `:869-877`.

Disclosure: the brief says "Change no word, and propose none". My definition's §31 paragraph requires words when the only blocking findings are words. I followed §31 and leave the conflict to the caller. Whether to apply the words is the custodian's or the human's decision, not mine.

### Evidence
None.

### Documentation (must fix before the merge)
None. On the human's item, my reading follows in check 6 (item clause 3). I do not count it as a finding.

## Checks

**1. The diff** (`kflg-c1.out`)
- numstat: `3	0	KNOWN-LIMITATIONS.md`, the only file. The three-dot name-status agrees, and the merge-base is the base.
- One commit: `9826c1c9129f0d243e57ae9bea84534e09b33656 bb8835c6701826f38030c51a095a8f83e7a3c52a docs: KNOWN-LIMITATIONS item 64, the open's first look partial and unsaid, in the human's words`.
- Byte sizes: base 157687 bytes (508 lines), head 160146 bytes (511 lines). `cmp` shows the head begins with the base's exact bytes. The tail is 3 lines, 2459 bytes: a blank line, the item, and the comment.
- CR 0, TAB 0, final byte `0a`.
- sha256: base `6d9bb731…` (sic, full in the file), head `e592b80a3c3d0431fd9a1704ad79b7b79528bad063efee4b59b7e90fa240aa4c`, added tail `5d0acb757a6ad04dc6e5f31236190797cedbad1e5b04ba302850d1434dbe4a91`.
- The form's Scope also names PLAN.yaml (2 files). The PR does not touch it. The brief expects KNOWN-LIMITATIONS alone, so I record this as a disclosure only. At the base the node is `status: blocked`.
- The form: sha256 `03314a997b0602156e72cf9183e68f466997182242c8e7b3389657e000e48dd0`, matching the brief. Directive line 15 is `9ba7e478…b9a8` and line 35 is `55eda56a…c4a8`; the consult's lines 81-87 are `040745ec…265f`. All three are equal at a747986103f8 and at the base, and all match the form's Authority line.

**2. The words** (`kflg-c23.out`)
- Line 15 holds exactly 2 `"` marks. The text between them is 153 bytes, sha256 `3a301c9ce8f0c600a8dda0768ac105b94dde4a60f61d41424b0237c6d2cc8cb5`.
- The text inside the item's `**…**` is 153 bytes with the same sha256, and `cmp` shows the two match byte for byte.
- The line's shape is `^64\. \*\*[^*]+\*\*$` (1 match) and it has no body line.

**3. The number**
- The highest `^\d+\. ` number at the base is 63, on line 506, the last item, under `## On main since v0.1.0 — not in any release yet` (line 225, the last heading).
- Numbers absent from 1-63 at the base: 43, 48, 49, 50. There are no duplicates, and no mention of `item 64` at the base.
- The head's highest is 64, and the comment says `next after item 63`.

**4. The comment against §B** (`kflg-c4.out`)
- The line starts with four spaces then `<!-- `.
- I stripped the indent and replaced each of the 8 `path:a-b @ bb8835c6… sha256:<64hex>` pins in order with `<P1>`…`<P8>`, and `item 63` with `item <N-1>`. `cmp` against the form's §B text block (1 line, 1007 bytes, sha256 `549e5bb047c5930aa94d41e84d0475a3b2d40df438e858c044d35b554f7be139`) is equal.

**5. The pins** (`kflg-c5.out`, against 6cfea93be992018afe020306a1122730f4375f86)
Each pin's revision is the base. For every pin, the pin's hash, the hash I recomputed at the base and §C's hash are equal, and the 6cfea93b content is found exactly once at the base.

| Pin | Range at the base | Range at 6cfea93b | sha256 |
|---|---|---|---|
| P1 | WorkingCanvas.tsx 1426-1436 | 1424-1434 | 4e950f29… |
| P2 | candidateArmSession.ts 68-79 | 68-79 | e7e4aa82… |
| P3 | WorkingCanvas.tsx 1595-1610 | 1593-1608 | db124d8e… |
| P4 | tileGridConstants.ts 185 | 185 | 61c4f5a8… |
| P5 | stream.rs 1718-1725 | 1718-1725 | 15d970a4… |
| P6 | residencyStatus.ts 330-336 | 330-336 | 3d84bc8c… |
| P7 | candidateArmSession.ts 839-845 | 839-845 | 57c9a2f7… |
| P8 | App.tsx 2418-2423 | 2418-2423 | 1cb373bc… |

Full hashes are in the output file. The head changes no code, so the head equals the base at every pin. P1 and P3 sit 2 lines lower than at 6cfea93b, as the form states.

**6. The clauses** (`kflg-c6a.out` to `kflg-c6t.out`, read at the head)
- **P1 "the open's fit moves the camera and reports no viewport": holds.** The open's fit calls `fitToExtent(residentExtentRef.current, false)`: `:1568` in the baseline arm, `:1782` in the candidate arm, which is the default (`residencyArm.ts:50` `export const DEFAULT_RESIDENCY_ARM: ResidencyArm = "candidate";`). The `else` branch at `:1431-1436` makes no `reportViewport` call: `lastQueriedRef.current = null; // a write that does not report leaves no area "last asked for"`, then `onViewShownRef.current?.(...)`. A resize with `lastQueriedRef` null also reports nothing (`:2083-2088`).
- **P2 "tile planning starts at the first viewport report, a real pan or zoom": holds in code, with one timing case.** P2 pins prose (the module's doc comment), not code. The code agrees: `:1625-1630` `onViewportChanged` → debounce → `handleViewportChange`, and `:1492` `hasPlanned = true;` runs only after `outcome.kind === "planned"`.
  - Named case (§31: timing inside one request's stream, non-blocking; to be named in the source comment): a pan made before the first look's stream ends plans nothing. `tileViewportStreamManager.ts:518` `if (frame === null) return { kind: "no-frame" };` applies because the frame is set only at the untiled terminal (`candidateArmSession.ts:1408-1410`). The first look then stays until the next pan or zoom.
- **P3 "Zoom to layer reports one": holds.** `App.tsx:2086` `onZoomToLayer={() => void canvasRef.current?.fitToBounds()}` reaches `WorkingCanvas.tsx:1609` `fitToExtent(bbox, true);`, then `:1430` `reportViewport(...)`.
- **P4 "the untiled first look's row limit, 10,000": holds.** `tileGridConstants.ts:185` `export const UNTILED_FIRST_LOOK_ROW_LIMIT = 10_000;`, used at `candidateArmSession.ts:1283` `viewportQuery(dataset, bbox, null, encodeDecU64(BigInt(UNTILED_FIRST_LOOK_ROW_LIMIT)), filter, deps.columns)`.
- **P5 "no filter and no order": holds for a fresh open.**
  - The open issues `App.tsx:1738` `session.reissueUnrestricted(null, activeFilterRef.current)`, and the open's reset writes `App.tsx:258` `setters.setActiveFilter(null);`.
  - The viewport stream uses `stream.rs:929` `ordering: RowOrdering::Unordered,` and `:1487` `RowOrdering::Unordered => String::new(),`, so `:1722-1725` appends only `LIMIT`.
- **P6/P7 "the residency status is not set until a plan has run": untrue in two reachable cases.** See C1.
- **P8 "the status line shows the residency status only when it is set": holds.** `App.tsx:2420` `{residencyStatus && (`.
- **The item, clause 1 "until the first pan or zoom": holds**, with P2's named timing case.
- **The item, clause 2 "at most the first 10,000 rows the file returns": holds** (P4 and P5). The over-budget case (C1 a) shows fewer, which "at most" still covers.
- **The item, clause 3 "the status line says nothing about it": holds on its words.** I read every `residencyStatusText` variant (`residencyStatus.ts:450-480`), and none names a row limit or the first look. For the human, a reading, not a finding: in C1's two cases the status line is not silent. Over budget it shows the render-budget sentence quoted in C1, which also says "farthest", though no frame orders anything during the first look. After a Cancel it shows the Cancel text. An operator reading "says nothing" may expect an empty status line. The item is the human's wording, so I propose no words for it. If the human wants the cases recorded, the comment's "Not covered" is the place.

**7. The repository's checks at the head**, from a detached checkout at C:/dev/wt/kflg (created, then removed with rc=0, gone from the worktree list). The checkout was clean throughout.
- `node scripts/plan/verify-cites.mjs` rc=0: `verify:cites PASS — every rooted (in-tree) path:line reference across 2926 file(s) resolves. (192 loose reference(s) advised above.)` None of the advisories concern KNOWN-LIMITATIONS.
- `node scripts/plan/verify-quotes.mjs` rc=0: `verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 925 ruling cites resolved, 0 ruling-cite errors.` No KNOWN-LIMITATIONS lines.
- `node scripts/plan/verify.mjs --offline` rc=0: `verify:plan PASS — C:\dev\wt\kflg\governance\PLAN.yaml agrees with the repository.`

## Not named by the brief, disclosed
- **No Write tool.** This harness has no Write tool. I ran every check as an inline Bash command (no heredoc), each output redirected to a `kflg-` file in `<S>`, with rc printed.
- **Slow and backgrounded runs.** verify-quotes took about 13 minutes, because another worktree's build was running on the machine at the time. The harness moved the check-7 command and two wait loops (`timeout`/`tail`, `tasklist`) to the background, and I waited for their notifications.
- **Read-only calls.** I also ran `git rev-parse`, `git fetch -q origin`, `git merge-base`, `ps`/`tasklist`/`wmic` (process waits), and `gh pr view 312`. The PR head equals 9826c1c9 and it is still a draft.
- **Output files**, all in <the custodian's scratchpad>/:
  - kflg-c1.out, kflg-c23.out, kflg-c4.out, kflg-c5.out
  - kflg-c6a.out to kflg-c6t.out
  - kflg-verify-cites.out, kflg-verify-quotes.out, kflg-verify-offline.out
  - kflg-pr.out, kflg-plan.out

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
