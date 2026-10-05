*Custodian's filing note (2026-10-05): evidence-recorder-v0-1's P0, the MODS-V1 brief's §3.5 questions answered against the installed binary 2.1.289 with types read at 2.1.288 (`state/directives/MODS-V1-2026-10-05.md`), by a worker on the custodian's brief (run 07:31Z to 07:56Z; 149,225 subagent tokens, 58 tool uses). The worker wrote it to the custodian's scratchpad, not the repository, and the custodian copied it here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is 6772680cb359d39948c07aafa25d2f8b58fbc80dd83a8fc33ba6a3741d7beb88, equal to the worker's hand-back. **Checked by the custodian:** the three excerpts marked verbatim from `<skill-root>` match their source lines; the before-calls are issued together at the cited lines of `tools/mods/spatial-evidence-recorder/hooks/register.js`; the leading-cd pattern accepts a leading slash. Its observations section's two Guardian refusals are recorded as the Recorder form's Amendment 6 (E1) and Guardian's Amendment 10. Profile paths redacted at filing: none.

---

# Evidence Recorder v0.1 — P0 against Claude Code 2.1.289 (types read at 2.1.288)

Builds: `claude --version` printed `2.1.289 (Claude Code)` at the start and at the end of the run. Every "typed" fact is read at 2.1.288 (`<skill-root>` is the 2.1.288 bundled plugin-authoring folder); every "observed" fact is a CLI or Node run at 2.1.289 or on this machine. Main checkout HEAD during the run: 17063904 (git `%h`), tracked files 1637 (`git ls-files | wc -l`, main and clones alike). git version 2.49.0.windows.1. Node v24.18.1, cargo 1.97.1. Probe scripts live in the scratch folder `<scratch>` (named in the last section); none touched the repository.

## 1. The repeat-runner's argument handling on Windows, with no shell

**Answer (observed on Node v24.18.1, Windows 10, from Git Bash).** Argv after `--` arrives intact and unexpanded when quoted, so `node --test "g/*.test.mjs"` reaches the child as the literal glob and Node's own `--test` expands it. `cargo` and `node` spawn with `shell: false`; `npm` does not: spawning `npm` gives ENOENT and spawning `npm.cmd` gives EINVAL. An env prefix or a `timeout N` prefix after `--` is not honoured by `shell: false`: the first word becomes the executable name and the run fails with ENOENT, except that `timeout` happens to spawn a real `timeout.exe`, whose identity depends on PATH.

Sources: probe scripts `<scratch>/probe/repeat.mjs` (the throwaway runner: `spawnSync(cmd[0], cmd.slice(1), { shell: false })` n times, one line per run, a summary, exit 1 if any run failed), `<scratch>/probe/show-argv.mjs`, `<scratch>/probe/envto.mjs` (the same runner with a leading env-assignment and `timeout N` parser), `<scratch>/probe/flaky.mjs`.

Probe and output (all invoked as `node <script> <n> -- <command...>` from this Bash tool):

