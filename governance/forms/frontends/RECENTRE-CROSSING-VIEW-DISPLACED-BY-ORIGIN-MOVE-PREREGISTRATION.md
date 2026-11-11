# shell e2e: after a pan crosses the re-centring bound, is the view displaced by the origin's move? A reproducer first: one observed run on the measure build, from the fit view out past the bound and back, its prediction declared before the run; nothing committed, retried or fixed; five-line short form (`AUTONOMY.md` §21d)

*Committed before the run. Append-only once committed; an amendment written after the run has been seen says so in its first line. PLAN node recentre-crossing-view-displaced-by-origin-move, slot 2. Form path: `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md`. The custodian keeps the PLAN node on main. Self-references are by note and item, never by line.*

## The form (five-line, `governance/AUTONOMY.md` §21d)

```
Authority: PLAN node `recentre-crossing-view-displaced-by-origin-move` (`governance/PLAN.yaml:5554-5570` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5eb3a19f71d1990bb72ff71df4b667b6076c7ebe268295ed6a82f19512be0b05), generation 1; placed by the human's message of 2026-11-11 (21:49Z), item 5 (b), which binds this form: the defect, its two readings (readings, not findings), the run's shape, the records, the two outcomes, the deck.gl fact and what follows if reproduced (`state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:20-23` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:6a2380ae52ae36c75c7fd8f2c46b0fef5826ac7d9fdff5e8f56a0b4f6600ffb2); the instrument and the run's conditions reused from the diagnostic form's note 1 (`governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md:21-36` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1d2e9a3994e947320d10382e543db770b259e1a5dc24da45782904c9012d2e25) and its Amendment 1 (`governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md:129-222` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:d647ec5de47efa6afa8984ec5de7540d26e0200e8a6088ef401dc00cbbc7e6a4); evidence, not Authority: the measure run's off-script lines (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-measure-worker-report.md:72-77` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:00f86bd28b802db74bf5877e9ae8bb0a6ae9dee3c724ed9d9abba742fdc3e0cd) and their lookup by the reviewer (`state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:258-274` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f69da72f8e0122999a73cc0fc9a5fd1079fed164cd7fc427d5e3bd009066a7ed), the architect's H1 (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:231-239` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:3d706e201262d078007647c5e5f0527cab24941cb46f01b0209ace9259c86918), and the diagnostic's uncommitted patch dg-measure.patch (14943 bytes, sha256 284833375b70b2f31fa91ea8ddafb28cf43e0de3087fa21a44b391152ceb5910, kept in the custodian's scratch); the reuse index found no prior art on its three searches (recentre origin rebase view state deck viewport; pan drag origin move displaced view; cdp screenshot e2e webview2 compare), a miss noted here.
Scope: 0 committed files; declared line budget 0, insertions plus deletions, comments counted (`governance/AUTONOMY.md:357` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; frontends/shell/e2e/pan-anchor.mjs is edited in the worktree C:/dev/wt/dg for note 4's instrument, the edit kept as a patch in scratch with its sha256, reverted after the run and never committed; no product file is edited, frontends/shell/src/canvas/WorkingCanvas.tsx included; the worker's report, filed by the custodian under state/consults/, and the PLAN node are the custodian's records; no other file changes.
Change: none in the tree: one observed run of the measure build's exe at 00bcb07d under note 4's instrument, from the fit view through note 3's drags out past the re-centring bound and back, recording target plus origin at the start and at the end, each change of the frame's origin and one CDP screenshot at each end with no DEV hook, read against the two outcomes declared in note 5; nothing is retried or fixed.
Tests+mutation: none: no test is added or changed and no code is committed, so no mutation is owed; the run is an observation, not a test; its exit code and fatal lines are recorded as they come; no record calls the run an observation of a mutation.
Out-of-scope: ADR: none (ADR-010 rule 1 unchanged: the records read the shell's own `view-state` line and a devtools image of the canvas, never deck's `info.coordinate`); security: none (the CDP port is the measure build's own compiled block, used as the diagnostic's Amendment 1 (a) and (d) used it; the images stay in scratch outside the repository; no exposure surface, no dependency); wire: none (nothing under protocol/; console lines and a devtools capture, not SKP or MCP); guarantee: none (no property asserted or changed; the tolerance at `frontends/shell/e2e/pan-anchor.mjs:45` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:ffb43e0f9b4aefc7735146467b19c14463e3401c650392e2da53af560cd2a912 is read, not changed; no measurement is claimed under docs/08: the outcome is one run's reading, no p50/p95); no string the app shows is added or changed.
```

Budget: **60 minutes** of work, the node's (my estimate, not a measurement): about 20 for the patch, about 10 for the run (setup, two settles, about 76 drags of about 1.8 s each, the collection), about 20 for the reading script with its image decode, about 10 for the report. No build. The wait for the quiet condition is not budget time; it is stamped and reported separately.

---

## Notes

**1. The form's kind.** Five-line, under §21d, with §21b's single gate.
- §21b admits docs, tests and polish that touch none of §21a's four categories and stay under §21c (`governance/AUTONOMY.md:334-343` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:408e0dddf708c4770a2443c7c1b8ccb2772fca59964a6dec78f69eee61061efe). This piece commits nothing and changes no property. It observes one, and it predicts both ways.
- §21c's four bounds hold: 0 lines across 0 files, no exposure surface, no dependency, no user-visible behaviour (`governance/AUTONOMY.md:347-357` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31).
- §25 (e) sends a piece to the full form at dispatch only when its `Out-of-scope` line names a §21a category as touched (`governance/AUTONOMY.md:482` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669). This line names none, so §25 (e) does not apply.
- The precedent is the diagnostic, run on the same build, which took this form.
- The full form, with both gates, is what the human names for the fix if the defect is reproduced. That is a later form, not this one.

**2. The base: the measure build's exe as it stands, not a rebuild.**
- The exe: `D:/wt-targets/dg-measure/release/spatial-ide-shell.exe`, 72112640 bytes, sha256 384ed094bdf5b4a1c5908f0a119c56f89dc17b1d378a401ac2932b90cb86d78c. It is a release build of C:/dev/wt/dg at 00bcb07db100c56e672afe99dbe3fe27f2638010 with the measure-build feature (the diagnostic's Amendment 1 (a)). Its size and hash were recomputed by the reviewer (`state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:37` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:506026ead930c26070a8cd8649401c973a7459add4b70b2d387bc2c2d6e6426d).
- Why reuse:
  - Both readings under test came from this exe. Reproducing them on the same artifact tests the readings, not a new build.
  - Per the custodian, nothing under frontends/ or renderer/ differs from 00bcb07d to 8e09470c. So the page code it runs is main's.
  - A rebuild adds about 25 to 45 minutes and a second artifact, and decides nothing.
- What the reading is about: the build at 00bcb07d. For the run, the tree at 00bcb07d is authoritative, and the pins here at 8e09470c are read against it through that equality. Whether kernel/, engine/ or protocol/ differ from main is not shown, and the page-side question under test does not turn on them.
- Before the hold, the worker shows:
  - the exe's size and sha256 equal to the values above, or it stops (not a run);
  - C:/dev/wt/dg at 00bcb07d with its porcelain empty.
- Nothing is fixed before the run is read. H3 of the main-thread consult (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:244` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:89c04e658984516b3d756e394bd8f4971d258236b8a99896d9af6d93ed557c62) holds here: the measure build carries none of the DEV-only seam or capture work.
- The worktree takes a local branch named for this node [OPEN-6]. It is never pushed and takes no commit.

**3. The drags.**
- **The bound.** T(z) = min(RECENTER_MAX_DRIFT[unit], RECENTER_BUDGET_PX / (2^-24 · 2^z)). Cites: `frontends/shell/src/canvas/offsetFrame.ts:84-91` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1b84765adb721dc6c3c2678e75e1c5195464edabf4a4690ef5e513b4355296af, `frontends/shell/src/canvas/offsetFrame.ts:38` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:35cd05fac57a9937e57abb9bee2a69590332061ed6d197c3e78c3a4c873207de and `frontends/shell/src/canvas/offsetFrame.ts:64-69` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:914c70ee30f1a5d5787af7b1be6daf1f76e9865f7a11afe5d5f46abe415f0682.
  - Pixels per unit are 2^z (`frontends/shell/src/canvas/WorkingCanvas.tsx:586-592` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:7db079f62472bd145439421123a3d5eca1b7e56d624cf13a2c20c8917ace76e4).
  - Every unit's cap is 131 072, so T(z) = min(131 072, 2^(23−z)).
  - T is set at every view-state tick (`frontends/shell/src/canvas/WorkingCanvas.tsx:2100-2101` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:492035cf508bfe6a1d291f5f9f62d03b3cf92aaa276873d635ee69165776435f).
  - It is tested only at a tick that is not dragging, where the origin moves to the view (`frontends/shell/src/canvas/WorkingCanvas.tsx:2127-2134` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f15c8865a6517c6bebf1535de9d4944fe3c1f0148fc69b0bc8b62fb2dfae66f7; `frontends/shell/src/canvas/offsetFrame.ts:166-173` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:86df76cb9480d0e7c2f71e4e1aa70ef7e3c68047b44fc16189b9b63f0c9e7c50). A crossing is that move.
- **The start: the fit view after load.** That is the one-shot auto-fit (`frontends/shell/src/canvas/WorkingCanvas.tsx:1551-1560` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:7ec05e1fe94fae155ac9101a9e3bd83e0f6ca9ac4042c4403872072a8afd00a3; `frontends/shell/src/canvas/WorkingCanvas.tsx:1766-1768` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:59e450f02da31da806c0ac92dbdc0c4d48bd6b43508bcb847770571ff141639f; `frontends/shell/src/canvas/extent.ts:126-149` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:40a796b6bad38530d77e313376cac0c39d61eb7b1f02fafb07091b6f2db167d7). Its own line carries z_fit and target (0, 0) (`frontends/shell/src/canvas/WorkingCanvas.tsx:1408-1410` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:c0b3f38febaf98ddf175fffbd3277d05f30bd753463150b4b68864721e3341a7).
  - It is reached by `setup()` as committed (`frontends/shell/e2e/pan-anchor.mjs:57-74` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:434b01ed90762242b6e6bb2d096f680ad85ddec506aef3289be68f353a378b03), launched through `attachOrLaunchExe` (`frontends/shell/e2e/lib.mjs:254-303` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:c1b8ca33e0378abfe8f754517fc8fc066cea2b953348b2e93ff8dc0b8fa7e86e) as in the diagnostic's Amendment 1 (c).
  - There is no resize, no setCam, no seam call and no other camera call.
  - z_fit is read from the fit line as in Amendment 1 (b), after the fit-line wait under setCam's own bound (`frontends/shell/e2e/pan-anchor.mjs:103` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:6875fe563e4745dd57081053e49c86577a33d350f670cdc8aba902118e5e2013). If no line arrives, the run stops before its first drag; that is recorded and not retried.
- **Each drag** is the suite's `drag()` (`frontends/shell/e2e/pan-anchor.mjs:108-117` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:92acefeaf4591735ad85038aed5d746bf52fcbc540f92798d362953ea8250527): from the canvas centre, 40 steps, dy = 0.
  - L = min(300, floor(cw/2) − EDGE_MARGIN_PX), the rule at `frontends/shell/e2e/pan-anchor.mjs:257` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1b5919511eb8092430a72dec679bd9702eaf3a89b50b9f275b482451525757b5.
  - d = (L − L/40) · 2^(−z_fit) world units per drag, net of the first-step deficit (`frontends/shell/e2e/pan-anchor.mjs:27-34` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:37335ec5bf25dcd3be502b2d2c34de0689ed368903daebfc3ddd5916e6418437).
  - n1 = floor(T(z_fit) / d) + 3, Amendment 1 (b)'s count.
- **The order:**
  - leg 1: n1 drags of dx = +L;
  - leg 2: n1 drags of dx = −L;
  - the closing pair: one drag of dx = +L, then one of dx = −L [OPEN-5].
  - That is 2·n1 + 2 drags in all.
- **What "the same drags back" means here.** Leg 2 is leg 1 with dx negated: the same count, L, steps, start pixel and settle. The closing pair is one drag each way. Each drag moves the view ±(L − L/40) CSS px net of the deficit, and the deficit is the same in every drag. So the run's motion sums to zero, and a correct product ends at the fit view: W_end = W_start within note 5's tolerance.
- **Why the closing pair.** The re-centre emits no line (the trace at `:2101` runs before `:2127`). So an origin move at a drag's settled tick shows only in the next line (Amendment 1 (b), its last two bullets). In a correct product, leg 2's last drag crosses (Amendment 1 (b)'s second crossing), and only a later line can show that origin change. The pair supplies those lines and crosses nothing in a correct product (drift at most d < T).
- **Estimate** (mine, from one run, not a measurement; the formula sets the count):
  - at the measure run's z_fit of −3.692532927362801, L = 300, d ≈ 3 781.7, T = 131 072, n1 = 37, so 76 drags (`state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:150` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:28f3856bd9dd1260da2e9e17b507d1d18025488605175466b126fd4ca57bbcee);
  - about 1.8 s per drag, by that run's rows (`state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:158-232` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:3593efab85fbf1971e39c9dbe6427be9386de15c4165e89372eac2968565df6e).

**4. The records, with no DEV hook.**
- **(a) Target plus origin at the start and at the end.**
  - What is read: the shipped `view-state` line (`frontends/shell/src/diagnostics/renderTrace.ts:52-53` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:8850456b01e6c9328a7ad04241fd5c80da88f7b9207119459b7a9f1e95382a02), with W = (targetX + originX, targetY + originY). That is the shell's own model (`frontends/shell/e2e/pan-anchor.mjs:12-14` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:787d5a520fd8427b616ed0188d33468345506dc365cab338dd8ff00e7ff68a4e).
  - Start: the fit line, the last line before drag 1.
  - End: the last line of the closing pair's second drag, read after its settle.
  - Where and by which clock:
    - node side, through the suite's own listener (`frontends/shell/e2e/pan-anchor.mjs:60-63` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:db4aa4d2cba1d84e793e86f767ce901663f43349ec516a3bd6e7c5b4327cfe29) with dg-measure.patch's receipt and push records, by node's `Date.now()`;
    - page side, through dg-measure.patch's `console.debug` wrapper, by the page's `Date.now()`;
    - the two clocks are mapped by the two clock checks of the diagnostic's note 1.
  - On every exit path: each node event is appended at once with `appendFileSync`. The page arrays go out by the bounded collection in `main`'s `finally`. `main().catch` appends the fatal text. An existing file name is refused, never overwritten (note 1, carried).
  - Not a DEV hook. The line is emitted by ungated product code in every build: `traceViewState` at `:1410` and `:2101`, with no DEV or instrumented check (consult, `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:181-184` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:436179436e21ad8b769fe7eb8419a2b8e566074e65e14ac2938d02f92de0d8d9, evidence). The wrapper is the instrument's own page code, installed by `page.evaluate` and registered on no surface of `frontends/shell/src/e2e-test-surface.ts`.
- **(b) Each change of the frame's origin.**
  - What is read: every pair of consecutive `view-state` lines, in arrival order over the whole run from the fit line, whose (originX, originY) differ.
  - Per change, the record holds:
    - both line numbers and the drag index;
    - the old origin, the new origin and ΔO;
    - the target on both sides of the change;
    - whether the change meets Amendment 1 (b)'s crossing test, (i) and (ii).
  - S = ΣΔO over every change.
  - The frame's own event list (`frontends/shell/src/canvas/offsetFrame.ts:128-130` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:e840e20e876f9c52666fc4d30eadb2cf5413d5be1a88c531048624216a111109) is page memory that no hook exposes on any build. The lines stand in for it, as in Amendment 1 (b).
  - Clocks, exit paths and the reason it is no DEV hook: as (a).
- **(c) One CDP screenshot at the start and one at the end.**
  - When, at the start: after the fit line and `readBox` (`frontends/shell/e2e/pan-anchor.mjs:76-90` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:ec6533a27146d37af75d599559ccce877b237092e1126c88e992386bce84f479), a settle, then the capture, then drag 1.
    - The settle is `waitForSettle` (`frontends/shell/e2e/lib.mjs:348-369` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:b8de0367e9d6ac10206551d7093797d650c401b30412c76e40fdfdd739afa1af, its defaults: 3000 ms quiet, 45 000 ms bound).
    - It runs over every `[render-trace]` console line, through `attachConsole` (`frontends/shell/e2e/lib.mjs:319-341` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:0d2bc00ab585c0f56d1a740cff7ba8df476d46524e70961f7a3df144b27a0a32), which is subscribed right after `setup()` returns.
    - Its `{settled, count}` is recorded.
  - When, at the end: after the closing pair's second drag, the same settle, then the capture, then the closing clock check and the collection.
  - How: one CDP call, `Page.captureScreenshot`, format png, clipped to the canvas box from `readBox` at scale 1. It is sent through the page's CDP session, opened the way the suite opens one (`frontends/shell/e2e/pan-anchor.mjs:182` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:bb6f4cd3f7fec3b0aca958f9c59678b57a0dfa93a41cc3506ff19c0a3015d8a2) [OPEN-7]. Node's `Date.now()` is taken before the call and at its return.
  - To scratch: the image is decoded from base64 and written at once, before any other await, with `writeFileSync` flag `wx`, as `rc-start.png` and `rc-end.png`. Its byte length and sha256 are then appended to the node file.
  - A failed capture or write is recorded by name and not retried; the run goes on. If the drags end early, no end capture is taken, and that is recorded.
  - Not a DEV hook. The capture is the browser's own devtools method, on the port the measure build opens from its compiled block (the diagnostic's Amendment 1 (a)), and it calls no app code. The DEV-only `capturePixels` (`frontends/shell/src/canvas/WorkingCanvas.tsx:2203-2204` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1139ff7c026c608309ee3b8c73b650f86d88a9588bb0d6ea4cb9acb6961a7423) is absent on this build and is not used. The surface's pixel posture (`frontends/shell/src/e2e-test-surface.ts:24-26` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f38924a07ed9fde4d00d2451dec86ab9eecca2363eb06bb15bb264dfbc60f39f) governs that surface, which this does not use. Both images stay in scratch, outside the repository.
- **The only other page reads and calls:**
  - `readBox`: a DOM and drawing-buffer size read, no hook.
  - `setup()`'s `openPath` (`frontends/shell/e2e/pan-anchor.mjs:66-71` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:439f1a056da7a59f67140e2cfe2e0c21412c93c45fde80bb9a3c3b982c175a87). It is an instrumented-build hook, not a DEV-only one (`frontends/shell/src/e2e-test-surface.ts:4-13` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:16b4d240dae78a84bef59c40d8e80c3ef740283090a807b7f61c753767b988c2; `frontends/shell/src/e2e-test-surface.ts:357-368` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:e9141daf17ef2e13ebc919eb20df4e437028b98514c8b41c8bfb5a488edd433e). It runs the admission code an operator's open runs (`frontends/shell/src/e2e-test-surface.ts:15-20` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:c9ad303418cc83ad88d2c6f7e409adec56bc1649b9d3164b7c5916b0115eeeb2). It opens the fixture and records nothing.
  - No DEV-only hook is called. `e2eSetViewState` is absent (`frontends/shell/src/canvas/WorkingCanvas.tsx:2319-2320` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:1139ff7c026c608309ee3b8c73b650f86d88a9588bb0d6ea4cb9acb6961a7423).
- **Also recorded:**
  - the exe's path, size and sha256 before the hold;
  - the `version` field of `node_modules/@deck.gl/core/package.json` in C:/dev/wt/dg (note 8);
  - the fixture's sha256 before and after;
  - the process lists and the 9223 checks (note 7);
  - the stall record of the diagnostic's note 1, kept and not read for the outcome [OPEN-4].
- **The instrument: a reverted worktree edit, as the diagnostic's was.** One new patch, made from dg-measure.patch (sha256 above), with only these changes:
  1. the closing pair in place of the single closing drag;
  2. the `attachConsole` subscription, the two settles and the two captures, with their records;
  3. the scratch prefix and tag `rc`.
  - Its sha256 is recorded. It is applied, `git diff | sha256sum` is checked equal, it is reverted after the run, and the porcelain is shown empty.

**5. The prediction, declared here before the run, in the human's two outcomes.**
- **Definitions.**
  - E = W_end − W_start, in world units, per axis.
  - S = ΣΔO, from note 4 (b).
  - z is the end line's zoom; the drags change no zoom.
  - E is put against the tolerance in buffer px: E_px = (E_x · 2^z · bw/cw, E_y · 2^z · bh/ch). This is the formula at `frontends/shell/e2e/pan-anchor.mjs:262` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:649858ee4cf0f69616e366651847bdcec56d9070c4e7dcba74fa783fb9d6b26b, with y added as at `frontends/shell/e2e/pan-anchor.mjs:121-127` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:79f7483c79fbb38d6070767a54df13ea37e8da28dad6c0c869d12190b6900e26.
  - bw/cw and bh/ch are measured from the element by `readBox`, never an assumed DPR (`governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:147-152` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:9ed427ba63e8986d9afa7bef23824f1a0dbed14a194ac604f827b6e4db5d27e1).
  - The tolerance is 4.0 buffer px (`frontends/shell/e2e/pan-anchor.mjs:45` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:ffb43e0f9b4aefc7735146467b19c14463e3401c650392e2da53af560cd2a912), frozen at `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:121-137` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:9ff4e88e4e8104e28a211dd0140264e20c71d189b1e6cb9a466f3c681cd30f4b.
- **The screenshot rule.** The reading script decodes both PNGs with node's own zlib; nothing is installed.
  - Unequal dimensions: recorded, and the comparison is unreadable.
  - B, the background: the most frequent exact RGB on the start image's outermost one-pixel ring. The fit leaves a margin (`frontends/shell/src/canvas/extent.ts:126-149` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:40a796b6bad38530d77e313376cac0c39d61eb7b1f02fafb07091b6f2db167d7, its margin fraction and usable box).
  - A pixel is marked when any channel differs from B by more than 8.
  - N is the marked count. C is the marked pixels' mean position, scaled to buffer px by bw/cw on x and bh/ch on y.
  - The pair **differs** iff either:
    - |N_end − N_start| > 0.10 · max(N_start, N_end); or
    - both N are above 0 and |C_end − C_start| > 4.0 buffer px.
  - It does not differ otherwise.
  - It is unreadable if N_start is 0 or N_start is every pixel.
- **Precondition.** At least one origin change after drag 1, meaning the drags crossed the bound. With none, the run is reported as one whose drags did not cross, and neither outcome is read.
- **Real**, all of:
  - |E_px| > 4.0 on x or on y;
  - |E − S| ≤ d (Euclidean, world units, d from note 3);
  - the pair differs.
  - Why *about* is fixed at d: under the reading being tested, E − S is the local target's own net change, which mirrored drags return to zero up to what a settled tick adds. d is one drag's world length. The measure run's local target ended 478.37 units from zero at drag 74 (`state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:266` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f16c3f9a56e75d6817f99a0bf0013ab805f63b8b29f3d226b348a8effca42d54), against |S| above T.
- **Dismissed:**
  - the condition: |E_px| ≤ 4.0 on x and on y;
  - the pair's result is reported beside it [OPEN-1];
  - the un-rebased target in the measure run's trace is then explained [OPEN-2].
- **Any other reading** is reported to the human with its fields; it is not a third outcome. For example:
  - E over the tolerance with |E − S| > d;
  - Real's trace conditions met with a pair that does not differ, or is unreadable.
- **The prediction: Real.**
  - Basis:
    - the measure run's off-script lines and their lookup (Authority, evidence);
    - H1;
    - the handler's path at `frontends/shell/src/canvas/WorkingCanvas.tsx:2077-2147` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:068d4f65874eff32db56fe0c776d81136915a4a0a1884988bfa53a4f754cdef5.
  - Expected if z_fit repeats (an estimate from one run; the rule decides, not these numbers):
    - origin changes at drags 35 to 39;
    - S_x ≈ −675 731 and E_x ≈ −675 253 world units, so E − S ≈ 478;
    - |E_px,x| ≈ 52 000 × bw/cw;
    - an end image whose N is near 0.
  - Recomputed from the crossings and lookups at `state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:236-274` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:371c2488d9098a048fb904ec987097acdca3f617832db096f60391e9090fda40; my arithmetic.
- **The machine rule.** The run has no PASS/FAIL line (its results list stays empty). An unsettled drag or settle is recorded by index and read as it stands. A timing-sensitive failure in a shared run is not recorded as a failure.

**6. H1, and only H1.**
- What H1 is (consult, Authority line): a reading of the installed library. In `frontends/shell/node_modules/@deck.gl/core/dist/lib/deck.js` lines 1044-1056 (untracked, 9.3.9; evidence, not Authority), the handler returns nothing, so deck takes the callback's own view state. It writes that state under the view's id over the root that the snap at `:2132` just set (that library file `:323-328`), and the ViewManager reads the per-view entry first.
- **For H1, in the records:**
  - at each origin change, the next line's target equals the previous line's target (Δtarget ≈ 0, not ≈ −ΔO);
  - origin changes repeat on consecutive drags while hypot(target) > T, each ΔO equal to the previous line's target (Amendment 1 (b)'s (ii));
  - E ≈ S within d;
  - the pair differs.
- **Against H1:**
  - the next line's target is rebased (≈ previous target − ΔO);
  - origin changes come only where the world drift passes T, at Amendment 1 (b)'s worked drags k1 and 2·n1;
  - E is within the tolerance;
  - the pair does not differ.
- **A mixed reading**, such as an un-rebased trace with an undisplaced image, counts against H1's displacement and goes to the human.
- **Limits.** The records show what deck's callback carried and what the screen showed. They can be consistent with H1. They cannot show which library line overwrote the snap. Nothing else is tested, and no fix is proposed.

**7. The run.** One run, tag `rc`, under the measure run's quiet condition (the diagnostic's note 3, run quiet, and Amendment 1 (d): `governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md:55-58` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:d1033af68ead43c9243c7d1aa297b3a87134ef45a54b356dc22266dfc10e1005; `governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md:177-184` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f02df42b3408a07bcb0ebaee463434c4da1a6d8fd8287904bf8b4b445be993b0).
- **Dispatch.** The custodian sends the brief only when no other SpatialIDE heavy run is in flight, and dispatches none from it until the report.
- **Before the hold:**
  - one process list: the diagnostic's kinds plus `spatial-ide-shell`, each with its command line or path. If a heavy process is rooted in the repository or one of its worktrees, the worker stops and reports. There is no wait loop.
  - a listen check on 9223. If anything listens there, the worker stops, since the launch route attaches to whatever listens.
  - the exe and worktree checks of note 2.
