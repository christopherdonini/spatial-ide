*Custodian's filing note (2026-10-25): the architect's read-only draft of the five-line form for `kernel-close-during-open-admission`, the filler queue's entry 5 (test only, S3), read at main f823614c. Entries 3, 4a and 4b were skipped at dispatch: 3 edits kernel/src/lib.rs, which 1c step 1 edits; 4a edits engine/src/dataset.rs, which #252 edits; 4b depends on 4a. #255, closed for the click, leaves the slot (state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md). The draft's OPEN-1 (how a test that pins a defect reads on main) goes to the human before the form is committed; its OPEN-2 (a fix node) is the custodian's. The run 09:49:35Z to 09:55:02Z by its transcript (Read 22, Grep 19, Glob 1; no write tool). Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is 958f5236bac435ec1261ca7e1d94b55f8633e06d2080893274d81ff97118e271.*

---

Drafted: kernel-close-during-open-admission, five-line form, architect

main @ f823614c. I read the main checkout at that commit. I have no shell, so this report computes no sha256. I ran no code either, so every claim about behaviour below comes from reading the code. Everything outside the five lines is in my own words unless marked otherwise. The report quotes no prose: names in backticks are code identifiers, not quotations.

## Draft

```
Authority: PLAN node `kernel-close-during-open-admission` (PLAN.yaml:3337-3353 @ f823614c), generation 2; filler queue entry 5, graded S3, test only (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:13 @ f823614c; state/FILLER-QUEUE.md:12 @ f823614c); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ f823614c): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; the finding is N1 of the 2026-09-30 drafting consult (state/consults/2026-09-30-close-dataset-unknown-architect-draft.md:45-50 @ f823614c); the reuse index found no prior art on either search (close during open race; catalog admission window), a miss noted here.
Scope: 1 file, kernel/src/skp.rs, inside the `#[cfg(test)]` module `ticket_drop_under_lock_regression` only; declared line budget 140 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ f823614c); this form exempt; no product line changes, and no existing test is changed or removed.
Change: adds one in-crate test that reaches the window between `SkpHost::open_dataset`'s catalog insert and its admission through a test-owned `ArmedWatch` whose `resolves_unchanged` runs a real `close_dataset` on the new handle, and asserts today's behaviour: the close returns Ok, the open still returns Ok and mints a generation carrying the reference it returns, for a name the catalog no longer holds; `describe` and `viewport_query` refuse that handle as `skp.unknown_dataset` with no ticket minted; nothing is emitted; and a second close refuses as `skp.unknown_dataset`, drops the watch and leaves that generation live.
Tests+mutation: a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds (new, kernel/src/skp.rs; predicted to pass at the base); M1: in `open_dataset`'s Watching arm, immediately before `SessionRef::mint()`, return `Err(SkpError::unknown_dataset(handle.as_str()))` when `self.catalog.get(handle.as_str())` is `None`, so the open is refused and the test fails by name at its expect on the open's result; observed by applying it, running the test, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment (ADR-035's mint rule and its Note 2026-09-25 are read, not changed); security: nothing ADR-020, ADR-009 or ADR-021 governs, and the CSPRNG handle minting that keeps the window out of the product's reach is unchanged; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no code or message text; guarantee: none changed, since no product line changes and every existing test keeps its text; the new test asserts, as today's behaviour in an interleaving the product cannot reach, a generation minted for a dataset whose close has already forgotten it, the kind of state round 22, item 1 calls the defect for a closing dataset (paraphrase), which kernel-generation-close-races declared outside its claims (`open_dataset` declared unchanged there); the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

## Notes (mine)

### 1. The test

**The window is real at f823614c (from reading the code; not yet run).**
- The catalog insert happens inside `Catalog::open_cancellable` (kernel/src/lib.rs:233 @ f823614c), which is called at kernel/src/skp.rs:1175-1177 @ f823614c.
- Admission then takes the latch (kernel/src/skp.rs:1191 @ f823614c) and calls `watch.resolves_unchanged()` (kernel/src/skp.rs:1206 @ f823614c).
- Only after that does it mint and insert the `OpenRecord` (kernel/src/skp.rs:1243-1258 @ f823614c), and it returns `Ok` at kernel/src/skp.rs:1295-1298 @ f823614c.
- `close_dataset` (kernel/src/skp.rs:1554-1595 @ f823614c) never touches the per-open latch.
- The only lock it takes that admission also uses is `generations`. Taking that lock while the latch is held follows the documented order, latch then generations (kernel/src/skp.rs:1002-1006 @ f823614c). So a close run from inside `resolves_unchanged` completes without deadlock.
- That close finds the catalog entry, so it does not refuse (kernel/src/skp.rs:1573 @ f823614c). It then runs `begin_close`, `cancel_all_for_dataset`, `forget_dataset` and `catalog.remove` on a name that has no generation yet.
- Admission then mints anyway (`mint_for_open`, kernel/src/skp.rs:574-593 @ f823614c, has no closing or catalog check) and returns `Ok`.
- The ChecksOnly arm (kernel/src/skp.rs:1261-1293 @ f823614c) has the same window but calls back into nothing inside it. The Watching arm's `resolves_unchanged` is the only re-entrant seam, which is the one the node names.

**Why the product cannot reach it.**
- The handle is 16 bytes from the OS CSPRNG (protocol/skp/src/v0/handles.rs:19-23 @ f823614c), and only this open returns it.
- `Catalog::names` (kernel/src/lib.rs:252-254 @ f823614c) has no product caller. A search for `names()` finds only tests in kernel/, and nothing in frontends/shell/src-tauri/src. The one hit in kernel/src/publish/mod.rs:526 @ f823614c is a projection's `names()`, not the catalog's.

**The seam, against the real interfaces.**
- `ArmedWatch` and `SourceWatchArm` (engine/src/watch.rs:39-50 and engine/src/watch.rs:67-69 @ f823614c), `SkpHost::catalog`, `close_dataset` and `DatasetHandle`'s `FromStr` (protocol/skp/src/v0/handles.rs:60-66 @ f823614c).
- No new `pub` item, hook, callback or `cfg(test)` branch in product code. This follows the close-races placement rule (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:211 @ f823614c) and its determinism rule: no sleep, no spawned thread, no timeout (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:203 @ f823614c).

**The shape** (mine, for the worker):
- `CloseOnAdmissionArm` returns `ArmOutcome::Watching` over a `CloseOnAdmissionWatch`. The watch holds three things:
  - a `Weak<SkpHost>`, from `Arc::new_cyclic`. It is weak because the host owns the `OpenRecord` that owns the watch, and a strong reference would be a cycle;
  - a result cell, the CR2 pattern at kernel/src/skp.rs:4490-4500 @ f823614c;
  - a drop flag, the `FlagWatch` pattern at kernel/src/skp.rs:4923-4934 @ f823614c.
- On its first call, `resolves_unchanged` does the following, then returns `true`:
  - reads `host.catalog().names()` (exactly one entry, because the catalog is fresh);
  - records whether the name is in the catalog and `generations().live_generation(name)`, which is expected to be `Err(NotLive::NotOpen)`. This proves the call is after the insert and before the mint;
  - runs `host.close_dataset` on that name and stores the result in the cell.
- The test uses the module's `fixture`, `close_req` and `holds_a_record` helpers (kernel/src/skp.rs:3428-3430, kernel/src/skp.rs:4954-4966 @ f823614c). It asserts, in order:
  1. the cell's pre-state (in the catalog, `NotOpen`) and the close's `Ok` with `cancelled_streams == 0`;
  2. `open_dataset` returns `Ok` (the expect that M1 fails), and its handle equals the closed name;
  3. `catalog().get(name)` is `None`;
  4. `live` holds `name` with `open.session` (read in-crate, the K15 precedent), the host holds a record, and the watch is not dropped;
  5. `describe` and `viewport_query` on the handle both return `skp.unknown_dataset`, and the ticket map is empty;
  6. `try_recv` is empty;
  7. a second close returns `skp.unknown_dataset`, the record is gone, the watch is dropped, and `live` still holds `name`.

  Item 7 relies on the earlier piece's watch-release ordering (kernel/src/skp.rs:1567-1572 @ f823614c), which is unchanged.

**How it reads.**
- It is an asserted-today test. It passes on main and pins the defect: it is not failing by design, and not `#[ignore]`d.
- Its name states the defect. Its doc comment should say four things:
  - it pins today's behaviour, a known gap the product cannot reach;
  - M1 is the fix shape;
  - a fix flips it, and it is then replaced under the fix's own form;
  - it claims no property.
- Why not `#[ignore]`: in kernel/ and engine/ that attribute is used only for heavy or fixture-gated harnesses (for example kernel/tests/slice_budgets.rs:474 @ f823614c). An ignored known failure would be a new category in this tree, and an ignored test cannot carry an observable mutation on CI.
- This is a claim the human must see (OPEN-1).

### 2. The mutation

- M1 is in the Tests+mutation line. It is deterministic and runs on the test's own thread.
- It is also the smallest fix shape. That makes the record show plainly that the test is a pin which a fix breaks by name.

### 3. The size (AUTONOMY.md:350-351 and AUTONOMY.md:357 @ f823614c)

| Part | Estimated changed lines (mine) |
|---|---|
| The watch and arm, with their impls and doc | about 40 |
| The test's doc comment, with the scenario, the reading and the M1 record line | about 20 |
| The test body | about 65 |
| **Total** | **about 125, in 1 file** |

- This is under the declared 140 and under §21c's limits of 150 lines and 8 files.
- No new dependency (`std::sync::Weak` is std), no exposure surface, no user-visible behaviour.
- An overrun is recorded as class 6, and the Scope line is not edited (AUTONOMY.md:345 @ f823614c).

### 4. Out-of-scope readings

- **ADR.** None is touched. The state the test asserts is ADR-035 territory: Decision 4's mint rule and its Note, which carries round 22, item 1 (docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:149-158 @ f823614c). Nothing in the ADR is edited.
- **Security.** None is touched. The handle's unguessability is what makes the window unreachable, and it is unchanged.
- **Wire.** None is touched. The test reads only the existing `skp.unknown_dataset`.
- **Guarantee.** Following the reading settled for governance-hash-grammar-shared, "touched" means changed, and nothing is changed. Whether the test touches a property under test:
  - Close-races claims (i) to (v) (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:79-84 @ f823614c) and its falsification (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:270-273 @ f823614c) describe the state once a close returns.
  - The inner close does return with no generation for the name. The mint comes after it, from `open_dataset`, which close-races declared unchanged (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:256 @ f823614c). So no existing claim is falsified as written.
  - A gate may read claim (i) as also covering the refusing second close in step 7. On that reading, the test asserts a counterexample to a stated property in an unreachable interleaving. That is the substance of OPEN-1, not a reason to hide step 7.
  - §36 sets round 25, item 2 (e) aside, so the five-line form stands either way, gated by the reviewer and the architect.

### 5. Rule (00), path by path

The piece's only path is kernel/src/skp.rs, plus the form on main.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none. Contact: it edits kernel/src/lib.rs, where `Catalog` lives, and the test calls `Catalog::names`. If 1c changes that API, the conflict shows up as a compile error at the merge of main, not as a shared path. |
| port-2 | none |
| #241 | none (its kernel paths are under publish/, permission/, bundle/ and bin/; kernel/README.md is not edited here) |
| #244, #249 | none (this piece edits no KNOWN-LIMITATIONS.md) |
| #252, #255 | none (engine/ only) |
| #256 | none (scripts/plan/ only) |

- Disjoint by path.
- Nothing under protocol/, so the at-most-one-protocol rule holds.
- These path lists are the brief's; I cannot read branches.

## OPEN items

**OPEN-1 (for the human): how a test that pins the defect reads on main.**
- (A) As drafted: assert today's behaviour whole, the live generation included (items 4 and 7), with the test named for the defect. The node's title becomes evidence, and a fix fails it by name (M1).
- (B) Assert only what is safe today (items 1, 2, 3, 5, 6 and item 7's watch release). Disclose the leaked generation in the doc comment only. Weaker: the title's "mints a generation" stays unproven, and about 8 fewer lines.
- (C) `#[ignore]` a test of the fixed behaviour. Not recommended, for the reason in note 1.
- **Recommendation: (A).** It is the only shape that proves what the node claims. The human should see, in the PR body, that main will carry a green test asserting a state of the kind round 22, item 1 calls the defect (paraphrase), in an interleaving the product cannot reach.

**OPEN-2 (custodian): a fix node.** Not designed here. M1's shape is the smallest candidate: refuse at admission when the catalog entry is gone. Proposing it is the custodian's call, at most as a filler-queue addition for the human to place.

## What I could not settle

- No run. "The window is real at f823614c" and "passes at the base" are read from the code, not observed. The worker's first run settles them.
  - If the inner close refuses, or the call hangs, my reading of the window is wrong, and the worker stops and returns before M1.
- One filler is in flight at a time (§36). #255, filler entry 2, is closed and waiting for the click. Whether that still counts as in flight for dispatch is the custodian's reading.
- The 2026-09-30 draft's line cites for N1 were made at 24224d5 and are historical pins. For the code, the tree at f823614c is authoritative, and its lines are the ones cited above.
