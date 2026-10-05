*Custodian's filing note (2026-10-05): the architect's draft of `guardian-v1`'s Amendment 2, on the custodian's brief after P0b (Amendment 1, I8 fired). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added and 2 user-profile path prefixes in its part 3 (files read) written as `<session scratchpad>` and `<session folder>` at filing. The hand-back's sha256 as received is 540d0d604d68c2964b0d15f4993293997e854bb3aca17d87dbb16e2bbe7d47e4; this file's sha256 from line 5 to the end is ae055266f409e9ee8c3d4ddaf3a20f4649bc384b604de9f3ce31eb747ac0a03a. Write audit PASS: zero write calls (Read 15, Grep 20, Glob 1, SubagentHandback 1). Run window from the transcript: 2026-10-05T17:16:46.151Z to 2026-10-05T17:39:36.203Z. The harness marked the hand-back as matching an instruction-shaped pattern (settings-json); it is G8's subject, not an instruction. The amendment as appended is part 1's block with its pin hashes computed at 3c802bcc and nothing else changed.*

---

Reviewed: main @ 3c802bcc
(This is a drafting run, so there is no gate verdict. I made no write-capable call.)

## 1. The amendment

````markdown
### Amendment 2 — I8's redesign of how G7, G8 and G9 read a call that cannot be tokenised; round 57's rulings; Fable's round-57 advice; the CLI spellings; N2 (Parts A to K: classes 1, 2, 5 and 9)

*Written after P0b's outcomes were seen and before any code. No code or branch exists. P0b is Amendment 1, `state/consults/2026-10-05-guardian-v1-p0b-report.md`, cited by section. The architect agent drafted this at main 3c802bcc. Nothing below is a quotation. Code is cited `path:line @ 3c802bcc sha256:<hex>`. Read Part K's superseded index first.*

**Part A — post-result (class 1): I8, and how G7, G8 and G9 read a call that cannot be tokenised.**

A.1 **What fired.**
- P0b (iv)(b) and its Findings, item 1: since 2026-09-27, G7, G8 and G9 refuse 19, 9 and 4 calls.
- 16, 8 and 3 of these are refused only through §2.3's unbalanced bullet, which reads the rule's words in order anywhere in the call, with any words between. They include:
  - the custodian's `gh pr create`, `view` and `checks` calls that have the word `merge` later in their text;
  - ledger writes that name a rebase.
- **Cause.** An odd quote leaves the splitter's quote state open to the end of the command (`tools/mods/spatial-guardian/hooks/register.js:54-100 @ 3c802bcc sha256:HASH-TBD`). So every later segment is unbalanced, and the drafted sequence reads record text as if it were command text. This is the same state as G1's unbalanced-quote rule (`tools/mods/spatial-guardian/hooks/register.js:215-218 @ 3c802bcc sha256:HASH-TBD`).

A.2 **The change.** It touches only §2.3's unbalanced bullet, and only for G7, G8 and G9. G1 keeps §2.2 exactly.
- **When a segment cannot be tokenised** (at top level or in a rescanned token), the rule refuses only when both of these hold:
  1. the call's words, read as §2.2 reads them, hold the rule's sequence: §2.4 to §2.6 as drafted, plus Parts D, F and H. This is the drafted condition, kept;
  2. a **restart** refuses.
- **Restart points.** They are taken over `e.command`, for each rule:
  - **(a) Command words.** Each index where a word naming one of the rule's command words begins.
    - The index is 0, or it follows whitespace, `;`, `&`, `|`, `(`, `)`, `{`, `}`, `<`, `>`, the backtick, `'` or `"`.
    - The word runs to the next such character. It is tested the way the rule's segment check tests a command token:
      - G7: git by v0's `isGit` (`tools/mods/spatial-guardian/hooks/register.js:157-160 @ 3c802bcc sha256:HASH-TBD`), `gh` or `gh.exe`;
      - G8: `claude` or `claude.exe`;
      - G9: `cargo` or `cargo.exe`, git, or a §7 delete word.
  - **(b) Quotes.** Each index that holds `'` or `"`.
