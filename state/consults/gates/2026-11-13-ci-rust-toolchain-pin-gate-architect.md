Reviewed: PR #315 at 4541c8208a70f38280355f97e7e5893ee0f7c862 (base 3857425b) (the custodian's filing note, 2026-11-13: the gate, the architect, attempt 1, dispatched beside the reviewer, the five-line form's two gates from dispatch, PLAN node ci-rust-toolchain-pin, filler entry 16; its brief by file (5738 bytes, sha256 ef3c1618f35c5f36a52d33bd4ab910d5f874826fabd95ecf259f485c591123a2), its packet by file (9307 bytes, sha256 8a5c141e); the run 20:46:04Z to 20:49:55Z by its transcript, 43 calls (Read 21, Grep 21, SubagentHandback 1), none errored, model claude-opus-5-5; below, the hand-back byte for byte (with one final newline, 10337 bytes, sha256 329dbb64679ed8a100cde0878ec13605383f85d7383b5f49fa9df323b9de9b95), save 20 of its 21 sha256:<H> placeholders, each filled by script with the sha256 of its cited whole lines at its cited commit (git show, LF-joined, a final newline), where a bare form or same file is read as the file its own sentence names. One is left as written: the report's own sentence about them. Nothing else is changed.)

Reviewed: PR #315 at 4541c8208a70f38280355f97e7e5893ee0f7c862 (base 3857425b), gate, architect, attempt 1
Verdict: PASS
Branch reviewed: cut/ci-rust-toolchain-pin @ 4541c8208a70f38280355f97e7e5893ee0f7c862. Governance files read in the main checkout, where refs/heads/main = 3857425be64a77dfec8639bac366d6bb697889cb.

I have no shell, and I leave no background shell. I changed nothing and wrote no file. Each sha256 is written `sha256:<H>`, for the custodian to fill by script.

## Findings by class

- **Correctness:** none.
- **Evidence:** none. For the eight jobs' logs I rely on the packet's §4 reading. The reviewer reads the logs, and I did not.
- **Documentation (must-fix before the merge):** none.

## Check 1. The five lines against the diff

The rulings applied are Part 1, items 1, 5 and 6, of the 2026-11-05 directive, cited by item.

**Scope.** The diff's numstat names exactly the seven files: six at 3 insertions and 1 deletion, and rust-fmt.yml at 2 and 1. That is 20 insertions and 7 deletions, 27 lines against the declared budget of 27 (governance/forms/root/CI-RUST-TOOLCHAIN-PIN-PREREGISTRATION.md:15 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:3b4cdaeee9f27430b82c0ceee10d70efaf71392b5787f6f4a246e1a596d03016).
- Each hunk touches only the install step.
- release-artifacts.yml is not in the diff.
- No rust-toolchain file, rust-toolchain.toml, Cargo file or settings file is in the diff.

**Change.** N1's shape (form:23-38 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:56006c3660f4c1979770cb2241896736f87cadc7a89be41177ab8cb5c18af63c) holds at every step, read at H. Each step is the commit line, then `with:`, then `toolchain: "1.100.0"`, quoted and in three parts, with six/eight/ten-space indents:
- .github/workflows/product-ci-rust.yml:205-207 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:3e5cdab888530dfc4bc67f168c0e53852233860b1e18162be9e979692d8fd0c9
- .github/workflows/product-ci-shell.yml:181-183 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:3e5cdab888530dfc4bc67f168c0e53852233860b1e18162be9e979692d8fd0c9
- .github/workflows/product-ci-viewer.yml:102-104 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:3e5cdab888530dfc4bc67f168c0e53852233860b1e18162be9e979692d8fd0c9
- .github/workflows/tauri-build.yml:46-48 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:3e5cdab888530dfc4bc67f168c0e53852233860b1e18162be9e979692d8fd0c9
- .github/workflows/adr-003-spike-ci-linux.yml:71-73 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:3e5cdab888530dfc4bc67f168c0e53852233860b1e18162be9e979692d8fd0c9
- .github/workflows/adr-003-spike-ci-macos.yml:53-55 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:3e5cdab888530dfc4bc67f168c0e53852233860b1e18162be9e979692d8fd0c9
- .github/workflows/rust-fmt.yml:68-71 @ 4541c8208a70f38280355f97e7e5893ee0f7c862 sha256:af8e002d113fff9a1ec427fd7e16fb13aa37cc3cf2665bed3b6c6f5856674de0. Here `toolchain` is the first input under the existing `with:`, and `components: rustfmt` is unchanged.

