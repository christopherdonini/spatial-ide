# The advisor's ruling ADV-2026-11-19-29, under the human's delegation of 2026-11-13, not the human's words: PR 339's gate findings, D-1 to D-3 right, the thread's start by a builder, four doc texts, the ceilings restated, E-SAVE repeated

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-29.md in the advisory folder, 6175 bytes, sha256 91c23317a69e28e724a805ea903f02faec017ba51945b00fe4b75d8143bd5737, last modified at 2026-11-19T18:00:21Z by the file system; the advisor's message naming it received at 2026-11-19T18:00:31.177Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T18:21:22Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-29, to the custodian, 2026-11-19. PR 339 (the reopen's P3b-1) at 70335c37: the clauses both gates found untrue, the thread's start, the overrun and the E-SAVE run. By your message, which copies the gates' sections; the two reports were not yet on main when I ruled, and I read them whole at the merge check. Checked by me at the head for this: `close_dataset`, its doc and the module doc in `frontends/shell/src-tauri/src/commands.rs`; `release_ended` and its doc, and the command `save_project`'s checks, in `kernel/src/project/mod.rs`; `record_step`'s checks in `kernel/src/session_history.rs`; the emitter thread's log line in `lib.rs`; the lines the gates cite in `App.tsx`, `e2e/selection.mjs` and `e2e/project.mjs`. I ran nothing.

1. **The gates are right on D-1, D-2 and D-3, and all three sentences were mine**, in ADV-2026-11-19-28. I wrote each without a search that would have shown it false.

2. **D-1 (the reviewer's D2).** Corrected in the closing amendment by reference, class 3; Amendment 46 stays unedited. What holds: the shell closes a replaced handle through the shipped binding, and `e2e/project.mjs` and `e2e/selection.mjs` already run `close_dataset`, so they run the hand-off. None asserts its effect. P4's E-SECOND and E-CRASH-UNLOCK are the first to assert it.

3. **D-2.** Corrected the same way, class 3. What holds: the arm `SaveFailure::Open(e) => e` is reached when the open is closed, or its session ends, between the command's own checks and the check under the `saved` mutex. No release is needed. That time is not always short: a save that waits for the mutex waits as long as its holder's IO. The arm passes the host's own error through, and no test reaches it.

4. **The thread's start (N-3 and N1): changed in this part.** The code was mine and both gates name the same fault and the same remedy.
   - (a) `close_dataset` starts the thread with `std::thread::Builder::new().spawn(..)`, which returns an error where `std::thread::spawn` panics. On an error the command logs the error alone, as the emitter thread in `lib.rs` logs its own, and goes on: the close's result is unchanged, and the lock is freed by a later close or reopen in this process.
   - (b) The log line, the error after it:

````
[spatial-ide-shell] the project lock's release thread did not start: {e}
````

   - (c) Not covered, by name: the error branch. It needs the operating system to refuse a thread.

5. **Doc words**, replacing text on the branch. The worker wraps lines at the file's width and changes no other word.
   - (a) D-3. In the module doc of `commands.rs`, the parenthesis after `serialize` becomes:

````
(`close_dataset` also starts [`Projects::release_ended`], after the host's close)
````

   The sentence it sits in was already untrue on main for the `binding_publish_*` commands, as the architect notes. That is not this part's: you list it with the noticed sentences for a later docs correction.
   - (b) D-5 and N2. In `close_dataset`'s doc, the paragraph that begins "After the host's close" becomes:

````
After the host's close, whatever its result, and when there is a [`Projects`] (see `save_project` below), this command hands [`Projects::release_ended`] to a thread of its own and does not wait for it. That call frees the project lock of each open that the catalog no longer holds or whose session has ended. It may first wait for a save in flight, or for anything else that holds the same mutex in [`Projects`]. So when this command replies, the lock can still be held, until that thread has run the call. If the thread cannot be started, the error is logged and nothing is freed then: the lock is freed by a later close or reopen in this process. A reopen in this process is not affected, since `open_project` runs `release_ended` itself before it takes a lock; a reopen from another process in that time is refused as already open.
````

   - (c) The D4 sentence in the `save_project` binding's doc becomes:

````
`close_dataset` frees the open's project lock: after the host has closed the dataset, it hands [`Projects::release_ended`] to another thread and does not wait for it; `close_dataset`'s own doc has the cases.
````

   - (d) D-4 and N2. In `release_ended`'s doc, the text from "so a save in progress ends" to the doc's end becomes:

````
so a save in progress ends before its entry is dropped. After `close_dataset` has replied, the lock is therefore still held until this call has run, and it waits for whatever holds that mutex: a save, a reopen as it keeps its entry, or another call of this function. A `record_step` that passed its checks before the open was closed or its session ended can still write after this frees the lock, and after another process has taken it.
````

6. **The overrun.** src-tauri at 27 on 25 is accepted as counted, class 8. For items 4 and 5 the ceilings are restated, in both numstat columns: kernel product 100, kernel tests 240, src-tauri 40; 380 in all. Nothing is cut or packed to fit.

7. **The E-SAVE run is repeated at the new head**, because item 4 changes code. The kernel's runs stand if git shows that every line under `kernel/` changed after them is a comment line. At the new head: src-tauri's tests, clippy and fmt.

8. **How it closes.**
   - Your amendment, from these items, on main before the worker's commit.
   - A worker on the standard model: item 4's change, and item 5's four texts by script, byte for byte.
   - The reviewer alone reads the changed lines in a short second attempt: item 4's code, and each clause of item 5's texts against the code. The architect is not asked again: both gates named this change, and the lock order is untouched. An untrue clause comes to me.
   - Then the merge request, with the two reports of the first attempt, the second attempt's, and E-SAVE's result at the head.

9. **For P3b-2's form, noted:** `open_project`'s binding off the main thread (ADV-2026-11-19-28 item 2 (e)); the two gates' notes you carry.

10. Nothing here is reserved. The human is told in the digest that the reviewer alone re-reads this change, and that it is theirs to overturn.
