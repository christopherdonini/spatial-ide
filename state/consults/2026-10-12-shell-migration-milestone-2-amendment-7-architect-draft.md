*Custodian's filing note (2026-10-12): the architect's draft of milestone 2's Amendment 7 (B3's late-cancel declaration, class 9, as Amendment 6 item 3 lists), at main 2ca3a53c; the run 2026-10-12T05:16:51Z to 2026-10-12T05:24:20Z by its transcript. It arrived as a message and is extracted here by script from the SubagentHandback call in its transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 11a1592ef8da5d37398a994a8108ea63df646f7119696f957ce9875da14671d7. Write audit PASS: zero write calls (Read 25, Grep 12, Glob 2). The amendment is appended to the form with its 20 pins hashed at 2ca3a53c and item 11's reuse lines byte-copied; its HASH-TBD placeholders here are left as drafted.*

---

Reviewed: main @ 2ca3a53ca812684a7b2579980db2f980c5d2a286

**Verdict: pass with notes.** This is a drafting consult, not a gate. Nothing blocks B3 except OPEN-12, which holds only where the ask and the statement render.

I took the hash from `.git/refs/heads/main`, which matches your message. I read every file from the main checkout at that commit: the session's git status showed branch main, with untracked files only outside these paths.

## 1. What I decided and why

- **The seam fact that decides the shape.**
  - `binding_publish_cancel` answers true only when the token is in the registry (`publish.rs:1109-1118`). The run's key is removed only after the run's body returns (`publish.rs:1183-1184`).
  - The kernel's last cancel check is `kernel/src/publish/mod.rs:906`. After that line come the sidecar, the size walk and the rename (`:934`), and the run returns success.
  - So when `cancel()` answers true, the export can still finish. When it answers false, the run has already returned.
  - The late-cancel statement is therefore decided by the run's own outcome, never by `cancel()`'s answer. A statement driven by that boolean would be built on an interface the host doesn't have.
- **Why B3's report shape changes.**
  - B3's report, `{cancel} | null`, cannot carry the outcome.
  - The old PublishPanel is keyed on the old handle (`App.tsx:2034-2043`), so it unmounts as soon as the new dataset is admitted. The outcome then has no screen.
  - The report therefore becomes `{cancel, ended}`, where `ended` is a promise that never rejects. It resolves to the run's outcome, and it is built from the existing settle wrappers.
  - `ended` also triggers the consumer release, so the release and the statement come from one place.
- **Prepare-phase runs never get the statement.** A prepare run writes nothing (`types.ts:52-61`; `publish.rs:1301-1305`). Execute cannot run without the typed phrase on a prompt that has gone, so there is no bundle to point at.
- **The most ordinary late case is not a race.** The ask stands until a choice is made, so the export can finish while the operator is reading it. E-ASK's new third step uses exactly that, so it is deterministic.
- **S1 needs form text, and I folded it in.** Phase B adds the acquire action anyway (§2.1(c)). Making it idempotent, and having the `[admitted]` setup re-acquire the view's consumer, closes the case the reviewer named. That case is a re-run of the `[admitted]` effect without a rebind, which today would leave a live handle closable once the export releases it.
- **S4 needs no text here.** It concerns RB4 and E-GEN (§2.3, §4), not B3's seam. The seam rule already requires RB4's session end to come through App's real route.
- **A finding outside the late cancel.**
  - B3 says the ask renders in `section.source` "beneath AdmissionPanel" (my paraphrase).
  - At main, AdmissionPanel is in `region.layers` (`App.tsx:1713`), and `section.source` holds DescribeSummary (`App.tsx:1717`).
  - The statement renders where the ask does, so this goes to the human as OPEN-12.

## 2. The amendment

````markdown
### Amendment 7 — scope addition: the late-cancel statement, part of B3 (class 9; `state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 4), declared as Amendment 6 item 3 lists; S1 of PR #212's gate 1 absorbed into the operation consumer's shape

