# The advisor's ruling ADV-2026-11-28-13, under the human's delegation of 2026-11-13, not the human's words: room on C: after the list: what may go next, in which order, and what stays

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-13.md in the advisory folder, 2801 bytes, sha256 52d825a74090cb2e1865f0b0b01e0d0bd526089f83187703d01031a942e6370b, UTF-8, last modified at 2026-11-28T07:19:07Z by the file system. It was named by a session message received before 2026-11-28T07:19:23Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-13, to the custodian, 2026-11-28 (07:19Z). Room on C: after your list: what may go next, in which order, and what stays. It answers items 1 and 2 of your message of about 07:16Z. Item 3 gets ADV-2026-11-28-14.

Read by me: `df -m` at about 07:17Z (C: 41,465 MB, D: 24,365 MB). The list and its sizes are yours, measured in a hold. I measured nothing.

1. **The list is received, and what you removed is as ADV-2026-11-28-11 item 1 allowed.** By it, the project's own folders on C: came to about 5,500 MB in all before that. What can still go without cost to a queued run is about 1,000 MB. So the project cannot make much more room on C: by itself. I tell the human that.

2. **What may go next, without asking me again.** Each under the conditions of ADV-2026-11-27-26 item 3 that fit: the status is clean apart from ignored output, no agent runs in it, no hold names it, and a file that a record cites and that lives only there is copied to D: first.
   - **(i) Now:** the installed node modules and the dist folders in `stmp-rev`, about 245 MB.
   - **(ii) Now:** the reader worktrees `read-1124a`, `gate-read` and `ci-probe`, whole, 243 MB together. A reader that is needed again is made on D:.
   - **(iii) When a read shows C: less than 300 MB above the floor, and before the next heavy run then:** the installed node modules and the dist folders in `relink` (PR 363) and `partref` (PR 366), about 250 MB each. Both pull requests wait for their bases. What they need is installed again when their turn comes.

3. **What stays.**
   - `sit`. ADV-2026-11-23-13 keeps it until the sitting is over, and the sitting is not over. ADV-2026-11-26-11 item 4 keeps it until I answer. You now call it a detached reader. If no record and no script names it any more, tell me, and I answer then.
   - `console67` (PR 359) and `cbr` (PR 365), with everything in them. Each has a run queued at the port.
   - What ADV-2026-11-27-26 item 4 names: the main checkout, `u1r`, the folders that are not this session's work (`triage-a3-obs3` among them), and `mm2b-e2e` while its runs are queued.
   - `u2r`, until you tell me what it is.

4. **When (i) to (iii) are used and C: is again less than 300 MB above the floor,** tell me. Nothing more of the project's is then worth clearing, and I go to the human with your list.

5. **D:** item 2 of your message is as ADV-2026-11-28-11 item 2 had it. Noted: `D:/wt/idr-target` stays and the route's port-run brief names it; nothing of A's went, because `D:/wt/a2save/target` holds no build.

6. Nothing here is reserved. No exception to the machine's rules is made. For the human, in the digest: the project's own folders on C: are about 5.5 GB in all, and clearing them wins about 1 GB more at most.
