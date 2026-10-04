*Custodian's filing note (2026-10-04): PR #172's gate 1, the architect, for PLAN node `evidence-recorder-v0`, under the tag node:evidence-recorder-v0@g2. Reviewed: cut/evidence-recorder-v0 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is d1dc8f4249456b1229f34fd3f800a71b83f06c96c4bac9e99d57ebabc5d42880. Write audit PASS: zero write calls (Read 19, Grep 10, Glob 1, the hand-back 1). C3: the worktree is at 976e64cd with an empty porcelain before (13:27:26Z) and after (13:40:40Z); the architect read a byte-exact export of the head's `tools/mods/` tree while the parallel reviewer ran mutations in the worktree. Main moved during the run only by the human's merges of #170 and #171 and the custodian's records. Profile paths redacted at filing: none.*

---

Reviewed: cut/evidence-recorder-v0 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8

**Verdict: FAIL** at this head. The code passes: I found no code defect, and observe-only holds on every hook path. The head fails on two S1 record findings, plus one S2 finding in the README. All three can be fixed on the branch with no code change.

**How I read it.** Branch files were read from the byte-exact export `C:/dev/wt/rec-head-976e64cd/tools/mods/`. Line numbers are cited at 976e64cd. Main-side files were read in the main checkout, which was at ff7b9f85 per the session's start snapshot. The worker report is cited by section. `DECISIONS-PENDING.md` is cited by round and item only. I ran nothing and made no write call. Two things are left to the reviewer, who has Bash: byte equality of the form's lines 1-459 against main, and every hash. As a spot check, the F1, F7, F14, E5, §5 Predictions and §7 Size lines sit on the same line numbers on main and on the branch.

## Findings

**S1-1: worker reading R3 changes §2.3's instrument, and no amendment records it.**
- §2.3 defines `recorder_ms` as the recorder's own wall time on the call path (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:188`). §7 bounds before + after + write (line 385). §1 claim 7 (line 98) and §9's overhead stop (line 457) are read against that sum.
- In the code, `write` stops before serialisation (`tools/mods/spatial-evidence-recorder/hooks/register.js:392-415`). The line's digest and the `$.fs.write` call happen after it, in `writeRecord` (register.js:417 calling 343-348). So the sum leaves out on-path work, probably the largest part after git. Worker report §9 R3 says so.
- A record cannot hold its own write time, so the code is the only possible reading of a single record. But the form's quantity is no longer what is measured, and the stop rule could pass while the real overhead is over the bound.
- Needed before merge: a class-2 row stating that the sum is a lower bound that excludes the line digest and `$.fs.write`. §1 claim 7 and §9's overhead stop are then read that way, until an amendment made before E5 names how write latency is measured. One option is the file's mtime minus `ended_at`, added to `before`.

**S1-2: Amendment 1 does not fully match the evidence it cites.**
- (a) **A class-2 result is missing.** §5 says that a `validate` difference confined to a `(via …)` annotation is class 2 (form :350). Worker report §7 shows exactly that difference: `(via agentTypeOf)`, `(via writeRecord)`, `(via gitRun)`. Amendment 1 still says it touches these three only (form :475).
- (b) **C2-b cites the wrong section.** It cites §2.4 for the log-root lookup (form :469). The lookup is in §2.7 (form :219).
- (c) **C2-c claims more than the evidence shows.** It says the never-asked counters cover the other forbidden calls (form :473). The counters cover six names only: `fs.read`, `fs.list`, `fs.stat`, `fs.exists`, `session.root`, `session.cwd` (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:93-98`; worker report §9 C2-c). The rest of §8 item 3's set (`$.model`, `$.ui`, `$.store`, other `$.session.*`, `$.process.spawn`) is ruled out by `validate`'s calls line, not by a counter.
- (d) **C2-a points at an E-row that does not exist.** It says an E-row shows the live path spelling (form :468). No E-row in §4 (E0 to E7) records that. Either name a row or drop the sentence.
- Fix: one appended Amendment 2. This is correction round 1 of 2 under the record cap. Each correction is at most three sentences (round 12 (d)), written as references, and the round ends with a superseded index.

**S2-1: the README against §2.10 and the brief.**
- **§1 limits missing.** §2.10 asks for §1's limits (form :234). The README leaves out two:
  - live behaviour before its E-row: the chain order with Guardian (E1), and live subagent firing, usage and listing (E3);
  - the loading limit.
  - Meanwhile README:3 states one line per subagent turn as plain behaviour.
- **Pruning has no age.** The pruning step (README:37) says "old day folders" without an age. The brief sets 30 days (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:29`), and nothing in the form overrides that. The human sights this step before install (form :454).
- **Off-switch warning missing.** §2.10 says the off-switch is never `disableAllHooks` (form :245); the README leaves this out. §8 item 16 is not crossed, because the README never names it.
- **No acceptance and stop.** The README carries no acceptance-and-stop reference (form :249).
- All four are in-Scope README edits. §7 is recounted after them.

