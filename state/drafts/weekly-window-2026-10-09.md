# Weekly window 2026-10-09 — process proposals (draft)

*This is the custodian's draft, opened on 2026-10-02. It is raised to the human at the 2026-10-09 window. Nothing in it is applied before the human's answer.*

## A. Block-on-sight path rules exempt the form's own appended §10 amendments

- **Source.** The 2026-10-02 window note, `state/directives/2026-10-02-window-amendment-exemption.md`. The human directs that this be proposed, not applied.
- **The gap.** #157's form barred in §8 item 3 any commit after C1 touching a path outside §7's two files. Its own appended amendment tripped that rule. The architect's gate 2 is `state/consults/gates/2026-10-02-workspace-rustfmt-gate2-architect.md`, S1-2. Question round 37 settled it for that piece only.
- **The proposal, one line** in `docs/PREREGISTRATION-TEMPLATE.md`, appended at the end of the file: a form's block-on-sight path rules exempt the form's own appended §10 amendments by default.
- **Not proposed:** any change to §7 counting commands. A form's counting command keeps naming its own exclusions, and a missed self-exclusion stays a class 8 record.

## B. The 2026-10-03 trial: the report owed at the window

- **Source.** `state/directives/2026-10-03-reports-to-files-two-pieces-trial.md`, the 2026-10-03 trial directive. At the window the human asks for two things:
  - whether the context lasted longer between compactions;
  - what two pieces at once cost in conflicts and in the human's attention.
- **Baseline, before the trial.** This session's (e12d1b11) auto-compactions, each at about 770k tokens:

  | Compaction | Interval |
  |---|---|
  | 2026-09-30T17:42Z | — |
  | 2026-10-02T06:06Z | 36.4 h |
  | 2026-10-02T15:43Z | 9.6 h |
  | 2026-10-03T07:06Z | 15.4 h |

  Wall-clock intervals depend on the human's hours, so the report also gives subagent hand-backs filed per interval, from the ledger.
- **What the custodian logs during the trial:**
  - each compaction's time, read from the transcript's `compact_boundary` entries;
  - each pair of pieces in flight, with lanes and paths;
  - each conflict: a merge conflict, a regeneration, a wait for overlapping paths, or a stale continuity block;
  - each time the human was asked or interrupted because two pieces ran at once.
- **The known gap.** The architect cannot write a file (no write tool), so its reports stay messages. The report says what that cost.

## C. Appended template lines open their own paragraph

- **Source.** PORT-1's gate-1 reports: the reviewer's S2-5 and the architect's N3, in `state/consults/gates/2026-10-03-port-1-linux-l1-gate1-reviewer.md` and `state/consults/gates/2026-10-03-port-1-linux-l1-gate1-architect.md`.
- **The gap.** PORT-1 appended the R3 line to `docs/PREREGISTRATION-TEMPLATE.md` with no blank line before it. A blank line would have been a second appended line, which PORT-1's §8 forbade. In rendered Markdown, the R3 line reads as part of round 25 (e)'s paragraph, under that paragraph's attribution.
- **The proposal.** It rides with item A's one-line append:
  - one blank line before the R3 line;
  - one blank line before item A's line.

  No line above the R3 line moves. No record cites the R3 line yet.
- **Not proposed:** any rewording.

### B2. The lead-data pilot (the 2026-10-03 lead-data pilot direction and clarification, C4)

- **Marking.** Each measured piece is marked here as lead-drafted or architect-drafted, so the reports-to-files figures stay separable.
- **The baseline,** named before the first measured piece (node 9). These are the most recent architect-drafted pieces that are confined to `engine/` and `kernel/` by paths and by contracts (C2). Each PR's changed top-level paths are only `engine/` and `kernel/`, and each form states no wire or SKP change.

  | Node | PR | Drafting consult | Correction rounds | Drafting reads |
  |---|---|---|---|---|
  | `engine-cancel-before-stream-window` | #146 | `state/consults/2026-09-30-engine-cancel-before-execute-architect-draft.md` | 1 | unknown (7) |
  | `kernel-ticket-liveness-redeem-wording` | #147 | `state/consults/2026-09-30-ticket-liveness-redeem-architect-draft.md` | 0 | unknown (11) |
  | `kernel-close-dataset-unknown-keeps-openrecord` | #150 | `state/consults/2026-09-30-close-dataset-unknown-architect-draft.md` | 2 | unknown (9) |
  | `catalog-open-replace-drop-latency-note` | #151 | `state/consults/2026-10-01-catalog-open-replace-note-architect-draft.md` | 1 | unknown (13) |
  | `audit-reader-char-boundary` | #152 | `state/consults/2026-10-01-audit-reader-char-boundary-architect-draft.md` | 1 | unknown (19) |

  - **Correction rounds** are gate attempts after the first, from `state/gate-log.json`. The mean is 1.0 per piece.
  - **Drafting reads.** The drafting consults do not record what they read, so reads are unknown (C4). The bracketed figure is a different and observable quantity, the distinct repository paths each draft cites. It is a proxy, not a read count.
  - **Excluded:**
    - #148, `publish-refusal-codes-and-attempt-lifecycle`'s kernel half, changes a data-plane refusal code's literal (a contract, C2);
    - #136, `kernel-generation-close-races`, touches `frontends/`;
    - #141, `watcher-first-read-on-watch-thread`, has no architect drafting consult;
    - #145 and #143 touch `protocol/` and `frontends/`.
