# The advisor's ruling ADV-2026-11-27-31, under the human's delegation of 2026-11-13, not the human's words: both e2e steps corrected before the port, text-id's TEXTID' (d) on its own branch and the C1 piece's E-R1 after a merge; no gate runs again; the e2e README section replaced whole; row AH8 and KNOWN-LIMITATIONS item 3 unchanged

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-31.md in the advisory folder, 15335 bytes, sha256 2b4a443c8a4cf6926bc0340d3e0fd1b2fdda66c4493ff716482f87394dd4e060, UTF-8, last modified at 2026-11-27T19:31:53Z by the file system. It was named by a session message received before 2026-11-27T19:32:14Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-31, to the custodian, 2026-11-27 (19:31Z). The C1 piece, `text-id-reopen-with-a-recorded-declaration`, at 97019e9198a9a2d110d0d686ce8166574547d4ce (PR 369, draft), after its two build-gate read parts, and text-id's own step `TEXTID'` (d) at 2df8b4ae: both e2e steps are corrected before the port serves them. It replaces the README section of ADV-2026-11-27-30 item 3, whole. Everything else of that ruling stands.

Read by me: both read parts as filed on main at 195a2294, whole; the C1 form's §4, §5, §10 and Amendments 5 to 8; text-id's form's E-1 rows and its §10. At 97019e91: `stepTextid` and `stepTextidC1` whole, with the suite's header and its wait helpers; in `e2e/reopen.mjs` the header, the helpers and steps R1 to R8; in `kernel/src/project/mod.rs` `release_ended` with its doc, the lock in `Projects::save`, and `open_project` from its place match to the request it builds; K-O26's doc and its control in `kernel/tests/project_reopen.rs`; K-R1 and K-R2; App's close effect; `rowPositionOffer`; S-R2 with its comment; the two `engine.identity_unusable` fixture files; the engine's two refusals for a column the file does not carry or cannot address; the two hooks' declarations in `e2e-test-surface.ts`; the reopen in `second-open.mjs`; rows AH5 and AH6; text-id's README section; the human's message of 2026-11-22 on flaky tests. Not read: the logs and the reviewer's scripts, B's and A's branches, and `App.tsx` beyond the close effect. The code `skp.project_open_elsewhere` for a held lock I take from `reopen.mjs` R4 and the two read parts.

1. **The finding stands, by my own read. The fault in ADV-2026-11-27-30's clause (3) is mine.**
   - A first save takes the project's lock and keeps it with the saved open. `release_ended` drops that entry only when the catalog no longer holds the open's dataset, or its session has ended.
   - `open_project` calls `release_ended` and then tries the lock. A held lock is `OpenFailure::OpenElsewhere`.
   - K-O26 asserts that refusal as its control. `reopen.mjs` R4 expects it through the app, and R5 and R8 each open another file and wait for the close before they reopen.
   - `TEXTID'` (d) and `TEXTID-C1` (3) each reopen the folder they have just saved while the saved open is still in the window. Neither can pass as written.
   - For ADV-2026-11-27-30 I read the step whole and did not see it. Its clause (3) described a control that could not pass.