- **A restart's text** is `e.command` from the restart point to the end of the first segment that the splitter's first reading gives for that suffix. So the reader starts with its quote state closed.
- **A restart's reading** is the rule's reader as declared: both readings, the segment check, the quoted-token rescan and the depth cap, with depth counted from 0. It differs in three ways:
  - **Unbalanced segments.** A segment that cannot be tokenised passes to the segment check the tokens the tokeniser returns, with the open quote's text as the last token (`tools/mods/spatial-guardian/hooks/register.js:116-154 @ 3c802bcc sha256:HASH-TBD`). It starts no further restart.
  - **G9's base B is unknown, and is read as M.** `git -C` and a named target folder are still read.
  - **When restarts run.** Once per call per rule, and only when condition 1 holds.
- **B in a rescanned token.** This clarifies §2.6 and applies in every reading. B is taken from the token's own first segment by §2.6's rule. Otherwise it is unknown.
- **Overrun.** A call whose restarts overrun the hook budget is refused by the registration's catch (v0 §8 item 2). The refusal is not logged (§2.7).

A.3 **Exactly which shapes change.**
- **Newly allowed:** a call that the drafted §2.3 refuses only through its unbalanced bullet, and in which no restart refuses. There are two kinds:
  - **(i) Words in order but never one command.** The rule's words appear in order in the call, but from every restart point they never form one command as the segment check reads it. Examples:
    - `merge` after `gh pr create`, `view` or `checks` (the word after `pr` is not `merge`);
    - git and `rebase` in prose with other words between;
    - `cargo` and `clean` on different lines or in different `|` cells.
  - **(ii) A spelling the segment check never reads.** Its decisive word is one the segment check reads in no call:
    - an operand holding `$`, a backtick or `~`;
    - a `cargo clean` limited to a package;
    - a pull-request path with a variable number.
    A tokenisable call already passes these: G1's limits (§1) and §2.6's operand rule.
- **Newly refused:** none. Condition 1 is the drafted condition, so the refusal set is a subset of the drafted one. The OPEN additions (Parts D, F and H) are the exception.
- **Still refused:**
  - every refusal made by the segment check, the rescan or the depth cap;
  - after an odd quote, every spelling that the rule's reader refuses in a tokenisable call, read from a restart point.

A.4 **Why no executed spelling escapes.**
- **Condition 1 holds for every executed spelling,** by §2.2's argument. Deleting quotes keeps each word whole, and each element of a sequence is tested either as a whole word with no break character or at the start of a word.
- **Every executed spelling has a restart point where its shell starts reading.** At that point the shell's quote state is closed. It is one of two things:
  - the command word, at that shell's level: point (a);
  - the outermost opening quote whose content a nested shell runs, as in `bash -c "…"`, `$(…)` or a heredoc fed to a shell: point (b).
- **From that point to the end of the shell's command** (the first unquoted separator), the restart reads the text the same way the rule's reader reads a tokenisable segment. Nested quoting is followed by the rescan, under the depth cap.
- **Result.** After an odd quote, each rule refuses what its reader refuses without one, within G1's limits (§1), and with B unknown.
- **Scope.** The redesign adds one condition to one bullet, as §2.2 does for G1. It changes nothing Guardian refuses beyond the brief's §2.3 reading bullet (pinned in §2.3) or round 57. No OPEN item.

A.5 **Fixtures.**
- **F40 to F45.** All rows can be tokenised except the last row of F40, F41 and F44. Those three rows:
  - F40's last row: condition 1 holds, and the restart at `git` refuses;
  - F41's last row: there is no G7 sequence, so it passes;
  - F44's last row: the restart at `rm` refuses (B unknown, an absolute operand).
  Every other row takes the unchanged path, which P0b's scratch ran as predicted (the report's check of the scratch copy). Under Part C, F40's and F44's engine answers add the plugin.json stat, answering that it exists.
- **The prefix.** Call `cat <<'EOF'` / `it's` / `EOF` / the prefix.
- **F50, refused (T59).** Each row is the prefix followed by:
  - G7: `gh -R o/r pr merge 1`; `bash -c "git -C \"a b\" rebase main"`; `bash -c "bash -c \"git rebase main\""`; `git merge -m "x; y" --squash f`;
  - G8: `claude plugins install x`;
  - G9: `cd C:/dev/wt/x && rm -rf target` (B unknown); `CARGO_TARGET_DIR=D:/x cargo clean` (the word before `cargo` is not in the restart).
