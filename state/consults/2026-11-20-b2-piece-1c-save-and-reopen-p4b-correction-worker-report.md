*Filed by the custodian: the P4b worker's hand-back on its correction brief (claude-sonnet-5-5), 1777 bytes, sha256 63703f60e5f4a3d9bda9f6549e384844ae70d7f0986d1ef019bd99b21654ba53, below the rule as it came, with one final newline added. Calls Bash 4, Write 1, SubagentHandback 1, none errored, by unique call ids, from 2026-11-20T18:14:05Z to 2026-11-20T18:15:17Z by its transcript. The commit 0c74eeab, pushed, on 441e2346: one hunk in second-open.mjs, as ADV-2026-11-20-21 item 1 (a) to (c) asks, checked by the custodian against the diff. The record is its transcript.*

---

Corrected: b2-piece-1c-save-and-reopen P4b, worker

Result: One commit, 0c74eeab, makes E-SECOND's failure line give the log's path and the bytes it read. It is pushed, with no build, app launch or e2e run.

- Start state: HEAD was 441e2346984690addbd6ae01c8682f785390e758, and `git status --porcelain` showed only `frontends/shell/e2e/second-open.mjs` changed.
- `node --check frontends/shell/e2e/second-open.mjs`: exit 0.
- Diff, whole: one hunk in `releaseLineIn`, nothing else.
  - The doc comment now says the function reports the bytes this run could read, cut as bytes and then decoded.
  - `readFileSync(APP_LOG, "utf8").slice(fromByte)` became `readFileSync(APP_LOG).subarray(fromByte)`, so the byte offset is no longer used as an index into decoded text.
  - A new first return handles zero bytes: "<log> gave 0 bytes: the log is empty, so the suite cannot tell from it whether the line "..." was written".
  - Otherwise it decodes and returns "<log> gave N bytes: the line "..." is in / not in those bytes".
  - The unreadable-log catch is unchanged.
- Commit: 0c74eeab7e0c100a5a193e5109e272025ca43bb6. Its body says the E-SECOND mutation run found it: the line read "not in A's log" while `app.log` was 0 bytes. It ends with the two trailers. I typed no Signed-off-by line; git added the sign-off through `-s`.
- Counts against 4d34eaae5b25ac40d76eae1a4af323de1455911c (e2e group ceiling 425):

| File | In | Out |
|---|---|---|
| `e2e/README.md` | 12 | 0 |
| `e2e/lib.mjs` | 59 | 0 |
| `e2e/second-open.mjs` | 194 | 0 |
| `package.json` | 1 | 0 |
| Total | 266 | 0 |

- Push: `441e2346..0c74eeab  cut/b2-piece-1c-p4b -> cut/b2-piece-1c-p4b`. I did not fetch.
- Departures: none. I ran no reset, amend or rebase.
- Model: claude-sonnet-5-5, as the harness gives it.
