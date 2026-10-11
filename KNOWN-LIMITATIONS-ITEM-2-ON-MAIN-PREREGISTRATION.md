# KNOWN-LIMITATIONS item 2 gains the human's on-main paragraph, and items 19, 20 and 22's cites are pinned — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline, ahead of its turn (the docs lane runs one piece at a time; this piece starts after the lane's piece b merges). The docs lane's third piece.

```
Authority: PLAN node known-limitations-item-2-on-main-paragraph; the human's instruction and paragraph (state/directives/2026-10-10-drift-sweep-area-e-instructions.md:7-9 @ 3d1864b5ce1f33f252ec3b653e109c4a27ec08a5 sha256:d8d4a0200ea5b1d647d8cfe7d764b4da0f2d3412be72adeba612020f4cfa4f2c); the docs lane's item c (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:25 @ 3d1864b5ce1f33f252ec3b653e109c4a27ec08a5 sha256:56cb96d34e98b986f98c5631f5913802a4d184de15f2a75af7ced0ecc8091922) under the lane's terms (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21 @ 3d1864b5ce1f33f252ec3b653e109c4a27ec08a5 sha256:a93e0c9428a9f0e4364020919fcc8d31054d4d7b1030ff36c55b628190063707); the custodian's check of finding 1 (state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:11-23 @ 3d1864b5ce1f33f252ec3b653e109c4a27ec08a5 sha256:bf53cbeb70773f93eac1dbbc654f4d46c4cd7c68c8c91b8529265e29688a4063) and finding 6 (state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:52-61 @ 3d1864b5ce1f33f252ec3b653e109c4a27ec08a5 sha256:68ce68eb84a752a4f168c329627aa222ce0dcf0f300f48fcc844705962b64b77); the node's reconciliation with the human's crs wording ruling (item 2's existing quote stays: KNOWN-LIMITATIONS.md is the v0.1.0 file). Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c found no prior art for known limitations on main paragraph; a miss, noted, not blocking.
Scope: KNOWN-LIMITATIONS.md only, in two places: item 2, which gains the human's paragraph after its existing text and its last source comment, and the source comments of items 19, 20 and 22; PLAN.yaml (this node's record); 2 files; declared line budget <= 30 changed lines by §21c's counting, this form excluded.
Change: the paragraph is line 9 of the instruction, byte for byte, its leading three spaces kept as item 2's continuation indentation, set off by one blank line; nothing in item 2 above it changes, its quote of the crs_undeclared message included. Each clause is checked again against the code at the PR's base; a clause found untrue there goes to the human before the merge and is not reworded. In items 19, 20 and 22's source comments, each cite the custodian's check found landing on unrelated code becomes a pin (path:line @ base sha256) of the line it means, found by reading at the base; nothing else in those comments or items changes.
Tests+mutation: none added or changed (documents only); the reviewer checks the paragraph's byte-copy by script, every clause against the code at the base, that each new pin recomputes and names the line its sentence means, and that no line outside Scope changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/ or scripts/plan, no code, no test, no string the app shows; a document is brought into line with code that does not change.
```

### Amendment 1 — the human's ruling on gate 1's C-1 (class 5)

*Written by the custodian after the reviewer's gate 1 (`state/consults/gates/2026-10-10-known-limitations-item-2-on-main-paragraph-gate1-reviewer.md`: C-1, E-1, D-1 and D-2) and the human's ruling, before the change. References only.*

1. **The ruling** is the human's item 1 (state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:6-8 @ e9beffe99d2c055845f3d4c230e0fd18c5ea5acc sha256:57f051f3c19df15d125ba23c73d15551f237dd487e0f38339bc2c4ac8894eb78): C-1 (A).
   - The paragraph stays as it is.
   - The two sentences of the directive's line 7 are appended at the paragraph's end, byte for byte by script, after one space, with that line's three leading spaces removed.
   - The Change line's "a clause found untrue there goes to the human before the merge and is not reworded" was followed: the clause went to the human, and these are their words.
2. **Scope** is unchanged: KNOWN-LIMITATIONS.md, 2 files, at most 30 changed lines. The paragraph's line changes in place.
3. **The records:**
   - The PR body's E-1 (every clause held), D-1 (the file count) and D-2 (`HEAD`) are corrected.
   - Worker report 1's claim that every clause held is corrected by a note appended to it. Nothing above that note is edited.
4. **The route** stays the single combined gate. The reviewer re-gates the change and the records.
5. **Generation:** the node goes to 2.
6. Nothing above is edited.

### Amendment 2 — the human's ruling on gate 2's C-1 (class 5)

*Written by the custodian after the reviewer's gate 2 (`state/consults/gates/2026-10-11-known-limitations-item-2-on-main-paragraph-gate2-reviewer.md`, C-1) and the human's ruling, before the change. References only.*

1. **The ruling** is the human's item 1 (`state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md`, lines 6 to 8).
   - The second appended sentence, from "The code is" to "opens it.", is replaced by the two sentences of the directive's line 7, byte for byte by script, with that line's three leading spaces removed.
   - The first appended sentence and the rest of the paragraph stay as they are.
2. **Scope** is unchanged.
3. **The gate:** the reviewer re-gates. If a clause is wrong, the human is told, and it is not reworded.
4. **Generation:** the node goes to 3.
5. **Superseded index:** Amendment 1 item 1's second appended sentence → item 1.

Nothing above is edited.
