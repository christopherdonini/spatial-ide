# Guardian v0 — the first Spatial IDE mod: a refuse-only plugin at tools/mods/spatial-guardian/ (PLAN node `guardian-v0`) — preregistration

**Authority:**
- the 2026-10-03 Guardian v0 direction: `state/directives/2026-10-03-guardian-v0-direction.md:12-14` @ 1bb94e19 sha256:3b206c66930d830a816f4a023937e224cf98d358bd1673c8c1d03a526c301428 (RULED 2026-10-03, the Guardian v0 block in `DECISIONS-PENDING.md`, cited by its heading and not by line);
- Fable's brief: `state/directives/MODS-GUARDIAN-V0-2026-10-03.md` (whole-file sha256 6d156511936465a831e9e197d42db4cdee2b8199ca838e7021071b6318a4f6e8). Its parts are cited below by section, rule id and pinned line;
- the node: `PLAN.yaml:3814-3830` @ 1bb94e19 sha256:aa1ffd941c7a3691c8a2299411fa7211ba79594f8358ea45ad137fefa4e32305;
- the rulings on draft 1's OPEN items: round 43, item 3 (O-1, G5 leaves v0); round 43, item 4 (O-2, G6 kept on reads); round 44, item 1 (O-3 to O-8), whose typed text is the 2026-10-03 guardian O-3 to O-8 ruling, `state/directives/2026-10-03-guardian-o3-o8-ruling.md:6-8` @ 1bb94e19 sha256:c8120e627ef205c7b4b52194cf1ec75946293229ed7f93c4db7a1b6f90ae19e0.
The rules enforced are cited by round and item: round 34, item 3 (force-push); round 41, item 3 (the write audit, `state/directives/2026-10-03-write-audit-ruling.md:7-9` @ 1bb94e19 sha256:daefdaf76ddfcc7b9939ce722999c95d1f049238f4f69ca2f38058ac7747676c); round 29 (the exposure rule, which G5 would have enforced; out of v0 by round 43, item 3); and AUTONOMY §7 (the flush).
**Drafted by** the architect agent on the custodian's brief. This is draft 2, read at `main` 1bb94e19. Draft 1 was read at b64a8d39 and is filed as `state/consults/2026-10-03-guardian-v0-architect-draft.md`. It is architect-drafted because it crosses no engine/ or kernel/ path (`state/directives/2026-10-03-lead-data-pilot-direction.md:31-33` @ 1bb94e19 sha256:dcc230878a8c80de832a19992ef62da1810374a71d0064b0a91dbdc7ef22e8a2). Nothing was run for this draft. **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** the 64 `sha256:HASH-TBD` pins are computed by script at 1bb94e19, each the hash of the cited lines with their LFs. The draft's one question, governance-ci's two `tools/mods/**` path-filter lines (§2.13), is taken by the custodian under P-005 (CI configuration mechanics), because the lines change no check and carry round 44, item 1's failure route; the ledger records it. Nothing else is changed.
**Gating:** full, reviewer and architect, on two heads, each enough alone:
- **§21a, security posture.** The direction line names installing Guardian a security-posture change (`state/directives/2026-10-03-guardian-v0-direction.md:12-14` @ 1bb94e19 sha256:3b206c66930d830a816f4a023937e224cf98d358bd1673c8c1d03a526c301428; `AUTONOMY.md:315-332` @ 1bb94e19 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3). This piece builds the artefact that would be installed.
- **§21c size** (`AUTONOMY.md:347-357` @ 1bb94e19 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31): over the bound (§7).
Under round 25, item 2 (e), no five-line form is used.
**Red line.** Installing Guardian is the human's alone. It needs his typed approval after both gates, and he installs it himself (brief §4, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ 1bb94e19 sha256:b446fb1dad9f228df029d8ffea2628f3a99f15239b9b44ce3e76aac99fdd7013; `AI_DEVELOPMENT.md:451-454` @ 1bb94e19 sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821). Nothing in this piece installs, enables or loads the mod into a session, adds a marketplace, or starts a session with it.

## §0. Disclosure

**0.1 Inputs.** These are Evidence, not Authority:
- P0, `state/consults/2026-10-03-guardian-v0-p0-report.md`, run against Claude Code build 2.1.288;
- the install-scope supplement, `state/consults/2026-10-03-guardian-v0-docs-read.md`. Its filing note was read first. Part 1's line 56 (`state/consults/2026-10-03-guardian-v0-docs-read.md:56` @ 1bb94e19 sha256:1ff1cb749d820e8be4c319d4337f01de7184dc78f64c9d0a43c31823c413931c) is wrong, per the note (`state/consults/2026-10-03-guardian-v0-docs-read.md:1` @ 1bb94e19 sha256:e88fdb5e156211072501917dc30b26ddfc0d05e95b5be238b6f50911a0c6e965) and P0's timeout probe. Nothing here relies on it.
The build's files are cited as `<skill-root>/<file>:<line>`, with file sha256 values from P0 (`state/consults/2026-10-03-guardian-v0-p0-report.md:1005-1006` @ 1bb94e19 sha256:cc3569da7020381450915a85f847801a171ea859add5d772c04f8d916f7d09b0):
- `<skill-root>/types/claude-code.d.ts` is 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1;
- `<skill-root>/reference.md` is ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4.
Every build fact is a claim about build 2.1.288 (round 15 (c)). It is not current for any other build (§5 I2).

**0.2 The brief's §3 answers, each with its source.**
1. **Agent identity.** On the types, yes. `tool.call` carries `agentId` in a subagent's loop and none on the main loop. `$.agent.list()` rows carry the same `id` and a `type`. Sources: `<skill-root>/types/claude-code.d.ts:164-182`, `<skill-root>/types/claude-code.d.ts:121-139` and `<skill-root>/types/claude-code.d.ts:11953-11961`; P0's answer at `state/consults/2026-10-03-guardian-v0-p0-report.md:8` @ 1bb94e19 sha256:09c98195d20f9d248ad41cc5017b7674d3f66b5f7a9c8fe128d5e651eba57364.
   - The brief is reachable by reads (`$.session.messages({ agentId })`), or by an `agent.spawn` hook: `state/consults/2026-10-03-guardian-v0-p0-report.md:205` @ 1bb94e19 sha256:42b3ae6f33932f3ffce42b7abbc6f084247ee53c5f8e533b88702f668a77a36f.
   - The probe passed `agentId` through a type cast (`state/consults/2026-10-03-guardian-v0-p0-report.md:197` @ 1bb94e19 sha256:11b8cd11a8042a0fded5b8f51ff0c530e846f13e862e0a010848c3061829bade).
   - That a live subagent's calls carry the id is the build's type claim. It is unverified without a live session, and E5 settles it (round 43, item 4).
2. **Tool-result shape.** Bash, Grep and Read results are typed: `<skill-root>/types/claude-code.d.ts:19178-19186`, `<skill-root>/types/claude-code.d.ts:19495-19506` and `<skill-root>/types/claude-code.d.ts:19809-19822`. The typed way to add a line after a result is the `context` field. It is returned beside the result from `next(e)`, and the model reads it but the user does not see it (P0's answer, `state/consults/2026-10-03-guardian-v0-p0-report.md:207` @ 1bb94e19 sha256:92207d8f49b838aa10059be7ebd63ac01563a07581ad5432259142cd76a0d60c).
   - The field's own doc lines are not among P0's excerpts. Amendment 1 (P0b), item (iv), reads them.
   - Delivery to the model is unverified live. E6 records it, and `context` is the delivery route (round 44, item 1, O-5 as recommended).
3. **Context fill.** `$.session.usage()` gives `context.percent`, the status line's percentage over the model's window. It is absent until the first response of a live window: `<skill-root>/types/claude-code.d.ts:10257-10280`, `<skill-root>/types/claude-code.d.ts:2621-2642`. `turn.step` carries the four counts but no window size: `<skill-root>/types/claude-code.d.ts:12619-12661`, `<skill-root>/types/claude-code.d.ts:12681-12715`.
   - The compaction window may be smaller than `window` (a sub-line span of `<skill-root>/types/claude-code.d.ts:10285`). §2.8 takes the denominator by round 44, item 1 (O-6 as recommended).
   - P0's reading is that no `turn.step` hook is needed (`state/consults/2026-10-03-guardian-v0-p0-report.md:529` @ 1bb94e19 sha256:e88096d2786f8f7347ccd71a33aaacfdaa251589dd951e2d1c72fda764aa908b).
4. **Install scope.** The docs read covers this:
   - user scope records the plugin in the user settings file, which is not committed (`state/consults/2026-10-03-guardian-v0-docs-read.md:16` @ 1bb94e19 sha256:99677cb7174e914835aadaeb6a4f91dabf2f2e8b523255f26431b6e925ae7c33);
   - a cloud session loads neither user-installed plugins nor the ones the repository's settings turn on (`state/consults/2026-10-03-guardian-v0-docs-read.md:25` @ 1bb94e19 sha256:931722378a24296d8b6e12e831e56c8588c71ad5284fe9d7ea285675e9d09f94);
   - both quotations were checked against the pages (`state/consults/2026-10-03-guardian-v0-docs-read.md:94-104` @ 1bb94e19 sha256:8c07239f14a5c6fd42bb2df5fe7f3eb290a6990d2b3d44d1adbf7e8360822a03).
   The commands come from the build's help text: `state/consults/2026-10-03-guardian-v0-p0-report.md:531` @ 1bb94e19 sha256:4dc01b68288226298499f25dc2277f71f4dc1f8a60ce43409644a9121c9c99e3.
   - The marketplace shape validated with exit 0.
   - `hooks.json` `modules` must be an array of exactly one path.
   - P0 does not establish whether an install copies the plugin folder or references it (§1, may not claim; E0).
5. **Tests.** `claude plugin test <dir>` runs every `*.test.ts` and `*.test.tsx` under the folder, in a child of the binary, with no fs, network or process, and starts no session. A test answers the engine's events beneath the plugin, and an unanswered event throws. Sources: `state/consults/2026-10-03-guardian-v0-p0-report.md:660` @ 1bb94e19 sha256:f09af8c196bb357a324dd4b827e5d6a320e33d3c5a14509d66505e089a43c2d6; `<skill-root>/types/claude-code.d.ts:14902-14913`; sub-line spans of `<skill-root>/reference.md:75`. A plugin file may be `.mjs`, as may every file it imports from the plugin: a span of `<skill-root>/reference.md:14`, excerpted by P0 at `state/consults/2026-10-03-guardian-v0-p0-report.md:616` @ 1bb94e19 sha256:de00f3b115f12f901ab994b19ac90d4c42d84328d12aabef01f2df13d8793171 (a sub-line span; the line's hash).
6. **Limits.** The hook budget is 10 000 ms and the `.catch` grace is 1 000 ms. The clock stops while a `next` or `$` call is in flight (`<skill-root>/types/claude-code.d.ts:4804-4820`, `<skill-root>/types/claude-code.d.ts:8675-8691`).
   - A failed hook with no `.catch` is skipped, and the call runs (the probe at `state/consults/2026-10-03-guardian-v0-p0-report.md:863` @ 1bb94e19 sha256:219aa13434bde1f7144bf0b4aaa38008a1785e9e51d2c99c4f1909af9806de2b).
   - A `.catch` that returns `undefined` or overruns leaves the hook absent (`<skill-root>/types/claude-code.d.ts:994-1002`).
   - `$.process.run` resolves `{ exitCode, stdout, stderr }` for any exit code. It rejects when the command cannot start or is still running at its timeout. Each stream is cut at its first 4194304 bytes, with `isStdoutTruncated` and `isStderrTruncated` set when it is (`<skill-root>/types/claude-code.d.ts:3291-3307`). A hung `$.process.run` does not trip the budget. It has its own 30 s default (P0 at `state/consults/2026-10-03-guardian-v0-p0-report.md:864` @ 1bb94e19 sha256:b9b9e1a252b2b4b51b997adfc179f23361e8890e6938e25ddd9c94b891834df4).
