*Custodian's filing note (2026-10-04): PR #172's gate 2, the architect, for PLAN node `evidence-recorder-v0`, under the tag node:evidence-recorder-v0@g3, by reference to the gate-1 reports. Reviewed: cut/evidence-recorder-v0 @ 609ab94515d34a4f88583188b338abc6867f53d6 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 5 to the end, is 4c8c1b0cf35ca49aaa9526c89db1269e37f34796e195c510eec61bd5c309a1d4. Write audit PASS: zero write calls (Read 12, Grep 12, the hand-back 1); the run lasted 14:38:51Z to 14:44:53Z. C3: the worktree is at 609ab945, and the main checkout's porcelain held only its two pre-existing untracked items before (14:39:02Z) and after (14:50:09Z), apart from the parallel reviewer's own report file. The architect read a byte-exact export of the head's `tools/mods/` tree at `C:/dev/wt/rec-head-609ab945`. Main moved during the run only by the custodian's commit 4c91a76e (the watch-grandparent-spawn-signal form). Profile paths redacted at filing: none.*

---

Reviewed: cut/evidence-recorder-v0 @ 609ab94515d34a4f88583188b338abc6867f53d6

**Verdict: FAIL.** The cause is one S1 record finding (G2-S1-1) in Amendment 2's correction of C2-c. My gate-1 wording seeded it. Every gate-1 finding, mine and the reviewer's, is resolved at this head. The code is unchanged and still passes. The fix is one appended amendment, correction round 2 of 2, of about two sentences. No code change is needed.

**How I read it.**
- Branch files: read from the export `C:/dev/wt/rec-head-609ab945/tools/mods/`. Line numbers hold at 609ab945.
- Main-side files: read in the main checkout.
- Ledger: rulings are cited by round and item.
- Calls: I ran nothing and made no write call. Read and Grep only.
- Left to the reviewer, who has Bash: byte equality of the form's lines 1-478 against 976e64cd, so that Amendment 2 is a pure append; both README hashes; the d48bedc4 and 609ab945 diffs; and the §7 recount.

## Gate-1 findings, disposition

**Mine (state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-architect.md)**
- **S1-1: resolved by C2-d** (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:484-486`).
  - It is the row I asked for. Its description of the timer matches the code: `t2` is taken before `resolveLogRoot`, and `write` is read as the record's last field (`tools/mods/spatial-evidence-recorder/hooks/register.js:392-415`). The digest and `$.fs.write` follow it (register.js:343-347).
  - The reading is sound:
    - Nothing is counted twice, and everything timed is the recorder's own work on the call path. So the sum is a true lower bound.
    - A lower bound over the bound implies the real overhead is over it. So the stop firing on the sum is valid.
    - A sum at or under the bound proves nothing, so §1 claim 7 (form :98) is correctly withheld until a pre-E5 amendment names how the write is measured.
  - No prediction is edited: E5's text at form :343 stands, and only what a pass establishes is narrowed.
  - Class 2 is consistent with Amendment 1's C2-b and C2-c, which I accepted at gate 1. Class 1 would also have fit.
  - Residue is in N-2 and N-3 below.
- **S1-2 (a): resolved by C2-e** (form :487-489). It matches worker report 1 §7, and the reviewer's gate-1 check 4. §5's class-2 clause (form :350) is applied the right way round.
- **S1-2 (b): resolved** (form :492, first sentence). The lookup is in §2.7's first bullet (form :219).
- **S1-2 (c): resolved for the counters, overreached for the rest.**
  - The six names match the test file's counter loop (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:93-98`).
  - The second sentence is the new G2-S1-1 below.
