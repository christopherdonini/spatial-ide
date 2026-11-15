*Custodian's filing note (2026-11-11): the architect's draft of 1c's Amendment 14, from its hand-back (13768 bytes, sha256 7bd67f13a3b310bf7d8f6a9a5f4d35f9b6d7c3c5ebd638c1381772cc3e4d36c5), below the rule unchanged; one final newline is added. Its brief by file (5527 bytes, sha256 32a8710e9e64d68bf337b53f44eb6c8294a59000c03d3cbf4e609c5654d78456); the run 2026-11-11T11:15:10Z to 2026-11-11T11:20:55Z by its transcript, 29 calls (Read 21, Grep 7, the hand-back), none errored, none writing, model claude-opus-5-5. Before appending, the custodian checked by script: each of the six pinned files the same at e57d75e1 and at a3a1ba4e; the 9 pins' hashes computed at e57d75e1; §8's last item 22, so 23 is next. Rule (00), the check the draft asks for: no remote branch but step 1's own touches the six paths P6 now holds, and that one only `App.tsx`; two in-progress or held forms name `e2e-test-surface.ts`, each among the files it leaves untouched (milestone 4's, whose PR B follows step 1 in slot 1, and pan-anchor's); none names `checkDistClean.mjs`.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 14. I reviewed `cut/b2-piece-1c-save-and-reopen @ a3a1ba4ea550c75fe85b1bf0bbd1ad7398670060`, read at `C:/dev/wt/b2c`.

````markdown

## Amendment 14 — E-SAVE's route past the native folder picker: a DEV-only hook that supplies the folder to the control's own save (class 9, declared before any of its code); the files it adds to P6 (class 8 when counted); written before P6's code

*Drafted by the architect, read only, from `cut/b2-piece-1c-save-and-reopen` at a3a1ba4ea550c75fe85b1bf0bbd1ad7398670060 (P5). References only; nothing below is a quotation. Self-references are by section, amendment and item. Line pins are at e57d75e191ea35fe44c3a26887d73b82f4b53262, a commit on main, at which each pinned file is the file read at a3a1ba4e. Code that exists only on the branch is named by path, item and commit, with no line and no hash (round 15 (e)). The reuse index's two queries missed, in the custodian's runs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-11; the misses are noted and do not block. §7 is not edited, and an overrun is class 8.*

