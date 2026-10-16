Reviewed: PR #222 at 3dfc1a0e51ac1936a1008d815c8d19b8dab69367 (base 31e25f15). Branch and commit: cut/b2-piece-1b-recording @ 3dfc1a0e51ac1936a1008d815c8d19b8dab69367
Verdict: FAIL. There is one Correctness finding, and only a sentence's words block it. The sentence is not the human's wording, so under AUTONOMY §31(d) the worker applies the words given in C-1 with no re-gate, and the PR body lists them. Evidence is closed: every new test's mutation was observed by me, every suite is green, CI is green, and every hash and pin resolves. The Documentation findings below are must-fix before the merge and need no re-gate.

Worktree: C:/dev/wt/1b. After `git fetch origin`, HEAD = origin/cut/b2-piece-1b-recording = 3dfc1a0e. The merge base with origin/main is 31e25f15. The porcelain was empty at the start, after every mutation, and at the end (shown empty by the last command).

## Correctness (blocking)

**C-1. A guarantee the code does not support.**
- Where: `protocol/skp/SKP-V0.md:1261`, the last sentence of the line: `A refusal at (1) to (8) writes nothing.`
- What the code does: step (7) is `StepRecorder::create` (`kernel/src/session_history.rs:205-245`). It writes before it can fail:
  - the folder (:209-212);
  - `locations.json`, which holds the absolute path (:222-223);
  - `history.jsonl` (:226-232), then its lock (:233), then the header (:242-243).
- Every `?` after a write returns the refusal and removes nothing. The record is pushed to `records` only when `create` succeeds (:173), so `end_session` (:194-202) never clears a partial record either.
- Reachability (§31(c)): this needs a filesystem call to fail during record creation, for example a full disk or a refused permission. No dev switch, timing window or instrumented build is involved, so ordinary use can reach it and it blocks.
- A case that does not block, to be named in the source comment: an (8) refusal on a record that (7) began in the same call. It cannot be reached within the engine's bounds. U7's worst step line is 168,567 bytes against a ceiling of 262,144, and a first line cannot pass the history ceiling.
- Not the human's wording: SKP-V0 §10 is the worker's text, taken from form §2.3, which the architect drafted. §31(d) therefore applies.

Replacement words for that sentence:
```
A refusal at (1) to (6) writes nothing. A refusal at (7) or (8) writes no step line; when (7) began the record in the same call, what it wrote before the refusal stays (the record's folder, `locations.json`, and the history with as much of its header as was written), and a normal end clears a record only if (7) completed it.
```
Each clause checked against the code at 3dfc1a0e:
- *(1) to (6) writes nothing.* Everything at :150-165 runs before the records lock (:167) and before either filesystem writer, `create` (:205) or `History::append` (:84). That covers the version, the catalog, `require_live`, `prepare` (the registry, admission and the style check), `dependencies_json` and `DatasetRef::linked`. Holds.
- *(7) or (8) writes no step line.* The step line is written only at :186-187, which runs only after `create` returned Ok (:173). Inside `append`, every bound refusal (:87-97) returns before `write_all` (:99-102). Holds.
- *What (7) wrote stays.* `create` removes nothing on error (:209-243). When (7) completes and (8) then refuses, the header is already written and the record is kept (:173). Holds.
- *A normal end clears a record only if (7) completed it.* `end_session` walks `self.records` only, and a record enters it only when `create` returns Ok. Holds.

A code fix is an alternative: on any error after `create_dir`, `create` removes what it wrote, with a test. That changes what the code does, so it falls outside §31 and would need a re-gate. If it is taken, these words are not needed.

## Evidence

No findings.
- E2 (the normal-close clearing) and the real-control half of H2 (closing the colour picker and releasing a drag in WebView2) rest on walkthrough rows AA4 and AA2, which run after the merge. The form provides this route because H5 fails.
- The recording suite has passed only under the custodian's port-5400 harness with `E2E_SHIM_WAIT` (runs 1 and 2).

## Documentation (must-fix before the merge, no re-gate; none is the human's wording)

