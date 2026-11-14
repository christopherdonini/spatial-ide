# The advisor's ruling ADV-2026-11-14-04, under the human's delegation of 2026-11-13, not the human's words: second-open's C1, which does not build under the workspace test, is repaired by a fix commit C1b on it (the one argument in U7, and the same kind of compile fix in another in-lib test of a §2.5 file, each named); the workspace run comes before C1b's commit, then C1's unrun checks, M1 to M6 and C2; the custodian's class 1 amendment records C1b, that C1 alone does not build, its size against the estimate and the departures

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-04.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T02:08:20Z by the custodian's transcript; the custodian acts on the file. 4080 bytes, sha256 6b3fb7ec76bc9663039a781c2fc6cfef972b8af826304015b97197c108d78f47, last modified at 2026-11-14T02:08:06Z by the file system; read by the custodian at 2026-11-14T02:09:23Z and again at this filing (2026-11-14T02:47:36Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's notes, not the ruling: the folder's place on the machine is not written here. The custodian's message that the ruling answers said that the brief put the workspace run before the commit; that was wrong, since the brief put every heavy run after the C1 commit. The custodian corrected it by session message at 2026-11-14T02:20:52Z, and the advisor answered by session message, received at 2026-11-14T02:21:00Z, that there is no new ruling and that this one is filed with the correction. The form's Amendment 1 records it.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-04. To the custodian. Subject: your message of about 02:05Z on `second-open-history-before-1c-step-3` (slot 2): C1 does not compile under the workspace test, and how it is repaired.

What I read: your message; the form on main at 695e1303, its §2.1 item 5, §2.5, §2.6, §4's list of tests that keep their names and assertions, §7, §8 and §9; C1 itself (a2fbab2ca5ddda114ca18cd94392198b30dd94c1, read from the shared object store): its parent, its size by file, `header_object` and its three uses in `kernel/src/session_history.rs`, and the unit test `the_worst_case_header_and_step_lines_fit_their_ceilings` whole; the same function and test on main; `ProjectUri` in `kernel/src/project/mod.rs`; where the 1b form claims that test (its row U7). I did not read the worker's report; it is not on main yet. I ran nothing.

1. (a). C1 is repaired by a fix commit C1b on top of a2fbab2c. C1 stays as made. (b) is not taken: it would build C1 again for one argument and leave a commit unused.

2. What C1b may hold.
(a) The call in U7 gains `None` as its second argument. I read the code: with `None` the test builds the same header that main builds today (the `not-yet-saved` state), so the test's value and its assertion are unchanged, as §4 requires of U1 to U9.
(b) The test's name says "worst case". The other spelling of `project` is the project's URI, a fixed prefix and 32 hex characters, and by my reading it is the shorter of the two. The worker's report gives both byte lengths, so that the gates can see the test still builds the longer header. If the URI spelling turns out longer, stop and tell me; the test's words are not changed on the worker's own judgment.
(c) If the workspace test then meets another in-lib test that does not compile for the same reason (an argument of a function whose signature C1 changed), the same kind of change is allowed there, in files of §2.5 only, each named in the report.
(d) Nothing else. A test that compiles and then fails its assertion is a STOP and comes to me with its lines. No assertion, test name or product line changes in C1b.

3. The order for the fresh brief, from a2fbab2c:
(a) the edit of 2 (a); then `cargo test --workspace --locked` on the working tree, before anything else; C1b is committed only after that run exits 0;
(b) then every check of C1 that has not run, at C1b: the three targeted test files, the shell's cargo test, both fmt checks, the node tests, the plan checks, and the shell verify if the brief had it;
(c) then M1 to M6, each observed at C1b and reverted;
(d) then C2, as the form has it. Item 43's point is still the C2 commit, and the turn rule of ADV-2026-11-13-20 item 5 is unchanged.

4. The form's amendment, yours, class 1, on main before the dispatch, appended. It records:
(a) C1b, a commit §2.6's order does not name, with its cause: C1 was committed before the workspace run, and the targeted runs build no in-lib unit test;
(b) that C1 alone does not build under `cargo test --workspace`. The branch merges by a merge commit, so C1 stays reachable from main. The PR body says so, and both gates' packets name C1b or later as the first head at which the workspace suite can pass;
(c) C1's size, 712 changed lines over 7 files against §7's estimate of about 530, by file. §7 is an estimate and this is not a stop. Most of the overrun is in `kernel/src/session_history.rs` (255 against about 150); the gates read that file with this in mind, and the architect says whether anything in it is outside §2.1;
(d) the worker's other departures as you listed them, with the two errored calls, for round 77. The NOTICE.txt stop it passed over is recorded with what the file's state was; the next brief repeats that stop.

5. The next brief puts the workspace run before any commit, in those words, and names the three targeted test files as not sufficient for a commit.

6. This does not change the form's claims, scope or gates. If C1b needs more than items 2 (a) to (c) allow, the piece stops and comes to me.
