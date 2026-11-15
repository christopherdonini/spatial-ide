# scripts/plan/verify-quotes.mjs and scripts/plan/docsOnly.mjs read a file over one mebibyte through git — full form (`docs/PREREGISTRATION-TEMPLATE.md`)

*Committed on main before any code. Append-only once committed. An amendment written after any outcome of this piece has been seen says so in its first line. PLAN node `verify-quotes-and-docsonly-read-files-over-one-mebibyte`: the governance lane, S3, the docs slot. Drafted by the architect, read only, at main 9c7a187b7c2497617f96c0174043706f0a7aa95f. The custodian's script fills every pin. At this commit the custodian sets the node's `gate` field to this path, on main. The branch carries no PLAN file and no generated file. Gating: full, from dispatch (OPEN-1).*

**Authority.** PLAN node `verify-quotes-and-docsonly-read-files-over-one-mebibyte`, named in words by its id and its summary field, with no pin into the plan (ADV-2026-11-15-09 item 7 (b): the plan is over 1 MiB at this commit, and that is the defect this piece fixes). The node was placed by the advisor's ruling ADV-2026-11-15-09, items 3 and 4 (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-09-verify-quotes-and-the-docs-only-tool-read-files-over-one-mebibyte-a-node-in-the-docs-slot-now-s3-budget-60.md`). That ruling was made under the human's delegation of 2026-11-13 and is not the human's words. The reuse index found no prior art on any of its three searches (git show maxBuffer large file; execFileSync buffer limit; docs-only diff classifier), and those misses are noted here.

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

    $ node tools/reuse.mjs git show maxBuffer large file   (exit 1)
    No prior art recorded for "git show maxbuffer large file". Research it before planning an implementation.
    $ node tools/reuse.mjs execFileSync buffer limit   (exit 1)
    No prior art recorded for "execfilesync buffer limit". Research it before planning an implementation.
    $ node tools/reuse.mjs docs-only diff classifier   (exit 1)
    No prior art recorded for "docs-only diff classifier". Research it before planning an implementation.