- **F51, allowed (T60):**
  - `gh pr create --title t --body-file - <<'EOF'` / `it's ready for the merge click` / `EOF`;
  - `gh pr checks 12 && cat >> l.md <<'EOF'` / `the human's merge click is next` / `EOF`;
  - `cat >> l.md <<'EOF'` / `the custodian's git log check: no rebase ran` / `EOF`;
  - `cat >> l.md <<'EOF'` / `claude plugin test passed on the human's machine` / `the marketplace update is his` / `EOF`;
  - `cat >> l.md <<'EOF'` / `the reviewer's cargo test` / `| 0 | clean |` / `EOF`;
  - the prefix, then `cargo clean -p spatial-skp`.

A.6 **Predictions for P0c.** The window is P0b's extracted calls since 2026-09-27.
- **G1 v1:** 40, as P0b recorded. G1 does not change.
- **G7: 3.**
  - 2026-09-28T07:00:34Z, main: #138's §9 merge (line 2).
  - 2026-10-05T13:49:26Z and 13:49:37Z, worker: quoted search patterns that name the spellings, refused by the rescan's segment check. §2.0 has the build worker search with the Grep tool.
- **G8: 1.** 2026-10-04T10:24:11Z, main: record text naming the install commands, refused by the rescan's segment check (A.8).
- **G9: 1.** 2026-09-27T18:31:06Z, reviewer: a forced `git clean` after a `cd` joined by `;`. This is §2.6's kept over-refusal.
- **Row by row:** every row P0b classes as odd quote only now passes, and every other row stays refused.
- **OPEN additions:** OPEN-1 to OPEN-4 and Part H change no row (P0b's Round-57 additions; (ii)'s last bullet).
- **Subset check:** calls that Amendment 2's G7, G8 or G9 refuse and the drafted rules allow, OPEN additions aside: 0.
- **Basis.** I read P0b's per-row table. For each row classed odd quote only, I read the rule's words in that row's command text in P0b's extracted calls (evidence named by the report's data-file list). Nothing was run, and no command text is reproduced.

A.7 **P0c.** The build worker's first step: read-only, before any code, run as P0b was run (§0.5 and its replay rules).
- **(a)** Update the scratch rules, outside the repository, to §2 as amended by Parts A, C, D, E, F and H.
- **(b)** Re-run P0b (iv)(b) over the same extracted calls and report:
  - G1 v1's count;
  - for each rule since 2026-09-27, each refused row by time, agent, step and class;
  - A.6's subset count;
  - the slowest call's scratch time, reported as evidence and not as a claim.
- **(c)** Run every §3 row that Node can stand in for, F37 to F60, through the scratch rules, and set each outcome against §3.
- **Record.** Amendment 3 (class 1), with nothing before it. Only §0.5's `claude` subcommands are run.
- **A count off A.6 is class 2.** P0c stops the piece (I11 to I13, Part K) when any of these happens:
  - a main-loop row beyond A.6's is refused, and its text names no rule spelling within one restart's text;
  - an F-row misses its prediction;
  - G1 v1's count differs from P0b's.

A.8 **How I8 is read from here.**
- A refusal of text that names a rule's spelling within one command, read from a restart point, is not a refused flow. A.6's G8 row is an example.
- Such a refusal is the over-refusal §2.4 to §2.6 already list, and R-i's route (the Write tool) applies to it.
- Any other refusal of a custodian flow is I8.

A.9 **README (R-b) additions.**
- After an odd quote, G7 to G9 read each command word and each quote as the start of a new command.
- There, a leading `cd` is not read, so the base is the main checkout.
- A `CARGO_TARGET_DIR=` word before `cargo` is not read either. Name `--target-dir` instead.

**Part B — deviation (class 2): §5's replay prediction.**
- §5 predicted, since 2026-09-27: G7 1 (the §9 merge), G8 0 and G9 0.
- P0b (iv)(b) recorded 19, 9 and 4.
- Reason: A.1.
- §5's line stands unedited. A.6 is the new prediction, for P0c.

**Part C — scope narrowing on a ruling (class 5): round 57, OPEN-1 (b).** The ruling is `state/directives/2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md:6 @ 3c802bcc sha256:HASH-TBD`, cited by round and item and not reproduced.

- **Shape.** The repository check runs when G7 or G9 has decided to refuse (its candidate), before the refusal stands:
  - M comes from §2.6's lookup (`$.session.repo()`, cached on success);
  - the check is `$.fs.stat(<M>/tools/mods/spatial-guardian/.claude-plugin/plugin.json)`.
- **Outcomes:**
  - **The file exists:** this repository, so the refusal stands.
  - **ENOENT, or `$.session.repo()` answers no repository:** another repository, so the call goes on to the next rule.
  - **Any rejection:** the check cannot complete, so the refusal stands with the rule's own reason and id.
- **Caching and calls.** The result is cached with M, on success. The check adds no call: `$.session.repo` and `$.fs.stat` are already on §2.0's calls line.
- **Where it does not run:** G1 to G6 and G8.
- **The path.**
  - P0b's Round-57 additions found Guardian's `plugin.json` at `tools/mods/spatial-guardian/.claude-plugin/plugin.json` (by `git ls-files`), and none at the repository root.
  - I read the ruling's location clause as that path, resolved from the repository root that `$.session.repo()` returns. The clause is a sub-line span of the line cited above and carries that line's hash.
  - It is the path option (b) named, and the ruling adopted option (b).
  - Read literally, the clause finds no file in this repository, so G7 and G9 would never apply.
  - A clone carries the file, so a clone counts as this repository. A worktree resolves to the main tree (P0 §5).
- **§2.4 change.** G7's `$` calls become `$.session.repo` and `$.fs.stat`, made only after a candidate.
- **F52 (T61).** Engine answers: session.repo `C:/r`, and the plugin.json stat as each row states. Rows: F40's `git rebase origin/main` and F44's `rm -rf C:/r/target`:
  - with the stat answering ENOENT: `next(e)`;
  - with session.repo answering no repository: `next(e)`;
  - with the stat rejecting EACCES: refused, with G7's and G9's reasons.
- **T61** `G7 and G9 apply only in this repository, and apply when the check cannot complete`. Mutation: a rejected stat is read as another repository.
- **§5:** declared unchanged as Part K states. Invalidated if P0c finds the plugin.json path absent at main.
- **§8:** Part K, item 21.
- **README:** G7 and G9 are keyed on the session's repository. A session started outside this repository that reaches into it is not read.

**Part D — scope addition (class 9): round 57, OPEN-2 (b).** The ruling is `state/directives/2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md:8 @ 3c802bcc sha256:HASH-TBD`.

- **§2 shape (G7).** Refused, whatever the method, is this sequence:
  - `gh` or `gh.exe`;
  - then `api`, as the next word that is not an option or the value of `-R`/`--repo`;
  - then, later in the segment, a word holding `pulls/`, one or more digits and `/merge`. That part ends the word, or is followed by `/`, `?` or `#`.
- **Sequence:** gh…api…merge-path word. **Trigger:** unchanged (gh and `merge` as words).
- **Not read:** a number written as a variable; GraphQL merges; MCP merge tools.
- **Over-refusal, for the README:** the read-only merged check through `gh api`. `gh pr view` answers that question instead.
- **F53, refused (T62):**
  - `gh api repos/o/r/pulls/12/merge -X PUT`;
  - `gh api -X PUT repos/o/r/pulls/12/merge`;
  - `gh api --method=PUT /repos/o/r/pulls/12/merge -f merge_method=merge`;
  - `gh api repos/o/r/pulls/12/merge`;
  - `gh api --method GET repos/o/r/pulls/12/merge`;
  - PowerShell `gh api -X PUT repos/o/r/pulls/12/merge`;
  - A.5's prefix, then `gh api -X PUT repos/o/r/pulls/12/merge`.
- **F54, allowed (T63):** `gh api repos/o/r/pulls/12`; `gh api graphql -f query=q`; `gh pr view 12 --json mergedAt`; `gh api repos/o/r/pulls/$N/merge`.
- **T62** `G7 refuses a gh api call on a pull request's merge path, whatever the method`. Mutation: the path test is gated on a PUT method.
- **T63** `G7 allows gh api reads of a pull request, and a merge path it cannot read`. Mutation: the digits test is dropped, so any path segment counts.
- **§5:** declared unchanged as Part K states. Invalidated by a recorded legitimate call to a `gh api` merge path; P0b recorded none.
- **§8:** item 22. **§9:** the architect reads the ruling against T62 and T63.

**Part E — scope addition (class 9): round 57, OPEN-3 (b), with Fable's round-57 advice, item 3.** The ruling is `state/directives/2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md:8 @ 3c802bcc sha256:HASH-TBD`. Fable's item 3 is `state/directives/2026-10-05-fable-advice-round-57.md:12 @ 3c802bcc sha256:HASH-TBD`.

- **§2 shape (G8, path side).**
  - **P is the user profile, `USERPROFILE`.** P0b (iii) found no override name, so there is no override location.
  - P is resolved once per load by `$.fs.stat(P, { resolve: true })`. On ENOENT, P's normalised spelling is used. The result is cached on success.
  - A Write, Edit or NotebookEdit whose placed, normalised path is `<P>/.claude.json` is refused with G8's reason.
  - It fails closed together with G8's folder lookup (§2.5; T54).
- **Not read:** shell writes to the file, as for the rest of the user folder; a `.claude.json` anywhere else.
- **Fable's item 3, for the README's G8 limits and §1's may-not-claim:** project-scope configuration inside the repository (`.mcp.json`, the repository's own Claude settings) is not guarded. It is tracked, so it reaches review.
- **F55, refused (T64):**
  - Write `C:\u\.claude.json`;
  - Edit `c:/U/.CLAUDE.JSON`;
  - NotebookEdit `C:\u\.claude.json`;
  - a `worker` row's Write to `C:/u/.claude.json`;
  - Edit `C:\u\x\..\.claude.json`, with the stat resolving it to `C:/u/.claude.json`.
