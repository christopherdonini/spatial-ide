*Custodian's filing note (2026-10-03): PR #169's gate 1, the architect, for PLAN node `guardian-v0`. Reviewed: cut/guardian-v0 @ adfcb85709c9ca19032a68866e0ca687da5c3a9c (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message, since the architect has no Write tool, and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is cef4cf0f4759cab7d3bee1e1ead0c9df945f2379b707a7e5ab03a6a608c2f8f6. Write audit PASS: zero write calls (Read 22, Glob 4, Grep 15). C3 clean: before 2026-10-03T21:50:25Z, after 21:59:56Z; main and the worktree are unchanged, and the worktree's porcelain is empty at both. **S2-1 is resolved by the custodian's read:** `<skill-root>/types/claude-code.d.ts:10206-10207` (file sha256 36af9e47…, as the form's §0.1) states that `percentage` is `totalTokens` over `rawMaxTokens` as a whole percentage, 0 to 100, and past 100 when over. So N1's comparison with 80 and the tests' 0 to 100 stubs match the type. The reviewer was asked to verify the same span independently. Profile paths redacted at filing: none.*

---

Reviewed: cut/guardian-v0 @ adfcb85709c9ca19032a68866e0ca687da5c3a9c

# Gate 1, architect: guardian-v0 (PR #169)

**Verdict: PASS, with one carve-out (S2-1).** I found no S1. My PASS does not cover one seam fact that I could not read, the unit of `breakdown.percentage`. The reviewer resolves it. If it turns out not to be 0 to 100, that is S1 under the seam rule and this verdict becomes FAIL.

Unless a line says otherwise, every line reference below is read at adfcb857. Every statement outside a code span is my paraphrase.

## Checklist (form §9, Architect)

1. **Gating heads: hold.**
   - §21a security posture: the direction line names installing Guardian a security-posture change.
   - §21c size: 1555 changed lines over 10 files, against a bound of 150.
   - No five-line form was used (round 25, item 2 (e)).
2. **The brief's §1 to §5 against §2: hold.**
   - §1: the mod only refuses (no `tool.check`, no `allow`, no rewrite, no model call, no network, no write), and every refusing hook fails closed. See register.js:430-437.
   - §2: G1, G2, G3, G4, G6 and N1 are built. G5 is absent, per round 43, item 3. G3's append-shaped Edit is allowed, per round 44, item 1, O-8.
   - §3 item 7: validate lists only `tool.call` variants and the six declared calls (worker report, the validate section).
   - §4: each rule has a refusal case and an allowed case, plus a fail-closed case, the N1 threshold and the N1 band. Each test has one recorded mutation.
   - §5: carried in the README by reference.
3. **Each ruling's record against §2: holds.**
   - Round 43, item 3: there is no G5 code, option or stub.
   - Round 43, item 4: G6 runs on reads (`$.agent.list`, `$.session.messages`). The README carries the REPORT PATH convention and keeps the write audit primary until E5.
   - Round 44, item 1: the draft's O-3 to O-8 recommendations are applied. O-6 resolved to the summary route by Amendment 1 (P0b), item (v). O-7 (a) is read in the next point.
   - On O-7 (a): the draft's own option text covers MultiEdit or NotebookEdit, and says that T34 and those registrations wait (`state/consults/2026-10-03-guardian-v0-architect-draft.md:458-461`).
4. **Seams (§1): hold, except S2-1.**
   - register.js to continuity.mjs: `judgeContinuity` has one product caller, `nudge` (register.js:422). The import is proven under the engine's own dispatch by T26 to T32.
   - continuity.mjs restates the Stop hook's predicate step for step:
     - stop-queue.mjs:228-244 against continuity.mjs:46-62;
     - precompact-flush.mjs:61-79 against continuity.mjs:15-26;
     - both are fail-open on the same branches, and both read the last `flushed_at` match.
   - T35 reads the Stop hook only through the shipped `decide`.
   - The lease the test writes matches `leaseHeldBy`'s parser (stop-queue.mjs:154-166). T36 would catch a lease that was not held, because the stale outcome could then never be reached.
   - The stubbed answer shapes match the build's types as P0 and Amendment 1 excerpt them:
     - FsStat with `realPath`;
     - `session.messages` resolving rows or `{ deny }`;
     - the `process.run` result;
     - `usage.context.breakdown`, per the `get_context_usage` example at `<skill-root>/types/claude-code.d.ts:2621-2642`, excerpted at `state/consults/2026-10-03-guardian-v0-p0-report.md:472-497`.
5. **R1 to R6 against §2.12: hold.**
   - There is no `process.platform` branch anywhere in the plugin or the parity test.
   - Drive spellings are handled only inside `place` (register.js:235-265), with one normaliser (register.js:268-270).
   - The parity test uses `os.tmpdir()`, argv arrays, literal `/` git paths and the branch that `rev-parse` reports.
   - There is no skip and no platform condition.
6. **Round 7 on §7's reasons: holds.**
   - The seven strings (register.js:27-33) each state Guardian's own refusal and its own rule.
   - None states another module's consequence, and none carries a path.
   - N1_TEXT (register.js:36) matches the brief's sentence at `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` byte for byte, with N replaced.
7. **§8, item by item:**
   - Items 1 to 4: clean. Both `$.process.run` sites (register.js:314-317, 422) pass a literal `git` and `timeoutMs` 2000. All five refusing registrations carry a synchronous constant deny `.catch`, and N1 carries none, as designed.
   - Item 5: clean. Amendment 1 (f0da957e) precedes the code (54eba872), per the custodian's commit-order check in the worker report's filing note.
   - Item 6: clean.
   - Item 7: clean. The harness persisted a tool output in the session's tool-results folder (worker report, Hard limits). It is session machinery, like a transcript, not a write the piece made.
   - Items 8 to 11: clean. The README names `project` and `local` only to forbid them, and names `disableAllHooks` only as "not this".
   - Item 12: clean. All 36 tests carry RECORDED MUTATION comments naming 54eba872. No record calls a verify-mutation run an observation.
   - Item 13: clean. 1555 of 1650 lines and 10 of 10 files. There is no class 9 matter.
   - Item 14: clean. Amendment 1 has no repository hash pin, no bare self-line, and a superseded index.
   - Item 15: clean, per the custodian's numstat check.
   - Items 16 to 18: clean. Every parity sub-item holds.
8. **Round 25, item 2: no instance of any named failure.**

## The three weighed items

- **T34 (N-1, no block).**
  - The T34 row is conditional on MultiEdit being typed. Amendment 1 (P0b), item (ii) records MultiEdit as untyped and substitutes NotebookEdit before any code, inside O-7 (a) as ruled.
  - This is not a scope addition on a standing rule (class 9), and not a missed prediction (class 2).
  - The amendment names T34's fixture and mutation but not its written title. The test is lines 599-608 of `tools/mods/spatial-guardian/test/guardian.test.ts` at adfcb857, titled `G2 to G4 cover NotebookEdit`.
  - The closing record carries that title by reference.
  - The test covers no G6 and no allowed case for NotebookEdit; it shares guard code with Write and Edit.
- **Over-refusals (S2-2).**
  - All are fail-closed. The worker's list is at `state/consults/2026-10-03-guardian-v0-worker-report-1.md:245`.
  - Two more are found here:
    - a heredoc's body lines are segments (register.js:84), so a ledger or commit text line that mentions a force-push spelling is refused;
    - G6 reads `rows[0]` of the newest 4096 rows (register.js:347-349; Amendment 1 (P0b), item (iii)), so a lead-data run longer than that loses its brief line and is refused.
  - None falsifies §5. Several threaten the brief's first-week acceptance.
- **The parity design against round 44, item 1: meets the words.** The words are at `state/directives/2026-10-03-guardian-o3-o8-ruling.md:6-8`.
  - Same fixtures: one `FIXTURES` array, each fixture built once into one directory that both sides read.
  - Agreement on every one: a subtest per fixture asserts equality, after an exact 13-id set assertion, so no fixture can be dropped silently. Build errors and over-bound stdout also fail.
  - A divergence fails the gate: the governance-ci test glob (governance-ci.yml:139-140), the `tools/mods/**` filters (lines 83 and 99), and §9's green-CI precondition.
  - The residual is declared in §1: parity holds through a Node runner, not through the engine's `$.process.run`.

## Findings

**S1: none.**

**S2-1. `breakdown.percentage` unit unresolved.**
- N1 compares `usage.context.breakdown.percentage` with 80 (register.js:398-402). The stubs feed it 0 to 100 (lines 54-65 of the test file at adfcb857).
- Amendment 1 (P0b), item (v) cites `<skill-root>/types/claude-code.d.ts:10195-10209` without stating the unit, and no filed record states it. I have no access to `<skill-root>`.
- If the value is a fraction, N1 never fires, E6 never occurs, and the stub encodes an imagined interface (seam rule): S1.
- Required: the reviewer resolves the unit at that span, and the closing record cites it.

**S2-2. Disclose before the human's sight (§9 Operator).** These limits are not in the README:
- G1 fail-open on a git token that abuts `(`, `$(` or a backtick (register.js:84, 151-154). For example, `(git push -f)` and `x=$(git push --force)` reach `next(e)`. This follows §2.2's own segment and token design, which I drafted: a design gap in the form, not a conformance defect.
- The over-refusals above, and the worker's.
- G6's 4096-row window.
- G3's case-alias miss for preregistrations, already in the README (line 31).
- Route: either a README delta, re-gated (small), or the custodian's sight note. Hardening G1 against subshells would change §2.2 and needs an amendment before code, or a follow-up node. That is the human's choice.

**S2-3. The live ENOENT shape is unproven (worker point 3).**
- `place` treats only a rejection naming ENOENT as a missing file (register.js:226-228, 248-253).
- If the live rejection names neither, every new-file Write is refused by the catch.
- No E-row covers a new-file Write; E1 to E3 use existing files.
- Proposal: a class 7 amendment adding E4, a main-loop Write that creates a new file, predicted to pass. The E4 slot is unused.

**N-2. Undeclared deviations from §2's text.** All are fail-closed or symmetric. Record them by reference, without restating:
- `place` throws on a non-ENOENT own-stat failure, giving CATCH_REASON where §2.1(d) gives UNPLACEABLE (register.js:252).
- G6 runs after placement (register.js:363-368), against §2.1(g)'s order; the outcome is the same.
- G1 adds rules §2.2's last bullet does not list:
  - abbreviated long options (register.js:157-159, 175);
  - git by path or `git.exe` (register.js:151-154);
  - `MAX_RESCAN_DEPTH` 4, which refuses at the cap and is not a §7 value (register.js:42, 213).
- The parity runner uses `r.status ?? 1` (line 250 of the parity test at adfcb857).
- The parity test sets `GIT_CEILING_DIRECTORIES` per fixture, which §2.13's environment list does not name (lines 286-298 at adfcb857).
- `register(on)` takes no `options`, where §2.0 names `register(on, options)`.

**N-3. N1 calls a summary usage estimate on every main-loop tool call.** The cost is unmeasured. §1 claims no latency figure; watch it in the first week.

## Closing-record list (references and hashes only, per the record cap)

1. Each mutation's observation of record: the worker's at 54eba872, and the reviewer's at the gated head. Name `claude --version` for T1 to T34, and `node --version` and `git --version` for T35 and T36 (§4).
2. T34's written title, by reference to Amendment 1 (P0b), item (ii).
3. S2-1's resolution, a d.ts line cite.
4. N-2's deviations, by line, at a commit on main after the merge commit (round 15 (e)).
5. S2-2's limits, with where they were disclosed.
6. S2-3's E4, if the human adopts it.
7. Tool claims with each tool's commit: verify-* at 10febb28; verify-mutation not relied on (round 15 (c)).
8. The validate outputs, text and `--json`, in the PR body (§4). The reviewer confirms.
9. A merge commit, never a squash, so that 54eba872 stays reachable (§8 item 16).

Files read:
- C:/dev/wt/guardian-v0/tools/mods/GUARDIAN-V0-PREREGISTRATION.md
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/hooks/register.js
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/hooks/continuity.mjs
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/test/guardian.test.ts
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/README.md
- C:/dev/wt/guardian-v0/scripts/hooks/guardian-continuity-parity.test.mjs
- C:/dev/wt/guardian-v0/.github/workflows/governance-ci.yml
- C:/dev/spatial-ide/state/consults/2026-10-03-guardian-v0-worker-report-1.md
