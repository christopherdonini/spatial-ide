# shell: after a pan crosses the re-centring bound, the view stays where it was — the re-centre's camera move is returned from deck's view-state callback instead of written by `setProps` inside it; full form, both gates

*File: `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md`. PLAN node `recentre-crossing-view-displaced-fix` (C1), slot 2, S1.*
*Drafted by the architect (claude-opus-5-5) on 2026-11-12 for the custodian. The custodian commits it before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, with both gates from dispatch. The human ordered this in their message of 2026-11-11 (21:49Z), item 5 (b), last paragraph (C6).*
*Code starts when OPEN-1 is settled (§14).*

## §0 Disclosure

**0.1 Authority.**
- The human's message of 2026-11-11 (21:49Z), item 5 (b) (C5; its last paragraph, C6).
  - The candidate, its readings and the reproducer's outcomes bind this form.
  - S1, the full form, both gates and slot 2 at once.
  - The architect proposes the fix's shape.
  - Slot 1 keeps PR #307.
  - v0.2 does not tag with this defect on main.

**0.2 Evidence, not Authority.**
- The reproducer's form, `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md`, cited by note: note 3 (the drags), note 4 (the records), note 5 (the outcomes and the image rule), note 8 (the deck.gl fact and the frozen suite's blind spot) and note 10 (what it hands on).
- Run rc's report (C7–C11).
- Its single reviewer's PASS: `state/consults/gates/2026-11-12-recentre-crossing-view-displaced-by-origin-move-gate-rc-reviewer.md`, filed sha256 ff082b51eea36f271782cdeaedce8a20d8a36383cf8bcc084ecff351e7fb6acf, cited whole.
- The diagnostic consult's H1 and H2 (C12, C13).
- deck's installed source, D1–D20. It is untracked and read for what it does; it is not Authority.

**0.3 The reuse index.** Byte-copied from the custodian's brief and marked so. The custodian ran it in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-12.

```
$ node tools/reuse.mjs deck view state callback overwrite recentre snap origin   (exit 1)
No prior art recorded for "deck view state callback overwrite recentre snap origin". Research it before planning an implementation.
$ node tools/reuse.mjs view state controlled deck onViewStateChange snap
No prior art recorded for "view state controlled deck onviewstatechange snap". Research it before planning an implementation.
(exit 1)
$ node tools/reuse.mjs world origin rebase precision float32 pan
No prior art recorded for "world origin rebase precision float32 pan". Research it before planning an implementation.
(exit 1)
```

Misses: all three searches found no prior art. The research behind §1 and §2 is a reading of deck 9.3.9's own source (D1–D20).

**0.4 Cites.**

Tracked cites are all at main, `@ 7d7261a7ccfe3ffe605499b460338d0dd10e3055`. The custodian computes each `<H>` as sha256 over the cited whole lines, LF bytes.

PLAN and the human's message:
- C1 `governance/PLAN.yaml:5571-5587` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:10951b541db1893af659e0e982e55bb55b5c049f0069ee8160061e1ae7dbe918
- C2 `governance/PLAN.yaml:5520-5536` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:aa44d88395a8669f1a8d2090f156e3a2a136b0cdabb89b41d77b9aeb2be7ddbf
- C3 `governance/PLAN.yaml:5554-5570` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:691a5fbab16c65cb38e61336f5e522f77aa78805b6655b0ae093eabde95bff3b
- C4 `governance/PLAN.yaml:5741-5757` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:e059260fa5b5c74bd2c7ac9ff2a0381ef9700e01f60a911f475ea3e52b1dffcd
- C5 `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:20-23` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:6a2380ae52ae36c75c7fd8f2c46b0fef5826ac7d9fdff5e8f56a0b4f6600ffb2
- C6 `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:23` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:14d12430bf2bd4c8b8dc9e2bb9cb8d4221df092f702f3763c00e99f873b22f56

Run rc's report:
- C7 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:73-74` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:0924ca40677132750db18607578e71bac1bf72737e56b8150b1fadd7c982b145
- C8 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:75-76` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:6f7731105d5502ed7e712ce79d2e11459d606636d341bffdb42008bea38e3a28
- C9 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:78-81` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:c3c8af207ad950bd2446cf2036f9dfbb15e8f6a80e9f3c674a00ba820391f34c
- C10 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:82-86` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:afe0a33ce2bf121cc7d9a29c5bc1991025b99c34d5eea71183f9a605fa3f06d7
- C11 `state/consults/2026-11-11-recentre-crossing-view-displaced-by-origin-move-run-worker-report.md:88` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:36ae2b71ef74f9d7f71468226839714618d8551011cee356c1c270c82adbb030

The diagnostic consult:
- C12 `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:231-239` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:3d706e201262d078007647c5e5f0527cab24941cb46f01b0209ace9259c86918
- C13 `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md:240-243` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:464274555150e4d5b179aa7e9ed0e24050b14b98a910b50f85fe59c6e3a68579

`WorkingCanvas.tsx`:
- C14 `frontends/shell/src/canvas/WorkingCanvas.tsx:95-111` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:b3da62e9e8218bad21a8d89bb25c51078e49f20b39323852b49a2c96d40a0e09
- C15 `frontends/shell/src/canvas/WorkingCanvas.tsx:443-484` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:4da82977381737dc3e32966cc3de3abb483d41f9ce22945759148ccf03aedaa3
- C16 `frontends/shell/src/canvas/WorkingCanvas.tsx:586-592` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:7db079f62472bd145439421123a3d5eca1b7e56d624cf13a2c20c8917ace76e4
- C17 `frontends/shell/src/canvas/WorkingCanvas.tsx:1408-1417` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:2424d76eb22f0e503268344dbd6852c738457b067621760c65df4f96ba8035fd
- C18 `frontends/shell/src/canvas/WorkingCanvas.tsx:2035-2041` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:60a799d2d9fdd9386b6a1783ef1d603a987ec05527becb4608e20ac4f66e00b8
- C19 `frontends/shell/src/canvas/WorkingCanvas.tsx:2077-2147` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:068d4f65874eff32db56fe0c776d81136915a4a0a1884988bfa53a4f754cdef5
- C20 `frontends/shell/src/canvas/WorkingCanvas.tsx:2083-2091` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:e11c719c9c09b831d8bd8b32388d707e389d5c1cf09c66cb60d1f70e83049b16
- C21 `frontends/shell/src/canvas/WorkingCanvas.tsx:2101` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:7e7f3ffdefbb340eb20817fe87b8123a7adbe1b9f25c2ff93bffe68215186ec4
- C22 `frontends/shell/src/canvas/WorkingCanvas.tsx:2103-2111` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:4e3b82667a32c189b1d63e965209c5980f8f8abeb79e241242ff7dab95caf201
- C23 `frontends/shell/src/canvas/WorkingCanvas.tsx:2113-2126` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:f5f257d2285861e670b1224ce4f53b134a239575c85125f41f2f10f29414d4a4
- C24 `frontends/shell/src/canvas/WorkingCanvas.tsx:2127-2134` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:f15c8865a6517c6bebf1535de9d4944fe3c1f0148fc69b0bc8b62fb2dfae66f7
- C25 `frontends/shell/src/canvas/WorkingCanvas.tsx:2136-2146` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2
- C26 `frontends/shell/src/canvas/WorkingCanvas.tsx:2229-2230` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:97d002afb24a4b4e81be8776d7183df4d9e0ee8427509622625d6e3ed31cefce
- C27 `frontends/shell/src/canvas/WorkingCanvas.tsx:2319-2357` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:06f0c6307c0e81f73ff654b651bf6dc745c1b22829a647bc8227c872fdcfe61c

`offsetFrame.ts` and `renderTrace.ts`:
- C28 `frontends/shell/src/canvas/offsetFrame.ts:38` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:35cd05fac57a9937e57abb9bee2a69590332061ed6d197c3e78c3a4c873207de
- C29 `frontends/shell/src/canvas/offsetFrame.ts:64-69` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:914c70ee30f1a5d5787af7b1be6daf1f76e9865f7a11afe5d5f46abe415f0682
- C30 `frontends/shell/src/canvas/offsetFrame.ts:84-91` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:1b84765adb721dc6c3c2678e75e1c5195464edabf4a4690ef5e513b4355296af
- C31 `frontends/shell/src/canvas/offsetFrame.ts:128-130` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:e840e20e876f9c52666fc4d30eadb2cf5413d5be1a88c531048624216a111109
- C32 `frontends/shell/src/canvas/offsetFrame.ts:166-173` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:86df76cb9480d0e7c2f71e4e1aa70ef7e3c68047b44fc16189b9b63f0c9e7c50
- C33 `frontends/shell/src/canvas/offsetFrame.ts:187-193` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:865ba3daa7c3afc1e66f413a937f0fa210db478a06d5e65e1a1ff2fc7075d5b9
- C34 `frontends/shell/src/canvas/offsetFrame.ts:196-198` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:49fdf6bff202bedd76a55aa3c866ff929a7a3baf85f353eadd26e8b9674a374b
- C35 `frontends/shell/src/diagnostics/renderTrace.ts:52-53` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:8850456b01e6c9328a7ad04241fd5c80da88f7b9207119459b7a9f1e95382a02

