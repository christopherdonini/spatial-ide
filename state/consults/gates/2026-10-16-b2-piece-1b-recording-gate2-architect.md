Reviewed: PR #222 at d25019694ae7f9025ff574ea32cb9120bed3ac49 (round base 3dfc1a0e, base 31e25f15) — cut/b2-piece-1b-recording @ d25019694ae7f9025ff574ea32cb9120bed3ac49
Verdict: FAIL

The gate fails on one Correctness finding, NC-1, which is in the words of a single sentence. The code is correct and the evidence is complete. The sentence is the worker's own words, not the human's, so under AUTONOMY §31(d) the worker applies my replacement words with no re-gate, and the PR body lists them. No last correction round is needed. The Documentation findings below must be fixed before the merge, with no re-gate.

The merge also waits for one red-line item: ADR-022 line 75 must carry the human's C-5 words, by whatever route the human chooses. Guardian G3 refused the edit (Amendment 9 item 1).

I had no shell, so these are left to the reviewer: CI at the head; `npm run verify`'s exit code at d2501969, which the Amendment 9 worker did not print; and recomputing any hash.

## Gate 1 findings (mine), at the head

- **C-1: met.**
  - **The checks:** `reader_accepts` (kernel/src/session_history.rs:283-301) checks each line with the reader's own `check_header` and `check_step` (:926-942). `read_line` calls the same functions (:876, :885), so the writer's check and the reader cannot drift apart.
  - **Where they run:** the step is checked at :187, before `append` at :188. The header is checked at :215, before the folder is made at :216-219.
  - **The refusal:** it is `skp.session_history_unwritable`. Its detail names the member's path and the rule (:289-293).
  - **Tests and mutations:** two tests, each with a mutation the worker observed at 426609d9: kernel/tests/session_history.rs:517 (1,025 geometry types) and :551 (an asserted identifier of 4,097 bytes).
  - **U7's comment (:1263-1272) is true.** The last sentence holds by the order of the checks: the reader's check passes, then `append` refuses the line at its ceiling (:93-94).
- **C-2: met.**
  - `create` (:213-224) calls `write_record` (:227-271), and `remove_dir_all` runs on any error (:222-223).
  - Every handle is closed by then: `file` and `rec` drop on the early return.
  - There is no test and no test-only path, and :210-212 says so. That statement is true:
    - the folder name is random (:216);
    - the header's size is bounded by the admission ceilings (U7, :1312-1326), so no caller input reaches a later failure.
- **C-3: met.**
  - StylePanel.tsx:144 passes `"reset"`. App.tsx:1915 writes `style.resetToDefault` only when the source is reset and there are no transitions.
  - The row is at surfaceRegistry.ts:187-194. Its owner is docs/03, with no ADR-022, so CLASSC' stays valid (console.mjs:651).
  - A4 (App.recording.test.tsx:243-263) has two mutations, both observed.
  - The new statement is judged under New findings.
- **C-4: met.** SKP-V0.md:1261 carries my words. They still hold at the head:
  - (1) to (6) come before the record (:150-160);
  - (7) is :173, then :213-224;
  - a refusal at (8) (:187-188) leaves the record in `records`.
  - The worker added a sentence: a failure at (7) removes what (7) wrote, as far as the operating system allows. It holds: :222-223, and an error from the removal is dropped.
