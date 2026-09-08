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
- **Every custodian commit uses `git commit -s`** with the identity flags. DCO gates PRs.
  **Two ways this still leaks, both seen for real:** (a) `git revert`, `git merge`, and other
  git-generated commits do NOT inherit `-s` — `git revert --no-edit` produced an UNSIGNED commit
  (3e653f0) that failed the DCO gate; pass `-s` (or `git revert -s`) explicitly, always. (b) The
  committed `.githooks/commit-msg` fence (entry 26) is INERT until `core.hooksPath` is set — a
  per-clone/per-environment local config git cannot enforce from the repo. **On boot, arm it:
  `git config core.hooksPath .githooks`, then confirm it rejects an unsigned message** (pipe a
  no-trailer message file to `sh .githooks/commit-msg <file>` → must exit 1). The fence sat
  unarmed through its first two tests; arming is now a boot step, like the lease above.
- **Never wholesale-clean `target/` (no `cargo clean`, no `rm -rf target/`).** The repo's `target/`
  holds NON-artifact data alongside build output — `target/slice-evidence/` (incl. the 5 GB hero
  fixture, `kernel/FIXTURES.md`) and `target/fixtures/` (the walkthrough set) — so a wholesale
  clean eats fixtures and campaign evidence. Reclaim disk SURGICALLY: remove only the build-output
  dirs (`target/debug`, `target/release`, and `frontends/shell/src-tauri/target`), never the data
  subdirs. (A proper fix — relocating fixtures out of `target/` entirely — is a scoped refactor:
  paths are hardcoded across 40+ live test/harness files plus append-only preregistration records,
  so it is not a mechanical move; see `DECISIONS-PENDING.md`.)
- **A file another process holds open for append shows a STALE size in directory listings
  (added 2026-09-06, after a false "session log is dead" finding).** NTFS updates the directory
  entry lazily; `Get-ChildItem`/`ls -l` reported the running app's session log as 0 bytes for an
  hour while it was 36 KB of real content. Never infer "nothing was written" from a size — read
  the content (`Get-Content`/`cat`). The same trap made `e2e/out/app.log` look empty mid-launch.
  Corollary: the app's session logs (`%LOCALAPPDATA%\dev.spatialide.shell\logs\session-*.log`)
  are a complete, timestamped record of every open, candidate frame, truncation, and refusal —
  read them before asking the human what happened.
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
- **Verify the residency arm per reload, never per sitting (added 2026-09-06).** `currentArm`
  is in-memory JS state that resets to `"baseline"` on every Ctrl+R; a whole half-sitting's verdicts
  were later proven baseline by the session log. Every operator step under the candidate arm
  starts with `await window.__SPATIAL_E2E__.getResidencyArm()` printing `"candidate"`, and a
  session log `candidate-grid-frame-established` line is the after-the-fact proof.
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
- **A CI watcher prints every check line, never a `tail` (added 2026-09-08, after a red PR read as
  green).** `gh pr checks <n> --watch … | tail -5` hid two `fail` rows above the cut and the
  summary said "all green"; the failing job was found only by listing checks again. Print the whole
  table, or grep it for `fail`, and read `gh run list --branch <b>` when a workflow is missing from
  the table (path filters can drop it silently). Corollary, same day: a hash pinned over a
  text file's bytes (`include_str!` + sha256) fails on `windows-latest` unless `.gitattributes`
  pins that file `text eol=lf` — the checkout converts to CRLF; the `*.projjson` line and its
  comment are the precedent. Reviewers running with `core.autocrlf false` cannot see it locally;
  the class belongs on the checklist whenever a test hashes a checked-in text file.
- **Never block or pump inside Tauri's `setup()` (added 2026-09-08, the human's ruling on
  entry 55).** A startup value that is not yet observable when `setup()` runs (the webview's URL is
  `about:blank` there) is derived from configuration the host already holds, never waited for: a
  retry loop that pumps Win32 messages inside `setup()` let WebView2 IPC callbacks dispatch a
  command before `app.manage(...)` — tao buffers its own events under that re-entry, but the COM
  callbacks are not behind its guard — and needed a direct `windows` dependency plus the crate's
  only `unsafe`. The pattern is: select from config (`tauri::is_dev()` + `config.build.dev_url`,
  the same bit Tauri itself resolves the window URL from), then assert against reality once the
  page has loaded — a logged self-check with a typed mismatch state, never a re-selection.
