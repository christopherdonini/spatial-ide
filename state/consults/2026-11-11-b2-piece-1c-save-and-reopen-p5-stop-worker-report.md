*Custodian's filing note (2026-11-11): the worker's stop on P5 of piece 1c's step 1, from its first P5 brief, given by file (10357 bytes, sha256 dab4c1bd783b814d3a181df2c12cfcc0280b735dbdf72dc058228af4653431aa). Dispatched at 09:49:50Z by its transcript; the hand-back came at 09:52:08Z (claude-sonnet-5-5; unique calls from that dispatch: Read 2, Bash 20, the hand-back, 23 in all). One call errored: a Bash search whose pipeline exited 2. The report below was extracted by script from the hand-back in that transcript (4770 bytes, sha256 77d666167815480d93d437d017f5781a926856ce594c90506b6fcdb55f67593f) and is unchanged; one final newline is added. The custodian checked by script: no edit, commit or push in the transcript; the worktree and origin's branch at 2dcbd3bc, the porcelain empty; the command bar's lines it names, read at 2dcbd3bc. Its line cites are into the branch at 2dcbd3bc. Answered by 1c's Amendment 12.*

---

Stopped: b2-piece-1c-save-and-reopen P5, "available from the command bar" cannot be built inside P5's file list, and the one test that pins the command bar's action ids is an existing test. I made no edit, no commit and no push, and I ran no cargo or npm command.

**Start state (shown before any edit)**
- Worktree HEAD: 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5.
- `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` printed the same id.
- The porcelain is empty, and still empty at the stop.
- The form on main, read-only: sha256 8239dd6f549694000767e1cb2a9db0809abf7265d66d28fa95e4ffdc64befb97. It has Amendment 10 (line 1270) and no Amendment 11 yet.
- The Amendment 11 draft in the scratchpad has sha256 68efec10d03ae445f23a61d9d2cc3767fd09f8af8a22d56f487f7d0087afecb2, which matches the sha256 in the brief.

**What stops P5**
- The brief says `App.tsx`: Save project is reachable from the command bar and from one control. The form's §2.8 says the same, and §2.11's shell product group lists only `skp/{types,client}.ts`, `project/saveProject.ts`, `App.tsx` and `console/surfaceRegistry.ts`.
- The command bar's content is not set in `App.tsx`:
  - `layout/StudioLayout.tsx:326` renders `<CommandBar ... registry={ACTIONS} ...>`, a constant imported from `layout/actionRegistry.ts`.
  - `StudioLayout` has no `registry` or extra-actions prop. App passes it only `onOpenDataset`, `onRevealExport`, `onAddClause` and similar handlers.
  - A command-bar word needs an `ActionId` in `actionRegistry.ts`'s closed union and an entry in `ACTIONS`. It also needs `StudioLayout.tsx`'s `available()` switch and `runAction`.
  - So the command-bar route needs two files outside P5's list: `layout/actionRegistry.ts` and `layout/StudioLayout.tsx`.
- Adding an id breaks existing tests, so it is also I3:
  - `layout/actionRegistry.test.ts:132-133`: `holds exactly the twelve ids: ...` asserts `expect(ACTIONS.map((entry) => entry.id).sort()).toEqual([` the exact twelve ids.
  - `command/commandDraft.test.ts:47` and `:54` compare against `ACTIONS.map((entry) => entry.id)` and `ACTIONS.map((entry) => entry.id === "dataset.open")`. A thirteenth entry changes what they compare against. I did not run them.
- Amendment 3's P5 row, Amendment 11 and §4's shell tests name neither file, and the form never mentions `actionRegistry` or `StudioLayout`. A control can sit in `App.tsx`'s own JSX. The command bar cannot.
- This is the same kind of gap as P4's: the form missed a check on the shell side.

**A second thing P5 will meet, which I did not confirm by an edit**
- `ProjectWorkspace.view` needs `centre` and `zoom`. Zoom is the base-2 log of the CSS pixels per unit of the dataset's space.
- `WorkingCanvasHandle` (`canvas/WorkingCanvas.tsx`) has no accessor for the camera.
- `App.tsx` holds only `lastViewportBboxRef.current`, a wire `Bbox`, and the canvas width is not in it.
- A view is derivable in `App.tsx` from that bbox plus the canvas container's measured width: centre as the midpoint, and zoom as log2 of width over bbox width. That adds logic and a DOM read to `App.tsx` that the form does not name.
- The alternative is a read accessor on the canvas handle, which edits `WorkingCanvas.tsx`, a file outside the list.
- Please rule on this when you amend.

**Other facts the amendment can rely on (read, not changed)**
- Placeholder marking: the shell prefixes strings with `[P6 placeholder] ` (for example `COMMAND_EMPTY_NOTE` in `command/CommandBar.tsx`). The marking exists, so that stop rule does not apply.
- The completeness test's class-A list is `expectedSix` in `console/surfaceCompleteness.test.ts`, around line 209. Amendment 11 item 3 covers that one edit.
- `StudioLayout.tsx` already draws one top-bar button for each `ACTIONS` entry that has a toggle region. A new `ACTIONS` entry would not get a button there on its own, so the "one control" is separate work in `App.tsx`.

**Choices for the custodian (each is a change to the brief)**
1. Add `layout/actionRegistry.ts`, `layout/StudioLayout.tsx` and the two existing tests above to P5, with a ruling that the I3 edits to the pinned id lists are permitted.
2. Ship Save project in P5 from one control only, and move the command-bar route to a later piece.
3. Drop the command bar from step 1.
Please also decide the view source (derive it in `App.tsx`, or add a canvas accessor).

**Counts, mutations, groups, strings, background shells, push**
- Counts, mutations and size groups: none, since nothing was built.
- Strings added: none.
- Departures from the brief: none.
- Background shells left: none.
- Holds: none taken.
- Push: none. Origin's branch is still at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5.
- Model, as the harness reports it: Sonnet 5.5 (`claude-sonnet-5-5`).