- **In the hold:** one Bash call inside `hold shared -Project SpatialIDE`, from `frontends/shell` in C:/dev/wt/dg, under a hard `timeout 1500`.
  - Stamps come from `date -u`.
  - The fixture's sha256 is taken before and after.
  - `--measure` is never passed and `validate` is never used.
  - No dev server is started; 5180 and 5400 are not touched.
  - The process list is taken again at the suite's start and at its end.
- **After:**
  - the session stop kills the exe it launched (`frontends/shell/e2e/lib.mjs:305-314` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:e4d202104d8cdbc0fe26bcf190fdcda2ef0efb108ca44ee1d59d5daef9db35fd);
  - a process list and a 9223 check after release;
  - `measure-app.log` and the session log copied right after the run, each with its sha256.
- Nothing is committed, retried or fixed. Exit codes (124 included) and fatal lines are recorded as they come.

**8. The deck.gl fact.**
- **Recorded here as the custodian's git reading** (`git log -G` over `frontends/shell/package-lock.json`, at the commits named):
  - the lockfile has resolved `@deck.gl/core` 9.3.9 since the shell's scaffold, f827be01 (2026-08-09), the only commit whose diff touches that line;
  - it held 9.3.9 at 9ae12697 (2026-09-15), where the settled-tick note landed.
