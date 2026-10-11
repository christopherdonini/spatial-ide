*Custodian's filing note (2026-10-11): written by the custodian from the measurement filed beside it. Its sha256, from line 5 to the end, is d69a26f45520465b14df5b0d7afb3f3baa6fdabd5eedaa3dba155507fdf5e144.*

---

# The data lead's second pilot: the four-piece result, the table since, and one recommendation; the 2026-10-05 section 6 measures

This answers the human's 2026-10-11 direction, items 3a and 3c (`state/directives/2026-10-11-direction-after-status-review.md`). The figures are the measurement filed at `state/consults/2026-10-11-pilot-v2-table-and-section-6-measures.md` (sha256 7a6711e34f4f33e4b2d71e54c5a323a581a64e8eff29b0440f50f465eef77ca4, its line 5 to the end).

**Spot-checked by the custodian:**
- gate-log rows 331, 402, 437, 450, 465, 471, 480, 482 and 494 name the nodes and verdicts the table gives;
- the baseline commit c823bce5 is at 2026-10-05T00:35:18Z;
- the merges per day from `gh` (4, 6, 4, 6, 3, 6 and 5) match Table B.

**A caveat on tokens.** The harness's per-run figure is the subagent's context when it stops, not the tokens it used. The measurement found this on 30 sampled runs. Summed over a piece's runs, it ranks pieces but is not a bill. The custodian's own tokens are not in it.

## The four-piece result (the pilot's §5 and §8), owed since the fourth piece

The four pieces are #176, #178, #186 and #182.
- **A gate found a pointer wrong on at most one piece:** met. It happened on one piece, #178: the gate-1 architect found the K-5 range the lead had disclosed, and two missing pointers (`state/drafts/weekly-window-2026-10-09.md`, B2, measured piece 2).
- **The index was updated in every PR:** met, four of four (Table A1).
- **On at least two pieces, a report names something from the read that the form used:** met, on pieces 1 and 2 (the window draft, B2, measured pieces 1 and 2).
- **No stop fired.** No correction round was caused by a wrong or missing pointer (Table A2). No read carried design (the window draft). No read wrote outside its report path.
- **The combined cost beside the baseline.** Read plus draft cost 508,657, 343,458, 357,503 and 618,276 tokens, a median of 433,080. The baseline's median over six pieces is 211,810, so it is about twice.

The pilot met its three thresholds and fired no stop. Whether it pays is the human's to judge (§5).

## Since then: eleven merged pieces with a read (Table A3)

- **Cost.** The drafting median is 440,059 tokens (reads 190,693, drafts 239,130), against 211,810 for the baseline. The median total per piece is 1,065,350, against 732,185.
- **Draft-caused correction rounds:**
  - none on the 11 pieces with a read;
  - 2 of the 6 baseline pieces (#157 and #170);
  - 2 of the 6 `engine/` or `kernel/` pieces drafted without a read while the pilot was paused (#190 and #203).
- **Rounds caused by a wrong or missing pointer:** none, on any piece.
- **What the comparison does not show.**
  - The paused group's two draft-caused rounds came from the custodian's own drafting, which no impact read covers. In #190 it was ADR-036 text in the form's Amendment 2. In #203 it was a five-line form's file count.
  - Of the baseline's two, #157's is the kind an impact read lists: a text reader missing from the form's list of consumers. #170's came after the first pilot's lead draft.
  - The pieces with a read were also smaller: a median of 143 lines, against 1,392 in the paused group.
- **The indexes.** Every piece with a read updated its index. Three of the six paused-group pieces did not: #187, #203 and #204.
- **The trigger once missed.** #204 changed files under `engine/` and `kernel/`, but its drafting brief said it did not, so the mandatory read was never asked for.

## The recommendation (item 3a): end the mandatory impact read; keep the owner's indexes, with impact questions on demand

- **The cost is plain.** A read adds about 190,000 tokens per piece and roughly doubles the drafting cost. Over the eleven pieces the reads came to about 2.1 million tokens.
- **The benefit does not show in the record.** No correction round in eleven pieces traces to a read, or to the lack of one. The baseline rate of the one kind a read could catch, #157's, is one round in six pieces. That costs less than a read on every piece.
- **What held up is the index.** It was updated on every piece with a read, and it lapsed on half of those without one. Keep the owner's-index update (the pilot's §1, item 2) on every PR that changes `engine/` or `kernel/`, checked by the final review. Ask the lead a bounded impact question (§1, item 3) when a form crosses into those modules from another one, or when the architect asks for one.
- **What stays:** the lead never drafts, and the gates are unchanged.

The human rules.

## The 2026-10-05 direction's section 6, the days since (Table B, 2026-10-05 to 2026-10-11)

- **PRs merged:** 25 product, 9 governance. All 9 governance PRs merged on 10-05, 10-06 and 10-08, and none since.
- **Question rounds:** 18 in seven days: 8 on 10-05, 1 on 10-06, 7 on 10-07, 2 on 10-09, and none on 10-08, 10-10 or 10-11. Questions put in closing messages are not counted as rounds.
- **Correction rounds:** 22. By cause, 3 were the draft, 6 code, and 17 documentation or wording; a mixed round is counted in each of its classes. On 10-11, 9 of 10 were wording. That is what the direction's item 2 now addresses.
- **Hours slot 1 waited on a person:** 84.2 over the week: 8.1, 14.6, 6.1, 12.1, 18.3, 16.0 and 8.9, nights included. Each wait is taken from the record (Table B's list).

## Also found

- **The ledger.** `state/CUT-STATE.md`'s ledger has no entry after 2026-10-10T09:10Z. The continuity block was flushed, but no ledger entries were appended. The custodian resumes the ledger from the next entry.
