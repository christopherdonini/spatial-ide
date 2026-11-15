Reviewed: PR #271 at 5ff86b13fcca3854eed89076426f30fb1a37f9b8, gate 1, architect (cut/adr-020-appended-note @ 5ff86b13fcca3854eed89076426f30fb1a37f9b8)

Verdict: PASS WITH NOTES

I have no shell, so I computed no sha256, ran no git, and could not see the PR body or CI. I checked files in two places: the head, through the worktree `C:/dev/wt/a020`, and B's ADR-020 and baseline, through main's copies, which the brief says are byte-equal to B's.

## Findings by class

**Correctness: none.** Every clause of the appended corrigendum (H, ADR-020 lines 680 to 693) is true of entry 54, the RULED 2026-09-07 block and ADR-020 at B (check 1). None claims more than §1 allows.

**Evidence: none open on my side.** E1 to E10 and C1 are in the worker's report at H (`state/consults/2026-11-01-adr-020-appended-note-worker-report.md`, lines 13 to 24). Recomputing them is the reviewer's job (§9). E11 (PR CI) is unreported, and I cannot read it. It is for the reviewer and the custodian.

**Documentation: one finding, D1, which must be fixed or accepted before the merge.**
- **D1. The baseline entry's `reason` still says the note is owed.** In `scripts/plan/verify-quotes.baseline.json` at H, line 24, the ADR-020 line-403 entry's `reason` ends in "an appended ADR-020 note is owed." At the merge that is false, for the same reason OPEN-3 gives for `corrected_by` (form, OPEN-3, third bullet). The form pins (§0, its verify-quotes:1070-1073 pin) that verify-quotes prints `reason`, so every run after the merge will print the stale line.
- **Route.** The human admitted only `corrected_by` (settlement, OPEN-3 (a); directive item 4). Changing `reason` is therefore a further scope addition. It needs a class 9 row before its commit, and a class 8 row too: P4 would go from 2 lines to 4, over §7's 2-line ceiling. The other option is that the human accepts the field as it stands and the gap is recorded. These are not the human's words (the field is tooling text), so under §31 the worker applies the words below with no re-gate once the scope is admitted.
- **Replacement words** (the whole `reason` value):
  `source DECISIONS-PENDING.md, entry 54, ends '...the acceptance never covered' with no closing period; this blockquote adds one not in the source; its bytes are immutable, and the appended ADR-020 Corrigendum on Amendment 1 §(c) carries the source's sentence.`
- **Clause check:**
  - "ends ... with no closing period": entry 54's italic quoted span closes with its quotation mark and asterisk, and a semicolon follows.
  - "this blockquote adds one": ADR-020:403 at B ends in a full stop.
  - "its bytes are immutable": ADR-020:5 ("Immutable from this acceptance").
  - "the appended ... Corrigendum ... carries the source's sentence": H:693 matches the anchored exact pattern. The same span occurs once in the archive, inside entry 54.
  - The words keep only the fragment the field already has, and do not contain line 403's full sentence.

## Check 1: §2.2 against its sources

1. "A dated corrigendum, as the Status line provides": true. ADR-020:5 at B says corrections are dated corrigenda.
2. "Owed under round 11, item 1": true. The RULED 2026-09-17 block for round 11 (in the archive) has item 1, and its condition (a) names the accepted-ADR note among the owed corrections. The baseline entry's `ruling` is round 11.
3. "On the human's typed word (... item 4)": true. Item 4 of the directive (line 14) is "OPEN-1 (A), yes to §2.1's words, headed "Corrigendum", dated by the appending commit."
4. "Nothing above this heading is changed":
   - What I could read holds. The Status paragraph at H (lines 3 to 5) equals main's. H:401-403 equals main's. Main's last line, 678, is H:678. One blank line follows, and the heading is at H:680.
   - The byte-prefix proof is E2, in the worker's report (line 14) and with the reviewer. I cannot run it.
5. "The sentence that entry 54 set out for this record": true. Entry 54's "The record:" list includes the italic quoted span.
6. "In the shape the human's ruling on entry 54 (2026-09-07) pre-approved": true. The RULED 2026-09-07 block covers entries 52 to 54 together. Its 54 clause pre-approves ADR-020 Amendment 1 in that shape.
7. "As a verbatim blockquote ending in a full stop": true. ADR-020:401 introduces (c) as verbatim, and :403 is a blockquote that ends in a full stop.
8. "Entry 54's sentence has no full stop": true, as under D1.
9. "Its words are otherwise the same": true. I compared the words of ADR-020:403 with entry 54's span by reading them. The byte comparison is E4, in the worker's report (line 16).
10. "Archived in `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`": true. Entry 54's head and its span are both in that file.

