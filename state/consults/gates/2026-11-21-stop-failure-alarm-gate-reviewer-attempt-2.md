Reviewed: cut/stop-failure-alarm at 2039dfb1e6e7636a0d405955675b2eeeb66cb7ff (the custodian's filing note, 2026-11-21: the stop alarm's single gate, attempt 2, limited to the one commit after 1d944d84 (ADV-2026-11-21-19 items 1 and 4); Read 12, Bash 14, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-21T13:02:52Z to 2026-11-21T13:09:12Z by its transcript; the report below byte for byte from its hand-back of 10205 bytes, sha256 64cd2a07449a8d6f17ab1cb34796af9d0f003babcaf11c275d05d1a7d2ab477b, with two clock times masked as <t> by the custodian), gate, reviewer
Verdict: PASS, cut/stop-failure-alarm @ 2039dfb1e6e7636a0d405955675b2eeeb66cb7ff. The one commit after 1d944d84 applies the four replacement texts and the advisor's sentence byte for byte where ADV-2026-11-21-19 item 2 puts them. Every clause is true against the code and the approvals, the code files are byte-equal to H1, and the suite at H2 gives 198/198.

Reviewer model: Opus 5.5 (claude-opus-5-5). The scratch files are in `<S>/` and named `sfarev2-*`.

**Preflight** (each command rc=0)
- `rev-parse HEAD` gave 2039dfb1e6e7636a0d405955675b2eeeb66cb7ff.
- The porcelain was empty, at the start and again at the end (0 bytes).
- `ls-remote` gave 2039dfb1e6e7636a0d405955675b2eeeb66cb7ff refs/heads/cut/stop-failure-alarm.
- `log H1..H2` shows one commit, `2039dfb1 1d944d84 docs: the gate's words for the stop alarm, F1, F2, N1 and N2, and the advisor's sentence for N5 (ADV-2026-11-21-19)`. Its parent is H1.
- The ruling copy's sha256 is 71bbc935ea94231ae6c40dffe16e0c517945b47a7a45e2a16920680f355b2661, which matches.
- origin/main is 7196708dbdd7606c1becaa8e3701370934712050. The merge base is 1067f753bd4f4226260575cbd3bbe3ece8fc7180. `diff --stat MB origin/main` over AUTONOMY.md, README.md, settings.json and hooks.test.mjs is empty, so main has not moved on these files.

## Checks

**1. The diff against item 2, word for word.**
- `git diff --numstat H1 H2` shows three files and no other:
  - governance/AUTONOMY.md: 1 added, 1 removed.
  - scripts/hooks/README.md: 5 added, 1 removed.
  - scripts/hooks/hooks.test.mjs: 1 added, 1 removed.
- My script `sfarev2-check1.mjs` (rc=1, from one wrong section bound of mine, re-run as `sfarev2-spans.mjs`, rc=0) worked as follows:
  - It reads the attempt-1 report with `git show origin/main:…` and finds F1, F2, N1 and N2 at its lines 143, 156, 173 and 182, each found once.
  - It takes the `  > ` prefix off each, and the backticks off N2.
  - It takes the advisor's sentence from the only line between the ruling copy's two four-backtick fences (ruling lines 14 and 16).
- All of these came out OK:
  - **README.** H1 and H2 are both LF with a final newline. H1's line 334 is the one line beginning `Added by the human's approval of ADV-2026-11-18-06`. H2 equals H1 with three changes: line 334 replaced by N1; then `""`, F1, `""` and the advisor's sentence appended. Lines 335–339 of that paragraph are identical at H1 and H2, so nothing was reflowed. F1 and the advisor's sentence are the file's last two paragraphs, each its own paragraph.
  - **AUTONOMY.** H2 equals H1 with only line 743, the (xii) bullet, replaced whole by F2. No line of Part A (715–725) or Part B (727–736) changed.
  - **hooks.test.mjs.** H2 equals H1 with only line 1431 replaced by N2. N2 is still one `// ` line. The test line `test('the_notification_hook_matches_only_the_two_quota_types', …` is unchanged. No other line changed, so the assertions are unchanged (H2 :1434 and :1437).