The e2e files:
- C36 `frontends/shell/e2e/pan-anchor.mjs:27-34` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:37335ec5bf25dcd3be502b2d2c34de0689ed368903daebfc3ddd5916e6418437
- C37 `frontends/shell/e2e/pan-anchor.mjs:38-45` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:7392b161f817b6d222ae5313a79cc12edea4426687f74d3136070399fcf714a8
- C38 `frontends/shell/e2e/pan-anchor.mjs:47` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:f80b62fd5d680a146f1f9dd0b7ac744f2bee71c1ffdc0ba21e20b3cb2b70e2be
- C39 `frontends/shell/e2e/pan-anchor.mjs:57-74` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:434b01ed90762242b6e6bb2d096f680ad85ddec506aef3289be68f353a378b03
- C40 `frontends/shell/e2e/pan-anchor.mjs:108-117` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:92acefeaf4591735ad85038aed5d746bf52fcbc540f92798d362953ea8250527
- C41 `frontends/shell/e2e/pan-anchor.mjs:256-265` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:fdd87d3fed41eaa09a6655a78ddf3fd8e0566e5d000e3ae7825e393855ef8a40
- C42 `frontends/shell/e2e/pan-anchor.mjs:266-277` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:46f5573427f570cbc25e7dcbfcb9a69e73c8ba12ace32ad29e97c4d535e36f54
- C43 `frontends/shell/e2e/lib.mjs:254-303` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:c1b8ca33e0378abfe8f754517fc8fc066cea2b953348b2e93ff8dc0b8fa7e86e
- C44 `frontends/shell/e2e/lib.mjs:319-341` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:0d2bc00ab585c0f56d1a740cff7ba8df476d46524e70961f7a3df144b27a0a32
- C45 `frontends/shell/e2e/lib.mjs:348-369` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:b8de0367e9d6ac10206551d7093797d650c401b30412c76e40fdfdd739afa1af

Tests and forms:
- C46 `frontends/shell/src/canvas/WorkingCanvas.test.ts:745-832` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:b8bd6e1c302f5fd7ae27374ced18634616aaa0cc7aef0edb017ae44e2166dd48
- C47 `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:121-137` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:9ff4e88e4e8104e28a211dd0140264e20c71d189b1e6cb9a466f3c681cd30f4b

ADR-010:
- C48 `docs/adr/ADR-010-render-frames-origins-boundaries.md:17-29` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:7c2b22ba978cad8e12f9a9c5444e1ff810fa482144312307dd572ba2c450b760
- C49 `docs/adr/ADR-010-render-frames-origins-boundaries.md:49-53` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:aa32d272aeff8e0922fdb8ecfeb7a4d64f847ee161950d261cc1f8e0b3fdbbe5
- C50 `docs/adr/ADR-010-render-frames-origins-boundaries.md:60` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:be277293dba27e8bd51413fe584d5e941909cbc752f00ce685251271cebb68bc
- C51 `docs/adr/ADR-010-render-frames-origins-boundaries.md:62-68` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:7d1c18cb9638deee9306da75fabdafad70229a951e0ec2bbdd21fa560be750bb
- C52 `docs/adr/ADR-010-render-frames-origins-boundaries.md:70-74` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:fd39e8cc8ee350a3357220995afcf14d40665313174eb4424ce44c1e57514843
- C53 `docs/adr/ADR-010-render-frames-origins-boundaries.md:76-87` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:cd36626523e0ba9fd4ecf243e40a51af38bc83bef3e6e33517cfaf371defbe85

AUTONOMY:
- C54 `governance/AUTONOMY.md:315-332` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3
- C55 `governance/AUTONOMY.md:347-357` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31
- C56 `governance/AUTONOMY.md:377-391` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:4a1d62ba32834af517cb2664487a4647b992ef6cf4aabf218c401fbaa50cc3e2
- C57 `governance/AUTONOMY.md:482` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669

Records and the rest:
- C58 `frontends/shell/MANUAL-WALKTHROUGH.md:164-166` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:d70c7f6022abded71add3930a17d8218311b0971697ae71382748f004176f79a
- C59 `KNOWN-LIMITATIONS.md:230-246` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:6e910433f890cc242908485e735806c4162a56c0d9b61dba68b6b74a4b476eec
- C60 `frontends/shell/e2e/README.md:760-768` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:9595a3020d26b94e97007200a36418dcc60930af32bb9c06f3bef38fd6ff9f34
- C61 `state/directives/2026-10-06-machine-script-adopted.md:12-22` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1
- C62 `frontends/shell/package.json:25-48` @ 7d7261a7ccfe3ffe605499b460338d0dd10e3055 sha256:b77136d5455323ba5f557d6b57376671d766052d6aa0571c34790456ab3808cc

The deck cites are package-relative into `@deck.gl/core` 9.3.9, as installed under `frontends/shell/node_modules/` (its `package.json`, version field). They are untracked and carry no hash.

`dist/lib/`:
- D1 `deck.js:323-328`: the `initialViewState` deep-equal overwrite.
- D2 `deck.js:831-833`: `_getViewState`.
- D3 `deck.js:1044-1057`: `_onViewStateChange`.
- D4 `deck.d.ts:153`: the callback's return type.
- D5 `view-manager.js:93-98`: `getViewState`, per-view entry first.
- D6 `view-manager.js:182-194`: `_setViewState`.
- D7 `view-manager.js:212-235`: `_updateController`.

`dist/views/`:
- D8 `view.js:51-58`: `getViewStateId`.

`dist/controllers/`:
- D9 `controller.js:77-119`: `handleEvent` and the `controllerState` getter.
- D10 `controller.js:158-168`: `setProps` into `processViewStateChange`.
- D11 `controller.js:169-170`: inertia.
- D12 `controller.js:226-240`: `updateViewport`.
- D13 `controller.js:294-320`: `_onPanMoveEnd`.
- D14 `controller.js:528-544`: `_onDoubleClick`.
- D15 `controller.js:615-629`: `_getTransitionProps`.
- D16 `orthographic-controller.js:312-321`: a 300 ms `LinearInterpolator`.
- D17 `transition-manager.js:16-31`: a transition frame calls `onViewStateChange`.
- D18 `transition-manager.js:47-75`: `processViewStateChange`, which cancels a transition.
- D19 `transition-manager.js:80-84`: `_isTransitionEnabled`.
- D20 `transition-manager.js:92-106`: `_shouldIgnoreViewportChange`.

## §1 The defect, from the records

**1.1 What run rc showed.** These are the report's own fields; no new numbers are added here.
- The plan and the canvas box (C7).
- The start line and the end line (C8).
- Five origin changes. Each has dTarget (0, 0), and each ΔO equals the previous line's target (C9).
- S, E, |E − S| ≤ d, and the screenshot pair differs (C10).
- Real's three conditions hold (C11).
- Its single reviewer recomputed every field equal and gave PASS (§0.2).

**1.2 H1 (C12) is confirmed by deck 9.3.9's source, read against those records.**
1. The re-centre's camera move is a `setProps({ initialViewState })` call inside `onViewStateChange` (C24). The handler returns nothing (C19).
2. deck takes the new value into its own view state when it is not deep-equal to the last one (D1).
3. When the callback returns, deck stores the callback's return value under the view's id. If the callback returns nothing, deck stores the tick's own view state there (D3). The view's id is `working` (C18, D8).
4. deck's lookup takes that per-view entry before the root (D5). So the tick's old-frame target shadows the move, while the frame's origin has moved to the view point (C33).
5. The camera that is drawn is therefore the old target against the new origin, and W moves by ΔO. That is what the report shows at every change (C9).

**1.3 A second mechanism compounds H1.**
- The origin moves to the view point (C33), so `toLocal` gives (0, 0) (C34). Every re-centre at one zoom therefore writes the same value.
- deck drops a repeated value (D1; entry 85, C14's last sentence). So at one zoom, every move after the first is dropped before H1 acts.
- The first change in run rc isolates H1. Its move follows the fit's write, which carries a write id (C15, C17). So deck accepts the move, and the target still did not rebase (C9).

**1.4 Consequence.** While the target stays beyond T, each settled tick re-crosses. Run rc shows five changes (C9); a working re-centre would make one per leg (§5).

**1.5 What else could explain the records, and why it does not.**
- (a) A trace artefact. The line is logged before the re-centre (C21 before C24). Excluded: the changes show on the next lines, with the new origin and the target not rebased, and the end image has no data where the start image had some (C10).
- (b) The controller's stale pan state (C23's account). Excluded for these changes, which land on settled ticks. deck rebuilds its controller state from its props on every event (D9), and those props are the per-view entry H1 names (D7).
- (c) The reading itself. The reviewer recomputed it equal (§0.2).
- (d) The drags' own asymmetry. It is bounded by |E − S| ≤ d (C10). It explains the end target (C8), not S.
- Not separated: after the first change, H1 and the deep-equal drop give the same records. No run separates them, so the fix must defeat both.

**1.6 Reach.** Any tick that is not dragging and finds the target beyond T re-centres (C24, C32).
- That covers a drag's end, a wheel tick, and the frames and start tick of deck's 300 ms double-click and keyboard transitions (D14–D17).
- Only drags were run.

**1.7 Why the frozen suite could not see it.** See the reproducer's note 8.
- Its crossing case reads its last line before the gesture-end re-centre (C42).
- Its there-and-back runs at zoom −1, far inside T (C41).

## §2 The fix

### 2.1 Shape A (recommended): the callback returns the re-centred view state

**Where.** `frontends/shell/src/canvas/WorkingCanvas.tsx`, in the handler (C19) and its comments, plus the top doc comment (§2.4). No other product file changes.
- On a re-centring tick, the handler returns `{ ...viewState, target: [localX, localY, vs.target[2] ?? 0] }`.
- The `setProps({ initialViewState })` call in C24 is removed. `render()` stays where it is.
- On every other tick the handler returns nothing, as it does now.

