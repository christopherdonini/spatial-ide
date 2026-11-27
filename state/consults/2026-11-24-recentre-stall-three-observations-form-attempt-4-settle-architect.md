# recentre-stall-three-observations: the attempt-4 settle, the architect as the form's author (not a gate)

*Filed by the custodian: node:recentre-stall-three-observations@form-attempt-4-settle-architect. It is not a gate and gives no verdict. Both attempt-4 form gates passed with notes, Documentation findings only (rows 906 and 907); on two sentences their words differ, so the architect, as the form's author, settled them (AUTONOMY §31) and gave the final set of pairs. Dispatched at 2026-11-24T10:02:34Z with its brief byte for byte (brief-rst-settle-4.md in the scratch folder, 4730 bytes, sha256 0e50b0d1a890a590f11e52c3d67a903cdac4f53d96c68a03f9a0e88bf80234e1); its run: Read 3, Grep 1, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T10:02:49Z to 2026-11-24T10:05:44Z by its transcript; 0 calls named the main checkout; handed back once, at 2026-11-24T10:05:44Z; no message was sent to it. The custodian checked by script that its five pairs are byte for byte the architect's gate's D2, D1 and D3 and the reviewer's gate's two D3 pairs, as it says; that each old text occurs once in attempt 4 and no two overlap; and applied them from the end: the final text, 53989 bytes, sha256 1d4adc58948870fcbfc14a7a343789bc7f07570781a3a814c09d3f38770ce1b5, which the form's commit files. Filed below the rule, 9309 bytes, sha256 82d7e85838df003d719069a8a3017136f7383d7fa0436f4861bd62e225f4cd80, byte for byte, nothing masked, with one final newline added.*

---

Settle, not a gate: detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

**Verdict:** I settled the final words. There are five pairs. A2, A1 and A3 are copied unchanged from the architect's gate, and R3 and R4 unchanged from the reviewer's gate. I give no new words of my own, and no Correctness or Evidence point arises.

**Checks I could not run.** I have no Bash, so I recomputed none of the three sha256 values. Each first line is as briefed:
- attempt 4: line 1 is blank and line 2 is the title "# shell: the re-centring stall report's three observations …";
- each report: line 1 is "Verdict: PASS WITH NOTES", and line 2 is a `Reviewed:` line naming e7b93c63…1399.

The custodian's script check of the hashes stands.

## 1. T28: I take A1 and leave R1

What decides it: §5.1 O2 confirms when "the median summed count is less than one" (attempt 4, line 261). The form never says how a median of an even number of values is taken.
- **Under R1,** M20 reads the windows singly, and the only windows with no `layers` line count {0, n_R}. With n_R at least 2, the median is at least 1 only if it is taken as the mean or the upper value. A reader that takes the lower value gets 0, below 1. The control then passes and T28 reads a confirm, so M20 would also fail T28, which P5's list (line 181) does not name.
- **Under A1,** every window with no `layers` line counts at least one. Any median of such values is at least 1, however it is taken.

Naming the windows: W−1 is the window before the first window, W1 the first window after the R-span's t1, and W2 the second. W−2 is the window before W−1.

**Can the fixture be built? Yes, and it is the shape deck 9.3.9 produces.** Both gates read that deck emits and resets before `updateLayers` in each frame (`deck.js` 1019 to 1025, then 1031; untracked, package-relative). The fixture is:
- W−2 holds one other `layers` line, outside the interval. Its updates land after the reset, so W−1 counts at least one and holds no line.
- W1 holds the R-span's line and counts 0. W2 counts the R-span's `layerCount` and holds no line, as in T18.
- Every pair of consecutive windows holds a line, because every pair includes W−2 or W1, or a later window that holds a line. Alternatively the run ends at W2.
- Each added line gets its own span line, so the §5.3 invalidator of line 292 is not hit.

**Clause check against §5.1 O2 (attempt 4, lines 259 to 263):**
- **Interval (line 260).** It runs from the second-last metrics line before t1, which is where W−2 closes, to W2's page time. So it covers W−1, W1 and W2. W−2's line lies before the interval, so "no other `layers` line in the interval" holds.
- **Correct reader, confirm (line 261).** The sum is 0 + n_R, which is at least n_R, and there is no other line. But no pair of consecutive windows is free of a line, so the control cannot be read and there is no confirm.
- **Correct reader, kill (line 262).** The sum n_R is not below the least `layerCount`, which is n_R. No kill.
- **Correct reader, result (line 263).** "Otherwise: neither, including a run with no pair for the control." T28 reads neither, as predicted.
- **M28.** M28 treats the missing control as passed, so T28 reads a confirm. That is the predicted failure.
- **M18.** Reading the first window only gives 0, below n_R, which is at least 1 because W2 is a free window counting n_R. T28 reads a kill, which P5 already lists.
- **M20.** The single free windows are W−1 and W2, each at least 1, so the median is at least 1. The control does not pass and T28 still reads neither. M20 no longer crosses.
- **M19, M26, M27.** T28 has no other line in the interval, and W−1 holds none, so moving the interval's start (M26) changes nothing. None of the three changes the reading.
- **M13.** The confirm's comparison sits at its edge, but no confirm is reachable here, and the kill's "below" is untouched. The reading stays neither.
- **M12, M14, M15.** These change only which span a step's rule picks. T28 takes T18's step and view-state lines unchanged, so they reach T28 only where they reach T18, and P5 names none for T18. The builder keeps the added renders outside that step's marks.
- **M1 to M11, M16, M17, M21 to M25.** These act on code paths or readings that T28 does not assert.

