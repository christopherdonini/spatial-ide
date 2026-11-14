# The advisor's ruling ADV-2026-11-14-09, under the human's delegation of 2026-11-13, not the human's words: a sweep of what is dead on C:, asked of the advisor by the human in the advisor session (the human's message there is quoted inside the ruling; it was not typed in the custodian's session); merged clean worktrees, unneeded build folders of kept worktrees, cargo's output in the main checkout and dead evidence builds may go, each checked and listed first; nothing the Guardian protects, nothing of the other project or a shared cache, nothing a piece in flight needs; new worktrees' cargo targets go to D: by their own commands; one report

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-09.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T04:40:30Z by the custodian's transcript; the custodian acts on the file. 6014 bytes, sha256 fc93d720ae16c7c2b25ec37662272c481172e3381cd36a416812f61ebe2546d3, last modified at 2026-11-14T04:40:29Z by the file system; read by the custodian at 2026-11-14T04:44:33Z and again at this filing (2026-11-14T05:12:43Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-09. To the custodian. Subject: a sweep of C:, asked of me by the human in the advisor session.

The human typed this to the advisor session; I read the clock at 04:39Z after it arrived. It is quoted so that you know what was asked. It is his message to me, not a message in your session, so file this ruling as the advisor's and the items below as mine:

"Free space on C:. Have the custodian sweep what is dead (merged worktrees, their build folders, old evidence builds), put build output on D: where it can, and report what it freed. Nothing the Guardian protects, nothing of the other project, nothing a running piece needs."

What I read: the first lines of `state/CUT-STATE.md` on main (the worktrees and outside folders it lists) and its entry of 2026-10-22 on the D: folders; item 7 of the human's message headed 2026-10-23; `git worktree list` for the repository; the names in the worktrees folder; free space at 04:39Z: C: 45,058 MB, D: 172,273 MB. I sized no folder.

1. Do the sweep now. It does not wait for a slot, and no piece waits for it.

2. What is dead and may be removed. Each one is checked by you before it goes, and named by its full path.
(a) A worktree whose branch is merged into main, with its build folders wherever they are (C: or D:), when three things hold: its working tree is clean (nothing uncommitted, nothing untracked that git does not ignore); no open record names it or a file in it as still to be run, read or sighted; no process is using it. Remove it with `git worktree remove`, never with a force flag. A worktree that is not clean stays, and is listed.
(b) Build folders of a kept worktree that no piece in flight needs and no open record names: cargo `target` folders, `node_modules`, `dist` and the like, all remade by the next build. The worktree itself stays. This covers the reproducer worktrees and any worktree whose next run rebuilds in any case. For port-2's worktree, check first that no record names an executable there as the one still to be run; port-2 takes main in before its gates, and main's compiler pin dates from after its build.
(c) Cargo's own output in the main checkout's target folders, on the terms of ADV-2026-11-13-19 items 2 and 3. Only cargo's folders. Nothing an operator or a walkthrough step put under a target folder (a publish destination, a served bundle) is removed.
(d) Old evidence builds under the evidence folder your ledger names: executables, installers and build trees, when the record of each (its hash, size and commit) is on main and no open node, sitting row or release step still names it to be run, installed or sighted. Raw measurement files, logs and reports stay; they are not builds. Where you are not sure a build is dead, it stays and is listed for me.

3. What is not touched, whatever its size.
(a) Anything the Guardian protects: the Guardian's own folders and the mods folders, the `guardian` folder beside the evidence folder, and any path a Guardian rule refuses. A refusal stops that step. Do not work around it; tell me, and it goes to the human.
(b) Anything of the other project. Do not list, size or open its folders. Shared caches that are not provably this project's alone (the cargo and npm caches in the user profile, the caches folder on D:) are left as they are.
(c) Anything a piece in flight needs: the worktrees of the second-open node, the pan-anchor fix, PR B and the docs lane's piece, the e2e checkout, and every build they use, PR B's build for its run alone included.
(d) The two worktrees your ledger marks as not this session's work. Size them and list them; they stay.
(e) No branch is deleted, local or remote. No `git clean`, no `git gc`, no pruning of objects, no `cargo clean` over a workspace a piece is using, no wildcard delete.

4. Build output on D:, where it can.
(a) From now on a new worktree's cargo target goes to D:, under the targets folder already there, as earlier pieces' targets did (your ledger of 2026-10-22 lists them). It is set in the run's own command or its brief, for example by `CARGO_TARGET_DIR`. The form's commands do not change by this.
(b) Not for a piece in flight. Its builds stay where they are until it merges; a move would cost a cold build and change its runs' conditions midway.
(c) Not where a tracked file resolves a build by its path under the worktree: the shell's `src-tauri/target`, which the e2e library, the Tauri build workflow and the walkthrough name. If moving that needs a tracked file changed, it is its own piece; propose it with round 77 if the sizes make it worth it.
(d) Not by any change to a Claude settings file, a session's environment settings, or a cargo configuration file outside a worktree. Those are the human's.
(e) A run whose time matters records which drive its target was on.

5. How.
(a) You do it yourself, or a worker does under a brief that lists every path to remove by its full name. If your rules ask for a hold for a removal, take one.
(b) Nothing is removed while a process of this project is using it. Slot 2's worker is running; nothing in its worktree or its target is touched.
(c) Everything to be removed is listed in your ledger, with its piece and size, before any of it is removed, as the human's item 7 of his message headed 2026-10-23 had it for the D: folders.
(d) Read free space on C: and D: before and after, from the clock.

6. The report, to me, in one message, and filed as a consult:
(a) free space on C: and D:, before and after, with the times;
(b) each thing removed: its path, its size, and why it was dead;
(c) each thing kept that is over 1 GB: its path, its size, and what needs it;
(d) what now builds on D: and what cannot;
(e) anything large you found that is not yours to decide.
I pass the totals to the human.

7. The floor. C: is about 4 GB over the 40 GiB floor now. If it falls under the floor before the sweep ends, ADV-2026-11-13-19 item 4 (a) applies: nothing that asserts the floor starts.
