*Custodian's filing note (2026-10-11): the author's one check of the human's own words for milestone 3's OPEN-9 (i) (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md`, item 5; the 2026-10-11 direction, item 2b), by the architect that drafted the form, resumed by message on the human's words byte-copied; its hand-back at 20:25:27Z by its transcript. It arrived as a message and is extracted here by script from the agent's second SubagentHandback call, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is ee4758e4837bce6d7a45cd7485a90e76b40f327f6811bf8d8efbd0f6ad32c062. Write audit PASS: zero write calls over the agent's whole transcript.*

---

# Milestone 3 OPEN-9 (i): the human's words, one check — architect

I read the committed form `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md` in the working tree, which you say is main c9d0c915; I did not check the commit id myself. The human's words are as you relayed them. The standard is item 2c: what an operator can observe in the shipped app.

**Clause 1: FAIL.**
> A filter condition that is not a simple comparison, IN, BETWEEN, LIKE or IS NULL is kept whole as one card

- **"kept whole as one card" holds.** §2.5 says nothing is rewritten, trimmed or case-folded, and each card is sent byte for byte (UC3).
- **The list of exceptions does not.** §2.5's recognizer also marks these forms as simple:
  - `IS [NOT] NULL`, so IS NOT NULL;
  - `[NOT] IN`, so NOT IN;
  - `[NOT] BETWEEN`, so NOT BETWEEN;
  - `[NOT] LIKE` and `[NOT] ILIKE`, so NOT LIKE, ILIKE and NOT ILIKE.
- **Read as written, the sentence puts all six with the conditions that must stand alone.** In the shipped app they combine with other cards (UC5: simple next to simple is proposed).
- **Ordinary use reaches this.** Row Y3's second card, `"zone" IS NOT NULL`, combines with `"zone" = 'residential'`. An operator who believes the sentence expects that card to be refused, and the app accepts it.
- **"simple comparison" is also loose.** §2.5 counts a comparison as simple only when it compares a name with a literal. `a > b`, or a literal on the left, is kept alone. I note this; the failure stands on the negated and ILIKE forms alone.

**Clause 2: PASS.**
> and can be used only on its own.

- Under OPEN-3 (A), §2.5's `proposeClauseChange` refuses two things: an advanced clause while any other card is on, and any clause while an advanced card is on.
- UC5 and RC7 test this, and E-ADV and row Y6 show it.
- A card that is off blocks nothing, which fits "on its own".

**Clause 3: PASS.**
> To use it together with other conditions, write them all as that one condition.

- One card holding several conditions is one text. The recognizer finds no simple form in it, so it is an advanced card.
- With only that card on, `combineClauses` sends its text byte for byte (§2.5; UC3). The kernel admits or refuses that whole text, as it does any predicate.
- So following the instruction gives the combined filter.
- One gap the sentence does not mention: the other cards must be off or removed first, or the new card is refused (UC5). The app's own refusal line says to turn them off. The instruction is incomplete, not false.

**Verdict: FAIL on clause 1.** Its list of exceptions leaves out IS NOT NULL, NOT IN, NOT BETWEEN, NOT LIKE, ILIKE and NOT ILIKE. The form's recognizer treats all six as simple, so they combine with other cards, as row Y3's `"zone" IS NOT NULL` card shows.

Under item 2b my drafted words would now land, but they open with the same list and fail clause 1 in the same way. Item 2b allows no third round, so I propose no words; what lands is for you and the human to decide.
