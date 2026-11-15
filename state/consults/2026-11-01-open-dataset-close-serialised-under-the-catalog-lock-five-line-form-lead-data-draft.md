*Custodian's filing note (2026-11-01): lead-data's read-only draft of the five-line form for `open-dataset-close-serialised-under-the-catalog-lock`, the filler queue's entry 10 (S3), read at main 7591cdad (dispatched 2026-11-01T03:53:34Z by the main transcript, its prompt equal to its brief by script). Its form is not committed: its OPEN-1, the evidence route, is the choice its placed PLAN node settles with the human first, so it waits for the human's ruling; the drafting agent's own blocking question. The run 03:53:50Z to 04:04:56Z by its transcript (Read 32, Grep 26, Glob 1; no write tool; no call outside the repository). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is ee31eb1805e654fda4ee36d5d04e2d8e1aa532bffad1abfce46d02c73de04520.*

---

Draft: open-dataset-close-serialised-under-the-catalog-lock five-line form, lead-data

I read the main checkout, which the brief's status snapshot shows on main at 7591cdad with no tracked change. I ran no git command, so that commit is the brief's, not something I confirmed. I have no shell, so this report has no sha256, and I ran no cargo, test or verify script. Every cite is `path:line @ 7591cdad`. Text in quotation marks is byte-copied from the file named beside it; everything else is my own words.

**Size, settled first (§21c, governance/AUTONOMY.md:349-357 @ 7591cdad).** Whether it fits depends on the evidence route (OPEN-1):
- (C), recommended: about 124 lines in 2 files. It fits, declared at 145.
- (B), proof by reading alone: about 84 lines in 2 files. It fits.
- (A), a threaded test: about 165 lines or more. It does not fit, so (A) means the full form, which is the human's route.

The lines below are written for (C).

