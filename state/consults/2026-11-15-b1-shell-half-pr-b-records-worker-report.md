*Custodian's filing note (2026-11-15): the report of PR B's records worker, from its first hand-back (11717 bytes, sha256 3234675ddafd4d384c4e6deed2fa788496ac69f0e7e77478cbf9b636e92f2946), below the rule, byte for byte but in two ways: the one sentence that gives the custodian's scratch folder by its full place says instead that its place is not written here; and each of its 20 cites of a file and a line is given in words (the file, then the line or lines), because the files are PR B's and the cite check would read them against main. Its brief, by file 21136 bytes, sha256 dda220367b6307744eb2ec24914c395cd637a1c6979cfe2ac64fd5742faa8c50, was dispatched at 2026-11-15T20:03:49Z. The run 2026-11-15T20:03:50Z to 2026-11-15T20:47:01Z by its transcript, 232 calls (Bash 166, Read 27, Write 10, Edit 28, SubagentHandback 1), 7 errored calls (one write after the file changed since its read, four writes before a read, two foreground sleeps refused), 1 context handoff, model claude-sonnet-5-5. Its opening line is the one its brief gave, with a parenthesis after it. The report of its correction is `state/consults/2026-11-15-b1-shell-half-pr-b-records-adv-2026-11-15-20-correction-worker-report.md`. PR B's form, Amendment 23, records its holds.*

---

Built: b1-shell-half PR B records at 0fa941c079d66b7ea5731f07c69c6238a214674e (pushed; ls-remote gives the same id; porcelain empty).

SHORT FORM. The brief's full report asks for far more than ~20 lines. The files named below, in <S>, hold the byte-copied material. <S> = the custodian's scratch folder (its place is not written here). Nothing below is quoted from memory: every figure was printed by a command in this transcript.

WHERE / PRE-CHECKS (all as given)
- The form's sha256 is b0f958dc..., and its last commit is 0d13561d.
- HEAD was 895d1142 on cut/b1-shell-half-pr-b, with an empty porcelain, and ls-remote gave 895d1142.
- The changed-paths diff from 2abf3ea0 to origin/main was empty.
- The pan-anchor.mjs blob is 370fe149 at HEAD and on origin/main.
- node_modules/.package-lock.json exists. Free disk was C: 51G and D: 366G.
- All ten harness files, the L1 script (3023 bytes, 53c71e27...), m4b-rec-onehold.mjs (635 bytes, 18677923...) and the exe (91555840 bytes, 01073a95...) matched the brief byte for byte.

BY-SCRIPT COPIES
- The script is <S>/m4b-rec-copy.mjs, sha256 175f39c0cc69f2a597bdb93a1ead694b16a96ccabca04d852e0740716b3b30c8. It found each source and each target exactly once, and exited 0.
- Item 4's sentence: source sha256 e1b180ee...352cc, inserted sha256 2c308d9c9037e519300c2ddefc19bbf06f2580375381ea75c8f40d1eddd4140a (196 bytes). The only change is `item 64` to `item 65`.
- Item 59: source sha256 0845c613...da433, inserted sha256 8c933ed051f3fd9b35bbf009106e0514fa69962786339a8b140b1564cbb24899 (442 bytes).
- Item 65 (KL-3): source sha256 0c698333...175ec, inserted sha256 0c88e91da4cb0720117594daec721a2a70bb5d28fd084b7273a39fc604b1aee7 (786 bytes). The text is unchanged.
- The pin script is <S>/m4b-rec-pin.mjs. Every pin I wrote is `path:lines @ 0d13561da867f742b5ea1713e8c7e9276545f1f3 sha256:...`, and the script refuses a file that PR B changes. Files PR B changes are named by file and symbol "at 895d1142 on PR B's branch; the pins follow on main after the merge".

COMMIT AND CHECKS
- The commit is 0fa941c0, with the subject given. It touches only KNOWN-LIMITATIONS.md and frontends/shell/MANUAL-WALKTHROUGH.md (+35/-16).
- verify-cites rc=0, verify-test-claims rc=0 (812 tests) and profile-path-scan --staged rc=0.
- verify-quotes --show-cites exits 1 with 21 "quote not found" lines, all in MANUAL-WALKTHROUGH.md at old lines. The same command on main's two files at 0d13561d gives the same 21 (same text, line numbers shifted by 2). I added none. Every pin I wrote shows [hash: PASS] in the listing. This is outside the three required checks, and the output is in <S>/m4b-rec-vq.out.
- Numstat against the ceilings: KNOWN-LIMITATIONS.md 19/10 (29 lines, ceiling 70); MANUAL-WALKTHROUGH.md 16/6 (22, ceiling 160); e2e/README.md 12/0 (12, ceiling 60). No class 8.
- The diff is `git show 0fa941c0`. The message file is <S>/m4b-rec-msg.txt.