- **The code's notes name 9.3.7** while saying that the lockfile installs 9.3.9: `frontends/shell/src/canvas/WorkingCanvas.tsx:2083-2091` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:e11c719c9c09b831d8bd8b32388d707e389d5c1cf09c66cb60d1f70e83049b16, `frontends/shell/src/canvas/WorkingCanvas.tsx:100` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:5867fa57a4e1d9dc63f465006304233155e48457ffcaed7e043877bb3b35a3c5 and `frontends/shell/src/canvas/WorkingCanvas.tsx:2229-2230` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:97d002afb24a4b4e81be8776d7183df4d9e0ee8427509622625d6e3ed31cefce.
- **The run adds** the installed version in the worktree that built the exe (note 4), as evidence.
- **Bearing on H1.**
  - H1 was read in the installed 9.3.9.
  - By the lock, the settled-tick fix of 2026-09-15 was measured with 9.3.9. So no deck version change between that measurement and this run explains a displacement.
  - The 9.3.7 in the notes is a label the lock history does not support. Whether `deck.js:1044-1056` differs in 9.3.7 is not read.
- **My reading, from the code (not a finding; it is handed on in note 10): the frozen suite could not see this displacement.**
  - recenter-crossing-A reads s1 as the last line (`frontends/shell/e2e/pan-anchor.mjs:270-277` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:b6dc22f011a58e98f904675d2011f89b86d3a1f80d2b8e291c5d2b8871184d9d). The handler writes that line before the gesture-end re-centre (`:2101` before `:2127`).
  - there-and-back runs at zoom −1 (`frontends/shell/e2e/pan-anchor.mjs:256-265` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:fdd87d3fed41eaa09a6655a78ddf3fd8e0566e5d000e3ae7825e393855ef8a40). There a 300 px drag is about 600 world units, against a bound of 131 072.