- **C-5: the clause check passes.** The human's words land as they stand, and mine are not needed. The sentence checked is the one the brief built:
  - *ADR-006's class-2 machinery is the kernel's step record:* holds. Each step's effect is `workspace-mutation` (session_history.rs:463).
  - *each committed change of one style property is one step:* holds.
    - `styleTransitions` returns one transition per property that differs (viewTransitions.ts:134-149).
    - `handleStyleCommit` enqueues each one (App.tsx:1914, :1918), and each becomes one `record_step` call and one line (session_history.rs:185-188).
    - A refused or unsent change is shown to the operator by O1 to O3 (stepRecorder.ts:81-86). It is a refusal, not a different step count.
  - *so a Reset records one step per property it changes:* holds.
    - `handleReset` commits `DEFAULT_STYLE_STATE` with source reset (StylePanel.tsx:141-145), and the diff is taken against the last committed style.
    - Run 4's RECORD step shows a Reset after two edits recording two steps (five rows in all). A4 shows one property changed and one step.
    - A Reset that changes nothing records no step and shows the class-C row.
  - *recorded by the kernel's `record_step` command (ADR-036 §12):* holds (commands.rs:137-149; ADR-036.md:204-206).
  - *as one line flushed before the reply:* holds. There is one `write_all` and one `sync_all` before `Ok` (session_history.rs:98-108, :188-190).
  - *a line that is not whole is never recovered (ADR-036 §9):* holds (:847-848, :821-829).
- **D-1: met.** kernel/README.md:277-278 and kernel/src/lib.rs:21-23 carry my words.
- **D-2: met.** kernel/README.md:377 and :392.
- **D-3, with R D-1, in one version: met.** SKP-V0.md:1276 and protocol/skp/src/v0/error.rs:117-121. Clause check:
  - created: :217-219, :243-249, :253-258;
  - no per-user data directory: commands.rs:142-146;
  - locked: :259-260;
  - written: :99-106, and the header over its ceiling at :89-92;
  - the line could not be built: :163-165, :186, :319;
  - breaks a rule the reader holds and is not written: :283-301;
  - the bytes may be in the file after a flush failure: `write_all` comes before the sync (:99-102).
- **D-4: met.** commands.rs:167.
- **D-5:** superseded by R D-3, which is met: console.mjs:608-610, :671-673, :683-689.
- **D-6: met.** e2e/README.md:285-298 and MANUAL-WALKTHROUGH.md:682. The extra grouping text the worker kept is true of console.mjs:669-675.
- **D-7: met.** recording.mjs:34-41: the four failure texts are byte-equal to run 1's lines 73-76. e2e/README.md:801-803.
- **D-8: met.** MANUAL-WALKTHROUGH.md:1906-1907.
- **Amendment 9 item 2 (O3): met.** stepRecorder.ts:82 and :85 give both strings byte-equal to the human's words (directive, line 10). The R2 test is at stepRecorder.test.ts:62, and its failure was observed.

## New findings

### Correctness (blocking; only the words block)

**NC-1. An untrue limit claim.**
- **Where:** protocol/skp/SKP-V0.md:1266, the Bounds item's second sentence. It is the worker's own words (its list, item 2), not the human's wording.
- **What the sentence says:** a text of more than 4,096 bytes is refused.
- **What the code does:** the header's `admission.crs_assertion.definition_json` is a text the reader accepts up to 65,536 bytes (kernel/src/dataset_ref.rs:603-608; engine/src/crs.rs:40). A first step for an open with an asserted definition of 4,097 to 65,536 bytes is therefore written, not refused.
- **Reachability:** asserting a CRS with a long definition is ordinary use (§31(c)), so this blocks.
- **Replacement words** (§31(d): the worker applies them with no re-gate, and the PR body lists them):

```text
A line with a member past a bound the reader holds (for example a CRS identifier of more than 4,096 bytes, or more than 1,024 geometry types) is refused `skp.session_history_unwritable` and not written, because the reader stops at the first line it refuses (ADR-036 §9).
```

- **Clause check:**
  - *A CRS identifier of more than 4,096 bytes is past a bound the reader holds:* holds.
    - In the step: `TEXT`, which is 4,096 bytes (session_history.rs:500, :529, :591).
    - In the header: `MAX_REF_STRING_BYTES`, which is 4,096 bytes (dataset_ref.rs:45, :602).
  - *More than 1,024 geometry types is past a bound:* holds. The list allows `MAX_ITEMS` entries (:501, :601).
  - *Refused `skp.session_history_unwritable`:* holds (:289-300).
  - *Not written:* holds.
    - Step: checked at :187 before :188. Test :517 reads back the header alone (:536-540).
    - Header: checked at :215 before the folder. Test :551 finds the store empty (:579-582).
  - *The reader stops at the first line it refuses:* holds (:821-829).

