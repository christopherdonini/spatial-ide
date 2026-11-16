# b2-piece-1c-save-and-reopen, step 2 (the reopen): the custodian's packet for the advisor's rulings R1 to R4, 2026-11-16

This packet is the custodian's, and its words are mine. It rests on two reports by the architect, filed beside it in this commit, both read only, at main 2e99751d:
- the read, `state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-read-architect.md`;
- its supplement, `state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-supplement-architect.md`.

Items are cited by the reports' own numbers: O-n and Dn in the read, and R1 to R4 in the supplement. Where I describe what the architect found, that is my paraphrase. The two fenced passages under R4 are copied by script. No piece of the reopen is dispatched before the declaring amendment and the advisor's answer.

## The stack in brief

Step 2 becomes five pieces, each merging alone.
- **P1. The resolver, the store and the lock, with D-16.** Kernel, plus two protocol comment lines; about 810 lines.
- **P2. The lineage reader.** Kernel; about 550.
- **P3. The reopen through the wire.** Kernel, protocol and src-tauri; about 2,210, or split into:
  - P3a, the kernel's `Projects::open_project`;
  - P3b, the wire and the binding, about 810.
- **P4. The shell.** About 1,420.
- **P5. The records.** K-2, K-3 and K-5, and the walkthrough rows.

What can run when:
- P1 to P3 share no file with PR B, so they can run in slot 2 beside it.
- P4 waits for PR B's merge and for the first-look node's.
- P2 can run beside P1, since their files are disjoint.

The supplement makes two corrections to the read:
- K-R1 to K-R4 belong to P3, since only `open_project` can show that nothing is opened. P1 tests `check_inside` directly.
- N-10's site is the containment comment on `in_canonical_form` in `kernel/src/dataset_ref.rs`.

## R1. The stack, and the one SKP bump

**What P3's bump puts on the wire** (the supplement, R1's table):
- **The version.** `skp/0.13` becomes `skp/0.14`, and so does the literal in every request and fixture.
- **The new command `open_project`.** Its request fields are `skp`, `folder`, `cancel_key`, `answer` and `relink`. Its three response kinds:
  - `opened`, with `project`, `dataset`, `session`, `workspace`, `check` and `lineage`; `workspace.view` is the saved view or the named state of V3;
  - `question`;
  - `not_found`.
- **Five new codes:**
  - `project_open_elsewhere`;
  - `project_target_through_link`;
  - `project_target_unresolvable`;
  - `project_machine_record_refused` (M1);
  - `project_known_folders_full` (M2).
- **One code withdrawn before it ships:** `project_target_outside_folder`, by the 2026-10-23 draft's C-6. The form's §2.2 still lists it, so the withdrawal must be declared.
- **Three existing codes whose raising sites widen to the reopen:** `project_file_refused`, `cancel_key_in_use` and `engine.cancelled`. Their doc comments change.
- **Unchanged apart from the literal:** `save_project`, `record_step` and the rest.

**Not yet declared on the form.** These go into P3's declaring amendment, before its code:
- the closed set of named facts in `opened.lineage`;
- the element shapes of `check.observed` and `check.admission`;
- a code for a path whose intermediate is not a directory, or whose final is not a regular file;
- C-6's withdrawal.

**Other `protocol/` changes in the stack: P1 alone,** and only the two D-16 comment lines in `protocol/skp/src/v0/error.rs` and `protocol/skp/SKP-V0.md`.
- No wire byte, type or fixture changes.
- On POSIX, D-16's fix stops a failed folder flush after the rename from refusing the save. That brings the code into line with the contract's own sentence that a refusal leaves the previous file in place.
- P2 and P4 touch nothing in `protocol/`.

**Classes under ADV-2026-11-16-06 item 2**, each with its grounds:

| Piece | Class | Grounds |
|---|---|---|
| P1 | 2 (a) | size; persistence (`folders.json`, `locations.json`, how a save commits); concurrency (the lock, its release at a crash); what the user is told about their data (D-16 on POSIX) |
| P2 | 2 (a) | size; persistence (a bounded reader of the lineage file) |
| P3 | 2 (a) | the wire; persistence; concurrency (the lock held in the binding, dropped at a session end); cancellation (the open that takes a token); the seam from kernel to protocol to binding; size; what the user is told |
| P4 | 2 (a) | the seam from shell to wire; the strings; cancellation (Cancel in `runAdmitPath`); size |
| P5 | 2 (b) | KNOWN-LIMITATIONS and walkthrough words only; the words go to the advisor |