**The guard.** It keeps `!isDragging` and gains two conditions. There is no re-centre:
- (i) on a tick whose `interactionState.inTransition` is true; or
- (ii) on a tick whose view state carries a transition, by deck's own test (D19).

Why the guard is needed:
- A view state returned during a transition is not the transition's own update. deck cancels the transition (D18, reached through D7 and D10), so a double-click zoom would stop short.
- A view state returned on a transition's start tick makes deck animate from the old frame's start to the new frame's end (D18).
- With the guard, the re-centre lands on the next tick that is neither dragging nor in a transition. That is the same deferral the drag already takes (C23).

**The contract.** deck types the callback's return value as a view state (D4) and uses it in place of the tick's own (D3).
- The entry deck stores is the rebased one, so H1 is defeated.
- No `initialViewState` is written, so the deep-equal drop is defeated.
- The rebased state reaches deck's controller as its props (D7, D10). With no transition in progress and none enabled, the transition manager ignores it (D20). The next event builds its state from those props (D9).

**Under ADR-010:**
- Rule 1 (C48):
  - The handler still combines `vs.target` only with the origin it captured before the re-centre (C22). The trace line (C21) and `reportViewport` (C25) keep that pair.
  - The returned value is renderer-local in the new frame. It stays inside the renderer, and it is the frame in which `render()` rebuilt the layers.
  - The defect is this rule's hazard in effect (an old-frame target drawn against the new origin), and Shape A removes it.
  - deck's `info.coordinate` stays unread.
- Rule 3 (C49): unchanged. `toLocal` is f64 subtraction (C34), and the layers' offsets are unchanged.
- Rule 4's sentence on whole-buffer rebase (C50): what a re-centre does is unchanged (C13). No claim is made.
- Rule 5 (C51): `render()` and the returned state land in one deck call (D3), before the next draw. Under the defect, new-frame layers were drawn with an old-frame camera; Shape A closes that window. Not claimed per frame: §4 reads the trace and images, not every frame.
- Rules 6 and 7 (C52, C53): untouched.
- docs/01 principle 8: each re-centre is still recorded in `offsetFrame.events` (C31).

**The settled tick.** Shape A still depends on it, because the drag deferral is kept.
- Read in 9.3.9: inertia is 0 under `controller: true` (C18, D11), and a pan's end calls `updateViewport` with `isDragging: false` (D12, D13).
- Seen on 9.3.9 in run rc: the five changes each land at a drag's settled tick (C9).
- Not read and not run: a gesture ended by `pointercancel`. The code note keeps it as a condition.

**Guarantee or property under test (§21a's fourth category, C54): yes.**
- The property "the view does not move when the frame re-centres" goes from broken at low zoom to held, for a drag's end, a wheel tick and a transition's end. That property is the walkthrough's A5 and A6 (C58) and the top doc comment (C14).
- The deferral on transition frames is a declared change (§3).
- The full form is already ordered (§0.1). §25 (e) (C57) adds nothing here.

### 2.2 Shape B: a deferred `setProps` with a re-centre write id

**Where.** The same handler. The move leaves the callback (a microtask or the next frame) and carries an id from a sequence like the fit's (C15).

**Trade-offs.**
- It works through the route the fit uses (D1, outside the callback).
- Between the return and the deferred write, deck can draw new-frame layers with the old-frame camera (rule 5's window). Avoiding that means deferring `render()` too, which takes the frame pairing out of the tick (rule 1).
- An event in that gap is handled in the old frame.
- It has the same transition hazard and the same settled-tick dependence as A, and changes the same property.
- It needs more code.
- Not recommended.

### 2.3 Shape C: controlled mode (a `viewState` prop owned by the canvas)

**Where.** `WorkingCanvas.tsx`, every camera write: the constructor (C18), the fit (C17), the DEV seam (C27) and the handler. The top doc comment's load-bearing rule (C14) is reversed.

**Trade-offs.**
- It removes both mechanisms for every write.
- It rewrites the camera model that entry 85's tests (C46) and pan-anchor's seam lines rest on, and every camera path needs proof again.
- The settled-tick dependence is unchanged.
- Not now.

**Rejected outright:** a second trace line after the move. It would change the line stream that pan-anchor's route 1 waits on (§8).

### 2.4 Recommendation, and the words it changes

**Recommendation: Shape A.**
- It is the smallest change, in one file.
- It uses deck's typed contract and defeats both mechanisms.
- It opens no new stale window and leaves the line stream unchanged.

**Words.** These are worker-drafted code comments, not the human's words. They are applied with the fix and checked clause by clause at the gate.
- C14, the sentence beginning "A later programmatic jump": it states that the re-centre's jump works uncontrolled, which D3 and D5 contradict. Draft replacement: *A programmatic jump made outside deck's view-state callback (the fit, and the DEV-only test seam) works uncontrolled: `setProps` re-syncs deck's own view state from `initialViewState` whenever the new value is not deep-equal to the last one (`@deck.gl/core@9.3.9` `dist/lib/deck.js`, `setProps`). Inside the callback it does not: deck then stores the callback's view state under the view's id, which its view lookup prefers, so the re-centre's camera move is the callback's return value instead (see `onViewStateChange` below).*
  - Clause check: the fit and the seam are outside the callback (C17, C27). The re-sync rule is D1. The per-view store is D3. The lookup is D5. The return value is §2.1.
- C14, the version label: 9.3.7 becomes 9.3.9. The claim was read again in D2 and D3.
- C20: restate the note on 9.3.9 evidence (§2.1 The settled tick).
  - Name the guards: `e2e/recentre-crossing.mjs` and `e2e/pan-anchor.mjs`, both operator-run and not in CI.
  - Name `WorkingCanvas.recentre.test.tsx` too, and say that it models deck's rules and so cannot see a change in deck.
  - The sentence about re-running after any `@deck.gl/*` bump names both suites.
- C23 and the comment inside C24: the description of the move becomes the return value. Add the transition clauses with their reason (§2.1 The guard).
- C26: not on the fix's path, and left as it is (OPEN-9).

### 2.5 Boundaries

**May edit:** the files in §7.

**Not edited:**
- `frontends/shell/e2e/pan-anchor.mjs` and its tolerance.
- `offsetFrame.ts`, `lib.mjs`, `e2e-test-surface.ts`, `renderTrace.ts`.
- `WorkingCanvas.wiring.test.tsx`, `WorkingCanvas.test.ts`.
- The e2e `project.mjs` and `checkDistClean.mjs`.
- `package-lock.json`, any dependency, and deck's version. Changing a dependency or deck's version is a red line.
- Anything under `kernel/`, `engine/`, `protocol/`, `renderer/` or `src-tauri`.
- No new export, option or `pub` item. If the worker extracts a helper, its only product caller is the handler.

### 2.6 Portability

The fix is page code, and deck's source is the same on every platform. E1 runs on Windows/WebView2 only. Nothing is claimed for macOS or Linux.

## §3 What may and may not be claimed

**May be claimed, on the head's measure build:**
- A drag that crosses the bound re-centres without moving the view (E1 case 1).
- A double-click near the bound does not re-centre until its transition has ended, and the zoom completes (E1 case 2).
- U1 and U2 hold against deck 9.3.9's rules as the test models them.

**May not be claimed:**
- Any docs/08 measurement or performance effect.
- Anything about `pointercancel`.
- macOS or Linux.
- That no frame shows the re-centre (only the trace and two images are read).
- That the deferral on transitions is harmless at every zoom. Until the next qualifying tick, the frame's offset may exceed the bound (offsetFrame.ts, C28–C30). Not measured.
- That deck's trailing tick is an invariant.
- Anything about v0.1.0 until §10's check is made.

## §4 Tests (outcomes declared in §5 before any run)

| ID | Kind and file | Asserts | Mutation and expected failure |
|---|---|---|---|
| U1 | vitest, new `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx` (see the note below) | After the one-shot fit (driven by pushing a batch, as the wiring test does), drag ticks then a settled tick take the target past T. The next traced line's W (C35) equals the line before the change, within 1e-6 world units, and the origin has changed. A second crossing at the same zoom gives the same. | M-U1: restore the in-callback `setProps({ initialViewState })` move and return nothing. U1 fails at the first crossing: W jumps by ΔO. |
| U2 | the same file | No origin change on (a) a settled tick past T with `interactionState.inTransition` true, or (b) one whose view state carries `transitionDuration: 300` with an interpolator. (c) The next tick with no transition re-centres, and W is continuous. | M-U2: remove the guard's transition clauses. U2 fails at (a): the origin changes. |
| E1 | new `frontends/shell/e2e/recentre-crossing.mjs` with npm script `e2e:recentre-crossing`; head measure build; the 100k fixture (C38) | **Precondition** (else exit 2, VOID, not PASS): the fit line arrives, and case 1 has at least one origin change in each leg. **Case 1** (from the fit, with no DEV hook): n1 drags of +L, n1 of −L, then a closing pair. STEPS = 30, L = 30·floor(min(300, floor(cw/2) − 8)/30), d = (L − L/STEPS)·2^−z_fit, n1 = floor(T/d) + 3. (a) Across each origin change, consecutive lines' \|ΔW\|·2^z·(bw/cw) ≤ 4.0 buffer px per axis. (b) \|W_end − W_start\| ≤ d per axis. (c) Start and end images, by the reproducer's note 5 rule, carried in code. **Case 2** (after case 1, from the fit again, reached by its own reload): drag out until the target is within half of a 300 px double-click shift below T, then double-click 300 px off centre, settle, one wheel notch out, settle, one wheel notch in, settle. (i) No origin change among the lines from the double-click to its settle. (ii) The zoom after that settle is the zoom before plus 1, within 1e-6. (iii) Across the origin change at the wheel tick, \|ΔW\| as in (a). Exit 0 if all pass, 1 on any failure. | M-E1: the fix reverted. It is observed by E1's run on the base build (§7 step S3), whose product tree is the base by construction. That record is named a run at the base. Expected: case 1 (a), (b) and (c) fail, and case 2 (i) fails. |

- **The fake.** U1 and U2 run the real `WorkingCanvas` with `@deck.gl/core` mocked by a fake that applies D1, D3 and D5 as written, each rule's comment citing its D-file and line at 9.3.9. Why a new file: the wiring test file is #307's path.
- **E1's methods.** Its own drag helper is pan-anchor's shape (C40), down, move and up, with its own STEPS. Its settle is `waitForSettle` (C45) over the `view-state` lines read as C39 reads them. It launches through `attachOrLaunchExe` (C43). It captures with CDP `Page.captureScreenshot`, clipped to the canvas box. PNGs are decoded with `node:zlib` (no dependency).
- **E1's tolerance.** E1's own constant is 4.0 buffer px, on the basis of C47, restated in its comment (OPEN-2).
- **Observing mutations.** Each mutation is applied by hand, the named test run and its failure recorded, then reverted. A verify-mutation run, if one is made, is recorded as a check of the mutation's text, never as its observation. A test-text span on the branch is named with its commit id and never pinned by hash at a branch commit.

## §5 Predictions, unchanged items, invalidators

**Predictions.**
- P-U-base: at the base, with the test file added (§7 step S2), U1 fails at the first crossing, and U2 fails at (a). The base re-centres on any non-dragging tick (C24).
- P-E1-base: at the base build, the precondition is met. Case 1 (a), (b) and (c) fail, as run rc shows (C9–C11). Case 2 (i) fails and (ii) passes.
- P-head: U1, U2 and E1 all pass. Case 1 gives exactly two origin changes, one per leg: the out leg crosses at drag floor(T/d)+1 and the back leg at its drag n1. This is my derivation, recorded and not asserted.

**Declared unchanged:**
- Every existing vitest test.
- pan-anchor's checks: no trace line is added or removed per tick, and its crossing case reads before the re-centre (C42).
- Every other e2e suite.

**Invalidators.** Each one stops the piece and returns it to the architect by amendment; nothing is adjusted.
- I1: U1 or U2 passes at the base. The fake does not model deck.
- I2: E1's precondition is unmet at the base or at the head. The result is VOID.
- I3: E1 case 1 passes at the base. The suite cannot see the defect.
- I4: a failure seen in a shared run that depends on timing is recorded as such, run again in a later hold, and not counted.

**Falsification.** A failure of U1, U2 or E1 at the head is the fix failing. It is recorded as seen.

## §6 The instrument

The reproducer's instrument was a reverted worktree edit to `pan-anchor.mjs` (rc.patch, sha256 cef12e83bc880f9cd0afdbed601ddbed9607653a2fb485c89d4dba2ddc5eb512, in scratch). It does not land as a patch.

**What lands, rewritten as E1's own committed code:**
- the drag plan's formulas (the reproducer's note 3, with the STEPS change in §4);
- the `view-state` line reading and W;
- the CDP capture written with flag `wx`;
- the note 5 image rule.

**What does not land:**
- the page `console.debug` wrapper;
- the node-side jsonl dumps;
- the clock checks;
- the stall heartbeat;
- any edit to `pan-anchor.mjs`.

## §7 Steps, files, ceilings, budget

**Steps** (S1 is the custodian's; S2–S8 are the worker's):
- S1: this form is committed on main.
- S2: a branch from the base (the main commit named in the report; §14 OPEN-1). Commit the U1/U2 file, run vitest, and record P-U-base with the commit id.
- S3: commit E1 and its npm script. Build the measure exe at that commit (its product tree is the base). Run E1 and record P-E1-base.
- S4: the fix commit (`WorkingCanvas.tsx`: the handler, the guard, the §2.4 words).
- S5: vitest at the head; observe M-U1 and M-U2.
- S6: build the measure exe at the head, run E1, and record P-head.
- S7: the e2e README entry (shaped like C60), and the walkthrough row (OPEN-4).
- S8: the report, then both gates.
- Nothing after S4 is committed before S2's and S3's records exist.

**Files and ceilings.** Insertions plus deletions, comments counted, by `git diff --numstat <base>...HEAD -- frontends/shell`:

| Group | File | Ceiling |
|---|---|---|
| product | `frontends/shell/src/canvas/WorkingCanvas.tsx` | 70 |
| unit | `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx` (new) | 300 |
| e2e | `frontends/shell/e2e/recentre-crossing.mjs` (new) | 450 |
| e2e | `frontends/shell/package.json` (one script line) | 2 |
| docs | `frontends/shell/e2e/README.md` (a new suite entry) | 45 |
| docs | `frontends/shell/MANUAL-WALKTHROUGH.md` (one Part A row, OPEN-4) | 4 |

- An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions), and §7 is not edited to match.
- A file outside this table is class 9, declared by amendment before any of its code.

