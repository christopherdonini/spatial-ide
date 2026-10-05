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
- **The architect's consult** on the draft's questions 2 and 3 and on O-1's options, filed as `state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-consult.md`: 97,019 tokens, 29 tool uses, 380,185 ms. Write audit PASS (zero writes). C3 clean.
  - **Q2:** confined, on one condition. It is confined if O-1 rules (i) or (ii); (iii) and (iv) make the piece crossing, and the architect drafts it under C2.
  - **Q3:** (a) and (d) are conformance to ADR-021's Note 2026-09-30, so no ruling is needed.
  - **O-1:** both drafted outcomes, (i) `conversion_rounds` and (ii) `conversion_can_fail`, are false of case (b). The consult recommends (iii), admitting (b) narrowly, with (iv), a sixth reason, as the honest fallback.
  - **Two draft defects** it found:
    - §0 F6's grep claim is false: three fixtures name `text_with_non_text`. The custodian confirmed this with `git grep`.
    - §2.2's reasoning for (d) rests on the wrong conversion, and the order between Note items 1 and 2 is unstated.
- **Correction 1, before commit: draft-caused** (C4). Both defects need a correction before the form can be committed, whichever way O-1 is ruled.
  - **The precedent:** node 9's consult-driven draft 2 was counted the same way.
  - **The stop condition.** This is the second of the four measured pieces on which the lead's draft adds a correction round, which is §5's stop condition (the pilot directive). The custodian applies it: drafting returns to the architect, from node 10's next draft on, and the human is told (the pilot direction, item 4).
  - **Raised in the next question round,** with the alternative reading: the correction is not yet made, and under O-1 (iii) or (iv) the architect drafts anyway under C2.
- **The pilot at the stop:** 2 of 4 pieces measured.
  - Draft-caused correction rounds: node 9 two (draft 2; Amendment 1), node 10 one (pending the redraft).
  - The index was updated in node 9's PR; node 10 has none yet. The gate index-wrong count is 0.
  - No human intervention is attributable to the lead.

## F. `AUTONOMY.md` §21a's ADR-021 label

- **Source.** lead-data's node 10 draft (its §1 observation) and the architect's node 10 draft (its Q-4). Confirmed by the ADR file names.
- **The gap.** §21a's security bullet labels ADR-021 "bundling / no-runtime-fetch". ADR-021 is the row-filter ADR (`docs/adr/ADR-021-row-filter-on-viewport-query.md`); the bundle format is ADR-017 (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`).
- **The proposal.** An appended dated note in `AUTONOMY.md`, naming the ADR the label means. No line above it moves (the governing-doc append rule). Nothing is applied before the human's answer.
- **2026-10-03, evening: the two pieces' implementations ran together.** Node 10's worker-high and guardian-v0's worker-high ran from about 19:58Z, in separate worktrees. Node 10's target was on D:.
  - **Conflicts:** none in paths.
  - **A ruling that arrived late.** Round 45, answered at 21:42Z after both workers had finished, carried node 10's O-2. The worker was resumed by message to apply it. The custodian's first message gave the ruling's time as an estimate ("about 20:00Z"), which was corrected by a second message.
  - **Reports to files.** Node 10's worker wrote its report file. Guardian's worker was refused its Write by the harness ("Subagents should return findings as text, not write report files"), did not work around it, and returned the report as its message. The custodian filed it by mechanical extraction from the transcript. The refusal was not uniform across two runs of the same agent type.
  - **The human's attention:** three question rounds this session (43, 44, 45), and typed rulings on round 44 item 1 and round 45 item 2. They arose from the pieces' own OPEN items, not from running two at once.
  - **Costs:** node 10's worker-high, round 1: 106,207 tokens, 48 tool uses, 3,789,091 ms. guardian-v0's worker-high: 330,199 tokens, 117 tool uses, 2,420,319 ms. The architect drafts: node 10 213,452 tokens, 42 tool uses, 751,713 ms; guardian draft 2 186,454 tokens, 42 tool uses, 693,869 ms.