**9. The deliverable.**
- The worker's final message is its report. The custodian files it byte for byte under state/consults/.
- The node and page files, both images, the patch, the logs and the process lists stay in the worker's scratch folder outside the repository, each with its sha256 in the report: evidence, not Authority.
- No committed file changes from the worker. The custodian's form commit and PLAN rows are records.
- §21c's four bounds hold (note 1), and §21b's route is open.

**10. The gate, and what is handed on.**
- **The gate:** a single reviewer under §21b, as the diagnostic's Amendment 1 (f). It checks:
  - the `Out-of-scope` line first;
  - the exe's size and sha256, the worktree HEAD and the porcelain before the hold;
  - the new patch, by its sha256, against note 4's three changes from dg-measure.patch: no setCam, no seam call, no `capturePixels`, no resize, no hook call but `openPath`, and no added wait but the fit-line wait and the two settles;
  - the drag count by note 3's formula from the recorded z_fit;
  - the worktree clean after the revert;
  - the quiet condition and the 9223 checks;
  - note 5's fields, recomputed by its own script with its own image decode from the files by their sha256, and which outcome's conditions they meet;
  - that nothing was committed, retried or fixed.
  - The run is not re-observed.
- **If Real**, the human's item 5 (b) names what follows [OPEN-3]. This form hands on:
  - the records by sha256;
  - note 5's fields;
  - the list of origin changes;
  - the two images;
  - note 6 against the records;
  - note 8's fact and its reading of the suite;
  - the version labels at the three `WorkingCanvas.tsx` notes.
  - The later form, the fix's shape and its test are not drafted here.