*Drafted by the architect at main 2ca3a53ca812684a7b2579980db2f980c5d2a286. Phase A's results have been seen (Amendments 4 and 5). This is written before any code of B3. References only; nothing below is a quotation. The proposed words in item 3 are new text for the human's P6 sight. Every pin is historical (§0.3), and the tree at phase B's base is authoritative for the work.*

1. **The interfaces this addition is drawn against** (the consuming side, read first).
   - The execute seam: PublishDialog's `execute` prop, frontends/shell/src/publish/PublishDialog.tsx:119-136 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. Its one call is in `handleSubmit`, frontends/shell/src/publish/PublishDialog.tsx:187-202 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
     - PublishControls passes `publishExecute` straight through: frontends/shell/src/publish/PublishPanel.tsx:646-655 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
     - The dev hook's path is frontends/shell/src/publish/PublishPanel.tsx:459-467 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
   - The outcome types: frontends/shell/src/publish/types.ts:52-87 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. `bundle_path` is carried only by `success` and `succeeded-unaudited`.
   - The cancel's answer:
     - frontends/shell/src/publish/client.ts:92-109 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD;
     - frontends/shell/src-tauri/src/commands.rs:445-456 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD;
     - frontends/shell/src-tauri/src/publish.rs:1106-1118 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD;
     - the key's removal after the body returns: frontends/shell/src-tauri/src/publish.rs:1171-1186 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
     - True means a token was found and set, never that the run stopped.
   - The kernel's last cancel check: kernel/src/publish/mod.rs:904-906 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. The finalize and the outcome's path: kernel/src/publish/mod.rs:934-937 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
   - The host's outcome mapping: frontends/shell/src-tauri/src/publish.rs:838-866 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. A cancel the kernel observed ends as `refused`.
   - The prepare phase writes nothing: frontends/shell/src-tauri/src/publish.rs:1301-1305 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. Its token is not registered during the picker window: frontends/shell/src-tauri/src/commands.rs:351-357 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
   - The panel is keyed on the handle: frontends/shell/src/App.tsx:2034-2043 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. So after an admission the old panel shows no outcome.
   - The workspace: frontends/shell/src/workspace/workspaceState.ts:43-66 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD, frontends/shell/src/workspace/workspaceState.ts:117-155 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD, and App's close and release at frontends/shell/src/App.tsx:1305-1325 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.

2. **Shape (§2).**
   - (a) **The report.** B3's report is replaced. `onExportRunning(run: ExportRunReport)` is called once, when a run starts.
     - The types: `ExportRunReport = {cancel: () => Promise<boolean>; ended: Promise<ExportRunEnd>}` and `ExportRunEnd = {phase:"prepare"; outcome: PrepareOutcome} | {phase:"execute"; outcome: ExecuteOutcome}`.
     - `ended` never rejects. In prepare it is built on `settlePrepareOutcome`. In execute it is built on `settleExecuteOutcome`, inside the wrapper §2.5 already places around PublishDialog's `execute` prop. PublishControls gains that prop, and the dev hook goes through the same wrapper.
     - `cancel` is B3's, unchanged. There is no new host call, and nothing under src-tauri changes.
   - (b) **The consumer.**
     - App acquires the operation consumer when the report arrives and releases it when `ended` resolves, in the same handler that decides item 2(c). There is no other release, and never one on unmount.
     - `consumers` widens to `ViewId | ExportConsumerId`, where `ExportConsumerId` is `export-<n>`, minted by App once per run.
   - (c) **The late-cancel statement.** It is shown when, and only when, all of these hold:
     - "Cancel the export and go on" was chosen for this run;
     - the run is an execute run;
     - its `ended` resolved to `success` or `succeeded-unaudited`.
     - App marks the choice on the run before it calls `cancel()`.
     - `cancel()`'s answer, or its rejection (caught), is never read for the statement.
     - If `ended` has already resolved when the choice is made, the statement is decided at the choice.
     - A prepare run, a `refused` or `unknown-attempt` outcome, and every run after "Keep exporting" show no statement.
   - (d) **Where it shows, and for how long.**
     - It renders in the ask's place (OPEN-12), App-owned, never over the map (rule 11).
     - It renders the path whole, never truncated.
     - It stands until the next `confirmOpen` call or the next export report, whichever comes first. It has no timer.
     - It is rendered by `src/feature/OpenDuringExportAsk.tsx`, which exports its two text constants.
     - No new console row. The choice keeps B3's `dataset.openDuringExport` row, and the execute keeps its existing binding row.
   - (e) **A prepare run's lost cancel, declared and not stated.** If a prepare run reaches its prompt after the choice, nothing is written:
     - if the new open is admitted, the old panel and its prompt are gone, and the pending attempt expires host-side;
     - if the new open is refused, the old panel stays and shows the approval prompt, which still needs the typed phrase.

