*Custodian's filing note (2026-09-27): gate 2, attempt 2 (architect), full gating, of ADR-034 filed Proposed, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ c533c40126163575e109b476a2fc6500c818483a (from the report's own first line and its ref reading). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ c533c40 — **Verdict: FAIL** (text only; one medium finding, nothing blocks on principle)

The branch ref and origin's ref both read c533c40126163575e109b476a2fc6500c818483a, taken from `.git/refs`. I read the worktree file at C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md. I have no Bash, so I could not run `git status`, and I assume the worktree matches the commit.

## 1. Attempt-1 findings

| Finding | State at c533c40 |
|---|---|
| F1 / B1 (pin) | Resolved. "The ruling" now carries the pin `…assessment.md:206 @ 6030dfd2814b sha256:ddae06db…4be3`, on one line, marked as a sub-line span that carries its line's hash. The hex matches, character for character, what the attempt-1 reviewer recomputed at 6030dfd. Line 206 in the tree still holds the same span, so the pin and the tree agree and no authority question arises. I could not recompute the hash myself (no Bash); the reviewer recomputes it. |
| F2 / B2 (timing) | Resolved. The Status line says "written only after the human accepts", names its MultiPolygon paragraph, and is labelled paraphrase. The README row matches it (exact-string search, 1 hit). |
| F3 (overclaim) | Resolved. Byte identity is scoped to datasets declaring exactly Polygon. The new "Undeclared Polygon-only datasets" consequence names the loss and gives it a KNOWN-LIMITATIONS row. See A1. |
| F4 (contradiction) | Resolved. Consequences now says "The shell's internal shape is MP-1's to choose". |
| F5 (WKB wording) | Resolved as O4. |
| F6 (deck.gl, seam) | Resolved as O5 and O6. O6 applies the seam rule correctly: whichever of the two lands second writes against the other's merged interface. |
| F7 (§4 item 13) | Resolved. Decision 8 now states (ii) and (iii) as SKP-V0.md:277–279 has them. |
| F8 (blockability) | Resolved. The Status line and "For the human" both leave it to the human. |
| F9 (principle 8) | Resolved in form, as Decision 3 plus O7. See L1. |
| S1 (second site) | Resolved. `buildLayers.ts:262` and `residentSet.ts:73` are the only two product callers of `checkPickCeiling`. |
| S2 (premise) | Mostly resolved. See L2. |
| N1, N2 | Resolved: "indistinguishable from an ordinary cross-tile duplicate"; the P6 reference is gone. |
| N3 (adrIndex.mjs writes on an unknown flag) | Not resolved. It is outside the diff, and I find no PLAN node or ledger line recording it. The custodian should record it (proposed node or S2). It is not an ADR defect. |

## 2. Ruling fidelity: passes

- **Passage 1.** Byte-identical to the bold answer in round 17, item 7 (entry 126). An exact-string search finds it once in the ledger and once in the ADR. Under (a′) it needs no hash.
- **Passage 2.** Byte-identical to the assessment's line 206. The `[...]` is in the source itself, so it is not an elision.
- **Both riders are carried:** Decision 2's third bullet, Decision 4 and Decision 3.
- **Nothing unruled is decided.** Each open matter stays open:
  - the choice between (a) and (b): Decision 4 and O1;
  - the literal: Decision 8, "No literal number is written here";
  - the shell's internals: Consequences and "Not decided";
  - the WKB wording: O4.
- **The placeholder reading** is disclosed under "For the human".
- **The three paraphrases** (session order, round 17 item 3, the holds) are labelled and faithful to `state/directives/2026-09-27-session-order.md` and the RULED block.

## 3. Constitution consistency

- docs/01 principle 7 applies to (b)'s count.
- ADR-004: no copy is claimed, and no cost is claimed.
- ADR-006: admission, promotion and `describe` are class 1. The publish refusal fires before any side effect, and nothing is called undoable.
- ADR-010 rule 1 is not enlarged (its tag is `frame`). Rules 2 and 6 are followed.
- ADR-016 §5 is cited for uniqueness, and §6's caution is respected.
- ADR-017 §3 and §4 are untouched.
- SKP-V0 §1 (`describe` runs no new query), §4 item 13, §5 and §8 are all respected.
- Decision 10's refusal is owned by the format and states only what a v1 bundle cannot carry, so the operator-text rule holds.
- The undeclared-dataset consequence is correct. `preflight_pinless_parts` (kernel/src/publish/mod.rs:446–475) checks nothing about geometry type today, so a projected dataset with an empty `geometry_types` and only Polygon rows publishes today, and point 10 would refuse it.

