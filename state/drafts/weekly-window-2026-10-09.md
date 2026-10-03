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
