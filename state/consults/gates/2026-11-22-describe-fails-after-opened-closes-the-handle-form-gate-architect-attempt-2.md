Reviewed: main at 0a2f0022f6247a8f0c00360a12eedca333b447f4, in the detached read worktree C:/dev/wt/read-1122 (the custodian's filing note, 2026-11-22: the architect's form gate on node (g)'s form, attempt 2, reading Amendment 1 alone (ADV-2026-11-22-35 item 1, ADV-2026-11-22-39 item 3), node:describe-fails-after-opened-closes-the-handle@form-gate-architect-2, dispatched at 2026-11-22T20:31:31.107Z; its run: Read 30, Grep 7, Glob 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T20:31:37Z to 2026-11-22T20:36:29Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 10812 bytes, sha256 6b169698495d79503a3440230dcf661efbae2967e64b9477172b8eb459dec0f6, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no finding of any class; three notes, not findings. Attempt 1 stays FAIL in every record.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1122 @ 0a2f0022f6247a8f0c00360a12eedca333b447f4

Branch: none. I read main in the detached read worktree, using only Read, Grep and Glob. Every cite below is at 0a2f0022. Amendment 1 is at form :255-595. I read the form above it only at the passages Amendment 1 replaces or follows.

## Correctness
None.

**My findings are closed.** Each new text, read in place:
- **E-1.** The new KM1 (form :274) removes step 5's close in K1 alone. With the close gone, the catalog still holds the handle, so `release_ended` keeps the entry (kernel/src/project/mod.rs:263-265) and step 6's `try_lock` is refused. The product mutation is set aside for the reason attempt 1 gave.
- **E-2.** A2 now asserts the same object (form :286). The new M4 (form :298) replaces only an error that is not an `SkpCallError`. So its named set, S2 and A2, matches what a run would record. `call` rethrows a non-envelope error unchanged (frontends/shell/src/skp/client.ts:69-70).
- **D-1 to D-4** (form :310, :324, :336, :348):
  - D-1 now holds under the bound. Once the close has settled, the catalog no longer holds the handle, because it is removed before the close returns (kernel/src/skp.rs:1660). A retry's own `release_ended` runs before the lock (mod.rs:780-781) and drops the entry.
  - D-2 matches mod.rs:23-26.
  - D-3 matches commands.rs:119-128 and :142-147. The release thread starts only after the host's close returns, so D-3 is consistent with the new May-not-claim line.
  - D-4 matches commands.rs:133-152.

**The bound, as ADV-2026-11-22-38 items 2 and 3 and ADV-2026-11-22-39 items 2 and 3 rule it:**
- **The same error, thrown at settle or at the bound, whichever is first.** This is §2.1 text 1 (form :362) and the sketch (form :380-391). `closed` maps both outcomes to undefined, and the deadline only resolves, so `Promise.race` never rejects. After `clearTimeout`, `throw e` always runs.
- **After the bound, the close is left running, and its reply and rejection are dropped.** Nothing cancels the `call`. Its `.then(() => {}, () => {})` absorbs a late settle. The Console entry resolves only after `await invoke` (client.ts:59-71). This is stated at form :362 and :428.
- **No string, log line or retry.** Stated at form :362. §8 items 1 and 2 still apply.
- **The 2000 ms constant, declared and not measured.** It is declared at one site, `admitDataset.ts` (form :582). Its reason is in its doc. It is below `WATCHDOG_PHASE_TIMEOUT_MS = 5_000` (frontends/shell/src/diagnostics/watchdog.ts:13). It is marked as declared, not measured (form :362, :442).
- **The cleared timer.** The sketch clears it at form :388. The executor runs synchronously, so `timer` is assigned before the race.
- **May not claim** (form :440-442):
  - The lock is not claimed freed, and a retry is not claimed to find it free, when the close has not settled. This is ADV-38 item 3 bullet 2.
  - The refusal is not claimed to come at the bound exactly, and the reason is marked as taken from documentation. This is ADV-39 item 2.
- **May claim** (form :428). It uses the wording "once … has passed" and does not say "no later than", as ADV-39 item 2 asks.

**The sketch against the client's real interface at 0a2f0022.**
- `describe` and `closeDataset` are `call(...)` (client.ts:97-99, :136-138). Both are async functions, so neither can throw synchronously.
- `call` records and invokes before its first `await` (client.ts:59-61). So the close is sent before the timer is armed, in the same turn.
- `admitDataset.ts` will need `closeDataset` added to its import from `../skp/client` (:7). openProject.test.ts's mock must then export it, and §4.1 already gives the mock a recording `closeDataset`.
- No import cycle results: admitDataset.ts imports only `type Reopened` (:8).

**The watchdog note (form :538).**
- `begin("describe")` is at admitDataset.ts:60, and the catch ends the phase at :67-68.
- The threshold is at watchdog.ts:13 and :45, and the log line is at :46-47.
- `admitProject` has no watchdog import and no `begin` (openProject.ts:18-24, :62-78).
- The case of a `describe` that itself runs past the remainder is named.

**The constitution.**
- docs/01 principle 7 is improved: the wait is now bounded.
- docs/10: control plane only.
- ADR-006: no workspace mutation.
- No change to protocol/, the kernel or the engine.

## Evidence
None.

**The tests.**
- **S5's red at C1.** `describeOpened` is not exported at C1, so calling it through the namespace is a TypeError. The namespace import keeps the other tests loading. vitest does not typecheck, so C1 runs.
- **S6's red at C1.** The same as S5.
- **The fake clock.** The only timers on the path are `describeOpened`'s. My grep of admission/, project/, console/, diagnostics/ and skp/ finds only watchdog.ts:58 and AdmissionPanel.tsx:477. `startWatchdog` is not called by these tests, and the panel is not rendered. So `vi.getTimerCount()` counts only `describeOpened`'s timer.

**Each mutation against its named set:**
- **M1:** S5 and S6 are killed at their close assertions, and the rest as attempt 1 found.
- **M5:** S5 never settles, so it is killed. Every other test's close settles.
- **M6:** S5 settles before 1999 ms, so it is killed. S6 never advances the clock and clears the timer. The real-timer tests settle in microtasks, before a 0 ms macrotask can fire. So no other test is killed.
- **M7:** S6 is left with one timer, so it is killed. In S5 the timer has already fired.
- **M2:** stands. Without the rejection handler, the race rejects with the close's error, which kills S3.
- **M3 and M4:** unchanged. A typed `err` keeps M4 out of S5 and S6.

No listed mutation has a known pass case, and the fake clock can show each one.

**The order tests** (form :525). They hold, because the close is sent before the race awaits.

**The budget.**
- The 270-line ceiling is declared as class 9, citing ADV-38 item 4 (form :570), before any code.
- The 220 line at form :212 is not edited, and an overrun of 270 is class 8.
- Both of the estimated 49 lines' files are in §7's five paths.

## Documentation
None.

## The OPEN items (Amendment 1 item 7, form :587)
They hold:
- OPEN-1 and OPEN-7 are ruled by ADV-2026-11-22-32 items 1 and 2.
- OPEN-2 to OPEN-6 are ruled by ADV-2026-11-22-35 items 2 to 6 (OPEN-2 by item 2, OPEN-4 by item 3, OPEN-3 by item 4, OPEN-5 by item 5, OPEN-6 by item 6).
- OPEN-3 is closed with the bound, by ADV-38.
- ADV-39 item 1's change to ADV-35 item 7 is recorded at form :313.

## The finding of item 5 (form :552-556), clause by clause at 0a2f0022
1. **The join of the watch threads holds.** `SourceWatch::drop` cancels each read, then joins its thread (engine/src/watch.rs:493-505). The thread waits in `GetOverlappedResult` with bWait set, and returns on the abort (:322-331). No code bounds that completion. A thread already inside a sink call returns when that call returns (:332 onward), but its read has then already completed, so the clause still holds.
2. **The drop of the dataset holds.** The dataset is dropped after the guard (kernel/src/skp.rs:1662-1664). Idle connections close when the `Dataset` drops (engine/src/pool.rs:324). The quoted sub-line span is byte-identical to kernel/src/lib.rs:189.
3. **The main thread holds as marked.** `close_dataset` is declared without `async` (commands.rs:133-134). The rule that such a command runs on the main thread is correctly marked as taken from documentation.

This gate does not gate it.

## Records
- **The copy.** By reading, every new text in Amendment 1 is byte-identical to its fence:
  - item 1's E-1, E-2 and D-2 to D-4 match my attempt 1 report (:47, :62, :68, :101, :110, :119);
  - D-1 and items 2 to 6 match my draft (:37, :56-71, :83, :93, :106, :119-121, :134, :140, :153-157, :170, :180-182, :201, :209, :221, :238-242, :257, :265).
- **Old texts and lines.** Each occurs once in the form above the amendment. Their places in the form are :56, :77, :82, :83, :87, :89, :97, :102, :104-109, :110, :117, :146, :153, :166, :168, :169, :170, :193, :201, :205, :212, :223 and :231.
- **Quoted passages.** There are two:
  - `"describe"` (form :538), the phase literal at admitDataset.ts:60;
  - the lib.rs:189 span.
  Both match their sources.
- **Ledger and self-lines.** There is no line cite into the ledger and no bare self-line. Self-references are by section and amendment.
- **Pins.** The code pins at 44c61323 are historical reading aids. The tree at 0a2f0022 matches each cite I relied on, so the pin and the tree agree. Where they ever differ, the worker re-derives the cite at the branch base (form :31).
- **Gate-log row 843.** It resolves: it is the 843rd row, at file line 859, which is this node's attempt-1 FAIL.
- **Item 8.** Marked as a paraphrase, and it matches ADV-35 items 7 and 8 and ADV-38 item 6.

## Notes (not findings)
- **OPEN-3's recommendation (form :249).** It says a quick retry cannot overtake the close. Past the bound that no longer holds. The claim sections already say so (form :416, :440), and item 7 closes OPEN-3 with the bound. The closing amendment may point to form :440, but this is not required.
- **S5's first assertion.** It needs a microtask flush before the clock moves. If the worker uses `await vi.advanceTimersByTimeAsync(0)`, M6 is still killed at the 1999 ms assertion.
- **For the queued item-5 node.** The bound helps only if the webview can run its timer and render while a close holds the host's main thread. That depends on the same documented main-thread fact. The piece makes no claim about it, and ordinary use is not known to reach it.

No code is written before this verdict is filed (ADV-2026-11-22-35 item 1).

Files read (all under C:/dev/wt/read-1122/):
- governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md (whole)
- state/consults/gates/2026-11-22-describe-fails-after-opened-closes-the-handle-form-gate-architect.md
- the ADV-2026-11-22-32, -35, -38 and -39 rulings under state/directives/
- state/consults/2026-11-22-describe-fails-after-opened-closes-the-handle-open-3-bound-architect.md
- state/consults/2026-11-22-describe-fails-after-opened-closes-the-handle-amendment-1-bound-architect-draft.md
- state/gate-log.json (rows near the end)
- frontends/shell/src/:
  - admission/admitDataset.ts
  - project/openProject.ts
  - skp/client.ts
  - diagnostics/watchdog.ts
  - project/openProject.test.ts (:1-70)
  - admission/admitDataset.test.ts (:1-60)
  - admission/AdmissionPanel.tsx (:160-244, :460-499)
- frontends/shell/src-tauri/src/commands.rs (:75-159)
- kernel/src/project/mod.rs (:18-29, :255-269, :774-785)
- kernel/src/skp.rs (:1612-1676)
- kernel/src/lib.rs (:183-192)
- engine/src/watch.rs (:315-334, :484-515)
- engine/src/pool.rs (:310-327)

Model: claude-opus-5-5 (Opus 5.5).
