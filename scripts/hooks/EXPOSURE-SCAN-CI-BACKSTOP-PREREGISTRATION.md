# The exposure scan as a CI backstop: a range mode for profile-path-scan.mjs, and a workflow on every PR and every push to main (PLAN node `exposure-scan-ci-backstop`) — preregistration

**Authority:** question round 33, item 1 (RULED 2026-10-02 — question round 33; a RED LINE item, public exposure, part B), and question round 29, item 5 (the backstop proposed at this window). Both are cited by round and item and are not reproduced. The binding words are item 1's option label. The shape that label adopted is the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:39-55` @ 5d03045 sha256:cf8775977cbf815c318efcb743a980dfb831f63d3727ccac48385d04ffc34c63, and the item as asked is `state/questions/round-33.md:5-8` @ 5d03045 sha256:dc429752450e4d809eba58ba2b4f81d3828668052d1ad7d3ede16dc05dd4d43a. Neither is the human's words, and nothing below quotes either. Node: `PLAN.yaml:3399-3415` @ 5d03045 sha256:fcaf9938fa6de28a4218ce5c8cede7eb054eb9acbe7397306f7bd1e06cd3de2c.
**Drafted by** the architect agent on the custodian's brief, read at `main` 5d03045 (the consult: `state/consults/2026-10-02-exposure-scan-ci-backstop-architect-draft.md`). Shape model: `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at 5d03045 (the architect had no Bash); (2) the consult's path in the line above; (3) this line; (4) the six spans in `.github/` and `.githooks/` are referenced as path, commit and hash in plain text, not as `@ <rev> sha256:` pins, because verify-quotes' reference grammar does not accept a path that begins with a dot (routed to PLAN node `governance-hash-grammar-shared`). Nothing else changed. In the same commit PLAN's node takes this form as its gate and 180 minutes as its budget (the consult's open points 3 and 1); the consult's other open points are read as drafted (the probe branch kept, `persist-credentials: false` kept, the `edited` trigger left out), and the required-status-check setting is the human's, raised after a green E5.
**Gating:** full, under three §21a/§21c heads, each enough on its own:
- **Security posture.** The scan is part of the public-exposure posture under ADR-009's visibility, and the workflow writes to a public log.
- **A property currently under test.** §2 item 5 edits the staged mode's diff filter, which the governing form's 2c declares (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:123-126` @ 5d03045 sha256:fd9ccc415d1f96381e42fc3385741e8fa0c54d879d7577a7dc52ab6221e9ad7a).
- **Size.** It is over §21c's bound, and the workflow is a new exposure surface.

Under round 25, item 2 (e), no five-line form is used. AUTONOMY.md §21a, `AUTONOMY.md:315-332` @ 5d03045 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3.

## §0. Disclosure
- **Reasoned from code at 5d03045. Nothing was run.** These parts of the scanner are relied on:
  - the added-line parser, `scripts/hooks/profile-path-scan.mjs:349-409` @ 5d03045 sha256:a7351d2a97bca52c521ad32a889af061c357d9a42cb318bb1fe7738410a4748b;
  - the staged content filter, `scripts/hooks/profile-path-scan.mjs:438` @ 5d03045 sha256:80ddd0d802c989f594e95edbce6a2700fc91bf94fd64e2667bd0a1cfba73b929;
  - the staged name filter, `scripts/hooks/profile-path-scan.mjs:469` @ 5d03045 sha256:6672164ee708cac0cf6594a16b35a6a44660848fc9be217da1da52ee75a14af1;
  - `runGit`, which returns null on failure and leaves git's stderr inherited, `scripts/hooks/profile-path-scan.mjs:341-347` @ 5d03045 sha256:8754e711e629b48b52e35f1601f639d5d315ebfb11e6795833d2e2c61ba53c77;
  - the canary-first entry, `scripts/hooks/profile-path-scan.mjs:553-560` @ 5d03045 sha256:2c8d7aef529ae1ad585735ecc8f2de73348abb82f45f7c81536691f3278902ae;
  - the finding printer and its path redaction, `scripts/hooks/profile-path-scan.mjs:507-510` @ 5d03045 sha256:e2a41f4f98898edd5eb88d29d18efa9c86ba7ea8369e7f39f988047be017e2b3 and `scripts/hooks/profile-path-scan.mjs:533-540` @ 5d03045 sha256:46f66ee3051ed23150d3d539d302061cab9e6bd38d20a08998cbfc467325c6e1;
  - the declared clean and refused lines, `scripts/hooks/profile-path-scan.mjs:542-551` @ 5d03045 sha256:414000e11af44bf571baa396feda340f6f9a52393c7169ce372b60b412e28f82.
- **The pull-request event fields are read from the one workflow here that uses them.** `.github/workflows/dco.yml:117-120` at 5d03045, sha256 e42fdb07530b9f3644c40230211fc61d3c95c1bfed0da070638e514b81ed38bb passes the base and head shas through `env`. `.github/workflows/dco.yml:106-111` at 5d03045, sha256 c48a126cc91d8c5f2e3c9a3b154b0fd68f0b67ccbdd02337404aa6f18f7e4aa2 checks out with full history. `.github/workflows/dco.yml:138` at 5d03045, sha256 34b2a59b506d56e1ed5f948414fbcafc94290b9b1b0a22ec8c9f060d2d9e3577 reads `BASE..HEAD`. Its header records a first green run over a real 11-commit range (`.github/workflows/dco.yml:66-71` at 5d03045, sha256 913ba9772265e41092e42b08e2a6f299eaf081a7b7509eb2d104be8dbe215ed0).
- **H1 (hypothesis): the push event's `before`/`after` fields behave as GitHub documents them,** including all zeros on branch creation. No workflow here uses them (a grep of `.github/workflows/` at 5d03045 finds only dco.yml's two pull-request fields). Discriminator: E2 to E5 (§4). If either field is absent or empty on a real push, that is invalidator I2.
- **H2 (hypothesis): under `-U0`, git emits a type change as a delete patch followed by a create patch for the same path,** and the existing parser reads the create half's `+` lines. Discriminator: T6 and T7. If either fails at the fix, that is invalidator I3.
- **The runner's home directory.** The form claims nothing about the basename of the CI runner's home. Whatever it is, rule (iii) applies to it on the runner as it would on any machine.
- **Routed items** (`PLAN.yaml:2899-2915` @ 5d03045 sha256:82a73af599e43c97a6701fdfe83c73f444281a622fe8f185e7f7f0481769df1b), with the rest of the intake:

  | Item | Disposition |
  |---|---|
  | `--diff-filter=ACMR` skips type changes (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:617` @ 5d03045 sha256:88a7291faf74216a37e8bd8c2bed493b1e488a3925e681b99765934773828796) | **In.** The range mode includes `T` (§2 item 2). The staged mode gains `T` too (§2 item 5): the routed item names the staged filter, and if it were left open, a local commit could pass something CI then refuses only after the push has published it. |
  | The hit in `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` (a punctuation-only segment, `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:619-622` @ 5d03045 sha256:faed493e20fc2bfbe194d053bce6d8a2fedb2f36fcfbe8dd2bb666cbe016b344) | **Out.** A change to the segment grammar is round 29, item 1's matcher, which is the human's. It stays in `exposure-scan-followups`. A range scan never reads that line unless a later diff re-adds it. |
  | The invented 8.3 example in `state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md` | **Out.** It is a filed gate report, byte-identical under AUTONOMY.md §25(b), and stays untouched and routed (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:419-424` @ 5d03045 sha256:8a977ff3c2fc3a1068b1430fa440b57f3bcd05919aa84e6cad818e0fab43546d). |
  | Exempting segments that name no person | **Out.** The human's, as above. |
  | A whole-tree scan | **Out.** Immutable records keep historical paths (round 28, item 2). |
  | PR titles and bodies, issues, comments | **Out.** They are not tracked content. A PR title is read only where a commit message carries it. |
  | Commits made with `--no-verify`, in unarmed clones, in cloud sessions, by web edits, by GitHub merges, by cherry-pick or by rebase (`scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:44` @ 5d03045 sha256:8f96fc31468c6d8aebd1f0484829ef1c4ae04c3ed0852c289b0b9fe3f02e8c4d; `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:362-364` @ 5d03045 sha256:b797cc7aaf2795b59780bd66bb5ba9d51e66e7db89a0164643955cbc00721c73) | **In by construction.** The range mode reads every commit in the range, whatever made it. This is detection after publication (§1). |
  | A `pre-merge-commit` hook; the dead DCO merge skip | **Out.** Both hooks stay unchanged. |
  | Making the check required for merge | **Out.** Branch protection is the human's. |

- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. On every `pull_request` event (opened, synchronize, reopened) and every push to `main`, the workflow runs the range mode over the event's range. The job is green only when the scan exits 0 and its stdout is exactly the declared clean line.
  2. The range mode exits 1 when any of the following carries a form the governing form's 2c refuses (the matcher is unchanged):
     - an added line of the three-dot diff, type changes included, with renames and copies read through `-M` so that only their changed lines count;
     - a new path name (status A, C or R);
     - a commit message in `<base>..<head>`, merge commits included.
  3. Nothing the range mode prints carries a refused segment or any text of a commit message, and git's own stderr never reaches its output (T11, T12).
  4. A range that cannot be computed never exits 0. That covers a base or head that does not resolve to a commit in the clone (an all-zeros `before` included), no merge base, and bad arguments: each exits 2 (T10).
  5. The staged mode reads type changes (T7).
- **May not claim:**
  - **Prevention.** Each run happens after the branch or `main` push is already public. The backstop detects; it does not withhold.
  - **Pushes outside its triggers:** a branch pushed while no PR is open, a push to any branch other than `main`, and tags.
  - **Text outside commits:** PR titles and bodies, issues, comments and release text, except what a commit message carries.
  - **History outside a scanned range,** including the seven pushed commit bodies that round 28, item 1 leaves in history.
  - **A PR that edits the scanner or the workflow:** the `pull_request` run executes the PR's own merged code, so such a PR is checked by the code it changes. That diff is the gates' to read.
  - **That the check is required for merge.**
  - **The scanning machine's own flattened profile form, in CI.** Rule (iii) keys on the home of the machine that runs the scan. The Users-root and home forms of any unlisted name are still refused, by rules (i) and (iv).
  - **A PR whose base is retargeted,** until its next push.
  - **A diff or log above the 64 MiB per-call ceiling (§7):** it aborts, red.
  - **A force push to `main` whose `before` no longer resolves:** it aborts, red, and is not scanned.
  - **The governing form's own limits:** UTF-16 content; home forms other than the three it names; flattened forms with `_`, `.` or a space as separators.
  - **macOS:** no run is made there (R5).
  - **Any `docs/08` figure.**
- **Unchanged:**
  - the matcher (`findMatches`, `extractSegment`, `classifySegment`, the roots, both lists, the 8.3 grammar);
  - the canary;
  - `--message`, `--redact` and `--redact-segment`;
  - the staged mode, except the one token of §2 item 5;
  - `.githooks/pre-commit` and `.githooks/commit-msg`;
  - every existing test's code and its `RECORDED MUTATION` comment;
  - every other workflow;
  - no new dependency and no `package.json`.

  ADR-006 does not apply: this is repository tooling, not a product operation. No ADR is amended. ADR-009 is cited for posture only.
- **Seams:**
  - **GitHub's event payload into the workflow.** The pull-request fields are read against dco.yml's green use. The push fields are proven by E2 to E5 from real events, never by a unit test.
  - **The workflow into the scanner's CLI.** This crosses a process boundary only. The new mode is reached through `main()`, after the canary.
  - **No new export.** The tests spawn the shipped CLI (`process.execPath`), so the range mode's only caller is the workflow, which lands in the same PR.

## §2. The change
1. **CLI:** `node scripts/hooks/profile-path-scan.mjs --range <base> <head>`.
   - Exactly two arguments, neither beginning with `-`. Anything else exits 2.
   - It is dispatched from `main()` after `checkCanary` (exit 3 on failure, unchanged).
   - `localName` is the basename of `os.homedir()`, as in every mode. No flag, environment variable or secret supplies another name.
2. **What it reads, in this order.** Every git call runs with stderr captured and never forwarded, and returns null on a non-zero status.
   - (a) **Resolution.** `git rev-parse --verify <base>^{commit}` and the same for `<head>`, then `git merge-base <base> <head>`. If any of the three fails, the mode prints the fact line (§7) and `aborted` to stderr and exits 2.
   - (b) **Added lines.** `git diff --no-color --no-ext-diff --no-textconv --text -U0 -M --diff-filter=ACMRT <base>...<head>`, parsed by the existing `parseAddedLines`, unchanged, and scanned with `scanText`. A finding is `path:line class`, the line being on the head side.
   - (c) **New path names.** `git diff --name-only -z -M --diff-filter=ACR <base>...<head>`, each name scanned. A finding is `path:0 class`, as in the staged mode.
   - (d) **Commit messages.** `git log -z --format=%H%n%B <base>..<head>`, with merges included and no `--no-merges`. Each message (`%B`) is scanned whole. A finding is `commit <40-hex>:<line> <class>`, and no text of the message is printed.
   - Any null after (a) prints `aborted` and exits 2.
3. **Output:**
   - Stderr carries one count line (§7), then the findings, through the existing `printFindings` and `safePrintablePath`.
   - Stdout is exactly the clean line with exit 0, or exactly the refused line with exit 1. On exit 2 or 3, stdout is empty.
4. **Non-ancestor base.** When `<base>` resolves but is not an ancestor of `<head>` (a force push whose `before` is still in the clone), the three-dot diff and the two-dot log already read everything new since the merge base. No special path exists. When `before` does not resolve, (a) exits 2. Neither case ever reads as clean without a computed range.
5. **The staged mode:** in `stagedAddedLinesAgainst`, `--diff-filter=ACMR` becomes `--diff-filter=ACMRT`. The name scan keeps `ACMR`, because a type change adds no name. Nothing else in the staged mode changes.
6. **The scanner's header comment** gains one sentence naming the range mode and this form. It quotes nothing.
7. **`.github/workflows/exposure-scan.yml`** (new):
   - **Triggers:** `pull_request` with types `[opened, synchronize, reopened]` (dco.yml's set), and `push` with `branches: [main]`. There is no `paths`, no `paths-ignore`, no `workflow_dispatch` and no `pull_request_target`.
   - **No `concurrency` block.** A pending `main` run must never be replaced by a newer one, because that would drop a pushed range.
   - **Permissions:** top-level `permissions: contents: read`. No `secrets.` reference.
   - **The job:** one job on `ubuntu-latest`, with `timeout-minutes: 10`. Its steps:
     - `actions/checkout@v4` with `fetch-depth: 0` and `persist-credentials: false`;
     - `actions/setup-node@v4` with `node-version: "24"`, as `.github/workflows/governance-ci.yml:118-124` at 5d03045, sha256 b7431b63b728cf36da09f2c62bad9f41ba778530b7642d3cec3979de012d8c16 does;
     - one `run:` step.
   - **The run step:**
     - Event values arrive only through `env`, never as `${{ }}` inside `run:`: `PR_BASE`/`PR_HEAD` from `github.event.pull_request.base.sha`/`.head.sha`, and `PUSH_BEFORE`/`PUSH_AFTER` from `github.event.before`/`.after`.
     - A `case` on `GITHUB_EVENT_NAME` selects the pair. Any other event prints the workflow's fact line (§7) and exits 2.
     - It runs the scanner with `set +e`, captures stdout, and accepts only when the status is 0 and stdout is exactly the clean line, mirroring the hook's rule at `.githooks/pre-commit:23-25` at 5d03045, sha256 db3fbfb2f11a71d558013c45f0e424aeb6e75d0498df924aad25155b35580653.
     - Otherwise it prints the workflow's consequence line (§7) and exits with the scanner's status, or with 2 when the status was 0 without the line.
     - No `|| true` and no `continue-on-error`.
   - **Header comment:**
     - what a green run means, stated narrowly (§1 may-claim 1 and 2);
     - what it does not mean (§1's may-not-claim, by reference to this form);
     - why there is no `paths` filter and no concurrency block.

     It quotes nothing.
8. **What a red run means operationally:** no new rule. Public exposure is already a red line that the custodian routes to the human.
9. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65` @ 5d03045 sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b):
   - **R1:** one matcher and one range reading on every platform. The only OS-derived input is `localName`, and rule (iii) treats it the same way everywhere.
   - **R2:** no OS-conditional code is added. The existing win32 case-fold in `computeIsMain` is untouched. This is tooling, not a product boundary.
   - **R3:**
     - Linux (ubuntu-latest, CI): supported and tested in governance-ci.
     - Windows: supported and tested by the worker locally.
     - macOS: no run and no claim.
   - **R4:** the new tests build type changes and renames through git plumbing, with no filesystem symlink. They take temp paths from `os.tmpdir()`, spawn `process.execPath` and `git` (no direct `sh`; T7 reaches the hook through git, as the existing hook tests do), and write no drive letter into a temp path. The drive-letter forms the matcher reads are matched content, not an OS assumption.
   - **R5:** only these suites passing on the two platforms that run them. Nothing at L2 or L3.
   - **R6:** no test is ignored on any platform.

## §3. Fixtures and predicted outcomes
Every fixture repo is a fresh `os.tmpdir()` repository, not armed (no `core.hooksPath`), except T7's. Each is removed in `finally`. Every profile-shaped string is built at run time from invented, unlisted parts (`mk(...)`), or uses a listed name.

| # | Range content | Exit | Stdout | Stderr |
|---|---|---|---|---|
| S1 | head adds a file with one invented Windows full form on line 2 | 1 | refused line | count line; `f.txt:2 unlisted-segment`; no segment |
| S2 | head adds a file under an invented drive-less 8.3 Users path name (built in the index), with clean content | 1 | refused line | `<redacted name>:0 8.3`; no segment |
| S3 | head renames a clean file (`git mv`, R100) to the S2-shaped name | 1 | refused line | as S2 |
| S4 | head's message carries an invented POSIX home form plus an invented marker word | 1 | refused line | `commit <sha>:<n> unlisted-segment`; neither the segment nor the marker word |
| S5 | as S4, but the form is in a merge commit's message only | 1 | refused line | `commit <merge sha>:<n> …` |
| S6 | base has a regular file; head makes it mode 120000 whose blob is an invented Windows full form (`hash-object -w` plus `update-index --cacheinfo`) | 1 | refused line | `link:1 unlisted-segment` |
| S7 | T7: an armed repo stages S6's type change; `git commit` | non-zero (the hook's refusal) | — | — |
| S8 | base has a file with an invented full form on an unchanged line, and a second file carrying one that head renames unchanged; head appends a clean line | 0 | clean line | count line with commits 1 and added lines 1 |
| S9 | M has a file with an invented full form; X (from M) deletes that line; Y (from M) adds a clean line; `--range X Y` | 0 | clean line | — |
| S9′ | as S9, with Y′ adding an invented full form | 1 | refused line | Y′'s finding only |
| S10 | base is all zeros; an unknown 40-hex base; an unknown head; two unrelated roots; a base beginning with `-`; one argument | 2 each | empty | exactly the fact line, then `aborted` |
| S11 | S1, S3 and S4 in one range | 1 | refused line | three findings; no segment, no marker word |
| S12 | `HOME` and `USERPROFILE` set to the machine account `runner` in POSIX and Windows form; head adds a POSIX home path and a Windows Users-root path under `runner` | 0 | clean line | — |

