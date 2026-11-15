# The human's message of 2026-11-05 to the main architect: Part 1, rulings on gate rounds, applying from this message (sentences about behaviour written after the code; a pass with words, PASS WITH NOTES marked WORDS-ONLY; a correction checked as new work; readiness by the full suite at the reviewed head; one review candidate; findings carrying their closure; tests at real boundaries; the stacked-PR trial; the reviewer's reliance on CI not yet; the measurement); Part 2, the review packet, a design to develop into one consult; Part 3, filed items not yet built, and its two additions

*Filed verbatim by the custodian, as the message's own filing line asks: from its first line to the line before the Appendix A marker (166 lines), byte-copied by script from the human's file in the advisory folder, `2026-11-05-main-architect-gate-rounds-review-packet-open-designs.md` (49795 bytes, sha256 e768347c8484f60ed185583096bdfc09fb61e92877b73aecccbf2bb800247518, modified 2026-11-05T16:19Z). Appendix A, the rest of that file, is filed byte for byte at `state/consults/2026-10-24-gate-failures-since-10-11-advisor.md` (35173 bytes, sha256 32f7a785bcb5a06c6c72e5bc65af1d0045cc69695e55c701ffd99840ce1a0426, both as the message states), a consult and not a ruling. Nothing in the text names another project or a profile path. The RULED block in governance/DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---

To the main architect, 2026-11-05.

This one message holds everything we have designed that is not yet built:
- Part 1: rulings on gate rounds. I wrote them on 2026-10-24 to go with piece E, but they never reached main. They apply from this message.
- Part 2: the review packet. It is a design to develop into one consult before anything is built.
- Part 3: what is already filed and not yet built. It stays as filed. It is listed so that this message holds the whole picture, and it ends with the two additions this message makes.
- Appendix A: the gate-failure consult that Part 1 rests on. It never reached main either.

My words here are the authority for Part 1's rulings, for Part 2's scope and for Part 3's two additions. Everything else Part 3 lists keeps the authority of its filed record. Each merge is my click.

Filing, before anything cites either:
- This message, from its first line to the line before the Appendix A marker, the usual way, straight to main.
- Appendix A, from the line after its marker to the end of the file. Take it from this message's file in my advisory folder (2026-11-05-main-architect-gate-rounds-review-packet-open-designs.md), not from a pasted copy. It goes to state/consults/2026-10-24-gate-failures-since-10-11-advisor.md (35,173 bytes, sha256 32f7a785bcb5a06c6c72e5bc65af1d0045cc69695e55c701ffd99840ce1a0426). It is a consult, not a ruling. If its bytes, size or hash differ, stop that filing and tell me. Never reconstruct it.


PART 1. Gate rounds

The baseline, from the consult in Appendix A: from 2026-10-11 to 2026-10-24, 35 rounds failed. They caused 7.6 hours of re-gates and 31.5 hours from a failing round to the next attempt. About half of the failures found real defects in code or in tests (27 of 56); that part stays. The rest came mostly from untrue sentences written before the code, and from corrections that broke something new.

These rulings apply from this message. Every dispatch and gate brief carries them by reference until E1 maps them into records. They add no agent, no gate and no report. Items 2 and 4 differ from the 2026-10-24 draft: item 2 adds no new verdict to the gate log, and item 4 makes the suite, not CI, the condition for dispatching a gate.

1. Sentences about behaviour are written after the code.
   - A form says what such a sentence must cover.
   - The worker writes the sentence from the built code, and the gate checks it clause by clause against that code.
   - A sentence that is my wording comes to me with the code, already clause-checked, and I approve or replace it then.
   - This replaces item e of my 2026-10-11 wording rule (AUTONOMY §31), under which the architect drafted such a sentence in the form.
2. A pass with words.
   - A gate whose only blocking findings are sentences, each with replacement words the gate supplied, passes. It records PASS WITH NOTES, and its note carries the marker WORDS-ONLY. The gate log keeps its four verdicts.
   - The words are applied before the merge, as now.
   - It never covers my wording or red-line texts.
   - In the gate log and the health strip it does not count as passing first time, as for any PASS WITH NOTES.
3. A correction is checked as new work before its re-gate:
   - the full suite at the new head;
   - one mutation for each new or changed test, applied, observed failing by name, and reverted;
   - the tests of everything the fix touches.
   A correction that cannot also fix a sibling case within its budget stops and reports. It does not go to the gate.
