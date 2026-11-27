Reviewed: PR 359, the branch cut/console-stream-lane at 8b8c38815a5fbc1e41e392366784a7c1c51a5783, in C:/dev/wt/console67 (the custodian's filing note, 2026-11-23: the architect's narrow attempt, the last step of the sequence in the Console form's Amendment 3, node:console-stream-lane-limitation-67@a3-architect-narrow, dispatched at 2026-11-23T10:19:50.055Z; its run: Glob 3, Grep 13, Read 42, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T10:19:50.234Z to 2026-11-23T10:26:51.895Z by its transcript. Filed below the rule from its hand-back, 11490 bytes, sha256 cda4c098c34c8d5ee334b89c22e9d182ad8f0f7b54d4ac6889204c392d8ed650, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES — cut/console-stream-lane @ 8b8c38815a5fbc1e41e392366784a7c1c51a5783
Reviewed: C:/dev/wt/console67 @ 8b8c38815a5fbc1e41e392366784a7c1c51a5783
REPORT PATH: state/consults/gates/2026-11-23-console-stream-lane-a3-architect-narrow.md

I read the records at main 0f47e3258d6a634cc1c174b3572c6d6228f00404 (`C:/dev/wt/sit`). Every code line I cite is at the head 8b8c3881. Amendment 3's fences cite lines at 12251bc8. Those cites are historical pins. Where they differ from the head, I locate by the tree and say so. I found no product fault and no Correctness or Evidence finding. There are three Documentation findings, all must-fix before the merge.

## 1. Each applied diff against its text

- **Run 2, M-G1, against T2.** The diff adds one line, a `page.evaluate` that loops 200 times over `document.querySelector(".console-disclosure").click()`. It sits after the style-fill loop (`console.mjs:725-729`) and before `page.click("#inspector-tab-layer")` (`:730`). T2's cites at 12251bc8 match the head here. One file, one insertion. The diff reads the same as `<S>/c67h-m-g1.patch`, index line included. Nothing goes beyond the fence. The line sits at column 0, which is cosmetic.
- **Run 4, M-CB1, against T3.** One line, the same `page.evaluate` loop with 200 clicks. It sits after R0 (`command-bar.mjs:467`, `text0`/`label0`) and before card B's `sendCondition` (`:468`). T3's `:465` and `:466` are at 12251bc8. The head is 2 lines lower because of T1's comment and fill (`:465-466`), so the tree is authoritative. The diff reads the same as `<S>/c67h-m-cb1.patch`. Nothing goes beyond the fence.
- **Run 5, M-CB3, against T4.** It changes two lines, nothing else:
  - `ConsolePanel.tsx:55`, inside the expanded branch's `sync`, sets `droppedOther: 0`.
  - `collapsedCountSync.ts:63`, inside `snapshot()`, sets `droppedOther: 0`.

  `droppedStream` and `count` are untouched. The diff reads the same as `<S>/c67h-m-cb3.patch`. Nothing goes beyond the fence.
- **Run 6, M-A4-1.** It deletes `App.tsx:1072`, the `stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter } })` line. By grep, it is the only such enqueue in `src/App.tsx`.
- **Run 7, M-A4-3.** It adds a byte-identical copy of `:1072` directly after it.
- **Run 8, M-X2.** It adds the line of `<S>/c67-mx2-line.txt` directly before `:1072`. By reading, it is the same text with the same 6-space indent. The tester also reports a `cmp` exit of 0.
- **Runs 6 to 8 together.** All three diffs share the base blob `80b1e8c0`, so each was applied to an unmutated tree.

## 2. Each mutation run against its named set

The first FAIL line of each run is from its `.log` and `-summary.txt`. In every run it is the only FAIL line.

| Run | First FAIL (paraphrased) | Line at head | In set | Mechanism shown |
|---|---|---|---|---|
| 2 M-G1 | `GROUP': capacity:`, R=240 (755−515), dropS 0, dropO 129, room 17 | `console.mjs:749` | yes | The clicks landed: R=240 against run 1's R=9, and dropO moved by 129. 129 is above T2's bound h_o+203−M = 17+203−128 = 92, and above room 17. REGRESS' passed, so there is no FIND' knock-on. |
| 4 M-CB1 | F2′, 201 other-kind dropped, more than 128. Label at R0 is `256 actions (… 25 of other entries)`, then `226 of other entries` | `command-bar.mjs:498` | yes | The clicks landed: O went from 25 to 226. N₀=256 shows T1's fill was in place. S₀=545 > 0, so F7 (`:496`) was not reached. |
| 5 M-CB3 | F4, `added 0 record_step rows … []` | built at `:491`, thrown at `:509` | yes (n = 0) | n=0 can only come from `:509`, after the 30 s deadline, because `:506` needs a newest row. The step took 57,327 ms against run 3's 23,634 ms, which fits that 30 s path. |
| 6 M-A4-1 | `the newest record_step rows did not end with card A's step at ok before card B ([])` | `:464` | yes (card A's wait line) | 42 s, which fits `waitCommitted`'s 30 s bound. §4's `:478` is a historical cite. The set is resolved by its name at the head. |
| 7 M-A4-3 | F4, n=2, both `filter:` + ZONE_AB (`:321`), at ok | built at `:491`, thrown at `:506` | yes | Thrown in-loop after 16.9 s. |
| 8 M-X2 | F4, n=2, ZONE_A then ZONE_AB | built at `:491`, thrown at `:506` | yes | Thrown in-loop after 16.1 s. |

## 3. Run 3, the unmutated twin, and T4's premises

These readings are from `3-command-bar-eand.txt` and the log at line 16:
- R0: `256 actions (569 dropped: 545 …; 24 of other entries)`, so N₀=256=2M, S₀=545 and O₀=24.
- R1: `256 actions (794 dropped: 768 …; 26 …)`, so ΔS=223 and ΔO=2.
- The E-AND line also gives a=2, L=130 and 0 held stream entries before card B's `record_step`.

T4's premises hold:
- ΔS = 223 ≥ M.
- The count of held stream entries before the step is 0, inside a window of L=130 = a + min(M, ΔS), which covers every entry recorded after R0.
- So all 128 held stream entries are newer than the step. Under M-CB3, L = min(M, ΔS) = 128 leaves the step out, so added is empty.
- F2′ (0 ≤ 128) and F7 (S₀ > 0) are not reached.

Run 5's F4 with n = 0 is therefore the expected result, not chance. Run 3 is also the recorded run that ADV-2026-11-22-45 item 8 asks for: the true ΔO is 2, and the mutated value is 0.

T1's fill is in the unmutated step at `command-bar.mjs:465-466`. It comes after `waitCommitted` (`:463-464`) and before R0 (`:467`). It puts the rings in ADV-2026-11-22-24 item 1's state: N₀ = 2M with S₀ > 0, against 153 in the series before. The `▾` in R0's label shows the drawer is open. E-AND passed, so S11 was not reached.

## 4. The unmutated rows

Runs 1, 3 and 9 to 11 have no FAIL line in any log or summary. There is no SKIP except `MEASURE'` in run 1. That SKIP is what the form expects: `console.mjs:979` skips it unless `CONSOLE_MEASURE` is `1`, under §9.3's "after the sitting of 2026-11-24".

Run 1's GROUP' passed on its first branch (R=9 ≤ 128, drops 0/0), and LABEL' shows 0 other-kind drops. That agrees with Amendment 3's P4 entry for GROUP': no run shows GROUP' in the ordinary state.

## 5. The table row and S6

- **The generator.** `oracle.log` shows `generate_the_filter_fixture` run from `manual_walkthrough_fixtures` with 1 passed and 21 filtered out. It wrote into the worktree's `C:\dev\wt\console67\target\fixtures\…`, not the shared `C:\dev\spatial-ide\target\…`. It printed `zone_counts=[402, 392, 389, 421]` (`oracle.log:231`).
- **The launch.** Run 12 ran `npm run e2e:table`, as the README entry at `e2e/README.md:828` says. The variable reached the suite: `[PC-E1] PASS … (oracle [402, 392, 389, 421])` (`12-table.log:7`). The result was 4 PASS, 0 FAIL, with PC-E4 included.
- **S6.** It closes by Amendment 3's words: the row passed at the new head, launched as the entry says, with the oracle sourced.
- **The sha256 comparison.** See finding Doc-1.

## 6. D2, D1 and the deviations

- **D2 is met.** Run 5 recorded its diff and stat in `5-command-bar-mcb3.diff` and `.stat`.
- **D1.** The report repeats none of the earlier mechanism for runs 2 and 4 or for FIND'. It does not claim that P2 is met. It does not say that E-AND or GROUP' passed "in the ordinary state". Two sentences say more than the logs show: Doc-2 and Doc-3.
- **The two deviations.** Neither bears on the evidence:
  - The copy of the form was outside `c67r/`, and no evidence file depends on it.
  - In run 11, `df.txt`'s reading after run 10 (41035 MB) comes before run 11 starts in `times.txt`, so the floor check still held.

## Findings

- **Doc-1 (Documentation, must-fix before the merge). Place: the run-12 record.** The comparison of the tester's own copy's sha256 with the shared copy's is stated only in the tester's report. That is the line "both `92ed800c…2e46`". No file under `<S>/c67r/` carries the hash of the generated copy. The shared copy's hash is logged: in every FIXTURES row in full, and as a prefix in `12-table.log:15`.
  - I do not class this as Evidence. The claim gives a full value, nothing logged contradicts it, and PC-E1's independent count (402) equals the oracle's.
  - Fix: the generated file is still at `C:/dev/wt/console67/target/fixtures/manual-walkthrough/filter-zoned.parquet`. The reviewer, who has Bash, recomputes its sha256 and records it beside run 12 before the merge check.
- **Doc-2 (Documentation, must-fix if the report is filed). Not the human's wording.** The report cites F2′ at `:499`. At the head, F2′ is thrown at `:498`, and `:499` is the discard test.

```text
This is F2′ (the `command-bar.mjs:499` message), in the set.
```
```text
This is F2′ (the `command-bar.mjs:498` message), in the set.
```

- **Doc-3 (Documentation, must-fix if the report is filed). Not the human's wording.** Run 6 failed at card A's wait line (`:464`), before E-AND's §2.5 assertion. "Reached the E-AND … assertion" says more than its log shows. Clause check for the new words, against the logs:
  - run 2 failed at `console.mjs:749`;
  - runs 4, 5, 7 and 8 failed at `:498`, `:509` and `:506`;
  - run 6 failed at `:464`;
  - run 3 passed.

```text
- **Reaches the assertion:** every mutation run reached the E-AND or `GROUP'` assertion and failed there. Run 3 reached E-AND's PASS.
```
```text
- **Reaches the assertion:** every mutation run failed at a line of its named set: GROUP''s capacity check (run 2), E-AND's F2′ (run 4) or F4 (runs 5, 7 and 8), and card A's wait line (run 6). Run 3 reached E-AND's PASS.
```

- **Note, for the closing amendment's references (no edit to the form, which is append-only).** T3's clause "F2′ (`:496`) is thrown at the first kept reading" is my own earlier wording. At the head, F2′ is checked at `command-bar.mjs:498`, on every readable reading, before the discard test at `:499`. So it can be thrown on a reading that is later discarded. The set and run 4 are unaffected. The closing amendment cites the throw lines by name at the head and does not repeat "kept". The same applies to §4's historical `:478` for M-A4-1, which is `:464` at the head.

## Files read

- `C:/dev/wt/sit`:
  - `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` (Amendment 3 whole; lines 240-389 and 515-579);
  - `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-45-…md` and `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-02-…md` (each whole);
  - `state/consults/gates/2026-11-22-console-stream-lane-build-gate-architect-part-2.md` (whole).
- `<S>`:
  - `console-e2e-2-report.md`;
  - `c67h-m-g1.patch`, `c67h-m-cb1.patch`, `c67h-m-cb3.patch` and `c67-mx2-line.txt`;
  - under `c67r/`: `2-console-mg1.diff`, `.log` and `-summary.txt`; `3-command-bar.log`, `-summary.txt` and `-eand.txt`; `4-command-bar-mcb1.diff`; `5-command-bar-mcb3.diff`, `.stat`, `.log` and `-eand.txt`; `6-command-bar-ma41.diff`, `7-command-bar-ma43.diff` and `8-command-bar-mx2.diff`; `1-console-summary.txt`, `9-recording-summary.txt`, `10-project-summary.txt` and `11-reopen-summary.txt`; `12-table.log`, `oracle.log`, `times.txt`, `df.txt`, `fin.sh` and `post.sh`;
  - greps over `c67r/*.log` and `c67r/*` (outside `-out/`).
- `C:/dev/wt/console67` (under `frontends/shell/`, at the head):
  - `e2e/console.mjs` (40-219 and 660-779; grep `CONSOLE_MEASURE`);
  - `e2e/command-bar.mjs` (370-529; greps);
  - `e2e/table.mjs` (1-40; greps);
  - `e2e/README.md` (greps);
  - `src/App.tsx` (1055-1079; grep);
  - `src/console/ConsolePanel.tsx` (30-89);
  - `src/console/collapsedCountSync.ts` (40-74);
  - a glob of `target/fixtures/manual-walkthrough/`.

Model: Opus 5.5 (claude-opus-5-5).
