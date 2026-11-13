*Custodian's filing note (2026-11-12): the architect's read-only full form draft for `open-first-look-fills-fit-view`, read at main 6e041829, from its hand-back (53373 bytes, sha256 d34f0040e27541c4b695f29624e91e680061799168fcb3134149fdcf36eb6efe), below the rule. Each `sha256:<H>` pin is filled by script with the sha256 of the cited whole lines, each with its LF, at 6e041829cd67429fa55eadf213ba22fe11c0aa27 (70 pins); a final newline is added; nothing else is changed. Its brief by file (8550 bytes, sha256 187f12cb28583c45456f0ed4c5476031bd5ea868222d4bbea1fe1188dba41cb2); the run 23:24:20Z to 23:39:47Z by its transcript, 100 calls (Read 59, Grep 37, Glob 3, SubagentHandback 1), no write, model claude-opus-5-5. Two calls errored, both Greps: one of `docs/08_Performance_Budgets.md`, a name the brief's bare `docs/08` led to (the file is `docs/08_Testing.md`), and one whose pattern ripgrep refused. The custodian's answers to two of its gaps, by script at 7f1ea993: PR B's diff at b8127685 names 16 files, none of them `WorkingCanvas.tsx`, `candidateArmSession.ts` or their tests (the brief named only `App.tsx`); no file under `state/directives/` names FILL, which is the check of the refill-after-resize form. Its OPEN-2 and OPEN-8 are red lines and wait for the human. A draft and not Authority.*

---

Drafted: open-first-look-fills-fit-view full form, at 6e041829 (main @ 6e041829cd67429fa55eadf213ba22fe11c0aa27)

````markdown
# shell: when an open's first look ends, the map asks for the tiles of the view the fit shows, so that view fills without a pan and the status line speaks; full form, both gates

*File: `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md`. PLAN node `open-first-look-fills-fit-view` (C1), S1, the next free slot after PR B merges (C3).*
*Drafted by the architect (claude-opus-5-5) on 2026-11-12 for the custodian, read only, at main 6e041829cd67429fa55eadf213ba22fe11c0aa27. The custodian commits it before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line. An amendment made after any outcome has been seen says so in its first line.*
*Form: full, with both gates from dispatch (§21a, C60: a property under test changes, §2.4; and the size, §7).*
*Code starts only after PR B (`b1-shell-half`) and #311 (`recentre-crossing-view-displaced-fix`) have merged and §7 step S1 is recorded (§8).*

## §0 Disclosure

**0.1 Authority.**
- The human's message of 2026-11-12 (21:15Z), item 3 (a) (C2). It binds this form: OPEN-1 (B) of the OPEN-C consult, graded S1; the node plans the tiles of the view the fit shows, so the view fills without a pan and the status line speaks; built after PR B merges; v0.2's tag waits for it; G2's comment words come to it.
- The same message, item 3 (b) (C3a): the KNOWN-LIMITATIONS item this node withdraws when it merges.
- The same message, item 8 (C3): the order.
- The same message, item 2 (C3b): a question about how to read or apply a check the human typed takes the architect's recommended reading, dated.

**0.2 Evidence, not Authority.**
- The OPEN-C consult (C4), §1 to §4: the defect's reading, cited by section. Its G1 and G2 (C5, C6). No new numbers are added here.
- #311's branch at b7ba9f77 (`C:/dev/wt/rcf`), read for `frontends/shell/e2e/recentre-crossing.mjs` only. Its spans are named in words with that commit id and carry no hash (round 25, item 2 (d)).

**0.3 The reuse index.** Byte-copied from the custodian's brief and marked so. The custodian ran it in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-12.

```text
$ node tools/reuse.mjs plan tiles for fit view on open   (exit 1)
No prior art recorded for "plan tiles for fit view on open". Research it before planning an implementation.
$ node tools/reuse.mjs first look partial view status line   (exit 1)
No prior art recorded for "first look partial view status line". Research it before planning an implementation.
$ node tools/reuse.mjs initial viewport tile request after fit to extent   (exit 1)
No prior art recorded for "initial viewport tile request after fit to extent". Research it before planning an implementation.
```

Misses: all three searches found no prior art. The research behind §2 is a reading of this repository's own code (§0.4).

**0.4 Cites.** Every tracked cite is at main, `@ 6e041829cd67429fa55eadf213ba22fe11c0aa27`. The custodian computes each `<H>` as sha256 over the cited whole lines, LF bytes. PR B and #311 both edit `WorkingCanvas.tsx`, and PR B edits `App.tsx`. After they merge, these pins are historical. §8 says which is authoritative, and how each is re-derived before code.

The human's message, the PLAN and the consult:
- C1 `governance/PLAN.yaml:7127-7143` @ 6e041829 sha256:be7bb5acd9f0022636f611c99b866debea4eb480543c844a4deb0fc35eb445b7
- C2 `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:14` @ 6e041829 sha256:c4a4c2bfc09488f779ea9047d07a3768ee0bac33a0cde56c326981ddae0fef10
- C3a `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:15` @ 6e041829 sha256:9ba7e478438eb7a5af67e716a49f5e232bbd4629165bfb111b87c512c298a9b8
- C3 `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:35` @ 6e041829 sha256:55eda56a61c43653d89768668393f23cca6096c2d7af0228b902daeecbb6c4a8
- C3b `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:11` @ 6e041829 sha256:700ce440c2f0a9e34a5a0e2f84276038a71e4e7d06bba4eae549cb5cbef9f4c2
- C4 `state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md:76-80` @ 6e041829 sha256:5af18b0594b3e147b21191c17c990ecef1d2eccc7d737b8495a443e31d2a87e3 (OPEN-1; §1 to §4 are cited by section)
- C5 `state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md:97` @ 6e041829 sha256:0ae98335c488ba6da21541a36e35455be4d726aa41fb523319ea41ef22dd6dc9 (G1)
- C6 `state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md:98` @ 6e041829 sha256:9c71b00c16ec5b9a5c93c0ed08eef2f06f48fa425d4f69bd0d50aef9532dd8fc (G2)
- PLAN nodes `known-limitations-first-look-partial-view`, `b1-shell-half`, `recentre-crossing-view-displaced-fix` and `release-v0-2-0` are cited by id.

