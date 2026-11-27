# The advisor's ruling ADV-2026-11-24-09, under the human's delegation of 2026-11-13, not the human's words: milestone 5 PR A, after ADV-2026-11-24-07: no stop; C-U4's third expect the pin, with one OBSERVED line; X-2 recorded as found, with one READ line; G-1 and G-2 by a new N8 test after the sitting; the late Completed call observed once

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-09.md in the advisory folder, 3865 bytes, sha256 2f742a5263d6553602995e8876b7e735a2ae502e82fbc1365478a1b988776347, last modified at 2026-11-24T04:03:49Z by the file system. The advisor's message naming it was received at 2026-11-24T04:04:33Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-09, to the custodian, 2026-11-24 (04:04Z). The piece `shell-migration-milestone-5`, PR A: what follows ADV-2026-11-24-07. Read by me on main at b5d2d713, both whole: the worker's observations report (`state/consults/2026-11-24-shell-migration-milestone-5-pr-a-adv-2026-11-24-07-observations-worker-report.md`) and the architect's read for item 4 (`state/consults/2026-11-24-shell-migration-milestone-5-pr-a-adv-2026-11-24-07-item-4-the-scan-state-observable-architect.md`). Read at PR A's head 1b38e62c: the condition store's reducer, with `raise`, the `opened` case and `visibleFor`. I read no run log.

1. **Item 3 of ADV-2026-11-24-07 is closed.** The three removals of all three stops failed, and C-U6a failed again at the head. There is no stop.

2. **The pin of `visibleFor`'s generation clause: both of your two.**
   - The closing amendment names C-U4's third expect, the R2 line, as that clause's pin, with the probe's result at 7c816dd4.
   - One dated OBSERVED comment line goes beside C-U4. It is a comment only, class 3. It says that with the clause alone removed C-U4 failed at that expect, and that `App.conditions.test.tsx` and `App.lateResult.test.tsx` passed. It is written from the worker's probe log; no new run is needed.
   - C-U4's recorded mutation stays as it is.
   - My reading of the store: `opened` ends every condition of another generation, and `raise` drops a raise of another generation. The clause is the store's third stop, and a test of the store is the right place for its pin.

3. **Item 5: X-1 and X-2.**
   - X-1 is closed as its line says.
   - X-2: recorded as found, and no assertion is added. The one other write behind X-2's guard is the call that ends the session, and that call's own guard, the same test of the dataset, drops it. So no assertion could fail with X-2's guard alone removed.
   - One READ comment line beside X-2's block says that, class 3.

4. **Item 4, G-1 and G-2: your (b).** The architect's read shows why my item 4 could not work as I wrote it: in the existing test B's scan is idle when A's late calls arrive, and a `failed` event on an idle scan changes nothing.
   - After the sitting, one new N8 test is added to `App.lateResult.test.tsx`, on the baseline arm. In it B's Apply is in flight, with Cancel shown, before A's late failure terminal and A's late canvas refusal arrive. After each of the two calls it asserts that Cancel is still shown.
   - It is class 9, inside the Scope, and its amendment comes first. The amendment names the test and its two mutations.
   - **The runs, each a dated line:** with G-1's guard alone removed, it fails at the assertion after the terminal; with G-2's guard alone removed, it fails at the assertion after the canvas refusal; with both guards in place, it passes.
   - If either removal does not fail, that is recorded as found and comes to me. Nothing is changed to make it fail.
   - The existing test is not changed. No assertion of the file is removed or loosened.
   - The reviewer reads the new test narrowly when it lands.

5. **The late `Completed` call: outside item 4, as you recommend.** Its guard is the one in `onDeliveryCompleted`. What it protects, the residency status and the scan state, never went through the banner, so this piece took no evidence from it.
   - One observation of that guard's removal is made at the head after the sitting and recorded as a dated comment line beside the test's line of 2026-09-23. It must fail at the test's assertion that Cancel is shown. A pass is a stop to me.

6. **Order.** Items 2 and 3 are comment lines and may land now. Items 4 and 5 need runs and wait until the human says the sitting is over. PR A stays a draft until all four are recorded and the reviewer's second attempt has read them.

7. Nothing here is reserved.
