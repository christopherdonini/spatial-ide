*The architect's draft of the two additions that ADV-2026-11-22-28 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-28-the-console-form-after-its-gate-amendment-1-then-attempt-2-the-five-open-items-as-recommended-the-stop-accounted-for-now.md`) items 3 and 4 put in the Console form's Amendment 1, with the joined-runs check of its item 2, tag node:console-stream-lane-limitation-67@amendment-1-additions, asked at 2026-11-22T17:52:31.445Z, read only at main 0f2078423378fb3f35346a6db9be5833ba0569b9 in a detached read checkout. Amendment 1 is appended from it, by script, in this commit. Filed by the custodian below the rule from its sixth hand-back in its transcript, 19455 bytes, sha256 cc1bd5da114e4f2ea3a9e57640749adc4839972d8221d155fa84116d1b140907, byte for byte except that 0 scratch-folder paths are written as <S>, and four entries of its list of files read, each a range ending one line past its file at 0f207842, carry the read checkout's path C:/dev/wt/read-1122/ before them, so that verify-cites reads them as loose references. Its run, from its fifth hand-back to its sixth: Read 21, Grep 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T17:52:39Z to 2026-11-22T17:59:17Z by its transcript; 0 calls named the main checkout.*

---

Done
REPORT PATH: state/consults/2026-11-22-console-stream-lane-amendment-1-additions-architect-draft.md
Reviewed: detached read worktree `C:/dev/wt/read-1122` @ 0f2078423378fb3f35346a6db9be5833ba0569b9 (main). Tag `node:console-stream-lane-limitation-67@amendment-1-additions`.

These are drafts for Amendment 1 of `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`. None is the human's wording. Self-references are by section, because the amendment edits the same file. Code cites are path:line at 0f2078423378; ranges are reading aids. I wrote no file and ran nothing. The additions agree with the gate's C1, E1 and D1 to D7 and do not touch their texts. The reading after P1 below uses D3's discard rule as D3 words it.

## A. The stop (ADV-2026-11-22-28 item 4; the gate's note 2)

### A.1 Which other-kind entries an open records, by reading

The path is MEASURE's `openPath` → `admitPath` → `runAdmitPath` → `admitDataset`, then `handleAdmitted` and App's effects.