- **S1-2 (d): resolved** (form :491). E0 to E7 (form :326-345) contain no path-spelling row, so withdrawing the sentence is correct. The live path stays unclaimed.
- **S2-1: all four points resolved in the README.**
  - §1's limits:
    - README:3 qualifies the subagent line against E3;
    - README:46 adds the E-row limits;
    - README:50 adds the loading limit.
  - The 30-day pruning age is at README:37, matching brief :29.
  - The off-switch warning is at README:65. It names `disableAllHooks` only as not the way, so §8 item 16 (form :426) is not crossed. Its reason follows Guardian's form :67 and the docs read it pins.
  - Acceptance and stop are at README:69. Its two pins are the form's own (:456-457), hash for hash, at 884fc727, which is on main.
- **N-1 to N-4:** they stand as recorded. R1 to R7 need no amendment, and my gate-1 report remains their record. N-2 (`&` as a separator) was not taken into the README, which is acceptable.
- **N-5:** commit messages (§8 item 10) and the merge method (item 15) stay with the reviewer and the custodian.

**The reviewer's (state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md)**
- **S1-1: resolved** (form :492, first sentence).
- **S1-2: resolved by C2-e.** The PR body's corrected reading of §5 cannot be seen from the export. That is for the reviewer.
- **S2-1: resolved.**
  - Form :492, second sentence, matches the reviewer's observation at 2.1.289: an inline arrow loads, and a named inner function is refused.
  - Its third sentence rests on 20 of 20 passing.
- **S2-2: all three points resolved.**
  - E-rows: README:46.
  - Loading: README:50.
  - The not-approved table: README:45 lists all seven rows of form :171-177.
- **S2-3: resolved** (form :491, second sentence). It names line 89 and gives 9acc86b8 in full in the header (form :482). Line 89 at the head is the comment (recorder.test.ts:89). The C2-a correction is not a class-3 test-text row, so round 25, item 2 (d)'s exact words form does not bind it. It does name the commit id, so §8 item 13's third bullet (form :419) passes.

## New findings

**G2-S1-1: C2-c's correction credits `validate` with ruling out a network call; the evidence does not show that.**
- Form :493, second sentence, says the rest of §8 item 3's set, and `$.process.spawn`, are ruled out by `validate`'s calls line.
- §8 item 3's set (form :406) includes `network`. The calls line lists `$.` members only: three entries, each `(via …)` (worker report 1 §7). No evidence shows that `validate` would list a network call made without `$`, such as a global `fetch`.
- That no network call exists is proven by reading:
  - grep finds no `fetch` or network in `hooks/register.js`, which imports nothing;
  - the gate-1 reviewer's §8 item 3 says the same.
