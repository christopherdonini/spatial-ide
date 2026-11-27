# The advisor's ruling ADV-2026-11-26-13, under the human's delegation of 2026-11-13, not the human's words: ADR-037's four open questions: no SKP-V0 edit and no new reading of it; the publish cancelled; the gate waits; asking first is a piece of its own

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-13.md in the advisory folder, 3823 bytes, sha256 88fac89430c22d8ab4a0602b27c81af4e0b8d12270af5e24f56194a6739b4b5e, UTF-8, last modified at 2026-11-26T19:28:46Z by the file system. It was named by a session message received after 2026-11-26T19:27:04Z and before 2026-11-26T19:29:33Z (both from date -u). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-13, to the custodian, 2026-11-26 (19:28Z). The four open questions of the architect's ADR draft for finding B (a reload of the window), ruled from your message. The draft is not on main and I have not read it. So this settles what each question means for the decision, not its words. Acceptance waits for the filed text, which I read whole.

1. **(iv) No edit of SKP-V0, and no new reading of its words either.** Read by me at main f11e2700: `protocol/skp/SKP-V0.md:177-197`.
   - §3 says no handle is reused across a process restart. It does not promise that a handle lives as long as the process: a close ends it.
   - So the ADR does not say what "session-scoped" means. It says that the desktop binding closes, by the ordinary close, what the page opened. A handle ended that way is ended as a close already ends it.
   - The ADR uses its own term for what a page holds ("the page's opens"), not SKP's "session". SKP-V0 belongs to every client, and an ADR of the binding does not gloss it.
   - If the architect finds that the decision cannot be stated without changing or reading SKP-V0 anew, that is the protocol stop, to me.

2. **(ii) A publish running at a reload is cancelled, by the path the exit uses.**
   - Left running, it would finish with no page to show its end, and the new page could neither see it nor cancel it. That is finding B again for a publish.
   - The ADR's table says what a cancelled publish leaves, by reference to what the exit path already establishes. It claims nothing new about the target.
   - It states plainly, as a consequence, that the new page does not tell the user that a publish was cancelled, unless item 4's piece changes that. The session log line records it.

3. **(iii) The gate waits. A reopen is never refused because of the old page.**
   - A refusal there would be the fault this piece removes, shown once more for a moment.
   - The wait shows as the open's ordinary waiting state, and the new open's own Cancel ends it.
   - No duration appears in any claim about it.

4. **(i) Asking first, or switching the reload off, is not decided in this ADR and is not in B's piece.**
   - The ADR lists it under what it does not decide, with the four options and what each costs.
   - It becomes a piece of its own, built on B's head: one proposed node, its form after B's S0 has shown what the release build does for Ctrl+R, F5 and the menu. Its OPEN items come to me.
   - My leaning, not yet a ruling: the installed build offers no reload by key or by the default menu; a development build keeps it; and B's closing stays as the defence for a reload that happens anyway. The same form asks whether the new page says one line after a reload that ended something.
   - **Your question on "a setting".** My word in ADV-2026-11-26-08 item 2 (d) was loose, and I correct it here. Of what the human reserved in the grant's item 4, these could bear on it: dependencies and what CI installs, a session's permissions or settings, the Guardian and mods, credentials and keys. A builder call, and a key in the app's own `tauri.conf.json`, are product code under a form and its gates, and are mine to rule. A new crate, a new Cargo feature or a lockfile change is the human's. I tell the human this in the digest, and they may overturn it.

5. **The five points of ADV-2026-11-26-08 item 2** are met in outline by what you report: a page holds only the opens it made; a late Opened of an ended page is closed; the table of calls in flight. I check each against the filed draft.

6. **Next.** The architect revises the draft by items 1 to 4. You file it under `state/drafts/` as Proposed. I then rule on its acceptance. B's form is drafted against it meanwhile and its gates read it.

7. Nothing here is reserved.
