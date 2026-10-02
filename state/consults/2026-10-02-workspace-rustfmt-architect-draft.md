# Consult — the architect's draft for workspace-rustfmt (2026-10-02)

*Custodian's filing note: one hand-back from the architect agent on the custodian's brief (a drafting consult, not a gate), read at main 01b5ba0. It is recorded verbatim below with the harness's report indentation removed. The draft is committed as `WORKSPACE-RUSTFMT-PREREGISTRATION.md` (open point 2's path), and that form's header lists the custodian's edits.*

*Open point 1, measured by the custodian before commit. In a scratch detached worktree at e1e244a (outside `.claude/worktrees/`; no `.rs` or Cargo manifest changed between 01b5ba0 and e1e244a), the two pass commands each exited 0. `git status --porcelain` listed 133 paths, every one ending `.rs`, with 11,828 insertions and 3,428 deletions. Both `--check` commands then exited 0 (idempotence). On that formatted tree, verify-cites exited 0 and verify-quotes PASSed with 0 hash-reference errors. So I3 does not fire before any code. The scratch worktree is discarded.*

*On (b) 1: the custodian's brief invited a quote of the typed ruling with a path and line. The draft rightly refused it under round 12 (a) and (a′).*

---

**Drafting consult, no verdict** · main @ 01b5ba0 (read from the working tree. PLAN.yaml changed while I was reading it: test-claims-same-pr-superseded-pin went from `ready` to `in-progress` on the same line. Re-derive every line number at 01b5ba0 before you hash it.)

```markdown
# One mechanical cargo fmt pass over the workspace and src-tauri, with a CI fmt check in the same PR (PLAN node `workspace-rustfmt`) — preregistration

**Authority:** question round 34, item 1 (RULED 2026-10-02, question round 34; a RED LINE item, typed). It is cited by round and item and is not reproduced. In paraphrase, labelled as such: both pieces are approved; the backstop went first; workspace-rustfmt follows with its CI fmt check in the same PR, only while no Rust branch is open; data-plane-crate-fmt closes as superseded. History: question round 26, item 4 (a CI fmt step goes to the weekly window), and question round 33, item 1, whose option label is not a red-line ruling under the round 33 block's correction line and was re-asked as round 34, item 1. The adopted shape is the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:11-37` @ 01b5ba0 sha256:<custodian>. It is not the human's words, and nothing below quotes it. Node: `PLAN.yaml:3416-3432` @ 01b5ba0 sha256:<custodian>.
**Drafted by** the architect agent on the custodian's brief, read at `main` 01b5ba0 (the consult: <custodian>). Shape model: `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** <custodian>.
**Gating:** full. The binding head is §21c's size bound (`AUTONOMY.md:347-357` @ 01b5ba0 sha256:<custodian>): the pass changes far more than 150 lines over far more than 8 files, and formatter output is not in §21c's generated set. On the other §21a heads (`AUTONOMY.md:315-332` @ 01b5ba0 sha256:<custodian>): the pass reformats files under `protocol/skp/**` and `protocol/data-plane/**`, so the wire head's path is touched. No message, literal or field may change, and the architect reads those hunks for that (§9). No security-posture or guarantee head is engaged. No five-line form is used.

