*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s stage 7 worker report, the K6 case (v) change the human ruled (`state/directives/2026-10-08-k6-case-v-ruling.md`; the form's Amendment 7) and its mutation's one observation, at the branch head 629a21fd90eb51fafc7a7299af7bcc20f84922af (the same worker-high, resumed at 19:44:42Z, report at 19:55:36Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 322f42fd76a8fc679001007c34d4c913384225a9221344c3213921581915b02a. The custodian read the diff 512aab08..629a21fd (`e2e/regression.mjs` only, 32 lines added and 3 removed) and the order from the worker's own commands in its transcript: the clean run (19:45:29Z), the change commit (19:50:05Z), one application of mutation 5 (19:50:16Z), one run (19:50:21Z), a restore with an empty status (19:54:50Z), then the comment commit. Names below are at that head.*

---

# Stage 7 report: K6 case (v) strengthened and its mutation observed

Case (v) now also fails on any camera-settle re-pick line since the release mark, and the release-edge mutation is caught by it. The clean run passes K6, with only C2'/C3' failing.

Both commits are published as an ordinary update to `cut/shell-migration-milestone-1`: 512aab08..629a21fd, no PR, force, rebase or merge. The worktree is clean at 629a21fd, and ports 9223 and 5400 have no listener. The permission system refused nothing.

## Commits

- **82d1f73a9df4c2138c7a2614491abe9c11940f03**: "fix: regression.mjs K6 case (v) also fails on any camera-settle re-pick line since the release mark (milestone 1 re-aim, Amendment 7)". It touches `e2e/regression.mjs` only.
- **629a21fd90eb51fafc7a7299af7bcc20f84922af**: "docs: regression.mjs records the K6 case (v) mutation observed at 82d1f73a". It is a comment only, in the same file.

Both are signed off, the message read from a file, with the two trailers. Neither mentions an outside project or carries an @mention.

## The new case (v) condition

Path: `frontends/shell/e2e/regression.mjs`, as committed at 82d1f73a. Line numbers are at that commit; the `if` is 4 lines earlier than at 629a21fd.

```
  const repickLineSinceRelease = consoleHandle
    .renderTrace()
    .slice(beforeRelease)
    .find((e) => /readout_confirmed camera-settle-repick/.test(e.text));
  if (repickLineSinceRelease !== undefined) {
    throw new Error(
      `K6/release-edge: a camera-settle re-pick line appeared in the render trace since this step's mark, whatever the pick found: ` +
```

- **Position.** In the file at 629a21fd the `if` is at line 1679. The `const` is at line 1675, directly after `afterReleaseAllowed`.
- **Failing condition named in the message.** "a camera-settle re-pick line appeared in the render trace since this step's mark, whatever the pick found".
- **Kept as before.** The old assertion is unchanged and follows it: the readout is clear or the named refusal, and no confirming re-pick line names an id.
- **Comment above `afterReleaseAllowed`.** It states the old assertion, the new one and the reason: on the 668 x 730 map the stale pick lands on background, so "no id" cannot tell a re-pick from none. It cites the measured clean-versus-mutated traces. It marks "READ FROM THE RECORD, NOT FROM A RUN" the reading that the 9 px threshold (raised 2026-09-14, after commit 04866c19 first bound this case at 2 px) contributes.
- **Summary string.** The case's return text now says "no camera-settle re-pick line of any kind since that case's own mark".

## Clean run

`node e2e/regression.mjs`, fresh launch, no mutation, under 82d1f73a plus the same file content.

- **K6 PASS** (52825 ms). Its case (v) read: "hovered id 47080, 1 zoom-out notch(es) to a STANDING refusal, then a real drag (button down, -67, -73 px, button up) and ONE wheel notch back in with the pointer never moved -> readout {"state":"clear",...}, and no camera-settle re-pick line of any kind since that case's own mark."
- **Every other step PASS or INFO** (A9' notch 4, K7, FIND' and the rest), **except** C2'/C3' FAIL (pre-existing). rc 1.

## The observation (one application, one run)

- **Edit.** `sed -i '1860d' src/canvas/WorkingCanvas.tsx` deleted `lastPointerPxRef.current = null;` from `onPointerRelease`. The diff showed that one line removed and nothing else.
- **Run.** `node e2e/regression.mjs`, fresh launch, at 82d1f73a with the line deleted.
- **K6 FAIL** (52698 ms), message: "K6/release-edge: a camera-settle re-pick line appeared in the render trace since this step's mark, whatever the pick found: "[render-trace] readout_confirmed camera-settle-repick cleared {zoom: -0.848138760145841}". With the named refusal STANDING, a real drag and then ONE wheel notch back in with the pointer never moved, the release edge (section 12 Amendment 3) leaves the settle nothing to pick at, so no re-pick line of any kind may arrive (.hover-readout showed {"state":"clear","text":null,"id":null,"marker":null})".
- **Also in that run.** A9' passed, and C2'/C3' failed as before. rc 1.
- **Restore.** `git checkout -- src/canvas/WorkingCanvas.tsx`, then `git status --porcelain` printed empty, before anything else ran.
- **Recorded.** The recorded-mutation comment (second commit) names 82d1f73a as the commit it was observed at. It keeps the earlier note that at 65391e79 the case did not catch the mutation.

## Commands, exit codes and holds

Each heavy command ran in a shared hold, one per call, `cd` first, the command step alone.

| Command | rc |
|---|---|
| clean run: `node e2e/regression.mjs`, fresh launch, held | 1 (only C2'/C3', pre-existing) |
| observation run: `node e2e/regression.mjs`, mutation applied, held | 1 (K6 case (v), as above) |

Unheld, light: `node --check`, the `sed` edit and `git checkout --`, `git status --porcelain`, `app-down.ps1` before each fresh launch, two `git commit` calls and one `git push`, each in its own call.

## Deviations

- **Class 3.** The clean run was made on the working tree before step 3's commit, as the order of steps required. The committed file is the same content, so the run applies to the commit.
- None otherwise.

**Model:** Sonnet 5.5 (claude-sonnet-5-5).
