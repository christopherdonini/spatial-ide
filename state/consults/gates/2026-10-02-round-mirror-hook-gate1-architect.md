*Custodian's filing note (2026-10-02): the architect's gate 1 on PR #154, for PLAN node `round-mirror-pretooluse-hook`, full gating. Reviewed: cut/round-mirror-hook @ 948f12620ca47a5bd4cacd41b7747f6c8f6b8497 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), and transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. The harness prefixed the hand-back with a note that it matched an instruction-shaped pattern (settings-json). That note is not the agent's text and is not reproduced. The report's branch-only `path:line` cites are read at 948f126. Verdict PASS, with notes only (N1 to N12). N11, the branch-only cites in the filed worker report, was already fixed on main at e1e244a. N7, §28's heading after the merge with item C, is taken when main is merged into the branch. N9, a pre-existing misquote, is routed. Profile paths redacted at filing: none.*

---

VERDICT: PASS — cut/round-mirror-hook @ 948f12620ca47a5bd4cacd41b7747f6c8f6b8497

No S1 and no S2 findings. The notes below are N. Cites are read at 948f126 unless marked "main".

**Gating line and exposure.** I confirm the no-new-exposure reading, so no security head is added. The outbound channel is §16's existing mirror: `mirrorRound` → `telegram.mjs`, a private bot chat (`scripts/hooks/questions-mirror.mjs:192`). The content class is unchanged: the round's own text, which reaches the public repo only through a scanned commit. Skipping the profile-path scan before the send is not new, because the hand CLI also sent unscanned text, and §1 discloses it. Both full-gating heads hold: the cloud-inert settings test covers the new command (`scripts/hooks/cloud.test.mjs:51-59`, input `{}` → guard → silent), and the hook sits on §4's answer channel.

**Round 33, item 3 against §2, and the single-writer rule.** Each call writes one file with `wx` and sends once through `mirrorRound` (`questions-mirror.mjs:179-192`). Nothing reads, adopts or dedupes an existing round file: names are listed only to number the new one (`:179-183`). The ruled label "One call per round (Recommended)" is satisfied. Above 4096 code points the send is summary plus document, which is §16's send, as the drafting consult read it.

**Never blocks, alters or answers (§8 item 1, H5).**
- The hook path writes nothing to stdout and never calls `process.exit`.
- `exitCode` is 0 (`:212-216`). The entry calls `hookMain`, whose body is wrapped (`:203-210`).
- Nothing emits `decision`, `permissionDecision` or `updatedInput`.
- `telegram.mjs` prints to stderr only.
- H5 is consistent with Appendix B's exit-0 routing (`AUTONOMY.md:429`): with empty stdout there is nothing for Claude Code to parse.

**AUTONOMY.md §28 against §2 item 15.**
- It is append-only: main ends at `AUTONOMY.md:490`, and the branch adds 491-501 with no deletions.
- §4 and §16 are untouched.
- §28 quotes nothing and cites the ruling by round and item (`AUTONOMY.md:494`).
- The six bullets map one-to-one onto item 15's six (`AUTONOMY.md:496-501`).
- The discharge claim at `:496` names T11, which exists and asserts the composition. Live delivery is left to E2, as the form says.

**Seams and the caller rule.**
- `leaseHeldBy` gains only `export` (`scripts/hooks/stop-queue.mjs:143`; main has `function leaseHeldBy` at the same line). Its product caller is `questions-mirror.mjs:164`, called with the real signature `(projectRoot, sessionId) → {held}`.
- `mirrorRound` (`:192`) and `isCloudSession` (`:204`) are called with their real signatures.
- There is no other new export.
- T11 is E1 (`scripts/hooks/questions-mirror.test.mjs:289-319`). It reads the command from `.claude/settings.json`, runs it through Git Bash or `/bin/sh`, and feeds it the transcript-shaped fixture. That passes the seam rule as declared. Envelope delivery stays H2, with E2 as its discriminator.

