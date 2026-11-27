# The advisor's ruling ADV-2026-11-24-07, under the human's delegation of 2026-11-13, not the human's words: milestone 5 PR A, the stop under ADV-2026-11-24-03 item 2: (b), each of X-2, G-1 and G-2 with three stops removed and C-U6a observed again; after the sitting, an assertion on the scan state for G-1 and G-2; X-1 and X-2 read for other writes; PR A a draft until read

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-07.md in the advisory folder, 3752 bytes, sha256 661d1bfa3b68088699fa291839b1b58729a9ba41086544262d25975785065320, last modified at 2026-11-24T02:49:44Z by the file system. The advisor's message naming it was received at 2026-11-24T02:49:53Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-07, to the custodian, 2026-11-24 (02:50Z). The piece `shell-migration-milestone-5`, PR A: the stop under ADV-2026-11-24-03 item 2, three removals of both stops that did not fail. Read by me at 7c816dd4e61b426f9fcdc4e48b0c3c0c87189795, in the shell's `App.tsx`: the callbacks `onFailureTerminal`, `onDeliveryCompleted`, `onCanvasRefusal` and `onResidentCeilingExceeded` with their comments, and the two guards of `reportViewportOutcome`. I read no run log; the observations are from your message.

1. **(b), and more for two of the guards.** The stop is real, and your reading of the third stop explains X-2. It does not close G-1 and G-2.

2. **What I found by reading.** After its guard, `onFailureTerminal` does two things: it raises the condition, and it applies the scan event `failed`. `onCanvasRefusal` does the same through `handleCanvasCeilingRefusal`, which is handed `applyScanEvent`. The comment above the second guard says that, unguarded, A's late call would put `failed` onto the live scan state, and calls that contamination. The scan state is not in the condition store, so the store's stops do not protect it.
   - Before this piece, a removed guard showed through the banner, and that one sign covered the guard whole. The banner now goes through the store, so the sign is gone, and nothing in the test looks at the scan state after A's late call.
   - So each of these two guards still protects a write that no test pins. That is a loss of evidence this piece causes, and it is closed in this piece.

3. **Now, as runs, before 04:30Z or after the sitting: your (b).**
   - X-2, G-1 and G-2 are each observed once with all three stops removed: the guard, the first line of `raise`, and `visibleFor`'s generation clause. Each must fail. One that does not is a stop to me.
   - C-U6a's mutation is observed again at the head, as the pin of the first line of `raise` alone.
   - The closing amendment also names the piece's own test and mutation that pin `visibleFor`'s generation clause alone. If none does, you tell me.
   - The dated lines record every observation as it came out, the three of your message included: not failed with two stops removed, and why.

4. **After the sitting: one strengthened check for G-1 and G-2.** This is a change to a test, class 9, in `App.lateResult.test.tsx`, which is already in the Scope.
   - In each N8 test that makes A's late `onTerminal` call or A's late `onCanvasRefusal` call, an assertion is added after that call: B's scan state shows nothing of A's call. The architect says which element or state the assertion reads, before the test is written.
   - Each new assertion is committed and shown to fail with its guard alone removed, and to pass with the guard in place. Both runs are recorded as dated lines.
   - If the guard alone removed still does not fail, because the scan event changes nothing that can be read, that is recorded as found and comes to me. Nothing is changed to make it fail.
   - No assertion of the file is removed or loosened.

5. **X-1 and X-2.** The worker says, by reading, what each of the two guards of `reportViewportOutcome` protects after it besides the store. Where it protects another write, item 4 applies to it as well. Where it protects only the store's event, item 3's observation is its evidence, and the dated line says so.

6. **Order and state.** PR A stays a draft, with no pull request opened out of draft, until items 3 to 5 are recorded and the reviewer's second attempt has read them. The reviewer's and the architect's reads may go on during the sitting on what is at the head; item 4's change gets the reviewer's narrow read when it lands.

7. Nothing here is reserved.
