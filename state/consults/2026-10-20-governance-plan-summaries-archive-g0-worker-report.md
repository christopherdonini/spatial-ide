*Custodian's filing note (2026-10-20): the worker-high's report for governance D, built to G0 (the form's Amendment 1), in C:/dev/wt/psa from M0 81c34c8b28ac030f15ac4ecacdb72ff48aa66483; the head 2d60ac164e7a65e29e5e55a27eaa202062d31b83, pushed. The run 2026-10-20T22:40:57Z to 23:38:51Z by its transcript (Bash 102, Write 22, Read 6, Edit 1, Grep 1); its one SubagentHandback call, at 23:38:50Z. The harness marked the hand-back for a settings-file pattern: the report names R16's mutation, applied to a temporary copy, and no Write or Edit in the transcript touches a .claude path; every Write and the one Edit are in its scratch folder or its worktree. The branch's seven commits and the sheet's sha256 are checked against the report. The sheet is filed at `state/drafts/2026-10-20-plan-summaries-d-obligations-g0.md`, byte-identical. Extracted by script; the custodian's scratch-folder path written as <scratch>/ (1 place(s)), so that no user-profile path is tracked; one final newline added if absent; nothing else changed.*

---

REPORT, node:governance-plan-summaries-archive@g2. Built to G0. I stopped at S5 plus the G0 dry run, as ordered. S9, S10 and every summary move are untouched, and PLAN.yaml, the form and state/ are unchanged.

HEAD and COMMITS (branch cut/plan-summaries-archive, worktree C:/dev/wt/psa, all pushed, final HEAD equals origin/cut/plan-summaries-archive)
- Head: 2d60ac164e7a65e29e5e55a27eaa202062d31b83 (S5). Final porcelain: empty. `git status -sb` reads "## cut/plan-summaries-archive...origin/cut/plan-summaries-archive" with no changes.
- M0 = 81c34c8b28ac030f15ac4ecacdb72ff48aa66483.
- S1 d93607315ede2cc9c22a18a102d54db89337e05d: the script's exports and a main that stages the move; R1-R6, R8a-c, R9, R10, R13.
- S1 record 0d5cdbd44f86e1c7f023f3781e4071320be15e22: the RECORDED MUTATION comments for S1.
- S2 e11f7275a4c0a2b71ea2a5a46c0aca114e73e040: due rule, git-state refusals, nothing-to-move, --dry-run, obligationRows; R7, R11, R12, R14, R16.
- S2 record aaf6787a24aa962b06e268964ecc5b831e17816d.
- S3 a73689f3cc6245d9c3e14cd588ca0f9eb4ffebec: R15, the seam test from the real PLAN.yaml.
- S3 record f4a520c0a3e9105e8d4b3ce89b2e60ac470e1735.
- S4: NOT built. S0 shows no verify-quotes difference, so OPEN-2 (A) does not apply.
- S5 2d60ac164e7a65e29e5e55a27eaa202062d31b83: AUTONOMY.md §35 and the scripts/plan/README.md section.
- Each push was a separate call with exit 0, an ordinary update. Commits were `git commit -s -F <file>`, the messages written to new files in scratch, with the two trailer lines.

M (at M0, no commit; every run exit 0, run twice, second run byte-identical)
- M-1: stderr `measure-reads: routine 81c34c8b28ac030f15ac4ecacdb72ff48aa66483 block=4945 ledger=28850 entries=59 window_from=2026-10-13T22:32:05.000Z outside_window=0 pending=47598 total=81398`.
  - Stdout is 81398 bytes by wc -c, equal to total. Stdout sha256 a6bbf369ba9b8fdec5a3e5f1037589e6158a7f3f2badf274c35f16edd5a7609f. Stderr sha256 28b5ba5c5f530a562351c6c8c298f3d33b09e6d41ef8f5207e60aee43c64af69.
- M-2, in a clean worktree detached at M0 (porcelain empty before and after, both pipes "0 0", ripgrep stderr empty, 0 bytes):
  - Stdout `measure-reads: corpus 81c34c8b28ac030f15ac4ecacdb72ff48aa66483 files=1986 bytes=36290933`, sha256 3025b309d6daaf1a676b2a8fd26d82350ab896c0c0edc6771e271ad0289b0f4b.
  - Stderr `tracked_not_listed=573`, sha256 62206f56319a1c9a94cb39a6bca9ec65fdd3911b64d024e0b1f7a272c85737a6.
- M-3: `git cat-file -s 81c34c8b...:PLAN.yaml` is 695917 on both runs (stdout "695917\n", sha256 3cd6f1bf05d650b655d19f63d1fb1ab72269f5353a7218eabb6b223b11bf2927).
- Environment facts:
  - rg --version first line: `ripgrep 14.1.1 (rev 575938147b)`. C's closing record had `(rev de4bc695b7)`; the revision string differs from C's.
  - RIPGREP_CONFIG_PATH unset. core.excludesFile not set (local, global and system each exit 1).
  - info/exclude present, 541 bytes, sha256 321dffcb77a68a6c079d35da12944866b895b4cc9fb3b1fae72fe9468c7eafeb.
  - C:/dev/wt and C:/dev hold no .ignore, .rgignore or .gitignore.
  - claude --version `2.1.305 (Claude Code)`; node v24.18.1; git 2.49.0.windows.1.
  - `git show M0:scripts/plan/measure-reads.mjs | sha256sum` and the working file are both 7b2d33db229c9e7ca3f404370b2705a1c0485693fae7ef7ca5d8878e8bba92e1, equal to A's S1 digest.

S0 (throwaway worktree at M0, no commit; worktree removed)
- Seven checks before and after the hand move, in order: verify --offline, verify-cites, verify-quotes, verify-test-claims, verify-mutation, queue --check, site --check.
  - All exit 0, before and after. Stdout sha256 and stderr sha256 are identical before and after for all seven, so there are no differences.
  - The 16-character stdout prefixes before the move were: verify 53aec55cb893a299, cites e9c64d13e935a8bc, quotes a8791ce7f281a2a9, test-claims c9fcaeeda0a8be3b, mutation c5cd2f9c733b42c1, queue 8f25d0b08e28531d, site 00a50575e413af2d.
  - verify-quotes: "PASS 129 checked, 98 verified, 30 baselined, 1 advisory", unchanged.
- Counts by the parser: 312 nodes, 195 done, 153 candidates (done and over 300 UTF-8 bytes). The human's 151 of 193 was at b2433b78.
  - All 312 summary lines match `^    summary: "`.
  - Parsed summary bytes total 507,484.
  - Moved bytes 405,897. PLAN.yaml went 695,917 to 290,020 bytes, so the difference equals the moved bytes. The archive is 309 lines, which is 3+2N.
- Staged numstat: PLAN.yaml 153/153; site/data/plan.json 155/155; site/index.html 1/1; CUSTODIAN-QUEUE.md 1/1; CUSTODIAN-QUEUE.json 2/2; archive +309.
- Exposure scan over the staged diff: rc 0, "profile-path-scan: clean".
- Both drift checks pass after regeneration (queue --check and site --check exit 0).
- No S0 difference, so OPEN-2's condition is not met and S4 was skipped.
- verify-quotes --show-cites lists PLAN.yaml cites only as hash-pinned or line-count cites; none is a quoted passage.

TESTS AND MUTATIONS
- Each mutation was applied alone, the test file run, the failure read by name, the file reverted with `git checkout` and the porcelain shown clean (empty). Each is a RECORDED MUTATION comment in scripts/plan/rotate-plan-summaries.test.mjs naming the commit. None is a verify-mutation run.
- Suite: 18 tests, 18 pass at S5.
- Observed at S1 d9360731 (script mutated; "target only" means only the named test failed):
  - MR1 (archive line re-serialised from the parsed string) fails R1. Also fails R2-R6, R8a and R10, because the move is refused.
  - MR2 (unquoted plain scalar) fails R2. Also fails R1, R3-R6, R8a, R10 and R13.
  - MR3 (comment line above each pointer) fails R3. Also fails R1, R2, R4-R6, R8a, R10 and R13.
  - MR4 (`taken` always false) fails R4, target only.
  - MR5 (size counted with .length) fails R5. Also fails R1-R4, R6, R8c, R10 and R13.
  - MR6 (status filter removed) fails R6. Also fails R1-R5, R8c, R10 and R13.
  - MR8a (parsed-equality assertion removed) fails R8a, target only.
  - MR8b (ids compared as a set) fails R8b, target only.
  - MR8c (archive ids not in PLAN.yaml ignored) fails R8c, target only.
  - MR9 fails R9 only when applied at both parse sites. See the first difference below.
  - MR10 (marker matched by prefix and skipped) fails R10, target only.
  - MR13 (--keep ignored) fails R13, target only.
- Observed at S2 e11f7275: each of MR7, MR11, MR12 and MR14 fails its own test, target only. MR16 is applied to the test file only, and fails R16, target only.
  - MR7: empty archive written when nothing qualifies.
  - MR11: blob check removed.
  - MR12: glob widened to every file in state/cut-archive/.
  - MR14: --dry-run goes on to stage.
  - MR16: R16's reader path switched to the test's own temporary copy of the settings with one SessionStart entry running the script. No .claude/settings.json was edited.
- Observed at S3 a73689f3: MR15 (status filter dropped) fails R15 by name. It also fails R1-R6, R8c, R10, R13 and R7.
- Q1 and Q2: not built (S4 skipped).
- Test names are the form's §4 names, inserted by script from the form. The two lists `PLAN.yaml` and `.claude` references inside names are as in the form.

D1-a (M0 against S5, same worktree path)
- Exit code 0 for all seven, at both revisions.
- verify --offline, verify-quotes and verify-test-claims: stdout and stderr sha256 identical.
  - verify stdout 723b1b98cd8fc584; quotes a8791ce7f281a2a9; test-claims c9fcaeeda0a8be3b.
- verify-cites: stderr identical (0ee477fe5d0543af4048e3e979b44c7d4a0ee593167100cdc85fc29eabf73a8c). Stdout differs only by the file count, 2114 to 2116, which is the 2 new .mjs files (named exception).
- verify-mutation changes as declared: "PASS, all 18 new test(s) have a recorded mutation naming them".
- queue --check and site --check: identical.
- `node --test` CI globs: M0 tests 509, pass 509, fail 0; S5 tests 527, pass 527, fail 0. The rise is +18, which is the 18 new tests.
- No invalidator. I1 is not triggered.

G0 DRY RUN (run against PLAN.yaml at M0)
- Why a clone: the custodian's PLAN.yaml commit f7d7f853 is now on origin/main, so the script's blob check correctly refuses in the real worktree.
- I ran it in a throwaway local clone with a local bare origin whose main was M0 and whose branch was S5. Both were removed after. Output: dry run exit 0, stderr empty.
- Candidates 153; pointers found 0; kept 0; moved bytes 405897; the new PLAN.yaml blob 08beb67d731f29a4d3016f585148ee67060c7cf7; P is M0; the archive would be PLAN-SUMMARIES-2026-10-20.yaml (machine-clock UTC date).
- One obligation row per candidate (153 rows) in §7's markers and C's shape. The dry-run output is in scratch, sha256 03d6637dbfbbbb4333bf1b94e6851e87faae411f86c947e117a5c70c562131aa.
- The sheet is at <scratch>/psa-sheet-g0.md, sha256 f2f17760ce35134b71ce720ced20789d6ac94a24b6717614ddd8243a08a89af1. It is not committed, because the brief forbids state/.
  - It holds 153 rows, each with bytes, markers in both segments, the nodes, entries and items named with their status, and a proposal.
  - The classification is mechanical only. I did not resolve anything: resolution is the custodian's.
  - 87 rows have no marker in the current-state segment (proposed: no obligation).
  - 28 rows have markers plus a mechanical home: a named PLAN node not done, an open DECISIONS-PENDING entry, or a present KNOWN-LIMITATIONS item.
  - 38 rows have markers and no mechanical home (default stays unless the custodian proves not owed or no obligation).
- Default stays list (38): test-claims-landedness-bound, governance-test-claims-superseded-scanner, governance-test-claims-superseded-followups, adr-023-decision-text, engine-extension-autoload-off, governance-verify-mutation-multiline-attrs, governance-test-claims-withdrawn-marker, engine-tests-configured-connections, briefa-p6-part-n-acceptances, kernel-ticket-drop-under-registry-lock, kernel-ticket-drop-followups, crs-unit-fact-and-bounds, b1-engine-prereg-draft, shell-dependency-audit-piece, decision-n8-residual-late-writes, adr-031-lod-preregistration, data-plane-stream-registry-bound, bundle-viewer-partition-offset-bounds, corpus-reproducibility-record, catalog-open-drop-reproduction, governance-weekly-proposals-2026-09-26, catalog-open-replace-drop-latency-note, watcher-e5-pin-on-main, publish-refusal-codes-and-attempt-lifecycle, skp-cancel-state-closed-set, suites-and-toolchain-beyond-windows, watcher-first-read-on-watch-thread, port-1-linux-l1, test-claims-same-pr-superseded-pin, round-mirror-pretooluse-hook, lead-data-pilot-setup, subagent-write-audit-script, guardian-v0, evidence-recorder-v0, compaction-record-and-resume-line, guardian-n1-before-auto-compaction, source-changed-post-reopen-routes-watcher-visible, governance-cut-state-cap-and-rotation.

§7 FIGURES (counting command at S5 = head, merge-base M0)
- scripts/plan/rotate-plan-summaries.mjs 249 (declared 230)
- scripts/plan/rotate-plan-summaries.test.mjs 373 (declared 420)
- scripts/plan/README.md 12 (declared 30)
- AUTONOMY.md 19 (declared 42)
- Command output: `653 4`, against at most 800 lines over at most 6 files. The script overrun is +19 lines (class 8; §7 not edited).
- verify-quotes.mjs and its test: not touched (OPEN-2 not applicable).
- §8 item 7: `cmp -n <size of M0 file> <M0 file> <HEAD file>` exits 0 for both AUTONOMY.md and scripts/plan/README.md.

COMMANDS (exit codes)
- M-1 x2: 0, 0. M-2 pipes x2: 0 0 each. M-3 x2: 0.
- Seven checks at S0 before and after: all 0.
- Probe move script 0; queue.mjs and site.mjs generation 0, 0; scan 0.
- Test file runs: S1 12/12, S2 17/17, S3 18/18 (exit 0). Each mutation run was exit 1 except the single-site MR9 run, which exited 0.
- Seven checks at S5 pre-commit: all 0. D1-a seven checks at M0 and S5: all 0.
- CI globs `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` at S5 and M0. Each ran inside a shared hold (`hold shared -Project SpatialIDE`, release afterwards). The M0 run printed `node rc=0`. The S5 run exited 0 with `fail 0` in its output.
- verify-quotes --show-cites on the four changed files: exit 1, `FAIL: AUTONOMY.md:395 and :399 "quote not found"`, because a scoped run searches only the four files. The full verify-quotes run exits 0 at S5. I did not run the scoped form at M0, so I do not know whether it already failed there.
- Dry run exit 0. Counting command `653 4`.

DIFFERENCES FROM THE FORM
1. **Two commits per step.** Each step is a code commit, then a "record" commit adding only the RECORDED MUTATION comments naming the observation commit, as C did (e8d92a1a, then 4d2cf215). The comments cannot name their own commit. S5 has no mutations, so it has one commit.
2. **MR9.**
   - Caught at loadPlan alone, R9 still passes: verifyMove's own parse refuses with the line number. That run exited 0, 12/12 pass.
   - I recorded MR9 as caught at both parse sites (loadPlan and the parse check in verifyMove). That fails R9 only, and the comment says so.
3. **verifyMove returns a list of problems** (every assertion runs) instead of throwing. R8a, R8b and R8c assert the specific problem prefix (`parsed:`, `ids:`, `ids outside PLAN.yaml:`). Otherwise the overlapping byte and id checks would also refuse, and MR8a, MR8b and MR8c would not fail their tests.
4. **R8a's CLI half.** A real round-trip mismatch is unreachable through the CLI, so the CLI half shows a locator refusal (a node written as a bare `-` item). The verifyMove half is the round-trip case.
5. **obligationRows and its imports landed in S2, not S1.** This keeps the export from landing without a caller. Callers by grep in the script: findCandidates at main line 188, buildMove 208, verifyMove 209, obligationRows 219, pointerFor inside buildMove, isPointer inside findCandidates.
6. **Extra refusal and imports beyond the form's list.**
   - The script refuses when the PLAN.yaml on disk is not the one at HEAD.
   - It also imports validatePlan, PlanValidationError, YamlSubsetError and node:assert/strict. No second YAML reader.
7. **AUTONOMY placeholders.** Amendment 1 did not supply the resolved text, so I resolved the placeholders by script (§35 and §34).
   - The pin is the directive's line 23 @ M0 81c34c8b28ac030f15ac4ecacdb72ff48aa66483, sha256 2df8ce388e1588d1cd2620548b20312b90080504eddcc14db2444a6b5cdf18ff. The item-6 words (after the label `6. The rule, for AUTONOMY and scripts/plan/README.md: `) were byte-copied by script. The same script wrote both appended blocks.
   - The verify-cites and verify-quotes hash pins for both new sections pass.
8. **The G0 dry run was run in a throwaway local clone, not the worktree** (see G0 above), because the blob check refuses once main's PLAN.yaml differs.
9. **R16 has a positive control**: the same reader finds the hook in a temporary copy with an added entry, and returns an empty list for the real settings.
10. **Throwaway worktrees**: psa-m0, psa-s0 and psa-d1, all removed. The clone psa-g0 and its bare origin (psa-g0-origin.git) were created and removed under C:/dev/wt/.

PRE-GATE SELF-CHECK (the four classes)
- Cross-module interfaces: the script uses the actual exports of plan.mjs (loadPlan, validatePlan), yamlSubset.mjs, rotate-cut-state.mjs (archiveNameFor) and rotate-decisions-pending.mjs (isDue, parseUnits, classify), read before use. R15 is the one end-to-end test from the real shape.
- Completion claims: each points to a named test or a command exit above.
- User-facing messages: the refusal, not-due and dry-run lines describe behaviour implemented at S2.
- Required tests reach their assertions: every test was mutation-checked as above.
- Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

OFF-SCOPE NOTICED, NOT DONE
- The scoped verify-quotes --show-cites exit 1 above.
- A stray `python -` of mine (PID 28564) hung on an unintended heredoc; I killed it by that PID only. The two python processes now listed are not mine.
- The ripgrep revision string differs from C's record, as noted under the environment facts.

FINAL STATE: branch head 2d60ac164e7a65e29e5e55a27eaa202062d31b83 on origin; worktree C:/dev/wt/psa has an empty porcelain.