**2. Each clause against the code and the approvals.** Approval = the approval of ADV-2026-11-18-06 on main. ADV-25 = ADV-2026-11-18-25 in the 2026-11-21 approval file.
- **N1** (README:334):
  - "Added 2026-11-18": the approval is the human's message of 2026-11-18 at 20:27Z (approval line 1). The settings commit 321719cd is <t>, which is 2026-11-18T23:24:53Z. True.
  - "by the human's approval of ADV-2026-11-18-06 (items 1 to 3": approval lines 17, 19 and 21 are what the section describes. True.
  - The directive path: `git cat-file -e` gave rc=0 on origin/main and at H2. True.
  - "`AUTONOMY.md` §38 Part C": AUTONOMY:738 at H2. True.
- **N2** (hooks.test.mjs:1431):
  - "the human's approval of ADV-2026-11-18-25": the approval file's lines 10 and 52–56.
  - "the hook keys gain StopFailure": :1434. "the matcher gains quota_auto_resume_fired": :1437. "though three quota types now match": settings.json:80.
  - "the name stays": :1432 is unchanged.
  - "because an earlier form claims this test by name": `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md:131` on origin/main, row T6, names the test.
  - This meets ADV-25 item 1, which asks for one comment line saying the name stays. True.
- **F1** (README:348):
  - "The same approval (item 3) adds `quota_auto_resume_fired`…": approval line 21. "it is now `…stale|…disabled|…fired`, three quota types": settings.json:80.
  - "The **Matcher** paragraph … which names two": README:195–196 at H2.
  - "it is not edited": `diff -U0 MB H2 -- README.md` is one hunk, `@@ -330,0 +331,20`, a pure append.
  - "Nor is the header comment of `notify-telegram.mjs`, which also names two": notify-telegram.mjs:12–13. `git diff --quiet MB H2 -- notify-telegram.mjs telegram.mjs cloud.mjs` gave rc=0.
  - "this piece changes no existing hook script (ADV-2026-11-18-22 item 3)":
    - `numstat MB H2` lists 7 files. The only existing files under scripts/hooks are README.md and hooks.test.mjs. The test is allowed by ADV-25 item 2 and Amendment 1 item 3, and it is a test, not a script.
    - ADV-22 item 3 (its line 19) blocks "a change to `telegram.mjs` or to any existing hook script or test".
  - True. F1 also states N4 in the tree, which check 5 asks for.
- **F2** (AUTONOMY:743):
  - "The `Notification` entry's matcher is `…`": settings.json:80.
  - "so the human also hears when the app goes on by itself after a reset (approval item 3)": approval line 21 in the human's approved words. The type is a documented matcher value (AUTONOMY:449, the reference table). notify-telegram.mjs:12–14 forwards whatever the matcher lets through. True as far as the approval goes. That the app raises the type was not exercised here, and this clause is unchanged from H1's (xii).
  - The two quoted spans are substrings of §38 at H2, outside (xii) (`sfarev2-spans.txt`, §38 = lines 713–745):
    - "the two quota notification types and no other type" at :732 ((iv)).
    - "Nothing else is sent" at :735 ((vii)).
  - "neither line is edited": `diff -U0 MB H2 -- AUTONOMY.md` is one hunk, `@@ -736,0 +737,8`, a pure append.
  - "excepts the StopFailure message of (x)": after the merge, the only things sent are (iv) read as three types, (v), (vi) (not yet sent) and (x). The exception is complete. True.
