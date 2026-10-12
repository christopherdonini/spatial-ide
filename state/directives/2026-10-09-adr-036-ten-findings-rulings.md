# Rulings — ADR-036's ten findings: it stays Proposed and is accepted with piece 1c's amendments; the project file's line-oriented form; the route; notes for 1c's form (the human, verbatim)

*Custodian's filing note (2026-10-09): typed by the human as a new message, received mid-turn at 05:18:25Z by the transcript (its queued-command record, origin human). Below the rule, byte-copied by script from that record, is the message (from line 6 to the end). Its 30 CRLF line endings are stored as LF under the repository's line-ending policy, and one final newline is added; nothing else is changed. It answers the architect's consult `state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md` (the ten findings). Its last three paragraphs restate three sentences of the message: ruling 8's second sentence, ruling 5's barrier sentence, and the first note for 1c's form; each restatement governs over the sentence it restates. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
ADR-036, my rulings on the ten findings. The ADR stays Proposed. I will accept it together with piece 1c's amendments, before 1c merges.

1. Containment: the resolver refuses every symbolic link and junction below the project folder. A file kept by a cloud-sync service is not a link and must open; 1c tests a project folder under OneDrive on the reference machine before choosing how. My OPEN-7 carrying rule now reads: a project-relative locator where the data is inside the folder, reached without a link, and its path has a canonical form.

2. The project file is named project.spatial: a fixed name, with content that stays JSON in one canonical byte form, the line-oriented form below. Before acceptance, check that no common application claims .spatial. File association and single instance are a later piece, and that dependency stays my typed word. 1c's form proposes what a second open of an identity already open on this machine does; my lean is to refuse it by name.

3. Session-history recovery keeps the longest valid prefix: lines that end in LF, hold no NUL, parse, and chain. The chain follows restored marks. The first failing line is named and nothing after it is replayed. No per-line check member.

4. Different saves: the project file records the lineage file's sha256 and step count, and the lineage is replaced first. It lands in 1c's amendment.

5. The collapse key is (action, property, target). My wider collapse stands for actions that only set a property: within one stretch between saves, repeated edits of one key leave the last, even with other steps between them. The registry declares this per action; an action that does not declare it merges only with its neighbour. A run that returns to its starting value disappears. Nothing merges or disappears across a saved-here mark, or across a step that depends on its key, such as an export. An unknown action is never merged.

6. Forward compatibility: the params of an unregistered action under a newer actions value are the only opaque slot. That step is validated outside its params, kept byte for byte on rewrite, and shown as recorded by a later version. Everything else needs a version increment.

7. The strict reader parses numbers with the canonical module's own grammar. float_roundtrip is not enabled.

8. Identity: the question is asked only when the first folder still holds a project with this identity. If it holds another project or none, it is a move and nothing is asked. If the first folder can't be reached, the question is asked. A new identity always goes to the newly opened folder. This refines my OPEN-2 rule.

9. Canonical form also refuses reserved device names, a segment ending in a dot or a space, and control characters. The "one spelling on every operating system" sentence is corrected.

10. Atomic save belongs to 1c's form.

Also:
- The project file's canonical form is line-oriented: one member per line with fixed indentation, so a diff shows what changed (docs/02). It lands in 1c's amendment.
- Route: 1b's form carries the ADR amendment for findings 3, 5 and 6. 1c's amendment carries the rest, with the architect's open acceptance items.

Notes for 1c's form:
- The OneDrive test includes an online-only file, not yet downloaded. Opening it triggers a download, which shows progress and can be cancelled.
- The refusal of a second open must not outlive a crash; a crashed session never leaves the project locked.
- For ruling 4, the form says what happens on a mismatch. A save that only appended steps can be rolled back by the step count; a save that removed steps needs the previous lineage kept until the project file is written.
- The strict reader also refuses duplicate keys and checks key order, as kernel/src/dataset_ref.rs already expects.

Ruling 8, second sentence:
If the first folder is gone, or holds another project or none, it is a move and
nothing is asked.

Ruling 5, the barrier sentence:
Nothing merges or disappears across a saved-here mark, or across an export,
which depends on every key.

First note for 1c's form:
The OneDrive test includes an online-only file, not yet downloaded. Opening it
triggers a download by the operating system. The form states what the user sees
while it runs and whether the open can be cancelled; it must never look frozen.
