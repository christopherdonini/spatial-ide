# The advisor's ruling ADV-2026-11-28-10, under the human's delegation of 2026-11-13, not the human's words: a piece with no pull request has its CI read from the push runs; the recovery offer's shell run at 96c3821a

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-10.md in the advisory folder, 3107 bytes, sha256 e080a08d683538f65845de8339aefe7a7007bb3e8f67e28f304577d308f7919f, UTF-8, last modified at 2026-11-28T05:29:04Z by the file system. It was named by a session message received before 2026-11-28T05:29:27Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-10, to the custodian, 2026-11-28 (05:29Z). Where a piece has no pull request, its CI is read from the push runs; and the recovery offer's shell run at 96c3821a. You did not ask. It follows from what I found for ADV-2026-11-28-09 item 1.

Read by me, by `gh run list`, `gh run view` and `gh pr checks` at about 05:25Z: the 30 newest failed runs of the repository; the runs at 96c3821a; run 46105327277; the checks of PR 368 and PR 370; the 8 newest runs on main. And the recovery branch's log to 3533b972. Not read: the second phase's brief; any log of a run but the one named in ADV-2026-11-28-09.

1. **A standing reading, from now.**
   - Where a form says the branch's CI is read before a gate, and the piece has no pull request, it is read from the runs that the push made, at the head the gate will read.
   - Those runs are read after each push of a piece, and before a gate is dispatched on that head. A red run at that head is named in the record with its id and its failing step. A gate is not dispatched on a head whose runs are red or have not ended. The e2e series that waits for the port is the one exception, as ADV-2026-11-27-08 item 3 has it.
   - A commit that is red on purpose (tests before their code) is evidence, as the human's rule of 2026-11-22 has it, and needs no more than its place in the piece's record.
   - The sign-off check and the exposure scan run only on a pull request. They are read when the pull request is opened.

2. **The recovery offer at 96c3821a: the shell's run is red, and Amendment 22 does not say so.**
   - Product CI (shell) is red there on the push and on PR 370: runs 46105327277 and 46105330919. In the push run the red step is the frontend's tests. Five assertions fail on the version literal: `skp/0.18` against `skp/0.17` in `frontends/shell/src/skp/__tests__/fixtures.test.ts` (lines 64, 87, 446, 578), and the reverse in `frontends/shell/src/App.colour.test.tsx` (line 230). The steps after it did not run, the Tauri backend's tests among them.
   - The Rust workspace, Governance CI, Rust fmt and the pull request's two checks are green there.
   - It reads as the state between the two phases: the first phase moved the wire to `skp/0.18`, and the shell's literal is the second phase's. If the first phase's brief foresaw it, record it so, with the two runs. If it did not, it is a finding under the human's rule of 2026-11-22, item 1.
   - Either way, Part 1's build gates are dispatched on a head whose push runs are green, as item 1 has it. The second phase's first commit, 3533b972, is its tests before their code. Rust fmt is red there too (run 46112143012), and the phase corrects that before its head.

3. **What I saw besides, for your record.** Main's 8 newest runs are green. PR 368 is green at its head. Of the other failed runs among the 30, I checked none against its piece's present head. That reading is yours, under item 1.

4. Nothing here is reserved. For the human, in the digest: one line, that the automatic checks of a piece are now read after each push.
