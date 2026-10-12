*Custodian's filing note (2026-10-11): shell-migration-milestone-2's phase 0 re-sweep, read-only, the worker-high run 15:58:49Z to 16:11:02Z by its transcript (Write and Edit calls 0, none in a repository), read at main 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 16a0e4e48c28a78c7cc28a4adb48d135594e2ce6d422b73a668867f4802153d0. Its section 2 class (b) findings go to the architect for the form's next amendment before any code.*

---

# shell-migration-milestone-2 phase 0 re-sweep

Read at: main @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1

B in this report means that hash. At the start of the run `git fetch origin` then `git rev-parse HEAD origin/main` printed B for both. Partway through, main moved to 19b01c40b1a1b9f00931c07998295c4271027c7a (docs commit "the block flushed"). `git diff --stat 6de584fa HEAD` shows one file changed: `state/CUT-STATE.md`. Every pin, hash and read below is from B's blobs (`git show B:path`) or from files the later commit does not touch. Nothing was written to the repository. The form read is `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md`, 803 lines, sha256:9cbfbb833e8f7287f7508e86ec3c5a382468f5af346c60b6152410cd5e5f2154 (identical in the working tree and at B).

## 1. Every code and document pin, recomputed at B

Method: a script took every `path:a-b @ rev sha256:h` in the form (83 distinct strings). It recomputed the hash over the pin's own lines at the pin's rev, and then at B at the same lines. If the hash differed it searched B's file for the same text elsewhere. All 83 pins hash correctly at their own rev, so none was mis-copied.

- 29 are records under `state/`. They are excluded from the tallies below. All 29 are hash-identical at B.
- 54 are code and document pins:
  - 43 identical
  - 8 moved
  - 3 changed
- Of the 54, 43 are under `frontends/shell/src` (32 identical, 8 moved, 3 changed). The other 11 are docs, `package-lock.json`, the K6 and map-refill forms, and the walkthrough, and are all identical.
- The custodian's "40 identical" is not reconciled with my 43. Most likely a difference in counting: I count the pins that appear at two revs as two (`contributions.ts:25-28`, `App.tsx:1447`, `App.tsx:1640`, `publish/types.ts:127-129`). The 8 moved and 3 changed agree with the custodian.

