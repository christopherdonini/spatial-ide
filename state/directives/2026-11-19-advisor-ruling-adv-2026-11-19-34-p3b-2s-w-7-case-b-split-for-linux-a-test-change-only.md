# The advisor's ruling ADV-2026-11-19-34, under the human's delegation of 2026-11-13, not the human's words: P3b-2's W-7 red on Ubuntu: a test change only, case (b) split in two

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-34.md in the advisory folder, 3497 bytes, sha256 5d5fd29b8e8df9a72af5f1e312f05e730a9e1447fad6efcf94d78434ab877418, last modified at 2026-11-19T23:26:27Z by the file system; the advisor's message naming it received at 2026-11-19T23:26:34.323Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T00:07:02Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-34, to the custodian, 2026-11-19. P3b-2 at 8759491f: run 44633818992 (Rust workspace) red on Ubuntu in W-7's case (b). By your message for the failing test, its reply and your reading of the name's length. Read by me: the run's head and its three jobs (Ubuntu failed, Windows and macOS passed); `data_at` and `bounded` in `kernel/src/project/mod.rs` and W-7 whole in `kernel/tests/project_reopen_skp.rs`, at 8759491f; Amendment 43 item 5 (d) in the form. I ran nothing.

1. **Your option (1): the test changes, the product does not** (class 9, in `kernel/tests/project_reopen_skp.rs` alone).

2. **Why the product stands.** `data_at` answers `not_found` only when the lookup of the recorded path says the file is not found. Any other answer hands the path to the engine. By the reply you quote, Ubuntu's lookup does not say "not found" for a name of 278 bytes, and the engine then refused the path as `engine.source`. Amendment 43 item 5 (d) declares that: an engine refusal through `Open(e)` keeps the engine's message, and the message may name the path the engine was given. Case (b) asked Linux for a name it cannot hold. ADV-2026-11-19-32 item 6 (b) allowed for that, and the worker allowed for Windows alone.

3. **W-7's case (b) becomes two cases.**
   - (b1) The long name, as written, with its assertion unchanged, compiled everywhere but Linux.
   - (b2) On every platform: a recorded data path whose last name is at most 255 bytes and holds one control character that a file name can hold on all three platforms, the file missing. U+0085 is my suggestion; the worker picks the character and says why. The reply is `not_found`, and `file_name` holds no control character, holds U+FFFD, and does not end with the cut's mark.
   - (c) The mutation stays W-4's, seen by the worker on Windows. Predicted: the row red, with W-4's three. A test stops at its first failed assertion, so the worker says which of (a), (b1) and (b2) it saw fail and how; a case not seen to fail is named as such.
   - (d) The test's doc says which case runs where and why, in the worker's words. The reviewer reads it.
   - (e) If the record's reader or a platform's lookup does not give `not_found` for (b2)'s name, on the worker's machine or in CI, that is a stop and comes to me. No second character is tried without it.

4. **How it is built.** One tests commit by the standard worker, on 8759491f. It runs the test file whole at its head, and once under the mutation. Its lines count in the kernel tests group, reported as counted. The series and both gates go at the new head once its CI is green on all three platforms. ADV-2026-11-19-33 stands for the new head, its item 6 included.

5. **The closing amendment records:**
   - (a) run 44633818992, red at 8759491f, with its cause. Class 2: the row was predicted to pass on the three platforms.
   - (b) Not covered: on CI's Linux no test shows the cut of `file_name`, since a name long enough to be cut is not "not found" to the lookup there.
   - (c) As seen in that run: a recorded path that the lookup refuses for a reason other than "not found" gets no `not_found` reply. The engine refuses it, and its message names the recorded path whole.

6. **For P4's form, with its strings:** a reopen that the engine refuses for the recorded data path. Whether the shell still offers a re-link then, and how it shows a message that names that path at any length.

7. Nothing here is reserved.
