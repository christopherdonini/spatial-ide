# Wave 2, W2-A2 (batch 1, with W2-A1): the launched prompt

- **Session ID:** session_0147PbB9MZp1TvcDQSvkckey (https://claude.ai/code/session_0147PbB9MZp1TvcDQSvkckey)
- **Launched:** 2026-09-28T07:02:40Z, from claude.ai/code. The environment was Default and the repository christopherdonini/spatial-ide, on branch main. The model was Opus 5.5 at Medium effort, as the composer showed at launch.
- **Assembly:** built by script per `state/cloud/wave2-prompts.md` §4, from that file's source bytes (sha256 d9b3dab…c16a). It is W2-A1 in full, with every `<WAVE2_BASELINE>` replaced by d4245feaef1ed94a4947bd2b2d1df9cc91a1a610 and `[paste the schema]` replaced by `state/cloud/wave1-prompts.md` §3's worker fields, verbatim except for the Baseline SHA field, which reads `git -C /tmp/wave2-baseline rev-parse HEAD`. The TASK block is W2-A2's, from its section, and the branch is cloud/wave2-A2. W2-A1's text carries no literal item id; its branch name is the only id in it.
- **Exactness:** 74 lines, sha256 0bd865289496132309f7e24a67fac61e8ca2f8b40aa0e7f8ee64d637714af1a5. The same hash was computed from the clipboard (LF-normalised) and from the composer's 74 paragraphs joined by newlines, just before sending.

The assembled text, verbatim:

````
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit d4245feaef1ed94a4947bd2b2d1df9cc91a1a610. Run `git worktree add
/tmp/wave2-baseline d4245feaef1ed94a4947bd2b2d1df9cc91a1a610` and confirm with `git -C /tmp/wave2-baseline rev-parse HEAD`
before anything else. All reading, building, reproducers and branches happen inside
/tmp/wave2-baseline; the session's own checkout stays on main. Do not move to a newer head, and do not
reason from later commits.
ROLE: you investigate and report. You do not design, decide, merge, or change product code.

TASK — treat B1's projection as untrusted input and try to break it. The request's `columns` list
and the file's own column names are both attacker-controlled. Examine:
- SQL composition: how projected column names reach the SELECT list. Names containing double quotes,
  backslashes, NUL, newlines, commas, Unicode confusables, leading or trailing spaces, SQL keywords,
  and names that collide after case-folding. The filter predicate's composition rule (ADR-021) must
  be unaffected by any projection.
- Admission bypass: can any sequence of requests project geometry, the identity column, a refused
  type, or more than the declared ceiling of columns; can a dictionary index ever leave the engine.
- Resource bounds: projection width at the ceiling times batch size; per-column chunk retention;
  memory and time growth that any declared ceiling does not bound (ADR-010 rule 6).
- Refusal hygiene: no refusal leaks another column's values or file content; comma-containing names
  are handled as the ruling says (omitted from known_columns, with the omission stated).
- The publish path: can a projected type the bundle format refuses reach a written bundle.
Work only inside your container; probe nothing outside it.

EVIDENCE BAR: at most five findings. Each needs a reproducing test (preferred) or an exact file:line code
path at the baseline. No reproducer and no exact path means no finding. Zero findings is a valid and
useful result; do not invent weaknesses to fill the quota. Put anything plausible but unproven under
"Unproven observations", at most five, one line each. Before filing a finding, read KNOWN-LIMITATIONS.md
and search DECISIONS-PENDING.md and PLAN.yaml: a duplicate of a declared limit, a queued entry or a
proposed node is not a finding.

REPRODUCERS: test files only, under existing test directories. Commit them only to branch
cloud/wave2-A2 and push it. Open no PR. Edit no product source file.

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