```
Authority: PLAN node `open-dataset-close-serialised-under-the-catalog-lock` (governance/PLAN.yaml:3406-3422 @ 7591cdad), generation 1, status ready, placed S3 as filler entry 10 by the human's ruling of 2026-10-26 (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:28 @ 7591cdad; state/FILLER-QUEUE.md:27 @ 7591cdad), from the fallback in the human's direction for entry 5b (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:25 @ 7591cdad); the filler rule, AUTONOMY §36 (governance/AUTONOMY.md:692 @ 7591cdad): a five-line form under §21c, the reviewer and the architect from dispatch, §25 (e) set aside; the windows are the ones entry 5b's form leaves open (governance/forms/kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md:10 @ 7591cdad, and its notes 1 and 3 at :19-45 and :65); the evidence route is OPEN-1's; the reuse index found no prior art for "catalog lock close open race" (exit 1, the read-only private clone at 89bbac37), a miss noted here.
Scope: 2 files: kernel/src/skp.rs (in `SkpHost::open_dataset`, both arms' admission from the check through the `OpenRecord`'s insert, the admission comment and `LatchState`'s lock-order doc; in `SkpHost::close_dataset`, steps 3 and 4 under the catalog's write guard, one record removal after them, and its two ordering comments; in the `#[cfg(test)]` module `ticket_drop_under_lock_regression`, one new test and the doc comments of `a_close_during_open_admission_refuses_the_open_and_mints_no_generation` and `a_close_drops_its_watch_before_it_returns`); protocol/skp/SKP-V0.md (the source comment under §1's `open_dataset` refusal sentence only; the human's sentence is unchanged and §8 gets no note); declared line budget 145 (insertions plus deletions, tests and comments counted, governance/AUTONOMY.md:357 @ 7591cdad); this form exempt; kernel/src/lib.rs is not edited (`Catalog`'s existing private `lock_read` and `lock_write` are called from skp.rs); no line of `GenerationRegistry`, `StreamRegistry`, `viewport_query`, `describe` or the sink changes; no existing test's assertions change.
Change: `open_dataset`, in both arms, takes the catalog's read guard after the latch's signal refusal and holds it from a check that the catalog still holds the name (refusing as `skp.unknown_dataset` with the existing constructor, before any mint, the catalog guard and then the latch dropped before the watch) through the mint and the `OpenRecord`'s insert; `close_dataset` holds the catalog's write guard across `forget_dataset` and the name's removal (the removed `Arc<Dataset>` dropped after release), then removes, and drops after release, any `OpenRecord` an admission inserted after its first step; so a close lands wholly before an admission's check or wholly after its insert, and once `close_dataset` returns no generation, record or catalog entry for the name remains.
Tests+mutation: a_record_inserted_during_a_close_is_removed_before_the_close_returns (new, kernel/src/skp.rs, same module: at close-races' drop point, a retired `Pending` ticket's `RunOnDrop` after `cancel_all_for_dataset` releases its guard, the test inserts an `OpenRecord` carrying a `FlagWatch` for the closing name; after `close_dataset` returns `Ok`, the name has no record and that watch's flag is set); M1: delete the record removal after step 4, and it fails at its no-record assertion; observed but not registered, M-T2: delete step 0's `watches` removal, and `a_close_drops_its_watch_before_it_returns` passes (the late removal masks it) while `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` fails at `the close removed the record`, recorded in T2's doc; unchanged and re-run as regression: a_close_during_open_admission_refuses_the_open_and_mints_no_generation, CR1 to CR4, R2, T1, T2, E7, E8; the windows no deterministic seam reaches (W1, W2 and W3's open half) are proven by reading under OPEN-1, each with a reading mutation the form names and the gates check, none claimed as observed; each observed mutation is applied, the test run, the failure recorded with its commit in a `RECORDED MUTATION:` doc line, and reverted.
Out-of-scope: ADR: not touched (ADR-035 Decision 4's mint per successful open and its Note 2026-09-25 are read, not changed: a refused open mints nothing); security: not touched (`DatasetHandle`'s CSPRNG minting is unchanged; no exposure surface); wire: no literal, code, member, message or fixture changes and `skp/0.12` stays; the refusal SKP-V0 §1's existing sentence words now also comes from the ChecksOnly arm, and only its source comment changes; guarantee: touched: `open_dataset`'s admission and the locks `close_dataset` takes change in a function close-races governs (§2c's step order is kept; its last two steps now run under one catalog write guard, and one record removal follows them); close-races §1 claim (i) now holds in every interleaving by reading; the source-watcher form's watch-lifetime claim holds except in W3's interleaving (OPEN-3), which the product cannot reach; the five-line form stands under §36, which sets §25 (e) aside.
```

## Notes (mine)

### 1. Size
| Part | Counted lines (my estimate) |
|---|---|
| `LatchState` lock-order doc, rewritten | about 17 |
| The admission comment at kernel/src/skp.rs:1187-1190 | about 4 |
| Watching arm (5b's check moved under the read guard, two drops) | about 17 |
| ChecksOnly arm (the check, the refusal, the drop) | about 9 |
| `close_dataset` (write section, late removal, two comments) | about 24 |
| New test, its doc and M1 | about 40 |
| 5b test doc (its open-windows sentence) and T2 doc (M-T2) | about 11 |
| SKP-V0 source comment | about 2 |
| **Total** | **about 124, in 2 files** |

- Under (B), drop the test row: about 84, so declare 110.
- Under (A), a threaded open/close loop with joins, invariant checks and its disclosure: about 70 to 90 lines on top of the product 71 and the docs, so 160 or more. That is past §21c.
- An overrun mid-piece is class 6 (docs/PREREGISTRATION-TEMPLATE.md:125-131 @ 7591cdad), and Scope is not edited.

### 2. The windows: all three are still open at 7591cdad after 5b
- **W1: a close's forget between the open's check and its mint.**
  - The open's path: Watching arm, latch at kernel/src/skp.rs:1193 @ 7591cdad; `resolves_unchanged` at :1208; 5b's check at :1250, a `Catalog::get` whose read guard is released on return (kernel/src/lib.rs:237-239 @ 7591cdad); the mint at kernel/src/skp.rs:1256-1258.
  - The close's path: step 0 at :1579-1584; the check at :1585; `begin_close` at :1596; `cancel_all_for_dataset` at :1598; `forget_dataset` at :1603, which clears `live` and `closing` (:827-837); `catalog.remove` at :1605.
  - Interleaving: check → forget → mint → remove. Afterwards `live` holds a name the catalog lacks. That breaks close-races §1 claim (i) (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:80 @ 7591cdad) and its falsification second bullet (:272). It is 5b's note 1 case O-between-C4-and-C5, made wider.
- **W2: the ChecksOnly arm.**
  - It has no catalog check (kernel/src/skp.rs:1273-1305).
  - A close running after the catalog insert (kernel/src/lib.rs:233) and before the mint (kernel/src/skp.rs:1289-1291) leaves a generation, and then a record (:1294-1303), for a name the catalog no longer holds.
- **W3: the record gap.**
  - Both arms drop the latch (:1260, :1293) before inserting the `OpenRecord` (:1261-1270, :1294-1303), and hold no guard in between.
  - A close running whole in that gap finds no record at step 0, forgets and removes, and the insert then leaves a record (in the Watching arm, an armed watch). The open returns `Ok`.
  - A later close of the name releases it at step 0 and refuses at :1585.
- **Not reachable in the shipped app.**
  - The handle is 16 bytes from the OS CSPRNG (protocol/skp/src/v0/handles.rs:19-23 @ 7591cdad), minted inside the open (kernel/src/skp.rs:1116) and returned only on success (:1307-1310).
  - `Catalog::names` (kernel/src/lib.rs:252-254) has no product caller. Its only hits are in the test module (kernel/src/skp.rs:4375, :5082), plus a projection's own `names()` at kernel/src/publish/mod.rs:530.

### 3. The shape and the lock order (OPEN-2)
- **The locks:**
  - L, the per-open latch (:1129);
  - C, the catalog's `RwLock` (kernel/src/lib.rs:128-131), taken only by `Catalog`'s methods (:163-168, :204, :233, :238, :249, :253);
  - G, `GenerationRegistry.inner` (kernel/src/skp.rs:437-439). It is a leaf: its methods never call out;
  - W, `watches` (:1053). A record is always dropped after release (:1579-1584).
- **Today's nestings:** only L→G, at admission. The sink drops L before G and T (:1149, :1170). Every other catalog taker takes C alone and releases it:
  - `describe` (:1315-1318);
  - `viewport_query_resolve` (:1408-1411);
  - `close_dataset` (:1585, :1605);
  - `record_step` (kernel/src/session_history.rs:152-156 @ 7591cdad);
  - `create_from_raw_params` (kernel/src/lib.rs:416-419);
  - the open's refusal paths (kernel/src/skp.rs:1216, :1286), after L is dropped;
  - the shell's `host.catalog().get` calls (frontends/shell/src-tauri/src/commands.rs:296-299, :548-551 @ 7591cdad) and pool_poll.rs:193.
- **S1 (recommended) adds** L→C(read)→G and C(read)→W in the open, and C(write)→G in the close. G and W stay leaves, and nothing takes C while holding G, W or T. So the order is acyclic: L, then C, then G or W.
- **Three placement constraints the gates should check:**
  1. The read guard is taken after `resolves_unchanged` and after the signal refusal. 5b's test runs a real close inside `resolves_unchanged` (:5079-5088). If the open already held C(read) there, the close's C(write) on the same thread would deadlock. The signal refusal also takes C(write) at :1216 and :1286.
  2. The write guard spans only forget and remove, never `cancel_all_for_dataset`. CR2 and E7 run a racing call at that drop point on the close's own thread (:4410-4415, :4504-4517), and `viewport_query` takes C(read).
  3. No thread takes C(read) twice. std's `RwLock` priority policy is OS-dependent, and nothing here relies on it.
- **The removed `Arc<Dataset>`** is dropped after release, in the shape the catalog's own note names (kernel/src/lib.rs:195-196).
- **What changes in a function close-races governs:** §2c's order (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:138-148 @ 7591cdad) is kept as the tree has it after the unknown-keeps-openrecord swap. Its last two steps now run under one guard, and a record removal follows them. Its §8 item 5 (:300) is not hit, because nothing is reordered.
- **S2** reorders §2c (remove before forget). The close side shrinks to one moved line, but that is exactly what §8 item 5 names, and it changes §2c's "the name goes last" reading (kernel/src/skp.rs:1604). It still needs the open's read guard and the late removal.
- **S3** puts a `Catalog` method in kernel/src/lib.rs, which `cut/b2-piece-1c-save-and-reopen` edits. Rule (00) would then skip the piece at dispatch until 1c merges.

### 4. The evidence (OPEN-1)
- **No deterministic seam reaches W1 or W2, or W3's open half, at 7591cdad.**
  - The only test-run code inside admission is `arm()`, before the insert, and `resolves_unchanged`, before the check.
  - No test code runs between the check and the mint (:1250 to :1256), or between the insert and the ChecksOnly mint, or between :1260 and :1261.
  - The close's only deterministic instant is close-races' drop point (governance/forms/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:205-209), which comes before forget.
  - The open cannot be aimed at a closing name, because it mints a fresh one.
- **The close half of W3 has one seam:** at that drop point, after step 0 and before the write section, a test can place an `OpenRecord` in `watches` in-crate. That is test (C). It writes private state where close-races' §4 (iv) only reads it (:211), so the gates should rule on it.
- **Precedent for a proof at reading level:** close-races' own may-not-claim for a window with no product interposition point (:88).

### 5. Tests and mutations
- **The new test and M1, M-T2, and the regression set** are as the Tests+mutation line states.
- **Under reading** (named for the gates; none observed):
  - R-M2: 5b's check moved back outside the read guard reopens W1.
  - R-M3: the write guard released between forget and remove reopens W1.
  - R-M4: the ChecksOnly check deleted reopens W2.
  - R-M5: the read guard dropped before the record's insert reopens W3 (the insert can then follow the late removal).
- **Placement:** read guard taken before `resolves_unchanged` hangs 5b's test. It is stated for the gates, not run, because no test has a timeout.
- **Prediction:** 5b's test passes unchanged. Its close runs before the read guard, and the late removal finds nothing.
- **Invalidator:** any other kernel test fails. In particular, a source_watch_ordering test that asserts the watch is dropped before forget.

### 6. What a user sees, and the Platform item
- **The user sees nothing.** Every window is unreachable (note 2). No new string; the existing message is reused (P6).
- **No figure is claimed** for the added guard (docs/08, ADR-018).
- **No KNOWN-LIMITATIONS item exists for this, and none is owed.**
- **Platform:** not an OS-dependent feature, so the template's R3 section (docs/PREREGISTRATION-TEMPLATE.md:177 @ 7591cdad) is not required. The one OS-dependent thing, std's `RwLock` policy, is relied on by nothing (note 3). The kernel suite runs on both L1 entries.
- **SKP-V0's source comment:**
  - Today (protocol/skp/SKP-V0.md:55 @ 7591cdad) it states both windows are not refused, so it becomes false.
  - My words for it: `<!-- The refusal above is made in SkpHost::open_dataset's Watching and ChecksOnly arms, at one check under the catalog's read guard, held through the mint and the OpenRecord's insert; close_dataset holds the catalog's write guard across forget_dataset and the name's removal, so a close lands wholly before the check or wholly after the insert. Neither interleaving is reachable in the shipped app: the handle is minted from the OS CSPRNG and returned only by this open, and Catalog::names has no product caller. -->`
  - It is not the human's wording; per 5b's Amendment 1 (:200), it is the reviewer's and the architect's.
  - The human's sentence at :54 stays true and is untouched. I see no §8 note owed (5b's note still describes it), and the gate checks that reading.
