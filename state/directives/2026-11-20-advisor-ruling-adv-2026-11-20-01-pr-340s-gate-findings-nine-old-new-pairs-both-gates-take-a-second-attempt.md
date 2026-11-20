# The advisor's ruling ADV-2026-11-20-01, under the human's delegation of 2026-11-13, not the human's words: PR 340's gate findings: nine Old and New pairs, E-1 shown, and both gates take a second attempt

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-01.md in the advisory folder, 9995 bytes, sha256 d8c72e8f7821058ce7f10825f5ed006b6e98d792b13168d720f1ad2e47c4e708, last modified at 2026-11-20T01:04:14Z by the file system; the advisor's message naming it received at 2026-11-20T01:04:23.211Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T01:21:53Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-01, to the custodian, 2026-11-20. PR 340 (the reopen's P3b-2) at ddd74c349091832ada443e78ae867fa4ad79371b: both gates FAIL, on evidence since shown and on wording. By your message for the gates' findings; neither report is on main yet, and I read both whole before the merge check. Read by me at that head: `Projects::open_project`, `asks`, `is_known`, `data_at` and `open_error_of` in `kernel/src/project/mod.rs`; `with_same`, `moved_to` and `projects_root` in `kernel/src/project/store.rs`; `OpenRegistry::begin`, `begin_open` and the engine arms of `error_of` in `kernel/src/skp.rs`; the docs of `ReopenAnswer` and `ReopenQuestion`; the `skp/0.14` paragraph in `protocol/skp/src/v0/mod.rs`; SKP-V0.md's `skp/0.14` entry and sections 12.2 to 12.4; `project_machine_store_failed` in `error.rs` and the three bindings that send the fixed text; W-7's doc; ADR-036's amendment headings. I ran nothing.

1. **E-1 is shown, and both gates still take a second attempt.** By your message the reviewer saw `key` and `word` each fail alone under the mutation, which is the condition the architect set. But each gate ended FAIL, and the merge check asks that every gate end PASS or PASS WITH NOTES. That check is the human's and I do not loosen it (as ADV-2026-11-19-13 and -15).
   - (a) The architect's second attempt is short: E-1 from the reviewer's filed report; the docs commit against this ruling and against its own D-5 to D-7 and N-3. Nothing else is re-read.
   - (b) The reviewer's second attempt reads the correction's changed lines, as you plan.
   - (c) Each checks every clause of the words below against the code. An untrue clause comes to me, unreworded.

2. **The words.** Nine pairs, Old then New. Each Old text occurs once in its file at ddd74c34, by script, a doc comment's lines joined. The worker wraps comment lines and rewords nothing. Where the reviewer proposed words, mine differ. For the question the reason is this: "cannot be read or checked" leaves out the first folder itself failing to be read, which `asks` also answers with the question.

   **(a) `ReopenAnswer`'s doc**, `protocol/skp/src/v0/commands.rs` (the architect's D-1, the reviewer's C-2). Read by me: `Answer::Copy` mints an identity and writes it into this folder's file; `Answer::Same` calls `with_same`, which keeps the first folder and adds this one.

````
The answer to a `question` reply: the project is open elsewhere on this machine under another folder, and the client says whether this folder is a `copy` of it (a new identity) or the `same` project moved here.
````

````
The answer to a `question` reply (see [`ReopenQuestion`]): the client says whether this folder is a `copy` of the project, which then gets a new identity, or the `same` project, in which case this folder is recorded beside the first.
````

   **(b) `ReopenQuestion`'s doc**, the same file. Read by me: the question is returned only when a `folders.json` exists, this folder is not in it, `asks` holds for its first folder, and the request carries no answer; no lock is looked at before it, and it returns before any write.

````
The project is open elsewhere on this machine under another folder, and nothing was written. The client asks and calls again with an `answer`.
````

````
This folder is not one that this user's machine store records for the project, and the folder it records first still holds a project file of this identity, or one the reader refuses, or cannot be read, it or its project file. Nothing was written. The client asks and calls again with an `answer`.
````

   **(c) The `skp/0.14` paragraph**, `protocol/skp/src/v0/mod.rs` (the architect's D-2, the reviewer's D-1). Read by me: `cancel_key_in_use` is built in one place, `OpenRegistry::begin`, which `open_dataset` and the reopen both reach.

````
The other seven commands are unchanged;
````

````
The other seven commands keep their requests and replies. Of these codes and messages, `save_project` can return `project_file_names_another_project`, `project_machine_record_refused` where it returned `project_file_refused`, and `project_file_refused`'s new message, and `open_dataset` can return `cancel_key_in_use`'s;
````

   **(d) SKP-V0.md section 8, the `skp/0.14` entry's first line.**

````
two changed messages and one changed code; no change to the other seven commands.
````