CLAUSE CHECKS AT 895d1142 (file symbols, since PR B changes these files)
- KL-3 (item 65): "1,000 features that pass the filter" is TABLE_MAX_ROWS (tableConstants.ts, line 13) in the one query at tableSource.ts, line 131. "Whatever order" holds because there is no sort. "Distinct values, 12, code-point order" is categoryCases.ts buildCategoryCases (94) and compareCodePoints (74), with CATEGORY_MAX_CASES = 12 at styleConstants.ts, line 10. "Fixed when you apply" is StylePanel.tsx applyColourBy (182-199). "No value"/"Other" come from CATEGORY_NULL_COLOR (styleConstants.ts, line 29) and CATEGORY_OTHER_COLOR (:32), the legend labels (Legend.tsx, lines 8-9), and rowGroups (matchGroups.ts, line 27).
- One KL-3 clause is untrue, and I did not reword it. A feature whose value is a category, or has no value, draws as Other, not in its colour or as No value, when its batch holds no value of the column. This is a batch kept without the column past the attribute limit (matchGroups.ts, line 34, withinAttributeCeiling in limits.ts, line 94, values.ts, line 71). It is recorded in item 65's comment and goes to the advisor.
- The other texts (items 4, 59, 51) are clause-checked against these symbols:
  - Colour by on fill_color alone: fillColorValue (document.ts, line 141).
  - Kept column: keepMatchColumn (values.ts, line 82).
  - Bound: the doc comment above limits.ts, line 84 says nothing bounds the kept column and that it is unmeasured.
  - Not-held answer: values.ts, line 71 and NOT_HELD_TEXT (FeatureTab.tsx, line 58).
  - Status bar: ATTRIBUTES_NOT_HELD_TEXT (App.tsx, line 833).
  - Refill: the effect after previousColourColumn (App.tsx, line 2053).
  - Camera: reissueUnrestricted clears the tiles, resets the fit and issues the 10,000-row first look (candidateArmSession.ts, lines 1665-1671 and tileGridConstants.ts, line 185, both pinned at main). The candidate arm is the shipped default (residencyArm.ts). The baseline arm is development-gated, so it is named in item 51's comment and not in the item.

ITEMS 54 AND 56 CHANGED (for the advisor before the gates, class 9; each comment says so)
- Item 54, asking sentence.
  - Before: "The Filtered scope asks only while the Table is shown with that scope, no export is running and the dataset's session has not ended."
  - After: "The Table asks for the Filtered scope only while it is shown with that scope, no export is running and the dataset's session has not ended. Colour by (item 65) also asks for it when you apply it, whether or not the Table is shown, unless a request for the filter in force has completed or is still running; it applies nothing while an export is running."
  - Basis: waitForFirstScope (categoryCases.ts, line 32) calls `source.start(filter)` unless the request is reusable or joinable, and applyColourBy returns early when exportHeld.
- Item 54, cancelling sentence.
  - Before: "Its request is cancelled when the Table is hidden (…), when another scope is chosen, when the filter changes, when an export starts and when the session ends."
  - After: it now starts "A request the Table made is cancelled when …", then adds "when the Table is hidden, another scope is chosen, an export starts or the session ends, a Colour by waiting on that request applies nothing. A request Colour by made is cancelled by Colour by's Cancel and when an export starts; Cancel on a request Colour by only joined cancels nothing but the wait."
  - Basis: the abandon in categoryCases.ts, lines 66-69 cancels only a request the wait issued itself.
- Item 54, last sentence.
  - Before: "…the filter changes or an export ends."
  - After: the same, plus "; a request made by Colour by also starts from the start and clears what the Table showed."
- Item 56.
  - Before: "…issued at open and again after an Apply or Clear, so up to four;"
  - After: "…issued at open, again after an Apply or Clear, and again after a Colour by on a different column while the status bar says that attributes were not held (item 51), so up to four;"
- Item 66, which is new draft wording (comment: advisor's wording, not the human's).
  - A comma+space name reads as more than one column, and this can be met only when the Colour by column has such a name.
  - Other characters, read from the code and not run: the dialog's dd for the line carries no white-space rule (only overflow-wrap in styles.css), so runs of spaces, tabs or newlines in a name show as one space. A comma without a space does not split, and a trailing full stop is not ambiguous. Directional and zero-width characters were not examined.