7. **`claude plugin validate`.** The two lines are `hooks:` and `calls:` (`state/consults/2026-10-03-guardian-v0-p0-report.md:866` @ 1bb94e19 sha256:05c17d07bb50088b41416738dac16ba50a54cef3c029b5a22767ce496289eab9; probe output at `state/consults/2026-10-03-guardian-v0-p0-report.md:880-881` @ 1bb94e19 sha256:fb41234891ca6029c75454db5072e7803fc78f513bf5dd4ca96e493d88bc07fa).
   - The `calls:` line names `$.process.run` whatever its argv, so it cannot show whether a process call is `git` (§2.1(c), §8 item 3).
   - A hooks module imports only its own files and `claude-code`, so the repository scanner cannot be imported. G5 leaves v0 (round 43, item 3; §2.6).
   - The calls each rule needs: `state/consults/2026-10-03-guardian-v0-p0-report.md:991-1000` @ 1bb94e19 sha256:3b5d9acaddba93708c318bc221e5a7bfbe414877ef628a472ba2700f33691582.
   - The coverage limit: `state/consults/2026-10-03-guardian-v0-p0-report.md:1002` @ 1bb94e19 sha256:eb7c2c82822e71822facdbad6e22732b62dc41837a8165478bf317beddfb30a5.

**0.3 Repository facts relied on.**
- The Stop hook's staleness predicate: `scripts/hooks/stop-queue.mjs:221-244` @ 1bb94e19 sha256:50459de9de302d1204c49e48785397139532f31147706f804d0efe07d929e115. It is module-local and reads git. Its block parser is `parseSessionContinuity`: `scripts/hooks/precompact-flush.mjs:57-79` @ 1bb94e19 sha256:47c99404d4b44c84a0ad6fc59c2f4d85059ebfd04db980af8e4e2d749195e725.
- The Stop hook's exported decision core, its signature and its result shapes: `scripts/hooks/stop-queue.mjs:289-299` @ 1bb94e19 sha256:34c2efba9351b27ff657ac7d7356dcab122329341d611c1f2e61aec716cd54b3. Its continuity step: `scripts/hooks/stop-queue.mjs:327-342` @ 1bb94e19 sha256:e48be43a46d843a65b6e03bbdb5b417dec706f06edfdfb9c0a6b0361f6e2b668. Its background-tasks allow, which comes after continuity: `scripts/hooks/stop-queue.mjs:344-347` @ 1bb94e19 sha256:5f26059384dd89950ae8fcec743f1d9026e70ccb4ad6371874cc619ca07661c1.
- The existing hook tests' continuity fixtures (real git, `os.tmpdir()`, local identity, `core.autocrlf false`, `* -text` in `.git/info/attributes`, `t.after` cleanup): `scripts/hooks/hooks.test.mjs:65-124` @ 1bb94e19 sha256:ae48af72dbb4b90ed29992076c7167027066760b5d5ce57330c630ae5c7700f6. Their environment preamble: `scripts/hooks/hooks.test.mjs:20-25` @ 1bb94e19 sha256:2a68aa213a64abb67753951a315c29c1d086663bd3cbef7712f839205131bd35.
- The stale-continuity form is `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`. It is cited by section, amendment and item: its §3 scenarios S1 to S10, its §7 reason and stderr texts, and its Amendment 2, item 2 (T18 and T19). Its Amendment 3 is its closing record.
- CI: governance-ci's test step runs `node --test` over the `scripts/plan` and `scripts/hooks` test globs (`.github/workflows/governance-ci.yml` lines 137-138 at 1bb94e19). Its push and pull_request path filters (the same file, lines 79-92 and 94-107 at 1bb94e19) include `scripts/hooks/**` but not `tools/mods/**`. These are named in words, because verify-quotes' grammar does not read a dot-prefixed path. The custodian computes their hashes.
- Agent tool lists:
  - lead-data alone has Write (`.claude/agents/lead-data.md` line 4 at 1bb94e19);
  - architect and evidence-reader have none (`.claude/agents/architect.md` line 4 and `.claude/agents/evidence-reader.md` line 4 at 1bb94e19);
  - these are named in words for the same reason. The custodian computes their hashes.
- The off-switches: `--safe-mode` also disables the user's other customizations (`state/consults/2026-10-03-guardian-v0-docs-read.md:99` @ 1bb94e19 sha256:8945ae8b49536cfc7d259ba0745860e0d5ffc56af5d17d8d2aad68f5e7b278a3); `disableAllHooks` also stops the settings hooks (`state/consults/2026-10-03-guardian-v0-docs-read.md:104` @ 1bb94e19 sha256:c53a069351a459451a11cd5b89320f67e134e02bd918ae496af94db441052bf9).
- The session's dev-mods folder is watched while the plugin-authoring skill is loaded (the custodian's P0 ledger entry in `state/CUT-STATE.md`, its note for the human). Writing there raises a mod load.

**0.4 P0b, read-only, before any code.** The worker reads `<skill-root>/types/claude-code.d.ts` and records five things before any code. The record is **Amendment 1, headed P0b**, class 1, written after the read, and it is §10's first amendment. §10 opens empty, and nothing is appended before Amendment 1. Later amendments number from 2. This form cites P0b's findings as Amendment 1 (P0b), item (i) to item (v). The five things:
- (i) whether the `ToolCallInput` union names a `PowerShell` tool, and its command field;
- (ii) whether it names `MultiEdit` or `NotebookEdit`, and their path fields;
- (iii) the row type of `$.session.messages`, and whether its first row is the Agent call's prompt, by the types;
- (iv) the `context` field's doc lines on `ToolCallResult`;
- (v) whether a test's `on` can answer `fs.stat`, `agent.list` and `session.messages`; and whether a `{ breakdown: "summary" }` usage call makes no network request and carries the compaction window.
Each item is cited `<skill-root>/types/claude-code.d.ts:<lines>`. A finding that contradicts §2 STOPS the piece (§5 I1). Item (ii) decides whether §2.10's extension applies, and item (v)'s second half decides §2.8's denominator.

**0.5** No measurement, no fixture drive. §3's parity fixtures are test fixtures, built in temporary repositories by T35 and T36.

## §1. May and may not claim

**May claim:**
1. Each kept rule refuses its §3 refusal cases and passes its allowed cases to `next(e)` unchanged (under `claude plugin test`, build 2.1.288, Windows).
2. A refusing hook that throws, or whose `$` call rejects or times out, ends in a deny.
3. N1's threshold, band and staleness behaviour, as §2.8 declares.
4. `claude plugin validate` lists only §2.0's hooks and calls.
5. T35: on every §3 parity fixture, the mod's `judgeContinuity` and the Stop hook's `decide` reach the same outcome, one of stale, fresh and not judged, each reading the one repository built for that fixture. This holds on Windows (the reviewer's run) and on ubuntu-latest (governance-ci). T36: the fixture set reaches all three outcomes on the Stop hook's side.

**May not claim:**
- any live behaviour before its E-row (§4): `agentId` on a live subagent's calls; `context` reaching the model; `realPath` spellings; the live percent figure;
- parity through the engine's own `$.process.run`. T35's runner is Node's `spawnSync`, shaped to the build's result type (§0.2 item 6). register.js's adapter is proven under `claude plugin test` with stubbed answers (T26 to T32), and live by E6;
- parity for a history shape outside §3's parity fixtures, or for a ledger blob of 4194304 bytes or more. Above that size the engine cuts the stream: the mod reads not judged, while the Stop hook judges up to its 64 MiB buffer (§2.8a; §5 I7);
- parity for a session whose working directory differs from the Stop hook's project root (a worktree session, for example);
- writes by Bash, PowerShell or any tool other than those §2 registers (P0's coverage limit, `state/consults/2026-10-03-guardian-v0-p0-report.md:1002` @ 1bb94e19 sha256:eb7c2c82822e71822facdbad6e22732b62dc41837a8165478bf317beddfb30a5). A round 15 (f) restore done with git is unseen by G3;
- for G1: aliases, scripts, configured `+` refspecs, or environment variables. G1 reads the command string only;
- any profile-path refusal. G5 is not in v0 (round 43, item 3);
- cloud sessions, or edits made on GitHub. CI and the gates stay (brief §1, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:12` @ 1bb94e19 sha256:e64a6fe6c7553ead0b8b91fbab974379fb7378ce0c320d4ee5061d93e678fc80);
- any build other than 2.1.288; macOS; Linux for the mod itself (T35 and T36 run there only as Node tests);
- that the installed copy is isolated from later changes to the repository folder (E0);
- that `claude plugin test` and `validate` load the mod into a session. P0 shows that neither starts one;
- any latency figure, and any docs/08 row.

**Out of scope** (the brief's line 26, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:26` @ 1bb94e19 sha256:dcc5cb77a2cffd0376ec5605067edf3ff46f7b15d11759893931277b00717888): dashboards, evidence packaging, a context keeper, any approval or override path, cloud sessions. G5 is also out (round 43, item 3).

**Scope limits:**
- no wire change, and no ADR cited as governing or amended;
- ADR-006 does not apply, because this is repository tooling;
- no configuration, no `userConfig` and no flag: every code path is reached by a real tool call;
- outside `tools/mods/`, this piece adds one test file in `scripts/hooks/` and two path-filter lines in `.github/workflows/governance-ci.yml` (§2.13). It changes no other line.

**Seams**, each written against the other side's actual interface:
- **register.js to the mod API:** build 2.1.288's types (§0.2). Proven from the real shape by `claude plugin test`, which runs the engine's own dispatch and `.catch` path, and live by E0 to E6.
- **register.js to `hooks/continuity.mjs`:** `judgeContinuity(run)`, whose one product caller is N1 in register.js. `run` is register.js's git adapter over `$.process.run` (§2.8a).
- **The mod's staleness check to the Stop hook's:** a mod cannot import a repository file, so the predicate is restated in `continuity.mjs`. Its source is `scripts/hooks/stop-queue.mjs:221-244` @ 1bb94e19 sha256:50459de9de302d1204c49e48785397139532f31147706f804d0efe07d929e115, with `scripts/hooks/precompact-flush.mjs:57-79` @ 1bb94e19 sha256:47c99404d4b44c84a0ad6fc59c2f4d85059ebfd04db980af8e4e2d749195e725 for the parser, named in a comment. T35 holds the two together. It reads the Stop hook only through its exported `decide` (§0.3), unchanged, and classifies by the stale-continuity form's §7 texts.
- **G6 to the custodian's briefs:** a `REPORT PATH: <absolute path>` line, which lead-data briefs carry from install (round 43, item 4). That is the custodian's practice, not this piece's code.

## §2. The rules, stated before code

**2.0 Packaging** (brief §4, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:41` @ 1bb94e19 sha256:2bacb3d6d9e26e761264ba33895495c3b102221d6957e59c3bb5ad7a76823e47; P0 §4):
- `tools/mods/.claude-plugin/marketplace.json`: `name` `spatial-ide-mods`, `owner.name`, `description`, and `plugins[0]` = `{ name: "spatial-guardian", source: "./spatial-guardian", description }`.
- `tools/mods/spatial-guardian/.claude-plugin/plugin.json`: `name`, `description`, `author`.
- `tools/mods/spatial-guardian/hooks/hooks.json`: `"modules": ["./register.js"]`, an array of one path.
- `tools/mods/spatial-guardian/hooks/register.js`: exports `register(on, options)`. It imports nothing but its own files and `claude-code`.
- `tools/mods/spatial-guardian/hooks/continuity.mjs` (§2.8a): pure, with no import and no `$` call. Node can import it as well as the engine.
- `tools/mods/spatial-guardian/test/guardian.test.ts`: the plugin tests (§4), importing from `claude-code/testing`.
- `tools/mods/spatial-guardian/.gitignore`: `.claude-plugin/types/`, the engine-written type folder, kept out of git.
- `tools/mods/spatial-guardian/README.md` (2.11).
- No npm dependency, no `package.json`, no lockfile.
- Declared hooks line: `tool.call{tool=Bash}`, `tool.call{tool=Write}`, `tool.call{tool=Edit}`, and the unfiltered `tool.call` (N1). Two more are added only if P0b finds the tools typed: `tool.call{tool=PowerShell}` (Amendment 1 (P0b), item (i)), and `tool.call{tool=MultiEdit}` and `tool.call{tool=NotebookEdit}` (item (ii); §2.10).
- Declared calls line: `$.fs.stat`, `$.fs.read`, `$.process.run` (git only), `$.agent.list`, `$.session.messages`, `$.session.usage`. Nothing else. These count as reads under item 7 (round 44, item 1, O-3 as recommended).
- No `turn.step` hook and no `agent.spawn` hook.
- The worker builds in a worktree under `C:\dev\wt\` or `.claude/worktrees/`, never in the dev-mods folder or anywhere under the user Claude directory.

**2.1 Common design.**
- (a) **Refuse only** (brief §1, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:7-10` @ 1bb94e19 sha256:647689a6615fb863ca4a8dcab7b52dd217342859f85c6a6a7b32744c58507260). A hook either returns `{ deny: <reason> }` or returns `next(e)` with the event it received, untouched. There is no `tool.check` hook and no `allow`.
- (b) **Fail closed** (P0 §6). Every refusing registration carries `.catch(() => ({ deny: CATCH_REASON }))`: synchronous, one expression, no `$` call, nothing that can throw.
- (c) **Timeouts and argv.** Every `$.process.run` call site in register.js passes the literal `"git"` as `argv[0]` and `timeoutMs: PROCESS_TIMEOUT_MS` (§7). In a refusing hook, a rejection makes the hook throw, and (b) denies.
- (d) **Placement.** `place(path)` follows the build's own guard example (`<skill-root>/types/claude-code.d.ts:3061-3113`):
  - a spelling it cannot place returns `undefined`: drive-relative, `\\` or `//`, an empty, `.` or `..` name, or a name holding a drive;
  - otherwise it returns the file's `realPath` from `$.fs.stat(path, { resolve: true })`;
  - otherwise, on `ENOENT`, it returns the folder's `realPath` plus the separator plus the name;
  - otherwise it returns `undefined`.
  A Write or Edit whose path places to `undefined` is refused (`UNPLACEABLE_REASON`).
- (e) **Matching.** The placed path is normalised by replacing every `\` with `/` and lower-casing ASCII. Protected paths are matched by suffix or segment on that form, on every platform alike (R1). No branch keys on the OS, and no drive letter is assumed (R4). A case-sensitive volume can therefore see an over-refusal, which is declared here.
- (f) **No paths in reasons.** No deny reason contains a path from the call (the exposure rule's spirit). Each reason states Guardian's own fact and its own refusal, and no other module's consequence (round 7).
- (g) **Order in the Write and Edit hook:** G6 (when `agentId` is set), then placement, then G2, G4 and G3, then `next(e)`.

**2.2 G1** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:18` @ 1bb94e19 sha256:2dde0d4bf65b0e1657763e909093c4a1938f4ac97b0d9cc4b452ad7bfeb3a0c8). A Bash hook, plus a PowerShell hook if Amendment 1 (P0b), item (i), finds the tool typed. It makes no `$` call.
- `e.command` is split into segments at `;`, `&&`, `||`, `|`, `&` and newlines outside quotes. Each segment is tokenised with single and double quotes.
- A segment is a push when its tokens hold `git`, then any of git's global options (`-C <x>`, `-c <k=v>`, `--git-dir=…`, `--work-tree=…`, `--no-pager` and the like), then `push`.
- A quoted token that itself holds `git` and `push` is scanned again as a command (for example `bash -c "…"`).
- After `push`, any one of these refuses:
  - `--force` (with or without `=…`);
  - `-f`;
  - a short-option cluster holding `f` or `d`;
  - `--force-with-lease` (bare or with a value);
  - `--mirror`;
  - `--delete` or `-d`;
  - `--prune`;
  - a refspec that begins with `+` or with `:`.
- A segment that holds `push` and cannot be tokenised (an unbalanced quote) is refused.
- Anything else goes to `next(e)`.

**2.3 G2** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:19` @ 1bb94e19 sha256:99b77a6de636eb24e83b332c8f3861a5d223a5c1ba028c8b8979d426366ea84e). A Write or Edit whose normalised path ends with `/docs/01_principles.md` is refused.

**2.4 G3** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:20` @ 1bb94e19 sha256:7d415d48693c5def92874994b30ab5a585fd021ccadb12be9c265853bad41e73). The target is protected when either of these holds:
- it is an existing file whose normalised path ends in `/docs/adr/adr-<digits>-<name>.md`, and whose status line is not Proposed. The status line is the first of the file's first 10 lines that starts with an optional `*`, then `Status`. Its first word is compared after `*`, `:` and spaces are stripped. Any status other than `Proposed`, or no status line, counts as protected: unrecognised means protected;
- it is a file whose basename, lower-cased, ends with `preregistration.md` and which is filed: `git cat-file -e HEAD:./<name>`, run with `cwd` set to the file's placed folder, exits 0. A non-zero exit means not filed. A rejection throws, and 2.1(b) denies.
On a protected target:
- a Write is allowed only when `e.content.startsWith(current)`, where `current` is `$.fs.read(path)`. A read that rejects (over 4 MiB, for example) throws and is denied;
- an Edit is allowed only when it is append-shaped: `old_string` occurs exactly once in `current`, `current.endsWith(old_string)`, and `new_string.startsWith(old_string)`. Every other Edit is refused (round 44, item 1, O-8 as recommended).

