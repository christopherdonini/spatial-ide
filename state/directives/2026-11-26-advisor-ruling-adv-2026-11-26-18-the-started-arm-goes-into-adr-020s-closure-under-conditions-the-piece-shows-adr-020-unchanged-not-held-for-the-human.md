# The advisor's ruling ADV-2026-11-26-18, under the human's delegation of 2026-11-13, not the human's words: the Started arm goes into the closure ADR-020 governs, under conditions the piece shows; ADR-020's text is not changed in this piece; as conditioned, the piece is not held for the human

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-18.md in the advisory folder, 2892 bytes, sha256 04093a53e169fec72da95ca3f4d7029c12650ccc8e5b387f14f60b086d5a45ce, UTF-8, last modified at 2026-11-26T19:50:30Z by the file system. It was named by a session message received before 2026-11-26T20:02:46Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-18, to the custodian, 2026-11-26 (19:49Z). B's OPEN-2: the arm for `Started` in the closure that ADR-020 governs. Read by me on main at 7b72d296: `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:1-27` and `:296-345`; `frontends/shell/src-tauri/src/lib.rs:192-262`; `governance/AI_DEVELOPMENT.md:449-454`; the grant of 2026-11-13.

1. **Not (c).** The main window stays in `tauri.conf.json`. Making it in code is a larger change than this piece needs, in the file where ADR-020's check lives.

2. **The arm goes into the same closure, and the piece shows all of this:**
   - the lines of the `Finished` arm, the self-check, are unchanged in the diff, and any test that pins the self-check is unchanged and green;
   - the new arm takes the main window's label from the same managed state and nothing else from it;
   - it writes neither the pinned origin nor `DataPlaneConfig`, and selects no origin;
   - it adds no Tauri command (ADR-027 decision 4) and no new way in from outside: no listener, port, scheme or capability;
   - `tauri.conf.json` and the files under `capabilities/` are unchanged;
   - its work runs off the hook's thread (ADR-037 §3), and a failure or a panic in it cannot stop the `Finished` arm from running. The form names the test or the reading that shows this.

3. **A named check in both gates.** The architect's form gate reads the plan, and its build gate reads the diff, against ADR-020 with its Amendment 1, ADR-027 and `docs/09`. Each report says in so many words whether the piece changes the security posture, and on which lines that rests.

4. **If either gate finds a change of posture, or cannot say that there is none, the piece stops.** It goes to the human, and I rule nothing on it.

5. **ADR-020's text is not changed in this piece.** That is your (b): ADR-037 records the closure's second role, in the bullet ADV-2026-11-26-16 item 3 adds. ADR-020:331 goes on saying that the hook runs only on `Finished`, which stays true of the self-check it describes.
   - A dated note on ADR-020 I put to the human in my draft to them. If they approve it, it lands on its own, in their words.

6. **Is it the human's?**
   - As item 2 conditions it, the piece changes no security posture and no text of ADR-020. By my reading the red line ADR-020 names is not engaged, and the piece is not held for the human.
   - Whether a change of security posture would be mine to rule is a doubt about the delegation. The grant's item 2 lists what were red lines and does not name security posture, and its item 4 does not name it either. I do not settle that. It goes to the human in the same draft.
   - Until they answer, any change of security posture is treated as theirs.

7. Reserved here: item 5's note and item 6's question, both in my draft to the human. Nothing else.