P5's list and every other test row stay as they are, so there is no further pair.

## 2. §0.1: I take A2

The two paths are byte-identical. The reviewer showed by `git ls-tree` that the path is at 20ed759b. A2 drops "given to the custodian on 2026-11-24", which makes the bullet read like the -18, -19 and -21 bullets: the path, then "It …". The date is already in the path, and the bullet's "it is filed on main" stays true.

## 3. §7: I take R3 and R4 into my line plan

I checked the reviewer's evidence at cdfebef1:
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` mocks `@deck.gl/core` at line 33 and opens its first `describe` at line 122;
- `WorkingCanvas.recentre.test.tsx` mocks it at line 53 and opens its first `describe` at line 181.

A file that mounts the real component with a fake Deck, as T9 to T11 need, will not fit in 70 lines.

The new figures:
- The plan is 88 + 200 + 197 + 475 = 960.
- The ceiling is 1,050. The margin of 90 is 9.4% of 960, under a tenth.
- The shipped files stay at 20, 50 and 18 (88), the same as the attempt-2 plan.
- The total is under 1,000, so nothing goes to the advisor for size.
- The figures 930 and 1,020 appear only on line 352.

## 4. A3 stands as the architect's gate gave it

The architect's gate read `dist/transitions/transition.js` whole. The reviewer's own read (lines 30 to 95, reported at 75 to 80) agrees that the last update comes before `end()`.

I did not re-read the file:
- the brief bars `C:/dev/spatial-ide`;
- `D:/wt/read-1124c` has no `node_modules` (glob, no match).

The cite is package-relative evidence and carries no hash.

## 5. The final set, in line order

No two pairs overlap. Each old text was checked once in attempt 4 by the custodian's script, and I confirmed it by reading.

**1. Line 24, §0.1.** A2, unchanged from `report-rst-formgate-arch-4.md`, lines 29 and 32.
```text
- The advisor's ruling ADV-2026-11-24-22, given to the custodian on 2026-11-24.
```
```text
- The advisor's ruling ADV-2026-11-24-22: `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-22-recentre-stall-three-observations-the-ceiling-from-the-line-plan-a-head-moved-before-the-runs-merged-in-and-read-narrowly.md`.
```

**2. Line 231, T28.** A1, unchanged from `report-rst-formgate-arch-4.md`, lines 15 and 18.
```text
in a run where every pair of consecutive windows holds a `layers` line, reads neither
```
```text
in a run where every pair of consecutive windows holds a `layers` line and every window with no `layers` line counts at least one, reads neither
```

**3. Line 245, §5 Terms.** A3, unchanged from `report-rst-formgate-arch-4.md`, lines 39 and 42.
```text
`dist/controllers/orthographic-controller.js`, lines 316 to 319, and `dist/controllers/transition-manager.js`, lines 136 to 146, package-relative)
```
```text
`dist/controllers/orthographic-controller.js`, lines 316 to 319, `dist/controllers/transition-manager.js`, lines 136 to 146, and `dist/transitions/transition.js`, lines 77 to 81, which sends the last update before it ends the transition, package-relative)
```

**4. Line 352, §7.** R3, unchanged from `report-rst-formgate-rev-4.md`, lines 50 and 53.
```text
- At most 13 files and 1,020 changed lines, this form exempt. The ceiling is the line plan's total, 930, with a margin under a tenth of it (ADV-2026-11-24-22, item 1).
```
```text
- At most 13 files and 1,050 changed lines, this form exempt. The ceiling is the line plan's total, 960, with a margin under a tenth of it (ADV-2026-11-24-22, item 1).
```

**5. Line 356, §7.** R4, unchanged from `report-rst-formgate-rev-4.md`, lines 56 and 59. The old text starts with two spaces.
```text
  - their tests: `watchdog.test.ts` 55, `stallTrace.test.ts` 45, `WorkingCanvas.stallObservation.test.tsx` 70;
```
```text
  - their tests: `watchdog.test.ts` 55, `stallTrace.test.ts` 45, `WorkingCanvas.stallObservation.test.tsx` 100;
```

None of these sentences is the human's wording, and none is red-line text. The worker applies them with no re-gate, and the PR body lists them.

## 6. For the advisor's list (ADV-2026-11-24-18, item 10)

- **Item 8 (§7's ceiling): changed.** It now reads in the reviewer's "with D3" form: 1,050 from a plan of 960. The shipped files are unchanged at 88, still the author's estimate made after attempt 2. `stallObserver.mjs` still grows by 12 lines.
- **Item 13 (a head that moves between M0 and M3): unchanged.** None of the settled words touches §0.3's "before the runs" or §5.3's "after the runs". It goes to the advisor as the reviewer's note.

## Files read

- Scratch (`<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`):
  - `rst-form-gate-4.txt`
  - `report-rst-formgate-arch-4.md`
  - `report-rst-formgate-rev-4.md`
- `D:/wt/read-1124c` @ cdfebef1: a grep of `frontends/shell/src/canvas/WorkingCanvas.*.test.tsx` for top-level `describe(` and `vi.mock(`, and a glob for `node_modules` (no match).

Model: Opus 5.5 (claude-opus-5-5).
