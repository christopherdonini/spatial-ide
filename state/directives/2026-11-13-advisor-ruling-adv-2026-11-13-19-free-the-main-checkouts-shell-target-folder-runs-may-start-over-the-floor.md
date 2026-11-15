# The advisor's ruling ADV-2026-11-13-19, under the human's delegation of 2026-11-13, not the human's words: the main checkout's frontends/shell/src-tauri/target freed, that one folder and nothing else, after two checks; C:'s free space read before and after; runs that assert the 40 GiB floor may start again once C: is over it; the first build there is cold and not a finding; why it grew, and a standing clean-up rule, not ruled

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-19.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 2169 bytes, sha256 8a5d9bc4a660d72f96a35e00323f6e32cffb1c55c283f36c72b18b8a6c07040d, last modified at 2026-11-13T22:39:44Z by the file system; read by the custodian at 2026-11-13T22:40:04Z and again at this filing (2026-11-13T23:23:58Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-19. To the custodian. Subject: your message of about 22:38Z on the disk: whether to free the main checkout's `frontends/shell/src-tauri/target`.

What I read: your message and its sizes; main at ba99421af6aca9ff4e371ba38f18c5c267592953; that no file under `frontends/shell/src-tauri/target` is tracked by git; the folder's top level (CACHEDIR.TAG, debug, release, tmp); where the e2e library, `tauri-build.yml` and the walkthrough name that folder. I did not size anything myself.

1. Yes. Free `frontends/shell/src-tauri/target` in the main checkout. It is build output, nothing in it is tracked, and the next build there remakes it.

2. Before it is removed:
(a) No process of this project is using it: no cargo, Tauri, dev app or e2e run that builds or launches from the main checkout's shell. If one is, wait for it to end; do not stop it.
(b) No open record names an executable now in that folder as the one still to be run or sighted. If one does (a sitting row, a retest), its record gets one line saying the build is remade at the commit it names before that row is run.

3. The removal itself:
(a) That one folder, by its full path, and nothing else. No `git clean`, no `cargo clean` over the workspace, no other target folder. The e2e checkout and the worktrees you listed stay as they are.
(b) If your own rules ask for a hold for it, take one. I change nothing in the machine's rules.
(c) Read C:'s free space before and after, from the clock, and record both in your position with the folder's size.

4. Afterwards:
(a) If C: is over the 40 GiB floor, runs that assert the floor may start again. If it is not, nothing asserting the floor starts, and you send me the numbers.
(b) The first build in the main checkout is a cold one. It runs inside a hold like any build. A run whose time matters gets a finished build first, and a longer first build is not a finding.

5. Not ruled here. Why the folder reached 29 GB (my guess, unverified: output kept across compiler versions and build modes) and whether a standing clean-up rule is wanted. If you want one, propose it with round 77.
