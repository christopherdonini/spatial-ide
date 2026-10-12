*Custodian's filing note (2026-10-07): `geometry-lines-cut`'s build worker (worker-high) report for phase B, stage 1 (commits 4 and 5 with light checks only), at the branch head e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 63b39d93da65d4ab119fba4f5ff30a7b9fa816b13f29f19f29d20de27150dc05. Run window from the transcript: 2026-10-07T18:34:08Z to 2026-10-07T18:52:23Z. The custodian re-checked the branch head, the two commits, the files they change, and §7's total by its command (3,561 lines over 52 files). Stage 2, the heavy suites, follows once slot 2's heavy runs have ended, and its report is filed as report 3. Paths and lines below are at the branch head, not main.*

---

REPORT: node:geometry-lines-cut@g3, phase B, stage 1. Commits 4 and 5 are done and pushed as ordinary updates. The worktree C:/dev/wt/lines is clean at e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40, which equals origin/cut/geometry-lines-cut. No force, rebase, merge or PR action. Stage 2 has not started.

**Commits**
1. ba648a9a `feat: lines cut, shell (V-L, SH-L1 to SH-L7), the viewer's V-T-L and the E2E step LN'`
2. e89bf9bf `docs: lines cut, KNOWN-LIMITATIONS 31 to 33 and 37, 38, the owner's indexes, Part T and Part P's dated note`

**V-L: all five points hold, so I-2 does not apply.** Installed `@deck.gl/layers` and `@deck.gl/core` are both 9.3.9, equal to the lock (`frontends/shell/package-lock.json:476-477`). Files are under `frontends/shell/node_modules/@deck.gl/`, in `src/*.ts` with `dist/*.js` beside them.
1. **Picking colour is the datum index.** `layers/src/path-layer/path-layer.ts`, `PathLayer.initializeState`, lines 200-205. The `instancePickingColors` accessor calls `this.encodePickingColor(object && object.__source ? object.__source.index : index, value)`. `index` is the datum index from `core/src/lib/attribute/attribute.ts` (loop at 498-502, `objectInfo.index++`), expanded per vertex by `startIndices` (`path-layer.ts` 245-246).
2. **One datum is one path.** `layers/src/path-layer/path-tesselator.ts`, `PathTesselator.getGeometrySize`: a non-cut path gives one run, and `isCut` is `Array.isArray(path[0])` (line 194). `core/src/utils/tesselator.ts`, `Tesselator.updateGeometry` (188-252), builds `vertexStarts` per datum. `layers/src/path-layer/path.ts`, `normalizePath` (20-47), flattens `[x,y]` pairs to one flat path. The OrthographicView viewport has no `resolution`, since it is only an optional field at `core/src/viewports/viewport.ts:160`, so there is no grid cut.
3. **`widthUnits`, `jointRounded`, `capRounded` exist.** `path-layer.ts` has `widthUnits` at line 33 (default `'meters'` at 101), `jointRounded` at 53 (default false) and `capRounded` at 58. They reach the shader as `jointType`, `capType` and `widthUnits: UNIT[widthUnits]` (306-309). `UNIT.pixels = 2` is at `core/src/lib/constants.ts:89-93`.
4. **`Deck.pickingRadius` is applied to hover picking.** `core/src/lib/deck.ts`: prop at 118, default 0 at 252. `_onPointerMove` sets `_pickRequest.radius = this.props.pickingRadius` (1276). `_pickAndCallback` passes `radius: _pickRequest.radius` (1297). `_getPointPickOptions` defaults to `this.props.pickingRadius` (858). Click picking uses it at 1617.
5. **`pickObject` takes its own radius, default 0, and returns the closest object within it.** `core/src/lib/deck.ts:703-716`, doc "Radius of tolerance in pixels. Default `0`". `core/src/lib/deck-picker.ts`, `_pickClosestObject` has `radius = 0` (382), `deviceRadius = Math.round(radius * pixelRatio)` (416, CSS pixels). `core/src/lib/picking/query-object.ts`, `getClosestObject` (29-80), keeps the pixel with the smallest squared distance within `deviceRadius`.

