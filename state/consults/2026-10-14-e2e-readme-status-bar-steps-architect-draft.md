Reviewed: main @ 7c648c1c4c493292aed635d2d7d0b269f345820b
sha256: not computed

I have no shell, so every `HASH-TBD` in this report needs the custodian's script before commit. Pins I give with a full hash are the ones the status-bar form already records at 2cf707a3 or 117aac6c. Recompute those too. They are historical pins: for the edit, the tree at 7c648c1c is authoritative.

**What merged, from the code.** One new e2e step: `E-STATUS-HEIGHT` in selection.mjs. It runs after `E-ASK-TWO` and before `E-DBLCLICK` (frontends/shell/e2e/selection.mjs:865-867 @ 7c648c1c4c493292aed635d2d7d0b269f345820b sha256:HASH-TBD).
- There is no `E-STATUS-FULL`.
- E-FOCUS is unchanged: its expected walk has no `status` stop (frontends/shell/e2e/layout.mjs:217 @ 7c648c1c4c493292aed635d2d7d0b269f345820b sha256:HASH-TBD).
- So the node's title ("two new steps and E-FOCUS's new stop") describes the original OPEN-1 (a) design, not the merged one. The layout entry needs no edit. The status-bar form's Amendment 1, item 4 already said so for README line 754.

## 1. Form type: the five-line short form (`AUTONOMY.md` §21b and §21d), single reviewer gate

- **§21a does not apply.**
  - No ADR, no security posture and no wire.
  - No stated guarantee or invariant changes: the piece changes no code, no test and no property under test. It describes what a merged step asserts.
  - The Out-of-scope line can assert all four as untouched, so the round 25, item 2 (e) dispatch rule is met.
- **§21c is met.** One docs file. One line replaced in place, which is 2 changed lines by numstat. No new user-visible behaviour, no dependency, no exposure surface.
- **Precedent.** `KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md` and `frontends/shell/SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md` use the same shape: five lines, plus a §A holding the script-built text.
- **Slots.** No in-flight form names `e2e/README.md`. I checked the b2-1b form and governance pieces A, B and C. So the piece is disjoint. Its one entry is the selection entry, line 770.

## 2. The draft form

To be committed at `frontends/shell/E2E-README-STATUS-BAR-STEPS-PREREGISTRATION.md`:

````markdown
# e2e/README.md's selection entry: E-STATUS-HEIGHT joins the list, and E-DBLCLICK's run-last reason becomes history — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's follow-up of shell-status-bar-one-height (PR #218), landing after it and after export-current-view-after-unreported-fit (PR #219). Drafted by the architect at main 7c648c1c4c493292aed635d2d7d0b269f345820b; §A's words are the architect's, under item 2e of state/directives/2026-10-11-direction-after-status-review.md, with their clause check in the consult this form was filed from.

