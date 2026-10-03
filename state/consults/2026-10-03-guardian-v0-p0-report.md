*Custodian's filing note (2026-10-03): guardian-v0's P0, the brief's §3 questions answered against the installed build 2.1.288 (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md`), by a worker on the custodian's brief. The worker wrote it to the custodian's scratchpad, not the repository, so that no parallel lead-data or architect run's C3 snapshot carried it. The custodian copied it here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is 81fe4e6f1c0aecf439ffa3f9600277c9ebdd40273a91290fbb60261e5f1fabf0, equal to the worker's hand-back. **Checked by the custodian:** every ranged and span excerpt marked verbatim from `<skill-root>` matches its source lines, 34 of 34, by script, and a one-byte negative self-test is caught; the two cited files' sha256 values match. **Hard limits checked:** the session's dev-mods folder is empty; `installed_plugins.json` is unchanged (one plugin, installed 2026-08-01); the repository's porcelain shows no worker file. One file under the plugins store directory changed at 18:34:48Z, a built-in mod's own state value (`{"open": false}`); its writer is not determined, and it is not an install. `<skill-root>` is the build's bundled plugin-authoring skill folder; `<probe-dir>` is the custodian's scratchpad. Profile paths redacted at filing: none.*

---

# Guardian v0 — P0 against Claude Code 2.1.288
Run on build 2.1.288 (`claude --version` printed "2.1.288 (Claude Code)", exit 0). Sources: `<skill-root>` is the build's bundled plugin-authoring skill folder (`reference.md`, `types/claude-code.d.ts`, `examples/tool-call.ts`); CLI help texts are quoted from `claude plugin ... --help`. Probes ran only as `claude plugin validate` and `claude plugin test` on throwaway folders in the scratch directory; nothing was installed, loaded, or started. Where a command's output named the scratch directory, that path is replaced by `<probe-dir>` (the only edit made to any probe output; every other byte is as printed). The probe mods are in the scratch directory: probe (G1/G2/G3/N1 shapes, tests), probe-timeout, probe-import, probe-js, probe-market.
## 1. Agent identity
**Answer.** Yes: every `tool.call` event carries `agentId` when the call runs in a subagent's or teammate's loop, and it is absent on the main loop. The subagent's type is typed (`$.agent.list()` rows: `id` equals that `agentId`, `type` is the definition name); its brief is reachable two typed ways: an `agent.spawn` hook sees `e.prompt` and `e.subagentType` and its `next(e)` result carries the same `agentId` the later `tool.call`s carry, or `$.session.messages({ agentId })` reads the subagent's transcript. Whether a live subagent's calls reach the hook with `agentId` set is the build's type claim; it is not verifiable without a live session.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:164-182:

```text
  /**
   * Which model loop an event happened in: the loop's agent id inside a
   * subagent's or a teammate's loop, absent on the main loop.
   *
   * The agent axis, not the origin axis: `next.origin` names the plugin whose
   * hook frame caused the dispatch (the recursion skip), whichever loop it ran
   * in; `agentId` names the loop, whoever caused the call.
   */
  export type AgentLoop = {
      /**
       * The id of the loop this call runs in: for a subagent or a teammate, the
       * `id` `$.agent.list()` gives it; absent on the main loop.
       *
       * A workflow's agents and the engine's own forks (compaction, memory) carry
       * ids no list names. Pinned: a different value is refused, one left out is
       * kept. Which loop, not which plugin caused it (that is `next.origin`).
       */
      agentId?: string;
  };
```

Verbatim, <skill-root>/types/claude-code.d.ts:121-139:

```text
  /**
   * One agent loop of this session as `$.agent.list()` returns it: a subagent
   * or an in-process teammate.
   */
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
```

Verbatim, <skill-root>/types/claude-code.d.ts:231-262:

