# Weekly window 2026-10-23 — items carried (draft)

*The custodian's draft, opened on 2026-10-20 by the human's ruling headed 2026-10-21, item 2b (`state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md`). It is raised to the human at the next window. Nothing in it is applied before the human's answer.*

## A. The hours each slot sat idle waiting on a click, before and after the 2026-10-07 direction

- **Source.** `state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md`, item 7; governance C's obligation sheet, row L462.
- **Owed at the window:** from the ledger, for each slot, the hours it sat idle waiting on a click, before and after that direction, computed by script from the ledger's own times.

## B. Round 16's five filings for the window

- **Source.** `state/questions/round-16.md`, the line that begins `Filed for the weekly window`; entry 112; the sheet's row E112.
- **Owed at the window:** each of the five, raised, with any later ruling that covers one named beside it.

## C. The weekly-window proposal on the unmerged-append revert

- **Source.** Entry 113's item (4); the sheet's row E113. It is the same filing as B's first: the unmerged-append revert as a licensed extension of round 15 (f).
- **Owed at the window:** the proposal.

---

# Prepared at main c715c96b (2026-10-23), for the window

*The custodian's filing (2026-10-23), on the human's ruling headed 2026-10-23, item 9: items A to C prepared by a worker, read only at main c715c96b. The run 02:25:00Z to 02:49:08Z by its transcript (Read 6, Bash 100, Edit 3, Write 4); its claims were read against that transcript's calls before filing: GitHub read by GET only, nothing written to the repository or to GitHub, every write a scratch file under its prefix. Its definitions in A are its own, fixed before it counted, and the human may set others; its line cites into the ledgers are the instrument's references, read at c715c96b. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from the line after this note's rule to the end, is 06e6051ae183111985f98dd22c73e8c00842fe4ab9cdb53780c5d651bbe7c286.*

---

Prepared: the window of 2026-10-23, items A to C, at main c715c96b

Read-only throughout. Nothing was written to the repository or to GitHub. Nothing heavy ran, so no machine hold was taken. Method: `gh pr list --state all --limit 300` plus `gh api` GET of each PR's timeline (166 PRs, rc 0). That was a read-only addition: the brief named only `gh pr view`. The timeline fetch ran past the tool's 120 s limit and finished in the background, and some small greps printed to the terminal instead of a file. Scripts and outputs are `ww-*` files in my scratch folder. `ww-compute.mjs` holds every figure below.

Line-cite convention. `Lnnnn` is the opening line of a ledger entry in `state/cut-archive/CUT-STATE-2026-10-19.md`, which is an archive. `CUT-STATE.md:n` is the live ledger at c715c96b, and that pin is authoritative if the file has moved. An entry's ready or dispatch statement can sit in a sub-bullet below its opening line. Rulings are cited by round and item or by entry number.

## A. The hours each slot sat idle waiting on a click, before and after the 2026-10-07 direction

**Definitions (mine; fixed before counting)**
- **Slots.**
  - The first provision for two slots is the 2026-10-03 trial directive, received 2026-10-03T08:28:40Z (filing note, `state/directives/2026-10-03-reports-to-files-two-pieces-trial.md`). Before it there was no slot concept, and the pre-trial regime is not counted (see the end).
  - Slots 1 and 2 are as the ledger names them. The ledger names them from 10-05T07:31Z (L2764) and later (L3275, L3594, L3764). Before that I inferred the pairing from L1944. I mark each such row inferred.
  - The docs lane is a separate third slot from the ruling of 2026-10-10 (docs lane opened). The governance lane is separate under the ruling of 2026-10-14 and the placements message of 2026-10-21.
  - PLAN's lane field names the subject area, not a slot. PLAN.yaml has no slot field.
- **Waiting on a click.**
  - A PR whose gates passed or that left draft, awaiting the human's merge. Start R is GitHub's `ready_for_review` time where it exists. Otherwise it is the ledger's ready or awaits-merge stamp, which is minute-resolution.
  - End is GitHub's `mergedAt`. For a PR still open, the end is 2026-10-23T02:22:57Z, the committer date of c715c96b.
  - Where a PR was ready, then re-readied after a main-merge, I used the first ready.
