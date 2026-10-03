Question round 40 — 2026-10-03 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: 1. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Item 1. RED LINE (user-visible behaviour): node 8 (publish-attempt-lifecycle-src-tauri), what happens when the window closes mid-publish. Today the process ends at once, and the blocking publish thread dies with it. That leaves a hidden .<name>.staging-<hex> directory beside the destination and an audit intent with no outcome (wave-1 A5-2). The architect's draft: on a last-window close while a publish runs, the window disappears at once, but the process stays alive, windowless. It cancels every running publish, then exits when they have finished cancelling, or at a 30 s ceiling (a declared ceiling, not a measured bound). The kernel then removes the staging directory and records a cancelled outcome. No UI text changes, and KNOWN-LIMITATIONS gains item 30 (wording for your sight at the PR). Alternatives: another ceiling; no ceiling; or keep the window open until the cancel finishes (visible, not drafted). This is a red line, so type your ruling in Other, e.g. "approve, 30 s ceiling". The presets are holds only.
  (1) Hold — Node 8 waits; its form is not committed.
  (2) Hold until 2026-10-09 — Taken at the next weekly window.

---

2. Item 2. Node 8's grants lock (wave-1 A1 obs. 2: a running publish holds the grants mutex for its whole run, stalling a concurrent prepare). The draft narrows it in the shell alone, with no kernel change. Under one lock it finds the grant, removes it from the shared set and copies it into a call-local set; it then publishes without holding the lock. That also closes a small race the draft found, where a same-destination prepare could lose its grant. Residual: if the destination changes between the shell's check and the kernel's, the old path (lock held) is taken. That is today's behaviour, and the race class ADR-017 §15 already declares. The exact alternative, `GrantSet: Clone` in the kernel, is one line outside the node's src-tauri scope as round 31 item 2 ruled it, so it is a red line: type it in Other if you want it.
  (1) Shell-only (Recommended) — As drafted: no kernel change, with the declared residual.
  (2) Hold — Node 8 waits.

---

3. Item 3. Node 8's proof for the Tauri exit seam. No automated test can reach Tauri's event loop. The draft proves it with a read of the pinned tauri crate sources, plus a new manual walkthrough row R1, queued for your batched walkthrough: on Windows, close the window mid-publish, then check that the process ends, no staging directory is left, and the audit shows cancelled. The alternative is an automated test using tauri's `test` feature. That is a dev-dependency feature change, so it is a red line: type it in Other if you want it.
  (1) Source read + row R1 (Recommended) — As drafted. The walkthrough row is yours, batched with the other operator rows.
  (2) Hold — Node 8 waits.

---

4. Item 4. A sibling defect node 8's draft found. Prepare cancel tokens are keyed by dataset handle (prepare:<handle>), so two concurrent prepares on one dataset would replace and remove each other's token. It is not yet verified whether the panel can issue two at once. Folding it into node 8 needs a new refusal string, a scope addition, so it is a red line: type it in Other if you want that.
  (1) Proposed node (Recommended) — Recorded as its own proposed node, verified first, and placed by you later.
  (2) Hold — Not recorded yet.
