*Custodian's filing note (2026-09-27): gate 1 (attempt 1), architect, full gating, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ 980b10c08cb9de2c5c133ecc46e65770bfcec293. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b): first filed at 252cdd1 under `state/consults/` with its cites rewritten, a misfiling corrected here. The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed.*

---

governance/exposure-profile-paths @ 980b10c — **Verdict: BLOCK** (architect, gate 1, PLAN node `exposure-profile-paths`)

I read the worktree `C:/dev/wt/exposure-profile-paths` as the tree at 980b10c (local, unpushed) and the rulings in the RULED blocks of `C:/dev/spatial-ide/DECISIONS-PENDING.md`. I had no Bash. Every per-commit fact, byte fact and live run below is the reviewer's to confirm. Cites into scanner, test, hook and appended files are at 980b10c. The form is cited by section and amendment. No profile-naming string is reproduced here.

## §22 verdicts

**Correctness: FAIL.** Severity: high. Scope: the scanner CLI and the commit-msg path. Disposition: an implementation fix round under a declared Amendment 4 (below). This is not a record round.

- **C1. The commit-msg scan has a scissors hole, and it is proven by the piece's own test.** `cmdMessage` drops everything below the scissors line (`scripts/hooks/profile-path-scan.mjs:373-394`). 2c ordered that, so the defect is the form's own, and it was the architect's design.
  - As I read git's cleanup rules, git truncates at the scissors line only when an editor is used: `--cleanup=scissors` without an editor falls back to whitespace cleanup, and `-v` also truncates. Under `-m` and `-F`, which is how agents commit, the lines below the scissors line stay in the committed message.
  - The test's `-F` case (`scripts/hooks/profile-path-scan.test.mjs:442-451`) commits a profile-shaped path below the scissors line and asserts the commit succeeds. If git keeps those lines, an armed commit whose message carries a profile path is accepted.
  - That meets §5's falsification condition and fails §1's may-claim and the prevention clause of round 28, item 1.
  - The test asserts an imagined interface: that git truncates at the scissors line for `-F`. That is a gate failure by name.
  - The reviewer confirms at git 2.49.0: after that case runs, `git log -1 --format=%B` in the temp repo still carries the line.
- **C2. The CLI fails open.** `isMain` compares `process.argv[1]` with `new URL(import.meta.url).pathname`, which is still percent-encoded (`profile-path-scan.mjs:466-474`).
  - In a checkout whose path holds a space, `%`, `#` or a non-ASCII character, `main()` never runs. The canary never runs, the process exits 0, and both hooks accept the commit unscanned.
  - Windows profile directories often contain spaces, so this is a realistic checkout path.
  - This contravenes round 27, item 2 (i) and (ii) (exit status checked, loud failure, canary before any result), which round 28, item 1 carries in as "the fixed scan with its canary".
  - The reviewer should also check drive-letter case (for example `c:` against `C:`) under Git Bash.
- **C3. §8 item 4 fires: the scanner prints a matched segment.**
  - A refused staged path name is pushed as `file: name` (`profile-path-scan.mjs:363-367`) and printed whole by `printFindings` (`:417-420`). With the local profile name in the path, the hook writes that name to stderr.
  - `--redact` and `--redact-segment` echo their argv paths (`:401`, `:411`). 2g tells the custodian to run `--redact-segment` on a scratch file. On this machine the scratch and temp directories lie under the profile, so used as 2g directs, the tool prints the profile segment.
  - The same applies to `--message` in a linked worktree whose gitdir lies under a profile.
  - Disclosure 4's temp-directory occurrence is this channel.
- **C4 (note).** `parseAddedLines` reads any line beginning `+++` as a file header, even inside a hunk (`profile-path-scan.mjs:274-284`). An added line whose content begins `++` is therefore never scanned. This fails open on a contrived shape. Track the header and hunk state.
- **C5 (note).** Rule (iii) says "with or without separators". The implementation does not catch hyphen-substituted flattening of the local profile, which is the flattening this environment produces: `LOCAL_NAME_ROOT` plus `SEGMENT_CHARS` read the segment as `-name-…`, which does not equal the local name.
  - §1's negative ("flattened forms other than the local profile's") implies the local profile's flattened form is covered, but no test exercises "without separators".
  - Record this as a limit in Amendment 4, or fix it with a test. It does not block by itself.

**Evidence: FAIL.** Severity: medium. Scope: the record and §4 conformance. Disposition: fixed in the same round.

