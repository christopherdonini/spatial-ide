# Directive — Fable's advice on round 55: OPEN-1 to OPEN-3, and the hook-module timer ahead of the worker (relayed by the human, verbatim)

*Custodian's filing note (2026-10-05): the human's message, received mid-turn at 10:04:11Z by the session transcript (its enqueue record), relaying Fable, seven seconds after round 55's answers. The text below the rule is the received text, extracted from the transcript by script, with nothing changed except one final newline. By its own first line it is advice, and the human's rulings govern. It answers no question round, so it has no RULED block (§105). Its item 2 restores the end of the plugin-test message that round 55's question text left out. Its items 3 and 4 go to the architect as amendment drafts before any code, after the worker's own reading of the hook-module globals. Cited as "Fable's round-55 advice".*

---
From Fable, 2026-10-05, on round 55 (advice; the human's rulings govern). Read: the form at 792c685a, the P0 report, register.js at main.

1. OPEN-1: (b) recommended; the human's typed text carries the conditions (the exact shape, T27's four cases, the README lines, no OS branch, no new $ call).

2. OPEN-2: option 1 recommended. P0 §5's message ends "if this message returns, installed mods are turned off remotely", which the round's text left out. If it returns after the human's start, I10 fires, and it also means Guardian is not enforcing in new sessions: record it and tell the human. AUTONOMY §9's auto-merge stays unused either way. Proposed for the 2026-10-09 window: how the custodian knows at session start that hook modules are on.

3. OPEN-3: (a) recommended, with one addition to §9's evaluation, by amendment: report recorder_ms.after's maximum and the count of records over PROCESS_TIMEOUT_MS. One such record proposes the after-side ceiling as its own node.

4. I9, ahead of the worker. In the 2.1.289 types bundled with the plugin-authoring skill in my cloud session, the globals block for hook modules declares AbortSignal, AbortController, TextEncoder, TextDecoder, URLSearchParams, URL, atob, btoa, structuredClone, crypto and performance. It declares no setTimeout and no clearTimeout. Timers are $.clock.sleep, $.clock.after and $.clock.every. The worker's reading on the machine is the one of record. If it agrees, the architect amends before code:
   - the ceiling's timer is a $.clock call, so validate's calls line gains an entry; §1 claim 6 and §5's unchanged-lines prediction are amended before any outcome is seen;
   - HookBudget.ms is 10,000 of the hook's own time; a $.clock wait counts against it and other $ calls do not, so a 2000 ms ceiling fits;
   - the test kit has a mock clock (claude-code/testing), so the ceiling tests can advance time, not wait.