**Budget:** 290 minutes of work, my estimate and not a measurement:

| Work | Minutes |
|---|---|
| fix | 30 |
| U1/U2 | 60 |
| E1 | 130 |
| docs | 20 |
| runs and mutations | 20 |
| report | 30 |

- The wall time of the two measure builds and of the waits for a hold is stamped and reported separately, not counted against the budget.
- PLAN's `budget_minutes` (C1) is the custodian's to set.

## §8 The order with pan-anchor

`pan-anchor-setcam-waits-for-its-own-reset` (C2) is blocked behind this node.

**What this fix leaves alone.** It adds no trace line and moves none (C21; C17's line at 1410; the seam's line in C27). It changes no seam, and E1 is a separate file. So pan-anchor's checks and its route 1 (waiting on its own lines) are unaffected in substance.

**Its pins.** The fix inserts lines above the seam in `WorkingCanvas.tsx`. pan-anchor's form pins at 544c8971 into that seam's span therefore become historical, not current. Its M-TRACE is named by content and still resolves.

**Its form.** No separate amendment (OPEN-8). Its owed route-1 amendment (its Amendment 4) names this piece's merge commit as its base and M-TRACE by content.

**What the reviewer runs.** pan-anchor at the head (§12) confirms the unchanged predictions.

## §9 Measurements and strings

**Measurements.**
- Per tick, the added work is one extra boolean read. A re-centring tick adds one object spread.
- What `render()` does on a re-centre is unchanged (C13).
- docs/08's frame budget (at most the vsync interval) applies to the canvas and is not claimed: there is no measurement.
- Fewer re-centres in run rc's shape is a prediction (§5), not a claim.

**Strings.** None that the app shows. E1's console output is a harness's. The walkthrough row is operator documentation, not an app string.

## §10 Records

- **v0.1.0.** Tagged at b391e43 (2026-09-13), before the drag deferral. If its callback carried the same in-callback move (unverified), it carries this defect. Mid-drag, entry 95's runaway was consistent with H1 (C42's comment: many origin jumps in one drag). The custodian checks b391e43's handler, and the release record's words go to OPEN-5, a red line.
- **KNOWN-LIMITATIONS.** No item (OPEN-6). The defect is fixed on main by this piece. Item 17 (C59) is not touched.
- **Walkthrough.** One Part A row after A7 (C58), with the words in OPEN-4, for the human's sight before the merge.
- **v0.2.** v0.2 does not tag with this defect on main (C6). The custodian records it by making this node a dependency of v0.2's tag node in PLAN, applying the ruling (OPEN-7). The tag and its release notes are the human's.

## §11 Block on sight

1. Any edit to `pan-anchor.mjs`, its tolerance, or the bound in `offsetFrame.ts`.
2. A dependency, lockfile or deck version change (red line).
3. A trace line added, removed or reordered.
4. A `viewState` prop, or any `setProps({ initialViewState })` inside the callback.
5. A new export, option or code path with no product caller.
6. A read of deck's `info.coordinate`.
7. E1 calling a DEV-only hook, or E1 run on a dev build.
8. A tolerance or prediction changed after a run has been seen.
9. A string the app shows, added or changed.
10. A record that calls a verify-mutation run an observation, or a test-text span on the branch pinned by hash at a branch commit or named without its commit id.
11. The fix commit before the records of §7 steps S2 and S3.
12. Code in `WorkingCanvas.tsx` before OPEN-1 is settled.

## §12 Gates

**Architect and reviewer from dispatch** (C54, C56). Verdicts follow §22. A Documentation finding is must-fix before the merge.

**The reviewer, at the final head:**
- Recomputes the counts in §7.
- Runs the shell's fresh-worktree setup and `npm run verify` in `frontends/shell`, the repository's CI `node --test` scripts suite, and the cite, quote and plan checks.
- Runs every e2e suite in `frontends/shell/package.json` (C62), plus `e2e/pan-anchor.mjs`, on the dev build on port 5400.
- Runs E1 on the head measure build, and recomputes E1's verdicts from its records the way rc's reviewer did.
- Runs each heavy command in a shared hold (§13).
- Records a failure that depends on timing in a shared run as such, not as a failure (§5 I4).

**The operator Part:** X0 is read §15, the last amendment first.

## §13 Heavy runs

Builds, vitest and every e2e suite each run inside a shared hold of the machine script. The machine paragraph (C61) goes into the worker's and the reviewer's briefs as written. Nothing filed names another project.

## §14 Open items

