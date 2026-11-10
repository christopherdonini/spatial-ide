# 2026-10-24: governance piece E, rules as records: the readings before E1's form, E1 (a rule catalogue, a selector, a generator and a check), the later pieces, the PRECEDENTS re-pin now, a fresh-session practice, and an addendum — the human, verbatim

*Custodian's filing note (2026-10-24): the human's typed message, sent while the custodian's turn was running and queued at 15:27:55Z on 2026-10-24 by the transcript. It has no user record, so its text is byte-copied by script from the queued_command attachment (origin human), below the rule from line 6. One final newline is added and nothing else is changed. It names no other project. The advisor's audit it names was copied from the human's advisory folder byte for byte to `state/consults/2026-10-24-agent-briefs-rulebook-audit-advisor.md` (24,056 bytes, sha256 bdcf46d07d594c159fb7531ca5479c56defb3be55dd61efb21039f04e358bbc7, both checked by script before the copy); it is a consult, not a ruling. **Its addendum is superseded:** the human withdrew and replaced it by a correction headed 2026-10-25, queued at 15:32:36Z (`state/directives/2026-10-24-governance-piece-e-addendum-corrected.md`); the addendum stays below as it was sent, not edited.*

---
Governance piece E: rules as records. The rules now spread through the agent definitions move into one small file per rule. Each agent then receives only the rules for its role and for the moment it is working in, and a check catches a rule whose facts have changed. Governance lane, after what is already queued there; it never holds slot 1. My words here are the authority for the format and the procedures E adds, never for a rule's content: each rule keeps the authority it came from. Each merge is my click.

File this message and the advisor's audit the usual way, straight to main as records, before any record cites them. The audit goes at state/consults/2026-10-24-agent-briefs-rulebook-audit-advisor.md (sha256 bdcf46d07d594c159fb7531ca5479c56defb3be55dd61efb21039f04e358bbc7, 24,056 bytes). It is a consult, not a ruling. If the attached file is missing, or its sha256 or byte size differ, stop the filing step and tell me. Never reconstruct it.

Readings before E1's form. Only their reports under state/consults/ are committed.
1. /context once in a custodian session, partway through a piece: what is loaded all the time, and the largest tool results.
2. A read-only tally of this project's own transcripts on this machine over the last 14 days: tokens by session and by agent type, and the 20 largest tool results by size. Counts only, no message text. This project's transcripts only.
3. From the installed Claude Code (claude --version) and its documentation:
   - whether /clear starts a new session id;
   - whether a dispatch here sets effort per call for these subagents, and whether CLAUDE_CODE_EFFORT_LEVEL is set in this environment;
   - whether a CLAUDE.md in a subfolder loads when an agent reads a file there, subagents included.
4. The instructions one ordinary worker dispatch and one reviewer dispatch actually receive today, in bytes: the agent definition, CLAUDE.md, and the rule text pasted into the dispatch.

E1, one piece, full form. Keep it small: a rule catalogue, a selector and a generator.
1. Records:
   - rules/<id>.md: one rule per file, named by its id, at most 25 lines and 1,500 bytes. Frontmatter in the YAML subset PLAN.yaml uses, so no new dependency.
   - The fields:
     - id;
     - status (active or retired);
     - applies_to (roles);
     - when (moments from a fixed list, "always" among them);
     - paths (optional globs);
     - source (the ruling it came from, by round and item, or a directive pinned at a main commit with its hash);
     - supersedes and superseded_by (lists);
     - assumes, limited to three typed facts: a file exists, an ADR's status line, an agent definition exists;
     - enforced_by (a hook, script or test, or none).
   - The text is the rule in current words, marked as a paraphrase. My verbatim words stay where they are filed.
   - A change to a rule's text, applies_to, when, paths or status changes its meaning. It needs my ruling, as a new record that retires the old one. Only wording that keeps the meaning is edited in place.
   - A rule may be retired without a successor when a ruling of mine is cited for it.
   - A retired rule moves whole to state/cut-archive/rules/<id>.md, so a default search never meets it. It keeps its original source and adds the ruling that retired it.
   - Rules are cited by id, never by line.
2. scripts/plan/rules.mjs:
   - selects by role and moment, and optionally by path;
   - always includes the role's "always" rules alongside the moment asked for;
   - without --path, includes every path-scoped rule for that role and moment rather than leaving it out;
   - fails by name on an unknown role or moment;
   - prints each matching active rule once, ordered by a fixed order of moments and then by id;
   - offers a keyword search for exploring only, never for deciding which rules a dispatch must carry;
   - --unenforced lists the active rules nothing enforces.
