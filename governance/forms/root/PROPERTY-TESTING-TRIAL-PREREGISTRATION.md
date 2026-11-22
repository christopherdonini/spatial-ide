# The property-testing trial: proptest and fast-check as dev-dependencies only, three properties with bounded cases, each shown failing on a deliberate break, unexpected failures kept as fixed regressions (full form)

- **Path (proposed):** `governance/forms/root/PROPERTY-TESTING-TRIAL-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `property-testing-trial-proptest-and-fast-check` (records 1122d, eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7).
  - The human's message of 2026-11-22, items 0 and 3 (`state/directives/2026-11-22-the-humans-message-the-idle-time-work-flaky-tests-are-findings-the-cancel-node-subagent-compaction-guardian-and-monitor-a-property-testing-trial.md`).
  - The advisor's ruling ADV-2026-11-22-01 items 2, 6, 8, 9 and 10, under the human's delegation of 2026-11-13 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-01-the-pieces-of-the-humans-message-placed-the-two-drafts-filed-on-main-before-their-ids.md`).
  - The dependencies and their pins: the advisor's draft ADV-2026-11-22-03 (`state/consults/2026-11-22-advisor-draft-adv-2026-11-22-03-the-property-testing-trials-two-dev-dependencies-and-their-pins-not-the-humans-words.md`). **It is not yet approved.** Until the human types approved and its id, no dependency enters any branch, and nothing of sections 2 to 5 is built. This form and its architect's gate go on now (ADV-2026-11-22-01 item 6).
  - The architect's gate of 2026-11-22 on this form's first draft, FAIL, filed at `state/consults/gates/2026-11-22-property-testing-trial-form-gate-architect.md`. Its replacement words are folded in here before the form's first commit, as its D3 recommends, each byte for byte from the report: P1, P2 and P3 in section 3, and the second sentence before P3; the three lines of section 4; section 7's first sentence up to its semicolon; the Merge line; the isolation check's last clause (its E6); section 5's first sentence and its clause on the breaks (its D1 and D4); section 6's Scope list (its D5); and the third sentence of the question for the advisor (its re-gate's C1). They are the architect's words, not the human's. The rest is the custodian's, section 7's sentence after its semicolon included.
  - The architect's re-gate of 2026-11-22, FAIL on its C1 and DR1 alone, filed at `state/consults/gates/2026-11-22-property-testing-trial-form-gate-architect-attempt-2.md`. Its words for both are applied here with no further gate, the two sentences being the custodian's wording (AUTONOMY.md §31, item 2 (d)); every finding of the first gate is closed by its own reading.
