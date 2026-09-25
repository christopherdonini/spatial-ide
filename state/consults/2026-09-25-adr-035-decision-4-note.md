*Custodian's filing note (2026-09-25): the architect agent's consult for PLAN node `adr-035-decision-4-note` (RULED 2026-09-25 — question round 22, item 1), filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. Section 1's note is appended to ADR-035 on `docs/adr-035-decision-4-note` (ad08c1c), its marker filled by script from the RULED block's item 1 span. Stop items S1–S4 are carried to the human's next round.*

---

**Verdict: pass with notes.** The ruling can be recorded as a pure append to ADR-035. Nothing above the note changes, including the Status line. Four points in the stop list are not settled by the ruling. None of them blocks this note.

## 1. The note to append to ADR-035

**Where it goes:** at the end of `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, after the Acceptance section's last paragraph (the one ending "…dated 2026-09-24."), with one blank line before it. This follows ADR-021's "Note 2026-09-24" precedent. An end-of-file append shifts no line above it.

```
## Note 2026-09-25 — Decision 4's mint rule: every generation carries a session reference

*Appended on the human's ruling of 2026-09-25 (`DECISIONS-PENDING.md`, RULED 2026-09-25 — question round 22, item 1; a red line, answered in typed text). The text above is unchanged, the Status line and the Acceptance section included. The human's words are recorded verbatim below, byte-copied by script from that item and marked so.*

*"[RULING — byte-copied by script]"*

