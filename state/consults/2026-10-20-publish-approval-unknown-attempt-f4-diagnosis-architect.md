*Custodian's filing note (2026-10-20): the architect's read-only diagnosis of the panel's F4 path for `publish-approval-unknown-attempt-under-load`, under the human's ruling of 2026-10-20, its last paragraph (`state/directives/2026-10-20-230-231-233-merged-232-strikes-rule-d1-a-not-i1-profile-path-redact-unknown-attempt-a.md`), and the form's Amendment 8. The run 2026-10-20T10:29:54Z to 10:36:39Z by its transcript (Read 31, Grep 26; no write and no shell); its one SubagentHandback call, at 10:36:38Z. The custodian read its key cites at d7dfb18e by script (the hook's null branch, the effect, the dev hook's registration, the prepare's state update and return, the dialog's mount, the store's registration, the driver's stamps and the record's line). Its [R] claims are readings a run can test. Extracted by script; every path:line cite reads at main d7dfb18e, so none is de-rooted; one final newline added if absent; nothing else changed.*

---

Diagnosed: publish-approval-unknown-attempt-under-load, the panel's F4 path, at main d7dfb18e (main @ d7dfb18e94fdc63e23d87530c1c8c56f4fa37023)

I read every repo path:line below at d7dfb18e94fdc63e23d87530c1c8c56f4fa37023. That commit is authoritative for what this report read. I could not compute span hashes because I have no shell. Each claim carries one of three marks:
- **[F]** a fact of the code at that commit.
- **[D]** a fact of the installed dependency code: react-dom 18.3.1 and scheduler 0.23.2 in the shell's node_modules. These files are untracked, so I cite them by file and line in words. They are evidence, not Authority.
- **[R]** my reading of how React, Chromium or the CDP transport schedule work. A run can test each [R].

Under the ruling I worked to, the last paragraph of `state/directives/2026-10-20-230-231-233-merged-232-strikes-rule-d1-a-not-i1-profile-path-redact-unknown-attempt-a.md` and the form's Amendment 8, this conclusion closes the cause step.

## 1. Can the dev hook alone produce the answer? Yes.

**The branch exists [F].** `runExecute` reads `attemptIdRef.current`. If it is null, `runExecute` returns `{status:"unknown-attempt"}` and never calls `executeInStagedScope` or `publishExecute`: frontends/shell/src/publish/PublishPanel.tsx:546-550. The dev hook calls exactly this function (frontends/shell/src/publish/PublishPanel.tsx:578). The ref is written in one place only, a passive effect on `[state]` (frontends/shell/src/publish/PublishPanel.tsx:533-536).

**The window, event by event:**
- **E0 [F].** The host stores the attempt before it answers: frontends/shell/src-tauri/src/publish.rs:643-661.
- **E1 [F].** The prepare's answer arrives. `runPrepareWithDestination` calls `setState` with the dialog state (frontends/shell/src/publish/PublishPanel.tsx:479, which builds it at :264-265), then returns the outcome at :480, which resolves the hook's promise. In the same chain of microtasks, App's export consumer dispatches `consumer.released` (frontends/shell/src/App.tsx:1144-1149), so the update that follows renders App as well as the panel.
- **E2 [D].** That `setState` runs outside any browser event, so React gives it DefaultLane (react-dom.development.js, `getCurrentEventPriority`, lines 10992 to 10997). The render is scheduled as a Scheduler callback (line 25722), not a microtask; only SyncLane takes the microtask path (line 25661). The Scheduler posts it through MessageChannel (scheduler.development.js, lines 569 to 575). Call that later browser task B.
- **E3 [R].** The CDP reply to the prepare's evaluate leaves the page when the hook's promise settles. That is in the current task, before task B runs.
- **E4 [F].** On the driver side, `pairEvaluate` stamps p1 and returns (frontends/shell/e2e/exportElapsed.mjs:51-52). `stepExport` checks the status in Node (frontends/shell/e2e/selection.mjs:582), then `executeExport` stamps e0 and sends the execute (frontends/shell/e2e/selection.mjs:583, :565; frontends/shell/e2e/exportElapsed.mjs:49-51). Nothing waits for a render, for the dialog's DOM or for any page state. The record shows L 0 ms (state/consults/2026-10-19-shell-migration-milestone-3-re-sweep-2-custodian.md:56).
- **E5 [D].** In task B, React renders and commits. DefaultLane counts as blocking, so the render is not time-sliced (react-dom.development.js lines 5670 to 5674 and 25776 to 25777). The commit schedules the passive effects as a further Scheduler callback (lines 26797 to 26812). Only SyncLane flushes them inside the commit (line 26973).
- **E6 [D].** The Scheduler runs that callback inside task B only while less than 5 ms have passed since B began (scheduler.development.js line 28 `frameYieldMs = 5`, lines 254 and 485 to 496). Otherwise it yields and posts a new task D (lines 535 to 538).
- **E7 [F].** The effect sets the ref (frontends/shell/src/publish/PublishPanel.tsx:535). Only from this point can an execute reach the host.