- **Committed before any code.** Append-only once committed.
- **Form and gating:** full form, both gates, the reviewer and the architect (ADV-2026-11-22-01 item 6): it adds dependencies, which is what CI installs, and one property reads the data-plane wire format. The architect re-gates this revision, reading only the revised sections against its report.
- **Merge:** after the v0.2 tag, since it changes a lockfile (the human's message, item 0). Before the merge, the branch is checked for changes on main since its gates (item 0), and the lockfile delta is recomputed against main at that point and shown equal to the draft's item 3, entry by entry; a difference goes back to the human before the merge (item 3). The one-month consult counts from the merge (ADV-2026-11-22-01 item 6).
- **Reuse index:** no prior art recorded for property based testing proptest or fast-check property testing (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian on 2026-11-22). Nothing is ported.
- **For the advisor's ruling before the build (the gate's N1, corrected by its re-gate's C1):** P1 declares a slack of 0.001 px beyond RECENTER_BUDGET_PX. The bound the architect derives over the declared domain is the budget plus about 0.00025 px. The strict bound is not proved at any zoom, integer or fractional: at an integer zoom of 6 or more, where T is a power of two, one axis's f32 rounding alone can come to the budget, and the other axis's rounding (the metric is Euclidean) and, in (b), the second frame's rounding add to it. Whether that reading of the human's re-centre sentence stands is the advisor's to rule.

## Isolation: the piece's first record (ADV-2026-11-22-01 item 9)

No worktree or build output exists yet: none is made before the human's approval, since the first build step adds a dependency. At dispatch, the worktree is `C:/dev/wt/property-trial` on branch `cut/property-testing-trial`, with `CARGO_TARGET_DIR` on `D:/wt-targets/property-trial`, and its own `npm ci` in its own `frontends/shell` and `renderer/bundle-viewer`. The custodian runs the same isolation check as for the cancel and 2 (a) pieces (it reads the main checkout's two target junctions, and fails if the worktree or its build folder resolves into either, into the main checkout, or into the sitting's fixtures folder (named by path in the record)) and records its output in this form's first amendment, before the worker starts.

## §1. What the trial may and may not claim

- **May claim:** for each property, that it held over the declared number of generated cases at a named commit, and that it failed by name on each named deliberate break, with the shrunk counterexample shown, and passed again once the break was reverted. That the committed regressions run every time.
- **May not claim:** that a property proves the code correct; any performance figure; any CI time before the month's consult measures it from the runs' own timings.
- **Not in scope:** Save and Reopen (the human decides after the consult whether to extend the trial to it); any product code change. If a property finds a real defect, the defect is recorded as a finding with its counterexample and goes to the advisor; this piece does not fix product code.

## §2. The dependencies, exactly as the approved draft states them

Only what ADV-2026-11-22-03 holds, once approved: proptest in `protocol/data-plane/Cargo.toml` under `[dev-dependencies]`, and fast-check in `frontends/shell/package.json` under `devDependencies`, at the draft's exact pins and features, with the lockfile changes the draft lists and no others. After adding them, the worker shows the lockfile delta equal to the draft's item 3, entry by entry. A difference is a stop: it goes back to the human before anything else (the draft's item 1 (c)). If a pinned version does not compile with the pinned toolchain or TypeScript, it is a stop, and the toolchain is not changed for it (the draft's item 2 (d)).

## §3. The three properties

**P1. Changing the frame origin keeps the drawn map within the pixel budget, on the shell's own frame path** (fast-check, `frontends/shell/src/canvas/recentreBudget.property.test.ts`, run by the shell's own `vitest run`). The functions are the ones the view-state handler and the layer builder call, in the handler's order (`frontends/shell/src/canvas/WorkingCanvas.tsx`: its `setThreshold`, `maybeRecenter` and `toLocal` calls). They are a real `OffsetFrame` and `recenterThresholdForBudget` (`frontends/shell/src/canvas/offsetFrame.ts`), and `buildLayers` (`frontends/shell/src/canvas/buildLayers.ts`), whose vertex coordinates come from `frame.toLocal`. `offsetPositions` is not used: its own doc comment says it is not on the render path.
- **Generators and bounds.**
  - Unit and origin: `metre` or `degree`, with the origin O in that unit's domain. For metre, x is in [2_400_000, 2_900_000] and y in [1_000_000, 1_400_000] (an EPSG:2056 box). For degree, x is in [-180, 180] and y in [-90, 90]. `other` and `unestablished` select the same cap, 131_072, as both, so they add no case.
  - Zoom: z in [-8, 16]. In the shell, one unit is 2^z CSS px. The cap binds below z = 6 and the budget at or above it.
  - Camera: the camera's world point W is held fixed at a drift from O of T + 1/2^z to T + 2000/2^z, where T = `recenterThresholdForBudget(2 ** z, RECENTER_BUDGET_PX, RECENTER_MAX_DRIFT[unit])`. That is, W is past the bound by 1 to 2000 CSS px, one gesture at a fixed zoom.
  - Vertices: 1 to 16 vertices inside a 1920 × 1080 CSS-px viewport centred on W, as one-vertex parts of one point batch built the way `buildLayers.test.ts` builds its batches.
  - 200 runs (§4).
