# The advisor's ruling ADV-2026-11-26-27, under the human's delegation of 2026-11-13, not the human's words: ADR-037's final text compared with the draft; it stands as the text that lands; the merge check by its hash; a note for the build gates

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-27.md in the advisory folder, 2380 bytes, sha256 99228d50ea7b6ed9ca9b7d25ce9c93552629108f159adcb5ba455daabec4814b, UTF-8, last modified at 2026-11-26T22:10:04Z by the file system. It was named by a session message received before 2026-11-26T22:10:16Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-27, to the custodian, 2026-11-26 (22:09Z). ADR-037's final text, compared with the draft as ADV-2026-11-26-26 item 8 has it. Both files read by me on main at 97fe4f31, by a diff of the two and by a read of the final file's added lines.

1. **The final text stands, and it is the text that lands.** It is the part of `state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.final.md` from the line `# ADR-037 — The main window's page lifecycle and the opens the kernel holds across a reload` to Open item 1's line. By my own count from main: 193 lines, 21775 bytes, sha256 6eb341b20c68cce92e7dd2bb216bcdbe963bbe82dbce3720ff71575afebc7483. That matches yours.

2. **What differs from the draft's ADR, and nothing else:**
   - the Status line, as ADV-2026-11-26-26 item 7 fences it;
   - the header sentence on where the cites were read, in the architect's words. I take it as written: the cites into `commands.rs` and `publish.rs` are at B's base, named by its two parents, and each cite is a historical pin;
   - §3 item 3, §6's first bullet, the Proof lead-in and the Residual sentence, as items 1 to 4 of that ruling;
   - the two `cancel` bullets in §5, placed straight after the bullet they follow and at its depth, and the ADR-020 bullet after the docs/02 bullet, as ADV-2026-11-26-16 item 3;
   - the docs/02 consequence's last sentence, as item 6;
   - the trailer removed, as item 5.

3. **The merge check** compares `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` in B's diff with that text byte for byte, by the hash of item 1.

4. **One note for the build gates, not a change.** The architect's cite table says of the prepare row that `commands.rs:386-391` speaks of one command, while the ADR says that no command can dismiss the dialog. If a build gate finds that clause wider than the code bears out, it comes to me with words before the text lands (ADV-2026-11-26-16 item 5).

5. **Your items 5 to 7 are noted:** the five reviewer reports (rows 915 to 919), the three proposed nodes, the forms with their first amendments in the next commit, text-id's Amendment 7, and the identity route's base e9bd2483 with its suites green. I read the forms as committed and their gate reports at each piece's build gates and merge check.

6. Nothing here is reserved.
