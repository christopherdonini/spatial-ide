Reviewed: PR #323 at bb341a7294846b19bef3085b7acccd3a44a52b4a (the custodian's filing note, 2026-11-15: the gate, the reviewer, at C, the second part of its gate (ADV-2026-11-15-05 item 8 (b); `state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-05-323-the-reviewers-line-21-the-architects-halt-comment-t7-record-section-38-three-sentences-one-correction-commit.md`), its first part `state/consults/gates/2026-11-15-advisor-questions-and-telegram-three-alarms-gate-reviewer.md`, together the gate's attempt 1, gate-log row 758, which stands, with no new row, since item 8 asks for no new attempt and no new verdict; under the form `governance/forms/scripts/ADVISOR-QUESTIONS-AND-TELEGRAM-THREE-ALARMS-PREREGISTRATION.md`, its section 9 and Amendment 1, PLAN node advisor-questions-and-telegram-three-alarms, the docs lane; its message sent at 2026-11-15T03:27:53Z by the custodian's transcript to the same run, whose resumed prompt at 2026-11-15T03:27:54Z holds it byte for byte (4348 bytes, sha256 2055ef08ebfef759933bf94ebb747f193e598741fc9fc4781b9f673a35b5b4e2); this part 2026-11-15T03:27:54Z to 2026-11-15T03:30:32Z by its transcript, 15 calls (Bash 10, Read 4, SubagentHandback 1), none errored by the transcript, no file written outside the scratch folder, model claude-opus-5-5; the custodian's message asked it to write one script with the Write tool, which a reviewer does not have (its tools are Read, Grep, Glob and Bash): the custodian's brief error, not the reviewer's; it ran each check as its own command instead, and names two first attempts it replaced (a grep count and a TypeError), each in its report; below, the hand-back byte for byte (8827 bytes, sha256 95f2cc7980b63e3aae80f914e63b588c21140e4672e4e4136a98fee21018bf84), with this note in its first line. Nothing else is changed.), gate reviewer at C, the second part of its gate
Verdict: PASS WITH NOTES

C is correct, and the first part's verdict still stands, now covering both parts. The note stays WORDS-ONLY. My one blocking finding, C-1, is closed: line 21 of `scripts/hooks/notify-telegram.mjs` at C is now the replacement line I gave, which the ruling adopts as item 1, byte for byte. Nothing I found in this part changes the verdict.

**One departure from the brief: I have no Write tool.** My toolset is Read, Grep, Glob, Bash and SubagentHandback. So I could not write one script file. Each check below is a separate `node -e` or git command run in Bash. Each wrote its output to `<S>/g323r2-*` and printed its exit code straight after. Nothing was written by a heredoc or a redirect except a command's own output.

## Start
- `git -C C:/dev/wt/nta fetch -q origin`: rc 0.
- HEAD: `bb341a7294846b19bef3085b7acccd3a44a52b4a`; its parent is `917f66c86cab91597947dc1b7ba699fdf4e4d435`.
- Porcelain: rc 0, 0 bytes.
- `ls-remote`: rc 0, `bb341a7294846b19bef3085b7acccd3a44a52b4a	refs/heads/cut/advisor-questions-and-telegram-three-alarms`.
- File checks, every one matching:
  - `<S>/adv-2026-11-15-05.copy.md`: 9869 bytes, sha256 e026e3a5e20371c942b111ef6433dd1b0f5ff4a904b52c04e96989645fa636d1.
  - `<S>/c323-diff.patch`: 5539 bytes, 4c911aa434666df1b44e8d2a5f43b58544995250c6e478be79d6d3aca2372c97.
  - `<S>/rep-c323.md`: 2604 bytes, f14721d390c052cf128d4aa6dae0c3fe5cef70856133f16462cb2593235b06b5.
  - `<S>/s38-nta-v2.md`: 4498 bytes, bbb5a3c0512141fbc151a22214e0c6b743322f86dd152e35782443eeab0a4c6d.
  - `<S>/s38-nta.md`: 4377 bytes, fa5aaa81e820fa6a74e9e5408442b15c38904f4be895aba3a8f613a1bc15d759.
