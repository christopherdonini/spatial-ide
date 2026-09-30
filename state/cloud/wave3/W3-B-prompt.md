# Wave 3, W3-B (one batch, with W3-A and W3-C): the launched prompt

- **Session ID:** session_01DmBGvV5LCpMZepxrs5Rmb2 (https://claude.ai/code/session_01DmBGvV5LCpMZepxrs5Rmb2)
- **Launched:** 2026-09-30T07:23:34Z, from claude.ai/code. The environment was Default and the repository christopherdonini/spatial-ide, on branch main. The model was Opus 5.5 at Medium effort, as the composer showed at launch.
- **Assembly:** extracted by script from W3-B's fenced block in `state/cloud/wave3-prompts.md` (sha256 c6702c4…d290), with both `<WAVE3_BASELINE>` tokens replaced by a02354677d6c03aaed4b2dbdf4d14b09621d5766 and nothing else changed (the file's §2: each prompt is complete as written).
- **Exactness:** 54 lines, sha256 5663ac3ace877c71fd2e6362aaeb7dbfea8046d125c12f09d16b4c6924850503. The same hash was computed from the clipboard (LF-normalised) and from the composer's 54 paragraphs joined by newlines, just before sending.

The assembled text, verbatim:

````
You are a disposable, evidence-only cloud worker on the Spatial IDE repository.
BASELINE: run exactly commit a02354677d6c03aaed4b2dbdf4d14b09621d5766. Run `git worktree add /tmp/wave3-baseline
a02354677d6c03aaed4b2dbdf4d14b09621d5766` and confirm with `git -C /tmp/wave3-baseline rev-parse HEAD` before anything else.
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
````
