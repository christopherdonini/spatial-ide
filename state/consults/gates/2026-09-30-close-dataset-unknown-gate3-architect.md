*Custodian's filing note (2026-09-30): the architect's gate 3 on PR #150, scoped to correction round 2 (the form's Amendment 3), for PLAN node `kernel-close-dataset-unknown-keeps-openrecord` at g1. Reviewed: main @ 1980b1d (form) / cut/close-dataset-unknown @ 094a21d (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 22:32:53Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Items 1 and 2 pass. Its item 3 names one remaining record defect (no superseded index, round 12 (e)) and, under the record cap, supplies the reduction: the block it quotes is appended to the form's §10 byte for byte, without the quotation markers. Profile paths redacted at filing: none.*

---

Reviewed: main @ 1980b1d (form) / cut/close-dataset-unknown @ 094a21d

**Verdict: pass with notes.** Items 1 and 2 pass. One record defect remains (no superseded index). The architect's reduction below fixes it, and after that the piece lands.

**1. Amendment 3 item 1 against my gate-2 B1: PASS.**
- The pin is written as `path:11 @ dd912f7 sha256:<hex>` on one line (round 15 (d)).
- It names itself a sub-line span and says the hash is over the whole line (round 12, item (b), hash form).
- dd912f7 is on main and is not the citing commit (round 14, item (a′); round 15 (e)).
- By my read, the quote matches line 11 of the current tree byte for byte. The reviewer recomputes the hash.
- Note: the row states how the quote was matched (a fixed-string `grep`, one hit), not how it was copied. The match is the part a gate can check, so under the record cap it is enough.

**2. Items 2 and 3: PASS, class 3 is right.**
- Item 2 only adds a pointer. The consult's §7 exists and covers the rustfmt reading.
- Item 3 corrects a description, not a claim: §7 and Scope stand. The "(127 of 150)" repeats the gate-2 reviewer's check 3. That is tolerable, but a reference to that check would have carried it.
- Items 1 and 2 are single sentences and item 3 has none past its row, so all are under the ceiling of three (round 12, item (d)).

**3. Remaining defect: round 12, item (e).** Neither correction round ends with a superseded index. §1 still reads "by any outcome" with nothing in the record pointing the reader to Amendment 1. Gates 1 and 2 missed this; the miss is mine. The smallest reduction is one appended block, references only, with no claim changed:

> ### Superseded index (as of Amendment 3) — read this amendment first
> - §1 May claim, §2 item 2, §5 Falsification's first clause: superseded by Amendment 1 items 1–3.
> - §4's M2 registration: supplemented by Amendment 2 item 3.
> - Amendment 1 item 2's "one comment line": superseded by Amendment 3 item 3.
> - §9's `cargo fmt --check`: read per Amendment 2 item 2.

**Also before merge (not record):**
- The gate-2 reviewer's N2: read the CI runs at 094a21d.
- §8 item 13: a merge commit, not a squash or rebase.

Paths:
- C:\dev\spatial-ide\kernel\CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\gates\2026-09-30-close-dataset-unknown-gate1-architect.md
