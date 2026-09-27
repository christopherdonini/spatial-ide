*Custodian's note (2026-09-27): the architect's draft of Amendment 7 to scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md for PLAN node `exposure-profile-paths` (gate 2's fix round, at `da80db0`), saved as returned from the hand-back message with the harness's two-space indent removed. The amendment text is the content of the four-backtick markdown fence; a worker appends it byte for byte. The custodian keeps 7.13's outward steps (push, draft PR, marking ready): the worker hands back after step 3 and again after step 8.*

---

governance/exposure-profile-paths @ da80db0: Amendment 7 draft (architect), for the custodian to save as returned. Reports read: A2 and R2 on main at 824e76e.

**One correction to my own gate-2 report first.** A2-E2 claimed that the merge-base re-derivation was never run. R2 shows it was. After M, the base of `origin/main...HEAD` is `00cf306`, and R2's table recomputes 30 files there. The defect is smaller: Amendment 6 calls two different commits "the merge base". 7.8(a) records that and withdraws my stronger reading.

**How the draft classes the RECORDED MUTATION comment corrections.** The draft files them as class 4: a mutation whose observed failure was described wrongly. It still names every superseded span in round 25, item 2 (d)'s words form, with its commit id and no hash, so the by-name failure cannot fire. Because they are class 4, it states that no post-merge class-3 hash row is owed. If you read them as class 3 instead, a PLAN node blocked on the piece must carry that post-merge row.

**Record-round count: 0.** R2's Correctness FAIL (C1) makes this an implementation round. A gate-3 FAIL on Documentation alone would open record round 1.

**Custodian's, outside the form:**
- `PLAN.yaml` has no `exposure-profile-paths` node, so AUTONOMY §10's 2× minutes stop has nothing to read.
- The 4.7 follow-up node is still to be filed. It takes the two files main added, the `T` filter and the punctuation-only segment.

The draft follows. Save the text between the fences.

````markdown
**Amendment 7 — the gate-2 fix round. Class 1: written after gate 2's results were seen. It is declared before any code of this round, and it states what it supersedes (the index at its end).**

*Sources.* Gate 2 was reviewed at `governance/exposure-profile-paths @ da80db0`. Its two reports are filed on main at 824e76e, under AUTONOMY.md §25(b):
- A2 = `state/consults/gates/2026-09-27-exposure-profile-paths-gate2-architect.md`
- R2 = `state/consults/gates/2026-09-27-exposure-profile-paths-gate2-reviewer.md`

Findings are cited by report and id (for example R2-C1). Rulings are cited by round and item. Nothing below is quoted: every description of a ruling or a report is a paraphrase.

**7.0 Findings, merged by identity.**

| # | Finding | A2 | R2 | Where it is settled |
|---|---|---|---|---|
| G1 | a content finding's file name is C-quoted by git, so a non-ASCII segment prints octal-escaped | — | C1 | 7.1(a) |
| G2 | a test sets HOME in Windows form, so it fails on governance-ci's POSIX runner | E1 | — | 7.3 |
| G3 | overlapping matches corrupt `--redact` and `--redact-segment` | N1 | — | 7.1(b) |
| G4 | `commit-msg`'s per-status messages are untested | E5 | E2 | 7.3 |
| G5 | the flattened-form test uses an unlisted name where 4.3's row says a listed one | — | E1 | 7.3 |
| G6 | node's own exit 1 (a load failure) is named a profile-path finding | — | Suggestions | 7.1(c) |
| G7 | `#<n>` is a finding's position, not an argument index | N2 | — | 7.5 |
| G8 | `--diff-filter=ACMR` leaves out type changes | N3 | Suggestions | 7.6 |
| G9 | the flattened-form separator run is narrower than 4.1(f)'s claim sentence | — | Suggestions | 7.2 |
| G10 | a punctuation-only segment is refused | judge item 4 | recomputed | 7.7 |
| G11 | Amendment 6 calls two different commits the merge base | E2 | — | 7.8(a) |
| G12 | the re-derivation and prediction-4 commands are absent; the range ends at HEAD | E3 | D1 | 7.8(b) |
| G13 | messages were scanned under `scanText`, not `--message` | E4 | D1 | 7.8(c) |
| G14 | the cargo result has no counts | — | D5 | 7.8(d) |
| G15 | discharge claims with no resolvable proof | D4 | D2 | 7.9 |
| G16 | Amendment 5's first line lacks class 8's words; its reason is prose | D5 | D4 | 7.10 |
| G17 | Amendment 6's Disclosure bullet, and its two quotations | D2, D3 | D3 | 7.11 |
| G18 | Amendment 6 restates claims in prose | D1 | — | 7.12 |
| G19 | the bare 4.1(k) reference in `AI_DEVELOPMENT.md` | D6 | Nits | 7.1(d) |
| G20 | "Observed:" clauses claim failures past the first failing assertion | — | Nits | 7.4 |

**7.1 The change.** It supersedes the named clauses of 2c to 2e and of Amendment 4; none of them is edited. No file is added, so the file set stays the 19 of the header. No export is added.

- **(a) A content finding's file name is decoded.**
  - In `parseAddedLines`, a `+++ ` header name that begins with `"` is C-unquoted before the `b/` prefix is stripped.
  - Unquoting covers the escapes git writes: backslash, double quote, the named control escapes, and three-digit octal byte escapes. The resulting bytes are decoded as UTF-8.
  - A name that cannot be decoded is printed as `#<n>` under 4.1(e).
  - The staged-name scan is unchanged, because it reads `-z` names.
- **(b) Overlapping refused matches count once.**
  - In `findMatches`, a refused match whose segment span lies inside another refused match's segment span is dropped. So each refused span is counted, printed and redacted once.
  - The exact-span dedup stays as it is.
  - A permitted match never removes a refused one.
- **(c) A finding is named only on a declared line.**
  - On exit 1, `--staged` and `--message` print one stdout line, exactly `profile-path-scan: refused`. This is a declared value that joins §7 beside 4.1(c)'s clean line.
  - Each hook names a profile-path finding only when the status is 1 and that line is the whole of stdout.
  - A status of 1 without that line names a scan that reported no result, and the hook exits 2.
  - Every other status is handled as 4.1(c) declares.
- **(d) The reference in `AI_DEVELOPMENT.md`.** The bare 4.1(k) reference at the end of Amendment 6 to the Custodian role's verification bullet is changed to name this form and its Amendment 4. That text is the piece's own and not yet merged.

**7.2 §1 is narrowed (class 5, on gate 2: R2's third suggestion).**
- §1's may-not-claim list gains the local profile's flattened forms whose separators include `_`, `.` or a space.
- 4.1(f)'s sentence that §1's exclusion now describes a met claim is read against 4.1(f)'s declared separator run only.

**7.3 Tests.** The rows of §4 and 4.3 are not edited. Each new test has one mutation.

New tests:

| Test | What it proves | Its mutation |
|---|---|---|
| `a_content_finding_under_a_non_ascii_local_name_prints_no_segment` | An armed commit refuses a staged file whose content carries an invented, unlisted full form. The file sits under a directory named with the listed name `josé`, and HOME (POSIX form) and USERPROFILE (Windows form) end in that name. Neither stdout nor stderr contains the name, or its octal-escaped UTF-8 bytes built at run time. | restore the bare `b/` strip with no unquoting |
| `a_redaction_counts_the_local_name_inside_a_longer_segment_once` | The local name is invented and unlisted, and a segment carries it followed by `.` and more characters, under a Users root and under a POSIX root. `redactSegments` puts one marker in place of the whole segment with count 1, `redactRoots` puts one token, and every other byte is kept. | exact-span dedup only |
| `the_commit_msg_hook_names_the_scanners_status` | 4.3's status test, against the shipped `commit-msg`, with stub scanners exiting 2 and 3 | one message for every non-zero status, in `commit-msg` |
| `a_scanner_load_failure_is_not_named_a_finding` | With a stub scanner that throws at load (node exits 1 and prints no stdout), both shipped hooks refuse, exit 2, name no result, and neither names a profile path. With the shipped scanner on an invented finding, both hooks name a profile-path finding and exit 1. | status 1 alone selects the finding message, in both hooks |

Changed tests:

| Test | Change | Mutation |
|---|---|---|
| `the_local_profile_is_refused_even_when_listed` | HOME takes the POSIX form of the same listed name, and USERPROFILE keeps the Windows form, as in its three sibling tests | unchanged; re-observed at C′ |
| `the_local_profile_flattened_form_is_refused` | The local name becomes the listed invented name `someuser`, so the test proves that (iii) overrides the list for the flattened form. The extension case extends that name. | unchanged; re-observed at C′ |

**7.4 Mutations and observations (class 4 for the corrected records; round 25, item 2 (c)).**
- The scanner, both hooks and the test file all change in this round. Under 4.4's last bullet, every test in the file (the 30 of 4.4 and the 4 new ones of 7.3) is therefore re-observed at one code commit, C′: apply its recorded mutation, run the test, see it fail by name, revert. C′ is named in the closing record.
- Each "Observed:" clause records the first failing assertion, because a node assert stops there. If the worker runs each sub-case separately under the mutation, the clause says so and records each result.
- The superseded clauses are all in `scripts/hooks/profile-path-scan.test.mjs` at da80db0. They are named in words, under round 25, item 2 (d): lines 124-125, 147-151, 181-183, 201-202, 274-276, 405-408, 462-468, 542-545, 746-748 and 802-804.
- These are class 4 rows (a mutation's observed failure described wrongly), not class 3 test-text rows, so no post-merge hash row is owed.
- R2's twelve re-observations at C (8f7698e) are gate-2 observations of record for C. They are not the observations of record for C′.

**7.5 A deviation (class 2).** 4.1(e) declares `#<n>` as the argument index. For a finding there is no argument index, so `<n>` is the finding's position in the printed list. No code changes for this.

**7.6 Out of scope.** `--diff-filter=ACMR` leaving out type changes is declared by 2c's own text and is not changed here. It is routed to 4.7's follow-up node.

**7.7 A limit (class 1; A2's judge item 4, confirmed by R2's recomputation).**
- 2c refuses a segment made only of punctuation after a root. The one finding in the corpus preregistration is of this kind.
- The refusal is false and fails closed. 2g's route of listing the name does not apply to punctuation, so the line is reworded instead.
- It is routed to 4.7's follow-up node. A change to the segment grammar would change the matcher of round 29, item 1, which is the human's to decide.

**7.8 Corrections (class 3; round 12 (d)).**
- **(a) The two merge bases.** Amendment 6 uses "merge base" for two different commits. `16df0d7` is the merge base of M itself; `00cf306` is the base of `origin/main...HEAD` after M, and the 30-file run was taken there. The proof is R2's re-derivation table, on which A2-E2's reading that the run was absent is withdrawn.
- **(b) The commands and the range.** Amendment 6 gives no re-derivation or prediction-4 command, and its range ends at a moving HEAD. The runs of record at M are R2's re-derivation and prediction-4 runs, first-parent from ccdccfd to M, 8 commits, and the commands are recorded at M′ (7.13). The proof is R2's section on what it recomputed from the tree.
- **(c) `--message`.** 4.9 orders messages scanned under `--message`, but Amendment 6 used `scanText`. The run of record is R2's prediction-4 run under the shipped CLI's `--message`, in the same section of R2.
- **(d) The cargo counts.** Amendment 6's cargo result has no counts. The counts at da80db0 are in R2's suites table, and the counts at M′ go in the closing record.

**7.9 The discharge map (round 7; A2-D4, R2-D2).** Amendment 6's discharge line is superseded by this map.

| Item | Proof |
|---|---|
| 4.1(a) | `a_message_line_below_a_scissors_line_is_scanned` |
| 4.1(b) | `the_cli_scans_from_a_path_with_a_space_or_through_a_link` |
| 4.1(c) | `pre_commit_fails_closed_without_a_clean_line`, `commit_msg_fails_closed_without_a_clean_line`, `the_hooks_name_the_scanners_status`, `the_commit_msg_hook_names_the_scanners_status` |
| 4.1(d) | `an_added_line_beginning_with_plus_plus_is_scanned` |
| 4.1(e) | `no_printed_path_carries_a_refused_segment`, `a_content_finding_under_a_non_ascii_local_name_prints_no_segment` |
| 4.1(f) | `the_local_profile_flattened_form_is_refused` |
| 4.1(g) | `refuses_an_8_3_segment_under_users_without_a_drive` |
| 4.1(h) | the section "Dated correction (2026-09-27, exposure-profile-paths piece)" in `PUBLIC-AUDIENCE-AUDIT.md` and in `PRE-PUBLIC-CHECKLIST.md` |
| 4.1(i) | the scanner-call comment in `.githooks/commit-msg` |
| 4.1(j) | the RECORDED MUTATION comments, and the setup comment of `pre_commit_scans_added_lines_only` |
| 4.1(k) | the verification bullet of Amendment 6 to the Custodian role in `AI_DEVELOPMENT.md` |
| 4.2, 4.5, 4.10, 4.12 | declarative: Amendment 4's own text; for 4.5, the follow-up node on main |
| 4.3 | the tests named in 4.3's tables |
| 4.4 | superseded for C′ by 7.4 |
| 4.7 | open until M′ (7.13) |
| 4.9 | R2's run (7.8(b), 7.8(c)); M′'s run (7.13) |
| 7.1(a) | `a_content_finding_under_a_non_ascii_local_name_prints_no_segment` |
| 7.1(b) | `a_redaction_counts_the_local_name_inside_a_longer_segment_once` |
| 7.1(c) | `a_scanner_load_failure_is_not_named_a_finding` |
| 7.1(d) | the same verification bullet in `AI_DEVELOPMENT.md` |

**7.10 The budget (A2-D5, R2-D4).**
- Amendment 5's first line lacks the words class 8 requires, and its reason is prose.
- This round's code grows the figures further. The closing class-8 amendment, Amendment 8, therefore:
  - carries class 8's words in its first line;
  - records every header figure against its final figure at C′, by §21c's rule, three-dot from C′'s merge base;
  - gives its reason by reference to 4.1, 4.3, 7.1 and 7.3 only.
- Amendment 8 supersedes Amendment 5. The Budget line is never edited.

**7.11 A withdrawal (class 1; round 15 (g); A2-D2, A2-D3, R2-D3).** Amendment 6's Disclosure bullet is withdrawn, except its first fact: main moved to cec34b8 after M, and N is unaffected. The withdrawn text contradicts 4.7 and 4.8(c), and the piece lands by PR.

**7.12 Amendment 6 (A2-D1).** Amendment 6 stays, append-only. Amendment 9, the closing record, supersedes it and does not re-carry its restating clauses.

**7.13 Order, invalidators and count.**
- **Order:**
  1. This amendment is committed before any code of the round. Its sha256 matches the draft as returned.
  2. The code, tests and comments of 7.1, 7.3 and 7.4 are committed at C′, each commit typed to its content.
  3. At C′: the node suites, every mutation of 7.4, and an empty `git status --porcelain`.
  4. Push. A green governance-ci run on `ubuntu-latest` at C′ is the POSIX proof, and its run id is recorded. A red run STOPS the piece.
  5. Open a draft PR. Its body carries 4.8(c)'s request for a merge, never a squash; the narrowings of 4.2 and 7.2; and the routing to 4.7's follow-up node.
  6. The final merge M′ of `origin/main`, immediately before the PR is marked ready (2g, 4.7). At M′, re-run:
     - N, by 2g's rule;
     - 2a′'s three checks against `origin/main...HEAD`;
     - §3's byte-prefix check on the five append targets;
     - the re-derivation at the base of `origin/main...M′` and at M′. Each command is recorded verbatim, and each output as path, form class and count. A hit in a file main added after 16df0d7 is listed and routed under 4.7;
     - the node suites, unfiltered `cargo test -p spatial-kernel` with its counts, verify-cites, verify-quotes and verify-test-claims, each named with M′;
     - prediction 4 (4.9), first-parent from ccdccfd to M′, both named by id: messages under the shipped CLI's `--message`, added lines under `scanText`, with the command recorded verbatim;
     - 4.4's re-observation, if the scanner, the test file or either hook differs between C′ and M′.
  7. Write Amendment 8 (class 8, 7.10) and Amendment 9 (the closing record), references and hashes only: C′, the CI run id, M′, N, the commands and their outputs, the 2a′ and prefix results, the suites with counts, the tests observed at C′, and the discharge map by reference to 7.9.
  8. Before committing step 7, the worker resolves each sentence of those amendments against the runs of steps 3 to 6, and STOPS on a mismatch.
  9. Push. When governance-ci is green, the PR is marked ready. If main moves after the closing record, 4.7's last bullet applies.
- **Invalidators added:**
  - a test of 7.3 that passes under its mutation at C′;
  - the file count passing 19;
  - a red governance-ci run at step 4 or step 9.
- **Record-round count: 0.** This is an implementation round (R2's Correctness FAIL under §22). A gate-3 FAIL on Documentation alone opens record round 1.
- **Class 9:** none. No standing rule adds work here.

**Superseded index. Read the last amendment first.**

Superseded:
- 4.1(c)'s handling of status 1 (7.1(c));
- 4.1(f)'s met-claim sentence, now read against the declared run, and §1's may-not-claim list, which gains an entry (7.2);
- the "Observed:" clauses at the spans named in 7.4 (7.4);
- 4.4's observation commit, C, for every test, now C′ (7.4);
- Amendment 5 (7.10);
- Amendment 6: its discharge line (7.9), its Disclosure bullet (7.11), and the whole amendment (7.12), with corrections at 7.8.

Added:
- §7 gains the refused line (7.1(c)).

Recorded as deviations, not superseded:
- 4.1(e)'s argument index, for a finding (7.5);
- the header Budget (7.10).

Recorded as a limit:
- the punctuation-only segment (7.7).
````
