*Custodian's filing note (2026-10-20): the architect's draft of the O2 follow-on's options for `source-changed-post-route-s5d-race` (the form's §2 and Amendment 4 item 6), read only at main 0bbc1c9919ba8ef94f6c115414f11dfaa792963f. The run 2026-10-20T11:39:09Z to 11:45:24Z by its transcript (Read 19, Grep 10; no write and no shell); its one SubagentHandback call, at 11:45:23Z. Extracted by script; every path:line cite reads at main, so none is de-rooted; one final newline added if absent; nothing else changed.*

---

Drafted: source-changed-post-route-s5d-race, the O2 follow-on's options, at main 0bbc1c99

This is a read-only draft at main 0bbc1c9919ba8ef94f6c115414f11dfaa792963f. Every `path:line` below was read at that commit. I have no shell, so none of them carries a sha256 yet. The filer fills the hashes by script, or the reviewer recomputes them. There are no line cites into DECISIONS-PENDING.md. "Record" means `state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md`.

## What both options rest on (as read)

- **R1. Every refused tile mint is logged, even after the session has ended.** `logMintRefused` runs first in `mintAndStart`'s catch (`frontends/shell/src/streaming/tileViewportStreamManager.ts:944`). The check that ends the session comes after it (`:955-957`). `endSession` is latched by `if (this.sessionEnded) return;` (`:736`) and logs the session-ended line once (`:743`). `onTerminal` reaches `endSession` (`:1084-1086`) and never logs a refusal.
- **R2. A C2 refusal means a sibling's own pre-check found the change while the generation was still live at that sibling's live check.** The kernel runs `require_live` (`kernel/src/skp.rs:1436`) before the pre-check that ends the generation (`:1449-1455`). `end_generation` returns 0 when the generation has already ended (`:914-917`). The P line prints that count either way (`kernel/src/lib.rs:623-642`).
- **R3. The suite reads only the session log.** The P count is in stderr, which the suite cannot read (Amendment 4 item 6). `runStep` knows only PASS, FAIL and INFO, and the suite exits 1 or 0 (`frontends/shell/e2e/source-changed.mjs:807-819`, `:1470-1471`). No script or npm task consumes this driver's exit code (searched: only prose, PLAN and queue files name it).
- **R4. The record's 16 runs.** S5d failed in 14, every failure C2. Both passes (B5, B7) have P = 23. In every C2 run every P line counts 0 (record, the Summary table).
- **R5. How many mints S4 makes now.** The post route's S4 pans to the dataset's bound (`source-changed.mjs:1096-1110`). That comment names the human's Decision A as the reason for the bound. Each run then issued 4 to 6 new streams (record, the S4 notes). At most 3 tile mints are in flight at once (`frontends/shell/src/canvas/tileGridConstants.ts:40`).

## Option (a): a C2 run reads INCONCLUSIVE, never a pass

**What a run then proves:**
- **PASS** means a session ended and no tile mint was refused since the baseline. By R1, that rules out a pre-check refusal reaching the tile manager. It does not show which kernel route ended the generation (R3).
- **INCONCLUSIVE** means a session ended and a sibling's pre-check found the change (R2). Whether the post-check also found it, or found it first, is neither shown nor ruled out.
- **FAIL** means one of: no session-ended line; a refusal that is not C2 (C1, C3, or R's detail, the last of which is still the human's open question under Amendment 4 item 4); or any earlier step failed.

**Against the 16 runs:** 2 PASS (B5, B7), 14 INCONCLUSIVE, 0 FAIL. The 14 runs would exit 3 instead of 1, because S1 to S5c passed in all of them.

