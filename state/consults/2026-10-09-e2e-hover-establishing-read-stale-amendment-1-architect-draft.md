*Custodian's filing note (2026-10-09): the architect's draft of Amendment 1 of `frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md`, recording the human's rulings of 2026-10-09 (`state/directives/2026-10-09-rulings-on-the-eight-forms.md`), on the custodian's brief at main b4dc05e0. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is a9b80dadee61e72cee6749764a145e46761db52b01da8cc59ac8607a1c49c5ec. Write audit PASS: zero write calls (Read and Grep only, 30 tool uses). Run window from the transcript: 08:46:53Z to 08:53:30Z. The amendment as appended is part 1's block with its 17 pins computed at b4dc05e0, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 4bb7b206a58ff5971e61bf43babcac272e9e31b1094cf4f84f02692ed38e4412).*

---

Reviewed: main @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b

The barrier and its read can live in lib.mjs. The export goes after `zoomInOneNotch`, the last function in that file, and is named `hoverIdAfterBarrier(page, target, label)`. There is one cost, set out as A1.0 below: lib.mjs has to carry private copies of the poll and the readout reader. So this is not the "cannot live there" case, and I did not stop.

1. The amendment

````markdown
### Amendment 1 — the human's rulings of 2026-10-09 (class 5); the barrier and its read placed in lib.mjs (class 9, scope addition)

This amendment records the human's rulings on this form. It is written before any code, and no outcome has been seen. Code read at main b4dc05e08c1e24ef7d6904596bb2332b87dcf75b. Authority: item 1 of state/directives/2026-10-09-rulings-on-the-eight-forms.md, and its RULED 2026-10-09 block in DECISIONS-PENDING.md (every open item of the eight forms). The ruling is referenced here and not reproduced.

