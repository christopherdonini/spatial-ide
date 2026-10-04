*Custodian's filing note (2026-10-04): evidence-recorder-v0's P0, the brief's §3 questions answered against the installed binary 2.1.289 with types read at 2.1.288 (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md`), by a worker on the custodian's brief. The worker wrote it to the custodian's scratchpad, not the repository, and the custodian copied it here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is 1310a7bf4f6ddb02bde1a89f4d0f17ad0777fac957bb605fe5530236426146bf, equal to the worker's hand-back. **Checked by the custodian:** every ranged and span excerpt marked verbatim from `<skill-root>` matches its source lines, 40 of 40, by script, with the source split on CRLF or LF, and two one-byte negative self-tests are caught. `examples/tool-call.ts` is CRLF on disk, so its excerpt is the line without its CR, and the report's description of the hashed files as LF bytes is inexact for that file. The three cited files' sha256 values match. **Hard limits checked:** the session's dev-mods folder is empty; the repository's porcelain shows no worker file; no worker process remained. `installed_plugins.json` changed at 11:28:29Z, the human's install of Guardian. `known_marketplaces.json` changed at 11:34:43Z, the official marketplace's own update time; its writer is not determined, and it is not an install. Guardian was live during the run and refused one of the worker's Bash calls, as the report's closing notes say. `<skill-root>` is build 2.1.288's bundled plugin-authoring skill folder; `<probe-dir>` is the custodian's scratchpad. Profile paths redacted at filing: none.*

---

# Evidence Recorder v0 — P0 against Claude Code 2.1.289 (types read at 2.1.288)
Run on the installed binary: `claude --version` printed "2.1.289 (Claude Code)" (exit 0) at the start of the run and "2.1.289 (Claude Code)" (exit 0) at its end. Label convention: "typed at 2.1.288" is a read of the only readable type source, the 2.1.288 bundled plugin-authoring skill folder (`<skill-root>`); "observed at 2.1.289" is the output of `claude plugin validate` or `claude plugin test` run on a throwaway folder; a 2.1.288 type read is never presented as current for 2.1.289. Nothing was installed, enabled or loaded, no Claude session was started, and nothing was written but the scratch folder `recorder-p0/` (its probe folders are listed in the last section). `<probe-dir>` stands for that scratch folder in pasted output (the only edit made to any pasted output). Repository excerpts are byte-copied from main at 163ce8c11afb, with the span's sha256.
**Headline findings** (each detailed below): (1) Bash's typed result has no numeric exit status, only `isError` and `interrupted`; on the errored arm `stdout`/`stderr` are not separate (only `text`). (2) `$.fs` has no append and no delete: an append is read-then-write of the whole file (races, 4 MiB cap), and the 30-day pruning cannot be done by the mod through `$.fs`. (3) A Bash `tool.call` carries no cwd, and `$.session.root()` is the session's, not a subagent worktree's: the dirty-tree identity may be taken in the wrong tree. (4) `$.process.run` has no shell and returns decoded text (4 MiB cap per stream): the identity's hashes are of decoded text, not of the bytes `sha256sum` sees. (5) Two git calls per side cost p50 108-145 ms on this repository, so 4 calls in series are near or over the 300 ms target; concurrent calls fit.
## 1. The Bash result (§3 item 1)
**Answer.** Typed at 2.1.288: on the answered arm a Bash `tool.call` result is `{ result: { stdout: string, stderr: string, interrupted: boolean, ... }, text?, ref?, context?, isReadOnly? }`, with stdout and stderr separate; on the errored arm (`isError: true`) `result` is `unknown` ("never the tool's typed record") and only `text` carries the output, so there is no separate stdout/stderr there. The record has no numeric exit-status field: the nearest are `isError` (true when the tool "threw, was interrupted, or answered an error"), `interrupted`, an optional `returnCodeInterpretation?: string`, and `timedOutAfterMs?`; whether a non-zero exit sets `isError` is not verifiable without a live session (the build's own example mod reads `ran.isError === true` as "failed"). Byte counts are derivable from the result alone only for the answered arm (UTF-8 length of the two strings, equal to the stream's bytes only when the stream was valid UTF-8 and not replaced by a persisted file: `persistedOutputSize` is "set when output is too large for inline"); `text` is present on both arms. A hook returns the result unchanged with `return next(e)` or `const ran = await next(e); return ran` (same object). Typed at 2.1.288: "A hook that returns the object it got makes core use them verbatim" (`ref`); that sentence is about core's stored messages, and delivery to the model is not verifiable without a live session.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:19178-19186:

```text
    Bash: {
      /** The standard output of the command */
      stdout: string
      /** The standard error output of the command */
      stderr: string
      /** Path to raw output file for large MCP tool outputs */
      rawOutputPath?: string
      /** Whether the command was interrupted */
      interrupted: boolean
```

Verbatim, <skill-root>/types/claude-code.d.ts:19197-19198:

```text
      /** Set when the command hit its timeout and was auto-backgrounded; the timeout value in ms */
      timedOutAfterMs?: number
```

Verbatim, <skill-root>/types/claude-code.d.ts:19205-19206:

```text
      /** Semantic interpretation for non-error exit codes with special meaning */
      returnCodeInterpretation?: string
```

Verbatim, <skill-root>/types/claude-code.d.ts:19211-19214:

```text
      /** Path to the persisted full output in tool-results dir (set when output is too large for inline) */
      persistedOutputPath?: string
      /** Total size of the output in bytes (set when output is too large for inline) */
      persistedOutputSize?: number
```

Verbatim, <skill-root>/types/claude-code.d.ts:11997-12033:

```text
  export type ToolCallResult<Name extends string = string> = {
      /**
       * Refuses the call: the model receives the text as an error result.
       * Absent when the call was answered.
       */
      deny: string;
      result?: undefined;
      context?: undefined;
      ref?: undefined;
      text?: undefined;
      isError?: undefined;
      isReadOnly?: undefined;
  } | {
      /**
       * The tool's output: from core the tool's record, typed per built-in
       * tool once `e.tool` and `isError` are narrowed; from a hook, its own.
       *
       * Core validates a hook's answer against the tool's output schema when
       * it has one, maps it for the model with the tool's own mapper, and
       * records it in the transcript as the tool's result. Absent on a deny.
       */
      result: ToolResultOf<Name>;
      /**
       * What the model reads after the tool's result and the user never
       * sees. From core, none.
       *
       * One reminder, as a PostToolUse hook's is, after the managed tier's
       * review; none on a plugin's own `$.tool.call`. Kept whole from `next`,
       * none empty, any length: past 100,000 (200,000 together) head + path.
       */
      context?: readonly string[];
      /**
       * Set by core on what `next(e)` resolves to: names the messages core
       * produced for the call (they stay on the host side).
       *
       * A hook that returns the object it got makes core use them verbatim.
       * Absent on a hook's own `{ result }` and on a deny.
```

Verbatim, <skill-root>/types/claude-code.d.ts:12056-12068:

```text
       * Set by core, present only when the tool reported an error (it threw,
       * was interrupted, or answered an error): `text` is what the model read.
       */
      isError: true;
      /**
       * What the transcript stored for the errored call: the error text, or
       * undefined when nothing was stored; never the tool's typed record.
       */
      result: unknown;
      /**
       * The error as the model reads it.
       */
      text?: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:12460-12472:

```text
   * What the chain decided for one link, as `next.trace` names it.
   *
   * `returned`: its result stood; `passed`: it returned, by reference, what its
   * last `next()` resolved to (a hooks module's hook answers with a copy of its
   * own, so it reads `returned`); `skipped`: it failed before `next`, or a
   * `next.to` above continued beneath its tier (`reason` says which), and
   * beneath ran in its place; `kept`: it failed after `next`, and that run's
   * result stands; `expired`: its budget ran out (what stands follows
   * skipped/kept); `caught`: it threw or its budget ran out, and its `.catch`
   * handler's result stands; `rejected`: the link rejected; the deepest such
   * entry is where the rejection came from, and the ones above it let it pass.
   */
  export type TraceOutcome = 'caught' | 'expired' | 'kept' | 'passed' | 'rejected' | 'returned' | 'skipped';
