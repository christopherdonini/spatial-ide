*Custodian's filing note (2026-10-02): the architect's gate 2 on PR #154, for PLAN node `round-mirror-pretooluse-hook`, scoped to correction round 1, full gating. Reviewed: cut/round-mirror-hook @ 2e364d6 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 2e364d6. Verdict PASS, notes only. N1 (the class label, class 1 not 2) is carried by reference in the closing amendment. N3 (§28's heading and number fixed in the merge with main, then a scoped reviewer pass on that hunk before the click) is the custodian's merge step. Profile paths redacted at filing: none.*

---

VERDICT: PASS (at 2e364d6), notes only. cut/round-mirror-hook @ 2e364d6

There are no S1 or S2 findings. Branch cites are read at 2e364d6. The checkout has no Bash, so I could not run git, and I took the two commits' file sets from the worker report and the custodian's filing note. The reviewer recomputes every count and hash.

**1. The non-object routing (fa674a7).**
- **What changed.** `scripts/hooks/questions-mirror.mjs:161-164` sends `null`, `[]` and `7` to §7's second line. The not-JSON line (`:158`) now covers only input that fails to parse. Exit is still 0, stdout is empty, and nothing is written or sent.
- **It stays inside the class.** §2 item 5 fixes the class: one §7 line, exit 0, nothing written. It does not say which of the six lines valid non-object JSON gets, and neither does §3. S9 and S10, the scenarios §3 does register, are unchanged and still asserted (`questions-mirror.test.mjs:265`, `:283`). Non-object JSON has no `tool_input.questions`, so it falls under item 5's case where `questions` is not a non-empty array.
- **No amendment was needed before code.** No declared line, case, test name or mutation changed, and it is not class 9 (no standing rule adds work). Recording it after the result is enough.
- **§2 item 4's order.** The check runs at parse time, before the silent cases, which is where 948f126 already put its not-JSON line. §2 item 1 makes reading one JSON object part of parsing, so §8 item 6 holds.

**2. Amendment 2 (`scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:301-315` @ 2e364d6).** Its form is right; I would change one label and two phrases.
- **References only:** yes. It cites gate reports and the worker report by path, has no line cites, no hashes and no quotation. Commit ids are named in words, as round 25, item 2 (d) allows. The superseded index ("none", `:314`) is right: the form has no record rows yet, and the RECORDED MUTATION comments at 753dcaf remain true observations of the tests as they stood then.
- **N1, the class label (`:301`, `:310`, `:311`).** Class 2 is for a run whose outcome differs from a registered §3/§5 prediction. Neither change is that: the envelope change brings the fixture into line with §3, and the non-object routing touches no registered prediction. A gate round's findings are its results (round 15 (g)), so a correction round's amendment is class 1. The amendment's first line (`:303`) already follows class 1's convention, so no reader is misled about timing. Do not open a record-correction round for this. Carry the label by reference in the closing amendment, under the record cap.
- **N2, item 2 (`:310`).**
  - `tool_name`'s value `AskUserQuestion` is the real tool name, not an invented one.
  - `permission_mode` is named by neither §2 item 3 nor §3. It comes from the reviewer's memory of the untracked hooks page, so §2 item 3 justifies three of the four keys.
  - Neither point changes behaviour, because the hook reads none of the four keys.

**3. T11 as E1.** With the envelope completed (`scripts/hooks/fixtures/pretooluse-askuserquestion.json:2-7,76-77`), T11 (`questions-mirror.test.mjs:295-325`) feeds every key the form names through the real settings command. That includes the three keys §2 item 3 says are present but unread, so the claim that nothing else is read is now exercised with them present. This is the E1 that §1's Seams and §4 describe.
- I grepped the hook script: it reads no `tool_name`, `prompt_id`, `tool_use_id` or `permission_mode`.
- What T11 still does not prove is delivery: the key set stays H2, and E2 is its discriminator. The reviewer's S1-1 is cleared.

**4. §28's heading (`AUTONOMY.md:492` @ 2e364d6, still "after §26").** Leaving it for the merge with main is the right step.
- Local main at a0f0da7 has no §27 yet (`AUTONOMY.md:484` is the last section). Writing "after §27" now would make the heading false on the branch.
- N3, two conditions:
  - (a) In the merge resolution, fix both the "after" clause and the number, so the heading says the next free number under §2 item 15. If item C has not landed when this PR is ready, §28 becomes §27. Either edit stays inside the appended section, so §8 item 9 holds.
  - (b) Have the merge commit's AUTONOMY.md hunk checked by a scoped reviewer pass before the click. Otherwise it lands as text no gate has read.

**5. §8 against the changed lines.**
1. Holds. The new branch writes stderr and returns (`questions-mirror.mjs:161-164`). It has no stdout and no exit call, and the exit status is still 0 (`:217-219`).
3. Holds. No new write, git call or network.
4. Holds. The new envelope keys are not read, and there is no grouping by `prompt_id`.
6. Holds. See point 1.
9. Holds. Neither commit touches AUTONOMY.md (`:492` is unchanged).
10. Holds.
   - The script gains no comment.
   - The README gains only the H4 label (`scripts/hooks/README.md:228-229`), which also clears the reviewer's S2-2.
   - The test comment at `questions-mirror.test.mjs:285` names the stderr phrase and presents nothing as verbatim.

Round 25, item 2 checks:
- **No §7 overrun.** The worker reports 497 insertions and 3 deletions, 500 changed lines over 7 files. That agrees with gate 1's 487 plus this round's +17/−4, under the 700 ceiling.
- **No scope addition.**
- **No verify-mutation run called an observation** (worker report 2:25).
- **No test-text span is pinned by hash at a branch commit.**
- **No five-line form.**

**N4, an unrecorded mutation for the new branch.** The worker ran no mutation against `questions-mirror.mjs:161-164`. By reading the code: if the guard is removed, `null` throws inside `hookBody` and prints the hook-error line, so T10 fails on its first new case. `[]` and `7` would not tell the difference. M10's recorded first failure (the `[]` question case) is unchanged, so §8 item 7 holds. The reviewer may observe the guard's removal to confirm it. Not required.

**N5, merge method.** The commit ids in Amendment 2 (fa674a7) and in the RECORDED MUTATION comments (753dcaf) stay reachable only through a merge commit (§8 item 15).

Paths:
- C:/dev/wt/round-mirror-hook/scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md
- C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.mjs
- C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.test.mjs
- C:/dev/wt/round-mirror-hook/scripts/hooks/fixtures/pretooluse-askuserquestion.json
- C:/dev/wt/round-mirror-hook/scripts/hooks/README.md
- C:/dev/wt/round-mirror-hook/AUTONOMY.md
- C:/dev/spatial-ide/state/consults/2026-10-02-round-mirror-hook-worker-report-2.md
