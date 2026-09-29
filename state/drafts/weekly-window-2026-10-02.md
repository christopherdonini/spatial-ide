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

## D. (added 2026-09-29) The round mirror as a PreToolUse hook on `AskUserQuestion`

*Added on the 2026-09-29 flush directive (`state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md`, item 6(a)), which puts it to this window as the human's decision.*

**The gap.** §4's round mirror depends on the custodian remembering it. It lapsed after round 30: two rounds on 2026-09-29 went unmirrored (the ledger's 17:30Z entry).

**The hook contract.** Checked by the custodian on 2026-09-29 against the downloaded page, https://code.claude.com/docs/en/hooks.md. The quotes below are byte-copied from it.
- PreToolUse "Runs after Claude creates tool parameters and before processing the tool call." `AskUserQuestion` is in its list of matchable built-in tools.
- The `AskUserQuestion` input table describes `questions` as: "Questions to present, each with a `question` string, short `header`, `options` array, and optional `multiSelect` flag". The page's example shows options carrying only `label`.
- This session's two `AskUserQuestion` calls on 2026-09-29 carried exactly the following keys (read from the session transcript):
  - `questions`;
  - per question: `question`, `header`, `multiSelect`, `options`;
  - per option: `label`, `description`.
- Every event also receives the common fields, among them `session_id`, `prompt_id` and, inside a subagent, `agent_id`.
- "Exit code 0 with no output means the hook has no decision to report, so the tool call continues through the normal [permission flow](/docs/en/permissions)."
- The reference's PreToolUse decision control says `"allow"` does not suffice for `AskUserQuestion` without `updatedInput`. The hook therefore returns no decision at all.
- The command-hook timeout "Defaults: 600 for `command`, `http`, and `mcp_tool`". The hook sets its own short timeout.

