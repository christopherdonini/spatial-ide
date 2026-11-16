# b2-piece-1c-save-and-reopen, step 2: the architect's supplement for the advisor's rulings R1 to R4 (the wire bump, the producers ahead of their consumers, a later run's record, the approved words); read only, not a gate

*Filed by the custodian, 2026-11-16: the hand-back of 2026-11-16T04:01:52Z, 14176 bytes, sha256 7621c8da62f7a322ed2b7051c90d2eccf9acfe3dfdea0d4cac513b106fef4c45, model claude-opus-5-5, 178 calls in the transcript (Glob 8, Grep 97, Read 71, SubagentHandback 2), 2 errored; asked by the custodian's message of 2026-11-16T03:58:47Z, the same agent resumed, at main 2e99751d; the transcript's counts cover the read and the supplement together; changes: none.*

---

main @ 2e99751dc20106d36f1fe151815f7ed6eb1b5029 (plus PR B @ 6f7e744c, not read for this supplement)

# Supplement for the advisor's rulings R1 to R4 (architect, read only)

Wherever I describe the form or a draft in my own words, the words are mine. Text quoted in a code span is copied exactly.

## Corrections to my main report
1. **The K-R tests sit in P3, not P1.** My draft of P1's declaring amendment, item 4, put K-R1 to K-R4 in P1. But K-R1's name, `a_link_below_the_folder_is_refused_and_never_opened` (§4, step 2 table), asserts that nothing is opened, and only `open_project` can show that. So K-R1 to K-R4 move to P3, and P1 tests `check_inside` directly with tests of its own (R2, row 1).
2. **N-10's site is a different comment.** It is not `kernel/src/dataset_ref.rs:129 @ 2e99751d`. It is the containment comment on `in_canonical_form`, at `kernel/src/dataset_ref.rs:590-592 @ 2e99751d`. The form's own pin is `dataset_ref.rs:539-543 @ ad921f55` (§2.5), and the tree is authoritative here.

---

## R1. The stack

### What P3's single SKP bump puts on the wire
Main is at `skp/0.13` (`protocol/skp/src/v0/mod.rs:123 @ 2e99751d`). Main has no `open_project` anywhere in `protocol/`, `kernel/` or `frontends/`: I grepped for it and found nothing.

| Item | New, changed or withdrawn | Declared by |
|---|---|---|
| `SKP_VERSION` `skp/0.13` becomes `skp/0.14`, with the `skp` literal in every command's request and every fixture | changed | §2.2 heading (OPEN-3 (A)); §2.11's literal group |
| Command `open_project` | new | §2.2 |
| Request field `skp` | new (in a new command) | §2.2 |
| Request field `folder` | new | §2.2 |
| Request field `cancel_key` | new | §2.2 |
| Request field `answer: null\|"copy"\|"same"` | new | §2.2 |
| Request field `relink: null\|string` | new | §2.2 |
| Response kind `opened`, with fields `project`, `dataset`, `session`, `workspace`, `check {observed, admission}` and `lineage` | new | §2.2 |
| `opened.workspace.view`: either the saved view, or the named state `{"state":"saved-in-another-space","basis":…}` | new | Amendment 1 item 5, V3 |
| `opened.lineage`: a closed set of named facts | new | §2.2 says only `<named fact>`. The set itself (`not-kept` … `refused-damaged`) is in the 2026-10-23 draft, design point (f). **Not on the form.** |
| Element shapes of `check.observed` and `check.admission` | new | §2.2 gives only `[…]`. **Not declared on the form**, by my read. |
| Response kind `question {kind:"copy-or-same"}` | new | §2.2 |
| Response kind `not_found {file_name}` | new | §2.2 |
| Code `project_open_elsewhere` | new | §2.2; §2.4 step 3 |
| Code `project_target_through_link` | new | §2.2; §2.5 |
| Code `project_target_unresolvable` | new | §2.2; §2.5 |
| Code `project_machine_record_refused` | new | Amendment 1 item 5, M1 |
| Code `project_known_folders_full` | new | Amendment 1 item 5, M2 |
| Code `project_target_outside_folder` | withdrawn before it ships (it is not on main) | C-6 is the 2026-10-23 draft's design point (j), at `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:151 @ 2e99751d`. **Not on the form**: §2.2 still lists the code. The withdrawal must be declared. |
| The code for "an intermediate that is not a directory, or a final that is not a regular file, is refused by name" | undeclared | §2.5 names no code for it. **A code must be named or chosen.** |
| `project_file_refused`, `cancel_key_in_use`, `engine.cancelled` | existing; their raising sites widen to the reopen | Their doc comments name `save_project` only (`protocol/skp/src/v0/error.rs:203-206 @ 2e99751d`), so the doc changes in P3. Declared by §2.4 step 1 and draft (i). |
| `project_lineage_not_kept_by_this_version` | unchanged | §2.2. Undeclared, and for the advisor: a later save of a reopened file whose member records a lineage is still refused with this code. Step 1's writer writes none, so only a file built by hand or by another program meets it. |
| `save_project`, `record_step` and the other commands | unchanged apart from the literal | §2.2, "Not changed" |