**Can an execute sent at L 0 ms land inside the window? [R]** The execute's CDP command runs as a task C on the renderer's main thread. It lands in the window if C runs before E7, in one of two ways:
- **(a)** C runs before B. Browsers do not order tasks across different task sources, so this depends on Chromium's queue priorities while the main thread is busy.
- **(b)** B's render and commit take 5 ms or more, so the effect moves to task D, and C was queued during B. Plain first-in-first-out order is then enough for C to run first.

The e2e waits for none of E5 to E7.

**What load changes [R].** On a shared machine with CPU contention, B's render takes longer. That render covers the App tree, and it runs in a dev build (the hooks exist only when `import.meta.env.DEV` holds, frontends/shell/src/publish/PublishPanel.tsx:571; I read only the development react-dom file). Load also delays the renderer's tasks, while the driver and the CDP transport run in other processes. Both make (b) likelier. On an idle machine the render finishes in under 5 ms, the effect runs inside B, and the ref is set before C. That fits the two runs alone, where both pairs passed at 0 ms (state/consults/2026-10-19-shell-migration-milestone-3-re-sweep-2-custodian.md:91 and :98).

**For this observation, the host had no other way to miss [F].**
- The failing execute was pair 1. The line carries one figure (`elapsedTail`, frontends/shell/e2e/exportElapsed.mjs:34-36).
- It was the first attempt of a fresh app. The record says each suite ran in a fresh app (state/consults/2026-10-19-shell-migration-milestone-3-re-sweep-2-custodian.md:23), and no step before E-EXPORT prepares (frontends/shell/e2e/selection.mjs:844-865; the prepare calls are at :581, :598, :619 and :724).
- There is one store (frontends/shell-src-tauri path: frontends/shell/src-tauri/src/lib.rs:473). The attempt is stored before the answer (frontends/shell/src-tauri/src/publish.rs:643-661).
- The store's sweep drops only expired entries (frontends/shell/src-tauri/src/publish.rs:212). Entries are removed only by `take` (:218-225), whose only product caller is :725.
- The other `UnknownAttempt` answer needs a second execute under the same id while the first runs (frontends/shell/src-tauri/src/commands.rs:443-460). The driver sent none.
- The panel would send the prompt's own id (frontends/shell/src/publish/PublishPanel.tsx:265 then :535).

So the only host cause left is the TTL, which Amendment 7 item 2 excluded (U 92 ms ≤ T 120 000 ms). The panel path F4 is the only code path that produces this observation.

**A related case for later pairs [R].** If an earlier attempt in the same panel had settled but its effect had not yet run, the ref could still hold the old id. The host would then be called and would answer `unknown-attempt` itself. Pair 1 of a fresh app cannot hit this case.

**A comment the code does not support [F].** The comments at frontends/shell/src/publish/PublishPanel.tsx:525-531 and frontends/shell/src/e2e-test-surface.ts:145-147 say the hook reads the attempt "kept in sync" and "always" the freshest one. Inside the window above, it does not. This belongs to the fix step.

## 2. The dialog's Submit cannot produce this answer

