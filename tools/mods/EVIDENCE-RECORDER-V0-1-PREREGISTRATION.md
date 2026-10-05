# Evidence Recorder v0.1 — a repeat-runner, matcher row A5 with the repeat count, a declared write-latency measure, and one ceiling on the wait before a command (PLAN node `evidence-recorder-v0-1`) — preregistration

**Authority:**
- the human's 2026-10-05 direction, line 2: `state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:16-22 @ 17063904 sha256:886168f4ad5073f154627dfdd47f497bda21cf36b6bd84eebda1cb071a4d5d0d`, with its RULED block in `DECISIONS-PENDING.md` (RULED 2026-10-05, cited by its heading and not by line);
- the brief, approved by that line: `state/directives/MODS-V1-2026-10-05.md`, its §1 (`state/directives/MODS-V1-2026-10-05.md:7-12 @ 17063904 sha256:a2195dd694bf40b68d6003922af07f0ae4bd73fdd5a6a19b054c132714f4c294`), §3 (`state/directives/MODS-V1-2026-10-05.md:78-117 @ 17063904 sha256:9df4235eeca24d3feef2bf17db2940231bfead904be4061d184883023d45e3a2`), §4 (`state/directives/MODS-V1-2026-10-05.md:119-122 @ 17063904 sha256:2a63e5d4f2ce728031707d2d4f42481e787c926d265abb9b48805d7eae48192a`) and §5 (`state/directives/MODS-V1-2026-10-05.md:124-130 @ 17063904 sha256:d6ae1dd9627ab317eeee6ecede842a672f79db41b0733e3407ce4c7daf6e8ae8`);
- the node: `PLAN.yaml:4029-4046 @ 17063904 sha256:d4775b4ec83fd7f2fd9f694e22243671932181d6e132ad834d19e43e5cbe3a9a`;
- standing: question round 50, item 1 (the O-12 (a) brief rule, which line 2 extends to the repeat-runner); round 15 (c) (build labels); round 25, item 2 (classes 8 and 9, the mutation-observation wording, test-text spans on an unmerged branch, the full form at dispatch).

