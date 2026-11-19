Built: selection-export-unknown-attempt step 2, worker (the custodian's filing note, 2026-11-19: the Sonnet worker, model claude-sonnet-5-5, its run 2026-11-19T00:45:15Z to 00:46:36Z by its transcript, Bash 8, Write 1, none errored; 4603 bytes, sha256 dd147c0553ee470f735964c68b8027d22d6eafe11021dfcbcd711028e6b0ae2c; below byte for byte, with this note and one final newline)
Result: committed 9a4c58332661b6fd69fb477b1184f0147f38df2b and pushed. I ran no app, suite or build, as the message required.

Departure for you to rule on:
- `waitForHook` is a local function in `publish.mjs` (line 165), not in a shared lib, and `colour.mjs` has its own `waitFor`. Reaching it would have meant a third file, so I did not.
- I used the `pollUntil` that `selection.mjs` already has. It waits for both the `publishExecute` function and a `.publish-dialog` element. That is a little stricter than the publish suite's hook-only wait, which is what step 1 (b) called for.
- Residual: the `.publish-dialog` element can be in the DOM a moment before the panel's passive effect sets the ref. The wait narrows the window and does not prove it closed. The series run will show it.

Other things you should know:
- `executeExport` is now a function, and `startExportThenOpen` calls the wait too, because its `send` also calls the hook.
- The old one-line doc comment above `executeExport` now sits above the new `waitForExportDialog` block, so two doc comments stack. I left it alone to keep the diff minimal.

Diff of `selection.mjs`, as `git show HEAD` prints it:
```
@@ -562,7 +562,19 @@ async function prepareExport(page, destination) {
 /** Executes the prepared attempt with the phrase an operator types (the destination's final path component), through the dev hook that shares the dialog's path. */
-const executeExport = (page, prompt) => pairEvaluate(page, "execute", (p) => window.__SPATIAL_E2E__.publishExecute(p), basename(prompt.destination_display));
+/**
+ * Waits for the dialog the prepare opens, and for the publishExecute hook, before an execute is sent, as publish.mjs does (SELECTION-EXPORT-UNKNOWN-ATTEMPT-PREREGISTRATION.md, step 2).
+ * The hook answers unknown-attempt while PublishPanel's attemptIdRef is not yet set, which happens only after the render that mounts the dialog; a person's confirm passes PublishDialog's own
+ * attemptId prop and never reads that ref, so the wait hides nothing a person can meet.
+ */
+async function waitForExportDialog(page) {
+  const ready = await pollUntil(() => page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishExecute === "function" && document.querySelector(".publish-dialog") !== null), (ok) => ok === true, 20_000);
+  expect(ready.ok, "the export dialog and the publishExecute hook never appeared after the prepare");
+}
+const executeExport = async (page, prompt) => {
+  await waitForExportDialog(page);
+  return pairEvaluate(page, "execute", (p) => window.__SPATIAL_E2E__.publishExecute(p), basename(prompt.destination_display));
+};
@@ -618,6 +630,7 @@ async function startExportThenOpen(page, consoleHandle, label) {
   expect(prepared.status === "prompt", `${label}: prepare returned ${JSON.stringify(prepared)}`);
+  await waitForExportDialog(page);
   await pairEvaluate(page, "send", ([phrase, path]) => {
```
(Lines the diff shows as unchanged context are omitted here. The comment names code by symbol only, no line numbers.)

`README.md`: one line changed in the selection entry's long paragraph, in the `Asserted, each as a named step` line. I appended this to its end:
" The export steps wait for the dialog (and the `publishExecute` hook) before each execute, as `publish.mjs` does. The wait hides nothing a person can meet: a person's confirm passes `PublishDialog`'s own attempt id prop, and only the dev hook reads the panel's `attemptIdRef`, which is set a render after the dialog mounts."

Numstat, against the budget of at most 40 added and 10 removed:
- `README.md`: 1 added, 1 removed.
- `selection.mjs`: 14 added, 1 removed.
- Total 15 added, 2 removed, so the budget holds.
- `node --check frontends/shell/e2e/selection.mjs` gave rc 0.

Commit and push:
- Message file `<S>/sel2-msg1.txt`, written with the Write tool. The commit is signed off via `-s`.
- `node scripts/hooks/profile-path-scan.mjs --staged` printed `profile-path-scan: clean`, rc 0.
- Commit 9a4c58332661b6fd69fb477b1184f0147f38df2b, "2 files changed, 15 insertions(+), 2 deletions(-)".
- Push in its own call, rc 0: ` * [new branch]        cut/selection-export-unknown-attempt -> cut/selection-export-unknown-attempt`, then `branch 'cut/selection-export-unknown-attempt' set up to track 'origin/cut/selection-export-unknown-attempt'.`

HEAD is 9a4c58332661b6fd69fb477b1184f0147f38df2b, and `git status --porcelain` is empty.
Scratch files, all directly in `<S>`: `sel2-edit.mjs`, `sel2-readme.mjs`, `sel2-msg1.txt`.
Model: Sonnet 5.5 (claude-sonnet-5-5), no override.
