Reviewed: PR 359, the branch cut/console-stream-lane at 12251bc8850127b72a9fb2b5fce63c33ef2d7075, in C:/dev/wt/console67, with the records in the detached read worktree C:/dev/wt/read-1122 at 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14 (the custodian's filing note, 2026-11-22: the architect's build gate part 2, node:console-stream-lane-limitation-67@gate-architect-part-2-1, reading the e2e series' three mutation findings and rule W's window words, with the three points the advisor gave for its brief; dispatched at 2026-11-22T23:09:12Z; its run: Grep 23, Read 24, Glob 9, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T23:09:15Z to 2026-11-22T23:21:14Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 19571 bytes, sha256 e3aeb2950209f7f86f81a82d289a2aed0ff2288a175177ab13a9ebbf72cd66db, byte for byte, nothing masked, with one final newline added. FAIL on Evidence only, E1 to E4, with no product fault behind any of the three findings; D1 and D2 are must-fix. The e2e tester's report it reads is filed at state/consults/2026-11-22-console-stream-lane-e2e-series-tester-reports.md. It goes to the advisor, who rules from this filed text.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/console67 @ 12251bc8850127b72a9fb2b5fce63c33ef2d7075
REPORT PATH: state/consults/gates/2026-11-22-console-stream-lane-build-gate-architect-part-2.md

Records read at main 4fa8070fbb44bbc6d9e349375d0d13b66e66dd14 (`C:/dev/wt/read-1122`). Every code cite below is a reading aid at 12251bc8850127b72a9fb2b5fce63c33ef2d7075 unless marked otherwise. FAIL is on Evidence only. Nothing here is a Correctness finding against product code.

## 0. The tester's reading

**No product fault lies behind any of the three findings.** Nothing goes to the advisor at once under ADV-2026-11-21-15 item 7.

- **M-CB3 (run 5).** "A fault of the form's mutation text, not the product" holds. But the state is misnamed. The tester calls O = 0 at both readings "the ordinary state". The form's ordinary state is the other ring full at R0. The run is not in that state (see 1).
- **M-G1 and M-CB1 (runs 2 and 4).** "Not the product" holds. The tester's mechanism is wrong. The tester says "the 200 toggling clicks collapse the Console, and the button then stops being clickable". In fact no click landed (see 2).
  - The tester's run-2 note that FIND' "may follow from the same collapsed Console" is also wrong. GROUP' threw after its Style-tab click (`console.mjs:719`) and before its Layer-tab click (`:730`). That left the Inspector on its Style tab, so regression's FIND' could not see `input.filter-predicate`. REGRESS' failed with it.

## 1. M-CB3 passed (run 5)

- **The pass is real.** Runs 3 and 5 read the same values. Both labels at R0 are `153 actions (545 dropped: 545 …; 0 of other entries)`, and at R1 `155 actions (768 dropped: 768 …; 0 …)`. Both have dS=223, a=2, L=130, and held stream entries before the step = 0.
  - With O₀ = O₁ = 0, reading `droppedOther` as 0 changes no value E-AND reads. a, L, the window and the decision are the same.
  - So the run passes whether or not the mutation was applied. Run 5's report gives no applied-diff proof; only M-X2 has a `cmp`. The conclusion does not depend on it.
- **The run is not in the ordinary state.** N₀ = 153 with S₀ > 0, so the stream ring holds 128 and the other ring held 25 of 128 at R0. It had dropped none, and dropped none by R1.
  - Run 3, the unmutated twin, is in the same state.
  - Console run 1 is the same: LABEL' reads `162 actions … 0 of other entries`, and GROUP' reads R=9 with 0 drops of either kind.
  - The other ring is never full in either suite.
- **E1 cannot hold.** The step that fails is "a reads N₁ − N₀ (0 in the ordinary state, both rings full)". It takes the ordinary state as the state the suite runs in. The mutation only bites when the true ΔO > 0 between R0 and R1. That needs the other ring full at R0 or filling before R1. That never happens here. E1's build check (held stream entries before the step) tested the argument's other premise only.
- **What the reading missed, in one line:** a mutation that replaces a value with a constant shows nothing in any run where the value already equals that constant. A no-pass-case claim must name the recorded run in which the mutated value differs from the true one (here O₁ − O₀ > 0), not the state the form calls ordinary.
- **Choice: the set-up (ADV-2026-11-22-26 item 2, first way).** A fill of the other ring before R0 goes into the unmutated E-AND. Then the unmutated run shows ADV-2026-11-22-24 item 1's sentence, which run 3 does not, and M-CB3 differs from it by the mutation alone.
  - This is test code in `command-bar.mjs` (in Scope). It needs the advisor, a §7 recount (class 8 if over), the reviewer's narrow read, and the e2e rows run again at the new head. The fill changes the unmutated step, so that includes M-A4-1, M-A4-3 and M-X2.
  - **The arithmetic under the fill:**
    - The other ring holds h + 128 ≥ M entries, so it holds M at R0. With S₀ > 0 the stream ring holds M too. So N₀ = 2M.
    - **Unmutated:** ΔO = a. It passes for a ≤ 128, under §2.5's bound.
    - **Under M-CB3:** a reads 0 and L = min(M, ΔS), so the window is the newest M of all held entries. Card B's `record_step` is outside it when at least M held entries are newer than it. That holds when ΔS ≥ M and no held stream entry recorded after R0 is older than the step. Run 3 shows both: ΔS = 223, and 0 such entries.
    - Then added is empty, F2′ (0 ≤ 128) and F7 (S₀ > 0) are not reached, and after 30 s E-AND fails with F4, n = 0 (`command-bar.mjs:507`, `:489`).

## 2. M-G1 and M-CB1 (runs 2 and 4)

- **What the clicks did: none landed.**
  - `.console-disclosure` sits in `section[aria-label="Activity"]`. That region is closed by default (`frontends/shell/src/layout/layoutState.ts:51`; `hidden` at `StudioLayout.tsx:435`). `console.mjs` never opens it. `command-bar.mjs`'s E-CTRLK opens it with Ctrl+J for its own counts and closes it again (`:157`, `:176`).
  - The inserted `page.click` waits for a visible element, so the first click retried for 30 s and timed out.
  - **The proof from run 4:** the call log resolved the button with `aria-expanded="true"` and the label `153 actions (545 dropped: 545 of data…`. That is R0's label exactly. One landed click would have recorded an entry (`ConsolePanel.tsx:80`), making 154 actions, and flipped the drawer (`:81`).
  - The step times fit a single 30 s timeout: 33 s for GROUP' and 42 s for E-AND.
  - **What 200 clicks would do if they landed:** each records one `console.togglePanelExpanded` entry of the other kind and flips the drawer. 200 is even, so the drawer ends as it started.
- **The form should have foreseen this.** Every Console click in both suites is a DOM `.click()` inside `page.evaluate`:
  - `console.mjs:159-171` and `:204-209`;
  - `command-bar.mjs:123`, `:355-359` and `:385-386`.

  The form wrote "200 clicks" without saying how they are sent. §2.1 did not list the Activity region's default. The form gates and part 1 missed it.
- **No unmutated step rests on the same assumption.** The suites' `page.click` and `page.fill` calls touch only the Inspector, the Filter section, the bar and the tool switch, all open by default (`layoutState.ts:49-50`). These are `console.mjs:719`, `:728` and `:730`, and the `command-bar.mjs` lines from `:146` to `:614`.
- **Texts that reach the sets every time** (below; test code only):
  - **M-G1.** h_o is what the other ring holds at the baseline, and room = N_base − M ≤ h_o. With 200 DOM clicks, dropO ≥ h_o + 203 − M > room, and R ≥ 203 > M.
    - The label check (`:740`) passes, since the product's label always parses. Then the capacity check (`:746-750`) throws before the presence check (`:754`).
    - After the fill loop the Layer tab is clicked (`:730`), so there is no knock-on to FIND'.
    - The time fits the 45 s step bound (`:1241-1242`; the poll's bound is 5000 ms, `:72`).
  - **M-CB1.** a ≥ 200 > M ≥ N₀ − M, so F2′ (`:496`) is thrown at the first kept reading, with or without the fill.
- GROUP' and F2′ need nothing more.

## 3. The other runs

- **Runs 6 to 8 failed in their sets.**
  - Run 6 (M-A4-1) failed at card A's wait line (`:464`).
  - Run 7 (M-A4-3) failed with F4, n = 2, both rows the combined text.
  - Run 8 (M-X2) failed with F4, n = 2: A's text, then the combined text.
- **Runs 1, 3 and 9 to 11 passed.**
- **Run 12** failed PC-E1 in 1 ms on a missing input. That was a failed e2e row, so S6 was reached, and its record stays.
- **Run 12b** is at the head, through the suite's own launch, and passes 4 of 4, PC-E4 included (ADV-2026-11-22-26 item 4).
  - It meets §9.3's table row only once the oracle's source is shown. `table.mjs:8-10` requires the generator's printed `zone_counts`, run by the tester into its own folder, with a sha256 equal to the shared copy's. Report 2 hashes only the shared copy, and does not say where `[402, 392, 389, 421]` came from (E4).
  - Whether S6 is closed is the advisor's call. Run 12b does not erase run 12.

## 4. Rule W's window words (ADV-2026-11-22-36 item 3)

Both phrases stand in §6, rule W step 4. Neither amendment changes them. They are the advisor's wording under the delegation, not the human's, and they go to the advisor.

```text
in a window ⟨w⟩ by ⟨h⟩ pixels
```

```text
with the page the app draws in set by the test to ⟨w⟩ by ⟨h⟩ pixels
```

```text
at the app's own window size, 1280 by 800
```

```text
with the page set to 1280 by 800, the content area the app's window asks for when it opens, at 100% display scaling
```

**Clause check (both phrases):**
- **What the measurement sets.**
  - The page's viewport, in CSS pixels: `page.setViewportSize` (`console.mjs:950`, the sizes at `:869`).
  - Playwright's Chromium driver sends this as CDP `Emulation.setDeviceMetricsOverride` (`frontends/shell/node_modules/playwright-core/lib/coreBundle.js:37757`, untracked, a reading aid).
  - Nothing in MEASURE' resizes or reads the app window.
- **What it checks.**
  - `window.innerWidth`×`innerHeight` equals the set size after 500 ms, and S8 otherwise (`:954-956`).
  - It does not check, or record in the JSON (`:971`, `:982`), the window's size, the display scaling or the device pixel ratio.
  - It does not check that the page's size without an override equals the window's content area. The figure does not depend on that, because the override is always set.
- **What the configured 1280 by 800 is a size of.**
  - The window's content (client) area, as a logical, scale-independent size, requested at launch: `src-tauri/tauri.conf.json:17-18`, and the e2e overlay in each run's out copy.
  - tauri-runtime-wry 2.11.4 (`src-tauri/Cargo.lock:4694-4695`) passes width and height to `inner_size` at `<u>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/tauri-runtime-wry-2.11.4/src/lib.rs:932`, which sets a `TaoLogicalSize` (`:1008-1011`).
  - It is not the outer window and not the page. The window's content area is 1280 by 800 screen pixels at 100% scaling only, hence "asks for" and "at 100% display scaling". No window-state plugin or resize call exists in `src-tauri`.
- **Named for the source comment, not blocking:** the override's device pixel ratio is not recorded. The words claim nothing about it.

## Findings

- **E1 (Evidence).** §4 M-CB3, as Amendment 1's E1 gives it. The suite's own state is a known pass case (runs 3 and 5), so under ADV-2026-11-22-26 item 2 it is not evidence. This leaves §5's P2 unmet. Fixed by T1 and T4.
- **E2 (Evidence).** §4 M-G1 and M-CB1. Their sets were never exercised, because no click landed. §5's falsification items "GROUP' passing under M-G1" and "E-AND passing under M-CB1" stay unrun. Fixed by T2 and T3, then a re-run.
- **E3 (Evidence).** ADV-2026-11-22-24 item 1's ordinary-state sentence, and P4's "in the ordinary state", are not shown by run 3 (E-AND) or run 1 (GROUP'). The other ring is never full. This is a wrong P4, class 2.
  - For E-AND, T1 fixes it.
  - For GROUP', the pass on R ≤ M does not depend on the other ring's state. I recommend recording P4's clause there as wrong, without a fill. That is the advisor's call.
- **E4 (Evidence, minor).** Run 12b. PC-E1's oracle provenance is not shown (`table.mjs:8-10`). Name its source, or rerun the generator.
- **D1 (Documentation, must-fix before the merge).** No record may carry the tester's mechanism for runs 2 and 4, or for FIND'. Use 2 above.
- **D2 (Documentation, must-fix before the merge).** The M-CB3 re-run records its applied diff, as M-X2's `cmp` did.
- **Note, not a finding.**
  - MEASURE' "restores" 1280×800 by setting the override again (`console.mjs:1005`), not by clearing it as `layout.mjs:264` does. REGRESS' then runs under emulation.
  - Clearing it is test code, and is the advisor's call before the sitting run.

## Words for the form (none is the human's wording; reading aids at 12251bc8850127b72a9fb2b5fce63c33ef2d7075)

**T1.**

```text
**R0, the first reading:** the label only, at `label0`'s position (`command-bar.mjs:479`), giving N₀, S₀ and O₀. R0 opens and clicks nothing.
```

```text
**The fill, then R0, the first reading.** After card A's wait (`waitCommitted`) and before R0, one `page.evaluate` calls `document.querySelector(".console-disclosure").click()` 128 times, the suite's own DOM click (`command-bar.mjs:355-359`, `:385-386` at 12251bc8850127b72a9fb2b5fce63c33ef2d7075), never `page.click`: the Console sits in the Activity region, which E-CTRLK leaves closed as the app opens it (`command-bar.mjs:157`, `:176`; `frontends/shell/src/layout/layoutState.ts:51`). Each click records one `console.togglePanelExpanded` entry of the other kind (`ConsolePanel.tsx:80`) and flips the drawer (`:81`); 128 is even, so the drawer ends open, as card A's wait left it. The other ring then holds M at R0 whatever it held before, and with S₀ > 0 so does the stream ring: N₀ = 2M, the ordinary state (ADV-2026-11-22-24 item 1). R0 is the label only, read after the fill at `label0`'s position, giving N₀, S₀ and O₀; it opens and clicks nothing. The unmutated run records N₀; N₀ ≠ 2M with S₀ > 0 is a stop to the advisor (S11).
```

**T2.**

```text
M-G1 (test mutation): 200 clicks of `.console-disclosure`, inserted after the fill loop (`console.mjs:718-722`) and before the layer-tab click (`:723`). By arithmetic, R ≥ 200 > M, and ΔO > N_base − M, because 200 exceeds the stream ring's holding of at most M. The 200 clicks also evict the three style rows, so `pollConsole` returns not found; but the capacity check (`:733-736`) runs before the presence check (`:739`). Set {`GROUP': capacity:`}.
```

```text
M-G1 (test mutation): one `page.evaluate` that calls `document.querySelector(".console-disclosure").click()` 200 times, the suite's own DOM click (`console.mjs:159-171` at 12251bc8850127b72a9fb2b5fce63c33ef2d7075), inserted after the fill loop (`:725-729`) and before the layer-tab click (`:730`); never `page.click`, because the Console sits in the Activity region, closed as the app opens it and never opened by this suite (`frontends/shell/src/layout/layoutState.ts:51`). Each click records one entry of the other kind (`ConsolePanel.tsx:80`) and flips the drawer (`:81`); 200 is even, so the drawer ends open. With h_o the other ring's holding at the baseline and room = N_base − M ≤ h_o (the stream ring holds at most M), dropO ≥ h_o + 203 − M > room, and R ≥ 203 > M. The clicks also evict the three style rows, so the presence poll ends not found after 5000 ms (`:72`); but the label check (`:740`) passes and the capacity check (`:746-750`) runs before the presence check (`:754`). Set {`GROUP': capacity:`}.
```

**T3.**

```text
**M-CB1** (test mutation): 200 clicks of `.console-disclosure`, inserted after R0 (`:479`) and before card B's `sendCondition` (`:480`). By arithmetic, a ≥ 200. ΔO = max(0, (N₀ − M) + a − M), which exceeds N₀ − M because a > M. Set {F2′}.
```

```text
**M-CB1** (test mutation): one `page.evaluate` that calls `document.querySelector(".console-disclosure").click()` 200 times, inserted after R0 and before card B's `sendCondition` (`command-bar.mjs:465`, `:466` at 12251bc8850127b72a9fb2b5fce63c33ef2d7075); never `page.click`, for the reason the fill gives (§2.5). Each click records one entry of the other kind; 200 is even, so the drawer ends open. By arithmetic, a ≥ 200. ΔO = max(0, (N₀ − M) + a − M), which exceeds N₀ − M because a > M; S₀ > 0, so F7 (`:494`) is not reached first, and F2′ (`:496`) is thrown at the first kept reading. Set {F2′}.
```

**T4.**

```text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a reads N₁ − N₀ (0 in the ordinary state, both rings full), and L = min(M, ΔS). The entries rendered after R0 are the stream entries still held and every other-kind entry recorded after R0, so the last L leave out the oldest of them, as many as there are other-kind entries. Card B's `record_step` is left out, and the set holds, when the held stream entries recorded after R0 and before it number no more than the other-kind entries recorded after it (R1's clicks among them); in the ordinary state, where card B's load adds more than M stream entries, that holds when the `record_step` is recorded before the oldest stream entry still held. By reading at 0f2078423378: the step is enqueued after the untiled request's issued outcome (`frontends/shell/src/App.tsx:394-395`, `:1072`) and recorded in the same call when no step is in flight (`frontends/shell/src/workspace/stepRecorder.ts:49-55`, `:69-75`; `frontends/shell/src/skp/client.ts:59`), and tiles are asked for only at that look's Completed terminal (`KNOWN-LIMITATIONS.md` item 67's comment). Set {F4 with n = 0}. The build checks the reading: the unmutated E-AND run records, from its final reading, ΔS, a and the number of held stream entries recorded after R0 and before card B's `record_step`; if that number is above 0, M-CB3 is not run as evidence and goes to the advisor as a possible pass case (ADV-2026-11-22-26 item 2); a pass of a run made is a finding.
```

```text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync, run with §2.5's fill in place (both rings full at R0, N₀ = 2M). The label then shows O = 0 at both readings, so ΔO reads 0 while the true ΔO is a; a reads N₁ − N₀ = 0, since both rings stay full; and L = min(M, ΔS), so the last L rendered entries are the newest M of all held. Card B's `record_step` is among them only if fewer than M held entries are newer than it. In a run whose unmutated twin records ΔS ≥ M and no held stream entry recorded after R0 and before card B's `record_step` (run 3 at 12251bc8850127b72a9fb2b5fce63c33ef2d7075: ΔS = 223, 0), the M held stream entries are all newer than it, so added is empty; F2′ (0 ≤ N₀ − M) and F7 (S₀ > 0) are not reached, and after 30 s E-AND fails with F4, n = 0 (`command-bar.mjs:507`, `:489`). Set {F4 with n = 0}. A twin that records otherwise sends M-CB3 to the advisor unrun as evidence (ADV-2026-11-22-26 item 2); a pass of a run made is a finding. The run records its applied diff.
```

## 5. Reach

- **Product code:** none of the three findings bears on it.
- **Part 1's verdict on the code stands.** T1 changes `command-bar.mjs`, so that file needs a narrow re-read and the §7 recount (Amendment 2's D5, "about 790").
- **The PR body:** I did not read it. Any PR or record sentence saying P2 is met, or that E-AND or GROUP' passed "in the ordinary state", is untrue at this head's series (E1 to E3).

## Files read

- `C:/dev/wt/read-1122`:
  - `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` (whole);
  - `state/directives/` ADV-2026-11-22-20, -24, -26, -28, -30 and -36 (each whole).
- `<S>`:
  - `c67e-report.md` and `c67e-report-2.md`;
  - under `c67e/`: `1-console.log`, `2-console-mg1.log`, `3-command-bar.log`, `4-command-bar-mcb1.log`, `5-command-bar-mcb3.log`, `12b-table.log` and `3-command-bar-out/tauri.e2e.conf.json`.
- `C:/dev/wt/console67`:
  - under `frontends/shell/`: `e2e/console.mjs` (parts), `e2e/command-bar.mjs` (96-515), `e2e/layout.mjs` (235-284), `e2e/table.mjs` (greps), `src/console/ConsolePanel.tsx`, `src/layout/layoutState.ts` and `src/layout/StudioLayout.tsx` (greps), `src-tauri/tauri.conf.json`, `src-tauri/Cargo.lock` (grep), and `node_modules/playwright-core/lib/coreBundle.js` (grep).
- `<u>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/tauri-runtime-wry-2.11.4/src/lib.rs` (greps).

Model: Opus 5.5 (claude-opus-5-5).
