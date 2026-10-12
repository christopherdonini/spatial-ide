# PR #207 gate 4 — architect (item 39's sentences)
Reviewed: cut/shell-map-refill-after-resize @ 66cc80de5bdc711bb448deac212d373835356519

**Verdict: block, on one Correctness finding (C1) for the human to rule on.** I have not reworded any clause and I propose no other words. Gate 3's C1 is closed by the new words, apart from one window of one mint round trip, described below. No Evidence block. There are two Documentation findings (D1, D2) on the worker's doc comments. Both must be fixed before the merge, with no re-gate.

How I read the code: the worktree `C:/dev/wt/refill` resolves to the branch ref, which holds 66cc80de (`.git/refs/heads/cut/shell-map-refill-after-resize:1`). The worktree reflog shows 58967ff4 → 66cc80de as one commit (`.git/worktrees/refill/logs/HEAD:21`). Line cites below are into that worktree, on the clean tree that worker report 9 states. I have no shell, so I give no span hashes and the reviewer recomputes them. Quoted spans were copied from my file reads, not by script.

## C1 (Correctness, for the human): a pan made in a mint round trip around an Apply or Clear

The code clears `lastQueried` at two moments that are neither the click nor the outcome:
- at an issued outcome, on both arms (`frontends/shell/src/App.tsx:336-338`);
- at the start of the refusal recovery, on the candidate arm (`App.tsx:319-322` → `App.tsx:1404` → `frontends/shell/src/residency/candidateArmSession.ts:1658` → `frontends/shell/src/canvas/WorkingCanvas.tsx:1534`).

Between the click and those moments there are awaited mints: `candidateArmSession.ts:1274` and `:1279`, reached from `:1698`. During them, a pan still reports (`WorkingCanvas.tsx:2017` → `:1025`). So "after a filter Apply or Clear whatever its outcome … until the next pan or zoom" (`state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md:13`) fails in one case, whichever moment "after" names:

- **If "after" means the click:**
  - Take a pan made while the Apply's own mint is pending. A later clear wipes its box: `App.tsx:338` when the outcome is issued, or `candidateArmSession.ts:1658` when the outcome is refused and recovery runs.
  - A growth after that pan then asks for nothing (`frontends/shell/src/canvas/viewportBbox.ts:76`), even though a pan has happened since the Apply.
  - The state lasts until the first batch with geometry triggers the auto-fit (`WorkingCanvas.tsx:1680-1682`). If no feature with geometry arrives, it lasts until the next pan or zoom.
- **If "after" means the outcome (refused case):**
  - Take a pan made while the recovery's mint is pending. Nothing clears after it, and `applyFilter` returns `refused` only once the recovery has resolved (`App.tsx:319-331`).
  - So after the refused outcome, a growth queries against that pan's box (`viewportBbox.ts:78-79` → `WorkingCanvas.tsx:1955`), with no pan or zoom since the outcome.
  - This lasts until the recovery's first batch with geometry triggers the auto-fit. If the recovered view holds no feature with geometry, it lasts indefinitely.

The window is one control-plane round trip, which I did not measure. Inside it, an issued Apply or a recovery that returns features is followed by the auto-fit, which restarts the exception through "after the map fits itself to the data". So the visible deviation is limited to two intervals: from the outcome to the first batch with geometry, and a result that holds no feature with geometry.

Gate 3 recorded the click-reading half as a note (its "pan while an Apply is being issued" row), on the reading that "applied" means "issued". The new words "whatever its outcome" take that reading away on the refused path. Gate 3 did not examine the recovery-mint half.

## Case by case, at 66cc80de, against Amendment 3 item 3 and the code

