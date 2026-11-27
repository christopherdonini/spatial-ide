# The advisor's ruling ADV-2026-11-26-24, under the human's delegation of 2026-11-13, not the human's words: B's form, OPEN-6: (b), the piece's code and unit tests may start inside holds in its turn, before E-1's red run at the base, under five conditions with the red commit first; ADV-2026-11-26-08 item 1's S0 (a) changed in time only; the same for any piece whose S0 needs an app start while the human's app holds the port

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-24.md in the advisory folder, 2276 bytes, sha256 3d6d996af3fc4de6930901119e88e60449dbdcbfc47dcbd11f674b4aa11e1c0e, UTF-8. It was named by a session message received before 2026-11-26T21:05:26Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-24, to the custodian, 2026-11-26 (21:05Z). B's OPEN-6: whether the piece's code and unit tests may start before E-1's red run at the base. Ruled from your message; the gate's report and the applied pairs are not on main and I have not read them. This changes ADV-2026-11-26-08 item 1's S0 (a) in time only.

1. **(b): the code and the unit tests may start now, inside holds, in the piece's turn.** The fault is confirmed in the code, the human met it, and the port waits on the human. Holding a worker for it would leave a place free for a reason the work does not need.

2. **What keeps the red run honest:**
   - **The red commit comes first.** The first commit on the branch after the base holds E-1's step and nothing of the fix. Product code starts in the commit after it.
   - **The base run is made at that commit,** as soon as the port is free. It must end red for the row's own reason: the reopen after the reload answers `skp.project_open_elsewhere`.
   - **If it ends green, or red for another reason, the piece stops and comes to me.** The code written by then is not taken further until I rule.
   - **E-1's text does not change after the red commit.** If it must, the change is recorded by its class, and the base run is made on the changed text.
   - **The PR does not leave draft** before the base run and the head series are filed.

3. **The unit tests** keep their own proof as the form has it: each with its mutation, named with its commit.

4. **The order of builds is unchanged** (ADV-2026-11-26-08 item 4, with ADV-2026-11-26-15 and -20): the identity route's code first, and B in its turn. This ruling only takes the port out of what B's code waits for.

5. **The same holds for any piece whose S0 needs an app start while the human's app holds the port,** under the same five conditions. You tell me when you apply it to a piece.

6. **Noted from your message, not ruled:** the gate's posture check finds no change to the security posture; the ceiling goes to 1250 lines before commit; the head series gains six suites. I read the gate's report and the form as amended when they are on main, and anything in them that changes this ruling gets a new id.

7. Nothing here is reserved.
