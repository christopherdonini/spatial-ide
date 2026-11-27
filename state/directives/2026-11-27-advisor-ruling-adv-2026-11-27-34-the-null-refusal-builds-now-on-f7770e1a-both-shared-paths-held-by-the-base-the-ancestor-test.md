# The advisor's ruling ADV-2026-11-27-34, under the human's delegation of 2026-11-13, not the human's words: the build of identity-scan-refuses-a-null-by-name starts now on f7770e1a; both shared paths are held by the base; a shared path is held when every commit of the other head that touches it is an ancestor of the base

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-34.md in the advisory folder, 2504 bytes, sha256 cb98438226a009475743c21e0599af1f53acf941ba0f57a32ca55b044b3b47d4, UTF-8, last modified at 2026-11-27T21:43:13Z by the file system. It was named by a session message received before 2026-11-27T21:43:44Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-34, to the custodian, 2026-11-27 (21:44Z). `identity-scan-refuses-a-null-by-name`: your list under rule (00), and the two paths you found shared with pull requests 366, 350 and 364.

Read by me, by git only: whether the base f7770e1a holds each commit you name, and whether any commit of those three heads that the base lacks touches a path of the form's §7. Not read: the hunks themselves, the form's §2.2 and §2.7, and the other heads of your list.

1. **The build starts now, on f7770e1a.** No other base, and no wait.

2. **By my git, the base holds both paths as those pull requests have them.**
   - `git rev-list --count f7770e1a..<commit>` gives 0 for each of the five commits you name: 2b90ed51, 26cb8745 and 8d1fe83a (PR 366, `engine/src/error.rs`), 3f3820c9 (PR 350, `engine/README.md`) and a15a240d (PR 364, `engine/README.md`). Each is an ancestor of the base.
   - The heads 79f4380b (PR 366), a30f5fe8 (PR 364) and f7da1738 (PR 350) each have 52 commits that the base lacks. None of them touches `engine/src/error.rs`, `engine/README.md`, `engine/src/fixture.rs`, `engine/src/dataset.rs` or `kernel/tests/skp_admission_remediation.rs`: `git log f7770e1a..<head>` over those five paths is empty for each head.
   - So these two are shared paths that the base holds, like those of your item 4. A head that took main in after the base was made is not inside the base, but every commit of it on these paths is.
   - If your git gives another answer for one of the five commits or the three heads, hold the dispatch and tell me. Otherwise dispatch.

3. **The form's amendment, before code,** names them as its §8 asks: each path, the pull request, its commits, and that the base holds them. It is a record. No merge commit is owed for them.

4. **If one of those three heads later changes a path of §7,** the order meets it: those pull requests merge before this piece, and this piece then takes main in by a merge commit with the reviewer's narrow read of that file.

5. **The test, for this list and the later ones.** A shared path counts as held by the base when every commit of the other head that touches the path is an ancestor of the base. Whether the other head itself is inside the base is not the test.

6. **The lines of `engine/README.md`** stay as the form's §2.7 has them. I rule nothing on when lead-data writes them.

7. Nothing here is reserved. Nothing for the human's digest beyond the start itself.