## §0. Disclosure
- **The custodian's measurement at 01b5ba0**, rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14), both commands run from the repository root:
  - `cargo fmt --all -- --check --color never` exits 1, with 2,029 lines beginning `Diff in` over 126 distinct files;
  - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never` exits 1, with 105 such lines over 7 files.

  The draft's figures at 0ada14f are superseded by these. No count in any record carries rustfmt's printed paths, which are absolute on Windows. Records carry counts and repository-relative paths only.
- **What the two commands cover.** The root workspace's members are `engine`, `protocol/data-plane`, `protocol/skp`, `renderer` and `kernel`. `protocol/transport-bakeoff`, the ADR-003 spike's `src-tauri` and `frontends/shell/src-tauri` are excluded (`Cargo.toml:10-29` @ 01b5ba0 sha256:<custodian>). No member has a path dependency outside the members, so `--all` reaches nothing else. `frontends/shell/src-tauri` is its own workspace (`frontends/shell/src-tauri/Cargo.toml:9` @ 01b5ba0 sha256:<custodian>), and the second command, run without `--all`, formats only that package, not its path dependencies (`frontends/shell/src-tauri/Cargo.toml:70-76` @ 01b5ba0 sha256:<custodian>). The excluded standalone crates under `spikes/` and `protocol/transport-bakeoff` are out of scope. The tree has no `rustfmt.toml`, `.rustfmt.toml` or `rust-toolchain` file (a Glob at 01b5ba0), so rustfmt runs on its defaults. No crate in scope carries a `#[path]` attribute (a Grep at 01b5ba0).
- **Line endings.** Every text file is checked out LF on every platform (`.gitattributes:5` at 01b5ba0, sha256 <custodian>).
- **No Rust branch is open at 01b5ba0** (the custodian's statement). The two open pieces, test-claims-same-pr-superseded-pin and round-mirror-pretooluse-hook, touch only JavaScript, Markdown and settings. Node 7 (`skp-cancel-state-closed-set`) and `port-1-linux-l1` depend on this node. P1 (§2 item 1) re-checks this at dispatch and at merge.
- **Tests that read Rust source as text**, so a formatter pass can fail them:
  - `protocol/data-plane/tests/no_transport_leakage.rs:60` @ 01b5ba0 sha256:<custodian>;
  - `engine/tests/lod_tier_builder.rs:800` @ 01b5ba0 sha256:<custodian>;
  - `frontends/shell/src-tauri/tests/sole_caller_scan.rs:72` @ 01b5ba0 sha256:<custodian>;
  - the shell's `check:origin-event`, which reads `src-tauri/src/lib.rs` (`frontends/shell/e2e/checkOriginEventName.mjs:38` @ 01b5ba0 sha256:<custodian>).

  This is why the suites run (§9). "A formatter changes no behaviour" is not taken as given.
- **The verify tools and moved lines.**
  - verify-cites bounds-checks every rooted `path:line[-line]` token against the working tree. That includes a token followed by `@ <rev> sha256:`, because it reads no pin (`scripts/plan/verify-cites.mjs:233-248` @ 01b5ba0 sha256:<custodian>; the scan loop, `scripts/plan/verify-cites.mjs:286-314` @ 01b5ba0 sha256:<custodian>). It does not check what a cited line says (`scripts/plan/verify-cites.mjs:51-54` @ 01b5ba0 sha256:<custodian>).
  - So a pass that shortens a `.rs` file below any cited line, pinned or not, turns verify-cites red. A pass that only moves text leaves it green.
  - verify-quotes recomputes a hash reference at its named rev, so a pin's hash is unaffected. A hash reference with no `@ <rev>` is read at HEAD, and a passage introduced by a `path:line` cite is searched in that file alone (`scripts/plan/verify-quotes.mjs:34-41` @ 01b5ba0 sha256:<custodian>; `scripts/plan/verify-quotes.mjs:72-75` @ 01b5ba0 sha256:<custodian>). A reflowed code passage can stop matching.
  - verify-mutation counts as new any test whose declaration line falls in an added range (`scripts/plan/verify-mutation.mjs:13-22` @ 01b5ba0 sha256:<custodian>). Every test declaration the pass reformats therefore reads as new to it.
  - Governance CI does not trigger on this PR: its paths name no `.rs` file and neither CI file (`.github/workflows/governance-ci.yml:68-97` at 01b5ba0, sha256 <custodian>). The verify tools run locally (§9).
- **The cite cost, restated.** The custodian's rough count at 0ada14f (`state/drafts/weekly-window-2026-10-02.md:37` @ 01b5ba0 sha256:<custodian>) is replaced by §6 item 4's method, measured by the worker at the base and recomputed by the reviewer.
- **The exposure-scan backstop.** This PR is the first large range `.github/workflows/exposure-scan.yml` scans. Every line the pass reformats is an added line of the three-dot diff and is read again. The backstop's drafting consult predicts no interaction (`state/consults/2026-10-02-exposure-scan-ci-backstop-architect-draft.md:33` @ 01b5ba0 sha256:<custodian>). A finding is I7.
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
     - `actions/checkout@v4` with `persist-credentials: false` (as `.github/workflows/exposure-scan.yml:51-54` at 01b5ba0, sha256 <custodian>);
     - `dtolnay/rust-toolchain@stable` with `components: rustfmt`. This is the existing workflows' action (`.github/workflows/product-ci-rust.yml:197` at 01b5ba0, sha256 <custodian>; `.github/workflows/product-ci-shell.yml:175` at 01b5ba0, sha256 <custodian>) plus one input. **The one install it implies:** the stable toolchain's rustfmt component, through rustup, on the runner only. No product dependency and no lockfile change. The runner image's preinstalled components are not relied on;
     - `cargo fmt --version` (the instrument, round 15 (c));
     - `cargo fmt --all -- --check --color never`;
     - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check --color never`, with `if: ${{ !cancelled() }}` so that both scopes report on every run.
   - No cache action, no `continue-on-error`, no `|| true`, no `${{ }}` inside `run:`.
   - **Header comment:** what a green run means, narrowly (§1 may-claim 3); what it does not mean (§1's may-not-claim, by reference to this form); why `ubuntu-latest` (H1); why the heavy suite's filter is not widened. It quotes nothing.
6. **Merge:** a merge commit only, so that C1's id stays reachable and the blame file resolves.
7. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65` @ 01b5ba0 sha256:<custodian>):
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
4. **The cite cost**, measured at the base and C1 over verify-cites' default file set (`scripts/plan/verify-cites.mjs:263-272` @ 01b5ba0 sha256:<custodian>). Let F be C1's changed paths. Record:
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
  - round 25, item 2 (`docs/PREREGISTRATION-TEMPLATE.md:165-176` @ 01b5ba0 sha256:<custodian>; `AUTONOMY.md:476-482` @ 01b5ba0 sha256:<custodian>);
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
```

**(a) Open points, each with my recommended reading**
1. **Measure verify-cites and verify-quotes on a formatted tree before committing the form. This is the most important point.** Run the two pass commands in a scratch checkout at 01b5ba0, then run verify-cites and verify-quotes there.
   - If D = 0 and both pass, note it in the Custodian's-edits line and dispatch.
   - If either fails, I3 fires before any code. The adopted shape ("rewrites no cite", "no check reddens") cannot hold, and it goes to the human.
2. **Form path.** I recommend `WORKSPACE-RUSTFMT-PREREGISTRATION.md` at the root (the node id, which is the house naming) rather than `RUSTFMT-PASS-…`.
   - The root already has a precedent: `KNOWN-LIMITATIONS-OWED-ROWS-PREREGISTRATION.md`.
   - Both governance-ci's `**/*PREREGISTRATION*.md` filter and verify-test-claims' file pattern (`scripts/plan/verify-test-claims.mjs:675`) pick up either name.
   - In the same commit, set PLAN's `gate` to the form, as the backstop did.
3. **Runner.** I recommend `ubuntu-latest`: it is the cheapest, and the formatter is platform-neutral on an LF tree. H1 and E1 are the check on that. `windows-latest` would match the reference profile at higher cost.
4. **Toolchain.** I recommend floating `@stable` and printing the version each run, which is the house style. Pinning would force bump pieces. Drift surfaces as I6 or a red E3.
5. **Probe deletion after E2.** A ref deletion is not a force-push or a history rewrite, and the backstop's probe was deleted. If you read deletion as inside the red line, keep the branch and record that.
6. **Minutes.** 120 against PLAN's 90. Set PLAN to match in the form's commit.
7. **Local cargo test.** Not required, because CI runs the identical commands on the reference profile.
8. **Second check step `if: ${{ !cancelled() }}`.** It lets one E2 push prove both scopes. The alternative is two probe pushes.

**(b) Contradictions in the record**
1. **The brief vs round 12 (a) and (a′).** The brief says the typed ruling "may be quoted … with its path and line". Round 12 (a) and (a′) forbid any line cite into `DECISIONS-PENDING.md` and any path:line + hash pin of a ledger passage. The form therefore cites round 34, item 1 by round and item, reproduces nothing, and labels its one paraphrase.
2. **Draft A's disclosed cost** (`state/drafts/weekly-window-2026-10-02.md:37`) says "no check reddens" and that hash pins are "unaffected". Both are only conditionally true:
   - verify-cites bounds-checks every rooted token, pinned or not, against the current tree (`scripts/plan/verify-cites.mjs:233-248`, `:286-314`; it has no baseline). A shortened `.rs` file turns it red.
   - verify-quotes reads a hash reference with no rev at HEAD (`scripts/plan/verify-quotes.mjs:75`), and it gates a passage introduced by a path cite against that file alone (`:34-41`). A reflowed code passage can stop matching.

   The form turns "verify-cites stays green" into prediction F5 plus invalidator I3, and open point 1 measures it.
3. **Draft A item 5** compares `git write-tree` with "the head's tree". With C2 on top that comparison fails by construction; it must be C1's tree, as the brief already says.
4. **Draft A item 1** names `cut/kernel-generation-close-races` as the open Rust branch, which is stale. The remote refs at this checkout include many `cut/*` and `cloud/*` branches, so P1 must classify them by unmerged `.rs` diff, not by listing them.
5. **Draft A item 6** ("gates' cargo fmt --check on the changed files becomes the whole-workspace check") has no governing text to change. No agent checklist or governing doc carries that rule. It lives only in individual forms (for example `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:340`). Read it as: later forms name the CI check, and this piece edits nothing.
6. **Governance CI does not run on this PR or on its merge push**, because `.rs` and the two CI files are outside its paths. A verify-tool break would surface only at the next governance-path push, which is the done commit. Hence the local runs in §9.

**(c) Routed items**
1. **`data-plane-crate-fmt`:** `scripts/plan/plan.mjs:13` has no `superseded` status. The node stays `unscheduled` with its summary unless the custodian chooses otherwise. That is the custodian's call, not this piece's.
2. **`kernel-close-races-followups`** ("stale line cites into skp.rs"): the pass moves `kernel/src/skp.rs` lines again. Its cite fixes belong after this merge, so a note on that node is enough.
3. **Making `Rust fmt` a required check** is the human's call, and so are any branch-protection consequences of the workflow's paths filter. Not this piece.
4. **The node key `merge: merge-commit`** (round 34, item 5): once test-claims-same-pr-superseded-pin lands it, set it on this node too, since C1's id must survive the merge.
5. **Clippy in CI** is out of scope. It is a possible weekly-window proposal.
6. **The dot-path hash grammar** is already routed (`governance-hash-grammar-shared`). This form uses the plain-text form for `.github/` and `.gitattributes` spans.
7. **Files outside the module trees:** if §6 item 4's run finds tracked `.rs` files under the member directories that no module tree reaches, list them for a later note. They are neither formatted nor checked.

Files read: `C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-02.md`, `C:\dev\spatial-ide\DECISIONS-PENDING.md` (round 34 and round 33 blocks), `C:\dev\spatial-ide\PLAN.yaml`, `C:\dev\spatial-ide\.github\workflows\{product-ci-rust,product-ci-shell,governance-ci,exposure-scan}.yml`, `C:\dev\spatial-ide\Cargo.toml`, `C:\dev\spatial-ide\frontends\shell\src-tauri\Cargo.toml`, `C:\dev\spatial-ide\.gitattributes`, `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`, `C:\dev\spatial-ide\AUTONOMY.md` (§21, §25, §26), `C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md`, `C:\dev\spatial-ide\scripts\hooks\EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`, `C:\dev\spatial-ide\state\consults\2026-10-02-exposure-scan-ci-backstop-architect-draft.md`, `C:\dev\spatial-ide\scripts\plan\{verify-cites,verify-quotes,verify-mutation,verify-test-claims}.mjs`.
