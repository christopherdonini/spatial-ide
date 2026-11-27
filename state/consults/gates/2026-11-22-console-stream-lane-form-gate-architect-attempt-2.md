Reviewed: main at b1261d72b01a2432f0feeee8db4300cce7d66488, in the detached read checkout C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's form gate, attempt 2, on the Console form's Amendment 1 alone, by ADV-2026-11-22-28 item 1, node:console-stream-lane-limitation-67@form-gate-architect-2, dispatched at 2026-11-22T18:30:30.435Z; its run: Grep 20, Read 23, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T18:30:46Z to 2026-11-22T18:42:01Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 17915 bytes, sha256 650394628645b7b789be6d18bfba879d5c342bf7f1188338f22b095e31f6de1b, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; D1 to D6 are applied in this commit as the form's Amendment 2 under section 31 (d).)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1122 @ b1261d72b01a2432f0feeee8db4300cce7d66488
REPORT PATH: state/consults/gates/2026-11-22-console-stream-lane-form-gate-architect-attempt-2.md

Tag `node:console-stream-lane-limitation-67@form-gate-architect-2`. Branch main, detached read checkout. I read Amendment 1 first and the form above it as context, then attempt 1's report, ADV-2026-11-22-28 in full, and the additions draft. I used Read, Grep and Glob only and ran nothing. Code cites are path:line at b1261d72. The commits from 0f207842 to b1261d72 are docs-only, so attempt 1's code cites still hold. None of the texts below is the human's wording: all are the architect's. Under §31(d) the custodian applies each new text with no re-gate, in an appended Amendment 2, and the PR body lists them.

There is no Correctness or Evidence finding. The build may start on this verdict (ADV-2026-11-22-28 items 1 and 5). Before the merge, D1 to D6 must be fixed. D3 must be in place before commit 3, and D4 before commit 2.

---

## Check 1: the gate's words (Amendment 1 item 1)

- **Copies.** I compared every old and new text for C1 (three texts), E1, D1, D2, D3 (two), D4, D5, D6 and D7 (two) with attempt 1's report, lines 30-184. Each one is that report's text. Byte equality is the script's claim, and the reviewer re-checks it. Each old text occurs once above Amendment 1, at form lines 172, 173, 174, 368, 243, 367, 269, 288, 263, 155, 257, 11 and 64.
- **Each new text meets its finding:**
  - **C1:** both rings are protected, since ΔO and ΔS are each ≤ N_base − M. M-G1 still fails it.
  - **E1:** the condition p_s ≤ f_o is stated. The source is corrected (`frontends/shell/src/App.tsx:394-395`, `:1072`; `frontends/shell/src/workspace/stepRecorder.ts:49-55`, `:69-75`; `frontends/shell/src/skp/client.ts:59`). The build-time check and the route to the advisor are named.
  - **D1:** the edit is line 280 only. The phrase "by at most the recorder's 256 so none of its own rows can have been evicted." is a sub-line span of `frontends/shell/e2e/README.md:280`, and line 279 ends "and the label's total may grow". The new clause is C1's check.
  - **D2, D3, D4, D5 and D7:** each meets its finding.
  - **D6:** the reference form is right, but the hash was never filled in (D1 below).
- **"Gate-log row 837"** resolves. `state/gate-log.json:853` is the 837th row, because line 1 is `[` and 15 lines before it are lone commas.

## Check 2: the additions (Amendment 1 item 2)

**Which other-kind entries an open records (ADV-2026-11-22-28 item 4).** Each claim below is true at b1261d72:
- `open_dataset` and `describe` are awaited before `openPath` returns, so they come before P0 (`frontends/shell/src/admission/admitDataset.ts:57`, `:61`; `frontends/shell/src/admission/AdmissionPanel.tsx:238`, `:430`).
- `close_dataset` comes from the workspace effect, at most once for each closable resource (`frontends/shell/src/App.tsx:1645-1650`; `frontends/shell/src/workspace/workspaceState.ts:222-227`). The only consumers are views and exports (`frontends/shell/src/App.tsx:1274`, `:1665`). `console.mjs`'s only publish step, CLASSB', is a prepare with no run.
- `binding_data_plane_attach` is memoized for the life of the process (`frontends/shell/src/streaming/dataPlaneClient.ts:20-41`).
- No step is recorded (`frontends/shell/src/App.tsx:1180`).
- On the open's path, class-A entries come only from `frontends/shell/src/skp/client.ts`, and after P0 those are only `viewport_query`, `cancel` and `close_dataset`. Class-B entries come only from the five binding-command call sites (`frontends/shell/src/console/recorder.ts:353-357`). `binding_crs_catalog` is recorded only from a remediation form or a hook.
- The one exception is D2: an open made while an export runs records the export ask's gui-action.

