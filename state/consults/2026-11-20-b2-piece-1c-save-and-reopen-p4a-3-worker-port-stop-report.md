*Filed by the custodian: P4a-3's worker, its first (the port stop) hand-back (claude-sonnet-5-5), 8309 bytes, sha256 f20ba4153e8c6a2b31cc1822838a5417cb366a73c204f914823a58b4ef4aaea5, below the rule, byte for byte, with one final newline added. Calls Bash 29, Read 2, Write 1, SubagentHandback 1, 1 errored, from 2026-11-20T08:41:40Z to 2026-11-20T08:45:43Z by its transcript. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4a-3, worker. NOTHING BUILT: I stopped at step 0 on the port check (stop: "a port that is not free"). Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff received or produced.

STOP: port 5180 is not free.
- Listen test, run alone with `node <S>/1cp4a3-listen.mjs` (log `<S>/1cp4a3-listen.log`): rc=1, output `listen on 5180 FAILED: EACCES listen EACCES: permission denied 127.0.0.1:5180`.
- `netsh int ipv4 show excludedportrange protocol=tcp` lists 5120-5219 (the dynamic exclusion that covers 5180). It is not an "administered" (starred) entry. This is the known case in the dev-port-5180 memory note.
- No other port is used for vite, so the human frees it. I wrote no code, ran no hold and ran no suite.
- State: worktree `C:/dev/wt/1c-p4a`, branch `cut/b2-piece-1c-p4a`, HEAD 7cb3d90bbcfd5d5194d7ab435bc9933ff68bd0fd, `git status --porcelain` empty. No commit, nothing to push, no process left running. The only files I wrote are in `<S>`: `1cp4a3-listen.mjs` and `1cp4a3-listen.log`.

STEP 0 ANSWERS (read only, from the code at 7cb3d90b)