**2.5 G4** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:21` @ 1bb94e19 sha256:35c5fb25b35c064533480186913a405fb886c6cb09a60c1bf3a5a997f5c05eec). When the normalised path holds the segment `/state/directives/`:
- every Edit is refused;
- a Write is refused when the file exists (its own `$.fs.stat` succeeds);
- a Write that creates a new file is allowed.

**2.6 G5** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:22` @ 1bb94e19 sha256:c5b6ef89a2249494a66d9a945f615420085f3eb55d6edb80d77f64176b7a1da2) **is left out of v0, by round 43, item 3.**
- There is no G5 code, no G5 test, and no option, stub, placeholder or call that prepares for it.
- There is no `$.fs.write` and no non-git process call.
- The commit-msg and pre-commit hooks and the CI `--range` backstop remain the profile-path refusal.
- The scanner's stdin mode is the proposed node `profile-path-scan-stdin-mode` (`PLAN.yaml:3886-3902` @ 1bb94e19 sha256:13e33f932bc5d64d1e187c5f9c7beb6d25560fc6b8ba6cea02647487c7283dd0). G5 returns only through that node and a later piece.

**2.7 G6** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:23` @ 1bb94e19 sha256:03a4adab1a26e5d9ce708194ed4ae70cd7a27321826ddf4ff4edb4eddf6d2d1d). **Ruled by round 43, item 4: kept, on reads (route B).**
- With `e.agentId` unset, G6 does nothing.
- Otherwise it calls `$.agent.list()`. G6 does nothing when no row has `id === e.agentId` (engine forks and workflow agents, `<skill-root>/types/claude-code.d.ts:164-182`), or when the row's `type` is not one of `architect`, `lead-data` or `evidence-reader`.
- Otherwise it reads the first row of `$.session.messages({ agentId: e.agentId })`, whose shape comes from Amendment 1 (P0b), item (iii). Exactly one line must match `^REPORT PATH: (.+)$`. The placed and normalised call path must equal the placed and normalised declared path, or the call is refused (`G6_REASON`). Zero matching lines, several, or an unplaceable declared path also refuse.
- An architect or evidence-reader brief carries no such line, so any Write is refused. That is the trial's no-write rule for architects (round 41, item 3, as applied). Neither definition has a Write tool (§0.3), so G6 bites on lead-data and is defensive for the other two.
- E5 runs after install. If it shows no `agentId` on a live subagent's call, G6 is removed by a class 5 amendment citing round 43, item 4.
- The write audit (`scripts/hooks/subagent-write-audit.mjs`) stays the primary check until E5 passes, and the backstop after it (round 43, item 4).

**2.8 N1** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ 1bb94e19 sha256:1ca3956c77cd959acc4870fa10506b1eef14b1f5449899f47d5864d2d32d1f41). **Ruled by round 44, item 1:** O-4 as recommended, plus the parity test (§2.13); O-5 and O-6 as recommended.
- One unfiltered `tool.call` registration, with no `.catch` and no deny. Its first statement is `const ran = await next(e)`. A failure after that leaves `ran` standing (`state/consults/2026-10-03-guardian-v0-docs-read.md:63` @ 1bb94e19 sha256:38d56755c775be3bd827b50d29ac37c54efdb4efafb56e72725d29790adce7f0).
- It returns `ran` itself when `ran.deny !== undefined` or `e.agentId !== undefined`.
- `p` is the fill: the compaction-window percentage from a `{ breakdown: "summary" }` usage call, if Amendment 1 (P0b), item (v), shows that call to be local and to carry that window. Otherwise `p` is `context.percent` from the plain `$.session.usage()`. On the plain route, the README and the closing record disclose that N1 never fires if auto-compaction runs below 80% of the model's window. If `p` is absent, N1 returns `ran`.
- If `p < N1_THRESHOLD`, it clears `shownBands` (a module variable, lost on a hot reload; no `$.store`) and returns `ran`.
- `band = Math.floor(p / N1_BAND)`. If the band is in `shownBands`, it returns `ran`.
- Otherwise it calls `judgeContinuity(run)` from `./continuity.mjs`. Here `run = (args) => $.process.run(["git", ...args], { timeoutMs: PROCESS_TIMEOUT_MS })`, with `cwd` left as the session's.
- When the result is `{ judged: true, stale: true }`, it adds the band to `shownBands` and returns `{ ...ran, context: [...(ran.context ?? []), N1_TEXT(p)] }`. On any other result it returns `ran`.
- It never edits `result` or `text`. It reaches no other staleness judgment than `judgeContinuity`'s.

**2.8a `hooks/continuity.mjs`.** Its one export is `judgeContinuity(run)`, which returns `Promise<{ judged: false } | { judged: true, stale: boolean }>`. It imports nothing and makes no `$` call. Each call below is unreadable when `run` rejects, when `exitCode !== 0`, or when `isStdoutTruncated` is true. Every stdout is trimmed before use, as the Stop hook's `tryGit` trims.
1. `run(["log", "-1", "--format=%H", "HEAD", "--", "state/CUT-STATE.md"])`: unreadable means not judged. Empty output means judged fresh. Otherwise the output is `c`.
2. `run(["show", c + ":state/CUT-STATE.md"])`: unreadable means not judged. The output is parsed into `F_c`. No `flushed_at` means not judged.
3. `run(["show", c + "^1:state/CUT-STATE.md"])`: unreadable means judged fresh. The output is parsed into `F_p`. No `flushed_at` means judged fresh.
4. Stale iff `F_c === F_p`.
The parser restates `parseSessionContinuity`'s reading of `flushed_at`. It finds the `## SESSION-CONTINUITY` line after a split on `\r\n|\r|\n`, scans to the next heading, and trims the value. A comment names §0.3's two sources. This is the Stop hook's predicate step for step, including its fail-open readings, with only the log format narrowed to `%H`.

**2.9 Never done** (brief §1): rewriting a call's arguments; submitting a prompt; any `$.model` call; any network request; any `$.ui` call; any write.

**2.10 Coverage limit, as scope.**
- G2 to G4 and G6 guard Write and Edit.
- If Amendment 1 (P0b), item (ii), finds `MultiEdit` or `NotebookEdit` typed, they guard that tool too, on its path field, as `tool.call` hooks matching the write audit's tool list (round 44, item 1, O-7 as recommended).
- A Bash or PowerShell write (`sed -i`, a redirect, `tee`, `Set-Content`) is untouched, as it is for the write audit.

**2.11 The README** states, with no quotation:
- what Guardian refuses, and the ruling for each rule;
- that G5 is not in v0 (round 43, item 3);
- §1's limits;
- **install**, the human's alone, after his typed approval following both gates:
  - `claude plugin marketplace add <repository>/tools/mods --scope user`;
  - `claude plugin install spatial-guardian@spatial-ide-mods --scope user`;
  - `/reload-plugins`;
  - confirm the `/plugin` line the brief names (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ 1bb94e19 sha256:b446fb1dad9f228df029d8ffea2628f3a99f15239b9b44ce3e76aac99fdd7013).
  Install from a checkout on main. Never use `project` or `local` scope;
