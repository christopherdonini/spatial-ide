Built: open-first-look-fills-fit-view S3, worker-high (the custodian's filing note, 2026-11-18: worker-high, model claude-opus-5-5, its run 2026-11-18T18:59:48Z to 19:17:59Z by its transcript, Bash 47, Edit 21, Read 18, Write 1, none errored; 7608 bytes, sha256 4b08fed370042d54acc7a360fdbdb8075b41486d9a226911484f9b2a8ede3926; below byte for byte, with this note and one final newline)
Result: the tests U-FL1 to U-FL6 are committed as U (fe23634c) and pushed. At the base they fail exactly as predicted, and the typecheck fails only on the missing member. No STOP.

**Start state and installs:** C:/dev/wt/fl-u3, branch cut/open-first-look-fills-fit-view-u3. HEAD and ls-remote were both B (349cec82e5ecbfab40db3ae9b6811d471d9ea2de). The porcelain was empty, C: had 49G free and D: 370G. git fetch rc=0. npm ci rc=0 in renderer/bundle-viewer and again in frontends/shell, and the porcelain stayed empty. The brief's sha256 matched.

**The tests at U:**
- **Shared fake and helpers:** frontends/shell/src/residency/candidateArmSession.test.ts, imports at 56-57, helpers at 3784-3874. `firstLookCanvas` builds the fake through the existing `fakeCanvas(Partial<WorkingCanvasHandle>)` with typed `vi.fn<...>` spies and no cast.
- **U-FL1** (session test, 3876-3896): sends Completed to the first look with no onViewportChanged and no timer advanced. It then asserts, synchronously: one apply of the 2 covering tiles of the shown box; one viewport_query per tile, each with a bbox and no row limit; one `candidate-first-look-view-planned` line.
- **U-FL2** (session test, 3898-4005): a table of 10 cases, each asserting no apply, no viewport_query and no planned line inside the terminal:
  - (a) twice: relinquishFill while the frameless look streams, and relinquishFill after the issue but before the mint. The pre-mint case is the only one that isolates term (vii).
  - (b) stop() ran first.
  - (c) ProducerFailed, plus S1's single partial-failure emit.
  - (d) the terminal of an orphan after reissueUnrestricted.
  - (e) a null shown box.
  - (f) a change pending at the terminal: one plan in total, of the pending box, after the debounce.
  - (g) a pan already planned this generation: exactly one status emit, S1's.
  - (h) twice: the look's own source-changed terminal, and notifySessionEnded followed by Completed.
- **U-FL3** (session test, 4007-4026): after the terminal's plan, the covering streams sh_t1 and sh_t2 complete. The last event is candidate-within-budget settled complete, and `residencyStatusText(reduceEvents(events)!)` is `Showing all 7 features in view`. It first asserts the started handles, so the base fails on an assertion, not a throw.
- **U-FL5** (session test, 4028-4061): the generation before settles through a pan. Then `reissueUnrestricted(null, f)` ends Completed, and one plan of the shown box runs, with every tile query carrying f.
- **U-FL6** (session test, 4063-4080): the scan events show no reset at the terminal or while the last tile streams, then exactly `[[{kind:"reset"}]]`.
- **U-FL4** (frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx, import at 64, block at 424-456): `shownViewportBbox()` is null on mount. After the candidate arm's one-shot fit it equals the box onViewShown received, and after a drag tick and a settled tick that moves the origin it equals the box onViewportChanged received.

**U:** fe23634c0bcf692b3e21e798033447d19f88a149 "test: U-FL1 to U-FL6, the first look plans its shown view at its terminal (open-first-look-fills-fit-view S3), committed before the change".
- Numstat against B: 35 0 for WorkingCanvas.wiring.test.tsx and 301 0 for candidateArmSession.test.ts. Both are under their ceilings (110 and 320).
- The porcelain was empty after the commit. The push succeeded (349cec82..fe23634c), and ls-remote prints fe23634c0bcf692b3e21e798033447d19f88a149.

**P-U-base** (one run at U, log <S>/fls3-vitest-base.log): rc=1, "Tests  5 failed | 107 passed (112)". Byte-copied failure lines:
- "× U-FL1: a first look that ends Completed with no plan plans the box the canvas shows, synchronously in its terminal, with no onViewportChanged and no timer advanced 41ms" with "AssertionError: one plan, in the terminal: expected "vi.fn()" to be called 1 times, but got 0 times"
- "× U-FL3: when every covering stream of that plan completes, the status settles complete-in-view and residencyStatusText renders that sentence 21ms" with "AssertionError: the terminal's plan started both covering streams: expected [ 'sh_1' ] to deeply equal [ 'sh_1', 'sh_t1', 'sh_t2' ]"
- "× U-FL5: after a settled plan, reissueUnrestricted(null, f) -- Apply's, Clear's and the Colour-by refill's seam -- ends Completed and one plan of the shown box runs under f 8ms" with "AssertionError: one plan: expected "vi.fn()" to be called 1 times, but got 0 times"
- "× U-FL6: across that terminal the scan events hold no reset until the last covering tile ends, then exactly one 10ms" with "AssertionError: no reset at the first look's terminal: expected "vi.fn()" to not be called at all, but actually been called 1 times"
- "× U-FL4: shownViewportBbox is null before any camera write, the box onViewShown received after the one-shot fit, and the box onViewportChanged received after an interactive tick 21ms" with "TypeError: ref.current.shownViewportBbox is not a function"

The default reporter does not print passing lines. The pass of U-FL2 is read from the counts: the new describe block shows "(14)" with 4 listed failures, so the 10 U-FL2 cases passed, and every existing test passed (95-4 and 17-1). The prediction holds.

**Typecheck at U** (<S>/fls3-typecheck.log): rc=2. Only two errors, both on the missing member:
- src/canvas/WorkingCanvas.wiring.test.tsx(439,38) TS2339
- src/residency/candidateArmSession.test.ts(3841,7) TS2353

**S6 mutations (described here, none applied):**
- **M-U1:** delete the new block in the untiled sink's `onTerminal` (`issueUntiledQuery`, candidateArmSession.ts). Should fail U-FL1 and U-FL5.
- **M-U2:** drop `!relinquishClearPending` from that block's guard. Should fail U-FL2 (a) before the mint.
- **M-U2g:** drop `!hasPlanned`. Should fail U-FL2 (g), with 2 status emits.
- **M-U3:** call `manager.onCameraChange(box, currentFilter)` in place of `handleViewportChange(box)`. Should fail U-FL3.
- **M-U4:** in `shownViewportBbox` (WorkingCanvas.tsx), build the box without `originX`/`originY`. Should fail U-FL4 at the fit.
- **M-U5:** in place of the direct call, set `pendingViewportChange = true` and go through the debounced accept. Should fail U-FL6.
- Guard terms (ii) `!wasSelfCancelled` and (vi) `!stopped && !sessionEnded` cannot be isolated: both are implied by (i) `wasCurrent`. The frameless (a) case is also blocked by (iii) `!relinquishedReEmitted`.

**Things I did that the brief does not name:**
- Before committing I ran the same vitest command once (<S>/fls3-precommit-vitest.log, rc=1, the same 5 failures) and the typecheck once (<S>/fls3-precommit-typecheck.log, rc=2, the same 2 errors). The purpose was to confirm each test reaches its assertion; no test was edited after it.
- The typecheck's pretypecheck step wrote ignored build output (renderer/bundle-viewer/dist and friends, frontends/shell/src/generated).

**Notes:**
- The brief cites `residencyStatusText` at 475; it is at residencyStatus.ts:474.
- The frame comment in my describe block says "(this file's "Item B" block)". The clearer derivation is the baseSpan-2 positive control near the file's line 282. The comment is left as committed.

**Self-check:**
- The fakes use the real `WorkingCanvasHandle` and session interfaces, with no cast.
- Every claim above points to a log in <S>.
- No user-facing message was added.
- Each failing test reaches its assertion; U-FL4's first failure is the absent member itself, as predicted.

**Model:** Opus 5.5 (claude-opus-5-5), no override. I received one context handoff (a compaction summary) mid-task.
