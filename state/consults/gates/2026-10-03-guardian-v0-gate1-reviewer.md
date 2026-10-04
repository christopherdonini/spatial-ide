*Custodian's filing note (2026-10-03): PR #169's gate 1, the reviewer, for PLAN node `guardian-v0`. Reviewed: cut/guardian-v0 @ adfcb85709c9ca19032a68866e0ca687da5c3a9c (from the report's own second line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). Written by the reviewer to this path through its shell, as its brief permitted, and committed as written below the rule. Its sha256, from this file's line 5 to the end, is a608cc6fd75d3e29731157e60099747c45053af7dffa32bdf2d706c0acc90ac6, equal to the hand-back. The guardian worktree's porcelain was empty after the run. **S1-1 was reproduced by the custodian** at 2026-10-03T22:03Z: `claude plugin test tools/mods/spatial-guardian` exits 1 with the same refusal line, build 2.1.288. The worker's runs of the same command passed at about 21:00Z to 21:40Z. Cost: 167,032 subagent tokens, 47 tool uses, 970,145 ms. Profile paths redacted at filing: none.*

---

# PR #169 gate 1 — reviewer
Reviewed: cut/guardian-v0 @ adfcb85709c9ca19032a68866e0ca687da5c3a9c

Base: main 10febb28cd56bf233df04321b2ed7d6c020a9df7 (the merge base). Governing form: `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` as on main, plus its Amendment 1 (P0b) on the branch (commit f0da957e). `<worktree>` = the gate worktree on `cut/guardian-v0`. `<skill-root>` = the build's bundled plugin-authoring skill folder for 2.1.288. Every repository cite below is read at the reviewed commit.

## Verdict: FAIL

One S1, and it is an evidence gap, not a code defect: the §9 Reviewer items for T1 to T34 could not be discharged on this machine. Every other item I could run passed, and I found nothing in the code that blocks. The gate should be re-run once `claude plugin test` works here.

## S1 (blocking)

**S1-1. `claude plugin test tools/mods/spatial-guardian` does not run on this machine, so the §9 Reviewer items "`claude plugin test` ... on the custodian's machine" and "every mutation observed at the gated head" (T1 to T34) are undischarged.** Two runs at adfcb857, each exit 1, printed only this line (command output, byte-copied):

```text
claude plugin test: hooks modules are turned off in this process: the rollout switch was saved off by an earlier session and is not refreshed yet. Start `claude` once with network access, then run the tests again; if this message returns, installed mods are turned off remotely
```

The fix it asks for, starting a Claude session, is outside my hard limits (no `claude` command beyond `--version`, `plugin validate` and `plugin test`; no session). So I did not observe T1 to T34 passing at the head, and I did not observe any of their 34 mutations. The worker's run (report 1, 34 pass, mutations at 54eba872) is the worker's evidence. §4 names the reviewer's own run as separate evidence of record, and an affirmative PASS cannot rest on the worker's run alone. `git diff 54eba872 adfcb857` changes comment lines only (2 files, every changed line a `//` comment), so the worker's mutation runs apply to the code at the head. That narrows the gap, but it does not close it.
*To re-gate:* the human (or a session he approves) refreshes the rollout switch. The reviewer then re-runs `claude plugin test` and the 34 mutations at the head. Nothing in the diff needs to change for that.

The coordinator's added check (the architect's S2-1, the unit of N1's fill) **passes, so it is not an S1.** See "Seam: N1's percentage unit" below.

## S2

**S2-1. G1 lets three bash spellings of a force-push through.** These are a subshell, a command substitution and backticks. I probed the shipped `pushRefused` in a scratch copy (register.js plus an `export { pushRefused }` line; outside the repository):
- `(git push -f origin main)`: ALLOW
- `x=$(git push --force origin main)`: ALLOW
- `echo` followed by `git push -f` wrapped in backticks: ALLOW
- `{ git push -f; }`, `sudo git push -f`, `env GIT_X=1 git push --force`, `git push origin main --force`: REFUSE (correct)

Cause: `splitSegments` (register.js:53-94) does not split at `(`, `)`, `$(` or a backtick. So the token is `(git`, `$(git`, or `git` with a leading backtick, and `isGit` (register.js:151-154) does not match it. Read literally, this is §2.2's design ("its tokens hold `git`"), and §1's G1 exclusions (aliases, scripts, configured refspecs, environment variables) do not cover these spellings. The brief's G1 row says "in every spelling" (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:18` @ 1bb94e19 sha256:2dde0d4bf65b0e1657763e909093c4a1938f4ac97b0d9cc4b452ad7bfeb3a0c8). I rate it S2, not S1, for three reasons: the code meets the form as written; no §3 fixture or §5 falsification line is crossed; and changing the splitter changes §2.2, which needs an amendment. I recommend the human sees it before his install approval. Either amend §2.2 so these characters are segment boundaries and add one T-row, or add the three spellings to §1's "may not claim" list and the README.

**S2-2. Every new-file Write depends on the live shape of a stat rejection, and no E-row probes it.** `place` (register.js:249-253) treats a rejected own-stat as "file not there" only when `isEnoent` (register.js:226-228) finds `ENOENT` in `code` or `message`. Any other rejection throws, and the catch denies. The types say stat "rejects `ENOENT` for a missing path" (`<skill-root>/types/claude-code.d.ts:3072-3073`, sha256 of those two lines 733ed29a4b360ff3176bba6605a55a12ba120e94ee2bf87f2e6bd8d2d634e98f). The test stub denies with a message holding `ENOENT` (guardian.test.ts:70). Whether the engine's real rejection carries it is unproven (the worker's Point 3). If it does not, every Write that creates a file, in any folder, is refused after install. That fails closed, but it is a session-wide over-refusal. E1 to E3 are all Edits on existing files. I recommend that the install approval also names one main-loop Write that creates a new file (any scratch path) as a live probe.

