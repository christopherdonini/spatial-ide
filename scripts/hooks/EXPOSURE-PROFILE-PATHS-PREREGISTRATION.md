# Preregistration — profile paths out of the tracked tree, and refused at commit (PLAN node `exposure-profile-paths`)

- **Authority:**
  - RULED 2026-09-26 — question round 28, items 1 and 2;
  - RULED 2026-09-27 — question round 29, items 1 to 5;
  - RULED 2026-09-27 — question round 30, item 1 (S7: the local-profile override spares the machine accounts, as 2c (iii) reads);
  - round 27, item 2 (the rider as clarified);
  - RULED 2026-09-26, the corpus positions, item (3) (the unexpanded-token reading).
  All are in `DECISIONS-PENDING.md`'s RULED blocks, cited by round and item.
  What was asked: `state/questions/round-28.md` and `state/questions/round-29.md`. Findings: `state/consults/2026-09-26-exposure-checks-rerun.md` and its custodian's addendum.
- **Drafted by** the architect agent: first read at `main` 9fbd956, revised to round 29 at `main` d6d9862 before commit. **Committed before any code**, on `governance/exposure-profile-paths`.
- **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line (`docs/PREREGISTRATION-TEMPLATE.md` §10).
- **Form: full**, both gates. Either reason alone forces it: 19 files is past `AUTONOMY.md` §21c's bound, and the piece appends to ADR-009's pre-public checklist (§21a, security posture).
- **Budget:**
  - ≤ 720 changed lines of non-generated code and tests: scanner ≤ 240, two hooks ≤ 50, tests ≤ 430, and the normaliser's one line.
  - Docs and evidence: 27 substituted occurrences across 8 files, plus ≤ 60 appended lines across 5 files.
  - ≤ 19 files. `PLAN.yaml` and its generated set are the custodian's and are not counted.
  - 300 minutes.
  - It blocks nothing (round 28, items 2 and 3).

## §0. Disclosure

1. **Enumeration.** The architect enumerated the files as reads with Claude Code's Grep tool (version not recorded):
   - the Windows forms at 9fbd956;
   - the two POSIX roots, and the ledger, at d6d9862.
   Under round 15 (c) these are reads, not evidence. The evidence is the worker's re-derivation at the branch base. It uses this piece's own `scanText` with every rule of 2c, including (iv), run as a one-off import. The command and output are recorded in the closing amendment. A file the re-derivation finds that §2a does not list STOPS the piece. This also covers any file that rule (iv) newly brings into scope.
2. **Counts.** The read finds 27 files that name a real profile. The addendum reported 25 at fe8f50f. The two extra files:
   - `state/cut-archive/CUT-STATE-residency-debt.md`, whose path has no drive letter;
   - `RELEASE-0.1.md`, whose quoted human verdict names a second real account.
   Both are immutable and stay unchanged.
3. **The normaliser fixture** in `kernel/src/permission/audit/normalize.rs` is a doc comment on `strip_component_prefix`. The module's tests already use invented names.
4. **No shared code with the corpus branch.** This piece does not import the corpus branch's fixed scan, because that scan is not on `main`. It writes its own matcher with the same three properties: a node matcher, the canary first, and the exit status checked.
5. No measurement, no fixture drive, no pilot.
6. **Revision before commit.** This text replaces the draft that went to the human as round 29's stop items. It is not an amendment: no outcome existed.

## §1. What this may and may not claim

**May claim:**
- the in-scope files of §2a carry no profile path;
- in a clone with `core.hooksPath` armed, a commit is refused if its staged added lines, staged path names or message carry a profile path in any form 2c refuses.

