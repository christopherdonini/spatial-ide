# The Guardian parity test reads a timed-out git call as a timeout, and its runner's bound is chosen from a measurement (PLAN node `guardian-parity-git-timeout-under-load`): preregistration

*Committed by the custodian on 2026-10-24 at main 905f31c8, in the governance lane's turn, from the architect's draft (`state/consults/2026-10-23-guardian-parity-git-timeout-under-load-architect-draft.md`, its sha256 from line 5 5f7da2d46f379cb74937b73d1d609f44111f836d5eaa8a30f904b11245fffce5), byte for byte except: every cite at c8351520 is pinned by script to `path:line @ <commit> sha256:<the lines with their LFs>` (19 pins; the path-less `:13` to `:27` cites of §6 stay loose, continuing the pinned machine-rules cite); the draft's OPEN items are carried as §11; and this note. Main changed none of the 12 pinned files between c8351520 and 905f31c8. **The human's rulings, before any code** (state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:22 @ 905f31c8633570057c24c15173f1400cdb32214c sha256:8e35680dd0be87792babd6b431ceca28c833942c13a7786cbe04239b4a1098d5): OPEN-1 yes, so (A), no re-read, and §8 item 5 binds; OPEN-2 recorded as a finding only, in this form's Amendment 1 if the series shows it. They are stated here, not as an amendment, so that this form's own references to its Amendment 1 (I1's fallback, OPEN-2, §5's rule, §8 item 2) stay the series' record. **Rule (00) at this commit:** #245, #247 and `flush-crlf-field-rewrite`, which §9 names, have merged; no branch in flight (#241, #244, #249, #250, port-2, 1c step 1, covering-case, milestone 4 PR C) changes any file under `scripts/hooks/`. Form path: `scripts/hooks/GUARDIAN-PARITY-GIT-TIMEOUT-UNDER-LOAD-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file.*

**Authority:** PLAN node `guardian-parity-git-timeout-under-load`. The human proposed it and graded it S3 (`state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md:22 @ c83515200a783d416c3a91325a27a07512817280 sha256:f2a0bbfe8abfb8993862a8af42f4c66723271c097096ca541ad375fdc3333be8`, item 8). The human placed it fourth in the governance lane, after `flush-crlf-field-rewrite` (`state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:12 @ c83515200a783d416c3a91325a27a07512817280 sha256:c13138a5d6b24ca065029eb8715d26c9276fbbbd3b068b356830c78cd0a6849d`, item 3). The sighting is the ledger entry of 2026-10-22T20:45Z in `state/CUT-STATE.md` ("Milestone 4 PR A's row 15").

**Drafted by** the architect agent on the custodian's brief, read at main c8351520. It is committed before any code, as the node's gate file, and is append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Form: full** (AUTONOMY.md §21a, a property under test; §25(e)). Size per §21c is under the threshold and does not decide the form.
- The parity of the mod's predicate and the Stop hook's predicate is a property under test, asserted by T35 and T36 (`scripts/hooks/guardian-continuity-parity.test.mjs:319-347 @ c83515200a783d416c3a91325a27a07512817280 sha256:0eb5585fb13c80bac8daae6ea75efed6bfaf997b1b0086c42a00731cad6730eb`). §2 changes what T35 reads as a pass: a timed-out read becomes a named failure instead of a compared outcome.
- §2.3 may change a declared parity value of the closed Guardian v0 form: the runner's 2000 ms per-call timeout (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md:431 @ c83515200a783d416c3a91325a27a07512817280 sha256:4c13305349591a9e6aec75ccb8a797c15982e480aa9623705c9e039550000725`; also `:251`).
- §21a's fourth category is "any property currently under test" (`AUTONOMY.md:327 @ c83515200a783d416c3a91325a27a07512817280 sha256:d80649bedfea2f8ac48948d94ca0d4b3f629fb1a5e3c407b5d01bae98e390a95`). An Out-of-scope line could not assert "none of the four", so §25(e) applies (`AUTONOMY.md:482 @ c83515200a783d416c3a91325a27a07512817280 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669`; template `docs/PREREGISTRATION-TEMPLATE.md:176 @ c83515200a783d416c3a91325a27a07512817280 sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917`).
- A second reason, independent of the first: the bound comes from a measurement. The rule that turns the measurement into the bound has to be declared before the series runs (§5, §6, §7). The five-line form has no place for that rule.
- No other category applies. There is no ADR, no wire or MCP surface, no security posture and no new exposure surface. ADR-006 does not apply, because this is repository tooling.