**Kind and name only.** Each entry is told by its kind, from its container class (`frontends/shell/src/console/ConsolePanel.tsx:164`, `:186`, `:195`, `:202`), and by the name it shows:
- class A by its header (`:165`);
- class B by the `(command)` in its prose (`:187`);
- class C by its statement (`:196`), which is the registry row's (`frontends/shell/src/console/consoleViewModel.ts:146`; `frontends/shell/src/console/surfaceRegistry.ts:266-270`, `:275-278`).

The window is set by label counts, not by entries. No argument or timing of an entry enters the rule. D3 tightens the class-C match.

**A run stops on an unexplained entry.**
- The arithmetic of a and L is exact when S₀ > 0, which the warm-up stop guarantees. The grouping is by consecutive `${kind}:${name}` (`frontends/shell/src/console/consoleViewModel.ts:160-189`).
- Step 2 guards the case where a held row is gone. Step 4 needs all a entries to be named, and allows only close ≤ 1, attach ≤ 1 and toggles ≤ a − a₁. Any other name stops the run, and so does a Console click between P0 and P1.
- In the ordinary state a is at most about 67, against the 128 the other ring held at P0.
- **The one case that goes on unread is an unsettled run.** "One run" step 5 excludes it, and the reading is made only for "Each settled run". It enters no figure, because rule W step 1 counts settled runs only. But Amendment 1's new §1 line says every such entry stops the measurement (D6). The advisor should know about this under item 4. Reading unsettled runs as well would change test code, could add a stop when no reading becomes final during live traffic, and would need a re-gate of that text.

**Agreement with item 1.** The reading after P1 uses D3's discard rule and D3's "no final reading" stop, and its start after the settle agrees with D4.

**§2.5 still holds.** No line of E-AND reads other-added or S7. E-AND's cards are Applies, which change no resource (`frontends/shell/src/App.tsx:1072`), so they record no `close_dataset`. F1, F2′, F3′, F4, F6, F7 and PASS are unchanged with D2, D3 and D4 applied. MEASURE' is in `console.mjs` and runs after GROUP', LABEL' and UNCLASS'. REGRESS' spawns its own processes (`frontends/shell/e2e/console.mjs:932`).

## Check 3: the draft's notes 1 to 3

1. **The warm-up stop is within item 4.** With S = 0 the held count does not split, so no run's entries can be told apart. Going on "inexact" would go on where the suite cannot tell. OPEN-7 is ruled "as section 6 gives it, with item 4 below". In practice the stop cannot fire once LABEL' has passed: S only increments (`frontends/shell/src/console/recorder.ts:285`), and the singleton has no reset (`:339`).
2. **The class-C strings are test literals in `console.mjs`.** They copy product strings that the Console shows. No product string is changed (§8 item 6), and none is a ring size (§8 item 5). Each must match the whole statement. A shared prefix such as the start "no API equivalent exists" would let any class-C row pass as a toggle, so the run would go on where the suite cannot tell. A literal that has drifted fails safe as an S7 stop. This is D3.
3. **VL3's reverse case: yes, add it before the build.** K2's clause check (form §2.4) says "joined runs are VL3". Under Amendment 1's K2 sentence, which covers both directions, that check would be half true. The stream-run direction is reachable in ordinary use: two `viewport_query` runs separated by a user action, while 128 newer other-kind entries are recorded. The row is D4.

## Check 4: the OPEN items (Amendment 1 item 3)

These match ADV-2026-11-22-28 item 2:
- OPEN-2: the registry rows.
- OPEN-3: `entries()`.
- OPEN-4: K2's sentence, which goes to the advisor with item 67's words (Amendment 1 item 4).
- OPEN-7: §6 with item 4.
- OPEN-8: the standard worker and the Sonnet tester.

## Check 5: the ceiling

- The draft's 726 (676 + 50) leaves out two things:
  - D5's doc rewrites, about 40 lines with both numstat columns counted: `push`, `droppedCount` and `entries` docs, `collapsedCountSync.ts:8`, and `console.mjs` lines 67-68, 241 and 829;
  - E1's record line in `command-bar.mjs`, about 5 lines.
- D4 adds about 20 lines.
- **My recount is about 790, within 850**, with a margin of about 60.
- The risk is `console.mjs`. Its 160 + 50 now covers LABEL', MEASURE' with its warm-up, 24 runs and the reading after P1, GROUP's two-branch check, and the parsing of L1. An overrun is class 8, and nothing is cut.
- The other declared values hold: one constant, the fourteen files, the counting commands, and §5's list of files declared unchanged. The reading after P1 is test code, and VL3′ goes in a file that is in Scope.

