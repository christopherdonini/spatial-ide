# ADR-023: its current lines and its six stale sentences, recomputed at main

*The custodian's table for the human's sight (PLAN node `adr-023-stale-cites-before-acceptance`; the docs lane, 2 of 7, placed by the human's ruling of 2026-11-05 (evening), item 2, `state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). ADR text is the human's: nothing here changes ADR-023, and its Status line at B1's close, with the acceptance note in the human's words, stays with the human (item 3 of the same ruling). A record, not Authority.*

**Source.** The rows are the architect's triage of the docs audit's Task C, rows 16 to 53 (`state/consults/2026-11-05-docs-audit-task-c-unpinned-cites-triage-architect.md`, its section on ADR-023, read at 61a677d7fae135e2dfc61f98137699e5e76b65a9). The triage found those rows CONFIRMED, except rows 20 and 38, which it found PARTLY.

**Method.** The table was recomputed at main 2cef11de635a8efea474605fb156f2100ca1c32d by a script, and every one of its 96 checks passed:
- ADR-023 is byte-identical at main to 61a677d7.
- Each stale cite appears inside backticks on the ADR-023 line the table gives.
- Each location at main holds lines byte-equal to the lines the triage found there at 61a677d7. Of the files the locations name, only `kernel/src/skp.rs` and `protocol/skp/SKP-V0.md` changed since then:
  - `protocol/skp/SKP-V0.md`: one line was replaced at :55, with no shift.
  - `kernel/src/skp.rs`: row 32's location moved from :1423-1433 to :1447-1457, its lines byte-equal.
- The files are unchanged from that commit to this one (06523a8f).
- Bare file names resolve as the triage's section says: `attributes.rs`, `envelope.rs` and `stream.rs` are in `engine/src/`.
- Not covered: ADR-023's other 17 path-and-line cites (on lines 35, 73, 85, 89, 93, 95, 99, 103, 110, 116, 120). The audit did not flag them, and they were not re-read here.

**The columns:**
- the triage row;
- ADR-023's line or lines;
- the stale cites as ADR-023 writes them;
- where the cited thing is at main;
- whether the sentence itself is stale;
- a note.

| Row | ADR-023 line | Cites | At main | Stale sentence | Note |
|---|---|---|---|---|---|
| 16 | :37 | `protocol/skp/src/v0/commands.rs:256-264` | `protocol/skp/src/v0/commands.rs:433-441`, `protocol/skp/src/v0/commands.rs:442-448` |  | `columns` at the second |
| 17 | :37 | `protocol/skp/SKP-V0.md:321-333` | `protocol/skp/SKP-V0.md:407-415` |  |  |
| 18 | :39 | `engine/src/envelope.rs:128-131` | `engine/src/envelope.rs:253-256` |  | `id` first and non-nullable at :254 |
| 19 | :39, :56 | `attributes.rs:156-165` | `engine/src/attributes.rs:169-177`, `engine/src/attributes.rs:469`, `engine/src/attributes.rs:558` |  | `ColumnIsIdentity`, then its checks |
| 20 | :43 | `engine/src/attributes.rs:58-97` | `engine/src/attributes.rs:78`, `engine/src/attributes.rs:109-115` |  | PARTLY: the fn head, then the refusal arm |
| 21 | :47 | `attributes.rs:61-63` | `engine/src/attributes.rs:81-83` |  |  |
| 22 | :48 | `attributes.rs:64` | `engine/src/attributes.rs:84` |  |  |
| 23 | :49 | `attributes.rs:65-72` | `engine/src/attributes.rs:85-92` |  |  |
| 24-26 | :50, :51 | `attributes.rs:73`, `attributes.rs:82-88`, `attributes.rs:74-81` | `engine/src/attributes.rs:94`, `engine/src/attributes.rs:101` | yes | the draft code the amendment superseded is gone; `Float32` admitted, then dictionaries |
| 27 | :55 | `attributes.rs:150-155` | `engine/src/attributes.rs:167-168` |  |  |
| 28 | :57 | `attributes.rs:89-96` | `engine/src/attributes.rs:109-115` |  | the final arm |
| 29 | :57 | `attributes.rs:197-204` | `engine/src/attributes.rs:633`, `engine/src/attributes.rs:669` |  |  |
| 30 | :62 | `attributes.rs:174-176` | `engine/src/attributes.rs:50-58`, `engine/src/attributes.rs:495` |  | the rule, then the nullable `Field::new` |
| 31 | :64 | `protocol/skp/SKP-V0.md:68` | `protocol/skp/SKP-V0.md:84`, `protocol/skp/SKP-V0.md:208` |  | the field, then the rule |
| 32 | :68 | `kernel/src/skp.rs:379-388` | `kernel/src/skp.rs:1447-1457` |  | moved since the triage (its :1423-1433), the lines byte-equal |
| 33 | :70 | `protocol/skp/SKP-V0.md:505` | `protocol/skp/SKP-V0.md:587-591` |  |  |
| 34 | :70 | `engine/src/stream.rs:821-832` | `engine/src/stream.rs:978-983`, `engine/src/stream.rs:989`, `engine/src/attributes.rs:566-569` | yes | `resolve_projection` only wraps `admit_projection`; the live path calls `Dataset::admit_projection`; the unknown-column arm |
| 35 | :71 | `attributes.rs:82-96` | `engine/src/attributes.rs:111-114` |  | the detail text |
| 36 | :77 | `attributes.rs:166-171` | `engine/src/attributes.rs:179`, `engine/src/attributes.rs:589` |  |  |
| 37 | :78, :87 | `attributes.rs:139-145`, `:139-145` | `engine/src/attributes.rs:159`, `engine/src/attributes.rs:542-547` |  | `TooManyColumns`, then the check |
| 38 | :81 | `DRAFT-3-BRIEF-B-recipe-replay-publish.md:81-83` | `state/drafts/post-tag/DRAFT-3-BRIEF-B-recipe-replay-publish.md:85` |  | PARTLY: the two codes |
| 39 | :87 | `engine/src/attributes.rs:52` | `engine/src/attributes.rs:70`, `engine/src/attributes.rs:68-69` | yes | the constant renamed `MAX_PROJECTED_ATTRIBUTES`, the rename recorded |
| 40 | :93 | `engine/src/envelope.rs:49-51` | `engine/src/envelope.rs:253-256` |  |  |
| 41 | :93 | `envelope.rs:120-126` | `engine/src/envelope.rs:239-251` |  |  |
| 42 | :93 | `attributes.rs:18-20` | `engine/src/attributes.rs:22-24` |  |  |
| 43 | :93 | `envelope.rs:174-208` | `engine/src/envelope.rs:319-339` |  | `TaggedBatch::assemble` |
| 44 | :95 | `envelope.rs:52-56`, `envelope.rs:57-61` | `engine/src/envelope.rs:95-97`, `engine/src/envelope.rs:89-93`, `engine/src/envelope.rs:121` |  | the coordinate-space clause, then the frame tag |
| 45 | :99 | `frontends/shell/src/canvas/decodeBatch.ts:23-27` | `frontends/shell/src/canvas/decodeBatch.ts:178-181`, `frontends/shell/src/canvas/decodeBatch.ts:230` |  |  |
| 46 | :107 | `envelope.rs:70-88` | `engine/src/envelope.rs:120-144` |  |  |
| 47 | :108 | `engine/src/stream.rs:1131-1133` | `engine/src/stream.rs:1433-1440` |  |  |
| 48 | :109 | `stream.rs:1140-1158` | `engine/src/stream.rs:1447-1463` |  |  |
| 49 | :110 | `stream.rs:1134-1137` | `engine/src/stream.rs:1441-1444` |  |  |
| 50 | :111 | `protocol/skp/SKP-V0.md:69` | `protocol/skp/SKP-V0.md:86` | yes | the quoted shape now has a fourth member, `projectable` |
| 51 | :120 | `protocol/skp/src/v0/mod.rs:29` | `protocol/skp/src/v0/mod.rs:115` | yes | the current literal is `skp/0.12`, not `skp/0.2` |
| 52 | :120 | `DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:67`, `:76`, `:89` | `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:70`, `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:79`, `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:92` |  |  |
| 53 | :138 | `stream.rs:2189` | `engine/src/stream.rs:3755` |  |  |

**The six stale sentences.** These sentences are untrue of main in themselves, not only in their cites. They are on ADR-023's lines :50, :51, :70, :87, :111, :120:
- rows 24 to 26: lines :50 and :51;
- row 34: line :70;
- row 39: line :87;
- row 50: line :111;
- row 51: line :120.

The triage row describes each one. Any replacement wording is ADR text, and so is the human's.
