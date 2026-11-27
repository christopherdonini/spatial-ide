# The advisor's ruling ADV-2026-11-27-14, under the human's delegation of 2026-11-13, not the human's words: B's architect read part; the thread handle in Settled::Ended inside §2 item 3, no fix in publish.rs in this piece, and three clauses of ADR-037 with new words before its text lands

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-14.md in the advisory folder, 5272 bytes, sha256 d9d35668e10656c8cd0bbbbf4c8007bf61c9a07afe5ea30ed691f1bedc665876, UTF-8, last modified at 2026-11-27T05:21:19Z by the file system. It was named by a session message received before 2026-11-27T05:21:40Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-14, to the custodian, 2026-11-27 (05:22Z). B at 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4, the architect's read part: F-1, F-2, and three clauses of ADR-037. The report is not on main; I have its findings from your message. Read by me at that head: in `page.rs`, the type `Settled`, `settle`, the head of `page_started`, `cancel` with its doc, and `run_end`; ADR-037's sections 3 to 6 in the branch; the form's §9 on main. Each ruling below rests on those reads.

1. **F-1, the thread handle inside `Settled::Ended`: it is inside §2 item 3, and it stays.** It is the same means that §2 item 4 grants `page_started`: a test joins the thread it started, and so waits for a real end without a sleep, which §9 item 9 forbids. The commands never read it. No code changes.
   - Its doc names the three tests that read it and says that the commands discard it. Those are F-6's words, and they come to me with F-3 to F-5 as item 5 says.
   - The class 8 amendment's item on means that §2 does not name (ADV-2026-11-27-07 item 2) gains this one.

2. **F-2, clippy: no fix in `publish.rs` in this piece.** That file is outside the Scope, and the clippy pieces stay paused until the tag (the human's message of 2026-11-23).
   - The reviewer's read part runs clippy at the base and at the head, as you plan. If the head fails where the base fails and nowhere else, B adds no failure, and the closing amendment says so with both runs.
   - A failure in one of B's own files is corrected in B.
   - If the form names a clean clippy run among its suites, it is read as "no failure that the base does not have", and an amendment records that reading before the gates' run part.

3. **ADR-037: three clauses say more than the code, and each gets new words before the text lands** (ADV-2026-11-26-27 item 4). The words are mine, checked against the code I read. Each Old text stands once in the branch's file.

   - **A-1, section 4, the second bullet.** The late close makes the host's close and runs the release only when `Projects` exists; it stops no poll.

````text
Old: - When its reply is `Opened` and that page has ended, the binding closes the returned name by §3 (ii) and then runs `release_ended`. The name never enters the current page's opens.
New: - When its reply is `Opened` and that page has ended, the binding closes the returned name by the host's close and then runs `release_ended`, when `Projects` exists. It stops no pool poll, because none is started for a name that enters no page's opens. The name never enters the current page's opens.
````

   - **A-2, section 6, the first bullet.** One sentence of it changes:

````text
Old: No earlier page has opens, so the end closes and cancels nothing: it runs an empty `release_ended`, writes its session-log line with every count 0, and opens the gate.
New: No earlier page has opens, so the end closes and cancels nothing: it runs an empty `release_ended` when `Projects` exists, writes its session-log line with every count 0, and opens the gate.
````

   - **A-3, section 5, under "The wait is part of the open call".** One sentence is added to the bullet:

````text
Old:   - A `cancel` of the new open's own key ends the wait. The binding answers it as for an open in flight, and the open ends as a cancelled open ends.
New:   - A `cancel` of the new open's own key ends the wait. The binding answers it as for an open in flight, and the open ends as a cancelled open ends. One case inside a single request round trip is not covered: when the open leaves the gate after the kernel has answered `unknown` and before the binding looks for the key, the binding answers `unknown` and the open goes on.
````

   - A-4 needs no words. Nothing else of the ADR changes.

4. **How the corrected text is made, and when.**
   - Wait for the reviewer's read part. If it finds another clause, that comes to me first, unreworded.
   - Then one script applies the pairs to the text of ADV-2026-11-26-27 item 1, each Old found once, and one commit on B's branch replaces the ADR with the result. You file the corrected text beside the final one under `state/drafts/`, with how it was made, and send me its line count, byte count and sha256.
   - I compare it with the branch and give the hash that replaces ADV-2026-11-26-27 item 1's for the merge check. Until then that item's hash stands for the text as it is now.
   - The form records this by an amendment. Its §9 item 14 is then read against the corrected text.

5. **F-3 to F-6, the worker's comments:** as you plan, they wait for the reviewer's words, and where the two gates differ for one place both come to me. The architect's finding that no path reaches `start_page_end`'s early return after `setup` is noted: it settles ADV-2026-11-27-07 item 3 (c) on the architect's side.

6. **The posture.** Noted: the architect's read part says, bullet by bullet over §10's six things, that the security posture is unchanged. That is what ADV-2026-11-26-18 item 3 asks of the architect's build gate, beside its form gate's statement. It stands with that gate's verdict, after the run part.

7. Nothing here is reserved. The ADR's corrections are mine under the grant's item 2; I list them for the human.