- So the record names a tool's coverage as the proof of something only reading proves. That is the same kind of defect as gate-1 S1-2 (c), held to the same standard. Round 7 asks that a claim naming its proof can be resolved against that proof; this one names a proof that does not carry it. A reader of a later mod form could also take it as a claim about `validate`'s behaviour (round 15 (c)).
- I seeded this. My gate-1 sentence said the rest of §8 item 3's set, with an enumerated parenthetical that left out network. The amendment dropped the parenthetical.
- **Fix:** Amendment 3, correction round 2 of 2, at most two sentences. The defect: network is in the set and is not shown by the calls line. The corrected reference: network is ruled out by reading `hooks/register.js` (the gate-1 reviewer's §8 item 3), and the `$.`-member items by the calls line at 2.1.289. Then a superseded index naming that sentence of Amendment 2's C2-c correction.

**G2-N-1: the class label on Amendment 2's corrections block.**
- The C2-a correction withdraws a sentence after a gate round. By round 15 (g), a withdrawal row in a record-correction round is class 1. The amendment labels all of itself class 2 (form :480, :482).
- My gate-1 report asked for Amendment 2 as class 2. The error is mine.
- It is not a by-name failure. Both labels are post-result classes, and no prediction or claim changes.
- It may ride in Amendment 3 as one sentence naming round 15 (g). If it does not ride, this report is its record.

**G2-N-2: C2-d is silent on the brief's acceptance measure.** The brief's evaluation counts the overhead as a measure (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:59`). C2-d's lower-bound reading binds only §1 claim 7 and the stop. The same reading applies to the evaluation; the custodian applies it there.

**G2-N-3: what follows the timer.** C2-d names the digest and `$.fs.write` as what comes after the timer. `JSON.stringify` and the file-name build also come after it (register.js:344, 346). The lower bound holds either way.

**G2-N-4: README against §1. These are gate-1 misses (mine), on text the two commits did not touch.**
- README:41 leaves out half of the What-a-record-proves limit: that a record does not show a test's assertions establish a claim (form :102).
- README:47 leaves out the Any docs/08 row limit (form :112).
- README:46 drops E1's condition, and only if E1's refused call is approved under §2.2 (form :108). Read alone, it overstates what E1 lifts.
- These may ride with Amendment 3 as README edits, with §7 recounted. If they do not, the human's install sight should carry them.

**G2-N-5: a path spelling.** The C2-a correction spells the path `test/recorder.test.ts`, relative to the mod folder. It resolves uniquely. The full path would be cleaner in later records.

**Checks that pass at this head:**
- Round 12 (d): each correction is at most three sentences (C2-a two, C2-b three, C2-c two, What-it-touches two). None restates Amendment 1's claim.
- Round 12 (e): the superseded index is present (form :496).
- References resolve:
  - gate-log entries 390 and 391 are `state/gate-log.json` entries 390-391 (1-based), both evidence-recorder;
  - §2.3, §7, §9, E5 and Amendment 1's fourth bullet all resolve.
- Hashes: the only hash references are the README's two, at 884fc727 on main. No hash reference is at a branch commit.
- Self-lines and pins: no bare self-line, and no pin read as current.
- Round 25, item 2:
  - no §7 overrun (the worker reports 1117 of 1400, which matches 1109 − 65 + 73), with §7's line at form :398 untouched;
  - no scope addition;
  - no record calls a `verify-mutation` run an observation;
  - no five-line form.
- §8 item 11 passes (README:41, :45).

**The rest of §9's Architect list** stands by reference to my gate-1 checklist. `hooks/register.js` and the tests are unchanged, per the custodian's diff read and worker report 2.

## What closes the piece

1. **Amendment 3**, class 2 for the correction (class 1 if G2-N-1 rides), correction round 2 of 2:
   - G2-S1-1's correction;
   - optionally, G2-N-1's one sentence;
   - a superseded index.
   README edits for G2-N-4 may ride, with §7 recounted. Then gate 3, by reference to this report. If gate 3 finds more record defects, the record cap says the architect reduces the record to references and the piece lands; there is no round 3.
2. **After the merge, the closing record, references and hashes only:**
   - the merge commit id. It must be a merge commit (§8 item 15), so that 9acc86b8, 32fc334f, d48bedc4, 609ab945 and the Amendment 3 commit stay reachable from main;
   - the gate-log entry numbers for gates 1 to 3;
   - the four-to-six gate report paths under `state/consults/gates/`;
   - the PLAN node set done, with `{pr}` set only in the done commit.
3. **The install sight** (form §9 Operator) names, by reference:
   - Amendment 2's C2-d, because E5 cannot establish §1 claim 7 without the pre-E5 write-latency amendment;
   - G2-N-4, if it does not ride.

Files read:
- C:/dev/wt/rec-head-609ab945/tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md
- C:/dev/wt/rec-head-609ab945/tools/mods/spatial-evidence-recorder/README.md
- C:/dev/wt/rec-head-609ab945/tools/mods/spatial-evidence-recorder/hooks/register.js (330-465)
- C:/dev/wt/rec-head-609ab945/tools/mods/spatial-evidence-recorder/test/recorder.test.ts (1-135)
- C:/dev/spatial-ide/state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-worker-report-2.md
- C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-worker-report-1.md (grep, §7 and §9)
- C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-p0-report.md (528-541)
- C:/dev/spatial-ide/state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md (50-65)
- C:/dev/spatial-ide/state/gate-log.json (grep)
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md (100-178)