- **If Dismissed:** [OPEN-2].
- **Any other reading** goes to the human.
- In each case pan-anchor-setcam-waits-for-its-own-reset follows, by its dependency (`governance/PLAN.yaml:5525-5527` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:66222f7153e7d139cf5a81a0aaba572de68f00c5a69cf3b9c140e5217646422f).

**11. Rule (00), strings, constitution.**
- **Rule (00).** No committed path is claimed.
  - pan-anchor.mjs is edited uncommitted in C:/dev/wt/dg only.
  - Pan-anchor's branch holds that file at 624b2e68 (local) and is blocked on this node. This piece does not touch it.
  - The custodian rechecks at dispatch against the pieces in progress and the PRs awaiting merge.
- **Strings.** None. No P6 placeholder is needed.
- **Constitution check:**
  - docs/01 principle 8: the frame reads re-centring as an observable transform (`offsetFrame.ts:128-129`, within the cite above). A Real reading bears on it, which is why the later form is the full one.
  - ADR-010 rule 1 (`docs/adr/ADR-010-render-frames-origins-boundaries.md:17-27` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:73dee6ea56400ce37ca93f0349461ebaa78feb8a4471513ed89a1a8a89713378): only the shell's own trace is read. The image centroids are screen positions inside the instrument and never become a coordinate.
  - ADR-010 is architect-blockable; ADR-011 is not cited.
  - docs/08: no number is claimed.
  - ADR-006, docs/02 and docs/10: untouched, and nothing is under protocol/.
  - The seam rule: the instrument consumes the real `attachOrLaunchExe`, `attachConsole` and `waitForSettle` and the real `view-state` shape. No `pub` item, callback or option lands.

