Reviewed: PR #295 at 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a (base 1bc349ae), gate 1, reviewer
Branch: cut/shell-comments-drift-sweep-area-a @ 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a

Verdict: PASS WITH NOTES

The brief's sha256 (a0c97666…716ed, 9291 bytes) and the packet's sha256 (2d8965eb…929f61, 9918 bytes) both matched. Before reading the packet I read the rulings directive, Part 1, items 1 to 9. I also read the form at main (sha256 cef8c66d…299e, which matches the packet), its settlement, both worker reports and the full three-dot diff (21649 bytes, the same size the packet gives).

# Findings by class

**Correctness: none blocking.** Every changed comment clause holds at 5a45e113 (clause table below). The two token methods agree that all nine files are equal. The DEV-ONLY lines and the header are byte-identical. No path is outside the nine.

**Evidence: none blocking.** I re-ran the suite, the records checks and the token comparison myself. CI is green, and every run is at 5a45e113.

**Documentation: none that must be fixed before the merge.** Notes N1 and N2 below are preferences under item 6. They are not acceptance conditions. Optional words are given so the worker can apply them cheaply.

- **N1 (note, optional words).** `frontends/shell/src/e2e-test-surface.ts:326-327 @ 5a45e113 sha256:a7a1fb8d345312531699665b7961e3b8c96e26d5d6ee3c8717d35770128973c5` reads "`"candidate"` (`DEFAULT_RESIDENCY_ARM`) unless a prior `setResidencyArm("baseline")` call on this same session succeeded".
  - The arm is module state, and the last successful set wins (`residencyArm.ts:96-106`). The sentence is literally false only for the sequence set "baseline", then set "candidate".
  - That sequence needs the dev-only hook, so under §31 it does not block. It is the same shape as `residencyArm.ts:65-66`.
  - Optional words: "Reads the current arm back -- the arm the last successful `setResidencyArm` call set, else `"candidate"` (`DEFAULT_RESIDENCY_ARM`)."
  - Clause check: `getResidencyArm` returns `currentArm` (`residencyArm.ts:68-70`). `currentArm` is initialised to `DEFAULT_RESIDENCY_ARM` (`:58`) and written only by a successful `setResidencyArm` (`:104`) or the test reset (`:124`). Holds.