- **E1. The budget overrun is not recorded as class 8** (round 25, item 2 (a)).
  - The header declares scanner ≤ 240, hooks ≤ 50, tests ≤ 430 and a total ≤ 720. The new scanner is 479 lines and the new test file is 531, so the code-and-test total is above 1,030 before counting the hooks.
  - The budget sits in the form's header, not in §7. Class 8 is still the only class for a full-form overrun, and I read it to cover the form's declared ceiling wherever the form placed it. The Budget line is never edited.
  - The reviewer gives the §21c count at the final head. The custodian checks the 300-minute budget against the 2× stop rule in the second directive (AUTONOMY Appendix A, item 10).
- **E2. No mutation has an observation of record** (round 25, item 2 (c)). Each `// RECORDED MUTATION:` comment gives no commit it was observed at, and Amendment 3 says the mutations were swept "in-session".
  - Under §8 item 8, the mutations are recorded but have no observation of record.
  - Cure: the reviewer's live run at a named commit becomes the observation of record, or the mutations are re-run at a named commit and that commit is recorded.
- **E3. §4 rows the tests do not meet:**
  - `commit_msg_refuses_a_profile_path_in_full_and_8_3_form` has no merge case, although §4 names one. 2d's "merges included" is therefore unproven.
  - `the_local_profile_is_refused_even_when_listed` and `the_local_profile_override_spares_machine_accounts` spawn a script the test writes itself, which copies the CLI's `localName` derivation (`test.mjs:164-215`). They do not spawn the CLI that §4 names, so a mutation of `profile-path-scan.mjs:425` fails neither test.
    - The second of these is the test the round 30, item 1 ruling names as its pin, so the pin must hold on the shipped CLI.
    - Fix: spawn `profile-path-scan.mjs --message <tmp>` with the env set and assert exit 1 and exit 0.
  - `a_scan_whose_git_read_fails_aborts_loudly` asserts exit 1 (`test.mjs:245`), where §4 says 2. The hook maps any non-zero exit to 1.
  - `commit_msg_dco_refusal_is_unchanged` asserts that an unsigned merge is refused. §4's row says a merge skips DCO. See disclosure 1.
  - Each of these is a class 2 deviation, or a class 4 correction where a test changes, and none is recorded. §4 is not edited.
- **E4. Discharge and tool claims that do not resolve** (round 7; round 15 (c)):
  - Prediction 4 is called "discharged" with no resolvable proof. The resolvable form: the scanner's `--message` over each post-2e commit message, plus a scan of each commit's added lines, at named commits.
  - §0 item 1 requires the re-derivation's command and output in the closing amendment. Amendment 3 gives neither, and it ran at 1190057, not at the head.
  - The suite results in Amendment 3's Suites bullet name no commit.
  - The 2a′ proof was taken on commit 209a9c3. 2a′ orders it against `origin/main...HEAD`, rerun after every merge.
  - §9 orders `cargo test -p spatial-kernel`. Only the filtered `--lib` module run is recorded.

**Documentation: FAIL.** Severity: medium. Scope: the append targets, the hook comment and the form's amendments. Disposition: fixed in the same round. Because Correctness and Evidence also fail, this is not the Documentation-only path.

- **D1. Neither 2f correction carries round 28, item 1's content** (round 28, item 1; 2f):
  - The ruling's correction is that the audit's and the checklist's "no flags" results came partly from a check that never ran. Neither appended correction says that.
  - `PRE-PUBLIC-CHECKLIST.md:437-441` has no predicate: it names references and asserts nothing.
  - `PUBLIC-AUDIENCE-AUDIT.md:275-281` points to the commit-message-body class as "named above". The audit above does not name that class or the seven commits. The only related line is the grep command itself, the check the consult found broken.
  - Rewrite each correction as one sentence stating the corrected result, with references and no path.
- **D2.** The new comment at `.githooks/commit-msg:12-14` states that a DCO merge skip is in effect. It never holds (disclosure 1), so the piece's own new text is false.
- **D3. §8 item 10 fires.** Amendment 3 restates in prose:
  - the mutation procedure the test file carries;
  - the content of 3a85540's message;
  - "matches §3" narratives;
  - the claim that verify-quotes' baselined entries are unrelated.
  Its first line also omits the post-outcome marker the form's own header requires.
