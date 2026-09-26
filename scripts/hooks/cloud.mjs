// scripts/hooks/cloud.mjs — the cloud-session marker the custodian's hooks exit on (RULED
// 2026-09-25, the cloud hooks, item (1); HOOKS-CLOUD-INERT-PREREGISTRATION.md).
//
// The marker, quoted from https://code.claude.com/docs/en/cloud-environments (fetched 2026-09-25):
// "The `CLAUDE_CODE_REMOTE` check is what scopes the install to cloud sessions: the session VM's
// environment carries that variable as `true`, it's never `true` locally" — and, on hooks: "To skip
// local execution, exit early unless the `CLAUDE_CODE_REMOTE` environment variable is `true`". The
// hooks here do the inverse: they are the custodian's, so they exit early when it IS `true`. The
// documented example script exits without reading stdin; so do these.

export const CLOUD_SESSION_MARKER = 'CLAUDE_CODE_REMOTE';

export function isCloudSession(env = process.env) {
  return env[CLOUD_SESSION_MARKER] === 'true';
}