## §0. Disclosure
- **Reasoned from code at c8351520. Nothing was run.** The piece relies on the following.
  - **The test's mod side.** `STOP_RUN_OPTS` reads `const STOP_RUN_OPTS = { timeout: 2000, maxBuffer: 64 * 1024 * 1024 };` (`scripts/hooks/guardian-continuity-parity.test.mjs:233 @ c83515200a783d416c3a91325a27a07512817280 sha256:137439cfe5091b3edee1f53d622e03d3666f209c385677d27815c0aedc42ae3b`). It is used only in `modOutcome`'s `spawnSync` runner, which throws `r.error` and keeps no cause (`:245-255`).
  - **The test's Stop side.** `stopOutcome` calls the shipped `decide` (`:258-274`). It passes nothing that sets a git timeout: `decide` takes `projectRoot`, `now` and `notify` (`scripts/hooks/stop-queue.mjs:293 @ c83515200a783d416c3a91325a27a07512817280 sha256:3cc977221de5ae6d437b4aee4f5cc7af79bbfde875f0537c9cea0911f920cb61`).
  - **Two timeouts, not one.** The Stop hook's own per-call timeout is module-local and not exported: `CONTINUITY_GIT_TIMEOUT_MS = 2000`, with its 13 s under 20 s reason (`scripts/hooks/stop-queue.mjs:60 @ c83515200a783d416c3a91325a27a07512817280 sha256:10949fb608af4c848a192709ac9258d5e493e52f9bdae9ddca8b6895f5e32122`). `tryGit` swallows every error to `null` (`:77-83`).
    - Changing `STOP_RUN_OPTS` cannot change the Stop side. The node's summary names only `STOP_RUN_OPTS`. §2 keeps to that and leaves the product's value alone.
  - **What a timeout produces today, on both sides.**
    - A timed-out first or second call reads `not judged` (`stop-queue.mjs:230-238`; `tools/mods/spatial-guardian/hooks/continuity.mjs:50-57 @ c83515200a783d416c3a91325a27a07512817280 sha256:f7638cb12212fda596c342010bff7f5907b038e2abd892f85e8beb38a625e8fe`).
    - A timed-out third call, the parent show, reads `fresh` on both sides (`stop-queue.mjs:240-242`; `continuity.mjs:59-60`).
    - So a slow call misreads in one of three ways. A one-sided timeout is a false divergence; this is the sighting. A two-sided timeout gives equal misreads, and T35 passes them silently. A parent-show timeout reads `fresh` where the fixture is `stale`. The test has no per-fixture expected outcome, so it sees none of the silent cases.
  - **How the Stop hook calls git.** `stop-queue.mjs` imports `execFileSync` by name from `node:child_process` (`stop-queue.mjs:44`). Its continuity calls are `log`, `show` and `show <c>^1` with `{ timeout, maxBuffer }` (`:229-240`). `decide` also runs HALT's `fetch`, with a 5 s timeout, before continuity (`:132-136`). On the stale path it also runs `rev-parse` (`:258`), and a `null` there does not change the block (`:337`).
  - **The mod's shipped value.** The mod ships the same 2000 ms (`tools/mods/spatial-guardian/hooks/register.js:1095 @ c83515200a783d416c3a91325a27a07512817280 sha256:216f17a541eb839c5d66faf52db26aea7d83db5456e36d423124259db583fabb`; `tools/mods/GUARDIAN-V0-PREREGISTRATION.md:424 @ c83515200a783d416c3a91325a27a07512817280 sha256:11ca631343f5f73d3fecfa6a68a76bb127c62ebb716e1d8acdc3e21fe3671d7d`). Nothing under `tools/mods/spatial-guardian/` is written.