**D-1. `skp.session_history_unwritable` is described as write or flush failure only.**
- Where: `protocol/skp/SKP-V0.md:1276` and `protocol/skp/src/v0/error.rs:117-118`.
- The code returns this code in more cases:
  - record creation fails: at :212, :223, :232 or :233;
  - the header is over its ceiling (:89-92);
  - the binding has no recorder (`frontends/shell/src-tauri/src/commands.rs`, `record_step`'s `None` arm);
  - unreachable arms: :163-165, :262-265, :366 and :371-373.
- New words for the When cell:
```
the record could not be created (its folder, `locations.json`, the history file, its lock, or a header over its ceiling), or the write or the flush failed; the shell's binding also returns it when no per-user data directory resolves, and arms no admitted open reaches return it too. After a flush failure the bytes may be in the file
```
- New words for the doc comment:
```
/// `record_step` (`skp/0.12`): the step could not be written and flushed: its record could not be
/// created, the write or the flush failed, or no per-user data directory resolved (after a flush
/// failure the bytes may be in the file, so the message does not say they are not).
```
- Clause check: the sites listed above.

**D-2. G2's expected failure is wrong.**
- Where: `kernel/tests/no_generation_in_persisted_artifacts.rs:799-801`.
- Under the mutation the doc names, the test fails at `recover`'s read-back assertion (:853), with `Malformed { path: "$.resource.locators[0].at" ...`. It does not fail at the path scan. I observed this.
- New words:
```
/// RECORDED MUTATION: `DatasetRef::linked` records a project-relative locator holding `ds.path()` in
/// place of the machine-recorded one, so the header's locator `at` carries the path. Expected
/// failure: `recover` refuses the header at `$.resource.locators[0].at`, so this test fails at its
/// read-back assertion. RECORDED MUTATION 2, for the path scan itself: the step's
/// `dependencies.geometry_types` carries `ds.path()`, which `recover` accepts. Expected failure:
/// `the history names the fixture's path`.
```
- Clause check: my G2 run failed at :853 with that rule. My G2b run failed at :882 with "the history names the fixture's path".

**D-3. console.mjs predicts failures that runs 2 and 3 did not observe, and still says the mutations are not observed.**
- `frontends/shell/e2e/console.mjs:672-673`. Current: "Not weakened: a window whose rows are not grouped still fails `not exercised`." New words:
```
Not weakened: a window whose rows are not grouped still fails by name, at `split run` when two adjacent items share a key, and otherwise at the not-exercised name.
```
- :682-684, new words:
```
  // RECORDED MUTATION, OBSERVED BY THE CUSTODIAN at 7b547f90 (e2e run 2) and again at 3dfc1a0e (e2e run 3): in
  // src/console/consoleViewModel.ts `groupConsecutiveEntries`, stop coalescing (emit every entry as its own single item).
  // GROUP' then fails by name at its `split run` check. Reverted afterwards.
```
- :685-686: replace `TO BE OBSERVED BY THE CUSTODIAN (... not yet observed at this edit)` with `OBSERVED BY THE CUSTODIAN at 3dfc1a0e (e2e run 3; the human's 2026-10-16 direction, Amendment 7)`.
- :608: same change, with `at 7b547f90 (e2e run 2)`.
- Clause check:
  - In `stepGroup`, the `split run` throw comes before the `GROUP_NOT_EXERCISED` throw.
  - Run 2 recorded CON-GROUP as "GROUP': split run: ..." and CON-CLASSC as "CLASSC': no new class-A record_step row ...".
  - Run 3 recorded CON-GROUP as split run again and CON-TOGGLE as "GROUP': toggle: one click on a group header wrote no console entry ...".
- These edits are comment-only, so the console run's verdict carries forward under §22's applicability check.

**D-4. A2's recorded mutation differs from form §4.**
- Where: `frontends/shell/src/App.recording.test.tsx:206-207`. Form §4 names "the record placed in `handleStyleChange`"; the test comment names a different mutation.
- New words:
```
  // RECORDED MUTATION for "A2": in `App.tsx` `handleStyleChange` (the per-tick `onChange` path), enqueue each `style.set`
  // transition as well. Expected failure: a step is recorded while the drag is live.
```
- Clause check: my A2 run failed with "no step while the drag is live: expected [ { …(2) } ] to deeply equal []".

**D-5. PR #222 body.**
- (a) The §7 line gives B...7b547f90. At the reviewed head, §7's own command gives **4,557 lines over 66 files**. The e2e group is **625 against 300**: recording.mjs 398, package.json 1, and console.mjs 226, the path Amendment 6 added. The other overruns are as stated, and e2e/README.md (16 lines) sits outside every group. The 4,491 + 68 arithmetic overstates by 2, because both console.mjs commits change one shared line. Words:
```
- **§7** (its command, B...3dfc1a0e): 4,557 lines over 66 files, against 3,950 over 60. Over their ceilings: the kernel product (1,445 against 950), the kernel tests (764 against 700), the shell product (348 against 320), the e2e group (625 against 300: recording.mjs 398, package.json 1, console.mjs 226, Amendment 6's path) and Amendment 2's own (222 against 220). Class 8; §7 is not edited; the overrun stands by your 2026-10-16 direction.
```
- (b) The P6 list leaves out strings the app shows through O1/O2's `{message}`:
  - the four kernel messages in `error.rs:117-153` (`session_history_unwritable`, `_full`, `_stopped`, `step_line_over_ceiling`);
  - the `{detail}` texts at session_history.rs :91, :164, :207 with `the record folder` / `locations.json` / `history.jsonl` / `the history lock`, :264, :366 and :373;
  - the `style_value_not_admitted` detail `a colour is \`#rrggbb\` in lowercase`.
- The PR body should also list the words applied under C-1 and D-1 to D-4 (§31(d)).

**D-6. The owner's indexes claim every pointer was checked at a commit older than the rows this piece adds.**
- Where: `kernel/README.md:360` (`d5863945`) and `engine/README.md:530` (`fb95bec0`).
- Words, kernel: `- **Last verified at:** d5863945 (every pointer checked at that commit); the session-history row's pointers at 3dfc1a0e`. Engine: the same, naming the `referenced_columns` pointer.
- Clause check: every new pointer names a test that exists and passed at 3dfc1a0e.

## Notes (non-blocking)
- **N1.** C-1's code alternative (cleanup in `create`) would also stop leaving a `locations.json` with an absolute path after a failed creation. Worth taking in 1c, which reads the store.
- **N2.** `end_session` discards remove errors (`let _ =`, :198-200). A file another process holds keeps the folder, and no line is logged.
- **N3.** `lastCommittedStyle` is app-wide, and `view.style` is kept on rebind (`workspaceState.ts:144`). A new dataset's record therefore does not record the style carried over from the previous dataset. 1b claims nothing about this, but piece 4's restore will need it.
- **N4.** GROUP''s toggle check identifies the row by owner `docs/03` plus "no API equivalent", which every docs/03 class-C row carries. The exact-one delta and CON-TOGGLE carry the proof. Matching the toggle's own statement text would tie the check to `console.toggleGroupExpanded`.
- **N5.** Unused in console.mjs: `windowOf`, `isResidentialUntiled`, `RESIDENTIAL_PREDICATE`. `callOpenPath` is still used at :893. They stay by the human's word.
- **N6.** For the human's P6 sight, not reworded:
  - `Filter applied.` also prefixes a Clear's notice;
  - `still waiting there`: the changes wait in the shell's queue, not in the history;
  - `is at its ceiling`: in fact this step would pass the ceiling.
- **N7.** `hex32`'s `expect` (:269) panics under the records lock. Poisoning is handled and `record_step_panicked` reaches the queue. 1a's `DatasetUri::mint` uses the same pattern.
- **N8.** The deviations left for the gates' judgment are all acceptable:
  - Amendment 4: the fifth code (a refusal by name needs its own code; Amendment 1 item 4(d)); the read-and-write handle (`create_new`, an exclusive lock and sequential writes from offset 0, so every write lands at the end; K7 and K8 green on Windows and on Linux in CI); the required `filter` key (§2.2).
  - Amendment 5: Part AA, AA4 carrying E2, the notice in the attention strip, the e2e README entry.

## Mutations I observed at 3dfc1a0e
Each was applied alone by an anchored edit (the anchor checked to occur exactly once), run by its exact test name, read failing, reverted with `git checkout`, and the porcelain shown clean. The protocol, engine and kernel runs used shared holds. No `verify-mutation` run was used. Every row below failed by name.

| Id | Mutation | Failure seen |
|---|---|---|
| P1 | `deny_unknown_fields` removed from `RecordStepRequest` | `an unknown key at \`\` must be refused` |
| P2 | `#[serde(other)] Other` on `StyleSetParams` | `{"property":"outlineStyle","value":"dashed"} must be refused` |
| P3 | `skip_serializing_if = "Option::is_none"` on `filter` | left None, right Some(Null) |
| P3b | `deserialize_with = "key_present"` removed | assertion `refused(... "params": {})` |
| P4 | `#[serde(rename = "dataset_handle")]` on `dataset` | `record_step_fixtures_round_trip`: unknown field `dataset` |
| P4b | the stopped fixture's message edited | the constructor and the fixture differ |
| V | literal back to `skp/0.11` | `skp_version_is_skp_0_12` (left skp/0.11) |
| E1 | `columns: Vec::new()` | left [], right ["zone","area","i64"] |
| U1 | step lines returned right after the LF check | `not JSON at line 2: nothing after it is kept` |
| U2 | `chain.parent = Some(to)` removed | the first assertion (rule `$.step.parent`, line 6) |
| U3 | a missing LF is kept (`unwrap_or(raw)`) | `cut at 733` |
| U4 | `Ok(v.to_string())` | the byte comparison |
| U5 | history-ceiling branch disabled | `unwrap_err()` on Ok at the third step |
| U6 | `self.stopped = true` removed | `unwrap_err()` on Ok at the step after the failed one |
| U7 | `MAX_STEP_LINE_BYTES = 100_000` | `a step line of 168567 bytes` |
| U8 | the provenance word check replaced by `TEXT` | at `"file"`: (0,false) vs (2,true) |
| U9 | `definition` accepts any string (`Or(State, TEXT)`) | at `"abc"`: (0,false) vs (2,true) |
| K1 | `data` omitted | `MissingMember $.step.data` |
| K2 | the record created before admission (`prepare` moved after the record lookup) | `nothing was recorded` |
| K3 | `require_live` removed | `unwrap_err()` on Ok |
| K4 | `parent` always None | `recover` refuses line 3 at `$.step.parent` |
| K5 | records never continue (equal to keying by handle in this test) | `the reopen continues the record` (left 2) |
| K6 | `remove_dir_all(root)` at end | `only the earlier run's record remains` (left []) |
| K7 | `try_lock` removed | the `WouldBlock` match fails |
| K8 | `BufWriter` with `get_ref().sync_all()` | `the file holds no header line` |
| K9 | `|_f| Ok(())` in place of `sync_all` | `["no sync_all"]` |
| K10 | hash of `crs.identifier()` | the hash differs from the text's |
| K11 | hash of an empty text | definition.state left Null |
| K12 | `crs.source().as_str()` | `file` refused by `recover` |
| S1 | `style::parse` removed | `unwrap_err()` on Ok |
| S2 | the lowercase rule removed | `unwrap_err()` on Ok |
| G2 | the form's mutation (a project-relative locator holding the path) | `recover` refuses the header (see D-2) |
| G2b | `geometry_types` carries the path | `the history names the fixture's path` |
| C1 | `skp` omitted | deep-equal fails |
| R1 | `void deps.send(...)` | `only the first is in flight` |
| R2 | the bound check disabled | expected length 1, got 0 |
| A1 | enqueue moved to `handleApplyFilter` before `applyFilter` | `a refused Apply records none` |
| A2 | enqueue in `handleStyleChange` | `no step while the drag is live` |
| A3 | the failed-send report removed | `expected undefined to be 'Filter applied. ...'` |
| console | `style.setFillColor` re-added to `CLASS_C_ROWS` | `expected [ 'style.setFillColor' ] to deeply equal []` |

Notes on three rows:
- My first U9 (`definition` → `TEXT`) failed early, at the `none-admitted` case. The row above is the faithful re-run.
- K2 is the form's own mutation. The stage-1 worker had used a proxy.
- U1 kept the header validated.

E2E mutations, taken from the custodian's records and not observed by me:
- Run 1 at 936b7982: REC-APPLY, REC-STYLE, REC-RESET, REC-CHAIN, each failing at its step.
- Run 2 at 7b547f90: CON-CLASSC failing at CLASSC'; CON-GROUP failing at `split run`.
- Run 3 at 3dfc1a0e: CON-GROUP failing at `split run`; CON-TOGGLE failing at `GROUP': toggle`.

## Commands and exit codes
- `cargo test --workspace --locked --features spatial-engine/fixture`, held: 0. 106 binaries, 960 passed, 0 failed, 57 ignored. Every new test passed.
- `cargo fmt --all --check`: 0. The src-tauri fmt check: 0.
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`, held: 0. 45 located diagnostics, **0 on an added line**, by a matcher over the three-dot `-U0` diff, which I self-tested on a planted line.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`, held: 0. 67 + 2 passed.
- `npm run verify` in frontends/shell, held: 0. vitest 95 files, 1352 tests; residency-trace 76; citation-integrity 30.
- vitest baseline of the four new or changed shell test files: 0 (28 tests).
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 0 (457 pass).
- `verify.mjs`, `verify-cites`, `verify-quotes`, `verify-test-claims`, `queue --check`, `site --check`, `cfg-boundary`: all 0.
- `gh pr checks 222`: 13 of 13 pass at 3dfc1a0e. The Linux job ran K7, K8 and U7, so H4 holds on Linux.
- Holds: four shared holds were granted and released. No exit codes 96 to 99.

## Hashes, pins, equality, locks, §7
- **Form pins:** all 49 `path:line @ rev sha256:` pins in the form recompute.
- **Amendment 1:** items 2 and 3 are byte-equal to the directive's lines 14-19 and 33, after removing six leading spaces and putting 2026-10-14 in place of `<date>`.
- **Amendment 2:** its seven fences equal the architect draft at 2857bd8c (lines 28-32, 63, 86-88, 90, 107, 136, 151), each with only the `source`→`provenance` change the amendment states.
- **Report hashes:** 18ee2e48 (Amendment 4), 13dc19dd (Amendment 5), ad2ad43c and 57aad04e (run 3) each match the filed file. The worker's a154b693 (the ADR-022 fence) and ba376ea9 (the docs/07 note) reproduce.
- **ADR-036:** rebuilt by script from b2c71d73 with blocks 0 (Amendment 2 item 3), A to G, the dependencies cell, H, I, J, the scope row and K, in the order Amendment 2 item 2 gives. It is **equal** to the head. The Status line is unchanged (Proposed).
- **ADR-022:** Amendment 1 is byte-equal to Amendment 1 item 2, and the text above it is unchanged.
- **docs/07:** the note is byte-equal to item 3. It is the first commit (b1883ce1), and that commit touches docs/07 only.
- **KNOWN-LIMITATIONS 43** is byte-equal to §2.10 L with n=43. Block R in lib.rs and README and block S in SKP-V0 are byte-equal.
- **Lock diffs against B are 0 bytes:** Cargo.lock, src-tauri/Cargo.lock, package-lock.json. The protocol/data-plane diff is empty.
- **§7:** 4,557 over 66 files against 3,950 over 60. This is class 8, recorded in Amendments 4, 5 and 7, and the human ruled that the overrun stands. It is not a finding.
- **The form:** append-only. Every amendment commit deletes 0 lines, and §0–§9 are unchanged since ed4ccb47.
- **Order:** Amendments 1, 2 and 3 precede the first code commit. Amendment 6 precedes 7b547f90, and Amendment 7 precedes 3dfc1a0e. Every commit is signed off.

## §8, item by item
1. The order of checks is clean: every check comes before `create`; bounds come before `write_all`, and `sync_all` comes before Ok. There is no buffer (K8, K9).
2. Clean (G2 and G2b). `locations.json` alone holds the path.
3. Clean. `Record` holds no filter or style value, there is no restore, undo or replay code, and no added line says undoable (the scan matches replay lines, so it can see).
4. Clean. `RecordStepResponse {}`.
5. Clean. Two actions; scope is the constant `layer`; no feature id.
6. Clean, including the timestamps and the ADR-036, ADR-022 and docs/07 equality above.
7. No refusal is silent (R2, A3, and the notice is logged). Kernel messages state kernel facts. C-1 is a spec sentence, not an operator message.
8. Clean. cfg-boundary 0, and no LOCALAPPDATA in product code.
9. Clean. `recover`, `Recovered`, `Header` and `Failure` fall under OPEN-6, with 1c named in the PR body. The engine accessor is under Amendment 1 item 4(a).
10. Clean.
11. Clean (A2).
12. Clean. The 60 s child timeout and the e2e polls are bounds, not claims.
13. Clean: overruns are class 8; the class 9 additions came before their code; no `verify-mutation` run is called an observation; no test span is pinned at a branch commit; this is not a five-line form.
14. The form is clean. D-2 and D-3 are predictions in test comments, not quotes.
15. The engine and kernel indexes are updated; see D-6.
16. Clean: #222 is the only open PR.

Relevant files:
- C:/dev/wt/1b/kernel/src/session_history.rs
- C:/dev/wt/1b/protocol/skp/SKP-V0.md
- C:/dev/wt/1b/protocol/skp/src/v0/error.rs
- C:/dev/wt/1b/kernel/tests/no_generation_in_persisted_artifacts.rs
- C:/dev/wt/1b/frontends/shell/e2e/console.mjs
- C:/dev/wt/1b/frontends/shell/src/App.recording.test.tsx
- C:/dev/wt/1b/kernel/README.md
- C:/dev/wt/1b/engine/README.md

Final `git status --porcelain` in C:/dev/wt/1b: empty.