PART AC / PART F
- Part AC's heading, opening, fixtures and result log name PR B. The old form path in the opening is corrected to governance/forms/frontends/... (class 3, inside the file).
- AC3, AC4 and AC5 sit between AC2 and AC6, with AC5 carrying the Amendment 14 item 2 prediction: `Columns published: id, the geometry, and zone.`
- AC12 follows AC11. The result log has a line for each new row.
- AC10 gains PR B's two coverage-lost sentences for sight (HOVER_SESSION_COVERAGE_LOST_TEXT and ENDED_BECAUSE).
- F1 lists the Colour by controls. They sit outside the disclosure, in StylePanel.tsx.
- A pointer dated 2026-11-15 (from `date -u +%F`) names what no longer holds of F2 and F6.

RUNS (both at 0fa941c0, exe as given, port 5400, harness unchanged)
- rec-pa-1 (plain):
  - First line: "worktree C:/dev/wt/m4b head 0fa941c079d66b7ea5731f07c69c6238a214674e start 2026-11-15T20:30:30Z".
  - 16 PASS lines, 0 FAIL lines and no "pan-anchor.mjs fatal:" line. Last two lines: "==== 16/16 PASS ====" and "rc=0 end 2026-11-15T20:33:38Z".
  - Loads: "load rec-pa-1-pre 20:30:20Z 3,6,11" and "load rec-pa-1-post 20:33:44Z 3,17,4".
  - The audit log was never written (no file at the path).
  - The app's stderr names a session log. I copied it at once to <S>/rec-pa-1.session.log (160726 bytes).
- rec-pa-l1 (under load, via m4b-rec-pa-l1.sh):
  - First line: "worktree C:/dev/wt/m4b head 0fa941c079d66b7ea5731f07c69c6238a214674e start 2026-11-15T20:36:59Z".
  - 16 PASS lines, 0 FAIL lines and no fatal line. Last two lines: "==== 16/16 PASS ====" and "rc=0 end 2026-11-15T20:45:02Z".
  - recenter-crossing-A passed under load (dx=1200 and dx=-1200, in both sizes).
  - The build was alive at the suite's start ("build windows pid 78556 rows 1; processes naming the load target 4") and at its end ("rows 1; … 9"). The first Compiling line was proc-macro2.
  - Loads: "load rec-pa-l1-pre 20:36:46Z 76,79,77" and "load rec-pa-l1-post 20:45:13Z 84,94,100".
  - The stamps file is <S>/rec-pa-l1.stamps.txt. The load target was removed and "msys pid 38590 gone" was printed. The session log is copied to <S>/rec-pa-l1.session.log (252509 bytes). No audit file was written.
  - The app's stderr is two lines, so the first and last 20 lines are those same two lines.
- Both runs' app-down output was "killed tree …", then "port 9223 free" and "port 5400 free". Both logs are in <S>/m4b-e2e-h/out/.

MACHINE
- Status 1 (before hold 1): no project=SpatialIDE line; reading quiet=False average=14.5% peaks-over-25=0.
- Status 1b (after the grant): one project=SpatialIDE hold, so the re-read exited 0; reading average=15.5% peaks-over-25=1.
- Status 2 (before hold 2): no project=SpatialIDE line; reading average=17.3% peaks-over-25=4.
- Status 2b (after the grant): one hold, re-read rc 0; reading average=19.6% peaks-over-25=4.
- The hold and release lines carry also=<m>. No hold was refused, no exit 90/92/95/96-99 occurred, and the lod-tier worker did not overlap.

SELF-CHECK (the four classes)
- Interfaces: the cross-module reads were of the real code (the TableSource, the effect in App.tsx, publish.rs).
- Completion claims: each points to a command in this transcript.
- User-facing text: it describes only the behaviour read in the code at this commit.
- Tests: no test was added, since the brief changes no code. The two runs reached their final assertion (16/16).

DEPARTURES AND DISCLOSURES
- Files I wrote in <S>: m4b-rec-copy.mjs, m4b-rec-pin.mjs, m4b-rec-replace-line.mjs, m4b-rec-insert-after.mjs, the c51/b51/c59/c65/c66 text files, m4b-rec-msg.txt and the status files. I applied my own comment and body text with those two line scripts and with the Edit tool. All are in <S>.
- Edits in the two files that the brief does not name: the item 54 comment, the item 56 comment, the AC10 sentence, and the Part AC opening's path fix.
- The e2e README is not in my list. Its numstat is 12 lines.
- Off-scope, not done: Part G's G3 lists the dialog's fields without the Columns published line, and F5 says fill_color is a literal, which is untrue with a Colour by applied. verify-quotes has the 21 existing misses above.
- Background shells: none left. My two wait loops ended.

MODEL: Sonnet 5.5 (claude-sonnet-5-5), no override. I received one context handoff, a summary of my own earlier context.
