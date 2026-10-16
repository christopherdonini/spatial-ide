New head: 3dfc1a0e51ac1936a1008d815c8d19b8dab69367 (one `test:` commit on cut/b2-piece-1b-recording, pushed ordinary, not forced). Before starting: head was 7b547f90 and porcelain was empty. Final `git status --porcelain` is empty. I did not run the e2e suite, so neither the new assertion nor the new mutation has been observed.

**Commands and exit codes**
- `git fetch origin`: 0
- `node --check frontends/shell/e2e/console.mjs`: 0
- `node scripts/plan/verify-cites.mjs` (output to file): 0 (PASS, 38 loose references advised)
- `node scripts/plan/verify-quotes.mjs` (output to file): 0 (PASS, 121 checked, 0 hash-reference errors)
- `git commit -s -F`: 0
- `git push origin cut/b2-piece-1b-recording` (separate call): 0

**Diff of console.mjs against 7b547f90**
This is the full `git diff 7b547f90 HEAD` output for the file; it is 67 insertions and 1 deletion, only inside `stepGroup` and its comments.
```
diff --git a/frontends/shell/e2e/console.mjs b/frontends/shell/e2e/console.mjs
index 1028e88b..182279a5 100644
--- a/frontends/shell/e2e/console.mjs
+++ b/frontends/shell/e2e/console.mjs
@@ -672,11 +672,20 @@ async function stepClassC(page) {
  * window whose rows are not grouped still fails `not exercised`. Rows from CLASSC''s earlier edit may join
  * the same run, so the window is all `style.set` step rows, expected to be the baseline count plus
  * GROUP_CALLS.
+ *
+ * Added by the human's 2026-10-16 direction (Amendment 7): the class-C proof the earlier CLASSC' gave now
+ * sits here. After the group is found, one click on its header must write exactly one entry (the console
+ * label's total, read without any click, rises by 1) and that entry is the class-C row for
+ * `console.toggleGroupExpanded`, owner naming docs/03, statement containing "no API equivalent".
  */
 async function stepGroup(page, consoleHandle) {
   // RECORDED MUTATION, TO BE OBSERVED BY THE CUSTODIAN (B2 piece 1b; not yet observed at this edit): in
   // src/console/consoleViewModel.ts `groupConsecutiveEntries`, stop coalescing (emit every entry as its own single item).
   // GROUP' must then fail with the "grouping not exercised" name. Revert afterwards.
+  // RECORDED MUTATION 2, TO BE OBSERVED BY THE CUSTODIAN (the human's 2026-10-16 direction, Amendment 7; not yet
+  // observed at this edit): in src/console/ConsolePanel.tsx `ConsoleGroupRow`, remove the header click's
+  // `recordNamed("gui-action", "console.toggleGroupExpanded");` call. GROUP' must then fail with a message
+  // starting "GROUP': toggle" (no entry written by the click). Revert afterwards.
   const isStyleStep = (r) => {
     if (r.key !== "a:record_step") return false;
     try {
@@ -755,8 +764,65 @@ async function stepGroup(page, consoleHandle) {
     }
   }
 
+  // The group-toggle class-C proof (the human's 2026-10-16 direction, Amendment 7). One click on a found
+  // group's header; what it wrote is counted from the console label's entry total (a read that clicks
+  // nothing), never from a read that expands groups.
+  const groupIdx = w.wi.findIndex((x) => x.it.header !== null);
+  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
+  const beforeClick = await readConsoleLabel(page);
+  const clicked = await page.evaluate((ii) => {
+    const kids = Array.from(document.querySelector(".console-entries")?.children ?? []).filter((c) => c.matches(".console-group, .console-entry"));
+    const h = kids[ii]?.querySelector(".console-group-header");
+    if (!h) return false;
+    h.click();
+    return true;
+  }, w.first + groupIdx);
+  if (!clicked) throw new Error(`GROUP': toggle: no group header at item ${w.first + groupIdx} to click`);
+  const wrote = await pollConsole(() => readConsoleLabel(page), (l) => l.total !== null && l.total >= beforeClick.total + 1);
+  if (!wrote.ok) {
+    throw new Error(`GROUP': toggle: one click on a group header wrote no console entry within ${CONSOLE_POLL_BOUND_MS}ms (label total ${beforeClick.total} before, ${wrote.last.total} after)`);
+  }
+  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
+  const afterClick = await readConsoleLabel(page);
+  if (afterClick.total - beforeClick.total !== 1) {
+    throw new Error(`GROUP': toggle: one click on a group header wrote ${afterClick.total - beforeClick.total} console entries (label total ${beforeClick.total} -> ${afterClick.total}), expected exactly 1`);
+  }
+  // The newest item holds that one entry. Read it without any click that records; when it is a coalesced
+  // group, expand it once (that click records a row after it, and the click's own row keeps its index).
+  const readNewest = (rowIndex) =>
+    page.evaluate((idx) => {
+      const kids = Array.from(document.querySelector(".console-entries")?.children ?? []).filter((c) => c.matches(".console-group, .console-entry"));
+      const last = kids.at(-1);
+      const h = last?.querySelector(".console-group-header") ?? null;
+      const rows = Array.from(last?.matches(".console-entry") ? [last] : (last?.querySelectorAll(".console-entry") ?? []));
+      const row = idx === null ? rows[0] : rows[idx];
+      return {
+        header: h?.textContent ?? null,
+        expanded: h ? h.getAttribute("aria-expanded") === "true" : null,
+        rowCount: rows.length,
+        classC: row?.classList.contains("console-entry-class-c") ?? false,
+        prose: row?.querySelector(".console-entry-prose")?.textContent ?? null,
+        owner: row?.querySelector(".console-entry-owner")?.textContent ?? null,
+      };
+    }, rowIndex);
+  let newest = await readNewest(null);
+  if (newest.header !== null) {
+    const n = Number(/^×(\d+)$/.exec(newest.header)?.[1]);
+    if (newest.expanded === false) {
+      await page.evaluate(() => {
+        const kids = Array.from(document.querySelector(".console-entries")?.children ?? []).filter((c) => c.matches(".console-group, .console-entry"));
+        kids.at(-1)?.querySelector(".console-group-header")?.click();
+      });
+      await waitForNextConsoleFrame(page);
+    }
+    newest = await readNewest(n - 1);
+  }
+  if (!newest.classC || !(newest.owner ?? "").includes("docs/03") || !(newest.prose ?? "").includes("no API equivalent")) {
+    throw new Error(`GROUP': toggle: the entry the click wrote is not the class-C row for console.toggleGroupExpanded: ${JSON.stringify(newest)}`);
+  }
+
   const distinct = new Set(w.res.map((x) => x.r.req)).size;
