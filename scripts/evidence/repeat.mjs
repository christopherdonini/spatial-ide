#!/usr/bin/env node
// scripts/evidence/repeat.mjs -- the repeat-runner (EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md section
// 2.2): runs one command n times in sequence, with no shell, and says how each run ended.
//
//   node scripts/evidence/repeat.mjs <n> -- <command> [<arg>...]
//
// <n> matches ^[1-9][0-9]*$ and is a safe integer. The first `--` after <n> is the separator; every
// token after it is the command's argv, passed as given (a later `--` included). The working
// directory and the environment are inherited. After each run it prints `run <i>/<n> exit=<result>`
// to stdout, where <result> is the exit status, `signal:<NAME>`, or `spawn-error:<code>`; a run
// fails unless its result is 0. It ends with `summary runs=<n> failed=<k>` and exits 0 when k is 0,
// else 1. A malformed call prints one usage line to stderr, runs nothing, and exits 2.
//
// It never retries, runs in parallel, stops early, uses a shell, reads or judges a child's output,
// parses env or `timeout` words, or special-cases an executable. Node standard library only.

import { spawnSync } from 'node:child_process';

const N_PATTERN = /^[1-9][0-9]*$/;
const USAGE = 'usage: node scripts/evidence/repeat.mjs <n> -- <command> [<arg>...]';

function parse(args) {
  const [n, separator, ...command] = args;
  if (n === undefined || !N_PATTERN.test(n) || !Number.isSafeInteger(Number(n))) return undefined;
  if (separator !== '--' || command.length === 0) return undefined;
  return { n: Number(n), command };
}

function resultOf(ran) {
  if (ran.error !== undefined) return `spawn-error:${ran.error.code ?? 'UNKNOWN'}`;
  if (ran.status === null) return `signal:${ran.signal}`;
  return String(ran.status);
}

function main(args) {
  const call = parse(args);
  if (call === undefined) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const [executable, ...rest] = call.command;
  let failed = 0;
  for (let i = 1; i <= call.n; i++) {
    const ran = spawnSync(executable, rest, { shell: false, stdio: 'inherit' });
    if (ran.status !== 0) failed += 1;
    process.stdout.write(`run ${i}/${call.n} exit=${resultOf(ran)}\n`);
  }
  process.stdout.write(`summary runs=${call.n} failed=${failed}\n`);
  return failed === 0 ? 0 : 1;
}

process.exitCode = main(process.argv.slice(2));
