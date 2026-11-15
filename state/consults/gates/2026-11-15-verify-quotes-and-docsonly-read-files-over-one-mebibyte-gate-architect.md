Reviewed: PR #325 at 536e664dfc5b6296148e951896025516b71648bb (the custodian's filing note, 2026-11-15: the architect, PLAN node verify-quotes-and-docsonly-read-files-over-one-mebibyte, under its form (`governance/forms/scripts/VERIFY-QUOTES-AND-DOCSONLY-READ-FILES-OVER-ONE-MEBIBYTE-PREREGISTRATION.md`), one of its two gates from dispatch; dispatched at 2026-11-15T09:19:46Z by the custodian's transcript, in the background, its prompt the brief's text without its final newline, the brief in the custodian's scratch folder (3754 bytes, sha256 8b70d0cbf24f4384c8070b38abd09f9289f3dd4d628c70d21ff4a57b58e38884); the run 2026-11-15T09:20:10Z to 2026-11-15T09:23:59Z by its transcript, 29 calls (Read 19, Grep 7, Glob 2, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; received at 2026-11-15T09:23:59Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 7690 bytes, sha256 e455affe244f864d3e0bf6ab93d5bc71e5952069be56949c0575421ee722f0aa, with this note added in its first line; its O1 goes to the advisor), gate architect
Branch: cut/verify-quotes-and-docsonly-read-files-over-one-mebibyte @ 536e664dfc5b6296148e951896025516b71648bb
Verdict: PASS

All cites below are at H in `C:/dev/wt/vqd` unless I say otherwise. The form and the rulings are cited on main at 1daef56a.

## Findings by class

**Correctness:** none.

**Evidence:** none. The commit chain is confirmed by `.git/worktrees/vqd/logs/HEAD` lines 3 and 4: 5ed2d503, then e46167d52fee, then 536e664d, with no reset or checkout between the two commits. I could not read the tree at e46167d. That the tests were already in commit A comes from the worker's report and the packet's numstat. The reviewer confirms it with git.

**Documentation:** none to fix before the merge.

