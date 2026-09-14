# Preregistration — entry 88 as a labelled state: the hover readout's "confirming…" marker

*Drafted 2026-09-14 by the worker on the custodian's piece `node:hover-confirming-marker@g1`, on `shell/hover-confirming-marker` off `origin/main`, and committed BEFORE any code of this piece exists. Extends entry 47's settle re-pick (`HOVER-REPICK-PREREGISTRATION.md`) and answers `POLISH-87-88-89-PREREGISTRATION.md` §3, which named this shape (a) and made it conditional on exactly the ruling quoted below.*

**Committed before any code exists.** Every design decision, test, gate, non-goal and falsifier below is fixed by this commit. An amendment made after any implementation or felt result has been seen **must say so in its first line**. Append-only once committed — amendments are dated additions, never edits (the convention `RESIDENCY-PREREGISTRATION.md` sets and `HOVER-REPICK-PREREGISTRATION.md` follows). The Results section at the end is this piece's own mutation record, appended after the tests run and labelled as such.

## §0. Disclosure

No pilot, no spike, no measurement informs this document. Every `file:line` is a read of `origin/main` (`0da8168`) on 2026-09-14. The wording of the marker is a **placeholder pending the human's live sight at the sitting** (the ruling's own last sentence); the state is ruled now and is what this piece builds.

## §1. What this document may not claim

No timing figure, no `docs/08` row, no p50/p95, no cadence presented as a latency bound (ADR-018 `:82-88`'s class-(a) discipline only; ADR-018's own vocabulary is not borrowed). No ADR reopened, amended or cited as settled; ADR-011 is not cited. No wire, SKP, MCP or `viewport_query` change. No new constant with a time or distance in it. ADR-006 class 1 (ephemeral) throughout: nothing durable is written.

## §2. The authority, verbatim

**RULED 2026-09-14, question set B, B1 (`DECISIONS-PENDING.md:26`), the human's typed words:**

> "Reopen as a labelled state. Between a camera change and its settle re-pick, the standing id stays visible with a plain, muted marker — "id 6430 · confirming…" — never the bare id. The marker is removed only by a re-pick result: if the re-pick confirms, the marker drops; if it finds a different feature, the readout changes to it; if it finds none or below-threshold, the readout becomes the refusal or clears. A stale id is never served without its marker (ADR-010 rule 5), and the marker never outlives a settle. Tests: the labelled state cannot render without the marker; only a re-pick result removes it. Wording sighted live at the sitting; the state itself is ruled now."

**The same day's B3 (`DECISIONS-PENDING.md:28`), the two inputs this piece must keep exactly as built:**

> "(1) Default stays pan+zoom as built, behind the declared HOVER_REPICK_ON_PAN switch … (2) Keep: a resize or DPR change disarms the pending re-pick."

## §3. The design, fixed before code

**M1 — The state machine.** A standing **confirmed id** (a `PickResult`) meets a camera change → the mid-gesture decision (`reevaluateStandingHoverOnCameraChange`, D2) returns the **labelled state** instead of today's `null`: the same id, carried inside a distinct readout variant, rendered with the marker. Further camera changes inside the same burst leave it standing (no redundant re-emit) **unless** the new camera is below the declared pick-resolution threshold, in which case the named refusal replaces it exactly as today. At settle, the re-pick's **result** is what removes it, in the three ruled outcomes: **confirms** → the same id, now bare (the marker drops); **a different feature** → that id, bare; **none or below-threshold** → the refusal (below threshold) or a clear (nothing resolved). A standing refusal is untouched by this piece: it does not blink today and gains no marker.

**M2 — The labelled state is a TYPE, not a class name.** `PickConfirming` is a new variant of `HoverReadout` (`canvas/pick.ts`) that carries the standing `PickResult` in a `standing` field and **has no `id` of its own**, so no renderer can reach the id without naming the variant first: the bare-id render path stops compiling on it (`npm run typecheck`). Construction goes through one exported constructor; the readout is rendered by one extracted view component (`canvas/HoverReadoutView.tsx`) whose confirming branch emits the id text and the marker element **together, in one return**. The marker is its **own muted element** beside the id (`.hover-readout-confirming-marker`), never concatenated into the id string, and the container carries its own class (`.hover-readout-confirming`) so a reader can tell the two states apart structurally as well as visually.

