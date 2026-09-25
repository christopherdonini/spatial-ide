# Wave 1, A2 (batch 1, pair 1, with A1): the launched prompt

- **Session ID:** session_012sfSh2fvSkNDCVbQ2o27Rm (https://claude.ai/code/session_012sfSh2fvSkNDCVbQ2o27Rm)
- **Launched:** 2026-09-25T22:24:56Z, from claude.ai/code. The environment was Default and the repository christopherdonini/spatial-ide, on branch main at a43fb28. The model was Opus 5.5 at Medium effort, as the composer showed at launch.
- **Assembly:** built by script per `state/cloud/wave1-prompts.md` §7, as amended by its deviation 1, read from main at a43fb28. It is A1 in full, with the branch name and the TASK block for A2, and §3's worker fields pasted. For A1 itself, the TASK block is A1's own. The same script reproduces A3's recorded prompt, sha256 a408c1d8, byte for byte.
- **Exactness:** 63 lines, sha256 43625d6a0eb0ce272c9c6df4e3d3d5397cdbe27dd34d556948dad53bdb1afe33. The same hash was computed from the clipboard (LF-normalised) and from the composer's paragraphs joined by newlines, just before sending.

The assembled text, verbatim:

````text
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit bb98f71f43a2891d317b10a124387df9d5ee0ebf. Run `git worktree add
/tmp/wave1-baseline bb98f71f43a2891d317b10a124387df9d5ee0ebf` and confirm with `git -C /tmp/wave1-baseline
rev-parse HEAD` before anything else. All reading, building, reproducers and branches happen inside
/tmp/wave1-baseline; the session's own checkout stays on main. Do not move to a newer head, and do not
reason from later commits.
ROLE: you investigate and report. You do not design, decide, merge, or change product code.

TASK — concurrency and locking audit. Examine lock acquisition and release, lock ordering, and work done
while a guard is held in: the kernel's StreamRegistry and GenerationRegistry, the ticket map and ticket
redemption, the engine connection pool and its three lease classes (engine/src/pool.rs), cancellation
paths (cancel tokens, InterruptHandle), and generation invalidation. In the shell (TypeScript), examine
callbacks that can arrive after a generation or dataset has ended. PR #116 (merged at the baseline)
fixed a drop-under-registry-lock hang: read it, and look for the same class elsewhere. Do not re-report
it. Deadlocks, lock-order inversions, and re-entrant acquisition are in scope. Performance is not.

EVIDENCE BAR: at most five findings. Each needs a reproducing test (preferred) or an exact file:line code
path at the baseline. No reproducer and no exact path means no finding. Zero findings is a valid and
useful result; do not invent weaknesses to fill the quota. Put anything plausible but unproven under
"Unproven observations", at most five, one line each. Before filing a finding, read KNOWN-LIMITATIONS.md
and search DECISIONS-PENDING.md: a duplicate of a declared limit or a queued entry is not a finding.

REPRODUCERS: test files only, under existing test directories. Commit them only to branch
cloud/wave1-A2 and push it. Open no PR. Edit no product source file.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, any product
source file.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope.

DCO: before any commit, run `git config core.hooksPath .githooks` and prove the hook rejects an
unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
NETWORK: package registries only (crates.io, npm), and only to build.
PLATFORM: your results are Linux evidence only. Windows CI and the local custodian verify the product.

OUTPUT: your final message is the WAVE1 REPORT in exactly this shape:
# WAVE1 REPORT
## Worker fields
Item: <A1..A5 | B | C | D>          Lens/purpose: <one line>
Baseline SHA: <full SHA, confirmed by `git -C /tmp/wave1-baseline rev-parse HEAD` at start>
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