| OPEN | Subject | Red line | Recommendation |
|---|---|---|---|
| 1 | the overlap with #307 | (B) only | (C) |
| 2 | E1's tolerance and location | no | (A) |
| 3 | the transition guard | no | (A) |
| 4 | the walkthrough row | no | (A) |
| 5 | v0.1.0's release record | yes | (A) |
| 6 | KNOWN-LIMITATIONS | no | (A) |
| 7 | the v0.2 tag dependency | no; the tag is the human's | (A) |
| 8 | pan-anchor's form | no | (A) |
| 9 | the 9.3.7 label at C26 | no | (A) |

The options and reasons are in the architect's draft report (`state/consults/2026-11-12-recentre-crossing-view-displaced-fix-form-architect-draft.md`). The custodian records each settlement here by amendment.

## §15 Amendments (opens empty; append-only)

### Amendment 1 — the custodian's settlement of §14 at the form's commit (class 1, before any code)

*Written by the custodian on 2026-11-12 at this form's commit, before any code.*

1. **The carried text.** Everything above this amendment is the architect's draft (`state/consults/2026-11-12-recentre-crossing-view-displaced-fix-form-architect-draft.md`, read only at main 7d7261a7; its fenced block's sha256 9f12734592e25948261a7dac9aa105c2aff4646b33055d1427b3102a9c21892a), carried byte for byte, with one change, the custodian's: each `sha256:<H>` pin is filled by script with the sha256 of the cited whole lines, each with its LF, at 7d7261a7 (62 pins, 62 distinct ranges). §0.4's sentence naming `<H>` stays as written. The draft's OPEN items, gate findings, reading list and packet gaps stay in the filed draft.

2. **OPEN-1 (C), with one change that rule (00) requires.**
   - Checked by script at this commit, over the shell files of §7's table and the canvas folder: `git diff --name-only origin/main...origin/cut/b2-piece-1c-save-and-reopen` (PR #307) names `frontends/shell/MANUAL-WALKTHROUGH.md`, `frontends/shell/e2e/README.md`, `frontends/shell/package.json`, `frontends/shell/src/canvas/WorkingCanvas.tsx` and `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`. The same command names none of them for `cut/adr-035-close-races-note` (PR #308) or for `cut/port-2-macos-l1-and-app-dirs`.
   - The draft did not know whether `frontends/shell/package.json` is #307's path (its packet gaps). It is: #307 adds one script line there. So the code that starts now is S2's test file and S3's E1 file, and no other. E1's npm script line waits, with the base build, the run at the base and the fix commit, for #307's merge; until then E1 is run as `node e2e/recentre-crossing.mjs` in `frontends/shell`.
   - The walkthrough row is in Part A, and #307's is a new Part AD; the README's suite entry is this piece's own. Each is a separate path under rule (00a), and both are S7's, after the fix commit.
   - After #307 merges, main is merged into this piece's branch (a merge, never a rebase), and the base of S3's build and run is that merge commit, whose product tree is main's.
   - Taken on 2026-11-12 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`). The change to (C) is the custodian's and goes to the human with the rest.

3. **OPEN-5, a red line: the custodian's check, made by script at this commit, for the human.**
   - At b391e43 (v0.1.0) the view-state handler (`frontends/shell/src/canvas/WorkingCanvas.tsx:1730-1771` @ b391e43622056324c56d35cc33065305140a8415 sha256:bdf6a971bc8c086e78d1599c8a6aad04adf3b6ebc5d184ec87ca539230241578) has no `return` statement and no drag guard. On any tick whose target passes the bound, it makes the re-centre's move inside deck's callback with `setProps({ initialViewState })` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1751-1758` @ b391e43622056324c56d35cc33065305140a8415 sha256:5bcddc0a25f02be522cafe9a69899ad99dd5ccd0e333c58df7b6bf6291caeb5e).
   - The lockfile at b391e43 holds `@deck.gl/core` 9.3.9 (`frontends/shell/package-lock.json:452-454` @ b391e43622056324c56d35cc33065305140a8415 sha256:4a67a78a4641e3fb3ad70bdeb3c65fa90d1cbac536bf58646e5f8d4cd9ecbf72), as main's does.
   - So, by §1.2's reading of 9.3.9, v0.1.0 carries the mechanism. No run was made on v0.1.0.
   - Whether `governance/RELEASE-0.1.md` gets a known-issue line, and its words, are the human's, typed. Nothing is written until then, and nothing in this piece waits on it.

4. **OPEN-2 (A), OPEN-3 (A), OPEN-4 (A), OPEN-6 (A), OPEN-7 (A), OPEN-8 (A) and OPEN-9 (A)**, none a red line, are the draft's recommendations, taken on 2026-11-12 at this form's commit under the same direction, held to 2026-11-16.
   - OPEN-4's draft words, the architect's, are put before the human before the merge, with F5.
   - OPEN-7 is applied at this commit: PLAN node `release-v0-2-0` gains this node in its `depends_on`. The tag and its notes stay the human's.

5. **The draft's packet gaps**, answered where the custodian can: v0.1.0's handler, item 3; v0.2's tag node, `release-v0-2-0`; `package.json` and walkthrough Part A, item 2. The 100k fixture's path from a worktree and how the measure-build suites take the exe path are for the worker's brief. The rest stand as the draft lists them.

6. **The draft's gate findings.** F1 to F3 are this piece's words (§2.4). F5 goes to the human with OPEN-4. F6 is answered by item 3. F7 goes to pan-anchor's owed route-1 amendment (OPEN-8). F4 is a reading, recorded.

7. **PLAN.** The node's gate is this form from this commit. Its status is in-progress, and its budget is the draft's 290 minutes, an estimate and not a measurement. The worker for S2's and S3's code is dispatched after this commit is on main. Slot 1's R4 worker runs in its own worktree, and every heavy call of either runs in a shared hold.

Nothing above is edited.

### Amendment 2 — written after the head run's E1 result was seen: case 1 (c) (class 1; it records a class 2 deviation)

*Drafted by the architect (claude-opus-5-5) on 2026-11-12 at main 3b9864d6, after the run at the head (§7 S6) was seen. The custodian commits it. Tracked cites are at main 3b9864d6; the custodian fills each `<H>` by script. Branch lines are named by branch and commit, never pinned. The images are named by run and sha256 and are evidence held in scratch, not Authority.*