## §4. Tests, one mutation each (`scripts/hooks/profile-path-scan.test.mjs`)
- **New helpers:** an unarmed repo initializer, and a range runner that spawns `process.execPath scannerPath --range <base> <head>` with the repo as cwd and an optional env. No existing helper is edited.
- **No timing.** No sleep, timeout or timing assertion.
- **How a mutation is observed:** apply it, run the named test, record the first failing assertion in the test's `// RECORDED MUTATION:` comment, then revert. The commit it was observed at is named in the closing record, since a comment cannot name the commit that contains it. A `verify-mutation` run is not an observation.

| # | Test | Scenario | Mutation |
|---|---|---|---|
| T1 | `a_range_scan_refuses_a_profile_path_in_an_added_line` | S1 | M1: the range mode drops the added-line findings |
| T2 | `a_range_scan_refuses_a_profile_path_in_an_added_path_name` | S2 | M2: the range mode skips the name scan |
| T3 | `a_range_scan_refuses_a_profile_path_in_a_renamed_path_name` | S3 | M3: the name filter becomes `--diff-filter=AC` |
| T4 | `a_range_scan_refuses_a_profile_path_in_a_commit_message` | S4 | M4: the range mode skips the message scan |
| T5 | `a_range_scan_reads_a_merge_commits_message` | S5 | M5: `--no-merges` added to the log read |
| T6 | `a_range_scan_refuses_a_profile_path_brought_in_by_a_type_change` | S6 | M6: `T` dropped from the range content filter |
| T7 | `a_staged_type_change_is_refused_by_the_pre_commit_hook` | S7 | M7: the staged filter restored to `ACMR` |
| T8 | `a_clean_range_exits_zero_and_leaves_unchanged_lines_and_pure_renames_unscanned` | S8 | M8: `-M` replaced by `--no-renames` in the content diff |
| T9 | `a_range_whose_base_is_not_an_ancestor_scans_from_the_merge_base` | S9, S9′ | M9: the content diff made two-dot (`<base> <head>`) |
| T10 | `a_range_that_cannot_be_computed_aborts` | S10 | M10: in the range mode, every git failure read as an empty result |
| T11 | `a_range_mode_git_failure_prints_only_declared_lines` | S10's unknown-base case | M11: the range mode's git calls inherit stderr |
| T12 | `the_range_mode_prints_no_segment_and_no_commit_message_text` | S11 | M12: a commit finding prints the message's first line after its class |
| T13 | `a_range_scan_permits_machine_account_paths_under_a_runner_home` | S12 | M13: `runner` removed from `MACHINE_ACCOUNTS` |

