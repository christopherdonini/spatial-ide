*Custodian's filing note (2026-10-05): the architect's draft of `guardian-v1`'s Amendment 6, on the custodian's brief after the build worker's report 1 (Amendment 5). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is fa99a436b22e388e61a0de161bfb3e8424fa6e468c274d1788a6231377131ce1. Write audit PASS: zero write calls (Read 11, Grep 3, SubagentHandback 1). Run window from the transcript: 2026-10-05T19:30:09.835Z to 2026-10-05T19:37:42.195Z (142,076 subagent tokens, 15 tool uses, 452,378 ms, from the harness's task notification). The amendment as appended is part 1's block with its pin hashes computed at 2d4fa886 and nothing else changed. Part C's hold was cleared by the human before this filing (the ledger, the switch-cleared entry).*

---

Reviewed: main @ 2d4fa886

Amendment 6 is drafted below. I recommend option (b): F7 and T7 stay as they are, and nothing in it needs a ruling. One thing still waits on the human: the `claude plugin test` blocker (Part C). The test-kit `arm` default is a helper change that I9 permits (Part B). One small correction of Amendment 5, item 6 is in Part D, which is why the amendment ends with a superseded index.

1. The amendment

````markdown
### Amendment 6 — I9: a push whose own segment leaves a quote open stays refused; the test kit's env answer; the plugin-test hold; size (Parts A to F: class 1)

*Written after the build worker's outcomes were seen (Amendment 5) and before any committed code. Nothing is committed on `cut/guardian-v1`. The architect agent drafted this at main 2d4fa886. Nothing below is a quotation. Code is cited `path:line @ 2d4fa886 sha256:<hex>`. The worker's report, `state/consults/2026-10-05-guardian-v1-worker-report-1.md`, and the P0 report, `state/consults/2026-10-05-guardian-v1-p0-report.md`, are cited by section. Read Part F's superseded index first, then Amendment 4's (Part E), then Amendment 2's (Part K).*

**Part A — post-result (class 1): I9, F7 and T7 against §2.2.**

A.1 **§2.2's change, amended.** v0's condition must still hold for the unbalanced-quote refusal (`tools/mods/spatial-guardian/hooks/register.js:215-218 @ 2d4fa886 sha256:HASH-TBD`). The refusal now stands when, in addition, either of these holds:
- **(i)** the call's words hold the G1 sequence. This is §2.2 as drafted, with Amendment 2, Part I's reading;
- **(ii)** the segment's own push comes before its open quote. The segment's text before its open quote, tokenised, holds a token that `isGit` accepts (`tools/mods/spatial-guardian/hooks/register.js:157-160 @ 2d4fa886 sha256:HASH-TBD`), then git's global options skipped as `segmentPushRefused` skips them (`tools/mods/spatial-guardian/hooks/register.js:196-208 @ 2d4fa886 sha256:HASH-TBD`), then the token `push`.
- **The open quote** is the quote character at which the tokeniser's final unclosed quote state began, in that segment. `tokenise` (`tools/mods/spatial-guardian/hooks/register.js:104-155 @ 2d4fa886 sha256:HASH-TBD`) also returns that index. Its tokens and its `unbalanced` flag do not change.
- **What (ii) reads:** only the segment it is applied to, in each reading. It applies at top level and inside a rescanned quoted token alike.
- **No argument test in (ii):** a push whose own arguments run into text the tokeniser cannot read is refused, whatever they hold. That keeps the purpose of v0 §2.2's unbalanced bullet, but only for the shape where the unreadable text is the push's own arguments.
- **Only G1 reads (ii).** G7 to G9 keep Amendment 2, A.2.

