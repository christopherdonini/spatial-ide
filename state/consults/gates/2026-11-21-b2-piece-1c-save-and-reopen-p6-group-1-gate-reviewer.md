Reviewed: cut/1c-p6-group-1 at b42ccb3e7060d7179822ee21c7661ca2699bb18b (the custodian's filing note, 2026-11-21: P6's first group's single gate (ADV-2026-11-21-14 items 6 and 7); Bash 31, Read 6, SubagentHandback 1, by unique call ids; errored: 1 (Read), model claude-opus-5-5, from 2026-11-21T11:46:33Z to 2026-11-21T11:54:29Z by its transcript; the report below byte for byte from its hand-back of 14782 bytes, sha256 890217ac826c4be801923c155392cfbc24cfc655db30c742f4846c26831019d5, with the scratch folder's path written as <S> and two clock times of its check 5, one with its zone, written as <t> by the custodian, with this note in its first line and one final newline; its findings went to the advisor), gate, reviewer
Verdict: PASS. Reviewed `cut/1c-p6-group-1 @ b42ccb3e7060d7179822ee21c7661ca2699bb18b`. Every one of the 37 literals loses only its mark, Part AD gets item 4's two changes and its hash matches the ruling's, and all eleven strings read true against the code. There are three Documentation findings (N1 to N3), all source comments, all must-fix before the merge, with replacement words below.

Model: Opus 5.5 (claude-opus-5-5).

## Start
- `rev-parse HEAD` rc=0: b42ccb3e7060d7179822ee21c7661ca2699bb18b.
- Porcelain rc=0: 0 bytes.
- `ls-remote origin refs/heads/cut/1c-p6-group-1` rc=0: b42ccb3e…bb18b.
- `log --oneline H0..H` rc=0: one commit, `b42ccb3e feat: the reopen's 37 strings without the P6 mark, Part AD by script (ADV-2026-11-21-14)`.
- Branch: cut/1c-p6-group-1.

I read these from origin/main:
- the ruling ADV-2026-11-21-14, whole
- the 1c form, Amendments 73 and 74 (74 first)
- the grant of 2026-11-13, item 3
- the human's approval directive that names ADV-2026-11-21-12
- AUTONOMY §21 to §21d
- ADV-2026-11-20-05 and ADV-2026-11-20-09, to check where the words come from
- the worker's report `<S>/p6g1-hb-1.md`

## 1. Scope
`diff --numstat H0 H` rc=0 lists six files:

| File | Added | Removed |
|---|---|---|
| MANUAL-WALKTHROUGH.md | 5 | 5 |
| src-tauri/src/commands.rs | 2 | 2 |
| admission/AdmissionPanel.tsx | 3 | 3 |
| layout/actionRegistry.ts | 4 | 4 |
| project/reopenNotices.ts | 28 | 27 |
| project/saveProject.ts | 10 | 9 |

These are exactly Amendment 73's Scope. No test file is touched, and nothing under kernel/, engine/ or protocol/. The Out-of-scope line names no §21a category, and the diff touches none.

## 2. Items 2 and 4, by script and by reading
**What the script checks.** I read `<S>/chk-p6g1.mjs` (sha256 7aaf5262…1038).
- For each source file it builds the expected file from H0. It removes `[P6 placeholder] ` only where it follows `"` or a backtick, and skips the `layer.revealStyle` and `layer.revealTable` lines.
- It compares every non-comment line with H, in order, and counts the marks removed against 24, 8, 2, 2 and 1.
- For the walkthrough it takes item 4(a)'s two texts from the ruling's copy, after checking that copy's sha256 (70a3a568…42d7). It applies (a) and (b) to Part AD of H0, then compares the whole file with H and with the ruling's sha256.
- So it checks what it says it checks. Three limits, none of which matters here:
  - The comment filter treats any line starting with `*` as a comment. I read every hunk and no code line starts that way.
  - The removal in (b) covers all of Part AD, not just rows AD1 to AD5. Whole-file equality and the count of 12 still prove the result.
  - Comment changes are only printed, which is by design.