- **Idle.** The slot has no other piece in code between R and min(merge, next dispatch). Dispatch means the ledger says in code, worker dispatched, or branch cut. Forms drafted ahead, question rounds, and gates on other PRs are not dispatches. That matches item 3 of the 2026-10-07 direction (prepares its form, starts code when that PR has merged).
- **Before the direction (window T).** The trial rule counted an awaiting PR as in progress, so no other piece could start in its slot. Idle is the whole wait. I scanned the ledger inside the ten longest intervals for a dispatch into the same slot and found none (`ww-scan.out`). One interval held a different slot's dispatch: #185's, with kernel-close-races-followups in slot 2 (L3722).
- **After the direction (window D).** The slot is free at R. Idle runs from R to the earlier of the next dispatch and the merge.

**Windows**
- **T.** 2026-10-03T08:28:40Z to 2026-10-07T16:34:47Z. That is 104h06m08s, two slots, so 208h12m16s of slot time. The end is the enqueue time in the 2026-10-07 direction's filing note (`state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md`, line 3).
- **D.** 2026-10-07T16:34:47Z to 2026-10-23T02:22:57Z. That is 369h48m09s.

**T: waiting PRs, idle in full by the rule** (R from the ledger entry at the cited line; M from GitHub, shown to the minute, durations exact)

| PR | slot | R | M | idle |
|---|---|---|---|---|
| #164 | 2 inferred | 10-03 08:47Z L1849 | 10-03 09:05Z | 0h18m51s |
| #165 | 1 inferred | 10-03 09:55Z L1886 | 10-03 10:01Z | 0h06m20s |
| #166 | 2 inferred | 10-03 12:12Z L1934 | 10-03 12:45Z | 0h33m15s |
| #167 | 2 inferred | 10-03 15:16Z L1991 | 10-03 15:22Z | 0h06m53s |
| #168 | 1 inferred | 10-03 16:33Z L2009 | 10-03 17:48Z | 1h15m00s |
| #169 | 2 inferred | 10-04 10:25Z L2253 | 10-04 11:01Z | 0h36m20s |
| #170 | 1 inferred | 10-04 12:31Z L2310 | 10-04 13:28Z | 0h57m59s |
| #172 | 2 inferred | 10-04 15:25Z L2448 | 10-04 17:08Z | 1h43m10s |
| #173 | 1 inferred | 10-04 16:48Z L2473 | 10-04 17:08Z | 0h20m43s |
| #174 | 1 inferred | 10-04 20:58Z L2580 | 10-04 21:37Z | 0h39m09s |
| #175 | 1 inferred | 10-05 00:40Z L2689 | 10-05 07:16Z | 6h36m07s |
| #176 | 1, L2764 | 10-05 11:49Z L2937 | 10-05 12:51Z | 1h02m41s |
| #177 | 2, L2764 | 10-05 11:57Z L2953 | 10-05 12:54Z | 0h57m38s |
| #178 | 1, L3009 | 10-05 18:23Z L3143 | 10-05 18:28Z | 0h05m39s |
| #181 | 2, L3275 | 10-05 22:11Z L3318 | 10-06 04:39Z | 6h28m52s |
| #183 | 2 inferred | 10-06 06:21Z L3444 | 10-06 10:11Z | 3h50m29s |
| #184 | 2, L3594 | 10-06 17:28Z L3599 | 10-06 19:15Z | 1h47m56s |
| #185 | 1, L3764 | 10-07 01:08Z L3711 | 10-07 04:12Z | 3h04m28s |
| #186 | 2, L3764 | 10-07 03:12Z L3764 | 10-07 16:24Z | 13h12m08s |

