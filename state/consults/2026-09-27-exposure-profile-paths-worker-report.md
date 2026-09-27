*Custodian's filing note (2026-09-27): the exposure-profile-paths worker's hand-back after it resumed from `fb7b96a` (head `980b10c`, local), transcribed from the hand-back message with the harness's two-space indent removed. It prints no profile name. Everything below the rule is the worker's text.*

---

Resumed from fb7b96a (Amendment 2's disposition already applied) and executed the brief's steps 2-7 to completion. No STOP this round.

**Commits on `governance/exposure-profile-paths`** (local only, not pushed), in order after `41d0341`:
- `3a85540` — scanner tests (`scripts/hooks/profile-path-scan.test.mjs`, all 21 of §4) plus two matcher fixes found while building them (initial-commit `HEAD`-diff-arg bug; a comment's own illustrative segment caught by the self-scan test) and `.githooks/pre-commit` (staged pre-STOP, landed here — disclosed in the commit body).
- `ccdccfd` — wires the scanner into `.githooks/commit-msg` (2d); discloses that this git version (2.49.0) invokes `commit-msg` with one argument only, so the pre-existing DCO merge-skip never held — verified with a debug hook that echoes argv, for `-m`, a conflict-free `--no-ff` merge, and a conflict-resolution completion commit.
- `c48a8dc` — merge of `origin/main` (`16df0d7`, landing PR #129's Amendment 5) into the branch.
- `209a9c3` — rewording: 2a's 7 whole-file substitutions, 2a′ (entry 49), 2b (normalize.rs), 2f (dated corrections), and 2a's two dated pointer-line appends.
- `1190057` — 2g's standing rule, Amendment 6 to the Custodian role in AI_DEVELOPMENT.md, N=6.
- `980b10c` — closing record Amendment 3, references only.

**Re-derivation at head** (1190057): 20 files with findings (matches §3 as revised by Amendment 2's 19→20), all in §2a's untouched rows; `DECISIONS-PENDING.md` shows only entry 110's line.

**21 mutations**: applied one at a time via Edit (not `git checkout`, after one accidental revert of uncommitted work via `git checkout --` cost two fixes I had to redo — noted for the record, no data lost), each run, observed failing its named test, reverted, confirmed back to 21/21 pass. Recorded in `profile-path-scan.test.mjs`'s `// RECORDED MUTATION:` comments.

**Equivalence proofs**: all 7 whole-file substitutions verified byte-for-byte (`--redact` over each pre-commit parent blob === commit bytes). 2a′: `git diff --numstat` 1/1, one hunk, `--redact` over the removed line === the added line; entry 110 untouched.

**N**: 6, read from `git show origin/main:AI_DEVELOPMENT.md` at `16df0d7` (main), at this branch's merge `c48a8dc`.

**Suite counts**: `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` — 336/336 pass. `cargo test -p spatial-kernel --lib permission::audit::normalize` — 8/8 pass (waited for no concurrent cargo/rustc first; the shared `C:/dev/spatial-ide/target` gave a stale-rlib E0425/E0063 build error unrelated to this piece — used a per-worktree `CARGO_TARGET_DIR` instead, per the cargo-worktree memory note). `verify-cites.mjs` PASS. `verify-quotes.mjs` (no args, full repo) PASS — 110 checked, 79 verified, 30 baselined, 1 advisory, 0 errors; running it with explicit file args instead produces spurious FAILs (a scope-restriction quirk in the tool, not a real regression) — confirmed the 34 "not found" entries from that mode are pre-existing and at line numbers outside every edit this piece made (all edits are either 1-line-for-1-line in place, or pure appends at file end). `verify-test-claims.mjs` PASS (advisory only).

**Post-hook commits**: every commit from `ccdccfd` onward passed through both armed hooks (`core.hooksPath` = `.githooks` throughout); none was refused.

**`git status --porcelain`**: empty.

**STOP**: none this round.

**Output-discipline note (disclosure, not a violation of the final record):** while reading `spikes/lod-feasibility/README.md` and `git show`-into-`/tmp` output during investigation, the real profile name appeared twice in my own tool-call transcript (once via `tail` on that README before I knew it held one, once via a verify-quotes invocation against a `/tmp` copy whose relative path traversed through it). Neither appears in any commit, file, or this report. No repeat after I noticed.

**Four-failure-class self-check**: cross-module interface use — n/a, no cross-module code landed, this is repo-tooling. Completion claims — every one above cites a commit, file, or command+output. Operator-visible messages — the hooks' own stderr lines are new; each states what the scanner found, not a product consequence (n/a here, this is dev tooling, not the product). Required tests reach their assertion, not just setup — verified by reading each test's final `assert` line during the mutation sweep, not just that it ran.

**Model**: Claude Sonnet 5, no override.

**Handoff**: ready for gates per §9 (architect, reviewer, suites). Files: `scripts/hooks/profile-path-scan.mjs`, `scripts/hooks/profile-path-scan.test.mjs`, `.githooks/pre-commit`, `.githooks/commit-msg`, `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md`, plus the rewording/2g files listed in commit `209a9c3` and `1190057`.