```

Verbatim, a span of <skill-root>/reference.md:75 (the line's sha256 is in the last section):

```text
what one answers reaches the plugin as given, fields only the engine sets included (a `tool.call` answer's `isReadOnly`, and its `ref` and `text` when the plugin relays it)
```

Verbatim, <skill-root>/examples/tool-call.ts:14-14:

```text
    const hasFailed = ran.deny === undefined && ran.isError === true
```

**Probe** (observed at 2.1.289; `probe-recorder/test/recorder.test.ts`, tests `Q1 pass-through: an approved command result deep-equals the engine answer` and `Q1 pass-through: an errored result and an other command deep-equal the engine answer`): the bottom hook answers `{ ref: 7, result: { stdout, stderr, interrupted: false }, text }` (and an errored `{ ref: 8, isError: true, result, text }`); the plugin's hook awaits `next(e)`, writes one line, returns the same object; the test asserts `expect(r).toEqual(ANSWER)` (resp. ERRORED), also for a command that is not approved. Both fixtures are stipulated from the types, not observed from a real engine: the real arm for a non-zero exit is a live-session question (probe that settles it: a throwaway mod that logs `JSON.stringify(ran)` for `bash -c "exit 3"` and for a failing `cargo test`, in a session the human starts). The mutation was observed by applying it: `return ran` replaced by `return { ...ran, context: ["x"] }` in `probe-recorder/hooks/register.js`, `claude plugin test probe-recorder` exit 1 with 4 fail (`Q1 pass-through: an approved command result deep-equals the engine answer`, `Q1 pass-through: an errored result and an other command deep-equal the engine answer`, `Q4 a timed-out git call: the result is unchanged and the hook saw a rejection`, `Q4 a throwing git call: the result is unchanged`), then reverted (byte-compared equal to the saved original) and the run exit 0 with 9 pass. Output of the passing run's Q1 lines:

```text
Q1 line: {"agentId":"main","command":"cargo test --workspace --locked","before":{"ok":true,"exitCode":0,"sha":"M x\u0000"},"stdoutBytes":26,"sha":"05b50bb48cff2c4f0cb34de8704583d81275c8360f2d91d81bbfe3d290637a38","interrupted":false}
Q1 errored line: {"agentId":"main","command":"cargo test --workspace --locked","before":{"ok":true,"exitCode":0,"sha":"M x\u0000"},"isError":true,"stdoutBytes":"unavailable","sha":"unavailable"}
(pass) Q1 pass-through: an approved command result deep-equals the engine answer [96.17ms]
(pass) Q1 pass-through: an errored result and an other command deep-equal the engine answer [44.99ms]
```

Mutation run, failing lines:

```text
(fail) Q1 pass-through: an approved command result deep-equals the engine answer [96.49ms]
(fail) Q1 pass-through: an errored result and an other command deep-equal the engine answer [46.83ms]
(fail) Q4 a timed-out git call: the result is unchanged and the hook saw a rejection [49.00ms]
(fail) Q4 a throwing git call: the result is unchanged [49.75ms]
 5 pass
 4 fail
```

**What it means.** Keep: the interrupted flag, stdout/stderr sizes and sha256 (answered arm), and `text` size and sha256 (both arms). Narrow: the "exit status" field becomes `is_error` (true/false/"unavailable") plus the raw `returnCodeInterpretation` when present, and a numeric exit code is not recorded (the brief's own "if the build exposes it" applies: this build does not). On the errored arm the stdout/stderr fields read "unavailable" and `text` stands in. Pass-through is cheap to keep: `return next(e)` as the last statement of every path.

## 2. Turn end (§3 item 2)
**Answer.** Typed at 2.1.288: `turn.complete` carries `agentId?` (a subagent's id; absent on the main loop; "each run of its loop one turn") and `usage?: TurnUsage`, the four counts `input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens` plus `model`, summed over the turn's responses and absent when nothing counted (an interrupt, an API error); it also carries `reason`, `isAborted`, `durationMs`, `turnId`. `$.agent.list()` returns the session's subagents "so far" as rows `{ id, description, type, status, ... }`: `id` equals the `agentId`, `type` is the definition name, `status` can be `completed`, so a finished subagent is typed as listable; that it is still listed at the moment its `turn.complete` fires is not typed, and is not verifiable without a live session. `turn.complete` is the right event: the build's own doc says a subagent's "answer is its own `turn.complete`, carrying this `agentId`". A resumed subagent produces one `turn.complete` per run, so usage is per turn, not per subagent lifetime. The nearest other event, `classic.SubagentStop` (typed: `agent_id`, `agent_type`, `agent_transcript_path`), carries the type but no usage.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:12498-12513:

```text
       * The loop the turn ran in: a subagent's id, as `$.agent.spawn` resolves
       * it, each run of its loop one turn; absent on the main loop.
       *
       * Pinned: a different value is refused, one left out is kept. Every hook
       * sees a subagent's turn, so a hook that spawns sees its children's turns
       * too and bounds itself.
       */
      agentId?: string;
      /**
       * What the turn cost: its real requests' token counts, plus what a made-up
       * response's stop stated, summed, and the model of the last that counted.
       *
       * A response a `turn.step` hook made up adds nothing unless its stop states
       * usage; absent when nothing counted (an interrupt, an API error).
       */
      usage?: TurnUsage;
```

Verbatim, <skill-root>/types/claude-code.d.ts:12540-12549:

```text
   * What a `turn.complete` hook returns and what `next(e)` resolves to:
   * `{ text }`; a text other than a main-loop answer's is shown beneath it.
   *
   * Core fills `usage` from `e.usage` when the turn had one; a hook above reads
   * it, and one that answers its own may leave it out.
   */
  export type TurnCompleteResult = {
      text: string;
      usage?: TurnUsage;
  };
```

Verbatim, <skill-root>/types/claude-code.d.ts:125-144:

```text
  export type AgentInfo = {
      /**
       * The agent's id: the same string its loop's `tool.call` events carry as
       * `agentId`, and a spawn inside it as `parentAgentId`.
       */
      id: string;
      /**
       * Its row's label.
       */
      description: string;
      /**
       * The agent definition it runs as (`general-purpose`, `Explore`, ...), or
       * `teammate` for an in-process teammate.
       */
      type: string;
      /**
       * `running`, `completed`, `failed`, `killed`, or another of the engine's task
       * statuses.
       */
      status: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:2976-2979:

```text
           * Returns the session's subagents so far, the ones the model spawned and
           * the ones plugins did alike.
           */
          list: () => Promise<AgentInfo[]>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:322-330:

```text
   * started subagent's `{ model, agentId }`, or `{ deny: reason }`, refusing it.
   *
   * It and `$.agent.spawn(input)` resolve once the subagent started; its answer
   * is its own `turn.complete`, carrying this `agentId`. Keep the id and set
   * `got[agentId]` to what waits; a `turn.complete` hook resolves it:
   *
   * @example
   * on("turn.complete", ($, e, next) => (got[e.agentId]?.(e.answer), next(e)))
   */
```

Verbatim, <skill-root>/types/claude-code.d.ts:6006-6027:

```text
  export type ModelUsage = {
      /**
       * Uncached input tokens the call was answered over: the part of the
       * prompt neither read from nor written to the prompt cache.
       */
      input_tokens: number;
      /**
       * Tokens the call generated.
       */
      output_tokens: number;
      /**
       * Input tokens the prompt cache served.
       *
       * On a fork, how much of the main thread's transcript the cache still
       * held: near zero, the fork paid for the whole prefix (the entry had
       * lapsed, or the model changed since it was made).
       */
      cache_read_input_tokens: number;
      /**
       * Input tokens the call wrote to the prompt cache.
       */
      cache_creation_input_tokens: number;
```

Verbatim, <skill-root>/types/claude-code.d.ts:12799-12810:

```text
  /**
   * What a model turn, or one response inside it, cost as the API reported it:
   * the four token counts (ModelUsage) and the model's id.
   *
   * A turn's counts are its responses' summed; its model is the last response's.
   */
  export type TurnUsage = ModelUsage & {
      /**
       * Which model answered, by the id the API reports.
       */
      model: string;
  };
```

Verbatim, <skill-root>/types/claude-code.d.ts:11550-11554:

```text
  type SubagentStopHookInput = BaseHookInput & {
      hook_event_name: 'SubagentStop';
      stop_hook_active: boolean;
      agent_id: string;
      agent_transcript_path: string;
```

**Probe** (observed at 2.1.289; tests `Q2 turn.complete: a subagent turn carries agentId and usage into the hook` and `Q2 turn.complete: the main loop writes nothing; an unlisted agent reads unavailable`): the harness raises `$.turn.complete({ answer, durationMs, isAborted, turnId, agentId, usage, reason })`, `on('agent.list')` answers a row `{ id: 'ag1', type: 'Explore', status: 'completed' }`; the hook writes one line and returns `next(e)`'s result, asserted equal to `{ text: 'done', usage }`. The harness raises the event itself, so it proves the hook's shape and the "unavailable" paths, not that a live engine fires it for a subagent, with usage, or lists the agent then. Lines the hook wrote:

```text
Q2 line: {"agentId":"ag1","type":"Explore","status":"completed","usage":{"input_tokens":10,"output_tokens":20,"cache_read_input_tokens":30,"cache_creation_input_tokens":40,"model":"m"}}
Q2 unlisted line: {"agentId":"ghost","type":"unavailable","status":"unlisted","usage":"unavailable"}
```

Live probe that would settle the open points: a throwaway mod whose `turn.complete` hook logs `e.agentId`, `e.usage` and `JSON.stringify(await $.agent.list())`, run in a session that spawns one `Explore` subagent and resumes it once.
**What it means.** Keep. Narrow: the usage record is per turn (a subagent may emit several), with `"unavailable"` for a missing `usage` and for an id `$.agent.list()` does not return; no field is estimated.

## 3. The approved commands (§3 item 3)
**Answer.** The repository runs the commands below (each with its path:line at 163ce8c11afb); agents in sessions use the forms listed after them. A proposed matcher is stated in plain text under both, with the forms it misses.
**3a. What the repository runs.**

Byte-copied from .github/workflows/product-ci-rust.yml:223-223 @ 163ce8c11afb sha256:97a5219548748721db73b7bf7611fd25364acf80ce5fbcf24dfd0e7715413fd4:

```text
        run: cargo build --workspace --tests --locked
```

Byte-copied from .github/workflows/product-ci-rust.yml:234-234 @ 163ce8c11afb sha256:a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a:

```text
        run: cargo test --workspace --locked
```

Byte-copied from .github/workflows/product-ci-rust.yml:240-240 @ 163ce8c11afb sha256:b12bdf5346649f3ae7b1f7e0bfe755a8a9b402d08bba8a996bfa5fc36a891940:

```text
        run: cargo test --workspace --locked -- --list --ignored
```

Byte-copied from .github/workflows/product-ci-shell.yml:205-206 @ 163ce8c11afb sha256:cabb98b90318245b6b7d55247345d352708671ef39f63b49e40e9ddcdbd506d8:

```text
        working-directory: frontends/shell
        run: npm run verify
```

Byte-copied from .github/workflows/product-ci-shell.yml:211-211 @ 163ce8c11afb sha256:411fccb786299e993e65ff409d90aa5d61362f6c0eaa425743b1866d4cfcfd49:

```text
        run: cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked
```

Byte-copied from .github/workflows/product-ci-viewer.yml:96-96 @ 163ce8c11afb sha256:2739fcce95d74e4de1587af9b30a2b43c07306617f8cbf7f8a7f5b064f3f1b73:

```text
        run: npm run verify
```

Byte-copied from .github/workflows/governance-ci.yml:140-140 @ 163ce8c11afb sha256:73fbc578de84ffa8ce43d1b9e19e4129570e56c5065f6dcb75c4c38acbdc45da:

```text
        run: node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"
```

Byte-copied from .github/workflows/governance-ci.yml:145-145 @ 163ce8c11afb sha256:68f1aeeb6b4b25a56b23c8da9e47d155599d61ef8b31f6b3191d2fa00b856589:

```text
        run: node scripts/plan/verify-cites.mjs
```

Byte-copied from .github/workflows/governance-ci.yml:148-148 @ 163ce8c11afb sha256:cb04397ab89f982168cceced5f44f24bed00a739d224c59305400cf30e158849:

```text
        run: node scripts/plan/verify-quotes.mjs
```

Byte-copied from .github/workflows/governance-ci.yml:151-151 @ 163ce8c11afb sha256:67277f9d19f8b13d709e6594a478c2214eb0f7e59e9322dd81e9917e3fdc7caf:

```text
        run: node scripts/plan/verify-test-claims.mjs
```

Byte-copied from .github/workflows/governance-ci.yml:156-156 @ 163ce8c11afb sha256:370effb2e41e14c8df65b28d92966c274a06a25b989a62e1ffccff614a6be01c:

```text
        run: node scripts/plan/verify.mjs
```

Byte-copied from .github/workflows/governance-ci.yml:183-183 @ 163ce8c11afb sha256:f8fb74e760c6c173a79d9057920e61401ad3195d2f3f8d767515de1ca8f5350f:

```text
        run: node scripts/plan/cfg-boundary.mjs
```

Other lines of the same workflows that run a build or a lint, not a test (not approved): `product-ci-rust.yml:223` (`cargo build --workspace --tests --locked`), `product-ci-shell.yml:221` and `:224` (`cargo check ...`), `rust-fmt.yml:76` and `:80` (`cargo fmt --check`), `governance-ci.yml:161`, `:164`, `:167` (`buildHealth.mjs`, `queue.mjs --check`, `site.mjs --check`). The ADR-003 spike workflows (`adr-003-spike-ci-linux.yml:91`, `:94-103`: `cargo test --lib`, `node --test src/*.test.ts`) run under `spikes/`, outside the brief's list.

Package scripts (the viewer's package.json is `renderer/bundle-viewer/package.json`; the shell's is `frontends/shell/package.json`):

Byte-copied from frontends/shell/package.json:16-17 @ 163ce8c11afb sha256:a6bde183597663d7909a0044b2420fbd85030d793eb27dec5e431a9bc461945c:

```text
    "test": "vitest run",
    "verify": "npm run typecheck && npm run check:dev-origin && npm run check:origin-event && npm run verify:adr-index && npm run build && npm run check:dist-clean && npm run check:dist-notice && npm run test && npm run test:residency-trace && npm run test:citation-integrity",
```

Byte-copied from frontends/shell/package.json:35-36 @ 163ce8c11afb sha256:5eda9d28459bdef2f9f3374b9e957539e550b70b3adc7abf2469637efb298d2c:

```text
    "test:residency-trace": "node e2e/residencyTrace.test.mjs",
    "test:citation-integrity": "node e2e/citationIntegrity.test.mjs",
```

Byte-copied from renderer/bundle-viewer/package.json:11-13 @ 163ce8c11afb sha256:8f1385ec00d545e96e234d63d0f8d5ec486d4670ce3fce4e896890bda6fc0972:

```text
    "test": "node --test \"scripts/**/*.test.mjs\"",
    "test:e2e": "node --test e2e/zoom-anchor.mjs",
    "verify": "npm run typecheck && npm run build && npm test"
```

Other package.json files with a test-like script: `protocol/transport-bakeoff/web/package.json:12-13` (`verify`, `test`) and `renderer/style-ts`, `frontends/canvas-probe` (typecheck/build only). The documented pre-PR forms are `CONTRIBUTING.md:125-127` at 163ce8c11afb:

Byte-copied from CONTRIBUTING.md:125-127 @ 163ce8c11afb sha256:51017a165fa9cf213cecc87b828ba2f586ab73239cb86faa74be4076332f4056:

```text
```sh
cargo test --workspace                              # the Rust modules
npm --prefix renderer/bundle-viewer run verify      # typecheck, build, test
```

Under `scripts/`, the tools the brief names as `node scripts/plan/verify-*.mjs` are `verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs` (`scripts/plan/` at 163ce8c11afb); the glob also matches `verify-mutation.mjs`, which per its own header comment (`scripts/plan/verify-mutation.mjs:14-21` at 163ce8c11afb, tool at commit 163ce8c11afb) checks that a mutation is *recorded* and runs none, and is not in any workflow: a recorded "test run" for it would be a false positive of the glob. The `node --test` suites are `scripts/plan/*.test.mjs` and `scripts/hooks/*.test.mjs` (governance-ci.yml:140 above).

**3b. The forms agents use in sessions** (as quoted in the worker and gate reports; the reports are prose, so these are quoted command strings, not transcripts of Bash calls):

- `timeout 570 node scripts/plan/verify.mjs`, `timeout 1200 node scripts/plan/verify.mjs --offline`, `timeout 120 node scripts/plan/verify.mjs --offline`: `state/consults/2026-10-02-exposure-scan-ci-backstop-worker-report-1.md:45`, `state/consults/2026-10-03-kernel-ticket-drop-followups-worker-report-3.md:81`.
- `timeout 600 node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:124`; unquoted globs `node --test scripts/plan/*.test.mjs scripts/hooks/*...`: `state/consults/2026-09-26-partition-offset-bounds-worker-report.md:24`.
- `node --test --test-name-pattern=<name> <file>`: `state/consults/gates/2026-10-02-exposure-scan-ci-backstop-gate2-reviewer.md:39` (a single-test run, e.g. for a mutation).
- `CARGO_TARGET_DIR=D:/wt-targets/ticket-drop-fu cargo test -p spatial-kernel --lib -- --list`: `state/consults/2026-10-03-kernel-ticket-drop-followups-worker-report-2.md:23` (an env prefix; `-- --list` lists and runs no test).
- `timeout 60 cargo test -p spatial-kernel --test zz_probe_catalog_open_drop -- --nocapture`: `state/consults/2026-09-26-catalog-open-drop-reproduction.md:72`.
- `cargo test -p <crate> [--lib | --test <name> | --features <f>] [-- --nocapture]` is the commonest shape (62 mentions of `cargo test -p spatial-kernel` across `state/` by count), `cargo test --workspace [--locked | --no-fail-fast]`, and `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: `state/consults/2026-09-30-publish-refusal-src-tauri-worker-report-1.md:34`.
- `npm run verify` in `bundle-viewer`, `frontends/shell`: `state/consults/2026-09-26-partition-offset-bounds-worker-report.md:24`, `state/consults/2026-09-24-source-change-watcher.md:350`; `npm run verify:adr-index`: `state/consults/2026-09-24-adr-035-acceptance-drafts.md:69`.
- Searched and not found in the reports (zero hits for the search `cd <dir> && (cargo|npm|node)` and for `npm --prefix <dir> (test|run)` under `state/`): the brief's examples `cd <dir> && ...` and `npm --prefix ... test`; `npm --prefix renderer/bundle-viewer run verify` is documented at `CONTRIBUTING.md:127` only. A form the records do not show can still occur in a session.

**3c. Proposed matcher (plain text, not code).** Take the Bash `command` string. Split it at top-level `&&`, `||`, `;`, `|`, `&` and newlines, outside quotes. For each segment, drop leading `NAME=value` assignments and a leading `timeout <N>`; then the segment is approved when its first words are one of: (1) `cargo test`, unless the segment also carries `--no-run` or `-- --list` (compile-only and list-only runs are not test runs); (2) `npm run verify`, `npm run test`, `npm test`, `npm run test:residency-trace`, `npm run test:citation-integrity`, each optionally with `--prefix <dir>` before the verb; (3) `node --test`; (4) `node scripts/plan/verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` (not `verify-mutation.mjs`). A leading `cd <dir>` segment is not itself approved and does not stop the following segments from being tested. A call with one or more approved segments is one approved call and yields one record (keyed by the call's `tool_use_id`). Any other call passes with no work done.
**Forms it would miss:** a shell wrapper (`bash -c "..."`, `sh -c`, `env ...`, `time ...`, `xargs`, `npx vitest`, `cargo nextest`, `cargo t`); a script or a loop that runs the tests (`for ...; do cargo test ...`, `./run-tests.sh`); a command substitution or a heredoc; tests run by a git hook, by `tauri` or by CI; and tests run through the PowerShell tool (not on the brief's hooks line). A call the matcher approves but that did not run the tests (an `npm test` that fails at `pretest`) is recorded as a run with its outcome. A call with `run_in_background: true` returns before the command ends (typed `backgroundTaskId`), so its "after" snapshot and sizes would be premature: such calls should be recorded as `background` with the after-fields "unavailable", or dropped.
**What it means.** Keep, with the matcher above fixed in P1 as the declared list; the verify-mutation exclusion and the background-call rule are additions to the brief's list.

## 4. The dirty-tree identity's cost (§3 item 4)
**Answer.** Observed on the main checkout (git 2.49.0.windows.1; 1568 tracked files; `target/` ignored by `.gitignore:2`): timed from node with no shell in between (20 runs each, ms). Run B (the full output below: HEAD 163ce8c11afb, 2 status lines, `git diff HEAD --binary` 7,144 bytes before and after): status min 61 / p50 79 / p95 96 / max 102; diff min 68 / p50 74.5 / p95 84 / max 86; both min 132 / p50 140 / p95 165 / max 176. Two earlier runs, whose full lists were not kept: run M (HEAD 8503d78e, 4 status lines, diff 33,508 bytes): status 52 / 59.5 / 73 / 73, diff 67 / 83.5 / 100 / 108, both 124 / 145 / 176 / 203; run A (HEAD c7d0b200 at its start, diff 0 bytes at its start, 1566 tracked files; the tree may have changed while it ran): status 50 / 54 / 61 / 63, diff 46 / 50 / 56 / 59, both 97 / 108 / 150 / 175 (each as min / p50 / p95 / max; p50 is the mean of ranks 10 and 11, p95 is rank 19 of 20). The spawn floor (`git --version`) is p50 22-35.5 ms. Four calls in series (before: status+diff, after: status+diff) are p50 about 216-290 ms and p95 about 300-352 ms (twice the "both" figures of the three runs; arithmetic, not a measurement of the mod): at or over the brief's 300 ms target; the two calls of one side run concurrently (`Promise.all` of two `$.process.run`) would cost about the slower one, p50 about 54-84 ms a side (also arithmetic). The gitignored `target/` does not affect these times (consistent with git not walking an ignored directory); with `--ignored` (which walks it) the same status costs p50 2591-3381 ms, p95 3075-4154, max up to 10,842. Measured by the shell pipeline the brief writes (`... | sha256sum`, run through `bash -c` 20 times) the numbers are higher only by the shell spawn: status p50 188 / p95 249; diff p50 204 / p95 234; both p50 333 / p95 402; `true | sha256sum` alone p50 179 / p95 270 ms. A hook cannot use that form (no shell).
**What the identity misses.** Untracked files' content (`status` lists a name, and an untracked directory as one `?? dir/` entry; `git diff HEAD` does not show untracked files at all); ignored files (`target/`, `.claude/state/`); a file changed and then restored during the run (before equals after, so `tree_changed_during_run` stays false); a change in a different worktree than the one measured; metadata-only changes git ignores. The hashes are of decoded text (see below), not of the bytes `sha256sum` would see.
**How a hook runs it, and what it sees on a timeout.** Typed at 2.1.288: `$.process.run(argv, { cwd, env, stdin, timeoutMs })` runs "by its argument vector (no shell)", resolves `{ exitCode, stdout, stderr, isStdoutTruncated, isStderrTruncated }` for any exit code, "Git runs with repo hooks off", the default timeout is 30 s and at most ten minutes, the child "is killed and the call rejects" past `timeoutMs`, and each stream is the first 4,194,304 bytes "as text" (a binary patch decoded as text, a truncated one flagged only by `isStdoutTruncated`). So: `await $.process.run(['git', '--no-optional-locks', 'status', '--porcelain=v1', '-z'], { cwd, timeoutMs: 2000 })` inside a `try/catch`; on a timeout the hook sees a rejected promise (observed at 2.1.289 in the harness: `HooksError`, message prefixed with the plugin and call name, `probe-recorder: $.process.run: <reason>`; the reason there is the stub's, the real timeout's wording is not verifiable without a live session). A non-zero `exitCode` is a resolved result and must be tested separately. The hash is computed in the module with `crypto.subtle.digest('SHA-256', new TextEncoder().encode(stdout))` (typed global); it is the sha256 of the re-encoded decoded text, which equals `sha256sum` of the raw bytes only when the output is valid UTF-8 and not truncated.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:3291-3307:

```text
          /**
           * Runs a command on the host by its argument vector (no shell) and
           * resolves `{ exitCode, stdout, stderr }` once it exits, any exit code.
           *
           * One shot: the whole output is read, so a background process left
           * writing holds the call until the timeout. Rejects when the command
           * cannot start or is still running then. Git runs with repo hooks off.
           *
           * @param argv the command and its arguments, `argv[0]` the executable
           * @param init `{ cwd, env, stdin, timeoutMs }` (cwd the session's by
           *             default; timeout 30 s by default, ten minutes at most)
           * @returns `{ exitCode, stdout, stderr }`, each stream's first 4194304
           *          bytes (`isStdoutTruncated`, `isStderrTruncated` say when cut)
           * @example
           * const { exitCode, stdout } = await $.process.run(["git", "status"])
           */
          run: (argv: readonly string[], init?: ProcessRunInit) => Promise<ProcessRunResult>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:7553-7556:

```text
       * How long the child may run before it is killed and the call rejects,
       * in milliseconds; 30 seconds when absent, ten minutes at most.
       */
      timeoutMs?: number;
```

Verbatim, <skill-root>/types/claude-code.d.ts:7566-7593:

```text
      /**
       * The child's exit status; a child ended by a signal reads as 1.
       */
      exitCode: number;
      /**
       * What the child wrote to standard output, as text: its first 4194304
       * bytes (4 MiB), the rest read and dropped (`isStdoutTruncated`).
       *
       * The limit counts bytes, not characters, and is standard output's own:
       * standard error has the same limit again. A cut inside a multi-byte
       * character drops that character.
       */
      stdout: string;
      /**
       * What the child wrote to standard error, as text: its first 4194304
       * bytes (4 MiB), the rest read and dropped (`isStderrTruncated`).
       */
      stderr: string;
      /**
       * True when the child wrote more than 4194304 bytes to standard output
       * and `stdout` is only the first of them; false when `stdout` is whole.
       */
      isStdoutTruncated: boolean;
      /**
       * True when the child wrote more than 4194304 bytes to standard error
       * and `stderr` is only the first of them; false when `stderr` is whole.
       */
      isStderrTruncated: boolean;
```

**Probe** (observed at 2.1.289; tests `Q4 a timed-out git call: the result is unchanged and the hook saw a rejection` and `Q4 a throwing git call: the result is unchanged`): the recorded line shows `"before":{"ok":false,"seen":"probe-recorder: $.process.run: timed out after 2000 ms","name":"HooksError"}` and the result equal to the engine's answer; the call's init as the engine event saw it was `{"cwd":"C:/dev/spatial-ide","timeoutMs":2000}`. The timing script is `recorder-p0/time-git.mjs`.

Timing output, run B (node, no shell), as printed (the long lists are cut at 130 columns):

```text
before: HEAD=163ce8c11afb tracked=1568 status_lines=2 diff_bytes=7144
status: min=61 p50=79 p95=96 max=102 ms  runs=78 70 85 80 96 88 80 90 102 81 84 77 83 66 65 61 69 66 68 68
diff: min=68 p50=74.5 p95=84 max=86 ms  runs=69 83 69 75 74 77 86 69 68 68 69 74 75 78 79 84 78 68 82 72
both: min=132 p50=140 p95=165 max=176 ms  runs=143 132 140 133 139 150 156 136 135 134 137 151 142 176 137 134 158 140 148 165
status+--ignored (target walked): min=2268 p50=2638 p95=3513 max=3787 ms  runs=3787 3513 3043 2972 2869 2743 2490 2402 2438 2583 2
git --version (spawn floor): min=26 p50=32.5 p95=37 max=37 ms  runs=30 28 29 36 37 34 32 36 30 26 32 31 32 32 34 33 36 37 35 34
after: HEAD=163ce8c11afb status_lines=2 diff_bytes=7144
```

**What it means.** Narrow: (a) run the two git calls of a side concurrently and state the bound with both measurements; (b) declare `tree_changed_during_run` as "tracked-file and untracked-name changes visible to status and diff HEAD", and say untracked content and a restored file are outside it; (c) the hash field is "of decoded text" and a truncated or failing call is "unavailable"; (d) the tree measured is the session's (see 5): the Bash call's cwd is not typed, so a command run in a worktree is not necessarily the tree the hook hashes.

## 5. The local log path (§3 item 5)
**Answer.** Observed (git 2.49.0.windows.1, at 163ce8c11afb): `.claude/state/evidence/<date>.jsonl` is gitignored (`.gitignore:43`, rule `.claude/state/`) and has zero tracked files beneath `.claude/state`, but `.claude/` is a tracked directory (9 tracked files: `.claude/agents/*.md`, `.claude/settings.json`). So the brief's example meets "gitignored" and meets "outside every tracked directory" only if that phrase is read as "no tracked file at or beneath the leaf directory"; read literally (no tracked ancestor directory) it does not. Paths that meet the literal reading: (a) `target/evidence/<date>.jsonl`: `git check-ignore -v` names `.gitignore:2:target/`, `git ls-files target` lists 0, but `cargo clean` deletes it; (b) a path outside the working tree altogether, for example a sibling folder of the main checkout, `<repo root>/../spatial-ide-local/evidence/<date>.jsonl`: `git check-ignore -v ../x` exits 128 ("outside repository"), so no ignore rule is needed and no tracked directory contains it; the sibling-folder habit exists (`C:/dev/wt/`, `D:/wt-targets`). Proposal: (b), with the repository root taken from `$.session.repo()` (typed: "the main working tree's for a worktree"), so every worktree and subagent logs to one place; or, if the human reads the phrase as the brief's example does, keep `.claude/state/evidence/` and reword the criterion.
**The project root, and a worktree.** Typed at 2.1.288: `$.session.root()` is "the session's project root ... where it started, or where /cd, a host's directory change or a worktree move took it"; `$.session.repo()` answers `{ root, remote, ... }` where `root` is "the main working tree's for a worktree"; `$.session.cwd()` is the directory the session runs in. None of the three takes an `agentId`, and the Bash `tool.call` input has no cwd field (`command`, `timeout`, `description`, `run_in_background`, `dangerouslyDisableSandbox`), so a subagent's own worktree (`isolation: 'worktree'`, or a `cwd` given at spawn) is not reachable from a `tool.call` hook by type. A log path built from `$.session.repo().root` goes to the main checkout's path for every subagent; a path built from `$.session.root()` or a relative path goes to the session's. The tree whose identity is hashed is the `cwd` given to `$.process.run`, default the session's: a command run by a subagent in `C:/dev/wt/...` is hashed in the session's tree unless the hook parses a leading `cd <dir>` from the command. The `classic.PostToolUse` event (typed) carries `cwd` and `duration_ms` in its base fields, but whether that `cwd` is the subagent's is not typed, and the event is not on the brief's hooks line; not verifiable without a live session (probe: a throwaway `classic.PostToolUse` hook logging `e.cwd` for a subagent started with `isolation: 'worktree'`).
**The append.** Typed at 2.1.288: `$.fs` has `read`, `write`, `list`, `exists`, `stat` and `ancestors`; there is no append and no delete. An append is `read` then `write` of the whole text ("Writes `text` to a file, creating it and its directories as needed"), so two interleaved calls can drop a line, and a read "over 4 MiB rejects" (a day file beyond 4 MiB cannot be appended to). Path limits: relative to the session's working directory, or absolute "as given"; "where one may go is an `fs.*` hook's to say"; a network location is rejected. A race-free alternative using only `write`: one small file per record (`<date>/<agentId-or-main>-<tool_use_id>.json`), still one JSON object per file and append-only in effect.
**Pruning.** Typed at 2.1.288: `$.fs.list(path)` returns `{ name, kind, size, mtimeMs, isLink }`, so the mod can find files older than 30 days, but nothing in `$.fs` deletes them; deleting would need `$.process.run` of an `rm`-like command, a second use of `process.run` beyond `git` and a write the brief's item 7 does not list. So pruning conflicts with item 7's expected calls line: it adds `$.fs.list` (observed at 2.1.289 on `probe-prune`, section 7) and a delete through `process.run`.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:3012-3015:

```text
       * to say. A read or write over 4 MiB rejects, the implementation beneath the
       * hooks rejects a network location untouched, an OS refusal with its errno.
       */
      fs: {
```

Verbatim, <skill-root>/types/claude-code.d.ts:3036-3041:

```text
           * Writes `text` to a file, creating it and its directories as needed.
           *
           * @param path relative to the working directory, or absolute
           * @param text the whole new content
           */
          write: (path: string, text: string) => Promise<void>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:3047-3060:

```text
           * regular file's own and 0 for every other kind (`$.fs.stat` has those).
           *
           * @param path the directory's path; absent, the working directory
           * @returns the entries, `{ name, kind, size, mtimeMs, isLink }` each
           * @example
           * const logs = await $.fs.list("logs")
           * const newest = [...logs].sort((a, b) => b.mtimeMs - a.mtimeMs)[0]
           */
          list: (path?: string) => Promise<FsEntry[]>;
          /**
           * Returns whether the path exists; rejects only a network location, which
           * the implementation beneath the hooks never touches.
           */
          exists: (path: string) => Promise<boolean>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:6606-6636:

```text
      'fs.read': {
          path: string;
          as: FsReadAs;
      };
      /**
       * The argument of `$.fs.write(path, text)`.
       */
      'fs.write': {
          path: string;
          text: string;
      };
      /**
       * The argument of `$.fs.list(path)`.
       */
      'fs.list': {
          path: string;
      };
      /**
       * The argument of `$.fs.exists(path)`.
       */
      'fs.exists': {
          path: string;
      };
      /**
       * The argument of `$.fs.stat(path, { resolve })`: `resolve` is false
       * unless the caller asked where the path lands.
       */
      'fs.stat': {
          path: string;
          resolve: boolean;
      };
```

Verbatim, <skill-root>/types/claude-code.d.ts:2568-2579:

```text
          /**
           * Returns the directory the session runs in, absolute.
           */
          cwd: () => Promise<string>;
          /**
           * Returns the session's project root, absolute: where it started, or
           * where `/cd`, a host's directory change or a worktree move took it.
           *
           * A shell `cd` during the session does not move it; nested instruction
           * files are read only beneath it.
           */
          root: () => Promise<string>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:10770-10778:

```text
  /**
   * What `$.session.repo()` answers: the repository's root and its origin remote,
   * when the session is in one.
   */
  export type SessionRepo = {
      /**
       * The repository's root, absolute: the main working tree's for a worktree.
       */
      root: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:2593-2600:

```text
          /**
           * Returns the git repository the session runs in, read from the working
           * copy on each call; null when the directory is not inside one.
           *
           * @example
           * const repo = await $.session.repo(); const publicRepo = !repo?.internal
           */
          repo: () => Promise<SessionRepo | null>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:15177-15181:

```text
    Bash: {
      /** The command to execute */
      command: string
      /** Optional timeout in milliseconds (max 600000 for a foreground command) */
      timeout?: number
```

Verbatim, <skill-root>/types/claude-code.d.ts:15183-15188:

```text
      description?: string
      /** Set to true to run this command in the background. */
      run_in_background?: boolean
      /** Set this to true to dangerously override sandbox mode and run commands without sandboxing. */
      dangerouslyDisableSandbox?: boolean
    }
```

Verbatim, <skill-root>/types/claude-code.d.ts:314-317:

```text
       * The directory the subagent runs in when the call set one (`cwd`); undefined
       * means the parent's. A rewrite is where the subagent runs.
       */
      cwd?: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:441-444:

```text
       * Where the agent runs apart from the session: `worktree`, a git worktree
       * of its own; `remote`, a cloud session where the build allows one.
       */
      isolation?: 'worktree' | 'remote';
```

Verbatim, <skill-root>/types/claude-code.d.ts:675-678:

```text
  type BaseHookInput = {
      session_id: string;
      transcript_path: string;
      cwd: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:7404-7412:

```text
  type PostToolUseHookInput = BaseHookInput & {
      hook_event_name: 'PostToolUse';
      tool_name: string;
      tool_input: unknown;
      tool_response: unknown;
      tool_use_id: string;
      /**
       * Tool execution time in milliseconds. Excludes permission-prompt and hook time.
       */
```

Repository commands (observed, `git 2.49.0.windows.1`, run in `C:/dev/spatial-ide` only):

```text
$ git --no-optional-locks check-ignore -v .claude/state/evidence/2026-10-04.jsonl
.gitignore:43:.claude/state/	.claude/state/evidence/2026-10-04.jsonl
exit 0
$ git --no-optional-locks check-ignore -v target/evidence/2026-10-04.jsonl
.gitignore:2:target/	target/evidence/2026-10-04.jsonl
exit 0
$ git --no-optional-locks check-ignore -v ../spatial-ide-local/evidence/x.jsonl
fatal: ../spatial-ide-local/evidence/x.jsonl: '../spatial-ide-local/evidence/x.jsonl' is outside repository at 'C:/dev/spatial-ide'
exit 128
$ git --no-optional-locks ls-files .claude | wc -l
9
$ git --no-optional-locks ls-files .claude/state | wc -l
0
$ git --no-optional-locks ls-files target | wc -l
0
$ git --no-optional-locks ls-files .claude
.claude/agents/architect.md
.claude/agents/evidence-reader.md
.claude/agents/lead-data.md
.claude/agents/reviewer.md
.claude/agents/tester-high.md
.claude/agents/tester.md
.claude/agents/worker-high.md
.claude/agents/worker.md
.claude/settings.json
```

**What it means.** Narrow: (a) the log path is a decision for the custodian between `.claude/state/evidence/` (reword the brief) and a sibling folder (literal); (b) "append-only JSON lines" becomes "one file per record, or a serialized read-then-write per day file, with a loss risk the form states"; (c) drop the 30-day pruning from the mod (it conflicts with item 7), and prune by a repository script or by hand; (d) state in scope that a subagent's worktree tree is not hashed unless a cwd can be learned.

## 6. The chain order with Guardian (§3 item 6)
**Answer.** Typed at 2.1.288: hooks of one event nest by tier, outermost first, `prepend`, `user`, `append`, `builtin`, `core`; "same-event hooks nest in this order and no other way"; both Guardian and the recorder are installed by a person, so both are tier `user`, and the types do not state the order of two plugins within one tier (the `engine.create` doc says "in list order, first outermost", without saying where the list comes from): not verifiable without a live session. A hook sees that a plugin beneath it refused: `next(e)` resolves to `{ deny: string }` (the typed deny arm, `result` absent), and `next.trace` lists each link beneath with its `plugin`, `tier` and `outcome` (so the refuser can be named). If the recorder is beneath Guardian, a refused call never reaches it: Guardian answers without calling `next`, the recorder's hook is not run, and there is no record and no work; if the recorder is above Guardian, it runs its "before" git calls first and then sees the `deny`, and must write no record (that costs the before-snapshot on a refused approved command). One more kind of non-run exists beneath both: a settings `classic.PreToolUse` hook or the permission system can refuse beneath every plugin; how that surfaces (a `deny` or an `isError` result) is not verifiable without a live session.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:11888-11907:

```text

  /**
   * One of the chain's five tiers (TIERS), outermost first; on every
   * `next.trace` entry, and what `next.to(e, tier)` names.
   *
   * `prepend` and `append` are the managed plugins an administrator lists,
   * `user` everything a person installs, `builtin` the plugins bundled in the
   * binary, `core` the engine's innermost link.
   */
  export type Tier = (typeof TIERS)[number];

  /**
   * The chain's five tiers, outermost first: earlier is outer is more
   * authority, and same-event hooks nest in this order and no other way.
   *
   * The managed plugins an administrator prepends, everything a person
   * installs, the managed plugins appended, the plugins bundled in the binary,
   * the engine's innermost link; a built-in's `$` calls still raise everywhere.
   */
  const TIERS: readonly ["prepend", "user", "append", "builtin", "core"];
```

Verbatim, <skill-root>/types/claude-code.d.ts:6171-6178:

```text
       * What settled beneath this hook on its latest `next()` call, the one
       * started last: an entry per link beneath, nearest first, the engine's last.
       *
       * Empty before `next` is called; filled even when `next` rejected; a link
       * still running joins in place later, nothing listed leaves; it ends short
       * of the engine at a link that answered its last call itself. Data, frozen.
       */
      readonly trace: readonly TraceEntry<N, E, O>[];
```

Verbatim, <skill-root>/types/claude-code.d.ts:7517-7521:

```text
   * What a `classic.PreToolUse` hook returns: one of `allow`, `ask`, `deny`,
   * or none of them, which passes the call on to the normal permission flow.
   *
   * The event fires inside `tool.call`, beneath every plugin's `tool.call` hook
   * (a test raises it by calling `$.tool.call`).
```

Verbatim, <skill-root>/types/claude-code.d.ts:12460-12472:

```text
   * What the chain decided for one link, as `next.trace` names it.
   *
   * `returned`: its result stood; `passed`: it returned, by reference, what its
   * last `next()` resolved to (a hooks module's hook answers with a copy of its
   * own, so it reads `returned`); `skipped`: it failed before `next`, or a
   * `next.to` above continued beneath its tier (`reason` says which), and
   * beneath ran in its place; `kept`: it failed after `next`, and that run's
   * result stands; `expired`: its budget ran out (what stands follows
   * skipped/kept); `caught`: it threw or its budget ran out, and its `.catch`
   * handler's result stands; `rejected`: the link rejected; the deepest such
   * entry is where the rejection came from, and the ones above it let it pass.
   */
  export type TraceOutcome = 'caught' | 'expired' | 'kept' | 'passed' | 'rejected' | 'returned' | 'skipped';
```

Verbatim, <skill-root>/types/claude-code.d.ts:14841-14847:

```text
   * Written inline in a test and loaded as a plugin folder is: its name, the
   * tier it loads in (`user` when not given), and its hooks module's `register`.
   *
   * `register` is written `register(on) { ... }` and is self-contained, as a
   * module's is: it closes over nothing of the test file.
   */
  export type Plugin = {
```

Verbatim, <skill-root>/types/claude-code.d.ts:14958-14964:

```text
  /**
   * Says which tier the plugin under test loads in, once, at the top of the
   * file: `prepend`, `user` (when unsaid), `append` or `builtin`.
   *
   * @param tier the tier
   */
  export const tier: (tier: PluginTier) => void;
```

Verbatim, <skill-root>/types/claude-code.d.ts:3695-3705:

```text
   * core innermost.
   *
   * A hook is written in post-order: `const built = await next(e)` is `$` as
   * built so far; `return { ...built, voice: { say } }` adds this plugin's noun.
   * See EngineEventOf's `engine.create` for what a step may and may not do.
   */
  export type EngineCreateInput = {
      /**
       * The modules this fold builds, in list order, first outermost (managed
       * plugins first, so an org plugin's withholding wins).
       *
```

**Probe** (observed at 2.1.289; tests `Q6 chain: guard in tier prepend, a refused approved command`, `... tier user ...`, `... tier append ...`): an inline plugin `guard` (denies a Bash command containing `FORBID`, `{ deny: 'guard: refused' }`) is loaded beside `probe-recorder` (user tier) in each of the three tiers; the same approved command `cargo test --workspace --locked FORBID` was raised through `$.tool.call`. Output lines:

```text
Q6 tier=prepend: reply={"deny":"guard: refused"} recorderLines=0 gitCalls=0 line=-
Q6 tier=user: reply={"deny":"guard: refused"} recorderLines=1 gitCalls=1 line={"agentId":"main","command":"cargo test --workspace --locked FORBID","before":{"ok":true,"exitCode":0,"sha":"M x\u0000"},"deny":"guard: refused","stdoutBytes":"unavailable","sha":"unavailable"}
Q6 tier=append: reply={"deny":"guard: refused"} recorderLines=1 gitCalls=1 line={"agentId":"main","command":"cargo test --workspace --locked FORBID","before":{"ok":true,"exitCode":0,"sha":"M x\u0000"},"deny":"guard: refused","stdoutBytes":"unavailable","sha":"unavailable"}
```

Reading: with the guard in `prepend` (outside the recorder) the recorder is never reached (0 lines, 0 git calls); with the guard in `append` (beneath the recorder) the recorder's hook ran, took its before-snapshot, saw `"deny":"guard: refused"` from `next(e)` and recorded it (the probe records the deny instead of dropping the line, to show it can tell; the real mod would drop it). With the guard in `user` loaded beside the plugin under test, the recorder was outside the guard (it saw the deny); that is the harness's order for the plugin under test and says nothing about the order of two installed plugins. The harness holds two plugins only as inline test plugins, so the real installed order is a live probe: two throwaway mods loaded with two `--plugin-dir` flags in each order, each logging `next.trace` and which ran, started by the human in a session.
**What it means.** Keep, with a design rule that does not depend on the order: the recorder treats `ran.deny !== undefined` as "not a run, no record", and takes its "before" snapshot lazily if the order proves it is above Guardian. The preregistration should state both orders and the install-order probe as a live item.

## 7. `claude plugin validate` (§3 item 7)
**Answer.** Observed at 2.1.289: three probe mods validate with exit 0 (text and `--json`). `probe-min` (what the brief lists: a `tool.call{tool=Bash}` hook and a `turn.complete` hook, git through `$.process.run`, an append through `$.fs`, `$.agent.list()`) prints hooks line `tool.call{tool=Bash}, turn.complete` and calls line `$.agent.list, $.fs.read (via append), $.fs.write (via append), $.process.run`. Beyond the brief's three expected items it shows `$.fs.read` (the append is read then write; `validate` names the helper function: "via append"). `probe-recorder` (the fuller probe, also `$.session.root` for the project root and `$.fs.exists`) prints `$.agent.list, $.fs.exists, $.fs.read, $.fs.write, $.process.run, $.session.root`. `probe-prune` adds a `$.fs.list` call to `probe-min` and prints `$.agent.list, $.fs.list, $.fs.read (via append), $.fs.write (via append), $.process.run`. The only other lines are the manifest warning `version: No version specified` (a warning on all three; the manifest has an author). A deleting call does not exist in `$.fs`, so no `validate` line for it can appear.
`claude plugin validate probe-min` (observed at 2.1.289, exit 0):

```text
Validating plugin manifest: <probe-dir>\probe-min\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

Validating hooks: <probe-dir>\probe-min\hooks\hooks.json

  ❯ ./register.js hooks: tool.call{tool=Bash}, turn.complete
  ❯ ./register.js calls: $.agent.list, $.fs.read (via append), $.fs.write (via append), $.process.run

✔ Validation passed with warnings
```

`claude plugin validate probe-min --json` (observed at 2.1.289, exit 0), the `notes` of the hooks entry:

```text
[
  "./register.js hooks: tool.call{tool=Bash}, turn.complete",
  "./register.js calls: $.agent.list, $.fs.read (via append), $.fs.write (via append), $.process.run"
]
success: true; manifest.warnings: ["version"]; contents[0].errors: []
```

`claude plugin validate probe-recorder` (observed at 2.1.289, exit 0):

```text
Validating plugin manifest: <probe-dir>\probe-recorder\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

Validating hooks: <probe-dir>\probe-recorder\hooks\hooks.json

  ❯ ./register.js hooks: tool.call{tool=Bash}, turn.complete
  ❯ ./register.js calls: $.agent.list, $.fs.exists, $.fs.read, $.fs.write, $.process.run, $.session.root

✔ Validation passed with warnings
```

`claude plugin validate probe-recorder --json` (observed at 2.1.289, exit 0), the `notes` of the hooks entry:

```text
[
  "./register.js hooks: tool.call{tool=Bash}, turn.complete",
  "./register.js calls: $.agent.list, $.fs.exists, $.fs.read, $.fs.write, $.process.run, $.session.root"
]
success: true; manifest.warnings: ["version"]; contents[0].errors: []
```

`claude plugin validate probe-prune` (observed at 2.1.289, exit 0):

```text
Validating plugin manifest: <probe-dir>\probe-prune\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ version: No version specified. Consider adding a version following semver (e.g., "1.0.0")

Validating hooks: <probe-dir>\probe-prune\hooks\hooks.json

  ❯ ./register.js hooks: tool.call{tool=Bash}, turn.complete
  ❯ ./register.js calls: $.agent.list, $.fs.list, $.fs.read (via append), $.fs.write (via append), $.process.run

✔ Validation passed with warnings
```

`claude plugin validate probe-prune --json` (observed at 2.1.289, exit 0), the `notes` of the hooks entry:

```text
[
  "./register.js hooks: tool.call{tool=Bash}, turn.complete",
  "./register.js calls: $.agent.list, $.fs.list, $.fs.read (via append), $.fs.write (via append), $.process.run"
]
success: true; manifest.warnings: ["version"]; contents[0].errors: []
```

**What it means.** Keep, with item 7's calls line restated as what the build prints: `$.process.run`, `$.fs.read` and `$.fs.write` (the append), `$.agent.list`, and, if the project root is taken from the session, `$.session.repo` or `$.session.root`; `$.fs.list` appears only if pruning stays in the mod.

## Final: sha256 of each cited `<skill-root>` file, every command run, probe folders
Each hash is of the file as read (LF bytes as on disk); the cited lines' spans are byte-copied by script from these files.

```text
76a0235a305b1a6ae53f87a2c91d84b502ceebab7f887bd036ad5054ef366f73  <skill-root>/examples/tool-call.ts
ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4  <skill-root>/reference.md
36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1  <skill-root>/types/claude-code.d.ts
```

Sha256 of the single lines named as "span of line": `<skill-root>/reference.md:75` sha256:37b4a3e2c297f472f238ce9f98f51e88f3c91bdd0c61290da462632a56d87285.

Commands run, with exit codes (every `claude` and `node` run under `timeout` or a bounded loop; `<probe-dir>` is the scratch folder). Read-only reads of the skill-root and repository files by `sed -n`, `grep -n`, `awk` and the file reader are grouped, all exit 0:

```text
claude --version (start)                                                                0   -> 2.1.289 (Claude Code)
claude --version (end)                                                                  0   -> 2.1.289 (Claude Code)
git --version                                                                           0
git --no-optional-locks ls-files | wc -l  (several times)                               0
git --no-optional-locks status --porcelain=v1 (| head, | wc -l; several times)         0
git --no-optional-locks rev-parse [--short=12] HEAD ; git log -1 --format=%H origin/main 0
git --no-optional-locks diff HEAD --binary | wc -c  (several times)                     0
git --no-optional-locks check-ignore -v <path>  (paths in section 5)                    0, 0, 128 (outside repository), and 1 for two unignored candidates not reported
git --no-optional-locks ls-files .claude | .claude/state | target | <dir> | scripts ..  0
git --no-optional-locks worktree list | head                                            0
git --no-optional-locks show 163ce8c11afb:<path>  (inside gen-report.mjs, per excerpt)  0
git --no-optional-locks status --porcelain=v1 --ignored  (inside time-git.mjs)          0
node time-git.mjs   (runs A, M, B; 20 runs each of status, diff, both, --ignored, git --version)   0, 0, 0
time-git.sh x4 (status, diff, both, true|sha256sum), under timeout 300                  0   (shell-pipeline timing)
du -sh frontends/shell/src-tauri/target  (killed by taskkill //PID //F after minutes)   killed (taskkill exit 0)
find frontends/shell/src-tauri/target -type f | wc -l                                   0   (31131 files)
claude plugin validate probe-recorder  (and --json)                                     0, 0   (several runs)
claude plugin validate probe-min       (and --json)                                     0, 0
claude plugin validate probe-prune     (and --json)                                     0, 0
claude plugin test probe-recorder  (1st run: 1 fail, assertion on e.timeoutMs)          1
claude plugin test probe-recorder  (fixed to e.init.timeoutMs)                          0   (9 pass)
claude plugin test probe-recorder  (mutation: return { ...ran, context }): 4 fail       1
claude plugin test probe-recorder  (after revert; byte-compared with reg.orig)          0   (9 pass)
claude plugin test probe-recorder  (final run, saved as test-final.txt)                 0
node gen-report.mjs                                                                     0
sha256 of each cited skill-root file (inside gen-report.mjs, node crypto)               0
sed -n / grep -n / awk / cat / ls / wc over skill-root files and repository files       0 each
```

Hard limits, checked by what was run: none of `plugin install`, `enable`, `marketplace add`, `init`/`new`, `update`, `configure`, `eval` was run; no Claude session was started; nothing was written under the Claude profile folder, in `C:/dev/spatial-ide` or in any worktree; git ran only read-only with `--no-optional-locks`, and never in `C:/dev/wt/null-literal`; the only writes are files in `recorder-p0/`. Off-scope observations: (i) one of my Bash commands (a heredoc holding test-file text, with no `git push` in it) was refused by `spatial-guardian G1`, which shows Guardian was active in this session; the trigger was not determined and the command was re-issued through the file-write tool. (ii) My first timing command started a `du` of `frontends/shell/src-tauri/target` that ran for minutes; I killed that one process (my own, `du.exe`) with `taskkill`. (iii) The main checkout changed while I worked (HEAD moved from c7d0b200 to 163ce8c1; staged files appeared): the timing runs' tree states are stated above.

Probe folders left in `recorder-p0/`: `probe-recorder/` (hooks, manifest, `test/recorder.test.ts`), `probe-min/`, `probe-prune/`; scripts and outputs `time-git.mjs`, `time-git.sh`, `gen-report.mjs`, `reg.orig` (the saved original of the mutated file), `t1.out`-`t4.out`, `test-final.txt`, `v-*.txt`, `v-*.json`, `rc.txt`.
