*Custodian's filing note (2026-10-02): the architect's gate 2 on PR #153, for PLAN node `exposure-scan-ci-backstop`, scoped to correction round 1, full gating. Reviewed: cut/exposure-scan-ci-backstop @ e0442e0c9b1b4e52ad13acc86e3979e115f597ce (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at e0442e0. Verdict FAIL on the record alone (S1): the round corrected M10's recorded first failure and re-observed T7's M7, and the form has no amendment or superseded index for it. The custodian takes it in correction round 2 as the form's Amendment 2. The gate-1 S2 is discharged. Profile paths redacted at filing: none.*

---

VERDICT: FAIL (cut/exposure-scan-ci-backstop @ e0442e0c9b1b4e52ad13acc86e3979e115f597ce)

I read the worktree. Its HEAD ref resolves to e0442e0c9b1b4e52ad13acc86e3979e115f597ce. All cites below are at that commit unless I name another, and paths are relative to the repository root. I had no Bash, so I computed no hash and ran no git command.

The code and comment hunks pass, and my gate-1 S2 is discharged. The verdict fails on the record alone: this round corrected a mutation record and has no amendment or superseded index for it. That trips §8 item 12. The fix is to append to the form, with no code change.

**Findings**

- **S1: §8 item 12, a correction round without its superseded index. `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md` §10 holds only Amendment 1.**
  - Under §4, the `RECORDED MUTATION` comment is the mutation's record.
  - M10's comment at 5d3951f recorded case 1 as the first failure. The reviewer showed that was wrong under the edit §4 names (gate-1 reviewer, N1). The comment now records case 4 (`scripts/hooks/profile-path-scan.test.mjs:1394-1397`).
  - That is a record correction of a claim in a test comment. Under round 14 and the template's class 3 exception (`docs/PREREGISTRATION-TEMPLATE.md:112-114`), it is recorded by a row that names the superseded span.
  - Separately, T7 gained an assertion (`:1297`), and M7 was re-observed with an abort observation added (`:1304-1307`), after both gates' N2. That is class 4, a mutation corrected after a gate finding (`docs/PREREGISTRATION-TEMPLATE.md:115-118`).
  - The §10 heading requires each correction round to end with a superseded index, and so does round 12 (e).
  - **What clears it:** append Amendment 2, made of references only (record cap). It needs:
    - (1) a first line saying it was written after the gate results;
    - (2) a class 4 row: T7 by name, the M7 re-observation and the abort observation, each observed at e0442e0;
    - (3) a class 3 row for M10, observed at e0442e0. The superseded span is on an unmerged branch, so name it in words with its commit id and no hash, as round 25 (d) requires (`docs/PREREGISTRATION-TEMPLATE.md:174`): lines 1389-1391 of the test file at 5d3951f. That line range comes from the reviewer's gate-1 N1, and the 5-line shift above it fits T7's growth; the reviewer should confirm it at 5d3951f. The hash pin follows on main after the merge, as a class 3 row carried by a PLAN node blocked on this piece;
    - (4) the round's superseded index.
  - These rows also name the commit for these observations under §8 item 10. The closing record still owes 7680dc9 for the other gate-1 observations (my gate 1, item 10).

- **N: the paths-filter edit left one comment line about 115 columns long** (`.github/workflows/exposure-scan.yml:30`). This is cosmetic only and no rule is involved.

- **N: header wording against §1.** The header introduces its list as what section 1 lists. Its last item now says a person's flattened form, while §1's item names the scanning machine's own flattened form (form §1, the may-not-claim item on flattened forms). The header's wording is the correct reading of §1's second sentence, which says rule (iii) keys on the home of the machine that runs the scan. My gate 1 said to leave §1 as it is, which is append-only. No action.

- **N: safe-direction understatement.** A drive-less 8.3 segment directly after "Users", with no separator, is still refused on the runner by the (ii) remainder (`profile-path-scan.mjs:98`, `:181-200`). So "not refused here" is slightly broader than the truth, which errs in the safe direction. No action.

- **N: the worker's report names no tool commits.** It lists verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan without a commit. The closing record must name each tool's commit (§6 item 5; round 15 (c)).

**Checked and passing**

- **Gate-1 S2 discharged.**
  - `exposure-scan.yml:22-25` now states the gap correctly.
  - The local-profile rule takes `localName` from `path.basename(os.homedir())` (`profile-path-scan.mjs:629`) and applies it in rule (iii) (`:207-216`).
  - On the runner that name is `runner`, which is in `MACHINE_ACCOUNTS` (`:27`) and spared at `:216`.
  - So rule (iii) refuses nothing in CI, and a person's flattened form is caught only by an armed clone's hooks. This matches form §2 item 7 (header states what a green run does not mean) and §1's mechanism sentence.
- **Reviewer N4 taken.** `exposure-scan.yml:29-31` says "could skip". The claim is accurate and there is still no `paths` key (§2 item 7).
- **§8 item 6.** The header (`yml:3-31`) contains no quotation. The new comment text at `test.mjs:1301-1307` and `:1394-1397` has no quotation: its quoted strings are the test's own literals or the mutation's argument, not text from a named source.
- **No `verify-mutation` claim** appears in either comment (round 25, item 2 (c); §8 item 10).
- **M10's comment matches the code.**
  - Under the named edit, `resolveCommit` yields an empty string, and `!base || !head` (`profile-path-scan.mjs:522`) aborts cases 1 to 3.
  - In case 4, the merge-base `=== null` check (`:523`) no longer fires. The log read yields 1 commit, which matches the count line the worker observed.
- **T7 now proves the finding path.** The assertion at `test.mjs:1297` follows the refusal assertion at `:1296`. The abort observation shows the new assertion telling an abort apart from a finding, so may-claim 5 is now proved by a finding.
- **Round 25, item 2.**
  - No §7 overrun: 553 of 800 over 3 files, by the worker's count, which the reviewer should recount. No class 8 is owed.
  - The added assertion stays inside §4's T7 and the abort is an extra observation, so this is no scope addition and no class 9 is owed.
  - The record pins no test-text span by hash at a branch commit.
  - No five-line form is involved.
- **Seams and callers.** No new export, option or code path. The scanner is unchanged since 5d3951f, according to the worker's report and the custodian's filing note.

No ADR skeleton is needed.