**The run.** `node <S>/chk-p6g1.mjs b42ccb3e…bb18b > <S>/p6g1rev-chk.out` rc=0:
- reopenNotices.ts: 24/24 removed, code lines equal, no marks left on code lines.
- saveProject.ts: 8/8, equal, 0 left.
- AdmissionPanel.tsx: 2/2, equal, 0 left.
- actionRegistry.ts: 2/2, equal, 2 left (revealStyle and revealTable).
- commands.rs: 1/1, equal, 0 left.
- walkthrough: (a) 1 of 1, (b) 12 of 12, equal to H, sha256 06d690f1…44ee, which is the ruling's value.
- Last line: `CHECK OK`.

**My own reads.**
- I read all 246 lines of the diff (`<S>/p6g1rev-diff.txt`). Every changed literal differs only by its leading mark. Lines 87 and 88 of actionRegistry.ts at H still carry `[P6 placeholder] Colour by` and `[P6 placeholder] Table`.
- Walkthrough marks, counted with `git grep -o`: 36 at H0 and 23 at H (both rc=0).
- I hashed the walkthrough at H myself: 06d690f14fed1b6e91123da3a76a1257cd75bc7e056ab9a461725c9e9c8544ee.

## 3. Item 3, the comments
`git grep -i placeholder|P6` over the five files at H rc=0. What is left is actionRegistry.ts:86, the revealStyle/revealTable comment (unchanged, as item 3 requires), and lines 13, 63 and 65, which use P6 about slash words. None of those is about this group, and no remaining comment calls a string of this group a placeholder.