- **The advisor's sentence** (README:350), "If the hook's input holds no `error` field, the message carries the word `unknown` where the error type stands.":
  - The code: notify-stop-failure.mjs:25 is `${input.error ?? 'unknown'}` in the error-type slot. :30 puts the same value in the dedupe key. :51–52 turn empty stdin or JSON `null` into `{}`.
  - Called directly (`sfarev2-noerror.txt`, rc=0; nothing sent, no child process run):
    - `{cwd}` gives "Session stopped on an error: unknown (proj)".
    - `[]` gives "… unknown (…)".
    - `{error:null}` gives "… unknown (proj)".
    - `{error:''}` gives "Session stopped on an error:  (proj)".
  - True. It says less than the code in three ways:
    - The code also writes `unknown` when the field is present but `null`.
    - The dedupe key `stop-failure:unknown` is not mentioned.
    - An empty-string `error`, a field that is present, gives no word.
  - Cases with no message at all, which the sentence presupposes away: stdin that does not parse (:53–55), a cloud session (:68), a repeat inside the window, and a non-string `cwd`. `buildMessage({cwd:5})` throws ERR_INVALID_ARG_TYPE inside the try at :59–63, and nothing is sent. Only malformed hook input from the app can reach the last case, not ordinary use, so it does not block. I name it here for the source comment.

**3. Byte-equal to H1.**
- `git diff --quiet H1 H2 -- .claude/settings.json scripts/hooks/notify-stop-failure.mjs scripts/hooks/notify-stop-failure.test.mjs scripts/hooks/fixtures/stop-failure-input.json scripts/hooks/notify-telegram.mjs` gave exit code 0.

**4. The suite's record (item 3).**
- `sfaw-suite.rc` (80 B, <t>) holds three lines: `2039dfb1e6e7636a0d405955675b2eeeb66cb7ff`, `node --test scripts/hooks/*.test.mjs` and `0`.
- `sfaw-suite.txt` (17720 B) ends with: tests 198, suites 0, pass 198, fail 0, cancelled 0, skipped 0, todo 0.
- It has 0 `✖` lines (grep count 0).
- It holds `✔ the_notification_hook_matches_only_the_two_quota_types` (:143) and the five `stop-failure:` tests (:153–157).
- The counts are as at H1. The file's time is after the commit (12:59Z). The run is reused, not re-run: the head, command and exit code are recorded, and no file the tests read changed between H1 and H2 (check 3).

**5. Attempt 1's other findings.**
- N3 is closed by `sfaw-suite.rc`, which records the head, the command and the exit code.
- N4 stays as it is (ruling item 5):
  - notify-telegram.mjs is unchanged against H1 (check 3) and against the merge base (rc=0, check 2).
  - Its :12–13 still read "the two quota types only".
  - F1's paragraph (README:348) says its header comment "also names two" and is not edited.
- N5 is closed by the advisor's sentence (check 2).

## Findings

### Correctness
None.

### Evidence
None.

### Documentation (must-fix before the merge)
- **N1. `governance/forms/scripts/STOP-FAILURE-ALARM-PREREGISTRATION.md` (origin/main, after Amendment 3): two records ADV-2026-11-21-19 orders are not yet on the form.**
  - Ruling item 2 (N2) has the form record the second commit on `scripts/hooks/hooks.test.mjs` as a class 1 departure, with its cause, because Amendment 1 item 3 named one commit. 2039dfb1 is that second commit.
  - Ruling item 3 has the head run (`sfaw-suite.*`) go in the closing amendment (Amendment 1 item 4).
  - Neither is in this diff, and neither is in scope for the commit under review. They belong to the custodian's next amendment, before the merge request.

### Not blocking (for the record)
- **N2. `scripts/hooks/README.md:350`, the advisor's sentence.** It is true, and it says less than the code: `notify-stop-failure.mjs:25` also writes `unknown` for `error: null`, and :30 puts `unknown` in the dedupe key. No change is needed. The non-string `cwd` case (no message sent) needs malformed app input to reach, so I name it here and do not block on it. This is the advisor's wording, not the human's.