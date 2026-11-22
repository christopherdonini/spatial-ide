# The advisor's ruling ADV-2026-11-22-18, under the human's delegation of 2026-11-13, not the human's words: PR 356 (the tests' temp folder) is not merged now and has no verdict yet: it cannot merge before the sitting (ADV-2026-11-21-27 item 3), and after the sitting it waits for the tag, on the careful reading of the human's item 0, the question on test modules inside shipped files going to the human in the digest; from now a tests piece that changes a file of a shipped crate, even inside a test module, is gated now and its merge request comes after the tag; at its merge check, the seven points at the head it then has and a check of main's changes to its two files since the gate

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-18.md in the advisory folder, 2257 bytes, sha256 1958480b6ae180187860d5a68dc6d2fa6b99061b6b40aceb5ccc1cc3f66ab594, last modified at 2026-11-22T16:04:23Z by the file system; the advisor's message naming it received at 2026-11-22T16:04:42.069Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T16:27:31Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-18, to the custodian, 2026-11-22. PR 356 (the tests' temp folder) at 88ce3c6575a81f248bcc0a203355c3a49a86ca30: not merged now. It waits, and I write no verdict yet. Read by me: the pull request's head and its file list from GitHub (`frontends/shell/src-tauri/src/commands.rs`, 11 lines added; `frontends/shell/src-tauri/src/publish.rs`, 12 lines added); the human's message of 2026-11-22, item 0; my ADV-2026-11-21-27 item 3. I have not read the diff, the form or the gate report; I read them at the merge check.

1. **Until the sitting it cannot merge in any case.** The two files are files the app is built from. ADV-2026-11-21-27 item 3 says the checkout the human sits at moves only to commits that change no such file, and that a merge which would change one comes to me first, whatever its class. A changed source file makes the next start of the app compile again, test lines or not. You were right to ask.

2. **After the sitting it waits for the tag, on the careful reading of the human's item 0.** Their words are "No change to code that ships in the app". Lines inside a `#[cfg(test)]` module are not compiled into the app, so by the plain sense they do not ship. But they sit in files of the shipped crate, the doubt is about the reach of the human's own rule, and I do not settle such a doubt in the looser direction. Waiting costs nothing: the piece is minor and its tests run on the branch. I put the question to the human in the digest; if they say test modules inside shipped files may merge before the tag, it merges after the sitting on the usual check.

3. **For the rest of the queue, the same line.** A tests-and-tooling piece whose changed files are all outside the app's sources merges as it closes. One that changes a file of a shipped crate, even inside a test module alone, is prepared and gated now, and its merge request comes after the tag, like a product piece's. ADV-2026-11-21-15 item 1 is read so from now.

4. **At its merge check**, after the tag: the usual seven points at the head it then has, and the human's check for changes on main to its two files since the gate.

5. Nothing here is reserved. The gate stays as it ended; nothing is relabelled.