- I read the ruling, the custodian's diff and the worker's report whole.
- origin/main is now 3f3330c51e76c4a077abe2e855c7ef5ed1ba8a77. The form there is 35128 bytes, 247 lines, sha256 7e837eff2edbd367f47af3ec416d69470a1aa0f6bde64b8a99c59704e7cadfd5. I read Amendment 1, the form's last section, whole.

## Check 1: the extent of C
- `git diff --numstat 917f66c8 C`: rc 0:
  - `3	3	governance/AUTONOMY.md`
  - `1	1	scripts/hooks/notify-telegram.mjs`
  - `1	1	scripts/hooks/stop-queue.mjs`
- `git diff --name-only`: rc 0, the same three paths and no others.
- `git diff 917f66c8 C`: rc 0, 5539 bytes, sha256 4c911aa434666df1b44e8d2a5f43b58544995250c6e478be79d6d3aca2372c97. That equals the custodian's patch.
- `git diff -U0`: rc 0, four hunks:
  - `@@ -732,2 +732,2 @@`
  - `@@ -735 +735 @@`
  - `@@ -21 +21 @@`
  - `@@ -167 +167 @@`
- Counted by awk with the `---`/`+++` file headers excluded: `removed=5 added=5`. The pairs are AUTONOMY (iv), (v) and (vii), notify-telegram line 21, and stop-queue line 167.
- My first, grep-based count read `removed=2`. That pattern wrongly excluded removed lines that begin `--`, such as `-- **(iv)`; the awk count replaced it.
- Line counts at 917f66c8 and at C are unchanged: AUTONOMY.md 736/736, notify-telegram.mjs 79/79, stop-queue.mjs 405/405.

## Check 2: the two comment lines
A `node -e` command read the ruling copy and both commits through `git show`: rc 0. Its output lines:
```
OK   item 1 fence = notify-telegram.mjs:21 at C
OK   item 1 fence line occurs once at C
OK   item 1 (a) span = notify-telegram.mjs:21 at 917f66c8
OK   item 1 (a) span absent at C
OK   item 2 fence = stop-queue.mjs:167 at C
OK   item 2 fence line occurs once at C
OK   item 2 span = stop-queue.mjs:167 at 917f66c8
OK   item 2 span absent at C
ruling lines: fence1 13, fence2 23
```
- The command first checks that each fence holds exactly one line.
- It takes each removed span from the single "The line `…`" match within its item.
- My first attempt exited 1 with a TypeError: my span lookup expected item 2's "The line" on a separate line. It ran no comparison. The corrected command above is the result.

## Check 3: the section file
- (a) C3 was taken from line 199 of the form on origin/main by `sed`. That line is `cmp`-identical to the one I ran in the first part. Only its placeholder was replaced with the full path of `<S>/s38-nta-v2.md`.
  - The merge base of origin/main and HEAD is still `bd5bcd09da885661266b3b7b46b707b3b46cb5fc`.
  - Run: rc 0, `S38-OK`.
- (b) and (c) A `node -e` command over the two section files and the ruling copy: rc 0.
```
lines v1=25 v2=25 (split on LF; last element empty when the file ends with LF: v1 true, v2 true)
differing lines (1-based): 20,21,23
OK   exactly three, starting (iv), (v), (vii) in that order
OK   - **(iv) v2 line = item 6 fence line (fence lines starting so: 1)
OK   - **(v) v2 line = item 6 fence line (fence lines starting so: 1)
OK   - **(vii) v2 line = item 6 fence line (fence lines starting so: 1)
```
  - Both files have 24 lines, each ending in LF (`wc -l` 24 and 24).

## Check 4: CI at C
Read at 2026-11-15T03:29:40Z (`date -u`). `gh run list --commit bb341a7294846b19bef3085b7acccd3a44a52b4a --json name,status,conclusion,event,headSha`: rc 0. Six runs, every one with headSha bb341a72…, completed, success:

| Run | Event |
|---|---|
| Ported notices | pull_request |
| Exposure scan | pull_request |
| DCO sign-off | pull_request |
| Governance CI — plan, queue, site | pull_request |
| Ported notices | push |
| Governance CI — plan, queue, site | push |

## The three changed sentences of §38 Part B, read against the code at C
C changes only comments, so the code lines below are the same as at 917f66c8. I located them at C by `git show C:<file> | grep -n`.

1. **(iv), last sentence:** "A repeat with the same type and the same first 80 characters of its message, within ten minutes and under the same project root, is not sent." It is true.
   - Type plus head: the key is `notification:${input.notification_type}:${head}` (`scripts/hooks/notify-telegram.mjs:39`), where head is `String(input.message ?? '').slice(0, DEDUPE_HEAD_LENGTH)` (:38) and `DEDUPE_HEAD_LENGTH = 80` (:28).
   - Ten minutes: no `windowMs` is passed (:68), so `DEDUPE_WINDOW_MS = 10 * 60 * 1000` applies (`scripts/hooks/telegram.mjs:36`). The suppression test is `now - last < windowMs` (:259).
   - Same project root: the record is `path.join(projectRoot, '.claude', 'state', 'telegram-sent.json')` (`telegram.mjs:230`). The root is `process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd()` (`notify-telegram.mjs:43`), passed at :68.

2. **(v), last sentence:** "A repeat of the same text, within ten minutes and under the same project root, is not sent." It is true.
   - Same text: the halt branch (`scripts/hooks/stop-queue.mjs:286-292`) calls `notify(projectRoot, \`HALT: …\`)` at :289, and the default is `notifyHalt` (:273). That function sends with the key `halt:${text}` and `windowMs: TELEGRAM_DEDUPE_WINDOW_MS` (:170). That constant is 600000 ms (:56, untouched by C).
   - Same project root: the root comes from `resolveProjectRoot` (:68-69, used at :385), and the state file is under that root (`telegram.mjs:230`).

3. **(vii), first sentence:** "The Stop hook sends no waiting-list message: when no halt is found and only human-blocked nodes remain, it sends nothing." It is true.
   - The only send in `stop-queue.mjs` is `sendTelegramDeduped` inside `notifyHalt` (:170). Its only caller is `notify` at :289, inside `if (halt.halted)` (:286).
   - Every path after the halt branch returns without a send: :298, :310-311, :320, :329, :331, :339 (step 6, only human-blocked nodes remain), :344 and :361.
   - The only text this hook sends is the HALT headline. No code builds a list.

No clause is untrue, so nothing goes to the advisor under item 8 (c).

## Findings
- **Correctness:** none in this part. C-1 from the first part is closed by C, through item 1's line (check 2).
- **Evidence:** none.
- **Documentation:** none.
- **Observation (not a finding):** Amendment 1 item 4 says, in the custodian's words, that when the dedupe write fails "no key is recorded, so a repeat within the window is sent". That agrees with `telegram.mjs:264` and its catch.

## Calls in this part, by tool
- **Read: 4.** The ruling copy, `c323-diff.patch`, `rep-c323.md`, and the form extract `<S>/g323r2-form.md`.
- **Bash: 10.**
  - the fetch, start state and hashes;
  - the form extract and Amendment search;
  - the extent (numstat, names, diff, -U0, line counts);
  - the awk pair count;
  - the comment check, first attempt (rc 1, TypeError, no comparison made);
  - the comment check (rc 0);
  - C3;
  - the section-file comparison;
  - CI;
  - the code lines at C.
- **Grep: 0. Glob: 0. Write: none available.**

No repository file was edited. Nothing was checked out, reset, stashed, committed or pushed, and there was no PR action. I started no background shell in this part, and none is left running.

Model: Claude Opus 5.5 (claude-opus-5-5), as the harness reports it.
