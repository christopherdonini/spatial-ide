# Wave 3, W3-C (one batch, with W3-A and W3-B): the launched prompt

- **Session ID:** session_01BrZYKUFM4c4oVeA27A2Yrd (https://claude.ai/code/session_01BrZYKUFM4c4oVeA27A2Yrd)
- **Launched:** 2026-09-30T07:25:36Z, from claude.ai/code. The environment was Default and the repository christopherdonini/spatial-ide, on branch main. The model was Opus 5.5 at Medium effort, as the composer showed at launch.
- **Assembly:** extracted by script from W3-C's fenced block in `state/cloud/wave3-prompts.md` (sha256 c6702c4…d290), with both `<WAVE3_BASELINE>` tokens replaced by a02354677d6c03aaed4b2dbdf4d14b09621d5766 and nothing else changed (the file's §2: each prompt is complete as written).
- **Exactness:** 63 lines, sha256 9b51e8f21198f8b68d7734730fca35e6925066e12a678cd0dcd0ca98aea7701e. The same hash was computed from the clipboard (LF-normalised) and from the composer's 63 paragraphs joined by newlines, just before sending.

The assembled text, verbatim:

````
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: work from exactly commit a02354677d6c03aaed4b2dbdf4d14b09621d5766. Run `git worktree add /tmp/wave3-baseline
a02354677d6c03aaed4b2dbdf4d14b09621d5766` and confirm with `git -C /tmp/wave3-baseline rev-parse HEAD` before anything else.
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
````
