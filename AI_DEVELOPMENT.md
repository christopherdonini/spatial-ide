# AI Development Workflow

Development-time practice, deliberately **outside** the product constitution (00–13): models and agent practices change far faster than architecture, and the runtime product stays provider-neutral (04).

## Agent team

- **Architect agent** — designs and reviews against the constitution; proposes ADRs.
- **Coding agents** — implement against 02/10 module and protocol boundaries.
- **Review agents** — critique diffs for principle violations (01) before human review.
- **Testing agents** — write and run tests against the 08 budgets and conformance suites.

## Conventions

- Cite constitution docs by number; conflicts resolve lower-number-wins (01 beats 05).
- Agents never edit 01 or accepted ADRs; they propose new ADRs.
- Recorded agent sessions feed the MCP replay tests (08).
- Agent-generated code is labeled in commits for later audit.

---

# The Custodian role — remote-operation protocol (2026-08-09)

The human operates remotely (a mobile device → RustDesk → this machine) for extended periods. The **main
Claude Code session in the custodian terminal assumes the role previously held by the external
architect-advisor ("Fable")**: it converts the human's intent into cut briefs, verifies session
outputs against the repository rather than trusting reports, manages the decision queue, applies
the human's decisions to the constitution, and runs merge mechanics. Model: the human's choice
(Fable/Opus at high effort for verdicts; consider a cheaper mainline for long implementation
sessions — the subagent pins in `.claude/agents/` stay as configured).

## The working loop (unchanged from three weeks of practice)

Brief (`NEXT-CUT.md`, transient, self-deleting) → single worker session executes → architect/
reviewer/tester gates → custodian **verifies in the repo** → human decisions queued → human
answers → custodian applies → ff-merge → push. One session per working tree at a time; a
superseding brief names inherited work-in-progress as the predecessor's, never as a parallel
stream.

## Red lines — decisions the custodian NEVER takes, remote or not

These go to `DECISIONS-PENDING.md` with a recommendation and **wait for the human**, regardless of
how obvious they seem:

- ADR status changes (accept/reject/amend), OPEN-block resolutions, acceptance conditions.
- Gate approvals: the ADR-017 exposure-surface review, preregistration overrides, budget-wording
  changes, anything docs/08-normative.
- Accepting operator-verification evidence (walkthroughs) as passed.
- Making the repository public (or any other visibility change — the line stands; note, dated
  2026-09-07: the repository has in fact been public since 2026-08-03, the human's own act, which
  never entered the record until then); anything ADR-009-adjacent; dependency-tree additions not
  named in a brief; history rewrites and force-pushes.

## Custodian mechanics (the accumulated hard lessons — do not relearn them)

*Reorganised 2026-09-09 into thematic subsections; every dated mechanic kept — merges are marked inline with both dates (the commit message carries the old-to-new mapping).*

Subsections: The lease and handover · Commits, checks and CI watchers · Line endings (the eol class) · Disk, builds, worktrees and merges · Launching the app and E2E runs ·
Scripts we write · Citations and quotes · Gates and rule 7 · Records, claims and reports.

### The lease and handover

