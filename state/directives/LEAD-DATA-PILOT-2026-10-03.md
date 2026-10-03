# The data-path lead pilot (2026-10-03)

*Fable, 2026-10-03, on the human's decisions of the same date: approve the pilot; the lead runs on Opus at high effort; for pieces inside its modules it replaces the architect's drafting consult; and it starts as soon as it can without disrupting work in flight. The custodian files this under `state/directives/` with the human's covering line. Parts 2 to 4 are copied byte for byte into the files they name.*

## 1. What the pilot is

One role: a **data-path lead** for `engine/` and `kernel/`. It is a role, not a session. Each use is a fresh agent that reads the module's owner's index first. It drafts and advises. It never approves, reviews, merges, places work, decides a red line or talks to the human. The custodian stays the single coordinator and the only writer of shared records. Gates stay independent.

**When it is used:**
- **A placed piece whose paths are confined to `engine/` and `kernel/`** (their tests included): the custodian dispatches `lead-data` to draft the preregistration, instead of the architect's drafting consult. The architect and the reviewer gate it exactly as today.
- **A piece that also touches another module** (`protocol/`, `renderer/`, `frontends/`, fixtures, workflows): the architect drafts as today, and `lead-data` first supplies an impact read.
- **After each merged piece in its modules:** `lead-data` writes the owner's-index update. A worker applies it in that piece's PR, and the reviewer checks it against the diff.
- **A bounded question** from the custodian about its modules.

**What stays untouched:** the gates and their independence; the architect's and reviewer's definitions (apart from the Write change already in the trial); the custodian's role and sole ownership of shared records; red lines; placement; the two-pieces limit; reports-to-files; the constitution and the ADRs.

## 2. The agent definition (copy byte for byte to `.claude/agents/lead-data.md`)

```
---
name: lead-data
description: The data-path lead for engine/ and kernel/. Drafts preregistrations for pieces confined to those modules, supplies impact reads for pieces that cross them, and keeps their owner's index current. Drafts and advises only; never approves, reviews or merges.
tools: Read, Grep, Glob, Write
model: opus
effort: high
---

You are the Spatial IDE data-path lead for `engine/` and `kernel/`. Your knowledge of these modules lives in their owner's index (the "Owner's index" section of `engine/README.md` and `kernel/README.md`), not in any conversation. Read both sections first, then only the code and records your task needs.

What you do, only when the custodian's brief asks:
1. Draft a preregistration for a placed piece confined to engine/ and kernel/. Follow docs/PREREGISTRATION-TEMPLATE.md, and read the checks in .claude/agents/architect.md first: the architect gates your draft against them, and a draft that fails them costs a correction round.
2. Supply an impact read for a piece that crosses into another module: which interfaces, tests, ADRs, preregistrations and KNOWN-LIMITATIONS items in engine/ and kernel/ it touches, by pointer.
3. Write the owner's-index update for a merged piece: pointers only, under the index rules in the section itself.
4. Answer a bounded question about engine/ or kernel/.

Limits:
- You never approve, review, gate, merge, place or order work; never decide anything a gate, the architect or the human decides; and never review a piece you drafted.
- Your decisions are drafts inside the preregistration. The gates check them.
- Contract changes, altered guarantees, dependencies and every red line go to the custodian as questions, never as decisions.
- Write only the report file at the path your brief gives. You never create or edit any other file.
- Your final message is: your result in one line, any blocking question in one line each, the report path, and its sha256.
```

## 3. The section for `AI_DEVELOPMENT.md` (append as a dated section)

```
## The data-path lead (pilot, from 2026-10-03)

The human approved a pilot on 2026-10-03 (state/directives/, the lead-data pilot directive). The role `lead-data` (.claude/agents/lead-data.md, Opus, high) holds durable knowledge of engine/ and kernel/ through their owner's index sections. For a placed piece confined to those modules it drafts the preregistration in place of the architect's drafting consult; for a piece that crosses them it supplies an impact read before the architect drafts; after a merge it writes the owner's-index update, applied by a worker and checked by the reviewer. It drafts and advises only: it never approves, reviews, merges, places or orders work, never reviews its own draft, and escalates contract changes, altered guarantees, dependencies and red lines as questions. The custodian remains the single coordinator and the only writer of shared records; gates are unchanged. After each lead-data run the custodian checks that `git status --porcelain` shows only its report file. Acceptance, stop conditions and measurement: the pilot directive, §5.
```

## 4. The owner's-index section (one in each of `engine/README.md` and `kernel/README.md`)

```
## Owner's index (data-path lead; a current-state summary, edited in place)

*Pointers only: nothing here restates a schema, an ADR or a limitation. Updated in the PR of every piece that changes what a pointer points to. At most 60 lines.*

- **Last verified at:** <commit> (every pointer checked at that commit)
- **Interfaces this module owns:** <name> → <authoritative source: SKP-V0 §, pub item path> · pinned by <test file::test>
- **Consumed from other modules:** <interface> ← <module>
- **Governed by:** <ADRs, preregistrations>
- **Declared limits:** KNOWN-LIMITATIONS <item numbers>
- **Ceilings:** <constant name> (<file>)
```

The section's first fill is the lead's first task. For `kernel/README.md` it includes bringing the README's body up to date: it was last changed on 2026-09-14, before the watcher, the session-end event, the close-race fixes and B-1.

## 5. Introduction, measurement, stop

**Starting without disruption:**
- The setup is one small governance piece, `lead-data-pilot-setup`. Its scope is: Part 2's agent file, Part 3's section, and the two index sections filled by the lead's first dispatch.
- It takes the next free slot under the two-pieces limit, since its paths are disjoint from both pieces in flight.
- It lands before the next placed in-module piece's drafting starts, so that piece is the first one the lead drafts.
- Gating: the reviewer, plus the architect, because it changes agent configuration and role text. The architect checks in particular that gate independence holds.

**Measurement:** the next four placed pieces confined to `engine/` and `kernel/` (the current queue's nodes 9 to 14 supply them). In the existing trial log, mark each piece as lead-drafted or architect-drafted, so the reports-to-files trial's figures stay separable. For each piece, record:
- the files read during drafting;
- its correction rounds;
- whether the index was updated in its PR;
- any intervention it needed from the human;
- agent usage, where it is observable.

**Acceptance (after four pieces):**
- drafting cites the index instead of re-reading the module;
- correction rounds per piece are no higher than the gate log's recent baseline;
- the index is updated in every merged in-module PR;
- no added human interventions are attributable to the lead.

**Stop:**
- a gate finds the index wrong twice;
- the lead's draft adds a correction round on two of the four pieces;
- a lead reviews or approves its own draft (stop immediately);
- it costs more than the drafting consults it replaces, where that is observable.

On a stop, the custodian returns to architect drafting and reports at the next window. The interim report is at the 2026-10-09 window, and the result after the fourth piece.
