*Custodian's filing note (2026-09-26): the architect gate's attempt-1 report for PLAN node `governance-weekly-proposals-2026-09-26`, reviewed at governance/weekly-proposals-2026-09-26 @ f205478, filed as returned under state/consults/ (the piece's own rule on gate-report filing starts at its merge; extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: PASS with notes.** `governance/weekly-proposals-2026-09-26 @ f205478fc1a6` (the worktree reflog shows 340f516 → c57a1cb → 522e448 → 825f141 → dd47574 → f205478). I have no Bash, so the byte check, P1–P4, the suites and the M1 re-observation are the reviewer's (§9). This verdict assumes they come back green. I found nothing that blocks.

**Findings**

- **N1: Amendment 1 renders as code (form defect; it is mine, from the draft).** T6's `~~~` never closes. Under CommonMark an unclosed fence runs to the end of the file, so everything after `C:\dev\wt\governance-weekly\scripts\plan\GOVERNANCE-WEEKLY-PROPOSALS-2026-09-26-PREREGISTRATION.md:175` renders inside T6's block, including Amendment 1. An append-only fix is impossible: a closing fence would have to be inserted after line 176. No mechanical harm follows, because §9 extracts the T blocks at 340f516, where T6 is exactly line 176. No fix is required. Under the record cap, no further text.
- **N2: "the form's last line" in Amendment 1 is true only at 340f516.** It is not true at the head. §9 fixes extraction at the form's commit (340f516), so the phrase is unambiguous there. It is not a pin read as current (round 14). No fix required.
- **N3: tool commits (round 15 (c)).** T2's sentence on `verify-cites`' behaviour, at `C:\dev\wt\governance-weekly\AUTONOMY.md:476`, names no tool commit. T1's sentence on `verify-mutation` names a5d8b8b. The T2 sentence is governing text describing the behaviour this piece adds, and round 15 (c) binds record statements. This is not a failure; I note it only for consistency.
- **N4: an item the architect rarely reaches.** T4's last fail-by-name item (a five-line dispatch whose Out-of-scope line names a §21a category) reaches the architect only after a piece re-enters full gating, because §21b opens no architect gate. It is harmless, and it agrees with T5 and §21d.
- **N5: Authority.** Several texts go past the proposals' bare wording:
  - class 9's declare-before-code clause;
  - the PLAN node that carries the pin (T1 (d), T3);
  - T3's branch-retention sentence.

  Each is a mechanic that serves an adopted item or the ruling's condition on (b). Each comes from existing discipline: the template header's before-code rule, round 15 (e), and the ruling's "resolve against something fixed". None is a new rule. The ruling itself was resolved against the RULED 2026-09-26 round 25 block, item 2, and `state/questions/round-25.md` item 2 (a)–(e).
- **Consistency.** T1–T6 agree with one another:
  - T1 (e), T2 (e) and T3's Dispatch bullet state one rule.
  - T4, T5 and T6 list the same fail-by-name set, with worker-appropriate subsets.

  They also agree with the existing sections:
  - §21b's mid-piece clause and §21d's Out-of-scope-first check are kept.
  - §21c's counting rule is the fallback in class 8.
  - §22's "gate reports: Immutable, append-only" matches T2's byte-identical filing below the note.
  - Class 6 and class 2 stay distinct from class 8.

**§8, item by item**

1. **Bytes above the pre-piece end:** PASS on read. Each append begins after the pre-piece last line: template 161, AUTONOMY 470, AI_DEVELOPMENT 721, architect 13, reviewer 27, worker 31. P4's 0 deletions is the reviewer's.
2. **Byte-identical to the T blocks:** no difference seen on a read comparison. The mechanical check at 340f516 is the reviewer's.
3. **Classes unchanged:** PASS. Classes 1–7 read intact at `C:\dev\wt\governance-weekly\docs\PREREGISTRATION-TEMPLATE.md:103-132`. 8 and 9 appear only in the appended section.
4. **`verify-cites.mjs`:** PASS on read.
   - The constant is not exported and holds exactly `'state/drafts/', 'state/consults/gates/'`, each with its trailing slash (`C:\dev\wt\governance-weekly\scripts\plan\verify-cites.mjs:82`).
   - The comment keeps the round-14 sentence and adds one (`:290-294`).
   - The `archived` line reads the list (`:295`).
   - The reviewer confirms by diff that there are no other hunks. A blank separator next to the constant counts as part of the constant.
5. **Existing tests:** PASS on read. The 14 tests are intact and the new test is appended at `C:\dev\wt\governance-weekly\scripts\plan\verify-cites.test.mjs:196-233`. The reviewer confirms by diff.
6. **Nothing under `state/consults/` or `state/drafts/` touched:** no commit subject touches either. The reviewer confirms with `--name-only`. The invalidator also holds: main has no `state/consults/gates/`.
7. **Rule text beyond (a)–(e):** PASS (N5).
8. **In the T blocks:** PASS.
   - No sha256 hex.
   - No `DECISIONS-PENDING.md` cite.
   - No reproduced ruling.
   - No quotation marks.
   - T1's `<path>:<a>-<b> @ <commit> sha256:<hex>` is a placeholder shape, not a reference, and its `<a>` does not match TOKEN_RE's digit rule.
9. **Temp tree:** the test removes it with `rmSync` in a `finally` (`:230-232`). The §6 delta is the reviewer's.
10. **`PLAN.yaml`:** only `gate` names the form (`C:\dev\wt\governance-weekly\PLAN.yaml:2574`). The CRLF check (`file`) is the reviewer's.
11. **ADR, docs/01, docs/NN:** none touched.

The mutation record at `C:\dev\wt\governance-weekly\scripts\plan\verify-cites.test.mjs:196-210` complies with T1 (c): each mutation was applied, run, failed by name at 522e448 (the commit that added the test), and was reverted. It describes the fixture in words and carries no `path:line` token.

**Amendment 1: class 1 is correct and the form complies.**

- Its first line says it was written after results were seen.
- It records the result (the extra empty line at c57a1cb) and what it invalidates (nothing; fixed at dd47574).
- It is not class 2: no §3/§5 prediction was missed, only §8.2, which was cured before the gate.
- It is not class 3: it is not a pointer fix.
- Two sentences, within the correction ceiling.
- It carries no hash references, so round 15 (e) is not engaged.
- dd47574 does not restore a record byte: `worker.md` is a governing file and the removed line was this piece's own. Round 15 (f) is not engaged, and the three-dot diff stays 0 deletions.
- Its placement at the form's end, not inside §10, is right under append-only.
- Its "done"-type claim is proven by the reviewer's byte check on `worker.md`'s tail.

**Contingency (squash merge of a PR carrying a commit-named span): not presumed.**

- T1 (d) (`C:\dev\wt\governance-weekly\docs\PREREGISTRATION-TEMPLATE.md:174`) and T3's fourth bullet (`C:\dev\wt\governance-weekly\AI_DEVELOPMENT.md:728`) only *ask* in the PR body for a merge that keeps the commit reachable. They describe the non-squash path and give no squash-case remedy.
- T6 (`C:\dev\wt\governance-weekly\.claude\agents\worker.md:33`, "its pin follows on main after the merge") states the non-squash path unconditionally, so it is silent on the squash case, not an answer to it.
- One adjacent point for the question round: T3's filing bullet (`C:\dev\wt\governance-weekly\AI_DEVELOPMENT.md:726`, "reachable from main or from its PR's ref") does settle the squash case for *gate reports'* reviewed commits, with the PR ref as sufficient. It does not settle it for spans. The human's answer should say whether it covers both.

**Gate-log line**

governance-weekly-proposals-2026-09-26, architect attempt 1 at f205478: PASS with notes. §8 items 1–11 pass on read, with the byte check, P1–P4, suites, temp delta, PLAN.yaml CRLF and the M1 re-observation left to the reviewer. The texts adopt round 25, item 2 (a)–(e) and the condition on (b), and nothing beyond: the elaborations are mechanics serving adopted items. T1–T6 are consistent with each other and with §21a–§21d and §22. Amendment 1 is class 1 and its form complies. Notes:
- T6's unclosed fence (the architect's own drafting defect) makes Amendment 1 render as code, which cannot be repaired append-only and does no mechanical harm, since extraction is at 340f516;
- "the form's last line" is true at 340f516;
- T2 names no tool commit for `verify-cites` (governing text, not a record).

The squash contingency is not presumed for spans. T3's PR-ref clause answers it for gate reports, and that goes to the next question round. Record rounds: 0.