## The reuse index (as given in the brief, byte for byte; the misses are noted in Authority)

    $ node tools/reuse.mjs recentre origin rebase view state deck viewport   (exit 1)
    No prior art recorded for "recentre origin rebase view state deck viewport". Research it before planning an implementation.
    $ node tools/reuse.mjs pan drag origin move displaced view   (exit 1)
    No prior art recorded for "pan drag origin move displaced view". Research it before planning an implementation.
    $ node tools/reuse.mjs cdp screenshot e2e webview2 compare   (exit 1)
    No prior art recorded for "cdp screenshot e2e webview2 compare". Research it before planning an implementation.

## The custodian's settlement (class 1, before any run)

- **The carried text.** Everything above this section is the architect's draft (`state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-form-architect-draft.md`, read only at main 8e09470c; extracted sha256 c152706c1e5fe32c49c78ce8570d7953d242ab039802d375c90acc78e8f2db37), carried byte for byte from its fenced block, with one change, the custodian's: each `sha256:<H>` pin is filled by script with the sha256 of the cited whole lines, each with its LF, at 8e09470c (68 pins, 66 distinct ranges). The draft's OPEN items, gate findings and reading list stay in the filed draft.
- **OPEN-1 (A) and OPEN-3 (A)** are the human's words of item 5 (b) as given (`state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md`): the dismissal condition as worded, the pair reported beside it; and on a reproduced defect, the full form at once. Each (B) would change a ruled item and is not taken. Both are told to the human.
- **OPEN-5**, the closing pair of drags, adds to the run shape the human ruled and is a red line: it is put to the human for a typed answer. The run takes (A), as drafted above, only on the human's typed (A). If no typed answer has come when the quiet condition holds at dispatch, the run takes (B), the human's ruled shape, under the variant below, which the architect wrote at the custodian's request and which replaces the matching text above only.
- **OPEN-2 (A), OPEN-4 (A), OPEN-6 (A) and OPEN-7 (A)**, none a red line, are the draft's recommendations, taken on 2026-11-11 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 9), for the human's review: an architect consult after a dismissal; the stall record and seam wrapper kept and not read; a new local branch at 00bcb07d in the diagnostic's worktree, never pushed; a raw `Page.captureScreenshot`.
- **The base (the draft's first gate finding), checked by script at this commit:** `git diff --name-only` from 00bcb07d to 8e09470c names no file outside state/, governance/ and site/, so the exe's whole tree equals main's product tree here. It is checked again at dispatch.
- **The draft's other gate findings** (the 9.3.7 labels in WorkingCanvas.tsx; the frozen suite not seeing the displacement) are for the later form, if one follows, and are recorded here. The PLAN node's gate is this form from this commit; its budget stays the node's sixty, an estimate and not a measurement.
- **The quiet condition.** At this commit slot 1's R3-2 worker runs cargo, so the run is dispatched after its hand-back, with no other SpatialIDE heavy run in flight.
- **Rule (00)** at main 8e09470c, `git diff --name-only origin/main...<branch>` against the instrument's file and the canvas folder: `cut/b2-piece-1c-save-and-reopen` (PR #307): frontends/shell/src/canvas/WorkingCanvas.tsx, frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx, which this piece reads in the exe at 00bcb07d and edits nowhere; `cut/pan-anchor-setcam-waits-for-its-own-reset` (local worktree, held): frontends/shell/e2e/pan-anchor.mjs at 624b2e68, local; no other branch in flight touches the instrument's file or the canvas folder. It is checked again at dispatch.

### The OPEN-5 (B) variant (the architect's text, carried byte for byte, pins filled the same way: 2 pins)

OPEN-5 (B) variant: if the human's typed answer has not come by the time the quiet condition holds, the run takes (B), the human's ruled shape with no closing drags. Under (B), only the items below change, each one replacing the matching text above. Everything else in notes 1 to 11 stands as written.

**What (B) cannot record that (A) would.** (B) has no line after the settled tick of leg 2's last drag. So an origin change at that tick, which a correct product makes, is never recorded as a change: only the end line meeting Amendment 1 (b)'s crossing test (i) shows it, and S leaves it out.

**Note 3.**
- **The order:**
  - leg 1: n1 drags of dx = +L;
  - leg 2: n1 drags of dx = −L.
  - That is 2·n1 drags in all, with no closing drag.
- **What "the same drags back" means here.** Leg 2 is leg 1 with dx negated: the same count, L, steps, start pixel and settle. Each drag moves the view ±(L − L/40) CSS px net of the deficit, and the deficit is the same in every drag. So the run's motion sums to zero, and a correct product ends at the fit view: W_end = W_start within note 5's tolerance.
- **Replacing the bullet on why the closing pair exists.** The re-centre emits no line (the trace at `:2101` runs before `:2127`). So an origin move at drag 2·n1's settled tick has no later line. In a correct product that drag crosses (Amendment 1 (b)'s second crossing). Its last line is written before that re-centre. The re-centre re-expresses the same world point in the new frame (`frontends/shell/src/canvas/WorkingCanvas.tsx:2127-2134` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f15c8865a6517c6bebf1535de9d4944fe3c1f0148fc69b0bc8b62fb2dfae66f7). So that line's W is the point a correct product shows, and only the origin change itself goes unrecorded.
- **Estimate** (mine, from one run, not a measurement; the formula sets the count): at the measure run's z_fit, n1 = 37, so 74 drags. The end line is then drag 74's last line, the line the measure run reported (`state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate-measure-reviewer.md:266` @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:f16c3f9a56e75d6817f99a0bf0013ab805f63b8b29f3d226b348a8effca42d54).