- **D4.** Two comments in the test file carry mid-thought self-corrections ("wait"): the RECORDED MUTATION record at `test.mjs:84-87` and the setup comment at `test.mjs:326-328`. Reword the mutation record to the observed result only, and the setup comment to its purpose.
- **D5.** The hook refuses on any non-zero exit, and on exits 2 and 3 it still says the commit "carries a profile path" (`.githooks/pre-commit:16-18`; `.githooks/commit-msg:35-37`). The scanner's fact was "aborted" or "canary not found", so the message misstates it. Branch the message on the exit status.
- **D6 (note).** Amendment 2 cites round 30, item 1 for "the matcher is not changed". That ruling governs (iii) only. Round 29, item 1 and the draft's information-only line on the macOS shared folder carry the point.
- **D7 (note; the architect's own 2g text, landed faithfully in Amendment 6).** The sentence saying a quotation that drops the marker "is refused by the hook" is false for a dropped marker: an empty segment is a permitted placeholder under 2c. verify-quotes, not the hook, catches a drop.

## Block-on-sight, §8

1. **Real profile in added lines or file names: none seen** in the files I read. Byte-level check is the reviewer's.
2. **Untouched files; append prefixes: not fired as far as I read.** The four appends I read are at their files' ends. Bytes are the reviewer's.
3. **Equivalence proofs; JSON parse: open.** Amendment 3 took the parent blob of 209a9c3. That equals the base only if nothing between them touched those files. The reviewer recomputes.
4. **FIRES.** See C3.
5. **Lists: pass.** `profile-path-scan.mjs:21-22` holds exact names, no patterns.
6. **DCO behaviour change: does not fire.** See disclosure 1.
7. **Workflow change: none in the file set.** The reviewer confirms `.github/**` is unchanged.
8. **FIRES as a record defect.** Every mutation is recorded, but none has an observation of record (E2).
9. **Ledger line cite or bare self-line: none found.**
10. **FIRES.** See D3.
11. **Ledger change: pass on reading.** The reworded line is at worktree `DECISIONS-PENDING.md:1840`, in entry 49's status prose after the bracket that closes at `:1822`; this is branch-side reading at 980b10c. Numstat and the hunk check are the reviewer's, three-dot, rerun after the final merge.
12. **Human's words filed unredacted: vacuous.** The piece files no human words.
13. **Pass at this commit, conditionally.** N=6 was fixed by the rule at c48a8dc. See disclosure 5.

## Rulings against §2

- **Round 28, item 1: FAIL.** Held: history stays, and the hook exists. Failing:
  - C1 (scissors) and C2 (fail-open) defeat "refuses a message containing a user-profile path … with its canary";
  - D1: the dated corrections lack the ruling's content.
- **Round 28, item 2: met in substance, subject to C2.** The rewording, the fixture under an invented name, the immutable files untouched, the standing rule, and "blocks nothing" are all in place.
  - Amendment 2's disposition of the draft file is consistent with the ruling: its one finding is the macOS shared folder, which is not a person's profile. Leaving the file untouched follows from that. The "filed agent report" class Amendment 2 gives is the weaker reason.
- **Round 29, item 1: met.** Rules (i), (ii) and (iii) and the invented-name list are in place.
- **Round 29, item 2: met.** See `redact_segment_keeps_every_byte_but_the_segment`.
- **Round 29, item 3: met.** Entry 49 is reworded, and the lod README has a pointer line only.
- **Round 29, item 4: met.** The POSIX roots are refused, and `runner`, `user` and `root` are on the machine-account list.
- **Round 29, item 5: met.** No CI change (2h).
- **Round 30, item 1: implemented at both sites** (`profile-path-scan.mjs:55-60` and `:140`). The pin is not on the shipped CLI (E3).

## Round 25 checks

- **Class 8: FIRES** (E1).
- **Class 9:** no standing rule added work after the form was committed; round 30 was in its Authority from commit. Pass.
- **A `verify-mutation` run called an observation:** none. Pass. The observation-of-record commit is missing, which is E2.
- **A test-text span pinned at a branch commit:** none.
- **A five-line form with a §21a Out-of-scope:** not applicable; this is the full form.

## The worker's disclosures

1. **DCO merge-skip.**
   - At git 2.49.0, `commit-msg` receives one argument, the message file. The source argument belongs to `prepare-commit-msg`. So `${2:-}` is always empty, before this piece and after it.
   - The old early exit and the new inverted guard (`.githooks/commit-msg:19-28`) decide DCO identically for every value of `$2`. **DCO behaviour is unchanged, and §8 item 6 does not fire.**
   - The pre-existing defect is a seam written to an imagined interface, and it predates this piece. Its effect is that the local hook refuses unsigned merges, which `dco.yml`'s header says CI skips. That makes the local hook stricter than CI, not weaker.
   - How to record it:
     - (a) A class 2 deviation in Amendment 4. §4's DCO row and 2d's premise of a working merge skip are false at git 2.49.0, and the tool version is named. The evidence is the test `commit_msg_dco_refusal_is_unchanged` from the real shape, which the reviewer confirms live. §4 and 2d are not edited.
     - (b) Correct the comment (D2).
     - (c) File a ledger finding and a proposed PLAN node for the dead branch. Fixing it changes DCO behaviour, which is outside this piece under §5 and §8 item 6.
2. **`.githooks/pre-commit` staged before the STOP.** No harm to the record: the file was gated where it landed, in 3a85540. Amendment 1's statement that no further step was executed should be read as "nothing further committed". A one-line class 1 disclosure goes in Amendment 4.
3. **Two matcher fixes.** Both were made before the scanner's first commit and stay within 2c's letter: 2c names no explicit `HEAD` argument, and the self-scan test did its job. They are not deviations. The initial-commit path is exercised by the end-to-end tests. The record references 3a85540 and does not restate it.
4. **The transcript.** This is outside every claim of the piece, since §1 covers tracked text and messages. No record entry is owed.
   - The custodian runs the redaction on the worker's hand-back, and on this gate's reports, before filing. 2g is not on main yet; apply it now voluntarily.
   - The temp-directory channel is C3, and C3's fix closes the tool's share of it.
5. **N = 6.** 2g binds at the merge immediately before the PR is marked ready.
   - At that merge, the worker reads N from `git show origin/main:AI_DEVELOPMENT.md`. If main has taken 6, only the heading is renumbered.
   - A closing record names N and that final merge commit, so Amendment 3's c48a8dc becomes the non-final merge.
   - The 2a′ checks and the head re-derivation are rerun after that merge.
   - Declare now what a re-derivation hit in a file main added after 16df0d7 means: list it by path and form class and route it to a follow-up node, or STOP. Without that, invalidator 1 can fire at every merge while main files unredacted reports.

## Amendment 4 skeleton (for the custodian to dispatch; class 1 post-gate, declared before any code)

- **Context:** gate 1 findings C1 to C3 and E1 to E4.
- **Decision:**
  - (a) 2c `--message` scans the whole message file. Its scissors clause and §4's scissors clause are superseded, and neither is edited.
  - (b) `isMain` uses `fileURLToPath`, or the CLI runs unconditionally.
  - (c) No path name or argv path is printed. Print an index or basename-free marker instead.
  - (d) The `+++` parse is made hunk-aware.
  - (e) The hook's messages branch on the exit status.
  - Tests, each with one mutation observed at a named commit:
    - a message below a scissors line is refused;
    - a checkout path with a space is still scanned;
    - a refused path name's segment is absent from stderr;
    - a commit-msg merge case;
    - tests 9 and 10 rewritten to spawn the CLI.
  - The class 8 overrun and the class 2 deviations of E3 and disclosure 1 are recorded.
  - The 2f corrections are rewritten (D1).
  - Amendment 3 is followed by a references-only closing amendment. Amendment 3 itself stays, append-only.
- **Consequences:**
  - The budget grows further, recorded under class 8 and not re-declared.
  - This round is an implementation round, so the record-round count stays 0.

## For the human (none blocking)

- **Optional, weekly window:** macOS's shared folder is refused by the adopted rule, although it names no person. The draft flagged it as information and did not ask about it. It has now produced a finding. Any exemption changes the rider's scope, so it is the human's call.
- **Custodian's routing call:** fixing the dead DCO merge skip relaxes a local commit-time check. Route it through the human only if the custodian reads DCO enforcement as a red line.

No ADR decision is missing.

Files: `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md`, `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs`, `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.test.mjs`, `C:/dev/wt/exposure-profile-paths/.githooks/commit-msg`, `C:/dev/wt/exposure-profile-paths/.githooks/pre-commit`, `C:/dev/wt/exposure-profile-paths/PUBLIC-AUDIENCE-AUDIT.md`, `C:/dev/wt/exposure-profile-paths/PRE-PUBLIC-CHECKLIST.md`, `C:/dev/wt/exposure-profile-paths/AI_DEVELOPMENT.md`, `C:/dev/wt/exposure-profile-paths/.github/workflows/dco.yml`, `C:/dev/spatial-ide/DECISIONS-PENDING.md`.