- **T totals.** Slot 1 has 9 PRs and 14h08m06s. Slot 2 has 10 PRs and 29h35m32s. Together that is 43h43m38s, or 21.0% of the window's slot time.
- **Counted apart in T.**
  - #171 waited 0h27m51s (L2347), but L2320 places it outside the two-pieces count by the human's word.
  - #179 waited 6h44m29s and #180 waited 6h44m41s. Both are docs PRs with R at L3300 and no slot named.
  - #182 has no ready stamp. L3489 says it merged without its reviewer's verdict.
- **Ledger statements of a piece held for a merge.**
  - #175: L2733 says the data-plane code waits for #175's merge. L2751 says evidence-recorder-v0-1 was not started, held by the slot rule.
  - #176 and #177: L2962 says both slots wait on the human, and b1-followups is held.
  - #183: L3475 says kernel-close-races-followups starts in slot 2 after #183 merges.

**D: next dispatch in the record** (idle is R to the earlier of next dispatch and merge)

| PR | slot | R (source) | wait | idle | next dispatch in the slot (source) |
|---|---|---|---|---|---|
| #187 | 2 | 10-07 20:28Z L3978 | 0h18m26s | 0h18m26s | 10-07 22:35Z L4004 |
| #188 | 1 | 10-07 22:18Z L3994 | 0h01m35s | 0h01m35s | 10-07 22:42Z L4004 |
| #189 | 2 | 10-08 04:16Z L4021 | 0h12m59s | 0h00m30s | 10-08 04:16:30Z L4021 |
| #190 | 2 | 10-08 15:08Z L4064 | 1h03m23s | 0h03m00s | 15:11Z entry stamp L4065 |
| #191 | 2 | 10-08 16:06Z L4090 | 0h05m52s | 0h05m52s | 16:36Z archive received L4103 |
| #193 | 2 | 10-08 17:46Z L4146 | 0h36m48s | 0h28m16s | 18:14Z worker start L4154 |
| #194 | 2 | 10-08 18:31Z L4156 | 2h21m46s | 2h21m46s | 10-09 05:48Z L4256 |
| #195 | 1 | 10-08 22:25Z L4207 | 0h18m51s | 0h18m51s | 22:53Z entry stamp L4219 |
| #196 | 1 | 10-09 12:50Z L4428 | 2h03m02s | 2h03m02s | 15:01Z entry stamp L4487 |
| #197 | 2 | 10-09 12:55Z L4443 | 1h58m21s | 1h58m21s | 15:01Z L4487 |
| #198 | 2 | 10-09 17:13Z L4524 | 1h41m49s | 1h41m49s | about 19:20Z L4547 |
| #230 | docs | 10-19 16:47Z GitHub and CUT-STATE.md:39 | 14h45m44s | 14h45m44s | 10-21 08:26Z CUT-STATE.md:133 |
| #233 | 1 | 10-19 21:32Z GitHub | 10h01m04s | 10h01m04s | 10-20 10:34Z CUT-STATE.md:68 (PR B branch cut) |
| #232 | gov | 10-20 16:35Z GitHub | 0h02m59s | 0h02m59s | 22:41Z CUT-STATE.md:108 |
| #237 | gov | 10-21 09:37Z GitHub | 2h58m24s | 2h58m24s | 21:55Z CUT-STATE.md:164 |
| #239 | docs | 10-21 13:36Z GitHub | 1h28m20s | 1h28m20s | 15:22Z CUT-STATE.md:152 |
| #240 | docs | 10-21 17:18Z GitHub | 2h26m36s | 2h26m36s | 10-22 12:57Z CUT-STATE.md:180 |
| #241 | 1 | 10-22 13:22Z GitHub, open | 13h00m52s so far | 3h56m08s | 17:18:13Z CUT-STATE.md:203 |
| #243 | docs | 10-22 14:59Z GitHub, open | 11h23m51s so far | 0 | F7 in progress at 14:46Z CUT-STATE.md:190, before R |

