# The advisor's ruling ADV-2026-11-19-28, under the human's delegation of 2026-11-13, not the human's words: P3b-1's stop 4 rightly taken, K-O4's mutation moved to K-O26, close_dataset's release off the main thread, the doc words, the ceilings restated

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-28.md in the advisory folder, 6226 bytes, sha256 5b918e69d068c9199b70da002ba6912151fd7f153c62e9922b7ea3c34b6f469a, last modified at 2026-11-19T17:05:27Z by the file system; the advisor's message naming it received at 2026-11-19T17:05:36.564Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T17:08:01Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-28, to the custodian, 2026-11-19. P3b-1's second stop (stop 4, K-O4's mutation), its class 8 overrun, the three things its worker noticed and its new "not covered" arm. On the worker's report filed at 4a410f0f (`state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-worker-stop-report-2.md`), read whole. Read by me at the branch head 4bffa2b7: the whole product diff against 99cceff7; K-O4, K-O26 and the helper `projects` in `kernel/tests/project_reopen.rs`; the doc of `ProjectLock` in `kernel/src/project/store.rs`; the module doc and the `save_project` binding in `frontends/shell/src-tauri/src/commands.rs`. I ran nothing. The amendment that carries this is yours, from these items, on main before the worker continues.

1. **Stop 4 was rightly taken.** K-O4 makes each second open through a new `Projects`, so `release_ended` there runs on an empty list. No change to `release_ended` can turn K-O4 red. The row came from the draft I ruled in ADV-2026-11-19-23 and I did not catch it.
   - (a) K-O4's row loses the mutation. K-O4 stays unedited and keeps the two recorded mutations it merged with.
   - (b) The mutation moves to K-O26, as its second recorded mutation: `release_ended` drops every entry. K-O26's control reopens the folder through the same `Projects` that holds the lock, while the open is live. Predicted: that reopen replies `opened`, and the test fails at the assertion named "the control".
   - (c) The worker adds the second recorded mutation to K-O26's doc comment, runs it once, restores the file and reports the assertion it failed at. If K-O26 stays green, that is stop 4 again and comes to me.
   - (d) This mutation matters more than the others of the part: it is the only one that shows the lock is kept while the open is live.

2. **The main thread (the worker's third point, c).** The worker is right, and it is ruled before the gates. `close_dataset` is a sync command, and `release_ended` can wait on the `saved` mutex for a save in flight. The `save_project` binding's own doc says no UI thread may wait on that IO.
   - (a) `close_dataset` does not call `release_ended` itself. After the host's close it hands the call to another thread with `std::thread::spawn`, which `lib.rs` already uses for its session-end emitter thread, and does not wait for it. No runtime is involved, so the call is valid from a sync command.
   - (b) What follows, named in `close_dataset`'s doc in the worker's words: when `close_dataset` replies, the lock can still be held for as long as a save in flight takes. A reopen in this process is not affected, because `open_project` runs `release_ended` itself before it takes a lock. A reopen from another process inside that time is refused as already open.
   - (c) The kernel tests are not changed by this: they call `release_ended` directly.
   - (d) Not covered in this part, by name: the binding's hand-off. No test of this part reaches `close_dataset`. P4's suites are the first to run it.
   - (e) For P3b-2, noted now: `open_project` can wait on the same mutex, so its binding runs it off the main thread, as `save_project`'s does.
   - (f) Both gates read (a) and (b), and say whether anything relies on the lock being free when `close_dataset` replies.

3. **Doc words.** Each replaces or joins text on the branch; the worker wraps lines at the file's width and changes no other word.
   - (a) The form's D4 sentence in the `save_project` binding's doc becomes:

````
`close_dataset` frees the open's project lock: after the host has closed the dataset, it has [`Projects::release_ended`] run on another thread and does not wait for it.
````

   - (b) The worker's first point. `kernel/src/project/store.rs` joins P3b-1's files for one sentence of `ProjectLock`'s doc, comment lines only. The sentence named P3b ahead of it, and this part makes it untrue. Old, then New:

````
and the binding's lock state, dropped at `close_dataset` and by the session-end forwarder (P3b).
````

````
and `Projects::release_ended` (P3b-1), which drops the lock of an open that is closed or whose session has ended; the binding has it run after the host's close of a dataset, and `open_project` calls it before it takes a lock.
````

   - (c) The worker's second point. In the module doc of `commands.rs`, directly after the word `serialize` in the sentence that begins "**This file contains no logic**", this is inserted, with one space before it:

````
(`close_dataset` alone starts a second call, [`Projects::release_ended`], after the host's close)
````

   - (d) The worker's own doc of `release_ended` and of `close_dataset` are brought in line with item 2 in the worker's words. Both gates read them.

4. **Not covered, added to item 13 by name:** the arm `SaveFailure::Open(e) => e` of `skp_error_of`. The command's own checks refuse first, so reaching the arm needs a release between those checks and the mutex, inside one call. It is one pass-through line. My sentence in ADV-2026-11-19-24 item 3 (a), carried into Amendment 44 item 3 (a), said the seam's tests are K-O28 and K-O26's added assertion. That was wrong for the consumer: K-O28 reaches the producer, and neither reaches the arm. The table row says so.

5. **Recorded, no action:**
   - class 2: K-O17 (b) failed at its base on missing symbols, where item 7 (b) predicted an assertion;
   - class 1: K-O17 (b) reuses K-O17's child through a helper; one extra test commit corrects the worker's own type error;
   - the two clippy warnings in `commands.rs` are outside the part's hunks and stay.

6. **The ceilings, class 8, restated for items 1 to 3**, in both numstat columns: kernel product 95, kernel tests 240, src-tauri 25; 360 in all. The overrun of 229 on 220 is accepted as counted. Nothing is cut or packed to fit.

7. **How it continues.** The same worker-high, or a new one on the strongest model with this ruling and the report, on the same branch. Its commits are pushed together, under ADV-2026-11-19-10. It reruns the part's focused tests, clippy and fmt at its head, and K-O26's two mutations. Then the pull request and both gates, whose first question stays the lock order.

8. Nothing here is reserved.