**Identical at B** (the hash equals the form's; revs are dba12b8c unless marked b4dc05e0):
- `package-lock.json:452-453`
- `App.tsx`: 163-205, 770-771, 805, 816-817, 1447 (both revs), 1640 (both revs), 1782-1796
- `canvas/pickResolution.ts`: 194-206, 454-462
- `canvas/buildLayers.ts`: 14-23
- `canvas/pick.ts`: 104-106, 134-143
- `canvas/decodeBatch.ts`: 96-114
- `publish/PublishPanel.tsx`: 292-295
- `publish/types.ts`: 127-129 (both revs)
- `publish/PublishDialog.tsx`: 119-136
- `layout/StudioLayout.tsx`: 107-117, 155-164
- `layout/contributions.ts`: 25-28 (both revs), 66-72
- `layout/actionRegistry.ts`: 14-35, 73-84
- `console/surfaceRegistry.ts`: 275-324
- `console/soleCaptureSite.test.ts`: 49-61
- `admission/admitDataset.ts`: 46-48
- `skp/client.ts`: 76-82
- `admission/AdmissionPanel.tsx`: 205-211, 258-260 (b4dc05e0)
- ADR-024: 217-227, and 217-219 (b4dc05e0)
- ADR-036: 112-115, 129-131
- `protocol/skp/SKP-V0.md`: 175, 177-179
- `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`: 38-40
- `E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md`: 73 (b4dc05e0)
- `SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md`: 281 (b4dc05e0)
- `MANUAL-WALKTHROUGH.md`: 1715 (b4dc05e0)

**Moved** (the text is hash-identical at the new lines, so each is a class 3 row; the hash column is the form's own pin hash):

| Pin | At B | Shift | sha256 |
|---|---|---|---|
| `frontends/shell/src/canvas/WorkingCanvas.tsx:106-130` | 107-131 | +1 | 67da566ecdff3c9356767ec4200d8282a3dc3ba70d95c1dd6e6d6fc613124588 |
| `WorkingCanvas.tsx:1186-1195` | 1210-1219 | +24 | d7c0f270c18110972bdde2934ea2c8b0b40982242117ffb7f015fdf6fe6825e9 |
| `WorkingCanvas.tsx:1242-1269` | 1266-1293 | +24 | 14486a2402a1f595ba28640208aa6702576a0d08302c7a873e9a2d0962c78d0d |
| `WorkingCanvas.tsx:1907-1918` | 1935-1946 | +28 | f59050a21971beb2e42365303dde383956c94c5a2485fb1a25e1602a3cbcde08 |
| `WorkingCanvas.tsx:1989-2021` | 2030-2062 | +41 | 4385c48fc726075627f5ca66b9c9511b7ecc529f42ad63a2b5eb758b0b9ff7fb |
| `frontends/shell/src/App.tsx:1969-1978` | 1975-1984 | +6 | a8d9b976d89d4f7ec2cac70e5ea711c6771e40729d00e2120bf96aaa4db25c85 |
| `frontends/shell/src/publish/PublishPanel.tsx:427-429` (b4dc05e0) | 430-432 | +3 | fb4cd99bee5348f4efe507a7ebc00e2e350ad835c19265d5031bfa982307a38d |
| `PublishPanel.tsx:461` (b4dc05e0) | 464 | +3 | 302f563ad54580eb0360f804665bfde28a9f6b04e51bfa38c792eadf3bdb66a1 |

**Changed** (the text differs): three pins, covered in §2 below.

One more stale reference, not a pin: `pick.ts` has an in-file comment citing `WorkingCanvas.tsx:1968-1972`. `pick.ts` is unchanged and in the not-edited list, so I only note it.

## 2. The three changed pins

### Pin 1: `WorkingCanvas.tsx:499-539 @ dba12b8c`, now 503-548 @ B

B span: `frontends/shell/src/canvas/WorkingCanvas.tsx:503-548 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:a29cab4355c7272e30604052428ac43ac1ab38cd56000e47f209577f7b1d1557`.

**What the form uses it for.** §0.5, "The canvas handle and props": the props interface that §2.2 extends with `onClickPick`, `highlight` and `onSelectionDrawnChange`. §2.3 also takes "the current authoritative view box (from `onViewportChanged`)" from it.

**What B says.**
- The props gained a required `onViewportWithinLastQuery: (bbox: AuthoritativeBbox) => void`, at 537-540.
- `onViewportChanged`'s doc was reworded (533-536). It now says it fires on "the automatic fit, which never fires it" excepted, on each pan or zoom tick ("not only a settled one (the caller debounces)"), on Zoom to layer's fit, and on a growth of the canvas past the area last reported.
- A shrink reports through the new prop instead. App handles both callbacks and writes the same ref, `lastViewportBboxRef`:
  - `frontends/shell/src/App.tsx:1829-1849 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:d4e2ee97804af04deb7c3d1e5ef3e141e660f30c276a71d412286f8efbc12f09`
  - `frontends/shell/src/App.tsx:821 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:2daa358861a63fab6d72d65f99577c21371241ec20612716b6708ef30196e50b`
- The auto-fit reports neither callback. `fitToExtent(..., false)` is called at `WorkingCanvas.tsx:1487` and `:1683`, and its else-branch clears `lastQueriedRef`. The auto-fit existed in the same form at dba12b8c, so this is not new at B. The rewording now states it, and the re-sweep sees it.

**Class: (b)**, not (a) and not (c). No new data enters the form's seams.
- The added prop is additive. It changes no seam the form drafts against, so I10 does not apply.
- Read literally, §0.3's "an interface that differs from §0.5 is I4" could trip on the added required prop. I read I4 as concerning an interface the plan draws against, which this is not. The architect should say so in the re-sweep amendment, so that no gate reads I4 literally.

**Form sections that must absorb it.**
1. §2.3 (the counts, "outside the view" and "in view, not drawn") and UB3, RB3, E-SEL-FILTER and E-SEL-PAN, which depend on them:
   - The view box has two sources at B, not one: `onViewportChanged` (every tick) and `onViewportWithinLastQuery` (a shrink). A selection store fed from `onViewportChanged` alone goes stale after a shrink, and "a resize" is in §2.3's survives list.
   - The auto-fit also moves the camera without a report. That happens at open and after every Apply or Clear, via `resetFitForNewGeneration`. Until the next pan or zoom report, the box is null or pre-Apply.
   - Under §2.3 "no reason without its fact" and §8 item 7, the outside-view and in-view split needs a freshness condition. The simplest honest one is that the split shows only while a box has been reported since the last camera write. The form states no such condition.
2. §2.3's "recomputed when the view box settles": the callback fires per tick, so either App debounces or the counts recompute per tick.

### Pin 2: `WorkingCanvas.tsx:1302-1329 @ dba12b8c`, now 1326-1356 @ B

B span: `WorkingCanvas.tsx:1326-1356 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:13152c661775673fd416b83faf54e0aa2da184c16c7126b1717cb0a1515755d9`.

**What the form uses it for.** §0.5, "The fit": `fitToBbox` is a handle method that reuses `fitToExtent` (A10; OPEN-8).

**What B says.** The signature is unchanged, `fitToExtent(bbox, notifyViewport)`, and the steps run in the same order. Three differences:
- A `cameraRef.current = {...}` write at 1341.
- `reportViewport(...)` replaces the direct `onViewportChangedRef.current(...)` call at 1352.
- A new else-branch at 1353-1355 clears `lastQueriedRef` when the fit does not notify.

`fitToBounds` still calls `fitToExtent(bbox, true)` at `WorkingCanvas.tsx:1528 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:8cc3bc160e9c7bc4d514869a0b245bb33a01f68e7a19a730489ce98ba2ffbe8d`.

**Class: (a).** Same fact, instrumented. One clarification for the worker, with no plan change: `fitToBbox` must pass `notifyViewport: true`, as `fitToBounds` does. §2.5's own words, "issues only the query any fit issues", already say that. A non-notifying fit would clear `lastQueriedRef`.

### Pin 3: `App.layout.test.tsx:110-150 @ dba12b8c`, now 130-171 @ B

B span: `frontends/shell/src/App.layout.test.tsx:130-171 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:884308b174615e14f33d8c9de6d8eb7363f632af2e6ef523f1d22fc6a34bc648`.

**What the form uses it for.** §0.5: "the real-App render harness, which stubs only the WebGL boundary". It is the template for `App.workspace.test.tsx` and `App.selection.test.tsx` (RA1, RA2, RB1 to RB16).

**What B says.**
- The canvas stand-in is the same, plus one line: `mocks.canvas.props = props;` at line 135. The stand-in now keeps the props `App` passed, which RB1, RB2, RB5 and RB6 need in order to call `onClickPick`.
- The file also gained a partial `vi.mock("./publish/client")` at 121-128 (`frontends/shell/src/App.layout.test.tsx:121-128 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:e2908d269d87299a36641e1034a3c22d2e3fae5a165e8405f4f4344925055291`). It makes `publishPrepare` record its scope argument and return `picker-cancelled`.
- The stand-in handle has no `fitToBbox`, as expected.

**Class: (a)** for the pinned span. The wording "stubs only the WebGL boundary" was loose already at dba12b8c, which had four `vi.mock` calls: skp/client, skp/events, viewportStreamManager and WorkingCanvas. B has five. The file's own header says it mocks "the SKP transport (`./skp/client`, `./skp/events`), the baseline stream manager, and the WebGL boundary" (`App.layout.test.tsx:11-13 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:5636fe6d740653edf2a011d83e0c287645ed28b19134dd28b53398ed3f276f07`).
- RB7 and RB8 need `publishPrepare` and `publishExecute` behaviour of their own. A copied harness must mock `publish/client` itself. That is a boundary `App` does not own, not `workspace/`, `selection.ts` or `scope.ts`, so I6 does not apply.
- The existing harness could be reused as is for RB8's "identical `publishPrepare` arguments", via `mocks.prepareScopes`.

### Found in the same file and the registry test, not caused by the three merged pieces

These existed at dba12b8c as well. The form does not list them as edits.
- `App.layout.test.tsx:398-405` asserts the Inspector's tabs are exactly Layer and Style, with aria-selected and tabindex arrays of length 2 (`frontends/shell/src/App.layout.test.tsx:398-405 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:9fddf2a9021fbaee127a6afb08dee4c7826be1ba08b8749e0d9c48c943d8b4dd`). The Feature tab of §2.6 fails it.
- `layout/actionRegistry.test.ts:121-128` asserts the registry holds exactly four ids, named "holds exactly the three toggles and Zoom to layer (question round 66, item 2)" (`frontends/shell/src/layout/actionRegistry.test.ts:121-128 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:9ab1acb08bee0f9fdcfe4936bfc2d129eb9991f4b91779a5fd67f65aad6ce996`). The four new registry ids fail it. This file is named under UB10, but the edit is to a test that cites a ruling.

**Class: (b), for the custodian and architect to classify.**
- §3 predicts every existing suite passes unedited at phase B's head "with only G-E's changes". §2.8 says none is expected to change.
- `App.layout.test.tsx` appears nowhere in §7's tables or §2.7's list. An edit to it is §8 item 1 unless the amendment names it.

## 3. A13: the walkthrough's last Part at B

The last Part at B is **V**: `frontends/shell/MANUAL-WALKTHROUGH.md:1763 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:69af406c7d03ea71df2f3401dea7b28764651b60da36dad87385b8e74af30ed7`. That is the heading "## Part V — the map after a resize". Part U is still at 1715. Part U's pin is identical at B: sha256:6fd13facf04cf9c1039dda109a90661ada00fc65c40c3cccbb5166ae6def3d0b.

- **W is free.** There is no `Part W` heading in the walkthrough, and `git grep` finds no tracked file claiming it other than records that reserve it for this milestone.
- **The CRS piece takes X** under its own form's Amendment 2, item 1. That item takes X, names V as the last Part, and reserves W for this form's A13.
- **File order.** If the CRS piece merges first, its X sits at the tail and W must go between V and X, or W follows X out of letter order. That is the custodian's call. Both pieces edit the same file at its tail.
- **KNOWN-LIMITATIONS.md** is at the repo root. Its highest item is 39 (map-refill's retired item, line 369).
  - The next free numbers are 40 and 41 (A14).
  - No tracked file or PLAN node claims item 40 or higher; I searched with `git grep`.
  - Items 36 (line 357) and 38 (line 365) are still the hover items A3 extends.
  - The CRS piece edits only item 2.

## 4. B5's condition: the barrier is exported, so B5 does not apply

`frontends/shell/e2e/lib.mjs:639` is `export async function hoverIdAfterBarrier(page, target, label)`. Line 639 is sha256:55d94a32e634e7c244d4e6bf1ea56e86da6fd933b379269d2311787d25de5ed1 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1. The body at 639-658 is sha256:37f18427550308a49a1c0c65b09658c9f7c12fb8cf6b45878142227859db1f78 @ the same rev.

- It reads the standing readout, moves the pointer off the canvas, waits for the `clear` state, moves to `target`, and polls for a confirmed id. It returns `{ok, last}`.
- The callers are `regression.mjs:866` (A9') and `regression.mjs:1125` (K6).
- It reads `.hover-readout` at `lib.mjs:613-617`. The Feature tab must therefore never render that class, which agrees with §8 item 15.
- The `lib.mjs` hash is sha256:2c28186774aa34fc0ab5c3863af13bc0c3448110d261d55f37cd6014838c0eed.
- A2's function name for the re-sweep amendment is `hoverIdAfterBarrier`.

## 5. §2.7 boundaries against B

**May-edit files.** All exist, or are new as declared.
- Existing:
  - `App.tsx`
  - `layout/{contributions.ts, actionRegistry.ts, StudioLayout.tsx}`
  - `canvas/{WorkingCanvas.tsx, pickResolution.ts, HoverReadoutView.tsx}`
  - `publish/PublishPanel.tsx`
  - `console/surfaceRegistry.ts`
  - `src/styles.css` (§2.7's bare `styles.css` can only mean this one)
  - `package.json` (no `e2e:selection` script yet)
  - `layout/actionRegistry.test.ts`
  - `canvas/pickResolution.test.ts`
  - `e2e/{layout.mjs, regression.mjs, publish.mjs, lib.mjs, README.md}`
  - Amendment 1's AM1-X group: `admission/AdmissionPanel.tsx` and `AdmissionPanel.test.ts`
- Absent at B, so new as declared:
  - `src/workspace/` and `src/feature/` (including `OpenDuringExportAsk.tsx`)
  - `canvas/clickPick.ts` and `highlightLayers.ts`, and their tests
  - `App.workspace.test.tsx` and `App.selection.test.tsx`
  - `e2e/selection.mjs`

**Not-edited files.** None has gained something the plan needs. Since dba12b8c:
- Comment-only changes:
  - `canvas/hoverRepickConstants.ts`
  - `residency/residencyStatus.ts`
  - `style/StylePanel.tsx`
  - `console/ConsolePanel.tsx`
  - `layout/layoutBoundary.test.ts`
  - `PublishPanel.tsx` (a may-edit file; its two moved pins come from a 3-line comment growth)
- Code changes:
  - `canvas/viewportBbox.ts` gained `viewportAfterResize` (`frontends/shell/src/canvas/viewportBbox.ts:70 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:5f6227aaa2b36681002f48a1178be89c71e2d9c9e76f27ce56ec609cd57a6506`). The plan does not use it.
  - The resize report is `WorkingCanvas.tsx:1948-1958` plus `App.tsx:1844-1849`, which is the view-box source in §2 above.
- `layout/layoutState.ts` is unchanged. Adding the `feature` tab needs no edit there: it uses `InspectorTabId` by type only, at its lines 33 and 40. I15 is not triggered on my read.
- The top bar renders only registry entries that have a region and a chord (`StudioLayout.tsx:210-213`), so the new `tool.*` and `selection.*` registry entries will not render as top-bar toggles by themselves.

**Declared shapes.**
- **`onHover`.** The hover path 2030-2062 is hash-identical.
- **The settle scheduler.** `createHoverRepickScheduler`'s deps at 1195-1224 and `scheduleHoverRepick` at 1243-1264 are unchanged.
- **`pickCandidateAt`.** It does not exist as a named function. At B it is the inline arrow dep at `WorkingCanvas.tsx:1210-1218 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:571b51d490e4ff464d9ba1424770573a2a0143523b457c1f3e4aab1b7e13b568`. That matches "the settle re-pick's body today" and the declared move to a shared function. `WorkingCanvas.test.ts:462` has a local mock of the same name for the scheduler.
- **The Deck** still has no `onClick` (1935-1946 moved). The only addition is `onResize` at 1954, a sibling prop. No conflict.
- **`fitToBbox`.** It does not exist yet. `fitToExtent` is as described in §2 above.
- **OPEN-8's shape holds.**

Two worker notes, and one gap in the form:
- `HoverReadoutView.tsx:33` `idLine` is not exported. The two refusal texts are inline JSX, and the session-ended one spans two JSX lines. The constants must reproduce the rendered single-spaced text.
- **A form gap.** `getCursor` is wired inside `WorkingCanvas.tsx:1946` as `cursorForPointerState(isDragging)`, so the canvas must know the tool. §2.2 and §7 name no `tool` prop or ref for the canvas. The props it names are `onClickPick`, `highlight` and `onSelectionDrawnChange`. This is a pre-existing gap.
- **A contrast.** Walkthrough row M18(a) says any third cursor is a FAIL ("no click affordance"), and `pickResolution.ts:454-462`'s doc comment says the same (identical pin). Select's `default` cursor and the comment edit sit in the cursor-function change that §2.7 already allows.

## 6. §0's interfaces, H1 to H7

- **H1.**
  - The installed `@deck.gl/core` is still 9.3.9 (the lockfile pin is identical). I read `deck.js` in the main checkout's untracked `node_modules`.
  - Lines 174-243 hash to sha256:540fb5808832bc8e258cd596a69b1f920a8e90687b1e6a1a426ade66d5d6f9ae. The form pins no hash for them, so I cannot compare.
  - Lines 174-199 are the `_onEvent` dispatcher, which uses `event.offsetCenter`. The recognizer registration is imported from `constants.js` at `deck.js:24`, not in that range. The form's "tap recognizer" label for 174-199 is loose.
  - The discriminator is E-NODRAG, which is e2e; I did not run it.
- **H2 holds as read.**
  - Every `mouse.down` to `mouse.up` on the canvas includes moves in between:
    - `regression.mjs:266-272` (doPan)
    - `regression.mjs:1912-1921` (CURSOR')
    - `console.mjs:434-436`
    - `pan-anchor.mjs:111-113`
    - `source-changed.mjs:482-484`
    - `residency-harness.mjs:661-669`
  - `layout.mjs:492-505` is new since dba12b8c and is not in the form's list. It presses on `#splitter-inspector`, not the canvas.
  - I found no press-and-release without a move, so `regression.mjs ≤ 20` stays unused. The second half of H2's discriminator, running the suites, is not mine.
- **H3 and H7.** Not readable. They are runs and the walkthrough.
- **H4.** Untraced, as the form says. `PublishPanel.tsx` changed only in a doc comment.
- **H5.** Not established or refuted by me. Facts for the amendment:
  - `isFillComplete` is `frontends/shell/src/residency/candidateArmSession.ts:661-682 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:5eae94e42437eb854942e72306c744e98d5b1e07faff6520881f3a8864747709`. The file is unchanged since dba12b8c.
  - The engine predicate is "covering bbox intersects the viewport", which `engine/src/index.rs:27-30` calls weaker than geometry intersection (`engine/src/index.rs:27-30 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:abdf0c9cd33e16e1b434af3b41c58389275a44050a9e539d8085ed9efda8d89d`; `:50` names `ANSWERS_PREDICATE`).
  - H5 therefore holds only if the file's covering bbox contains the geometry's bounds. I did not check whether the engine verifies that.
- **H6 holds.** `SKP-V0.md` has no level-of-detail or simplification member (a case-insensitive search for `level.of.detail`, `simplif` and `lod` found none). `decodeBatch.ts:96-114` is identical. A null-geometry row has no parts, so it cannot be picked and has no bounds.
- **§2.4's "unit confirmed in the re-sweep".**
  - The style document's `outline_width` is a bare number in `[0, 64]` (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:255-263 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:ac4db41dca293fda0cafc2dbc07b191d79fe8a7e577f1253bb20e2cc5a9a940c`).
  - The renderer declares it "Outline width ceiling, in CSS pixels" (`renderer/src/style.rs:49 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:826c65f1acec69a8602d5cd982f6c02ccc17faaed0a77906a5054f5b93d98a80`).
  - The shell draws it in pixels (`canvas/buildLayers.ts:434-436 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:9b17886064e8f69ecff839c00a86dbbbbb92e411af3808e722ce6a9af51cf0fc`).
  - So `{value, unit:"px"}` is the shell's reading of a unit-less document number.
- **Other facts the form leans on.**
  - `closeDataset`'s only product callers are `App.tsx:1447` and `:1640`, so B3's "no close action" holds (I4 not tripped).
  - `StyleState` has four properties, so `style.set` emits up to four transitions.

## 7. Rule 00 against the two pieces in progress

**Phase A's files.**
- New: `src/workspace/*` (two source files and four test files) and `src/App.workspace.test.tsx`.
- New: `e2e/selection.mjs` (the phase A part, EXPORT-TODAY).
- Edited: `src/App.tsx`.
- Possibly `package.json` (the script line).
- Records: the form and `PLAN.yaml`.

**Phase B's files.** Everything in §2.7's may-edit list, plus Amendment 1's additions:
- `canvas/{WorkingCanvas.tsx, pickResolution.ts, HoverReadoutView.tsx}`, `clickPick.ts`, `highlightLayers.ts`
- `layout/{contributions.ts, actionRegistry.ts, StudioLayout.tsx}` and their tests, and `App.layout.test.tsx` (see §2 above)
- `publish/PublishPanel.tsx`, `console/surfaceRegistry.ts`, `styles.css`, `package.json`
- `e2e/{selection.mjs, layout.mjs}`
- `regression.mjs` and `publish.mjs` only conditionally
- `MANUAL-WALKTHROUGH.md` (Part W)
- `KNOWN-LIMITATIONS.md` (items 36, 38, 40, 41)
- `e2e/README.md`
- B3's `admission/AdmissionPanel.tsx`, `AdmissionPanel.test.ts` and `feature/OpenDuringExportAsk.tsx`

**Against slot 2's CRS piece** (its form's §2.6; I read both forms and the in-progress node):

| File | Overlap |
|---|---|
| `src/admission/AdmissionPanel.tsx` | **Yes, with B3**, which is conditional on A7 and on the human's word on A10. The CRS piece adds a `formFamilyForCode` branch at line 25 and edits the doc comments of `formFamilyForCode` and `nextFormFamily`, which precede `runAdmitPath` at 190 and `Props` at 258. B3's pins at 205-211 and 258-260 will move after that merge, with the text unchanged: a class 3 row at phase B's base. |
| `src/admission/AdmissionPanel.test.ts` | **Yes, with B3** (UB13), the same file as the CRS piece. |
| `e2e/regression.mjs` | **No expected overlap.** Milestone 2's use is conditional on H2 failing (which I read as holding) or on B5 (which does not apply). |
| `MANUAL-WALKTHROUGH.md` | **Same file, different Parts** (W against X). The CRS piece also edits the ABSENTCRS' coverage row at line 93, in place. Milestone 2 expects no in-place row edits. Both append at the tail. |
| `KNOWN-LIMITATIONS.md` | **Same file, different items.** The CRS piece edits item 2 only. Milestone 2 edits 36 and 38 and appends 40 and 41. |
| `CrsAssertionForm.tsx`, `kernel/tests/manual_walkthrough_fixtures.rs` | **No overlap.** Milestone 2 edits neither. |

Phase A touches none of the CRS files. The sequencing note in PLAN, that milestone 2's phase A code waits for the CRS piece's e2e runs, is a machine-time question, not a path overlap.

**Against the docs lane's piece e** (`skp-v0-live-sections-current-area-c`; its form's §2.2 S6 and §2.7):
- No file overlap. Milestone 2 does not edit `protocol/skp/`, `kernel/src/skp.rs`, `kernel/README.md` or `src/skp/types.ts`, and its workspace reads only types.
- Piece e edits `SKP-V0.md` and adds a sentence near its lines 119-123. That could shift milestone 2's two document pins, `SKP-V0.md:175` and `:177-179`, which are identical at B. If piece e merges before milestone 2's base, they are class 3 moves; the text is not among piece e's edits as far as I read.
- Piece e's change to `types.ts` is comment lines 290-292 only (S6).

## Files read

- Forms and records:
  - `.claude/agents/worker.md`
  - `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md`
  - `frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md`
  - `protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md` (sections)
  - `PLAN.yaml` (the three nodes)
  - `KNOWN-LIMITATIONS.md`
  - `frontends/shell/MANUAL-WALKTHROUGH.md` (headings, rows)
- Shell source:
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`
  - `frontends/shell/src/canvas/{viewportBbox.ts, extent.ts, HoverReadoutView.tsx, pick.ts, decodeBatch.ts, buildLayers.ts}`
  - `frontends/shell/src/canvas/WorkingCanvas.test.ts` (one line)
  - `frontends/shell/src/App.tsx`
  - `frontends/shell/src/App.layout.test.tsx`
  - `frontends/shell/src/layout/{contributions.ts, actionRegistry.ts, StudioLayout.tsx, layoutState.ts, layoutState.test.ts, statusItems.ts, actionRegistry.test.ts}`
  - `frontends/shell/src/admission/AdmissionPanel.tsx`
  - `frontends/shell/src/residency/candidateArmSession.ts`
  - `frontends/shell/src/style/document.ts`
- e2e and untracked:
  - `frontends/shell/e2e/{lib.mjs, regression.mjs, layout.mjs, console.mjs, pan-anchor.mjs, source-changed.mjs, residency-harness.mjs}` (the press and release sites)
  - `frontends/shell/package.json`
  - `frontends/shell/node_modules/@deck.gl/core/dist/lib/deck.js` (untracked; evidence, not Authority)
- Other modules:
  - `engine/src/index.rs`
  - `renderer/src/style.rs`
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`
  - `protocol/skp/SKP-V0.md`
- Diffs and blobs only, not read in full: `git diff dba12b8c 6de584fa` over the shell source, e2e, engine, kernel and protocol; B's blobs for every pin file.
- Scratch files: `mm2-pins.mjs`, `mm2-pins.json`, `mm2-wc-old.tsx` and `mm2-wc-new.tsx` in the scratchpad.
