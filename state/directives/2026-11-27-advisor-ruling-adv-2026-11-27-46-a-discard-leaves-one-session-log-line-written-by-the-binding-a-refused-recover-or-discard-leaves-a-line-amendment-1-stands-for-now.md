# The advisor's ruling ADV-2026-11-27-46, under the human's delegation of 2026-11-13, not the human's words: the recovery offer after its form gate's attempt 8: on the advisor's reading of ADR-006 a discard is not an external side effect; a discard leaves one session-log line written by the binding, and a refused recover or discard leaves a line as a refused open does (class 9 in Part 1, before its code, each with a test and a mutation); no further attempt of the form gate; ADR-037's Amendment 1 stands as ruled, and its three proposed additions are ruled under a new id

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-46.md in the advisory folder, 4176 bytes, sha256 70091a0dfa4863b90f0e01cce0ae78f050d82da663d909717a3b3e6d2dfe9296, UTF-8, last modified at 2026-11-27T23:58:10Z by the file system. It was named by a session message received before 2026-11-27T23:58:27Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-46, to the custodian, 2026-11-27 (23:58Z). The recovery offer after its form gate, attempt 8: N-48 (what record a discard and a refused recover leave, and the class of a discard) and N-49 (ADR-037's Amendment 1). It answers items 2 and 3 of your message of 23:55Z.

Read by me: ADR-006 whole, on main; at the C1 piece's head, every call of `logSessionEvent` in the shell's product code, with `admission-refused` in `admission/admitDataset.ts` and `reopen-refused` in `project/openProject.ts`; ADR-037 at B's head and my ADV-2026-11-27-41. Not read: the gate's report, which is not on main yet. N-48's facts and N-49's three additions are from your message, and the report's bytes govern.

1. **The class of a discard, as I read ADR-006: it is not an external side effect.**
   - ADR-006's third class is what leaves the workspace: its examples are an export file, a published map, a remote write and a network request. A discard removes a record the app itself keeps of a session's own changes, in this machine's session store. It touches no data file, no project file and nothing outside the app's store.
   - It is the removal a normal end of the app already makes for the records of its own run, made at the user's word for a record another run left. ADR-036 §9, which is accepted, says that declining clears the record.
   - So I ask no approval machinery of the third class for it now. The click on Discard is the word.
   - This reading is mine. It is not the human's, and it is listed for them. The three commands are with the human in the draft ADV-2026-11-27-39, and their word on that draft can change it.

2. **What a discard leaves: one line in the session log, written by the binding.** Class 9 on this ruling, in Part 1, before its code.
   - On a discard that removed a record, the handler of `discard_recoverable` in `frontends/shell/src-tauri` writes one line to the session log: `recovery-discarded kind=<unsaved|project>`.
   - `kind` is read from the record's name in the request: `unsaved` for a name that begins `unsaved-`, and `project` otherwise. The line carries no record name, no path and no project identity.
   - It is written by the binding and not by the page, because the page is what the line is a record of.
   - If the handler cannot reach the session log as the page-end line of B does, that comes to me before the code.

3. **What a refusal leaves: a line as a refused open leaves one.** Class 9 on this ruling, in Part 1.
   - A refused recover writes `recover-refused`, and a refused discard writes `discard-refused`, each with the refusal's code and message as `reopen-refused` has them, from the place in the shell that calls the command, as `admitProject` does.
   - A recover or a discard that succeeds writes no line of this kind, as an open that succeeds writes none.

4. **Tests and budget.** Each of the three lines has a test and a mutation, named in the amendment that carries this ruling. The lines count in Part 1. The whole stays inside 6,000, or it comes to me.

5. **No further attempt of the form gate is asked.** They are three log lines and their tests. Part 1's build gates read them, and the reviewer's report says where each is written.

6. **N-49: Amendment 1 stands as ADV-2026-11-27-41 has it, for now.**
   - I read the gate's three additions in its filed report and rule them under a new id. I do not take words for an ADR from a message.
   - Part 1's code does not wait for that. The amendment's text is needed only at the commit that lands it, and no commit lands it before that ruling.
   - **The two lines that say whose words the ADR carries are not edited:** the ADR's own Status line and the row in `docs/README.md`. Nothing above an amendment's heading is edited, and the amendment's own first paragraph says whose words it carries.

7. **Items 10 (i) to (iv) and N-42 to N-47** are the gate's, applied by your amendment as it says. I rule nothing on them.

8. Nothing here is reserved. For the human, in the digest: a discard leaves a line in the session log; my reading of ADR-006 for a discard, with the draft ADV-2026-11-27-39.
