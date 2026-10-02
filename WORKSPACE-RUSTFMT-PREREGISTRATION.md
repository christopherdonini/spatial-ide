# One mechanical cargo fmt pass over the workspace and src-tauri, with a CI fmt check in the same PR (PLAN node `workspace-rustfmt`) — preregistration

**Authority:** question round 34, item 1 (RULED 2026-10-02, question round 34; a RED LINE item, typed). It is cited by round and item and is not reproduced. In paraphrase, labelled as such: both pieces are approved; the backstop went first; workspace-rustfmt follows with its CI fmt check in the same PR, only while no Rust branch is open; data-plane-crate-fmt closes as superseded. History: question round 26, item 4 (a CI fmt step goes to the weekly window), and question round 33, item 1, whose option label is not a red-line ruling under the round 33 block's correction line and was re-asked as round 34, item 1. The adopted shape is the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:11-37` @ 01b5ba0 sha256:1681985b555ced63591824410252a7863784204f2ca643586eabcdc209102015. It is not the human's words, and nothing below quotes it. Node: `PLAN.yaml:3416-3432` @ 01b5ba0 sha256:0d05a0e5d19196e3a2860192228eae6c63d17c93e0738f43c26f3b44a3ba6f3e.
**Drafted by** the architect agent on the custodian's brief, read at `main` 01b5ba0 (the consult: `state/consults/2026-10-02-workspace-rustfmt-architect-draft.md`). Shape model: `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at 01b5ba0 (the architect had no Bash); (2) the consult's path in the line above; (3) this line. Nothing else changed. The consult's open point 1 was measured before this commit (its filing note): the two pass commands on a scratch tree at e1e244a changed 133 `.rs` paths and nothing else, both `--check` commands then exited 0, and on that tree verify-cites exited 0 and verify-quotes passed, so I3 does not fire before any code. Open point 2 sets this path. Open points 3 to 8 are read as drafted. In the same commit PLAN's node takes this form as its gate and 120 minutes as its budget (open point 6).
**Gating:** full. The binding head is §21c's size bound (`AUTONOMY.md:347-357` @ 01b5ba0 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31): the pass changes far more than 150 lines over far more than 8 files, and formatter output is not in §21c's generated set. On the other §21a heads (`AUTONOMY.md:315-332` @ 01b5ba0 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3): the pass reformats files under `protocol/skp/**` and `protocol/data-plane/**`, so the wire head's path is touched. No message, literal or field may change, and the architect reads those hunks for that (§9). No security-posture or guarantee head is engaged. No five-line form is used.

