Reviewed: PR 359, branch cut/console-stream-lane at 4eae8c9ce481cdd14319c1adebe20dd18dd5ec0d, in its worktree C:/dev/wt/console67 (the custodian's filing note, 2026-11-22: the reviewer's build gate, part 1, node:console-stream-lane-limitation-67@gate-reviewer-1, dispatched at 2026-11-22T19:34:44.076Z; its run: Read 3, Bash 70, Grep 1, Write 1, SubagentHandback 1, by unique call ids, 3 calls errored; model claude-opus-5-5, from 2026-11-22T19:34:50Z to 2026-11-22T20:04:54Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 14630 bytes, sha256 f10701615f3ffe7ed361de5cedb3a450a7931230ebfffde53370b962b6697db6, byte for byte except that 0 scratch-folder paths are written as <S> and the hold command's one project value as <m>, and with one final newline added. FAIL: one Evidence finding (EV-1, the same check as the architect's E1); DOC-1 to DOC-5 Documentation; its reading of K2's clause on a load came after ADV-2026-11-22-36 had replaced that clause.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/console67 @ 4eae8c9ce481cdd14319c1adebe20dd18dd5ec0d (branch `cut/console-stream-lane`, PR 359; base B 1f72b1f76101fa25a359bbaa58272c1223e5ae96)
REPORT PATH: state/consults/gates/2026-11-22-console-stream-lane-build-gate-reviewer.md

Part 1 only. M-G1, M-CB1, M-CB3, M-A4-1, M-A4-3, M-X2 and MEASURE's JSON are owed in part 2. One Evidence finding fails the gate. The product code, all eleven unit mutations, §7 and `npm run verify` are clean.

## Correctness

None. Product code read against §2.3 items 1 to 5:
- The lane is chosen by kind and name only (`laneOf`, `recorder.ts:317-326`).
- Each ring evicts its own oldest and counts the drop against itself (`:338-347`).
- `entries()` is an O(n) merge by `seq` (`:362-371`), and `count()` is the sum of both rings.
- The registry still imports nothing, so there is no import cycle.
- `consoleLabelText` matches L1 byte for byte.
- Both snapshot sites (`collapsedCountSync.ts:60-64`, `ConsolePanel.tsx:52-56`) read `droppedCount("stream")` and `droppedCount("other")`.
- No product code outside `ConsolePanel` reads `consoleRecorder.entries`, `count` or `droppedCount` (grep).
- No other suite parses the label's dropped count (grep of `e2e/*.mjs` for `.console-disclosure`; the hits only click it or print it).

## Evidence (blocking)

**EV-1. MEASURE' lacks one of its four preregistered assertions.**
- §6: "It asserts only that the label parses, that D = S + O, that Δtotal > 0 when settled, and that the viewport is set."
- `measureRun` (`frontends/shell/e2e/console.mjs:960-970` @ 4eae8c9c) never asserts Δtotal > 0. A settled run that added nothing goes into the JSON with `streamAdded` 0 and passes the reading after P1 (a = 0, L = 0, no names).
- If every run read 0, Y would be 0 and rule W step 3's second form would write "can add 0 or more entries of the first kind" into item 67.
- This is test code, and it must be fixed before the tester runs MEASURE'. A suggested line after `:965`, in the worker's own words since the form gives no text:
```text
  if (!(p1.total - p0.total > 0)) throw new Error(`MEASURE': a settled run added no entry between P0 and P1 (P0: ${JSON.stringify(p0.text)}; P1: ${JSON.stringify(p1.text)})`);
```

## Documentation (must-fix before the merge)

**DOC-1. GROUP's PASS text, first branch** (`frontends/shell/e2e/console.mjs:750`). Amendment 1 D5 says the PASS text names the passing branch "with R, ΔS and ΔO". The R ≤ M branch prints R only. This is test output, not a decision. Old:
```text
  const capacityBranch = R <= MAX_CONSOLE_ENTRIES ? `R=${R} <= ${MAX_CONSOLE_ENTRIES}` : `
```
New:
```text
  const capacityBranch = R <= MAX_CONSOLE_ENTRIES ? `R=${R} <= ${MAX_CONSOLE_ENTRIES} (drops since the baseline: ${dropS} of the stream kind, ${dropO} of the other)` : `