```text
  /**
   * The input of `agent.spawn`: what the Agent tool decided about the
   * subagent it is about to start, before its model is resolved.
   *
   * A hook rewrites content (prompt, description, subagentType, model,
   * background, cwd), read back as the tool's parameters; tool_use_id, name,
   * fork, parentModel, permissionMode, parentAgentId and provider are pinned.
   */
  export type AgentSpawnInput = {
      /**
       * The Agent tool call this spawn belongs to (for `$.ui.notice`). Pinned:
       * the spawn's identity.
       */
      tool_use_id: string;
      /**
       * The task the subagent is given: the Agent tool's `prompt` parameter. A
       * rewrite is the prompt the subagent runs with.
       */
      prompt: string;
      /**
       * The Agent tool's short `description` of the task (a few words). A rewrite
       * is what the task shows as.
       */
      description: string;
      /**
       * The resolved agent type (`general-purpose`, `Explore`, a plugin's agent,
       * `fork`). A rewrite names another agent this call can dispatch, exactly.
       *
       * That definition is the one spawned; a name matching none refuses the
       * spawn, and a fork dispatches no other.
       */
      subagentType: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:320-343:

```text
  /**
   * What an `agent.spawn` hook returns and what `next(e)` resolves to: the
   * started subagent's `{ model, agentId }`, or `{ deny: reason }`, refusing it.
   *
   * It and `$.agent.spawn(input)` resolve once the subagent started; its answer
   * is its own `turn.complete`, carrying this `agentId`. Keep the id and set
   * `got[agentId]` to what waits; a `turn.complete` hook resolves it:
   *
   * @example
   * on("turn.complete", ($, e, next) => (got[e.agentId]?.(e.answer), next(e)))
   */
  export type AgentSpawnResult = {
      /**
       * What the subagent runs on: from core the resolved id; from a hook an
       * alias (`haiku`) or an id.
       */
      model: string;
      /**
       * The started subagent's id: the same string its loop's `tool.call`
       * events carry as `agentId` and `$.agent.list()` lists it by.
       *
       * Set by core; a hook that answers without `next` started none.
       */
      agentId?: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:3061-3113:

```text
          /**
           * Returns `{ kind, size, mtimeMs, isLink }` of the path: what it leads to,
           * and whether it is itself a symbolic link. Rejects when missing.
           *
           * With `{ resolve: true }` also `realPath`, where the path lands, absent
           * when it leads nowhere; a guard matches it and denies without it, since a
           * spelling it cannot resolve (`~`, a file not there yet) the tool may open.
           *
           * @param path relative to the working directory, or absolute
           * @param options `resolve`: also answer `realPath` (one more file system
           *                call)
           * @returns the stat, `realPath` with it when asked and resolvable; rejects
           *          `ENOENT` for a missing path
           * @example
           * // ROOT was resolved the same way and SEP is its separator; an
           * // allow-list under it is the robust guard, a deny-list on spellings
           * // only best effort (a hard link or a case alias keeps its own)
           * on("tool.call", { tool: "Read" }, async ($, e, next) => {
           *   const stat = await $.fs.stat(e.file_path, { resolve: true })
           *     .catch(() => undefined)
           *   const real = stat?.realPath
           *   const isInside = real !== undefined && real.startsWith(ROOT + SEP)
           *   return isInside ? next(e) : { deny: "outside the project" }
           * })
           * @example
           * // a Write may name a file not there yet: `placed` answers where the
           * // path lands or undefined, and the guard denies on undefined or
           * // outside ROOT. Unplaceable by spelling first, with no file system
           * // call (drive-relative `D:x`, a `\\` or `//` network or device path,
           * // a name that is empty, ".", ".." or itself `C:...`); then the file
           * // if it stats; else its folder, cut after the last separator and
           * // keeping it so a drive or share root stays that root, plus the name
           * const placed = async (path) => {
           *   const cut = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"))
           *   const name = path.slice(cut + 1)
           *   const isPlaceable = !/^[A-Za-z]:(?![\\/])/.test(path) &&
           *     !/^[\\/][\\/]/.test(path) && !/^[A-Za-z]:/.test(name) &&
           *     name !== "" && name !== "." && name !== ".."
           *   if (!isPlaceable) return undefined
           *   const own = await $.fs.stat(path, { resolve: true })
           *     .catch(() => undefined)
           *   if (own) return own.realPath
           *   const folder = cut < 0 ? "." : path.slice(0, cut + 1)
           *   const dir = await $.fs.stat(folder, { resolve: true })
           *     .catch(() => undefined)
           *   return dir?.realPath === undefined ? undefined
           *     : `${dir.realPath.replace(/[\\/]$/, "")}${SEP}${name}`
           * }
           * const real = await placed(e.file_path)
           * const isInside = real !== undefined && real.startsWith(ROOT + SEP)
           * return isInside ? next(e) : { deny: "cannot place it, or outside" }
           */
          stat: (path: string, options?: FsStatOptions) => Promise<FsStat>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:11953-11961:

```text
  /**
   * The input of `tool.call`: the tool, the id of this call, the tool's
   * arguments beside them (`e.command` for Bash), and `agentId` in a subagent.
   *
   * A union discriminated by `tool`: after `if (e.tool === "Bash")`, `e.command`
   * is a string and a rewrite is checked against Bash's schema. `tool`,
   * `tool_use_id` and `agentId` are reserved: a rewrite of any is refused.
   */
  export type ToolCallInput = ToolCallEnvelope & AgentLoop;
```

**Probe** (the `agent identity probe` test in probe/probe.test.ts: an Edit hook denies `subagent edit` when `e.agentId` is defined; the test raises `$.tool.call` with `agentId` and a type cast, because `ToolCallArgs` documents that `agentId` "may ride along ... and are dropped" from the run, not from the hooks):

Output (full `claude plugin test` run is in section 5); the line for this probe:

```text
(pass) agent identity probe: does $.tool.call carry agentId into a hook [37.61ms]
```

**What it means.** G6 is not dropped on types alone: keep, narrowed to what a live probe confirms. Two additions the brief's item 7 did not list: the brief route through `agent.spawn` adds an `agent.spawn` hook and a `$.store.set`/`$.store.get` pair (or a module variable, lost on a hot reload), while the transcript route adds `$.session.messages` and `$.agent.list` and no extra hook. Which route holds (does the first message of `$.session.messages({ agentId })` equal the Agent call's prompt, and does a model-spawned subagent's `tool.call` carry `agentId`) cannot be settled here. Probe that would settle it: a throwaway mod loaded with `--plugin-dir` whose `tool.call` and `agent.spawn` hooks log `e.agentId`, `$.agent.list()` and the first `$.session.messages({ agentId })` row, then a session that spawns one `Explore` subagent. Also: G6's path comparison needs the call's `file_path` (absolute, per the Write input) against the brief's `REPORT PATH:` line, so it needs `$.session.root()` or `$.fs.stat(path, { resolve: true })` for a robust match (the build's own `$.fs.stat` doc, excerpted above, names `resolve: true` as the guard's tool).
## 2. The tool-result shape, and appending a line
**Answer.** Bash's result is `{ stdout, stderr, interrupted, ... }`, Grep's is `{ mode?, numFiles, filenames, content?, numLines?, ... }`, Read's is a union discriminated by `type` (`"text"` carries `file.content`); all sit in `result` of `ToolCallResult`, with `text` (the result as the model reads it), `ref`, `isError`, `isReadOnly` set by the engine. The typed way to append a line is not to edit `result`: it is the `context` field (`readonly string[]`, "What the model reads after the tool's result and the user never sees"), returned as `{ ...ran, context: [...] }` after `await next(e)`. The types say it is kept whole from `next` and reaches the model; delivery to the model is not verifiable without a live session.
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

Verbatim, <skill-root>/types/claude-code.d.ts:19495-19506:

```text
    Grep: {
      mode?: "content" | "files_with_matches" | "count"
      numFiles: number
      filenames: string[]
      content?: string
      numLines?: number
      numMatches?: number
      totalFiles?: number
      totalLines?: number
      appliedLimit?: number
      appliedOffset?: number
    }
```

Verbatim, <skill-root>/types/claude-code.d.ts:19809-19822:

```text
    Read: {
      type: "text"
      file: {
        /** The path to the file that was read */
        filePath: string
        /** The content of the file */
        content: string
        /** Number of lines in the returned content */
        numLines: number
        /** The starting line number */
        startLine: number
        /** Total number of lines in the file */
        totalLines: number
        /** True when a whole-file read was auto-paginated because it exceeded the token cap (the content is a partial first page). A programmatic signal for internal consumers; survives output reconstruction (unlike the render-time banner). */
```

Verbatim, <skill-root>/types/claude-code.d.ts:11997-12001:

```text
  export type ToolCallResult<Name extends string = string> = {
      /**
       * Refuses the call: the model receives the text as an error result.
       * Absent when the call was answered.
       */
```

Verbatim, <skill-root>/types/claude-code.d.ts:12010-12018:

```text
      /**
       * The tool's output: from core the tool's record, typed per built-in
       * tool once `e.tool` and `isError` are narrowed; from a hook, its own.
       *
       * Core validates a hook's answer against the tool's output schema when
       * it has one, maps it for the model with the tool's own mapper, and
       * records it in the transcript as the tool's result. Absent on a deny.
       */
      result: ToolResultOf<Name>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:1682-1689:

```text
      /**
       * Set by core on what `next(e)` resolves to: names the engine's run of
       * the command (its result stays on the host side).
       *
       * A hook that returns the object it got makes the engine use that run
       * verbatim. Absent on a hook's own `{ text }` and on `$.command.run`'s.
       */
      ref?: number;
```

Verbatim, a span of <skill-root>/reference.md:111:

```text
a hook that answers a row without `next` is skipped and the row is kept
```

**Probe** (`N1 probe` in probe/probe.test.ts: a Bash hook awaits `next(e)`, reads `$.session.usage()`, and returns `{ ...ran, context: ['Context at 85%: flush'] }`; the test asserts `r.context` equals that array at the engine boundary, so it proves the hook can return the field and the harness accepts it, not that a model reads it):

Output line:

```text
(pass) N1 probe: context line appended through the typed context field [42.61ms]
```

**What it means.** N1: keep, narrowed: append through `context`, never through `result` or `text`. Two consequences the rule text should carry: the line is hidden from the operator by definition ("the user never sees"), so the brief's "a tool result gets one appended line" becomes "the model gets one hidden line after the result"; and a hook must return `ran` unchanged when `ran.deny !== undefined`. Probe that would settle delivery: a throwaway mod appending `context: ['ECHO-7731']` to a Bash result, then asking the model in the same turn to repeat any line that follows the tool result.
## 3. Context fill
**Answer.** `turn.step` carries `TurnStepInput { turnId, index, model, effort?, messageCount, agentId? }` and its result `{ turnId, index, answer, toolUses, stopReason, usage: TurnUsage | null }` with `TurnUsage = ModelUsage & { model }`, the four counts `input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`. The build's own definition of a response's context size is "Input tokens the last response was answered over: uncached, cache-written and cache-read together", i.e. `input_tokens + cache_creation_input_tokens + cache_read_input_tokens` (output excluded), taken from steps with `e.agentId` unset; no field on `turn.step` or `TurnUsage` names a window size. The window is typed, but elsewhere: `$.session.usage()` resolves `context: { tokens?, window, percent? }`, where `percent` is "`tokens` over `window` as a whole percentage, 0 to 100", absent until the first response of the live window.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:12619-12661:

```text
  /**
   * The input of `turn.step`: one model request inside a turn, at the moment
   * the engine is about to send it; the bottom of the chain sends it.
   *
   * The transcript is not on it: `messageCount` says how many messages the
   * request carries, and `$.session.messages()` reads them (in a subagent's
   * loop, `$.session.messages({ agentId: e.agentId })`). A hook rewrites
   * `model` or `effort` going down; the rest is pinned.
   */
  export type TurnStepInput = {
      /**
       * The turn this step belongs to (`turn.start`'s id; inside a subagent's
       * loop, the id the run's `turn.complete` will carry). Pinned.
       */
      turnId: string;
      /**
       * The step's position in the turn, from 0. Pinned.
       */
      index: number;
      /**
       * Which model the request names, as the engine resolved it for this step
       * (the session's, a fallback's). `next({ ...e, model })` names another.
       */
      model: string;
      /**
       * How hard the request asks the model to think: the session's setting or
       * the model's default, absent for a model without effort; rewritable.
       */
      effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max' | number;
      /**
       * How many messages the request carries (the conversation so far, the
       * turn's tool results included). Pinned: the messages are the engine's.
       */
      messageCount: number;
      /**
       * The loop the request is made in: a subagent's id, the `id`
       * `$.agent.list()` gives it and its `tool.call`s carry; absent on main.
       *
       * Pinned: a different value is refused, one left out is kept. A subagent
       * a hook spawned through `$.agent.spawn` steps past that hook, as its tool
       * calls do; every other hook sees its steps.
       */
      agentId?: string;
```

Verbatim, <skill-root>/types/claude-code.d.ts:12681-12715:

```text
  /**
   * What a `turn.step` hook returns and what `next(e)` resolves to: the
   * model's response to the step's request, once its blocks are all in.
   *
   * From the bottom, the response the engine streamed; a hook's own value
   * changes what the hooks above it read, never what the engine streamed.
   */
  export type TurnStepResult = {
      /**
       * The turn this step belongs to, as received.
       */
      turnId: string;
      /**
       * The step's position in the turn, as received.
       */
      index: number;
      /**
       * The visible text of the response ("" when it only called tools, only
       * thought, or no request was made).
       */
      answer: string;
      /**
       * The tool calls the response made, in order; empty for a text-only step.
       */
      toolUses: readonly TurnStepToolUse[];
      /**
       * Why the model stopped; null when no response arrived (the request
       * failed or was interrupted before a message, or no request was made).
       */
      stopReason: TurnStopReason;
      /**
       * What the request cost as the API reported it, and the model that
       * answered; null when no response arrived or it carried no usage.
       */
      usage: TurnUsage | null;
```

Verbatim, <skill-root>/types/claude-code.d.ts:5994-6027:

```text
   *
   * The one shape every place that reports a call's cost uses:
   * `$.model.complete`'s result on every arm and `$.model.fork`'s on each arm
   * where a request was made (ModelCompleteResult), `session.compact`'s result
   * when core ran the summarizer, `turn.step` and `turn.complete` (TurnUsage,
   * which adds the `model` that answered), and the context breakdown's
   * `apiUsage` (the live window's last response). All four counts are always
   * present; a count the response left out reads as zero.
   *
   * @example
   * const r = await $.model.complete(ask); if (r.isAnswered) spend(r.usage)
   */
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

Verbatim, <skill-root>/types/claude-code.d.ts:10257-10280:

```text
  /**
   * The live context window as the status line reads it, and by category as
   * /context breaks it down when the call asked (`{ breakdown }`).
   *
   * `tokens` and `percent` are the last API response's input side against the
   * model's window, absent until the first response of the live window: a
   * fresh session, or one just compacted, until its next response.
   */
  export type SessionContextUsage = {
      /**
       * Input tokens the last response was answered over: uncached, cache-written
       * and cache-read together (the status line's `total_input_tokens`).
       */
      tokens?: number;
      /**
       * The context window of the session's model, in tokens (the status line's
       * `context_window_size`).
       */
      window: number;
      /**
       * `tokens` over `window` as a whole percentage, 0 to 100 (the status
       * line's `used_percentage`).
       */
      percent?: number;
```

Verbatim, <skill-root>/types/claude-code.d.ts:2621-2642:

```text
          /**
           * Returns when the session began, and the context window's fill, the
           * rate-limit windows and the cost as the status line has them, itemized.
           *
           * The plain call costs nothing; `"full"` counts each category with the
           * token-count API as /context does, `"summary"` estimates locally, and
           * `context.breakdown` comes back in the SDK's `get_context_usage` shape.
           *
           * @param args `{ breakdown, columns }`: how the breakdown is counted and
           *   the width its grid is drawn in; nothing for the status line's figures
           * @returns `{ startedAt, context, rateLimits, cost }` as the status line
           *   has them
           * @example
           * const { context } = await $.session.usage()
           * if ((context.percent ?? 0) >= 85) await $.session.compact()
           * @example
           * const isOlder = stat.mtimeMs < (await $.session.usage()).startedAt
           * @example
           * const usage = await $.session.usage({ breakdown: "full", columns })
           * for (const row of usage.context.breakdown?.gridRows ?? []) draw(row)
           */
          usage: (args?: SessionUsageArgs) => Promise<SessionUsage>;
```

Verbatim, <skill-root>/types/claude-code.d.ts:12799-12809:

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
```

Verbatim, a span of <skill-root>/types/claude-code.d.ts:10285:

```text
It measures against the compaction window (`rawMaxTokens`), which may be
```

**Probe** (`turn.step probe` in probe/probe.test.ts raises `$.turn.step(...)` from a stream hook and iterates the stream; it proves the hook shape, not a live fill figure):

Output line:

```text
(pass) turn.step probe: usage rides the stop chunk and the result [49.71ms]
```

**What it means.** N1: keep, narrowed to `$.session.usage()` and no `turn.step` hook at all: the fill and the window come from one typed call, so `turn.step` leaves the hooks line and the streaming-generator form (whose budget counts "the sum over the response", HookBudget's ms doc in section 6) is not needed. Open points that only a live session settles: that `context.percent` is the main conversation's (a subagent's tool call must not trigger the nudge: test `e.agentId === undefined` first), and which denominator the human means, since `window` is the model's window while the breakdown's compaction window "may be smaller than `window`" (excerpt above). Probe: a throwaway mod that logs `await $.session.usage()` on each `tool.call`, read against `/context`.
## 4. Install scope
**Answer.** From help text only: `claude plugin install <plugin>@<marketplace> --scope user|project|local` (default `user`), after the human runs `claude plugin marketplace add <source> --scope user|project|local` with a path source (help: "Add a marketplace from a URL, path, or GitHub repo"; scope default `user`). The marketplace manifest probe validated with exit 0 is `<dir>/.claude-plugin/marketplace.json` with `name`, `owner.name` and `plugins[]` entries `{ name, source: "./<plugin folder>", description }`, so `tools/mods/.claude-plugin/marketplace.json` pointing at `./spatial-guardian` is the shape. The help text does not say where each scope is stored, so "what keeps it out of cloud sessions" is not settled by the provided sources: the only help-text fact is that `user` is the default and the other two are named `project` and `local`. Not verifiable without a live session or the docs pages: the probe would be `claude plugin marketplace add` and `install` on a throwaway folder, which is the human's red line and was not run. The brief's §4 names `hooks/register.js`: the build accepts it (probe-js validated: `./register.js hooks: tool.call{tool=Bash}`), as it accepts `.ts`; but `hooks/hooks.json` must say `"modules": ["./register.js"]`, an array of exactly one path (a string is refused: "Invalid input: expected array, received string").
**Sources.**

Verbatim, output of `claude plugin install --help` (build 2.1.288):

```text
Usage: claude plugin install|i [options] <plugin>

Install a plugin from available marketplaces (use plugin@marketplace for
specific marketplace)

Options:
  --accept-command <sha256>  Accept the marketplace-declared command (a
                             command-source install, or the headersHelper that
                             fetches the archive) whose sha256 a previous --json
                             run reported as shownCommand.sha256; counts as -y
                             for exactly that command, for that plugin and
                             marketplace catalog, and nothing else. If either
                             changed (a refresh that moved the catalog counts),
                             the run refuses and reports the command again, to
                             be shown to a person again
  --config <key=value>       Set a userConfig option declared in the plugin's
                             manifest, or a bundled .mcpb server's own
                             user_config field as <server>.<key>=<value> (a bare
                             key works when only one bundled server declares
                             it). Repeatable. Values are validated against the
                             schema and stored via the same path as the
                             interactive /plugin configure flow.
  -h, --help                 Display help for command
  --json                     Print one machine-readable result line on stdout
                             instead of the human message (same exit codes; a
                             marketplace-declared command is still shown and
                             must be confirmed — pass -y when not interactive)
  --registry <url>           For a <package>@npm install: resolve and download
                             from this npm registry instead of the one your npm
                             configuration selects
  -s, --scope <scope>        Installation scope: user, project, or local
                             (default: "user")
  -y, --yes                  Accept the displayed marketplace-declared command
                             without the confirmation prompt — a plugin
                             installed by running a command, or one whose
                             archive is fetched through a headersHelper command
                             (required when stdin or stdout is not a TTY)
```

Verbatim, output of `claude plugin marketplace add --help` (build 2.1.288):

```text
Usage: claude plugin marketplace add [options] <source>

Add a marketplace from a URL, path, or GitHub repo

Options:
  --claudeai           Add the marketplace of this name that claude.ai hosts for
                       you, by its listed name or its local name (see: claude
                       plugin marketplace list)
  -h, --help           Display help for command
  --json               Print one machine-readable result line as the last line
                       on stdout (same exit codes)
  --scope <scope>      Where to declare the marketplace: user (default),
                       project, or local
  --sparse <paths...>  Limit checkout to specific directories via git
                       sparse-checkout (for monorepos). Example: --sparse
                       .claude-plugin plugins
```

Verbatim, output of `claude plugin disable --help` (build 2.1.288):

```text
Usage: claude plugin disable [options] [plugin]

Disable an enabled plugin

Options:
  -a, --all            Disable all enabled plugins
  -h, --help           Display help for command
  --json               Print one machine-readable result line on stdout instead
                       of the human message (same exit codes)
  -s, --scope <scope>  Installation scope: user, project, local (default:
                       auto-detect)
```

Verbatim, a span of <skill-root>/reference.md:14:

```text
exporting `register(on, options)`; the module, and every file it imports from the plugin, is named `.ts`, `.tsx`, `.jsx`, `.js`, `.mjs`, `.cjs`, `.mts` or `.cts`
```

Verbatim, a span of <skill-root>/reference.md:60:

```text
`claude plugin validate <path>` reads a plugin's manifest and its hooks
```

Probe outputs (marketplace validate, sanitized), `claude plugin validate probe-market`:

```text
Validating marketplace manifest: <probe-dir>\probe-market\.claude-plugin\marketplace.json

⚠ Found 2 warnings:

  ❯ description: No marketplace description provided. Adding a description helps users understand what this marketplace offers
  ❯ plugins[0] plugin.json → author: No author information provided. Consider adding author details for plugin attribution

✔ Validation passed with warnings
```

Probe output, hooks.json with a string `modules` (first attempt, exit 1):

```text
✘ Found 2 errors:

  ❯ modules: Invalid input: expected array, received string
  ❯ modules: hooks.json `modules` names one hooks module per plugin; a second entry is refused

✘ Validation failed
```

Probe output, `claude plugin validate probe-js`:

```text
  ❯ ./register.js hooks: tool.call{tool=Bash}
  ❯ ./register.js calls: nothing on $

✔ Validation passed with warnings
```

**What it means.** Packaging: keep. Recommended for the PR text, pending the human's read of the docs page: user scope, with the marketplace added at user scope, so no repository file declares the plugin as enabled; a `project` scope declaration would be a repository file and is therefore the scope to refuse until the docs say where it lands. `validate` on the marketplace folder lists no hooks or calls (`"contents": []`), so the plugin folder must be validated separately for the PR body.
## 5. Tests
**Answer.** `claude plugin test <dir>` runs every `*.test.ts` and `*.test.tsx` under the folder, each file in a child of the binary, in an environment like a mod's (no fs, network or process), exit 1 when a test fails; no session starts. A test file imports `test`, `expect`, `mock` from `claude-code/testing`; `test(name, async ($, on) => ...)` gets the engine's `$` and an `on` whose hooks sit beneath the plugin and answer for the engine (an `on('session.usage', () => ({ value: ... }))`, `on('fs.read', ...)`, `on('process.run', ...)`; an unanswered event throws at the bottom, which is what the fail-closed probe uses). A `tool.call` is raised with `$.tool.call({ tool: 'Write', file_path, content })` (Edit and Bash likewise), through the plugin's hooks and then the test's bottom hook; a `turn.step` with `$.turn.step({ turnId, index, model, messageCount })`, a stream whose bottom hook is an async generator.
**Sources.**

Verbatim, output of `claude plugin test --help` (build 2.1.288):

```text
Usage: claude plugin test [dir]

Run a mod's tests

Arguments:
  dir         The mod's folder (default: the current folder)

Options:
  -h, --help  Display help for command

Runs every *.test.ts and *.test.tsx under dir, each file in a child of this
binary, in an environment like the one the mod's hooks run in. A test file
imports its kit from 'claude-code/testing'. Exits 1 when a test fails.
```

Verbatim, a span of <skill-root>/reference.md:75:

```text
`claude plugin test <folder>` runs the plugin's `*.test.ts` files against the engine itself: a test holds the engine's `$` and an `on` whose hooks sit beneath the plugin
```

Verbatim, a span of <skill-root>/reference.md:75:

```text
`$.tool.call` raises `classic.PreToolUse` as a session does, beneath every plugin's `tool.call` hook and above the test's own, so a deny ends the call with the errored result a session's `tool.call` hooks see (`isError`, the reason as `text`; `{ deny }` to a plugin's own `$.tool.call`)
```

Verbatim, <skill-root>/types/claude-code.d.ts:14902-14913:

```text
  /**
   * One test: it passes when its body returns or resolves, and fails when it
   * throws, rejects or outlasts its time (5000 ms, or `timeoutMs`).
   *
   * The body gets the engine's `$` and an `on` whose hooks sit beneath every
   * plugin; `plugins` load inline plugins beside the one under test. A failure
   * carries what the engine reported meanwhile: each hook it skipped, and why.
   *
   * @param name the test's name, led in its title by the describes around it
   * @param rest the body, `($, on) => ...`, or the options then the body
   */
  export const test: (name: string, ...rest: TestRest) => void;
```

Verbatim, <skill-root>/types/claude-code.d.ts:11963-11970:

```text
  /**
   * `$.tool.call(input)`: resolves with `result` typed for the tool `input`
   * names (ToolCallResult), or loosely for an input that names none literally.
   */
  type ToolCallOverloads = {
      <T extends string>(input: ToolCallArgs & ToolNamed<T>): Promise<ToolCallResult<T>>;
      (input: ToolCallArgs): Promise<ToolCallResult>;
  };
```

**Probe** (probe/probe.test.ts, 8 tests, exit 1 by design: one is `PROBE-FAIL`, an `expect(1 + 1).toBe(3)`). Passing and failing probes in the same run:

Output of `claude plugin test probe` (sanitized):

```text

probe.test.ts:
(pass) G1 probe: force-push is denied by the plugin [88.11ms]
(pass) G1 probe: an ordinary push reaches the tool [42.44ms]
(pass) N1 probe: context line appended through the typed context field [42.61ms]
(pass) fail-closed probe: a hook that throws is refused by its catch [36.41ms]
(pass) agent identity probe: does $.tool.call carry agentId into a hook [37.61ms]
(pass) turn.step probe: usage rides the stop chunk and the result [49.71ms]
(fail) PROBE-FAIL: this test fails on purpose [1.18ms]
  AssertionError: expect(received).toBe()
  
  Expected: 3
  Received: 2
(pass) G3 probe: a Write that starts with the current bytes is allowed, other Writes refused [60.01ms]

 7 pass
 1 fail
Ran 8 tests across 1 file. [0.80s]
```

**What it means.** The test route covers every rule: refusal and allowed cases (G1 probes), a pure-append Write allowed and an overwrite refused with `fs.read` answered beneath (the `G3 probe`), fail-closed (an unanswered `process.run` makes the hook throw and its `.catch` denies), `turn.step` and N1. Limits to carry into the preregistration: the tests cannot run a real `$.fs`, `$.process` or scanner (the test environment has none), so G5's scanner call is proven only against a stubbed `process.run` answer; the real scanner stays under its own test suite, and one end-to-end run of the installed mod is a live-session item. The `agentId` probe passes `agentId` through a cast (`as never`), since `ToolCallArgs` does not list it; the hook saw it. Mutation recording is the next piece's job; none was run here.
## 6. Limits
**Answer.** Confirmed: hook budget `ms: 10_000`, `.catch` grace `catchMs: 1_000`, a streaming hook's budget counts only its own code, and the clock stops while a `next` or `$` call is in flight (a `$.clock` wait counts). A hook that throws, misreturns, or overruns is skipped and "the chain continues without it", unless its `.catch` answers in its place; "past it the hook is absent as if it had no handler", so a handler that returns `undefined` or runs over 1 s fails open. A denying `.catch` is `.catch(() => ({ deny: '<reason>' }))`; the handler is `($, e, next)` with `next.error: { kind: 'throw' | 'timeout', message?, budget }`; one `.catch` per registration, a second throws.
**Sources.**

Verbatim, <skill-root>/types/claude-code.d.ts:4804-4820:

```text
      /**
       * A hook's budget per dispatch, from its call to its return; past it the
       * hook is absent (its `.catch` asked, else `next(e)` run on its behalf).
       *
       * A streaming hook's (an async generator) counts only while its own code
       * runs, never at a `yield` or while it reads beneath: on `turn.step` the
       * sum over the response; on `process.spawn` per piece, anew at each pull.
       */
      readonly ms: 10_000;
      /**
       * A `.catch` handler's grace: a fresh budget from the moment it is called,
       * on the same clock (its `next` replay and its `$` calls are free).
       *
       * Past it the hook is absent as if it had no handler; `next.error.budget`
       * and `next.budget.ms` both read it there. `engine.create` has no budget.
       */
      readonly catchMs: 1_000;
```

Verbatim, <skill-root>/types/claude-code.d.ts:4831-4850:

```text
  /**
   * Why a hook failed, as its `.catch` handler reads it on `next.error`: plain
   * frozen data.
   *
   * `throw`: the hook threw, or returned what the site refuses, `message`
   * saying what; `timeout`: it outran its budget, `message` then what its last
   * `next()` rejected with, if it did. `budget` is the handler's own grace.
   */
  export type HookFailure = {
      readonly kind: 'throw' | 'timeout';
      /**
       * The thrown error's message, or for a timeout what the hook's last
       * `next()` rejected with; absent for a timeout with nothing rejected.
       */
      readonly message?: string;
      /**
       * The grace the handler runs under, in milliseconds; past it, the hook is
       * absent as if it had no handler.
       */
      readonly budget: number;
```

Verbatim, <skill-root>/types/claude-code.d.ts:8675-8691:

```text
  /**
   * What `on(...)` returns for a hook of type `F`: the registration, which
   * takes one `.catch` (CatchHandler); without it a failed hook is absent.
   *
   * A second `.catch` on one registration throws, as does one after
   * register() returned and one on `engine.create`, whose hook has no budget
   * and whose failure is the load's.
   */
  export type Registration<F> = {
      /**
       * Sets the handler run when the hook throws or overruns its budget; its
       * answer within the grace stands as the hook's result for the dispatch.
       *
       * The budget is HookBudget's `ms` and the grace its `catchMs`, both on
       * the clock that stops while the code waits on `next` or `$`.
       */
      readonly catch: (handler: CatchHandler<F>) => void;
```

Verbatim, <skill-root>/types/claude-code.d.ts:994-1002:

```text
  /**
   * The handler `on(...).catch(handler)` takes for a hook of type `F`: the
   * hook's `($, e, next)`, run afresh when it throws, misreturns or overruns.
   *
   * `next` carries `error` and `called` (Caught) and is replay-safe; a return
   * within the grace is the hook's result, `undefined` the hook absent. On a
   * streaming event the handler is a generator too, continuing the stream.
   */
  export type CatchHandler<F> = F extends ($: infer D, e: infer E, next: infer N) => infer R ? [R] extends [AsyncGenerator<unknown, unknown, unknown>] ? ($: D, e: E, next: N & Caught) => R : ($: D, e: E, next: N & Caught) => R | undefined | Promise<Awaited<R> | undefined> : never;
```

Verbatim, a span of <skill-root>/reference.md:72:

```text
A hook that fails is skipped and the chain continues without it, unless its registration's `.catch` handler
```

Verbatim, a span of <skill-root>/reference.md:124:

```text
A hook runs inside one dispatch with a budget of its own time (a `next` or `$` call in flight does not count; a `$.clock.sleep` does
```

**Probes.** (a) fail-closed on a throw: the `fail-closed probe` in section 5 (pass: the Write hook threw because `process.run` had no answer, its `.catch` denied, the test read `deny` matching `fail closed`). (b) Timeout: probe-timeout has a Glob hook that awaits `$.clock.sleep(60_000)` with `.catch` returning `{ deny: 'timeout -> deny; kind=...' }`, and a Grep hook with no `.catch`; the test harness's mocked clock holds the wait, so the budget ran out at about ten seconds of real time:

Output of `claude plugin test probe-timeout`, exit 0:

```text

t.test.ts:
(pass) timeout probe: an overrunning hook with a denying catch [10101.32ms]
(pass) timeout probe: an overrunning hook with no catch is skipped, the call runs [10060.02ms]

 2 pass
 0 fail
Ran 2 tests across 1 file. [20.58s]
```

First test: the overrun hook's `.catch` ran and denied after 10 084 ms. Second test: with no `.catch` the hook was skipped and the call ran (`deny` undefined), the fail-open case.
**What it means.** The brief's 10 s and 1 s are correct (<skill-root>/types/claude-code.d.ts:4812 and 4820). Every refusing hook needs a `.catch` whose body is one line, synchronous, returning a deny, with nothing that can fail inside it (a `$` call in the handler is free of the 1 s clock but can itself throw, and a throw there leaves the hook absent). A hung `$.process.run` does not trip the 10 s budget (the clock stops during `$` calls); it has its own 30 s default and 10 min ceiling, so every `$.process.run` in a refusing hook must pass a short `timeoutMs` (it rejects, the hook throws, the `.catch` denies). Keep (G1 to G6), with that rule added to the preregistration's design.
## 7. `claude plugin validate` lines, and the `$` calls each rule needs
**Answer.** The two lines are `  ❯ <module> hooks: <event>{<matcher>}, ...` and `  ❯ <module> calls: $.<noun>.<method>, ...` (or `calls: nothing on $`), printed under `Validating hooks: <path>`; `--json` carries the same two strings under `contents[].notes`. A hooks module cannot import a repository module: `validate` refuses an absolute path ("a hooks module imports its own files by relative path and \"claude-code\", nothing else") and a relative path out of the folder ("it is outside the plugin's folder"), and the module has no Node, which `scripts/hooks/profile-path-scan.mjs` needs (`node:fs`, `node:os`, `node:path`, `node:child_process`, `node:url` imports at its lines 16-20). So G5 runs the scanner through `$.process.run`, and the scanner takes content only from a file (`--message <file>`, `--staged`, `--range`, `--redact`): there is no stdin mode, so a G5 that scans a Write's new content needs the content on disk first.
**Sources.**

`claude plugin validate probe` (sanitized), exit 0:

```text
Validating plugin manifest: <probe-dir>\probe\.claude-plugin\plugin.json

⚠ Found 1 warning:

  ❯ author: No author information provided. Consider adding author details for plugin attribution

Validating hooks: <probe-dir>\probe\hooks\hooks.json

  ❯ ./register.ts hooks: tool.call{tool=Bash}, tool.call{tool=Write}, tool.call{tool=Edit}, agent.spawn, turn.step
  ❯ ./register.ts calls: $.fs.read, $.process.run, $.session.usage, $.store.set

✔ Validation passed with warnings
```

`claude plugin validate probe --json` (sanitized), exit 0:

```text
{
  "success": true,
  "strict": false,
  "target": "<probe-dir>\\probe\\.claude-plugin\\plugin.json",
  "manifest": {
    "file": "<probe-dir>\\probe\\.claude-plugin\\plugin.json",
    "type": "plugin",
    "errors": [],
    "warnings": [
      {
        "path": "author",
        "message": "No author information provided. Consider adding author details for plugin attribution",
        "code": null
      }
    ],
    "notes": []
  },
  "contents": [
    {
      "file": "<probe-dir>\\probe\\hooks\\hooks.json",
      "type": "hooks",
      "errors": [],
      "warnings": [],
      "notes": [
        "./register.ts hooks: tool.call{tool=Bash}, tool.call{tool=Write}, tool.call{tool=Edit}, agent.spawn, turn.step",
        "./register.ts calls: $.fs.read, $.process.run, $.session.usage, $.store.set"
      ]
    }
  ]
}
```

`claude plugin validate probe-import`, three variants of the import (sanitized), the first two exit 1, the third (a `$.process.run` form) exit 0:

```text
--- variant: absolute import of the repository scanner
✘ Found 1 error:
  ❯ modules../register.ts: probe-import: cannot import "C:/dev/spatial-ide/scripts/hooks/profile-path-scan.mjs" (from hooks\register.ts): a hooks module imports its own files by relative path and "claude-code", nothing else
✘ Validation failed
rc=1
--- variant: relative import leaving the plugin folder
✘ Found 1 error:
  ❯ modules../register.ts: probe-import: cannot import "../../../../../../../../dev/spatial-ide/scripts/hooks/profile-path-scan.mjs" (from hooks\register.ts): it is outside the plugin's folder (<probe-dir>\probe-import)
✘ Validation failed
rc=1
--- variant: scanner through process.run
  ❯ ./register.ts hooks: tool.call{tool=Write}
  ❯ ./register.ts calls: $.fs.write, $.process.run
✔ Validation passed with warnings
rc=0
```

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

Verbatim, <skill-root>/types/claude-code.d.ts:3016-3034:

```text
          /**
           * Reads a file and returns its text, or with `{ as: "bytes" }` its bytes
           * as `{ base64 }`.
           *
           * Rejects when missing, or over 4 MiB, which bounds what one read copies
           * into the plugin's environment. A file the plugin ships is under
           * `$.plugin.root`.
           *
           * @param path relative to the working directory, or absolute
           * @param options `as`: `"text"` (the default) or `"bytes"`
           * @returns the file's text, or `{ base64 }`
           * @example
           * const readme = await $.fs.read("README.md")
           * @example
           * const { base64 } = await $.fs.read(
           *   `${$.plugin.root}/hooks/weights.bin`, { as: "bytes" })
           * const weights = Uint8Array.fromBase64(base64)
           */
          read: FsReadCall;
```

scripts/hooks/profile-path-scan.mjs at lines 16-20 of the working tree on 2026-10-03 (read only; imports `node:fs`, `node:os`, `node:path`, `node:child_process`, `node:url`) and its `main()` branches `--staged`, `--message`, `--range`, `--redact`, `--redact-segment` (lines 628-686): the file is named here as a repository path read for this record, not hashed, because the repository file is not a skill-root file.

**The calls each need would appear as on the `calls:` line:**

| Need | Rule | Call on the `calls:` line | Note |
|---|---|---|---|
| Read a file's current bytes (text) | G3, G4, N1 (`flushed_at`) | `$.fs.read` | rejects over 4 MiB: a large file makes the hook throw, so the `.catch` denies (G3 over-refuses there); `{ as: 'bytes' }` gives `{ base64 }` |
| Does the file exist (G4 refuses only an existing file) | G4 | `$.fs.exists` (or `$.fs.stat`) | a failed stat for a new file must not read as a throw |
| Resolve a path to compare with a protected path or report path | G2 to G4, G6 | `$.fs.stat` with `{ resolve: true }`, and `$.session.root` | the build's guard example treats a spelling deny-list as best effort |
| The brief-declared report path | G6 | route A: `$.store.set`, `$.store.get`, with an `agent.spawn` hook; route B: `$.session.messages`, `$.agent.list` | see section 1; no file read needed |
| Run `git` | G1 | none, if the command string is parsed | N1's "newest ledger commit" needs `$.process.run` (`git log`) |
| Run the profile-path scanner (own matcher, not a copy) | G5 | `$.process.run`, plus `$.fs.write` for the scratch file the scanner's `--message` mode reads | interface gap: no stdin mode; the scratch file is a write by the mod, outside "only refuses" unless declared; the alternative is a new scanner CLI mode, which is a change to a repository script and belongs to its own piece |
| Context fill | N1 | `$.session.usage` | no `turn.step` hook |
| Once per 10 points | N1 | `$.store.get`, `$.store.set` | a module variable is lost on a hot reload |

**What it means.** The hooks line v0 needs: `tool.call{tool=Bash}`, `tool.call{tool=Write}`, `tool.call{tool=Edit}` (and, for G6 route A only, `agent.spawn`); `turn.step` is not needed. The calls line is the union of the table; it is wider than the brief's "reads and `git` calls" by `$.fs.write` (G5), `$.store.*` and `$.session.usage` (N1), `$.agent.list` or `agent.spawn` (G6). The preregistration must declare each, or drop the rule that needs it. Coverage limit found while reading the Bash input type: G2, G3, G4, G5 guard the Write and Edit tools only; a Bash command (`sed -i`, a redirect, `tee`) writes the same files and is untouched by those rules unless G1's string parsing is extended to writes; this limit holds for the existing write-audit backstop too and should be stated as scope, not found later.
## Final: sha256 of each cited `<skill-root>` file, and the commands run
```text
ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4  <skill-root>/reference.md
36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1  <skill-root>/types/claude-code.d.ts
```

Commands, each with its exit code (probe directories are in the scratch directory; `<probe-dir>` stands for it). Every command ran under `timeout`.

| # | Command | Exit |
|---|---|---|
| 1 | `claude --version` | 0 |
| 2 | `claude plugin --help` | 0 |
| 3 | `claude plugin validate --help` | 0 |
| 4 | `claude plugin test --help` | 0 |
| 5 | `claude plugin install --help` | 0 |
| 6 | `claude plugin marketplace --help` | 0 |
| 7 | `claude plugin marketplace add --help` | 0 |
| 8 | `claude plugin enable --help`, `disable --help`, `uninstall --help`, `list --help`, `marketplace list --help` | 0 each |
| 9 | `claude plugin validate <probe-dir>/probe` with `"modules": "./register.ts"` (string) | 1 (expected: the finding quoted in section 4) |
| 10 | `claude plugin validate <probe-dir>/probe` after `"modules": ["./register.ts"]`; repeated with `--json` | 0, 0 |
| 11 | `claude plugin test <probe-dir>/probe` (first run, `session.usage` answered without `{ value }`) | 1 (two probes failed on the harness setup; fixed; `PROBE-FAIL` also fails by design) |
| 12 | `claude plugin test <probe-dir>/probe` (after the fix; again after adding the G3 probe) | 1, 1 (only `PROBE-FAIL` fails, by design) |
| 13 | `claude plugin test <probe-dir>/probe-timeout` | 0 |
| 14 | `claude plugin validate <probe-dir>/probe-timeout` | 0 |
| 15 | `claude plugin validate <probe-dir>/probe-import`, three variants | 1, 1, 0 |
| 16 | `claude plugin validate <probe-dir>/probe-market` (text and `--json`) | 0, 0 |
| 17 | `claude plugin validate <probe-dir>/probe-js` | 0 |
| 18 | `claude plugin validate <probe-dir>/probe-modstr` | 1 (expected) |
| 19 | `sha256sum`-equivalent over the cited skill-root files, by a Node script | 0 |

Every `claude` command ran under `timeout` (30 to 200 s). Rows 11, 12 and 15 are repeats whose output sections are quoted above in their final form.

Hard limits: no `plugin install`, `enable`, `marketplace add`, `init`/`new`, `update`, `configure`, `eval` was run; no Claude session was started; nothing was written under the Claude profile folder or in the repository; the only writes are the scratch directory's files. Probe test names carrying PROBE are throwaway and were never installed.
