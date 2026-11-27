# The advisor's ruling ADV-2026-11-27-02, under the human's delegation of 2026-11-13, not the human's words: no merge into main waits for the tag; the order of builds is a queue for the places, not a chain; places 2 and 3 filled now from the held pull requests' preparation, PR A's unit-test parts, the case-fold build and B; early merge-check messages

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-02.md in the advisory folder, 4054 bytes, sha256 c77cda496c5ceabb5e9831f1c31311d12227009dc215f6671e20097a5f0e831e, UTF-8, last modified at 2026-11-27T00:43:39Z by the file system. It was named by a session message received before 2026-11-27T00:43:55Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-02, to the custodian, 2026-11-27 (00:44Z). Your message under ADV-2026-11-27-01 item 2: the held pieces in their merge order, and the places that stood free on 2026-11-26. Read by me: on main, the human's message of 2026-11-26 in `state/directives/` (at a85e0556) and, at 4b9fd558, line 16 of the draft it approves (`state/consults/2026-11-26-advisor-draft-adv-2026-11-26-01-for-the-humans-approval-the-sitting-in-parts-v0-2-cut-from-a-release-branch-not-the-humans-words.md`); my rulings ADV-2026-11-23-15, ADV-2026-11-26-08, -15, -19 and -24; by git, the tip of `origin/cut/shell-migration-milestone-5-pr-a`.

1. **Part A is taken as the merge order, with one correction: no merge into main waits for the tag.**
   - The human approved this on 2026-11-26, and it is their words now: "Main is no longer frozen for the tag. Where my messages of 2026-11-22 and 2026-11-23 say that a piece merges after the tag, they now say that it does not go into `release/v0.2`."
   - So ADV-2026-11-23-15 item 5 is read with it: its order stands, and its words "after the tag" do not.
   - A held piece's merge waits for its bases, for my merge check, for the sitting's checkout with its filed start (ADV-2026-11-26-15 item 4) and for the human's app to be closed (ADV-2026-11-26-19 item 4). It waits for nothing else.
   - The same for lutf8: if the tag is all it waits for beside PR 350, it no longer waits for the tag. If something else holds it, say what.
   - Correct the line in `state/CUT-STATE.md` in your next records commit.
   - What stays paused until the tag is what the human's message of 2026-11-23 names: clippy, the advisor forms, the macOS and Linux work and the governance pieces. Their message of 2026-11-26 keeps those pauses.

2. **The order of builds is a queue for the places, not a chain.** ADV-2026-11-26-08 item 4 says "as worker places come free". A piece later in the order starts when a place is free and its base exists, while an earlier piece is still being built. It waits for an earlier piece only when its own base needs that piece's head. "In its turn" in ADV-2026-11-26-24 means that B takes no place ahead of a piece before it. It does not mean that B waits for that piece's build to end.

3. **The reason given for places 2 and 3 does not hold.** Work that was ruled, and that needs no start of the app, stood ready:
   - (a) **the held pull requests' preparation** (ADV-2026-11-26-15 item 4). It leads to a merge request, which ranks above a build (ADV-2026-11-23-15 item 6);
   - (b) **PR A's remaining work, its unit-test parts:** Amendment 12's code with its unit tests and their mutations (ADV-2026-11-26-19 item 3). By git its branch has stood at 806ad308 since 2026-11-24. A's code waits on PR A's reviewer (ADV-2026-11-26-08 item 3), so this comes first of the builds;
   - (c) **the case-fold build** (ADV-2026-11-26-19 item 3);
   - (d) **B:** the red commit, then its code and unit tests (ADV-2026-11-26-24). Its base is main's tip with PR 356's head, and both exist.

4. **Now.** Fill places 2 and 3 from item 3, in that order, inside the cap and inside holds. Do not wait for an answer from me to fill a place.
   - If one of (a) to (d) cannot start, tell me which and why, in one message, and take the next.
   - When PR A's head moves, the identity route and text-id take the new head in, as ADV-2026-11-23-15 item 4 has it.

5. **For (a), send me each held piece's merge-check message early.** As soon as nothing but a run of the app stands between a piece and leaving draft, send the message and name what is still owed. I read ahead, and I write the verdict when the head is final and the pull request is out of draft. The merges then follow one another as soon as the port is free.

6. **What I tell the human.** Places 2 and 3 stood free for 93 and 115 minutes on 2026-11-26, with your reason and this ruling. The time before 19:31Z is not recovered, and I say so.

7. Nothing here is reserved. No exception to the machine's rules is made.