**M3 — The marker text, PLACEHOLDER pending the sitting.** The line reads `id <n> · confirming…` — the id exactly as the confirmed state renders it (anchor included when the pick carried one, unchanged), then the marker element ` · confirming…`. Declared as the ruling's own example wording, to be sighted live; a re-worded marker is a one-line change to one exported constant, no test edit owed beyond its own text assertion.

**M4 — The disarm case, PRE-COMMITTED here: the readout CLEARS.** When a settle arrives that will run no re-pick — the framebuffer changed under it (B3 (2), D4), the pointer is off canvas, the capture was invalidated at a release edge (D11), or nothing was armed — a standing labelled state is **cleared** (`null` emitted), not left standing. Reason, in the ruling's own words: *"the marker never outlives a settle"*, and no re-pick result will ever arrive to remove it. The same rule applies at the two sites where a settle is **cancelled outright** rather than allowed to fire — a camera change under a held pointer button, and the `pointerdown` edge itself (D11) — because those, too, guarantee that no re-pick result is coming. One exported pure helper decides it at all three sites. A confirmed id or a standing refusal is untouched by the rule: nothing is emitted for them, exactly as today.

**M5 — Nothing else moves.** `HOVER_REPICK_ON_PAN` keeps its value and its switch; the resize/DPR disarm keeps its refusal-to-act shape; the settle cadence, the emission choke point (`emitHoverReadout`), the threshold comparison, the pick path and the trace stay as built. Under the switch's zoom-only value a pure pan marks and then clears at its own settle (M4), which is louder than today's immediate clear — declared here as the accepted cost of one rule holding at every path, not discovered later.

## §4. Declared invariants

1. **A stale id is never served without its marker** (ADR-010 rule 5, `:68`): the only readout that carries an id across a camera change is `PickConfirming`, and its one render path emits the marker element in the same return.
2. **The marker never outlives a settle:** every settle, and every path that cancels one, either replaces the labelled state with a re-pick result or clears it.
3. **The bare id is never shown during the window** between a camera change and its settle: the bare-id render path takes a `PickResult`, and the labelled state is not one.
4. **Only a re-pick result removes the marker** (the ruling): repeated camera changes, mid-gesture re-evaluations and re-renders leave it standing.

## §5. What changes where

`src/canvas/pick.ts` (the variant, its guard, its constructor) · `src/canvas/pickResolution.ts` (the mid-gesture decision's new return; the at-settle decision takes the standing readout; the M4 helper) · `src/canvas/WorkingCanvas.tsx` (the standing readout supplied to the settle seam; the two cancel sites; the trace label's new branch) · `src/canvas/HoverReadoutView.tsx` (**new** — the readout markup extracted verbatim from `App.tsx`, plus the confirming branch) · `src/App.tsx` (the two inline branches replaced by the component, same slot, same classes, same text) · `src/styles.css` (the muted marker rule) · tests (§6). **No ADR text changes proposed. No E2E file is edited by this piece** (§7).

## §6. Pre-committed tests (one mutation each, recorded in Results)

**Render-level (`canvas/HoverReadoutView.test.tsx`, real React DOM, the `OriginMismatchState.test.tsx` pattern):**
1. *the labelled state cannot render without the marker* — every confirming readout rendered (with and without an anchor) shows the id **and** a `.hover-readout-confirming-marker` element carrying the declared text; the confirmed and refusal states render byte-identically to today and carry no marker.
2. *the bare id is never rendered for a labelled state* — a type-level assertion (`@ts-expect-error`) that the labelled state has no `id` of its own and cannot be passed where a confirmed `PickResult` is required.

**Unit (`canvas/pickResolution.test.ts`):**
3. *a camera change over a standing id produces the labelled state, never a bare id or a clear*.
4. *only a re-pick result removes it* — N further camera changes above the threshold leave the labelled state standing (`undefined`, no re-emit); below the threshold the named refusal replaces it.
5. *confirm drops the marker and keeps the id* — the settle decision with the same id returns that bare `PickResult`.
6. *a different feature replaces the readout* — the settle decision returns the new id, and not the standing one.
7. *none or below-threshold becomes the refusal or clears* — below threshold → the refusal whatever the pick returned; nothing resolved → `null`.
8. *the disarm case: a settle that runs no re-pick clears a standing labelled state* — the M4 helper and the settle decision, for each of the four no-re-pick conditions; a standing confirmed id or refusal still emits nothing.

**Seam (`canvas/WorkingCanvas.test.ts`, fake timers, the existing `repickHarness`):**
9. *a resize or DPR change between capture and settle clears the standing labelled state and still runs no pick* (B3 (2) kept: no pick, and now no stranded marker).