**A1.0 Finding: the placement.** The barrier and the read that follows it can live in frontends/shell/e2e/lib.mjs, at one cost.
- lib.mjs cannot import from regression.mjs, because regression.mjs runs its suite at module top level (frontends/shell/e2e/regression.mjs:2715 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
- So the read cannot reach regression.mjs's poll (frontends/shell/e2e/regression.mjs:145-154 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) or its readout reader (frontends/shell/e2e/regression.mjs:1156-1201 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
- Moving the reader would count its 46 lines twice under §7's command. With §2's barrier, its two call sites and §4's comments added, the line counts at the base leave no room for that under the ruled 140.
- So lib.mjs carries private copies of the poll and the reader, with code identical to the base, and exports only the barrier-and-read function. The copies are a second text of the readout contract. §8 item 15 (A1.2) blocks any divergence.

**A1.1 OPEN-1, OPEN-2, OPEN-3 (class 5).**
- OPEN-1 is ruled (a) (state/directives/2026-10-09-rulings-on-the-eight-forms.md:9 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
  - §2.4's change bullet stands. Its last bullet, the examine-only branch, never applies.
  - §4 T3's condition for M5 is met, so M5 runs, and §5 P4 to P7 include M5.
- OPEN-2 is ruled (b) (state/directives/2026-10-09-rulings-on-the-eight-forms.md:10 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
  - §2.5 stage 2's STOP and §5 I2 stand as written. If routes A and B both fail, the worker stops and the custodian takes it to the human. No product code is written under this form.
- OPEN-3 is ruled (a) (state/directives/2026-10-09-rulings-on-the-eight-forms.md:11 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
  - §2.5's not-a-route bullet and §8 item 6 stand as written.
- §11's three items are closed by these rulings. None was a red line.

**A1.2 Scope addition: the placement (class 9)** (state/directives/2026-10-09-rulings-on-the-eight-forms.md:12 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD). It adds frontends/shell/e2e/lib.mjs to the piece, declared as follows before any code of it.

§2, the shape.
- The export (replaces §2.1's first sentence; steps 1 to 6 stand).
  - The barrier and its read are one function, `hoverIdAfterBarrier(page, target, label)`, exported from frontends/shell/e2e/lib.mjs.
  - It is appended after the file's last function at the base, `zoomInOneNotch` (frontends/shell/e2e/lib.mjs:590-595 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD). No existing line of lib.mjs changes, so §0.3's lib.mjs cites hold and nothing changes for any other suite that imports lib.mjs.
  - `target` is the candidate's CSS point, as `bufferPointToCss` returns it. `label` names the attempt in the two named failures and in the log line.
  - It runs §2.1 steps 1 to 6 and returns `{ ok, last }`, the shape the base's `waitForCondition` returns, so both call sites read the result as they do today.
- The private additions, appended with the export and not exported:
  - `HOVER_BARRIER_CLEAR_TIMEOUT_MS` and the 4 CSS px offset, at §7's values;
  - copies of `waitForCondition`, `readHoverReadoutState` and `hoverReadoutId`, with code identical to frontends/shell/e2e/regression.mjs:145-154 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD, frontends/shell/e2e/regression.mjs:1177-1193 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD and frontends/shell/e2e/regression.mjs:1199-1201 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD, each under a one-line comment that names its original by function name.
  - The poll uses lib.mjs's existing private `sleep` (frontends/shell/e2e/lib.mjs:44-46 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
- Route B, if §2.5 needs it: its step 2 goes in the same function and uses lib.mjs's existing `neighborhoodRegions` and the capturePixels hook, both unedited.
- §2.2 (replaces "runs the barrier before each flipY attempt"; the rest of §2.2 stands): the K6 helper's move-and-poll (frontends/shell/e2e/regression.mjs:1115-1123 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) becomes one call to the export. The comment above it is rewritten as §2.2 says.
- §2.4: A9′'s move-and-poll (frontends/shell/e2e/regression.mjs:852-860 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) becomes one call to the export. `attemptStart` and the attempt record are unchanged.
- The callers:
  - regression.mjs is the caller and imports `hoverIdAfterBarrier`.
  - lib.mjs exports nothing else, and the function takes no parameter or option that regression.mjs does not pass.
  - Milestone 2's selection suite (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:315 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) and the node e2e-first-poll-readout-elsewhere call the function later, each written against it as it stands at their own base. Nothing lands here for them.
  - The round-8 producer exemption is not invoked.

§4, the tests. No new test: T1 to T3 prove the export through its two callers.
- M1 (T1), first sentence: replace the K6 helper's call to the export with the base's move-then-poll (the regression.mjs:1115-1123 pin above). Its prediction is unchanged.
- M-B (T2), first bullet: inside the export, delete only the leave move and keep the clear-wait. Its prediction is unchanged.
- M-B's recorded-mutation comment sits beside the export in lib.mjs. M1's and M2's stay beside the K6 helper. The rest of §4's last paragraph stands.
- M2 to M5 are unchanged (see A1.3 for how they are run).

§5, declared unchanged and invalidators.
- Declared unchanged, third bullet: every file other than regression.mjs, lib.mjs and this form, apart from PLAN, records and generated files. That includes source-changed.mjs, residency-harness.mjs, src/**, src-tauri/**, tauri.conf.json, package.json and the lockfile.
- Added: every line of lib.mjs at the base. lib.mjs's diff is insertions after its last line only.
- Added: the 5,000 ms id wait keeps its value, now inside the export.
- I8: the export cannot be written without editing an existing line of lib.mjs, or it needs a second export. STOP and report. Under the ruling, milestone 2's re-sweep then carries the move.

§7, the budget. The first bullet is superseded: frontends/shell/e2e/regression.mjs and frontends/shell/e2e/lib.mjs, 2 files, at most 140 lines together, counted by §7's existing command. An overrun is class 8, and §7 is never edited to match it.

§8, block on sight.
- Item 1 is superseded: a file edited outside frontends/shell/e2e/regression.mjs, frontends/shell/e2e/lib.mjs and this form, apart from PLAN, records and generated files.
- Item 14: an edit to an existing line of lib.mjs, or a lib.mjs insertion anywhere but after its last line at the base.
- Item 15: lib.mjs's `waitForCondition`, `readHoverReadoutState` or `hoverReadoutId` differing in code from regression.mjs's at the base, or any of them exported.
- Item 16: a second export from lib.mjs, or a parameter or option of `hoverIdAfterBarrier` that regression.mjs does not pass.
- Items 10 and 13 stand.

§9, the gates. The reviewer also checks items 14 and 15 by diff. The suites are unchanged.

**A1.3 The mutations allowance (class 5)** (state/directives/2026-10-09-rulings-on-the-eight-forms.md:13 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD). It is ruled on the terms of the human's 2026-10-08 allowance (state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md:6-19 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD), with the worktree and the list taken as this piece's. The ruling's line governs; this paraphrase does not.
- M2, M3, M4 and M5 may edit only the product lines §4 T3 names, re-derived at the base (§0.2), and only in this piece's worktree.
- One mutation at a time. After each run the file is restored and the worktree shown clean, with `git status --porcelain` and `git diff` empty, before the next.
- Nothing is committed, pushed or left in place.
- The report gives, for each mutation, the edit, the step that failed and the clean check.
- The same terms cover a temporary edit that §2.5 stage 1 needs to get the odd map height, and that edit is reported the same way. Since it is never committed, §5's declared-unchanged list holds.
- If the permission system refuses any of these edits, the worker stops and the custodian tells the human. No other route is tried.
- This settles §4 T3's lead-in and §2.5 stage 1's "uncommitted" clause. §8 item 4 stands.

**A1.4 Superseded index.** Read the last amendment first.
- §2.1, first sentence: A1.2.
- §2.2, the "runs the barrier" clause: A1.2.
- §2.4, last bullet: void (A1.1).
- §2.5, stage 1's uncommitted clause: A1.3.
- §4 T1, M1's first sentence: A1.2.
- §4 T2, M-B's first bullet: A1.2.
- §4 T3: the lead-in, A1.3; M5's condition, met (A1.1).
- §4, last paragraph, where M-B's comment sits: A1.2.
- §5: P4 to P7's parenthesis, A1.1; Declared unchanged, third bullet, A1.2; I8 added, A1.2.
- §7, Budget, first bullet: A1.2.
- §8: item 1, A1.2; items 14 to 16 added, A1.2.
- §9, the reviewer bullet: A1.2.
- §11, OPEN-1 to OPEN-3: closed (A1.1).
````

2. For the human

None required. One choice is open if you want it: a single readout reader. Moving `readHoverReadoutState` and `hoverReadoutId` into lib.mjs, instead of copying them, needs a higher line ceiling than the ruled 140. The move counts twice: 46 lines deleted from regression.mjs and 46 added to lib.mjs. That figure is from line counts at the base, not a measured diff. The amendment as drafted stays within the ruled terms.

Notes for the custodian:
- Every `sha256:HASH-TBD` must be computed at b4dc05e08c1e24ef7d6904596bb2332b87dcf75b before commit (I have no Bash).
- At the base, the product lines M2 to M5 name are at the same line numbers as the form's dba12b8 pins (WorkingCanvas.tsx:1190 and :1860, HoverReadoutView.tsx:88, pickResolution.ts:204-206), and so are regression.mjs:852-860 and :1115-1123.
- I checked M2's target: `pickCandidateAt` is used only by the settle scheduler, at WorkingCanvas.tsx:794. So M2 moves only the settle re-pick, as §4 intends.

3. Files read
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-additions-reaim-identity-route-documents.md
- C:\dev\spatial-ide\state\directives\2026-10-08-m1-mutations-branch-docs08-adr036.md
- C:\dev\spatial-ide\frontends\shell\E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md
- C:\dev\spatial-ide\frontends\shell\e2e\lib.mjs
- C:\dev\spatial-ide\frontends\shell\e2e\regression.mjs (1-200, 835-879, 1085-1209, the line with `await main()`)
- C:\dev\spatial-ide\frontends\shell\e2e\source-changed.mjs, source-watch-idle.mjs, residency-harness.mjs (only the hover helpers found by search)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (search hits)
- C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx (1186-1193, 1857-1861, `pickCandidateAt` search), HoverReadoutView.tsx (85-89), pickResolution.ts (200-208)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (110-178)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (RULED 2026-10-09 blocks)
- C:\dev\spatial-ide\PLAN.yaml (the nodes e2e-hover-establishing-read-stale and e2e-first-poll-readout-elsewhere)
