# The advisor's ruling ADV-2026-11-19-24, under the human's delegation of 2026-11-13, not the human's words: P3b-1's stop at P-2, rightly taken; option (a), the checks under the saved mutex; K-O28; P3b-1's ceilings restated

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-24.md in the advisory folder, 3424 bytes, sha256 0179bd93fb7876897f4adfab1ba3d5352babce4373ba42d82fda4c0f9590b416, last modified at 2026-11-19T14:45:04Z by the file system; the advisor's message naming it received at 2026-11-19T14:45:13.745Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T14:49:21Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-24, to the custodian, 2026-11-19. P3b-1's stop at item 20's P-2 read (the 1c form's Amendment 43). Ruled from your message; the worker's report is not yet on main, and I compare it at the filing check. Read by me on main at c945a309: `Projects::save` and `Projects::save_project` in `kernel/src/project/mod.rs`. I ran nothing.

1. **It is P-2's stop, and it was right to take it.** The read was to stop if a save of a released open can reach the first-save path. By my read of the code the worker is right: the command checks the catalog and the live session before `Projects::save` takes the `saved` mutex, and `Projects::save` decides "first" by finding no entry. A release between the two sends the save down the first-save branch. That window does not exist on main, which never drops an entry; item 6 would have made it.

2. **(a).** Under the `saved` mutex, before "first" is decided, `Projects::save` checks that the catalog still holds the open and that its session is live. A save and `release_ended` then run one after the other. A release before the save gets the save refused as the command would refuse it. A release after it waits for the save. What is left is the window item 6 already names.

3. **How it is built.** The amendment is yours, from these items, class 9, on main before the code.
   - (a) The refusal carries the host's own error, unchanged, so the wire gives the same code and message as the command's own checks give. It needs one new variant on `SaveFailure`, which is a `pub` type: declared here, working name `SaveFailure::Open`, as `OpenFailure::Open` is. `skp_error_of` passes it through. Item 12's table gains it: its consumer is `skp_error_of` in `save_project`, and its seam's tests are item 4's row and K-O26's added assertion.
   - (b) The command's own checks before the mutex stay. Nothing is removed.
   - (c) The lock order is stated in a comment where the mutex is taken: the `saved` mutex first, then the host's catalog and generations. `release_ended` takes them in the same order. Before code the worker lists, by search, every place that takes the `saved` mutex and what it holds at that moment. A place that takes them in the other order is a stop and comes to me.
   - (d) The doc of `Projects::save` gains one sentence for the check, in the worker's words. Both gates read it.

4. **The test, one new row, K-O28, named by the worker**, in `kernel/tests/project_save.rs` or `kernel/tests/project_reopen.rs`. Two cases, each calling `Projects::save` directly after `release_ended`, with an empty folder given: an open that was closed, and an open whose session ended. Each is refused with the host's refusal for it; the machine store's listing is unchanged; the folder holds no `project.spatial`.
   - Its mutation: the two checks under the mutex removed. Predicted: each case saves as a first save, and the test fails at its refusal assertion.
   - K-O26's added assertion of item 20 stays, through the command.

5. **The ceilings for P3b-1, restated before the code:** kernel product 85, kernel tests 220, src-tauri 15; 320 in all. Item 20's rows for P3b-1 are superseded by these. P3b-2's stand.

6. **No architect read first.** The change is small, the two places are taken, and both gates read the lock order at the head. That is their first question in P3b-1's brief.

7. Nothing here is reserved.