3. **The words (P6; the 2026-10-11 direction, item 2e; the human's wording, to approve or replace here).** These are the architect's proposed strings, not a quotation.
   - `LATE_CANCEL_FINISHED`: `The export was not cancelled: it finished before the cancel could stop it. The bundle was written to:`, then `bundle_path` on its own line.
   - `LATE_CANCEL_FINISHED_UNAUDITED`: `The export was not cancelled: it finished before the cancel could stop it, but its outcome record could not be audited. The bundle was written to:`, then `bundle_path`, then the outcome's `detail` line, as the panel renders it today.
   - **Clause check against the code:**
     - "was not cancelled": shown only for `success` and `succeeded-unaudited` (item 2(c)). The host maps a cancel the kernel observed to `refused` (publish.rs:838-866 above).
     - "it finished": `success` comes only from the kernel's Ok after the rename (kernel/src/publish/mod.rs:934-937 above). `succeeded-unaudited` carries the same `bundle_path` (publish.rs:849-856, within the span above).
     - "before the cancel could stop it": the token is not read after kernel/src/publish/mod.rs:906. A false answer means the key was already removed after the body returned (publish.rs:1171-1186). Both answers lead to this outcome.
     - "but its outcome record could not be audited": the `succeeded-unaudited` arm only.
     - "The bundle was written to": `bundle_path` is the destination the staging was renamed to.
   - **What an operator can observe (item 2c).**
     - After "Cancel the export and go on", the new dataset opens.
     - When the old export's outcome is a finished bundle, the statement appears in the ask's place with the path, and that folder exists.
     - Ordinary use reaches this case: the ask stands while the export finishes.
   - **Named, not blocking (recorded in the constants' source comment).**
     - `cancel()` answers true while the run is between kernel/src/publish/mod.rs:906 and its return. This window is shorter than one request round trip, and the words hold there too.
     - E-ASK's third step drives the export through the dev-only hooks.
   - **ADR-006 and ADR-024.** No word says or implies undone, cancelled or removed for a finished export, and nothing offers to remove the bundle.

4. **S1 and S4 of PR #212's gate 1** (`state/consults/gates/2026-10-11-shell-migration-milestone-2-phase-a-gate1-reviewer.md`, Suggestions S1 and S4).
   - **S1.** §2.1(c)'s acquire action is `consumer.acquired {resource, consumer}`. It is idempotent: a consumer already present leaves the state unchanged. It has two product callers: item 2(b), and the `[admitted]` effect's setup, which re-acquires the view's consumer on the admitted resource.
   - **S4:** no text here. It concerns RB4 and E-GEN (§2.3, §4), not B3's seam.

5. **B3's slot (see OPEN-12).**
   - At main, AdmissionPanel renders into `region.layers` (frontends/shell/src/App.tsx:1713 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD).
   - `section.source` holds DescribeSummary (frontends/shell/src/App.tsx:1717 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD).
   - B3's slot name and B3's "beneath AdmissionPanel" therefore disagree. No code of the ask's or the statement's render site lands before the ruling (I9). Everything else in B3 does not wait.

6. **§4 rows, one observed mutation each.**
   - **RB12d** (render, App.selection.test.tsx; the real App, with `publish/client` mocked to client.ts's real signatures and types.ts's real outcome types; the run driven through the dialog's Publish button).
     - (i) `publishCancel` answers true and execute resolves `success` with path P: the statement shows `LATE_CANCEL_FINISHED` and P, and `closeDataset(old)` is called once, after the outcome.
     - (ii) `publishCancel` answers false and the outcome is `success`: the same.
     - (iii) The answer is true and the outcome is `refused`: no statement.
     - (iv) A prepare run ends as `prompt` after the choice: no statement.
     - (v) `succeeded-unaudited`: the unaudited words, P and the detail.
     - Mutation: show the statement only when `cancel()` answers false. It fails at (i).
   - **E-ASK, third step** (e2e, selection.mjs).
     - Start a whole-file execute of `100k-happy-path.parquet` and open `filter-zoned.parquet` while it runs. The ask shows.
     - Wait for the execute hook's outcome, then choose "Cancel the export and go on".
     - The statement shows the outcome's `bundle_path`. That folder holds the bundle's manifest on disk. The new dataset is admitted, and the old `close_dataset` row follows the outcome.
     - Mutation: show the statement only when `cancel()` answers true. It fails on the absent statement.
     - If the export ended before the open, the step is inconclusive (class 2), never a pass.
   - **UB14** (unit, workspaceState.test.ts).
     - `consumer.acquired` twice and then one `consumer.released` leaves the resource closable exactly once.
     - An export consumer keeps a resource the view has left out of `selectClosable` until it is released.
     - Re-acquiring the view after its release keeps a live resource out of `selectClosable`.
     - Mutation: `consumer.acquired` appends without its presence check. It fails on the first assertion.
   - **Walkthrough row W8a** gains a third step.
     - The steps: start the export, open `filter-zoned.parquet`, let the export finish while the ask stands, choose "Cancel the export and go on", read the statement and open the folder it names.
     - Felt: did it tell you the export had happened, and where it is?

7. **§5.**
   - **Declared unchanged:**
     - src-tauri and the kernel;
     - `binding_publish_cancel`'s answer;
     - PublishDialog;
     - every existing PublishPanel string;
     - the `[admitted]` effect's order (stop, close, start).
   - **I13** is read against B3's shape as this amendment declares it.
   - **I16:** the run's outcome cannot reach App after the panel unmounts without editing a declared-unchanged area.
   - **I17:** the statement needs a host fact other than the outcome's `bundle_path` and `detail`.

8. **§8 additions.**
   34. After "Cancel the export and go on", a statement that says or implies the export was cancelled, undone or removed when the execute outcome is `success` or `succeeded-unaudited`; or an offer to remove a bundle.
   35. A late-cancel statement decided by `cancel()`'s answer; or one shown for a prepare run, or for an outcome that wrote no bundle.
   36. A bundle location taken from anything but the outcome's `bundle_path`, or truncated.
   37. The statement on a timer, or over the map.

   Item 18 also admits item 3's two strings, each sighted at P6.

9. **§9 additions.**
   - Item 3's words are approved or replaced by the human before the sitting.
   - OPEN-12 is ruled before the ask's render site is coded.
   - RB12d, E-ASK's third step and UB14 are each observed with the commit their mutation was observed at.

10. **§7 addition** (budget overrun, if any, is class 8; §7, B10 and this table are never edited to match). Counted by §7's command, in phase B's PR.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| AM7-P | PublishPanel.tsx +30, App.tsx +45, OpenDuringExportAsk.tsx +35, workspaceState.ts +20, styles.css +5 | 135 |
| AM7-T | App.selection.test.tsx +220, workspaceState.test.ts +45 | 265 |
| AM7-E | selection.mjs +70 | 70 |
| **Amendment 7** | | **470** |

   - The piece's ceiling is 7,882 + 470 = 8,352.
   - MANUAL-WALKTHROUGH.md: ≤ 15 more, outside the count.

11. **The reuse index** (the standing step).
   - The custodian ran `node tools/reuse.mjs` for `cancel` and for `export` in christopherdonini/spatial-ide-reuse at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit. The custodian appends the printed lines beneath this item, byte-copied by script and marked.
   - `cancel` printed three capabilities: `undo-merge-collapse-keys`, `stale-range-cancellation` and `request-scheduling`. None is used. The statement reconciles an outcome after the fact. It does not cancel, schedule or merge requests, and no code is taken.
   - `export` printed a miss. It is noted and does not block.
   - No dependency is proposed.

12. **§11 addition.**

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-12 | The ask's and the statement's slot | (A) `region.layers`, beneath AdmissionPanel | no |

13. **Generation:** the node's generation goes up by one.

14. **Superseded index.**

| Form passage | Superseded by |
|---|---|
| Amendment 1 B3, the report's shape | item 2(a) |
| Amendment 1 B3, the consumer's release trigger | item 2(b) |
| §2.1(c), the acquire action | item 4 |
| Amendment 1 B3, the ask's slot | item 5, OPEN-12 |
| Amendment 1 B3 rows, E-ASK; W8a | item 6 |
| §5, I13's reading; new I16, I17 | item 7 |
| §8, new items 34 to 37 | item 8 |
| §7 | item 10 |
| Amendment 6 item 3 | items 2 to 10 |

Read the last amendment first.

Nothing above is edited.
````

## 3. OPEN items

**OPEN-12: where the ask and the late-cancel statement render.**
- **(A)** In `region.layers`, beneath AdmissionPanel (`App.tsx:1713`). That is where the open is made, and it can be seen whatever the Inspector shows.
- **(B)** In `section.source`, beneath DescribeSummary (`App.tsx:1717`). It is hidden while the Inspector is closed or on its Style tab.
- **Recommended:** (A). It matches B3's own "beneath AdmissionPanel" and rule 11.
- **Red line:** no.
- **What waits:** only the render site in App.tsx. The rest of B3, this amendment's seam, and the tests up to their render queries proceed.

**The P6 sighting of item 3's two strings is not an OPEN item.** Item 4 of the ruling already settles the procedure: the human answers yes, gives their own words, or accepts them as they stand. Those words are the human's under item 2e.

## 4. Documentation notes for the custodian (must fix before filing)
- **Pins.** Every `HASH-TBD` in items 1 and 5 needs its hash, computed over the cited whole lines at 2ca3a53ca812684a7b2579980db2f980c5d2a286. The architect has no Bash, so recompute them by script.
- **Reuse lines.** Item 11 depends on the custodian appending the printed reuse lines, byte-copied by script and marked. I did not reproduce them, because I cannot verify them against the tool's output.
- **First line.** It says phase A's results were seen, as the form's line 7 rule requires. Amendment 6's first line does not say so. That is a record finding against Amendment 6, not something to fix here.

## 5. Files read (all at main 2ca3a53ca812684a7b2579980db2f980c5d2a286)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (whole; Amendments 6 to 1, then the body)
- C:\dev\spatial-ide\state\directives\2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md
- C:\dev\spatial-ide\state\directives\2026-10-11-direction-after-status-review.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-11-shell-migration-milestone-2-phase-a-gate1-architect.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-11-shell-migration-milestone-2-phase-a-gate1-reviewer.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (the class list, lines 100-174)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx, PublishDialog.tsx, client.ts, types.ts
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\publish.rs (lines 700-866, 1026-1218, 1295-1306), commands.rs (lines 340-456)
- C:\dev\spatial-ide\kernel\src\publish\mod.rs (lines 560-700, 895-1004); kernel\src\permission\boundary.rs (grep only)
- C:\dev\spatial-ide\frontends\shell\src\workspace\workspaceState.ts
- C:\dev\spatial-ide\frontends\shell\src\App.tsx (lines 1290-1334, 2010-2059, plus slot and consumer greps)
- C:\dev\spatial-ide\frontends\shell\src\layout\contributions.ts; StudioLayout.tsx (grep only)
- C:\dev\spatial-ide\.git\refs\heads\main

I did not read ADR-024 or ADR-006 in full this run. The amendment relies on their reading as the form already records it (A6) and as the dialog's warning carries it (`PublishDialog.tsx:264-266`).