- **Totals, next dispatch in the record.**
  - Slot 1 has 5 PRs (#188, #195, #196, #233, #241). They waited 25h25m24s and were idle 16h20m40s.
  - Slot 2 has 8 PRs (#187, #189, #190, #191, #193, #194, #197, #198). They waited 8h19m24s and were idle 6h58m00s.
  - The docs lane has 4 PRs (#230, #239, #240, #243). They waited 30h04m31s and were idle 18h40m40s.
  - The governance lane has 2 PRs (#232, #237). They waited and were idle 3h01m23s.
- **Held for a click, by the ledger's own words.**
  - #188: the slot 2 crowded-start code waited on #188's merge (L3840 and L4004). The held interval is 1m35s.
  - #191: reuse bundle placed after #190 and #191 merge (L4073). The held interval is 5m52s, and L4091 says the archive had not arrived either.
  - #196 and #197: L4479 says both slots wait on these merges (2h03m02s plus 1h58m21s).
  - #233: PR B starts after PR A merges (CUT-STATE.md:65 and :68). L65 says three PRs wait for the click, #230, #231 and #233. The held interval is 10h01m04s.
- **Other stated causes.**
  - #194: no next piece placed in slot 2 until the human's 10-09 slot orders (L4225).
  - #230, #239, #240: docs-lane pieces placed on 10-21 (CUT-STATE.md:123). #240's next piece waited on the human's rulings (CUT-STATE.md:176).
  - #187, #195, #232, #237 and #241 have no cause stated.
- **Ledger idle not due to a click** (L4008, not counted). Slot 2 was idle 23:25Z to 03:42Z and slot 1 from 23:52Z, waiting on the custodian, not on a click.

**D: next dispatch not in the record** (idle is at most the wait)
- **Slot 1:** #212 (7m06s) and #234 (30m01s). Total at most 0h37m07s.
- **Slot 2:** #216 (49h46m33s, R 10-12 07:34Z L4678) and #238 (1h46m20s). Total at most 51h32m53s.
  - #216 waited on the human's typed merge approval.
  - Slot 2's next piece, b2-piece-1b, had its form at L4687 with OPEN-1 to OPEN-10 for the human, seven of them red lines.
  - #238 has no ready stamp. I used CUT-STATE.md:117, the gate-1 completion, and a word round followed at 02:50Z.
- **Docs lane:** #213 (7m23s).
- **Governance lane:** #229 (24h26m39s) and #242 (3h28m02s so far, open). Total at most 27h54m41s.
- **Slot not named in the record:** #227 (10h52m54s), #231 (13h02m12s), #235 (47m44s), #236 (7m20s). Total at most 24h50m10s.

**D: the ledger has a gap, so R is the gate-log proxy**
- R is the end of the last passing gate in `state/gate-log.json`. That is earlier than the true R, so each figure is an upper bound.
- Rows (wait at most):
  - #199 1h05m24s
  - #200 5h22m00s
  - #201 3h00m14s
  - #202 2h22m09s
  - #203 1h59m24s
  - #204 0h29m50s
  - #205 1h13m01s
  - #206 7h05m08s
  - #208 4h42m17s
  - #209 0h35m42s
  - #210 2h05m29s
  - #211 1h13m44s
  - #214 5h54m33s
  - #217 32h01m46s
  - #218 1h14m33s
  - #219 1h41m13s
  - #220 2h03m39s
  - #221 4h07m32s
  - #222 2h21m53s (from the human's typed word of 2026-10-16T18:37:55Z, because the gates preceded that ruling)
  - #223 8h27m08s
  - #224 8h06m21s
  - #225 2h25m34s
  - #226 2h01m58s
  - #228 0h18m56s
- **Totals by lane.**
  - Slot 1 has 5 PRs, at most 41h21m55s.
  - Slot 2 has 7 PRs, at most 28h43m26s.
  - The docs lane has 10 PRs, at most 28h38m25s.
  - The governance lane has 2 PRs, at most 3h15m42s.
- **Slot attribution of these rows.** It comes from the ruling of 2026-10-10 (docs lane opened) and its slot-2 chain, and from title and branch. #225 and #226 are my reading.
- **Counted apart.**
  - #207: the last architect record in the gate log is a FAIL (gate-log 480), so no all-pass time exists.
  - #214: the custodian ran the e2e evidence after the gates (L4645), so its figure is loose.
  - #215: its gates failed on wording that went to the human (gate-log 504).
  - #227 (R from GitHub, left draft 21:16Z) and #229 (left draft) have a ruling between R and merge. #229's are the 10-18 and 10-19 rulings.

**Reading.**
- Before the direction, each finished PR held its slot for its whole wait.
- After it, the slot is idle only while no next piece is in code. The ledger-resolved idle rows are mostly cases where no next piece had been placed or was waiting on a ruling, plus a few stated click-holds (#196, #197, #233).
- The window D totals include overnight and away periods, which the ledger does not separate from click-waiting.

## B. Round 16's five filings for the window

**Source.** `state/questions/round-16.md:28` @ c715c96b sha256:cd85f5cefac06de0416c52bab1942eb833b3770c477b0b521a81418f95460924. The filings below are paraphrases, not quotations. Entry 112 carries round 16's five asked items, which are a different list, so the filing line at `round-16.md:28` is the source.

1. **The unmerged-append revert as a licensed extension of round 15 (f).**
   - No later ruling licenses or rules on it.
   - Adjacent records:
     - The custodian's finding in `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md:241` (sha256:290267fb2d195270f1ba5250dae873c7431ba03608c69c45946ed035f96cfdf5): five uses in the week, read inside (f) by one architect and outside it by another. Until the human rules, corrections land as appended amendments and no further revert is dispatched.
     - Entry 111, item (i), filed and nothing adopted.
     - Entry 113, item (4), the revert used a third time before its weekly-window proposal.
     - Round 23, item 4 (O1): the human says (f) bounds in-place restores to unmerged branches. That restates the bound and does not rule on the revert.
     - A one-time license for one restore, in `state/directives/2026-10-16-222-adr-022-route-a-restore-and-reappend-reset-line-p6-s5d-own-item.md:8`: it covers that restore and nothing else.
2. **The round 15 (e) collision for a piece's own new files.**
   - Partly covered, for two shapes only:
     - Round 25, item 2 (d), now in `docs/PREREGISTRATION-TEMPLATE.md:174` and `AI_DEVELOPMENT.md:732`: a test-text span on an unmerged branch is named by commit in words, with the hash pin following on main.
     - Round 33, item 2 with round 34, item 4, now in `AUTONOMY.md:494-499` @ c715c96b: a narrow exception for a superseded row whose claiming line and pinned commit both come from the scanned PR.
   - No ruling found for a piece's own new files in general.
3. **A `replaced by <name>` cell for a superseded row.**
   - No ruling on the cell found.
   - Adjacent:
     - Round 20, item 1: a withdrawn marker needing no replacement, now in `AUTONOMY.md:163`.
     - `state/questions/round-25.md:2` records the no-replacement gap as disclosed in `scripts/plan/README.md` by #125.
     - The scanner's boundary text in `scripts/plan/README.md:170-176` @ c715c96b says the check proves only the rename half.
4. **Main's landed P3b erratum rows that declare a pin rule against round 15 (e).**
   - No later ruling found.
   - The records are still on main: `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:1159` (shell Amendment 16) and `engine/ADMISSION-PREREGISTRATION.md:1618` (engine Amendment 13). I did not read their pin-rule text.
   - The G0 reading in `state/drafts/decisions-pending-c-en2.md:9` marks it not represented. That is a custodian draft, not a ruling.
5. **Whether a fourth governance piece is funded this week.**
   - No ruling on the question as phrased.
   - Round 19, item 2 lifted round 16's hold on the superseded-name scanner and placed it next in the governance lane.
   - PLAN node `governance-test-claims-superseded-scanner` is `done` with PR #117 (PLAN.yaml:487-498), merged 2026-09-24T21:47:03Z.
   - Round 25, item 2 gave that week's allowance to one governance docs piece (PR #129).
   - Ambiguity: round 16's own Applied text puts the scanner's scheduling on this window's list with the four other filed proposals. If the fifth filing means the scanner, round 19, item 2 covers it. If it means a funding question, nothing does.

**Searches run.**
- `git grep -il` for: unmerged-append revert, restore bound, 15 (f), revert commit, re-append, licensed extension, no further revert, unmerged branch, append-only is then proved, 959bd08, pin rule, branch commit, erratum, replaced by, superseded, fourth governance, funded, weekly.
- Paths: `DECISIONS-PENDING.md`, `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`, `state/questions`, `state/directives`, `docs`, `AUTONOMY.md`, `AI_DEVELOPMENT.md`, `.claude/agents`, `scripts/plan`, `PLAN.yaml`, `state/drafts`.
- I read the ruled blocks for rounds 15, 16, 19, 20, 23, 25, 33 and 34, and the weekly-window drafts for 10-02 and 10-09. None of them carries filings 1, 3 or 4.
- Round 17's weekly-window filing (`state/questions/round-17.md:63`) is a different list.

## C. The weekly-window proposal on the unmerged-append revert

**The proposal as it stands**
- Round 16 filed it for the weekly window, earliest 2026-09-25: the unmerged-append revert as a licensed extension of round 15 (f) (`state/questions/round-16.md:28` @ c715c96b, sha256 above).
- Entry 111, item (i) (paraphrase):
  - A defective record append on an unmerged branch is corrected by a revert commit plus a re-append. It is never an amend or a rebase.
  - The corrected amendment is re-appended whole, and append-only is proved against the base commit.
  - The test-names architect called it sound as an extension by analogy of (f). It was used twice that day. Nothing was adopted.
- Entry 113, item (4): P5's worker, round 3, reverted its two record commits to re-append the record reduced. That is the third use before the proposal.
- Round 15 (f) as ruled:
  - Round 15, item 1 adopted all seven clauses.
  - (f) is byte-copied from `state/questions/round-15.md:9` @ 83cad32c93eb sha256:9344a28c0b59786e6a5c453ca2b56e923d6c3783ddf9c03d44a8851f2c511df7. I recomputed the same hash at c715c96b.
  - It sits in `docs/PREREGISTRATION-TEMPLATE.md:142` and `AI_DEVELOPMENT.md:299-300`.

**Later rulings.**
- None met or superseded it. Its status is as in B, filing 1.
- `state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md:12` puts entry 113's proposal on this window's draft.
- The custodian's standing posture of 2026-09-19 stands: appended amendments only, and no further revert dispatched.

## What I could not settle
- **Pre-trial regime** (before 2026-10-03T08:28:40Z). I did not compute it. No slot existed, and ledger stamps are day-only before 2026-09-24T18:15Z. Examples of unslotted waits exist, such as `L319`'s statement that nothing was running while four PRs awaited the click. Say if you want it counted as a single slot.
- **Ledger gaps in window D.**
  - 10-09T20:36Z to 10-10T07:48Z: no entry.
  - 10-10T09:10Z to 10-11T19:28Z: L4619 says no entry was appended.
  - 10-11T23:01Z to 10-12T06:52Z: L4665 says the ledger lapsed.
  - 10-12T10:50Z to 10-19T15:31Z: no entries.
  - Rows in those spans use GitHub's time or the gate-log proxy and give upper bounds.
- **Slot attribution.** T rows before 10-05T07:31Z are inferred from L1944. #227, #231, #235 and #236 have no slot named in the record.
- **Ready stamps** are minute-resolution and written after the event. I took the ledger's stamp as written.
- **Idle versus click-waiting.** Where the ledger states another cause, I listed it in A. The mechanical idle count does not separate nights or the human being away.

## Pre-gate self-check
- No code, tests or user-facing messages were produced. Cross-module interface use, discharge claims and the other classes are not applicable.
- Every figure comes from `ww-compute.mjs` over times read from the ledger lines, `state/gate-log.json` and GitHub, cited above. No time is estimated.
- Quotes: none, apart from hashes and the cited line texts, which I paraphrased.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No model override. No context handoff received or produced.

State left: no commit, no repository change. Tracked-tree changes: none. The scratch folder holds `ww-*` files only.
