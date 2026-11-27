Reviewed: PR 359, branch cut/console-stream-lane at 4eae8c9ce481cdd14319c1adebe20dd18dd5ec0d, in its worktree C:/dev/wt/console67 (the custodian's filing note, 2026-11-22: the architect's build gate, part 1, node:console-stream-lane-limitation-67@gate-architect-1, dispatched at 2026-11-22T19:34:46.859Z; its run: Read 34, Grep 19, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T19:34:51Z to 2026-11-22T19:49:14Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 17026 bytes, sha256 9c702a9595f2a09e09bc84dea5019675328da8c6839e8316faaede1b13716ad0, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. FAIL: one Evidence finding (E1, a check section 6 declares missing from MEASURE prime); D1 to D8 Documentation; K2's clause on a load sent to the advisor unreworded, by ADV-2026-11-22-30 item 5.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/console67 @ 4eae8c9ce481cdd14319c1adebe20dd18dd5ec0d
REPORT PATH: state/consults/gates/2026-11-22-console-stream-lane-build-gate-architect.md
Branch: cut/console-stream-lane. Base B 1f72b1f76101fa25a359bbaa58272c1223e5ae96. Line cites are at 4eae8c9c unless marked B. This is part 1 of the gate; rule W against MEASURE's JSON comes in part 2.

**Summary.** The product code is correct. All four seams are written against the interfaces each side really has. E-AND and GROUP' follow §2.5 and Amendment 1 C1 exactly. There is one Evidence finding, in MEASURE', a one-line fix whose re-read can be narrow. Eight Documentation findings must be fixed before the merge. One K2 clause goes to the advisor, unreworded.

## Evidence (blocking)

**E1. A check §6 declares is missing from MEASURE'.** §6 says MEASURE' asserts "that Δtotal > 0 when settled". `measureRun` (`e2e/console.mjs:959-969`) has no such check: a grep finds no test on `p1.total - p0.total`. A settled run that added nothing passes `measureReadAfterP1` with a = the reading's own toggles and L = a, and goes into the JSON as `streamAdded: 0`. This changes what the code does, so §31 does not cover it. Fix: after the `p1.count === null` check (`:965`), fail by name, S7-style, when `p1.total - p0.total <= 0` on a settled run. The re-read can be narrow.

## Correctness

None.

**§8, item by item:**
1. Thirteen paths changed, none of them outside §7.
2. `laneOf` (`recorder.ts:317-326`) chooses the lane from kind and name only.
3. Each eviction is counted against its own ring (`:338-347`), and the label shows both counts.
4. Every new export has a product caller. The caller rule is below.
5. Only the edits §4 names, and no literal ring size. VL2's 256 is a held count that §4 gives.
6. The only shown string changed is the label, and its text equals L1. It carries no mark.
7. Not yet: item 67 is commit 4.
8. CC2 is present. E-AND and GROUP' decide only after their eviction checks.
9. No dependency, lockfile or workflow change.
10. No line was found cut or packed to fit. 819 < 850 by the worker's numstat; the reviewer recounts.
11. W1 to W3 are byte-equal to Amendment 1 D1 and §2.4. For StylePanel, see Grep below.
12. No round-25 item is triggered.
13. See Records below.

**Seams.** Each was read against its actual interface at B and at the head.
- **Recorder to registry.** Interface: `classARows`/`classBRows` and `row.command`, plus the new `lane` and `isStreamLaneName(kind, name)`. The names arrive as literals from `skp/client.ts:119`, `:133` and `diagnostics/log.ts:21`. CL5 records each name through the recorder's own three capture methods, the ones `client.ts` and `recordNamed` use. SR1 reads the real registry.
- **Recorder to count sync.** `CountableRecorder.droppedCount(lane)` is met structurally by `ConsoleRecorder`. CC2 runs against a real recorder.
- **Snapshot to label.** Both `ConsolePanel` branches build `{count, droppedStream, droppedOther}` (`:47`, `:52-56`). VL1 and VL2 test the function; LABEL' tests the real app. LABEL' is not run yet (§9.3).
- **Label to the e2e readers.** The disclosure's textContent is `"▾ " + label` (`ConsolePanel.tsx:85`). The parsers at `console.mjs:245`, `:896` and `command-bar.mjs:379` are anchored only at the end, so they match `consoleLabelText` exactly, em dash included. No other suite parses the label: `reopen.mjs:146` only prints it. The proof from the real shape is the tester's runs.

**§2.5 as built** (`command-bar.mjs:465`, `:484-509`), against ADV-2026-11-22-20 item 1's sentence:
- **F1** is unchanged (`:465`).
- **F6** (`:493`) and **F7** (`:494`) come in the form's order.
- **F2′** (`:496`) is checked on every reading, before the discard test. That is sound because ΔO ≤ N₀ − M ⟺ a ≤ M once S₀ > 0.
- **PASS** (`:500-502`) only when exactly one `filter:`+ZONE_AB row at ok is among the last L rows of a kept reading that clicked nothing.
- **F4** (`:504`, `:507`) when the newest added row is past pending, or at timeout with n = 0.
- **F3′** (`:506`, `:508`) as in Amendment 1 D3.
- The texts equal §2.5's. The PASS text adds dS, a, L and streamBefore, which E1 of Amendment 1 requires.
- Nowhere can it pass where it cannot tell.

**The ordinary-state sentence** (ADV-2026-11-22-24 item 1). Nothing in the rule fails by construction with the other ring full: PASS needs a ≤ 128, and §2.5's bound argues it. A failure of the unmutated step is S11.

**GROUP' as built** (`console.mjs:739-750`) equals C1. Its meaning holds:
- If R ≤ M, each ring still holds all of its kind recorded since the baseline.
- Otherwise, each ring held at least N_base − M at the baseline, so drops within that remove only rows that predate it.
- W1 states the check correctly.

## Mutations

- **Named sets.** No listed mutation has a known pass case.
- **M-G1.** It always fails: R ≥ 200 > M, and ΔO > N_base − M in every state of the other ring. The capacity check (`:747`) runs before the presence check (`:753`).
- **M-CB1** gives F2′ whenever S₀ > 0.
- **M-CB2's drop sentence** (Amendment 1 D2) is true as a conditional. With ΔS, ΔO ≤ 128, L′ = ΔN + ΔS + ΔO = L. F2′ and F7 cannot fire under either order.
- **VL2 under M-11** fails on every run.
- **M-CB3, a note for the tester.** Card B's AND view is empty, so card B's load may add fewer than M stream entries. Then the untiled `viewport_query`, recorded before the `record_step`, is still held, and streamBefore ≥ 1. By E1 of Amendment 1, M-CB3 then goes to the advisor rather than being run as evidence.
- **Failures outside the named sets** (M-1, M-2, M-4, M-5, M-10). These were to be expected by construction:
  - M-1 restores a single ring of M, so every lane test that was red at the single-ring base fails again: CL2, CL3, CL4 and CL5.
  - M-2 evicts once both rings together hold M: CL1 (count, stream drops) and CL3 (O₀ evicted).
  - M-4 breaks every assertion on stream drops: CL1, CL2, CL4 and CL5.
  - M-5 puts cancels in the other ring: CL2, CL4 and CL5.
  - M-10 also fails the edited "reflects droppedCount()" test (`setDropped("other", 3)`).
  - Each named test fails by its own line, so the evidence stands. By §4's letter each is still a class 2 finding.
- **The runs covered one file each.** Every `c67-m-*.txt` run was of the named test's file only (vitest: "Test Files 1"). So "none outside" means none in that file. By reading, M-6 also fails CL4 and CL5 in `recorder.test.ts`, because `describe` is then a stream name. M-3 may fail VL3 or VL3′, depending on the order of the concatenation.
- **What the closing amendment must record:**
  - each mutation's extra failing tests and their lines, as class 2, expected by construction;
  - that the outside-set reading covered the named file only;
  - it must not state "no failure outside the set" without that qualifier;
  - the reviewer's re-make (§9.2) should run the whole `src/console` set under each mutation.

## Caller rule

- `isStreamLaneName` is called by `ConsoleRecorder.push` through `laneOf`.
- `consoleLabelText` is called by `ConsolePanel`.
- `ConsoleLane` is used by `collapsedCountSync.ts`.
- `droppedCount(lane)` is called by `collapsedCountSync.ts` and `ConsolePanel.tsx`.
- No item has only a test caller.

## Words, clause by clause, against the built code

- **L1** is true at the head. N is `count()`, D = S + O, stream comes first, both counts show when D > 0, and it states no ring size.
- **K1** is true: CL1, CL2 and `laneOf`.
- **K2** is true at the head clause by clause, except the one sentence ADV-2026-11-22-30 item 5 names. That sentence goes to the advisor, unreworded:
  - **The clause:** "A load drops none of the other entries".
  - **The code:** `push` and `laneOf` keep a load's stream entries out of the other ring (CL1).
  - **An Apply or a Clear.** Its `record_step` is recorded after its untiled request is issued, so while its load runs (Amendment 1 E1's reading). With the other ring full, which is the ordinary state, that entry drops the oldest other entry.
  - **An open.** Its `close_dataset` comes from a workspace effect at a time the code does not fix against the load.
  - **The load itself.** `binding_data_plane_attach` is recorded once per process inside the first stream's start (`streaming/dataPlaneClient.ts:22-27`), so by the process's first load. It drops an other entry only if the other ring already holds 128 before the first open.
  - The next clause ("stay until 128 newer entries of their own kind are recorded") is true of all of these. Read as "an open, an Apply or a Clear and its load", the head clause is untrue in the ordinary state.
- **Rule W's sentence** (part 2, to the advisor). `measureRun` sets the page viewport (`page.setViewportSize`) and checks `innerWidth × innerHeight`. It does not set the app window's size. The sentence's "in a window ⟨w⟩ by ⟨h⟩ pixels" is to be read against that fact.
- **R1 and R2** are true. `takeSlot` returns the slot without calling `pick` (`AdmissionPanel.tsx:295-300`). `handlePick` calls `pickFile` with no slot (`:377-378`). The hooks are installed only in an instrumented build (`:446`). R2 carries ADV-2026-11-22-30 item 4.
- **W1** is true of the check above. **W2 and W3** are true: `reopen.mjs` reads only `close_dataset` and `open_project` rows, which are of the other kind.
- **K3**: findings D6 and D7.

## Constitution

- **docs/01 principle 4:** improved, since steps are no longer pushed out by a load.
- **Principle 7 and "Never block the canvas":**
  - `push` is bounded and synchronous.
  - The open drawer renders at most 2M = 256 entries, as at B.
  - `isStreamLaneName` filters the registry on each record, a few dozen rows. This is no docs/08 risk.
- **docs/02 and docs/10:** the change stays within `console/` and the e2e files; no wire change.
- **ADR-024:** names only; `lane` is a string literal.
- **ADR-006:** not engaged, since this is view state.
- **Round 25:** no item is triggered.

## Grep for ring sizes (`site/**` included)

- The only statements of 256 left are `KNOWN-LIMITATIONS.md:525-527`, item 67 itself, which commit 4 replaces.
- **`frontends/shell/src/style/StylePanel.tsx:132`** is in the past tense ("was evicting the console's 256-entry ring") and is true as history. It is not untrue under §8 item 11, and it is outside the fourteen files, so editing it here would be S4 or class 9. This piece must not change it. It is not a stop; at most a docs-lane "then".

## Records

- The one new quotation, `"The reading after P1"` (`console.mjs:891`), matches the text in Amendment 1's §6.
- No line cite into the ledger.
- The source comments' cites (ADV ids, the form's path, item 64) hold on main.

## Documentation (must be fixed before the merge; none of these is the human's or the advisor's wording)

**D1. `console.mjs:38-40`:** "only ever opens a dataset once" is untrue now that LABEL' and MEASURE' open files.
```text
// --nocapture`. Reused for every step below: NEXT-CUT.md's "one-click-two-commands" truth (TWOCMD')
// is about ONE openPath call producing two class-A entries, so this suite only ever opens a dataset
// once.
```
```text
// --nocapture`. Reused for every step below: NEXT-CUT.md's "one-click-two-commands" truth (TWOCMD')
// is about ONE openPath call producing two class-A entries, so the steps before LABEL' share one open.
// LABEL' opens the file again; the opt-in MEASURE' opens it up to three times to warm up, then it and
// `100k-happy-path.parquet` once per run.
```
Checked: `stepLabel` `:854`; the warm-up `:985-990`; `measureRun` `:957` over both datasets `:992`.

**D2. "the form" in `console.mjs` names no form.** The file elsewhere names forms by file.
```text
// MEASURE' (known limitation 67; the form's section 6): what one first look adds to each ring, by dataset and window.
```
```text
// MEASURE' (known limitation 67; section 6 of the Console form, governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md, which the form means below): what one first look adds to each ring, by dataset and window.
```
```text
(the form's M-11)
```
```text
(M-11 of the Console form, governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md)
```

**D3. `console.mjs:935`:** the count stop restates step 2's condition, which is known false at this branch.
```text
${r.o2 - o0} entries of the other kind were dropped after P0, more than the ${n0 - M} the other ring held then, or their count ${names.length} is not ${r.a} (P0:
```
```text
${names.length} entries of the other kind are among the newest ${r.L}, not the ${r.a} recorded after P0 (P0:
```
Checked: `names` comes from the last L rows; a = (N₂ − N₀) + (O₂ − O₀).

**D4. `console.mjs:750`:** GROUP's PASS text in the R ≤ M branch omits ΔS and ΔO, which Amendment 1 D5 requires. Fix before the tester's run.
```text
? `R=${R} <= ${MAX_CONSOLE_ENTRIES}` :
```
```text
? `R=${R} <= ${MAX_CONSOLE_ENTRIES}; the drops since the baseline, ${dropS} of the stream kind and ${dropO} of the other` :
```

**D5. `console.mjs:740`:** a label-parse failure carries M-G1's set prefix `GROUP': capacity:`, so it could stand as M-G1's evidence. The other way to close this is for the tester to record M-G1's line through "entries were recorded since the baseline".
```text
`GROUP': capacity: the Console's label did not parse
```
```text
`GROUP': label: the Console's label did not parse
```

**D6. `recorder.ts:159-162`:** the comment drops the commit at which the advisor read the code, and puts the report's path in "the commit" where K3 requires the comment to carry it.
```text
 * is not a bound. Each terminal is one session-log write and follows one request, so the entries were at
 * least 220: the advisor's reading of the code, not a count from a run. The figure item 67 gives for what
 * one first look adds comes from MEASURE' in e2e/console.mjs; the commit that sets item 67's words names
 * that report's path and commit. Not examined: how many entries a cancelled tile request adds.
```
```text
 * is not a bound. Each terminal is one session-log write and follows one request, so the entries were at
 * least 220: the advisor's reading of the code at e374eb711caaeae4dd898e8ddb49a35d4d80c619, not a count
 * from a run. The figure item 67 gives for what one first look adds comes from MEASURE' in
 * e2e/console.mjs; item 67's comment in KNOWN-LIMITATIONS.md names that report's path and commit.
 * Not examined: how many entries a cancelled tile request adds.
```
Checked: the e374 pin is the one at `KNOWN-LIMITATIONS.md:527`. The last clause becomes true only with commit 4, and the merge check must confirm it.

**D7. K3 is built in the wrong place.** K3 is item 67's comment, but it was built as a block in `recorder.ts:135-163`, while `KNOWN-LIMITATIONS.md:527` still says "the 256". Commit 4 must write K3 into item 67's comment, keeping three things:
- the existing 110-tile history (the diagnosis path, the e374 pin, the A1 and A2 correction sentence);
- the clause "a tile already held, cut from the plan or dropped from the queue gets none";
- the MEASURE' report's path and commit.

**D8. What the closing amendment must record:**
- the mutation record above;
- that the edited eviction test was red at B under `tsc` only, not under vitest (the worker's finding);
- the second mirror, `MAX_CONSOLE_ENTRIES = 128` at `command-bar.mjs:377`, which §7 does not list (not class 9: the file is in scope, and §2.5 needs M);
- that no e2e was run by the worker;
- the margin under §7's 850, with commit 4 and these fixes still to add; an overrun is class 8.

No decision is missing, so no ADR skeleton.

**Files read:**
- The form and its six rulings, in C:/dev/wt/read-1122:
  - governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md
  - state/directives/ for ADV-2026-11-22-20, -22, -24, -26, -28 and -30
- `<S>/brief-console-arch-gate-1.md`, `<S>/console-diff-4eae8c9c.txt`, `<S>/console-build-1-report.md`, `<S>/c67-m-summary.txt`, `<S>/c67-m-M-3.txt`, `<S>/c67-m-M-6.txt`
- docs/01_Principles.md (C:/dev/wt/read-1122)
- At the head, in C:/dev/wt/console67:
  - frontends/shell/src/console/recorder.ts, surfaceRegistry.ts, ConsolePanel.tsx and consoleViewModel.ts (150-205)
  - frontends/shell/src/streaming/dataPlaneClient.ts
  - frontends/shell/src/skp/dialog.ts
  - frontends/shell/src/admission/AdmissionPanel.tsx (293-300, by grep)
  - frontends/shell/src/style/StylePanel.tsx (122-139)
  - frontends/shell/e2e/command-bar.mjs (340-511)
  - frontends/shell/e2e/console.mjs (1-45, 180-279, 680-850, 1170-1287)
  - frontends/shell/e2e/layout.mjs (240-261)
  - frontends/shell/e2e/colour.mjs (310-349)
  - KNOWN-LIMITATIONS.md (520-529)
  - frontends/shell/src (by grep): skp/client.ts, diagnostics/log.ts, residency/candidateArmSession.ts, streaming/tileViewportStreamManager.ts, e2e-test-surface.ts, App.tsx
  - frontends/shell/e2e/*.mjs and lib.mjs (by grep)
  - the tree, `site/**` included (grep for ring sizes)

Model: claude-opus-5-5