**What was built (commit 4)**
- **decodeBatch.ts**
  - `ENCODING_LINESTRING` and `ENCODING_MULTILINESTRING`.
  - `GeometryKind` gains `line`, and `geometryKindOf` maps both line encodings to it.
  - The decode branch is keyed on the encoding string. A linestring row is one part holding one path; a multilinestring row is one part per linestring.
  - `UnexpectedEncodingError` names five encodings.
  - The doc of `ResidentBatch` states the line shape.
- **buildLayers.ts**
  - `LINE_WIDTH_PX = 2`, a `pathsForBatch` cache (batch identity plus origin, with `frame.toLocal` in f64), a `"line"` overload and a `LineLayer` type.
  - A line batch gives one pickable `PathLayer` (id `layerId`, `widthUnits` pixels, colour `fillColor`, rounded joints and caps, CARTESIAN).
  - When `outlineWidth > 0`, a non-pickable `${layerId}-casing` layer goes first. Its width is `LINE_WIDTH_PX + 2 × outlineWidth`, its colour `outlineColor`, and it shares the line's data.
  - `checkPickCeiling(batch.partCount)` stays before the kind branch.
- **pickResolution.ts** gains `LINE_PICK_RADIUS_PX = 4` and `pickingRadiusFor(kind)`. The doc of `pickResolutionExtentFor` names lines.
- **WorkingCanvas.tsx**
  - `Deck`'s construction spreads `pickingRadius` only when it is defined.
  - The settle re-pick passes `radius` to `pickObject` only when it is defined, and its comment no longer says the radius is unchanged.
  - Polygonal and point opens leave both unset.
