Reviewed: the property-testing trial form's first draft, not committed, 9515 bytes, sha256 e63afcdb651a2dad31f9661100eb9697efd78ab5b15e64155332a482ea833558, read against main at 4a301df7a7d8fbd52b1bcb5a028e8311b2226fe0 (the custodian's filing note, 2026-11-22: the trial form's architect gate, attempt 1 (ADV-2026-11-22-01 item 6); Read 20, Glob 3, Grep 14, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-22T04:37:35Z to 2026-11-22T04:54:04Z by its transcript; the report below byte for byte from its hand-back of 24439 bytes, sha256 2b84964914a67cbc960608ca1c047287afa211b59a9c89123b63414f00bfceb7; its nine quotations of the human's message checked by script, each found byte for byte), gate, architect
**Verdict: FAIL** (Evidence). Reviewed `main @ 4a301df7a7d8fbd52b1bcb5a028e8311b2226fe0`. I read that commit from `.git/refs/heads/main`. Its parent is eb47ee3366fbb0dedeb35d9ceeb8bcac2efd30f7 and it is a docs-only commit. The form is the scratch file the brief names. I took its size and sha256 (9515 B, e63afcdb…a833558) from the brief and did not recompute them: the architect has no Bash. Every path:line below is at 4a301df7 and carries no hash; the reviewer recomputes. A passage in double quotes is bytes I copied from a file. Everything else is paraphrase.

No Correctness finding: there is no code yet, and the form makes no false claim of a guarantee. Six Evidence findings block. With five of them I give replacement words. The sixth, the isolation check (E6), names a fixtures folder only the custodian can supply. The words below are mine. They are not the human's wording and they change what the test code will do, so §31(f) of `governance/AUTONOMY.md` keeps them out of the no-re-gate route. A re-gate is needed. I propose that it reads only the revised sections against this report.

---

## 1. P3 (my choice)

**P3. The shell's frame decoder returns the frames written, however their bytes are cut into chunks** (fast-check, `frontends/shell/src/streaming/wire.property.test.ts`, run by the shell's own `vitest run`). The function is `FrameDecoder.push` (`frontends/shell/src/streaming/wire.ts`). It is the production reader of the producer's frames (`startStream` in `frontends/shell/src/streaming/adapterWs.ts`).
- **Generators and bounds.** 1 to 8 frames of tag BATCH (0x10), each payload 0 to 64 arbitrary bytes. The test writes each frame's bytes itself from the layout `[u8 tag][3 reserved zero bytes][u32 big-endian payload_len][payload]`, not through `controlFrame`, so the expected result does not rest on the code under test. The concatenation (at most 576 bytes) is cut into at most 16 chunks, none empty. In a third of the runs the cuts fall only at frame boundaries, one frame per chunk, which is the shape the WebSocket adapter delivers. In the other runs a cut may fall at any byte. Each run uses one new decoder and pushes every chunk in order. 200 runs (§4).
- **The property.** (a) The frames returned by all the pushes together are the frames written, in order: each is `t: "batch"` with its payload byte for byte, no other frame is returned, and the decoder's `fault` stays null. (b) A returned frame's `contiguous` is true exactly when its bytes lie inside one pushed chunk. `stats.reassemblyCopies` equals the number of frames whose bytes do not: this is the counted copy of the decoder's own doc comment (ADR-004).
- **Outside the domain, named:** an empty chunk. Every frame the producer writes carries its 8-byte prefix, so the WebSocket adapter never pushes an empty chunk. The architect's gate reads an empty chunk left at the head of the queue as sending the next frame through the copying branch, which (b) would report. This is not tested here.
- **The deliberate breaks**, one line each. (a) The remainder of a partly taken chunk is replaced by the whole chunk: `else this.chunks[0] = c;` in place of `else this.chunks[0] = c.subarray(take);`. (b) The copy counter's increment, `this.stats.reassemblyCopies++;`, is deleted. Each must fail with a shrunk counterexample.

**Clause check against the code:**
- push: frontends/shell/src/streaming/wire.ts:76-98
- The producer reader's caller: frontends/shell/src/streaming/adapterWs.ts:38, 101
- The layout: wire.ts:7, protocol/data-plane/src/wire.rs:13
- The counted copy: wire.ts:61-63, 134
- The broken line: wire.ts:131
- `contiguous`: wire.ts:115, 121, 135
- The 16 MiB ceiling is never reached: wire.ts:71
- The producer writes only whole prefixed frames, one per message: wire.rs:46-51, 66-72; protocol/data-plane/src/adapter_ws.rs:104, 275, 292, 316