### B1, continued (session 874d0083, 2026-10-04)

- **The compaction:** 2026-10-04T11:19:22Z, automatic. The transcript's record: 767,403 tokens before, 15,354 after, 86,010 ms.
  - It is the first in session 874d0083, 17.0 h after the lease was taken at 2026-10-03T18:19Z.
  - The interval includes the overnight idle: no human turn from round 45's answer (21:42:27Z) to round 46's (08:55:13Z).
  - At compaction one piece was in flight, #170's CI; guardian-v0 had merged at 11:01:20Z.
- **Two pieces at once, the morning of 2026-10-04.** #169 (guardian-v0) and #170 (node 10) were gated side by side from about 09:23Z, with separate worktrees and disjoint paths. Conflicts: none in paths.
- **Reports to files:**
  - Reviewers wrote their reports through their shell: #170 gates 1 and 2, #169 gates 2 and 2b.
  - Architects returned messages, extracted mechanically from the transcript.
  - One instruction to a running worker to append an amendment from a scratch file was denied by the harness as instruction poisoning. The worker did not work around it, and the custodian appended the amendment itself (#169 Amendment 5).
- **The human's attention, 2026-10-04:**
  - question rounds 46 to 49;
  - the shell-route ruling (09:20:13Z) and the G6-backstop ruling (09:44:41Z), both typed;
  - #169's merge click (11:01:20Z);
  - the Guardian install approval (11:25:14Z), and the install and reload (11:28Z to 11:31Z).
  - These arose from the pieces' own OPEN items and gates, not from running two at once.
- **After the compaction:**
  - The freed slot went to `evidence-recorder-v0`'s P0, beside #170's gate 2.
  - Guardian's install put the custodian's own shell commands under G1, and G1 refused two record commands. In each, an apostrophe in heredoc text came before the word push. Nothing ran.
  - Record text is now written with the Write tool, and commit and push run as separate calls.
- **Costs, 2026-10-04, from the harness's task notifications** (subagent tokens, tool uses, ms):

| Run | Tokens | Tools | ms |
|---|---|---|---|
| architect: #169 Amendments 2 and 3 | 125,704 | 14 | 420,857 |
| worker-high: #169 correction round 1 (first run) | 98,525 | 19 | 84,282 |
| architect: #169 Amendment 4 | 136,063 | 18 | 498,065 |
| worker-high: #169 correction round 1 | 190,064 | 66 | 669,217 |
| worker: Guardian README R11 | 25,787 | 8 | 69,023 |
| #169 gate 2 architect | 169,558 | 37 | 368,681 |
| #169 gate 2 reviewer | 191,853 | 57 | 862,970 |
| #169 gate 2b reviewer | 97,649 | 26 | 559,061 |
| lead-data: E5 probe | 12,737 | 2 | 23,473 |
| worker: evidence-recorder-v0 P0 | 236,363 | 96 | 1,234,077 |

### B2, continued — node 10 after the stop (measured piece 2)

Drafting returned to the architect at the stop. The rows below are the piece's later rounds, each classed under C4; none counts against the lead.

- **Gate 1** (head c6809d0c). The reviewer: FAIL. Its S1-1 falsified §2.1 at DuckDB v1.5.5 (a NULL-op-NULL result passed comparison rule 2 and cast a file column). The architect's report was filed alongside.
  - **Correction round 1, draft-caused, by the architect's crossing draft** (§2.1's shape), not the lead's: Amendment 1, class 1, remedy B.
  - **Changed scope:** Amendment 2, class 9 (round 49, item 1, the unary `-NULL` fold).
  - **The round's own class-2 result:** Amendment 3.
- **Gate 2** (head 3074e9a0). The architect: PASS. The reviewer: FAIL. Its S1-1 is a test comment stating a binder refusal without DuckDB's version; the architect's N1 named the same comment as non-blocking.
  - **Correction round 2, implementation defect:** one comment line.
