# Weekly window 2026-10-02 — one process proposal: rustfmt in CI, and the exposure scan's CI backstop (draft)

*Custodian's draft, 2026-09-27, prepared on the 2026-09-27 session order (`state/directives/2026-09-27-session-order.md`, its fourth ordered item). It is raised to the human as one question at the 2026-10-02 window, mirrored to Telegram first as `state/questions/round-<n>.md`. Until then it is a draft: nothing here is ruled. The record cap allows process proposals weekly (`state/directives/2026-09-18-record-cap.md`, item (2)). Measurements are the custodian's own, at main `0ada14f`; each names its command.*

## Authority

- Round 26, item 4 (`DECISIONS-PENDING.md`, RULED 2026-09-26 — question round 26): a CI fmt step waits for this window as a process proposal.
- Round 29, item 5 (RULED 2026-09-27 — question round 29): the exposure scan's CI backstop is proposed at this window.
- The 2026-09-27 session order: the two go as one process proposal, and the workspace-wide `cargo fmt` is done once, when no Rust branch is open.

## A. rustfmt: one workspace pass, then a CI check

**What exists today.** No workflow runs `cargo fmt --check`. Gates run it on a piece's changed files only (for example `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §9). Round 26 item 4 filed `data-plane-crate-fmt` as a proposed node for one crate.

**The drift, measured** (`cargo fmt --all -- --check --color never` at `0ada14f`, rustfmt 1.9.0-stable; and `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check`):

| Scope | Files | Hunks |
|---|---|---|
| kernel | — | 1,060 |
| engine | — | 838 |
| protocol/data-plane | — | 55 |
| renderer | — | 52 |
| protocol/skp | — | 43 |
| **workspace total** | **126** | **2,048** |
| frontends/shell/src-tauri (excluded crate) | 7 | 105 |

The excluded standalone crates under `spikes/` and `protocol/transport-bakeoff` are throwaway validation code and are not proposed for the check.

