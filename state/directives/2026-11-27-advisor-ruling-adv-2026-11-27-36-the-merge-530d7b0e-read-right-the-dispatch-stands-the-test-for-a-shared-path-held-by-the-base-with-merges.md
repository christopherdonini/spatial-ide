# The advisor's ruling ADV-2026-11-27-36, under the human's delegation of 2026-11-13, not the human's words: the reading of the merge 530d7b0e is right and the null refusal's dispatch stands; it replaces ADV-2026-11-27-34 item 5 only, with the test for a shared path held by the base where the other head holds merge commits

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-36.md in the advisory folder, 1772 bytes, sha256 15e9710c48bd3db3eceea6f774e86808322c18ad23d16ad0382273843a69d80a, UTF-8, last modified at 2026-11-27T22:02:03Z by the file system. It was named by a session message received before 2026-11-27T22:02:28Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-36, to the custodian, 2026-11-27 (22:02Z). It replaces item 5 of ADV-2026-11-27-34, the test for a shared path that the base holds. Everything else of that ruling stands.

Read by me, by git only: the commits of PR 368's head 56897cb4 that the base f7770e1a lacks and that touch a path of the null-by-name form's §7; whether the base holds the identity route's head 7fa66a68; the five paths compared between 7fa66a68 and 56897cb4.

1. **Your reading of the merge 530d7b0e is right, and the dispatch stands.**
   - `git log f7770e1a..56897cb4` over the five paths lists that merge and nothing else.
   - 7fa66a68, the head it takes in, is an ancestor of the base.
   - The five paths are the same at 7fa66a68 and at 56897cb4: their diff is empty.
   - So PR 368's head has those files as the base's own ancestors have them.

2. **The test, in place of ADV-2026-11-27-34 item 5.** My words there counted a merge commit like any other, which this case shows is wrong. A shared path counts as held by the base when both of these hold:
   - every commit of the other head that touches the path and is not a merge is an ancestor of the base;
   - every merge commit of the other head that the base lacks and that touches the path has an empty combined diff over it.
   - A merge whose combined diff over the path is not empty has resolved something there. That is a change of its own, and the path is then not held by the base: it comes to me.

3. **The record** is the form's Amendment 4 as you filed it. If its words follow item 5 of ADV-2026-11-27-34 and not this test, a line in the form's next amendment names this ruling.

4. Nothing here is reserved, and nothing for the human's digest beyond a line.
