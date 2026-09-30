# Wave 3, W3-A (one batch, with W3-B and W3-C): the launched prompt

- **Session ID:** session_017msPRjkMFYd5Zn4FxukM4r (https://claude.ai/code/session_017msPRjkMFYd5Zn4FxukM4r)
- **Launched:** 2026-09-30T07:22Z (the send was clicked a few seconds before 07:22:31Z, when the page showed the session URL), from claude.ai/code. The environment was Default and the repository christopherdonini/spatial-ide, on branch main. The model was Opus 5.5 at Medium effort, as the composer showed at launch.
- **Assembly:** extracted by script from W3-A's fenced block in `state/cloud/wave3-prompts.md` (sha256 c6702c4…d290), with both `<WAVE3_BASELINE>` tokens replaced by a02354677d6c03aaed4b2dbdf4d14b09621d5766 and nothing else changed (the file's §2: each prompt is complete as written).
- **Exactness:** 61 lines, sha256 a63fe522d02df30f3db204c418fe189ee67ec79d7b1b036d67bb22fe6a21d0eb. The same hash was computed from the clipboard (LF-normalised) and from the composer's 61 paragraphs joined by newlines, just before sending.

The assembled text, verbatim:

````
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit a02354677d6c03aaed4b2dbdf4d14b09621d5766. Run `git worktree add /tmp/wave3-baseline
a02354677d6c03aaed4b2dbdf4d14b09621d5766` and confirm with `git -C /tmp/wave3-baseline rev-parse HEAD` before anything else.
All reading, building, reproducers and branches happen inside /tmp/wave3-baseline; the session's own
checkout stays on main. Do not move to a newer head, and do not reason from later commits.
ROLE: you investigate and report. You do not design, decide, merge, or change product code.

TASK — audit the product for accidental Windows coupling and false platform guarantees. Your lens is
state/directives/PORTABILITY-2026-09-30.md: read its §1 (known state), §2 (rules R1–R6 and the boundary
table) and §8 (deferred items) first. Examine product source in engine/, kernel/, protocol/, renderer/
and frontends/ (Rust and TypeScript; not tests, not spikes/) for:
- OS-conditional code (cfg(windows), cfg(unix), cfg(target_os), platform checks in TypeScript) outside
  §2's boundary files;
- Windows assumptions in shared logic: path separators, drive letters, UNC or `\\?\` prefixes,
  LOCALAPPDATA/APPDATA/USERPROFILE/TEMP, case-insensitive comparisons keyed on the OS, CRLF, reserved
  file names, maximum path length, rename-over-existing and file-sharing semantics;
- a guarantee (redaction, permissions, identity, cancellation, result correctness) that would silently
  weaken on macOS or Linux;
- frontend code that parses or builds filesystem paths, or hard-codes a modifier key.
Classify every hit as exactly one of: (1) a declared boundary (§2's table) — list, not a finding;
(2) a declared limitation (KNOWN-LIMITATIONS.md, a preregistration's deferral, §8) — list, not a
finding; (3) accidental coupling — a finding; (4) a false or silently weakened guarantee — a finding.
§1c's two gaps (the two application-directory resolvers; the OS-keyed case policy) are known: confirm
or correct them, but they are not new findings. Where a finding is observable on Linux, write a
reproducing test.

EVIDENCE BAR: at most eight findings. Each needs a reproducing test (preferred) or an exact file:line
code path at the baseline, and names the platform(s) it affects. A finding observable only on macOS or
Windows is reported as code-path-only, with that stated. No reproducer and no exact path means no
finding. Zero findings is a valid result; do not invent weaknesses to fill the quota. The full
classified list of hits goes in the report even when nothing is a finding. Put anything plausible but
unproven under "Unproven observations", at most five, one line each. Before filing a finding, search
KNOWN-LIMITATIONS.md, DECISIONS-PENDING.md, PLAN.yaml and state/directives/PORTABILITY-2026-09-30.md:
a declared limit, a queued entry or a proposed node is not a finding.

REPRODUCERS: test files only, under existing test directories. Commit them only to branch
cloud/wave3-A and push it. Open no pull request. Edit no product source file.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file.

STOP AND REPORT, rather than improvise, if: a new dependency seems necessary (report why, which one,
the missing capability, and dependency-free alternatives; do not add it); completing would require a
protocol or SKP semantic change; a design or architectural decision would be needed; the task would
have to grow beyond this scope.

DCO: before any commit, inside /tmp/wave3-baseline run `git config core.hooksPath .githooks` and prove
the hook rejects an unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
PRIVACY: never write a path that names a user profile (C:\Users\<name>, /Users/<name>, /home/<name>)
into any file or commit message; generic machine accounts (runner, user, root) are fine.
NETWORK: package registries only (crates.io, npm), and only to build.
PLATFORM: your results are Linux-container evidence only. Windows CI and the local custodian verify
the product.

OUTPUT: your final message is the WAVE3 REPORT, using exactly the worker fields of the schema in
/tmp/wave3-baseline/state/cloud/wave1-prompts.md §3, with "WAVE1" read as "WAVE3" and the Baseline
SHA field reading `git -C /tmp/wave3-baseline rev-parse HEAD`. Add one section before the findings:
"Classified hits", the full list in the four classes above, one line each with file:line.
````