```text
$ node repeat.mjs 2 -- node show-argv.mjs a "b c" 'd"e' "scripts/hooks/*.test.mjs" --flag=1 ''
ARGV-AFTER-DASH ["node","show-argv.mjs","a","b c","d\"e","scripts/hooks/*.test.mjs","--flag=1",""]
run 1/2 exit=0 ms=310 first-stdout="[\"a\",\"b c\",\"d\\\"e\",\"scripts/hooks/*.test.mjs\",\"--flag=1\",\"\"]"
run 2/2 exit=0 ms=337 ...
summary runs=2 failed=0                                  rc=0

$ node repeat.mjs 2 -- node --test "g/*.test.mjs"        (g/a.test.mjs is one passing test)
ARGV-AFTER-DASH ["node","--test","g/*.test.mjs"]
run 1/2 exit=0 ms=881 first-stdout="✔ x (2.5938ms)"
run 2/2 exit=0 ms=827 ...        summary runs=2 failed=0   rc=0

$ node repeat.mjs 1 -- node show-argv.mjs g/*.test.mjs -- --exact --nocapture      (unquoted glob; a second `--` stays in the child's argv)
ARGV-AFTER-DASH ["node","show-argv.mjs","g/a.test.mjs","--","--exact","--nocapture"]   rc=0

$ node repeat.mjs 1 -- cargo --version     exit=0  first-stdout="cargo 1.97.1 (c980f4866 2026-06-30)"   rc=0
$ node repeat.mjs 1 -- node --version      exit=0  first-stdout="v24.18.1"                                rc=0
$ node repeat.mjs 1 -- npm --version       exit=spawn-error:ENOENT  err="spawnSync npm ENOENT"            rc=1
$ node repeat.mjs 1 -- npm.cmd --version   exit=spawn-error:EINVAL  err="spawnSync npm.cmd EINVAL"        rc=1
$ node repeat.mjs 1 -- node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" --version
run 1/1 exit=0 ms=542 first-stdout="11.16.0"                                                               rc=0
$ node -e 'spawnSync("npm.cmd",["--version"],{shell:true})'   status 0, stdout 11.16.0, plus
  (node) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities
$ node repeat.mjs 1 -- FOO=1 node show-argv.mjs x                 exit=spawn-error:ENOENT  "spawnSync FOO=1 ENOENT"   rc=1
$ node repeat.mjs 1 -- CARGO_TARGET_DIR=D:/x cargo --version      exit=spawn-error:ENOENT                              rc=1
$ node repeat.mjs 1 -- cd /c/dev && node --version                argv ["cd","C:/dev","&&","node","--version"]; ENOENT  rc=1
$ node repeat.mjs 1 -- timeout 5 node --version                   exit=0 (GNU coreutils timeout 8.32 from Git's usr/bin)  rc=0
$ node repeat.mjs 1 -- timeout --version                          "timeout (GNU coreutils) 8.32"                rc=0
$ env PATH="<nodejs>:<System32>" node repeat.mjs 1 -- timeout 5 node --version
run 1/1 exit=1 ms=25 first-stdout=""     (the Windows timeout.exe, a different tool)   rc=1
$ node envto.mjs 1 -- FOO=bar node -e 'console.log(process.env.FOO)'
parsed {"cmd":["node","-e","console.log(process.env.FOO)"],"FOO":"bar"} / exit 0 ... stdout "bar"
$ node envto.mjs 1 -- timeout 2 node gc.mjs      (gc.mjs: spawns a child node and itself waits 25 s)
parsed {...,"timeoutMs":2000} / exit null signal SIGTERM err ETIMEDOUT   (spawnSync's own timeout option)
$ node repeat.mjs 3 -- node flaky.mjs     (flaky.mjs exits 3 on its second call only)
run 1/3 exit=0 ms=102 | run 2/3 exit=3 ms=77 | run 3/3 exit=0 ms=81 | summary runs=3 failed=1   rc=1
```

Findings in words, each observed:
- Git Bash converts POSIX-looking arguments to native Windows ones before a native program sees them: `node show-argv.mjs /c/dev --out=/c/dev /tmp "a=/c/x"` printed `["C:/dev","--out=C:/dev","<temp>","a=C:/x"]`. The script cannot know the original spelling; the Recorder records the command string before conversion (`command: e.command`).
- `npm`: no `npm.exe` exists on PATH (the folder holds `npm`, `npm.cmd`, `npm.ps1`); `npm` is ENOENT with `shell: false`, `npm.cmd` is EINVAL. What works with no shell is `process.execPath` with `<dirname(execPath)>/node_modules/npm/bin/npm-cli.js` (observed above, exit 0). `shell: true` works but is the thing §3.2 forbids.
- Env prefix: the script must parse leading `NAME=value` words itself and pass them as `spawn`'s `env` option (observed working in `envto.mjs`). `timeout N` after `--`: GNU `timeout` spawns only where Git's `usr/bin` is first on PATH; otherwise Windows `timeout.exe` is found and fails with exit 1. The script's own alternative is `spawnSync`'s `timeout` option (observed: kills the child, `ETIMEDOUT`, signal SIGTERM). In one probe a grandchild node process did not survive that kill; that was one node-grandchild probe and does not show that cargo's test binaries die with it, so tree-kill of cargo's children is not settled here.
- Exit reporting: a spawn error has no exit code (status null, `error.code`); a signal exit has status null. The script must print the error code or signal as the run's result and count it as failed.

**Means for the brief.** Keep §3.2's shape (n runs, no shell, per-run line, summary, non-zero if any failed). Narrow: the script spawns `cargo`, `node` and an executable only; an `npm` tail needs the `npm-cli.js` route or the matcher must not approve `npm` tails (OPEN item 1). The form must say whether the script honours an env prefix and a `timeout` prefix after `--` (needs its own parser, above) or whether the row refuses them (OPEN item 2; see section 2's recommendation: env and timeout go before `node`, not after `--`).

