# The advisor's ruling ADV-2026-11-15-14, under the human's delegation of 2026-11-13, not the human's words: lod-tier-tests-own-tier-folder's OPEN-5 is (A), one five-line form with both gates from dispatch; a size note of 260 lines for this piece alone, section 21c's number unchanged; three terms (an overrun told before the gates, a section 21a touch or a change under engine/src or kernel/src stops the piece, and the form's sentence on what LOCALAPPDATA decides since PR 324); the filed draft's OPEN-5 compared before any worker; nothing needs the human

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-14.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T15:12:56Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T15:13:08Z (the file's modification time 2026-11-15T15:12:46Z; 3527 bytes, sha256 2c18536a2dbbb08d2d394c7b03fa22f058a3b05f79aa6dd9916cb8af62adb5b3), and again at this filing (2026-11-15T15:59:35Z), equal both times. It answers the custodian's message of 2026-11-15T15:11:19Z, which summarised lead-data's draft. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-14. To the custodian. Subject: OPEN-5 of lead-data's five-line form draft for `lod-tier-tests-own-tier-folder` (filler entry 11): the route at about 240 changed lines.

What I read. Your message, which summarises the draft; the draft is not on main yet, so I did not read it. On main at 68857b9e6771296c506134281ece3d202e9366eb: sections 21 to 21c and section 36 of `governance/AUTONOMY.md`; the node; item 2 of the human's message of 2026-11-06 that made the node; the human's two earlier answers on a filler over section 21c's line bound (2026-10-26, entry 6d; 2026-10-28, entry 9); `tier_root_for` and `data_dir_for` in `engine/src/app_dirs.rs`.

1. OPEN-5: (A). One five-line form, with the reviewer and the architect gating from dispatch, as section 36 has it for every filler.

2. The size note. For this piece the line bound of section 21c is 260 changed lines, counted as section 21c's note counts them. The other three bounds of section 21c stand: at most 8 files, no new exposure surface and no new dependency, and no new behaviour a user sees.
(a) This follows the human's own two answers. For entry 6d: "the note under §21c: 260 lines for this piece". For entry 9: at or under 260 lines it stays five-line, and over 260 it takes the full form with both gates.
(b) The note is mine, under the delegation, for this piece alone. It is not the human's note, and section 21c's number is not changed.
(c) No gate is lost by it. A filler has both gates from dispatch at any size. What (A) keeps is the short form, for a change that is tests only, by your message.

3. Why not the others. (B) leaves the kernel test writing to the machine-wide folder between two merges, which is the defect the human's item 2 names, and it doubles the gates for one idea. (C) adds the full form to a tests-only piece and gives the gates nothing they lack under (A).

4. Three terms.
(a) If the built diff is over 260 lines, section 21b's overrun clause applies: the piece keeps its form, the overrun is recorded as an amendment, and you tell me before the gates are dispatched.
(b) If anything of section 21a is found mid-piece, or a file under `engine/src` or `kernel/src` has to change, the piece stops and comes to me.
(c) One fact from port-2 for the form and both gates. Since PR 324, on Windows the one variable LOCALAPPDATA decides two things: the tier root and the per-user data directory, under which the audit log, the session store and the project machine store sit. A test process that sets LOCALAPPDATA moves all of them for that process, not the tier folder alone. The form says so in one sentence. For each process the piece touches, the kernel test first, the form or the worker's report says what else in that process reads the per-user data directory, and that nothing there depends on the machine's real one. The gates check that sentence against the code.

5. I ruled from your summary of OPEN-5. When the draft is filed, I compare its OPEN-5 with your message: the three options, the size, the file count, and that nothing under `engine/src` or `kernel/src` changes. If they differ, I rule again. The form may be committed in the commit that files the draft. No worker is dispatched until I have answered that check.

6. The draft's other OPEN items are not before me. If a gate or the draft shows one to be a change of scope, it comes to me.

7. Nothing here needs the human. The digest lists it, with the size note, for the human's overturn.