## N

- **N-1, §2.1(g) order.** `guard` places first (register.js:363) and runs G6 after (register.js:364-367). The form orders G6, then placement. G6 needs the placed path to compare, so the outcome is the same: either path ends in a deny or `next(e)`. Only the reason text differs, when a report-only run's path is unplaceable (G6_REASON in place of UNPLACEABLE_REASON). It is not a deviation in effect.
- **N-2.** register.js:430 exports `register(on)`, and §2.0 says `register(on, options)`. `options` is unused, and validate accepts the module.
- **N-3.** §7 says each reason starts "`spatial-guardian <id>:`". UNPLACEABLE_REASON and CATCH_REASON (register.js:32-33) start `spatial-guardian:` with no id. §7 gives neither of them an id, so this is a wording point for the human's sight of the reasons.
- **N-4, worker Point 1 (T34).** Amendment 1, item (ii) redirects T34 to NotebookEdit, because MultiEdit is untyped. That is consistent with §2.0 and §2.10's conditional extension. The form's §4 T34 row (MultiEdit) stays unbuilt, and its condition did not hold. verify-test-claims passes. I accept the reading.
- **N-5, worker Point 2.** The claim that N1, registered first, is outermost is not distinguished by T30. With N1 innermost, the G1 deny also ends before N1 runs, and `procs.length` stays 0. Either order is harmless: a refused call gets no nudge either way. It is unverified here, because the plugin tests did not run.
- **N-6, worker Point 4.** I confirmed the declared over-refusals: `echo git push -f` is refused, and a quoted `git commit -m "push -f"` is allowed. Both are as §2.2 designs them.
- **N-7.** The parity runner uses `exitCode: r.status ?? 1` (parity test:250), and §2.13 says `exitCode: status`. `status` is null only on a signal kill, which reads as unreadable either way.
- **N-8.** Both validate runs warn that `plugin.json` has no `version`. §2.0 lists only name, description and author, so this is correct as built.

## Seam: N1's percentage unit (the coordinator's added check)

- I read the types at `<skill-root>/types/claude-code.d.ts` after checking its sha256: 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1, equal to §0.1's.
- `SessionContextBreakdown.percentage` is documented as `totalTokens` over `rawMaxTokens`, as a whole percentage from 0 to 100, going past 100 when over. Cite: `<skill-root>/types/claude-code.d.ts:10206-10208` (sha256 of those three lines bb7a6a6e4137d31c63286518d0dab593dd5444470512d385ff152d0dc6b281e4).
- The breakdown sits at `context.breakdown` and is present only when the call passed `breakdown`: `<skill-root>/types/claude-code.d.ts:10282-10289` (sha256 5ed6c03bc4bd5c2eaaaa46627c3c4fd6328cea37f74a9e6e3f76d30ded1ad46e).
- So register.js:399-401 reads `usage.context.breakdown.percentage`, in the unit §7's `N1_THRESHOLD = 80` assumes.
- The stubs (guardian.test.ts:54-65) feed `percentage` at `context.breakdown`, with values 10, 40, 79, 80, 81, 83.4, 85, 89 and 90. That is the same path and the same 0 to 100 unit. 83.4 is not a whole number: T32 uses it to exercise `Math.round`, which is harmless.
- **The stubs match. No S1.**