-  return `${GROUP_CALLS} style edits -> window items (key, rows inside): ${JSON.stringify(summary)}; ${exercised} group(s) show 2+ rows inside the window; ${distinct} distinct text(s) among the ${w.res.length} style.set record_step rows; R=${R} <= ${MAX_CONSOLE_ENTRIES}`;
+  return `${GROUP_CALLS} style edits -> window items (key, rows inside): ${JSON.stringify(summary)}; ${exercised} group(s) show 2+ rows inside the window; ${distinct} distinct text(s) among the ${w.res.length} style.set record_step rows; R=${R} <= ${MAX_CONSOLE_ENTRIES}; one group-header click wrote 1 entry (label total ${beforeClick.total} -> ${afterClick.total}), a class-C row with owner ${JSON.stringify(newest.owner)} and a statement containing "no API equivalent"`;
 }
```

**What the assertion counts, and why a read cannot satisfy it**
- **What it counts:** the console label's entry total (count plus dropped), read by `readConsoleLabel`. That helper clicks nothing. The total is read after a settle and before the single click on a found group's header, then again after the click. It must rise by exactly 1.
- **Why a read cannot satisfy it:** the count comes from `readConsoleLabel` only. The assertion never calls `readItems` or `readClassAEntries`, so `expandAllGroups` cannot add rows to it.
- **Why it fails when the click writes nothing:** the total stays at `before`. The bounded poll (the suite's `CONSOLE_POLL_BOUND_MS` of 5000 ms, 100 ms interval) never sees `before + 1`. The step then throws `GROUP': toggle: one click on a group header wrote no console entry ...`.
- **Timing:** nothing waits on a fixed sleep. There are two `waitForSettle` calls of the same shape as the step's existing one, and one bounded poll.
- **Exactness:** a second settle follows the poll, then the delta must equal 1. A click that wrote more than one entry also fails, as `GROUP': toggle ... wrote N console entries`.
- **Content check:** after the delta passes, the newest item is read without any recording click.
  - If it is a single entry, that entry is checked.
  - If it is a coalesced group, the group is expanded once if collapsed. That click records a row after the click's own row, so the click's row keeps its index, `N-1`.
  - The row must be `.console-entry-class-c`. Its `.console-entry-owner` must include `docs/03`, and its `.console-entry-prose` must include `no API equivalent`. Otherwise the step throws `GROUP': toggle: the entry the click wrote is not the class-C row ...`.