### Other `protocol/` changes in the stack
- **P1.** Only the D-16 comment lines: `protocol/skp/src/v0/error.rs:188-191` (`//` lines) and `protocol/skp/SKP-V0.md:1355` (an HTML comment), both @ 2e99751d.
  - Neither changes a wire byte, a type or a fixture.
  - The fix does change behaviour on POSIX: a failed folder flush after the rename no longer raises `project_file_unwritable`. That brings the code into line with what is already written, namely `error.rs:193-194` and `SKP-V0.md:1354` ("A refusal leaves the previous file in place"), both @ 2e99751d.
  - So the comments go, and the contract text is unchanged.
- **P2 and P4.** Nothing in `protocol/`. P4's `frontends/shell/src/skp/{types,client}.ts` mirror the wire, but they are not `protocol/`.
- **§2.14's sentence "Every step touches `protocol/`."** Under the stack, that holds of step 2 as a whole. Within the stack it holds of P1 (comments only) and P3.

### Classes under ADV-2026-11-16-06 item 2

| Piece | Class | Grounds |
|---|---|---|
| P1 | 2 (a) | Size, about 810 lines, over 260. Persistence: the reading and writing rules for `folders.json` and `locations.json`, and how a save commits. Concurrency: the lock and its release at a crash. What the user is told about their data: D-16 changes whether a save is reported refused, on POSIX only. Not on the wire. Not a run-time seam; the protocol lines are comments. |
| P2 | 2 (a) | Size, about 550. Persistence: a reader of the lineage file with bounds, never cutting a file back. No wire and no strings. |
| P3 | 2 (a) | The wire. Persistence: re-link writes and `folders.json` writes. Concurrency: the lock held in the binding and dropped at a session end. Cancellation: the cancel key registered at entry and the open that takes a token. The seam: kernel to protocol to binding. Size, about 2,210. What the user is told: the facts in the kernel's messages and `check`. |
| P4 | 2 (a) | The seam: shell to wire. What the user is told: S8 to S12, S16, S17, S19 to S21, the through-link notice and the Colour-by-not-restored notice. Cancellation: Cancel in `runAdmitPath`. Size, about 1,420. |
| P5 | 2 (b) | Wording for KNOWN-LIMITATIONS and the walkthrough only, about 140 lines. The words go to the advisor. |

---

## R2. Producers that land ahead of their consumers

| # | Producer (symbol, file) | Lands in | Consumer (symbol, file, piece) | Test in the producer's own piece | End-to-end test of the seam, and where it is declared |
|---|---|---|---|---|---|
| 1 | `check_inside`, `kernel/src/project/resolver.rs` (new) | P1 | `Projects::open_project` data step, `kernel/src/project/mod.rs`, P3 | New unit tests on `check_inside` (link, junction, missing segment, wrong final type; names to be given), plus C-7's text-check unit test (draft (k); **not on the form**) | K-R1, K-R2 and K-R4 (§4) through `open_project`. K-R3 as C-7 restates it (draft (k); **not on the form**, must be declared). Then E-REOPEN (§4) |
| 2 | The project lock: `OPEN_LOCK` and a lock type, `kernel/src/project/store.rs` | P1 | `Projects::open_project` step 3, and the binding's lock state in `frontends/shell/src-tauri/src/commands.rs` (`close_dataset`) and `lib.rs` (session-end forwarder), P3 | New tests: held and refused, freed when dropped, freed at a crash (names to be given) | K-O4 and K-O5 (§4). K-O4's case of a reopen after a session end in the same process (S2-3 (a); draft, table at its line 193; **not on the form**). E-SECOND and E-CRASH-UNLOCK (§4), in P4 |
| 3 | `KnownFolders`'s `same` append with the M2 bound, `store.rs` | P1 | The `same` arm of `Projects::open_project`, P3 | New store-level test (name to be given) | K-O11 (Amendment 1 item 5, M2) and K-O6 (§4) |
| 4 | The move arm (S2-2 (a)), `store.rs` | P1 | The move arm of `Projects::open_project`, P3 | New store-level test (name to be given) | K-O6, widened to assert `folders.json`'s bytes after a move and then to ask at the old path (draft, table at its line 192). **Not on the form**; must be declared |
| 5 | The bounded reader of `locations.json`, `store.rs` (new; none exists on main) | P1 | The machine-location arm of `Projects::open_project`, P3 | New test: a refused file is named (name to be given) | K-O3 (§4) for a location that is absent or missing. K-O10 widened to a refused `locations.json` (draft (b)). **Not on the form**; must be declared |
| 6 | `KnownFolders::from_bytes`, `store.rs:245 @ 2e99751d` (already on main) | step 1 (landed) | M1 in `Projects::open_project`, P3 | — | K-O10 (Amendment 1 item 5, M1; pre-committed by Amendment 16 item 1) |
| 7 | The lineage reader, `kernel/src/session_history.rs` (class 9) | P2 | Step 6 of `Projects::open_project`, giving `opened.lineage`, P3 | L1 to L4 (§4) and K-L5 (Amendment 1 item 5, C1), on files built by hand | **None declared** that goes through `open_project` and the wire, and §4 declares no shell test for S16 or S17. Both must be declared: a case of K-O1 with a lineage, plus a fixture, and a shell test mapping to S16 and S17 |
| 8 | The `open_project` wire types (`protocol/skp/src/v0/commands.rs`), the binding `commands::open_project` (`frontends/shell/src-tauri/src/commands.rs`) and its handler (`lib.rs`) | P3 | `openProject.ts` and the `admit` in `runAdmitPath` (`frontends/shell/src/admission/AdmissionPanel.tsx`), P4 | K-O1 (§4) and the wire fixtures | The shell test `reopen goes through runAdmitPath and shows liveness and Cancel` (§4), then E-REOPEN (§4) |
| 9 | Only if P3 splits: `Projects::open_project`, `mod.rs` | P3a | The binding `commands::open_project`, P3b | K-O1 to K-O11 | E-REOPEN (§4) |