`PublishDialog` is mounted only once `state.kind === "dialog"` has been committed (frontends/shell/src/publish/PublishPanel.tsx:739-743). It takes the attempt id as a prop from that state (:741). Submit passes that prop straight to `execute` (frontends/shell/src/publish/PublishDialog.tsx:187-201, :89). `execute` here is `executeInStagedScope` (frontends/shell/src/publish/PublishPanel.tsx:612), which has no null branch. It either refuses on a scope change (:514-515), which is `refused` and not `unknown-attempt`, or calls the host (:516). An operator's `unknown-attempt` therefore always comes from the host, which is F3: the TTL, an id already taken, or a run already in progress [F].

## 3. The row that tells F3 from F4

| Artifact | Shows whether the host was called? | Kept by the series? |
|---|---|---|
| Console's execute row | Yes: `binding_publish_execute` is recorded before the invoke and only when the host is called (frontends/shell/src/publish/client.ts:61-64). But it lives only in memory, in a ring of 256 entries that evicts the oldest (frontends/shell/src/console/recorder.ts:139, :280-286). It is never persisted, and the row has no id and no time (:96-103). | No |
| App's stderr | No: the host writes nothing on a miss (frontends/shell/src-tauri/src/publish.rs:725-726; frontends/shell/src-tauri/src/commands.rs:458-460). | Yes, from the next run (Amendment 8 item 2) |
| Session log | No: nothing under src/publish writes to it (a search finds only `console.error` at frontends/shell/src/publish/PublishPanel.tsx:236), and F4 throws nothing. | Yes |
| Audit record | No: the audit log is opened after the `take` (frontends/shell/src-tauri/src/publish.rs:779), so neither path writes one. | n/a |
| Driver's output | No: it prints only the verdict line (frontends/shell/e2e/exportElapsed.mjs:27-29; frontends/shell/e2e/selection.mjs:830-832). | Yes |
| "The report" | None exists for this suite: selection.mjs writes no report file, and the page console that `attachConsole` collects stays in the driver's memory (frontends/shell/e2e/lib.mjs:317-338). | n/a |

None of the kept artifacts shows it.

Two things in the app do separate the cases, but both must be read before E-SCOPE's open (frontends/shell/e2e/selection.mjs:596). That open remounts the panel through the dataset key (frontends/shell/src/App.tsx:2327). I assume, without having checked, that each open gives a new dataset handle.
- **The panel's own state [F].** Under F4 the panel stays in `dialog`: `runExecute` returns at :549, before `handleDialogSettled` at :552, and the disclosure is open (frontends/shell/e2e/selection.mjs:560). Under F3 the panel shows the refusal "no longer known to the host" (frontends/shell/src/publish/PublishPanel.tsx:305-312).
- **The console's rows.** A `binding_publish_prepare_e2e_destination` row with no `binding_publish_execute` row after it means F4.

What the capture must add, without a code change:
- **A control on stderr.** Check whether a passing run's kept app stderr names `binding_publish_execute`. Tauri's runtime could log invokes, but I could not read that from the repo [R]. If it does, stderr becomes the row.
- **Otherwise, a second CDP observer.** A scratch client, never committed, attached for the selection suite, records the page's IPC requests by command name with times. That IPC on Windows shows up as network requests is my reading [R]. The prepare's own request appearing is the positive control; without it, that run's capture is void. Whether the port-5400 harness approval covers a second client is for the custodian to check against its terms.
- **If neither is available,** only an edit to the driver can show it, and that belongs to a later step.

## 4. Conclusion

**Conclusion: THE DEV HOOK ALONE CAN**

- The hook has a branch that answers with no host call (PublishPanel.tsx:548-549).
- The attempt it reads is set only by a passive effect, which React runs in a later Scheduler callback than the `setState` that resolves the prepare's promise [F] [D].
- E-EXPORT sends the execute the moment the prepare answers and waits for no render [F].
- For the observed pair, the host has no path to a miss within 92 ms other than the TTL, which was excluded [F].
- That the execute's CDP task can run before the effect is my reading [R]. The capture in item 3 tests it.

The fix, which is out of scope here: set the attempt where the prompt arrives (in `runPrepare*`, before returning), not in an effect.