## §0. Disclosure
- **The custodian's measurement at 01b5ba0**, rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14), both commands run from the repository root:
  - `cargo fmt --all -- --check --color never` exits 1, with 2,029 lines beginning `Diff in` over 126 distinct files;
  - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never` exits 1, with 105 such lines over 7 files.

  The draft's figures at 0ada14f are superseded by these. No count in any record carries rustfmt's printed paths, which are absolute on Windows. Records carry counts and repository-relative paths only.
- **What the two commands cover.** The root workspace's members are `engine`, `protocol/data-plane`, `protocol/skp`, `renderer` and `kernel`. `protocol/transport-bakeoff`, the ADR-003 spike's `src-tauri` and `frontends/shell/src-tauri` are excluded (`Cargo.toml:10-29` @ 01b5ba0 sha256:2350d58f8793a7030903f0311810d745478a2b831290fbb4afa3ad24cc09c540). No member has a path dependency outside the members, so `--all` reaches nothing else. `frontends/shell/src-tauri` is its own workspace (`frontends/shell/src-tauri/Cargo.toml:9` @ 01b5ba0 sha256:434e102c861f994d2aace9114d392dbc162190e00be8fe357d472150ca439614), and the second command, run without `--all`, formats only that package, not its path dependencies (`frontends/shell/src-tauri/Cargo.toml:70-76` @ 01b5ba0 sha256:717c70f68de3bcc493c2d7aae94ada37ca351a71496236cc04471e8b83a28185). The excluded standalone crates under `spikes/` and `protocol/transport-bakeoff` are out of scope. The tree has no `rustfmt.toml`, `.rustfmt.toml` or `rust-toolchain` file (a Glob at 01b5ba0), so rustfmt runs on its defaults. No crate in scope carries a `#[path]` attribute (a Grep at 01b5ba0).
- **Line endings.** Every text file is checked out LF on every platform (`.gitattributes:5` at 01b5ba0, sha256 d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c).
- **No Rust branch is open at 01b5ba0** (the custodian's statement). The two open pieces, test-claims-same-pr-superseded-pin and round-mirror-pretooluse-hook, touch only JavaScript, Markdown and settings. Node 7 (`skp-cancel-state-closed-set`) and `port-1-linux-l1` depend on this node. P1 (§2 item 1) re-checks this at dispatch and at merge.
- **Tests that read Rust source as text**, so a formatter pass can fail them:
  - `protocol/data-plane/tests/no_transport_leakage.rs:60` @ 01b5ba0 sha256:3be1415c8649a1990f936eed91872142e942711cc9b45448bba7f490d8d4feb5;
  - `engine/tests/lod_tier_builder.rs:800` @ 01b5ba0 sha256:1a9e4bce9d465175f0e6523f15bcc6fc2f2c3fcf23e968d41d2c91b319e7c8dd;
  - `frontends/shell/src-tauri/tests/sole_caller_scan.rs:72` @ 01b5ba0 sha256:4c1499cde3c1bc580363acc695ba9dc95f8c3a5a3f6294b00dbae9fc341320e9;
  - the shell's `check:origin-event`, which reads `src-tauri/src/lib.rs` (`frontends/shell/e2e/checkOriginEventName.mjs:38` @ 01b5ba0 sha256:a29284a7408caa04e222c92561f5b51d8b90d6190051996ba30b0245c62f4bcc).

  This is why the suites run (§9). "A formatter changes no behaviour" is not taken as given.
- **The verify tools and moved lines.**
  - verify-cites bounds-checks every rooted `path:line[-line]` token against the working tree. That includes a token followed by `@ <rev> sha256:`, because it reads no pin (`scripts/plan/verify-cites.mjs:233-248` @ 01b5ba0 sha256:b366489b0e2c6149a901184500726649c88bf0a7aa556146609282937a8d4537; the scan loop, `scripts/plan/verify-cites.mjs:286-314` @ 01b5ba0 sha256:cf1d2e1aff094991a3831a9bc8df7d9fe821c972b3ead0fdf24f54e9de7e5251). It does not check what a cited line says (`scripts/plan/verify-cites.mjs:51-54` @ 01b5ba0 sha256:8b6e41d85c5894b7cc4c43a99e27b9c49fb013ca7ebd343f11d491d5db6197cb).
  - So a pass that shortens a `.rs` file below any cited line, pinned or not, turns verify-cites red. A pass that only moves text leaves it green.
  - verify-quotes recomputes a hash reference at its named rev, so a pin's hash is unaffected. A hash reference with no `@ <rev>` is read at HEAD, and a passage introduced by a `path:line` cite is searched in that file alone (`scripts/plan/verify-quotes.mjs:34-41` @ 01b5ba0 sha256:3f2a0288eb7b2dc58a07122968cfcd81c9a14c1ae0b1a0dd1bc955b6c2eb57cf; `scripts/plan/verify-quotes.mjs:72-75` @ 01b5ba0 sha256:ba9726a4cfc76ce12a35a1b07a5cdbdef4d239fd7f57d965979ca660343609d3). A reflowed code passage can stop matching.
  - verify-mutation counts as new any test whose declaration line falls in an added range (`scripts/plan/verify-mutation.mjs:13-22` @ 01b5ba0 sha256:eb2cd726ded5c88f464975d6f8b5aa8c6dfc695a9ba2c262f53c8f46f0314816). Every test declaration the pass reformats therefore reads as new to it.
  - Governance CI does not trigger on this PR: its paths name no `.rs` file and neither CI file (`.github/workflows/governance-ci.yml:68-97` at 01b5ba0, sha256 9ac5f064e52210bb566b6374d7fbc4d459614ba7d429a390502423d673541326). The verify tools run locally (§9).
- **The cite cost, restated.** The custodian's rough count at 0ada14f (`state/drafts/weekly-window-2026-10-02.md:37` @ 01b5ba0 sha256:517002912c8a83744f901101ffde57b0443349e1b20574f36e0f75794171361d) is replaced by §6 item 4's method, measured by the worker at the base and recomputed by the reviewer.
- **The exposure-scan backstop.** This PR is the first large range `.github/workflows/exposure-scan.yml` scans. Every line the pass reformats is an added line of the three-dot diff and is read again. The backstop's drafting consult predicts no interaction (`state/consults/2026-10-02-exposure-scan-ci-backstop-architect-draft.md:33` @ 01b5ba0 sha256:588df7ea96ca219dc7e08e1e1ce023d4a4672a92a540fbdf227c88a12b4981d5). A finding is I7.
- **H1 (hypothesis): rustfmt's output on ubuntu-latest equals its output on the Windows reference profile for this tree.** Discriminator: E1. Red is I6.
- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. C1's tree is exactly what the two commands produce on C1's parent, and C1 changes only `.rs` paths (the reviewer's reproduction, §9).
  2. At C1, both `--check` commands exit 0.
  3. `.github/workflows/rust-fmt.yml` runs both `--check` commands on every `pull_request` and `push` that changes a path in its filter, and fails when either scope has a formatting diff (E1, E2, E3).
  4. `.git-blame-ignore-revs` names C1's full id.
- **May not claim:**
  - formatting of the excluded crates, or of any `.rs` file outside a crate's module tree (neither formatted nor checked);
  - that the check is required for merge (the human's setting);
  - that a later stable rustfmt formats this tree the same way (the check reports drift, it does not prevent it);
  - that an unpinned `path:line` cite into a reformatted file still points at the text it meant (the disclosed cost, §6 item 4);
  - that no behaviour changed: the green suites are evidence that nothing surfaced, not proof that nothing changed;
  - anything about GitHub's blame view beyond the file being present;
  - clippy;
  - any L1, L2 or L3 level (R5);
  - any `docs/08` figure.
- **Unchanged:**
  - every existing workflow, including `.github/workflows/product-ci-rust.yml`'s `paths`;
  - every Cargo manifest and lockfile;
  - no formatter or toolchain config file is added;
  - no governing doc, no record, and no cite is rewritten;
  - no `.rs` byte beyond C1's formatter output.

  ADR-006 does not apply: this is repository tooling, not a product operation. No ADR is amended.
- **Seams:**
  - The workflow into the `cargo fmt` CLI crosses a process boundary only. It is proven from the real shape by E1 (green) and E2 (red).
  - No `pub` item, callback or option lands.

## §2. The change
1. **P1, the no-Rust-branch check,** run by the custodian at dispatch and again before the merge, with the result recorded each time:
   - (a) `gh pr list --state open`, then `gh pr diff <n> --name-only` for each open PR. Any path ending `.rs` holds the piece.
   - (b) `git fetch --prune origin`. Then, for each ref in `git branch -r` other than `origin/HEAD` and `origin/main`: if `git rev-list --count origin/main..<ref>` is above 0 and `git diff --name-only origin/main...<ref> -- '*.rs'` is not empty, the ref is listed. Each listed ref is either a report branch kept as record, named in the P1 record (for example the `cloud/wave*` branches), or open work, which holds the piece.
   - (c) `git worktree list`. A worktree with Rust work in progress holds the piece.
   - No Rust-touching node is dispatched between this piece's dispatch and its merge.
   - **If a Rust branch opens before the merge,** the piece stops at its current commit and the custodian asks the human which goes first, since round 34 item 1's condition no longer holds.
     - If the other piece merges first, this PR is closed unmerged. The piece is redone on a new branch from a fresh base, with a new C1 and a new blame id.
     - No rebase and no force-push, ever.
2. **P2, the base.** The base is `main` at dispatch, after this form's commit. `git diff --quiet 01b5ba0 <base> -- '*.rs' '*Cargo.toml'` exits 0, or the §0 counts are re-measured at the base and recorded before C1.
3. **C1, the pass commit** (one parent, the base; signed off), on branch `cut/workspace-rustfmt`:
   - from the repository root, `cargo fmt --all` then `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml`;
   - `git status --porcelain` lists only modified `.rs` paths, and nothing else is staged;
   - the message names the two commands, the rustfmt version and this form, and nothing else.
4. **C2, the CI commit** (signed off), touching exactly two new files:
   - `.github/workflows/rust-fmt.yml` (item 5);
   - `.git-blame-ignore-revs`: one comment line naming this form and the node, and C1's full 40-hex id. It is not configured locally by this piece.
5. **`.github/workflows/rust-fmt.yml`:**
   - **Name:** `Rust fmt`. Job name: `cargo fmt --check (workspace and src-tauri)`.
   - **Triggers:** `push` and `pull_request`, each with the same `paths`: `**/*.rs`, `**/Cargo.toml`, `**/rustfmt.toml`, `**/.rustfmt.toml`, `**/rust-toolchain`, `**/rust-toolchain.toml`, `.github/workflows/rust-fmt.yml`. Plus `workflow_dispatch`. No `branches` filter on `push`, as in the product workflows.
   - **Concurrency:** product-ci-rust's shape (cancel in progress except on `main`).
   - **Permissions:** top-level `contents: read`. No `secrets.` reference.
   - **The job:** `runs-on: ubuntu-latest`, `timeout-minutes: 10`. Steps:
     - `actions/checkout@v4` with `persist-credentials: false` (as `.github/workflows/exposure-scan.yml:51-54` at 01b5ba0, sha256 1c8a00eed761d7de4b3960191efbf2869a08eb2cf709f6e4d776fe1c61c9e986);
     - `dtolnay/rust-toolchain@stable` with `components: rustfmt`. This is the existing workflows' action (`.github/workflows/product-ci-rust.yml:197` at 01b5ba0, sha256 9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641; `.github/workflows/product-ci-shell.yml:175` at 01b5ba0, sha256 9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641) plus one input. **The one install it implies:** the stable toolchain's rustfmt component, through rustup, on the runner only. No product dependency and no lockfile change. The runner image's preinstalled components are not relied on;
     - `cargo fmt --version` (the instrument, round 15 (c));
     - `cargo fmt --all -- --check --color never`;
     - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never`, with `if: ${{ !cancelled() }}` so that both scopes report on every run.
   - No cache action, no `continue-on-error`, no `|| true`, no `${{ }}` inside `run:`.
   - **Header comment:** what a green run means, narrowly (§1 may-claim 3); what it does not mean (§1's may-not-claim, by reference to this form); why `ubuntu-latest` (H1); why the heavy suite's filter is not widened. It quotes nothing.
6. **Merge:** a merge commit only, so that C1's id stays reachable and the blame file resolves.
7. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65` @ 01b5ba0 sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b):
   - **R1:** one formatter and one check on every platform.
   - **R2:** no OS-conditional code is added. Existing `cfg` lines may be re-laid-out and are proven to be formatter output by the reproduction.
   - **R3:** Linux (ubuntu-latest) runs the check in CI. Windows runs both commands locally. macOS: no run and no claim.
   - **R4:** no platform exclusion.
   - **R5:** a green check claims nothing at L1.
   - **R6:** no test is ignored.

## §3. Fixtures and predicted outcomes
| # | Input | Predicted |
|---|---|---|
| F1 | the base, with P2 holding | both `--check` commands exit 1 with §0's counts (2,029 over 126; 105 over 7) |
| F2 | the base after the two commands | `git status --porcelain` lists exactly 133 modified `.rs` paths and nothing else |
| F3 | C1 | both `--check` commands exit 0 (idempotence) |
| F4 | the reviewer's scratch reproduction | its `git write-tree` equals `git rev-parse <C1>^{tree}` |
| F5 | C1 and the head | verify-cites, verify-quotes, verify-test-claims and verify:plan PASS. §6 item 4's D is 0 |
| F6 | C1 and the head, CI | product-ci-rust and product-ci-shell (tauri-build included) green |

## §4. Tests and end-to-end runs
- **No test is added or changed, so there is no mutation.** No record calls a `verify-mutation` run an observation. verify-mutation's report over this range is a checklist: every test it lists as new is a declaration line that C1 re-laid-out, and F4 proves it so.
- **End-to-end runs from the real shape** (the seam rule). The worker records E1 and E2 by run id. The custodian records E3.
  - **E1:** this PR's own `Rust fmt` `pull_request` run, green at the head marked ready. Its version step shows rustfmt's version.
  - **E2:**
    - A probe branch `probe/rust-fmt-red`, cut from C2. It carries one commit, pushed once as a plain creation push. The commit puts one rustfmt-visible whitespace defect in one line of one workspace file in a module tree, and one in one `frontends/shell/src-tauri/src` file.
    - Predicted: the `push` run is red, with both check steps failed, each naming only its own probe file.
    - The probe is never merged and the piece's branch never carries it. No force-push. It is deleted after the run id is recorded (§10 if not).
  - **E3:** the first push to `main` after the merge. Its `Rust fmt` run is predicted green. A red E3 stops all Rust dispatch until it is answered.
  - **The backstop:** this PR's `no profile path in the range` run is predicted green.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** F1 to F6; E1 to E3 and the backstop run as §4 predicts.
- **Declared unchanged:** §1's Unchanged list.
- **Invalidators (each a stop):**
  - **I1:** the two commands change any path that is not `.rs`, or either exits with an error rather than a formatted result.
  - **I2:** P1 finds a Rust branch, or one opens before the merge (§2 item 1).
  - **I3:** at C1, verify-cites or verify-quotes fails (D above 0, a moved code passage, or a HEAD-default hash). This goes to the human: the adopted shape rewrites no cite, and main would be red.
  - **I4:** a suite is red at C1. The exception: a failure in a test already named by `timing-assertions-under-contention` or `timing-tests-assert-property-not-budget`, re-run once with both run ids recorded.
  - **I5:** F3 fails (rustfmt is not idempotent on this tree).
  - **I6:** E1 is red on the C1 tree (H1 false, or the floating stable has drifted from 1.9.0). This goes to the custodian.
  - **I7:** the backstop run is red. It goes to the human if a real profile is involved.
  - **I8:** C2's file count or line count goes past §7.
- **Falsification:**
  - C1's tree differs from the formatter's output on its parent;
  - either `--check` fails on `main` at the merge commit;
  - E2 is green.

## §6. Instruments
Assertions only:
1. `git write-tree` equality (F4); `git rev-list --parents -n 1 <C1>`; `git diff --name-only <base> <C1>`, every path ending `.rs`.
2. Exit status and the count of lines beginning `Diff in`, per command (F1, F3).
3. `git diff --numstat <base> <C1>`, recorded (not budgeted), and §7's counting command.
4. **The cite cost**, measured at the base and C1 over verify-cites' default file set (`scripts/plan/verify-cites.mjs:263-272` @ 01b5ba0 sha256:ceb841b8480ed0e0d626480555a7fe4d4ed8d18c4163cac6a8a540192819984a). Let F be C1's changed paths. Record:
   - A, the rooted tokens into F;
   - B, the A tokens followed on the same line by `@ <rev> sha256:`;
   - C, the A tokens not in B whose cited lines' text at C1 differs from the same lines at the base;
   - D, the tokens in A whose highest line exceeds the file's length at C1 (must be 0).

   Words-form spans (lines a-b of a path at a commit) carry no token and are not counted. The script's source is filed with the worker's report.
5. `cargo fmt --version`, `rustc --version`, `git --version` and `node --version` locally, and the version step in CI (round 15 (c)).
6. verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit.

## §7. Declared values and ceilings
- **The pass commands:** `cargo fmt --all`; `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml`. Both run from the repository root.
- **The check commands:** the same two, each with `-- --check --color never`.
- **Workflow values:** the file name, workflow name, job name, triggers, paths, concurrency shape, permissions, `ubuntu-latest`, `timeout-minutes: 10`, `actions/checkout@v4` and `dtolnay/rust-toolchain@stable` with `components: rustfmt` only, as §2 item 5 declares them.
- **The pass:** exactly 133 `.rs` files at a base where P2 holds. C1's numstat is recorded, not budgeted.
- **Size budget, C1 excluded:** at most 120 changed lines, insertions plus deletions, over at most 2 files (`.github/workflows/rust-fmt.yml` and `.git-blame-ignore-revs`).
  - Counting command: `git diff --numstat <C1> <head> -- . ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 75 workflow lines and 3 blame-file lines.
- **Minutes:** 120 (the custodian's check under AUTONOMY.md §10).

## §8. Block-on-sight
1. C1 has more than one parent, changes a path that is not `.rs`, or its tree differs from the reproduction.
2. Any `.rs` change in any commit after C1.
3. Any commit after C1 touching a path other than §7's two files.
4. The workflow carries any of the following:
   - a trigger, path or `if` beyond §2 item 5;
   - permissions beyond `contents: read`, or a `secrets.` reference;
   - an action beyond the two named, or an install beyond the rustfmt component;
   - a cache step;
   - `continue-on-error` or `|| true`;
   - `${{ }}` inside `run:`;
   - a check command other than §7's.
5. Any other workflow edited, including product-ci-rust's `paths`.
6. A formatter or toolchain config file added, or a Cargo manifest or lockfile changed.
7. Any cite rewritten or any record edited.
8. A blame id that is not C1's full 40-hex id.
9. Dispatch or merge without a recorded P1 result.
10. A squash or rebase merge; any force-push; the probe commit at the gated head.
11. Any user-profile path in the diff, in a commit message or in a record, including pasted rustfmt output.
12. A record calling a `verify-mutation` run an observation.
13. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class 9 amendment.
14. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - reproduced text without its script mark and hash;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.

## §9. Gates
- **Architect:**
  - the Gating line, including the `protocol/skp/**` and `protocol/data-plane/**` hunks read for any literal or field change;
  - round 34, item 1 against §2 (the check in the same PR, P1, the supersession);
  - round 25, item 2 (`docs/PREREGISTRATION-TEMPLATE.md:165-176` @ 01b5ba0 sha256:45769ff5726170a1404349dc7d163a9c0c3a363b5fc628b2b0523925207f8238; `AUTONOMY.md:476-482` @ 01b5ba0 sha256:3680d17dc772d9248e75778adaf853f28acde5a77fde2ff98ffa23728b77e774);
  - the seam reading and the caller rule (§1);
  - the round 7 ruling on operator-visible text (step names state facts);
  - R1 to R6;
  - §6 item 4's four numbers;
  - §8, item by item.
- **Reviewer:**
  - **The reproduction:**
    - in a scratch worktree of C1's parent, outside `.claude/worktrees/`, run §7's two pass commands;
    - `git add -A`, then `git write-tree`, compared with `<C1>^{tree}`;
    - F3, and §6 item 1.
  - The full diff of C2. §7 recounted. §6 item 4 recomputed.
  - E1 and E2 read by run id.
  - The product CI runs and the backstop run read by run id at the gated head.
- **Suites, green before either gate:**
  - On the PR in CI: product-ci-rust (`cargo test --workspace --locked` on windows-latest), product-ci-shell (`npm run verify`, the src-tauri `cargo test`, the two release checks, tauri-build), `Rust fmt`, exposure-scan and DCO. These are the Rust suites of record.
  - A local `cargo test` by the reviewer is not required. If one is run, it uses a target directory of its own and a 60-minute timeout.
  - Locally on the PR head, because governance CI does not trigger (§0): `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` and §6 item 6's tools, each with its commit.
  - Branch CI read before gating.
- **Operator:** none.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)

### Amendment 1 — invalidator I4 and its resolution, and the records gate 1 asked for (classes 1 and 2)

Written after gate 1's results were seen (a post-result amendment). References only.

1. **Class 2, F6 and I4.** Product CI — shell was red at c6d1414 (run 37006671393, pull_request), against F6's prediction, and I4 fired. The failing reader is `frontends/shell/src/publish/PublishPanel.test.ts:222` @ a0f0da7 sha256:5085eb8f7e98fb63694f53793288104094ddb34fe6074b0d1478c051abe6c2e3 (this branch's merge base with main; the file is unchanged by this piece); C1 moved the literal it reads. F6 is not edited.
2. **The resolution.** The architect's ruling `state/consults/gates/2026-10-02-workspace-rustfmt-i4-architect-ruling.md` routed the fix out of this piece: PLAN node `publish-panel-rs-regex-layout`, PR #158, merged as merge commit e4e864e, placed by question round 35. C1 and C2 are unchanged, and C3 touches `.github/workflows/rust-fmt.yml` only.
3. **§0's list of text readers** also omits `PublishPanel.test.ts` (both tests) and `surfaceCompleteness.test.ts`: the gate-1 reviewer's S2-1 and the I4 ruling's list of text readers. §0 is not edited.
4. **The rustfmt versions.** CI ran rustfmt 1.10.0 and the local runs 1.9.0: the gate-1 reviewer's S2-3. E1 is green, so I6 does not fire. H1 is recorded as tested across those two versions and claims nothing more.
5. **Generation.** The node's generation bumps (`AUTONOMY.md` §15).
6. **Superseded index.** None. No line of this form is made false; the header lines C3 rewrites are not records.
