*Custodian's filing note (2026-09-27): gate attempt 2, reviewer (scoped), for PR #129 (node governance-weekly-proposals-2026-09-26) at `c85fc55`, transcribed from the hand-back message with the harness's two-space indent removed. Line cites below are into the branch at `c85fc55` unless the report names another revision. One path-and-line cite into a line that exists only on the branch is written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is the reviewer's text.*

---

Reviewer, gate attempt 2 (scoped), PR #129, node governance-weekly-proposals-2026-09-26. The branch `governance/weekly-proposals-2026-09-26` @ c85fc55a7f9c0c7fb78aa8bb8a40a88805f5cea1, read in the worktree C:/dev/wt/governance-weekly. This commit is the PR head on origin.

## Verdicts (AUTONOMY.md §22)
- **Correctness: PASS.** Every T block lands byte-exact, main's sections are untouched, and the tool is unchanged since f205478.
- **Evidence: FAIL.** Severity low. Scope: P2's second clause only. Disposition: one appended class-2 row, and no code change. This is the only blocking item.
- **Documentation: PASS.** One suggestion and one nit below.

## Blocking
**E1. P2 does not hold as worded at the head, while Amendment 2 item 5 says P1–P3 are unaffected.**
- P2 predicts the same advisory findings as at the merge base. I ran verify-cites at merge base 5fbb1cf in a scratch repo built by `git archive`: 47 advisories. At c85fc55 there are 41.
- The difference is exactly six advisories, all from the filed report `state/consults/2026-09-26-governance-weekly-proposals-gate1-architect.md`, at its lines 11, 39, 52, 68 (two) and 69. These are loose branch-line cites that exceed the file at the base. They resolve at the head because this piece's appended lines now exist.
- The tool is not the cause. `state/consults/gates/` is empty, so the prefix list archives nothing, and `git diff f205478 HEAD -- scripts/plan/verify-cites*` is empty. The other 41 advisories are identical at both commits.
- Gate 1 compared the advisories (64 identical to the base). This time the worker reported exit codes only, so the comparison P2 requires is missing and item 5's claim is unsupported.
- Fix: one appended class-2 row with 47 at 5fbb1cf, 41 at c85fc55, the six citing lines and the cause.
- If the architect instead reads P2 as "the tool change alters no advisory", it holds on the evidence above. That reading is the architect's to name. Without it, this blocks.

## Checks re-run (steps 1–6)
**1. Byte check.** My script (not the worker's) took T1–T6 from the form at 340f516. T6 is the single line after its opening fence, per Amendment 1. The script then applied item 3's substitutions in order:

| Block | Substitution | Count, as item 3 declares |
|---|---|---|
| T2 | §24 to §25, then §23 to §24 | 1, 1 |
| T3 | Amendment 4 to Amendment 5, then §24 to §25 | 1, 1 |
| T4 | §24 to §25 | 1 |
| T5 | §24 to §25 | 1 |
| T1, T6 | none | none |

- Before substituting, I counted every target in every block. T1's only target token is its one `Amendment 4`, the watcher's form, as item 3 says. T6 has no target token.
- For each of the six files, the file at HEAD equals the file at 5fbb1cf, plus LF, plus the substituted block, plus LF, byte for byte. Each base is an exact prefix. All six equal.
- The worker's claims hold: every count matches, T1 and T6 are byte-identical, and T2–T5 are byte-identical after substitution.

**2. Append-only.**
- The form at f205478 (23150 bytes) is an exact byte prefix of the form at HEAD (25964 bytes). So is the form at 340f516.
- HEAD adds only c2c396a (Amendment 2 and the superseded index) to the form.

**3. verify-cites.** `git diff f205478 HEAD -- scripts/plan/verify-cites*` is 0 bytes, so M1 was not re-applied.

**4. Main's two files.**
- Against 5fbb1cf, AUTONOMY.md has one hunk, `@@ -472,3 +472,11`: main's file is 474 lines, the head's is 482. AI_DEVELOPMENT.md has one hunk, `@@ -723,3 +723,11`: 725 lines on main, 733 at the head.
- Both are additions only, after main's last line.
- Numbering at the head: §24 at line 472 is main's, §25 at line 476 is this piece's. Amendment 4 at line 723 is main's, Amendment 5 at line 727 is this piece's.
- P4: merge-base(HEAD, origin/main) is 5fbb1cf, which is M. Numstat against 5fbb1cf gives 0 deletions for all six files: 2, 2, 2, 8, 8 and 15 insertions.

**5. Residual grep** for `§24` and `Amendment 4` in the added lines of origin/main...HEAD. Every hit falls in an allowed bucket:
- AUTONOMY.md:476. T2's heading, after substitution, says it is appended after §24; that correctly names main's section.
- `docs/PREREGISTRATION-TEMPLATE.md` line 170. T1's class 9 names the watcher's Amendment 4, which item 3 excludes.
- The form, lines 28, 29 and 69. §2.1's T2 and T3 lines, and §5's first invalidator. These are text frozen at 340f516, and the superseded index covers the §2.1 lines.
- The form, lines 128, 140, 152, 154, 164 and 170. Appendix T at 340f516, which item 3 reads through the substitutions.
- The form, lines 184 and 187–191. Amendment 2's own lines.
- No other file carries a hit, which confirms item 4.

**Amendment 2's cites, resolved:**
- 3718a39 is PR #131's merge commit on main; it adds §24 (its first parent has none).
- ae92f10 is on main and is the round-27 ruling commit that adds Amendment 4. That section's heading names round 27, item 6.
- c2c396a's parent is 4c4ec06, as item 1 says.
- The gate-log on main holds attempt 1 for this node: architect PASS and reviewer PASS, both at f205478.
- Main at d6d9862 has no §25 and no Amendment 5 to the Custodian role, and nothing under `state/consults/gates/`. So item 6 and §5's fourth invalidator have not fired.
- Amendment 2 contains no sha256 reference and no quotation.

**6. Suites, checks and line endings.**
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 315 of 315 pass, 0 fail.
- All seven checks exit 0 at c85fc55: verify-cites (41 advisories), verify-quotes, verify-test-claims, verify-mutation `--base origin/main --head HEAD` (one new test, recorded), `verify.mjs --offline`, `queue.mjs --check` and `site.mjs --check`.
- CR bytes, counted with `LC_ALL=C tr -cd '\r' | wc -c`: 0 in all 14 files touched against 5fbb1cf.
- The PLAN.yaml diff against main is the one gate line.
- c85fc55 changes exactly one token in each of the two agent files.
- CI on PR #129 at c85fc55: all 7 checks pass. The PR reports MERGEABLE, CLEAN against main d6d9862. Main's drift since 5fbb1cf touches only DECISIONS-PENDING.md, KNOWN-LIMITATIONS.md and state/questions/round-29.md, none of them this piece's files.

## Suggestion
S1. The E1 row should also say that two of the six gate-1 cites, AUTONOMY.md:476 and AI_DEVELOPMENT.md:728, point at different content at the head than at f205478; at the head, 728 is an empty line. After the merge the tool stops flagging them, so they will look current. The row should state they are read at f205478 (round 14, the historical-pin addition), not current. The other four (template :174, worker.md :33, and verify-cites.test.mjs :196–233 and :196–210) point at unchanged content.

## Nit
N1. The brief says "six plan checks"; §9 lists seven self-checks. All seven were run.

Head read: c85fc55a7f9c0c7fb78aa8bb8a40a88805f5cea1. Merge base: 5fbb1cf. origin/main: d6d9862. Only scratch files outside the repo were written; no edit, commit or push.
