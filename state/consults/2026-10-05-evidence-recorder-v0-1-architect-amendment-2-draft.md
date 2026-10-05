*Custodian's filing note (2026-10-05): the architect's draft of Amendment 2 to `tools/mods/EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md`, on the worker's phase 0 (`state/consults/2026-10-05-evidence-recorder-v0-1-phase0-report.md`) and Fable's round-55 advice, items 3 and 4. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b03f620c0c9774e00d173e1545ee603518d5a60fa1954d8f58a06b65442f1d53. The amendment's fenced block is appended to the form with the custodian's 12 pins at 0c382bda, and nothing else in it is changed. Write audit PASS: zero write calls (Read 11, Grep 10, Glob 2, the hand-back 1). The run lasted 10:31:45Z to 10:38:12Z (127,462 subagent tokens, 24 tool uses). C3: at the dispatch the main checkout also held the custodian's own uncommitted filings (the phase 0 report and the item J files), committed during the run, so main moved from c81d3032 to dca1eddd. The draft says it read the working tree at c81d3032, and its tools/mods files are unchanged between 0c382bda and both commits. After (10:39:21Z) the porcelain held only its two pre-existing untracked items. Its OPEN-4 (widening the calls line that round 50, item 1, O-3, ruled) goes to the human as a red line. Profile paths redacted at filing: one, in its files-read list (the scratchpad path of the phase 0 report, replaced by a placeholder and the filed path); the sha256 above is of the text as received.*

---

Reviewed: main @ 0c382bda

**Verdict:** I drafted Amendment 2 in full, but part of it is held. The ceiling now needs one `$.clock` call. That adds an entry to the calls line the human ruled closed in round 50, item 1 (O-3), so the ceiling's code waits for the human (OPEN-4, part 3). Everything else in the piece can go ahead now.

**1. Dispositions**
1. **I9 has fired.** The ceiling's timer becomes one `$.clock.sleep`, made only in a new function `beforeCeiling`. It is raced against the before stage and stopped through an `AbortController` signal as soon as the race settles.
   - It costs at most 2000 of `HookBudget.ms` 10_000 per dispatch.
   - The calls line gains exactly one predicted entry. §1 claim 6, §5's prediction and §8 item 6 are amended by reference.
   - T24 moves to the mock clock and stops waiting in real time. T28/F24, I13/I14 and §8 items 17 and 18 are added.
   - A reading step (r1 to r4) must run before the ceiling's code. That code waits for OPEN-4.
2. **Fable's item 3** becomes §9 evaluation row (d). It is reporting only, with no code. I recorded it as class 7, not class 9, because no rule of the human adds it.
3. **Classes:**
   - the change of timer mechanism is class 2, forced by the reading;
   - the new calls-line entry becomes class 9 once the human rules OPEN-4 (a), the same way Amendment 1 carried OPEN-1; its shape is declared here so that no code of it comes before its declaration;
   - item 3 is class 7;
   - phase 0's Steps A and C are recorded only, with no claim changed.
   - §7: about 89 lines are added, for an estimate of about 841. That is under the 1000-line ceiling, with the 6 files unchanged, so there is no class 8 overrun.

**2. The amendment**