**H1 to H7 against the Appendix B pins.** The PR only appends, so the pinned lines `AUTONOMY.md:425`, `:427`, `:429` and `:453` are unchanged at 948f126.
- H1: the letters-only matcher takes the exact-string path (`:453`).
- H5: see above (`:429`).
- H7: the timeout of 20 (`.claude/settings.json:10`) replaces the default 600 (`:427`).
- H2, H3, H4 and H6 have no pin and are labelled as hypotheses in the README (`scripts/hooks/README.md:224-229`).
- The form treats each pin as historical, as round 14 requires.

**Operator-visible text (round 7).** The six stderr lines match §7 byte for byte (`questions-mirror.mjs:159, 167, 176, 188, 199, 208`). Each states the hook's own fact and its own consequence.

**R1 to R6.**
- R1: `path.join` is used, with LF and a forward-slash `file` key (`:171, :184, :196`).
- R2: there is no `process.platform` in the script. The test branch at `questions-mirror.test.mjs:305` is a copy of `cloud.test.mjs:43-46`.
- R3: Windows runs locally, and governance-ci runs `scripts/hooks/*.test.mjs` (`.github/workflows/governance-ci.yml:127`).
- R4: the tests use `os.tmpdir()` and `process.execPath`, and only T11 spawns the shell. No drive letter appears.
- R5: L1 only.
- R6: no skip.

**Findings (all N)**

- **N1, deviation 1 (T11 copies six scripts), `questions-mirror.test.mjs:298-304`. No amendment needed.** The copy is forced by S11 as declared: `CLAUDE_PROJECT_DIR` is set to the test project, and the command resolves the script under it. The files are byte copies of the shipped tree, and the command string is still read from settings. §3's test-project description lists contents but is not exhaustive, and the directory is still removed by `t.after`. Two consequences:
  - Importing `stop-queue.mjs` at module scope (`questions-mirror.mjs:31`) pulls `scripts/plan/plan.mjs` and `yamlSubset.mjs` into the mirror's load path, including the file-argument CLI's. Its behaviour and exit codes are unchanged, so I2 does not trip.
  - If an import is added later, T11 fails loudly; it cannot pass silently.

  The closing record should state the copy.
- **N2, deviation 3 (valid non-object JSON gets the not-JSON line), `questions-mirror.mjs:157-159`. No amendment needed.** The behaviour stays in §2 item 5's class: one line, exit 0, nothing written. The line also stays in §7's set of six. But for `null` or `[]` the line states something false, since that input is JSON. Claude Code always sends an object, so this is unreachable in practice. The branch has no test. Record the reading in the closing record ("not JSON" read as "not a JSON object").
- **N3, deviation 2 (`, ` separator), `questions-mirror.mjs:140`. No amendment needed.** It matches §7's "comma-separated" and the hand-written convention. No test covers two or more red-line items, so the separator itself is untested.
- **N4, deviations 4 and 7 (commit-message line cites and the model trailer). No amendment needed.** They sit in pushed commit messages, not records. Rewriting them needs a force-push, a red line confirmed in round 34, item 3. The closing record discloses both. The custodian's note already says so.
- **N5, deviation 5 (fixture 74 lines against an estimate of 45). No amendment needed.** §7 sets an estimate, not a ceiling.
- **N5, deviation 6 (E2 not run). No amendment needed.** E2 is the custodian's record after the merge, by design.
- **N6, §7 count.** The worker's table sums to 484 insertions and 3 deletions, but its total line says 4 deletions and 488. My read of main against the branch gives one deletion each in `questions-mirror.mjs` (the entry block), `questions-mirror.test.mjs` (the child_process import) and `stop-queue.mjs:143`, so 487. The closing record uses git's count, recounted by the reviewer. Either way the change is under the 700 ceiling, over 7 files.
- **N7, §28 heading and merge order, `AUTONOMY.md:492`.** The heading says "appended after §26". On main (385b2ff), item C merges first with §27. When this branch merges main, §28 will sit after §27, and the heading must say "after §27" in that merge resolution. Otherwise it misstates where it was placed. This is unmerged branch text, not a record.
- **N8, mutation timing.** The local reflog is evidence, not Authority. It puts all three commits within 6 min 5 s of the branch's creation (11:44:53Z to 11:50:58Z). The 13 observations "at 753dcaf" fall in the 98 s before 948f126. That fits only a scripted batch. The worker's own first M8 attempt also anchored on the wrong `if (!outcome.ok)`. The reviewer's "M1 to M13 observed" line should re-observe, at least M8, M12 and M13, and not accept the comments as proof.
- **N9, pre-existing misquote, not introduced here.** `questions-mirror.mjs:4-12` (main 4-12, identical) is marked verbatim from Appendix A3 (`AUTONOMY.md:462`). It silently drops "(explicit selection or typed text only, as ruled)" and ", so answers can be pasted in sequence". Each drop is an unmarked elision, and the first removes a qualifier, which round 10 and round 11 name as a failure. It is outside this diff's hunks and outside §2 item 14's bound. Route it as a ledger finding or a small fix node, and do not fix it here without an amendment.
- **N10, the custodian check after a timeout.**
  - **The gap:** if the hook is cancelled at 20 s (H7), the round file exists but no outcome line is appended. The last line of `round-mirror.jsonl` is then the previous round's and may read `ok: true`.
  - **Why 20 s can be reached:** `telegram.mjs:77,99`'s 8 s is a socket idle timeout, not a wall-clock bound.
  - **The fix:** the E2 record and the custodian's practice should compare the last line's `round` to n. A mismatch counts as a missing outcome.
