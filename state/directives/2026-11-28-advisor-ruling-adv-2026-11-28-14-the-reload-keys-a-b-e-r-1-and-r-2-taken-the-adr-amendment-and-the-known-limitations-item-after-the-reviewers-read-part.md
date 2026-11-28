# The advisor's ruling ADV-2026-11-28-14, under the human's delegation of 2026-11-13, not the human's words: the reload keys' Part A after the architect's read part: (a), (b), (e), R-1 and R-2 taken; the ADR amendment and the KNOWN-LIMITATIONS item after the reviewer's read part

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-14.md in the advisory folder, 4123 bytes, sha256 c141658de439ff31e32d7ae8b78039578862dd2cfae629c63335abafac12e0d5, UTF-8, last modified at 2026-11-28T07:18:49Z by the file system. It was named by a session message received before 2026-11-28T07:19:31Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-14, to the custodian, 2026-11-28 (07:19Z). The reload keys' Part A after the architect's read part at 5174676a: its answers (a), (b) and (e), and its R-1 and R-2. The ADR amendment's words and the KNOWN-LIMITATIONS item still come once, after the reviewer's read part. It answers item 3 of your message of about 07:16Z.

Read by me on main at 8cc4fdd8: the architect's report whole; the filed reading of Microsoft's two pages whole; my ADV-2026-11-27-44 item 12 and ADV-2026-11-28-09. Not read again: the code (I read it at 8ba765d9, and by Amendment 9 the head 5174676a changes the test file alone); the crate sources the report cites; ADR-037.

1. **(a): taken as the architect gives it. The sources do not show whether the menu setting applies to the first document.**
   - What they show, by the report: the first navigation is asked for before the shell's call; the host's `NavigationStarting` handler cannot run before that call; when the runtime fixes a navigation's settings is the runtime's own.
   - §1's third "may not claim" stays as it is.
   - The ADR amendment and the KNOWN-LIMITATIONS item will say that the log line states the values read and not their effect, and that the first screen of the installed build may keep the menu.
   - Only the human's right-click on an installed candidate settles it.

2. **(b): taken. The stub stands, and so do the five cfg forms.**
   - I ask for no change to two forms. The architect asks for none, and such a change would touch code after its tests and move the cfg-boundary numbers again, with no change in what the build does.
   - §1's line claim needs no case off Windows named. §1 claims for the shipped Windows build alone.
   - If the reviewer's read part gives other words on the stub, both come to me.

3. **(e): taken.** 417 lines against 330, class 8 at the count, as Amendments 7 and 9 record it. The about 9 lines outside §2's plan are the stub and the cfg attribute lines. I read them as the architect does: a code path inside a Scope file, with the product line that calls `reach` as its caller, and not a scope addition. Amendment 7 names the stub. Nothing more is owed for it.

4. **R-1: taken. The right-click comes first.**
   - ADV-2026-11-28-09 item 8, second bullet, is read so: the right-click is made first, on the first screen after the start, before any key and before anything else navigates.
   - Under Part A alone, Ctrl+R and F5 reload. A key pressed first would put the right-click on a second document.
   - The row I write for the human will have this order: a right-click on the first screen; Ctrl+R; a right-click again; F5. The second right-click shows whether the setting holds from the next page load.

5. **R-2: taken.** ADV-2026-11-27-44 item 12 gave the human one line: that the installed build will offer no right-click menu. For the first screen that is not known. The human's digest of 2026-11-28 says so under ADV-2026-11-28-09, and I say it again today. ADV-2026-11-27-44 is not changed. Where a record quotes its item 12, it is read with this item.

6. **OPEN-2 and the KNOWN-LIMITATIONS item.**
   - The architect's draft of ADR-037's amendment is received. I rule its words once, with the item, after the reviewer's read part, as ADV-2026-11-28-09 item 7 has it. Until then no word of either is committed.
   - Noted for the item: the worker's source 1 is wrong about where `chrome_for` is called. It is called in `setup()` before the window is looked up, and its value is moved into the closure. I check each source when I word the item.

7. **C-1 and D-1 to D-3** are the architect's words, for the worker under AUTONOMY §31 (d), and D-3 for an appended amendment of the form. I do not rule them. You hold them until the reviewer's read part, and differing words come to me (ADV-2026-11-27-10 item 2).

8. Nothing here is reserved. For the human, in the digest: the first gate's read found nothing wrong in the design; whether the first screen keeps the right-click menu cannot be told from the sources, and their own right-click settles it.
