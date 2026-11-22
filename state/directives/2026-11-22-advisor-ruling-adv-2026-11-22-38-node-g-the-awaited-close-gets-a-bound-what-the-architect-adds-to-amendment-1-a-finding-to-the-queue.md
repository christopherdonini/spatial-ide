# The advisor's ruling ADV-2026-11-22-38, under the human's delegation of 2026-11-13, not the human's words: node (g): the awaited close gets a bound; what the architect adds to Amendment 1; the kernel's unbounded waits to the queue as a finding

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-38.md in the advisory folder, 3215 bytes, sha256 781f9377f57fefa17b0a9f619a8fe6112bbc1f4fdfbb5692a05d35a4f19d331e, last modified at 2026-11-22T19:56:57Z by the file system; the advisor's message naming it received at 2026-11-22T19:57:07.252Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T20:17:26Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-38, to the custodian, 2026-11-22. Node (g), the describe-failure close: the awaited close gets a bound. This follows ADV-2026-11-22-35 item 4. The architect's reading is by your message, summarised; its report is not on main yet. I rule what the piece must mean and leave how it is built to the architect and the gate.

1. **Why a bound, on "not determined".** By the reading, nothing ends the wait for the close, two of its waits have no bound in this code, and during such a wait the panel keeps "Opening…" with no end, Cancel does not end it and a new open starts nothing. Today, in the same case, the user is shown the refusal of `describe` and the lock stays held. So in that one case the piece as drafted would leave the user worse off than today: told nothing, where today they are told why. A fix does not make any case worse for the user than the fault it fixes. Whether ordinary use can meet the case is not known, and I do not rest the piece on a guess that it cannot.

2. **What the piece must mean.**
   - After `describe` fails, the close is sent first, as drafted.
   - The same error is then thrown again when the close settles, or when a declared time has passed since the close was sent, whichever comes first.
   - After that time the close is left running. Its reply and its rejection are still dropped.
   - Nothing else changes: no new string, no log line, no retry of the close.

3. **What the architect adds to Amendment 1**, in place of the three additions as drafted where they differ:
   - the bound's value, declared at one site with its reason. It is a wait for a real completion signal with a deadline, not a sleep;
   - the changed sentences of sections 1 and 2: that the refusal is shown no later than the bound after the close is sent; and under "May not claim", that the lock is freed when the close has not settled by then, and that a retry then finds it free;
   - one test more: with a close that never settles, the same error object is thrown once the bound has passed, on a clock the test controls; with its mutation;
   - that the tests of the order (the close sent before the error is thrown) hold as drafted;
   - the watchdog note, as the gate gave it;
   - the two unbounded waits and the fact about the host's main thread, each marked as read or as taken from documentation, as the reading has them.

4. **The budget.** If the bound takes the piece over its declared lines, the architect declares the new ceiling in Amendment 1 with the count, as a scope addition on this ruling (class 9), before any code.

5. **The order stands:** Amendment 1 by script, with E-1, E-2, D-1 to D-4 and item 3 above; attempt 2 on it alone when a place on the strongest model is free; no code before PASS or PASS WITH NOTES.

6. **Outside this piece, to the queue as a finding by reading, minor until shown otherwise:** every close already goes through a binding that, by documentation not read here, runs on the host's main thread, and the kernel's close has two waits this code does not bound. No one has seen it stall. It is recorded so that it is not lost; I place it after the tag.

7. Nothing here is reserved.