## 2. The matcher row

**Answer (observed at 2.1.289 against the shipped `register.js`; a harness drove the real hook with a stubbed `$`).** Today `node <runner> <n> -- <command>` is not approved by any row, so no record is made; a new row would match `node`, a runner path under `scripts/evidence/`, a positive integer, `--`, and then apply A1 to A4 to the remaining tokens.

Sources, all `tools/mods/spatial-evidence-recorder/hooks/register.js` at main 17063904:
- `register.js:36-89` `splitCommand` (splits at `&& || ; | &` and newlines outside quotes; `unsupported` for a backtick, `$(`, `<<`, `<(`, `>(`; `unbalanced` for an open quote).
- `register.js:139-155` `ENV_ASSIGNMENT`, `TIMEOUT_DURATION`, `normalise` (drops leading `NAME=value` words and `timeout <duration>`).
- `register.js:157-177` `NPM_SCRIPTS`, `VERIFY_SCRIPTS`, `isApproved`: A1 at 162-166, A2 at 167-170, A3 at 171, A4 at 172-175.
- `register.js:181-186` `leadingCdDir`; `register.js:189-212` `planFor`.
- `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md` §2.2 (the row tables A1 to A4).
- Harness: `<scratch>/matcher/harness.mjs` over a byte copy `<scratch>/matcher/register.mjs` of `register.js` (no edit); it calls the registered `tool.call` hook with `e = { tool: 'Bash', command }`, a stub `$.process.run` answering git, a stub `$.fs.write` capturing the record, and a `next` returning a Bash-shaped result.

Output of the harness (what the shipped rows do):

```text
RECORDED session-default | node --test "scripts/hooks/*.test.mjs"
no record | node scripts/evidence/repeat-runner.mjs 3 -- cargo test -p spatial-kernel
no record | timeout 900 node scripts/evidence/repeat-runner.mjs 3 -- cargo test -p spatial-kernel
no record | CARGO_TARGET_DIR=D:/t node scripts/evidence/repeat-runner.mjs 3 -- cargo test -p spatial-kernel
RECORDED session-default | CARGO_TARGET_DIR=D:/t cargo test -p spatial-kernel
RECORDED session-default | timeout 900 cargo test -p spatial-kernel
RECORDED session-default | timeout 900 CARGO_TARGET_DIR=D:/t cargo test -p spatial-kernel
RECORDED leading-cd      | cd C:/dev/wt/x && cargo test -p spatial-kernel
RECORDED leading-cd      | cd /c/dev/wt/x && cargo test -p spatial-kernel
no record | cd C:/dev/wt/x && node scripts/evidence/repeat-runner.mjs 3 -- cargo test
RECORDED unresolved      | cd "$W" && cargo test
RECORDED session-default | export CARGO_TARGET_DIR=D:/t; timeout 900 cargo test -p x
no record | for i in 1 2 3; do cargo test -p x; done
no record | for i in $(seq 1 3); do cargo test -p x; done
no record | for i in {1..3}; do timeout 900 cargo test -p x > log$i 2>&1; echo rc=$? >> log$i; done
no record | i=0; while [ $i -lt 3 ]; do cargo test -p x; i=$((i+1)); done
RECORDED session-default | cargo test -p x 2>&1 | tail -5
no record | cargo test -p x $(echo y)
no record | node scripts/evidence/repeat-runner.mjs 3 -- npm test
```

(The runner file name `repeat-runner.mjs` is a placeholder in the harness; the form names the real one.)

What the current rows do with each prefix: an env prefix and `timeout <duration>` are dropped by `normalise` (any order), so the rest is judged alone. `cd X &&` is its own segment, never approved, and does not stop the others; a leading `cd <absolute dir> &&` selects `leading-cd` with that cwd, `cd "$W"` selects `unresolved`. Any `$(...)` or backtick anywhere (even inside double quotes) makes the whole call not approved, so no loop that uses `$(seq …)` can be recorded. A `for`/`while` loop is not approved because each segment's first token is `do`, `i=…`, `[` or `done`.