Under (b)'s oracle, the head chunk always starts at the next frame's first byte, because both take paths shift a chunk that is used up (wire.ts:118, 130). So "inside one chunk" matches `chunks[0].length >= n` (wire.ts:115).

**Why this one.** I considered five alternatives and rejected each:
- A monotonicity or cap property of `recenterThresholdForBudget` (frontends/shell/src/canvas/offsetFrame.ts:84-91). This is a formula test, the kind the human's item 3 says shows little, and it overlaps P1.
- The idempotence or event count of `OffsetFrame.maybeRecenter` (offsetFrame.ts:166-173). Its oracle restates the threshold comparison, and it overlaps P1.
- `parse_control` (adapter_ws.rs:406-420). It is private, so its test would have to live in a shipped source file, which the form's §6 blocks on sight. It also overlaps P2.
- The Rust `progress_payload` and `terminal_payload` layouts. Their oracle only re-states the layout.
- The shell's `startFrame` paired with Rust's `parse_start`. That needs two runners, so there is no single property.

The decoder property is small. Its expected result comes from the inputs alone: the frames written, and which of them straddle a cut. It covers the production reader of the producer's direction, which P2 cannot reach from Rust. It reaches a branch no current test reaches: the scripted split in frontends/shell/src/streaming/wire.test.ts:87-100 ends its frame at a chunk end, so the chunk is shifted at wire.ts:130 and the else branch at wire.ts:131 never runs. It also tests whether the ADR-004 copy counter tells the truth. It stays in `frontends/shell` with fast-check, so the draft's delta (its item 1 (c)) is unchanged.

---

## 2. P1 and P2 read against the code

### E1. P1 does not state the human's property, and its break depends on bounds the form leaves undeclared
- **Wrong function.** The form's P1 exercises `offsetPositions`. offsetFrame.ts:18 reads "**`offsetPositions`/`toF32Positions` are not on this cut's actual render path**". The shell's path is `buildLayers` → `frame.toLocal` (frontends/shell/src/canvas/buildLayers.ts:211, 262). The human's item 3 reads "Exercise the path the shell uses; a test of the threshold formula alone does not establish that the map stayed put."
- **No origin change.** The form's P1 holds a single origin. The human's property is about changing the origin with the world point and the camera held fixed.
- **Bounds not in the form.** The human's item 3 reads "Name the units, zoom/drift bounds and pixel metric." The form defers these to "the test's site".
- **Empty unit coverage.** "cover every CRS unit of `RECENTER_MAX_DRIFT`" adds no case. Every value is 131_072 (offsetFrame.ts:64-69), and offsetFrame.ts:59-62 says a swap of units cannot be detected.
- **Break depends on magnitude.** P1 as stated is true of `offsetPositions` (offsetFrame.ts:100-112, budget algebra at :84-91). But its break, narrowing before the subtraction, is invisible when the origin is near 0. It fails only at large absolute magnitudes, which the form does not require.