4. Readiness:
   - A gate is dispatched only when the full suite has run at the reviewed head and passed there.
   - CI green stays a condition of the merge, as now, not of the dispatch. In the consult, one of the 56 failures was CI's (row 588: GitHub API errors, no defect), and waiting for the Windows build would add its whole run time to every round.
   - Before dispatching, the custodian reads the hand-back. A disclosed unfixed sibling or gap sends the piece back to the worker, not to a gate. This is AUTONOMY §14's sibling search, enforced as written.
5. One review candidate. The dispatch brief gives both gates the same packet:
   - the base and the reviewed commit;
   - the requirements and the open decisions that apply;
   - the changed interfaces;
   - where the evidence is, with its tested revisions;
   - the known findings and their dispositions.
   Both gates review that same commit independently. A commit that arrives during a gate is named with its impact, never mixed in silently. A re-gate receives first the correction diff, the original findings and the affected tests; everything else by reference. Part 2 develops this packet.
6. Findings carry their closure.
   - Every blocking finding names the requirement it breaks, its evidence, and what would close it.
   - A preference is a note, never a new acceptance condition.
   - A re-gate checks the closure conditions and what the correction added.
7. Tests at real boundaries, applying round 4's seam rule to test doubles inside a module as well:
   - a test double imports the real interface types;
   - test inputs are built through the real producer where practical;
   - each boundary keeps one small integration test across it;
   - a dependency's error is tested in its real shape, not as an invented string.
8. A trial: the next piece over about 1,500 changed lines of non-generated code splits into stacked PRs by phase, each with its own gate round, as milestone 4 already does. I decide after the trial whether it becomes a rule.
9. Not yet: the reviewer relying on CI at the reviewed commit instead of re-running the suite. I decide once reading 2's re-run shows where gate time goes. Mutation observations stay the gates' own until I rule otherwise.

Measurement: over the 14 days after this message and against the 14 before, with the consult's method and its columns:
- failing rounds whose blockers are sentences;
- rounds that passed with words (PASS WITH NOTES marked WORDS-ONLY);
- failing rounds on what a correction added;
- re-gate hours;
- the time from a failing round to the next attempt.
The custodian classifies the new rows. If the Sonnet reviewer trial of 2026-10-28 runs in the same window, the report names the rows it covers. The report says that the figures are evidence, not proof of cause.


PART 2. The review packet: a design before anything is built

Part 1, item 5 rules the packet, assembled by hand from now. This part asks for its design, developed into one consult and brought to me. Nothing is placed, built or installed from this part, and it changes no rule.

Where it comes from. It started from an outside proposal about Entire's tools: a code graph, session capture and a memory service. That proposal is not filed, and nothing in it is to be answered. I take one idea from it, not the products: an agent working on one piece gets the facts and locations it needs for that piece, stamped with the revision they were read at, instead of reading whole ledgers and forms to find them. Our records and our readers (plan.mjs, queue.mjs, rulingSet.mjs, movedMap.mjs, the gate log) should be enough to do that without a new tool.

What we know, from reading 2 (state/consults/2026-10-24-governance-e-reading-2-transcript-tally-tester-report.md):
- The main session read about 375,000 cached tokens per response (2.89 billion over 7,700 responses). By that reading's own figures, that is about as much as all subagents together. The compact window and the fresh-session practice address that. The consult says whether the packet helps there too.
- The 20 largest tool results were all whole-file Reads of 58 to 134 KB, 14 of them by the architect. The reading recorded sizes only, so it cannot say whether those files were records or code.

A. The data first

Reading 2's re-run adds one table. It holds counts, bytes and repository-relative paths only, never file contents or message text:
- For the main session and each agent type: the count and result bytes of Read, Grep and Glob calls, and of Bash calls that run rg, grep or git grep.
- Read, Grep and Glob split by area, with old paths resolved through governance/MOVED.tsv first:
  - records: anything under governance/ or state/, and any Markdown file elsewhere;
  - code: any other file under engine/, kernel/, protocol/, renderer/, frontends/, tools/ or scripts/;
  - other files in the repository;
  - searches over the whole repository, with no path;
  - outside the repository: counted, never named.
- The 20 largest Read results, with their paths and whether each read the whole file or a range.

If the re-run has already been taken when this arrives, the table is taken over the same window as a supplement. The consult specifies the table exactly. It also proposes a threshold: the share of all tool-result bytes taken by code reads and searches below which finding code is not worth a tool. If the table is filed before the consult, the consult proposes the share without using the table and says so. I set the share before anyone reads the table against it.

B. The packet

Item 5's five parts, and one more to test: the node's recorded state and its blockers. Develop:

a. Sources. For each part: where it lives today, by path and reader, and whether a script can derive it, the hand-back must supply it, or no record holds it. A gap is reported as a gap, never filled by guesswork.

b. Shape: what is inline and what is a locator, the order, and a size budget. Over the budget, the packet says it is incomplete and names what it left out. Nothing is cut silently.

c. The rules that keep it honest, each with the failure it prevents:
   - it states the revision it read and names any uncommitted input;
   - a recorded gate result or PR locator is history, never live CI or merge status;
   - an archived ruling is a location, not a verdict, and a later date is not supersession;
   - rulings appear by locator, not by excerpt;
   - it carries facts and locations only, so no worker's account of its own correctness reaches a gate through it;
   - a missing or ambiguous link is reported, not guessed.

d. Its edges with what exists:
   - Rules for a role and a moment belong to E1's selector. The packet selects none, and it does not wait for E1.
   - session-resume.mjs and the continuity block carry the session's state. The packet carries one piece's state, without duplicating them.
   - Forms, ledgers and the gate log are read, never changed.
   - A new field in a hand-back or a form needs my ruling. The packet's first version creates none.

e. Other uses. Whether the same packet, or part of it, serves the worker's build dispatch, a correction dispatch, and the custodian's own preparation of a dispatch. Propose; do not assume. Say which of the reads in A's table it would replace.

f. A script, sketched and not built: scripts/plan/packet.mjs <node-id>, stateless, using the existing readers. The sketch covers its output, its tests, and what it costs to keep up. The tests cover a moved path, an archived ruling, a missing link, an uncommitted input, an output over budget and a re-gate.

C. The first three packets

For the first three gated pieces after this message, the custodian records, for each packet item 5 has it assemble:
- its size, and the record each part came from;
- the parts taken from the hand-back, and the parts no record held;
- the paths each gate read outside the packet (paths only, from the gate's transcript);
- anything a gate needed that the packet lacked;
- the custodian's time to assemble it.

The consult proposes which results would justify the script and which would not, without reading these figures, and says so. I set that before the figures are compared.

D. Finding code: a trigger, not a plan

Nobody drafts a form for finding code unless A's table crosses the share I set. The order is fixed now:
- rg and narrow reads, as the baseline;
- Anthropic's official code-intelligence plugins for Rust and TypeScript, next;
- a third-party code graph, only if the plugins fall short.

Any install is a dependency, so it needs my typed word. The consult only lists the code questions such a form would use, each with the evidence its answer must cite.

E. Out of scope

- Any installation.
- Session capture or transcript recording.
- Memory extraction or any memory service.
- New agents, hooks, mods or CI jobs.
- Changes to the gates, the gate log, PLAN's format, E1's design or the fresh-session practice.

The consult: one file under state/consults/, at most 15,000 bytes. It names the commit it read at, and keeps what it observed apart from what it proposes. It ends with the decisions it needs from me, each a question I can answer in a line. Governance lane, after what is already queued there; it never holds slot 1.


PART 3. Filed, not yet built

These stand as filed. Nothing here changes them except the two additions at the end.

- governance-e-readings (blocked):
  - reading 1 is mine: /context once in your session, partway through a piece;
  - reading 2's re-run, on three days of transcripts written on 2.1.312 or later, before E1 uses it (addendum 2);
  - the auto-compact window, 300,000 since 2026-10-28, measured again by reading 2's method (addendum 2).
- The Sonnet reviewer trial (2026-10-28, item 6, option b): a second reviewer definition on Sonnet at high effort, for single-gate pieces only, ten pieces. It is not on main at 93187222. Its baseline is the gate log's gate-failure figures, which Appendix A now gives a filed source.
- governance-e1-rules-as-records (blocked on reading 2's re-run): the rule records, the selector, the generator and the check; lead-data's three duties; worker-high and tester-high as reading 3 decides; the measurement at its merge. Its inputs are as filed: the advisor's audit, the prompt audit of 2026-10-04, and the E1 drafts filed on 2026-11-03 and 2026-11-05.
- governance-e3-module-claude-md, now path-scoped rules under .claude/rules/ after a sibling-worktree loading test (addendum 2); governance-e4-rulebook-into-records; governance-rule-inactivity-list. All proposed; none is placed before I have seen E1's measurement.
- governance-f-after-week-rust-ci-figure: ready after 2026-11-07.

The two additions:
1. Reading 2's re-run carries Part 2's table (Part 2, A).
2. E1's content (piece E, E1 item 5, now "the rules in the eight agent definitions only") also maps Part 1's rulings sentence by sentence, with the same marks.