- **The sighting** (the ledger entry of 2026-10-22T20:45Z). PS9 read `not judged` once under load, and the file passed alone, 15 of 15. The entry does not say which side read `not judged`, and that run's diagnostic lines were not filed. PS9 is not a large fixture (`guardian-continuity-parity.test.mjs:196-202`), so this reads as a load tail and not as a property of PS9. That reading is a hypothesis, and its discriminator is §6's per-call series.
- **Reuse index** (the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c), byte for byte from the brief:
```text
$ node tools/reuse.mjs git timeout under load
No prior art recorded for "git timeout under load". Research it before planning an implementation.
$ node tools/reuse.mjs test timeout measurement
No prior art recorded for "test timeout measurement". Research it before planning an implementation.
```
  Both are misses, so no prior art is used.
- **Fixture drive.** The 5 GB fixture is not used. The thirteen fixtures are built in `os.tmpdir()`. The tester records only its drive letter, as a confound.

## §1. May and may not claim
- **May claim:**
  1. A git call on either side that outruns its timeout fails T35's subtest with a message naming a timeout. It is never compared as an outcome and never passes (T37, T38).
  2. Each fixture's per-call git times on both sides are reported as a diagnostic line.
  3. `STOP_RUN_OPTS.timeout` is the output of §5's rule over §6's series.
- **May not claim:**
  - any `docs/08` row or performance figure. A shared machine is not a reference profile (`docs/08_Testing.md:11 @ c83515200a783d416c3a91325a27a07512817280 sha256:1df4ead111e0e3eef75474dd27a412142f6f157861259d28ac5cbea5d86dd0f6`, `:17-19`). The series is an observation of this machine, under this load, at the named commit, and it is used only to size a test timeout;
  - that the Stop hook's 2000 ms is adequate under load;
  - that the parity test cannot go red under load. It goes red by name instead of misreading;
  - any change to the predicate on either side.
- **Unchanged:**
  - `scripts/hooks/stop-queue.mjs` whole, `precompact-flush.mjs`, and every file under `tools/mods/`;
  - `FIXTURES` and its thirteen ids;
  - the two openings (`:238-239`), the outcome classification, `ENGINE_STDOUT_BOUND`, `maxBuffer` and the oversize check;
  - T35's and T36's names, and the three recorded mutations (`:310-318`, `:337-340`), which are re-observed under §4.
- **Seams** (each against the interface the other side has at c8351520):
  - **The test into `judgeContinuity`:** the runner contract (resolve the result, reject on error) is unchanged (`continuity.mjs:30-40`).
  - **The test into the shipped `decide` through `node:child_process`:** the observer (§2.2) wraps the module's `execFileSync`, which `stop-queue.mjs:44` imports by name. Node's `module.syncBuiltinESMExports()` updates that live binding. The proof from the real shape is T35's non-vacuity assertion, together with T38.
  - **No new export, in any file.**

## §2. The change
1. **Instrument commit, mod side.**
   - **Before:** `if (r.error) throw r.error;`, with no record kept (`:247-248`).
   - **After:**
     - The runner times each call and records `{ side: 'mod', args, ms, exitCode, timedOut }`, where `timedOut` is `r.error?.code === 'ETIMEDOUT'`. It still throws on `r.error`, so the contract with `judgeContinuity` is unchanged.
     - The runner takes an optional program and prefix, default `'git'` and `[]`, for T37's use only.
2. **Instrument commit, Stop side.**
   - In `before()`, the test replaces `childProcess.execFileSync` (the default import of `node:child_process`) with an observer and calls `syncBuiltinESMExports()`. `after()` restores the original and syncs again.
   - The observer records `{ side: 'stop', args, ms, exitCode, timedOut }` for `git` calls while a per-read array is set, during `stopOutcome` only. It returns and rethrows exactly what the original does.
   - Only T38 sets the observer's substitution, which swaps one call's program for a sleeping child. The product's own options, its timeout included, stay unchanged.
3. **The consumer, in the same commit.** One helper, `timeoutFinding(calls)`, reads the `log` and `show` calls of both sides.
   - It returns null, or the message `<id>: timed out: the <side>'s git <args> ran <ms> ms against its timeout, so the fixture was not read`.
   - T35's subtest asserts it is null before comparing outcomes.
   - T35 also asserts that the Stop side recorded at least one `log` call (non-vacuity).
   - T36 counts only reads with no recorded timeout.
   - One diagnostic line per fixture opens `<id> git ms:` and lists each call as `<side>:<position>=<ms>`, flagging any non-zero exit.
