# The advisor's ruling ADV-2026-11-19-20, under the human's delegation of 2026-11-13, not the human's words: PR 336 held on the path drift; the branch takes main in by one merge commit made by git; the merge shown by script; one run of the selection suite at the merge head by a tester; the reviewer's third attempt limited to the merge; Amendment 2 and a new request; PR 337's paths listed before its request

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-20.md in the advisory folder, 2678 bytes, sha256 65010584bee8afb3c4ef2e45d02815101c64879dd30729a9473cae4635014900, last modified at 2026-11-19T11:24:25Z by the file system; the advisor's message naming it received at 2026-11-19T11:24:39.267Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T11:59:20Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-20, to the custodian, 2026-11-19. PR 336 at 40173dfe: my verdict is HOLD, on the path drift your request names. This ruling says what settles it. It follows my standing ruling ADV-2026-11-14-21, items 1 to 5.

1. **Why.** `frontends/shell/e2e/README.md` changed on main after the branch's merge base f5584f28, with PR 335's merge, and the branch has not taken main in. The seventh check is the human's and has no exception for hunks that do not overlap. The other six checks are met, and so is CI at the head; the verdict file gives each. Nobody erred: at the second attempt's gate no path had changed, and PR 335 merged after it.

2. **The branch takes main in.** One merge commit of main into the branch, made by git, signed off, its message naming the main commit it merges. No rebase, no squash, no forced push, no hand edit. If git reports a conflict, the worker stops and it comes to me. Call the merge head M and the main commit N.

3. **Shown at M, by script.** M has two parents, 40173dfe and N. `frontends/shell/e2e/selection.mjs` is byte-equal at M and at 40173dfe. `frontends/shell/e2e/README.md` at M is N's file with the selection entry's one line as 40173dfe has it. The diff from N to M names those two files and no other.

4. **One run at M.** The selection suite, once, on an app built at M. The form asks that the suite pass at the piece's head, and main has brought the first-look change under it: the map now asks for tiles after each open and each filter change, which this suite does many times. Every step passes, or it comes to me. An unknown-attempt failure of an export step comes with ADV-2026-11-19-13 item 4. A tester runs it.

5. **The reviewer's third attempt, at M, limited to the merge.** A merge of main is not a words-only commit, so the gate gives a verdict at the new head (ADV-2026-11-14-21 item 4). It checks item 3; it says whether anything it passed is made untrue by what main brought since f5584f28, the clauses of the comment and the README line first; it reads item 4's run; it reads CI at M. It runs nothing itself unless it names a reason.

6. **Then.** The form gets Amendment 2, written after the results: this hold, N, M, the run, the third attempt, CI at M. The new merge request names M and N, and that no path of the piece changed on main after N.

7. **So that this does not repeat today.** PR 337 is next to ask. Before its request, you list its paths that changed on main since its merge base 18f14b62, as ADV-2026-11-14-21 item 6 (b) has it. PR 335 and PR 336 touch no kernel path, by their file lists, so I expect none.

8. Nothing here is reserved.
