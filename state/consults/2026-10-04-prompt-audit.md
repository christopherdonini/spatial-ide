*Custodian's filing note (2026-10-04): the human's `/doctor prompt-audit` output (Claude Code 2.1.289), saved by the human as `PROMPT-AUDIT-2026-10-04.md` at the repository root (file time 12:09:41Z) and filed here as evidence on the human's instruction received at 12:12:28Z by the session transcript. It is Evidence, not Authority: not a ruling, and nothing in it is applied by its filing. The text below the rule is the human's file, byte-identical (22,878 bytes, LF; sha256 15c3fcd7a15f45511297ee36ce736c306a439870f090326bbf71c2867a2ae707, equal to this file from its line 5 to the end). The custodian read it whole before filing. It names user-level folders only as `~/.claude/...` and carries no account path. The triage into the human's four classes is item H of `state/drafts/weekly-window-2026-10-09.md`; the CLAUDE.md stale facts are placed as their own small governance piece. Profile paths redacted at filing: none.*

---

# Prompt audit — Claude Code configuration, 2026-10-04

Run: `/doctor prompt-audit` (the claude-api skill's `shared/prompt-audit.md`), session model Claude Opus 5.5.
This is an audit only: no audited file was edited, and this report is the only file written. The diff in §3 is
proposed, not applied.

## 0. Assumptions

**Scope.** The scope is the Claude Code configuration that loads into sessions in this project, as the request lists it. These files were found and audited:

| Surface | Files | Loads | Edits |
|---|---|---|---|
| Project instruction file | `CLAUDE.md` (38 lines) | every session | proposed |
| Project subagents | `.claude/agents/*.md`: architect, reviewer, lead-data, worker, worker-high, tester, tester-high, evidence-reader (213 lines, ~47 KB) | on dispatch of that agent | proposed |
| Nested instruction file | `.claude/worktrees/verify-mutation-header-token/CLAUDE.md` (a worktree checkout of another branch, at 87c11b02) | when a session reads files under that worktree | none (flag only) |
| User-level skills (`~/.claude`, so they affect **every project**) | 9 skills synced from the claude.ai account under `~/.claude/skills/synced/<id>/`: docs, docx, google-workspace, import-memory, morning, pdf, pptx, skill-creator, xlsx (the `anthropic-skills:*` set) | on trigger | none: report only |
| Installed plugins | design (7 skills), cowork-plugin-management (2 skills, 4 reference files); spatial-guardian and rust-analyzer-lsp provide no skills, commands or subagents | on trigger | none: report only |

- **Assumption about the synced skills:** they're treated like plugin-provided content, so they're reported on but get no proposed edits. They're synced from the account (a local edit would be overwritten on the next sync), and nobody wrote them here.
- **Not present:**
  - `CLAUDE.local.md`, or `AGENTS.md` at the root, nested, or in the ancestors `C:\dev` and `C:\`
  - `.claude/CLAUDE.md` or `.claude/AGENTS.md`
  - `~/.claude/CLAUDE.md`
  - `rules/`, `commands/` or `output-styles/` under `.claude/` or `~/.claude/`
  - `skills/` under `.claude/`, or `agents/` under `~/.claude/`
  - a managed-policy `CLAUDE.md` (checked `C:\Program Files\ClaudeCode\` and `C:\ProgramData\ClaudeCode\`)
- **Imports:** no instruction file has an `@` import.
- **Skipped, as the request instructs:** settings files, `.mcp.json` and `~/.claude.json`. Skipping the settings files also skips the hook definitions, so the text the session hooks inject (the SessionStart reading order, the continuity block) was not audited.
- **Skipped because it's not on the request's list:** the auto-memory index `~/.claude/projects/C--dev-spatial-ide/memory/MEMORY.md`, even though it loads in every session.

**Target model.** `CLAUDE.md` is audited against Claude Opus 5.5, the model running this audit. Each subagent is audited against its own pin:
- architect, reviewer, lead-data: `opus`, i.e. Claude Opus 5.5.
- worker, worker-high, tester, tester-high, evidence-reader: `sonnet`, assumed to resolve to Claude Sonnet 5.5.

**Provider markers.** None appear in the project files. `import-memory/SKILL.md` names other assistants as import sources but doesn't call their APIs.

**Who decides.** Several hunks edit the agent definitions. The human's rulings have edited these files by name (for example DECISIONS-PENDING.md, question round 11, items 2 and 4), so whether to take those hunks is the human's call.

## 1. Summary

The most important findings are spike-era and early-August text that the repository has since contradicted, all of it still loading:

- **The tester and architect still point at the ADR-003 spike.**
  - `tester.md:12` and `CLAUDE.md:38` send perf numbers to the ADR-003 spike's Results table.
  - `architect.md:11` checks scope against "the current gate (ADR-003 spike)".
  - ADR-003's own status and `docs/07_Roadmap.md:15` record that gate as resolved on 2026-08-03. Both lines date from the initial commit (2026-08-01).
- **`CLAUDE.md:28` tells every session that ADR-001 left React-vs-Svelte open.** ADR-001's 2026-08-09 amendment closed that question: React + TypeScript for `frontends/shell/` only. `frontends/shell/package.json` depends on `react`.
- **Three agents are told the quote checker isn't on main yet.** The architect and reviewer say "once it is on main", and the worker is pointed at a `governance/verify-quotes` branch. `scripts/plan/verify-quotes.mjs` has been on main since 80e9ba14 (2026-09-17) and runs in governance CI, and no branch by that name exists locally or as a remote-tracking ref.

The largest item on the prompt surface is the ~10 KB single-line ruling block in each of architect, reviewer and worker. It's flagged, not edited, for the reasons in F1.

**Counts:**
- Group 1 (dated prompt text): 4. Three have proposed edits; F1 is flagged.
- Group 2 (brittle configuration): 12. Eight have proposed edits; three are flagged; one is report-only (provided content).
- Group 3 (tool descriptions / shadow lists): 1.
- Group 4 (request config): not applicable, since no request-building code is in scope. The subagent roster check found no redundant agents.

## 2. Findings (highest confidence first)

### High

**H1 — `.claude/agents/tester.md:12`**
- Evidence: ``- For the ADR-003 spike, fill the Results table in `spikes/adr-003-crs-rendering/README.md` — measured value, hardware, dataset, method. A milestone without filled metrics is not done.``
- Pattern: Group 2, volatile specifics (a claim the repository contradicts).
- Why obsolete: The spike concluded on 2026-08-03. ADR-003's status reads "Accepted for Windows/WebView2 (2026-08-03)", and the spike README was last changed that day (73e9935b). Measurements now go to the results files each piece names (for example `kernel/RESULTS.md`, which docs/08 cites). The line is from the initial commit (aeb90955, 2026-08-01).
- Action: `rewrite` (hunk 1).

**H2 — `CLAUDE.md:38`**
- Evidence: ``Perf/milestone claims: `tester` agent fills the spike results table.``
- Pattern: Group 2, volatile specifics. This is the same fact as H1, in the file every session loads, and `CLAUDE.md:8` itself says the gate concluded.
- Why obsolete: as for H1. The line is from the initial commit (aeb90955).
- Action: `rewrite` (hunk 2).

**H3 — `.claude/agents/architect.md:11`**
- Evidence: `scope creep against the roadmap (docs/07) and the current gate (ADR-003 spike)`
- Pattern: Group 2, volatile specifics.
- Why obsolete: `docs/07_Roadmap.md:15` records the ADR-003 arbitrary-CRS spike's gate as resolved (2026-08-03). The gates docs/07 still lists as open are the macOS/Linux hardware validation and the transport bake-off. The phrase dates from aeb90955 (2026-08-01).
- Action: `rewrite` (hunk 3).

**H4 — `CLAUDE.md:28`**
- Evidence: `Spike frontend is **vanilla TypeScript deliberately** — ADR-001 left React-vs-Svelte open, and a spike must not decide it.`
- Pattern: Group 2, volatile specifics.
- Why obsolete: `docs/adr/ADR-001-frontend-stack.md:33-55` ("Amendment (2026-08-09) — the web framework is React + TypeScript") closes the choice for `frontends/shell/` only. It keeps `renderer/bundle-viewer` and the archived spike frontend in vanilla TypeScript. `frontends/shell/package.json` depends on `react`. Every session, including shell work, reads the opposite.
- Action: `rewrite` (hunk 4).

**H5 — `.claude/agents/architect.md:11` and `.claude/agents/reviewer.md:25`**
- Evidence: ``(`node scripts/plan/verify-quotes.mjs` once it is on main)``
- Pattern: Group 2, volatile specifics, and Group 1d, migration-relative phrasing.
- Why obsolete: `scripts/plan/verify-quotes.mjs` is tracked on main (added in 80e9ba14, 2026-09-17), and `.github/workflows/governance-ci.yml` runs it. The clause dates from 83d06d6b, the same day.
- Action: `rewrite` (hunks 5a and 5b).

**H6 — `.claude/agents/worker.md:25`**
- Evidence: ``(or the same script from `governance/verify-quotes` until it is on main)``
- Pattern: Group 2, volatile specifics.
- Why obsolete: The script is on main (see H5), and no `governance/verify-quotes` branch exists locally or as a remote-tracking ref. A worker following the parenthetical would look for a branch that's gone.
- Action: `remove` (hunk 6).

### Medium

**M1 — `CLAUDE.md:23`**
- Evidence: ``- `.claude/agents/` — architect (constitution review), reviewer (code review), tester (benchmarks)``
- Pattern: Group 3, a prose list that shadows the real roster, and Group 2, volatile specifics.
- Why obsolete: It names 3 of the 8 definitions. worker, worker-high, tester-high, lead-data and evidence-reader are missing. The session already gets the full roster, with each agent's routing description, from the Agent tool, so the prose copy can only drift. The line is from aeb90955 (2026-08-01).
- Action: `rewrite` (hunk 7).

**M2 — `CLAUDE.md:38`**
- Evidence: ``Commit style: `<type>: <summary>` (feat/fix/chore/spike/docs).``
- Pattern: Group 1d, unenforced instructions.
- Why obsolete: Of the last 400 commit subjects, 254 use `<type>(<scope>):` (for example `docs(state):`). Other types are in use too: test (47), ci (5) and style (5). `spike` doesn't appear, and no commit-msg hook enforces the stated form. A model following the line literally would break the convention the history actually follows.
- Direction (an assumption): rewrite the rule to match practice. The alternative is to enforce the stated form with a hook, which is the user's call.
- Action: `rewrite` (hunk 8).

**M3 — `CLAUDE.md:8` and `CLAUDE.md:24`**
- Evidence:
  - line 8: `— kernel, engine, and renderer modules may now begin against that architecture,`
  - line 24: `The ADR-003 gate that blocked these has concluded; they may now be built against docs/02's module map.`
- Pattern: Group 1d, migration-relative phrasing.
- Why obsolete: Both lines are written as a diff against a blocked state the reader never saw. All five module directories exist, and v0.1.0 shipped the hero slice (`RELEASE-0.1.md:26`).
- Action: `rewrite` (hunks 9a and 9b).

**M4 — `CLAUDE.md:8`**
- Evidence: `**note, 2026-09-07: the repository has been public since 2026-08-03, before that acceptance — "before any public code" did not hold in fact; see ADR-009's corrigendum**`
- Pattern: Group 2, history narratives.
- Why obsolete: The line carries the date of the correction and the story of what failed to hold. The current fact (the repository is public, and was public before ADR-009's acceptance) is what a session needs. The corrigendum keeps the history.
- Action: `rewrite` (hunk 10).

**M5 — `.claude/agents/reviewer.md:16`**
- Evidence: `6. Float precision: projected coordinates (~10⁶ m) reaching float32 without offset-relative handling (ADR-003).`
- Pattern: Group 2, volatile specifics (a superseded pointer).
- Why obsolete: The line is from aeb90955 (2026-08-01), before ADR-010 existed. The binding, architect-blockable rule is now `docs/adr/ADR-010-render-frames-origins-boundaries.md`, rule 3 ("Offset subtraction happens in f64, before narrowing to f32"). ADR-003 keeps the measurement (M2). The current cite points the reviewer at the evidence instead of the rule.
- Action: `rewrite` (hunk 11).

**M6 — `.claude/agents/worker.md:29`**
- Evidence: `Report format, hard limit ~20 lines:`
- Pattern: Group 1f, a numeric output ceiling.
- Why obsolete: The cap dates from 4702e2e7 (2026-08-11). The file later added required report content without revisiting it:
  - `worker.md:24`: "run the caller grep yourself and paste it in your report"
  - `worker.md:27`: "STATE in your report the four failure classes", plus the observed model, any override and any context handoff
  - five format items at line 29 itself

  On Sonnet 5.5, which follows numeric caps literally, the ceiling competes with the required items. The goal behind it (a hand-back with results, not logs) is better stated directly.
- Action: `rewrite` (hunk 12).

**F1 — `.claude/agents/architect.md:11`, `.claude/agents/reviewer.md:25`, `.claude/agents/worker.md:25`** (pattern match at medium confidence; action `flag`)
- Evidence: Each is a single line of 9.9–11.2 KB. Each layers the human's rulings from rounds 4, 5, 7, 8, 10, 11, 12, 14 and 15 and the 2026-09-18 record cap, with each ruling's provenance inline. For example: ``(the human, 2026-09-17, round 12 — permanent; adopted as proposed, the clauses byte-copied from `state/questions/round-12.md:3`, sha256 of that line 8c70572216c53b355bd2e89465a7a58f2dc914006c9517f177fd6de6cd5aad83)``.
- Pattern: Group 1d, patch accretion, and Group 2, history narratives.
- Why it matters:
  - The gate rules read as a run of narrow fail-by-name cases, each traceable to one incident, with provenance interleaved between them.
  - Each architect, reviewer or worker dispatch loads about 13 KB, and worker-high reads worker.md too.
  - `worker.md:25` also carries a rule the worker can't act on, because it governs the custodian's dispatching: `"record-correction rounds always go to a fresh worker — fidelity work never runs from a long context."`
- Why no hunk:
  - This is the human's ruling text, applied into these files by name.
  - The project's own round 12 (b) requires reproduced ruling text to keep its byte-copy mark and hash, and governance CI hash-checks every `.claude/agents/*.md` (`scripts/plan/verify-quotes.mjs`, the default hash scan).
  - So stripping the provenance would break a project rule, and rewording the rules would change gate prohibitions. Both are for the human to decide.
- The three copies agree with each other. The one difference is an architect-only sentence about reducing a record after its second correction round. That's role-specific, so it's working redundancy, not a conflict.
- Options for the human:
  - (a) Keep the reproduction, one ruling per paragraph, with the operative sentence first.
  - (b) Put the shared gate rules in one file the three agents read.
  - (c) Reduce the agent text to operative rules cited by round and item, and leave the ruling text in the ledger.
- Constraint for any of these: each `byte-copied from` marker must stay on the same line as its reproduction. verify-quotes reads the marker's own line and the line after it (`scripts/plan/verify-quotes.test.mjs`, the round 15, item 3 tests).

### Low (flag only)

**F2 — `CLAUDE.md:8`**
- Evidence: `**Current focus: the docs/07 Prototype hero slice**`
- Pattern: Group 2, volatile specifics.
- Why: v0.1.0 *is* the hero slice (`RELEASE-0.1.md:26`). The queue now holds follow-ups to it, and `PLAN.yaml` still files the in-flight node under phase `prototype`. "Current" may still be right as a phase name, but the sentence reads as if the slice were unbuilt. How to word the current focus is the user's decision.
- Action: `flag`.

**F3 — `CLAUDE.md:8`**
- Evidence: `Three follow-up items stay open` … `and ADR-009 (license/open-core boundary — accepted 2026-08-07;`
- Pattern: Group 2, a fact contradicted within the same sentence.
- Why: An accepted ADR is listed as an open item. CLAUDE.md is faithfully mirroring `docs/07_Roadmap.md:26`, which keeps ADR-009 under "Gate — open" beside a dated correction. The fix belongs in docs/07 first, and docs/07 is constitution text outside this audit's scope.
- Action: `flag`.

**F4 — `.claude/worktrees/verify-mutation-header-token/CLAUDE.md`**
- Evidence: This is a full copy of the root file, at 87c11b02 (2026-09-24). It differs only at line 28 (`Node LTS` where the root has `Node 24 LTS (npm 11+)`), so it carries H2, H4, M1–M4 and F2–F3 as well.
- Pattern: Group 2, duplicates drifting apart.
- Why: It loads whenever a session reads files under that worktree. Editing another branch's checkout isn't the fix. Disposing of the worktree is, and that's the user's call: the session continuity block lists it as "not this session work, inspect before removing".
- Action: `flag`.

### Provided content (report only, no edits proposed)

**P1 — `~/.claude/skills/synced/<id>/skill-creator/references/schemas.md:228`** (low; would affect every project)
- Evidence: `"executor_model": "claude-sonnet-4-20250514",`
- Pattern: Group 2, a pinned model name in an example schema.
- Why: The model copies example values, so eval metadata it writes from this schema may carry an older model ID.
- Action: report only.

The rest of the provided skills (6,936 lines across the synced skills and the two plugins) were scanned with the Step 4 signal greps, not read line by line. One other signal matched, at `pptx/SKILL.md:236` ("you tend to see what you expect rather than what rendered"). It carries its reason and asks for a check of the rendered output, so it's kept.

### Group 4 — request config and architecture

Not applicable: no request-building or prompt-assembly code is in scope.

**Subagent roster check:** worker/worker-high and tester/tester-high differ only in `effort`. The Agent tool takes no effort input at dispatch, so a frontmatter variant is the only way to vary effort, and the pairs aren't redundant. lead-data and evidence-reader have distinct tools and jobs.

## 3. Proposed diff

Each hunk is an exact, unique span replacement. Every `-` span was checked to occur once in its file. No hunk changes a line count, so no cited line moves. The only `path:line` cites found into these files point at frontmatter lines 4–5. Long lines (architect.md:11, reviewer.md:25, worker.md:25) are shown by the changed span only.

**Hunk 1 — H1 · `.claude/agents/tester.md:12`**
```diff
- - For the ADR-003 spike, fill the Results table in `spikes/adr-003-crs-rendering/README.md` — measured value, hardware, dataset, method. A milestone without filled metrics is not done.
+ - Record every measured number in the results table or report the piece names — measured value, hardware, dataset, method. A milestone without recorded metrics is not done.
```

**Hunk 2 — H2 · `CLAUDE.md:38`**
```diff
- Perf/milestone claims: `tester` agent fills the spike results table.
+ Perf/milestone claims: `tester` agent records the measured numbers (docs/08) in the results table or report the piece names.
```

**Hunk 3 — H3 · `.claude/agents/architect.md:11`** (span within the line)
```diff
- scope creep against the roadmap (docs/07) and the current gate (ADR-003 spike)
+ scope creep against the roadmap (docs/07) and the gates it lists as open
```

**Hunk 4 — H4 · `CLAUDE.md:28`** (span within the line)
```diff
- Spike frontend is **vanilla TypeScript deliberately** — ADR-001 left React-vs-Svelte open, and a spike must not decide it.
+ The desktop shell (`frontends/shell/`) is React + TypeScript (ADR-001's 2026-08-09 amendment, scoped to the shell); `renderer/bundle-viewer` and the archived spike frontend stay dependency-free vanilla TypeScript.
```

**Hunk 5a — H5 · `.claude/agents/architect.md:11`** (span within the line)
```diff
- (`node scripts/plan/verify-quotes.mjs` once it is on main)
+ (`node scripts/plan/verify-quotes.mjs`)
```

**Hunk 5b — H5 · `.claude/agents/reviewer.md:25`** (span within the line)
```diff
- (`node scripts/plan/verify-quotes.mjs` once it is on main)
+ (`node scripts/plan/verify-quotes.mjs`)
```

**Hunk 6 — H6 · `.claude/agents/worker.md:25`** (span within the line, including its leading space)
```diff
- run `node scripts/plan/verify-quotes.mjs --show-cites <the files you changed>` (or the same script from `governance/verify-quotes` until it is on main) and read
+ run `node scripts/plan/verify-quotes.mjs --show-cites <the files you changed>` and read
```

**Hunk 7 — M1 · `CLAUDE.md:23`**
```diff
- - `.claude/agents/` — architect (constitution review), reviewer (code review), tester (benchmarks)
+ - `.claude/agents/` — subagent definitions; each file's frontmatter carries its routing description, tools, model and effort
```

**Hunk 8 — M2 · `CLAUDE.md:38`** (span within the line)
```diff
- Commit style: `<type>: <summary>` (feat/fix/chore/spike/docs).
+ Commit style: `<type>(<scope>): <summary>`, the scope optional (feat/fix/docs/test/ci/style/chore/spike).
```

**Hunk 9a — M3 · `CLAUDE.md:8`** (span within the line)
```diff
- — kernel, engine, and renderer modules may now begin against that architecture,
+ — the kernel, engine and renderer modules are built against that architecture,
```

**Hunk 9b — M3 · `CLAUDE.md:24`** (span within the line)
```diff
- The ADR-003 gate that blocked these has concluded; they may now be built against docs/02's module map. **Scaffolded per vertical slice, as the slice needs them** (07), not created empty up front.
+ Each is built against docs/02's module map and **scaffolded per vertical slice, as the slice needs it** (07), never created empty up front.
```

**Hunk 10 — M4 · `CLAUDE.md:8`** (span within the line)
```diff
- ; **note, 2026-09-07: the repository has been public since 2026-08-03, before that acceptance — "before any public code" did not hold in fact; see ADR-009's corrigendum**)
+ ; **the repository is public, and has been since 2026-08-03, before that acceptance — see ADR-009's corrigendum**)
```

**Hunk 11 — M5 · `.claude/agents/reviewer.md:16`**
```diff
- 6. Float precision: projected coordinates (~10⁶ m) reaching float32 without offset-relative handling (ADR-003).
+ 6. Float precision: projected coordinates (~10⁶ m) reaching float32 without offset-relative handling — the origin subtracted in f64 before narrowing to f32 (ADR-010 rule 3; measured in the ADR-003 spike's M2).
```

**Hunk 12 — M6 · `.claude/agents/worker.md:29`** (span within the line)
```diff
- Report format, hard limit ~20 lines:
+ Report format — results and pointers, not logs (the caller grep and the report additions above included):
```

Applying hunks 3, 5a, 5b and 6 doesn't touch any quoted or byte-copied span on those lines. All of the replacement text is outside quotation marks.

## 4. Verification

- **Each stale-fact finding was checked against the repository, not by asking a model.** The evidence:
  - ADR-003's and ADR-001's status and amendment text, and `docs/07_Roadmap.md:15` and `:26`
  - `RELEASE-0.1.md:26`
  - `frontends/shell/package.json`, and the existence of `renderer/bundle-viewer`
  - `git ls-files` and the branch list for verify-quotes
  - `git log` for the commit-subject tally
  - `git blame` for each line's age
- **Before committing any hunk:**
  - Run `node scripts/plan/verify-quotes.mjs`. Every `.claude/agents/*.md` is hash-scanned, and the files sit on `governance-ci.yml`'s path filter, so a push that touches them runs that job.
  - Read main's CI after the push.
- **Worth one behavioral probe (M6):** dispatch a worker on a small piece before and after hunk 12, and check that the hand-back keeps every required item without the cap.
- **Not re-checked:** the sha256 values inside the agent files (CI checks them), and the provided skills' prose beyond the signal greps.