### E2. P2 names neither the production parser nor the writer/reader pairing; break (a) is out of reach of its generator
- **Production parser not named.** The human's item 3 reads "name the production parser and the writer/reader pair for the same message direction". The production parse path is `read_start` (protocol/data-plane/src/server.rs:641-659): `payload_len` at :647, the slice at :649-651, then `parse_start` at :652.
- **The writer has no production caller.** `start_payload` (wire.rs:98-105) is called only from tests: kernel/tests/*, protocol/data-plane/tests/* and wire.rs's own test module. The production writer of START is the shell's `startFrame` (wire.ts:36-48, called at adapterWs.ts:53).
- **The reader is in another language.** The production reader of the producer's frames is TypeScript (wire.ts:76-98).
- **Break (a) is ambiguous and mostly unreachable.** It could mean wire.rs:108 or wire.rs:113. Arbitrary bytes rarely reach the read at :113, which needs a small op length and valid UTF-8.
- **The test-module option touches shipped source.** Putting P2 in "wire.rs's test module" edits a shipped source file, against §6 "any product code".
- **Break (c) fails for the wrong reason.** "Written one short" as a plain `- 1` on the u32 at wire.rs:102 panics on an empty params in a debug build.

The rest of P2 holds against the code:
- (a) No panic on any bytes on 64-bit targets: wire.rs:74-77, 107-116, 122-132.
- (b) `frame`, `patch_len` and `payload_len` agree: wire.rs:54-77.
- (c) The round trip holds for op < 65536 bytes: the casts are at wire.rs:100, 102.

**Replacement §3 text for P1 and P2** (the custodian's words, not the human's; mine):

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

**Clause check against the code:**
- P1:
  - ppu = 2^zoom: frontends/shell/src/canvas/WorkingCanvas.tsx:607-613
  - The handler's order: WorkingCanvas.tsx:2160, 2167-2171, 2192-2196
  - The deferral note: WorkingCanvas.tsx:2134-2146
  - The first placement: offsetFrame.ts:167
  - `toLocal`: offsetFrame.ts:196-198
  - The cache is rebuilt on an origin move: buildLayers.ts:193-197
  - The batch helper and the `data` read: buildLayers.test.ts:46-61, 86-95
  - U1: frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx:182-191
  - The cap binds below z = 6, because 0.5·2^24/2^z > 2^17 exactly when z < 6.
- P1's break, on my reading:
  - At EPSG:2056 magnitudes, `Math.fround(p) − Math.fround(O)` is a multiple of 0.25 and is exactly representable in f32. It therefore errs from the exact offset by up to 0.25 m, which exceeds the budget once z ≥ 2.
  - Both frames then carry fround(p) − fround(W), so (b)'s jump is 0.
- P2:
  - wire.rs:58 (break b), :100 (u16 cast), :102 (break c), :113 (break a), :114 (64-bit sum), :122-132
  - server.rs:647-652
  - The callers of `start_payload` are tests only (grep at this head).
  - For (a): a cut payload framed with a consistent length reaches `parse_start`, whereas a cut frame stops at server.rs:649-651. The window [at, at + 3] is one of four biased windows, so the chance of missing break (a) in 256 cases is about 2e-5.

---

## 3. The form against the constitution and the rulings

**Constitution: no violations.**
- docs/01 is not touched.
- §1 forbids any performance figure (docs/08).
- P3 claims no "zero-copy" (ADR-004).
- ADR-006 does not apply.
- The seams are written against the interfaces as they are, which I read:
  - `buildLayers` (buildLayers.ts:416-445)
  - `OffsetFrame` (offsetFrame.ts:123-205)
  - the public functions of `wire` (wire.rs:46-132)
  - `FrameDecoder` (wire.ts:65-137)
  
  No `pub` item or callback is added.

**Class and gates.** A full form with both gates matches ADV-2026-11-22-01 item 6. The rulings are otherwise met:
- **Merge after the tag:** stated.
- **No dependency before approval:** stated in the Authority line and §Isolation.
- **No retry, sleep, longer timeout or skip:** stated in its own line (§4 Determinism), as ADV-2026-11-22-01 item 2 asks.
- **Scope with my words:** 8 files (see D5).

I did not recompute the draft's delta. The reviewer reads it.

### E3. Regressions (§4)
The human's item 3 reads "Preserve the seed and minimized input for an unexpected failure; once reproduced, commit the input as a fixed regression." Under §4, a proptest failure is kept only as a persisted seed. A seed replays a different input once a generator changes. Replacement §4 lines:

- **Cases:** proptest at 256 cases per property (`cases: 256` in its `ProptestConfig`, beside the pinned persistence), and fast-check at 200 runs per property (`numRuns: 200`), declared at each site. Each input's size is bounded at its generator. No property runs unbounded, and none has a time limit standing in for a bound.
- **Seeds and regressions:** a counterexample from a deliberate break is evidence, not a finding (the human's message, item 1). P2's failure persistence is pinned to `protocol/data-plane/proptest-regressions/wire_properties.txt` (`FileFailurePersistence::Direct`, resolved from the crate root, where cargo runs the test). The seed lines the breaks write there are committed and replay on every run. A failure that is not a deliberate break keeps its seed and its minimized input. Once that failure is reproduced, the minimized input is committed as a fixed regression: for P2, an explicit `#[test]` with that input beside the property; for P1 and P3, an explicit example in the property's `examples`, with the seed and path fast-check printed recorded in a comment. A committed input runs on every run, whatever later change is made to a generator.
- **Determinism:** proptest 1.12.0 and fast-check 4.10.2 (the draft's pins) are expected to print a failing run's seed: proptest's persistence line, and fast-check's seed and path. The first break run of each shows what it prints, in the report. If either prints no seed, that is a stop. No test retries, sleeps, lengthens a timeout or skips, and none is added (ADV-2026-11-22-01 item 2; this line is that statement).

### E4. Defect count missing
The human's item 3 reads "Count product defects separately from generator or test defects." Replacement first sentence of §7: "From the merge, the custodian gathers what the trial found, with product defects counted apart from generator or test defects (the human's item 3), the CI time it added (the test steps' durations before and after, from the runs' own timings), and whether shrinking and replay earned their cost against the repository's dependency-free seeded campaigns;" (the rest of the sentence is unchanged).

### E5. Pre-merge re-check missing
The human's item 0 reads "A piece gated before the tag is checked for intervening changes before its eventual merge." Item 3 reads "If the delta changes before merge, bring the difference back to me." Replacement **Merge:** line: "after the v0.2 tag, since it changes a lockfile (the human's message, item 0). Before the merge, the branch is checked for changes on main since its gates (item 0), and the lockfile delta is recomputed against main at that point and shown equal to the draft's item 3, entry by entry; a difference goes back to the human before the merge (item 3). The one-month consult counts from the merge (ADV-2026-11-22-01 item 6)."

### E6. Isolation omits the sitting's fixtures
The human's item 0 reads "verify they do not resolve to the sitting checkout's target or fixtures". ADV-2026-11-22-01 item 9 names the fixtures as well. In the parenthesis of §Isolation, replace "or into the main checkout" with "into the main checkout, or into the sitting's fixtures folder (named by path in the record)".

---

## 4. Documentation (must-fix before the commit, or before merge if committed as is)

- **D1.** §5 "line 49" is a bare line cite into a directive file. Write instead: "The paragraph of the human's message that begins "Testing while writing the code" goes as written into the worker's brief (ADV-2026-11-22-01 item 10)."
- **D2.** The tool-behaviour claims in §4 name no version (round 15 (c)). The §4 words above name both versions.
- **D3.** "First amendment" is booked twice: once for P3 (§3) and once for the isolation record (§Isolation). The form is not yet a record. I recommend folding all the words in this report into the text before its first commit and recomputing its hash; the isolation record then stays Amendment 1. If these exact bytes are committed instead, Amendment 1 carries P3 and these supersessions, and the isolation record moves to Amendment 2.
- **D4.** The human's item 3 reads "Show each property failing by name on a deliberate break, then revert it and show green." In §5, write "each with its breaks shown red by name in the report, then reverted and the property shown green (no break is ever committed), and its regressions".
- **D5.** In §6, replace the Scope list with: `protocol/data-plane/Cargo.toml`, `Cargo.lock`, `frontends/shell/package.json`, `frontends/shell/package-lock.json`, `frontends/shell/src/canvas/recentreBudget.property.test.ts` (new, P1), `protocol/data-plane/tests/wire_properties.rs` (new, P2), `protocol/data-plane/proptest-regressions/wire_properties.txt` (new, P2's pinned persistence), `frontends/shell/src/streaming/wire.property.test.ts` (new, P3). That is 8 files.

---

## 5. Notes

- **N1 (for the human).** I read the human's re-centre sentence as covering both the per-frame error and the jump. The bound proved over the declared domain is the budget plus 0.00025 px, not the budget strictly, so P1 declares a 0.001 px slack. The strict reading holds at integer zoom, where T is a power of two. It is not proved at fractional zoom. This is the human's sentence to rule on.
- **N2.** Outside P1's domain: a zoom change inside a deferred drag or transition. The frame drawn before the re-centre is then bounded only by the old zoom's T. This is already disclosed as not measured (WorkingCanvas.tsx:2142-2143) and is a candidate for a later property.
- **N3.** `operation.len() as u16` (wire.rs:100) and `setUint16` (wire.ts:43) wrap past 65535 bytes. Ordinary use cannot reach this, because the operation is a constant (adapterWs.ts:53). P2's bounds stay below it.
- **N4.** wire.rs:114's `at + 4 + params_len` can overflow in a 32-bit debug build. P2 (a) is claimed for 64-bit targets only.
- **N5.** Under the WebSocket adapter, each push is one whole frame. P3's spanning cases test the decoder's declared contract (wire.ts:61-63), not a path today's transport is shown to take. The runs cut only at frame boundaries cover the shape production delivers.
- **N6.** My estimate for the three properties and their regressions is about 350 to 400 changed lines, against a budget of 400. The custodian may raise the line now rather than record an overrun later.
- **N7.** I can neither run nor read proptest 1.12.0. That `Direct` resolves from the crate root and creates its folder is my reading. The first break run shows it, or it is a stop (the §4 words above).

No ADR is needed: no decision is missing.