**Drafted by** the architect agent on the custodian's brief, read at main 17063904. The P0 report is the one the custodian's filing commit after 17063904 adds. It is architect-drafted because it crosses no engine/ or kernel/ path. Nothing was run for this draft. **Committed with the custodian's hashes before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating:** full, reviewer and architect, on three heads, each enough alone:
- **§21a, security posture:** the brief names each merge the security-posture change itself (`state/directives/MODS-V1-2026-10-05.md:5 @ 17063904 sha256:53491c517ff74ed18c6d8d9e8023aafdb2089b835e44e7fa1756e6808281ce9b`). The Recorder is read from `tools/mods/spatial-evidence-recorder/` in the main checkout (the v0 form's Amendment 5, E0), so the merge changes the live mod at the next reload or session start.
- **§21a, a property under test:** observe-only and byte-for-byte pass-through (the v0 form's §2.1 and its T13).
- **§21c, size:** over the bound (§7).

Under round 25, item 2 (e), no five-line form is used.

**Red line.**
- The merge waits for the human's typed approval, given after both gates and before the human's merge click, naming the live rows the human allows (E8, E9).
- Nothing in this piece installs, enables, reloads or loads a mod, adds a marketplace, starts a `claude` session, or writes under the user's Claude folder.
- Before the merge, nothing writes into `tools/mods/spatial-evidence-recorder/`, `tools/mods/.claude-plugin/marketplace.json` or `scripts/evidence/` in the main checkout: the live mod is read from the first two, and the runner lands only by the merge. This form, `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md`, and its §10 amendments are excluded from this ban; they are committed in the main checkout as the v0 form's were.

## §0. Disclosure

**0.1 Inputs.** These are Evidence, not Authority:
- **P0:** `state/consults/2026-10-05-evidence-recorder-v0-1-p0-report.md`, cited by section. Its filing note was read first. It records the build: `claude --version` read 2.1.289 at the start and the end, and the types were read at 2.1.288.
- **The v0 form,** `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md`, cited by section and amendment: its §1 to §9, and Amendments 1 to 6. Amendment 2, C2-d, says `recorder_ms` is a lower bound. Amendment 5, E4 (b), is the 4276 ms record. Amendment 6 is E1.
- **Build labels, kept (round 15 (c)):** a type read is a claim about 2.1.288; a `validate` or `plugin test` result is a claim about 2.1.289; a Node probe is a claim about Node v24.18.1 on this machine. None is read as current for another build (§5 I2).

**0.2 P0 → this form, by section and by build:**
1. **P0 §1, the runner's arguments on Windows with no shell.** Observed on Node v24.18.1 on Windows 10; this is not a Claude build.
   - argv after the separator reaches the child intact, and a quoted glob stays literal.
   - `cargo` and `node` spawn; `npm` gives ENOENT and `npm.cmd` gives EINVAL with no shell.
   - A leading env assignment or `timeout N` after the separator becomes the executable name.
   - Git Bash converts POSIX-looking arguments before a native program sees them.
   - A spawn error or a signal exit has a null status.
   - Carried in §2.2 and §2.3; settled as P0 OPEN items 1 and 2 in §0.4.
2. **P0 §2, the matcher row.** Observed at 2.1.289 by a harness that drove a byte copy of the shipped `register.js` with a stubbed `$`; this is not the engine's dispatch.
   - No row approves the runner today.
   - It lists the forms a row would miss and the forms the campaigns actually used.
   - It found three live records whose POSIX-spelled `cd /c/…` plans read `unavailable` with no timeout (the live log at 2.1.289; `leadingCdDir` accepts a leading slash: `tools/mods/spatial-evidence-recorder/hooks/register.js:184 @ 17063904 sha256:afe135a2402f77ad011da3140759284cb6bd3ae533010cb22f130078e5ae2cd2`).
   - Carried in §2.3. P0 OPEN items 3 and 4 are in §0.4.
3. **P0 §3, where the previous write's duration can be read.**
   - Types read at 2.1.288 and code read: `recorder_ms.write` spans the log-root lookup and the record's assembly, not the write (`tools/mods/spatial-evidence-recorder/hooks/register.js:392-417 @ 17063904 sha256:fe862b06d24a01fdeb19b59ad7482c3481bd17d3ee4a8329ce2c41cbde4ef7df`; the v0 form's Amendment 2, C2-d). The log-root cache shows that module state persists within a load (`tools/mods/spatial-evidence-recorder/hooks/register.js:351-357 @ 17063904 sha256:9961aa2e1bd391c946fe716963b609e999db6031828bf238f2c97203c1d52585`).
   - `performance.now` is declared among the typed globals at 2.1.288. Whether it exists at runtime at 2.1.289 is not verified.
   - The out-of-band mtime estimate over 30 live records is 0 to 3 ms in 28 of them; it is P0's derivation, not a recorded field.
   - Carried in §2.6; P0 OPEN item 5 is in §0.4.
4. **P0 §4, the identity's cold and warm costs.** Observed by Node spawn on this machine; the host's `$.process.run` was not timed.
   - The three before-calls are issued together (`tools/mods/spatial-evidence-recorder/hooks/register.js:256-260 @ 17063904 sha256:1fa7e0471c1cc3e0dfb9fd4ec4bd5c91a7722cfa56da648addebb712576f3087`).
   - The before stage costs about 76 ms at p50 warm in the main checkout, at most 217 ms on a fresh clone's first call, and about 360 ms at most under full CPU load.
   - A cold tree does not explain the 4276 ms record. Three candidate causes are named and none is established.
   - The per-call `timeoutMs` has been seen not to bound `recorder_ms.before`.
   - Carried in §2.5; P0 OPEN items 6 to 8 are in §0.4.
5. **P0 §5, `validate` and `plugin test`.**
   - Observed at 2.1.289 on a scratch copy: `validate` exits 0 with one warning (no `version`), and prints the hooks line and the calls line P0 §5 records byte for byte.
   - `claude plugin test` exits 1: the hooks rollout switch was saved off by an earlier session, so plugin tests cannot run until the human starts `claude` once. Carried in §5 I10; P0 OPEN item 9 is in §0.4.
6. **P0's other observations.** Guardian refused two of P0's calls. The first is recorded as the v0 form's Amendment 6 (E1) and as Guardian's Amendment 10. Nothing in this form rests on them.

**0.3 Corrections to the brief, recorded here and not by editing the filed directive:**
- **Brief §3.4, its last sentence** (`state/directives/MODS-V1-2026-10-05.md:97 @ 17063904 sha256:b1a3cea0c1089d870a7df6d6b5264d344c1e282179daad8f6a6eabcf05a729db`; a sub-line span, carrying the line's hash) says the git calls before a command run in series, each with its own 2000 ms.
  - The code issues the three before-calls together under `Promise.allSettled` (`tools/mods/spatial-evidence-recorder/hooks/register.js:256-260 @ 17063904 sha256:1fa7e0471c1cc3e0dfb9fd4ec4bd5c91a7722cfa56da648addebb712576f3087`), each with `timeoutMs: PROCESS_TIMEOUT_MS` (`tools/mods/spatial-evidence-recorder/hooks/register.js:13 @ 17063904 sha256:c522252ee434a5d78e728d2e951e4328a7e7cf8facbdd60b258c40d70a13bc68`, `tools/mods/spatial-evidence-recorder/hooks/register.js:218-221 @ 17063904 sha256:52786697d2aaedc72b93b640086bdcd0aa503cdd08810a5ab4069e326bf67250`).
  - So the declared worst case is 2000 ms, not three in series. The brief's requirement, one declared ceiling, stands unchanged.

**0.4 P0's nine OPEN items, as this form treats them:**
1. **`npm` tails.**
   - **Settled within the brief:** A5 applies rows A1 to A4 to the tail as §2.3 states, A2 included, as the brief's §3.2 says. The runner spawns the tail as given, with no `npm` route and no special case for any executable.
   - On Windows an `npm` tail fails to start on every run. The runner reports it as a failed run and the record shows the call as it happened.
   - The README states the limit, and briefs use `cargo` or `node` tails.
   - Dropping A2 from A5 would narrow a ruled item and change what the Recorder approves. It is the human's and is not proposed.
2. **An env prefix or `timeout` after the separator.**
   - **Settled:** the runner parses neither, and A5 applies the rows to the tail as it stands, so a tail led by `NAME=value` or `timeout` matches no row.
   - Prefixes go before `node`, where the existing normalisation drops them (`tools/mods/spatial-evidence-recorder/hooks/register.js:139-155 @ 17063904 sha256:4d3a30cc9cf0d7e97e423bcf7ac97359ad995897f56c1926ca7c72a98dca778b`), and the child inherits the runner's environment.
   - Grounds: the brief's runner has no shell and judges nothing, and a prefix parser would be a partial shell.
3. **POSIX-spelled `cd /c/…`.** **OPEN-1, the human's.** Until it is ruled, §2.3's tree logic is unchanged, and §9's evaluation reports these records as their own cause within the `unavailable` share.
4. **Loop-shaped campaigns.** **Settled:** the brief rule (line 2) is what makes repeated runs recordable; the row alone does not. Carried in §9 Operator and the README.
5. **The write-latency measure.** **Settled:** (a), the previous write's duration carried in the next run record, naming that write, timed with `Date.now()` inside `writeRecord`.
   - P0's (b), the mtime figure, is reported beside it and never scored.
   - No `performance.now()` and no `$.clock` call: the first is unverified at runtime, and the second would add a calls line. §2.6.
6. **Where the ceiling lives.** **Settled:** a stage-level race between the before stage and a timer of `BEFORE_CEILING_MS`. The losing calls run on and their results are discarded. §2.5.
   - **P0 gap:** whether a timer is available to a hook module at 2.1.289 is not established. §5 I9.
7. **Cold trees.** **Settled:** no remedy, because P0 §4 found cold trees are not the cause. The 4276 ms cause stays unestablished, and §2.5's ceiling bounds the wait whatever the cause.
8. **The brief's serial wording.** **Settled** by §0.3.
9. **The `plugin test` switch.** **OPEN-2, the human's own act.** §5 I10.

**0.5 Repository facts relied on, at 17063904:**
- governance-ci's path filters list `scripts/plan/**`, `scripts/hooks/**` and `tools/mods/**` (`.github/workflows/governance-ci.yml:81-83 @ 17063904, its sha256 6aa2119719f73d2278120d2c7d963673d4cb39aa3634d6447df99f92250c74ee, unchecked by verify-quotes, whose path grammar cannot begin with a dot`, `.github/workflows/governance-ci.yml:97-99 @ 17063904, its sha256 6aa2119719f73d2278120d2c7d963673d4cb39aa3634d6447df99f92250c74ee, unchecked by verify-quotes, whose path grammar cannot begin with a dot`). Its test step runs only the `scripts/plan` and `scripts/hooks` globs (`.github/workflows/governance-ci.yml:139-140 @ 17063904, its sha256 869ce9c211cd31adb1406d230b0cbae2252d8936d707fc86142f2cc2a49904fb, unchecked by verify-quotes, whose path grammar cannot begin with a dot`), on ubuntu-latest, and its permissions are `contents: read`.
- verify-mutation's test globs include `*.test.mjs` (`scripts/plan/verify-mutation.mjs:249 @ 17063904 sha256:864188b5b34f7f3ad99681d2e03d892ef66888af84ae47c111e34e02a1989871`). This is a claim about the tool at 17063904.
- Guardian's G1 looks for `git` at any token of a segment, not only the first (`tools/mods/spatial-guardian/hooks/register.js:196-208 @ 17063904 sha256:9edca7da1794ca28d70f9f239a10938bc27d2ce2118120527d28e815c7696ea7`, `tools/mods/spatial-guardian/hooks/register.js:212-228 @ 17063904 sha256:16e24dbf637ac3c6ae708419d78b969cfc17b4dcfb760a17c2d29c28f71c0a87`). So a runner tail holding a force-push spelling is still read by G1. This is a claim about Guardian at 17063904.
- The v0 test file asserts the v0 schema string (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:173 @ 17063904 sha256:f010207e2b781e70d624f376fcacdac88142da7e8e9713fda0ba893bb5b0520b`, `tools/mods/spatial-evidence-recorder/test/recorder.test.ts:365 @ 17063904 sha256:763e2fba07e170c388a84b690702d7b96e283de972538bf533d8b56aec4c1819`), the run record's key set (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:141-144 @ 17063904 sha256:dafa82e63f54c962af4a9c8916317e70936f46578f3b654711bdad37e689d27e`), and that no field of T1's record reads `unavailable` (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:170 @ 17063904 sha256:d1c368d348fd4da229a7176a62b58c47bd65dda36d865484f7de769ae2450ebf`).
- The v0 test file's T16 calls `setTimeout` in the kit's test runtime (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:123 @ 17063904 sha256:fe043b6ada1d1741db7aaf6975616ec91542b5df4556181010b273b6f9167591`). That shows a timer in the test runtime at 2.1.289, not in a hook module.

## §1. May and may not claim

**May claim:**
- **For the runner,** under `node --test` on Windows (locally) and on ubuntu-latest (governance-ci):
  1. R1 to R4's behaviours (§4).
- **For the Recorder,** under `claude plugin test` on Windows at 2.1.289:
  2. A5 approves every F18 form and no F19 form; `repeat` follows F18 and F20.
  3. When the before stage outlasts `BEFORE_CEILING_MS`, the before-fields read `unavailable`, `before_ceiling_reached` is true, and `next` runs once, with no wait for the late answers.
  4. A run record carries the previous write's duration and names that write (F22).
  5. Every hook returns what `next` produced on the v0.1 paths (F23).
  6. `validate` prints P0 §5's two lines unchanged.
- **Live:**
  7. After E8 only: one record with `repeat` 3 for a live runner call.
  8. After E9 only: p50 and p95 of §2.6's measured call-path sum on E9's sample, against §7's bound.

**May not claim:**
- **Citability or mutation observation:** no recorder line is citable evidence, and no record is a mutation observation (round 25, item 2 (c)). CI and the gates stay authoritative.
- **Which run failed:** the record carries the tool's error flag and the hash of the runner's text, not the per-run exits.
- **The ceiling's reach:** that it ends the host's git processes (they run on); any bound on the after side, which keeps v0's per-call timeouts (OPEN-3); the matcher's synchronous parse time, which is unmeasured.
- **The cause of the 4276 ms record;** and that cold trees never matter beyond P0 §4's three clones.
- **The tree under a POSIX-spelled `cd`,** unless OPEN-1 (b) is ruled and carried.
- **That an `npm` tail runs on Windows.**
- **Coverage:** repeated runs made without the runner; prefixed tails; `node` options before the runner path; the runner reached through a variable; background calls; the after-fields of an auto-backgrounded call.
- **Pairing:** that every record's write is paired. The last record before a reload or a session's end has no successor.
- **Builds and platforms:** any build other than 2.1.289; the Recorder on macOS or Linux; the runner on macOS; `performance.now` at runtime.

**Out of scope:**
- guardian-v1 and the G1 fix;
- any change to an agent definition, a brief template or a governing doc for the brief rule;
- pruning;
- an after-side ceiling (OPEN-3);
- the POSIX `cd` fix (OPEN-1) unless it is ruled;
- an `npm` spawn route;
- killing cargo's child processes;
- `tools/mods/.claude-plugin/marketplace.json`, `plugin.json` and `hooks.json`.

**Scope limits:**
- no wire change, and no ADR cited as governing or amended. ADR-006 does not apply: this is repository tooling;
- no `userConfig`, option or flag;
- no file outside §7's list, apart from this form and the custodian's generated set.

## §2. The design, stated before code

**2.0 Files.**
- **`scripts/evidence/repeat.mjs`:** ESM, Node standard library only (`node:child_process` `spawnSync`).
- **`scripts/evidence/repeat.test.mjs`:** `node:test` and `node:assert`. Fixtures live in an `os.tmpdir()` `mkdtemp` folder that the test removes, never in the repository.
- **`hooks/register.js`, `test/recorder.test.ts` and `README.md`** under `tools/mods/spatial-evidence-recorder/`.
- **`.github/workflows/governance-ci.yml`,** these edits only:
  - `"scripts/evidence/**"` added to both path filters, beside `scripts/hooks/**`;
  - `"scripts/evidence/*.test.mjs"` added to the test step's command, and `scripts/evidence` to its name;
  - the header sentence on what a green run means names `scripts/evidence`.
  - Nothing else changes in the workflow: no permission, trigger, action version or secret.
- **No `package.json`,** no lockfile, no dependency.
- **The worker builds** in a worktree under `C:\dev\wt\`, never in the main checkout.

**2.1 Observe only.** The v0 form's §2.1 stands unchanged and binds the new code:
- `next(e)` exactly once, with the received event, and its own value returned;
- no `.catch` on a registration;
- every `$` call inside a `try`;
- the ceiling path calls `next` once, after the race.
- The losing stage promise carries an internal no-op rejection handler, so a late failure is never unhandled. Its late values are never read.

**2.2 The repeat-runner** (brief §3.2: `state/directives/MODS-V1-2026-10-05.md:84-89 @ 17063904 sha256:038ee0c3a321a62cdd9831938e555f89cab067a81811e917196ac2a3a656feb7`):
- **Call:** `node scripts/evidence/repeat.mjs <n> -- <command> [<arg>…]`. `<n>` matches `^[1-9][0-9]*$` and is a safe integer. The first `--` after `<n>` is the separator. Every token after it is the command's argv, passed as given, a later `--` included.
- **Runs:** for i from 1 to n, in sequence, each starting after the previous ends: `spawnSync(argv[0], argv.slice(1), { shell: false, stdio: 'inherit' })`. The working directory and environment are inherited.
  - No `timeout` option, no parse of env or `timeout` words, and no special case for any executable.
- **Per run,** printed to stdout after the run ends: `run <i>/<n> exit=<result>`. `<result>` is one of:
  - the exit status;
  - `signal:<NAME>` when the status is null with a signal;
  - `spawn-error:<code>` when the spawn failed.
  - A run fails unless its result is `0`.
- **Summary:** `summary runs=<n> failed=<k>`. The exit is 0 when k is 0, else 1.
- **A malformed call** (no `<n>`, a bad `<n>`, no separator, an empty command): one usage line on stderr, nothing spawned, exit 2.
- **Never:** a retry, a parallel run, an early stop, a shell, reading or judging a child's output, a file write, a network call, a timer.

**2.3 Matcher row A5 and the plan** (brief §3.2):
- **The row.** After normalisation (unchanged), a segment is A5-approved when:
  - its tokens are `node`, then a runner path, then `<n>` as §2.2 defines it, then `--`, then at least one token;
  - the tail (the tokens after that `--`) passes `isApproved` (`tools/mods/spatial-evidence-recorder/hooks/register.js:161-177 @ 17063904 sha256:c01b1ef05a54666f7c91c90c30326ded4fa8396d03f9654ec09bd7e2d9d06791`) as it stands, not normalised (§0.4 item 2).
- **The runner path** is judged as A4 judges a script path: `\` becomes `/`, a leading `./` is dropped, and it equals or ends with `/` + `scripts/evidence/repeat.mjs`.
- **What is unchanged:** rows A1 to A4, the not-approved table, `cd` handling, `leadingCdDir`, and background pass-through. A cd, env or `timeout` before `node`, and a pipe or redirect after the call, behave as v0 has them.
- **`repeat`:**
  - n, when exactly one segment is A5-approved;
  - `unavailable` when more than one is;
  - the key is absent when none is.
- **Known misses,** listed in the README: shell loops; `node` options before the runner path; the runner reached through a variable; n given by a variable; a prefixed tail; a tail that is a chain, of which only the first command belongs to the runner.

**2.4 The run record.**
- `schema` becomes `spatial-evidence-recorder/v0.1`, so records after the merge are told apart without timestamps. Usage records carry it too.
- Three fields are added: `repeat` (§2.3), `before_ceiling_reached` (§2.5) and `previous_write` (§2.6).
- Every other v0 field, and the usage record's shape, are unchanged.

**2.5 The ceiling on the wait before a command** (brief §3.4: `state/directives/MODS-V1-2026-10-05.md:95-98 @ 17063904 sha256:d4b61a87c025bfb8356feb32b9e05906e977bf50bfdca6435ca03eff54bdfdd7`):
- **The stage is raced** against a timer of `BEFORE_CEILING_MS`. The stage is the three before-calls together plus their hashing, as `snapshotBefore` (`tools/mods/spatial-evidence-recorder/hooks/register.js:252-266 @ 17063904 sha256:1df847702837543f6b84a753fd172f1c236895618e69ceada647f84131baabf4`).
- **When the timer wins:**
  - `toplevel`, `head` and both before-hashes read `unavailable`, and `before_ceiling_reached` is `true`;
  - `next(e)` runs at once, and the late answers are discarded.
- **Otherwise** `before_ceiling_reached` is `false`. It is also `false` on an `unresolved` plan, where no git runs.
- **`PROCESS_TIMEOUT_MS` stays** on every call.
- **The after side,** the log-root lookup and `$.agent.list` are unchanged.

**2.6 The write-latency measure** (brief §3.3: `state/directives/MODS-V1-2026-10-05.md:91-93 @ 17063904 sha256:a83e7e85497aab22484c775d1a2639c72c7a1e605b1ba64b0921b59044619441`; v0 Amendment 2, C2-d):
- **Timing:** `writeRecord` reads `Date.now()` at entry and again when `$.fs.write` resolves. On a resolved write it sets a module variable to `{ record: "<YYYY-MM-DD>/<file name>", ms }`. A rejected write leaves the variable as it was.
- **The field:** each run record carries that variable's value at its assembly as `previous_write`, or `unavailable` when none is set (the first write of a load, or after a reload). The named write may be a usage record's or a concurrent call's: it is named, never guessed.
- **What it spans:** from `writeRecord`'s entry to the write's resolution. That covers serialisation, the digest, the name, and the write's round trip; it is the span the v0 `write` field leaves out. `$.fs.write` stays inside `writeRecord`, so `validate`'s `(via writeRecord)` holds.
- **E9's sum for record R:** `recorder_ms.before + after + write`, plus the `ms` of the record whose `previous_write.record` names R. An unpaired R is excluded and named.
- **What stays outside the measure:** the synchronous matcher parse.
- **E5 stays a lower bound** and is not rescored.

**2.7 README.** It states, with no quotation:
- the runner's call, its output lines, exit codes, limits and known misses (§2.2, §2.3), including that `npm` tails do not start on Windows;
- the three new fields and the schema string;
- the ceiling, and that the after side has no stage ceiling;
- that a long run should be given a Bash tool timeout that covers all n runs. An auto-backgrounded call loses its after-fields.
- The brief rule (§9 Operator) is stated as the custodian's practice from the merge on.

**2.8 Seams,** each against the other side's actual interface:
- **Runner to A5:** the matcher consumes the command string an agent writes to call the runner. The F18 strings use §2.2's call exactly as R1 to R4 invoke the runner. E8 is the end-to-end proof from the real shape, a live call.
- **register.js to the mod API:** the build 2.1.288 types (v0 §0.2), proven by `claude plugin test` at 2.1.289.
  - **Before any code,** the worker records whether `setTimeout` and `clearTimeout` are declared for hook modules in `<skill-root>/types/claude-code.d.ts` (its globals block, P0 §3), with line numbers. If they are not, I9 fires.
- **The record to its reader:** the custodian's evaluation by hand (§9). No reader code lands.
- **Guardian:** none in code. G1 still reads a runner tail (§0.5). How guardian-v1's G7 to G9 read a runner tail is guardian-v1's form to state; this piece makes no claim about it.
- **Callers:** the runner's caller is the brief rule (line 2). `previous_write` and `before_ceiling_reached` are read by E9 and §9's evaluation. No option or code path lands without a caller.

**2.9 Portability** (R3):
- **Owning boundary:** the runner's one `spawnSync` call, and the existing `leadingCdDir` (unchanged).
- **Windows:** explicitly reduced. A `.cmd` or `.bat` command (`npm`, `npx`) cannot start with no shell; each run prints `spawn-error:<code>` and counts as failed.
- **Linux:** the runner is supported and tested by governance-ci on ubuntu-latest. The Recorder is unavailable there, as in v0.
- **macOS:** deferred, recorded here. The runner is untested there and no claim is made.
- **R2:** no `process.platform` branch in the runner or its tests.

**2.10 Guardian, live.** The v0 form's §2.12 guidance stands until guardian-v1 merges. G1 refuses a call in which an apostrophe opens a quote that runs past the word push. So test files and record text are written with the Write tool, commits and pushes are separate calls, and no fixture holds that word.

## §3. Fixtures and predicted outcomes

Plugin fixtures follow the v0 form's §3 conventions (`R` is `C:/r`; the log root is `C:/r-local/evidence`). Runner fixtures sit in a temporary folder outside the repository.

| # | Call or event | Engine answers | Predicted |
|---|---|---|---|
| F18 | `node scripts/evidence/repeat.mjs 3 -- cargo test -p k`; `node ./scripts/evidence/repeat.mjs 2 -- node --test "scripts/plan/*.test.mjs"`; `node scripts\evidence\repeat.mjs 5 -- node scripts/plan/verify-cites.mjs`; `node C:/r/scripts/evidence/repeat.mjs 1 -- npm test`; `CARGO_TARGET_DIR=D:/t timeout 900 node scripts/evidence/repeat.mjs 3 -- cargo test -p k -- --exact x`; `cd C:/x/wt/a && node scripts/evidence/repeat.mjs 3 -- cargo test`; `node scripts/evidence/repeat.mjs 4 -- cargo test 2>&1 \| tail -5` | as v0 F1 | one record each, `repeat` equal to n, schema v0.1; the cd form is `leading-cd` |
| F19 | the runner with tails `cargo build`, `node scripts/plan/verify-mutation.mjs`, `CARGO_TARGET_DIR=D:/t cargo test`, `timeout 900 cargo test`, `cargo test --no-run`, `npm run build`; n of `0`, `x`, `3.0`, `-1`; no separator; an empty tail; the runner path `scripts/plan/repeat.mjs` or `repeat.mjs`; `node "$R" 3 -- cargo test`; the runner alone | none | no `$` call; result unchanged |
| F20 | two A5 segments joined by `&&`; an A5 segment with tail `cargo build` followed by `&& cargo test` | as F1 | one record each: `repeat` `unavailable`; then `repeat` absent |
| F21 | as F1, with the before-side git answers released after 3 × `BEFORE_CEILING_MS`; and as F1 with prompt answers | as stated | `toplevel`, `head` and both before-hashes `unavailable`, `before_ceiling_reached` true, `next` reached once, result unchanged; then `before_ceiling_reached` false |
| F22 | two approved calls in sequence, the `fs.write` stub resolving after 50 ms; then a subagent's turn end, then a third approved call | as stated | first: `previous_write` `unavailable`; second: names the first record's day and file name, `ms` an integer ≥ 50; third: names the usage record |
| F23 | an A5 call answered, errored and denied; F21's slow call; F22's second call; an A5 call with every `$` call rejecting | as stated | each return deep-equals, and serialises equal to, `next`'s value |
| RF1 | a child that exits 0, then 3, then 0 (a counter file in the temp folder), n = 3; and an always-0 child, n = 2 | — | lines `run 1/3 exit=0`, `run 2/3 exit=3`, `run 3/3 exit=0`, then `summary runs=3 failed=1`, exit 1; then exit 0 |
| RF2 | an argv-echo child, with args `a b`, `$HOME`, `%PATH%`, `*`, an empty string, `--` and `--flag=1` | — | the child prints exactly those args |
| RF3 | a command name that does not exist, n = 2 | — | two `exit=spawn-error:ENOENT` lines, `failed=2`, exit 1 |
| RF4 | `0 -- node x`; `x -- node x`; `3 node x`; `3 --`; no arguments | — | exit 2, one stderr line, the counter file never created |

## §4. Tests, one mutation each

- **Observation** (round 25, item 2 (c)): apply the mutation, run the named suite, record the failing test by name in a `// RECORDED MUTATION:` comment, then revert.
  - For runner tests, the suite is `node --test scripts/evidence/repeat.test.mjs`; record the commit and `node --version`.
  - For plugin tests, the suite is `claude plugin test tools/mods/spatial-evidence-recorder`; record the commit and `claude --version`.
  - A `verify-mutation` run is not an observation. Before relying on it, the worker states, at the tool's commit, whether its scan covers `scripts/evidence/` and `tools/mods/**/*.test.ts`.
- **Changed v0 tests:** T1 changes (key set, schema, and `previous_write` excepted from its no-`unavailable` check) and so does T11 (schema). Each is re-observed under its recorded mutation at the piece's commit, and its comment gains a line naming that commit. No other v0 test text changes.
- **Evidence of record:**
  - governance-ci runs the runner's tests on the branch.
  - No CI runs the plugin tests. Their evidence is the worker's full output and the reviewer's own run, each with `claude --version` at a named commit.

| # | Test | Fixture | Mutation |
|---|---|---|---|
| R1 | `the runner runs the command n times in order, reports each exit and never stops early` | RF1 | stop after the first failed run |
| R2 | `the runner passes the arguments after the separator to the command unchanged, with no shell` | RF2 | `shell: true` |
| R3 | `a command that cannot start counts as a failed run and the runner carries on` | RF3 | a null status read as 0 |
| R4 | `a malformed call runs nothing and exits 2` | RF4 | an n of 0 accepted |
| T21 | `the repeat-runner with an approved command produces one record` | F18 | row A5 removed |
| T22 | `the repeat-runner with any other command produces no record and makes no engine call` | F19 | A5's tail check dropped (any tail approved) |
| T23 | `the record carries the repeat count` | F18, F20 | `repeat` fixed at 1 |
| T24 | `reaching the wait ceiling before a command gives unavailable before-fields and runs the command at once` | F21 | the before stage awaited without the race |
| T25 | `a run record carries the previous write's duration and names that write` | F22 | the timer stopped before `$.fs.write` is awaited |
| T26 | `every result passes through unchanged on the repeat-runner, ceiling and previous-write paths` | F23 | the Bash hook returns `{ ...ran, context: ["repeat"] }` on an A5 call |

T24 asserts the property (unavailable fields, the flag, `next` reached once), not an elapsed-time budget.

**E-rows,** live, after the merge, in the main checkout at the merge commit, and after the human's `/reload-plugins`.
- **When they run:** each runs only if the human's typed merge approval names it.
- **How they are recorded:** the custodian records each as a class 1 row on main. Reason and output texts are byte-copied by script. Folders outside the repository are named in words.
- **Build:** each row records its build by the v0 form's §4 method. A row whose session engine is not 2.1.289 fires I2 (b).
- **E8** (brief §3.5):
  - **Preconditions:** the reload's output line, and `claude plugin list`'s Read-from line for the Recorder, unchanged from the v0 form's Amendment 5, E0.
  - **The call:** in the main loop, with the Bash tool, not in the background, and with a Bash timeout of at least 120000 ms: `node scripts/evidence/repeat.mjs 3 -- node --test <a passing scratch file in the session scratchpad>`.
  - **Predicted:**
    - the day folder gains exactly one record with that `command`, schema v0.1, `repeat` 3, `tool_is_error` false, `tree_basis` session-default, `tree_changed_during_run` false and `before_ceiling_reached` false;
    - the tool result holds three `exit=0` run lines and `summary runs=3 failed=0`, checked by script against the transcript and not reproduced;
    - the porcelain is unchanged.
- **E9** (§2.6):
  - **The sample:** the first 20 paired schema-v0.1 run records in 2.1.289-engine sessions after the reload. E8's record counts if it is paired.
  - **What is reported:** p50 and p95 of §2.6's sum. Excluded records (unpaired, or another engine) are named. P0 §3's mtime figure over the same records is reported beside it and not scored.
  - **Predicted:** p95 at or under `RECORDER_P95_BOUND_MS`. A p95 over it fires §9's overhead stop.
  - Nothing is run on purpose for E9.
- **No live probe writes into the repository,** and no G1-shaped or force-push-shaped command is run.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- R1 to R4 and T1 to T26 pass at the head.
- Each new test fails under its mutation, and T1 and T11 fail under their recorded mutations.
- `validate` on the folder and on `tools/mods` prints P0 §5's hooks and calls lines byte for byte, with the one `version` warning. A difference confined to a `(via …)` annotation is class 2.
- governance-ci is green with the new glob.
- E8 and E9 come out as §4 predicts.

**Declared unchanged:**
- every path outside §7's list;
- the v0 shapes this form does not name (rows A1 to A4, the not-approved table, the outcome fields, storage and the log root, the order with Guardian, the after side);
- `PROCESS_TIMEOUT_MS`;
- `tools/mods/spatial-guardian/`, the marketplace, `plugin.json` and `hooks.json`;
- every agent definition, template, `AUTONOMY.md` and `AI_DEVELOPMENT.md`;
- every workflow byte outside §2.0's governance-ci edits.

**Invalidators (stop, to the custodian):**
- **The v0 form's I1 to I8,** read against this form's §2 and §7.
- **I9:** no timer is available to a hook module without a new `$` call (§2.8). The shape returns to the form by amendment, never to code first.
- **I10:** `claude plugin test` still reports hooks modules off after the human's `claude` start. The plugin test phase waits.
- **I11:** a runner test cannot pass on both Windows and ubuntu without an OS branch.
- **I12:** OPEN-1 or OPEN-3 is ruled to add work. Its §2 shape, tests and §8 items enter as a class 9 amendment before any of its code.

**Falsification:** any of these makes the form wrong:
- any hook return differs from `next`'s value;
- an F19 call makes a `$` call;
- a ceiling-reached call waits for a late git answer;
- the runner stops early, retries, runs in parallel or uses a shell;
- a record's `repeat` differs from n.

## §6. Instruments

**Assertions:**
- deep and serialised equality;
- stub arguments, call counts, written paths and lines;
- runner stdout lines and exit codes;
- `validate`'s two lines;
- `claude --version`, `node --version` and `git --version`;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with its commit (round 15 (c)).

**One measurement:** E9's p50 and p95 on its declared sample. It is not a docs/08 row.

## §7. Declared values and ceilings

- **The Recorder:**
  - `PROCESS_TIMEOUT_MS = 2000` per git call, unchanged.
  - `BEFORE_CEILING_MS = 2000` across the before stage (§2.5). This is v0's declared worst case, now enforced.
  - `RECORDER_P95_BOUND_MS = 300`, unchanged, over §2.6's sum on E9's sample of 20 paired records.
  - `UNAVAILABLE_STOP = 20%`, unchanged, with the v0 definition.
  - `SCHEMA = spatial-evidence-recorder/v0.1`.
- **The runner:**
  - its path, `scripts/evidence/repeat.mjs`;
  - its exit codes: 0 when every run passed, 1 when any run failed, 2 for a malformed call;
  - its `<n>` pattern, `^[1-9][0-9]*$`.
- **Size:** at most 1000 changed lines (insertions plus deletions) over at most 6 files:
  - the files: `scripts/evidence/repeat.mjs`, `scripts/evidence/repeat.test.mjs`, `tools/mods/spatial-evidence-recorder/hooks/register.js`, `tools/mods/spatial-evidence-recorder/test/recorder.test.ts`, `tools/mods/spatial-evidence-recorder/README.md`, `.github/workflows/governance-ci.yml`;
  - the counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main;
  - an overrun is class 8, and this line is never edited;
  - the estimate: runner 90, runner tests 180, register.js 110, plugin tests 270, README 55, workflow 7.
- **Minutes:** the node's `budget_minutes`.

## §8. Block-on-sight

1. Any v0 §8 item (1 to 20), read against this form.
2. In the runner:
   - a shell, `exec` or `execSync` with a command string;
   - a retry, a parallel run or an early stop;
   - a timer or a `timeout` option;
   - a parse of env or `timeout` words;
   - a special case for any executable;
   - reading or judging a child's output;
   - a file write or a network call;
   - a dependency or a `package.json`.
3. An A5 tail normalised; a runner path other than §2.3's; an A5 that bypasses `isApproved`.
4. At the ceiling:
   - a wait past it for any git answer;
   - a late before-answer read into a record;
   - `next` not called on the ceiling path, or called twice;
   - a promise left without a rejection handler.
5. `previous_write`:
   - estimated, or naming no write;
   - timed by `performance.now()` or by a `$.clock` call;
   - with `$.fs.write` moved out of `writeRecord`.
6. A `$` call outside v0 §2.0's calls line.
7. Any workflow edit beyond §2.0's, a permission among them.
8. Before the merge, any write into `tools/mods/spatial-evidence-recorder/`, `tools/mods/.claude-plugin/marketplace.json` or `scripts/evidence/` in the main checkout; this form and its §10 amendments are excluded. Any install, enable, reload, marketplace change, `--plugin-dir` session or `claude` start by an agent.
9. A live G1 probe, a G1-shaped or force-push-shaped command run on purpose, or a probe or test writing into the repository.
10. Text presenting a recorder line as citable evidence or as a mutation observation, or calling a `verify-mutation` run an observation of a mutation.
11. A §7 overrun not recorded as class 8, or §7's line edited. Any code of a scope addition before its class 9 amendment.
12. A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.
13. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a bare self-line;
    - a pin read as current;
    - a tool claim without the tool's commit;
    - a correction round without its superseded index.
14. A squash or rebase merge, or any force-push.
15. A change under `tools/mods/spatial-guardian/`, or to the marketplace.

## §9. Gates

- **Dispatch:** after this form's commit, the custodian sets the node's `gate` to this form. The node keeps `merge: merge-commit`.
- **Architect:**
  - the Gating heads;
  - brief §1, §3, §4 and §5 against §2;
  - line 2;
  - §0.4's settlements;
  - the seams (§2.8), with the worker's timer reading;
  - R1 to R6 against §2.9;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - `node --test scripts/evidence/repeat.test.mjs`, `claude plugin test` and both `validate` runs on the custodian's machine, with the versions;
  - every mutation observed at the gated head;
  - §7 recounted;
  - §8 items 2 to 5 checked by reading.
- **Suites, green before either gate:**
  - governance-ci on the branch, read before gating;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`;
  - §6's tools.
- **PR body:**
  - this form;
  - `validate` on the folder and on `tools/mods`, text and `--json`;
  - the plugin test and runner test outputs with their versions.
- **Operator:**
  - **Merge:** after both gates PASS, the human gives a typed approval naming E8, E9, both or neither, and clicks. The custodian brings the main checkout to the merge commit. The human reloads. The custodian records the rows the human named.
  - **The brief rule** (line 2; round 50, item 1). From the merge on, the custodian's worker and tester briefs tell agents to run a repeated evidence run through `scripts/evidence/repeat.mjs` with the Bash tool, never through a shell loop, and to set a Bash timeout covering all n runs. Each brief references line 2 by path and line (round 12 (c)). No template or definition changes.
  - **Evaluation** (brief §3.5: `state/directives/MODS-V1-2026-10-05.md:117 @ 17063904 sha256:86c0e9687a8119e905ba2ea00c1c43f7d4f7c9cd1fe5b55a8e77c51e2758338a`). The v0 window continues: two weeks from 2026-10-04, or six gated pieces. The added measures:
    - (a) **The recorded share of repeated evidence runs.** Repeated runs named in the reports of pieces dispatched after the merge, against those with a run record whose `repeat` equals the report's n. Counted by hand.
    - (b) **The `unavailable` share,** by v0's definition over schema-v0.1 run records. It is reported in total and split by cause: `before_ceiling_reached`; a POSIX-spelled leading `cd` (until OPEN-1 is ruled); `backgrounded_after_ms`; other.
    - (c) **The write latency:** E9, and the `previous_write.ms` distribution over the window.
    - **The stop conditions are unchanged:** any tool result altered; the overhead p95 over §7's bound; the total `unavailable` share over `UNAVAILABLE_STOP`.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index)