A grep of .github/ at H returns:
- exactly seven `dtolnay/rust-toolchain@` lines, each ending in b725eda525362e7cf34af9a7243cac1e3f01a7ec;
- exactly seven `toolchain: "1.100.0"` lines;
- no line containing `stable` (case-insensitive).

**Tests+mutation** (form:17 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:4093417e73ff37ef254c04c766fb0a1c3ee47ce77b70def903f64179fd27b1f4).
- No test file is in the diff.
- The evidence is the PR's own runs. I rely on the packet's §4 reading: every listed run at H concluded success, and the eight jobs meet N3. The reviewer reads the logs.
- No record in the piece calls anything an observation of a mutation.

**Out-of-scope** (form:18 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:453eda855713123b89682731f0bc10c09d69260339dcdd4e821db682ddccf912), clause by clause:
- **ADR: none.** Nothing under docs/ is in the diff. Met.
- **Security: touched, what CI installs, under the cited directive.** Met; see check 4.
- **The version and the commit are those of run 43473141005.** ADV-2026-11-13-17, item 1 (a) records that the advisor read both from that run's logs. The diff uses exactly 1.100.0 and b725eda5…a7ec. Met.
- **No other action is pinned or changed.** The only deleted lines are the seven `@stable` lines. Met.
- **Wire: none.** Nothing under protocol/ is in the diff. Met.
- **Guarantee: none.** Nothing claims one. Met.
- **No workflow header is edited.** Every hunk sits at a step line. Met.
- **No header sentence names the channel.** The grep at H finds no `stable`. Met.
- **No new dependency or action.** It is the same action, now pinned to a commit. Met.

## Check 2. The settlement as built

The settlement is form:152-155 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:a779eab33f8ed178532d5665e42ba53ccb6266610d0e9bea704e29101e0a9a17, read against ADV-2026-11-13-17, items 2 to 5. Nothing in the PR departs from it.
- **OPEN-1 (A).** release-artifacts.yml is unedited, since it is not in the numstat. It was not dispatched: the packet's run list at H holds only pull_request and push events, with no release-artifacts run.
- **OPEN-2 (A).** Each `uses:` line names the commit alone, with no trailing comment, as read at H.
- **OPEN-3 (A).** S1 was read from 20:18:54Z to 20:19:04Z, before the PR opened at 20:19:42Z. All seven workflows read "no main run in the window", which meets N5's record clause in that form (form:90 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:41d44bb0ce88c10c95d90dd6483c74f29cd95e6857af9d788407984c7cd9128a).
  - The strict "created after" bound leaves out the two same-second runs at 6edbfa71. The packet's positive control names them. ADV-2026-11-13-17, item 1 (c) already read their rustc lines (shell run 43473140935, fmt run 43473141010), so nothing is left unread.
  - The repeated read at the merge-check request is still to come.
- **OPEN-4 (A).** No job is red, so it does not fire.

## Check 3. N3, N5 and N6

**N3's points 1 to 4** (form:64-68 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:41cfb356e15ce0bd08d6454da052f587a306e930b9f13ee822d118a9eebc97c7). The packet's eight rows match N3's table one for one: product-ci-rust ×2, shell, tauri-build through shell, viewer, fmt, spike-linux and spike-macos.
- Each row gives: success; `rustc 1.100.0 (0ef1bc386 2026-11-09)`, byte-equal to N3's line; the action at b725eda5…a7ec; and the `rustup default` outcome success (the outcome field, as point 4 needs, not the conclusion field).
- The summary reads "8 of 8".
- The tauri-build row runs under product-ci-shell's run, so the edited reusable file is the one that ran.
- This meets points 1 to 4, with no gap.
- rustfmt's line (form:70 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:188f7ce338415c41a7d511d18d0c740a5c615ec8d75b2377d6d793aa84d46cc2) reads `0ef1bc3860`. That is a ten-character abbreviation whose first nine characters are N3's `0ef1bc386`, so it is the same commit, and the stop does not fire.