**The change, about 150 to 160 lines over 5 files:**
- **New pure module** `frontends/shell/e2e/s5dVerdict.mjs`, about 40 lines. It parses session-log lines in the shape of `logMintRefused` (`tileViewportStreamManager.ts:280`; for example, record A1's refusal line) and returns `{status, class, message}`. It reads the kernel's two fixed details and R's detail from source at the form's base, the way `exportElapsed.mjs`'s `readTtlMs` reads publish.rs. The form decides between that and a pinned script copy; I recommend reading from source, so that drift fails by name.
- **`source-changed.mjs`**, about 35 lines:
  - `runStep` gains INCONCLUSIVE through its own error class, the same pattern as `ExportInconclusive` (`exportElapsed.mjs:14`).
  - The exit code becomes 3 when there is no FAIL, as `publish.mjs:651` does.
  - S5d's body calls the module.
  - D8, D9 and the header note at `:179-188` (which says a lost race "FAILS BY NAME") are corrected.
  - The stale cites in D11 (`:168-172`) and D9 are class-3 fixes.
- **New test** `s5dVerdict.test.mjs`, about 70 lines.
- **`package.json`**: a `test:s5d-verdict` script, added to `verify` (`:17`), 2 lines.
- **`e2e/README.md:243`**, 1 line. §3 of the form forbids touching this file while milestone 3 is open, so (a) merges after milestone 3, or the human lifts that bar.

**Tests.** Each case is built from tracked record lines, byte-copied by script:
- T1: B5's session-ended line reads PASS.
- T2: A1's two lines read INCONCLUSIVE, class C2.
- T3: A3's two lines read INCONCLUSIVE. Its session-ended detail is the refusal text, not the watcher placeholder.
- T4: B5 with its session-ended line removed reads FAIL.
- T5: A1's refusal with its detail replaced by a kernel fixed detail, read from source, reads FAIL (C1).
- T6: the same with E1's detail reads FAIL (R).

**Mutations.** Each is applied alone, its failure observed, then reverted and recorded in the test header the way `exportElapsed.test.mjs:5` does:
- M1: the INCONCLUSIVE branch returns PASS. T2 and T3 fail by name.
- M2: the fixed-detail check removed. T5 fails by name.
- M3: positional reading, so a refusal after the session-ended line counts as a consequence. T2 fails by name.
- M4: the R check removed. T6 fails by name.
- Then the post route runs 8 times alone at the follow-on's head. If no C2 run comes up, the record says the INCONCLUSIVE branch is proven only by T2 and T3.

**Cost:** nothing extra per run. In the series, the suite shows the route clean only in passing runs, which was 2 of 16 in step 2. The PR body states that milestone 3's sweeps will read INCONCLUSIVE where they now read a failure (§3).

**Left undecided:**
- Whether INCONCLUSIVE is standing, or lasts "until triaged" as the 2026-10-17 item 7 ruling's does.
- C1 stays FAIL here. No C1 run occurred in step 2.
- R's verdict (the human's).
- How many INCONCLUSIVE runs a gate accepts.

**Route:** this changes what S5d asserts, so it falls under §21a. By round 25 item 2 (e) it gets its own full form from dispatch, with reviewer and architect gates.

## Option (b): S4's gesture narrowed so one tile is planned

**What a run then proves:**
- **PASS** proves what (a)'s pass proves, by the same R1 reasoning, and nothing more. In both, no tile pre-check refused and the kernel route is not read (R3). The only difference is that no sibling existed.
- **FAIL on a refusal** means a second tile mint was attempted. That is a driver defect, not a product finding.
- **A new failure mode.** If the one stream drains before the repoint lands, nothing finds the change. S5a to S5d then fail although the product is right. The repoint's delay after the trigger is "neither bounded nor measured" (Amendment 4 item 2), so this share cannot be predicted.

**Against the 16 runs:** they cannot be re-read. With 4 to 6 new streams each (R5), all 16 would fail a check for one new tile mint. The record predicts nothing for (b), and it needs its own series.

**The change, about 90 to 140 lines over 3 to 4 files, plus a step before it:**
- **A step 0 probe**, with no assertion change, to find a gesture that plans one tile at S2's camera. The driver cannot read the tile plan. Deriving the grid frame inside the driver would be a second copy of product logic written to an interface it does not have. Watching render-trace `viewport_query` lines (one per tile attempt, `tileViewportStreamManager.ts:937`) only reports the count after the gesture.
- **The post route's S4 rewritten.** The gesture replaces the pan bound that the comment at `:1096` ties to Decision A, so the form must read Decision A and the human must rule on it for this route. The zoom rung is removed or fails by name. S4 asserts exactly one new `viewport_query` from the gesture through S5d.
- **D8, D9, the header and the README**, as in (a).

