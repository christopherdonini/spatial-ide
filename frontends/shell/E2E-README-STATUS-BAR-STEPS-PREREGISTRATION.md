# e2e/README.md's selection entry: E-STATUS-HEIGHT joins the list, and E-DBLCLICK's run-last reason becomes history — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's follow-up of shell-status-bar-one-height (PR #218), landing after it and after export-current-view-after-unreported-fit (PR #219). Drafted by the architect at main 7c648c1c4c493292aed635d2d7d0b269f345820b; §A's words are the architect's, under item 2e of state/directives/2026-10-11-direction-after-status-review.md, with their clause check in the consult this form was filed from.

```
Authority: PLAN node e2e-readme-status-bar-steps; state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md, item 1, OPEN-2 (b) (state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:10 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9caa52ff60d1960ea573af62517ba39c3203e989d2bd46ed2c682fd7600584d4); the lines it moved here, frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md, Amendment 1, item 4, as OPEN-1 (d) leaves them (one new step, E-STATUS-HEIGHT; E-FOCUS unchanged); the selection entry is an item 2e draft for the human's sight (frontends/shell/e2e/README.md:766 @ 7c648c1c4c493292aed635d2d7d0b269f345820b sha256:48c3b20ddfc9bf30cf0fb566fc09dcf8341da5a95734ceb8c580a5063b4b6f8c). Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for e2e readme, `No prior art recorded for "e2e readme". Research it before planning an implementation.` and, for status bar, `No prior art recorded for "status bar". Research it before planning an implementation.`; two misses, noted, not blocking.
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