- **N2 (note, optional words).** `frontends/shell/src/residency/residencyTileSizeLevel.ts:15-20 @ 5a45e113 sha256:9546da261f8fcd4e64d2e2c4a66e554813140457d753abf31276897860b9d3b2`. Read alone, the bold heading "**Gated by its callers, …**" over-states: the getter is called ungated at `App.tsx:1624`. The body sentence then says so. Optional heading: "**Gated, where it is gated, by its callers, not by a check inside this module itself**".
  - Clause check: gated callers are `App.tsx:1334-1335` (inside `:1246`'s gate) and `:1555`, `:1713`, `:1907`. The ungated caller is `:1624`. No export reads a build flag (the grep for `import.meta` or `isInstrumentedBuild` in this module finds only comment lines 16 and 21). Holds.
- **N3 (nit).** Some reflowed comment lines are ragged.
  - `tileGrid.ts`, the added `each carry their own parseTileKey …` line, is 111 columns.
  - Ten other added lines are 101 to 103 columns.
  - Two short orphan lines: `pick.ts` (`` * `null` means …``) and `tileGrid.ts` (`* same policy, moved in front of the`).
  - Comment layout only; the token streams are equal.

**For the custodian, outside Scope (not this PR's to fix):**
- **O1.** `frontends/shell/src/App.tsx:1277-1278 @ 5a45e113 sha256:117228351b4672783ef31a19b082166a12cc71cd47dcfac98638f941798f193f` still says "Its only caller, and why the property must be proven about the running app, are stated at its own declaration in `e2e-test-surface.ts`". Once this PR merges, that declaration names three callers.
  - App.tsx is a PR B file, so section 6 keeps it out of this piece.
  - Closure: a one-clause fix inside b1-shell-half PR B's Scope ("Its callers, and …"), or a note on that node.

**For the human (the round 5, item 4 rule; no replacement words, the rule is the human's):**
- **H1, A5.** I read the instrument-accessor rule at `governance/AI_DEVELOPMENT.md:279 @ 5a45e113 sha256:e6eaa77e3289d3acf25f78010288d9ad28a83723abf62bd61df7ee921534cc55`; main a696dce1 has the same hash. The rule's elements are:
  1. read-only over shipped state;
  2. the only caller is the test suite;
  3. the doc names the test;
  4. the doc says why the property must be proven about the shipped build.
- My reading for each caller:
  - **`source-changed.mjs`: met.** S2 asserts more than 0 vertices before the change (`:866-870`). S5b asserts exactly 0 after (`:1214-1216`, throw at `:1218`). R2 asserts repopulation after the reopen (`:1330-1331`). The "why" paragraph (`e2e-test-surface.ts:215-220`) was written for this driver.
  - **`source-watch-idle.mjs`: met in substance.** W2 (`:346-350`) and F2 (`:535-537`) assert the same owner-side consequence on the event route (header `:8-11`). P3b's reason, that only the running app can show the residency itself is empty, applies by its content. The declaration attributes the reason to source-changed and does not extend it in words.
  - **`export-view.mjs`: elements 1 to 3 are met; element 4 is not addressed for this caller.** The driver reads `totalResidentFeatures` (`:67`) as a readiness wait inside `applyAndRefit` (`:85-89`), after EV3 (`:117`) and EV6 (`:129`). Its subject is the Current view box, not residency. The stated why concerns P3b's property, not this use.
  - The rule as written asks for one why per accessor, not one per caller. Under that reading the declaration is not in breach, and it states nothing false about export-view.
  - This is a pre-existing gap, opened when export-view adopted the hook (2026-10-14). This comment-only diff makes it visible; the diff did not create it.
  - The diff adds no code item, so the caller rule has nothing in this diff to bite on.
  - The open question for the human: does element 4 bind per caller? If it does, the closure is one of two, both outside this Scope (section 6 freezes the drivers):
    - a why for export-view, written from the driver;
    - or export-view moves off `residentCounts` to the pixel poll it already uses at `:97`.

# Checks 1 to 8

**1. Diff against sections 5 and 6.**
- `git diff --name-only 1bc349ae...5a45e113`, rc 0: exactly the nine files.
- `--numstat`, rc 0: 81 insertions and 50 deletions, 131 lines against 150. Per file it matches the packet:
  - DescribeSummary.tsx 5/4
  - pick.ts 2/1
  - tileGrid.ts 7/7
  - recorder.ts 13/7
  - renderTrace.ts 2/2
  - e2e-test-surface.ts 24/11
  - FilterPanel.tsx 7/3
  - candidateArmSession.ts 13/9
  - residencyTileSizeLevel.ts 8/6
- CR and final newline (node byte check `sca-g1r-cr.cjs`, rc 0):
  - Its positive self-test found the CR.
  - 81 added lines, 0 with a CR.
  - All nine files at the head end in LF and contain 0 CR bytes.
  - My first attempt with Git Bash `grep $'\r'` failed its own positive control (it reported 0). I discarded it and used node.
- The commits match the packet: 809127d3, then merge f7f38acd (parents 809127d3 and 1bc349ae), then 5a45e113. The merge changed only `e2e-test-surface.ts` of the nine (rc 0), and phase 2 changed only that file (rc 0).

**2. Comment-only, my own script (`sca-g1r-tok.cjs`).**
- Method: parse with `ts.createSourceFile` (ScriptKind.TSX for the .tsx files) and take every leaf of the `getChildren()` tree as (SyntaxKind, exact text). JSDoc nodes are skipped; comments and whitespace are trivia and never become leaves. EndOfFile is skipped.
- A second, independent check compares `ts.createPrinter({removeComments:true}).printFile()` output for base and head.
- Why this method: the parser drives the scanner in context (template continuations, regex re-scans, JSX children). The bare scanner has no context. I showed it: the bare `ts.createScanner` (`sca-g1r-bare.cjs`, rc 0) gives false inequality on tileGrid.ts (725/704) and DescribeSummary.tsx (121/132).
- Self-tests, on scratch copies:
  - one identifier changed (`materialiseCells` to `materialiseCellz` in tileGrid.ts): `equal=false`, `printedEq=false`, firstDiff at token 815, rc 1;
  - one `<dt>` label changed (`Row count` to `Row Count`): `equal=false`, rc 1;
  - comment-only edit: `equal=true`, rc 0.
- Base 1bc349ae against head, rc 0, `ALL_EQUAL=true`. Each file shows tokens base/head, `equal=true` and `printerEqual=true`, with 0 parse diagnostics:

| File | Tokens (base/head) | JSX text leaves (base/head) |
|---|---|---|
| DescribeSummary.tsx | 553/553 | 58/58 |
| pick.ts | 342/342 | — |
| tileGrid.ts | 1515/1515 | — |
| recorder.ts | 847/847 | — |
| renderTrace.ts | 587/587 | — |
| e2e-test-surface.ts | 757/757 | — |
| FilterPanel.tsx | 608/608 | 20/20 |
| candidateArmSession.ts | 3390/3390 | — |
| residencyTileSizeLevel.ts | 166/166 | — |

- JSX text, DescribeSummary's `<dt>` labels among it, is inside the compared tokens, byte for byte. The `<dt>` self-test proves it.

**3. Section 6's fixed text (`sca-g1r-fixed.cjs`, rc 0).**
- `DEV-ONLY` lines: 5 at the base and 5 at the head, the same bytes in order. Positions base:head are 158:158, 175:175, 279:288, 305:314 and 316:329. The set's sha256 is 070f772c…0159 on both sides.
- The header block, lines 4-27 on both sides, sha256 822a6722…2671 on both sides, equal. The whole file prefix through the header is equal too.

**4. The clause table at 5a45e113.** Pins are `path:line @ 5a45e113 sha256:<hash over those whole lines, LF>`. Paths are under `frontends/shell/` unless rooted otherwise.

| Clause | Code | Holds |
|---|---|---|
| A1: the check is `shouldConstructCandidateSession()`, comparing `getResidencyArm()` with "candidate" | src/residency/residencyArm.ts:84-86 sha256:7c232324fd0ac790cb0285cc822e92db8a038b59b1b7af496792cc2dc00c50fd | yes |
| A1: the arm defaults to "candidate" (`DEFAULT_RESIDENCY_ARM`) | src/residency/residencyArm.ts:50 sha256:7f6a03cf4a311a343a544451e647abc60699d4db675128f8f872afbff2ec2bac | yes |
| A1: App.tsx makes that check with no `isInstrumentedBuild()` operand | src/App.tsx:1611-1612 sha256:281160b593db2a3c2ab0ab7ee9edb2eb7a2143ccf90eeb3644ea60db20d1a8f1 | yes |
| A1: the top-level import is live code; `startCandidateArmSession` runs by default | src/App.tsx:63 sha256:61ed7ddd781ee731cca17ca8dc20969aff26d231bdfa3b711823ac36e59a751d (value import) with :1611-1612 | yes |
| A1: selecting "baseline" is a `setResidencyArm` call the e2e harness makes through its hook | residencyArm.ts:96-106 sha256:16238a438aa3fb19edef07406bb60133240b83508f0775379645214a7fc9a776; App.tsx:1328-1329 sha256:7231ade90b69fae5bbaf1768303fb1a985c2b30ce05868074daf41dafd658962; e2e/residency-harness.mjs:2696-2701 sha256:c6647c094ddebbb75e03f79d4879bfc61904621622659587edccc237f00fb324 | yes |
| A1: `startCandidateArmSession` is not on check:dist-clean's forbidden list | e2e/checkDistClean.mjs:87-91 sha256:06de0ed93a68f4db875f4d65b70a21d63dbea12b2725eb20e3867f7c912808e8 (the removal comment; list :55-125). `git grep '"startCandidateArmSession"'` rc 1, no hit | yes |
| A9 (candidateArmSession): App.tsx's read of the getter is ungated, where the session is constructed | src/App.tsx:1624 sha256:fe684bf0606774cdb689587d851f323f877d8112a9669a7db6ce145ed4631d8c, inside :1611 | yes |
| A9 (candidateArmSession): this module imports neither selector | `git grep '^import'` rc 0, lines 4-33: neither residencyArm nor residencyTileSizeLevel | yes |
| A9 (residencyTileSizeLevel): the callers App.tsx gates are the hook registrations (setter and getter) and the notify calls | src/App.tsx:1246 sha256:060ed57b9e2e01c75494c508b61f359a35022e98dee4c63dee1cb0090a33dd95; :1334-1335 sha256:a21721136a4239acebc87af02cea249a1a8486ea5496f88d4d60379fde6c2556; :1555 sha256:ceb297624b1db0a4a7d3a7f9ee75dcd90e271e760e190092f079ba5cc8179153; :1713 sha256:d69739f645f5d0221c2d75f3d833039e95b5a74a5505e95ddf1074ba9c9f92d5; :1907 sha256:d3d185d6f0d6098cfd6b71043e39dd99f3a39e0ed03b6ed5356083c982180a29. The only product importer is App.tsx:61 (grep rc 0) | yes |
| A9 (residencyTileSizeLevel): App.tsx also calls the getter with no gate at construction | App.tsx:1624 (above) | yes |
| A9 (residencyTileSizeLevel): no export checks a build flag | `git grep import.meta / isInstrumentedBuild / ^export` rc 0: only comment lines 16 and 21; exports at :50 sha256:18d06eb215730faf41db8902132be1306ec3a386a082e6fc7433bc0c55b93da2 and :64 sha256:edd084f27dc75b830f045723c4f16761ef066d7b7c1d847a0df9439094f1bec9 | yes (N2) |
| OPEN-3 (a) addition: residencyTileSizeLevel.ts :7-8, "the counterpart" (no DEV-only claim) | as above | yes |
| OPEN-3 (a) addition: candidateArmSession.ts :148-149, "the caller reads the selector, this module only consumes a value" | App.tsx:1624; import list | yes |
| OPEN-3 (a) addition: DescribeSummary.tsx:79's form path | governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:188 sha256:712d649f2d1a8ed6aff46d56d44b16379450bda9dfc11f50231bcc38ac6f2922 (`### §2d.`) | yes |
| A7: the command bar lists the dataset's column names through `fieldOptions`, from `describe.schema` | src/command/CommandBar.tsx:95 sha256:7ef757959dea632361304ef4480797767199cdb0545ee6f88b0f79a13354039f; src/command/fieldCompletion.ts:46-48 sha256:668b35702fc9d2bf1420371a514acde13bafc6ee5b68bee08fcc65fdb57eb3ed; src/layout/StudioLayout.tsx:326 sha256:4ba54a98217c7043360e772db3dc478d5fc34c6d37da2f35683c527a6ba8c14a; src/App.tsx:2037 sha256:3bfe312c79867b107e19832022844906d031d6a6cd4aa3ede279300d5146f71a | yes |
| A7: the 200px floor and the measured budget are history per styles.css's header | src/styles.css:16-23 sha256:408ea5baff48bc17938540db7a6a796a98f7234d5ad81c6f1aaeecd03b80e594 | yes |
| A8: neither row is over the map; both render in this component | src/App.tsx:2057 sha256:5d7f99fbf9f096edeac3e644ada9b6370ea3c737374fe5b128bcf39c40c3645b (`section.source`) | yes |
| A8: the same two facts also render in the status bar as `WatcherStatusItem`'s text (`watcherStatusText`), where App.tsx places it | src/App.tsx:2378-2380 sha256:48b6a7e93c608f8b7bcc8e5b5ee879f859af25ce9cd614676c8b6a2cd2de0f9f; src/layout/regionParts.tsx:217-223 sha256:b48648c6505fb0a5eb7d0a6ac91366221dfb0fa201dbcb183cb7f5fc30b8a325; src/layout/statusItems.ts:27-35 sha256:4710944952345cae029db5a1211d6fbdd0fd5a9df3df3f2fbc656e6705bfe7e9; src/layout/contributions.ts:50-56 sha256:db972a32df2cf51c96750d865b2725296294c845e582d826e86e3da4bcb6df67 | yes, as a placement statement. The status item is hidden while session-ended stands (statusItems.ts:28); the sentence makes no "when" claim |
| A10 header: only skp/client.ts, outside console/ and tests, imports `consoleRecorder` | src/console/soleCaptureSite.test.ts:36 sha256:57092a5b25ba2e4210fd6c3a8e9f94ee9ebad479e818e6a94589d2a8617770d0; src/skp/client.ts:6 sha256:c5d4edd1fc33a3b61fd5abd902eaf63aacd96b9ed85e95f928e67814ce74d5c4; importer grep rc 0 | yes |
| A10 header: `recordNamed` is imported outside console/ by the RECORD_NAMED_ALLOWLIST modules; two scans, one per name | soleCaptureSite.test.ts:49-61 sha256:ee3ab0d4b8f949e2758c84e2f47de04a40b207945c78cb0a498ccc771fb17dbc, scans :130-172. The grep finds the 11 non-console, non-test importers, exactly the 11 listed | yes |
| A10 `recordNamed` doc: the five binding-command and six class-C modules import this and never `consoleRecorder` | same grep: none of the 11 imports `consoleRecorder` | yes |
| A10 `recordNamed` doc: ConsolePanel imports both, reads `consoleRecorder` for the log and calls `recordNamed` for two toggles; allowed as a console/ self-reference | src/console/ConsolePanel.tsx:18 sha256:615836c7235519accb402d15b3f9bcdde94d63603b740aa84bc4d1734429aed4; :49 sha256:a204b229f1696ffd038140fcdaca246a92192ba309f8c0a37c27ef055dcc37ba; :79 sha256:10b7aec5f02e4285e9c3562ef4cdc9fe1642c2a5fb9feb5b8e612aa66e89faf5; :123 sha256:abc7006d5facc6a9dbe39500f4d29f8b69d4f88b6a982f5c567596e73dce6c44; soleCaptureSite.test.ts:76-81 sha256:87890fa2ae5d53f39e1652a9a25c253d229c1989cc1e6d4c349d65610033578b | yes |
| A11 pick.ts: `onHover`'s `emitHoverReadout(null)` branches | src/canvas/WorkingCanvas.tsx:2148 sha256:234bf1f275d16a1a85fc9906bf3fda4fdf161d4733d5af9b6378fcb4ad0c68f2; :2158-2160 sha256:4f1dd3d876cccb219abf352540cab161469d968c1c2c8042c20568c3f200d2aa; :2166-2169 sha256:51df85919cb2dc9914bd984d8deda4e9cb1d5830b2fbce194fa5a983e0d1a9a6 | yes |
| A11 tileGrid.ts: `onCameraChange` goes through `tileCoverForBbox` | src/streaming/tileViewportStreamManager.ts:511 sha256:39ef458b3e9b38912b3bbab1c30876fc2ab23c4f7498004f4cc8e10b943407a2; :527 sha256:a7856318434de06901041bcfb87d942ef701ac50dad60bcf0380155205c7ee57 | yes |
| A11 tileGrid.ts: `onCameraChange`'s capacity truncation, nearest kept and farthest dropped | tileViewportStreamManager.ts:626-639 sha256:1bb2fca259ed8375dc13dc8370a21a3226a8b1a0c77bdc7ca33691d3a5677d88 | yes |
| A11 tileGrid.ts: `tileIngest.ts:43-51` and WorkingCanvas's `parseTileKey` each throw | src/canvas/tileIngest.ts:43-51 sha256:1f52b4b11ab162519c88a2353096fd6ab84b29052ee49b3a9d3dd46b833eca25; src/canvas/WorkingCanvas.tsx:503 sha256:b9345be0be644236a3508ddfc1d2760807f931308185d834465b439d4f210365 (throws at :508) | yes |
| A11 renderTrace.ts: the `traceViewportQuery` call site in tileViewportStreamManager.ts carries "always-on render-trace (never instrument-gated)" | tileViewportStreamManager.ts:940-942 sha256:d31544fb1043a9ab3331116fa446b88a25e5d27c2870da1423dabbfbebcf20b6 | yes |
| A11 e2e-test-surface.ts: `WorkingCanvasHandle.getResidentCounts()` in canvas/WorkingCanvas.tsx | WorkingCanvas.tsx:177 sha256:8f11641229976ab81760fe610da07b85a2feac3cf8825b597fd7a21d8562dd8a | yes |
| A5: callers are three E2E drivers; no product module reads it; App.tsx only registers it | `git grep residentCounts 5a45e113 -- .` rc 0: e2e/source-changed.mjs:607 sha256:3ff2ebbff5e3f4a3f94979e7218db5f043c606d4a9d273a7e156ecd1459dfe11; e2e/source-watch-idle.mjs:214 (same line hash); e2e/export-view.mjs:67 sha256:a1ba55a16f9202e386bce2ae9ef8cebc7600e9833c65e806622d1994a5eef6e2; src/App.tsx:1281 sha256:164e53dfa02b0069359d02cd57ee6f87915c3371d3abcfcddc40f7e2066b08f0 (register) and :1342 (unregister); the rest are records and comments | yes |
| A5, source-changed: more than 0 before (S2), exactly 0 after (S5b), repopulates after a reopen (R2) | :866-870 sha256:5ccfb88161733e5996bcff10d3c3032c0e52819643b371700603030bab5e7f57; :1214-1216 sha256:41a7b2d1397e7fec46eae65c380dd7046815370b8a4ce879e457cfc55c2d1b95; :1330-1331 sha256:baa84fca25fa459e03f7ecfdcd1f098136f7df3be7cd37e027d44cfb05a7ddf8 | yes |
| A5, source-watch-idle: the same pair for an OS-watch change while idle (W2, F2) | :346-350 sha256:20c06ea95c96f40ad78bb1821fed3b691616b599fdd1423302b4f2201e40d84c; :535-537 sha256:3b1d6fffcd18e4f7e4d6b6b63b5b770f663ebb4bb25d8f06168ee991c01a7e35; :8-11 sha256:c1c3b6a197abeb627ecfaf8ece3d3d92210b5d7258fd983a67d04e226a09f48f | yes |
| A5, export-view: at least one feature is resident after `queryWithFilter` applies a predicate, read as `totalResidentFeatures`, before settle and prepare | :85-89 sha256:2a33e76882db1bdf8f7661cc0423c61eaf5758cf0785ac3a4fa93f3a595abebf; :117 sha256:28135f05d73ff0a7c79d44df5573680ece9eff4bfcc73dd8b22b9a898e3b8a03; :129 sha256:bae73a1cf9e9220fc8be6576ea5fe3ad85d09ffd3e322957356c9ba78d86d3e0 (EV6's empty predicate is "a predicate" by the driver's own doc at :84) | yes (H1) |
| A2: selects "baseline" or "candidate" for the next session; the default is "candidate" (`DEFAULT_RESIDENCY_ARM`) | residencyArm.ts:50, :58 sha256:c7f312f6be8fd34d7a518f77e4c221568e9566c5e7c73b95d9ec24c2a3d8c0ec | yes |
| A2: the harness calls `setResidencyArm(cellArgs.arm)` in `main()` before its first `openFixture`; `cellArgs.arm` is "baseline" unless `--arm candidate`; it reads the arm back | e2e/residency-harness.mjs:396-397 sha256:50ccc31ef042cb67deb1d8a31c9dc0e84a1699019ac0d07a85a5e3364b59fe8c; :401-402 sha256:6ef5e7e865a685bb2702b8d7a45469932fef2bc377f152233164861054c7bb5a; :2696-2701 (above), inside `main` (starts :2291, runs to the end of the file); the openFixture uses are later (:2834) | yes |
| A2: refusal-contract-baseline sets "baseline" and reads it back | e2e/refusal-contract-baseline.mjs:606 sha256:23b36137d0d50cd49746e85cbc436e776cf25a63505ed2e5ca43f13d9825edad; :610-611 sha256:8a19c9eee6eb730f7a9455177087aac88eef97eeda32d532428d0627f14bc44e | yes |
| A2: those two are the drivers that set it and run on "baseline" | `git grep setResidencyArm\|getResidencyArm -- frontends/shell/e2e` rc 0: setters only at residency-harness:2696 and refusal-contract-baseline:606 | yes |
| A2: regression, filter-panel and console set nothing and assert "candidate" | e2e/regression.mjs:1774-1775 sha256:427a55881b425a90eabf0b120a21a2dd6f9e9b21c7eb5ad61dd1fae18c5f432a; :2633-2634 sha256:edcefbd3531a57ff1a3007032fd445547d666afb35a659a51dc2963f82aa4357; e2e/filter-panel.mjs:475-476 (same hash); e2e/console.mjs:73 sha256:ff16f6a617b7e6266be32746ada51c91ea4fd197f04156b6c5a09a239701d30f; :1029-1030 sha256:cccc40104a910ec86ea3dc0c1b91ac52a5e2a9f2a6e7eb5ac7c6f0a689d806d3 | yes |
| A2: `getResidencyArm`'s doc | residencyArm.ts:68-70 sha256:0201b86e544f0473a3fc07ac254efa9bc73bc97a8f7c09f8721335c6bb7b432f | yes, plain reading (N1) |

- **Sibling grep over the five rewritten residency, filter, admission and console files** (`dev-only|dev-gated|dead code|only caller|.canvas-status-stack|import.meta.env.DEV`, rc 0). The remaining hits are true: they describe the setter or the notify calls, which are gated, or an unrelated P3i hook. One exception, outside Scope: App.tsx:1277 (O1).
- **No replacement words are required.** The packet records that the new comments are the workers' words. None is the human's wording, and none is red-line text. Section 4 states `**Red-line text in Scope:** none.`

**5. Suite at the head, one shared hold** (`frontends/shell`; one Bash call, background, then its notification):
- hold_rc 0;
- `npm run typecheck`: rc 0 (the pretypecheck built the viewer, then `tsc --noEmit`);
- `npm test`: rc 0, Test Files 109 passed (109), Tests 1446 passed (1446);
- `npm run test:citation-integrity`: rc 0, `== 30 passed, 0 failed ==`.

**6. Records at the head, one shared hold, all run from `C:/dev/wt/sca`:**
- hold_rc 0;
- `verify.mjs --offline`: rc 0, `verify:plan PASS`;
- `verify-cites.mjs`: rc 0, PASS over 2742 files (173 loose references advised, all pre-existing);
- `verify-quotes.mjs`: rc 0, PASS (138 checked, 107 verified, 30 baselined, 1 advisory, 920 ruling cites resolved, 0 errors);
- `verify-test-claims.mjs`: rc 0, PASS (751 claimed tests);
- `node --test` over plan, hooks and evidence: rc 0, tests 598, pass 598, fail 0.

**7. CI.** `gh pr checks 295` rc 0: 13 checks, all pass. `gh run view` gave rc 0 for each run, and every one reports headSha 5a45e113cf679a73f1cfbdf709cd4fa55bda3b5a with conclusion success:

| Run | Event | Workflow |
|---|---|---|
| 42417281494 | pull_request | DCO sign-off |
| 42417281493 | pull_request | Exposure scan |
| 42417281541 | pull_request | Ported notices |
| 42417281573 | pull_request | Product CI — shell |
| 42415848549 | push | Ported notices |
| 42415848550 | push | Rust fmt |
| 42415848554 | push | Governance CI — plan, queue, site |
| 42415848586 | push | Product CI — shell |
| 42415848597 | push | Product CI — Rust workspace |

**8. Porcelain afterwards.** `git status --porcelain --untracked-files=no` rc 0, 0 bytes, and HEAD is still 5a45e113. It was also empty at the start.

# The packet's gaps
- The packet did not say where the `e2e-test-surface.ts` header now ends at the base (lines 4-27 after #292; the form gives :4-12 at fa7d117). I derived it as the first doc block.
- It did not pre-list `residentCounts`'s product-side comment at App.tsx:1277 as a sibling outside Scope (O1). I found it by grep.
- It did not say that Git Bash `grep $'\r'` cannot be used for the CR check on this machine. That is not strictly the packet's job; I found it by a failed positive control.
- Otherwise none.

# Hold lines (this project; the also= segment elided)
- Suite: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:76280 also=<elided>`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:76280 affinity=FF (cores 0-7)`.
- Records: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:56264 also=<elided>`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:56264 affinity=FF (cores 0-7)`.

# Background shells left
- None.
- I started three background shells: the suite hold, the records hold, and one wait loop (5 s sleep, 360-turn cap, ended after 66 turns). All three completed with exit 0.
- Afterwards no vitest, verify-quotes, `node --test` or machine-script process was running (process count 0).
- Nothing was killed.

The scratch files are all named `sca-g1r-*` in the session scratch folder. Nothing tracked was written.