`candidateArmSession.ts` (the session):
- C7 `frontends/shell/src/residency/candidateArmSession.ts:68-79` @ 6e041829 sha256:e7e4aa820d641c06a5f284b14633bb1da287ea409735caa677ecf13a85a2a320 (why planning waits for `onViewportChanged`)
- C8 `frontends/shell/src/residency/candidateArmSession.ts:109` @ 6e041829 sha256:f58bc948d056781673370df90e4db7cd611860a0887c73db4cb424cc7a09428d (the session holds `WorkingCanvasHandle`)
- C9 `frontends/shell/src/residency/candidateArmSession.ts:704-715` @ 6e041829 sha256:bfd4c3a3cb8f629462d377d61bbc133d18f27dfd0e392d91a130a88d7cf9fb13 (`currentSettledState`)
- C10 `frontends/shell/src/residency/candidateArmSession.ts:717-852` @ 6e041829 sha256:091cd1e9572ffdf260b2c19e237d6a8c5c1114f138888d4f30065a9690330129 (`emitResidencyStatus`)
- C11 `frontends/shell/src/residency/candidateArmSession.ts:1213-1239` @ 6e041829 sha256:43d0d729914e80140af46f31c1cc1291e929459067c8d80683bf138a29a48fcb (`establishFrameFromExtent`)
- C12 `frontends/shell/src/residency/candidateArmSession.ts:1328-1442` @ 6e041829 sha256:d372c44408a777d3c19dc13465e56c17eb2eaea11d9da8bc80d71ab8eeb127ca (the first look's `onTerminal`)
- C13 `frontends/shell/src/residency/candidateArmSession.ts:1337-1338` @ 6e041829 sha256:12dc2dbe62e882e2260a2de930767f18509eb6ce1905c870456e1c414a14c407 (`wasCurrent`)
- C14 `frontends/shell/src/residency/candidateArmSession.ts:1355-1358` @ 6e041829 sha256:545eb1fba2ab44d891b73622b7c8129e2d51bd47d3630e6038a74c4b5359f223 (session ended: return)
- C15 `frontends/shell/src/residency/candidateArmSession.ts:1373-1388` @ 6e041829 sha256:61310c01a8582d3603ee7f1916b5c27d78aae8991ba226c6caa66d96b2f81beb (self-cancel; a non-`Completed` terminal's accounting)
- C16 `frontends/shell/src/residency/candidateArmSession.ts:1408-1421` @ 6e041829 sha256:59b1dcf0461603c36f622a5a28a94d286bab2145612bfc7a7e2dbcf897810f13 (the frame is established; the limit marks the first look partial)
- C17 `frontends/shell/src/residency/candidateArmSession.ts:1454` @ 6e041829 sha256:08ca46cd40e0f963d0a6f835ca9499463dbca2af69781bf560452aeaafe502fa (the debounce)
- C18 `frontends/shell/src/residency/candidateArmSession.ts:1465-1496` @ 6e041829 sha256:2a437fcdf76f0dcf7857a5316a313e8eb852c68cc3471eb180a66b8aec0d39e9 (`handleViewportChange`: `onCameraChange`, `hasPlanned`, `failedCoveringTerminals.clear()`)
- C19 `frontends/shell/src/residency/candidateArmSession.ts:1625-1631` @ 6e041829 sha256:9928fb4a1d31cde3f5e83ae6f43f73c9d950e0fdc571ca48ede5e854c3d44983 (`onViewportChanged`: the accept path)
- C20 `frontends/shell/src/residency/candidateArmSession.ts:1640-1708` @ 6e041829 sha256:3f370f7dd0eb20b30cfb1ef5340c7b9fbe947e62d88f23e35ea7fac7a0a35ba5 (`reissueUnrestricted`)
- C21 `frontends/shell/src/residency/candidateArmSession.ts:1738-1831` @ 6e041829 sha256:dedfc804ad8757eccf91412a4ba1186b0cf68cbed9aee8d164cc7149abe98fca (`relinquishFill`)

`residencyStatus.ts`, `App.tsx`, the constants and the manager:
- C22 `frontends/shell/src/residency/residencyStatus.ts:330-336` @ 6e041829 sha256:3d84bc8cf37f351430d098d1e8748565cb62683776c6a13afb70d34299d28400 (`settledState`)
- C23 `frontends/shell/src/residency/residencyStatus.ts:404-481` @ 6e041829 sha256:5207ff0f84c0891e0ee7128d3ebd94456023e06d8e3d178d59df479912520e52 (the strings and `residencyStatusText`)
- C24 `frontends/shell/src/App.tsx:1649-1705` @ 6e041829 sha256:8ef1cef6ef5bb8756e7c72dd3ee27f9158f1137fe08c60ae5e7514dcbd8417bf (the session is built with the canvas handle)
- C25 `frontends/shell/src/App.tsx:1738` @ 6e041829 sha256:586b4842a3325b2c19e2d7cd609a8c03be34b2c68f7c172eb5b30cab8edd2cd6 (the first look is issued)
- C26 `frontends/shell/src/App.tsx:2313-2324` @ 6e041829 sha256:ba896721734aae7380f161cffa42bd67d251eb3ece8e02505297a8005758da44 (`onViewportChanged` wiring)
- C27 `frontends/shell/src/App.tsx:2418-2431` @ 6e041829 sha256:e90ec55b1e81d9f67c0762d17321bae3a15cb5234339776584bedd58b35d1460 (the status slot)
- C28 `frontends/shell/src/canvas/tileGridConstants.ts:35` @ 6e041829 sha256:b8b771eb87c950fff9b9b6c91a601f55af06a9b91005c35476d5dd285f647c81
- C29 `frontends/shell/src/canvas/tileGridConstants.ts:40` @ 6e041829 sha256:a8efcbcde73e438dc7828fbb382478af637ba27523beb317e4e6d5b11f3b5180
- C30 `frontends/shell/src/canvas/tileGridConstants.ts:54` @ 6e041829 sha256:c3d93054d82e32dfaab0cb6ce58a3c208f3f3d210f41ad32df97dcc1845799bf
- C31 `frontends/shell/src/canvas/tileGridConstants.ts:145` @ 6e041829 sha256:0176b1736fbbafb486e479a376b589ad2c4bac55418333578acfb2851beb481d
- C32 `frontends/shell/src/canvas/tileGridConstants.ts:185` @ 6e041829 sha256:61c4f5a8d589f14a8f542eb00fe28e216fb08f39d63081b68417f3e95da2996b
- C33 `frontends/shell/src/streaming/viewportStreamManager.ts:25` @ 6e041829 sha256:0c951f7fadc18dad65170ff2adf4b3bf6efb41ac49ab9056eac397495e0b1a84
- C34 `frontends/shell/src/streaming/tileViewportStreamManager.ts:511-518` @ 6e041829 sha256:d5a33dc92765e171c29f64650ffce464669ea7cd8d9b33b35cfe527740ee4621 (`onCameraChange`; `no-frame`)
- C35 `engine/src/stream.rs:1723-1724` @ 6e041829 sha256:c689377989702056f3ef9b95d62049a7a9bbc191c0a4b87b4eb792ab3b6fe200 (the first look's `LIMIT`, untouched)

`WorkingCanvas.tsx`:
- C36 `frontends/shell/src/canvas/WorkingCanvas.tsx:143-148` @ 6e041829 sha256:2b33fd60fafc27213a2183d80ea0d006d2136b83b538e975f123799141f9f2b1 (`currentView?`: the read-only, optional-in-type precedent)
- C37 `frontends/shell/src/canvas/WorkingCanvas.tsx:556-559` @ 6e041829 sha256:557264bbc26590dbbcfb52e893bcb4dc8b9964364f77c8ec58ecb0be60c78382 (`onViewportChanged`: the auto-fit never fires it)
- C38 `frontends/shell/src/canvas/WorkingCanvas.tsx:582-584` @ 6e041829 sha256:770bbd3a4c49bbc7761521abcfc8b6d697a1b5f8dd38f9c39c39b1060df833d3 (`onViewShown`)
- C39 `frontends/shell/src/canvas/WorkingCanvas.tsx:1080-1091` @ 6e041829 sha256:9dfccb04a8798432481fd50a05f80cdb3047aefe357bf38936381f5e969ae7ef (`cameraRef`, `lastQueriedRef`, `reportViewport`)
- C40 `frontends/shell/src/canvas/WorkingCanvas.tsx:1402-1435` @ 6e041829 sha256:953361a5d758c9119fb6c25e3e87ec39d2416b262b25f477e4a454f9b70448ac (`fitToExtent`; the fit's `view-state` line; the unreported branch)
- C41 `frontends/shell/src/canvas/WorkingCanvas.tsx:1771-1782` @ 6e041829 sha256:a02abe1b0c803a071841527fd4071ee13effbc0e27302cc67607a78bb4484af4 (the tile arm's one-shot auto-fit)
- C42 `frontends/shell/src/canvas/WorkingCanvas.tsx:2077-2088` @ 6e041829 sha256:835c7ccada0359ef52dc635ce28149d04da8e59e886de28dff9f3c3fec43576d (`onResize`: the box from `cameraRef` and the client size)
- C43 `frontends/shell/src/canvas/WorkingCanvas.tsx:2148-2158` @ 6e041829 sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2 (the interactive report)
- C44 `frontends/shell/src/canvas/viewportBbox.ts:37` @ 6e041829 sha256:0f15750b309a976fed7f531dc4af01119bf19848f631c22c333be631b11029c4 (`computeAuthoritativeViewportBbox`)

Tests and e2e:
- C45 `frontends/shell/src/residency/candidateArmSession.test.ts:96-122` @ 6e041829 sha256:55fa4cf59d166f9aa7eeb21a2ba2f1b9a08822ea7fdfacea08238d3a151e2282 (`fakeCanvas`, typed `WorkingCanvasHandle`)
- C46 `frontends/shell/src/residency/candidateArmSession.test.ts:127-131` @ 6e041829 sha256:1f0ff8162d83435b77f395ba808b5e89248a1680785bee8b1291187811f5b4bc (`lastSink`)
- C47 `frontends/shell/src/diagnostics/renderTrace.ts:23-54` @ 6e041829 sha256:3f1ea2f07ebe505e4d89e8a8dfe64f346fae76c9ea7ea3a373608adcf4b32e6c (`viewport_query`, `stream-issued`, `batch`, `view-state` lines)
- C48 `frontends/shell/e2e/lib.mjs:254` @ 6e041829 sha256:6a5b4d8ded13891b674c202319088dac739830188ccd02a926dca54694f72d63 (`attachOrLaunchExe`)
- C49 `frontends/shell/e2e/lib.mjs:348` @ 6e041829 sha256:1063ae1866141dfeaaaa18b812de4c1c6eb64d1772d88bf4c36eceeace969c2e (`waitForSettle`, its defaults)
- C50 `frontends/shell/e2e/layout.mjs:412-479` @ 6e041829 sha256:59d6ab25ba423f7e49de0d8fc4f881ada18435fc2cf64edf02a2380ead6c5e8c (FILL)
- C51 `frontends/shell/e2e/residency-harness.mjs:446` @ 6e041829 sha256:64f30e0845c8c36ffaf7cb73264d13992354b17e3cd6d9fad37d9a0791389ba0 (`FIELD_SEQUENCE_EVENTS`)

Records:
- C52 `KNOWN-LIMITATIONS.md:104-111` @ 6e041829 sha256:e0b61cadaeeeaae74d0f39892a89e6c21fd523be0d85295e7a9084274f36a90b (item 7)
- C53 `KNOWN-LIMITATIONS.md:248-253` @ 6e041829 sha256:954fa4d7a00da935590db1e53f178ca48e2bc788907404f7392d697eabb3a948 (item 18: the retirement form)
- C54 `KNOWN-LIMITATIONS.md:425-426` @ 6e041829 sha256:ee03735f1c4f600722488e18ce6e33eec23da9521c312311b7c571338db2d699 (item 39)
- C55 `KNOWN-LIMITATIONS.md:498-500` @ 6e041829 sha256:37aa723936191889a446f9d01c9be6dd38b1a0c4246e97f8fb5ad8f0fb941806 (item 61)
- C56 `frontends/shell/MANUAL-WALKTHROUGH.md:166` @ 6e041829 sha256:5df54bd3d17871b911197b3e21000418096e42ada22196ef372433218d39d455 (A7)
- C57 `frontends/shell/MANUAL-WALKTHROUGH.md:808-811` @ 6e041829 sha256:f2b00fec3d0a44d0fbd8837cb8e5d333c9660d1ec17c9636e0a4a93068116205 (Part L's strip note)
- C58 `frontends/shell/MANUAL-WALKTHROUGH.md:815` @ 6e041829 sha256:6bf98889061730bada90b3c53035b4e870811316290600007f745d957c1a1ffa (L1)
- C59 `frontends/shell/MANUAL-WALKTHROUGH.md:819` @ 6e041829 sha256:b58dd556d926af2bbd4dd39faad8265b63ea9fec97025fb2cbee6ec2f6265fce (L5)

Constitution and rules:
- C60 `governance/AUTONOMY.md:315-332` @ 6e041829 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3 (§21a)
- C61 `docs/adr/ADR-010-render-frames-origins-boundaries.md:17-29` @ 6e041829 sha256:7c2b22ba978cad8e12f9a9c5444e1ff810fa482144312307dd572ba2c450b760 (rule 1)
- C62 `docs/adr/ADR-010-render-frames-origins-boundaries.md:49-53` @ 6e041829 sha256:aa32d272aeff8e0922fdb8ecfeb7a4d64f847ee161950d261cc1f8e0b3fdbbe5 (rule 3)
- C63 `docs/adr/ADR-010-render-frames-origins-boundaries.md:62-68` @ 6e041829 sha256:7d1c18cb9638deee9306da75fabdafad70229a951e0ec2bbdd21fa560be750bb (rule 5)
- C64 `docs/adr/ADR-010-render-frames-origins-boundaries.md:70-74` @ 6e041829 sha256:fd39e8cc8ee350a3357220995afcf14d40665313174eb4424ce44c1e57514843 (rule 6)
- C65 `docs/adr/ADR-010-render-frames-origins-boundaries.md:76-87` @ 6e041829 sha256:cd36626523e0ba9fd4ecf243e40a51af38bc83bef3e6e33517cfaf371defbe85 (rule 7)
- C66 `docs/01_Principles.md:13-14` @ 6e041829 sha256:40bfa4a1b32eddb0c088924fd35913c90f318ad926813702d6096e7562ea4fa0 (principles 7 and 8)
- C67 `docs/08_Testing.md:6` @ 6e041829 sha256:c2fd62aca10bbeb65cda7fef3b96b70ecbe60cc79cbace5467e88932152fdd61 (first pixels)
- C68 `docs/08_Testing.md:36` @ 6e041829 sha256:e5335184f13dfdf7d2deb825d79e8a6c747c9c4aaffa28e212ce6f8201df05de (measured: time to stable view)

## §1 The defect, by reference

- What is drawn after an open, and by which query: the consult's §1.
- What is drawn later, and by which query: its §2.
- That nothing on screen says the first view is partial: its §3.
- The mechanism: its §4. In this form's terms:
  - The tile arm's one-shot fit reports nothing (C40's unreported branch, C41, C37).
  - The grid frame exists only from the first look's terminal (C16, C11). Before that, `onCameraChange` returns `no-frame` (C34).
  - Planning runs only through `onViewportChanged` (C7, C19, C17, C18).
  - The status is silent until a plan has run (C9, C22, C10).
  - So after an open on a file over `UNTILED_FIRST_LOOK_ROW_LIMIT` rows (C32, C35), the view holds the first look's rows only, and the status says nothing until the first pan or zoom.
- A pan made while the first look is still running also plans nothing (it meets `no-frame`, C34, C18), and nothing re-plans at the terminal. The same shape closes it (§2.1).
- The same holds after an Apply or a Clear (C20): a fresh first look, the fit re-armed, no report. Whether this node covers it is OPEN-2, a red line.

## §2 The change

### 2.1 Placement P-B (recommended): plan when the first look ends

**Where.**
- `frontends/shell/src/canvas/WorkingCanvas.tsx`: one new read-only handle member and its implementation.
- `frontends/shell/src/residency/candidateArmSession.ts`: one guarded request in the first look's `onTerminal` (C12); the accept path named as one local function; the top doc comment (C7).
- No other product file changes. `App.tsx` is not edited.

**The canvas member.** `shownViewportBbox?(): AuthoritativeBbox | null`.
- It returns `computeAuthoritativeViewportBbox` (C44) of `cameraRef.current` (C39) at `canvasElRef.current`'s client size, the same computation `onResize`'s unreported branch makes (C42).
- It returns null before the first camera write, or at a zero client size.
- It changes nothing and issues no query.
- Optional in the type only, as `currentView?` is (C36); the component always provides it (OPEN-4).
- Its product caller is `candidateArmSession.ts`, through the handle the session already holds (C8, C24). It is not an instrument accessor.

**The session request.** In the first look's `onTerminal`, after the frame is established and the limit's partial mark (C16), and before the relinquished re-emit, the session asks for a plan of `canvas?.shownViewportBbox?.()` when all of these hold:
- (i) `wasCurrent` (C13): no orphan of an earlier generation plans;
- (ii) not self-cancelled (C15): neither an operator Cancel nor `stop()`;
- (iii) `terminal.kind === "Completed"`. A plan after a failed first look would clear its failure accounting (C18's `failedCoveringTerminals.clear()`, C15), so a failed first look stays as it is today (§3);
- (iv) not `stopped`. A session-ended terminal has already returned (C14);
- (v) no relinquish standing (`relinquishClearPending` false, C21): after a Cancel in the frameless window, tiling resumes on the next camera change, as now (walkthrough L4);
- (vi) no plan has run this generation (`hasPlanned` false);
- (vii) no viewport change is pending (`pendingViewportChange` false): a pending change already plans, and now finds a frame;
- (viii) the box is non-null, and `manager.gridFrame` is non-null.

**One planning path.** The request goes through the same accept function as `onViewportChanged` (C19): `pendingViewportChange = true; debounced.call(bbox)`. Both the returned `onViewportChanged` and the terminal call that one function. So the plan is `handleViewportChange` (C18) after the same 120 ms debounce (C33): `hasPlanned`, the failure-window reset, the relinquished supersession and the trailing status emit are all the code that already runs. There is no second planning path and no new status path.

**Logged (docs/01 principle 8, C66).**
- The plan's `viewport_query` and `stream-issued` lines are the manager's always-on trace (C47).
- One `logSessionEvent("candidate-first-look-view-planned", <the box>)` line at the request. It is a session-log line, not an app string.

**What the box is.** It is the view the canvas shows when the first look ends. With no input since the open, that is the view the fit shows (C40, C41). After a pan made during the first look, it is the panned view, which is what the user sees (OPEN-3 is the reading).

**What does not change.**
- The fit, `notifyViewport: false`, `lastQueriedRef` and `onViewShown` (C40).
- `onViewportChanged`'s documented property (C37).
- Export's Current view (C38).
- KNOWN-LIMITATIONS item 39's exception (C54): the plan is not a report, so `lastQueriedRef` stays null after the open, and a change of size still asks for nothing until the next pan or zoom.
- The first look's query, its limit (C32, C35) and the moment it is issued (C25).
- Every ceiling (C28 to C31).
- The baseline arm.

### 2.2 Placement P-A: report the tile arm's fit

**Where.** `WorkingCanvas.tsx` C41 calls `fitToExtent(…, true)`. `App.tsx`'s handler (C26) then drives the session.

**Trade-offs.**
- Alone it plans nothing: the report reaches `onCameraChange` before the frame exists and meets `no-frame` (C34, C16). It also needs the session to stash the frameless box and plan it at the terminal, which is P-B's terminal request with more moving parts.
- It breaks stated properties:
  - C37's sentence that the auto-fit never fires `onViewportChanged`;
  - `lastQueriedRef`'s null-after-fit, which Export's Current view rests on (C38, C40);
  - KNOWN-LIMITATIONS item 39's exception (C54), the human's wording, which would become false;
  - `App.tsx`'s view box, which the refusal recovery reads (C26).
- It edits `App.tsx` and `WorkingCanvas.tsx`, both PR B's files.
- Not recommended.

### 2.3 Placement P-C: App forwards the shown box to the session

**Where.** `App.tsx`'s `onViewShown` handler passes the box to a new session method that stashes it, and the terminal plans the stash.

**Trade-offs.**
- `WorkingCanvas.tsx` is untouched.
- The stash is stale after a pan during the first look, unless `handleViewportChange`'s `no-frame` return also stashes. That makes two sources of the box, where P-B reads the one camera record (C39) at the moment of use.
- It edits `App.tsx` (wiring) and adds a session method whose only caller is App.
- Same properties kept as P-B. Not recommended.

### 2.4 Under ADR-010, clause by clause (P-B)

- **Rule 1 (C61).** The box leaves the canvas only as an authoritative-CRS box. It is computed from `cameraRef`, which holds the local target with the origin it was written against (C39, C40, C43). No local value leaves. deck's `info.coordinate` is unread.
- **Rule 2.** No cursor unprojection.
- **Rule 3 (C62).** Unchanged: `computeAuthoritativeViewportBbox` adds the origin in f64 (C44). No layer offset changes.
- **Rule 4.** Not engaged.
- **Rule 5 (C63).** The defect is a silent window. After an open, the view showed partial geometry with no signal. Read as nearest to rule 5's staleness clause and docs/01 principle 8. P-B ends that window at the fill's settle: the existing status sentences speak (§2.5). During the fill the status stays silent by the existing design (C9, C10; walkthrough L5). That is unchanged and not claimed here.
- **Rule 6 (C64).** No new ceiling. The plan at open is bounded by the same in-flight, queue and covering ceilings (C29 to C31).
- **Rule 7 (C65).** The fill's streams report progress through the existing liveness. A covering failure feeds the existing accounting, and Cancel reaches them through `relinquishFill` (C21), so docs/01 principle 7 holds as it does for any pan.
- **docs/01 principle 8 (C66).** The plan is logged (§2.1).

**§21a's fourth category (C60): yes.**
- The session's documented property, that tile planning waits for the first genuine `onViewportChanged` (C7), is reversed for the end of the first look.
- What every e2e suite sees after an open changes (§5).
- KNOWN-LIMITATIONS item 7's sentence (C52) is re-read at the records commit (§10).

**`engine/`, `kernel/`, `protocol/`: not touched** by any placement. The wire is unchanged: the tiles are asked for with the existing `viewport_query`.

### 2.5 The status line: existing strings suffice

- Once `handleViewportChange` has planned, `hasPlanned` is true (C18). When no change is pending, no tile is tracked and the untiled stream has ended, `settledState` (C22) settles. `emitResidencyStatus` (C10) then sends one of the existing statuses, and the slot shows it (C27).
- The sentences are C23's: complete in view, the over-budget sentence with its suffixes, and the settled-partial sentences (within budget, failure). No new string, so no P6 placeholder.
- The first look's limit mark (C16) is protected and kept out of the in-view partiality, as now. This is unchanged.
- A finding outside this node: the complete sentence's count is every resident feature, the first look's rows outside the view included (C10). It is recorded, not changed here.

### 2.6 Boundaries

**May edit:** the files of §7.

**Not edited:**
- `residencyStatus.ts` and any string the app shows;
- `App.tsx`;
- `tileViewportStreamManager.ts` and `tileGridConstants.ts`;
- `viewportBbox.ts`;
- `engine/`, `kernel/`, `protocol/`, `renderer/`, `src-tauri`;
- `package-lock.json` and any dependency (a red line);
- `pan-anchor.mjs`;
- `residency-harness.mjs`.

**No callback, option or code path without a product caller.** The one new handle member's caller is the session.

### 2.7 Portability

Page code only. E-FL runs on Windows/WebView2. Nothing is claimed for macOS or Linux.

## §3 What may and may not be claimed

**May be claimed, on the head's measure build, on `polygons-100k.parquet` at the shipped default arm and level:**
- With no input after the open, the map asks for the tiles of the view the fit shows.
- That view fills.
- The status shows the complete-in-view sentence at the settle (E-FL).

**May not be claimed:**
- Any docs/08 figure (§6).
- macOS or Linux.
- That every file's fit view fills completely. Over the budget, or when the covering set is truncated, the existing partial sentences speak instead, by C23.
- Anything after a failed first look (no plan, as today) or after a Cancel during it (no plan until the next camera change, as today).
- Anything after an Apply or a Clear beyond what OPEN-2 settles.
- That the status speaks during the fill.

## §4 Tests (outcomes declared in §5 before any run)

| ID | Kind and file | Asserts | Mutation and expected failure |
|---|---|---|---|
| U-FL1 | vitest, `frontends/shell/src/residency/candidateArmSession.test.ts` (OPEN-5) | `fakeCanvas` (C45) with `shownViewportBbox` returning a box inside the frame. The first look is driven by its sink (C46) to a `Completed` terminal with no `onViewportChanged` call. After 120 ms of fake time, exactly one plan runs: the manager issues covering-tile `viewport_query` calls for that box. | M-U1: delete the terminal's request. U-FL1 fails: no tile query. |
| U-FL2 | the same file, table-driven | No plan at the terminal when: (a) `relinquishFill()` ran during the first look; (b) `stop()` ran first; (c) the terminal is not `Completed`; (d) it is an orphan after `reissueUnrestricted`; (e) the box is null. (f) With a change pending at the terminal, exactly one plan runs in total, of the pending box. | M-U2: drop condition (v). U-FL2 (a) fails: a plan runs after Cancel. |
| U-FL3 | the same file | After U-FL1's plan, when every covering stream completes with its tile complete in the candidate set, the session's status callback receives the settled complete status, rendered by `residencyStatusText` as the complete-in-view sentence (C23). | M-U3: make the terminal call `manager.onCameraChange` directly instead of the accept function. U-FL3 fails: `hasPlanned` stays false, so no settled status. |
| U-FL4 | vitest, the real `WorkingCanvas` mounted (OPEN-5: `WorkingCanvas.wiring.test.tsx`, or a new `WorkingCanvas.shownView.test.tsx`) | `shownViewportBbox()` is null before any camera write. After the one-shot fit (a pushed tile batch with an extent), it equals `computeAuthoritativeViewportBbox` of the fit's camera at the client size, which is the box `onViewShown` received. After an interactive view-state tick, it equals the box `onViewportChanged` received on that tick. | M-U4: drop the origin from the computation. U-FL4 fails at the fit: the fit's origin is non-zero (C40's `forceRecenter`). |
| E-FL | new `frontends/shell/e2e/open-fills-fit-view.mjs`, npm script `e2e:open-fills-fit-view`; the measure build; `polygons-100k.parquet` | See below. | M-E-FL: the fix reverted, observed by E-FL's run on the base build (§7 step S4), whose product tree is the base by construction. That record is a run at the base. Expected: (a), (c) and (d) fail. |

**E-FL.**
- **Launch and inputs.** Launched through `attachOrLaunchExe` (C48). The shipped default arm and level: no DEV hook that acts, no arm or level call. After the open, the suite sends no input at all.
- **Precondition** (else exit 2, VOID, not PASS):
  - the open's first `stream-issued` line arrives, and its `batch` lines reach a cumulative 10,000 rows (C32);
  - the fit's `view-state` line arrives (C40);
  - a `describe.extent` line arrives (C47).
- **(a)** After that stream's last batch, at least one further `stream-issued` line arrives, with no input sent.
- **(b)** Settle: no `viewport_query`, `stream-issued` or `batch` line (C51's three classes) for 3 s, within a 180 s timeout.
- **(c)** `.residency-status` text, read after the settle, is the complete-in-view sentence. It is matched by the sentence's prefix and suffix as `residencyStatus.ts` builds it, carried in code with a comment naming C23.
- **(d)** A CDP `Page.captureScreenshot` clipped to the canvas, divided into an 8×8 grid. A cell qualifies when its world rectangle lies wholly inside the `describe.extent` box. The rectangle is computed from the fit's `view-state` line: W = target + origin, CSS px per unit = 2^zoom, at the canvas's CSS size. Every qualifying cell holds at least one pixel with non-zero alpha. PNGs are decoded with `node:zlib` (no dependency).
- **(e)** At least one qualifying cell lies outside the first look's rows. It is checked at the base run, where (d) must find it blank. Otherwise the result is VOID: the fixture would not exercise the defect.
- **Exit codes.** 0 if (a) to (d) pass, 1 on any failure.

**Observing mutations.**
- Each mutation is applied by hand, the named test run, its failure recorded by name with the commit it was observed at, then reverted.
- A `verify-mutation` run, if one is made, is a check of the mutation's text and never its observation (round 25, item 2 (c)).
- A test-text span on the branch is named in words with its commit id and never pinned by hash at a branch commit (round 25, item 2 (d)).

**The seam.**
- U-FL1 to U-FL3's fake is typed against the real `WorkingCanvasHandle` (C45), the member added to the handle's own type. No `as any` and no cast.
- E-FL is the one end-to-end test from the real shape: the shipped session against the shipped canvas.

## §5 Predictions, declared unchanged, invalidators, falsification

**Predictions.**
- P-U-base: at the base, with the tests added (§7 step S3), U-FL1 and U-FL3 fail as their mutations do, and U-FL4 fails (the member is absent). U-FL2 passes at the base (no plan exists to suppress). This is recorded, and it is why U-FL2 is proven by M-U2 at the head, not by the base.
- P-E-base: the precondition is met. (a) fails (no tile stream without input), (c) fails (the status is empty), (d) fails, and (e) holds (the cells above the strip are blank, the consult's §1).
- P-head: U-FL1 to U-FL4 and E-FL pass. On this fixture's fit view at `medium` (C28), the fill is within the budget and not truncated, so (c) shows the complete sentence. My derivation from the consult's §1 and the Part L note (C57); recorded, not asserted beyond E-FL.

**What each suite sees after an open: now, after, and what changes.** By reading; the reviewer runs each (§9).

| Suite | Now | After | Frozen tolerance, ruled check or operator row changed? |
|---|---|---|---|
| `layout.mjs` FILL (C50) | after one wheel notch, the Inspector's close asks for the cells no reported view covered | the open's plan has already loaded the fit view's covering tiles, so the newly exposed cells may be resident, and FILL's expected streams may not come | **yes, a ruled check: OPEN-6** |
| `layout.mjs` RESIZEQ | a resize after a reported view | unchanged; item 39's exception holds (§2.1) | no |
| `recentre-crossing.mjs` (#311) | start image after the first look | start image after the fit view's fill; case 1 (c) compares start and end, both filled; case 2 unchanged; its rule (d) edges stay inner by reading | G2's comment words (§10.4); no tolerance |
| `residency-harness.mjs` | `open-drain` drains the first look; the identity step's open has no tile traffic | `open-drain` drains the first look and the fit view's fill; `identity-open` carries tile streams in both its ON and OFF runs | measurement conditions change (§6); the identity guard compares ON with OFF in one arm (C51), so it is predicted to hold. Three concurrent streams could reorder batch lines: invalidator I5 |
| `regression.mjs` (A4', A7', A9') | non-blank after settle; Zoom to layer's anchor is the first look's union | more filled; the anchor grows with the fit view's tiles (C55) | no; only non-blank pixels are asserted, by README |
| `filter.mjs`, `filter-panel.mjs` | pixel fractions after an Apply | unchanged under OPEN-2 (i); under (ii), the Apply's fit view fills | re-read at S2 |
| `export-view.mjs` (E-CV) | the Current view after an unreported fit | unchanged: `onViewShown` and `lastQueriedRef` are untouched | no |
| `source-changed.mjs` S2/S4, `source-watch-idle.mjs` W2/F0 | idle after the first look | idle after the fill; later | no, unless a step counts streams from the open; re-read at S2 |
| `selection.mjs`, `attributes.mjs`, `table.mjs` | scenes on the first look's rows | more features resident in the fit view | any count of resident features after an open changes; re-read at S2 |
| `style.mjs`, `publish.mjs`, `console.mjs`, `command-bar.mjs`, `project.mjs`, `recording.mjs`, `debug-session.mjs`, `admission-remediation.mjs`, `refusal-contract-baseline.mjs` | as now | the open settles later | no, by reading |
| `pan-anchor.mjs` | run only | more trace lines before its first gesture; it waits on its own lines | no; its file is not edited |

- Step S2 (§7) is a pre-code inventory. The worker lists every assertion in these suites that reads the canvas, the status, the stream lines or a resident count after an open. A predicted change not in this table stops the piece. It returns as an amendment before code, and a tolerance, ruled-check or operator-row change is an OPEN item there.
- Every timeout in these suites after an open is predicted to hold. On this fixture the fit view's fill is predicted to end well inside `waitForSettle`'s 45 s default (C49). That is unmeasured. A timeout seen is I4 or I6.

**Declared unchanged:**
- every existing vitest test. The fake (C45) lacks the optional member, so no existing test plans at the terminal;
- the wire;
- every string;
- item 39 and item 61's truth (§10);
- the baseline arm.

**Invalidators.** Each stops the piece and returns it to the architect by amendment; nothing is adjusted.
- I0: a §0.4 cite whose content, not only its line, has changed at the base (§8).
- I1: U-FL1 or U-FL3 passes at the base.
- I2: E-FL's precondition is unmet, or (e) fails at the base: VOID.
- I3: E-FL (a), (c) or (d) passes at the base.
- I4: a failure seen in a shared run that depends on timing is recorded as such, run again in a later hold, and not counted.
- I5: `residency-harness.mjs`'s identity guard fails at the head.
- I6: any suite's settle times out after an open at the head, outside I4.

**Falsification.** A failure of U-FL1 to U-FL4 or E-FL at the head is the change failing. It is recorded as seen.

## §6 Instruments and measurements

**Assertions:**
- the plan count, the tile `viewport_query` calls and the status (U-FL1 to U-FL3);
- the box (U-FL4);
- the stream lines, the status text and the cell coverage (E-FL).

**The docs/08 budgets.**
- First pixels under 100 ms (C67). It applies to the first look's query, which this node does not move (C25). Not re-measured and not claimed. Moving the first look's issue is block-on-sight 3.
- docs/08 measures time to stable view (C68), with no budget figure. This node lengthens the open's time to stable view by the fit view's fill. That is declared, not measured (OPEN-7).
- Cold open of 5 GB under 5 s is admission's (05) and is not engaged. The 5 GB fixture is not used, so there is no drive confound.

No performance claim is made.

## §7 Steps, files, ceilings, budget

**Steps.** S0 is the custodian's; S1 to S9 are the worker's.
- S0: this form is committed on main. Dispatch is after PR B and #311 have merged (§8).
- S1: the branch from main at dispatch (the base, named in the report). Every §0.4 cite is re-derived at the base. The table records, per cite, which is authoritative: the pin, or the tree with its new line and hash at the base. A changed line is a class-3 row; changed content is I0.
- S2: the §5 inventory, recorded.
- S3: commit U-FL1 to U-FL4 and run vitest. Record P-U-base with the commit id.
- S4: commit E-FL and its npm script. Build the measure exe at that commit (its product tree is the base), run E-FL, and record P-E-base.
- S5: the change commit (§2.1, with the §10.3 comment words).
- S6: vitest at the head. Observe M-U1 to M-U4.
- S7: build the measure exe at the head, run E-FL, and record P-head.
- S8: the e2e changes OPEN-6 settles, G2's words (§10.4), the README entry for E-FL, the walkthrough rows (§10.2) and the KNOWN-LIMITATIONS withdrawal (§10.1, on the human's words only).
- S9: the report, then both gates.
- Nothing after S5 is committed before S3's and S4's records exist.

**Files and ceilings.** Insertions plus deletions, comments counted, by `git diff --numstat <base>...HEAD -- frontends/shell KNOWN-LIMITATIONS.md`:

| Group | File | Ceiling |
|---|---|---|
| product | `frontends/shell/src/residency/candidateArmSession.ts` | 70 |
| product | `frontends/shell/src/canvas/WorkingCanvas.tsx` | 30 |
| unit | `frontends/shell/src/residency/candidateArmSession.test.ts` (OPEN-5) | 280 |
| unit | `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` or a new `WorkingCanvas.shownView.test.tsx` (OPEN-5) | 110 |
| e2e | `frontends/shell/e2e/open-fills-fit-view.mjs` (new) | 420 |
| e2e | `frontends/shell/package.json` (one script line) | 2 |
| e2e | `frontends/shell/e2e/layout.mjs` (FILL, OPEN-6) | 30 |
| e2e | `frontends/shell/e2e/recentre-crossing.mjs` (G2's comment, §10.4) | 8 |
| docs | `frontends/shell/e2e/README.md` (E-FL's entry; FILL's and recentre-crossing's entries re-read) | 60 |
| docs | `frontends/shell/MANUAL-WALKTHROUGH.md` (§10.2) | 30 |
| docs | `KNOWN-LIMITATIONS.md` (§10.1) | 8 |

- An overrun is class 8, with its first line `budget overrun, §7 not edited`, and §7 is not edited to match.
- A file outside this table is class 9, declared by amendment before any of its code.

**Budget:** 410 minutes of work, my estimate and not a measurement:

| Work | Minutes |
|---|---|
| S1 and S2 | 60 |
| U-FL1 to U-FL3 | 90 |
| U-FL4 | 40 |
| E-FL | 120 |
| the change | 30 |
| docs and records | 20 |
| runs and mutations | 20 |
| report | 30 |

- The wall time of the two measure builds and of the waits for a hold is stamped and reported separately.
- PLAN's `budget_minutes` (C1, now 0) is the custodian's to set.

## §8 Order, overlap and re-reads

- **The order (C2, C3).** The code starts after PR B merges, in the next free slot ahead of anything not yet started. #311 merges before it (C3). The custodian records the dependency by setting `depends_on` to include `recentre-crossing-view-displaced-fix` beside `b1-shell-half` (C1). That is applying the ruling, not a new placement.
- **Rule (00) at dispatch.** For every file in §7, `git diff --name-only origin/main...<branch>` is run over each piece in progress and each PR awaiting merge, including the publish-approval piece and the second-open node. Under rule (00a), KNOWN-LIMITATIONS items, walkthrough Parts and e2e README entries count separately. An overlap holds the dispatch.
- **If PR B or #311 changes the code this form cites (§0.4)** before dispatch, as both will for `WorkingCanvas.tsx` and PR B will for `App.tsx`:
  - S1 re-derives each cite. A pin is a historical record, and the base's tree is authoritative for the code.
  - A moved line is a class-3 row in §11.
  - Changed content that this form's §2 or §5 rests on is I0: the piece stops. The architect re-reads the changed code and §2 and §5 are re-declared by an amendment written before any code.
  - What the changed code may move: the terminal's order (C12), the accept path (C19), `cameraRef`'s writers (C39, C40, C43), the handle's type, and the status slot (C27).
- **The KNOWN-LIMITATIONS item of item 3 (b)** must be on main before S8 withdraws it (PLAN `known-limitations-first-look-partial-view`). If it is not, S8 records that and edits nothing there.

## §9 Gates

**Architect and reviewer from dispatch** (C60). Verdicts follow §22. A Documentation finding is must-fix before the merge.

**The architect:**
- ADR-010 rules 1, 3, 5, 6 and 7 (§2.4), and docs/01 principles 7 and 8;
- §2.6's boundaries;
- §10's words, clause by clause against the built code;
- block-on-sight one by one.

**The reviewer, at the final head:**
- Recomputes §7's counts.
- Runs the shell's fresh-worktree setup, including `npm ci` in `renderer/bundle-viewer`.
- Runs `npm run verify` in `frontends/shell`, the repository's CI `node --test` scripts suite, and the cite, quote and plan checks.
- Runs every e2e suite in `frontends/shell/package.json`, plus `e2e/pan-anchor.mjs`, on the dev build, on the port the machine rule names at the run (5400 until the human frees 5180).
- Runs E-FL on the head measure build and recomputes its verdicts from its records.
- Runs each heavy command inside a shared hold. The machine paragraph goes into the worker's and the reviewer's briefs as written.
- Records a timing failure in a shared run as such, not as a failure (§5 I4).

**The operator:** the rows of §10.2, committed with blank result logs and queued for the next sitting.

## §10 Records

**10.1 KNOWN-LIMITATIONS.**
- **The item of item 3 (b) (C3a) is withdrawn by this node's records commit.** It takes item 18's retirement form (C53): the number is kept, the text replaced, with a source comment. The words are the human's (OPEN-8, a red line).
  - My draft for their sight, not their wording: *Retired by open-first-look-fills-fit-view. When the first data load of an open ends, the map asks for the tiles of the view it then shows, with no pan or zoom, and that view fills as far as the render budget allows; when the filling settles, the status line says whether everything in view is shown. The number is kept so that references to it still resolve.*
  - Clause check against the code:
    - when the first data load ends: the request is in the first look's `Completed` terminal (§2.1 (iii));
    - the view it then shows: `shownViewportBbox` reads the camera last written (C39);
    - with no pan or zoom: no input is needed (E-FL (a));
    - as far as the budget allows: the plan's ceilings and its over-budget path (C29 to C31, C23);
    - the status line says: `settledState` and C23's sentences (§2.5).
  - Cases ordinary use can reach, named for the source comment:
    - a Cancel during the first data load (no plan until the next pan or zoom; the Cancel's status speaks, C21);
    - an Apply or Clear, unless OPEN-2 (ii) is ruled.
  - Not ordinary use, also named: a failed first data load (no plan, as before).
- **Item 7 (C52; G1, C5): no change, by reading.** Its sentences hold once the open's fill settles. The window in which the consult found them untrue, before the first plan, now ends at the first look's terminal. What remains is the fill itself, during which the status is silent by the existing design (L5). The gate re-reads item 7 at the records commit. Any word change is the human's.
- **Item 39 (C54): no change.** The plan is not a report (§2.1).
- **Item 61 (C55): no change.** Its sentences stay true: the fit is the same, and Zoom to layer frames what the map has held, which now includes the fit view's tiles. An optional sentence for the human's sight, not proposed for adoption by me: *After an open, what the map has held includes the tiles of the view the fit first showed.*

**10.2 The walkthrough** (operator documentation, not the human's wording; OPEN-9):
- C57, the strip note. Draft: *…the candidate arm's 10,000-row first look is a bottom STRIP of the layer; the map fits that strip once and, when the first look ends, asks for the tiles of that view, so it fills without a pan. "Zoom to layer" fits the union of what has rendered, which after the open is the strip and the tiles around it, not the dataset. Every "at fit" expectation below means that view.*
- C58, L1. The open itself now runs a fill before the click. Draft the step's opening as: *…open `polygons-100k.parquet` and let the open's own fill settle (no status during it; at its settle the sentence for the view), then click **Zoom to layer** and let that fill run to quiescence WITHOUT touching Cancel.* The trace figures in its expected column are marked as the 2026-09-06 sitting's.
- C59, L5. *reopen (the open's own fill now runs first), then Zoom to layer.*
- C56, A7. Its clause that the fit is the same one A4 produced, whatever is loaded, no longer holds on the candidate arm. Draft: *The camera jumps back to fit the layer's known extent: the union of everything the map has held since the open (KNOWN-LIMITATIONS item 61), which includes the view the open filled, so it can frame more than A4's fit.*

**10.3 Code comments** (worker's words, clause-checked at the gate):
- C7: replace the paragraph's account. Draft: *Tile-keyed planning begins at the first of: a genuine `onViewportChanged` event once the frame exists, or the first look's own `Completed` terminal, which plans the box the canvas then shows (`shownViewportBbox`) through the same accept function, unless a Cancel, a stop, a pending change or an earlier plan of this generation already decides the next plan.*
  - Clause check: §2.1 (i) to (viii) and the one accept function.
- The new member's doc names its only product caller and the precedent (C36).

**10.4 G2's words** (C6) land in `frontends/shell/e2e/recentre-crossing.mjs`'s start-capture comment: line 235 of that file at b7ba9f77 on #311's branch, re-pinned on main at S1 after #311 merges. They are the architect's draft of the consult, not the human's wording, and they are false after this node. Replacement draft: *Wait until no render-trace line arrives for 3 s (the reproducer's settle). At the start that is after the open's own fill: the first look's batches, then the tiles of the view the fit shows, which the open asks for when the first look ends; so the start image holds what was loaded for that view.*
- Clause check against the built code at the gate:
  - the 3 s settle is the `waitForSettle` call's `quietMs` on the line below;
  - the tiles are asked for at the first look's terminal (§2.1);
  - the start image holds what was loaded: E-FL (d).

**10.5 v0.2.** The node is already in `release-v0-2-0`'s `depends_on`. The tag and its release notes are the human's (a red line). Nothing is drafted here.

## §11 Block on sight

1. A new string the app shows, or a changed one.
2. Any edit to `App.tsx`, `residencyStatus.ts`, the manager, the constants, `viewportBbox.ts`, or anything under `engine/`, `kernel/`, `protocol/`, `renderer/` or `src-tauri`.
3. The first look's query, limit or issue moment changed.
4. A second planning path: a terminal call to `manager.onCameraChange` other than through the accept function.
5. The tile arm's fit made to report, or `lastQueriedRef` or `onViewShown` changed.
6. A plan at a self-cancelled, orphaned, non-`Completed` or post-stop terminal, or while a relinquish stands.
7. A new member, option or path with no product caller.
8. A test double not typed against the real `WorkingCanvasHandle`, or a cast around it.
9. E-FL calling a DEV hook that acts, or run on a dev build.
10. A tolerance or prediction changed after a run has been seen.
11. A dependency or lockfile change (red line).
12. A record that calls a `verify-mutation` run an observation, or a branch span pinned by hash at a branch commit or named without its commit id.
13. The change commit before S3's and S4's records.
14. Any code before PR B and #311 have merged.
15. A KNOWN-LIMITATIONS, release-note or walkthrough wording landed without the sight §10 names.

## §12 Open items

| OPEN | Subject | Red line | Recommendation |
|---|---|---|---|
| 1 | the placement within (B) | no | P-B |
| 2 | Apply and Clear | yes (scope of a ruled item) | (ii) |
| 3 | the box at a pan during the first look | no (a reading) | (A) |
| 4 | the member optional in type | no | (A) |
| 5 | where U-FL1 to U-FL4 live | no | (A) |
| 6 | FILL's predicate | no (a reading, C3b) | (A) |
| 7 | a time-to-stable-view figure | no | (B) |
| 8 | the KNOWN-LIMITATIONS withdrawal words | yes | the human's words |
| 9 | the walkthrough rows | no | (A) |

The options and reasons are in the architect's draft report (`state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`). The custodian records each settlement here by amendment.

## §13 Amendments (opens empty; append-only)
````

**OPEN items**

- **OPEN-1, not a red line: where within (B) the plan is asked for.**
  - (P-A) Report the tile arm's fit.
  - (P-B) Plan at the first look's terminal, with the box from a read-only canvas member.
  - (P-C) App forwards `onViewShown` to the session.
  - Recommendation: P-B. P-A plans nothing on its own (`no-frame`), breaks C37, item 39 (the human's words) and Export's Current view, and edits PR B's files. P-C has two sources for the box and edits App. P-B is two product files and leaves every stated property but C7 as it is (§2.1–§2.3).
- **OPEN-2, red line (a scope change to a ruled item): Apply and Clear.** The ruling names the open. The same defect follows an Apply or a Clear (§1).
  - (i) The open only. This needs one more guard, so that a reissue's terminal does not plan, and it leaves Apply/Clear partial and silent: a new KNOWN-LIMITATIONS item would be the human's to word.
  - (ii) Every first look, the open's and a reissue's. This is P-B with no extra guard.
  - Recommendation: (ii). It is less code, and it closes the same silence. It is the human's.
- **OPEN-3, not a red line (a reading of the ruling's "the view the fit shows"): a pan made during the first look.**
  - (A) Plan the view shown at the terminal. With no input it is the fit's view; after a pan it is the panned view, which a pan today fails to plan.
  - (B) Plan the fit's own box.
  - Recommendation: (A). (B) would fetch a view the user has left.
- **OPEN-4, not a red line: the handle member.**
  - (A) Optional in the type only, as `currentView?` (C36). Existing fakes stay valid, and no existing test changes.
  - (B) Required. Every stand-in handle in the tests changes.
  - Recommendation: (A).
- **OPEN-5, not a red line: where U-FL1 to U-FL4 live.**
  - (A) In `candidateArmSession.test.ts` and `WorkingCanvas.wiring.test.tsx`, if rule (00) shows neither held at dispatch. Otherwise new files: `candidateArmSession.firstLookPlan.test.ts` and `WorkingCanvas.shownView.test.tsx`.
  - (B) New files always.
  - Recommendation: (A). §7's ceilings are unchanged by the choice.
- **OPEN-6, not a red line under item 2 of 2026-11-12 (a reading of a typed check; it never changes what the check is for): FILL.**
  - (A) FILL's covered set also counts the open's planned box, read from the tile `viewport_query` lines before the mark. The check still proves that a growth asks for what no earlier ask covered.
  - (B) FILL's set-up pans off the fit view before the mark, leaving its predicate as typed.
  - (C) No change; record a predicted failure.
  - Recommendation: (A), dated at the form's commit. If FILL is not the human's typed check, the same recommendation stands as an ordinary non-red-line item.
- **OPEN-7, not a red line: a figure for the open's time to stable view.**
  - (A) `residency-harness.mjs`'s `open-drain` row at the base and the head, on `polygons-100k`, candidate arm at `medium`, at the harness's own trial count, with p50/p95 reported and no budget claimed. A shared machine confounds it, so it needs an exclusive hold, which only the custodian takes.
  - (B) No measurement and no claim. The change is declared in §6.
  - Recommendation: (B). The node claims no performance figure.
- **OPEN-8, red line (KNOWN-LIMITATIONS wording): the withdrawal of item 3 (b)'s item.** Its form and my clause-checked draft are in §10.1. Recommendation: the item-18 retirement form, with words of the human's choosing.
- **OPEN-9, not a red line: the walkthrough rows** (C56–C59).
  - (A) The §10.2 drafts, applied at S8, operator rows queued blank.
  - (B) Leave them and record them as stale.
  - Recommendation: (A).

Under the human's ruling held to 2026-11-16, OPEN-1, 3, 4, 5, 6, 7 and 9 take these recommendations, recorded with their date at the form's commit. OPEN-2 and OPEN-8 wait for the human.

**Gate findings I see (not ruled)**

- F1 (Documentation, on main, outside this node): the complete-in-view sentence's count includes resident features outside the view, such as the first look's rows beyond the fit (C10, C23). It is honest as a lower bound on what is shown, but the number is not "in view". It is recorded here, and the wording is P6.
- F2 (Correctness class, reachable only after a producer failure): after a failed first look (non-`Completed`), no plan runs and the settled status cannot speak until a pan or zoom. That holds today and after this node. Whether a failure banner covers it was not read. Named for §10.1's source comment.
- F3 (Documentation): the template has no class for an amendment written before any code that re-declares §2 or §5 after a base change (§8's I0 path). Class 3 covers pointers only. I route it as a finding. The record cap allows a weekly proposal, not a new clause from me.
- F4 (Documentation): C7's last sentence says the `open-drain` step is not expected to show more than one tile stream. That becomes false at this node, and §10.3 replaces it. Any harness report or README line that states the same expectation is stale from the merge. Re-read at S2.

**What I read, by path** (all on main at 6e041829 unless noted):
- the brief (scratchpad `brief-fl-form.md`);
- `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md`;
- `state/consults/2026-11-12-recentre-crossing-start-partial-draw-open-c-architect-consult.md`;
- `governance/PLAN.yaml` (the five nodes);
- `frontends/shell/src/canvas/WorkingCanvas.tsx`;
- `frontends/shell/src/residency/candidateArmSession.ts`;
- `frontends/shell/src/residency/candidateArmSession.test.ts` (its fake and sink helpers);
- `frontends/shell/src/residency/residencyStatus.ts`;
- `frontends/shell/src/App.tsx` (the session, the first look, the canvas props, the status slot);
- `frontends/shell/src/canvas/tileGridConstants.ts`;
- `frontends/shell/src/canvas/viewportBbox.ts` (by grep);
- `frontends/shell/src/streaming/tileViewportStreamManager.ts`;
- `frontends/shell/src/streaming/viewportStreamManager.ts` (the constant);
- `frontends/shell/src/diagnostics/renderTrace.ts`;
- `engine/src/stream.rs` (the `LIMIT` sites);
- `frontends/shell/e2e/README.md`;
- `frontends/shell/e2e/lib.mjs` (its exports);
- `frontends/shell/e2e/layout.mjs` (FILL);
- `frontends/shell/e2e/residency-harness.mjs` (its header, the identity guard, `FIELD_SEQUENCE_EVENTS`);
- `frontends/shell/e2e/recentre-crossing.mjs` at b7ba9f77 (`C:/dev/wt/rcf`);
- `KNOWN-LIMITATIONS.md` (items 7, 18, 39, 61 and the item list);
- `frontends/shell/MANUAL-WALKTHROUGH.md` (A4, A7, Part L);
- `docs/01_Principles.md` (principles 7 and 8);
- `docs/adr/ADR-010-render-frames-origins-boundaries.md`;
- `docs/08_Testing.md`;
- `docs/PREREGISTRATION-TEMPLATE.md`;
- `governance/AUTONOMY.md` §21a to §21c;
- `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md` (to its Amendment 1).

Not read: `EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md` (its property is cited through C38 and C40 only), `residencyStatus.test.ts`, and each e2e suite's body other than FILL and the harness. §7's S2 inventory covers the suites.

**Packet gaps**

- Which files PR B's 16 change, besides `App.tsx` and `WorkingCanvas.tsx`. I needed to know whether it holds `candidateArmSession.ts` or either test file (OPEN-5, §8).
- Whether FILL is a check the human typed (OPEN-6's red-line status).
- Which build the brief's "release build" means. I took the measure build that #311's E1 runs on.
- The brief names `docs/08`, and the file is `docs/08_Testing.md`. It has no time-to-stable-view budget figure.
- Whether a failure banner shows after a failed first look (F2).
- Whether the item of item 3 (b) will be on main, and at which number, before this node's records commit (§8).

**Model:** claude-opus-5-5 (Opus 5.5), as the harness reports it.