**N-1: R1, R2 and R4 to R7 fit the form. None needs an amendment; this report is their record.**
- **R1:** §2.4's true and unavailable clauses conflict when one pair differs and another is unavailable. The code lets a known difference win (register.js:284-288). That matches the brief's definition, and such a flag is never a false one.
- **R2:** §2.5 sets `backgrounded_after_ms` only when the engine reports it (form :209), the same pattern as `return_code_interpretation`. Writing `unavailable` would claim ignorance where the state is known, so §8 item 6 is not crossed.
- **R4 and R5** match §2.2's not-approved table and §2.4's unresolved rule.
- **R6** fills a silence in §2.7.
- **R7** adds fixtures and narrows nothing.

**N-2: a shell `&` is treated as a separator, as §2.2 says.** So `cargo test &` is approved, and its after-snapshot can be taken before the command ends. This follows the form. It is a candidate README limit or window note.

**N-3: unquoted backslashes.** The matcher keeps an unquoted backslash (register.js:120-132) where bash drops it. This affects F3's `node scripts\plan\verify.mjs` and §2.4's backslash `cd` form. Both follow the form's own rules (A4, §2.4). The record then follows a call that bash garbled, and `tool_is_error` carries the outcome.

**N-4: smaller notes, no action needed.**
- §2.11 calls the owning boundary `logRoot`; the code uses `logRootFrom` and `resolveLogRoot`. The reference still resolves.
- `validate` warns about the missing `version`. That is not a hook or a call, so §1 claim 6 is unaffected.
- `tool_is_error` has no `unavailable` route, although §7 counts it; §2.5 defines only two arms.
- recordUsage reads `e.agentId` outside its try (register.js:426). The typed event is always an object.

**N-5: left to the reviewer or custodian.** §8 item 10 (commit messages) and item 15 (merge method) cannot be read from the export.

## Checklist (form §9, Architect)