4. **Bound commit, after Amendment 1.**
   - **Before:** `timeout: 2000`.
   - **After:** `timeout: B`, where B is §5's rule output. The value carries a reason comment that cites this form by section and amendment.
   - If B is 2000, no bound commit is made. Amendment 1 records that the rule kept the value.

## §3. Fixtures
The thirteen fixtures as built by the test at the instrument commit. Each one's predicted outcome is "the two sides agree, no timeout" on an unloaded run.

## §4. Tests and mutations
- **T37** `guardian parity: a mod-side git call that outruns the runner's timeout is recorded as a timeout, not read as an outcome`.
  - The runner's program is set to `process.execPath` with prefix `['-e', 'setTimeout(() => {}, 60000)', '--']`. The test drives `judgeContinuity` through it on PS7.
  - It asserts one timed-out `log` record, and that `timeoutFinding` returns a message containing `timed out`.
  - Mutation: the runner records `timedOut: false`. T37 then fails by name.
- **T38** `guardian parity: a Stop-hook git call that outruns its timeout is recorded as a timeout, not read as an outcome`.
  - The observer substitutes the sleeping child for the `log` call, with the product's own options. The test drives the shipped `decide` on PS7.
  - It asserts a timed-out `log` record, that stderr holds the not-judged opening, and that `timeoutFinding` returns a message.
  - Mutation: the observer's catch records `timedOut: false`. T38 then fails by name.
- **T35 (changed): non-vacuity.** Mutation: delete the `syncBuiltinESMExports()` call. Every T35 subtest then fails by name.
- **Recorded mutations.** The three recorded mutations are re-observed at the instrument commit by applying each one, running the test, recording the failure by name with that commit, and reverting. A `verify-mutation` run is not an observation (`docs/PREREGISTRATION-TEMPLATE.md:172 @ c83515200a783d416c3a91325a27a07512817280 sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2`).

## §5. Predictions, rule, invalidators, falsification
- **Predictions (a wrong one is a result):**
  - P1: under L0, no call reaches its timeout, and the maximum per-call time is under 1000 ms.
  - P2: under L1, the p95 is above L0's and no call reaches its timeout.
  - P3: the rule yields B = 2000.
  - P4: T35's non-vacuity holds on Windows and in governance-ci.
  - P5: the three recorded mutations fail their named tests as recorded.
- **The rule.**
  - X is the largest per-call time over the `log` and `show` calls of both sides, across all runs of L0 and L1. A call that timed out counts as 5000 ms.
  - B = min(10000, max(2000, 1000 × ceil(2X / 1000))).
  - A Stop-side call that reached 2000 ms is recorded in Amendment 1 as a finding for the human. It changes nothing in the product.
- **Invalidators** (each one stops the piece, which reports to the custodian):
  - I1: the non-vacuity assertion fails on an unloaded run. The pre-declared fallback then replaces the observer: a Stop-side read whose `decide` took at least 2000 ms (the value restated from `stop-queue.mjs:60`) fails by name as "may have timed out". Amendment 1 records that I1 fired.
  - I2: a divergence on a read with no recorded timeout. That is a predicate finding, outside this piece.
  - I3: any timeout under L0.
  - I4: the hold is refused (codes 96 to 99). Nothing is run another way (`state/directives/2026-10-06-machine-script-adopted.md:19 @ c83515200a783d416c3a91325a27a07512817280 sha256:072d50f76964a9843534b1210c2a2bc6cb1dc566f012aad57115abc31ff6e321`).
  - I5: T37 or T38 runs longer than three times its timeout.
- **Falsification:** the series shows `not judged` on reads with a non-zero exit and no timeout. The misread is then a load-time git error, not a timeout, and §2's classification is the wrong instrument.