- **F56, allowed (T65):** Write `C:\u\.claude.json.bak`; Write `C:\r\.claude.json`; Write `C:\u\x\.claude.json`; Bash `cat > C:/u/.claude.json`.
- **T64** `G8 refuses a tool write to the user-level .claude.json in every spelling`. Mutation: the comparison uses the spelling as received, not the placed path.
- **T65** `G8 allows .claude.json outside the user profile's top level, and shell writes to it`. Mutation: `.claude.json` is matched as a path suffix anywhere.
- **§5:** the env reads stay `USERPROFILE` alone. Invalidated if the 2.1.288 types name a user-level `.claude.json` somewhere other than the profile (P0b (iii)).
- **§8:** item 23.

**Part F — scope addition (class 9): round 57, OPEN-4 (b), the human's glob addition included, with Fable's round-57 advice, item 2.** The ruling is `state/directives/2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md:10 @ 3c802bcc sha256:HASH-TBD`. Fable's item 2 is `state/directives/2026-10-05-fable-advice-round-57.md:10 @ 3c802bcc sha256:HASH-TBD`.

- **§2 shape (G9).**
  - **How operands are compared.** Each operand is located against B. It is compared on its resolved path when it exists, and otherwise on its normalised spelling (§2.6). The comparison is against both the spelled and the resolved protected members.
  - **Containers.** A recursive delete whose operand is a folder above a protected member is refused. That is M, any folder above M, or any folder above a member's resolved location. So when `target` resolves elsewhere, the folders above it are reached too; P0b found `target` is a symlink to the D: drive.
  - **Contents.** A recursive delete whose operand lies under `M/target/slice-evidence` or `M/target/fixtures`, and exists, is refused.
  - **The glob addition.** A delete is refused, with or without a recursive option, when its operand holds `*`, `?` or `[` and its folder part is a data folder or lies under one. When the operand has no folder part, B is the folder part.
  - **Still allowed:**
    - `target/debug`, `target/release` and the shell's `src-tauri/target`;
    - a worktree's own target, and anything under `M/.claude/worktrees/`;
    - a non-recursive delete of a named file;
    - an operand that does not exist.
  - **Options of `rd`, `rmdir`, `del` and `erase`.** A word made of `/`, one letter and an optional `:value` is an option. P0b read the `/q` in `del /q` as an operand. For `rm` and the PowerShell delete words, `/c/…` stays a path.
  - **Trigger:** a quoted token holding, as words:
    - a delete word, in any case;
    - or `cargo` and `clean`;
    - or git and `clean`.
  - **Sequence (Part A, condition 1):** cargo…clean; git…clean…force word; delete word…recursive word; delete word…glob word.