**My proposal on R1:** the stack as above, with P3 split into P3a and P3b, so that each piece stays near 800 lines (the directive's item 3).

## R2. The producers that land ahead of their consumers

The supplement's R2 table has one row per producer. Each consumer is in the next piece, and each seam is proven end to end once the consumer lands.

| Producer | Lands in | Consumer | End-to-end test | Declared? |
|---|---|---|---|---|
| `check_inside` | P1 | `Projects::open_project`, P3 | K-R1, K-R2, K-R4 through `open_project`, then E-REOPEN | yes (§4) |
| | | | K-R3 as C-7 restates it | **no: to declare** |
| the project lock | P1 | `open_project` step 3, and the binding's lock state, P3 | K-O4, K-O5; E-SECOND and E-CRASH-UNLOCK in P4 | yes |
| | | | K-O4's case of a reopen after a session end in the same process | **no: to declare** |
| `KnownFolders`'s `same` append under M2 | P1 | the `same` arm, P3 | K-O11, K-O6 | yes |
| the move arm of S2-2 (a) | P1 | the move arm, P3 | K-O6 widened to the bytes of `folders.json` after a move | **no: to declare** |
| the bounded `locations.json` reader | P1 | the machine-location arm, P3 | K-O3 | yes |
| | | | K-O10 widened to a refused file | **no: to declare** |
| `KnownFolders::from_bytes` | step 1, already on main | M1, P3 | K-O10 (Amendment 16 item 1) | yes |
| the lineage reader | P2 | step 6 of `open_project`, P3 | a K-O1 case with a lineage, and a shell test for S16 and S17 | **no: neither declared** |
| the `open_project` wire types and binding | P3 (P3b) | `openProject.ts` and `runAdmitPath`'s admit, P4 | §4's shell test of the reopen through `runAdmitPath`, then E-REOPEN | yes |
| `Projects::open_project` (if P3 splits) | P3a | the binding, P3b | E-REOPEN | yes |

- Each producer's own piece also carries tests of its own. P1's are named in its declaration.
- Not ahead of any consumer: D-16, whose caller `Projects::save` is on main; N-10, a comment; and the token-taking open and the registration in `Projects.saved`, which land with their consumer in P3.

**My proposal on R2:** pre-commit each producer with its consumer and its end-to-end test named, on the precedent of the form's Amendment 16 item 1. Each test marked to declare is declared in the amendment of the piece that runs it, before that piece's code. The PR body and PLAN.yaml name each pre-commitment.

## R3. A reopen in a later run meets a record another run left

The rulings that bear on it, by the supplement's R3 table:
- **OPEN-N4 (a)** (the human's third message of 2026-11-12): binds a reopen in the same run. Its words are limited to a record this run holds. **The recommendation covers a case it leaves open.**
- **OPEN-N1 O-2** (same message): one record per open until a save binds it. **Followed.**
- **OPEN-S2-1 (c)** (2026-10-23), with its approved collision words: **followed.** The first save meets the other run's record, and neither history is replaced.
- **Item 5 (c)** (same message, saving into a project whose record this run holds): beside it, same-run only. **Not changed.**
- **Item 5 (b)** (same message, which replaced OPEN-21-1 (b)): **followed.** OPEN-21-1 (b) is not relied on.
- **Step 3's recovery offer:** left to step 3. Step 2 does not consume, move or replace another run's record.

**What the user is told:**
- **At the reopen:** nothing. §2.12 declares no string for it.
- **At the first save:** S5, the history mark withheld (OPEN-9 (A)).

**Also for your sight, from the supplement:** a later save of a reopened file whose member records a lineage is still refused, with `project_lineage_not_kept_by_this_version`. Step 1's writer writes no lineage, so only a file built by hand or by another program meets this.

**My proposal on R3:** do not bind at a later run's reopen. The open keeps its own record until its first save, where OPEN-S2-1 (c)'s words apply. Binding at the reopen would meet the other run's leftover folder at every first step.

## R4. The words OPEN-S2-1 (c) approved, and the one change proposed

The approving line is the human's directive of 2026-10-23: `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, the line that begins `Piece 1c:`. Its span: `OPEN-S2-1 (c), with the drafted ADR-036 Amendment 2 words approved.`

The words are line 360 of `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`.
- One commit, c68245c4, holds that file, so its blob is the one the approval read.
- The words are copied by script, without the leading quote marker: 274 bytes, sha256 74580d1b6163fd7daae78d56872ff8b488f7360174ea20f57463a9917cec9cf0.

```text
The same holds at the first save of a session that opened the project from its folder. Where the project's record already holds a history another run left, neither history is replaced: the save writes no saved-here mark, and the session's history stays under its own record.
```

The same line also approves the words of OPEN-S2-2 (a). They are line 376 of the same consult, copied the same way: 137 bytes, sha256 6e4ec98a476de33f655fa7d13e7a78c039ab9b8ce6fe1af4d708b9bdf2920253.

```text
When a project has moved (§4), the folder it opened from becomes the first folder, and the folder it moved from is no longer remembered.
```

**The one change proposed:** the number. The words were approved as ADR-036 Amendment 2, but Amendment 2 is now second-open's. They land as **ADR-036 Amendment 3**, with the approved body unchanged.
- The architect reads its clauses as still holding against Amendment 2's items 1, 2 and 4. A clause check goes with P3's declaration and comes back to you before P3's code.
- Whether the S2-2 (a) words go into the same Amendment 3, or stay as the form's words, is yours. My proposal: the same Amendment 3, as its second item.

## What the custodian declares (for your sight; no ruling asked)

- D1: the 2026-10-23 rulings OPEN-S2-1 (c), S2-2 (a), S2-3 (a) and S2-4 (a), and the human's 2026-11-12 (13:07Z) item 3 (a), (d) and (e), onto the form, class 5.
- D2: the 2026-10-23 draft's second K-S14 renamed.
- D4: the comments that become untrue, each changed in its own piece's diff.
- D5: §2.11's groups split per piece, with §7 not edited.
- O-6: second-open's five carried items in P3.
- O-7: K-S15 keeps the length check.
- O-8: D-16 built in P1 with an injected failing flush.
- O-10 to O-17, O-20 and O-21: the seams, and the files that join by class 9.

## Later, with P4's declaration

Each comes to you with its drafted words:
- O-9: the through-link save notice;
- O-18: the notice that a saved Colour by was not restored;
- O-19: the Open project control's place and label.

## On your ruling

On R1 and R2, the custodian writes the declaring Amendment 30, from the architect's draft and corrections: D1 and D2, then P1's scope, tests with their mutations, ceilings, regions and stops. It is committed to main before any code. P1 then goes to worker-high on Opus, with its own target on D:. It is the only piece touching `protocol/` while it is in progress.