- **turning it off:**
  - Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope user`;
  - one session: start with `--safe-mode`, which also disables the user's other customizations (§0.3);
  - never `disableAllHooks`, which also stops the repository's settings hooks (the Stop hook and the round mirror);
- uninstall: `claude plugin uninstall`;
- the brief's §5 acceptance and stop conditions, by reference (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:49-57` @ 1bb94e19 sha256:5336670a5a51fe3cc8b94d5195c596fdbc7d43d08cbaab7965f04ceb19c09eaa);
- that false refusals are logged in the ledger and narrowed through the usual process;
- the `REPORT PATH:` convention (round 43, item 4);
- that N1's staleness check is held to the Stop hook's by T35. A change to either predicate is made with the other, in the same piece.

**2.12 Portability** (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:31-65` @ 1bb94e19 sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b; R3 per the template's platform section, `docs/PREREGISTRATION-TEMPLATE.md:177` @ 1bb94e19 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0):
- **Owning boundary:** register.js's `place` and its normaliser, the mod's one OS-touching function.
- **Windows:** supported. Tested by `claude plugin test` with `\`, `/`, mixed-case and drive spellings, and live by E1 to E3.
- **macOS and Linux:** the mod is unavailable there. Guardian is not installed there, and no claim is made. T35 and T36 are Node tests: they run on Windows locally and on ubuntu-latest in governance-ci. macOS has no run.
- **R1:** one matcher everywhere (both separators, ASCII case-insensitive), and one staleness predicate.
- **R2 and R4:** no `process.platform` branch, and no drive letter outside `place`'s spelling rules. T35 and T36 use `os.tmpdir()`, argument arrays with no shell, and literal `/` in git paths, and never assume a branch name.
- **R5:** no product level is claimed.
- **R6:** no platform ignore.

**2.13 The parity test** (O-4's addition, round 44, item 1; `state/directives/2026-10-03-guardian-o3-o8-ruling.md:6-8` @ 1bb94e19 sha256:c8120e627ef205c7b4b52194cf1ec75946293229ed7f93c4db7a1b6f90ae19e0).
- **The one fixture set** is the `FIXTURES` array in `scripts/hooks/guardian-continuity-parity.test.mjs`, one entry `{ id, build(dir) }` per §3 parity row. It lives nowhere else.
  - Each fixture is built once, into one fresh `os.tmpdir()` repository, set up as §0.3's existing helpers set theirs up. The helpers are restated, because importing a test file runs its tests.
  - Both sides read that one repository, so both read the same bytes.
  - The plugin's `claude plugin test` side does not read the fixtures, since it has no git. register.js's adapter is covered there by T26 to T32.
- **The mod's side.** `judgeContinuity` is imported from `../../tools/mods/spatial-guardian/hooks/continuity.mjs`: the module N1 calls, unchanged.
  - Its `run` is a Node runner shaped to §0.2 item 6's result type: `spawnSync("git", args, { cwd: dir, encoding: "utf8", timeout: 2000, maxBuffer: 64 * 1024 * 1024 })`.
  - It rejects when `error` is set. Otherwise it resolves `{ exitCode: status, stdout, stderr, isStdoutTruncated: false, isStderrTruncated: false }`.
  - It asserts that each stdout is under 4194304 bytes, so it never stands in for a truncation it does not model.
- **The Stop hook's side.** The test calls `decide` as shipped, with `projectRoot` set to the fixture's directory, a lease this session holds written untracked, and `background_tasks` non-empty. A fresh or not-judged block therefore ends at step 4's allow, and the plan is never read. The outcome is classified as:
  - stale: `decision` is `block` and the reason begins with the stale reason's fixed opening (`scripts/hooks/stop-queue.mjs:338` @ 1bb94e19 sha256:23aa40da8b9b21c24b9869abd4d4e50d7ad7970294628d25acfad92017c51bde, a sub-line span; the line's hash);
  - not judged: `stderr` holds the not-judged line's fixed opening (`scripts/hooks/stop-queue.mjs:330` @ 1bb94e19 sha256:98f151df95cecc5a6f0ab68553c8725d3d6d247c456e5dd0e75fc18b19831033, a sub-line span; the line's hash);
  - fresh: otherwise.
  Both openings are the stale-continuity form's §7 texts. The test writes them out, as `hooks.test.mjs` writes out its reason, rather than importing them.
- **The environment.** The test sets `CUSTODIAN_TELEGRAM_DRY_RUN` and deletes `CUSTODIAN_STOP_HOOK`, `CUSTODIAN_TELEGRAM_BOT_TOKEN`, `CUSTODIAN_TELEGRAM_CHAT_ID` and `CLAUDE_CODE_REMOTE`, restoring each after. There is no network: HALT's fetch fails in a repository with no remote.
- **Agreement (T35).** For each fixture, a subtest named by the fixture's id asserts that the two outcomes are equal. Its message names both outcomes.
- **Non-degeneracy (T36).** Across the set, the Stop hook's side reaches each of stale, fresh and not judged at least once. A set on which both sides read everything the same way, such as git missing, fails.
- **How a divergence fails the gate.**
  - *In CI:* governance-ci's test step (§0.3) runs the new file by its glob. A divergence fails the named subtest, the step and the job. §9 makes green branch CI a precondition of either gate.
  - *In the reviewer's local run:* the same `node --test` command on Windows (§9) runs T35 and T36. Red fails the reviewer's gate.
  - *After the merge:* a PR touching `scripts/hooks/**`, where the Stop hook's side lives, already triggers governance-ci. This piece adds `tools/mods/**` to the push and the pull_request path filters (two lines), so a PR that touches only the mod triggers it too. A divergence then fails that PR's suite, and that piece repairs it under its own form.
- **`scripts/hooks/` changes by one new file only:** `scripts/hooks/guardian-continuity-parity.test.mjs`.
  - No line of `stop-queue.mjs`, `precompact-flush.mjs`, `hooks.test.mjs`, `README.md` or any other existing file there changes.
  - No export is added: `decide` is already exported (§0.3).
  - This touch is governed by this form alone, and no amendment is appended to the stale-continuity form. That form's piece is closed (its Amendment 3). This piece edits no file its §7 lists, and changes none of its claims.

## §3. Fixtures and predicted outcomes

For the plugin tests, the engine's answers are stubbed with the test's `on`, and there are no files on disk. `R` is a repository root spelled `C:\r` or `c:/r`.

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F1 | Bash `git push --force` / `-f` / `push -uf origin x` | none | refused, G1 |
| F2 | Bash `git push --force-with-lease` / `--force-with-lease=main:abc` | none | refused |
| F3 | Bash `git push origin +main` | none | refused |
| F4 | Bash `git push --mirror` | none | refused |
| F5 | Bash `git push --delete origin x` / `-d` / `origin :x` / `--prune` | none | refused |
| F6 | Bash `git -C sub -c a=b push -f`; `bash -c "git push --force"` | none | refused |
| F7 | Bash `git push "origin` (unbalanced) | none | refused |
| F8 | Bash `git push -u origin b`; `git push && rm -f x`; `git commit -m "push -f"` | none | `next(e)` |
| F9 | Write and Edit to `R\docs\01_Principles.md`, `r/DOCS/01_principles.md` | stat resolves | refused, G2 |
| F10 | Write to `R/docs/02_Architecture.md` | stat resolves | `next(e)` |
| F11 | Edit to an ADR whose status first word is `Accepted` | stat, read | refused, G3 |
| F12 | Write to a filed preregistration, content not prefixed by the current bytes | stat, read, cat-file 0 | refused |
| F13 | Write to the same, content = the current bytes + an addition | same | `next(e)` |
| F13e | Edit to the same: `old_string` = the file's last line, once; `new_string` = it + an addition | same | `next(e)` |
| F13x | Edit to the same: `old_string` once but not at the end | same | refused, G3 |
| F14 | Edit to a Proposed ADR; Edit to a preregistration with cat-file exit 128 | stat, read, cat-file 128 | `next(e)` |
| F15 | Write to a filed preregistration, read rejects | stat, read rejects | refused (catch) |
| F16 | Write to an existing `R/state/directives/x.md`; Edit to any such path | stat resolves | refused, G4 |
| F17 | Write to a new `R/state/directives/y.md` | own stat ENOENT, folder resolves | `next(e)` |
| F18 | Write to `D:x` and to `\\h\s\x` | none | refused, unplaceable |
| F19 | lead-data Write to a path not its REPORT PATH | list, messages, stat | refused, G6 |
| F20 | lead-data Write to its REPORT PATH, differently cased | same | `next(e)` |
| F21 | architect Write, brief with no line | list, messages | refused |
| F22 | worker Write; unlisted id Write; main-loop Write | list | `next(e)` (other rules apply) |
| F23 | Write to a filed preregistration, process.run unanswered | stat, read | refused (catch) |
| F24 | the same, process.run rejecting on timeout | same | refused (catch) |
| F25 | Bash in the main loop, percent 79, then 80, stale | usage, git | no line, then one line |
| F26 | percent 81, 85, 89, 90, stale throughout | same | lines at 81 and 90 only |
| F27 | percent 85; a flush-only, then an entry-plus-flush ledger commit | same | no line |
| F28 | percent 85 stale, with `agentId` set; a G-denied call | same | `ran` unchanged |
| F29 | percent 85 (line), 40, 85 | same | a line, none, a line |

**Parity fixtures (T35, T36).** Each is a real repository built by `scripts/hooks/guardian-continuity-parity.test.mjs`, with c0 holding a block with `flushed_at` A, then `## Ledger` and one entry. Each row names the stale-continuity form's scenario it mirrors. The prediction is that both sides read the outcome shown; a different outcome on which the two sides agree is a class 2 deviation, not a divergence.

| # | Mirrors | History | Predicted, both sides |
|---|---|---|---|
| PS1 | §3 S1 | c0, then c1 entry-only | stale |
| PS2 | §3 S2 | PS1, then c2 flush-only (B) | fresh |
| PS3 | §3 S3 | c0, then c1 entry plus flush (B) | fresh |
| PS4a | §3 S4a | a non-repository directory holding `state/CUT-STATE.md` | not judged |
| PS4b | §3 S4b | one commit, README only | fresh |
| PS5 | §3 S5 | c0; side s1 entry-only; main m1 flush-only (B); `merge --no-ff` gives M, differing from both | stale |
| PS6 | §3 S6 | c0; side s1 flush (B), s2 entry-only; main m1 README-only; merge M matches s2 | stale |
| PS7 | §3 S7 | c0 only | fresh |
| PS8 | §3 S8 | PS1, plus the working-tree block rewritten to B, uncommitted | stale |
| PS9 | §3 S9 | c0 (LF), then c1 whole-file CRLF plus an entry, `flushed_at` A | stale |
| PS10 | §3 S10 | c0 padded to 2 MiB, then c1 entry-only | stale |
| PS18 | Amendment 2, item 2 (T18) | c1 commits a block with no `flushed_at` line | not judged |
| PS19 | Amendment 2, item 2 (T19) | c1 removes `state/CUT-STATE.md` | not judged |

## §4. Tests, one mutation each

- **How a mutation is observed** (round 25, item 2 (c)): apply the mutation, run the test's runner, record the failing test by name in its `// RECORDED MUTATION:` comment, and revert. The runner is `claude plugin test tools/mods/spatial-guardian` for T1 to T34, and `node --test scripts/hooks/guardian-continuity-parity.test.mjs` for T35 and T36. The closing record names the commit each mutation was observed at, `claude --version` for T1 to T34, and `node --version` and `git --version` for T35 and T36. A `verify-mutation` run is not an observation.
- **What runs where.**
  - T1 to T34 (`tools/mods/spatial-guardian/test/guardian.test.ts`) need Claude Code, which no runner has. Their evidence of record is: the worker's full `claude plugin test` output, with `claude --version`, at a named commit; the reviewer's own run on the custodian's machine at the gated head; and `claude plugin validate tools/mods/spatial-guardian` and `claude plugin validate tools/mods` outputs, text and `--json`, in the PR body.
  - T35 and T36 (`scripts/hooks/guardian-continuity-parity.test.mjs`) run in governance-ci and in the reviewer's local suite.
  - CI also runs verify-cites, verify-quotes, verify-test-claims and verify:plan.
  - Before relying on verify-mutation, the worker states, at verify-mutation's commit, whether its scan covers `tools/mods/**/*.test.ts`. If it does not, the reviewer reads the comments.
- **The `agentId` cast** in G6's tests follows P0's probe (`state/consults/2026-10-03-guardian-v0-p0-report.md:748` @ 1bb94e19 sha256:4133f2e21ee2b844367e88dbb4f789786e6c95a2239094a0f5b844c58c6d91ac), and the test discloses it.

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T1 | `G1 refuses --force, -f and a short-flag cluster holding f` | F1 | drop the cluster check |
| T2 | `G1 refuses --force-with-lease, bare and with a value` | F2 | match only the bare spelling |
| T3 | `G1 refuses a refspec that begins with +` | F3 | drop the `+` check |
| T4 | `G1 refuses --mirror` | F4 | drop `--mirror` |
| T5 | `G1 refuses a push that deletes a remote ref` | F5 | drop the `:` refspec check |
| T6 | `G1 finds the push after git global options and inside a quoted command string` | F6 | no nested rescan |
| T7 | `G1 refuses a push segment it cannot tokenise` | F7 | treat a tokenise failure as no push |
| T8 | `G1 allows an ordinary push and a force flag that belongs to another command` | F8 | scan the whole command without splitting into segments |
| T9 | `G1 refuses a force-push through the PowerShell tool` (only if Amendment 1 (P0b), item (i), finds it typed) | F1 via PowerShell | drop the PowerShell registration |
| T10 | `G2 refuses a Write and an Edit to docs/01_Principles.md in every spelling` | F9 | a case-sensitive suffix compare |
| T11 | `G2 allows a Write beside docs/01_Principles.md` | F10 | match on the `/docs/` segment |
| T12 | `G3 refuses an Edit to an accepted ADR` | F11 | protect only on a literal `Accepted —` |
| T13 | `G3 refuses a Write that does not start with a filed preregistration's current bytes` | F12 | `includes` in place of `startsWith` |
| T14 | `G3 allows a pure-append Write to a filed preregistration` | F13 | refuse every Write to a protected file |
| T15 | `G3 allows an Edit to a Proposed ADR and to an untracked preregistration` | F14 | ignore cat-file's exit code |
| T16 | `G3 refuses when the current bytes cannot be read` | F15 | catch the read error and allow |
| T17 | `G4 refuses a Write to an existing directive and any Edit under state/directives/` | F16 | refuse Edit only |
| T18 | `G4 allows a Write that creates a new directive` | F17 | refuse on the segment alone |
| T19 | `Write and Edit refuse a path that cannot be placed` | F18 | treat an unplaceable path as unprotected |
| T20 | `G6 refuses a lead-data Write outside its declared REPORT PATH` | F19 | compare basenames only |
| T21 | `G6 allows a lead-data Write to its declared REPORT PATH` | F20 | a case-sensitive compare |
| T22 | `G6 refuses every Write by an architect run whose brief declares no REPORT PATH` | F21 | a missing line read as allow |
| T23 | `G6 leaves other subagents, unlisted agent ids and the main loop to the other rules` | F22 | apply G6 to every listed type |
| T24 | `a refusing hook that throws is refused by its catch` | F23 | remove the Write registration's `.catch` |
| T25 | `a refusing hook whose process call times out is refused` | F24 | a `.catch` that returns `undefined` |
| T26 | `every process call is git and carries the declared timeout` | F12, F25 | drop `timeoutMs` from N1's git adapter |
| T27 | `N1 appends no line below 80 percent and one line at 80 percent on a stale block` | F25 | `>` in place of `>=` |
| T28 | `N1 appends at most one line per 10-point band` | F26 | never record a shown band |
| T29 | `N1 appends nothing on a fresh block` | F27 | N1 skips `judgeContinuity` and treats every block as stale |
| T30 | `N1 appends nothing for a subagent call or a refused call` | F28 | drop the `agentId` check |
| T31 | `N1 clears its bands after the fill falls below 80 percent` | F29 | never clear `shownBands` |
| T32 | `N1's line is the declared text with the integer percent` | F25 | an unrounded percent |
| T33 | `G3 allows an Edit that only appends at the end of a filed preregistration` | F13e, F13x | the `endsWith` check dropped |
| T34 | `G2 to G4 cover MultiEdit` (only if Amendment 1 (P0b), item (ii), finds it typed) | F9 via MultiEdit | drop the MultiEdit registration |
| T35 | `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture` | PS1 to PS19 | M35a, mod side: `continuity.mjs` reads a failed `git log` as judged fresh (PS4a diverges). M35b, Stop side, in the working tree only and reverted, never committed: `judgeContinuity`'s comparison in `stop-queue.mjs` inverted (PS1 diverges) |
| T36 | `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook` | PS1 to PS19 | M36: every fixture's `build` replaced by PS7's |

**E-rows**, live and after install. Each runs only if the human's typed install approval names it, and the custodian records each as a class 1 row on main.
- **E0:** the `/plugin` line, `claude --version`, and whether the installed plugin is a copy of `tools/mods/` or a reference to it (§1).
- **E1 to E3:** an Edit whose `old_string` matches nothing, on `docs/01_Principles.md`, on an existing directive and on an accepted ADR. Predicted: Guardian's reason, never the Edit tool's not-found error. If a rule fails open, the tool writes nothing.
- **E5** (round 43, item 4): a labelled probe lead-data run that declares a REPORT PATH and is asked to Write once to a second scratch path. Predicted: refused. Its expected write-audit VOID is recorded as the probe's. Until E5 passes, the write audit stays primary.
- **E6:** N1's first natural firing. The record carries the percent, the line as the model reports it, and the flush that followed.
- **No live G1 probe**, under round 34, item 3.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- T1 to T33, T35 and T36 pass at the head, and each fails under its mutation. T9 and T34 do the same where Amendment 1 (P0b) brings them in;
- every existing test under `scripts/plan/` and `scripts/hooks/` passes, unchanged;
- `validate` prints only §2.0's hooks and calls;
- E0 to E6 come out as §4 predicts.

**Declared unchanged:** every path outside `tools/mods/` except the two §7 names outside it. In particular:
- every existing file in `scripts/hooks/`: `stop-queue.mjs`, `precompact-flush.mjs`, `hooks.test.mjs`, `README.md`, the scanner and the write audit;
- every line of `.github/workflows/governance-ci.yml` other than the two `tools/mods/**` filter entries;
- `.claude/settings.json`, `.claude/agents/**`, the root `.gitignore`, `AUTONOMY.md` and `AI_DEVELOPMENT.md`;
- `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`, to which no amendment is appended.

**Invalidators (stop, to the custodian):**
- **I1:** P0b contradicts §2; or the test kit cannot answer an event §4 needs; or the build refuses register.js's import of `./continuity.mjs`.
- **I2:** `claude --version` is not 2.1.288 at any run of record. Every plugin test and `validate` is re-run, and the change is recorded.
- **I3:** `validate` shows a hook or call outside §2.0.
- **I4:** a rule needs a call outside §2.0.
- **I5:** §7's file count is exceeded.
- **I6:** any step would install, enable or load the mod into a session, add a marketplace, or write under the user Claude directory.
- **I7:** the `state/CUT-STATE.md` blob at the merge base is 4194304 bytes or more.
- **I8:** T35 cannot be made to pass without editing an existing `scripts/hooks/` file, adding an export to `stop-queue.mjs`, or changing the Stop hook's predicate. Which form would govern that change is the custodian's to route, and it is not made under this one.

**Falsification:**
- a refusal fixture reaches `next(e)`, or an allowed fixture is refused;
- the call of a refusing hook that throws or times out runs;
- N1 fires twice in one band, for a subagent, or on a block `judgeContinuity` does not judge stale;
- on any parity fixture, the mod's outcome and the Stop hook's differ (T35). This fails the gate (round 44, item 1).

## §6. Instruments

Assertions only:
- deny or `next(e)`, the reason text, the `context` array, and the arguments the stubs receive;
- the two parity outcomes per fixture;
- `claude --version`, `node --version` and `git --version`;
- `validate`'s two lines;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings

- `PROCESS_TIMEOUT_MS = 2000` for each git call, in G3 and in N1's adapter.
- `N1_THRESHOLD = 80` and `N1_BAND = 10`. `shownBands` clears below the threshold.
- `N1_TEXT(p)`: the brief's quoted N1 sentence, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ 1bb94e19 sha256:1ca3956c77cd959acc4870fa10506b1eef14b1f5449899f47d5864d2d32d1f41 (a sub-line span; this is the line's hash), with `N` replaced by the integer `p`. It is byte-copied into the code, and T32 asserts it.
- The protected forms: the suffix `/docs/01_principles.md`; the ADR suffix pattern `/docs/adr/adr-<digits>-<name>.md` with its 10-line status window; the basename ending `preregistration.md`; the segment `/state/directives/`.
- The report-only types: `architect`, `lead-data`, `evidence-reader`. The line pattern: `^REPORT PATH: (.+)$`.
- **The parity values:**
  - the fixture ids PS1, PS2, PS3, PS4a, PS4b, PS5, PS6, PS7, PS8, PS9, PS10, PS18, PS19, thirteen in all. T35 asserts the set is exactly these;
  - the runner's per-call timeout is 2000 ms, its buffer 64 MiB, and its stdout bound 4194304 bytes;
  - the ledger path is `state/CUT-STATE.md`.