## §6. Instruments
- **Assertions:** T35 to T38 and the non-vacuity check.
- **Measurement:** the per-call time of every continuity git call on both sides. It is not a docs/08 measurement.
  - **Dataset:** the thirteen fixtures, at the instrument commit.
  - **Conditions:**
    - L0: `node --test scripts/hooks/guardian-continuity-parity.test.mjs`, 20 runs.
    - L1: governance-ci's command, `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (``.github/workflows/governance-ci.yml:146` at c83515200a783d416c3a91325a27a07512817280, sha256 3cb8995fcb0e1f0b6893038f3b2f2888cda2c5bacef704fe6d643b44f181b301`), 10 runs at default concurrency, under the session's core pin (`state/directives/2026-10-06-machine-script-adopted.md:27 @ c83515200a783d416c3a91325a27a07512817280 sha256:54c20599737b9b55890f7fdb623b513d4d50e87d5f4f152cb89248b429b43bf4`).
  - **The hold:** every run is inside a shared hold, as THE MACHINE prescribes (`:13`, `:15`). A timed measurement is heavy. The `-What` text names the piece and the command only (`:21`).
  - **Recorded per run:** `node --version`, `git --version`, `os.availableParallelism()`, the TAP output saved per run with its sha256, and any non-parity failure, which is reported and not recorded as a failure (`:20`).
  - **Statistics:** per side and per call position, p50, p95, p99 and max in ms, by nearest rank; the timed-out count; and X.
  - **The record:** the tester's report, filed under `state/consults/`. Amendment 1 (class 1) carries only references, the figures and B.

## §7. Declared values and ceilings
- `STOP_RUN_OPTS.timeout`: 2000 until the bound commit. After it, B is one of 2000 to 10000 ms, in steps of 1000.
- The rule's constants: margin 2, step 1000 ms, cap 10000 ms, and 5000 ms as the stand-in for a censored call.
- The series: 20 runs under L0 and 10 under L1. The hold is declared with `-Minutes` 30.
- **Budget:** ≤ 130 changed lines in `scripts/hooks/guardian-continuity-parity.test.mjs` (insertions plus deletions), which is the only code file. ≤ 4 files in all: this form, the test, `PLAN.yaml`, and the generated queue.
- **Added test time:** at most B plus 2000 ms, plus spawn time, for T37 and T38 together.

## §8. Block-on-sight
1. Any change to `stop-queue.mjs`, `precompact-flush.mjs` or any file under `tools/mods/`, or a new export anywhere.
2. `STOP_RUN_OPTS.timeout` changed before Amendment 1, or set to a value that is not the rule's output.
3. A timed-out read that is compared as an outcome or that passes.
4. The observer substituting any call outside T38, or left installed after `after()`.
5. A re-read of a fixture, unless OPEN-1 (B) is ruled.
6. Any record that calls the series a docs/08 measurement or a performance figure.
7. A series run outside a shared hold.

## §9. Gates
- **Architect and reviewer:** both, under full gating.
- **Suites:** governance-ci green, and the reviewer's local run of the file on Windows.
- **Operator:** no rows.
- **Rule (00)** (`AUTONOMY.md:609 @ c83515200a783d416c3a91325a27a07512817280 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0`): this piece's paths are disjoint from #245 (`scripts/hooks/questions-mirror.mjs`, `scripts/hooks/README.md`), #247 (`scripts/plan/verify-cites.mjs` and its test) and `flush-crlf-field-rewrite` (`scripts/hooks/flush.mjs`, `flush.test.mjs`). None touches `protocol/`. L1 runs whatever governance suite is on this piece's base.

## §10. Amendments
Opens empty.

## §11. OPEN items, as drafted (ruled; the note above)

**OPEN-1: re-read on a timed-out read.**
- (A) No re-read. A timed-out read fails by name, and THE MACHINE's line 20 routes it to a run alone.
- (B) Re-read a timed-out fixture, both sides, up to 2 times. It fails by name only if every attempt times out.

Recommendation: **(A)**. It is smaller, masks nothing, and stays within the node as written. (B) is a scope addition (class 9) if it is wanted later.

**OPEN-2: the Stop hook's own 2000 ms.** If the series shows a Stop-side call at 2000 ms under suite load, should a proposal follow? Recommendation: record it in Amendment 1 as a finding only. Any change belongs to another node, which is the human's to place, because the value is the stale-continuity form's §7 budget.

## Amendment 1 — the series and the bound (class 1); written after the instrument and the series were seen

*Written by the custodian. References only: the instrument's report `state/consults/2026-10-24-guardian-parity-git-timeout-under-load-instrument-worker-report.md`; the series report `state/consults/2026-10-24-guardian-parity-git-timeout-under-load-series-tester-report.md` (its TAP files with their sha256s, its statistics and its scripts are named there).*

