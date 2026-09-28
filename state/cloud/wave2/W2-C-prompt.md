# Wave 2, W2-C (batch 2, with W2-B): the launched prompt

- **Session ID:** session_01TS6NiEN6K48xsk9t37kRnb (https://claude.ai/code/session_01TS6NiEN6K48xsk9t37kRnb)
- **Launched:** 2026-09-28T07:36Z (the send came just before a 07:36:13Z clock reading), from claude.ai/code. The environment was Default and the repository christopherdonini/spatial-ide, on branch main. The model was Opus 5.5 at Medium effort, as the composer showed at launch.
- **Assembly:** built by script per `state/cloud/wave2-prompts.md` §4 from the launched W2-A1 text (`state/cloud/wave2/W2-A1-prompt.md`), so the baseline d4245feaef1ed94a4947bd2b2d1df9cc91a1a610 and the pasted schema are W2-A1's. The TASK block is W2-C's, from its section, and the branch is cloud/wave2-C.
- **Exactness:** 69 lines, sha256 68e81ba5dad89e658e2766eb5ca074a9cbe3ac2bca553a1fbca48dbddc5a5f67. The same hash was computed from the clipboard (LF-normalised) and from the composer's 69 paragraphs joined by newlines, just before sending.

The assembled text, verbatim:

````
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit d4245feaef1ed94a4947bd2b2d1df9cc91a1a610. Run `git worktree add
/tmp/wave2-baseline d4245feaef1ed94a4947bd2b2d1df9cc91a1a610` and confirm with `git -C /tmp/wave2-baseline rev-parse HEAD`
before anything else. All reading, building, reproducers and branches happen inside
/tmp/wave2-baseline; the session's own checkout stays on main. Do not move to a newer head, and do not
reason from later commits.
ROLE: you investigate and report. You do not design, decide, merge, or change product code.

TASK — concurrency and lifecycle audit of code added since wave 1: the advisory source-change watcher
(its Windows adapter by reading only; its signal handling, invalidation and opening race by reading and
Linux-runnable tests) and ADR-035's `dataset_session_ended` event: emission from the single place a
generation's end is recorded, at most once, without blocking or taking a lock; the session reference's
minting and routing; the shell's listener dropping unknown sessions with a logged line that carries no
reference; the ended state on `describe`. Look for: a lock held across emission or a Drop; an end that
emits twice or never; a late event resurrecting a session; a leak of watcher handles, threads or
listeners across reopen and close. The race `live_or_mint` versus `close_dataset` is KNOWN (PLAN node
kernel-generation-close-races): do not re-report it; report only a different mechanism.

EVIDENCE BAR: at most five findings. Each needs a reproducing test (preferred) or an exact file:line code
path at the baseline. No reproducer and no exact path means no finding. Zero findings is a valid and
useful result; do not invent weaknesses to fill the quota. Put anything plausible but unproven under
"Unproven observations", at most five, one line each. Before filing a finding, read KNOWN-LIMITATIONS.md
and search DECISIONS-PENDING.md and PLAN.yaml: a duplicate of a declared limit, a queued entry or a
proposed node is not a finding.

REPRODUCERS: test files only, under existing test directories. Commit them only to branch
cloud/wave2-C and push it. Open no PR. Edit no product source file.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope.

DCO: before any commit, inside /tmp/wave2-baseline run `git config core.hooksPath .githooks` and prove
the hook rejects an unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
PRIVACY: never write a path that names a user profile (C:\Users\<name>, /Users/<name>, /home/<name>)
into any file or commit message; generic machine accounts (runner, user, root) are fine.
NETWORK: package registries only (crates.io, npm), and only to build.
PLATFORM: your results are Linux evidence only. Windows CI and the local custodian verify the product.

OUTPUT: your final message is the WAVE2 REPORT, in exactly the wave-1 schema with "WAVE1" read as
"WAVE2":
# WAVE1 REPORT
## Worker fields
Item: <A1..A5 | B | C | D>          Lens/purpose: <one line>
Baseline SHA: <full SHA, confirmed by `git -C /tmp/wave2-baseline rev-parse HEAD` at start>
Branch: <cloud/wave1-<item> or "none">   Commits: <SHAs or "none">
Environment: <OS, rustc, cargo, node, npm versions; network scope actually used>
Commands run: <exact, with exit codes>
Findings: <count, 0..5>

### Finding <item>-<n>
Claim: <one sentence, falsifiable>
Suggested severity: S1 | S2 | S3 (worker's suggestion only)
Code path: <file:line chain from untrusted entry to the defect, at the baseline SHA>
Reproducer: <test path on the branch + command + observed output> | "code path only"
Guarantee violated: <ADR/section, principle, or documented contract; or "none stated">
Evidence: <what was observed, not inferred>
False-positive check: <why this is not already handled / not a known limit; what was searched>
Confidence: proven | code-path-only

### Unproven observations (not findings; at most five, one line each)
### Stops (if any): <which stop condition, with the file and line that triggered it>
````
