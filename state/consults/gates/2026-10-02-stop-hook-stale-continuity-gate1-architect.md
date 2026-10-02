*Custodian's filing note (2026-10-02): the architect's gate 1 on PR #161, for PLAN node `stop-hook-stale-continuity`, full gating. Reviewed: cut/stop-hook-stale-continuity @ 2542233 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 2542233. Verdict PASS. S2-1 (class 4: T18 and T19 with M18 and M19 for the two untested not-judged causes) goes to correction round 1, batched with the reviewer's findings. On N2: the generation bump was committed on main at a13a2af after this review read the checkout. Profile paths redacted at filing: none.*

---

VERDICT: PASS. Reviewed cut/stop-hook-stale-continuity @ 2542233. PR #161, gate 1, architect.

There are no S1 findings, one S2 (class 4) and nine N. Branch cites are read at 2542233, and the ledger is cited by round and item. "Paraphrase" marks my own wording. The one byte-copied quote is marked as such.

**1. Gating heads.** Both hold. The §21a head holds because the decision order is under test and the background allow moves (the form's pins at e04fdf7). The §21c head holds because the diff is 703 lines. Round 33 item 4 ("Adopt as described") matches §2 against the adopted shape, `state/drafts/weekly-window-2026-10-02.md:160-182` (main), at every point:
- the predicate;
- the placement after the lease and before the background allow;
- the reason's content;
- the caps with HEAD as progress;
- ledger-only milestone refreshes;
- PreCompact unchanged.

The narrower reading of the failed-push sentence is disclosed in §1. Round 33 item 5's tooling half is `scripts/hooks/session-resume.mjs:26`, proven by T17 (`hooks.test.mjs:1061-1072`).

**2. Predicate and edge cases.** `judgeContinuity` (`stop-queue.mjs:228-244`) matches §2 item 2 branch by branch:
- (a) empty output → fresh (`:232`); `null` → not judged (`:231`);
- (b) a `null` blob → not judged (`:236`); a `null` F_c → not judged (`:238`);
- (c) a missing parent, file, block or F_p → fresh (`:240-242`);
- (d) `===` (`:243`).

The walk has no `--first-parent` (`:230`), and the parent is `^1` (`:240`). The working tree is never read. Fail open (`:329-330`) pushes one stderr line and falls through. That matches §0's four precedents: lease read error → absent, HALT fetch → unknown, PreCompact skip, never throw. Failing closed would spend the caps on a condition the model cannot clear.

**3. Seam and caller rule.** No new export. `judgeContinuity` and `accountContinuation` are module-local. `parseSessionContinuity` is called with its real shape, text → `{flushedAt,tip,block}|null` (`precompact-flush.mjs:61-79`), and its product caller is `decide`. There is no import cycle, since `precompact-flush.mjs` imports only node built-ins and `cloud.mjs`. Real git runs in every test. E1 is T16, from the shipped CLI.

**4. Round 7.** The reason (`stop-queue.mjs:337-341`) and the stderr line (`:330`) match §7 byte for byte. The reason states the hook's own finding, then the step to take. The stderr line states the hook's fact and the hook's own consequence. Neither states another module's consequence.

**5. R1 to R6.** All hold:
- R1: the CRLF blob is normalised by the parser (T14). The fixtures set `core.autocrlf false` and add `* -text` in `.git/info/attributes`.
- R2: no `process.platform`.
- R3: Windows was run locally. CI is for the reviewer to read.
- R4: `/` literals, `os.tmpdir()` plus `t.after`, `process.execPath`, no shell and no drive letter. Branch names are read at `hooks.test.mjs:645,663`. `git fetch origin main` has no remote, so it resolves as a local path and touches no network.
- R5: L1 only.
- R6: no skip.

**6. §30 against §2 item 10 and my draft.**
- It is append-only after §29. It quotes nothing: the test name and the commit-message form are names, not quotations.
- Every bullet of my draft's binding content is present. The governing-form bullet moved into the intro, with nothing lost. "Proof: T17's name" became the full test name, which satisfies round 7.
- "§3's steps 3 to 6" is right against `AUTONOMY.md:90-93`.

**7. §8, item by item.**
1. Holds. Every continuity git call carries both options. That includes the stale path's `rev-parse` (`:258` via `:334`).
2. Holds. The queue path behaves identically for the same state: `plan._meta.hash` is always a string, so the `planHash !== null` guard is inert there.
3. Holds (`:321-347`).
4. Holds by reading at `:231/:236/:238`, but only `:231` is guarded by a test (S2-1).
5. Holds. The `READING_ORDER` header is byte-equal to main's line 22.
6. Holds: 17 `RECORDED MUTATION` comments, each naming 4b1f641, and `t.after` on every new temp directory.
7. Holds in the code and tests. Commit bodies are for the reviewer.
8. Holds (N3).
9. Holds. The README drops the old §3 quote and adds none.
10. Holds: five files.
11. Holds so far (N8).
12. Holds. Class 8 is recorded. The reviewer confirms that the form diff ca0abb5..2542233 only appends.
13. Holds. The one hash is at 629d969, which is on main. The test comments name a commit with no hash.
14. Pending the click.

**8. Amendment 1.**
- The class 8 record is sound: 9 + 66 + 435 + 5 + 188 = 703, the reason is given and §7 is unedited (N1).
- The class 1 record carries every item of my ruling's "E's record" item 3. Round 36 item 1 resolves to the RULED block, and #159 merged as ec74652.
- The generation bump is right (N2).
- The record cap holds: references only, the reason prose required by class 8, and a superseded index ("None").
- Round 25 item 2:
  - the overrun is class 8 with its §7 line unedited;
  - there is no scope addition;
  - nothing calls `verify-mutation` an observation;
  - no branch span is pinned by hash;
  - it is a full form.

**Findings**

- **S2-1 (class 4): two of §7's three not-judged causes have no test and no mutation.** I still hold my ruling's view and raise it as I said I would.
  - **The gap.** M18 (a `null` F_c read as stale, at `stop-queue.mjs:238`) and M19 (a `null` blob read as stale, at `:236`) both survive the suite. Each is the fail-closed shape that §8 item 4 names as block-on-sight.
  - **A correction to my ruling's premise.** The unreadable cause does not need a corrupted object store. A ledger commit that deletes `state/CUT-STATE.md` is listed by the `git log` pathspec walk, and `git show <c>:state/CUT-STATE.md` then fails, which reaches `:236`.
  - **The route.** Add one class 4 amendment, made before merge, that adds:
    - T18 `stop-queue: a ledger commit whose block has no flushed_at is not judged`: c0, then c1 commits a block with no `flushed_at` line. Predicted: the queue reason, plus a stderr line naming `no flushed_at in the block at <c1>`. Mutation M18.
    - T19 `stop-queue: a ledger commit that removes the ledger is not judged`: c0, then c1 is `git rm state/CUT-STATE.md`. Predicted: the queue reason, plus a stderr line naming `state/CUT-STATE.md unreadable at <c1>`. Mutation M19.
  - **The amendment must also:**
    - observe each mutation at a named commit;
    - record the new final §7 figure at the new head, with Amendment 1 item 1 in its superseded index;
    - bump the generation to 3.
  - **Then** a scoped gate 2 on the delta.

- **N1. The count's commit.** Amendment 1 counts at 78681ec, but my ruling asked for the head the gates review. The two are equal only if 2542233 touches nothing but the excluded form. The reviewer checks `--numstat fe1e6b7..2542233`. Separately, the reason omits the README (66 lines against an estimate of 30). Estimates are not ceilings, so no edit is needed.

- **N2. The generation.** The bump is right. `AUTONOMY.md:230` reads, byte-copied (a sub-line span): "The generation bumps on any preregistration amendment or scope change."
  - At this review the bump sits uncommitted in main's PLAN.yaml, and the branch reads 1. Commit it on main.
  - Paraphrase: the g1 results at 78681ec are the subject of Amendment 1, not results that arrived after the bump. They are not stale under §15.

- **N3. The section number.** Amendment 1 item 3 (§30) is true at 4b1f641. It does not breach §8 item 8, because the form fixed no number and the branch set it when it merged main. If main gains a section before the click, the closing record names the final number. If not, it cites item 3.

- **N4. The 629d969 pin.** Under round 14 I name which side is authoritative: the pin is, for the list I1 hit. The tree at fe1e6b7 carries #159's glob instead. The reviewer recomputes the hash.

- **N5. "Before the first code commit" (Amendment 1 item 2).** f778f61, which is test-only, predates the firing. The phrase reads as "before the implementation commit 8c96695". Under the record cap I ask for no correction.

- **N6. §7's timing line.** It counts three calls. The stale path makes four 2 s calls (the log, two shows and the `rev-parse` at `:258`), so the worst case is 13 s with HALT's 5 s fetch. That is still under the Stop entry's 20 s. §7 is not edited.

- **N7. The accounting state.** Paraphrase: a session whose only blocks were stale stores `lastPlanHash: null`. If the next stop at the same HEAD takes the queue path, which can happen only through a not-judged flap, null → hash reads as progress and resets the consecutive count. The daily cap bounds it, and it follows §2 item 3's declared write-back. No change.

- **N8. What the closing record owes:**
  - 4b1f641 as the observation commit for M1 to M17 (§4, §8 item 11);
  - each §6 tool with its commit (round 15 (c)), since the worker report gives exit codes only;
  - E2;
  - §30's final number.

  The merge must be a merge commit (§8 item 14), so that 4b1f641 and 78681ec stay reachable. The PR body discloses the failed-push reading.

- **N9. For the reviewer:**
  - the profile-path scan of the commit messages;
  - the hash at 629d969;
  - the pre-existing background test, which still leaves its temp dir. §2 item 6 bounds that test's change, so this is not this piece's defect.

Paths:
- C:/dev/wt/stop-hook-stale/scripts/hooks/stop-queue.mjs
- C:/dev/wt/stop-hook-stale/scripts/hooks/hooks.test.mjs
- C:/dev/wt/stop-hook-stale/scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md
- C:/dev/wt/stop-hook-stale/AUTONOMY.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md
- C:/dev/spatial-ide/state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-2.md