- **Residual limit:** the content check inspects the newest item's click-written row, not the whole ring. Exactly one new entry is proven by the total, so the check is not about a row from an earlier toggle.

**New mutation as recorded** (RECORDED MUTATION 2, in `stepGroup` beside the existing one, which is unchanged): in `frontends/shell/src/console/ConsolePanel.tsx`, remove the `recordNamed("gui-action", "console.toggleGroupExpanded");` call from `ConsoleGroupRow`'s header click, at line 123 of that file at 7b547f90. The `setGroupExpanded` line stays. GROUP' must then fail with a message starting `GROUP': toggle` (the "wrote no console entry" one). Revert afterwards. The existing GROUP' mutation (stop coalescing in `groupConsecutiveEntries`) is untouched and still needs re-observing at the new head.

**Step bound:** the `GROUP'` bound in its `runStep` call stays at 45_000 ms. Under the new mutation the added path is one settle of about 1.5 s plus the 5 s poll, which fits. The pre-existing step work is unchanged.

**Pre-gate self-check**
- **Interfaces:** the code uses interfaces the other side actually has. `ConsoleGroupRow` is at `ConsolePanel.tsx:106-133`, and the `recordNamed` call is at line 123. The class-C `console.toggleGroupExpanded` entry is at `surfaceRegistry.ts:229-236`, with owner `docs/03 §"The action console" (pure view state)`. The selectors `.console-group-header`, `.console-entry-class-c`, `.console-entry-prose` and `.console-entry-owner` are the ones read there (`ConsolePanel.tsx:187,196-197`).
- **Completion claims:** no completion claim is made beyond the syntax check and the two verify scripts. Nothing is called discharged or observed. The e2e run and both mutations are left to the custodian.
- **User-facing messages:** only test failure messages are added. Each describes behaviour the code implements at this commit.
- **Intended assertion:** I have not run the assertion, so I cannot say it reaches its intended assertion. The DOM-parse path through a coalesced group is the part most likely to need a fix from the first run.

**Model and handoffs:** the harness reports Sonnet 5.5 (`claude-sonnet-5-5`). I used no model override, and I received and produced no context handoff.

**Off-scope noticed, not done:** verify-cites reports 38 loose references in `state/drafts/post-tag/lod-brief-revised.draft.md` (advisory, run still passes).

Relevant file: `C:/dev/wt/1b/frontends/shell/e2e/console.mjs`. The commit message I wrote is at `<the custodian's scratch folder>\g7-commit-msg.txt`.