The verbatim reproduction is checked against its source:
- Grep, anchored, `^\*"the accepted mechanism ... covered"\*$`: 1 hit, H:693.
- Grep, the same span, in the archive: count 1, inside entry 54.
- The wrapper bytes are the source's own.
- Round 14 (a′): the ledger passage is referenced by entry number, not pinned, so a missing hash in the corrigendum is correct. Resolving it against the entry, as done here, is the proof.

§1 limits: the corrigendum does not claim that §(c)'s bytes are corrected. It changes no decision, condition, mechanism or test, and uses no "Appended <date>" heading. It says nothing about the code.

Hazard scan:
- Pattern `acceptance\s+never\s+covered[` + "`" + `*_"'\s]*\.`, multiline, over the whole worktree: the only hit is ADR-020:403.
- That hit is the pattern's positive self-test.
- So there is no normalized full-stop copy elsewhere (§8 item 2).

## Check 2: §2.3 and the round 12 (b) rider

- The rider sets reference-only as the default. It allows reproduction only when the sentence cannot be understood without it, by script, and marked.
- §2.3's ground is that the reproduction is the correction's content. The pre-approved record had to carry the sentence verbatim, and only a reproduction gives ADR-020 the source's sentence.
- That reading is narrower than the rider's test, and it is not a free choice. The human ruled OPEN-2 (A) (directive, item 4), which settles it.
- The reproduction is marked (H:690-691, "byte-copied by script ... and marked so") and sits alone on its line (rule §2.0 (d)).
- It needs no hash, by round 14 (a′) as under check 1. No finding.

## Check 3: The gating

- The form is the full form, §0 to §11. The Gating paragraph and §9 give full gating from dispatch (an architect and a reviewer). §21a categories 1 and 2 apply, and §25(e) bars a five-line form. This gate is that full gating.
- **Class 9.** The settlement records OPEN-3 (a) as a class 9 scope addition, limited to the one `corrected_by` value and conditioned on #242's merge (c52abe27).
- That settlement is in the form at B. It is present unchanged in the worktree at H, and the form is not in the diff. So it was recorded before the only code commit.
- I cannot verify #242's merge commit without git. That is the custodian's statement.

## Check 4: §8, item by item

1. **B's bytes:** unchanged as far as I could read (check 1, clause 4). The byte proof is E2.
2. **A full-stop copy:** none. The scan above, with its positive self-test.
3. **The words:** H:680-693 are §2.1's text with `<DATE>` set to 2026-11-01, `<DIRECTIVE>` set to the directive path in backticks, and `<N>` set to 4.
   - The rewrap puts the path on a line of its own (H:684, over 100 columns, which the settlement allows). No word changes.
   - The commit date of 2026-11-01 is the worker's claim (report line 8). I cannot check it.
4. **Cites:** the diff has no line cite into the ledger or its archive, no bare `:line` into ADR-020 (neither the corrigendum nor the new `corrected_by` carries one), no split pin and no hash.
5. **Tool claims:** the diff makes none. The worker's tool claims name B or H (report lines 5, 12 and 24).
6. **Paths:** P1 and P4 only (custodian's git check: two files). P4 is admitted by OPEN-3 (a). Nothing is under `protocol/`.
7. **Over-claim:** none (check 1).
8. **Status and index:** no added line begins `Status:` or `**Status:**`. Grep over H's ADR-020 finds only line 3. `docs/README.md`:58 at H is identical to main's.
9. **§7:** no overrun. P1 is +15/-0 against a ceiling of ≤20/0, and P4 is +1/-1 against a ceiling of 2. §7 is not edited. Class 9 was recorded before code. D1, if admitted, would need class 8.
10. **Mutation wording:** the worker's report calls C1 "a control run, not a mutation" (line 24), and §4 says the same.
11. **#244's freeze window:** spent. #244 has merged (settlement).

The worker's E8 ran `node scripts/adrIndex.mjs --check`. That is exactly what `npm run verify:adr-index` runs (`frontends/shell/package.json`:23).

## Check 5: ADR status and the index

- ADR-020's Status paragraph (lines 3 to 5) is unchanged at H.
- No new Status line was added.
- `docs/README.md` is not in the diff, and its ADR-020 row is unchanged.
- The corrigendum is a dated, appended section after ADR-020's former last line, headed "Corrigendum" and dated by the appending commit, as item 4 of the human's ruling approves.

Not checked by me: the PR body's request for a merge commit, E11, and every pin hash. These are the reviewer's.