```
Authority: PLAN node e2e-readme-status-bar-steps; state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md, item 1, OPEN-2 (b) (state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:10 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9caa52ff60d1960ea573af62517ba39c3203e989d2bd46ed2c682fd7600584d4); the lines it moved here, frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md, Amendment 1, item 4, as OPEN-1 (d) leaves them (one new step, E-STATUS-HEIGHT; E-FOCUS unchanged); the selection entry is an item 2e draft for the human's sight (frontends/shell/e2e/README.md:766 @ 7c648c1c4c493292aed635d2d7d0b269f345820b sha256:HASH-TBD). Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for e2e readme, `No prior art recorded for "e2e readme". Research it before planning an implementation.` and, for status bar, `No prior art recorded for "status bar". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: frontends/shell/e2e/README.md (line 770 only, the selection entry's Asserted list, at 7c648c1c); PLAN.yaml (this node's record); 2 files; declared line budget <= 2 changed lines in README.md by `git diff --numstat` (line 770 replaced in place), this form and PLAN.yaml's record excluded.
Change: line 770 is rebuilt by script from its text at 7c648c1c with §A's two edits — E-STATUS-HEIGHT's entry inserted before E-DBLCLICK's, and E-DBLCLICK's run-last parenthetical replaced — and every other byte of line 770 and every other line of the file (the layout entry at line 754 and the Export view entry among them) is unchanged.
Tests+mutation: none added or changed (documents only); the reviewer checks that the diff touches line 770 alone, that §A's two old spans each occur once in line 770 at the PR's base and are the only bytes changed, and each clause of §A's new words against frontends/shell/e2e/selection.mjs, styles.css, layoutConstants.ts and StudioLayout.tsx at the PR's base.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; the lines describe steps that merged in #218 and change no property under test.
```

### §A. The two edits to line 770 (applied by the custodian's script; each old span is byte-copied from line 770 at 7c648c1c and must occur exactly once)

1. **Insert**, immediately before the old span `` `E-DBLCLICK` (on a fresh open ``, this text followed by a comma and a space:

```text
`E-STATUS-HEIGHT` (run after `E-ASK-TWO` and before `E-DBLCLICK`, at a window of 880 x 800 set over CDP with `Browser.setWindowBounds` and restored after: with a selection standing, a reopen ends it and shows the ended-selection notice on a second line of the status bar, and a Select click clears the notice; the canvas's width and height are the same before the notice, while it stands and after it clears, and the status bar is 48 px tall in all three; the step is inconclusive, never a pass, when the window cannot be set, when the notice is not on a second line or when the attention strip's height changes)
```

2. **Replace** the old span

```text
it runs last: run earlier, its reopen ends the selection the steps before it made, the ended-selection notice takes a second line in the status bar, and the next click clears it, so the map grows under the following step's points (run 5's E-SEL-FILTER diagnosis; the move is `shell-status-bar-one-height`))
```

with

```text
it runs last: while the status bar grew with its content, before `shell-status-bar-one-height`, run earlier its reopen ended the selection the steps before it made, the ended-selection notice took a second line in the status bar, and the next click cleared it, so the map grew under the following step's points (run 5's E-SEL-FILTER diagnosis); the status bar now has one height, 48 px, and `E-STATUS-HEIGHT` asserts that the notice coming and going leaves the canvas's size unchanged)
```

### Amendments

*(Opens empty; append-only.)*
````

## 3. Clause check (§A against main at 7c648c1c)

Every pin below is `@ 7c648c1c4c493292aed635d2d7d0b269f345820b sha256:HASH-TBD` unless another commit and hash are given.

**Edit 1, E-STATUS-HEIGHT's entry**
- *run after `E-ASK-TWO` and before `E-DBLCLICK`*: frontends/shell/e2e/selection.mjs:865-867.
- *a window of 880 x 800 set over CDP with `Browser.setWindowBounds`*: frontends/shell/e2e/selection.mjs:791-798.
- *and restored after*: frontends/shell/e2e/selection.mjs:805-813. The step restores the bounds read before the resize and polls until the inner size is back. A restore that does not take fails the step, so a PASS implies the restore took.
- *with a selection standing*: S0, frontends/shell/e2e/selection.mjs:755-763 (Select, Add only, one click; polls for Selected ≥ 1 and no notice).
- *a reopen ends it and shows the ended-selection notice*: S1, frontends/shell/e2e/selection.mjs:765-767 (asserts the notice appears). That a reopen ends the selection is E-GEN's assertion, already in the same entry.
- *on a second line of the status bar*: G1, frontends/shell/e2e/selection.mjs:771 (the notice's top at or below the first item's bottom, less 1 px). It is a guard, so the entry states it as a condition and names the inconclusive case below.
- *a Select click clears the notice*: S2, frontends/shell/e2e/selection.mjs:774-778.
- *the canvas's width and height are the same before …, while … and after …*: frontends/shell/e2e/selection.mjs:783 (exact equality of the `canvasRect` width and height in A, B and C). `canvasRect` is the `.working-canvas` box: frontends/shell/e2e/lib.mjs:572-579 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:000eee7cef2907f0113e7a10e59cb0dd54799317127928d6c1fc250144098128. Recompute it at 7c648c1c.
- *the status bar is 48 px tall in all three*: frontends/shell/e2e/selection.mjs:784.
- *inconclusive, never a pass, when the window cannot be set*: frontends/shell/e2e/selection.mjs:802.
- *… when the notice is not on a second line*: frontends/shell/e2e/selection.mjs:771.
- *… when the attention strip's height changes*: frontends/shell/e2e/selection.mjs:772 and frontends/shell/e2e/selection.mjs:780.
- **Not claimed:** the recorded-only values (frontends/shell/e2e/selection.mjs:785). They are omitted, so the entry claims no measurement.

**Edit 2, E-DBLCLICK's parenthetical**
- *it runs last*: frontends/shell/e2e/selection.mjs:867, the final `runStep`.
- *while the status bar grew with its content, before `shell-status-bar-one-height`*: this is history.
  - The status row was `auto`: frontends/shell/src/styles.css:34 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:dcb018dbdc37f212e2f6fc2c09bf3bb82d78db0d1d7cd97c2c2503a6204eb1fa.
  - The bar had a 1.5rem minimum, a 48 px cap, and wrapped: frontends/shell/src/styles.css:159-172 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:7db1301b36d263e867d332a30315f134e0908ab7395a46d8df42b081755705bb.
  - Both pins are as the status-bar form records them.
- *run earlier its reopen ended the selection …, the notice took a second line …, the next click cleared it, so the map grew under the following step's points (run 5's E-SEL-FILTER diagnosis)*: these are the existing words, put into the past tense.
  - Evidence: state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:17 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f10aa01fd35f6d7d5ff6eedb880b0315686657dce714f8e3e5d8466ad30daeb9 (715.453125 against 736).
  - Corroborating evidence: the recorded mutation's observation at d9e9b817 (736, then 718.640625, then 736), frontends/shell/e2e/selection.mjs:59-60.
- *the status bar now has one height, 48 px*:
  - the grid row is `var(--status-h)`: frontends/shell/src/styles.css:34;
  - the bar's height is `var(--status-h)`: frontends/shell/src/styles.css:162, border-box at :161;
  - the variable comes from the constant: frontends/shell/src/layout/StudioLayout.tsx:203;
  - the constant is 48: frontends/shell/src/layout/layoutConstants.ts:36.
  - The wrap and the inside scroll remain (frontends/shell/src/styles.css:163-165). Neither changes the height.
- *`E-STATUS-HEIGHT` asserts that the notice coming and going leaves the canvas's size unchanged*: frontends/shell/e2e/selection.mjs:783. The window is stated in edit 1's entry.
- **Bracket balance:** `(run 5's E-SEL-FILTER diagnosis)` closes itself, and the final `)` closes E-DBLCLICK's parenthetical. The old span's `))` did the same.

**Operator-observable judgement (item 2c).** Every clause states a test fact or a CSS fact. The case left unexercised is that E-STATUS-HEIGHT's assertion is made at 880 x 800 only, and the entry says so. Nothing needs a source-comment note.

**Whose wording.** It is not the human's typed wording. But the selection entry is an item 2e draft pending the human's sight (frontends/shell/e2e/README.md:766). Milestone 2's closing amendment records that its 2e drafts, this entry among them, merged as they stood with the sight queued. So §A's words join that sight (OPEN-1).

**Unchanged, verified at 7c648c1c**
- Line 754 (E-FOCUS's sentence matches frontends/shell/e2e/layout.mjs:217).
- Lines 768 and 774. Line 774's "Each step's recorded mutation is in the file's header" still holds for E-STATUS-HEIGHT (frontends/shell/e2e/selection.mjs:59-60).
- Lines 776-784, #219's Export view entry.
- **A line-move check for the custodian:** if line 770 hashes to Amendment 1's pin at 2cf707a3 (sha256:6da77c9c4dbb5dae1d1679841770791db8ceaac162845e8742248cba51f932f2), then #219 did not move or change it.

## 4. OPEN items for the human

**OPEN-1: the item 2e sight of §A's two new spans.**
- **(a)** Land as drafted (recommended). The spans join the selection entry's queued 2e sight at the sitting, where the human approves or replaces them with the rest of the entry. This follows the precedent of milestone 2's 2e drafts and the human's acceptance of the window under OPEN-2 (b).
- **(b)** Hold the merge for the human's own words.

Not red-line.

**Not the human's (for the custodian):**
- **The PLAN title.** It should be corrected to match what merged. Proposed: "e2e/README.md: the selection entry gains E-STATUS-HEIGHT, and E-DBLCLICK's run-last reason becomes history (the docs-lane follow-up of shell-status-bar-one-height, OPEN-2 (b); as merged under OPEN-1 (d): one new step, no E-FOCUS stop)". Set the node's `gate` to the form's path when the form is committed.
- **Information, outside Scope; no node proposed:**
  - Line 766's note still says the entry follows milestone 2's form only. It is left unchanged, because the node covers the step lines. Edit 2 names `shell-status-bar-one-height`.
  - The entry lists `E-DBLCLICK` before `E-ASK-TWO`, which is not the run order. Edit 1 states its own run position, so no order is implied.
  - `E-SCENE` is a `runStep` that neither the header list nor the README names.

## 5. Files read (main at 7c648c1c)

- `C:\dev\spatial-ide\PLAN.yaml` (nodes shell-status-bar-one-height, e2e-readme-status-bar-steps and neighbours)
- `C:\dev\spatial-ide\state\directives\2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md`
- `C:\dev\spatial-ide\frontends\shell\SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md` (§0 to §12, Amendments 1 to 5)
- `C:\dev\spatial-ide\frontends\shell\e2e\README.md` (lines 735-785)
- `C:\dev\spatial-ide\frontends\shell\e2e\selection.mjs` (1-70, 680-879)
- `C:\dev\spatial-ide\frontends\shell\e2e\layout.mjs` (190-226; step list 546-556)
- `C:\dev\spatial-ide\frontends\shell\src\styles.css` (28-43, 155-174)
- `STATUS_BAR_HEIGHT_PX` and `--status-h` usages in `C:\dev\spatial-ide\frontends\shell\src\layout\StudioLayout.tsx`, `layoutConstants.ts`, `layoutState.ts`, `StudioLayout.test.tsx`
- `C:\dev\spatial-ide\AUTONOMY.md` (§21 to §21d, §31)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md` (classes, the five-line form, Round 25 additions)
- `C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md` (README mentions only)
- `C:\dev\spatial-ide\KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md` and `C:\dev\spatial-ide\frontends\shell\SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md` (precedents)
- A grep of `kernel\B2-1B-RECORDING-PREREGISTRATION.md` and the three governance-piece forms in `scripts\plan\` for `e2e/README` (no match)