### Evidence

No findings.
- The new tests' mutations were observed by the worker at 426609d9. The later commits touch none of the mutated lines.
- Run 4 re-made the four recording mutations at 10173747.
- R2's mutation was observed at d2501969.
- S5d's race is on main at the base (run 4b) and is not this round's.

### Documentation (must-fix before the merge; no re-gate; none is the human's wording)

**ND-1. SKP-V0.md:1261, step (8), checks rules, not only bounds.**
- **Fix:** replace `its members against the bounds the reader holds` with `its members against the rules the reader holds`.
- **Clause check:** `reader_accepts` runs the reader's whole member check, which covers closed key sets, words and states, not only bounds (:296-298, :926-942). K1's mutation (a missing member) and K12's (a provenance word) are refused by it, as the worker observed.

**ND-2. S1's expected failure is no longer true.**
- **Where:** kernel/tests/session_history.rs:237. The round's check makes the comment untrue: the opacity of 1.5 is no longer recorded, because the reader's `fillOpacity` rule (`Num(1.0)`, :558) refuses it.
- **Replacement words:**

```text
/// RECORDED MUTATION: the `parse` call is removed. Expected failure: the opacity of 1.5 passes the
/// style check, the record is made, and the writer's check against the reader's rules refuses the
/// step `skp.session_history_unwritable`, so this test fails at its code assertion.
```

- **Clause check:**
  - `style_params` without `parse` returns `Ok` (:404-411);
  - `create` succeeds (:173);
  - :187 refuses at `$.step.intent.params.value` (:558, :720-722);
  - the test's assertion at :260 then fails.

**ND-3. S2's expected failure is no longer true, for the same reason.**
- **Where:** kernel/tests/session_history.rs:268-269.
- **Replacement words:**

