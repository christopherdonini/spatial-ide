# b2-piece-1c-save-and-reopen, step 2 (the reopen): what is left to declare before its code, and a split into five pieces; the architect's read-only read for the custodian (not a gate)

*Filed by the custodian, 2026-11-16: the hand-back of 2026-11-16T03:55:25Z, 25133 bytes, sha256 7c25e53d4df27d15e367b81068079c573ab94b816dbb52efed287f69740c86ad, model claude-opus-5-5, 178 calls in the transcript (Glob 8, Grep 97, Read 71, SubagentHandback 2), 2 errored; dispatched 2026-11-16T03:38:08Z, read only, at main 2e99751d; changes: none.*

---

main @ 2e99751dc20106d36f1fe151815f7ed6eb1b5029, plus PR B (cut/b1-shell-half-pr-b) @ 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a

# Step 2 of b2-piece-1c-save-and-reopen (the reopen): what is left to declare before its code. Architect, read only

**Verdict: pass with notes.** No code is under review, so nothing fails on Correctness. Nothing fails on Evidence either, but there are limits, set out under Evidence below. Five Documentation findings (D1 to D5) must be fixed in the declaring amendment, before the first piece's code.

---

## Correctness
None. No code is under review.

## Evidence (limits, none blocking)
- **E-1. No git commands.** I have no Bash, so I did not run the brief's `git show 6f7e744c:<path>` or its `git diff --stat 2abf3ea0..6f7e744c`.
  - I read PR B through the gate reviewer's worktree `C:/dev/wt/m4b-g327r`. Its `.git` file points to `.git/worktrees/m4b-g327r`, and that HEAD file reads `6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a`.
  - I cannot see whether that worktree holds uncommitted changes.
  - I found PR B's regions by comparing symbol positions and line counts against main at 2e99751d. That is not a diff.
  - It is enough for the first piece, which shares no file with PR B: every kernel, protocol and src-tauri file step 2 names has the same line count in both trees.
  - Before the shell piece's form names its regions, the custodian (or the reviewer, who has Bash) recomputes them with the real `git diff` after PR B merges.
- **E-2. No hashes.** I computed no sha256. I reproduce no binding text. The human's lines are cited by path:line and given in my paraphrase, marked as mine.

## Documentation (must-fix in the declaring amendment, before code)
- **D1. Ruled items missing from the form.** Rulings that bind step 2 are not recorded on the form. Grep of the form for `OPEN-S2`, `stack` and `byte comparison` finds nothing.
  - The human's 2026-10-23 Piece 1c line: OPEN-S2-1 (c), OPEN-S2-2 (a), OPEN-S2-3 (a), OPEN-S2-4 (a). It is at `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:20`.
  - The human's message of 2026-11-12 (13:07Z), item 3 (a), (d) and (e), at `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:31,34,35`. My paraphrase:
    - (a) K-S15 takes a byte comparison if the record can be read while the recorder holds it. Otherwise the length check stays, and the form says why.
    - (d) D-16 is built in the first PR of the stack that touches the store, with a test that makes the folder flush fail after the rename.
    - (e) the resolver, the store and the lock do not wait for the second-open node. The lineage reader does wait for it.
  - All of these are recorded as class 5.
