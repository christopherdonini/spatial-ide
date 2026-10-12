*Custodian's filing note (2026-10-10): the docs lane's piece b (`shell-stale-frame-comments` with `shell-stale-layout-comments-and-s1-row`) worker report 1, the worker run 19:38:12Z to 19:46:20Z by its transcript, on `cut/shell-stale-frame-and-layout-comments` from 78fc2c7e, head 4190e428959b1142cd475a31b040473266016c78, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 35a43bb608a396e197aedd27bd66d1aac4c370d7cd5f566fb1c685782f92c85d. The custodian checked on origin: the head and the ten files' numstat (123 changed lines). The custodian then appended the MP-1 form's Amendment 7 on the branch (dc289564, 11 lines).*

---

Docs-lane piece b is built, pushed and clean, with no PR opened. Comments and one walkthrough sentence changed; all code and every app-visible string constant are byte-identical. Typecheck and vitest both exit 0. §21c total is 123 of 140.

**Commits on `cut/shell-stale-frame-and-layout-comments`** (each `git commit -s`, with the trailer):
- 5e7c0eb6 `residencyStatus.ts` draft markers corrected (string 6 per entry 45, strings 1-5 per the dated blocks) and the indicator's frame comment.
- 309165b0 `hoverRepickConstants.ts` cites its ruling; `WorkingCanvas.tsx` deck.gl comments.
- b6226a25 `ConsolePanel.tsx`, `StylePanel.tsx`, `PublishPanel.tsx` comments.
- 59f11a9d `layoutBoundary.test.ts` header only, plus `e2e/style.mjs` and `e2e/residency-harness.mjs` notes.
- 4190e428 walkthrough row S1.

