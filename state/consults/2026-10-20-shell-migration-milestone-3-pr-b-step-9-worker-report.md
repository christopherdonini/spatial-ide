*Custodian's filing note (2026-10-20): the worker's report for `shell-migration-milestone-3` PR B, step 9 (E-SEL's camera, after the custodian's e2e at 4b9f7c89), in C:/dev/wt/mm3b; the head 95bd9747e9042982b4baab42cc20330f9652fc52, pushed. The run 2026-10-20T13:13:15Z to 13:14:23Z by its transcript (Bash 6, Grep 5, Read 2); its one SubagentHandback call, at 13:14:23Z. Extracted by script; 0 path:line cite(s) into files or lines only on the branch de-rooted to words; one final newline added if absent; nothing else changed.*

---

Step 9 is committed at 95bd9747e9042982b4baab42cc20330f9652fc52 (parent 4b9f7c89) and pushed. I did not run any e2e or start the app.

**Start state:** after `git fetch origin` (rc=0) the head was 4b9f7c89 and the porcelain was empty.

**New `findFeaturePoint(page, consoleHandle)`**, replacing the old function in `frontends/shell/e2e/command-bar.mjs`:
```js
async function findFeaturePoint(page, consoleHandle) {
  const gave = [];
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch += 1) {
    if (notch > 0) {
      const r = await canvasRect(page);
      await zoomInOneNotch(page, consoleHandle, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    const { candidate, bufferWidth, bufferHeight } = await findInteriorCandidate(page);
    const rect = await canvasRect(page);
    for (const flipY of [true, false]) {
      const exact = bufferPointToCss(candidate, rect, bufferWidth, bufferHeight, flipY);
      const css = { x: Math.round(exact.x), y: Math.round(exact.y) };
      if ((await hoverIdAfterBarrier(page, css, "E-SEL")).ok) return css;
    }
    gave.push(`notch ${notch}: no confirmed id at the interior candidate in either row order`);
  }
  throw new Error(`E-SEL: no point of the map answers the hover with a confirmed feature id (${gave.join("; ")})`);
}
```
- It follows `buildScene` in `e2e/selection.mjs`, which is at lines 273-283. The leading doc comment is expanded to describe the zoom.
- The import now adds `zoomInOneNotch` and `MAX_ZOOM_NOTCHES` from `./lib.mjs`, and `stepSelection` passes `consoleHandle`.
- `zoomInOneNotch` is at `e2e/lib.mjs:590` and `MAX_ZOOM_NOTCHES` (= 15) at `e2e/lib.mjs:559`.
- E-SEL is still the last step; line 585 is unchanged.

**E-SEL mutation row:** I left the header row as it is. Its FROM text, `return { ...view, filter: combineClauses(clauses), clauses, clauseCounter: counter };`, is found exactly once in `frontends/shell/src/workspace/viewTransitions.ts` at my head (`grep -cF` gives 1).

**README decision:** I left `frontends/shell/e2e/README.md` alone.
- §7 has no row or group named "G-E". Its table has A-E and B-E, which name only `command-bar.mjs` and `layout.mjs`.
- `SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:499` lists "e2e/README.md ≤ 40" only as "Outside the count, declared for the record".
- The README's E-SEL entry (README.md:805) says "at a point whose hover reads a confirmed id, through `hoverIdAfterBarrier`". That is still true, so no word needed changing.
- The header's step list at line 6 only lists the step names, so I left it alone too.

**Budget:** B-E's line is "command-bar.mjs ≤ 420, margin 80 | 500" (`:492`).
- This change is 22 insertions and 11 deletions (33 lines). `git diff --numstat` against the head gives `22 11`.
- Against `merge-base origin/main HEAD`, the file's numstat is now 267 insertions and 3 deletions, which is 270 lines. That is within 420.
- The file is 621 lines long.

**Commands and exit codes:**

| Command | rc |
|---|---|
| `git fetch origin` | 0 |
| `node --check frontends/shell/e2e/command-bar.mjs` | 0 |
| `git diff --stat` | 1 file, +22/-11 |
| `git commit -s -F <file>` | 0 |
| `git push origin cut/shell-migration-milestone-3-pr-b` (ordinary, not forced, separate call) | 0 |

**Final porcelain:** empty (`git status --porcelain --untracked-files=all`).

**Differences from the brief:** none. The file uses LF line endings, which I kept. In the commit message I wrote "the custodians" without an apostrophe, to keep the Guardian happy.

**Model:** the harness reports Sonnet 5.5 (`claude-sonnet-5-5`), with no override and no context handoff.