- **The setup's cost** is reported separately (C4). The setup piece is `lead-data-pilot-setup`, and lead-data's first dispatch is its Part 4.
- **Per measured piece,** the log records:
  - lead-drafted or architect-drafted;
  - the files read during drafting;
  - its correction rounds, each classed as draft-caused, implementation defect or changed scope (only draft-caused counts against the lead);
  - whether the index was updated in its PR, before its final gate (C1);
  - any intervention by the human;
  - agent usage where observable, otherwise unknown;
  - index upkeep, as ongoing cost.
- **C3 log.** For each lead-data or architect dispatch, the before and after `git status --porcelain` of the custodian checkout and of the assigned worktree.
  - **#165 gate 3, architect** (09:34Z before, 09:40Z after): the only new file is its report, written by the custodian from its message. The worktree is unchanged.
  - **lead-data dispatch 1** (`lead-data-pilot-setup`, Part 4; before at 09:40:08Z, after at 10:04:24Z): the only new file in the custodian checkout is its report, with hash of record 160c89e1dc5a8db624c303f27e465757a404768332c50e29df8498a5d4f27e46. Its worktree is unchanged at af40bbf.
- **Setup cost, reported separately (C4):**
  - **lead-data dispatch 1:** 459,875 subagent tokens, 143 tool uses and 1,397,549 ms (about 23.3 min), all from the harness's task notification. It ran as a general agent on opus, at the harness's default effort.
  - **Output:** two index sections (32 and 36 lines) and nine anchored README edits.
  - **Its two blocking questions:**
    - C5: the custodian took it, and routed the recomposition to proposed node `kernel-composed-ceiling-projected-stream`;
    - C8: held for the human, as the OPEN 2026-10-03 entry.