- **N11, evidence on main, not this diff.** Line 83 of the filed worker report cites `scripts/hooks/questions-mirror.mjs:31` and `:164`. Both are branch-only lines; main's file is 115 lines long. Reports under `state/consults/` (not `gates/`) are gated by verify-cites (`scripts/plan/verify-cites.mjs:82`). The custodian should check main's verify-cites and CI after 385b2ff and de-root those cites if they fail.
- **N12, H4.** `agent_id` is the one seam field with no pin and no discriminator. If a subagent's PreToolUse carries the parent's `session_id` and no `agent_id`, a subagent question would be mirrored as a round. I1 does not name that case. It is already disclosed under may-not-claim, so the form-level acceptance stands.

**§8, item by item**
1. Holds: no stdout, no exit call, no decision keys (`questions-mirror.mjs:153-220`).
2. Holds: no Telegram read.
3. Holds: no git call and no network outside `mirrorRound`. Writes are limited to `round-<n>.md` (`:186`) and the jsonl (`:193-197`), plus `mkdir` of `.claude/state`.
4. Holds: no dedupe, grouping, adopt or skip.
5. Holds: I2 is clean. `mirrorRound`, `telegram.mjs`, `cloud.mjs` and `main()` are unchanged, and `stop-queue.mjs` changes by one token.
6. Holds: silent cases print nothing (`:162, :164`), and the cloud guard is the first statement of the hook branch (`:204`).
7. Holds: explicit environment (`questions-mirror.test.mjs:109-116`), `t.after` cleanup (`:119`), no ignore, and 13 RECORDED MUTATION comments, each naming 753dcaf.
8. Holds in the fixture and tests. Commit bodies are for the reviewer to scan; the subjects I saw are clean.
9. Holds: append-only.
10. Holds: no quotation in the new comments (`questions-mirror.mjs:20-21, :117`), `README.md:216-239` or §28. The misquote at `:4-12` is pre-existing (N9).
11. Holds: seven files.
12. Not yet applicable: no record has been written. The worker report says verify-mutation is not an observation.
13. Holds: under budget, with no scope addition.
14. Holds: no record rows. The test comments name a commit id with no hash.
15. Pending: merge-commit at the click.

Relevant paths:
- C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.mjs
- C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.test.mjs
- C:/dev/wt/round-mirror-hook/AUTONOMY.md
- C:/dev/wt/round-mirror-hook/scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-02-round-mirror-hook-worker-report-1.md