### §0. Disclosure
- **Reasoned from the text. Nothing was run by the drafter.** Each statement below about a tool's behaviour is about the tool at 9c7a187b (round 15 (c)).
- **The two reads.**
  - verify-quotes' `gitShowFile` is `scripts/plan/verify-quotes.mjs:655-661 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:75ebeea16e3842b4614ccf61fdc113778dca62676a97bc023298b104ea0f0d08`. Its `execFileSync` options are `cwd`, `encoding` and `stdio`, and there is no `maxBuffer`. The catch returns `null`.
    - Its two callers are in `checkHashRef`: `scripts/plan/verify-quotes.mjs:783-801 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:3dc6c0a3cca556bf1fe8375041d805303e798e69c165cb3b44372b096e0e8356`.
    - A tracked path whose read returns `null` gives the finding `unresolvable rev "<rev>" for "<path>" -- git show failed`. An untracked path gives `unresolvable path …`.
    - `runVerifyQuotes` and `listCiteContents` both call `checkHashRef`, so the hash gate and the `--show-cites` mark are both affected.
    - A finding prints the FAIL lines and sets exit 1: `scripts/plan/verify-quotes.mjs:1204-1210 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:3ee22805dd895bab0bce94e263e7d697e880518950c394cd8379196ec8e4f911`.
  - The docs-only tool's `gitShow` is `scripts/plan/docsOnly.mjs:71-77 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:4ca822687fd558a88715719c75eebec83fc2e34142f9a322a7955c390b27941d`. Its options are `cwd` and `encoding`, and there is no `maxBuffer`. The catch returns `null`.
    - For `governance/PLAN.yaml`, a `null` at either ref gives the offending line `governance/PLAN.yaml: added or deleted — not a mechanical docs-only change`: `scripts/plan/docsOnly.mjs:138-143 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:9cd5cd7f8cbb581665181723463439dae1740696d8dba6ca80513e2745ade07d`.
    - Then `main` prints its NOT-eligible line and the list, and sets exit 1: `scripts/plan/docsOnly.mjs:195-199 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:b8d9c835c9c2b8db6c69dc116ddabf68a420f4fac8b8fabd478299930b31272a`.
    - The same `gitShow` serves the ADR Status guard (`:124-125` of that pin's file at that commit). An ADR is already offending there by the outright exclusion.
  - Node's default buffer for `execFileSync` is 1024 × 1024 bytes, as ADV-2026-11-15-09 item 1 says. The drafter read no Node documentation. Rows E1 and E3 (§3) show the effect on this machine's Node.
- **The value.** verify-cites already sets `maxBuffer: 1 << 28` (268,435,456 bytes) on its git reads: `scripts/plan/verify-cites.mjs:340-341 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:9049da17455363d3d0c5d4473a914dc8af4d51315cf3b005bd536ae2abab42b1` and `scripts/plan/verify-cites.mjs:394 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:1679d2ff59bd1527f4c48049a78e973f56da069f129d387edc239508067845b2`.
- **Sibling search** (§14, `governance/AUTONOMY.md:215 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:5fc1d41f0bad9f276ad4b4c845d4d5ddcdf9af27c467ade5ae83e626387cd2c1`). The search covered every `execFileSync(` and `spawnSync(` in `scripts/plan/*.mjs` other than the tests.
  - Two other git reads of file content have no buffer:
    - `scripts/plan/verify-test-claims.mjs:316 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:931388ef5c0fde5d263dbe78afb4d87d8b9acfdaab6db89624ea2d65bc0bfe74`;
    - `scripts/plan/verify-mutation.mjs:42-52 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:69936e4c652e736cc8f51865390b6359c024ead076bd891551d1d8800f9fa205`.
    - Both belong to PLAN node `verify-test-claims-and-verify-mutation-read-files-over-one-mebibyte`, which is proposed and unplaced (ADV-2026-11-15-09 item 5). They are not in this piece.
  - Some calls have no buffer but do not read file content:
    - the `git ls-files` lists at `scripts/plan/verify-cites.mjs:197 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:d5b019d5cdf058b112c1142685d6a6a2489650e6e82bbe9790d9187e42940840`, `verify-test-claims.mjs:741` and `forms-layout.mjs:30`;
    - docsOnly's `merge-base` and `diff --name-only` at `scripts/plan/docsOnly.mjs:59-69 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:49bb9721d84374e53f50de814b178ccf71f861a7e57a7c67886fa60f03fdbb63`;
    - verify-test-claims' one-line `git blame`.
    - These are not in this piece, by item 5's terms.
- **Grep over the working tree**, outside `state/` and `governance/forms/`, with gitignored paths not searched:
  - `gitShowFile`: 9 occurrences in 5 files (`governance/PLAN.yaml` 1, `scripts/plan/verify-quotes.mjs` 3, `scripts/plan/verify-test-claims.mjs` 3, `scripts/plan/verify-quotes.test.mjs` 1, `scripts/plan/verify-test-claims.test.mjs` 1).
  - `gitShow` as a word: 9 in 3 files (`governance/PLAN.yaml` 1, `scripts/plan/verify-mutation.mjs` 3, `scripts/plan/docsOnly.mjs` 5).
  - `docsOnly`: 15 in 7 files (`governance/AI_DEVELOPMENT.md` 1, `governance/AUTONOMY.md` 1, `governance/CUSTODIAN-QUEUE.md` 1, `governance/PLAN.yaml` 4, `scripts/plan/README.md` 3, `scripts/plan/docsOnly.mjs` 4, `scripts/plan/docsOnly.test.mjs` 1).
  - `maxBuffer`: 29 in 24 files. One of them is `maxBufferSize` in the ADR-003 spike, which is another name.
  - No file outside the two tools calls either function: each is module-private.
- **How the tests reach the functions: by export, with none added.**
  - `runVerifyQuotes({ repoRoot, files })` is exported (`scripts/plan/verify-quotes.mjs:874-879 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:27c7c63cce73ac94b0d44ec9aa9785f1f263776343caf7f64f6b3a512c558af5`). It reaches `gitShowFile` through its hash pass.
  - `checkDocsOnly(repoRoot, base, head)` is exported (`scripts/plan/docsOnly.mjs:96-98 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:807ac33fbaa93c5c32194f1eb5f7c1a852ddaae80fe5edb31c8998462cc78432`).
  - Both test files already import these functions.
  - The command line cannot reach a temporary repository. verify-quotes fixes `REPO_ROOT` to its own checkout (`scripts/plan/verify-quotes.mjs:143-144 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:49ce24316389cb52bec95a53135339e38fc80738b4ac2ed1dd1ed4005e3a3e75`). docsOnly takes its root from its own folder (`scripts/plan/docsOnly.mjs:189-192 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:d51abf75f3a569f0015b816be71553ba139520e3d18a386ae8dee1d23f60e681`).
- **Rule (00)** (`governance/AUTONOMY.md:609 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0`), at 9c7a187b, by the brief's branch lists:

| In flight or waiting | Paths under scripts/plan | Overlap with this piece |
|---|---|---|
| port-2, `cut/port-2-macos-l1-and-app-dirs` (built, not yet a PR) | `cfg-boundary.mjs`, `cfg-boundary.test.mjs` | None. It shares the `node --test` glob only. |
| PR B, `cut/b1-shell-half-pr-b` (not yet a PR) | none | None. |
| `advisor-session-merges-under-the-humans-rule` | none (AUTONOMY.md, AI_DEVELOPMENT.md) | None. |
| `advisor-silence-two-hour-alarm` | neither tool, by ADV-2026-11-15-09 item 6 | None. |
| `docsonly-wording-licenses-no-merge` (not started; it waits on the merges piece) | `docsOnly.mjs`, header and output lines | Not in flight. It starts after this piece merges, and its form is drafted against `docsOnly.mjs` as this piece leaves it. |
| protocol/, wire fixtures, Cargo.lock, package-lock.json | none | None. |

  The custodian lists rule (00) again at this form's commit (ADV-2026-11-15-09 item 6).
- **Order.** The OPEN items are answered by the advisor before any code. If the human's answer on ADV-2026-11-15-07 or ADV-2026-11-15-04 is filed while this piece holds the slot, the custodian tells the advisor, who rules the order (ADV-2026-11-15-09 item 3 (c)).

### §1. What this preregistration may and may not claim
- **May claim:**
  - From the merge, `gitShowFile` in verify-quotes and `gitShow` in the docs-only tool each accept up to `1 << 28` bytes of `git show` output.
  - A hash pin into a file over 1 MiB, at a rev where it is over 1 MiB, recomputes. A diff that changes a `governance/PLAN.yaml` over 1 MiB is judged by its content (lane priorities, felt-verdict statuses).
  - Each claim is proven by one test with a fixture the test makes (§4).
  - For output at or under the default, each read returns what it returned before. The option only raises the ceiling.
- **May not claim:**
  - anything about a file over `1 << 28` bytes, which still reads as before (unresolvable; added or deleted);
  - the two reads of item 5 (verify-test-claims, verify-mutation), or any `ls-files`, `merge-base` or `diff --name-only` call;
  - that the docs-only tool's header and output wording are current, which is PLAN node `docsonly-wording-licenses-no-merge`;
  - that the tool's exit 0 licenses a merge, which the merges form's Part B (xii) covers;
  - anything under `tools/mods/` (ADV-2026-11-15-09 item 8);
  - any duration or measurement.
- No ADR is cited or amended. Nothing touches the wire, `docs/08` or an app string.

### §2. The change
- **2.1 `scripts/plan/verify-quotes.mjs`.** One line changes in place: the `execFileSync` call inside `gitShowFile`, line 657 at 9c7a187b. Its options object gains `maxBuffer: 1 << 28` as its last property, after `stdio`. Nothing else in the file changes: no comment, no import, no export.
- **2.2 `scripts/plan/docsOnly.mjs`.** One line changes in place: the `execFileSync` call inside `gitShow`, line 73 at 9c7a187b. Its options object gains `maxBuffer: 1 << 28` after `encoding`.
  - Nothing else in the file changes. The header (lines 1 to 19), the two output lines (196, 201), every exit code and every reason text stay as they are, and no line is added (ADV-2026-11-15-09 item 4 (d)).
  - So no line below 73 moves, and the line numbers that PLAN node `docsonly-wording-licenses-no-merge` names in its summary field (4, 18, 196, 201) stay true.
- **2.3 Tests.** Each test is appended at the end of its file. No existing line changes and no import changes (§4).
  - The docs-only test calls `checkDocsOnly` only. It asserts neither output line of `main`, so the docs-only node's summary field, which says the test file asserts no output string, stays true.
  - Each test has a `// RECORDED MUTATION:` comment above it, the convention at `scripts/plan/verify-quotes.test.mjs:5-6 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:5ea8ada3b9fcf65e42451dd2f455dc4aafed57cda342bf0079c02ff3d3424a11`, which `scripts/plan/verify-mutation.mjs:17-22 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:1d8b2a0dfbb3a2d54c6e2084a7c34eb0fc427fe463d800d2b073ef1136d6e882` looks for.
  - A comment names code by file and function, with no `path:line`.
- **2.4 Unchanged:**
  - every other file, including `scripts/plan/README.md`, every other script under `scripts/plan/`, `tools/mods/**`, every workflow, `governance/PLAN.yaml` on the branch, and every generated file;
  - every existing test's text.
- **2.5 Seams.** The tests are written against the exports as they are:
  - `runVerifyQuotes({ repoRoot, files })` returns an object with `hashFindings` as `[{ relPath, line, reason }]`;
  - `checkDocsOnly(repoRoot, base, head)` returns an array of strings.
  - The product callers of the two reads are CI's verify:quotes step (`.github/workflows/governance-ci.yml:157-158 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:35b710cd0e71fda471f9e1090028a3f07d9165d46849496a6799f0bf6fc761ac`) and the forms that run the docs-only tool (`governance/forms/root/ADVISOR-SESSION-MERGES-UNDER-THE-HUMANS-RULE-PREREGISTRATION.md:250 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:3fc9d3efffeb386fcd6030a95e0a586cbee18522c92243d40de09299cd8e6346`).
  - No callback, `pub` item or export lands. The only new option is Node's own `maxBuffer`, at two call sites that product code already runs.

### §3. Evidence rows and fixtures, outcomes declared before the run
The custodian runs E0 to E3 on main, in the main checkout, after this form's commit and before dispatch (OPEN-4). It records them in Amendment 1 (class 1), naming the commit of the tools it ran. The only file it writes is a scratch file in `C:/dev/wt/mib-evidence/`, which is outside every checkout. So nothing tracked is written, and the printed relative path names no profile folder. The worker re-runs E1, E2 and E3 at the head (§9). All the rows are light.

- **E0, sizes.** `git cat-file -s <rev>:governance/PLAN.yaml` for three revs:
  - 9c7a187b7c2497617f96c0174043706f0a7aa95f: over 1048576;
  - 8faccf8958016e0d39095d8e53de1d8588623060: over 1048576 (the advisor read 1,063,707);
  - a0bff4801cb555cc1e30c8fa2d35c2107c5b06f2: under 1048576 (the advisor read 1,045,527).
  - Exit 0 each.
- **E1, the verify-quotes defect.**
  - Set H1 to the sha256 of line 1 of `governance/PLAN.yaml` at 9c7a187b7c2497617f96c0174043706f0a7aa95f, by the template's hash form (`git show <rev>:<path> | sed -n '1p' | sha256sum`).
  - The file `C:/dev/wt/mib-evidence/e1.md` holds one line: a backtick span with `governance/PLAN.yaml:1 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:` followed by H1. The custodian writes it with `printf` and a single-quoted format.
  - Run `node scripts/plan/verify-quotes.mjs C:/dev/wt/mib-evidence/e1.md`.
  - Expected: the summary line `verify:quotes FAIL — 0 not found, 0 baseline entry error(s), 1 hash-reference error(s), 0 hash-baseline entry error(s), 0 ruling-cite error(s):`, then one line `  FAIL — hash reference: <the scratch file relative to the root>:1 — unresolvable rev "9c7a187b7c2497617f96c0174043706f0a7aa95f" for "governance/PLAN.yaml" -- git show failed`, and exit 1.
  - The tool's header line and its list of baseline entries that matched nothing are printed on every explicit-file run. They are recorded, not predicted.
- **E2, the control.** As E1, with a0bff4801cb555cc1e30c8fa2d35c2107c5b06f2 and that rev's own line 1 hash, in `e2.md`.
  - Expected: the PASS line with 0 checked and 0 hash-reference errors (the template at `scripts/plan/verify-quotes.mjs:1199-1201 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:79c33b084be8e3dea83cd1b49302fa277e813ad1402191b80243fea57f8f4a0f`), and exit 0.
  - E1 and E2 together show that the size of the file is the cause, not the pin.
- **E3, the docs-only defect.** First `git diff --name-only 8faccf8958016e0d39095d8e53de1d8588623060 9c7a187b7c2497617f96c0174043706f0a7aa95f`. Then `node scripts/plan/docsOnly.mjs 8faccf8958016e0d39095d8e53de1d8588623060 9c7a187b7c2497617f96c0174043706f0a7aa95f`.
  - Expected: the NOT-eligible line with its count, the line `  - governance/PLAN.yaml: added or deleted — not a mechanical docs-only change`, one line for each other offending path that the custodian predicts from the name list before committing this form (none), and exit 1.
  - Any stderr from git is recorded, not predicted.
- **F1** (the verify-quotes test's fixture). A temporary repository whose committed `T.md` is two known lines, then padding lines, between 1 MiB and 2 MiB in all. A second file, untracked, pins `T.md:1-2` at the fixture's commit with the true hash.
- **F2** (the docs-only test's fixture). A temporary repository whose `governance/PLAN.yaml` is the existing eligible-edit test's one-node plan, then comment-only padding lines, between 1 MiB and 2 MiB.
  - It is committed twice, with only the node's title changed.
  - Comment-only lines are skipped by the subset parser: `scripts/plan/yamlSubset.mjs:76-77 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:43fb172a0e39f3a56759cd6d3330393431567f7a46aa5044162ac1ffb35466e5`.
- No large file is committed. Each fixture is built in `os.tmpdir()` and removed after its test.

### §4. Tests, and the mutation per new test
| Test (new) | File | Asserts, in order | Mutation | Expected first failing assertion |
|---|---|---|---|---|
| `a_hash_checked_reference_into_a_file_over_one_mebibyte_verifies` | `scripts/plan/verify-quotes.test.mjs` (end) | (1) `T.md` on disk is over 1024 × 1024 bytes; (2) `runVerifyQuotes({ repoRoot, files: [the pin file] }).hashFindings.length` is 0, its message the JSON of the findings | M1: `maxBuffer: 1 << 28` removed from `gitShowFile`'s options | (2): AssertionError whose message is the JSON of one finding, its reason beginning `unresolvable rev` and naming `T.md` |
| `a_plan_yaml_over_one_mebibyte_is_classed_by_its_content` | `scripts/plan/docsOnly.test.mjs` (end) | (1) the plan on disk is over 1024 × 1024 bytes; (2) `checkDocsOnly(dir, base, head)` deep-equals `[]` | M2: `maxBuffer: 1 << 28` removed from `gitShow`'s options | (2): AssertionError, strictly deep-equal, the actual array holding the one string `governance/PLAN.yaml: added or deleted — not a mechanical docs-only change` |

- The model tests:
  - for M1, `a_hash_checked_reference_with_an_explicit_rev_and_correct_hash_verifies` and its helpers `gitTree`, `headOf`, `sha256`, with `removeAfter` already imported (`scripts/plan/verify-quotes.test.mjs:15-39 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:87f5df2e3bf49225c474fbd43f5c05032038ff22aff9533ae43491e428235057`);
  - for M2, the existing eligible-edit test and the helpers `makeRepo` and `commitAll` (`scripts/plan/docsOnly.test.mjs:9-25 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:fe5450842dd99298634de9634cd5f6125ad56a87379730670dbcf0b6424e48a9`). Its cleanup is one inline `t.after` with `fs.rmSync`, so no import changes.
- Assertion (1) passes under each mutation, so the failure falls on (2).
- Each mutation is applied, the named test is run, its failure by name is recorded in the test's `RECORDED MUTATION:` comment with the commit it was observed at, and the mutation is reverted.
- A `verify-mutation` run is not an observation of a mutation (round 25, item 2 (c); `docs/PREREGISTRATION-TEMPLATE.md:172 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2`).
- The test names are snake case so that verify-test-claims can resolve this form's claims (`scripts/plan/verify-test-claims.mjs:105-110 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:2e57db72a3cf1f1cf9872346b8fc17ba04822a839568a5abba3730d8706da69a`; OPEN-2).
- The docs-only test's name departs from the style of its file, whose tests are named in prose; the verify-quotes test file already names tests both ways; no existing test is renamed (ADV-2026-11-15-11 item 2).

### §5. Predictions · declared unchanged · invalidators · falsification
- **Predicted:**
  - E0 to E3 as declared;
  - T1 and T2 pass at the head, and fail under M1 and M2 as declared;
  - at the head, E1 gives the PASS line with 0 hash-reference errors and exit 0;
  - at the head, E3 gives no PLAN.yaml line, and its remaining lines are exactly the other lines predicted for E3, with exit 0 when there are none;
  - `node scripts/plan/verify-quotes.mjs` over the repository exits 0 at the merge base and at the head, with the two PASS lines byte-identical (no hash baseline entry names an unresolvable rev or `PLAN.yaml`: Grep of `scripts/plan/verify-quotes.baseline.json`, 0 matches);
  - CI green.
- **Declared unchanged:** everything in 2.4; every line of both tools but the two of 2.1 and 2.2.
- **Invalidators** (the piece stops and the custodian tells the advisor):
  - I1: E1 or E3 does not show the defect at main;
  - I2: E2 fails;
  - I3: T1 or T2 passes with its mutation applied;
  - I4: the fix needs any other line, an import, an export or a comment in either tool;
  - I5: the repository-wide verify-quotes result differs between base and head;
  - I6: a piece touching any of the four paths enters flight or review;
  - I7: a Guardian refusal.
- **Falsification:** after the merge, a pin into a tracked file between 1 MiB and `1 << 28` bytes, at a rev on main, fails as an unresolvable rev. Or a diff changing a `governance/PLAN.yaml` of that size is reported as added or deleted.

### §6. Instruments
Assertions only. No measurement and no `docs/08` row.

### §7. Declared values and ceilings
- `maxBuffer: 1 << 28` (268,435,456 bytes) at its two sites. It bounds the bytes of `git show` output each read accepts. It is verify-cites' value (§0).
- Fixture size: over 1,048,576 and under 2,097,152 bytes each. Assertion (1) checks the lower bound; the upper bound keeps the fixture light.
- Budget: 60 minutes (the node). §10's rule applies at twice 60.
- Files: exactly 4, not counting this form: the two tools and their two test files.
- Lines, by `git diff --numstat $(git merge-base origin/main HEAD)..HEAD`:
  - each tool file 1 insertion and 1 deletion;
  - each test file 0 deletions;
  - at most 80 insertions plus deletions in all.
  - An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`).
  - The projection is about 61: 4 in the tools, about 17 for T1 and its comment, about 40 for T2 and its comment.

### §8. Block-on-sight
1. Either tool changes any line but the one of 2.1 or 2.2, or its one line differs from the declared shape (C1).
2. A path outside the four is in the diff (C2). This includes `tools/mods/**`, another `scripts/plan/` file, `scripts/plan/README.md`, a workflow and `governance/PLAN.yaml`.
3. A file in the diff is over 1 MiB at the head (C2).
4. An existing test's text changes, or a new test is not appended at its file's end (C3).
5. A new test asserts an output line of the docs-only tool's `main`, or runs either tool's command line.
6. A mutation observation is recorded without its commit, or a record calls a `verify-mutation` run an observation (round 25, item 2 (c)).
7. Before this piece merges, a record of it pins `governance/PLAN.yaml` at a rev where the file is over 1 MiB (ADV-2026-11-15-09 item 7).
8. A rooted `path:line` in a new comment, or a bare `:line` into a file the same commit edits (round 14).
9. Any code before this form and the advisor's answers to the OPEN items are on main.
10. Any CI step is red.

### §9. Gates
- **Architect and reviewer**, each to an affirmative PASS (OPEN-1). Reports go under `state/consults/gates/` (§25 (b)).
- **C1**, run in the worktree. Expected: exit 0 and `ONE-LINE-OK`.
    node -e "const x=require('child_process').execFileSync;const o={maxBuffer:1<<28};const b=x('git',['merge-base','origin/main','HEAD']).toString().trim();const F=[['scripts/plan/verify-quotes.mjs',657],['scripts/plan/docsOnly.mjs',73]];const NL=String.fromCharCode(10);let bad=0;for(const [p,n] of F){const ml=x('git',['show',b+':'+p],o).toString().split(NL),hl=x('git',['show','HEAD:'+p],o).toString().split(NL);const d=[];for(let i=0;i<Math.max(ml.length,hl.length);i++)if(ml[i]!==hl[i])d.push(i+1);const want=ml[n-1].endsWith(' });')?ml[n-1].slice(0,-4)+', maxBuffer: 1 << 28 });':null;if(ml.length===hl.length&&d.length===1&&d[0]===n&&hl[n-1]===want)continue;console.error('DIFFERS '+p+' '+d.join(','));bad=1}if(bad)process.exit(1);console.log('ONE-LINE-OK')"
- **C2.** Expected: exit 0 and `PATHS-OK`.
    node -e "const x=require('child_process').execFileSync;const b=x('git',['merge-base','origin/main','HEAD']).toString().trim();const L=x('git',['diff','--name-only',b,'HEAD']).toString().trim().split(String.fromCharCode(10)).sort();const want='scripts/plan/docsOnly.mjs,scripts/plan/docsOnly.test.mjs,scripts/plan/verify-quotes.mjs,scripts/plan/verify-quotes.test.mjs';const big=L.filter(p=>Number(x('git',['cat-file','-s','HEAD:'+p]).toString().trim())>1048576);if(L.join(',')!==want||big.length>0){console.error('PATHS '+L.join(',')+' BIG '+big.join(','));process.exit(1)}console.log('PATHS-OK')"
- **C3.** Expected: exit 0, then the numstat JSON, then `APPEND-OK`.
    node -e "const x=require('child_process').execFileSync;const o={maxBuffer:1<<28};const b=x('git',['merge-base','origin/main','HEAD']).toString().trim();let bad=0;for(const p of ['scripts/plan/verify-quotes.test.mjs','scripts/plan/docsOnly.test.mjs']){const m=x('git',['show',b+':'+p],o).toString(),h=x('git',['show','HEAD:'+p],o).toString();if(h.startsWith(m)===false||h.length===m.length){console.error('NOT-APPENDED '+p);bad=1}}const r={};for(const l of x('git',['diff','--numstat',b,'HEAD']).toString().trim().split(String.fromCharCode(10))){const c=l.split(String.fromCharCode(9));r[c[2]]=[Number(c[0]),Number(c[1])]}const t=Object.values(r).reduce((s,v)=>s+v[0]+v[1],0);console.log(JSON.stringify(r)+' total '+t);if(bad||t>80)process.exit(1);console.log('APPEND-OK')"
- **Tests:**
  - `node --test --test-name-pattern="a_hash_checked_reference_into_a_file_over_one_mebibyte_verifies" scripts/plan/verify-quotes.test.mjs`, exit 0;
  - `node --test --test-name-pattern="a_plan_yaml_over_one_mebibyte_is_classed_by_its_content" scripts/plan/docsOnly.test.mjs`, exit 0;
  - with M1 or M2 applied, exit 1 and the failure of §4.
- **Suites**, each expected to exit 0:
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (`.github/workflows/governance-ci.yml:149-150 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:5641b7338ffc2351280cbfc32dbe2a70f3fad8655e5ed0c36bfed4934f3d4b5c`);
  - `node scripts/plan/verify-cites.mjs`;
  - `node scripts/plan/verify-quotes.mjs`, at the merge base and at the head, with the PASS lines compared byte for byte;
  - `node scripts/plan/verify-test-claims.mjs`;
  - `node scripts/plan/verify.mjs --offline`;
  - `node scripts/plan/forms-layout.mjs`;
  - `node scripts/plan/verify-mutation.mjs`, a pre-gate check that a mutation is recorded, not an observation.
- **At the head:** E1, E2 and E3 re-run by the worker against the head's tools, on the custodian's scratch files.
- **Machine.** All of these are light node runs, as the merges form reads its own suites (`governance/forms/root/ADVISOR-SESSION-MERGES-UNDER-THE-HUMANS-RULE-PREREGISTRATION.md:252 @ 9c7a187b7c2497617f96c0174043706f0a7aa95f sha256:356172eb1390cf5369e3f6e3fc021e02bb5b8bddb5b9b0783c51730e3aa5aa27`). None needs a hold. Anything heavy goes inside `hold shared -Project SpatialIDE`.
- **Operator:** none.

### §10. Amendments — opens empty, append-only