- **The index:** updated in its PR before the final gate (a5325ad4; last verified at 8efcde9). Gate 2's architect found §2.7 present and matching. Index-wrong gate count: 0.
- **The human's interventions** were rulings on OPEN items and gate findings (rounds 45, 46 and 49), not attributable to the lead's draft.
- **Costs** (subagent tokens, tool uses, ms):

| Run | Tokens | Tools | ms |
|---|---|---|---|
| worker-high: implementation (resumed for O-2) | 118,518 | 14 | 1,847,896 |
| gate 1 architect | 118,199 | 44 | 315,096 |
| gate 1 reviewer | 120,051 | 50 | 1,585,239 |
| architect: the S1-1 remedy consult | 164,804 | 28 | 679,027 |
| worker-high: correction round 1 | 135,984 | 53 | 2,638,318 |
| gate 2 architect | 158,183 | 53 | 406,371 |
| gate 2 reviewer | 159,466 | 57 | 1,622,765 |

## G. Guardian's G1 over-refuses text that leaves a quote open before the word push

- **Source.** Question round 50, item 3 (RULED 2026-10-04): a window item. The two refusals are recorded in Guardian's Amendment 8 (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md`), at 11:33:53Z and 11:42:00Z.
- **The gap.** G1 refuses any Bash call in which an apostrophe leaves a quote open before the word push (§2.2's unbalanced-quote rule, F7). That includes heredoc record text that runs no push at all. The README's over-refusal list (line 31) names text that holds a force-push spelling; it does not name this shape.
- **The workaround in use:** record text is written with the Write tool, and commit and push run as separate calls.
- **The proposal, two parts, each by its own amendment or piece:**
  1. A README limit line naming the shape and the workaround.
  2. Later, whether G1 should change, for example by reading heredoc bodies as text.
  3. Added 2026-10-04, after E5 passed at 2.1.289 (Guardian's Amendment 9): narrow README line 44 (R11) to line 73's condition. The write audit was primary until E5 passed, and is the backstop now. This is the gate-2 architect's S2-1, and the install sight note's item 2. Drop the line's stray `R11.` label in the same edit. Part 1 and this part are both README edits, so one small piece can carry them.
- Nothing changes in Guardian before the human's answer.

## H. The 2026-10-04 prompt audit: the triage, and classes (a) to (c)

- **Source.** The 2026-10-04 prompt-audit instruction (`state/directives/2026-10-04-prompt-audit-instruction.md`), items 1 and 2. The audit is filed as Evidence at `state/consults/2026-10-04-prompt-audit.md`. Its finding ids (H1 to H6, M1 to M6, F1 to F4, P1) are used below.
- **The classes,** as the instruction sets them, paraphrased:
  - (a) a verbatim human ruling: never deleted or paraphrased, and only moved into a referenced file, with the human's approval and an architect check;
  - (b) ordinary prose that is not a ruling: rewritable;
  - (c) an instruction that compensates for a model weakness: a candidate for a measured trial, not for deletion;
  - (d) a stale fact.
- **The custodian's triage:**

| Finding | Where | Class | Route |
|---|---|---|---|
| F1 | the ~10 KB ruling block on `.claude/agents/architect.md:11`, `reviewer.md:25` and `worker.md:25` | (a) | this item |
| M2 | `CLAUDE.md:38`, the commit-style line: an instruction, not a ruling. History mostly uses `<type>(<scope>):`, and test, ci and style are in use, so a rewrite changes a stated convention. | (b) | this item |
| M4 | `CLAUDE.md:8`, the 2026-09-07 note: a dated correction of record written by the custodian (914ef9f6). Its facts still hold. | (b) | this item |
| M6 | `.claude/agents/worker.md:29`, the report cap of about 20 lines | (c) | this item |
| H2, H4, M1, M3, F2, F3 | `CLAUDE.md:8`, `:23`, `:24`, `:28`, `:38` | (d) | the CLAUDE.md stale-facts piece (instruction item 3) |
| H1, H3, H5, H6, M5 | `.claude/agents/tester.md:12`, `architect.md:11`, `reviewer.md:25`, `worker.md:25`, `reviewer.md:16` | (d) | listed for placement; outside item 3, which names CLAUDE.md only |
| F4 | the CLAUDE.md copy in `.claude/worktrees/verify-mutation-header-token/` | (d), a drifting duplicate | listed: disposing of that worktree is the human's call (the continuity block's inspect-before-removing list) |
| P1 | a pinned model id in an account-synced skill | provided content | no action: it is outside the repository |

  - Two notes on the triage:
    - H3, H5 and H6 sit on the same lines as F1's ruling text, but outside its byte-copied spans (the audit, §3). Editing them still runs verify-quotes' hash scan and governance CI.
    - Not raised by the audit: `CLAUDE.md:12-17`, the non-negotiables, are cited as verbatim rulings in `PRECEDENTS.md` (by path and line). In effect they are (a), and they bind the stale-facts piece to in-place replacement with no line moved.
- **For the human, as one item:**
  - **(a) F1.** The audit's options:
    - keep the reproduction, one ruling per paragraph, with the operative sentence first;
    - put the shared gate rules in one file the three agents read;
    - reduce the agent text to operative rules cited by round and item.
    Under class (a), only a move into a referenced file is open, with the human's approval and an architect check. Each byte-copy marker must stay on the line of its reproduction (verify-quotes).
  - **(b) M2 and M4.** Rewritable on the human's word. M2 changes a stated convention, so it is a rule change, not a fact.
  - **(c) M6.** A measured trial in place of deletion: the same small piece dispatched to a worker with and without the cap, comparing whether each hand-back keeps every required item (the audit's §4 probe).
  - **(d) outside CLAUDE.md:** H1, H3, H5, H6 and M5 in the agent definitions, and F4, are each for the human to place.

### G, continued (2026-10-05): brought forward

- **The human's 2026-10-05 direction, line 2** (`state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md`; RULED 2026-10-05) brings this item forward into `guardian-v1` (`state/directives/MODS-V1-2026-10-05.md`, §2.1). Parts 1 and 3 above are carried by that piece's README edits, and part 2 by its G1 fix.
- **At the window,** this item is reported as moved, with the piece's state. Nothing here is for a ruling any more.

## I. AUTONOMY §9's docs-only auto-merge, not used while Guardian is installed

- **Source.** The human's 2026-10-05 direction, line 2, and Fable's step f in the same file.
- **The rule in force.** Line 2: G7 refuses every agent pull-request merge, so §9's docs-only auto-merge is not used while Guardian is installed. That holds from 2026-10-05, whether or not `guardian-v1` has merged.
- **The proposal.** An appended dated note at the end of `AUTONOMY.md` (the governing-doc append rule) recording the suspension and its condition, citing line 2. §9's own text is not edited. Nothing is applied before the human's answer.

### B2, second pilot (2026-10-05): impact reads, never drafts

- **Source.** `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` (Fable; the human's 2026-10-05 direction, line 3; RULED 2026-10-05). Its §4 asks for the baseline before the first measured piece; this is it. The first pilot's log above stays as it is.
- **The baseline,** named before the first measured piece (`data-plane-terminal-without-credit`): the six most recent architect drafts of pieces touching `engine/` or `kernel/` that had no impact read, newest first.
  - **Touching** means the piece's PR changes a path under either folder (`gh pr view --json files`). For the piece in flight, the branch's three-dot diff is used.
  - **Drafting cost** is the subagent tokens, tool uses and ms from each drafting run's task notification in the session transcript. A piece with two drafts lists both and their sum.

  | Node | PR | Drafting consult(s) | Tokens | Tools | ms |
  |---|---|---|---|---|---|
  | `timing-assertions-under-contention` | #175 (open) | `state/consults/2026-10-04-timing-assertions-under-contention-architect-draft.md` | 210,168 | 79 | 684,375 |
  | `timing-tests-assert-property-not-budget` | #174 | `state/consults/2026-10-04-timing-tests-assert-property-not-budget-architect-draft.md`, then `-architect-draft-2.md` | 169,330 + 105,944 = 275,274 | 68 + 34 = 102 | 539,818 + 446,542 = 986,360 |
  | `watch-grandparent-spawn-signal` | #173 | `state/consults/2026-10-04-watch-grandparent-spawn-signal-architect-draft.md` | 143,028 | 37 | 405,054 |
  | `type-walk-null-literal-arithmetic` | #170 | `state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-draft.md` | 213,452 | 42 | 751,713 |
  | `skp-cancel-state-closed-set` | #160 | `state/consults/2026-10-02-skp-cancel-state-closed-set-architect-draft.md` | 230,855 | 83 | 646,683 |
  | `workspace-rustfmt` | #157 | `state/consults/2026-10-02-workspace-rustfmt-architect-draft.md` | 193,165 | 61 | 618,516 |

  - **Per piece:** about 211,000 tokens (1,265,942 over six), about 67 tool uses (404 over six) and about 682,000 ms.
  - **One confound.** The `type-walk-null-literal-arithmetic` architect draft came after the first pilot's lead-data draft of the same node (B2, measured piece 2, above), so it may have had that draft to start from. It had no impact read, so the brief's definition includes it.
  - **Excluded,** because their PRs change nothing under `engine/` or `kernel/`: `guardian-v0` (#169), `evidence-recorder-v0` (#172), `publish-attempt-lifecycle-src-tauri` (#165), `port-1-linux-l1` (#164), `stop-hook-stale-continuity` (#161), and the earlier 2026-10-02 governance forms.
- **Per measured piece,** the log records the brief's §4 items: the impact read's cost and the architect's drafting cost; each wrong or missing pointer and who found it; each correction round, classed (C4), counted against the lead only when a pointer caused it; whether the index was updated in the PR; and whether a report names something from the impact read that the form used.
- **C3 log:** for each lead-data dispatch, the custodian checkout's and the assigned worktree's `git status --porcelain`, before and after.

### B2, second pilot — measured piece 1: `data-plane-terminal-without-credit`

- **The impact read** is `state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md`: 307 lines, sha256 dcb21e03e8bdc5bad32435a06aed164eb275bce56c62755a54cee030451a1941, filed byte-identical as lead-data wrote it, read at main c823bce5.
  - **Cost** (the harness's task notification): 234,750 subagent tokens, 110 tool uses, 535,439 ms. The run lasted 00:36:12Z to 00:45:08Z.
  - **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 53, Grep 47, Glob 8, the hand-back 1).
  - **C3:** before (00:35:55Z), the checkout held only its two pre-existing untracked items. After (00:45:16Z), it held those and the report. Main moved from c823bce5 to 06200a1e during the run, by the custodian's own commit filing #175's gate-1 reviewer report.
  - **Content:** pointers and five gap questions. The custodian's read found no draft text, design, recommendation or OPEN-item answer in it. Four pointers spot-checked by the custodian resolve and say what the read claims; that is not a gate finding.
  - **Found missing or inconsistent by the lead itself** (not by the architect or a gate): no ADR-014 file, which `protocol/data-plane/README.md` names as reserved; no KNOWN-LIMITATIONS item names the stall; `protocol/data-plane/README.md`'s ceiling list gives `START_TIMEOUT` as 10 s, against 120 s in `server.rs` and elsewhere in the same README.
- **The architect's draft** follows, with the read's path in its brief. Its cost, the pointers it used, found wrong or found missing, the correction rounds and the index update are logged here as they happen.
