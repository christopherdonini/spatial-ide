# SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE — preregistration (full form)

Proposed path: `frontends/shell/SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md`.

## Header

- **Authority.**
  - PLAN node `source-changed-post-reopen-routes-watcher-visible` [R1].
  - The human's third message of 2026-10-17, item 1 [R2]: ordered, not joined; the piece placed in S3, slot 2, before `source-changed-post-route-s5d-race`. Its RULED block in `DECISIONS-PENDING.md` is cited by that message's date and item, never by line.
  - Context, not authority: S5d's own rulings [R3, R4, R6], S5d's node [R7], and S5d's form with its Amendment 3 [R18].
  - Item 6 of the human's second message of 2026-10-17 [R5] is read for N6's message and is not acted on.
- **Drafted by** the architect agent, alone, on the custodian's brief of 2026-10-17, at main 28163cb6f30fd60681903ed1227cdf17c06abc0f.
- **Committed before any code.** Append-only once committed. An amendment written after any run has been seen says so in its first line, and states what it touches or invalidates.
- **Pins.** Every pin below is historical. For this piece's runs, the tree at the branch head is authoritative. For what this form read, the pin is.

## §0. Disclosure

### §0.1 The code and the record as read

- **W1. What the watcher covers.**
  - The watcher arms on the canonicalized path, so junctions and symlinks resolve in every component [R41].
  - It watches the parent directory for the file's own name, compared by name only [R42, R44].
  - It watches the grandparent, with the directory-name filter, for the parent's name [R43].
  - Nothing above the grandparent is watched.
- **W2. Which path the checks read.**
  - The kernel arms the watch with the request's path as given [R47].
  - The dataset keeps that path as given [R54].
  - The pre-check and the post-check both compare the descriptor read at that path [R55, R51, R52, R53].
  - So repointing a junction that sits above the grandparent changes no watched directory, while the descriptor read at the opened path becomes the new target's.
- **W3. Every kernel end goes through one emission point.** It is idempotent [R45]. Its product callers are:
  - the pre-check [R48];
  - the post-check [R50];
  - the watcher's sink [R46].
- **W4. When each route writes its stderr line.**
  - The watcher writes its stderr line before its end call [R46].
  - A stream's post-check writes its line after its end call, whether or not that call made the end [R50].
- **W5. The shell side.** Three ways lead into the tile manager's end:
  - a refused mint, which logs `tile-stream-mint-refused` first and unconditionally [R58, R56];
  - a stream terminal [R59];
  - the kernel's session-ended event, whose detail names the watcher for every observed-change end, whichever kernel route made it [R61, R62].

  The end latches. It logs `tile-session-ended-source-changed` with the first detail to arrive [R57]. The status message is built from that same detail [R94, R64]. A refusal's detail is its code, then its message [R65].
- **W6. Step 1 of S5d** [R19, R20, R21]:
  - every readable stderr capture holds the watcher's line, and it is the first line;
  - every failing run has no post-check line.

  By W4, line order does not show which route made the end. So no run shows which kernel route ended the session, yet S5d's pass note names the post-check [R37].
- **W7. The driver at this base.**
  - The post and reopen routes open `SCRATCH_COPY` [R24].
  - The post route touches the mtime on the first new `stream-issued` line [R26, R31].
  - The reopen route touches the mtime at S3 [R29]. At R4 it touches the mtime again and pans two drags [R34].
  - The junction layout, the cross-dataset pan, the pre-check line and the two-copy hash check run on the pre route only [R27, R30, R38].
- **W8. The suite cannot assert on the app's stderr.** The suite's own launcher sends the app's stderr to `e2e/out/app.log` [R69]. A sibling driver records that this launch does not reliably deliver the app's stderr into that file on this platform [R68]. So no step here asserts on stderr.
- **W9. Text that still describes the touch.**
  - N6 and N8 touch the mtime by hand [R71, R72].
  - Q1 says its touch is the same as N6's [R77].
  - The e2e README says the post and reopen routes keep the touch [R79].
- **W10. KNOWN-LIMITATIONS item 26** states that a symlink repointed after admission is not signalled while idle and is caught at the next pre-check or post-check [R81]. The pre route already exercises its pre-check clause [R10]. This piece is the first e2e run of its post-check clause.