- **Reasons**, each starting `spatial-guardian <id>:`, with no path from the call, and worded for the human's sight before install (§9). The worker writes each as one sentence, and the strings are §7's declared values. In paraphrase:
  - `G1_REASON`: refused, because this git push force-pushes or deletes a remote ref (round 34, item 3);
  - `G2_REASON`: docs/01 is never edited;
  - `G3_REASON`: an accepted ADR or a filed preregistration changes only by appending;
  - `G4_REASON`: an existing directive is never rewritten;
  - `G6_REASON`: this run writes only its brief's REPORT PATH;
  - `UNPLACEABLE_REASON`: the path cannot be placed, so it is refused;
  - `CATCH_REASON`: a check could not complete, so the call is refused.
- **Size:** at most 1650 changed lines, insertions plus deletions, over at most 10 files:
  - `tools/mods/.claude-plugin/marketplace.json`;
  - `tools/mods/spatial-guardian/.claude-plugin/plugin.json`;
  - `tools/mods/spatial-guardian/hooks/hooks.json`;
  - `tools/mods/spatial-guardian/hooks/register.js`;
  - `tools/mods/spatial-guardian/hooks/continuity.mjs`;
  - `tools/mods/spatial-guardian/test/guardian.test.ts`;
  - `tools/mods/spatial-guardian/README.md`;
  - `tools/mods/spatial-guardian/.gitignore`;
  - `scripts/hooks/guardian-continuity-parity.test.mjs`;
  - `.github/workflows/governance-ci.yml`, two added lines.
  - Counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/GUARDIAN-V0-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main and `<head>` a named commit. An overrun is class 8, and this line is never edited.
  - Estimate: register.js 380, continuity.mjs 70, plugin tests 700, parity test 260, README 100, the workflow 2, the rest 40.
- **Minutes:** the node's `budget_minutes` (AUTONOMY §10).

## §8. Block-on-sight

1. A `tool.check` hook; an `allow`; `next(` called with anything but the received event; a `$.model`, `$.ui`, prompt, network or write call; any `$.fs.write`.
2. A refusing registration without `.catch`, or a `.catch` body that is not a synchronous constant deny.
3. A `$.process.run` call site without `timeoutMs` at or under §7, or whose `argv[0]` is not the literal `git`.
4. A `turn.step` or `agent.spawn` hook; a `$.store` call; a hook or call outside §2.0.
5. Any G5 code, test, option or placeholder (round 43, item 3). Code for §2.10's extension before Amendment 1 (P0b), item (ii), is recorded. N1 code on the summary-breakdown route before item (v) is recorded.
6. An npm dependency, a `package.json` or a lockfile; `.claude-plugin/types/` committed.
7. Any install, enable, marketplace add, `--plugin-dir` session, or write under the user Claude directory, by anyone in the piece.
8. A README that names `disableAllHooks` as an off-switch, or a `project` or `local` scope.
9. A copy of the scanner's matcher.
10. An OS branch in path logic; a drive-letter assumption outside `place`; a path from the call in a reason.
11. A user-profile path in any file, test or commit message.
12. A test without its `RECORDED MUTATION`; a record that calls a `verify-mutation` run an observation; a mutation recorded without its observation commit.
13. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class 9 amendment.
14. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - a pin read as current;
    - a correction round without its superseded index;
    - an amendment numbered before Amendment 1 (P0b).