**Observation:**
- O1 (for the advisor, not this PR). ADV-2026-11-15-09 item 9 (its file's line 39) ends with the words "the fix holds at any size a tracked file reaches". That is not true above `1 << 28` bytes. The form's §1, first May-not-claim bullet, already keeps it out of this piece, and no record in the diff repeats it. It goes to the advisor as a finding.
- O2. The two comments use the form `// RECORDED MUTATION at <commit>, applied alone and reverted: … -> fails by name: …`, not §2.3's literal `// RECORDED MUTATION:` token. That form is the repository's existing variant with a commit named (for example `scripts/plan/forms-layout.test.mjs:32`), and §4 asks for the commit. verify-mutation matches `/mutation/i` within 500 characters of the name (`verify-mutation.mjs:240-242`), so it is not affected. No fix is needed.
- O3. T2 proves that a plan over 1 MiB is read and parsed, and gives `[]` for an eligible edit. It does not exercise the priority or felt-verdict detection on a large plan. That detection is the same code path as the existing small-plan tests (`docsOnly.test.mjs:110-169`). T1 has the same shape: the mismatch branch is covered by the existing tests. This matches §4 as preregistered. Under Part 1 item 6 it is a note, not a condition.
- O4. Squash merging would leave e46167d off main. This repository merges with merge commits (`.git/logs/HEAD` lines 714 and 716: "merge commit not squash"), so the commit named in the comments will be on main after the merge.

## Checks

1. **§2.1 and §2.2.** The diff (packet patch lines 5-13 and 67-75) has one hunk per tool, each -1 +1.
   - `verify-quotes.mjs:657` adds `, maxBuffer: 1 << 28` after `stdio`, inside `gitShowFile` (655-661).
   - `docsOnly.mjs:73` adds it after `encoding`, inside `gitShow` (71-77).
   - Each line is exactly C1's `want` shape (form §9 C1). No comment, import or export changed.
   - docsOnly.mjs keeps its line count, so ADV-2026-11-15-10 item 5 (a) holds.
   - The docs-only node's summary (PLAN.yaml:7346 on main) is still true. Line 4 is the "may merge itself" header, line 18 is "safe to merge under delegation", line 196 is the NOT-eligible output and line 201 the eligible output. Its "docsOnly.test.mjs asserts no output string" is still true: T2 asserts only the array `checkDocsOnly` returns (`docsOnly.test.mjs:246`).
2. **§2.3, §2.5 and §4.**
   - T1 (`verify-quotes.test.mjs:1224-1234`) mirrors its model test (650-659). The fixture is 58 + 14000×79 = 1,106,058 bytes, inside F1's bounds. It uses the real export `runVerifyQuotes` (874) and reads `hashFindings`. Without the fix, the read gives null and line 788 returns `unresolvable rev`, so T1 fails. The worker's M1 shows exactly that.
   - T2 (`docsOnly.test.mjs:208-247`) uses the eligible-edit plan (171-206) plus 14000×79 bytes of comment lines, inside F2's bounds. `yamlSubset.mjs:76-77` skips those lines. It uses the real export `checkDocsOnly` (98). Without the fix, line 142 adds the "added or deleted" line and T2 fails. M2 shows it.
   - Assertion (1) in each test does not depend on the fix.
   - No import changed. `removeAfter` already exists (`movedFixture.mjs:59-61`), and T2's `t.after` is inline.
   - Both names are snake case with the prefix `a` (`verify-test-claims.mjs:105-110`), per OPEN-2. The ADV-2026-11-15-11 item 2 fence sentence is byte-equal to form line 137, after its bullet. No test is renamed.
   - Part 1 item 7: the tests run real git and real exports, with no test doubles.
3. **Comments.** The diff adds two, each one line.
   - docsOnly.test.mjs:208, clause by clause:
     - "at e46167d52fee": the first commit (reflog line 3), where the worker observed it. Holds on the evidence.
     - "applied alone and reverted": the worker's report, lines 10-13. Holds on the evidence.
     - "`maxBuffer: 1 << 28` removed from the options of gitShow in scripts/plan/docsOnly.mjs": the option exists at 73, inside gitShow. True.
     - "fails by name: `a_plan_yaml_over_one_mebibyte_is_classed_by_its_content`": the name at 209 is the failure recorded for M2. True on the evidence.
   - verify-quotes.test.mjs:1224: the same clauses hold, against `gitShowFile` at 657 and the name at 1225.
   - Neither comment has a rooted `path:line` or a bare `:line` (§2.3, §8 item 8). Both were written after the code (Part 1 item 1).
   - Neither calls a verify-mutation run an observation (round 25, item 2). Part 1 item 9 holds: the gates' own mutation observation is the reviewer's.
   - No replacement words are needed.
4. **§1, §5 and §8.**
   - §1: no record in the diff, and nothing in the worker's report, claims anything on the May-not list. The report quotes E3's eligible line as tool output and claims no merge licence from it. I did not read the PR body; it was not in the packet.
   - §5: the worker's E1 at H gives PASS with 0 hash-reference errors and exit 0. E2 gives PASS. E3 gives exit 0 with no offending line. The repository-wide verify-quotes PASS lines are byte-identical at base and head (`cmp` 0). All of this is as predicted. CI is green by the packet (read 09:14:31Z).
   - §8 items 1-10:
     - 1, 2, 4 and 8 hold by the diff.
     - 3: the two test files are small, by my reading. The reviewer runs C2.
     - 5 holds.
     - 6 holds: the commit is named, and no verify-mutation run is called an observation.
     - 7 holds: there is no PLAN pin in the comments, the commits or the report.
     - 9 holds: A's parent 5ed2d503 contains the form (27f4d167), its Amendment 1 and ADV-10 and -11.
     - 10: green by the packet.
5. **§7.** 4 files. Numstat 1/1, 41/0, 1/1, 12/0, total 57, under the ceiling of 80, against a projection of about 61. I counted the patch's + lines myself and got the same figures. There is no class 8 overrun and no class 9 scope addition. Time from the worktree's reflog to its last commit was 669 s. That is not the full run window, but it is well inside 60 minutes.
6. **Flags.**
   - (1) I cannot check it: the sed-copied scripts are outside the packet and outside the clean worktree. It does not bear on the gate, because the reviewer runs C1-C3 from §9 itself. The worker's C3 JSON matches the packet's numstat.
   - (2) Yes. The predicted other lines were "none". With zero offending lines, `main` prints line 201 and exits 0 (194-201). The eligible line is not an offending line, so §5 is met as written.
   - (3) Yes. T2 calls only `checkDocsOnly`. T1 calls only `runVerifyQuotes`. Neither runs a tool's command line; their git calls only build fixtures.
   - (4) Yes. The comments name the commit where the mutation was observed (§4, §8 item 6). It is a branch commit, but the comments pin no test text by hash, so round 25 item 2 is not engaged. The merge-commit practice (O4) puts it on main.

## Calls
Read 19, Grep 7, Glob 2, SubagentHandback 1.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.