| Case | Code | Holds? |
|---|---|---|
| A file is opened | Each open is a new handle, and the canvas is keyed on it (`App.tsx:1782-1783`), so refs start null (`WorkingCanvas.tsx:1018`, `:1021`). The candidate first look also resets (`App.tsx:1437` → `candidateArmSession.ts:1658`) | Yes |
| Apply or Clear, issued (candidate) | `candidateArmSession.ts:1658` at start, `App.tsx:338` at outcome | Yes, except C1 |
| Apply or Clear, refused (gate 3's C1) | `:1658` on the primary and on the recovery. Result `refused` (`App.tsx:331`) | Yes, except C1 |
| C1 sub-case: the recovered view holds no feature | No auto-fit. `lastQueried` stays null until a pan or zoom. Zoom to layer gets `fitAnchorRef` null (`WorkingCanvas.tsx:1532`), so `fitToBounds` returns `false` before any write (`:1520-1521`). `App.tsx:1656` ignores the result | Yes. "when it has none, it does nothing" covers it |
| Apply or Clear, unexpected throw or non-filter `SkpCallError` | `:1658` ran before the throw (`App.tsx:333`) | Yes |
| Apply or Clear, `not-applied` (`stopped`, or `session-ended` latched during the mint at `candidateArmSession.ts:1288-1290`) | `:1658` ran at start | Yes |
| Apply or Clear after the session has already ended | `candidateArmSession.ts:1642` returns before `:1658`, so no clear. A growth's report reaches a latched session that plans nothing (`:1081-1094`) | The sentence holds ("asks for nothing new"). Outside item 39, as in gate 3. See D2 |
| The map fits itself to the data | `WorkingCanvas.tsx:1477-1487` and `:1680-1684` → `fitToExtent(…, false)` → `:1353` | Yes |
| "until the next pan or zoom" | Every controller event goes through `onViewStateChange` → `:2017` | Yes, except C1 |
| Zoom to layer with features | `:1527` → `fitToExtent(bbox, true)` → `:1351` (report) | Yes, "counts as a zoom" |
| Zoom to layer with none | `:1521` returns before any write. `StudioLayout.tsx:149` → `App.tsx:1656` ignores the result | Yes, "it does nothing" |
| Path (b): a pan before the first batch, then the auto-fit | The pan reports, then the auto-fit clears (`:1353`) | Yes |
| DEV view-state seam | Gated at `:2201`, reports at `:2226` | Yes, for the shipped build |
| Size change during the exception | `:1954` with null gives `none` (`viewportBbox.ts:76`). Nothing is reported | Yes |
| Baseline arm, refused Apply | No clear (only `App.tsx:336-338`) | Fails, but the source comment scopes the sentences to the candidate arm, and the baseline switch is dev-only (`residencyArm.ts:31-35`) |

**The other two sentences, read with the new ones.**
- Sentence 2 ("When the map shrinks…") holds unconditionally. Every camera write either reports or clears (`:1351`/`:1353`, `:2017`, `:2226`), and the resets only clear (`:1534`). So while `lastQueried` is non-null it contains the box shown. C1 does not break this: the pan's box is the box shown.
- Sentence 1 holds outside the exception, with "the area it last asked for" being `lastQueried`.
- "One exception" is true except for C1's window.
- The closing sentence ("The number is kept…") makes no claim about the code.

**Line 367 against the ruling.** The new text reads the same as directive line 13 without its three leading spaces. I compared it by reading. The byte check is worker report 9's script output.

**Source comment (`KNOWN-LIMITATIONS.md:368`).**
- The clause sits after "(this form's Amendment 1, item 4)" and before ". Authority:". By reading, it matches Amendment 5 item 2's quoted clause.
- "the shipped default arm, the candidate residency arm" holds: `frontends/shell/src/residency/residencyArm.ts:50` and `:84-86`, selected at `App.tsx:1350`.
- Holds.

## Evidence (not a block)

- **"The commit changes nothing else, and only comment lines in `WorkingCanvas.tsx`."** The reflog confirms one commit. The lines that now stand at `WorkingCanvas.tsx:133-136` and `:1019-1020` are comment lines. The file-level claim and the comment-stripped identity rest on worker report 9's run output, which I cannot recompute without a shell. Before the merge, the reviewer recomputes `git diff --numstat 58967ff4 66cc80de` and the comment-stripped comparison.

## Documentation (must be fixed before the merge, no re-gate)

- **D1.** `WorkingCanvas.tsx:134` ("called at the start of every reissue of the filter query") and `:1020` ("run at the start of a filter reissue") state the timing for both arms. On the baseline arm the call comes after the issued outcome (`App.tsx:336-338`), not at the start, so the comment claims more than the code does there.
  - Also, the `applyFilter` attribution at `:134` names one caller only. On the candidate arm the same call also runs at the open's first look (`App.tsx:1437` → `candidateArmSession.ts:1658`).
- **D2.** `WorkingCanvas.tsx:135` ("whatever the outcome of the Apply or Clear") overstates by one outcome. An Apply after the candidate session has ended returns at `candidateArmSession.ts:1642`, before `:1658`, so no reset runs. Amendment 5 item 3 states the same thing as the comment. Fixing the comment fixes this finding. I raise no record round.

Files: `C:/dev/wt/refill/KNOWN-LIMITATIONS.md`, `C:/dev/wt/refill/frontends/shell/src/canvas/WorkingCanvas.tsx`, `C:/dev/wt/refill/frontends/shell/src/App.tsx`, `C:/dev/wt/refill/frontends/shell/src/residency/candidateArmSession.ts`, `C:/dev/wt/refill/frontends/shell/src/canvas/viewportBbox.ts`, `C:/dev/spatial-ide/frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md` (Amendments 3 and 5), `C:/dev/spatial-ide/state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md`.
