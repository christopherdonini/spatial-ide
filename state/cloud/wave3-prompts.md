# Wave 3 — Linux portability evidence

*Fable, 2026-09-30, on the human's authorisation of the same date: the cloud-spending hold is lifted for this wave, and workers may install Linux system packages inside their own container. The custodian copies this file to `state/cloud/wave3-prompts.md` (tracked) before launch; nothing tracked cites this untracked original. It authorises evidence only: no product change merges from any wave-3 branch.*

## 1. Purpose and limits

Wave 3 gathers Linux evidence for the portability plan (`state/directives/PORTABILITY-2026-09-30.md`): an audit for accidental Windows coupling (its R1–R6), the current tree's Linux build and test state including the Tauri shell (§3's PORT-1 and PORT-3), and a Linux probe of Prepare's acquisition candidates (§4).

Cloud sessions run on Linux in a container. Their results are **Linux-container evidence only**: never macOS, never a user's Linux desktop, never L2 or L3 (§2, R5). Windows CI and the local custodian remain authoritative for the product.

Everything from waves 1 and 2 carries over: the result schema and triage (`state/cloud/wave1-prompts.md` §3 and §4), the recording format (§6), the evidence bar, the stop conditions, the DCO proof, inert hooks (#120), and the baseline worktree. **Each prompt below is complete as written**; nothing is assembled by swapping parts, so wave 2's "Open no PR" conflict cannot recur.

## 2. Before launch (the custodian)

- **Baseline.** `WAVE3_BASELINE` = the first main commit at or after `a023546` (B-1 done) with product CI green on every workflow. Write its full SHA into all three prompts in place of `<WAVE3_BASELINE>`, and record the CI run links in `state/cloud/wave3.md`.
- **Balance.** Read the "Cloud session credits" figure before launch and after the batch ends (whole dollars). The promotion ends 2026-11-04 23:59 PT.
- **Launch** all three as one batch. Record each session ID beside the exact prompt text launched, and file each final report verbatim under `state/cloud/wave3/<item>.md`.

## 3. Items

| Item | What | Output |
|---|---|---|
| W3-A | Portability audit: accidental Windows coupling and false platform guarantees | Report; Linux reproducers on its branch only |
| W3-B | Linux L1 evidence at the baseline: workspace, shell frontend, viewer, and the Tauri shell's first Linux compile | Report with the exact package list and a failure catalogue; no commits |
| W3-C | Linux probe of Prepare's acquisition candidates | Report; probe sources on its branch only, under `spikes/` |

## 4. The prompts

### W3-A — portability audit

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: audit exactly commit <WAVE3_BASELINE>. Run `git worktree add /tmp/wave3-baseline
<WAVE3_BASELINE>` and confirm with `git -C /tmp/wave3-baseline rev-parse HEAD` before anything else.
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
```

### W3-B — Linux L1 evidence, including the Tauri shell's first compile

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: run exactly commit <WAVE3_BASELINE>. Run `git worktree add /tmp/wave3-baseline
<WAVE3_BASELINE>` and confirm with `git -C /tmp/wave3-baseline rev-parse HEAD` before anything else.
All reading, building and test runs happen inside /tmp/wave3-baseline; the session's own checkout
stays on main. Do not move to a newer head.
ROLE: you run, observe and report. You do not fix, design, decide or commit.

TASK — establish what builds and passes on Linux at the baseline, and what the Tauri shell needs to
compile there for the first time. Read state/directives/PORTABILITY-2026-09-30.md §1b, §1c item 3,
§2 (R5 and R6) and §3 first. Then, recording every command, its exit status and its counts:
1. The Rust workspace: `cargo test --workspace --no-fail-fast`. Record passed, failed and ignored, and
   list every ignored test with its reason. Group the ignored list into: ignored on every platform
   (an `#[ignore]` with no platform condition) and ignored off Windows (a `cfg_attr(not(windows),
   ignore = ...)`). Name any ignored test whose reason does not name its boundary (R6).
2. The shell frontend (frontends/shell): `npm ci`, then its typecheck, build and test scripts as
   package.json defines them. Record the npm and Node versions used; the repository requires npm 11+.
3. The bundle viewer (renderer/bundle-viewer): the same steps.
4. The Tauri shell (frontends/shell/src-tauri, outside the Cargo workspace): `cargo check`, then
   `cargo test`. It needs Linux system packages. You MAY install, inside your own container only, the
   distribution packages its build requires (for example the WebKitGTK 4.1, GTK, libsoup and
   appindicator development packages). Record the distribution and version, and the exact package
   list you installed, in the order you found each one necessary. Do NOT run `tauri build` and do not
   launch the application.
For every failure, record the first error in full and classify it: a Linux build environment gap
(packages, toolchain), a Windows assumption in the code (name file:line), a test that assumes Windows,
or other.

EVIDENCE BAR: this is a catalogue, not a hunt. Each catalogued failure needs the command, the exit
status and the first error verbatim. Anything you believe but did not run goes under "Unproven
observations", at most five, one line each. Before calling a failure new, search KNOWN-LIMITATIONS.md,
PLAN.yaml and state/cloud/wave1/D.md: wave 1's D-1 to D-4 are known.

COMMITS: none. Edit no file in the repository; delete anything your runs generate that git does not
ignore, and say what you deleted.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file.

STOP AND REPORT, rather than improvise, if: a new Rust or npm dependency seems necessary (report why,
which one, and alternatives; do not add it); a build needs a product source change; the task would
have to grow beyond this scope.

PRIVACY: never write a path that names a user profile (C:\Users\<name>, /Users/<name>, /home/<name>)
into any file or report; generic machine accounts (runner, user, root) are fine.
NETWORK: package registries (crates.io, npm) and your distribution's own package repositories, only
to build.
PLATFORM: your results are Linux-container evidence at level L1 only (portable correctness). They say
nothing about L2 (the real webview and desktop) or L3 (hardware gates), and nothing about macOS.

OUTPUT: your final message is the WAVE3 REPORT, using exactly the worker fields of the schema in
/tmp/wave3-baseline/state/cloud/wave1-prompts.md §3, with "WAVE1" read as "WAVE3" and the Baseline
SHA field reading `git -C /tmp/wave3-baseline rev-parse HEAD`. Add two sections before the findings:
"Counts" (per step 1–4) and "Linux packages for src-tauri" (distribution, version, exact list).
```

