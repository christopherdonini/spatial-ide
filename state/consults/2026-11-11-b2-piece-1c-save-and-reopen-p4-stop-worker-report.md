*Custodian's filing note (2026-11-11): the worker's report on its stop at P4 of piece 1c's step 1, from its first P4 brief, given by file (10847 bytes, sha256 6b0d7c1ba47fc43ffeef3c6ec3bd805a6db61c5e0ccf10c4806c927ee0206874). Dispatched at 08:38:26Z by its transcript; the hand-back came at 08:42:14Z (claude-sonnet-5-5; unique calls from that dispatch: Read 3, Bash 19, Edit 2, the hand-back, 25 in all; no errored call). The report below was extracted by script from the hand-back in that transcript (5196 bytes, sha256 e2ea4c63b99bfd84443db3bccd61c8b1431b47db6c4f2d3f60e300ef60004f24); its one scratch-folder path is written `<S>` and one final newline is added, and no other byte is changed. The custodian checked by script: the vitest log it names holds the failing line and the assertion it byte-copies, at the place it gives; its two edits are the two files it reverted; the worktree and origin's branch at 41c32190, the porcelain empty. The custodian read the completeness test's two class-B checks at 41c32190 and found them as the report gives them. Its line cites are into the branch at 41c32190. Its two findings are taken by Amendment 10.*

---

Stopped: b2-piece-1c-save-and-reopen P4, the class-B row for `binding_pick_project_folder` cannot be green without a shell `invoke("binding_pick_project_folder")` call site, and that is a P5 file. P4 is not built and nothing is committed or pushed.

**Start state (shown before any edit)**
- `git -C C:/dev/wt/b2c rev-parse HEAD` printed 41c32190b81eff94afeff54ba18c184789b23092.
- `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` printed the same id.
- The porcelain was empty.
- The form on main, read-only, has sha256 5352204280a7b5625a150c1d530ae7c167ad514225b0e3e9930d0162c795ccd5 and ends with Amendment 9.
- Main's HEAD is 1761df4b6618cba63b1e1cd205065e36cad20805.

**What stops P4**
Amendment 3's P4 row assumes the class-B row is the only thing `surfaceCompleteness.test.ts` needs for a new `binding_*` handler. That file has two opposing checks, and the form missed the second.
1. The handler-list check (read from the file) requires a class-B row for every `commands::binding_*` entry in `lib.rs`'s `generate_handler!` list. A handler without a row fails.
2. The stale-row check ("every class-B registry row names a command that some call site actually invokes (no stale row)") derives its set from every literal `invoke(` site under `frontends/shell/src/`. A row with no call site fails.

The only call site P4 could write is in `frontends/shell/src/`, in a file the brief puts in P5 (`project/saveProject.ts`, `skp/client.ts` or `App.tsx`). Editing the test is I3, and hiding an `invoke(` literal in `surfaceRegistry.ts` would defeat the test.

I observed this rather than assumed it:
- I added `commands::binding_pick_project_folder,` to `lib.rs`'s handler list and a class-B row for it to `surfaceRegistry.ts`, and nothing else.
- I ran `npx vitest run src/console/surfaceCompleteness.test.ts` in `frontends/shell`. Output is in `<S>\b2c-p4-vitest.log`.
- It exited with rc=1: `Tests  1 failed | 13 passed (14)`.
- The failing line, byte-copied: ` FAIL  src/console/surfaceCompleteness.test.ts > console/surfaceRegistry completeness scan (NEXT-CUT.md P2) > class B: binding-local commands > every class-B registry row names a command that some call site actually invokes (no stale row)`
- The assertion, byte-copied: `AssertionError: expected [ 'binding_pick_project_folder' ] to deeply equal []`. It fails at `src/console/surfaceCompleteness.test.ts:230:21`.
- I reverted both files with `git checkout -- frontends/shell/src-tauri/src/lib.rs frontends/shell/src/console/surfaceRegistry.ts` (rc=0). The porcelain is empty, HEAD is still 41c32190b81eff94afeff54ba18c184789b23092, and origin's branch is the same id.
- The harness's "changed on disk" notes for those two files are this revert.

Without the row, the handler-list check fails, so `binding_pick_project_folder` cannot land green in P4 in either order. The row and the shell call site have to land in the same commit. The `save_project` SKP command alone would not hit this: the shell scans `call("<name>")` sites in `skp/client.ts` for class A, and P4 adds none. I did not build it. That would be a split the brief does not authorise.

**A second finding for the form (not a stop by itself)**
- `open.lock` is step 2 (form §2.6, "`open.lock` (step 2)").
- The step 1 kernel has no lock, no session type and no way to forget a dataset's saved entry. `Projects` has `new`, `save` and `save_project`, and `store::OPEN_LOCK` is a constant only.
- "The project session (its `open.lock`) … dropped at `close_dataset`" therefore has no kernel object to hold in step 1.
- The nearest thing that fits P4's two files is a per-dataset `Projects` in binding state, created on a dataset's first save and removed at `close_dataset`. It would have to live in `commands.rs` or `lib.rs`, since `state.rs` is not in P4's list. Step 2 could then put the lock in the same session.
- Whether to build that is the custodian's call.

**Choices for the custodian (any of them is a change to the brief)**
- (a) Move `binding_pick_project_folder`, its handler-list entry and its class-B row to P5, so they land with the shell's `invoke` site. P4 is then `save_project` on `spawn_blocking` plus the session state, with no `binding_` command. That is green on its own, but it departs from Amendment 3's P4 row.
- (b) Fold P4 into P5 as one commit.
- (c) Rule a different split of the same files.

**Other notes**
- Amendment 3 says main is merged into the branch after PR C. The brief says not to merge, so I did not. The shell files here already carry the PR C registry: `surfaceRegistry.ts` has `record_step` and its last commit is 0c3d54c4, "milestone 4 PR C step 2". That PR is merged into this branch already, through P1's main parent.
- No commit, no test mutation, no counting run and no hold. The only command that ran was the one vitest file, which is not heavy. No cargo call was made.
- Nothing was added that the form does not name, and no file outside P4's list was touched.
- Background shells left: none. No process of mine is running.
- Model, as the harness reports it: Sonnet 5.5 (`claude-sonnet-5-5`).
