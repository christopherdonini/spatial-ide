*Custodian's filing note (2026-09-30): the architect's gate 2 on PR #150, scoped to correction round 1 (the form's Amendments 1 and 2 and the comment), for PLAN node `kernel-close-dataset-unknown-keeps-openrecord` at g1. Reviewed: cut/close-dataset-unknown @ 094a21daa81e87b10a16ac5081018277b4ac03f8 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 22:27:28Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 094a21d. Verdict BLOCK on record form only; the narrowing, the comment and Amendment 2's reading pass. B1 (Amendment 1's quote has no pin) and N1 (the fmt precedent unreferenced) are answered by the form's Amendment 3 (class 3), correction round 2 of the two the record cap allows. Profile paths redacted at filing: none.*

---

Reviewed: cut/close-dataset-unknown @ 094a21daa81e87b10a16ac5081018277b4ac03f8 (read from `.git/refs/heads/cut/close-dataset-unknown`; the form was read on main at c5a36cc. I have no Bash, so I could not diff e1c37b0..094a21d myself. For that diff I rely on the custodian's `git diff` in the worker report 2 filing note and on the worker's `--stat`. I read the head file directly.)

**Verdict: block.** There is one record-form blocker (B1), fixed by one appended row. The code and the claims now pass.

**1. Amendment 1: substance PASS, record form FAIL (B1).**
- Items 1 to 3 narrow §1's May claim, §2 item 2 and §5's first Falsification clause to "after the SKP version check", as my gate-1 B1 asked.
- Item 4 leaves §1 to §9 unedited. §1's text at line 27 still says "by any outcome", as append-only requires.
- The first line says it was written post-result.
- Class 5 is right. Template class 5 reads "the human's ruling (or a gate) narrows what the piece does", and it is not class 9, which adds scope.
- The reproduced sentence matches my gate-1 report's item 2 byte for byte (the filed report's line 11).
- The problem: it is reproduced with no path:line and no sha256. Round 12, item (b) fails reproduced text without its script mark and hash by name. Template line 138 reads class 5's verbatim rule through (b).
- A pin could not have been written in dd912f7, because that commit created the cited report (round 14, item (a′)). It can be written now.

**2. The comment: PASS.** Lines 1447–1449 at 094a21d say the close releases the watch "on every outcome after the SKP version check, the `unknown_dataset` refusal included". `check_version` still comes first (line 1442). The lines stay within 100 columns. On the custodian's diff and the `--stat`, this is the only change since e1c37b0: 2 insertions and 1 deletion. §7 is 127 changed lines against the 150 ceiling, so no class 8 is owed.

**3. Amendment 2: PASS.**
- It points to the gate-1 reviewer's check 5 by reference. That check names the tool commits: `scripts/plan` at d047dda and `verify-mutation` at 7d24ed1, with the exit codes. No record there calls a `verify-mutation` run an observation (round 25, item 2 (c)).
- Item 3 meets my gate-1 N1.
- The fmt reading ("no new hunk") is acceptable without the human:
  - `.gitattributes` forces LF checkout, so the 1046 hunks are real drift that was already there, not line-ending artefacts.
  - CI does not run fmt.
  - Making the crate green would break §7 and §8 item 2.
  - §9 is not edited.
  - The same reading has precedent in `state/consults/2026-09-27-kernel-close-races-suites-76f92ba.md` §7.
  - The defect is in my draft's §9.

**4. Anything else from gate 1: no change.** §8 items 1 to 12 and item 14 still PASS. Item 13, the merge style, is still pending.

**Blocking**
- **B1.** Round 12, item (b): reproduced text without its hash. Append one class-3 row of at most three sentences. It pins Amendment 1's quote as `state/consults/gates/2026-09-30-close-dataset-unknown-gate1-architect.md:11 @ dd912f7 sha256:<hex>`. The hash is over the whole of line 11, and the row says that it pins a sub-line span. It also states that the quote was byte-copied by script. The reviewer recomputes the hash. No claim changes. This is correction round 2 of the two the record cap allows.

**Non-blocking**
- **N1.** "This is the reading nodes 1 to 3 used" has no reference. The close-races suites consult §7 would carry it.
- **N2.** Matching hunk counts do not prove that no hunk is new. Gate-1 reviewer check 5 (the pre-existing method-chain hunk) is the actual proof, and the reviewer should re-read it at 094a21d.
- **N3.** Amendment 1 item 2 says "one comment line". The rewording actually replaced one line with two. It is counted in §7, and nothing breaks.
- **N4.** By the worker's read, all 7 checks on PR #150 were pending at 094a21d. §9 requires branch CI to be read before either gate, so the reviewer reads it before gate 2.
- **N5.** Proposal for the human, at the weekly allowance: `cargo fmt --check` in kernel forms cannot pass until a crate-wide fmt piece lands.

Paths:
- `C:\dev\spatial-ide\kernel\CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`
- `C:\dev\wt\close-dataset-unknown\kernel\src\skp.rs` (lines 1438–1475)
- `C:\dev\spatial-ide\state\consults\gates\2026-09-30-close-dataset-unknown-gate1-architect.md`
