# Human directive, 2026-09-17 — dispatch efficiency (verbatim)

*Recorded by the custodian from the human's message of 2026-09-17 (session `session_01JeU7h98xrTorztiep3Zgmg`). The policy text below is the human's, verbatim; the custodian's compliance notes follow it and are marked as such. This is a standing directive, not a pending decision; the concise operating rule it yields is proposed for `AI_DEVELOPMENT.md` and the agent briefs separately, for the human's approval.*

---

I want to improve our development efficiency without weakening reasoning, correctness, or the existing acceptance gates.
A read-only audit of approximately 16–17 September found 2,585 model requests, 26 active subagent logs, and 25 agent launches—all explicitly requesting Opus. Worker and tester definitions specify Sonnet, but dispatch overrides bypassed those defaults. The three largest implementation workers had median contexts of roughly 407k–542k tokens and accounted for 72% of cached-input traffic. These are local usage observations, not a conversion into Anthropic's weekly allowance.
The work is valuable. The target is avoidable model escalation, oversized context, repeated exploration and repair—not less scrutiny.
Apply the following policy to future dispatches. Let currently running work reach a safe checkpoint; do not interrupt a valid measurement, discard work, or weaken an accepted preregistration.
1. Honour model defaults; escalate deliberately
Read the current agent definitions and respect their configured models. Do not automatically pass an Opus override when spawning a worker or tester.
An override is appropriate when:
The specific task has a clearly identified reasoning difficulty or correctness risk that warrants it.
A worker is blocked by reasoning or design complexity after focused diagnosis.
A previous attempt exposed a limitation that a stronger model could plausibly address.
A failed build, missing dependency, unfamiliar file, routine test run, or ordinary review correction is not by itself a reason to escalate.
You may escalate autonomously when justified. Record one short line in the existing dispatch/report: the default, the override, and the concrete reason. No new approval ceremony or separate document.
Escalations are task-local, not permanent defaults. Keep architect/reviewer models as configured. Verify actual model selection where available; a requested setting is not proof of the model used.
2. Match reasoning effort to the work
Do not apply extra-high effort indiscriminately.
Preserve deep reasoning for architecture, numerical precision, concurrency, cancellation, identity, security, difficult diagnosis and final correctness judgments. Use ordinary effort for routine coordination, mechanical edits and straightforward verification where the installed tooling supports task-local effort control.
Do not force low effort onto a difficult problem to save tokens. If task-local controls are unavailable, say so rather than pretending they were applied or changing account-wide settings silently.
3. Give workers bounded, complete assignments
Each dispatch should identify:
The concrete deliverable and non-goals.
The authoritative requirements and relevant files.
The real producer/consumer interfaces to inspect before coding.
The tests and evidence required for completion.
The conditions for returning a blocker rather than improvising.
Provide enough context to reason correctly, not the entire project history. Summaries guide navigation; binding requirements and actual interfaces must still be read.
Prefer one cohesive implementation piece per worker. Do not split tightly coupled reasoning into many tiny agents merely to reduce individual context sizes.
4. Manage context at natural checkpoints
Do not routinely carry a worker's implementation history through unrelated phases and repeated repair campaigns.
At a completed phase or a clear change of scope, consider a fresh worker or compaction with a concise, verified handoff:
Branch/worktree and commit.
Existing uncommitted work and its ownership.
Decisions and invariants that remain binding.
What was actually verified.
Exact remaining findings and next action.
Links to evidence, without copying full logs.
Treat roughly 100k–200k tokens as an initial checkpoint for asking whether accumulated context is still useful—not a hard ceiling. Continuing a coherent difficult task may be the better choice. Avoid repeated compaction, which also costs tokens and can lose important detail.
5. Reduce repeated reading and polling
Use targeted searches and relevant sections before dumping entire large files. Read complete governing documents where required, but do not repeatedly reload unchanged material already understood.
Keep full test logs available as evidence; normally return exit status, relevant failures and a concise summary to the model. Expand to full output when diagnosis requires it.
Use completion notifications or bounded waits where supported. Avoid repeatedly waking a large-context model merely to ask whether an unchanged build has finished. Keep genuine hang detection and user-visible progress.
Keep current instructions concise and distinguish them from historical records. Do not delete decision history to save context.
6. Prevent repeat failures before expensive reviews
Before requesting a gate, the worker should check the known failure classes:
Cross-module code uses the interface the other side actually exposes.
Completion claims point to evidence that exists and proves the claim.
User-facing messages describe behaviour implemented at that commit.
Required tests reach their intended assertions, not merely their setup.
Prefer existing scripts and focused checks. Add mechanical protection where it genuinely prevents recurrence, rather than repeatedly asking reviewers to rediscover the same issue.
Batch related corrections before re-review. Provide the exact diff, prior findings, their disposition and fresh evidence. Keep every currently required gate; any change to review scope or acceptance obligations requires an explicit proposal, not an efficiency shortcut.
A repeat failure of the same class should trigger diagnosis of the brief, interface assumptions or test mechanism—not another identical attempt by default.
7. Keep efficiency reporting lightweight and honest
Use existing completion reports. Briefly record model overrides, significant rework, and any context handoff. Include usage figures only when readily available, labelled as local token evidence rather than subscription percentages.
Judge efficiency by completed, verified outcomes—not fewer tokens alone. Pilot cheaper execution on a suitable bounded piece and assess whether extra retries erase the saving.
Do not create a token-governance bureaucracy, launch additional audit agents, or rerun completed suites solely to produce an efficiency report.
Apply this policy to future dispatches now. For durable enforcement, propose the smallest project-scoped instruction/configuration changes for my approval. Do not change global settings, the product constitution, accepted gates, or product behaviour under this request.

---

## Custodian's compliance notes (not the human's text)

- **Defaults found (`.claude/agents/*.md` frontmatter, 2026-09-17):** worker `sonnet`, tester `sonnet`, reviewer `opus`, architect `opus`. Every worker and tester dispatch of 16–17 September passed `model: "opus"`; the origin is a memory note from 2026-09-08 (worker subagents on `claude-sonnet-5` died with `oauth_org_not_allowed`), never re-verified since.
- **Dispatch from now on:** no model override on workers or testers by default; the first bounded worker piece pilots the configured default and the report records the model observed; an override only for a named reasoning/correctness risk, a diagnosed block, or a limitation a previous attempt exposed — one line in the dispatch and the report (default → override → reason). Reviewer and architect stay as configured.
- **Effort:** the Agent tool available to this session has no per-dispatch effort control (its parameters are description, prompt, subagent_type, model, isolation); subagent transcripts show an inherited `xhigh`. Stated here rather than pretended; no account-wide setting is touched.
- **Context checkpoints:** the three largest workers of this window ran to ~600k–750k tokens across repair rounds; from now on a completed phase or a change of scope (build → gate corrections → E2E run) is a handoff point with the six-line verified handoff, and a fresh worker is the default at the second repair round.
- **Pre-gate self-check** (the four failure classes above) goes into the worker brief's report format; corrections are batched into one round with prior findings and their disposition before any re-review.