- **Steps.** `frame.setThreshold(T)`. `frame.maybeRecenter(O)` places the frame for the first time. Then the layers L1 = `buildLayers(…, frame, …)` and the camera target t1 = `frame.toLocal(W)`. Then `frame.maybeRecenter(W)`, which must return true and move the origin to W. Then the layers L2 and t2 = `frame.toLocal(W)`.
- **Pixel metric.** In each frame, a vertex p's drawn position is (`Math.fround` of p's local coordinate in that frame's layer `data` − that frame's camera target) × 2^z, in CSS px. `Math.fround` stands for deck's f32 attribute store. It is a model: deck's own attribute and viewport arithmetic is not run. The exact position is (p − W) × 2^z, which the test computes from p and W alone, not through `toLocal`.
- **The property.** For every vertex, with distances Euclidean in CSS px: (a) in each of the two frames, the drawn position is within RECENTER_BUDGET_PX + 0.001 px of the exact position; (b) the change of origin moves the drawn position by at most RECENTER_BUDGET_PX + 0.001 px. The 0.001 px is a declared bound on the rounding slack beyond the budget. It is derived as follows. A vertex's local offset is at most T plus the gesture plus half the viewport's diagonal, and an f32 store errs by at most 2^-24 of the magnitude it stores. Over these bounds that gives a slack of at most 2^-24 × (2000 + 2 × 1102) px, about 0.00025 px, plus f64 rounding below 0.000001 px.
- **Outside the domain, named:**
  - A drift reached inside a drag longer than 2000 CSS px or inside a transition.
  - A zoom change inside a deferred drag or transition.
  
  In both cases the frame may be past the bound. The handler's own note on the deferred re-centre says this is not measured. The handler's composition (world = target + origin, then the rebased target) is reproduced in the test in the handler's order. `WorkingCanvas.recentre.test.tsx` U1 is the test of the real handler's world point across the change.
- **The deliberate break:** `OffsetFrame.toLocal` narrows before its subtraction: `return [Math.fround(x) - Math.fround(this.x), Math.fround(y) - Math.fround(this.y)];`. This is the order the file's ADR-010 rule 3 note forbids. (b) alone cannot see it, because both frames then lose the same precision. (a) must fail with a shrunk counterexample.

