#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Audits a subagent's transcript for writes outside its brief. Specified by
// scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md. Node standard library only.
//
// usage: node scripts/hooks/subagent-write-audit.mjs <agent id | transcript path>
//          <allowed report path | NONE> [--session <id>]
//
// Does: reads every tool_use in the transcript JSONL and prints one JSON object
// {verdict, allowed, toolCounts, writeCalls, voids}. PASS iff every Write, Edit, MultiEdit and
// NotebookEdit call targets exactly the allowed path (backslashes normalised to slashes, case
// folded; none allowed under NONE) and no Bash or PowerShell call appears. A missing or empty
// transcript, or zero tool calls parsed, is VOID. Exit 0 PASS, 1 VOID, 2 usage error.
// An agent id (a followed by 16 hex digits) resolves to
// <home>/.claude/projects/<slug>/<session>/subagents/agent-<id>.jsonl; the slug is the main
// checkout's path (the parent of `git rev-parse --git-common-dir`, so a worktree resolves to its
// main checkout; the script's own repository root if git fails) with every character outside
// [A-Za-z0-9] replaced by "-", and the session comes from --session or CLAUDE_CODE_SESSION_ID.
//
// Does not: write anything, touch the network, export anything, or inspect git state (the
// ruling's secondary checks stay the custodian's procedure). It cannot see a write made through a
// shell, which is why any shell call voids the run.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WRITE_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'];
const SHELL_TOOLS = ['Bash', 'PowerShell'];

function usage() {
  console.error(
    'usage: subagent-write-audit.mjs <agent id | transcript path> <allowed report path | NONE> [--session <id>]',
  );
  process.exit(2);
}

const positional = [];
let session = process.env.CLAUDE_CODE_SESSION_ID;
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--session') {
    session = argv[++i];
    if (!session) usage();
  } else positional.push(argv[i]);
}
if (positional.length !== 2) usage();
const [idOrPath, allowedArg] = positional;

let transcript = idOrPath;
if (/^a[0-9a-f]{16}$/.test(idOrPath)) {
  if (!session) usage();
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  let root = path.resolve(scriptDir, '..', '..');
  try {
    const common = execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd: scriptDir, encoding: 'utf8' }).trim();
    root = path.dirname(path.resolve(scriptDir, common));
  } catch {
    // git unavailable: keep the script's own repository root
  }
  const slug = root.replace(/[^A-Za-z0-9]/g, '-');
  const home = process.env.USERPROFILE || process.env.HOME;
  transcript = path.join(home, '.claude', 'projects', slug, session, 'subagents', `agent-${idOrPath}.jsonl`);
}

const norm = (p) => String(p || '').replace(/\\/g, '/').toLowerCase();
const allowed = allowedArg === 'NONE' ? null : norm(allowedArg);

function finish(report, code) {
  console.log(JSON.stringify(report, null, 1));
  process.exit(code);
}

if (!fs.existsSync(transcript) || fs.statSync(transcript).size === 0) {
  finish({ verdict: 'VOID', allowed: allowed ?? 'NONE', toolCounts: {}, writeCalls: [], voids: ['transcript missing or empty'] }, 1);
}

const toolCounts = {};
const writeCalls = [];
const voids = [];
for (const line of fs.readFileSync(transcript, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  const content = obj?.message?.content;
  if (!Array.isArray(content)) continue;
  for (const item of content) {
    if (item?.type !== 'tool_use') continue;
    toolCounts[item.name] = (toolCounts[item.name] || 0) + 1;
    const input = item.input || {};
    if (WRITE_TOOLS.includes(item.name)) {
      const target = norm(input.file_path || input.notebook_path);
      writeCalls.push(`${item.name} -> ${target}`);
      if (allowed === null || target !== allowed) voids.push(`${item.name} targets ${target}`);
    } else if (SHELL_TOOLS.includes(item.name)) {
      voids.push(`${item.name} call (a shell can write anywhere)`);
    }
  }
}
if (Object.keys(toolCounts).length === 0) voids.push('zero tool calls parsed: the audit saw nothing');

const verdict = voids.length === 0 ? 'PASS' : 'VOID';
finish({ verdict, allowed: allowed ?? 'NONE', toolCounts, writeCalls, voids }, verdict === 'PASS' ? 0 : 1);
