*Custodian's filing note (2026-10-05): `compaction-record-and-resume-line`'s P0 (the form's §6, item 1), read-only, by the worker-high on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 27c87d34013022a89ef79b52b28333b4a94ce07cb5ca6cfb454b1935add0b0e6. Write audit: zero Write or Edit calls (tool calls Read 2, Bash 12, SubagentHandback 1). Run window from the transcript: 2026-10-05T21:26:12.926Z to 2026-10-05T21:27:53.874Z. It is recorded as the form's Amendment 1 (class 1).*

---

# compaction-record-and-resume-line — P0 against Claude Code 2.1.289

Read-only throughout. I wrote no file and ran no `claude` command except `claude --version`. I created only the scratchpad folder `pieceA-p0/`, which I did not use. I read the form whole first (§0, §6 item 1, §5 I1).

## 1. `claude --version` (once, under `timeout 30`)
Output, verbatim from the command: `2.1.289 (Claude Code)`, exit 0.

`command -v claude` resolved to `<profile>/.local/bin/claude`, a native `claude.exe` of about 250 MB. There is no npm package beside it, so there are no `.d.ts` files in an installed package for the running build.

## 2. Where I looked and what I found
Each finding is labelled with its build (round 15 (c)).

**A. `<skill-root>/types/claude-code.d.ts`**
- Build: the file's own line 1 says "Written by Claude Code 2.1.288". It is the 2.1.288 bundled-skill copy, not the running 2.1.289.
- **Not shipped with the installed build:** `claude --version` reads 2.1.289, and the 2.1.289 sibling has no such file (see D).
- Header (verbatim, lines 1-2): `// Written by Claude Code 2.1.288.` / `// Claude Code function hooks: the plugin API's TypeScript declarations.`
- **The PreCompact hook input is declared**, and it is the settings-hook (classic) stdin type, not only the mod API:
  - Lines 7417-7421 (verbatim; line 7418 is `hook_event_name: 'PreCompact';`, line 7420 is `custom_instructions: string | null;`):
    - line 7417: `type PreCompactHookInput = BaseHookInput & {`
    - line 7419: `trigger: 'manual' | 'auto';`
  - Lines 1088-1092 type what a classic (settings) hook receives on stdin, per event name. `PreCompactHookInput` is a member of the `HookInput` union (line 4863). Verbatim:
    - line 1088: `* What a classic hook receives on stdin for each event, by event name: the`
    - line 1091: `export type ClassicHookInputs = {`
    - line 1092: `[I in HookInput as I['hook_event_name']]: I;`
  - Line 7330, in `PostCompactHookInput`, has `trigger: 'manual' | 'auto';`.
- Mod API, a different type: line 10171 reads `export type SessionCompactTrigger = 'manual' | 'auto' | 'plugin' | 'precompute';`.
  - It types `session.compact` for mods (lines 10112-10115).
  - Lines 10152-10154 say that a veto "Core answers it too, when a classic PreCompact hook blocks".
  - This is not the settings-hook stdin. No mod is loaded or installed by this check.

**B. The installed `claude.exe` itself**
- Build: 2.1.289, the file `command -v claude` resolves to (modified Oct 4 10:53). I read its embedded JavaScript text with `grep -a`.
- Embedded input schema (verbatim, one fragment): `PreCompact"),trigger:j(["manual","auto"]),custom_instructions:o().nullable()}))`.
- The matching `PostCompact` schema is `trigger:j(["manual","auto"])`.
- Embedded hook documentation (verbatim): `| PreCompact | "manual"/"auto" | Before compaction |`.
- Embedded matcher metadata (verbatim): `matcherMetadata:{fieldToMatch:"trigger",values:["manual","auto"]`.
- The runner builds the stdin object as (verbatim): `hook_event_name:"PreCompact",trigger:n.trigger,custom_instructions:n.customInstructions` with `matchQuery:n.trigger`.
- Every call of that runner I found passes a literal `trigger`: `"auto"` (reactive and precomputed paths) or `"manual"` (the `/compact` path). I saw no other value passed to the classic hook. The values `"plugin"` and `"precompute"` appear only in the mod and compaction-engine paths, and the precompute path calls the classic hook with `"auto"`.
- Exit codes (verbatim from the embedded text): `Exit code 2 - block compaction`. Other exit codes continue with compaction.

**C. SDK or package declarations elsewhere on the machine**
- Nothing found: no `@anthropic-ai/claude-agent-sdk` and no `sdk.d.ts` or `sdk-tools.d.ts`. I searched `C:/dev` (incl. the repository), `<profile>/AppData/Roaming`, `<profile>/AppData/Local/Programs` and `<profile>/.local` to the depths shown in the command list.
- The global npm root (`npm root -g`) is `<profile>/AppData/Roaming/npm/node_modules`, which does not exist.
- The older `claude.exe.old.*` in `<profile>/.local/bin` was not examined.

**D. The 2.1.288 and 2.1.289 skill trees**
- `<skill-root>` is `.../bundled-skills/2.1.288/16e75ddb0deead983951dbbf6b044ef9/plugin-authoring`.
- A second 2.1.288 tree, hash `a78bdae9a929b85b7800488dc8d5c189`, also holds `plugin-authoring/types/claude-code.d.ts`. `cmp` shows it byte-identical to the one in A, with the same "Written by Claude Code 2.1.288" header.
- The 2.1.289 sibling (`bundled-skills/2.1.289/74f4e2d81dca70cefdd9313542846792`) contains only `claude-api/`. It has no `plugin-authoring` and no `.d.ts` for the hook input, so nothing was found there.

## 3. Decision for the form (I1)
- **No declaration contradicts §0 items 1 to 3. I1 does not trip.**
- The settings-hook PreCompact stdin declares `trigger` with exactly `'manual' | 'auto'`, in 2.1.288's `.d.ts` (A) and in 2.1.289's embedded schema and runner (B). `custom_instructions` is `string | null`.
- The 2.1.289 evidence is the embedded text of the running binary, not a shipped `.d.ts`.
- This is a declaration, not a live stdin observation. The form proceeds on §0 items 1 to 3 with E1 as the proof, as §6 says.
- One note for the architect: `'plugin'` and `'precompute'` exist only in the mod API's `SessionCompactTrigger`. No loaded mod is involved, and the classic hook is not called with those values in the callers I found. The form's "any other value or absent is non-manual" rule covers them anyway.

## 4. Commands run (exit codes)
Where a command was piped, the exit code is the last stage's unless stated.
1. `mkdir -p <scratchpad>/pieceA-p0/`: 0
2. `timeout 30 claude --version`: 0
3. `timeout 10 bash -c 'command -v claude'`: 0
4. `ls` of `bundled-skills/` and its children: 0
5. `find` under `bundled-skills/2.1.288` and `2.1.289` (`-maxdepth 4`, and for `.d.ts` and `.md`): 0. `ls -la <profile>/.local/bin/`: 0
6. `grep -rn -i "precompact\|trigger"` over the plugin-authoring tree: 0 (via `head`)
7. `sed -n` ranges over `claude-code.d.ts` (several calls): 0
8. `cmp` of the two 2.1.288 `claude-code.d.ts` files: 0
9. `grep -n` over `claude-code.d.ts` (several calls): 0
10. `timeout 60 bash -c 'npm root -g; ls "$(npm root -g)"; ls <profile>/AppData/Roaming/npm'`: `npm root -g` exited 0. The two `ls` calls failed with "No such file or directory". The wrapper exited 0.
11. `find` for `claude-agent-sdk`, `claude-code` and `sdk` dirs under `@anthropic-ai` in the five roots: 0 (via `head`), nothing found
12. `find /c/dev <profile>/AppData/Roaming <profile>/AppData/Local/Programs -maxdepth 6` for `sdk.d.ts`, `sdk-tools.d.ts` and `claude-agent-sdk*`: 0, nothing found
13. `grep -a -o -E "PreCompact.{0,160}"` over `claude.exe`: 0. Four further `grep -a` extractions over the same file (the runner, the description, the callers, the doc-table row) were piped through `head` or `cut`, and I did not record their exit codes. All returned output.

Result: P0 recorded against 2.1.289. The PreCompact stdin declares `trigger: 'manual' | 'auto'` in 2.1.288's `.d.ts` and in 2.1.289's embedded schema, so I1 does not trip.
Stop: none.