**What the closing amendment must cite.** It is references only, under the record cap.
- **By Tests+mutation:** for each of the eight jobs, the run id, the job id, the head commit 4541c8208a70f38280355f97e7e5893ee0f7c862 and the rustc line by reference to N3.
- **By N5's record clause:** S1's result as the PR body gives it, "no main run in the window" for each of the seven, so there are no run ids to cite. Also the OPEN-3 read repeated at the merge-check request, with its run ids, if there are any.
- **By N6's first bullet** (form:97 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:bd37cba6369979016984fa18aeae7abe0a5e2b0c3e8c19f88ac566253a0e246a): the pin's merge commit on main.
- **Hash references** are at a commit on main (round 15 (e)).
- **rustfmt:** record its line with the prefix relation stated above, not as a different commit.

## Check 4. The constitution

**docs/01.** No principle or derived rule is touched; the change is CI configuration only. Principle 3 (reproducibility) is helped, not harmed. Plain text holds.

**ADRs.**
- ADR-006: not applicable, since no runtime operation changes.
- ADR-009: the action is already in use and only its pin changes, so there is no licensing change.
- docs/08: no performance claim, and the budget harnesses are untouched.
- ADR-010 and ADR-011: untouched.

**Security clause.** It is met. The approval is the human's line approving ADV-2026-11-13-05 (state/directives/2026-11-13-adv-04-and-05-approved-settings-two-places-ci-toolchain-pinned-merge-check-wording-only-fail-closed-under-31.md:8 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:2a268ee2d4ea05e1157afb03f950df717e50f6e1980e6172791b3f50d053c8fb), with its items 1 to 5 (same file:36-44 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:ca0ac7b19f2187c40c4845c908e82bd14cd4653e2bb95eb7f2c244a47c892f8c).
- Item 1: one exact version and the action pinned by commit. Met.
- Item 2: the version is the one logged by main's first green Rust run after entry 15 merged. Met by run 43473141005 (ADV-2026-11-13-10, item 4 (a); ADV-2026-11-13-17, item 1).
- Item 3: the seven steps and nothing else (no path filter, cache key, lockfile or other action). Met.
- Item 4: no bump. Met.
- Item 5: no canary job. Met.
- Nothing is installed beyond this. The only extra component is rust-fmt's `rustfmt`, which was already there, and ADV-2026-11-13-10, item 5 (a) keeps it.

**ADR note, KNOWN-LIMITATIONS item or README line.** None is needed.
- Local machines staying on `stable` is the human's choice in ADV-2026-11-13-05, item 1.
- A CONTRIBUTING line naming CI's Rust version would be a preference, not a condition.

## Check 5. Text on main made untrue

Searched: README files, docs/, governance/*.md, governance/PLAN.yaml, KNOWN-LIMITATIONS.md, CONTRIBUTING.md and CLAUDE.md, plus the workflow headers at H. No current-tense text says CI installs or follows `stable` or names `@stable`.
- **PLAN.yaml, node `workspace-rustfmt`** (status done), summary: "Its one CI install is the stable toolchain rustfmt component on the runner". This is a dated record of a done node and accurate for its time; leave it. I cite it by node id, not by line, because PLAN.yaml has uncommitted changes in the main checkout, so a line pin at 3857425b cannot be checked from the tree.
- **PLAN.yaml, node `ci-rust-toolchain-pin`**, summary: names `@stable` as the history of the version read. It stays true.
- **governance/MACOS-BRINGUP.md:39 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:c6414dfbd319ad9dbf61eecaf54b81e0b15b97bfa3d32f9ca183dd5e22e2f5b5** ("Rust (stable toolchain)"): about a local machine, not CI. Unaffected.
- **CLAUDE.md:29 @ 3857425be64a77dfec8639bac366d6bb697889cb sha256:998b4e5e13cfbbe48b33e0daf2e69c7feea90b321fff3663ce84b18e4459ecb9** ("Rust stable (MSVC)"): about the local environment, not CI. Unaffected.
- **Workflow headers at H:** no channel named. Unaffected.

## Check 6. The worker's departure

The worker did not read Scope, Change, Tests+mutation, Out-of-scope, N3 to N8, the OPEN items or the settlement. The built diff departs from none of them: each was checked in checks 1 and 2 against H. No finding.

## For the advisor

None.

## The packet's gaps

- The worker's report is described as filed on main after 3857425b. At my read, refs/heads/main = 3857425b, and the report was present in the main checkout but not in that commit.
- The run list gives no head_sha per run. Only its header puts the runs at H.
- PR #315's body text is not reproduced, only described as matching §3.
- PLAN.yaml has uncommitted changes in the main checkout, so I could not check line pins into it at 3857425b.
