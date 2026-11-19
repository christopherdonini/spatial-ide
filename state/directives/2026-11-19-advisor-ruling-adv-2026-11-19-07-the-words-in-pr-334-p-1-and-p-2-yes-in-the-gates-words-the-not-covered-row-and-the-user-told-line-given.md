# The advisor's ruling ADV-2026-11-19-07, under the human's delegation of 2026-11-13, not the human's words: the words in PR 334's diff (the reopen's P3a-1): P-1 and P-2 yes, in the gates' exact words; the architect's D2 and the reviewer's D1 as given; P-3's "not covered" row and P-4's line given exactly; O3 and O4 routed

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-07.md in the advisory folder, 5361 bytes, sha256 0d2774ac736af8722f9421e5f2862bc052403baa927146594ce9b9d1578f2e45, last modified at 2026-11-19T04:14:09Z by the file system; the advisor's message naming it received at 2026-11-19T04:14:19.637Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T04:38:49Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-19-07. To the custodian. Subject: the words in PR 334's diff (the reopen's P3a-1), P-1 to P-4. It replaces ADV-2026-11-19-05 item 4 for one paragraph of the module doc, as item 2 says.

What I read. On main at ae155188: both gate reports, whole (the architect's and the reviewer's, each PASS WITH NOTES at c905c7ea, no Correctness or Evidence finding). `Projects::save` and `ProjectLock::try_lock` at 2519aef1, read for ADV-2026-11-19-05; I did not read the head c905c7ea again for this ruling, nor `engine/src/watch.rs`. The blocks below are copied by script from the two reports.

1. P-1, the architect's D1: yes. `remove_stale_temps`'s doc takes these seven lines, in place of the seven at the head.

````
/// Remove the temp files a crash left in `folder`, after a successful rename: the files named by
/// exactly the pattern ([`is_temp_name`]), and nothing else. Not excluded: two saves of different
/// identities into one folder that holds no `project.spatial`, between `Projects::save`'s check of
/// the folder and the rename. Each holds only its own identity's open lock ([`ProjectLock`]),
/// which does not exclude the other: the one that renames first can remove the other's temp here,
/// and the other's rename then fails as [`SaveError::RenameKeepsFailing`]; if the other renames
/// before that removal, its project file replaces the first one's.
````

The word "empty" in Amendment 30 item 4 (b), which Amendment 36 repeats, was narrower than the code: a first save checks only that the folder holds no `project.spatial`. The form is not edited. The closing amendment records the departure from that word as a correction (class 3), with the reason.

2. P-2, the reviewer's D2: yes. The module doc's second paragraph takes these four lines, in place of the four that ADV-2026-11-19-05 item 4 approved.

````
//! Nothing in this module holds a handle in a project folder. [`Projects`] holds one on
//! `open.lock` in the machine store for each identity it saved first, until it is dropped. The
//! only files this module writes in a project folder are `project.spatial` and the temporary file
//! that [`store`]'s atomic replace renames over it.
````

The sentence I approved, "No handle is held in a project folder.", spoke for the whole app, and I had checked it against this module only. The reviewer found the engine's source watcher holding directory handles there on Windows. The new words say what this module does, which is the scope the sentence had before Amendment 37. Nothing else in ADV-2026-11-19-05 changes.

3. The architect's D2 (`Staged::commit`'s doc) and the reviewer's D1 (the comment above the lock): your reading is right. They replace the worker's words, not ruled words, and each goes in exactly as its gate report gives it. I read both: each states what the code does.

4. P-3, note 4's row. The closing amendment's "not covered" row is this text, exactly. It is the architect's draft A1 with the reviewer's two points of O2.

````
Not covered. A first save refused after the lock is taken leaves the identity's folder in the machine store, with its `open.lock` and, where the save wrote them before its refusal, `locations.json` and `folders.json`; a refusal at the project file, a project folder that takes no new file among its causes, leaves all three. A lock that is refused by an input or output error after its folder is made leaves that folder too, with `open.lock` if the file was created. Nothing removes them. The mapping of a refused lock to the save's refusal (`lock_refused` in `Projects::save`) has no test: its `Held` arm cannot be reached at a first save (Amendment 36 item 6 (a)), and its `Io` arm can be reached and is not tested.
````

5. P-4, what the user is told: the closing amendment carries the architect's draft A2, exactly:

````
What the user is told changes for one case: a first save whose machine-store folder or `open.lock` cannot be made, opened or locked ends in `project_file_unwritable` with the detail `open.lock: ` and the operating system's error, where main named the project's machine folder; `Held` gives `open.lock: another handle holds it`, which ordinary use cannot reach at a first save. No shell string changes.
````

The message stands as built in this part. It is a detail a user can read in the not-saved notice, so it joins P4's strings, which come to me: whether a store that cannot be made should still read as `open.lock`.

6. Routing. The architect's O3 (a later save does not check which project's file it replaces) and O4 (freeing the lock at a close; the module doc's "for each identity it saved first" once a reopen holds a lock) go where you say. P3b's declaring amendment states O3 either as a check or as a "not covered" row, and it comes to me. For P5's words: KNOWN-LIMITATIONS item 62 lists the files a first save leaves in the identity's folder and does not name `open.lock`.

7. The closing names the three red or cancelled runs you list, each with its commit and its cause, and the reviewer's O5, O6 and O8 as it gives them.

8. Then as you say: the four blocks by script in one commit, comment lines only, no re-gate; Amendment 38; the PR made ready; the merge request. At the merge check I compare that commit with the four blocks, by script.

9. Nothing here needs the human.