- **F57, refused (T66).** Engine answers: session.repo `C:/r`; the stats answer that the members exist; `C:/r/target` resolves to `D:/t/target`. Rows:
  - `rm -rf C:/r`; `rm -rf C:/`; `rm -rf .`; `cd C:/r && rm -rf ..`; `rm -rf D:/t`;
  - `rm -rf C:/r/target/fixtures/admission-remediation`; `rm -rf target/slice-evidence/cancel-rescore`; `rm -r C:\r\target\fixtures\x.parquet`;
  - PowerShell `Remove-Item -Recurse C:\r`;
  - `bash -c "rm -rf C:/r"`;
  - A.5's prefix, then `rm -rf C:/r`.
- **F58, allowed (T67):**
  - `rm -rf target/debug`; `rm -rf C:/r/target/release`; `rm -rf C:/r/frontends/shell/src-tauri/target`;
  - `cd C:/dev/wt/x && rm -rf target`; `cd C:/dev/wt/x && rm -rf .`; `rm -rf C:/r/.claude/worktrees/w`;
  - `rm -rf target/fixtures/nothing-here` (ENOENT);
  - `rm C:/r/target/fixtures/x.parquet`; `rm -f target/fixtures/x.parquet`;
  - `rm -rf D:/wt-targets/x`; `rm target/*`.
