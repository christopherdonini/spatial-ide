# The advisor's ruling ADV-2026-11-19-30, under the human's delegation of 2026-11-13, not the human's words: PR 339's notes N1 and N3, two sentences made exact in P3b-2, and the architect's N-4 carried to P4's form

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-30.md in the advisory folder, 3555 bytes, sha256 a9391e57002285e3b4a415f6466a21aaad99451510597a75a0b83ce4a2440869, last modified at 2026-11-19T19:25:38Z by the file system; the advisor's message naming it received at 2026-11-19T19:26:43.659Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T19:52:52Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-30, to the custodian, 2026-11-19. PR 339 at 4b8d6702: the two notes the reviewer's second attempt sends to me (N1, N3), and one note of the architect's first attempt for P4's form. On the three gate reports, read whole on main at 068027cc. Read by me at the head for this: `close_dataset` and its doc in `frontends/shell/src-tauri/src/commands.rs`; `release_ended`, its doc and its two callers in `kernel/src/project/mod.rs`; the first lines of `main.rs`; part of the doc of `refuse_to_start` in `lib.rs`. I ran nothing.

1. **PR 339 merges as it stands.** The reviewer finds no clause untrue, and neither note asks for a change before the merge. My verdict goes with this ruling.

2. **N3 is right, and the sentence was mine** (ADV-2026-11-19-29 item 5 (d)). "Until this call has run" is exact only when no other call of the function runs first. Another close's thread can run first today, and a reopen's call can once P3b-2 binds `open_project`. The reviewer calls each case timing inside one round trip, or a later part. So it is corrected in P3b-2, which changes this file, and not by one more commit here. In `release_ended`'s doc, Old, then New:

````
After `close_dataset` has replied, the lock is therefore still held until this call has run, and it waits for whatever holds that mutex: a save, a reopen as it keeps its entry, or another call of this function.
````

````
After `close_dataset` has replied, the lock can therefore still be held until a call of this function that began after the host's close has run: the one `close_dataset` started, or another close's or a reopen's if that comes first. Each call waits for whatever holds that mutex: a save, a reopen as it keeps its entry, or another call of this function.
````

3. **N1 is right.** The words "the error is logged" do not say where. In `close_dataset`'s doc, also in P3b-2, Old, then New:

````
If the thread cannot be started, the error is logged and nothing is freed then:
````

````
If the thread cannot be started, the error is written to standard error alone, not to the session log, and a release build on Windows has no console to show it; nothing is freed then:
````

4. **How items 2 and 3 land.** P3b-2's declaring amendment, or its next one, names both pairs by reference, class 9, comment lines only. The worker applies them by script from this file, wraps lines at the file's width and changes no other word. They count inside P3b-2's ceilings; an overrun is reported as counted. P3b-2's two gates read each clause against the code at their head, and an untrue clause comes to me. If P3b-2 changes the code either sentence describes, the sentence comes back to me before the gates.

5. **For P4's form, carried by you with the other notes:** the second point of the architect's note N-4 in its first attempt. By that note, the shell opens the new handle before it closes the old one. So a reopen, in the same window, of the project that is open there is refused as already open: `open_project` keeps the live open's entry and its lock. K-O26's control shows that refusal in the kernel. P4's form says which it wants: that order kept and the refusal's words shown, or the close first. Amendment 47 item 10 does not list it.

6. **No change for the other notes** of the three reports: the architect's N-1, N-2 and N-5, and the second attempt's N2 and N4. N2's case needs the operating system to refuse a thread and the write to standard error to fail in the same call.

7. Nothing here is reserved.