```
### Amendment 2 — I9 fired: the ceiling's timer is one `$.clock` call (class 2; its calls-line entry held for OPEN-4, then class 9); §9 evaluation (d), the after side's maximum (sight-list addition, class 7); phase 0's Steps A and C recorded

*Written before any outcome of this piece: no code, test or live row of this piece exists. The worker's phase 0 (`state/consults/2026-10-05-evidence-recorder-v0-1-phase0-report.md`, cited by section) ran only the switch check on the unchanged v0 folder and type and tool reads, and stopped before code, as §2.8 and I9 require. Type cites are typed at 2.1.288 as phase 0 Step B records them; the architect did not re-read them. Nothing below is a quotation.*

- **Phase 0, Step A, recorded: I10 has not fired.** `claude plugin test` on the unchanged v0 folder at 0c382bda exited 0 at 2.1.289, 20 pass (Step A). No claim changes.
- **Phase 0, Step C, recorded (§4's verify-mutation statement, tool at 0c382bda, round 15 (c)).** The tool names no directory. Its test globs are `scripts/plan/verify-mutation.mjs:249 @ 0c382bda sha256:HASH-TBD`, passed as git pathspecs at `scripts/plan/verify-mutation.mjs:259 @ 0c382bda sha256:HASH-TBD`. Step C states from git's pathspec semantics, without running it, that `tools/mods/**/*.test.ts` and `scripts/evidence/*.test.mjs` match. Before any reliance on the tool, the reviewer confirms that by a run at the gated head. No `verify-mutation` run is an observation of a mutation (round 25, item 2 (c)); §4's observation rule is unchanged.

- **A2-1. I9 has fired (§5; §2.8). Class 2: the ceiling's mechanism changes, forced by the reading.**
  - **The reading** (Step B): no `setTimeout` or `clearTimeout` is declared for a hook module. Hook modules have no timers and wait on `$.clock` (`<skill-root>/types/claude-code.d.ts:13763-13772`, typed at 2.1.288). `$.clock` has `now`, `sleep`, `after` and `every` (`<skill-root>/types/claude-code.d.ts:3218-3257`, typed at 2.1.288). `sleep` takes options carrying a `signal` (`<skill-root>/types/claude-code.d.ts:3234`, `<skill-root>/types/claude-code.d.ts:3239`, typed at 2.1.288). `AbortController` is a declared global (`<skill-root>/types/claude-code.d.ts:13830-13834`, typed at 2.1.288). §0.4 item 6's P0 gap is closed by this reading.
  - **§2.5, the shape. It replaces the timer that §0.4 item 6 and §2.5 presumed; the race, its outcomes and `PROCESS_TIMEOUT_MS` are unchanged.**
    - The only `$.clock` call is `$.clock.sleep(BEFORE_CEILING_MS, { signal })`, made inside a named function `beforeCeiling($, signal)` and nowhere else.
    - It is called once per dispatch, only on a `session-default` or `leading-cd` plan, after `snapshotBefore` (`tools/mods/spatial-evidence-recorder/hooks/register.js:252-266 @ 0c382bda sha256:HASH-TBD`) has started. It replaces the try at `tools/mods/spatial-evidence-recorder/hooks/register.js:368-375 @ 0c382bda sha256:HASH-TBD`.
    - An unresolved plan and a not-approved call make no `$.clock` call.
    - The stage is raced against the sleep. When the sleep resolves first, the ceiling is reached and §2.5's when-the-timer-wins branch applies.
    - Whichever wins, the controller is aborted before `next(e)` (`tools/mods/spatial-evidence-recorder/hooks/register.js:378 @ 0c382bda sha256:HASH-TBD`), so no sleep stays live during `next`.
    - Both the stage promise and the sleep promise carry a no-op rejection handler (§2.1).
    - A sleep that rejects for any reason other than this abort, or a `$.clock.sleep` call that throws, is never read as the ceiling. The stage is then awaited alone, as v0 awaits it, and `before_ceiling_reached` reads `unavailable`. It is the only path on which the flag takes that value. The flag is outside v0's `UNAVAILABLE_STOP` definition and does not move that share.
    - The header comment on `$` calls (`tools/mods/spatial-evidence-recorder/hooks/register.js:9-10 @ 0c382bda sha256:HASH-TBD`) names the new call.
    - `previous_write` still makes no `$.clock` call; §0.4 item 5 and §8 item 5 stand.
  - **The budget.** `HookBudget.ms` is 10_000 per dispatch, counting only the hook's own time. A `next(e)` call or a `$` call in flight does not count, but a `$.clock` wait does (`<skill-root>/types/claude-code.d.ts:3229-3231`, `<skill-root>/types/claude-code.d.ts:4796-4798`, `<skill-root>/types/claude-code.d.ts:4803-4812`, typed at 2.1.288; `<skill-root>/reference.md:124`, typed at 2.1.288).
    - The types do not say whether the sleep is charged while git calls are also in flight. The bound assumes that it is.
    - So the ceiling charges at most `BEFORE_CEILING_MS` = 2000 per dispatch, because the sleep is aborted before `next`. The hook's own synchronous parse and hashing come on top of that; the after side's calls are `$` calls and are not charged.
    - Declared in §7: `BEFORE_CEILING_MS` stays 2000 and must stay below `HookBudget.ms` (10_000 at 2.1.288). A hook past its budget is absent, and `next(e)` is run on its behalf (`<skill-root>/types/claude-code.d.ts:4803-4812`, typed at 2.1.288).
  - **Reading before the ceiling's code** (§2.8, extended). The worker records each item with line numbers, typed at 2.1.288, before writing `beforeCeiling`:
    - (r1) what aborting the `signal` does to a pending `$.clock.sleep`;
    - (r2) whether the mock clock releases an aborted sleep from hold, and what `MockClock.settle` does (`<skill-root>/types/claude-code.d.ts:14505-14549`, typed at 2.1.288);
    - (r3) how a test file gets the mock (the export of `claude-code/testing` that carries `Mock.clock`, `<skill-root>/types/claude-code.d.ts:14461-14474`, typed at 2.1.288), and whether a test can answer, count or reject `$.clock.sleep` itself, the way it answers `fs.write`;
    - (r4) what the kit does with a `$.clock.sleep` when no mock clock is armed.
  - **What the reading's answers change:**
    - If r1 shows the signal is not honoured, `$.clock.after` with `Timer.cancel` replaces the sleep (`<skill-root>/types/claude-code.d.ts:11912-11917`, `<skill-root>/types/claude-code.d.ts:11923`, typed at 2.1.288). That is class 2, recorded before code, and the predicted entry becomes `$.clock.after (via beforeCeiling)`.
    - If neither member can be stopped, I13 fires.
    - If r4 shows that an unarmed call fails, `arm()` (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:59-60 @ 0c382bda sha256:HASH-TBD`) arms the mock clock, and the import line (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:14 @ 0c382bda sha256:HASH-TBD`) gains the mock. That changes v0 test text beyond §4's T1 and T11 exception; it is class 2, recorded here. No v0 test's own text or mutation comment changes, and the reviewer observes every mutation at the gated head (§9).
    - If r3 shows that `$.clock` calls cannot be counted, T22's no-`$`-call check covers the stubbed members only. The clock half of §5's falsification, an F19 call making a `$` call, is then checked by reading (§8 item 17), and §1 claim 2 is narrowed by that clause.
  - **The calls line. This prediction is made before any outcome and replaces §1 claim 6 and §5's `validate` prediction by reference; their text stands.**
    - `validate` on the folder and on `tools/mods` prints P0 §5's hooks line (`state/consults/2026-10-05-evidence-recorder-v0-1-p0-report.md:191 @ 0c382bda sha256:HASH-TBD`) byte for byte, with the one `version` warning.
    - Its calls line (baseline `state/consults/2026-10-05-evidence-recorder-v0-1-p0-report.md:192 @ 0c382bda sha256:HASH-TBD`) gains exactly one entry, `$.clock.sleep (via beforeCeiling)`, placed between the `$.agent.list` and `$.fs.write` entries. The other three entries are unchanged.
    - A difference confined to a `(via …)` annotation, or to the added entry's position, is class 2.
    - §8 item 6 reads: a `$` call outside v0 §2.0's calls line, other than this one entry.
    - v0 §8 is read with the same exception (§8 item 1).
  - **The calls-line entry is held.** It widens the calls line ruled in round 50, item 1 (O-3), which only the human can widen (OPEN-4). No code of `beforeCeiling`, of the race, of the flag's `true` or `unavailable` paths, of T24 or of T28 lands until the custodian appends OPEN-4's ruling row.
    - On (a), that row records the entry as a class 9 scope addition citing the round and item, with the shape declared in this row.
    - On (b), I14 fires.
    - The rest of the piece (runner, A5, `repeat`, `previous_write`, Amendment 1's translation) does not wait.
  - **§3 F21, replaced by reference.** As F1, but the before-side git answers are held until after the hook's result has been read. Three cases:
    - (i) once three before-calls are pending, the mock clock is advanced by `BEFORE_CEILING_MS`;
    - (ii) it is advanced by `BEFORE_CEILING_MS` − 1, then the answers are released;
    - (iii) the answers are prompt.
    - Predicted: (i) as §3 F21 predicts, with no second write after release and `MockClock.settle`; (ii) and (iii) give `before_ceiling_reached` false with the before-fields set.
  - **§4 T24, the method.** It advances the mock clock and never waits in real time on the passing path.
    - The stub signals when three before-calls are pending; the test then advances.
    - A real-time release at 3 × `BEFORE_CEILING_MS` uses the test runtime's `setTimeout` (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:119-125 @ 0c382bda sha256:HASH-TBD`; §0.5). It bounds only a mutated run and is cleared on the passing path.
    - The test asserts that the result arrived before any release, with the bottom `tool.call` stub reached once.
    - Its name and mutation are unchanged: the before stage awaited without the race. Under that mutation the result arrives after the release, so the test fails by assertion and does not hang.
  - **§3 F24 and §4 T28, added** (only if r3 shows a test can reject `$.clock.sleep`):
    - F24 is F1 with the sleep rejected. Predicted: before-fields set, `before_ceiling_reached` `unavailable`, `next` reached once, result unchanged.
    - T28: `a ceiling timer that cannot be set leaves the before-fields set and reads the ceiling flag unavailable`; its mutation: a rejected sleep read as the ceiling reached.
    - If r3 shows no such means, T28 is not written, and §1 may-not-claim gains this path.
  - **§1 may not claim, added:**
    - the ceiling when `$.clock` fails;
    - that the live engine's `$.clock` keeps the mock clock's time;
    - whether the sleep is charged while git calls are in flight;
    - a ceiling reached live.
  - **§4 E8, read added:** E8's predicted `before_ceiling_reached` false also shows the live `$.clock.sleep` seam did not fail on the stage-won path (a failure reads `unavailable`). This is the seam's end-to-end proof from the real shape (§2.8).
  - **§5, added:**
    - I13: neither `$.clock.sleep` with a signal nor `$.clock.after` with `cancel` can be stopped, or the mock clock answers neither. Stop; the shape returns to the form.
    - I14: OPEN-4 is ruled (b). The ceiling leaves the piece by a class 5 amendment before any of its code: §2.5's race, `before_ceiling_reached`, F21, T24 and T28 are removed, and brief §3.4 is recorded as unmet.
  - **§8, added:**
    - 17. A `$.clock` call outside `beforeCeiling`, more than one per dispatch, or on an unresolved plan or a not-approved call; `setTimeout`, `clearTimeout` or any global not declared for hook modules in `register.js`.
    - 18. The sleep left live past the race or into `next`; a rejected sleep read as the ceiling; `BEFORE_CEILING_MS` at or above `HookBudget.ms`.
  - **§9, architect:** the seams are read with Step B and r1 to r4.

- **A2-2. Sight-list addition, class 7: §9 evaluation (d), the after side.**
  - **Evidence:** P0 §4 found that the per-call `timeoutMs` did not bound `recorder_ms.before` (the 4276 ms record). The after side keeps only those per-call timeouts (§2.5; OPEN-3 (a)), and §9 names no measure of it.
  - **The row:** over the window's schema-v0.1 run records, the custodian reports `recorder_ms.after`'s maximum, naming its record, and the count of records whose `recorder_ms.after` exceeds `PROCESS_TIMEOUT_MS`. Counted by hand.
  - **What `recorder_ms.after` spans:** the outcome fields, the after snapshot and the agent listing (`tools/mods/spatial-evidence-recorder/hooks/register.js:383-390 @ 0c382bda sha256:HASH-TBD`). So a count above zero does not by itself show that a git call outlasted its timeout.
  - **The trigger:** a count of one or more leads the custodian to propose an after-side ceiling to the human as its own PLAN node.
  - It is neither a stop condition nor a scored measure. It adds no code, narrows nothing, and changes no claim elsewhere; OPEN-3 (a) stands.
  - **Fable's round-55 advice, item 3:** this row carries it. It is not class 9, because no standing rule of the human adds it.

- **§7 (no class 8):**
  - The added estimate: `register.js` +25 (`beforeCeiling`, the race and the flag, the header comment), plugin tests +60 (import and `arm()`, T24's clock method, T28, the reading comment), README +4 (the ceiling's clock), and 0 for A2-2.
  - That brings the estimate to about 841 lines, against the declared ceiling of 1000 lines and 6 files. The file list is unchanged.

**Superseded index** (by reference; the earlier text stands as written):
- §0.4 item 6's P0 gap: closed by A2-1.
- §2.8's timer bullet: fired, read in A2-1.
- §1 claim 6, and §5's `validate` prediction: replaced by A2-1's calls-line prediction.
- §8 item 6: read with A2-1's one entry.
- §3 F21's real-time release: replaced by A2-1's F21.
- Fable's round-55 advice, item 4: carried by A2-1; item 3: carried by A2-2.
```

**3. For the human**

**OPEN-4: the ceiling's timer and the ruled calls line.**
- Round 50, item 1 (O-3) closed the Recorder's calls line to `$.agent.list`, `$.fs.write` and `$.process.run`. This form keeps that line through §8 item 6.
- The brief's §3.4 ceiling, approved by line 2, can only be enforced with a `$.clock` call, because hook modules have no timers. P0 §5 had predicted that a timer would add no call; that rested on `setTimeout`, which does not exist here.
- **(a), recommended:** widen the calls line by exactly one entry, `$.clock.sleep` (or `$.clock.after` if r1 requires it), in `beforeCeiling` only. It is then recorded as class 9.
- **(b):** no enforced ceiling. The piece keeps v0's per-call timeouts, brief §3.4 goes unmet, and that is recorded as class 5 (I14).
- The brief treats each merge as the security-posture change, and this item widens the mod's declared `$` surface. I recommend asking it as a typed item. I did not read AUTONOMY §4, so I have not decided whether it is a red line.

**4. Files read**
- C:\dev\spatial-ide\tools\mods\EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md
- <the custodian scratchpad>\rec01-phase0.md (filed as state/consults/2026-10-05-evidence-recorder-v0-1-phase0-report.md)
- C:\dev\spatial-ide\state\directives\2026-10-05-fable-advice-round-55.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (round 55's RULED block)
- C:\dev\spatial-ide\state\consults\2026-10-05-evidence-recorder-v0-1-p0-report.md (§4 and §5, and its filing note)
- C:\dev\spatial-ide\state\directives\MODS-V1-2026-10-05.md (§3 to §5)
- C:\dev\spatial-ide\state\directives\MODS-EVIDENCE-RECORDER-V0-2026-10-03.md (its item 7, by search)
- C:\dev\spatial-ide\tools\mods\EVIDENCE-RECORDER-V0-PREREGISTRATION.md (§0.4, §1, §2.0 and §2.1, and the `UNAVAILABLE_STOP` definition)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (classes 1 to 9, and the round 25 additions)
- C:\dev\spatial-ide\tools\mods\spatial-evidence-recorder\hooks\register.js
- C:\dev\spatial-ide\tools\mods\spatial-evidence-recorder\test\recorder.test.ts

I read the repository files in the working tree, which is at c81d3032, later than 0c382bda. The red line bars writes to these paths before the merge, so the files should be the same at 0c382bda, but the custodian's hashes are the check. I could not find `<skill-root>`, so every type cite rests on phase 0 Step B.