**Note 4.**
- **(a) The end line.** The end is the last line of drag 2·n1, read after its settle. The record also notes whether that line meets Amendment 1 (b)'s crossing test (i), hypot(target) > T(zoom).
- **(b) What it covers.** Every origin change that a later line shows, from the fit line to the end line. An origin change at drag 2·n1's settled tick has no later line. It is not recorded and is not in S. The end line's (i) result, recorded under (a), is the only sign of it.
- **(c) The end capture.** After drag 2·n1, the same settle, then the capture, then the closing clock check and the collection. The capture comes after any re-centre at that drag's settled tick, so it shows the screen that the trace cannot.
- **The patch's change 1.** It deletes dg-measure.patch's single closing drag, the plan's leg-3 entry, so the plan holds legs 1 and 2 only. Changes 2 and 3 are unchanged.

**Note 5.**
- **Fields.** One field is added: whether the end line meets (i), from note 4 (a).
- **Conditions.** Real, Dismissed and any other reading are unchanged. In a correct product, S holds only the first crossing's move, so |E − S| ≈ k1·d > d, and the reading falls to Dismissed by E alone.
- **A new case of any other reading.** If the end line meets (i) and the trace's conditions for Real fail while the pair differs, the reading goes to the human with its fields, since the move that the trace leaves out may be the one the image shows.
- **The prediction.** Real stands. The expected numbers stand, read at drag 74's last line.

**Note 6.**
- **For H1.** Unchanged, plus one item: the end line does not meet (i). In the measure run, the local target was near 0 at drag 74, at the gate report line cited under note 3.
- **Against H1.** In place of origin changes at k1 and 2·n1:
  - one recorded origin change, at k1;
  - the end line meets (i), with no line after it.
  - The rebased next-line target, an E within tolerance and a pair that does not differ stand as written.

**Note 10.**
- **The gate's checks:**
  - the patch check reads change 1 as the deletion of the closing drag;
  - the drag count is 2·n1, from the recorded z_fit;
  - the reviewer recomputes the end line's (i) result with note 5's other fields.
- **The hand-on adds one fact.** Under (B), an origin change at the last drag's settled tick is unrecorded, so the later form must not read S as complete when the end line meets (i).

**The budget.** It stays at 60 minutes. The two drags fewer take about 3.6 s, by the measure run's rows.

## Amendments (opens empty; append-only)