**Reuse index (the standing step).** The custodian ran `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c.
- For `source watcher` (exit code 1) it printed `No prior art recorded for "source watcher". Research it before planning an implementation.` This is a miss, noted, not blocking.
- For `junction` (exit code 0) it printed `capability: path-containment → cap-std [PORT], Go [CONCEPTUAL], Rust std [CONCEPTUAL], fs_at [WATCH], libpathrs [WATCH], filepath-securejoin [REJECT]   (worth-owning, P0)`. This is a hit, row `path-containment`. It does not bear on the piece: the junction here is a test layout made on purpose, and no path-containment logic is written or changed. Nothing is drawn on, and nothing is ported.

### §0.2 Hypotheses, labelled

- **H1 (inferred from W1 and W2, not observed on the post or reopen route).** A junction repoint produces no watcher signal on either route, and the next pre-check or post-check reads `{mtime}`.
  - Discriminator: §4's stderr readings.
  - On the reopen route, R4's idle check (§2.3).
- **H2 (inferred, not observed).** The repoint is two calls, unlink then create, so a check can run in the gap between them. A check that does would carry the detail that the source could not be re-read [R53].
  - Discriminator: that detail, anywhere in §4's runs (I2).
- **H3 (unobserved).** After a post run, `lstatSync` of the junction gives its own creation time. That instant is the repoint, and it is no earlier than the first new `stream-issued` entry's receive time.
  - Discriminator: §4's per-run reading.
  - This is ordering evidence only: no gap is reported and no duration is claimed (ADR-018).
- **H4 (unobserved).** The native file dialog returns a path typed into its File name box without resolving the junction in it.
  - Discriminator: N6's far pan. If the junction was resolved, no check ever sees a change, so no block appears.

### §0.3 Overlap (rule 00)

- **PR #227** (draft; `e2e/exportElapsed.mjs` and its test, `e2e/publish.mjs`, `e2e/selection.mjs`, `frontends/shell/package.json`, the CI comment, and later `e2e/README.md`'s publish and selection entries).
  - It shares no file with this piece except `e2e/README.md`, and there the entries are disjoint: this piece edits only the source-changed paragraphs [R79].
  - Whichever of the two merges later merges main in before its last gate run.
- **known-limitations-item-41-source-comment** (one line of `KNOWN-LIMITATIONS.md`). No shared path: this piece edits no KNOWN-LIMITATIONS item.
- **governance-cut-state-cap-and-rotation** (`state/CUT-STATE.md`, `scripts/hooks/flush.mjs`, the reading order, `state/cut-archive/`, an `AUTONOMY.md` append). No shared path.
- **shell-migration-milestone-3** (waits for #227; adds `e2e/command-bar.mjs` and edits `e2e/README.md`).
  - No shared entry in that file.
  - Its sweeps run this driver on the default and post routes, and read a failure of S5d alone as S5d's node [R91]. After this merges, the post route's S3 and S4 carry new ids, so the step lists before and after differ. The PR body says so.
- **Two other rule-00 checks.**
  - No piece in progress or awaiting merge touches `protocol/`, and this piece touches nothing there.
  - S5d's node is blocked on this one [R7]. Its step 2 is not run here (§2.9).

## §1. What this preregistration may and may not claim

- **No product change.** Nothing changes under `frontends/shell/src/**`, `frontends/shell/src-tauri/**`, `protocol/**`, `kernel/**` or `engine/**`. Every string the app shows stays as it is (P6).
- **No timing.** No measurement, no docs/08 row, and no duration (ADR-018). The values in §7 are bounds on waiting. H3 is ordering evidence.
- **Evidence class.** E2E-verified for the three routes. N6, N8 and Q1 are operator rows, queued and not judged here.
- **What the post route proves after this piece.**
  - A tile's mint succeeded.
  - The junction was repointed on that mint's `stream-issued` line.
  - The session then ended, and what the operator sees is unchanged (S5a to S5c).
  - S5d still asserts only its two conditions [R36].
- **What no post-route step claims.**
  - It does not claim which kernel route ended the session.
  - It does not claim the watcher stayed silent. That rests on §4's stderr readings (W8).
- **S5d's race is not judged here.** It is judged at S5d's step 2 [R18].
- **What the reopen route proves after this piece.**
  - The reopened generation survives a watcher-blind repoint while the app is idle.
  - The next query's pre-check refuses with `{mtime}`.
- **ADRs.** ADR-018 is cited. No ADR is amended.

## §2. The change

### 2.1 Every route: the junction layout

- **The layout runs for every route.** The pre route's layout (two copies `a` and `b`, the same bytes, `b` 120 s later; a junction to `a`) now runs whatever the route [R25, R27].
- **One open path.** `OPEN_PATH` is the junction path on every route [R24].
- **`SCRATCH_COPY`** is still copied and hashed before the run as the reference hash. No route opens it.
- **The final hash check** covers both copies on every route [R38].
- **A shared off-Windows guard.** A helper fails by name off Windows with S3's existing message [R29]. S3 (pre and reopen), S4 (post) and R4 call it before they repoint.

### 2.2 The post route

- **S3** keeps its INFO verdict. Its id becomes `S3-retarget-junction`, and its note becomes: deferred to S4 (POST route): repointed only after a mint succeeds.
- **S4.** Its id becomes `S4-issue-one-query-and-retarget-on-mint`.
  - Unchanged: the ladder, its bounds, the trigger (the first new `stream-issued` line), the 5 ms poll, and the stop rule [R31].
  - The touch helper [R26] becomes a repoint helper. It calls `makeJunction(TARGET_B)` synchronously on the trigger. On `EPERM` or `EACCES` it fails by name (I4).
  - After the ladder, S4 asserts that `realpathSync(OPEN_PATH)` resolves inside `TARGET_B`, and that both copies hash to the reference. Either check fails by name.
  - Its note: a stream-issued line followed the `<rung>` gesture (`<before>` -> `<after>`); the junction was repointed to b on that signal; both copies still hash to the fixture.
- **S5a, S5b and S5c** are unchanged.
- **S5d.** Its two conditions are unchanged [R36]. Two pieces of text change:
  - its pass note [R37] gets Appendix A.1's words;
  - in its refusal-failure message, the one word `touch` becomes `change`.
- **S5d's comment block [R35]** and every other word of its messages are left to S5d's own follow-on (S5d form §2 [R16]).

### 2.3 The reopen route

- **S1 to S5c** are the pre route's re-aimed steps [R10]. Each `ROUTE === "pre"` condition on S3, on S4's drag count, and on S4's pre-check line becomes `ROUTE !== "post"` [R29, R30].
- **R1** is unchanged. Its missing path is still derived from `SCRATCH_COPY` and has never existed [R32].
- **R2** reopens `OPEN_PATH`, the junction, which now points at `b`, instead of `SCRATCH_COPY` [R33]. Nothing else in R2 changes.
- **R3** is unchanged.
- **R4** [R34], in this order:
  1. Take a session-log baseline.
  2. Repoint the junction to `TARGET_A`, through the guard and the `EPERM`/`EACCES` naming.
  3. Assert that `realpathSync(OPEN_PATH)` resolves inside `TARGET_A`, and that both copies hash to the reference.
  4. **Idle check.** `waitForSettle` with `quietMs` 2000 and `timeoutMs` 30000. Then, if `.canvas-session-ended` is present, fail by name: `R4: .canvas-session-ended appeared while the app was idle after the repoint, before any gesture`.
  5. Pan `dragsToCrossDataset` drags, then settle with `quietMs` 3000 and `timeoutMs` 45000.
  6. Find a `tile-stream-mint-refused … engine.source_changed {"detail":"{mtime}"}` line since R4's baseline. If there is none, fail by name: `R4: no tile-stream-mint-refused line with engine.source_changed {"detail":"{mtime}"} since R4's baseline (line <n>); the pre-check did not refuse the query`.
  7. Run the existing session-ended assertion, unchanged.

  The note becomes: the junction was repointed to a; the session stayed up while idle; the next query's pre-check refused with {mtime}; .canvas-session-ended reproduced on the new generation.

### 2.4 The pre route

Its behaviour is unchanged. Its S3 and S4 code is now shared with the reopen route.

### 2.5 Comments

The following comments are rewritten to the junction repoint:
- the header's fixture note [R22], as Appendix A.4 gives it;
- the sentences in the post-check header that name the touch [R23];
- the route-constants comment [R24];
- the helper's doc comment [R26];
- the S3 and S4 comments [R29, R30, R31];
- the post S4 comment's sentence about the poll touching the file [R31].

The file stays pure ASCII. The dated recorded-mutation comments [R39, R40] are not edited.

### 2.6 Walkthrough (`frontends/shell/MANUAL-WALKTHROUGH.md`)

Appendix A.2 gives the replacement texts for:
- the Part N fixture row [R70];
- the Before-N1 scratch bullet [R75];
- N6 [R71];
- N8 [R72];
- the deviation note [R73];
- the sitting estimate [R74];
- Q1's cross-reference clause [R77].

N7 and N9 are unchanged, and no result log is edited [R76].

Every engine or shell string that a row quotes is byte-copied from its source at the branch base, never typed. Each such cite is pinned at that base and re-read (class 3 inside Scope). Each row names the commit its cites were read at.

### 2.7 e2e README

The source-changed paragraphs [R79] are replaced by Appendix A.3. The README's dated records are not edited.

### 2.8 Portability item (R3, [R90])

- **Owning boundary:** file watching (`engine/src/watch.rs`). It is exercised, not changed.
- **Windows:** the junction routes are exercised here.
- **macOS and Linux:**
  - the watcher is reduced to checks-only (KNOWN-LIMITATIONS item 24);
  - the shell e2e suites do not run there;
  - S3, the post S4 and R4 fail by name rather than skip;
  - N6 and N8 are marked Windows only.
- **Product code:** no `cfg` is added.

### 2.9 What S5d's step 2 inherits (for its amendment, under [R18] item 2; not written here)

- S5d's conditions and messages are unchanged, apart from the one word in §2.2. S4's trigger and poll are unchanged. So step 2 judges the same assertion on the same race, with the watcher removed from the route.
- §1.4's touch instant (S5d form F1, [R15]) has no source any more, because `b`'s mtime is set at layout time. H3 offers the junction's own creation time in its place.
- S5d form §1.5's class C2 [R15] would absorb H2's re-read detail. The amendment places that detail on its own.
- If the watcher's line appears in step 2, this piece's I1 has been found late. It is not S5d's O3.
- S5d failures seen in this piece's runs are recorded and counted toward nothing.

## §3. Fixtures — predicted outcomes

| Fixture | Predicted |
|---|---|
| copies `a` and `b` of the 100k fixture | hash-equal to the reference on every route, before and after each run; differ in mtime only |
| the 100k fixture itself | never opened; hash unchanged |

## §4. Tests, runs, and one observed mutation per new assertion

**The runs at the head.** The custodian runs them, alone, in one exclusive hold. While port 5180 stays excluded they use the port-5400 harness on its terms [R92], which the record discloses. Each run uses a fresh launch with `launched: true` [R78].

| Run | Count | Recorded per run |
|---|---|---|
| E-pre | 1 | steps' verdicts |
| E-reopen | 3 | steps' verdicts; R4's line |
| E-post | 8 | steps' verdicts; each watcher (W) and post-check (P) line in the stderr capture; every session-log line naming `tile-session-ended-source-changed` or `tile-stream-mint-refused` since the baseline; the junction's creation time against the first new `stream-issued` receipt (H3) |

The record is references and the byte-copied lines only. The machine rules apply: [R82] goes into every heavy-run brief as written, and a failure seen in a shared run is handled by [R83].

**Mutations.** Each is applied to test lines alone, run on the named route, recorded failing by name with the commit it was observed at, then reverted with the worktree shown clean. None is committed, pushed or left in place. A `verify-mutation` run is never called an observation [R89].

| # | Assertion | Route | Mutation | Predicted failure, by name |
|---|---|---|---|---|
| W-M1 | post S4 repoint | post | the repoint target `TARGET_B` → `TARGET_A` | `S4: the opened path resolves to …\a\…, not inside …\b`; S5a then fails: no `.canvas-session-ended` block |
| W-M2 | reopen S3/S4 (shared) | reopen | S3's repoint skipped | S3 fails its resolve check; S4 fails: no `tile-stream-mint-refused` line with `engine.source_changed` since the baseline |
| W-M3 | R4 repoint | reopen | R4's target `TARGET_A` → `TARGET_B` | `R4: the opened path resolves to …\b\…, not inside …\a` |
| W-M4 | R4 idle check (watcher-blind, by name) | reopen | R4's repoint replaced by an mtime touch of `b`'s copy, and R4's resolve expectation set to `b` | `R4: .canvas-session-ended appeared while the app was idle after the repoint, before any gesture` |
| W-M5 | R4 pre-check line | reopen | the expected detail `{mtime}` → `{size}` (a read-side stand-in) | `R4: no tile-stream-mint-refused line with engine.source_changed … since R4's baseline` |

**Suites:**
- the three routes above;
- CI's `node --test` scripts suite;
- `verify:plan`, `verify:cites` and `verify:quotes`;
- the file's ASCII scan [R23 region's note].

If `verify:cites` reports a cite into `source-changed.mjs` broken by this diff, the worker stops and reports. No frozen record is edited to fix it.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions.** A wrong prediction is a result, recorded as class 2, and never edited.
- **P1.** E-pre: every step passes.
- **P2.** E-reopen: every step passes in 3 of 3, R4's idle check and its `{mtime}` line among them.
- **P3.** E-post:
  - S1 to S5c pass in 8 of 8;
  - no capture holds the watcher's line (8 of 8);
  - every run whose S5d passes holds a P line.
  - S5d's verdicts are recorded, not predicted.
- **P4.** No refusal and no P line carries the detail that the source could not be re-read.
- **P5.** W-M1 to W-M5 each fail by the message §4 names.
- **P6.** H3: in 8 of 8 post runs, the junction's creation time is no earlier than the first new `stream-issued` receipt.

**Declared unchanged:**
- every product path in §1;
- `e2e/lib.mjs`;
- the pre route's behaviour;
- S2, S5a to S5c, R1 and R3;
- S5d's conditions, its comment block and its messages, apart from §2.2's one word;
- S4 post's trigger, poll, ladder and bounds;
- the report's field names;
- the dated comments [R39, R40];
- N7, N9 and every walkthrough result log;
- the README's dated records;
- `KNOWN-LIMITATIONS.md`;
- S5d's form and its step-1 record.

**Invalidators.** Each one stops the piece and goes to the human. None is worked around.
- **I1.** A watcher line in any capture of this piece's runs.
- **I2.** H2's re-read detail, anywhere.
- **I3.** A post run whose S5d passes with no P line, or whose S5d fails on its first condition after S4 passed.
- **I4.** The junction cannot be made or repointed without elevation.
- **I5.** Any step other than S5d fails in a solo run because of the product.
- **I6.** R4's idle check fails on the junction route.

**Falsification.** This form is wrong if the post and reopen routes cannot be moved to a watcher-blind change with a junction repoint without a product change.

## §6. Instruments

- **Assertions:** verdicts, resolved paths, hash equality, the presence of a DOM element, and the presence of a log line.
- **Evidence, not assertions:** the stderr W and P readings, and H3's ordering.
- **No measurement.**

## §7. Declared values and ceilings

| Value | Bounds or denotes |
|---|---|
| `B_MTIME_OFFSET_MS` = 120000 | `b`'s mtime offset, unchanged |
| R4 idle settle: `quietMs` 2000, `timeoutMs` 30000 | the wait before R4's idle check; S4's own settle values |
| R4 post-pan settle: `quietMs` 3000, `timeoutMs` 45000 | unchanged from R4 today |
| `LOG_LINE_POLL_BOUND_MS` = 10000 | R4's line wait, unchanged constant |
| run counts 1 / 3 / 8 | §4; chosen, not derived |

**Line budget.** Insertions plus deletions, counted by `git diff --numstat <merge-base>...<head>`. This form is excluded.

| File | Ceiling |
|---|---|
| `frontends/shell/e2e/source-changed.mjs` | 220 |
| `frontends/shell/e2e/README.md` (document) | 24 |
| `frontends/shell/MANUAL-WALKTHROUGH.md` (document) | 40 |

- Files: at most 6, counting this form, `PLAN.yaml` and the generated `CUSTODIAN-QUEUE.md`.
- An overrun is recorded as class 8, and this line is never edited.
- No new dependency.

## §8. Block-on-sight

1. Any edit under a product path in §1.
2. Any change to S5d's conditions, its comment block or its messages, apart from §2.2's one word.
3. Any change to S4 post's trigger, poll, ladder or bounds.
4. A recursive delete on a path that is, or contains, a junction. Any other link type. Any elevation or spawned `mklink` in the driver.
5. Copy hashes unequal anywhere.
6. A dated record edited: the recorded-mutation comments, README dated records, walkthrough result logs, or a frozen preregistration.
7. A walkthrough row stating a single message for N6's or N8's block (W5).
8. A string the app shows, changed.
9. A mutation committed, pushed or left in place.
10. A post-route failure seen in a shared run recorded as a failure.
11. An engine string in a row typed, not byte-copied.
12. A new dependency.

## §9. Gates

- **Proportional gates** [R84]. A gate fails only on Correctness or Evidence. A documentation finding is fixed in this PR before the merge.
- **Architect:** §1 to §8 one by one; ADR-018's vocabulary; the operation class (test-only, no undo surface); the seam to S5d's step 2 (§2.9).
- **Reviewer:** the whole diff; each block-on-sight item; every pin recomputed.
- **Suites:** those of §4, green before the gates.
- **Operator:** N6, N8 and Q1 are committed with blank result logs and queued for the next sitting.

## §10. Amendments — opens empty, append-only

## Appendix A — replacement texts (not the human's wording; the worker applies them; engine strings are ⟨placeholders⟩, filled by byte-copy)

**A.1 S5d's pass note** [R37]:
`"tile-session-ended-source-changed" present and no "tile-stream-mint-refused" since this run's own baseline -- a session ended and no tile mint refusal was logged; which kernel route ended the generation is not read by this step`

**A.2 Walkthrough.**

- **Fixture row.** `| 100k happy path, two copies of it opened through a junction | C:\dev\spatial-ide\target\fixtures\manual-walkthrough\100k-happy-path.parquet, copied to partN-targets\a and partN-targets\b before the sitting and opened through the junction partN-link (Before N1, below) | N6, N8 |` (each path in backticks, as the table writes them).
- **Before N1, replacing the scratch bullet.**
  - **The junction layout (Windows only):** before N6, run these once in PowerShell, with `$d` set to `C:\dev\spatial-ide\target\fixtures\manual-walkthrough`:
    - `New-Item -ItemType Directory -Force "$d\partN-targets\a","$d\partN-targets\b"`
    - `Copy-Item "$d\100k-happy-path.parquet" "$d\partN-targets\a\100k-scratch-partN.parquet"`
    - `Copy-Item "$d\100k-happy-path.parquet" "$d\partN-targets\b\100k-scratch-partN.parquet"`
    - `(Get-Item "$d\partN-targets\b\100k-scratch-partN.parquet").LastWriteTime = (Get-Date).AddMinutes(2)`
    - `New-Item -ItemType Junction -Path "$d\partN-link" -Target "$d\partN-targets\a"`
  - Below, `<link>` is `$d\partN-link` and `<targets>` is `$d\partN-targets`.
  - The two copies hold the same bytes and differ in modification time. N6 and N8 open `<link>\100k-scratch-partN.parquet`, and change the source only by repointing `<link>`.
  - A link left from an earlier sitting is removed with `cmd /c rmdir "<link>"`, which removes the link and never its target; never with `Remove-Item`.
  - If `New-Item -ItemType Junction` is refused, stop and report. Nothing is elevated.
- **N6, step.** **The T10 recipe, by hand, on a change the watcher cannot see** (Windows only; `frontends/shell/e2e/source-changed.mjs`'s default route, summarized in this row's own words, not quoted).
  - Click **Open GeoParquet…**. In the dialog's **File name** box, paste `<link>\100k-scratch-partN.parquet` and confirm, so that the file opens through the junction.
  - Let its first view settle: pan or zoom once so features are actually resident (Part A's A4 shows what "settled" looks like).
  - Then, in a terminal, repoint the junction from `a` to `b`: `cmd /c rmdir "<link>"`, then `New-Item -ItemType Junction -Path "<link>" -Target "<targets>\b"`.
  - Look at the canvas without touching it.
  - Then pan or zoom to an area CLEARLY outside what was already resident (not a small pan; that is N8), so that a fresh query is actually issued.
- **N6, expected outcome.**
  - **Before the far pan:** no `.canvas-session-ended` block appears. The watch covers the file's own folder, `a`, and the folder above it, and repointing the junction changes neither (KNOWN-LIMITATIONS item 26).
  - **After the far pan:** a `.canvas-session-ended` block appears in the attention strip above the map, rendered through `RefusalBlock` (⟨App.tsx pin, [R63] at base⟩). The canvas itself changes too: the current row's sentence on clearing, and its two named tests, are kept as they are.
  - The code chip reads `engine.source_changed`.
  - **The message is one of two.** Which one appears depends on which reaches the shell first: the refused query, or the kernel's session-ended event (⟨[R58] and [R62] pins⟩).
    - Either the engine's refusal, with `{detail}` filled `{mtime}`: *⟨SourceChanged's Display text, byte-copied from [R66]⟩*;
    - or *⟨the observed-change text after the code, byte-copied from [R61]⟩*, which names the watcher although the watcher did not end this session. That sentence is the placeholder the human noted for the sitting (the second message of 2026-10-17, item 6).
    - Record which message appeared, verbatim.
  - Below the message, the guidance reads *⟨byte-copied from [R67]⟩*, as the current row has it, with the current row's test cite re-pinned.
  - Neither the message nor the guidance carries a machine prefix beyond the code chip.
  - There is no dismiss control anywhere on this block (the current row's RefusalBlock cites, re-pinned).
  - Optional, record-only: the newest session log (Part M's M12 path) holds a `tile-stream-mint-refused` line with `engine.source_changed {"detail":"{mtime}"}` written after the far pan. That is the pre-check's own line.
- **N8, step.** **The small-pan/no-query limitation** (Windows only).
  - Reopen `<link>\100k-scratch-partN.parquet` fresh, exactly as N6 opened it: a full reopen, not a re-selection of N6/N7's refused state. It now resolves to copy `b`.
  - Let its first view settle exactly as N6 did.
  - Repoint the junction back to `a` with N6's two commands, with `a` in place of `b`.
  - This time pan only a SMALL amount, staying clearly INSIDE the area that is already resident (a short drag well within the visible field of parcels, nowhere near an edge).
  - Then, to close the row, pan further out past the resident edge.
- **N8, expected outcome.**
  - **After the repoint and the small pan:** nothing changes. No `.canvas-session-ended` block appears, the canvas keeps showing exactly what it showed before the pan, and hovering a still-visible feature still answers with its ordinary `id <number>` line, not the session-ended refusal.
  - This is not a missed detection. The repoint is a change the watcher cannot see (KNOWN-LIMITATIONS item 26). And it is `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` Amendment 11 (b)'s own finding (referenced by path, not quoted): a pan that stays inside the tiles already resident issues no fresh query, and the check that notices a changed source runs only against a query that is actually issued.
  - The current row's optional session-log check is kept.
  - **After panning further out:** the session-ended block appears again, with one of N6's two messages. That confirms the refusal DOES arrive once a query is actually issued, closing the row on an explained "nothing happened", not a silent one.
- **Deviation note.** **If anything deviates:** stop, record the exact step, and report it, the same as every earlier Part. The "nothing visibly happens" of N5, of N6 before its far pan, and of N8's small-pan step are the EXPECTED outcomes of those moments, not deviations. The deviation would be the OPPOSITE: an approval dialog opening at N5, or a session-ended block appearing before N6's far pan or after N8's small pan.
- **Sitting estimate**, its N6–N8 clause: one hand-mutation sequence spanning two separate opens and two junction repoints (N6–N8).
- **Q1**, its clause: This touches the modification time only and leaves the bytes untouched; it is a change the watcher sees, which Part N's N6 and N8 avoid by repointing a junction.

**A.3 e2e README** (replacing both source-changed paragraphs):
- **`source-changed.mjs`'s routes, and the change each makes.** Every route opens a copy of the 100k fixture through a directory junction (`e2e/out/source-changed-link`, made in-process with Node's `symlinkSync(.., "junction")`, no elevation) that points at copy `a`. It changes the source only by repointing the junction to copy `b`, which holds the same bytes with an mtime 120 s later. The advisory source watcher cannot see that change (KNOWN-LIMITATIONS item 26), so only a query's pre-check or a stream's post-check can find it.
- The default route repoints while the app is idle (S3). S4's query is then refused by the pre-check, and the session log's `tile-stream-mint-refused` line carrying `engine.source_changed` is asserted.
- `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` lets a tile's mint succeed against `a` and repoints on the first new `stream-issued` line, so the post-check can find the change when that tile's stream drains. Its S5d asserts a session-ended line and no `tile-stream-mint-refused` line since its baseline. It does not read which kernel route ended the session.
- `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=reopen` runs the default route through S5c, then reopens through the junction. R4 repoints the junction back to `a`: the session must stay up while the app idles, and the next query's pre-check line must follow.

**A.4 Header fixture note** [R22]:
`// THE FIXTURE (X-4). Copies of the 100k manual-walkthrough fixture, copied per run -- never the fixture itself: other E2E steps share that file and a change would end their sessions too. Every route opens copy a through a directory junction and changes the source by repointing the junction to copy b (the same bytes, mtime 120 s later), a change the advisory watcher cannot see (KNOWN-LIMITATIONS item 26). SCRATCH_COPY is still copied and hashed BEFORE and AFTER the run (section 8.8) as the reference; every copy must hash EQUAL to it, which proves no byte was edited.` (wrapped as comment lines, ASCII only).

## Appendix R — references (every hash computed by the custodian over whole committed lines, LF bytes; one span per pin)

| id | reference |
|---|---|
| R1 | `PLAN.yaml:4334-4350 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7dbff0bd47f6e88b01b1be856b7e0826923c06a15eee9a5811a1bffa8dd2261b` |
| R2 | `state/directives/2026-10-17-s5d-o3-ordered-watcher-visible-placed-unknown-attempt-open-1-2-a-flake-full-form-225-226.md:8 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e20ff87ed7f69c08c4be0310872059fb3e44bbfc006184ef6abd61d46036046f` |
| R3 | `state/directives/2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md:12 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0c76defc198618cebfacc6e7a802724796df1b61f23319c9b630bd6eed834011` |
| R4 | `state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:18 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7e716d0f89cdee35e83dc08940cf52b479ba0a45a23d417e3891bc7e48314a93` |
| R5 | `state/directives/2026-10-17-merges-223-224-w-approved-open-12-flake-s3-unknown-attempt-slot-1-s5d-route-a.md:20 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7ecaa7b961d197e1a3e9ff5ea0160f06640362c73612f063633b16aac3d2dcad` |
| R6 | `state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:10 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e4d340da46fa10c6ad5212c017c6a8da4d9712fccc4222bc366abd3bfd52cb8f` |
| R7 | `PLAN.yaml:5360-5376 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0f2f2b3550716c3021b66d85ec9a666aebfce5585cd703e74d7ed43ae5f3902e` |
| R8 | `state/consults/2026-10-09-e2e-stale-expectations-reaim-architect-draft.md:552-556 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:25446d356fbdc4cb83333b280cd6f198156455ca5a77c55ae7d9c6fad2e246af` |
| R9 | `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:174 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:3ff4e8aea6bdac0223a8a3ab27464587b262d9c616a536d3ccb9ec5888c26849` |
| R10 | `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:260-281 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e760e4934409d23b8a357089622cee792f29be99b35ce48ad7d9319bb0218fe0` |
| R11 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:16 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:b66b0bdbf8565716a4effd1a0a7234846149ed7499da0623fff972fd5bb952c4` |
| R12 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:20-23 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4deebb77455c4cc7d113515dbbb52888bd824cf39d4fb17fea6a347d067d97c5` |
| R13 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:24-31 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7070bac19c9169312b7b02f82b0ef82084658624c0cd2b989fd9d34f2a11c9ff` |
| R14 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:33-37 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:99da4ac0663579bd750dded05600aa0f3870cd885d3de0c666afb11507006902` |
| R15 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:60-83 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:cfaae974ede89808fb4d67c07dc8a376d30f45756aa989ecfe30202f85dd1396` |
| R16 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:114-122 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:d14632703bd01bc3ed9c4458ef1765bd5bf3ecd4b6afb52e874de9d39c10de2d` |
| R17 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:126 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:754df81ae621ba83b0e8aa03616acc7c793d44807a224abb1b3b12756e82763f` |
| R18 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:181-190 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:8ea63485729e1c7187fc395d5ffd2ed3b32abb13877e1b200a6d268e17c125bf` |
| R19 | `state/consults/2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md:63-105 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0a5b42d580fedba5626397a9f7084a49d63f86fb7c32d8e6bb8e8f1c4f29fb07` |
| R20 | `state/consults/2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md:198-203 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ab662d3422365919c093039a802db96ea658f719a43dbb3d557a90fc3e2cdb1d` |
| R21 | `state/consults/2026-10-17-source-changed-post-route-s5d-race-step-1-custodian-runs.md:1024-1041 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:3fdd20a33dcb066865eea09789ed5827254e0bdeca242101df5c0a0371ec261a` |
| R22 | `frontends/shell/e2e/source-changed.mjs:33-37 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:b7891d2c874eca435cb37268a51f069a7821ad52eb942b50e74c0e431b80b04a` |
| R23 | `frontends/shell/e2e/source-changed.mjs:144-186 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:732e89e9937f6cc1447fd1abfc5f5cecb369ff7d196f5e94a1f114ffe1f0d7e5` |
| R24 | `frontends/shell/e2e/source-changed.mjs:240-266 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:3ed7eaaa1775c16bcbf2b8f766f5027670f06193aeeff21ed737dfadb33e9ef9` |
| R25 | `frontends/shell/e2e/source-changed.mjs:268-288 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4636e07d0be8e1f9833a9fcac2617ad554a1c3a3cac251fd9f0c73f447b7d715` |
| R26 | `frontends/shell/e2e/source-changed.mjs:535-559 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0e7ca8c25e63c49ade1749624dd185d3cd17a08c60a88df8eafc1742c92a78a1` |
| R27 | `frontends/shell/e2e/source-changed.mjs:593-610 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:c12a5eb12cb58ae5bf195f0f047898ba642666947bd6e77dc3736a40b508cee8` |
| R28 | `frontends/shell/e2e/source-changed.mjs:830-837 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:400929baacc4368cd03e08dfb1c494f30ae18e615ce5f2e9d977daa342e272c8` |
| R29 | `frontends/shell/e2e/source-changed.mjs:839-884 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:254163cc6cffd4c42b883e63b4f543c8b1f4a17c34831555f935fb84cd033116` |
| R30 | `frontends/shell/e2e/source-changed.mjs:892-944 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5669a1d47c89e94f8be4bf7ee0370dbadae83a8784df1c448269574af451a76b` |
| R31 | `frontends/shell/e2e/source-changed.mjs:945-1019 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0f5e03eeab5e40889e1df9381b38928278aaf42ea1d61fe31c20bf1321751f40` |
| R32 | `frontends/shell/e2e/source-changed.mjs:1142 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:d8bc4f47de3a3ccf2ca9a3279836d0e3a321c37577466d25244d11a05819678d` |
| R33 | `frontends/shell/e2e/source-changed.mjs:1163-1166 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5e28d31f680c75de279e46406cb136230fb1c613d5ba4c0ceeeaa58eada6cead` |
| R34 | `frontends/shell/e2e/source-changed.mjs:1218-1233 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:06de139ab8c314fe0baf2a4f42b6f2517b1256b78f3de208fe2ff89651170b50` |
| R35 | `frontends/shell/e2e/source-changed.mjs:1236-1245 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:a0f0d4a039a876e55e204e8a4d34aac6d80aa103342ef5a92d449fbde1d6892c` |
| R36 | `frontends/shell/e2e/source-changed.mjs:1258-1279 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:bfbd54b64f66552743c13943382175eca089445b895ac49eb056a04d1105eab7` |
| R37 | `frontends/shell/e2e/source-changed.mjs:1280-1281 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:ef8ad66c0ac2aa579e546933c98bdcfb75edc6e4b9a3f03f4cfaf97730291101` |
| R38 | `frontends/shell/e2e/source-changed.mjs:1293-1307 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:53de5b1a30be657e4aea6af3d5408b55fc5169c7f89ff319a3f69c5264ab8802` |
| R39 | `frontends/shell/e2e/source-changed.mjs:490-496 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:1ddf13bd2569ab7f0cc97eb8ed48d2748d5fcd7b2998747c4065e7aaf8814377` |
| R40 | `frontends/shell/e2e/source-changed.mjs:1098-1137 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:144ae2fa4a4a3fd1720903b340bb96f117fb75464b644d299962a3fe83605174` |
| R41 | `engine/src/watch.rs:603-624 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:0bf44292a99a7c797395c1d43e9df30c19b2086b00bb43f02c3d7f24efb71dc2` |
| R42 | `engine/src/watch.rs:653-654 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:cd61973db67265d689af2c7e6af4715dd12e0e8838778870fc3a07429df836be` |
| R43 | `engine/src/watch.rs:671-699 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:5ce49dbc10aa13ef2b878c81ccc4b6d827446be40b0a2977949629c555bd8da2` |
| R44 | `engine/src/watch.rs:430-443 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:cd12e4ec0ebeba0e6473abbdaf364d3cefb0f28c9c3434cad2b48efcb43facab` |
| R45 | `kernel/src/skp.rs:911-926 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:2302d08d157183983177cd44240763048937ef5d46da0bcbdc37ccfab13324d1` |
| R46 | `kernel/src/skp.rs:1161-1168 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e3ae20f96dffe1206ab2c540b1324f2394f27306d91a21fa11af0efcd88f637a` |
| R47 | `kernel/src/skp.rs:1173 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:982efec03954a142d3bd12f3fb6487ad3d404df49a657f1e8ef108db726bf403` |
| R48 | `kernel/src/skp.rs:1449-1455 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e9c1fc2216056c966e6e70b08bd19c9fa03f628aebda3d4d58b133c7185fe810` |
| R49 | `kernel/src/skp.rs:1501-1505 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:9c1e1ce63923fcd9cac3c20b6b6b9e5f29fdfa6528895b0fa781f8a216386dbc` |
| R50 | `kernel/src/lib.rs:609-642 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4111cb95444af2ce761c64c3b9deddc352d3a93d23c6a774522b4cdb0c5b07a3` |
| R51 | `engine/src/stream.rs:1248-1249 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:63093882ccae854392f0d1f2cfac273a0333608e353372ad2a5e29f8d21d5b02` |
| R52 | `engine/src/stream.rs:1331-1332 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:a49f69180c6d719c056c85d48853583a48affdc73218a08fdb3a792d8a7569cb` |
| R53 | `engine/src/stream.rs:1733-1749 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4a15b40bdae92a4e1e243fe95cb890e024010355aefc9d812c79b79717d58c68` |
| R54 | `engine/src/dataset.rs:590 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:9518c3e1747f1c350624cc4a24706776d0376118000eb451ff6ca742b30545fe` |
| R55 | `engine/src/dataset.rs:630-632 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e11d5bdbe2c50cc078e9bcafed0917d7855e6b7f803d7c36e09c04d38f9e9702` |
| R56 | `frontends/shell/src/streaming/tileViewportStreamManager.ts:273-281 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:01228c06e775eba145887650d96a29c7ecb10f5eb3ac106aff3514e28b0fc408` |
| R57 | `frontends/shell/src/streaming/tileViewportStreamManager.ts:735-748 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:069236a63de40703cf4f021215af7af91172b0dab0fb256421d2f62d33f03f83` |
| R58 | `frontends/shell/src/streaming/tileViewportStreamManager.ts:940-958 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:69102175086e5de26012c7e96d1d3e5a230178401e1ef0b80b5f08cae52dc043` |
| R59 | `frontends/shell/src/streaming/tileViewportStreamManager.ts:1084-1086 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:8828c362759f77dcdee111efc09a2c53818ae48893865a6e1d34a41d0621a728` |
| R60 | `frontends/shell/src/streaming/tileViewportStreamManager.ts:1096-1099 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:10e9c7d63eb9df95c1ff31039dd27ec2f3183832632c2c429ece201a2d389435` |
| R61 | `frontends/shell/src/App.tsx:729-732 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:9d31ee575b2fcf26364a90bacce043989897940837d167bb8dbec7ed171e1185` |
| R62 | `frontends/shell/src/App.tsx:750-769 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:02ee2a656d80e43b011dc53bc497b8b6ff4ad836e4345aa140987f1fe164fc5a` |
| R63 | `frontends/shell/src/App.tsx:2170-2174 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:49042cd9a456e8d63971f95f873790346248448e7d7df28dce369186de70ff98` |
| R64 | `frontends/shell/src/streaming/formatTerminalRefusal.ts:33-45 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:38450f8b0f5253ab15004cd3042f2f3ddfa2b0799388e677ddb8065b06c299c9` |
| R65 | `frontends/shell/src/streaming/liveTicketSet.ts:97-99 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7e29737a4c570fdfb87379e4ea839667655355104b0a2fbbdf25051e057f1212` |
| R66 | `engine/src/error.rs:380-385 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:de466f1bb052884badf75dc68f04b0a4c5087aa5941af42238d5ddf51ccddf21` |
| R67 | `frontends/shell/src/admission/formatRefusal.ts:108-111 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:48df7e371e30c2f6348fdefef7f51b07a52c689fa481c0bd4c8023298abd1eaa` |
| R68 | `frontends/shell/e2e/residency-harness.mjs:171-175 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:a7d9abaaebe921a3442b8399d124be445d2a57e5c59fbb60bb57481ef5f3fce7` |
| R69 | `frontends/shell/e2e/lib.mjs:190-197 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:6497491ce455d2780b4b037f1b9905d51845b6a7db881f3b7f4573785c51d4b6` |
| R70 | `frontends/shell/MANUAL-WALKTHROUGH.md:937 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:a67571cd1dcaacb9a82bc4bbd610c98a524a324497c2ff8ee190481acdb555ab` |
| R71 | `frontends/shell/MANUAL-WALKTHROUGH.md:949 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e6a083351f48be7b27c6d8b37c5ecb4bdaf2861c62b552d481c763cb44953fa9` |
| R72 | `frontends/shell/MANUAL-WALKTHROUGH.md:951 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:754fb804e1897fc62bf1b3b5af45a21d69a0d5a378d01b11e04b50568e572e5d` |
| R73 | `frontends/shell/MANUAL-WALKTHROUGH.md:954-957 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:36386dccdd2f336971ba5f287923a43adde1fe0b73578b1e203c6b8f528bb74d` |
| R74 | `frontends/shell/MANUAL-WALKTHROUGH.md:959-962 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:32d5478c296522ea6aff65d7e8d5dc4ac61faa2be4d016cad37ac7566d844ef6` |
| R75 | `frontends/shell/MANUAL-WALKTHROUGH.md:972-976 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:163e91ebfa77fc969a2865c67e846543ea30e7c09284b7dbcb1411a112939967` |
| R76 | `frontends/shell/MANUAL-WALKTHROUGH.md:1421-1447 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e8ab035e2ff2eef650c50396a88c0eb058da42139e5521f1f0f27b16ce88ce70` |
| R77 | `frontends/shell/MANUAL-WALKTHROUGH.md:1508 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:1278834b4db2412e76e551d2f33906c1310314bd4fbcf8d36cb7b9ba17d52bff` |
| R78 | `frontends/shell/e2e/README.md:234-238 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:caedca9829dc9a3bbc5b3a9e141394ad976f25354744f43ea1d0385c62f3710d` |
| R79 | `frontends/shell/e2e/README.md:240-252 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:b42bbe4ce3cff8ff7f6c600d3d92d0277cd08da82be477b287a850afb8d29f4a` |
| R80 | `KNOWN-LIMITATIONS.md:278-286 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:c06fd07d2b098f848a1bbbcdbe407d16163a8e87689f080d5565d1ce3fa8da6b` |
| R81 | `KNOWN-LIMITATIONS.md:304-310 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:68b2f04be7b650dc27b52e15aeef4f1f7e3168081f286fc244e74c8156c7a23c` |
| R82 | `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1` |
| R83 | `state/directives/2026-10-06-machine-script-adopted.md:20 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:678460c8f7dfa9e08653c2371aa5c7ef6659eab4b081f4d05035a0cdee329e22` |
| R84 | `state/directives/2026-10-05-product-first-direction.md:15 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751` |
| R85 | `AUTONOMY.md:315-332 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3` |
| R86 | `AUTONOMY.md:347-357 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31` |
| R87 | `AUTONOMY.md:482 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669` |
| R88 | `docs/PREREGISTRATION-TEMPLATE.md:169 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716` |
| R89 | `docs/PREREGISTRATION-TEMPLATE.md:172 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2` |
| R90 | `docs/PREREGISTRATION-TEMPLATE.md:177 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0` |
| R91 | `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:763-764 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:e56d9d87e2d3d070f67bf17f6afb153c2bd15f5fdb81d8db7fa9c5398fb9e4e4` |
| R92 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:45 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:170010fd9b424c2db663c56bf522d4390fd986c63138382b336e4f02fe2089be` |
| R93 | `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md:139 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:557e2c24ff8df203cfd359fe40f666ed94b9faffe953ea52d24df1d45f17eeb0` |
| R94 | `frontends/shell/src/App.tsx:687-699 @ 28163cb6f30fd60681903ed1227cdf17c06abc0f sha256:46783dc729075210b794f7dbbe3aab86e6abe558ba3419cb8df0bb3e06f3b87f` |

### Amendment 1 — the human's ruling on OPEN-1 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-17-227-m1-watcher-visible-open-1-a-item-23-node-228-merged.md`, item 2), before any code. References only.*

1. **OPEN-1 (A):** one piece, N6 and N8 included, by this full form, with the reviewer and the architect gating from dispatch.
2. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — the custodian's §4 runs: I2 fired; the human's rulings on I2 and R2 (class 5)

*Written by the custodian on the human's ruling (`state/directives/2026-10-19-229-merged-rotation-230-ready-watcher-visible-i2-a-one-consult-r2-a-unknown-attempt-cause-a.md`, items 1 and 2). References only.*

1. **The worker-high's report** `state/consults/2026-10-18-source-changed-post-reopen-routes-watcher-visible-worker-report.md` (the head aa30f99f0cccc29a3df190e170d76b0eee40c5c6) and **the custodian's §4 runs** `state/consults/2026-10-18-source-changed-post-reopen-routes-watcher-visible-custodian-runs.md` (sha256 f64ded057fd3ddd83055fa468d086cf27ad5cde8068a0cfbce1ee5c1b9cd1820): P1, P5 and P6 held; P2 did not (R2 failed in 3 of 3); P4 did not, and I2 fired, H2's re-read detail in post1, post3, post6, post7, post8 and W-M1. The piece stopped by §5.
2. **I2: (A), bounded to one architect consult,** in the order and with the statement the ruling names. If it finds a gap-free way, §4's runs repeat at the new head. If it finds none, (B) with the ruling's one addition: a run in which a check reported that the source could not be re-read is INCONCLUSIVE for S5d, and S5d's step 2 judges the race on the runs without the gap.
3. **R2: (a).** After the reopen, R2 asserts that its readout equals S2's readout from before the change. The 2026-09-22 id expectation is superseded.
4. **Next:** the one architect consult; then one fresh brief for R2 and the consult's outcome; then §4's runs at the new head; then both gates.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — the one architect consult: IN PLACE; what the next round carries (class 3)

*Written by the custodian after the consult was filed. References only. The consult: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-i2-architect-consult.md`, sha256 7f7efe57fb20e741537c8c826f1eafad0ca2d6e58cc0b1b8666acf5e5b10f9e9 from line 5 to the end.*

1. **The outcome: IN PLACE.** The driver repoints by rewriting the existing junction's mount-point reparse data (`FSCTL_SET_REPARSE_POINT`), so the open path exists at every instant; the name in `out/` is never deleted. The mechanism is the consult's M6: one Windows PowerShell 5.1 child, spawned once after the layout, which compiles one P/Invoke class with Add-Type, takes one target per line on stdin and answers one line per target. The layout keeps its unlink and create, before anything is opened. The consult's 1(c) states why the watcher stays blind.
2. **§8 items 4 and 12, as the consult reads them:** no elevation, no `mklink`, no other link type; nothing added to `package.json`, the lockfile or the tree. PowerShell 5.1 and Add-Type are a new runtime requirement of the driver, named in its header and the README entry. The gates judge this reading.
3. **Words this changes** (the worker's, checked at the gates): A.3's "made in-process" and the driver comment's "no spawned tool", untrue of the repoint; §2.2's "synchronously on the trigger", which becomes: the request is written on the trigger and its answer awaited. The trigger, the 5 ms poll, the ladder and the bounds are unchanged (§8 item 3).
4. **A new assertion:** each repoint's answer is `ok`, and `realpathSync(OPEN_PATH)` then resolves inside the named target. Its mutation, W-M6, is made under §4's rule: the answer check removed, the child told a wrong target, the step failing by name.
5. **H3 and P6, re-aimed before the runs.** A rewrite keeps the junction's creation time, so H3 reads the junction's change time (`ctime`) instead. If `ctime` does not move with the rewrite, H3 is recorded as unread for that run, not as a failure.
6. **The probe, before any app run:** a second Node process stats and opens `OPEN_PATH` in a loop while the child rewrites the junction between `a` and `b`. One `os error 3`, or any failed open, is H2 again: I2, a STOP to the human.
7. **R2,** by Amendment 2 item 3, in the same round.
8. **For S5d's amendment, not written here:** §2.9's "the same race" holds for the trigger; when the repoint lands now follows a pipe round trip, neither bounded nor measured (ADR-018).
9. **§7:** the driver's ceiling stands; an overrun is class 8.
10. **Next:** one fresh brief for items 3 to 7; the probe; the custodian's §4 runs at the new head with W-M6, in one exclusive hold; then both gates.
11. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 4 — round 2's runs: every prediction held, no invalidator; §7's figures (class 8)

*Written by the custodian after round 2's runs were seen. References only. The round 2 report: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-worker-report.md`. The runs: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md`, sha256 dafd175c8ca29b898c00116456cd132d093964146c56e7651c5758e78b6d5682.*

1. **The runs at bf527c1e,** 19 in one exclusive hold: P1, P2 (R2 by Amendment 2 item 3), P3, P4, P5 with W-M6 and W-M7, and P6 on the junction's change time held. No invalidator fired, and the re-read detail appears in no run. The repoint child exited in every run, and none was left running.
2. **S5d's verdicts,** recorded and not predicted: PASS in 2 of 8 post runs, and FAIL in 6, each on its second condition, the change losing the race to a tile's pre-check. They are for S5d's step 2 (Amendment 3 item 8).
3. **§7 (class 8),** by the form's command at bf527c1e: the driver 363 against its 220; the README 18 against 24; the walkthrough 33 against 40. The driver's overrun is round 2's in-place repoint and its answer check (Amendment 3 items 1, 4 and 9).
4. **Next:** main merged into the branch; the PR; both gates (§9).
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 5 — budget overrun, §7 not edited (class 8), and record corrections (class 3); written after round 2's runs and gate 1

*References only. Gate 1: `state/consults/gates/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-architect.md` (gate-log 547) and `state/consults/gates/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-reviewer.md` (548), both PASS WITH NOTES; this is their D4. The words worker's report: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-words-worker-report.md`.*

1. **§7 (class 8),** by the form's command at b9a5780541a05cf94598e0218b8d3bba4e0ec1ba: `frontends/shell/e2e/source-changed.mjs` 375 against 220; the README 18 against 24; the walkthrough 33 against 40. The driver's overrun is Amendment 3 items 1, 4 and 9 (the in-place repoint and its answer check) and gate 1's comment words.
2. **The revs of the hashes (class 3).** Amendment 2 item 1's sha256 is of `state/consults/2026-10-18-source-changed-post-reopen-routes-watcher-visible-custodian-runs.md` @ 521fc031ed049fcda4a8c563aa1cd80799918ec9; Amendment 3's first line's, of `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-i2-architect-consult.md` from its line 5, @ 53b521067b6b52b3b5344cd931c4fbfeb51d70ad; Amendment 4's first line's, of `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md` @ bc2a987f28c7c90e07b043d65402bd910f35c22e.
3. **Amendment 3's class.** It was written after round 1's runs were seen (Amendment 2 item 1) and changes claims (its items 4 and 5): class 1, not class 3.
4. **W-M6 and W-M7.** W-M7 is declared in the round 2 worker report, before the runs. W-M6 was run telling the child the wrong target without removing the answer check: with the answer `ok` the check does nothing, so its failing lines are the realpath half. The answer check's non-`ok` branch is observed only in the round 2 worker's scratch error test, on bf527c1e's bytes.
5. **"Exists at every instant"** (Amendment 3 item 1) is the consult's R2, a reading no Windows document states. Its evidence is the round 2 worker's probe, the reviewer's own probe run at gate 1, and P4 of the round 2 runs. The words at the head say so (gate 1, the reviewer's D1).
6. **Gate 1's words** were applied at b9a5780541a05cf94598e0218b8d3bba4e0ec1ba by one worker, with no re-gate (§31 (d)). N6's row names the reviewer's case of a third text.
7. **For S5d's step 2** (Amendment 3 item 8): the architect's gate 1 seam notes (a) to (d), among them that a refused mint is logged even after the session has ended, so S5d's second condition can fail on a refusal that follows the end. S5d's amendment states them.
8. **Next:** the PR body's two sentences (the reviewer's D1 and D3), then ready, then the human's click.
9. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 6 — closing record: PR #231 merged

*Written by the custodian after the merge, on the human's message of 2026-10-20 (`state/directives/2026-10-20-230-231-233-merged-232-strikes-rule-d1-a-not-i1-profile-path-redact-unknown-attempt-a.md`). References only.*

1. **Merged** by the human at 2026-10-20T07:33:16Z, merge commit 6b829c08b0ffbe18919f36215b6969d0ff755e4d (two parents: main 3fa90769c735d0f5846e20110ec0f51b35a08ddb and the branch head b9a5780541a05cf94598e0218b8d3bba4e0ec1ba).
2. **The reports:**
   - round 1, the worker-high: `state/consults/2026-10-18-source-changed-post-reopen-routes-watcher-visible-worker-report.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 11f702c5e4b0afd641581d0c2247f877b192585032a437ae67bee7762e72f80e from its line 5;
   - the one I2 consult (Amendment 3): `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-i2-architect-consult.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 7f7efe57fb20e741537c8c826f1eafad0ca2d6e58cc0b1b8666acf5e5b10f9e9 from its line 5;
   - round 2: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-worker-report.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 a16744ffae5c48ae7f39cec6593771c95dcec13d898ebbe874b3fe4157af4fa5 from its line 5;
   - gate 1's words: `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-words-worker-report.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 76e74a73d596185491b8fdc8c493c7d09674172c32e5e495db8d29f456ee4496 from its line 5.
3. **The custodian's runs:**
   - round 1 (Amendment 2): `state/consults/2026-10-18-source-changed-post-reopen-routes-watcher-visible-custodian-runs.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 f64ded057fd3ddd83055fa468d086cf27ad5cde8068a0cfbce1ee5c1b9cd1820;
   - round 2 (Amendment 4): `state/consults/2026-10-19-source-changed-post-reopen-routes-watcher-visible-round-2-custodian-runs.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 dafd175c8ca29b898c00116456cd132d093964146c56e7651c5758e78b6d5682.
4. **Gate 1,** both PASS WITH NOTES (§9):
   - architect, gate-log 547: `state/consults/gates/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-architect.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 66c9af6036489219e1c1f49190e4c86fad41336137977c0fda2bc5d4a2b604dd;
   - reviewer, gate-log 548: `state/consults/gates/2026-10-19-source-changed-post-reopen-routes-watcher-visible-gate1-reviewer.md` @ feafb6b0f42e3893b9a508466760083db6b818bc, sha256 217ff56e6c3093295799900b7f2c1a291dc22621f114d5cfc71f9f215033c27e.
5. **Operator (§9):** N6, N8 and Q1 are on main with blank result logs, queued for the next sitting.
6. **For S5d's step 2:** §2.9, Amendment 3 item 8 and Amendment 5 item 7 (the architect's gate 1 seam notes (a) to (d)), stated in S5d's own amendment before its runs.
7. **PLAN:** the node is done, with `{pr: 231}`; `source-changed-post-route-s5d-race`, which depends on it, is ready.
8. **Generation:** the node's generation goes up by one.

Nothing above is edited.