15. A file outside §7's list, apart from this form and the custodian's generated set.
16. A squash or rebase merge, or any force-push.
17. A reason that states another module's consequence (round 7).
18. On the parity test:
    - a second staleness predicate anywhere in the plugin;
    - `continuity.mjs` with an import, a `$` call, or an export other than `judgeContinuity`;
    - T35 reading the Stop hook's side through anything other than the shipped `decide`, such as a restated copy;
    - a fixture defined outside `FIXTURES`, or read by one side only;
    - a `skip`, `todo` or platform condition on T35 or T36;
    - a divergence waived, or a fixture dropped to clear one;
    - any edit to an existing `scripts/hooks/` file, or a new export there.

## §9. Gates

- **Architect:**
  - the Gating heads;
  - the brief's §1 to §5 against §2;
  - each ruling against §2: round 43, items 3 and 4; round 44, item 1;
  - the parity design (§2.13) against round 44, item 1: one fixture set, both sides, and the failure route in CI and locally;
  - the seams (§1);
  - R1 to R6 against §2.12;
  - round 7 on §7's reasons;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - `claude plugin test` and both `validate` runs on the custodian's machine, with `claude --version`;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, with T35 and T36 named in its output;
  - every mutation observed at the gated head, including M35a, M35b and M36;
  - §7 recounted;
  - §8 item 3 checked by reading every `$.process.run` call;
  - I7 checked at the merge base.
- **Suites, green before either gate:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, and governance-ci on ubuntu-latest;
  - §6's tools;
  - the branch CI read before gating.
- **Operator:**
  - the human sights §7's reasons and the README's install and off steps;
  - then gives his typed install approval, which names the E-rows he allows;
  - he installs it himself;
  - the custodian records E0 to E6.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index). Amendment 1 is P0b's record (§0.4); nothing precedes it.

### Amendment 1 — P0b: the types read (class 1)

Written after the read, before any code (a post-result amendment, §0.4). References only. The file read is `<skill-root>/types/claude-code.d.ts`, sha256 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1, checked equal to §0.1's before the read. `claude --version` printed 2.1.288 (Claude Code), so I2 did not fire. No finding contradicts §2, so I1 did not fire.

- **(i) PowerShell: typed.**
  - The union is built per tool name from the built-in table: `<skill-root>/types/claude-code.d.ts:836-838`, `<skill-root>/types/claude-code.d.ts:11951`, `<skill-root>/types/claude-code.d.ts:11961`.
  - Its entry is `<skill-root>/types/claude-code.d.ts:15440-15442`: the command field is `command`, a string, as Bash's is (`<skill-root>/types/claude-code.d.ts:15177-15179`).
  - §2.2 and §2.0 therefore add `tool.call{tool=PowerShell}` and §4's T9 applies.
- **(ii) MultiEdit: not typed. NotebookEdit: typed.**
  - The string `MultiEdit` occurs nowhere in the file (a search over the file whose sha256 is the one above). The table's entries run from `<skill-root>/types/claude-code.d.ts:15414` (Monitor) to `<skill-root>/types/claude-code.d.ts:15427` (NotebookEdit) with no entry between them.
  - NotebookEdit's entry is `<skill-root>/types/claude-code.d.ts:15427-15429`, and its path field is `notebook_path`. Edit's and Write's path field is `file_path`: `<skill-root>/types/claude-code.d.ts:15265-15271` and `<skill-root>/types/claude-code.d.ts:15752-15757`.
  - §2.10's extension applies to NotebookEdit alone. No MultiEdit registration is written. G2, G3, G4 and G6 treat a NotebookEdit as an Edit that is not append-shaped, on `notebook_path`. T34 is written over NotebookEdit (fixture F9 through NotebookEdit; mutation: drop the NotebookEdit registration), because §4 names MultiEdit only as the case the extension would cover.
- **(iii) The row type of `$.session.messages`.**
  - A row is `{ role, text, toolUses }`, with `toolResults` optional on a user row: `<skill-root>/types/claude-code.d.ts:10449-10475`.
  - With `{ agentId }` the call resolves the rows or `{ deny }`, and the doc says the newest 4096 entries come back: `<skill-root>/types/claude-code.d.ts:2535-2551`, `<skill-root>/types/claude-code.d.ts:10579-10586`.
  - The types do not say the first row is the Agent call's prompt. §2.7's first-row reading is therefore the form's own, and E5 settles it live. G6 reads a `{ deny }` result, an empty list and a first row with no matching line alike as no REPORT PATH line, which refuses.
- **(iv) The `context` field.**
  - Its doc lines are `<skill-root>/types/claude-code.d.ts:12019-12027`: text the model reads after the tool's result and the user never sees, none from core, kept whole from `next`, no entry empty, cut past 100,000 (200,000 together).
  - N1 appends one non-empty entry to the array it received, as §2.8 states.