```

**DOC-2. MEASURE's count-mismatch stop message states something untrue** (`console.mjs:935`).
- The line is reached only after the check at `:932` has passed, so ΔO ≤ N0 − M holds there. The message still says the other-kind drops were "more than the … the other ring held then".
- §6 item 4 reads "S7, as in 2, with `their count <k> is not <a>`".
- Clause check: at `:935` the only true fact is `names.length !== r.a`.

Old (it occurs once):
```text
${r.o2 - o0} entries of the other kind were dropped after P0, more than the ${n0 - M} the other ring held then, or their count ${names.length} is not ${r.a}
```
New:
```text
their count ${names.length} is not ${r.a}
```

**DOC-3. K3, the worker's comment** (`frontends/shell/src/console/recorder.ts:148-149`). "two runs joining when the entries between them are dropped" misses the condition that Amendment 1 put into K2. If the earlier run is dropped too, nothing joins. Clause check: `groupConsecutiveEntries` joins adjacent same-key entries of `entries()`, so a join needs both runs held (VL3, VL3′). Old:
```text
two runs joining when the entries
 *    between them are dropped:
```
New:
```text
two runs joining when the entries
 *    between them are dropped and both runs are still kept:
```

**DOC-4. A test title says the wrong thing** (`frontends/shell/src/console/consoleViewModel.test.ts`). VL3 and VL3′ sit inside `describe("consoleLabelText (known limitation 67: the label shows both drop counts)")`, so their full names call them label tests. They test `groupConsecutiveEntries`. Old (it occurs once):
```text
  it("VL3: two runs
```
New:
```text
});