1. **What E-SAVE meets.** Under §2.8, the first save opens the folder picker. E-SAVE (§4; Amendment 1 item 5; Amendment 12 item 2) saves through the control. The picker is `binding_pick_project_folder` (`frontends/shell/src-tauri/src/commands.rs` at a3a1ba4e, Amendment 10 item 2's item), a native dialog that no CDP driver reaches (`frontends/shell/e2e/README.md:25-30` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The form names no route past it, and Amendment 1 item 6's P6 list holds no product file.

2. **The route (class 9).**
   - *Reading.* The picker is its own binding. `save_project` takes the folder as a request field that the page sends (`frontends/shell/src/project/saveProject.ts` at a3a1ba4e: `pickProjectFolder`, and the saver's `pickFolder` and `save` dependencies; `save_project` in `commands.rs` at a3a1ba4e). This is admission's shape: there, `openPath` supplies the path the picker would have given and runs the code a click runs (`frontends/shell/src/admission/AdmissionPanel.tsx:307-313` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>; `frontends/shell/src/admission/AdmissionPanel.tsx:324-347` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). It is not publish's shape, where the picker sits inside the command and a host seam was needed (`binding_publish_prepare_e2e_destination` in `commands.rs` at e57d75e191ea35fe44c3a26887d73b82f4b53262; `frontends/shell/e2e/publish.mjs:11-27` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). So the route is in the page only. It adds no host code and no Tauri command, and it does not edit `commands.rs`, `lib.rs` or `project/saveProject.ts`.
   - *Where the folder is chosen.* In the save, the pick happens inside the saver. So, unlike admission, no existing function begins after the pick. The one place the folder is chosen is the `pickFolder` dependency that App gives `createProjectSaver` (`frontends/shell/src/App.tsx` at a3a1ba4e).
   - *The hook.* `e2eSaveProjectToFolder(folder: string): Promise<"asked" | "not-asked">` becomes a member of `E2eTestSurface` (`frontends/shell/src/e2e-test-surface.ts`). App registers it through `registerE2eHook` in a top-level effect of its own, gated as item 4 says, and unregisters it in that effect's cleanup.
     - It puts `folder` in a one-shot slot that App holds, then awaits `handleSaveProject` (App at a3a1ba4e), which is the function App's control and the bar's entry both call (Amendment 12 item 1). Then it empties the slot. If `handleSaveProject` reads a render-scoped value, the hook reaches it through a ref that the render assigns, so the hook never runs a stale closure.
     - In an instrumented build only, App's `pickFolder` dependency answers the slot's folder and empties the slot when it holds one. Otherwise it calls `pickProjectFolder` as it does now.
     - The hook answers `"asked"` when the saver took the folder from the slot. It answers `"not-asked"` when the slot was still full after the save: the open had a confirmed save, a save was in flight, or no dataset was drawn.
   - *Files added to P6.* Shell product: `frontends/shell/src/App.tsx` and `frontends/shell/src/e2e-test-surface.ts`. e2e: `frontends/shell/e2e/checkDistClean.mjs` (item 4), which counts in the e2e group by path.

3. **What the hook may and may not do.**
   - *It may* supply one folder in place of the native picker's answer, for the save it starts.
   - *It may not:*
     - build a save input of its own;
     - call `save_project` or `saveProject` itself;
     - construct a saver of its own;
     - mark a dataset saved;
     - pass the saver's in-flight guard;
     - add, drop or change a notice;
     - return anything over CDP beyond its two-word answer. The driver reads the file from disk.
   - *Its doc comment* names its only caller, `e2e/project.mjs`. It also says that a run through the hook does not exercise the native folder picker, which only the operator's Part does (§9, OP1), as publish's seam says of its own picker.
   - *§8.* Item 23: an e2e hook on the save that does more than supply the folder, or a save the hook starts that is not `handleSaveProject`'s.

4. **Its gate.**
   - *The predicate.* `isInstrumentedBuild()`, the gate that `openPath` and App's top-level registrations use. Outside it, `registerE2eHook` does nothing (`frontends/shell/src/e2e-test-surface.ts:360-368` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>). The slot's branch in `pickFolder` sits behind the same predicate, so in a plain build `pickFolder` only calls `pickProjectFolder`. The hook is present in a measure build, as `openPath` is, and no measured cell calls it.
   - *The dist check.* `INSTRUMENT_IDENTIFIERS` (`frontends/shell/e2e/checkDistClean.mjs:55-125` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) gains `e2eSaveProjectToFolder`, with a comment that names this item. The name is a string argument to the registration, which no minifier renames, so a hit is real signal. A miss is a floor, as the file's own top comment says. The proof is check:dist-clean's PASS inside `npm run verify` at P6's commit.

5. **Its test (§4, step 1, row added).** E-SAVE is the hook's only caller, and it carries the hook's seam end to end from the real shape. E-SAVE's save goes through the hook, and E-SAVE gains these steps:
   - the first save answers `"asked"`, and that folder holds `project.spatial` (E-SAVE's existing assertion);
   - a second hook save, given a second empty scratch folder, answers `"not-asked"`. The second folder stays empty, and the first folder's `project.spatial` still reads back.

   | Test | Mutation |
   |---|---|
   | E-SAVE's hook steps (`e2e/project.mjs`) | the hook's save made through a saver of its own, whose `pickFolder` answers the supplied folder (expected: the first step fails at `"asked"`) |

   No shell test is added. The click and bar paths keep their own tests (§4; Amendment 12 item 1). The mutation is observed under §4's rule.

6. **Security posture (docs/09).** This is the established pattern applied to one more dialog, with no new exposure:
   - the posture (`docs/09_Security_and_Privacy.md:3-5` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) and the local sockets section (`docs/09_Security_and_Privacy.md:30-43` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>) are untouched: there is no new command, capability, grant, port, network access or credential;
   - in every build, the page can already send `save_project` any folder (item 2, the reading). The native picker is UI, not a grant or containment boundary, and the kernel's refusals apply to whatever folder arrives. Publish's picker is different: its destination never crosses from the page, and the host mints the grant from it;
   - the save stays the same `save_project` call, so its class-A console row is unchanged;
   - nothing crosses CDP except the answer (`frontends/shell/src/e2e-test-surface.ts:24-26` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:<H>).

7. **Rule (00).** P6's paths are `frontends/shell/e2e/project.mjs`, `frontends/shell/package.json` and `frontends/shell/e2e/README.md`, plus the three paths item 2 adds: `frontends/shell/src/App.tsx`, `frontends/shell/src/e2e-test-surface.ts` and `frontends/shell/e2e/checkDistClean.mjs`. The custodian's 2026-11-11 check covered `App.tsx`. Before dispatch, the custodian checks the other two against every remote branch and every in-progress piece's form, the pan-anchor diagnostic's included. A shared path is I7. Step 1 stays the one piece on `protocol/`.

8. **Size (class 8 when counted).** `App.tsx` and `e2e-test-surface.ts` count in the shell product group. `checkDistClean.mjs` and E-SAVE's added steps count in the e2e group. The step stands as Amendment 13 item 2 records it. Any further overrun is recorded as class 8 when §2.11's command counts it, and nothing is trimmed. No figure is predicted.

**Strings (§2.12).** None is added. The hook shows nothing, and S1 to S23 are unchanged.

**Superseded index:**
- Amendment 1 item 6's P6 contents, and §2.11's step 1 shell product and e2e lists: added to by item 2.
- §4's step 1 table and E-SAVE: added to by item 5.
- §8: added to by item 3.
- §9's seam list: added to by item 5 (E-SAVE → the hook → `handleSaveProject` → `save_project` → the file).

Nothing above is edited.
````

**(a) The route.** Your reading holds. `binding_pick_project_folder` is its own binding, and `save_project` takes `folder` as a field the page sends. So a page-side hook needs no host seam and no new command. It is not the exact `openPath` shape, though. `openPath` calls `admitPath`, which already existed after the pick. In the save, the pick is inside `createProjectSaver`'s `save`. The only place to bypass is the `pickFolder` dependency App passes in, so the route adds two product files to P6: `App.tsx` and `e2e-test-surface.ts`. `saveProject.ts` is not touched. I considered giving the hook its own saver. I rejected it: it would not share the saver's "folder once" set or its in-flight guard, so it would be a second path.

**(b) What the hook may and may not do.** It supplies the folder only. The save itself is `handleSaveProject`, the function behind both the click and the bar's entry. Amendment item 3 lists what the hook may not do, and §8 item 23 gives that list a block-on-sight.

**(c) The gate and `checkDistClean.mjs`.** The gate is `isInstrumentedBuild()`, like `openPath` and App's other top-level hooks (`lib.mjs`:13 at the branch: the measure build keeps App's hooks). Yes, the list should gain the name. It is a string literal, so a hit is real signal. The list already holds names App registers under the same gate, such as `setResidencyArm`. I take that as evidence that the dead-code removal works for this kind of registration, but I have not checked it. The proof is the check:dist-clean PASS at P6's commit.

**(d) The test.** E-SAVE carries it, with two added steps and one mutation: the hook given a saver of its own. That mutation fails at `"asked"` because only App's real `pickFolder` empties the slot. I added no shell test. The click and bar paths already have theirs, and the shell tests group is at 356 of 380.

**(e) docs/09.** This does not touch the security posture, so it is not a red line. The page can already send any folder to `save_project` in every build. The folder picker is UI, not a boundary. Publish's picker is a boundary (its destination never crosses from the page), and that is why it needed a `cfg(debug_assertions)` host seam. This hook adds no command, grant, port or credential, and it returns only one word over CDP.

**OPEN items.** None. Nothing here is a red line and nothing is left open; the hook's name and the `checkDistClean.mjs` choice are decided above.

**For the custodian:**
- Every line pin is at e57d75e1 and assumes the pinned file is the same at a3a1ba4e. I did not check this, because I have no shell. Check each one, above all `AdmissionPanel.tsx`, `e2e-test-surface.ts`, `checkDistClean.mjs`, `e2e/README.md`, `publish.mjs` and `docs/09`. If a file differs, cite its symbol by name with no line.
- Confirm §8's next free number is 23. Amendment 12 used 22, and I did not see a later one.
- Seen outside the item, and not drafted: `pickProjectFolder` records no console `binding-command` entry, while `skp/dialog.ts`'s `pickFile` does. This is for R1 or the reviewer to judge.

**Reuse index.** Both queries missed ("e2e hook folder picker save" and "test seam native dialog bypass"). The amendment's header records the misses.

**What I read:**
- In `C:/dev/spatial-ide`:
  - `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`: the header, §0, §1, §2.7 to §2.13, §3 to §10, Amendment 1 items 1 to 10, and Amendments 9 to 13;
  - `docs/09_Security_and_Privacy.md`.
- In `C:/dev/wt/b2c` at a3a1ba4e:
  - `frontends/shell/src/e2e-test-surface.ts`, `frontends/shell/src/project/saveProject.ts` and `frontends/shell/src/skp/dialog.ts`;
  - `frontends/shell/src/App.tsx`, the save, the saver's construction and the hook registrations;
  - `frontends/shell/src/admission/AdmissionPanel.tsx`:290-347, the `openPath` registration. This was outside your file list; I read it because `App.tsx` does not register `openPath`;
  - `frontends/shell/src-tauri/src/commands.rs`: `save_project`, the pickers and the E2E TEST SEAM section;
  - `frontends/shell/e2e/checkDistClean.mjs`, `frontends/shell/e2e/README.md`, the hook lines of `frontends/shell/e2e/lib.mjs`, and `frontends/shell/e2e/publish.mjs`:1-70.

**Model:** Opus 5.5 (claude-opus-5-5). I have no shell, so I started and left no background shell, and I wrote no file.