### W3-C — Linux probe of Prepare's acquisition candidates

```
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: work from exactly commit <WAVE3_BASELINE>. Run `git worktree add /tmp/wave3-baseline
<WAVE3_BASELINE>` and confirm with `git -C /tmp/wave3-baseline rev-parse HEAD` before anything else.
All reading, probing and commits happen inside /tmp/wave3-baseline; the session's own checkout stays
on main.
ROLE: you measure and report. You do not design Prepare, decide its grades, or change product code.

TASK — measure, on this Linux container, the acquisition mechanisms that
state/directives/PORTABILITY-2026-09-30.md §4 lists as candidates. Read §4 first: it defines A1 (the
bytes of one instant), A2 (no writer at that instant), A3 (structurally valid) and A4 (installed
immutable). Write small standalone probes in C or Python using only tools present in the container or
installable from the distribution's packages. Add NO Rust or npm dependency, and touch no product
code. First record the environment: kernel version (`uname -a`), distribution, the filesystem type of
every directory you probe (`stat -f -c %T`), and whether you run as root and with which capabilities.
Then measure, on each filesystem available to you (the working directory, /tmp, and a tmpfs if one is
mounted; record what you could not create):
1. Read lease (`fcntl F_SETLEASE, F_RDLCK`) on a file opened read-only:
   (a) no other process has it open: granted or refused, with errno;
   (b) another process holds it open for writing: granted or refused, with errno;
   (c) lease held, then another process opens the file for writing: does the holder receive the lease
       break signal, does the opener block, for how long, and what happens if the holder releases
       versus keeps the lease;
   (d) a file owned by another user, if you can create one: granted or refused;
   (e) a writer holding a shared writable memory map of the file.
2. Clone (`ioctl FICLONE`, or `cp --reflink=always`): supported or not, with errno, per filesystem.
3. Change attributes: size, mtime and ctime (and `statx` change fields if available) before and
   after (a) a write() by another process, and (b) a write through a shared writable memory map,
   with and without msync.
4. A torn capture: a writer rewrites a file of at least 64 MB in several write() calls while a reader
   copies it. Report whether the copy matches the old bytes, the new bytes, or neither (a torn copy),
   over at least 20 trials, with timings. This is the A1-without-A2 case.
State every result as an observation on this kernel and these filesystems. Do not generalise to other
Linux systems or to macOS, and do not call anything "equivalent to Windows".

EVIDENCE BAR: every claim names the probe, the command, and the observed output. A result you could
not measure (for example no reflink filesystem available) is recorded as "not measurable here", with
the reason. At most five unproven observations, one line each.

COMMITS: probe sources and their raw outputs only, under spikes/wave3-prepare-linux/, committed only
to branch cloud/wave3-C and pushed. Open no pull request. Nothing from this branch merges.

NEVER WRITE OR MODIFY: state/, PLAN.yaml, CUSTODIAN-QUEUE.*, site/, DECISIONS-PENDING.md, docs/adr/,
any *PREREGISTRATION*.md, KNOWN-LIMITATIONS.md, Cargo.lock, package-lock.json, .github/, .claude/,
scripts/hooks/, any product source file, or anything outside spikes/wave3-prepare-linux/.

STOP AND REPORT, rather than improvise, if: a probe would need a Rust or npm dependency or product
code; a design or grading decision would be needed; the task would have to grow beyond this scope.

DCO: before any commit, inside /tmp/wave3-baseline run `git config core.hooksPath .githooks` and prove
the hook rejects an unsigned commit (then discard that attempt). Commit only with
`git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`. If you cannot prove the hook
works, stop before committing.
PRIVACY: never write a path that names a user profile (C:\Users\<name>, /Users/<name>, /home/<name>)
into any file or commit message; generic machine accounts (runner, user, root) are fine.
NETWORK: package registries (crates.io, npm) and your distribution's own package repositories, only
to install probe tools.
PLATFORM: your results are Linux-container evidence only. They are input to B2's design check, not a
guarantee for any platform.

OUTPUT: your final message is the WAVE3 REPORT, using exactly the worker fields of the schema in
/tmp/wave3-baseline/state/cloud/wave1-prompts.md §3, with "WAVE1" read as "WAVE3" and the Baseline
SHA field reading `git -C /tmp/wave3-baseline rev-parse HEAD`. Add one section before the findings:
"Measurements", a table per probe (1–4) and filesystem, with the observed outcome.
```

## 5. After the wave

Triage as in waves 1 and 2 (wave 1 §4). W3-A's findings under R4 become proposed nodes or join port-2 (never cuts during the wave); an S1 candidate comes to Fable in one batch after the wave. W3-B's package list and catalogue feed port-1's and port-3's preregistrations. W3-C's measurements feed B2's preregistration (PORTABILITY §4) and come to Fable before B2 is drafted. Record everything in `state/cloud/wave3.md` and `state/cloud/wave3/<item>.md`.