**May not claim:**
- that history is clean: the seven pushed commit bodies stay (round 28, item 1), and so do the immutable records, entry 110 of the ledger included;
- protection under `--no-verify`, in unarmed clones, in cloud sessions, in worktrees branched before this lands, or in CI (the backstop is round 29, item 5's proposal, outside this piece);
- coverage of UTF-16 content, or of flattened forms other than the local profile's;
- coverage of home forms other than the Windows Users root, `/Users/<name>` and `/home/<name>`; for example `/root`, `/var/home/<name>` and `~<name>` are not covered;
- that a filed copy carrying `<redacted:profile>` is byte-exact to the words as received beyond what the tested transform proves (the words as received are not tracked);
- any docs/08 number.

**Scope limits:** no wire change and no ADR amended. ADR-006 does not apply, because this is repository tooling, not a product operation.

## §2. The change

**2a. Record classes (`AUTONOMY.md` §22) and what happens to each file.**

**Substitution rule.** In each substituted file, every profile root is replaced by `%USERPROFILE%`. A profile root is:
- the Windows form: a drive (or `/c/`), then `Users`, then a segment;
- a POSIX form: a POSIX root of 2c (iv), then a segment. Its token would be `$HOME` (§7), but no in-scope file carries one at d6d9862.

The segment is refused by 2c. The rule covers the full form and the 8.3 form, with single, double or forward separators. Every byte after the segment is kept.

**Proof for the seven whole-file rows:** `--redact` over the base bytes (`git show <base>:<file>`) reproduces the head bytes exactly. The ledger's proof is line-scoped (2a′).

| File | Class, and why | Treatment |
|---|---|---|
| `state/drafts/statusline-context-proposal.md` (1) | current-state (a draft proposal) | substituted |
| `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md` (2) | draft (a design-reference copy) | substituted |
| `spikes/lod-feasibility/dep-check/inverse-trees.txt` (19), `full-tree-licences.txt` (1), `baseline/baseline-tree-licences.txt` (1) | spike outputs with no recorded generator command, so not §22 generated evidence | reworded, not regenerated: substituted, plus one dated line appended to `dep-check/README.md` naming this preregistration |
| `spikes/lod-feasibility/results/A_100k_5.0_simple_invalid_features.json` (1), `libduckdb_sys_vendored_spatial_scan.json` (1) | spike outputs; regenerating would re-measure | substituted; both must still `JSON.parse` |
| `DECISIONS-PENDING.md`, entry 49 (1) | status prose, current-state (round 29, item 3) | one line reworded (2a′) |
| `kernel/src/permission/audit/normalize.rs` (1) | the fixture (a doc comment) | the example's segment becomes `someone2` |
| `PUBLIC-AUDIENCE-AUDIT.md` | immutable (the audit report) | dated correction appended (2f) |
| `PRE-PUBLIC-CHECKLIST.md` | immutable by its own dated-entry rule | dated correction appended (2f) |
| `docs/adr/ADR-020-…` | accepted ADR | untouched |
| `DECISIONS-PENDING.md`, entry 110 | the human's words | untouched |
| `state/directives/2026-09-25-cloud-hooks.md`; `RELEASE-0.1.md` | the human's words, filed before round 29, item 2 | untouched (2g applies from filing forward) |
| `state/cut-archive/` ×5 (sqlfilter-panels-publish, residency-debt, 2026-09-24-post-tag-arc, 2026-09-13-release-0.1.0, adr009-checklist) | archives | untouched |
| `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`; `spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md` | append-only preregistration records | untouched |
| `state/consults/` gate reports ×3 (origin-non-ascii gate 1 and gate 2 reviewer; governance-weekly-proposals gate 1 reviewer) | gate reports | untouched |
| `state/consults/2026-09-17-p3b-re-scope.md`, `state/consults/2026-09-26-partition-offset-bounds-acceptance.md` | filed reports (hash-pinned adopted text; a run's report) | untouched |
| `spikes/lod-feasibility/README.md` (3) | the spike's dated results sections (round 29, item 3) | results untouched; one dated pointer line appended at the end, naming this preregistration and round 29, item 3, with no path reproduced |

**2a′. Entry 49's status prose.**

*The boundary.* Entry 49 runs from the ledger line beginning `49. **[RULED 2026-09-07` to the line before the one beginning `48. **[`. It has two parts:
- the ruling part: its bracket, from `49. **[RULED` through `Original entry follows.]**`, is immutable;
- the status prose (current-state): every line after the bracket, that is, the original entry text and the `Note appended 2026-09-14`.

*The line reworded.* The worker locates it mechanically: the lines inside entry 49 on which `scanText` reports a finding. Exactly one line is expected. It holds the F-1/F-2 fix-forward sentence's backtick span, which ends `\.claude\jobs\…`. If there are zero or several such lines, or the line falls inside the bracket, the piece STOPS.

*The proof it touches nothing else,* at gate against `origin/main...HEAD`:
- `git diff --numstat` on the ledger prints `1` added and `1` removed;
- `git diff -U0` shows one hunk, whose removed line is the located line;
- `--redact` over the removed line's bytes yields the added line's bytes exactly.

After every merge of main into the branch, the same three checks are rerun.

**2b. The normaliser.** One doc-comment line changes. No code and no test changes.

**2c. The scanner, `scripts/hooks/profile-path-scan.mjs`.** Node standard library only.

- **Core function.** `scanText(text, { localName })` returns findings (line number and form class). It never returns or prints a matched segment. The CLI passes `localName` as the basename of `os.homedir()`; tests pass it explicitly.
- **What it refuses:**
  - (i) a Windows full-form profile path: a drive or `/c/`, then `Users`, then a segment;
  - (ii) any 8.3 segment under `Users` (one to six characters, `~`, digits), with or without separators;
  - (iii) `localName` after `Users` or `home`, with or without separators. This overrides the invented-name list, and not the machine-account list (S7);
  - (iv) a POSIX home path: `/Users/` or `/home/`, then a segment.
    - The root counts only at a path start: at the start of text, or after a character outside `[A-Za-z0-9._~-]`. So `example.com/home/…` does not match.
    - Root names are matched case-insensitively.
- **What it permits:**
  - `Public` (any case);
  - placeholders: a segment wholly in `<…>` (this includes the marker `<redacted:profile>`), one beginning with `$` or `%`, `…`, `...`, or an empty segment;
  - the invented-name list: `someone`, `someone2`, `x`, `josé`, `someuser`;
  - the machine-account list: `runner`, `user`, `root` (round 29, item 4).
  Both lists are matched exactly and case-insensitively. Neither is ever a pattern, and neither ever admits an 8.3 form.
- **Canary.** `checkCanary(scan)` runs before any result counts. It feeds the scanner one full Windows form, one 8.3 form and one `/home/` form, all built at run time from invented parts, and all three must be found.
- **CLI modes:**
  - `--staged`, called by pre-commit;
  - `--message <file>`, called by commit-msg; it scans everything above git's scissors line;
  - `--redact <file>…`, which replaces each root by its token (§7) in place and prints a count per file;
  - `--redact-segment <file>…`, which replaces each refused segment alone by `<redacted:profile>` in place, keeps every other byte, and prints a count per file. A finding it cannot reduce to a segment exits 1.
- **Exit codes:** 0 clean · 1 found (refused; prints `path:line` and the form class) · 2 aborted (any git or tool failure or exception; prints "aborted") · 3 canary not found.
- **What `--staged` reads:**
  - the added lines of `git diff --cached --no-color --no-ext-diff --text -U0 --diff-filter=ACMR`;
  - the staged path names from `git diff --cached --name-only -z --diff-filter=ACMR`.
  It honours `GIT_INDEX_FILE`. Every git call's exit status is checked; a failure exits 2.
- **Merge reading.** When `MERGE_HEAD` exists, a line is refused only if it is new relative to every parent.

**2d. `.githooks/commit-msg`.** The DCO block and its merge skip are unchanged. After them, the hook calls the scanner with `--message "$1"` for every commit, merges included. It refuses on any non-zero exit. If node is missing (127), it refuses and says the scan could not run.

**2e. `.githooks/pre-commit`** (new, LF endings, mode 100755). It calls the scanner with `--staged` and refuses on any non-zero exit. It locates the scanner relative to `$(dirname "$0")`, and it is armed by the existing `core.hooksPath`.

**2f. Dated corrections,** appended at the end of `PUBLIC-AUDIENCE-AUDIT.md` and `PRE-PUBLIC-CHECKLIST.md`. They are references only:
- round 28, item 1;
- the re-run consult;
- in the audit only: the commit-message-body class, with the consult's seven commits, and a note that history stays.
No path is reproduced.

**2g. The standing rule.** Appended at the end of `AI_DEVELOPMENT.md` under this heading:

`## Amendment N to the Custodian role — a filed report's profile paths are redacted at filing (2026-09-27, appended on the human's rulings of question round 28, item 2 and question round 29, items 1, 2 and 4; appended here so that no line a record cites above it moves)`

**How N is fixed.** This preregistration does not fix N. At each merge of `origin/main` into the branch, and last at the merge immediately before the PR is marked ready:
- the worker sets N to one more than the highest number among the headings of the form `## Amendment <number> to the Custodian role` in `git show origin/main:AI_DEVELOPMENT.md`;
- if main has taken N since, a re-merge renumbers the heading, the heading only;
- the closing amendment records N and the merge commit that fixed it.
PR #129, expected to merge first, takes 5, and this piece then takes 6. No file of this piece names N elsewhere.

**Text of the rule:**
- **Agent reports.** Before an agent report is staged under `state/`, the custodian runs `node scripts/hooks/profile-path-scan.mjs --redact <file>`. The filing note says "profile paths redacted at filing (n)".
- **The human's words** (round 29, item 2).
  - Before words carrying a profile path are filed, the custodian writes the words as received to a scratch file and runs `--redact-segment` on it. The output is filed unedited: the segment becomes `<redacted:profile>` and every other byte is kept.
  - A marked note goes one space after the quotation's closing mark (after any closing emphasis). In a file whose body is the words, it goes on the filing-note line instead. Its exact form is `[profile segments redacted at filing: <n>; round 29, item 2]`, where `<n>` is the count the tool printed.
  - The gate checks that the number of `<redacted:profile>` markers inside the quoted span equals `<n>`.
  - **How a later quotation is verified.** A later quotation of those words copies the marker byte for byte. verify-quotes (at d6d9862, `normalizeText`) leaves `<`, `>` and `:` unfolded, so the quotation matches the filed copy as a substring. The note sits outside the quoted span. A quotation that drops the marker or restores the segment is not found by verify-quotes and is refused by the hook.
  - **Scope.** Words filed before this rule (entry 110; the 2026-09-25 cloud-hooks directive) stay as filed.
- **The backstop.** The pre-commit check is the backstop, never the method.
- **Refusals.** A refusal is never bypassed with `--no-verify`. A false refusal of an invented or machine name is resolved by adding the name to its list in a reviewed diff. A real account is never listed.

**2h. CI.** CI does not run the scan, because round 28 names hooks only. The CI backstop is proposed at the 2026-10-02 window (round 29, item 5) and is outside this piece. The scanner's tests do run in governance-ci through the existing glob.

## §3. Fixtures and corpus: predicted outcomes

- **The 7 whole-file substituted files:** 26 occurrences on 26 lines become `%USERPROFILE%`. The `--redact` equivalence holds for each file, and `git diff --word-diff` shows only roots changing.
- **The ledger:** exactly one line changes, and the 2a′ proof holds.
- **`normalize.rs`:** one line changes.
- **Every untouched file of 2a:** `git diff --quiet <base> HEAD -- <file>` succeeds.
- **The five append targets** (`PUBLIC-AUDIENCE-AUDIT.md`, `PRE-PUBLIC-CHECKLIST.md`, `dep-check/README.md`, the lod-feasibility README, `AI_DEVELOPMENT.md`): at merge, main's bytes are a byte prefix of the head bytes.
- **The re-derivation at head** finds only:
  - the 19 files of 2a that are not substituted;
  - in the ledger, only entry 110's line.
- **Machine-account paths on main** (at d6d9862, one `/home/user` path in `state/cloud/wave1/A3.md`; none under `runner`) are permitted. They are not findings, not listed and not touched. If the re-derivation reports one, the machine-account rule is broken, and that is invalidator 1.

## §4. Tests (`scripts/hooks/profile-path-scan.test.mjs`)

Every profile-shaped string in the tests is built at run time or uses a listed name. Each test has one mutation, and each mutation is run and recorded by name in the test file.

| Test | What it proves | Its mutation |
|---|---|---|
| `refuses_a_full_form_profile_path_in_every_separator_form` | Windows full forms are refused with every separator | narrow the separator class to backslash only |
| `refuses_an_8_3_short_form_profile_path` | 8.3 segments are refused | remove rule (ii) |
| `refuses_a_posix_home_path_under_users_and_home` | rule (iv) holds for both roots | remove rule (iv) |
| `a_posix_root_inside_a_word_is_not_a_path_start` | URL-embedded roots pass | drop the boundary check |
| `permits_the_public_folder_and_paths_outside_the_users_root` | the rider's permitted paths pass | remove the Public exemption |
| `permits_placeholder_segments` | placeholders, the marker included, pass | remove the placeholder rule |
| `admits_only_listed_invented_names` | listed names pass; unlisted invented names are refused | make the lookup always true |
| `permits_the_generic_machine_accounts` | `runner`, `user`, `root` pass under every root | remove the three names |
| `the_local_profile_is_refused_even_when_listed` | the CLI, spawned with HOME and USERPROFILE ending in `someone`, refuses it | remove rule (iii) |
| `the_local_profile_override_spares_machine_accounts` | the CLI, spawned with HOME ending in `runner`, permits `/home/runner/…` (S7) | apply (iii) to both lists |
| `the_canary_must_be_found_before_a_result_counts` | the canary gates the result | `checkCanary` always true |
| `a_scan_whose_git_read_fails_aborts_loudly` | `sh .githooks/pre-commit` with a corrupt `GIT_INDEX_FILE` exits 2 and says "aborted" | treat a git failure as an empty diff |
| `redact_replaces_only_the_profile_root` | only roots change | replace the whole path |
| `redact_segment_keeps_every_byte_but_the_segment` | the output equals the input with each segment replaced by the marker, the printed count equals the markers, and the output scans clean | replace the root with the segment |
| `pre_commit_refuses_a_staged_profile_path_and_accepts_public_and_placeholders` | end to end: a temp repo, a real `git commit`, `core.hooksPath` pointing at the checkout's `.githooks` | remove the scanner call from pre-commit |
| `pre_commit_scans_added_lines_only` | untouched lines are not rescanned | scan whole staged blobs |
| `pre_commit_scans_staged_path_names` | staged file names are scanned | remove the name scan |
| `pre_commit_in_a_merge_refuses_only_lines_new_to_every_parent` | the merge reading holds | diff against HEAD only |
| `commit_msg_refuses_a_profile_path_in_full_and_8_3_form` | covers `-m`, `-F`, a merge, and text below the scissors line being ignored | remove the scanner call from commit-msg |
| `commit_msg_dco_refusal_is_unchanged` | unsigned is refused, signed-clean is accepted, a merge skips DCO | remove the DCO block |
| `the_pieces_own_files_pass_the_scan` | the piece's own files carry no profile path | temporarily add a path literal with an unlisted invented name |

**Normaliser.** No Rust test is added, so no mutation is owed. The existing tests stay green under `cargo test -p spatial-kernel permission::audit::normalize`:
- `a_user_profile_destination_becomes_a_token`;
- `a_root_that_is_a_string_prefix_but_not_a_path_prefix_does_not_match`;
- `case_differences_collapse_on_windows`.

## §5. Predictions · unchanged · invalidators · falsification

**Predictions:**
1. §3 holds exactly.
2. Both JSON files parse.
3. `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` is green, and all 21 mutations fail their tests.
4. The piece's own commits made after 2e pass their own hooks.

**Declared unchanged:**
- DCO behaviour;
- every untouched file of 2a;
- every ledger line but the one in 2a′;
- `.github/workflows/**`, `.claude/settings.json` and `CONTRIBUTING.md`.

**Invalidators.** Each of these STOPS the piece and goes to the custodian:
1. the re-derivation finds a file that 2a does not list, or finds anything in 2a's untouched files beyond §3;
2. an equivalence proof fails, whole-file or 2a′;
3. a substitution would need a change beyond the root;
4. 2a′ locates zero lines, several lines, or a line inside the bracket.

**Falsification:** a profile path survives in an in-scope file, or an armed commit carrying one is accepted.

## §6. Instruments

Assertions only: byte equality, exit codes, parse results, diff numstat. No measurement.

## §7. Declared values

- the tokens: `%USERPROFILE%` for the Windows root, and `$HOME` for a POSIX root (an unexpanded variable naming no user, the corpus positions' item (3) reading);
- the marker `<redacted:profile>` and the note template of 2g;
- the POSIX roots `/Users/` and `/home/`, with the path-start boundary of 2c (iv);
- the invented-name list and the machine-account list (2c);
- the 8.3 grammar;
- exit codes 0, 1, 2 and 3;
- the canary parts: invented, built at run time, never written as a path.

## §8. Block-on-sight

1. Any added line in `git diff <base>...HEAD`, or any file name, that names a real profile.
2. Any byte change to an untouched file, or a non-prefix change to an append target.
3. A failed equivalence proof, or a JSON file that does not parse.
4. The scanner prints a matched segment.
5. Either list holds a real account or any pattern.
6. A DCO behaviour change.
7. A workflow file changed.
8. A mutation not run and recorded.
9. A line cite into `DECISIONS-PENDING.md`, or a bare self-line.
10. A closing amendment that restates rather than references (the record cap).
11. The ledger changed beyond 2a′'s one line, or that line lying outside entry 49's status prose.
12. The human's words filed with a segment unredacted, or with a marker count that disagrees with its note.
13. 2g's N fixed other than by 2g's merge-time rule.

## §9. Gates

- **Architect:** block-on-sight items 1 to 13, one by one; round 28, items 1 and 2, and round 29, items 1 to 5, against §2.
- **Reviewer:** the full diff, with the hooks run live on the reviewer's machine and the 2a′ proof recomputed.
- **Suites:** the node suites; `cargo test -p spatial-kernel`; verify-cites, verify-quotes and verify-test-claims.
- **Operator:** none.

## §10. Amendments — opens empty, append-only

**Amendment 1 — re-derivation STOP (invalidator 1).** Filed after an outcome was seen. The
worker's re-derivation at branch base 7037d7a (this piece's own `scanText`, every rule of 2c
including (iv), run as a one-off `git ls-tree` / `git show` import over every path `git ls-tree -r
--name-only 7037d7a` lists) found one file §2a does not list: `state/drafts/exposure-profile-paths-prereg.draft.md`,
form class `unlisted-segment`, one finding. Per §0 item 1 and §5 invalidator 1 the piece STOPS
here; no further step of the brief's Order was executed. The finding is reported to the custodian
by file and form class only, per the brief's output discipline; the matched segment is not
reproduced here.
