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

**Amendment 2 — the custodian's disposition of invalidator 1 (class 1; written after Amendment 1's result was seen).** The one file the re-derivation found outside §2a, `state/drafts/exposure-profile-paths-prereg.draft.md`, is the architect's draft of this preregistration, filed as returned. Its one finding is the macOS shared folder, named there as an example the rule refuses as written; it is not a person's profile. §2a gives filed agent reports the untouched treatment (the filed reports under `state/consults/`; the standing rule of 2g applies from filing forward), and this file is of that class. Disposition under §5: the file joins §2a's untouched rows, and §3's re-derivation at head reads 20 untouched files where it says 19. The matcher is not changed (RULED 2026-09-27 — question round 29, item 1; question round 30, item 1). The piece resumes at the brief's step 2 from `41d0341`.

**Amendment 3 — closing record (steps 2-7 of the brief's Order, discharged; references only per the record cap).**

- **2c, the scanner and its tests:** `scripts/hooks/profile-path-scan.mjs` and `scripts/hooks/profile-path-scan.test.mjs`, commit `3a85540`. All 21 tests of §4 pass; each carries a `// RECORDED MUTATION:` comment for the mutation actually applied to the named source, run, observed failing that test, and reverted, swept one at a time in-session back to a clean 21/21 pass after every revert. `3a85540`'s message discloses two matcher fixes found in the same work (the initial-commit `HEAD` diff argument; a comment's own illustrative segment) and the commit-msg hook's actual one-argument signature in this git version (2.49.0), which the DCO block's merge-skip condition never held under.
- **2d/2e, the hooks:** `.githooks/pre-commit` (new) and `.githooks/commit-msg` (scanner call added after the unchanged DCO block), commits `3a85540` and `ccdccfd`. §5 prediction 4 (the piece's own post-2e commits pass their own hooks) is discharged: every commit from `ccdccfd` onward went through both armed hooks (`core.hooksPath` was `.githooks` throughout this worktree) and none was refused.
- **2a/2a′/2b/2f, the rewording:** commit `209a9c3`. The 7 whole-file substitutions total 26 occurrences on 26 lines (matches §3); both JSON result files still `JSON.parse`; `--redact` over each file's pre-`209a9c3` parent blob reproduces `209a9c3`'s bytes exactly (checked for all 7, byte-for-byte). Entry 49 (2a′): `git diff --numstat` on `209a9c3` shows 1/1 on `DECISIONS-PENDING.md`, `git diff -U0` shows one hunk, and `--redact` over the removed line reproduces the added line exactly; entry 110's line is untouched. `normalize.rs`: 1 line changed (`git diff --numstat`).
- **2g, the standing rule:** commit `1190057`, Amendment 6 to the Custodian role in `AI_DEVELOPMENT.md`. N=6, read from `git show origin/main:AI_DEVELOPMENT.md` at `16df0d7` (the merge commit landing PR #129's Amendment 5) at this piece's last merge of `origin/main`, commit `c48a8dc`.
- **Re-derivation at head** (`git rev-parse HEAD` = `1190057` at the time run): 20 files with findings, all in §2a's untouched rows as revised by Amendment 2; `DECISIONS-PENDING.md` shows only entry 110's line. Matches §3 exactly (19→20 per Amendment 2).
- **Suites (§9):** `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` — 336 pass, 0 fail. `cargo test -p spatial-kernel --lib permission::audit::normalize` — 8 pass, 0 fail (the 3 named in §4 among them). `node scripts/plan/verify-cites.mjs` — PASS. `node scripts/plan/verify-quotes.mjs` — PASS (110 checked, 79 verified, 30 baselined, 1 advisory, 0 errors); the pre-existing baselined/advisory entries are unrelated to and unmoved by this piece's line-count-preserving and append-only edits. `node scripts/plan/verify-test-claims.mjs` — PASS (advisory only).

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

**Amendment 5 — the budget (class 8; round 25, item 2; 4.6). Written after the round's results were seen. The header Budget line is not edited.**

- Header figures: ≤ 720 changed lines of non-generated code and tests (scanner ≤ 240, two hooks ≤ 50, tests ≤ 430, the normaliser's one line); docs and evidence ≤ 60 appended lines across 5 files (plus the 27-occurrence/8-file substitution, unchanged since `209a9c3`); ≤ 19 files; 300 minutes.
- Final, by §21c's rule (insertions plus deletions over non-generated code and tests, three-dot from the merge base, excluding this piece's own preregistration), at C (`8f7698e`), merge base `16df0d7`:
  - `scripts/hooks/profile-path-scan.mjs`: 548 (548 insertions, 0 deletions);
  - `.githooks/pre-commit` + `.githooks/commit-msg`: 105 (98 insertions, 7 deletions);
  - `scripts/hooks/profile-path-scan.test.mjs`: 877 (877 insertions, 0 deletions);
  - `kernel/src/permission/audit/normalize.rs`: 2 (1 insertion, 1 deletion);
  - total: 1532, against the 720 declared bound (R-E3's own reading of the same rule gives 1056 at `980b10c`; the round's own code, tests and re-observations grew the total by 476).
  - The five append targets (§3): 39 lines at C, against the ≤ 60 bound (within budget).
- File count: 19 at C and at M (`git diff --name-only origin/main...HEAD`, excluding `PLAN.yaml` and the generated set), unchanged from the header.
- Minutes: the custodian's own check (`AUTONOMY.md` §10), not this amendment's to state.
- **Reason for the overrun.** Three of 4.1's eleven sub-items (b, c, e) each needed a real subprocess or filesystem fixture (a directory link, an isolated hooks directory with a stub scanner, a spawned CLI) rather than a single in-process assertion, and 4.3 adds nine such tests plus three changed ones; the scanner itself grew by a dedicated 8.3-without-a-drive pattern (4.1(g)), a dedicated flattened-local-name pattern (4.1(f)), and a print-path redaction helper threaded through every CLI output path (4.1(e)) — all named in the round's own findings (F1–F23), not scope volunteered beyond them.

**Amendment 6 — the closing record (references and hashes only; the record cap). Written after the round's results were seen.**

- **C** = `8f7698e` (the code, tests, comments and the three doc fixes of 4.13 step 2).
- **M** = `251fd80` (the signed-off merge of `origin/main` at `00cf306`, merge base `16df0d7`, into `governance/exposure-profile-paths`).
- **N** = 6, unchanged (`git show origin/main:AI_DEVELOPMENT.md` at `00cf306` and, re-checked, at `cec34b8`, both show no heading past Amendment 5).
- **Commits, `ccdccfd` to M** (this piece's own first-parent lineage): `ccdccfd`, `209a9c3`, `c48a8dc` (merge), `1190057`, `980b10c`, `34f62c5` (Amendment 4's append), `8f7698e` (C), `251fd80` (M, merge).
- **Mutations (4.4).** All 30 tests of `scripts/hooks/profile-path-scan.test.mjs` (21 pre-existing, 9 new per 4.3) carry their own `// RECORDED MUTATION:` comment. Every one of the 30 was observed failing under its named mutation, against the code at C, by the worker this round, then reverted; `git status --porcelain` was empty before and after each. No test of 4.3 passed under its mutation (4.13's first added invalidator did not fire).
- **Suites at M:**
  - `node --test scripts/hooks/profile-path-scan.test.mjs` — 30 pass, 0 fail.
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` — 345 pass, 0 fail.
  - `cargo test -p spatial-kernel` (`CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target`, unfiltered) — every binary green, 0 failed.
  - `node scripts/plan/verify-cites.mjs` — PASS (825 files, 32 loose references advised, pre-existing).
  - `node scripts/plan/verify-quotes.mjs` — PASS (110 checked, 79 verified, 30 baselined, 1 advisory, 0 errors; the pre-existing baseline/advisory entries are unrelated to and unmoved by this round).
  - `node scripts/plan/verify-test-claims.mjs` — PASS (284 claimed across 88 files; 11 planned, 3 superseded, 15 withdrawn, all advisory).
- **2a′ at M**, against `origin/main...HEAD`: `git diff --numstat` gives 1/1 on `DECISIONS-PENDING.md`; `git diff -U0` shows one hunk; a script's `redactRoots` over the removed line's bytes reproduces the added line's bytes exactly (boolean equality checked by script, never printed). Entry 110's line is untouched.
- **The re-derivation.** One-line command (path, form class and count only, run as a one-off `git ls-tree -r --name-only <rev>` / `git show <rev>:<path>` import of this piece's own `scanText`, every rule of 2c including (iv), with `localName` the CLI's own `path.basename(os.homedir())`):
  - at the merge base (`00cf306`): 30 files with findings (the pre-fix state; not itself evidence);
  - at M (`251fd80`): 22 files with findings — the 20 of §2a as revised by Amendment 2, plus 2 files main added after `16df0d7`: `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` (form class `unlisted-segment`) and `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md` (form class `8.3`, matching 4.7's own prediction). Both are listed and left untouched by this piece; both are routed to one follow-up node, which the custodian files. No file outside §2a's 20 rows and this pair is found; invalidator 1 does not fire.
- **Prediction 4 (4.9), the reduced form.** Checked by script over this piece's own first-parent commit lineage, `ccdccfd~1..HEAD` (8 commits): every non-merge commit's message and every `+`-prefixed line of its `git show -U0 --format=` output scan clean under `scanText`; both merge commits' messages (`c48a8dc`, `251fd80`) scan clean under the same. Result: PASS, all 8 commits, with and without the CLI's own local name passed to `scanText`.
- **Disclosure.** `origin/main` advanced to `cec34b8` after M was made and while this record was being written; N is unaffected (checked above), and this piece does not re-merge for it (2g's "last... before the PR is marked ready" does not apply — this piece is local-only and files no PR). Any further main movement is for a later merge to carry, per 4.7's own "if main moves after the closing record" clause.
- **4.8(b), 4.8(c).** Unaffected by this round; the worker's E4 statement stays filed at `state/consults/2026-09-27-exposure-profile-paths-worker-e4-answer.md` (on main since `0ffe80c`), and 41d0341/3a85540's disposition of the one unlisted-segment comment finding is unchanged.
- **Discharged in this round:** 4.1(a)–(k) (`scripts/hooks/profile-path-scan.mjs`, `.githooks/pre-commit`, `.githooks/commit-msg`, C); 4.2 (declarative, no code; this Amendment 4's own text); 4.3 (the 30 tests of `scripts/hooks/profile-path-scan.test.mjs`, C); 4.4 (this amendment's mutations bullet); 4.5, 4.9, 4.10, 4.12 (declarative, Amendment 4's own text); 4.6 (Amendment 5); 4.7 (M, N and the re-derivation bullets above); 4.8 (pre-existing, unaffected).

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

**Amendment 8 — the budget (class 8; round 25, item 2; 7.10). Written after the round's results were seen. The header Budget line is not edited.**

- Header figures: ≤ 720 changed lines of non-generated code and tests (scanner ≤ 240, two hooks ≤ 50, tests ≤ 430, the normaliser's one line); docs and evidence ≤ 60 appended lines across 5 files (plus the 27-occurrence/8-file substitution, unchanged since `209a9c3`); ≤ 19 files; 300 minutes.
- Final, by §21c's rule (insertions plus deletions over non-generated code and tests, three-dot from the merge base, excluding this piece's own preregistration), at C′ (`955e6c7`), merge base `00cf306` (`git merge-base origin/main 955e6c7`):
  - `scripts/hooks/profile-path-scan.mjs`: 625 (625 insertions, 0 deletions);
  - `.githooks/pre-commit` + `.githooks/commit-msg`: 109 (103 insertions, 6 deletions);
  - `scripts/hooks/profile-path-scan.test.mjs`: 1094 (1094 insertions, 0 deletions);
  - `kernel/src/permission/audit/normalize.rs`: 2 (1 insertion, 1 deletion);
  - total: 1830, against the 720 declared bound (Amendment 5's own reading of the same rule gives 1532 at `8f7698e`; this round's 7.1 code and 7.3/7.4 tests grew the total by 298).
  - The five append targets (§3): 39 lines at C′, against the ≤ 60 bound (within budget; unchanged from Amendment 5's own figure, since 7.1(d)'s in-place edit adds no new appended line).
- File count: 19 at C′ and at M′ (`git diff --name-only origin/main...HEAD`, excluding `PLAN.yaml` and the generated set), unchanged from the header.
- Minutes: the custodian's own check (`AUTONOMY.md` §10), not this amendment's to state.
- **Reason for the overrun.** This round's 7.1 code (the diff-header C-unquote of 7.1(a), the overlap dedup of 7.1(b), the declared refused line and its hook gating of 7.1(c)) and 7.3's four new tests plus two changed tests each needed the same shape of fixture 4.1 and 4.3's tests already required (a spawned git repo, an isolated hooks directory with a stub scanner, a direct hook invocation) rather than a single in-process assertion; the growth is 7.1 and 7.3's own scope, not scope volunteered beyond them.
- Amendment 8 supersedes Amendment 5. The Budget line is never edited.

**Amendment 9 — the closing record (references and hashes only; the record cap). Written after the round's results were seen. Supersedes Amendment 6, which stays, append-only; Amendment 6's restating clauses are not re-carried.**

- **C′** = `955e6c7` (the code, tests and comments of 7.1, 7.3 and 7.4).
- **M′** = `f7a19e9` (the signed-off merge of `origin/main` at `254fbfa` into `governance/exposure-profile-paths`; parents `955e6c7` and `254fbfa`; merge base `254fbfa` itself).
- **N** = 6, unchanged (`git show origin/main:AI_DEVELOPMENT.md` at `254fbfa` shows no Custodian-role heading past Amendment 5).
- **Commits, `ccdccfd` to M′** (this piece's own first-parent lineage, 15 commits): `ccdccfd`, `209a9c3`, `c48a8dc` (merge), `1190057`, `980b10c`, `34f62c5`, `8f7698e`, `251fd80` (merge), `da80db0`, `f95da5a`, `d778421`, `b6add20`, `ebf0843`, `955e6c7` (C′), `f7a19e9` (M′, merge).
- **Push and CI (the custodian's, before M′).** Push at C′; governance-ci run `36336589025` on `ubuntu-latest` at `955e6c7`, success (7.13 step 4's POSIX proof); Product CI shell run `36336591478` and Product CI Rust-workspace run `36336589042`, both success. The custodian's own pre-push scan (this piece's own scanner): canary found, 0 findings over 2599 added lines, 19 file names and 19 commit messages, in `origin/main..HEAD` (the pre-M′ range). Draft PR #133.
- **Mutations (7.4).** All 34 tests of `scripts/hooks/profile-path-scan.test.mjs` (30 pre-existing, 4 new per 7.3) carry their own `// RECORDED MUTATION:` comment. Every one of the 34 was observed failing under its named mutation, against the code at C′ (`955e6c7`), by the worker this round, then reverted; `git status --porcelain` was empty before and after each. Ten pre-existing "Observed:" comments were corrected (class 4, 7.4) to name only the first failing assertion a node `assert` actually reaches, per round 25, item 2(c). No test of 7.3 passed under its mutation, and the file count did not pass 19 (7.13's two added invalidators did not fire).
- **4.4's re-observation at M′.** Not owed: `git diff --stat 955e6c7 f7a19e9 -- scripts/hooks/profile-path-scan.mjs scripts/hooks/profile-path-scan.test.mjs .githooks/pre-commit .githooks/commit-msg` is empty (the scanner, test file and both hooks are byte-identical between C′ and M′).
- **Suites at M′:**
  - `node --test scripts/hooks/profile-path-scan.test.mjs` — 34 pass, 0 fail (part of the aggregate below).
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` — 349 pass, 0 fail.
  - `cargo test -p spatial-kernel` (`CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target`, unfiltered, `--no-fail-fast` for a complete count) — 280 passed, 1 failed, 28 ignored, 36 binaries. **Disclosure (class 1).** The one failure, `h2_a_cancel_before_the_first_batch_still_stops_the_query` (`kernel/tests/end_to_end.rs:399`, a sub-100ms latency assertion, code at `d400a475`, 2026-08-09 — outside this piece's 19 files and untouched by it), is a timing-sensitive flake: re-run alone (`cargo test -p spatial-kernel --test end_to_end h2_a_cancel_before_the_first_batch_still_stops_the_query -- --exact`) passes; under concurrent load it failed twice at two different observed latencies (252.7ms, then 163.6ms). Not this piece's regression: this piece changes no kernel code, and the test predates this piece by months.
  - `node scripts/plan/verify-cites.mjs` — PASS (834 files; 50 loose references advised, pre-existing).
  - `node scripts/plan/verify-quotes.mjs` — PASS (110 checked, 79 verified, 30 baselined, 1 advisory, 0 errors; 2 pre-existing hash-baselined entries, unrelated to and unmoved by this piece).
  - `node scripts/plan/verify-test-claims.mjs` — PASS (300 claimed across 88 files; 11 planned, 3 superseded, 15 withdrawn, all advisory).
- **2a′ at M′**, against `origin/main...HEAD` (`git diff --numstat origin/main...HEAD -- DECISIONS-PENDING.md`; `git diff -U0 origin/main...HEAD -- DECISIONS-PENDING.md`; a script's `redactRoots`, this piece's own scanner, over the removed line's bytes, checked against the added line's bytes): 1 added/1 removed; one hunk; equal (boolean equality checked by script, never printed). Entry 110's line is untouched.
- **§3's byte-prefix check**, on the five append targets (`git show origin/main:<file>` vs `git show HEAD:<file>`, `head.startsWith(main)`, checked by script): all five (`PUBLIC-AUDIENCE-AUDIT.md`, `PRE-PUBLIC-CHECKLIST.md`, `spikes/lod-feasibility/dep-check/README.md`, `spikes/lod-feasibility/README.md`, `AI_DEVELOPMENT.md`) pass.
- **The re-derivation** (a one-off `git ls-tree -r --name-only <rev>` / `git show <rev>:<path>` import of this piece's own `scanText`, every rule of 2c including (iv), `localName` the CLI's own `path.basename(os.homedir())`):
  - at the base of `origin/main...M′` (`254fbfa`, `origin/main` itself): 1118 files, 30 with findings;
  - at M′ (`f7a19e9`): 1122 files, 22 with findings — the 19 of §2a as revised by Amendment 2 (20), plus the same 2 files main added after `16df0d7` that Amendment 6 already found and routed (`engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, form class `unlisted-segment`; `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md`, form class `8.3`). No file outside §2a's 20 rows and this pair is found; invalidator 1 does not fire. Both are listed and left untouched by this piece; the custodian's `exposure-scan-followups` PLAN node (already filed on `origin/main` at `254fbfa`) routes them.
- **Prediction 4 (4.9), the reduced form, at M′.** Checked by script over this piece's own first-parent commit lineage (`git rev-list --first-parent --reverse ccdccfd~1..HEAD`, 15 commits): every non-merge commit's message (`git show -s --format=%B <commit>`, under the shipped CLI's `--message`) and every `+`-prefixed line of its `git show -U0 --format= <commit>` output (under `scanText`) scans clean; all three merge commits' messages (`c48a8dc`, `251fd80`, `f7a19e9`) scan clean under the same. Result: PASS, all 15 commits.
- **Discharged in this round:** 7.1(a)-(d), 7.3 and 7.4, by reference to 7.9's discharge map (unchanged by this amendment; its rows for 7.1(a)-(d) name the tests). 4.1-4.13's items stay discharged as 7.9 and Amendment 3 already record them.

**Amendment 10 — budget overrun, §7 not edited (class 8; round 25, item 2; 7.10). Written after the round's results were seen. The header Budget line is not edited.**

- **Figures.** By reference to Amendment 8's figure bullets: the final total (1830, against the 720 declared bound), the five-append-target total (39, against the ≤ 60 bound) and the file count (19), all unchanged this round (7.13 step 6 is a merge, re-runs and record round; no code of 7.1 or 7.3 changed).
- **Minutes.** By reference to the custodian's count in the gate-3 architect report's filing note (`state/consults/gates/2026-09-27-exposure-profile-paths-gate3-architect.md`): at 18:17Z, 456 minutes had elapsed from round 28's ruling (the widest measure) and 309 from the form's first commit, against §10's 600.
- **Reason:** 7.1, 7.3.
- Amendment 10 supersedes Amendment 8's first line and its Reason. Amendment 8's other bullets stand.

**Amendment 11 — record round 1 (the gate-3 fix round). Class 1: written after gate 3's results were seen. It is declared before any code of this round (there is none); it states what it supersedes (the index at its end).**

*Sources.* Gate 3 was reviewed at `governance/exposure-profile-paths @ 4155fcf`. Its two reports are filed on main at `9c9616a`, under AUTONOMY.md §25(b):
- A3 = `state/consults/gates/2026-09-27-exposure-profile-paths-gate3-architect.md`
- G3 = `state/consults/gates/2026-09-27-exposure-profile-paths-gate3-reviewer.md`

Findings are cited by report and id. Rulings are cited by round and item. Nothing below is quoted except where marked verbatim.

**11.1 (class 3; round 12(d)).** A3-D3 and G3-D5: Amendment 9's verify-quotes bullet repeats "unrelated to and unmoved by this piece" (the restatement 7.12 and §8 item 10 forbid), its Mutations bullet narrates the mutation procedure again, and its cargo Disclosure argues in prose. Those three clauses are withdrawn; the verify-quotes and Mutations facts stand as Amendment 9's own counts and 7.4's own `RECORDED MUTATION` comments, and the cargo fact is restated as this amendment's own kernel-timing row (11.5, below), which replaces Amendment 9's Disclosure. The proof is this amendment's own text, which carries none of the three clauses.

**11.2 (class 3; round 12(d)).** A3-D4, G3-D3 and G3-D4: Amendment 9's re-derivation bullet gave file counts only, with no path, form class or count per file, and its prediction-4 command ended at a moving `HEAD`, which at the reviewed head resolves to 16 commits, not the recorded 15. Both bullets are superseded by this amendment's own M″ bullet (11.6, below), which lists every file by path, form class and count and names both of prediction-4's ends by commit id. The proof is 11.6's own listing and command.

**11.3 (class 3; round 12(d)).** A3-D5 and G3-D6: Amendment 9's last bullet discharged "7.3 and 7.4, by reference to 7.9's discharge map", but 7.9 has no row for 7.3 or 7.4, and its 7.1(d) row names the `AI_DEVELOPMENT.md` verification bullet, not a test. The corrected map: 4.7 discharges to this amendment's M″ bullet (11.6); 4.9 to 11.6's prediction-4 bullet; 7.3 to 7.3's own tables; 7.4 to the `RECORDED MUTATION` comments at C′ (`955e6c7`); and 7.9's rows for 7.1(a)-(c) name tests while 7.1(d) names the doc bullet. The proof is 7.9's and 7.3's own unedited text, and the test file at C′.

**11.4 (class 3; round 12(d); low).** A3-D6: Amendment 9's M′ bullet read "merge base `254fbfa` itself", conflating this piece's own merge base with the base of `origin/main...M′`. By 7.8(a)'s reading, this piece's merge base is `00cf306`; `254fbfa` was only the base of `origin/main...M′` (M′'s own second parent), and this amendment's M″ bullet (11.6) names both separately for M″. The proof is 11.6's own M″ bullet.

**11.5 The kernel timing row (A3's Judge 4; class 1, references only).**
- Test: `h2_a_cancel_before_the_first_batch_still_stops_the_query`.
- Counts at M″: `cargo test -p spatial-kernel --no-fail-fast` (`CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target`) at `2b8813f` — 281 passed, 0 failed, 28 ignored, 35 test binaries plus doc-tests.
- Alone-run: `cargo test -p spatial-kernel --test end_to_end h2_a_cancel_before_the_first_batch_still_stops_the_query -- --exact` — 1 passed, 0 failed.
- The green run of record: the gate-3 reviewer's run (281 passed, 0 failed), or Product CI's Rust-workspace run `36339620847`, both at `4155fcf`.

**11.6 M″'s results (7.13 step 6, re-run; supersedes Amendment 9's re-derivation and prediction-4 bullets, 11.2).**

- **M″** = `2b8813f` (the signed-off merge of `origin/main` at `9c9616a` into `governance/exposure-profile-paths`; parents `4155fcf` and `9c9616a`). The base of `origin/main...M″` is `9c9616a` itself (origin/main, since it is now M″'s direct second parent). This piece's own merge base (7.8(a)'s reading, insertions-plus-deletions counting) stays `00cf306`, unchanged since Amendment 8.
- **N = 6**, unchanged. Command: `git show origin/main:AI_DEVELOPMENT.md | grep -n "^## Amendment [0-9]* to the Custodian role"` — highest heading at `9c9616a` is Amendment 5.
- **File count: 19** at M″. Command: `git diff --name-only origin/main...HEAD | wc -l` — 19; `PLAN.yaml` and the generated set are absent from the list.
- **The merge.** Generated-file conflicts: none (`git status --porcelain` after merge listed only additive files under `state/consults/`; `state/gate-log.json` merged cleanly). Commands: `node scripts/plan/queue.mjs --check` — current; `node scripts/plan/site.mjs --check` — current.
- **4.4's re-observation.** Not owed. Command: `git diff --stat 955e6c7 2b8813f -- scripts/hooks/profile-path-scan.mjs scripts/hooks/profile-path-scan.test.mjs .githooks/pre-commit .githooks/commit-msg` — empty (the scanner, test file and both hooks are byte-identical between C′ and M″).
- **2a′**, against `origin/main...HEAD`:
  - Command: `git diff --numstat origin/main...HEAD -- DECISIONS-PENDING.md` — `1\t1\tDECISIONS-PENDING.md`.
  - Command: `git diff -U0 origin/main...HEAD -- DECISIONS-PENDING.md` — one `@@` hunk.
  - Check (script, this piece's own `redactRoots`, one-off import): the removed line's bytes redact to the added line's bytes exactly. Entry 110's line is untouched.
- **The five append targets' byte prefix.** Command per file: `git show origin/main:<file>` vs `git show HEAD:<file>`, checked by script as `head.startsWith(main)`. All five true: `PUBLIC-AUDIENCE-AUDIT.md` (+11 lines), `PRE-PUBLIC-CHECKLIST.md` (+10), `spikes/lod-feasibility/dep-check/README.md` (+4), `spikes/lod-feasibility/README.md` (+2), `AI_DEVELOPMENT.md` (+12); total 39.
- **The re-derivation.** Commands: `git ls-tree -r --name-only <rev>`, then per file `git show <rev>:<path>` (and the path name itself), both scanned by a one-off import of this piece's own `scanText`, every rule of 2c including (iv), `localName` = the CLI's own `path.basename(os.homedir())`, canary checked first. No segment is printed or recorded; path, form class and count only.
  - **At the base `9c9616a`** (origin/main): 1123 files, 30 with findings —
    `DECISIONS-PENDING.md` 2 local-profile; `PRE-PUBLIC-CHECKLIST.md` 1 local-profile; `PUBLIC-AUDIENCE-AUDIT.md` 15 (5 local-profile, 10 unlisted-segment); `RELEASE-0.1.md` 1 unlisted-segment; `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md` 2 local-profile; `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` 1 unlisted-segment; `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` 3 local-profile; `kernel/src/permission/audit/normalize.rs` 1 unlisted-segment; `spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md` 1 local-profile; `spikes/lod-feasibility/README.md` 3 local-profile; `spikes/lod-feasibility/dep-check/baseline/baseline-tree-licences.txt` 1 local-profile; `spikes/lod-feasibility/dep-check/full-tree-licences.txt` 1 local-profile; `spikes/lod-feasibility/dep-check/inverse-trees.txt` 19 local-profile; `spikes/lod-feasibility/results/A_100k_5.0_simple_invalid_features.json` 1 local-profile; `spikes/lod-feasibility/results/libduckdb_sys_vendored_spatial_scan.json` 1 local-profile; `state/consults/2026-09-17-p3b-re-scope.md` 1 8.3; `state/consults/2026-09-26-governance-weekly-proposals-gate1-reviewer.md` 1 8.3; `state/consults/2026-09-26-origin-non-ascii-gate1-reviewer.md` 1 8.3; `state/consults/2026-09-26-origin-non-ascii-gate2-reviewer.md` 1 8.3; `state/consults/2026-09-26-partition-offset-bounds-acceptance.md` 2 8.3; `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md` 1 8.3; `state/cut-archive/CUT-STATE-2026-09-13-release-0.1.0.md` 1 local-profile; `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md` 1 local-profile; `state/cut-archive/CUT-STATE-adr009-checklist.md` 3 (2 local-profile, 1 unlisted-segment); `state/cut-archive/CUT-STATE-residency-debt.md` 1 local-profile; `state/cut-archive/CUT-STATE-sqlfilter-panels-publish.md` 1 local-profile; `state/directives/2026-09-25-cloud-hooks.md` 2 local-profile; `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md` 2 local-profile; `state/drafts/exposure-profile-paths-prereg.draft.md` 1 unlisted-segment; `state/drafts/statusline-context-proposal.md` 1 local-profile.
  - **At M″ `2b8813f`:** 1127 files, 22 with findings — identical to the base's list less the 8 files this piece rewords (the 7 whole-file substitutions and `normalize.rs`): `DECISIONS-PENDING.md` 1 local-profile; `PRE-PUBLIC-CHECKLIST.md` 1 local-profile; `PUBLIC-AUDIENCE-AUDIT.md` 15 (5 local-profile, 10 unlisted-segment); `RELEASE-0.1.md` 1 unlisted-segment; `docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md` 2 local-profile; `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` 1 unlisted-segment; `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` 3 local-profile; `spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md` 1 local-profile; `spikes/lod-feasibility/README.md` 3 local-profile; `state/consults/2026-09-17-p3b-re-scope.md` 1 8.3; `state/consults/2026-09-26-governance-weekly-proposals-gate1-reviewer.md` 1 8.3; `state/consults/2026-09-26-origin-non-ascii-gate1-reviewer.md` 1 8.3; `state/consults/2026-09-26-origin-non-ascii-gate2-reviewer.md` 1 8.3; `state/consults/2026-09-26-partition-offset-bounds-acceptance.md` 2 8.3; `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md` 1 8.3; `state/cut-archive/CUT-STATE-2026-09-13-release-0.1.0.md` 1 local-profile; `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md` 1 local-profile; `state/cut-archive/CUT-STATE-adr009-checklist.md` 3 (2 local-profile, 1 unlisted-segment); `state/cut-archive/CUT-STATE-residency-debt.md` 1 local-profile; `state/cut-archive/CUT-STATE-sqlfilter-panels-publish.md` 1 local-profile; `state/directives/2026-09-25-cloud-hooks.md` 2 local-profile; `state/drafts/exposure-profile-paths-prereg.draft.md` 1 unlisted-segment.
  - The 22 at M″ are §2a's untouched rows (20, with Amendment 2's) plus the two files main added after `16df0d7` that Amendment 6 already found and routed: `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` (unlisted-segment) and `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md` (8.3). No file outside those 22 is found at either revision; invalidator 1 does not fire. Both are left untouched by this piece; the custodian's `exposure-scan-followups` PLAN node (on `origin/main`) routes them.
- **Prediction 4 (4.9), the reduced form.** Command: `git rev-list --first-parent --reverse ccdccfd~1..2b8813f` — 17 commits (`ccdccfd`, `209a9c3`, `c48a8dc`, `1190057`, `980b10c`, `34f62c5`, `8f7698e`, `251fd80`, `da80db0`, `f95da5a`, `d778421`, `b6add20`, `ebf0843`, `955e6c7`, `f7a19e9`, `4155fcf`, `2b8813f`). Every non-merge commit's message (`git show -s --format=%B <commit>`, scanned under the shipped CLI's `--message`) and every `+`-prefixed line of its `git show -U0 --format= <commit>` output (scanned under `scanText`) is clean; the four merge commits' messages (`c48a8dc`, `251fd80`, `f7a19e9`, `2b8813f`) scan clean under the same. Result: PASS, all 17 commits.
- **Suites at M″** (identical code to C′):
  - Command: `node --test scripts/hooks/profile-path-scan.test.mjs` — 34 pass, 0 fail (part of the aggregate below).
  - Command: `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` — 349 pass, 0 fail.
  - Command: `CARGO_TARGET_DIR=C:/dev/wt/exposure-profile-paths/target cargo test -p spatial-kernel --no-fail-fast` — 281 passed, 0 failed, 28 ignored, 35 test binaries plus doc-tests. No flake this run; 11.5 carries the kernel-timing row by reference.
  - Command: `node scripts/plan/verify-cites.mjs` — PASS (839 files; 58 loose references advised, pre-existing).
  - Command: `node scripts/plan/verify-quotes.mjs` — PASS (110 checked, 79 verified, 30 baselined, 1 advisory, 0 errors; 2 pre-existing hash-baselined entries).
  - Command: `node scripts/plan/verify-test-claims.mjs` — PASS (300 claimed across 88 files; 11 planned, 3 superseded, 15 withdrawn, all advisory).

**11.7 G3's nits (class 3).** Amendment 9's re-derivation bullet said "the 19 of §2a as revised by Amendment 2 (20)"; the count is 20. Its suites bullet said "36 binaries"; the count is 35 test binaries plus doc-tests. 11.6 uses the corrected forms.

**Superseded index. Read the last amendment first.**

Superseded:
- Amendment 9's verify-quotes restated clause, its Mutations narration, and its cargo Disclosure (11.1);
- Amendment 9's re-derivation bullet and its prediction-4 bullet (11.2, 11.6);
- Amendment 9's last (discharge) bullet (11.3);
- Amendment 9's M′ bullet's "merge base `254fbfa` itself" phrasing (11.4);
- Amendment 9's "(20)" and "36 binaries" phrasings (11.7);
- Amendment 8's first line and its Reason (Amendment 10).

Not superseded: Amendment 8's figure bullet and file-count bullet (Amendment 10 restates them by reference only); Amendment 9's C′, M′, N, push/CI and mutations bullets (unaffected by gate 3's findings).
