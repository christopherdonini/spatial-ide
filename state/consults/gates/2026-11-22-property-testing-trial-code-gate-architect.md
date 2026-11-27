Reviewed: cut/property-testing-trial at 8fd35b28573d33f0b56455264c948a4f72f1e1f9 (the custodian's filing note, 2026-11-22: PR 353's code gate under its full form, the architect, its first code-gate attempt, section 8's last bullet; Read 13, Grep 7, SubagentHandback 1, by unique call ids, no call errored, model claude-opus-5-5, from 2026-11-22T12:24:32Z to 2026-11-22T12:28:33Z by its transcript; no call named the main checkout; no compaction; the report below byte for byte from its hand-back of 8931 bytes, sha256 5be070be0b14f235d10d8e3ff6fb4503319965c55d2d5673b1f574c4d9cbd306, nothing masked, with this note in its first line and one final newline), gate, architect
Verdict: PASS WITH NOTES, PR #353 @ 8fd35b28573d33f0b56455264c948a4f72f1e1f9

Branch `cut/property-testing-trial` @ 8fd35b28573d33f0b56455264c948a4f72f1e1f9 (merge base 90bdeab78ea3dadd238d5dfe428e50b0df3840c6). I read the worktree at that head. I have no shell, so I ran nothing and recomputed no hash, and I did not check the diff's paths or line count myself: the reviewer runs those. The worker's reports (`<S>/ptr-report-1.md`, `<S>/ptr-report-2.md`) are used as evidence only.

AUTONOMY §22 mapping: Correctness, none. Evidence, none. Documentation, one finding (D1), which must be fixed before the merge.

## 1. Each property against §3

**P1** (`frontends/shell/src/canvas/recentreBudget.property.test.ts`)
- Units and boxes match §3: metre x in [2.4e6, 2.9e6] and y in [1.0e6, 1.4e6]; degree ±180 / ±90 (:115-126).
- z is in [-8, 16], integer or fractional (:128).
- The drift is T + pastBoundPx/2^z with pastBoundPx in [1, 2000], at any angle (:136-147).
- There are 1 to 16 vertices inside the ±960 × ±540 px viewport around W (:138-153).
- Each vertex is a one-vertex part of one point batch, built through `partsOfFeatures` the same way `buildLayers.test.ts:30` and `residentSet.test.ts:20` build theirs.
- `layer.props.data` comes from `pointsForBatch`, which is `frame.toLocal` per vertex (`buildLayers.ts:261-263`). Its cache is keyed on the origin, so L2 is rebuilt after the move.
- The metric is `Math.fround(local) − target`, times 2^z (:69-71). The exact position is (p − W)·2^z from p and W alone (:96). Distances use `Math.hypot`. (a) and (b) are both asserted against BOUND_PX (:110-112).
- 200 runs (:170).
- **This test does other than §3 says, in one sentence: D1.**
  - The form says: "The handler's composition (world = target + origin, then the rebased target) is reproduced in the test in the handler's order." (form §3, P1, "Outside the domain").
  - The test passes the generated W to `maybeRecenter` and `toLocal` instead (:85-89).
  - The real handler forms `worldX = vs.target[0] + originXBeforeRecenter` (`WorkingCanvas.tsx:2170-2171`) and then calls `maybeRecenter(worldX, worldY)` and `toLocal(worldX, worldY)` (:2192-2195).
  - The test follows §3's own Steps line ("Then `frame.maybeRecenter(W)`"), so §3 contradicts itself. The worker's choice is the one that lets break (a) reach (a). With break (a) in place, t1 + O is fround(W) − fround(O) + O, so the drift can fall to T and the "origin moves" check fails first. That is the test defect recorded in report 1.
  - With the shipped `toLocal` (`offsetFrame.ts:196-198`), t1 + O differs from W by f64 rounding only. So what the property proves about the shipped build is unchanged. This is a record finding, not Correctness.

**P2** (`protocol/data-plane/tests/wire_properties.rs`)
- `read_start_steps` (:35-39) does the same three steps as `read_start` (`server.rs:647-653`). `read_start`'s tag check only narrows its input, so applying the steps to any bytes covers more.
- (a), first kind: 0..=256 bytes (:97).
- (a), second kind: op of 0..=16 chars and params of 0..=64 bytes, cut or with one byte replaced, then framed (:104-112).
  - `prop_oneof!` gives equal weight to CutAnywhere, CutNearField and Replace. So half of the cuts are near a field, as §3 says.
  - The field starts [0, 2, 2+op, 6+op] are right (:81).
  - `Replace` uses `% payload.len()`, and len ≥ 6, so the test itself cannot panic.
- `read_everything` covers the four reads §3 names (:42-47).
- (b) and (c) assert exactly §3's clauses (:116-137).
- 256 cases, with persistence `Direct` (:24-31).
- Matches §3.

**P3** (`frontends/shell/src/streaming/wire.property.test.ts`)
- 1 to 8 BATCH frames, each payload 0 to 64 bytes. The prefix is written by the test (:24-35), not by `controlFrame`.
- At most 16 non-empty chunks: unique cuts in [1, total − 1], `maxLength: 15` (:55).
- Weights 1 : 2 give the frame-boundary-only third (:54-55).
- One decoder per run (:64).
- (a) checks the frame kinds, the bytes and `fault` (:68-73).
- The (b) oracle is "no cut strictly inside (start, end)" (:79). That is exactly the condition under which `take` (`wire.ts:114-121`) returns `contiguous: true`. The copy count equals the number of non-contiguous frames (:87).
- Break (a)'s anchor is the one on `wire.ts:131`, not the one on :119.
- 200 runs (:92).
- Matches §3.

## 2. P1 against Amendment 1 (ADV-2026-11-22-08)
- `BOUND_PX = RECENTER_BUDGET_PX + 0.001` (:34-35) is what all three expects assert.
- The fixed case (:157-166) is the re-gate C1's z, O, W and p, byte for byte (`state/consults/gates/2026-11-22-property-testing-trial-form-gate-architect-attempt-2.md`, its C1 list). It is asserted through the same `holds` (:174).
- The comment line (:159) gives the measured distance and says the strict budget is exceeded.
- My derivation agrees:
  - local x = 131072.0078125 is the midpoint of the 1/64 m grid, which rounds to even, giving a 0.5 px error;
  - y = 0.3 gives about 7.6e-7 px;
  - the hypot is 0.5 + about 5.8e-13.
  - This matches the reported 0.5000000000005775 px and lies inside the (0.5, 0.50025] window.
- A separate `it` instead of `examples` is sound: Amendment 1 item 2 says "fixed case", and an example would pre-empt the shrink on the break.
- Note N1 (optional): the fixed case does not assert `frame1 > RECENTER_BUDGET_PX`. The comment's "exceeded" rests on the record, not on the test.
- The slack in the doc comment (:25-29): per axis, the f32 error is at most 2^-24·|l|, and Euclidean over two axes still gives at most 2^-24·|l|. So frame 1 is within budget + 2^-24·(2000 + 1101.5) px, and the jump is within budget + 2^-24·(2000 + 2·1101.5) px, about 0.00025 px. The limit is supported.

## 3. §1
- No test claims correctness, a performance figure or a CI time. The test names say "over 200 generated cases". P2 says "the claim is only that none of them panics" (:41). The 64-bit qualifier is at :14.

## 4. §4
- The cases and runs are declared at each site: P1 :170, P3 :92, P2 :26.
- Every size is bounded at its generator.
- Persistence is pinned at :27-29. The committed file holds one `cc` line, from P2's break (a) (`proptest-regressions/wire_properties.txt:7`). It replays green (report 1).
- Breaks (b) and (c) failed on that replayed seed and showed shrunk inputs. There was no new line to save, so this is consistent with §4 and §1.
- I found no retry, sleep, timeout argument, `.skip` or fixed seed in the three files.

## 5. Constitution
- The change is test-only, with no product code (docs/01; §1 "Not in scope").
- There is no perf claim (docs/08).
- The ADR-004 wording is "counted copies" / "counted reassembly copies" (P3 :75, :87). There is no "zero-copy".
- Nothing new is exported: the test files have no exports, and the Rust test has no `pub`. The seams are read against their real interfaces: `buildLayers` "point" (`buildLayers.ts:495-505`), `ResolvedDrawParams` (:52-60), `read_start` (`server.rs:641-659`) and `FrameDecoder` (`wire.ts:65-137`).
- ADR-006 does not apply.

## Documentation finding (must fix before the merge)

**D1.** The form is append-only, so there is no old text to replace: the fix is a new item appended in the closing amendment. The wording is the custodian's, not the human's (§31: apply with no re-gate, and list it in the PR body). New words:

> P1 passes the generated W to `frame.maybeRecenter` and `frame.toLocal`, as section 3's Steps say. It does not form world = t1 + origin, so section 3's sentence that the handler's composition is reproduced in the test does not hold of the test as built (`frontends/shell/src/canvas/recentreBudget.property.test.ts`, the comment above the second `setThreshold`). With break (a) in place, t1 + origin differs from W by the f32 rounding of W and of the origin, so the drift can fall to the bound and the check that the origin moves fails before (a) is reached. With the shipped `toLocal`, t1 + origin differs from W by f64 rounding only. `WorkingCanvas.recentre.test.tsx` U1 stays the test of the real handler's world point across the change.

Clause check:
- The first two sentences are true of :85-89 against `WorkingCanvas.tsx:2170-2171`.
- The third: under the break, `toLocal` returns fround(x) − fround(origin) (form §3, break), so t1 + O − W = (fround(W) − W) − (fround(O) − O). The margin can be as small as 1/2^z (the 1 px floor at :136), which is below f32 rounding at these magnitudes, and the check is the expect at :89.
- The fourth: `offsetFrame.ts:197` computes `x - this.x` in f64.
- The fifth: U1 exists at `WorkingCanvas.recentre.test.tsx:182`.

## Notes
- N1: see section 2 (optional; any code change after this gate needs the reviewer's narrow read).
- N2: in the degree unit at low zoom, W lies far outside CRS84 (drift ≥ 131072°). §3 does not bound W, so this is not a departure. It means those cases exercise the arithmetic, not reachable states.

No ADR is needed.
