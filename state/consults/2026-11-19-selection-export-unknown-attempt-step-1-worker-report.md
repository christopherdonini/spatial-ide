Built: selection-export-unknown-attempt step 1, worker (the custodian's filing note, 2026-11-19: the Sonnet worker, model claude-sonnet-5-5, its run 2026-11-19T00:41:45Z to 00:44:24Z by its transcript, Bash 14, Read 1, none errored; 6512 bytes, sha256 d4ec2a1127bf9fdde182d875f6b4579efac965d96596f3432b63c98974be5a3c; below byte for byte, with this note and one final newline)
Result: Reading settles (a) by elimination and (b) clearly. The page's own answer is the place (a) points to, and a person cannot reach the window (outcome 1 of the form: step 2 would make the suite wait). The logs cannot show (a) directly. (e) No log of either run names the web view runtime's version.

Read: the form, ADV-2026-11-18-05 and -07, both reports, `selection.mjs` 540-700, `publish.mjs` 360-376, and the README's selection entry (line 754). ADV-2026-11-19-03 is not on `origin/main` after `git fetch` (rc 0). I read it from the main checkout's staged copy; it only places the step.
HEAD f5584f28, porcelain empty; all line numbers are from the worktree files.

(a) Which place answered
- Page, `frontends/shell/src/publish/PublishPanel.tsx`, `runExecute`:
  - 546: `  async function runExecute(typedPhrase: string): Promise<ExecuteOutcome> {`
  - 547: `    const attemptId = attemptIdRef.current;`
  - 548-549: `    if (attemptId === null) {` / `      return { status: "unknown-attempt" };`
- The ref is written only in a passive effect:
  - 534-535: `  useEffect(() => {` / `    attemptIdRef.current = state.kind === "dialog" ? state.attemptId : null;`
  - 536: `  }, [state]);`
- The prepare's promise resolves before that effect:
  - 479-480: `    setState(nextStateFromPrepareOutcome(outcome));` / `    return outcome;`
- The hook is registered at 578: `    registerE2eHook("publishExecute", (typedPhrase: string) => runExecute(typedPhrase));`
- The suite's execute sends at once:
  - `selection.mjs:581`: `    const prepared = await prepareExport(page, freshDestination(`export-selected-${selected}`));`
  - `selection.mjs:583`: `    const executed = await executeExport(page, prepared.prompt);`
  - `selection.mjs:565`: `const executeExport = (page, prompt) => pairEvaluate(page, "execute", (p) => window.__SPATIAL_E2E__.publishExecute(p), basename(prompt.destination_display));`
  - Nothing sits between 581 and 583 that waits.
- The publish suite waits first, `publish.mjs:371`: `  await waitForHook(page, "publishExecute");`
- Host places, `src-tauri/src/commands.rs`:
  - 505-506: `    match result {` / `        None => Ok(ExecuteOutcome::UnknownAttempt),`
  - It is reached only when the id is already running (`publish.rs:1242`: `    if !running.try_insert(key.to_string(), cancel.clone()) {`).
- Host places, `src-tauri/src/publish.rs`:
  - 787-788: `    let Some(pending) = store.take(attempt_id) else {` / `        return ExecuteOutcome::UnknownAttempt;`
  - `take` (235-240) misses on an absent id, an id taken before, or an id older than the TTL.
- Why the host does not fit:
  - The hook's id is the ref's id. It is fresh per prepare and inserted at `publish.rs:705` before the prompt returns.
  - A host miss needs a prior take, a TTL expiry (the reports show U at most 14160 ms against T 600000 ms), or another process (the store dies with the process, `publish.rs:210-213`).
  - For the first export (Selected 1) the ref is null from the start; for the second, the earlier success sets state "succeeded", which nulls it. So no stale id can be held.
  - The page null-check fits every failure: execute sent at L 0ms, no intent row, empty destination.
- What the logs cannot do:
  - The diagnosis report's own words: "Neither path writes a log line, so these runs do not tell condition 1 from 3(a)."
  - The runs' `app.err.log` copies hold no publish line.
  - So the read is by elimination, not by a logged line.
- If one run is wanted to close it: log at `runExecute`'s line 549 and at `publish.rs:788`, or read the action console. `client.ts:23` is `  const entry = recordNamed("binding-command", "binding_publish_execute");`, so a failed execute with no such row means the page answered. The host's `take` miss would leave a row.

(b) Can a person reach the execute in that window
- Chain:
  - The panel renders the dialog from state, not the ref, `PublishPanel.tsx:739-743`: `      {state.kind === "dialog" && (` / `        <PublishDialog` / `          attemptId={state.attemptId}` / `          prompt={state.prompt}` / `          execute={execute}`
  - It receives the staged-scope path at 612: `          execute={executeInStagedScope}`
  - The dialog's Submit calls `PublishDialog.tsx:209`: `    void settleExecuteOutcome(submitPublishAttempt(attemptId, typedPhrase, { execute })).then((outcome) => {`
  - Its `attemptId` is the prop, line 182, not the ref.
  - `executeInStagedScope` (513-516) calls `publishExecute(attemptId, typedPhrase)` directly.
  - The ref is read only by `runExecute` (547), which only the dev hook at 578 reaches.
- A person's confirm never reads the ref. Submit is also disabled until a phrase is typed (`PublishDialog.tsx:307`: `              disabled={state.phrase === ""}`).
- Outcome: only a caller that does not wait for the dialog reaches the window. The form's step 2 applies: make the suite wait, as the publish suite does. The wait hides nothing a person can meet.
- Caveat: the 546-550 path itself also comes from the dev hook only, registered under `if (!import.meta.env.DEV) return;` (571).

(e) Runtime version in the two logs at 6f7e744c
- Files read, all under the reports' named `<S>/m4b-e2e-h/out` and `<S>` paths:
  - 2026-11-16: `m4b-e2e-hs-selection.log`, `.app.err.log`, `.app.out.log`, `.vite.err.log`, `s327t-hs-selection.session.log`, `s327t-harvest-hs-selection.txt`
  - 2026-11-18: the same names with `hc-selection-at-6f7e744c` and `s327d-` in place of `hs-selection` and `s327t-`
- I searched each for webview2, msedge, Edg/, Chrome/, runtime, browser, version, user-agent and any four-part dotted number. Each pattern matched a positive test string first.
- Only match: `additionalBrowserArgs` in each run's tauri conf (flags, no version).
- No version appears in any of them, so there is nothing to record. The two runs' exe is one file (sha256 01073a95...41b9b, per the diagnosis report); the runtime lives outside it, so its version is unknown from these logs.

Self-check, four classes:
- Interface: read the real code on both sides.
- Claims: each has quoted lines above.
- Messages: none written.
- Assertions: n/a, no test run.

Off-scope noticed, not done: nothing.
I did nothing the brief does not name beyond the read. I wrote only `<S>/sel1-fetch.txt`, `sel1-d03.txt`, `sel1-g.txt` (scratch). No commit, no run, no tracked change.
Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
State: `git status --porcelain` empty, HEAD f5584f28.
