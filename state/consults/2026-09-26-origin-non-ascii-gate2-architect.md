*Custodian's filing note (2026-09-26): the architect gate's attempt-2 report (scoped, record round) for PLAN node `data-plane-origin-non-ascii` at 97c5c0a, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: PASS with notes** (scoped: attempt 2, record round, @ 97c5c0a). Nothing blocks. I have no Bash, so the byte checks, line counts and "nothing else changed" rest on the reviewer's attempt 2.

## Your four points

**1. F1 is fixed. N1 and N2 are applied.**
- **F1:** All five records in `protocol/data-plane/tests/origin_header_encoding.rs` are now declared excerpts: "excerpted by script … only the `left:`, `right:` and `test result:` lines are kept, every other line (each failure's test name included) is elided". Each record's mutation line names its failing tests in prose (T1; T2 and T4; T3; T2, T3 and T4; T5).
- **The named tests match the reviewer's gate-1 reruns** (Runs, item 3: M1–M5).
- **Round 11 is satisfied.** The elision is declared, and the qualifier it removes (the test name) is carried back in prose. No negation or condition is lost.
- **N1:** every count line ends `…; …`. The retained span ends at "filtered out; ".
- **N2:** "printed in that order" is gone. It is replaced by "the failures' printed order varies between runs".
- **Reviewer's nit:** the `upgrade` comment in `server.rs` now credits the byte rule to `http`'s `HeaderValue::to_str`, and the ADR-020 citation is limited to the refusal itself. The comment is still 5 lines, so the +12/−1 is unchanged.

**2. N3 and N4 are recorded as I asked.**
- **N3 (Amendment 1, item 3):** "F4b's before-column is not discriminated by T4 as written", and the observation is attributed to the reviewer's own run ("the same report, section Runs, item 2"), not the worker's. This matches the reviewer's gate-1 N3 too.
- **N4 (the same item):** "T2's mutation also fails T4, outside §4's statement and not against it."
- §3 and §4 are not edited.

**3. Amendment 1 meets the record cap.**
- **First line:** it states it was written after both gates' attempt-1 results, citing the gate-log by node and attempt.
- **Commits** are cited by id: 3a9ed80, d445c86, fff5114, 1a000a0, 8d7ef9f.
- **Force-push:** c907f30 → fff5114 on d445c86, which matches the worktree reflog.
- **Results** are cited by reference: the records @ 8d7ef9f, and the reviewer's report by section and item. The report is tracked on main (c0f1549) and is evidence, not Authority.
- **No hash pins**, so round 15 (e) is not engaged. There are no line cites, no discharge clauses, and the superseded index reads "none".
- **No prose restates a reference.** The c907f30 sentence and the N3/N4 clauses are findings no reference carries.

**4. Nothing else changed, as far as the reflog shows.**
- Chain: 1a000a0 → 8d7ef9f → 97c5c0a. Each commit's message states its scope, and the files I read agree with those messages.
- The test file is still 180 lines, and the retained line counts per record are unchanged (3/5/3/7/3). So §21c's 196 should hold. The reviewer confirms both the stat and the count.

## Notes (none blocking; no record edit, per the record cap)

- **N1: merge form.** The branch's base, b03e9e7, is behind main (c0f1549), so a fast-forward is impossible. Every commit id in Amendment 1 and in the records resolves on main only through a signed-off merge commit. A squash or rebase would orphan all of them.
- **N2: the test-first prediction.** Amendment 1 has no reference for §4's test-first prediction (T2, T3 and T4 fail; T1 and T5 pass). Its outcome is in the reviewer's gate-1 report (Runs, item 2), so the gate-log line below carries it. This gap comes from my own attempt-1 list.
- **N3: "d445c86's source".** This is true of the source files but not of the test file the worker ran, which was a pre-commit draft (reviewer gate-1 N1). No retained byte depends on that file, since the excerpt drops every line-numbered line, and the retained lines reproduce at 1a000a0. No action.
- **N4: item 4's suites.** They are pinned @ 1a000a0 and are not claimed as current. The suites on the final tree belong to the attempt-2 reviewer's gate-log record.
- **N5: item 1's parenthetical.** "1a000a0 and 8d7ef9f (the records' attribution and excerpt form; architect gate-1 F1)" reads respectively. 1a000a0 came before gate 1, so F1 belongs to 8d7ef9f only. No action.

Files:
- C:\dev\wt\data-plane-origin\protocol\data-plane\tests\origin_header_encoding.rs
- C:\dev\wt\data-plane-origin\protocol\data-plane\src\server.rs
- C:\dev\wt\data-plane-origin\protocol\data-plane\ORIGIN-NON-ASCII-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-09-26-origin-non-ascii-gate1-architect.md
- C:\dev\spatial-ide\state\consults\2026-09-26-origin-non-ascii-gate1-reviewer.md

**Gate-log line:** `data-plane-origin-non-ascii attempt 2 @ 97c5c0a — architect PASS with notes (record round): F1 fixed at 8d7ef9f (declared excerpts naming failing tests); N1/N2 applied; N3/N4 recorded in Amendment 1 item 3; Amendment 1 meets the record cap (post-result first line, commits by id, c907f30 force-push recorded, references only); §4 test-first outcome is reviewer gate-1 Runs item 2; merge must preserve SHAs (no squash/rebase); byte/count/"nothing else" checks are the reviewer's attempt 2.`