- **F59, Fable's item 2 (T68).**
  - Refused: `rm target/slice-evidence/*`; `rm -f target/fixtures/*.parquet`; PowerShell `Remove-Item target\fixtures\*`; `del /q target\fixtures\*`.
  - Allowed: `rm target/fixtures/x.parquet`.
- **T66** `G9 refuses a recursive delete of the main checkout, a folder above it, or anything under a data folder`. Mutation: the container test is dropped.
- **T67** `G9 still allows build-output deletes, worktree targets and a named file in a data folder`. Mutation: the contents test is applied without a recursive option.
- **T68** `G9 refuses a glob delete in a data folder with or without a recursive option, and allows a named file there`. Mutation: the glob addition is applied only with a recursive option.
- **§5:** P0b's Round-57 additions found no recorded call newly refused or released. Invalidated by a recorded legitimate delete of a container, or of data-folder contents; P0b recorded none.
- **§8:** item 24.
- **README:** G9's row and its new over-refusals:
  - `rm -rf .` without a leading `cd` into a worktree;
  - a glob in a data folder.

**Part G — OPEN-5 (a), the form's default.** The ruling is `state/directives/2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md:12 @ 3c802bcc sha256:HASH-TBD`.
- No scope is added.
- R-b lists the new-folder Write as a kept over-refusal, with its workaround: create the folder first.
- The placement refusal (`tools/mods/spatial-guardian/hooks/register.js:384 @ 3c802bcc sha256:HASH-TBD`) logs under §7's rule id `unplaceable`.
- **F47 gains a row:** Write `C:\r\new\x.md`, with the stat answering ENOENT for the path and for its folder. Expected: one write, rule `unplaceable` (T56).
- **§9 Evaluation gains a line:** the custodian brings the `unplaceable` count to the window that takes it up.

**Part H — the CLI spellings.** These are P0b (ii)'s findings, a claim about build 2.1.289.
- **Within the brief.** §2.5 and §7 already read every CLI spelling of the named operations, with P0b (ii)'s aliases. §7's G8 values become:
  - group words: `plugin`, `plugins`;
  - actions: `install`, `i`, `uninstall`, `remove`, `enable`, `disable`, `update`, `add`, `rm`;
  - MCP actions: unchanged.
- **F60 (T69).**
  - Refused: `claude plugins install x`; `claude plugin i x`; `claude plugin marketplace rm x`; `claude plugins marketplace add C:/r/tools/mods`; `claude plugins uninstall x`; `claude plugin remove x`.
  - Allowed: `claude plugins list`; `claude plugins validate tools/mods`.
- **T69** `G8 refuses the CLI's aliases of the named operations`. Mutation: `plugins` is dropped from the group words.
- **Outside the brief.** These verbs are not refused:
  - plugin verbs: `prune` (alias `autoremove`), `init` (alias `new`), `configure`, `eval`;
  - MCP verbs: `login`, `logout`, `reset-project-choices`.
  - Adding any of them is OPEN-6, a red line.
  - Until OPEN-6 is ruled, none is refused, and the README lists them as not read (§1).
  - A ruling that adds any of them enters by class 9 before its code.