| Entry (kind, name) | Recorded by | When, against P0 (the label two frames after `openPath` returns) and the readings | Per open |
|---|---|---|---|
| class A `open_dataset` | `admitDataset.ts:57`, through `client.ts:59` | Before `openPath` returns: awaited inside `admitPath` (`AdmissionPanel.tsx:430`, `:238`). Always before P0, so never in other-added. | one |
| class A `describe` | `admitDataset.ts:61`, through `client.ts:59` | The same: before P0. | one |
| class A `close_dataset`, for the dataset the open replaces | the workspace effect `App.tsx:1645-1650`, which calls `closeDataset` (`client.ts:136-137`) for each `selectClosable` resource (`workspaceState.ts:222-227`) | After React applies `resource.admitted`, which `handleAdmitted` dispatches (`App.tsx:1198`). `runAdmitPath` calls `handleAdmitted` before it returns (`AdmissionPanel.tsx:290`). The code fixes no order against P0: the row can land before P0 or between P0 and P1. | at most one in MEASURE', which runs no export (an export consumer could otherwise hold an older resource open, `App.tsx:1274`) and replaces one dataset per open |
| class B `binding_data_plane_attach` | `dataPlaneClient.ts:26` | Memoized once per process (`dataPlaneClient.ts:20-27`), at the first data-plane request (e.g. `tileViewportStreamManager.ts:1020`). The suite's loads before MEASURE' (LABEL' needs S > 0) have already recorded it, so it is not expected; if it does come, it is after P0. | at most one per process |

**Nothing else, by reading:**
- The open records no step: `App.tsx:1179-1180`, a comment ending "No step is recorded for the open."
- Every `gui-action` call site a grep of `recordNamed(` over `frontends/shell/src` finds is in a handler of a user's action or of the export ask (`App.tsx:1305`). None is on the open's path. I did not read every handler body; this is grep plus reading of `App.tsx:2056-2135`, `StudioLayout.tsx:95-117` and `:187-199`.
- The open's session-log lines and its `viewport_query` and `cancel` rows are of the stream kind.

### A.2 The rule's new text

The rule tells the open's own rows from any other by kind and name only.
- **Kind** is read from the row's container class: `.console-entry-class-a`, `-class-b` or `-class-c` (`ConsolePanel.tsx:164`, `:186`, `:195`).
- **Name** is read from what the row shows of its name:
  - class A: its header, the command (`ConsolePanel.tsx:165`);
  - class B: its prose's `(command)` (`:187`);
  - class C: its statement, which is its registry row's for that action (`:196`; `surfaceRegistry.ts:266-270`, `:275-278`).
- No argument, position or timing enters the rule (ADR-024).

The reading's own clicks are allowed by name and capped by count, so a Console click between P0 and P1 is not explained.

**§1, "May not claim".** Old text (copied byte for byte; it occurs once in the form):
```text
- That every entry a first look adds is of the stream kind. That is by reading, and S7 checks it.
```
New:
```text
- That every entry a first look adds is of the stream kind. That is by reading, and S7 checks it: an entry of the other kind recorded after P0 stops the measurement unless the open itself explains it (§6, the reading after P1).
```

**§5, P5.** Old (byte for byte, once):
```text
- P5: in MEASURE', every settled run has other-added = 0, and the 1280 by 800 runs on `filter-zoned.parquet` have stream-added ≥ 220.
```
New:
```text
- P5: in MEASURE', every settled run's entries of the other kind recorded after P0 are the open's own (§6): other-added is 0 or 1, the `close_dataset` of the dataset the open replaced landing before or after P0, with no `binding_data_plane_attach` (the process attached before MEASURE'); and the 1280 by 800 runs on `filter-zoned.parquet` have stream-added ≥ 220.
```

**§5, Falsification.** Old (byte for byte, once):
```text
- a first look adding an other-kind entry (S7);
```
New:
```text
- a first look adding an other-kind entry that the open itself does not explain (S7);
```

**§6, MEASURE's opening paragraph.** Old (a sub-line span, byte for byte, once):
```text
with the drawer collapsed
```
New:
```text
with the drawer collapsed from each run's step 1 to its P1 (the reading after P1 opens it, and closes it again before the next run)
```

**§6, Warm-up.** Old (byte for byte, once):
```text
- **Warm-up:** up to three opens of `filter-zoned.parquet` until S > 0. Otherwise the splits are marked inexact.
```
New:
```text
- **Warm-up:** up to three opens of `filter-zoned.parquet` until S > 0. Otherwise MEASURE' stops under S7 with `MEASURE': cannot tell the open's own entries from any other: no data request, cancel or log line was dropped after the warm-up (<label>)`. Once S > 0 it stays above 0, so every later run's P0 has S > 0.
```

**§6, The split.** Old (byte for byte, once):
```text
- **The split:** with S > 0 at P0, stream-added = ΔS and other-added = Δtotal − ΔS.
```
New:
```text
- **The split:** with S > 0 at P0, stream-added = ΔS and other-added = Δtotal − ΔS, both from P0 to P1.
- **The open's own entries of the other kind** (ADV-2026-11-22-28 item 4; by reading at 0f2078423378): `open_dataset` and `describe` are recorded before `openPath` returns (`frontends/shell/src/admission/admitDataset.ts:57`, `:61`; `frontends/shell/src/admission/AdmissionPanel.tsx:430`), so before P0, and are never in other-added. After P0 the open can add only: at most one `close_dataset`, for the dataset it replaces, sent by the workspace effect (`frontends/shell/src/App.tsx:1645-1650`) at a time the code does not fix against P0; and at most one `binding_data_plane_attach`, memoized once per process (`frontends/shell/src/streaming/dataPlaneClient.ts:20-27`). The open records no step (`frontends/shell/src/App.tsx:1180`) and no gui-action.
- **The reading after P1.** Each settled run, after P1, makes §2.5's R1 reading with P0 in place of R0 and §2.5's discard rule. Each reading is one `page.evaluate`: it opens the Console if closed; reads the label (N₂, S₂, O₂); computes a = (N₂ − N₀) + (O₂ − O₀) and L = a + min(M, S₂ − S₀); and clicks the closed group headers among the last L rendered entries, counting each closed group's ×N, walking from the end. A reading kept that clicks nothing is final. Readings are two frames apart, bounded to 30 s. Then the Console is closed. With a₁ = other-added (P0 to P1), the run decides in this order, each stop by name:
  1. A label that does not parse: S7, `MEASURE': the Console's label could not be read after P1 (<text>)`.
  2. O₂ − O₀ > N₀ − M: S7, `MEASURE': cannot tell the open's own entries from any other: <ΔO> entries of the other kind were dropped after P0, more than the <N0 - M> the other ring held then (P0: <text>; now: <text>)`.
  3. No final reading within 30 s: S7, `MEASURE': within 30000ms of P1 no reading had every group open among the newest <L> entries (<last reading>)`.
  4. Otherwise, take the entries of the other kind among the last L of the final reading, each by its kind and the name it shows: a class-A row whose header is not `viewport_query` or `cancel`, a class-B row whose prose does not end `(binding_log_session_event)`, and every class-C or unclassified row. If they do not number a: S7, as in 2, with `their count <k> is not <a>`. The run goes on only when they are: at most one `close_dataset`; at most one `binding_data_plane_attach`; and rows of `console.togglePanelExpanded` and `console.toggleGroupExpanded`, the reading's own, numbering together at most a − a₁. Otherwise: S7, `MEASURE': an entry of the other kind was recorded after P0 that the open does not explain: <names> (P0: <text>; P1: <text>; final: <text>)`.
  The JSON records, per run, a₁, a, L, the names found and the three labels. A stop ends MEASURE' at that run; it is not retried.
```

**§6, Rule W step 2.** Old (byte for byte, once):
```text
2. Any other-added > 0 is S7.
```
New:
```text
2. A run stopped under S7 by the reading after P1 ends the measurement, and rule W is not applied. Other-added from the open's own entries is recorded and enters neither Y nor X, which count stream-added only.
```

**§11, S7.** Old (byte for byte, once):
```text
- S7: MEASURE' gives other-added > 0, or a grammar disagreement.
```
New:
```text
- S7: MEASURE' records, after P0, an entry of the other kind that the open itself does not explain, or cannot tell the open's own entries from any other (§6, the warm-up and the reading after P1), or a grammar disagreement.
```

**Places that read S7 and are unchanged, because they still hold:**
- K1's clause "a load's traffic is the stream kind, … checked under S7": the open's `close_dataset` is the open's own, not the load's.
- K2's clause "drops none of the other entries is CL1, plus S7".
- §1's may-claim line on what a first look adds.

**Ceiling.** The reading after P1 adds about 50 lines to `console.mjs`, test code in Scope. The estimate becomes about 726, within 850.

### A.3 §2.5 with the rule changed

§2.5 is not edited, and no line of E-AND reads other-added or S7.
- E-AND's cards are Applies. An Apply enqueues a step (`App.tsx:1072`) and changes no resource, so it records no `close_dataset`, and the open's rows do not enter a.
- F1, F6, F7, F2′, F3′, F4 and PASS hold as §2.5 gives them, with D3 and D4 applied. E-AND's ordinary-state bound (card B's own other-kind entries and their groups at most 62) is unchanged.

