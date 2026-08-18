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

The human operates remotely (phone → RustDesk → this machine) for extended periods. The **main
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
- Making the repository public; anything ADR-009-adjacent; dependency-tree additions not named in
  a brief; history rewrites and force-pushes.

## Custodian mechanics (the accumulated hard lessons — do not relearn them)

- **Every custodian commit uses `git commit -s`** with the identity flags. DCO gates PRs.
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

## Away-mode evidence rule

GUI-dependent acceptance items (native pickers, canvas interaction, headed browser cells) are
recorded as **"operator verification deferred — queued for the human's return"** — named openly,
never silently skipped, never marked passed from an automated proxy. Headless work proceeds;
GUI-heavy cuts (shell cuts 2–3 visuals) are sequenced for when the human is back at the machine.

## `DECISIONS-PENDING.md` (repo root, tracked)

The custodian maintains it: one entry per pending decision — context in ≤ 3 sentences, the
recommendation, what applying it will touch. The human reads it from a phone; brevity is a feature.
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
