*Custodian's filing note (2026-10-10): the docs lane's piece b worker report 2, the fix round for PR #203's gate-1 reviewer D1 to D5 (correction round 1 of 2), the worker run 20:32:56Z to 20:34:57Z by its transcript, on `cut/shell-stale-frame-and-layout-comments`, head dce20da2c21391e6b1aca57b6ffbb58f4465c545, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is f70546a9be67427bbcfe46e01f69ac3d747b33bd9c2f91c5a0a7bc02a5ee92b5. The custodian's own count by the form's rule: 144 changed lines at the head, against 134 at dc289564. The report's figure of 76 for the prior head is a misreading, and its "68 added" falls with it. The overrun of the declared 140 is the form's Amendment 2.*

---

D1 to D5 are fixed in one signed-off commit and pushed. §21c now counts 144, over the 140 you set. I trimmed nothing, as instructed, so a decision on that is yours.

**Commit and push:** dce20da2c21391e6b1aca57b6ffbb58f4465c545, message and trailer as you gave them. `git push origin cut/shell-stale-frame-and-layout-comments` gave dc289564..dce20da2. No force, no rebase, main untouched, no PR opened. Final `git status --porcelain` is empty and HEAD is dce20da2c21391e6b1aca57b6ffbb58f4465c545.

**Fixes (before, then after; `/` marks a line break):**
- **D1, `PublishPanel.tsx`:**
  - Before: `Placed in the Layers region's Export section (`App.tsx`'s / `"section.export"` slot).`
  - After: `Placed in the Export section of the Inspector's Layer tab / (`App.tsx`'s `"section.export"` slot; `layout/contributions.ts` and `layout/StudioLayout.tsx` / render the `section.*` slots there).`
  - Basis: `contributions.ts:63-64` says "the Inspector's Layer tab takes one per section". `StudioLayout.tsx:258-260` maps `LAYER_SECTIONS` inside the `inspector-panel-layer` tabpanel.
- **D2, `residencyStatus.ts`:**
  - Before: `already loaded; the rest of this view was not fetched."`
  - After: the same line, then `(the DRAFTED wording; the 2026-09-05 / ruling changed it to "not loaded", as the shipped constant below reads.)`
  - The quoted draft text is unchanged. The shipped constant is at line 436, now shifted by the added lines.
- **D3, `residencyStatus.ts`, both occurrences:**
  - Before, first: `(1) String 6 = A, direction-free as shipped** (byte-copied / from `DECISIONS-PENDING.md` entry 45's RULED block).`
  - After, first: `(1) String 6 = A, / direction-free as shipped** (the RULED block's words, its line break collapsed to one space; / from `DECISIONS-PENDING.md` entry 45's RULED block).`
  - Before, second: `direction-free as shipped** (byte-copied from / `DECISIONS-PENDING.md` entry 45's RULED block);`
  - After, second: `direction-free as shipped** (the RULED / block's words, its line break collapsed to one space; from / `DECISIONS-PENDING.md` entry 45's RULED block);`
  - The phrase's words are unchanged, and the first occurrence is also the D5 re-wrap.
- **D4, `ConsolePanel.tsx`:**
  - Before: `the collapsed-by-default console (`docs/07`'s "Current focus" text asked for a / bottom drawer, not a rail panel; `styles.css`'s `.console-panel` comment is that stacked layout's / history).`
  - After: `the collapsed-by-default console (`styles.css`'s `.console-panel` comment is that / stacked layout's history).`
  - I re-flowed the following line break by one word to keep it near 100 columns.
- **D5 wraps:**
  - `style.mjs` was a 152-column line, now re-wrapped: `...never a timing claim / (ADR-018): this only says "layout is no longer visibly moving," not "how fast." Called exactly / once now (`stepStyle`, right after the suite's one and`.
  - `WorkingCanvas.tsx` split after `calls`, so `// `this.props.onAfterRender(...)` with no null-check, so an unset prop throws on` is now its own line.
  - The `residencyStatus.ts` wrap is the D3 fix above.

**Non-comment identity, base 78fc2c7e against the new head.** I wrote the script fresh, since I had no earlier one: it parses each file with the repo's own TypeScript, drops JSDoc nodes and comments, and compares the remaining token texts. Output at the new head, 0 differing:
```
IDENTICAL frontends/shell/e2e/residency-harness.mjs
IDENTICAL frontends/shell/e2e/style.mjs
IDENTICAL frontends/shell/src/canvas/WorkingCanvas.tsx
IDENTICAL frontends/shell/src/canvas/hoverRepickConstants.ts
IDENTICAL frontends/shell/src/console/ConsolePanel.tsx
IDENTICAL frontends/shell/src/layout/layoutBoundary.test.ts
IDENTICAL frontends/shell/src/publish/PublishPanel.tsx
IDENTICAL frontends/shell/src/residency/residencyStatus.ts
IDENTICAL frontends/shell/src/style/StylePanel.tsx
files 9 differs 0
```
No code line or string constant changed.

**Typecheck:** `npm run typecheck` in `frontends/shell` ran once in a shared hold ("docs lane piece b: npm run typecheck", granted on cores 0-7) and exited 0. It ran after the first round of edits. I then re-wrapped three more comment blocks (`style.mjs`, `ConsolePanel.tsx`, `PublishPanel.tsx`) before committing and did not re-run it. The identity script above was re-run at the final head.

**§21c, `git diff --numstat 78fc2c7e HEAD` (added/deleted):**

| File | Added | Deleted |
|---|---|---|
| `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` | 11 | 0 |
| `frontends/shell/MANUAL-WALKTHROUGH.md` | 1 | 1 |
| `frontends/shell/e2e/residency-harness.mjs` | 5 | 1 |
| `frontends/shell/e2e/style.mjs` | 10 | 4 |
| `frontends/shell/src/canvas/WorkingCanvas.tsx` | 5 | 3 |
| `frontends/shell/src/canvas/hoverRepickConstants.ts` | 7 | 4 |
| `frontends/shell/src/console/ConsolePanel.tsx` | 3 | 3 |
| `frontends/shell/src/layout/layoutBoundary.test.ts` | 6 | 5 |
| `frontends/shell/src/publish/PublishPanel.tsx` | 6 | 3 |
| `frontends/shell/src/residency/residencyStatus.ts` | 29 | 24 |
| `frontends/shell/src/style/StylePanel.tsx` | 6 | 7 |
| Total | 89 | 55 |

That is 144, over the 140 budget. The prior head (dc289564) summed to 76 by my reading of its numstat before these edits, so the D1 to D5 fixes added 68 changed lines. No file outside the form's Scope was touched, and no code or string change was needed.

**Self-check:**
- Cross-module code: none.
- Completion claims: the identity output, the typecheck exit code and the numstat above are the evidence.
- User-facing messages: none changed.
- Required tests: the only required check is the typecheck, which ran to completion.

I ran as Sonnet 5.5 (claude-sonnet-5-5), with no model override and no context handoff.
