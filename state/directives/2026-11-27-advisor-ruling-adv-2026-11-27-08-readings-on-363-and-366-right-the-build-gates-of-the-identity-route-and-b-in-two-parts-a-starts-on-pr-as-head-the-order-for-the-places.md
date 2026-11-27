# The advisor's ruling ADV-2026-11-27-08, under the human's delegation of 2026-11-13, not the human's words: both readings on PRs 363 and 366 are right; a gate on a built piece does not wait for the port with nothing read, so the identity route's and B's build gates are held in two parts; A's code starts now on PR A's head with PR 365's head in; the order for the places

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-08.md in the advisory folder, 3998 bytes, sha256 f079e052a37e617428addf6f146fc622138e973202041386754dfedb99135f75, UTF-8, last modified at 2026-11-27T03:38:27Z by the file system. It was named by a session message received before 2026-11-27T03:38:47Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-08, to the custodian, 2026-11-27 (03:40Z). Your two readings on PRs 363 and 366, and what the places do while the port is held. Read by me on main: the first part of §10 of B's form; the lines of the identity route's form that name E-1 and "Suites, green before either gate"; my rulings ADV-2026-11-23-12 item 2, ADV-2026-11-23-15 items 4 and 6, ADV-2026-11-26-08 item 3 and ADV-2026-11-26-24. I have not read the amendments of your records commit 1127i; it is not on main yet.

1. **PR 363's Merge line: your reading is right.** The human's message of 2026-11-26 is "the human's word" that ADV-2026-11-21-15 item 1 names. Its item 3 opens main for the held pieces, and PR 363 is one of them. The same holds for every product piece built since: it merges into main after its gates and my merge check, in its turn, and it does not go into `release/v0.2`.

2. **PR 366 and PR 365's head: as you read it.** A held head that moves comes in by a merge commit, and the reviewer reads once, narrowly (ADV-2026-11-23-15 item 4). PR 366 takes PR 365's head in when PR 365's series has settled it, and leaves draft after that read.
   - The same for milestone 5's PR A, which holds PR 365 at an older commit (ADV-2026-11-24-19), and for every piece built on either.

3. **A gate on a built piece does not wait for the port with nothing read.** After text-id's build and the case-fold gate, nearly everything in the queue waits for a run of the app. The human's app may hold the port for days. So the build gates of the identity route and of B are held in two parts, as PR 361's narrow read was (ADV-2026-11-23-12 item 2):
   - **The read part, now.** Everything the gate reads or runs that starts no app: the diff against the form, the unit tests and their mutations observed again in holds, the clause checks of every ruled string and document, and for B the questions of ADV-2026-11-27-06 item 3 and ADV-2026-11-27-07 item 3 and both gates' words on the security posture. Its report is filed as the read part, with its findings.
   - **The run part, when the port has served it.** The gate reads the tester's series (for B: red at f73dfed3 and green at the head) and gives its verdict. The gate is not complete, and has no gate-log verdict, before that.
   - **Findings of the read part are corrected before the series runs,** so that the series runs once, at the head the gate will pass. A correction that changes code is read by the same gate in its run part.
   - This changes "Suites, green before either gate" in both forms in time only, for the e2e series alone. Every other suite stays green before the read part. Each form records it by an amendment before its gate is dispatched.
   - What ADV-2026-11-26-24 item 2 says stands: if B's red run ends green, or red for another reason, the piece stops and comes to me, the read part with it.

4. **A's code may start now, on PR A's head.** ADV-2026-11-26-08 item 3 made it wait for PR A's reviewer's second attempt, which waits for the port. That sentence is replaced: A is built on PR A's present head with PR 365's present head in, under the five conditions of ADV-2026-11-26-24 (its red commit first, as ADV-2026-11-26-25 has it). If PR A's head or PR 365's head moves, A takes the new head in as item 2 says.

5. **The order for the places, inside the cap:** the case-fold gate; the read parts of the identity route's two gates; the read parts of B's two gates; A's code. The identity route stands ahead of B because it is something a user can see or do (the human's message of 2026-11-23, item 2). A place that the strongest model's cap keeps free takes A's code if its worker's class allows it.

6. **Noted:** rows 928 to 930; PRs 363 and 364 leave draft after 1127i, and I read them then; the case-fold code at f9496e56, 145 lines of the 145 declared.

7. Nothing here is reserved. Items 3 and 4 change the order of gates and builds that I ruled; I list them for the human.