**P2. The data-plane wire format: no panic on bounded bytes, and round trip** (proptest, `protocol/data-plane/tests/wire_properties.rs`, an integration test that calls only `wire`'s public functions, so no shipped source file changes).
- **What is paired.**
  - The production parser is the producer's START read, `read_start` in `protocol/data-plane/src/server.rs`: `payload_len`, then the payload slice, then `parse_start`. `read_start` is private and reads a socket, so the test applies the same three steps to bytes.
  - `frame` is the producer's writer.
  - `start_payload` mirrors the shell's `startFrame` (`frontends/shell/src/streaming/wire.ts`), which is the START frame's production writer. `start_payload` has no production caller of its own.
  - The production reader of the producer's frames is the shell's `FrameDecoder`, which P3 covers. No property here pairs a Rust writer with a TypeScript reader.
- **Config:** 256 cases, with the failure persistence pinned as §4 states.
- (a) **Inputs.** Two kinds:
  - any byte string of 0 to 256 bytes;
  - any valid START payload (`start_payload(op, params)`, bounds as in (c)) cut to any length or with any one byte replaced, then framed by `frame(TAG_START, …)`.
  
  Half of the cuts fall within 3 bytes after the start of one of the payload's fields (the op length, the op, the params length, the params), so the parser's later reads are reached. **Claim.** On these inputs, the three steps of `read_start`, `parse_start` alone, `payload_len` alone and `looks_like_json` all return without panicking, on the 64-bit targets the CI builds.
- (b) For any tag and any payload of 0 to 1024 bytes, `frame(tag, payload)` is 8 bytes longer than the payload, starts with the tag and three zero bytes, has `payload_len` equal to the payload's length, and ends with the payload byte for byte.
- (c) Take any operation name of 0 to 16 chars (at most 64 bytes, far below the u16 to which `start_payload` casts the name's length) and any params of 0 to 64 bytes. The three steps of `read_start`, applied to `frame(TAG_START, &start_payload(op, params))`, return exactly `(op, params)`.
- **The deliberate breaks**, one line each:
  - (a) `parse_start`'s params-length read becomes an unchecked slice, `payload[at..at + 4]`.
  - (b) `patch_len` writes the length one long: `out.len() - FRAME_PREFIX_LEN + 1`.
  - (c) `start_payload` writes the params length one short: `(params.len() as u32).saturating_sub(1)`. An empty params then passes, and any other fails for the intended reason.
  
  Each must fail with a shrunk counterexample.

P3 is the architect's choice, named before coding (the human's item 3). It stays in `frontends/shell` with fast-check, so the draft's delta (its item 1 (c)) is unchanged.

**P3. The shell's frame decoder returns the frames written, however their bytes are cut into chunks** (fast-check, `frontends/shell/src/streaming/wire.property.test.ts`, run by the shell's own `vitest run`). The function is `FrameDecoder.push` (`frontends/shell/src/streaming/wire.ts`). It is the production reader of the producer's frames (`startStream` in `frontends/shell/src/streaming/adapterWs.ts`).
- **Generators and bounds.** 1 to 8 frames of tag BATCH (0x10), each payload 0 to 64 arbitrary bytes. The test writes each frame's bytes itself from the layout `[u8 tag][3 reserved zero bytes][u32 big-endian payload_len][payload]`, not through `controlFrame`, so the expected result does not rest on the code under test. The concatenation (at most 576 bytes) is cut into at most 16 chunks, none empty. In a third of the runs the cuts fall only at frame boundaries, one frame per chunk, which is the shape the WebSocket adapter delivers. In the other runs a cut may fall at any byte. Each run uses one new decoder and pushes every chunk in order. 200 runs (§4).
- **The property.** (a) The frames returned by all the pushes together are the frames written, in order: each is `t: "batch"` with its payload byte for byte, no other frame is returned, and the decoder's `fault` stays null. (b) A returned frame's `contiguous` is true exactly when its bytes lie inside one pushed chunk. `stats.reassemblyCopies` equals the number of frames whose bytes do not: this is the counted copy of the decoder's own doc comment (ADR-004).
- **Outside the domain, named:** an empty chunk. Every frame the producer writes carries its 8-byte prefix, so the WebSocket adapter never pushes an empty chunk. The architect's gate reads an empty chunk left at the head of the queue as sending the next frame through the copying branch, which (b) would report. This is not tested here.
- **The deliberate breaks**, one line each. (a) The remainder of a partly taken chunk is replaced by the whole chunk: `else this.chunks[0] = c;` in place of `else this.chunks[0] = c.subarray(take);`. (b) The copy counter's increment, `this.stats.reassemblyCopies++;`, is deleted. Each must fail with a shrunk counterexample.

## §4. Bounds, seeds and regressions