**Proposed shape: one mechanical piece, `workspace-rustfmt`,** which supersedes `data-plane-crate-fmt`.
1. **When.** Only while no Rust branch is open, per the session order. Today the one open Rust branch is `cut/kernel-generation-close-races`. The window is after it merges and before MP-1's first code commit; MP-1 waits on ADR-034's acceptance anyway. The four wave-1 report branches carry `.rs` reproductions (`cloud/wave1-A1`, `-A3`, `-A4`, `-A5`). They are records, not open work, and are not rebased.
2. **The diff.** Exactly `cargo fmt --all` plus the src-tauri manifest run, on the piece's base, with nothing else.
3. **The check, in the same PR,** so main is never red between the pass and the check. It is a small separate workflow (`rust-fmt.yml`, triggered on `**/*.rs` and the Cargo manifests). It runs both commands with `--check` on the stable toolchain with the rustfmt component. The heavy Rust suite's `paths` filter is not widened for it.
4. **Blame.** A `.git-blame-ignore-revs` file names the pass's commit. GitHub's blame view reads it; locally it is `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
5. **Gating.** The size puts it under full gating by §21c, and no new clause is proposed. The reviewer's check is reproduction: re-run the two commands on the base in a scratch checkout, compare `git write-tree` with the head's tree, then run the suites and the verify tools. The architect confirms the piece carries nothing but the formatter's output and the two CI files.
6. **After it.** Gates' "`cargo fmt --check` on the changed files" becomes the whole-workspace check.

**Disclosed cost: line cites into Rust files move.** The pass moves lines in 133 files. `verify-cites` checks that a cited line exists and is in range, not what it says (its header's "WHAT THIS DOES NOT CATCH"). So no check reddens, but an unpinned `path:line` cite into one of those files silently points at moved text. A rough grep of tracked markdown finds 752 rooted `*.rs:N` cites in 73 files, and about 55 of them carry a commit id nearby. Hash pins (`@ <rev> sha256:`) and commit-named test-text spans are fixed to their commit and are unaffected. The piece rewrites no cite, and immutable records stay as they are.

## B. The exposure scan's CI backstop

**What the hooks cannot cover.** `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` §1's may-not-claim list names commits made under `--no-verify`, in unarmed clones, in cloud sessions, in worktrees branched before it landed, and in CI. Two more cases: edits made in GitHub's web interface, and the merge commits GitHub writes, whose message carries the PR title.

**Proposed shape: one piece, `exposure-scan-ci-backstop`.**
1. **A range mode.** `profile-path-scan.mjs` gains a range mode (for example `--range <base> <head>`). It reuses the staged mode's added-line parser, and scans:
   - the added lines of `git diff <base>...<head>`, with type changes included (`exposure-scan-followups` found that the staged filter skips them);
   - added and renamed path names;
   - every commit message in `<base>..<head>`.
2. **The scan's rules.** The canary runs first and must be found (round 27, item 2 (ii)). Any tool error exits non-zero (item 2 (i)). A matched segment is never printed, only its path, line and class. This matters here because a public repository's CI logs are public. Machine accounts are allow-listed as round 29 item 4 rules, and no local-profile override applies on a runner (round 30).
3. **A workflow, `exposure-scan.yml`.**
   - Triggers: every `pull_request` (no `paths` filter) scanning base...head, and `push` to `main` scanning before..after. The push trigger catches GitHub-written merge commits and web edits.
   - `ubuntu-latest`, `contents: read`, Node's standard library only.
4. **Not scanned.**
   - The whole tree: immutable records keep historical paths by round 28 item 2, so a whole-tree scan would fail on them.
   - PR titles and bodies, issues and comments: they are not tracked content. They could be a later option.
5. **Gating.** Full, under §21a. The scan is part of the public-exposure posture (ADR-009's visibility), and it is new tooling code under `scripts/hooks/`.

## The question (draft wording)

**Item — the weekly window's process proposal: rustfmt in CI (with one workspace pass) and the exposure scan's CI backstop.**
- (1) Adopt both, as two pieces under this one proposal. The backstop goes first, since it waits on nothing. The rustfmt pass and its check follow in the first window with no Rust branch open, and `data-plane-crate-fmt` closes as superseded (Recommended).
- (2) Adopt both as a single piece, landing together in the first window with no Rust branch open.
- (3) Hold.

**Not in this proposal.** The last flush listed four other candidates for this window. They are left out unless the human asks for them:
- an `of-record/` exemption for the verify tools;
- the §21c README-counting reading;
- the health.mjs-in-worktree lesson;
- whether segments naming no person are exempt from round 29 item 1's matcher (that one is the human's).

## C. (added 2026-09-29) `verify-test-claims`: a superseded pin to a commit that the same PR introduces

*Added on the 2026-09-29 formatting ruling (`state/directives/2026-09-29-a2-1-amendment-12-formatting.md`, its last item). It does not block A2-1, which was cleared by removing the code formatting from four references.*

**The gap.**
- The superseded rule of `scripts/plan/verify-test-claims.mjs` (its header, condition (e)) requires the pinned commit to be an ancestor of `origin/main`. It refuses the pin otherwise, so that a record never leans on a commit that a squash or rebase merge could drop.
- A preregistration that must be committed before any code, and that names a test the same PR retires, therefore cannot carry a valid pin until after merge. This happens when B1's form, a done node's gate, gains an amendment that says a new test "inverts" an old one.
- Meanwhile the PR's own required check stays red: the Governance workflow checks out with `fetch-depth: 0`, so `origin/main` always resolves.
- It was met at A2-1's Amendment 12 on 2026-09-29.

**Proposed shape: one small governance piece, `test-claims-same-pr-superseded-pin`.**
1. Condition (e) also accepts a pinned commit that is reachable from the scanned HEAD but not from `origin/main`, only when both of these hold:
   - the pinned file's claiming line is itself introduced in `origin/main..HEAD`;
   - the node the file gates records that its PR merges as a merge commit.
2. On `main`, after the merge, the existing rule already holds, because the commit is then an ancestor.
3. Unit fixtures cover:
   - the accepted case;
   - a pin to a commit outside the range;
   - a claiming line that predates the range;
   - the squash hazard: a pin to a commit that is not reachable from HEAD.
4. Gating: the reviewer, plus the architect if the rule is read as a guarantee under §21a (it changes a property under test). The preregistration is written before any code.

**The question (draft wording), a second item beside A and B:**
- (1) Adopt `test-claims-same-pr-superseded-pin` as described (Recommended).
- (2) Hold. The known workaround is plain-text references, which was accepted as formatting-only for A2-1.