- **The audit and C3 log, continued:**
  - **Write audits** (the 2026-10-03 write-audit ruling, the primary check):
    - lead-data dispatches 1 and 2: PASS. Dispatch 2 made three write calls (two Write, one Edit), all to its report path; the Edit departs from its brief's tool list.
    - the architect runs for #165 gates 3 and 4 and for #166 gate 1: PASS, with zero write calls.
    - **Negative self-test:** a reviewer run, which uses Bash, returns VOID.
  - **lead-data dispatch 2** (#166 correction round 1; before at 10:34:27Z, after at 11:12:20Z). Its new file is its report, and the refs snapshot is unchanged. It is setup cost: 191,253 subagent tokens, 66 tool uses and 560,704 ms.
  - **The tools held (#166 gate-1 architect, S2-1).** Both setup dispatches ran as general agents, holding the full tool set at the harness's default effort, whose value is unknown. Their transcripts show no shell call.
  - **Index-wrong findings,** toward §5's stop condition (two stop the pilot): one so far, #166's gate-1 architect S1-1 (Proposed ADRs listed as governing), found at the setup. The same report's Judgment 5 would exclude the setup from §5's evidence. The custodian counts it provisionally and reports it at the window.

## D. Who owns a lead-drafted five-line form's Out-of-scope line

- **Source.** #166's gate-1 architect, Judgment 2 (`state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-architect.md`).
- **The question.** When lead-data drafts a five-line form, its Out-of-scope line decides between the single-gate route and the full route. `AUTONOMY.md` §21d makes that line the custodian's written claim. The human confirms that it stays so.
- **Proposed reading.** It stays the custodian's claim. lead-data's draft line is a draft, which the custodian adopts or corrects before committing the form.
- **Question round 42, item 2:** the setup is excluded from §5. The index-wrong count starts at 0 with node 9, the first measured piece. #166's gate-1 S1-1 stays above as a setup finding.
- **Measured piece 1: node 9, `kernel-ticket-drop-followups`. Lead-drafted.**
  - **Draft 1.** The `lead-data` agent type was not loaded when the draft was dispatched, so it ran as a general agent on opus under the agent file's body. The type became available mid-session, after main fast-forwarded past #166.
    - Cost: 243,571 subagent tokens, 82 tool uses, 1,068,966 ms.
    - Its files read are in its section 4.
    - Write audit PASS. C3 clean.
  - **The architect's consult** on the draft's three questions: 61,384 tokens, 19 tool uses, 134,698 ms. Write audit PASS.
    - Q3: not crossing (C2), so the piece stays lead-drafted.
    - Q2: the residual windows are acceptable, but the draft's list was incomplete, with two sites missed, and its headline lacked the qualifier.
  - **Correction 1, before commit: draft-caused.** It counts against the lead under §5. The revision is draft 2, by `lead-data` as its own agent type.
  - **Draft 2,** by `lead-data` as its own agent type: 77,043 tokens, 14 tool uses, 244,384 ms. Its reads are few, because it revised its own draft against the consult. Write audit PASS. C3 clean.
  - **The form is committed,** with the custodian's 50 pin hashes at c9f41126. Next: the implementation (worker-high). Then C1, lead-data's index update, before the final gate; the final gate is the reviewer plus the architect.
  - **Index-wrong count:** 0.
  - **Implementation** (worker-high): 167,343 tokens, 79 tool uses, 2,871,766 ms. P1 to P4 held, no invalidator fired, and the figure is 316 of 320 lines.
  - **C1, the index update** (`lead-data` as its own type): 141,388 tokens, 62 tool uses, 362,706 ms. Write audit PASS, C3 clean. Three lines change.
    - It also found one pointer already wrong: the Close ordering bullet, written in the setup. A gate did not find it, so §5's stop count ("a gate finds the index wrong") stays at 0. It is routed to `module-docs-stale-statements`.
  - **Gate 1, the architect (#168, gate-log 372):** PASS, with no S1. It found the index update correct and complete, so the index-wrong gate count stays at 0.
    - Draft-caused items it would have caught at drafting, under C4: N1 (the doc paragraph running on), S2-1 (§5's README reasoning), S2-2 (no place named for O1's record) and N2 (a words-form pin). None is blocking, and none causes a correction round.
    - Cost: 127,157 tokens, 38 tool uses, 313,712 ms. Write audit PASS, C3 clean.
  - **Gate 1, the reviewer (#168, gate-log 374):** FAIL. S1-1: T3 is flaky. Its re-key-P-only precondition fails about one run in four, so invalidator I4 fires.
    - **Draft-caused** (C4): the precondition and its 2^-64 assumption were lead-data's drafted text. This is the lead's first draft-caused correction round. The stop rule is the lead's draft adding a correction round on two of four pieces.
    - Reviewer cost: 130,926 tokens, 52 tool uses, 2,392,561 ms.
  - **Amendment 1** (`lead-data` as its own type): 113,476 tokens, 25 tool uses, 352,242 ms. Write audit PASS, by the tracked script's first live use. C3 clean.
    - It makes T3's precondition deterministic by an in-place swap, and it is appended verbatim at 8195789b.
    - The custodian accepted class 1 for the re-declared setup.
  - **Correction round 1** (the worker-high): 217,960 tokens, 26 tool uses, 987,140 ms. Every repetition passed: T3 100 of 100, P1 5 of 5, M1 to M3 15 of 15. The figure is 310 of 320.
  - **Gate 2 (gate-log 375 and 376): PASS and PASS.**
    - The architect confirms class 1 and class 2, and draft-caused. The Stop list does not engage: this is piece 1 of 4, and a further round on the same piece would not raise the count.
    - The architect also records its own gate-1 miss of the assumption, as a gate miss and not a C4 class.
    - Costs: the architect 103,407 tokens, 28 tool uses, 228,390 ms; the reviewer 104,682 tokens, 62 tool uses, 2,608,664 ms.
  - **Node 9's measures so far:**
    - lead-drafted;
    - correction rounds: 1 before commit (draft 2) and 1 after gate 1, both draft-caused;
    - index updated in its PR: yes (C1);
    - index-wrong gate count: 0;
    - human interventions attributable to the lead: none.
- **`subagent-write-audit-script` (not a lead piece).**
  - Worker report 1 recorded verify-mutation at rc 0, but it was rc 1 at its commit.
  - The custodian's live check found the agent-id resolution failing from a worktree; the fix is at 47fe9e54.
  - The final figure is 264 lines, against 250 declared. The first Amendment recorded it as class 8; #167's gate-1 reviewer (S1-1) holds it class 6, and over §21c's 150-line bound, which the declared 250 already crossed at dispatch (a custodian error). The single-gate route closes; the architect gate is taken.

### B1. Trial entries

- **Compaction during the trial:** 2026-10-03T13:30Z (auto, about 769k tokens), 6.4 h after the 07:06Z one. Two pieces were in flight (node 9 and `subagent-write-audit-script`), and lead-data's two drafts and the setup's three gates fell in the interval.
- **A report that came back as a message.** #167's gate-1 reviewer did not write its report file. The reviewer agent type has no Write tool, and this run declined to write the file through its shell, so the report (86 lines) arrived in the custodian's context, and the custodian saved it from the hand-back. Earlier reviewer runs in the trial wrote their files through the shell. Next reviewer briefs say so explicitly: the shell write of the one named report path is permitted.
- **No compaction since 13:30Z.** At the hand-over (about 18:05Z), the interval is about 4.6 h and still running. The session hands over at the human's word, not at a compaction.
- **Two pieces at once, 2026-10-03.** `subagent-write-audit-script` (governance) and node 9 (kernel) ran together from about 12:54Z to about 17:48Z.
  - **Conflicts in paths:** none. Their files were disjoint, and no merge or regeneration conflict arose.
  - **The costs observed:**
    - one `verify:plan` run timed out at 570 s under concurrent cargo load; the re-run passed in 78 s;
    - the custodian's main commits landed during other agents' runs, and twice the human's merge moved main under a pending commit (the guard held it both times);
    - one architect's C3 after-snapshot showed the parallel reviewer's in-progress mutation, attributed by the write audit (zero writes).
  - **The human's attention:** no question round arose from running two pieces, and the human made two merge clicks.
- **Reports to files, this session.**
  - Workers and lead-data wrote their files every time.
  - Reviewers wrote theirs through the shell once the brief said so; one, before that, declined.
  - Architect reports stay messages: four this session, each saved from its hand-back.
- **A finding for the window, not the trial: generation bumps lapsed.** §15 bumps a node's generation on any preregistration amendment. Recent pieces with several amendments stayed at generation 1, node 8 among them. #167's gate-2 architect (N-2) caught it on `subagent-write-audit-script`, which is now at 4; node 9 is at 2.

### B1, continued (session 874d0083)

- **The hand-over, 2026-10-03.** Session e12d1b11 handed over at the human's word at 18:06Z, and the human cleared the context. Session 874d0083 took the lease at 18:19Z. This is a hand-over, not a compaction, so it ends the interval running since 13:30Z (about 4.6 h) without a compaction; that interval is censored at the hand-over.
- **Two pieces at once, from 18:23Z:** node 10 (engine; `engine/` paths) and `guardian-v0` (governance; `tools/mods/`). Disjoint paths. Neither touches `protocol/`, a wire fixture or a lockfile.
- **The P0 worker's report goes to the custodian's scratchpad,** not the repository. The custodian files it, so that a lead-data or architect run's C3 snapshot of the checkout carries no parallel worker's file.

### B2, continued — measured piece 2: node 10, `type-walk-null-literal-arithmetic`. Lead-drafted.

- **Draft 1** (`lead-data` as its own agent type): 181,856 subagent tokens, 42 tool uses, 514,372 ms, from the harness's task notification. Its files read are in its section 4: 17 files by range, plus 4 grep-only reads, with the index cited instead of re-read for six named items.
  - Write audit PASS (one Write, to its path). C3 clean (before 18:23:08Z, after 18:32:28Z).
  - It proposes the full form, and reads the piece as confined by contract (C2), asking the custodian to confirm.
  - **One blocking question, O-1:** whether the `conversion_can_fail` sentence is true for case (b). The node excludes a sixth reason and does not place admitting (b). It is a question about a human-typed string's truth, so it is not counted as a draft-caused correction.
- **Index-wrong gate count:** 0.

## E. Recorder lines as citable evidence

- **Source.** The 2026-10-03 mods-roadmap ruling, item 3 (`state/directives/2026-10-03-evidence-recorder-ruling.md`): whether recorder lines may be cited as evidence goes to this window. The brief's §5 calls it an evidence-rule change (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md`).
- **The question.** May a record (a form's amendment, a worker report, a gate report, a closing record) cite an Evidence Recorder line as the evidence that a command ran at a revision, on a stated dirty-tree identity, with a stated outcome?
- **Bounds the brief already sets** (its §1 and §2):
  - a recorder line records that a command ran; it does not prove that a test's assertions establish a claim, and it is not a mutation observation;
  - CI and the independent gates remain authoritative;
  - a line copied into a tracked record passes the exposure scan and its CI backstop like any other text.
- **State at the window.** `evidence-recorder-v0` is placed after `guardian-v0` and is not built, so no recorder line exists yet. The item is for the human's ruling on the rule, not on observed lines.