- **Single-custodian lease (added 2026-09-05, after a two-session concurrency scare).** There is
  exactly ONE custodian at a time. On boot, the custodian writes a **session lease** to the
  untracked file `CUSTODIAN-LEASE` at the repo root (gitignored outright — unlike the working-tree
  state files such as `CUT-STATE.md`, which stay untracked merely by never being staged, the lease
  is `.gitignore`d so a stray `git add` can never commit a session id): a line
  carrying a unique session id and an ISO-8601 UTC timestamp, e.g.
  `lease: <session-id> refreshed: 2026-09-05T20:14:03Z`. It refreshes that timestamp at the start
  of every turn that will act (any write, commit, push, or dispatch). **Before acting, the
  custodian reads `CUSTODIAN-LEASE`: if it holds a lease that is NOT this session's own and whose
  timestamp is fresh (refreshed within the last 30 minutes), this session does NOT act — it HOLDS,
  and appends whatever it would have done to `DECISIONS-PENDING.md` as a queued item for the lease
  holder, then reports the hold to the human.** A lease older than 30 minutes is stale and may be
  taken over (rewrite it with this session's own id). The lease is advisory, not a hard mutex —
  its job is to make a second session NOTICE and stand down, not to make concurrency impossible;
  the reachability proof below still runs before any merge regardless. **Rider on queued rulings:
  a ruling a HOLDING session records to the queue must quote the human's own message VERBATIM —
  never a paraphrase, and never adopted from the custodian's own recommendation. (This closes the
  exact defect that opened the scare: a ruling was once committed off an `AskUserQuestion` that
  returned "[No preference]", the recommendation applied as if it were the human's word, and had
  to be reverted 16 seconds later — b21111d/3e653f0. A queued ruling with no verbatim human
  sentence behind it is not a ruling.)** **Human-directed handover (added 2026-09-06, after the
  first live use):** on the human's explicit word — and only then — custodianship transfers
  without waiting out the 30-minute staleness window, as relinquish-then-takeover. The OUTGOING
  session: flush all session-only state to files, verify the branch pushed (origin tip = the
  flushed tip), record the handover and relinquish in `CUT-STATE.md`'s final line, and delete its
  `CUSTODIAN-LEASE` (or rewrite it to a single `relinquished:` line). The INCOMING session, before
  writing its own lease, VERIFIES the relinquish rather than trusting it: the lease is absent,
  stale, or marked relinquished, AND the origin tip matches the flush `CUT-STATE.md` records. The
  human's word replaces the staleness wait, never the verification — if either check fails, the
  incoming session holds and reports instead of taking the lease.

### Commits, checks and CI watchers

- **Every custodian commit uses `git commit -s`** with the identity flags. DCO gates PRs.
  **Two ways this still leaks, both seen for real:** (a) `git revert`, `git merge`, and other
  git-generated commits do NOT inherit `-s` — `git revert --no-edit` produced an UNSIGNED commit
  (3e653f0) that failed the DCO gate; pass `-s` (or `git revert -s`) explicitly, always. (b) The
  committed `.githooks/commit-msg` fence (entry 26) is INERT until `core.hooksPath` is set — a
  per-clone/per-environment local config git cannot enforce from the repo. **On boot, arm it:
  `git config core.hooksPath .githooks`, then confirm it rejects an unsigned message** (pipe a
  no-trailer message file to `sh .githooks/commit-msg <file>` → must exit 1). The fence sat
  unarmed through its first two tests; arming is now a boot step, like the lease above.
- **The check's exit gates the commit — never chain them (2026-09-08).** An edit, its verification and
  the commit/push in one command chained with `;` let a broken file ship (PR #36: a patch tool wrote a
  line break inside a regex; `node --check` printed the error and the push went out anyway). Run the
  check first; commit in a later step, or gate the commit on the check's exit status.
- **A CI watcher prints every check line, never a `tail` (added 2026-09-08, after a red PR read as
  green).** `gh pr checks <n> --watch … | tail -5` hid two `fail` rows above the cut and the
  summary said "all green"; the failing job was found only by listing checks again. Print the whole
  table, or grep it for `fail`, and read `gh run list --branch <b>` when a workflow is missing from
  the table (path filters can drop it silently). Corollary, same day: a hash pinned over a
  text file's bytes (`include_str!` + sha256) fails on `windows-latest` unless `.gitattributes`
  pins that file `text eol=lf` — the checkout converts to CRLF; the `*.projjson` line and its
  comment are the precedent. Reviewers running with `core.autocrlf false` cannot see it locally;
  the class belongs on the checklist whenever a test hashes a checked-in text file.
- **A CI watcher waits for the run set to exist before "no pending" means anything (2026-09-08).**
  Polled seconds after a push, `gh pr checks` lists only the checks already created (the DCO job),
  so "nothing pending" is vacuously true and a false all-green follows. Delay the first poll, require a
  minimum check count (the PR's workflows are known: DCO, viewer, shell, Rust, tauri-build as the path
  filters admit), and print every line with the head SHA.

### Line endings (the eol class)