- **(v) The test kit, and the summary breakdown.**
  - A test's `on` hooks sit beneath every plugin, and an unanswered event throws at the bottom: `<skill-root>/types/claude-code.d.ts:14915-14922`.
  - `fs.stat`, `agent.list` and `session.messages` are each a call on `$` served as an event, whose hooks answer `{ value }` or `{ deny }` (the caller's promise then rejects: `<skill-root>/types/claude-code.d.ts:13698-13699`): the arguments at `<skill-root>/types/claude-code.d.ts:6633-6636`, `<skill-root>/types/claude-code.d.ts:6534` and `<skill-root>/types/claude-code.d.ts:6474`; the values at `<skill-root>/types/claude-code.d.ts:6820`, `<skill-root>/types/claude-code.d.ts:6789` and `<skill-root>/types/claude-code.d.ts:6761`; the result shape at `<skill-root>/types/claude-code.d.ts:6734-6737`.
  - `fs.read`, `process.run` and `session.usage` are served the same way: `<skill-root>/types/claude-code.d.ts:6606-6609`, `<skill-root>/types/claude-code.d.ts:6706` and `<skill-root>/types/claude-code.d.ts:6496`.
  - `{ breakdown: "summary" }` estimates locally and sends no request: `<skill-root>/types/claude-code.d.ts:11048-11056`.
  - The breakdown carries `percentage`, `totalTokens` over `rawMaxTokens`, the compaction window: `<skill-root>/types/claude-code.d.ts:10195-10209`. It is present only when the call passed `breakdown` and a session is bound: `<skill-root>/types/claude-code.d.ts:10282-10288`.
  - §2.8's summary-breakdown route applies, and `p` is `breakdown.percentage`. When `breakdown` is absent `p` is absent, and N1 returns `ran`. The plain `context.percent` route is not used, so the README carries no disclosure about it.

**Superseded index.** None.

### Amendment 2 — scope addition: G1 reads subshells, substitutions, backticks and braces (class 9)

Scope addition, by round 46, item 1, made after gate 1's outcomes were seen (`state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:95-100 @ 257827d1 sha256:5f7aa2e83256e3d0798a846874e782720544c72336b910ac5518658c785c2341`; `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:29-35 @ 257827d1 sha256:789ae8e28c8c55f689eb992e34e4151aeb77ef4f1e592737a1a279111a6475d2`). It is declared under class 9 (`docs/PREREGISTRATION-TEMPLATE.md:170 @ 257827d1 sha256:42297d7cc39d169c3b8c86e5faf21d1cad61a7e6db2a002da9c2dd567b8545f4`) before any code of the addition. adfcb857 below is adfcb85709c9ca19032a68866e0ca687da5c3a9c, a branch commit, named in words with no hash (round 15 (e); round 25, item 2 (d)).

**§2.2, added: a second reading.** G1 reads `e.command` twice and refuses when either reading refuses.
- The first reading is §2.2 as written, unchanged (lines 51-220 of `tools/mods/spatial-guardian/hooks/register.js` at adfcb857).
- The second reading splits at §2.2's boundaries and also at `(`, `)`, `{`, `}` and the backtick, each outside quotes and not escaped by a backslash. Each of its segments goes through the first reading's per-segment steps unchanged: the unbalanced-quote refusal; the rescan of a quoted token holding `git` and `push`, which itself runs both readings under the same depth count and cap; and the git, global-options, `push` and argument check.
- `$(`, `<(` and `>(` need no boundary of their own, because the `(` splits them.
- Why both readings: the second alone would move a forcing argument that a substitution supplies (`git push $(echo -f)`) out of its push segment, and the first refuses that today. Keeping the first makes the refusal set a superset of today's (F31, T38).
- `{`: bash's `{` is a reserved word only as its own word, so `{ git push -f; }` is its own token and is refused today (gate-1 reviewer, `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:33 @ 257827d1 sha256:023c3a713a90c38bce81d684091eea8a732c37a5b26453880e2ea8b004eb7011`); F31 holds it. The `{` and `}` boundaries are for a block written flush against a brace, which PowerShell allows (`& {git push -f}`), since G1 serves the PowerShell registration too (Amendment 1 (P0b), item (i)).
- Unchanged: `isGit`, the tokeniser, `pushArgumentsRefuse`, `MAX_RESCAN_DEPTH`, `G1_REASON` and both G1 registrations. No hook, call, option, export, flag or file is added.

**Over-refusal this adds.** Text that is never run is now refused when it holds a force-push spelling inside `( )`, `$( )`, backticks or braces. That text is a quoted argument (a commit message, an `echo` string, even single-quoted), a heredoc body line, or a shell comment. Before this change, only the bare spelling in that text was refused, through the quoted-token rescan and the newline split (lines 84 and 211-216 of `register.js` at adfcb857). The likely case in this repository is a markdown code span naming a force-push in a heredoc body. Record text written with the Write tool is not read by G1.

**§1, may not claim, G1 line, added:** brace expansion, variable expansion, `eval` of a variable, and PowerShell's backtick escape and line continuation. G1 reads every command, PowerShell's included, by §2.2's bash-shaped rules.

**§2.11, the README adds, in words, with no quotation** (the gates' S2-2: `state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:95-100 @ 257827d1 sha256:5f7aa2e83256e3d0798a846874e782720544c72336b910ac5518658c785c2341`):
- R1: the G1 row names the second reading;
- R2: the §1 G1 additions above;
- R3: G1's over-refusals: the text-that-is-not-run case above, in bare and wrapped spellings; `echo git push -f`; a long-option abbreviation; and the advice to write record text with the Write tool (worker list, `state/consults/2026-10-03-guardian-v0-worker-report-1.md:245 @ 257827d1 sha256:5aabed003d97fa43b7e0c2a1d1e9556da9f01d288b6350853c44c7d6619729ef`; heredoc lines, `state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:76 @ 257827d1 sha256:f6c2856362f185a5bd7e4cad70ffdf4c32c5776a38fa5a16b3ed7882d0ad862f`);
- R4: G6 reads the first row of the newest 4096 rows, so a lead-data run longer than that loses its REPORT PATH line and every write is refused (`state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:77 @ 257827d1 sha256:ab26841c043d15445726c8dc8b351649a0076f4d770adfa740242660b4b04fee`);
- R5: G3's case-alias miss, already stated at line 31 of `tools/mods/spatial-guardian/README.md` at adfcb857, kept;
- R6: a Write that creates a new file passes only when the engine's rejection for a missing path names ENOENT; otherwise every such Write is refused, until E4 (Amendment 3) shows the live shape.
The correction round lands these in the README. The closing record cites the README lines at a main commit after the merge and does not restate them.

**§3, added.**

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F30 | Bash `(git push -f origin main)`; `x=$(git push --force origin main)`; `` echo `git push -f` ``; `echo "$(git push -f)"`; `cat <(git push --force)`; PowerShell `& {git push -f}` and `$(git push --force)` | none | refused, G1 |
| F31 | Bash `{ git push -f; }`; `f() { git push -f; }`; `sudo git push -f`; `env GIT_X=1 git push --force`; `git push origin main --force`; `git push $(echo -f)`; `git push origin $(echo +main)`; `` git push `echo -f` `` | none | refused, G1 (each refused at adfcb857) |
| F32 | Bash `(cd sub && git push -u origin b)`; `x=$(git rev-parse HEAD) && git push origin "$x"`; `` echo `git log -1` ``; `git commit -m "fix (scope)"` | none | `next(e)` |

**§4, added**, in `tools/mods/spatial-guardian/test/guardian.test.ts`, run and observed as §4 states:

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T37 | `G1 finds a force-push inside a subshell, a substitution, backticks or a brace block` | F30 | the second reading dropped |
| T38 | `G1 keeps every refusal it made before the second reading` | F31 | the first reading dropped (only the second runs) |
| T39 | `G1 allows an ordinary push inside a subshell and a substitution that does not push` | F32 | the second reading refusing every segment that holds git then push, without its argument check |

The worker re-observes the mutations of T1 to T9 at the correction commit, because the G1 code beneath them changes, and records that commit in each comment.

**§5, added.** Predictions: T37 to T39 pass at the head, and each fails under its mutation. Every F1 to F29 outcome and every T1 to T36 result is unchanged, and so are `validate`'s hooks and calls lines. Declared unchanged: everything outside G1's code in `register.js`, every §7 value, and §7's file list. Invalidators: **I9**, the two readings change any F1 to F29 outcome; **I10**, the addition needs a file outside §7's list, a hook or call outside §2.0, or a changed §7 value. Falsification: an F30 or F31 spelling reaches `next(e)`, or an F32 call is refused.

**§7.** The size line stands and is not edited. This amendment raises no ceiling: class 9 declares §2, §4, §5, §8 and §9 items, and a §7 overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 257827d1 sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`). At adfcb857, §7's command gives 1555 lines over 10 files (`state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:67 @ 257827d1 sha256:27e6796639c57164cb99a8719e0e31a210e020efbd87d17f1bec9309ccce7f82`). Estimate for this addition: `register.js` 20, plugin tests 50, README 15, no new file. If §7's command at the correction head exceeds 1650 lines or 10 files, a class 8 amendment records it before gate 2.

**§8, added.** 19. A G1 change that removes, narrows or reorders the first reading. 20. A second-reading boundary applied inside quotes or after a backslash. 21. A G1 change outside `register.js`'s G1 section, or any new hook, call, option, export or §7 value for it.

**§9, added.** Architect: this amendment against round 46, item 1, and both gate-1 G1 probe sets; the README against R1 to R6; §8 items 19 to 21; §7's count and class 8 if it is due. Reviewer: the gate-1 reviewer's seven G1 spellings and F30 to F32, run through the shipped `pushRefused` in a scratch copy outside the repository; T37 to T39 and every re-observed mutation, observed at the gated head.

**Superseded index.** None. This amendment adds to §1, §2.2, §2.11, §3, §4, §5, §8 and §9, and replaces no earlier line.

### Amendment 3 — sight-list addition: E4, a live new-file Write (class 7)

Sight-list addition (class 7, `docs/PREREGISTRATION-TEMPLATE.md:132 @ 257827d1 sha256:887315ee7d890efa6351ce6098a7d62b55da3e9f1b49a9d0ea8c82aae40ef494`), by round 46, item 2, made after gate 1's outcomes were seen. Evidence: `state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:102-106 @ 257827d1 sha256:6727a6e3eae2a09ed334b749021e8878983b68aa8a57ed612ad7ffe5c8994d1d`, `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:37 @ 257827d1 sha256:195ec1563bf5a4d725adce4907d4c6845f5a81d268ca33caf0b71610ca8ed7be` and `state/consults/2026-10-03-guardian-v0-worker-report-1.md:244 @ 257827d1 sha256:40d163caed730c830bf76ff6bdc229f9d41518d7365b81335928552135d08334`. No claim elsewhere changes.

- **E4** joins §4's E-rows, in the unused E4 slot. It runs after install, and only if the human's typed install approval names it.
- **The call:** one Write in the main loop (no `agentId`, so G6 does not run) that creates a new file in the session's scratchpad folder. The folder exists, and the path is under none of §7's protected forms.
- **Predicted:** Guardian passes the call to `next(e)` and the file is written. This proves live that `place`'s missing-file branch receives a rejection naming ENOENT.
- **Recorded** by the custodian, as a class 1 row on main like every E-row: `claude --version`; the folder, named in words with no path (round 29's exposure rule); and the outcome, either written or the tool result's reason text byte-copied by script.
- **A refusal falsifies the prediction.** The row names the reason (`CATCH_REASON` is the case where the rejection does not carry ENOENT), and the custodian takes it to the human as his first item. Guardian's install state stays the human's.
- §9's Operator line (E0 to E6) and §5's E-row prediction already cover E4. §1's first may-not-claim bullet keeps the live rejection shape unclaimed until E4 runs.

**Superseded index.** None.

### Amendment 4 — scope addition: the PowerShell route for G6, the shell-route answer in §1, and I2's build record (class 9; Part C is class 1)

Scope addition, by the 2026-10-04 shell-route ruling (`state/directives/2026-10-04-guardian-shell-route-ruling.md:6-9 @ d55458c5 sha256:d01f6c204e6e80eab36831902d0b7d29d48dfbee46960313ed3a60d33b24687c`; RULED 2026-10-04, the shell-route block in `DECISIONS-PENDING.md`, cited by its heading and not by line), made after gate 1's outcomes and worker report 2's I2 stop were seen (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:26 @ d55458c5 sha256:639f069479db3b86d7e20a2ad99ef165a14eae388aa4e988ba898a0798402775`). It is declared under class 9 (`docs/PREREGISTRATION-TEMPLATE.md:170 @ d55458c5 sha256:42297d7cc39d169c3b8c86e5faf21d1cad61a7e6db2a002da9c2dd567b8545f4`) before any code of the addition, and its code lands in the same correction round as Amendment 2's. de6a2c02 below is de6a2c0212cb5026f7d71d08557eb36078793257, a branch commit, named in words with no hash (round 15 (e); round 25, item 2 (d)).

**Part A — §1, added: the shell-route answer.** The ruling asks for it in §1, either way. **The answer is yes: PowerShell.**
- The build types it, with the string field `command`: Amendment 1 (P0b), item (i), read at 2.1.288.
- This machine's session exposes it: the custodian observes that the custodian's own session, running 2.1.288, holds a PowerShell tool (the RULED block above).
- At 2.1.289, `claude plugin validate` lists `tool.call{tool=PowerShell}` on its hooks line at the unchanged head (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:53 @ d55458c5 sha256:2995eafe0c672fd73df5d56fede99a97149eb95ebf26e934733ab802979a0139`). That shows the registration is read, and not that the tool is typed or exposed at 2.1.289.
- **Not established at 2.1.289:** the PowerShell entry and its `command` field in 2.1.289's types, which are not readable here without loading a skill in a 2.1.289 process (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:1 @ d55458c5 sha256:e334ba99407e90973ffeafa22f129b304a4971b3fa3f9729a290b855c32a710b`); whether a 2.1.289 session exposes the tool; which subagent types receive it. None of the three report-only definitions lists a shell tool (`.claude/agents/architect.md`, `.claude/agents/evidence-reader.md` and `.claude/agents/lead-data.md`, line 4 of each at d55458c5, named in words as §0.3 names them).

**Part B — the route (class 9).**

*The reading taken.*
- G1 hooks the PowerShell tool already: its registration is line 433 of `tools/mods/spatial-guardian/hooks/register.js` at de6a2c02, and T9 (lines 194-202 of `tools/mods/spatial-guardian/test/guardian.test.ts` at de6a2c02) proves it.
- G2 to G4 guard writes by a tool's path field (§2.1(d)), and they guard no shell write on Bash (§2.10). A shell call carries no path field. On this reading G2 to G4 hook nothing on the PowerShell tool, and §2.10's limit names both shells.
- G6 guards a report-only run's writes. A shell call by such a run is a write route that no path can place, and the write audit already voids any Bash or PowerShell call by such a run (`scripts/hooks/subagent-write-audit.mjs:11-16 @ d55458c5 sha256:5d86d6268af40459a1daab001a4fdc830765d840fdf3462f2d9d31d2e7087c92`). G6 therefore closes that route on the PowerShell tool without reading the command.
- This reading is the architect's, and the custodian puts it to the human as a question. Every option offered keeps the G6 code below, so that code does not wait. Gate 2 waits on the answer, and any option that adds code is declared by a further class 9 amendment before any of it.

**§2.7, added: the shell route.**
- The PowerShell registration's hook runs G6, then G1, then `next(e)`. It replaces `refuseForcePush` as that registration's hook (line 433 of `register.js` at de6a2c02). The registration's filter and its `.catch` are unchanged.
- G6: with `e.agentId` unset, it makes no `$` call. Otherwise it calls `g6Refusal` (lines 342-358 of `register.js` at de6a2c02), unchanged, with no placed target, because a shell call has none. A report-only row therefore always ends in `G6_REASON`, or in `CATCH_REASON` when a read rejects, whatever the command. Any other row, or no row, goes on. The command string is not read.
- G1: `refuseForcePush`, as §2.2 and Amendment 2 state.
- Its reads are `$.agent.list`, and for a report-only row `$.session.messages` and `$.fs.stat` on the declared path. All are in §2.0.
- **§2.1(g), added:** the order in the PowerShell hook is G6 (when `agentId` is set), then G1, then `next(e)`.
- Unchanged: `g6Refusal`, `refuseForcePush`, `pushRefused`, the Bash registration, the Write, Edit and NotebookEdit guard, and every reason. No hook, call, option, export, flag, reason or file is added.

**§2.10, third bullet, replaced:** G2 to G4 read no shell command, on Bash or PowerShell, so a shell write (`sed -i`, a redirect, `tee`, `Set-Content`) to a protected path is not refused by them. G6 refuses every PowerShell call by a report-only subagent. A report-only subagent's Bash call is untouched by G6, as before.

**§1, may not claim, the Bash-and-PowerShell writes bullet, replaced:** writes by Bash or PowerShell, except that G6 refuses every PowerShell call by a report-only subagent; and any live G6 shell refusal, because no report-only definition holds a shell tool (Part A), so there is no E-row for it.

**Over-refusals this adds.**
- A report-only subagent's PowerShell call is refused even when it only reads or writes its own REPORT PATH. Its route is the Write tool. No such definition holds the tool today (Part A), so this is defensive.
- Any other subagent's PowerShell call is refused by the catch when `$.agent.list` rejects (fail closed, §2.1(b)).
- None on the main loop, where the hook makes no `$` call (T41).

**§3, added.**

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F33 | lead-data, brief declaring a REPORT PATH: PowerShell `Get-Content C:\r\x.md`, and `Set-Content -Path <its REPORT PATH> -Value y`; architect, brief with no line: PowerShell `Get-Location` | list, messages, stat | refused, G6 |
| F34 | a `worker` row: PowerShell `git status`; an unlisted id: PowerShell `git status`; a `worker` row: PowerShell `git push --force` | list | `next(e)`; `next(e)`; refused, G1 |
| F35 | main loop: PowerShell `Set-Content C:\r\notes.md x`, then `git push -f` | none | `next(e)`; refused, G1 |

**§4, added**, in `tools/mods/spatial-guardian/test/guardian.test.ts`, run and observed as §4 states:

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T40 | `G6 refuses every PowerShell call by a report-only subagent and leaves other subagents to G1` | F33, F34 | the PowerShell registration's hook set back to `refuseForcePush` (G6 dropped from it) |
| T41 | `G6 makes no engine call on a main-loop PowerShell call` | F35 | the `agentId` condition dropped, so G6 runs on a main-loop call |

T41 arms no `agent.list` answer, so under its mutation the unanswered call throws and the catch refuses. The `agentId` cast follows §4's. The worker also re-observes T22's and T23's mutations at the observation commit, because `g6Refusal` gains a caller and both mutations are predicted to fail T40 as well, and records that commit in each comment.

**§5, added.**
- Predictions: T40 and T41 pass at the head, and each fails under its mutation. Every F1 to F32 outcome and every T1 to T39 result is unchanged. `validate`'s hooks line is unchanged and its calls line names the same six calls. A difference confined to a `(via …)` annotation is recorded as class 2, not I3.
- Declared unchanged: what Part B's §2.7 lists, every §7 value, and §7's file list. Amendment 2's §5 sentence that declares everything outside G1's code in `register.js` unchanged now makes an exception for this hook.
- Invalidator: **I11**, the shell route needs a change to `g6Refusal`, a hook or call outside §2.0, a new reason or §7 value, or a file outside §7's list.
- Falsification: an F33 call reaches `next(e)`; an F34 or F35 call that does not force-push is refused; an F35 call makes a `$` call.

**§8, added.**
22. G2, G3 or G4 code on a shell registration, or a G6 check that reads a shell command, before the human's answer to the custodian's question and, for any option other than the reading taken, its class 9 amendment.
23. Any `$` call on a PowerShell call whose `agentId` is unset.
24. Under this amendment: a change to `g6Refusal`, `refuseForcePush`, the Bash registration or the Write, Edit and NotebookEdit guard; or a new reason, hook, call, option, export or §7 value.

**§9, added.**
- Architect: this amendment against the shell-route ruling and its RULED block; Part A against its sources; the human's answer filed and cited by round and item, and any further amendment before its code; §8 items 22 to 24; Part C against the correction head's runs; §7's count, and class 8 if it is due.
- Reviewer: the T40, T41, T22 and T23 mutations, observed at the gated head; `claude --version` reading 2.1.289 on every run of record.

**§2.11, the README adds, in words, with no quotation:**
- R7: Part A's answer.
- R8: the G6 row names the PowerShell route.
- R9: the shell-write limit as §2.10 now states it.
- R10: lines 5 and 36 of `tools/mods/spatial-guardian/README.md` at de6a2c02 name 2.1.289 for the tested behaviour and 2.1.288 for the type reads.

**§7.**
- The size line stands and is not edited.
- Estimate for this addition: `register.js` 12, plugin tests 55 (the T22 and T23 comments included), README 10, no new file.
- With Amendment 2's estimate of 85 and the 1555 lines its §7 records at adfcb857, the combined figure is about 1717. That is over 1650, so an overrun is predicted.
- The worker runs §7's command at the correction head and records the figure. If it exceeds 1650 lines or 10 files, a class 8 amendment (`docs/PREREGISTRATION-TEMPLATE.md:169 @ d55458c5 sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716`) records the declared figure, the final figure at the named commit and the reason, before gate 2.

**Part C — I2's record (class 1).** Post-result record, written after worker report 2's I2 stop was seen (class 1, `docs/PREREGISTRATION-TEMPLATE.md:103-105 @ d55458c5 sha256:bf67639cc8f151ef4bd47156a7421ec9b89bf85e602bbb8e20575c02edbf54ed`).
- **The change.** `claude --version` read 2.1.288 at every run of record through adfcb857 (Amendment 1's opening paragraph; the observation comments). It read 2.1.289 at correction round 1's first run of record (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:26 @ d55458c5 sha256:639f069479db3b86d7e20a2ad99ef165a14eae388aa4e988ba898a0798402775`). The installed binary was replaced after the human's restart on 2026-10-04, and the custodian's running session stays 2.1.288 (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:1 @ d55458c5 sha256:e334ba99407e90973ffeafa22f129b304a4971b3fa3f9729a290b855c32a710b`).
- **How the 2.1.288 claims stand.** §0.1, §0.2 and Amendment 1 (P0b) are claims about build 2.1.288 (round 15 (c)). They are true of that build, and none is read as current for 2.1.289. The round does not re-read the types; Part A says why. At 2.1.289 the code relies on them only as far as the correction head's runs prove: the test kit, the engine's dispatch and `.catch` path (§0.2 items 5 and 6), and `validate`'s two lines (item 7). E0 records `claude --version` at install.
- **The unchanged head at 2.1.289.** 34 pass, and both `validate` targets exit 0, text and `--json`, with §2.0's hooks and calls (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:27-31 @ d55458c5 sha256:feeeb20f7947fc1a0ff97a354d55f6e41ea7edad512a4281db582411718cbb6f`). This is evidence about de6a2c02 only, not about the correction head.
- **What the round re-runs and records at 2.1.289, at the correction head:**
  - `claude --version`;
  - `claude plugin test tools/mods/spatial-guardian`, T1 to T34 and T37 to T41;
  - `claude plugin validate` on `tools/mods/spatial-guardian` and on `tools/mods`, text and `--json`;
  - the node suites and §6's tools, each tool named with its commit;
  - at the observation commit, every mutation whose code or failing set this round changes: T1 to T9 (Amendment 2), T22 and T23, and T37 to T41.
  The other mutation comments keep their 54eba872 observations at 2.1.288. Those stay true as records of that commit and are not edited. The reviewer observes every mutation at the gated head (§9), and the closing record names each observation's commit and build.
- **From this amendment, 2.1.289 is the build of record.** §5 I2's line is not edited, and a run of record at any build other than 2.1.289 fires I2 again. §1's may-claim items 1 and 4 hold at 2.1.289 once the correction head's runs pass. §1's build bullet now reads: any build other than 2.1.289 for the tested behaviour; the type reads remain 2.1.288's.

**Superseded index.**
- §1, may claim, items 1 and 4: the build is 2.1.289 (Part C).
- §1, may not claim: the build bullet (Part C), and the Bash-and-PowerShell writes bullet (Part B).
- §2.1(g): the PowerShell hook's order is added (Part B).
- §2.10, third bullet: replaced (Part B).
- §5, I2: its build of record is 2.1.289 (Part C).
- Amendment 2, §5, its declared-unchanged sentence for `register.js`: it now makes an exception for Part B's hook.
This amendment adds to §1, §2.7, §2.11, §3, §4, §5, §8 and §9, and replaces no other line.

### Amendment 5 — scope addition: G6's shell refusal is a backstop (class 9)

Scope addition, by the 2026-10-04 G6-backstop ruling (`state/directives/2026-10-04-guardian-g6-backstop-ruling.md`; RULED 2026-10-04, the G6-backstop block in `DECISIONS-PENDING.md`, cited by its heading and not by line), made after gate 1's outcomes were seen. It is written by the custodian from the ruling, and declared under class 9 before any code of the addition. Its README line lands in the same correction round as Amendments 2 and 4. Nothing below quotes the ruling; every restatement is a paraphrase.

**§1, added: G6's shell refusal is a backstop.**
- The report-only agents' definitions (architect, lead-data and evidence-reader) grant no shell tool (Amendment 4, Part A). G6's refusal of a report-only subagent's PowerShell call (Amendment 4, Part B) is therefore a backstop, not the guard those agents rely on. Their definitions' tool lists are that guard, and the write audit stays the primary check of their runs (§2.7).
- G6 covers the PowerShell tool today. It does not cover the Bash tool (round 48, option A).
- Under the ruling, if any report-only definition gains Bash or PowerShell, G6 must cover that tool before the definition change merges. For Bash that means a G6 change, declared by its own amendment or piece, landing first.

**§2.11, the README adds, in words, with no quotation:** R11, the backstop statement and the condition on definition changes above, including that G6 does not cover Bash today.

**§5, added.** Declared unchanged: every code path and test. This amendment adds no code, test, mutation, hook, call, reason or §7 value. Estimate: README 4 lines.

**§8, added.** 25. A README or §1 text that presents G6's shell refusal as the primary guard for report-only agents, or that omits the condition on definition changes.

**§9, added.** Architect and reviewer: R11 and §1's addition against this amendment and the G6-backstop ruling.

**Superseded index.** None.

### Amendment 6 — budget overrun, §7 not edited (class 8)

Budget overrun, §7 not edited (class 8, round 25, item 2 (a)), recorded by the custodian after correction round 1's count was seen. 7fa2a67e below is 7fa2a67e3a36bd024f4e97676294e143b8e65a3f, a branch commit, named in words with no hash (round 15 (e)).
- **Declared:** at most 1650 changed lines over at most 10 files (§7, as Amendment 2 and Amendment 4 left it, unedited).
- **Final:** 1700 changed lines (1700 insertions, 0 deletions) over 10 files, by §7's own counting command at 7fa2a67e, against the merge base with main a30108a1. That is 50 lines over the line bound, and the file count is within its bound.
- **Reason:** three scope additions on standing rules, each declared under class 9 before its code: Amendment 2 (G1's second reading, its tests and the README limits; round 46, item 1), Amendment 4 (G6 on the PowerShell route, its tests and the README lines; the 2026-10-04 shell-route ruling) and Amendment 5 (README item R11; the 2026-10-04 G6-backstop ruling). At adfcb857, before them, the figure was 1555. Amendment 4's §7 predicted the overrun.
- §7's line is not edited.

**Superseded index.** None.

### Amendment 7 — closing record (references and hashes only; the record cap)

*Written by the custodian after PR #169 merged, as merge commit bcf3b5b4 (parents 9056b583 and 1d057c79; never a squash), at 2026-10-04T11:01:20Z. It follows the gate-2 architect's closing-record list (`state/consults/gates/2026-10-04-guardian-v0-gate2-architect.md`). Every commit named below is reachable from main through bcf3b5b4.*

1. **Mutation observations:** T1 to T9, T22, T23 and T37 to T41 by the worker at 71db3d7d (2.1.289); T10 to T21 and T24 to T34 at 54eba872 (2.1.288); all 39 plugin-test mutations by the reviewer at 1d057c79 (2.1.289; gate 2b); and M35a, M35b and M36 at 1d057c79, under node v24.18.1 and git 2.49.0.windows.1 (gate 2).
2. **§7:** Amendment 6 (class 8), 1700 of 1650 over 10 files at 7fa2a67e. The reviewer recounted at 1d057c79.
3. **README R1 to R11**, at main bcf3b5b4:
   - `tools/mods/spatial-guardian/README.md:13 @ bcf3b5b4 sha256:5aa1ee48b2cb1a9ea72a326b1acab6c96829fbd4d84dbc47521bd08339f5c85d`;
   - `tools/mods/spatial-guardian/README.md:17 @ bcf3b5b4 sha256:2578e62269b6d09a2be0f5a8d6cd957e5ee3d6896b30ec8859a686b0ba7f2148`;
   - `tools/mods/spatial-guardian/README.md:29-33 @ bcf3b5b4 sha256:5b3c0a8d95b6d77e4e9bbeff7f83bcbb5e1de2f6771226713a3f00865c56194f`;
   - `tools/mods/spatial-guardian/README.md:42 @ bcf3b5b4 sha256:c9bc927ef0ca0279a1789ffe2af089b1ead32c579d5e58601b204b88607be64c`;
   - `tools/mods/spatial-guardian/README.md:44 @ bcf3b5b4 sha256:65ec3b1de87cc875b3d4aa44a831614ee45a338c9034ff78d921e89e2d970dc3`;
   - `tools/mods/spatial-guardian/README.md:73 @ bcf3b5b4 sha256:23eafd0e0ce5206a4732920031c5ceeed21a8c9d57a47ac093e3c63c1cd292f6`.
   The gate-2 architect's S2-1 (line 44 without §2.7's until-E5 condition) is disposed by a sight note to the human before the install approval, `state/drafts/guardian-v0-install-sight.md`. Line 73 and §2.7 govern.
4. **The rulings:** question round 46, items 1 and 2; round 47; round 48; `state/directives/2026-10-04-guardian-shell-route-ruling.md:6-9 @ bcf3b5b4 sha256:d01f6c204e6e80eab36831902d0b7d29d48dfbee46960313ed3a60d33b24687c`; `state/directives/2026-10-04-guardian-g6-backstop-ruling.md:6-8 @ bcf3b5b4 sha256:5617d45ce4a07a763f1dbc1f66bfff910e08bf6e2c00bd7e17b3e85e9b54adef`.
5. **Readings by reference:** §8 item 23 and Amendment 4's F35 falsification are read as scoped to the PowerShell hook (gate-2 architect S2-2, gate-2 reviewer S2-1). Amendment 5's missing invalidator is bounded by its §5 (gate-2 architect N-2, gate-2 reviewer S2-3). Amendment 4's superseded index omits one Amendment 2 bullet (gate-2 architect N-3).
6. **Gates:** gate-log 377 (architect gate 1, PASS), 378 (reviewer gate 1, FAIL, evidence), 381 (architect gate 2, PASS), 382 (reviewer gate 2, FAIL, evidence) and 383 (reviewer gate 2b, PASS).
7. **Tools, each with its commit:** verify-cites 522e448d, verify-quotes f9444a4d, verify-test-claims e9735d47, verify.mjs 26072022. verify-mutation is not relied on.
8. **The validate outputs,** text and `--json`, are in the PR body (worker report 3); the reviewer's were taken at the head.
9. **Install:** not done. It waits for the human's typed approval, naming the E-rows (§9 Operator), and the human installs it.
