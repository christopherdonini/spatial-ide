// Guardian v0, N1's staleness judgment (GUARDIAN-V0-PREREGISTRATION.md §2.8a). Pure: no import, no
// `$` call, one export. Node imports it in the parity test as well as the engine in a session.
//
// A mod cannot import a repository file, so the Stop hook's predicate is restated here, step for
// step. Its sources are the stop-queue hook's judgeContinuity (scripts/hooks/stop-queue.mjs) and
// the block parser parseSessionContinuity (scripts/hooks/precompact-flush.mjs). Only the log
// format is narrowed to %H. The parity test (scripts/hooks/guardian-continuity-parity.test.mjs)
// holds the two together: a change to either predicate is made with the other, in the same piece.

const LEDGER = 'state/CUT-STATE.md';

// The block parser's reading of flushed_at, restated: the first `## SESSION-CONTINUITY` line after
// a split on \r\n|\r|\n, scanned to the next heading, the value trimmed. null when the block, or
// its flushed_at, is absent or empty.
function flushedAtOf(text) {
  const lines = text.split(/\r\n|\r|\n/);
  const idx = lines.findIndex((l) => l.trim() === '## SESSION-CONTINUITY');
  if (idx === -1) return null;
  let flushedAt = null;
  for (let i = idx + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) break;
    const fm = lines[i].match(/^flushed_at:\s*(.+)$/);
    if (fm) flushedAt = fm[1].trim();
  }
  return flushedAt || null;
}

// One git call, trimmed; null when it is unreadable: `run` rejects, the exit code is not 0, or
// stdout was truncated.
async function readGit(run, args) {
  let result;
  try {
    result = await run(args);
  } catch {
    return null;
  }
  if (result === undefined || result === null) return null;
  if (result.exitCode !== 0 || result.isStdoutTruncated === true) return null;
  return String(result.stdout).trim();
}

/**
 * `run(args)` runs git with `args` and resolves { exitCode, stdout, stderr, isStdoutTruncated,
 * isStderrTruncated }. Returns { judged: false } or { judged: true, stale }.
 */
export async function judgeContinuity(run) {
  const c = await readGit(run, ['log', '-1', '--format=%H', 'HEAD', '--', LEDGER]);
  if (c === null) return { judged: false };
  if (c === '') return { judged: true, stale: false };

  const blob = await readGit(run, ['show', `${c}:${LEDGER}`]);
  if (blob === null) return { judged: false };
  const current = flushedAtOf(blob);
  if (current === null) return { judged: false };

  const parentBlob = await readGit(run, ['show', `${c}^1:${LEDGER}`]);
  if (parentBlob === null) return { judged: true, stale: false };
  const parent = flushedAtOf(parentBlob);
  if (parent === null) return { judged: true, stale: false };

  return { judged: true, stale: current === parent };
}