## §7. Declared non-goals

No new gesture, no new event source, no re-arm on ingest, no timing constant and no change to `HOVER_REPICK_SETTLE_MS` · no perf figure of any kind · no change to `HOVER_REPICK_ON_PAN`'s value or to the disarm's refusal-to-act shape · no wording change to the refusal sentence or the id readout · no ADR reopened · no E2E/harness run and no E2E edit by this piece — `POLISH-87-88-89-PREREGISTRATION.md` §3.3's K6 (ii) contract change ("a marked stale readout is not a confirmed readout") stays owed to whoever holds the harness, and this piece's `.hover-readout-confirming` container class is the structural hook it needs.

## §8. Gates

**Reviewer** — the full diff; the readout markup's extraction from `App.tsx` asserted unchanged for the two existing states; the new variant handled at every consumer; decisions pure and unit-tested. **Architect** — **ADR-010 rule 5** (`:68`) above all: a stale id is signalled, never silently served, and the signal cannot be bypassed by a render path; rule 2 (`:33`) unchanged (an id still only ever comes from a fresh GPU-ordinal resolution — the labelled state re-shows the id the operator was **already** shown, and claims nothing about the new camera); rule 6 (`:70`) for the declared marker and its placeholder standing; docs/01 principles 7 and 8.

## §9. Falsification

The piece is wrong if any of these is observed: a bare id rendered between a camera change and its settle; a marker still standing after a settle, a cancelled settle, or a disarm; the marker rendered without its id or the id without its marker; a labelled state removed by anything other than a re-pick result; K6's own discriminator (a re-pick that must find a *different* feature) no longer failing on a retained id.

## §10. What is NOT decided here

1. **The marker's final wording** — the human sights it live (§2's last sentence); §3 M3's text is the ruling's own example, held as a placeholder.
2. **The K6 (ii) E2E contract change** — preregistered in `POLISH-87-88-89-PREREGISTRATION.md` §3.3, not built or run here (§7).
3. **`HOVER_REPICK_ON_PAN`'s value** — ruled (B3 (1)) and kept as built; the sitting's flip rule is the human's.
4. **Whether the labelled state should be suppressed under the zoom-only switch value** — M5 declares the marked-then-cleared behaviour instead; unbuilt alternatives are not attempted here.

---

## Results (appended 2026-09-14, AFTER the code and the runs; records facts, decides nothing)

**Suites, in this worktree's `frontends/shell`.** `npm test` (its `pretest` build ran): `Test Files 67 passed (67)` · `Tests 977 passed (977)`, exit **0**. `npm run typecheck` (`tsc --noEmit`), exit **0**. No E2E and no harness run by this piece (§7); `HOVER_REPICK_SETTLE_MS`, `HOVER_REPICK_ON_PAN` and every timing figure are untouched.

**Mutation record — one per new test, applied, observed to fail BY NAME, reverted.** Each line: the mutation · the named test that failed · other named tests that also failed under it.

1. §6 (1) — the marker `<span>` deleted from `HoverReadoutView.tsx`'s confirming branch · *"the labelled state cannot render without the marker"* · no others.
2. §6 (2) — `PickConfirming` given an `id` field and `confirmingReadout` made to copy the standing id into it · *"the bare id is never rendered for a labelled state -- the type carries no id of its own"* · plus `tsc` itself: `src/canvas/HoverReadoutView.test.tsx(96,5): error TS2578: Unused '@ts-expect-error' directive.` — the type-level half.
3. §6 (3) — the mid-gesture decision returns `standing` (the bare id) instead of the labelled state · *"a camera change over a standing id produces the labelled state, never a bare id or a clear"* · also *"(b) standing feature id + zoom stays above the threshold …"*.
4. §6 (4) — the mid-gesture decision returns `null` for a standing labelled state instead of `undefined` · *"only a re-pick result removes it"* · no others.
5. §6 (5) — the at-settle decision returns the standing labelled state instead of the pick outcome · *"confirm drops the marker and keeps the id"* · also (6) and (7).
6. §6 (6) — the at-settle decision returns the STANDING id (`standing.standing`) instead of the pick outcome, the retained-id defect · *"a different feature replaces the readout"* · also (7).
7. §6 (7) — the at-settle decision returns `pickOutcome ?? standing`, so a re-pick that resolved nothing leaves the marker up · *"none or below-threshold becomes the refusal or clears"* · no others.
8. §6 (8) — `clearLabelledStateWithoutRepick` returns `undefined` for a labelled state too · *"the disarm case: a settle that runs no re-pick clears a standing labelled state"* · also (9).
9. §6 (9) — the settle seam's no-re-pick branch drops its `emit` · *"a resize or DPR change between capture and settle clears the standing labelled state and still runs no pick"* · no others.