- **End-to-end runs from the real shape (the seam rule).** The worker records each run's id. The custodian records E5.
  - **E1:** this PR's own `pull_request` run, green at the head marked ready. Its count line's commit count equals `git rev-list --count <base.sha>..<head.sha>` for the shas the step's `env` shows.
  - **E2 to E4:** a probe branch `probe/exposure-scan-push`, cut from the piece's head. Its only difference is the push trigger's `branches:` value, and `git diff --stat` shows one line in the workflow file. The piece's branch never carries it.
    - **E2:** the creation push. Predicted red, exit 2, fact line.
    - **E3:** a fast-forward push of one clean commit. Predicted green, with a count line of 1 commit.
    - **E4:** a force push whose old `before` is on no other ref. Predicted red, exit 2, fact line, if `before` is absent from the clone. If it is present, predicted green under §2 item 4. Either outcome is declared, and which one happened is recorded.
  - **E5:** the first push to `main` after the merge. Predicted green, with counts equal to `git rev-list --count before..after`. It is recorded by the custodian as a class 1 row on main. A red E5 is a red-line event to the human.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - T1 to T13 pass at the fix, and each fails under its own mutation.
  - Every existing test in the file passes unchanged.
  - E1 to E5 come out as §4 predicts.
  - The `node --test` scripts suite is green on Windows and in governance-ci.