2. **Text-id's `TEXTID'` (d) is corrected now, before its series, on text-id's own branch.**
   - The route: an amendment of text-id's form first, then one correction commit on text-id's head 2df8b4ae. Class 9 on this ruling: E-1 (d) gains an act. The fault is the form's: its §4 row has the save, the read of `project.spatial` and "Open the project", and no act that ends (a)'s open.
   - The act: after (d) has read `project.spatial`, and before it reopens, the step opens another file that admits and waits for the close of (a)'s open. `no-id-column.parquet` serves.
   - The wait is for the close's own signal, as `reopen.mjs` R5 has it: a `close_dataset` row at `ok` in the Console whose request is not among those read before the open, polled to a harness bound that fails the step by name.
   - The human's message of 2026-11-22, item 1: "Waiting with a deadline for a real completion signal is not the same as retrying a failed assertion." A reopen tried again until it stops answering `skp.project_open_elsewhere` is such a retry, and is not used here.
   - A signal other than the Console's row comes to me before it is committed.
   - The wait is one function in the suite's file. C1's step calls the same one.
   - No assertion of the step is removed or loosened. If the worker finds that one must change, it comes to me.
   - The step's doc comment and clause (d) of the README's section "Row-position spec" gain the act, in the worker's words. That section is the worker's by its own comment.
   - No gate of text-id runs again. Each gate reads the correction in its run part, with the run. The suites that start no app and `node --check` of the file are green at the new head. The lines count in text-id's closing count.
   - M-25 does not change. Rows AH5 and AH6 do not change: AH6 closes the app before it opens the project.

3. **C1's E-R1 is corrected by a worker. No gate runs again, and the README section is item 6.**
   - The order:
     1. C1's branch takes text-id's corrected head in by a merge commit, never a rebase;
     2. an amendment of C1's form: class 9 on this ruling for the acts below;
     3. one correction commit;
     4. the count at that commit's head by §7's own command, recorded as class 8 again, with §7 not edited.
   - The steps keep their numbers. "Step (5)" then means in every record what it meant.
   - Step (3) begins with the new act: `no-id-column.parquet` is opened, and the step waits for the close of step (1)'s open. Then the control, as written.
   - Step (4): after its open, the step waits for the close of the control's open. Then it removes the first folder. This is the architect's F2 (item 4).
   - Step (5) and M-RD8 do not change.
   - No assertion of the step is removed or loosened.
   - The step's doc comment follows the acts, in the worker's words.
   - The correction commit holds the step with its doc comment, item 6's section, item 5's comment and the architect's F4 pair, and nothing else.
   - Each gate reads the merge and the correction in its run part. The suites that start no app and `node --check` of the file are green at the new head.

4. **Step (4)'s wait is a correction. This is the architect's F2.**
   - The shell closes a replaced open from an effect and does not wait for it. By both read parts, step (5)'s call can therefore arrive while that close is in flight.
   - A reopen that reaches the kernel before the old dataset is closed meets the lock. The step then fails on its own timing.
   - `reopen.mjs` R8 stands at the same place. Before it reopens a copy, it opens another file and sees the close of the reopened project's handle first.
   - The reviewer is right that the step would fail by name and never show a false green. That makes the fault visible. It does not remove it.
   - Under the human's message of 2026-11-22, each such failure of a test that ran is a finding with its own node. A source comment prevents none of them, and each costs a turn at the port.

5. **S-R2's fixture: the file does not change in this piece. The test's comment does, in my words.**
   - The architect is right about the evidence. The offer is decided from the refusal's code, its column and its `identity_source`, with the run's options. K-R1 (ii) asserts those three values from the engine, through the kernel. The real-app proof of the `file:id` half is E-R1's step (3), once item 3 is in.
   - The reviewer is right about the description. The comment calls both files real and says of the first that a file gives it. The engine at this head writes that file's detail nowhere.
   - The file's message and detail are older than this piece, which adds the one field to it. Rewriting a wire fixture's message is not this piece's work.
   - The test's name stays. In the form, "real fixture file" is read as a file under `protocol/skp/tests/data/`, not a refusal made by hand. The amendment of item 3 records that reading.

````text
frontends/shell/src/skp/__tests__/fixtures.test.ts, S-R2's comment, one span:
Old: the two real `engine.identity_unusable` fixture files, the one a file gives and the one a declaration gives, each through
New: the two `engine.identity_unusable` fixture files under `protocol/skp/tests/data/`, the one that carries `file:id` and the one that carries `mapped:id`, each through

The same comment, one new line directly after the line that ends "tells them apart.":
  // The `file:id` file's message and detail are ones the engine does not write; the offer reads neither. K-R1 (ii) in `kernel/tests/text_id_reopen_recorded_declaration.rs` asserts the code, the column and `file:id` from the engine, through the kernel.
````

   - Each clause, against the code:
     - the test loads both files from `protocol/skp/tests/data/`, and they carry `file:id` and `mapped:id`;
     - a search of `engine/src` and `kernel/src` at this head for the detail's words "no identity mapping was declared" finds nothing;
     - `rowPositionOffer` reads the code, the column, `identity_source` and the run's two options, and nothing else of the refusal;
     - K-R1 (ii) asserts `engine.identity_unusable`, the column `id` and `file:id` on P0's reopen through `open_project_command`.
   - For your daily batch: name the fixture's message as a proposed node. I grade it there.

6. **The e2e README's section, whole.** It replaces the section of ADV-2026-11-27-30 item 3. Three places differ: the comment names this ruling, one sentence on the waits is new, and clauses (3) and (4) follow item 3.

`````text
## Recorded-declaration spec (text-id-reopen-with-a-recorded-declaration)

```
npm run e2e:admission
```

<!-- Drafted by the build worker of text-id-reopen-with-a-recorded-declaration and corrected by the advisor (ADV-2026-11-27-30 item 3; ADV-2026-11-27-31 item 6); not the human's words. The step was not run by the build that added it: the run is the tester's. -->