Each changed comment, against the code beside it:
- **commands.rs:333** (S2, ADV-2026-11-21-14 item 2): true. The title was added at a3a1ba4e (step 1), and the file named no earlier ruling at H0.
- **AdmissionPanel.tsx:305** (O-19a, ADV-2026-11-20-05 item 2): true. ADV-2026-11-20-05 item 2 has the lines "O-19a, idle" and "O-19a, opening".
- **actionRegistry.ts:84** (S1, ADV-2026-11-21-14 item 2; S22 the bar's `/save`): true. The label was added at a3a1ba4e, and the entry's `command` is "save".
- **actionRegistry.ts:89** (O-19b's label, ADV-2026-11-21-14 item 2): not true. See N1.
- **saveProject.ts:15-16**: not true for `THROUGH_LINK_NOTICE`. See N2.
- **reopenNotices.ts:5-8**: the provenance it gives (-05 item 2, and -09 item 2 for W-STYLE and O-18) is true; S8 is in -05's table and -09 lines 14-15 hold W-STYLE and O-18. It names the approval by its filed path, as item 3 requires. But its sentence "S8 is the human's approval of ADV-2026-11-21-12" says something false: S8 is a question, not an approval. See N3.

## 4. Item 6, the eleven strings, read against the code at H
Where each is shown: saveProject.ts:97-128 makes `save()` return the notices, `handleSaveProject` in App.tsx:2181-2195 stores them, and they show for the admitted dataset (App.tsx shownSaveNotices). The kernel save is kernel/src/project/mod.rs:300-425 and 431-454, and project.spatial is written last (`replace`, line 405) before Ok.

| String | When it shows (code) | Its clauses, and the code that makes them true |
|---|---|---|
| S3 `The project was saved.` | `deps.save` resolved, saveProject.ts:113-116 | Ok is returned only after `replace` wrote project.spatial. `history()` cannot fail. |
| S5 `The session history holds no saved-here mark for this save.` | `history_mark === "withheld"`, :117 | `HistoryMark::Withheld` is set on every path where no mark was written (mod.rs:459-476). |
| S18 `The data is inside the project folder, but its path has no canonical spelling on this machine.` | `project_relative === "no-canonical-spelling"`, :118 | resolver.rs:76-90: strip_prefix(F) succeeded, so the data is inside the folder, then the segment or canonical-form check failed. |
| S18 `The project will not find that file on another machine.` | same | Only the machine-recorded locator is carried (mod.rs:1183-1184). |
| O-9 `…reaches it through a link. The project will not find that file on another machine.` | `"through-link"`, :119 | The data is inside the folder, then `reached_through_link` (resolver.rs:91-93, 103-121); machine-recorded only. |
| S6 `A selection made by clicking is not saved.` | `selectionCount > 0`, :102 and :120/:124 | `workspaceOf` (:82-89) carries no selection member. |
| S7 `The folder already holds a project.` | code `skp.project_folder_holds_project`, :124 | First save, an object at the target in the picked folder (mod.rs:335-336, 1246). |
| S23 `The project was not saved.` | `view === null`, :101 | Returns before the picker and before any send. |
| S4 `The project was not saved: {message}` | picker threw (:108), or a refusal (:124) | A refusal comes before `replace` and writes no project file (mod.rs doc at :427-430). |
| S1 `Save project` | App.tsx:2223-2227 button, only while admitted; bar entry available `dataset && onSaveProject` (StudioLayout.tsx:222-223) | Both run `handleSaveProject`. |
| O-19b `Open project` | bar entry (StudioLayout.tsx:216-217, 264) | Runs `requestProjectPick`, which opens the folder picker and then `open_project` (AdmissionPanel.tsx:387, 408). |
| S2 `Choose the project folder` | `set_title` in `binding_pick_project_folder` (commands.rs:342-353) | Used both for a first save's folder and for the folder a reopen opens. Both are the project folder. |

I found no clause untrue in ordinary use. Two non-ordinary cases are named below for source comments (N5 and N6).

## 5. Item 5, tests and run
**My grep.** At H I searched `frontends/shell/e2e` and `*.test.ts`, `*.test.tsx` and `*.test.mjs` (`<S>/p6g1rev-grep5.txt`) for 18 texts. They include all eleven of check 4, plus `Opening project…`, the S8 question, `The same project`, `Do not open`, S9-other, `Choose the data file…`, W-STYLE and S20.
- 16 returned rc=1, no match.
- `Save project` matched only describe titles: App.save.test.tsx:130 and saveProject.test.ts:59.
- `Open project` matched only comments: App.reopen.test.tsx:260 and :316.
- This matches the worker's finding.
- `frontends/shell/e2e` holds 48 tracked files. A wider grep for the mark and for text fragments in e2e found only other groups' strings (attributes, colour, table, command-bar, s5dVerdict). No e2e run is owed.

**The verify run.** I reused `<S>/p6g1-verify.log`:
- The chained `&&` verify reached its last step: vitest `Test Files 123 passed (123)`, `Tests 1570 passed (1570)`, then the node suites at 76/0, 30/0, 5/0 and 7/0.
- The log's mtime is <t> (11:08Z), before the commit at 2026-11-21T<t>.
- I did not re-run it, and I ask for no shared hold. commands.rs is not covered by the shell's verify, but its change is a string constant and a `///` line, so I had no doubt to resolve. CI's Rust job will build it.

## 6. The size
- Numstat gives 92 changed lines in the five source files and 10 in the walkthrough, 102 in all.
- §21c's counting, as its 2026-09-16 note words it, is "Insertions plus deletions over non-generated code and tests". The declared threshold sentence is likewise "changed lines of non-generated code". The exempt set is carved out of that count and does not widen it.
- MANUAL-WALKTHROUGH.md is neither code nor a test file, so the text's reading is **92, and Amendment 73's budget of at most 100 holds**.
- The other reading, that Part AD as the Operator gate is a test procedure, gives 102 (see N4). Under either reading the piece stays inside §21c's own bounds (at most 150 lines, at most 8 files: 102 and 6), so the single-gate route is unaffected.

## Findings
Correctness: none. Evidence: none. Documentation (must-fix before the merge):

**N1. frontends/shell/src/layout/actionRegistry.ts:89** at H.
- The comment names ADV-2026-11-21-14 item 2 as the source of O-19b's label. The label's words are ADV-2026-11-20-05 item 2's (its table line "O-19b, the label | [P6 placeholder] Open project").
- The entry was built at f38bb37c (P4a-2), not by the worker of step 1, and step 1's worker is who ADV-2026-11-21-14 item 3's "otherwise" branch is about.
- So the comment is untrue against the grant's item 3 and the ruling's item 3 ("the ruling that worded it"). The worker followed item 3's parenthetical literally ("where the file names them today"), and that misses here because the file named only -05 item 6.
- This is the worker's wording, not the human's. Replacement words:
  `  // O-19b: the label (the advisor's wording under the human's delegation of 2026-11-13, ADV-2026-11-20-05 item 2) and the bar's word, as the save's is (ADV-2026-11-20-05 item 6).`
- Clause check:
  - "O-19b … the label": the -05 table, and line 90's `label: "Open project"`.
  - "ADV-2026-11-20-05 item 2": the table line, equal to H's literal less the mark.
  - "the bar's word, as the save's is (ADV-2026-11-20-05 item 6)": item 6 says the word "is typed after the slash and carries no marker, as the save's does", and line 90 has `command: "open-project"`.

**N2. frontends/shell/src/project/saveProject.ts:15-16** at H.
- The comment says every string in the file is "the words the worker of step 1 wrote". That is untrue of `THROUGH_LINK_NOTICE` (O-9, line 34). Its words are ADV-2026-11-20-05 item 2's line "O-9 | [P6 placeholder] The data is inside…", and it was added at f38bb37c (P4a-2).
- The other seven were added at a3a1ba4e and c57f090b, both step 1 commits of 2026-11-11.
- This is the worker's wording, not the human's. Replacement words:
  ` * - **Every string here is the advisor's wording under the human's delegation of 2026-11-13**: `THROUGH_LINK_NOTICE` (O-9) from ADV-2026-11-20-05`
  ` *   item 2, and the others the words the worker of step 1 wrote, taken as the app's words by ADV-2026-11-21-14 item 2.`
- Clause check:
  - O-9 is the -05 line, byte-equal to line 34 less the mark.
  - "the others … step 1": the `git log -S` results above.
  - "taken as the app's words by … item 2": the ruling's items 2 and 3.

**N3. frontends/shell/src/project/reopenNotices.ts:7-8** at H.
- "S8 is the human's approval of ADV-2026-11-21-12, filed at …" is not a true sentence. S8 is the question and its three choices (lines 21-28). The approval is what gave S8's words to the advisor; the approved draft says "I give those words to the advisor like the other strings the app shows."
- This is the worker's wording, not the human's. Replacement words: replace `S8 is the human's approval of ADV-2026-11-21-12, filed at` with `S8's words are the advisor's by the human's approval of ADV-2026-11-21-12, filed at`, and leave the path that follows unchanged.
- Clause check:
  - S8's words are in -05 item 2's table.
  - The approval directive's draft gives them to the advisor.
  - The path is the filed directive on main.

**N4. Amendment 74 item 3, the size reading.**
- The text reading of §21c gives 92, which is inside the budget (check 6).
- If the advisor reads the walkthrough as a counted test procedure, the 102 is a class 6 budget deviation under §21b's mid-piece overrun clause. Item 3 already discloses it before the gate, so only the closing would need a row for it.
- Nothing is declared again.

**N5. For the advisor, on the ruling's item 6, no rewording.**
- Item 6 calls the eleven strings "step 1 built". O-9 (`THROUGH_LINK_NOTICE`) and O-19b's label were built at f38bb37c (P4a-2) under ADV-2026-11-20-05 item 2, and PR 341's gates read them.
- I read all eleven anyway, and all are true. The slip is what produced N1 and N2.

**N6. Non-ordinary cases, named for the strings' source comments. Neither blocks.**
- (a) S4 `The project was not saved: ` shows for `skp.protocol` `save_project_panicked` (commands.rs:190-192). A panic in `history()` or after `replace` (mod.rs:405-418) would come after project.spatial was written. This needs a panic, not ordinary use.
- (b) S7 `The folder already holds a project.` shows when anything exists at the target name in the picked folder (`symlink_metadata(&target).is_ok()`, mod.rs:335). That includes a non-project object of that name, which needs someone to place one there deliberately.

Scratch outputs are in `<S>/`, all named `p6g1rev-*`. The script's output is `<S>/p6g1rev-chk.out`. Nothing was written in the worktree.
