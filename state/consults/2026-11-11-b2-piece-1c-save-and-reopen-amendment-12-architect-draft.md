*Custodian's filing note (2026-11-11): the architect's draft of 1c's Amendment 12, from its hand-back (20424 bytes, sha256 ad773e78bdd2eb9e4509478f36491517f0d559de9898d656d04e47898f6af9ef), below the rule with one change only: the scratch folder's full path, which it names twice, is written `<S>`. Its brief by file (7990 bytes, sha256 94eb4929a8a3340548de9fa5f0b27f668455dd06fc0adefe8e5511da47e61e05); the run 2026-11-11T09:57:20Z to 2026-11-11T10:07:08Z by its transcript, 58 calls (Read 33, Grep 22, Glob 2, the hand-back), none errored, model claude-opus-5-5. Before appending, the custodian checked by script: each of the ten pinned files the same at e57d75e1 and at 2dcbd3bc; the 26 pins' hashes computed at e57d75e1; `<P5-STOP-REPORT>` filled with the stop report's filed path. Rule (00), the check the draft asks for: no remote branch touches the paths it adds; three in-progress or held forms name some of them (milestone 4's, whose PR B follows step 1 in slot 1; pan-anchor's and the diagnostic's, for worktree edits never committed), and none claims one in flight.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 12. I reviewed `cut/b2-piece-1c-save-and-reopen @ 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5`, plus the form in main's checkout at HEAD 91b4a3d7, with Amendment 11 appended in the working tree.

**Where I depart from the brief: the pin form.** The brief asks for cites `@ 2dcbd3bc…`. That commit is on the branch only. Round 15 (e) forbids a hash reference at a branch commit in an append-only record, and the form's §8 item 12 (fourth clause) blocks on sight a test-text span pinned by hash at a branch commit. So I pin every line cite at B = e57d75e191ea35fe44c3a26887d73b82f4b53262, which is on main. That is Amendment 7's precedent. `ProjectView`, which exists only on the branch, is named by path, item and commit, with no line and no hash.
- **STOP for the custodian before filing:** run `git diff --quiet e57d75e1 2dcbd3bc -- <path>` for each pinned path. I read every line at 2dcbd3bc. A file that differs must be named in words at 2dcbd3bc, with no line and no hash, and must not be pinned.
- **One placeholder to fill:** `<P5-STOP-REPORT>` is the filed path of the stop report.

```text

## Amendment 12 — the command bar's route to Save project: two files and one pinned-id test edit in P5 (class 1); the view read from the canvas's camera: one file, its accessor and its tests (class 1); the groups the added files count in (class 8 when counted); written at P5's stop, before any P5 code

*Drafted by the architect, read only, from P5's stop report (`<P5-STOP-REPORT>`) and `cut/b2-piece-1c-save-and-reopen` at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5, at which P5 made no edit. References only; nothing below is a quotation. Self-references are by section, amendment and item. Line pins are at B = e57d75e191ea35fe44c3a26887d73b82f4b53262, a commit on main, at which each pinned file is the file read at 2dcbd3bc; code that exists only on the branch is named by path, item and commit, with no line and no hash (round 15 (e)). The reuse index's two queries missed, in the custodian's runs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-11; the misses are noted and do not block. Each new test's mutation, and the edited test's, is observed under §4's rule. §7 is not edited, and an overrun is class 8.*

1. **The command-bar route (class 1).**
   - *Reading.* §2.8 makes Save project available from the command bar and from a control. The bar lists the registry's entries (`frontends/shell/src/layout/StudioLayout.tsx:326` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). An entry needs an id in the closed union (`frontends/shell/src/layout/actionRegistry.ts:24-35` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) and a row in the list (`frontends/shell/src/layout/actionRegistry.ts:60-73` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The bar's availability and dispatch are StudioLayout's (`frontends/shell/src/layout/StudioLayout.tsx:195-217` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; `frontends/shell/src/layout/StudioLayout.tsx:227-249` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). §2.11's step 1 shell product list names neither file. This item corrects the file list and the commit plan only; §2.8 is unchanged. The stop report's choices 2 and 3 would narrow §2.8, which the human approved with this form, and neither is taken.
   - *Files added to P5.* Shell product: `layout/actionRegistry.ts` and `layout/StudioLayout.tsx`. Shell tests: `layout/actionRegistry.test.ts`, for the one edit below.
   - *The action.*
     - Its id is `project.save`. It is the thirteenth member of `ActionId` and the thirteenth entry of `ACTIONS`, appended after `filter.addClause`, so every other entry keeps its place in registry order.
     - Its entry: `label` is S1; `command` is S22; `takes` is `"nothing"`; `chord`, `bareKey` and `scopeWords` are `null`. No chord or key is assigned.
     - Region: none. `TOGGLE_REGION` gains nothing, so StudioLayout draws no top-bar button for it (`frontends/shell/src/layout/StudioLayout.tsx:329-331` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
     - Available when a dataset is on the map (`layersRow` not `null`) and `onSaveProject` is given. `available()` gains that case, because its default arm answers available.
     - Run: `runAction` gains the arm `project.save`, which calls `onSaveProject` and returns `"done"`.
   - *How StudioLayout reaches App's save.* `StudioLayoutProps` gains the optional `onSaveProject?: () => void`. This follows `onOpenDataset` and `onRevealExport`, where an absent prop leaves its entry unavailable (`frontends/shell/src/layout/StudioLayout.tsx:132-138` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). Its product caller is App, which passes its one save handler. StudioLayout imports nothing new and calls no SKP command itself.
   - *The one control.* A button in App's own JSX, in the `region.layers` slot after `AdmissionPanel`, rendered only while a dataset is admitted. It takes its label from the entry, as the tool switch takes its labels (`frontends/shell/src/layout/actionRegistry.ts:16-19` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), and its click calls the same handler as the entry. P6 settles its place together with S1.
   - *Existing tests.*
     - `commandDraft.test.ts`'s comparisons at `frontends/shell/src/command/commandDraft.test.ts:47` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H> and `frontends/shell/src/command/commandDraft.test.ts:54` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H> derive both sides from `ACTIONS`. Help lists every entry in registry order (`frontends/shell/src/command/commandDraft.ts:45` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), so a thirteenth entry enters both sides alike and neither result changes. They are not edited.
     - Its other expectations name fixed ids for fixed drafts (`frontends/shell/src/command/commandDraft.test.ts:28-49` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; `frontends/shell/src/command/commandDraft.test.ts:65` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; `frontends/shell/src/command/commandDraft.test.ts:141-142` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), and so does one App search (`frontends/shell/src/App.command.test.tsx:478-479` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). They hold unchanged if all of these hold: S1 and S22 contain none of `zoom`, `inspector`, `selection`, `m-to` or `bar`, in any case; S22 begins with none of `lay`, `zoom` or `filter`; and S22 is no other entry's word. A placeholder that breaks one of them is I3: stop.
     - The pinned-id test (`frontends/shell/src/layout/actionRegistry.test.ts:132-147` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>): its expected list gains `"project.save"` in sorted place, after `"layout.toggleLayers"`. That is its one edit. Its name, its other checks and its recorded-mutation comments stay. The name's count of twelve stays as it is and is disclosed for R1, as Amendment 11 item 3 left its count of six.
     - *I3.* I3 fired at P5's stop, and P5 stopped as §5 orders. This amendment is written before any P5 code and enters the edit in §4's step 1 table below. The edit adds one id to a list that pins the registry, and it weakens no check. Class 1, as for Amendment 11 item 3.
   - *§4, step 1, rows added.*

     | Test | Mutation |
     |---|---|
     | the pinned-id test, edited as above (`layout/actionRegistry.test.ts`) | the `project.save` entry deleted from `ACTIONS` |
     | Shell: `the save word in the command bar and the save control each send save_project once, and with no dataset the entry is not available` (in P5's App-level suite for step 1) | the `project.save` arm removed from `runAction` |

   - *§9, the seams.* Command bar → `runAction` → App's save → `save_project`: the second row above, through the real `StudioLayout` and `CommandBar`. Control → App's save → the file: E-SAVE.
   - *Rule (00).* The paths P5 adds are `layout/actionRegistry.ts`, `layout/StudioLayout.tsx`, `layout/actionRegistry.test.ts`, `canvas/WorkingCanvas.tsx` and `canvas/WorkingCanvas.wiring.test.tsx`. On 2026-11-11 the custodian checked every remote branch, and none touches `layout/`, `canvas/`, `command/` or `App.tsx`. Before P5's dispatch, the custodian also confirms that no in-progress piece's form names one of these paths, the pan-anchor diagnostic's form included. Step 1 stays the one piece on `protocol/`.

2. **The view source (class 1): a read accessor on the canvas handle.**
   - *Why not a view derived in App.*
     - App's last viewport box is reset at each open (`frontends/shell/src/App.tsx:232-236` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), and the auto-fit does not write it (`frontends/shell/src/App.tsx:2206-2207` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). E-SAVE's own sequence reaches this: a save straight after an open would carry no box, and a save after a filter's re-fit would carry a box for a view no longer shown.
     - Where a box exists, a centre taken as its midpoint and a zoom taken as log2 of a measured width over its span are reconstructed from the box, not the values the camera holds. A reopen would then not restore the camera that was saved, bit for bit.
   - *The accessor.* `WorkingCanvasHandle` gains `currentView?(): { centre: [number, number]; zoom: number } | null`.
     - It reads the camera the canvas last wrote (`frontends/shell/src/canvas/WorkingCanvas.tsx:1074-1076` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) and changes nothing.
     - `centre` is the camera's local target plus the offset frame's origin, member by member. That is the same dataset-space point the gesture handler forms from them (`frontends/shell/src/canvas/WorkingCanvas.tsx:2107-2111` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). Only that sum leaves the module; the local target and the origin do not (ADR-010 rule 1, as `frontends/shell/src/canvas/WorkingCanvas.tsx:2103-2106` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H> applies it).
     - `zoom` is the camera's held zoom, returned unchanged. It is already Amendment 1's measure: the canvas fits with log2 of the CSS pixels one unit spans (`frontends/shell/src/canvas/extent.ts:141-145` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).
     - It answers `null` before the canvas's first camera write.
     - It is optional in the type only, so the stand-in handles that predate it still satisfy the interface; the component always provides it. This is `fitToBbox`'s precedent (`frontends/shell/src/canvas/WorkingCanvas.tsx:138-142` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). A required member would have to be added to every stand-in typed as the handle (one of them: `frontends/shell/src/App.lateResult.test.tsx:322-356` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), which is I3 in each file.
     - Its doc comment names its product caller, App's save.
   - *App's save.* It reads the accessor and encodes the three numbers with `encodeHexF64`, as the wire box does (`frontends/shell/src/App.tsx:138-145` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>), into the request's `view`: `ProjectView` in `protocol/skp/src/v0/commands.rs` at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5, P2's item. When the accessor answers `null`, or the handle lacks it, App sends no `save_project` and shows S23.
   - *§2.11.* `canvas/WorkingCanvas.tsx` joins the shell product group. `canvas/WorkingCanvas.wiring.test.tsx` joins the shell tests group.
   - *§4, step 1, rows added.*

     | Test | Mutation |
     |---|---|
     | V-C1 `the canvas's current view is its camera's target plus the frame origin and its held zoom, bit for bit, and null before any camera write` (`canvas/WorkingCanvas.wiring.test.tsx`, a new `describe`, through the real `WorkingCanvas` with deck's `Deck` class replaced, as the file's other tests run; no existing test or helper there is edited, and one that needs an edit is I3). Cases: `null` at mount; after a gesture tick, each member `Object.is` the tick's target plus the origin, and its zoom; after the origin moves at a settled tick, a tick at local target (0, 0) still answers the dataset-space point. | `centre` returned as the local target without the origin |
     | Shell: `with no view from the canvas a save sends nothing and shows the not-saved notice` (P5's App-level suite) | the save sent with a centre and zoom of 0 |

   - *E-SAVE (P6) gains one assertion.* Before the save, the camera is set through the DEV-only `e2eSetViewState` hook (`frontends/shell/src/canvas/WorkingCanvas.tsx:2324-2351` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) to a pose whose three numbers have no short decimal spelling. The saved file's `view.centre` and `view.zoom` must hold those numbers' HexF64 patterns. This is the seam's end-to-end proof from the real shape: canvas → App → `save_project` → the file. Mutation: as V-C1's.
   - *§8.* Item 22: a `view` sent that was not read from the canvas's held camera, or a local-frame value leaving the canvas.
   - *§9, the seams.* Canvas `currentView` → App's save → `save_project`'s `view` → the file: V-C1 and E-SAVE.
   - *Step 2.* Its reopen applies a saved view to the camera, and its shell list does not name `canvas/WorkingCanvas.tsx`. That write path is step 2's to declare before its code; nothing here declares it.

3. **Size (class 8 when counted).** The added files count as follows:
   - shell product: `layout/actionRegistry.ts`, `layout/StudioLayout.tsx` and `canvas/WorkingCanvas.tsx`;
   - shell tests: `layout/actionRegistry.test.ts`, `canvas/WorkingCanvas.wiring.test.tsx` and the two new App-level tests;
   - e2e: E-SAVE's assertion, in `e2e/project.mjs`.

   `command/commandDraft.test.ts` is not edited. The step stands as Amendment 11 item 1 records it, and the groups over their ceilings are those of Amendment 9. Any further overrun of a group, of the step's lines or of its 77 files is recorded as class 8 when §2.11's command counts it, and nothing is trimmed. No figure is predicted.

**Strings (§2.12; P6 placeholders, none the human's).** S1 also labels the bar's entry. S22 is the bar's save word: it is typed after the slash and carries no marker, and the comment at its site names it S22. S23 is the not-saved notice for a save with no view from the canvas, and it states only the consequence. Shown text carries the shell's `[P6 placeholder] ` marking.

**Superseded index:**
- §2.11's step 1 shell product and shell tests lists: added to by items 1 and 2.
- §2.12's owner placeholders: added to by item 1 (S22) and item 2 (S23).
- §4's step 1 table and E-SAVE: added to by items 1 and 2.
- §4's closing sentence, for P5: by item 1, beside Amendment 11 item 3.
- Amendment 11 item 3's statement that the completeness-test edit is P5's one edit of an existing test: by item 1.
- Amendment 3's P5 row and Amendment 1 item 6's P5 contents: files added by items 1 and 2.
- §8 and §9's seam list: added to by items 1 and 2.

Nothing above is edited.
```

**Answers**

- **Item 1, the reading: yes, I read it as you do.**
  - Choice 1 keeps §2.8 as approved. It corrects only §2.11's file list and the commit plan, which is class 1, like Amendment 10's move.
  - Choices 2 and 3 narrow §2.8. That is class 5, on the human's ruling, and a red line (a scope change to an item the human ruled). So there is no OPEN item.
  - Choice 1 is sound. The new optional prop has a product caller (App), so §8 item 9 holds, and StudioLayout gains no import.
- **Item 1, `commandDraft.test.ts`:** a thirteenth entry does not change the results at `:47` and `:54`, because both sides come from `ACTIONS` and help lists every entry. Its fixed-query expectations, and `App.command.test.tsx`'s `selection` search, hold only on the S1/S22 condition the amendment states. Appending the entry at the end keeps `ACTIONS[0]` and the registry order the test relies on.
- **Item 1, I3:**
  - The pinned-id edit is I3 as §5 reads it, and it fired. P5 stopped correctly.
  - A class-1 amendment written before code may enter it in §4, as Amendment 11 item 3 did. It adds one id and weakens no check. It is not a red line, because no ruled scope changes. I require its mutation to be observed again.
  - The test's name is left as it is and disclosed for R1, as Amendment 11 left its count of six. The file's habit was to rename the test each time (eight, then eleven, then twelve). But if a done node in milestone 3 claims this test by its name, verify-test-claims holds that name, so a rename belongs in a docs-lane piece. I did not check whether such a claim exists.
- **Item 2: choice (b), a read accessor on the canvas handle.**
  - (a) fails in ordinary use. `lastViewportBboxRef` is null after an open and stale after a filter's re-fit, and E-SAVE's own sequence hits both. Where a box exists, its numbers are reconstructions, not the camera's bits.
  - (b) reads the camera the canvas already maintains (`cameraRef`). The zoom is the held value, and deck's orthographic zoom is already log2 of the CSS pixels per unit. The centre is the canvas's own target-plus-origin sum, so only a dataset-space value leaves the module, which keeps ADR-010 rule 1.
  - A required member breaks every typed stand-in: the `App.*.test.tsx` mocks, `App.test.ts`'s two and `candidateArmSession.test.ts`'s one. That would be I3 in each file. The optional member avoids this, on `fitToBbox?`'s precedent.
  - Step 2 will need `WorkingCanvas.tsx` to apply a saved view whichever choice is taken. I flagged this and did not declare it. A side note for step 2: forcing a recenter to the saved centre and setting the zoom keeps the bits on a re-save, except that a −0.0 centre comes back as +0.0.
- **Item 3:** each added file's group is set in item 3. I give no estimate.

**OPEN items:** none.
- **For P6 (red line, the human's words):** S1, S22 and S23's wording and the control's place. S1 and S22 are also bound by the search-string condition in item 1.
- **For the custodian:**
  - the hash STOP above;
  - the `<P5-STOP-REPORT>` path;
  - the rule (00) confirmation against in-progress forms (pan-anchor diagnostic).

**Departure: reads outside the brief's list.**
- Beyond the brief's list I read:
  - `canvas/offsetFrame.ts` lines 110-199;
  - grep hits in `canvas/viewportBbox.ts`;
  - `canvas/WorkingCanvas.wiring.test.tsx` lines 1-140;
  - `App.test.ts` lines 370-399;
  - `residency/candidateArmSession.test.ts` lines 96-125;
  - `App.command.test.tsx` lines 380-449, beyond its stand-in;
  - grep hits in `layout/StudioLayout.test.tsx`, `styles.css` and the shell's test files;
  - on main, `docs/PREREGISTRATION-TEMPLATE.md` lines 95-174, for the amendment classes and round 25.
- **What the draft takes from those reads:**
  - V-C1's host file;
  - the stand-in count behind the I3 point;
  - the `App.command.test.tsx:478-479` constraint;
  - the −0.0 note above.
- **What the custodian should check:** the reviewer can confirm these points by reading those files, or the custodian can strike them.

**What I read:**
- **Form, in the main checkout:** `C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: the header, §0, §1, and §2.7 to §2.13, §3 to §10, and Amendments 1 to 11. That is more than the sections the brief listed, and the extra sections are §2.9, §2.10, §2.13, §3, §6 and §9.
- **Scratch:**
  - `<S>/amend11-1c-draft.md`
  - `<S>/b2c-p5-stop-report.txt`
- **Branch `C:/dev/wt/b2c`:** `frontends/shell/src/` `layout/actionRegistry.ts`, `layout/StudioLayout.tsx`, `layout/actionRegistry.test.ts`, `command/commandDraft.test.ts`, `command/commandDraft.ts` and `command/CommandBar.tsx` (grep), `canvas/WorkingCanvas.tsx` (parts), `canvas/extent.ts`, `App.tsx` (parts), and the stand-in in `App.lateResult.test.tsx`; `protocol/skp/src/v0/commands.rs` lines 670-744; `kernel/src/project/mod.rs` (grep); and the files listed under the departure above.

Background shells: none. I have no shell and left none running.

Model, as the harness reports it: Opus 5.5 (`claude-opus-5-5`).
