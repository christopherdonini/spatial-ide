*Custodian's filing note (2026-10-11): the measurement for the human's 2026-10-11 direction, items 3a and 3c, by a general-purpose subagent of this session, read at main ceff6d82, the run 2026-10-11T18:50:30Z to 2026-10-11T19:22:00Z by its transcript (Read 6, Bash 118, Write 10; its writes went only to its own measure/ folder in the custodian's scratchpad). It arrived as a message and is extracted here by script from the SubagentHandback call in its transcript. One change: the scratchpad's absolute path, a profile path, is replaced once by `<the custodian's scratchpad>/`, and one final newline is added. The message's sha256 as handed back is 0726099f783c7083c8f200e179be0e2d31f4fd0e2fc6ec70b39a0d666e4e8676; this file's, from line 5 to the end, is 7a6711e34f4f33e4b2d71e54c5a323a581a64e8eff29b0440f50f465eef77ca4. The custodian's result and recommendation are `state/consults/2026-10-11-pilot-v2-result-and-recommendation.md`.*

---

## What I did

I measured and built both tables. I changed nothing in the repository. Scripts and scratch output are in `<the custodian's scratchpad>/measure/` (`runs.mjs`, `join.mjs`, `classify.mjs`, `assign.mjs`, `sums.mjs`, `groups.mjs`, `waits.mjs`, `overlap.mjs`, `gaps.mjs`, `appendix.txt`). Everything was read at main ceff6d82bdd3223fefed46e209913db6d1552d40.

## Method

**When the baseline was named.** Commit c823bce5 at 2026-10-05T00:35:18Z added the baseline to `state/drafts/weekly-window-2026-10-09.md:323-341`. Every PR merged after that moment, up to ceff6d82, is in the table: #175 through #209, except #192, which was closed unmerged. That is 34 PRs, and all of their merge commits are ancestors of ceff6d82. #175 is itself a baseline piece that merged after the baseline was named, so it is counted only in the baseline group.

**Transcripts read.** These are all this project's main-session transcripts that cover the period:
- e12d1b11 (2026-09-30 to 10-03)
- 874d0083 (10-03 to 10-04)
- c7fb21c1 (10-04)
- 128d8fa3 (10-04 to 10-06T16:10Z)
- da685a21 (from 10-06T16:10Z)

From these I extracted 472 Agent launches and 512 distinct usage notifications. I read subagent transcripts (`<session>/subagents/agent-<id>.jsonl`) only for:
- the two runs that have no notification;
- 30 sampled runs, used to check what the harness figure measures.

**Token method.**
- **Mapping runs to pieces.** Each run is mapped by its Agent tool_use: the Tag line, the description, PR or node names in the prompt, with manual overrides. The agentId comes from the tool result, and that id is matched to the notification's task-id.
- **What the figure is.** Each notification's usage block carries the element `<subagent_tokens>`. No `total_tokens` element appears in these notifications; the attachment record repeats the same value as usage.totalTokens.
- **What it measures.** On the 30 sampled runs, this figure is 0.6% to 12.9% above the last assistant message's input + cache + output. So it is the subagent's context size when it stops, not the total tokens it consumed.
- **Resumed agents** notify more than once. I count each agent's **last** figure. The alternative, summing every notification, is shown in brackets.
- **One compaction distorts the figure.** The milestone 1 build agent a0a8a50462b6b808c dropped from 771,554 to 206,849 between notifications, so its last figure is smaller than the work it did.
- **No notification (two runs).**
  - aa3480d0d2bef4c0e (#157 gate 3 reviewer, stopped unfinished): its last-message total is 64,173; summed over all its messages it is 790,676.
  - ab56ec1dee268c388 (#182 gate 1 reviewer, stopped at the human's request): 405,428; summed, 55,637,836.
  
  In the tables these two runs use the last-message total, marked **T**, because a summed figure is not comparable with the harness figures.
- **Not included:** the custodian's own main-session tokens, so the drafting cost of a form the custodian drafted is **unknown**.

**Other rules.**
- **Gate-log rows** use 1-based numbers, matching the window draft (it cites 402, 403 and so on for #176).
- **Correction round:** the work between a failing gate row and the next gate row on the same node, or an appended Correction of record section. If a round's blocking findings span classes, it is counted once in each class it has.
- **Draft** means a defect in the form, its amendments or the custodian's form route.
- **Wording** means a document sentence, a doc or test comment, a PR body, or a record.
- **Pointer-caused rounds: none.** No gate report names a wrong or missing impact-read pointer as the cause of a round. Gate-log 402 states that no impact-read pointer was wrong. In #178, the pointer gaps the gate-1 architect listed did not cause its round.
- **Index updated:** the PR's first-parent diff touches lines inside the Owner's index section of `engine/README.md` or `kernel/README.md`. The index was created 2026-10-03T10:13:42Z (629fb7f1).

## Table A: the second pilot (item 3a)

Lines are additions + deletions (files in brackets), from `gh pr list`/`gh pr view`. Gate rows are written **a** (architect) and **r** (reviewer). Rounds are written D (draft), C (code), W (wording). Under Impact read, **paused** means drafted while the pilot was paused, from the 2026-10-05 product-first direction's section 1 to the resumption in `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md` item 4.

### A1. Per piece

| PR | Node | Lane | Touches engine/ or kernel/? Impact read | Lines (files) | Total agent tokens [all notifications] | Drafting tokens | Gate rows | Rounds | Index updated |
|---|---|---|---|---|---|---|---|---|---|
| **Baseline** (window draft 330-339) | | | | | | | | | |
| #157 | workspace-rustfmt | governance | yes; none | 15,349 (136) | 896,725 T [1,068,148] | 193,165 | a3 r2 (330,331,337,338,339) | 2: D, W | n/a (predates the index) |
| #160 | skp-cancel-state-closed-set | kernel-protocol | yes; none | 264 (14) | 713,442 [860,888] | 230,855 | a2 r2 (341-344) | 0 | n/a (predates the index) |
| #170 | type-walk-null-literal-arithmetic | engine | yes; none (the first pilot's lead-data draft a6248c98dce8f98dc came first; its tokens are included) | 284 (4) | 1,555,331 [1,780,056] | 213,452 | a3 r3 (379,380,384-387) | 2: D, W | yes |
| #173 | watch-grandparent-spawn-signal | kernel-protocol | yes; none | 101 (5) | 447,096 | 143,028 | a1 r1 (396,397) | 0 | yes |
| #174 | timing-tests-assert-property-not-budget | kernel-protocol | yes; none | 4 (1) | 631,010 | 275,274 (two drafts) | a1 r1 (398,399) | 0 | yes |
| #175 | timing-assertions-under-contention | engine | yes; none | 52 (2) | 750,928 | 210,168 | a1 r1 (400,401) | 0 | yes |
| **Merged after the baseline** | | | | | | | | | |
| #176 | data-plane-terminal-without-credit | kernel-protocol | yes; `state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md` | 768 (9) | 1,728,696 | 508,657 | a3 r3 (402,403,405,406,408,409) | 2: W+C, W | yes |
| #177 | evidence-recorder-v0-1 | governance | no | 633 (6) | 1,221,060 [1,408,458] | 191,598 | a2 r2 (404,407,410,411) | 1: W | n/a |
| #178 | b1-engine-kernel-half-followups | engine | yes; `state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md` | 286 (4) | 1,068,138 | 343,458 | a2 r2 (412-415) | 1: W | yes |
| #179 | no PLAN node | none | no | 13 (1) | 116,057 | none (custodian) | a1 r1 (416,418) | 0 | n/a |
| #180 | no PLAN node | none | no | 6 (3) | 99,025 | none (custodian) | a1 r1 (417,419) | 0 | n/a |
| #181 | compaction-record-and-resume-line | governance | no | 408 (5) | 550,106 [752,155] | 189,978 | a1 r1 (420,421) | 0 | n/a |
| #182 | geometry-types-beyond-polygons | engine | yes; `state/consults/2026-10-05-geometry-types-beyond-polygons-impact-read.md` | 4,690 (89) | 3,043,751 T | 618,276 | a1 r1 (422,426) | 0 | yes |
| #183 | guardian-n1-before-auto-compaction | governance | no | 209 (4) | 966,842 | 288,351 | a1 r1 (423,424) | 0 | n/a |
| #184 | mods-readme-local-scope | governance | no | 14 (2) | 118,573 | none (custodian) | r1 (425) | 0 | n/a |
| #185 | geometry-points-cut | engine | yes; none (paused) | 2,698 (54) | 2,031,787 | 400,197 | a1 r1 (427,428) | 0 | yes |
| #186 | kernel-close-races-followups | kernel-protocol | yes; `state/consults/2026-10-05-kernel-close-races-followups-impact-read.md` | 113 (7) | 962,101 [999,786] | 357,503 | a1 r1 (429,430) | 0 | yes |
| #187 | typed-terminal-codes-post-check-race | kernel-protocol | yes (kernel tests); none (paused) | 92 (2) | 619,598 | 263,767 | a1 r1 (431,432) | 0 | no |
| #188 | geometry-lines-cut | engine | yes; none (paused) | 3,561 (52) | 1,854,272 [2,156,233] | 353,821 | a1 r1 (433,434) | 0 | yes |
| #189 | data-plane-crowded-start-detail-spaces | kernel-protocol | no (protocol/data-plane only) | 47 (2) | 360,051 | 104,006 | a1 r1 (435,436) | 0 | n/a |
| #190 | b2-piece-1a-step-record-and-dataset-reference | kernel-protocol | yes; none (paused) | 2,013 (13) | 1,799,619 [2,198,452] | 341,997 | a2 r2 (437-440) | 1: D+C | yes |
| #191 | verify-cites-pinned-citations | governance | no | 148 (2) | 321,464 | none (custodian) | r2 (441,442) | 1: C | n/a |
| #193 | adr-032-staleness-docs | governance | no | 64 (6) | 98,756 | none (custodian) | r1 (444) | 0 | n/a |
| #194 | docs-08-public-data-sentence | governance | no | 2 (1) | 85,082 | none (custodian) | r1 (445) | 0 | n/a |
| #195 | shell-migration-milestone-1 | shell | no | 3,531 (31) | 1,894,815 [6,408,823] | 357,140 | a2 r2 (446-449) | 1: C+W | n/a |
| #196 | e2e-hover-establishing-read-stale | shell | no | 99 (2) | 912,823 | 218,591 | a2 r1 (450,451,454) | 1: D | n/a |
| #197 | covering-names-missing-column | engine | yes; `state/consults/2026-10-09-covering-names-missing-column-impact-read.md` | 666 (8) | 1,243,201 | 440,059 | a2 r1 (452,453,455) | 1: W | yes |
| #198 | skp-drained-stream-helper-post-check-race | kernel-protocol | yes; `state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-impact-read.md` | 140 (4) | 992,973 | 411,394 | a1 r1 (456,457) | 0 | yes |
| #199 | wire-bytes-invariant-trace-flag-race | kernel-protocol | yes; `state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md` | 34 (3) | 786,579 | 300,777 | a1 r1 (458,459) | 0 | yes |
| #200 | known-limitations-item-8-filter-not-published | release | no | 20 (3) | 145,187 | none (custodian) | r1 (460) | 0 | n/a |
| #201 | stream-flush-cancel-exit-marks-producer-cancelled | engine | yes; `state/consults/2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-impact-read.md` | 143 (3) | 1,065,350 [1,202,593] | 483,154 | a1 r1 (461,462) | 0 | yes |
| #202 | filter-identity-alias-ambiguous-reached-through-skp | kernel-protocol | yes; `state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-impact-read.md` | 133 (5) | 954,957 | 443,799 | a1 r1 (463,464) | 0 | yes |
| #203 | shell-stale-frame-comments and shell-stale-layout-comments-and-s1-row | shell | yes (one form file, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`); none | 145 (11) | 558,291 | none (custodian) | a1 r2 (465-467) | 1: D | no |
| #204 | e2e-stale-expectations-reaim | shell | yes (`engine/src/fixture.rs`, `kernel/tests/manual_walkthrough_fixtures.rs`); none. Its drafting brief told the architect the node touches no engine/ or kernel/ path (transcript da685a21, agent af5f282493b643a30) | 772 (9) | 2,075,667 [2,352,607] | 392,324 | a1 r2 (468-470) | 1: W | no |
| #205 | known-limitations-item-2-on-main-paragraph | release | no | 8 (1) | 384,558 | none (custodian) | r3 (471,480,482) | 3: W, W, W | n/a |
| #206 | crs-undeclared-message-wording | engine | yes; `state/consults/2026-10-10-crs-undeclared-message-wording-impact-read.md` | 55 (7) | 1,018,448 | 389,296 | a2 r1 (472-474) | 1: W | yes |
| #207 | shell-map-refill-after-resize | shell | no | 475 (10) | 2,541,798 [3,000,295] | 330,906 | a4 r3 (475-479,481,487) | 4: C, W, W, W | n/a |
| #208 | ported-code-notice-route | governance | no | 1,284 (19) | 1,209,097 | 221,805 | a2 r2 (483-486) | 1: W+C | n/a |
| #209 | module-docs-stale-statements | kernel-protocol | yes; `state/consults/2026-10-11-module-docs-stale-statements-impact-read.md` | 328 (16) | 1,736,744 | 523,507 | a2 r2 (488-491) | 1: W | yes |
| #210 (open, not merged) | skp-v0-live-sections-current-area-c | kernel-protocol | yes; `state/consults/2026-10-11-skp-v0-live-sections-current-area-c-impact-read.md` | 115 (8) | 1,320,913 | 482,492 | a1 r3 (492-495) | 1: W | yes |

**Drafting cost** is the impact read plus the architect's form draft (or drafts) before the form was committed. Later amendment drafts are in the total but not here.
- The baseline figures and the figures for #176, #178, #182, #186, #197, #198 and #199 equal those the window draft records (lines 332-337, 356, 443, 518, 532, 594, 610, 625).
- Lines and files come from `gh pr list --json additions,deletions,changedFiles`, and lanes from `PLAN.yaml`.

### A2. Correction rounds and their causes

| Piece | Round | Cause | Gate finding |
|---|---|---|---|
| #157 | R1 | D | gate-log 331; `state/consults/gates/2026-10-02-workspace-rustfmt-gate1-reviewer.md` S1-1 (I4 fired: the pass moved a literal that a TS test reads by regex), with S2-1 (the form's §0 list of text readers is incomplete) |
| #157 | R2 | W (record) | gate-log 337 and 338; `...-gate2-architect.md` S1-1 (file-count overrun with no class 8 amendment) |
| #170 | R1 | D | gate-log 380; `state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md` S1-1. The window draft also classes it draft-caused (line 249) |
| #170 | R2 | W | gate-log 385; `...-gate2-reviewer.md` S1-1 (a test comment without DuckDB's version). The window draft's C4 class is implementation defect (line 255) |
| #176 | R1 | W + C | gate-log 402 and 403. Architect S1-1 (the identity sentence) and S1-2 (record hash); reviewer S1-2 (unreachable match arm, which is the code part). Pointer: none (402) |
| #176 | R2 | W (record) | gate-log 405 and 406, S1-1 (Amendment 4 item 1 over the round 12 (d) ceiling) |
| #177 | R1 | W (record) | gate-log 407; `state/consults/gates/2026-10-05-evidence-recorder-v0-1-gate1-reviewer.md` S1-1 |
| #178 | R1 | W | gate-log 412; `...-gate1-architect.md` S1-1 (the K-3 comment says 7). The window draft's C4 class is implementation defect (line 500) |
| #190 | R1 | D + C | gate-log 437 and 438; `state/consults/gates/2026-10-08-b2-piece-1a-step-record-and-dataset-reference-gate1-architect.md`. **C-1 is draft:** the ADR-036 text came from the custodian's drafting in the form's Amendment 2 item 4. C-2 is code; the reviewer's C1 (the shell lock edge) is code |
| #191 | R1 | C | gate-log 441, C1 and C2 |
| #195 | R1 | C + W | gate-log 446 and 447. C1, E1 and the reviewer's C2 are code or test; C2 (PR body) and E2 (the KNOWN-LIMITATIONS 39 sentence) are wording |
| #196 | R1 | D | gate-log 450; `state/consults/gates/2026-10-09-e2e-hover-establishing-read-stale-gate1-architect.md` E1. Line 57 of that report names a drafting defect in the form's §5 |
| #197 | R1 | W | gate-log 452, E1 (doc comment of `field_path_exists`) |
| #203 | R1 | D | gate-log 465; `state/consults/gates/2026-10-10-shell-stale-frame-and-layout-comments-gate1-reviewer.md` E1 (the custodian's five-line form declared 12 files, past the 8 that §21c allows) |
| #204 | R1 | W | gate-log 469, E1 and E2 |
| #205 | R1 | W | gate-log 471, C-1 (a sentence of the human's own paragraph) |
| #205 | R2 | W | gate-log 480, C-1 (the human's sentence) |
| #205 | R3 | W (record) | correction of record at `KNOWN-LIMITATIONS-ITEM-2-ON-MAIN-PREREGISTRATION.md:43`, commit 3b60c3ab, after the passing gate 482 |
| #206 | R1 | W | gate-log 472, E-1 (the custodian's PR body) |
| #207 | R1 | C | gate-log 475 and 476, C1 |
| #207 | R2 | W | gate-log 479, C1 (the human's sentence) |
| #207 | R3 | W | gate-log 481, C1 (the human's sentences). Its correction of record at the form's line 551 (3b60c3ab) falls inside this round |
| #207 | R4 | W (record) | correction of record at `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:568`, commit cd6738a1, after 487 passed |
| #208 | R1 | W + C | gate-log 483 and 484; C-1 and C-3 are wording, C-2 (caller rule) is code |
| #209 | R1 | W | gate-log 488 and 489, C-1 |
| #210 | R1 | W | gate-log 494, C1. Its correction of record (`protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md:504`, 9b01cdb3) falls inside this round |

The custodian calls the run of worker a779eda2d7a887f2d on #210 correction round 1, but it followed the passing gates 492 and 493, so it is not a round by the brief's definition.

### A3. Totals and medians

| Group | Pieces | Lines (total / median) | Files | Total tokens | Drafting tokens | Gate rows | Rounds (D/C/W) |
|---|---|---|---|---|---|---|---|
| Baseline | 6 | 16,054 / 182.5 | 162 / 4.5 | 4,994,532 / 732,185 | 1,265,942 / 211,810 | 21 / 3 | 4 (2/0/2) |
| With an impact read, merged | 11 | 7,356 / 143 | 155 / 7 | 14,600,938 / 1,065,350 | 4,819,880 / 440,059 (reads 2,091,262 / 190,693; drafts 2,728,618 / 239,130) | 32 / 2 | 6 (0/1/6) |
| Without one, merged | 22 | 16,242 / 146.5 | 239 / 4.5 | 19,964,528 / 588,944.5 | 3,654,481 over the 13 architect-drafted pieces, median 288,351; the other 9 unknown | 57 / 2 | 15 (3/5/10) |
| Of those, the ones touching engine/ or kernel/ (#185, #187, #188, #190, #203, #204) | 6 | 9,281 / 1,392.5 | 141 / 12 | 8,939,234 / 1,826,945.5 | 1,752,106 over 5, median 353,821 | 16 / 2.5 | 3 (2/1/1) |

- #210 is outside these totals.
- If every notification is summed instead of each agent's last figure, the token totals become 5,538,126, 14,775,866 and 26,304,214.

## Table B: section 6 measures (item 3c)

The window draft lists these measures but records no values (`state/drafts/weekly-window-2026-10-09.md:543-547`), so there was nothing to reuse. Every figure below is new, covering 2026-10-05 to 2026-10-11 and ending at ceff6d82 (2026-10-11T18:37:43Z).

**Product/governance rule.** A PR is product if it changes any file under `engine/`, `kernel/`, `protocol/`, `renderer/` or `frontends/`, or changes `KNOWN-LIMITATIONS.md` or `RELEASE-0.1.md`. Otherwise it is governance. Days are by mergedAt (UTC).

| Day | Product PRs | Governance PRs | Question rounds (`state/questions`) | Correction rounds: draft / code / documentation | Hours slot 1 waited on a person |
|---|---|---|---|---|---|
| 10-05 | 3: #175, #176, #178 | 1: #177 | 8 (rounds 54-61) | 4 rounds: 0 / 1 / 4 (#176 R1, #176 R2, #177, #178) | 8.10 |
| 10-06 | 1: #182 | 5: #179, #180, #181, #183, #184 | 1 (62) | 0 | 14.62 |
| 10-07 | 4: #185, #186, #187, #188 | 0 | 7 (63-69) | 0 | 6.12 |
| 10-08 | 3: #189, #190, #195 | 3: #191, #193, #194 | 0 | 3 rounds: 1 / 3 / 1 (#190, #191, #195) | 12.11 |
| 10-09 | 3: #196, #197, #198 | 0 | 2 (70, 71) | 2 rounds: 1 / 0 / 1 (#196, #197) | 18.32 |
| 10-10 | 6: #199, #200, #201, #202, #203, #204 | 0 | 0 | 3 rounds: 1 / 0 / 2 (#203, #204, #205 R1) | 16.02 |
| 10-11 | 5: #205, #206, #207, #208, #209 | 0 | 0 | 10 rounds: 0 / 2 / 9 (#205 R2, R3; #206; #207 R1-R4; #208; #209; #210) | 8.92 |
| **Week** | **25** | **9** | **18** | **22 rounds: 3 / 6 / 17** | **84.21** |

- **Question rounds** are dated by each file's own date, which the mirror hook writes as the UTC date when the question was asked (`scripts/hooks/questions-mirror.mjs:189`). Every round matches an AskUserQuestion call in the transcripts.
- **Correction rounds** are dated by the failing gate row's date, or by the commit for a correction of record. A mixed round is counted in each of its classes.

**Waits on the human.** These are slot 1's waits, merged into one interval set per day. Ready times are the commits that recorded the PR as ready, and merge times come from `gh` mergedAt. Question times come from the session transcript and the directive filing notes. Filing notes are in `state/directives/`.

- **10-05**
  - #175: ready 00:42:05 (06200a1e) to merge 07:16:07.
  - #176: ready 11:52:53 (f74b0487) to merge 12:51:41.
  - #178: ready 18:27:48 (cd539e79) to merge 18:28:39.
  - Round 59 (kernel-close-races-followups held the product slot, window draft line 505): 20:09:51 (transcript 128d8fa3) to 20:15:13 (`2026-10-05-round-59-rulings.md`).
  - Hold, the human's wait-for-a-new-message: 20:18:57 (filing note of `2026-10-05-product-first-direction.md`) to 20:23:27 (`2026-10-05-product-first-clarification.md`).
  - Round 61 (MP-1): 23:37:47 to 10-06 04:39:05 (`2026-10-06-round-61-rulings.md`). The phase B worker a067c023483f90318 ran until 01:19:08 during it.
- **10-06**
  - Round 61, continued.
  - Hold, no heavy runs this morning: 06:25:43 (`2026-10-06-no-heavy-runs-this-morning.md`) to 10:18:41 (`2026-10-06-pr183-merge-approval.md`). It stopped #182's reviewer, ab56ec1dee268c388.
  - Hold, the restart: 10:18:41 (same note) to 16:20:13 (`2026-10-06-boot-mods-local-and-machine-script.md`).
  - Round 62: 18:53:46 to 18:57:07 (`2026-10-06-round-62-rulings.md`).
- **10-07**
  - #185: ready 01:10:02 (99f4c437) to merge 04:12:28.
  - Round 63: 07:07:06 to 10:11:00. Round 64: 10:11:15 to 10:11:16 (`2026-10-07-round-63-and-64-rulings.md`).
  - #188: ready 22:18:48 (aa00e565) to merge 22:19:35.
- **10-08** (milestone 1)
  - Decisions B, then A: asked 06:14:13 and 06:54:03 (transcript da685a21), answered 14:23:55 (`2026-10-08-decisions-a-b-c.md`). The build worker ran until 06:50:17 during it.
  - Mutations: 15:53:26 to 18:02:48 (`2026-10-08-m1-mutations-branch-docs08-adr036.md`).
  - K6 (v): 19:14:17 to 19:40:09.
  - K6 (iii): 20:19:22 to 21:23:02.
  - #195: ready 22:26:56 (2bbc9fe4) to merge 22:43:51.
  - Pick-paths verdict: 23:59:01 to 10-09 05:07:05 (`2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`).
- **10-09**
  - The pick-paths wait, continued.
  - K6 fix OPEN-1 to OPEN-3: 05:35:50 to 08:37:12 (`2026-10-09-rulings-on-the-eight-forms.md`).
  - #196: ready 12:54:18 (e4c145be) to merge 14:53:02.
  - Round 70: 13:16:08 to 14:09:02.
  - The re-aim's missing paste: 14:19:35 to 18:52:15 (`2026-10-09-round-71-and-round-70-paste.md`). Build worker a65b618f9e3a33c8e ran 15:06 to 17:09 during it.
  - Round 71: 17:48:14 to 18:52:15.
  - The re-aim's Amendment 2 items: 19:47:04 to 10-10 11:00:52 (`2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md`).
- **10-10**
  - The Amendment 2 wait, continued.
  - Re-aim T2 stop: 14:23:05 to 18:58:06 (`2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md`).
  - #204: ready 22:25:21 (58d66b1e) to merge 22:50:50.
- **10-11**
  - #207 ready 03:58:00 (ef836aba) until the human's sentence ruling at 08:28:47 (`2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md`).
  - Gate 479's C1: 09:19:21 to 09:40:30.
  - Gate 481's C1: 10:25:16 to 11:21:19.
  - #207 ready again 13:38:19 (ad98315f) to merge 15:41:55.
  - Milestone 2 OPEN-11: 16:58:33 to 18:02:04 (`2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md`).

## What I could not class, or classed by judgment

1. **#192** (closed unmerged): gate-log 443 failed with no later gate, so it is not counted as a round.
2. **Rounds that could be classed differently:**
   - #157 R1 is classed draft; it could be code.
   - #157 R2 is classed record; it could be draft, because the gate ties the overrun to the form's own command.
   - #196 R1 is classed draft; it is an Evidence finding.
   - #177 R1 is classed record; it could be code.
   - #170 R2 and #178 R1 are classed wording; the window draft's C4 class for both is implementation defect.
3. **Product or governance by judgment:** #179 (ADR acceptance words), #194 (the docs/08 sentence) and #208 (a licensing notice route that touches the renderer and the shell).
4. **No slot 1 before the 2026-10-05 product-first direction (20:17:41Z).** For 10-05 I used the product-lane piece in flight.
5. **Questions on pieces drafted ahead of slot 1 are not counted:** round 54, rounds 66 and 67, and the map-refill and milestone 2 open items on 10-09.
6. **Questions put to the human in closing messages** are counted in the waits but not in the round counts. That includes the 10-08 round 70, whose rulings are filed at `state/directives/2026-10-08-round-70-rulings.md` with no file in `state/questions`.
7. **Slot 1 stopped and only the human could restart it, but none of the three kinds applies, so these are not counted:**
   - 10-07 04:57:36 to 07:00:02: the weekly usage limit; it resumed on the human's Keep going.
   - 10-07 about 10:25:50 until the human logged in again: an expired login stopped the agents (`state/CUT-STATE.md`, its 2026-10-07T16:08Z entry). The end time is not on record.
   - 10-11 11:33:38 to 12:52:58: a Bash call exited 137, and the session stayed idle until the human's Keep going.
8. **Ready times** are the commit times that recorded readiness, so they may trail the moment a PR was actually ready by minutes.
9. **The ledger in `state/CUT-STATE.md` has no entries after 2026-10-10T09:10Z.** For 10-10 and 10-11 I used commits, directive notes and the transcript.