## 4. MP-1 binding and open items

- Nothing binds MP-1 beyond the ruling while the ADR is Proposed. By the session order, MP-1's preregistration waits for acceptance, and the acceptance is the human's.
- O1–O7 plus "Not decided" cover every item on the drafting consult's O1–O9 list except one fragment, noted as L4.

## 5. Record form: passes

- Rulings are cited by round and item, by entry, or as RULED (night) item (2). There is no line cite into the ledger.
- No typed quotation appears outside the two script-filled passages.
- There is one pin, at 6030dfd, which is on main by the filing note.
- The session order is tracked on main. `0ada14f` is on main.
- None of round 25 item 2's by-name failures applies.

## Findings

**A1 — medium (FAIL). "For the human, at acceptance" does not flag a loss that contradicts the reasons given for two ruled decisions.**
- The reasons behind the rulings: the assessment's §5 recommended decision 5(b) on the ground that nothing is lost today, and decision 3 on the ground that no corpus or fixture file declares an empty list (paraphrase of `state/consults/2026-09-24-multipolygon-assessment.md` §5, items 3 and 5). The human ruled all eight "as recommended".
- What the ADR says now:
  - "A projected dataset of that kind, which publishes today, is refused by point 10 until B3. That is a named loss"
  - "Whether any corpus file or fixture declares an empty list is for MP-1's P4 generator re-run to confirm."
- The problem: this new fact bears on the choice between (a) and (b) in decision 5, a red-line decision. Consequences states the loss, but the acceptance list flags smaller departures (the §5/§7 cite) and not this one.
- Fix: add one bullet to "For the human, at acceptance". It should say that decision 5 was recommended on the basis that nothing publishable is lost (paraphrase), and that under the rider and point 10 a projected, undeclared, Polygon-only dataset that publishes today is refused until B3 (Consequences, "Undeclared Polygon-only datasets"). It should also say that whether any such file exists in the corpus or fixtures is MP-1's P4 re-run to confirm. No typed quotation.

**L1 — low. O7 treats principle 8 as optional.**
- Exact text: "Whether the promotion also needs a logged entry beyond `describe`'s `encoding` and `declared_types` (`docs/01` principle 8)."
- Principle 8 requires every transform to be "explicit, logged, and inspectable". docs/01 outranks this ADR, so whether promotion must be logged is not an open question.
- Fix: "**O7.** How principle 8's 'logged' is met for the promotion — whether `describe`'s `encoding` and `declared_types` discharge it or a separate log entry is needed."

**L2 — low. Decision 6 states part-level picking as fact before the premise that supports it.**
- Exact text: "A GPU ordinal resolves ordinal → part → row → id."
- This bullet comes before "*Premise, pending open item O5:*", but it only holds under that premise.
- Fix: prefix it with "Under the premise below," or move it inside the premise bullet.

**L3 — note.** The Status line reads the session order as replacing decision 8's timing ("that order replaces decision 8's recommended timing"). That is the ADR's reading: the order is compatible with "acceptance at MP-1's gate" if that phrase means the gate on the preregistration. Consider listing the reading under "For the human".

**L4 — note.** The drafting consult's O7 paired the deck.gl check with a disclosed heap cost for the per-part arrays. The ADR keeps "unmeasured heap cost" (Consequences, `docs/08`) but does not say who discloses it. Consider "MP-1 discloses it" to match the stream-bound sentence ("MP-1 declares them").

No ADR skeleton is needed.

Files:
- C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md
- C:/dev/wt/adr-034/docs/README.md
- C:/dev/wt/adr-034/DECISIONS-PENDING.md
- C:/dev/wt/adr-034/state/consults/2026-09-24-multipolygon-assessment.md
- C:/dev/wt/adr-034/state/directives/2026-09-27-session-order.md
- C:/dev/spatial-ide/state/consults/2026-09-27-adr-034-draft-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-09-27-adr-034-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-09-27-adr-034-gate1-reviewer.md
- C:/dev/wt/adr-034/kernel/src/publish/mod.rs
- C:/dev/wt/adr-034/protocol/skp/SKP-V0.md