**The row, as plain text (A5).** After `normalise`, the segment has the tokens `node`, a runner path, a decimal integer n of 1 or more, `--`, and at least one further token. The runner path is judged exactly as A4 judges a script path (backslashes to slashes, a leading `./` dropped, equal to or ending in `/` plus `scripts/evidence/<the runner's file name>`). The tail, the tokens after that first `--`, is passed to rows A1 to A4 (`isApproved`) as it stands. If the script does not parse an env prefix or a `timeout` prefix after `--` (section 1), the tail is not normalised, so `node <runner> 3 -- CARGO_TARGET_DIR=… cargo test` is not approved (it would only produce a failed run record for a command that never started). If the form decides the script does parse them, the tail is normalised the way the head is. The record gains `repeat: n`, parsed from the token after the runner path; `command` stays the whole string. A `cd <dir> &&` before the runner, an env prefix and a `timeout` before `node`, and a pipe or redirect after the call stay as they are today (all handled by the existing plan: the matcher already tests each segment and the leading-cd logic is unchanged).

Forms the row would miss: shell loops of any kind (`for`, `while`, `seq`, brace ranges, `$(...)`); a runner invoked through a variable (`node "$R" 3 -- …`, since `$` is not expanded); n given by a variable or expression; a runner path that is not under `scripts/evidence/`; a tail that is `npm …` (unless the script spawns it via `npm-cli.js`, section 1); a tail with `cargo test --no-run` or `-- --list` (refused by A1 as today); a tail that is a pipeline or `&&` chain (only the first command after `--` belongs to the runner; the splitter ends the segment at `&&`, `|` or `;`).

Invocation forms agents actually used for repeated runs in the last two Phase R campaigns:
- `state/consults/2026-10-04-timing-tests-reproduction.md:27`: one run is one `cargo test -p <package> --test <binary> <test name> -- --exact --nocapture` invocation, each output captured to its own log with the exit code appended as `rc=N`, the runs of a variant issued by a shell loop in one Bash call (paraphrase of that line). `…:26`: every command ran with `CARGO_TARGET_DIR=D:/wt-targets/timing-r`. The loop text itself is not in the consult, only its description.
- `state/consults/2026-10-04-timing-assertions-under-contention-reproduction.md:169`: the same `cargo test -p spatial-kernel --test end_to_end h2_a_cancel_before_the_first_batch_still_stops_the_query -- --exact --nocapture`, the engine `--test slice` forms, and `cargo test -p spatial-engine --test slice` whole, each under `timeout`, with stdout and stderr to its own log and `rc=N` appended (paraphrase). `…:49`: a run loop printing `date -u` stamps (paraphrase). `…:40`: the loader `cargo build --release -p spatial-engine` in a fresh `CARGO_TARGET_DIR` (a build, not a test run, so no row applies).
- The live log shows single-shot forms from the same campaign: `cd /c/dev/wt/tauc && CARGO_TARGET_DIR=D:/wt-targets/tauc timeout 1800 cargo test -p spatial-kernel --test end_to_end h2_a_… -- --exact --nocapture 2>&1 | grep -v "^ *Compiling"; echo "rc=${PIPESTATUS[0]}"` (records 00:25Z and 00:26Z on 2026-10-05) and `export CARGO_TARGET_DIR=D:/wt-targets/tauc; timeout 900 cargo test -p spatial-kernel --test end_to_end 2>&1 | grep -E "test result"` (2026-10-04 23:43Z). Those are recorded; none of the consults' loop forms is in the log, matching §3.1's finding that loops are not approved.

Incidental finding for the form (observed in the live log): three run records (2026-10-05 00:25Z to 00:26Z, all `cd /c/dev/wt/tauc && …`, `tree_basis` leading-cd) read `toplevel`, `head`, `before.*` all `unavailable` with `recorder_ms.before` 5 to 9 ms. `leadingCdDir` accepts a leading `/` (`register.js:184`) and passes it as `cwd`; a Node probe shows a POSIX-style cwd does not start git on this machine (`spawnSync('git', …, { cwd: '/c/dev/spatial-ide' })` gives ENOENT, `cwd: 'C:/dev/spatial-ide'` gives exit 0). The host's `$.process.run` is not Node's spawn, so the live records are the evidence for the host and the probe only for the mechanism by analogy. These count toward `UNAVAILABLE_STOP`.

**Means for the brief.** Keep §3.2's one row, with the tail judged by A1 to A4 un-normalised unless the script parses prefixes. OPEN item 3: the POSIX-spelled `cd` records above are `unavailable` through no timeout; the v0.1 form should say whether to fix `leadingCdDir`, translate `/c/…`, or leave it and discount it in the `unavailable` share. OPEN item 4: since the campaigns' real forms were loops with `$(...)` or `timeout` plus log redirects, the brief rule (round 50, item 1) is what makes them recordable; the row alone does not.

