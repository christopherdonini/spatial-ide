*Custodian's filing note (2026-10-05): PR #177's gate 1, the architect, for PLAN node `evidence-recorder-v0-1`, under the tag node:evidence-recorder-v0-1@g1. Reviewed: cut/evidence-recorder-v0-1 @ 05fc645d64c6c59b1f682f04f585e72243f8a272 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 843d5402310a367fe41391346d6359139c010775c4a2de1e3c94fb00066a557d. Write audit PASS: zero write calls (Read 20, Grep 4, Glob 1, SubagentHandback 1). The architect read the PR's files from the read-only export `C:/dev/wt/rec01-head-05fc645d` while the reviewer ran mutations in the worktree. Profile paths redacted at filing: none.*

---

Reviewed: cut/evidence-recorder-v0-1 @ 05fc645d64c6c59b1f682f04f585e72243f8a272

**Verdict: PASS** (architect, gate 1, `node:evidence-recorder-v0-1@g1`). No S1 findings. Two S2 findings go into the closing record and do not block the merge. Six N findings follow.

Severities: S1 blocks the merge. S2 needs no code change but must be carried in the closing record. N is a note.

Read: the form on main with Amendments 1 to 4; the PR files in the read-only export `C:/dev/wt/rec01-head-05fc645d`; worker report 1; the P0 and phase 0 reports; the round 55 and round 56 typed rulings and their RULED blocks; brief §1 to §5; and line 2 of the 2026-10-05 direction. Every `path:line` below that points into the PR's files is at 05fc645d and carries no hash (round 15 (e)). Unquoted text is my paraphrase. Nothing was run. The architect has no shell, so the suites, mutations, `validate` and the §7 recount are the reviewer's to observe.

## Gating heads
- **§21a, security posture.** Met. The merge waits for the human's typed approval naming E8 and E9 (the form's Red line; §9 Operator). Amendment 3 restates that this still holds.
- **§21a, a property under test.** Met. Observe-only and pass-through hold by reading on every new path:
  - `recordRun` calls `next(e)` once and returns `ran` itself (`tools/mods/spatial-evidence-recorder/hooks/register.js:465`, `:478`, `:524`).
  - `raceBefore` sits inside a `try` (`:470-474`) and cannot throw past it.
  - Tests: T26, and T13 from v0.
- **§21c, size.** 633 changed lines over 6 files (worker report §6), against 1000 and 6. No class 8. The §7 line is unedited; Amendment 2 adds its estimate by amendment. The reviewer recounts.

## Brief §1, §3, §4, §5 against §2, and line 2
- **§1:** the Recorder adds nothing the model reads and returns every result exactly as `next` produced it.
- **§3.2:** the runner matches it. Row A5 approves a tail only when rows A1 to A4 approve it (`register.js:195`). D10 follows the brief's words.
- **§3.3:** carried as §2.6, built at `register.js:383-391`.
- **§3.4:** carried by the race, with one declared exception. When `$.clock` fails, the stage is awaited alone. A2-1 declared that path, round 56 accepted A2-1's shape, and §1 may not claim the ceiling when `$.clock` fails.
- **§4:** the paths are disjoint from `engine/`, `kernel/` and `protocol/`.
- **§5:** items 1, 2 and 5 are carried. Line 2's brief rule is stated in README line 31 as the custodian's practice from the merge on.

## §0.4's settlements as built
- Item 1: the runner has no `npm` route, and A2 is kept inside A5 (`scripts/evidence/repeat.mjs:44`; `register.js:195`).
- Item 2: the runner has no prefix parse, and the tail is not normalised. T22 covers the `CARGO_TARGET_DIR=` and `timeout 900` tails.
- Item 3: ruled under OPEN-1 (see the translation below).
- Item 4: README line 31.
- Item 5: `Date.now()` in `writeRecord` (`register.js:384`, `:390`). There is no `performance` call and no `$.clock` call on that path.
- Item 6: the stage race, as A2-1 shapes it.
- Item 7: no remedy for cold trees.
- Item 9: phase 0 Step A shows I10 did not fire.

## The seams (§2.8), with r1 to r4
- **Runner to A5.**
  - The runner's grammar puts the separator directly after `<n>` (`repeat.mjs:23-25`). A5 requires `t[3] === '--'` (`register.js:191`). The two agree.
  - The F18 strings are the real call shape. E8 is the end-to-end proof.
