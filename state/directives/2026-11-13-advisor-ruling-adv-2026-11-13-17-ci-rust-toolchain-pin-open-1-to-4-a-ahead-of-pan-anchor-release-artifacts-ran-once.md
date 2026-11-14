# The advisor's ruling ADV-2026-11-13-17, under the human's delegation of 2026-11-13, not the human's words: the CI toolchain pin's OPEN-1 to OPEN-4 each (A), release-artifacts covered through tauri-build with no dispatch, the step naming the commit alone, S1's read repeated at the merge check, a red job stopping the piece in draft; one fact in the draft corrected (release-artifacts has run once) and one sentence for N3; the pin ahead of pan-anchor's fix if that is not dispatched when the form is committed

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-17.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 6533 bytes, sha256 056fbcd202e4478ec3cf9ecfb36eabafe4ae604060817e9862264e2264d73300, last modified at 2026-11-13T19:25:43Z by the file system; read by the custodian at 2026-11-13T19:28:27Z and again at this filing (2026-11-13T19:50:58Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-17. To the custodian. Subject: your message of 19:20Z on `ci-rust-toolchain-pin` (filler entry 16): its form's OPEN-1 to OPEN-4. Item 6 below changes ADV-2026-11-13-10, item 1, in one respect, the order against pan-anchor's fix; the rest of ADV-2026-11-13-10 stands.

What I read: your message; the architect's draft as filed on main at 04b7b451, whole; my files ADV-2026-11-13-05 and ADV-2026-11-13-10; main's Product CI — Rust workspace run 43473141005 and the logs of its two jobs; main's shell run 43473140935 and fmt run 43473141010 at the same commit, for their toolchain lines; the seven install steps on main and the lines after each; `.github/workflows/release-artifacts.yml`, whole, and the first 70 lines of `.github/workflows/tauri-build.yml`; each workflow's pull_request paths; the latest runs of the seven workflows and of release-artifacts; the open PRs; what every unmerged branch of origin changes under `.github/workflows/`; port-2's hunks in `.github/workflows/product-ci-rust.yml`; rule (00); your position of 18:59Z in `state/CUT-STATE.md`.

1. The facts under ADV-2026-11-13-10, item 4. I read the same as you report, from the logs and not from your message.
(a) Run 43473141005: a push run on main at 6edbfa71d5b7f7f796589c3812c1abcc08957fc5, success. Jobs 132049980781 (ubuntu-24.04) and 132049980979 (windows-latest) each log `rustc 1.100.0 (0ef1bc386 2026-11-09)` and each downloads the toolchain action at b725eda525362e7cf34af9a7243cac1e3f01a7ec. They agree.
(b) Both jobs log the script of the action's parse sub-step. It fails on an empty input, rewrites the `stable … ago` and `stable minus …` forms and an input of two parts (`1.<n>`), and writes any other input to its output unchanged. A three-part `1.100.0` is passed on as it is. I did not read the action's repository; the run's log is my source.
(c) The shell run and the fmt run on main at the same commit log the same rustc line and the same action commit in each of their three jobs (132049978528, 132049978841, 132049979027).
(d) None of item 4 (c)'s stops had fired at 19:25Z. The version is 1.100.0, in three parts, and the action's commit is b725eda525362e7cf34af9a7243cac1e3f01a7ec.

2. OPEN-1: (A). release-artifacts is recorded as not run by this piece and as covered through tauri-build.
(a) It is not one of the seven and has no install step. Its `resolve` job runs one string step. Its build job calls `.github/workflows/tauri-build.yml` with one input, the artifact's name. The same file runs at the PR's head through product-ci-shell's `tauri-build` job, on the same runner label.
(b) No dispatch of release-artifacts is made for this piece. The evidence ADV-2026-11-13-05, item 3, asks for is the PR's own runs.
(c) A fact in the draft to correct before the form is committed. OPEN-1 (B) says a dispatch would be that workflow's first run. It has run once: 34833992340, a workflow_dispatch on main at 23873935, on 2026-09-14, success in both jobs. The form does not say "first run".
(d) The header of `.github/workflows/release-artifacts.yml` still gives its first dry run as EMPTY (lines 34 and 35). That is not this piece's: no header is edited here. You look at whether the slot is owed that run's record, and if it is, you propose a node.
(e) The form's N3 says in one sentence that from the pin's merge on, a tagged build takes the pinned toolchain through tauri-build. That follows from the seven steps the human approved; the record should say it plainly.

3. OPEN-2: (A). The step's line names the commit alone, with no comment. The `toolchain` line below it says what is installed, and the form records where the commit was taken from.

4. OPEN-3: (A). S1's read is repeated at the merge.
(a) You repeat the read when you send the merge-check request. The request lists, for each of the workflows S1 names, every main run in the window with its run id, head commit, job ids and rustc line, or "no main run in the window".
(b) I read the same again at my check.
(c) If any main run between run 43473141005 and the merge logs another rustc line, my verdict is HOLD and nothing merges. What is pinned instead is Chris's to say, and I take it to him.
(d) A workflow with no main run in the window is not a stop.
This adds a check to my merge check for this piece. It loosens nothing.

5. OPEN-4: (A). A job of the PR that is red stops the piece in draft, and it comes to me with the run, the job, the failing step and the cause.
(a) If the cause is not the install step, I place a follow-up node for it. This piece is not widened. "Every Rust workflow green" is Chris's own wording (ADV-2026-11-13-05, item 3), so the pin does not merge while a Rust job of its PR is red, and I rule no exception to that.
(b) If the cause is the install step (the version cannot be installed, the default is not set, or another action commit is recorded), the same stop holds, and what CI installs instead is Chris's to say.
(c) For your planning, this is a live case. The two spike workflows last ran on main on 2026-09-09 (runs 34327766173 and 34327766119), and product-ci-viewer last ran on main on 2026-11-04 (run 41755206807). The spikes meet a compiler two months newer than their last run.

6. The order. The pin does not wait for pan-anchor's fix.
(a) If `pan-anchor-setcam-waits-for-its-own-reset` has not been dispatched when the pin's form is committed, the pin takes the filler slot first. If the fix is already dispatched by then, ADV-2026-11-13-10, item 1, stands as it is.
(b) My reasons. The fix waits for the port-5400 harness, which the pin never uses. And the pin is the piece that time can stop: by the draft's N8, 1.100.0 is a day old, and a point release that reaches a main run before the PR opens sends the piece to Chris under ADV-2026-11-13-10, item 4 (c).
(c) Pan-anchor's fix follows the pin under the filler rule as it stands. I change nothing in when a piece leaves the slot.
(d) You run rule (00) at dispatch as always. As I read origin's branches at about 19:22Z, port-2 is the only unmerged piece that changes any of the seven files, and #314 changes nothing under `.github/`. ADV-2026-11-13-10's exception covers port-2 and `.github/workflows/product-ci-rust.yml` alone. If any other piece in flight touches one of the seven, it comes to me before the pin starts.

7. Nothing else in the draft needs a ruling from me. The form is committed from it with items 2 to 5 recorded as the advisor's rulings, not as the human's words.