Cites:
- R1 `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md:121-130` @ 3b9864d6 sha256:9834d7420130636cdc5be5ab8f1d8beb1b6970e063ac76c55bdcb1457e2bed1d (note 5's screenshot rule)
- R2 `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md:170` @ 3b9864d6 sha256:184d752588e6dde5ee195ddb1a37356f509e033159c003dca708d18f2f23fd2a (note 6, its limits)
- R3 `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md:260` @ 3b9864d6 sha256:d4a7024c18d5dfc87d04f9fda044ed6747f756e91b355e981cef5949b5c38d5f (that form's settlement of its OPEN-1)
- R4 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:87-93` @ 3b9864d6 sha256:4d6b91cb2047c16bb2919311b043c7577728a82aaaa2cdf7fd9b29ec2918b2d0 (the head run, case 1)
- R5 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:95-102` @ 3b9864d6 sha256:e1007db9069bbbd176325f0fdae6ad4f207810fd9079040060ea8878cc256d23 (the head run, case 2 and its tally)
- R6 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:53-62` @ 3b9864d6 sha256:9e2f5cb7c0eea1ca4e48182c0108863ff5624d2260c2fd62e88e2c32d2f4cbce (S5: U1, U2, M-U1, M-U2)
- R7 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:69` @ 3b9864d6 sha256:4028173a52f97ee77ee4d35008116b72f10a7c4719d5060489b6b652c7f95f10 (the head exe)
- R8 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:128-135` @ 3b9864d6 sha256:c82de695b9e7d276fb692247c7a40a807defd1706653e4fb0813b797416359cd (the numstat)
- R9 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s3b-worker-report.md:17-29` @ 3b9864d6 sha256:4a377d8b738d2002930a9c09941b760acdede211ded9a137f6c95ea52289defb (the run at the base)
- R10 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s3b-worker-report.md:12` @ 3b9864d6 sha256:575e91fb63782c6dde28e2c621ef625fd2d226575c268192f7b6bd79f1e306f5 (the base exe)
- R11 `docs/PREREGISTRATION-TEMPLATE.md:103-109` @ 3b9864d6 sha256:3f6c33a6a366ae4d60ac5d36a4747d24c41fd54ab1c3b2a1601d3034aab6d10f (classes 1 and 2)
- R12 `docs/PREREGISTRATION-TEMPLATE.md:169-170` @ 3b9864d6 sha256:0b933ae49889dbf8150947ab21389fd42704669b71380e4e9fed3dd0d78b80ff (classes 8 and 9)

Images:
- I-s (the start image of both runs; it is one file): sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2, 34623 bytes.
- I-be (the base's end image): sha256 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062, 3169 bytes.
- I-he (the head's end image): sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519, 107990 bytes.
- Boxes come from the custodian's script, which marks pixels by note 5. They are the custodian's, as given in the architect's brief, and they are not recomputed here. All images are 668x712, and B is 255,255,255.
  - I-s: N 35248, x 66-667, y 258-357.
  - I-he: N 127606, x 66-667, y 0-357.
  - I-be: N 0.

1. **The result, as seen (class 2, R11).**
   - At the head (3df3e57c, exe R7), E1 passed 5 of 6 checks and exited 1 (R4, R5):
     - case 1 (a) and (b) passed;
     - case 1 (c) failed;
     - case 2 (i), (ii) and (iii) passed.
   - P-head (§5) predicted that every part passes, so it is missed at (c). U1 and U2 pass at the head, and M-U1 and M-U2 failed as predicted (R6).
   - The run at the base (8cbc250b) met P-E1-base (R9).
   - This record stands whatever follows: the fix at 3df3e57c is recorded as failing E1 case 1 (c). §5 and §4 are not edited.

2. **The four images: my reading.** I read them by eye, using the custodian's boxes and my own arithmetic. Nothing here is measured.
   - **I-s.** A horizontal band of blue dots: x 66 to the right edge, y 258-357. Its top edge steps down a few px near x 600. The data touches the right edge, so note 5's assumption that the fit leaves a margin (R1) does not hold for this image. B is still white.
   - **I-he.** A block of the same dots. Its left edge (66) and bottom edge (357) are the same as in I-s. It fills up to the top edge and the right edge, and it contains I-s's band.
   - **I-be.** Blank: the data has left the canvas. This is H1's displacement, matching the trace (R9: |E| 671141.663 world units).
   - **The head's (c) failure is residency, not a displacement.** More of the fixture is drawn at the same view at the end than at the start. The evidence:
     - the two interior edges are unchanged;
     - the start box lies inside the end box;
     - the dot density is the same, 35248/60200 ≈ 0.586 against 127606/215516 ≈ 0.592;
     - the centroid shift is the box growing upward. With uniform density, cy goes from 307.5 to 178.5, a move of about 129, against R4's 129.55, and cx stays at about 366.5;
     - (a) reports a worst jump of 0.00 buffer px and (b) |E| (0.000, 0.000) (R4).
   - **Mechanism: unknown, and nothing is claimed.** It could be data admitted after the fit, or drawn data refreshed only on a later rebuild such as the re-centre's `render()`. The start image is byte-identical across two runs on two builds, so the start state is reproducible.
   - **What (c) is in E1 to see.** §4 row E1 (c) carries note 5's rule (R1). In the reproducer, (c) was the screen's own witness beside the trace (R2), and §1.5 (a) used it to exclude a trace artefact.
   - **(a) and (b) see only part of that.** They read W from the `view-state` line, which is what deck's callback carries. They cannot see a frame whose layers and camera are paired in different frames (ADR-010 rules 1 and 5, §2.1). At the base, H1 showed in the trace as well, so (a) and (b) failed alongside (c). The screen witness is what (c) alone adds, so E1 keeps a screen check, and (c) is not removed without a replacement.

3. **Which rule governs.**
   - **§5 Falsification governs the result.** E1 failed at the head, and that failure is recorded as seen (item 1).
   - **No invalidator applies:**
     - I1 and I3 do not apply.
     - I2: the precondition was met at both builds (R4, R9).
     - I4: nothing shows that the failure depends on timing (the start image is reproducible, item 2). I4 is not invoked to re-run for a different answer.
   - **§11 item 8 blocks, on sight**, any change by the agents to (c)'s rule, tolerance or prediction, or to whether (c) counts in E1's exit code, now that a run has been seen.
   - **Class.** This amendment is class 1 and records a class 2 deviation (R11). It is not class 8 (no overrun) and not class 9 (no standing rule adds work) (R12). No class from 1 to 9 lets a check be replaced after its result.
   - **So any change to (c) waits for the human's typed word.** That is OPEN-A, a red line. It would lift a §11 item after a result, on a form the human ordered full with both gates (§0.1). This node gates the v0.2 tag (Amendment 1, item 4), and the reproducer's outcomes bind this form by the human's item 5 (b) (§0.1).

4. **The options for (c).**
   - **(A) Record the failure and stop.**
     - Honest.
     - Cost: the defect stays on main and the v0.2 tag stays blocked (Amendment 1, item 4). The fix goes back to the architect, although U1, U2, (a), (b) and case 2 all pass and the images show no displacement.
   - **(B) A new rule applied to the recorded images, with no run.**
     - Not honest as evidence. The rule would be written with both pairs in view, so its answer on them is known before it runs. Recording that answer as E1's result would be the change §11 item 8 forbids, in substance.
     - It may run only as a check of the code against a known answer (item 7, S6b).
   - **(C) A new rule declared here with its predictions, then fresh runs at the base build and the head build.**
     - (c) keeps running and is reported beside the new rule.
     - Cost: one commit to the e2e file and two E1 runs of about 4 to 5 minutes each, in shared holds. No rebuild is needed, and the record of (c) is kept.
   - **(D) (added) Keep (c) as it is, but take the start image only once the data is resident.**
     - Cost: this needs a residency signal that the measure build may not expose (packet gap).
     - A warm-up pan-and-return changes §4's case 1 start, which is defined from the fit. It also need not bring residency to the end's state if the extra data arrives with a rebuild.
     - It is a post-result change too, under §11 item 8 in the same way.
   - **The candidate rules:**
     - *Anchored edges.* Taken in the general form below, so that no edge is chosen by looking at these images. A fixed left-bottom corner would be fitted to them.
     - *Warm-up.* As (D).
     - *Pixels drawn in both images.* Rejected. The fixture draws a near-regular dot lattice at density ≈ 0.59 (item 2). A displaced copy therefore overlaps itself by chance at about 0.59, and at a shift of one lattice period near 1. Sub-pixel rounding after a re-centre (unmeasured) could also break exact overlap in a correct product.
   - **Recommendation: (C) with rule (d).**
   - **Rule (d), declared here before any run of it:**
     - B is the most frequent exact RGB on the start image's outermost one-pixel ring (R1). A pixel of either image is marked when any channel differs from that B by more than 8. N is the marked count.
     - Each image's box is the bounding box of its marked pixels (left, right, top, bottom).
     - An edge is inner when it is not on the outermost ring: left > 0, right < w−1, top > 0, bottom < h−1. K is the set of edges that are inner in both images.
     - The pair is unreadable when the dimensions are unequal, when N_start is 0 or w·h, or when N_end > 0 and K is empty.
     - The pair differs when N_end is 0. Otherwise it differs when any edge in K moves by more than TOLERANCE_BUFFER_PX (4.0), scaled by bw/cw on x and bh/ch on y.
     - (d) passes when the pair is readable and does not differ. Its line records both boxes, K, and each move.
   - **What (C) changes in (c):**
     - (c)'s code is kept. Its one departure from note 5 is fixed: it takes B per image, and it will take B from the start image (gate finding F1). On these four images the fix changes nothing, because B is white in each.
     - (c)'s line prints REPORT and does not count in the exit code.
     - (d) is asserted.
     - The result of (c) at 3df3e57c stays failed in the record (item 1).

5. **The base under (d): it is re-run, not re-read.**
   - (d) is new. Its power to see the defect is §4's M-E1 observation, so it is observed and not inferred from I-be. No rebuild is needed: the base exe is the one in R10.
   - **P-E1-base under (d):**
     - the precondition is met;
     - case 1 (a) and (b) fail;
     - (c) is reported and expected to differ (N_start → 0);
     - (d) fails, because N_end = 0 means the pair differs;
     - case 2 (i) fails and (ii) passes;
     - (iii) is recorded as seen;
     - exit 1.
   - **P-head under (d), for the fresh head run:**
     - the precondition is met, with origin changes at drags 35 and 74 if z_fit repeats;
     - (a) and (b) pass;
     - (c) is reported and expected to differ, as at S6;
     - (d) passes, with K expected to be {left, bottom} and each move ≤ 4.0 buffer px (0.00 by the S6 images);
     - case 2 (i), (ii) and (iii) pass;
     - exit 0.
   - **Invalidators added** (each one returns the piece to the architect by amendment, with nothing adjusted):
     - I5: (d) passes at the base.
     - I6: (d) is unreadable at either build.
   - I1 to I4 stand.

6. **P-head's other words hold.** The derivation was recorded and not asserted (§5).
   - R4 gives T 131072, d 3749.395 and n1 37.
   - floor(T/d) + 1 = floor(34.958…) + 1 = 35.
   - The back leg's drag n1 is drag 37 + 37 = 74 overall. After the re-centre at drag 35, two further +d drags leave the local target at 2d. Leg 2 then reaches −35d at its 37th drag, and |−35d| = 131228.8 > T.
   - R4 shows exactly two origin changes, at drags 35 and 74, one per leg.

7. **Ceilings and steps.**
   - `recentre-crossing.mjs` is at 317 of its 450 lines (R8). (d), F1, the change to REPORT and the comment words (F2, F3) come to at most 60 lines by my estimate, not a measurement.
   - No other file is touched before S7. An overrun is class 8, and §7 is not edited.
   - **The steps:**
     - **S6a.** The custodian commits this amendment on main. No code for (d) lands before this commit and before the human's typed answer to OPEN-A.
     - **S6b.** On (C): one worker commit, to `recentre-crossing.mjs` only.
       - `git diff --name-only 3df3e57c..HEAD` names that file alone, and `node --check` passes.
       - A scratch script, not committed, applies (d) to the four stored images by sha256. Expected: the head pair does not differ, with K {left, bottom} and moves of 0; the base pair differs. This is recorded as a check of the code and not as an observation (item 4 (B)).
     - **S6c.** E1 runs once at the base exe, in its own shared hold. Before the run, the exe's sha256 is checked equal to R10. The result is recorded against P-E1-base under (d).
     - **S6d.** E1 runs once at the head exe, in its own shared hold, after S6c. The exe's sha256 is checked equal to R7. The result is recorded against P-head under (d).
     - **S7.** As prepared, plus (d) in the README entry, counted against its ceiling of 45.
     - **S8.** The report, then both gates.
   - **Shared holds:** S6c, S6d, any vitest or verify run, and every heavy run of the reviewer. E1 uses no dev server. The reviewer's dev-build suites run on 5400.
   - **On (A):** the piece stops at S6 and returns to the architect, and the v0.2 tag stays behind this node.

8. **The gates at the final head (§12), for (c) and (d).** The reviewer:
   - recomputes, from the final head run's images and the final base run's images by sha256, with its own decode:
     - B, from the start ring;
     - N, C, and (c)'s verdict against its REPORT line;
     - each box, K, each move in buffer px, and (d)'s verdict;
     - N_end at the base;
   - shows that (c)'s code differs from 3df3e57c only by F1 and the change to REPORT;
   - shows that the product tree is unchanged since 3df3e57c;
   - checks both exes' sha256 against R7 and R10;
   - confirms that item 1's record is not re-labelled;
   - recomputes (d) on its own E1 run at the head build.

9. **The reuse index.** The custodian ran it on 2026-11-12 in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, with two searches: `image rule pixel centroid displacement screenshot` and `e2e baseline capture warm-up tile residency`. Each exited 1 with no prior art recorded. Misses: both. Rule (d) comes from this form's own images and from note 5.

Nothing above is edited.

*The custodian's settlement of this amendment's OPEN items, written at its commit on 2026-11-12 (class 1).*

1. **The carried text.** Everything in this amendment above this settlement is the architect's draft (`state/consults/2026-11-12-recentre-crossing-view-displaced-fix-e1-image-rule-amendment-architect-draft.md`, read only at main 3b9864d6; its fenced block's sha256 c53bdbbe3d54f7199fd52d1acaced3688ce19568df8b173f8f5c82f3918d1e3d), carried byte for byte with one change, the custodian's: each `sha256:<H>` pin is filled by script with the sha256 of the cited whole lines, each with its LF, at 3b9864d6199f9b45f5f6bc2e3bfff1f867187bda (12 pins). The custodian read each range at that commit against its label. The draft's OPEN items, gate findings, reading list and packet gaps stay in the filed draft.

2. **The boxes' source** (the draft's first packet gap). They come from the custodian's scratch script `<S>/rce1-bbox.mjs` (2910 bytes, sha256 c4bbe4245a837c4c1e4d9b0e54ed4574cf35b7946eefa3cda9b07dd626e00e7f), which is evidence and not Authority. Its output on the four images, byte for byte, one line each:
   - `rcf-s3b-recentre-crossing-e1-1794465184091-case1-start.png 668x712 B 255,255,255 N 35248 bbox x 66-667 y 258-357`
   - `rcf-s3b-recentre-crossing-e1-1794465184091-case1-end.png 668x712 B 255,255,255 N 0 empty`
   - `rcf-s47-recentre-crossing-e1-1794469226237-case1-start.png 668x712 B 255,255,255 N 35248 bbox x 66-667 y 258-357`
   - `rcf-s47-recentre-crossing-e1-1794469226237-case1-end.png 668x712 B 255,255,255 N 127606 bbox x 66-667 y 0-357`
   It gives E1's N for each image. The reviewer recomputes with its own decode (item 8).

3. **OPEN-A is a red line.** It waits for the human's typed word on whether (c) is replaced, and how. Nothing of item 7's S6b to S8 starts before that word. Until then the fix stands as item 1 records it, and slot 2 holds.

4. **OPEN-B (A) and OPEN-C (A)**, not red lines, are the draft's recommendations, taken on 2026-11-12 at this commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`), for the human's review on return.
   - OPEN-B (A) lands only with OPEN-A's (C).
   - OPEN-C (A): the residency observation is recorded as unmeasured and goes on the Monday list. No node is placed.

5. **The gate findings.** F1 to F3 land only with OPEN-A's (C), in the (d) commit. F4 to F6 are readings, recorded.

Nothing above is edited.

### Amendment 3 — the human's rulings of 2026-11-12 on Amendment 2, and the gate's edge check, declared before the fresh runs (class 1, before any code of S6b)

*Written by the custodian on 2026-11-12, at this commit, from the human's message of 2026-11-12 (13:07Z), filed verbatim at `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md` (main 9d8cff10). Its item 1 is the ruling. The words below are the custodian's record of it, not a quotation, except the one passage marked byte-copied.*

1. **OPEN-A: (C), the human's typed word (item 1 (a)).**
   - Rule (d) is asserted as Amendment 2, item 4 declares it.
   - (c) is kept with F1. It is reported and does not count in the exit code.
   - The record of (c) as failed at 3df3e57c stays (Amendment 2, item 1).
   - I5 and I6 stand as Amendment 2, item 5 declares them.
   - OPEN-B (A) and the gate findings F1 to F3 of Amendment 2's filed draft (`state/consults/2026-11-12-recentre-crossing-view-displaced-fix-e1-image-rule-amendment-architect-draft.md`) land in S6b's commit. F2's and F3's replacement words are applied byte for byte from that draft.
   - Amendment 2, settlement item 3's hold is lifted: S6b to S8 start from this commit, in the order of item 8 below.

2. **The gate's edge check (item 1 (b)), declared here before the fresh runs.**
   - The check is the human's item 1 (b), byte-copied (verbatim) from `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:11` @ 9d8cff10a76337ad7037f6a72df7fa4dd3da9823 sha256:87eb48d637c37fc06ae283131bb594ce99c46dd154a7568c997fa6d53e0b7298:

     > (b) One addition for the gate, declared before the fresh runs. The reviewer computes, from the head run's end line (target, origin, zoom), the canvas box and the fixture's own extent, where the fixture's edges fall on the canvas, and reports them beside the end image's box. An edge in K that falls more than the drawn point radius plus 4.0 buffer px from the image's edge is a Correctness finding. From the same projection the reviewer says whether the fixture reaches the canvas's top and right edges at that view. If it does, the start image is the partial one. If it does not, the end image shows data where the fixture has none, and that stops the piece.

   - The custodian's notes below only name where each input is read. They add nothing to what is checked.
     - **The head run** is S6d's run, the fresh run at the head exe.
     - **The end line** is case 1's last `view-state` line, the line case 1 (b) reads as W_end. S6d's log carries it in item 3's REPORT line.
     - **The canvas box** is the canvas and buffer sizes on E1's case 1 header line, and the images' size.
     - **The fixture's own extent** is computed by the reviewer from the fixture file, read only, by its own script, which it shows.
     - **The projection from world units to canvas pixels** and **the drawn point radius** are read from the shell's code at the head. Each is cited by path and line; a branch line is named by branch and commit and never pinned. The reviewer shows its arithmetic.
     - **The edges** compared are those in K of rule (d) on S6d's image pair. The finding's tolerance is the drawn point radius in buffer px, plus 4.0 buffer px.
   - It joins the reviewer's list in Amendment 2, item 8. If it stops the piece, the stop goes to the human, and nothing merges.

3. **One REPORT line for item 2's input (the custodian's, declared before any code).**
   - S6b's commit adds one line to case 1, printed after the end capture. It gives the start line's and the end line's target, origin and zoom, each at full precision. These are the `view-state` lines case 1 (b) already reads.
   - It is marked REPORT. It counts in no verdict and changes none.
   - It is inside S6b's one commit to `recentre-crossing.mjs` and that file's ceiling of 450 (§7).