- **register.js to the mod API.**
  - `$.clock.sleep(ms, { signal })` is read at the typed sleep signature and `SleepOptions` (worker report §2, r1; typed at 2.1.288).
  - The code calls exactly that shape (`register.js:407-409`).
  - r1: the sleep rejects at once on abort, so `$.clock.after` is not used.
  - r2: the mock drops an aborted held wait; the hook relies on nothing after the race.
  - r3: observed at 2.1.289, not typed. A test cannot register its own clock hook beside an armed mock (D2).
  - r4: an unarmed sleep throws, so `arm()` arms the mock.
  - The four readings agree with A2-1's branches. I13 did not fire.
- **Record to reader:** the evaluation is by hand, and no reader code lands.
- **Guardian:** nothing in code.
- **Callers:**
  - `beforeCeiling` is called only by `raceBefore`, and `raceBefore` only by `recordRun`. `repeatOf` is called only by `planFor`. `lastWrite` is read by `recordRun` and set by `writeRecord`.
  - Nothing is exported beyond the existing `register`.
- **The end-to-end order of the reading:** r1 to r4 are recorded only in report 1, which was filed after the build. That they came before the code rests on the worker's statement (report §2 heading). See N4.

## R1 to R6 against §2.9 (`state/directives/PORTABILITY-2026-09-30.md:33-65`)
- **R1:** the runner behaves the same on both platforms. The one exception, `.cmd` and `.bat` files on Windows, is declared as explicitly reduced (§2.9; README line 27).
- **R2:** there is no `process.platform` branch in the runner or its tests (`repeat.test.mjs:1-4`). The owning boundaries are the one `spawnSync` call and `leadingCdDir`.
- **R3:** stated for Windows, Linux and macOS (macOS deferred, recorded in §2.9). Tests run locally on Windows and in CI on ubuntu-latest.
- **R4:** the drive translation is a Windows assumption, but it sits inside the declared boundary `leadingCdDir`, was ruled by the human, and is declared off Windows (README line 19). That makes it a declared limitation, not a finding.
- **R5 and R6:** not engaged. No platform claim is implied upward, and no test is skipped.