The reading after P1 copies §2.5's reading shape. Each of its cases fails by name where the suite cannot tell:
- no split (the warm-up stop);
- a label that does not parse (1);
- a dropped held row (2);
- no settled reading (3);
- a count that does not match (4).

The run goes on only when every other-kind entry recorded after P0 is found and named. No case goes on where the suite cannot tell.

**Ordinary state** (by reading, not counted): the run goes on when a ≤ N₀ − M (128 with the other ring full; the same bound when it is not). Here a = a₁ (≤ 1) + 1 (opening the drawer) + the closed groups clicked among the last L (≤ 64 stream groups, plus few others). That is about 67 or less, so the reading decides. An unmutated stop is S7, and goes to the advisor.

## B. Rule W and the joined runs (ADV-2026-11-22-28 items 2 and 3)

**B.1 Rule W.** New (one sentence, for Amendment 1):
```text
Rule W's sentences (⟨H⟩'s two forms and ⟨FIGURE⟩) and its table of fractions are part of item 67's words, so they come to the advisor with K1 and K2 after attempt 2 (ADV-2026-11-22-28 item 3), and the commit that fills them in after MEASURE' is read narrowly by the reviewer against the rule (§10, commit 4).
```

**B.2 OPEN-4.**

**Finding: K2 carries the sentence, but narrower than the code.** Its last sentence speaks only of separators "of the first kind". By the grouping code and the two rings, the case also runs the other way.
- Groups are runs of consecutive entries with the same `${kind}:${name}` (`consoleViewModel.ts:160-169`, `:177-189`).
- Each ring drops only its own oldest entries (§2.3 item 2). A separator of the runs' own kind is newer than the earlier run, so that run is dropped first and no join follows.
- Every separator can be dropped with both runs kept only when the separators are of the other kind. That happens in two directions:
  - stream entries between two runs of an other-kind entry (VL3's case);
  - other-kind entries between two runs of a stream entry, for example a gui-action between two `viewport_query` runs, dropped after 128 newer other-kind entries while the stream ring still holds both runs.

K1 carries no such sentence.

**K2, its last sentence.** Old (a sub-line span of K2's quoted paragraph in §2.4, byte for byte, once):
```text
When the entries of the first kind that separate two runs of the same entry are dropped, the two runs show as one group, which is closed unless the earlier run was a group you had opened.
```
New:
```text
When the entries that separate two runs of the same entry are dropped and both runs are still kept, the two runs show as one group, which is closed unless the earlier run was a group you had opened.
```

**§2.3 item 6** (recommended, so that the change's description matches K2). Old (byte for byte, once):
```text
6. **Grouping after a drop** (by reading; VL3; OPEN-4): two runs of one other-kind entry whose stream separators are dropped join into one group.
```
New:
```text
6. **Grouping after a drop** (by reading; VL3; OPEN-4, ruled by ADV-2026-11-22-28 item 2): two runs of one entry whose separators are all dropped while both runs are kept join into one group. The separators are then of the other kind: stream entries between two runs of an other-kind entry (VL3), or other-kind entries between two runs of a stream entry (by reading, not tested).
```

## C. The OPEN items

```text
OPEN-2, OPEN-3, OPEN-4, OPEN-7 and OPEN-8 are closed as §12 recommends, by ADV-2026-11-22-28 item 2 (OPEN-4's sentence in K2 as Amendment 1 words it; OPEN-7's §6 with the stop of item 4).
```

## Clause checks

**§1 new line:**
- "an entry of the other kind recorded after P0 stops the measurement unless the open itself explains it" is S7's new text and the reading's step 4.

**P5 new:**
- "other-added is 0 or 1": `open_dataset` and `describe` come before P0 (`admitDataset.ts:57`, `:61`; `AdmissionPanel.tsx:430`).
- "the `close_dataset` … landing before or after P0": `App.tsx:1645-1650`, after `App.tsx:1198` via `AdmissionPanel.tsx:290`; the code fixes no order against P0.
- "no `binding_data_plane_attach`": `dataPlaneClient.ts:20-27`, memoized once per process. LABEL' runs before MEASURE' and needs stream loads, and the tiled path attaches (`tileViewportStreamManager.ts:1020`). Hence "(the process attached before MEASURE')".
- "≥ 220" is unchanged from the form.

**Falsification new:** S7's new text.

**§6 drawer phrase:**
- "collapsed from each run's step 1 to its P1" is what the run's steps do.
- "the reading after P1 opens it, and closes it again" is the reading's text.

**Warm-up new:**
- "no data request, cancel or log line was dropped" means S = 0.
- "Once S > 0 it stays above 0": S is the stream ring's drop counter, which only increments (§2.3 item 2).

**The split and the reading after P1:**
- The arithmetic of a and L is §2.5's, exact when S₀ > 0. Every entry after P0 sorts after those held at P0 (`entries()` by `seq`, §2.3 item 2).
- "the other ring held N₀ − M at P0" holds because the stream ring is full when S₀ > 0.
- The kind from the container class is `ConsolePanel.tsx:164`, `:186`, `:195`, `:201-203`.
- The name:
  - class A header: `ConsolePanel.tsx:165` (`commandLabel`);
  - class B `(command)`: `:187`;
  - class C statement: `:196`, with the two toggle rows' statements at `surfaceRegistry.ts:266-270` and `:275-278`.
- "the reading's own" toggle rows: the reading's only actions are opening the drawer (`ConsolePanel.tsx:79`) and group clicks (`:123`). All come after P1, so they number a − a₁.
- "at most one `close_dataset`": `workspaceState.ts:222-227` and `App.tsx:1646-1648` close each closable resource once. MEASURE' holds one dataset and no export.
- The named stops follow D3's discard rule, with no pass where the suite cannot tell (A.3).

**Rule W step 2 new:**
- "enters neither Y nor X, which count stream-added only" is Rule W step 1, unchanged.

**S7 new:** the warm-up and the reading's stops above.

**B.1:**
- "come to the advisor with K1 and K2 after attempt 2" is ADV-2026-11-22-28 items 3 and 5.
- "read narrowly by the reviewer against the rule" is ADV-2026-11-22-28 item 3 and §10 commit 4.

**K2 new sentence:**
- "the entries that separate two runs of the same entry": same key, consecutive only (`consoleViewModel.ts:160-169`, `:177-189`).
- "are dropped and both runs are still kept": per-ring oldest-first eviction (§2.3 item 2). That makes the separators of the other kind, in either direction.
- "show as one group": `groupConsecutiveEntries` over the merged entries.
- "closed unless the earlier run was a group you had opened": the row's key is the group's first entry's `seq` (`ConsolePanel.tsx:96`), and its open state is local to that row (`:107`). The joined group keeps the earlier run's first entry, so it keeps that key and that state. A single-entry run shows no header to open (`:109-111`).
- The stream-run direction is by reading of this code. VL3 tests only the other-kind-run direction.

**§2.3 item 6 new:** as for the K2 sentence.

**C:** ADV-2026-11-22-28 item 2's five items.

## For the custodian and the advisor

1. **The warm-up's "inexact" path becomes a stop.** An inexact split cannot be explained, so it could not go on without passing where the suite cannot tell. Once S > 0, every later run has it, so this stop is foreseeable only if the warm-up fails. That is a change to §6's shape under ADV-2026-11-22-28 item 4.
2. **Class-C rows are named by their registry statement.** The test therefore holds two registry strings, as literals or prefixes. They are not product strings, and not a ring size.
3. **VL3 tests only one direction of the joined runs.** If the gate wants the stream-run direction proven too, VL3's row can gain the reverse case in `consoleViewModel.test.ts`, in Scope (about 20 lines; M-9 would fail it).

## Files read

- `<S>/msg-console-a1-drafter-final.md`
- `<S>/ADV-2026-11-22-28.md`
- `<S>/console-form-gate-1-report.md`
- In `C:/dev/wt/read-1122` at 0f2078423378:
  - `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md` (lines 80-89, 196-220, 370-444, 480-594, and greps)
  - `frontends/shell/src/App.tsx` (lines 1160-1309, 1600-1679, 2056-2144, and greps)
  - `frontends/shell/src/admission/AdmissionPanel.tsx:200-444`
  - `C:/dev/wt/read-1122/frontends/shell/src/admission/admitDataset.ts:40-76`
  - `frontends/shell/src/skp/client.ts` (whole)
  - `frontends/shell/src/streaming/dataPlaneClient.ts:10-44`
  - `C:/dev/wt/read-1122/frontends/shell/src/workspace/workspaceState.ts:205-228`
  - `frontends/shell/src/layout/StudioLayout.tsx:88-122` and `:180-204`
  - `C:/dev/wt/read-1122/frontends/shell/src/console/ConsolePanel.tsx:84-208`
  - `C:/dev/wt/read-1122/frontends/shell/src/console/consoleViewModel.ts:150-190`
  - `frontends/shell/src/console/surfaceRegistry.ts` (greps)
  - `frontends/shell/src/e2e-test-surface.ts` (grep)
  - greps of `frontends/shell/src` for `recordNamed(`, `invoke(`, `openPath`/`admitPath`, `recordStep(`/`closeDataset(`/`selectClosable`, and `describeDataset`/`dataPlaneAttach(`/`crsCatalog()`
