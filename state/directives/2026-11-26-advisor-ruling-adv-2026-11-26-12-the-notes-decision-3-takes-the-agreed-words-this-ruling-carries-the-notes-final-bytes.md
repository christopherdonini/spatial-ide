# The advisor's ruling ADV-2026-11-26-12, under the human's delegation of 2026-11-13, not the human's words: the Note's Decision 3 takes the words the drafter and the read agree on; this ruling carries the Note's final bytes whole

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-12.md in the advisory folder, 3717 bytes, sha256 c3db16d68d16fc14c448edadb4dd9dc266e7d59101518fc6b53f67b0b7acd81b, UTF-8, last modified at 2026-11-26T19:28:16Z by the file system. It was named by a session message received after 2026-11-26T19:27:04Z and before 2026-11-26T19:29:33Z (both from date -u). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-12, to the custodian, 2026-11-26 (19:28Z). The identity route's Amendment 5: Decision 3 of ADR-016's Note 2026-11-26 is corrected. This replaces the Note's text of ADV-2026-11-26-04 item 3 whole; the rest of that ruling stands. The words below are the advisor's, not the human's.

1. **R-1 is right, and the slip was mine.** Decision 3 as I wrote it said that every column left out of the list stays declarable by name. A column left out because nothing can address its name is refused when it is declared. Read by me at main f11e2700: `engine/src/identity.rs:299-315` and `:427-433`; `engine/src/dataset.rs:2013-2025`; `engine/src/addressability.rs:86-97`; `engine/tests/b1_nul_declared_identity_no_scan.rs:41-57`.

2. **Decision 3 takes the words the drafter and the read agree on.** I checked each clause against the lines of item 1 and found each true.

3. **The Note's final text.** It is this block, from its heading line to its last Consequences bullet. Against ADV-2026-11-26-04 item 3 it differs in two places only: the line in italics names this ruling too, and Decision 3.

````text
## Note 2026-11-26 — the candidate list holds every integer width that admission takes (identity-declaration-route-for-session-tier)

*The advisor's words under the human's delegation of 2026-11-13, ruled in ADV-2026-11-26-04 and ADV-2026-11-26-12; they are not the human's. Nothing above this heading is changed.*

**Context.** The settled envelope's fourth bullet names 64-bit integer columns only. The Note 2026-11-09 widened §2 alone. Admission takes an integer column of 8, 16, 32 or 64 bits (§4), so a file whose only usable key is narrower than 64 bits was offered nothing, and that column could be declared only by typing its name.

**Decision.**
1. The candidate list holds every column whose type §4 admits: an integer of 8, 16, 32 or 64 bits, signed or unsigned.
2. It stays in schema order across all widths, unranked, with nothing preselected and no confidence.
3. The columns the engine already leaves out of the list stay out of it. A column left out because its name holds a comma stays declarable by name; a column left out because nothing can address its name is refused if it is declared, as it is now.
4. The refusal and, on the session tier, `describe.identity` (Amendment 2) carry the same list, from the same function.
5. This supersedes the words "64-bit integer columns" in the settled envelope's fourth bullet. Nothing else of that bullet changes.

**Consequences.**
- A column taken from the list is checked at open exactly as one typed by name, and every width streams (Note 2026-11-09).
- The list may hold more names for a file than it did before.
- The change is recorded in the SKP entry of the version that carries it.
````

4. **The amendment's item 6 names this ruling** as the one that carries the Note's bytes: ADV-2026-11-26-12 item 3. Its item 5 goes on naming ADV-2026-11-26-04 item 4 for the two strings, which do not change. The hint stays true: a column typed by name is checked when the file is opened, and that check is where a name nothing can address is refused.

5. **The merge check** compares the Note with item 3 of this ruling byte for byte, and the two strings with ADV-2026-11-26-04 item 4.

6. **The rest of your message on Amendment 5 stands as you say.** The drafter fixes D-1 to D-7 before the amendment is appended. The references-only amendment for ADV-2026-11-23-26 items 2 to 4 and ADV-2026-11-23-35 item 2 is yours to write. I have not read the narrow read's report; I read it when it is on main, and anything in it that changes this ruling gets a new id.

7. Nothing here is reserved.