## §8, item by item
1. **v0 §8 items 1 to 20, read against this form:** clear.
   - Item 1: `next` is called once per path.
   - Item 2: no `.catch` on a registration. D11's `.catch(noop)` is on the stage promise (`register.js:419`).
   - Items 3 and 4: `gitRun` is unchanged (`register.js:253-256`).
   - Item 5: the calls line holds only the round-56 entry beyond v0.
   - Item 6: every new field has an `unavailable` route.
   - Item 7: no package and no lockfile.
   - Items 8 and 9: no install, and no Guardian change.
   - Item 10: no OS branch, and the drive spelling is translated only inside `leadingCdDir` (`register.js:202-208`).
   - Item 11: every new test has a RECORDED MUTATION comment naming its observation commit (ba42e6f76117; the runner's 7bb137242931). D9 is correct.
   - Item 12: no overrun. The class 9 code came after Amendments 1 and 3, which reached the branch at c2d62c37 before the first code commit (report §1, §3).
   - Item 13: Amendment 4 carries no hash at a branch commit, and its tool claims name 2.1.289.
   - Item 14: the 6 files only.
   - Items 15 to 20: clear. The E-rows have not run.
2. **The runner:** no shell, no `exec`, no retry, no parallel run, no early stop, no timer, no prefix parse, no special case, no output read, no file write, no dependency (`repeat.mjs:17-52`).
3. **A5:** the tail is not normalised, the runner path follows §2.3, and `isApproved` is not bypassed (`register.js:185-196`).
4. **The ceiling:**
   - No wait for a git answer once the ceiling wins (`register.js:437`), and no late value is read.
   - `next` is called once.
   - Every promise has a handler: `staged.catch(noop)` (`:419`); `slept` has both arms (`:432-435`); the root promise of `snapshotBefore` is chained into `staged`.
5. **`previous_write`:** measured, not estimated, and it names its write. `$.fs.write` stays inside `writeRecord`.
6. **`$` calls:** only the one A2-1 entry (report §5, the calls line).
7. **Workflow:** exactly §2.0's five changed lines: export lines 22, 83, 100, 141 and 142 against main's 22, 139 and 140. No permission, trigger, action or secret changes.
8. **Main checkout:** clean apart from two untracked files that are not this piece's. `scripts/evidence/` on main holds only `archive.mjs` and `README.md`. The filing note says the Recorder folder is unchanged. The reviewer confirms porcelain.
9. **Probes and writes:** no G1 probe, and no fixture holds a force or delete spelling. Runner fixtures live in `mkdtemp` (`repeat.test.mjs:14-15`).
10. **Wording:** no text calls a `verify-mutation` run an observation (report §4; README line 56).
11. **Budget:** no overrun, and no code before its class 9 amendment.
12. **Branch test-text spans:** none are pinned by hash. Commits are named by id (Amendment 4's preamble).
13. **Record form:** clear in Amendment 4. Its tool claims carry the 2.1.289 build label and the c2d62c37 tree.
14. **Merge:** pending. It must be a merge commit (see the closing list).
15. **Guardian and marketplace:** no change.
16. **(Amendment 1) The translation:**
    - It matches one ASCII letter, then a slash or the end (`register.js:206`).
    - The four spellings the ruling names stay untranslated (T27).
    - No OS branch, and no `$` call.
17. **(A2-1) One `$.clock` call:**
    - It is made only in `beforeCeiling`, once per dispatch.
    - It is never made on an unresolved plan (`:417`) or on a call that is not approved or runs in the background (`:461`, `:465`).
    - There is no `setTimeout`, `clearTimeout` or `performance` in `register.js` (report §8 caller grep; confirmed by my reading).
18. **(A2-1) The sleep:**
    - It is aborted in `finally` before `raceBefore` returns (`:440-446`), so before `next(e)` at `:478`.
    - A rejected sleep maps to `sleep-failed` and never to the ceiling (`:434`, `:438`).
    - `BEFORE_CEILING_MS` is 2000 (`:19`), below 10 000.

## Round 56's conditions, against the code
All are met:
- one `$.clock.sleep` per dispatch;
- only on a resolved plan of an approved call;
- aborted before `next(e)`;
- `BEFORE_CEILING_MS` is 2000;
- no other `$.clock` member and no other new `$` call;
- the calls line gains exactly `$.clock.sleep (via beforeCeiling)` (report §5). The reviewer re-runs `validate`.

The abort is shown by reading only (N3).

## The translation against round 55's typed text, point by point
The text is `state/directives/2026-10-05-round-55-open-1-ruling.md:6`; its hash is in the round 55 RULED block.
- **Inside `leadingCdDir` only:** yes (`register.js:202-208`).
- **The match:** a leading slash, one ASCII letter, then a slash or the end. Yes, `[A-Za-z]`.
- **Read as the letter, a colon and a slash, then the rest:** yes.
- **Nothing else translated, including the four named spellings:** yes (T27).
- **No OS branch, no new `$` call, `validate`'s lines unchanged by it:** yes.
- **T27's cases:** `/c/x`, a bare `/c`, and four untranslated spellings (the ruling asks for at least two). Its mutation is the translation dropped.
- **README:** states that the translation assumes Git Bash and that off Windows a one-letter top-level directory reads unavailable (line 19).
- **Entered by class 9 before its code:** yes (Amendment 1).

**D7 (the case of the letter): the ruling allows it. It is not a deviation and needs no new ruling.**
- The uppercase `<LETTER>` in the ruling is an angle-bracket placeholder for the matched letter. It is the same device as the ruling's own placeholder for one ASCII letter in the same sentence.
- The typed text names no case conversion in words.
- Its next sentence forbids any other translation, which argues against adding a transform it did not order.
- Amendment 1 carried the ruling as "that letter" before any code, and the README describes the behaviour exactly.
- On Windows a drive letter is case-insensitive, so `git` runs in the same tree. The `toplevel` field may echo the case the call was typed in; v0 already did that for a typed lowercase `c:/x`.
- Disclosure: see N1.

## Amendment 4's D2 and D3
- **D2 stands as class 2.** It is a fixture method forced by an observation at 2.1.289. For claim 2 its "no claim changes" holds: T22 counts zero `$.clock.sleep` calls on every F19 form under the `rejecting` clock (`recorder.test.ts:681`, `:696`).
- **S2-1: claim 5 needs narrowing.** F23's case where every `$` call rejects ran with the mock clock still answering (D2; `recorder.test.ts:816-818`). The path where the clock rejects is shown only by T28, which uses deep equality (`toEqual`, `recorder.test.ts:849`) and not serialised equality. The closing record narrows §1 claim 5 by reference to D2 and T28, in one sentence. No code change.
- **D3 stands as class 2.** A run outcome that differs from a §5 prediction is class 2 by the template's own definition (`docs/PREREGISTRATION-TEMPLATE.md:106-109`).
- **S2-2: Amendment 4 softens the D3 result, and claim 6 needs narrowing.** Amendment 4 says the prediction cannot be compared on `tools/mods`. In fact the prediction did not hold on that path, before or after the change; report §5 says the prediction does not hold there. The closing record states that the `tools/mods` half did not hold (class 2, report §5) and narrows A2-1's replacement of claim 6 to the plugin folder. Fixing this as a reference row is not a correction round.

## The other deviations
- D1, D4, D5, D6, D9, D10 and D11: no claim changes and no §8 effect. D9 satisfies v0 §8 item 11, and D10 follows brief §3.2.
- **D8:** the changes are to `arm()` and the World fields, which are helper text and not a v0 test's own text. They fall within A2-1's r4 branch. The reviewer confirms from the full diff that the 6 deleted lines in `recorder.test.ts` are confined to the import, `arm`, `RUN_KEYS`, T1 and T11.

## Notes (N)
- **N1 (D7):** the custodian's request for the typed merge approval should name D7 in one line: `/c/x` reads as `c:/x`, and the ruling's placeholder is read as the letter as typed. That lets the human object. It is disclosure, not a question put to the human.
- **N2 (an inherited seam gap, carried from my own F18):**
  - Git Bash strips unquoted backslashes. So the F18 spelling `node scripts\evidence\repeat.mjs 5 -- …` runs `node scriptsevidencerepeat.mjs` and fails.
  - The matcher still approves it and records `repeat` 5 with `tool_is_error` true.
  - v0's A4 has the same gap.
  - This is a record of a call that ran zero times, not a pass-through defect. Propose a later node; it is not this piece's.
- **N3 (no test pins the abort):** removing `controller?.abort()` would likely pass all 28 tests. §8 item 18 is held by reading. The reviewer may observe that mutation as information, beyond the form's list. The live effect rests on the typed doc at 2.1.288 (r1).
- **N4 (order of the reading):** the canonical subagent transcript can prove that r1 to r4 preceded the first `beforeCeiling` edit. The custodian may check it there. It is not required.
- **N5 (README):** line 58, which v0 carried unchanged, still lists MSYS spellings among what is not covered. Since Amendment 1, `/c/x` is covered, so line 58 is now partly stale against line 19. Fix it in a later README touch.
- **N6 (precondition I did not read):** governance-ci on the branch (§9 Suites). I have no tool for it. The custodian reads it green before filing either gate.

## Closing-record list (after the merge; references and hashes only)
1. The merge commit id on main, a merge commit (§8 item 14). It keeps 7bb137242931, ba42e6f76117, b90ed74c and 05fc645d reachable, which the mutation comments name.
2. The human's typed merge approval, filed verbatim under `state/directives/` with its line sha256 at the commit that adds it. It gets a RULED block, cited by round and item, and names E8, E9, both or neither.
3. Both gate reports, under `state/consults/gates/`, by path.
4. §7: the reviewer's recount, by reference to the reviewer's report (base c2d62c37b4ec79f3eca7f8b794b9b85c04bf00fb, head 05fc645d). No class 8.
5. One class 2 row, carrying S2-1 and S2-2:
   - claim 5, by reference to Amendment 4 D2 and T28 (`tools/mods/spatial-evidence-recorder/test/recorder.test.ts:<T28 lines> @ <merge commit> sha256:<hex>`);
   - claim 6, narrowed to the plugin folder, by reference to report §5;
   - the `tools/mods` half of the prediction recorded as not held.
6. **E8, only if named.** A class 1 row containing:
   - the build, by the v0 §4 method (2.1.289, else I2 (b));
   - the reload line and the Read-from line, against v0 Amendment 5, E0;
   - the day folder named in words;
   - the record's fields `command`, `schema`, `repeat`, `tool_is_error`, `tree_basis`, `tree_changed_during_run` and `before_ceiling_reached`, byte-copied by script;
   - the three run lines and the summary, checked by script against the transcript and not reproduced;
   - porcelain unchanged.

   Write the scratch-file path in the tail with forward slashes, since Git Bash strips backslashes (N2). `before_ceiling_reached` false is the live clock seam's proof (A2-1, §4 E8 read).
7. **E9, only if named.** A class 1 row containing:
   - the first 20 paired schema-v0.1 records from 2.1.289 sessions, with exclusions named;
   - p50 and p95 of §2.6's sum against `RECORDER_P95_BOUND_MS` 300;
   - P0 §3's mtime figure beside them, not scored.
8. PLAN: set the node to done, adding `{pr: 177}` only in that done commit; guardian-v1 is unblocked.
9. §9 Operator: the first brief after the merge that carries the brief rule, referencing `state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:16-22 @ 17063904 sha256:886168f4ad5073f154627dfdd47f497bda21cf36b6bd84eebda1cb071a4d5d0d`.
10. Evaluation rows (a) to (e) at the window's end. These are not closing items.

No ADR is needed; the piece touches no wire, guarantee or product module.
