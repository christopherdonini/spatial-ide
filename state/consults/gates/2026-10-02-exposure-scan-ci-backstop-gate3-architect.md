*Custodian's filing note (2026-10-02): the architect's gate 3 on PR #153, for PLAN node `exposure-scan-ci-backstop`, scoped to correction round 2 and the form's Amendment 2, full gating; the record cap's last round. Reviewed: cut/exposure-scan-ci-backstop @ 65793d6daac24dfa2e4ffe70eff55ca0f1bab645 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 65793d6. Verdict PASS, with the gate-2 S1 discharged and two S2s reduced under the record cap. The first, verify-mutation's commit, goes to the closing record. The second, the carrier for the deferred pins and the PR body, is met on main before the merge: a line on `workspace-rustfmt`, which is blocked on this piece, and the PR body's rows. Profile paths redacted at filing: none.*

---

VERDICT: PASS (cut/exposure-scan-ci-backstop @ 65793d6daac24dfa2e4ffe70eff55ca0f1bab645)

I read the commit from `.git/refs/heads/cut/exposure-scan-ci-backstop`, and origin's ref is the same. All cites are at 65793d6 unless I name another commit, and paths are relative to the repository root. I had no Bash, so I computed no hash and ran no git command. That means append-only for §0 to §9 and Amendment 1 rests on worker report 3 (its line 7) and the custodian's filing note, not on a diff I ran. The reviewer should confirm it from `git diff e0442e0 65793d6 -- scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`.

**My gate-2 S1 is discharged.** Amendment 2 is at `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:296-314`.
- **First line (`:298`):** it says it was written after gate 1's and gate 2's results were seen, and calls itself a post-result amendment, so §8 item 12's last bullet is met.
- **Class 4 row (`:301`):** names T7, the added finding assertion (`profile-path-scan.test.mjs:1297`), and M7 re-observed at e0442e0. The gate-2 reviewer's "Changes 3 and 4 hold" confirms that re-observation.
- **Class 3 rows (`:302`, `:305`):** both spans are named in words with their commit ids and no hash, as round 25, item 2 (d) and round 15 (e) require.
  - Lines 1389-1391 at 5d3951f: the gate-1 reviewer's N1 read them at 5d3951f.
  - Lines 1305-1307 at e0442e0: the gate-2 reviewer's S2-1 read them at e0442e0.
  - Each row has a defect, a corrected reference and a proof, within round 12 (d)'s ceiling.