````
two changed messages and one changed code. The other seven commands keep their requests and replies; of these codes and messages, `save_project` can return `skp.project_file_names_another_project`, the changed code and `skp.project_file_refused`'s new message, and `open_dataset` can return `skp.cancel_key_in_use`'s.
````

   **(e) Section 12.3, the `question` bullet** (the architect's D-3).

````
means the folder is not one the machine remembers for the project and the folder it remembers first still holds the project or cannot be read.
````

````
means the folder is not one the machine remembers for the project, and the folder it remembers first still holds a project file of this identity, or one the reader refuses, or cannot be read, it or its project file.
````

   **(f) Section 12.3, the open's bullet** (the reviewer's C-1). Read by me: the lock is under the root `Projects` is given, and `projects_root` is under the per-user data directory.

````
A project is open once at a time on this machine: a reopen of a project another open holds is refused as `skp.project_open_elsewhere`.
````

````
A project is open once at a time within one user's machine store, where its lock is kept: a reopen of a project whose lock another open holds is refused as `skp.project_open_elsewhere`. The lock does not reach another user's store on the same machine.
````

   **(g) Section 12.3, the last bullet** (the architect's N-3). The architect asks for the source comment alone. The sentence is the contract a client reads, and by N-3 it does not hold for a cancel that lands before a `question` or a `not_found`. So it changes too. Read by me: the four looks in `open_project` before the engine's open, and none between the first and the `question` return.

````
A cancel before the engine's open returned refuses the call as `engine.cancelled`; a cancel after it is not seen, and the reply is `opened`.
````

````
A cancel that the call sees before the engine's open returned refuses it as `engine.cancelled`. The call looks between its steps, so a `question`, a `not_found` or another refusal already decided can still be the reply. A cancel after the engine's open returned is not seen, and the reply is `opened`.
````

   **(h) Section 12.4, the row of `skp.project_machine_store_failed`** (the reviewer's D-2). Read by me: of the three bindings that hold the fixed text, `open_project`'s alone sends it under this code; `record_step`'s and `save_project`'s send it under their own codes, as at the base.

````
this machine's store for the project could not be used; `detail` is a file's fixed name, a colon and the error's text |
````

````
this machine's store for the project could not be used; `detail` is a file's fixed name, a colon and the error's text, or, from the shell's `open_project` binding when no per-user data directory resolves, `no per-user data directory is available` |
````

   **(i) W-7's doc**, `kernel/tests/project_reopen_skp.rs` (the architect's D-4). I say nothing of what APFS allows, since no one here has shown it.

````
its reserved ones, APFS likewise), the file missing:
````

````
its reserved ones; for macOS this rests on CI's run alone), the file missing:
````

3. **N-1: the exception covers the whole error.** An engine refusal through `Open(e)` crosses as the host built it: code, message and fields. My words in ADV-2026-11-19-26 item 1 (e) named the message; the reason given there, that it can repeat bytes of the data file or of the claim the project file recorded and that this part sets no bound, holds for its fields as for its message. Stop 10 was not reached. The closing amendment records this. P4's form bounds what the shell shows and logs from such a refusal, its fields included (with ADV-2026-11-19-26 item 8).

4. **N-2: the date stays 2026-11-19.** ADV-2026-11-19-04 item 4 defined the slot for Amendment 3: the UTC date of the commit that adds it. ADV-2026-11-19-26 item 5 used the same slot. Nothing is set at the merge.

5. **`opened_of`'s four panic sites: the code stays as it is in this part.** Both gates find none reachable with a file the reader accepts. The closing amendment records, as not covered: a later change that adds a word to either set, or a style the reader passes that is not canonical, would panic after the reopen took effect, and by the reviewer's reading only a session's end followed by `release_ended`, or quitting, frees the lock then. You propose a node for it in the next batch, with both gates' shapes, not placed and not on v0.2's list.

6. **The two `allow` lines stay.** ADV-2026-11-19-33 item 3 stands, class 9, with the reviewer's line that both warnings are there at 65c4739a.

7. **The W-7 worker's slip stands as you put it:** a departure, class 1, in the closing, its report not naming it; one copy of case (a) is deleted, a test change, class 9. The reviewer's run for ADV-2026-11-19-35 item 2 skipped both copies, so its result holds.

8. **The rest of the correction is as you list it:** the architect's D-6 and D-7, N-3 in the source comment, U+0085 written as an escape, and the architect's words for `skp.rs`'s two clauses as its report gives them, which I read at the merge check. Two commits. Their lines count in their groups, reported as counted.

9. **Carried.**
   - For P4's form: a client that cancelled can still get a `question` or a `not_found` (pair (g)).
   - For P5's words: two users of one machine each have a store, so each can open the same project at the same time (pair (f)). P5 says whether a limitation item names it.

10. Nothing here is reserved.