- **Cases:** proptest at 256 cases per property (`cases: 256` in its `ProptestConfig`, beside the pinned persistence), and fast-check at 200 runs per property (`numRuns: 200`), declared at each site. Each input's size is bounded at its generator. No property runs unbounded, and none has a time limit standing in for a bound.
- **Seeds and regressions:** a counterexample from a deliberate break is evidence, not a finding (the human's message, item 1). P2's failure persistence is pinned to `protocol/data-plane/proptest-regressions/wire_properties.txt` (`FileFailurePersistence::Direct`, resolved from the crate root, where cargo runs the test). The seed lines the breaks write there are committed and replay on every run. A failure that is not a deliberate break keeps its seed and its minimized input. Once that failure is reproduced, the minimized input is committed as a fixed regression: for P2, an explicit `#[test]` with that input beside the property; for P1 and P3, an explicit example in the property's `examples`, with the seed and path fast-check printed recorded in a comment. A committed input runs on every run, whatever later change is made to a generator.
- **Determinism:** proptest 1.12.0 and fast-check 4.10.2 (the draft's pins) are expected to print a failing run's seed: proptest's persistence line, and fast-check's seed and path. The first break run of each shows what it prints, in the report. If either prints no seed, that is a stop. No test retries, sleeps, lengthens a timeout or skips, and none is added (ADV-2026-11-22-01 item 2; this line is that statement).

## §5. Tests while writing, and the commits

The paragraph of the human's message that begins "Testing while writing the code" goes as written into the worker's brief (ADV-2026-11-22-01 item 10). The commits, in order: D, the two dependency lines and the lockfile changes alone, with the delta shown equal to the draft's; then one commit per property, each with its breaks shown red by name in the report, then reverted and the property shown green (no break is ever committed), and its regressions; then one commit recording the CI timings of the test steps at the branch's first green run, for the consult.

## §6. Scope and size

- **Scope (8 files):** `protocol/data-plane/Cargo.toml`, `Cargo.lock`, `frontends/shell/package.json`, `frontends/shell/package-lock.json`, `frontends/shell/src/canvas/recentreBudget.property.test.ts` (new, P1), `protocol/data-plane/tests/wire_properties.rs` (new, P2), `protocol/data-plane/proptest-regressions/wire_properties.txt` (new, P2's pinned persistence), `frontends/shell/src/streaming/wire.property.test.ts` (new, P3).
- **Line budget:** at most 500 changed lines excluding the two lockfiles, whose changes must equal the draft's delta; this form excluded. (The architect estimates 350 to 400 for the three properties and their regressions, its N6.)
- **Block on sight:** any other manifest or lockfile line; the src-tauri lockfile changed; any shipped source file or other product code; any workflow file; a retry, sleep, longer timeout or skip; a property without its breaks shown red by name and reverted.

## §7. The consult after one month

From the merge, the custodian gathers what the trial found, with product defects counted apart from generator or test defects (the human's item 3), the CI time it added (the test steps' durations before and after, from the runs' own timings), and whether shrinking and replay earned their cost against the repository's dependency-free seeded campaigns; the consult goes to the human by way of the advisor (the delegation of 2026-11-13, item 1), and the human decides on extending it to Save and Reopen (the human's item 3).

## §8. Gates

- **Architect (now, on this form):** the first draft's gate is FAIL (above); its re-gate reads only the revised sections against its report.
- **Reviewer (after the build):** the diff; the lockfile delta against the draft; each break observed red by name and reverted; the regressions committed and run.
- **Architect (after the build):** the properties as built against section 3.

## Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-22 — the advisor's ruling ADV-2026-11-22-08 on P1's slack, before any code

The advisor ruled the question this form put to it, under the delegation of 2026-11-13. The ruling is filed at `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-08-the-trials-p1-asserts-the-budget-plus-0-001-px-and-the-difference-is-a-finding.md`. This amendment records it in the custodian's words; the ruling's file governs.

1. **P1 is not the human's re-centre sentence as written.** The human's sentence (their message of 2026-11-22, item 3) asks that the map stay within RECENTER_BUDGET_PX. P1 asserts the budget plus 0.001 px. The reason is in the re-gate's C1. The threshold is solved for an offset of magnitude T. A vertex's offset exceeds T, by the drift past the bound and by its own distance from the camera, so its f32 rounding can exceed the budget in the same proportion. A strict test would fail by design. Loosening it after a red run is what the human's item 1 forbids, so the bound is declared here, before any code. The reading stands.
2. **The re-gate's constructed case becomes a fixed example.** The worker runs the case in the re-gate's C1 (z = 6, with its O, W and p) through P1's own steps, and records the measured distance in the build's record. The case is committed in P1's test file as a fixed case asserting the same property, with one comment line that gives the measured distance and says the strict budget is exceeded there. If the measured distance is not above RECENTER_BUDGET_PX, or is above it by more than 0.00025 px, the derivation is wrong. That is a stop, to the advisor.
3. **The finding, counted apart.** In the declared domain the drawn error is bounded by the budget plus about 0.00025 px, not by the budget. In the two cases section 3 names outside the domain, this piece does not bound it. The doc comment of `recenterThresholdForBudget` (`frontends/shell/src/canvas/offsetFrame.ts`) says the threshold is the largest drift still inside the budget, which leaves out the vertex's own distance. This is a product finding reached by derivation, before any generated case. It is counted apart from generator and test defects (the human's item 3) and graded minor. No product code changes in this piece. A node for it is proposed after the sitting.
4. The build's two gates read P1, the fixed case and this amendment together.

Read the last amendment first.

Nothing above is edited.