## 3. Where the previous write's duration can be read

**Answer (typed at 2.1.288; code read; the live log read).** The hook can time its own `$.fs.write` call with the clock it already uses (`Date.now()`, register.js:368, 375, 383, 390, 392, 415 and live at 2.1.289) and a record can carry the previous write's duration in a module variable, but the first record after a load and any concurrent record have no previous value, so the field must be allowed to read `unavailable` and must name which write it measured. The current `recorder_ms.write` does not measure the write: it spans the cached log-root lookup and the record assembly only.

Sources:
- `<skill-root>/types/claude-code.d.ts:3036-3041`: `write: (path: string, text: string) => Promise<void>` ("Writes `text` to a file, creating it and its directories as needed"); `:3011-3013`: a read or write over 4 MiB rejects.
- `<skill-root>/types/claude-code.d.ts:3220`: `$.clock.now(): Promise<number>` resolves milliseconds since the epoch, through the host (an async `$` call, so itself a round trip, unlike `Date.now()`).
- `<skill-root>/types/claude-code.d.ts:13896`: `var performance: { now(): number }` declared among the module's globals; `crypto` at `:13886`. `Date` is not in that list but `register.js` uses `Date.now()` and `new Date()` and the live records carry values from it. Whether `performance.now()` exists at runtime at 2.1.289: not verifiable without a live session (`claude plugin test` is unavailable here, below). The probe: one E9 row line using `performance.now()` inside a `try`.
- `<skill-root>/reference.md:23` (verbatim excerpt: with no DOM and no Node) and `<skill-root>/types/claude-code.d.ts:4796` (verbatim excerpt: the clock stops while a `next(e)` call or): a hook's own-time budget does not run while a `next` or `$` call is in flight.
- `register.js:343-348` `writeRecord`: builds the line, digests it, then `await $.fs.write(...)`. `register.js:392-417`: `t2` at 392, the record literal (with `write: Date.now() - t2` at 415), then `writeRecord` at 417. So the timed span is `resolveLogRoot` (393) plus the record assembly; `writeRecord`'s digest and `$.fs.write` run after the field is fixed. A record cannot contain its own write time because its text is the thing written (the form's §10, Amendment 2, item C2-d, by section and item: it states the same span and concludes that before + after + write is a lower bound on the call-path work).
- `register.js:350-357`: the log root is cached in a module variable `cachedRoot` on success only, so module state persists across hook calls within a load (state across a hot reload is lost, `reference.md:88` on `$.state`). `register.js:424-459`: usage records also call `writeRecord`, so a "previous write" can be a usage record or a concurrent subagent's.
- The live log, `C:/dev/spatial-ide-local/evidence/<day>/*.json` (read only): 43 records, 30 `run` and 13 `usage`; 2026-10-04 holds 24 files (16 run, 8 usage), 2026-10-05 holds 19 files (14 run, 5 usage), counted at the time of reading (09:27 local on 2026-10-05 being the latest file's mtime in the folder listing).

Probe and output (a script over the log, no write):

```text
recorder_ms.write over the 30 run records: 0 in 28; 69 in the first record of the load (183504233, the log-root lookup);
1 in one record (071858957).
```

An out-of-band estimate from the same files, derived by me (not a recorded field): `mtime(file) - ended_at - recorder_ms.after`, where the file's mtime is stamped by the write itself, covers the record assembly, the digest and the start of the `$.fs.write`. Over the 30 run records: 0 to 3 ms in 28, 12 ms in one (050710239), 71 ms in the first record of the load (the log-root lookup plus creating the day folder's first file). That bounds the time up to the write's execution; it does not include the call's return trip to the hook, which only an in-hook timer sees. `mtime` is the filesystem's stamp (floating-point ms from `fs.stat`) against `Date.now()`, the same machine's clock.

**Means for the brief.** Keep §3.3 (a new live row with its own sample, declared before it is taken; E5 stays a lower bound). Narrow: the form must choose between (a) the previous write's duration carried in the next record (module variable; reads `unavailable` for the first record of a load and is ambiguous for concurrent writes unless the record names the previous write's own record id, i.e. its file name's digest) and (b) a derived out-of-band figure from file mtime minus `ended_at` minus `recorder_ms.after`, which needs no code change and already shows 0 to 3 ms. OPEN item 5: choose (a), (b) or both, and say which clock, `Date.now()` as shipped, or `performance.now()` after the E9 probe. (a) and (b) measure different spans; neither is a write's return trip except (a).

