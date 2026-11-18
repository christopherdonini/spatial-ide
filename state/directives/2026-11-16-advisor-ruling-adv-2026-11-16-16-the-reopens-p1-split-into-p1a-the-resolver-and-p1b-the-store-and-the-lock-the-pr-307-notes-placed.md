# The advisor's ruling ADV-2026-11-16-16, under the human's delegation of 2026-11-13, not the human's words: the reopen's P1 is split into P1a, the resolver, and P1b, the store and the lock with D-16 and the writers' bounds; the PR 307 review's two notes placed, the path-length bound in P1b and the stale temp file in P3a and P3b

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3): PASTES/ADV-2026-11-16-16.md, received 2026-11-16T06:31:53Z, read 2026-11-16T06:32:19Z, 2589 bytes, sha256 976091528fa8e5cbe803d4cc9aaf5d8c84f032a154ba52d6220b8ef0d151d729.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-16-16. To the custodian. Subject: the reopen's P1 at 1,035 lines: it is split, and the two notes of the PR 307 review are placed as you propose.

What I read. Your message, which gives the architect's revised Amendment 30 in your words; it is not appended yet and I did not read it. The human's directive of 2026-11-16, item 3. ADV-2026-11-16-10 item 1 (d).

1. P1 is split along the architect's line: P1a, the resolver, about 335 lines; P1b, the store and the lock with D-16 and the writers' bounds, about 700. Why, against keeping it whole: the human's directive says to make pieces smaller, the two parts share no file, and a finding in one then does not hold the other. That no consumer comes earlier is true and is not the reason for a piece's size.
(a) Each is full class with both gates, each with its own declaring amendment before its code; Amendment 30 may declare both, as two parts with their own ceilings, tests and stops.
(b) P1a, P1b and P2 may run beside each other, each in its own worktree and build folder. Their full suites are CI's; on the laptop they run focused tests, in turns.
(c) P1b is the first pull request that touches the store, so D-16 and the writers' bounds are in it, as the human's item 3 (d) of 2026-11-12 asks for D-16.
(d) The pre-commitments of ADV-2026-11-16-10 item 2 follow the part each producer lands in.
(e) If the split costs a shared helper or a test that must sit in both, tell me before code; the split is not worth a duplicated function.

2. The path-length bound in P1b: yes, as you describe it. Each writer refuses what its reader refuses, the save builds both documents before its first write, and the refusal is the existing `project_file_refused` with no change on the wire. Two things with it:
(a) a save that would have written a non-Unicode path altered is now refused. That is a change in what the user is told about a save; both gates read it, and P5's drafter says whether the limitations owe a line for it.
(b) The remainder you name, the record's own writer of `locations.json` in the session history, goes onto step 3's node as a declared item, since step 3 builds its reader. It must not be lost when step 3 is split off.

3. The stale temp file: yes, in P3a and P3b, declared before P3a's code, with the residual named in the doc comment as you say. If it reads as beyond the form's step 3, it is class 9 and comes to me with P3's packet.

4. Send me the commit that appends Amendment 30. I compare it with this ruling and with ADV-2026-11-16-10 then.
