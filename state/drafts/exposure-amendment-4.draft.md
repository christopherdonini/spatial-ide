*Custodian's note (2026-09-27): the architect's draft of Amendment 4 to scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md for PLAN node `exposure-profile-paths` (gate 1's fix round, at `980b10c`), saved as returned from the hand-back message with the harness's two-space indent removed. The amendment text is the part between the two rules; a worker appends it byte for byte. Three lines of it are substituted as the architect re-issued them after the gate-1 reports moved under `state/consults/gates/` at 0ffe80c (its second hand-back: the Sources line and the A and R paths); no other line differs from the first hand-back.*

---

governance/exposure-profile-paths @ 980b10c (read in the worktree `C:/dev/wt/exposure-profile-paths`; main read at 252cdd1). **Verdict: BLOCK. Gate 1 still stands.** Below is the drafted Amendment 4, which sends one worker fix round. I had no Bash, so every commit, byte and hash fact is the reviewer's to recompute.

The draft quotes nothing, contains no path-shaped example and reproduces no profile-naming string. It uses no `path:line` token and pins no hash at a branch commit. Branch commits are named by id, in words.

Save the text between the rules as returned. It goes at the end of §10 of `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` on the branch.

---

**Amendment 4 — the gate-1 fix round. Class 1: written after gate 1's results were seen. It is declared before any code of this round, and it states what it supersedes (the index at its end).**

*Sources.* Gate 1 was reviewed at `governance/exposure-profile-paths @ 980b10c`. Its two reports are filed on main at 0ffe80c, under AUTONOMY.md §25(b):
- A = `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-architect.md`
- R = `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md`

Findings are cited by report letter and id (for example A-C1). Rulings are cited by round and item. Nothing below is quoted: every description of a ruling or a report is a paraphrase.

**4.0 Findings, merged by identity.**

| # | Finding | A | R | Where it is settled |
|---|---|---|---|---|
| F1 | an added line beginning `++` is never scanned | C4 | C1 | 4.1(d) |
| F2 | the CLI entry fails open (a space in the path, or a link) | C2 | C2 | 4.1(b), 4.1(c) |
| F3 | the scissors cut in `--message` | C1 | — | 4.1(a) |
| F4 | printed path names can carry a segment | C3 | — | 4.1(e) |
| F5 | the local profile's flattened form is missed | C5 | C3 | 4.1(f) |
| F6 | cherry-pick and rebase pass the hooks | — | C4 | 4.2 |
| F7 | the hook's message misstates the scanner's status | D5 | — | 4.1(c) |
| F8 | an 8.3 segment with no drive is missed | — | Suggestions | 4.1(g) |
| F9 | §4 rows the tests do not meet | E3 | D3 | 4.3, 4.5 |
| F10 | mutations with no observation commit; the pass count at 3a85540 | E2 | E2 | 4.4, 4.12 |
| F11 | the budget overrun | E1 | E3 | 4.6 |
| F12 | prediction 4's discharge; suites named with no commit; the re-derivation command; 2a′ checked at 209a9c3; the filtered cargo run | E4 | E1, D2, D4 | 4.7, 4.9, 4.12 |
| F13 | the index staging before the STOP; 41d0341 | disclosure 2 | E4, §8 item 1 note | 4.8 |
| F14 | the 2f corrections lack the ruling's content | D1 | — | 4.1(h) |
| F15 | the hook comment asserts a merge skip that is in effect | D2 | — | 4.1(i) |
| F16 | Amendment 3 restates claims in prose | D3 | D1 | 4.9 |
| F17 | the "wait" comments | D4 | Nits | 4.1(j) |
| F18 | Amendment 2's round-30 cite | D6 | — | 4.10 |
| F19 | 2g's sentence about the hook | D7 | — | 4.1(k) |
| F20 | N, and the final merge | disclosure 5 | — | 4.7 |
| F21 | the dead DCO merge skip | disclosure 1 | disclosures | 4.5 |
| F22 | `pre-merge-commit` | — | Suggestions | 4.2, 4.11 |
| F23 | `'\u2026'`, the unused `marker`, 41d0341's commit type | — | Nits | 4.11 |

**4.1 The change.** It supersedes the named clauses of 2c to 2g; none of them is edited. No file is added, so the file set stays the 19 of the header. No export is added.

- **(a) `--message` scans the whole message file.** 2c's scissors clause is superseded, and so is the scissors clause of §4's `commit_msg_refuses_a_profile_path_in_full_and_8_3_form` row. `findScissorsIndex` is removed, and its unused `marker` with it.
  - Reason, a paraphrase of A-C1 and R: the hook receives the message file as its only argument, so it cannot know whether git will cut at the scissors line. At git 2.49.0, under `-F`, git keeps those lines.
  - Declared limit: if git hands the hook a verbose diff below a scissors line, a profile path in that diff refuses the commit. This is a false refusal, and the hook never accepts because of it.
- **(b) The CLI's entry guard** compares `fs.realpathSync.native(process.argv[1])` with `fs.realpathSync.native(fileURLToPath(import.meta.url))`. On win32 both are case-folded.
- **(c) The hooks fail closed and name the scanner's status.**
  - On exit 0, `--staged` and `--message` print one stdout line, exactly `profile-path-scan: clean` (a declared value).
  - Each hook captures the scanner's stdout. It accepts only when the exit status is 0 and that line is the whole of stdout. Otherwise it refuses, with a message chosen by status:
    - exit 1 names a profile-path finding;
    - exit 2 names an aborted scan;
    - exit 3 names a canary that was not found;
    - exit 0 without the line names a scan that reported no result.
  - The hook exits with the scanner's status when that status is non-zero, and with 2 when the scan reported no result. The node-missing branch stays as 2d and 2e declare.
  - Each message states the scanner's fact and the hook's own refusal (the round 7 ruling on operator-visible text).
- **(d) `parseAddedLines` becomes stateful.** A `+++ ` or `--- ` line counts as a header only between a `diff --git` line and that file's first `@@`. Inside a hunk, every `+` line is added content.
- **(e) Nothing the CLI prints carries a refused segment.**
  - Every path it prints is printed as `redactSegments(path, localName).output`. That covers a finding's file, the `--message` argument, and each `--redact` and `--redact-segment` argument.
  - Where `ok` is false, the path is printed as `#<n>`, its argument index (a declared value).
  - §8 item 4 is the check.
- **(f) 2c (iii) also reads the local profile's flattened form.** The match is:
  - `Users` or `home`;
  - then a run of zero or more of `\`, `/` and `-`;
  - then `localName`, compared case-insensitively;
  - then the end of the text, or a character that is not a letter or digit.

  These are declared values. The machine-account sparing of round 30, item 1 is unchanged. §1's exclusion ("flattened forms other than the local profile's") now describes a met claim; nothing is narrowed.
- **(g) 2c (ii) is read to its letter.** An 8.3 segment after `Users` is refused with or without a drive: `Users`, either at a path start (2c (iv)'s boundary) or after a separator, then zero or more separators, then the 8.3 grammar.
- **(h) The two 2f corrections are rewritten.** These are the piece's own appended lines and are not yet merged. Each becomes one sentence stating the corrected result that round 28, item 1 records for that file, followed by 2f's references, with no path. To that extent, 2f's "references only" is superseded.
- **(i) The hook comment.** The piece's own 2d comment in `.githooks/commit-msg` is changed to say that the scan runs for every commit the hook receives, merges included. It asserts no DCO merge skip. The DCO block and its older comment are untouched (4.5).
- **(j) The two comments A-D4 names.** The mutation record is re-recorded under 4.4. The setup comment is reworded to state its purpose only.
- **(k) 2g's last sentence.** The last sentence of 2g's verification bullet is superseded. The rule text appended to `AI_DEVELOPMENT.md` (not yet merged) is corrected to say this: a quotation that drops the marker, or restores the segment, is not found by verify-quotes; a quotation that restores the segment is also refused by the hook.

**4.2 §1 is narrowed (class 5, on gate 1: R-C4 and R's merge-commit suggestion).** Round 28, item 1 is unaffected: it asks the commit-msg hook to refuse, which holds for every commit git runs that hook on.

- **What §1's second may-claim bullet now covers:**
  - commits made by `git commit`, including a merge that `git commit` concludes: staged added lines, staged path names and the message;
  - the commit that `git merge` creates itself: the message only (proven by the merge case in 4.3).
- **What may-not-claim gains:**
  - any commit created without running both `pre-commit` and `commit-msg`, including `git cherry-pick` and `git rebase` (both accepted in R's live run). No hook-level fix exists.
  - the staged content of a merge commit that `git merge` creates itself. R states that this path runs `pre-merge-commit`, which the piece does not add (4.11).

**4.3 Tests.** §4's rows are not edited. Each new test has one mutation.

New tests:

| Test | What it proves | Its mutation |
|---|---|---|
| `an_added_line_beginning_with_plus_plus_is_scanned` | an armed commit whose added line begins `++` and then carries an invented, unlisted full form is refused | restore 980b10c's unconditional `+++` header test |
| `the_cli_scans_from_a_path_with_a_space_or_through_a_link` | the shipped scanner exits 1 on an invented profile path when copied byte for byte under a directory whose name has a space, and when reached through a directory link (a junction on win32). On win32 it also checks a lower-cased drive letter; this is a regression case only, since R saw it correct at 980b10c | restore 980b10c's `isMain` comparison |
| `pre_commit_fails_closed_without_a_clean_line` | the shipped `pre-commit` refuses when a stub scanner at its relative location exits 0 and prints nothing | the hook accepts on exit status 0 alone |
| `commit_msg_fails_closed_without_a_clean_line` | the same, for the shipped `commit-msg` | the same, in `commit-msg` |
| `the_hooks_name_the_scanners_status` | with stub scanners exiting 2 and 3, the refusals name an aborted scan and a missing canary; neither names a profile path | one message for every non-zero status |
| `a_message_line_below_a_scissors_line_is_scanned` | `-F` and `-m` messages carrying an invented profile path below a scissors line are refused | restore the scissors cut |
| `the_local_profile_flattened_form_is_refused` | the shipped CLI, spawned with HOME and USERPROFILE ending in a listed invented name, refuses that name's flattened form (built at run time); a segment extending it by a letter or digit is not refused by (iii) | drop `-` from (iii)'s separator run |
| `refuses_an_8_3_segment_under_users_without_a_drive` | an 8.3 segment after a `Users` root with no drive is refused, with both separator styles | confine (ii) to the drive root and the POSIX roots |
| `no_printed_path_carries_a_refused_segment` | with the local name invented, a refused staged name, a `--message` argument and a `--redact-segment` argument, each under a Users-root directory named with that name, give the declared exit statuses, and neither stdout nor stderr contains the segment | print the raw path |

Changed tests:

| Test | Change | Mutation |
|---|---|---|
| `commit_msg_refuses_a_profile_path_in_full_and_8_3_form` | The scissors case moves, inverted, to the new scissors test. Two merge cases are added, both refused: `git merge --no-ff -m` carrying an invented profile path, and a `--no-commit` merge concluded by `git commit -m` carrying one | unchanged |
| `the_local_profile_is_refused_even_when_listed` and `the_local_profile_override_spares_machine_accounts` | Each spawns the shipped CLI, `--message <tmp>`, with the environment set, and asserts exit 1 and exit 0 respectively | unchanged; now observed against the shipped CLI |
| `a_scan_whose_git_read_fails_aborts_loudly` | Asserts hook exit 2, which §4's row states, and "aborted" | unchanged |

**4.4 Mutations and observations (class 4 for the existing tests; round 25, item 2 (c)).**
- Every test in the file is re-observed at one code commit, C, of this round. That covers the 21 existing tests and the 9 new ones. For each test: apply its recorded mutation, run the test, see it fail by name, revert.
- Each `RECORDED MUTATION` comment states the mutation and the observed failure only. C is named in the closing record, because a comment cannot name the commit it is in.
- R's seven re-observations are gate-1 observations at 980b10c. They are not the observations of record for this round's code.
- If the diff from C to the closing head is non-empty for the scanner, the test file or either hook, every affected test is re-observed at the closing head.

**4.5 DCO: a class 2 deviation, recorded. §4 and 2d are not edited.**
- §4's `commit_msg_dco_refusal_is_unchanged` row predicted that a merge skips DCO, and 2d assumed a working skip.
- At git 2.49.0, `commit-msg` receives one argument, so the skip never fires and an unsigned merge is refused. The proof is that test, run from the real shape, and R's disclosures section.
- §5's declaration that DCO behaviour is unchanged holds: R's §8 item 6 shows the base and head hooks agreeing on four cases.
- Fixing the skip changes local DCO behaviour, which is outside this piece (§5; §8 item 6). It goes to a follow-up PLAN node the custodian files as proposed. This piece gives only its title and summary.

**4.6 Budget: class 8, one amendment at the close.**
- **The class.** Class 8 is read to cover a full form's declared line budget and file count wherever the form declares them. This form declares them in its header. No other class fits: class 2 covers §3 and §5 predictions, and class 6 covers the short form.
- **What the class 8 amendment records:**
  - every header figure, declared against final;
  - the final figures by §21c's rule at C, three-dot from the merge base (R-E3 gives 1056 against 720 at 980b10c);
  - the reason.
- The Budget line is never edited.
- The minutes budget is the custodian's check, under `AUTONOMY.md` §10.

**4.7 Merges, N, and the re-runs.**

At each merge of `origin/main`, and last at the merge immediately before the PR is marked ready (2g):
- **N.** N is read by 2g's rule. At 252cdd1, main's highest Custodian-role amendment is 5, so N stays 6 unless main takes 6 first.
- **Re-runs at each merge M:**
  - (i) the three 2a′ checks against `origin/main...HEAD`;
  - (ii) the re-derivation with the fixed `scanText` and every rule, run at the merge base and again at M. Its one-line command goes in the closing record, with its output as path, form class and count, never a segment;
  - (iii) the node suites, unfiltered `cargo test -p spatial-kernel`, verify-cites, verify-quotes and verify-test-claims, each result named with M.
- **A hit in something main added after 16df0d7.** That means a file main added after 16df0d7, or a line that `git diff 16df0d7 <main tip>` shows main added. Such a hit is not invalidator 1:
  - it is listed by path and form class;
  - this piece leaves it untouched;
  - it is routed to one follow-up node, which the custodian files.

  Every other finding outside §3 still fires invalidator 1.
- **Prediction** (a Grep read of main at 252cdd1, not evidence): under 4.1(g), R's own report is such a hit, form class 8.3, from an invented example. No file that existed at 16df0d7 outside §2a is newly found.
- **If main moves after the closing record.** The final merge before ready appends one class 1 row with that merge's id, N, and the (i) to (iii) results, by reference.

**4.8 Disclosures (class 1).**
- **(a) Amendment 1's STOP clause** is read as covering commits only. `.githooks/pre-commit` was written and staged before that STOP, and was first committed in 3a85540 (the worker's report; R-E4).
- **(b) The worker's statement.** The worker states three things, which git cannot show:
  - `.githooks/pre-commit` was not on disk when 41d0341 was committed;
  - `commit-msg` had no scanner call before ccdccfd;
  - no commit used `--no-verify`.

  The statement is filed at `state/consults/2026-09-27-exposure-profile-paths-worker-e4-answer.md`.
- **(c) The segment in 41d0341.** 41d0341 adds, and 3a85540 removes, one unlisted-segment finding in a scanner comment.
  - The custodian classified it by script, without printing it: a generic example first name, not the local account, and not a person's profile. The net diff does not carry it (R §8 item 1).
  - The records cite branch commits by id, so the PR asks for a merge that keeps them reachable, never a squash. That merge carries the blob into main's history. The PR body says so.

**4.9 Amendment 3 and prediction 4.**
- Amendment 3 stays, append-only. The closing record, which is references and hashes only, supersedes it.
- **Prediction 4 is reduced** to what git can show (round 15 (b)). The reduced prediction:
  - every non-merge commit from ccdccfd to the last commit before the closing record scans clean in two ways: its message under `--message`, and every `+`-prefixed line of its `git show -U0 --format=` output under `scanText`;
  - every merge's message scans clean under `--message`.
- **Evidence.** The worker's run at M is the evidence, with its command in the closing record. The gate-2 reviewer re-runs it.

**4.10 A correction (class 3).**
- Amendment 2's cite for its unchanged-matcher sentence names round 30, item 1, which governs only 2c (iii)'s machine-account sparing.
- The corrected reference is round 29, items 1 and 4.
- The proof is the RULED blocks, as a paraphrase: item 1 adopts the draft's matcher; item 4 sets the POSIX roots and the three machine accounts.

**4.11 Nits and suggestions.**
- **In:**
  - the unused `marker` (4.1(a));
  - the "wait" comments (4.1(j));
  - the 8.3 segment with no drive (4.1(g)).
- **Out, with no record row:**
  - `'\u2026'` in 3a85540: behaviour-neutral, and the file is what is gated;
  - 41d0341's commit type: history is not rewritten, because the record cites these commit ids;
  - `pre-merge-commit`: it would be a twentieth file and is narrowed in 4.2.

**4.12 Withdrawals (class 1; round 15 (g)).**
- Amendment 3's first bullet, its test-count clause at 3a85540, is withdrawn. At 3a85540 one test of §4 fails (R-E2).
- Amendment 3's second bullet, its prediction-4 discharge, is withdrawn. Git cannot show that a hook ran (R-E1); 4.9 carries the reduced prediction.
- Amendment 3's re-derivation bullet and its suites bullet are superseded by the closing record's runs at M (A-E4; R-D2, R-D4).

**4.13 Order, invalidators and count.**
- **Order:**
  1. This amendment is committed before any code of the round.
  2. The code, tests and comments, plus the three doc fixes (4.1(h), 4.1(i), 4.1(k)), are committed, each commit typed to its content.
  3. At C: the node suites, every mutation of 4.4, and an empty `git status --porcelain`.
  4. Merge `origin/main` (4.7).
  5. The re-runs at M (4.7) and prediction 4 (4.9).
  6. Amendment 5 (class 8) and Amendment 6 (the closing record) are written, references and hashes only: C, M, N, the re-derivation command and output, the 2a′ results, the suite results named with M, the tests observed failing at C, and the prediction-4 command.
  7. Before committing step 6, the worker resolves each sentence of those amendments against the runs of steps 3 to 5, and STOPS on a mismatch.
- **Invalidators added:**
  - a test of 4.3 that passes under its mutation at C;
  - the file count passing 19.
- **Record-round count: 0.** This is an implementation round (Correctness FAIL under §22). A gate-2 FAIL on Documentation alone opens record round 1.
- **Class 9:** none. No standing rule adds work here.

**Superseded index. Read the last amendment first.**

Superseded:
- 2c's `--message` scissors clause, and the scissors clause of §4's `commit_msg_refuses…` row (4.1(a));
- 2f's "references only" (4.1(h));
- the last sentence of 2g's verification bullet (4.1(k));
- §1's second may-claim bullet and its may-not-claim list (4.2);
- §5 prediction 4 (4.9);
- the reading of Amendment 1's STOP clause (4.8(a));
- Amendment 2's round-30 cite (4.10);
- Amendment 3 (4.9, 4.12).

Recorded as deviations, not superseded:
- the merge clause of §4's DCO row, and 2d's merge-skip premise (4.5);
- the header Budget (4.6).

---

**The follow-up PLAN node, for you to file as proposed:**
- **id:** `dco-hook-merge-skip`
- **Title:** The local DCO hook's merge skip never fires.
- **Summary:** `.githooks/commit-msg` reads the commit source from `$2`, which git 2.49.0 never passes to `commit-msg`, so the local hook refuses unsigned merges that `.github/workflows/dco.yml` skips; align the local rule with CI's under its own form, since the fix changes local DCO behaviour.

**What must wait for the human** (none of it blocks dispatch):
1. **Optional, weekly window: the macOS shared folder.** The adopted rule refuses macOS's shared folder under `/Users/`, although that folder names no person. The draft flagged this as information only and asked nothing, and it has now produced a finding: the draft file that Amendment 2 disposed of. Exempting the folder would change the scope of round 29, item 4, so the call is the human's.
2. **Minutes.** If the node is past twice its `budget_minutes`, AUTONOMY §10 makes continue, narrow or drop a ruling for the human.
3. **The DCO fix is your routing call.** It relaxes a local check at commit time. It goes to the human only if you read DCO enforcement as a red line.
4. **Optional:** confirming the class-8 reading of a budget declared in the header. This is a reading, not a new class, so it needs no clause.

**Custodian notes:**
- File the worker's E4 answer at the path in 4.8(b), on main, before committing Amendment 4.
- **Filing under round 25, item 2.** `AUTONOMY.md` §25 is on main at 252cdd1, yet the gate-1 reports sit under `state/consults/`, not `state/consults/gates/`. Their filing notes also lack the `Reviewed: <branch> @ <commit id>` form. Check whether §25(b) had taken effect; either way, gate 2 goes under `gates/`.
- **My own gate report's D6** pointed at round 29, item 1 and the draft's line. 4.10 corrects that to round 29, items 1 and 4, because the draft is not a ruling.
- **Budget:** 4.3 adds about 250 test lines. The class-8 row carries them; they are not re-declared.

No ADR decision is missing.

Files:
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.test.mjs`
- `C:/dev/wt/exposure-profile-paths/.githooks/commit-msg`
- `C:/dev/wt/exposure-profile-paths/.githooks/pre-commit`
- `C:/dev/spatial-ide/state/consults/2026-09-27-exposure-profile-paths-gate1-architect.md`
- `C:/dev/spatial-ide/state/consults/2026-09-27-exposure-profile-paths-gate1-reviewer.md`
- `C:/dev/spatial-ide/state/consults/2026-09-27-exposure-profile-paths-worker-report.md`
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`
- `C:/dev/spatial-ide/AUTONOMY.md`
- `C:/dev/spatial-ide/DECISIONS-PENDING.md`
