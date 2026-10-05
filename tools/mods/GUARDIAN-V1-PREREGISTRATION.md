# Guardian v1 — G1's odd-quote false alarm narrowed, one local log line per refusal, and G7 to G9 (PLAN node `guardian-v1`) — preregistration

**Authority:**
- the human's 2026-10-05 direction, line 2: `state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:16-22 @ 5c06b0c2 sha256:886168f4ad5073f154627dfdd47f497bda21cf36b6bd84eebda1cb071a4d5d0d`, with its RULED block in `DECISIONS-PENDING.md` (RULED 2026-10-05, the human's direction placing `data-plane-terminal-without-credit`, the mods v1 brief and the lead-data second pilot; cited by its heading, not by line);
- the brief that line approves, `state/directives/MODS-V1-2026-10-05.md`: line 5 (`state/directives/MODS-V1-2026-10-05.md:5 @ 5c06b0c2 sha256:53491c517ff74ed18c6d8d9e8023aafdb2089b835e44e7fa1756e6808281ce9b`), §1 (`state/directives/MODS-V1-2026-10-05.md:7-12 @ 5c06b0c2 sha256:a2195dd694bf40b68d6003922af07f0ae4bd73fdd5a6a19b054c132714f4c294`), §2 (`state/directives/MODS-V1-2026-10-05.md:14-76 @ 5c06b0c2 sha256:b5081d4a70069e77d93c1023a819329d1bd97a16907e3398061b473ca230e1f5`), §4 (`state/directives/MODS-V1-2026-10-05.md:119-122 @ 5c06b0c2 sha256:2a63e5d4f2ce728031707d2d4f42481e787c926d265abb9b48805d7eae48192a`), §5 (`state/directives/MODS-V1-2026-10-05.md:124-130 @ 5c06b0c2 sha256:d6ae1dd9627ab317eeee6ecede842a672f79db41b0733e3407ce4c7daf6e8ae8`);
- the node: `PLAN.yaml:4047-4064 @ 5c06b0c2 sha256:62c66181d2110674242e2762b9e77c3ad11e4ad2d71631715381cdbad03fa2f6`;
- standing: question round 34, item 3 (force-push; no live G1 probe); round 50, item 3 (window item G, which line 2 brings forward); round 41, item 3 and round 43, item 4 (G6, unchanged); round 7 (reasons); round 29 (exposure); round 15 (c) and (e); round 25, item 2 (a) to (e). G7 enforces AUTONOMY §27 and the PRECEDENTS history-rewrite entry, as the brief's table names them. G9 enforces `AI_DEVELOPMENT.md:161-168 @ 5c06b0c2 sha256:1274731d09667c5918b18a1f3d7f6b0ec73a62a90187361ad93aa5467cd805df`.
- The v0 form, `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, stays the form of every v0 rule. It is closed by its Amendment 7 and gets no amendment from this piece. This form governs only what it changes and adds.

**Drafted by** the architect agent on the custodian's brief, read at main 5c06b0c2, with the P0 report `state/consults/2026-10-05-guardian-v1-p0-report.md` (cited by section). The architect drafts it because it crosses no engine/ or kernel/ path. Nothing was run for this draft. **Committed with the custodian's hashes before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating:** full, reviewer and architect, on three heads, each enough alone:
- **§21a, security posture** (`AUTONOMY.md:315-332 @ 5c06b0c2 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3`). The brief names the merge the security-posture change itself (line 5 above). Guardian is read from `tools/mods/spatial-guardian/` in the main checkout (v0 Amendment 8, E0; Amendment 9), so the merge changes the live guard at the next reload.
- **§21a, a property under test.** Refuse-only and fail-closed (v0 §2.1 (a) and (b); its T16, T24 and T25). This piece adds a write, and changes where a throw is caught (§2.1).
- **§21c, size** (`AUTONOMY.md:347-357 @ 5c06b0c2 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31`): over the bound (§7).
Under round 25, item 2 (e), no five-line form is used.

**Red line.**
- The merge waits for the human's typed approval, given after both gates and before his click, naming the live checks he allows (E7 to E10, and E11 if he names it).
- Nothing in this piece installs, enables, reloads or loads a mod, adds a marketplace, starts a `claude` session, or writes under the user's Claude folder.
- Before the merge, nothing writes into `tools/mods/spatial-guardian/` or `tools/mods/.claude-plugin/` in the main checkout, because the live mod is read from there. This form and its §10 amendments are excepted.
- AUTONOMY §9's docs-only auto-merge is not used while Guardian is installed (line 2). §9 is not edited (the direction's step f).

## §0. Disclosure

**0.1 Inputs.** These are Evidence, not Authority:
- **P0:** `state/consults/2026-10-05-guardian-v1-p0-report.md`, cited by section. `claude --version` read 2.1.289 at its start and at its end.
- **The v0 form:** cited by section and amendment.
- **Build labels, kept (round 15 (c)):**
  - a type read is a claim about 2.1.288 (`<skill-root>/types/claude-code.d.ts`, sha256 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1);
  - a `plugin test` or `validate` result is a claim about 2.1.289;
  - a transcript scan is an observation of the record from 2026-09-20 to 2026-10-05;
  - a Node harness trace is a run of a scratch copy, not of the engine.
  None is read as current for another build (§5 I2).

**0.2 P0 → this form, by section and by build:**
1. **P0 §1, the build.**
   - Observed at 2.1.289: the binary is 2.1.289, `plugin test` passes 39 of 39, and `validate` prints v0 Amendment 8's two lines unchanged.
   - Typed at 2.1.288: the 2.1.289 bundle has no plugin-authoring folder, so the types cannot be re-read at 2.1.289. That they still hold is shown by behaviour only.
   - Carried in: §1, the build bullet; §5 I2.
2. **P0 §2, for G7.** Observed in the record:
   - one use since 2026-09-27: the custodian's `gh pr merge 138 --merge` under AUTONOMY §9, on 2026-09-28. Line 2 settles it (§0.4 item 1);
   - no agent `git rebase`, `git pull --rebase` or `-r`, or `git merge --squash` in this repository since 2026-09-27;
   - three `git rebase` calls in another project under the same user-scope plugin (OPEN-1).
   - Limits P0 names: aliases, `pull.rebase` configuration, and rebases run from code (§1).
3. **P0 §3, for G8.** Observed in the record:
   - every tool write under the user's Claude folder is under `projects/<project>/memory/`, plus one `rm` of a tool-results file;
   - nothing was written at settings, plugins, skills, agents, commands or hooks;
   - the repository's own `.claude/` folders were written 388 times, and those writes must pass;
   - 13 Bash writes went into the user folder's memory files;
   - the executed `claude plugin` subcommands were `test`, `validate`, `list` and `--help` only.
   Typed at 2.1.288: `$.env.get` takes a literal name. Carried in §2.5.
4. **P0 §4, for G9.**
   - Observed in the record: targets are cleaned by removing a worktree's own target folder after `git worktree remove`, and no call in the window has a G9 shape. Two `cargo clean -p` calls ran from a worktree with `CARGO_TARGET_DIR` naming the main checkout's target; they pass G9 as worded.
   - Typed at 2.1.288: a `tool.call` event and an `$.agent.list()` row carry no working directory. The one typed route to it is an `agent.spawn` hook's `cwd`.
   - Carried in §2.6.
5. **P0 §5, the log folder and `validate`.**
   - Typed at 2.1.288: `$.fs` has no append, and `$.session.repo()`'s root is the main working tree's, also for a worktree.
   - Observed at 2.1.289 on a probe copy: a log write adds `$.fs.write` and `$.session.repo` to the calls line, `$.env.get` adds the env lines, and the hooks line does not change.
   - Carried in §2.7 and §5.
6. **P0 §6, G1's over-refusals.**
   - Observed in the record: six G1 refusals since the install, all false alarms. The ledger counts four.
   - All six come from one splitter state, refused by the unbalanced-quote rule.
   - On a Node scratch copy with that rule removed, none of the six is refused.
   - Also seen: three Writes refused as unplaceable because their folder did not exist yet (v0 Amendment 10). The brief does not name this.
   - Carried in §2.2 and OPEN-5.
7. **P0 §7,** the ten open items: §0.4.

**0.3 Repository facts relied on, at 5c06b0c2:**
- **G1's quote loop:** `tools/mods/spatial-guardian/hooks/register.js:54-100 @ 5c06b0c2 sha256:3c155d36f67db6334c5e878c53a7f97116e18bf0fab136d67e6ff1527f42a132`. Its single-quote state is `tools/mods/spatial-guardian/hooks/register.js:60-63 @ 5c06b0c2 sha256:45cce77dfaccd2c7cccbfa1cdd4d970e9943b2e74d32038f5848cdc899b9f26b`.
- **G1's other functions:**
  - the tokeniser's unbalanced flag: `tools/mods/spatial-guardian/hooks/register.js:154 @ 5c06b0c2 sha256:15575c5d9977643a93b60f9d421e5497da69e9f51099669f862fce57aaffb2b8`;
  - `isGit`: `tools/mods/spatial-guardian/hooks/register.js:157-160 @ 5c06b0c2 sha256:ba23805c9e7fb515bb175205f46c4e988b1d398eae32018b336a2464186f82ab`;
  - `pushArgumentsRefuse`: `tools/mods/spatial-guardian/hooks/register.js:168-193 @ 5c06b0c2 sha256:e2bc2770eb13e49b8d84d486bb9d3f75b2ceb13d9c8e5b71acbb3b7f0cc9e37e`;
  - `readingRefuses`: `tools/mods/spatial-guardian/hooks/register.js:212-228 @ 5c06b0c2 sha256:16e24dbf637ac3c6ae708419d78b969cfc17b4dcfb760a17c2d29c28f71c0a87`. Its unbalanced-quote rule is `tools/mods/spatial-guardian/hooks/register.js:215-218 @ 5c06b0c2 sha256:26e41728fa0827ce234e4abf4fe75e4ae27c927e34abf36ff20c7b2485505d7d`, and its rescan and depth cap are `tools/mods/spatial-guardian/hooks/register.js:219-224 @ 5c06b0c2 sha256:58fdf64bf0ab1754d09875d7a3bb0149cdad29eeec3ebf13764d85b87114dca0`.
- **Placement's missing-folder branch**, the cause of the unplaceable over-refusal: `tools/mods/spatial-guardian/hooks/register.js:272-280 @ 5c06b0c2 sha256:69e6b54d5474b77057ad58811f5308d0c48c690587ca241cf6b03e61c7389f9f`.
- **The guard and the hooks:**
  - the Write, Edit and NotebookEdit guard: `tools/mods/spatial-guardian/hooks/register.js:378-391 @ 5c06b0c2 sha256:7f529261e37996c63dc7b482d6e88d08bf09582b28854b49c6ba630a6baade93`;
  - the shell hooks: `tools/mods/spatial-guardian/hooks/register.js:405-418 @ 5c06b0c2 sha256:9985f88652bccc1eae657ef68e8e2ad2e5b3c56ca2d4dd239d2330d0ca118685`;
  - the registrations and their catches: `tools/mods/spatial-guardian/hooks/register.js:457-464 @ 5c06b0c2 sha256:308bc9cfdb35f4d33b199f2aed9c6eba8c2a1dc8c08fd770bd1cec072fc5e9a6`.
- **The module's no-write statement:** `tools/mods/spatial-guardian/hooks/register.js:3-6 @ 5c06b0c2 sha256:795ac31528127276ad8d603516fd5997b51725e7af0e98d28b9abfac9859bd7d`.
- **The README lines this piece corrects:**
  - the no-write sentence: `tools/mods/spatial-guardian/README.md:3 @ 5c06b0c2 sha256:97c3a24af6c9a11bad214d2e5dd096b2a6b746a2816198fd1b8dbadb585c3843`;
  - the G1 row: `tools/mods/spatial-guardian/README.md:13 @ 5c06b0c2 sha256:5aa1ee48b2cb1a9ea72a326b1acab6c96829fbd4d84dbc47521bd08339f5c85d`;
  - G1's over-refusals: `tools/mods/spatial-guardian/README.md:31 @ 5c06b0c2 sha256:9fdf4c1c8a4bfa4125bd10f6456ed55b2a29326041947078f83a6b2444e20d4e`;
  - the new-file sentence that waits on E4: `tools/mods/spatial-guardian/README.md:32 @ 5c06b0c2 sha256:73fbf9dd46f3b24a83fec6f0de53252266008460fd92bf655362af8b595ac27c`;
  - the write audit called primary: `tools/mods/spatial-guardian/README.md:44 @ 5c06b0c2 sha256:65ec3b1de87cc875b3d4aa44a831614ee45a338c9034ff78d921e89e2d970dc3` and `tools/mods/spatial-guardian/README.md:73 @ 5c06b0c2 sha256:23eafd0e0ce5206a4732920031c5ceeed21a8c9d57a47ac093e3c63c1cd292f6`;
  - false refusals logged in the ledger: `tools/mods/spatial-guardian/README.md:69 @ 5c06b0c2 sha256:69faed69c4ca0edc02e58eba518e9246de48a03ea2720eb461733db7569db4f0`.
- **The v0 fail-closed tests whose recorded mutations this piece re-declares:** `tools/mods/spatial-guardian/test/guardian.test.ts:554-571 @ 5c06b0c2 sha256:ad5fe4e5be96448f7fff28c69a21b2e47f4cc20893d4d297cc12622989b0faf0` (T24 and T25). T16's comment is also re-declared, by its test name.
- **The Recorder's derivations, restated and not imported:**
  - its log suffix: `tools/mods/spatial-evidence-recorder/hooks/register.js:21 @ 5c06b0c2 sha256:09c0796c26465297e241cdafb29e67527f1703243d3079d6c9a699eff68a9a97`;
  - its log root: `tools/mods/spatial-evidence-recorder/hooks/register.js:365-375 @ 5c06b0c2 sha256:b9a6a1c0cd9dc77739619dd74dcdc056bfb4959fba8c141156c391e6ddfc03bb`;
  - its one-file-per-record write: `tools/mods/spatial-evidence-recorder/hooks/register.js:383-391 @ 5c06b0c2 sha256:bcf88e4d133e7cc85f171d2ca3872e4a8a626e8b0bfeccb37214b883e3e6a5e0`;
  - its leading-`cd` reading with the Git Bash drive translation: `tools/mods/spatial-evidence-recorder/hooks/register.js:202-208 @ 5c06b0c2 sha256:9b7423b6a88e07020230d7fcb9b6b41275d22144461fe3701e786a4404839ac3`;
  - its in-module sha256: `tools/mods/spatial-evidence-recorder/hooks/register.js:26-29 @ 5c06b0c2 sha256:b1331c01056868b2a9fb44ab1c065685dba05b278419682c84dedef3a277e48a`.
- **G9's protected folders and its allowed build-output folders:** `AI_DEVELOPMENT.md:161-168 @ 5c06b0c2 sha256:1274731d09667c5918b18a1f3d7f6b0ec73a62a90187361ad93aa5467cd805df`.
- **CI:** governance-ci's path filters already include `tools/mods/**`, and no runner runs the plugin tests (the Recorder v0.1 form, §0.5). No workflow changes.

**0.4 P0's ten open items, as this form treats them:**
1. **G7 and AUTONOMY §9.** **Settled by line 2,** which is the human's. G7 refuses every agent pull-request merge, the custodian's §9 merge included, with no exception. §9's auto-merge is not used while Guardian is installed. §9 is not edited, and its suspension goes to the 2026-10-09 window (the direction's step f). The README says so.
2. **G7's reach beyond this repository.** **OPEN-1.**
3. **How G8 finds the user's Claude folder.** **Settled** (§2.5): by `$.env.get` of §7's names, resolved by `$.fs.stat`, and anchored on that folder's resolved path, never on a `.claude` suffix. P0b (iii) decides whether `CLAUDE_CONFIG_DIR` is read.
4. **G8 and shell writes into the user folder.** **Settled: they stay allowed.** The brief names only `claude plugin` and `claude mcp` spellings for the shell side (brief §2.3, the G8 row). The 13 memory appends and the one `rm` are legitimate (P0 §3). The README states the limit.
5. **G9 and the main checkout against a worktree.** **Settled** (§2.6):
   - the base comes from a leading `cd <absolute dir> &&` chain, from `git -C`, or from a named target folder;
   - an unknown base is read as the main checkout;
   - no `agent.spawn` hook is added.
   Grounds: the brief says each rule fails closed; the hooks line stays unchanged (P0 §5); the brief keeps worktree protection beyond G9 out of v1; and every observed subagent call spells its `cd` (P0 §4). The README lists the costs.
6. **G9's data folders.** **Settled:** `target/slice-evidence` and `target/fixtures`, as `AI_DEVELOPMENT.md:161-168` names them. Folders that contain them, and the contents of a data folder, are **OPEN-4**.
7. **The log.** **Settled** (§2.7): one new file per refusal; the root from `$.session.repo()`, with no process call; `validate`'s lines predicted in §5.
8. **G1's heredoc reading.** **Settled** (§2.2): a condition on the unbalanced-quote rule, not a heredoc parser, checked before code by P0b (iv).
9. **The unplaceable-path over-refusal for a new folder.** **OPEN-5.** Meanwhile the README lists it.
10. **The ledger counts four G1 over-refusals; the transcripts show six.** **Settled:** this form records six (P0 §6). The ledger is append-only and is not corrected in place. From the merge, the log counts (§9, Evaluation).
Raised beyond P0: **OPEN-2** (`gh api` merges, against line 2's every agent pull-request merge) and **OPEN-3** (the user-level `.claude.json`).

**0.5 P0b, read-only, before any code.** The worker records four things. The record is **Amendment 1, headed P0b**, class 1, and it is §10's first amendment; nothing is appended before it. A finding that contradicts §2 STOPS the piece (I1, I7, I8).
- **(i) The types at 2.1.288.** The file is `<skill-root>/types/claude-code.d.ts`, checked equal to §0.1's sha256. The worker records:
  - `$.fs.write`'s rejection cases, and any stated bound on its duration;
  - what `$.session.repo()` returns when there is no repository;
  - what `$.env.get` returns for an unset name;
  - the event names and value shapes by which a test's `on` answers `fs.write`, `session.repo` and `env.get`, as v0 Amendment 1, item (v), recorded for the v0 calls.
  Each is cited `<skill-root>/types/claude-code.d.ts:<lines>`.
- **(ii) The CLI spellings at 2.1.289.** From `claude plugin --help`, `claude plugin marketplace --help` and `claude mcp --help` only, the worker records every subcommand, with its aliases, that installs, uninstalls, enables, disables, updates, adds or removes.
- **(iii) The user folder's override.** Whether the 2.1.288 type or reference files name `CLAUDE_CONFIG_DIR`, or any other name, as the user folder's location, with lines.
- **(iv) The offline replay.**
  - What runs it: Node, over a scratch copy of the rules as §2 declares them, outside the repository. It runs no command.
  - (a) P0 §6's six commands, raw and `<profile>`-redacted, through §2.2's G1. The record gives each outcome and the sha256 of each redacted command.
  - (b) Every Bash and PowerShell call in this project's transcripts from 2026-09-20 to the run, through G1 v0, G1 v1, G7, G8 and G9 as declared. G9 runs with M as the main checkout and Node's read-only stat. For each rule the record gives each refused call by time, agent and class (real catch, false alarm, or the 2026-09-28 §9 merge). It reproduces no command text.
- The only `claude` subcommands the worker runs anywhere in the piece are (ii)'s three, `claude --version`, `claude plugin validate` and `claude plugin test`.

## §1. May and may not claim

**May claim**, under `claude plugin test` at 2.1.289 on Windows:
1. G1 refuses every v0 refusal fixture and F38 and F39, and passes F36 (the six recorded over-refusals) and F37.
2. G7, G8 and G9 refuse F40, F42 and F44, and pass F41, F43 and F45.
3. Fail closed: a check that cannot complete in a shell hook, in G8's folder lookup, or in G9's lookups ends in a deny.
4. Each refusal writes exactly one log line with §2.7's fields. An allowed call writes none. A failed write changes neither the outcome nor the reason.
5. `validate` lists only §2.0's hooks, calls and env reads.
6. P0b (iv)'s replay counts. These are a Node run of a scratch copy, not of the engine.
- **Live, only after its E-row:**
  7. E7 to E9 are refused by G7, G8 and G9 at 2.1.289.
  8. E10's log lines.
  9. E11, if the human names it.

**May not claim:**
- Any live behaviour before its E-row. There is no live G1 probe, so the G1 fix is shown live only by the window's log count.
- **For every rule, what G1 does not read:**
  - aliases and scripts;
  - variables, and the output of a substitution;
  - `eval`, and brace expansion;
  - ANSI-C quoting (`$'…'` is read as plain single quoting, so an escaped quote inside it can desync the reader, as in v0);
  - a backslash inside a command word, other than before a quote;
  - PowerShell's escapes;
  - arguments supplied by `xargs`;
  - work done from code (Node, Python).
- **For G7:** `pull.rebase` configuration, and `-c pull.rebase=…`; `gh api` merges and MCP merge tools (unless OPEN-2 rules them in).
- **For G8:**
  - writes into the user folder by Bash or PowerShell;
  - the user-level `.claude.json` (unless OPEN-3 rules it in);
  - the engine's LSP recommendation dialog and account sync, `/plugin`, and the human's own terminal (brief §2.3).
- **For G9:**
  - a call's working directory, which it reads only as §2.6 states;
  - `find -delete`, rimraf, and deletes run from code;
  - containing folders, and the contents of data folders (unless OPEN-4 rules them in).
- **For the log:**
  - citability: a log line is not citable evidence (brief §2.2; window item E);
  - a line for a refusal by overrun;
  - two lines for two identical refusals in the same millisecond;
  - any bound on a hung write.
- Reach beyond this repository is as OPEN-1 rules.
- Builds other than 2.1.289 (the type reads are 2.1.288's); macOS; Linux; the installed copy's isolation, since E0 recorded a read by reference.
- Any latency figure, and any docs/08 row.

**Out of scope** (brief §2.3, its not-in-v1 bullet, `state/directives/MODS-V1-2026-10-05.md:47 @ 5c06b0c2 sha256:c8b28b58d98943cb22729b27fcc8bb88fc7b42ccfc912f84e64e1254daf69442`):
- G5; any approval or override path; the Workboard; worktree protection beyond G9;
- OPEN-5's narrowing, unless ruled in;
- AUTONOMY §9's text;
- the Recorder; `tools/mods/.claude-plugin/marketplace.json`, `plugin.json`, `hooks.json` and `continuity.mjs`;
- `scripts/hooks/`, and every workflow.

**Scope limits:**
- no wire change, and no ADR cited as governing or amended;
- ADR-006 does not apply, because this is repository tooling;
- no configuration, `userConfig`, option or flag: every new code path is reached by a real tool call.

**Seams**, each against the other side's actual interface:
- **register.js to the mod API.** Build 2.1.288's types (v0 §0.2; P0 §1; P0b (i)), proven at 2.1.289 by `claude plugin test`, which runs the engine's dispatch and catch path. E7 to E10 are the end-to-end proof from the real shape.
- **G1, G7, G8 and G9 to the command text agents actually write.** The real shapes are P0 §2 to §4's transcript calls, and P0 §6's six commands, which F36 holds byte-copied. P0b (iv) replays them before code.
- **The log to its reader.** The reader is the custodian's evaluation by hand (§9). No reader code lands.
- **The Recorder.** There is no seam in code. G7 to G9, like G1, read a command word at any token of a segment. So a repeat-runner tail holding a G1, G7, G8 or G9 spelling is refused: the Recorder v0.1 form's §2.8 left this to this form.
- **Callers:** every new function's caller is a refusing hook. No `pub`-style export is added beyond `register`.

## §2. The design, stated before code

**2.0 Files and packaging.**
- **Changed files:** `tools/mods/spatial-guardian/hooks/register.js`, `tools/mods/spatial-guardian/test/guardian.test.ts` and `tools/mods/spatial-guardian/README.md`. Nothing else.
- **The hooks line is unchanged**, byte for byte, from P0 §5's baseline.
- **The calls line** adds `$.env.get`, `$.fs.write` and `$.session.repo` to v0's six calls. `$.process.run` stays git-only, with v0's timeout. G7, G8 and G9 make no process call.
- **Env reads** are exactly §7's names. There are no env writes.
- **The worker:**
  - builds in a worktree under `C:\dev\wt\`;
  - writes test text and record text with the Write tool, because the live v0 G1 reads Bash text;
  - never runs a search for a G1, G7, G8 or G9 spelling through Bash; it uses the Grep tool.

**2.1 Common design.** v0 §2.1 stands, except:
- **(a) Refuse only.** Unchanged. The one write is §2.7's log.
- **(b) Fail closed.** Each refusing hook decides inside one try:
  - a throw anywhere in the decision becomes `{ deny: CATCH_REASON }`, with rule id `catch`;
  - only after the decision, and only for a refusal, the hook logs (§2.7);
  - it then returns the decided `{ deny }`;
  - `next(e)` is called outside the try, and only when no rule refuses;
  - every registration keeps v0's `.catch(() => ({ deny: CATCH_REASON }))` as the net for an overrun (v0 §8 item 2).
- **(c) Order.** The first refusal wins, and its rule is the one logged:
  - Bash hook: G1, G7, G8, G9, then `next(e)`;
  - PowerShell hook: G6 (when `agentId` is set), G1, G7, G8, G9, then `next(e)`;
  - Write, Edit and NotebookEdit: G6 (when `agentId` is set), placement, G2, G4, G8, G3, then `next(e)`.
- **(d) Reasons.** Each reason holds no path from the call and states Guardian's own fact (round 7; v0 §2.1(f)).

**2.2 G1: the unbalanced-quote refusal narrowed** (brief §2.1, `state/directives/MODS-V1-2026-10-05.md:16-25 @ 5c06b0c2 sha256:9d3ce9b9e338739661e53117cece4b4b73c12a79c338decf6dc46d295e5807d0`; window item G; P0 §6).
- **The cause** (P0 §6). An odd quote in heredoc text leaves the splitter's quote state open to the end of the command (§0.3). The last segment then cannot be tokenised, and v0 refuses it whenever its text holds `push` (§0.3, the unbalanced-quote rule).
- **The change, the only one to G1's refusal set.** That refusal now stands only when v0's condition holds **and** the call's words hold the **G1 sequence**: a word naming git, then later a word `push`, then later a forcing word.
- **How the scan reads:**
  - **The call's words:** the hook's own `e.command`, the whole text (every line, heredoc bodies, comments and quoted text alike). Every `'` and `"` is deleted. Then every whitespace character, `;`, `&`, `|`, `(`, `)`, `{`, `}`, `<`, `>` and the backtick is read as a break.
  - **A word naming git:** v0's `isGit` on the word (§0.3).
  - **`push`:** the word, with every `\` deleted, equals `push`.
  - **A forcing word:** the word, with every `\` deleted, is one that v0's `pushArgumentsRefuse` refuses when given that word alone (§0.3).
  - The scan always reads `e.command`, also when the unbalanced segment sits in a rescanned quoted token.
- **Unchanged:**
  - both readings and the segment check;
  - the quoted-token rescan and its depth cap, both of which still refuse without the scan;
  - `pushArgumentsRefuse`, `MAX_RESCAN_DEPTH` and `G1_REASON`;
  - both registrations.
  The refusal set is a subset of v0's.
- **Newly allowed, exactly:** a call that v0 refuses only through the unbalanced-quote rule (in neither reading by the segment check, the rescan or the depth cap), and whose words hold no G1 sequence. There are three shapes, each with a fixture (F37) and a test (T43):
  - **N1,** `push` appears only inside a longer word, such as `writes.push(` (P0 §6 #2, #4, #5, #6);
  - **N2,** a git … `push` sequence with no forcing word after it, such as a plain `git push` after a heredoc whose body holds an apostrophe (#1);
  - **N3,** `push` with no git word before it, as in prose (#3).
- **Why none of them can run a force or delete spelling.**
  - A git push run by a shell (the one running the call, or one a heredoc body feeds) is written in the text as a word naming git, then `push`, then its arguments, in that order. A force or delete spelling is one of those arguments.
  - Deleting quotes keeps each such word whole, as the shell's own quote removal does.
  - A break character inside a quoted argument can only cut the argument after its first part. Every forcing test either tests the start of a word, or tests a whole word that holds no break character.
  - So a call holding a literal force or delete spelling holds the G1 sequence, wherever in the text it sits.
  - What the scan does not read is what v0 does not read (§1).
- **What stays refused** (brief: not allowed to change):
  - every v0 refusal made by the segment check, the rescan or the depth cap;
  - every unbalanced-quote refusal whose call holds the G1 sequence. That includes a spelling inside a heredoc body, before the heredoc or after it, and text that is never run but names a spelling (the README's kept over-refusal).
- **Why no heredoc parser.**
  - Bodies stay read as text, so nothing leaves what G1 reads.
  - The narrowing is one condition on one rule, so the subset property can be checked line by line.
  - P0 §6's alternative, splitting on heredoc terminators, would add a partial shell parser, and its mis-reads would move text between contexts.
- **Checked before code** (P0b (iv)(a)):
  - #1 and #3 must pass (I7);
  - #2, #4, #5 and #6 are predicted to pass. A miss is class 2, and that shape joins the README's over-refusal list.

**2.3 The shared reader for G7 to G9** (brief §2.3, its reading bullet, `state/directives/MODS-V1-2026-10-05.md:43 @ 5c06b0c2 sha256:daf88afd2d940477e107135913c69082ebd8d26dfdf9a33a35921513e6eade00`).
- G1's reader is parameterised by rule. G1 is one instance of it, and its behaviour is exactly §2.2's.
- **For each rule, the reader:**
  - splits and tokenises both readings, as G1 does;
  - finds the rule's command word at any token of a segment, so that `sudo`, `env X=1`, `timeout N` and a runner tail are read;
  - rescans a quoted token that holds the rule's trigger words, under G1's depth cap;
  - in a segment that cannot be tokenised, refuses only when the call's words (read as §2.2 reads them, with any words between) hold the rule's sequence.
- Each rule's segment check, trigger and sequence follow. Their spellings are §7's values.

**2.4 G7** (brief §2.3, `state/directives/MODS-V1-2026-10-05.md:39 @ 5c06b0c2 sha256:ba96aee154b87505c3ab75581075e97641d5c59160bc0de6de3e1b75f477fda1`).
- **Refuses, from any agent, the main loop included:**
  - `gh` or `gh.exe`, then `pr`, then `merge` as the next word that is not an option or an option's value. `-R <x>`, `--repo <x>` and `--repo=<x>` are skipped. Every form is refused, `--help` included;
  - git (with its global options skipped, as in G1), then `rebase`. Every form is refused, `--abort`, `--continue` and `--help` included;
  - git, then `merge`, then later in the segment `--squash` or a proper prefix of it;
  - git, then `pull`, then later in the segment `--rebase`, `--rebase=<any value>`, a proper prefix of `--rebase`, `-r`, or a short-option cluster holding `r`.
- **Trigger:** a quoted token that holds git and one of `rebase`, `merge` or `pull` as words, or holds `gh` and `merge`.
- **Sequence:** git…rebase; gh…pr…merge; git…merge…squash-word; git…pull…rebase-word.
- **No `$` call.**
- **Over-refusals, for the README:**
  - the §9 docs-only merge, which line 2 suspends;
  - `--help` forms;
  - `git rebase --abort`, `--continue` and `--skip`;
  - `git pull --rebase=false`;
  - an ambiguous abbreviation such as `--s`;
  - a commit message or other text that names a spelling, and is never run;
  - other repositories' rebases, as OPEN-1 rules.

**2.5 G8** (brief §2.3, `state/directives/MODS-V1-2026-10-05.md:40 @ 5c06b0c2 sha256:4637106af8df2727849bdb62fd3d299d72da1924b7527eb369358e91c4c92252`, and its reach bullet, `state/directives/MODS-V1-2026-10-05.md:45 @ 5c06b0c2 sha256:46a1f3feebb35eed0759eebe42008a2536ba4a5a7fff1b7378d71795dc54e79c`).
- **Command side, from any agent.** Refused:
  - `claude` or `claude.exe`, then later in the segment `plugin`, then later a plugin or marketplace action word;
  - `claude`, then later `mcp`, then later an MCP action word.
  - The action words, with P0b (ii)'s aliases, are §7's values. `--help` forms are included (E8).
- **Allowed on the command side:** `plugin list`, `plugin validate`, `plugin test` and group-level `--help`; `mcp list` and `mcp get`; `claude --version`.
- **Trigger:** a quoted token that holds `claude` and `plugin` or `mcp`.
- **Sequence:** claude…plugin…action; claude…mcp…action.
- **Path side, from any agent.** Let H be the user's Claude folder:
  - its location: the folder P0b (iii) names, when that is set; otherwise `USERPROFILE` plus `/.claude`;
  - resolved once per load by `$.fs.stat(H, { resolve: true })`; on ENOENT, its normalised spelling is used. It is cached on success only.
  - A Write, Edit or NotebookEdit is refused when its placed, normalised path is `<H>/settings*.json`, directly under H, or lies at or under `<H>/plugins`, `<H>/skills`, `<H>/agents`, `<H>/commands` or `<H>/hooks`.
  - G8 anchors on H's resolved path only. The repository's `.claude/settings.json`, `.claude/agents/` and `.claude/worktrees/` pass.
  - Deliberately allowed: everything under `<H>/projects/` (memory and tool results), and everything else under H that is not listed.
  - When no name yields a value, G8 refuses every Write, Edit and NotebookEdit (fail closed). E11 checks live that an ordinary Write passes.
- **`$` calls:** `$.env.get` (§7's names) and `$.fs.stat`.
- **Over-refusals, for the README:**
  - a settings change the human asks the custodian to make by a tool write (the human makes it himself);
  - `--help` forms;
  - text that names a spelling.

**2.6 G9** (brief §2.3, `state/directives/MODS-V1-2026-10-05.md:41 @ 5c06b0c2 sha256:1a9be87359676aa007448fc127a2a1daa45abcc2238dc5bcdd5244ff7d53cc14`, and its reach bullet, `state/directives/MODS-V1-2026-10-05.md:46 @ 5c06b0c2 sha256:16e5d4796532ccf59db1c10b1ce21d65512da849bbbfbae34c0a28fe880b1620`).
- **M, the main checkout:**
  - the root `$.session.repo()` returns, which is the main tree's also for a worktree (P0 §5);
  - looked up by one function that the log shares (§2.7), cached on success;
  - with no repository, G9 refuses nothing.
- **The protected set:** `M/target`, `M/target/slice-evidence` and `M/target/fixtures`. Each is compared on its resolved real path when it exists, and otherwise on its normalised spelling.
- **Not protected:**
  - `M/target/debug`, `M/target/release` and `M/frontends/shell/src-tauri/target`;
  - any worktree's own target;
  - anything under `M/.claude/worktrees/`.
- **The base B of a segment.**
  - B is the directory of the command's first segment, when that segment is `cd <dir>` with one absolute argument holding no `$`, backtick, `~`, `*` or `?`. A Git Bash `/c/…` spelling is read as `c:/…`, as the Recorder's leading-`cd` reading does (§0.3, restated, not imported).
  - B applies only when every separator in the first reading, from that `cd` to the segment, is `&&`. Otherwise B is unknown.
  - **An unknown B is read as M.**
  - `git -C <dir>` gives that one call's base.
  - Grounds: a `tool.call` event carries no working directory (P0 §4), the main loop's directory persists between calls without appearing in any event, and the brief says each rule fails closed.
- **Refused, from any agent:**
  1. **`cargo … clean` with no package.** That is: no `-p`, `-p<x>`, `--package` or `--package=<x>` later in the segment. It passes only when the segment names its target folder (`--target-dir <d>` or `--target-dir=<d>`, or a `CARGO_TARGET_DIR=<d>` word before `cargo`), and `<d>`, located against B, is not `M/target`. `--dry-run`, `--release`, `--profile` and `--doc` are included in the refusal. Grounds: a session's environment can name main's target, as P0 §4's two calls show, and G9 cannot read that environment.
  2. **`git … clean` with a force flag** (`-f`, `--force`, or a short cluster holding `f`), when its base (from `-C`, else B, else M) is M, or lies under M outside `M/.claude/worktrees/`.
  3. **A recursive delete:**
     - the command word: `rm`, `rmdir`, `rd`, `remove-item`, `ri`, `del` or `erase`, in any case;
     - with a recursive option later in the segment: `--recursive`; any option word other than `--` that holds `r` or `R`; or `/s`;
     - and an operand that, located against B, resolves to a protected member; or an operand holding `*`, `?` or `[` whose folder part resolves to M or to `M/target`.
     - Operands are the non-option words after the command word, with `-Path` and `-LiteralPath` values included. For `rd` and `rmdir`, `/s` and `/q` in either case are options.
     - An operand holding `$`, a backtick or `~` is not read.
     - An operand that does not exist (ENOENT) deletes nothing, and passes.
- **Trigger:** a quoted token that holds `cargo` and `clean`; or git and `clean`; or a delete word and `target`.
- **Sequence:**
  - cargo…clean;
  - git…clean…force-word;
  - delete-word…recursive-word…a word that, after `\`→`/` and lower-casing, ends in `target`, or holds `target/slice-evidence` or `target/fixtures`, or holds a glob character.
- **`$` calls:** `$.session.repo` and `$.fs.stat`. None is made unless the segment check finds a candidate. A stat failure other than ENOENT throws, and the hook fails closed.
- **No `agent.spawn` or `turn.step` hook.**
- **Over-refusals, for the README:**
  - a bare `cargo clean` anywhere. Name the target folder, or remove the worktree's target folder with a delete;
  - `--dry-run`, `--release`, `--profile` and `--doc`;
  - a relative `rm -rf target`, a glob under `target`, or a forced `git clean`, without a leading `cd <absolute dir> &&`. The main loop's persisted directory counts as unknown;
  - a leading `cd` joined by `;`, `||` or `|`;
  - PowerShell's `-Force`, read as recursive;
  - text never run.

**2.7 The refusal log** (brief §2.2, `state/directives/MODS-V1-2026-10-05.md:27-33 @ 5c06b0c2 sha256:aa45ff8ef16998707e155fe272b0b0766eb931a2bb4e82a98edd440f4cdc4b00`).
- **When:** in each refusing hook, after the decision (§2.1(b)), and only for a refusal. The write is awaited inside its own try, which swallows every failure. The hook then returns the decided `{ deny }`.
- **Where:** `<parent of M>/<name of M>-local/guardian`, with M from §2.6's lookup. This is beside the Recorder's log root (P0 §5), whose derivation is restated, not imported. With no repository, or a root that cannot be derived, no line is written.
- **The file:** one new file per refusal, `<root>/<YYYY-MM-DD>/<HHMMSSmmm>-<16 hex of the line's sha256>.json`, holding one JSON line and an LF, written by one `$.fs.write`. This is the Recorder's shape. There is no append, because `$.fs` has none (P0 §5), and no read-then-write.
- **The fields:**
  - `schema` (§7);
  - `time` (the decision's UTC time, in ISO form);
  - `rule` (§7's ids);
  - `tool` (`e.tool`);
  - `agent`: the row's `type` from `$.agent.list()` when `agentId` is set; `main` when it is unset; `unavailable` when no row matches or the list rejects;
  - `target_sha256`: the hex sha256 of the UTF-8 `e.command` for Bash and PowerShell, or of `file_path` or `notebook_path` as received for the others; `unavailable` when it is not a string;
  - `reason` (the deny text).
  Nothing else: no command, path, content or argument.
- **Not logged:**
  - a refusal by overrun, because the engine's `.catch` runs no hook code;
  - anything for an allowed call;
  - anything from N1.
- **Failure:** a write that rejects changes nothing. A hung write delays the refusal, and the call still does not run (§1).
- **Standing:** a log line is not citable evidence (brief §2.2; window item E).

**2.8 The README** states, with no quotation:
- **R-a:** the no-write sentence is replaced. Guardian writes one local log file per refusal, outside the repository, and nothing else (brief §1, its last bullet).
- **R-b:** the over-refusal list is brought up to what remains:
  - G1's kept shapes (§2.2);
  - G7's, G8's and G9's lists (§2.4 to §2.6);
  - the unplaceable new-folder Write (P0 §6; v0 Amendment 10), unless OPEN-5 rules it out.
- **R-c:** the new-file sentence, which waited on E4, now states E4's pass at 2.1.289 (v0 Amendment 9).
- **R-d:** both lines that call the write audit primary are narrowed. E5 passed at 2.1.289 (v0 Amendment 9), so the audit is now the backstop (brief §2.1's README bullet).
- **R-e:** false refusals are counted from the log. A log line is not citable evidence.
- **R-f:**
  - G7, G8 and G9 rows, each with its ruling;
  - each rule's limits from §1;
  - each rule's reach, as OPEN-1 rules;
  - line 2's suspension of §9 while Guardian is installed.
- **R-g:** the log: its folder, its fields, the not-logged cases, and its standing.
- **R-h:** G1's limits add ANSI-C quoting.
- **R-i:** record text naming any rule's spelling is written with the Write tool.
- **R-j:** the title names v1, and both forms are named as governing.

**2.9 Portability** (R3, `docs/PREREGISTRATION-TEMPLATE.md:177 @ 5c06b0c2 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0`):
- **Owning boundary:** `place` and `normalise` (v0), plus the new user-folder lookup, G9's base and operand location, and the log root.
- **Windows:** supported. It is tested by `claude plugin test` with `\`, `/`, mixed-case, drive and Git Bash spellings, and live by E7 to E11.
- **macOS and Linux:** unavailable. Guardian is not installed there, and no claim is made.
- **R1:** one matcher on every platform.
- **R2 and R4:** no `process.platform` branch. Reading `USERPROFILE` is not a branch: where it is unset, G8 fails closed, as §2.5 declares.
- **R5:** no product level is claimed. **R6:** no platform ignore.

**2.10 Never done:** v0 §2.9 stands, except for §2.7's one write.

## §3. Fixtures and predicted outcomes

The engine's answers are stubbed with the test's `on`. `R` is `C:\r` or `c:/r`, `M` is `C:/r`, and `H` is `C:\u\.claude`, with `USERPROFILE` answered as `C:\u`. A `/` in a cell marks a line break inside one command.

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F36 | P0 §6's six commands, #1 to #6: byte-copied by script from the transcripts, `<profile>`-redacted as P0 §6 does, each a JSON string literal whose sha256 Amendment 1 (P0b) names | none | `next(e)` |
| F37 | N1: `git add -A && cat > a.js <<'EOF'` / `// don't` / `opts.push('-f')` / `EOF`. N2: `git commit -F - <<'EOF'` / `it's done` / `EOF` / `git push -q origin main`. N3: `cat >> n.md <<'EOF'` / `the custodian's plain push --force ran` / `EOF` | none | `next(e)` |
| F38 | `cat > n.md <<'EOF'` / `it's` / `git push --force origin main` / `EOF`; `git commit -F - <<'EOF'` / `#170's note` / `EOF` / `git push -f origin main`; `bash <<'EOF'` / `# don't` / `git push origin :old` / `EOF`; `cat <<EOF` / `it's` / `$(git push --delete origin x)` / `EOF`; `git commit -F - <<'EOF'` / `don't run git push --force` / `EOF` | none | refused, G1 |
| F39 | `git push origin main` nested in quoted `bash -c` strings past `MAX_RESCAN_DEPTH`, built by a helper | none | refused, G1 (the depth cap) |
| F40 | `gh pr merge 138 --merge`; `gh pr merge --help`; `gh -R o/r pr merge 1 --squash`; `gh pr --repo o/r merge 1`; `git rebase origin/main`; `git -C x rebase -i HEAD~2`; `git rebase --abort`; `git merge --squash f`; `git merge --sq f`; `git pull --rebase origin main`; `git pull --rebase=merges`; `git pull -r`; `git pull -qr`; `git pull --reb`; `sudo git rebase main`; `(git rebase main)`; `x=$(gh pr merge 1)`; `node scripts/evidence/repeat.mjs 2 -- git rebase main`; `bash -c "git rebase main"`; PowerShell `git rebase main`; `cat <<'EOF'` / `it's` / `EOF` / `git rebase main` | none | refused, G7 |
| F41 | `gh pr view 138`; `gh pr list`; `gh pr create --title t --body "merge commit, not a squash or rebase"`; `gh api repos/o/r --jq .allow_rebase_merge`; `git merge origin/main`; `git merge --no-ff origin/main`; `git pull -q --ff-only`; `git pull -q`; `git pull --no-rebase`; `git log --grep rebase`; `git config --get pull.rebase`; `cat <<'EOF'` / `it's merged` / `EOF` / `git pull -q` | none | `next(e)` |
| F42 | Bash: `claude plugin install spatial-guardian@spatial-ide-mods --scope user`; `claude plugin install --help`; `claude plugin uninstall x`; `claude plugin enable x`; `claude plugin disable x --scope user`; `claude plugin update x`; `claude plugin marketplace add C:/r/tools/mods`; `claude plugin marketplace remove x`; `claude plugin marketplace update`; `claude mcp add x -- c`; `claude mcp remove x`; and P0b (ii)'s aliases. Paths: Write `C:\u\.claude\settings.json`; Edit `c:/U/.Claude/settings.local.json`; Write `C:\u\.claude\plugins\x\y.json`, `…\skills\s\SKILL.md`, `…\agents\a.md`, `…\commands\c.md` and `…\hooks\h.js`; NotebookEdit `…\skills\n.ipynb`; a `worker` row's Write to `…\agents\a.md` | env, stat | refused, G8 |
| F43 | `claude plugin list`; `claude plugin validate tools/mods`; `claude plugin test tools/mods/spatial-guardian`; `claude plugin --help`; `claude mcp list`; `claude --version`; Write `C:\u\.claude\projects\p\memory\MEMORY.md`; Write `C:\u\.claude\pluginsx.md`; Edit `C:\r\.claude\settings.json`; Write `C:\r\.claude\agents\worker.md`; Edit `C:\r\.claude\worktrees\w\x.js`; Bash `cat >> C:/u/.claude/projects/p/memory/x.md` | env, stat | `next(e)` |
| F44 | `cargo clean`; `cargo clean --dry-run`; `cargo clean --release`; `cd C:/dev/wt/x && cargo clean`; `cd C:/dev/wt/x && CARGO_TARGET_DIR=C:/r/target cargo clean`; `cargo clean --target-dir C:/r/target`; `git clean -fdx`; `cd C:/r && git clean -f`; `git -C C:/r clean -fd`; `rm -rf target`; `rm -rf C:/r/target`; `rm -r C:\r\target\slice-evidence`; `rm -rf /c/r/target/fixtures`; `rm -rf target/*`; `rm -rf *`; `cd C:/dev/wt/x; rm -rf target`; `cd C:/dev/wt/x && echo a \| rm -rf target`; PowerShell `Remove-Item -Recurse -Force C:\r\target`; `ri -r target`; `cmd /c rd /s /q target`; `node scripts/evidence/repeat.mjs 1 -- cargo clean`; `cat <<'EOF'` / `it's` / `EOF` / `rm -rf C:/r/target` | session.repo `C:/r`; stat | refused, G9 |
| F45 | `cargo clean -p spatial-skp`; `CARGO_TARGET_DIR=C:/r/target cargo clean -p spatial-kernel`; `cargo clean --target-dir D:/wt-targets/x`; `CARGO_TARGET_DIR=D:/wt-targets/x cargo clean`; `git worktree remove C:/dev/wt/x && rm -rf D:/wt-targets/x`; `rm -rf C:/r/target/debug C:/r/target/release`; `rm -rf C:/r/frontends/shell/src-tauri/target`; `cd C:/dev/wt/adr && rm -rf target`; `rm -rf renderer/bundle-viewer/dist`; `rm -rf node_modules`; `git clean -ndx`; `cd C:/dev/exp/clone && git clean -fdq`; `cd C:/r/.claude/worktrees/w && git clean -fd`; `rm -rf "$S/x"`; `rm target/x.txt`; `rm -rf C:/r/target/gone` (ENOENT) | as F44 | `next(e)` |
| F46 | (a) Bash `rm -rf target` and PowerShell `Remove-Item -Recurse target`, with `session.repo` rejecting; (b) Write `C:\r\notes.md`, with `env.get` rejecting; (c) Bash `rm -rf C:/r/target`, with its stat rejecting EACCES | as stated | refused, `CATCH_REASON` |
| F47 | a main-loop G1 refusal (F1); a lead-data G6 refusal (F19); a `worker` row's G7 refusal; F46 (b) | `fs.write` recorded; session.repo `C:/r` | one write each, under `C:/r-local/guardian/<day>/`, with §2.7's fields |
| F48 | Bash `git status`; Write `C:\r\docs\02_Architecture.md`; main-loop PowerShell `git status` | `fs.write` armed | no write |
| F49 | F47's G1 refusal with `fs.write` rejecting; the same with `session.repo` answering no repository | as stated | refused, `G1_REASON`; no write |

## §4. Tests, one mutation each

**How a mutation is observed** (round 25, item 2 (c)):
- Apply the mutation, run `claude plugin test tools/mods/spatial-guardian`, record the failing test by name in its `// RECORDED MUTATION:` comment with the commit and `claude --version`, then revert.
- A `verify-mutation` run is not an observation.
- **v0's comments stay** as records of their own commits. A v1 observation is appended as a new line beneath each one (§8 item 12).

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T42 | `G1 allows the six recorded over-refusals` | F36 | the scan condition dropped from the unbalanced-quote rule |
| T43 | `G1 allows push inside a longer word, a plain push after an odd quote, and push with no git before it` | F37 | the scan also breaks words at `.` |
| T44 | `G1 still refuses every force or delete spelling, after an odd quote and inside a heredoc body` | F1–F7, F30, F31, F38 | the scan's forcing test reads only `--force` and `-f` |
| T45 | `G1's depth cap still refuses without the scan` | F39 | the scan condition applied at the depth cap |
| T46 | `G7 refuses agent merges and history rewrites in every declared spelling` | F40 | `git pull`'s short-cluster check dropped |
| T47 | `G7 allows plain pulls, merge commits, pull-request reads and text that names a rebase` | F41 | `git merge` refused without its squash check |
| T48 | `G8 refuses plugin, marketplace and MCP changes on the command line` | F42 (commands) | `add` and `remove` dropped from the action words |
| T49 | `G8 refuses a write at the user folder's settings, plugins, skills, agents, commands and hooks, in every spelling` | F42 (paths) | a case-sensitive compare against H |
| T50 | `G8 allows plugin reads, the user folder's projects and the repository's .claude folders` | F43 | G8 anchored on a `/.claude/` segment followed by a location name |
| T51 | `G9 refuses wholesale cleans and recursive deletes of the main checkout's target and data folders` | F44 | B carried across a `;` |
| T52 | `G9 allows package cleans, build-output deletes, worktree targets and named target folders` | F45 | the leading `cd` ignored, so every relative operand is read against M |
| T53 | `a shell hook whose check cannot complete is refused by its catch, on Bash and PowerShell` | F46 (a) | the shell hooks' in-hook catch returns `next(e)` |
| T54 | `G8 refuses when the user folder cannot be read` | F46 (b) | a rejected env read taken as no user folder, and the write allowed |
| T55 | `G9 refuses when an operand cannot be looked up` | F46 (c) | any stat failure read as nothing to delete |
| T56 | `each refusal writes one log line with the declared fields and no command, path or content` | F47 | the record carries the command or path in place of its sha256 |
| T57 | `an allowed call writes no log line` | F48 | the log written before the decision, on every call |
| T58 | `a failed log write leaves the refusal unchanged` | F49 | the log write moved outside its own try |

- **v0 tests, re-declared.**
  - T16, T24 and T25 share one new mutation: the Write, Edit and NotebookEdit hook's in-hook catch returns `next(e)`. Their v0 mutations act on the `.catch`, which §2.1(b) now leaves to overruns.
  - Every other v0 plugin-test mutation (T1–T34, T37–T41) is re-observed at the observation commit, because G1's reader, the guard and the shell hooks change.
  - T35 and T36 do not change.
- **E-rows,** live, after the merge, in the main checkout at the merge commit, and after the human's `/reload-plugins`.
  - **When they run:** each runs only if the human's typed merge approval names it.
  - **How they are recorded:** the custodian records each as a class 1 row on main. Texts are byte-copied by script. Folders outside the repository are named in words.
  - **Preconditions:**
    - the reload's output;
    - `claude plugin list`'s Read-from line for Guardian, unchanged from v0 Amendment 8, E0;
    - the build, read by v0 §4's method. An engine other than 2.1.289 fires I2.
  - **E7:** a main-loop Bash `gh pr merge --help`. Predicted: G7's reason. It is harmless if not refused, because it prints help.
  - **E8:** a main-loop Bash `claude plugin install --help`. Predicted: G8's reason. It is harmless, for the same reason.
  - **E9:** a main-loop Bash `cd <the main checkout> && cargo clean --dry-run`. Predicted: G9's reason. It is harmless: a dry run removes nothing, and a cargo without that flag rejects it before any removal.
  - **E10:** the guardian log folder gains exactly one file for each of E7 to E9, each with:
    - rule G7, G8 or G9; tool Bash; agent `main`;
    - a `target_sha256` equal to the sha256 of the command sent, recomputed by script from the transcript's tool input;
    - a `reason` equal to the tool result's text.
    A main-loop Bash `git --no-optional-locks status --porcelain`, made beside them, adds no file. This is checked by the folder's file count before and after.
  - **E11** (beyond the brief's list; it runs only if named): a main-loop Write that creates a new file in the session scratchpad passes. This shows G8's live user-folder lookup does not refuse an ordinary write. It is recorded as v0 Amendment 3's E4 was.
  - **No live G1 probe.** No probe writes into the repository.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- T1–T34 and T37–T58 pass at the head. Each new test fails under its mutation, and each re-observed v0 mutation fails as recorded. T35 and T36 pass, unchanged.
- **`validate`,** on `tools/mods/spatial-guardian` and on `tools/mods`, text and `--json`, exits 0 with the one `version` warning. Predicted lines, not a quotation:

```text
  ❯ ./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}
  ❯ ./register.js calls: $.agent.list (via g6Refusal), $.env.get (via userClaudeFolder), $.fs.read (via g3Refuses), $.fs.stat (via place), $.fs.write (via logRefusal), $.process.run, $.session.messages (via g6Refusal), $.session.repo (via mainTree), $.session.usage (via contextFill)
  ❯ ./register.js env writes: nothing
  ❯ ./register.js env reads: CLAUDE_CONFIG_DIR, USERPROFILE
```

  - The hooks line is byte-identical to P0 §5's baseline.
  - The env reads line is `USERPROFILE` alone if P0b (iii) finds no override name.
  - A difference confined to a `(via …)` annotation is class 2. Anything else is I3.
- **P0b (iv):**
  - #1 and #3 pass (required); #2, #4, #5 and #6 pass (predicted);
  - in the replay window, G7 refuses one call, the 2026-09-28 §9 merge, and G8 and G9 refuse none (P0 §2 to §4). A different count is class 2, and its shapes join the README.
- E7 to E11 come out as §4 predicts.

**Declared unchanged:**
- every path outside §7's list, among them:
  - `continuity.mjs`, `hooks.json`, `plugin.json`, `.gitignore` and the marketplace;
  - `scripts/hooks/`, the Recorder and every workflow;
  - `AUTONOMY.md`, `AI_DEVELOPMENT.md` and every agent definition;
  - the v0 form;
- N1;
- G2, G3, G4 and G6, with their reasons, and their order among themselves;
- v0's reasons, `PROCESS_TIMEOUT_MS` and `MAX_RESCAN_DEPTH`.

**Invalidators (stop, to the custodian):**
- **I1:** P0b contradicts §2: a call is untyped or cannot be answered in the test kit, or `$.session.repo()` is not the main tree for a worktree.
- **I2:** a run of record at a build other than 2.1.289 (v0 §5 I2's method).
- **I3:** `validate` shows a hook, call or env name outside §2.0 and §7.
- **I4:** a rule needs a call outside §2.0.
- **I5:** §7's file count is exceeded.
- **I6:** any step would install, enable, load or reload a mod, add a marketplace, start a session, write under the user's Claude folder, or write into `tools/mods/spatial-guardian/` or `tools/mods/.claude-plugin/` in the main checkout. Or, before the merge, any agent would run a call G7, G8 or G9 targets.
- **I7:** in the replay, #1 or #3 is refused under §2.2.
- **I8:** in the replay, G7, G8 or G9 refuses a flow the human performs through the custodian, other than the §9 merge that line 2 settles.
- **I9:** a v0 assertion (T1–T41) cannot pass unchanged.
- **I10:** an OPEN ruling adds work. Its §2 shape, tests and §8 items enter by class 9 (or class 5 for a narrowing) before any of its code.

**Falsification:**
- an F38, F39, F40, F42, F44 or F46 call reaches `next(e)`;
- an F36, F37, F41, F43 or F45 call is refused;
- a log write on an allowed call, or before a decision;
- a failed write that changes the outcome or the reason;
- a record holding a command, a path or content.

## §6. Instruments

Assertions only:
- deny or `next(e)`, and the reason text;
- stub arguments and call counts;
- written paths and lines;
- `validate`'s lines;
- `claude --version`, `node --version` and `git --version`;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with its commit (round 15 (c)).
There is no measurement.

## §7. Declared values and ceilings

- **Reasons.** Each starts `spatial-guardian <id>:`, holds no path from the call, and is written as one sentence for the human to sight before he approves. In paraphrase:
  - `G7_REASON`: a merge is the human's click, and an agent never rewrites history;
  - `G8_REASON`: installing, enabling or configuring plugins, marketplaces, MCP servers or the user's Claude settings is the human's own act;
  - `G9_REASON`: the main checkout's target holds fixtures and evidence and is never cleaned wholesale.
  v0's reasons are unchanged.
- **The log:**
  - suffix `-local/guardian`;
  - `schema` = `spatial-guardian/v1`;
  - §2.7's file name and fields;
  - rule ids `G1`, `G2`, `G3`, `G4`, `G6`, `G7`, `G8`, `G9`, `unplaceable` and `catch`;
  - agent values: the row's type, `main` or `unavailable`.
- **G1's scan:** §2.2's break characters, its deleted characters and its word tests.
- **G7:** §2.4's spellings.
- **G8:**
  - plugin actions: `install`, `uninstall`, `enable`, `disable`, `update`, `add`, `remove`;
  - MCP actions: every word that begins `add`, and `remove`;
  - each with the aliases P0b (ii) records;
  - locations: `settings*.json` directly under H, and `plugins`, `skills`, `agents`, `commands` and `hooks`;
  - env names: `CLAUDE_CONFIG_DIR` (only if P0b (iii) finds it named), then `USERPROFILE`.
- **G9:**
  - the protected set and the exempt folders (§2.6);
  - delete words: `rm`, `rmdir`, `rd`, `remove-item`, `ri`, `del`, `erase`;
  - the recursive and force options, the package options and the target-folder spellings (§2.6).
- **Unchanged:** `PROCESS_TIMEOUT_MS = 2000`, `MAX_RESCAN_DEPTH = 4`, and N1's values.
- **Size:** at most 1300 changed lines (insertions plus deletions) over at most 3 files:
  - the files: `tools/mods/spatial-guardian/hooks/register.js`, `tools/mods/spatial-guardian/test/guardian.test.ts` and `tools/mods/spatial-guardian/README.md`;
  - the counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/GUARDIAN-V1-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main;
  - an overrun is class 8, and this line is never edited;
  - the estimate: register.js 400, tests 600, README 100.
- **Minutes:** the node's `budget_minutes`.

## §8. Block-on-sight

1. Any v0 §8 item (1 to 25), read against this form, with two exceptions:
   - item 1's ban on `$.fs.write` and on any write is replaced by §2.7's one write;
   - item 4 reads this form's §2.0.
2. **The log write:**
   - a `$.fs.write` outside the log function;
   - a write on an allowed call, before the decision, or outside `<parent of M>/<name of M>-local/guardian/`;
   - a field beyond §2.7's;
   - a command, path, content or argument in a record;
   - a log failure that changes a return value or a reason.
3. **G1:**
   - any change to its refusal set other than §2.2's condition;
   - that condition applied to the segment check, the rescan or the depth cap;
   - text removed from what G1 reads;
   - a heredoc parser.
4. **G7 to G9:**
   - a spelling outside §7;
   - a command word read only at a segment's first token;
   - §2.3's unbalanced handling replaced by a substring test;
   - an allow list, an approval or override path, a flag, an option or a `userConfig`.
5. **G8:**
   - anchored on a `.claude` suffix or segment;
   - a refusal under `<H>/projects/`;
   - an env name outside §7.
6. **G9:**
   - a base read from anything but §2.6's leading-`cd` chain, `git -C` or a named target folder;
   - an unknown base read as anything but M;
   - an `agent.spawn` or `turn.step` hook;
   - a process call.
7. **The catches:**
   - `next(e)` inside the decision's try;
   - a catch body that is not a constant deny with rule `catch`;
   - a registration without v0's `.catch`.
8. **Out-of-scope work:** G5 code; worktree protection beyond G9; the Workboard.
9. **Installs and the live folders:**
   - any install, enable, reload, marketplace change, `--plugin-dir` session or `claude` start by an agent;
   - any write under the user's Claude folder;
   - before the merge, any write into `tools/mods/spatial-guardian/` or `tools/mods/.claude-plugin/` in the main checkout (this form and its §10 amendments are excepted);
   - any `claude` subcommand other than those §0.5 names.
10. **Probes:**
    - a live G1 probe;
    - a probe or test that writes into the repository;
    - before the merge, any call G7, G8 or G9 targets, run by any agent in the piece, `--help` forms included.
11. A user-profile path in any file, fixture, test or commit message. F36 carries `<profile>`.
12. **Mutations:**
    - a test without its RECORDED MUTATION;
    - a record that calls a `verify-mutation` run an observation of a mutation;
    - a mutation recorded without its observation commit;
    - an existing RECORDED MUTATION line edited, rather than a new line appended beneath it.
13. A §7 overrun not recorded as class 8, or §7's line edited; any code of a scope addition before its class 9 amendment.
14. A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.
15. **Record form:**
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a bare self-line;
    - a pin read as current;
    - a tool claim without the tool's commit;
    - a correction round without its superseded index;
    - an amendment numbered before Amendment 1 (P0b).
16. A file outside §7's list, apart from this form and the custodian's generated set.
17. A squash or rebase merge, or any force-push.
18. A reason that states another module's consequence, or holds a path from the call.
19. A five-line form for this piece.

## §9. Gates

- **Dispatch:**
  - after this form's commit, and after the human's rulings on OPEN-1 to OPEN-5 (or his note that the defaults stand), the custodian sets the node's `gate` to this form;
  - the node keeps `merge: merge-commit`;
  - the worker's first step is P0b, recorded as Amendment 1.
- **Architect:**
  - the Gating heads;
  - brief §1, §2, §4 and §5 against §2;
  - line 2;
  - §0.4's settlements, and the OPEN rulings, cited by round and item;
  - §2.2's newly-allowed set and its argument, read against the code;
  - §2.3's reader, read against G1's v0 tests;
  - the seams (§1);
  - R1 to R6 against §2.9;
  - round 7 on §7's reasons;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - on the custodian's machine, with `claude --version`: `claude plugin test`, and `validate` on both targets, text and `--json`;
  - every mutation observed at the gated head, new and v0;
  - §7 recounted;
  - §8 items 2 to 7, checked by reading;
  - F36 against Amendment 1's sha256s;
  - the replay table, read against its method;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` on Windows, with T35 and T36 named in its output.
- **Suites, green before either gate:**
  - governance-ci on the branch, read before gating;
  - the node suites above;
  - §6's tools.
- **PR body:**
  - this form;
  - both `validate` outputs, text and `--json`;
  - the plugin test output, with its version;
  - the replay table;
  - a request for a merge commit (round 25, item 2 (d)).
- **Operator:**
  - The human sights §7's reasons and the README's over-refusals, limits and log section.
  - He gives his typed merge approval after both gates, naming which of E7 to E11 he allows, and clicks.
  - The custodian fast-forwards the main checkout. The human reloads. The custodian records the rows he named.
- **Evaluation** (brief §2.5, `state/directives/MODS-V1-2026-10-05.md:68-76 @ 5c06b0c2 sha256:cdc01eda3f88635e0f887e0c7cb43b06547a6fac5c3d91156e06f047aabe50c9`):
  - acceptance and stop conditions as the brief states them;
  - false refusals are counted from the log by rule;
  - each refusal is classified by the custodian against its session transcript, since the log holds only a hash;
  - each false refusal is narrowed through the usual process.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index). Amendment 1 is P0b's record (§0.5); nothing precedes it.

### Amendment 1 — P0b (class 1; I8 fired)

*Written after P0b's outcomes were seen, by the custodian (§0.5). The record is the worker's report, `state/consults/2026-10-05-guardian-v1-p0b-report.md` (sha256 from its line 5 c3e12389b17cad7742ae095f696339f821ca0f81fa4d6e206c93521c19efb7c7), cited by section. No code or branch exists. Nothing below is a quotation.*

1. **(i) The types,** typed at 2.1.288: the type file equals §0.1's sha256 in both 2.1.288 folders. `$.fs.write`'s rejection cases, its lack of a duration bound, `$.session.repo()` returning null outside a repository, `$.env.get` returning undefined for an unset name, and the test-kit events are in the report's section (i). Nothing contradicts §2, so I1 has not fired.
2. **(ii) The CLI spellings,** observed at 2.1.289, are in the report's section (ii), including the group alias `plugins`, the aliases `i` and `rm`, and verbs outside §7's list.
3. **(iii) No override name** is typed. §7's env list is `USERPROFILE` alone.
4. **(iv)(a) The six commands:** each is refused by v0 and allowed by G1 v1, raw and redacted, with the sha256s in the report's table. I7 has not fired.
5. **(iv)(b) The replay** counts are the report's tables, from 2026-09-20.
6. **I8 fired.** Since 2026-09-27 the replay gives G7 19 refusals, G8 9 and G9 4, against §5's 1, 0 and 0.
   - Beyond the §9 merge, these include the custodian's own flows: `gh pr create`, `view` and `checks` calls, and ledger writes, refused through §2.3's odd-quote reading.
   - The piece stops before code (§5) and returns to the architect for an amendment.
7. **For that amendment:** the report's two findings (the replay counts; the CLI spellings §2.5 and §7 omit), its round-57 additions section, round 57's rulings and Fable's round-57 advice.

**Superseded index.** None.
