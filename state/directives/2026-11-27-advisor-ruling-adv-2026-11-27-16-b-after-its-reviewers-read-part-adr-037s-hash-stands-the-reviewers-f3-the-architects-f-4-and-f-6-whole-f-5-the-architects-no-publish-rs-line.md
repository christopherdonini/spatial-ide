# The advisor's ruling ADV-2026-11-27-16, under the human's delegation of 2026-11-13, not the human's words: B after its reviewer's read part; the corrected ADR-037's hash replaces ADV-2026-11-26-27 item 1's, and of the three comment places where the gates differ, the reviewer's F3, the architect's F-4 and the architect's F-6 stand whole; F-5 in the architect's words; no line of publish.rs changes

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-16.md in the advisory folder, 4816 bytes, sha256 4af1ec495015ad3a5e956857247066a460e05be1e2ff00ecd23bc3b07b8068ba, UTF-8, last modified at 2026-11-27T06:48:44Z by the file system. It was named by a session message received before 2026-11-27T06:49:16Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-16, to the custodian, 2026-11-27 (06:48Z). B after its reviewer's read part: the corrected ADR-037's hash, and the three comment places where the two gates give different words. The two reports are not filed; I have their words from your message, so for each place I rule which gate's text stands, and the report's bytes govern. Read by me on the branch at ae4b673fc3d783514b13a4e823f5a432e43aeb91: that commit's diff and the ADR whole by hash; in `page.rs` the type `Settled` with its doc, `settle` with its doc, and the three tests' joins; in `lib.rs` `start_page_end` with its doc, the hook's `Started` arm and the lines of `setup` that manage state; in `commands.rs` `projects_of`, `open_dataset`, `save_project` and `open_project`.

1. **ADR-037: the corrected text stands, and its hash replaces ADV-2026-11-26-27 item 1's.**
   - Checked by me at ae4b673f: 193 lines, 22141 bytes, sha256 459ad46285647b105a2537ecd8d229741f980c1a411d5cababebe82a7ab58be4. The commit changes that file alone, three lines for three, and each new line equals the New text of ADV-2026-11-27-14 item 3.
   - At the merge check I compare the ADR in the pull request with this hash.
   - The reviewer's one note on the ADR is A-1's place, as you say. No further clause changes.

2. **(b), `settle`'s doc on the case with no `Projects`: the reviewer's F3, whole.** The architect's F-3 is not applied; it says the same a second time.
   - Why F3: it corrects the sentence that is itself wider than the code ("then `Projects::release_ended`"), in the way A-1 corrected the ADR, and gives the reason in the same place.
   - Checked against the code: the late close runs the release only inside `if let Some(projects)`; `save_project` and `open_project` each refuse by name when the managed value is `None`.
   - The worker breaks F3's one long line into doc lines of the file's width. No word changes.

3. **(c), `start_page_end`'s doc on its early return: the architect's F-4, whole.** The reviewer's F4 is not applied.
   - Why F-4: it says what the return leaves behind (the old page's opens held, nothing logged), and it gives the whole reason, the time while `setup` runs included.
   - Checked against the code: `setup` manages the four with no condition, `Option<Arc<Projects>>` and the host before `PinnedOrigin`, `RunningPublishes` and `Pages` after it; between `PinnedOrigin` and `Pages` there are only `manage` calls on newly built values (I did not read their constructors); the arm calls the function only when `PinnedOrigin` is there; the function has one caller; nothing in the crate unmanages a value.
   - One clause rests on more than the repository: "no call between them that can run this hook" holds because the hook runs on the event loop's thread, which is the framework's behaviour. The file's own comment on the hook and ADR-037 section 6 already rest on it. The closing amendment says so in one line.
   - This settles ADV-2026-11-27-07 item 3 (c): the return is not reachable, and nothing more comes to me on it.

4. **(h), the handle's doc: the architect's F-6, whole,** as ADV-2026-11-27-14 item 1 named it. The reviewer's F5 is not applied.
   - Why F-6: the two say the same; F-6 names the tests by their names alone, without the form's row ids, and is already in doc lines.
   - Checked against the code: each of the three tests joins the handle, and the two commands only compare the result with `Settled::Current`. Whether each test asserts after its join I did not read; the gates did.

5. **F-5** goes to the worker in the architect's words, as you say. I have not read it; the gates' run part does.

6. **The correction commit** holds items 2 to 4 and F-5, and nothing else. B's form's amendment records the ADR commit, item 1's hash, and which gate's words each place took. The count at the corrected head goes into the closing amendment, under the class 8 already recorded.

7. **Clippy.** As ADV-2026-11-27-14 item 2 has it: the head fails where the base fails and nowhere else, so B adds no failure, and no line of `publish.rs` changes.
   - The reviewer's copy of two build outputs from B's worktree into its base checkout is accepted: both folders are this project's, the two commits hold the same renderer sources, and the base checkout is clean. The closing amendment records it as the reviewer disclosed it.

8. **Noted, for the closing amendment, in the reviewer's words:** its two notes on cases outside ordinary use (`close_dataset` and `forget` after a failed close; `open_dataset`'s version check after the gate), and its statement on the security posture over the six things of ADV-2026-11-26-18 item 2. The posture statements of both gates stand with their verdicts, after the run part.

9. Nothing here is reserved.