**Recorded beside this piece: entry 89's held half** (DECISIONS-PENDING question set B, B2 — the threshold sighted at 9 px), preregistered not here but in `POLISH-87-88-89-PREREGISTRATION.md` §4.2/§4.4 and built on this branch as its own commit. Its two mutations, same discipline: the constant silently returned to `2` · *"the declared value is the one the human sighted: 9 px"* (also the sitting-row case); the comparison weakened from `<` to `<=` · *"the sitting row's three feature sizes: ~5 px refused, ~9 px and ~15 px answered"* (also *"exactly at the threshold is NOT below it — a strict less-than comparison"*).

**K6 (ii) contract (appended later the same day, after the custodian extended this piece to it; it supersedes the "Not done, noticed" paragraph below, which was true when written).** `e2e/regression.mjs` now reads the readout **structurally**, through one new helper, `readHoverReadoutState(page)` — four states told apart by class and never by wording (`clear` · `refusal` via `.hover-readout-below-resolution` · `confirming` via `.hover-readout-confirming`, carrying its `.hover-readout-confirming-marker` text · `confirmed`) — and `hoverReadoutId` now takes that state and returns an id **only** for `confirmed`, so it can never read a marked stale readout as a confirmed id (§3.3's own words, quoted at the helper). **K6 (ii)'s assertion is now a sequence, not a final id:** per notch it reads once mid-gesture and once after the settle, and asserts that mid-gesture the standing id appears only under a marker that labels *that* id (never bare, never a different one), that after the settle the marker is gone — the id confirmed by its own trace since the notch's mark, or the readout changed to the refusal or to nothing — and that across the whole notch run the labelled state was sighted at least once; the mid read's race against the settle is declared and is never itself a failure. K6 (i) is unchanged (the named refusal, by class and verbatim text). Every other readout reader in that file is now explicit about the states it accepts: A9′ (a confirmed id; the `clear` state for its disappearance), `establishAboveThresholdHoverK6`, K6 (iii)/(iv)/(v) (a marker standing after a settle now fails by name), and K7. `node --check e2e/regression.mjs` exit 0; `node e2e/citationIntegrity.test.mjs` (29 passed) and `node e2e/residencyTrace.test.mjs` (76 passed) both exit 0 — neither covers `regression.mjs`'s own hover helpers, and **no harness run was performed by this piece**. `e2e/residency-harness.mjs`'s own `/^id \d+/` hover read is outside the custodian's named scope (that file is not `regression.mjs`) and was left untouched.

**K6 (ii) sibling — `e2e/residency-harness.mjs` (appended after the custodian's sibling-search extension).** Its own hover reader (`tryHoverCandidate`, the `/^id \d+/` at `residency-harness.mjs:1564-1565`) had the same defect class: the marker text `id <n> · confirming…` matches that regex. Hardened with a self-contained `readConfirmedHoverId(page)` that rejects `.hover-readout-confirming` and `.hover-readout-below-resolution` by class (an import from `regression.mjs` is unsafe — that module ends in an unconditional top-level `await main()`, disclosed at `residency-harness.mjs:1420-1427`). Noted in the helper's own comment: this lane only ever hovers and never changes the camera while a readout stands, and runs only after the fit step's settle is quiet with nothing previously hovered, so the marker cannot in fact arise here today; the read is made state-correct rather than regex-correct as defense in depth. `node --check` on both files exit 0; `citationIntegrity` 30 passed, exit 0.

**Not done, noticed:** `POLISH-87-88-89-PREREGISTRATION.md` §3.3's K6 (ii) E2E contract change is still owed — `e2e/regression.mjs`'s `hoverReadoutId` reads `.hover-readout`'s text and would read a marked readout's `id <n> · confirming…` as a confirmed id. The structural hook it needs exists: the container's `.hover-readout-confirming` class, and the marker's own `.hover-readout-confirming-marker` element, read exactly the way `belowResolution` is already read at `regression.mjs:1246`. No E2E file was edited and no harness was run by this piece (§7).