4. **OPEN-C (item 1 (c)).**
   - The human's ruling replaces OPEN-C (A) of Amendment 2's settlement, item 4: the residency observation does not go on the Monday list.
   - A read-only architect consult starts now, in the docs lane. It answers what is drawn at the start of case 1 and what at its end, by which query each, and whether anything on screen tells the user that the start is partial.
   - It goes to the human for a grade. If reading cannot name the mechanism, it proposes one observation with its form.
   - This amendment places no node. The fix's steps do not wait for the consult.

5. **Item 1 (d), recorded.**
   - The reproducer showed the defect and its reviewer recomputed it: S1, as placed.
   - Run rc's OPEN-5 (B), as run, stands. It is recorded on the reproducer's form, by its Amendment 1, at this commit.
   - OPEN-1 (C) with the custodian's change (Amendment 1, item 2) is confirmed by the human.

6. **OPEN-5 (item 1 (e)): v0.1.0's record.**
   - At this piece's closing record, the custodian appends an amendment to `governance/RELEASE-0.1.md`.
   - It holds the human's words between the quotation marks of item 1 (e) (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:16` @ 9d8cff10a76337ad7037f6a72df7fa4dd3da9823 sha256:9d87d34c3ac42fd4f83d90233a5071efcab5037757de38ee30acc33923e5fe78), byte for byte, with `<PR>` and `<merge commit>` filled with this piece's PR number and merge commit. Nothing else is added.
   - Those words, without their quotation marks, are 650 bytes, sha256 d67097b074f7ad50e4c095fb5d4a53bf9c463b897edb97bd5694dd7377ab9d8d.
   - v0.1.0's release page is not touched (item 1 (e)).
   - This answers Amendment 1, item 3's "Nothing is written until then".

7. **OPEN-4 and F5 (item 1 (f)): row A7a.**
   - **The expected outcome** is the draft's, approved as drafted: the italic words of the draft expected outcome under OPEN-4 (A) in `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-form-architect-draft.md`. The worker byte-copies it from there.
   - **The step** is the human's words of item 1 (f), between its quotation marks (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:19` @ 9d8cff10a76337ad7037f6a72df7fa4dd3da9823 sha256:a65be751af8483e7af81ef6481d8519ce206fbc23dec05bc6911553e137197ea), byte for byte, with N filled. Those words are 181 bytes, sha256 4572484e070310452792f8e5170c1dee5f69dbe626557fc7ec0155128fa3bb17.
   - **N** is S6e's result (item 8). If N is over 20, the row is not added, the README's E1 entry is the guard, and the closing record says so.
   - **A5 and A6** keep their words. The closing record says that sittings before this fix did not pan past the bound at low zoom.

