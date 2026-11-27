# The advisor's ruling ADV-2026-11-23-26, under the human's delegation of 2026-11-13, not the human's words: ADR-016's Amendment 2 accepted with its words; D1 to D4 ruled; the identity route's code may start, with the protocol/ place, order A, skp/0.15

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-26.md in the advisory folder, 6933 bytes, sha256 dd1d38d3c9c8998f1b8c4bf88cf0f754303ceeefc80e8f6e0b53103078fdb562, last modified at 2026-11-23T20:01:34Z by the file system. The advisor's message naming it was received at 2026-11-23T20:01:42Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-26, to the custodian, 2026-11-23. The piece `identity-declaration-route-for-session-tier`: the words of ADR-016's Amendment 2, the texts D1 to D4, and when its code starts. Read by me on main at 55969f98: the form's section 2 item 6 (D1 to D4), its Amendment 2 items 1 (end) to 4 with the ADR draft, its Amendment 4 items 1 to 6; the gate's report of attempt 2 (`state/consults/gates/2026-11-23-identity-declaration-route-for-session-tier-form-gate-architect-attempt-2.md:45-98`), which reads the draft true against the code and the ADR; ADR-016 lines 146 to 246; `governance/forms/engine/ADMISSION-PREREGISTRATION.md:67`; KNOWN-LIMITATIONS item 3; `frontends/shell/src/admission/IdentityDeclarationForm.tsx:47-52`. I read no engine or kernel code: for the code I rely on the gate's clause checks.

1. **ADR-016's Amendment 2 is accepted with the words below.** This ruling is its acceptance. It is the architect's draft with two changes, both raised by the gate: the italic line no longer says Proposed, and the Context names items 1 and 5 of Amendment 1. It is appended after the Note 2026-11-09, and no line above it is edited. The text, from the heading to the acceptance line:

````text
## Amendment 2 — the session tier's candidate list, carried on `describe.identity` (2026-11-23, appended — Accepted)

*Appended under the human's delegation of 2026-11-13, by the advisor's ruling named in the acceptance line below. The words are the architect's draft as that ruling changed it; they are not the human's. Nothing above this heading is changed.*

**Context.** The settled envelope places the candidate list in the refusal and not in the record, the record being `describe.identity` (the SETTLED block, its fourth bullet). Amendment 1 (items 1 and 5) then admitted a single file with no admissible identity column on the session tier, so on that path the refusal that carried the list no longer fires. The engine still records the list on the session tier, for the reason the admission preregistration gives (`governance/forms/engine/ADMISSION-PREREGISTRATION.md`, R-I3), but no client receives it, so an operator offered a declaration has no list to choose from.

**Decision.**
1. On the session tier alone, `describe.identity` carries `candidate_columns`: the same list the refusal carries elsewhere, from the same engine function, in schema order, unranked, unpreselected and with no confidence. It may be empty.
2. On a native or a mapped identity the member is present and null. There the refusal carries the list, as the settled envelope says.
3. The list names what a caller may declare; it is never a declaration and never a recommendation. Nothing is inferred from it (§3), and no client ranks it or preselects an entry.
4. Which columns are candidates is not changed by this amendment, including the columns the engine already leaves out of the list.
5. A column declared from the list is a declared mapping under §3 to §7 and Amendment 1 item 6, verified over the whole file at open.

**Consequences.**
- One member on `describe`, a control-plane reply, and a new SKP literal.
- The engine's accessor for the list gains `describe` as its product caller and is no longer an instrument.
- A column the engine leaves out of the list for the refusal's sake (a name that holds a comma) stays out of it here, so both carriers carry the same list; such a column remains declarable by name.
- Nothing is added to what a project saves.

**Not decided here.** Composite and non-integer keys; the data doctor's proposal; a declaration route for a dataset that a project reopened.

**Acceptance (2026-11-23).** Amendment 2 is accepted by the advisor's ruling ADV-2026-11-23-26, item 1, under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 2, which names ADR amendments). Its text is the Proposed draft of `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md`, Amendment 2 item 2, read by the architect's form gate (gate-log row 878), with two changes that ruling makes: the italic line, and "(items 1 and 5)" in the Context. The human can overturn the ruling, and their own message wins.
````

2. **The texts D1 to D4 are ruled as drafted.** The gate read each true. They are the advisor's words, not the human's.
   - D1: `Declare an identity column…`
   - D2: `Declaring opens this file again with the column you choose and checks that column across the whole file. The filter and the selection are cleared and Colour by ends; the rest of the style is kept. If the column is refused, the file stays open as it is now.`
   - D3, with the gate's words under C1: `Declaring an integer column checks it across the whole file for uniqueness when the file is opened. A column whose values repeat, or that holds a negative value, is refused only after that scan, so a retry is not free. The declaration lasts while the file is open; a project saved afterwards records it, and opening that project checks the column again.`
   - D3 does not name the column that is empty in some row. No test pins that case, so the string does not claim it. The source comment names it, with the name that holds U+0000.
   - D4 replaces one sentence of KNOWN-LIMITATIONS item 3, the one that begins "The app does not yet offer a way to declare", with: `For a file that opened this way with Open GeoParquet, the app offers to declare an identity column beside the Open buttons. Declaring opens the file again: the filter and the selection are cleared and Colour by ends. A project saved before the declaration is not carried over: the next save asks for a folder. A file that a project reopened on this tier is not offered the declaration.` The rest of the paragraph is the human's and is not touched. The item's comment says which sentences are the advisor's.
   - The placeholder mark and the human's sight of new strings stay as the migration plan's rule 7 and the form have them.
   - D4's variant for a dataset that Recover opened is not ruled here. If the recovery offer is built on this piece, that sentence is the recovery offer's to change, and its draft comes to me then.

3. **The code may start from this ruling.** It takes the `protocol/` place now, ahead of the recovery offer, whose form has not passed: order A, `skp/0.15`. For `App.tsx` it follows ADV-2026-11-23-25 item 2.

4. **The merge.** Confirmed as the form's section 8 base line has it: this piece merges after every piece its base takes in. If milestone 5's PR A is not in its base, PR A is built on this piece's head and merges after it.

5. **At the merge check** I compare the ADR's appended text and D1 to D4 with this file byte for byte. A difference is a HOLD.

6. Nothing here is reserved. I tell the human of items 1 and 2.