- **Before any merge/rebase/force-push: prove the reported tip is reachable** from this checkout —
  `git cat-file -t <hash>` and `git branch --all --contains <hash>`. Sessions sometimes run in
  `.claude/worktrees/*`; a force-push from the main checkout once overwrote a worktree session's
  final commits (recovered only because git keeps objects).
- Accepted ADRs are append-only; corrections are dated corrigenda; a stale provenance field is
  worse than a missing one; "done" claims are checked (`git status --porcelain`, suite runs), not
  transcribed.
- Preregistration before instruments; within-session comparisons only; interval labels on every
  cancellation figure (ADR-018); no numbers, no claim — the constitution's own rules govern, cited
  not duplicated.
- Reports end with: verdicts table where applicable, the decision list for the human, and
  `git status --porcelain` output.

- **Inspect before removing, in its own step (2026-09-08).** A worktree's `target/` is not
  necessarily a cargo cache: a worker's env-less run puts regenerated fixtures and test evidence
  there. List the directory, decide, then remove — never in the same command. Corollary for briefs:
  name BOTH target directories on every cargo invocation (root workspace →
  `C:\dev\spatial-ide	arget`; the shell crate → `frontends\shell\src-tauri	arget`); one missing
  export grows a 3–18 GB worktree-local target.
- **One app at a time; only the harness launches it (2026-09-08).** A worker or gate that needs the
  shell app launches it through the E2E harness's own attach-or-launch (the CDP port), never a bare
  `npm run tauri dev` "pre-warm" — that instance is un-attachable and holds port 5180 for everyone.
  A worker must be able to close what it opened (by PID); if its sandbox denies termination it must
  not open it. Everyone else waits, bounded, and never kills; the custodian closes a stray by PID
  only after verifying ownership (creation time + the command line's worktree path). Corollary:
  `attachOrLaunch` attaches to anything already on the port and returns `launched: false` — an E2E
  that proves a branch must assert `launched: true` and record PID, exe path and session log.
- **The citation-integrity scanner covers five files (2026-09-08).** `e2e/residency*.mjs` and
  `src/instrument/*` only. A quote in `spikes/`, any other `e2e/*.mjs`, `LICENSES/`, the walkthrough
  or an ADR is checked by hand at gate time — the class caught twice today was a quotation
  attributed to a document that does not contain it (the custodian's brief, quoted as "the
  preregistration"). Label the brief's words as "the custodian's brief, not in the tree" whenever
  they are quoted; widening the scanner is a NEXT-CUT tooling item.
- **Rule 7 is counted per step, per design (2026-09-08, applied to #31 and item 1 (b)).** A PASS
  with must-fixes is not a failed attempt; a gate FAIL followed by a re-review FAIL at the same
  step is two → stop, record, queue. A design the human re-authorized starts its own count.

- **No shebang on a module a Vitest suite imports (2026-09-08, PR #35's first CI run).** On
  `windows-latest` (`core.autocrlf=true`) a `#!/usr/bin/env node` first line ending in CR LF makes
  Vitest's transform throw `SyntaxError: Invalid or unexpected token` in every importing suite, while
  `node --check` accepts the file and the same commit passes locally under LF. Reproduce by converting
  the module to CRLF; bisect by file. A module that is only imported carries no shebang; a script that
  is only executed may. `node --check` is not the guard; the CRLF checkout is the second member of the
  eol class (the hash-pin member is above). Third member, same day (PR #36): a check script that reads
  a repo text file and matches a multi-line pattern must normalise `\r\n` to `\n` on read, or it finds
  nothing on `windows-latest` and fails the job while every LF checkout passes. Reproduce any member by
  converting the file to CRLF locally before pushing.
- **The check's exit gates the commit — never chain them (2026-09-08).** An edit, its verification and
  the commit/push in one command chained with `;` let a broken file ship (PR #36: a patch tool wrote a
  line break inside a regex; `node --check` printed the error and the push went out anyway). Run the
  check first; commit in a later step, or gate the commit on the check's exit status.

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

## The worker mechanics (2026-08-09)

Implementation runs on the **`worker` subagent** (`.claude/agents/worker.md`, Sonnet, full tools):
the custodian decomposes a brief into bounded pieces, delegates each, and audits the terse reports
against the tree — its own context stays small, the grind runs on the cheap model, and
one-session-per-tree holds by construction. Gates (architect/reviewer/tester) run as always,
between pieces or after the set. **Fallback for pieces too large for one delegation:** the
custodian switches itself to Sonnet (`/model sonnet`) for the implementation stretch and back for
verdicts, noting the switch; after the cut, exit and relaunch a fresh custodian rather than
carrying the accumulated context forward.
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