**Proposed shape: one governance piece, `round-mirror-pretooluse-hook`.**
1. **Wiring.** A `PreToolUse` entry in `.claude/settings.json` with matcher `AskUserQuestion` and timeout 15 (the Telegram notifier's figure). It runs a new mode of `scripts/hooks/questions-mirror.mjs` that reads the hook's stdin JSON and reuses `mirrorRound`.
2. **What it sends: the tool's own text.**
   - It renders `tool_input.questions` in §4's format: the item number, the red-line marker, the digest text (the `question`), and the numbered options with their descriptions. The marker applies when the question text begins with `RED LINE`, the custodian's existing convention.
   - The file is plain text, with a blank line and a `---` rule between items, and item order equal to the ask order.
   - It writes `state/questions/round-<n>.md` and sends it as §16 requires: one message, or a document above 4096 characters.
3. **Round numbering: one call, one round.** Each `AskUserQuestion` call is its own round: one file, one message, numbered by call. n is one more than the highest existing round file.
   - This follows Fable's recommendation of 2026-09-29 (`state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md`, item 3); the human decides at the window.
   - The first draft grouped calls by `prompt_id` into question sets. That was dropped, because two unrelated rounds in one long turn would have merged.
   - Item 8's test case for it is replaced by one for two calls.
4. **It never blocks and never alters the question.**
   - It exits 0 with nothing on stdout on every path, including a failed send or missing credentials, with the note on stderr.
   - It never exits 2, since that would block the call, and it never returns `permissionDecision` or `updatedInput`.
5. **It stays silent**:
   - inside a subagent (`agent_id` present);
   - in a session that does not hold `CUSTODIAN-LEASE`;
   - in a cloud session (`isCloudSession`).
6. **Unchanged:**
   - Telegram stays read-and-copy, never an answer channel.
   - `AskUserQuestion` stays the sole answer channel.
   - The custodian commits the round file with its RULED record.
7. **§4's text.** A dated amendment appended at the end of `AUTONOMY.md` (not inserted mid-file) says that the hook discharges the mirror obligation. A round the custodian writes by hand for context remains allowed.
8. **Tests** (`node --test`):
   - rendering from a recorded `tool_input`;
   - two calls in one turn give two round files and two messages;
   - the red-line marker;
   - each silent case;
   - a failed send still exits 0 with empty stdout.
   - Mutation: drop the options' descriptions from the render; the rendering test fails.
9. **Gating.** A preregistration before any code, then the reviewer. The architect joins if §21a is read to apply, since this is new tooling on the answer path.

## E. (added 2026-09-29) Staleness the model can see: the Stop hook refuses to stop on a stale block

*Added on the 2026-09-29 flush directive, item 6(b), as the human's decision.*

**The gap.**
- At 17:06Z on 2026-09-29, the PreCompact hook blocked an automatic compaction. Its record is `.claude/state/precompact-<session>.json`.
- The model never saw the block, no flush followed, and the session compacted on a block from the day before.
- The reference says what reaches whom at PreCompact: "Exit with code 2 to block compaction. For a manual `/compact`, the stderr message is shown to the user." For an automatic compaction it says: "If compaction was triggered proactively before the context limit, Claude Code skips it and the conversation continues uncompacted." It says nothing of the model.

**The hook contract** (same page, byte-copied):
- Stop decision control: `reason` is "Required when `decision` is `"block"`. Tells Claude why it should continue".
- "A hook that blocks by exiting 2 routes the same way as `reason`: Claude receives the stderr message as the explanation for why it should continue."
- The loop limit: "Claude Code applies an 8-consecutive-continuation cap: after stop hooks have continued the turn eight times in a row, Claude Code overrides the next block and ends the turn."
- A subagent's summary of the page said the opposite, that the reason is not given to Claude. It was wrong on the page's text and is not relied on.

**Proposed shape: one governance piece, `stop-hook-stale-continuity`.**
1. **The predicate.** The block is stale when the newest commit on HEAD that touches `state/CUT-STATE.md` does not itself rewrite the block's `flushed_at:` line. In other words, a ledger commit has landed since the last flush.
   - A commit that is flush-only, or an entry plus a flush in one ledger-only commit, is fresh.
   - It reuses `parseSessionContinuity` from `precompact-flush.mjs`.
2. **Its place in `stop-queue.mjs`'s order:** after the override and HALT step and after the lease check (only the lease holder flushes), and before the background-tasks allow.
   - Moving it ahead of background tasks is deliberate: a turn that pauses for background work is exactly where a long wait meets an automatic compaction.
   - Fable recommends this order (2026-09-29, item 3): one ledger-only flush commit clears the block. The human decides at the window.
3. **Its block reason, which the model receives.** It names:
   - the newest ledger commit and its time;
   - the block's `flushed_at`;
   - the step: rewrite with `scripts/hooks/flush.mjs` from git and the ledger, commit ledger-only, push, then stop.
4. **Loop protection.** It counts inside the existing continuation accounting (session cap 6, daily cap 40). A flush moves HEAD, which is the hook's progress signal, so one flush resets the consecutive count. A flush that cannot land (a failed push) runs into the caps and ends the turn.
5. **What it mechanizes.** Item 5, the block refreshed at each milestone, becomes automatic. Any turn that commits to the ledger cannot end until the block follows it.
   - A milestone refresh needs no `chore(site): health refresh` commit: the health refresh stays with handoffs and the pre-compaction flush (§7), and milestone refreshes are ledger-only. Fable agrees (2026-09-29, item 3); the human decides at the window.
6. **The PreCompact block stays as the backstop, unchanged.**
7. **Tests** (`node --test`):
   - stale after an entry-only ledger commit;
   - fresh after a flush-only commit, and after entry plus flush in one commit;
   - HALT and the environment override still allow;
   - a non-holder session still allows;
   - the caps still end the turn.
   - Mutation: invert the predicate; the stale case fails.
8. **Gating.** A preregistration before any code, then the reviewer, and the architect if §21a applies (it changes the stop behaviour of the custodian's loop). The §3 and §7 texts get a dated amendment appended at the end of `AUTONOMY.md`.

**The question (draft wording), items beside A to C:**
- D:
  - (1) Adopt `round-mirror-pretooluse-hook` as described, one call per round (Recommended; Fable's recommendation).
  - (2) Adopt it as a backstop only: the hook sends only when no round file was written and mirrored in the turn.
  - (3) Hold.
- E:
  - (1) Adopt `stop-hook-stale-continuity` as described: the check runs before the background-tasks allow, and milestone refreshes are ledger-only (Recommended; Fable's recommendation).
  - (2) Adopt it, with every refresh preceded by a health refresh commit.
  - (3) Hold.