A.2 **Newly allowed, amended.** A call is newly allowed only when v0 refuses it through the unbalanced-quote rule alone, its words hold no G1 sequence, and (ii) does not hold.
- N1 and N3 are unchanged.
- N2 becomes: a git … `push` with no forcing word after it, where the push is not before the open quote in its own segment. Either the open quote begins before the push (#1; F37's N2 row), or the push lies in an earlier segment (F63).
- **Still refused, added to §2.2's list:** a push whose segment leaves a quote open after the push (F7, F62).
- **The refusal set stays a subset of v0's.** (ii) adds a disjunct only inside v0's condition, and a `push` token means the text holds `push`.
- **§2.2's argument that no force or delete spelling can run through a newly allowed shape is unchanged.** This Part only takes shapes out of the draft's newly allowed set.

A.3 **Against the recorded shapes,** by reading. The replay (A.6) checks it.
- **#1:** P0 §6 copies it whole. Its open quote is on line 2, inside the heredoc, and that line's text before it holds no git token. Passes.
- **#3:** P0 §6's table puts its final open quote on line 8 and the command's first `push` on line 9. Nothing before the open quote holds `push`. Passes.
- **#2, #4, #5 and #6:** the final open quote comes after the first `push`. That `push` sits inside a longer word (P0 §6's byte-copied lines), and P0 §6 classes each call as holding no git command. For (ii) to hold, `push` would have to stand as its own token after a git token, with only options between. Predicted to pass.
- **F37:** in N1, the text before the open quote tokenises to `//` and one quoted-joined token, with no git token. In N2 and N3, the open quote comes before any git or `push`. All three pass.
- **F7, `git push "origin`:** the text before the open quote is `git push `, so (ii) holds and F7 is refused. T7 (`tools/mods/spatial-guardian/test/guardian.test.ts:176-182 @ 2d4fa886 sha256:HASH-TBD`) passes unchanged, so I9 is resolved with no waiver.
- The worker's structural note (report section 3) is exactly the line (ii) draws: where the open quote sits relative to the push.

A.4 **Within the brief, not the human's.**
- Brief §2.1 (pinned in §2.2) requires that the two named shapes pass (#1 and #3). It forbids allowing anything v0 refuses for a force or delete spelling, and it asks the form to name the newly allowed shapes exactly. It does not require F7 to pass.
- Part A narrows only the draft's newly allowed set, and touches no ruling: rounds 57 and 58 cover G7 to G9 only.
- No v0 assertion changes. Class 1, as Amendment 2, Part I's narrowing was.
- **Over-refusal kept (README R-b):** a push whose own segment later holds an odd quote that the shell does not read as a quote, such as a trailing `# don't` comment or `$'…'` text. Workaround: run the push as its own call.

A.5 **Options weighed.**
- **(a) Keep §2.2; F7 joins N2.**
  - T7's assertion changes, which needs the human's I9 waiver, a red line.
  - It also changes §1, may-claim 1, and §4's T44 fixture list (F1–F7).
  - It drops v0's fail-closed rule for a push whose arguments cannot be read.
  - My reading, not tested: bash rejects an unterminated quote before running anything, so F7 itself is harmless.
  - Not recommended.
- **(b) Part A.** Recommended.
- **(c) A positional test across segments:** refuse when a git … `push` anywhere before the open quote. That refuses a push followed by a heredoc commit message in the same call (F63), which is the over-refusal the brief removes. Rejected; it is T72's mutation.
- **(d) (b) plus an exception after a `#` token:** more code for a rarer over-refusal. Not taken.

A.6 **P0d: the resumed build's second step, read-only, before any code.**
- **What runs it:** Node, over the scratch rules with (ii) added, outside the repository. It runs no command.
- **(a)** F36's six commands, raw and redacted. Predicted: all pass.
- **(b)** G1's part of P0b (iv)(b), over the same extracted calls. Predicted: 48 refused in all and 40 since 2026-09-27 (Amendment 3, item 2), with no row newly refused.
- **(c)** F62 and F63, as §3 predicts.
- **Record:** the worker's report, cited by section in the closing record.
- **Stops:**
  - #1 or #3 refused is I7;
  - #2, #4, #5 or #6 refused is I14;
  - a main-loop row newly refused is I8;
  - any other newly refused row is class 2, and its shape joins R-b.
- Nothing from P0d is an observation.

A.7 **Fixtures and tests.**
- **F62** (no engine answers), refused, G1:
  - `git -C x push origin "main`;
  - `bash -c "git push 'origin"`;
  - `(git push "origin`;
  - PowerShell `git push "origin`.
- **F63** (no engine answers), `next(e)`:
  - `git push -q origin main && git commit -F - <<'EOF'` / `it's the push note` / `EOF`;
  - `git push -q origin main; cat >> l.md <<'EOF'` / `the custodian's push ran` / `EOF`.
- **T71** `G1 still refuses a push whose own segment leaves a quote open after it, in either reading and inside a quoted command string`. Fixture F62. Mutation: (ii)'s push head read without git's global options skipped.
- **T72** `G1 allows a push in an earlier segment than an odd quote`. Fixture F63. Mutation: (ii) reads the call's text before the open quote across segments (option (c)).
- **T7** is unchanged. Its v0 comment stays, and a v1 observation line is appended beneath it (§4).

A.8 **§8 item 28:**
- (ii) reading anything but its own segment's text before the open quote;
- (ii) with an argument test;
- (ii) read by G7, G8 or G9;
- a change to `tokenise`'s tokens or `unbalanced` flag;
- T7's name, command or assertion edited.

**Part B — the test kit's `arm` helper, declared before code (report section 5).**
- **Permitted under I9.** I9 covers v0 assertions (T1–T41). `arm` (`tools/mods/spatial-guardian/test/guardian.test.ts:49-96 @ 2d4fa886 sha256:HASH-TBD`) holds no assertion. The v0 module makes no env read (§0.2 item 5; P0 §5's baseline), so a default answer changes no v0 test's outcome against v0 code.
- **The change:**
  - `World` (`tools/mods/spatial-guardian/test/guardian.test.ts:29-40 @ 2d4fa886 sha256:HASH-TBD`) gains an optional `env`: either a map from name to value, or a rejection.
  - `arm` registers `env.get` exactly once, in the shape P0b (i) records (Amendment 1, item 1). It answers from `world.env` when one is given. Otherwise `USERPROFILE` answers `C:\u` (§3's preamble) and every other name is unset.
  - F46 (b) sets `env` to a rejection.
- The header comment (`tools/mods/spatial-guardian/test/guardian.test.ts:3-5 @ 2d4fa886 sha256:HASH-TBD`) gains one sentence saying that `env.get` is answered by default.
- **No other change:** no v0 `expect`, fixture string or test name.
- **§8 item 29:**
  - `arm` answering by default any event other than `env.get`;
  - `world.env` not replacing the default;
  - any v0 test body changed other than appended RECORDED MUTATION lines.

**Part C — the plugin-test hold (Amendment 5, item 4).**
- **What the form requires of `claude plugin test`:**
  - §1's may-claims are made under it, at 2.1.289;
  - §4: every new and v0 mutation is observed by running it, and recorded with its commit and `claude --version`;
  - §9: the reviewer runs it at the gated head, and observes every mutation there;
  - the PR body carries its output with the version.
- **Nothing substitutes for it.** A Node stand-in run is rehearsal, not an observation (Amendment 5, item 5). So no test has evidence of record, and no gate can be held, until it runs.
- **The build resumes only once the human has cleared the hold.** No agent takes any step to clear it (Red line; §8 item 9).
- **The resumed build's first step:** `claude --version`, then `claude plugin test tools/mods/spatial-guardian` on the unchanged base.
  - Predicted: v0's 39 tests pass (P0 §1).
  - A build other than 2.1.289 fires I2.
  - The same refusal message again is **I15**: STOP, nothing written.

**Part D — size.**
- **Correction:** Amendment 5, item 6 sets the draft file's length against an estimate of changed lines. The corrected reference is §7's counting command, which the report's section 5 measures on the draft by `git diff --numstat` against ccac14d2. Proof: that bullet of the report's section 5.
- **Measure:** the draft's register.js changed lines, read from that bullet, are over Amendment 4, Part E's figure for the file.
- **New estimate:** register.js about 780, tests about 1060 (Parts A and B add F62, F63, T71, T72 and the default), README about 160. That is about 2000 lines in all, over the 1300 ceiling.
- §7's size line stands, unedited. An overrun at the gated head is class 8 (round 25, item 2 (a)).

**Part E — record lines amended by reference.**
- **§1, may claim, item 1:** adds that G1 refuses F62 and passes F63.
- **§1, may not claim:** unchanged.
- **§2.2:** "The change" → A.1. "Newly allowed, exactly" and N2 → A.2. "What stays refused" adds A.2's bullet. "Checked before code" → A.6.
- **§3:** the preamble's env answer is Part B. F62 and F63 are new.
- **§4:** T71 and T72 are new. T42's mutation reads as (i) and (ii) both dropped, which restores v0's rule.
- **§5:**
  - T1–T34 and T37–T72 pass.
  - A.6's predictions are added.
  - The `validate` prediction stands, since no call or env name is added.
  - New invalidators:
    - **I14:** P0d refuses #2, #4, #5 or #6.
    - **I15:** `claude plugin test` refuses to run at the build of record.
- **§8:** items 28 and 29 are new. Item 3 reads §2.2 as A.1 amends it.
- **§9:**
  - Dispatch: after this amendment's commit and the human's clearing of Part C's hold. The worker runs Part C's step, then A.6, then the build.
  - The architect adds: A.1 to A.4, read against the code.
  - The reviewer adds: F62 and F63, and Part B's diff, which must leave every v0 test body untouched.

**Superseded index (read this amendment first).**
- §2.2's change bullet, its N2 and its newly-allowed set → A.1 and A.2.
- §2.2's checked-before-code list → A.6.
- §3's preamble (the env answer) → Part B.
- §1's may-claim 1 → Part E.
- §9's dispatch order → Parts C and E.
- Amendment 5, item 6's measure → Part D.
- §7's estimate (as amended by Amendment 4, Part E) → Part D. The size line is not edited.
````

2. OPEN items for the human

- **None needs a ruling.** Part A (option b) is within the brief and changes no v0 assertion, so I9 needs no waiver.
- **If the human prefers option (a) anyway:** that is his typed I9 waiver, a red line, and Part A would be replaced by an amendment re-declaring T7 and §4's T44 fixture list. I recommend against it, because it drops v0's fail-closed rule for a push whose arguments cannot be read.
- **The plugin-test switch (Part C).** This is a hold, not a design choice, and it is the human's own act, since an agent may not start a `claude` session (Red line; §8 item 9).
  - **Waiting on it:** every `claude plugin test` run, every mutation observation, both gates and the merge.
  - **Build risk:** if clearing it moves the engine off 2.1.289, I2 fires at the resumed first step, and the piece needs an amendment that moves the build of record.
  - **Live-Guardian risk:** the worker flagged (report section 4) that new sessions may not load Guardian while the switch is off. Amendment 5, item 4 records that this is not known.

3. Files read
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V1-PREREGISTRATION.md (whole, Amendments 1 to 5)
- C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-worker-report-1.md
- C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-p0-report.md (section 6)
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V0-PREREGISTRATION.md (§2.2, §3 F7, §4 T7, Amendment 8's unplanned refusals)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\register.js (lines 40-239)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\test\guardian.test.ts (lines 1-200, and the `arm` call sites)
- C:\dev\spatial-ide\state\directives\MODS-V1-2026-10-05.md (lines 1-35, §2.1)

All 9 `sha256:HASH-TBD` placeholders are for the custodian to compute at 2d4fa886. The architect made no write-capable call.