1. The three hooks (signatures are my design; each runs the click's code).
   - `e2eOpenProjectFolder(folder: string): Promise<string>`.
     - It goes in `admission/AdmissionPanel.tsx`, registered in the existing `useEffect` that registers `openPath`, via `registerE2eHook`.
     - It puts `folder` in a one-shot ref slot, awaits `handleProjectPick`, then empties the slot.
     - `handleProjectPick` takes the slot's folder in place of `await pickProjectFolder()` when `isInstrumentedBuild()` and the slot is full, then runs `reopenPath(folder, {answer: null, relink: null})`.
     - That is `runAdmitPath` with `admitProject`, the same as the Open project button and `requestProjectPick`.
     - To return the outcome, `handleProjectPick` must return the `AdmissionOutcome | null` of `reopenPath`. The hook answers `outcome.kind` (`admitted`, `question`, `not_found`), or the refusal's code for `refused`, or `"dropped"` for `null`.
   - `e2eRelinkFile(file: string): Promise<string>`.
     - Also in `AdmissionPanel.tsx`.
     - It reads a state ref. If the state is `not_found`, it puts `file` in a second slot and awaits `handleRelink(state.folder, state.options)`. Otherwise it answers `"not-asked"`.
     - `handleRelink` takes the slot's file in place of `await pickFile()` and re-calls `reopenPath(folder, {answer: options.reopen?.answer ?? null, relink: file})`. It must return that outcome.
     - A dismissed pick is unreachable through the hook, because the slot is full.
   - `e2eReadWorkspace(): Promise<{filter: string | null; clauses: {text: string; enabled: boolean}[]; style: StyleState; view: {centre: [number, number]; zoom: number} | null}>`.
     - In `App.tsx`, beside `e2eSaveProjectToFolder`, in an effect with `[]`.
     - It is a read, like `handleSaveProject`'s: `selectDrawnViews(workspaceRef.current)[0]`, its `filter?.predicate`, `viewClauses(current)` mapped to `{text, enabled}`, `current.style`, and `canvasRef.current?.currentView?.()`.
     - Types and docs go in `e2e-test-surface.ts`.
   - No further hook is needed by E-REOPEN or E-CHANGED. R4's S9-own place, S8, S10 and S11 are read from the DOM (`.admission-refusal-code`, `.admission-refusal-owner`, `.admission-reopen-*`, `.reopen-notice`). Their texts come from the exported constants in `reopenNotices.ts`, read by name from source as `project.mjs`'s `s18Text` does. S8's "same" is clicked via `.admission-reopen-same`.
   - Ceiling pressure: 47 lines remain in the shell product group (820 less 773), and doc lines count. I expect about 45 to 60 for the three hooks with short docs. I will finish as written and report any overrun as class 8 (ADV-2026-11-19-12 item 6).

2. R2's camera move.
   - `e2eSetViewState` is guarded only by `import.meta.env.DEV` (`canvas/WorkingCanvas.tsx`, the effect that registers it, about line 2372). It calls `frame.forceRecenter(targetX, targetY)` and sets `cameraRef` with the new origin.
   - E-SAVE already moves the camera this way on the same fixture (`filter-zoned.parquet`, LV95), and its READBACK-VIEW asserts the file's view bit for bit (`project.mjs` `stepPose`, `stepReadbackView`).
   - So no DOM move is needed. R2 reuses E-SAVE's POSE numbers.
   - Clauses are set by DOM, as `project.mjs` does:
     - `input.filter-predicate` filled with clause A, then `button.filter-apply`;
     - clause C through the bar (`.command-input`, `/filter <cond>`, Enter);
     - the second clause's switch `.clause-card:nth-child(2) .clause-switch` clicked to disable it;
     - `#inspector-tab-style`, `.style-disclosure`, then `input.style-fill-color` filled.
   - Two clauses with one disabled: A on, C off.

3. Reading a Console row, and the ring's fill.
   - The recorder pushes an entry when the call is made, outcome `pending`, and resolves it later (`console/recorder.ts`, `record`/`push`). `open_project` and `close_dataset` are class-A rows.
   - The panel is expanded by clicking `.console-disclosure`, and groups are expanded as `readRecordStepRows` does. A row is `.console-entry-class-a`, with `.console-entry-header` text `open_project` or `close_dataset`, `.console-request-text` (the request JSON, to check `answer` and `relink` null) and `.console-outcome`.
   - Fill is read from the label `Console — N actions (D dropped)`, and the newer-entry count after the row is read from the DOM.
   - Whether a row can be dropped before its read: the ring is 256 (`MAX_CONSOLE_ENTRIES`), and one first-look load adds about 110 tile requests (ADV-2026-11-19-06 item 5). So after a reopen's first look the ring is at or near 256, with drops counting.
   - The row for the call is pushed before `describe` and before the first look. The hook resolves when `runAdmitPath` returns, before the first look's tile requests. The suite reads right after the hook returns, a few entries after the row, well under 256.
   - I could not count the actual fill without running, so R5's and R6's fills are unmeasured (no run). If a run shows the row more than 256 entries back, or already dropped, it is stop 13.
   - R5's read wants the `close_dataset` row. It is issued by App's close effect after the new dataset's admission, so it can land after the hook returns. The suite polls for it, and the first look's tiles could also be pushing entries meanwhile.
   - That is the one real risk. It is measured at the first run, and the worker reports it as stop 13 if the row is not in the ring at its read.

4. Fixtures. All are made by the suite under `os.tmpdir()`, which is `D:/wt-data/1c-p4a` when TMP is set. A scratch store is `LOCALAPPDATA`, and `folders.json` is at `<store>/spatial-ide/projects/<32 hex of the identity>/folders.json` (`kernel/src/project/store.rs`, `projects_root`, `record_dir`, `FOLDERS`).
   - F1 / folder P: `mkdtemp` folder P. `filter-zoned.parquet` (`C:\dev\spatial-ide\target\fixtures\manual-walkthrough\`, which exists) is copied into P as `parcels.parquet`, a normal name so the locator is project-relative. The copy is opened with `openPath`, then saved by the hook into P.
   - P2: a folder P2 and a separate data folder D. The fixture is copied into D, opened, saved into P2 (machine-recorded only). Another file is opened so the first handle closes. Then the copy is renamed within D, so R9 reopens to `not_found` with the old last name. The re-link points at the renamed file.
   - F4 (E-CHANGED): a fresh F1 folder with its copy saved. Another file is opened, then the data copy's mtime is moved 60 s later with `utimesSync` before the reopen. The expected S10 reads `In the file: mtime.` with no admission part (`ObservedChange` is `"mtime"` on the wire, `skp/types.ts`).
   - Q: R8's hand copy of P, with `project.spatial` and the data file.

5. Port 5180: not free (see the stop above). CDP port 9223 is untouched.

Off-scope observations, not acted on:
- `package.json` has no `e2e:reopen` script, and a lock-file or package.json change is a stop. The README entry will therefore say `node e2e/reopen.mjs`.
- Nothing was run in a hold, so no hold lines exist to report. Nothing was pushed.

To resume: after the human frees 5180 (a passing listen test), re-dispatch this brief. Step 0's answers above stand, and the work starts at step 1.