describe("groupConsecutiveEntries after a drop (known limitation 67)", () => {
  it("VL3: two runs
```

**DOC-5. What the closing amendment must record** (references, per the record cap):
- **(a) Failures outside the named sets** (§4: "A failure by a line outside the set … is a finding, class 2"). Every one below was to be expected: each extra test asserts the same property the mutation breaks. They are not a defect in the code or the tests. They are a class-2 finding against §4's sets as written, which name one killing test per unit mutation and not the whole set that fails. Record each line, as listed under the mutation runs below.
- **(b) M-1 as made by this gate.** It follows the form's "all to the other lane" (`recorder.ts:339`). The worker's M-1 changed only the `skp-request` case, so `binding-command` stayed in the stream ring.
- **(c) The worker ran one test file per mutation.** On the four files: M-3 also fails VL3, M-6 also fails CL4 and CL5, and M-1, M-2 and M-4 also fail CC2. The worker reported "none" for M-3 and M-6.
- **(d) The worker's M-10 lines are mis-attributed.** The failing lines are "reflects droppedCount()" at `collapsedCountSync.test.ts:158`, CC1 at `:173` and CC2 at `:188`. The worker put CC1 at :158 and CC2 at :173.
- **(e) P1.** The edited test "evicts the oldest entry once MAX_CONSOLE_ENTRIES is exceeded" is green at the base under vitest and red only under `tsc`, as the worker disclosed.
- **(f) A second mirror.** `MAX_CONSOLE_ENTRIES = 128` at `frontends/shell/e2e/command-bar.mjs:377`, beside the one §7 names (now `console.mjs:73`, no longer :71).
- **(g) Where K3 sits.** §2.4 names K3 "item 67's comment". The worker put it in `recorder.ts`, and the brief reads it there. At this head the comment of `KNOWN-LIMITATIONS.md` item 67 still says "(the 256, …)" and "the label … (the count of drops in the label)". Commit 4 must replace it with K3's content, including ⟨FIGURE⟩'s source, which K3 defers to that commit. Otherwise §8 item 11 holds at the merge.

## To the advisor (ADV-2026-11-22-30 item 5): the advisor's wording, unreworded

**K2, the clause "A load drops none of the other entries".** It can be read as untrue of what an Apply and an open record themselves.
- **An Apply.** The filter is committed after the untiled request's issued outcome (`frontends/shell/src/App.tsx:394-395`). The step is then enqueued (`:1072`) and sent at once when none is in flight (`workspace/stepRecorder.ts:69-75`). So the Apply's `record_step`, an entry of the other kind, is recorded after its own load has started. When the other ring is full, which is the ordinary state ADV-2026-11-22-24 item 1 names, that entry drops the ring's oldest entry (`console/recorder.ts:339-346`).
- **An open.** It can record its `close_dataset` at a time the code does not fix against the load (`App.tsx:1645-1650`, as Amendment 1 lists). On the first load of a process it also records `binding_data_plane_attach` (`streaming/dataPlaneClient.ts:20-27`). With the other ring full, each drops one other entry.
- **A Clear.** Not traced.
- **What does hold.** The sentence's second half ("stay until 128 newer entries of their own kind are recorded") is true by construction (CL1, CL4). The tile requests and log lines of a load drop no other entry (CL1, CC2).
- This blocks the words commit (commit 4), not this head: the words have not landed.

L1 passes clause by clause against the built code. With drops, N is always 128 or more, so "1 action (…)" cannot occur. K1, rule W's sentence and K2's other clauses also pass. The figure-dependent placeholders are part 2.

## Words not the advisor's: R1, R2, W1 to W3

All pass against the code:
- R1: `AdmissionPanel.tsx:295-299`, `:341`, `:387`, `:446-450`; `App.tsx:895-902`, `:1453-1460`. The hooks are registered only when `isInstrumentedBuild()`.
- R2: `AdmissionPanel.tsx:378`, `:395`, `:452-456`. `takeSlot` returns the slot without calling `pickFile`, so no `binding_pick_file` entry is recorded. The comment closes with "ADV-2026-11-22-30 item 4".
- W1 (`README.md:280`, that line only): matches the check at `console.mjs:748`.
- W2 and W3: byte-equal to §2.4.

## The worker's stop-class finding: `frontends/shell/src/style/StylePanel.tsx:132`

This piece need not change it. "was evicting the console's 256-entry ring after about three drags" is past tense about the code it fixed, and true as history, so §8 item 11's "left untrue" does not apply. Editing it would be outside §7 (S4, a class-9 addition). A docs-lane note, my words, not a must-fix here:
```text
one console entry per tick was evicting the console's 256-entry ring after about three drags.
```
```text
one console entry per tick was evicting the console's ring (then one ring of 256 entries) after about three drags.
```
Also not in Scope: `site/data/plan.json` carries a node's historical text "the console's 256-entry ring". It belongs to the architect's grep (§9.1).

## The checks

**§8, item by item:**
- Items 1, 2, 3, 4, 6, 8, 9 and 12: pass.
- Item 5: pass. Only the §4-named existing tests are edited, and VL2's 256 is the form's own held count.
- Item 7: not applicable yet.
- Item 10: no packing found. The long one-line docs follow the files' precedent: `surfaceRegistry.ts` had 22 lines over 150 characters at the base.
- Item 11: only DOC-5 (g) and the StylePanel note.
- Item 13: no quotes or cites in the diff.

**§7:**
- 13 paths, all among the fourteen. `KNOWN-LIMITATIONS.md` is untouched.
- 688 + 131 = 819, within 850, with the merge base equal to B. That leaves 31 lines for commit 4.

**The caller rule:** pass.
- `isStreamLaneName`: called by `ConsoleRecorder.laneOf`, which `push` calls.
- `consoleLabelText`: called by `ConsolePanel`.
- `ConsoleLane`: used by `collapsedCountSync.ts`.
- The `lane?` fields: read by `isStreamLaneName`.
- Every new e2e helper is called.

**E-AND (`command-bar.mjs:383-509`):** follows §2.5 as amended.
- The order F1, F6, F7, F2′, then discard / not final, then PASS / F4, then F3′ / F4(n=0) holds.
- L = a + min(M, ΔS), capped at N1.
- The texts match the form. PASS also carries dS, a, L and the held stream entries before the step, for E1. It is unrun.

**GROUP's check (`console.mjs:739-750`):** matches C1. LABEL' matches §4.

## Runs

| Run | Command | Exit | Output |
|---|---|---|---|
| Baseline, unmutated | `npx vitest run` on the four `src/console/` test files (recorder, surfaceRegistry, consoleViewModel, collapsedCountSync) | 0 (58 passed) | `<S>/c67r-base-units.txt`; head hashes in `<S>/c67r-head-sha.txt` |
| M-1 to M-11 | one anchored `sed -i '<line>s/^…$/…/'` each (1 line changed, numstat 1/1), then `bash <S>/c67r-run.sh <id> <file>`: the same four-file vitest, `git checkout -- <file>`, porcelain, sha256 vs `git show HEAD:` | vitest 1 for all eleven; porcelain empty and sha equal after each | `<S>/c67r-M-<n>.txt` |
| `npm run verify` | in `frontends/shell`, inside `hold shared -Project <m>`, backgrounded, `-MaxWaitMinutes 120` | 0 (vitest 123 files, 1582 tests; the node suites 0 failures) | `<S>/c67r-verify.txt` |
| §7 | `git diff --numstat` and `--name-only origin/main...HEAD`; merge base 1f72b1f7 | 0 | `<S>/c67r-s7.txt` |

**The hold:** 20 MACHINE_WAITING lines from 19:38Z (the turn was held by another run of this project), then `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF … also=<m>` near 20:00Z, then `MACHINE_RELEASED project=<m> …`. Redacted lines in `<S>/c67r-hold-lines.txt`. Final state: `git status --porcelain` empty, HEAD 4eae8c9c.

**Mutation results.** Lines are in the test files at 4eae8c9c. The first entry is the named set's line.

| Id | Mutation | Named set fails at | Also fails |
|---|---|---|---|
| M-1 | `const lane = this.laneOf(entry);` → `const lane: ConsoleLane = "other";` (`recorder.ts:339`) | CL1 `recorder.test.ts:281` | CL2 :295, CL3 :313, CL4 :330 via :343, CL5 :360, CC2 `collapsedCountSync.test.ts:188`, VL3 `consoleViewModel.test.ts:174`, VL3′ :190 |
| M-2 | `ring.length >=` → `this.count() >=` (`:341`) | CL2 :295 | CL1 :282 (473 vs 472), CL3 :313, CC2 :188 |
| M-3 | concatenation at `:363` | CL3 :313 | VL3 :174 |
| M-4 | stream increment → `void 0` (`:343`) | CL4 :342 | CL1 :282, CL2 :296, CL5 :360, CC2 :188 |
| M-5 | `cancel`'s mark removed (`surfaceRegistry.ts:89`) | CL5 :360 | SR1 `surfaceRegistry.test.ts:99`, CL2 :295, CL4 :330 |
| M-6 | mark on `describe` (`:87`) | SR1 :99 | CL4 :330, CL5 :360 |
| M-7 | `dropped > 0` → `>= 0` (`consoleViewModel.ts:70`) | VL1 :154 | none |
| M-8 | D written as S (`:69`) | VL2 :160 | none |
| M-9 | seq-gap break (`:197`) | VL3 :174, VL3′ :190 | none |
| M-10 | stream read from other (`collapsedCountSync.ts:62`) | CC1 :173, CC2 :188 | "reflects droppedCount()" :158 |
| M-11 | S and O swapped (`consoleViewModel.ts:71`) | VL2 :160 | none |

## Suggestions (not findings)

- `isStreamLaneName` filters the registry on every `push`, one allocation per entry. A module-level Set would avoid that. No performance claim is made, so this is not a finding.
- `ConsolePanel`'s open-drawer snapshot (`:52-56`) has no unit test of its lane mapping. Only the e2e label readers cover it.

## Files read

- At C:/dev/wt/read-1122:
  - governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md (Amendment 2, Amendment 1, then the whole form)
  - state/directives/ ADV-2026-11-22-20, -22, -24, -26, -28 and -30, each whole
  - the base's src/console/*.ts, for the line counts
- At C:/dev/wt/console67:
  - the full `git diff origin/main...HEAD` of the 13 files
  - ConsolePanel.tsx, consoleViewModel.ts, surfaceRegistry.ts and recorder.ts at the head
  - AdmissionPanel.tsx, App.tsx, skp/dialog.ts, isInstrumentedBuild.ts, e2e-test-surface.ts, streaming/dataPlaneClient.ts, workspace/stepRecorder.ts, diagnostics/log.ts and residency/candidateArmSession.ts (the cited lines)
  - style/StylePanel.tsx:125-140, e2e/layout.mjs:244-258, KNOWN-LIMITATIONS.md:520-530, and the other e2e suites' label uses (grep)
- In `<S>`: the brief, console-build-1-report.md, c67-m-summary.txt, c67-m-M-1.txt, c67-mutate.py, c67-c-numstat.txt and c67-c-names.txt (read as claims)

Model: claude-opus-5-5