- **Gating heads:** §21a and §21c both apply; there is full gating and no five-line form. Pass.
- **Brief §1 to §4 against §2:**
  - The brief's §1 observe-only rules are carried by §2.1 and §2.9.
  - §2 scope departures (file-per-record in place of append, A3's breadth, the outcome fields, the log root outside the repository) are each covered by a round 50, item 1 ruling.
  - The 30-day age is not carried (S2-1).
  - §4's overhead test depends on S1-1.
- **The mods-roadmap ruling, items 1 to 3** (`state/directives/2026-10-03-evidence-recorder-ruling.md:12-15`):
  - (1) guardian-v0's gates and merge came first (the guardian install-approval RULED block);
  - (2) nothing in the piece installs anything (worker report §12; README:52);
  - (3) the README states that recorder lines are not citable (README:41).
  - Pass.
- **Round 50, item 1, against §0.4:** each of O-1 to O-13 matches the code and the tests, and O-8 runs no probe. O-6's `recorder_ms` depends on S1-1, and O-2 (iii)'s README step on S2-1.
- **Seams:**
  - **The mod API:** the code matches P0's 2.1.288 type reads (`$.process.run` result, `ModelUsage` names, `AgentInfo.type`), and `claude plugin test` runs the engine's own dispatch at 2.1.289.
  - **git:** the five shapes recorded in worker report §4 match the stubs (recorder.test.ts:99-127). The header names ea5aba5d120e and git 2.49.0.windows.1 (recorder.test.ts:7-10). I7 did not fire.
  - **Guardian:** there is no seam. A recorder rejection only passes on what `next` rejected with.
  - **Product callers:** the only `export` is `register`.
- **Portability, R1 to R6:** no `process.platform`. The drive spelling appears only in `leadingCdDir` (register.js:184). Both separators are handled. macOS and Linux are declared unavailable. Pass.
- **§8, item by item:**
  - items 1-4: pass (single `gitRun` site register.js:218-221; `next` once on every path, register.js:366, 378, 425);
  - items 5-7: pass;
  - item 8: pass per worker report §12;
  - item 9: pass per the custodian's check;
  - item 10: pass in the files, commit messages to the reviewer;
  - item 11: pass (20 of 20 `RECORDED MUTATION` comments, each with its observation commit; the `verify-mutation` run is named a presence check in worker report §6);
  - item 12: pass (1109 of 1400, no class-9 addition);
  - item 13: pass (the branch commits are named in words, with no hash);
  - item 14: to the reviewer's recount;
  - items 15-20: pass or not applicable;
  - item 17: pass.
- **Observe-only (§2.1, §2.9) on every path:**
  - the not-approved and background path returns `next(e)` (register.js:366);
  - the before-side failures are caught (register.js:370-374);
  - deny or null passes through untouched (register.js:382);
  - the after-side and write failures are caught (register.js:418-421);
  - the usage hook does work only after `next`, with failures caught (register.js:425-458);
  - there is no `.catch`, no own `deny`, `context`, `result` or `text`, and no mutation of `e` or of the returned value.
  - Pass.
- **Amendment 1:** the classes are right (class 2 for all three). No prediction is edited, as far as my spot check shows. The results do not fully match the evidence (S1-2).

**O-14:** nothing in the build changes it, and it holds nothing.
- A call that is not approved makes no `$` call in any order (register.js:366; T2's no-call check). So a refusal of such a call bears on no order.
- A G1-style refusal that leaves a quote open is not approved (register.js:192; T2's `cargo test "x` and `cargo test 'x` fixtures).
- This matches the reading at form :337.

## What the next record needs

1. **Amendment 2**, class 2, correction round 1, appended:
   - a row for S1-1;
   - the `(via …)` row;
   - corrections (b) to (d) of S1-2, each at most three sentences;
   - a superseded index at the end.
2. **README edits** for S2-1, then §7 recounted.
3. **Re-gate** on the new head by reference to this report. register.js is unchanged, and the reviewer observes the mutations at the gated head (§9).
4. **Merge with a merge commit,** so that 9acc86b8 and 32fc334f, which Amendment 1 names, stay reachable from main (§8 item 15).
5. **PR body** carries both `validate` runs, as text and `--json` (§4).

Files read:
- `C:/dev/wt/rec-head-976e64cd/tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md`
- `C:/dev/wt/rec-head-976e64cd/tools/mods/spatial-evidence-recorder/hooks/register.js`
- `C:/dev/wt/rec-head-976e64cd/tools/mods/spatial-evidence-recorder/test/recorder.test.ts`
- `C:/dev/wt/rec-head-976e64cd/tools/mods/spatial-evidence-recorder/README.md`
- `C:/dev/wt/rec-head-976e64cd/tools/mods/.claude-plugin/marketplace.json`
- `C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-worker-report-1.md`
- `C:/dev/spatial-ide/state/directives/2026-10-04-recorder-o-items-ruling.md`
- `C:/dev/spatial-ide/state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md`
- `C:/dev/spatial-ide/state/directives/2026-10-03-evidence-recorder-ruling.md`
- `C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-architect-draft.md` (part 2)
- `C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-p0-report.md` (§5, the type excerpts)
- `C:/dev/spatial-ide/state/directives/PORTABILITY-2026-09-30.md`
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`
- `C:/dev/spatial-ide/DECISIONS-PENDING.md` (round 50 RULED block)