```text
/// **RECORDED MUTATION** for the lowercase rule: it is removed. Expected failure: `#ABCDEF` passes
/// the renderer's own `parse`, which accepts capitals, and the writer's check against the reader's
/// rules refuses the step `skp.session_history_unwritable`, since the reader takes a colour only as
/// lowercase hex; this test fails at its code assertion.
```

- **Clause check:**
  - `COLOUR` is `Hex("#", 6)`, which requires lowercase hex (:532, :674-675, :682-683);
  - the refusal comes at :187;
  - the assertion at :279 fails.

**ND-4. A sentence in console.mjs no longer describes the class-C table.**
- **Where:** frontends/shell/e2e/console.mjs:596-597, the sentence saying the five style rows left the class-C table. This comment was approved as committed (Amendment 7 item 1), so I do not reword it; add one sentence after it.
- **Added sentence:**

```text
Since correction round 1 (Amendment 8), one of them, `style.resetToDefault`, is back in the class-C table for a Reset that changes nothing; its owner names docs/03, not ADR-022, and no style edit writes it.
```

- **Clause check:**
  - the row and its owner: surfaceRegistry.ts:187-194;
  - when the row is written: App.tsx:1915;
  - CLASSC' fills a colour, so `source` is undefined (StylePanel.tsx:105) and no row is written.

**ND-5. The PR body (the custodian's).**
- List the new class-C statement for the human's P6 sight.
- List the words applied in the round under §31(d): the worker's own words, items 1-11, and NC-1's and ND-1 to ND-4's once applied.

## The new console statement (P6, class C, `style.resetToDefault`)

- **True of the code.** The row is written only when a Reset finds no property different from the last committed style (App.tsx:1914-1915). In ordinary use that equals the shown style:
  - a range commits on release or a key step;
  - the Windows colour dialog is modal and commits on close;
  - the view's style changes only through `handleStyleChange` (workspaceState.ts:144).
- **What it says is true:** nothing is enqueued (:1918), and no SKP command sets a style.
- **The operator-text rule (round 7):** it holds. The shell, as owner, states its own fact, that no step was sent. It states no consequence that belongs to another module.
- **ADR-006 and principle 4:** a no-op is shown, not hidden. The row makes no undo claim, and a Reset that changes the style shows its class-A `record_step` rows instead.
- **Registry and completeness:** surfaceCompleteness.test.ts:263-273 keeps its purpose (no style edit stays in class C) and its mutation, which was observed.
- I give no new words.

## Other checks

- **ADR-036 §9 against the writer.** Every rule the reader applies to a line the writer builds is checked before that line is written:
  - member rules: :187 and :215;
  - line and history ceilings: :89-97, the same as the reader's at :813-817 and :850-856;
  - the closing LF: :98;
  - NUL, duplicate keys and UTF-8: the canonical text, built from fixed keys, with control characters escaped;
  - the chain: :183 and :189, proven by K4 and by run 4's REC-CHAIN.
  - Holds.
- **The seam rule.** The writer calls the reader's own functions. `onCommit`'s `source` has a product caller on both sides. Holds.
- **Literal at session_history.rs:245-247 (the custodian's question):** it is not a defect in the bytes. The Rust reference's input format turns CRLF into LF before tokenizing, so the byte written is one LF under any checkout, and `cargo fmt --check` passed. Writing `+ "\n"` would read better (optional; behaviour unchanged).

## Notes (non-blocking)

- **N-a.** U7's test name claims the worst case fits. With 1,024 geometry types of 4,096 bytes each, a step line does not fit. The round's comment (:1270-1271) states what happens then, but the name was untrue before the round, so it is out of scope.
- **N-b.** e2e/README.md:803's first sentence repeats :801 (it came from my D-7 words). Optional tidy.
- **N-c.** The recording.mjs header could add run 4's re-observation at 10173747, where two anchors moved. Optional.

## §8, the round's lines

1. Pass: every check comes before the write (:187, :215), and there is no buffer.
2. Pass: no path enters the header or a step. The G2 comment (no_generation…rs:799-805) is true.
3. Pass: no restore, undo or replay; the Reset row makes no undo claim.
4. Pass: no wire change. A code is reused; the doc and cell changes are text only.
5. Pass: no scope action and no feature id.
6. Pass: no ADR is edited in the round. ADR-022 is pending the human's route.
7. Pass: kernel messages state kernel facts; the shell's statement states the shell's facts.
8. Pass: no `LOCALAPPDATA` in product code.
9. Pass: no new `pub` item.
10. Pass: no lock file and no data-plane file in the round.
11. Pass: style steps come only from the native `change` and from Reset.
12. Pass: no perf claim.
13. Pass:
    - §7 is class 8 and not edited, by the human's direction;
    - the Reset row was ordered by Amendment 8 before its code;
    - no `verify-mutation` run is called an observation;
    - no test text is pinned at a branch commit.
14. Pass: the O3 strings, the run 1 texts in recording.mjs, and the worker's own words as listed are byte-equal to their sources.
15. Pass: D-2.
16. Not checked: this is the custodian's dispatch record.

Relevant files:
- C:/dev/wt/1b/protocol/skp/SKP-V0.md
- C:/dev/wt/1b/kernel/src/session_history.rs
- C:/dev/wt/1b/kernel/tests/session_history.rs
- C:/dev/wt/1b/frontends/shell/e2e/console.mjs
- C:/dev/wt/1b/frontends/shell/src/App.tsx
- C:/dev/wt/1b/frontends/shell/src/console/surfaceRegistry.ts
- C:/dev/wt/1b/docs/adr/ADR-022-style-v0-as-the-single-style-model.md
