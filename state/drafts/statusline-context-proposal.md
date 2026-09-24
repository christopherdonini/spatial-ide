# Status-line context reading — proposal for the human's user-level settings (entry 118 item 3)

Drafted 2026-09-24 by the custodian, for the human to apply or decline. Nothing is applied: the
`statusLine` key lives in the human's own `~/.claude/settings.json`.

## What the installed version provides (verified, not assumed)

Installed: Claude Code 2.1.282 (`claude --version`). The status-line input schema embedded in that
binary (`~/.local/bin/claude`, the text the `statusline-setup` agent is given) carries a
`context_window` object:

- `total_input_tokens`: input tokens currently in the context window (including cache reads and writes)
- `total_output_tokens`: output tokens from the most recent API response
- `context_window_size`: the context window size for the current model
- `current_usage`: the last API call's token usage; `null` if no messages yet
- `used_percentage` / `remaining_percentage`: 0-100, `null` if no messages yet

The same binary computes the percentages in code (`used_percentage:r.used,remaining_percentage:r.remaining`).
The 2026-09-20 check found the same six fields on 2.1.272 (DECISIONS-PENDING, entry 118's RULED block,
"Context measurement").

Open until the first reading: whether `context_window_size` for this 1M-context model is the model's
window or the 800k auto-compact window `/context` reports. Compare one reading against `/context`
before the percentage is trusted.

## The proposal

1. Save this script as `~/.claude/statusline-context.mjs`:

```js
// Status line: prints the context figure; in a project that already has .claude/state/, also writes
// .claude/state/context-<session_id>.json for the custodian to read at each flush. Missing data is
// recorded as null (unknown), never zero. Never creates directories outside an existing .claude/state/.
import fs from 'node:fs';
import path from 'node:path';

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(raw); } catch { /* unreadable input: everything unknown */ }
  const c = j.context_window ?? {};
  const rec = {
    read_at: new Date().toISOString(),
    session_id: j.session_id ?? null,
    version: j.version ?? null,
    context_window_size: c.context_window_size ?? null,
    total_input_tokens: c.total_input_tokens ?? null,
    total_output_tokens: c.total_output_tokens ?? null,
    current_usage: c.current_usage ?? null,
    used_percentage: c.used_percentage ?? null,
    remaining_percentage: c.remaining_percentage ?? null,
  };
  const dir = path.join(j.workspace?.project_dir ?? j.cwd ?? '.', '.claude', 'state');
  try {
    if (rec.session_id && fs.statSync(dir).isDirectory()) {
      fs.writeFileSync(path.join(dir, `context-${rec.session_id}.json`), JSON.stringify(rec));
    }
  } catch { /* no .claude/state/ here: print only */ }
  const u = rec.used_percentage;
  process.stdout.write(u == null ? 'ctx: unknown' : `ctx ${u}% (${rec.total_input_tokens} of ${rec.context_window_size})`);
});
```

2. Add to `~/.claude/settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "node C:/Users/Christopher/.claude/statusline-context.mjs"
}
```

In this repository `.claude/state/` exists and is gitignored (`.gitignore`'s `.claude/state/` rule),
so the reading never enters the tree. In any other project without that directory the script only
prints.

## What changes for the custodian once applied

At each flush the custodian reads `.claude/state/context-<session_id>.json` and records the figure
with its `read_at` in the SESSION-CONTINUITY block. A `null` is recorded as unknown. Until the file
exists, each flush records `context: unmeasured`.