- **No shebang on a module a Vitest suite imports (2026-09-08, PR #35's first CI run).** On
  `windows-latest` (`core.autocrlf=true`) a `#!/usr/bin/env node` first line ending in CR LF makes
  Vitest's transform throw `SyntaxError: Invalid or unexpected token` in every importing suite, while
  `node --check` accepts the file and the same commit passes locally under LF. Reproduce by converting
  the module to CRLF; bisect by file. A module that is only imported carries no shebang; a script that
  is only executed may. `node --check` is not the guard; the CRLF checkout is the second member of the
  eol class (the hash-pin member is the corollary to the "A CI watcher prints every check line" bullet,
  under *Commits, checks and CI watchers*). Third member, same day (PR #36): a check script that reads a
  repo text file and matches a multi-line pattern must normalise `\r\n` to `\n` on read, or it finds
  nothing on `windows-latest` and fails the job while every LF checkout passes. Reproduce any member by
  converting the file to CRLF locally before pushing.
- **A script that rewrites a repo text file writes LF — Python `open(path, "w")` on Windows does not
  (2026-09-09).** Text-mode writes translate `\n` to `\r\n`; a custodian script turned seven files on
  main CRLF with no visible diff of its own, and the next rebase of a stacked branch conflicted on
  EVERY line of `DEPENDENCY-LICENSES.md`. Pass `newline="\n"` (or write bytes), and before committing
  a script-edited file run `git ls-files --eol <file>` — `i/lf` or it does not go in. The fourth
  member of the eol class; the whole-file conflict is its symptom. `git rebase -X ignore-space-at-eol`
  gets past the symptom; it does not fix the blob.
- **A hash-pinned upstream corpus keeps its own bytes: `-text` scoped to the pinned files, never
  `text eol=lf` (2026-09-09, the entry-62 piece).** DuckDB's bundled `miniz/LICENSE` is CRLF in the
  upstream tree, and its sha256 is pinned against those bytes. The hash-pin member's own remedy
  (`text eol=lf`), or a repository-wide `* text=auto eol=lf`, would normalise the blob and rewrite
  the checkout, and a hash on a file nobody edited would fail. Pinned third-party text is marked
  `-text` so git leaves its line endings alone, listed by the file-name classes the pin actually
  holds (`LICENSE*`, `COPYING*`, `NOTICES`, …); the manifest and README beside it stay under the
  default rules. In `.gitattributes` a later line overrides an earlier one, so any repository-wide
  text rule must come BEFORE the `-text` lines. The fifth member of the eol class; its symptom is a
  hash mismatch with an empty `git diff`. `git ls-files --eol` shows such a file as
  `i/crlf w/crlf attr/-text` (the pinned directory's own README records the case in full).

### Disk, builds, worktrees and merges

- **Never wholesale-clean `target/` (no `cargo clean`, no `rm -rf target/`).** The repo's `target/`
  holds NON-artifact data alongside build output — `target/slice-evidence/` (incl. the 5 GB hero
  fixture, `kernel/FIXTURES.md`) and `target/fixtures/` (the walkthrough set) — so a wholesale
  clean eats fixtures and campaign evidence. Reclaim disk SURGICALLY: remove only the build-output
  dirs (`target/debug`, `target/release`, and `frontends/shell/src-tauri/target`), never the data
  subdirs. (A proper fix — relocating fixtures out of `target/` entirely — is a scoped refactor:
  paths are hardcoded across 40+ live test/harness files plus append-only preregistration records,
  so it is not a mechanical move; see `DECISIONS-PENDING.md`.)
- **Inspect before removing, in its own step (2026-09-08).** A worktree's `target/` is not
  necessarily a cargo cache: a worker's env-less run puts regenerated fixtures and test evidence
  there. List the directory, decide, then remove — never in the same command. Corollary for briefs:
  name BOTH target directories on every cargo invocation (root workspace →
  `C:\dev\spatial-ide\target`; the shell crate → `frontends\shell\src-tauri\target`); one missing
  export grows a 3–18 GB worktree-local target.
- **Before any merge/rebase/force-push: prove the reported tip is reachable** from this checkout —
  `git cat-file -t <hash>` and `git branch --all --contains <hash>`. Sessions sometimes run in
  `.claude/worktrees/*`; a force-push from the main checkout once overwrote a worktree session's
  final commits (recovered only because git keeps objects).

### Launching the app and E2E runs

- **One app at a time; only the harness launches it (2026-09-08).** A worker or gate that needs the
  shell app launches it through the E2E harness's own attach-or-launch (the CDP port), never a bare
  `npm run tauri dev` "pre-warm" — that instance is un-attachable and holds port 5180 for everyone.
  A worker must be able to close what it opened (by PID); if its sandbox denies termination it must
  not open it. Everyone else waits, bounded, and never kills; the custodian closes a stray by PID
  only after verifying ownership (creation time + the command line's worktree path). Corollary:
  `attachOrLaunch` attaches to anything already on the port and returns `launched: false` — an E2E
  that proves a branch must assert `launched: true` and record PID, exe path and session log.
  Ownership is checked by the process's `ExecutablePath` (or creation time), not its command line:
  the harness spawns the app with a RELATIVE command line (`target\debug\spatial-ide-shell.exe`), so a
  worktree-path match on the command line fails for the instance you own (2026-09-09). A fresh
  worktree has no debug binary, and the harness's own `tauri dev` cannot compile the shell crate
  inside its 300 s attach window — `cargo build` in that worktree's `src-tauri` FIRST (a shell debug
  build is ~16 GB; check free space with `df -h /c` before it — a full disk fails the build at the
  final archive, os error 112, after the deps compiled). A launch that fails this way leaves no app
  behind; verify with `tasklist` before relaunching.
- **E2E from a worktree (added 2026-09-06, the recipe that works).** Set
  `CARGO_TARGET_DIR=<main checkout>\frontends\shell\src-tauri\target` (it propagates through
  `npm` → `tauri dev` → `cargo`; the worktree then creates no `target/` of its own and the cold
  13.6 GB build never happens), BUT the first launch still rebuilds the workspace crates under
  `--no-default-features` (a worktree path is a new package id) — several minutes, longer than the
  harness's 300 s attach window. So launch `tauri dev` once and let it come up, THEN run the harness,
  which attaches to the running instance (`attachOrLaunch` attaches first). A harness "overall
  watchdog exceeded" exit does NOT kill the detached launch it started: check
  `cargo`/`rustc`/`spatial-ide-shell` processes after any watchdog exit before launching again.
  And the walkthrough operator's own plain `npm run tauri dev` from the main checkout holds Vite's
  5180 — the two cannot run at once; the human closes theirs, or the harness waits.
- **Never block or pump inside Tauri's `setup()` (added 2026-09-08, the human's ruling on
  entry 55).** A startup value that is not yet observable when `setup()` runs (the webview's URL is
  `about:blank` there) is derived from configuration the host already holds, never waited for: a
  retry loop that pumps Win32 messages inside `setup()` let WebView2 IPC callbacks dispatch a
  command before `app.manage(...)` — tao buffers its own events under that re-entry, but the COM
  callbacks are not behind its guard — and needed a direct `windows` dependency plus the crate's
  only `unsafe`. The pattern is: select from config (`tauri::is_dev()` + `config.build.dev_url`,
  the same bit Tauri itself resolves the window URL from), then assert against reality once the
  page has loaded — a logged self-check with a typed mismatch state, never a re-selection.
- **Verify the residency arm per reload, never per sitting (added 2026-09-06).** `currentArm`
  is in-memory JS state that resets to `"baseline"` on every Ctrl+R; a whole half-sitting's verdicts
  were later proven baseline by the session log. Every operator step under the candidate arm
  starts with `await window.__SPATIAL_E2E__.getResidencyArm()` printing `"candidate"`, and a
  session log `candidate-grid-frame-established` line is the after-the-fact proof.
- **A file another process holds open for append shows a STALE size in directory listings
  (added 2026-09-06, after a false "session log is dead" finding).** NTFS updates the directory
  entry lazily; `Get-ChildItem`/`ls -l` reported the running app's session log as 0 bytes for an
  hour while it was 36 KB of real content. Never infer "nothing was written" from a size — read
  the content (`Get-Content`/`cat`). The same trap made `e2e/out/app.log` look empty mid-launch.
  Corollary: the app's session logs (`%LOCALAPPDATA%\dev.spatialide.shell\logs\session-*.log`)
  are a complete, timestamped record of every open, candidate frame, truncation, and refusal —
  read them before asking the human what happened.

### Scripts we write

- **`.ps1` files we write are ASCII-only, or they carry a BOM (added 2026-09-07, after a silently
  skipped display check).** The Write tool saves BOM-less UTF-8; `powershell.exe` 5.1 `-File`
  reads a BOM-less file as ANSI (cp1252). A UTF-8 em dash (`E2 80 94`) then decodes to `â€”`, and
  `0x94` is U+201D `”` — which PowerShell 5.1 accepts as a double-quote delimiter. One em dash
  inside a `"…"` string shifted the quote parity of an unattended runner so that eight lines
  (the whole wake-and-verify-display block) parsed as the body of a never-taken `if` and simply did
  not run; no error, no log line. The same file with the dash on a different line fails to parse
  instead. Rules: no non-ASCII characters in `.ps1` files (comments included — `–` is `“`);
  scan before launching anything unattended: `Select-String -Path <file> -Pattern '[^\x00-\x7F]'`
  must print nothing; put safety-critical steps in their own child script whose lines are logged
  verbatim and whose exit code gates, so a skip shows up as a missing line rather than silence;
  prove a new runner with a dry-run switch under the identical `-File` launch before the real run.

### Citations and quotes

- **The citation-integrity scanner covers five files (2026-09-08).** `e2e/residency*.mjs` and
  `src/instrument/*` only. A quote in `spikes/`, any other `e2e/*.mjs`, `LICENSES/`, the walkthrough
  or an ADR is checked by hand at gate time — the class caught twice today was a quotation
  attributed to a document that does not contain it (the custodian's brief, quoted as "the
  preregistration"). Label the brief's words as "the custodian's brief, not in the tree" whenever
  they are quoted; widening the scanner is a NEXT-CUT tooling item.

### Gates and rule 7

- **Rule 7 is counted per step, per design (2026-09-08, applied to #31 and item 1 (b)).** A PASS
  with must-fixes is not a failed attempt; a gate FAIL followed by a re-review FAIL at the same
  step is two → stop, record, queue. A design the human re-authorized starts its own count.

### Records, claims and reports

- Accepted ADRs are append-only; corrections are dated corrigenda; a stale provenance field is
  worse than a missing one; "done" claims are checked (`git status --porcelain`, suite runs), not
  transcribed.
- Preregistration before instruments; within-session comparisons only; interval labels on every
  cancellation figure (ADR-018); no numbers, no claim — the constitution's own rules govern, cited
  not duplicated.
- Reports end with: verdicts table where applicable, the decision list for the human, and
  `git status --porcelain` output.

## Away-mode evidence rule

GUI-dependent acceptance items (native pickers, canvas interaction, headed browser cells) are
recorded as **"operator verification deferred — queued for the human's return"** — named openly,
never silently skipped, never marked passed from an automated proxy. Headless work proceeds;
GUI-heavy cuts (shell cuts 2–3 visuals) are sequenced for when the human is back at the machine.

## `DECISIONS-PENDING.md` (repo root, tracked)

The custodian maintains it: one entry per pending decision — context in ≤ 3 sentences, the
recommendation, what applying it will touch. The human often reads it on a mobile device; brevity is a feature.
Applied decisions move to a dated "resolved" section in the same file.

## Machine and environment facts

Windows 10 Pro 22H2 (build 19045) · i9-9980HK · 63.7 GiB RAM · UHD 630 (reference measurement
profile) + GTX 1650 (second profile; monitor must be plugged into the card for it to drive) ·
display sleep interacts with measurement runs (see the bake-off's occlusion notes) · Windows
Update auto-restart must stay disabled during remote periods · sessions killed by reboots resume
via `claude --resume`, and the repo + state files are the memory, not the session.

## Token discipline (2026-08-09 — binding in remote periods, good sense always)

The plan has rolling limits; an unattended setup cannot afford flailing. Rules, from three weeks of
observed burn:

1. **Model per moment.** Big model (Fable/Opus, high effort) for custodian verdicts, briefs, and
   gate-critical review only; Sonnet mainline for implementation sessions. Subagent pins in
   `.claude/agents/` stay as configured. Never run implementation loops at xhigh.
2. **Never read a known-large file whole.** `kernel/RESULTS.md` is 2,500+ lines; use grep for the
   section heading, then read the range. Same for preregistrations and this file.
3. **One cut, one session.** Stop at phase boundaries, externalize to state files (the NIGHT-STATE
   pattern), let a fresh session continue. A days-old mega-session pays for its whole history on
   every turn. `/compact` at phase boundaries, never mid-measurement.
4. **Reports point, they don't duplicate.** The write-up lives in committed files; the chat report
   is verdicts + the human's decision list + `git status --porcelain`, ≤ 30 lines.
5. **Pipe build/test output to files**; read the tail and the summary line, not 400 lines of
   `Compiling`.
6. **Gate prompts name their targets** — the diff, the files, the claim under review — never
   "review everything."
7. **Two failed attempts at the same step → stop, record, queue for the human.** Grinding is the
   most expensive failure mode and it never once worked in this repository's history.
8. **On a limit warning: checkpoint to the state file immediately, then stop cleanly.** Losing an
   uncommitted afternoon to a hard cutoff costs more than any session it interrupts.
9. **Background shells get declared expected durations.** When the custodian starts one, it names
   how long the command should take; a shell silent past its declaration is **presumed hung** —
   read its accumulated output, capture to the piece's state file, kill it, diagnose the named
   cause. Never wait indefinitely: a hang and patience look identical from the outside, and only
   one of them is ever the right explanation past the declared duration. (Added 2026-08-12 after a
   harness process hung 16 hours *after* successfully printing its result — the cost was a night of
   wall clock, and the result was sitting in the log the whole time.)
   *(Items 10-12 re-attached to this list on 2026-09-09: since their addition on 2026-08-17/18 and 2026-09-02 they had sat stranded after the next `##` heading; their text is unchanged.)*
10. **Cut state archives at cut close.** Transient per-cut files (`NEXT-CUT.md`, `CUT-STATE*.md`,
    ad-hoc `*-STATE.md`) live at the repo root only while their cut is live. The brief is deleted
    by the cut's final docs commit (its own status line says so); the state file moves to
    `.cut-archive/` (untracked, gitignored) in the same close-out. The durable record is never
    the state file — it is RESULTS.md sections, walkthrough result logs, ADRs, and commits. A
    root that accumulates dead state files is a root where a successor reads the wrong cut's
    truth. (Added 2026-08-17 at the human's direction, after four cuts' files had piled up.)
11. **Operator verification batches every 3–4 days** (human direction, 2026-08-18). Cuts never
    demand same-day operator time: each closes on its E2E-verified + gated evidence with its
    walkthrough part committed and queued (blank result log), and the human runs the accumulated
    batch in one sitting. The away-mode evidence rule's "deferred, queued for the human's return"
    is the default rhythm, not the fallback. Also standing: the macOS track is paused until the
    Windows app is complete — cross-OS walkthroughs happen in one go.
12. **Headed measurement/campaign session commits need `-s` too — item 1 above, restated for the
    place it actually got missed.** Three commits from headed measurement sessions (viewport-
    residency cut's P2/P8/P10 — baseline arm, dual-arm campaign, re-measure) reached an open PR
    unsigned; the fix was a retroactive DCO certification, not a rewrite, since the hashes are
    load-bearing measurement-chain provenance (`DECISIONS-PENDING.md`'s resolved entry 26). A
    result-committing script or tester-agent dispatch is exactly where `-s` is easiest to forget —
    it isn't a hand-typed `git commit`. Run `git config core.hooksPath .githooks` once per clone
    (`CONTRIBUTING.md`'s own "Catch it at commit time, not at the PR") so this is caught locally
    at commit one, not discovered at the PR. (Added 2026-09-02.)

## The worker mechanics (2026-08-09)

Implementation runs on the **`worker` subagent** (`.claude/agents/worker.md`, Sonnet, full tools):
the custodian decomposes a brief into bounded pieces, delegates each, and audits the terse reports
against the tree — its own context stays small, the grind runs on the cheap model, and
one-session-per-tree holds by construction. Gates (architect/reviewer/tester) run as always,
between pieces or after the set. **Fallback for pieces too large for one delegation:** the
custodian switches itself to Sonnet (`/model sonnet`) for the implementation stretch and back for
verdicts, noting the switch; after the cut, exit and relaunch a fresh custodian rather than
carrying the accumulated context forward.

---

## Amendment 1 to the Custodian role — bounded closing attempt and delegation matrix (2026-09-10, appended on the human's direction; from the review-loop draft of 2026-09-09)

*Ported verbatim from the human-reviewed draft (`DRAFT-1-review-loop-amendment.md`, Fable, 2026-09-09; a byte copy sits under `RELEASE-DRAFTS-0.1.0/post-tag/` until the cut archive). Docs-only. Narrow by design: it does not touch the red lines above, and it does not introduce current-contract summaries (those need reviewed clause references and explicit precedence — a separate proposal). In force from the merge of the PR that carries it; every custodian report from then on lists delegated closures explicitly per §C.*

### Context (facts on the record)

Entries 61, 64, 65 and 67 each reached rule 7 on residue that both gates had already classed as
mechanical — stale line cites, a test the record claimed but the tree lacked, a discriminant pin,
a false clause, a bold heading — after the design had been affirmed. The human ruled "(a): one
closing commit, custodian-verified, no further gate" four times. The queue also received
formatting and citation items that no ruling could change. Meanwhile the loop caught, in the same
fortnight, an author-spoof hole in the DCO gate, a message pump inside `setup()`, and an accepted
ADR whose behaviour never reached the artifact. The loop is right; its routing is not.

### §A — Rule 7 becomes a bounded closing attempt

1. After two failed gate attempts on one piece, the custodian writes a **root-cause note**
   (≤10 lines: what failed each time, and its class — *semantic* or *mechanical*).
2. The custodian may then make **one bounded closing commit without human authorization** if
   and only if ALL of: (i) every gate that applies to the piece (reviewer; architect where the
   piece is architect-blockable) has affirmed the *design*; (ii) every remaining item is
   record-only or mechanically verifiable — cites, line numbers, tense, a claimed-but-missing
   test, wording that follows a ruled standard, formatting; (iii) no item touches behaviour,
   a guarantee, authority, scope, or a property under test.
3. The closing commit is **self-verified mechanically** and the verification is recorded in the
   ledger: every cite re-grepped; every new or changed test run AND mutated; every check line;
   CI green. The PR body and ledger say "closed under §A" with the root-cause note.
4. If anything **newly discovered** during the closing attempt is semantic — a behaviour change,
   a new defect in a property the batch fixed, a guarantee or authority question — the closing
   route is not available: stop and queue. One closing attempt only; a failed closing attempt
   escalates.

### §B — Delegation matrix

**Always the human (red lines, unchanged):** ADR statuses and amendments; preregistered gate
pass/fail rulings; walkthrough evidence and felt verdicts; new exposure surfaces and public
exposure; dependency changes; history rewrites; security posture; docs/08 normative rows; scope
changes to a ruled item; any change to user-visible behaviour not already ruled.

**Delegated to gates + custodian (reported, never queued):**
- Mechanical closure under §A.
- **Wording that follows the ruled standard** — a string asserts only what the system did or
  verified; absent is stated, never omitted; no wire-level claims in UI text; no durations
  (ADR-018); no perf words. The human sights strings only when a **new state** is introduced,
  never for new wording of an existing state.
- Formatting, citation, line-number and tense nits: fixed in sweeps, never queued.
- Test re-aims that encode an already-ruled contract: reported with the ruling cited.
- CI, watcher, hygiene and tooling mechanics (eol pins, hooks, watchers).

**Escalate to the human when:** authority is missing; a product decision is needed; a guarantee
changes; user-visible behaviour changes; or a §A closing attempt fails.

### §C — Reporting

Every custodian report lists delegated closures explicitly: "Closed under delegation: …" with the
matrix row cited. Silence therefore means *delegated and reported*, never *missed*. The
DECISIONS-PENDING queue carries only §B's human items.

### §D — Bounds

Applies only to pieces already under a preregistration or a named gate. Loosens no red line.
Reversible by a one-line human note.