- **D-16 is not ahead of its consumer.** Its product caller, `Projects::save` through `Staged::commit` (`store.rs:132 @ 2e99751d`), is already on main. N-10 is a doc comment, not a producer.
- **No row for these.** The open that takes a token (`kernel/src/skp.rs`), the registration in `Projects.saved` and the release at a session end each land in the same piece as their consumer, P3, so they need no exemption.

---

## R3. A later run's reopen that meets a record another run left

| Ruling | Where | My recommendation (O-5) |
|---|---|---|
| OPEN-N4 (a): a reopen in the same run binds at the reopen and continues that record | `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:25 @ 2e99751d`; option text at `state/consults/2026-11-12-second-open-history-before-1c-step-3-options-architect-draft.md:200-204 @ 2e99751d`; ADR-036 Amendment 2 item 4 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:293 @ 2e99751d`) | **Covers a case it leaves open.** N4 (a) is limited to a record "this run holds", so a later run is not ruled by it. |
| OPEN-N1 O-2: one record per open until a save binds it | Same directive, `:25` | **Follows it.** A later run's reopened open keeps its own record until its first save (Amendment 2 items 1 and 2, `ADR-036…md:287,289 @ 2e99751d`). |
| OPEN-S2-1 (c), with its approved collision words | `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:20 @ 2e99751d`; the words are at the consult's `:360` (R4) | **Follows it.** The second-open options draft says so in its own words: `The approved Amendment 2 words cover another run's record only.` (`…options-architect-draft.md:160 @ 2e99751d`). The first save meets that run's record, and neither history is replaced. |
| Item 5 (c): saving into a project whose record this run holds | Same directive, `:27` | **Bears beside it; same-run only.** Mine does not change it. |
| Item 5 (b): replaces OPEN-21-1 (b) | Same directive, `:26` | **Follows it.** OPEN-21-1 (b) is no longer in force, so I do not rely on it. |
| Step 3's recovery offer at the project's open, not at start (K-C4) | The form's §2.6 and §4's step 3 table | **Leaves it to step 3.** Step 2 must not consume, move or replace another run's record (§2.13: step 3 waits on step 2). |

**What the user is told:**
- **At the reopen:** nothing. No string is declared (§2.12 lists none). S13, the recovery offer, is step 3's.
- **At the first save:** S5, "the history mark withheld (OPEN-9 (A))" (§2.12), from `history_mark: "withheld"`.

---

## R4. The words OPEN-S2-1 (c) approved
- **The words:** `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md:360-360 @ 2e99751d`. It is one blockquote line. The leading `> ` is the quote marker, not part of the words.
- **The approving line:** `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:20 @ 2e99751d`, the span `OPEN-S2-1 (c), with the drafted ADR-036 Amendment 2 words approved.`
- **The first and last words of the body:** it starts `The same holds at the first save of a session that opened the project from its folder.` and ends `and the session's history stays under its own record.`
- **The cut:** the body runs from `The same` to `own record.` with no `> ` before it.
- **The same line approves the S2-2 (a) words.** They are at the same consult's `:376`, starting `When a project has moved (§4)` and ending `is no longer remembered.`
- **Check before copying:** run `git log` on the consult to confirm its blob has not changed since the 2026-10-23 commit that filed it. The approval is of the words as drafted then. If it has changed, copy the words at that commit, not at 2e99751d.

---

## Must-fix (Documentation): items that belong on the form before their code
- C-6 (the withdrawal) and C-7.
- Design points (a) to (l) of the 2026-10-23 draft, including the closed lineage set.
- The shapes of the `check` elements.
- The code for a refusal at a non-directory intermediate or a non-regular final.
- The widened tests K-O6 and K-O10, K-O4's case after a session end, and the lineage tests through the wire and in the shell.
- The draft's tests K-O12 to K-O15 and K-L6.