8. **The steps from here.** These are Amendment 2, item 7's steps, with this amendment's additions. Every heavy call runs in a shared hold.
   - **S6b.** One worker commit, to `recentre-crossing.mjs` only. It holds:
     - (d);
     - F1;
     - (c)'s line marked REPORT and taken out of the exit code;
     - F2's and F3's words;
     - item 3's REPORT line.
   - **S6b's checks.** `node --check` passes. The scratch check of (d) on the four stored images is made as Amendment 2, item 7 gives it, as a check of the code and not an observation.
   - **S6c and S6d.** As Amendment 2, item 7: each runs once, at its own exe, with that exe's sha256 checked first.
   - **S6e (new): N's run.** It runs only if S6d meets P-head under (d). It runs once, in a shared hold, at the head exe, using a scratch copy of `recentre-crossing.mjs` at S6b's commit. The copy is not committed, and only its plan is changed:
     - From the fit, wheel notches out, one at a time, each with E1's settle and a capture. It stops at the first notch at which the drawn data's box, by rule (d)'s marking, is at most a tenth of the image's width.
     - Then drags of floor(cw/3) CSS px to the left, by E1's drag and settle, one at a time, until the first origin change or 25 drags.
     - k is the drag whose settled tick moved the origin (E1's rule). N = k + 2.
     - The report gives the copy's diff against S6b's file, each notch's zoom and box width, k and N.
     - The row waits for the human, and the run is reported as it stands, in any of three cases: the zoom limit stops the notches first; the first box at or under a tenth is under a twentieth of the width; or no origin change comes in 25 drags.
   - **S7.** The README entry as prepared at S6 (`<S>/rcf-s47-readme-entry.txt`), changed for (c) reported and (d) asserted, within its ceiling of 45. Row A7a by item 7, within its ceiling of 4.
   - **S8.** The report, then both gates, with item 2's check added to the reviewer's list.

9. **Rule (00), checked by script at this commit.**
   - `git diff --name-only origin/main...origin/<branch>` names, for each PR open at this commit:
     - #309 (`cut/pre-admission-change-detail-braces`): `frontends/shell/src/testUtils/terminalShapes.ts`, `kernel/README.md`, `kernel/src/lib.rs`, `kernel/src/skp.rs`, `kernel/tests/source_watch_ordering.rs`, `kernel/tests/typed_terminal_codes.rs`;
     - #308 (`cut/adr-035-close-races-note`): `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`.
   - Neither names a path in §7's table, which is this piece's.
   - PR B's session-end phase (slot 1, item 2 (d) of the same message) names none of §7's files.

10. **PLAN.** The node stays in progress, and its budget is unchanged.

Nothing above is edited.

### Amendment 4 — the human's OPEN-3 (A) of 2026-11-12: the edge check's tolerance on this polygon fixture, and the gates (class 1, before either gate)

*Written by the custodian on 2026-11-12, at this commit, from the human's message of 2026-11-12 (21:15Z), filed verbatim at `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md` in this commit. Its items 1 and 2 are the ruling. The words below are the custodian's record of them, not a quotation.*

1. **OPEN-3: (A), the human's typed word (item 1, the file's line 9).**
   - OPEN-3 is the third open item of the OPEN-C consult (`state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md`). It asked how Amendment 3, item 2's tolerance reads its drawn point radius on this fixture, whose features are parcel polygons.
   - In that tolerance the reviewer uses, in place of the drawn point radius, the parcel polygon's drawn half-extent at the end line's zoom plus the layer's outline width. Each is read from code at the head and cited as Amendment 3, item 2 cites the projection. The report says that it used them. The 4.0 buffer px are added as before.
   - Nothing else in Amendment 3, item 2 changes.

2. **The human's standing rule (item 2, the file's line 11), as it bears on these gates.** A question about how to read or apply a check the human typed for a gate or a run takes the architect's recommended reading, recorded with its date, and the human reviews it at the click. It never changes what the check is for. If a gate raises such a question about Amendment 3, item 2 or item 1 above, that reading is taken and recorded with the gate's filing.

3. **The gates start now (item 1).** This is Amendment 3, item 8's S8, at the branch head b7ba9f77 (the S6b to S7 report, `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s6b-s7-worker-report.md`):
   - the reviewer, with §12's list, Amendment 2, item 8's list, and Amendment 3, item 2's check as item 1 above reads it;
   - the architect, as §12 gives it.
   - Both are dispatched after this commit is on main.

4. **The OPEN-C consult's other rulings (item 3), as they bear on this piece.**
   - Item 3 (a) grades the consult's OPEN-1 (B) S1. It places a node for the open's first look, built after PR B merges.
   - G2's comment words (the capture comment in `recentre-crossing.mjs` on this branch) go to that node. This piece does not add them.
   - OPEN-2's item goes to the docs lane, and OPEN-4 to the next P6 sight.
   - None of them changes this piece's steps or ceilings.

5. **Rule (00), checked by script at this commit.**
   - #308 (`cut/adr-035-close-races-note`) is the one PR open at this commit. `git diff --name-only origin/main...origin/cut/adr-035-close-races-note` names `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` only.
   - PR B's branch (`cut/b1-shell-half-pr-b`, slot 1, at b8127685) names none of the paths this piece's branch changes.

6. **PLAN.** The node stays in progress, and its budget is unchanged.

Nothing above is edited.

### Amendment 5 — 2026-11-13 — the closing record (class 1), references and hashes only

- **The final head:** e0ed07e2ee7e6cec43d14695f031def016edbec6, correction 2's words commit, on eb63a3f8 (correction 1's words), on 01534494 (E-1's test commit), on b7ba9f77 (the build), from B 9398efc6e3db7474cc9b1346ea9e1a5f1d5c7832.
- **Build:** `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s6b-s7-worker-report.md` (sha256 16e8bc20150bf09bcb49b93b6bc075ce179333cb4b3d54b9a4b519080fdb9ab9). A7a's N is 5 there (k = 3), so the row is in (Amendment 3, item 7).
- **Corrections:** `state/consults/2026-11-13-recentre-crossing-view-displaced-fix-correction-1-worker-report.md` (sha256 4cc5341ee159e3e4c1d1e02c53393bede2466da273c61ef02ef0b36797b4bb93); its mutation run, `state/consults/2026-11-13-recentre-crossing-view-displaced-fix-correction-1-mutations-worker-report.md` (sha256 dbddcaeed0c669c52fd97bc58ca295d2469d4dd4dcc3b9cf2990669ceabac7f5); `state/consults/2026-11-13-recentre-crossing-view-displaced-fix-correction-2-worker-report.md` (sha256 7d35888be23ea0fe4d68d4091a3f83f3012d6042250e62e680a4b065612f1806).
- **Gates:**
  - the architect: attempt 1, FAIL, `state/consults/gates/2026-11-12-recentre-crossing-view-displaced-fix-gate-architect.md` (sha256 1a9dc64a6fa93c0300eb8a0cf6d346033c34b3be79f64592cecf80a855d8c8a5), gate-log 731; attempt 2, PASS WITH NOTES, `state/consults/gates/2026-11-13-recentre-crossing-view-displaced-fix-gate-architect-attempt-2.md` (sha256 d391b2fe9ffa5a829ee6126ac629ef27b6dbd20a828dfe910fe1405365fc9c36), gate-log 734;
  - the reviewer: attempt 1, PASS WITH NOTES, `state/consults/gates/2026-11-12-recentre-crossing-view-displaced-fix-gate-reviewer.md` (sha256 a17033a0fb52f7b8da0eff6e24884b5d46b452994236750878331941e89c8ab1), gate-log 733; attempt 2, PASS WITH NOTES, `state/consults/gates/2026-11-13-recentre-crossing-view-displaced-fix-gate-reviewer-attempt-2.md` (sha256 94bd2acd6f6138e524cfedb55aff18f367cde2cdb1170e8887d4cadaa9449b13), gate-log 735.
  - Attempt 2's D-4 and D-5 are in at the final head. Its D-A is the PR body, rewritten at the final head with the words applied that are not the human's.
- **§12's runs at the final head:** the reviewer's attempt 1 runs at b7ba9f77 stand by its attempt 2's finding that every product line changed since b7ba9f77 is a comment. Correction 2 changes comment lines and the README entry only, by the custodian's script named in its filing note. This is the custodian's reading, for the human at the click.
- **Size:** `git diff --numstat 9398efc6...e0ed07e2 -- frontends/shell`: `MANUAL-WALKTHROUGH.md` 1 of 4, `e2e/README.md` 12 of 45, `e2e/recentre-crossing.mjs` 347 of 450, `package.json` 1 of 2, `src/canvas/WorkingCanvas.recentre.test.tsx` 222 of 300, `src/canvas/WorkingCanvas.tsx` 69 of 70. Each is within §7.
- **A5 and A6** keep their words. As Amendment 3, item 7 has it, sittings before this fix did not pan past the bound at low zoom.
- **CI:** this PR's checks at the final head, read by gh at 01:52:27Z: 8 of 8 pass.
- **For the human at the click:** the architect's READING lines (2026-11-12, (a) to (d); 2026-11-13) under Amendment 4, item 2; its H-1 to H-4; the §12 line above.
- **After the merge:** the amendment to `governance/RELEASE-0.1.md` of Amendment 3, item 6, with this PR's number and merge commit.
- **Merge:** the human's click, by merge commit.