## 4. The identity's cold and warm costs

**Answer (observed: Node `spawn`, no shell, git 2.49.0.windows.1, on this machine; the host's `$.process.run` was not itself timed).** The before-snapshot is three git calls issued together (`register.js:256-260`), each with `timeoutMs: 2000`, so its declared ceiling is 2000 ms, not three in series as §3.4 states; measured, it costs about 76 ms p50 in the main checkout and about 140 to 220 ms in a fresh clone, cold or built, so a cold tree does not explain a 4276 ms `before`.

The git calls in order, as `register.js` makes them (every call is `git --no-optional-locks <args>` with `timeoutMs: PROCESS_TIMEOUT_MS`, register.js:13 and :218-221, no `cwd` unless a leading-cd plan sets one):
1. Before the command, all three issued together by `Promise.allSettled` (register.js:256-260, `snapshotBefore`): `rev-parse --show-toplevel HEAD`; `status --porcelain=v1 -z`; `diff HEAD --binary`. Each 2000 ms. Skipped when the plan is `unresolved` (:253). Worst case by the declared timeout: 2000 ms.
2. After the command (not before it; register.js:269-281, `snapshotAfter`): `status --porcelain=v1 -z`; `diff HEAD --binary`; `rev-parse HEAD`, together, each 2000 ms. Then `$.agent.list()` for a subagent (:291-300, no timeout declared), then `resolveLogRoot` (:352-357): `rev-parse --path-format=absolute --git-common-dir`, 2000 ms, only until it has succeeded once per load. Worst case after the command by the declared timeouts: 4000 ms plus `$.agent.list` and `$.fs.write`, which have no declared timeout. None of that is before the command.
3. Worst-case total wait before a command today, by the declared values: 2000 ms. The live log shows it is not a bound on `recorder_ms.before`: see below.

Probe: `<scratch>/timing/gittime.mjs <cwd> <runs> <label>` spawns the exact argv sets above (`git --no-optional-locks …`, `shell: false`, the three of a stage together, as the hook issues them), times each call and each stage with `performance.now()`, and prints min, p50, p95, max. Clones: `git clone --no-hardlinks C:/dev/spatial-ide D:/wt-targets/recorder-v01-p0/cloneN` (about 29 s each, 1637 files, 103 MB). The "after a build" row builds `cargo build --offline -p spatial-data-plane` in clone2 with the target folder inside it (`clone2/target`, 390 MB, 995 files, gitignored; finished in 54.88 s, rc=0); `git status --porcelain` in clone2 after the build printed nothing (0 lines).

Results, ms (the stage wall time of the three calls issued together; "per call" are the individual spawns):

```text
                                         min   p50   p95   max      first call
(a) main checkout, warm, n=20
  before stage (rev-parse+status+diff)    70    76    87    88      88
  after stage                             68    72    85    87      72
  log-root lookup                         31    33    36    42
  per call: rev-parse p50 49, status p50 73, diff p50 66
(b) fresh clone, first call (before stage), three fresh clones:        clone2 162, clone3 217, clone4 199
    (clone1 had ls-files/log run first: 147, not counted)
    clone2, then 20 warm runs (stats over the 20 after the first)
  before stage                           139   170   176   189      162
  after stage                            139   159   188   197      146
  log-root lookup                         43    53   100   104
  per call: rev-parse p50 70, status p50 159, diff p50 156
(c) clone2 after the build, first call then 20
  before stage                           124   136   155   162      170
  after stage                            122   131   150   151      138
  log-root lookup                         38    40    48    50
  per call: rev-parse p50 60, status p50 130, diff p50 124
extra: main checkout, warm, with 16 busy node processes running (16 logical cores), n=20
  before stage                           262   296   358   361
  after stage                            235   301   330   338
  log-root lookup                        105   132   164   179
```

Read against the live log (26 run records with a real `before`, `recorder_ms.before`): min 82, p50 133, p95 1112, max 4276; excluding the two outliers, 24 records have p50 127 and p95 208. The two outliers are 1112 ms (2026-10-04 22:48Z) and the 4276 ms record (started 18:37:25.759Z, ended 18:37:50.425Z, `toplevel`, `head`, both before hashes `unavailable`, after fields all read, `recorder_ms.after` 138). 4276 is 2 x 2000 + 276, so every one of the three before calls failed, and the figure fits either explanation that follows; neither is established.

Does a cold tree explain 4276 against 2000? No, on this evidence: the slowest first call in a fresh clone was 217 ms, a built clone 170 ms, full CPU load about 360 ms, the main checkout under the live session 82 to 273 ms except for two samples. A cold tree would have to be about twenty times slower than the clone's first calls. The after-snapshot of the same record took 138 ms, so the slowness ended within the same call.

What else could, without guessing beyond the evidence: (1) the host serialising `$.process.run` calls, which would make three timeouts add up (the arithmetic fits two timeouts plus 276 ms; typed docs do not say; not verifiable without a live session; the probe: a scratch mod issuing three `$.process.run` calls of a deliberately slow git alias and timing the stage); (2) the timeout not bounding the elapsed time (kill, then rejection, taking longer than `timeoutMs`; the typed doc says "killed and the call rejects", `<skill-root>/types/claude-code.d.ts:7553`; the live record shows an elapsed of more than 2 x `timeoutMs`); (3) machine load at 18:37Z that the log does not contain (a build or a test run in another session). §3.4's own phrase "the calls run in series" does not match `register.js:256-260`; the form should correct that sentence.

**Means for the brief.** Keep §3.4's one declared ceiling across all git calls, reaching it yielding `unavailable`. Narrow: the ceiling must bound the stage's own wall time with a timer around the stage, because the per-call `timeoutMs` has been seen not to bound `recorder_ms.before` (4276 against 2000). OPEN item 6: where the ceiling lives (a race between the stage's promises and a timer, with a note that the underlying calls keep running); OPEN item 7: whether cold trees need a remedy at all (this P0 found none). OPEN item 8 (correction to the brief's wording): the before calls are concurrent, not serial.

## 5. `claude plugin validate` baseline

**Answer (observed at 2.1.289, on a copy of the Recorder folder in the scratch folder; the live folder was not validated).** `validate` exits 0 with one warning (no `version`) and these two lines, the baseline v0.1 changes against:

```text
  ❯ ./register.js hooks: tool.call{tool=Bash}, turn.complete
  ❯ ./register.js calls: $.agent.list (via agentTypeOf), $.fs.write (via writeRecord), $.process.run (via gitRun)
```

Sources: `claude plugin validate spatial-evidence-recorder` run in `<scratch>/validate` (a `cp -r` of `tools/mods/spatial-evidence-recorder`, byte copy of main 17063904), text and `--json`. The text output reads `⚠ Found 1 warning:` then `version: No version specified. Consider adding a version following semver (e.g., "1.0.0")`, `✔ Validation passed with warnings`, rc=0. The `--json` output has `"success": true`, `"strict": false`, manifest `errors: []`, one warning `{"path":"version","message":"No version specified. …","code":null}`, and `contents[0]` of type `hooks` with `errors: []`, `warnings: []` and `notes` equal to the two lines above byte for byte. These match Amendment 2, C2-e (the three `(via …)` annotations).

`claude plugin test spatial-evidence-recorder` (copy), at 2.1.289: exit 1, "claude plugin test: hooks modules are turned off in this process: the rollout switch was saved off by an earlier session and is not refreshed yet. Start `claude` once with network access, then run the tests again; if this message returns, installed mods are turned off remotely". Starting `claude` is outside this run's limits, so the plugin test suite could not be run: not verifiable without a live session; the probe is `claude plugin test <dir>` after the human has started `claude` once. This matters for the worker step: its test runs need that switch refreshed first.

Types versus build: `claude --version` read 2.1.289 at the start and the end; the types read are 2.1.288's, the only readable ones. `validate`'s lines at 2.1.289 are observed, not typed.

**Means for the brief.** Keep: the v0.1 form predicts `validate` unchanged unless a new `$` call is added (a ceiling timer and a `repeat` field add none; a `$.clock.now` read would add a `$.clock.now` calls line, so choosing `Date.now()` or `performance.now()` keeps the line as is). OPEN item 9: the `plugin test` rollout switch before the worker step.

## Other observations (not in the questions)

- Guardian refused two of my own calls during this run: a Bash command whose heredoc held JavaScript with the word `push` in `bw.push(b.wall)` was refused by G1 ("this git push force-pushes or deletes a remote ref"); no force or delete spelling was present (one more data point for the G1 false alarm of the Guardian v1 brief, section 2.1); and a Write to a file in a folder that did not yet exist was refused ("the path cannot be placed"), then succeeded once the folder existed.
- `env | grep -i cargo` matched the PATH variable (it contains `.cargo/bin`), so the user's PATH was printed once into this run's output; it is not reproduced here.
- Two commands in the run exceeded 60 s and went to the background (the first: `git ls-files`, `du` and `git config --list` chain; the second: `du` and `ps -W`); the git calls themselves timed at 76 ms in the main checkout, so the delay was `du` or `ps -W`.

## Commands run, with exit codes, and what was left behind

Every command had a timeout (30 s to 900 s). Exit codes, in order:
- `claude --version` (start) 0; mkdir of the scratch and the D: folders 0; reads of the brief, `register.js`, the form sections, `hooks.json`, the consults, the live log, the type file and reference (read-only shell commands and file reads) 0.
- `node repeat.mjs …` probes of section 1: argv, glob and `second --` probes 0; `cargo`, `node` 0; `npm` 1; `npm.cmd` 1; `timeout 5 node --version` 0; `timeout --version` 0; PATH-limited `timeout` probe 1; `node …npm-cli.js --version` 0; `FOO=1` 1; `CARGO_TARGET_DIR=…` 1; `cd … &&` 1; `flaky.mjs` 1 (by design); `envto.mjs` env 0 and `envto.mjs` timeout 0 (the probe reports ETIMEDOUT in its own output; the script itself exits 0); node `spawnSync("npm.cmd", { shell: true })` 0.
- Grandchild-survival probes (`gc.mjs`, `hold.mjs`) 0, and a PowerShell CIM query that read process command lines and stopped a probe grandchild by its own marker when found (none was found alive after the kill).
- `node harness.mjs` (matcher) 0.
- `git --no-optional-locks ls-files | wc -l`, `status --porcelain`, `check-ignore`, `config` reads, `log -1` in the main checkout: 0 (read only; main's porcelain was `?? .codex-remote-attachments/` and `?? PROMPT-AUDIT-2026-10-04.md` before and after).
- `git clone --no-hardlinks C:/dev/spatial-ide D:/wt-targets/recorder-v01-p0/clone1` to `clone4`: 0 each.
- `node gittime.mjs …` runs: main warm 0; clone2 first plus 20 warm 0; clone3 0; clone4 0; clone1 0; clone2 after build 0; main under 16 busy processes 0 (the 16 `node -e` busy loops, each under `timeout 60`, ended on their own).
- `cargo build --offline -p spatial-data-plane` in clone2: 0 (54.88 s).
- `claude plugin validate <copy>` text 0; `--json` 0; `claude plugin test <copy>` 1; `claude --version` (end) 2.1.289.
- Two refused calls (the Guardian refusals above) ran nothing.
- No `claude plugin install/enable/disable/uninstall/marketplace/init/new/update/configure/eval`, no `claude mcp`, no session of any kind, no setting changed, nothing written under the user's Claude folder, no git command run in `C:/dev/wt/dptwc`, no repository or `spatial-ide-local` write.

Left behind (writable places only):
- `<scratch>/` is the session scratchpad's `recorder-v01-p0` folder: `probe/` 18 KB, `matcher/` 24 KB, `timing/` 4 KB, `validate/` 67 KB (a copy of the Recorder folder), and this report.
- `D:/wt-targets/recorder-v01-p0/`: `clone1/` 103 MB, `clone2/` 492 MB (holds the 390 MB `target/` of the data-plane build), `clone3/` 103 MB, `clone4/` 103 MB, `build.log` 4 KB, `build.time` 1 KB. None removed; the custodian can remove the clones.

## Open items for the form (collected)

1. `npm` tails: spawn via `npm-cli.js`, or refuse them in the row (section 1).
2. Env and `timeout` after `--`: parsed by the script, or refused by the row (sections 1 and 2).
3. POSIX-spelled `cd /c/…` plans end `unavailable` through no timeout (section 2).
4. The brief rule, not the row, makes loop-shaped campaigns recordable (section 2).
5. How the previous write's duration is carried or derived, and the clock (section 3).
6. Where the stage ceiling lives, with the stage-level timer (section 4).
7. Whether cold trees need a remedy: none found (section 4).
8. The brief says the before calls run in series; the code runs them together (section 4).
9. `claude plugin test` is switched off in this process until a `claude` start refreshes it (section 5).
