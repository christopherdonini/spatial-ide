*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #154, for PLAN node `round-mirror-pretooluse-hook`, full gating. Reviewed: cut/round-mirror-hook @ 948f12620ca47a5bd4cacd41b7747f6c8f6b8497 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b) and transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. The harness prefixed the hand-back with a settings-json pattern note, which is not the agent's text and is not reproduced. Its branch-only `path:line` cites are read at 948f126.*

*Verdict: FAIL on one S1. S1-1: the fixture's envelope lacks the PreToolUse keys §3 and §2 item 3 name. Correction round 1 takes S1-1, S2-2 (the README's H4 label) and both gates' note on non-object JSON. S2-1, §28's heading, is fixed when main is merged into the branch after item C's PR lands.*

*Profile paths redacted at filing: none. Shared scratchpad file names the report mentions are left as given.*

---

VERDICT: FAIL. Reviewed `cut/round-mirror-hook @ 948f12620ca47a5bd4cacd41b7747f6c8f6b8497`, the diff `01b5ba0...948f126`. The merge-base is 01b5ba0, confirmed.

The verdict is FAIL on one S1: the fixture's envelope does not match §3. Everything else holds. The code matches §2 and §7, all 13 mutations reproduce as recorded, and the suites, CI and the verify tools are green.

## S1 (blocking)