3. A check in governance-ci that fails by name on:
   - a schema error, a duplicate id, or a file over either cap;
   - a supersession link that is missing, not reciprocal, or part of a cycle;
   - an active rule's typed assumption that does not hold in the tree being validated (the PR's head in a PR, main on main);
   - a source hash that does not recompute at its pinned revision;
   - a generated block that is not current;
   - a rule cited by line.
   Assumptions are not checked for retired rules. The check does not claim to prove that a paraphrase keeps its meaning, that two rules never conflict, or that an agent obeyed them. Each failure gets a negative test and a mutation.
4. Selective loading:
   - An agent definition holds its frontmatter, a hand-written header kept in a small template, and one generated block after the frontmatter, marked as generated where it starts and where it ends. The block carries only the role's identity and its "always" rules.
   - The rules for a moment go into the dispatch for that moment, selected by role and moment with the script.
   - When an agent's work moves to a new moment (for example, an implementation worker now has a record to correct), the next dispatch carries that moment's rules.
   - Record-correction rules go only into a record-correction dispatch.
5. Content: the rules in the eight agent definitions only, mapped sentence by sentence from the audit's sections 2 and 3. Each row is marked kept, moment-only, record-correction only, or retired as stale, with its reason and its source. The architect drafts the records. I approve the generated definitions and the mapping in the PR, because what a gate checks is mine. A row marked retired as stale takes effect only through my explicit approval of that row.
6. lead-data stays, with three duties:
   - the owner's indexes of engine/ and kernel/;
   - bounded questions and diagnoses on those modules;
   - a form draft only when I ask for one, as on 2026-10-23.
   This replaces "the lead never drafts" in the recommendation of 2026-10-11. AI_DEVELOPMENT's pilot section gets one pointer to the rule.
7. worker-high and tester-high are retired if reading 3 shows that a dispatch here sets effort per call and nothing in the environment overrides it. Otherwise they stay.
8. From E1's merge, AUTONOMY.md, AI_DEVELOPMENT.md and PRECEDENTS.md take no new rules. One section appended to AUTONOMY says so, and lists the statements in the audit's section 5, each with what replaced it. Nothing above that section is edited.
9. Measurement:
   - reading 4 again at E1's merge;
   - from the gate log, the gate first-pass rate and the gate runs per node over the ten gated pieces before E1 and the ten after.
   The gate figures are evidence, not proof of cause, because the pieces differ. The report says so, and no further evaluation is added.

Later, each its own small piece, in this order. None is placed until I have seen E1's measurement.
- E3: product rules by module, if reading 3 confirms on-demand loading. A small generated CLAUDE.md in engine/, kernel/, protocol/, renderer/ and frontends/shell/, from the rules whose paths match. The reviewer's product checklist stays in its definition.
- E4: the rest of AUTONOMY, AI_DEVELOPMENT and PRECEDENTS move into records, each rule when it is next touched or cited.
- A weekly inactivity list, built from existing records only: rules whose moment shows no occurrence in four weeks, or "unknown" where no record shows the moment. It flags rules to look at, never rules to retire.

The gate log stays as it is. It already holds one record per line, only main appends to it, and its row numbers are cited throughout the records.

Mechanical, in a commit of its own, now: re-pin the seven PRECEDENTS cites into AI_DEVELOPMENT that the audit's section 5 lists. A re-pin that needs a reading rather than a lookup comes to me.

A practice once reading 3 is in, for a fresh session between pieces:
1. No subagent is running, and every hand-back is filed, for every piece in flight.
2. Flush and push.
3. If /clear gives a new session id: the outgoing session records the handover and relinquishes its lease, as AI_DEVELOPMENT's handover procedure requires, and verifies that this is pushed. All of this happens before /clear.
4. /clear.
5. If the id changed, the incoming session verifies the relinquish and the origin tip, then writes its own lease.
6. Only then does it dispatch or write.
If /clear keeps the same id, no handover is needed. My standing word: at such a checkpoint, the handover may happen without the 30-minute wait.

Out of scope: PLAN.yaml's format, one file per PLAN node, the CI-built site and DECISIONS-PENDING's shape.

Addendum to piece E.
The three typed assumptions are strings in a fixed grammar the check parses (file-exists: <path>; adr-status: <ADR> <status>; agent-exists: <role>), because the YAML subset holds no nested maps in lists. The moments are fixed in E1's form: always, draft, build, correct-record, gate-architect, gate-reviewer, test-run, consult; a dispatch naming none carries the always block alone, and a dispatch template naming another word fails the check. Reading 4's second measurement, and every later regeneration, is read from a fresh session, because agent definitions load at session start. A procedure longer than a rule lives in scripts/plan/README.md, and a rule record points at it; AUTONOMY takes neither. Reading 2 opens this project's transcript directory alone and names it in its report.

Audit file in the advisor folder: 2026-10-24-agent-briefs-rulebook-audit-advisor.md