- **limits.ts** (the `PickCeilingExceeded` text, the ceiling docs and SH-L7's unmeasured-cost paragraph) and `PICKING.md` name lines.
- **Tests and E2E:** `testUtils/batchFixtures.ts` (`lineL1Positions`, `multilinestringMl1Positions`, ported from `engine/src/fixture.rs` in the same operation order), the tests below, the viewer test `partition-line-encoding.test.mjs`, and the E2E step LN'.
- **Commit 5** is the docs commit, described under the deviations list.

**Mutations table.** Each was applied by hand, the test run alone, the failure recorded, and the file restored from a backup and checked with `cmp`. No `verify-mutation` run was used. Each test's comment carries the same text.

| row | test | mutation | failing assertion | observed over | reverted |
|---|---|---|---|---|---|
| SH-2 (changed) | `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)` | delete the encoding check (the `throw` becomes `void 0`) | first assertion: `expected function to throw an error, but it didn't` (multipolygon batch under a polygon expectation) | 26d4ccc0, uncommitted tree of the shell commit | yes |
| SH-L0 | `geometryKindOf maps both line encodings to line and the others as before (SH-L0)` | map `geoarrow.multilinestring` to polygonal | `expect(geometryKindOf(ENCODING_MULTILINESTRING)).toBe("line")`: `expected 'polygonal' to be 'line'` | same | yes |
| SH-L1 | `the engine's line batches decode to one path per part, partToRow, partCount and totalVertices, bits unchanged (SH-L1)` | walk a linestring row as a ring list (line branch disabled) | `expect(l1.parts[k][0]).toHaveLength(1)`: `expected [ …(2) ] to have a length of 1 but got 2` | same | yes |
| SH-L2 | `a line batch gives one pickable PathLayer with the pixel width, colour and rounding, no SolidPolygonLayer, a casing first only with an outline, and the ceiling counted in partCount (SH-L2)` | build `SolidPolygonLayer` for lines (line branch not taken) | `expect(layer).toBeInstanceOf(PathLayer)`: `expected SolidPolygonLayer{ …(6) } to be an instance of PathLayer` | same | yes |
| SH-L2c | `a line batch's data is reference-stable at an unchanged origin and recomputed after a recenter (SH-L2c, the cache rule)` | delete the cache hit in `pathsForBatch` | `expect(second).toBe(first)`: `Object.is equality`, "serializes to the same string" | same | yes |
| SH-L3 | `an ordinal on a line part resolves that part's row, and two parts of one feature resolve identically (SH-L3)` | index `ids` by the ordinal in `resolvePick` | `expect(onRow1!.id).toBe(1n)`: `expected 2n to be 1n` | same | yes |
| SH-L4 | `selects the average feature extent for a line open and gives the radius for a line open only` | `pickingRadiusFor` returns the radius for polygonal (line check becomes "not a point") | `expect(pickingRadiusFor("polygonal")).toBeUndefined()`: `expected 4 to be undefined` | same | yes |
| V-T-L | two tests: `the engine's linestring batch, offered as a partition, is refused at the encoding check` and `the engine's multilinestring batch, ...` | delete the `geometry_encoding` check in `decodePartition` | linestring test: `e.state` is `partition-decode-failed`, expected `envelope-encoding-mismatch`. Multilinestring test: `Missing expected exception` (it is walked as polygon rings and decoded, the hazard the check exists for). | same | yes |

- The E2E step LN' is operator-run and has no mutation.
- SH-2 fails only at its first assertion under that mutation, as it was recorded.
- The mutations were observed while the files I had edited with a script still had CRLF. I then normalised them to LF, which `.gitattributes` requires, before committing. The behaviour is the same.

**Light checks, with exit codes**
- `npx tsc --noEmit` in `frontends/shell`: rc 0, run after each code stage and again at the final head.
- `npx vitest run <file>`, each rc 0:
  - `decodeBatch.test.ts`: 12 passed.
  - `buildLayers.test.ts`: 27 passed.
  - `pick.test.ts`: 13 passed.
  - `pickResolution.test.ts`: 53 passed.
  - The four together: 105 passed.
- `node --test scripts/partition-line-encoding.test.mjs` in `renderer/bundle-viewer`: rc 0, 2 passed.
- `node --check e2e/regression.mjs`: rc 0.
- My own pointer script over both owner's indexes (a text check, not a test run): rc 0, 135 pointers and paths checked, none missing. Index sections are 34 lines (engine) and 39 lines (kernel).

**Deviations from the form, for the custodian to class**
1. **Class 2 (proposed): the casing is drawn with rounded joints and caps.** SH-L2 says rounded only for the line. I made the casing match, so a square-capped casing does not show corners beside a round-capped line.
2. **Class 2 (proposed): one line added to `regression.mjs`'s fixture-existence list** (`["line L-1", FIXTURE_LINE_L1]`), beside the LN' step, so a missing `line-l1.parquet` fails early. MP' and PT' are not edited.
3. **Decode doc.** The form and your brief say `decodeBatch.ts`'s doc "still says `skp/0.10` for the point value", as a stale statement. I checked `protocol/skp/SKP-V0.md`, which has `skp/0.10` as the entry that gave `geoarrow.point` as the third value, so for the point value `skp/0.10` is correct. What was stale was "three encodings". The doc now says five, the third from `skp/0.10` and the fourth and fifth from `skp/0.11`. If you read the stale part differently, tell me.
4. **Part T's T6(c) is hedged.** `declared-linestring.parquet` is written with no covering, so a canvas viewport query may meet `engine.no_covering_bbox` before the engine reaches row 0 and `engine.wkb`, as P5 shows for another file without a covering. T6(c) says so and asks for the code shown. The generator's code is not edited, as the form says.
5. **Engine/kernel README `Last verified at` is `ba648a9a`**, the head of commit 4, because commit 5 cannot name its own hash.
6. **Stage-1 allowance, slightly exceeded.** Besides the new and changed files and each mutation, I ran six existing single vitest files once each, as a regression check: `noCoordinateLeak`, `WorkingCanvas`, `limits`, `extent`, `residentSet` and `tileIngest`. All passed within seconds. I filtered their output, so I cannot rule out that one spawned cargo, but none ran long.
7. **Class 8 stays as phase A recorded it.** §7 is not edited and nothing new overruns. At head e89bf9bf, by `git diff --numstat 6f4cc949 HEAD -- . ':!engine/GEOMETRY-LINES-PREREGISTRATION.md'` grouped as the §7 table groups them:
   - engine product: 1,220 against 950 (over, phase A's)
   - engine tests: 960 against 900 (over, phase A's)
   - kernel: 307 against 420
   - protocol: 221 against 260
   - shell product: 242 against 400
   - shell tests and seams: 513, plus 8 lines in `admission/admitDataset.test.ts` (phase A's TS literal test, which my grouping script did not match to a group), so 521 against 600
   - docs: 90 against 220
   - total: 3,561 lines over 52 files, against 3,750 over 66
   - Stage 2 recomputes this with the command itself.

**Pre-gate self-check (the four classes)**
- **Cross-module use.** The decode uses the engine's actual shape (`engine/src/geoarrow.rs` `linestring_storage_type` and `multilinestring_storage_type`, lines 271-282). Its tests consume the engine's own BF-L and BF-ML files. The anchor in `resolvePick` is the first part's first vertex, which for a line is the path's first vertex.
- **Completion claims.** Every claim points to a named test or to the files read for V-L.
- **User-facing text.** Every new string is a `[P6 placeholder]`, and each describes behaviour implemented in these commits.
- **Reaching the intended assertion.** Each mutation fails at an assertion the test is about, not at its setup. The exception is SH-2, which fails at its first assertion (recorded above).

**Caller grep (product callers)**
- `pickingRadiusFor` is called at `WorkingCanvas.tsx` lines 1189 (settle re-pick) and 1906 (`Deck` construction).
- `LINE_WIDTH_PX` is used at `buildLayers.ts` lines 408 and 423.
- `LINE_PICK_RADIUS_PX` is used by `pickingRadiusFor`.
- `ENCODING_LINESTRING` and `ENCODING_MULTILINESTRING` are used by `geometryKindOf` and the decode.
- `LineLayer` is the return type of the new overload.

**Heavy or possibly heavy commands: none.**
- No cargo of any kind, no full `npm test`, no `src-tauri` tests, no viewer full suite, no node scripts suite, no `verify.mjs` or cite scripts, and no hold taken. I did not read the machine script's log.
- Other commands: single-file vitest, `tsc`, `node --test` on the one viewer file, `node --check`, git commands, and two small node and python scripts of mine.
- Commit and publish were each their own call, with messages written to files first.

**Noticed and not done**
- `frontends/shell/src/canvas/pick.ts` is outside §7's file list. Its docs still say "polygon part" and "exterior ring's first vertex", which is a little stale for lines. Its code is unchanged, as the form says.
- `WorkingCanvas.tsx` comments still say "deck 9.3.7" in places, while the lock resolves 9.3.9.
- T6(c) and the `declared-linestring` generator's missing covering: see deviation 4.
- In the shell, stage 2's `npm test` may print the "Blocking waiting for file lock" lines phase A saw. A test spawns cargo, which is why it belongs under a hold.
- I left the worktree's `node_modules` as `npm ci` made it. My scratch files are in the session scratchpad under `lines2/`.

**Stage 2 plan, waiting for your message:** the workspace cargo test with §6's four instruments, `cargo fmt`, clippy, the `src-tauri` tests, `npm test` plus `tsc`, the viewer's full suite, the node scripts suite, the four verify scripts, and §7's count per group, each held and with its exit code.

**Model:** Sonnet 5.5, `claude-sonnet-5-5`, as the harness reports it. No override. No context handoff received or produced; this run started from the brief and the worktree at 26d4ccc0.
