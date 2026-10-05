# PR #177 gate 2 — reviewer (scoped)
Reviewed: cut/evidence-recorder-v0-1 @ 05fc645d64c6c59b1f682f04f585e72243f8a272 (form at f74b0487e30cee79c5d43677c2cbd45d4208e0f3)

**Verdict: PASS.** No S1 and no S2. Scope: Amendment 5 of `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md` (lines 571-578 at f74b0487e30c), read against gate 1's S1-1 and S2-1 (`state/consults/gates/2026-10-05-evidence-recorder-v0-1-gate1-reviewer.md`). Nothing outside Amendment 5 is re-gated. The PR head is unchanged at 05fc645d, so gate 1's code, test and mutation results stand as filed.

## Checks

1. **Append-only.** `git diff --numstat f74b0487e30c^ f74b0487e30c -- <form>` reads `9 0`: nine lines added, none deleted. The full diff is one hunk after line 569 (the end of Amendment 4's superseded index): a blank line, then the Amendment 5 heading, its italic provenance line, items 1 and 2, and the superseded index. No earlier byte moved. Pass.
2. **Round 12 (d) shape, item 1.** Three sentences, in order: the defect (sentence 1), the corrected reference (sentence 2), the proof (sentence 3). At the ceiling, not over it. It restates no earlier amendment's claim; it names A2-1 only in the superseded index. Pass.
3. **Item 1's facts.**
   - The one word. §4's T24 row, form line 262 at f74b0487e30c, declares `before-fields`; the built test text at line 723 at 05fc645d reads `fields` in that place. Everything else in the two names is identical. Item 1 names exactly that pair. Holds.
   - The lines. Line 698 of `tools/mods/spatial-evidence-recorder/test/recorder.test.ts` at ba42e6f76117f4f579ff181f063492cfcdc1e631 and line 723 at 05fc645d64c6c59b1f682f04f585e72243f8a272 are each T24's `test(` line, byte-identical, with the built name. Holds.
   - The observation commit. T24's recorded-mutation comment at the head (lines 719-722 at 05fc645d) says it was observed at ba42e6f76117. Item 1's clause "with the mutation and observations recorded at ba42e6f7" holds.
   - Round 25, item 2 (d) form. The branch-only span is named in words, by full commit id, with no hash and no `path:line` token, as `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions require. Holds.
   - The proof. It names my gate-1 fixed-string search of both test files (gate-1 report, S1-1, fourth bullet: 0 hits for the declared name) and my re-observation of T24's mutation at the head (gate-1 report, plugin mutation table, T24 row: rc 1, T24 by built name and T28 fail). Both exist in the filed report at f74b0487e30c. Holds.
4. **Item 2 against S2-1.** It records the condition as holding by reading (the abort in raceBefore's `finally` at the head), that no test detects the abort's removal (probe P-abort), and that it is not claimed as tested. That is S2-1 as I found it, and it takes S2-1's suggestion to record it under §8 item 18. §8 item 18 exists (Amendment 2, form line 514 at f74b0487e30c) and names the sleep left live into `next`. Pass.
5. **Superseded index.** It names what it replaces: §4's T24 row name, for the built test, and A2-1's statement that T24's name is unchanged (form line 498 at f74b0487e30c, which says the name and mutation are unchanged). Superseding only the name leaves A2-1's mutation statement standing, which matches gate 1's finding that the mutation is unchanged. Pass.
6. **Provenance line.** Both cited gate reports are tracked at f74b0487e30c (`git ls-tree`). The round 25, item 2 (d) cite resolves: the ledger's RULED block for round 25 is present in `DECISIONS-PENDING.md` at f74b0487e30c, and the template's Round 25 additions carry the (d) paragraph. The line declares that nothing below is a quotation. The backticked words in item 1 are single tokens, not passages presented as quotes. Pass.
7. **Checkers on main (floor only, tool at 859375c979b5, the last commit touching `scripts/plan`).** verify:cites PASS and verify:quotes PASS, and neither prints an advisory for the recorder form. Neither resolves the semantic checks above.

## N

- **N-1.** §8 item 18 names the sleep left live past the race *or* into `next`. Item 2 records only the `next` half as by-reading. The same abort governs both halves, and P-abort survives either way, so the past-the-race half is also untested. Not blocking: S2-1 named only the `next` condition. A later record may widen item 2 if one is written for another reason.
- **N-2.** Item 1 gives ba42e6f7 in short form in its last clause, after the full id earlier in the same sentence. The reference is unambiguous.

## Commands and exit codes (main checkout C:/dev/spatial-ide at f74b0487e30cee79c5d43677c2cbd45d4208e0f3, read-only apart from this report)

- `git rev-parse HEAD`: rc 0, f74b0487e30cee79c5d43677c2cbd45d4208e0f3.
- `git diff --numstat f74b0487e30cee79c5d43677c2cbd45d4208e0f3^ f74b0487e30cee79c5d43677c2cbd45d4208e0f3 -- tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md`: rc 0, `9 0`.
- `git diff` of the same range and path: rc 0, one hunk, additions only.
- `git show f74b0487e30c:<form> | sed -n '262p'`, `'498p'`, `'571,578p'`, plus a heading and item-18 grep: rc 0 each.
- `git show ba42e6f76117f4f579ff181f063492cfcdc1e631:tools/mods/spatial-evidence-recorder/test/recorder.test.ts | sed -n '698p'`: rc 0.
- `git show 05fc645d64c6c59b1f682f04f585e72243f8a272:tools/mods/spatial-evidence-recorder/test/recorder.test.ts | sed -n '723p'` and `'700,723p'`: rc 0.
- `git ls-tree f74b0487e30c` for the two gate-1 reports: rc 0, both present.
- `git show f74b0487e30c:DECISIONS-PENDING.md | grep` for round 25 and `git show f74b0487e30c:docs/PREREGISTRATION-TEMPLATE.md | grep` and `sed`, for the Round 25 additions: rc 0.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1334 files, 61 loose references advised, none in the form.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 119 checked, none advised in the form.
- `git log -1 --format=%H -- scripts/plan`: rc 0, 859375c979b54302efb6f0ea992d9b3496f839c6.
- `git status --porcelain=v1` before and after: rc 0, only the two pre-existing untracked entries.
- `gh pr checks 177`: rc 0, six checks pass (runs 37302063544 and 37302070106 among them).
- `gh pr view 177 --json headRefOid,state,isDraft`: rc 0, 05fc645d64c6c59b1f682f04f585e72243f8a272, OPEN, not a draft.