**S1-1. The fixture's envelope does not match §3, and the worker did not disclose it (§9 Reviewer, "the fixture's envelope checked against §3").**
- `scripts/hooks/fixtures/pretooluse-askuserquestion.json:1-6` @ 948f126 has only these top-level keys: `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `tool_input`.
- §3 says "the envelope keys are those the hooks page lists for PreToolUse (H2)".
- The form treats `tool_name`, `prompt_id` and `tool_use_id` as fields the event carries and the hook does not read (§2 item 3; §8 item 4 for `prompt_id`).
- The tracked proposal also says every event receives common fields, among them `prompt_id` (`state/drafts/weekly-window-2026-10-02.md:109` @ 948f126).
- So a PreToolUse payload without `tool_name` is not the event's shape.
- What the omission does and does not affect:
  - Behaviour is unaffected, because the hook never reads those keys.
  - But T11/E1 is the seam's end-to-end test "from the real shape" (§1 Seams). Its stdin leaves out keys the form itself says are present, so "nothing else is read" is never exercised with those keys present.
  - The worker's report lists seven deviations and this is not among them.
- Remedy, either one:
  - (a) Add `tool_name: "AskUserQuestion"` and invented values for `prompt_id`, `tool_use_id` and `permission_mode` (the hooks page's other PreToolUse key; I take that from the page as I know it, since the page is untracked and I could not resolve it here). `tool_input` stays as it is. This is about 4 lines and fits the budget.
  - (b) An amendment that narrows §3 to the four keys and says so.
- I could not resolve the page's exact key list from the repository, because it is an untracked source. The block rests on the form's own text, not on the page.

## S2

**S2-1. The §28 heading becomes false when the PR merges.**
- `AUTONOMY.md:492` @ 948f126 says "appended after §26".
- origin/main 4d203d4 gives §27 to item C, which merges first (385b2ff says this PR merges after C).
- The merge that brings in §27 conflicts at the end of AUTONOMY.md, and §28 will then follow §27.
- Fix the parenthetical in that conflict resolution, and have it checked.

**S2-2. The README does not label H4 a hypothesis (§2 item 14 says "with H1 to H4 labelled as hypotheses").**
- `scripts/hooks/README.md:226-229` @ 948f126 calls H1, H2 and H3 "hypotheses until the form's E2 is recorded".
- H4 gets only "is unit-tested only".
- This is a one-word fix and can ride with S1-1.

## N

**N-1. The non-object JSON message is false.**
- Valid JSON that is not an object (`null`, `[]`, `5`) prints "hook input is not JSON" (`scripts/hooks/questions-mirror.mjs:157`). Disclosed as deviation 3.
- The "no well-formed questions" line would be the true one. Exit 0 holds either way.

**N-2. Some messages over-claim.**
- `questions-mirror.mjs:176` reports a missing directory for any `readdirSync` error, including ENOTDIR and EACCES.
- `:188` prints `(undefined)` when the error has no `code`.

**N-3. Three of the six §7 lines have no test:** no directory, write failed, and hook error. §4 does not require them. The write-failed line is also the parallel-call EEXIST path from §1.

**N-4. The settings-wide cloud test does not catch a missing guard on this command.**
- With stdin `{}` and no `session_id`, the lease case keeps the hook silent even without the guard.
- T7 is the test that catches it, and M7 was observed.

**N-5. The header comment slightly overstates the send count.**
- `questions-mirror.mjs:21` says "one send per call".
- The document path makes two sends: the summary and the document.

**N-6. The header date placeholder is read without a literal " UTC".**
- §7 writes `<YYYY-MM-DD UTC>`; the code renders `2026-10-02`.
- That is a reasonable reading of the placeholder. The architect can confirm.

**N-7. The worker report's §7 summary line is wrong; its table is right.**
- The summary line says 4 deletions and 488 changed lines; the per-file table sums to 3.
- The custodian's filing note already flags this.
- The closing record should carry 484 + 3 = 487.

**N-8. The 753dcaf commit message has wrong line cites.** These are commit-message line numbers, not a tracked record (disclosed as deviation 4). The real lines at 753dcaf are `mirrorRound` at :65 and `isCloudSession` at `cloud.mjs:13`.

**N-9. verify-quotes fails only in named-file mode.**
- Run with AUTONOMY.md named, it exits 1 on `AUTONOMY.md:395` and `:399`. The diff does not touch those lines (it only appends from :488).
- The whole-repo run passes.

## Item by item

**1. The diff against §2 and §7.** All of these hold:
- **Dispatch:** `argv[2] === '--hook'` goes to the hook mode; everything else runs `main()` unchanged (`:213-219`).
- **Cloud guard:** it is the first statement of `hookMain`, before stdin is read (`:204`).
- **Order:** parse, then `agent_id` (non-null, non-empty, `:162`), then the lease (`:164`), then validation (`:166`).
- **Project root:** `CLAUDE_PROJECT_DIR`, else `cwd`, else `process.cwd()`, as in `stop-queue.mjs:58-60`.
- **Fields read:** only `session_id`, `agent_id`, `cwd` and `tool_input.questions[].{question, options[].{label, description}}`.
- **Malformed input:** all six §2 item 5 cases are handled, and a `description` of null counts as malformed.
- **Numbering:** `^round-(\d+)\.md$`, `parseInt` base 10, the maximum plus 1, or 1 when none matches. No git call.
- **Rendering:**
  - the header line matches §7 byte for byte, with `1 item`/`<k> items`;
  - item lines are `<i>. <question>`;
  - option lines are `  (<j>) <label>`, plus ` — <description>` only when the description is a non-empty string;
  - separators are `\n\n---\n\n`, with one final `\n`;
  - the red-line test is `/^(?:Item \d+\. )?RED LINE/`, which is Amendment 1's prefix.
- **Write:** `wx`, UTF-8 with no BOM, LF.
- **Send:** `mirrorRound` with its real signature, then one outcome line appended with the keys `at, round, file, mode, ok` in that order and no text or session id.
- **Exit:** a failed send gives a stderr line and exit 0. The whole body is wrapped, `.then` sets `exitCode` 0, and nothing in the module graph writes to stdout outside an entry guard.
- **One-token export:** `stop-queue.mjs` differs by one line (1/1). Importing `stop-queue` and `plan.mjs` has no top-level side effects.
- **Settings:** exactly one PreToolUse entry with matcher, type, command and timeout 20 as §2 item 13 states. No other entry changed.
- **No quotation:** none in the README section, §28 or the new header comment. §28's six bullets match §2 item 15, and the digest's question-set numbering is written without quotation.
- **Stderr lines:** all six are byte-identical to §7 (`:160, :168, :176, :188, :198, :207`).
- **§8:**
  - items 1-6, 8, 9, 11, 12, 14 and 15 hold;
  - item 7 holds: explicit env, no token or chat id, dry-run except S8/S12, every temp dir removed by `t.after`, no ignore, every test carries `RECORDED MUTATION`;
  - item 10 holds;
  - item 13 holds: no overrun and no scope addition;
  - no user-profile path, token or chat id appears in the diff, the fixture or the commit messages.

**2. M1 to M13, re-observed.**
- My script applied each mutation at 948f126, ran the named test by `--test-name-pattern`, restored the file with `git checkout --`, and re-ran the test, which passed each time.
- 948f126's code and settings are identical to 753dcaf's. The test file differs only in its `RECORDED MUTATION` lines.
- Each first failing assertion matched its comment:
  - **M1:** `assert.equal(text, S1_BODY(date))`; the description tails are missing.
  - **M2:** the first `assert.match`; the header reads `RED LINE items: none.`
  - **M3:** `deepEqual(roundFiles)`; `round-11.md` is missing. I used a string-sort maximum, because `Math.max` coerces strings to numbers.
  - **M4:** `countDry(second.stderr)` gives 0 !== 1.
  - **M5:** the first `deepEqual`; stderr carries a dry-run send.
  - **M6:** `deepEqual` on case `lease: null`; stderr carries a send.
  - **M7:** the first `deepEqual`; stderr carries a send.
  - **M8:** `assertQuiet`; status 1, not 0.
  - **M9:** stderr `assert.equal`; a `hook error (Unexpected token 'o', ...)` line where the not-JSON line is expected.
  - **M10:** stderr `assert.equal` on `[]`; a dry-run send of a 0-item round.
  - **M11:** `assertQuiet`; status 1 from the usage path.
  - **M12:** the final `deepEqual`; round 8 reads `ok: true`.
  - **M13:** `lines.length` gives 4 !== 2.
- The tree is clean afterwards (0 porcelain lines).
- I also checked the worker's commit claims from `git archive` copies (only `questions-mirror.test.mjs` run): 5ffee4d gives 17 tests, 4 pass, 13 fail; 753dcaf gives 17 of 17 pass.

**3. Suites.**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` exits 0: 379 tests, 379 pass, 0 fail, 0 skipped.
- The settings-wide cloud test (`each_settings_hook_command_exits_silently_under_the_cloud_marker`) passes with the new command (but see N-4).