`e2e/admission-remediation.mjs` gains the step `TEXTID-C1` (E-R1), after `TEXTID'` and before `DUPKEY'`. Its opens and its save go through the suite's hooks (`openPath`, `e2eSaveProjectToFolder`, `e2eOpenProjectFolder`), and the refusals' codes are the hooks' answers; each choice is a click on the page's own button, and the field rows and the owner line are read from the page's own refusal block. Each wait for a close is for a new `close_dataset` row at `ok` in the Console, as `e2e/reopen.mjs` waits at its R5. (1) `text-id-no-integer-refused.parquet` is refused as `engine.identity_unusable`, the choice is clicked, and the open is saved to a scratch folder. (2) That folder is copied, and in the copy's `project.spatial` the one line `"identity": null` is replaced by the three lines that record `{"column": "id"}`, in the layout the project file's writer gives them; the reader refuses a file whose bytes are not that layout. (3) The control. `no-id-column.parquet` is opened first, and the step waits for the close of step (1)'s open: the project a first save wrote stays held while the saved open is in the window, and its reopen is then refused as `skp.project_open_elsewhere`. After the wait, the reopen of the first folder is refused as `engine.identity_unusable` with a field row `identity_source` reading `file:id` and the choice offered, and a click on the choice opens it with the choice's line. (4) `no-id-column.parquet` is opened again to replace the project in the window, the step waits for the close of the control's open, and the first folder is removed, so that step (5) reaches the engine: a reopen of a project that another open holds is refused as `skp.project_open_elsewhere`, and the kernel asks about a folder while the project's first folder still holds the project. (5) The copy is opened through `e2eOpenProjectFolder`, which must answer `engine.identity_unusable` at its first call; an answer of `question` or `skp.project_open_elsewhere` fails the step by name. The refusal block must show the field row `column` reading `id`, the field row `identity_source` reading `mapped:id` and the owner line R-ENG, and the page must hold no button of the choice.

It exits as the suite does: 0 when every step passes, 1 when one fails. It is operator-run and not in CI or in `npm run verify`.

**What it proves not.** The words of R-ENG (the step compares the line with a copy of it), any timing, macOS or Linux, the native folder picker or a project file edited in place (row AH8 of the operator's Part AH), a project that a save wrote with a declaration of `id` (the kernel test K-R1 does that), that no form shows beside the refusal, or a recorded declaration of a column other than `id`. The unrun step is not an observation: M-RD8, `rowPositionOffer` without its check of `identity_source`, is the step's own mutation and was not observed by the build.
`````

   - These words describe the step as items 2 and 3 rule it, not a step I have read. If the corrected step does not meet a clause, the clause comes to me before the correction commit.
   - The reviewer's run part reads each clause against the corrected step.

7. **Row AH8 and its result-log line do not change.**
   - Both read parts find each clause true at the code.
   - The row starts from a closed app, so the lock of item 1 does not meet it.
   - Its expected outcome still rests on E-R1's step (5), which has not run. With item 3 in, the step can reach it. ADV-2026-11-27-30 item 2's condition stands: a different result at the port comes to me before the run part's verdict.

8. **KNOWN-LIMITATIONS item 3 does not change. My reading in ADV-2026-11-27-30 item 4 stands, and this is what it rests on now.**
   - "Opening the file or the project again refuses the column and asks again" rests on K-R1 (ii) in the kernel, which closes the saved open before it reopens, and, by their forms' rows, on S-R1's control and text-id's S-T4 in the shell.
   - Through the app it rests on `TEXTID'` (d) and E-R1's step (3). Both are corrected under this ruling, and neither has run.
   - Row AH6 is the human's own check of it, and it closes the app first.
   - If either step at the port shows such a reopen not refused for `id`, or not offered the choice, it comes to me before the run parts' verdicts.
   - A project still open in its window is refused as open elsewhere before the engine is asked. That holds for every project, as R4 shows. The human's sentence speaks of what the choice leaves behind, not of that.

9. **The hooks' caller lines in `frontends/shell/src/e2e-test-surface.ts`.**
   - The architect's note is true at this head, by my read. The two declarations name one caller each, and `admission-remediation.mjs` has called both hooks since text-id.
   - B's commit 2962d546 rewrites both lines, and its lists lack this suite too.
   - Neither text-id nor C1's piece touches that file under this ruling.
   - Bring it to me as its own question, with each hook's callers on every unmerged branch. I rule it once, for all of them.

10. **The port.** Its order does not change: text-id's series, then E-R1. At this head no other suite expects such a reopen to reach the engine: `reopen.mjs` expects the refusal at R4 and waits at R5 and R8 (I read its steps to R8), and `second-open.mjs` reopens from a second app. I did not read B's or A's branch for it.

11. **At the merge checks.**
    - C1's piece: row AH8 and its result-log line against ADV-2026-11-27-30 item 2; the README section against item 6 here; S-R2's comment against item 5; both byte for byte.
    - Text-id: that (d)'s wait is item 2's, and that no assertion of the step went.

12. Nothing here is reserved. For the human, in the digest: two test steps that run through the app could not pass as written and are corrected before they run; no product code changes; limitation 3 and row AH8 stay as they are; the README entry I worded in ADV-2026-11-27-30 described a check that could not pass.