1. **The invariant joins Decision 4's mint rule.** The ruling's `SessionRef` is Decision 4's session reference. Decision 4's mint per successful `open_dataset` stands, and the ruling adds the reference that no client holds. Every end's event therefore carries a `session`; the member is never absent.
2. **Read with this note:** Decision 3's bullet on a generation with no session reference, whose open payload form the ruling settles; the matching item of "What this ADR does not decide"; and Decision 5's drop on a mismatch, which the ruling makes a logged drop.
3. **Not settled here:** the close race that mints such a generation (Decision 3's bullet names it). The same item places it at PLAN node `kernel-generation-close-races`.
4. The watcher piece (PLAN node `engine-source-change-watcher`) implements this note with Decision 4.
```

**Filling the marker:**
- Replace only the marker text between the quotation marks. Copy the span inside the bold quotation marks of round 22 item 1 in the RULED 2026-09-25 block.
- The `*"…"*` wrapper stays outside the copied span, as in ADR-035's Acceptance section.
- Add no backticks inside the span (`SessionRef` and `open_dataset` appear there bare).
- **Why the whole answer is reproduced:** its last sentence qualifies the invariant: "the unheld reference only makes it harmless meanwhile". Cutting that sentence would remove a qualifier, which round 11's elision rule forbids.
- **Why reproduction is allowed at all:** the note exists to record the ruling in the ADR. ADR-035's Acceptance section is the precedent.
- The intro sentence avoids "Appended <date>" on purpose. PR #119's architect should-fix (gate-log node `adr-035-acceptance`, attempt 1) found that form untrue as written.

## 2. A matching note in `SKP-V0.md`: recommend none from this piece

- Main's `SKP-V0.md` does not yet define the event, its payload or the session reference. They arrive with `skp/0.5` in the watcher piece (ADR-035 Decision 6).
- A note that the `session` member is never absent would describe a member the specification does not have yet.
- The member being required is a field-set fact of `skp/0.5`, not a clarification of an earlier entry. It belongs in the watcher's §8 `skp/0.5` entry and its both-side fixtures. The watcher preregistration's §2c already types it as `session: SessionRef`, not optional.
- The one open `SKP-V0.md` question is S1 below. If the human rules a clarification is needed, that is a separate dated §8 note on its own ruling, not this piece.

## 3. Gating: full gating confirmed

It is full gating under `AUTONOMY.md` §21a on two counts: the first bullet ("an ADR amendment") and the fourth ("a stated guarantee or invariant"). Reviewer and architect must both give an affirmative PASS.

§21a also says a fully gated piece "carries the full preregistration shape". In the state records I read, I found no preregistration for PR #119, the precedent piece. The custodian should either supply one or name the precedent that let the filed consult stand in for it. I have not verified which.

**What the reviewer must check mechanically (LF bytes, three-dot diff against `origin/main...HEAD`):**
1. The ADR-035 diff is additions only, after the file's former last line. Every byte above is unchanged, the Status line included. `npm run verify:adr-index` (in `frontends/shell`) passes with the index row unchanged.
2. The reproduced span equals round 22 item 1's span inside the bold quotation marks in the RULED block, byte for byte, compared by script. The wrapper is outside the span.
3. No line cite into `DECISIONS-PENDING.md` and no bare self-line. The ruling is cited only as round 22, item 1, resolved against the RULED block.
4. Each reference resolves:
   - Decision 3's bullet "A generation with no session reference still emits";
   - the payload-form item of "What this ADR does not decide";
   - Decision 5's drop on a mismatch;
   - PLAN nodes `kernel-generation-close-races` and `engine-source-change-watcher` in `PLAN.yaml`.
5. The dates are true: the heading's 2026-09-25 is the ruling's date, and the note carries no "Appended <date>" claim.
6. Run `verify-quotes`, `verify-cites`, `verify-test-claims` and `verify --offline`, plus CI's `node --test` scripts suite. Any record statement about their output names the tool's commit (round 15 (c)).
7. The file stays LF (no CRLF). The note contains no "done" or "discharged" clause.

## 4. Stop list (not settled by the ruling; not resolved here)

- **S1 — the per-open reading.** Round 21 item 1 confirmed Decision 4's reading for "an opaque, per-open" reference. The `SKP-V0.md` §8 rider-(c) note also names "minted per open" as a condition, and says a reference that fails any condition "gets no clarification from this note". A reference minted for a generation outside `open_dataset` is not minted per open, and it is a second reference for an open that is closing. Whether it stays outside `skp/0.3`'s no-generation-value rule is not ruled. The note above claims nothing either way. This matters for the watcher's `skp/0.5` §8 entry, and possibly for a second dated §8 note, which would be the human's.
- **S2 — how the unheld reference is minted.** Decision 4's "from the OS CSPRNG and never reuses it" is written for `open_dataset`'s mint. The ruling says only "kernel-minted" and "no client holds". Whether the unheld reference uses the same source and never-reuse rule is not stated. The watcher preregistration's single `SessionRef` type implies it; the ruling does not say it.
- **S3 — what the log line contains.** The human's words require a logged line, "never silently". The custodian's Applied line adds that the line "carries no reference", citing round 21 item 1, rider (b). That treats a log line as "persisted or published", which is the custodian's reading, not the human's words. The line's other content (the reason) is set by the watcher preregistration's Amendment 1 item 2.
- **S4 — `SKP-V0.md` §3's third minting rule.** Decision 4 words it for a value that "only names a kernel-side session to its holder". An unheld reference has no holder. Whether §3's text covers it is for the watcher piece's §3 wording. The ruling does not word it.

**Files:**
- `C:\dev\spatial-ide\docs\adr\ADR-035-dataset-session-ended-control-plane-event.md`
- `C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md` (the Note 2026-09-24 precedent)
- `C:\dev\spatial-ide\protocol\skp\SKP-V0.md` (§8, the rider-(c) note)
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (RULED 2026-09-25 — question round 22, item 1)
- `C:\dev\wt\source-change-watcher\engine\SOURCE-WATCHER-PREREGISTRATION.md` (§10 Amendment 1; §2c)
- `C:\dev\spatial-ide\state\consults\2026-09-24-adr-035-acceptance-drafts.md` (the fill and placement precedent)
- `C:\dev\spatial-ide\AUTONOMY.md` (§21a)
