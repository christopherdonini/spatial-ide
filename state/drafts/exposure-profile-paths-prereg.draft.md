*Custodian's note (2026-09-27): the architect consult's draft preregistration for PLAN node `exposure-profile-paths` (RULED 2026-09-26 — question round 28, items 1 and 2), saved as returned, transcribed from the hand-back message with the harness's two-space indent removed. Not committed as the piece's gate until the human answers its stop items S1-S6 (S1 and S3 before the scanner is written). Its 2g names "Amendment 5 to the Custodian role"; PR #129's renumbering may take that number first, in which case this piece takes the next free one at merge. Everything below the rule is the agent's text.*

---

**Verdict on the brief:** pass with notes. The ruling covers the piece. Three of the brief's premises don't match the tree, and one real account was missed. All of these are under "See first" below.

---

## Preregistration: commit at `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` (scripts level)

Why scripts level: the scanner and its tests live in `scripts/hooks/`, where governance-ci's existing glob (`scripts/hooks/*.test.mjs`) already runs them, so no workflow change is needed. Commit it on branch `governance/exposure-profile-paths` before any change.

```markdown
# Preregistration — profile paths out of the tracked tree, and refused at commit (PLAN node `exposure-profile-paths`)

- **Authority:** RULED 2026-09-26 — question round 28, items 1 and 2 (`DECISIONS-PENDING.md`, RULED block, cited by round and item); round 27, item 2 (the rider as clarified: no path naming a user profile; the public folder and paths outside the Users root permitted); RULED 2026-09-26, the corpus positions, item (3) (the unexpanded `%USERPROFILE%` token names no user). What was asked: `state/questions/round-28.md`. Findings: `state/consults/2026-09-26-exposure-checks-rerun.md` and its custodian's addendum.
- **Drafted by** the architect agent on the custodian's brief, read at `main` 9fbd956. **Committed before any code**, on `governance/exposure-profile-paths`.
- **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line (`docs/PREREGISTRATION-TEMPLATE.md` §10).
- **Form: full**, both gates. The piece touches about 18 files, which is past `AUTONOMY.md` §21c's eight-file bound, and it appends to ADR-009's pre-public checklist (§21a, security posture). Either reason alone forces full gating.
- **Budget:** ≤ 600 changed lines of non-generated code and tests (scanner ≤ 200, two hooks ≤ 50, tests ≤ 340, the normaliser's one line). Docs and evidence: 26 substituted occurrences across 7 files, and appended text of ≤ 60 lines across 5 files. ≤ 18 files in total. 240 minutes. It blocks nothing (round 28, item 2; the corpus push does not wait, item 3).

## §0. Disclosure

1. **Enumeration.** The architect enumerated the files by ripgrep (Claude Code's Grep tool, version not recorded) over the tree at 9fbd956. Under round 15 (c) that is a read, not evidence. The evidence is the worker's re-derivation at the branch base using this piece's own `scanText`, run as a one-off import, with the command and output recorded in the closing amendment. A file found that §3 does not list STOPS the piece.
2. **Counts.** The read finds 27 files that name a real profile. The addendum reported 25 at fe8f50f. The differences are:
   - `state/cut-archive/CUT-STATE-residency-debt.md`, where the path is written without a drive letter;
   - `RELEASE-0.1.md`, whose quoted human verdict names a second real account ("through my account"). The addendum probably counted that one among the made-up names.
   Both are immutable, and the ruling disposes of them unchanged.
3. **The "normaliser fixture"** in `kernel/src/permission/audit/normalize.rs` is a doc comment on `strip_component_prefix`. The tests in that module already use invented names (`someone`, `someone2`, `José`).
4. **No shared code with the corpus branch.** The corpus branch's fixed scan is not on `main`. This piece writes its own matcher with the same three properties: a node matcher (the re-run consult's canary showed Git Bash's grep aborting on `-i` with `-F`), the canary first, and the exit status checked. It imports nothing from an unmerged branch.
5. No measurement, no fixture drive, no pilot.

## §1. What this may and may not claim

**May claim:**
- the §3 in-scope files carry no profile path;
- in a clone with `core.hooksPath` armed, a commit whose staged added lines, staged path names or message carry one is refused.

**May not claim:**
- that history is clean: seven pushed commit bodies stay (round 28, item 1), and so do the immutable records;
- protection under `--no-verify`, in unarmed clones, in cloud sessions, in worktrees branched before this lands, or in CI;
- coverage of UTF-16 content, or of flattened full-name forms of any name other than the local profile;
- coverage of macOS or Linux home forms (the rider names the Windows root);
- any docs/08 number.

**Scope limits:** no wire change, no ADR amended, and ADR-006 does not apply (this is repository tooling, not a product operation).

## §2. The change

**2a. Record classes (`AUTONOMY.md` §22) and what happens to each file.**

The substitution rule: in each in-scope file, every profile root is replaced by `%USERPROFILE%`. A profile root is a drive (or `/c/`), then `Users`, then a segment that is neither the public folder, nor a placeholder, nor an allow-listed invented name. The rule covers the full form and the 8.3 form, with single, double or forward separators. Every byte after the segment is kept.

Proof, per file: running the piece's `--redact` over the base bytes (`git show <base>:<file>`) reproduces the head bytes exactly.

| File | Class, and why | Treatment |
|---|---|---|
| `state/drafts/statusline-context-proposal.md` (1) | current-state (a draft proposal; the ruling names drafts) | substituted |
| `state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md` (2) | draft (a design-reference copy, not Authority) | substituted (link roots only) |
| `spikes/lod-feasibility/dep-check/inverse-trees.txt` (19), `full-tree-licences.txt` (1), `baseline/baseline-tree-licences.txt` (1) | spike outputs: captured tool output with no recorded generator command, so not §22 generated evidence ("only where a real generator exists") | **reworded, not regenerated**: a regeneration could not be shown to reproduce the evidence. Substituted; one dated line appended to `dep-check/README.md` names the substitution and this preregistration |
| `spikes/lod-feasibility/results/A_100k_5.0_simple_invalid_features.json` (1), `libduckdb_sys_vendored_spatial_scan.json` (1) | spike outputs; regenerating would re-measure timings or re-read a cache under the profile | substituted; both must still `JSON.parse`; one dated line appended at the end of `spikes/lod-feasibility/README.md` |
| `kernel/src/permission/audit/normalize.rs` (1) | the fixture (a doc comment) | the example's segment becomes `someone2`, the invented name the boundary test uses |
| `PUBLIC-AUDIENCE-AUDIT.md` | immutable (the audit report; its paths are its findings and its recorded search patterns) | dated correction appended (2f) |
| `PRE-PUBLIC-CHECKLIST.md` | immutable by its own dated-entry rule; ADR-009's checklist | dated correction appended (2f) |
| `docs/adr/ADR-020-…` | accepted ADR | untouched |
| `DECISIONS-PENDING.md` | two occurrences: one in the human's verbatim word (entry 110), which is immutable; one in entry 49's status prose (S2) | untouched |
| `state/directives/2026-09-25-cloud-hooks.md`; `RELEASE-0.1.md` | the human's words, verbatim | untouched |
| `state/cut-archive/` ×5 (sqlfilter-panels-publish, residency-debt, 2026-09-24-post-tag-arc, 2026-09-13-release-0.1.0, adr009-checklist) | archives | untouched |
| `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` (Amendments 7–9); `spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md` (its second Amendment 2) | append-only preregistration records | untouched |
| `state/consults/`: 2026-09-26-origin-non-ascii-gate1-reviewer, …-gate2-reviewer, 2026-09-26-governance-weekly-proposals-gate1-reviewer | gate reports | untouched |
| `state/consults/`: 2026-09-17-p3b-re-scope (lines pinned by hash as adopted text), 2026-09-26-partition-offset-bounds-acceptance (a run's report) | filed reports; the standing rule (2g) applies from filing forward | untouched |
| `spikes/lod-feasibility/README.md` (3) | the spike's dated results sections, append-only (S4) | untouched; the pointer line only |

**2b. The normaliser.** One doc-comment line changes. No code and no test changes.

**2c. The scanner, `scripts/hooks/profile-path-scan.mjs`.** Node standard library only.

- **Core function.** `scanText(text)` returns findings (line number and form class). **It never returns or prints the matched segment.**
- **What it refuses:**
  - (i) a full-form profile path: drive or `/c/`, then `Users`, then a segment;
  - (ii) any 8.3 segment under `Users` (one to six characters, `~`, digits), with or without separators;
  - (iii) the local profile's own folder name, read at run time from `os.homedir()` and never written anywhere, after `Users` with or without separators. This rule overrides the allow-list.
- **What it permits:**
  - `Public` (any case);
  - placeholders: a segment wholly in `<…>`, one beginning with `$` or `%`, `…`, `...`, or an empty segment;
  - the explicit allow-list of invented names: `someone`, `someone2`, `x`, `josé`, `someuser`. Matching is case-insensitive and exact. The list is never a pattern and never admits an 8.3 form.
- **Canary.** `checkCanary(scan)` runs before any result counts. It feeds the scanner one full-form path and one 8.3-form path, both built at run time from invented parts, and both must be found.
- **CLI modes:**
  - `--staged`, called by pre-commit;
  - `--message <file>`, called by commit-msg; it scans everything above git's scissors line;
  - `--redact <file>…`, which substitutes in place and prints a count per file. Callers: this piece's rewording and the 2g filing rule.
- **Exit codes:** 0 clean · 1 found (refused; prints `path:line` and the form class) · 2 aborted (any git or tool failure or exception; prints "aborted") · 3 canary not found.
- **`--staged` reads:**
  - the added lines of `git diff --cached --no-color --no-ext-diff --text -U0 --diff-filter=ACMR`;
  - the staged path names from `git diff --cached --name-only -z --diff-filter=ACMR`.
  It uses the index git hands the hook (`GIT_INDEX_FILE` is honoured). Every git call's exit status is checked; a failure exits 2.
- **Merge reading.** When `MERGE_HEAD` exists, a line is refused only if it is added relative to every parent, i.e. it is new to the merge.

**2d. `.githooks/commit-msg`.** The DCO block and its merge skip are unchanged. After it, the hook calls the scanner with `--message "$1"` for every commit, merges included. It refuses on any non-zero exit; node missing (127) refuses with a message saying the scan could not run.

**2e. `.githooks/pre-commit`** (new, LF endings, mode 100755 like commit-msg). It calls the scanner with `--staged` and refuses on any non-zero exit. It locates the scanner relative to `$(dirname "$0")`. It is armed by the same `core.hooksPath` as commit-msg (`AI_DEVELOPMENT.md`, "Commits, checks and CI watchers"), so arming needs no new step.

**2f. Dated corrections,** appended at the end of `PUBLIC-AUDIENCE-AUDIT.md` and `PRE-PUBLIC-CHECKLIST.md`. They are references only:
- round 28, item 1;
- the re-run consult, as the record of each re-run check;
- in the audit only: the commit-message-body class, recorded with the seven commits named in the consult, and a note that history stays.
No path is reproduced.

**2g. The standing rule.** Appended at the end of `AI_DEVELOPMENT.md` as "Amendment 5 to the Custodian role — a filed report's profile paths are redacted at filing (round 28, item 2)". Draft text, to append as written or as ruled on S3:

- Before any agent report is staged under `state/`, the custodian runs `node scripts/hooks/profile-path-scan.mjs --redact <file>`. The filing note says "profile paths redacted at filing (n)".
- The pre-commit check is the backstop, never the method.
- A refusal is never bypassed with `--no-verify`. A false refusal (an invented name) is resolved by adding the name to the allow-list in a reviewed diff.
- The human's verbatim words are not redacted by this rule: see S3.

**2h. CI.** CI does not run the scan. That would be a workflow change, and round 28 names a commit-msg hook and a pre-commit check only. The scanner's tests do run in governance-ci through the existing glob.

## §3. Fixtures and corpus: predicted outcomes

- The 7 substituted files: 26 occurrences on 26 lines become `%USERPROFILE%`. The `--redact` equivalence holds for each file. `git diff --word-diff` shows only the roots changing.
- `normalize.rs`: one line changes.
- Every file in 2a marked untouched: `git diff --quiet <base> HEAD -- <file>`.
- The four append targets (`PUBLIC-AUDIENCE-AUDIT.md`, `PRE-PUBLIC-CHECKLIST.md`, `dep-check/README.md`, the lod-feasibility README): the base bytes are a byte prefix of the head bytes.
- The re-derivation at head finds the 19 untouched files of 2a and nothing else.

## §4. Tests (`scripts/hooks/profile-path-scan.test.mjs`)

Every profile-shaped string in the tests is built at run time or uses an allow-listed name. Each test has one mutation, and each mutation is run and recorded by name in the test file.

| Test | What it proves | Its mutation |
|---|---|---|
| `refuses_a_full_form_profile_path_in_every_separator_form` | full-form paths are refused with every separator | narrow the separator class to backslash only |
| `refuses_an_8_3_short_form_profile_path` | 8.3 segments are refused | remove rule (ii) |
| `permits_the_public_folder_and_paths_outside_the_users_root` | the rider's permitted paths pass | remove the Public exemption |
| `permits_placeholder_segments` | placeholders pass | remove the placeholder rule |
| `admits_only_listed_invented_names` | listed names pass; unlisted invented names are refused | make the list lookup always true |
| `the_local_profile_is_refused_even_when_listed` | the CLI is spawned with HOME and USERPROFILE ending in `someone` | remove rule (iii) |
| `the_canary_must_be_found_before_a_result_counts` | the canary gates the result | `checkCanary` always true |
| `a_scan_whose_git_read_fails_aborts_loudly` | `sh .githooks/pre-commit` with a corrupt `GIT_INDEX_FILE` exits 2 and says "aborted" | treat a git failure as an empty diff |
| `redact_replaces_only_the_profile_root` | only the roots change | replace the whole path |
| `pre_commit_refuses_a_staged_profile_path_and_accepts_public_and_placeholders` | end to end: a temp repo, a real `git commit`, `core.hooksPath` pointing at the checkout's `.githooks` | remove the scanner call from pre-commit |
| `pre_commit_scans_added_lines_only` | untouched lines are not rescanned | scan whole staged blobs |
| `pre_commit_scans_staged_path_names` | staged file names are scanned | remove the name scan |
| `pre_commit_in_a_merge_refuses_only_lines_new_to_every_parent` | the merge reading holds | diff against HEAD only |
| `commit_msg_refuses_a_profile_path_in_full_and_8_3_form` | covers `-m`, `-F`, a merge source, and text below the scissors line being ignored | remove the scanner call from commit-msg |
| `commit_msg_dco_refusal_is_unchanged` | unsigned is refused, signed-clean is accepted, a merge skips DCO | remove the DCO block |
| `the_pieces_own_files_pass_the_scan` | the piece's own files carry no profile path | temporarily add a path literal with an unlisted invented name |

**Normaliser (unchanged tests, the proof for item 2's fixture):** `a_user_profile_destination_becomes_a_token`, `a_root_that_is_a_string_prefix_but_not_a_path_prefix_does_not_match` and `case_differences_collapse_on_windows` stay green under `cargo test -p spatial-kernel permission::audit::normalize`. No new Rust test, so no mutation is owed.

## §5. Predictions · unchanged · invalidators · falsification

**Predictions:**
1. §3 holds exactly.
2. Both JSON files parse.
3. `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` is green, and every one of the 16 mutations fails its test.
4. The piece's own commits made after 2e pass their own hooks.

**Declared unchanged:**
- DCO behaviour;
- every untouched file in 2a;
- `.github/workflows/**`, `.claude/settings.json` and `CONTRIBUTING.md`.

**Invalidators:**
- the re-derivation finds a file §3 does not list;
- an equivalence proof fails;
- the substitution would need a change beyond the root.
Each of these STOPS the piece and goes to the custodian.

**Falsification:** a profile path survives in an in-scope file, or an armed commit carrying one is accepted.

## §6. Instruments

Assertions only: byte equality, exit codes, parse results. No measurement.

## §7. Declared values

- the replacement token `%USERPROFILE%`;
- the allow-list seed (2c);
- the 8.3 grammar;
- exit codes 0, 1, 2, 3;
- canary parts: invented, built at run time, never written as a path.

## §8. Block-on-sight

1. Any added line in `git diff <base>...HEAD`, or any file name, that names a real profile.
2. Any byte change to an untouched file, or a non-prefix change to an append target.
3. A failed equivalence proof, or a JSON file that does not parse.
4. The scanner prints a matched segment.
5. The allow-list holds a real account, or any pattern.
6. A DCO behaviour change.
7. A workflow file changed.
8. A mutation not run and recorded.
9. A line cite into `DECISIONS-PENDING.md`, or a bare self-line.
10. A closing amendment that restates rather than references (the record cap).

## §9. Gates

- **Architect:** block-on-sight items 1 to 10, one by one; round 28's two items against §2.
- **Reviewer:** the full diff, and the hooks run live on the reviewer's machine.
- **Suites:** the node suites; `cargo test -p spatial-kernel`; verify-cites, verify-quotes and verify-test-claims.
- **Operator:** none.

## §10. Amendments — opens empty, append-only
```

---

## Stop items (for the human; the draft does not decide them)

- **S1. How the matcher tells invented names from real ones.** The draft proposes a generic rule plus an explicit allow-list plus the local-profile override (2c).
  - The alternative matches only the local profile's name. That is simpler, but it misses other real accounts. `sidewalk` is the live example: it would pass.
  - The ruling says "refuses new profile paths" but not how. This must be answered before the scanner is written.
- **S2. Entry 49's status prose in `DECISIONS-PENDING.md`.** `AUTONOMY.md` §22 classes the ledger's status prose as current-state, which could be reworded. Round 28's question grouped "the ledger" with the immutable records. The draft leaves it untouched.
- **S3. The human's verbatim words that carry a profile path.** After this piece lands, the pre-commit check would refuse to file them, as it would have for the 2026-09-25 cloud-hooks directive. The options are:
  - redact with a marked note, which departs from byte-for-byte fidelity;
  - keep such words out of the tracked tree;
  - a named exception.
  Until ruled: the check refuses, and the custodian asks.
- **S4. `spikes/lod-feasibility/README.md`, 3 occurrences in dated results sections.** Does the ruling's "spike outputs" cover the spike's own write-up? The draft treats it as immutable and appends only a pointer line.
- **S5. Proposal, outside this piece:** a CI diff-scan backstop for `--no-verify`, unarmed clones and cloud sessions. It is a workflow change, and round 28 did not rule it.
- **S6. macOS and Linux home forms.** The rider names the Windows root, so the draft excludes them. Whether to include them is the human's call.

## See first

1. **A second real account.** `RELEASE-0.1.md`'s quoted verdict names another real account, `sidewalk` ("through my account"). The addendum probably counted it as a made-up name, so round 28's "64 in 25" was short. It is immutable, and the ruling's disposition covers it unchanged. It must never go on the allow-list.
2. **The file count is 27 at 9fbd956, not 25.** The difference is `CUT-STATE-residency-debt.md` (a path written without a drive letter) plus the `RELEASE-0.1.md` file above. The worker's re-derivation is what binds.
3. **The "fixture" is a doc comment**, not a test. The tests already use invented names, so item 2's parenthetical is satisfied by the existing tests plus the one comment line.
4. **The corpus branch's fixed scan is not on `main`.** This piece must not import it.
5. **Dependency check outputs are reworded, not regenerated** (the brief asked for this call). No generator command is recorded for them. The rewording is a scripted, reversible substitution with a byte-equivalence proof against the base.
6. **Merge commits.** Without the merge reading in 2c, the first conflicted merge of `main` into an older branch would be refused on the immutable records' existing lines.
7. **`.githooks/**` is not in governance-ci's path filter.** A change to the hook alone will not trigger the scanner's tests. This is disclosed, not fixed, since fixing it is a workflow change.
8. **Stage the new hook as executable** (`git update-index --chmod=+x`). The end-to-end tests fail on Linux CI without it.

## PLAN node

```yaml
- id: exposure-profile-paths
  title: "Profile paths reworded out of current-state files, drafts, spike outputs and the normaliser fixture; commit-msg and pre-commit refuse new ones (fixed scan, canary)"
  kind: task
  lane: governance
  phase: prototype
  status: ready
  order: null
  depends_on: []
  needs_human: {kind: ruling, minutes: 5}
  gate: scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md
  evidence: null
  budget_minutes: 240
```

- **`needs_human`:** it reflects S1 and S3, which are needed before the scanner and the 2g text. The rewording and the corrections can proceed before them.
- **`gate`:** set it only after the preregistration commit exists.

Files cited: `C:/dev/spatial-ide/.githooks/commit-msg`, `C:/dev/spatial-ide/kernel/src/permission/audit/normalize.rs`, `C:/dev/spatial-ide/.github/workflows/governance-ci.yml`, `C:/dev/spatial-ide/AUTONOMY.md` (§21a–§22), `C:/dev/spatial-ide/AI_DEVELOPMENT.md`, `C:/dev/spatial-ide/state/consults/2026-09-26-exposure-checks-rerun.md`, `C:/dev/spatial-ide/RELEASE-0.1.md`.