1. **The instrument** is 6d76bcdb, its recorded mutations 7235aa0c: 103 added and 10 removed in `scripts/hooks/guardian-continuity-parity.test.mjs`, 113 of §7's 130. I1 did not fire: `syncBuiltinESMExports()` rebinds `stop-queue.mjs`'s import on Node v24.18.1. The three mutations fail their named tests (P5), and T35's non-vacuity holds unmutated and fails under the third (P4, locally).
2. **The series** ran at 7235aa0c on node v24.18.1, git 2.49.0.windows.1 and 8 cores, each half inside one shared hold. L0 (20 runs): no timeout; the largest call 69 ms. L1 (10 runs of governance-ci's command, 555 of 555 passing in each): no timeout; p95 203 ms (mod) and 225 ms (stop); the largest call 612 ms. Other shared holds of this project ran beside L1 (milestone 4 PR C's and covering-case's builds), which can only raise its times.
3. **The rule** (§5): X = 612 ms (L1 run 5, fixture PS6, the mod side's third call), so B = min(10000, max(2000, 1000 × ceil(2 × 612 / 1000))) = 2000. P1, P2 and P3 hold. I3 and I5 did not fire: the longest T37 and T38 run was 4582.8 ms under L1, under three times the timeout.
4. **No bound commit** (§2 item 4): the rule keeps `STOP_RUN_OPTS.timeout` at 2000.
5. **OPEN-2:** no Stop-side call reached 2000 ms (its largest was 510 ms). No finding.
6. **For the gates:** PS4a, PS18 and PS19 read not judged on both sides in all 30 runs, as the fixture set expects, and their exit-128 reads recur in the unloaded runs. They are the fixtures', not load. Whether they meet §5's falsification clause is the gates' to read.
7. **Next:** the PR at 7235aa0c, both gates.

Nothing above is edited.

## Amendment 2 — gate 1's record (class 1); written after gate 1 was seen

*Written by the custodian. References only: gate 1's reviewer report (`state/consults/gates/2026-10-24-guardian-parity-git-timeout-under-load-gate1-reviewer.md`), whose items D2 to D4 are below with its two placeholders filled; items 3 and 4 also answer the architect's D2 and D1 (`state/consults/gates/2026-10-24-guardian-parity-git-timeout-under-load-gate1-architect.md`).*

1. §4's three recorded mutations, those §1 lists as unchanged, were re-observed at 7235aa0c in gate 1: the inverted comparison and the PS7 build fail as recorded, and the failed `git log` read as fresh fails its recorded tests and T37. The test's comments record it at 7780de9b. Amendment 1 item 1's P5 sentence rests on the three mutations §4 adds, not on these.
2. P4's governance-ci half holds: run 40087162109 at 7235aa0c passes every T35 subtest.
3. Amendment 1 item 6: PS18 has no non-zero exit; the exit-128 reads are PS4a's `log`, PS19's `show` and PS7's parent show, and PS7 reads fresh.
4. L1's hold was declared with `-Minutes` 60, against §7's 30 (the series report's hold lines).
5. §5's falsification clause is not met, by gate 1's ruling.
6. **Next:** the architect re-gates E1, scoped; then the click.

Nothing above is edited.

## Amendment 3 — the closing record (class 1); written after gate 2 was seen

*Written by the custodian. References only.*

1. Gate 2 (E1, scoped), the architect, at 7780de9b: PASS WITH NOTES (`state/consults/gates/2026-10-24-guardian-parity-git-timeout-under-load-gate2-architect.md`; gate-log 611). E1 is closed; D1 and D2 are closed by Amendment 2 items 4 and 3.
2. Its N1: the PR's checks at 7780de9b, 8 of 8 pass (runs 40102017706, 40102017760, 40102022446, 40102022453, 40102022487, 40102022656, each with head sha 7780de9b), so P4's governance-ci half holds at the head as well.
3. Its N2: the six lines 7780de9b adds equal the reviewer's D1 block byte for byte, and it deletes none (the custodian's script over `git diff -U0 7235aa0c 7780de9b`).
4. The record is closed: ready for the click, as a merge commit.

Nothing above is edited.