**Changed comments** (the brief's file list, apart from the PR #195 corrections and the S1 row; where the new text is long, I give the new wording in short):

1. `residencyStatus.ts`
   - **(c) Header frame comment.**
     - Before: `` (`App.tsx`'s own `.canvas-status-stack` child) ``
     - After: `` (`App.tsx`'s `"status.residency"` status-bar item) ``
     - Rests on `App.tsx:1910` (the `"status.residency"` slot) and `layout/StudioLayout.tsx:306` (`<footer className="status-bar">`). `.canvas-status-stack` now appears only inside CSS comments, never as a selector.
   - **(a) String 6, header passage.**
     - Before: "**A DRAFT for the human's own 24(b) sight, not yet ruled** -- unlike strings 1-5 above, this one has not been through the wording sight this piece's own report asks for."
     - After: "**RULED 2026-09-06, entry 45, (1) String 6 = A, direction-free as shipped** (byte-copied from `DECISIONS-PENDING.md` entry 45's RULED block)."
   - **(a) String 6, `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` doc comment.**
     - Before: "**DRAFT, for the human's own 24(b) sight** ... has not yet been shown to the human ... awaits sight"
     - After: the same RULED phrase, "like `SETTLED_PARTIAL_SUFFIX`/`SETTLED_PARTIAL_FAILURE_TEXT` above (both RULED 2026-09-05/06), and it is entry 43's own recommended text".
     - The ruling phrase is copied by script from entry 45's RULED block. The source wraps "as / shipped" across a line, so the script collapsed that one line break to a space. The source's own wording is "(1) String 6 = A, direction-free as shipped".
2. `ConsolePanel.tsx`
   - Before: "the collapsed-by-default bottom drawer (...`styles.css`'s own `.console-panel` comment has the measured reason). Mounted unconditionally in `App.tsx`, below every other panel"
   - After: the console is the Activity region's Console tab (`layout/contributions.ts` `ACTIVITY_TABS`), mounted in `App.tsx`'s `"activity.console"` slot (`App.tsx:1986`), and `styles.css`'s `.console-panel` comment is that stacked layout's history.
3. `WorkingCanvas.tsx`
   - The "(pinned)" line now reads: observed on `@deck.gl/core@9.3.7`, `package.json` allows `^9.3.7`, the lockfile installs 9.3.9, "no re-check on 9.3.9 is claimed here". Ranges come from `package.json:43` and the `package-lock.json` entry for `node_modules/@deck.gl/core` (version 9.3.9).
   - "the installed @deck.gl/core@9.3.7" now reads "as read on 9.3.7 (the lockfile installs 9.3.9; not re-read there)".
   - I kept 9.3.7 at line 93 (verified against `deck.js`) and the 9.3.9 mention at line 2106, because both name what was observed.
4. `hoverRepickConstants.ts`
   - Before: "PROPOSED PENDING THE HUMAN'S SIGHT (DECISIONS-PENDING entry 75)."
   - After: "RULED 2026-09-14 (DECISIONS-PENDING entry 75 (1), question set B, item B3)", with the ruling's content: default stays pan+zoom behind the switch; if a pan artefact is felt at the sitting, it flips to zoom-only as a one-line declared change with the felt verdict cited, no new gate.
   - I paraphrased that content without quotation marks. The last two clauses of the old paragraph went into the past tense.
   - Entry 75 itself has no RULED block. The ruling is the 2026-09-14 "question set B" item B3, which names entry 75 (1) and (2).
5. `StylePanel.tsx` header
   - The 200px floor and ~21.8px headroom are now named HISTORY (milestone 1).
   - The new text says the panel is the Inspector's Style tab (`"inspector.style"` slot), `.canvas-container` fills the map region (`styles.css` `height: 100%`) with no floor of its own, and the map minimum is in `layout/layoutConstants.ts`.
6. `PublishPanel.tsx`
   - The `.publish-panel` pointer now says that comment opens with HISTORY (milestone 1) and does not describe the current frame.
   - I also fixed "Inspector's Export section" to "Layers region's Export section (`"section.export"` slot)". `LAYER_SECTIONS` in `layout/contributions.ts` puts Export in Layers; this is a comment correction I found by reading the code.
7. `layoutBoundary.test.ts` header only
   - Narrowed to "imports DIRECTLY from ...", "it proves direct imports only".
   - It now names `regionParts.tsx` and `statusItems.ts` as importing `../App` (`regionParts.tsx:7-8`, `statusItems.ts:4-5`), so it does not prove the layout cannot reach the map's code.
   - The scan and every test line are untouched.
8. `e2e/style.mjs`
   - A HISTORY paragraph sits before the "Layout" paragraph.
   - The poll's doc "(post-S4, `.app-main`'s own vertical scrollbar ... narrows ...)" now reads as written for the stacked layout and history.
9. `e2e/residency-harness.mjs`
   - A HISTORY preface was added to the F1 note: `.canvas-status-stack` is a since-removed rule; the banner now renders in the attention strip (`"attention.canvasRefusal"`, `App.tsx:1869`); the dismiss helper is unchanged.
   - I did not claim the overlap no longer occurs.

**Draft markers in `residencyStatus.ts`** — all were ruled, so none was left unruled:
- **String 1 / `STALLED_SUFFIX`, ruled.** DECISIONS-PENDING 2026-09-05 block ("1 approved") and the 2026-09-06 block (1/2/4 confirmed).
- **String 2 / `relinquishedText`, ruled.** The 2026-09-05 block ("not fetched" to "not loaded"). The header passage that called it a draft is corrected.
- **String 3, ruled.** The 2026-09-06 block (frame clause dropped, "first data load"). The header passage still described the 2026-09-05 rewording that named the frame, so I replaced it with the 2026-09-06 trim. This confirms the custodian's read.
- **String 4, ruled.** The 2026-09-05 block (the human's reworded string), confirmed 2026-09-06. The "draft" in "FOURTH draft string" is removed.
- **String 5, ruled.** The 2026-09-06 block ("part of this view failed to load"). Its "Draft-marked, for the human's 24(b) sight at this piece's own PR" is corrected.
- **String 6, ruled.** Entry 45, (1) String 6 = A.
- **Left:** the "draft" in "drafted for ... the human's sight" at about line 344 on strings 24(a)/(b), and "Item A draft ... RULED" at about line 431. Both already say ruled or shipped.

**Row S1** (`MANUAL-WALKTHROUGH.md`)
- New sentence: "No describe summary and no canvas appear for this file. If a dataset was already on the map, its summary and canvas stay as they were."
- Method: a script split line 24 of the docs-lane directive on double-quoted strings and took the second one. It checked the first was exactly the old sentence, that the old sentence occurred exactly once in the file, and then replaced it. Diff is 1 line out, 1 line in.

**Non-comment identity** (my script, `scratchpad/ident.cjs`): for each changed `.ts`/`.tsx`/`.mjs` file, it parses base 78fc2c7e and HEAD with TypeScript, prints each with comments removed, and compares.
```
IDENTICAL residency-harness.mjs, style.mjs, WorkingCanvas.tsx, hoverRepickConstants.ts, ConsolePanel.tsx, layoutBoundary.test.ts, PublishPanel.tsx, residencyStatus.ts, StylePanel.tsx
ALL IDENTICAL
```
- A control run: one changed string character is detected; a comment-only change is ignored.

**Checks**
- `npm ci` in `frontends/shell` and `renderer/bundle-viewer`, each in a shared hold, exit 0. The second was needed because `pretypecheck` needs the viewer's `node_modules`.
- `npm run typecheck` (shared hold): exit 0, no `tsc` errors.
- `npm test` (shared hold, runs `pretest` build then vitest): exit 0. Summary line: "Test Files 78 passed (78), Tests 1184 passed (1184)".
- `verify-quotes --show-cites` on the changed files reports 30 FAIL lines. They are identical at base 78fc2c7e except for one line-number shift (`residencyStatus.ts:434` became `:436`), so none comes from this piece.

**§21c** (`git diff --numstat 78fc2c7e HEAD`, B = merge-base with origin/main = 78fc2c7e; added + deleted):

| File | Added | Deleted |
|---|---|---|
| `MANUAL-WALKTHROUGH.md` | 1 | 1 |
| `residency-harness.mjs` | 5 | 1 |
| `style.mjs` | 8 | 3 |
| `WorkingCanvas.tsx` | 4 | 3 |
| `hoverRepickConstants.ts` | 7 | 4 |
| `ConsolePanel.tsx` | 4 | 3 |
| `layoutBoundary.test.ts` | 6 | 5 |
| `PublishPanel.tsx` | 4 | 3 |
| `residencyStatus.ts` | 25 | 23 |
| `StylePanel.tsx` | 6 | 7 |

The total is 123 of 140. Nothing was trimmed.

**Stale statements outside Scope, found and left**
- `App.tsx` slot comments (about lines 1958-1985) still say "in `.app-main`'s flex column", "200px floor" and "below `.canvas-container`".
- `admission/DescribeSummary.tsx:80` mentions `.canvas-status-stack`.
- The `styles.css` comments are marked HISTORY already.

**Self-check**
- Cross-module seams: no code or interface was written; every comment was checked against the cited file lines above.
- Completion claims: each rests on the named ruling or code line.
- User-facing messages: none changed.
- Required tests reach their assertions: the vitest run is 78 files, 1184 tests, and no test line changed.
- Model: Sonnet 5.5, no override. No context handoff received or produced.

Final state: HEAD is 4190e428959b1142cd475a31b040473266016c78. `git status --porcelain` is empty and the branch is published, matching origin. The stash list is empty.