**Tests:** a pure check over S4's real note line from the record (`17 -> 22`) reads FAIL. The mutation removes the one-tile check, and that case then fails by name. Then the post route runs 8 times at the head.

**Cost:** each run is shorter (fewer drags). The series bears an unmeasured share of runs that are red although the product is right (above). If those need their own INCONCLUSIVE, that brings (a)'s machinery back.

**Left undecided:** the gesture itself, Decision A for this route, and the drain-before-repoint case. Whether the untiled first-look stream traces `viewport_query` was not read.

**Route:** §21a, the same as (a).

## Amendment 4 item 6's additions, for both options

**D9 (`source-changed.mjs:1388-1397`).** This is the worker's comment, not the human's wording. Replacement:

"S5d: POST route only. It reads the session log's lines since this run's baseline. `tile-stream-mint-refused` is logged by `logMintRefused` first in `mintAndStart`'s catch, before that catch checks whether the refusal ends the session, so a refused mint is logged even after the session has ended. `onTerminal` never logs it. `endSession` is latched by `sessionEnded`, so `tile-session-ended-source-changed` is logged once, by whichever way into this manager came first. Neither its position nor its detail tells which kernel route ended the generation, and the kernel's own stderr line is not read by this step."

Each clause checked against the code:
- "first, before the check": `:944` comes before `:955`.
- "even after the session has ended": nothing in `mintAndStart` guards on `sessionEnded` before `:944`.
- "`onTerminal` never logs it": `:1064-1093`.
- "latched": `:736`.
- "logged once, by whichever way came first": the session-ended line is at `:743`, and `endSession` is called at `:956`, `:1085` and `:764`.
- "the kernel's stderr is not read": R3.
- The line cites are replaced by names, which removes the stale `:952-954`, `:1081-1083` and `:733`.

**D8 (`:1426-1429`).** These are worker strings, not the human's wording.
- Under (a), the C2 message reads: `S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail (${detail}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded. Evidence: ...`. Checked against R2 and R3. Any other refusal reads FAIL with its code and detail.
- Under (b), it reads: `S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- a tile mint after the raced one was refused, which the one-tile gesture should exclude; which kernel route ended the generation is not read by this step. Evidence: ...`. The raced mint succeeded, so any refusal belongs to another mint.

**Each C2 run's P count, for the human.** Every count is 0:
- One P line: A1, B1, A2, B3, B4, A7.
- Two P lines: B2, A3, A4, A5, A6, B6, A8, B8.
- The passes B5 and B7 have 23 each.

By K2, a count above 0 comes only from the post-check call that made the end, and a count of 0 shows neither way. So in none of the 14 C2 runs does the record show that the post-check made the end. That is a pattern, not a proof.

## Recommendation

I recommend (a). It is written against interfaces that exist: `runStep` and the INCONCLUSIVE precedent in `exportElapsed.mjs` and `publish.mjs`. Every test case comes from tracked record lines. It changes no gesture and does not reopen Decision A. What it reports is exactly what the suite can read. Its cost is real: on this evidence S5d would mostly read INCONCLUSIVE, so the custodian's P counts stay the stronger evidence for the post-check route. Option (b) pays for removing C2 with a design gap at its centre (no way for the driver to plan one tile), a new red-but-correct failure mode with an unmeasured share, and a ruling on Decision A. Its pass would prove no more than (a)'s.

## Question for the human

On the post route, a sibling tile's own check usually catches the change before or alongside the check under test (14 of 16 runs). Should the test:
- **(a)** report those runs as inconclusive, never as a pass, and keep the test as it is otherwise; or
- **(b)** change its pan so that only one tile loads, which needs a new gesture still to be found and your word on Decision A for this route?
