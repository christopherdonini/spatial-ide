# Text-id's correction after its two build-gate read parts, the worker's report

*Filed by the custodian, 2026-11-27. The correction of ADV-2026-11-27-22 items 1, 2, 3, 5, 8 and 9 (the form's Amendment 15), made in D:/wt/textid from fc6d4b0098a08bc554f7f3ce15a1aa89564925cb, with no app, dev server or e2e suite started. A sonnet worker made it. Its run, from its completion notice only (ADV-2026-11-26-02), was 59 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (6469 bytes, sha256 71559d20ecb34bb65716a1313503f96a3615dd9f8a9b9637ea2fef76804428a0), byte for byte. Its account is the worker's. It is filed in this folder because its cites name lines at a branch commit. The custodian checked the head, its two commits and the diff's file count by git. No gate-log row: a correction is not a gate.*

---

Pushed head: 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e (origin/cut/text-id-opens-for-the-session-by-row-position). Every step completed, with one failing check that is not from my change (verify-mutation, below). Porcelain is clean.

COMMITS
- 01206b20a10673644ae87e8fa5d6ce4c85e7046a "fix: text-id's words after its two build-gate read parts (ADV-2026-11-27-22 items 1, 2, 3, 5 and 8)"
- 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e "test: text-id's E-c cases, R1 in the second scope and R2 in both (ADV-2026-11-27-22 item 9)"
- Both made with `git commit -s`. I typed no Signed-off-by line and no email. The sign-off line comes from git config.

SPANS (all DONE)
- One script, D:/wt/textid-logs/apply-words-1.mjs, read every Old and New from git-show copies of the ruling and the reviewer's read part. It printed each and refused unless each Old and each D-a fn line stood exactly once. All did.
- Ruling pairs 1 to 7, found by exact string, count 1 each:
  - (1) reopenNotices.ts, R-ENG second sentence.
  - (2) reopenNotices.ts, S-8 second sentence.
  - (3) reopenNotices.ts, R-ENG doc.
  - (4) reopenNotices.ts, S-8 doc.
  - (5) MANUAL-WALKTHROUGH.md, row AH7.
  - (6) AdmissionPanel.tsx, rowPositionOffer doc.
  - (7) SKP-V0.md, skp/0.16 entry.
- D1 in engine/src/error.rs, IdentitySetAsideRefused doc:
  - The Old span ran lines 177-179, from "Two of the three are" to "only beside the refusal.".
  - The New span is lines 177-183 after the edit.
  - A second script, d1-wrap-1.mjs, wrapped the ruling's paragraph at 100 columns. Line 177 kept its lead-in, and the paragraph's words were copied by the script.
  - The ruling's fence sits 3 lines after the "wrapped as that doc's lines are:" line (a blank line, the fence, then the text). My first read assumed 2. The script threw, and I fixed the offset.
- E-b, in the K-5 doc: one exact match.
- D-a:
  - The 8 session_tier fns and 1 scan_counts fn each got their doc line above `#[test]` (9 lines in all). Each fn pair matched exactly once.
  - dataset.rs got "This is N-9 …".
- D-b, in admitDataset.test.ts: one exact match.
- No test or check pinned an old text. Nothing was departed from, and no words of my own were written.

ITEM 9 (E-c)
- Test name: `a_set_aside_open_is_refused_in_the_current_view_scope_and_at_the_boundary_in_both_scopes`, plus the helper `open_set_aside`.
- It has R1 in the current-view scope and R2 in both scopes, with no destination, no staging folder and no audit record.
- Counts by `git diff --numstat`:
  - Beside K-U1 in kernel/tests/publish_identity_tier.rs: 66 added, 0 deleted. It is 67 after I wrapped a doc line past 100 columns.
  - In K-6's file, with the helpers copied in: 150 added, 3 deleted.
- I kept the one beside K-U1 and reverted the other. The diff of the discarded version is not in the commit.
- Interpretation: K-6 drives only the whole-dataset scope, which is `scopes()[1]`. So "R1 in the second scope" is the current-view scope, the one K-6 lacks.
- Scope cost: the test lands in publish_identity_tier.rs, which is outside §7, so it is class 9. The ruling says the overlap check on that file is yours.
- No product code was touched, and no new mutation was added.

CHECKS
1. `git diff --numstat fc6d4b00..HEAD`: 11 files.
   - Every changed line is in a span above or in the new test.
   - The 11 files are engine/src/dataset.rs, engine/src/error.rs, the two engine tests, MANUAL-WALKTHROUGH.md, AdmissionPanel.tsx, admitDataset.test.ts, reopenNotices.ts, the two kernel tests, and SKP-V0.md.
2. Counts by script at HEAD (`count-2.mjs`, then `count-1-run.mjs`):
   - The 7 ruling pairs, E-b and D-b: New 1, Old 0.
   - D-a dataset.rs: New 1, Old 1. The Old stands inside its own New, as the brief expected.
   - The 9 D-a fn lines: New 1 each.
3. `cargo fmt --all -- --check`: exit 0.
4. `cargo test --workspace --no-fail-fast` inside a shared hold: rc 0, with no failing binary and no `N failed` line above 0. Ignored tests exist, for example 19 passed, 3 ignored. The two largest binaries ran 225 and 195 tests, with 0 failed.
5. Shell, inside a shared hold: `npm run typecheck` exit 0. `npm test` exit 0, with 1697 passed (1697).
6. Verify scripts:
   - verify-cites: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 3809 file(s) resolves. (240 loose reference(s) advised above.)"
   - verify-quotes: PASS, 161 checked, 130 verified, 0 errors. Its exit code was not captured separately.
   - verify-test-claims: PASS, 971 claimed tests exist or are planned, superseded or withdrawn. Its exit code was not captured separately.
   - verify.mjs: rc 0, "verify:plan PASS".
   - verify-mutation with `--base 83812fd5ee7e211ea6c241321981132117851f0f --head HEAD`: rc 1, "FAIL — 5 of 36 new test(s) have no recorded mutation naming them".
     - It lists five misses in App.lateResult.test.tsx:877, conditions.test.ts:285, fixtures.test.ts:99 (the skp/0.16 set-aside fixtures test), client.test.ts:238 (openProject sends `set_aside_file_id`), and manual_walkthrough_fixtures.rs:524.
     - None of the five is in a file I touched or a test I added. They sit in the 83812fd5 to head range.
     - My new test is listed "ok". I left the five as they are.
   - `node --test` over scripts/plan, scripts/hooks and scripts/evidence: 623 pass, 0 fail. The shell exit code was grep's, but the log shows "fail 0".
- No check lacked a token or a network.

DEPARTURES AND NOTES
- First, my D-a regexes and the D1 offset were wrong. The Bash tool collapsed `\\` in my heredoc, so the script refused and changed nothing. I fixed the escapes and the offset, and re-ran the dry run before applying.
- The `hold shared` wait for the shell hold was long, because it queued behind the cargo hold. The shell run itself started after the cargo run finished.
- Disk at the cargo run: 41100 MB free on C: against the 40960 MB floor. The target is on D:.
- Model: Sonnet 5.5, with no model override and no context handoff.
- Pre-gate self-check:
  - Cross-module: the test uses `Catalog::open_cancellable_setting_aside_file_id` (kernel/src/lib.rs:242), `preflight_pinless` and `boundary::execute`. It builds on K-U1's helpers in the same file.
  - Every completion claim points to the checks above.
  - No new user-facing message was written. The words are the ruling's and the reviewer's bytes.
  - The new test reaches its assertions: it passed with R1 and the R2 refusal assertions.
- The D1 span is the doc in engine/src/error.rs, lines 177-183.
