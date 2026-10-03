# Rounds 43 and 44 — context (2026-10-03)

*The custodian's context for two consecutive `AskUserQuestion` rounds. Each item names its source; nothing here is a ruling.*

## Round 43

### 1. Node 10's O-1: case (b), `NULL - 0.5 > 0`

- **Sources.** The lead-data draft, `state/consults/2026-10-03-type-walk-null-literal-arithmetic-lead-data-draft.md` (§2.3, O-1). The architect's consult, `state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-consult.md` (its O-1 section).
- **The facts.** The predicate has no column. Its value is a constant NULL, so nothing is read from the file and nothing can round or fail. Today it is refused `conversion_rounds`, and lead-data's draft would refuse it `conversion_can_fail`. By the consult, both of those sentences, which the human typed as T-C, are false of this case.
- **The options:**
  - **(iii) Admit it,** narrowly, under ADR-021's Note item 2: a rule-2 result over a decimal literal within the bounds counts as that literal for comparison rules 4 and 6. No sentence is needed and nothing changes on the wire. It is a reading of human-accepted ADR text, it makes the piece crossing (the architect drafts it), and the node's title changes. This is the consult's recommendation.
  - **(iv) A sixth reason,** with a new sentence the human types. It is true by construction, but it is a wire change (the five-value set, the literal, and the fixtures). It is the heaviest option, and the node excludes it.
  - **(i) Keep `conversion_rounds`,** accepting a known-false message for this shape, recorded as a known limitation.
- **Who rules.** The precedent is the predecessor's O-3: Fable ruled it, relayed by the human.

### 2. The lead-data pilot's §5 stop

- **The rule.** The pilot stops if the lead's draft adds a correction round on two of the four measured pieces (`state/directives/LEAD-DATA-PILOT-2026-10-03.md` §5).
- **Node 9** had its draft-caused rounds, including a consult-driven draft 2 before commit.
- **Node 10.** The consult found two draft defects that need a correction before commit: a false grep claim, and the reasoning for case (d). The custodian classes this as draft-caused, the second piece, so the stop condition is met.
- **Applied:** drafting returns to the architect, from node 10's next draft on.
- **The alternative reading.** The correction is not yet made, and under (iii) or (iv) the architect drafts anyway. On that reading this round is not counted, and pieces 3 and 4 stay lead-drafted.
- **The pilot log** is `state/drafts/weekly-window-2026-10-09.md`, B2.

### 3. Guardian O-1: G5's route (the profile-path refusal)

- **Source.** `state/consults/2026-10-03-guardian-v0-architect-draft.md`, §2.6 and O-1.
- **The problem.** A mod cannot import the repository's scanner, and the scanner reads content only from a file.
- **The options:**
  - **(c) G5 leaves v0.** A scanner stdin mode is proposed as a follow-up node. The commit hooks and the CI backstop already refuse a profile path before it reaches history. This is the architect's recommendation.
  - **(a) A stdin mode for the scanner first,** in its own piece under the exposure form, then G5 calls it.
  - **(b) A scratch file,** which the mod writes and the scanner reads. That is a write by a refuse-only mod.

### 4. Guardian O-2: G6, the report-only subagents' write scope

- **The facts.** The build's types say a subagent's tool calls carry its id. Confirming it needs a live session with the mod loaded, which only the human can run, after install.
- **The options:**
  - **(a) Keep G6,** on reads only. Lead-data briefs carry a `REPORT PATH:` line from install, and live check E5 runs after install. If live shows no id, G6 is removed by amendment. The write audit stays primary until E5 passes. This is the architect's recommendation.
  - **(b) Drop G6 from v0,** the brief's own fallback. The write audit stays primary.

## Round 44

### 5. Guardian O-3 to O-8, the architect's recommendations as a set

Each is in the draft's OPEN list:
- **O-3:** read the brief's item 7 so that `$.fs.stat`, `$.fs.read`, `$.agent.list`, `$.session.messages` and `$.session.usage` count as reads, process calls are held to `git` by review and a test, and there is no `$.store`.
- **O-4:** N1 triggers on the Stop hook's stale-block test. The brief's literal condition is true after every commit.
- **O-5:** N1's line reaches the model through the hidden `context` field, which the human does not see.
- **O-6:** N1 measures against the compaction window, if a local call gives it, else the status line's percentage, with the limit disclosed.
- **O-7:** extend G2 to G4 and G6 to MultiEdit and NotebookEdit, if the build types them.
- **O-8:** G3 admits an Edit that only appends at the end of a filed preregistration.

### 6. The write-audit form's "Mutations added" bullet

- **Source.** `DECISIONS-PENDING.md`, the OPEN 2026-10-03 entry.
- **The recommendation.** Let it stand unclassed, as a record of fact, with the ruling as its reference. No new class is made, and no line of the form changes.