- **Owner's index:** no kernel/README.md line is owed by the index rule. The form and the new pin are mine to add after merge.

### 7. Rule (00), path by path
This piece's paths: kernel/src/skp.rs and protocol/skp/SKP-V0.md, plus its form on main.

| In flight | Overlap |
|---|---|
| cut/b2-piece-1c-save-and-reopen | none in its kernel list. Contact only: it edits kernel/src/lib.rs, whose private `lock_read`/`lock_write` this piece calls, so a change there would show up at merge as a compile error. Its 6 non-kernel paths are not given: check protocol/. |
| cut/port-2-macos-l1-and-app-dirs | none in its kernel list; its 11 other paths are not given: check protocol/ |
| cut/b1-shell-half-pr-c | none (0 files) |
| #273, #272, #271 | none under kernel/; their paths are not given: check protocol/ |

Protocol/ has an at-most-one rule, so it has to be confirmed by `git diff --name-only origin/main...<branch>` at dispatch.

## OPEN items (each with my recommendation)
- **OPEN-1: the evidence route.**
  - (A) A threaded test, its nondeterminism disclosed. It fails no mutation by name reliably, breaks close-races' determinism precedent (:203, :296), and goes past §21c, so the full form.
  - (B) Proof by reading alone, at about 84 lines.
  - (C) Proof by reading plus the one deterministic test for W3's close half, at about 124 lines.
  - **I recommend (C).** If the gates refuse a private-state write from the drop point, fall back to (B).
  - **Red line?** Not on the list in state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 7591cdad, as I read it. But the placed node reserves the choice to the human: its summary at governance/PLAN.yaml:3421 @ 7591cdad says "its form settles with the human first". Whether item 4 reaches it is the blocking question below.