Other seam shapes, checked against the same file:
- `$.agent.list` is `Promise<AgentInfo[]>` (line 2979).
- `$.session.messages` with `{ agentId }` resolves the newest 4096 rows, oldest first (its example takes `.at(-1)` as the last), or a resolved `{ deny }` (lines 2546-2551, sha256 f94e06a9f1d3ea44d62fe84549b6f8ac91ba4a4a66eeb7e8b91dd37495ffb9cf). `g6Refusal` handles that `{ deny }` as non-array, and refuses (register.js:348).
- `ProcessRunInit.timeoutMs` exists (lines 7538-7556). `$.process.run(argv, init)` is line 3307, which matches the test's `e.argv` and `e.init.timeoutMs`.

## Checklist results

- **Full diff, three-dot** (`git diff origin/main...origin/cut/guardian-v0`): 11 files, 1584 insertions. These are the 10 files on §7's list plus the form's Amendment 1. Amendment 1 is a pure append (0 removed lines against 10febb28), in its own commit f0da957e, before the code commit 54eba872. §8 items 5 and 14 (last bullet) are met.
- **§7 recount**, by its own command with `<base>` 10febb28 and `<head>` adfcb857: 1555 insertions, 0 deletions, 1555 changed lines over 10 files (2, 347, 14, 7, 1, 74, 62, 3, 437, 608). That is under the 1650-line and 10-file ceilings. No class 8 is due, and §7's line is unedited.
- **I7:** the `state/CUT-STATE.md` blob at 10febb28 is 322178 bytes, under 4194304.
- **§8 item 3:** there are exactly two `$.process.run` call sites. register.js:314-317 passes argv[0] as the literal `'git'` (`cat-file -e`), with `timeoutMs: PROCESS_TIMEOUT_MS`. register.js:422 passes `['git', ...args]`, with `timeoutMs: PROCESS_TIMEOUT_MS`. `PROCESS_TIMEOUT_MS = 2000` (register.js:21), equal to §7. Pass.
- **§8, item by item:**
  1. pass. No `tool.check`, no `allow`, and `next(` is called only with `e` (register.js:374, 390, 410). There are no `$.model`, `$.ui`, `$.http`, `$.fs.write` or `$.store` calls (grep over hooks/).
  2. pass. All five refusing registrations carry `.catch(() => ({ deny: CATCH_REASON }))` (register.js:432-436).
  3. pass (above).
  4. pass. validate's hooks and calls lines are §2.0's set plus the PowerShell and NotebookEdit additions that Amendment 1 brings in.
  5. pass. No G5 code; the extension code and the summary route land after Amendment 1.
  6. pass. No npm dependency, `package.json` or lockfile; `.claude-plugin/types/` is ignored and absent.
  7. pass, as far as this gate goes: no install, enable or session by me; nothing written under the user Claude directory.
  8. pass. The README names `disableAllHooks` only as "Not" an off-switch, and names `project` or `local` only as "Never".
  9. pass. No scanner matcher.
  10. pass. No `process.platform`; drive-letter regexes appear only in `place`; no reason carries a call path.
  11. pass. No profile path in the files or the commit messages (grep count 0).
  12. pass. All 36 new tests carry RECORDED MUTATION comments naming 54eba872. No record calls a verify-mutation run an observation.
  13. pass.
  14. pass. No ledger line cite, no branch-commit hash pin, and Amendment 1 is numbered first with a superseded index of "None".
  15. pass. The files are §7's 10 plus the form.
  16. n/a, pre-merge.
  17. pass. Each reason states Guardian's own refusal (register.js:27-33).
  18. pass. One predicate; continuity.mjs has no import and one export; T35 reads the Stop side only through `decide`; every fixture is in `FIXTURES` and read by both sides; no skip, todo or platform condition; no existing `scripts/hooks/` file is edited.
- **§2 against the code:**
  - G1 (§2.2) matches, apart from S2-1.
  - G2 (register.js:371), G4 (register.js:372) and G3 (register.js:300-338: ADR status window `isProposed`, cat-file with `cwd` the placed folder, the Write `startsWith`, the Edit append shape, NotebookEdit never an append) match §2.3 to §2.5.
  - G6 matches §2.7, apart from N-1.
  - N1 matches §2.8 and Amendment 1 item (v): the summary route, the threshold, the band, clearing below 80, the `agentId` and deny early returns, and context appended without touching `result` or `text`.
  - `N1_TEXT` matches the brief's sentence at `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ 1bb94e19 sha256:1ca3956c77cd959acc4870fa10506b1eef14b1f5449899f47d5864d2d32d1f41 (a sub-line span; the line's hash recomputed), with N as `Math.round(p)`.
  - continuity.mjs follows `scripts/hooks/stop-queue.mjs:221-244` @ 1bb94e19 sha256:50459de9de302d1204c49e48785397139532f31147706f804d0efe07d929e115 and `scripts/hooks/precompact-flush.mjs:57-79` @ 1bb94e19 sha256:47c99404d4b44c84a0ad6fc59c2f4d85059ebfd04db980af8e4e2d749195e725 step for step: same fail-open readings, an empty `flushed_at` treated as absent on both sides, and only the log format narrowed. The pins are historical; the tree at adfcb857 holds the same function text, and the tree is what I read.
