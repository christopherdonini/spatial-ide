*Custodian's filing note (2026-09-27): gate 1, attempt 1 (architect), full gating, of ADR-034 filed Proposed, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ 208dd3bc2f4c298855f6c322377989be247b8176 (from the report's own first line; the full id from the branch). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ 208dd3b — **Verdict: FAIL** (text-only fixes; nothing blocks on principle)

The branch HEAD is 208dd3bc2f4c298855f6c322377989be247b8176, confirmed from the worktree reflog: commit 66107cc, then the merge of origin/main. I cite the ADR by section and point, and quote its text exactly as it stands at 208dd3b.

## Checks that pass

**1. Is the ruling carried faithfully?** Yes. I compared round 17 item 7 with the ADR:
- The typed answer in "The ruling" matches the RULED block byte for byte. An exact-string search finds the same span in both files. Under (a′) it needs no hash.
- Both riders are carried: the decision-3 rider in Decision 2's third bullet and Decision 4, the decision-1 rider in Decision 3.
- Treatments (a) and (b) are left to MP-1 (Decision 4, O1).
- No literal number appears.
- Publishing rides B3, and LOD stays out.

**2. Is it consistent with the constitution?** No sentence amends or contradicts an Accepted ADR.
- ADR-017 §3 and §4 stay untouched (Decision 10).
- ADR-010 rule 1 is correctly not enlarged. Decision 8 corrects the assessment's reading of `geometry_encoding` as rule 1's tag, and is consistent with ADR-016 §6.
- ADR-010 rules 2 and 6 are followed (Decision 6).
- SKP-V0 §1 `describe` ("runs no new query") is honoured by Decision 4(b).
- SKP-V0 §5 (message = `Display`) is honoured by "The ruling"'s reading paragraph.
- docs/01 principle 7 is applied to the whole-column count.
- ADR-006 class 1 and class 3 are placed correctly.
- ADR-004 (copy-minimized) holds, and no docs/08 claim is made.

**3. Does the Status line parse?** Yes. `docs/README.md`'s ADR-034 row reproduces it exactly. `adrIndex.mjs`'s HEADER_LINE and its test now read "(ADR-014 and ADR-031 today)".

**6. Record form.** Rulings are cited by round and item or by entry, with no line cites into the ledger. The one defect is F1.

## Findings

**F1 — fails by name (round 12 (b): "reproduced text without its … hash").**
- Exact text: "Decision 4's wording, as sighted, byte-copied by script from the assessment's §5 item 4 and marked so:"
- The reproduced passage comes from a file, not the ledger, so (a′) does not exempt it. It needs a pin, and it carries none.
- The content itself is correct: it matches `state/consults/2026-09-24-multipolygon-assessment.md` §5 item 4 byte for byte (95 bytes).
- Fix: append, contiguous on one line, `state/consults/2026-09-24-multipolygon-assessment.md:206 @ <main commit, e.g. 0ada14f> sha256:<hex>`, and say that it is a sub-line span carrying its line's hash. The reviewer recomputes the hash.
- The brief's "no line cites" rule yields here: round 12 (b) outranks the brief for this one passage.

**F2 — medium. The Status timing is weaker than the session order.**
- Exact text: "it is sought before MP-1's preregistration is written (the 2026-09-27 session order, `state/directives/2026-09-27-session-order.md`)"
- The order makes acceptance a precondition of the preregistration (paraphrase: MP-1's preregistration only after acceptance). "Sought before … is written" would let the preregistration be written while acceptance is still pending.
- It also silently departs from decision 8 as ruled ("acceptance at MP-1's gate"). The Status line should say that the session order moves that timing.
- Fix: "MP-1's preregistration is written only after the human accepts it (the 2026-09-27 session order, its MultiPolygon item — paraphrase; this replaces decision 8's recommended timing, acceptance at MP-1's gate)." The directive's filing note asks for the order to be cited with its paragraph, and this form does that.

**F3 — medium. The Consequences overclaim.**
- Exact texts: under **Polygon-only datasets.**, "Their stream IPC bytes and published partition hashes are unchanged."; under Publishing, "so nothing publishable today is lost".
- Both are false for an *undeclared* Polygon-only dataset. By the rider, an empty `geometry_types` now gets `geoarrow.multipolygon`. Its IPC bytes therefore change, and a projected one that publishes today is refused under Decision 10 until B3.
- Fix: scope the byte-identity claim to datasets declaring exactly Polygon. Name the loss: an undeclared, projected, Polygon-only dataset stops being publishable until B3. It gets a KNOWN-LIMITATIONS row, and whether the corpus and fixtures have none is for MP-1's P4 re-run to confirm.

**F4 — medium. The ADR contradicts itself.**
- Consequences says: "MP-1 adds the check, and the one internal shape of parts, then rings, per feature."
- "What this ADR does not decide" says: "The shell's rendering internals."
- Fix: "MP-1 adds the check; the shell's internal shape is MP-1's (the assessment recommends one shape, parts then rings)."

**F5 — low. An open item is missing.**
- Exact text, from Decision 4: "and MP-1 restates it as an engine fact."
- Round 17 item 7 sighted the `geo_metadata` wording, not the WKB-level wording. What the new WKB wording is, and whether the human sights it (the draft consult's O6), is absent from "does not decide". Add it there.

**F6 — low. Two more open items are missing.** Add both to "does not decide" or to "For the human":
- Decision 6's "pick ordinals, which are parts" depends on verifying against the installed `@deck.gl/layers` that one datum is one polygon (O7).
- The attribute seam (O8) is unaddressed. No shell attribute lookup exists, and B1's shell half is held by the session order. PLAN makes the node depend on `b1-engine-kernel-half` only. Whichever side lands second writes its seam against the other's merged interface, not an imagined one.

**F7 — low. Decision 8 misstates its source.**
- Exact text: "The new member lands with its §8 entry and with both-side fixtures in the same commit (`SKP-V0.md` §4 item 13)."
- §4 item 13 requires the §8 entry before merge (ii), and both-side fixtures in the same commit as each addition (iii).
- Fix: reword to state (ii) and (iii) as written.

**F8 — note.** "It binds nothing and is not architect-blockable until the human accepts it" implies that acceptance makes it architect-blockable. Under the ADR-016 and ADR-028 precedent that is the human's call at acceptance. ADR-035 used the same form, so this is a note, not a finding. Add one line to "For the human, at acceptance".

**F9 — note.** docs/01 principle 8 says every transform is "logged". Promotion is a transform. Either state that `describe`'s `encoding` plus `declared_types` is its record, or list the question for MP-1.

**4. Does anything bind MP-1 beyond the ruling?** No, once F4 is fixed. The Status line states that the ADR binds nothing until accepted. The other "MP-1 …" sentences are proposal content that becomes binding only when the human accepts.

**5. Completeness.** The ADR is complete once F5 and F6 are added.

No ADR skeleton is needed.

Files:
- C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md
- C:/dev/wt/adr-034/state/consults/2026-09-24-multipolygon-assessment.md
- C:/dev/wt/adr-034/state/consults/2026-09-27-adr-034-draft-architect.md
- C:/dev/wt/adr-034/state/directives/2026-09-27-session-order.md
- C:/dev/wt/adr-034/DECISIONS-PENDING.md
- C:/dev/wt/adr-034/docs/README.md