**Part I — N2's narrowing (class 1).** The source is P0b (iv)(b), its G1 paragraph, and P0b's Findings.
- N2 passes only when no word after `push` in the call's words is, on its own, a forcing word.
- A word beginning `+` or `:` is a forcing word (`tools/mods/spatial-guardian/hooks/register.js:189-190 @ 3c802bcc sha256:HASH-TBD`).
- In the window, v1 still refuses 25 calls through the unbalanced rule. 21 of them meet the forcing test only through such a word: a `date +…` format, or prose.
- §2.2's set is unchanged; its list of what stays refused already implies this. F37's N2 row has no such word.
- **F38 gains a row:** `git commit -F - <<'EOF'` / `it's done` / `EOF` / `git push -q origin main && date -u +%H:%M`. Expected: refused, G1 (T44).
- **README (R-b, G1's kept shapes):** when heredoc text holds an odd quote, a plain git push after it is still refused if any later word starts with `+` or `:` (a `date +%H:%M` format, a `key: value` line), or reads as a force or delete option. Run the push as its own call, or write the text with the Write tool.

**Part J — Fable's round-57 advice, item 4** (`state/directives/2026-10-05-fable-advice-round-57.md:14 @ 3c802bcc sha256:HASH-TBD`). N1's values stay as §5 and §7 declare them. Window item J is outside this piece.

**Part K — record lines amended by reference, and the superseded index.**

- **§1, may claim.**
  - Item 2 now reads: G7, G8 and G9 refuse F40, F42, F44, F50, F53, F55 and F57, and F59's refused rows; they pass F41, F43, F45, F51, F54, F56 and F58, and F59's allowed row. F52 and F60 come out as stated.
  - Item 6 now reads: P0c's counts.
- **§1, may not claim.**
  - G7: GraphQL merges, MCP merge tools, and a merge path with a variable number.
  - G8: shell writes to `.claude.json`; project-scope configuration inside the repository (Part E); Part H's unruled verbs.
  - G9: B, and a `CARGO_TARGET_DIR=` word, in a call that cannot be tokenised (A.9).
  - Reach: G7 and G9 are keyed on the session's repository (Part C).
  - Parts C to F settle the drafted conditional limits on OPEN-1 to OPEN-4.
- **§3:** F38 (Part I), F40's and F44's engine answers (Part C), and F47 (Part G) change. F50 to F60 are new.
- **§4:** T59 to T69 are new.
  - **T59** `G7, G8 and G9 read a call that cannot be tokenised from each restart point`. Fixture F50. Mutation: restart points are limited to command words, with no quote restarts.
  - **T60** `G7, G8 and G9 allow record and pull-request text after an odd quote`. Fixture F51. Mutation: condition 2 is dropped, which restores the drafted reading.
- **§5.**
  - T1 to T34 and T37 to T69 pass.
  - A.6 replaces the P0b (iv) count prediction, for P0c. Part B records the miss.
  - The `validate` prediction stands. No call is added, and a difference only in a `(via …)` annotation is class 2.
  - Declared unchanged: as §5, plus G1 (all of §2.2) and every reason.
  - New invalidators:
    - **I11:** P0c refuses a main-loop call beyond A.6's rows, and its text names no rule spelling within one restart's text. This is I8.
    - **I12:** P0c finds an F-row outcome that differs from §3.
    - **I13:** P0c's G1 v1 count differs from P0b's.
- **§7.**
  - G7 changes by Part D; G8 by Parts E and H; G9 by Part F; the restart points and sequences come from Part A.
  - The size line stands, unedited. After this amendment the estimate is register.js 560, tests 950 and README 140: about 1650 lines, over the 1300 ceiling. If the final count at the gated head is over, it is recorded as class 8 (round 25, item 2 (a)).
- **§8 adds items 20 to 25.** Each is block-on-sight:
  - **20:**
    - a G7 to G9 refusal in an unbalanced segment on condition 1 alone;
    - a restart point beyond Part A's;
    - a restart that reads past its first segment, starts another restart, or reads B;
    - a restart made when condition 1 fails;
    - G1 read by restarts.
  - **21:**
    - the repository check run for G1 to G6 or G8;
    - the check made before a candidate is found;
    - a call beyond §2.0's calls line;
    - a failed check read as another repository;
    - a path other than Part C's.
  - **22:** a method condition on the merge path; a claim that GraphQL merges or MCP tools are read.
  - **23:** a refusal of a shell write to `.claude.json`; a match outside `<P>/.claude.json`.
  - **24:** a refusal of any of Part F's still-allowed shapes.
  - **25:** code for any of Part H's outside-the-brief verbs before its ruling and its class 9 amendment.
- **§9.**
  - Dispatch: P0c (A.7) comes before any code.
  - The architect adds: A.4's argument, read against the code; Part C's reading of the path.
  - The reviewer adds: P0c's table, read against its method; F50 to F60.
  - The PR body adds P0c's table.
  - The evaluation adds the `unplaceable` count (Part G).

**Superseded index (read this amendment first).**
- §2.3's unbalanced bullet, for G7 to G9 → A.2.
- §2.4's no-call line → Part C. §2.4's spellings → Part D adds.
- §2.5's and §7's G8 lists → Parts E and H.
- §2.6's operand, trigger and sequence rules, and B in rescans → Part F and A.2.
- §5's replay prediction → Part B (missed, not edited) and A.6.
- §1's items 2 and 6, and its OPEN-conditional limits → Part K.
- §7's estimate → Part K. The size line is not edited.
````

## 2. OPEN items for the human

**OPEN-6: the CLI verbs outside the brief's list.** P0b (ii) found these, as a claim about 2.1.289:
- plugin verbs: `prune` (alias `autoremove`), `init` (alias `new`), `configure`, `eval`;
- MCP verbs: `login`, `logout`, `reset-project-choices`.

- **Options:**
  - **(a)** Add none. The README lists them as not read.
  - **(b)** Add all of them.
  - **(c)** Add `prune`/`autoremove`, `init`/`new`, `configure`, and the MCP verbs `login`, `logout` and `reset-project-choices`. Do not add `eval`.
- **Recommendation: (c).** Each verb in (c) changes the human's Claude configuration, which the brief's G8 row makes his own act:
  - `prune` changes the installed set;
  - `init` writes into the user's skills folder, which G8's path side already guards (P0b (iii));
  - `configure` sets plugin option values;
  - `login` and `logout` change an MCP server's credentials;
  - `reset-project-choices` changes the recorded approvals of project MCP servers.
  `eval` changes no configuration (P0b (ii)).
- **Cost.** G8 reads action words anywhere later in the segment, so common words like `new`, `eval` and `i` could catch prose. None of these verbs appears in the record as a command. If OPEN-6 is ruled before P0c, P0c counts the prose cost.
- **Red line:** yes, because it changes what Guardian refuses.
- **What waits:** nothing. (a) holds by default. If (b) or (c) is ruled, it enters by class 9 before its spellings' code, and P0c includes it if the ruling comes first.

**For the human to see, not asked:**
1. **OPEN-1's location clause.**
   - I read "at the repository root" (`state/directives/2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md:6`) as `<root>/tools/mods/spatial-guardian/.claude-plugin/plugin.json`. That is the path option (b) named.
   - Read literally, the clause finds no file in this repository, so G7 and G9 would never apply.
   - If he means something else, he says so before G7's code.
2. **How I8 is read (A.8).** The one remaining main-loop G8 row is at 2026-10-04T10:24:11Z: the custodian's own record text quoting the README's install commands. It stays refused, and R-i routes such text to the Write tool.
3. **G1 v1's remaining refusals.**
   - In P0b's window, G1 v1 still refuses 24 calls with an odd quote: 19 since 2026-09-27, and 0 since the 2026-10-04 reload.
   - 21 of them are caught through `+` or `:` words (Part I).
   - The restart reading could narrow G1 the same way, but I don't propose it. Brief §2.1 has the form state G1's newly allowed shapes exactly, and P0b checked §2.2 as drafted. This is a window item.
4. **The size estimate** (about 1650 lines) exceeds §7's 1300 ceiling. If the final count is over, it is recorded as class 8, and the §7 line is not edited.

## 3. Files read
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V1-PREREGISTRATION.md (whole, Amendment 1 included)
- C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-p0b-report.md (whole)
- C:\dev\spatial-ide\state\directives\2026-10-05-round-57-guardian-v1-open-1-to-5-ruling.md
- C:\dev\spatial-ide\state\directives\2026-10-05-fable-advice-round-57.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (round 57's RULED block, lines 32-37; no line of it is cited)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\register.js (whole, at 3c802bcc)
- C:\dev\spatial-ide\state\consults\2026-10-05-guardian-v1-architect-draft.md (lines 710-779, part 3's OPEN items)
- C:\dev\spatial-ide\state\directives\MODS-V1-2026-10-05.md (lines 14-53)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (lines 96-174)
- P0b's scratch evidence, untracked and used as evidence only, never as Authority: `...\scratchpad\guardian-v1-p0b\replay\tables-b.md`, `engine.mjs`, `classify.out`, `snip.mjs`. I also grepped `calls.jsonl` under `<session scratchpad>\`. The harness saved two large grep outputs under `<session folder>\tool-results\`. That was the harness auto-saving output, not a call I made. No command text is reproduced here.