- **OPEN-2: the shape.** (S1) the write guard across forget and remove; (S2) §2c reordered; (S3) a `Catalog` method in lib.rs. **I recommend S1.** It changes a stated guarantee, so it comes to the custodian as a question. I do not read it as a red line.
- **OPEN-3: where the late removal sits.**
  - (a) After the write guard's release. The source-watcher claim (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:159 @ 7591cdad) then fails only in W3's interleaving, where `invalidate` after forget writes nothing and emits nothing (close-races §2a item 5).
  - (b) Inside the write section, before forget. This keeps :159, but joins a watch under the catalog's write guard in that interleaving.
  - **I recommend (a).** It is a guarantee item; I do not read it as a red line.
- **OPEN-4: T2's recorded mutation is masked by the late removal.**
  - (a) T2's doc gains M-T2's observed line, and T1 carries step 0's deletion.
  - (b) T2 gains a distinguishing assertion. That changes an existing test's assertions.
  - **I recommend (a).** Not a red line.

## Blocking questions
- Does the 2026-10-31 item 4 direction reach OPEN-1, which the placed node says "settles with the human first"? Or does OPEN-1 wait for the human until 2026-11-04?
- Do the guarantee changes (OPEN-2, OPEN-3) stand under §36 as the Out-of-scope line declares them?

## What I could not settle
- No run: the behaviour, M1, M-T2, the regression passes and the size are all predictions from reading.
- No sha256: the custodian expands the pins by script.
- I read no branch. Whether any branch in flight touches protocol/, and what 1c does to `Catalog`, are unknown to me.
- I did not read kernel/tests/source_watch_ordering.rs, so whether any test there pins that the watch is dropped before forget is unconfirmed (an invalidator in note 5).
- Report path (the custodian files it): C:/dev/spatial-ide/state/consults/2026-11-01-open-dataset-close-serialised-under-the-catalog-lock-five-line-form-lead-data-draft.md. No sha256 (no shell).