**4. T11 on Windows.** It passes, through Git Bash from `git --exec-path`.
- Deviation 1, the six files copied into the temp project (`questions-mirror.test.mjs:301-304`), does **not** weaken T11.
- S11 requires `CLAUDE_PROJECT_DIR` to be the test project, and the settings command resolves the script under that variable. So copying is what S11 itself requires.
  - The only other way is pointing it at the real repository, which §8 forbids.
- The copies are byte copies of the shipped files made at run time, and the command string is read from `.claude/settings.json`, not retyped.
- A missing import fails closed (ERR_MODULE_NOT_FOUND, exit 1); it cannot pass falsely.
- T11 does not prove that Claude Code delivers that payload, which is the form's own E1 limit.

**5. The fixture.**
- `tool_input` is `deepStrictEqual` to the custodian's byte-copy, whose sha256 is fb91cef546225ded1d0ff102d335154cf91dc4041be93c7350f31e06140f21c2. The key order is equal too.
- It carries no profile path, token or chat id (grep returned 1).
- `session_id` is `fixture-session`, `transcript_path` and `cwd` are relative and invented, and `hook_event_name` is `PreToolUse`.
- The envelope is incomplete; see S1-1.

**6. §7 recount.** Its own command over `01b5ba0...948f126` gives 7 files, 484 insertions, 3 deletions, 487 changed lines, against the ≤700 / ≤7 ceiling. Git says 3; the worker's "4" is wrong (N-7).

**7. Branch CI (`gh pr checks 154`, rc 0).** All four checks pass:
- every commit is signed off;
- no profile path in the range. This is the exposure scan's first PR run (run 37003669891, merge ref 7e1f747d of 948f126 into 4d203d4). Its count line reads `profile-path-scan: range read 3 commits, 484 added lines, 1 path names`;
- governance-ci on push and on pull_request, each at 948f126: 379/379 tests and verify:plan PASS.

**8. Verify tools, each exit code captured directly, at 948f126.**

| Tool | Tool commit | Exit | Result |
|---|---|---|---|
| verify-cites | 522e448 | 0 | PASS, 1067 files, 32 loose advisories |
| verify-quotes, whole repo | f9444a4 | 0 | PASS, 113 checked |
| verify-test-claims | 57c626f | 0 | PASS, 463 claims |
| verify-mutation `--base 01b5ba0 --head 948f126` | 7d24ed1 | 0 | PASS |
| verify.mjs (verify:plan) | 2607202 | 0 | PASS |

verify-mutation reports only that each of the 13 new tests has a `RECORDED MUTATION` comment naming it. It is not an observation of any mutation; item 2 is the observation.

## What I ran
- Versions: git 2.49.0.windows.1, node v24.18.1, Windows 10 19045. The `git archive` copies at 5ffee4d and 753dcaf exit 0, with the counts given in item 2.
- The hook ran only through the tests, in `os.tmpdir()` projects, with the tests' explicit environment and my outer runner environment stripped of Telegram variables. No send reached the network.
- No background process is left, and no `round-mirror-hook-*` temp directory remains.
- Disclosures:
  - I ran `git fetch` in `C:/dev/spatial-ide`. That updates refs only; its working tree was not touched.
  - Reading main's `state/questions/round-33.md` was refused by the permission classifier, and I did not pursue it. N-6 is reasoned from the form alone.
  - I wrote `mut.mjs`, `mut.txt`, `suite.txt` and `vc/vq/vt/vm/vp.txt` into the shared scratchpad. Files with those names already existed there, so I may have overwritten earlier ones.
- Paths: `C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.mjs`, `C:/dev/wt/round-mirror-hook/scripts/hooks/questions-mirror.test.mjs`, `C:/dev/wt/round-mirror-hook/scripts/hooks/fixtures/pretooluse-askuserquestion.json`, `C:/dev/wt/round-mirror-hook/AUTONOMY.md`, `C:/dev/wt/round-mirror-hook/scripts/hooks/README.md`.