## Check 6: for the advisor (ADV-2026-11-22-28 items 3 and 5); not reworded

| Item | Where it stands |
|---|---|
| L1 | §2.4, unchanged |
| K1 | §2.4, unchanged |
| K2 | §2.4; its last sentence is replaced by Amendment 1 item 2 (c) |
| K3 | §2.4 requirements, unchanged; the worker writes the words at the build |
| R1 | §2.4, unchanged |
| R2 | §2.4 under OPEN-6, unchanged |
| W1 | §2.4, replaced by Amendment 1 item 1, D1 |
| W2 and W3 | §2.4, unchanged |
| Rule W | §6 step 3 (⟨H⟩'s two forms), step 4 (⟨FIGURE⟩) and step 5 (the table), unchanged; Amendment 1 item 2 (b) makes them item 67's words; step 2, replaced by Amendment 1 item 2 (a), is not among those words |

What is true and what is not:
- L1, K1, K2 as amended, R1, R2, W1 as amended, W2 and W3 are true of the code and of the planned code by their clause checks.
- **One is untrue.** Rule W step 3's second form, "can add up to ⟨Y⟩ entries of the first kind", states an upper limit. §6 says "The figures are lower bounds", so if this form ever landed it would state a limit the measurement does not give. It is reached only if Y < 100, which P5 and LABEL' predict against. It goes to the advisor unreworded.
- **A reading note, not a finding.** ⟨FRACTION⟩ is exact for a load of exactly Y entries. Because ⟨FIGURE⟩ says "at least ⟨Y⟩", a larger load shows a smaller share. This is the ruled design (ADV-2026-11-22-22 item 2).

---

## Correctness

None.

## Evidence

None.

## Documentation (must be fixed before the merge; none fails the gate)

**D1. The D6 reference still carries a placeholder hash.** The custodian's script fills it in with the sha256 of the whole line 12 of the directive, LF bytes, at 0f2078423378fb3f35346a6db9be5833ba0569b9, and the reviewer recomputes it.

```text
sha256:<line 12's hash, by the custodian's script>
```
```text
sha256:<64 hex digits: the sha256 of line 12 as committed at 0f2078423378fb3f35346a6db9be5833ba0569b9, LF bytes, written by the custodian's script; the reviewer recomputes it>
```
Clause check: round 12 (b) and round 14's pin form. The rest of the reference is already contiguous on one line (round 15 (d)).

**D2. "No gui-action" leaves out the export ask.**

```text
The open records no step (`frontends/shell/src/App.tsx:1180`) and no gui-action.
```
```text
The open records no step (`frontends/shell/src/App.tsx:1180`) and no gui-action after P0: the one gui-action an open can record, `dataset.openDuringExport` (`frontends/shell/src/App.tsx:1305`), answers the export ask, which comes before the admission (`frontends/shell/src/admission/AdmissionPanel.tsx:221`, `:238`), and MEASURE' runs no export.
```
Clause check:
- The ask's row is recorded at `frontends/shell/src/App.tsx:1305`, before `ask.answer` at `:1316`.
- `confirmOpen` is awaited before `admit` (`frontends/shell/src/admission/AdmissionPanel.tsx:221`, `:238`). With no export run it resolves true at once (`frontends/shell/src/App.tsx:1289-1291`).
- MEASURE's steps (§6) contain no export.

**D3. The class-C toggles must be matched by their whole statement (before commit 3).**

```text
and rows of `console.togglePanelExpanded` and `console.toggleGroupExpanded`, the reading's own, numbering together at most a − a₁.
```
```text
and rows of `console.togglePanelExpanded` and `console.toggleGroupExpanded`, the reading's own, numbering together at most a − a₁, each told by its row's statement equal as a whole to that action's statement in the registry (`frontends/shell/src/console/surfaceRegistry.ts:266-270`, `:275-278`), never by a part that another row's statement shares.
```
Clause check:
- The row shows `vm.statement` (`frontends/shell/src/console/ConsolePanel.tsx:196`), which is `row.statement` (`frontends/shell/src/console/consoleViewModel.ts:146`).
- The two statements differ from each other and from the other class-C rows I read (`frontends/shell/src/console/surfaceRegistry.ts:240-289`). Every one of them begins with the same prefix.

**D4. VL3′, the stream-run direction (before commit 2, so that it is red at the base with the other new tests).** There are three texts.

```text
| VL3 | consoleViewModel.test.ts | real recorder: A, `viewport_query`, B, then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
```
```text
| VL3 | consoleViewModel.test.ts | real recorder: A, `viewport_query`, B, then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
| VL3′ | consoleViewModel.test.ts | real recorder: two `viewport_query`, a gui-action G, two `viewport_query`, then M gui-actions of another name: G is dropped, and the first group is the four `viewport_query` | all evicted | M-9: grouping breaks on a seq gap |
```
```text
or other-kind entries between two runs of a stream entry (by reading, not tested).
```
```text
or other-kind entries between two runs of a stream entry (VL3′).
```
```text
Group closing is `ConsolePanel.tsx:96`, and joined runs are VL3.
```
```text
Group closing is `ConsolePanel.tsx:96`, and joined runs are VL3 and VL3′.
```
Clause check:
- At M = 128 the stream ring holds all four `viewport_query`. The other ring holds G plus M, so G is evicted and one is dropped. The display is the four `viewport_query`, then the gui-actions, so the first group is all four (`frontends/shell/src/console/consoleViewModel.ts:177-189`).
- At the base there is one ring of the imported M = 256 and 261 entries, so the five oldest are evicted: "all evicted".
- Under M-9 the seq gap where G was splits the group in two, so the test fails.
- The test uses no literal ring size (§8 item 5). It adds about 20 lines to `consoleViewModel.test.ts`.

**D5. The estimate.** Amendment 1 records no recount; its basis is the draft's 726. Record about 790 (check 5), with `console.mjs` named as the risk. §7 is not edited.

**D6. The new §1 line overstates the check's reach (an unsettled run is not read).** I report this under Documentation, not Evidence. The line sits under "May not claim", and the section it cites reads only settled runs. No figure and no claim of the piece rests on an unsettled run. Standing alone, though, it says more than the procedure does.

```text
stops the measurement unless the open itself explains it (§6, the reading after P1).
```
```text
stops the measurement unless the open itself explains it (§6, the reading after P1). This holds for a settled run; an unsettled run is not read and enters no figure (§6, One run, step 5).
```
Clause check:
- "not read": Amendment 1's reading bullet says "Each settled run, after P1".
- "enters no figure": §6 "One run" step 5 ("an unsettled run is excluded") and rule W step 1 ("Over the settled runs").

## Notes (not findings)

1. **The walk.** The reading, like §2.5's, must click a closed group that runs partly into the last L entries. Otherwise step 4 cannot name the entries in it, and an ordinary run stops. Walking from the end with a remaining count clicks such a group naturally. The worker should do it that way.
2. **Toggles counted only by number.** A stray toggle between P0 and P1 is let through only if a `close_dataset` also comes after P1, which is after a 3 s quiet settle. That is not reachable in ordinary use.
3. **Round 25 items** hold (§8 item 12). No five-line form is involved.
4. **docs/01** principles 4 and 7, **docs/02**, **docs/10** (no wire change) and **ADR-006** are unchanged by Amendment 1.

## Files read

- In `C:/dev/wt/read-1122` at b1261d72:
  - `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` (whole);
  - `state/consults/gates/2026-11-22-console-stream-lane-form-gate-architect.md`;
  - `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-28-the-console-form-after-its-gate-amendment-1-then-attempt-2-the-five-open-items-as-recommended-the-stop-accounted-for-now.md`;
  - `state/consults/2026-11-22-console-stream-lane-amendment-1-additions-architect-draft.md`;
  - `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md` (grep, line 12);
  - `governance/AUTONOMY.md:530-552`;
  - `state/gate-log.json` (lines 1-18 and 836-838, and greps);
  - `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md` (grep).
- Code, in the same checkout:
  - `frontends/shell/src/skp/client.ts` (whole);
  - `frontends/shell/src/console/recorder.ts:180-373`;
  - `frontends/shell/src/console/ConsolePanel.tsx:36-208`;
  - `frontends/shell/src/console/surfaceRegistry.ts:240-289`;
  - `frontends/shell/src/console/consoleViewModel.ts:150-190`, and a grep;
  - `frontends/shell/src/admission/admitDataset.ts` (whole);
  - `frontends/shell/src/admission/AdmissionPanel.tsx:220-444`;
  - `frontends/shell/src/App.tsx` (lines 1160-1309, 1309-1322, 1595-1684 and 2050-2169);
  - `frontends/shell/src/streaming/dataPlaneClient.ts` (whole);
  - `frontends/shell/src/workspace/workspaceState.ts:195-228`;
  - `frontends/shell/e2e/README.md:274-281`;
  - greps of `frontends/shell/src` for `recordNamed(`, the callers of `crsCatalog`, `describe`, `closeDataset` and `dataPlaneAttach`, imports of the client module, `consumer.acquired`, `reveal`, `saveProject(` and `recordStep(`;
  - greps of `frontends/shell/e2e/console.mjs`.

Model: claude-opus-5-5