- **D2. K-S14 is named twice.** The 2026-10-23 draft names a conditional "K-S14 `a_save_after_a_reopen_whose_project_record_another_run_left_replaces_neither_history`". The form already has a K-S14 in Amendment 20. Rename the draft's test.
- **D3. The approved S2-1 words carry a number that is taken.** OPEN-S2-1 (c)'s approved words were drafted as "ADR-036 Amendment 2". That number now belongs to second-open's amendment (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:283 @ 2e99751d`). Item O-4 below carries the fix.
- **D4. Comments that become untrue.** Each piece below changes these lines in its own diff:
  - `frontends/shell/src-tauri/src/commands.rs:158-160 @ 2e99751d` ("`Projects` has no call that forgets a dataset"): untrue once the lock is released at close.
  - `frontends/shell/src/App.tsx:1924 @ 2e99751d` (the first look is unfiltered): untrue for a reopen.
  - `kernel/src/project/store.rs:130-131`, `protocol/skp/src/v0/error.rs:188` and `protocol/skp/SKP-V0.md:1355 @ 2e99751d` (D-16's comments): untrue once D-16 is fixed.
  - `kernel/src/dataset_ref.rs:129 @ 2e99751d` (the containment sentence): N-10's words.
- **D5. Per-piece ceilings.** §2.11's groups need splitting across the pieces, with each piece's share stated. §7 is not edited. An overrun is class 8, per piece.

---

## 1. What step 2 already has (cited by section and amendment)
- **The wire, §2.2.**
  - `open_project`: the request `{skp, folder, cancel_key, answer, relink}`.
  - Its responses: `opened {project, dataset, session, workspace, check, lineage}`, `question {kind:"copy-or-same"}`, `not_found {file_name}`. The kernel keeps no state between the two calls.
  - Its codes: `project_open_elsewhere`, `project_target_through_link`, `project_target_outside_folder` and `project_target_unresolvable`.
  - Amendment 1 item 5 adds `project_machine_record_refused` (M1) and `project_known_folders_full` (M2).
- **The reopen in six steps, §2.4.**
  1. A strict read under `MAX_PROJECT_FILE_BYTES`.
  2. Ruling 8's identity and folder arms, and the question. `copy` mints an identity; `same` is remembered.
  3. `try_lock` on `projects/<hex>/open.lock`, held until close and freed at a crash (H7).
  4. The data: `check_inside`, else the machine location, else `not_found` and a re-link. A re-link is checked against `observed`. The open is `SkpHost::open_dataset` with the recorded claims and the request's `cancel_key`.
  5. `DatasetRef::check`.
  6. The lineage member and item D.
- **§2.5, `check_inside`.** The text check, then a walk segment by segment with `symlink_metadata`, with the refusals named. No handle is held. The engine path is the `\\?\` form (H4). The window is declared; K-2 states it. N-10 is in scope here.
- **§2.7.** Each command runs on `spawn_blocking`. The binding holds the lock and drops it at `close_dataset`.
- **§2.8.** Open project goes through `runAdmitPath`, with an `admit` that calls `open_project` then `describe`.
  - `question` leads to S8; `not_found` leads to a re-link pick; `opened` leads to the existing reducer transitions and the changed-file notice.
  - Each new command gets one class-A row.
- **§2.11, the ceilings.**

  | Group | Ceiling | Files |
  |---|---|---|
  | Protocol | 320 | |
  | Fixtures | 260 | |
  | Literal | 130 | |
  | Kernel product | 1,400 | `project/{resolver,store,mod}.rs`, `dataset_ref.rs` |
  | Kernel tests | 1,300 | `project_reopen.rs`, `project_resolver.rs`, `project_lock_crash.rs` |
  | src-tauri | 100 | |
  | Shell product | 520 | `openProject.ts`, `AdmissionPanel.tsx`, `App.tsx`, the question and re-link UI; `viewTransitions.ts` read only unless I1 |
  | Shell tests | 450 | |
  | e2e | 450 | |
  | Records | 140 | |
  | **Total** | **≤ 5,170 lines, ≤ 75 files** | |
- **§2.12, the strings.**
  - Owner placeholders: S8 to S12, S16, S17, S19 (V3), S20 (M2) and S21 (M1).
  - KNOWN-LIMITATIONS K-2 and K-3 are step 2's (Amendment 16 item 2). K-1 is withdrawn.
- **§4, step 2's table.**
  - K-R1 to K-R4, with their mutations. K-R5 is withdrawn.
  - K-O1 to K-O8.
  - L1 to L4.
  - Three shell tests.
  - E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK.
  - Amendment 1 item 5 adds K-O9 (V3), K-O10 (M1), K-O11 (M2), K-L5 and the V3 shell test.
- **§7 values:** 1,048,576; 64; 256. **§8:** items 1 to 23. **§9:** operator rows OP2 to OP5.
- **Carried to step 2 by earlier amendments.**
  - Amendment 12 item 2, last bullet: the camera write is step 2's to declare.
  - Amendment 16 item 1, with Amendments 18 item 3 and 19 item 4: `KnownFolders::from_bytes` is pre-committed to the reopen under M1, gated by K-O10.
  - Amendment 18: `store::OPEN_LOCK` returns with the lock.
  - Amendment 24 item 1: the through-link notice is an open item.
  - Amendment 26 items 3 and 4: D-16 with its suggested fix.
  - Amendment 28: OPEN-N1 O-2, N2 (i), N3 I-b and N4 (a). ADR-036 Amendment 2 item 4 states N4 (a) as built by step 2.
- **The second-open form §2.4, "Carried to step 2's form".** Five items:
  1. the bind inside the reopen;
  2. the seam that binds the open to the project and the dataset URI;
  3. two live opens on one record;
  4. another run's leftover folder meeting the first step's `create`;
  5. a test of both sub-cases.

## 2. What is left before code

| # | Item | What decides it | Recommendation (one line of reason) | Whose |
|---|---|---|---|---|
| O-1 | Step 2 as a stack of PRs under OPEN-3 (A) | The reading of OPEN-3 (A), and the human's "the stack's first PR" (D1, item 3 (d)) | P1 to P5 below, with one SKP bump (`skp/0.14`) in P3 only. The human's own words already foresee a stack. | Advisor (a scope reading of a thing ruled) |
| O-2 | Producers landing ahead of their consumers (round 8 exemption) | The caller rule: P1, P2 and P3's kernel and wire have no product caller until the next piece | Pre-commit each producer with its consumer and gate named: P1 and P2 to P3's `Projects::open_project` (gates K-O1, K-O3 to K-O11); P3's wire to P4 (gates the three §4 shell tests and E-REOPEN). Precedent: Amendment 16 item 1. If refused, P1 shrinks to D-16 alone and the rest folds into P3. | Advisor (the human's pre-commitment, delegated) |
| O-3 | The rulings onto the form | D1 | Record them as class 5 in the declaring amendment | Custodian |
| O-4 | S2-1 (c)'s approved ADR words | A numbering clash, and a clause check against ADR-036 Amendment 2 items 1, 2 and 4 | Land as ADR-036 Amendment 3 with the approved body unchanged, if its clauses hold. My read is that "stays under its own record" holds for an unbound open under Amendment 2 item 1. Must land before P3's code. | Advisor (ADR text) |
| O-5 | A reopen in a **later** run: bind at the reopen or not | OPEN-N4 (a) covers a same-run reopen only (ADR-036 Amendment 2 item 4) | Do not bind. The open keeps its own record until its first save binds it, and S2-1 (c)'s collision rule applies at that save. Binding to a record another run left would meet the leftover folder at every first step (carried item 4). | Advisor (ADR scope) |
| O-6 | Second-open's five carried items | Their placement | In P3, with a test of both sub-cases of carried item 5 | Custodian |
| O-7 | Rename K-S14 (D2); K-S15's form under item 3 (a) | Reading | Rename to the next free K-O number. K-S15: the length check stays. The reason: the store's lock is `projects/<hex>/open.lock`, under the projects root (`kernel/src/project/store.rs:56-58 @ 2e99751d`), while the recorder's lock is on the record under the sessions root (`kernel/src/session_history.rs:248-250 @ 2e99751d`). The new lock does not change whether the record can be read. | Custodian |
| O-8 | The D-16 fix | Amendment 26 item 3; item 3 (d) | The carried fix: a folder flush that fails after a successful rename does not refuse the save (`Staged::commit`, `store.rs:132-141 @ 2e99751d`). The kernel logs the failure as an engine fact. The test injects a failing flush through an internal `commit` that takes the flush as an argument; the product passes `sync_folder`, so the seam has a product caller. The three comments in D4 change in the same PR. | Custodian |
| O-9 | The through-link notice (OPEN-20-1 (a)) | Amendment 24 item 1 | A save notice for `through-link`. It states the fact: the file carries the machine-recorded locator only, because a link is not followed at reopen. In P4. | Advisor (a string the app shows) |
| O-10 | A token-taking open in `skp.rs` | `open_dataset` registers its own key (`kernel/src/skp.rs:1108-1119 @ 2e99751d`). `OpenRegistry::begin` refuses a key already in use (`:939-946`). | Split `open_dataset` into a wrapper over an open that takes a key and token already registered. `skp.rs` joins by class 9 (it is not on §2.11's list). | Custodian |
| O-11 | Registering the reopened open in `Projects.saved` | `Projects::save` finds a later save by catalog name (`kernel/src/project/mod.rs:112-127 @ 2e99751d`) | Register the open at the reopen. Otherwise a save after a reopen mints a new identity, or meets `FolderHoldsProject`. The shell's saver is told too (`createProjectSaver`, `App.tsx:868-885 @ 2e99751d`). | Custodian |
| O-12 | Where the lock is held, and its drop under S2-3 (a) | §2.7 | In the binding's state, per §2.7, keyed by dataset. It is dropped in `close_dataset` (`commands.rs:120-133 @ 2e99751d`, which then takes the `Projects` state) and in the session-end forwarder (`frontends/shell/src-tauri/src/lib.rs:290-311 @ 2e99751d`). K-O4 gains the case of a same-process reopen after a session end. | Custodian |
| O-13 | The pool poll | `commands.rs:66-76 @ 2e99751d` | The `open_project` binding starts the same poll gated to debug and measure builds | Custodian |
| O-14 | The `runAdmitPath` seam | `AdmissionOutcome` is `admitted \| refused` (`frontends/shell/src/admission/admitDataset.ts:20-22 @ 2e99751d`); `runAdmitPath` is at `AdmissionPanel.tsx:198-265 @ 2e99751d` | Widen the outcome with `question` and `not_found`, each ending the run. The answer re-enters `runAdmitPath` with a fresh key, which matches the kernel's two stateless calls. Answering inside `admit` would leave "opening" and its liveness text over a question the user has not answered. `admitDataset.ts` joins by class 9. | Custodian |
| O-15 | How the opened workspace reaches App | `Admitted` (`admitDataset.ts:11-18 @ 2e99751d`) has no workspace, check or lineage | A reopen-only member on the outcome, read by a new App handler beside `handleAdmitted`, not inside it (that region is PR B's) | Custodian |
| O-16 | The saved filter before the first look | Both arms issue the first look under `activeFilterRef.current` (`App.tsx:1738, 1932 @ 2e99751d`). The admission resets it (`App.tsx:1152-1169 @ 2e99751d`). | Set the filter and clauses in the same synchronous turn as the admission, so one first look is issued, under the saved filter. Record S2-1 (c)'s steps (actor user). | Custodian |
| O-17 | The camera write (Amendment 12 item 2) | `WorkingCanvas.tsx` | A new optional handle member, beside `currentView` (`:1617-1621 @ 2e99751d`). It sets the camera through `fitToExtent`'s frame-origin path (`:1404 @ 2e99751d`; ADR-010's origin rule). It marks the one-shot auto-fit done (`:1559-1569`, `:1780-1782`) and does not report the viewport. It is applied only when V3 allows; otherwise the fit runs and S19 shows. `WorkingCanvas.tsx` joins by class 9. | Custodian |
| O-18 | A saved Colour by, after PR B | PR B adds `fillMatch` and writes the match (`frontends/shell/src/style/document.ts:66-71, 162 @ 6f7e744c`). Neither tree reads a style document back into `StyleState`. | Add that reader to `style/document.ts` (class 9). For a match whose column the reopened data no longer offers: (a) the rest of the style applies, the fill uses its literal, and a notice says Colour by was not restored. Refusing the whole workspace over one style member would be worse. Whether StylePanel shows a restored match is read after PR B merges; PB-U15 covers only a match that ends. | Advisor (the notice's words); custodian (the rest) |
| O-19 | Where the Open project control sits | §2.8 names `AdmissionPanel.tsx` only | If it sits in the frame or the command bar, `StudioLayout.tsx` and `actionRegistry.ts` join by class 9. Both are PR B files. | Custodian. A label is a string the app shows: advisor |
| O-20 | E-SECOND's harness | `attachOrLaunch` handles one app (`frontends/shell/e2e/lib.mjs`) | `lib.mjs` joins by class 9, in P4 | Custodian |
| O-21 | C-6, C-7 and N-10 from the 2026-10-23 draft | The draft's (j) and (k) | Withdraw `project_target_outside_folder` at reopen as a wire change in P3. C-7 restates K-R3 in P1. N-10 in P1. | Custodian |

## 3. Smaller pieces

All five pieces are full-class except P5, under ADV-2026-11-16-06 item 2 (a): persistence, concurrency, the wire, a seam, or more than 260 lines. P5 is item 2 (b). Sizes are rough shares of §2.11.

- **P1: the resolver, the store and the lock, with D-16.**
  - Files:
    - `kernel/src/project/{resolver,store}.rs`;
    - `kernel/src/dataset_ref.rs` (the doc comment);
    - the D-16 comment lines in `protocol/skp/src/v0/error.rs` and `protocol/skp/SKP-V0.md`;
    - `kernel/tests/project_resolver.rs` and `kernel/tests/project_lock_crash.rs` (both new), and `kernel/tests/project_save.rs`.
  - Tests:
    - K-R1 to K-R4, with C-7's K-R3;
    - the D-16 test;
    - lock tests (held, crash), the `same` bound (M2), the move (S2-2 (a)), and the `locations.json` reader's refusal.
  - Size: about 350 product, 450 tests, 10 protocol, so about 810.
  - Depends on: O-1, O-2 and O-3. Shares no file with PR B.
- **P2: the lineage reader.**
  - Files: `kernel/src/session_history.rs` (class 9) and `kernel/tests/project_reopen.rs`.
  - Tests: L1 to L4 and K-L5.
  - Size: about 250 product and 300 tests.
  - Depends on: second-open, now done (item 3 (e)), and O-2. It may run beside P1, since the files are disjoint.
- **P3: the reopen through the wire.**
  - Files:
    - `kernel/src/project/mod.rs` and `kernel/src/skp.rs` (class 9);
    - `protocol/skp/src/v0/{commands,mod,error}.rs`, `SKP-V0.md`, the fixtures and the conformance tests;
    - `frontends/shell/src-tauri/src/{commands,lib}.rs`.
  - Tests:
    - K-O1 to K-O11;
    - the save after a reopen (O-11);
    - second-open's carried items 3 to 5;
    - the wire fixtures.
  - Size: about 750 product, 650 tests, 710 protocol, fixtures and literal, and 100 src-tauri, so about 2,210. It could split into P3a (the kernel, pre-committed) and P3b (the wire and the binding, about 810).
  - Depends on: P1, P2, O-4 and O-5.
  - It is the only piece touching `protocol/` while it is in progress.
- **P4: the shell.**
  - Files:
    - `project/openProject.ts`, the question and re-link components, `AdmissionPanel.tsx` and `admitDataset.ts`;
    - `App.tsx` and `WorkingCanvas.tsx`;
    - `style/document.ts`, `skp/{types,client}.ts` and `console/surfaceRegistry.ts`;
    - perhaps `StudioLayout.tsx`, `actionRegistry.ts` and `StylePanel.tsx`;
    - `e2e/project.mjs` and `e2e/lib.mjs`.
  - Tests:
    - §4's three shell tests and the V3 shell test;
    - those for O-16, O-17 and O-18;
    - E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK.
  - Size: about 520, 450 and 450, so about 1,420.
  - Depends on: P3, PR B's merge and the first-look node's merge (section 5).
- **P5: the records.**
  - K-2, K-3 and K-5 (S2-4 (a)), and the Part rows OP2 to OP5.
  - Class 2 (b): the five-line form and the reviewer alone. The words go to the advisor.
  - Depends on: P4.

## 4. Regions beside PR B

From positions at 6f7e744c, not from a diff (see E-1). PR B's correction (Amendment 25) is not yet written at 6f7e744c, so its regions will grow.

- **`frontends/shell/src/App.tsx`.**
  - PR B's regions, @ 6f7e744c:
    - the import line `:15`;
    - `sessionEndReasonOf` `:671-677` (new), and `handleSessionEnded` and `endSessionForDataset` at `:712, :718, :737`;
    - `colourColumns` `:855-859`;
    - `sessionEndedRef` `:950`;
    - **inside `handleAdmitted`, `:1180`**;
    - the end-session dependencies `:1420-1422`;
    - the colour-column effect `:2051-2062`;
    - the Style slot `:2503`.
  - Amendment 25 item 5 (b) adds the `lastCommittedStyle` baseline seam (`handleStyleCommit`, `:2041-2049 @ 6f7e744c`).
  - Step 2's regions (P4):
    - a new handler beside `handleAdmitted`;
    - the filter seed of O-16;
    - the saver's state;
    - a new e2e hook;
    - the control's JSX.
  - **Overlap:** `handleAdmitted`, if the admission carries the workspace, and the style baseline under S2-1 (c), which is PR B's correction region. **P4 goes after PR B merges.**
- **`frontends/shell/src/canvas/WorkingCanvas.tsx`.**
  - PR B's regions: `drawParamsFor` `:710-720`, `applyStyleChange` `:727-735`, `drawParamsRef` `:971` and `withinAttributes` `:1080-1085`, all @ 6f7e744c.
  - Step 2's regions: the `WorkingCanvasHandle` member (`:115-275`), a member beside `currentView`, and the two auto-fit blocks (`:1559-1569`, `:1780-1782`) and `resetFitForNewGeneration` (`:1623-1627`), all @ 2e99751d.
  - No overlap by symbol.
- **`frontends/shell/src/skp/types.ts`.** PR B: `:290-305 @ 6f7e744c` (`StyleMatchValue`, `StyleSetParams`). Step 2: after `SaveProjectResponse` (`:357-361 @ 2e99751d`). No overlap.
- **`style/document.ts`, `viewTransitions.ts` (+22 lines), `StudioLayout.tsx` (+11), `actionRegistry.ts` (+8), `workspaceState.ts` (Amendment 25 item 5's `admit`) and `surfaceRegistry.ts` (Amendment 25 item 3's `CLASS_C_ROWS`).** PR B changes each. Step 2's need of each is conditional (O-18, I1, O-19, O-15 and the class-A rows). These are read after PR B merges, so P4 goes after it.
- **Kernel, protocol and src-tauri.** Every file P1 to P3 names has the same line count in both trees, so I read no PR B change there. P1 to P3 can run now in slot 2.

## 5. The first-look node
- **Same file, different symbols.**
  - Draft §2.1 of `state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md` adds `shownViewportBbox?` to `WorkingCanvasHandle` and to the handle object, and edits `candidateArmSession.ts`. It leaves App and the fit unchanged.
  - P4's camera write adds a member to the same interface and the same handle object. Treat both insertions as one region, unless each form names a distinct anchor.
  - **P4 goes after the first-look node.**
- **In effect, yes.**
  - P-B plans the view shown when the first look ends. After a reopen, that is the saved view only if O-17's write does not report the viewport and holds off the auto-fit.
  - If the write did report, the tile arm would meet `no-frame` (that draft's §2.2 trade-off). E-REOPEN on a file over 10,000 rows would then show the same partial view with no status.
  - The first-look form should name, at its commit, that a reopen's first look plans the saved view.
- **P1 to P3:** no touch. `colour-by-refill-keeps-the-view`: no touch.

## 6. Draft of P1's declaring amendment (the architect's words, a draft; the custodian writes the real one)

**Amendment 30: step 2's piece P1, the resolver, the store and the lock, with D-16. Class 9 and class 5, declared before its code.**
1. **The rulings (class 5).** The rulings named in D1 join the form by reference. The piece split follows the advisor's ruling on O-1 and O-2, by reference.
2. **Scope.**
   - `check_inside(F, at)` in `kernel/src/project/resolver.rs`, as §2.5 states it.
   - In `kernel/src/project/store.rs`:
     - `OPEN_LOCK` and a project lock (`try_lock`, held until dropped, freed at a crash);
     - `KnownFolders`'s `same` append, bounded by `MAX_KNOWN_FOLDERS` (M2);
     - the move: `first` becomes this folder and the old one is forgotten (S2-2 (a));
     - a bounded reader of `locations.json`;
     - D-16: a folder flush that fails after a successful rename does not refuse the save, and is logged.
   - In `kernel/src/dataset_ref.rs`: N-10's words for the containment sentence.
   - D-16's two comments in `protocol/skp/src/v0/error.rs` and `protocol/skp/SKP-V0.md` are reworded to the built behaviour. The reviewer checks the words, which are not the human's.
3. **Pre-committed producers.** Every item but D-16 is pre-committed. Its consumer is P3's `Projects::open_project`, gated by K-O1 and K-O3 to K-O11. The PR body and PLAN.yaml name them.
4. **Tests and mutations.** Each test is observed failing under its mutation.
   - K-R1 to K-R4 (`kernel/tests/project_resolver.rs`), with §4's mutations. K-R3 is as C-7 restates it.
   - `a_folder_flush_failing_after_the_rename_keeps_the_save` (the name is mine). Mutation: the flush's error returned again.
   - `the_project_lock_is_refused_while_held_and_free_after_drop`. Mutation: no lock.
   - `the_project_lock_never_outlives_a_crash` (`kernel/tests/project_lock_crash.rs`, a child process that aborts). Mutation: a marker made by `create_new` in place of the lock.
   - `a_same_past_256_folders_is_refused_and_the_file_is_unchanged`. Mutation: the oldest entry dropped.
   - `a_move_makes_this_folder_first_and_forgets_the_old`. Mutation: the old folder kept in `same`.
   - `a_locations_json_the_reader_refuses_is_named`. Mutation: a refused file read as absent.
   - The custodian checks each new name for collisions.
5. **Ceilings.** Kernel product 350 and kernel tests 450, out of §2.11's groups, and protocol 10. Total at most 810 lines and 9 files. An overrun is class 8. §7 is not edited.
6. **Regions.** Kernel and protocol only. No PR B file. It is the only piece touching `protocol/` while it is in progress.
7. **Stops.** The worker stops if:
   - `check_inside` needs any file outside item 2;
   - the D-16 test needs a seam with no product caller;
   - any item needs `mod.rs` or `skp.rs` (those are P3's);
   - a mutation does not fail its test.
8. **Gates.** Both gates. One series at the final candidate.

Read the last amendment first.

---
Paths:
- `C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`
- `C:/dev/spatial-ide/state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`
- `C:/dev/spatial-ide/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md` (Amendments 25 and 26)
- `C:/dev/wt/m4b-g327r` (PR B at 6f7e744c, read in place)