*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 7, the architect's gate 2 D1 (two code comments) and D6 (walkthrough Part V's V1) on the branch (the worker run 03:47:15Z to 03:49:40Z by its transcript), head a2f09cc912b9b3b4ff300603607467820679df20, published; comments and walkthrough text only, shown by a stripped-comment compare. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is cfbd7c252908130f1d497ace3132799b4a795d54134c314dd794336366dcc765.*

---

**Commit:** a2f09cc912b9b3b4ff300603607467820679df20, "docs: map-refill gate 2 D1 and D6 (two code comments scoped to what the code does; walkthrough V1 waits for features before the notch)". It is signed off and carries the Co-Authored-By trailer. I added a Claude-Session trailer line from the harness attribution reminder.

**Changed lines** (old, then new; taken from `git show HEAD` plus the pre-edit diff, not from a script copy):
- `WorkingCanvas.tsx:531` old: `  /** Fired on every view change -- each pan or zoom tick, an origin recenter, Zoom to layer's fit -- not only a`
- `WorkingCanvas.tsx:531` new: `  /** Fired on a view change other than the automatic fit, which never fires it -- each pan or zoom tick, an origin recenter, Zoom to layer's fit -- not only a`
- `WorkingCanvas.tsx:1946` old: `      // A size change that uncovers map area asks for it; a shrink asks for nothing. deck's own`
- `WorkingCanvas.tsx:1946-1947` new:
  - `      // A size change that uncovers map area asks for it once a view has been reported (`lastQueried` non-null);`
  - `      // a shrink asks for nothing. deck's own`
- `MANUAL-WALKTHROUGH.md:1769` (V1) old: `| V1 | Launch the app, open `100k-happy-path.parquet`, zoom in one wheel notch at the map's centre, and wait until the map stops changing. | The map shows features and then holds still. |`
- `MANUAL-WALKTHROUGH.md:1769` (V1) new: `| V1 | Launch the app, open `100k-happy-path.parquet`, wait until features appear, zoom in one wheel notch at the map's centre, and wait until the map stops changing. | The map shows features and then holds still. |`

**Checks:**
- `git diff --name-only 9e657db1 HEAD` lists only `MANUAL-WALKTHROUGH.md` and `WorkingCanvas.tsx`.
- Comment-stripped comparison: I transpiled both revisions of `WorkingCanvas.tsx` with TypeScript `removeComments`, and the outputs are identical (`stripped equal: true`, exit 0). So every changed line is a comment line.
- RF7/RF10 tokens: the count of `onViewportChangedRef.current(`, `cameraRef.current = ` and `onResize:` is 5 in the old file and 5 in the new.
- `npx vitest run src/canvas/WorkingCanvas.test.ts`: 41 of 41 passed, exit 0.
- `npx tsc --noEmit -p .`: exit 0.
- `node scripts/plan/verify-cites.mjs`: exit 0, PASS.
- `node scripts/plan/verify-quotes.mjs`: exit 0, PASS (121 checked, 0 hash-reference errors).
- `verify-quotes --show-cites` over the two files: exit 1, with FAIL findings on `MANUAL-WALKTHROUGH.md` lines 1217, 1305, 1330 and 1433. None is on a changed line. The same command also exits 1 on the pre-edit tree (checked with a stash). No listed cite sits on 531, 1769, 1946 or 1947.
- `git diff --numstat 4fd3259a...HEAD -- frontends/shell/MANUAL-WALKTHROUGH.md`: `28 0`, within the 30.

**Final state:** `git status --porcelain` is empty. HEAD is a2f09cc912b9b3b4ff300603607467820679df20. The push exited 0, and `origin/cut/shell-map-refill-after-resize` is at the same id, so the branch is published. I opened no pull request and did not edit the PR body. I ran no e2e suite and did not start the app.

**Pre-gate classes:** none apply, because the commit changes only comments and walkthrough text and crosses no module seam. Every claim above points to a command run in this session. No user-facing message was added. The new comments claim no more than the code does, and the stripped-comment comparison is the evidence for that. I ran as Sonnet 5.5, with no model override and no context handoff.