- **Parity outcomes** (my Windows run): all 13 equal §3's predictions on both sides. PS1 stale, PS2 fresh, PS3 fresh, PS4a not judged, PS4b fresh, PS5 stale, PS6 stale, PS7 fresh, PS8 stale, PS9 stale, PS10 stale, PS18 not judged, PS19 not judged.
- **Branch CI:** Governance CI run 37156316544 (pull_request) at head adfcb85709c9ca19032a68866e0ca687da5c3a9c concluded success. Its log shows both parity tests passing and `tests 440, pass 440, fail 0`. DCO sign-off and the exposure scan also succeeded on the same push.

## Mutations observed at the gated head (adfcb857)

Each was applied in `<worktree>`, run with `node --test scripts/hooks/guardian-continuity-parity.test.mjs` (node v24.18.1, git 2.49.0.windows.1), recorded and reverted with `git checkout -- <file>`, and followed by an empty `git status --porcelain`.
- **M35a**, in continuity.mjs: `if (c === null) return { judged: true, stale: false };`. Exit 1. Fails `PS4a` and `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`. This equals the recorded comment.
- **M35b**, in stop-queue.mjs, in the working tree only: `stale: current.flushedAt !== parent.flushedAt,`. Exit 1. Fails `PS1`, `PS2`, `PS3`, `PS5`, `PS6`, `PS8`, `PS9`, `PS10` and the agreement test. This equals the recorded comment.
- **M36**, in the parity test: `fx.build(dir)` replaced by `FIXTURES.find((f) => f.id === 'PS7').build(dir)`. Exit 1. Fails `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook`. This equals the recorded comment.
- **T1 to T34: not observed** (S1-1).

The verify-mutation run listed below is a comment-presence scan, not an observation of any mutation.

## Commands run, with exit codes (in `<worktree>` unless noted)

| Command | Exit |
|---|---|
| `git status --porcelain` (start, after each mutation, end) | 0, empty each time |
| `git fetch origin`; `git rev-parse HEAD origin/cut/guardian-v0` (both adfcb857) | 0 |
| `git diff --stat origin/main...origin/cut/guardian-v0` and the full three-dot diff, read | 0 |
| `git diff 54eba872 adfcb857` (comments only) | 0 |
| `timeout 60 claude --version` (2.1.288 (Claude Code)) | 0 |
| `node --version` (v24.18.1); `git --version` (git version 2.49.0.windows.1) | 0 |
| `timeout 300 claude plugin test tools/mods/spatial-guardian` (twice) | 1, 1 (S1-1) |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian` (passed, one `version` warning; hooks and calls lines as in the worker's report) | 0 |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian --json` (`success: true`) | 0 |
| `timeout 120 claude plugin validate tools/mods` (passed, one `version` warning) | 0 |
| `timeout 120 claude plugin validate tools/mods --json` (`success: true`) | 0 |
| `timeout 600 node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (tests 440, pass 440, fail 0; T35 with its 13 subtests and T36 named) | 0 |
| M35a, M35b and M36 runs of `node --test scripts/hooks/guardian-continuity-parity.test.mjs` | 1, 1, 1 |
| §7 command (above) | 0 |
| `git cat-file -s 10febb28:state/CUT-STATE.md` (322178) | 0 |
| `node scripts/plan/verify-cites.mjs` (tool at 522e448d): PASS, 1215 files | 0 |
| `node scripts/plan/verify-quotes.mjs` (tool at f9444a4d): PASS, 0 hash-reference errors | 0 |
| `node scripts/plan/verify-test-claims.mjs` (tool at e9735d47): PASS, 488 claimed | 0 |
| `node scripts/plan/verify.mjs` (tool at 26072022): verify:plan PASS | 0 |
| `node scripts/plan/verify-mutation.mjs` (tool at 7d24ed15): PASS, 36 new tests have a comment; not an observation | 0 |
| `gh run list --branch cut/guardian-v0`; `gh run view 37156316544` (head adfcb857, success) | 0 |
| `gh pr checks 169` | 124 (timed out; replaced by `gh run list`/`view`) |
| `sha256sum` and `sed -n` over `<skill-root>/types/claude-code.d.ts` (read only) | 0 |
| G1 probe: `node probe.mjs` over a scratch copy of register.js, in the session scratchpad and outside the repository | 0 |

Hard limits: no `claude` command other than the three permitted; no install, enable, marketplace, init, update, configure, eval or session; nothing written under the user Claude directory. The worktree ends clean. The one write outside the scratchpad is this report.
