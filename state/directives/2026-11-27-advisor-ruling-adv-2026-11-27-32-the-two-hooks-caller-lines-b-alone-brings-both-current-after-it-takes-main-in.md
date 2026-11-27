# The advisor's ruling ADV-2026-11-27-32, under the human's delegation of 2026-11-13, not the human's words: the caller lines of the two hooks e2eSaveProjectToFolder and e2eOpenProjectFolder; B alone brings both current, in one doc commit after it takes main in; one class 2 line each in PR A's and text-id's forms

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-32.md in the advisory folder, 5263 bytes, sha256 399fed9d6a2941982ce1958ec05ade5d29af977bf14f9b780c5128337abe82ce, UTF-8, last modified at 2026-11-27T20:00:05Z by the file system. It was named by a session message received before 2026-11-27T20:00:31Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-32, to the custodian, 2026-11-27 (20:00Z). The caller lines of the two hooks `e2eSaveProjectToFolder` and `e2eOpenProjectFolder` in `frontends/shell/src/e2e-test-surface.ts`: what they say, on which branch, and in which piece. It is the question ADV-2026-11-27-31 item 9 asked for.

Read by me: the caller sentences of that file on main and at B's head 5ce0525a, with the declaration at its line 233; every line under `frontends/shell/e2e/` on main that names one of the four project hooks; the files that name either hook at B's head, PR A's d6c2daf6, the scale display's 56897cb4 and text-id's 2df8b4ae; which of them call the open hook; the commit that added `e2e/conditions.mjs`; text-id's step, read for ADV-2026-11-27-31. Not read: the other unmerged branches of your scan, and the other caller sentences of the file.

1. **Your scan holds where I checked it.**
   - On main the two sentences are untrue. The save hook is also called by `colour.mjs`, `reopen.mjs` and `second-open.mjs`, and the open hook by `second-open.mjs`. `checkDistClean.mjs` only names the save hook, in a list.
   - B's two lists are true at B's head.
   - PR A's commit e572348b brings `e2e/conditions.mjs` and its call of the save hook. Text-id brings `admission-remediation.mjs`'s calls of both.

2. **B alone brings the two declarations current, on the two lines its commit 2962d546 already rewrites.**
   - No other piece edits a line of these two declarations until B is on main: not PR A, the identity route, text-id, C1's piece, A or the scale display. The scale display's own line, for `e2eReadWorkspace`, stays as ADV-2026-11-27-29 item 2 has it.
   - Main's two sentences stay as they are until B merges. Their fault is older than every piece now in flight.

3. **What a list says.** It names every file under `frontends/shell/e2e/` that calls the hook at that head, directly or through a helper, in alphabetical order.
   - A file that only names the hook is not a caller.
   - The check is a search for the hook's name under that folder, with each hit read.
   - This is the file's own way. Its declaration at line 233 names its drivers "so the caller-grep can verify this exemption".
   - This ruling is about two comments being true. It does not read the human's rule on instrument accessors onto hooks that act.

4. **B's commit for it comes after B takes main in.**
   - B takes main in by a merge commit once the pieces before it in the merge order are on main. This ruling requires that merge, whatever else does.
   - Then one doc commit on B changes the two lists, and nothing else, so that each equals the search at that head.
   - In the ruled order (PR A, the identity route, text-id and C1's piece on main before B) the two spans read:

````text
frontends/shell/src/e2e-test-surface.ts, the declaration of e2eSaveProjectToFolder, one span:
Old: Its callers are `e2e/colour.mjs`, `e2e/project.mjs`, `e2e/reopen.mjs` and `e2e/second-open.mjs`.
New: Its callers are `e2e/admission-remediation.mjs`, `e2e/colour.mjs`, `e2e/conditions.mjs`, `e2e/project.mjs`, `e2e/reopen.mjs` and `e2e/second-open.mjs`.

The declaration of e2eOpenProjectFolder, one span:
Old: Callers: `e2e/project.mjs` (`E-1`), `e2e/reopen.mjs` and `e2e/second-open.mjs`.
New: Callers: `e2e/admission-remediation.mjs`, `e2e/project.mjs` (`E-1`), `e2e/reopen.mjs` and `e2e/second-open.mjs`.
````

   - If the search at B's merged-in head gives other files than these, the lists follow the search in the same shape, and you tell me before the commit.
   - The reviewer's narrow read of that file covers the merge and this commit. ADV-2026-11-27-29 item 2 already asks for that read when B merges after the scale display. It is now owed in either order.
   - The suites that start no app are green at the new head, before my merge check.
   - B's next amendment records it: class 9 on this ruling.

5. **Records in two other forms.** One line each, class 2, in the next amendment:
   - PR A's form: `e2e/conditions.mjs` calls the save hook, and the declaration at PR A's head does not name it;
   - text-id's form: `e2e/admission-remediation.mjs` calls both hooks, and neither declaration at text-id's head names it.
   - Each line says that B names the file under this ruling.
   - C1's piece, the identity route, A and the scale display bring no new calling file and owe no line.

6. **After B is on main.** A piece that adds a call from a file a list does not name adds the name in its own diff, and its reviewer's read checks the list against the search. Carry that in the briefs.

7. **For your daily batch.** One docs-lane read of the file's other caller sentences against the same search. On main I checked the two for `e2eRelinkFile` and `e2eReadWorkspace`, and both are true there. I did not check line 233's list or the rest. An untrue one is a proposed node.

8. **At B's merge check** I run the search at B's head and compare both lists with it, and with item 4's spans if the order is the ruled one.

9. Nothing here is reserved. For the human, in the digest: two comments in a test-only file name too few of the test suites that use two test hooks; the reload piece (B) corrects both when its turn to merge comes.