- **Declared unchanged:** §1's Unchanged list, and the governing form's records.
- **Invalidators:**
  - **I1 (stop, to the custodian; to the human if a real profile is involved):** E1 is red on a finding in this piece's own range.
  - **I2 (stop):** a real event lacks or empties a field §2 item 7 reads (H1).
  - **I3 (stop):** T6 or T7 fails at the fix because the type change does not reach the parser (H2).
  - **I4 (stop, to the custodian):** the change needs an edit to `parseAddedLines`, the matcher, either list, the canary, the redact modes, `--message` or either hook.
  - **I5 (stop):** a test needs a filesystem symlink, a direct `sh` spawn, a drive letter in a temp path, or a platform ignore.
  - **I6 (stop):** an existing test fails after §2 item 5.
  - **I7 (stop):** the file count goes past §7's.
- **Falsification:** any of the following.
  - A range whose added lines, new names or messages carry a form 2c refuses exits 0.
  - Any output of the range mode carries a refused segment or any text of a commit message.
  - A range that cannot be computed exits 0.
  - A workflow run is green without the exact clean line.

## §6. Instruments
Assertions only:
1. Exit status and exact stdout/stderr lines; absence of the segment and of the marker word.
2. `git rev-list --count` against E1, E3 and E5's count lines.
3. The probe's `git diff --stat` against the piece's head.
4. `git --version` and `node --version` on each platform that runs the suites (round 15 (c)).
5. `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each named with the tool's commit.

## §7. Declared values and ceilings
- **CLI:** `--range <base> <head>`. Exit codes 0, 1, 2 and 3, and the clean and refused lines, are unchanged.
- **The git argument sets** of §2 item 2 (a) to (d), and the staged content filter `ACMRT`.
- **Finding formats:** `path:line class`, `path:0 class`, `commit <40-hex>:<line> <class>`.
- **The count line** (stderr): `profile-path-scan: range read <c> commits, <l> added lines, <n> path names`.
- **The scanner's fact line** (stderr): `profile-path-scan: range not computable`.
- **The workflow's lines:**
  - the fact line: `exposure-scan: no range for event <name>`;
  - the consequence line: `exposure-scan: the range is not accepted (scanner exit <n>)`.
- **Per-call ceiling:** `runGit`'s existing 64 MiB `maxBuffer`. Exceeding it aborts with exit 2.
- **Workflow values:** `ubuntu-latest`; `timeout-minutes: 10`; Node `"24"`; `actions/checkout@v4` and `actions/setup-node@v4` only.
- **Size budget:** ≤ 800 changed lines, insertions plus deletions, over ≤ 3 files: `scripts/hooks/profile-path-scan.mjs`, `scripts/hooks/profile-path-scan.test.mjs` and `.github/workflows/exposure-scan.yml`.
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 110 scanner lines, 500 test lines and 90 workflow lines.
- **Minutes:** 180 (the custodian's check under AUTONOMY.md §10).

## §8. Block-on-sight
1. Any output of any mode carries a refused segment or any text of a commit message, or git's stderr reaches the range mode's output.
2. A change to the matcher, either list, the roots, the canary, `parseAddedLines`, the redact modes, `--message` or either hook.
3. A staged-mode change beyond §2 item 5's one token.
4. The workflow carries any of the following:
   - a `paths` or `paths-ignore` filter, or a trigger other than §2 item 7's;
   - `pull_request_target`;
   - a `concurrency` block;
   - permissions beyond `contents: read`, or any `secrets.` reference;
   - an action other than the two named;
   - any install step or dependency;
   - `continue-on-error`, or `|| true` on the scan;
   - `${{ }}` inside `run:`;
   - a scanned head taken from the synthetic merge ref;
   - acceptance on exit status alone.
5. The probe trigger present at the gated head.
6. A quotation in the workflow header, the scanner's comments or the new tests' comments.
7. A test that:
   - writes a profile-shaped literal rather than run-time parts or a listed name;
   - uses a filesystem symlink, a direct `sh` spawn, or a drive letter in a temp path;
   - is ignored on a platform;
   - leaves its temp directory behind.
8. A file outside §7's three, apart from this form and the custodian's generated set.
9. Any user-profile path anywhere in the diff or in a commit message of the range.
10. A record calling a `verify-mutation` run an observation, or a mutation recorded without its commit in the closing record.
11. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class 9 amendment.
12. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - reproduced text without its path:line and hash;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.
13. A squash or rebase merge.

## §9. Gates
- **Architect:**
  - the Gating line's three heads;
  - round 27, item 2 (i) and (ii) as carried by round 28, items 1 and 2;
  - round 28, item 2 (no whole-tree scan);
  - round 29, items 1 (the matcher unchanged), 4 (the machine accounts) and 5;
  - round 30, item 1 (rule (iii) on a runner, §1);
  - round 33, item 1 against §2;
  - ADR-009's visibility posture;
  - the seam reading and the caller rule (§1);
  - the round 7 ruling on operator-visible text (§7's lines state facts, and the workflow states its own consequence);
  - R1 to R6;
  - the intake table;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M13 observed;
  - E1 to E4 read by run id, with counts recomputed;
  - the hooks run live for T7;
  - §7 recounted.
- **Suites, green before either gate:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, and governance-ci on ubuntu-latest;
  - the §6 item 5 tools, each with its commit;
  - branch CI read before gating.
- **Operator:** none.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)

### Amendment 1 — S3's rename built through the index, not with `git mv` (class 2, a deviation)

Written after the worker's results were seen (class 2, a post-result amendment). §3 and §4 are not edited.

1. **The deviation.** §3's S3 row names `git mv` for the rename. The worker built the rename through the index instead: `git rm --cached`, then the blob staged at the new name with `git update-index --add --cacheinfo`. This way no directory with an 8.3-shaped name is created on the Windows filesystem. T3 asserts that the range's name status is `R100` before it scans (branch commit 02bde66, `scripts/hooks/profile-path-scan.test.mjs`, the test `a_range_scan_refuses_a_profile_path_in_a_renamed_path_name`). S3's scenario, T3's name and assertions, and M3 do not change.
2. **Why nothing else changes.** §2 item 9's R4 already builds type changes through git plumbing, and this uses the same means for S3. The worker's report is filed as `state/consults/2026-10-02-exposure-scan-ci-backstop-worker-report-1.md`.
