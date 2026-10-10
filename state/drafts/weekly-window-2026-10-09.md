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
- **The architect's draft** is `state/consults/2026-10-05-data-plane-terminal-without-credit-architect-draft.md` (report sha256 ad52818b, extracted from the hand-back).
  - **Cost** (the harness's task notification): 273,907 subagent tokens, 61 tool uses, 1,014,793 ms. The run lasted 00:49:09Z to 01:06:04Z. Write audit PASS: zero writes.
  - **Combined, impact read plus draft:** 508,657 tokens, 171 tool uses, 1,550,232 ms. The baseline above averages about 211,000 tokens, 67 tool uses and 682,000 ms per draft. No threshold is set (the brief's §5); the human judges at the end.
  - **The form** is committed at `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`, 81 pins at 92a71c30.
  - **Pointers found wrong, by the architect** (at drafting, not by a gate):
    - W1: the read lists the attribution-race cancel as a Redeemed-arm caller. It meets the Pending arm, and no data-plane stream exists for it. The custodian confirmed this against the code.
    - W2: the read says every kernel test client grants credit. h2_a and h3 in `kernel/tests/end_to_end.rs` grant none.
  - **Pointers found missing, by the architect:** seven, its M-a to M-g:
    - the ticket registry's lock around the Redeemed-arm cancel;
    - the other `SourceCancel` implementors;
    - the transport-leakage scan's forbidden-word list;
    - the process-global trace;
    - receive-first's effect on the memory bound;
    - the shell's supersede order;
    - `EngineCancel`'s construction site.
  - **Correction rounds caused by a pointer:** none so far. The form had no correction round before commit.
  - **A report names something from the read that the form used:** yes. The draft's part 4 says all five questions are answered (Q1 by §2's path table and Part 2, Q2 by Part 3 and OPEN-2, Q3 by T1 with M0 and M1, Q4 by T2, Q5 by §0.7). It also lists the read's sections that drove §0.2, §0.4, §0.7, §2, §4, §5 and Part 4.
  - **The index update** is owed in the PR (the form's Part 4 and §8 item 18).
- **Before code, two amendments.**
  - Amendment 1 (class 5) records question round 54's typed rulings.
  - Amendment 2 settles Fable's round-54 advice. The architect drafted it: 111,659 subagent tokens, 35 tool uses, 392,352 ms. With the read and the first draft, the drafting total is 620,316 tokens, 206 tool uses and 1,942,584 ms.
  - Neither amendment was caused by a wrong or missing pointer of the impact read, so neither counts against the lead (the brief's §4). Amendment 2's four points came from Fable's reading of the form, not from the read.
- **The index update (§1 item 2; C1):**
  - lead-data wrote it: 120,891 subagent tokens, 52 tool uses, 210,264 ms. Write audit PASS; C3 clean. Filed at `state/consults/2026-10-05-data-plane-terminal-without-credit-index-update.md`.
  - It changes three kernel index lines (5 changed lines). Engine's index is unchanged.
  - A worker applied it in the PR as 3f7b1949 (26,425 tokens, 5 tool uses): all three current lines matched.
  - **Index updated in the PR: yes.**
  - lead-data also found that the form's Part 4 names an owner's-index update in `protocol/data-plane/README.md`, which has no Owner's index. It is left to the gates.
- **The PR:** #176. The gates' findings on pointers are logged here when they report.

## J. Compactions that went through with a stale continuity block (a proposed window measure)

- **Source.** Fable's context-management evaluation, `state/directives/2026-10-05-fable-evaluation-context-management.md`, item 1. It is adopted as a window measure only if the human agrees. The proposal it evaluates is not in the repository.
- **The measure,** from existing records only:
  - the block records the pre-compaction hook writes, one file per session under the checkout's Claude state folder;
  - each automatic compaction's boundary time in its session transcript;
  - the times of the commits that flushed the block.
  - Count the automatic compactions that went through while the block was stale.
- **Reported separately, as Fable's item 1 names them: E and N1.** N1 went live at the Guardian install (11:28Z to 11:31Z on 2026-10-04), after the 11:19:22Z compaction, so that compaction counts for E alone.
- **If the count is not zero:** the path that let the compaction through is named first. Then a small governance node is proposed for a resume-time line saying how many ledger commits the block is behind (Fable's item 2 (c), in `scripts/hooks/session-resume.mjs`).
- **Not proposed** (Fable's items 2 and 3): Context Keeper v0, and the meter band.
- **Agreed by the human, 2026-10-05** (`state/directives/2026-10-05-item-j-ruling-and-advisor-proposal.md`; RULED 2026-10-05). Nothing is built. Context Keeper v0 and the meter band are not approved. A count that is not zero goes to the human with the path that let the compaction through, before any proposal. The ideas advisor's proposal is filed in the same file.
- **The count, 2026-10-05,** from existing records only:
  - **The records used:**
    - the PreCompact hook's block records (`lastBlockedAt`, one per session, under the checkout's Claude state folder);
    - each automatic compaction's boundary in its session transcript;
    - the commits that changed `state/CUT-STATE.md`, with each one's `flushed_at`.
  - **The rule:** "stale" is the PreCompact hook's own rule, the one that blocks (`scripts/hooks/precompact-flush.mjs`, its header): `flushed_at` within 10 minutes and at or after the last ledger change, `tip` at HEAD, a clean porcelain, and HEAD pushed. A stale block is blocked once. A second PreCompact within 15 minutes of that block is allowed, whatever its state.
  - **E** (the Stop-hook staleness check, merged as #161 at 2026-10-03T05:32:38Z): four automatic compactions since. Three went through after the hook had judged the block stale, with no flush between the block and the second call:

    | Compaction (boundary) | Session | The block | The flush state |
    |---|---|---|---|
    | 2026-10-03T07:06:13Z | e12d1b11 | inferred, not on record: the session's record was overwritten by its later block at 13:26:16Z | last flush b6977ba9, `flushed_at` 06:19:50Z, 45 minutes earlier |
    | 2026-10-04T11:19:22Z | 874d0083 | 11:17:44Z | flush commit c7d0b200 five seconds before the block (`flushed_at` 11:16:54Z). The block text was current; which other condition the hook found failing (tip, porcelain or the push) is not on record |
    | 2026-10-05T00:18:31Z | 128d8fa3 | 00:16:52Z | last flush 4398a779 (`flushed_at` 00:00:40Z, 16 minutes earlier). The human's direction of 00:15:15Z was filed but uncommitted |

    The fourth compaction (2026-10-03T13:30:18Z) went through after a flush: block at 13:26:16Z, then commit 4c50677c at 13:28:54Z (`flushed_at` 13:23:21Z), before the compaction started.
  - **N1** (Guardian's nudge, live from 2026-10-04 11:28Z to 11:31Z): one automatic compaction since, at 2026-10-05T00:18:31Z, which went through stale as above.
  - **E: 3. N1: 1.** The count is not zero.
- **The path that let them through** (to the human before anything is proposed):
  1. **The second-chance window.** After one block, the next PreCompact within 15 minutes is allowed whatever the block's state (`scripts/hooks/precompact-flush.mjs`, its header; AUTONOMY.md §7). The two whose blocks are on record started about 13 and 16 seconds after their blocks, by each boundary time less the compaction's recorded duration. The 2026-10-03T07:06Z compaction has no block on record.
  2. **The block's reason reached nothing the model sees.** Neither transcript holds the hook's block message near its block. The hook's header says the message is shown to the user for a manual `/compact`, and an automatic compaction is skipped. So nothing prompted a flush inside the window.
  3. **E and N1 judge staleness by a different rule:** a ledger commit that did not rewrite `flushed_at`. By that rule the block at 00:16Z was fresh: its last ledger commit, 4398a779, had rewritten `flushed_at`. The PreCompact hook's rule judged it stale.
  4. **No N1 nudge text with a fill percentage appears** in either transcript. The automatic compactions ran at about 767k to 775k tokens, about 77% of a 1M window, which is below N1's threshold of 80. Whether that is why N1 stayed silent depends on which fill N1 reads (the Guardian form's §2.8 discloses the case). It is not settled here.
- **Nothing is proposed** until the human has the path (the item J ruling).

### B2, second pilot, continued (2026-10-05)

- **Piece 1, `data-plane-terminal-without-credit`, at the gates (#176):**
  - Gates 1 to 3, both gates each time (gate-log 402, 403, 405, 406, 408 and 409): no gate found an impact-read pointer wrong.
  - Two correction rounds, neither caused by a pointer (C4), so neither counts against the lead:
    - round 1: an implementation defect (the identity sentences wider than the discard drain, an unreachable arm), plus the custodian's record (Amendment 3's as-written hash, the I-7 reading);
    - round 2: the custodian's record (Amendment 4 item 1 over round 12 (d)'s ceiling).
  - Both gates passed at gate 3; the PR waits for the human's click.
- **Measured piece 2: `b1-engine-kernel-half-followups`.** It is placed (engine, order 14) but not in a slot: #176 and #177 hold both. As for piece 1, the read precedes the architect's draft, and no code starts before a slot frees.
  - **The impact read** is `state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md`: 159 lines, sha256 64261f6e53d23208b75b0cb4e763332602756c581e5772efdba4bc769283b71b, filed byte-identical as lead-data wrote it, read at main e29c6f86.
  - **Cost** (the harness's task notification): 163,461 subagent tokens, 80 tool uses, 345,992 ms. The run lasted 12:03:50Z to 12:09:36Z.
  - **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 40, Grep 38, the hand-back 1).
  - **C3:** before, the checkout held only its two pre-existing untracked items; after, those and the report. There was no worktree.
  - **Content:** pointers and five gap questions. The custodian's read found no draft text, design, recommendation or answer. verify-cites resolves every rooted pointer. Three spot-checks (ADR-023's Status line, the B1 form's line 783, the conformance header's lines 3-6) say what the read claims; that is not a gate finding.
  - **Found by the lead itself** (not by the architect or a gate):
    - its own §1.5 range `kernel/tests/skp_projection.rs:917-921` ends one line short (922), disclosed in its hand-back;
    - D2 may be moot at main, because the conformance header now names the 5d4da4d run;
    - B1's form is closed to further additions before B1's close;
    - `kernel-close-races-followups` claims part of the same recorded-mutation cites;
    - a third nullable-only doc site that no gate named.
  - **The architect's draft** follows, with the read's path in its brief.
- **Piece 2, the architect's draft** is `state/consults/2026-10-05-b1-engine-kernel-half-followups-architect-draft.md` (report sha256 f6d42b99, extracted from the hand-back).
  - **Cost** (the harness's task notification): 179,997 subagent tokens, 49 tool uses, 570,825 ms. The run lasted 12:15:03Z to 12:24:34Z. Write audit PASS: zero writes.
  - **Combined, impact read plus draft:** 343,458 tokens, 129 tool uses, 916,817 ms. Piece 1's combined figure was 508,657 tokens, and the baseline averages about 211,000 tokens per draft. No threshold is set; the human judges at the end.
  - **The form** is committed at `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, 58 pins at b438c587. It is a full form, because B1's form is closed to additions.
  - **Pointers found wrong, by the architect:** none, beyond the range the lead itself disclosed (`kernel/tests/skp_projection.rs` 917-921, which ends at 922).
  - **Pointers found missing, by the architect:** six.
    - `kernel/tests/wire_bytes_invariant.rs` 368-372, a B1 comment inside the very claim the read cites at `PLAN.yaml:3098`.
    - The gate-3 reviewer's row 9.6(a), which contradicts the architect note the read pointed to.
    - The publish batch policy that decides question 2, and its two constants.
    - `BatchStream`'s private `rx` field; the read gave only its use.
    - The fixture's `text` column size.
    - SKP-V0 §8's last dated note, the precedent for question 4.
  - **Correction rounds caused by a pointer:** none so far. The form had no correction round before commit.
  - **A report names something from the read that the form used:** yes. The draft's part 4 lists the pointers it used, from all six of the read's sections and all five questions.
  - **The index update** is owed in the PR (the form's §2, Owner's index: `engine/README.md` only).

## K. The Stop hook does not know the two-pieces limit

- **What happens.** The Stop hook (`scripts/hooks/stop-queue.mjs`) allows a stop only when the ready set is empty or holds only human-blocked nodes (its step 6). It does not count pieces in flight. So while two pieces wait on the human, a ready node held by the slot rule (the two-pieces trial; `state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md`, step d) is named as next at every stop.
- **Observed on 2026-10-05,** from this session's transcript: eight blocks naming a held node. Two named `evidence-recorder-v0-1`, at 05:19Z and 05:23Z, while #175 and the data-plane piece held the slots. Six named `b1-engine-kernel-half-followups`, from 12:00Z to 12:51Z, while #176 and #177 held them. Each block is a continuation counted against the session cap (6 consecutive) and the daily cap (40).
- **What the custodian did:** recorded the hold in the ledger once, at 05:22Z and at 11:59Z. During the second hold it used the wait for the held node's pre-slot drafting: the impact read and the architect's form, as for the data-plane form. It did not start code.
- **For the human at the window, not proposed here:** whether the hook should treat a ready node as held when the in-progress count is at the limit. The limit is a trial's rule, not in `AUTONOMY.md`.

## L. Operator strings shipped as P6 placeholders, waiting for the human's wording

- **Source.** The data-plane form's closing record (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`, Amendment 6, item 5), on the #176 gate-1 architect's N-9: the form has no Operator gate, so the closing record names where the string waits.
- **The string:** the new data-plane detail on an owner's cancel whose source then ends without failure. It ships beginning with `[P6 placeholder]`, at `protocol/data-plane/src/adapter_ws.rs:384 @ 0b7e1b62b9c7c4a9df2e5fb930a6c40288ae1f7a sha256:76179b19a3286a033c32089225c4395c94698037e3f1ca4ae044be87e976ab8e`.
- **For the human:** its wording, at P6. Nothing waits on it; the string is shipped and marked as a placeholder.
- **Piece 2, the implementation and the index update:**
  - The worker-high built it at 9c8e7930 (181,775 tokens, 138 tool uses, 6,292,916 ms). It is worker report 1.
  - lead-data wrote the index update: 87,854 tokens, 38 tool uses, 188,654 ms. Write audit PASS (one Write, its report path). It is filed at `state/consults/2026-10-05-b1-engine-kernel-half-followups-index-update.md` (sha256 6954639d).
  - It changes three `engine/README.md` lines (6 changed lines) and nothing in `kernel/README.md`. It lists two existing gaps, not changed: the Publish stream row does not name `resolve_projection`, and `kernel/README.md`'s line for kernel halves filed elsewhere does not name this form.
  - A worker applied it in the PR as 7b05dfd6 (26,054 tokens, 6 tool uses). All three current lines matched.
  - **Index updated in the PR: yes.**
- **The PR:** #178. The gates' findings on pointers are logged here when they report.

### B2, second pilot — a candidate configuration, for the result (not tried)

- **Source:** `state/directives/2026-10-05-fable-evaluation-index-without-the-lead.md` (Fable, on the ideas advisor's follow-up; an evaluation that authorises nothing).
- **The option, named for the pilot's result:** "the index without the lead". The implementing worker updates the Owner's index in the piece's PR, the reviewer checks it against the diff, and a pointer script checks every pointer on every PR, with no lead-data dispatch. It is a candidate next configuration, not a compared result: no piece has run that way.
- **The pilot runs unchanged** for pieces 3 and 4.
- **A measure the evaluation proposes,** for the human to decide on at the result: whether each architect draft since the index existed, the baseline's included, read the Owner's index sections of `engine/README.md` or `kernel/README.md`, from the transcripts only. Not computed: nothing authorises it yet.
- **Conditions if the option is ever tried:** the evaluation's item 4, by reference.

### J, refreshed (2026-10-05, on Fable's note)

- **Source:** `state/directives/2026-10-05-fable-note-item-j-refresh.md`. The block record for session 128d8fa3 reads 2026-10-05T11:30:44.895Z, later than the 00:16:52Z block the count used.
- **One more automatic compaction** is on record, by the same records and the same rule as the count above:

  | Compaction (boundary) | Session | The block | The flush state |
  |---|---|---|---|
  | 2026-10-05T11:33:48.981Z (trigger auto; 770,191 tokens before; 84,467 ms, so it started about 100 seconds after the block) | 128d8fa3 | 11:30:44.895Z | the last flush 9c40d22f (committed 11:21:49Z, `flushed_at` 11:21:10Z, within 10 minutes). A tracked file was modified: the custodian appended gate-log entry 404 to `state/gate-log.json` at 11:30:42Z, 2.5 seconds before the block, so the hook's no-modified-tracked-file condition failed |

  - It went through on the second chance, as path item 1 describes.
  - No N1 nudge text appears in the transcript. The fill was about 77% of a 1M window, below N1's 80, as path item 4 describes.
- **The count is now E: 4, N1: 2.** The human's 2026-10-05 context-flush direction, item 4, replaces this count by the brief's measure from the first automatic compaction after piece A merges.
- **Piece 2 at the gates (#178), merged as f12a8eac:**
  - **The impact read's pointers,** found by the gate-1 architect: the K-5 range (the lead had disclosed it); `engine/README.md:518` and `kernel/README.md:376` missing, the second of which flowed into the form's §2 wording (its N-4, routed); and §1.2's "only" claim, too wide for the path.
  - **No gate found an index-update pointer wrong.**
  - **One correction round,** not caused by a pointer (C4): the worker kept a stale count in K-3's rewritten comment (an implementation defect). It does not count against the lead.
  - **The index was updated in the PR:** yes.

### B2, second pilot — measured piece 3: `kernel-close-races-followups`

- **The piece** took the product slot that #178 freed (kernel-protocol, order 13). Its read precedes the architect's draft, as for pieces 1 and 2. No branch exists yet.
- **The impact read** is `state/consults/2026-10-05-kernel-close-races-followups-impact-read.md`: 137 lines, sha256 80a69e996b41cb0cc333f57db63daf8fda1b68019837110ba96997d47f661424, filed byte-identical as lead-data wrote it, read at main e32798ae.
- **Cost** (the harness's task notification): 156,351 subagent tokens, 108 tool uses, 484,638 ms. The run lasted 19:07:23Z to 19:15:28Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 53, Grep 51, Glob 2, the hand-back 1). One Grep timed out at 19:11:32Z; that is not a write.
- **C3:** before, the checkout held only its two pre-existing untracked items; after, those and the report. There was no worktree.
- **Content:** 19 site rows, the consumers, the governing texts, five gap questions and one missing pointer. The custodian's read found no draft text, design, recommendation or answer. verify-cites and verify-quotes pass over it.
- **Found by the lead itself** (not by the architect or a gate): its question 1 quotes a one-word span from the close-races worker report in lower case where the source line has a capital. The lead disclosed this in its hand-back and left it, because its brief allowed one write. It is a quoting defect, not a pointer, and not design text.
- **Measured piece 4 is next in line:** `geometry-types-beyond-polygons` (MP-1). ADR-034 was accepted on 2026-10-05, and MP-1's preregistration may be written now. Its impact read comes before its architect's draft, before a slot frees.
- **The architect's draft** of piece 3 follows, with the read's path in its brief.
- **Piece 3, the architect's draft** (`state/consults/2026-10-05-kernel-close-races-followups-architect-draft.md`): 201,152 subagent tokens, 72 tool uses, 548,131 ms, from 19:25:32Z to 19:34:40Z. Write audit PASS, with zero write calls. Its files-read section reports the impact read's pointers as follows (the architect's findings, not a gate's):
  - **used:** every §0 pointer, rows S1 to S9 and S11 to S19, the consumer list (which became OPEN-1), the governing texts, and Q1 to Q5;
  - **found wrong:** Q1's case (the lead's own disclosure); S9's message span (it opens at 427, but the message runs from 429 to 431); S8's `touch_modification_time` line (the doc comment's start, not the `fn`; called imprecise);
  - **missing:** nine, among them skp.rs's `TicketLiveness` doc misattributing a quotation (C4), `liveTicketSet.ts`'s same single-site claim, T1's assertion message naming a renamed function, T1 to T3's commit-less recorded mutations (OPEN-3), two precedents, AI_DEVELOPMENT §B's escalation rule (OPEN-2), that `gate:` names a form file, and two more index lines.
- **Combined cost of piece 3** (read plus draft): 357,503 subagent tokens, 180 tool uses, 1,032,769 ms.

### B2, second pilot — measured piece 4: `geometry-types-beyond-polygons` (MP-1)

- **The piece** is ready (engine, order 6) since ADR-034's acceptance, and holds no slot: `guardian-v1` and `kernel-close-races-followups` hold both. As for pieces 1 and 2, the read precedes the architect's draft, and no code starts before a slot frees.
- **The impact read** is `state/consults/2026-10-05-geometry-types-beyond-polygons-impact-read.md`: 151 lines, sha256 6e4faa93fdfbe2541d0d9ae6bca20c82845848d5005d327fc4536a610d56a9df, filed byte-identical as lead-data wrote it, read at main 2d4fa886.
- **Cost** (the harness's task notification): 244,737 subagent tokens, 140 tool uses, 500,623 ms. The run lasted 19:30:09Z to 19:38:30Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 70, Grep 66, Glob 2, the hand-back 1).
- **C3:** before, the checkout held only its two pre-existing untracked items. After, it held those, the report, and the custodian's own filings in progress: the `kernel-close-races-followups` form and its draft consult, `guardian-v1`'s Amendment 6 draft consult, PLAN and this file. Each of those paths is the custodian's, written by the custodian's scripts in this window.
- **Content:** interfaces in nine groups, consumers, governing texts, five gap questions, and a list of stale pointers in existing records, recorded and not fixed. The custodian's read found no draft text, design, recommendation or answer.
- **The architect's draft** of MP-1's form follows, with the read's path in its brief.
- **Piece 4, the architect's draft** (`state/consults/2026-10-05-geometry-types-beyond-polygons-architect-draft.md`): 373,539 subagent tokens, 122 tool uses, 1,036,307 ms, from 19:45:56Z to 20:03:12Z. Write audit PASS, with zero write calls. Its files-read section reports on the impact read's pointers (the architect's findings, not a gate's):
  - **found wrong:** two readings, not pointers. One: the read says KNOWN-LIMITATIONS item 9 and a README line become untrue under MP-1, but both describe the v0.1.0 artifact and stay true. Two: the read gives a deck.gl version from a line that records an older version than the lock resolves; the architect calls the pointer accurate and the fact historical.
  - **missing:** the envelope's constructors and their call sites; the stream's `Pending` builder; the unordered streams' lack of reproducible cuts; the view query's covering-bbox refusal; the installed deck.gl version; more `.rings` sites, eight test files among them; the Tauri prepare-refusal precedent; that KNOWN-LIMITATIONS has no item 29; and the red-line list that makes question 1 the human's.
- **Combined cost of piece 4** (read plus draft): 618,276 subagent tokens, 262 tool uses, 1,536,930 ms.
- **Piece 4, the index update** (`state/consults/2026-10-06-geometry-types-beyond-polygons-index-update.md`): 220 lines, sha256 8f723ca0adc75076d463770e1ca9d3c3f828f99330c90496bbc5366c402093a3, filed byte-identical as lead-data wrote it, read at the branch's 3c29bc67.
  - **Cost** (the harness's task notification): 126,759 subagent tokens, 43 tool uses, 294,503 ms. The run lasted 04:58:25Z to 05:03:20Z on 2026-10-06.
  - **Write audit PASS:** one Write, at its REPORT PATH line's path (Grep 25, Read 11, Glob 5, the hand-back 1).
  - **C3:** before, the checkout held only its two pre-existing untracked items. After, it held those and the report.
  - **Content:** 13 lines replaced in place across both READMEs, 26 changed lines; the docs group stands at 88 of 130 once applied. It found no pointer made wrong. It adds three items to the engine's Open and admission row beyond the form's list, within that row, and leaves them to the final review.
  - **This is the lead's last dispatch** under the 2026-10-05 clarification. The pilot's result is judged when the freeze lifts.

## Reduced by the 2026-10-05 product-first direction

- **The window is reduced** to section 6's measures and anything that blocks product work (`state/directives/2026-10-05-product-first-direction.md`, section 1, its last bullet). Every other item above waits for the first window after the freeze lifts. The freeze lifts when shell-migration milestone 1 and MP-1 have both merged.
- **Section 6's measures, to be reported:**
  - product pull requests merged against governance pull requests merged;
  - question rounds per day;
  - correction rounds caused by documentation against those caused by code;
  - the days the critical path waited on a person.
- **Section 3's won't-fix bar:** each use at triage is listed here.
- **The lead-data second pilot** (B2 above) has run its four reads. Its result is judged when the freeze lifts, not at this window.
- **The compaction measure** (round 61, item 2; `scripts/hooks/COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md`, §2, item 6): its rows are reported at this window. They start at the first automatic compaction with #181's merge in the main checkout. #181 merged at 2026-10-06T04:39:52Z, and the main checkout reached it at 04:42:09Z. No row yet.
- **Item J's old count, its last row,** by the same records and rule as the count above:

  | Compaction (boundary) | Session | The block | The flush state |
  |---|---|---|---|
  | 2026-10-06T04:41:54.040Z (trigger auto; 775,563 tokens before; 128,121 ms, so it started about 40 seconds after the block) | 128d8fa3 | 04:39:05.712Z | the last flush 3969abc6 (committed 2026-10-05T23:36:51Z, `flushed_at` 23:32:29Z, about 5 hours before the block) |

  - It went through on the second chance, under the pre-merge hook.
  - No N1 nudge text appears in the transcript. The fill was about 78% of a 1M window, below N1's 80.
  - **The old count ends at E: 5, N1: 3.**
### J, corrected by piece B's P0 (2026-10-06)

- **Source:** `state/consults/2026-10-06-guardian-n1-before-auto-compaction-p0-report.md`, its §2 and §3, recorded as that form's Amendment 1.
- **A compaction the count missed.** By the same records and rule as the count above:

  | Compaction (boundary) | Session | The block | The flush state |
  |---|---|---|---|
  | 2026-10-05T18:49:59.984Z (trigger auto; 769,990 tokens before; 76,134 ms, so it started at about 18:48:44Z) | 128d8fa3 | not on record: the session's block record was overwritten by the block at 2026-10-06T04:39:05Z | the last flush dd7d8ea0 (committed 18:40:58Z, `flushed_at` 18:39:21Z, about 9 minutes before the compaction started). Whether the hook judged it stale is not on record |

- **The fill readings above do not hold.**
  - The rows above read N1's fill as about 77% or 78% of a 1M window, below N1's 80. They are wrong.
  - A user-settings key, `autoCompactWindow`, sets the compaction window to 800,000. The settings file was last written at 2026-10-04T18:24:19Z, and the 2026-10-04T11:19:22Z compaction's 767,403 tokens also fit that window.
  - `percentage` is measured against that window, so it read 96 to 97 at the four compactions since N1 went live.
  - v0's N1 stayed silent because the Stop hook's judgment read the block fresh at each call where the fill first reached 80 or 90, not because the fill was under 80 (the P0 report, §3). Path item 4 is settled that way.
- **The old count:** E: 5 and N1: 3, as counted. One more compaction went through, at 18:49:59Z, and its block state is not on record.

### B2, second pilot, resumed (2026-10-09)

- **Resumed** by the human's direction of 2026-10-09 (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`, item 4), as written, from `covering-names-missing-column`. That piece's impact read precedes the architect's draft, as for pieces 1 to 4, and it is recorded here as the next measured piece.
- The four pieces measured before the freeze stand as recorded above. The result after the fourth piece (the pilot's §5 and §8) is still owed to the human.

### B2, second pilot — measured piece 5 (the first since it resumed): `covering-names-missing-column`

- **The piece** is slot 2's first item, graded S1 by the human (engine, order 1). The read precedes the architect's draft, as for pieces 1 to 4. No branch exists yet.
- **The impact read** is `state/consults/2026-10-09-covering-names-missing-column-impact-read.md`: 108 lines, sha256 bc961da144c3b456fe38daa2c6bb8e6eea910679db252da7458bdb0615a8ecc3, filed byte-identical as lead-data wrote it, read at main dba12b8c.
- **Cost** (the harness's task notification): 192,653 subagent tokens, 113 tool uses, 351,644 ms. The run lasted 05:18:44Z to 05:24:35Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 55, Grep 51, Glob 5, the hand-back 1).
- **C3:** before, the checkout held only its two pre-existing untracked items. During the run the custodian committed its own filing of the human's ADR-036 rulings (7a6c9c0c), touching `DECISIONS-PENDING.md`, `PLAN.yaml` (the 1b and 1c nodes), the queue, the site and the ledger. After, the checkout held the two items and the report.
- **Content:** interfaces in eight rows, consumers, governing texts, five gap questions, and missing pointers: no test pins k3, no `engine.no_covering_bbox` error fixture, neither KNOWN-LIMITATIONS item 9 nor 22 covers the case, and the owner's index does not list `Dataset::covering()`. The custodian's read found no draft text, design, recommendation or answer. The custodian checked its main finding against the code: the R-S3 check in `engine/src/dataset.rs` sits behind the early return taken when no format rule applied (lines 1198 to 1209 against 1247 to 1266), and `engine/ADMISSION-RESULTS.md` line 46 records M-4's deviation for that reason.
- **The architect's draft** of piece 5 follows, with the read's path in its brief.
- **Piece 5, the architect's draft** (`state/consults/2026-10-09-covering-names-missing-column-architect-draft.md`): 247,406 subagent tokens, 85 tool uses, 630,593 ms, from 05:29:15Z to 05:39:46Z. Write audit PASS, with zero write calls. Its files-read section reports on the impact read's pointers (the architect's findings, not a gate's):
  - **used:** nearly all of the read's §0 to §3, and its five questions, which shaped the form's §2h;
  - **found wrong:** none;
  - **missing:** six: a second early return before R-S3 (the geo `bbox` member branch); DuckDB binding identifiers without regard to case against `field_path_exists`'s byte comparison, which drives the form's P0; the versioning texts the wire question needs; `engine/src/addressability.rs`'s single-classifier rule; the shell's mocked refusals using an empty `fields` object; and the red-line list, which the architect calls arguably outside an impact read's remit.
- **Combined cost of piece 5** (read plus draft): 440,059 subagent tokens, 198 tool uses, 982,237 ms.

### B2, second pilot — measured piece 6: `skp-drained-stream-helper-post-check-race`

- **The piece** is slot 2's second item (kernel-protocol, order 1), drafted ahead while slot 2's first piece waits for a ruling. The read precedes the architect's draft. No branch exists yet.
- **The impact read** is `state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-impact-read.md`: 137 lines, sha256 9ed71a48a8377c55b55a15b6b9b15af25cb771d78f352d8cdf6118d0584a8a6c, filed byte-identical as lead-data wrote it, read at main 0a8f6dcb.
- **Cost** (the harness's task notification): 190,693 subagent tokens, 81 tool uses, 353,684 ms. The run lasted 06:13:00Z to 06:18:54Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 40, Grep 37, Glob 2, the hand-back 1).
- **C3:** before, the checkout held only its two pre-existing untracked items; after, those and the report. The custodian committed nothing during the run.
- **Content:** the helper and its five call sites reaching nine tests, the engine sites the race depends on, the sibling fix's means, the governing records, two more tests of the same shape in `engine/tests/session_identity.rs`, and five gap questions. The custodian's read found no draft text, design, recommendation or answer, and checked the helper's lines against the code.
- **The architect's draft** of piece 6 follows, with the read's path in its brief.
- **Piece 6, the architect's draft** (`state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-architect-draft.md`): 220,701 subagent tokens, 70 tool uses, 657,550 ms, from 06:22:01Z to 06:32:58Z. Write audit PASS, with zero write calls. Its files-read section reports on the impact read's pointers (the architect's findings, not a gate's):
  - **used:** §1.1 to §1.5 entire, §1.6, §2.1 to §2.4, the governing texts, and all five questions;
  - **found wrong:** none;
  - **incomplete, not wrong:** two: the default fixture spec runs past the pointed span, and the cancelled engine test cancels before it touches, which the read classed as the same shape without saying so;
  - **missing:** the stream's batch-cut sites, its cancel checks and its Drop, the fixture's vertex minimum and hole ring, the streaming path's lack of attribute bytes, the sibling's architect-gate finding on timeouts, the node that already routes a stale stream doc, and the classification of four grep hits the read left open.
- **Combined cost of piece 6** (read plus draft): 411,394 subagent tokens, 151 tool uses, 1,011,234 ms.

### B2, second pilot — measured piece 7: `wire-bytes-invariant-trace-flag-race`

- **The piece** is slot 2's third item (kernel-protocol, order 2), drafted ahead while slot 2's first two pieces wait for rulings. The read precedes the architect's draft. No branch exists yet.
- **The impact read** is `state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md`: 130 lines, sha256 cd1d36ce52231d8294b0890c1e778239ea140f7d27056936812e13f55fb7b5de, filed byte-identical as lead-data wrote it, read at main 8604c819.
- **Cost** (the harness's task notification): 118,249 subagent tokens, 62 tool uses, 206,682 ms. The run lasted 06:38:12Z to 06:41:38Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Read 35, Grep 25, the hand-back 1).
- **C3:** before, the checkout held only its two pre-existing untracked items; after, those and the report. The custodian committed nothing during the run.
- **Content:** the two tests and their trace use, the flag and its single slot, every reader on the product path, every other trace-using test binary and how each is serialised, the governing texts, five gap questions, and three owner's-index gaps (no interface entry for the engine's trace module, nothing pinned to the wire-bytes test file, and the tracing design note missing from the kernel's governing list). The custodian's read found no draft text, design, recommendation or answer, and checked the race site and the flag against the code.
- **The architect's draft** of piece 7 follows, with the read's path in its brief.
- **Piece 7, the architect's draft** (`state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-architect-draft.md`): 182,528 subagent tokens, 66 tool uses, 602,414 ms, from 06:44:22Z to 06:54:24Z. Write audit PASS, with zero write calls. Its files-read section reports on the impact read's pointers (the architect's findings, not a gate's):
  - **used:** all of §0, §1's test table and flag pins, §2's sibling table and precedents, §3's governing texts, the three owner's-index gaps, and all five questions;
  - **found wrong:** none;
  - **missing:** five: the stamp-then-send order and the end-on-disconnect in the stream, which question 2 needed; the mechanism of the slice test's exposure; that the two ignored factorial tests share one binary with no lock; that the shared watch-support module holds no tests; and the locked tokio versions with the absence of a clippy run, for a question the read could not foresee.
- **Combined cost of piece 7** (read plus draft): 300,777 subagent tokens, 128 tool uses, 809,096 ms.

### B2, second pilot — piece 5's owner's-index update (the pilot's §1, item 2)

- **The update** is `state/drafts/covering-names-missing-column-owners-index-update.md`: 173 lines, sha256 414356e02e335a7db9eec16b524b23fe8998e28e4e0857b0b00724628dafe5ee, byte-identical as lead-data wrote it, read on the branch at a06a746b.
- **Where it is filed, and why:** the brief's REPORT PATH line named `state/consults/`. One of its pointers names the new engine test file, which exists only on the branch, so `verify-cites` fails it on main. It was moved unchanged to `state/drafts/`, which that check exempts.
- **Cost** (the harness's task notification): 148,175 subagent tokens, 59 tool uses, 313,143 ms. The run lasted 11:37:31Z to 11:42:45Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Grep 30, Read 21, Glob 6, the hand-back 1).
- **C3:**
  - before: the checkout held only its two pre-existing untracked items;
  - during the run: the custodian committed its own filing, a76071b5 (the covering form's Amendment 3, the PLAN summaries, the ledger, the queue and the site);
  - after: the two items and the report.
- **Content:**
  - six whole-line replacements, three in each README's Owner's index section;
  - every pointer in both sections checked at a06a746b, all resolving;
  - no other stale line;
  - both sections within the 60-line cap.
- **Its stated limit:** with no shell, it took the changed files from the worktree's reflog and the worker report, not from `git diff`. The reviewer's diff check is the backstop.
- **Applied** on the branch by a worker, as the pilot's §1 item 2 says.

### B2, second pilot — piece 6's owner's-index update (the pilot's §1, item 2)

- **The update** is `state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-owners-index-update.md`: 138 lines, sha256 9da772a846a82b08c19dfddf4aaf4fe4c1500e88c442f93c5eb31b9cc521e7a1, byte-identical as lead-data wrote it, read on the branch at be7eecb3. Its cites pass `verify-cites` on main, so it is filed where its REPORT PATH line put it.
- **Cost** (the harness's task notification): 119,733 subagent tokens, 53 tool uses, 262,140 ms. The run lasted 15:33:37Z to 15:37:59Z.
- **Write audit PASS:** one Write, at its REPORT PATH line's path (Grep 38, Read 8, Glob 5, the hand-back 1).
- **C3:** before and after, the checkout held its two pre-existing untracked items; the report was added after. The custodian committed nothing during the run.
- **Content:** the kernel index's preregistrations line gains this form, last. The engine index gains a Governed by sub-bullet for engine halves of pieces filed elsewhere, pointing to the form's Part B. Both Last verified at lines move to be7eecb3, every pointer checked there. No other line is stale. Both sections are within the 60-line cap.
- **A miscount it disclosed itself:** its §3 gives 51 kernel and 39 engine test pointers checked. Its hand-back gives the right counts as 45 and 40. It did not rewrite the file, because the brief allowed one write.
- **Applied** on the branch by a worker, as the pilot's §1 item 2 says.

## M. The owner's-index update also names the README body sentences the piece made false

**The human's proposal** (typed, received at 08:00:57Z on 2026-10-10 by the transcript, item 3 of the message that filed drift sweep area D; byte-copied here):

> 3. For the weekly window: the owner's-index update also names the README body sentences the piece made false. The geometry pieces updated the index and left the body.

**The evidence:** drift sweep area D's finding 6 (`state/consults/DRIFT-SWEEP-AREA-D-2026-10-10.md`; the custodian's check `state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md`). The geometry pieces (MP-1, points, lines) updated the engine's owner's index. They left `engine/README.md`'s scope line and summary table describing a polygons-only engine. Sweep area D's other body findings (1, 2, 5 and 7) are the same class from earlier pieces.

**What it would change:** the pilot's §1 item 2 owner's-index update gains one line in its brief. That line lists each README body sentence the piece made false, so the same PR corrects it. A piece that changes no README body records "none".

**Not decided here.** This is for the window's round.

## N. The amendment template says class 9 covers a ruling that adds work, standing or not

**The human's direction** (typed, received at 11:00:52Z on 2026-10-10 by the transcript, item 2.3 of the message that answered the e2e re-aim's Amendment 2; byte-copied here):

> 3. Class 9 stands for this amendment. I read class 9 as covering a ruling of mine that adds work to a preregistered piece, standing or not. The template sentence that says so goes on the weekly window list.

**What it would change:** the amendment template gains one sentence: class 9 covers a ruling of the human's that adds work to a preregistered piece, whether the ruling is standing or not.

**Not decided here.** This is for the window's round.