- **Superseded index (`:311-314`):** covers round 1 (M10) and round 2 (T7's abort sentence). The original M7 record is extended, not superseded, so it rightly has no index row.
- **Discharge claim (`:304`):** it points at this amendment, and the amendment resolves: items 1 and 4 are what my S1 asked for (round 7).
- **Record form:** no `path:line` token, no hash, no bare self-line, no line cite into `DECISIONS-PENDING.md`.
- **Round 25, item 2:**
  - §7 is not overrun: 558 of 800 lines over 3 files at 0e07e55, per worker report 3 (the reviewer should recount). No class 8 is owed.
  - No scope addition, so no class 9.
  - No record calls a verify-mutation run an observation.
  - No five-line form.

**Comment hunks (§8 items 6 and 10): pass.**
- **T7 (`profile-path-scan.test.mjs:1305-1310`):** names the scoped edit and its effect on the root commit. It matches both the reviewer's scoped run at e0442e0 (gate-2 reviewer, S2-1) and worker report 3's run, `state/consults/2026-10-02-exposure-scan-ci-backstop-worker-report-3.md:16-18`. Its quoted strings are the test's own literals. It makes no verify-mutation claim.
- **T8 (`:1332-1334`):** the name is now in the header, like T1's. The observation matches the gate-1 reviewer's M8 row.
- **M10 (`:1398-1401`):** matches the gate-2 reviewer's case-4 run.

**Header hunks: pass.**
- `.github/workflows/exposure-scan.yml:23-26` now matches the code: `localName` is set at `profile-path-scan.mjs:629`, `runner` is in `MACHINE_ACCOUNTS` at `:27`, and it is spared at `:216`. This takes the reviewer's N-1.
- `:30-32` is re-wrapped and no line passes 100 columns (N-3).
- There is still no `paths` key and no concurrency block (`:34-38`), and the header quotes nothing.

**Findings**

- **S2 (reduced under the record cap, no round 3): a statement about a tool's behaviour without the tool's commit.** `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:306`.
  - The sub-line span `so that verify-mutation's window finds it` states verify-mutation's behaviour without the tool's commit.
  - The behaviour is true of the tree at 65793d6: `scripts/plan/verify-mutation.mjs:40` sets `MUTATION_WINDOW = 500`. But round 15 (c) and §6 item 5 require the commit, and absent the cap round 15 (c) would fail this by name.
  - This is the piece's second and last correction round, so under the record cap I reduce rather than fail. I read that clause as the reason from worker report 3 (its line 13), not as a record claim.
  - The closing record's §6 item 5 row, which already owes each tool's commit, names verify-mutation's commit as at 0e07e55, and that discharges it. No branch edit is needed.

- **S2 (precondition before merge, on main, not a branch change): the carrier for the deferred pins is missing.**
  - `:308` defers both hash pins to "the closing record" on main after the merge. That fits round 15 (e) and round 25, item 2 (d).
  - But (d) also requires two things: the pins are carried until then by a PLAN node blocked on the piece, and the PR body names the rows and asks for a merge that is not a squash (§8 item 13).
  - In the main checkout's PLAN.yaml, only `workspace-rustfmt` (`PLAN.yaml:3416-3432`) depends on this node, and it carries no pins. I did not see the PR body.
  - Before merge, the custodian adds a node, or a line on an existing blocked node, carrying the closing record's owed items:
    - the two class-3 hash pins, at 5d3951f and e0442e0;
    - 7680dc9 as the observation commit for M1 to M13 (my gate-1 item 10);
    - e0442e0 for M7's re-observation and the scoped abort;
    - each §6 item 5 tool's commit, including the reduction above;
    - the gate-1 reviewer's N3 and the gate-2 reviewer's N-2.
  - Then confirm that the PR body names the rows and asks for a merge commit.

- **N: the round-1 lead omits the architect's gate-1 N2.** `:300` lists only the reviewer's N1, N2 and N4. The T7 assertion also answers the architect's N2 (gate-1 architect, its N2; the gate-1 reviewer's filing note says the two are the same finding). No action is needed; the closing record can name it.

- **N: the words form at `:305` and `:313-314` says "the test file" rather than the path.** It resolves to `scripts/hooks/profile-path-scan.test.mjs` through `:302`. The appended class-3 pins should write the full path in (d)'s form.

- **N: the abort row (`:305`) does not name its evidence file.** It resolves through the gate-2 reviewer report named at `:304` (S2-1, second bullet) and through worker report 3, lines 15-19.

- **N: the gate-2 reports named at `:304` were untracked in the main checkout at session start.** They are evidence, not Authority (round 14's rule as dated by the record cap's round), so this is not a defect. File them on main before merge so the form's paths resolve.

No ADR skeleton is needed.

Files:
- `C:/dev/wt/exposure-scan-ci-backstop/scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`
- `C:/dev/wt/exposure-scan-ci-backstop/scripts/hooks/profile-path-scan.test.mjs`
- `C:/dev/wt/exposure-scan-ci-backstop/.github/workflows/exposure-scan.yml`
- `C:/dev/wt/exposure-scan-ci-backstop/scripts/plan/verify-mutation.mjs`
- `C:/dev/spatial-ide/PLAN.yaml`
- `C:/dev/spatial-ide/state/consults/2026-10-02-exposure-scan-ci-backstop-worker-report-3.md`
